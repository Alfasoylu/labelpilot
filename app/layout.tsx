import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Sans } from "next/font/google";

import "./globals.css";

import { buildAbsoluteUrl } from "@/lib/seo";

const fontHeading = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(buildAbsoluteUrl("/")),
  title: "Labelpilot.de",
  description: "B2B-Etikettenplattform für deutsche Marken.",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    siteName: "Labelpilot.de",
    locale: "de_DE",
    type: "website",
    url: buildAbsoluteUrl("/de"),
    title: "Labelpilot.de",
    description: "B2B-Etikettenplattform für deutsche Marken.",
    images: [
      {
        url: buildAbsoluteUrl("/images/og-default-labelpilot-1200x630.png"),
        width: 1200,
        height: 630,
        alt: "labelpilot.de — PP-Rollenetiketten für Produktmarken",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      buildAbsoluteUrl("/images/og-default-labelpilot-1200x630.png"),
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
