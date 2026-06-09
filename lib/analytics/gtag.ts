export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const ADS_CONVERSION_ID = process.env.NEXT_PUBLIC_ADS_CONVERSION_ID ?? "";
export const ADS_CONVERSION_LABEL_PURCHASE =
  process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL_PURCHASE ?? "";

export function gaEnabled() {
  return Boolean(GA_MEASUREMENT_ID);
}

type ConsentArg = "default" | "update";
type ConsentState = "granted" | "denied";

type ConsentParams = {
  analytics_storage?: ConsentState;
  ad_storage?: ConsentState;
  ad_user_data?: ConsentState;
  ad_personalization?: ConsentState;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}

function ensureDataLayer() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    // biome-ignore lint/suspicious/noExplicitAny: gtag signature
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }
}

export function gtagConsent(type: ConsentArg, params: ConsentParams) {
  ensureDataLayer();
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", type, params);
  }
}

export function gtagEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

export function gtagPurchase(params: {
  transactionId: string;
  value: number;
  currency?: string;
}) {
  gtagEvent("purchase", {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency ?? "EUR",
  });
  if (ADS_CONVERSION_ID && ADS_CONVERSION_LABEL_PURCHASE) {
    window.gtag("event", "conversion", {
      send_to: `${ADS_CONVERSION_ID}/${ADS_CONVERSION_LABEL_PURCHASE}`,
      value: params.value,
      currency: params.currency ?? "EUR",
      transaction_id: params.transactionId,
    });
  }
}
