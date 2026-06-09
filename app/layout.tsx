import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { buildAbsoluteUrl } from "@/lib/seo";

const GTM_ID = "GTM-PZW6ZHTK";

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
  keywords: [
    "PP-Rollenetiketten",
    "PP-Etiketten",
    "Rollenetiketten B2B",
    "Etiketten drucken",
    "Labelpilot",
    "Etiketten Deutschland",
  ],
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
    title: "Labelpilot – PP-Etiketten B2B",
    description: "PP-Rollenetiketten für Lebensmittel, Getränke & Supplemente.",
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
    title: "Labelpilot – PP-Etiketten B2B",
    description: "PP-Rollenetiketten für Lebensmittel, Getränke & Supplemente.",
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
      <body>
        {/* GTM: consent defaults must be pushed to dataLayer before GTM loader fires */}
        <Script id="gtm-consent-defaults" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 2000
          });
        `}</Script>
        <Script
          id="gtm-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GoogleAnalytics />
        {children}
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
