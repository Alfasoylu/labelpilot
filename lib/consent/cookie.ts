// First-party consent state. The consent cookie itself is strictly necessary
// (it stores the visitor's choice) and is therefore exempt from prior consent
// under TTDSG §25(2). Analytics/marketing storage only activates when the
// visitor has explicitly granted it.

export const CONSENT_COOKIE = "lp_consent";
export const VISITOR_COOKIE = "lp_vid";
export const CONSENT_POLICY_VERSION = "v1";
export const CONSENT_CHANGED_EVENT = "lp:consent-changed";

export type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
  v: string;
};

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))) as Partial<ConsentChoice>;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return { analytics: parsed.analytics, marketing: parsed.marketing, v: parsed.v ?? CONSENT_POLICY_VERSION };
  } catch {
    return null;
  }
}

export function writeConsent(choice: Omit<ConsentChoice, "v">): ConsentChoice {
  const value: ConsentChoice = { ...choice, v: CONSENT_POLICY_VERSION };
  // 6 months, first-party, lax. Not HttpOnly so the client tracker can read it.
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
  return value;
}

export function readVisitorId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${VISITOR_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

// Visitor id is consent-gated: only created once analytics consent is granted.
export function ensureVisitorId(): string | null {
  if (typeof document === "undefined") return null;
  const existing = readVisitorId();
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `${VISITOR_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  return id;
}

export function clearVisitorId(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${VISITOR_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
