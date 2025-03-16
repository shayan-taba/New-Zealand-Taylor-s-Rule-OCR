// app/results/page.tsx
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";
import { Line } from "react-chartjs-2";
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
  Box,
  Divider,
  Slider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ResultsPage() {
  return <Results />;
}

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


const generateGraphData = (data: DataEntry[], dateRange: [string, string], showLines: any) => {
  const labels = data.map((entry) => entry.quarter);
  const ocrData = data.map((entry) => entry.ocr || 0);
  const taylorOCRData = data.map((entry) => entry.taylorOCR || 0);
  const inertialOCRData = data.map((entry) => entry.inertialOCR || 0);

  const filteredData = data.filter(
    (entry) =>
      new Date(entry.date) >= new Date(dateRange[0]) && new Date(entry.date) <= new Date(dateRange[1])
  );

  return {
    labels: filteredData.map((entry) => entry.quarter),
    datasets: [
      {
        label: "OCR",
        data: filteredData.map((entry) => entry.ocr || 0),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        hidden: !showLines.ocr
      },
      {
        label: "Taylor OCR",
        data: filteredData.map((entry) => entry.taylorOCR || 0),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        hidden: !showLines.taylor
      },
      {
        label: "Inertial Taylor OCR",
        data: filteredData.map((entry) => entry.inertialOCR || 0),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        hidden: !showLines.inertial
      },
    ],
  };
};

function Results() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(["2020-01-01", "2025-01-01"]);
  const [showLines, setShowLines] = useState({ ocr: true, taylor: true, inertial: true });

  useEffect(() => {
    fetchData().then((result: any) => {
      // Process the data as necessary (same as before)
      setData(result);
      setLoading(false);
    });
  }, []);

  const graphData = generateGraphData(data, dateRange, showLines);

  const handleDateRangeChange = (newValue: any) => {
    setDateRange(newValue);
  };

  const handleLineVisibilityToggle = (line: string) => {
    setShowLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Economic Projections - Results
      </Typography>

      <Box mb={4}>
        <Line data={graphData} />
      </Box>

      <Box mb={4}>
        <Slider
          value={dateRange}
          onChange={handleDateRangeChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => new Date(value).toLocaleDateString()}
        />
        <div>
          <IconButton onClick={() => handleLineVisibilityToggle("ocr")}>
            {showLines.ocr ? <FaEye /> : <FaEyeSlash />}
            OCR
          </IconButton>
          <IconButton onClick={() => handleLineVisibilityToggle("taylor")}>
            {showLines.taylor ? <FaEye /> : <FaEyeSlash />}
            Taylor OCR
          </IconButton>
          <IconButton onClick={() => handleLineVisibilityToggle("inertial")}>
            {showLines.inertial ? <FaEye /> : <FaEyeSlash />}
            Inertial OCR
          </IconButton>
        </div>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Quarterly OCR</TableCell>
              <TableCell>Taylor OCR</TableCell>
              <TableCell>Inertial OCR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.date}>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.ocr?.toFixed(2)}</TableCell>
                <TableCell>{entry.taylorOCR?.toFixed(2)}</TableCell>
                <TableCell>{entry.inertialOCR?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
