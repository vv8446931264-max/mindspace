import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindSpace — AI Wellness Companion for Exam Students",
  description:
    "AI-powered journaling and mental wellness support for students preparing for JEE, NEET, CUET, CAT, GATE, and UPSC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
