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
} from "@mui/material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  if (previousOCR === null) return taylorOCR; // For the first entry, use Taylor rule directly
  return a_i * previousOCR + a_t * (longTermNominalNIR + a_pi * (inflationRate - targetInflation) + a_y * outputGap);
};

const generateGraphData = (data: DataEntry[]) => {
  const labels = data.map(entry => entry.quarter);
  const ocrData = data.map(entry => entry.ocr || 0);
  const taylorOCRData = data.map(entry => entry.taylorOCR || 0);
  const inertialOCRData = data.map(entry => entry.inertialOCR || 0);

  return {
    labels,
    datasets: [
      {
        label: 'OCR',
        data: ocrData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Taylor OCR',
        data: taylorOCRData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Inertial Taylor OCR',
        data: inertialOCRData,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };
};

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result: any) => {
      const updatedData = result.map((entry: DataEntry) => ({
        ...entry,
        taylorOCR: null,
        inertialOCR: null,
      }));

      let prevOCR: number | null = null;

      const dataWithOCR = updatedData.map((entry: DataEntry, index: number) => {
        const targetInflation = entry.mandateType.midpoint;
        const inflationRate = entry.papc || 0;

        const taylorOCR = calculateTaylorOCR(inflationRate, entry.outputGap, entry.longTermNominalNIR, targetInflation);
        const inertialOCR = calculateInertialTaylorOCR(prevOCR, inflationRate, entry.outputGap, entry.longTermNominalNIR, targetInflation);

        prevOCR = entry.ocr; // Use actual OCR as the previous OCR for the next quarter

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
      <Typography variant="h4" gutterBottom>
        Economic Projections
      </Typography>

      {/* Equations Section */}
      <Box mb={4}>
        <Typography variant="h6" paragraph>
          <strong>Taylor Rule Equation:</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
          i<sub>t</sub> = π<sub>t</sub> + r<sub>t</sub><sup>r</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub><sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" paragraph>
          <strong>Inertial Taylor Rule Equation:</strong>
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
          i<sub>t</sub> = a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [r<sub>t</sub><sup>n</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub><sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>]
        </Typography>
      </Box>

      {/* Graph Section */}
      <Box mb={4}>
        <Line data={graphData} />
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Quarter</TableCell>
              <TableCell>Output Gap</TableCell>
              <TableCell>PAPC</TableCell>
              <TableCell>Mandate</TableCell>
              <TableCell>Taylor OCR</TableCell>
              <TableCell>Inertial OCR</TableCell>
              <TableCell>Average OCR (Existing)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.date}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.quarter}</TableCell>
                <TableCell>{entry.outputGap}</TableCell>
                <TableCell>{entry.papc}</TableCell>
                <TableCell>{entry.mandateType.mandate}</TableCell>
                <TableCell>{entry.taylorOCR?.toFixed(2)}</TableCell>
                <TableCell>{entry.inertialOCR?.toFixed(2)}</TableCell>
                <TableCell>{entry.ocr?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
