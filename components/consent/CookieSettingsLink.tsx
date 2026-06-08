"use client";

import { OPEN_CONSENT_EVENT } from "./ConsentBanner";

// Lets visitors re-open the consent dialog to change/withdraw their choice
// (DSGVO Art. 7(3): withdrawal must be as easy as giving consent).
export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="footer-cookie-link"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
    >
      Cookie-Einstellungen
    </button>
  );
}
