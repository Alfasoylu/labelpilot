# 38-CODEX-FIRST-BUILD-PROMPT.md

# Labelpilot.de — Codex First Build Prompt

## 1. Purpose

This document is the first implementation prompt for Codex.

Use it when starting the first real build of **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first Shopify-like custom label ordering platform built with:

- GitHub
- Vercel
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Prisma
- Stripe
- private file upload/proofing later

The first build must create the German MVP foundation, not the full system.

---

## 2. Codex Role

You are the implementation agent for Labelpilot.de.

Your job is not to invent a new business.

Your job is to implement the documented system.

Read the docs first, then implement Phase 1.

---

## 3. Must-Read Docs Before Coding

Read these files before making changes:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/01-BUSINESS-MODEL.md
/docs/03-PRODUCT-STRATEGY.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/12-DATABASE-SCHEMA.md
/docs/13-ENVIRONMENT-VARIABLES.md
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/62-PHASE-1-MVP.md
/docs/38-CODEX-FIRST-BUILD-PROMPT.md
```

If a doc is missing, report it before coding.

---

## 4. Hard Rules

Non-negotiable:

1. Customer-facing MVP UI is German only.
2. Brand is `Labelpilot.de`.
3. Domain is `labelpilot.de`.
4. Do not build generic print shop.
5. Main product is PP-Rollenetiketten.
6. Thermal labels are cross-sell.
7. Do not add flyers, business cards, posters, invitations or generic stickers.
8. Public pages must be SEO/GEO-ready.
9. Public pages must have German metadata.
10. Private/admin/checkout routes must not be indexed.
11. Do not implement unsafe payment shortcuts.
12. Do not expose secrets.
13. Do not invent product categories.

---

## 5. Phase 1 Build Goal

Build the first German public MVP foundation.

Implement:

```txt
Next.js app foundation
German public layout
Header and footer
P0 public pages
Product config
Metadata map
Sitemap
Robots
Basic schema helpers
Quote request page skeleton
Sample box page skeleton
Reorder information page
Druckdaten page
Production/shipping page
Legal page skeletons
Internal linking
German CTAs
Responsive design
```

Do not implement full Stripe, admin, upload or customer portal in this first build unless already explicitly requested.

---

## 6. Required Routes

Create these public routes:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/pp-rollenetiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
/de/musterbox
/de/angebot-anfordern
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
/de/kontakt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Redirect `/` to `/de`.

Do not create `/en`.

---

## 7. Required Components

Create reusable components where useful:

```txt
Header
Footer
Hero
DirectAnswer
ProductCards
SpecTable
PackageTable
FaqSection
RelatedLinks
ContentCta
ComplianceDisclaimer
Breadcrumbs
JsonLd
QuoteRequestForm
SampleBoxForm
```

Do not overcomponentize.

---

## 8. Product Config

Create central product config:

```txt
config/products.ts
```

Approved products only:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box
custom-quote
reorder
```

Customer-facing product names must be German.

---

## 9. SEO Config

Create central SEO route/metadata config:

```txt
config/metadata.ts
config/seo-routes.ts
```

Implement:

```txt
German titles
German descriptions
canonical URLs
robots rules
Open Graph data
```

Use docs `/docs/24-METADATA-MAP.md` and `/docs/26-SITEMAP-ROBOTS-CANONICAL.md`.

---

## 10. Schema Helpers

Create:

```txt
lib/seo/schema.ts
components/seo/JsonLd.tsx
```

Implement helpers for:

```txt
Organization
WebSite
BreadcrumbList
Product
Service
FAQPage
CollectionPage
```

Schema must match visible content.

Do not add fake reviews or ratings.

---

## 11. Forms

Phase 1 forms can be minimal but must be structured.

Quote form fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Telefon optional
Land
Branche
Produkttyp
Etikettengröße
Material
Menge
Wiederkehrender Bedarf
Druckdatei vorhanden?
Notizen
Datenschutz Zustimmung
```

Sample box form fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Land
Branche
Welche Etiketten interessieren Sie?
Voraussichtliche Menge
Wiederkehrender Bedarf
Datenschutz Zustimmung
```

If backend is not ready, create validated client/server-safe placeholder handlers and clearly report missing persistence.

---

## 12. German Copy Requirements

Use direct German B2B copy.

Avoid generic text.

Use phrases like:

```txt
PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken
technische Druckdatenprüfung
gespeicherte Druckdaten
einfache Nachbestellung
Musterbox anfordern
B2B-Angebot anfordern
```

Do not use English CTAs.

---

## 13. Legal Disclaimer

Add this disclaimer on relevant pages:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

Required on:

```txt
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/druckdaten
/de/angebot-anfordern
```

---

## 14. Testing Commands

Run available checks:

```txt
npm run lint
npm run typecheck
npm run build
```

If commands do not exist, report that honestly.

---

## 15. Required Final Report

After implementation, report:

```txt
## Summary
- What was implemented

## Files Changed
- path

## Routes Created
- route

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Missing / Deferred
- item

## Next Recommended Step
- one concrete next task
```

No vague summary.

No fake test pass.

---

## 16. Acceptance Criteria

The first build is accepted when:

| Check | Required Result |
|---|---|
| `/de` exists | PASS |
| P0 routes exist | PASS |
| Customer-facing UI German | PASS |
| No `/en` route | PASS |
| Product config exists | PASS |
| Metadata config exists | PASS |
| Sitemap exists | PASS |
| Robots exists | PASS |
| Header/footer exist | PASS |
| Quote page exists | PASS |
| Sample box page exists | PASS |
| Reorder page exists | PASS |
| Legal skeletons exist | PASS |
| No generic print products | PASS |
| Build/checks run or skipped honestly | PASS |

---

## 17. Final Instruction

Build the smallest correct German MVP foundation.

Do not build random extras.

Do not drift into a generic online print shop.

Focus on German B2B PP label demand, quote/sample/reorder conversion, and SEO/GEO readiness.
