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
      "Bedruckte PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Mit technischer Druckdatenprüfung, Musterbox und Nachbestellsystem.",
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
    title: "Lebensmitteletiketten drucken lassen | Labelpilot.de",
    description:
      "Lebensmitteletiketten drucken lassen auf PP-Rolle – für Gläser, Beutel, Flaschen und Verpackungen in Deutschland. Mit geprüften Druckdaten und Nachbestellsystem.",
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
    title: "Supplement-Etiketten drucken lassen | Labelpilot.de",
    description:
      "Supplement-Etiketten drucken lassen auf PP-Rolle – für Dosen, Beutel und Flaschen. Wunschformat, opak oder transparent, mit technischer Dateiprüfung.",
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
    title: "Getränkeetiketten drucken lassen | Labelpilot.de",
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
      "Transparente PP-Rollenetiketten für Flaschen, Gläser und Premium-Verpackungen. Wunschformat, Druckdaten hochladen und nachbestellen.",
    openGraphTitle: "Transparente PP-Etiketten",
    openGraphDescription:
      "No-Label-Look für Flaschen & Gläser – im Wunschformat.",
    keywords: [
      "transparente PP-Etiketten",
      "No-Label-Look Etiketten",
      "transparente Rollenetiketten",
      "Klarsicht-Etiketten",
    ],
  },
  "/de/opake-pp-etiketten": {
    title: "Opake PP-Etiketten drucken lassen | Labelpilot.de",
    description:
      "Opake PP-Rollenetiketten für Lebensmittel-, Supplement- und Produktverpackungen. Wunschformat, ideal für wiederkehrende B2B-Bestellungen.",
    openGraphTitle: "Opake PP-Etiketten drucken",
    openGraphDescription:
      "Deckend-weiße PP-Etiketten im Wunschformat – B2B.",
    keywords: [
      "opake PP-Etiketten",
      "weiße PP-Etiketten",
      "opake Rollenetiketten",
      "PP-Etiketten undurchsichtig",
    ],
  },
  "/de/pp-rollenetiketten": {
    title: "PP-Rollenetiketten drucken lassen | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, Wunschformat, mit gespeicherten Druckdaten.",
    openGraphTitle: "PP-Rollenetiketten drucken",
    openGraphDescription:
      "Opak oder transparent, Wunschformat – für B2B-Marken.",
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
      "PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Opak oder transparent, Wunschformat, mit geprüften Druckdaten und Nachbestellsystem.",
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
    title: "PP-Rollenetiketten drucken lassen – B2B | Labelpilot.de",
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
      "Bedruckte Etiketten auf Rolle aus PP, opak oder transparent. Gängige Formate: 60×40 mm, 100×100 mm. Für Spender und Etikettiermaschinen, DDP nach Deutschland.",
    openGraphTitle: "Bedruckte Etiketten auf Rolle",
    openGraphDescription:
      "PP-Etiketten auf Rolle im Wunschformat – für Spender & Etikettiermaschine.",
    keywords: [
      "Etiketten auf Rolle",
      "bedruckte Etiketten auf Rolle",
      "etiketten bedruckt auf rolle",
      "Etiketten Rolle 100x200",
    ],
  },
  "/de/flaschenetiketten-drucken": {
    title: "Flaschenetiketten drucken lassen – PP | Labelpilot.de",
    description:
      "Flaschenetiketten drucken lassen auf wasserfestem PP – transparent oder opak. Für Getränke, Spirituosen und Öle. Mit geprüften Druckdaten und DDP-Lieferung.",
    openGraphTitle: "Flaschenetiketten drucken lassen",
    openGraphDescription:
      "No-Label-Look oder deckend – PP-Etiketten für Flaschen, wasserfest.",
    keywords: [
      "Flaschenetiketten drucken",
      "Flaschenetiketten drucken lassen",
      "Getränkeetiketten PP",
      "transparente Flaschenetiketten",
    ],
  },
  "/de/weinetiketten-drucken": {
    title: "Weinetiketten drucken lassen – PP | Labelpilot.de",
    description:
      "Weinetiketten drucken lassen auf wasserfestem PP, transparent oder opak. Für Wein, Sekt und Spirituosen – hält im Weinkühler. Mit geprüften Druckdaten und Nachbestellung.",
    openGraphTitle: "Weinetiketten drucken lassen",
    openGraphDescription:
      "Wasserfeste PP-Weinetiketten – hält im Kühler, transparent oder opak.",
    keywords: [
      "Weinetiketten drucken",
      "Weinetiketten drucken lassen",
      "Weinflaschen Etiketten",
      "Spirituosen Etiketten",
    ],
  },
  "/de/barcode-etiketten": {
    title: "Barcode-Etiketten drucken lassen – EAN & GTIN | Labelpilot.de",
    description:
      "Barcode-Etiketten drucken lassen auf PP-Rolle: EAN-13, GTIN, Code 128, QR-Code und GS1 DataMatrix – integriert ins Produktetikett oder separat. Für Handel und Lebensmittel.",
    openGraphTitle: "Barcode-Etiketten drucken lassen",
    openGraphDescription:
      "EAN, GTIN, Code 128, QR & GS1 DataMatrix – scanbar auf PP-Rolle.",
    keywords: [
      "Barcode-Etiketten",
      "EAN Etiketten drucken",
      "GTIN Etiketten",
      "GS1 DataMatrix Etiketten",
    ],
  },
  "/de/folienetiketten": {
    title: "Folienetiketten drucken lassen – PP | Labelpilot.de",
    description:
      "Folienetiketten drucken lassen auf PP-Rolle – wasserfest, reißfest und langlebiger als Papier. Opak oder transparent für Flaschen, Dosen, Tiegel und Beutel in Deutschland.",
    openGraphTitle: "Folienetiketten drucken lassen",
    openGraphDescription:
      "Wasserfeste PP-Folienetiketten – robuster als Papier, opak oder transparent.",
    keywords: [
      "Folienetiketten",
      "Folienetiketten drucken",
      "PP-Folienetiketten",
      "wasserfeste Etiketten",
    ],
  },
  "/de/etiketten-100x200": {
    title: "Etiketten 100×200 mm drucken | Labelpilot.de",
    description:
      "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück, opak oder transparent.",
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
      "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten an – für Wunschformate, Sondermengen oder größere Folgeauflagen. Antwort in 1–2 Werktagen.",
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
    title: "PP-Rollenetiketten schnell nachbestellen | Labelpilot.de",
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
  "/de/unternehmen": {
    title: "Über uns – PP-Rollenetiketten aus Überzeugung | Labelpilot.de",
    description:
      "Labelpilot.de: B2B-Plattform für PP-Rollenetiketten mit Nachbestellsystem. Offen über Produktion in der Türkei, DDP-Lieferung nach Deutschland und Vertragspartner.",
    openGraphTitle: "Über Labelpilot.de",
    openGraphDescription:
      "PP-Rollenetiketten-Spezialist – transparent über Produktion, Lieferung & Partner.",
    keywords: [
      "Labelpilot über uns",
      "Etiketten Hersteller Deutschland",
      "PP-Etiketten Anbieter",
      "DDP Lieferung Etiketten",
    ],
  },
  "/de/kontakt": {
    title: "Kontakt – PP-Etiketten Anfragen | Labelpilot.de",
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
    title: "Impressum – rechtliche Pflichtangaben | Labelpilot.de",
    description:
      "Gesetzliche Pflichtangaben gemäß § 5 TMG für Labelpilot.de – betrieben von Zhenkai Global Trading Ltd., Hongkong, mit Lieferung nach Deutschland.",
    openGraphTitle: "Impressum | Labelpilot.de",
    openGraphDescription: "Gesetzliche Anbieterangaben zu Labelpilot.de.",
    keywords: ["Labelpilot Impressum", "Anbieter Labelpilot"],
  },
  "/de/datenschutz": {
    title: "Datenschutzerklärung – DSGVO | Labelpilot.de",
    description:
      "Informationen zum Datenschutz bei Labelpilot.de gemäß DSGVO und TTDSG: Erhebung, Verarbeitung und Rechte der Nutzer im Überblick.",
    openGraphTitle: "Datenschutz | Labelpilot.de",
    openGraphDescription:
      "Datenschutzerklärung gemäß DSGVO von Labelpilot.de.",
    keywords: ["Datenschutz Labelpilot", "DSGVO Labelpilot"],
  },
  "/de/agb": {
    title: "Allgemeine Geschäftsbedingungen | Labelpilot.de",
    description:
      "Allgemeine Geschäftsbedingungen von Labelpilot.de für Bestellungen, Lieferung, Zahlung und Widerruf im B2B-Etikettenbereich.",
    openGraphTitle: "AGB | Labelpilot.de",
    openGraphDescription: "AGB für Bestellungen bei Labelpilot.de.",
    keywords: ["AGB Labelpilot", "Geschäftsbedingungen Etiketten"],
  },
  "/de/versand": {
    title: "Versand und Lieferzeiten für Etiketten | Labelpilot.de",
    description:
      "Produktions- und Versandzeiten für PP-Rollenetiketten bei Labelpilot.de. Typisch 15–20 Werktage ab Zahlungseingang, DDP-Lieferung nach Deutschland.",
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
      "PP-Rollenetiketten sind Sonderanfertigungen und vom Widerrufsrecht ausgenommen. Informationen zu Reklamationen und Mängelrügen bei Labelpilot.de.",
    openGraphTitle: "Widerruf | Labelpilot.de",
    openGraphDescription:
      "Widerrufsrecht & Sonderanfertigungen bei Labelpilot.de.",
    keywords: ["Widerruf Etiketten", "Sonderanfertigungen Etiketten"],
  },
  "/de/kaffee-etiketten": {
    title: "Kaffee-Etiketten drucken lassen | Labelpilot.de",
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
    title: "Gewürz-Etiketten drucken lassen | Labelpilot.de",
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
      "Transparente und opake PP-Rollenetiketten für Honiggläser, Marmeladengläser und Konservengläser. Mit gespeicherten Druckdaten für schnelle Nachbestellungen.",
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
    title: "Flaschenetiketten drucken lassen | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Flaschen, Getränke und Glasverpackungen in Deutschland. Wasserfest, CMYK-bedruckt, mit geprüften Druckdaten.",
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
    title: "Ratgeber Etiketten – Materialien & Druckdaten | Labelpilot.de",
    description:
      "Vergleiche, Schritt-für-Schritt-Erklärungen und Kaufhilfen zu PP-Rollenetiketten. Themen: Materialwahl, Mengenplanung, Druckdaten und Veredelung für B2B-Marken.",
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
  "/de/ratgeber/lebensmittelkennzeichnung-pflichtangaben": {
    title: "LMIV-Pflichtangaben für Lebensmitteletiketten | Labelpilot.de",
    description:
      "Welche Pflichtangaben nach LMIV auf ein Lebensmitteletikett gehören: Bezeichnung, Zutaten, Allergene, Nährwerte, MHD und Mindestschriftgröße – als praktische Checkliste.",
    openGraphTitle: "LMIV-Pflichtangaben für Lebensmitteletiketten",
    openGraphDescription:
      "Checkliste: Zutaten, Allergene, Nährwerte, MHD & Schriftgröße nach LMIV.",
    openGraphType: "article",
    keywords: [
      "Lebensmittelkennzeichnung Pflichtangaben",
      "LMIV Etiketten",
      "LMIV Pflichtangaben",
      "Allergenkennzeichnung Etikett",
    ],
  },
  "/de/ratgeber/pp-etiketten-materialvergleich": {
    title: "PP, PE und PET: Etikettenfolien im Vergleich | Labelpilot.de",
    description:
      "PP, PE und PET im Vergleich: Beständigkeit, Flexibilität und Einsatz für Etiketten – und warum PP für die meisten Produktverpackungen die beste Wahl ist.",
    openGraphTitle: "PP vs. PE vs. PET – Etikettenfolien im Vergleich",
    openGraphDescription:
      "Folienmaterialien für Etiketten: Eigenschaften und Einsatz von PP, PE & PET.",
    openGraphType: "article",
    keywords: [
      "PP PE PET Vergleich",
      "Etiketten Folienmaterial",
      "pp etiketten material",
      "Folienetiketten Material",
    ],
  },
  "/de/ratgeber/druckdaten-rollenetiketten": {
    title: "Druckdaten für Rollenetiketten vorbereiten | Labelpilot.de",
    description:
      "Rollenetiketten-Druckdaten richtig anlegen: Beschnitt, Stanzkontur, 300 dpi, CMYK und Weißunterdruck bei transparentem PP – Checkliste für die Produktion.",
    openGraphTitle: "Druckdaten für Rollenetiketten vorbereiten",
    openGraphDescription:
      "Beschnitt, Stanzkontur, CMYK & Weißunterdruck – Checkliste für Rollenetiketten.",
    openGraphType: "article",
    keywords: [
      "Druckdaten Rollenetiketten",
      "Etiketten Druckdaten vorbereiten",
      "Weißunterdruck transparente Etiketten",
      "Stanzkontur Etiketten",
    ],
  },
  "/de/ratgeber/rollenetiketten-startups-kleinauflage": {
    title: "Rollenetiketten für Startups: Auflage wählen | Labelpilot.de",
    description:
      "1.000 oder 5.000 Etiketten? Mengenvergleich für junge Produktmarken: Stückpreis, Lagerrisiko und einmalige Artwork-Investition – mit klarer Empfehlung.",
    openGraphTitle: "Rollenetiketten für Startups – welche Auflage?",
    openGraphDescription:
      "1.000 vs. 5.000 Stück: Stückpreis, Risiko & Artwork-Investition im Vergleich.",
    openGraphType: "article",
    keywords: [
      "Rollenetiketten kleine Auflage",
      "Etiketten Kleinmenge",
      "Etiketten Startup",
      "Etiketten ab 1000 Stück",
    ],
  },
  "/de/ratgeber/transparente-vs-opake-etiketten": {
    title: "Transparente vs. opake Etiketten | Labelpilot.de",
    description:
      "Transparente oder opake PP-Etiketten? Vergleich für Flaschen, Gläser und Dosen – mit klarer Empfehlung für verschiedene Branchen und Verpackungsarten.",
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
      "Druckdaten für PP-Rollenetiketten vorbereiten: akzeptierte Formate, Farbmodus CMYK, Beschnitt und Proof-Freigabe Schritt für Schritt erklärt.",
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
      "Erklärungen zu Fachbegriffen rund um PP-Rollenetiketten, Druckdaten, Proof und Nachbestellung – kompakt und AI-lesbar für Einkäufer und Produktmarken.",
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
    title: "Was sind PP-Etiketten? Erklärung & Einsatz | Labelpilot.de",
    description:
      "PP-Etiketten kurz erklärt: Polypropylenfolie für Produktverpackungen – wasserfest, reißfest und geeignet für Lebensmittel, Getränke und Supplemente.",
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
    title: "Was ist ein Proof bei Etiketten? | Labelpilot.de",
    description:
      "Proof kurz erklärt: Die Druckfreigabe vor der Produktion – warum sie wichtig ist, wie sie abläuft und wie sie spätere Nachbestellungen absichert.",
    openGraphTitle: "Was ist ein Proof?",
    openGraphDescription:
      "Druckfreigabe erklärt – warum der Proof Produktion sichert.",
    openGraphType: "article",
    keywords: ["Proof Etiketten", "Druckfreigabe Etiketten"],
  },
  "/de/glossar/beschnitt": {
    title: "Was ist Beschnitt bei Etiketten? | Labelpilot.de",
    description:
      "Beschnitt kurz erklärt: warum ein Sicherheitsrand in Druckdaten nötig ist, wie er angelegt wird und wie er unsaubere Schnittkanten verhindert.",
    openGraphTitle: "Was ist Beschnitt?",
    openGraphDescription:
      "Beschnitt in Druckdaten – für saubere Kanten bei Etiketten.",
    openGraphType: "article",
    keywords: ["Beschnitt Druckdaten", "Beschnitt Etiketten", "Anschnitt Etiketten"],
  },
  "/de/glossar/druckdaten": {
    title: "Was sind Druckdaten für Etiketten? | Labelpilot.de",
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
      "Nachbestellung kurz erklärt: wie gespeicherte Druckdaten, Material und Maß spätere Auftragsabrufe beschleunigen – und warum das für B2B-Marken wichtig ist.",
    openGraphTitle: "Was ist Nachbestellung?",
    openGraphDescription:
      "Etiketten schnell erneut bestellen – Druckdaten gespeichert.",
    openGraphType: "article",
    keywords: ["Nachbestellung Etiketten", "Etiketten Wiederbestellung"],
  },
};
