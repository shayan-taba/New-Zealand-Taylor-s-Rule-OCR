// app/methodology/page.tsx

export default function MethodologyPage() {
  return <Methodology />;
}


import { Container, Typography, Link, Box } from "@mui/material";

function Methodology() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Methodology
      </Typography>

      <Typography paragraph>
        This data is derived from the latest <Link href="https://www.rbnz.govt.nz/hub/publications/monetary-policy-statement/2025/feb-1902-dhs/monetary-policy-statement-february-2025" target="_blank">RBNZ Monetary Policy Statement (February 2025)</Link>.
      </Typography>

      <Typography paragraph>
        The data used in this project comes from the <strong>Projections Table</strong> of the Monetary Policy Statement. It includes key economic indicators such as output gaps, inflation expectations, and the long-term nominal interest rate (NIR). The NIR data is sourced from the Reserve Bank's research article <Link href="https://www.rbnz.govt.nz/hub/news/2024/04/finding-neutral#:~:text=As%20inflation%20expectations%20continue%20to,reducing%20inflation%20in%20New%20Zealand." target="_blank">Finding Neutral: Estimates of New Zealand’s Nominal Neutral Interest Rate</Link>, providing a more granular NIR figure (up to two decimal places) from 1997 to 01/02/24.
      </Typography>

      <Typography paragraph>
        The following identifiers were used for this analysis:
        <ul>
          <li><strong>Output Gap</strong>: Difference between the potential and actual GDP.</li>
          <li><strong>PAPC</strong>: Personal Average Price Change, reflecting inflation.</li>
          <li><strong>NIR</strong>: Long-term neutral interest rate, used for the calculation of Taylor and Inertial Taylor OCR.</li>
        </ul>
      </Typography>

      <Typography paragraph>
        For further details, please check the <Link href="https://github.com/yourgithubrepo" target="_blank">source code on GitHub</Link>.
      </Typography>
    </Container>
  );
}
