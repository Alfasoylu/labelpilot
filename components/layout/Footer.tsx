import Link from "next/link";

import type { SiteNavigationItem } from "@/lib/site-content";

type FooterGroup = {
  title: string;
  links: SiteNavigationItem[];
};

type FooterProps = {
  groups: FooterGroup[];
};

export function Footer({ groups }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h2>Labelpilot.de</h2>
          <p>
            PP-Rollenetiketten für deutsche B2B-Marken mit klarem Fokus auf
            gespeicherte Druckdaten, wiederholbare Spezifikationen und spätere
            Nachbestellung.
          </p>
          <a
            href="https://www.instagram.com/labelpilot"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Labelpilot auf Instagram"
          >
            @labelpilot
          </a>
        </div>
        <div className="footer-grid">
          {groups.map((group) => (
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
  );
}
