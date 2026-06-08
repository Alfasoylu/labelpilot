import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Defense-in-depth server-side auth check.
 *
 * The middleware matcher is the primary gate. This layout-level check adds a
 * second layer so that a future routing change that inadvertently bypasses the
 * middleware does not silently expose the admin UI.
 *
 * When Supabase env vars are present, verifies the session via @supabase/ssr
 * and checks the user's email against ADMIN_EMAIL. When Supabase is not
 * configured (dev / partial env), the middleware's Basic Auth fallback has
 * already run — this layer skips silently.
 */
async function assertAdminSession(): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!supabaseUrl || !supabaseAnonKey || !adminEmail) {
    // Basic Auth mode — middleware already verified the credential.
    return;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== adminEmail) {
    redirect("/admin-login");
  }
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await assertAdminSession();

  return (
    <div className="container section-stack">
      <header className="surface-card">
        <p className="eyebrow">Admin</p>
        <h1>Labelpilot Operations</h1>
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
          <Link href="/admin/support" className="secondary-link">
            Support
          </Link>
          <Link href="/admin/variable-data" className="secondary-link">
            Variable Data
          </Link>
          <Link href="/admin/analytics" className="secondary-link">
            Analytik
          </Link>
          <Link href="/admin/visitors" className="secondary-link">
            Besucher
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
          <form action="/api/admin/auth/logout" method="post" style={{ display: "inline" }}>
            <button type="submit" className="secondary-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Abmelden
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
