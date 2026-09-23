import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chakan Development Monitoring & Transparency Platform (चाकण इन्फ्रा GIS)",
  description:
    "Unified GIS Infrastructure Monitoring, Road Progress Tracking, Traffic Chokepoint Alerts, Citizen Grievance Redressal, and Administrative Accountability Platform for Chakan MIDC & Pune District.",
  keywords: [
    "Chakan Development Forum",
    "Chakan MIDC",
    "Chakan Road Progress",
    "Chakan Flyover Tender",
    "Pune Infrastructure Transparency",
    "Chakan Traffic Monitoring",
    "PWD Maharashtra",
    "PMRDA",
    "NHAI NH-60",
    "Citizen Grievance Chakan",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="mr"
      className={`${inter.variable} ${notoSansDevanagari.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
