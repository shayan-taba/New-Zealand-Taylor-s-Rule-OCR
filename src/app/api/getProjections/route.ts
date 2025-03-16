import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import * as csvParse from "csv-parse";

// Define the date after which values are projections
const projectionStartDate = new Date("2025-01-01"); // Change manually when updating data

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
            console.log(row)
            const dateStr = row["Date"];
            const nirValue = parseFloat(row["NIR"]); // Long-term NIR (% nominal)
            if (dateStr && !isNaN(nirValue)) {
                // Parse the date (assuming MM/DD/YYYY format)
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
        // Create a date object using UTC to avoid local timezone discrepancies
        const date = new Date(Date.UTC(year, month - 1, day));
        return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
    }
    return null; // Invalid date format
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
        const outputGapIndex = headers.indexOf("outputgap"); // % potential output
        const papcIndex = headers.indexOf("papc"); // Annual % Change
        const ocrIndex = headers.indexOf("ocr"); // Nominal % Average of Quarter 

        if (outputGapIndex === -1 || papcIndex === -1) {
            throw new Error("Required columns not found in row 7");
        }

        // Load and parse NIR data from the CSV file
        const nirFilePath = path.join(process.cwd(), "public", "NIR.csv");
        const nirDataMap = await parseNIRData(nirFilePath);
        console.log(nirDataMap)

        // Extract data from row 8 onward
        const extractedData = rawData.slice(7).map((row: any): {
            date: Date;
            quarter: string;
            ocr: number | null;
            outputGap: number | null;
            papc: number | null;
            isProjection: boolean;
            longTermNominalNIR: number | null; // Add longTermNIR field
            mandateType: object | null;
        } | null => {
            const dateStr = row[dateIndex];
            if (!dateStr) return null; // Skip empty rows

            // Convert Excel date number to JS Date
            const date = excelDateToJSDate(dateStr);

            // Get the inflation target range, midpoint, and mandate type based on date
            const { range, lower, upper, midpoint, mandate } = getInflationTargetData(date);

            // Format the quarter and determine if it's a projection
            const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
            const isProjection = date >= projectionStartDate;

            // Get the Long-term NIR value for this date from the CSV data
            const longTermNominalNIR = nirDataMap.get(date.toISOString().split('T')[0]) || null;
            console.log("gotten", longTermNominalNIR, date.toISOString().split('T')[0], date)
            return {
                date: date,
                ocr: row[ocrIndex] || null,
                quarter,
                outputGap: row[outputGapIndex] || null,
                papc: row[papcIndex] || null,
                isProjection,
                longTermNominalNIR: longTermNominalNIR,
                mandateType: { range, lower, upper, midpoint, mandate },

            };
        }).filter((entry): entry is NonNullable<typeof entry> => entry !== null); // Ensure nulls are removed

        // Filter out projections
        const nonProjectionData = extractedData.filter(entry => !entry.isProjection);

        return NextResponse.json({ success: true, data: nonProjectionData });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
