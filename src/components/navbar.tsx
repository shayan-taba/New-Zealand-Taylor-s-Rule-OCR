// components/Navbar.tsx
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Economic Projections Dashboard
        </Typography>
        <Tabs value={currentRoute} textColor="inherit" indicatorColor="secondary">
          <Tab
            label="Results"
            value="/results"
            onClick={() => router.push("/results")}
            sx={{
              fontWeight: currentRoute === "/results" ? "bold" : "normal",
              color: currentRoute === "/results" ? "orange" : "white",
            }}
          />
          <Tab
            label="Methodology"
            value="/methodology"
            onClick={() => router.push("/methodology")}
            sx={{
              fontWeight: currentRoute === "/methodology" ? "bold" : "normal",
              color: currentRoute === "/methodology" ? "orange" : "white",
            }}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
