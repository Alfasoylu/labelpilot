import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labelpilot — Individuell bedruckte Etiketten aus der Rolle",
  description:
    "Labelpilot.de — Ihr Partner für individuell bedruckte PP-Rollenetiketten und Thermoetiketten für deutsche Marken. Bald verfügbar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
