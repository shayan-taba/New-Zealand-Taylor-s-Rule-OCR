"use client";
import jsFileDownload from "js-file-download";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Download } from "@mui/icons-material"; // Import the Download icon
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
  //isProjection: boolean;
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

const generateGraphData = (data: DataEntry[]) => {
  const labels = data.map((entry) => entry.quarter);

  const ocrData = data.map((entry) => entry.ocr ?? 0); // Use 0 for undefined OCR values
  const taylorOCRData = data.map((entry) => entry.taylorOCR ?? 0); // Use 0 for undefined Taylor OCR values
  const inertialOCRData = data.map((entry) => entry.inertialOCR ?? 0); // Use 0 for undefined Inertial OCR values

  return {
    labels,
    datasets: [
      {
        label: "Quarterly Average Actual OCR",
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
      setData(result);
      setLoading(false);

      const firstQuarter = result[0]?.quarter || "";
      const lastQuarter = result[result.length - 1]?.quarter || "";
      setStartQuarter(firstQuarter);
      setEndQuarter(lastQuarter);
      setFilteredData(result);
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
  //console.log("Graph Data:", graphData); // Log the data being passed to the graph

  const handleDownload = () => {
    const csvRows = [];

    // Get all keys from the first entry in the filtered data to use as headers
    const headers = Object.keys(filteredData[0]);
    csvRows.push(headers.join(","));

    // Iterate over each entry to create a row
    filteredData.forEach((entry: any) => {
      const row = headers.map((key) => {
        const value = entry[key];
        if (value !== null && value !== undefined) {
          // Check if the value is an object (to avoid stringifying an already stringified object)
          if (typeof value === "object") {
            // Escape quotes and wrap the value in double quotes
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }

          // If it's a simple string, number, or boolean, wrap in quotes if it contains a comma or newline
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }

          return value.toString(); // Otherwise, just convert to string
        }
        return "-"; // Handle null/undefined values
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    jsFileDownload(csvString, "filtered_data.csv");
  };

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
        <Box mb={4}>
          <Box
            display="flex"
            justifyContent="flex-start"
            gap={"1rem"}
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Data Table
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-start"
            gap={"1rem"}
            alignItems="center"
            mt={2}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "light", fontStyle: "italic" }}
            >
              Click the download icon to get the filtered data in CSV format
              alongside the source data behind the calculations
            </Typography>
            <IconButton
              onClick={handleDownload}
              color="primary"
              aria-label="Download filtered data"
            >
              <Download />
            </IconButton>
          </Box>
        </Box>

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
