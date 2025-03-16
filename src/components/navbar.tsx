"use client";

import * as React from 'react';
import { AppBar, Box, Toolbar, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // To determine the current route

  const isActive = (path: string) => pathname === path;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Navigation Buttons */}
          <Button
            onClick={() => router.push("/")}
            sx={{
              textTransform: "none",
              color: "white",
              borderBottom: isActive("/") ? `2px solid #f5f5f5` : "none", // Add underline for active page
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Highlight on hover
              },
            }}
          >
            Results
          </Button>
          <Button
            onClick={() => router.push("/methodology")}
            sx={{
              textTransform: "none",
              color: "white",
              ml: 2, // Margin left to space buttons
              borderBottom: isActive("/methodology") ? `2px solid #f5f5f5` : "none", // Add underline for active page
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Highlight on hover
              },
            }}
          >
            Methodology
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
