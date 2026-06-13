import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "MindSpace — AI Wellness Companion for Exam Students",
  description:
    "AI-powered journaling and mental wellness support for students preparing for JEE, NEET, CUET, CAT, GATE, and UPSC.",
};

export const viewport: Viewport = {
  themeColor: "#5B8DEF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
