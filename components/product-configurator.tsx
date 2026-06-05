"use client";

import { useState } from "react";
import Link from "next/link";

import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { CustomSizePriceForm } from "@/components/custom-size-price-form";
import { customSizeFeatureEnabled } from "@/lib/pricing/custom-size-feature";
import type { PackageTier } from "@/lib/site-content";

type Material = "OPAQUE" | "TRANSPARENT";
type SizePath = "standard" | "custom";

type ProductConfiguratorProps = {
  opaquePackages: PackageTier[];
  transparentPackages: PackageTier[];
  initialMaterial?: Material;
  initialSize?: SizePath;
  initialQuantity?: number;
};

const STANDARD_QUANTITIES = [1000, 2000, 5000, 10000];

function quantityOf(tier: PackageTier) {
  return Number.parseInt(tier.quantity.replace(/\D/g, ""), 10);
}

export function ProductConfigurator({
  opaquePackages,
  transparentPackages,
  initialMaterial = "OPAQUE",
  initialSize = "standard",
  initialQuantity = 5000,
}: ProductConfiguratorProps) {
  const [material, setMaterial] = useState<Material>(initialMaterial);
  const [size, setSize] = useState<SizePath>(initialSize);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const table = material === "TRANSPARENT" ? transparentPackages : opaquePackages;
  const materialLabel = material === "TRANSPARENT" ? "Transparentes PP" : "Opakes PP";
  const materialParam = material === "TRANSPARENT" ? "transparent" : "opaque";
  const productSlug =
    material === "TRANSPARENT" ? "transparente-pp-etiketten" : "opake-pp-etiketten";
  const selectedTier = table.find(
    (tier) => quantityOf(tier) === quantity && tier.priceLabel !== "Angebot",
  );
  const quoteHref = `/de/angebot-anfordern?material=${materialParam}`;

  const toggle = (active: boolean) => (active ? "cta-link" : "secondary-link");

  return (
    <div className="configurator">
      <div className="card-grid">
        <article className="feature-card">
          <h4>1 · Material</h4>
          <div className="inline-actions">
            <button
              type="button"
              className={toggle(material === "OPAQUE")}
              aria-pressed={material === "OPAQUE"}
              onClick={() => setMaterial("OPAQUE")}
            >
              Opakes PP
            </button>
            <button
              type="button"
              className={toggle(material === "TRANSPARENT")}
              aria-pressed={material === "TRANSPARENT"}
              onClick={() => setMaterial("TRANSPARENT")}
            >
              Transparentes PP
            </button>
          </div>
        </article>

        <article className="feature-card">
          <h4>2 · Größe</h4>
          <div className="inline-actions">
            <button
              type="button"
              className={toggle(size === "standard")}
              aria-pressed={size === "standard"}
              onClick={() => setSize("standard")}
            >
              Standardgröße 100×200 mm
            </button>
            <button
              type="button"
              className={toggle(size === "custom")}
              aria-pressed={size === "custom"}
              onClick={() => setSize("custom")}
            >
              Wunschformat
            </button>
          </div>
        </article>

        {size === "standard" ? (
          <article className="feature-card">
            <h4>3 · Menge</h4>
            <p className="field-hint">
              5.000 Stück ist die empfohlene B2B-Menge. 1.000 Stück bleibt der bezahlte
              Einstieg.
            </p>
            <div className="inline-actions">
              {STANDARD_QUANTITIES.map((qty) => {
                const tier = table.find((tierItem) => quantityOf(tierItem) === qty);
                return (
                  <button
                    key={qty}
                    type="button"
                    className={toggle(quantity === qty)}
                    aria-pressed={quantity === qty}
                    onClick={() => setQuantity(qty)}
                  >
                    {qty.toLocaleString("de-DE")} Stück
                    {qty === 5000 ? " · empfohlen" : ""}
                    {tier ? ` · ${tier.priceLabel}` : ""}
                  </button>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>

      {size === "standard" ? (
        selectedTier ? (
          <article className="surface-card configurator__result">
            <p className="price-note">
              Ausgewählt: {materialLabel} · 100×200 mm · {quantity.toLocaleString("de-DE")} Stück
            </p>
            <p className="price">{selectedTier.priceLabel}</p>
            <p className="price-note">
              {selectedTier.grossLabel} brutto (inkl. 19% MwSt) · {selectedTier.perPieceLabel} ·
              inkl. Versand nach Deutschland
            </p>
            <ul className="simple-list">
              <li>Technische Druckdatenprüfung + 1 digitaler Proof inklusive</li>
              <li>Gespeicherte Druckdaten für die schnelle Nachbestellung</li>
              <li>Lieferzeit: ca. 10–14 Werktage nach Ihrer Freigabe (keine bindende Garantie)</li>
            </ul>
            <CheckoutButton
              packageId={`${materialParam}-pp-100x200-${quantity}`}
              productSlug={productSlug}
              material={material}
              quantity={quantity}
            />
          </article>
        ) : (
          <article className="surface-card configurator__result">
            <h4>Ab 20.000 Stück: individuelles B2B-Angebot</h4>
            <p>
              Für Großmengen ab 20.000 Stück kalkulieren wir ein individuelles Angebot statt
              des Direkt-Checkouts.
            </p>
            <div className="inline-actions">
              <Link href={quoteHref} className="cta-link">
                Angebot anfordern
              </Link>
              <Link href="/de/kontakt" className="secondary-link">
                Rückfrage klären
              </Link>
            </div>
          </article>
        )
      ) : customSizeFeatureEnabled ? (
        <CustomSizePriceForm
          variant="compact"
          initialMaterialKey={material === "TRANSPARENT" ? "TRANSPARENT_PP" : "OPAQUE_PP"}
        />
      ) : (
        <article className="surface-card configurator__result">
          <h4>Wunschformat über individuelles Angebot</h4>
          <p>
            Sondergrößen kalkulieren wir nach Fläche, Material und Stückzahl im individuellen
            B2B-Angebot. Bei komplexen Anforderungen erstellen wir Ihnen ein passendes Angebot.
          </p>
          <div className="inline-actions">
            <Link href={quoteHref} className="cta-link">
              Individuelles Angebot anfordern
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
