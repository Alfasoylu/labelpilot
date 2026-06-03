export type MetadataEntry = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphType?: "website" | "article";
};

export const metadataMap: Record<string, MetadataEntry> = {
  "/de": {
    title: "PP-Rollenetiketten fÃ¼r Marken in Deutschland | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten fÃ¼r Lebensmittel-, GetrÃ¤nke- und Supplement-Marken. Mit technischer DruckdatenprÃ¼fung, Musterbox und einfacher Nachbestellung.",
    openGraphTitle: "PP-Rollenetiketten fÃ¼r Marken in Deutschland",
    openGraphDescription:
      "Labelpilot.de liefert individuell bedruckte PP-Rollenetiketten fÃ¼r deutsche B2B-Marken mit gespeicherten Druckdaten und einfacher Nachbestellung.",
  },
  "/de/lebensmittel-etiketten": {
    title: "Lebensmitteletiketten drucken | Labelpilot.de",
    description:
      "Bedruckte PP-Rollenetiketten fÃ¼r Lebensmittelmarken in Deutschland. Geeignet fÃ¼r GlÃ¤ser, Beutel, Flaschen und Verpackungen.",
  },
  "/de/supplement-etiketten": {
    title: "Supplement-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten fÃ¼r Supplement-Dosen, Beutel und Flaschen. 100Ã—200 mm, opak oder transparent, mit technischer DateiprÃ¼fung.",
  },
  "/de/getraenke-etiketten": {
    title: "GetrÃ¤nkeetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten fÃ¼r GetrÃ¤nke, Flaschen und Glasverpackungen. FÃ¼r Marken in Deutschland mit einfacher Nachbestellung.",
  },
  "/de/transparente-pp-etiketten": {
    title: "Transparente PP-Etiketten drucken | Labelpilot.de",
    description:
      "Transparente PP-Rollenetiketten 100Ã—200 mm fÃ¼r Flaschen, GlÃ¤ser und Premium-Verpackungen. Druckdaten hochladen und nachbestellen.",
  },
  "/de/opake-pp-etiketten": {
    title: "Opake PP-Etiketten drucken | Labelpilot.de",
    description:
      "Opake PP-Rollenetiketten 100Ã—200 mm fÃ¼r Lebensmittel-, Supplement- und Produktverpackungen. Ideal fÃ¼r wiederkehrende B2B-Bestellungen.",
  },
  "/de/pp-rollenetiketten": {
    title: "PP-Rollenetiketten drucken | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten fÃ¼r deutsche B2B-Marken. Opak oder transparent, 100Ã—200 mm, mit gespeicherten Druckdaten.",
  },
  "/de/etiketten-100x200": {
    title: "Etiketten 100Ã—200 mm drucken | Labelpilot.de",
    description:
      "100Ã—200 mm PP-Rollenetiketten fÃ¼r Produktverpackungen. Geeignet fÃ¼r Lebensmittel, GetrÃ¤nke und Supplemente. Mengen ab 1.000 StÃ¼ck.",
  },
  "/de/thermo-versandetiketten": {
    title: "Thermo-Versandetiketten 100Ã—150 mm | Labelpilot.de",
    description:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-ErgÃ¤nzung zu Produktetiketten. FÃ¼r Versand, Lager und Fulfillment-Prozesse.",
  },
  "/de/musterbox": {
    title: "Etiketten Musterbox anfordern | Labelpilot.de",
    description:
      "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
  },
  "/de/angebot-anfordern": {
    title: "B2B-Angebot fÃ¼r Etiketten anfordern | Labelpilot.de",
    description:
      "Fordern Sie ein individuelles B2B-Angebot fÃ¼r PP-Rollenetiketten, Thermoetiketten oder grÃ¶ÃŸere Etikettenmengen an.",
  },
  "/de/nachbestellen": {
    title: "Etiketten nachbestellen | Labelpilot.de",
    description:
      "Bestellen Sie freigegebene Etiketten schneller erneut. Labelpilot.de speichert Druckdaten, Material, GrÃ¶ÃŸe und StÃ¼ckzahl fÃ¼r Nachbestellungen.",
  },
  "/de/druckdaten": {
    title: "Druckdaten fÃ¼r Etiketten vorbereiten | Labelpilot.de",
    description:
      "Welche Druckdaten fÃ¼r PP-Rollenetiketten benÃ¶tigt werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer DateiprÃ¼fung.",
  },
  "/de/produktion-versand": {
    title: "Produktion und Versand nach Deutschland | Labelpilot.de",
    description:
      "Labelpilot.de produziert Etiketten kosteneffizient in der TÃ¼rkei und liefert an B2B-Kunden in Deutschland. Mit spÃ¤terer Hub-Option.",
  },
  "/de/kontakt": {
    title: "Kontakt | Labelpilot.de",
    description:
      "Kontaktieren Sie Labelpilot.de fÃ¼r Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
  },
  "/de/impressum": {
    title: "Impressum | Labelpilot.de",
    description: "Impressum von Labelpilot.de.",
  },
  "/de/datenschutz": {
    title: "DatenschutzerklÃ¤rung | Labelpilot.de",
    description: "Informationen zum Datenschutz bei Labelpilot.de.",
  },
  "/de/agb": {
    title: "Allgemeine GeschÃ¤ftsbedingungen | Labelpilot.de",
    description: "Allgemeine GeschÃ¤ftsbedingungen von Labelpilot.de.",
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
      "PP-Rollenetiketten fÃ¼r Kaffeebeutel und Kaffeemarken. Opake Etiketten fÃ¼r wiederkehrende Produktverpackungen in Deutschland.",
  },
  "/de/gewuerz-etiketten": {
    title: "GewÃ¼rz-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten fÃ¼r GewÃ¼rzglÃ¤ser, Beutel und Verpackungen. Mit gespeicherten Druckdaten fÃ¼r spÃ¤tere Nachbestellungen.",
  },
  "/de/honig-marmelade-etiketten": {
    title: "Honig- und Marmeladenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten fÃ¼r HonigglÃ¤ser, MarmeladenglÃ¤ser und kleine Lebensmittelmarken.",
  },
  "/de/flaschenetiketten": {
    title: "Flaschenetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten fÃ¼r Flaschen, GetrÃ¤nke und Glasverpackungen in Deutschland.",
  },
  "/de/ratgeber": {
    title: "Ratgeber fÃ¼r Etiketten, Materialien und Druckdaten | Labelpilot.de",
    description:
      "Vergleiche, Schritt-fÃ¼r-Schritt-ErklÃ¤rungen und Kaufhilfen zu PP-Rollenetiketten, Materialwahl, Mengen und Druckdaten.",
  },
  "/de/ratgeber/pp-etiketten-vs-papieretiketten": {
    title: "PP-Etiketten vs. Papieretiketten | Labelpilot.de",
    description:
      "Vergleich von PP-Etiketten und Papieretiketten fÃ¼r Produktverpackungen. Mit Empfehlung fÃ¼r Lebensmittel-, GetrÃ¤nke- und Supplement-Marken.",
    openGraphType: "article",
  },
  "/de/ratgeber/transparente-vs-opake-etiketten": {
    title: "Transparente vs. opake Etiketten | Labelpilot.de",
    description:
      "Vergleich transparenter und opaker PP-Etiketten fÃ¼r Flaschen, GlÃ¤ser, Dosen und Produktverpackungen.",
    openGraphType: "article",
  },
  "/de/ratgeber/rollenetiketten-vs-bogenetiketten": {
    title: "Rollenetiketten vs. Bogenetiketten | Labelpilot.de",
    description:
      "Wann Rollenetiketten fÃ¼r B2B-Produktmarken sinnvoller sind als Bogenetiketten â€“ besonders bei wiederkehrenden Bestellungen.",
    openGraphType: "article",
  },
  "/de/ratgeber/druckdaten-vorbereiten": {
    title: "Druckdaten fÃ¼r Etiketten vorbereiten | Labelpilot.de",
    description:
      "So bereiten Sie Druckdaten fÃ¼r PP-Rollenetiketten vor. Formate, Beschnitt, Proof und technische DateiprÃ¼fung erklÃ¤rt.",
    openGraphType: "article",
  },
  "/de/glossar": {
    title: "Glossar fÃ¼r Etikettenbegriffe | Labelpilot.de",
    description:
      "Kurze, AI-lesbare ErklÃ¤rungen zu Begriffen rund um PP-Rollenetiketten, Druckdaten, Proof und Nachbestellung.",
  },
  "/de/glossar/pp-etiketten": {
    title: "Was sind PP-Etiketten? | Labelpilot.de",
    description:
      "PP-Etiketten kurz erklÃ¤rt: Material, Einsatzbereiche und Relevanz fÃ¼r Produktverpackungen und Rollenetiketten.",
    openGraphType: "article",
  },
  "/de/glossar/rollenetiketten": {
    title: "Was sind Rollenetiketten? | Labelpilot.de",
    description:
      "Rollenetiketten kurz erklÃ¤rt: warum sie fÃ¼r wiederkehrende Produktetiketten, B2B-Prozesse und Nachbestellungen relevant sind.",
    openGraphType: "article",
  },
  "/de/glossar/transparente-etiketten": {
    title: "Was sind transparente Etiketten? | Labelpilot.de",
    description:
      "Transparente Etiketten kurz erklÃ¤rt: Materialwirkung, Sichtbarkeit und Einsatz bei Flaschen, GlÃ¤sern und Premium-Verpackungen.",
    openGraphType: "article",
  },
  "/de/glossar/thermoetiketten": {
    title: "Was sind Thermoetiketten? | Labelpilot.de",
    description:
      "Thermoetiketten kurz erklÃ¤rt: Einsatz in Versand, Lager und Fulfillment â€“ und warum sie im MVP nur als Cross-Sell auftreten.",
    openGraphType: "article",
  },
  "/de/glossar/proof": {
    title: "Was ist ein Proof? | Labelpilot.de",
    description:
      "Proof kurz erklÃ¤rt: Warum die Freigabe vor Produktion wichtig ist und wie sie spÃ¤tere Nachbestellungen absichert.",
    openGraphType: "article",
  },
  "/de/glossar/beschnitt": {
    title: "Was ist Beschnitt? | Labelpilot.de",
    description:
      "Beschnitt kurz erklÃ¤rt: warum ein Sicherheitsrand in Druckdaten wichtig ist und wie er unsaubere Kanten verhindert.",
    openGraphType: "article",
  },
  "/de/glossar/druckdaten": {
    title: "Was sind Druckdaten? | Labelpilot.de",
    description:
      "Druckdaten kurz erklÃ¤rt: welche Dateien fÃ¼r Etiketten gemeint sind und warum sie fÃ¼r Proof, Freigabe und Nachbestellung wichtig bleiben.",
    openGraphType: "article",
  },
  "/de/glossar/nachbestellung": {
    title: "Was bedeutet Nachbestellung bei Etiketten? | Labelpilot.de",
    description:
      "Nachbestellung kurz erklÃ¤rt: warum gespeicherte Druckdaten, Material und GrÃ¶ÃŸe spÃ¤tere Abrufe beschleunigen.",
    openGraphType: "article",
  },
};
