import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Labelpilot.de",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
