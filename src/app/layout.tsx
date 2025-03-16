import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "New Zealand OCR Taylor Rule Tool", // Consider a more descriptive title related to your content
  description: "Explore RBNZ's Official Cash Rate (OCR) decisions by comparing it to the Taylor Rule in New Zealand's monetary policy. This website uses up-to-date data from the Reserve Bank of New Zealand to calculate theoretical optimal OCR values.", // Update this to be more specific to your content
  keywords: "New Zealand, OCR, Taylor Rule, Inertial Taylor's Rule, optimal OCR, monetary policy, Reserve Bank of New Zealand, official cash rate, RBNZ", // Add relevant keywords
  authors: [{ name: "shayan-taba", url: "https://github.com/shayan-taba/New-Zealand-Taylor-s-Rule-OCR" }],
  openGraph: {
    title: "New Zealand OCR Taylor Rule Tool",
    description: "Explore RBNZ's Official Cash Rate (OCR) decisions by comparing it to the Taylor Rule in New Zealand's monetary policy. This website uses up-to-date data from the Reserve Bank of New Zealand to calculate theoretical optimal OCR values.",
    url: "https://yourdomain.com", // Replace with your actual URL
    siteName: "New Zealand OCR Taylor Rule Tool",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags for SEO */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        {/* Other meta tags can go here */}
        <meta name="google-site-verification" content="KPPeYkPI6FlhfcKQ7rDPc-SmnDF9EEGFH67BPct68ao" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
