import { customSizeFeatureEnabled } from "../pricing/custom-size-feature.ts";
import { deferredPhase2Routes } from "../site-content.ts";

export const ROBOTS_ALLOW_PATHS = ["/de", "/de/"] as const;
export const ROBOTS_DISALLOW_PATHS = [
  "/account/",
  "/admin/",
  "/api/",
  "/checkout/",
  "/de/auftrag/",
  "/de/checkout",
  "/de/gespeicherte-druckdaten",
  "/lp/",
  "/teklif/",
] as const;
export const NON_INDEXABLE_PREFIXES = [
  "/account",
  "/admin",
  "/api",
  "/checkout",
  "/de/auftrag",
  "/de/checkout",
  "/de/gespeicherte-druckdaten",
  "/lp",
  "/teklif",
] as const;
const FEATURE_GATED_SITEMAP_PATHS = {
  "/de/wunschformat": customSizeFeatureEnabled,
} as const;
const DEFERRED_DE_PUBLIC_PATHS = new Set(deferredPhase2Routes);

export function buildAbsoluteUrlFromBase(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/$/, "");

  if (!path || path === "/") {
    return normalizedBase;
  }

  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isNonIndexablePath(path: string) {
  return NON_INDEXABLE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function isSitemapEligiblePath(path: string) {
  if (!path.startsWith("/de") || isNonIndexablePath(path)) {
    return false;
  }

  if (DEFERRED_DE_PUBLIC_PATHS.has(path)) {
    return false;
  }

  if (path in FEATURE_GATED_SITEMAP_PATHS) {
    return FEATURE_GATED_SITEMAP_PATHS[path as keyof typeof FEATURE_GATED_SITEMAP_PATHS];
  }

  return true;
}
