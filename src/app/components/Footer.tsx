import { Divider, Box, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <>
      <Divider sx={{ my: 3 }} />
      <Box textAlign="center">
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {/*© 2025 NAME. All rights reserved.*/}
        </Typography>

        {/* Container with gap between items */}
        <Box display="flex" justifyContent="center" gap="2rem">
          {/* GitHub Link */}
          <IconButton
            href="https://github.com/shayan-taba/New-Zealand-Taylor-s-Rule-OCR"
            target="_blank"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </IconButton>

          {/* Email Link */}
          <IconButton
            href="mailto:s.taba.main@gmail.com"
            aria-label="Email"
          >
            <EmailIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default Footer;