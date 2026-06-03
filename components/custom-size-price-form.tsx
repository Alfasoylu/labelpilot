"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { customSizeFeatureEnabled } from "@/lib/pricing/custom-size-feature";

type MaterialOption = "OPAQUE_PP" | "TRANSPARENT_PP";

type CalculatorResult =
  | { configured: false }
  | {
      configured: true;
      quoteRequired: boolean;
      netPrice: number;
      grossPrice: number;
    };

type CalculatorState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; result: CalculatorResult };

const materialLabels: Record<MaterialOption, string> = {
  OPAQUE_PP: "Opakes PP",
  TRANSPARENT_PP: "Transparentes PP",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function CustomSizePriceForm() {
  const [materialKey, setMaterialKey] = useState<MaterialOption>("OPAQUE_PP");
  const [widthMm, setWidthMm] = useState("100");
  const [heightMm, setHeightMm] = useState("200");
  const [quantity, setQuantity] = useState("5000");
  const [state, setState] = useState<CalculatorState>({ status: "idle" });

  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({
      source: "wunschformat",
      productType: "PP-Rollenetiketten",
      labelSize: `${widthMm || "0"} x ${heightMm || "0"} mm`,
      material: materialLabels[materialKey],
      quantity,
      notes: `Wunschformat angefragt: ${widthMm || "0"} x ${heightMm || "0"} mm, ${materialLabels[materialKey]}.`,
    });

    return `/de/angebot-anfordern?${params.toString()}`;
  }, [heightMm, materialKey, quantity, widthMm]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customSizeFeatureEnabled) {
      setState({
        status: "error",
        message: "Der Wunschformat-Rechner ist aktuell nicht verfuegbar.",
      });
      return;
    }

    setState({ status: "loading" });

    const response = await fetch("/api/custom-size/price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        materialKey,
        widthMm: Number(widthMm),
        heightMm: Number(heightMm),
        quantity: Number(quantity),
      }),
    });

    if (response.status === 404) {
      setState({
        status: "error",
        message: "Der Wunschformat-Rechner ist aktuell nicht verfuegbar.",
      });
      return;
    }

    if (!response.ok) {
      setState({
        status: "error",
        message: "Bitte pruefen Sie Material, Format und Menge.",
      });
      return;
    }

    const result = (await response.json()) as CalculatorResult;
    setState({ status: "success", result });
  }

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <h1>Wunschformat fuer PP-Rollenetiketten</h1>
        <p>
          Berechnen Sie einen Richtpreis fuer Ihr Sonderformat, solange Materialkosten
          und Preisparameter aktiv gepflegt sind. Groessere Formate oder Mengen laufen
          weiterhin sauber ueber ein individuelles Angebot.
        </p>
      </article>

      <section className="section-stack">
        <article className="surface-card">
          <form className="quote-form" onSubmit={onSubmit}>
            <div>
              <h2>Preis fuer Ihr Wunschformat berechnen</h2>
              <p className="field-hint">
                Geben Sie Material, Breite, Hoehe und Menge ein. Der Rechner zeigt nur
                den Kundenpreis und keine internen Kostenpositionen.
              </p>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="custom-size-material">Material</label>
                <select
                  id="custom-size-material"
                  name="materialKey"
                  value={materialKey}
                  onChange={(event) =>
                    setMaterialKey(event.target.value as MaterialOption)
                  }
                >
                  <option value="OPAQUE_PP">Opakes PP</option>
                  <option value="TRANSPARENT_PP">Transparentes PP</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="custom-size-width">Breite (mm)</label>
                <input
                  id="custom-size-width"
                  name="widthMm"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={widthMm}
                  onChange={(event) => setWidthMm(event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="custom-size-height">Hoehe (mm)</label>
                <input
                  id="custom-size-height"
                  name="heightMm"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={heightMm}
                  onChange={(event) => setHeightMm(event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="custom-size-quantity">Menge</label>
                <input
                  id="custom-size-quantity"
                  name="quantity"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inline-actions">
              <button
                type="submit"
                className="cta-button"
                disabled={state.status === "loading"}
              >
                {state.status === "loading"
                  ? "Preis wird berechnet..."
                  : "Preis berechnen"}
              </button>
              <Link href="/de/angebot-anfordern" className="secondary-link">
                Angebot anfordern
              </Link>
            </div>
          </form>
        </article>

        <article className="surface-card">
          <h2>Ergebnis</h2>
          {state.status === "idle" ? (
            <p>
              Geben Sie Ihre Daten ein und starten Sie die Berechnung. Bei Grenzfaellen
              erhalten Sie direkt den passenden Angebotsweg.
            </p>
          ) : null}

          {state.status === "error" ? (
            <p className="form-status error">{state.message}</p>
          ) : null}

          {state.status === "success" && !state.result.configured ? (
            <div className="section-stack">
              <p>Aktuell nur auf Anfrage.</p>
              <div className="inline-actions">
                <Link href={quoteHref} className="cta-link">
                  Angebot fuer Wunschformat anfordern
                </Link>
              </div>
            </div>
          ) : null}

          {state.status === "success" &&
          state.result.configured &&
          state.result.quoteRequired ? (
            <div className="section-stack">
              <p>Fuer dieses Format erstellen wir ein individuelles Angebot.</p>
              <div className="inline-actions">
                <Link href={quoteHref} className="cta-link">
                  Individuelles Angebot anfordern
                </Link>
              </div>
            </div>
          ) : null}

          {state.status === "success" &&
          state.result.configured &&
          !state.result.quoteRequired ? (
            <div className="section-stack">
              <p>
                {formatCurrency(state.result.netPrice)} netto /{" "}
                {formatCurrency(state.result.grossPrice)} inkl. 19% MwSt
              </p>
              <p className="field-hint">
                Der Richtpreis basiert auf den aktuell gepflegten Parametern fuer
                Material und Sonderformat.
              </p>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}
