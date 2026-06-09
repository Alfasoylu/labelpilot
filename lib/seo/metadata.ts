export type MetadataEntry = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphType?: "website" | "article";
  keywords?: string[];
};

export const metadataMap: Record<string, MetadataEntry> = {
  "/de": {
    title: "PP-Rollenetiketten für Marken in Deutschland | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Mit technischer Druckdatenprüfung, Musterbox und einfacher Nachbestellung.",
    openGraphTitle: "Labelpilot – PP-Etiketten B2B",
    openGraphDescription:
      "PP-Rollenetiketten für Lebensmittel, Getränke & Supplemente.",
    keywords: [
      "PP-Rollenetiketten",
      "PP-Etiketten",
      "Rollenetiketten B2B",
      "Etiketten Deutschland",
      "Lebensmitteletiketten",
      "Supplement-Etiketten",
      "Getränkeetiketten",
    ],
  },
  "/de/lebensmittel-etiketten": {
    title: "Lebensmitteletiketten drucken | Labelpilot.de",
    description:
      "Bedruckte PP-Rollenetiketten für Lebensmittelmarken in Deutschland. Geeignet für Gläser, Beutel, Flaschen und Verpackungen.",
    openGraphTitle: "Lebensmitteletiketten drucken",
    openGraphDescription:
      "PP-Etiketten für Gläser, Beutel & Flaschen – B2B.",
    keywords: [
      "Lebensmitteletiketten",
      "PP-Etiketten Lebensmittel",
      "Etiketten Gläser",
      "Etiketten Beutel",
    ],
  },
  "/de/supplement-etiketten": {
    title: "Supplement-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.",
    openGraphTitle: "Supplement-Etiketten drucken",
    openGraphDescription:
      "PP-Etiketten für Dosen, Beutel & Supplement-Marken.",
    keywords: [
      "Supplement-Etiketten",
      "PP-Etiketten Supplements",
      "Etiketten Nahrungsergänzung",
      "Chargennummer Etiketten",
    ],
  },
  "/de/getraenke-etiketten": {
    title: "Getränkeetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.",
    openGraphTitle: "Getränkeetiketten drucken",
    openGraphDescription:
      "Transparente & opake PP-Etiketten für Getränkeflaschen.",
    keywords: [
      "Getränkeetiketten",
      "Flaschenetiketten PP",
      "PP-Etiketten Getränke",
      "transparente Etiketten Flasche",
    ],
  },
  "/de/transparente-pp-etiketten": {
    title: "Transparente PP-Etiketten drucken | Labelpilot.de",
    description:
      "Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen und nachbestellen.",
    openGraphTitle: "Transparente PP-Etiketten",
    openGraphDescription:
      "No-Label-Look für Flaschen & Gläser – 100×200 mm.",
    keywords: [
      "transparente PP-Etiketten",
      "No-Label-Look Etiketten",
      "transparente Rollenetiketten",
      "Klarsicht-Etiketten",
    ],
  },
  "/de/opake-pp-etiketten": {
    title: "Opake PP-Etiketten drucken | Labelpilot.de",
    description:
      "Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
    openGraphTitle: "Opake PP-Etiketten drucken",
    openGraphDescription:
      "Deckend-weiße PP-Etiketten, 100×200 mm – B2B.",
    keywords: [
      "opake PP-Etiketten",
      "weiße PP-Etiketten",
      "opake Rollenetiketten",
      "PP-Etiketten undurchsichtig",
    ],
  },
  "/de/pp-rollenetiketten": {
    title: "PP-Rollenetiketten drucken | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.",
    openGraphTitle: "PP-Rollenetiketten drucken",
    openGraphDescription:
      "Opak oder transparent, 100×200 mm – für B2B-Marken.",
    keywords: [
      "PP-Rollenetiketten",
      "PP-Etiketten kaufen",
      "Rollenetiketten bestellen",
      "PP opak transparent",
    ],
  },
  "/de/rollenetiketten": {
    title: "Rollenetiketten drucken lassen | Labelpilot.de",
    description:
      "Bedruckte Rollenetiketten aus PP für Lebensmittel-, Getränke- und Supplement-Marken. Opak oder transparent, mit geprüften Druckdaten und einfacher Nachbestellung. Lieferung DDP nach Deutschland.",
    openGraphTitle: "Rollenetiketten drucken lassen",
    openGraphDescription:
      "PP-Rollenetiketten opak oder transparent – B2B, mit Nachbestellsystem.",
    keywords: [
      "Rollenetiketten",
      "Rollenetiketten drucken",
      "Rollenetiketten bestellen",
      "PP-Rollenetiketten B2B",
    ],
  },
  "/de/rollenetiketten-drucken": {
    title: "Rollenetiketten drucken lassen – PP für B2B | Labelpilot.de",
    description:
      "PP-Rollenetiketten drucken lassen mit technischer Druckdatenprüfung, Proof und gespeicherten Daten für jede Nachbestellung. 4/0-farbig CMYK ohne Einrichtungskosten.",
    openGraphTitle: "Rollenetiketten drucken lassen",
    openGraphDescription:
      "CMYK-Digitaldruck, Datenprüfung & Proof inklusive – DDP nach Deutschland.",
    keywords: [
      "Rollenetiketten drucken",
      "Rollenetiketten drucken lassen",
      "Etiketten auf Rolle drucken",
      "PP-Etiketten Druckservice",
    ],
  },
  "/de/etiketten-auf-rolle": {
    title: "Bedruckte Etiketten auf Rolle – 100×200 mm PP | Labelpilot.de",
    description:
      "Bedruckte Etiketten auf Rolle aus PP im Format 100×200 mm, opak oder transparent. Für Spender und Etikettiermaschinen. Lieferung DDP nach Deutschland.",
    openGraphTitle: "Bedruckte Etiketten auf Rolle",
    openGraphDescription:
      "PP-Etiketten auf Rolle, 100×200 mm – für Spender & Etikettiermaschine.",
    keywords: [
      "Etiketten auf Rolle",
      "bedruckte Etiketten auf Rolle",
      "etiketten bedruckt auf rolle",
      "Etiketten Rolle 100x200",
    ],
  },
  "/de/etiketten-100x200": {
    title: "Etiketten 100×200 mm drucken | Labelpilot.de",
    description:
      "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.",
    openGraphTitle: "Etiketten 100×200 mm drucken",
    openGraphDescription:
      "100×200 mm PP-Etiketten ab 1.000 Stück für Produktmarken.",
    keywords: [
      "Etiketten 100x200",
      "Etiketten 100×200 mm",
      "PP-Etiketten 100×200",
    ],
  },
  "/de/thermo-versandetiketten": {
    title: "Thermo-Versandetiketten 100×150 mm | Labelpilot.de",
    description:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
    openGraphTitle: "Thermo-Versandetiketten",
    openGraphDescription:
      "Thermoetiketten 100×150 mm für Versand & Logistik – B2B.",
    keywords: [
      "Thermo-Versandetiketten",
      "Thermoetiketten",
      "Versandetiketten Zebra",
      "Thermodirektdruck B2B",
    ],
  },
  "/de/musterbox": {
    title: "Etiketten Musterbox anfordern | Labelpilot.de",
    description:
      "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
    openGraphTitle: "Etiketten Musterbox anfordern",
    openGraphDescription:
      "Kostenlose Probe: opak, transparent & Thermoetiketten.",
    keywords: [
      "Etiketten Muster",
      "PP-Etiketten Muster",
      "Musterbox Etiketten",
      "Etiketten Probe kostenlos",
    ],
  },
  "/de/angebot-anfordern": {
    title: "B2B-Angebot für Etiketten anfordern | Labelpilot.de",
    description:
      "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.",
    openGraphTitle: "B2B-Angebot für Etiketten",
    openGraphDescription:
      "Angebot für PP-Etiketten & Thermoetiketten anfordern.",
    keywords: [
      "Etiketten Angebot",
      "PP-Etiketten Angebot B2B",
      "B2B Etiketten Hersteller",
    ],
  },
  "/de/nachbestellen": {
    title: "Etiketten nachbestellen | Labelpilot.de",
    description:
      "Bestellen Sie freigegebene Etiketten schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.",
    openGraphTitle: "Etiketten nachbestellen",
    openGraphDescription:
      "30-Sek. Nachbestellung – Druckdaten gespeichert.",
    keywords: [
      "Etiketten nachbestellen",
      "Rollenetiketten Nachbestellung",
      "Druckdaten gespeichert",
    ],
  },
  "/de/druckdaten": {
    title: "Druckdaten für Etiketten einreichen | Labelpilot.de",
    description:
      "Welche Druckdaten für PP-Rollenetiketten akzeptiert werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung vor der Freigabe.",
    openGraphTitle: "Druckdaten für Etiketten",
    openGraphDescription:
      "PDF, AI, EPS akzeptiert – mit kostenloser Druckdatenprüfung.",
    keywords: [
      "Druckdaten Etiketten",
      "Druckdaten PDF Etiketten",
      "Druckdatenprüfung Etiketten",
      "Etiketten PDF einreichen",
    ],
  },
  "/de/produktion-versand": {
    title: "Produktion und Versand nach Deutschland | Labelpilot.de",
    description:
      "Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland. Mit späterer Hub-Option.",
    openGraphTitle: "Produktion & Versand | Labelpilot",
    openGraphDescription:
      "Produktion & Lieferung nach Deutschland – B2B-Etiketten.",
    keywords: [
      "Etiketten Lieferung Deutschland",
      "PP-Etiketten Versand",
      "B2B Etiketten Lieferzeit",
    ],
  },
  "/de/kontakt": {
    title: "Kontakt | Labelpilot.de",
    description:
      "Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
    openGraphTitle: "Kontakt – Labelpilot.de",
    openGraphDescription:
      "Fragen zu Etiketten, Druckdaten oder Angeboten?",
    keywords: [
      "Labelpilot Kontakt",
      "Etiketten Anbieter",
      "Etiketten Hersteller Deutschland",
    ],
  },
  "/de/impressum": {
    title: "Impressum | Labelpilot.de",
    description: "Impressum von Labelpilot.de.",
    openGraphTitle: "Impressum | Labelpilot.de",
    openGraphDescription: "Gesetzliche Anbieterangaben zu Labelpilot.de.",
    keywords: ["Labelpilot Impressum", "Anbieter Labelpilot"],
  },
  "/de/datenschutz": {
    title: "Datenschutzerklärung | Labelpilot.de",
    description: "Informationen zum Datenschutz bei Labelpilot.de.",
    openGraphTitle: "Datenschutz | Labelpilot.de",
    openGraphDescription:
      "Datenschutzerklärung gemäß DSGVO von Labelpilot.de.",
    keywords: ["Datenschutz Labelpilot", "DSGVO Labelpilot"],
  },
  "/de/agb": {
    title: "Allgemeine Geschäftsbedingungen | Labelpilot.de",
    description: "Allgemeine Geschäftsbedingungen von Labelpilot.de.",
    openGraphTitle: "AGB | Labelpilot.de",
    openGraphDescription: "AGB für Bestellungen bei Labelpilot.de.",
    keywords: ["AGB Labelpilot", "Geschäftsbedingungen Etiketten"],
  },
  "/de/versand": {
    title: "Versandinformationen | Labelpilot.de",
    description:
      "Informationen zu Versand, Lieferung und Produktionsablauf bei Labelpilot.de.",
    openGraphTitle: "Versand & Lieferung | Labelpilot",
    openGraphDescription:
      "Lieferzeiten, Versandkosten & Lieferregionen erklärt.",
    keywords: [
      "Etiketten Versand",
      "PP-Etiketten Lieferzeit",
      "Etiketten Lieferkosten",
    ],
  },
  "/de/widerruf": {
    title: "Widerruf und Sonderanfertigungen | Labelpilot.de",
    description:
      "Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.",
    openGraphTitle: "Widerruf | Labelpilot.de",
    openGraphDescription:
      "Widerrufsrecht & Sonderanfertigungen bei Labelpilot.de.",
    keywords: ["Widerruf Etiketten", "Sonderanfertigungen Etiketten"],
  },
  "/de/kaffee-etiketten": {
    title: "Kaffee-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Kaffeebeutel und Kaffeemarken. Opake Etiketten für wiederkehrende Produktverpackungen in Deutschland.",
    openGraphTitle: "Kaffee-Etiketten drucken",
    openGraphDescription:
      "PP-Rollenetiketten für Kaffeebeutel & Kaffeemarken.",
    keywords: [
      "Kaffee-Etiketten",
      "PP-Etiketten Kaffee",
      "Kaffeebeutel Etiketten",
      "Kaffeemarke Etiketten",
    ],
  },
  "/de/gewuerz-etiketten": {
    title: "Gewürz-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Gewürzgläser, Beutel und Verpackungen. Mit gespeicherten Druckdaten für spätere Nachbestellungen.",
    openGraphTitle: "Gewürz-Etiketten drucken",
    openGraphDescription:
      "PP-Rollenetiketten für Gewürzgläser & Beutel – B2B.",
    keywords: [
      "Gewürz-Etiketten",
      "PP-Etiketten Gewürze",
      "Gewürzgläser Etiketten",
    ],
  },
  "/de/honig-marmelade-etiketten": {
    title: "Honig- und Marmeladenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Honiggläser, Marmeladengläser und kleine Lebensmittelmarken.",
    openGraphTitle: "Honig- & Marmeladenetiketten",
    openGraphDescription:
      "PP-Etiketten für Honiggläser & Marmeladen.",
    keywords: [
      "Honig-Etiketten",
      "Marmeladenetiketten",
      "PP-Etiketten Honiggläser",
      "Glaetiketten Lebensmittel",
    ],
  },
  "/de/flaschenetiketten": {
    title: "Flaschenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Flaschen, Getränke und Glasverpackungen in Deutschland.",
    openGraphTitle: "Flaschenetiketten drucken",
    openGraphDescription:
      "Transparente & opake PP-Etiketten für Flaschen – B2B.",
    keywords: [
      "Flaschenetiketten",
      "PP-Etiketten Flasche",
      "transparente Flaschenetiketten",
    ],
  },
  "/de/ratgeber": {
    title: "Ratgeber für Etiketten, Materialien und Druckdaten | Labelpilot.de",
    description:
      "Vergleiche, Schritt-für-Schritt-Erklärungen und Kaufhilfen zu PP-Rollenetiketten, Materialwahl, Mengen und Druckdaten.",
    openGraphTitle: "Ratgeber Etiketten | Labelpilot",
    openGraphDescription:
      "Fachwissen zu Material, Druckdaten & Veredelung für Marken.",
    keywords: [
      "Etiketten Ratgeber",
      "PP-Etiketten Kaufhilfe",
      "Etiketten Druckdaten Ratgeber",
    ],
  },
  "/de/ratgeber/pp-etiketten-vs-papieretiketten": {
    title: "PP-Etiketten vs. Papieretiketten | Labelpilot.de",
    description:
      "Vergleich von PP-Etiketten und Papieretiketten für Produktverpackungen. Mit Empfehlung für Lebensmittel-, Getränke- und Supplement-Marken.",
    openGraphTitle: "PP vs. Papier – Etiketten Vergleich",
    openGraphDescription:
      "Welches Material ist besser? PP-Etiketten vs. Papier erklärt.",
    openGraphType: "article",
    keywords: [
      "PP-Etiketten vs Papier",
      "Etiketten Material Vergleich",
      "PP oder Papier Etiketten",
    ],
  },
  "/de/ratgeber/transparente-vs-opake-etiketten": {
    title: "Transparente vs. opake Etiketten | Labelpilot.de",
    description:
      "Vergleich transparenter und opaker PP-Etiketten für Flaschen, Gläser, Dosen und Produktverpackungen.",
    openGraphTitle: "Transparent vs. opak – PP-Etiketten",
    openGraphDescription:
      "Welche Folie passt zur Verpackung? Vergleich mit Empfehlung.",
    openGraphType: "article",
    keywords: [
      "transparente Etiketten",
      "opake Etiketten Vergleich",
      "PP-Etiketten transparent opak",
    ],
  },
  "/de/ratgeber/rollenetiketten-vs-bogenetiketten": {
    title: "Rollenetiketten vs. Bogenetiketten | Labelpilot.de",
    description:
      "Wann Rollenetiketten für B2B-Produktmarken sinnvoller sind als Bogenetiketten – besonders bei wiederkehrenden Bestellungen.",
    openGraphTitle: "Rollenetiketten vs. Bogenetiketten",
    openGraphDescription:
      "Wann Rollenetiketten für B2B-Marken besser geeignet sind.",
    openGraphType: "article",
    keywords: [
      "Rollenetiketten Vergleich",
      "Bogenetiketten vs Rollenetiketten",
      "Rollenetiketten B2B",
    ],
  },
  "/de/ratgeber/druckdaten-vorbereiten": {
    title: "Druckdaten für Etiketten vorbereiten | Labelpilot.de",
    description:
      "So bereiten Sie Druckdaten für PP-Rollenetiketten vor. Formate, Beschnitt, Proof und technische Dateiprüfung erklärt.",
    openGraphTitle: "Druckdaten vorbereiten",
    openGraphDescription:
      "Formate, Beschnitt & Proof – Schritt für Schritt für Etiketten.",
    openGraphType: "article",
    keywords: [
      "Druckdaten vorbereiten",
      "Druckdaten PDF Etiketten",
      "Beschnitt Etiketten",
      "Druckdaten Proof",
    ],
  },
  "/de/glossar": {
    title: "Glossar für Etikettenbegriffe | Labelpilot.de",
    description:
      "Kurze, AI-lesbare Erklärungen zu Begriffen rund um PP-Rollenetiketten, Druckdaten, Proof und Nachbestellung.",
    openGraphTitle: "Glossar | Labelpilot.de",
    openGraphDescription:
      "Etikettenbegriffe von A–Z: Proof, Beschnitt, CMYK & mehr.",
    keywords: [
      "Etiketten Glossar",
      "Druckbegriffe Etiketten",
      "Etiketten Fachbegriffe",
    ],
  },
  "/de/glossar/pp-etiketten": {
    title: "Was sind PP-Etiketten? | Labelpilot.de",
    description:
      "PP-Etiketten kurz erklärt: Material, Einsatzbereiche und Relevanz für Produktverpackungen und Rollenetiketten.",
    openGraphTitle: "Was sind PP-Etiketten?",
    openGraphDescription:
      "PP-Etiketten kurz erklärt – Material, Einsatz & Vorteile.",
    openGraphType: "article",
    keywords: ["PP-Etiketten Definition", "PP Polypropylene Etiketten"],
  },
  "/de/glossar/rollenetiketten": {
    title: "Was sind Rollenetiketten? | Labelpilot.de",
    description:
      "Rollenetiketten kurz erklärt: warum sie für wiederkehrende Produktetiketten, B2B-Prozesse und Nachbestellungen relevant sind.",
    openGraphTitle: "Was sind Rollenetiketten?",
    openGraphDescription:
      "Rollenetiketten für B2B – Vorteile & Nachbestellprozess.",
    openGraphType: "article",
    keywords: ["Rollenetiketten Definition", "Rollenetiketten kaufen"],
  },
  "/de/glossar/transparente-etiketten": {
    title: "Was sind transparente Etiketten? | Labelpilot.de",
    description:
      "Transparente Etiketten kurz erklärt: Materialwirkung, Sichtbarkeit und Einsatz bei Flaschen, Gläsern und Premium-Verpackungen.",
    openGraphTitle: "Was sind transparente Etiketten?",
    openGraphDescription:
      "No-Label-Look erklärt – Wirkung auf Flaschen & Gläsern.",
    openGraphType: "article",
    keywords: ["transparente Etiketten Definition", "No-Label-Look"],
  },
  "/de/glossar/thermoetiketten": {
    title: "Was sind Thermoetiketten? | Labelpilot.de",
    description:
      "Thermoetiketten kurz erklärt: Einsatz in Versand, Lager und Fulfillment – und warum sie im MVP nur als Cross-Sell auftreten.",
    openGraphTitle: "Was sind Thermoetiketten?",
    openGraphDescription:
      "Thermodirektdruck erklärt – Einsatz in Versand & Logistik.",
    openGraphType: "article",
    keywords: [
      "Thermoetiketten Definition",
      "Thermodirektdruck",
      "Versandetiketten Definition",
    ],
  },
  "/de/glossar/proof": {
    title: "Was ist ein Proof? | Labelpilot.de",
    description:
      "Proof kurz erklärt: Warum die Freigabe vor Produktion wichtig ist und wie sie spätere Nachbestellungen absichert.",
    openGraphTitle: "Was ist ein Proof?",
    openGraphDescription:
      "Druckfreigabe erklärt – warum der Proof Produktion sichert.",
    openGraphType: "article",
    keywords: ["Proof Etiketten", "Druckfreigabe Etiketten"],
  },
  "/de/glossar/beschnitt": {
    title: "Was ist Beschnitt? | Labelpilot.de",
    description:
      "Beschnitt kurz erklärt: warum ein Sicherheitsrand in Druckdaten wichtig ist und wie er unsaubere Kanten verhindert.",
    openGraphTitle: "Was ist Beschnitt?",
    openGraphDescription:
      "Beschnitt in Druckdaten – für saubere Kanten bei Etiketten.",
    openGraphType: "article",
    keywords: ["Beschnitt Druckdaten", "Beschnitt Etiketten", "Anschnitt Etiketten"],
  },
  "/de/glossar/druckdaten": {
    title: "Was sind Druckdaten? | Labelpilot.de",
    description:
      "Druckdaten kurz erklärt: welche Dateien für Etiketten gemeint sind und warum sie für Proof, Freigabe und Nachbestellung wichtig bleiben.",
    openGraphTitle: "Was sind Druckdaten?",
    openGraphDescription:
      "Druckdateien erklärt – für Proof, Freigabe und Nachbestellung.",
    openGraphType: "article",
    keywords: ["Druckdaten Definition", "Druckdaten Etiketten Dateiformate"],
  },
  "/de/glossar/nachbestellung": {
    title: "Was bedeutet Nachbestellung bei Etiketten? | Labelpilot.de",
    description:
      "Nachbestellung kurz erklärt: warum gespeicherte Druckdaten, Material und Größe spätere Abrufe beschleunigen.",
    openGraphTitle: "Was ist Nachbestellung?",
    openGraphDescription:
      "Etiketten schnell erneut bestellen – Druckdaten gespeichert.",
    openGraphType: "article",
    keywords: ["Nachbestellung Etiketten", "Etiketten Wiederbestellung"],
  },
};
