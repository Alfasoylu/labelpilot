import Link from "next/link";

import { LabelRollVisual } from "@/components/marketing/LabelRollVisual";

type BrandHeroProps = {
  title: string;
  lead: string;
};

export function BrandHero({ title, lead }: BrandHeroProps) {
  return (
    <section className="hero-split container">
      <div className="hero-split__content">
        <span className="eyebrow">PP-Rollenetiketten für Produktmarken</span>
        <h1 className="hero-split__title">{title}</h1>
        <p className="hero-split__lead">{lead}</p>
        <div className="hero-split__actions">
          <Link href="/de/opake-pp-etiketten" className="cta-link">
            Jetzt konfigurieren
          </Link>
          <Link href="/de/musterbox" className="secondary-link">
            Musterbox anfordern
          </Link>
        </div>
        <ul className="hero-split__trust">
          <li>Technische Druckdatenprüfung</li>
          <li>Proof vor Produktion</li>
          <li>Versand nach Deutschland</li>
        </ul>
      </div>
      <div className="hero-split__visual">
        <LabelRollVisual />
      </div>
    </section>
  );
}
