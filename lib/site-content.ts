export type PackageTier = {
  label: string;
  quantity: string;
  priceLabel: string;
  grossLabel?: string;
  perPieceLabel?: string;
  shippingLabel?: string;
  format?: string;
  material?: string;
  inclusions?: string[];
  note: string;
  description: string;
  badge?: string;
  popular?: boolean;
};

export type ContentSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type FAQ = {
  question: string;
  answer: string;
};

export type CtaLink = {
  label: string;
  href: string;
};

export type RelatedLink = CtaLink & {
  description: string;
};

export type TableData = {
  title: string;
  lead: string;
  columns: string[];
  rows: string[][];
};

export type PublicPageData = {
  path: string;
  slug: string;
  kind:
    | "industry"
    | "product"
    | "collection"
    | "service"
    | "quote"
    | "legal"
    | "guide"
    | "glossary"
    | "hub";
  title: string;
  eyebrow: string;
  lead: string;
  heroBullets?: string[];
  sidebarTitle: string;
  sidebarBullets: string[];
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  packageHeading?: string;
  packageLead?: string;
  packageTable?: PackageTier[];
  sections: ContentSection[];
  table?: TableData;
  faqs?: FAQ[];
  relatedLinks?: RelatedLink[];
  hubLinks?: RelatedLink[];
  glossaryData?: {
    term: string;
    definition: string;
    whenItMatters: string;
    exampleUse: string;
    relatedProduct: string;
  };
  howToSteps?: string[];
};

export type HomePageData = {
  eyebrow: string;
  title: string;
  lead: string;
  highlights: string[];
  corePackages: PackageTier[];
  topicCards: Array<{
    title: string;
    body: string;
    href: string;
  }>;
  steps: Array<{
    title: string;
    body: string;
  }>;
};

export type SiteNavigationItem = {
  label: string;
  href: string;
};

type FooterGroup = {
  title: string;
  links: SiteNavigationItem[];
};

export type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function buildFixedTier(input: {
  label: string;
  quantity: number;
  net: number;
  note: string;
  description: string;
  badge?: string;
  popular?: boolean;
}) {
  const perPiece = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(input.net / input.quantity);

  return {
    label: input.label,
    quantity: `${input.quantity.toLocaleString("de-DE")} Stück`,
    priceLabel: `${formatEuro(input.net)} netto`,
    grossLabel: formatEuro(input.net * 1.19),
    perPieceLabel: `${perPiece} €/Stück netto`,
    shippingLabel: "inkl. Versand nach Deutschland",
    format: "100 × 200 mm",
    material: "PP opak oder transparent",
    inclusions: ["Proof inklusive"],
    note: input.note,
    description: input.description,
    badge: input.badge,
    popular: input.popular,
  } satisfies PackageTier;
}

export const pricingValueBundleLine =
  "Alle Pakete enthalten technische Druckdatenprüfung, Versand nach Deutschland und die Speicherung freigegebener Druckdaten für die 30-Sekunden-Nachbestellung.";

export const fixedPriceIncludedRows = [
  { label: "Format", value: "100×200 mm (10×20 cm), rechteckig, auf Rolle" },
  { label: "Design", value: "1 Design / 1 Artwork pro Auftrag" },
  { label: "Material", value: "Genanntes PP-Material (opak oder transparent)" },
  { label: "Klebstoff", value: "Permanent; ablösbare oder anwendungsspezifische Klebstoffe auf Anfrage (Angebot)" },
  { label: "Druck", value: "4/0-farbiger CMYK-Digitaldruck ohne Einrichtungs- oder Klischeekosten" },
  { label: "Finish", value: "Glanz (Standard); matt auf Anfrage" },
  { label: "Prüfung", value: "Kostenlose Standard-Datenprüfung plus 1 Proof-Runde" },
  { label: "Versand", value: "Versand nach Deutschland" },
  { label: "Nachbestellung", value: "Gleiche gespeicherte Spezifikation zum gleichen Paketpreis" },
];

export const fixedPriceExcludedRows = [
  { label: "Weißunterdruck", value: "Bei transparentem Material kostenpflichtiger Zusatz / Angebot" },
  { label: "Veredelung", value: "Laminierung, Lack, Metallic oder Folie nicht enthalten" },
  { label: "Variable Daten", value: "Lot- / SKT-Nummerierung und andere variable Daten nicht enthalten" },
  { label: "Form / Schnitt", value: "Kontur- und Sonderformen laufen über Angebot" },
  { label: "Weitere SKUs", value: "Zusätzliche Designs oder mehrere SKUs nicht im Fixpreis" },
  { label: "Express", value: "Express-Produktion oder Express-Versand nur per Angebot" },
];

const quoteLink: CtaLink = {
  label: "Angebot anfordern",
  href: "/de/angebot-anfordern",
};

const sampleLink: CtaLink = {
  label: "Musterbox ansehen",
  href: "/de/musterbox",
};

const fileLink: CtaLink = {
  label: "Druckdaten prüfen",
  href: "/de/druckdaten",
};

export const opaquePackages: PackageTier[] = [
  buildFixedTier({
    label: "Pilotauflage",
    quantity: 1000,
    net: 179,
    note: "Ersttest",
    description: "Großes 100×200-mm-Format als bezahlter Ersttest mit klarer Spezifikation.",
  }),
  buildFixedTier({
    label: "Folgeauflage",
    quantity: 2000,
    net: 279,
    note: "Nachbestellfreundlich",
    description: "Sinnvoll für kleinere Wiederholungen derselben gespeicherten Produktlinie.",
    badge: "Beliebt für Wiederholungen",
  }),
  buildFixedTier({
    label: "Standard",
    quantity: 5000,
    net: 479,
    note: "Wiederbestellung",
    description:
      "Der Kernpreis für wiederkehrende B2B-Bestellungen im großen 100×200-mm-Format.",
    badge: "Empfohlenes B2B-Paket",
    popular: true,
  }),
  buildFixedTier({
    label: "Serie",
    quantity: 10000,
    net: 799,
    note: "Serienproduktion",
    description:
      "Für Marken, die dieselbe freigegebene Spezifikation in höheren Mengen wiederholen.",
  }),
  {
    label: "B2B Abruf",
    quantity: "20.000+ Stück",
    priceLabel: "Angebot",
    shippingLabel: "Individuelles B2B-Angebot anfordern",
    format: "100 × 200 mm",
    material: "PP opak oder transparent",
    note: "Großmenge",
    description: "Für Sondergrößen, große Abrufe, mehrere SKUs oder Spezialanforderungen.",
  },
];

export const transparentPackages: PackageTier[] = [
  buildFixedTier({
    label: "Pilotauflage",
    quantity: 1000,
    net: 199,
    note: "Premium-Einstieg",
    description: "Für erste Tests mit transparenter Optik im großen 100×200-mm-Format.",
  }),
  buildFixedTier({
    label: "Folgeauflage",
    quantity: 2000,
    net: 309,
    note: "Premium-Nachbestellung",
    description:
      "Für kleinere Wiederholungen mit transparenter Produktoptik und gespeicherter Spezifikation.",
    badge: "Für Nachbestellungen",
  }),
  buildFixedTier({
    label: "Standard",
    quantity: 5000,
    net: 519,
    note: "Wiederbestellung",
    description:
      "Die bevorzugte Menge für transparente Premium-Verpackungen mit sichtbarer Materialwirkung.",
    badge: "Empfohlenes B2B-Paket",
    popular: true,
  }),
  buildFixedTier({
    label: "Serie",
    quantity: 10000,
    net: 849,
    note: "Serienproduktion",
    description: "Für höhere Auflagen mit stabiler Flaschen-, Glas- oder Dosenoptik.",
  }),
  {
    label: "B2B Abruf",
    quantity: "20.000+ Stück",
    priceLabel: "Angebot",
    shippingLabel: "Individuelles B2B-Angebot anfordern",
    format: "100 × 200 mm",
    material: "PP opak oder transparent",
    note: "Großmenge",
    description:
      "Für größere Abrufe, Weißunterdruck, Spezialveredelung oder komplexere transparente Jobs.",
  },
];

export const thermalPackageNotes: PackageTier[] = [
  {
    label: "Zusatzprodukt",
    quantity: "ab 1.000 Stück",
    priceLabel: "Angebot",
    note: "Anwendungsabhängig",
    description:
      "Thermo-Versandetiketten sind ein ergänzendes B2B-Produkt zum Sortiment.",
    badge: "Nicht das Hauptprodukt",
  },
];

export const homePageData: HomePageData = {
  eyebrow: "",
  title: "PP-Rollenetiketten für Produktmarken, die regelmäßig nachbestellen.",
  lead:
    "PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Druckdaten werden geprüft, freigegeben und gespeichert – damit Nachbestellungen ohne neue Abstimmung in 30 Sekunden möglich sind.",
  highlights: [
    "Opak oder transparent – je nach Verpackung und Markenauftritt.",
    "Für Lebensmittel, Getränke, Supplemente und Handelsmarken.",
    "Angebot für Standards und Sonderfälle.",
  ],
  corePackages: opaquePackages,
  topicCards: [
    {
      title: "Opake PP-Etiketten",
      body: "Die klare Standardlösung für wiederkehrende Produktlinien.",
      href: "/de/opake-pp-etiketten",
    },
    {
      title: "Transparente PP-Etiketten",
      body: "Für sichtbare Verpackungsoptik auf Glas, Flasche und Dose.",
      href: "/de/transparente-pp-etiketten",
    },
    {
      title: "Etiketten-Ratgeber / Materialberatung",
      body: "Materialfragen, Druckdaten und Unterschiede kurz erklärt.",
      href: "/de/ratgeber",
    },
  ],
  steps: [
    {
      title: "Material wählen",
      body: "Material und Format vorab festlegen.",
    },
    {
      title: "Druck freigeben",
      body: "Freigegebene Daten bleiben als Version nutzbar.",
    },
    {
      title: "Nachbestellen",
      body: "Wiederkehrende Bestellungen starten schneller.",
    },
  ],
};

export const siteNavigation: SiteNavigationItem[] = [
  { label: "Rollenetiketten", href: "/de/pp-rollenetiketten" },
  { label: "Lebensmittel-Etiketten", href: "/de/lebensmittel-etiketten" },
  { label: "Kalkulator", href: "/de/kalkulator" },
  { label: "Musterbox", href: "/de/musterbox" },
  { label: "Druckdaten", href: "/de/druckdaten" },
  { label: "Angebot", href: "/de/angebot-anfordern" },
];

export const footerLinks: FooterGroup[] = [
  {
    title: "Produkte",
    links: [
      { label: "PP-Rollenetiketten", href: "/de/pp-rollenetiketten" },
      { label: "Opake PP-Etiketten", href: "/de/opake-pp-etiketten" },
      { label: "Transparente PP-Etiketten", href: "/de/transparente-pp-etiketten" },
      { label: "Thermo-Versandetiketten", href: "/de/thermo-versandetiketten" },
    ],
  },
  {
    title: "Branchen",
    links: [
      { label: "Lebensmittel-Etiketten", href: "/de/lebensmittel-etiketten" },
      { label: "Getränke-Etiketten", href: "/de/getraenke-etiketten" },
      { label: "Supplement-Etiketten", href: "/de/supplement-etiketten" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Musterbox", href: "/de/musterbox" },
      { label: "Nachbestellen", href: "/de/nachbestellen" },
      { label: "Druckdaten", href: "/de/druckdaten" },
      { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    ],
  },
  {
    title: "Wissen",
    links: [
      { label: "Kalkulator", href: "/de/kalkulator" },
      { label: "Ratgeber", href: "/de/ratgeber" },
      { label: "Glossar", href: "/de/glossar" },
      { label: "Über uns", href: "/de/unternehmen" },
      { label: "Kundenkonto", href: "/konto" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { label: "Impressum", href: "/de/impressum" },
      { label: "Datenschutz", href: "/de/datenschutz" },
      { label: "AGB", href: "/de/agb" },
      { label: "Widerruf", href: "/de/widerruf" },
    ],
  },
];

export function getSiteNavigation(_customSizeEnabled: boolean) {
  return siteNavigation;
}

export function getFooterLinks(customSizeEnabled: boolean) {
  if (!customSizeEnabled) {
    return footerLinks;
  }

  return footerLinks.map((group) => {
    if (group.title !== "Produkte") {
      return group;
    }

    return {
      ...group,
      links: [...group.links, { label: "Wunschformat", href: "/de/wunschformat" }],
    };
  });
}

const commonCommercialLinks: RelatedLink[] = [
  {
    label: "PP-Rollenetiketten",
    href: "/de/pp-rollenetiketten",
    description: "Produktübersicht für opake und transparente PP-Materialien.",
  },
  {
    label: "Opake PP-Etiketten",
    href: "/de/opake-pp-etiketten",
    description: "Standardmaterial für deckende Motive und Pflichtangaben.",
  },
  {
    label: "Transparente PP-Etiketten",
    href: "/de/transparente-pp-etiketten",
    description:
      "Premium-Variante für Flaschen, Gläser und sichtbare Verpackungsoberflächen.",
  },
  {
    label: "Angebot anfordern",
    href: "/de/angebot-anfordern",
    description:
      "Für 20.000+ Stück, Sondergrößen oder mehrere Varianten im selben Projekt.",
  },
];

const guideCommercialLinks: RelatedLink[] = [
  ...commonCommercialLinks,
  {
    label: "Musterbox",
    href: "/de/musterbox",
    description:
      "Sinnvoll, wenn Materialwirkung und Haptik vor der ersten Menge geklärt werden sollen.",
  },
  {
    label: "Druckdaten",
    href: "/de/druckdaten",
    description:
      "Technische Anforderungen für PDF, AI, EPS, SVG, PNG, JPG und ZIP.",
  },
  {
    label: "Nachbestellen",
    href: "/de/nachbestellen",
    description:
      "Freigegebene Etiketten mit gespeicherten Druckdaten schneller erneut abrufen.",
  },
];

const topLevelPages: PublicPageData[] = [
  {
    path: "/de/lebensmittel-etiketten",
    slug: "lebensmittel-etiketten",
    kind: "industry",
    title: "Lebensmitteletiketten drucken",
    eyebrow: "Branche",
    lead:
      "Bedruckte PP-Rollenetiketten für Lebensmittelmarken in Deutschland. Geeignet für Gläser, Beutel, Flaschen und klassische Verpackungen.",
    heroBullets: [
      "Opake oder transparente PP-Varianten für unterschiedliche Verpackungsoptiken.",
      "100×200 mm als bewährtes Standardformat für wiederkehrende Produktetiketten.",
      "Nachbestelllogik wichtig für Sortimente mit mehreren Chargen und saisonalen Abrufen.",
    ],
    sidebarTitle: "Typische Anwendungen",
    sidebarBullets: [
      "Gläser, Beutel und Faltschachteln",
      "Honig, Gewürze, Marmelade und Feinkost",
      "Wiederkehrende Sortimente mit identischer Etikettengröße",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Warum PP für Lebensmittelverpackungen",
        body: [
          "PP-Rollenetiketten sind für Lebensmittelmarken sinnvoll, wenn Material, Druckdaten und Etikettengröße reproduzierbar bleiben sollen.",
          "Bei wiederkehrenden Chargen zählt nicht nur der Stückpreis, sondern ob Sie dieselbe Spezifikation später verlässlich wieder bestellen können.",
        ],
      },
      {
        title: "Feuchtigkeits- und fettbeständig",
        body: [
          "PP-Folie weicht nicht auf wie Papier – wichtig bei Kühlung, Kondenswasser, Fett und feuchten Lagerbedingungen.",
          "Das Druckbild bleibt auch bei Gläsern aus dem Kühlregal und fetthaltigen Produkten stabil.",
        ],
      },
      {
        title: "Platz für LMIV-Pflichtangaben",
        body: [
          "Die LMIV verlangt u. a. Bezeichnung, Zutaten, Allergene (hervorgehoben), Nährwerttabelle, Füllmenge, MHD und Verantwortlichen.",
          "Opakes PP mit deckender Fläche schafft die nötige Lesbarkeit für dichte Pflichtangaben bei kleiner Schriftgröße.",
        ],
      },
      {
        title: "Welche Optik besser passt",
        body: [
          "Opake PP-Etiketten helfen, wenn Pflichtangaben, Zutatenlisten und markante Farbflächen klar lesbar sein müssen.",
          "Transparente PP-Etiketten wirken hochwertiger auf Glas und Sichtfenster-Verpackungen, wenn das Produkt selbst sichtbar bleiben soll.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind PP-Etiketten für Lebensmittel geeignet?",
        answer:
          "Ja. PP-Folie ist für Etiketten auf Lebensmittelverpackungen verbreitet und beständig gegen Feuchtigkeit und Fett. Das Etikett sitzt außen auf der Verpackung, nicht im direkten Lebensmittelkontakt. Spezielle Anforderungen an Direktkontakt klären wir über ein Angebot.",
      },
      {
        question: "Welche Pflichtangaben muss mein Lebensmitteletikett enthalten?",
        answer:
          "Nach LMIV u. a.: Bezeichnung des Lebensmittels, Zutatenverzeichnis, hervorgehobene Allergene, Nettofüllmenge, Mindesthaltbarkeit, Name/Anschrift des Verantwortlichen und – bei den meisten verpackten Lebensmitteln – eine Nährwerttabelle. Die inhaltliche und rechtliche Verantwortung liegt bei Ihnen; wir übernehmen den Druck, keine rechtliche Prüfung.",
      },
      {
        question: "Halten die Etiketten im Kühlschrank und auf feuchten Gläsern?",
        answer:
          "Ja. PP-Folie mit permanentem Klebstoff hält auch bei Kondenswasser und im gekühlten Bereich. Papieretiketten weichen bei Feuchtigkeit auf – PP nicht.",
      },
      {
        question: "Welche Lebensmittelverpackungen passen zum Standardformat 100×200 mm?",
        answer:
          "Das Format 100×200 mm eignet sich für viele Produktetiketten auf Gläsern, Beuteln und Flaschen. Andere Maße wählen Sie im Kalkulator frei, Breite bis 320 mm.",
      },
      {
        question: "Kann ich bei wiederkehrenden Sorten dieselbe Spezifikation erneut bestellen?",
        answer:
          "Ja. Nach der Freigabe bleiben Material, Maß und Druckdaten gespeichert – die Nachbestellung startet ohne neue Abstimmung zum gleichen Paketpreis.",
      },
    ],
    relatedLinks: [
      {
        label: "Flaschenetiketten",
        href: "/de/flaschenetiketten",
        description:
          "Wenn Lebensmittel in Flaschen oder Glasgebinden verkauft werden.",
      },
      {
        label: "Honig- und Marmeladenetiketten",
        href: "/de/honig-marmelade-etiketten",
        description:
          "Spezialseite für Gläser, kleine Chargen und transparente Optiken.",
      },
      {
        label: "Transparente vs. opake Etiketten",
        href: "/de/ratgeber/transparente-vs-opake-etiketten",
        description:
          "Vergleich der Materialwirkung für Gläser, Dosen und Verpackungen.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/supplement-etiketten",
    slug: "supplement-etiketten",
    kind: "industry",
    title: "Supplement-Etiketten drucken",
    eyebrow: "Branche",
    lead:
      "PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.",
    heroBullets: [
      "Geeignet für wiederkehrende SKU-Strukturen im B2B-Kontext.",
      "Saubere Unterscheidung zwischen Standardprodukt und Angebotsfall.",
      "Klare Nachbestellkommunikation für Marken mit laufender Produktion.",
    ],
    sidebarTitle: "Für Supplement-Marken wichtig",
    sidebarBullets: [
      "Konstante Größe über mehrere Varianten",
      "Hohe Wiederholungsrate bei identischen Spezifikationen",
      "Transparente oder opake Optik je nach Verpackung",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Struktur statt Variantenchaos",
        body: [
          "Supplement-Marken brauchen wiederkehrende Etiketten mit fest dokumentierter Spezifikation – nicht ständig neue Online-Konfigurationen.",
          "Darum konzentrieren wir uns auf einen klaren Kern aus PP-Material, Standardformat und Nachbestellung.",
        ],
      },
      {
        title: "Chargennummer und MHD pro Auflage",
        body: [
          "Nahrungsergänzungsmittel brauchen je Charge eine Chargennummer und ein Mindesthaltbarkeitsdatum.",
          "Für variable Daten pro Etikett (Lot/MHD) erstellen wir ein strukturiertes Angebot – das Layout bleibt sonst identisch zur gespeicherten Spezifikation.",
        ],
      },
      {
        title: "Pflichtangaben für Nahrungsergänzungsmittel",
        body: [
          "NEM unterliegen eigenen Vorgaben: Bezeichnung, empfohlene Tagesdosis, Warnhinweise, Nährstoffmengen je Portion und Verantwortlicher.",
          "Wir drucken Ihr freigegebenes Layout – die inhaltliche und rechtliche Prüfung der Angaben liegt bei Ihnen.",
        ],
      },
      {
        title: "Wann opak und wann transparent",
        body: [
          "Opakes PP passt für dichte Farbflächen, Pflichtangaben und stabile Regaloptik auf Dosen und Beuteln.",
          "Transparentes PP eignet sich, wenn Flaschen oder Dosen eine reduzierte Premium-Wirkung behalten sollen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich Chargennummer und MHD auf die Etiketten drucken?",
        answer:
          "Ja. Feste Angaben sind Teil des Layouts. Wechselnde Chargennummern oder MHD pro Etikett laufen über variable Daten und werden als strukturiertes Angebot kalkuliert.",
      },
      {
        question: "Welche Angaben gehören auf ein Supplement-Etikett?",
        answer:
          "Für Nahrungsergänzungsmittel u. a. Bezeichnung, empfohlene tägliche Verzehrmenge, Warnhinweis vor Überschreitung, Hinweis zur Aufbewahrung und der Verantwortliche. Die rechtliche Verantwortung liegt bei Ihnen – wir übernehmen den Druck.",
      },
      {
        question: "Sind Supplement-Etiketten nur für Dosen gedacht?",
        answer:
          "Nein. Sie decken auch Beutel und Flaschen ab, solange Material und Etikettengröße klar beschrieben sind. Das Standardformat ist 100×200 mm.",
      },
      {
        question: "Halten die Etiketten auf glänzenden Supplement-Dosen?",
        answer:
          "Ja. PP-Folie mit permanentem Klebstoff haftet auf beschichteten und glänzenden Dosen sowie auf PET-Flaschen zuverlässig.",
      },
      {
        question: "Kann ich zuerst Material vergleichen?",
        answer:
          "Ja. Die Musterbox enthält opake und transparente PP-Beispiele als Orientierung vor größeren Mengen.",
      },
    ],
    relatedLinks: [
      {
        label: "Beutel als Anwendungsfall",
        href: "/de/kaffee-etiketten",
        description:
          "Kaffeebeutel liefern einen realen Vergleich für flexible Verpackungen mit opaken Etiketten.",
      },
      {
        label: "PP vs. Papier",
        href: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
        description:
          "Warum PP bei Feuchtigkeit, Abrieb und wiederkehrenden Produktionen oft stabiler ist.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/getraenke-etiketten",
    slug: "getraenke-etiketten",
    kind: "industry",
    title: "Getränkeetiketten drucken",
    eyebrow: "Branche",
    lead:
      "Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.",
    heroBullets: [
      "Transparente PP-Etiketten passen besonders gut zu Flaschen- und Glasoptiken.",
      "Opake Varianten bleiben sinnvoll für kontrastreiche Designs und Pflichtangaben.",
      "Unser Angebot ist auf B2B-Verpackungen ausgelegt, nicht auf Einzelstücke.",
    ],
    sidebarTitle: "Typische Einsatzbereiche",
    sidebarBullets: [
      "Flaschenetiketten für Getränke",
      "Glasverpackungen mit transparenter Optik",
      "Wiederkehrende Abrufe über feste Mengenstufen",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
    },
    sections: [
      {
        title: "Warum transparente PP-Etiketten oft dominieren",
        body: [
          "Getränkeverpackungen profitieren häufig von transparenter Optik, wenn Flaschen- oder Glasmaterial sichtbar bleiben soll.",
          "Diese Entscheidung wird mit einem klaren Premium-Preis von der opaken Variante getrennt.",
        ],
      },
      {
        title: "Wann opak die bessere Wahl ist",
        body: [
          "Wenn starke Farbflächen, hohe Deckkraft oder klare Typografie im Vordergrund stehen, bleibt opakes PP die robustere Standardlösung.",
        ],
      },
    ],
    faqs: [
      {
        question: "Eignen sich transparente Etiketten für Glas und Flaschen?",
        answer:
          "Ja. Genau dafür ist transparentes PP positioniert, vor allem für Premium-Verpackungen im Getränkeumfeld.",
      },
      {
        question: "Kann ich für mehrere Flaschenvarianten ein Angebot anfordern?",
        answer:
          "Ja. Sobald mehrere Varianten, Mengen oder Spezifikationen zusammenkommen, ist das Angebotsformular der richtige Einstieg.",
      },
    ],
    relatedLinks: [
      {
        label: "Flaschenetiketten",
        href: "/de/flaschenetiketten",
        description:
          "Spezialseite mit Fokus auf Glas, Sichtbarkeit und Materialwirkung.",
      },
      {
        label: "Glossar: transparente Etiketten",
        href: "/de/glossar/transparente-etiketten",
        description:
          "Kurze Definition für den Unterschied zur opaken Variante.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/transparente-pp-etiketten",
    slug: "transparente-pp-etiketten",
    kind: "product",
    title: "Transparente PP-Etiketten drucken",
    eyebrow: "Produkt",
    lead:
      "Transparente PP-Rollenetiketten im Wunschformat für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen, prüfen und später leichter nachbestellen.",
    heroBullets: [
      "Wunschformat – Breite bis 320 mm, Höhe frei wählbar.",
      "Preisberechnung sofort im Kalkulator – ohne Anfrage oder Wartezeit.",
      "Netto und Brutto sichtbar, Versand nach Deutschland inklusive.",
      "Ab 20.000 Stück oder für Sonderanforderungen: individuelles B2B-Angebot.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "Transparentes PP",
      "Geeignet für Premium-Verpackungen und Glasoptiken",
      "Wunschformat nach Maß",
    ],
    primaryCta: {
      label: "Preis berechnen",
      href: "/de/kalkulator",
    },
    secondaryCta: sampleLink,
    packageHeading: "Preise für transparente PP-Etiketten",
    packageLead:
      "Die festen Pakete zeigen das große 100×200-mm-Format, 1 Design pro Auftrag, Standard-Datenprüfung, 1 Proof-Runde und Versand nach Deutschland. Weißunterdruck ist nicht enthalten und läuft als Zusatz über das Angebot.",
    packageTable: transparentPackages,
    sections: [
      {
        title: "Wann transparentes PP sinnvoll ist",
        body: [
          "Transparente PP-Rollenetiketten sind für Flaschen, Gläser und reduzierte Verpackungsoptiken gedacht, bei denen Material oder Füllstand sichtbar bleiben darf.",
          "Die klare Premium-Positionierung verhindert, dass transparente Etiketten versehentlich wie die günstigere opake Standardvariante verkauft werden.",
        ],
      },
      {
        title: "Worauf es im Ablauf ankommt",
        body: [
          "Es geht nicht um beliebige Online-Konfigurationen, sondern um reproduzierbare Material- und Mengenentscheidungen.",
        ],
        bullets: [
          "Materialwahl dokumentieren",
          "Druckdaten technisch prüfen",
          "Spätere Nachbestellung mit gleicher Spezifikation beschleunigen",
        ],
      },
      {
        title: "Welche Folgeseiten helfen",
        body: [
          "Die Branchen-Seite für Flaschenetiketten und der Materialvergleich transparent vs. opak vertiefen typische Kaufentscheidungen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Warum ist transparentes PP teurer als opakes PP?",
        answer:
          "Transparentes PP ist als Premium-Variante positioniert. Zusätzlich ist Weißunterdruck nicht im Fixpreis enthalten und wird bei Bedarf separat angeboten.",
      },
      {
        question: "Ist 2.000 Stück direkt vorgesehen?",
        answer:
          "Ja. Die Preisstaffel enthält eine 2.000er-Stufe als Paket für Nachbestellungen bei wiederkehrenden kleinen Chargen.",
      },
      {
        question: "Kann ich transparente PP-Etiketten später nachbestellen?",
        answer:
          "Ja. Freigegebene Druckdaten, Material und Spezifikation bleiben für spätere Nachbestellungen nutzbar. Bei identischem Artwork geht der Folgeauftrag deutlich schneller.",
      },
      {
        question: "Welche Druckdateien werden akzeptiert?",
        answer:
          "Bevorzugt sind PDF, AI und EPS. Zusätzlich können auch SVG, PNG, JPG oder ZIP sinnvoll sein, solange Format, Beschnitt und finale Version korrekt vorbereitet sind.",
      },
      {
        question: "Wer ist für Pflichtangaben und regulatorische Inhalte verantwortlich?",
        answer:
          "Der Kunde bleibt für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, aber keine rechtliche Prüfung.",
      },
      {
        question: "Kann ich zwischen Glanz und matt wählen?",
        answer:
          "Ja. Transparentes PP hat ein Glanzfinish. Wenn Sie eine matte Wirkung möchten, machen wir dafür ein separates Angebot – so bleibt die Oberfläche bei jeder Nachbestellung gleich.",
      },
      {
        question: "Welcher Klebstoff ist im Standard vorgesehen?",
        answer:
          "Im Standard ist permanenter Klebstoff vorgesehen. Wenn Sie ablösbare oder anwendungsspezifische Klebstoffe brauchen, läuft das nicht über das Standardpaket, sondern über den Angebotsprozess.",
      },
      {
        question: "Brauche ich Weißunterdruck bei transparenten Etiketten immer?",
        answer:
          "Nein. Weißunterdruck ist nur nötig, wenn Farben, Typografie oder Pflichtangaben auf transparentem Material sonst zu wenig Deckung hätten. Er ist nicht automatisch enthalten; bei Bedarf rechnen wir ihn separat auf.",
      },
      {
        question: "Wie lange dauert die Lieferung nach der Freigabe?",
        answer:
          "Die ehrliche Richtgröße liegt bei ca. 10–14 Werktagen nach Ihrer Freigabe für Produktion und Versand nach Deutschland. Das ist ein voraussichtlicher Zeitraum und keine bindende Garantie.",
      },
      {
        question: "Sind die Rollen direkt für Spender oder Maschinen geeignet?",
        answer:
          "Der Standard ist für eine klare, wiederholbare Rollenspezifikation gedacht. Wenn Sie besondere Anforderungen an Kern, Wickelrichtung oder maschinelle Verarbeitung haben, sollte das vorab über das Angebot geklärt werden.",
      },
    ],
    relatedLinks: [
      {
        label: "Flaschenetiketten",
        href: "/de/flaschenetiketten",
        description: "Branchenseite für sichtbare Glas- und Flaschenverpackungen.",
      },
      {
        label: "Transparente vs. opake Etiketten",
        href: "/de/ratgeber/transparente-vs-opake-etiketten",
        description:
          "Guide mit direktem Vergleich der Materialwirkung auf Verpackungen.",
      },
      {
        label: "Opake PP-Etiketten",
        href: "/de/opake-pp-etiketten",
        description: "Die passende Gegenseite, wenn statt transparenter Optik mehr Deckkraft und Kontrast gebraucht werden.",
      },
      {
        label: "Etiketten 100x200 mm",
        href: "/de/etiketten-100x200",
        description: "Formatseite für das feste 100x200-mm-Standardformat mit klarer Einordnung des Einsatzfalls.",
      },
      {
        label: "Etiketten nachbestellen",
        href: "/de/nachbestellen",
        description: "Wenn dieselbe freigegebene Spezifikation später schneller erneut bestellt werden soll.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/opake-pp-etiketten",
    slug: "opake-pp-etiketten",
    kind: "product",
    title: "Opake PP-Etiketten drucken",
    eyebrow: "Produkt",
    lead:
      "Opake PP-Rollenetiketten im Wunschformat für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
    heroBullets: [
      "Das Standardprodukt für kontrastreiche Druckmotive und klare Deckkraft.",
      "Wunschformat – Breite bis 320 mm, Höhe frei wählbar.",
      "Preis sofort im Kalkulator – netto und brutto, Versand nach Deutschland inklusive.",
      "Ab 20.000 Stück oder für Sonderanforderungen: individuelles B2B-Angebot.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "Opakes PP",
      "Geeignet für Lebensmittel, Supplemente und klassische Produktverpackungen",
      "Wunschformat nach Maß",
    ],
    primaryCta: {
      label: "Preis berechnen",
      href: "/de/kalkulator",
    },
    secondaryCta: fileLink,
    packageHeading: "Preise für opake PP-Etiketten",
    packageLead:
      "Diese Tabelle zeigt die festen Pakete als All-in-Preis für das große 100×200-mm-Format inkl. Standard-Datenprüfung, 1 Proof-Runde und Versand nach Deutschland.",
    packageTable: opaquePackages,
    sections: [
      {
        title: "Der Standard für klare Lesbarkeit",
        body: [
          "Opake PP-Etiketten sind die robuste Standardwahl für Marken, die starke Flächendeckung, klare Pflichtangaben und konsistente Wiederholungen brauchen.",
        ],
      },
      {
        title: "Warum die 2.000er-Stufe wichtig ist",
        body: [
          "Die Stufe für Nachbestellungen wurde bewusst eingeführt, damit kleine wiederkehrende Marken nicht direkt von 1.000 auf 5.000 springen müssen.",
        ],
      },
      {
        title: "Welche Inhalte vertiefen die Entscheidung",
        body: [
          "Für Materialvergleiche und Verpackungstypen lohnt sich die Kombination aus Branchen-Seiten und Vergleichsratgebern.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ist opakes PP das Hauptprodukt?",
        answer:
          "Ja. Opake und transparente PP-Rollenetiketten bilden gemeinsam den Kern, wobei opak die Standardlösung für viele wiederkehrende Produktetiketten ist.",
      },
      {
        question: "Was ist im Auftrag bereits enthalten?",
        answer:
          "Enthalten sind das Rollenetikett im Wunschformat, 1 Design, das gewählte PP-Material, permanenter Klebstoff, CMYK-Digitaldruck, matt oder glänzend (kein Aufpreis), Standard-Datenprüfung, 1 Proof-Runde und Versand nach Deutschland.",
      },
      {
        question: "Kann ich damit auch Getränkeflaschen etikettieren?",
        answer:
          "Ja, wenn Deckkraft und klare Lesbarkeit wichtiger sind als ein transparenter Look. Für sichtbare Flaschenoptik ist die transparente Variante oft passender.",
      },
      {
        question: "Kann ich opake PP-Etiketten später nachbestellen?",
        answer:
          "Ja. Genau dafür ist die gespeicherte Spezifikation gedacht: Freigegebene Druckdaten, Material und Größe bleiben nutzbar, damit Folgeaufträge ohne neuen Start von vorn vorbereitet werden können.",
      },
      {
        question: "Welche Druckdateien werden akzeptiert?",
        answer:
          "Bevorzugt sind PDF, AI und EPS. Je nach Fall können auch SVG, PNG, JPG oder ZIP verarbeitet werden, wenn Format, Beschnitt und finale Version eindeutig vorbereitet sind.",
      },
      {
        question: "Wer ist für Pflichtangaben und regulatorische Inhalte verantwortlich?",
        answer:
          "Der Kunde bleibt für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, aber keine rechtliche Prüfung.",
      },
      {
        question: "Was passiert bei mehreren Sorten oder mehr als einem Design?",
        answer:
          "Ein Auftrag deckt ein Design ab. Mehrere Sorten, Zusatzdesigns oder Sonderkonstellationen laufen über den Angebotsprozess.",
      },
      {
        question: "Kann ich zwischen Glanz und matt wählen?",
        answer:
          "Ja. Standard ist eine wiederholbare Spezifikation für opakes PP mit Glanzfinish. Wenn Sie matt möchten, geben Sie das vor der Freigabe an – dann behält jede Nachbestellung dieselbe Oberfläche.",
      },
      {
        question: "Welcher Klebstoff ist im Standard enthalten?",
        answer:
          "Der Standard ist auf permanenten Klebstoff ausgelegt. Sobald ablösbare, tiefkühlgeeignete oder sonstige Sonderanforderungen dazukommen, ist das ein Fall fürs Angebot statt eines stillen Standardversprechens.",
      },
      {
        question: "Brauche ich Weißunterdruck auch bei opaken Etiketten?",
        answer:
          "In der Regel nein. Weißunterdruck ist vor allem bei transparenten Etiketten ein Thema, wenn Deckkraft gezielt aufgebaut werden muss. Wer diesen Effekt braucht, sollte die transparente Variante plus Angebotsweg prüfen.",
      },
      {
        question: "Wie lange dauert die Lieferung nach der Freigabe?",
        answer:
          "Als ehrliche Orientierung gelten ca. 10–14 Werktage nach Ihrer Freigabe für Produktion und Versand nach Deutschland. Das ist ein voraussichtlicher Zeitraum, keine bindende Garantie.",
      },
      {
        question: "Sind die Rollen direkt für Spender oder Maschinen geeignet?",
        answer:
          "Das Standardpaket ist auf eine klare, wiederholbare Rollenspezifikation ausgelegt. Wenn Kern, Wickelrichtung oder Maschinenanforderungen davon abweichen, sollte das vorab über das Angebot abgestimmt werden.",
      },
    ],
    relatedLinks: [
      {
        label: "PP vs. Papier",
        href: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
        description:
          "Warum PP für Feuchtigkeit, Abrieb und wiederkehrende Produktlinien meist stabiler ist.",
      },
      {
        label: "Gewürz-Etiketten",
        href: "/de/gewuerz-etiketten",
        description:
          "Branchenspezifisches Beispiel für kleine Formate mit dichten Pflichtangaben.",
      },
      {
        label: "Transparente PP-Etiketten",
        href: "/de/transparente-pp-etiketten",
        description: "Die Gegenseite für Glas-, Flaschen- und Premium-Optiken mit sichtbarem Inhalt.",
      },
      {
        label: "Etiketten 100x200 mm",
        href: "/de/etiketten-100x200",
        description: "Formatseite für das feste 100x200-mm-Standardformat und seine typische B2B-Verpackungslogik.",
      },
      {
        label: "Etiketten nachbestellen",
        href: "/de/nachbestellen",
        description: "Wenn eine freigegebene Produktlinie später ohne neuen Start von vorn wiederholt werden soll.",
      },
      {
        label: "Supplement-Etiketten",
        href: "/de/supplement-etiketten",
        description: "Branchenseite für Dosen, Beutel und Flaschen mit wiederkehrenden Pflichtangaben und SKU-Logik.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/pp-rollenetiketten",
    slug: "pp-rollenetiketten",
    kind: "product",
    title: "PP-Rollenetiketten drucken",
    eyebrow: "Produktübersicht",
    lead:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, Wunschformat nach Maß, mit gespeicherten Druckdaten.",
    heroBullets: [
      "Zentrale Produktübersicht für opake und transparente PP-Etiketten.",
      "Verbindet Materialwahl, Preise, Druckdaten und Nachbestellung.",
      "Bewusst schlankes Sortiment statt verwirrender Variantenvielfalt.",
    ],
    sidebarTitle: "Was Sie hier finden",
    sidebarBullets: [
      "Opakes PP als Standardlösung",
      "Transparentes PP als Premium-Variante",
      "Weiterleitung zu Angebot, Musterbox und Druckdaten",
    ],
    primaryCta: {
      label: "Preis berechnen",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "B2B-Angebot anfordern",
      href: "/de/angebot-anfordern",
    },
    sections: [
      {
        title: "Der Kern des Angebots",
        body: [
          "PP-Rollenetiketten stehen bewusst im Zentrum unseres Sortiments. Sie sind der Einstieg für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland.",
        ],
      },
      {
        title: "Material statt Variantenchaos",
        body: [
          "Wir trennen klar zwischen opakem und transparentem PP, statt unzählige Konfigurationspfade anzubieten.",
        ],
      },
      {
        title: "Branchen und Ratgeber als Ergänzung",
        body: [
          "Branchen-Seiten und Ratgeber vertiefen konkrete Verpackungsfälle, ohne das Sortiment unnötig zu verbreitern.",
        ],
      },
    ],
    table: {
      title: "Materialvergleich",
      lead:
        "Wir konzentrieren uns auf wenige Kernmaterialien – das macht Vergleich, Preis und Nachbestellung einfacher.",
      columns: ["Material", "Rolle", "Stärken"],
      rows: [
        [
          "Opakes PP",
          "Standardprodukt",
          "Deckkraft, klare Lesbarkeit, wiederkehrende Chargen",
        ],
        [
          "Transparentes PP",
          "Premium-Produkt",
          "Reduzierte Optik, Glas- und Flaschenverpackungen",
        ],
        [
          "Thermo",
          "Zusatzprodukt",
          "Versand, Lager, interne Logistik als Ergänzung",
        ],
      ],
    },
    faqs: [
      {
        question: "Warum gibt es nur wenige Kernmaterialien?",
        answer:
          "Wir setzen auf einen schmalen Produktkern statt auf ein zu breites Sortiment. Das hält Auswahl, Qualität und Nachbestellung überschaubar.",
      },
      {
        question: "Kann ich PP-Rollenetiketten später nachbestellen?",
        answer:
          "Ja. Nach der Freigabe bleiben Druckdaten, Material und Größe für spätere Nachbestellungen nutzbar. Das ist ein Kernvorteil gegenüber einem losen Einmalauftrag.",
      },
      {
        question: "Welche Druckdateien werden für PP-Rollenetiketten akzeptiert?",
        answer:
          "Bevorzugt sind PDF, AI und EPS. Zusätzlich können SVG, PNG, JPG oder ZIP sinnvoll sein, solange Beschnitt, Endformat und finale Version korrekt vorbereitet sind.",
      },
      {
        question: "Wer ist für Pflichtangaben und regulatorische Inhalte verantwortlich?",
        answer:
          "Der Kunde bleibt für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, aber keine rechtliche Prüfung.",
      },
      {
        question: "Wann wähle ich opakes und wann transparentes PP?",
        answer:
          "Opakes PP ist meist die sicherere Standardlösung für klare Deckkraft, Pflichtangaben und starke Farbflächen. Transparentes PP passt besser, wenn Glas, Flasche oder Produktoberfläche bewusst sichtbar bleiben sollen.",
      },
      {
        question: "Welche Menge läuft nicht mehr als Standardpaket?",
        answer:
          "Die festen Pakete decken 1.000, 2.000, 5.000 und 10.000 Stück ab. Ab 20.000 Stück, bei mehreren Varianten oder bei Sonderanforderungen fordern Sie ein individuelles Angebot an.",
      },
      {
        question: "Wie lange dauert der Weg von Freigabe bis Lieferung?",
        answer:
          "Für die Standardlogik gilt als ehrliche Orientierung ein Zeitraum von ca. 10–14 Werktagen nach Ihrer Freigabe für Produktion und Versand nach Deutschland. Das ist kein starres Liefergarantie-Versprechen.",
      },
    ],
    relatedLinks: [
      {
        label: "Rollenetiketten drucken lassen",
        href: "/de/rollenetiketten-drucken",
        description:
          "Druckablauf, Datenprüfung und Proof für bedruckte Rollenetiketten.",
      },
      {
        label: "Etiketten auf Rolle",
        href: "/de/etiketten-auf-rolle",
        description:
          "Bedruckte Etiketten auf Rolle im Standardformat 100×200 mm.",
      },
      {
        label: "Ratgeber",
        href: "/de/ratgeber",
        description:
          "Vergleichs- und Erklärseiten zu Material, Menge und Druckdaten.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/rollenetiketten",
    slug: "rollenetiketten",
    kind: "collection",
    title: "Rollenetiketten für Produktmarken",
    eyebrow: "Rollenetiketten",
    lead:
      "Bedruckte Rollenetiketten aus PP für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland. Opak oder transparent, mit geprüften und gespeicherten Druckdaten für schnelle Nachbestellungen.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand nach Deutschland.",
      "PP-Rollenetiketten opak oder transparent – ein klarer Materialkern statt unübersichtlicher Varianten.",
      "Druckdaten werden beim ersten Auftrag geprüft und für jede Nachbestellung gespeichert.",
      "Lieferung DDP nach Deutschland – Zoll und Einfuhr inklusive.",
    ],
    sidebarTitle: "Für wen geeignet",
    sidebarBullets: [
      "Produktmarken mit wiederkehrenden Auflagen",
      "Lebensmittel, Getränke, Supplemente, Kosmetik",
      "Marken, die dieselbe Spezifikation regelmäßig nachbestellen",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Was Rollenetiketten für B2B-Marken bedeuten",
        body: [
          "Rollenetiketten laufen automatisiert über Spender oder Etikettiermaschine und eignen sich für wiederkehrende Produktauflagen.",
          "Wir produzieren sie auf PP-Folie – robust gegen Feuchtigkeit, Abrieb und Kühlschrankkondens.",
        ],
      },
      {
        title: "Opak oder transparent",
        body: [
          "Opakes PP deckt vollständig ab und sorgt für klare Pflichtangaben und kräftige Farbflächen.",
          "Transparentes PP lässt Glas, Flasche oder Inhalt sichtbar – die typische Premium-Optik für Getränke und Kosmetik.",
        ],
      },
      {
        title: "Einmal freigegeben, immer nachbestellbar",
        body: [
          "Nach Ihrer Freigabe speichern wir Material, Format, Version und Druckdaten.",
          "Die nächste Auflage starten Sie ohne neue Abstimmung – gleiche Spezifikation, gleicher Paketpreis.",
        ],
      },
    ],
    table: {
      title: "Rollenetiketten im Überblick",
      lead: "Material, Wirkung und typische Nutzung auf einen Blick.",
      columns: ["Material", "Wirkung", "Typische Nutzung"],
      rows: [
        ["Opakes PP", "deckend, kontraststark", "Dosen, Beutel, Gläser, Pflichtangaben"],
        ["Transparentes PP", "klar, hochwertig", "Flaschen, Gläser, Premium-Verpackungen"],
      ],
    },
    faqs: [
      {
        question: "Was kosten Rollenetiketten?",
        answer:
          "Im Kalkulator geben Sie Breite, Höhe und Menge ein und sehen den Netto- und Bruttopreis sofort – inklusive Versand nach Deutschland. Feste Pakete gibt es für 1.000 bis 10.000 Stück, ab 20.000 Stück per Angebot.",
      },
      {
        question: "Ab welcher Menge kann ich Rollenetiketten bestellen?",
        answer:
          "Ab 1.000 Stück. Das ist die Pilotauflage für den ersten Test einer Spezifikation. Für wiederkehrende B2B-Bestellungen ist die 5.000er-Auflage die empfohlene Menge.",
      },
      {
        question: "Welches Material ist für Rollenetiketten am besten?",
        answer:
          "Für die meisten Produktverpackungen ist PP-Folie die robuste Wahl: feuchtigkeitsbeständig, reißfest und prozesssicher für die Rollenverarbeitung. Opak für Deckkraft, transparent für sichtbare Verpackung.",
      },
      {
        question: "Kann ich Rollenetiketten später nachbestellen?",
        answer:
          "Ja. Freigegebene Druckdaten, Material und Maß bleiben gespeichert. Die Nachbestellung startet aus dem Kundenkonto ohne neue Abstimmung.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung an Ihre Adresse in Deutschland (Produktion und Versand). Die Lieferung erfolgt DDP – Zoll und Einfuhr sind inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "Rollenetiketten drucken lassen",
        href: "/de/rollenetiketten-drucken",
        description: "Druckablauf, Datenprüfung und Proof für bedruckte Rollenetiketten.",
      },
      {
        label: "Etiketten auf Rolle",
        href: "/de/etiketten-auf-rolle",
        description: "Bedruckte Etiketten auf Rolle im Standardformat 100×200 mm.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/rollenetiketten-drucken",
    slug: "rollenetiketten-drucken",
    kind: "collection",
    title: "Rollenetiketten drucken lassen",
    eyebrow: "Druckservice",
    lead:
      "PP-Rollenetiketten drucken lassen – mit technischer Druckdatenprüfung, digitalem Proof und gespeicherten Daten für jede Nachbestellung. Für B2B-Marken in Deutschland, geliefert DDP.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "4/0-farbiger CMYK-Digitaldruck ohne Einrichtungs- oder Klischeekosten.",
      "Kostenlose Druckdatenprüfung plus ein Proof vor Produktionsstart.",
      "Freigegebene Druckdaten bleiben gespeichert – Nachbestellung ohne neue Abstimmung.",
    ],
    sidebarTitle: "Im Druck enthalten",
    sidebarBullets: [
      "CMYK-Digitaldruck ohne Einrichtungskosten",
      "Druckdatenprüfung und ein Proof",
      "Versand nach Deutschland, Druckdaten gespeichert",
    ],
    primaryCta: {
      label: "Preis berechnen",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Druckdaten-Anforderungen ansehen",
      href: "/de/druckdaten",
    },
    sections: [
      {
        title: "So läuft der Druck ab",
        body: [
          "Sie konfigurieren Format, Material und Menge im Kalkulator und bezahlen per Karte oder SEPA.",
          "Anschließend laden Sie Ihre Druckdaten hoch – wir prüfen sie technisch und senden einen Proof zur Freigabe.",
        ],
      },
      {
        title: "Druckdatenprüfung inklusive",
        body: [
          "Die Standard-Datenprüfung fängt typische Format-, Beschnitt- und Versionsfehler vor dem Druck ab.",
          "Erst nach Ihrer Proof-Freigabe startet die Produktion – keine Überraschungen im Drucklauf.",
        ],
      },
      {
        title: "Wiederholdruck ohne neue Abstimmung",
        body: [
          "Nach der Freigabe sind Druckdaten, Material und Maß gespeichert.",
          "Der nächste Drucklauf startet mit identischer Spezifikation zum gleichen Paketpreis.",
        ],
      },
    ],
    table: {
      title: "Druckspezifikation",
      lead: "Die wichtigsten Druckparameter im Überblick.",
      columns: ["Parameter", "Standard", "Hinweis"],
      rows: [
        ["Druckverfahren", "4/0-farbig CMYK Digital", "Keine Einrichtungs- oder Klischeekosten"],
        ["Datenprüfung", "inklusive + 1 Proof", "Produktion erst nach Freigabe"],
        ["Material", "PP opak oder transparent", "Matt oder glänzend, kein Aufpreis"],
        ["Datenformate", "PDF, AI, EPS, SVG, PNG, JPG", "Mit 3 mm Beschnitt"],
      ],
    },
    faqs: [
      {
        question: "Welche Druckdaten brauche ich?",
        answer:
          "PDF, AI, EPS, SVG, PNG oder JPG mit 3 mm Beschnitt. Bevorzugt sind vektorbasierte PDF- oder AI-Dateien. Wir prüfen die Daten vor der Produktion kostenlos.",
      },
      {
        question: "Kann ich Druckdaten nach der Bestellung nachreichen?",
        answer:
          "Ja. Nach dem Checkout erhalten Sie einen sicheren Upload-Link. Die Produktion startet erst nach Datenprüfung und Proof-Freigabe.",
      },
      {
        question: "Was kostet der Proof?",
        answer:
          "Ein digitaler Proof gehört zum Standardumfang jedes Druckauftrags. Ein zusätzlicher physischer Andruck auf Ihrem Material ist optional gegen Aufpreis möglich.",
      },
      {
        question: "Fallen Einrichtungskosten an?",
        answer:
          "Nein. Der 4/0-farbige CMYK-Digitaldruck läuft ohne Einrichtungs- oder Klischeekosten. Der Paketpreis ist der Endpreis inklusive Versand nach Deutschland.",
      },
      {
        question: "Wie lange dauert der Druck bis zur Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland – Produktion und Versand zusammen. Die Lieferung erfolgt DDP, Zoll und Einfuhr inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "Rollenetiketten",
        href: "/de/rollenetiketten",
        description: "Produktübersicht für opake und transparente PP-Rollenetiketten.",
      },
      {
        label: "Etiketten auf Rolle",
        href: "/de/etiketten-auf-rolle",
        description: "Bedruckte Etiketten auf Rolle im Standardformat 100×200 mm.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/etiketten-auf-rolle",
    slug: "etiketten-auf-rolle",
    kind: "collection",
    title: "Bedruckte Etiketten auf Rolle",
    eyebrow: "Auf Rolle",
    lead:
      "Bedruckte Etiketten auf Rolle aus PP – im Standardformat 100×200 mm, opak oder transparent. Für die automatische Verarbeitung über Spender oder Etikettiermaschine, geliefert DDP nach Deutschland.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "Etiketten auf Rolle für Spender und Etikettiermaschinen statt loser Einzelblätter.",
      "Standardformat 100×200 mm, opak oder transparent auf robustem PP.",
      "Druckdaten geprüft und gespeichert – jede Nachbestellung startet ohne neue Abstimmung.",
    ],
    sidebarTitle: "Warum auf Rolle",
    sidebarBullets: [
      "Automatische Verarbeitung über Spender oder Maschine",
      "Gleichmäßige Etikettierung über die gesamte Rolle",
      "Effizient bei wiederkehrenden Produktauflagen",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Etiketten auf Rolle statt Bogen",
        body: [
          "Auf Rolle gelieferte Etiketten laufen direkt über Spender oder Etikettiermaschine – ohne manuelles Vereinzeln.",
          "Das spart Zeit bei wiederkehrenden Auflagen und sorgt für ein gleichmäßiges Etikettenbild.",
        ],
      },
      {
        title: "Standardformat 100×200 mm",
        body: [
          "Das Format 100×200 mm bündelt die Nachfrage auf eine gut steuerbare Standardgröße für Produktverpackungen.",
          "Andere Maße sind im Kalkulator frei wählbar – Breite bis 320 mm, Höhe frei.",
        ],
      },
      {
        title: "PP-Material für die Rollenverarbeitung",
        body: [
          "PP-Folie ist reißfest und prozesssicher für die automatische Verarbeitung von der Rolle.",
          "Opak für Deckkraft und Pflichtangaben, transparent für sichtbare Verpackungsoptik.",
        ],
      },
    ],
    table: {
      title: "Etiketten auf Rolle – Spezifikation",
      lead: "Format, Material und Lieferform im Überblick.",
      columns: ["Merkmal", "Standard", "Hinweis"],
      rows: [
        ["Format", "100×200 mm", "Wunschformat bis 320 mm Breite möglich"],
        ["Material", "PP opak oder transparent", "Matt oder glänzend, kein Aufpreis"],
        ["Lieferform", "auf Rolle", "Für Spender und Etikettiermaschine"],
        ["Mindestmenge", "1.000 Stück", "Ab 20.000 Stück per Angebot"],
      ],
    },
    faqs: [
      {
        question: "Was bedeutet „Etiketten auf Rolle“?",
        answer:
          "Die Etiketten werden gestanzt und auf einer Trägerrolle geliefert, statt als einzelne Bögen. So lassen sie sich über Etikettenspender oder Etikettiermaschinen automatisch verarbeiten.",
      },
      {
        question: "Welcher Rollenkern wird verwendet?",
        answer:
          "Standardmäßig ein 76-mm-Kern mit Wickelrichtung Standard. Abweichende Kerngrößen oder Wickelrichtungen klären wir über ein Angebot.",
      },
      {
        question: "Welche Formate sind auf Rolle möglich?",
        answer:
          "Das Standardformat ist 100×200 mm. Im Kalkulator wählen Sie Breite bis 320 mm und die Höhe frei – der Preis wird sofort berechnet.",
      },
      {
        question: "Sind die Etiketten opak oder transparent?",
        answer:
          "Beides. Opakes PP deckt vollständig ab, transparentes PP lässt Glas und Inhalt sichtbar. Im Kalkulator wählen Sie das Material direkt aus.",
      },
      {
        question: "Wie schnell wird geliefert?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland. Die Lieferung erfolgt DDP – Zoll und Einfuhr sind im Preis enthalten.",
      },
    ],
    relatedLinks: [
      {
        label: "Rollenetiketten",
        href: "/de/rollenetiketten",
        description: "Produktübersicht für opake und transparente PP-Rollenetiketten.",
      },
      {
        label: "Etiketten 100×200 mm",
        href: "/de/etiketten-100x200",
        description: "Das Standardformat für wiederkehrende Produktetiketten.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/flaschenetiketten-drucken",
    slug: "flaschenetiketten-drucken",
    kind: "collection",
    title: "Flaschenetiketten drucken lassen",
    eyebrow: "Getränke",
    lead:
      "Flaschenetiketten drucken lassen – transparent oder opak auf PP-Rolle. Für Getränke, Spirituosen, Öle und Sirup. Mit geprüften Druckdaten und einfacher Nachbestellung, geliefert DDP nach Deutschland.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "Transparentes PP für den No-Label-Look auf Glas, opakes PP für kontraststarke Etiketten.",
      "Permanenter Klebstoff, der auch bei Kondenswasser zuverlässig haftet.",
    ],
    sidebarTitle: "Typische Anwendungen",
    sidebarBullets: [
      "Glas- und PET-Flaschen für Getränke",
      "Spirituosen, Öle, Sirup und Essig",
      "Wiederkehrende Auflagen mit gleicher Spezifikation",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Transparent oder opak für Flaschen",
        body: [
          "Transparentes PP erzeugt den No-Label-Look – das Etikett verschmilzt optisch mit der Flasche, Glas und Inhalt bleiben sichtbar.",
          "Opakes PP deckt vollständig ab und sorgt für kräftige Farben und klare Pflichtangaben auf farbigem oder ungleichmäßigem Glas.",
        ],
      },
      {
        title: "Haftung bei Feuchtigkeit",
        body: [
          "PP-Folie ist wasserfest und reißt nicht – im Gegensatz zu Papieretiketten, die bei Kondenswasser aufweichen.",
          "Der permanente Klebstoff hält auf Glas, PET und beschichteten Oberflächen, auch im gekühlten Bereich.",
        ],
      },
      {
        title: "Einmal freigegeben, immer nachbestellbar",
        body: [
          "Nach Ihrer Freigabe bleiben Druckdaten, Material und Format gespeichert.",
          "Die nächste Flaschenauflage starten Sie ohne neue Abstimmung zum gleichen Paketpreis.",
        ],
      },
    ],
    table: {
      title: "Material für Flaschenetiketten",
      lead: "Welche PP-Variante zu welcher Flasche passt.",
      columns: ["Material", "Wirkung", "Typische Flasche"],
      rows: [
        ["Transparentes PP", "No-Label-Look, Glas sichtbar", "Klarglas, Premium-Spirituosen, Öl"],
        ["Opakes PP", "deckend, kontraststark", "Farbglas, PET, kräftige Designs"],
      ],
    },
    faqs: [
      {
        question: "Welches Etikett haftet auf Flaschen im Kühlschrank?",
        answer:
          "PP-Folie mit permanentem Klebstoff hält auch bei Kondenswasser und im gekühlten Bereich zuverlässig. Papieretiketten weichen bei Feuchtigkeit auf – PP nicht.",
      },
      {
        question: "Was ist der No-Label-Look?",
        answer:
          "Transparentes PP lässt Glas und Inhalt sichtbar, sodass das Etikett kaum als Aufkleber wahrnehmbar ist. Das wirkt hochwertig und reduziert – typisch für Spirituosen und Premium-Getränke.",
      },
      {
        question: "Eignen sich die Etiketten für runde Flaschen?",
        answer:
          "Ja. Auf Rolle gelieferte Etiketten lassen sich über Spender oder Etikettiermaschine sauber um runde Flaschen wickeln. Das Standardformat ist 100×200 mm, andere Maße sind frei wählbar.",
      },
      {
        question: "Brauche ich Weißunterdruck auf transparentem Material?",
        answer:
          "Für deckende Farben auf transparentem PP ist Weißunterdruck nötig. Das ist ein kostenpflichtiger Zusatz und läuft über ein individuelles Angebot.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland. Die Lieferung erfolgt DDP – Zoll und Einfuhr sind inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "Weinetiketten drucken",
        href: "/de/weinetiketten-drucken",
        description: "PP-Etiketten für Wein-, Sekt- und Spirituosenflaschen.",
      },
      {
        label: "Getränke-Etiketten",
        href: "/de/getraenke-etiketten",
        description: "Branchenseite für Getränke- und Flaschenmarken.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/weinetiketten-drucken",
    slug: "weinetiketten-drucken",
    kind: "collection",
    title: "Weinetiketten drucken lassen",
    eyebrow: "Wein & Spirituosen",
    lead:
      "Weinetiketten drucken lassen – auf PP-Rolle, transparent oder opak, für Wein-, Sekt- und Spirituosenflaschen. Feuchtigkeitsbeständig, mit geprüften Druckdaten und einfacher Nachbestellung.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "Feuchtigkeitsbeständiges PP – hält im Weinkühler und bei Kondenswasser.",
      "Transparent für klare Glasoptik, opak für klassische Weinetiketten.",
    ],
    sidebarTitle: "Typische Anwendungen",
    sidebarBullets: [
      "Wein-, Sekt- und Schaumweinflaschen",
      "Spirituosen, Likör und Brände",
      "Kleine Weingüter und Manufakturen mit Wiederholauflagen",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "PP statt Papier für Weinflaschen",
        body: [
          "Weinflaschen stehen oft im Kühler oder Eiseimer – Papieretiketten weichen dann auf und lösen sich.",
          "PP-Folie ist wasserfest und behält Form und Druckbild auch bei dauerhafter Feuchtigkeit.",
        ],
      },
      {
        title: "Optik: transparent oder klassisch deckend",
        body: [
          "Transparentes PP wirkt modern und lässt das Glas sichtbar – passend für reduzierte Designs.",
          "Opakes PP bildet die klassische Weinetiketten-Optik mit deckenden Flächen und feinen Typo-Details ab.",
        ],
      },
      {
        title: "Pflichtangaben bleiben in Ihrer Verantwortung",
        body: [
          "Wein unterliegt eigenen Kennzeichnungsregeln (u. a. Allergene, Alkoholgehalt, Abfüller, neuerdings Zutaten und Nährwerte).",
          "Wir drucken Ihr fertiges Layout – die inhaltliche und rechtliche Prüfung der Pflichtangaben liegt bei Ihnen.",
        ],
      },
    ],
    table: {
      title: "Material für Weinetiketten",
      lead: "Welche PP-Variante zu welchem Auftritt passt.",
      columns: ["Material", "Wirkung", "Passend für"],
      rows: [
        ["Opakes PP", "deckend, klassisch", "Traditionelle Weingüter, kräftige Designs"],
        ["Transparentes PP", "klar, modern", "Reduzierte Etiketten, sichtbares Glas"],
      ],
    },
    faqs: [
      {
        question: "Halten die Etiketten im Weinkühler?",
        answer:
          "Ja. PP-Folie ist wasserfest und der permanente Klebstoff hält auch bei Kondenswasser und im Eiseimer. Das Druckbild bleibt erhalten.",
      },
      {
        question: "Welche Angaben müssen auf ein Weinetikett?",
        answer:
          "Dafür gelten weinrechtliche Vorgaben (z. B. Bezeichnung, Alkoholgehalt, Abfüller, Allergene und zunehmend Zutaten/Nährwerte). Die inhaltliche Verantwortung liegt bei Ihnen – wir übernehmen den Druck, nicht die rechtliche Prüfung.",
      },
      {
        question: "Kann ich kleine Auflagen für ein Weingut bestellen?",
        answer:
          "Ja. Die Pilotauflage beginnt bei 1.000 Stück. Für mehrere Sorten oder Jahrgänge in einem Auftrag erstellen wir ein individuelles Angebot.",
      },
      {
        question: "Geht auch eine transparente Weinetikette?",
        answer:
          "Ja. Transparentes PP erzeugt den No-Label-Look. Für deckende Farben auf transparentem Material ist Weißunterdruck nötig (kostenpflichtiger Zusatz über Angebot).",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland, DDP – Zoll und Einfuhr inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "Flaschenetiketten drucken",
        href: "/de/flaschenetiketten-drucken",
        description: "PP-Etiketten für Getränke-, Öl- und Sirupflaschen.",
      },
      {
        label: "Getränke-Etiketten",
        href: "/de/getraenke-etiketten",
        description: "Branchenseite für Getränke- und Flaschenmarken.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/barcode-etiketten",
    slug: "barcode-etiketten",
    kind: "collection",
    title: "Barcode-Etiketten drucken lassen",
    eyebrow: "Kennzeichnung",
    lead:
      "Barcode-Etiketten auf PP-Rolle für Produkt- und Handelskennzeichnung. EAN, GTIN, Code 128 und 2D-Codes wie QR oder GS1 DataMatrix – als fester Bestandteil Ihres Produktetiketts oder als separates Kennzeichnungsetikett.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "EAN/GTIN, Code 128, QR-Code und GS1 DataMatrix in scharfer Druckauflösung.",
      "Für Handel, Lebensmittel und Produktmarken mit Rückverfolgbarkeit.",
    ],
    sidebarTitle: "Typische Codes",
    sidebarBullets: [
      "EAN-13 / GTIN für den Handel",
      "Code 128 für Logistik und Lager",
      "QR-Code und GS1 DataMatrix für Rückverfolgung",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Angebot anfordern",
      href: "/de/angebot-anfordern",
    },
    sections: [
      {
        title: "Barcode als Teil des Produktetiketts",
        body: [
          "Ein EAN- oder GTIN-Code lässt sich direkt in Ihr Produktetikett integrieren – ein Etikett statt zwei.",
          "Wir drucken den Code in ausreichender Auflösung und mit korrektem Kontrast für eine zuverlässige Scanbarkeit.",
        ],
      },
      {
        title: "Codes und Rückverfolgbarkeit",
        body: [
          "Für Handel und Logistik sind EAN-13, GTIN und Code 128 die gängigen Standards.",
          "QR-Codes und GS1 DataMatrix transportieren zusätzlich Chargen-, MHD- oder Linkdaten für die Rückverfolgung.",
        ],
      },
      {
        title: "Variable Codes pro Etikett",
        body: [
          "Fortlaufende Seriennummern, Chargen oder individuelle Codes pro Etikett laufen über variable Daten.",
          "Diese strukturierten Aufträge kalkulieren wir über ein individuelles Angebot.",
        ],
      },
    ],
    table: {
      title: "Barcode-Typen im Überblick",
      lead: "Welcher Code für welchen Zweck.",
      columns: ["Code", "Einsatz", "Hinweis"],
      rows: [
        ["EAN-13 / GTIN", "Handel, Kasse", "Vergabe der Nummer über GS1"],
        ["Code 128", "Logistik, Lager", "Kompakt, alphanumerisch"],
        ["QR-Code", "Konsument, Link", "Verknüpft Produkt mit Online-Inhalt"],
        ["GS1 DataMatrix", "Rückverfolgung", "Charge, MHD, Seriennummer"],
      ],
    },
    faqs: [
      {
        question: "Kann der Barcode Teil meines Produktetiketts sein?",
        answer:
          "Ja. EAN, GTIN oder ein 2D-Code wird direkt in Ihr Etikettenlayout integriert. Sie brauchen kein separates Kennzeichnungsetikett.",
      },
      {
        question: "Vergeben Sie die Barcode-Nummern?",
        answer:
          "Nein. EAN-/GTIN-Nummern erhalten Sie über GS1. Sie liefern uns die Nummer oder den fertigen Code im Layout – wir drucken ihn scanbar.",
      },
      {
        question: "Sind variable oder fortlaufende Codes möglich?",
        answer:
          "Ja, über variable Daten (z. B. fortlaufende Seriennummern oder Chargencodes pro Etikett). Solche Aufträge laufen über ein individuelles Angebot.",
      },
      {
        question: "Sind die gedruckten Codes zuverlässig scanbar?",
        answer:
          "Wir achten auf ausreichende Größe, Ruhezonen und Kontrast. Bei sehr kleinen Codes oder transparentem Material prüfen wir die Scanbarkeit im Vorfeld.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland, DDP – Zoll und Einfuhr inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "Supplement-Etiketten",
        href: "/de/supplement-etiketten",
        description: "Etiketten mit Chargennummer und variabler Datenzone.",
      },
      {
        label: "Lebensmittel-Etiketten",
        href: "/de/lebensmittel-etiketten",
        description: "Produktetiketten mit integriertem EAN-Code.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/folienetiketten",
    slug: "folienetiketten",
    kind: "collection",
    title: "Folienetiketten drucken lassen",
    eyebrow: "Material",
    lead:
      "Folienetiketten aus PP auf Rolle – wasserfest, reißfest und beständiger als Papier. Opak oder transparent, für Produkte, die Feuchtigkeit, Abrieb oder Kühlung ausgesetzt sind.",
    heroBullets: [
      "Feste Pakete ab 179 € netto (1.000 Stück), 5.000 Stück für 479 € netto – inkl. Versand.",
      "Wasserfest und reißfest – PP-Folie statt aufweichendem Papier.",
      "Opak für Deckkraft, transparent für sichtbare Verpackung.",
    ],
    sidebarTitle: "Warum Folie",
    sidebarBullets: [
      "Wasser-, fett- und abriebbeständig",
      "Formstabil bei Kühlung und Feuchtigkeit",
      "Für Flaschen, Dosen, Tiegel und Beutel",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Folienetiketten gegen Papieretiketten",
        body: [
          "Folienetiketten aus PP bleiben bei Feuchtigkeit, Fett und Abrieb stabil – Papier weicht auf und reißt.",
          "Für Kühlschrank, Tiefkühlrand, Kosmetik und feuchte Lager sind Folienetiketten die robustere Wahl.",
        ],
      },
      {
        title: "Welche Folie wir einsetzen",
        body: [
          "Wir produzieren auf PP-Folie (Polypropylen) – prozesssicher für die Rollenverarbeitung und gut zu bedrucken.",
          "Opakes PP deckt vollständig ab, transparentes PP lässt die Verpackung sichtbar.",
        ],
      },
      {
        title: "Gestanzt auf Rolle",
        body: [
          "Die Folienetiketten werden gestanzt auf Rolle geliefert – für Spender und Etikettiermaschine.",
          "Standardformat 100×200 mm, andere Maße im Kalkulator frei wählbar.",
        ],
      },
    ],
    table: {
      title: "Folienmaterial im Überblick",
      lead: "Eigenschaften der PP-Folienetiketten.",
      columns: ["Eigenschaft", "PP-Folie", "Hinweis"],
      rows: [
        ["Wasserbeständig", "ja", "Auch bei Kondenswasser"],
        ["Reißfestigkeit", "hoch", "Formstabil in der Verarbeitung"],
        ["Optik", "opak oder transparent", "Matt oder glänzend, kein Aufpreis"],
        ["Lieferform", "gestanzt auf Rolle", "76-mm-Kern, Standardwicklung"],
      ],
    },
    faqs: [
      {
        question: "Was sind Folienetiketten?",
        answer:
          "Folienetiketten bestehen aus Kunststofffolie statt Papier. Wir setzen PP-Folie ein – wasserfest, reißfest und beständig gegen Fett und Abrieb.",
      },
      {
        question: "Was ist der Unterschied zu Papieretiketten?",
        answer:
          "Papier weicht bei Feuchtigkeit auf und reißt leichter. PP-Folie bleibt formstabil, auch im gekühlten oder feuchten Bereich – die robustere Wahl für viele Produktverpackungen.",
      },
      {
        question: "Gibt es Folienetiketten transparent und opak?",
        answer:
          "Ja. Opakes PP deckt vollständig ab, transparentes PP lässt die Verpackung sichtbar. Beide wählen Sie direkt im Kalkulator.",
      },
      {
        question: "Sind die Etiketten für Tiefkühlprodukte geeignet?",
        answer:
          "PP-Folie ist für übliche Kühl- und Lagerbedingungen geeignet. Für dauerhaften Tiefkühlbereich oder Spezialklebstoffe prüfen wir die Anwendung über ein Angebot.",
      },
      {
        question: "Wie lange dauert die Lieferung?",
        answer:
          "Typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung in Deutschland, DDP – Zoll und Einfuhr inklusive.",
      },
    ],
    relatedLinks: [
      {
        label: "PP vs. Papieretiketten",
        href: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
        description: "Materialvergleich: wann Folie die robustere Wahl ist.",
      },
      {
        label: "Lebensmittel-Etiketten",
        href: "/de/lebensmittel-etiketten",
        description: "Wasserfeste Folienetiketten für Lebensmittelverpackungen.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/etiketten-100x200",
    slug: "etiketten-100x200",
    kind: "product",
    title: "Etiketten 100×200 mm drucken",
    eyebrow: "Format",
    lead:
      "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.",
    heroBullets: [
      "Unser Standardformat für wiederkehrende Produktetiketten.",
      "Schnellere Vergleichbarkeit zwischen opak und transparent.",
      "Weniger operative Reibung als ein breites Maß-Sortiment.",
    ],
    sidebarTitle: "Warum dieses Format",
    sidebarBullets: [
      "Sinnvoll für wiederkehrende Standardverpackungen",
      "Einfacher Materialvergleich zwischen opak und transparent",
      "Klarer Ausgangspunkt für spätere Angebotsfälle",
    ],
    primaryCta: {
      label: "Preis berechnen",
      href: "/de/kalkulator?width=100&height=200",
    },
    secondaryCta: {
      label: "Transparente Variante berechnen",
      href: "/de/kalkulator?width=100&height=200&material=pp-transparent",
    },
    sections: [
      {
        title: "Standardisierung vor Variantenexplosion",
        body: [
          "Das Format 100×200 mm bündelt die Nachfrage auf eine gut steuerbare Standardgröße.",
          "Für Sonderformate bleibt der Angebotsprozess offen, ohne das Sortiment unnötig aufzublähen.",
        ],
      },
      {
        title: "Wann trotzdem ein Guide hilft",
        body: [
          "Gerade bei kleinen Marken ist weniger die Größe als die Material- und Mengenentscheidung unsicher. Genau dafür existieren die Vergleichsratgeber.",
        ],
      },
    ],
    faqs: [
      {
        question: "Für welche Verpackungen ist 100×200 mm sinnvoll?",
        answer:
          "Das Format passt vor allem zu Produktverpackungen, auf denen Pflichtangaben, Markenbild und Anwendungshinweise gut lesbar zusammenkommen müssen. Typische Fälle sind größere Dosen, Beutel, Flaschen oder Gläser mit klarer Front- oder Rückseitenfläche.",
      },
      {
        question: "Kann ich 100×200 mm in opak und transparent vergleichen?",
        answer:
          "Ja. Genau dafür ist diese Formatseite gedacht: Das Maß bleibt gleich, während Sie zwischen opakem PP für mehr Deckkraft und transparentem PP für sichtbarere Verpackungsoptik wählen.",
      },
      {
        question: "Welche Mengen gibt es für 100×200-mm-Etiketten?",
        answer:
          "Im Kalkulator Menge frei wählen – ab 1 bis 19.999 Stück direkt bestellbar. Ab 20.000 Stück oder bei mehreren Varianten fordern Sie ein individuelles Angebot an.",
      },
      {
        question: "Was passiert, wenn ich statt 100×200 mm ein anderes Format brauche?",
        answer:
          "Der Kalkulator unterstützt jedes Wunschformat – Breite bis 320 mm, Höhe frei wählbar. Passen Sie einfach die Maße im Kalkulator an und der Preis wird sofort neu berechnet.",
      },
    ],
    relatedLinks: [
      {
        label: "PP vs. Papier",
        href: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
        description:
          "Materialvergleich für wiederkehrende Produktetiketten im Standardformat.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/thermo-versandetiketten",
    slug: "thermo-versandetiketten",
    kind: "product",
    title: "Thermo-Versandetiketten 100×150 mm",
    eyebrow: "Zusatzprodukt",
    lead:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
    heroBullets: [
      "Bewusst als Zusatzprodukt positioniert und nicht als Hauptprodukt.",
      "Typisch für Versand, Lager und Fulfillment statt klassische Markenverpackung.",
      "Die Preise sind angebotsbasiert, da Menge und Anwendung stark variieren.",
    ],
    sidebarTitle: "Typische Einsätze",
    sidebarBullets: [
      "Versandetiketten 100×150 mm",
      "Logistik- und Lagerprozesse",
      "Zusatzprodukt für bestehende B2B-Kunden",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "PP-Rollenetiketten ansehen",
      href: "/de/pp-rollenetiketten",
    },
    packageHeading: "Zusatzprodukt statt Hauptprodukt",
    packageLead:
      "Thermoetiketten sind ein ergänzendes Produkt. Deshalb erfolgt die Preisgestaltung bewusst über ein individuelles Angebot.",
    packageTable: thermalPackageNotes,
    sections: [
      {
        title: "Warum Thermo nicht im Vordergrund steht",
        body: [
          "Thermoetiketten sind bewusst nicht unser primäres Produkt, sondern eine Ergänzung für bestehende Kunden.",
        ],
      },
      {
        title: "Wann Thermo sinnvoll ist",
        body: [
          "Wenn Versand, Lager oder Fulfillment im selben B2B-Kontext mitgedacht werden, sind Thermo-Versandetiketten eine logische Ergänzung.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich Thermoetiketten direkt online konfigurieren?",
        answer:
          "Aktuell nicht direkt online. Für konkrete Mengen führt der Weg über den Angebotsprozess.",
      },
    ],
    relatedLinks: [
      {
        label: "Glossar: Thermoetiketten",
        href: "/de/glossar/thermoetiketten",
        description:
          "Kurzdefinition für den Unterschied zwischen Thermoetiketten und PP-Rollenetiketten.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/musterbox",
    slug: "musterbox",
    kind: "service",
    title: "Etiketten Musterbox anfordern",
    eyebrow: "Musterbox",
    lead:
      "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
    heroBullets: [
      "Die Musterbox reduziert Materialunsicherheit vor größeren B2B-Bestellungen.",
      "Sie ist kein pauschales Gratis-Giveaway, sondern ein qualifizierender Zwischenschritt.",
      "Besonders sinnvoll bei Erstbestellungen oder wenn die Materialwirkung noch offen ist.",
    ],
    sidebarTitle: "Was die Musterbox klärt",
    sidebarBullets: [
      "Materialwirkung und Haptik",
      "Unterschied zwischen opak und transparent",
      "Nächster Schritt Richtung Angebot oder Erstbestellung",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
    },
    sections: [
      {
        title: "Was enthalten ist",
        body: [
          "Die Musterbox dient dazu, opake PP-Etiketten, transparente PP-Etiketten und Thermo-Beispiele im direkten Vergleich einzuordnen.",
        ],
      },
      {
        title: "Für wen sie gedacht ist",
        body: [
          "Die Musterbox ist für ernsthafte B2B-Anfragen gedacht, bei denen Material, Haptik oder Optik vor größeren Mengen geprüft werden sollen.",
        ],
      },
      {
        title: "Wie sie in den Prozess passt",
        body: [
          "Nach dem Mustervergleich führt der nächste sinnvolle Schritt meist in das Angebotsformular mit konkreter Menge, Materialwahl und Verpackungsangaben.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ist die Musterbox kostenlos?",
        answer:
          "Je nach Anfrage kann die Musterbox kostenpflichtig oder nur für qualifizierte B2B-Anfragen freigegeben werden.",
      },
      {
        question: "Kann ich danach ein Angebot anfordern?",
        answer:
          "Ja. Genau dafür ist die Musterbox gedacht: Material klären, dann den Angebotsprozess mit konkreteren Angaben starten.",
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/angebot-anfordern",
    slug: "angebot-anfordern",
    kind: "quote",
    title: "B2B-Angebot für Etiketten anfordern",
    eyebrow: "Angebot",
    lead:
      "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.",
    heroBullets: [
      "Geeignet für 20.000+ Stück, Sondergrößen, unklare Materialwahl oder wiederkehrende Abrufe.",
      "Der Prozess ist bewusst strukturiert und kein generisches Kontaktformular.",
      "Ohne Dateiupload: Für das erste Angebot reichen Material, Größe, Menge und Verpackung.",
    ],
    sidebarTitle: "Wann ein Angebot sinnvoll ist",
    sidebarBullets: [
      "Einstieg für größere Mengen und Sonderfälle",
      "Strukturierte Erfassung Ihrer Anfrage",
      "Verbindet Produktseiten, Musterbox und spätere Nachbestellung",
    ],
    sections: [
      {
        title: "Wann Sie das Formular nutzen sollten",
        body: [
          "Immer dann, wenn Ihre Menge, Verpackung oder Spezifikation über die festen Standardpakete hinausgeht.",
        ],
        bullets: ["20.000+ Stück", "Sondergrößen oder mehrere Varianten", "Unklare Materialentscheidung"],
      },
      {
        title: "Was nach der Anfrage passiert",
        body: [
          "Die Anfrage wird strukturiert erfasst, intern geprüft und als Grundlage für den nächsten Angebots- oder Rückfrage-Schritt verwendet.",
        ],
      },
      {
        title: "Noch unsicher beim Material?",
        body: [
          "Wenn Sie opake und transparente Varianten erst vergleichen möchten, ist die Musterbox der richtige Zwischenschritt vor dem finalen Angebot – Sie halten beide Materialien in der Hand.",
        ],
      },
    ],
    faqs: [
      {
        question: "Wann sollte ich ein individuelles Angebot anfordern?",
        answer:
          "Sobald Sie große Mengen, Sondergrößen oder mehrere Varianten planen, ist das Angebotsformular der richtige Startpunkt.",
      },
      {
        question: "Ist Rechnungskauf möglich?",
        answer:
          "Rechnungskauf ist für geprüfte Geschäftskunden auf Anfrage möglich. Diese Freigabe läuft manuell im Angebotsprozess und nicht über den Standard-Checkout.",
      },
      {
        question: "Kann ich zuerst eine Musterbox anfordern?",
        answer:
          "Ja. Wenn Material und Haptik noch offen sind, ist die Musterbox vor dem Angebot oft sinnvoller als ein vorschneller Mengenentscheid.",
      },
    ],
  },
  {
    path: "/de/nachbestellen",
    slug: "nachbestellen",
    kind: "service",
    title: "Etiketten nachbestellen",
    eyebrow: "Nachbestellung",
    lead:
      "Bestellen Sie freigegebene Etiketten später schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.",
    heroBullets: [
      "Gespeicherte Spezifikationen machen wiederkehrende Bestellungen für B2B-Marken wirtschaftlich.",
      "Material, Größe und Druckdaten sind gespeichert – bei jeder Folgebestellung keine Rückfragen.",
      "Wiederkehrende Abrufe laufen schneller als bei einem generischen Druckanbieter.",
    ],
    sidebarTitle: "Was gespeichert werden soll",
    sidebarBullets: [
      "Freigegebene Druckdaten",
      "Material, Größe und Stückzahl",
      "Wiederholbare Produktlogik für spätere Abrufe",
    ],
    primaryCta: quoteLink,
    secondaryCta: fileLink,
    sections: [
      {
        title: "Warum Nachbestellung so wichtig ist",
        body: [
          "Für viele Marken ist nicht die erste Bestellung der Haupthebel, sondern die verlässliche Wiederholung derselben Spezifikation zu einem späteren Zeitpunkt.",
        ],
      },
      {
        title: "Was die Nachbestellung leistet",
        body: [
          "Material, Größe und Druckdaten müssen nicht jedes Mal neu erklärt werden, sondern bleiben als freigegebene Basis erhalten.",
        ],
      },
      {
        title: "Welche Guide-Seite unterstützt das",
        body: [
          "Der Ratgeber zur Nachbestellung erklärt, welche Angaben bei wiederkehrenden Abrufen den größten Zeitgewinn bringen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich direkt online nachbestellen?",
        answer:
          "Ja. Im Kundenkonto können Sie jede frühere Bestellung direkt in den Kalkulator übernehmen – Format, Material und Menge werden vorausgefüllt. Druckdaten aus der letzten freigegebenen Version können wiederverwendet werden.",
      },
    ],
    relatedLinks: [
      {
        label: "Ratgeber",
        href: "/de/ratgeber",
        description:
          "Hub-Seite mit den freigegebenen Vergleichs- und Druckdaten-Guides.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/druckdaten",
    slug: "druckdaten",
    kind: "service",
    title: "Druckdaten für Etiketten einreichen",
    eyebrow: "Druckdaten",
    lead:
      "Welche Druckdaten für PP-Rollenetiketten akzeptiert werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung vor der Freigabe.",
    heroBullets: [
      "Das Angebotsformular funktioniert zunächst ohne Upload.",
      "Wir prüfen die erwarteten Formate technisch, bevor produziert wird.",
      "Klare Druckdatenregeln reduzieren Korrekturen vor späteren Nachbestellungen.",
    ],
    sidebarTitle: "Worauf wir achten",
    sidebarBullets: [
      "Saubere Formate und lesbare Schriften",
      "Klare Spezifikation zu Material und Etikettengröße",
      "Prüfbarkeit vor Freigabe und Wiederholung",
    ],
    primaryCta: quoteLink,
    secondaryCta: sampleLink,
    sections: [
      {
        title: "Welche Formate sinnvoll sind",
        body: [
          "PDF, AI, EPS, SVG, PNG, JPG oder ZIP können als Ausgangspunkt dienen. Für das erste Angebot reichen jedoch bereits strukturierte Angaben ohne Upload.",
        ],
      },
      {
        title: "Warum technische Prüfung wichtig ist",
        body: [
          "Geprüfte Druckdaten sichern nicht nur die erste Produktion, sondern auch die spätere Reproduzierbarkeit und Nachbestellung.",
        ],
      },
      {
        title: "Was im Guide vertieft wird",
        body: [
          "Die Schritt-für-Schritt-Anleitung im Ratgeber erklärt Beschnitt, Export und Proof im Detail.",
        ],
      },
    ],
    faqs: [
      {
        question: "Muss ich sofort eine Datei hochladen?",
        answer:
          "Nein. Für den ersten Schritt reichen oft Format, Material, Menge und Einsatzfall. Wenn die Datei noch nicht final ist, kann die Anfrage trotzdem starten und der Upload folgt später im passenden Prozessschritt.",
      },
      {
        question: "Was passiert, wenn meine Datei später korrigiert werden muss?",
        answer:
          "Dann greifen Datencheck, Rückfrage und Proof-Freigabe, bevor produziert wird. Ziel ist nicht, eine unfertige Datei blind weiterzureichen, sondern sie erst druckreif zu machen und danach als klare Basis für spätere Wiederholungen zu sichern.",
      },
    ],
    relatedLinks: [
      {
        label: "Ratgeber: Druckdaten vorbereiten",
        href: "/de/ratgeber/druckdaten-vorbereiten",
        description:
          "Schritt-für-Schritt-Erklärung von Format, Beschnitt, Export und Proof.",
      },
      {
        label: "Glossar: Beschnitt",
        href: "/de/glossar/beschnitt",
        description:
          "Kurze Definition für den Sicherheitsrand im Druckdatenprozess.",
      },
      {
        label: "Glossar: Proof",
        href: "/de/glossar/proof",
        description:
          "Erklärung des Freigabeschritts vor Produktion und Nachbestellung.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/produktion-versand",
    slug: "produktion-versand",
    kind: "service",
    title: "Produktion und Versand nach Deutschland",
    eyebrow: "Transparenz",
    lead:
      "Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland.",
    heroBullets: [
      "Wir legen die Lieferlogik offen, statt sie zu verstecken.",
      "Produktionsort, Versand und Lieferzeiten werden klar eingeordnet.",
      "Verbindliche rechtliche und steuerliche Details klären wir individuell pro Auftrag.",
    ],
    sidebarTitle: "Was wir hier offenlegen",
    sidebarBullets: [
      "Produktionsstandort",
      "Versand nach Deutschland",
      "Kommunikation für B2B-Erwartungen",
    ],
    primaryCta: {
      label: "Kontakt aufnehmen",
      href: "/de/kontakt",
    },
    secondaryCta: quoteLink,
    sections: [
      {
        title: "Warum wir den Produktionsort offen nennen",
        body: [
          "Unsere Etiketten werden in der Türkei produziert und an B2B-Kunden in Deutschland geliefert. Wir nennen das offen, weil es Ihre Kalkulation und Ihre Lieferzeit-Erwartung beeinflusst: Der Standort ermöglicht ein gutes Verhältnis aus Materialqualität und Preis, im Gegenzug planen Sie die Lieferung etwas großzügiger als bei einer rein lokalen Druckerei.",
        ],
      },
      {
        title: "Vor der Produktion: Prüfung und Freigabe",
        body: [
          "Bevor ein Auftrag in Produktion geht, prüfen wir Ihre Druckdaten und stellen Ihnen einen digitalen Proof bereit. Produziert wird erst nach Ihrer ausdrücklichen Freigabe – so vermeiden wir Fehldrucke, und die Lieferzeit beginnt mit der Freigabe, nicht schon mit der Bestellung.",
        ],
      },
      {
        title: "Versand nach Deutschland",
        body: [
          "Der Versand erfolgt gebündelt nach Deutschland; den Transport organisieren wir für Sie. Der im Kalkulator angezeigte Preis enthält den Versand innerhalb Deutschlands – besonders schwere oder sehr große Sendungen weisen wir gesondert aus.",
        ],
      },
      {
        title: "Lieferzeit als ehrliche Orientierung",
        body: [
          "Als ehrliche Orientierung gelten ca. 10–14 Werktage nach Ihrer Druckfreigabe (Produktion und Versand nach Deutschland); bei schweren oder sehr großen Sendungen kann es länger dauern. Das ist eine Richtgröße, keine bindende Garantie – ist ein Termin für Sie kritisch, stimmen wir ihn vor der Bestellung gemeinsam ab.",
        ],
      },
      {
        title: "Was wir nicht pauschal zusagen",
        body: [
          "Verbindliche rechtliche oder steuerliche Detailzusagen treffen wir nicht pauschal, sondern klären sie auftragsbezogen; Pflichtangaben auf dem Etikett liegen in Ihrer Verantwortung. Bei konkreten Fragen zu Ablauf, Lieferung oder Spezifikation nehmen Sie am besten direkt Kontakt mit uns auf.",
        ],
      },
    ],
  },
  {
    path: "/de/kontakt",
    slug: "kontakt",
    kind: "service",
    title: "Kontakt",
    eyebrow: "Kontakt",
    lead:
      "Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
    heroBullets: [
      "Kontakt ist der richtige Weg für Rückfragen, die noch kein vollständiges Angebotsformular brauchen.",
      "Für konkrete Mengen und Spezifikationen bleibt das Angebotsformular präziser.",
    ],
    sidebarTitle: "Wann Kontakt sinnvoll ist",
    sidebarBullets: [
      "Rückfragen vor der Anfrage",
      "Klärung zu Musterbox und Prozess",
      "Allgemeine B2B-Abstimmung",
    ],
    primaryCta: quoteLink,
    secondaryCta: sampleLink,
    sections: [
      {
        title: "Für konkrete Mengen lieber strukturiert anfragen",
        body: [
          "Sobald Material, Größe und Menge feststehen, ist das Angebotsformular besser als eine freie Kontaktanfrage.",
        ],
      },
      {
        title: "Für offene Punkte zuerst orientieren",
        body: [
          "Wenn Sie noch zwischen Material, Musterbox und Standardprodukt abwägen, helfen Ihnen unsere Produkt- und Serviceseiten beim nächsten Schritt.",
        ],
      },
    ],
    table: {
      title: "Schnelle Orientierung",
      lead: "Welche Seite passt zu welcher Absicht?",
      columns: ["Absicht", "Passender nächster Schritt"],
      rows: [
        ["Konkrete Menge und Spezifikation", "Angebot anfordern"],
        ["Material noch unklar", "Musterbox ansehen"],
        ["Druckdaten vorbereiten", "Druckdaten-Seite lesen"],
      ],
    },
  },
  {
    path: "/de/unternehmen",
    slug: "unternehmen",
    kind: "service",
    title: "Über Labelpilot.de",
    eyebrow: "Unternehmen",
    lead:
      "Labelpilot.de ist eine auf Deutschland fokussierte B2B-Plattform für PP-Rollenetiketten. Wir verbinden kosteneffiziente Produktion mit einem klaren Nachbestellsystem – offen über Produktion, Lieferung und Vertragspartner.",
    heroBullets: [
      "Spezialisiert auf PP-Rollenetiketten für Lebensmittel, Getränke und Supplemente.",
      "Produktion in der Türkei, Lieferung DDP nach Deutschland – Zoll und Einfuhr inklusive.",
      "Gespeicherte Druckdaten für Nachbestellungen ohne neue Abstimmung.",
    ],
    sidebarTitle: "Auf einen Blick",
    sidebarBullets: [
      "Fokus: PP-Rollenetiketten für Produktmarken",
      "Lieferung: DDP nach Deutschland",
      "Vertragspartner: Zhenkai Global Trading Limited",
    ],
    primaryCta: {
      label: "Jetzt konfigurieren",
      href: "/de/kalkulator",
    },
    secondaryCta: {
      label: "Musterbox anfordern",
      href: "/de/musterbox",
    },
    sections: [
      {
        title: "Worauf wir uns konzentrieren",
        body: [
          "Wir sind kein breiter Online-Druckshop, sondern auf bedruckte PP-Rollenetiketten für Produktmarken spezialisiert.",
          "Dieser schmale Fokus hält Material, Qualität und Nachbestellung überschaubar – statt eines unübersichtlichen Sortiments.",
        ],
      },
      {
        title: "Wo produziert wird",
        body: [
          "Die Produktion erfolgt über unseren Export- und Logistikpartner in der Türkei (Alfa Soylu Elektronik, Istanbul).",
          "Wir machen daraus kein Geheimnis und werben nicht mit einer deutschen Produktion – die Lieferung erfolgt transparent DDP nach Deutschland.",
        ],
      },
      {
        title: "Wie geliefert wird",
        body: [
          "Versand per Luftfracht mit DHL oder UPS, Lieferung DDP (Delivered Duty Paid).",
          "Zoll, Einfuhrumsatzsteuer und Importabwicklung sind im Preis enthalten – für Sie entstehen bei der Zustellung keine zusätzlichen Kosten.",
        ],
      },
      {
        title: "Warum ein Nachbestellsystem",
        body: [
          "Produktmarken bestellen dieselben Etiketten immer wieder. Genau dafür speichern wir freigegebene Druckdaten, Material und Format.",
          "Die nächste Auflage startet ohne neues Briefing und ohne erneutes Hochladen – das ist der Kern unseres Angebots.",
        ],
      },
      {
        title: "Wer der Vertragspartner ist",
        body: [
          "Vertragspartnerin ist die Zhenkai Global Trading Limited mit Sitz in Hongkong (Anschrift siehe Impressum).",
          "Zahlungen werden über Stripe abgewickelt. Anwendbares Recht für Bestellungen ist Deutschland.",
        ],
      },
    ],
    table: {
      title: "Transparenz auf einen Blick",
      lead: "Die wichtigsten Fakten ohne Beschönigung.",
      columns: ["Thema", "Stand"],
      rows: [
        ["Produktion", "Türkei (Partner: Alfa Soylu Elektronik, Istanbul)"],
        ["Lieferung", "DDP nach Deutschland, Zoll & Einfuhr inklusive"],
        ["Versand", "Luftfracht DHL / UPS mit Sendungsverfolgung"],
        ["Zahlung", "Stripe (Karte, SEPA); Rechnung auf Anfrage"],
        ["Vertragspartner", "Zhenkai Global Trading Limited, Hongkong"],
        ["Anwendbares Recht", "Deutschland"],
      ],
    },
    faqs: [
      {
        question: "Wo werden die Etiketten produziert?",
        answer:
          "Die Produktion erfolgt in der Türkei über unseren Logistikpartner Alfa Soylu Elektronik in Istanbul. Wir liefern DDP nach Deutschland – Zoll und Einfuhr sind inklusive.",
      },
      {
        question: "Werben Sie mit „Made in Germany“?",
        answer:
          "Nein. Wir produzieren in der Türkei und stellen das offen dar. Eine deutsche Produktion behaupten wir nicht.",
      },
      {
        question: "Wer ist mein Vertragspartner?",
        answer:
          "Vertragspartnerin ist die Zhenkai Global Trading Limited mit Sitz in Hongkong (Anschrift im Impressum). Zahlungen laufen über Stripe, anwendbares Recht ist Deutschland.",
      },
      {
        question: "Entstehen bei der Lieferung Zusatzkosten?",
        answer:
          "Nein. Die Lieferung erfolgt DDP – Zoll, Einfuhrumsatzsteuer und Importabwicklung sind bereits im Preis enthalten und entrichtet.",
      },
    ],
    relatedLinks: [
      {
        label: "Versand & Lieferung",
        href: "/de/versand",
        description: "DDP-Lieferung, Carrier und Lieferzeit im Detail.",
      },
      {
        label: "Impressum",
        href: "/de/impressum",
        description: "Vollständige Anbieterangaben und Vertragspartner.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/kaffee-etiketten",
    slug: "kaffee-etiketten",
    kind: "industry",
    title: "Kaffee-Etiketten drucken",
    eyebrow: "Branche",
    lead:
      "PP-Rollenetiketten für Kaffeebeutel und Kaffeemarken. Opake Etiketten für wiederkehrende Produktverpackungen in Deutschland.",
    heroBullets: [
      "Kaffeeverpackungen brauchen oft dichte Informationen auf kleinen Flächen.",
      "Beutel, Ventilverpackungen und wiederkehrende Sorten sprechen für ein robustes PP-Setup.",
      "Der Anwendungsfall unterscheidet sich klar von Honig- oder Flaschenetiketten.",
    ],
    sidebarTitle: "Typische Kaffee-Anwendungen",
    sidebarBullets: [
      "Kaffeebeutel mit wiederkehrenden Sorten",
      "Private-Label-Linien mit identischem Format",
      "Marken, die Lesbarkeit und Abriebfestigkeit priorisieren",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Opake PP ansehen",
      href: "/de/opake-pp-etiketten",
    },
    sections: [
      {
        title: "Warum Kaffee-Etiketten meist nicht generisch sind",
        body: [
          "Kaffeemarken arbeiten oft mit mehreren Röstungen, Herkunftsangaben und Pflichtinformationen, die auf relativ begrenzten Flächen gut lesbar bleiben müssen.",
          "Dadurch zählt bei Kaffee weniger ein schöner Konfigurator als eine wiederholbare Spezifikation, die über mehrere Sorten hinweg konsistent bleibt.",
        ],
      },
      {
        title: "Warum opakes PP hier oft vorne liegt",
        body: [
          "Kaffeebeutel haben häufig matte oder kraftige Oberflächen, auf denen klare Deckkraft wichtiger ist als ein transparenter Look.",
          "Opakes PP ist daher oft die pragmatische Wahl, wenn Sortennamen, Röstdaten oder Zubereitungshinweise zuverlässig lesbar bleiben müssen.",
        ],
      },
      {
        title: "Wo transparente Etiketten trotzdem sinnvoll sein können",
        body: [
          "Bei Doypacks mit Sichtfenster oder minimalistischen Premium-Linien kann transparentes PP sinnvoll werden, wenn das Produkt oder die Oberfläche bewusst sichtbar bleiben soll.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind Kaffee-Etiketten eher ein Beutel-Thema oder ein Material-Thema?",
        answer:
          "Beides. Der Beutel als Anwendungsfall bestimmt die Anforderungen, das Material entscheidet dann über Lesbarkeit, Optik und Wiederholbarkeit.",
      },
      {
        question: "Warum eher opakes PP als Flaschenetiketten für Kaffee?",
        answer:
          "Weil Kaffeeverpackungen vor allem mit Beuteln und dichten Informationsflächen verbunden sind, nicht mit transparenter Glasoptik.",
      },
    ],
    relatedLinks: [
      {
        label: "Opake PP-Etiketten",
        href: "/de/opake-pp-etiketten",
        description:
          "Materialseite für deckende Motive und stabile Lesbarkeit auf Beuteln.",
      },
      {
        label: "PP vs. Papier",
        href: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
        description:
          "Vergleich der Materiallogik für Feinkost-, Kaffee- und Dosenverpackungen.",
      },
      {
        label: "Druckdaten vorbereiten",
        href: "/de/ratgeber/druckdaten-vorbereiten",
        description:
          "Wichtig bei Sortenwechseln, mehrsprachigen Pflichtangaben und wiederkehrenden Layouts.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/gewuerz-etiketten",
    slug: "gewuerz-etiketten",
    kind: "industry",
    title: "Gewürz-Etiketten drucken",
    eyebrow: "Branche",
    lead:
      "PP-Rollenetiketten für Gewürzgläser, Beutel und Verpackungen. Mit gespeicherten Druckdaten für spätere Nachbestellungen.",
    heroBullets: [
      "Gewürz-Etiketten verbinden kleine Flächen mit hohem Informationsdruck.",
      "Viele Marken haben mehrere Sorten bei identischer Verpackung und ähnlichen Pflichtangaben.",
      "Der operative Fokus liegt auf Wiederholung und Lesbarkeit, nicht auf maximaler Designvielfalt.",
    ],
    sidebarTitle: "Typische Gewürz-Anforderungen",
    sidebarBullets: [
      "Kleine Gläser und Standbeutel",
      "Viele SKUs mit ähnlicher Struktur",
      "Regelmäßige Nachbestellung gleicher Formate",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Etiketten 100×200 mm",
      href: "/de/etiketten-100x200",
    },
    sections: [
      {
        title: "Der Unterschied zu Kaffee oder Honig",
        body: [
          "Gewürzsortimente leben oft von vielen Varianten mit ähnlicher Verpackung, nicht von wenigen Einzelprodukten. Dadurch ist verlässliche Wiederholung besonders wichtig.",
          "Wenn Inhaltsstoff- und Allergenhinweise auf kleinen Etiketten untergebracht werden müssen, wird die Druckdatenqualität fast genauso wichtig wie der Materialpreis.",
        ],
      },
      {
        title: "Warum Gläser und Beutel unterschiedlich ticken",
        body: [
          "Auf Gewürzgläsern zählt Rundung, Sichtbarkeit und Deckkraft. Bei Beuteln spielen Materialbewegung und Handling im Regal stärker hinein.",
          "Beide Verpackungstypen sind abgedeckt, mit Hinweisen zu Glas- und Beutel-nahen Themen statt einer pauschalen Einheitslösung.",
        ],
      },
      {
        title: "Wann die Musterbox Zeit spart",
        body: [
          "Wenn nicht klar ist, ob opak oder transparent auf der konkreten Gewürzverpackung besser wirkt, spart ein früher Materialvergleich unnötige Korrekturen vor größeren Mengen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind Gewürz-Etiketten eher ein Glas- oder ein Beutel-Thema?",
        answer:
          "Beides kommt vor. Deshalb verbinden wir konkrete Branchenbeispiele mit Material- und Verpackungsratgebern.",
      },
      {
        question: "Warum ist Nachbestellung bei Gewürzen so wichtig?",
        answer:
          "Viele Gewürzmarken haben viele wiederkehrende SKUs. Wenn Größe, Material und Druckdaten einmal festgelegt sind, wird jede weitere Sorte einfacher.",
      },
    ],
    relatedLinks: [
      {
        label: "Glossar: Rollenetiketten",
        href: "/de/glossar/rollenetiketten",
        description:
          "Begriffserklärung für wiederkehrende Produktionen mit vielen ähnlichen Varianten.",
      },
      {
        label: "Transparente vs. opake Etiketten",
        href: "/de/ratgeber/transparente-vs-opake-etiketten",
        description:
          "Hilft bei der Entscheidung zwischen Glaswirkung und klarer Deckkraft.",
      },
      {
        label: "Flaschenetiketten",
        href: "/de/flaschenetiketten",
        description:
          "Sinnvoller Vergleich, wenn das Gewürzsortiment in Mühlen oder Ölflaschen verkauft wird.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/honig-marmelade-etiketten",
    slug: "honig-marmelade-etiketten",
    kind: "industry",
    title: "Honig- und Marmeladenetiketten drucken",
    eyebrow: "Branche",
    lead:
      "Transparente und opake PP-Rollenetiketten für Honiggläser, Marmeladengläser und kleine Lebensmittelmarken.",
    heroBullets: [
      "Glas, Sichtbarkeit und handwerkliche Optik stehen hier stärker im Vordergrund als bei Kaffee oder Supplementen.",
      "Kleine Marken brauchen oft eine Balance zwischen hochwertiger Anmutung und reproduzierbaren Mengen.",
      "Gerade bei Glasoberflächen entscheidet das Material sichtbar über die Markenwirkung.",
    ],
    sidebarTitle: "Typische Verpackungen",
    sidebarBullets: [
      "Honiggläser",
      "Marmeladengläser",
      "Kleine Feinkost- oder Geschenkserien",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
    },
    sections: [
      {
        title: "Warum Glasoptik hier entscheidend ist",
        body: [
          "Honig- und Marmeladenetiketten leben stärker von Produktnähe, Glasoptik und Sichtbarkeit des Inhalts als viele andere Lebensmittel-Etiketten.",
          "Der Materialeffekt auf Glas zählt hier deutlich mehr als bei Supplement- oder Kaffeeverpackungen.",
        ],
      },
      {
        title: "Wann transparentes PP überzeugt",
        body: [
          "Wenn Honigfarbe, Marmeladenstruktur oder Glasform Teil der Markenwirkung sind, kann transparentes PP die Verpackung leichter und hochwertiger wirken lassen.",
        ],
      },
      {
        title: "Wann opak besser passt",
        body: [
          "Wenn Informationsdichte, Farbkontrast oder blickdichte Gestaltung wichtiger sind als Sichtbarkeit des Inhalts, bleibt opakes PP die kontrolliertere Wahl.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind transparente Etiketten für Honiggläser immer besser?",
        answer:
          "Nein. Sie passen oft gut zu naturbelassenen Glasoptiken, aber bei viel Text oder kontrastreichen Motiven kann opakes PP praktischer sein.",
      },
      {
        question: "Warum sind Flaschen- und Materialratgeber hier besonders relevant?",
        answer:
          "Weil die eigentliche Entscheidung meist nicht nur die Branche ist, sondern die sichtbare Verpackungsoberfläche aus Glas und der gewünschte Markeneindruck.",
      },
    ],
    relatedLinks: [
      {
        label: "Flaschenetiketten",
        href: "/de/flaschenetiketten",
        description:
          "Vergleich für alle Verpackungen, bei denen Glas und Sichtbarkeit dominieren.",
      },
      {
        label: "Transparente vs. opake Etiketten",
        href: "/de/ratgeber/transparente-vs-opake-etiketten",
        description:
          "Materialvergleich speziell für Glas, Dosen und sichtbare Oberflächen.",
      },
      {
        label: "Glossar: transparente Etiketten",
        href: "/de/glossar/transparente-etiketten",
        description:
          "Kurze Erklärung des Begriffs im Kontext von Glasverpackungen.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/flaschenetiketten",
    slug: "flaschenetiketten",
    kind: "industry",
    title: "Flaschenetiketten drucken",
    eyebrow: "Branche",
    lead:
      "Transparente und opake PP-Rollenetiketten für Flaschen, Getränke und Glasverpackungen in Deutschland.",
    heroBullets: [
      "Flaschenetiketten sind der stärkste Anwendungsfall für transparente PP-Oberflächen.",
      "Getränke, Glasoptik und gebogene Flächen stellen besondere Anforderungen an Material und Druck.",
      "Hier zahlt sich die Kombination aus Materialwahl und sorgfältiger Druckdatenvorbereitung besonders aus.",
    ],
    sidebarTitle: "Typische Flaschen-Situationen",
    sidebarBullets: [
      "Saft, Sirup und Getränke",
      "Öle, Essenzen und Feinkost in Glas",
      "Produkte mit sichtbarer Füllung und Markenoptik",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
    },
    sections: [
      {
        title: "Was Flaschenetiketten besonders macht",
        body: [
          "Bei Flaschenetiketten geht es konkreter zu als bei allgemeinen Getränkeverpackungen. Entscheidend ist die Materialwirkung auf runden Glas- oder Kunststoffoberflächen.",
          "Dabei zählen Sichtbarkeit, Rundung, Kontrast und Premium-Anmutung mehr als der reine Produktname.",
        ],
      },
      {
        title: "Transparenz als echte Kaufentscheidung",
        body: [
          "Bei Flaschen entscheidet transparentes PP oft darüber, ob das Produkt leicht, hochwertig oder möglichst nah an der Glasoberfläche wirkt.",
          "Opakes PP bleibt jedoch wichtig, wenn Inhaltsangaben, Barcodes oder Kontrast im Vordergrund stehen.",
        ],
      },
      {
        title: "Worauf im Druck geachtet werden sollte",
        body: [
          "Rundungen, Klebekante, Blickrichtung und Lesbarkeit auf gebogenen Flächen müssen im Dateiaufbau mitgedacht werden.",
          "Genau dabei helfen der Guide zur Druckdatenvorbereitung und die Erklärungen zu Proof und Beschnitt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind transparente Flaschenetiketten automatisch die beste Wahl?",
        answer:
          "Nein. Sie sind oft attraktiv, aber nicht automatisch die beste Lösung. Sobald Kontrast, Pflichtangaben oder starke Markenfarben dominieren, kann opakes PP besser passen.",
      },
      {
        question: "Warum ist der Materialvergleich bei Flaschen so wichtig?",
        answer:
          "Weil bei Flaschen die sichtbare Oberfläche das Kaufmotiv stark beeinflusst. Die Materialwahl ist hier kein Detail, sondern die zentrale Entscheidung.",
      },
    ],
    relatedLinks: [
      {
        label: "Transparente PP-Etiketten",
        href: "/de/transparente-pp-etiketten",
        description:
          "Produktseite für klare Optik auf Glas- und Flaschenverpackungen.",
      },
      {
        label: "Getränkeetiketten",
        href: "/de/getraenke-etiketten",
        description:
          "Übergreifende Branchen-Seite für Getränke, Gläser und Flaschen.",
      },
      {
        label: "Druckdaten vorbereiten",
        href: "/de/ratgeber/druckdaten-vorbereiten",
        description:
          "Schrittfolge für runde Oberflächen, Beschnitt und Proof-Freigabe.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/impressum",
    slug: "impressum",
    kind: "legal",
    title: "Impressum",
    eyebrow: "Rechtliches",
    lead: "Impressum von Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Anbieterkennzeichnung",
        body: [
          "Zhenkai Global Trading Limited",
          "Rechtsform: Limited Company (Private company limited by shares, Hongkong)",
          "Sitz und registrierte Anschrift: Unit 2A, 17/F, Glenealy Tower, No. 1 Glenealy, Central, Hong Kong",
          "HK Business Registration Number: 78363488",
          "Steuerlicher Hinweis: Keine USt-IdNr. – Unternehmen mit Sitz außerhalb der EU",
        ],
      },
      {
        title: "Kontaktangaben",
        body: [
          "E-Mail: kontakt@labelpilot.de",
          "Telefon: +852 35944334",
        ],
      },
      {
        title: "Verantwortlich für den Inhalt",
        body: ["Vertretungsberechtigte Person: Alperen Aydin"],
      },
    ],
  },
  {
    path: "/de/datenschutz",
    slug: "datenschutz",
    kind: "legal",
    title: "Datenschutzerklärung",
    eyebrow: "Rechtliches",
    lead: "Informationen zum Datenschutz bei Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Verantwortlicher",
        body: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
          "Zhenkai Global Trading Limited, Unit 2A, 17/F, Glenealy Tower, No. 1 Glenealy, Central, Hong Kong",
          "E-Mail: kontakt@labelpilot.de · Telefon: +852 35944334",
          "Vertreten durch: Alperen Aydin",
        ],
      },
      {
        title: "Grundsätze und Rechtsgrundlagen",
        body: [
          "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung der Website und zur Abwicklung Ihrer Anfragen und Bestellungen erforderlich ist.",
          "Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), lit. c DSGVO (rechtliche Verpflichtung) und lit. f DSGVO (berechtigtes Interesse an einem sicheren, funktionsfähigen Angebot).",
        ],
      },
      {
        title: "Bestellabwicklung und Druckdaten",
        body: [
          "Bei einer Bestellung verarbeiten wir Ihre Bestell-, Kontakt- und Lieferdaten zur Erfüllung des Vertrags (Art. 6 Abs. 1 lit. b DSGVO).",
          "Ihre hochgeladenen Druckdaten speichern wir zur technischen Prüfung und Produktion Ihres Auftrags.",
        ],
      },
      {
        title: "Kontakt- und Angebotsformulare",
        body: [
          "Wenn Sie ein Angebot oder eine Musterbox anfragen oder uns kontaktieren, verarbeiten wir die von Ihnen angegebenen Daten zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b und lit. f DSGVO).",
        ],
      },
      {
        title: "Zahlungsabwicklung (Stripe)",
        body: [
          "Zahlungen werden über den Zahlungsdienstleister Stripe abgewickelt. Ihre Zahlungsdaten werden dabei unmittelbar von Stripe verarbeitet; vollständige Kartendaten werden von uns nicht gespeichert.",
        ],
      },
      {
        title: "Hosting und IT-Dienstleister (Auftragsverarbeiter)",
        body: [
          "Hosting und Auslieferung der Website: Vercel Inc. (USA).",
          "Datenbank und Datei-Speicherung (u. a. Druckdaten): Supabase (Hosting auf Amazon Web Services).",
          "Versand von Transaktions-E-Mails: Resend (Versand über Amazon SES / Amazon Web Services).",
          "Mit diesen Dienstleistern bestehen Verträge zur Auftragsverarbeitung gemäß Art. 28 DSGVO.",
        ],
      },
      {
        title: "Übermittlung in Drittländer",
        body: [
          "Eine Verarbeitung findet unter anderem in den USA (Vercel, Amazon Web Services, Stripe) sowie in Hongkong (Verantwortlicher) statt.",
          "Soweit erforderlich, erfolgt die Übermittlung auf Grundlage geeigneter Garantien, insbesondere der Standardvertragsklauseln der EU-Kommission (Art. 46 DSGVO).",
        ],
      },
      {
        title: "Cookies und Einwilligung",
        body: [
          "Technisch notwendige Cookies setzen wir ohne Einwilligung ein, da sie für den Betrieb der Website erforderlich sind (§ 25 Abs. 2 TTDSG, Art. 6 Abs. 1 lit. f DSGVO). Dazu gehören das Speichern Ihrer Cookie-Auswahl sowie Anmelde- und Sicherheitsfunktionen im Kundenkonto.",
          "Zusätzliche Statistik-Funktionen aktivieren wir ausschließlich mit Ihrer vorherigen Einwilligung (§ 25 Abs. 1 TTDSG, Art. 6 Abs. 1 lit. a DSGVO). Beim ersten Besuch können Sie im Banner zustimmen oder ablehnen.",
          "Sie können Ihre Auswahl jederzeit ändern oder widerrufen – über den Link „Cookie-Einstellungen“ im Fußbereich der Website. Der Widerruf wirkt für die Zukunft.",
        ],
      },
      {
        title: "Reichweitenmessung (Statistik)",
        body: [
          "Mit Ihrer Einwilligung führen wir eine anonyme, eigene Reichweitenmessung durch (kein Drittanbieter-Tracking). Dabei wird im Browser eine zufällige Besucher-Kennung (Cookie „lp_vid“) gespeichert, um Seitenaufrufe und die Herkunft (z. B. Kampagnen-Parameter) zu erfassen und die Website zu verbessern.",
          "Wir speichern dabei keine vollständige IP-Adresse. Es wird lediglich ein grobes Herkunftsland sowie eine grobe Geräteklasse (Desktop, Tablet, Mobil) verarbeitet.",
          "Ohne Ihre Einwilligung findet keine Statistik-Erfassung statt; die Besucher-Kennung wird dann nicht gesetzt und bei einem Widerruf gelöscht.",
        ],
      },
      {
        title: "Speicherdauer",
        body: [
          "Wir speichern personenbezogene Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen (insbesondere handels- und steuerrechtliche Pflichten) dies vorsehen.",
        ],
      },
      {
        title: "Ihre Rechte",
        body: [
          "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch (Art. 21 DSGVO).",
          "Zudem haben Sie ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde.",
          "Zur Ausübung Ihrer Rechte genügt eine Nachricht an kontakt@labelpilot.de.",
        ],
      },
    ],
  },
  {
    path: "/de/agb",
    slug: "agb",
    kind: "legal",
    title: "Allgemeine Geschäftsbedingungen",
    eyebrow: "Rechtliches",
    lead: "Allgemeine Geschäftsbedingungen von Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Geltungsbereich und Vertragspartner",
        body: [
          "Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über Labelpilot.de.",
          "Vertragspartnerin ist Zhenkai Global Trading Limited (Anschrift siehe Impressum). Produktion und Versand erfolgen über unseren Export- und Logistikpartner in der Türkei.",
          "Das Angebot richtet sich an Verbraucher und Unternehmer.",
        ],
      },
      {
        title: "Vertragsschluss",
        body: [
          "Die Darstellung der Produkte stellt kein rechtlich bindendes Angebot dar. Mit Abschluss des Bestell- und Bezahlvorgangs geben Sie ein verbindliches Angebot zum Vertragsschluss ab.",
          "Der Vertrag kommt mit unserer Auftrags- bzw. Zahlungsbestätigung zustande.",
        ],
      },
      {
        title: "Preise und Zahlung",
        body: [
          "Es gelten die zum Zeitpunkt der Bestellung im Bestellprozess angegebenen Preise. Der Umsatzsteuer-Ausweis richtet sich nach den Angaben im Bestellprozess.",
          "Die Zahlung erfolgt per Kreditkarte über den Zahlungsdienstleister Stripe als Vorkasse vor Produktionsbeginn.",
        ],
      },
      {
        title: "Druckdaten, Freigabe und Mitwirkung",
        body: [
          "Der Kunde ist für die Richtigkeit und Rechtmäßigkeit der übermittelten Druckdaten und Inhalte verantwortlich, insbesondere für gesetzliche Pflichtangaben (z. B. Zutaten, Nährwerte, Allergene, Health Claims).",
          "Wir führen eine technische Dateiprüfung sowie einen digitalen Proof durch. Die Produktion beginnt erst nach Ihrer ausdrücklichen Freigabe. Eine inhaltlich-rechtliche Prüfung der Inhalte erfolgt nicht.",
        ],
      },
      {
        title: "Lieferung",
        body: [
          "Die Lieferung erfolgt ausschließlich innerhalb Deutschlands. Der Versand erfolgt aus der Türkei per DHL- oder UPS-Luftfracht.",
          "Die Lieferung erfolgt DDP (Delivered Duty Paid): Einfuhrumsatzsteuer und etwaige Zollabgaben sind im Preis enthalten; bei der Zustellung entstehen keine zusätzlichen Kosten.",
          "Die Lieferzeit beträgt in der Regel ca. 10–14 Werktage nach Ihrer Freigabe. Dies ist eine Orientierungsangabe, keine verbindliche Zustellgarantie.",
        ],
      },
      {
        title: "Eigentumsvorbehalt",
        body: [
          "Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.",
        ],
      },
      {
        title: "Gewährleistung und Reklamationen",
        body: [
          "Es gelten die gesetzlichen Mängelrechte. Reklamationen richten Sie bitte unter Angabe Ihrer Bestellnummer an kontakt@labelpilot.de.",
          "Bei individuell bedruckten Produkten sind herstellungs- und materialbedingte, handelsübliche Abweichungen (z. B. geringfügige Farb- oder Schnittabweichungen) möglich und stellen keinen Mangel dar.",
        ],
      },
      {
        title: "Haftung",
        body: [
          "Für Vorsatz und grobe Fahrlässigkeit haften wir unbeschränkt. Bei einfacher Fahrlässigkeit haften wir nur bei Verletzung einer wesentlichen Vertragspflicht und der Höhe nach begrenzt auf den vertragstypischen, vorhersehbaren Schaden.",
          "Die Haftung nach zwingenden gesetzlichen Vorschriften bleibt unberührt.",
        ],
      },
      {
        title: "Widerruf",
        body: [
          "Bei individuell nach Kundenvorgaben angefertigten Produkten besteht kein Widerrufsrecht. Für nicht individualisierte Standardprodukte gilt für Verbraucher das gesetzliche Widerrufsrecht. Einzelheiten finden Sie auf der Seite \"Widerruf und Sonderanfertigungen\".",
        ],
      },
      {
        title: "Streitbeilegung",
        body: [
          "Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr/",
          "Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        ],
      },
      {
        title: "Schlussbestimmungen",
        body: [
          "Es gilt das Recht der Bundesrepublik Deutschland. Zwingende Verbraucherschutzvorschriften des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.",
          "Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
        ],
      },
    ],
  },
  {
    path: "/de/versand",
    slug: "versand",
    kind: "legal",
    title: "Versandinformationen",
    eyebrow: "Rechtliches",
    lead: "Informationen zu Versand, Lieferung und Produktionsablauf bei Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Liefergebiet und Versandmodell",
        body: [
          "Liefergebiet: Deutschland.",
          "Produktion und Versand erfolgen aus der Türkei. Export- und Logistikpartner ist Alfa Soylu Elektronik, Istanbul.",
          "Versand per Luftfracht mit DHL oder UPS.",
          "Die Lieferung erfolgt DDP (Delivered Duty Paid): Einfuhrumsatzsteuer und etwaige Zollabgaben sind im Preis enthalten und bereits entrichtet. Bei der Zustellung entstehen für Sie keine zusätzlichen Kosten.",
        ],
      },
      {
        title: "Produktions- und Versandablauf",
        body: [
          "Nach Zahlungseingang und Freigabe Ihrer Druckdaten startet die Produktion.",
          "Der Versand erfolgt anschließend per DHL- oder UPS-Luftfracht.",
          "Nach dem Versand stellen wir Ihnen die Sendungsverfolgung bereit.",
        ],
      },
      {
        title: "Hinweise zu Lieferzeiten",
        body: [
          "Als Orientierung gilt: typisch 15–20 Werktage ab Zahlungseingang bis zur Lieferung an Ihre Adresse in Deutschland (Produktion und Versand zusammen, ohne Zollverzug).",
          "Maßgeblich für den Produktionsstart ist Ihre Proof-Freigabe. Es handelt sich um eine Orientierungsangabe, nicht um eine verbindliche Zustellgarantie.",
        ],
      },
    ],
  },
  {
    path: "/de/widerruf",
    slug: "widerruf",
    kind: "legal",
    title: "Widerruf und Sonderanfertigungen",
    eyebrow: "Rechtliches",
    lead: "Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Kein Widerrufsrecht bei Sonderanfertigungen",
        body: [
          "Unsere individuell nach Ihren Vorgaben bedruckten Etiketten sind Sonderanfertigungen. Das Widerrufsrecht ist gemäß § 312g Abs. 2 Nr. 1 BGB ausgeschlossen, da die Ware nach Kundenspezifikation angefertigt und eindeutig auf Ihre persönlichen Bedürfnisse zugeschnitten ist.",
          "Mit Ihrer Druckfreigabe stimmen Sie dem Beginn der Produktion ausdrücklich zu.",
        ],
      },
      {
        title: "Widerrufsrecht für Standardprodukte (Verbraucher)",
        body: [
          "Soweit Sie Verbraucher sind und ein nicht individualisiertes Standardprodukt (z. B. eine Musterbox) bestellen, steht Ihnen ein gesetzliches Widerrufsrecht zu.",
          "Widerrufsfrist: vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Ware in Besitz genommen haben.",
          "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Zhenkai Global Trading Limited, kontakt@labelpilot.de) mittels einer eindeutigen Erklärung über Ihren Entschluss informieren. Zur Wahrung der Frist genügt die rechtzeitige Absendung der Mitteilung.",
          "Folgen des Widerrufs: Im Falle eines wirksamen Widerrufs erstatten wir alle erhaltenen Zahlungen unverzüglich, spätestens binnen vierzehn Tagen.",
        ],
      },
      {
        title: "Muster-Widerrufsformular",
        body: [
          "(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
          "An: Zhenkai Global Trading Limited, kontakt@labelpilot.de",
          "Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren:",
          "Bestellt am / erhalten am: __________",
          "Name des/der Verbraucher(s): __________",
          "Anschrift des/der Verbraucher(s): __________",
          "Datum und Unterschrift (nur bei Mitteilung auf Papier): __________",
        ],
      },
      {
        title: "Reklamationen und Mängel",
        body: [
          "Unabhängig vom Widerrufsrecht bestehen Ihre gesetzlichen Gewährleistungsrechte bei Mängeln der Ware.",
          "Reklamationen richten Sie bitte unter Angabe Ihrer Bestellnummer an kontakt@labelpilot.de.",
        ],
      },
    ],
  },
];

const guidePages: PublicPageData[] = [
  {
    path: "/de/ratgeber/pp-etiketten-vs-papieretiketten",
    slug: "pp-etiketten-vs-papieretiketten",
    kind: "guide",
    title: "PP-Etiketten vs. Papieretiketten",
    eyebrow: "Ratgeber",
    lead:
      "Vergleich von PP-Etiketten und Papieretiketten für Produktverpackungen. Mit Empfehlung für Lebensmittel-, Getränke- und Supplement-Marken.",
    heroBullets: [
      "Dieser Guide erklärt nicht nur Materialnamen, sondern echte Einsatzgrenzen im deutschen B2B-Alltag.",
      "PP ist nicht automatisch immer besser, aber bei Feuchtigkeit, Abrieb und Wiederholung oft klar robuster.",
      "Die Entscheidung hängt stärker an Verpackung und Prozess als an reiner Preiswahrnehmung.",
    ],
    sidebarTitle: "Dieser Guide hilft bei",
    sidebarBullets: [
      "Materialwahl für wiederkehrende Produktetiketten",
      "Abwägung zwischen Robustheit und klassischer Papieroptik",
      "Früher Einordnung, wann ein B2B-Angebot sinnvoller ist als Trial-and-Error",
    ],
    primaryCta: quoteLink,
    secondaryCta: sampleLink,
    sections: [
      {
        title: "Wann Papier im Gespräch bleibt",
        body: [
          "Papieretiketten können optisch passend sein, wenn eine bewusst natürliche, matte oder handwerkliche Anmutung gesucht wird und die Verpackung wenig Feuchtigkeit oder Reibung abbekommt.",
          "Für kleine Serien ohne hohen Belastungsgrad kann Papier daher emotional attraktiv wirken, selbst wenn es operativ nicht immer die robusteste Lösung ist.",
        ],
      },
      {
        title: "Wann PP die pragmatische Wahl ist",
        body: [
          "PP ist die bessere Wahl, wenn Etiketten exakt reproduzierbar bleiben müssen, regelmäßig nachbestellt werden oder mit Feuchtigkeit, Kühlung und Abrieb in Berührung kommen.",
          "Gerade für Lebensmittel, Getränke und Supplemente ist diese operative Stabilität oft wichtiger als ein theoretisch günstigerer Ersteindruck.",
        ],
      },
      {
        title: "Der eigentliche Entscheidungshebel",
        body: [
          "Die sinnvollste Frage lautet meist nicht 'Was ist billiger?', sondern 'Welches Material reduziert spätere Probleme bei Sichtbarkeit, Lagerung und Nachbestellung?'.",
          "Wer wiederkehrende Chargen plant, spart mit einem robusteren Material oft mehr Zeit als mit einem minimal niedrigeren Einstiegspreis.",
        ],
      },
      {
        title: "Praktische Empfehlung für die ersten Gespräche",
        body: [
          "Wenn Verpackung, Oberfläche und Einsatzumgebung noch unklar sind, ist die Musterbox der bessere Start als eine voreilige Materialentscheidung.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind PP-Etiketten grundsätzlich hochwertiger als Papieretiketten?",
        answer:
          "Nicht grundsätzlich. Sie wirken anders und sind oft robuster. Ob sie hochwertiger erscheinen, hängt stark von Verpackung, Oberfläche und Markenbild ab.",
      },
      {
        question: "Wann sollte ich PP trotz höherem Einstieg bevorzugen?",
        answer:
          "Wenn Feuchtigkeit, Abrieb, Kühlung oder wiederkehrende Nachbestellungen eine wichtige Rolle spielen, ist PP oft die risikoärmere Wahl.",
      },
    ],
    relatedLinks: [
      {
        label: "Opake PP-Etiketten",
        href: "/de/opake-pp-etiketten",
        description:
          "Produktseite für den häufigsten PP-Standard mit klarer Deckkraft.",
      },
      {
        label: "Lebensmitteletiketten",
        href: "/de/lebensmittel-etiketten",
        description:
          "Branchenkontext, in dem Materialrobustheit häufig wichtiger als Papieroptik wird.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/ratgeber/transparente-vs-opake-etiketten",
    slug: "transparente-vs-opake-etiketten",
    kind: "guide",
    title: "Transparente vs. opake Etiketten",
    eyebrow: "Ratgeber",
    lead:
      "Vergleich transparenter und opaker PP-Etiketten für Flaschen, Gläser, Dosen und Produktverpackungen.",
    heroBullets: [
      "Der Unterschied ist nicht nur optisch, sondern strategisch: Sichtbarkeit des Produkts gegen kontrollierte Deckkraft.",
      "Gerade bei Flaschen und Gläsern kann dieselbe Verpackung mit anderem Material völlig anders wirken.",
      "Die beste Wahl ergibt sich aus Verpackungsoberfläche, Informationsdichte und Markenstil.",
    ],
    sidebarTitle: "Typische Fragen",
    sidebarBullets: [
      "Wann wirkt transparent hochwertiger?",
      "Wann ist opak die sicherere Wahl?",
      "Wie spielt Glas, Beutel oder Dose in die Materialwahl hinein?",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Flaschenetiketten ansehen",
      href: "/de/flaschenetiketten",
    },
    sections: [
      {
        title: "Transparenz ist kein Selbstzweck",
        body: [
          "Transparente Etiketten wirken dann stark, wenn Verpackung, Füllung oder Oberfläche sichtbar bleiben sollen und das Produkt selbst Teil des Designs ist.",
          "Ohne diese gestalterische Funktion kann Transparenz schnell weniger Mehrwert bieten als gedacht.",
        ],
      },
      {
        title: "Warum opak oft kontrollierbarer ist",
        body: [
          "Opake Etiketten geben deutlich mehr Sicherheit bei Kontrast, Typografie und Pflichtangaben. Sie sind daher oft die bessere Lösung, wenn Informationen schnell erfassbar bleiben müssen.",
          "Besonders auf kleinen Verpackungen oder bei vielen Textbausteinen ist diese Kontrolle mehr wert als eine theoretisch elegantere Optik.",
        ],
      },
      {
        title: "Flasche, Glas, Beutel und Dose ticken unterschiedlich",
        body: [
          "Auf Glas und Flaschen kann transparente Optik sehr stark wirken. Auf Beuteln und matten Oberflächen ist opak oft verlässlicher, weil der Untergrund stärker mit dem Motiv arbeitet.",
          "Dosen liegen meist zwischen beiden Welten: Premium-Marken nutzen Transparenz gezielt, informationslastige Linien bleiben oft opak.",
        ],
      },
      {
        title: "Wie man ohne Bauchgefühl entscheidet",
        body: [
          "Wenn der Unterschied nicht klar ist, sollte die Materialfrage nicht nur über Renderings entschieden werden. Eine Musterbox oder ein konkreter Verpackungsvergleich spart spätere Korrekturen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind transparente Etiketten automatisch besser für Flaschen?",
        answer:
          "Nein. Sie sind oft passend, aber nicht automatisch besser. Wenn Lesbarkeit, Kontrast oder Pflichtangaben dominieren, kann opak sinnvoller sein.",
      },
      {
        question: "Wann sollte ich beide Varianten nebeneinander prüfen?",
        answer:
          "Vor allem dann, wenn Glas, Füllfarbe oder ein Premium-Look eine große Rolle spielen und noch unklar ist, wie stark die Verpackung selbst sichtbar bleiben soll.",
      },
    ],
    relatedLinks: [
      {
        label: "Transparente PP-Etiketten",
        href: "/de/transparente-pp-etiketten",
        description:
          "Produktseite mit klarer Preisstaffel für transparente PP-Varianten.",
      },
      {
        label: "Opake PP-Etiketten",
        href: "/de/opake-pp-etiketten",
        description:
          "Produktseite für deckende Motive und informationsstarke Layouts.",
      },
      {
        label: "Honig- und Marmeladenetiketten",
        href: "/de/honig-marmelade-etiketten",
        description:
          "Branchenseite, bei der Glasoptik und Sichtbarkeit des Inhalts besonders wichtig sind.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/ratgeber/rollenetiketten-vs-bogenetiketten",
    slug: "rollenetiketten-vs-bogenetiketten",
    kind: "guide",
    title: "Rollenetiketten vs. Bogenetiketten",
    eyebrow: "Ratgeber",
    lead:
      "Wann Rollenetiketten für B2B-Produktmarken sinnvoller sind als Bogenetiketten – besonders bei wiederkehrenden Bestellungen.",
    heroBullets: [
      "Dieser Vergleich ist prozessbezogen, nicht nur materialbezogen.",
      "Rollenetiketten spielen ihre Stärke vor allem bei Wiederholung, Handling und größerer Bestelllogik aus.",
      "Bogenetiketten können für Sonderfälle oder kleine interne Läufe sinnvoll sein, sind aber kein gleichwertiger Ersatz für skalierbare Produktserien.",
    ],
    sidebarTitle: "Die Entscheidung hängt ab von",
    sidebarBullets: [
      "Wiederholungsrate der Bestellungen",
      "Etikettierprozess und Handling",
      "Skalierungsziel der Marke",
    ],
    primaryCta: quoteLink,
    secondaryCta: {
      label: "PP-Rollenetiketten ansehen",
      href: "/de/pp-rollenetiketten",
    },
    sections: [
      {
        title: "Warum wir Rollenetiketten priorisieren",
        body: [
          "Unser gesamtes Angebot ist auf wiederkehrende Produktetiketten ausgelegt, nicht auf vereinzelte Ad-hoc-Ausdrucke. Rollenetiketten passen deshalb besser dazu als Bogenetiketten.",
          "Sie ermöglichen reproduzierbare Produktion, verlässliche Nachbestellungen und eine feste Materialspezifikation.",
        ],
      },
      {
        title: "Wann Bogenetiketten trotzdem Sinn machen",
        body: [
          "Bogenetiketten können für interne Tests, sehr kleine Einzelserien oder spezifische Büroprozesse geeignet sein.",
          "Für Marken, die regelmäßig dieselbe Verpackung fahren, lösen sie aber selten das Kernproblem der skalierbaren Wiederholung.",
        ],
      },
      {
        title: "Der operative Unterschied",
        body: [
          "Rollenetiketten sind nicht nur ein anderes Trägermedium, sondern ein anderes Prozessversprechen: wiederholbar, strukturierter und klarer auf Serienproduktion ausgelegt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind Rollenetiketten nur für große Mengen sinnvoll?",
        answer:
          "Nein. Auch wiederkehrende kleinere Mengen profitieren davon, wenn dieselbe Spezifikation erhalten bleibt.",
      },
      {
        question: "Warum tauchen Bogenetiketten nicht als eigenes Hauptprodukt auf?",
        answer:
          "Weil wir uns gezielt auf PP-Rollenetiketten und wiederkehrende B2B-Bestellungen konzentrieren.",
      },
    ],
    relatedLinks: [
      {
        label: "Glossar: Rollenetiketten",
        href: "/de/glossar/rollenetiketten",
        description:
          "Kurze Definition des Begriffs und warum er für Wiederholbarkeit wichtig ist.",
      },
      {
        label: "Etiketten nachbestellen",
        href: "/de/nachbestellen",
        description:
          "Serviceseite zur Logik hinter gespeicherten Spezifikationen und Nachbestellungen.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/ratgeber/druckdaten-vorbereiten",
    slug: "druckdaten-vorbereiten",
    kind: "guide",
    title: "Druckdaten für Etiketten vorbereiten",
    eyebrow: "Ratgeber",
    lead:
      "So bereiten Sie Druckdaten für PP-Rollenetiketten vor. Formate, Beschnitt, Proof und technische Dateiprüfung erklärt.",
    heroBullets: [
      "Konkrete Schritt-für-Schritt-Anleitung für druckfertige Etikettendaten.",
      "Erklärt nicht nur Dateiformate, sondern warum Beschnitt und Proof für wiederholbare Nachbestellungen entscheidend sind.",
      "Ergänzt die Druckdaten-Übersicht um konkrete Arbeitsschritte.",
    ],
    sidebarTitle: "Worauf sich der Guide fokussiert",
    sidebarBullets: [
      "Dateiformat",
      "Etikettengröße und Beschnitt",
      "Export, Proof und spätere Wiederverwendung",
    ],
    primaryCta: quoteLink,
    secondaryCta: fileLink,
    howToSteps: [
      "Dateiformat wählen",
      "Etikettengröße prüfen",
      "Beschnitt anlegen",
      "Datei exportieren",
      "Proof prüfen",
      "Druckdatei für Wiederholungen richtig speichern",
    ],
    sections: [
      {
        title: "1. Das richtige Ausgangsformat wählen",
        body: [
          "Vektordaten wie PDF, AI oder EPS sind für viele Produktetiketten der zuverlässigste Start, weil Schriften, Kanten und Skalierung stabil bleiben.",
          "Rasterformate eignen sich nur, wenn Auflösung (mind. 300 dpi) und Farbraum stimmen.",
        ],
      },
      {
        title: "2. Größe und Beschnitt nicht als Nebensache behandeln",
        body: [
          "Eine Datei ist nicht automatisch druckreif, nur weil das Motiv gut aussieht. Ohne korrekte Größe und Beschnitt entstehen schnell unsaubere Kanten, verschobene Elemente oder unnötige Rückfragen.",
          "Beschnitt ist kein abstrakter Druckbegriff, sondern ein Sicherheitspuffer für wiederholbare Produktion.",
        ],
      },
      {
        title: "3. Proof als Freigabeschritt verstehen",
        body: [
          "Der Proof ist kein optionales Bürodetail, sondern der Moment, in dem Lesbarkeit, Text und Positionierung ein letztes Mal geprüft werden.",
          "Gerade bei wiederkehrenden Bestellungen spart ein freigegebener Proof später Zeit, weil dieselbe Basis weiterverwendet werden kann.",
        ],
      },
      {
        title: "4. Für spätere Nachbestellungen mitdenken",
        body: [
          "Wenn Dateinamen, Versionen und Spezifikationen schon bei der ersten Freigabe gut organisiert sind, werden Folgeaufträge wesentlich einfacher.",
        ],
      },
    ],
    faqs: [
      {
        question: "Welche Datei ist für den Start am sichersten?",
        answer:
          "Meist ein korrekt exportiertes PDF oder eine vergleichbare Vektordatei, weil Größe, Kanten und Schriften stabiler bleiben.",
      },
      {
        question: "Warum wird Beschnitt so stark betont?",
        answer:
          "Weil viele Probleme nicht aus dem Motiv selbst entstehen, sondern aus fehlendem Sicherheitsrand im Export.",
      },
    ],
    relatedLinks: [
      {
        label: "Druckdaten",
        href: "/de/druckdaten",
        description:
          "Übersichtsseite mit den zulässigen Formaten und der Rolle der technischen Prüfung.",
      },
      {
        label: "Glossar: Beschnitt",
        href: "/de/glossar/beschnitt",
        description:
          "Kurze Definition des Begriffs im direkten Druckdatenkontext.",
      },
      {
        label: "Glossar: Proof",
        href: "/de/glossar/proof",
        description:
          "Erklärung, warum der Proof-Schritt vor Freigabe und Nachbestellung wichtig bleibt.",
      },
      ...guideCommercialLinks,
    ],
  },
];

const glossaryHubPage: PublicPageData = {
  path: "/de/glossar",
  slug: "glossar",
  kind: "hub",
  title: "Glossar für Etikettenbegriffe",
  eyebrow: "Glossar",
  lead:
    "Kurze, klare Erklärungen zu Begriffen rund um PP-Rollenetiketten, Druckdaten, Proof und Nachbestellung.",
  heroBullets: [
    "Jeder Begriff ist kurz, präzise und auf reale Kauf- und Produktionsentscheidungen bezogen.",
    "Fachbegriffe statt Marketing-Sprache – damit Rückfragen im Support schneller geklärt sind.",
    "Jeder Begriff führt zurück zu den passenden Produkt- und Ratgeberseiten.",
  ],
  sidebarTitle: "Das Glossar hilft bei",
  sidebarBullets: [
    "schneller Einordnung von Fachbegriffen",
    "klaren, knappen Definitionen",
    "Verbindungen zu Produkt-, Ratgeber- und Angebotsseiten",
  ],
  primaryCta: {
    label: "Ratgeber öffnen",
    href: "/de/ratgeber",
  },
  secondaryCta: {
    label: "PP-Rollenetiketten ansehen",
    href: "/de/pp-rollenetiketten",
  },
  sections: [
    {
      title: "Warum ein Glossar im B2B-Etikettenkontext sinnvoll ist",
      body: [
        "Viele Rückfragen drehen sich nicht um Preise, sondern um Begriffe wie Proof, Beschnitt, Rollenetiketten oder Druckdaten. Ein gutes Glossar verkürzt diesen Weg.",
        "Bei der Materialwahl und im Support helfen klare Definitionen mehr als vage Marketingtexte.",
      ],
    },
    {
      title: "Wie das Glossar genutzt werden sollte",
      body: [
        "Die Begriffe sind bewusst knapp gehalten und verlinken immer zurück in kommerzielle oder erklärende Seiten. Sie sollen Orientierung liefern, nicht den Kaufprozess ersetzen.",
      ],
    },
  ],
  hubLinks: [],
  faqs: [
    {
      question: "Warum ist das Glossar so knapp formuliert?",
      answer:
        "Weil es schnelle Begriffsorientierung liefern soll. Vertiefende Einordnung findet auf Produkt-, Branchen- und Guide-Seiten statt.",
    },
    {
      question: "Sind alle Druckbegriffe enthalten?",
      answer:
        "Nein. Das Glossar deckt gezielt die Begriffe ab, die für die Materialwahl, Druckdaten und Nachbestellung am wichtigsten sind.",
    },
  ],
  relatedLinks: guideCommercialLinks,
};

const glossaryPages: PublicPageData[] = [
  {
    path: "/de/glossar/pp-etiketten",
    slug: "pp-etiketten",
    kind: "glossary",
    title: "Was sind PP-Etiketten?",
    eyebrow: "Glossar",
    lead:
      "PP-Etiketten kurz erklärt: Material, Einsatzbereiche und Relevanz für Produktverpackungen und Rollenetiketten.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "PP = Polypropylen",
      "robust gegen Feuchtigkeit und Abrieb",
      "typisch für wiederkehrende Produktetiketten",
    ],
    glossaryData: {
      term: "PP-Etiketten",
      definition:
        "PP-Etiketten sind Etiketten aus Polypropylen, die häufig für Produktverpackungen und Rollenetiketten verwendet werden.",
      whenItMatters:
        "Wenn Etiketten Feuchtigkeit, Reibung oder wiederkehrende Produktion besser aushalten sollen als einfache Papierlösungen.",
      exampleUse:
        "Lebensmittel-, Getränke- und Supplement-Marken nutzen PP oft für wiederkehrende Produktserien.",
      relatedProduct: "Opake oder transparente PP-Rollenetiketten 100×200 mm",
    },
    sections: [
      {
        title: "Was PP im Etikettenalltag bedeutet",
        body: [
          "PP steht im Etikettenkontext für Polypropylen. Gemeint ist damit ein Material, das im Vergleich zu einfachen Papierlösungen häufig robuster und prozesssicherer ist.",
        ],
      },
      {
        title: "Wann der Begriff praktisch relevant wird",
        body: [
          "Sobald Etiketten auf Flaschen, Gläsern, Dosen oder wiederkehrenden Produktlinien eingesetzt werden, taucht die Materialfrage fast automatisch auf.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/rollenetiketten",
    slug: "rollenetiketten",
    kind: "glossary",
    title: "Was sind Rollenetiketten?",
    eyebrow: "Glossar",
    lead:
      "Rollenetiketten kurz erklärt: warum sie für wiederkehrende Produktetiketten, B2B-Prozesse und Nachbestellungen relevant sind.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "Etiketten auf Rolle statt auf Bogen",
      "stärker auf Wiederholung ausgelegt",
      "wichtig für strukturierte Nachbestellungen",
    ],
    glossaryData: {
      term: "Rollenetiketten",
      definition:
        "Rollenetiketten sind Etiketten, die auf einer Rolle statt auf einzelnen Bögen geliefert und verarbeitet werden.",
      whenItMatters:
        "Wenn wiederkehrende Bestellungen, zuverlässige Etikettierung und skalierbare Produktprozesse wichtiger werden.",
      exampleUse:
        "Produktetiketten für Lebensmittel, Getränke und Supplemente in wiederkehrenden Chargen.",
      relatedProduct: "PP-Rollenetiketten für deutsche B2B-Marken",
    },
    sections: [
      {
        title: "Warum Rollenetiketten mehr als ein Format sind",
        body: [
          "Der Begriff beschreibt nicht nur die Form der Lieferung, sondern einen ganzen Prozessansatz: wiederholbar, strukturierter und näher an Serienproduktion.",
        ],
      },
      {
        title: "Wann der Unterschied zu Bogenetiketten zählt",
        body: [
          "Wenn Marken dieselbe Spezifikation regelmäßig wiederholen oder eine verlässlichere Nachbestellung brauchen, sind Rollenetiketten sinnvoller als Bogenetiketten.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/transparente-etiketten",
    slug: "transparente-etiketten",
    kind: "glossary",
    title: "Was sind transparente Etiketten?",
    eyebrow: "Glossar",
    lead:
      "Transparente Etiketten kurz erklärt: Materialwirkung, Sichtbarkeit und Einsatz bei Flaschen, Gläsern und Premium-Verpackungen.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "sichtbare Oberfläche bleibt erhalten",
      "oft für Glas und Flaschen relevant",
      "nicht automatisch immer die bessere Wahl",
    ],
    glossaryData: {
      term: "Transparente Etiketten",
      definition:
        "Transparente Etiketten lassen Teile der Verpackung oder des Inhalts sichtbar und wirken dadurch oft reduzierter oder hochwertiger.",
      whenItMatters:
        "Vor allem bei Glas, Flaschen und sichtbarer Produktoptik, wenn die Verpackung selbst Teil des Designs sein soll.",
      exampleUse:
        "Getränkeflaschen, Honiggläser oder Premium-Dosen mit bewusst sichtbarer Oberfläche.",
      relatedProduct: "Transparente PP-Rollenetiketten 100×200 mm",
    },
    sections: [
      {
        title: "Was der Begriff in der Praxis meint",
        body: [
          "Transparent bedeutet nicht einfach nur durchsichtig. Entscheidend ist, dass die Verpackungsoberfläche sichtbar bleibt und Teil der visuellen Wirkung wird.",
        ],
      },
      {
        title: "Wann Transparenz an Grenzen stößt",
        body: [
          "Wenn viele Pflichtangaben, Barcodes oder starker Kontrast nötig sind, kann ein opakes Material kontrollierbarer und lesbarer bleiben.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/thermoetiketten",
    slug: "thermoetiketten",
    kind: "glossary",
    title: "Was sind Thermoetiketten?",
    eyebrow: "Glossar",
    lead:
      "Thermoetiketten kurz erklärt: Einsatz in Versand, Lager und Fulfillment – und warum sie nur als Zusatzprodukt auftreten.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "für Versand und Logistik",
      "nicht das Hauptprodukt",
      "andere Rolle als PP-Rollenetiketten",
    ],
    glossaryData: {
      term: "Thermoetiketten",
      definition:
        "Thermoetiketten sind Etiketten für Versand-, Lager- oder Logistikprozesse und haben eine andere Rolle als klassische Produktetiketten.",
      whenItMatters:
        "Wenn Versand, Lagerung oder Fulfillment gemeinsam mit Produktetiketten betrachtet werden.",
      exampleUse:
        "Versandetiketten 100×150 mm für Paket- und Lagerprozesse.",
      relatedProduct: "Thermo-Versandetiketten als ergänzendes Zusatzprodukt",
    },
    sections: [
      {
        title: "Warum Thermo ein anderer Produkttyp ist",
        body: [
          "Thermoetiketten erfüllen meist operative Logistikzwecke. Sie stehen nicht im Zentrum der Markenwirkung wie PP-Produktetiketten.",
        ],
      },
      {
        title: "Warum der Begriff trotzdem dazugehört",
        body: [
          "Viele B2B-Kunden denken Versand und Produktetiketten gemeinsam. Deshalb gehört der Begriff ins Glossar, auch wenn Thermoetiketten bei uns bewusst nachrangig bleiben.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/proof",
    slug: "proof",
    kind: "glossary",
    title: "Was ist ein Proof?",
    eyebrow: "Glossar",
    lead:
      "Proof kurz erklärt: Warum die Freigabe vor Produktion wichtig ist und wie sie spätere Nachbestellungen absichert.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "Freigabeschritt vor Produktion",
      "sichert Position, Lesbarkeit und letzte Version",
      "wichtig für spätere Wiederholungen",
    ],
    glossaryData: {
      term: "Proof",
      definition:
        "Ein Proof ist die Freigabe- oder Prüfstufe vor der Produktion, in der Position, Lesbarkeit und finale Datei kontrolliert werden.",
      whenItMatters:
        "Wenn eine Druckdatei nicht nur produziert, sondern später exakt wiederverwendet werden soll.",
      exampleUse:
        "Kontrolle der finalen Etikettenversion vor einer 5.000er-Produktion.",
      relatedProduct: "Druckdatenprüfung für PP-Rollenetiketten",
    },
    sections: [
      {
        title: "Warum der Proof kein Formalismus ist",
        body: [
          "Der Proof trennt eine schöne Datei von einer wirklich freigegebenen Produktionsbasis. Ohne diesen Schritt entstehen bei Wiederholungen schnell Versionsprobleme.",
        ],
      },
      {
        title: "Warum eine klare Definition hilft",
        body: [
          "Viele Käufer kennen die Bedeutung nur grob. Eine klare Definition vermeidet Missverständnisse bei Freigabe und Nachbestellung.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/beschnitt",
    slug: "beschnitt",
    kind: "glossary",
    title: "Was ist Beschnitt?",
    eyebrow: "Glossar",
    lead:
      "Beschnitt kurz erklärt: warum ein Sicherheitsrand in Druckdaten wichtig ist und wie er unsaubere Kanten verhindert.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "Sicherheitsrand in Druckdaten",
      "wichtig für saubere Kanten",
      "relevant bei Export und Dateiprüfung",
    ],
    glossaryData: {
      term: "Beschnitt",
      definition:
        "Beschnitt ist ein zusätzlicher Rand in der Druckdatei, der verhindert, dass beim Zuschnitt weiße Kanten oder Versätze sichtbar werden.",
      whenItMatters:
        "Sobald Etiketten professionell produziert und später reproduzierbar nachbestellt werden sollen.",
      exampleUse:
        "Anlage des Sicherheitsrands bei einer PDF-Druckdatei für PP-Rollenetiketten.",
      relatedProduct: "Druckdatenvorbereitung für Produktetiketten",
    },
    sections: [
      {
        title: "Warum Beschnitt oft unterschätzt wird",
        body: [
          "Viele Layouts sehen auf dem Bildschirm korrekt aus, scheitern aber in der Produktion an fehlendem Sicherheitsrand. Beschnitt ist deshalb kein Detail, sondern Teil der Druckreife.",
        ],
      },
      {
        title: "Wann der Begriff besonders relevant wird",
        body: [
          "Spätestens beim Export und bei der technischen Prüfung muss klar sein, ob die Datei den notwendigen Rand mitführt.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/druckdaten",
    slug: "druckdaten",
    kind: "glossary",
    title: "Was sind Druckdaten?",
    eyebrow: "Glossar",
    lead:
      "Druckdaten kurz erklärt: welche Dateien für Etiketten gemeint sind und warum sie für Proof, Freigabe und Nachbestellung wichtig bleiben.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "digitale Produktionsvorlage",
      "Grundlage für Prüfung und Freigabe",
      "entscheidend für Wiederholung",
    ],
    glossaryData: {
      term: "Druckdaten",
      definition:
        "Druckdaten sind die Dateien, aus denen ein Etikett technisch geprüft, freigegeben und produziert wird.",
      whenItMatters:
        "Immer dann, wenn Etiketten nicht nur einmalig, sondern regelmäßig in gleicher Form gefertigt werden.",
      exampleUse:
        "PDF- oder AI-Datei mit klarer Größe, Beschnitt und final freigegebener Version.",
      relatedProduct: "Druckdatenprüfung für PP-Rollenetiketten",
    },
    sections: [
      {
        title: "Mehr als nur eine Datei",
        body: [
          "Druckdaten sind nicht bloß ein Dateianhang. Sie bilden die technische Basis für Freigabe, Produktion und spätere Wiederholung derselben Spezifikation.",
        ],
      },
      {
        title: "Warum der Begriff für Nachbestellungen wichtig ist",
        body: [
          "Wenn Druckdaten gut organisiert sind, lässt sich dieselbe Etikettenversion später schneller erneut anfragen oder prüfen.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
  {
    path: "/de/glossar/nachbestellung",
    slug: "nachbestellung",
    kind: "glossary",
    title: "Was bedeutet Nachbestellung bei Etiketten?",
    eyebrow: "Glossar",
    lead:
      "Nachbestellung kurz erklärt: warum gespeicherte Druckdaten, Material und Größe spätere Abrufe beschleunigen.",
    sidebarTitle: "Kurz gesagt",
    sidebarBullets: [
      "gleiche Spezifikation erneut nutzen",
      "nicht jede Bestellung startet bei null",
      "wichtig für wiederkehrende B2B-Marken",
    ],
    glossaryData: {
      term: "Nachbestellung",
      definition:
        "Nachbestellung bedeutet, dass eine bereits definierte und freigegebene Etikettenspezifikation erneut abgerufen wird.",
      whenItMatters:
        "Wenn dieselbe Verpackung in weiteren Chargen produziert wird und Zeit durch gespeicherte Daten gespart werden soll.",
      exampleUse:
        "Erneuter Abruf einer freigegebenen 5.000er-Etikettenversion mit angepasster Menge.",
      relatedProduct: "Reorder-Logik für PP-Rollenetiketten",
    },
    sections: [
      {
        title: "Warum Nachbestellung mehr ist als Wiederkauf",
        body: [
          "Im Etikettenkontext bedeutet Nachbestellung nicht nur, noch einmal zu bestellen, sondern mit vorhandenen Daten, Materialangaben und Freigaben schneller weiterzuarbeiten.",
        ],
      },
      {
        title: "Was dafür dokumentiert sein muss",
        body: [
          "Material, Größe, letzte freigegebene Datei und klare Mengeninformation sind die Kernpunkte einer belastbaren Nachbestelllogik.",
        ],
      },
    ],
    relatedLinks: guideCommercialLinks,
  },
];

const ratgeberHubPage: PublicPageData = {
  path: "/de/ratgeber",
  slug: "ratgeber",
  kind: "hub",
  title: "Ratgeber für Etiketten, Materialien und Druckdaten",
  eyebrow: "Ratgeber",
  lead:
    "Vergleiche, Schritt-für-Schritt-Erklärungen und Kaufhilfen zu PP-Rollenetiketten, Materialwahl, Mengen und Druckdaten.",
  heroBullets: [
    "Die Guides sind auf echte B2B-Fragen ausgerichtet: Material, Menge, Rollenlogik und druckfähige Dateien.",
    "Jeder Guide führt weiter zu den passenden Produkt- und Branchen-Seiten.",
    "Bewusst wenige, sorgfältig geschriebene Guides statt beliebig vieler austauschbarer Texte.",
  ],
  sidebarTitle: "Die Guides helfen bei",
  sidebarBullets: [
    "Materialwahl zwischen PP, Papier, opak und transparent",
    "Mengenentscheidungen vor der ersten Bestellung",
    "Vorbereitung von Druckdaten und späterer Nachbestellung",
  ],
  primaryCta: quoteLink,
  secondaryCta: {
    label: "PP-Rollenetiketten ansehen",
    href: "/de/pp-rollenetiketten",
  },
  sections: [
    {
      title: "Warum der Ratgeber bewusst schlank ist",
      body: [
        "Wir setzen auf wenige starke Guides statt auf eine Flut austauschbarer Texte.",
      ],
    },
    {
      title: "Wie die Guides zusammenhängen",
      body: [
        "Jeder Guide beantwortet eine klar umrissene Frage und führt weiter zu passenden Produkt-, Branchen- und Serviceseiten. So finden Sie schnell den nächsten sinnvollen Schritt.",
      ],
    },
  ],
  hubLinks: [],
  faqs: [
    {
      question: "Warum gibt es nicht dutzende Ratgeberseiten?",
      answer:
        "Weil wir auf Qualität statt Masse setzen. Wir behandeln zuerst die Themen, die bei Material-, Mengen- und Druckdatenentscheidungen wirklich weiterhelfen.",
    },
  ],
  relatedLinks: guideCommercialLinks,
};

ratgeberHubPage.hubLinks = guidePages.map((page) => ({
  label: page.title,
  href: page.path,
  description: page.lead,
}));

glossaryHubPage.hubLinks = glossaryPages.map((page) => ({
  label: page.glossaryData?.term ?? page.title,
  href: page.path,
  description: page.lead,
}));

export const publicPagesBySlug: Record<string, PublicPageData> = Object.fromEntries(
  topLevelPages.map((page) => [page.slug, page]),
);

export const publicPageSlugs = topLevelPages.map((page) => page.slug);

export const guidePagesBySlug: Record<string, PublicPageData> = Object.fromEntries(
  guidePages.map((page) => [page.slug, page]),
);

export const guidePageSlugs = guidePages.map((page) => page.slug);

export const glossaryPagesBySlug: Record<string, PublicPageData> =
  Object.fromEntries(glossaryPages.map((page) => [page.slug, page]));

export const glossaryPageSlugs = glossaryPages.map((page) => page.slug);

export const hubPagesBySlug: Record<string, PublicPageData> = {
  ratgeber: ratgeberHubPage,
  glossar: glossaryHubPage,
};

export const sitemapEntries: SitemapEntry[] = [
  { path: "/de", priority: 1, changeFrequency: "weekly" },
  { path: "/de/kalkulator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/de/lebensmittel-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/supplement-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/getraenke-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/transparente-pp-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/opake-pp-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/pp-rollenetiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/rollenetiketten", priority: 0.9, changeFrequency: "weekly" },
  { path: "/de/rollenetiketten-drucken", priority: 0.9, changeFrequency: "weekly" },
  { path: "/de/etiketten-auf-rolle", priority: 0.9, changeFrequency: "weekly" },
  { path: "/de/flaschenetiketten-drucken", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/weinetiketten-drucken", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/barcode-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/folienetiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/etiketten-100x200", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/thermo-versandetiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/musterbox", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/angebot-anfordern", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/nachbestellen", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/druckdaten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/produktion-versand", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/kontakt", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/unternehmen", priority: 0.6, changeFrequency: "monthly" },
  { path: "/de/auf-rechnung-beantragen", priority: 0.6, changeFrequency: "monthly" },
  { path: "/de/kaffee-etiketten", priority: 0.7, changeFrequency: "weekly" },
  { path: "/de/gewuerz-etiketten", priority: 0.7, changeFrequency: "weekly" },
  { path: "/de/honig-marmelade-etiketten", priority: 0.7, changeFrequency: "weekly" },
  { path: "/de/flaschenetiketten", priority: 0.7, changeFrequency: "weekly" },
  { path: "/de/ratgeber", priority: 0.7, changeFrequency: "monthly" },
  ...guidePages.map((page) => ({
    path: page.path,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/de/glossar", priority: 0.6, changeFrequency: "monthly" },
  ...glossaryPages.map((page) => ({
    path: page.path,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  })),
  { path: "/de/impressum", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/datenschutz", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/agb", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/versand", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/widerruf", priority: 0.3, changeFrequency: "monthly" },
];

export const deferredPhase2Routes = [
  "/de/glasetiketten",
  "/de/beuteletiketten",
  "/de/thermoetiketten-100x100",
  "/de/ratgeber/etiketten-1000-vs-5000-stueck",
  "/de/ratgeber/etiketten-nachbestellen",
  "/de/ratgeber/druckdaten-speichern",
  "/de/supplement-etiketten/transparente-pp-etiketten",
  "/de/kaffee-etiketten/opake-pp-etiketten",
];

