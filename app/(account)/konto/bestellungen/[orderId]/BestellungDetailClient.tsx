"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProofApprovalForm } from "@/components/account/ProofApprovalForm";
import { Icons, SkeletonCard, StatusBadge, StatusTimeline } from "@/components/account/ui";
import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import {
  formatFinishing,
  getArtworkStatusLabel,
  getMaterialLabel,
} from "@/lib/orders/artwork";
import {
  buildOrderTimeline,
  describeArtworkStatus,
  describeOrderStatus,
} from "@/lib/orders/status-style";

type ProofFileDetail = {
  id: string;
  fileName: string;
  status: string;
  adminNote: string | null;
  customerApprovedAt: string | null;
  createdAt: string;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  artworkStatus: string;
  productSlug: string;
  material: string;
  finishing: string | null;
  quantity: number;
  packageId: string | null;
  widthMm: number | null;
  heightMm: number | null;
  rollKern: string | null;
  abrollrichtung: string | null;
  maxRollendurchmesser: string | null;
  streetAddress: string | null;
  addressLine2: string | null;
  postalCode: string | null;
  city: string | null;
  billingCompanyName: string | null;
  billingStreetAddress: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountry: string | null;
  amountLabel: string;
  createdAt: string;
  uploadHref: string | null;
  reorderSourceDesignId: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedDeliveryAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  shipmentNote: string | null;
  proofFiles: ProofFileDetail[];
};

function buildReorderUrl(order: OrderDetail): string {
  const params = new URLSearchParams();
  params.set("quantity", String(order.quantity));

  if (order.widthMm && order.heightMm) {
    params.set("width", String(order.widthMm));
    params.set("height", String(order.heightMm));
  }

  if (order.material === "OPAQUE") params.set("material", "pp-white");
  else if (order.material === "TRANSPARENT") params.set("material", "pp-transparent");
  else if (order.material === "PAPER_WHITE") params.set("material", "paper-white");

  return `/de/kalkulator?${params.toString()}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(value));
}

export function BestellungDetailClient({ orderId }: { orderId: string }) {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
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
    if (!accessToken) { setOrder(null); return; }

    let ignore = false;

    async function loadOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/account/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json() as OrderDetail | { error: string };
        if (!res.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Bestellung konnte nicht geladen werden.");
        }
        if (!ignore) setOrder(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Unbekannter Fehler.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadOrder();
    return () => { ignore = true; };
  }, [accessToken, orderId]);

  if (!mounted || loading) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Bestelldetails</span>
          <h1>Bestellung wird geladen …</h1>
        </article>
        <div className="two-column">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!supabase || !accessToken) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Bestelldetails</span>
          <h1>Anmeldung erforderlich</h1>
          <p>Bitte melden Sie sich an, um Ihre Bestelldetails zu sehen.</p>
          <a href="/konto" className="cta-link">Zum Kundenkonto</a>
        </article>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container section-stack">
        <article className="legal-card">
          <span className="eyebrow">Bestelldetails</span>
          <h1>Bestellung nicht gefunden</h1>
          <p>{error || "Die Bestellung konnte nicht geladen werden."}</p>
          <a href="/konto" className="secondary-link">Zurück zum Kundenkonto</a>
        </article>
      </div>
    );
  }

  async function handleProofOpen(proofId: string) {
    if (!accessToken) return;
    try {
      const res = await fetch(`/api/account/orders/${orderId}/proof-file/${proofId}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.open(data.url, "_blank", "noopener");
      } else {
        setActionError(data.error ?? "Korrekturabzug konnte nicht geöffnet werden.");
      }
    } catch {
      setActionError("Korrekturabzug konnte nicht geöffnet werden.");
    }
  }

  const reorderUrl = buildReorderUrl(order);
  const isCustomSize = Boolean(order.widthMm && order.heightMm);
  const orderDesc = describeOrderStatus(order.status);
  const artworkDesc = describeArtworkStatus(order.artworkStatus);
  const timelineSteps = buildOrderTimeline({ status: order.status });

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <span className="eyebrow">Bestelldetails</span>
        <h1>{order.orderNumber}</h1>
        <p>Bestellung vom {formatDate(order.createdAt)}</p>
        <div className="cta-row">
          <button type="button" className="secondary-link" onClick={() => router.back()}>
            ← Zurück
          </button>
          <a href="/konto" className="secondary-link">Kundenkonto</a>
        </div>
      </article>

      {actionError ? <p className="form-status error" role="alert">{actionError}</p> : null}

      <div className="two-column">
        <article className="surface-card">
          <div className="account-card-head">
            <h2>Spezifikation</h2>
            <span className="account-section-icon"><Icons.IconBox size={20} /></span>
          </div>
          <ul className="simple-list">
            {isCustomSize ? (
              <li>Format: {order.widthMm} × {order.heightMm} mm (Wunschformat)</li>
            ) : (
              <li>Format: Standardpaket</li>
            )}
            <li>Material: {getMaterialLabel(order.material)}</li>
            {order.finishing ? <li>Oberfläche: {formatFinishing(order.finishing)}</li> : null}
            <li>Menge: {order.quantity.toLocaleString("de-DE")} Stück</li>
            {order.rollKern ? <li>Rollenkern: {order.rollKern}</li> : null}
            {order.abrollrichtung ? <li>Abrollrichtung: {order.abrollrichtung}</li> : null}
            {order.maxRollendurchmesser ? <li>Max. Rollendurchmesser: {order.maxRollendurchmesser}</li> : null}
          </ul>
        </article>

        <article className="surface-card">
          <div className="account-card-head">
            <h2>Status & Betrag</h2>
            <StatusBadge tone={orderDesc.tone}>{orderDesc.label}</StatusBadge>
          </div>
          <StatusTimeline steps={timelineSteps} />
          <ul className="simple-list account-status-meta">
            <li>
              Druckdaten:{" "}
              <StatusBadge tone={artworkDesc.tone} size="sm">
                {getArtworkStatusLabel(order.artworkStatus as Parameters<typeof getArtworkStatusLabel>[0])}
              </StatusBadge>
            </li>
            <li>Betrag: {order.amountLabel}</li>
          </ul>
          {order.uploadHref ? (
            <div className="cta-row">
              <a href={order.uploadHref} className="cta-link">
                {order.artworkStatus === "AWAITING_ARTWORK"
                  ? "Druckdaten hochladen"
                  : order.status === "WAITING_CUSTOMER_APPROVAL"
                    ? "Proof ansehen & freigeben"
                    : "Druckdaten & Auftrag öffnen"}
              </a>
            </div>
          ) : null}
        </article>
      </div>

      {order.streetAddress || order.billingStreetAddress ? (
        <article className="surface-card">
          <div className="account-card-head">
            <h2>Adressen</h2>
            <span className="account-section-icon"><Icons.IconProfile size={20} /></span>
          </div>
          <div className="two-column">
            {order.streetAddress ? (
              <div>
                <p className="eyebrow">Lieferadresse</p>
                <p className="account-address-block">
                  {order.streetAddress}
                  {order.addressLine2 ? `\n${order.addressLine2}` : ""}
                  {`\n${order.postalCode ?? ""} ${order.city ?? ""}`}
                </p>
              </div>
            ) : null}
            <div>
              <p className="eyebrow">Rechnungsadresse</p>
              {order.billingStreetAddress ? (
                <p className="account-address-block">
                  {order.billingCompanyName ? `${order.billingCompanyName}\n` : ""}
                  {order.billingStreetAddress}
                  {order.billingAddressLine2 ? `\n${order.billingAddressLine2}` : ""}
                  {`\n${order.billingPostalCode ?? ""} ${order.billingCity ?? ""}`}
                  {order.billingCountry ? `\n${order.billingCountry}` : ""}
                </p>
              ) : (
                <p className="field-hint">Wie Lieferadresse</p>
              )}
            </div>
          </div>
        </article>
      ) : null}

      {order.proofFiles.filter((p) => p.status === "WAITING_CUSTOMER_APPROVAL").map((proof) => (
        <article key={proof.id} className="surface-card">
          <h2>Korrekturabzug wartet auf Freigabe</h2>
          {proof.adminNote ? <p className="field-hint">{proof.adminNote}</p> : null}
          <div className="cta-row">
            <button
              type="button"
              className="secondary-link"
              onClick={() => handleProofOpen(proof.id)}
            >
              Korrekturabzug öffnen →
            </button>
          </div>
          <ProofApprovalForm
            orderId={order.id}
            proofFileId={proof.id}
            accessToken={accessToken!}
            onSuccess={() =>
              setOrder((prev) =>
                prev
                  ? {
                      ...prev,
                      status: "APPROVED_FOR_PRODUCTION",
                      proofFiles: prev.proofFiles.map((p) =>
                        p.id === proof.id ? { ...p, status: "APPROVED" } : p,
                      ),
                    }
                  : prev,
              )
            }
          />
        </article>
      ))}

      {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
        <article className="surface-card">
          <div className="account-card-head">
            <h2>Versandinformationen</h2>
            <span className="account-section-icon"><Icons.IconTruck size={20} /></span>
          </div>
          <ul className="simple-list">
            {order.shippedAt ? (
              <li>Versanddatum: {formatDate(order.shippedAt)}</li>
            ) : null}
            {order.estimatedDeliveryAt ? (
              <li>Voraussichtliche Lieferung: {formatDate(order.estimatedDeliveryAt)}</li>
            ) : null}
            {order.deliveredAt ? (
              <li>Zugestellt am: {formatDate(order.deliveredAt)}</li>
            ) : null}
            {order.trackingNumber ? (
              <li>
                Sendungsnummer:{" "}
                {order.trackingUrl ? (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                    {order.trackingNumber}
                  </a>
                ) : (
                  order.trackingNumber
                )}
              </li>
            ) : null}
            {order.shipmentNote ? <li>Hinweis: {order.shipmentNote}</li> : null}
          </ul>
          {order.trackingUrl ? (
            <div className="cta-row">
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-link"
              >
                Sendung verfolgen →
              </a>
            </div>
          ) : null}
        </article>
      )}

      <article className="surface-card">
        <div className="account-card-head">
          <h2>Nachbestellen</h2>
          <span className="account-section-icon"><Icons.IconRepeat size={20} /></span>
        </div>
        <p>
          {isCustomSize
            ? `Format ${order.widthMm} × ${order.heightMm} mm, ${getMaterialLabel(order.material)}, ${order.quantity.toLocaleString("de-DE")} Stück – im Kalkulator vorausgefüllt.`
            : `${getMaterialLabel(order.material)}, ${order.quantity.toLocaleString("de-DE")} Stück – im Kalkulator vorkonfiguriert.`}
        </p>
        <p className="field-hint">
          Format, Material und Menge werden aus dieser Bestellung übernommen. Druckdaten können aus dem Kundenkonto wiederverwendet werden.
        </p>
        <div className="cta-row">
          <a href={reorderUrl} className="cta-button">
            Im Kalkulator nachbestellen
          </a>
          <a href="/konto" className="secondary-link">
            Gespeicherte Designs ansehen
          </a>
        </div>
      </article>
    </div>
  );
}
