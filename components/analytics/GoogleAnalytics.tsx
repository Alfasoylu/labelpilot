"use client";

import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/analytics/gtag";

export function GoogleAnalytics() {
  // Consent Mode v2 defaults (everything denied until the user accepts) are set
  // by the inline gtag-init script below, before the config call — that is the
  // single authoritative source. ConsentBanner later fires consent 'update'.
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 2000
          });
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
