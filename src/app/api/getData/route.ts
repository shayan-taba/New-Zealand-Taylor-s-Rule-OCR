import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import * as csvParse from "csv-parse";

// Define the date after which values are projections
const projectionStartDate = new Date("2025-01-01");

// Inflation target range and mandate changes
const getInflationTargetData = (date: Date): {
  range: string;
  lower: number;
  upper: number;
  midpoint: number;
  mandate: string;
} => {
  if (date < new Date("1996-12-10")) {
    return { range: "0-2%", lower: 0, upper: 2, midpoint: 1.0, mandate: "Single" };
  } else if (date < new Date("2002-09-17")) {
    return { range: "0-3%", lower: 0, upper: 3, midpoint: 1.5, mandate: "Single" };
  } else if (date < new Date("2018-03-26")) {
    return { range: "1-3%", lower: 1, upper: 3, midpoint: 2.0, mandate: "Single" };
  } else if (date < new Date("2023-12-20")) {
    return { range: "1-3%", lower: 1, upper: 3, midpoint: 2.0, mandate: "Dual" };
  } else {
    return { range: "1-3%", lower: 1, upper: 3, midpoint: 2.0, mandate: "Single" };
  }
};

// Function to convert Excel date number to JS Date
const excelDateToJSDate = (date: number): Date => {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
};

// Function to parse the CSV file containing NIR data
const parseNIRData = (csvFilePath: string): Promise<Map<string, number>> => {
  return new Promise((resolve, reject) => {
    const nirDataMap = new Map<string, number>();

    const fileStream = fs.createReadStream(csvFilePath);
    const parser = fileStream.pipe(csvParse.parse({ columns: true, skip_empty_lines: true }));

    parser.on("data", (row: any) => {
      const dateStr = row["Date"];
      const nirValue = parseFloat(row["NIR"]); // Long-term NIR (% nominal)
      if (dateStr && !isNaN(nirValue)) {
        const parsedDate = parseDate(dateStr);
        if (parsedDate) {
          nirDataMap.set(parsedDate, nirValue);
        }
      }
    });

    parser.on("end", () => {
      resolve(nirDataMap);
    });

    parser.on("error", (error) => {
      reject(error);
    });
  });
};

const parseDate = (dateStr: string): string | null => {
  const [day, month, year] = dateStr.split("/").map(Number);
  if (day && month && year) {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }
  return null; // Invalid date format
};

// Calculate TaylorOCR and InertialOCR based on provided data
const a_i = 0.85;
const a_t = 0.15;
const a_pi = 0.5;
const a_y = 0.5;

const calculateTaylorOCR = (
  inflationRate: number,
  outputGap: number | null,
  longTermNominalNIR: number | null,
  targetInflation: number
): number | null => {
  if (outputGap === null || longTermNominalNIR === null) return null;
  return longTermNominalNIR + a_pi * (inflationRate - targetInflation) + a_y * outputGap;
};

const calculateInertialTaylorOCR = (
  previousOCR: number | null,
  inflationRate: number,
  outputGap: number | null,
  longTermNominalNIR: number | null,
  targetInflation: number,
  actualOCR: number | null
): number | null => {
  if (outputGap === null || longTermNominalNIR === null) return null;

  if (previousOCR === null) return actualOCR ?? null;

  return a_i * previousOCR + a_t * (longTermNominalNIR + a_pi * (inflationRate - targetInflation) + a_y * outputGap);
};

export async function GET() {
  try {
    // Load the Excel file
    const filePath = path.join(process.cwd(), "public", "mpsfeb25-data.xlsx");
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Select "Projections" sheet
    const sheet = workbook.Sheets["Projections"];
    if (!sheet) throw new Error("Sheet 'Projections' not found");

    // Convert sheet to JSON (array of rows)
    const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    // Identify column indices from row 7 (index 6)
    const headers: string[] = rawData[6] as string[];
    const dateIndex = 0; // Dates are in column 1 (index 0)
    const outputGapIndex = headers.indexOf("outputgap");
    const papcIndex = headers.indexOf("papc");
    const urateIndex = headers.indexOf("urate");
    const ocrIndex = headers.indexOf("ocr");

    if (outputGapIndex === -1 || papcIndex === -1 || urateIndex ==- -1) {
      throw new Error("Required columns not found in row 7");
    }

    // Load and parse NIR data from the CSV file
    const nirFilePath = path.join(process.cwd(), "public", "NIR.csv");
    const nirDataMap = await parseNIRData(nirFilePath);

    let prevOCR: number | null = null;

    // Extract data from row 8 onward
    const enrichedData = rawData.slice(7).map((row: any): any | null => {
      const dateStr = row[dateIndex];
      if (!dateStr) return null; // Skip empty rows

      const date = excelDateToJSDate(dateStr);

      const { range, lower, upper, midpoint, mandate } = getInflationTargetData(date);

      const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
      const isProjection = date >= projectionStartDate;

      const longTermNominalNIR = nirDataMap.get(date.toISOString().split('T')[0]) || null;

      const inflationRate = row[papcIndex] || 0;
      const targetInflation = midpoint;

      // Calculate Taylor and Inertial Taylor OCR
      const taylorOCR = calculateTaylorOCR(inflationRate, row[outputGapIndex] || null, longTermNominalNIR, targetInflation);
      const inertialOCR = calculateInertialTaylorOCR(prevOCR, inflationRate, row[outputGapIndex] || null, longTermNominalNIR, targetInflation, row[ocrIndex] || null);

      prevOCR = row[ocrIndex]; // Update prevOCR for the next row

      return {
        date: date,
        ocr: row[ocrIndex] || null,
        quarter,
        outputGap: row[outputGapIndex] || null,
        papc: row[papcIndex] || null,
        urate: row[urateIndex] || null,
        isProjection,
        longTermNominalNIR,
        mandateType: { range, lower, upper, midpoint, mandate },
        taylorOCR,
        inertialOCR,
      };
    }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    // Filter out projections
    const nonProjectionData = enrichedData.filter(entry => !entry.isProjection);

    return NextResponse.json({ success: true, data: nonProjectionData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
