"use client";

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
};

export function CheckoutButton({
  packageId,
  productSlug,
  material,
  quantity,
  addonSettings,
}: CheckoutButtonProps) {
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
  const addonGrossDisplay =
    addonPreview && addonPreview.addonsTotalCents > 0
      ? (addonPreview.addonsTotalCents / 100).toLocaleString("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <div className="checkout-addons">
      {addonsFeatureEnabled ? (
        <div className="checkout-addons__panel">
          <p className="field-hint">
            Zubuchbare Leistungen werden im Checkout serverseitig berechnet.
          </p>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={designService}
              onChange={(event) => setDesignService(event.target.checked)}
            />
            <span>Designservice hinzufuegen</span>
          </label>
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
              checked={physicalProof}
              onChange={(event) => setPhysicalProof(event.target.checked)}
            />
            <span>Physischen Andruck hinzufuegen</span>
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={express}
              onChange={(event) => setExpress(event.target.checked)}
            />
            <span>Express hinzufuegen</span>
          </label>
          <div className="field">
            <label htmlFor={`extra-designs-${packageId}`}>Zusatzdesigns</label>
            <input
              id={`extra-designs-${packageId}`}
              type="number"
              min="0"
              step="1"
              value={extraDesignCount}
              onChange={(event) =>
                setExtraDesignCount(Math.max(0, Number.parseInt(event.target.value || "0", 10) || 0))
              }
            />
          </div>
          <p className="field-hint">1 Design ist im Paket enthalten. Jedes weitere Design kostet 19,00 EUR netto.</p>
          {addonPreview ? (
            <ul className="simple-list checkout-addons__summary">
              {addonPreview.lineItems.map((item) => (
                <li key={item.key}>
                  {item.name}:{" "}
                  {item.netAmount === 0
                    ? "kostenlos"
                    : `${item.netAmount.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} EUR netto / ${(item.grossAmountCents / 100).toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} EUR brutto`}
                </li>
              ))}
              <li>
                Add-ons gesamt: {addonGrossDisplay ?? "0,00"} EUR brutto
              </li>
            </ul>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        className="pricing-card__action pricing-card__action--primary"
        onClick={() => {
          startTransition(async () => {
            const response = await fetch("/api/checkout/create-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                packageId,
                productSlug,
                material,
                quantity,
                ...(addonsFeatureEnabled ? { addons: addonSelection } : {}),
              }),
            });

            const payload = (await response.json().catch(() => null)) as
              | { url?: string; error?: string }
              | null;

            if (!response.ok || !payload?.url) {
              window.alert(
                payload?.error ??
                  "Der Checkout ist im Moment nicht verfuegbar. Bitte nutzen Sie das Angebotsformular.",
              );
              return;
            }

            window.location.assign(payload.url);
          });
        }}
        disabled={isPending}
      >
        {isPending ? "Weiterleitung..." : "Zahlungspflichtig bestellen"}
      </button>
    </div>
  );
}
