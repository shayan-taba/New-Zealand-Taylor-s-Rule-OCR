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
} from "@mui/material";

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
};

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result: any) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Economic Projections
      </Typography>

      {/*
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>mandateType</TableCell>
                <TableCell>Quarter</TableCell>
                <TableCell>"outputgap"</TableCell>
                <TableCell>"papc"</TableCell>
                <TableCell>"ocr"</TableCell>
                <TableCell>Long-term (mean) Nominal NIR</TableCell>
                <TableCell>Projection</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(row.date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>{row.mandateType.lower}, {row.mandateType.upper}, {row.mandateType.range}, {row.mandateType.mandate}</TableCell>
                  <TableCell>{row.quarter}</TableCell>
                  <TableCell>
                    {row.outputGap !== null ? row.outputGap.toFixed(2) : "N/A"}
                  </TableCell>
                  <TableCell>
                    {row.papc !== null ? row.papc.toFixed(2) : "N/A"}
                  </TableCell>
                  <TableCell>{row.ocr}</TableCell>
                  <TableCell>{row.isProjection ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      */}
    </Container>
  );
}
