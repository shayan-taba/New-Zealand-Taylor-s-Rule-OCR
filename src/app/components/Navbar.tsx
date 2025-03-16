"use client";

import * as React from "react";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // To determine the current route

  const isActive = (path: string) => pathname === path;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Descriptive Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NZ Taylor Rule Analysis Tool
          </Typography>
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
          <Typography variant="body1" sx={{ color: "white", mx: 3 }}>
            |
          </Typography>{" "}
          {/* Pipe separator */}
          <Button
            onClick={() => router.push("/methodology")}
            sx={{
              textTransform: "none",
              color: "white",
              borderBottom: isActive("/methodology")
                ? `2px solid #f5f5f5`
                : "none", // Add underline for active page
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Highlight on hover
              },
            }}
          >
            Methodology
          </Button>
          <Typography variant="body1" sx={{ color: "white", mx: 3 }}>
            |
          </Typography>{" "}
          {/* Pipe separator */}
          <Button
            onClick={() => router.push("/api-docs")}
            sx={{
              textTransform: "none",
              color: "white",
              borderBottom: isActive("/api") ? `2px solid #f5f5f5` : "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            API
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
