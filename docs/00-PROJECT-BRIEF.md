# 00-PROJECT-BRIEF.md

# Project Brief — Labelpilot.de

## 1. Project Name and Domain

Final project name:

**Labelpilot.de**

Final domain:

**labelpilot.de**

Labelpilot.de is a Germany-focused, B2B-first producer of PP roll labels and a reorder platform. It positions as a premium, professional roll-label manufacturer with SaaS-like ordering clarity — not a generic online print shop and not a pure SaaS product.

---

## 2. Customer-Facing Language Rule

The MVP customer-facing site language is **German**.

This is now a hard rule.

Customer-facing German-only areas:

- Homepage
- Product pages
- Landing pages
- Checkout UI
- Upload UI
- Quote request forms
- Customer portal labels
- Error messages
- Email templates
- SEO titles/descriptions
- FAQs
- Legal pages
- CTA buttons

Allowed English areas:

- Code identifiers
- Internal comments when useful
- Admin-only technical fields if needed
- Documentation written for developers
- Database enum names
- Internal product IDs

Not allowed in MVP:

- English public product pages
- English CTAs
- Mixed German/English customer UI
- English customer-facing error messages

Correct examples:

```txt
Jetzt konfigurieren
Angebot anfordern
Musterbox anfordern
Etiketten nachbestellen
Druckdatei später senden
```

Wrong examples:

```txt
Configure now
Request quote
Order sample
Reorder labels
Send file later
```

---

## 3. One-Sentence Business Definition

Build a German-language, Germany-focused B2B roll-label producer and reorder platform that manufactures custom PP roll labels (with thermal labels as a secondary cross-sell), stores customer artwork and product specifications, and makes repeat orders fast, predictable, and profitable.

---

## 4. Core Business Model

The business is not a generic online print shop, not a playful sticker site, not a cheap exporter, and not a pure SaaS template.

The business is:

> A premium German-language, B2B-first PP roll-label producer and reorder infrastructure for German micro and small brands.

Positioning anchor: produce professional roll labels for product brands, keep ordering clear, and make repeat orders easier. The strategic moat is saved artwork plus one-click reorder.

The site will allow customers to:

1. Choose label type (opaque or transparent PP roll labels — the main category).
2. Choose label size (Standardgröße 100×200 mm fast-checkout, or Wunschformat/Sondermaß).
3. Choose quantity (5.000 Stück is the recommended commercial default; 20.000+ or complex orders go to the quote path).
4. Upload artwork (Druckdaten hochladen).
5. Request a Musterbox to evaluate materials before committing (key trust tool).
6. Pay online or request a quote (Angebot anfordern).
7. Receive proof confirmation (Proof vor Produktion).
8. Approve production.
9. Receive shipment from Turkey or, later, Germany hub.
10. Reorder the same saved label with one click (Etiketten nachbestellen).

All customer-facing copy must be German in MVP. Public pages are visual-first (product imagery, label-on-packaging mockups, material close-ups, spec/comparison tables, pricing cards, configurator preview, reorder-flow), not text-heavy or icon-card-grid SaaS layouts.

---

## 5. Strategic Goal

| Metric | Target |
|---|---:|
| Long-term net profit (north-star, ~Year 8–10) | €100,000+/month |
| Mid-term contribution milestone | €100,000+/month |
| Interim net profit (Year 2–3) | €8,000–35,000/month |
| Main market | Germany |
| Website language | German |
| Expansion market | DACH, then EU |
| Main customer type | B2B micro and small brands |
| Main category | Custom printed PP roll labels (opaque + transparent) |
| Standard package (fast-checkout anchor) | 100×200 mm PP roll labels |
| Additional size path | Wunschformat/Sondermaß (m² pricing or quote) |
| Secondary product | Thermal logistics labels |
| Production base | Turkey |
| Year 3 logistics | Germany hub pilot |
| Year 4+ logistics | Full Germany hub / Germany company optional |

---

## 6. Product Scope

Main category:

```txt
Custom printed PP roll labels for German B2B product brands
(Opake PP-Rollenetiketten · Transparente PP-Rollenetiketten)
```

Default fixed-price standard package (fast-checkout anchor):

```txt
100×200 mm individually printed PP roll labels
```

Customer-facing German names:

```txt
Opake PP-Rollenetiketten 100×200 mm
Transparente PP-Rollenetiketten 100×200 mm
```

Size paths on the same PP products (SoT #16; `04 §29`):

1. **Standardgröße 100×200 mm** — fixed-price packages (1.000 / 2.000 / 5.000 / 10.000), fastest checkout, canonical prices unchanged; 20.000+ → quote.
2. **Wunschformat / Sondermaß** — configurable width × height priced by m² when the custom-size engine is feature-gated ON **and** admin cost params are locked; otherwise routed to *„Individuelles Angebot anfordern"*.

`100×200 mm` remains the default and fastest checkout path. Wunschformat expands market fit (German competitors commonly allow custom sizes) and is protected by feature flag, admin cost parameters, margin floor and quote fallback. This is **not** a generic print shop — the catalog stays limited to PP roll labels plus the thermal cross-sell.

Cross-sell products:

```txt
Thermoetiketten 100×100 mm
Thermo-Versandetiketten 100×150 mm
```

---

## 7. Non-Negotiable Strategic Rules

1. Main category is PP roll product labels; `100×200 mm` is the standard fixed-price package and fast-checkout anchor, with Wunschformat/Sondermaß as a configurable size path on the same PP products (SoT #16; `04 §29`). Do not reduce the business to a single fixed size, and do not expand it into a generic print shop.
2. Thermal label is cross-sell.
3. Main market is Germany.
4. Customer-facing MVP language is German.
5. Main customer is B2B.
6. Main quantity target is 5,000+ labels.
7. Reorder system is core.
8. SEO and GEO are core.
9. Stripe payment is required.
10. GitHub + Vercel deployment is required.
11. Do not build generic matbaa marketplace.
12. Do not compete only on price.
13. Do not offer legal compliance responsibility.
14. Do not overbuild before first revenue.
15. Do not add low-margin print products to MVP.

---

## 8. Final Verdict

This project should be built as:

> A premium German-language, Germany-focused B2B PP roll-label producer and reorder platform.

Not as:

> A multilingual generic online print shop, a playful sticker site, a cheap exporter, or a generic SaaS landing page.

The first execution target:

Sell 5,000-unit 100×200 mm PP label packages to German food, beverage, and supplement micro brands.
