"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { AddonSettingsInput } from "@/lib/pricing/addons";
import { addonsFeatureEnabled } from "@/lib/pricing/addons-feature";
import { getPackageById } from "@/lib/commerce/packages";
import {
  buildCheckoutAddons,
  DEFAULT_ADDON_SETTINGS,
  type CheckoutAddonsInput,
} from "@/lib/pricing/checkout-addons";

type CheckoutButtonProps = {
  packageId: string;
  productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten";
  material: "OPAQUE" | "TRANSPARENT";
  quantity: number;
  addonSettings?: AddonSettingsInput;
  finishing?: "MATT" | "GLAENZEND";
};

export function CheckoutButton({
  packageId,
  productSlug,
  material,
  quantity,
  addonSettings,
  finishing = "MATT",
}: CheckoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [designService, setDesignService] = useState(false);
  const [physicalProof, setPhysicalProof] = useState(false);
  const [express, setExpress] = useState(false);
  const [customerUploadsOwnData, setCustomerUploadsOwnData] = useState(false);
  const [extraDesignCount, setExtraDesignCount] = useState(0);
  const pkg = getPackageById(packageId);
  const addonSelection: CheckoutAddonsInput = {
    designService,
    physicalProof,
    express,
    extraDesignCount,
    customerUploadsOwnData,
  };
  const addonPreview = pkg
    ? buildCheckoutAddons({
        featureEnabled: addonsFeatureEnabled,
        addons: addonSelection,
        baseGrossAmountCents: pkg.grossAmountCents,
        settings: addonSettings ?? DEFAULT_ADDON_SETTINGS,
      })
    : null;

  return (
    <div className="checkout-addons">
      <div className="checkout-addons__panel">
        <p className="field-hint">
          Standard-Datenprüfung und ein digitaler Proof bleiben inklusive.
        </p>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={physicalProof}
            onChange={(event) => setPhysicalProof(event.target.checked)}
          />
          <span>Physischen Andruck hinzufügen (10,00 EUR netto · 11,90 EUR brutto)</span>
        </label>
        <p className="field-hint">
          Ein gedrucktes Andruckmuster auf dem abgestimmten Material. Digitaler Proof bleibt
          immer inklusive.
        </p>
      </div>

      <div className="checkout-addons__panel">
        <div className="field">
          <label htmlFor={`artwork-count-${packageId}`}>Anzahl Druckmotive</label>
          <select
            id={`artwork-count-${packageId}`}
            value={String(extraDesignCount + 1)}
            onChange={(e) =>
              setExtraDesignCount(Math.max(0, Number.parseInt(e.target.value, 10) - 1))
            }
          >
            <option value="1">1 Druckmotiv (Standard)</option>
            <option value="2">2 Druckmotive</option>
            <option value="3">3 Druckmotive</option>
            <option value="4">4 Druckmotive</option>
            <option value="5">5 Druckmotive</option>
          </select>
        </div>
        <p className="field-hint">
          Mehrere Druckmotive werden bei identischem Format und Material gemeinsam geprüft. Bei
          komplexen Serien erstellen wir ein individuelles Angebot.
        </p>
      </div>

      {addonsFeatureEnabled ? (
        <div className="checkout-addons__panel">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={designService}
              onChange={(event) => setDesignService(event.target.checked)}
            />
            <span>Designservice hinzufügen (40,00 EUR netto)</span>
          </label>
          <p className="field-hint">
            Kostenlos ab 2.000 EUR netto oder wenn Sie druckfertige Daten selbst hochladen.
          </p>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={customerUploadsOwnData}
              onChange={(event) => setCustomerUploadsOwnData(event.target.checked)}
            />
            <span>Ich lade druckfertige Daten selbst hoch</span>
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={express}
              onChange={(event) => setExpress(event.target.checked)}
            />
            <span>Express hinzufügen (+9,90 EUR netto)</span>
          </label>
          <p className="field-hint">
            Express priorisiert den Auftrag nach Ihrer Freigabe, ersetzt aber keine separate SLA.
          </p>
        </div>
      ) : null}

      {pkg && addonPreview && addonPreview.addonsTotalCents > 0 ? (
        <ul className="simple-list">
          <li>
            Basispreis:{" "}
            {addonPreview.baseNetTotal.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            EUR netto ·{" "}
            {(pkg.grossAmountCents / 100).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            EUR brutto
          </li>
          {addonPreview.lineItems
            .filter((item) => item.grossAmountCents > 0)
            .map((item) => (
              <li key={item.key}>
                {item.name}: +
                {item.netAmount.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR netto · +
                {(item.grossAmountCents / 100).toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR brutto
              </li>
            ))}
          <li>
            <strong>
              Gesamtpreis:{" "}
              {((pkg.grossAmountCents + addonPreview.addonsTotalCents) / 100).toLocaleString(
                "de-DE",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}{" "}
              EUR brutto (inkl. 19% MwSt)
            </strong>
          </li>
        </ul>
      ) : null}

      <button
        type="button"
        className="pricing-card__action pricing-card__action--primary"
        onClick={() => {
          startTransition(() => {
            const params = new URLSearchParams({
              packageId,
              productSlug,
              material,
              quantity: String(quantity),
              finishing,
              designService: designService ? "1" : "0",
              physicalProof: physicalProof ? "1" : "0",
              express: express ? "1" : "0",
              customerUploadsOwnData: customerUploadsOwnData ? "1" : "0",
              extraDesignCount: String(extraDesignCount),
            });

            router.push(`/de/checkout?${params.toString()}`);
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Weiterleitung..." : "Zahlungspflichtig bestellen"}
      </button>
    </div>
  );
}
