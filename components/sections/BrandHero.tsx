import Image from "next/image";
import Link from "next/link";

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
          <Link href="/de/angebot-anfordern" className="cta-link">
            Angebot anfordern
          </Link>
          <Link href="/de/musterbox" className="cta-link">
            Musterbox anfordern
          </Link>
          <Link href="#pakete" className="secondary-link">
            Preise ansehen
          </Link>
        </div>
        <ul className="hero-split__trust">
          <li>
            <Link href="/de/angebot-anfordern">Angebot:</Link> bei Sonderfällen,
            großen Mengen oder mehreren Sorten.
          </li>
          <li>
            <Link href="/de/musterbox">Musterbox:</Link> wenn Material, Haptik
            oder opak vs. transparent noch offen sind.
          </li>
          <li>
            <Link href="/de/nachbestellen">Nachbestellen:</Link> wenn Datei,
            Material und Spezifikation schon freigegeben wurden.
          </li>
        </ul>
        <ul className="hero-split__trust">
          <li>Technische Druckdatenprüfung</li>
          <li>Proof vor Produktion</li>
          <li>Versand nach Deutschland</li>
        </ul>
      </div>
      <div className="hero-split__visual">
        <figure className="hero-product-photo">
          <Image
            src="/images/editorial/home-hero-label-roll-cluster.webp"
            alt="Rolle blanko gestanzter PP-Rollenetiketten neben Getränkeflasche, Honigglas und Supplement-Dose"
            width={900}
            height={1125}
            priority
            sizes="(max-width: 1024px) 100vw, 465px"
            className="hero-product-photo__img"
          />
          <div className="hero-product-photo__badge">
            <span className="hero-product-photo__badge-dim">100×200 mm</span>
            <span className="hero-product-photo__badge-pill">Nachbestellbar</span>
          </div>
        </figure>
      </div>
    </section>
  );
}
