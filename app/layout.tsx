import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindSpace — AI Wellness Companion for Exam Students",
  description:
    "AI-powered journaling and mental wellness support for students preparing for JEE, NEET, CUET, CAT, GATE, and UPSC.",
};

export const viewport: Viewport = {
  // Warm cream: matches --paper (day register) so the browser chrome blends.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)",  color: "#221d17" },
  ],
  width: "device-width",
  initialScale: 1,
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
