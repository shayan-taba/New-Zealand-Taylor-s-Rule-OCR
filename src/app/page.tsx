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
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DataEntry = {
  date: string;
  quarter: string;
  outputGap: number | null;
  papc: number | null;
  ocr: number | null;
  longTermNominalNIR: number | null;
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
  return longTermNominalNIR + a_pi * (inflationRate - targetInflation) + a_y * outputGap;
};

const calculateInertialTaylorOCR = (
  previousOCR: number | null,
  inflationRate: number,
  outputGap: number | null,
  longTermNominalNIR: number | null,
  targetInflation: number
): number | null => {
  if (outputGap === null || longTermNominalNIR === null) return null;
  const taylorOCR = calculateTaylorOCR(inflationRate, outputGap, longTermNominalNIR, targetInflation);
  if (previousOCR === null) return taylorOCR;
  return a_i * previousOCR + a_t * (longTermNominalNIR + a_pi * (inflationRate - targetInflation) + a_y * outputGap);
};

const generateGraphData = (data: DataEntry[]) => {
  const labels = data.map((entry) => entry.quarter);
  return {
    labels,
    datasets: [
      {
        label: "OCR",
        data: data.map((entry) => entry.ocr || 0),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Taylor OCR",
        data: data.map((entry) => entry.taylorOCR || 0),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
      {
        label: "Inertial Taylor OCR",
        data: data.map((entry) => entry.inertialOCR || 0),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
      },
    ],
  };
};

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result: any) => {
      let prevOCR: number | null = null;
      const dataWithOCR = result.map((entry: DataEntry) => {
        const targetInflation = 2.0; 
        const inflationRate = entry.papc || 0;
        const taylorOCR = calculateTaylorOCR(inflationRate, entry.outputGap, entry.longTermNominalNIR, targetInflation);
        const inertialOCR = calculateInertialTaylorOCR(prevOCR, inflationRate, entry.outputGap, entry.longTermNominalNIR, targetInflation);
        prevOCR = entry.ocr;
        return {
          ...entry,
          taylorOCR,
          inertialOCR,
        };
      });
      setData(dataWithOCR);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  const graphData = generateGraphData(data);

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" href="#methodology">Methodology</Button>
          <Button color="inherit" href="#results">Results</Button>
        </Toolbar>
      </AppBar>

      <Box mt={4} id="results">
        <Typography variant="h4" gutterBottom>Economic Projections</Typography>
        <Line data={graphData} />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Quarter</TableCell>
              <TableCell>OCR</TableCell>
              <TableCell>Taylor OCR</TableCell>
              <TableCell>Inertial OCR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.date}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.quarter}</TableCell>
                <TableCell>{entry.ocr?.toFixed(2)}</TableCell>
                <TableCell>{entry.taylorOCR?.toFixed(2)}</TableCell>
                <TableCell>{entry.inertialOCR?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4} id="methodology">
        <Typography variant="h5">Methodology</Typography>
        <Typography>
          The data is sourced from the latest RBNZ Monetary Policy Statement. For more details, visit:
          <a href="https://www.rbnz.govt.nz/hub/publications/monetary-policy-statement/2025/feb-1902-dhs/monetary-policy-statement-february-2025" target="_blank" rel="noopener noreferrer">RBNZ MPS February 2025</a>
        </Typography>
      </Box>
    </Container>
  );
}
