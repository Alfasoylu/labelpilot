"use client";

import Link from "next/link";
import { useState } from "react";

import type { SiteNavigationItem } from "@/lib/site-content";

type HeaderProps = {
  navigation: SiteNavigationItem[];
};

export function Header({ navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header${open ? " site-header--open" : ""}`}>
      <div className="container header-inner">
        <Link href="/de" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            LP
          </span>
          <span className="brand-copy">
            <strong>Labelpilot.de</strong>
            <span>PP-Rollenetiketten für Produktmarken</span>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>
        <nav className="header-nav" aria-label="Hauptnavigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/de/kalkulator" className="cta-link" onClick={() => setOpen(false)}>
            Preis berechnen
          </Link>
        </nav>
      </div>
    </header>
  );
}
