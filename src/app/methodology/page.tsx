// /app/methodology/page.tsx

import { Container, Typography, Link } from "@mui/material";

export default function Methodology() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Methodology: Economic Projections
      </Typography>
      <Typography paragraph>
        This analysis is based on the latest projections from the Reserve Bank of New Zealand's (RBNZ) official documents. We use economic models that incorporate the Taylor Rule and an Inertial Taylor Rule to project the OCR (Official Cash Rate).
      </Typography>
      <Typography variant="h6">Taylor Rule Formula:</Typography>
      <Typography paragraph>
        i<sub>t</sub> = π<sub>t</sub> + r<sub>t</sub><sup>r</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub><sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>
      </Typography>
      <Typography variant="h6">Inertial Taylor Rule Formula:</Typography>
      <Typography paragraph>
        i<sub>t</sub> = a<sub>i</sub> × i<sub>t-1</sub> + a<sub>t</sub> [r<sub>t</sub><sup>n</sup> + a<sub>π</sub>(π<sub>t</sub> - π<sub>t</sub><sup>∗</sup>) + a<sub>y</sub>y<sub>t</sub>]
      </Typography>
      <Typography paragraph>
        For further details, please refer to the original documentation:{" "}
        <Link href="https://github.com/your-repo" target="_blank">
          GitHub Repository
        </Link>.
      </Typography>
    </Container>
  );
}
