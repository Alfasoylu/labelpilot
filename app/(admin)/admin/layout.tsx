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
          Stopgap-Zugang per Basic Auth. Spaeter durch Supabase Auth ersetzen.
        </p>
        <nav className="cta-row">
          <Link href="/admin" className="secondary-link">
            Uebersicht
          </Link>
          <Link href="/admin/orders" className="secondary-link">
            Bestellungen
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
