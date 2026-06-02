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
100×200 PP label production cost is no longer modeled as a flat unit cost
use the degressive high-side placeholder ladder in 04 §6
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

Production-cost basis for PP 100×200:

```txt
See 04 §6:
opaque PP = €0.13 / €0.09 / €0.06 / €0.05 at 1k / 2k / 5k / 10k
transparent PP = €0.16 / €0.11 / €0.08 / €0.07 at 1k / 2k / 5k / 10k
high-side placeholder estimates only
replace with real supplier quotes before scaling
```

Estimated loaded cost assumptions:

| Quantity | Opaque production basis | Transparent production basis | Estimated Direct Parcel / Ops Add-on | Estimated Pallet / Ops Add-on | Notes |
|---:|---:|---:|---:|---:|---|
| 1,000 | €130 | €160 | €35–€55 | not relevant | parcel minimum hurts margin; high-side placeholder basis |
| 2,000 | €180 | €220 | €45–€70 | not relevant | useful reorder tier; contribution still needs exact handling/CAC model |
| 5,000 | €300 | €400 | €85–€120 | €45–€70 | direct parcel less attractive |
| 10,000 | €500 | €700 | €130–€180 | €75–€110 | pallet/consolidation improves margin |
| 20,000 | quote-only | quote-only | quote only | quote only | must quote with real supplier pricing |

The add-on includes estimated shipping, packaging, payment fee, support/file review buffer.

Action / OPEN QUESTION:

```txt
Obtain real tiered supplier quotes for opaque + transparent PP at 1k / 2k / 5k / 10k,
with and without lamination, plus one-time tooling fee,
to replace the placeholder production-cost ladder in 04 §6 before scaling paid acquisition.
```

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

1,000 units has high per-unit production cost plus high support/shipping burden.

Production:

```txt
1,000 × €0.13 = €130
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
2,000 × €0.09 = €180
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
5,000 × €0.06 = €300
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
10,000 × €0.05 = €500
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

---

## 27. Competitor Variant & Pricing Field Report — 2026-06-03 (website-only data)

> **Source rule honoured:** every figure in this section was read directly from the competitor's own website on **2026-06-03** via automated fetch. Where a site gates pricing behind a JS configurator, it is marked **"configurator-only — no public price"** and **no number was invented, estimated, or recalled from memory.** Source URLs are listed in §27.6.

### 27.1 Headline finding

**No German competitor publishes a price for a 100×200 mm PP roll label.** Every major player (Labelprint24, WIRmachenDRUCK, Flyeralarm, Onlineprinters/diedruckerei, Avery WePrint, print24) hides per-spec roll-label pricing behind a live configurator. The only hard public prices found anywhere were for labels far smaller than ours. This directly validates §26: Labelpilot wins by showing transparent indicative tiers + inclusion scope up front.

### 27.2 Variant matrix — what the market actually sells (website-verified)

| Competitor | Key materials (literal) | Size range / format | Shapes | White ink (Weißdruck) | Qty range | Reaches 100×200 mm? | Price visibility |
|---|---|---|---|---|---|---|---|
| Labelprint24 | Paper + **PP / PE / PVC** film; deep-freeze adhesive | Standard + Wunschformat (no min/max shown); cores 26/40/50/76 mm | round, oval, rect, square, star | **Yes** | not shown | Yes (custom) | configurator-only (1 illustrative sample) |
| WIRmachenDRUCK | white & transparent **PP 50–100 µ**, PO, PVC, paper, sustainable | Wunschformat + round 2–10 cm | rect, round, oval, square, star, freeform | transparent "No-Label-Look" (Weißdruck not confirmed) | **1–300,000** | Yes (custom) | configurator-only (round teasers public) |
| Flyeralarm | Haftfolie / Haftpapier / Strukturpapier (PP not enumerated) | Wunschformat **16×16–296×296 mm** | round, oval, rect, square, contour | **Yes (dedicated SKU)** | ab 1 Stück | Yes (within range) | configurator-only |
| Onlineprinters / diedruckerei | mostly **paper** (90/80/70 g) + 45 g transparent ("PP, wasserresistent") | freie Formateingabe; Bahnteilung 1/2/3 rolls | eckig, rund, Formschnitt | Yes (transparent in Weiß) | not shown | Yes (paper-led; no prominent white-opaque-PP roll SKU) | configurator-only |
| Avery WePrint | transparent film + paper | **20×20–300×300 mm** (no 100×200 listed) | configurator | not stated | small qty ok | partial (≤300×300, square-oriented) | configurator-only |
| print24 | white **PP Haftfolie** + papers | **20×20–280×500 mm**, 28 formats | square, rect, round, oval | **Yes ("CMYK plus Weiß")** | ≤ 50,000/order | **Yes (best fit)** | configurator-only |
| StickerApp | white / transparent / silver / kraft | ≤ ~254×254 mm (square, sticker-first) | round, oval, square, contour | not mentioned | min 139 | **No** | USD table public (.com); .de configurator-only |
| Saxoprint | (no roll product; PP only as outdoor stickers / sheets) | — | — | — | — | **No roll-label product** | n/a |
| etiketten-drucken.de *(independent benchmark, NOT a target competitor)* | PP white / transparent / silver, paper, recycled | **10×10–900×300 mm**; cores 40/76 mm; 8 winding dirs | rect, round, oval, freeform | **Yes (Weißdruck)** | 1–100,000; ≤50 designs | Yes | price table at 40×70 mm exists **but is "ab"/starting & material-UNCONFIRMED** — see §27.3 downgrade |

Common market variants we deliberately do NOT expose (all routed to quote per §25): multiple materials beyond opaque/transparent PP, custom sizes, silver/metallic, sustainable papers, removable/deep-freeze adhesives, lamination/soft-touch/hot-foil, multi-design per roll, winding-direction choice, roll splitting.

### 27.3 The ONLY publicly published prices (verbatim) — none is like-for-like with our 100×200 mm

| Source | Spec (size) | Published price | VAT basis | Note |
|---|---|---|---|---|
| WIRmachenDRUCK | round labels **2–7 cm** | **ab 0,01 €/Stück** | brutto, inkl. DE-Versand | per-unit teaser at max volume |
| WIRmachenDRUCK | round labels **8–10 cm** | **ab 0,02 €/Stück** | brutto, inkl. DE-Versand | per-unit teaser |
| Labelprint24 | `1.000`, `PP film, transparent, gloss, permanent adhesive, 0.05 mm`, `100 × 148 mm rectangular`, `1 artwork version` | **£260.05 net / £312.06 gross** *(UK screenshot)* and **€290.18 net / €345.31 gross** *(DE screenshot)* | country-dependent VAT/currency | live calculator capture from the same product URL; not like-for-like with our `100×200 mm` |
| etiketten-drucken.de | 40×70 mm, listed as "PP-Folie weiß" | 1.000 = 85,97 € · 2.500 = 113,99 € · 5.000 = 160,56 € | brutto inkl. MwSt | **"ab"/starting price; UNCONFIRMED as PP printed-film.** Re-audit 2026-06-03: these figures are **identical to the "Papier weiß" column**, which contradicts the site's own note that films cost more — i.e. this is a generic base/starting table, not a material-recalculated PP-printed price. A separate `/blankoetiketten` (blank/unbedruckt) product also exists. Do NOT treat as confirmed PP pricing without a calculator screenshot. |
| etiketten-drucken.de | 40×70 mm, listed as "PP-Folie transparent" | 1.000 = 110,80 € · 2.500 = 147,81 € · 5.000 = 209,33 € | brutto inkl. MwSt | same "ab"/starting + UNCONFIRMED caveat; the "+30% vs white" delta is unreliable because the white-PP baseline equals paper. |
| StickerApp (.com) | size unspecified | 139 = **$56** … 2.000 = **$156** | not stated (USD) | sticker-first, no 100×200 product |

**Like-for-like caveat:** our product is a **200 cm² (100×200 mm)** label. The only public prices above are for **28 cm² (40×70 mm)** and **round 2–10 cm** labels. They are **not comparable** to our €179–€849 ladder and must not be used to call us "expensive" (reaffirms §21).

**Material / confidence downgrade (etiketten-drucken.de):** material confidence requires a calculator screenshot / source verification. The public page text also references **paper-label examples around 160 € at 5.000 units with the SAME figures as "PP-Folie weiß"; do not treat this as confirmed PP-film pricing without a screenshot.** More broadly, several public competitor numbers in this section are **"ab"/starting** and/or possibly **blank-label (unbedruckt)** prices — these make competitors look cheaper than a real printed 100×200 mm PP job and must NOT be read as like-for-like. **This 40×70 mm benchmark must NOT be used to judge Labelpilot's 100×200 mm PP pricing.** No Labelpilot prices are changed on the basis of this benchmark.

### 27.4 Inclusion / service benchmark — German market table-stakes (website-verified)

| Competitor | Free DE shipping | Free data check (Datencheck) | VAT shown as | Delivery (where stated) |
|---|---|---|---|---|
| Labelprint24 | **Yes** (Versandkostenfrei) | not disclosed | netto (on the one sample) | ab 2 Tagen / 48h Express |
| WIRmachenDRUCK | **Yes** | **Yes (free)** + Tiefpreis-Garantie | brutto (teasers) | "Same Day" referenced |
| Flyeralarm | not exposed | not exposed | not exposed | not exposed |
| Onlineprinters | **Yes** (kostenloser Standardversand) | **Yes** (kostenloser Datencheck) + Bestpreis-Garantie | not exposed | not exposed |
| Avery WePrint | only **≥ €59** | **€10 inkl. MwSt (paid)** | inkl. MwSt | 5–7 Werktage after approval |
| print24 | not exposed | not exposed | not exposed | not exposed |
| etiketten-drucken.de | **Yes** | **Yes** (+ free Laserschnitt, Probedruck) | brutto inkl. MwSt | 24h/48h Express + 5–7 Tage |

Take-away: **free DE shipping and free data check are the norm**, not a premium favour. Avery is the outlier (paid €10 data check, shipping only ≥ €59).

### 27.5 What Labelpilot should do (grounded only in the data above)

1. **Price-transparency is the real wedge.** No competitor shows a 100×200 mm price; every one forces a configurator. Keep showing indicative net+gross tiers + exact inclusion scope on the product/pricing pages — this is a genuine, defensible difference, not a slogan.
2. **Transparent likely warrants a bigger premium over opaque — but anchor it only on confirmed data.** The etiketten-drucken.de "+30%" figure is **UNCONFIRMED** (see §27.3 downgrade: its white-PP baseline equals paper) and must NOT drive pricing. The cleaner signal is the WIRmachenDRUCK **calculator capture** in §27.5.1 (same-material PP, area-normalized to 100×200 mm): opaque PP 5.000 ≈ €290,93 net vs transparent PP 5.000 ≈ €375,53 net ≈ **+29%**. Our current ladder is **+11%** (€199 vs €179 @1k), which looks conservative — but **do not change prices from this report**; confirm with a like-for-like 100×200 mm screenshot first. *(Commercial pricing is owned by `04-PRICING-AND-MARGIN-MODEL.md`.)*
3. **Present free shipping + free data check as standard, not as a favour.** They are table-stakes in this market (WMD, Onlineprinters, Labelprint24, etiketten-drucken all free). Our "Versand nach Deutschland inklusive" + "Druckdatenprüfung inklusive" simply matches the norm — do not frame them as premium giveaways.
4. **Address white underprint (Weißdruck) on the transparent product page.** Every capable competitor offers it (Flyeralarm dedicated SKU, print24 "CMYK plus Weiß", Labelprint24, etiketten-drucken). Keep white-ink-heavy transparent jobs as a **quote trigger** (§25 / doc 30), but state explicitly that white underprint is supported via quote, so we do not look less capable than the configurators.
5. **Deliberate narrowness is fine — keep it, and route the rest to quote.** Competitors win on breadth (materials, sizes to 280–900 mm, winding, multi-design, cores, metallic, sustainable). We intentionally fix 100×200 mm / opaque-or-transparent / 1 design for MVP speed. Hold the line; send all other variants to "Individuelles B2B-Angebot" (§25).
6. **Do NOT price-war on per-unit headlines.** The only public per-unit number ("ab 0,01 €/Stück", WMD) is a 2 cm round label at up to 300,000 pcs — economically irrelevant to a 200 cm² label. Reaffirm §21 / §26.
7. **Next quarterly action — capture the three real like-for-like benchmarks.** Only **Labelprint24, Flyeralarm, and print24** genuinely reach 100×200 mm with PP film. Capture configurator screenshots at **100×200 mm white PP, 1.000 / 5.000** (net + gross, shipping + data-check state) for these three — that is the only valid head-to-head and is still missing because all three are configurator-gated.

### 27.5.1 WIRmachenDRUCK nearest-product benchmark (calculator capture + area normalization)

This addendum tightens the WIRmachenDRUCK read with direct calculator capture from live product pages.

Key clarification:

1. WIRmachenDRUCK does have real PP-roll-label depth.
2. The `71x96 mm` fixed-format page exposes:
   - opaque PP
   - transparent PP
   - transparent PP with partial white print
3. The `No Label Look` free-size page exposes:
   - transparent PP / PET liner
   - transparent PP / PET liner with white print
4. The new `opake` free-size link is operationally useful, but its surfaced exact-size material is opake paper, not opaque PP.

Area-normalization basis for the fixed-format PP page:

```txt
Labelpilot size = 100x200 mm = 20,000 mm² = 0.0200 m²
WIRmachenDRUCK fixed PP size = 71x96 mm = 6,816 mm² = 0.006816 m²
Normalization factor = 20,000 / 6,816 = 2.9343
Equivalent 100x200 price = observed 71x96 price x 2.9343
```

| Source SKU | Material read | Match type | Method | 1.000 net | 5.000 net | 10.000 net | Confidence | Comment |
|---|---|---|---|---:|---:|---:|---|---|
| Fixed format `7,1 x 9,6 cm` | `Indoor: 60µ PP Haftfolie weiß glänzend` | nearest opaque PP | area-normalized to `100x200 mm` | `€186,94` | `€290,93` | `€541,73` | Medium | same material family, smaller size |
| Fixed format `7,1 x 9,6 cm` | `Indoor: 50µ PP Haftfolie transparent glänzend` | nearest transparent PP | area-normalized to `100x200 mm` | `€203,87` | `€375,53` | `€710,94` | Medium | strongest same-material transparent comparison publicly reachable |
| Fixed format `7,1 x 9,6 cm` | `Indoor: 50µ PP Haftfolie transparent glänzend mit partiellem Weißdruck` | transparent + white benchmark | area-normalized to `100x200 mm` | `€237,73` | `€544,78` | `€1.049,38` | Medium | confirms WIRmachenDRUCK supports white print and that it materially lifts price |
| Free size `10 x 20 cm` | `No Label Look: 60µ PP Haftfolie transparent glänzend mit 30µ PET Liner` | exact-size transparent benchmark | direct calculator | `€62,80` | `€286,00` | `€572,00` | High | exact size, but no-label-look construction rather than standard transparent PP |
| Free size `10 x 20 cm` | `Opakes Haftetikettenpapier 90 g/m²` | exact-size but wrong material | direct calculator | `€68,80` | `€312,00` | `€624,00` | Medium-Low | exact size, but paper not PP; do not treat as a true opaque-PP equivalent |

Working read:

1. WIRmachenDRUCK should now be treated as a real PP comparator, not only as a tiny-round-label teaser competitor.
2. The cleanest same-material comparison currently available is:
   - opaque PP = `71x96 mm` fixed PP page, normalized by area
   - transparent PP = `71x96 mm` fixed PP page, normalized by area
3. The cleanest exact-size transparent comparison currently available is:
   - `10x20 cm` No-Label-Look free-size calculator
4. The new `opake` free-size link should stay in the audit set, but only as an exact-size paper floor check. It must not be used as a like-for-like opaque-PP price anchor.

### 27.5.2 Labelprint24 configurator capture — structure, selected variant, and price factors

This addendum records the exact structure and visible pricing logic from the live Labelprint24 calculator URL shared in this thread:

```txt
https://www.labelprint24.com/en/products/roll-labels-1?label_material_group=2&label_material=20
```

#### Captured screenshot state

The provided screenshots show the following selected configuration:

| Field | Observed value |
|---|---|
| Quantity | `1,000` |
| Number of artwork versions | `1` |
| Material | `PP film` |
| Material specification | `PP film, transparent, gloss, permanent adhesive, 0.05 mm` |
| Format | `100 × 148 - rectangular` |
| Shape | `Rectangular` |
| Width | `100 mm` |
| Height | `148 mm` |
| Corner radius | `2 mm` |
| Cutter size | `100 mm × 148 mm / Rectangular / 2 mm Corner radius` |
| Print data mode | `Own print data` |
| UV varnish | `gloss varnish` |
| Protective laminate | `no laminate` |
| Hot foil stamping | `no hot foil stamping` |
| Tactile warning triangle | `no tactile warning triangle` |
| Production time | `Standard Production: 5 Business days (+ delivery time)` |
| Delivery country | `Germany` in the later screenshot |
| Currency | `Euro` in the later screenshot |

Observed cost summary from the screenshots:

| Screenshot state | Base / Total net | VAT | Total incl. VAT | Delivery |
|---|---:|---:|---:|---|
| Initial `/en` screenshot, UK tax/currency view | `£260.05` | `£52.01` (`VAT 20% UK`) | `£312.06` | included |
| Later screenshot with `Germany` + `Euro` selected | `€290.18` | `€55.13` (`VAT 19% DE`) | `€345.31` | included |

Interpretation:

1. Labelprint24's visible price is not only product-spec dependent; it is also **delivery-country / VAT / currency dependent**.
2. The screenshoted Labelprint24 price is for **transparent PP 100×148 mm**, not our `100×200 mm` product.
3. This is therefore a useful calculator benchmark, but **not** a direct like-for-like price anchor.

#### Pricing-page structure

Labelprint24's product page behaves like a dense industrial label configurator with a persistent summary rail rather than a simple product card.

Visible layout pattern:

1. **Left column configurator**
   - quantity
   - artwork versions
   - material
   - material specification
   - label shape / format / width / height / corner radius / cutter size
   - roll configuration
   - finish settings
   - embellishment
   - additional options
   - delivery terms
2. **Right sticky cost summary**
   - base price
   - total net
   - VAT by delivery country
   - total incl. VAT
   - delivery included note
   - print-data mode selector
   - add-to-cart / quote / guideline / print-data-requirements actions

This is strategically important because the page looks and behaves like a true B2B calculator, not a generic sticker PDP.

#### Variant structure observed

From the live page content and screenshots, Labelprint24 exposes at least the following variant dimensions on this roll-label configurator:

```txt
quantity
number of artwork versions
material group
material specification
format
shape
width
height
corner radius
cutter size
roll configuration
UV varnish
protective laminate
embellishment
additional services
production time
delivery country
currency
print-data mode
```

The page content also confirms broader roll-label capability:

```txt
paper, PP, PE, PVC
rectangular, oval, round, special shape
choice of roll core and winding direction
film finishing / varnish / laminate
digital and flexo positioning
free dispatch
48-hour express production messaging
```

#### Price-impacting factors visible on the page

The screenshots and page content make the following price drivers explicit:

1. quantity
2. number of artwork versions
3. material
4. material specification
5. width and height
6. corner radius / cutter geometry
7. roll configuration
8. UV varnish
9. protective laminate
10. embellishment options
11. professional artwork check (`15 EUR`)
12. suitable for thermal transfer printing (`10 EUR`)
13. barcode verification (`25 EUR`)
14. printed proof
15. production speed
16. delivery country
17. currency

Strategic read:

1. Labelprint24 is still the strongest direct competitor because it combines **real label depth** with a serious calculator UX.
2. The screenshots confirm that Labelprint24 does not just hide price — it exposes a **fully parameterized industrial pricing model**.
3. This strengthens our earlier conclusion: Labelpilot should not try to out-catalog Labelprint24. It should win on narrower scope, saved artwork, repeat ordering speed, and price-transparency for the chosen core SKU.

### 27.6 Source URLs (fetched 2026-06-03)

WIRmachenDRUCK exact audit URLs added on 2026-06-03:

```txt
https://www.wir-machen-druck.de/hochwertige-etiketten-auf-rolle-rechteckig-71-x-96-cm.html
https://www.wir-machen-druck.de/hochwertige-no-label-look-etiketten-auf-rolle-mit-freier-groesse-rechteckig.html
https://www.wir-machen-druck.de/hochwertige-opake-etiketten-auf-rolle-mit-freier-groesse-rechteckig.html
```

```txt
Labelprint24:        labelprint24.com/de/products/roll-labels-1
                     labelprint24.com/de/products/pp-labels-615
                     labelprint24.com/de/category/printed-labels-17
                     labelprint24.com/en/products/roll-labels-1?label_material_group=2&label_material=20
WIRmachenDRUCK:      wir-machen-druck.de/etiketten-auf-rolle-...,category,17017.html
                     wir-machen-druck.de/standardetiketten-auf-rolle-...,category,20649.html
                     wir-machen-druck.de/runde-formate-guenstig-drucken,category,29558.html
                     wir-machen-druck.de/...-folienkaschierung-...,category,28127.html
Flyeralarm:          flyeralarm.com/de/p/etiketten-auf-rolle-4333297.html
                     flyeralarm.com/de/shop/customformat/selectformat/id/6843/...
                     flyeralarm.com/de/p/etiketten-auf-rolle-mit-zusatzfarbe-weis-4213298.html
Onlineprinters:      onlineprinters.de/k/etiketten-auf-rolle-4 (diedruckerei.de 301→ onlineprinters.de)
Avery WePrint:       avery-zweckform.com/druckservice/rollenetiketten-drucken-lassen (domain 403s automated fetch; facts from own-site snippets)
print24:             print24.com/de/druckprodukte/aufkleber-etiketten/rollenetiketten
StickerApp:          stickerapp.com/labels/labels-on-roll · stickerapp.de/etiketten/etiketten-auf-rolle
Saxoprint:           saxoprint.de/werbebedarf/etiketten (no roll-label product)
etiketten-drucken.de (independent benchmark): etiketten-drucken.de/etiketten-auf-rolle
```

> Confidence: variant data **high** (read from live pages); published-price data **limited but exact** — only the figures above are public, everything else is configurator-only and was deliberately left blank rather than guessed.

### 27.7 Audit capture requirement (per competitor price snapshot)

Any competitor price recorded or relied on in this section MUST be backed by a saved calculator screenshot with ALL of these fields filled (no field may be blank or assumed). Until a screenshot exists, a figure stays "configurator-only" or "UNCONFIRMED" and must not be used as a like-for-like anchor or to judge Labelpilot pricing.

| Field | Required |
|---|---|
| Screenshot filename | Yes |
| Capture date | Yes |
| Material (incl. printed/bedruckt vs blanko, e.g. "PP-Folie weiß bedruckt") | Yes |
| Size | Yes |
| Quantity | Yes |
| VAT basis (netto / brutto) | Yes |
| Shipping included? | Yes |
| Data check included? | Yes |
| Final price | Yes |

**Still-required real benchmark (unchanged conclusion):** valid head-to-head pricing requires configurator screenshots for **Labelprint24, Flyeralarm and print24 at 100×200 mm white PP, 1.000 and 5.000 units** (net + gross, shipping + data-check state). This is the only like-for-like comparison and is still missing for the 5.000 tier.

### 27.8 Comparison with our own live site (observational only — no price change)

Linked canonical files: `04-PRICING-AND-MARGIN-MODEL.md` (prices), `30-PRODUCT-CATALOG.md` (scope). Our live ladder (shown on the site): opaque PP 100×200 mm = **€179 / €279 / €479 / €799 net** (1k/2k/5k/10k); transparent = **€199 / €309 / €519 / €849 net**. Packages: Pilotauflage / Standard (5.000, recommended) / Serie / B2B Abruf.

Read against the website data above:

1. **We are NOT demonstrably overpriced — the cheap-looking competitor headlines are not like-for-like.** They are tiny (40×70 mm, round 2–10 cm), "ab"/starting, and/or possibly blank-label. A real printed 100×200 mm PP job in any of their configurators would be far above those headlines.
2. **Closest CONFIRMED capture says we are cheaper:** Labelprint24's own calculator (§27.3 / §27.5.2) shows **transparent PP, 100×148 mm, 1.000 units = €290,18 net (DE)**. Our transparent PP at the **larger** 100×200 mm, 1.000 units = **€199 net** — i.e. ~€91 cheaper for ~35% more label area. At the one fully-verified competitor data point, Labelpilot is **below** Labelprint24. *(Size not identical — 148 vs 200 cm² — but this is the closest confirmed real capture and it favours us.)*
3. **At 5.000 the picture is unconfirmed.** The WMD area-normalized estimate (§27.5.1) puts opaque 5k ≈ €291 net / transparent 5k ≈ €376 net at 100×200 mm; our €479 / €519 net sit above that rough small-format-derived figure. This is **not** a confirmed like-for-like price (it is a 71×96 mm format scaled by area and excludes our included data check, proof, storage and reorder system), so it must not be used to conclude we are overpriced — capture the real 100×200 mm / 5.000 screenshots first (§27.7).
4. **Net:** keep prices as-is. Where confirmed data exists we look competitive-to-cheap; where it is missing, do not act on "ab"/starting/blank numbers. No price change is made from this report (reaffirms §21 and point 6 of the 2026-06-03 correction).
