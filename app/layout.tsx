import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SadhyamIAS — Prepare. Practice. Perform.",
  description: "Competitive exam preparation platform for UPSC, UPPSC, UKPSC, RAS and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
