import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renx-Play",
  description: "A modern game listing platform for visual novels and adult games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}