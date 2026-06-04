# 24-METADATA-MAP.md

# Labelpilot.de — Metadata Map

## 1. Purpose

This document defines the metadata map for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

This file is the source of truth for:

- page titles
- meta descriptions
- canonical URLs
- robots/indexing rules
- Open Graph metadata
- internal SEO route governance
- sitemap eligibility
- noindex/private route rules

All public metadata must be German during MVP.

---

## 2. Strategic Metadata Verdict

The correct metadata strategy is:

> One clear German title and description per indexable page, mapped to one primary search intent and one canonical URL.

The wrong metadata strategy is:

> Duplicate titles, vague descriptions, English metadata, generic print-shop language and no canonical control.

Metadata must support qualified German B2B traffic.

---

## 3. Required Source Documents

Before implementing metadata, Codex must read:

```txt
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
```

If there is conflict, stop and report it.

---

## 4. Language Rule

All public MVP metadata must be German.

Required German fields:

```txt
title
description
openGraphTitle
openGraphDescription
imageAlt
breadcrumb labels
```

Not allowed in MVP:

```txt
English title
English description
English OG metadata
mixed German/English metadata
/en canonical URLs
```

---

## 5. Metadata Implementation Location

Recommended implementation file:

```txt
config/metadata.ts
```

or:

```txt
lib/seo/metadata.ts
```

Recommended structure:

```ts
export const metadataMap = {
  "/de": {
    title: "...",
    description: "...",
    canonical: "https://labelpilot.de/de",
    robots: "index,follow",
    openGraphTitle: "...",
    openGraphDescription: "..."
  }
}
```

Do not scatter metadata randomly across many files unless framework structure requires it.

---

## 6. Global Metadata Defaults

Default site name:

```txt
Labelpilot.de
```

Default locale:

```txt
de_DE
```

Default country:

```txt
Germany
```

Default URL:

```txt
https://labelpilot.de
```

Default robots for public pages:

```txt
index,follow
```

Default robots for private/system pages:

```txt
noindex,nofollow
```

---

## 7. Title Rules

Title rules:

1. German.
2. Unique per indexable page.
3. Primary keyword near beginning.
4. Brand at end.
5. No keyword stuffing.
6. Avoid vague titles.
7. Keep ideally under ~60 characters if possible.
8. Use `| Labelpilot.de` as brand suffix.

Good:

```txt
Supplement-Etiketten drucken | Labelpilot.de
```

Bad:

```txt
Home
Best Labels Printing Germany Cheap Stickers | Labelpilot.de
```

---

## 8. Description Rules

Description rules:

1. German.
2. Unique per indexable page.
3. Commercially useful.
4. Mentions product/use case.
5. Mentions Germany or German B2B relevance where useful.
6. Mentions reorder or file review where strategically relevant.
7. No legal overclaims.
8. No generic filler.
9. Keep ideally around 140–160 characters, but clarity matters more.

Good:

```txt
PP-Rollenetiketten für Supplement-Marken in Deutschland. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung und Nachbestellung.
```

Bad:

```txt
Wir bieten hochwertige Etiketten für jeden Bedarf. Kontaktieren Sie uns jetzt für mehr Informationen.
```

---

## 9. Canonical Rules

Canonical format:

```txt
https://labelpilot.de/[path]
```

Examples:

```txt
https://labelpilot.de/de
https://labelpilot.de/de/supplement-etiketten
```

Rules:

1. Every indexable page has a self-canonical.
2. No English canonical in MVP.
3. No canonical to homepage unless duplicate page intentionally noindexed.
4. Programmatic pages self-canonical only if quality-approved.
5. Checkout/account/admin pages noindex and generally do not need SEO canonical.

---

## 10. Robots Rules

Indexable public pages:

```txt
index,follow
```

Private/system pages:

```txt
noindex,nofollow
```

Noindex routes:

```txt
/admin
/admin/*
/konto
/konto/*
/checkout
/checkout/*
/api/*
/checkout/success
/checkout/cancel
```

Do not include private routes in sitemap.

---

## 11. Open Graph Rules

Open Graph metadata must be German.

Required fields for public pages:

```txt
og:title
og:description
og:url
og:type
og:image
```

Recommended:

```txt
og:type = website
```

For guide/content pages:

```txt
og:type = article
```

Default OG image:

```txt
/public/og/labelpilot-og.jpg
```

If no image exists yet, Codex should prepare placeholder path but not break build.

---

## 12. P0 Metadata Map

### 12.1 Homepage

```txt
Path: /de
Title: PP-Rollenetiketten für Marken in Deutschland | Labelpilot.de
Description: Individuell bedruckte PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken. Mit technischer Druckdatenprüfung, Musterbox und einfacher Nachbestellung.
Canonical: https://labelpilot.de/de
Robots: index,follow
OG Title: PP-Rollenetiketten für Marken in Deutschland
OG Description: Labelpilot.de liefert individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken – mit gespeicherten Druckdaten und einfacher Nachbestellung.
```

### 12.2 Lebensmittel-Etiketten

```txt
Path: /de/lebensmittel-etiketten
Title: Lebensmitteletiketten drucken | Labelpilot.de
Description: Bedruckte PP-Rollenetiketten für Lebensmittelmarken in Deutschland. Geeignet für Gläser, Beutel, Flaschen und Verpackungen.
Canonical: https://labelpilot.de/de/lebensmittel-etiketten
Robots: index,follow
OG Title: Lebensmitteletiketten drucken
OG Description: PP-Rollenetiketten für Lebensmittelverpackungen mit technischer Dateiprüfung und Nachbestellung.
```

### 12.3 Supplement-Etiketten

```txt
Path: /de/supplement-etiketten
Title: Supplement-Etiketten drucken | Labelpilot.de
Description: PP-Rollenetiketten für Supplement-Dosen, Beutel und Flaschen. 100×200 mm, opak oder transparent, mit technischer Dateiprüfung.
Canonical: https://labelpilot.de/de/supplement-etiketten
Robots: index,follow
OG Title: Supplement-Etiketten drucken
OG Description: Bedruckte PP-Rollenetiketten für Supplement-Marken in Deutschland.
```

### 12.4 Getränkeetiketten

```txt
Path: /de/getraenke-etiketten
Title: Getränkeetiketten drucken | Labelpilot.de
Description: Transparente und opake PP-Rollenetiketten für Getränke, Flaschen und Glasverpackungen. Für Marken in Deutschland mit einfacher Nachbestellung.
Canonical: https://labelpilot.de/de/getraenke-etiketten
Robots: index,follow
OG Title: Getränkeetiketten drucken
OG Description: PP-Rollenetiketten für Getränke- und Flaschenverpackungen.
```

### 12.5 Transparente PP-Etiketten

```txt
Path: /de/transparente-pp-etiketten
Title: Transparente PP-Etiketten drucken | Labelpilot.de
Description: Transparente PP-Rollenetiketten 100×200 mm für Flaschen, Gläser und Premium-Verpackungen. Druckdaten hochladen und nachbestellen.
Canonical: https://labelpilot.de/de/transparente-pp-etiketten
Robots: index,follow
OG Title: Transparente PP-Etiketten drucken
OG Description: Transparente PP-Rollenetiketten für B2B-Marken in Deutschland.
```

### 12.6 Opake PP-Etiketten

```txt
Path: /de/opake-pp-etiketten
Title: Opake PP-Etiketten drucken | Labelpilot.de
Description: Opake PP-Rollenetiketten 100×200 mm für Lebensmittel-, Supplement- und Produktverpackungen. Ideal für wiederkehrende B2B-Bestellungen.
Canonical: https://labelpilot.de/de/opake-pp-etiketten
Robots: index,follow
OG Title: Opake PP-Etiketten drucken
OG Description: Opake PP-Rollenetiketten für Produktverpackungen und wiederkehrende Bestellungen.
```

### 12.7 PP-Rollenetiketten

```txt
Path: /de/pp-rollenetiketten
Title: PP-Rollenetiketten drucken | Labelpilot.de
Description: Individuell bedruckte PP-Rollenetiketten für deutsche B2B-Marken. Opak oder transparent, 100×200 mm, mit gespeicherten Druckdaten.
Canonical: https://labelpilot.de/de/pp-rollenetiketten
Robots: index,follow
OG Title: PP-Rollenetiketten drucken
OG Description: PP-Rollenetiketten für Produktverpackungen mit gespeicherten Druckdaten.
```

### 12.8 Etiketten 100×200 mm

```txt
Path: /de/etiketten-100x200
Title: Etiketten 100×200 mm drucken | Labelpilot.de
Description: 100×200 mm PP-Rollenetiketten für Produktverpackungen. Geeignet für Lebensmittel, Getränke und Supplemente. Mengen ab 1.000 Stück.
Canonical: https://labelpilot.de/de/etiketten-100x200
Robots: index,follow
OG Title: Etiketten 100×200 mm drucken
OG Description: 100×200 mm PP-Rollenetiketten für deutsche B2B-Produktmarken.
```

### 12.9 Thermo-Versandetiketten

```txt
Path: /de/thermo-versandetiketten
Title: Thermo-Versandetiketten 100×150 mm | Labelpilot.de
Description: Thermo-Versandetiketten und Thermoetiketten als B2B-Ergänzung zu Produktetiketten. Für Versand, Lager und Fulfillment-Prozesse.
Canonical: https://labelpilot.de/de/thermo-versandetiketten
Robots: index,follow
OG Title: Thermo-Versandetiketten 100×150 mm
OG Description: Thermoetiketten für Versand, Lager und Fulfillment als Cross-Sell für B2B-Kunden.
```

### 12.10 Musterbox

```txt
Path: /de/musterbox
Title: Etiketten Musterbox anfordern | Labelpilot.de
Description: Fordern Sie eine Labelpilot Musterbox an und vergleichen Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten.
Canonical: https://labelpilot.de/de/musterbox
Robots: index,follow
OG Title: Etiketten Musterbox anfordern
OG Description: Materialmuster für PP-Rollenetiketten und Thermoetiketten.
```

### 12.11 Angebot anfordern

```txt
Path: /de/angebot-anfordern
Title: B2B-Angebot für Etiketten anfordern | Labelpilot.de
Description: Fordern Sie ein individuelles B2B-Angebot für PP-Rollenetiketten, Thermoetiketten oder größere Etikettenmengen an.
Canonical: https://labelpilot.de/de/angebot-anfordern
Robots: index,follow
OG Title: B2B-Angebot für Etiketten anfordern
OG Description: Individuelles Angebot für PP-Rollenetiketten und größere B2B-Mengen.
```

### 12.12 Nachbestellen

```txt
Path: /de/nachbestellen
Title: Etiketten nachbestellen | Labelpilot.de
Description: Bestellen Sie freigegebene Etiketten schneller erneut. Labelpilot.de speichert Druckdaten, Material, Größe und Stückzahl für Nachbestellungen.
Canonical: https://labelpilot.de/de/nachbestellen
Robots: index,follow
OG Title: Etiketten nachbestellen
OG Description: Gleiche Etiketten mit gespeicherten Druckdaten einfacher erneut bestellen.
```

### 12.13 Druckdaten

```txt
Path: /de/druckdaten
Title: Druckdaten-Anforderungen für Etiketten | Labelpilot.de
Description: Welche Druckdaten für PP-Rollenetiketten benötigt werden: PDF, AI, EPS, SVG, PNG, JPG oder ZIP. Mit technischer Dateiprüfung und klaren Datei-Anforderungen.
Canonical: https://labelpilot.de/de/druckdaten
Robots: index,follow
OG Title: Druckdaten-Anforderungen für Etiketten
OG Description: Dateiformate und Anforderungen für PP-Rollenetiketten, Datencheck und Proof-Freigabe im Überblick.
```

### 12.14 Produktion und Versand

```txt
Path: /de/produktion-versand
Title: Produktion und Versand nach Deutschland | Labelpilot.de
Description: Labelpilot.de produziert Etiketten kosteneffizient in der Türkei und liefert an B2B-Kunden in Deutschland. Mit späterer Hub-Option.
Canonical: https://labelpilot.de/de/produktion-versand
Robots: index,follow
OG Title: Produktion und Versand nach Deutschland
OG Description: Transparente Information zu Türkei-Produktion und Deutschland-Lieferung.
```

### 12.15 Kontakt

```txt
Path: /de/kontakt
Title: Kontakt | Labelpilot.de
Description: Kontaktieren Sie Labelpilot.de für Fragen zu PP-Rollenetiketten, Musterbox, Druckdaten, Angeboten oder Nachbestellungen.
Canonical: https://labelpilot.de/de/kontakt
Robots: index,follow
OG Title: Kontakt
OG Description: Kontakt für B2B-Etiketten, Musterbox, Druckdaten und Angebote.
```

---

## 13. Legal Metadata Map

### 13.1 Impressum

```txt
Path: /de/impressum
Title: Impressum | Labelpilot.de
Description: Impressum von Labelpilot.de.
Canonical: https://labelpilot.de/de/impressum
Robots: index,follow
```

### 13.2 Datenschutz

```txt
Path: /de/datenschutz
Title: Datenschutzerklärung | Labelpilot.de
Description: Informationen zum Datenschutz bei Labelpilot.de.
Canonical: https://labelpilot.de/de/datenschutz
Robots: index,follow
```

### 13.3 AGB

```txt
Path: /de/agb
Title: Allgemeine Geschäftsbedingungen | Labelpilot.de
Description: Allgemeine Geschäftsbedingungen von Labelpilot.de.
Canonical: https://labelpilot.de/de/agb
Robots: index,follow
```

### 13.4 Versand

```txt
Path: /de/versand
Title: Versandinformationen | Labelpilot.de
Description: Informationen zu Versand, Lieferung und Produktionsablauf bei Labelpilot.de.
Canonical: https://labelpilot.de/de/versand
Robots: index,follow
```

### 13.5 Widerruf

```txt
Path: /de/widerruf
Title: Widerruf und Sonderanfertigungen | Labelpilot.de
Description: Informationen zu Widerruf, Sonderanfertigungen, individuellen Druckprodukten und Reklamationen.
Canonical: https://labelpilot.de/de/widerruf
Robots: index,follow
```

Legal pages should be reviewed before production.

---

## 14. P1 Metadata Map

### 14.1 Kaffee-Etiketten

```txt
Path: /de/kaffee-etiketten
Title: Kaffee-Etiketten drucken | Labelpilot.de
Description: PP-Rollenetiketten für Kaffeebeutel und Kaffeemarken. Opake Etiketten für wiederkehrende Produktverpackungen in Deutschland.
Canonical: https://labelpilot.de/de/kaffee-etiketten
Robots: index,follow
```

### 14.2 Gewürz-Etiketten

```txt
Path: /de/gewuerz-etiketten
Title: Gewürz-Etiketten drucken | Labelpilot.de
Description: PP-Rollenetiketten für Gewürzgläser, Beutel und Verpackungen. Mit gespeicherten Druckdaten für spätere Nachbestellungen.
Canonical: https://labelpilot.de/de/gewuerz-etiketten
Robots: index,follow
```

### 14.3 Honig- und Marmeladenetiketten

```txt
Path: /de/honig-marmelade-etiketten
Title: Honig- und Marmeladenetiketten drucken | Labelpilot.de
Description: Transparente und opake PP-Rollenetiketten für Honiggläser, Marmeladengläser und kleine Lebensmittelmarken.
Canonical: https://labelpilot.de/de/honig-marmelade-etiketten
Robots: index,follow
```

### 14.4 Flaschenetiketten

```txt
Path: /de/flaschenetiketten
Title: Flaschenetiketten drucken | Labelpilot.de
Description: Transparente und opake PP-Rollenetiketten für Flaschen, Getränke und Glasverpackungen in Deutschland.
Canonical: https://labelpilot.de/de/flaschenetiketten
Robots: index,follow
```

### 14.5 Glasetiketten

```txt
Path: /de/glasetiketten
Title: Etiketten für Gläser drucken | Labelpilot.de
Description: PP-Rollenetiketten für Gläser, Lebensmittelverpackungen, Honig, Marmelade und Getränke. Mit einfacher Nachbestellung.
Canonical: https://labelpilot.de/de/glasetiketten
Robots: index,follow
```

### 14.6 Beuteletiketten

```txt
Path: /de/beuteletiketten
Title: Etiketten für Beutel drucken | Labelpilot.de
Description: PP-Rollenetiketten für Beutelverpackungen, Kaffee, Supplemente, Gewürze und Lebensmittelmarken.
Canonical: https://labelpilot.de/de/beuteletiketten
Robots: index,follow
```

---

## 15. Guide Metadata Map

### 15.1 PP vs Papier

```txt
Path: /de/ratgeber/pp-etiketten-vs-papieretiketten
Title: PP-Etiketten vs. Papieretiketten | Labelpilot.de
Description: Vergleich von PP-Etiketten und Papieretiketten für Produktverpackungen. Mit Empfehlung für Lebensmittel-, Getränke- und Supplement-Marken.
Canonical: https://labelpilot.de/de/ratgeber/pp-etiketten-vs-papieretiketten
Robots: index,follow
OG Type: article
```

### 15.2 Transparent vs Opak

```txt
Path: /de/ratgeber/transparente-vs-opake-etiketten
Title: Transparente vs. opake Etiketten | Labelpilot.de
Description: Vergleich transparenter und opaker PP-Etiketten für Flaschen, Gläser, Dosen und Produktverpackungen.
Canonical: https://labelpilot.de/de/ratgeber/transparente-vs-opake-etiketten
Robots: index,follow
OG Type: article
```

### 15.3 Rollenetiketten vs Bogenetiketten

```txt
Path: /de/ratgeber/rollenetiketten-vs-bogenetiketten
Title: Rollenetiketten vs. Bogenetiketten | Labelpilot.de
Description: Wann Rollenetiketten für B2B-Produktmarken sinnvoller sind als Bogenetiketten – besonders bei wiederkehrenden Bestellungen.
Canonical: https://labelpilot.de/de/ratgeber/rollenetiketten-vs-bogenetiketten
Robots: index,follow
OG Type: article
```

### 15.4 Etiketten 1000 vs 5000 Stück

```txt
Path: /de/ratgeber/etiketten-1000-vs-5000-stueck
Title: Etiketten 1.000 vs. 5.000 Stück | Labelpilot.de
Description: Vergleich kleiner und größerer Etikettenmengen für B2B-Marken. Warum 5.000 Stück oft wirtschaftlicher sind.
Canonical: https://labelpilot.de/de/ratgeber/etiketten-1000-vs-5000-stueck
Robots: index,follow
OG Type: article
```

### 15.5 Druckdaten vorbereiten

```txt
Path: /de/ratgeber/druckdaten-vorbereiten
Title: Druckdaten für Etiketten vorbereiten | Labelpilot.de
Description: So bereiten Sie Druckdaten für PP-Rollenetiketten vor. Formate, Beschnitt, Proof und technische Dateiprüfung erklärt.
Canonical: https://labelpilot.de/de/ratgeber/druckdaten-vorbereiten
Robots: index,follow
OG Type: article
```

---

## 16. Glossary Metadata Rules

Glossary pages should use:

```txt
Title: Was sind [Begriff]? | Labelpilot.de
Description: Kurze Erklärung zu [Begriff] im Kontext von Produktetiketten, PP-Rollenetiketten und B2B-Nachbestellungen.
OG Type: article
```

Example:

```txt
Path: /de/glossar/pp-etiketten
Title: Was sind PP-Etiketten? | Labelpilot.de
Description: PP-Etiketten kurz erklärt: Material, Einsatzbereiche und Relevanz für Produktverpackungen und Rollenetiketten.
Canonical: https://labelpilot.de/de/glossar/pp-etiketten
Robots: index,follow
```

---

## 17. Programmatic Metadata Rules

Programmatic pages must have unique metadata.

Formula:

```txt
Title: [Material] für [Branche] drucken | Labelpilot.de
Description: [Material] als Rollenetiketten für [Branche] in Deutschland. [Size/use case], technische Druckdatenprüfung und einfache Nachbestellung.
```

Example:

```txt
Path: /de/supplement-etiketten/transparente-pp-etiketten
Title: Transparente PP-Etiketten für Supplemente drucken | Labelpilot.de
Description: Transparente PP-Rollenetiketten für Supplement-Marken in Deutschland. 100×200 mm, technische Druckdatenprüfung und einfache Nachbestellung.
Canonical: https://labelpilot.de/de/supplement-etiketten/transparente-pp-etiketten
Robots: index,follow
```

Only publish if page passes quality gate.

---

## 18. Private Route Metadata

Private routes must be noindex.

### 18.1 Customer Portal

```txt
Path: /konto
Title: Mein Konto | Labelpilot.de
Robots: noindex,nofollow
```

All `/konto/*`:

```txt
Robots: noindex,nofollow
```

### 18.2 Admin

All `/admin/*`:

```txt
Robots: noindex,nofollow
```

### 18.3 Checkout

All `/checkout/*`:

```txt
Robots: noindex,nofollow
```

### 18.4 API

All `/api/*`:

```txt
Robots: noindex,nofollow
```

---

## 19. Metadata QA Checklist

Every indexable page must pass:

| Check | Required |
|---|---|
| German title | Yes |
| German description | Yes |
| Unique title | Yes |
| Unique description | Yes |
| Canonical URL | Yes |
| Correct robots | Yes |
| OG title | Yes |
| OG description | Yes |
| No English metadata | Yes |
| No legal overclaim | Yes |
| Matches page content | Yes |
| Primary keyword mapped | Yes |

---

## 20. Common Metadata Mistakes to Avoid

Do not:

1. Duplicate titles.
2. Duplicate descriptions.
3. Use English metadata.
4. Use homepage canonical for all pages.
5. Index admin/account/checkout pages.
6. Use “Home” or “Product” as title.
7. Overstuff keywords.
8. Claim legal compliance.
9. Add metadata for pages that do not exist.
10. Put draft pages in sitemap.
11. Use generic print-shop descriptions.
12. Mention products outside approved scope.

---

## 21. Codex Implementation Rules

Codex must:

1. Use this file for metadata implementation.
2. Keep metadata centralized.
3. Keep public metadata German.
4. Use self-canonicals for indexable pages.
5. Noindex private routes.
6. Keep metadata aligned with keyword map.
7. Update this file if routes change.
8. Do not create English metadata in MVP.
9. Do not index thin programmatic pages.

---

## 22. Acceptance Criteria

Metadata implementation is accepted when:

| Check | Required Result |
|---|---|
| Metadata map exists in code | PASS |
| P0 metadata implemented | PASS |
| Legal metadata implemented | PASS |
| Private routes noindex | PASS |
| Canonicals correct | PASS |
| German titles/descriptions | PASS |
| No duplicate P0 titles | PASS |
| OG metadata exists | PASS |
| Programmatic rules implemented if used | PASS |
| Sitemap aligns with metadata map | PASS |

---

## 23. Final Verdict

The metadata system must make every public page’s purpose clear to Google, AI systems and German B2B buyers.

The correct system:

> German, unique, intent-mapped metadata with canonical and robots control.

The wrong system:

> Duplicate metadata, English titles and uncontrolled indexing.

Metadata is not decoration. It is search positioning.
