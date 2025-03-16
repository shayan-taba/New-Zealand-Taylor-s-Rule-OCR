import { Container, Typography, Link, Box, Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Methodology() {
  return (
    <Container>
      {/* Navbar */}
      <Navbar />

      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Methodology
      </Typography>

      {/* Introduction */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        This website is based on the latest data from the Reserve Bank of New
        Zealand's (RBNZ) February 2025{" "}
        <Link
          href="https://www.rbnz.govt.nz/-/media/project/sites/rbnz/files/publications/monetary-policy-statements/2025/feb-19224/mpsfeb25-data.xlsx"
          target="_blank"
        >
          MPS
        </Link>
        . The Taylor Rule and an Inertial Taylor Rule are used to provide a
        theoretical optimal benchmark OCR (Official Cash Rate). The data comes
        from the <strong>projections table</strong> in the Reserve Bank of New
        Zealand's Monetary Policy Statement (MPS) and from the identifiers{" "}
        <strong>ocr</strong>, <strong>outputgap</strong>, and{" "}
        <strong>papc</strong>.
      </Typography>

      {/* Taylor Rule */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Taylor Rule Formula:
      </Typography>
      <Box sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        i<sub>t</sub> = π<sub>t</sub> + r
        <sub>
          t<sup>r</sup>
        </sub>{" "}
        + a<sub>π</sub>(π<sub>t</sub> - π
        <sub>
          t<sup>*</sup>
        </sub>
        ) + a<sub>y</sub>(y<sub>t</sub>)
      </Box>

      <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
        The <strong>Taylor Rule</strong> describes how a central bank adjusts
        the official interest rate (OCR) based on the inflation rate (π) and the
        output gap (y). Here is what each term represents:
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              i<sub>t</sub>
            </strong>
            : Official Cash Rate (OCR) at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              π<sub>t</sub>
            </strong>
            : Inflation rate at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              r
              <sub>
                t<sup>r</sup>
              </sub>
            </strong>
            : Real neutral interest rate at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>π</sub>
            </strong>
            : Weight of inflation deviation in the policy rule (usually set to
            0.5)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              π
              <sub>
                t<sup>*</sup>
              </sub>
            </strong>
            : Target inflation rate
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>y</sub>
            </strong>
            : Weight of output gap in the policy rule (usually set to 0.5)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              y<sub>t</sub>
            </strong>
            : Output gap at time <em>t</em>
          </Typography>
        </Grid>
      </Grid>

      {/* Inertial Taylor Rule */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Inertial Taylor Rule Formula:
      </Typography>
      <Box sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        i<sub>t</sub> = a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [ r
        <sub>
          t<sup>n</sup>
        </sub>{" "}
        + a<sub>π</sub>(π<sub>t</sub> - π
        <sub>
          t<sup>*</sup>
        </sub>
        ) + a<sub>y</sub>(y<sub>t</sub>) ]
      </Box>

      <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
        The <strong>Inertial Taylor Rule</strong> adjusts the OCR based not only
        on current inflation and output gaps but also on the previous OCR value.
        Here is what each term represents:
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              i<sub>t</sub>
            </strong>
            : Official Cash Rate (OCR) at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>i</sub>
            </strong>
            : Weight of the previous OCR in the policy rule (usually set to
            0.85)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              i<sub>t-1</sub>
            </strong>
            : Previous period's OCR
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>t</sub>
            </strong>
            : Weight of the rule's equation in the inertial rule (usually set to
            0.15)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              r
              <sub>
                t<sup>n</sup>
              </sub>
            </strong>
            : Neutral real interest rate at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>π</sub>
            </strong>
            : Weight of inflation deviation in the policy rule (usually set to
            0.5)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              π<sub>t</sub>
            </strong>
            : Inflation rate at time <em>t</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              π
              <sub>
                t<sup>*</sup>
              </sub>
            </strong>
            : Target inflation rate
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              a<sub>y</sub>
            </strong>
            : Weight of output gap in the policy rule (usually set to 0.5)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>
              y<sub>t</sub>
            </strong>
            : Output gap at time <em>t</em>
          </Typography>
        </Grid>
      </Grid>

      {/* Neutral Interest Rate */}
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Long-Term Neutral Interest Rate (NIR):
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The Long-Term Nominal Neutral Interest Rate (NIR) used in this model
        comes from <strong>Table 6.4</strong> in the RBNZ MPS, but this value is
        only presented to one decimal place. Therefore, for periods before
        2024-02-01, the NIR from the RBNZ{" "}
        <Link
          href="https://www.rbnz.govt.nz/hub/news/2024/04/finding-neutral#:~:text=As%20inflation%20expectations%20continue%20to,reducing%20inflation%20in%20New%20Zealand."
          target="_blank"
        >
          Finding Neutral article
        </Link>{" "}
        is used, which provides a more precise value of the NIR to two decimal
        places, covering data from 1997 to February 2024.
      </Typography>

      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        Target Inflation:
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        The Taylor Rule equations rely on the target inflation rate, which is
        determined based on the mandate and remit of the Reserve Bank of New
        Zealand (RBNZ). For each period, the midpoint of the target range is
        used as the target rate in the Taylor Rule calculations:
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        1996-12-10 to 2002-09-17: Single Mandate, Target Range: 0-2%, Midpoint:
        1.0%
        <br />
        2002-09-17 to 2018-03-26: Single Mandate, Target Range: 0-3%, Midpoint:
        1.5%
        <br />
        2018-03-26 to 2023-12-20: Dual Mandate, Target Range: 1-3%, Midpoint:
        2.0%
        <br />
        2023-12-20 onward: Single Mandate, Target Range: 1-3%, Midpoint: 2.0%
      </Typography>

      {/* GitHub Link */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        For further details, including source code and data processing, please
        refer to the original documentation:{" "}
        <Link
          href="https://github.com/shayan-taba/New-Zealand-Taylor-s-Rule-OCR"
          target="_blank"
        >
          GitHub Repository
        </Link>
        .
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        For any feedback or queries, feel free to contact:{" "}
        <em>s.taba.main@gmail.com</em>.
      </Typography>

      {/* Footer */}
      <Footer />
    </Container>
  );
}
