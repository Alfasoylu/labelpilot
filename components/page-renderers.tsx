import Link from "next/link";

import { QuoteRequestForm } from "@/components/quote-request-form";
import type {
  HomePageData,
  PublicPageData,
  RelatedLink,
  SiteNavigationItem,
} from "@/lib/site-content";

type HomePageProps = {
  page: HomePageData;
  navigation: SiteNavigationItem[];
};

type DynamicPageProps = {
  page: PublicPageData;
  canonicalPath: string;
};

export function HomePage({ page, navigation }: HomePageProps) {
  return (
    <div className="container section-stack">
      <section className="hero-grid">
        <div className="hero-panel">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>
          <ul className="hero-list">
            {page.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link href="/de/angebot-anfordern" className="cta-link">
              Angebot anfordern
            </Link>
            <Link href="/de/ratgeber" className="secondary-link">
              Ratgeber ansehen
            </Link>
          </div>
        </div>
        <aside className="surface-card">
          <h2>Worauf die aktuelle Version fokussiert</h2>
          <ul className="simple-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <p>
            Phase 2 stärkt die P0-Seiten mit gezielten Branchen-, Ratgeber- und
            Glossar-Inhalten statt mit dünnen Massen-Templates.
          </p>
        </aside>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <span className="eyebrow">Preislogik</span>
          <h2>Die 5.000er-Menge bleibt der wirtschaftliche Kern</h2>
          <p>
            Die öffentliche Informationsarchitektur erklärt Material, Menge und
            Nachbestellung so, dass kommerzielle Seiten und Wissensseiten auf
            dieselbe Produktlogik einzahlen.
          </p>
        </div>
        <div className="pricing-grid">
          {page.corePackages.map((tier) => (
            <article
              key={tier.quantity}
              className={`pricing-card ${tier.popular ? "popular" : ""}`}
            >
              {tier.badge ? <span className="badge">{tier.badge}</span> : null}
              <h3>{tier.label}</h3>
              <div className="pricing-meta">
                <span>{tier.quantity}</span>
                <span>{tier.note}</span>
              </div>
              <p className="price">{tier.priceLabel}</p>
              <p className="price-note">{tier.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-grid">
        {page.topicCards.map((card) => (
          <article key={card.title} className="section-card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <Link href={card.href} className="secondary-link">
              Mehr erfahren
            </Link>
          </article>
        ))}
      </section>

      <section className="section-stack">
        <div className="section-header">
          <span className="eyebrow">Ablauf</span>
          <h2>Von der ersten Frage bis zur belastbaren Spezifikation</h2>
          <p>
            Produkt-, Branchen- und Wissensseiten arbeiten jetzt als
            zusammenhängendes internes Linksystem statt als einzelne Seiten.
          </p>
        </div>
        <div className="steps-grid">
          {page.steps.map((step) => (
            <article key={step.title} className="step-card">
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DynamicPage({ page, canonicalPath }: DynamicPageProps) {
  if (page.kind === "quote") {
    return <QuotePage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "legal") {
    return <LegalPage page={page} canonicalPath={canonicalPath} />;
  }

  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <section className="hero-grid">
        <div className="hero-panel">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>
          {page.heroBullets?.length ? (
            <ul className="hero-list">
              {page.heroBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
          <div className="hero-actions">
            {page.primaryCta ? (
              <Link href={page.primaryCta.href} className="cta-link">
                {page.primaryCta.label}
              </Link>
            ) : null}
            {page.secondaryCta ? (
              <Link href={page.secondaryCta.href} className="secondary-link">
                {page.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="surface-card">
          <h2>{page.sidebarTitle}</h2>
          <ul className="simple-list">
            {page.sidebarBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </aside>
      </section>

      {page.packageTable?.length ? (
        <section className="section-stack">
          <div className="section-header">
            <span className="eyebrow">Preisübersicht</span>
            <h2>{page.packageHeading ?? "Paket- und Mengenstruktur"}</h2>
            <p>{page.packageLead}</p>
          </div>
          <div className="pricing-grid">
            {page.packageTable.map((tier) => (
              <article
                key={`${page.slug}-${tier.quantity}`}
                className={`pricing-card ${tier.popular ? "popular" : ""}`}
              >
                {tier.badge ? <span className="badge">{tier.badge}</span> : null}
                <h3>{tier.label}</h3>
                <div className="pricing-meta">
                  <span>{tier.quantity}</span>
                  <span>{tier.note}</span>
                </div>
                <p className="price">{tier.priceLabel}</p>
                <p className="price-note">{tier.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {page.glossaryData ? <GlossaryDefinition page={page} /> : null}

      {page.howToSteps?.length ? (
        <section className="surface-card">
          <h2>Schritt für Schritt</h2>
          <ol className="status-list">
            {page.howToSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {page.sections.length ? (
        <section className="card-grid">
          {page.sections.map((section) => (
            <article key={section.title} className="section-card">
              <h3>{section.title}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul className="section-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {page.table ? (
        <section className="table-card">
          <h2>{page.table.title}</h2>
          <p>{page.table.lead}</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {page.table.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {page.table.rows.map((row) => (
                  <tr key={row.join("-")}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {page.hubLinks?.length ? (
        <section className="section-stack">
          <div className="section-header">
            <span className="eyebrow">Übersicht</span>
            <h2>Wichtige Unterseiten</h2>
            <p>
              Diese Hub-Seite verknüpft alle indexierbaren Unterseiten, damit
              keine isolierten Wissensseiten entstehen.
            </p>
          </div>
          <RelatedLinks links={page.hubLinks} />
        </section>
      ) : null}

      {page.relatedLinks?.length ? (
        <section className="section-stack">
          <div className="section-header">
            <span className="eyebrow">Weiterführend</span>
            <h2>Passende Seiten im Themencluster</h2>
            <p>
              Diese Verlinkungen folgen dem Hub-and-Spoke-Prinzip aus den
              SEO-Dokumenten und verbinden kommerzielle, erklärende und
              unterstützende Seiten.
            </p>
          </div>
          <RelatedLinks links={page.relatedLinks} />
        </section>
      ) : null}

      {page.faqs?.length ? (
        <section className="section-stack">
          <div className="section-header">
            <span className="eyebrow">FAQ</span>
            <h2>Häufige Fragen</h2>
            <p>
              Die Antworten bleiben kurz, konkret und stimmen mit dem sichtbaren
              Seiteninhalt überein.
            </p>
          </div>
          <div className="faq-grid">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function QuotePage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <section className="hero-grid">
        <div className="hero-panel">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>
          <ul className="hero-list">
            {page.heroBullets?.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link href="/de/musterbox" className="secondary-link">
              Musterbox anfordern
            </Link>
          </div>
        </div>
        <QuoteRequestForm />
      </section>

      <section className="card-grid">
        {page.sections.map((section) => (
          <article key={section.title} className="section-card">
            <h3>{section.title}</h3>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets?.length ? (
              <ul className="section-list">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      {page.faqs?.length ? (
        <section className="faq-grid">
          {page.faqs.map((faq) => (
            <article key={faq.question} className="faq-card">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function LegalPage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <article className="legal-card">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
        <div className="notice-card warning">
          <h2>⚠️ Rechtlich zu prüfen - Platzhalter</h2>
          <p>
            Diese Seite enthält bewusst nur die Grundstruktur. Vor dem
            produktiven Einsatz müssen Inhalte rechtlich geprüft und final
            freigegeben werden.
          </p>
        </div>
        <div className="card-grid">
          {page.sections.map((section) => (
            <section key={section.title} className="section-card">
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

function GlossaryDefinition({ page }: { page: PublicPageData }) {
  if (!page.glossaryData) {
    return null;
  }

  return (
    <section className="card-grid">
      <article className="section-card">
        <h3>Definition</h3>
        <p>{page.glossaryData.definition}</p>
      </article>
      <article className="section-card">
        <h3>Wann es wichtig wird</h3>
        <p>{page.glossaryData.whenItMatters}</p>
      </article>
      <article className="section-card">
        <h3>Beispiel und Bezug</h3>
        <p>{page.glossaryData.exampleUse}</p>
        <p>{page.glossaryData.relatedProduct}</p>
      </article>
    </section>
  );
}

function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <div className="card-grid">
      {links.map((link) => (
        <article key={link.href} className="section-card">
          <h3>{link.label}</h3>
          <p>{link.description}</p>
          <Link href={link.href} className="secondary-link">
            Zur Seite
          </Link>
        </article>
      ))}
    </div>
  );
}

function Breadcrumbs({
  currentLabel,
  currentPath,
}: {
  currentLabel: string;
  currentPath: string;
}) {
  const items: Array<{ label: string; href?: string }> = [{ label: "Start", href: "/de" }];

  if (currentPath === "/de/ratgeber") {
    items.push({ label: "Ratgeber" });
  } else if (currentPath.startsWith("/de/ratgeber/")) {
    items.push({ label: "Ratgeber", href: "/de/ratgeber" });
    items.push({ label: currentLabel });
  } else if (currentPath === "/de/glossar") {
    items.push({ label: "Glossar" });
  } else if (currentPath.startsWith("/de/glossar/")) {
    items.push({ label: "Glossar", href: "/de/glossar" });
    items.push({ label: currentLabel });
  } else if (currentPath !== "/de") {
    items.push({ label: currentLabel });
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
          {index < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  );
}
