import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/cards/ProductCard";
import { SampleBoxCard } from "@/components/cards/SampleBoxCard";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Section } from "@/components/layout/Section";
import { LegalNoticeBox } from "@/components/legal/LegalNoticeBox";
import { HeroKalkulator } from "@/components/sections/HeroKalkulator";
import { LabelJourney } from "@/components/sections/LabelJourney";
import { ContentCta } from "@/components/sections/ContentCta";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  ProcessSteps,
} from "@/components/sections/ProcessSteps";
import {
  ReorderWorkflowBlock,
  StoredDesignVisualCard,
} from "@/components/sections/ReorderWorkflowBlock";
import { TrustBar } from "@/components/sections/TrustBar";
import { VariableDataBlock } from "@/components/sections/VariableDataBlock";
import { ComparisonTable } from "@/components/tables/ComparisonTable";
import { SpecTable } from "@/components/tables/SpecTable";
import { QuoteRequestForm } from "@/components/quote-request-form";
import { SampleBoxRequestForm } from "@/components/sample-box-request-form";
import type {
  FAQ,
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
  searchParams?: {
    material?: string;
    size?: string;
    quantity?: string;
  };
};

const productImageAssets = {
  productLine: {
    src: "/images/pp-rollenetiketten-produktlinie.webp",
    alt: "Produkte mit individuell bedruckten PP-Rollenetiketten: Flasche, Standbeutel, Supplement-Flasche und Tiegel",
  },
  roll: {
    src: "/images/pp-rollenetiketten-rolle.webp",
    alt: "Rolle mit gestanzten PP-Rollenetiketten, teilweise abgerollt",
  },
  compare: {
    src: "/images/transparente-vs-opake-pp-etiketten.webp",
    alt: "Vergleich: transparentes PP-Etikett auf Glasflasche neben opakem PP-Etikett auf Standbeutel",
  },
  industries: {
    src: "/images/etiketten-branchen-uebersicht.webp",
    alt: "PP-Etiketten für Lebensmittel-, Getränke-, Supplement- und Kosmetikprodukte in der Übersicht",
  },
  sampleBox: {
    src: "/images/musterbox-etiketten-muster.webp",
    alt: "Geöffnete Musterbox mit PP-Etikettenmustern in opaker und transparenter Ausführung",
  },
  druckdatenCheck: {
    src: "/images/druckdaten-pruefung.webp",
    alt: "Druckdaten-Proof mit Beschnitt- und Passermarken unter einer Lupe",
  },
  qualityControl: {
    src: "/images/etiketten-qualitaetskontrolle.webp",
    alt: "Hände prüfen frisch gedruckte PP-Etiketten gegen das Licht",
  },
  beverages: {
    src: "/images/getraenke-flaschenetiketten.webp",
    alt: "Glasflaschen für Getränke mit umlaufenden PP-Etiketten",
  },
  foodGlass: {
    src: "/images/lebensmittel-glasetiketten.webp",
    alt: "Lebensmittelgläser mit Etiketten für Honig, Marmelade und Gewürze",
  },
  supplementData: {
    src: "/images/supplement-etiketten-variable-daten.webp",
    alt: "Supplement-Flaschen mit Etiketten und markierter Datenzone für Lot und SKT",
  },
} as const;


const homepageOrderingSteps = [
  { title: "Format & Menge eingeben", body: "Breite, Höhe und Menge frei wählen – Sofortpreis erscheint direkt im Kalkulator." },
  { title: "Material wählen", body: "Opak PP, transparent PP oder Etikettenpapier – matt oder glänzend, kein Aufpreis." },
  { title: "Druckdaten hochladen oder später senden", body: "PDF, AI, EPS oder SVG – technische Prüfung inklusive. Druckdaten können auch nach der Bestellung nachgeliefert werden." },
  { title: "Produktion starten & nachbestellen", body: "Nach Proof-Freigabe startet die Produktion. Beim nächsten Mal sind Format, Material und Druckdaten bereits gespeichert – Nachbestellung in 30 Sekunden." },
];

const homepageFaqs: FAQ[] = [
  {
    question: "Welche Etikettenmaterialien gibt es?",
    answer: "PP-Folie weiß (opak), PP-Folie transparent und Etikettenpapier weiß. Der Kalkulator zeigt den Preis für jedes Material direkt an.",
  },
  {
    question: "Kann ich mein eigenes Format bestellen?",
    answer: "Ja. Im Kalkulator Breite und Höhe frei eingeben – bis 320 mm Breite, keine Höhenbeschränkung. Der Preis wird sofort berechnet.",
  },
  {
    question: "Welche Druckdaten werden benötigt?",
    answer: "PDF, AI, EPS, SVG, PNG oder JPG mit 3 mm Beschnitt. Wir prüfen die Daten vor der Produktion.",
  },
  {
    question: "Kann ich Druckdaten später senden?",
    answer: "Ja. Im Checkout gibt es die Option ‚Druckdaten später hochladen'. Die Produktion startet erst nach Datenprüfung und Proof-Freigabe.",
  },
  {
    question: "Kann ich dieselben Etiketten später nachbestellen?",
    answer: "Ja. Freigegebene Druckdaten, Material, Maße und Produktionsparameter bleiben gespeichert – die Nachbestellung startet in 30 Sekunden aus dem Kundenkonto.",
  },
  {
    question: "Gibt es transparente und opake PP-Etiketten?",
    answer: "Ja. Opak für deckende Optik, transparent für sichtbare Verpackung.",
  },
  {
    question: "Für welche Produkte sind PP-Rollenetiketten geeignet?",
    answer: "Für Lebensmittel, Getränke, Supplemente, Kosmetik, Kaffee, Honig, Saucen, Dressings und Private-Label-Produkte.",
  },
  {
    question: "Gibt es einen Proof vor der Produktion?",
    answer: "Ja. Eine Proof-Runde gehört zu jedem Paket. Die Produktion startet erst nach Ihrer Freigabe.",
  },
  {
    question: "Wann sollte ich ein Angebot anfordern?",
    answer: "Ab 20.000 Stück, bei mehreren Designs, Sonderformen oder Veredelung.",
  },
  {
    question: "Wie schnell wird produziert?",
    answer:
      "Die Produktion startet nach Ihrer Proof-Freigabe. Den konkreten Liefertermin bestätigen wir mit dem Auftrag bzw. Angebot.",
  },
  {
    question: "Welche Formate sind möglich?",
    answer:
      "Im Kalkulator Breite und Höhe frei wählen – Breite bis 320 mm, Höhe frei. Andere Rollenkerne oder Sonderlängen auf Anfrage.",
  },
  {
    question: "Kann ich mehrere Sorten kombinieren?",
    answer:
      "Ja. Mehrere Sorten oder Designs in einem Projekt bündeln wir über ein gemeinsames B2B-Angebot.",
  },
  {
    question: "Sind Sonderformate möglich?",
    answer:
      "Ja. Sonderformate, Konturschnitte und Veredelungen sind möglich und werden als Angebot kalkuliert.",
  },
  {
    question: "Werden meine Druckdaten gespeichert?",
    answer:
      "Ja. Freigegebene Druckdaten, Material und Maß bleiben gespeichert, damit die nächste Bestellung ohne neue Abstimmung startet.",
  },
];

const homepageUseCards = [
  { title: "Lebensmittel", body: "Gewürze, Aufstriche, Feinkost, Gläser und Beutel." },
  { title: "Getränke", body: "Flaschen, Sirup, Öle, Smoothies und Spirituosen." },
  { title: "Supplemente", body: "Dosen, Flaschen und Beutel für Nahrungsergänzung." },
  { title: "Kosmetik", body: "Tiegel, Cremes, Seren, Shampoos und Körperpflege." },
  { title: "Kaffee & Tee", body: "Beutel, Dosen und Standbeutel für Röstkaffee und Tee." },
  { title: "Honig & Feinkost", body: "Gläser, Tiegel und Feinkostgläser für Imker und Händler." },
  { title: "Saucen & Dressings", body: "Dips, Würzpasten und Dressings im Glas oder Flasche." },
  { title: "Private Label", body: "Handelsmarken, White Label und B2B-Eigenmarken." },
];

const differentiationClassic = [
  "Jede Bestellung neu hochladen",
  "Wenig Wiederbestelllogik",
  "Unpraktisch bei vielen Sorten",
  "Nicht auf Produktmarken fokussiert",
];

const differentiationLabelpilot = [
  "Freigegebene Druckdaten gespeichert",
  "Nachbestellung in 30 Sekunden",
  "Wunschformat nach Maß",
  "Optimiert für Lebensmittel, Getränke, Supplemente und Handelsmarken",
];

const regulatoryDisclaimerBody =
  "Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.";

const productTrustItems = [
  {
    title: "Proof vor Produktion",
    body: "Produktion startet erst nach Ihrer Freigabe. Das schafft Klarheit vor dem eigentlichen Drucklauf.",
  },
  {
    title: "Kostenloser Datencheck",
    body: "Die Standard-Datenprüfung fängt typische Format-, Beschnitt- und Versionsfehler vor dem Druck ab.",
  },
  {
    title: "Musterbox vor Mengenentscheidung",
    body: "Wenn Materialwirkung oder Haptik noch offen sind, ist die Musterbox der kontrollierte Zwischenschritt.",
  },
  {
    title: "Sichere Zahlung, nachvollziehbarer Ablauf",
    body: "Checkout, Zahlungsbestätigung, Auftragsbestätigung und Proof-Freigabe – jeder Schritt ist einsehbar und dokumentiert.",
  },
];

export function HomePage({ page }: HomePageProps) {
  const homepageTrustItems = [
    { title: "PP opak & transparent", body: "Zwei Materialien für jede Verpackung." },
    { title: "Druckdaten gespeichert", body: "Freigegebene Version bleibt nutzbar." },
    { title: "Proof vor Produktion", body: "Produktion erst nach Ihrer Freigabe." },
    { title: "Angebot ab 20.000 Stück", body: "Großmengen individuell kalkuliert." },
  ];

  return (
    <>
      <HeroKalkulator />

      <div className="container section-stack">
        <TrustBar items={homepageTrustItems} />

        <Section
          eyebrow="Verpackungen"
          title="Für jede Produktkategorie das passende Etikett."
        >
          <div className="use-grid">
            {homepageUseCards.map((useCard) => (
              <article key={useCard.title} className="use-card">
                <h3>{useCard.title}</h3>
                <p>{useCard.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Vergleich"
          title="Warum Labelpilot statt klassischer Online-Druckerei?"
        >
          <div className="compare-grid">
            <article className="compare-card compare-card--classic">
              <h3>Klassische Online-Druckerei</h3>
              <ul className="compare-list">
                {differentiationClassic.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="compare-card compare-card--labelpilot">
              <h3>Labelpilot</h3>
              <ul className="compare-list">
                {differentiationLabelpilot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </Section>

        <Section
          id="kalkulator"
          eyebrow="Wunschformat & Preise"
          title="Ihr Format, Ihr Preis – sofort berechnet."
          lead="Keine Standardgrößen. Breite, Höhe und Menge frei wählbar – der Preis wird in Sekunden berechnet."
        >
          <div className="card-grid">
            <article className="section-card">
              <h3>Fertigung nach Maß</h3>
              <p>Breite bis 320 mm, Höhe frei. Opak PP oder Transparent PP, Matt oder Glänzend – kein Aufpreis für die Oberfläche.</p>
            </article>
            <article className="section-card">
              <h3>Sofortpreis im Kalkulator</h3>
              <p>Format eingeben, Menge wählen – der Netto- und Bruttopreis erscheint sofort. Keine Anfrage nötig bis 19.999 Stück.</p>
            </article>
            <article className="section-card">
              <h3>Direkt zur Bestellung</h3>
              <p>Nach der Preisberechnung Bestelldaten eingeben und direkt zu Stripe weiter. Kein Umweg über Anfragen oder Rückrufe.</p>
            </article>
          </div>
          <div className="hero-actions">
            <Link href="/de/kalkulator" className="cta-button">
              Zum Kalkulator
            </Link>
            <Link href="/de/angebot-anfordern" className="secondary-link">
              B2B-Angebot anfordern
            </Link>
          </div>
        </Section>

        <Section
          eyebrow="Einstieg"
          title="Welcher nächste Schritt passt zu Ihrer Situation?"
          lead="Nicht jede Anfrage gehört in denselben Funnel. Hier ist der schnellste sinnvolle Weg."
        >
          <div className="card-grid">
            <article className="section-card">
              <h3>Angebot anfordern</h3>
              <p>Für größere Mengen, Sonderfälle, mehrere Sorten oder Projekte außerhalb des Standardpakets.</p>
              <Link href="/de/angebot-anfordern" className="cta-link">
                Zum B2B-Angebot
              </Link>
            </article>
            <article className="section-card">
              <h3>Musterbox anfordern</h3>
              <p>Wenn Materialwirkung, Haptik oder opak vs. transparent noch vor der ersten Freigabe geprüft werden soll.</p>
              <Link href="/de/musterbox" className="cta-link">
                Zur Musterbox
              </Link>
            </article>
            <article className="section-card">
              <h3>Nachbestellen</h3>
              <p>Wenn Datei, Material und Spezifikation schon freigegeben wurden und der nächste Abruf schneller laufen soll.</p>
              <Link href="/de/nachbestellen" className="cta-link">
                Zur Nachbestellung
              </Link>
            </article>
          </div>
        </Section>

        <LabelJourney />

        <section className="material-split">
          <div className="material-split__head section-header">
            <span className="eyebrow">Materialien</span>
            <h2>Material wählen, bevor die Datei in Produktion geht.</h2>
            <p>
              Opak für deckende Farben. Transparent für Flaschen, Gläser und
              Produkte, bei denen der Inhalt sichtbar bleiben soll.
            </p>
          </div>
          <div className="material-split__visual">
            <figure className="material-photo-single">
              <Image
                src="/images/editorial/home-material-opaque-vs-transparent.webp"
                alt="Opakes PP-Etikett auf matter Dose neben transparentem PP-Etikett auf Glasflasche, davor je ein PP-Materialstreifen"
                width={1200}
                height={675}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="material-photo-single__img"
              />
              <figcaption className="material-photo-single__caption">
                Links opak, rechts transparent – mit PP-Materialstreifen.
              </figcaption>
            </figure>
          </div>
          <div className="material-split__table">
            <ComparisonTable
              title="Material im Überblick"
              lead="Wirkung und typische Nutzung."
              columns={["Material", "Wirkung", "Typische Nutzung"]}
              rows={[
                ["Opak PP", "deckend, stabil", "Dosen, Beutel, Gläser"],
                ["Transparent PP", "klar, hochwertig", "Flaschen, Gläser, Premium-Produkte"],
              ]}
            />
          </div>
        </section>

        <Section
          eyebrow="Nachbestellen"
          title="Einmal freigeben. Immer wieder nachbestellen."
          lead="Freigegebene Druckdaten, Maße, Material und Produktionsparameter bleiben gespeichert – die nächste Bestellung dauert Sekunden."
        >
          <div className="card-grid">
            <article className="section-card">
              <h3>Druckdaten gespeichert</h3>
              <p>Freigegebene Datei bleibt im Kundenkonto abrufbar. Kein erneutes Suchen oder Hochladen.</p>
            </article>
            <article className="section-card">
              <h3>Format & Spezifikation hinterlegt</h3>
              <p>Breite, Höhe, Material, Oberfläche und Produktionsparameter werden automatisch übernommen.</p>
            </article>
            <article className="section-card">
              <h3>Nachbestellung in 30 Sekunden</h3>
              <p>Aus dem Kundenkonto heraus eine neue Bestellung mit derselben Konfiguration starten – inklusive Bestell- und Rechnungsverlauf.</p>
            </article>
          </div>
          <div className="hero-actions">
            <Link href="/konto" className="cta-button">
              Kundenkonto erstellen
            </Link>
            <Link href="/de/nachbestellen" className="secondary-link">
              Nachbestellprozess ansehen
            </Link>
          </div>
        </Section>

        <Section
          eyebrow="Ablauf"
          title="Vom Etikett bis zur Produktion."
          lead="Ein klarer Weg ohne Rückfragen-Schleifen."
        >
          <ProcessSteps steps={homepageOrderingSteps} />
          <div className="hero-actions">
            <Link href="/de/kalkulator" className="cta-link">
              Zum Kalkulator
            </Link>
          </div>
        </Section>

        <Section
          eyebrow="Branchen"
          title="Für Lebensmittel, Getränke, Supplemente und Handelsmarken."
          lead="Etiketten für Produkte, die regelmäßig produziert, geprüft und nachbestellt werden."
        >
          <div className="two-column image-supported-grid">
            <div className="card-grid">
              {[
                {
                  label: "Honig & Feinkost",
                  href: "/de/lebensmittel-etiketten",
                  body: "Honig, Aufstriche und Feinkost im Glas: Etiketten, die Feuchtigkeit vertragen und mit präzisen Kanten am Rundglas sitzen.",
                },
                {
                  label: "Getränke",
                  href: "/de/getraenke-etiketten",
                  body: "Getränkeflaschen leben von transparenter Optik – das Etikett muss auch bei Kondenswasser zuverlässig haften und lesbar bleiben.",
                },
                {
                  label: "Nahrungsergänzung",
                  href: "/de/supplement-etiketten",
                  body: "Dosen, Flaschen und Beutel in mehreren Varianten – jede Serie mit derselben gespeicherten Spezifikation.",
                },
                {
                  label: "Kaffee & Tee",
                  href: "/de/kaffee-etiketten",
                  body: "Kaffee- und Teebeutel wirken mit mattem PP hochwertig und laufen gleichmäßig über die gesamte Rolle.",
                },
              ].map((item) => (
                <ProductCard
                  key={item.href}
                  title={item.label}
                  body={item.body}
                  href={item.href}
                />
              ))}
            </div>
            <EditorialImage
              src="/images/editorial/home-branchen-product-group.webp"
              alt="Honigglas, Getränkeflasche, Supplement-Dose und Kaffeebeutel mit PP-Etiketten, davor eine Rolle blanko PP-Etiketten"
              caption="Honig, Getränke, Supplement und Kaffee – dieselbe PP-Etikettenproduktion."
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </Section>

        <section className="two-column">
          <div className="section-header">
            <span className="eyebrow">Musterbox</span>
            <h2>Material zuerst prüfen. Dann bestellen.</h2>
            <p>
              Fordern Sie eine Musterbox an, prüfen Sie opake und transparente
              PP-Materialien und entscheiden Sie danach über die passende
              Etikettenproduktion.
            </p>
            <ul className="simple-list">
              <li>Musterbox: kostenlos anfordern</li>
              <li>Digitaler Proof: 10 EUR netto</li>
              <li>Technischer Datencheck: inklusive</li>
              <li>Design-Service: 40 EUR netto (kostenlos ab 2.000 EUR Auftragswert)</li>
            </ul>
            <div className="hero-actions">
              <Link href="/de/musterbox" className="cta-link">
                Musterbox anfordern
              </Link>
              <Link href="/de/angebot-anfordern" className="secondary-link">
                Individuelles Angebot
              </Link>
            </div>
          </div>
          <figure className="sample-box-photo">
            <Image
              src="/images/editorial/home-musterbox-sample-kit.webp"
              alt="Geöffnete Musterbox mit opaken und transparenten PP-Etikettenrollen, Materialmustern und einer Rolle blanko Etiketten"
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 520px"
              className="sample-box-photo__img"
            />
          </figure>
        </section>

        <Section eyebrow="Fragen" title="Häufige Fragen zu PP-Rollenetiketten.">
          <FaqAccordion faqs={homepageFaqs} />
        </Section>

        <section className="cta-editorial">
          <div className="cta-editorial__media">
            <Image
              src="/images/editorial/home-cta-label-roll-macro.webp"
              alt="Nahaufnahme einer Rolle blanko gestanzter PP-Rollenetiketten"
              fill
              sizes="100vw"
              className="cta-editorial__img"
            />
          </div>
          <div className="cta-editorial__content">
            <span className="eyebrow">Nächster Schritt</span>
            <h2>Preis sofort berechnen oder direkt anfragen.</h2>
            <p>Kalkulator für Sofortpreis, Musterbox für Materialentscheidung oder individuelles B2B-Angebot.</p>
            <div className="hero-actions">
              <Link href="/de/kalkulator" className="cta-button">
                Preis berechnen
              </Link>
              <Link href="/de/musterbox" className="secondary-link">
                Musterbox anfordern
              </Link>
              <Link href="/de/angebot-anfordern" className="secondary-link">
                Angebot erhalten
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function DynamicPage({ page, canonicalPath, searchParams }: DynamicPageProps) {
  if (page.kind === "quote") {
    return <QuotePage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "legal") {
    return <LegalPage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "hub") {
    return <HubPage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "guide") {
    return <GuidePage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "glossary") {
    return <GlossaryPage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "industry") {
    return <IndustryPage page={page} canonicalPath={canonicalPath} />;
  }

  if (page.kind === "product" || page.kind === "collection") {
    return (
      <ProductLikePage
        page={page}
        canonicalPath={canonicalPath}
        searchParams={searchParams}
      />
    );
  }

  return <ServicePage page={page} canonicalPath={canonicalPath} />;
}

function ProductLikePage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={renderLink(page.primaryCta, "cta-link")}
        secondaryCta={renderLink(page.secondaryCta, "secondary-link")}
        aside={<QuickAnswerCard page={page} />}
      />

      <Section
        eyebrow="Spezifikation"
        title="Material, Maß und Format auf einen Blick"
        lead="Die wichtigsten Eckdaten kompakt."
      >
        <div className="two-column">
          <SpecTable title="Spezifikationen auf einen Blick" rows={buildSpecRows(page)} />
          {page.table ? (
            <ComparisonTable
              title={page.table.title}
              lead={page.table.lead}
              columns={page.table.columns}
              rows={page.table.rows}
            />
          ) : (
            <div className="surface-card">
              <h2>Wofür dieses Material passt</h2>
              <ul className="simple-list">
                {page.sidebarBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {getProductPageImage(page.path) ? (
        <Section
          eyebrow="Produktansicht"
          title={getProductPageImage(page.path)?.title ?? "So wirkt das Material auf der Verpackung"}
          lead={getProductPageImage(page.path)?.lead ?? "Etiketten im realen Produktkontext."}
        >
          <EditorialImage
            src={getProductPageImage(page.path)!.src}
            alt={getProductPageImage(page.path)!.alt}
            caption={getProductPageImage(page.path)!.caption}
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      <Section
        eyebrow="Kalkulator"
        title="Preis für Ihr Wunschformat berechnen"
        lead="Breite, Höhe, Material und Menge eingeben – der Kalkulator zeigt den Preis sofort."
      >
        <div className="hero-actions">
          <Link href="/de/kalkulator" className="cta-button">
            Preis berechnen
          </Link>
          <Link href="/de/angebot-anfordern" className="secondary-link">
            B2B-Angebot anfordern
          </Link>
        </div>
      </Section>

      <Section
        eyebrow="Sicherheit"
        title="Warum der Ablauf für B2B-Etiketten berechenbar bleibt"
        lead="Vertrauen entsteht hier nicht über Bewertungen, sondern über einen klar sichtbaren Produktions- und Prüfprozess."
      >
        <TrustBar items={productTrustItems} />
        <div className="surface-card">
          <h2>Materialhinweis zu PP</h2>
          <p>
            Unsere Standardprodukte laufen auf PP-Material, weil es für viele
            wiederkehrende Produktetiketten robust und prozesssicher ist.
          </p>
          <p className="field-hint">
            Nach Freigabe bleiben Spezifikation und Druckdaten als klare Basis für
            spätere Auftragsbestätigung und schnellere Nachbestellung erhalten.
          </p>
          <p className="field-hint">
            Daraus leiten wir keine pauschalen Nachhaltigkeits- oder Recyclingversprechen
            ab. Wenn Sie Varianten mit anderem Materialfokus prüfen möchten, klären wir
            das direkt über Angebot oder Musterbox.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Leistungsumfang"
        title="Inklusive in jedem Auftrag"
        lead="Was im Auftragsumfang steckt – und wann ein Angebot sinnvoll ist."
      >
        <div className="two-column">
          <div className="surface-card">
            <h3>Im Preis enthalten</h3>
            <ul className="simple-list">
              <li>1 Design / 1 Artwork pro Auftrag</li>
              <li>PP-Material nach Wahl (opak oder transparent)</li>
              <li>Permanenter Klebstoff</li>
              <li>4/0-farbiger CMYK-Digitaldruck</li>
              <li>Matt oder Glänzend – kein Preisaufschlag</li>
              <li>Kostenlose Druckdatenprüfung + 1 Proof</li>
              <li>Versand nach Deutschland</li>
              <li>Freigegebene Version gespeichert für Nachbestellungen</li>
            </ul>
          </div>
          <div className="surface-card">
            <h3>Nicht enthalten</h3>
            <ul className="simple-list">
              <li>Weißunterdruck (bei transparentem Material – über Angebot)</li>
              <li>Laminierung, Lack, Metallic oder Folie</li>
              <li>Variable Daten (Lot-/SKT-Nummerierung)</li>
              <li>Kontur- und Sonderformen</li>
              <li>Weitere Designs oder mehrere SKUs in einem Auftrag</li>
              <li>Express-Produktion oder Express-Versand</li>
            </ul>
          </div>
        </div>
        {page.path === "/de/transparente-pp-etiketten" ? (
          <div className="surface-card">
            <h2>Wichtiger Hinweis zu transparentem Material</h2>
            <p>
              Weißunterdruck auf transparentem Material läuft als kostenpflichtiger Zusatz über das individuelle B2B-Angebot.
            </p>
          </div>
        ) : null}
      </Section>

      <Section
        eyebrow="Material & Einsatz"
        title="Materialwirkung und typische Einsätze"
        lead="Wofür sich dieses Material eignet."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      <ReorderWorkflowBlock
        title="Einmal freigeben. Später schneller nachbestellen."
        lead="Freigegebene Druckdaten, Material und Maß bleiben gespeichert – die Nachbestellung startet schneller."
      />

      {page.path === "/de/ratgeber/transparente-vs-opake-etiketten" ? (
        <Section
          eyebrow="Materialvergleich"
          title="Transparent und opak im direkten Bildvergleich"
          lead="Transparent und opak im direkten Vergleich."
        >
          <EditorialImage
            {...productImageAssets.compare}
            caption="Direkter Materialvergleich zwischen transparenter und opaker Umsetzung."
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      {page.path === "/de/pp-rollenetiketten" ? (
        <Section
          eyebrow="Materialansicht"
          title="Rollenqualität und Stanzung auf einen Blick"
          lead="Gestanzte PP-Etiketten auf Rolle."
        >
          <EditorialImage
            {...productImageAssets.roll}
            caption="Rollenansicht mit gestanzten PP-Etiketten für die Qualitäts- und Materialeinordnung."
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      {page.faqs?.length ? (
        <Section
          eyebrow="FAQ"
          title="Häufige Fragen zur Produktauswahl"
        >
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {shouldShowRegulatoryDisclaimer(page.path) ? (
        <LegalNoticeBox body={regulatoryDisclaimerBody} />
      ) : null}

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Weiterführend"
          title="Passende nächste Schritte"
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Preis berechnen oder Angebot anfordern"
        body="Wunschformat im Kalkulator sofort berechnen – oder B2B-Angebot für Sonderfälle anfordern."
        primaryLabel="Preis berechnen"
        primaryHref="/de/kalkulator"
        secondaryLabel="B2B-Angebot anfordern"
        secondaryHref="/de/angebot-anfordern"
      />
    </div>
  );
}

function IndustryPage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={renderLink(page.primaryCta, "cta-link")}
        secondaryCta={renderLink(page.secondaryCta, "secondary-link")}
        aside={<QuickAnswerCard page={page} />}
      />

      {getIndustryPageImage(page.path) ? (
        <Section
          eyebrow="Branchenüberblick"
          title="Verpackungen und Etiketten in dieser Branche"
        >
          <EditorialImage
            src={getIndustryPageImage(page.path)!.src}
            alt={getIndustryPageImage(page.path)!.alt}
            caption={getIndustryPageImage(page.path)!.caption}
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      <Section
        eyebrow="Empfohlene Materialien"
        title="Welches Material passt – und warum"
      >
        <ComparisonTable
          title="Material und Einsatz im Überblick"
          lead="Empfehlung, Einsatz und Wiederbestellung pro Variante."
          columns={["Variante", "Wofür sie passt", "Warum sie wiederholbar bleibt"]}
          rows={buildIndustryComparisonRows(page)}
        />
      </Section>

      <Section
        eyebrow="Einsatzfälle"
        title="Typische Anforderungen"
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      <ReorderWorkflowBlock
        title="Wiederbestellen, ohne jedes Mal neu zu erklären"
        lead="Material, Maß und freigegebene Druckdaten bleiben gespeichert."
      />

      {page.path === "/de/supplement-etiketten" ? <VariableDataBlock /> : null}

      {page.faqs?.length ? (
        <Section
          eyebrow="FAQ"
          title="Häufige Fragen aus der Branche"
        >
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {shouldShowRegulatoryDisclaimer(page.path) ? (
        <LegalNoticeBox body={regulatoryDisclaimerBody} />
      ) : null}

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Verknüpfte Themen"
          title="Passende Produkte und Ratgeber"
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Preis berechnen oder Angebot anfordern"
        body="Wunschformat im Kalkulator sofort berechnen – oder B2B-Angebot für Sonderfälle anfordern."
        primaryLabel="Preis berechnen"
        primaryHref="/de/kalkulator"
        secondaryLabel="B2B-Angebot anfordern"
        secondaryHref="/de/angebot-anfordern"
      />
    </div>
  );
}

function ServicePage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={renderLink(page.primaryCta, "cta-link")}
        secondaryCta={renderLink(page.secondaryCta, "secondary-link")}
        aside={<QuickAnswerCard page={page} />}
      />

      {page.path === "/de/musterbox" ? (
        <Section
          eyebrow="Musteransicht"
          title="Die Musterbox als sichtbarer Materialvergleich"
          lead="Die Bildfläche ergänzt die Erklärung der Musterbox, ohne den Hero in ein Fotolayout umzubauen."
        >
          <EditorialImage
            {...productImageAssets.sampleBox}
            caption="Die Musterbox unterstützt die Materialentscheidung vor einer größeren Freigabe."
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      {page.path === "/de/musterbox" ? (
        <Section
          eyebrow="Qualifizierung"
          title="Die Musterbox wird als kontrollierter B2B-Funnel erklärt"
          lead="Nicht als Give-away, sondern als Schritt vor einer belastbaren Materialentscheidung."
        >
          <div className="two-column">
            <SampleBoxCard
              title="Was die Musterbox leisten soll"
              body="Materialmuster helfen, Haptik, Sichtbarkeit und Druckwirkung besser zu verstehen, bevor größere Mengen freigegeben werden."
              href="/de/musterbox"
            />
            <FeatureGrid
              items={[
                {
                  title: "Materialvergleich",
                  body: "Opak, transparent und ergänzende Thermo-Beispiele können gegeneinander eingeordnet werden.",
                },
                {
                  title: "Für ernsthafte B2B-Fälle",
                  body: "Die Seite signalisiert klar, dass der nächste Schritt in Angebot oder Materialentscheidung führt.",
                },
                {
                  title: "Keine lose Gratis-Seite",
                  body: "Das Design bleibt ruhig und professionell statt verspielt oder giveaway-lastig.",
                },
              ]}
            />
          </div>
        </Section>
      ) : null}

      {page.path === "/de/musterbox" ? (
        <Section
          eyebrow="Anfrageformular"
          title="Musterbox nur für ernsthafte B2B-Anfragen"
          lead="Die Anfrage sammelt Materialinteresse, Mengenrahmen und Lieferkontext, damit die Musterbox nicht zur Streuaktion wird."
        >
          <div className="two-column">
            <SampleBoxRequestForm />
            <div className="surface-card">
              <h2>Warum diese Abfrage</h2>
              <div className="card-grid">
                <article className="feature-card">
                  <h3>Materialvergleich</h3>
                  <p>Opak, transparent und Thermo werden vor dem Versand gegen den Einsatzfall eingeordnet.</p>
                </article>
                <article className="feature-card">
                  <h3>Mengenfit</h3>
                  <p>Die Musterbox soll B2B-Bedarf vorbereiten, nicht lose Einmalanfragen bedienen.</p>
                </article>
                <article className="feature-card">
                  <h3>Nächster Schritt</h3>
                  <p>Die Anfrage führt in Qualifizierung, Angebot oder Materialklärung statt in einen Blindversand.</p>
                </article>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {page.path === "/de/nachbestellen" ? (
        <Section
          eyebrow="Ablauf"
          title="So läuft eine Nachbestellung"
          lead="Freigegebene Druckdaten, Format und Material sind bereits gespeichert. Der nächste Abruf dauert Sekunden."
        >
          <ProcessSteps
            steps={[
              {
                title: "Kundenkonto öffnen",
                body: "Im Kundenkonto sehen Sie alle bisherigen Bestellungen mit Spezifikation, Druckdaten und Status.",
              },
              {
                title: "Format und Material übernehmen",
                body: "Breite, Höhe, Material und Oberfläche werden aus der letzten freigegebenen Bestellung in den Kalkulator übertragen.",
              },
              {
                title: "Preis sofort berechnen",
                body: "Der Kalkulator berechnet den aktuellen Preis sofort – Menge anpassen, Preis prüfen, direkt weiter.",
              },
              {
                title: "Druckdaten wiederverwenden",
                body: "Freigegebene Druckdaten aus dem Kundenkonto können für die nächste Bestellung direkt verwendet werden.",
              },
            ]}
          />
        </Section>
      ) : null}

      {page.path === "/de/druckdaten" ? (
        <Section
          eyebrow="Datenprüfung"
          title="Technische Druckdatenprüfung und Qualitätskontrolle"
          lead="Vor der Produktion werden Druckdaten technisch geprüft und die Druckqualität kontrolliert — sichtbar statt nur als Aufzählung."
        >
          <div className="two-column">
            <EditorialImage
              {...productImageAssets.druckdatenCheck}
              caption="Druckdaten-Proof mit Beschnitt- und Passermarken unter der Lupe."
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <EditorialImage
              {...productImageAssets.qualityControl}
              caption="Sichtprüfung frisch gedruckter PP-Etiketten gegen das Licht."
              sizes="(max-width: 1024px) 100vw, 520px"
            />
          </div>
        </Section>
      ) : null}

      {page.path === "/de/druckdaten" ? (
        <Section
          eyebrow="Technische Übersicht"
          title="Formate, Checkliste und häufige Fehler klar statt als Textblock"
          lead="Die Druckdaten-Seite wird wie eine technische Betriebsseite aufgebaut, nicht wie eine lose FAQ."
        >
          <div className="two-column">
            <SpecTable
              title="Akzeptierte Formate"
              rows={[
                { label: "Bevorzugt", value: "PDF, AI, EPS" },
                { label: "Weitere Formate", value: "SVG, PNG, JPG, ZIP" },
                { label: "Prüffokus", value: "Größe, Beschnitt, Lesbarkeit, finale Version" },
              ]}
            />
            <FeatureGrid
              items={[
                {
                  title: "Datei-Checkliste",
                  body: "Stimmen Maß, Beschnitt, Schriften und letzte Version mit der geplanten Verpackung überein?",
                },
                {
                  title: "Proof-Prozess",
                  body: "Die Freigabe ist Teil der Produktionssicherheit und nicht nur ein formaler Zwischenschritt.",
                },
                {
                  title: "Typische Fehler",
                  body: "Fehlender Beschnitt, falsches Format oder unklare Datei-Version erzeugen unnötige Rückfragen.",
                },
              ]}
            />
          </div>
        </Section>
      ) : null}

      <Section
        eyebrow="Kerninhalte"
        title="Die wichtigsten Punkte dieser Seite"
        lead="Der Inhalt bleibt erhalten, wird aber in ruhigere, scanbare Karten übersetzt."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      {page.table ? (
        <ComparisonTable
          title={page.table.title}
          lead={page.table.lead}
          columns={page.table.columns}
          rows={page.table.rows}
        />
      ) : null}

      {page.faqs?.length ? (
        <Section eyebrow="FAQ" title="Häufige Fragen" lead="Die sichtbaren Antworten bleiben Teil der Seite und des SEO-Setups.">
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {page.relatedLinks?.length ? (
        <Section eyebrow="Weiterführend" title="Passende nächste Seiten" lead="Service-Seiten verlieren keine internen Links und keine kommerzielle Orientierung.">
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Wenn die Grundlage klar ist, sollte der nächste Schritt bewusst gewählt werden."
        body="Produkt, Musterbox oder Angebot bleiben sichtbar erreichbar, ohne neue Backend-Funktionen vorzutäuschen."
        primaryLabel={page.path === "/de/nachbestellen" ? "Etiketten nachbestellen" : "Angebot anfordern"}
        primaryHref={page.path === "/de/nachbestellen" ? "/de/angebot-anfordern" : "/de/angebot-anfordern"}
        secondaryLabel="Musterbox anfordern"
        secondaryHref="/de/musterbox"
      />
    </div>
  );
}

function GuidePage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={<Link href="/de/angebot-anfordern" className="cta-link">Angebot anfordern</Link>}
        secondaryCta={<Link href="/de/musterbox" className="secondary-link">Musterbox anfordern</Link>}
        aside={<QuickAnswerCard page={page} />}
      />

      {page.path === "/de/ratgeber/transparente-vs-opake-etiketten" ? (
        <Section
          eyebrow="Materialvergleich"
          title="Transparent und opak im direkten Bildvergleich"
          lead="Transparent und opak im direkten Vergleich."
        >
          <EditorialImage
            {...productImageAssets.compare}
            caption="Direkter Materialvergleich zwischen transparenter und opaker Umsetzung."
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      {page.howToSteps?.length ? (
        <Section
          eyebrow="Schrittfolge"
          title="Der Guide als echte Arbeitsoberfläche"
          lead="Diese Seite wird nicht als Textwand gezeigt, sondern als konkrete Hilfestruktur für den nächsten Arbeitsschritt."
        >
          <ProcessSteps
            steps={page.howToSteps.map((step, index) => ({
              title: `Schritt ${index + 1}`,
              body: step,
            }))}
          />
        </Section>
      ) : null}

      <Section
        eyebrow="Einordnung"
        title="Was der Ratgeber konkret erklärt"
        lead="Jeder Guide bleibt eigenständig und inhaltlich sichtbar, wird aber besser gegliedert und scanbar."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      {page.faqs?.length ? (
        <Section eyebrow="Kurzantworten" title="Häufige Rückfragen zum Thema" lead="Die Antworten bleiben sichtbar und unterstützen weiterhin FAQ-Schema und Suchintention.">
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Verknüpfung"
          title="Diese Guides führen zurück in kommerzielle Seiten"
          lead="Die internen Links bleiben erhalten und werden als echte B2B-Pfade visualisiert."
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Wenn der Guide die Entscheidung geklärt hat, sollte der nächste Schritt klar sein."
        body="Die Seite endet bewusst in Angebot, Musterbox oder produktnahen Einstiegen statt in einem toten Wissensende."
        primaryLabel="Angebot anfordern"
        primaryHref="/de/angebot-anfordern"
        secondaryLabel="Musterbox anfordern"
        secondaryHref="/de/musterbox"
      />
    </div>
  );
}

function GlossaryPage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={<Link href="/de/angebot-anfordern" className="cta-link">Angebot anfordern</Link>}
        secondaryCta={<Link href="/de/glossar" className="secondary-link">Glossar öffnen</Link>}
        aside={<QuickAnswerCard page={page} />}
      />

      {page.glossaryData ? (
        <Section
          eyebrow="Definition"
          title="Der Begriff in einer klaren, AI-lesbaren Struktur"
          lead="Glossar-Seiten bleiben knapp, aber wirken jetzt wie bewusst gestaltete Definitionsseiten statt wie Textfragmente."
        >
          <div className="card-grid">
            <article className="feature-card">
              <h3>Definition</h3>
              <p>{page.glossaryData.definition}</p>
            </article>
            <article className="feature-card">
              <h3>Wann es wichtig wird</h3>
              <p>{page.glossaryData.whenItMatters}</p>
            </article>
            <article className="feature-card">
              <h3>Beispiel und Bezug</h3>
              <p>{page.glossaryData.exampleUse}</p>
              <p>{page.glossaryData.relatedProduct}</p>
            </article>
          </div>
        </Section>
      ) : null}

      <Section
        eyebrow="Einordnung"
        title="Sichtbare Erklärung auf der Seite"
        lead="Die Definition bleibt auf der Seite sichtbar und stimmt mit der Structured-Data-Ebene überein."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Weiter zur passenden Produkt- oder Guide-Seite"
          title="Glossar endet nicht im Leerlauf"
          lead="Auch kurze Definitionsseiten führen in die relevanten kommerziellen und erklärenden Inhalte zurück."
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}
    </div>
  );
}

function HubPage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        primaryCta={renderLink(page.primaryCta, "cta-link")}
        secondaryCta={renderLink(page.secondaryCta, "secondary-link")}
        aside={<QuickAnswerCard page={page} />}
      />

      {page.hubLinks?.length ? (
        <Section
          eyebrow="Hub"
          title="Alle relevanten Unterseiten auf einen Blick"
          lead="Die Hub-Seiten werden als klare Wissensnavigation gestaltet und bleiben Teil von Nav, Sitemap und internem Linkgraph."
        >
          <RelatedLinks links={page.hubLinks} />
        </Section>
      ) : null}

      <Section
        eyebrow="Orientierung"
        title="Warum diese Hub-Seite existiert"
        lead="Ratgeber und Glossar werden nicht versteckt, sondern als bewusst gestaltete Einstiegspunkte gezeigt."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      {page.faqs?.length ? (
        <Section eyebrow="FAQ" title="Häufige Fragen zum Hub" lead="Die sichtbaren Kurzantworten bleiben erhalten.">
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {page.relatedLinks?.length ? (
        <Section eyebrow="Weiterführend" title="Verknüpfte kommerzielle Seiten" lead="Die Hubs bleiben mit Produkt- und Service-Seiten verbunden und verlieren keine SEO-Funktion.">
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}
    </div>
  );
}

function QuotePage({ page, canonicalPath }: DynamicPageProps) {
  return (
    <div className="container section-stack">
      <Breadcrumbs currentLabel={page.title} currentPath={canonicalPath} />
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.heroBullets}
        secondaryCta={<Link href="/de/musterbox" className="secondary-link">Musterbox anfordern</Link>}
        aside={
          <div className="surface-card">
            <h2>Was als Nächstes passiert</h2>
            <ul className="simple-list">
              <li>Anfrage wird strukturiert geprüft</li>
              <li>Material, Größe und Menge werden eingeordnet</li>
              <li>Rückfrage oder nächster Angebots-Schritt folgt</li>
            </ul>
            <p>
              Für Materialunsicherheit ist die Musterbox der bessere Zwischenschritt
              als ein vorschnelles Mengenbriefing.
            </p>
          </div>
        }
      />

      <Section
        eyebrow="Anfrageformular"
        title="Seriöse B2B-Anfrage statt loses Kontaktformular"
        lead="Die Formularoberfläche bleibt deutsch, zweispaltig und klar gegliedert in Unternehmen, Etikettenbedarf, Druckdaten und Nachricht."
      >
        <div className="two-column">
          <QuoteRequestForm />
          <div className="surface-card">
            <h2>Warum diese Struktur</h2>
            <div className="card-grid">
              <article className="feature-card">
                <h3>Unternehmen</h3>
                <p>Kontaktanfragen und Produktanfragen werden getrennt behandelt.</p>
              </article>
              <article className="feature-card">
                <h3>Etikettenbedarf</h3>
                <p>Material, Maß und Menge stehen im Zentrum, nicht eine generische Freitextbox.</p>
              </article>
              <article className="feature-card">
                <h3>Druckdaten und Nachricht</h3>
                <p>Dateistatus und Zusatzinfos bleiben sichtbar, ohne einen Backend-Upload vorzutäuschen.</p>
              </article>
            </div>
            <h3>Rechnungskauf auf Anfrage</h3>
            <p>
              Rechnungskauf ist für geprüfte Geschäftskunden auf Anfrage möglich.
              Die Freigabe erfolgt manuell im Angebotsprozess und nicht über den
              Standard-Checkout.
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Ablauf"
        title="Was nach dem Absenden zählt"
        lead="Die Seite endet nicht im Unklaren, sondern erklärt den nächsten Schritt als B2B-Prozess."
      >
        <ProcessSteps
          steps={[
            {
              title: "Anfrage prüfen",
              body: "Material, Verpackung und Mengenlogik werden anhand Ihrer Angaben eingeordnet.",
            },
            {
              title: "Rückfragen klären",
              body: "Wenn Maß, Material oder Druckdaten noch offen sind, folgt zuerst eine technische oder inhaltliche Präzisierung.",
            },
            {
              title: "Angebot vorbereiten",
              body: "Erst danach wird der nächste Angebots- oder Spezifikationsschritt vorbereitet.",
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="Alternative"
        title="Noch nicht bereit für eine volle Anfrage?"
        lead="Dann bleibt die Musterbox der kontrollierte B2B-Zwischenschritt."
      >
        <SampleBoxCard
          title="Musterbox statt vorschneller Materialentscheidung"
          body="Wenn opak, transparent oder Haptik noch unklar sind, spart ein früher Vergleich meist mehr Zeit als eine unscharfe Angebotsanfrage."
          href="/de/musterbox"
        />
      </Section>

      {page.faqs?.length ? (
        <Section eyebrow="FAQ" title="Häufige Fragen zum Angebotsprozess" lead="Die sichtbaren Antworten bleiben erhalten und deutsch.">
          <FaqAccordion faqs={page.faqs} />
        </Section>
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

function QuickAnswerCard({ page }: { page: PublicPageData }) {
  return (
    <div className="surface-card">
      <h2>Kurzantwort</h2>
      <p>{page.lead}</p>
      <ul className="simple-list">
        {page.sidebarBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

function EditorialImage({
  src,
  alt,
  sizes,
  caption,
}: {
  src: string;
  alt: string;
  sizes: string;
  caption?: string;
}) {
  return (
    <figure className="editorial-image-card">
      <div className="editorial-image-frame">
        <Image
          src={src}
          alt={alt}
          width={1672}
          height={941}
          sizes={sizes}
          className="editorial-image"
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
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

function buildFeatureItemsFromSections(page: PublicPageData) {
  return page.sections.map((section) => ({
    title: section.title,
    body: [section.body[0], section.bullets?.[0]].filter(Boolean).join(" "),
  }));
}

function buildSpecRows(page: PublicPageData) {
  const rows: Array<{ label: string; value: string }> = [];

  if (page.path === "/de/opake-pp-etiketten") {
    rows.push(
      { label: "Format", value: "Wunschformat – Breite bis 320 mm, Höhe frei wählbar, auf Rolle" },
      { label: "Material", value: "Opakes PP" },
      { label: "Klebstoff", value: "Permanent" },
      { label: "Finish", value: "Matt oder Glänzend – kein Preisaufschlag" },
      { label: "Anwendung", value: "Dosen, Beutel, Gläser und kontraststarke Produktverpackungen" },
      { label: "Temperaturbereich", value: "Für übliche Raum- und Lagerbedingungen; besondere Tiefkühl-, Nässe- oder Hitzeanforderungen bitte über Angebot prüfen" },
      { label: "Geeignet für", value: "Klare Pflichtangaben, dichte Farbflächen und robuste Regaloptik" },
      { label: "Hinweis", value: "Für Spender oder Maschine gilt standardmäßig 76-mm-Kern und Wickelrichtung Standard. Abweichungen laufen über Angebot." },
      { label: "Standardumfang", value: "1 Design, CMYK-Digitaldruck, Datenprüfung + 1 Proof, Versand nach Deutschland" },
      { label: "Angebotsfall", value: "ab 20.000 Stück oder bei Sonderumfang" },
    );
  } else if (page.path === "/de/transparente-pp-etiketten") {
    rows.push(
      { label: "Format", value: "Wunschformat – Breite bis 320 mm, Höhe frei wählbar, auf Rolle" },
      { label: "Material", value: "Transparentes PP" },
      { label: "Klebstoff", value: "Permanent" },
      { label: "Finish", value: "Matt oder Glänzend – kein Preisaufschlag" },
      { label: "Anwendung", value: "Flaschen, Gläser und Verpackungen mit sichtbarer Material- oder Fülloptik" },
      { label: "Temperaturbereich", value: "Für übliche Raum- und Lagerbedingungen; besondere Tiefkühl-, Nässe- oder Hitzeanforderungen bitte über Angebot prüfen" },
      { label: "Geeignet für", value: "Premium-Optik, reduzierte Gestaltung und klare Glas- oder Flaschenwirkung" },
      { label: "Hinweis", value: "Für Spender oder Maschine gilt standardmäßig 76-mm-Kern und Wickelrichtung Standard. Abweichungen laufen über Angebot." },
      { label: "Weißunterdruck", value: "Nicht enthalten, läuft über Angebot" },
      { label: "Angebotsfall", value: "ab 20.000 Stück oder bei Sonderumfang" },
    );
  } else {
    rows.push(
      { label: "Seitentyp", value: page.kind },
      { label: "Pfad", value: page.path },
    );
  }

  if (page.sidebarBullets[0]) {
    rows.push({ label: "Fokus", value: page.sidebarBullets[0] });
  }

  if (page.sidebarBullets[1]) {
    rows.push({ label: "Einsatz", value: page.sidebarBullets[1] });
  }

  return rows;
}


function shouldShowRegulatoryDisclaimer(path: string) {
  return [
    "/de/opake-pp-etiketten",
    "/de/transparente-pp-etiketten",
    "/de/lebensmittel-etiketten",
    "/de/getraenke-etiketten",
    "/de/supplement-etiketten",
  ].includes(path);
}

function buildIndustryComparisonRows(page: PublicPageData) {
  if (page.path === "/de/flaschenetiketten" || page.path === "/de/getraenke-etiketten") {
    return [
      ["Transparentes PP", "sichtbare Flaschen- oder Glasoptik", "starke Wiedererkennung bei stabiler Oberfläche"],
      ["Opakes PP", "klare Pflichtangaben und Kontrast", "kontrollierbare Lesbarkeit bei wiederkehrenden Chargen"],
      ["Musterbox", "wenn Materialwirkung noch unklar ist", "früher Vergleich spart spätere Korrekturen"],
    ];
  }

  if (page.path === "/de/supplement-etiketten") {
    return [
      ["Opakes PP", "Dosen, informationsreiche Layouts", "robuste Wiederholung vieler SKUs"],
      ["Transparentes PP", "Premium-Dosen oder Flaschen", "sichtbar anderes Regalbild ohne neue Produktlogik"],
      ["Variable Daten später", "Lotnummer, SKT, Chargenlogik", "UI signalisiert den späteren strukturierten Workflow"],
    ];
  }

  return [
    ["Opakes PP", "klare Lesbarkeit und dichte Informationen", "stabile Basis für spätere Nachbestellung"],
    ["Transparentes PP", "sichtbare Verpackung oder Glaswirkung", "passend, wenn Materialoptik Teil des Designs ist"],
    ["Musterbox", "wenn die Materialfrage noch offen ist", "hilft vor der ersten größeren Menge"],
  ];
}


function getProductPageImage(path: string) {
  switch (path) {
    case "/de/pp-rollenetiketten":
      return {
        ...productImageAssets.productLine,
        title: "PP-Rollenetiketten im Einsatz",
        lead: "Die Bildfläche ergänzt den Produkteinstieg und zeigt die Materialfamilie über mehrere Verpackungstypen hinweg.",
        caption: "Produktlinie mit PP-Rollenetiketten auf Flasche, Beutel, Supplement-Flasche und Tiegel.",
      };
    case "/de/transparente-pp-etiketten":
      return {
        src: "/images/editorial/home-transparent-pp-bottle.webp",
        alt: "Klare Glasflasche mit transparentem PP-Etikett, Glas und Inhalt durch das Etikett sichtbar",
        title: "Transparentes PP im realen Einsatz",
        lead: "Das transparente Etikett bleibt klar lesbar und lässt Glas und Inhalt sichtbar – die typische Premium-Optik für Flaschen und Gläser.",
        caption: "Transparentes PP-Etikett auf einer Glasflasche – sichtbares Glas, präzise Kanten.",
      };
    case "/de/opake-pp-etiketten":
      return {
        ...productImageAssets.compare,
        title: "Materialvergleich im direkten Blick",
        lead: "Die Seite zeigt transparentes und opakes PP nicht nur textlich, sondern auch in einer ruhigen Vergleichsansicht.",
        caption: "Direkter Vergleich zwischen transparenter und opaker PP-Umsetzung.",
      };
    case "/de/etiketten-100x200":
      return {
        ...productImageAssets.roll,
        title: "Format und Rollenlogik sichtbar gemacht",
        lead: "Das 100x200-Format wird in einer realen Rollenansicht verankert, ohne die Seite mit technischen Renderings zu überladen.",
        caption: "Rollenetikettenansicht für formatnahe Produkt- und Maßkommunikation.",
      };
    default:
      return null;
  }
}

function getIndustryPageImage(path: string) {
  switch (path) {
    case "/de/lebensmittel-etiketten":
    case "/de/honig-marmelade-etiketten":
    case "/de/gewuerz-etiketten":
      return {
        ...productImageAssets.foodGlass,
        caption: "Lebensmittelgläser mit Etiketten für Honig, Marmelade und Gewürze.",
      };
    case "/de/getraenke-etiketten":
    case "/de/flaschenetiketten":
      return {
        ...productImageAssets.beverages,
        caption: "Glasflaschen für Getränke mit umlaufenden PP-Etiketten.",
      };
    case "/de/supplement-etiketten":
      return {
        ...productImageAssets.supplementData,
        caption: "Supplement-Flaschen mit markierter Datenzone für spätere Lot-/SKT-Logik.",
      };
    default:
      return {
        ...productImageAssets.industries,
        caption: "Verschiedene Verpackungsformen mit passenden PP-Etiketten.",
      };
  }
}

function renderLink(link: PublicPageData["primaryCta"], className: string) {
  if (!link) {
    return null;
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
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




