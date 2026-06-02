import type { PackageTier } from "@/lib/site-content";

type PricingCardProps = {
  tier: PackageTier;
};

export function PricingCard({ tier }: PricingCardProps) {
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
    </article>
  );
}
