"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import type { SiteNavigationItem } from "@/lib/site-content";

type HeaderProps = {
  navigation: SiteNavigationItem[];
};

export function Header({ navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let ignore = false;

    void supabase.auth.getSession().then(({ data }) => {
      if (!ignore) setLoggedIn(Boolean(data.session));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });

    return () => {
      ignore = true;
      data.subscription.unsubscribe();
    };
  }, []);

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
          <Link
            href="/konto"
            className="nav-link nav-link--account"
            onClick={() => setOpen(false)}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
            </svg>
            {loggedIn ? "Mein Konto" : "Anmelden"}
          </Link>
          <Link href="/de/kalkulator" className="cta-link" onClick={() => setOpen(false)}>
            Preis berechnen
          </Link>
        </nav>
      </div>
    </header>
  );
}
