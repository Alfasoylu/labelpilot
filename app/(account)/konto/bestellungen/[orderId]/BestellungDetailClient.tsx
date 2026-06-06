"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseBrowserClient } from "@/lib/auth/supabase-browser";
import {
  formatFinishing,
  getArtworkStatusLabel,
  getMaterialLabel,
  getOrderStatusLabel,
} from "@/lib/orders/artwork";

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
  amountLabel: string;
  createdAt: string;
  uploadHref: string | null;
  reorderSourceDesignId: string | null;
};

function buildReorderUrl(order: OrderDetail): string {
  const params = new URLSearchParams();
  params.set("q", String(order.quantity));

  if (order.widthMm && order.heightMm) {
    params.set("w", String(order.widthMm));
    params.set("h", String(order.heightMm));
  }

  if (order.material === "OPAQUE") params.set("m", "pp-white");
  else if (order.material === "TRANSPARENT") params.set("m", "pp-transparent");
  else if (order.material === "PAPER_WHITE") params.set("m", "paper-white");

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

  const reorderUrl = buildReorderUrl(order);
  const isCustomSize = Boolean(order.widthMm && order.heightMm);

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

      <div className="two-column">
        <article className="surface-card">
          <h2>Spezifikation</h2>
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
          <h2>Status & Betrag</h2>
          <ul className="simple-list">
            <li>Bestellstatus: {getOrderStatusLabel(order.status)}</li>
            <li>Druckdaten: {getArtworkStatusLabel(order.artworkStatus as Parameters<typeof getArtworkStatusLabel>[0])}</li>
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

      <article className="surface-card">
        <h2>Nachbestellen</h2>
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
