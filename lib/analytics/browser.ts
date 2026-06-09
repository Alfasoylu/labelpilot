export function trackLeadEvent(eventName: string, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { event: eventName, ...detail };
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;

  if (Array.isArray(dataLayer)) {
    dataLayer.push(payload);
  }

  // GA4 standard lead conversion event — fires for quote and sample-box submits.
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", { lead_type: eventName, ...detail });
  }

  window.dispatchEvent(
    new CustomEvent("labelpilot:analytics", {
      detail: payload,
    }),
  );
}
