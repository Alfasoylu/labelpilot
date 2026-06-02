import type { CtaLink } from "@/lib/site-content";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets?: string[];
  primaryCta?: React.ReactNode;
  secondaryCta?: React.ReactNode;
  aside?: React.ReactNode;
  visual?: React.ReactNode;
};

export function HeroSection({
  eyebrow,
  title,
  lead,
  bullets,
  primaryCta,
  secondaryCta,
  aside,
  visual,
}: HeroSectionProps) {
  return (
    <section className="hero-grid">
      <div className="hero-panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {bullets?.length ? (
          <ul className="hero-list">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
        {primaryCta || secondaryCta ? (
          <div className="hero-actions">
            {primaryCta}
            {secondaryCta}
          </div>
        ) : null}
      </div>
      {visual ?? aside ?? null}
    </section>
  );
}

export function actionLink(link: CtaLink, className: string) {
  return { href: link.href, label: link.label, className };
}
