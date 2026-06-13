"use client";

import { useState } from "react";

import { trackLeadEvent } from "@/lib/analytics/browser";

type ReorderStartFormProps = {
  designId: string;
  orderId?: string | null;
  token?: string | null;
  accessToken?: string | null;
  defaultQuantity?: number | null;
  currentArtworkVersionId?: string | null;
};

type ReorderResponse =
  | {
      kind: "checkout";
      url: string;
      orderId: string;
    }
  | {
      kind: "quote";
      url: string;
      reason: string;
    }
  | {
      error: string;
    };

const quantityOptions = [
  { value: "1000", label: "1.000" },
  { value: "2000", label: "2.000" },
  { value: "5000", label: "5.000" },
  { value: "10000", label: "10.000" },
  { value: "20000+", label: "20.000+" },
];

const stockDurationOptions = [
  { value: "UNDER_4_WEEKS", label: "Unter 4 Wochen" },
  { value: "ONE_TO_THREE_MONTHS", label: "1 bis 3 Monate" },
  { value: "THREE_TO_SIX_MONTHS", label: "3 bis 6 Monate" },
  { value: "OVER_SIX_MONTHS", label: "Mehr als 6 Monate" },
];

export function ReorderStartForm({
  designId,
  orderId,
  token,
  accessToken,
  defaultQuantity,
  currentArtworkVersionId,
}: ReorderStartFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");
    setError("");

    const payload = {
      designId,
      orderId: orderId ?? undefined,
      token: token ?? undefined,
      artworkVersionId: currentArtworkVersionId,
      quantity: String(formData.get("quantity") ?? ""),
      mode: String(formData.get("mode") ?? ""),
      stockDuration: String(formData.get("stockDuration") ?? ""),
    };

    trackLeadEvent("reorder_start_submit", {
      designId,
      quantity: payload.quantity,
      mode: payload.mode,
      stockDuration: payload.stockDuration,
    });

    try {
      const response = await fetch("/api/reorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ReorderResponse;

      if (!response.ok || "error" in result) {
        setError("error" in result ? result.error : "Nachbestellung konnte nicht gestartet werden.");
        return;
      }

      if (result.kind === "quote") {
        setMessage("Für diese Menge wird die Anfrage zur Angebotsstrecke weitergeleitet.");
        trackLeadEvent("reorder_quote_redirect", {
          designId,
          quantity: payload.quantity,
        });
        window.location.href = result.url;
        return;
      }

      setMessage("Nachbestellung vorbereitet. Weiterleitung zum Checkout...");
      trackLeadEvent("reorder_checkout_redirect", {
        designId,
        quantity: payload.quantity,
        mode: payload.mode,
        orderId: result.orderId,
      });
      window.location.href = result.url;
    } catch {
      setError("Nachbestellung konnte nicht gestartet werden.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="quote-form">
      <div className="form-grid">
        <div>
          <label htmlFor="quantity">Menge</label>
          <select
            id="quantity"
            name="quantity"
            defaultValue={defaultQuantity ? String(defaultQuantity) : "5000"}
          >
            {quantityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mode">Artwork</label>
          <select id="mode" name="mode" defaultValue="SAME_ARTWORK">
            <option value="SAME_ARTWORK">Gleiches Artwork erneut bestellen</option>
            <option value="MINOR_CHANGE">Kleine Anpassung anfordern</option>
          </select>
        </div>
        <div className="field-full">
          <label htmlFor="stockDuration">Wie lange reicht Ihr aktueller Bestand?</label>
          <select id="stockDuration" name="stockDuration" defaultValue="ONE_TO_THREE_MONTHS">
            {stockDurationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="inline-actions">
        <button type="submit" className="cta-button" disabled={pending}>
          {pending ? "Nachbestellung wird vorbereitet..." : "Nachbestellung starten"}
        </button>
      </div>

      {message ? <p className="form-status success">{message}</p> : null}
      {error ? <p className="form-status error" role="alert">{error}</p> : null}
      <p className="field-hint">
        Identisches Artwork geht direkt in den Checkout. Bei kleinen Anpassungen wird dieselbe
        Spezifikation als neue Bestellung vorbereitet, damit Sie später korrigierte Druckdaten hochladen können.
      </p>
    </form>
  );
}
