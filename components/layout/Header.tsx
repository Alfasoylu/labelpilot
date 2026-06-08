"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import type { SiteNavigationItem } from "@/lib/site-content";

const AccountIcon = () => (
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
);

type HeaderProps = {
  navigation: SiteNavigationItem[];
};

export function Header({ navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setAccountOpen(false);
    setOpen(false);
    window.location.href = "/de";
  }

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
          {loggedIn ? (
            <div className="account-menu" ref={accountRef}>
              <button
                type="button"
                className="nav-link nav-link--account"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <AccountIcon />
                Mein Konto
              </button>
              {accountOpen ? (
                <div className="account-menu__pop" role="menu">
                  <Link href="/konto" role="menuitem" className="account-menu__item" onClick={() => { setAccountOpen(false); setOpen(false); }}>
                    Übersicht
                  </Link>
                  <Link href="/konto#orders" role="menuitem" className="account-menu__item" onClick={() => { setAccountOpen(false); setOpen(false); }}>
                    Bestellungen
                  </Link>
                  <Link href="/konto#designs" role="menuitem" className="account-menu__item" onClick={() => { setAccountOpen(false); setOpen(false); }}>
                    Designs
                  </Link>
                  <button type="button" role="menuitem" className="account-menu__item account-menu__logout" onClick={handleLogout}>
                    Abmelden
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/konto" className="nav-link nav-link--account" onClick={() => setOpen(false)}>
              <AccountIcon />
              Anmelden
            </Link>
          )}
          <Link href="/de/kalkulator" className="cta-link" onClick={() => setOpen(false)}>
            Preis berechnen
          </Link>
        </nav>
      </div>
    </header>
  );
}
