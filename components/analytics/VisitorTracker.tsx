"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { CONSENT_CHANGED_EVENT, ensureVisitorId, readConsent } from "@/lib/consent/cookie";

// Consent-gated first-party tracker. It only sends anything once the visitor
// has granted analytics consent (checked live on every send). It records page
// views on route change and forwards the existing trackLeadEvent() events
// (dispatched as "labelpilot:analytics") so they finally get persisted.
export function VisitorTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  function send(eventType: string, metadata?: Record<string, unknown>) {
    const consent = readConsent();
    if (!consent?.analytics) return;
    const visitorId = ensureVisitorId();
    if (!visitorId) return;

    const params = new URLSearchParams(window.location.search);
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        visitorId,
        eventType,
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
        metadata,
      }),
    }).catch(() => {});
  }

  // Page view on initial load + every route change.
  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    send("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // When consent is granted later, record the current page immediately.
  useEffect(() => {
    const onConsentChanged = () => {
      const consent = readConsent();
      if (consent?.analytics) send("page_view");
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist existing trackLeadEvent() events (quote_form_submit, reorder_*, …).
  useEffect(() => {
    const onLeadEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail as { event?: string } & Record<string, unknown>;
      if (!detail?.event) return;
      const { event, ...rest } = detail;
      send(event, rest);
    };
    window.addEventListener("labelpilot:analytics", onLeadEvent as EventListener);
    return () => window.removeEventListener("labelpilot:analytics", onLeadEvent as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
