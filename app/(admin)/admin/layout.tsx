import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Defence-in-depth server-side auth check.
 *
 * The middleware matcher ("/admin/:path*", "/api/admin/:path*") is the primary
 * gate. This layout-level check adds a second layer so that a future routing
 * change that inadvertently bypasses the middleware does not silently expose
 * the admin UI.
 *
 * Checks the incoming Authorization header directly; returns a 401 response
 * when it is missing or incorrect. Uses constant-time comparison via Buffer to
 * match the protection level in middleware.ts.
 */
async function assertAdminAuth(): Promise<Response | null> {
  const { timingSafeEqual } = await import("node:crypto");

  const expectedUser = process.env.ADMIN_BASIC_USER?.trim() ?? "";
  const expectedPassword = process.env.ADMIN_BASIC_PASSWORD?.trim() ?? "";

  // If credentials are not configured at all, block access unconditionally.
  if (!expectedUser || !expectedPassword) {
    return new Response("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Labelpilot Admin"' },
    });
  }

  const headerList = await headers();
  const authHeader = headerList.get("authorization") ?? "";

  let user = "";
  let password = "";

  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(authHeader.slice(6).trim(), "base64").toString("utf8");
      const sep = decoded.indexOf(":");
      if (sep !== -1) {
        user = decoded.slice(0, sep);
        password = decoded.slice(sep + 1);
      }
    } catch {
      // malformed header — fall through with empty user/password
    }
  }

  function safeEqual(a: string, b: string): boolean {
    const aBuf = Buffer.from(a, "utf8");
    const bBuf = Buffer.from(b, "utf8");
    const maxLen = Math.max(aBuf.length, bBuf.length);
    const aPadded = Buffer.concat([aBuf, Buffer.alloc(maxLen - aBuf.length)]);
    const bPadded = Buffer.concat([bBuf, Buffer.alloc(maxLen - bBuf.length)]);
    return aBuf.length === bBuf.length && timingSafeEqual(aPadded, bPadded);
  }

  if (!safeEqual(user, expectedUser) || !safeEqual(password, expectedPassword)) {
    return new Response("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Labelpilot Admin"' },
    });
  }

  return null;
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authError = await assertAdminAuth();
  if (authError) return authError;

  return (
    <div className="container section-stack">
      <header className="surface-card">
        <p className="eyebrow">Admin</p>
        <h1>Labelpilot Operations</h1>
        <p className="price-note">
          Stopgap-Zugang per Basic Auth. Später durch Supabase Auth ersetzen.
        </p>
        <nav className="cta-row">
          <Link href="/admin" className="secondary-link">
            Übersicht
          </Link>
          <Link href="/admin/orders" className="secondary-link">
            Bestellungen
          </Link>
          <Link href="/admin/customers" className="secondary-link">
            Kunden
          </Link>
          <Link href="/admin/designs" className="secondary-link">
            Designs
          </Link>
          <Link href="/admin/leads" className="secondary-link">
            Leads
          </Link>
          <Link href="/admin/quotes" className="secondary-link">
            Quotes
          </Link>
          <Link href="/admin/variable-data" className="secondary-link">
            Variable Data
          </Link>
          <Link href="/admin/analytics" className="secondary-link">
            Analytik
          </Link>
          <Link href="/admin/production" className="secondary-link">
            Produktion
          </Link>
          <Link href="/admin/reorder" className="secondary-link">
            Nachbestellungen
          </Link>
          <Link href="/admin/settings/pricing" className="secondary-link">
            Preisparameter
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
