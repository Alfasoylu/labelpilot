import { cache } from "react";
import Link from "next/link";

import { getDefaultPricingSettings, mapPricingSettingsRecord } from "@/lib/admin/pricing";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { getPrismaClient } from "@/lib/db/prisma";
import type { AddonSettingsInput } from "@/lib/pricing/addons";
import { isAddonsEnabled } from "@/lib/pricing/addons-feature";
import type { PackageTier } from "@/lib/site-content";

type PricingCardProps = {
  tier: PackageTier;
  checkoutPackage?: {
    packageId: string;
    productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten";
    material: "OPAQUE" | "TRANSPARENT";
    quantity: number;
  };
  ctaLink?: {
    label: string;
    href: string;
  };
};

const getCheckoutAddonSettings = cache(async (): Promise<AddonSettingsInput> => {
  const prisma = getPrismaClient();

  if (!prisma) {
    return getDefaultPricingSettings();
  }

  const settingsRow = await prisma.pricingSettings.findUnique({
    where: { id: "default" },
  });

  return mapPricingSettingsRecord(settingsRow) ?? getDefaultPricingSettings();
});

export async function PricingCard({ tier, checkoutPackage, ctaLink }: PricingCardProps) {
  const addonSettings =
    checkoutPackage && isAddonsEnabled()
      ? await getCheckoutAddonSettings()
      : undefined;
  const packageSummaryLine =
    tier.grossLabel && tier.shippingLabel
      ? `${tier.priceLabel} · ${tier.grossLabel} inkl. 19% MwSt. · ${tier.shippingLabel}`
      : null;

  return (
    <article className={`pricing-card ${tier.popular ? "popular" : ""}`}>
      {tier.badge ? <span className="badge">{tier.badge}</span> : null}
      <h3>{tier.label}</h3>
      <div className="pricing-meta">
        <span>{tier.quantity}</span>
        <span>{tier.note}</span>
      </div>
      <p className="price">{tier.priceLabel}</p>
      {packageSummaryLine ? <p className="price-subline">{packageSummaryLine}</p> : null}
      {!packageSummaryLine && tier.grossLabel ? (
        <p className="price-subline">{tier.grossLabel} inkl. 19% MwSt.</p>
      ) : null}
      {tier.perPieceLabel ? <p className="price-subline">{tier.perPieceLabel}</p> : null}
      {!packageSummaryLine && tier.shippingLabel ? (
        <p className="price-subline">{tier.shippingLabel}</p>
      ) : null}
      <p className="price-note">{tier.description}</p>
      {tier.format || tier.material || tier.inclusions?.length ? (
        <ul className="pricing-card__specs">
          {tier.format ? <li>Format: {tier.format}</li> : null}
          {tier.material ? <li>Material: {tier.material}</li> : null}
          {tier.inclusions?.map((inclusion) => (
            <li key={inclusion}>{inclusion}</li>
          ))}
        </ul>
      ) : null}
      <div className="pricing-card__actions">
        {ctaLink ? (
          <Link
            href={ctaLink.href}
            className="pricing-card__action pricing-card__action--primary"
          >
            {ctaLink.label}
          </Link>
        ) : checkoutPackage ? (
          <CheckoutButton
            packageId={checkoutPackage.packageId}
            productSlug={checkoutPackage.productSlug}
            material={checkoutPackage.material}
            quantity={checkoutPackage.quantity}
            addonSettings={addonSettings}
          />
        ) : (
          <Link href="/de/angebot-anfordern" className="pricing-card__action pricing-card__action--secondary">
            Angebot anfordern
          </Link>
        )}
      </div>
    </article>
  );
}
