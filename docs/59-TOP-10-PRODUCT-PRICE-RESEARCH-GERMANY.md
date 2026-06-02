# 59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md

# Labelpilot.de — Top 10 Product and Price Research Germany

## 1. Purpose

This document defines the first **Top 10 commercial products/SKUs** for Labelpilot.de and the recommended Germany market pricing strategy.

It also compares these products against key competitors serving the German market:

```txt
Labelprint24 / All4Labels ecosystem
WIRmachenDRUCK
Flyeralarm
Onlineprinters
Vistaprint
Avery Zweckform
Sticker Mule / StickerApp style platforms
```

Important:

Most large competitors show final prices through live calculators with many variables:

```txt
size
shape
material
adhesive
roll direction
core size
finishing
quantity
delivery speed
VAT
shipping
file check
proof
```

Because of this, exact SKU-by-SKU competitor prices must be manually verified quarterly inside each competitor calculator.

This file gives:

1. Labelpilot.de’s first Top 10 product list.
2. Cost assumptions.
3. Recommended Labelpilot.de price architecture.
4. Competitor price visibility status.
5. Expected market price bands.
6. Margin logic.
7. Competitive response strategy.

---

## 2. Executive Verdict

## 1. Hüküm: Yap

Launch with the Top 10 below, but do **not** compete as the cheapest German online printer.

## 2. Neden: Kısa ve matematiksel

Your production assumptions:

```txt
100×200 PP label printed cost = €0.020 / unit
100×100 thermal label printed cost = €0.012 / unit
Parcel shipping = €10 / kg
Partial pallet = €500 / 250 kg = €2 / kg
```

If you sell only labels:

```txt
competitors can undercut or out-trust you
```

If you sell:

```txt
stored design + artwork versioning + one-click reorder + lot/SKT automation + refill reminder
```

then price does not need to be the lowest.

Target:

```txt
first order gross margin: 45–60%
reorder gross margin: 60–75%
reorder customer time: 30 seconds
manual printer reorder time: 15–30 minutes
```

---

## 3. Core Pricing Principle

Labelpilot.de should not price like a commodity label printer.

Use two layers:

### 3.1 Physical Label Price

Covers:

```txt
production
shipping
payment fee
packaging
basic support
basic technical file review
```

### 3.2 Software/Workflow Value

Embedded in price:

```txt
saved artwork
version history
stored design profile
one-click reorder
refill reminder
lot/SKT fields
B2B account portal
```

Do not give software value away mentally.

This is the difference between:

```txt
matbaa
```

and:

```txt
etiket altyapısı
```

---

## 4. Cost Assumptions Used

These are planning assumptions until real shipment weights are measured.

## 4.1 PP 100×200 Label

Base production cost:

```txt
€0.020 / unit
```

Estimated loaded cost assumptions:

| Quantity | Production | Estimated Direct Parcel / Ops Add-on | Estimated Pallet / Ops Add-on | Notes |
|---:|---:|---:|---:|---|
| 1,000 | €20 | €35–€55 | not relevant | parcel minimum hurts margin |
| 2,000 | €40 | €45–€70 | not relevant | useful reorder tier |
| 5,000 | €100 | €85–€120 | €45–€70 | direct parcel less attractive |
| 10,000 | €200 | €130–€180 | €75–€110 | pallet/consolidation improves margin |
| 20,000 | €400 | quote only | quote only | must quote |

The add-on includes estimated shipping, packaging, payment fee, support/file review buffer.

## 4.2 Thermal Labels

Production assumption:

```txt
100×100 eco thermal = €0.012 / unit
100×150 thermal shipping label estimated = €0.015–€0.018 / unit
```

Thermal labels are cross-sell, not core profit engine.

---

## 5. Top 10 Launch Product List

## 5.1 Product Selection Logic

Products were selected by:

```txt
Germany B2B relevance
repeat purchase potential
food/beverage/supplement fit
operational simplicity
margin potential
SEO/GEO value
reorder engine compatibility
```

Products not selected:

```txt
flyers
business cards
posters
generic stickers
wedding labels
DIY sheets
low-value hobby labels
```

---

## 6. Top 10 Products - Pricing Research Interpretation

This document is market and competitor research.

It is not the canonical customer-facing price source.

Final commercial Labelpilot package pricing lives in:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

The purpose of this section is to explain why the canonical commercial table in `04` is positioned the way it is.

## 7. Recommended Quote Thresholds

Do not show fixed checkout price for:

```txt
20,000+ PP labels
custom size
custom material
multi-SKU label sets
variable data above 50 rows
special finishing
pallet/consolidated shipment
Net 14 customers above credit limit
```

Use:

```txt
Individuelles B2B-Angebot anfordern
```

Reason:

At higher quantity, shipping, palletization, production batching and account value change economics.

---

## 8. Competitor Price Visibility Table

| Competitor | Price Visibility | Notes |
|---|---|---|
| Labelprint24 | Online calculator / configuration based | Strong label specialist; exact price depends on many variables |
| WIRmachenDRUCK | Product calculator / category pricing | Very broad online print; often price-led |
| Flyeralarm | Product calculator / category pricing | Strong brand; broad online print |
| Onlineprinters | Product calculator / category pricing | Broad European online print |
| Vistaprint | Product page / configuration pricing | Strong template/small-business UX |
| Avery Zweckform | Product/template/self-print + print services | Strong for DIY/sheet labels; not same as B2B PP roll infrastructure |
| Sticker Mule / StickerApp | Online instant-style pricing | Strong simple UX; sticker-first |

Important:

Exact competitor price for each SKU must be manually captured in a quarterly calculator audit.

---

## 9. Competitor Price Band Assumptions

Because exact competitor prices change dynamically, use these planning bands until manual calculator screenshots are collected.

These are **market planning bands**, not verified fixed quotes.

Commercial package pricing is canonically owned by:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

This research document should only describe competitor bands and strategic positioning.

| Product | Expected Competitor Band ex VAT | Labelpilot commercial reference | Position |
|---|---:|---|---|
| Sample Box | €0–€39 | See `/docs/04-PRICING-AND-MARGIN-MODEL.md` | qualified lead filter |
| Opaque PP 100×200 1,000 | €120–€250 | See canonical pricing table | competitive entry |
| Opaque PP 100×200 2,000 | €180–€350 | See canonical pricing table | competitive |
| Opaque PP 100×200 5,000 | €300–€650 | See canonical pricing table | middle; value via reorder |
| Opaque PP 100×200 10,000 | €550–€1,100 | See canonical pricing table | middle; quote if needed |
| Transparent PP 100×200 1,000 | €150–€320 | See canonical pricing table | aggressive premium entry |
| Transparent PP 100×200 2,000 | market gap / often custom | See canonical pricing table | premium micro-brand repeat path |
| Transparent PP 100×200 5,000 | €380–€800 | See canonical pricing table | competitive premium |
| Transparent PP 100×200 10,000 | €650–€1,200 | See canonical pricing table | premium scaling package |
| Supplement Variable Data 5,000 + 50 rows | often quote/manual | See canonical pricing table | differentiated, not commodity |
| Thermal Shipping 100×150 5,000 | €60–€180 | See canonical pricing table | cross-sell only |
| Eco Thermal 100×100 5,000 | €50–€150 | See canonical pricing table | cross-sell only |

---

## 10. Competitor Coverage by Product

| Product | Labelprint24 | WIRmachenDRUCK | Flyeralarm | Onlineprinters | Vistaprint | Avery | Sticker Mule/App | Labelpilot Strategy |
|---|---|---|---|---|---|---|---|---|
| Sample Box | likely/material samples possible | weak/unclear | weak/unclear | weak/unclear | template/sample style weak | strong template samples/DIY | weak | use as B2B qualification |
| Opake PP 100×200 1k | strong | strong | strong | strong | medium | low | medium | compete on saved design |
| Opake PP 100×200 5k | strong | strong | strong | strong | medium | low | medium | main SKU, no price war |
| Opake PP 100×200 10k | strong | strong | strong | strong | medium | low | medium | push quote/reorder |
| Transparent PP 100×200 | strong | medium/strong | medium/strong | medium/strong | medium | low | medium | target beverage/premium |
| Supplement Variable Data | possible industrial/manual | weak | weak | weak | weak | weak | weak | main wedge |
| Thermal 100×150 | medium | possible | possible | possible | low | medium | low | cross-sell |
| Eco Thermal 100×100 | medium | possible | possible | possible | low | medium | low | cross-sell |
| Saved Artwork Reorder | unclear/not hero | not hero | not hero | not hero | partial | no | partial | core differentiator |
| Refill Reminder | not visible | not visible | not visible | not visible | not visible | no | no | core differentiator |

---

## 11. Product-by-Product Strategy

## 11.1 Sample Box — Entry Offer Note

### Role

Lead qualification and trust-building.

### Why not free?

Free sample box attracts low-quality leads.

### Strategy

```txt
paid or qualified-lead gated
credit back on first order above €479
```

### Competitor comparison

Many competitors may offer samples or material information, but few make it a micro-brand onboarding funnel.

### Action

Make the sample box page strong:

```txt
compare opaque PP
compare transparent PP
compare thermal
explain reorder system
push quote/order
```

---

## 11.2 Opake PP 100×200 — 1,000 — Entry Positioning Note

### Role

Entry SKU.

### Margin issue

1,000 units has low production cost but high support/shipping burden.

Production:

```txt
1,000 × €0.020 = €20
```

Commercial selling price is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

Do not sell lower unless customer is likely to reorder.

### Strategy

Use as first order, not profit-max engine.

Ask:

```txt
Für wie viele Monate soll dieser Etikettenbestand reichen?
```

---

## 11.3 Opake PP 100×200 — 2,000 — Reorder Tier Note

### Role

Better micro-brand reorder tier.

Production:

```txt
2,000 × €0.020 = €40
```

Commercial selling price is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

### Why include 2,000?

Because reorder demand often sounds like:

```txt
Bitte 2.000 Stück vom gleichen Etikett nachbestellen.
```

This should remain a standard reorder option and align with the canonical package ladder.

---

## 11.4 Opake PP 100×200 — 5,000 — Core Package Note

### Role

Main product.

Production:

```txt
5,000 × €0.020 = €100
```

Commercial selling price is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

This is attractive if operations are automated.

### Strategy

Make this the default “Growth” package.

---

## 11.5 Opake PP 100×200 — 10,000 — Scaling Package Note

### Role

Scaling customer package.

Production:

```txt
10,000 × €0.020 = €200
```

Commercial selling price is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

### Strategy

Good package if consolidated shipping works.

For larger customers, quote instead of fixed price.

---

## 11.6 Transparent PP 100×200 — 1,000 — Positioning Note

### Role

Premium entry.

Transparent PP should be priced above opaque.

### Strategy

Target:

```txt
beverage
premium supplement
cosmetics/soap later
glass bottles/jars
```

---

## 11.7 Transparent PP 100×200 — 5,000 — Market Positioning Note

### Role

Main transparent premium package.

### Strategy

Avoid underpricing. Transparent is visual/premium.

Final commercial pricing for this package is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

The previous lower transparent Growth candidates are superseded by the canonical `€519` decision recorded there.

Use sample box to reduce uncertainty.

---

## 11.8 Supplement Variable Data PP 100×200 — Strategic Premium Note

### Role

Strategic wedge.

Includes:

```txt
5,000 labels
stored base design
up to 50 variable rows
Lot/SKT field support
Excel validation
admin batch review
generated print file
```

### Why premium?

Competitors may print labels, but this SKU sells workflow.

### Price logic

Commercial pricing is owned by `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

This research document only preserves the logic:

```txt
base PP package
+ variable-data workflow premium
```

This should not be discounted.

---

## 11.9 Thermal Shipping Labels 100×150 — 5,000 — Cross-Sell Note

### Role

Cross-sell.

Not a moat.

### Strategy

Sell to customers already buying product labels.

Do not spend SEO/ads budget heavily here.

---

## 11.10 Eco Thermal Labels 100×100 — 5,000 — Cross-Sell Note

### Role

Warehouse/fulfillment cross-sell.

### Strategy

Bundle:

```txt
Produktetiketten + Versandetiketten
```

Good for Shopify/Amazon/Etsy brands.

---

## 12. Recommended Price Architecture

Use package names:

```txt
Starter
Reorder Ready
Growth
Pro
B2B Quote
```

Example commercial package logic is owned by:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
```

Use this research document for market evidence, competitor framing, and package rationale only.

---

## 13. Pricing Psychology

Do not present as:

```txt
cheap labels
```

Present as:

```txt
Etiketten + gespeicherte Druckdaten + Nachbestell-System
```

Suggested German pricing line:

```txt
Alle Pakete enthalten technische Druckdatenprüfung und Speicherung freigegebener Druckdaten für spätere Nachbestellungen.
```

This justifies the price.

---

## 14. Competitor Audit Checklist

Every quarter, manually capture:

| Field | Required |
|---|---|
| Competitor | Yes |
| URL | Yes |
| Screenshot date | Yes |
| Size | Yes |
| Material | Yes |
| Adhesive | Yes |
| Quantity | Yes |
| VAT included/excluded | Yes |
| Shipping included/excluded | Yes |
| Delivery time | Yes |
| File check/proof included | Yes |
| Final checkout price | Yes |

Target competitors to audit:

```txt
Labelprint24
WIRmachenDRUCK
Flyeralarm
Onlineprinters
Vistaprint
Avery Zweckform
Sticker Mule
StickerApp
```

---

## 15. Manual Competitor Price Capture Template

Use this table during manual audit:

| Competitor | Product Match | Quantity | Material | Size | Price ex VAT | Price incl VAT | Shipping | Delivery | Notes |
|---|---|---:|---|---|---:|---:|---:|---|---|
| Labelprint24 | PP roll label | 5,000 | PP white | 100×200 | TBD | TBD | TBD | TBD | calculator |
| WIRmachenDRUCK | roll label | 5,000 | PP/film | 100×200 | TBD | TBD | TBD | TBD | calculator |
| Flyeralarm | roll label | 5,000 | film/PP | 100×200 | TBD | TBD | TBD | TBD | calculator |
| Onlineprinters | roll label | 5,000 | film/PP | 100×200 | TBD | TBD | TBD | TBD | calculator |
| Vistaprint | label/sticker | 1,000 | roll/film | closest | TBD | TBD | TBD | TBD | may not match exactly |
| Avery | custom printed/sheet | closest | sheet/roll | closest | TBD | TBD | TBD | TBD | different category |
| Sticker Mule | roll label/sticker | closest | roll/film | closest | TBD | TBD | TBD | TBD | global sticker platform |

---

## 16. Recommended Competitive Response

## If competitor is cheaper

Do not match blindly.

Use:

```txt
Unsere Preise enthalten gespeicherte Druckdaten und Nachbestellfähigkeit.
```

## If competitor is faster

Use:

```txt
Für wiederkehrende Bestellungen reduziert Labelpilot.de den Abstimmungsaufwand.
```

## If competitor has better brand trust

Use:

```txt
Musterbox + kleiner Starter + gespeicherte Designs.
```

## If customer wants only cheapest one-time sticker

Reject or let them go.

They are not target customer.

---

## 17. Risk + Solution

## Risk 1 — Our 1,000 price looks high

Solution:

```txt
Position 1,000 as starter with design memory.
Push 5,000 Growth as better value.
```

## Risk 2 — Thermal labels are too competitive

Solution:

```txt
Use thermal only as cross-sell.
Do not build business around it.
```

## Risk 3 — Competitor undercuts 5,000 PP

Solution:

```txt
Sell reorder system, not print-only.
```

## Risk 4 — Variable data too expensive

Solution:

```txt
Show supplement pain:
50 lot files manually prepared costs more than automation premium.
```

---

## 18. What Not To Do

Do not:

```txt
compete with WIRmachenDRUCK on all print products
undercut Flyeralarm
copy Vistaprint broadly
sell generic stickers
make thermal labels main business
give variable data automation free
offer Net 14 to unqualified customers
hide Turkey production
```

---

## 19. Action Plan

1. Add these Top 10 SKUs to `30-PRODUCT-CATALOG.md`.
2. Update `04-PRICING-AND-MARGIN-MODEL.md` with v2 prices.
3. Update product pages with Growth package emphasis.
4. Add Sample Box credit rule.
5. Add Supplement Variable Data SKU.
6. Add competitor audit spreadsheet later.
7. Manually capture competitor calculator screenshots before Google Ads launch.
8. Review prices after first 10 real quotes/orders.

---

## 20. Expected Output

With these prices:

```txt
1,000-unit order = accessible entry
2,000-unit order = reorder-friendly
5,000-unit order = main profit engine
10,000-unit order = scale package
20,000+ = quote
variable data = differentiated high-margin workflow
thermal = cross-sell
sample box = lead qualifier
```

---

## 21. Final Verdict

## 21. Price Positioning Refresh

Labelpilot.de must not undercut the market blindly.

Approved rule:

- do not look overpriced on a naive one-off comparison
- do not pretend a large `100×200 mm` custom PP label should be benchmarked against tiny-label headline prices
- only compare like-for-like or mark the comparison non-comparable

Old-to-new approved commercial level change:

| Product | Old net ladder | New net ladder |
|---|---|---|
| Opaque PP 100×200 | €149 / €229 / €399 / €699 | €179 / €279 / €479 / €799 |
| Transparent PP 100×200 | €169 / €254 / €429 / €749 | €199 / €309 / €519 / €849 |

The approved raise puts the `€479 / €799` opaque ladder and `€519 / €849` transparent ladder into a defendable middle band for a large-format B2B label, not an undercutting band.

## 22. Competitor Price Reference Snapshot Rules

Do not invent live prices beyond the documented hard data below.

| Competitor | Data quality | Size comparability | Price note | Confidence |
|---|---|---|---|---|
| Sticker Mule | hard public data | not comparable: about 50 cm² and smaller than our 100×200 mm | 1k=`€125`, 5k=`€337`, 10k=`€547`; 1 design per roll; free shipping + unlimited proof; no 100×200 mm | Medium |
| Labelprint24 | configurator-only | comparable in principle | 100×200 mm PP configurable; free EU shipping; free standard data check; Plus check `+€25`; white ink / laminate extra | High |
| Flyeralarm | configurator-only | comparable in principle | 100×200 mm PP foil offered; transparent white ink as separate paid variant; paid pro check / proof; net display | High |
| Onlineprinters | configurator-only | comparable in principle | contour cut `€24.90`, special format `€10.90`, data check `€6.90`, express `€10–25` net | High |
| WIRmachenDRUCK | configurator-only | often not comparable | `ab 0,01–0,02 €` headline is tiny `2–10 cm` labels only; paper `40×70 mm` `5k≈€160` gross is not like-for-like | Medium |
| Avery | configurator-only | partially comparable | transparent film includes white underprint free; incl. MwSt | Medium |
| Vistaprint | configurator-only | partially comparable | 100×200 mm achievable; estimate only; premium positioning | Low |
| StickerApp | configurator-only | not comparable in current public refs | small-label USD references only; large/high-volume goes manual quote | Low |

Exact prices must be captured via calculator screenshots before Google Ads launch.

## 23. Required Audit Columns

The audit template must include:

| Field | Required |
|---|---|
| Competitor | Yes |
| URL | Yes |
| Screenshot date | Yes |
| Label size | Yes |
| Label area | Yes |
| Material | Yes |
| White ink included? | Yes |
| Adhesive | Yes |
| Quantity | Yes |
| VAT included / excluded | Yes |
| Shipping included / excluded | Yes |
| File check / proof included | Yes |
| Delivery time | Yes |
| Final price | Yes |
| Confidence | Yes |
| Like-for-like? | Yes |

## 24. Price-Factor Matrix Cross-Reference

Use `/docs/04-PRICING-AND-MARGIN-MODEL.md` as the canonical factor matrix.

This research document must specifically check:

- quantity
- size / area
- material
- shape / cut type
- adhesive
- finish / lamination
- white ink
- foil / metallic
- variable data
- number of SKUs / designs
- proof / data-check level
- delivery speed
- shipping inclusion
- VAT presentation

## 25. Quote-Only Trigger List

The following must not be benchmarked as standard fixed-tier jobs:

- `20,000+`
- custom size
- custom material
- special adhesive
- special finishing
- white-ink-heavy transparent jobs
- metallic / foil
- multiple SKUs / designs
- variable data above `50` rows
- express
- pallet / consolidated delivery
- Net-14 above credit limit
- unclear artwork / heavy correction

## 26. Strategic Reminder

```txt
Every major competitor hides the real price behind a configurator.
Labelpilot.de wins by showing transparent indicative tiers and the exact inclusion scope up front.
```

The Top 10 product list should not be built around “what can we print?”

It should be built around:

```txt
what creates repeat B2B label customers?
```

The winning products are:

```txt
PP labels + stored designs + reorder + variable data
```

The losing products are:

```txt
cheap generic stickers
```
