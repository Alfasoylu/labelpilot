"use client";

import { useEffect, useState } from "react";

import {
  ensureVisitorId,
  readConsent,
  readVisitorId,
  writeConsent,
  clearVisitorId,
} from "@/lib/consent/cookie";
import { gtagConsent } from "@/lib/analytics/gtag";

export const OPEN_CONSENT_EVENT = "lp:open-consent";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Show on first visit (no stored choice). Otherwise stay hidden until the
    // visitor re-opens the settings via the footer link.
    const current = readConsent();
    if (!current) {
      setOpen(true);
    } else {
      setAnalytics(current.analytics);
      setMarketing(current.marketing);
    }
    const onOpen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setShowSettings(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  function persist(choice: { analytics: boolean; marketing: boolean }) {
    writeConsent(choice);
    let visitorId: string | null = readVisitorId();
    if (choice.analytics) {
      visitorId = ensureVisitorId();
    } else {
      clearVisitorId();
      visitorId = null;
    }
    // Google Consent Mode v2 — update based on user choice
    gtagConsent("update", {
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: choice.marketing ? "granted" : "denied",
      ad_user_data: choice.marketing ? "granted" : "denied",
      ad_personalization: choice.marketing ? "granted" : "denied",
    });
    void fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...choice, visitorId: visitorId ?? undefined }),
    }).catch(() => {});
    setOpen(false);
    setShowSettings(false);
  }

  if (!open) return null;

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label="Cookie-Einstellungen">
      <div className="consent-banner__inner">
        <div className="consent-banner__body">
          <strong className="consent-banner__title">Datenschutz-Einstellungen</strong>
          <p className="consent-banner__text">
            Wir verwenden notwendige Cookies für den Betrieb der Seite. Mit Ihrer Einwilligung
            nutzen wir zusätzlich anonyme Statistik-Cookies, um die Website zu verbessern. Sie
            können Ihre Auswahl jederzeit ändern. Mehr in unserer{" "}
            <a href="/de/datenschutz" className="consent-banner__link">Datenschutzerklärung</a>.
          </p>

          {showSettings ? (
            <div className="consent-banner__options">
              <label className="consent-banner__option">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Notwendig</strong> – für Anmeldung, Warenkorb-Funktion und Sicherheit
                  erforderlich. Immer aktiv.
                </span>
              </label>
              <label className="consent-banner__option">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span>
                  <strong>Statistik</strong> – anonyme Nutzungsmessung (Seitenaufrufe, Herkunft),
                  um die Website zu verbessern.
                </span>
              </label>
              <label className="consent-banner__option">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span>
                  <strong>Marketing</strong> – Messung von Kampagnen. Aktuell nicht aktiv genutzt.
                </span>
              </label>
            </div>
          ) : null}
        </div>

        <div className="consent-banner__actions">
          {showSettings ? (
            <button type="button" className="cta-button" onClick={() => persist({ analytics, marketing })}>
              Auswahl speichern
            </button>
          ) : (
            <>
              <button
                type="button"
                className="cta-button"
                onClick={() => persist({ analytics: true, marketing: true })}
              >
                Alle akzeptieren
              </button>
              <button
                type="button"
                className="secondary-link"
                onClick={() => persist({ analytics: false, marketing: false })}
              >
                Nur notwendige
              </button>
              <button
                type="button"
                className="secondary-link"
                onClick={() => setShowSettings(true)}
              >
                Einstellungen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
