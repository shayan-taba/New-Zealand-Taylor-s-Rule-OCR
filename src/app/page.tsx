"use client";

import { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Divider,
  AppBar,
  Toolbar,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DataEntry = {
  date: string; // YYYY-MM-DD
  quarter: string;
  outputGap: number | null;
  papc: number | null;
  isProjection: boolean;
  ocr: number | null;
  longTermNominalNIR: number | null;
  mandateType: {
    range: string;
    lower: number;
    upper: number;
    midpoint: number;
    mandate: string;
  };
  taylorOCR?: number | null;
  inertialOCR?: number | null;
};

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
  return (
    longTermNominalNIR +
    a_pi * (inflationRate - targetInflation) +
    a_y * outputGap
  );
};

const calculateInertialTaylorOCR = (
  previousOCR: number | null,
  inflationRate: number,
  outputGap: number | null,
  longTermNominalNIR: number | null,
  targetInflation: number,
  actualOCR: number | null // Added parameter for actual OCR
): number | null => {
  if (outputGap === null || longTermNominalNIR === null) return null;

  // If it's the first entry, use the actual OCR instead of the Taylor OCR for inertial calculation
  if (previousOCR === null) return actualOCR; // Use actual OCR for first entry

  // Otherwise, calculate the inertial OCR as usual
  const taylorOCR = calculateTaylorOCR(
    inflationRate,
    outputGap,
    longTermNominalNIR,
    targetInflation
  );

  return (
    a_i * previousOCR +
    a_t *
      (longTermNominalNIR +
        a_pi * (inflationRate - targetInflation) +
        a_y * outputGap)
  );
};

const generateGraphData = (data: DataEntry[]) => {
  const labels = data.map((entry) => entry.quarter);

  const ocrData = data.map((entry) => entry.ocr ?? 0); // Use 0 for undefined OCR values
  const taylorOCRData = data.map((entry) => entry.taylorOCR ?? 0); // Use 0 for undefined Taylor OCR values
  const inertialOCRData = data.map((entry) => entry.inertialOCR ?? 0); // Use 0 for undefined Inertial OCR values

  return {
    labels,
    datasets: [
      {
        label: "OCR",
        data: ocrData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Taylor OCR",
        data: taylorOCRData,
        borderColor: "rgba(255, 99, 132, 0.3)", // Slightly transparent red for Taylor OCR line
        backgroundColor: "rgba(255, 99, 132, 0.3)", // Slightly transparent red for Taylor OCR fill
        fill: true,
      },
      {
        label: "Inertial Taylor OCR",
        data: inertialOCRData,
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };
};

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startQuarter, setStartQuarter] = useState<string>(""); // Start quarter for the graph filter
  const [endQuarter, setEndQuarter] = useState<string>(""); // End quarter for the graph filter
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]); // To store filtered data
  const router = useRouter();

  // Function to convert a quarter string like "Q1 2025" into a numeric value for easier comparison
  const convertQuarterToNumeric = (quarter: string) => {
    const match = quarter.match(/(Q[1-4]) (\d{4})/);
    if (match) {
      const quarterNumber = match[1].charAt(1); // Extracts the number from "Q1", "Q2", etc.
      const year = parseInt(match[2], 10);
      return year + parseInt(quarterNumber, 10) / 10; // Converts "Q1 2025" to 2025.1, "Q2 2025" to 2025.2, etc.
    }
    return 0; // Return a fallback value if the format is incorrect
  };

  useEffect(() => {
    fetchData().then((result: any) => {
      console.log("Fetched Data:", result); // Log the raw fetched data

      const updatedData = result.map((entry: DataEntry) => ({
        ...entry,
        taylorOCR: null,
        inertialOCR: null,
      }));

      console.log("Updated Data with Default OCRs:", updatedData); // Log the updated data with default nulls for OCRs

      let prevOCR: number | null = null;

      const dataWithOCR = updatedData.map((entry: DataEntry, index: number) => {
        console.log(`Processing entry for ${entry.quarter}:`, entry); // Log the entire entry
      
        const targetInflation = entry.mandateType.midpoint;
        const inflationRate = entry.papc || 0;
      
        if (entry.outputGap === null || entry.longTermNominalNIR === null) {
          console.warn(`Missing values for ${entry.quarter}: outputGap or longTermNominalNIR`);
        }
      
        const taylorOCR = calculateTaylorOCR(
          inflationRate,
          entry.outputGap,
          entry.longTermNominalNIR,
          targetInflation
        );
        console.log(`Taylor OCR for ${entry.quarter}:`, taylorOCR); // Log the calculated Taylor OCR
      
        const inertialOCR = calculateInertialTaylorOCR(
          prevOCR,
          inflationRate,
          entry.outputGap,
          entry.longTermNominalNIR,
          targetInflation,
          entry.ocr
        );
        console.log(`Inertial OCR for ${entry.quarter}:`, inertialOCR); // Log the calculated Inertial OCR
      
        prevOCR = entry.ocr;
      
        return {
          ...entry,
          taylorOCR,
          inertialOCR,
        };
      });
      

      console.log("Final Data with OCR Calculations:", dataWithOCR); // Log the final data with OCRs added

      setData(dataWithOCR);
      setLoading(false);

      const firstQuarter = dataWithOCR[0]?.quarter || "";
      const lastQuarter = dataWithOCR[dataWithOCR.length - 1]?.quarter || "";
      setStartQuarter(firstQuarter);
      setEndQuarter(lastQuarter);
      setFilteredData(dataWithOCR);
    });
  }, []);

  useEffect(() => {
    // Convert start and end quarters to numeric values
    const startNumeric = convertQuarterToNumeric(startQuarter);
    const endNumeric = convertQuarterToNumeric(endQuarter);

    const filtered = data.filter((entry) => {
      const entryNumeric = convertQuarterToNumeric(entry.quarter);

      return entryNumeric >= startNumeric && entryNumeric <= endNumeric;
    });

    setFilteredData(filtered);
  }, [startQuarter, endQuarter, data]);

  const graphData = generateGraphData(filteredData);
  console.log("Graph Data:", graphData); // Log the data being passed to the graph

  return (
    <Container>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ display: loading ? "none" : "block" }}>
        <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
          Results
        </Typography>

        {/*<Box mb={4}>
          <Typography variant="h6" paragraph>
            <strong>Taylor Rule Equation:</strong>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
            i<sub>t</sub> = π<sub>t</sub> + r<sub>t</sub>
            <sup>r</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub>
            <sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" paragraph>
            <strong>Inertial Taylor Rule Equation:</strong>
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
            i<sub>t</sub> = a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [r
            <sub>t</sub>
            <sup>n</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub>
            <sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>]
          </Typography>
        </Box>*/}

        {/* Quarter Picker Section */}
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            label="Start Quarter"
            select
            value={startQuarter}
            onChange={(e) => setStartQuarter(e.target.value)}
            fullWidth
          >
            {data.map((entry) => (
              <MenuItem key={entry.quarter} value={entry.quarter}>
                {entry.quarter}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="End Quarter"
            select
            value={endQuarter}
            onChange={(e) => setEndQuarter(e.target.value)}
            fullWidth
          >
            {data.map((entry) => (
              <MenuItem key={entry.quarter} value={entry.quarter}>
                {entry.quarter}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Graph Section */}
        <Box mb={4}>
          <Line
            data={graphData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  title: {
                    display: true,
                    text: "Nominal OCR (%)", // Axis label
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
              },
            }}
            height={400}
          />
        </Box>

        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quarter</TableCell>
                <TableCell>Quarterly Average OCR</TableCell>
                <TableCell>Taylor Rule Optimal OCR</TableCell>
                <TableCell>Inertial Taylor Rule Optimal OCR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.date}>
                  <TableCell>{entry.quarter}</TableCell>
                  <TableCell>
                    {entry.ocr ? entry.ocr.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>
                    {entry.taylorOCR ? entry.taylorOCR.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>
                    {entry.inertialOCR ? entry.inertialOCR.toFixed(2) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Loading Spinner for Data */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Footer */}
      <Footer />
    </Container>
  );
}
