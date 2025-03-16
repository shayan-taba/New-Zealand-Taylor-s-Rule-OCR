// app/components/Navbar.tsx

"use client";

import { AppBar, Button, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<string>('');

  useEffect(() => {
    setActivePage(window.location.pathname);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => router.push("/")}
          sx={{
            backgroundColor: activePage === "/" ? "rgba(255, 255, 255, 0.1)" : "transparent",
            color: activePage === "/" ? "white" : "inherit",
          }}
        >
          Results
        </Button>
        <Button
          color="inherit"
          onClick={() => router.push("/methodology")}
          sx={{
            backgroundColor: activePage === "/methodology" ? "rgba(255, 255, 255, 0.1)" : "transparent",
            color: activePage === "/methodology" ? "white" : "inherit",
          }}
        >
          Methodology
        </Button>
      </Toolbar>
    </AppBar>
  );
}
