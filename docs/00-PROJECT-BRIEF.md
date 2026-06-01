# 00-PROJECT-BRIEF.md

# Project Brief — Labelpilot.de

## 1. Project Name and Domain

Final project name:

**Labelpilot.de**

Final domain:

**labelpilot.de**

Labelpilot.de is a Germany-focused B2B-first custom label ordering and reorder platform.

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

Build a German-language, Germany-focused B2B label supply platform that sells custom PP product labels and thermal shipping labels, stores customer artwork and product specifications, and makes repeat orders fast, predictable, and profitable.

---

## 4. Core Business Model

The business is not a generic online print shop.

The business is:

> A German-language B2B-first label reorder infrastructure for German micro and small brands.

The site will allow customers to:

1. Choose label type.
2. Choose label size.
3. Choose quantity.
4. Upload artwork.
5. Pay online or request a quote.
6. Receive proof confirmation.
7. Approve production.
8. Receive shipment from Turkey or, later, Germany hub.
9. Reorder the same label with one click.

All customer-facing copy must be German in MVP.

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
| Main product | Custom PP roll product labels |
| Secondary product | Thermal logistics labels |
| Production base | Turkey |
| Year 3 logistics | Germany hub pilot |
| Year 4+ logistics | Full Germany hub / Germany company optional |

---

## 6. Product Scope

Main product:

```txt
100×200 mm individually printed PP roll labels
```

Customer-facing German names:

```txt
Opake PP-Rollenetiketten 100×200 mm
Transparente PP-Rollenetiketten 100×200 mm
```

Cross-sell products:

```txt
Thermoetiketten 100×100 mm
Thermo-Versandetiketten 100×150 mm
```

---

## 7. Non-Negotiable Strategic Rules

1. Main product is PP product label.
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

> A German-language Germany-focused B2B PP label reorder platform.

Not as:

> A multilingual generic online print shop.

The first execution target:

Sell 5,000-unit 100×200 mm PP label packages to German food, beverage, and supplement micro brands.
