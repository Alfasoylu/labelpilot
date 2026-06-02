import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/cards/ProductCard";
import { PricingCard } from "@/components/cards/PricingCard";
import { SampleBoxCard } from "@/components/cards/SampleBoxCard";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { Section } from "@/components/layout/Section";
import { LegalNoticeBox } from "@/components/legal/LegalNoticeBox";
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
import type {
  HomePageData,
  PublicPageData,
  RelatedLink,
  SiteNavigationItem,
} from "@/lib/site-content";
import {
  fixedPriceExcludedRows,
  fixedPriceIncludedRows,
  pricingValueBundleLine,
} from "@/lib/site-content";

type HomePageProps = {
  page: HomePageData;
  navigation: SiteNavigationItem[];
};

type DynamicPageProps = {
  page: PublicPageData;
  canonicalPath: string;
};

const trustItems = [
  {
    title: "Freigegebene Versionen",
    body: "Nicht nur ein Druckauftrag, sondern eine saubere Version, die später wieder nutzbar bleibt.",
  },
  {
    title: "Klare Materiallogik",
    body: "Opak, transparent oder Thermo werden als echte Entscheidungsdimensionen kommuniziert.",
  },
  {
    title: "Deutsche B2B-Führung",
    body: "Produkt, Ratgeber und Glossar sprechen dieselbe Sprache wie ein deutscher Einkäufer.",
  },
  {
    title: "Angebot statt Ratespiel",
    body: "Sonderfälle und große Mengen laufen kontrolliert über das Angebotsmodell.",
  },
];

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
} as const;

export function HomePage({ page, navigation }: HomePageProps) {
  return (
    <div className="container section-stack">
      <HeroSection
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        bullets={page.highlights}
        primaryCta={
          <Link href="/de/angebot-anfordern" className="cta-link">
            Angebot anfordern
          </Link>
        }
        secondaryCta={
          <Link href="/de/musterbox" className="secondary-link">
            Musterbox anfordern
          </Link>
        }
        visual={<StoredDesignVisualCard />}
      />

      <TrustBar items={trustItems} />

      <Section
        eyebrow="Warum Labelpilot.de"
        title="Nicht nur Etiketten einkaufen, sondern Wiederholung systematisch vorbereiten"
        lead="Die Oberfläche erklärt den Unterschied zwischen einem günstigen Druckshop und einer strukturierten Label-Infrastruktur."
      >
        <FeatureGrid
          items={[
            {
              title: "Druckdaten bleiben als Version nutzbar",
              body: "Freigegebene Motive, Material und Maß werden nicht in einzelnen E-Mails verloren, sondern als wiederholbare Grundlage verstanden.",
            },
            {
              title: "Branchenlogik statt generischer Produktwand",
              body: "Lebensmittel, Getränke und Supplemente werden als unterschiedliche Einsatzfälle erklärt, nicht als austauschbare SEO-Slots.",
            },
            {
              title: "Wissen direkt am kaufrelevanten Punkt",
              body: "Ratgeber und Glossar führen in Material, Druckdaten und Nachbestellung ein, ohne die Conversion-Route zu verlieren.",
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="Kernprodukte"
        title="Die wichtigsten öffentlichen Einstiegspunkte"
        lead="Phase 2 hat die Produkt- und Wissensstruktur erweitert. Die UI bündelt diese jetzt als klare Kauf- und Informationswege."
      >
        <div className="two-column image-supported-grid">
          <div className="card-grid">
            {page.topicCards.map((card, index) => (
              <ProductCard
                key={card.href}
                title={card.title}
                body={card.body}
                href={card.href}
                badge={index === 0 ? "Hauptprodukt" : index === 1 ? "Premium-Material" : "Wissenshub"}
                featured={index === 0}
              />
            ))}
          </div>
          <EditorialImage
            {...productImageAssets.productLine}
            caption="PP-Rollenetiketten auf mehreren Verpackungstypen als visuelle Produktlinie."
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      </Section>

      <ReorderWorkflowBlock />

      <Section
        eyebrow="Musterbox"
        title="Material zuerst verstehen, dann Menge festlegen"
        lead="Die Musterbox wird als kontrollierter B2B-Filter gezeigt, nicht als kostenlose Goodie-Seite."
        tone="soft"
      >
        <div className="two-column">
          <SampleBoxCard
            title="Labelpilot Musterbox"
            body="Vergleichen Sie opake und transparente PP-Materialien sowie ergänzende Thermo-Beispiele, bevor Sie größere Mengen freigeben."
            href="/de/musterbox"
          />
          <div className="surface-card">
            <h2>Besonders sinnvoll bei</h2>
            <ul className="simple-list">
              <li>erster Materialentscheidung für Glas, Beutel oder Dose</li>
              <li>unklarer Wirkung zwischen opak und transparent</li>
              <li>wiederkehrenden Produktlinien mit späterer Nachbestellung</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Branchen"
        title="Öffentliche Seiten mit unterschiedlicher Kauflogik"
        lead="Die Branchen-Seiten bleiben im Nav und zeigen unterschiedliche Use Cases statt derselben Textschablone."
      >
        <div className="two-column image-supported-grid">
          <div className="card-grid">
            {navigation
              .filter((item) =>
                ["/de/lebensmittel-etiketten", "/de/supplement-etiketten", "/de/getraenke-etiketten"].includes(item.href),
              )
              .map((item) => (
                <ProductCard
                  key={item.href}
                  title={item.label}
                  body={getIndustryTeaser(item.href)}
                  href={item.href}
                />
              ))}
          </div>
          <EditorialImage
            {...productImageAssets.industries}
            caption="Übersicht typischer Einsatzfelder von PP-Etiketten im B2B-Kontext."
            sizes="(max-width: 1024px) 100vw, 520px"
          />
        </div>
      </Section>

      <Section
        eyebrow="Prozess"
        title="Vom ersten Bedarf bis zur belastbaren Spezifikation"
        lead="Die Homepage endet nicht bei Features, sondern zeigt den Weg in die tatsächliche B2B-Abwicklung."
      >
        <ProcessSteps steps={page.steps} />
      </Section>

      <ContentCta
        title="Wenn Material, Verpackung oder Menge feststehen, ist der nächste Schritt das Angebot."
        body="So bleibt die Seite ruhig, präzise und conversion-orientiert: Wissen zuerst, dann eine strukturierte Anfrage."
        primaryLabel="Angebot anfordern"
        primaryHref="/de/angebot-anfordern"
        secondaryLabel="Ratgeber öffnen"
        secondaryHref="/de/ratgeber"
      />
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
    return <ProductLikePage page={page} canonicalPath={canonicalPath} />;
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
        eyebrow="Kurzantwort"
        title="Was diese Seite in der ersten Minute klären soll"
        lead="Produktseiten führen nicht als Textwand, sondern als strukturierte Kauf- und Vergleichsoberfläche."
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
              <h2>Wofür die Seite gedacht ist</h2>
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
          title={getProductPageImage(page.path)?.title ?? "Passende Produktansicht"}
          lead={getProductPageImage(page.path)?.lead ?? "Visuelle Einordnung des Materials ohne die Hero-Logik zu ersetzen."}
        >
          <EditorialImage
            src={getProductPageImage(page.path)!.src}
            alt={getProductPageImage(page.path)!.alt}
            caption={getProductPageImage(page.path)!.caption}
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      {page.packageTable?.length ? (
        <Section
          eyebrow="Pakete"
          title={page.packageHeading ?? "Paket- und Mengenstruktur"}
          lead={page.packageLead ?? "Klarer Paketaufbau statt unruhiger Preislisten."}
        >
          <div className="pricing-grid">
            {page.packageTable.map((tier) => (
              <PricingCard key={`${page.slug}-${tier.quantity}`} tier={tier} />
            ))}
          </div>
          <p className="price-note">{pricingValueBundleLine}</p>
        </Section>
      ) : null}

      {hasFixedPriceScope(page.path) ? (
        <Section
          eyebrow="Leistungsumfang"
          title="Im Preis enthalten und nicht enthalten"
          lead="Die festen Pakete zeigen bewusst offen, was im Standardpreis enthalten ist und wann der Weg in ein individuelles B2B-Angebot führt."
        >
          <div className="two-column">
            <SpecTable title="Im Preis enthalten" rows={fixedPriceIncludedRows} />
            <SpecTable title="Nicht enthalten" rows={fixedPriceExcludedRows} />
          </div>
          {page.path === "/de/transparente-pp-etiketten" ? (
            <div className="surface-card">
              <h2>Wichtiger Hinweis zu transparentem Material</h2>
              <p>
                Weißunterdruck auf transparentem Material ist nicht im Fixpreis enthalten
                und läuft als kostenpflichtiger Zusatz über das individuelle B2B-Angebot.
              </p>
            </div>
          ) : null}
        </Section>
      ) : null}

      <Section
        eyebrow="Material und Nutzen"
        title="Warum diese Produktseite mehr als eine Preiswand ist"
        lead="Spezifikation, Materialwirkung und Reorder-Nutzen werden getrennt sichtbar, damit die Seite wie eine seriöse B2B-Produktoberfläche wirkt."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      <ReorderWorkflowBlock
        title="Warum gespeicherte Spezifikationen für Produktseiten der eigentliche Moat sind"
        lead="Die Oberfläche zeigt, dass nach der ersten Freigabe nicht alles neu erklärt werden muss."
      />

      {page.path === "/de/ratgeber/transparente-vs-opake-etiketten" ? (
        <Section
          eyebrow="Materialvergleich"
          title="Transparent und opak im direkten Bildvergleich"
          lead="Die Vergleichsseite erhält eine ruhige Bildfläche, die die sichtbaren Unterschiede unterstützt statt sie zu ersetzen."
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
          lead="Die Rollenansicht unterstützt die Material- und Qualitätsbeschreibung der Seite, ohne die Textstruktur zu verdrängen."
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
          lead="Die sichtbaren Antworten bleiben erhalten und werden jetzt in einer ruhigeren, besser scanbaren Form dargestellt."
        >
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Weiterführend"
          title="Relevante nächste Seiten"
          lead="Produktseiten verweisen weiterhin auf Branchen-, Ratgeber- und Service-Seiten und verlieren keine SEO-Inhalte."
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Wenn die Standardspezifikation nicht reicht, sollte die Anfrage strukturiert laufen."
        body="Für Sondergrößen, mehrere Varianten oder größere Abrufe bleibt das Angebotsformular der richtige Abschluss dieser Seite."
        primaryLabel="Angebot anfordern"
        primaryHref="/de/angebot-anfordern"
        secondaryLabel="Musterbox anfordern"
        secondaryHref="/de/musterbox"
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

      {page.path === "/de/lebensmittel-etiketten" ? (
        <Section
          eyebrow="Branchenübersicht"
          title="Lebensmittel-Etiketten zwischen Lesbarkeit, Oberfläche und Wiederholung"
          lead="Die Bildfläche ergänzt die Branchenlogik und zeigt die Breite typischer Verpackungsformen ohne neue Produktversprechen."
        >
          <EditorialImage
            {...productImageAssets.industries}
            caption="Lebensmittelnahe Verpackungsformen mit unterschiedlichen Etikettenanforderungen."
            sizes="(max-width: 1024px) 100vw, 760px"
          />
        </Section>
      ) : null}

      <Section
        eyebrow="Empfohlene Materialien"
        title="Welche Materiallogik in dieser Branche typischerweise sinnvoll ist"
        lead="Industrieseiten werden jetzt als Beratungseinstieg inszeniert, nicht als bloße SEO-Umschreibung."
      >
        <ComparisonTable
          title="Orientierung für diese Verpackungswelt"
          lead="Die Tabelle ist absichtlich einfach: sie zeigt Materialempfehlung, Nutzen und späteren Reorder-Bezug."
          columns={["Variante", "Wofür sie passt", "Warum sie wiederholbar bleibt"]}
          rows={buildIndustryComparisonRows(page)}
        />
      </Section>

      <Section
        eyebrow="Einsatzfälle"
        title="Typische Anforderungen und Use Cases"
        lead="Die Seitenstruktur macht sichtbar, dass Branchen unterschiedlich ticken und nicht nur den Produktnamen austauschen."
      >
        <FeatureGrid items={buildFeatureItemsFromSections(page)} />
      </Section>

      <ReorderWorkflowBlock
        title="So übersetzt sich die Branchenlogik in spätere Nachbestellung"
        lead="Material, Maß und freigegebene Daten bleiben in dieser Darstellung nicht abstrakt, sondern werden als wiederholbarer Workflow erklärt."
      />

      {page.path === "/de/supplement-etiketten" ? <VariableDataBlock /> : null}

      <LegalNoticeBox
        title="Hinweis zur öffentlichen Phase"
        body="Diese Seite erklärt Branchenlogik, Materialempfehlung und spätere Prozessfähigkeit. Variable Daten, Upload-Workflows und Kontofunktionen werden bewusst noch nicht umgesetzt."
      />

      {page.faqs?.length ? (
        <Section
          eyebrow="FAQ"
          title="Häufige Fragen aus der Branche"
          lead="Die Antworten bleiben sichtbar und deutsch, werden aber nicht mehr als lose Absatzsammlung gezeigt."
        >
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      {page.relatedLinks?.length ? (
        <Section
          eyebrow="Verknüpfte Themen"
          title="Produkte, Ratgeber und Service-Seiten"
          lead="Diese Links bleiben Teil des SEO-Graphen und werden jetzt als klare B2B-Wege dargestellt."
        >
          <RelatedLinks links={page.relatedLinks} />
        </Section>
      ) : null}

      <ContentCta
        title="Wenn Verpackung und Menge schon klarer sind, sollte die Branche in eine konkrete Anfrage übergehen."
        body="So endet die Seite mit einer B2B-Aktion statt mit einer dekorativen Schlussfloskel."
        primaryLabel="Angebot anfordern"
        primaryHref="/de/angebot-anfordern"
        secondaryLabel="Musterbox anfordern"
        secondaryHref="/de/musterbox"
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

      {page.path === "/de/nachbestellen" ? (
        <Section
          eyebrow="Ablauf"
          title="Gespeicherte Designs, Versionen und Erinnerungen visuell erklären"
          lead="Die Seite kommuniziert den späteren Software-Nutzen, ohne einen noch nicht gebauten Login vorzutäuschen."
        >
          <ProcessSteps
            steps={[
              {
                title: "Freigegebene Version erhalten",
                body: "Die zuletzt freigegebene Gestaltung bleibt als klare Basis für die nächste Menge bestehen.",
              },
              {
                title: "Material und Maß wiederverwenden",
                body: "Opakes oder transparentes PP sowie die Größe müssen nicht bei jeder Wiederholung neu erklärt werden.",
              },
              {
                title: "30-Tage-Erinnerung nutzen",
                body: "Ein späterer Reminder-Mechanismus unterstützt wiederkehrende Abrufe und verhindert hektische Nachbestellungen.",
              },
              {
                title: "Anfrage schneller starten",
                body: "Solange das Konto noch nicht live ist, führt die Seite in Kontakt oder Angebot statt zu einem Fake-Button.",
              },
            ]}
          />
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
          lead="Die Vergleichsseite erhält eine ruhige Bildfläche, die die sichtbaren Unterschiede unterstützt statt sie zu ersetzen."
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
                <p>Kontakt und Branche werden sauber von der Produktanfrage getrennt.</p>
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
        <LegalNoticeBox
          title="⚠️ Rechtlich zu prüfen - Platzhalter"
          body="Diese Seite enthält bewusst nur die Grundstruktur. Vor dem produktiven Einsatz müssen Inhalte rechtlich geprüft und final freigegeben werden."
        />
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
      { label: "Format", value: "100×200 mm (10×20 cm), rechteckig, auf Rolle" },
      { label: "Material", value: "Opakes PP mit permanentem Klebstoff" },
      { label: "Preisbild", value: "netto + brutto sichtbar, inkl. Versand nach Deutschland" },
      { label: "Standardumfang", value: "1 Design, CMYK-Digitaldruck, 1 Finish, Datenprüfung + 1 Proof" },
    );
  } else if (page.path === "/de/transparente-pp-etiketten") {
    rows.push(
      { label: "Format", value: "100×200 mm (10×20 cm), rechteckig, auf Rolle" },
      { label: "Material", value: "Transparentes PP mit permanentem Klebstoff" },
      { label: "Preisbild", value: "netto + brutto sichtbar, inkl. Versand nach Deutschland" },
      { label: "Wichtiger Zusatz", value: "Weißunterdruck ist nicht im Fixpreis enthalten" },
    );
  } else {
    rows.push(
      { label: "Seitentyp", value: page.kind },
      { label: "Pfad", value: page.path },
    );
  }

  if (page.packageTable?.length) {
    rows.push({
      label: "Paketlogik",
      value: page.packageTable.map((tier) => tier.quantity).join(" / "),
    });
  }

  if (page.sidebarBullets[0]) {
    rows.push({ label: "Fokus", value: page.sidebarBullets[0] });
  }

  if (page.sidebarBullets[1]) {
    rows.push({ label: "Einsatz", value: page.sidebarBullets[1] });
  }

  if (hasFixedPriceScope(page.path)) {
    rows.push({ label: "Angebotsfall", value: "ab 20.000 Stück oder bei Sonderumfang" });
  }

  return rows;
}

function hasFixedPriceScope(path: string) {
  return path === "/de/opake-pp-etiketten" || path === "/de/transparente-pp-etiketten";
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

function getIndustryTeaser(href: string) {
  switch (href) {
    case "/de/lebensmittel-etiketten":
      return "Für Gläser, Beutel und wiederkehrende Chargen mit Fokus auf Lesbarkeit und saubere Wiederholung.";
    case "/de/supplement-etiketten":
      return "Für Dosen, Beutel und variable Produktlinien mit späterer Chargen- und Dateilogik.";
    case "/de/getraenke-etiketten":
      return "Für Flaschen, Glas und Verpackungen, bei denen Materialoptik sichtbar in die Kaufentscheidung eingreift.";
    default:
      return "Branchenseite mit klarer Material- und Reorder-Logik.";
  }
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
