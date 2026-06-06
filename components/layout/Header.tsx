import Link from "next/link";

import type { SiteNavigationItem } from "@/lib/site-content";

type HeaderProps = {
  navigation: SiteNavigationItem[];
};

export function Header({ navigation }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/de" className="brand">
          <span className="brand-mark" aria-hidden="true">
            LP
          </span>
          <span className="brand-copy">
            <strong>Labelpilot.de</strong>
            <span>Etiketten-Infrastruktur für kleine Produktmarken</span>
          </span>
        </Link>
        <nav className="header-nav" aria-label="Hauptnavigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <Link href="/de/kalkulator" className="cta-link">
            Preis berechnen
          </Link>
        </nav>
      </div>
    </header>
  );
}
