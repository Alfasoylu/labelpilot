export type MetadataEntry = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphType?: "website" | "article";
};

export const metadataMap: Record<string, MetadataEntry> = {
  "/de": {
    title: "PP-Rollenetiketten für Marken in Deutschland | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Mit technischer Druckdatenprüfung, Musterbox und einfacher Nachbestellung.",
    openGraphTitle: "PP-Rollenetiketten für Marken in Deutschland",
    openGraphDescription:
      "Labelpilot.de liefert individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken mit gespeicherten Druckdaten und einfacher Nachbestellung.",
  },
  "/de/lebensmittel-etiketten": {
    title: "Lebensmitteletiketten drucken | Labelpilot.de",
    description:
      "Bedruckte PP-Rollenetiketten für Lebensmittelmarken in Deutschland. Geeignet für Gläser, Beutel, Flaschen und Verpackungen.",
  },
  "/de/supplement-etiketten": {
    title: "Supplement-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.",
  },
  "/de/getraenke-etiketten": {
    title: "Getränkeetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.",
  },
  "/de/transparente-pp-etiketten": {
    title: "Transparente PP-Etiketten drucken | Labelpilot.de",
    description:
      "Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen und nachbestellen.",
  },
  "/de/opake-pp-etiketten": {
    title: "Opake PP-Etiketten drucken | Labelpilot.de",
    description:
      "Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
  },
  "/de/pp-rollenetiketten": {
    title: "PP-Rollenetiketten drucken | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.",
  },
  "/de/etiketten-100x200": {
    title: "Etiketten 100×200 mm drucken | Labelpilot.de",
    description:
      "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.",
  },
  "/de/thermo-versandetiketten": {
    title: "Thermo-Versandetiketten 100×150 mm | Labelpilot.de",
    description:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
  },
  "/de/musterbox": {
    title: "Etiketten Musterbox anfordern | Labelpilot.de",
    description:
      "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
  },
  "/de/angebot-anfordern": {
    title: "B2B-Angebot für Etiketten anfordern | Labelpilot.de",
    description:
      "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.",
  },
  "/de/nachbestellen": {
    title: "Etiketten nachbestellen | Labelpilot.de",
    description:
      "Bestellen Sie freigegebene Etiketten schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.",
  },
  "/de/druckdaten": {
    title: "Druckdaten für Etiketten einreichen | Labelpilot.de",
    description:
      "Welche Druckdaten für PP-Rollenetiketten akzeptiert werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung vor der Freigabe.",
  },
  "/de/produktion-versand": {
    title: "Produktion und Versand nach Deutschland | Labelpilot.de",
    description:
      "Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland. Mit späterer Hub-Option.",
  },
  "/de/kontakt": {
    title: "Kontakt | Labelpilot.de",
    description:
      "Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
  },
  "/de/impressum": {
    title: "Impressum | Labelpilot.de",
    description: "Impressum von Labelpilot.de.",
  },
  "/de/datenschutz": {
    title: "Datenschutzerklärung | Labelpilot.de",
    description: "Informationen zum Datenschutz bei Labelpilot.de.",
  },
  "/de/agb": {
    title: "Allgemeine Geschäftsbedingungen | Labelpilot.de",
    description: "Allgemeine Geschäftsbedingungen von Labelpilot.de.",
  },
  "/de/versand": {
    title: "Versandinformationen | Labelpilot.de",
    description:
      "Informationen zu Versand, Lieferung und Produktionsablauf bei Labelpilot.de.",
  },
  "/de/widerruf": {
    title: "Widerruf und Sonderanfertigungen | Labelpilot.de",
    description:
      "Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.",
  },
  "/de/kaffee-etiketten": {
    title: "Kaffee-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Kaffeebeutel und Kaffeemarken. Opake Etiketten für wiederkehrende Produktverpackungen in Deutschland.",
  },
  "/de/gewuerz-etiketten": {
    title: "Gewürz-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Gewürzgläser, Beutel und Verpackungen. Mit gespeicherten Druckdaten für spätere Nachbestellungen.",
  },
  "/de/honig-marmelade-etiketten": {
    title: "Honig- und Marmeladenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Honiggläser, Marmeladengläser und kleine Lebensmittelmarken.",
  },
  "/de/flaschenetiketten": {
    title: "Flaschenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Flaschen, Getränke und Glasverpackungen in Deutschland.",
  },
  "/de/ratgeber": {
    title: "Ratgeber für Etiketten, Materialien und Druckdaten | Labelpilot.de",
    description:
      "Vergleiche, Schritt-für-Schritt-Erklärungen und Kaufhilfen zu PP-Rollenetiketten, Materialwahl, Mengen und Druckdaten.",
  },
  "/de/ratgeber/pp-etiketten-vs-papieretiketten": {
    title: "PP-Etiketten vs. Papieretiketten | Labelpilot.de",
    description:
      "Vergleich von PP-Etiketten und Papieretiketten für Produktverpackungen. Mit Empfehlung für Lebensmittel-, Getränke- und Supplement-Marken.",
    openGraphType: "article",
  },
  "/de/ratgeber/transparente-vs-opake-etiketten": {
    title: "Transparente vs. opake Etiketten | Labelpilot.de",
    description:
      "Vergleich transparenter und opaker PP-Etiketten für Flaschen, Gläser, Dosen und Produktverpackungen.",
    openGraphType: "article",
  },
  "/de/ratgeber/rollenetiketten-vs-bogenetiketten": {
    title: "Rollenetiketten vs. Bogenetiketten | Labelpilot.de",
    description:
      "Wann Rollenetiketten für B2B-Produktmarken sinnvoller sind als Bogenetiketten – besonders bei wiederkehrenden Bestellungen.",
    openGraphType: "article",
  },
  "/de/ratgeber/druckdaten-vorbereiten": {
    title: "Druckdaten für Etiketten vorbereiten | Labelpilot.de",
    description:
      "So bereiten Sie Druckdaten für PP-Rollenetiketten vor. Formate, Beschnitt, Proof und technische Dateiprüfung erklärt.",
    openGraphType: "article",
  },
  "/de/glossar": {
    title: "Glossar für Etikettenbegriffe | Labelpilot.de",
    description:
      "Kurze, AI-lesbare Erklärungen zu Begriffen rund um PP-Rollenetiketten, Druckdaten, Proof und Nachbestellung.",
  },
  "/de/glossar/pp-etiketten": {
    title: "Was sind PP-Etiketten? | Labelpilot.de",
    description:
      "PP-Etiketten kurz erklärt: Material, Einsatzbereiche und Relevanz für Produktverpackungen und Rollenetiketten.",
    openGraphType: "article",
  },
  "/de/glossar/rollenetiketten": {
    title: "Was sind Rollenetiketten? | Labelpilot.de",
    description:
      "Rollenetiketten kurz erklärt: warum sie für wiederkehrende Produktetiketten, B2B-Prozesse und Nachbestellungen relevant sind.",
    openGraphType: "article",
  },
  "/de/glossar/transparente-etiketten": {
    title: "Was sind transparente Etiketten? | Labelpilot.de",
    description:
      "Transparente Etiketten kurz erklärt: Materialwirkung, Sichtbarkeit und Einsatz bei Flaschen, Gläsern und Premium-Verpackungen.",
    openGraphType: "article",
  },
  "/de/glossar/thermoetiketten": {
    title: "Was sind Thermoetiketten? | Labelpilot.de",
    description:
      "Thermoetiketten kurz erklärt: Einsatz in Versand, Lager und Fulfillment – und warum sie im MVP nur als Cross-Sell auftreten.",
    openGraphType: "article",
  },
  "/de/glossar/proof": {
    title: "Was ist ein Proof? | Labelpilot.de",
    description:
      "Proof kurz erklärt: Warum die Freigabe vor Produktion wichtig ist und wie sie spätere Nachbestellungen absichert.",
    openGraphType: "article",
  },
  "/de/glossar/beschnitt": {
    title: "Was ist Beschnitt? | Labelpilot.de",
    description:
      "Beschnitt kurz erklärt: warum ein Sicherheitsrand in Druckdaten wichtig ist und wie er unsaubere Kanten verhindert.",
    openGraphType: "article",
  },
  "/de/glossar/druckdaten": {
    title: "Was sind Druckdaten? | Labelpilot.de",
    description:
      "Druckdaten kurz erklärt: welche Dateien für Etiketten gemeint sind und warum sie für Proof, Freigabe und Nachbestellung wichtig bleiben.",
    openGraphType: "article",
  },
  "/de/glossar/nachbestellung": {
    title: "Was bedeutet Nachbestellung bei Etiketten? | Labelpilot.de",
    description:
      "Nachbestellung kurz erklärt: warum gespeicherte Druckdaten, Material und Größe spätere Abrufe beschleunigen.",
    openGraphType: "article",
  },
};
