"use client";

import { useEffect, useState } from "react";

import { ProofApprovalForm } from "@/components/account/ProofApprovalForm";
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
  trackingUrl: string | null;
  latestProof: {
    id: string;
    fileName: string;
    status: string;
    adminNote: string | null;
  } | null;
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
    phone: string | null;
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

  const [editMode, setEditMode] = useState(false);
  const [profileFields, setProfileFields] = useState({
    contactName: "",
    companyName: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newPasswordMsg, setNewPasswordMsg] = useState("");

  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [changePasswordMsg, setChangePasswordMsg] = useState("");

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

    const { data } = activeClient.auth.onAuthStateChange((event, session) => {
      setAccessToken(session?.access_token ?? null);
      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }
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

    setMessage("Konto angelegt. Bitte bestätigen Sie Ihre E-Mail-Adresse, falls eine Bestätigungsmail zugestellt wurde.");
  }

  async function handleChangePassword(formData: FormData) {
    if (!supabase) return;
    const pwd = String(formData.get("changePwd") ?? "");
    const confirm = String(formData.get("changePwdConfirm") ?? "");

    if (pwd.length < 8) {
      setChangePasswordMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (pwd !== confirm) {
      setChangePasswordMsg("Die Passwörter stimmen nicht überein.");
      return;
    }

    setPending(true);
    setChangePasswordMsg("");
    const { error: updateError } = await supabase.auth.updateUser({ password: pwd });
    setPending(false);

    if (updateError) {
      setChangePasswordMsg("Passwort konnte nicht geändert werden.");
      return;
    }

    setChangePasswordMode(false);
    setChangePasswordMsg("Passwort erfolgreich geändert.");
  }

  async function handleForgotPassword(formData: FormData) {
    if (!supabase) return;
    setPending(true);
    setError("");
    setMessage("");

    const email = String(formData.get("forgotEmail") ?? "");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined"
        ? `${window.location.origin}/konto`
        : undefined,
    });

    setPending(false);

    if (resetError) {
      setError("Der Reset-Link konnte nicht gesendet werden.");
      return;
    }

    setForgotMode(false);
    setMessage("Reset-Link wurde an Ihre E-Mail-Adresse gesendet. Bitte prüfen Sie Ihr Postfach.");
  }

  async function handlePasswordUpdate(formData: FormData) {
    if (!supabase) return;
    const pwd = String(formData.get("newPassword") ?? "");
    const confirm = String(formData.get("confirmPassword") ?? "");

    if (pwd.length < 8) {
      setNewPasswordMsg("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (pwd !== confirm) {
      setNewPasswordMsg("Die Passwörter stimmen nicht überein.");
      return;
    }

    setPending(true);
    setNewPasswordMsg("");

    const { error: updateError } = await supabase.auth.updateUser({ password: pwd });

    setPending(false);

    if (updateError) {
      setNewPasswordMsg("Passwort konnte nicht gesetzt werden.");
      return;
    }

    setPasswordRecovery(false);
    setNewPassword("");
    setNewPasswordConfirm("");
    setMessage("Passwort erfolgreich aktualisiert.");
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("Sie sind abgemeldet.");
  }

  function handleEditStart() {
    if (!dashboard) return;
    setProfileFields({
      contactName: dashboard.customer.contactName ?? "",
      companyName: dashboard.customer.companyName ?? "",
      phone: dashboard.customer.phone ?? "",
    });
    setProfileMsg("");
    setEditMode(true);
  }

  async function handleProfileSave() {
    if (!accessToken) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileFields),
      });
      const data = (await res.json()) as {
        contactName?: string | null;
        companyName?: string | null;
        phone?: string | null;
        error?: string;
      };
      if (!res.ok) {
        setProfileMsg(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              customer: {
                ...prev.customer,
                contactName: data.contactName ?? null,
                companyName: data.companyName ?? null,
                phone: data.phone ?? null,
              },
            }
          : prev,
      );
      setEditMode(false);
      setProfileMsg("Profil gespeichert.");
    } catch {
      setProfileMsg("Speichern fehlgeschlagen.");
    } finally {
      setProfileSaving(false);
    }
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

  if (passwordRecovery) {
    return (
      <AccountShell>
        <article className="legal-card">
          <span className="eyebrow">Kundenkonto</span>
          <h1>Neues Passwort setzen</h1>
          <p>Bitte wählen Sie ein neues Passwort für Ihr Konto.</p>
        </article>
        <form action={handlePasswordUpdate} className="surface-card quote-form">
          <label htmlFor="newPassword">Neues Passwort</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">Passwort bestätigen</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
          {newPasswordMsg ? <p className="form-status error">{newPasswordMsg}</p> : null}
          <button type="submit" className="cta-button" disabled={pending}>
            {pending ? "Bitte warten ..." : "Passwort aktualisieren"}
          </button>
        </form>
        <StatusMessage message={message} error={error} />
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
          {forgotMode ? (
            <form action={handleForgotPassword} className="surface-card quote-form">
              <h2>Passwort vergessen</h2>
              <p className="field-hint">
                Wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
              </p>
              <label htmlFor="forgotEmail">E-Mail-Adresse</label>
              <input id="forgotEmail" name="forgotEmail" type="email" required autoComplete="email" />
              <button type="submit" className="cta-button" disabled={pending}>
                {pending ? "Bitte warten ..." : "Reset-Link senden"}
              </button>
              <button
                type="button"
                className="secondary-link"
                onClick={() => setForgotMode(false)}
              >
                Zurück zur Anmeldung
              </button>
            </form>
          ) : (
            <form action={handleLogin} className="surface-card quote-form">
              <h2>Anmelden</h2>
              <label htmlFor="email">E-Mail-Adresse</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
              <label htmlFor="password">Passwort</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" />
              <button type="submit" className="cta-button" disabled={pending}>
                {pending ? "Bitte warten ..." : "Anmelden"}
              </button>
              <button
                type="button"
                className="secondary-link"
                style={{ fontSize: "0.88rem" }}
                onClick={() => { setForgotMode(true); setError(""); setMessage(""); }}
              >
                Passwort vergessen?
              </button>
            </form>
          )}

          <form action={handleRegister} className="surface-card quote-form" style={{ alignSelf: "flex-start" }}>
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
            {editMode ? (
              <div className="section-stack">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="konto-firma">Firma</label>
                    <input
                      id="konto-firma"
                      value={profileFields.companyName}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, companyName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="konto-kontakt">Ansprechpartner</label>
                    <input
                      id="konto-kontakt"
                      value={profileFields.contactName}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, contactName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="konto-phone">Telefon</label>
                    <input
                      id="konto-phone"
                      type="tel"
                      value={profileFields.phone}
                      onChange={(e) =>
                        setProfileFields((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
                {profileMsg ? <p className="form-status error">{profileMsg}</p> : null}
                <div className="inline-actions">
                  <button
                    type="button"
                    className="cta-button"
                    disabled={profileSaving}
                    onClick={handleProfileSave}
                  >
                    {profileSaving ? "Wird gespeichert ..." : "Speichern"}
                  </button>
                  <button
                    type="button"
                    className="secondary-link"
                    disabled={profileSaving}
                    onClick={() => { setEditMode(false); setProfileMsg(""); }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="simple-list">
                  <li>E-Mail: {dashboard.customer.email}</li>
                  <li>Firma: {dashboard.customer.companyName ?? "Nicht hinterlegt"}</li>
                  <li>Ansprechpartner: {dashboard.customer.contactName ?? "Nicht hinterlegt"}</li>
                  {dashboard.customer.phone ? <li>Telefon: {dashboard.customer.phone}</li> : null}
                </ul>
                {profileMsg ? <p className="form-status success">{profileMsg}</p> : null}
                <div className="cta-row">
                  <button type="button" className="secondary-link" onClick={handleEditStart}>
                    Profil bearbeiten
                  </button>
                </div>
              </>
            )}
            <p className="field-hint">
              Rechnungskauf / Net-14 ist nur nach manueller Freigabe über Angebot oder
              Account-Betreuung möglich. Im Self-Serve-Checkout wird kein automatischer
              Rechnungskauf angeboten.
            </p>
          </article>

          <article className="surface-card">
            <h2>Passwort</h2>
            {changePasswordMode ? (
              <form action={handleChangePassword} className="section-stack">
                <div className="form-grid">
                  <div>
                    <label htmlFor="changePwd">Neues Passwort</label>
                    <input
                      id="changePwd"
                      name="changePwd"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="changePwdConfirm">Neues Passwort bestätigen</label>
                    <input
                      id="changePwdConfirm"
                      name="changePwdConfirm"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                {changePasswordMsg ? (
                  <p className="form-status error">{changePasswordMsg}</p>
                ) : null}
                <div className="inline-actions">
                  <button type="submit" className="cta-button" disabled={pending}>
                    {pending ? "Bitte warten ..." : "Passwort ändern"}
                  </button>
                  <button
                    type="button"
                    className="secondary-link"
                    onClick={() => { setChangePasswordMode(false); setChangePasswordMsg(""); }}
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            ) : (
              <>
                {changePasswordMsg ? (
                  <p className="form-status success">{changePasswordMsg}</p>
                ) : null}
                <div className="cta-row">
                  <button
                    type="button"
                    className="secondary-link"
                    onClick={() => { setChangePasswordMode(true); setChangePasswordMsg(""); }}
                  >
                    Passwort ändern
                  </button>
                </div>
              </>
            )}
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
                      {order.quantity.toLocaleString("de-DE")} Stück – {getMaterialLabel(order.material)} – {order.amountLabel}
                    </p>
                    <ul className="simple-list">
                      <li>Status: {getOrderStatusLabel(order.status)}</li>
                      <li>Druckdaten: {getArtworkStatusLabel(order.artworkStatus)}</li>
                      <li>Bestelldatum: {formatDate(order.createdAt)}</li>
                    </ul>
                    {order.latestProof ? (
                      <div className="proof-banner">
                        <p>
                          <strong>Korrekturabzug wartet auf Ihre Freigabe.</strong>
                        </p>
                        {order.latestProof.adminNote ? (
                          <p className="field-hint">{order.latestProof.adminNote}</p>
                        ) : null}
                        <ProofApprovalForm
                          orderId={order.id}
                          proofFileId={order.latestProof.id}
                          accessToken={accessToken!}
                          onSuccess={() => {
                            setDashboard((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    orders: prev.orders.map((o) =>
                                      o.id === order.id
                                        ? { ...o, latestProof: null, status: "APPROVED_FOR_PRODUCTION" }
                                        : o,
                                    ),
                                  }
                                : prev,
                            );
                          }}
                        />
                        <a
                          href={`/api/account/orders/${order.id}/proof-file/${order.latestProof.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="secondary-link"
                        >
                          Korrekturabzug öffnen →
                        </a>
                      </div>
                    ) : null}
                    <div className="cta-row">
                      {order.uploadHref && !order.latestProof ? (
                        <a href={order.uploadHref} className="cta-link">
                          {order.artworkStatus === "AWAITING_ARTWORK"
                            ? "Druckdaten hochladen"
                            : "Auftrag & Druckdaten öffnen"}
                        </a>
                      ) : null}
                      {order.trackingUrl &&
                      (order.status === "SHIPPED" || order.status === "DELIVERED") ? (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-link"
                        >
                          Sendung verfolgen →
                        </a>
                      ) : null}
                      <a href={`/konto/bestellungen/${order.id}`} className="secondary-link">
                        Details &amp; Nachbestellen
                      </a>
                    </div>
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
