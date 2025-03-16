import { Container, Typography, Link, Box, Stack } from "@mui/material";
import { Email, GitHub } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Methodology() {
  return (
    <Container /*maxWidth="md"*/>
      {/* Navbar */}
      <Navbar />

      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Methodology
      </Typography>

      {/* Introduction */}
      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
        This website utilizes data from the Reserve Bank of New Zealand's (RBNZ){" "}
        <Link
          href="https://www.rbnz.govt.nz/-/media/project/sites/rbnz/files/publications/monetary-policy-statements/2025/feb-19224/mpsfeb25-data.xlsx"
          target="_blank"
        >
          February 2025 Monetary Policy Statement (MPS)
        </Link>{" "}
        to provide a theoretical benchmark for the Official Cash Rate (OCR).
        Using the Taylor Rule and Inertial Taylor Rule, it models how the OCR
        should respond to inflation and economic output changes. These
        calculations are based on the MPS's <strong>projections</strong> table,
        incorporating key indicators: <strong>ocr</strong>,{" "}
        <strong>outputgap</strong>, and <strong>papc</strong>.
      </Typography>

      {/* Taylor Rule */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Taylor Rule Formula:
      </Typography>
      <Box
        sx={{
          fontFamily: "monospace",
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        i<sub>t</sub> = π<sub>t</sub> + r
        <sub>
          t<sup>r</sup>
        </sub>{" "}
        + a<sub>π</sub>(π<sub>t</sub> - π
        <sub>
          t<sup>*</sup>
        </sub>
        ) + a<sub>y</sub>(y<sub>t</sub>) ={" "}
        <strong>
          r
          <sub>
            t<sup>n</sup>
          </sub>{" "}
          + a<sub>π</sub>(π<sub>t</sub> - π
          <sub>
            t<sup>*</sup>
          </sub>
          ) + a<sub>y</sub>(y<sub>t</sub>)
        </strong>
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        The Taylor Rule determines the OCR based on inflation (π) and the output
        gap (y). The key components are:
      </Typography>

      <Stack spacing={1} sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>
            i<sub>t</sub>
          </strong>
          : Taylor Rule Optimal at time <em>t</em>
        </Typography>
        <Typography variant="body2">
          <strong>
            π<sub>t</sub>
          </strong>
          : Inflation rate (YoY % change in CPI) at time <em>t</em> (from{" "}
          <strong>papc</strong> in the MPS projections table)
        </Typography>
        <Typography variant="body2">
          <strong>
            r
            <sub>
              t<sup>n</sup>
            </sub>
          </strong>
          : Nominal long-term neutral interest rate (from{" "}
          <strong>Table 6.4</strong> of the MPS or the RBNZ "Finding Neutral"
          article)
        </Typography>
        <Typography variant="body2">
          <strong>
            a<sub>π</sub>
          </strong>
          : Weight on inflation deviation (0.5 in calculations)
        </Typography>
        <Typography variant="body2">
          <strong>
            a<sub>y</sub>
          </strong>
          : Weight on output-gap deviation (0.5 in calculations)
        </Typography>
        <Typography variant="body2">
          <strong>
            y<sub>t</sub>
          </strong>
          : Output gap at time <em>t</em> (from <strong>outputgap</strong> in
          the MPS projections table)
        </Typography>
        <Typography variant="body2">
          <strong>
            π<sub>t*</sub>
          </strong>
          : The midpoint target inflation rate, which has evolved over time:
          <ul>
            <li>1990-03-02 to 1996-12-10: 1.0%</li>
            <li>1996-12-10 to 2002-09-17: 1.5%</li>
            <li>2002-09-17 onwards: 2%</li>
          </ul>
        </Typography>
      </Stack>

      {/* Inertial Taylor Rule */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Inertial Taylor Rule Formula:
      </Typography>
      <Box
        sx={{
          fontFamily: "monospace",
          p: 2,
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
      >
        i<sub>t</sub> = a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [ r
        <sub>
          t<sup>r</sup>
        </sub>{" "}
        + π<sub>t</sub> + a<sub>π</sub>(π<sub>t</sub> - π
        <sub>
          t<sup>*</sup>
        </sub>
        ) + a<sub>y</sub>(y<sub>t</sub>) ] ={" "}
        <strong>
          a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [ r
          <sub>
            t<sup>n</sup>
          </sub>{" "}
          + a<sub>π</sub>(π<sub>t</sub> - π
          <sub>
            t<sup>*</sup>
          </sub>
          ) + a<sub>y</sub>(y<sub>t</sub>) ]{" "}
        </strong>
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        Unlike the standard Taylor Rule, the Inertial Taylor Rule smooths policy
        adjustments by incorporating the previous OCR. This reduces market
        volatility and prevents excessive rate swings. The value of this
        calculation at the first time period is just the actual OCR on this
        website.
      </Typography>

      <Stack spacing={1} sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>
            i<sub>t</sub>
          </strong>
          : Taylor Rule Optimal OCR at time <em>t</em>
        </Typography>
        <Typography variant="body2">
          <strong>
            i<sub>t-1</sub>
          </strong>
          : Actual OCR at time <em>t-1</em> (average OCR from previous quarter)
        </Typography>
        <Typography variant="body2">
          <strong>
            a<sub>i</sub>
          </strong>
          : Weight of previous OCR (0.85 in calculations)
        </Typography>
        <Typography variant="body2">
          <strong>
            a<sub>t</sub>
          </strong>
          : Weight of Taylor Rule equation (0.15 in calculations)
        </Typography>

        <Typography variant="body1" sx={{ mt: 4 }}>
          For more information on the use of monetary policy rules like the
          Taylor Rule, refer to this resource from the Federal Reserve:{" "}
          <Link
            href="https://www.federalreserve.gov/monetarypolicy/policy-rules-and-how-policymakers-use-them.htm"
            target="_blank"
          >
            Policy Rules and How Policymakers Use Them
          </Link>
          .
        </Typography>
      </Stack>

      {/* Neutral Interest Rate */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Long-Term Neutral Interest Rate (NIR):
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        The nominal neutral interest rate is sourced from{" "}
        <strong>Table 6.4</strong> in the latest RBNZ MPS, though it is only
        reported to one decimal place. To improve precision, for earlier
        periods, we use data from the RBNZ’s{" "}
        <Link
          href="https://www.rbnz.govt.nz/hub/news/2024/04/finding-neutral#:~:text=As%20inflation%20expectations%20continue%20to,reducing%20inflation%20in%20New%20Zealand."
          target="_blank"
        >
          "Finding Neutral" article
        </Link>
        , which provides two-decimal precision from 1997 to February 2024.
      </Typography>

      {/* Data and Rule Values Used for Calculations Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
        Data and Calculations:
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
        The data used for the calculations of both the Inertial and Taylor's
        OCR, including the values sourced from the latest RBNZ MPS, as well as
        the calculated Taylor Rule and Inertial Rule values, are available for
        download. Click the download button next to the table in the results
        page to access the full dataset and the rule calculations.
      </Typography>

      {/* GitHub Link */}
      <Typography
        variant="body1"
        sx={{ mt: 4, display: "flex", alignItems: "center", gap: 1 }}
      >
        <GitHub fontSize="small" />
        <Link
          href="https://github.com/shayan-taba/New-Zealand-Taylor-s-Rule-OCR"
          target="_blank"
        >
          Source Code: GitHub Repository
        </Link>
      </Typography>

      {/* Contact */}
      <Typography
        variant="body1"
        sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Email fontSize="small" />
        <Link href="mailto:s.taba.main@gmail.com">
          Contact: s.taba.main@gmail.com
        </Link>
      </Typography>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
