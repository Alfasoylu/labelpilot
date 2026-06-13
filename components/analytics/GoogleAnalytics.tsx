"use client";

import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/analytics/gtag";

export function GoogleAnalytics() {
  // Consent Mode v2 default is derived from the stored lp_consent cookie BEFORE
  // the config call. First visit (no cookie) => everything denied until the user
  // accepts. Returning visitor => the default already reflects their saved choice,
  // so GA4/Ads conversions in a second session are attributed correctly instead
  // of being stuck at the denied default. ConsentBanner additionally fires a
  // consent 'update' on mount; because the default now agrees with the cookie,
  // that update is harmless regardless of script-vs-effect ordering.
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
          var lpc = null;
          try {
            var m = document.cookie.split('; ').filter(function(r){return r.indexOf('lp_consent=') === 0;})[0];
            if (m) {
              var p = JSON.parse(decodeURIComponent(m.split('=').slice(1).join('=')));
              if (p && typeof p.analytics === 'boolean' && typeof p.marketing === 'boolean') { lpc = p; }
            }
          } catch (e) { lpc = null; }
          gtag('consent', 'default', {
            analytics_storage: lpc && lpc.analytics ? 'granted' : 'denied',
            ad_storage: lpc && lpc.marketing ? 'granted' : 'denied',
            ad_user_data: lpc && lpc.marketing ? 'granted' : 'denied',
            ad_personalization: lpc && lpc.marketing ? 'granted' : 'denied',
            wait_for_update: 2000
          });
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
