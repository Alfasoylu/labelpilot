"use client";

import { useEffect, useState } from "react";

import { ReorderStartForm } from "@/components/reorder-start-form";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import {
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
} from "@/lib/orders/artwork";

type AccountOrder = {
  id: string;
  orderNumber: string;
  status: string;
  artworkStatus: "AWAITING_ARTWORK" | "ARTWORK_UPLOADED" | "ARTWORK_APPROVED";
  productSlug: string;
  material: string;
  quantity: number;
  amountLabel: string;
  createdAt: string;
  uploadHref: string | null;
};

type AccountArtworkVersion = {
  id: string;
  versionLabel: string;
  approvedAt: string | null;
  status: string;
  originalArtworkFile: { fileName: string } | null;
  proofFile: { fileName: string } | null;
};

type AccountStoredDesign = {
  id: string;
  name: string;
  productSlug: string;
  labelSize: string | null;
  material: string | null;
  defaultQuantity: number | null;
  status: string;
  currentArtworkVersionId: string | null;
  lastOrderedAt: string | null;
  totalOrders: number;
  lastOrder: {
    id: string;
    orderNumber: string;
    createdAt: string;
  } | null;
  currentArtworkVersion: AccountArtworkVersion | null;
  artworkVersions: AccountArtworkVersion[];
};

type AccountDashboard = {
  customer: {
    email: string;
    companyName: string | null;
    contactName: string | null;
  };
  orders: AccountOrder[];
  storedDesigns: AccountStoredDesign[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Nicht vorhanden";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function KontoClient() {
  const supabase = getSupabaseBrowserClient();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AccountDashboard | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const client = supabase;

    if (!client) {
      setLoading(false);
      return;
    }

    const activeClient = client;
    let ignore = false;

    async function loadSession() {
      const { data } = await activeClient.auth.getSession();
      const token = data.session?.access_token ?? null;

      if (!ignore) {
        setAccessToken(token);
        setLoading(false);
      }
    }

    void loadSession();

    const { data } = activeClient.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null);
    });

    return () => {
      ignore = true;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!accessToken) {
      setDashboard(null);
      return;
    }

    let ignore = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/account/dashboard", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = (await response.json()) as AccountDashboard | { error: string };

        if (!response.ok || "error" in result) {
          throw new Error("error" in result ? result.error : "Kundenkonto konnte nicht geladen werden.");
        }

        if (!ignore) {
          setDashboard(result);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : "Kundenkonto konnte nicht geladen werden.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, [accessToken]);

  async function handleLogin(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setPending(false);

    if (loginError) {
      setError("Die Anmeldung ist fehlgeschlagen.");
      return;
    }

    setMessage("Sie sind angemeldet.");
  }

  async function handleRegister(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("registerEmail") ?? "");
    const password = String(formData.get("registerPassword") ?? "");
    const companyName = String(formData.get("companyName") ?? "");
    const contactName = String(formData.get("contactName") ?? "");
    const { error: registerError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          companyName,
          contactName,
        },
      },
    });

    setPending(false);

    if (registerError) {
      setError("Das Konto konnte nicht erstellt werden.");
      return;
    }

    setMessage("Konto angelegt. Bitte bestätigen Sie bei Bedarf die E-Mail von Supabase.");
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("Sie sind abgemeldet.");
  }

  async function handleDownload(designId: string, versionId: string, asset: "artwork" | "proof") {
    if (!accessToken) return;
    setError("");

    const response = await fetch(
      `/api/stored-designs/${designId}/versions/${versionId}${asset === "proof" ? "?asset=proof" : ""}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setError(result.error ?? "Datei konnte nicht bereitgestellt werden.");
      return;
    }

    window.location.href = result.url;
  }

  if (!mounted) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Kundenkonto wird geladen …</h1>
          <p>Einen Moment bitte – Ihr Konto wird vorbereitet.</p>
        </article>
      </AccountShell>
    );
  }

  if (!supabase) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Kundenkonto derzeit nicht verfügbar</h1>
          <p>
            Die Supabase-Konfiguration für die Anmeldung fehlt. Bestehende Aufträge bleiben
            über den sicheren Bestelllink zugänglich; für neue Anfragen nutzen Sie bitte das
            Angebotsformular.
          </p>
          <a href="/de/angebot-anfordern" className="cta-link">
            Angebot anfordern
          </a>
        </article>
      </AccountShell>
    );
  }

  if (!accessToken) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Anmelden und Etiketten schneller nachbestellen</h1>
          <p>
            Im Kundenkonto sehen Sie Ihre Bestellungen, gespeicherte Druckdaten und starten
            Nachbestellungen aus freigegebenen Designs. Der bisherige sichere Bestelllink
            bleibt als Fallback bestehen.
          </p>
        </article>

        <div className="two-column">
          <form action={handleLogin} className="surface-card quote-form">
            <h2>Anmelden</h2>
            <label htmlFor="email">E-Mail-Adresse</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
            <label htmlFor="password">Passwort</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
            <button type="submit" className="cta-button" disabled={pending}>
              {pending ? "Bitte warten..." : "Anmelden"}
            </button>
          </form>

          <form action={handleRegister} className="surface-card quote-form">
            <h2>Konto erstellen</h2>
            <label htmlFor="companyName">Firmenname</label>
            <input id="companyName" name="companyName" autoComplete="organization" />
            <label htmlFor="contactName">Ansprechpartner</label>
            <input id="contactName" name="contactName" autoComplete="name" />
            <label htmlFor="registerEmail">E-Mail-Adresse</label>
            <input id="registerEmail" name="registerEmail" type="email" required autoComplete="email" />
            <label htmlFor="registerPassword">Passwort</label>
            <input id="registerPassword" name="registerPassword" type="password" required autoComplete="new-password" minLength={8} />
            <button type="submit" className="cta-button" disabled={pending}>
              {pending ? "Bitte warten..." : "Konto erstellen"}
            </button>
          </form>
        </div>

        <StatusMessage message={message} error={error} />
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <article className="legal-card">
        <span className="eyebrow">Kundenkonto</span>
        <h1>Meine Bestellungen und gespeicherten Druckdaten</h1>
        <p>
          Ihr Konto verknüpft Bestellungen über die verifizierte E-Mail-Adresse. Die
          Nachbestellung nutzt gespeicherte Spezifikation und freigegebene Druckdaten; bei
          20.000+ Stück oder Sonderwünschen geht der Vorgang ins Angebot.
        </p>
        <div className="cta-row">
          <button type="button" className="secondary-link" onClick={handleLogout}>
            Abmelden
          </button>
          <a href="/de/angebot-anfordern" className="secondary-link">
            Angebot anfordern
          </a>
        </div>
      </article>

      <StatusMessage message={message} error={error} />

      {loading ? <p className="price-note">Kundenkonto wird geladen...</p> : null}

      {dashboard ? (
        <>
          <article className="surface-card">
            <h2>Kontodaten</h2>
            <ul className="simple-list">
              <li>E-Mail: {dashboard.customer.email}</li>
              <li>Firma: {dashboard.customer.companyName ?? "Nicht hinterlegt"}</li>
              <li>Ansprechpartner: {dashboard.customer.contactName ?? "Nicht hinterlegt"}</li>
            </ul>
            <p className="field-hint">
              Rechnungskauf / Net-14 ist nur nach manueller Freigabe über Angebot oder Account-Betreuung möglich.
              Im Self-Serve-Checkout wird kein automatischer Rechnungskauf angeboten.
            </p>
          </article>

          <article className="surface-card">
            <h2>Meine Bestellungen</h2>
            {dashboard.orders.length === 0 ? (
              <p className="price-note">
                Noch keine verknüpften Bestellungen. Sobald eine Bestellung mit dieser E-Mail
                vorliegt, erscheint sie hier.
              </p>
            ) : (
              <div className="section-stack">
                {dashboard.orders.map((order) => (
                  <div key={order.id} className="section-card">
                    <h3>{order.orderNumber}</h3>
                    <p className="price-note">
                      {order.quantity.toLocaleString("de-DE")} Stück - {getMaterialLabel(order.material)} - {order.amountLabel}
                    </p>
                    <ul className="simple-list">
                      <li>Status: {getOrderStatusLabel(order.status)}</li>
                      <li>Druckdaten: {getArtworkStatusLabel(order.artworkStatus)}</li>
                      <li>Bestelldatum: {formatDate(order.createdAt)}</li>
                    </ul>
                    {order.uploadHref ? (
                      <div className="cta-row">
                        <a href={order.uploadHref} className="cta-link">
                          {order.artworkStatus === "AWAITING_ARTWORK"
                            ? "Druckdaten hochladen"
                            : order.status === "WAITING_CUSTOMER_APPROVAL"
                              ? "Proof ansehen und freigeben"
                              : "Auftrag & Druckdaten öffnen"}
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="surface-card">
            <h2>Gespeicherte Designs</h2>
            {dashboard.storedDesigns.length === 0 ? (
              <p className="price-note">
                Noch keine freigegebenen Designs gespeichert. Nach Freigabe eines Auftrags wird
                die Spezifikation für spätere Nachbestellungen vorbereitet.
              </p>
            ) : (
              <div className="section-stack">
                {dashboard.storedDesigns.map((design) => (
                  <div key={design.id} className="section-card">
                    <h3>{design.name}</h3>
                    <p className="price-note">
                      {design.productSlug} - {design.material ? getMaterialLabel(design.material) : "Material offen"} - {design.labelSize ?? "Format offen"}
                    </p>
                    <ul className="simple-list">
                      <li>Letzte Bestellung: {design.lastOrder?.orderNumber ?? "Nicht vorhanden"}</li>
                      <li>Letzte Freigabe: {formatDate(design.currentArtworkVersion?.approvedAt ?? null)}</li>
                      <li>Bisherige Nachbestellungen: {design.totalOrders.toLocaleString("de-DE")}</li>
                    </ul>

                    {design.currentArtworkVersion ? (
                      <div className="cta-row">
                        {design.currentArtworkVersion.originalArtworkFile ? (
                          <button
                            type="button"
                            className="secondary-link"
                            onClick={() =>
                              handleDownload(design.id, design.currentArtworkVersion!.id, "artwork")
                            }
                          >
                            Druckdatei herunterladen
                          </button>
                        ) : null}
                        {design.currentArtworkVersion.proofFile ? (
                          <button
                            type="button"
                            className="secondary-link"
                            onClick={() =>
                              handleDownload(design.id, design.currentArtworkVersion!.id, "proof")
                            }
                          >
                            Proof herunterladen
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    <ReorderStartForm
                      designId={design.id}
                      accessToken={accessToken}
                      defaultQuantity={design.defaultQuantity}
                      currentArtworkVersionId={design.currentArtworkVersionId}
                    />
                  </div>
                ))}
              </div>
            )}
          </article>
        </>
      ) : null}
    </AccountShell>
  );
}

function AccountShell({ children }: { children: React.ReactNode }) {
  return <div className="container section-stack">{children}</div>;
}

function StatusMessage({ message, error }: { message: string; error: string }) {
  return (
    <>
      {message ? <p className="form-status success">{message}</p> : null}
      {error ? <p className="form-status error">{error}</p> : null}
    </>
  );
}
