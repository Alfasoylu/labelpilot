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

type PriceErrorResponse = {
  message?: string;
};

type CustomSizePriceFormProps = {
  variant?: "page" | "compact";
  initialMaterialKey?: MaterialOption;
};

const materialLabels: Record<MaterialOption, string> = {
  OPAQUE_PP: "Opakes PP",
  TRANSPARENT_PP: "Transparentes PP",
};

const quoteFallbackReasons = [
  "20.000+ Stück",
  "Weißunterdruck",
  "Kontur- oder Freiformschnitt",
  "Sonderklebstoff",
  "Laminierung oder Folie",
  "variable Daten",
  "mehrere SKUs",
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatArea(value: number) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

function parsePositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function CustomSizePriceForm({
  variant = "page",
  initialMaterialKey = "OPAQUE_PP",
}: CustomSizePriceFormProps) {
  const [materialKey, setMaterialKey] = useState<MaterialOption>(initialMaterialKey);
  const [widthMm, setWidthMm] = useState("100");
  const [heightMm, setHeightMm] = useState("200");
  const [quantity, setQuantity] = useState("5000");
  const [state, setState] = useState<CalculatorState>({ status: "idle" });

  const widthValue = useMemo(() => parsePositiveNumber(widthMm), [widthMm]);
  const heightValue = useMemo(() => parsePositiveNumber(heightMm), [heightMm]);
  const quantityValue = useMemo(() => parsePositiveNumber(quantity), [quantity]);
  const labelAreaM2 = useMemo(() => {
    if (!widthValue || !heightValue) {
      return null;
    }

    return (widthValue * heightValue) / 1_000_000;
  }, [heightValue, widthValue]);
  const totalAreaM2 = useMemo(() => {
    if (!labelAreaM2 || !quantityValue) {
      return null;
    }

    return labelAreaM2 * quantityValue;
  }, [labelAreaM2, quantityValue]);

  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({
      source: "wunschformat",
      productType: "PP-Rollenetiketten",
      labelSize: `${widthMm || "0"} x ${heightMm || "0"} mm`,
      material: materialLabels[materialKey],
      quantity,
      notes:
        `Wunschformat angefragt: ${widthMm || "0"} x ${heightMm || "0"} mm, ` +
        `${materialLabels[materialKey]}, ${quantity || "0"} Stück.`,
    });

    return `/de/angebot-anfordern?${params.toString()}`;
  }, [heightMm, materialKey, quantity, widthMm]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customSizeFeatureEnabled) {
      setState({
        status: "error",
        message:
          "Der Wunschformat-Rechner ist aktuell nicht live. Bitte nutzen Sie das Angebotsformular.",
      });
      return;
    }

    setState({ status: "loading" });

    try {
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
      const responseBody = (await response
        .json()
        .catch(() => null)) as PriceErrorResponse | CalculatorResult | null;

      if (response.status === 404) {
        setState({
          status: "error",
          message:
            "Der Wunschformat-Rechner ist aktuell nicht live. Bitte nutzen Sie das Angebotsformular.",
        });
        return;
      }

      if (!response.ok) {
        setState({
          status: "error",
          message:
            responseBody &&
            "message" in responseBody &&
            typeof responseBody.message === "string"
              ? responseBody.message
              : "Bitte prüfen Sie Material, Format und Menge.",
        });
        return;
      }

      setState({ status: "success", result: responseBody as CalculatorResult });
    } catch {
      setState({
        status: "error",
        message:
          "Der Wunschformat-Rechner konnte gerade nicht antworten. Bitte nutzen Sie das Angebotsformular.",
      });
    }
  }

  const calculatorIntro =
    variant === "page"
      ? "Berechnen Sie einen Richtpreis für Ihr Sonderformat, solange Materialkosten und Preisparameter aktiv gepflegt sind. Größere Formate oder Mengen laufen weiterhin sauber über ein individuelles Angebot."
      : "Für Sondergrößen berechnen wir einen Richtpreis nur dann direkt, wenn die Funktion aktiv ist und die Kostenparameter sauber gepflegt sind.";

  const calculatorHint =
    variant === "page"
      ? "Der Rechner ist eine Orientierungs- und Vorqualifizierungsstufe. Die festen 100x200-Pakete bleiben der Standardweg; Wunschformat ist bewusst ein kontrollierter Zusatzpfad mit klarem Angebots-Fallback."
      : "100x200 mm bleibt der schnellste Checkout-Weg. Wunschformat ist bewusst ein kontrollierter Zusatzpfad.";

  const calculatorHeading =
    variant === "page"
      ? "Preis für Ihr Wunschformat berechnen"
      : "Wunschformat kalkulieren";

  const resultHeading = variant === "page" ? "Ergebnis" : "Rückmeldung";

  const fallbackOnlyCard =
    variant === "compact" && !customSizeFeatureEnabled ? (
      <article className="surface-card section-stack">
        <h3>Wunschformat aktuell über Angebot</h3>
        <p>
          Sondergrößen bleiben verfügbar, laufen aber derzeit kontrolliert über das
          individuelle Angebot statt über eine öffentliche Sofortberechnung.
        </p>
        <ul className="simple-list">
          {quoteFallbackReasons.map((reason) => (
            <li key={reason}>{reason} laufen immer über Angebot.</li>
          ))}
        </ul>
        <div className="inline-actions">
          <Link href={quoteHref} className="cta-link">
            Individuelles Angebot anfordern
          </Link>
          <Link href="/de/kontakt" className="secondary-link">
            Rückfrage klären
          </Link>
        </div>
      </article>
    ) : null;

  const calculatorCard =
    fallbackOnlyCard ?? (
      <article className="surface-card section-stack">
        {variant === "page" ? <h2>{calculatorHeading}</h2> : <h3>{calculatorHeading}</h3>}
        <p>{calculatorIntro}</p>
        <p className="field-hint">{calculatorHint}</p>

        <form className="quote-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor={`custom-size-material-${variant}`}>Material</label>
              <select
                id={`custom-size-material-${variant}`}
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
              <label htmlFor={`custom-size-width-${variant}`}>Breite (mm)</label>
              <input
                id={`custom-size-width-${variant}`}
                name="widthMm"
                inputMode="numeric"
                pattern="[0-9]*"
                value={widthMm}
                onChange={(event) => setWidthMm(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor={`custom-size-height-${variant}`}>Höhe (mm)</label>
              <input
                id={`custom-size-height-${variant}`}
                name="heightMm"
                inputMode="numeric"
                pattern="[0-9]*"
                value={heightMm}
                onChange={(event) => setHeightMm(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor={`custom-size-quantity-${variant}`}>Menge</label>
              <input
                id={`custom-size-quantity-${variant}`}
                name="quantity"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="surface-card">
            <h4>Fläche</h4>
            <ul className="simple-list">
              <li>
                Etikettenfläche:{" "}
                {labelAreaM2 != null ? `${formatArea(labelAreaM2)} m²` : "—"}
              </li>
              <li>
                Gesamtfläche ohne interne Zuschläge:{" "}
                {totalAreaM2 != null ? `${formatArea(totalAreaM2)} m²` : "—"}
              </li>
            </ul>
            <p className="field-hint">
              Die öffentliche Berechnung zeigt nur Kundenpreis und Fläche. Interne
              Kostenparameter oder Druckmethoden bleiben verborgen.
            </p>
          </div>

          <div className="inline-actions">
            <button
              type="submit"
              className="cta-button"
              disabled={state.status === "loading"}
            >
              {state.status === "loading" ? "Preis wird berechnet..." : "Preis berechnen"}
            </button>
            <Link href={quoteHref} className="secondary-link">
              Individuelles Angebot anfordern
            </Link>
          </div>
        </form>

        <div className="section-stack">
          {variant === "page" ? <h2>{resultHeading}</h2> : <h4>{resultHeading}</h4>}
          {state.status === "idle" ? (
            <>
              <p>
                Geben Sie Material, Breite, Höhe und Menge ein. Direkt berechenbar sind
                nur Wunschformate innerhalb der freigegebenen Preislogik. Alles, was
                davon abweicht, geht sauber in den Angebotsprozess.
              </p>
              <ul className="simple-list">
                {quoteFallbackReasons.map((reason) => (
                  <li key={reason}>{reason} laufen über Angebot.</li>
                ))}
              </ul>
            </>
          ) : null}

          {state.status === "error" ? (
            <div className="section-stack">
              <p className="form-status error">{state.message}</p>
              <div className="inline-actions">
                <Link href={quoteHref} className="secondary-link">
                  Wunschformat als Angebot anfragen
                </Link>
              </div>
            </div>
          ) : null}

          {state.status === "success" && !state.result.configured ? (
            <div className="section-stack">
              <p>
                Ein öffentlicher Richtpreis ist aktuell nicht freigeschaltet. Bitte
                nutzen Sie das individuelle Angebot für dieses Wunschformat.
              </p>
              <div className="inline-actions">
                <Link href={quoteHref} className="cta-link">
                  Angebot für Wunschformat anfordern
                </Link>
              </div>
            </div>
          ) : null}

          {state.status === "success" &&
          state.result.configured &&
          state.result.quoteRequired ? (
            <div className="section-stack">
              <p>
                Für dieses Wunschformat oder diesen Umfang zeigen wir bewusst keinen
                öffentlichen Richtpreis. Sie erhalten stattdessen ein individuelles
                Angebot mit passender Prüfung.
              </p>
              <p className="field-hint">
                Der Wunschformat-Rechner deckt nur direkt freigegebene Standardfälle
                ab. Größere Umfänge und Sonderanforderungen laufen kontrolliert über
                den Angebotsweg.
              </p>
              <ul className="simple-list">
                {quoteFallbackReasons.map((reason) => (
                  <li key={reason}>{reason} bleiben Angebotsfälle.</li>
                ))}
              </ul>
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
                Dieser Richtpreis basiert auf den aktuell gepflegten Parametern für
                Material, Fläche und Menge. Er gilt nur für direkt kalkulierbare
                Wunschformate ohne zusätzliche Sonderanforderungen.
              </p>
              <div className="inline-actions">
                <Link href={quoteHref} className="secondary-link">
                  Wunschformat als Angebot anfragen
                </Link>
              </div>
              <p className="field-hint">
                Sobald Weißunterdruck, Konturschnitt, Sonderklebstoff, Veredelung,
                variable Daten, Multi-SKU oder Mengen ab 20.000 Stück ins Spiel
                kommen, bleibt der Angebotsweg verbindlich.
              </p>
            </div>
          ) : null}
        </div>
      </article>
    );

  if (variant === "compact") {
    return calculatorCard;
  }

  return (
    <div className="container section-stack">
      <article className="legal-card">
        <h1>Wunschformat für PP-Rollenetiketten</h1>
        <p>{calculatorIntro}</p>
        <p className="field-hint">{calculatorHint}</p>
      </article>

      <section className="section-stack">{calculatorCard}</section>
    </div>
  );
}
