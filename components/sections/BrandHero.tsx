import Image from "next/image";
import Link from "next/link";

type BrandHeroProps = {
  title: string;
  lead: string;
};

export function BrandHero({ title, lead }: BrandHeroProps) {
  return (
    <section className="brand-hero">
      <div className="brand-hero__image">
        <Image
          src="/images/startseite-hero-pp-rollenetiketten.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="brand-hero__media"
        />
      </div>
      <div className="brand-hero__overlay" />
      <div className="brand-hero__inner">
        <div className="brand-hero__content">
          <h1 className="brand-hero__title">{title}</h1>
          <p className="brand-hero__lead">{lead}</p>
          <div className="brand-hero__actions">
            <Link href="/de/angebot-anfordern" className="brand-hero__cta brand-hero__cta--primary">
              Angebot anfordern
            </Link>
            <Link href="/de/musterbox" className="brand-hero__cta brand-hero__cta--secondary">
              Musterbox
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
