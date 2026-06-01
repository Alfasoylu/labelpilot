import type { Metadata } from "next";

import { getPublicEnv } from "@/lib/env";
import type { FAQ, PublicPageData } from "@/lib/site-content";

type MetadataEntry = {
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
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
    openGraphTitle: "Lebensmitteletiketten drucken",
    openGraphDescription:
      "PP-Rollenetiketten für Lebensmittelverpackungen mit technischer Dateiprüfung und Nachbestellung.",
  },
  "/de/supplement-etiketten": {
    title: "Supplement-Etiketten drucken | Labelpilot.de",
    description:
      "PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.",
    openGraphTitle: "Supplement-Etiketten drucken",
    openGraphDescription:
      "Bedruckte PP-Rollenetiketten für Supplement-Marken in Deutschland.",
  },
  "/de/getraenke-etiketten": {
    title: "Getränkeetiketten drucken | Labelpilot.de",
    description:
      "Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.",
    openGraphTitle: "Getränkeetiketten drucken",
    openGraphDescription:
      "PP-Rollenetiketten für Getränke- und Flaschenverpackungen.",
  },
  "/de/transparente-pp-etiketten": {
    title: "Transparente PP-Etiketten drucken | Labelpilot.de",
    description:
      "Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen und nachbestellen.",
    openGraphTitle: "Transparente PP-Etiketten drucken",
    openGraphDescription:
      "Transparente PP-Rollenetiketten für B2B-Marken in Deutschland.",
  },
  "/de/opake-pp-etiketten": {
    title: "Opake PP-Etiketten drucken | Labelpilot.de",
    description:
      "Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.",
    openGraphTitle: "Opake PP-Etiketten drucken",
    openGraphDescription:
      "Opake PP-Rollenetiketten für Produktverpackungen und wiederkehrende Bestellungen.",
  },
  "/de/pp-rollenetiketten": {
    title: "PP-Rollenetiketten drucken | Labelpilot.de",
    description:
      "Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.",
    openGraphTitle: "PP-Rollenetiketten drucken",
    openGraphDescription:
      "PP-Rollenetiketten für Produktverpackungen mit gespeicherten Druckdaten.",
  },
  "/de/etiketten-100x200": {
    title: "Etiketten 100×200 mm drucken | Labelpilot.de",
    description:
      "100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.",
    openGraphTitle: "Etiketten 100×200 mm drucken",
    openGraphDescription:
      "100×200 mm PP-Rollenetiketten für deutsche B2B-Produktmarken.",
  },
  "/de/thermo-versandetiketten": {
    title: "Thermo-Versandetiketten 100×150 mm | Labelpilot.de",
    description:
      "Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.",
    openGraphTitle: "Thermo-Versandetiketten 100×150 mm",
    openGraphDescription:
      "Thermoetiketten für Versand, Lager und Fulfillment als Cross-Sell für B2B-Kunden.",
  },
  "/de/musterbox": {
    title: "Etiketten Musterbox anfordern | Labelpilot.de",
    description:
      "Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.",
    openGraphTitle: "Etiketten Musterbox anfordern",
    openGraphDescription:
      "Materialmuster für PP-Rollenetiketten und Thermoetiketten.",
  },
  "/de/angebot-anfordern": {
    title: "B2B-Angebot für Etiketten anfordern | Labelpilot.de",
    description:
      "Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.",
    openGraphTitle: "B2B-Angebot für Etiketten anfordern",
    openGraphDescription:
      "Individuelles Angebot für PP-Rollenetiketten und größere B2B-Mengen.",
  },
  "/de/nachbestellen": {
    title: "Etiketten nachbestellen | Labelpilot.de",
    description:
      "Bestellen Sie freigegebene Etiketten schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.",
    openGraphTitle: "Etiketten nachbestellen",
    openGraphDescription:
      "Gleiche Etiketten mit gespeicherten Druckdaten einfacher erneut bestellen.",
  },
  "/de/druckdaten": {
    title: "Druckdaten für Etiketten vorbereiten | Labelpilot.de",
    description:
      "Welche Druckdaten für PP-Rollenetiketten benötigt werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung.",
    openGraphTitle: "Druckdaten für Etiketten vorbereiten",
    openGraphDescription:
      "Anforderungen an Druckdateien für PP-Rollenetiketten und Proof-Freigabe.",
  },
  "/de/produktion-versand": {
    title: "Produktion und Versand nach Deutschland | Labelpilot.de",
    description:
      "Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland. Mit späterer Hub-Option.",
    openGraphTitle: "Produktion und Versand nach Deutschland",
    openGraphDescription:
      "Transparente Information zu Türkei-Produktion und Deutschland-Lieferung.",
  },
  "/de/kontakt": {
    title: "Kontakt | Labelpilot.de",
    description:
      "Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.",
    openGraphTitle: "Kontakt",
    openGraphDescription:
      "Kontakt für B2B-Etiketten, Musterbox, Druckdaten und Angebote.",
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
    description: "Informationen zu Versand, Lieferung und Produktionsablauf bei Labelpilot.de.",
  },
  "/de/widerruf": {
    title: "Widerruf und Sonderanfertigungen | Labelpilot.de",
    description:
      "Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.",
  },
};

export function buildAbsoluteUrl(path: string) {
  const baseUrl =
    getPublicEnv().NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://labelpilot.de";

  if (!path || path === "/") {
    return baseUrl;
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildCanonicalMetadata(
  path: string,
  entry: MetadataEntry | undefined,
): Metadata {
  if (!entry) {
    return {};
  }

  const title = entry.title;
  const description = entry.description;

  return {
    title,
    description,
    alternates: {
      canonical: buildAbsoluteUrl(path),
    },
    openGraph: {
      title: entry.openGraphTitle ?? title,
      description: entry.openGraphDescription ?? description,
      locale: "de_DE",
      type: "website",
      url: buildAbsoluteUrl(path),
    },
    twitter: {
      card: "summary_large_image",
      title: entry.openGraphTitle ?? title,
      description: entry.openGraphDescription ?? description,
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Labelpilot.de",
    url: buildAbsoluteUrl("/de"),
    description:
      "Labelpilot.de ist eine B2B-Plattform für individuell bedruckte PP-Rollenetiketten und Thermoetiketten für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland.",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Labelpilot.de",
    url: buildAbsoluteUrl("/de"),
    description:
      "Deutsche B2B-Plattform für PP-Rollenetiketten, Thermoetiketten, Druckdatenprüfung und Etiketten-Nachbestellung.",
  };
}

export function buildBreadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Start",
        item: buildAbsoluteUrl("/de"),
      },
      ...(path === "/de"
        ? []
        : [
            {
              "@type": "ListItem",
              position: 2,
              name,
              item: buildAbsoluteUrl(path),
            },
          ]),
    ],
  };
}

export function buildFaqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildPageSchema(page: PublicPageData, path: string) {
  switch (page.kind) {
    case "product":
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: page.title,
        description: page.lead,
        url: buildAbsoluteUrl(path),
        brand: {
          "@type": "Organization",
          name: "Labelpilot.de",
        },
      };
    case "industry":
    case "service":
    case "quote":
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: page.lead,
        provider: {
          "@type": "Organization",
          name: "Labelpilot.de",
        },
        url: buildAbsoluteUrl(path),
      };
    case "collection":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: page.title,
        description: page.lead,
        url: buildAbsoluteUrl(path),
      };
    default:
      return null;
  }
}

export const siteNavigation = [
  { label: "Produkte", href: "/de/pp-rollenetiketten" },
  { label: "Branchen", href: "/de/lebensmittel-etiketten" },
  { label: "Musterbox", href: "/de/musterbox" },
  { label: "Druckdaten", href: "/de/druckdaten" },
  { label: "Nachbestellen", href: "/de/nachbestellen" },
];
