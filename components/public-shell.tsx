import Link from "next/link";

import { footerLinks, siteNavigation } from "@/lib/site-content";

export function PublicShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/de" className="brand">
            <span className="brand-mark" aria-hidden="true">
              LP
            </span>
            <span className="brand-copy">
              <strong>Labelpilot.de</strong>
              <span>PP-Rollenetiketten für deutsche B2B-Marken</span>
            </span>
          </Link>
          <nav className="header-nav" aria-label="Hauptnavigation">
            {siteNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <Link href="/de/angebot-anfordern" className="cta-link">
              Angebot anfordern
            </Link>
          </nav>
        </div>
      </header>
      <main className="page-main">{children}</main>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <h2>Labelpilot.de</h2>
            <p>
              Individuell bedruckte PP-Rollenetiketten und ergänzende
              Thermoetiketten für Lebensmittel-, Getränke- und
              Supplement-Marken in Deutschland.
            </p>
          </div>
          <div className="footer-grid">
            {footerLinks.map((group) => (
              <div key={group.title} className="footer-link">
                <h3>{group.title}</h3>
                <ul className="footer-list">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
