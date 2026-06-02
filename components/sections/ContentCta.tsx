import Link from "next/link";

type ContentCtaProps = {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function ContentCta({
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: ContentCtaProps) {
  return (
    <section className="cta-shell">
      <span className="eyebrow">Nächster Schritt</span>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="hero-actions">
        <Link href={primaryHref} className="cta-link">
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className="ghost-link">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
