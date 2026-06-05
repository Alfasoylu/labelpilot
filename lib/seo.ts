import type { Metadata } from "next";

import { getPublicEnv } from "./env.ts";
import { metadataMap, type MetadataEntry } from "./seo/metadata.ts";
import { buildAbsoluteUrlFromBase, isNonIndexablePath } from "./seo/governance.ts";
import type { FAQ, PublicPageData } from "@/lib/site-content";

export { metadataMap };
export type { MetadataEntry };

export function buildAbsoluteUrl(path: string) {
  const baseUrl =
    getPublicEnv().NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://labelpilot.de";

  return buildAbsoluteUrlFromBase(baseUrl, path);
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
  const isNonIndexable = isNonIndexablePath(path);

  return {
    title,
    description,
    alternates: isNonIndexable
      ? undefined
      : {
          canonical: buildAbsoluteUrl(path),
        },
    robots: isNonIndexable
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title: entry.openGraphTitle ?? title,
      description: entry.openGraphDescription ?? description,
      siteName: "Labelpilot.de",
      locale: "de_DE",
      type: entry.openGraphType ?? "website",
      url: isNonIndexable ? undefined : buildAbsoluteUrl(path),
      images: [
        {
          url: buildAbsoluteUrl("/images/og-default-labelpilot-1200x630.png"),
          width: 1200,
          height: 630,
          alt: "labelpilot.de - PP-Rollenetiketten für Produktmarken",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.openGraphTitle ?? title,
      description: entry.openGraphDescription ?? description,
      images: [
        buildAbsoluteUrl("/images/og-default-labelpilot-1200x630.png"),
      ],
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Labelpilot.de",
    url: buildAbsoluteUrl("/"),
    logo: buildAbsoluteUrl("/images/logo.png"),
    description:
      "Labelpilot.de ist eine B2B-Plattform für individuell bedruckte PP-Rollenetiketten und Thermoetiketten für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland.",
    areaServed: {
      "@type": "Country",
      name: "Deutschland",
    },
    knowsAbout: [
      "PP-Rollenetiketten",
      "Produktetiketten",
      "Lebensmitteletiketten",
      "Supplement-Etiketten",
      "Getränkeetiketten",
      "Thermoetiketten",
      "Druckdaten",
      "Etiketten nachbestellen",
    ],
    inLanguage: "de-DE",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Labelpilot.de",
    url: buildAbsoluteUrl("/"),
    description:
      "Deutsche B2B-Plattform für PP-Rollenetiketten, Thermoetiketten, Druckdatenprüfung und Etiketten-Nachbestellung.",
    inLanguage: "de-DE",
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function getBreadcrumbItems(name: string, path: string) {
  if (path === "/de") {
    return [{ name: "Start", path: "/de" }];
  }

  if (path === "/de/ratgeber") {
    return [
      { name: "Start", path: "/de" },
      { name: "Ratgeber", path: "/de/ratgeber" },
    ];
  }

  if (path.startsWith("/de/ratgeber/")) {
    return [
      { name: "Start", path: "/de" },
      { name: "Ratgeber", path: "/de/ratgeber" },
      { name, path },
    ];
  }

  if (path === "/de/glossar") {
    return [
      { name: "Start", path: "/de" },
      { name: "Glossar", path: "/de/glossar" },
    ];
  }

  if (path.startsWith("/de/glossar/")) {
    return [
      { name: "Start", path: "/de" },
      { name: "Glossar", path: "/de/glossar" },
      { name, path },
    ];
  }

  return [
    { name: "Start", path: "/de" },
    { name, path },
  ];
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

function parseEuroAmount(label: string | undefined) {
  if (!label) {
    return null;
  }

  const numericText = label.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(numericText);

  return Number.isFinite(value) ? value : null;
}

function getProductSchemaDetails(path: string) {
  switch (path) {
    case "/de/opake-pp-etiketten":
      return {
        sku: "pp-opaque-100x200",
        category: "PP-Rollenetiketten",
        material: "Opakes PP",
        format: "100×200 mm",
      };
    case "/de/transparente-pp-etiketten":
      return {
        sku: "pp-transparent-100x200",
        category: "PP-Rollenetiketten",
        material: "Transparentes PP",
        format: "100×200 mm",
      };
    case "/de/thermo-versandetiketten":
      return {
        sku: "thermal-shipping-100x150",
        category: "Thermo-Versandetiketten",
        material: "Thermo",
        format: "100×150 mm",
      };
    default:
      return null;
  }
}

function buildVisibleProductOffers(page: PublicPageData, path: string) {
  const schemaDetails = getProductSchemaDetails(path);

  if (!schemaDetails) {
    return undefined;
  }

  const fixedPackageOffers =
    page.packageTable
      ?.map((tier) => {
        const netPrice = parseEuroAmount(tier.priceLabel);

        if (!netPrice) {
          return null;
        }

        const quantityValue = Number.parseInt(tier.quantity.replace(/\D/g, ""), 10);

        if (!Number.isFinite(quantityValue)) {
          return null;
        }

        return {
          "@type": "Offer",
          priceCurrency: "EUR",
          price: netPrice,
          availability: "https://schema.org/InStock",
          url: buildAbsoluteUrl(path),
          sku: `${schemaDetails.sku}-${quantityValue}`,
          name: `${page.title} - ${tier.quantity}`,
          description: [tier.priceLabel, tier.grossLabel].filter(Boolean).join(" · "),
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: quantityValue,
            unitText: "Stück",
          },
        };
      })
      .filter(Boolean) ?? [];

  return fixedPackageOffers.length > 0 ? fixedPackageOffers : undefined;
}

export function buildPageSchema(page: PublicPageData, path: string) {
  switch (page.kind) {
    case "product": {
      const productSchemaDetails = getProductSchemaDetails(path);
      const visibleOffers = buildVisibleProductOffers(page, path);

      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: page.title,
        description: page.lead,
        url: buildAbsoluteUrl(path),
        brand: {
          "@type": "Brand",
          name: "Labelpilot.de",
        },
        category: productSchemaDetails?.category,
        material: productSchemaDetails?.material,
        sku: productSchemaDetails?.sku,
        inLanguage: "de-DE",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Format",
            value: productSchemaDetails?.format ?? page.sidebarBullets[0],
          },
          {
            "@type": "PropertyValue",
            name: "Material",
            value: productSchemaDetails?.material ?? page.sidebarBullets[0],
          },
        ],
        offers: visibleOffers,
      };
    }
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
        areaServed: {
          "@type": "Country",
          name: "Deutschland",
        },
        serviceType: page.title,
        inLanguage: "de-DE",
      };
    case "collection":
    case "hub":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: page.title,
        description: page.lead,
        url: buildAbsoluteUrl(path),
        inLanguage: "de-DE",
      };
    case "guide":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.title,
        description: page.lead,
        author: {
          "@type": "Organization",
          name: "Labelpilot.de",
        },
        publisher: {
          "@type": "Organization",
          name: "Labelpilot.de",
        },
        inLanguage: "de-DE",
        url: buildAbsoluteUrl(path),
      };
    case "glossary":
      if (!page.glossaryData) {
        return null;
      }

      return {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: page.glossaryData.term,
        description: page.glossaryData.definition,
        inDefinedTermSet: buildAbsoluteUrl("/de/glossar"),
        url: buildAbsoluteUrl(path),
      };
    default:
      return null;
  }
}

export function buildHowToSchema(page: PublicPageData, path: string) {
  if (!page.howToSteps?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.title,
    description: page.lead,
    step: page.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
    })),
    inLanguage: "de-DE",
    url: buildAbsoluteUrl(path),
  };
}
