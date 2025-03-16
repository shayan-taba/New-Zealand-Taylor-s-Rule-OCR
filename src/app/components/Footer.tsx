import { Divider, Box, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Box textAlign="center">
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {/*© 2025 NAME. All rights reserved.*/}
        </Typography>
        <IconButton
          href="https://github.com/shayan-taba/New-Zealand-Taylor-s-Rule-OCR"
          target="_blank"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default Footer;
