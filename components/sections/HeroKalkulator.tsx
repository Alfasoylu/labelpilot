"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MaterialSlug = "pp-white" | "pp-transparent";

type PriceState =
  | { status: "loading" }
  | { status: "ok"; netPrice: number; grossPrice: number }
  | { status: "quote" }
  | { status: "unconfigured" }
  | { status: "error" };

const MATERIAL_API_KEY: Record<MaterialSlug, string> = {
  "pp-white": "OPAQUE_PP",
  "pp-transparent": "TRANSPARENT_PP",
};

function formatEur(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

export function HeroKalkulator() {
  const router = useRouter();

  const [quantity, setQuantity] = useState<number | "">(10000);
  const [widthMm, setWidthMm] = useState<number | "">(60);
  const [heightMm, setHeightMm] = useState<number | "">(40);
  const [materialSlug, setMaterialSlug] = useState<MaterialSlug>("pp-white");
  const [colorCount, setColorCount] = useState<number>(4);
  const [finishing, setFinishing] = useState<"MATT" | "GLAENZEND">("GLAENZEND");
  const [widthError, setWidthError] = useState("");
  const [priceState, setPriceState] = useState<PriceState>({ status: "loading" });

  const isNumeric = (v: number | "") => typeof v === "number" && v > 0;
  const isValid =
    isNumeric(quantity) &&
    isNumeric(widthMm) &&
    isNumeric(heightMm) &&
    !widthError &&
    typeof widthMm === "number" && widthMm <= 320;

  const totalM2 =
    isNumeric(quantity) && isNumeric(widthMm) && isNumeric(heightMm)
      ? ((quantity as number) * (widthMm as number) * (heightMm as number)) / 1_000_000
      : null;

  const fetchPrice = useCallback(async () => {
    if (!isValid) return;
    setPriceState({ status: "loading" });
    try {
      const res = await fetch("/api/kalkulator/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialKey: MATERIAL_API_KEY[materialSlug],
          widthMm,
          heightMm,
          quantity,
          colorCount,
          finishing: materialSlug === "pp-transparent" ? "GLAENZEND" : finishing,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.configured) {
        setPriceState({ status: "unconfigured" });
        return;
      }
      if (data.quoteRequired) { setPriceState({ status: "quote" }); return; }
      setPriceState({ status: "ok", netPrice: data.netPrice, grossPrice: data.grossPrice });
    } catch {
      setPriceState({ status: "error" });
    }
  }, [isValid, materialSlug, widthMm, heightMm, quantity, colorCount, finishing]);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPrice(); }, 400);
    return () => clearTimeout(t);
  }, [fetchPrice]);

  function handleWidthChange(raw: string) {
    const v = raw === "" ? "" : Number.parseInt(raw, 10);
    setWidthMm(v);
    if (typeof v === "number" && v > 320) {
      setWidthError("Max. 320 mm");
    } else {
      setWidthError("");
    }
  }

  function buildParams(extra?: Record<string, string>) {
    const p = new URLSearchParams();
    if (quantity) p.set("quantity", String(quantity));
    if (widthMm) p.set("width", String(widthMm));
    if (heightMm) p.set("height", String(heightMm));
    p.set("material", materialSlug);
    p.set("print", "cmyk");
    p.set("colors", String(colorCount));
    p.set("finishing", materialSlug === "pp-transparent" ? "GLAENZEND" : finishing);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) p.set(k, v);
    }
    return p.toString();
  }

  function handleConfigure() {
    router.push(`/de/kalkulator?${buildParams()}`);
  }

  function handleArtworkLater() {
    router.push(`/de/kalkulator?${buildParams({ artwork: "later" })}`);
  }

  return (
    <>
      {/* ── Hero: two-column split ── */}
      <section className="hero-kalk-split container">
        {/* LEFT: Calculator */}
        <div className="hero-kalk__left">
          <span className="eyebrow">PP-Rollenetiketten für Produktmarken</span>
          <h1 className="hero-kalk__h1">PP-Rollenetiketten nach Maß</h1>
          <p className="hero-kalk__sub">
            Sofortpreis für Produktetiketten auf Flaschen, Gläsern, Dosen, Beuteln und
            Supplement-Verpackungen.
          </p>
          <p className="hero-kalk__usecases">
            Flaschen · Gläser · Dosen · Beutel · Kosmetik · Supplements · Honig · Kaffee · Saucen · Private&nbsp;Label
          </p>

          <div className="hero-kalk__mobile-banner">
            <Image
              src="/images/editorial/mobile-labels-hero.webp"
              alt="Labelpilot.de Musteretiketten: CMYK-bedruckte PP-Rollenetiketten auf Sriracha-Flasche, Honig-Glas, Hyaluron-Serum und Protein-Dose"
              width={1320}
              height={440}
              priority
              sizes="100vw"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>

          <div className="hero-kalk__card">
            <div className="hero-kalk__card-head">
              <p className="hero-kalk__card-title">Etikettenpreis sofort berechnen</p>
              <p className="hero-kalk__card-hint">
                Wunschformat eingeben, Material wählen und direkt den Preis sehen.
              </p>
            </div>

            <div className="hero-kalk__form">
              {/* Row 1: Menge · Breite · Höhe */}
              <div className="hero-kalk__field">
                <label htmlFor="hk-qty">Menge</label>
                <input
                  id="hk-qty"
                  type="number"
                  min={1}
                  max={19999}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="hero-kalk__field">
                <label htmlFor="hk-w">Breite (mm)</label>
                <input
                  id="hk-w"
                  type="number"
                  min={10}
                  max={320}
                  value={widthMm}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  aria-invalid={Boolean(widthError) || undefined}
                />
                {widthError ? (
                  <span className="hero-kalk__field-error">{widthError}</span>
                ) : null}
              </div>
              <div className="hero-kalk__field">
                <label htmlFor="hk-h">Höhe (mm)</label>
                <input
                  id="hk-h"
                  type="number"
                  min={10}
                  value={heightMm}
                  onChange={(e) =>
                    setHeightMm(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))
                  }
                />
              </div>

              {/* Row 2: Material + Oberfläche */}
              <div className="hero-kalk__field">
                <label htmlFor="hk-mat">Material</label>
                <select
                  id="hk-mat"
                  value={materialSlug}
                  onChange={(e) => {
                    const mat = e.target.value as MaterialSlug;
                    setMaterialSlug(mat);
                    if (mat === "pp-transparent") setFinishing("GLAENZEND");
                  }}
                >
                  <option value="pp-white">PP-Folie weiß (opak)</option>
                  <option value="pp-transparent">PP-Folie transparent</option>
                </select>
              </div>
              <div className="hero-kalk__field">
                <label htmlFor="hk-finishing">Oberfläche</label>
                <select
                  id="hk-finishing"
                  value={materialSlug === "pp-transparent" ? "GLAENZEND" : finishing}
                  disabled={materialSlug === "pp-transparent"}
                  onChange={(e) => setFinishing(e.target.value as "MATT" | "GLAENZEND")}
                >
                  <option value="GLAENZEND">Glänzend</option>
                  <option value="MATT">Matt</option>
                </select>
              </div>
              <div className="hero-kalk__field hero-kalk__field--full">
                <label htmlFor="hk-colors">Farbigkeit</label>
                <select
                  id="hk-colors"
                  value={colorCount}
                  onChange={(e) => setColorCount(Number(e.target.value))}
                >
                  <option value={1}>1-farbig – Sonderfarbe</option>
                  <option value={2}>2-farbig</option>
                  <option value={3}>3-farbig</option>
                  <option value={4}>4-farbig – CMYK (Standard)</option>
                </select>
              </div>
            </div>

            {/* Live result */}
            <div className="hero-kalk__result">
              {priceState.status === "loading" && (
                <span className="hero-kalk__result-dim">Preis wird sofort berechnet …</span>
              )}
              {priceState.status === "ok" && (
                <div className="hero-kalk__result-price">
                  <span className="hero-kalk__result-net">
                    {formatEur(priceState.netPrice)}
                    <span className="hero-kalk__result-label"> Netto</span>
                  </span>
                  <span className="hero-kalk__result-meta">
                    {formatEur(priceState.grossPrice)} brutto inkl. 19 % MwSt. · inkl. Versand nach Deutschland
                  </span>
                  {totalM2 !== null && (
                    <span className="hero-kalk__result-m2">
                      {totalM2.toLocaleString("de-DE", {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3,
                      })}{" "}
                      m² gesamt
                    </span>
                  )}
                </div>
              )}
              {priceState.status === "quote" && (
                <span className="hero-kalk__result-dim">
                  Für diese Konfiguration bitte Angebot anfordern.
                </span>
              )}
              {priceState.status === "unconfigured" && (
                <span className="hero-kalk__result-dim">
                  Preiskonfiguration noch nicht abgeschlossen – im Kalkulator verfügbar.
                </span>
              )}
              {priceState.status === "error" && (
                <span className="hero-kalk__result-dim">
                  Preisberechnung derzeit nicht verfügbar.
                </span>
              )}
            </div>

            <div className="hero-kalk__actions">
              <button
                type="button"
                className="cta-button"
                onClick={handleConfigure}
                disabled={!isValid}
              >
                Weiter konfigurieren
              </button>
              <button
                type="button"
                className="secondary-link"
                onClick={handleArtworkLater}
              >
                Druckdaten später hochladen
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Product image */}
        <div className="hero-kalk__visual">
          <figure className="hero-product-photo">
            <Image
              src="/images/editorial/sample-labels-cmyk.webp"
              alt="Labelpilot.de CMYK-Musteretiketten: vollflächig bedruckte PP-Rollenetiketten auf Sriracha-Flasche, Honig-Glas, Serum-Flasche, Protein-Dose und Kaffeebeutel"
              width={900}
              height={1125}
              priority
              sizes="(max-width: 1024px) 100vw, 440px"
              className="hero-product-photo__img"
            />
            <div className="hero-product-photo__badge hero-kalk__badge-row">
              <span className="hero-product-photo__badge-pill">Wunschformat</span>
              <span className="hero-product-photo__badge-pill">Sofortpreis</span>
              <span className="hero-product-photo__badge-pill">Nachbestellbar</span>
            </div>
          </figure>
        </div>
      </section>

      {/* ── Below hero: trust strip ── */}
      <div className="hero-kalk__below container">
        <ul className="hero-kalk__trust-row">
          <li>Maßanfertigung bis 320 mm Breite</li>
          <li>Druckdatenprüfung &amp; Proof möglich</li>
          <li>Nachbestellung ohne neue Abstimmung</li>
        </ul>
      </div>
    </>
  );
}
