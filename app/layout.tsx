import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Lexend } from "next/font/google"
import "./globals.css"
import { Providers } from "@/lib/providers"
import { ThemeProvider } from "@/components/theme-provider"

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
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lexendFont.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
