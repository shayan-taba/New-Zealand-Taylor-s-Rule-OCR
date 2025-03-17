import { Container, Typography, Link, Box, Stack } from "@mui/material";
import { Email, GitHub } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { lastQuarter, latestMPS } from "../config";

export default function APIDocumentation() {
  return (
    <Container>
      {/* Navbar */}
      <Navbar />
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        API Documentation
      </Typography>
      {/* Introduction */}
      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
        This API fetches and processes economic data from two primary files: the
        latest Reserve Bank of New Zealand's (RBNZ) Monetary Policy Statement{" "}
        <Link href={latestMPS.mpsLink} target="_blank">
          ({latestMPS.month} {latestMPS.year} MPS)
        </Link>{" "}
        Excel file and a CSV file containing the{" "}
        <strong>Nominal Interest Rate (NIR)</strong>. More detailed information
        about data sources is in the{" "}
        <Link href={"/methodology"}>Methodology</Link>. The processed data
        includes key economic indicators such as <strong>OCR</strong>,{" "}
        <strong>output gap</strong>, <strong>inflation</strong>, and both the{" "}
        <strong>Taylor Rule</strong> and <strong>Inertial Taylor Rule</strong>{" "}
        calculations. Note that all calculations are done server-side within the
        API. The source code is public. The data is from 2000Q1 until the latest
        data in the MPS ({lastQuarter.year} {lastQuarter.quarter}).
      </Typography>
      {/* API Endpoint Overview */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        API Endpoint Overview:
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        The following endpoint is available for fetching processed economic
        data:
      </Typography>
      <Box
        sx={{
          fontFamily: "monospace",
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        <strong>GET /api/getData</strong>
      </Box>
      {/* Endpoint Response Example */}{" "}
      {/*
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Endpoint Response Example:
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        The API returns the following JSON structure:
      </Typography>
      <Box
        sx={{
          fontFamily: "monospace",
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        <pre>{`{
  "success": true,
  "data": [
    {
      "date": "2000-03-31T00:00:00.000Z",
      "ocr": 5.313492063492063,
      "quarter": "Q1 2000",
      "outputGap": 0.847666770298936,
      "papc": 1.7592581412529062,
      "longTermNominalNIR": 5.16,
      "mandateType": {
        "range": "0-3%",
        "lower": 0,
        "upper": 3,
        "midpoint": 1.5,
        "mandate": "Single"
      },
      "taylorOCR": 5.713462455775922,
      "inertialOCR": 5.313492063492063
    },
    {
      "date": "2000-06-30T00:00:00.000Z",
      "ocr": 6.213114754098361,
      "quarter": "Q2 2000",
      "outputGap": 0.12993120288846124,
      "papc": 2.00012019952871,
      "longTermNominalNIR": 5.14,
      "mandateType": {
        "range": "0-3%",
        "lower": 0,
        "upper": 3,
        "midpoint": 1.5,
        "mandate": "Single"
      },
      "taylorOCR": 5.455025701208585,
      "inertialOCR": 5.334722109149541
    }
  ]
}`}</pre>
      </Box>*/}
      {/* JSON Schema for Response */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Response JSON Schema:
      </Typography>
      <Box
        sx={{
          fontFamily: "monospace",
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        <pre>
          {`{
  "success": boolean, 
  "data": [
    {
      "date": string,  // ISO 8601 format
      "ocr": number,  // float
      "quarter": string,  // "Q1 2000", "Q2 2000", etc.
      "outputGap": number,  // float
      "papc": number,  // float
      "urate": number,  // float
      "longTermNominalNIR": number,  // float
      "mandateType": {
        "range": string,  // e.g., "1-3%"
        "lower": number,  // float
        "upper": number,  // float
        "midpoint": number,  // float
        "mandate": string  // "Single" or "Dual"
      },
      "taylorOCR": number,  // float
      "inertialOCR": number  // float
    }
  ]
}`}
        </pre>
      </Box>
      {/* Endpoint Details */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Endpoint Details:
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        The `/api/getData` endpoint processes the following fields, which are
        derived from the MPS and NIR files:
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {/* Success */}
        <Typography variant="body2">
          <strong>success</strong>: A boolean indicating whether the request was
          successful.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>boolean</Box>
        </Typography>

        {/* Data */}
        <Typography variant="body2">
          <strong>data</strong>: An array of objects containing the economic
          data for each quarter.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>
            array of <span style={{ fontWeight: "bold" }}>objects</span>
          </Box>
        </Typography>

        {/* Date */}
        <Typography variant="body2">
          <strong>date</strong>: The date of the quarter, formatted in ISO 8601
          format.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>
            string (ISO 8601 date format)
          </Box>
        </Typography>

        {/* OCR */}
        <Typography variant="body2">
          <strong>ocr</strong>: The actual average official cash rate for the
          quarter.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* Quarter */}
        <Typography variant="body2">
          <strong>quarter</strong>: The financial quarter in the form "Q1 YYYY".
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>string</Box>
        </Typography>

        {/* Output Gap */}
        <Typography variant="body2">
          <strong>outputGap</strong>: The output gap for the quarter, that is,
          inflation-adjusted actual GDP as a percentage share of potential GDP.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* PAPC */}
        <Typography variant="body2">
          <strong>papc</strong>: The annual percentage change in CPI in a given
          quarter.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* urate */}
        <Typography variant="body2">
          <strong>urate</strong>: The seasonally adjusted unemployment rate from
          the "urate" identifier of the MPS.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* Long Term Nominal NIR */}
        <Typography variant="body2">
          <strong>longTermNominalNIR</strong>: The nominal interest rate for the
          long term.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* Mandate Type */}
        <Typography variant="body2">
          <strong>mandateType</strong>: An object detailing the inflation
          mandate type, which includes:
          <ul>
            <li>
              <strong>range</strong>: The range for inflation targets (e.g.,
              "1-3%").
            </li>
            <li>
              <strong>lower</strong>: The lower bound of the range.
            </li>
            <li>
              <strong>upper</strong>: The upper bound of the range.
            </li>
            <li>
              <strong>midpoint</strong>: The midpoint of the range.
            </li>
            <li>
              <strong>mandate</strong>: The mandate type ("Single" or "Dual").
            </li>
          </ul>
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>object</Box>
        </Typography>

        {/* Taylor OCR */}
        <Typography variant="body2">
          <strong>taylorOCR</strong>: The OCR value calculated using the Taylor
          Rule.
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>

        {/* Inertial OCR */}
        <Typography variant="body2">
          <strong>inertialOCR</strong>: The OCR value calculated using the
          Inertial Taylor Rule. It is equal to "ocr" for the first available
          data point (2000Q1).
          <br />
          <strong>Data type:</strong>{" "}
          <Box sx={{ fontFamily: "monospace" }}>float</Box>
        </Typography>
      </Stack>
      {/* Footer */}
      <Footer />
    </Container>
  );
}
