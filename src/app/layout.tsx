
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Lexend } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import ClientProvider from "./ClientProvider"; 
const lexendFont = Lexend({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "HireLn – AI-Powered Resume & Interview Screening Platform",
  description:
    "HireLn uses advanced AI to filter and shortlist candidates from resumes and interviews quickly and accurately. Save time and hire smarter.",
  keywords: [
    "AI hiring platform",
    "resume screening",
    "interview analysis",
    "candidate filtering",
    "automated recruitment",
    "AI recruitment tool",
  ],
  authors: [{ name: "HireLn Team", url: "https://hireln.com" }],
  creator: "HireLn",
  metadataBase: new URL("https://hireln.com"),
  openGraph: {
    title: "HireLn – AI-Powered Candidate Screening",
    description:
      "Revolutionize your hiring process with HireLn. Let AI analyze resumes and interviews to find the best candidates effortlessly.",
    url: "https://hireln.com",
    siteName: "HireLn",
    images: [
      {
        url: "https://hireln.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "HireLn AI Recruitment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLn – AI-Powered Candidate Screening",
    description:
      "Filter resumes and interviews using AI. Hire faster, smarter, and better with HireLn.",
    images: ["https://hireln.com/og-image.png"],
    site: "@HireLn",
  },
  themeColor: "#0A66C2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lexendFont.className}>
        <body className={lexendFont.className}>
        {children}
      </body>
      </body>
    </html>
  );
}
