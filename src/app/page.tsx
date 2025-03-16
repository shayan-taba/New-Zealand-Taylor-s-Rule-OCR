// /app/page.tsx
"use client";

import { Container, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push("/results")
         
}
