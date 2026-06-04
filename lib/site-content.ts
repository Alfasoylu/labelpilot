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
    grossLabel: `${formatEuro(input.net * 1.19)} brutto`,
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
  { label: "Material", value: "Genanntes PP-Material mit permanentem Klebstoff" },
  { label: "Druck", value: "4/0-farbiger CMYK-Digitaldruck ohne Einrichtungs- oder Klischeekosten" },
  { label: "Finish", value: "Genau ein Finish: glänzend oder matt" },
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
    badge: "Empfohlen für Wiederbestellungen",
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
    badge: "Reorder-Ready",
  }),
  buildFixedTier({
    label: "Standard",
    quantity: 5000,
    net: 519,
    note: "Wiederbestellung",
    description:
      "Die bevorzugte Menge für transparente Premium-Verpackungen mit sichtbarer Materialwirkung.",
    badge: "Empfohlen für Wiederbestellungen",
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
    label: "Cross-Sell",
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
    "Opak, transparent, sauber verarbeitet.",
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
      body: "Material und Einsatz sauber festlegen.",
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
  { label: "Produkte", href: "/de/pp-rollenetiketten" },
  { label: "Branchen", href: "/de/lebensmittel-etiketten" },
  { label: "Ratgeber", href: "/de/ratgeber" },
  { label: "Glossar", href: "/de/glossar" },
  { label: "Musterbox", href: "/de/musterbox" },
];

export const footerLinks: FooterGroup[] = [
  {
    title: "Produkte",
    links: [
      { label: "Opake PP-Etiketten", href: "/de/opake-pp-etiketten" },
      {
        label: "Transparente PP-Etiketten",
        href: "/de/transparente-pp-etiketten",
      },
      {
        label: "Thermo-Versandetiketten",
        href: "/de/thermo-versandetiketten",
      },
    ],
  },
  {
    title: "Wissen",
    links: [
      { label: "Ratgeber", href: "/de/ratgeber" },
      { label: "Glossar", href: "/de/glossar" },
      { label: "Druckdaten", href: "/de/druckdaten" },
      { label: "Nachbestellen", href: "/de/nachbestellen" },
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

export function getSiteNavigation(customSizeEnabled: boolean) {
  if (!customSizeEnabled) {
    return siteNavigation;
  }

  return [
    ...siteNavigation.slice(0, 1),
    { label: "Wunschformat", href: "/de/wunschformat" },
    ...siteNavigation.slice(1),
  ];
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
    description: "Standardmaterial für deckende Motive und klare Pflichtangaben.",
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
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Opake PP ansehen",
      href: "/de/opake-pp-etiketten",
    },
    sections: [
      {
        title: "Warum PP für Lebensmittelverpackungen",
        body: [
          "PP-Rollenetiketten sind für Lebensmittelmarken sinnvoll, wenn Material, Druckdaten und Etikettengröße reproduzierbar bleiben sollen.",
          "Besonders bei wiederkehrenden Chargen zählt nicht nur der Stückpreis, sondern ob dieselbe Spezifikation später sauber erneut bestellt werden kann.",
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
        question: "Welche Lebensmittelverpackungen passen zum Standardformat 100×200 mm?",
        answer:
          "Das Format 100×200 mm eignet sich für viele Produktetiketten auf Gläsern, Beuteln und Flaschen. Für Sondermaße ist das Angebotsformular der richtige Einstieg.",
      },
      {
        question: "Kann ich bei wiederkehrenden Sorten dieselbe Spezifikation erneut anfragen?",
        answer:
          "Ja. Unser Angebot ist bewusst auf wiederholbare Größen, Materialien und Nachbestellungen ausgerichtet.",
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
    primaryCta: quoteLink,
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
    },
    sections: [
      {
        title: "Struktur statt Variantenchaos",
        body: [
          "Supplement-Marken brauchen meist wiederkehrende Etiketten mit sauber dokumentierten Spezifikationen statt beliebiger Online-Konfigurationen.",
          "Darum konzentrieren wir uns auf einen klaren Kern aus PP-Material, Standardformat und Nachbestellung.",
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
        question: "Sind Supplement-Etiketten nur für Dosen gedacht?",
        answer:
          "Nein. Supplement-Etiketten decken auch Beutel und Flaschen ab, solange Material und Etikettengröße klar beschrieben werden.",
      },
      {
        question: "Kann ich zuerst Material vergleichen?",
        answer:
          "Ja. Dafür dient die Musterbox mit opaken, transparenten und Thermo-Beispielen als Orientierung vor größeren Mengen.",
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
      "Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen, prüfen und später leichter nachbestellen.",
    heroBullets: [
      "Klare Preisstaffel mit 1.000, 2.000, 5.000, 10.000 und 20.000+.",
      "5.000 Stück bleiben das zentrale Kernpaket für skalierbare B2B-Bestellungen.",
      "Alle Fixpreise werden netto und brutto gezeigt und enthalten den Versand nach Deutschland.",
      "20.000+ läuft nicht in einen Standard-Checkout, sondern in den Angebotsprozess.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "100×200 mm",
      "Transparentes PP",
      "Geeignet für Premium-Verpackungen und Glasoptiken",
    ],
    primaryCta: quoteLink,
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
          "Materialwahl sauber dokumentieren",
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
          "Ja. Die Preisstaffel enthält eine 2.000er-Stufe als Reorder-Ready-Paket für wiederkehrende kleine Chargen.",
      },
      {
        question: "Kann ich transparente PP-Etiketten später nachbestellen?",
        answer:
          "Ja. Freigegebene Druckdaten, Material und Spezifikation bleiben für spätere Nachbestellungen nutzbar. Bei identischem Artwork geht der Folgeauftrag deutlich schneller.",
      },
      {
        question: "Welche Druckdateien werden akzeptiert?",
        answer:
          "Bevorzugt sind PDF, AI und EPS. Zusätzlich können auch SVG, PNG, JPG oder ZIP sinnvoll sein, solange Format, Beschnitt und finale Version sauber vorbereitet sind.",
      },
      {
        question: "Wer ist für Pflichtangaben und regulatorische Inhalte verantwortlich?",
        answer:
          "Der Kunde bleibt für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, aber keine rechtliche Prüfung.",
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
        description: "Formatseite fuer das feste 100x200-mm-Standardformat mit klarer Einordnung des Einsatzfalls.",
      },
      {
        label: "Etiketten nachbestellen",
        href: "/de/nachbestellen",
        description: "Wenn dieselbe freigegebene Spezifikation spaeter schneller erneut bestellt werden soll.",
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
      "Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
    heroBullets: [
      "Das Standardprodukt für kontrastreiche Druckmotive und klare Deckkraft.",
      "Klare Preisstaffel mit 2.000er-Reorder-Stufe statt Lücke zwischen 1.000 und 5.000.",
      "Alle Fixpreise werden netto und brutto gezeigt und enthalten den Versand nach Deutschland.",
      "Das 5.000er-Paket ist die wirtschaftliche Hauptmenge.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "100×200 mm",
      "Opakes PP",
      "Geeignet für Lebensmittel, Supplemente und klassische Produktverpackungen",
    ],
    primaryCta: quoteLink,
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
          "Die Reorder-Ready-Stufe wurde bewusst eingeführt, damit kleine wiederkehrende Marken nicht direkt von 1.000 auf 5.000 springen müssen.",
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
        question: "Was ist im Fixpreis bereits enthalten?",
        answer:
          "Enthalten sind das 100×200-mm-Rollenetikett, 1 Design, das gewählte PP-Material, permanenter Klebstoff, CMYK-Digitaldruck, ein Finish, Standard-Datenprüfung, 1 Proof-Runde und Versand nach Deutschland.",
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
          "Der Fixpreis deckt ein Design pro Auftrag ab. Mehrere Sorten, Zusatzdesigns oder Sonderkonstellationen laufen sauber über den Angebotsprozess oder später über freigeschaltete Zusatzleistungen.",
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
        description: "Die Gegenseite fuer Glas-, Flaschen- und Premium-Optiken mit sichtbarem Inhalt.",
      },
      {
        label: "Etiketten 100x200 mm",
        href: "/de/etiketten-100x200",
        description: "Formatseite fuer das feste 100x200-mm-Standardformat und seine typische B2B-Verpackungslogik.",
      },
      {
        label: "Etiketten nachbestellen",
        href: "/de/nachbestellen",
        description: "Wenn eine freigegebene Produktlinie spaeter ohne neuen Start von vorn wiederholt werden soll.",
      },
      {
        label: "Supplement-Etiketten",
        href: "/de/supplement-etiketten",
        description: "Branchenseite fuer Dosen, Beutel und Flaschen mit wiederkehrenden Pflichtangaben und SKU-Logik.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/pp-rollenetiketten",
    slug: "pp-rollenetiketten",
    kind: "collection",
    title: "PP-Rollenetiketten drucken",
    eyebrow: "Produktübersicht",
    lead:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.",
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
      label: "Opake PP ansehen",
      href: "/de/opake-pp-etiketten",
    },
    secondaryCta: {
      label: "Transparente PP ansehen",
      href: "/de/transparente-pp-etiketten",
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
        "Die Auswahl bleibt bewusst schmal, damit Nachfrage, Preis und Nachbestellung sauber gesteuert werden können.",
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
          "Cross-Sell",
          "Versand, Lager, interne Logistik als Ergänzung",
        ],
      ],
    },
    faqs: [
      {
        question: "Warum gibt es nur wenige Kernmaterialien?",
        answer:
          "Wir konzentrieren uns bewusst auf einen schmalen, sauberen Produktkern statt auf ein zu breites Sortiment. Das hält Auswahl, Qualität und Nachbestellung übersichtlich.",
      },
      {
        question: "Kann ich PP-Rollenetiketten später nachbestellen?",
        answer:
          "Ja. Nach der Freigabe bleiben Druckdaten, Material und Größe für spätere Nachbestellungen nutzbar. Das ist ein Kernvorteil gegenüber einem losen Einmalauftrag.",
      },
      {
        question: "Welche Druckdateien werden für PP-Rollenetiketten akzeptiert?",
        answer:
          "Bevorzugt sind PDF, AI und EPS. Zusätzlich können SVG, PNG, JPG oder ZIP sinnvoll sein, solange Beschnitt, Endformat und finale Version sauber vorbereitet sind.",
      },
      {
        question: "Wer ist für Pflichtangaben und regulatorische Inhalte verantwortlich?",
        answer:
          "Der Kunde bleibt für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, aber keine rechtliche Prüfung.",
      },
    ],
    relatedLinks: [
      {
        label: "Ratgeber",
        href: "/de/ratgeber",
        description:
          "Vergleichs- und Erklärseiten zu Material, Menge und Druckdaten.",
      },
      {
        label: "Glossar",
        href: "/de/glossar",
        description:
          "Kurze Fachbegriffe rund um Material, Druckdaten und Nachbestellung.",
      },
      ...guideCommercialLinks,
    ],
  },
  {
    path: "/de/etiketten-100x200",
    slug: "etiketten-100x200",
    kind: "collection",
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
      label: "Opake PP ansehen",
      href: "/de/opake-pp-etiketten",
    },
    secondaryCta: quoteLink,
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
    eyebrow: "Cross-Sell",
    lead:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
    heroBullets: [
      "Bewusst als Cross-Sell positioniert und nicht als Hauptprodukt.",
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
    packageHeading: "Cross-Sell statt Hauptprodukt",
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
          "Wenn Sie opake und transparente Varianten erst vergleichen möchten, ist die Musterbox der saubere Zwischenschritt vor dem finalen Angebot.",
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
        question: "Ist Rechnungskauf mÃ¶glich?",
        answer:
          "Rechnungskauf ist fÃ¼r geprÃ¼fte GeschÃ¤ftskunden auf Anfrage mÃ¶glich. Diese Freigabe lÃ¤uft manuell im Angebotsprozess und nicht Ã¼ber den Standard-Checkout.",
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
      "Material, Größe und Druckdaten müssen bei jeder Folgebestellung nicht neu geklärt werden.",
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
          "Für viele Marken ist nicht die erste Bestellung der Haupthebel, sondern die saubere Wiederholung derselben Spezifikation zu einem späteren Zeitpunkt.",
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
        question: "Kann ich schon direkt online nachbestellen?",
        answer:
          "Aktuell läuft die Nachbestellung über eine kurze Anfrage. Da Material, Größe und freigegebene Druckdaten gespeichert sind, geht das deutlich schneller als eine Erstbestellung.",
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
    title: "Druckdaten für Etiketten vorbereiten",
    eyebrow: "Druckdaten",
    lead:
      "Welche Druckdaten für PP-Rollenetiketten benötigt werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung.",
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
          "Nein. Für den ersten Schritt reichen oft Format, Material, Menge und Einsatzfall. Wenn die Datei noch nicht final ist, kann die Anfrage trotzdem sauber starten und der Upload folgt später im passenden Prozessschritt.",
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
        title: "Warum wir das offen kommunizieren",
        body: [
          "Wir ordnen Produktion und Versand transparent für deutsche B2B-Kunden ein, damit die Lieferlogik nicht im Unklaren bleibt.",
        ],
      },
      {
        title: "Was wir nicht pauschal zusagen",
        body: [
          "Konkrete rechtliche oder steuerliche Detailzusagen treffen wir nicht pauschal, sondern klären sie auftragsbezogen.",
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
          "Kaffeemarken arbeiten oft mit mehreren Röstungen, Herkunftsangaben und Pflichtinformationen, die auf relativ begrenzten Flächen sauber lesbar bleiben müssen.",
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
          "Gewürzsortimente leben oft von vielen Varianten mit ähnlicher Verpackung, nicht von wenigen Einzelprodukten. Dadurch ist saubere Wiederholung besonders wichtig.",
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
          "Viele Gewürzmarken haben viele wiederkehrende SKUs. Wenn Größe, Material und Druckdaten einmal sauber definiert sind, wird jede weitere Sorte einfacher.",
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
      "Hier zahlt sich die Kombination aus Materialwahl und sauberer Druckdatenvorbereitung besonders aus.",
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
      { title: "Anbieterkennzeichnung", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Kontaktangaben", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Verantwortlich für den Inhalt", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
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
      { title: "Verarbeitung personenbezogener Daten", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Zwecke der Verarbeitung", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Betroffenenrechte", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
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
      { title: "Geltungsbereich", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Angebot, Vertrag und Freigabe", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Zahlung und Lieferung", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
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
      { title: "Liefergebiet und Versandmodell", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Produktions- und Versandablauf", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Hinweise zu Lieferzeiten", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
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
      { title: "Hinweis zu Sonderanfertigungen", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Widerruf und Ausschlüsse", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
      { title: "Reklamationen und Nachbesserung", body: ["⚠️ Rechtlich zu prüfen - Platzhalter"] },
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
          "PP ist meist dann überlegen, wenn Etiketten sauber reproduzierbar bleiben müssen, regelmäßig nachbestellt werden oder mit Feuchtigkeit, Kühlung und Abrieb in Berührung kommen.",
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
          "Sie sind näher an wiederholbarer Produktion, klarer Nachbestellkommunikation und sauberer Materialdefinition.",
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
          "Nein. Auch wiederkehrende kleinere Mengen profitieren davon, wenn dieselbe Spezifikation sauber erhalten bleibt.",
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
      "Druckdatei für Wiederholungen sauber speichern",
    ],
    sections: [
      {
        title: "1. Das richtige Ausgangsformat wählen",
        body: [
          "Vektordaten wie PDF, AI oder EPS sind für viele Produktetiketten der sauberste Start, weil Schriften, Kanten und Skalierung stabil bleiben.",
          "Rasterformate können funktionieren, sollten aber nur genutzt werden, wenn Auflösung und Exportlogik sauber kontrolliert sind.",
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
          "Der Proof ist kein optionales Bürodetail, sondern der Moment, in dem Sichtbarkeit, Textlogik und Positionierung noch einmal bewusst geprüft werden.",
          "Gerade bei wiederkehrenden Bestellungen spart ein sauberer Proof später Zeit, weil dieselbe freigegebene Basis weiterverwendet werden kann.",
        ],
      },
      {
        title: "4. Für spätere Nachbestellungen mitdenken",
        body: [
          "Wenn Dateinamen, Versionen und Spezifikationen schon bei der ersten Freigabe sauber organisiert sind, werden Folgeaufträge wesentlich einfacher.",
        ],
      },
    ],
    faqs: [
      {
        question: "Welche Datei ist für den Start am sichersten?",
        answer:
          "Meist ein sauber exportiertes PDF oder eine vergleichbare Vektordatei, weil Größe, Kanten und Schriften stabiler bleiben.",
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
    "Klare Definitionen statt Marketingfloskeln, die im Support und bei Rückfragen wirklich weiterhelfen.",
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
  secondaryCta: quoteLink,
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
        "Wenn wiederkehrende Bestellungen, saubere Etikettierung und skalierbare Produktprozesse wichtiger werden.",
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
          "Sobald Marken dieselbe Spezifikation regelmäßig wiederholen oder eine sauberere Nachbestelllogik brauchen, werden Rollenetiketten relevanter als Bogenetiketten.",
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
      "Thermoetiketten kurz erklärt: Einsatz in Versand, Lager und Fulfillment – und warum sie nur als Cross-Sell auftreten.",
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
      relatedProduct: "Thermo-Versandetiketten als ergänzendes Cross-Sell",
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
        "Immer dann, wenn Etiketten nicht nur einmalig, sondern sauber wiederholbar gefertigt werden sollen.",
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
          "Wenn Druckdaten sauber organisiert sind, lässt sich dieselbe Etikettenversion später schneller erneut anfragen oder prüfen.",
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
        title: "Was dafür sauber dokumentiert sein muss",
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
    label: "Glossar öffnen",
    href: "/de/glossar",
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
  { path: "/de/lebensmittel-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/supplement-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/getraenke-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/transparente-pp-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/opake-pp-etiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/pp-rollenetiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/etiketten-100x200", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/thermo-versandetiketten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/musterbox", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/angebot-anfordern", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/nachbestellen", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/druckdaten", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/produktion-versand", priority: 0.8, changeFrequency: "weekly" },
  { path: "/de/kontakt", priority: 0.8, changeFrequency: "weekly" },
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
  "/de/supplement-etiketten/transparente-pp-etiketten",
  "/de/kaffee-etiketten/opake-pp-etiketten",
];

