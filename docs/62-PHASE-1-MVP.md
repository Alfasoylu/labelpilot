# Canonical phase = 1 (per doc 74).

> **LEGACY numbering — canonical phases live in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.**
> This document keeps its historical filename/label. When build-phase naming conflicts, `74` wins.

# 62-PHASE-1-MVP.md

# Labelpilot.de — Phase 1 MVP Implementation Plan

## 1. Purpose

This document defines **Phase 1 MVP** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom label ordering and reorder platform.

Phase 1 is not the full business.

Phase 1 exists to build the smallest technically correct version that can:

1. Present the business clearly in German.
2. Show the approved MVP products.
3. Capture B2B quote demand.
4. Accept product orders later through Stripe integration.
5. Support future file upload, proofing and reorder architecture.
6. Establish SEO/GEO foundations.
7. Avoid generic online print shop drift.

Codex must follow this document when implementing Phase 1.

---

## 2. Phase 1 Verdict

Phase 1 should build the commercial and technical foundation.

The correct Phase 1 is:

> German public website + approved product catalog + SEO/GEO page structure + quote lead capture + architecture-ready foundations.

The wrong Phase 1 is:

> Overbuilt marketplace, generic print shop, design editor, large cart system or random product categories.

Phase 1 must be lean, focused and revenue-oriented.

---

## 3. Required Source Documents

Before implementing Phase 1, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/01-BUSINESS-MODEL.md
/docs/03-PRODUCT-STRATEGY-v2.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/62-PHASE-1-MVP.md
```

If implementation conflicts with any of these files, Codex must stop and report the conflict.

---

## 4. Phase 1 Language Rule

The MVP customer-facing site must be fully German.

German-only customer-facing areas in Phase 1:

- Homepage
- Product pages
- Landing pages
- Quote request form
- Sample box page
- Reorder information page
- CTAs
- Form labels
- Error messages
- SEO metadata
- FAQs
- Legal pages

Allowed English:

- Code identifiers
- Internal enum names
- Developer comments
- Internal documentation
- Admin-only technical labels if unavoidable

Not allowed:

- English public pages
- English CTAs
- English customer form labels
- Mixed German/English visible UI

---

## 5. Phase 1 Scope

Phase 1 must include:

1. Next.js app foundation.
2. German public page layout.
3. Brand identity usage: `Labelpilot.de`.
4. Product catalog config.
5. Approved MVP product pages.
6. German SEO landing pages.
7. Quote request form.
8. Sample box CTA/page.
9. Reorder information page.
10. Basic legal pages placeholders.
11. SEO metadata.
12. Sitemap.
13. Robots.txt.
14. Basic JSON-LD schema helpers.
15. Responsive mobile-first UI.
16. Clear CTA structure.
17. No generic print categories.

Phase 1 may prepare routes for Stripe/upload/admin but does not have to fully implement all workflows unless explicitly instructed.

---

## 6. Phase 1 Non-Scope

Do not build in Phase 1:

```txt
full Stripe payment
Stripe webhook
file upload storage
admin dashboard
customer portal
proofing workflow
full reorder checkout
design editor
AI label designer
multi-vendor marketplace
ERP
warehouse system
carrier API integration
advanced tax engine
subscription billing
English public pages
generic print product categories
```

These belong to later phases.

Exception:

If the user explicitly asks to combine Phase 1 with Stripe/upload, follow the relevant docs and update this file.

---

## 7. Approved MVP Products

Codex may implement only these product concepts in Phase 1:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box
custom-quote
reorder
```

Customer-facing German product names:

```txt
Opake PP-Rollenetiketten 100×200 mm
Transparente PP-Rollenetiketten 100×200 mm
Thermoetiketten 100×100 mm
Thermo-Versandetiketten 100×150 mm
Labelpilot Musterbox
Individuelles B2B-Angebot anfordern
Etiketten nachbestellen
```

---

## 8. Phase 1 Routes

### 8.1 Required Public Routes

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
```

### 8.2 Required Legal Routes

```txt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Legal pages can be placeholders in Phase 1, but they must exist.

Do not publish final legal claims without legal review.

### 8.3 Routes Not Needed in Phase 1

```txt
/en
/admin
/konto
/checkout
/api/stripe/webhook
```

These may exist as stubs only if needed later.

---

## 9. Phase 1 Page Requirements

Every public page must include:

1. German H1.
2. Clear German value proposition.
3. Direct answer block for GEO.
4. Relevant CTA.
5. Internal links.
6. SEO metadata.
7. Mobile-friendly layout.

Commercial pages must also include:

1. Product/specification table.
2. Use-case explanation.
3. Quantity/package mention.
4. Reorder benefit.
5. Quote CTA.
6. Sample box CTA.
7. FAQ section.
8. Compliance disclaimer where relevant.

---

## 10. Homepage Requirements

Route:

```txt
/de
```

Homepage goal:

> Explain Labelpilot.de in 5 seconds and push buyers to product/quote/sample.

Homepage must include:

1. Hero section
2. Main H1
3. Short entity definition
4. CTA: `Angebot anfordern`
5. CTA: `Musterbox anfordern`
6. Product category cards
7. Target segments
8. How it works
9. Reorder advantage
10. Turkey production + Germany delivery explanation
11. Trust signals
12. FAQ preview
13. Internal links to P0 pages

Recommended H1:

```txt
PP-Rollenetiketten für Lebensmittel-, Getränke- und Supplement-Marken
```

Recommended direct answer:

```txt
Labelpilot.de ist eine B2B-Plattform für individuell bedruckte PP-Rollenetiketten und Thermoetiketten für Marken in Deutschland. Der Fokus liegt auf Produktetiketten für Lebensmittel, Getränke und Supplemente sowie auf gespeicherten Druckdaten für einfache Nachbestellungen.
```

---

## 11. Product Page Requirements

Product pages must be practical and conversion-focused.

Required product pages:

```txt
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
```

Each product page must include:

1. H1
2. Product description
3. Specification table
4. Package options
5. Use cases
6. File upload explanation
7. Reorder explanation
8. Quote CTA
9. Sample CTA
10. FAQ
11. Related product links

Example CTA set:

```txt
Jetzt konfigurieren
Angebot anfordern
Musterbox anfordern
```

In Phase 1, `Jetzt konfigurieren` may link to the quote page if Stripe/configurator is not implemented yet.

---

## 12. Industry Landing Page Requirements

Required industry pages:

```txt
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
```

Each page must answer:

1. Who is this for?
2. Which label material fits?
3. Why PP roll labels?
4. Which quantity is recommended?
5. How does ordering work?
6. How does reorder work?
7. What is the customer responsible for legally?
8. How to request a quote?

Compliance disclaimer is mandatory on these pages.

---

## 13. Quote Request Form Requirements

Route:

```txt
/de/angebot-anfordern
```

Phase 1 must include a quote request form.

Required fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Telefon
Land
Produkttyp
Etikettengröße
Material
Menge
Ziel-Liefertermin
Notizen
```

Optional field:

```txt
Druckdatei später senden
```

File upload can be added in Phase 4. In Phase 1, the form may say:

```txt
Druckdatei können Sie im nächsten Schritt oder per E-Mail senden.
```

Submission behavior options:

- Save to database if DB is ready.
- Send email if email system is ready.
- Store as placeholder handler if backend not ready.

Codex must implement the best available minimal working option based on current project state.

---

## 14. Sample Box Page Requirements

Route:

```txt
/de/musterbox
```

Purpose:

Reduce trust friction.

Page must include:

1. What is inside the sample box.
2. Who should request it.
3. Which materials are included.
4. How it helps choose PP labels.
5. CTA to request sample box.
6. CTA to request quote.

German CTA:

```txt
Musterbox anfordern
```

---

## 15. Reorder Page Requirements

Route:

```txt
/de/nachbestellen
```

Purpose:

Make the reorder moat clear from day one.

Page must explain:

1. Labelpilot.de stores approved print data.
2. Customers can reorder faster.
3. Same material, size and quantity can be reused.
4. Quantity can be changed.
5. Minor changes can be requested.
6. Reorder lowers friction for recurring label buyers.

Recommended H1:

```txt
Etiketten einfacher nachbestellen
```

Direct answer:

```txt
Nach der ersten Bestellung speichert Labelpilot.de freigegebene Druckdaten, Material, Größe und Stückzahl. Dadurch können Kunden dieselben Etiketten später schneller erneut bestellen oder kleinere Änderungen anfragen.
```

---

## 16. File Requirements Page

Route:

```txt
/de/druckdaten
```

Purpose:

Reduce support and improve file quality.

Must include:

1. Accepted file formats.
2. Preferred file formats.
3. File size note.
4. Bleed/cut note.
5. Resolution note.
6. Proofing explanation.
7. Regulatory disclaimer.

Accepted formats:

```txt
PDF
AI
EPS
SVG
PNG
JPG
JPEG
ZIP
```

German page title:

```txt
Druckdaten für Etiketten vorbereiten
```

---

## 17. Production and Shipping Page

Route:

```txt
/de/produktion-versand
```

Purpose:

Create transparency about Turkey production and Germany delivery.

Must include:

1. Production in Turkey.
2. Germany-focused service.
3. Shipping to Germany.
4. Future Germany hub roadmap.
5. Why consolidated logistics matters.
6. Clear delivery expectation language.
7. No unrealistic speed claims.

Do not hide Turkey production.

Position it as:

```txt
Kosteneffiziente Produktion mit Deutschland-fokussiertem Service.
```

---

## 18. SEO Metadata Requirements

Every public route must define:

```txt
title
description
canonical
openGraph title
openGraph description
```

Example title:

```txt
Supplement-Etiketten drucken | Labelpilot.de
```

Example description:

```txt
Bedruckte PP-Rollenetiketten für Supplement-Marken in Deutschland. 100×200 mm, opak oder transparent, mit gespeicherter Druckdatei und einfacher Nachbestellung.
```

---

## 19. Schema Requirements

Phase 1 should include helpers or inline JSON-LD for:

```txt
Organization
WebSite
BreadcrumbList
FAQPage
Product
Service
```

Minimum required:

1. Organization schema on homepage.
2. WebSite schema on homepage.
3. FAQPage schema where visible FAQ exists.
4. BreadcrumbList on nested public pages.

Schema must match visible content.

---

## 20. Robots and Sitemap Requirements

Phase 1 must include:

```txt
app/sitemap.ts
app/robots.ts
```

Sitemap must include public German pages.

Robots must exclude:

```txt
/admin
/konto
/checkout
/api
```

Do not expose private files.

---

## 21. UI Requirements

Phase 1 UI must be:

1. Clean
2. German
3. B2B-friendly
4. Mobile-first
5. Fast
6. Trustworthy
7. Conversion-oriented
8. Not overdesigned

Visual direction:

```txt
modern B2B
clean label/packaging aesthetic
trust-first
not playful consumer sticker shop
```

Primary CTAs:

```txt
Angebot anfordern
Musterbox anfordern
Jetzt konfigurieren
Etiketten nachbestellen
```

---

## 22. Suggested Components

Codex may create:

```txt
components/layout/Header.tsx
components/layout/Footer.tsx
components/sections/Hero.tsx
components/sections/TrustBar.tsx
components/sections/ProductCards.tsx
components/sections/HowItWorks.tsx
components/sections/ReorderBenefit.tsx
components/sections/FaqSection.tsx
components/product/ProductSpecTable.tsx
components/product/PackageTable.tsx
components/forms/QuoteRequestForm.tsx
components/seo/JsonLd.tsx
```

Do not overcomponentize before needed.

---

## 23. Product Config Requirement

Codex must create or prepare centralized product config.

Recommended file:

```txt
config/products.ts
```

It must include approved products only.

Customer-facing fields must be German:

```ts
customerTitle: "Opake PP-Rollenetiketten 100×200 mm"
ctaLabel: "Jetzt konfigurieren"
```

---

## 24. Analytics Events

If analytics is added in Phase 1, track:

```txt
quote_form_view
quote_form_submit
sample_box_click
product_cta_click
reorder_cta_click
```

Do not delay Phase 1 for advanced analytics.

---

## 25. Phase 1 Acceptance Criteria

Phase 1 is accepted when:

| Check | Required Result |
|---|---|
| German public homepage exists | PASS |
| P0 SEO pages exist | PASS |
| Product catalog uses approved products only | PASS |
| No generic print products exist | PASS |
| Customer-facing UI is German | PASS |
| Quote request page exists | PASS |
| Sample box page exists | PASS |
| Reorder explanation page exists | PASS |
| Product pages include specs | PASS |
| Compliance disclaimer appears where needed | PASS |
| Sitemap exists | PASS |
| Robots exists | PASS |
| Metadata exists | PASS |
| Mobile layout works | PASS |
| No English public CTAs | PASS |

---

## 26. Phase 1 Test Checklist

Codex must run available checks.

Recommended commands:

```txt
npm run lint
npm run typecheck
npm run build
```

If commands do not exist, Codex must say so.

Manual smoke checks:

1. Visit `/de`.
2. Visit each P0 page.
3. Submit quote form with test data.
4. Check mobile layout.
5. Check no English visible in customer UI.
6. Check sitemap route.
7. Check robots route.
8. Check no generic product categories.
9. Check CTAs link correctly.
10. Check compliance disclaimer on sensitive pages.

---

## 27. Phase 1 PASS/FAIL Report Format

After implementation, Codex must report:

```txt
## Summary
- What was implemented

## Files Changed
- path/file.tsx

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended Phase 2 task
```

Codex must be honest about failed or skipped checks.

---

## 28. Phase 1 Common Mistakes to Avoid

Do not:

1. Add English public pages.
2. Add generic print products.
3. Build a cart before product pages are clear.
4. Build Stripe before the quote/product foundation if not requested.
5. Overbuild admin panel.
6. Hide Turkey production.
7. Claim legal compliance review.
8. Use vague marketing copy.
9. Skip metadata.
10. Skip mobile layout.
11. Use random hardcoded products in components.
12. Create thin SEO pages.
13. Add a blog before commercial pages.

---

## 29. Phase 1 Final Verdict

Phase 1 must create the German commercial foundation for Labelpilot.de.

The correct outcome:

> A German B2B label website with focused PP label products, clear quote/sample/reorder CTAs, SEO/GEO-ready pages and no generic print-shop clutter.

The wrong outcome:

> A broad print website with many categories, mixed languages and no clear B2B reorder positioning.
