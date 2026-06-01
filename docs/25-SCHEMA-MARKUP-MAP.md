# 25-SCHEMA-MARKUP-MAP.md

# Labelpilot.de — Schema Markup Map

## 1. Purpose

This document defines the structured data / schema markup strategy for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Schema markup must help search engines and AI systems understand:

- what Labelpilot.de is
- which products it sells
- which customers it serves
- which pages are product pages
- which pages are service/industry pages
- which pages are guides
- which FAQs are visible
- how pages relate through breadcrumbs
- why reorder, artwork upload and proofing matter

Schema must match visible page content.

---

## 2. Strategic Schema Verdict

The correct schema strategy is:

> Use accurate JSON-LD schema that reinforces Labelpilot.de as a German B2B PP roll label supplier, with product, service, FAQ, breadcrumb, article and glossary/entity structure.

The wrong schema strategy is:

> Add fake reviews, hidden FAQ schema, unsupported claims, legal compliance claims or schema that does not match visible content.

Schema is not a trick. It is structured truth.

---

## 3. Required Source Documents

Before implementing schema, Codex must read:

```txt
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/30-PRODUCT-CATALOG.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

Schema content that is visible to users must be German.

German schema fields:

```txt
name
description
question name
acceptedAnswer text
breadcrumb name
article headline
product description
service description
```

Allowed technical values:

```txt
@type
@context
url
sku
gtin if available
priceCurrency
availability
```

Not allowed:

- English FAQ answers on German pages
- English product descriptions in German MVP schema
- schema claims not visible on page

---

## 5. Implementation Format

Use JSON-LD.

Recommended component:

```txt
components/seo/JsonLd.tsx
```

or helper:

```txt
lib/seo/schema.ts
```

Schema output should be rendered as:

```html
<script type="application/ld+json">
  {...}
</script>
```

Rules:

1. Escape JSON safely.
2. Do not render invalid JSON.
3. Do not include undefined fields.
4. Keep schema generation centralized.
5. Match schema to visible content.

---

## 6. Required Schema Types

Use these schema types:

```txt
Organization
WebSite
BreadcrumbList
Product
Service
FAQPage
CollectionPage
Article
DefinedTerm
HowTo
```

Required in MVP:

```txt
Organization
WebSite
BreadcrumbList
Product
Service
FAQPage
CollectionPage
```

Optional after content expansion:

```txt
Article
DefinedTerm
HowTo
```

Do not use:

```txt
Review
AggregateRating
LocalBusiness with fake address
Offer with fake availability
HowTo where page is not step-by-step
FAQPage for hidden FAQs
```

---

## 7. Organization Schema

Use on:

```txt
/de
global layout if appropriate
```

Purpose:

Define Labelpilot.de as a business/entity.

Required fields:

```txt
@context
@type
name
url
logo
description
areaServed
knowsAbout
sameAs if available
contactPoint if available
```

Recommended JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Labelpilot.de",
  "url": "https://labelpilot.de",
  "logo": "https://labelpilot.de/logo.png",
  "description": "Labelpilot.de ist eine B2B-Plattform für individuell bedruckte PP-Rollenetiketten und Thermoetiketten für Lebensmittel-, Getränke- und Supplement-Marken in Deutschland.",
  "areaServed": {
    "@type": "Country",
    "name": "Deutschland"
  },
  "knowsAbout": [
    "PP-Rollenetiketten",
    "Produktetiketten",
    "Lebensmitteletiketten",
    "Supplement-Etiketten",
    "Getränkeetiketten",
    "Thermoetiketten",
    "Druckdaten",
    "Etiketten nachbestellen"
  ]
}
```

Rules:

1. Do not add fake social profiles.
2. Do not add fake address.
3. Do not claim certifications unless real.
4. Update logo URL when final logo exists.

---

## 8. WebSite Schema

Use on:

```txt
/de
```

Purpose:

Define website entity.

Recommended JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Labelpilot.de",
  "url": "https://labelpilot.de",
  "inLanguage": "de-DE",
  "description": "Deutsche B2B-Plattform für PP-Rollenetiketten, Thermoetiketten, Druckdatenprüfung und Etiketten-Nachbestellung."
}
```

Optional future:

```txt
SearchAction
```

Only add SearchAction if internal site search exists.

---

## 9. BreadcrumbList Schema

Use on all nested public pages.

Example visible breadcrumb:

```txt
Startseite > Produkte > Transparente PP-Etiketten
```

Recommended JSON-LD:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://labelpilot.de/de"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Produkte",
      "item": "https://labelpilot.de/de/produkte"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Transparente PP-Etiketten",
      "item": "https://labelpilot.de/de/transparente-pp-etiketten"
    }
  ]
}
```

Rules:

1. Breadcrumb schema must match visible breadcrumbs.
2. Use German breadcrumb labels.
3. Use canonical URLs.
4. Do not add breadcrumbs that are not shown.

---

## 10. Product Schema

Use on product pages:

```txt
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
/de/thermoetiketten-100x100
```

Required fields:

```txt
@context
@type Product
name
description
brand
category
material
sku
url
image if available
offers if fixed price exists
```

Example for opaque PP:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Opake PP-Rollenetiketten 100×200 mm",
  "description": "Individuell bedruckte opake PP-Rollenetiketten für Lebensmittel-, Supplement- und Produktverpackungen in Deutschland.",
  "brand": {
    "@type": "Brand",
    "name": "Labelpilot.de"
  },
  "category": "PP-Rollenetiketten",
  "material": "Opakes PP",
  "sku": "pp-opaque-100x200",
  "url": "https://labelpilot.de/de/opake-pp-etiketten",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://labelpilot.de/de/opake-pp-etiketten"
  }
}
```

Offer rules:

1. Include price only if visible fixed price exists on page.
2. Do not include fake discounted price.
3. Do not include aggregateRating without real reviews.
4. Do not include GTIN unless real.
5. Product schema must match visible product.

---

## 11. Service Schema

Use on industry/service pages:

```txt
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/angebot-anfordern
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
```

Purpose:

Represent Labelpilot.de’s service for a buyer segment.

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Supplement-Etiketten drucken",
  "description": "B2B-Service für individuell bedruckte PP-Rollenetiketten für Supplement-Marken in Deutschland.",
  "provider": {
    "@type": "Organization",
    "name": "Labelpilot.de",
    "url": "https://labelpilot.de"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Deutschland"
  },
  "serviceType": "PP-Rollenetiketten für Supplement-Marken"
}
```

Rules:

1. Do not claim legal compliance service.
2. Use German names/descriptions.
3. Match visible page content.

---

## 12. FAQPage Schema

Use only when visible FAQ exists.

Required:

```txt
Visible FAQ on page
German question
German answer
Same content in schema
```

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Kann ich dieselben Etiketten später nachbestellen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja. Labelpilot.de speichert freigegebene Druckdaten, Material, Größe und Stückzahl, damit spätere Nachbestellungen schneller möglich sind."
      }
    }
  ]
}
```

Rules:

1. Never add hidden FAQ schema.
2. Never add FAQ schema for questions not on page.
3. Keep answers concise.
4. Do not include legal overclaims.
5. German only.

---

## 13. CollectionPage Schema

Use on category/hub pages:

```txt
/de/produkte
/de/branchen
/de/ratgeber
/de/glossar
/de/pp-rollenetiketten
```

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "PP-Rollenetiketten",
  "description": "Übersicht zu PP-Rollenetiketten, Materialien, Größen und Einsatzbereichen für B2B-Marken in Deutschland.",
  "url": "https://labelpilot.de/de/pp-rollenetiketten",
  "inLanguage": "de-DE"
}
```

Rules:

1. Use for real collection/hub pages.
2. Link visible page content and internal links.

---

## 14. Article Schema

Use on guide pages:

```txt
/de/ratgeber/pp-etiketten-vs-papieretiketten
/de/ratgeber/transparente-vs-opake-etiketten
/de/ratgeber/rollenetiketten-vs-bogenetiketten
/de/ratgeber/druckdaten-vorbereiten
```

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "PP-Etiketten vs. Papieretiketten",
  "description": "Vergleich von PP-Etiketten und Papieretiketten für Produktverpackungen.",
  "author": {
    "@type": "Organization",
    "name": "Labelpilot.de"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Labelpilot.de"
  },
  "inLanguage": "de-DE",
  "url": "https://labelpilot.de/de/ratgeber/pp-etiketten-vs-papieretiketten"
}
```

Rules:

1. Use only for guide/article pages.
2. Do not fake author person.
3. Add datePublished/dateModified only if tracked accurately.
4. German content.

---

## 15. DefinedTerm Schema

Use on glossary entries:

```txt
/de/glossar/pp-etiketten
/de/glossar/rollenetiketten
/de/glossar/proof
/de/glossar/beschnitt
/de/glossar/druckdaten
```

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "PP-Etiketten",
  "description": "PP-Etiketten sind Etiketten aus Polypropylen, die häufig für Produktverpackungen und Rollenetiketten verwendet werden.",
  "inDefinedTermSet": "https://labelpilot.de/de/glossar",
  "url": "https://labelpilot.de/de/glossar/pp-etiketten"
}
```

Rules:

1. Use only when glossary page exists.
2. Definition must match visible content.
3. German definitions.

---

## 16. HowTo Schema

Use only for true step-by-step guide pages.

Possible page:

```txt
/de/ratgeber/druckdaten-vorbereiten
```

Example steps:

```txt
Dateiformat wählen
Etikettengröße prüfen
Beschnitt anlegen
Datei exportieren
Druckdatei hochladen
Proof prüfen
```

Rules:

1. Visible steps required.
2. Do not use HowTo for generic commercial pages.
3. German step names.
4. Do not make unsupported technical claims.

---

## 17. Schema Map by Page Type

| Page Type | Schema |
|---|---|
| Homepage | Organization, WebSite |
| Product page | Product, BreadcrumbList, FAQPage if FAQ visible |
| Industry page | Service, BreadcrumbList, FAQPage if FAQ visible |
| Quote page | Service, BreadcrumbList |
| Reorder page | Service, BreadcrumbList, FAQPage |
| File requirements page | Service or Article, BreadcrumbList, FAQPage |
| Guide page | Article, BreadcrumbList, FAQPage if visible |
| Glossary page | DefinedTerm, BreadcrumbList |
| Hub page | CollectionPage, BreadcrumbList |
| Legal page | BreadcrumbList only or none |
| Admin/account/checkout | noindex, no public schema needed |

---

## 18. Page-Specific Schema Requirements

### 18.1 `/de`

Required:

```txt
Organization
WebSite
```

Optional:

```txt
FAQPage if visible FAQ exists
```

### 18.2 `/de/supplement-etiketten`

Required:

```txt
Service
BreadcrumbList
FAQPage
```

### 18.3 `/de/opake-pp-etiketten`

Required:

```txt
Product
BreadcrumbList
FAQPage
```

### 18.4 `/de/transparente-pp-etiketten`

Required:

```txt
Product
BreadcrumbList
FAQPage
```

### 18.5 `/de/angebot-anfordern`

Required:

```txt
Service
BreadcrumbList
```

### 18.6 `/de/nachbestellen`

Required:

```txt
Service
BreadcrumbList
FAQPage
```

### 18.7 `/de/druckdaten`

Required:

```txt
Service or Article
BreadcrumbList
FAQPage
```

---

## 19. Claims Not Allowed in Schema

Do not include:

```txt
rechtlich geprüfte Etiketten
EU-konforme Etiketten garantiert
zertifizierte Lebensmittelkennzeichnung
legal compliance service
best label printer
cheapest labels
guaranteed delivery date
fake reviews
fake ratings
```

Schema must not create risk.

---

## 20. Price and Offer Rules

Product offers may include price only if:

1. Price is visible on page.
2. Price matches server-side product config.
3. Currency is EUR.
4. Product can be directly purchased.
5. Quantity/offer is clear.

If product is quote-only:

```txt
Do not add fixed price.
Use offer URL only if appropriate.
```

Do not add false availability.

---

## 21. Schema Validation Checklist

Before launch, validate:

1. JSON-LD is valid.
2. No undefined/null values.
3. URLs are canonical.
4. Language is German.
5. FAQ schema matches visible FAQ.
6. Product schema matches visible product.
7. No fake reviews/ratings.
8. No legal overclaims.
9. Breadcrumb schema matches visible breadcrumbs.
10. No schema on noindex private pages.

Use Google Rich Results Test where applicable.

---

## 22. Implementation Helper Functions

Recommended helpers:

```txt
buildOrganizationSchema()
buildWebsiteSchema()
buildBreadcrumbSchema(items)
buildProductSchema(product)
buildServiceSchema(service)
buildFaqSchema(faqs)
buildArticleSchema(article)
buildDefinedTermSchema(term)
```

Recommended file:

```txt
lib/seo/schema.ts
```

Recommended component:

```txt
components/seo/JsonLd.tsx
```

---

## 23. Schema Data Source

Schema should use the same data sources as pages:

```txt
config/products.ts
config/metadata.ts
data/faqs.ts
data/content-pages.ts
data/glossary.ts
```

Do not duplicate product data manually.

If product name changes, schema should change with page content.

---

## 24. Acceptance Criteria

Schema implementation is accepted when:

| Check | Required Result |
|---|---|
| Organization schema exists | PASS |
| WebSite schema exists | PASS |
| Product schema on product pages | PASS |
| Service schema on industry pages | PASS |
| Breadcrumb schema on nested pages | PASS |
| FAQ schema only with visible FAQ | PASS |
| Article schema on guide pages | PASS |
| DefinedTerm schema on glossary pages if used | PASS |
| German schema text | PASS |
| No fake reviews/ratings | PASS |
| No legal overclaims | PASS |
| Schema validates | PASS |

---

## 25. Common Schema Mistakes to Avoid

Do not:

1. Add FAQ schema for hidden FAQ.
2. Add fake AggregateRating.
3. Add fake Review.
4. Add English schema text.
5. Add product price not visible on page.
6. Add legal compliance claims.
7. Add LocalBusiness with fake local address.
8. Add HowTo schema to non-step pages.
9. Let schema URLs differ from canonicals.
10. Duplicate schema with conflicting values.
11. Hardcode stale product data.
12. Add schema to private noindex pages.

---

## 26. Codex Implementation Rules

Codex must:

1. Centralize schema helpers.
2. Use JSON-LD.
3. Use German visible content.
4. Match schema to page content.
5. Validate schema output.
6. Avoid unsupported schema types.
7. Avoid fake review/rating schema.
8. Keep schema aligned with metadata/canonical map.
9. Update this file if schema strategy changes.

---

## 27. Final Verdict

The correct schema strategy is:

> Accurate German JSON-LD that reinforces Labelpilot.de as a B2B PP roll label platform with product, service, FAQ, breadcrumb and content structure.

The wrong strategy is:

> Fake rich snippet manipulation.

Schema should make Labelpilot.de easier to understand, not legally or technically riskier.
