# Canonical phase = 1 (per doc 74).

# 43-CODEX-PHASE-1-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 1 Execution Prompt

## 1. Mission

Implement Phase 1 MVP for **Labelpilot.de**.

The goal is to create the German public commercial foundation:

```txt
German public website
approved product catalog
SEO/GEO-ready P0 pages
quote request page
sample box page
reorder information page
druckdaten page
production/shipping page
legal skeletons
sitemap
robots
metadata
schema helpers
internal links
```

Do not build the full platform yet.

---

## 2. Mandatory Reading

Before coding, read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/03-PRODUCT-STRATEGY.md
/docs/10-TECH-STACK.md
/docs/12-DATABASE-SCHEMA.md
/docs/13-ENVIRONMENT-VARIABLES.md
/docs/20-SEO-STRATEGY-2026.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/29-LEGAL-PAGES-GERMANY.md
/docs/30-PRODUCT-CATALOG.md
/docs/39-REPO-SETUP-AND-FOLDER-STRUCTURE.md
/docs/42-LAUNCH-READINESS-CHECKLIST.md
/docs/43-CODEX-PHASE-1-EXECUTION-PROMPT.md
```

If any file is missing, report it before implementation.

---

## 3. Non-Negotiable Rules

1. Public customer-facing UI must be German.
2. No English public pages.
3. No `/en` route.
4. No generic print categories.
5. Do not add flyers, business cards, posters, wedding cards or generic stickers.
6. Brand name must be `Labelpilot.de`.
7. Main product must be PP-Rollenetiketten.
8. Thermoetiketten are cross-sell.
9. Every P0 page must have German metadata.
10. Public pages must be mobile-friendly.
11. Legal placeholders must not pretend to be final legal advice.
12. Do not expose secrets.

---

## 4. Required Routes

Create or verify:

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

Redirect:

```txt
/ → /de
```

---

## 5. Required Config Files

Create/update:

```txt
config/products.ts
config/pricing.ts
config/metadata.ts
config/seo-routes.ts
config/navigation.ts
config/internal-links.ts
```

If repo structure differs, adapt but keep centralization.

---

## 6. Required Components

Create/update:

```txt
components/layout/Header.tsx
components/layout/Footer.tsx
components/content/DirectAnswer.tsx
components/content/FaqSection.tsx
components/content/RelatedLinks.tsx
components/content/ContentCta.tsx
components/content/ComplianceDisclaimer.tsx
components/product/SpecTable.tsx
components/product/PackageTable.tsx
components/forms/QuoteRequestForm.tsx
components/forms/SampleBoxForm.tsx
components/seo/JsonLd.tsx
components/seo/Breadcrumbs.tsx
```

Use simple, clean B2B design.

Do not overdesign.

---

## 7. Required Public Copy

Homepage must clearly say:

```txt
PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken
```

Use CTAs:

```txt
Angebot anfordern
Musterbox anfordern
Etiketten nachbestellen
Druckdaten vorbereiten
```

Do not use English CTAs.

---

## 8. Product Catalog

Use approved products only:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box
custom-quote
reorder
```

Do not invent products.

---

## 9. Forms

Implement quote and sample forms with German labels.

If backend persistence is not ready, create safe placeholder submission handlers and report the limitation.

Minimum validation:

```txt
required fields
valid email
privacy checkbox
German error messages
```

---

## 10. SEO Requirements

Implement:

```txt
app/sitemap.ts
app/robots.ts
metadata
canonical URLs
Open Graph
basic JSON-LD helpers
```

P0 pages must be indexable.

Private/future pages must be noindex.

---

## 11. Legal Requirements

Legal skeletons must exist.

Do not invent real company details.

Show legal review TODO where needed.

Footer must link to:

```txt
Impressum
Datenschutz
AGB
Versand
Widerruf
```

---

## 12. Commands to Run

Run available:

```txt
npm run lint
npm run typecheck
npm run build
```

If missing, report honestly.

---

## 13. Required Report

Return:

```txt
## Summary
## Files Changed
## Routes Created
## Checks Run
## Acceptance Criteria
## Missing / Deferred
## Next Step
```

No fake PASS.

---

## 14. Acceptance Criteria

| Check | Required |
|---|---|
| German public UI | PASS |
| P0 routes created | PASS |
| Product config created | PASS |
| Metadata implemented | PASS |
| Sitemap implemented | PASS |
| Robots implemented | PASS |
| Header/footer implemented | PASS |
| Quote page exists | PASS |
| Sample box page exists | PASS |
| Reorder page exists | PASS |
| Legal pages exist | PASS |
| No generic print products | PASS |
| No English public CTAs | PASS |

---

## 15. Final Instruction

Build Phase 1 only.

Do not jump to Stripe, upload, admin or customer portal unless existing code requires placeholders.

The goal is a correct German MVP foundation that can collect qualified demand.
