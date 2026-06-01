import type { Metadata } from "next";

import "./globals.css";

import { buildAbsoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(buildAbsoluteUrl("/")),
  title: "Labelpilot.de",
  description: "B2B-Etikettenplattform für deutsche Marken.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
