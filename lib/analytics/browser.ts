export function trackLeadEvent(eventName: string, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { event: eventName, ...detail };
  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;

  if (Array.isArray(dataLayer)) {
    dataLayer.push(payload);
  }

  window.dispatchEvent(
    new CustomEvent("labelpilot:analytics", {
      detail: payload,
    }),
  );
}
