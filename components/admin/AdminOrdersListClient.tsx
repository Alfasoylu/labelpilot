"use client";

import { useState, useTransition } from "react";

export type SerializedAdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  artworkStatusLabel: string;
  customerEmail: string;
  productSlug: string;
  materialLabel: string;
  quantity: number;
  createdAt: string;
  widthMm: number | null;
  paymentStatus: string | null;
  hasAddons: boolean;
};

type Props = {
  orders: SerializedAdminOrder[];
};

const BULK_STATUS_OPTIONS = [
  { value: "IN_PRODUCTION", label: "In Produktion" },
  { value: "READY_TO_SHIP", label: "Versandbereit" },
  { value: "SHIPPED", label: "Versendet" },
  { value: "DELIVERED", label: "Zugestellt" },
  { value: "COMPLETED", label: "Abgeschlossen" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "CANCELLED", label: "Storniert" },
];

export function AdminOrdersListClient({ orders }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const [resultMsg, setResultMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === orders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orders.map((o) => o.id)));
    }
  }

  function handleBulkApply() {
    if (!bulkStatus || selected.size === 0) return;
    setResultMsg("");
    setErrorMsg("");
    startTransition(async () => {
      const res = await fetch("/api/admin/orders/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: Array.from(selected), status: bulkStatus }),
      });
      const data = (await res.json()) as { ok?: boolean; updated?: number; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Bulk-Update fehlgeschlagen.");
        return;
      }
      setResultMsg(`${data.updated ?? selected.size} Bestellungen aktualisiert.`);
      setSelected(new Set());
      setBulkStatus("");
      // Reload to refresh order statuses
      window.location.reload();
    });
  }

  if (orders.length === 0) {
    return <p className="price-note">Keine Bestellungen gefunden.</p>;
  }

  return (
    <div className="section-stack">
      {resultMsg ? <p className="form-status success">{resultMsg}</p> : null}
      {errorMsg ? <p className="form-status error" role="alert">{errorMsg}</p> : null}

      {selected.size > 0 ? (
        <div className="bulk-action-bar">
          <span className="price-note">
            <strong>{selected.size}</strong> ausgewählt
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border)" }}
          >
            <option value="">Status wählen …</option>
            {BULK_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="cta-button"
            style={{ fontSize: "0.88rem" }}
            disabled={!bulkStatus || isPending}
            onClick={handleBulkApply}
          >
            {isPending ? "Wird angewendet …" : "Anwenden"}
          </button>
          <button
            type="button"
            className="secondary-link"
            onClick={() => setSelected(new Set())}
          >
            Auswahl aufheben
          </button>
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <input
          type="checkbox"
          id="select-all"
          checked={selected.size === orders.length && orders.length > 0}
          onChange={toggleAll}
        />
        <label htmlFor="select-all" className="field-hint" style={{ cursor: "pointer" }}>
          Alle auswählen
        </label>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="section-card" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <input
            type="checkbox"
            checked={selected.has(order.id)}
            onChange={() => toggle(order.id)}
            style={{ marginTop: "4px", flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div className="two-column">
              <div>
                <div className="admin-order-heading">
                  <h3>{order.orderNumber}</h3>
                  <span className="price-note" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                    {order.statusLabel}
                  </span>
                  {order.widthMm ? (
                    <span className="price-note" style={{ fontSize: "0.78rem" }}>
                      Wunschformat
                    </span>
                  ) : null}
                  {order.hasAddons ? (
                    <span className="price-note" style={{ fontSize: "0.78rem" }}>
                      Zusatzleistungen
                    </span>
                  ) : null}
                </div>
                <p className="price-note">{order.artworkStatusLabel}</p>
                <p className="price-note">
                  {order.customerEmail} · {order.productSlug} · {order.materialLabel}
                </p>
              </div>
              <div>
                <p className="price-note">
                  Menge: {order.quantity.toLocaleString("de-DE")} Stück
                </p>
                <p className="price-note">
                  Zahlung: {order.paymentStatus ?? "–"}
                </p>
                <p className="price-note">
                  {new Intl.DateTimeFormat("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
            </div>
            <a href={`/admin/orders/${order.id}`} className="secondary-link">
              Bestellung öffnen
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
