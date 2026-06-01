export type PackageTier = {
  label: string;
  quantity: string;
  priceLabel: string;
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

export type TableData = {
  title: string;
  lead: string;
  columns: string[];
  rows: string[][];
};

export type PublicPageData = {
  slug: string;
  kind:
    | "industry"
    | "product"
    | "collection"
    | "service"
    | "quote"
    | "legal";
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

type SitemapEntry = {
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

export const opaquePackages: PackageTier[] = [
  {
    label: "Starter",
    quantity: "1.000 Stück",
    priceLabel: "€149",
    note: "Einstieg",
    description: "Für erste Tests und kleinere Produktchargen.",
  },
  {
    label: "Reorder Ready",
    quantity: "2.000 Stück",
    priceLabel: "€229",
    note: "Nachbestellfreundlich",
    description: "Sinnvoll für wiederkehrende Mikro-Chargen.",
    badge: "Beliebt für Wiederholungen",
  },
  {
    label: "Growth",
    quantity: "5.000 Stück",
    priceLabel: "€399",
    note: "Hauptpaket",
    description: "Die wirtschaftliche Kernmenge für regelmäßige B2B-Bestellungen.",
    badge: "Beste Balance",
    popular: true,
  },
  {
    label: "Pro",
    quantity: "10.000 Stück",
    priceLabel: "€699",
    note: "Skalierung",
    description: "Für wachsende Produktlinien mit wiederholbaren Spezifikationen.",
  },
  {
    label: "Business",
    quantity: "20.000+ Stück",
    priceLabel: "Angebot",
    note: "Großmenge",
    description: "Individuelles B2B-Angebot statt Standard-Checkout.",
  },
];

export const transparentPackages: PackageTier[] = [
  {
    label: "Starter",
    quantity: "1.000 Stück",
    priceLabel: "€169",
    note: "Premium-Einstieg",
    description: "Für erste Tests mit transparenter Optik.",
  },
  {
    label: "Reorder Ready",
    quantity: "2.000 Stück",
    priceLabel: "€254",
    note: "Premium-Nachbestellung",
    description: "Für Marken, die wiederkehrend kleinere Chargen brauchen.",
    badge: "Reorder-Ready",
  },
  {
    label: "Growth",
    quantity: "5.000 Stück",
    priceLabel: "€429",
    note: "Hauptpaket",
    description: "Die bevorzugte Menge für skalierbare Premium-Verpackungen.",
    badge: "Kernpaket",
    popular: true,
  },
  {
    label: "Pro",
    quantity: "10.000 Stück",
    priceLabel: "€749",
    note: "Skalierung",
    description: "Für höhere Auflagen mit stabiler Produktoptik.",
  },
  {
    label: "Business",
    quantity: "20.000+ Stück",
    priceLabel: "Angebot",
    note: "Großmenge",
    description: "Individuelles Angebot für größere Abrufe und Rahmenmengen.",
  },
];

export const thermalPackageNotes: PackageTier[] = [
  {
    label: "Cross-Sell",
    quantity: "ab 1.000 Stück",
    priceLabel: "Angebot",
    note: "Anwendungsabhängig",
    description: "Thermo-Versandetiketten bleiben im MVP ein ergänzendes B2B-Produkt.",
    badge: "Nicht das Hauptprodukt",
  },
];

export const homePageData: HomePageData = {
  eyebrow: "Deutscher Public MVP",
  title: "PP-Rollenetiketten für Marken in Deutschland",
  lead:
    "Individuell bedruckte PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Mit technischer Druckdatenprüfung, Musterbox und klarer Nachbestelllogik.",
  highlights: [
    "Opake und transparente PP-Etiketten als Kernprodukt im Format 100×200 mm.",
    "Thermo-Versandetiketten nur als ergänzendes B2B-Cross-Sell, nicht als Hauptangebot.",
    "Quote-first Prozess für größere Mengen, wiederkehrende Abrufe und Sonderfälle.",
  ],
  corePackages: opaquePackages,
  topicCards: [
    {
      title: "Opake PP-Etiketten",
      body: "Die robuste Standardlösung für Lebensmittel, Supplemente und klassische Produktverpackungen.",
      href: "/de/opake-pp-etiketten",
    },
    {
      title: "Transparente PP-Etiketten",
      body: "Für Flaschen, Gläser und Premium-Verpackungen mit klarer Optik und wiederholbaren Specs.",
      href: "/de/transparente-pp-etiketten",
    },
    {
      title: "Angebot statt Blindflug",
      body: "Ab 20.000 Stück, für Sondergrößen oder unklare Spezifikationen läuft der Prozess strukturiert über das Angebotsformular.",
      href: "/de/angebot-anfordern",
    },
  ],
  steps: [
    {
      title: "1. Bedarf konkretisieren",
      body: "Material, Größe, Menge und Verpackung werden auf den öffentlichen Produkt- und Serviceseiten sauber erklärt.",
    },
    {
      title: "2. Anfrage strukturiert senden",
      body: "Das Formular erfasst B2B-relevante Daten wie Menge, Material, Wiederkehr und Druckdatenstatus.",
    },
    {
      title: "3. Wiederholbar bestellen",
      body: "Die MVP-Kommunikation ist auf gespeicherte Spezifikationen und spätere Nachbestellungen ausgelegt.",
    },
  ],
};

export const siteNavigation: SiteNavigationItem[] = [
  { label: "Produkte", href: "/de/pp-rollenetiketten" },
  { label: "Branchen", href: "/de/lebensmittel-etiketten" },
  { label: "Musterbox", href: "/de/musterbox" },
  { label: "Druckdaten", href: "/de/druckdaten" },
  { label: "Nachbestellen", href: "/de/nachbestellen" },
];

export const footerLinks: FooterGroup[] = [
  {
    title: "Produkte",
    links: [
      { label: "Opake PP-Etiketten", href: "/de/opake-pp-etiketten" },
      { label: "Transparente PP-Etiketten", href: "/de/transparente-pp-etiketten" },
      { label: "Thermo-Versandetiketten", href: "/de/thermo-versandetiketten" },
    ],
  },
  {
    title: "Ablauf",
    links: [
      { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
      { label: "Musterbox", href: "/de/musterbox" },
      { label: "Druckdaten", href: "/de/druckdaten" },
      { label: "Produktion und Versand", href: "/de/produktion-versand" },
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

export const publicPagesBySlug: Record<string, PublicPageData> = {
  "lebensmittel-etiketten": {
    slug: "lebensmittel-etiketten",
    kind: "industry",
    title: "Lebensmitteletiketten drucken",
    eyebrow: "Branche",
    lead: "Bedruckte PP-Rollenetiketten für Lebensmittelmarken in Deutschland. Geeignet für Gläser, Beutel, Flaschen und klassische Verpackungen.",
    heroBullets: [
      "Opake oder transparente PP-Varianten für unterschiedliche Verpackungsoptiken.",
      "100×200 mm als schneller MVP-Standard für wiederkehrende Produktetiketten.",
      "Nachbestelllogik wichtig für Sortimente mit mehreren Chargen und saisonalen Abrufen.",
    ],
    sidebarTitle: "Typische Anwendungen",
    sidebarBullets: [
      "Gläser, Beutel und Faltschachteln",
      "Honig, Gewürze, Marmelade und Feinkost",
      "Wiederkehrende Sortimente mit identischer Etikettengröße",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Opake PP ansehen", href: "/de/opake-pp-etiketten" },
    sections: [
      {
        title: "Warum PP für Lebensmittelverpackungen",
        body: [
          "PP-Rollenetiketten sind für Lebensmittelmarken sinnvoll, wenn Material, Druckdaten und Etikettengröße reproduzierbar bleiben sollen.",
          "Besonders bei wiederkehrenden Chargen zählt nicht nur der Stückpreis, sondern ob dieselbe Spezifikation später sauber erneut bestellt werden kann.",
        ],
      },
      {
        title: "Welche Optik passt besser",
        body: [
          "Opake PP-Etiketten passen für starke Flächendeckung und klare Lesbarkeit.",
          "Transparente PP-Etiketten wirken hochwertiger auf Gläsern, Flaschen und Sichtfenster-Verpackungen.",
        ],
      },
      {
        title: "Wann die Musterbox sinnvoll ist",
        body: [
          "Wenn Materialwirkung oder Haptik noch offen sind, hilft die Musterbox vor größeren Mengen.",
        ],
        bullets: [
          "Materialvergleich vor Erstbestellung",
          "Sicherere Freigabe für spätere Nachbestellungen",
          "Klarere Entscheidung zwischen opak und transparent",
        ],
      },
    ],
    faqs: [
      {
        question: "Welche Lebensmittelverpackungen passen zum MVP-Format 100×200 mm?",
        answer:
          "Das Format 100×200 mm ist im MVP für viele Produktetiketten auf Gläsern, Beuteln und Flaschen gedacht. Für Sondermaße ist das Angebotsformular der richtige Einstieg.",
      },
      {
        question: "Kann ich bei wiederkehrenden Sorten dieselbe Spezifikation erneut anfragen?",
        answer:
          "Ja. Die öffentliche Produktlogik ist bewusst auf wiederholbare Größen, Materialien und Nachbestellungen ausgerichtet.",
      },
    ],
  },
  "supplement-etiketten": {
    slug: "supplement-etiketten",
    kind: "industry",
    title: "Supplement-Etiketten drucken",
    eyebrow: "Branche",
    lead: "PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.",
    heroBullets: [
      "Geeignet für wiederkehrende SKU-Strukturen im B2B-Kontext.",
      "Saubere Unterscheidung zwischen Standardprodukt und Angebotsfall.",
      "Klare Nachbestellkommunikation für Marken mit laufender Produktion.",
    ],
    sidebarTitle: "Für Supplement-Marken wichtig",
    sidebarBullets: [
      "Konstante Größe über mehrere Varianten",
      "Hohe Wiederholungsrate bei identischen Specs",
      "Transparente oder opake Optik je nach Verpackung",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Transparente PP ansehen", href: "/de/transparente-pp-etiketten" },
    sections: [
      {
        title: "Struktur statt generischer Druckshop",
        body: [
          "Supplement-Marken brauchen meist wiederkehrende Etiketten mit sauber dokumentierten Spezifikationen.",
          "Darum fokussiert die MVP-Version nicht auf beliebige Print-Konfigurationen, sondern auf einen klaren Kern aus PP-Material, Standardformat und Nachbestelllogik.",
        ],
      },
      {
        title: "Opak oder transparent",
        body: [
          "Opakes PP passt für klare Farbflächen, Pflichtangaben und wiedererkennbare Regaloptik.",
          "Transparentes PP eignet sich, wenn Dosen oder Flaschen eine reduzierte Premium-Wirkung behalten sollen.",
        ],
      },
      {
        title: "Ab wann Angebot sinnvoll ist",
        body: [
          "Ab 20.000 Stück, bei Sondergrößen oder wenn mehrere Verpackungsformen gleichzeitig geplant sind, sollte die Anfrage direkt in den Angebotsprozess gehen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Sind Supplement-Etiketten nur für Dosen gedacht?",
        answer:
          "Nein. Die öffentliche MVP-Kommunikation deckt auch Beutel und Flaschen ab, solange Material und Etikettengröße klar beschrieben werden.",
      },
      {
        question: "Kann ich zuerst Material vergleichen?",
        answer:
          "Ja. Dafür dient die Musterbox mit opaken, transparenten und Thermo-Beispielen als Orientierung vor größeren Mengen.",
      },
    ],
  },
  "getraenke-etiketten": {
    slug: "getraenke-etiketten",
    kind: "industry",
    title: "Getränkeetiketten drucken",
    eyebrow: "Branche",
    lead: "Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.",
    heroBullets: [
      "Transparente PP-Etiketten passen besonders gut zu Flaschen- und Glasoptiken.",
      "Opake Varianten bleiben sinnvoll für kontrastreiche Designs und Pflichtangaben.",
      "Die MVP-Kommunikation ist auf B2B-Verpackungen ausgelegt, nicht auf Einzelstücke.",
    ],
    sidebarTitle: "Typische Einsatzbereiche",
    sidebarBullets: [
      "Flaschenetiketten für Getränke",
      "Glasverpackungen mit transparenter Optik",
      "Wiederkehrende Abrufe über feste Mengenstufen",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Transparente PP ansehen", href: "/de/transparente-pp-etiketten" },
    sections: [
      {
        title: "Warum transparente PP-Etiketten oft dominieren",
        body: [
          "Getränkeverpackungen profitieren häufig von transparenter Optik, wenn Flaschen- oder Glasmaterial sichtbar bleiben soll.",
          "Im MVP wird diese Entscheidung mit einem klaren Premium-Pricing von der opaken Variante getrennt.",
        ],
      },
      {
        title: "Wann opak die bessere Wahl ist",
        body: [
          "Wenn starke Farbflächen, hohe Deckkraft oder klare Typografie im Vordergrund stehen, bleibt opakes PP die robustere Standardlösung.",
        ],
      },
      {
        title: "Sinnvolle nächste Schritte",
        body: [
          "Bei Unsicherheit zwischen transparenter und opaker Optik ist die Musterbox der saubere Zwischenschritt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Eignen sich transparente Etiketten für Glas und Flaschen?",
        answer:
          "Ja. Genau dafür ist die transparente PP-Seite im MVP positioniert, vor allem für Premium-Verpackungen im Getränkeumfeld.",
      },
      {
        question: "Kann ich für mehrere Flaschenvarianten ein Angebot anfordern?",
        answer:
          "Ja. Sobald mehrere Varianten, Mengen oder Spezifikationen zusammenkommen, ist das Angebotsformular der richtige Einstieg.",
      },
    ],
  },
  "transparente-pp-etiketten": {
    slug: "transparente-pp-etiketten",
    kind: "product",
    title: "Transparente PP-Etiketten drucken",
    eyebrow: "Produkt",
    lead: "Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen, prüfen und später leichter nachbestellen.",
    heroBullets: [
      "Kanonische Preisstaffel mit 1.000, 2.000, 5.000, 10.000 und 20.000+.",
      "5.000 Stück bleiben das zentrale Kernpaket für skalierbare B2B-Bestellungen.",
      "20.000+ läuft nicht in einen Standard-Checkout, sondern in den Angebotsprozess.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "100×200 mm",
      "Transparentes PP",
      "Geeignet für Premium-Verpackungen und Glasoptiken",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Musterbox ansehen", href: "/de/musterbox" },
    packageHeading: "Kanonische Preisstaffel für transparente PP-Etiketten",
    packageLead:
      "Diese Tabelle folgt der in den Dokumenten gelockten Preisstaffel. Transparente PP-Etiketten werden bewusst oberhalb der opaken Variante positioniert.",
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
          "Im MVP geht es nicht um beliebige Online-Konfigurationen, sondern um reproduzierbare Material- und Mengenentscheidungen.",
        ],
        bullets: [
          "Materialwahl sauber dokumentieren",
          "Druckdaten technisch prüfen",
          "Spätere Nachbestellung mit gleicher Spezifikation beschleunigen",
        ],
      },
      {
        title: "Wann ein Angebot nötig ist",
        body: [
          "Sobald die Menge 20.000+ erreicht oder Sondergrößen ins Spiel kommen, wird der Fall bewusst in den Angebotsprozess überführt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Warum ist transparentes PP teurer als opakes PP?",
        answer:
          "Die Dokumentation positioniert transparente PP-Etiketten bewusst als Premium-Variante. Diese Preisdifferenz bleibt auf der Seite sichtbar und konsistent.",
      },
      {
        question: "Ist 2.000 Stück direkt vorgesehen?",
        answer:
          "Ja. Die kanonische Preislogik enthält eine 2.000er-Stufe als Reorder-Ready-Paket für wiederkehrende kleine Chargen.",
      },
    ],
  },
  "opake-pp-etiketten": {
    slug: "opake-pp-etiketten",
    kind: "product",
    title: "Opake PP-Etiketten drucken",
    eyebrow: "Produkt",
    lead: "Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
    heroBullets: [
      "Das Standardprodukt für kontrastreiche Druckmotive und klare Deckkraft.",
      "Kanonische Preisstaffel mit 2.000er-Reorder-Stufe statt Lücke zwischen 1.000 und 5.000.",
      "Das 5.000er-Paket ist die wirtschaftliche Hauptmenge im MVP.",
    ],
    sidebarTitle: "Produktfokus",
    sidebarBullets: [
      "100×200 mm",
      "Opakes PP",
      "Geeignet für Lebensmittel, Supplemente und klassische Produktverpackungen",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Druckdaten prüfen", href: "/de/druckdaten" },
    packageHeading: "Kanonische Preisstaffel für opake PP-Etiketten",
    packageLead:
      "Diese Tabelle übernimmt die zentrale Preisdefinition aus dem Pricing-Modell. Damit bleibt Produkt, Katalog und Angebotssprache konsistent.",
    packageTable: opaquePackages,
    sections: [
      {
        title: "Der Standard für klare Lesbarkeit",
        body: [
          "Opake PP-Etiketten sind im MVP die robuste Standardwahl für Marken, die starke Flächendeckung, klare Pflichtangaben und konsistente Wiederholungen brauchen.",
        ],
      },
      {
        title: "Warum die 2.000er-Stufe wichtig ist",
        body: [
          "Die Reorder-Ready-Stufe wurde bewusst eingeführt, damit kleine wiederkehrende Marken nicht direkt von 1.000 auf 5.000 springen müssen.",
        ],
      },
      {
        title: "Für wen 20.000+ gedacht ist",
        body: [
          "Großmengen, Rahmenabrufe oder kombinierte Anforderungen werden nicht als Standardpreis verkauft, sondern im Angebotsprozess strukturiert aufgenommen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ist opakes PP das Hauptprodukt im MVP?",
        answer:
          "Ja. Opake und transparente PP-Rollenetiketten bilden gemeinsam den Kern, wobei opak die Standardlösung für viele wiederkehrende Produktetiketten ist.",
      },
      {
        question: "Kann ich damit auch Getränkeflaschen etikettieren?",
        answer:
          "Ja, wenn Deckkraft und klare Lesbarkeit wichtiger sind als ein transparenter Look. Für sichtbare Flaschenoptik ist die transparente Variante oft passender.",
      },
    ],
  },
  "pp-rollenetiketten": {
    slug: "pp-rollenetiketten",
    kind: "collection",
    title: "PP-Rollenetiketten drucken",
    eyebrow: "Produktübersicht",
    lead: "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.",
    heroBullets: [
      "Zentrale Produktübersicht für den deutschen Public MVP.",
      "Verbindet Materialwahl, Preislogik, Druckdaten und Nachbestellung.",
      "Vermeidet generische Print-Shop-Navigation mit zu vielen dünnen Varianten.",
    ],
    sidebarTitle: "Was diese Seite bündelt",
    sidebarBullets: [
      "Opakes PP als Standardlösung",
      "Transparentes PP als Premium-Variante",
      "Weiterleitung zu Angebot, Musterbox und Druckdaten",
    ],
    primaryCta: { label: "Opake PP ansehen", href: "/de/opake-pp-etiketten" },
    secondaryCta: { label: "Transparente PP ansehen", href: "/de/transparente-pp-etiketten" },
    sections: [
      {
        title: "Der Kern des Angebots",
        body: [
          "PP-Rollenetiketten stehen im MVP bewusst über dem restlichen Sortiment. Sie sind der Einstieg für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland.",
        ],
      },
      {
        title: "Material statt Variantenchaos",
        body: [
          "Die erste öffentliche Version trennt klar zwischen opakem und transparentem PP, statt unzählige dünne Konfigurationspfade zu erzeugen.",
        ],
      },
      {
        title: "Reorder-Logik von Anfang an",
        body: [
          "Schon die öffentliche Kommunikation ist so aufgebaut, dass spätere Nachbestellungen nicht wie neue Einzelprojekte behandelt werden müssen.",
        ],
      },
    ],
    table: {
      title: "Materialvergleich im MVP",
      lead: "Die Auswahl bleibt bewusst schmal, damit Nachfrage, Preis und Nachbestellung sauber gesteuert werden können.",
      columns: ["Material", "Rolle", "Stärken"],
      rows: [
        ["Opakes PP", "Standardprodukt", "Deckkraft, klare Lesbarkeit, wiederkehrende Chargen"],
        ["Transparentes PP", "Premium-Produkt", "Reduzierte Optik, Glas- und Flaschenverpackungen"],
        ["Thermo", "Cross-Sell", "Versand, Lager, interne Logistik als Ergänzung"],
      ],
    },
    faqs: [
      {
        question: "Warum gibt es im MVP nur wenige Kernmaterialien?",
        answer:
          "Die Dokumentation priorisiert einen schmalen, sauberen Kern statt eines zu breiten Sortiments. Das reduziert SEO-Drift und operative Unschärfe.",
      },
    ],
  },
  "etiketten-100x200": {
    slug: "etiketten-100x200",
    kind: "collection",
    title: "Etiketten 100×200 mm drucken",
    eyebrow: "Format",
    lead: "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.",
    heroBullets: [
      "Das Standardformat des Public MVP für wiederkehrende Produktetiketten.",
      "Schnellere Vergleichbarkeit zwischen opak und transparent.",
      "Weniger operative Reibung als ein breites Maß-Sortiment im ersten Build.",
    ],
    sidebarTitle: "Warum dieses Format",
    sidebarBullets: [
      "Sinnvoll für wiederkehrende Standardverpackungen",
      "Einfacher Materialvergleich zwischen opak und transparent",
      "Klarer Ausgangspunkt für spätere Angebotsfälle",
    ],
    primaryCta: { label: "Opake PP ansehen", href: "/de/opake-pp-etiketten" },
    secondaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    sections: [
      {
        title: "Standardisierung vor Variantenexplosion",
        body: [
          "Das Format 100×200 mm bündelt die erste deutsche Nachfrage auf eine gut steuerbare Standardgröße.",
          "Für Sonderformate bleibt der Angebotsprozess offen, ohne das MVP mit dünnen SEO-Seiten zu überfrachten.",
        ],
      },
      {
        title: "Für welche Verpackungen es passt",
        body: [
          "Das Format eignet sich für viele Produktverpackungen im Lebensmittel-, Getränke- und Supplement-Bereich, solange die Etikettierfläche dazu passt.",
        ],
      },
      {
        title: "Wie man mit Sonderfällen umgeht",
        body: [
          "Sobald Größe, Form oder Material vom Standard abweichen, sollte die Anfrage direkt im Angebot konkretisiert werden.",
        ],
      },
    ],
  },
  "thermo-versandetiketten": {
    slug: "thermo-versandetiketten",
    kind: "product",
    title: "Thermo-Versandetiketten 100×150 mm",
    eyebrow: "Cross-Sell",
    lead: "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
    heroBullets: [
      "Bewusst als Cross-Sell positioniert und nicht als Hauptprodukt des MVP.",
      "Typisch für Versand, Lager und Fulfillment statt klassische Markenverpackung.",
      "Preislogik bleibt im MVP angebotsbasiert, um keine ungesicherte Standardtabelle zu erfinden.",
    ],
    sidebarTitle: "Typische Einsätze",
    sidebarBullets: [
      "Versandetiketten 100×150 mm",
      "Logistik- und Lagerprozesse",
      "Zusatzprodukt für bestehende B2B-Kunden",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "PP-Rollenetiketten ansehen", href: "/de/pp-rollenetiketten" },
    packageHeading: "Cross-Sell statt Hauptprodukt",
    packageLead:
      "Die Dokumentation beschreibt Thermoetiketten als ergänzendes Produkt. Deshalb bleibt die öffentliche Darstellung im MVP bewusst angebotsbasiert.",
    packageTable: thermalPackageNotes,
    sections: [
      {
        title: "Warum Thermo nicht im Hero sitzt",
        body: [
          "Die Preis- und SEO-Dokumente legen fest, dass Thermoetiketten nicht das primäre Akquisitionsprodukt werden sollen.",
        ],
      },
      {
        title: "Wann Thermo sinnvoll ist",
        body: [
          "Wenn Versand, Lager oder Fulfillment im selben B2B-Kontext mitgedacht werden, sind Thermo-Versandetiketten eine logische Ergänzung.",
        ],
      },
      {
        title: "Wie der Einstieg läuft",
        body: [
          "Im MVP wird der Bedarf über das Angebotsformular aufgenommen, statt eine ungesicherte öffentliche Preisstaffel vorzugeben.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich Thermoetiketten direkt online konfigurieren?",
        answer:
          "Nicht im ersten Public MVP. Die Seite dient als Produktinformation und leitet für konkrete Mengen in den Angebotsprozess.",
      },
    ],
  },
  musterbox: {
    slug: "musterbox",
    kind: "service",
    title: "Etiketten Musterbox anfordern",
    eyebrow: "Musterbox",
    lead: "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
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
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Transparente PP ansehen", href: "/de/transparente-pp-etiketten" },
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
  },
  "angebot-anfordern": {
    slug: "angebot-anfordern",
    kind: "quote",
    title: "B2B-Angebot für Etiketten anfordern",
    eyebrow: "Angebot",
    lead: "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.",
    heroBullets: [
      "Geeignet für 20.000+ Stück, Sondergrößen, unklare Materialwahl oder wiederkehrende Abrufe.",
      "Der Prozess ist bewusst strukturiert und kein generisches Kontaktformular.",
      "MVP ohne Dateiupload: Für das erste Angebot reichen Material, Größe, Menge und Verpackung.",
    ],
    sidebarTitle: "Warum diese Seite wichtig ist",
    sidebarBullets: [
      "Einstieg für größere Mengen und Sonderfälle",
      "Saubere Datenerfassung für Lead und QuoteRequest",
      "Verbindet Produktseiten, Musterbox und spätere Nachbestellung",
    ],
    sections: [
      {
        title: "Wann Sie das Formular nutzen sollten",
        body: [
          "Immer dann, wenn Ihre Menge, Verpackung oder Spezifikation nicht mehr in die schmale Standardlogik des MVP passt.",
        ],
        bullets: [
          "20.000+ Stück",
          "Sondergrößen oder mehrere Varianten",
          "Unklare Materialentscheidung",
        ],
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
        question: "Kann ich zuerst eine Musterbox anfordern?",
        answer:
          "Ja. Wenn Material und Haptik noch offen sind, ist die Musterbox vor dem Angebot oft sinnvoller als ein vorschneller Mengenentscheid.",
      },
    ],
  },
  nachbestellen: {
    slug: "nachbestellen",
    kind: "service",
    title: "Etiketten nachbestellen",
    eyebrow: "Nachbestellung",
    lead: "Bestellen Sie freigegebene Etiketten später schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.",
    heroBullets: [
      "Im Public MVP ist dies bewusst eine Info-Seite ohne Login und ohne direkte Nachbestellaktion.",
      "Die Seite erklärt, warum gespeicherte Spezifikationen für B2B-Marken wirtschaftlich sind.",
      "Wiederkehrende Abrufe sind ein Kernargument gegen generische Print-Shop-Prozesse.",
    ],
    sidebarTitle: "Was gespeichert werden soll",
    sidebarBullets: [
      "Freigegebene Druckdaten",
      "Material, Größe und Stückzahl",
      "Wiederholbare Produktlogik für spätere Abrufe",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Druckdaten ansehen", href: "/de/druckdaten" },
    sections: [
      {
        title: "Warum Nachbestellung so wichtig ist",
        body: [
          "Für viele Marken ist nicht die erste Bestellung der Haupthebel, sondern die saubere Wiederholung derselben Spezifikation zu einem späteren Zeitpunkt.",
        ],
      },
      {
        title: "Was die MVP-Seite schon leistet",
        body: [
          "Sie schafft die Erwartung, dass Material, Größe und Druckdaten nicht jedes Mal neu erklärt werden müssen.",
        ],
      },
      {
        title: "Was später folgt",
        body: [
          "Login, Kundenkonto und echte Reorder-Aktionen sind bewusst in spätere Phasen verschoben.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kann ich im MVP schon direkt nachbestellen?",
        answer:
          "Nein. Diese Phase liefert nur die öffentliche Erklärung des Reorder-Prozesses. Die eigentliche Aktion kommt in späteren Account-Phasen.",
      },
    ],
  },
  druckdaten: {
    slug: "druckdaten",
    kind: "service",
    title: "Druckdaten für Etiketten vorbereiten",
    eyebrow: "Druckdaten",
    lead: "Welche Druckdaten für PP-Rollenetiketten benötigt werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung.",
    heroBullets: [
      "Das Angebotsformular funktioniert zunächst ohne Upload.",
      "Trotzdem erklärt diese Seite die erwarteten Formate und den technischen Prüfkontext.",
      "Klare Druckdatenregeln reduzieren Korrekturen vor späteren Nachbestellungen.",
    ],
    sidebarTitle: "Worauf wir achten",
    sidebarBullets: [
      "Saubere Formate und lesbare Schriften",
      "Klare Spezifikation zu Material und Etikettengröße",
      "Prüfbarkeit vor Freigabe und Wiederholung",
    ],
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Musterbox ansehen", href: "/de/musterbox" },
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
          "Die deutsche MVP-Kommunikation verknüpft Druckdaten nicht nur mit der ersten Produktion, sondern auch mit späterer Reproduzierbarkeit und Nachbestellung.",
        ],
      },
      {
        title: "Wie Sie ohne fertige Datei starten",
        body: [
          "Wenn noch keine finale Druckdatei vorliegt, können Sie trotzdem Material, Größe, Menge und Verpackung im Angebotsformular angeben.",
        ],
      },
    ],
    faqs: [
      {
        question: "Muss ich im MVP sofort eine Datei hochladen?",
        answer:
          "Nein. Die erste Phase der öffentlichen Anfrage funktioniert absichtlich ohne verpflichtenden Upload.",
      },
      {
        question: "Was passiert, wenn meine Datei später korrigiert werden muss?",
        answer:
          "Die Produkt- und Prozesslogik sieht technische Prüfung und Rückfragen vor, bevor dieselbe Spezifikation wiederholt wird.",
      },
    ],
  },
  "produktion-versand": {
    slug: "produktion-versand",
    kind: "service",
    title: "Produktion und Versand nach Deutschland",
    eyebrow: "Transparenz",
    lead: "Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland. Mit späterer Hub-Option.",
    heroBullets: [
      "Die Seite erklärt die Lieferlogik offen, statt sie zu verstecken.",
      "Im MVP dient sie der Einordnung von Produktionsort, Versand und Erwartungsmanagement.",
      "Rechtliche und operative Detailentscheidungen bleiben außerhalb dieser Platzhalterseite dokumentiert.",
    ],
    sidebarTitle: "Was diese Seite abdeckt",
    sidebarBullets: [
      "Produktionsstandort",
      "Versand nach Deutschland",
      "Kommunikation für B2B-Erwartungen",
    ],
    primaryCta: { label: "Kontakt aufnehmen", href: "/de/kontakt" },
    secondaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    sections: [
      {
        title: "Warum diese Information öffentlich ist",
        body: [
          "Die Dokumentation sieht diese Seite als transparente Einordnung für deutsche B2B-Kunden vor, damit Produktions- und Versandlogik nicht implizit bleibt.",
        ],
      },
      {
        title: "Was noch nicht behauptet wird",
        body: [
          "Konkrete rechtliche oder steuerliche Detailzusagen werden auf dieser Seite nicht erfunden. Sie bleibt bei der operativen Einordnung des MVP.",
        ],
      },
      {
        title: "Wann Rückfragen sinnvoll sind",
        body: [
          "Wenn Lieferzeit, Importablauf oder individuelle Anforderungen kritisch sind, sollte der nächste Schritt über Kontakt oder Angebot laufen.",
        ],
      },
    ],
  },
  kontakt: {
    slug: "kontakt",
    kind: "service",
    title: "Kontakt",
    eyebrow: "Kontakt",
    lead: "Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
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
    primaryCta: { label: "Angebot anfordern", href: "/de/angebot-anfordern" },
    secondaryCta: { label: "Musterbox ansehen", href: "/de/musterbox" },
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
          "Wenn Sie noch zwischen Material, Musterbox und Standardprodukt abwägen, helfen die öffentlichen Service-Seiten beim Einordnen des nächsten Schritts.",
        ],
      },
      {
        title: "Hinweis zur ersten Version",
        body: [
          "Im ersten Public MVP gibt es noch kein separates Kontaktformular. Die Seite dient als klarer Routing-Punkt innerhalb der deutschen Informationsarchitektur.",
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
  impressum: {
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
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Kontaktangaben",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Verantwortlich für den Inhalt",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    kind: "legal",
    title: "Datenschutzerklärung",
    eyebrow: "Rechtliches",
    lead: "Informationen zum Datenschutz bei Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Verarbeitung personenbezogener Daten",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Zwecke der Verarbeitung",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Betroffenenrechte",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
    ],
  },
  agb: {
    slug: "agb",
    kind: "legal",
    title: "Allgemeine Geschäftsbedingungen",
    eyebrow: "Rechtliches",
    lead: "Allgemeine Geschäftsbedingungen von Labelpilot.de.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Geltungsbereich",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Angebot, Vertrag und Freigabe",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Zahlung und Lieferung",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
    ],
  },
  versand: {
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
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Produktions- und Versandablauf",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Hinweise zu Lieferzeiten",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
    ],
  },
  widerruf: {
    slug: "widerruf",
    kind: "legal",
    title: "Widerruf und Sonderanfertigungen",
    eyebrow: "Rechtliches",
    lead: "Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.",
    sidebarTitle: "",
    sidebarBullets: [],
    sections: [
      {
        title: "Hinweis zu Sonderanfertigungen",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Widerruf und Ausschlüsse",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
      {
        title: "Reklamationen und Nachbesserung",
        body: ["⚠️ Rechtlich zu prüfen - Platzhalter"],
      },
    ],
  },
};

export const publicPageSlugs = Object.keys(publicPagesBySlug);

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
  { path: "/de/impressum", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/datenschutz", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/agb", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/versand", priority: 0.3, changeFrequency: "monthly" },
  { path: "/de/widerruf", priority: 0.3, changeFrequency: "monthly" },
];
