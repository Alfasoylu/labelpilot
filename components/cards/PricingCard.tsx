import Link from "next/link";

import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import type { PackageTier } from "@/lib/site-content";

type PricingCardProps = {
  tier: PackageTier;
  checkoutPackage?: {
    packageId: string;
    productSlug: "opake-pp-etiketten" | "transparente-pp-etiketten";
    material: "OPAQUE" | "TRANSPARENT";
    quantity: number;
  };
};

export function PricingCard({ tier, checkoutPackage }: PricingCardProps) {
  return (
    <article className={`pricing-card ${tier.popular ? "popular" : ""}`}>
      {tier.badge ? <span className="badge">{tier.badge}</span> : null}
      <h3>{tier.label}</h3>
      <div className="pricing-meta">
        <span>{tier.quantity}</span>
        <span>{tier.note}</span>
      </div>
      <p className="price">{tier.priceLabel}</p>
      {tier.grossLabel ? <p className="price-subline">{tier.grossLabel} inkl. 19% MwSt.</p> : null}
      {tier.shippingLabel ? <p className="price-subline">{tier.shippingLabel}</p> : null}
      <p className="price-note">{tier.description}</p>
      <div className="pricing-card__actions">
        {checkoutPackage ? (
          <CheckoutButton
            packageId={checkoutPackage.packageId}
            productSlug={checkoutPackage.productSlug}
            material={checkoutPackage.material}
            quantity={checkoutPackage.quantity}
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
