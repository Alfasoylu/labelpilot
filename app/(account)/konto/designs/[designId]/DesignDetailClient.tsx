"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Icons, SkeletonCard, StatusBadge } from "@/components/account/ui";
import { ReorderStartForm } from "@/components/reorder-start-form";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import { getMaterialLabel } from "@/lib/orders/artwork";

type DesignVersion = {
  id: string;
  versionNumber: number;
  versionLabel: string;
  approvedAt: string | null;
  status: string;
  sourceType: string;
  changeSummary: string | null;
  artwork: { id: string; fileName: string } | null;
  proof: { id: string; fileName: string } | null;
};

type DesignDetail = {
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
  lastOrder: { id: string; orderNumber: string; createdAt: string } | null;
  versions: DesignVersion[];
};

type RefillPrediction = {
  id: string;
  sourceDesignId: string | null;
  predictedDepletionAt: string;
  reminderWindowDays: number;
  isEnabled: boolean;
  orderNumber: string;
};

function formatDate(value: string | null) {
  if (!value) return "Nicht vorhanden";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(value));
}

export function DesignDetailClient({ designId }: { designId: string }) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [design, setDesign] = useState<DesignDetail | null>(null);
  const [predictions, setPredictions] = useState<RefillPrediction[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let ignore = false;

    async function loadSession() {
      const { data } = await supabase!.auth.getSession();
      if (!ignore) {
        setAccessToken(data.session?.access_token ?? null);
        setLoading(false);
      }
    }

    void loadSession();

    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setAccessToken(session?.access_token ?? null);
    });

    return () => { ignore = true; data.subscription.unsubscribe(); };
  }, [supabase]);

  useEffect(() => {
    if (!accessToken) { setDesign(null); return; }
    let ignore = false;

    async function loadDesign() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/account/designs/${designId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json() as DesignDetail | { error: string };
        if (!res.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Design konnte nicht geladen werden.");
        }
        if (!ignore) setDesign(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadDesign();
    return () => { ignore = true; };
  }, [accessToken, designId]);

  useEffect(() => {
    if (!accessToken) { setPredictions([]); return; }
    let ignore = false;

    async function loadPredictions() {
      try {
        const res = await fetch(`/api/account/refill-predictions?designId=${encodeURIComponent(designId)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json() as { predictions?: RefillPrediction[] };
        if (!ignore && res.ok && data.predictions) setPredictions(data.predictions);
      } catch {
        // Erinnerungen sind optional – Fehler hier blockieren die Design-Ansicht nicht.
      }
    }

    void loadPredictions();
    return () => { ignore = true; };
  }, [accessToken, designId]);

  async function toggleReminder(id: string, next: boolean) {
    if (!accessToken) return;
    setTogglingId(id);
    try {
      const res = await fetch(`/api/account/refill-predictions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ isEnabled: next }),
      });
      const data = await res.json() as { isEnabled?: boolean; error?: string };
      if (res.ok && typeof data.isEnabled === "boolean") {
        setPredictions((prev) => prev.map((p) => (p.id === id ? { ...p, isEnabled: data.isEnabled! } : p)));
      } else {
        setError(data.error ?? "Erinnerung konnte nicht aktualisiert werden.");
      }
    } catch {
      setError("Erinnerung konnte nicht aktualisiert werden.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDownload(versionId: string, asset: "artwork" | "proof") {
    if (!accessToken) return;
    setError("");
    const res = await fetch(
      `/api/stored-designs/${designId}/versions/${versionId}${asset === "proof" ? "?asset=proof" : ""}`,
      { headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` } },
    );
    const result = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !result.url) {
      setError(result.error ?? "Datei konnte nicht bereitgestellt werden.");
      return;
    }
    window.location.href = result.url;
  }

  if (!mounted || loading) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Design-Details</span>
          <h1>Design wird geladen …</h1>
        </article>
        <SkeletonCard />
      </div>
    );
  }

  if (!supabase || !accessToken) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Design-Details</span>
          <h1>Anmeldung erforderlich</h1>
          <p>Bitte melden Sie sich an, um Ihre gespeicherten Designs zu sehen.</p>
          <a href="/konto" className="cta-link">Zum Kundenkonto</a>
        </article>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Design-Details</span>
          <h1>Design nicht gefunden</h1>
          <p>{error || "Das Design konnte nicht geladen werden."}</p>
          <a href="/konto#designs" className="secondary-link">Zurück zum Kundenkonto</a>
        </article>
      </div>
    );
  }

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Design-Details</span>
        <h1>{design.name}</h1>
        <p>
          {design.productSlug} · {design.material ? getMaterialLabel(design.material) : "Material offen"} ·{" "}
          {design.labelSize ?? "Format offen"}
        </p>
        <div className="cta-row">
          <button type="button" className="secondary-link" onClick={() => router.back()}>
            ← Zurück
          </button>
          <a href="/konto#designs" className="secondary-link">Gespeicherte Designs</a>
        </div>
      </article>

      <div className="two-column">
        <article className="surface-card">
          <div className="account-card-head">
            <h2>Spezifikation</h2>
            <span className="account-section-icon"><Icons.IconDesigns size={20} /></span>
          </div>
          <ul className="simple-list">
            <li>Produkt: {design.productSlug}</li>
            <li>Material: {design.material ? getMaterialLabel(design.material) : "Material offen"}</li>
            <li>Format: {design.labelSize ?? "Format offen"}</li>
            <li>Letzte Bestellung: {design.lastOrder?.orderNumber ?? "Nicht vorhanden"}</li>
            <li>Letzte Freigabe: {formatDate(design.lastOrderedAt)}</li>
            <li>Bisherige Nachbestellungen: {design.totalOrders.toLocaleString("de-DE")}</li>
          </ul>
        </article>

        <article className="surface-card">
          <div className="account-card-head">
            <h2>Nachbestellen</h2>
            <span className="account-section-icon"><Icons.IconRepeat size={20} /></span>
          </div>
          <p className="field-hint">
            Spezifikation und freigegebene Druckdaten werden übernommen. Identisches Artwork geht
            direkt in den Checkout.
          </p>
          <ReorderStartForm
            designId={design.id}
            accessToken={accessToken}
            defaultQuantity={design.defaultQuantity}
            currentArtworkVersionId={design.currentArtworkVersionId}
          />
        </article>
      </div>

      {predictions.length > 0 ? (
        <article className="surface-card">
          <div className="account-card-head">
            <h2>Nachbestell-Erinnerung</h2>
            <span className="account-section-icon"><Icons.IconClock size={20} /></span>
          </div>
          <p className="field-hint">
            Wir schätzen anhand Ihrer Bestandsangabe, wann der Etikettenbestand zur Neige geht, und
            erinnern Sie rechtzeitig per E-Mail – damit Sie ohne Produktionsstopp nachbestellen.
          </p>
          <div className="section-stack">
            {predictions.map((p) => (
              <div key={p.id} className="account-reminder-row">
                <span className="account-reminder-meta">
                  <span className="account-reminder-date">
                    Voraussichtlich aufgebraucht: {formatDate(p.predictedDepletionAt)}
                  </span>
                  <span className="account-reminder-sub">
                    Aus Bestellung {p.orderNumber} · Erinnerung {p.reminderWindowDays} Tage vorher
                  </span>
                </span>
                {p.isEnabled ? (
                  <span className="account-reminder-actions">
                    <StatusBadge tone="success" size="sm">
                      <Icons.IconCheck size={13} /> Aktiv
                    </StatusBadge>
                    <button
                      type="button"
                      className="secondary-link"
                      disabled={togglingId === p.id}
                      onClick={() => toggleReminder(p.id, false)}
                    >
                      Deaktivieren
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="cta-button account-reminder-cta"
                    disabled={togglingId === p.id}
                    onClick={() => toggleReminder(p.id, true)}
                  >
                    {togglingId === p.id ? "Wird aktiviert …" : "Erinnerung aktivieren"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </article>
      ) : null}

      <article className="surface-card">
        <div className="account-card-head">
          <h2>Versionsverlauf</h2>
          <span className="account-section-icon"><Icons.IconDocuments size={20} /></span>
        </div>
        {design.versions.length === 0 ? (
          <p className="price-note">Noch keine Versionen vorhanden.</p>
        ) : (
          <div className="section-stack">
            {design.versions.map((version) => {
              const isCurrent = version.id === design.currentArtworkVersionId;
              return (
                <div key={version.id} className="section-card">
                  <div className="account-card-head">
                    <h3>
                      {version.versionLabel}
                      {isCurrent ? " · aktuell" : ""}
                    </h3>
                    {isCurrent ? (
                      <StatusBadge tone="success" size="sm">
                        <Icons.IconCheck size={13} /> Aktuelle Version
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral" size="sm">{`v${version.versionNumber}`}</StatusBadge>
                    )}
                  </div>
                  <ul className="simple-list">
                    <li>Freigegeben: {formatDate(version.approvedAt)}</li>
                    {version.changeSummary ? <li>Änderung: {version.changeSummary}</li> : null}
                  </ul>
                  <div className="cta-row">
                    {version.artwork ? (
                      <button
                        type="button"
                        className="secondary-link"
                        onClick={() => handleDownload(version.id, "artwork")}
                      >
                        <Icons.IconDownload size={15} /> Druckdatei
                      </button>
                    ) : null}
                    {version.proof ? (
                      <button
                        type="button"
                        className="secondary-link"
                        onClick={() => handleDownload(version.id, "proof")}
                      >
                        <Icons.IconDownload size={15} /> Proof
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
}
