export const ROBOTS_ALLOW_PATHS = ["/de", "/de/"] as const;
export const ROBOTS_DISALLOW_PATHS = ["/account/", "/admin/", "/api/", "/lp/"] as const;
export const NON_INDEXABLE_PREFIXES = ["/account", "/admin", "/api", "/lp", "/teklif"] as const;

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
  return path.startsWith("/de") && !isNonIndexablePath(path);
}
