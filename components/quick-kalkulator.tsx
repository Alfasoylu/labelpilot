"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MaterialKey = "OPAQUE_PP" | "TRANSPARENT_PP";

type PriceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; netPrice: number; grossPrice: number }
  | { status: "quote" }
  | { status: "unavailable" };

function formatEur(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export function QuickKalkulator() {
  const router = useRouter();
  const [materialKey, setMaterialKey] = useState<MaterialKey>("OPAQUE_PP");
  const [widthMm, setWidthMm] = useState<number | "">(100);
  const [heightMm, setHeightMm] = useState<number | "">(200);
  const [quantity, setQuantity] = useState<number | "">(1000);
  const [priceState, setPriceState] = useState<PriceState>({ status: "idle" });

  const fetchPrice = useCallback(async () => {
    if (!widthMm || !heightMm || !quantity || widthMm < 10 || heightMm < 10 || quantity < 1) return;
    setPriceState({ status: "loading" });
    try {
      const res = await fetch("/api/kalkulator/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialKey, widthMm, heightMm, quantity }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.configured) { setPriceState({ status: "unavailable" }); return; }
      if (data.quoteRequired) { setPriceState({ status: "quote" }); return; }
      setPriceState({ status: "ok", netPrice: data.netPrice, grossPrice: data.grossPrice });
    } catch {
      setPriceState({ status: "unavailable" });
    }
  }, [materialKey, widthMm, heightMm, quantity]);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPrice(); }, 500);
    return () => clearTimeout(t);
  }, [fetchPrice]);

  function handleConfigure() {
    const params = new URLSearchParams();
    if (widthMm) params.set("w", String(widthMm));
    if (heightMm) params.set("h", String(heightMm));
    if (quantity) params.set("q", String(quantity));
    params.set("m", materialKey);
    router.push(`/de/kalkulator?${params.toString()}`);
  }

  return (
    <article className="surface-card quick-kalkulator">
      <div className="quick-kalkulator-header">
        <h2>Schnellkalkulator</h2>
        <p className="price-note">Sofortpreis für Ihr Wunschformat</p>
      </div>

      <div className="quick-kalkulator-form">
        <div className="field">
          <label htmlFor="qk-quantity">Menge</label>
          <input
            id="qk-quantity"
            type="number"
            min={1}
            max={1000000}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))}
          />
        </div>
        <div className="field">
          <label htmlFor="qk-material">Material</label>
          <select
            id="qk-material"
            value={materialKey}
            onChange={(e) => setMaterialKey(e.target.value as MaterialKey)}
          >
            <option value="OPAQUE_PP">Opak PP</option>
            <option value="TRANSPARENT_PP">Transparent PP</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="qk-width">Breite (mm)</label>
          <input
            id="qk-width"
            type="number"
            min={10}
            max={320}
            value={widthMm}
            onChange={(e) => setWidthMm(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))}
          />
        </div>
        <div className="field">
          <label htmlFor="qk-height">Höhe (mm)</label>
          <input
            id="qk-height"
            type="number"
            min={10}
            max={700}
            value={heightMm}
            onChange={(e) => setHeightMm(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))}
          />
        </div>

        <div className="quick-kalkulator-price">
          {priceState.status === "loading" && <span className="price-note">Berechnet…</span>}
          {priceState.status === "ok" && (
            <div className="quick-kalkulator-result">
              <span className="quick-kalkulator-netto">
                {formatEur(priceState.netPrice)} Netto
              </span>
              <span className="price-note">
                {formatEur(priceState.grossPrice)} brutto inkl. MwSt. · Versand inklusive
              </span>
            </div>
          )}
          {priceState.status === "quote" && (
            <span className="price-note">Für Sonderanforderungen: individuelles Angebot</span>
          )}
          {priceState.status === "unavailable" && (
            <span className="price-note">Preisanfrage über den Kalkulator</span>
          )}
          {priceState.status === "idle" && (
            <span className="price-note">Format eingeben für Sofortpreis</span>
          )}
        </div>

        <div className="inline-actions">
          <button type="button" className="cta-button" onClick={handleConfigure}>
            Weiter zum Kalkulator
          </button>
        </div>
      </div>
    </article>
  );
}
