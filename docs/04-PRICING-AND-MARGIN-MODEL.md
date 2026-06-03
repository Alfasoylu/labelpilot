# 04-PRICING-AND-MARGIN-MODEL.md

# Labelpilot.de — Pricing and Margin Model

## 1. Purpose

This document defines the pricing logic, margin assumptions, cost model, product package pricing, logistics assumptions, and scale economics for **Labelpilot.de**.

Codex must treat this document as the source of truth for pricing and margin logic until replaced by a newer approved version.

The project is not a generic print shop.

The project is a Germany-focused B2B-first PP label ordering and reorder platform.

---

## 2. Business Context

Labelpilot.de sells custom printed roll labels produced in Turkey and shipped to Germany.

Primary customer:

- German food brands
- Beverage brands
- Supplement brands
- Coffee brands
- Spice brands
- Honey / jam producers
- Small D2C product brands
- Micro B2B manufacturers

Primary product:

- 100×200 mm custom printed PP roll labels

Cross-sell product:

- 100×100 mm and 100×150 mm thermal labels

Long-term goal:

| Target | Value |
|---|---:|
| Market | Germany first |
| Business type | B2B-first |
| Production | Turkey |
| Year 3 | Germany hub pilot |
| Year 4+ | Full Germany hub if metrics justify |
| 10-year target (north-star) | €100,000+ monthly net profit |

---

## 3. Strategic Pricing Rule

Labelpilot.de must not compete only on lowest price.

The pricing strategy must balance:

1. Strong Turkey production cost advantage
2. German B2B trust
3. Healthy margin after logistics
4. Room for Stripe/payment cost
5. Room for reprint/fire risk
6. Room for customer support
7. Room for B2B sales acquisition cost
8. Strong incentive to buy 5,000+ units
9. Strong incentive to reorder

The platform must push customers toward:

> 5,000 and 10,000 unit PP label orders.

1,000 unit packages are allowed, but only as paid trial / entry offer.

---

## 4. Currency

Primary business currency:

```txt
EUR
```

All pricing shown to German customers must be in EUR.

---

## 5. VAT Logic

### 5.1 B2C / IOSS Orders

For eligible B2C imports into the EU under IOSS rules, prices may be shown VAT-inclusive where required.

Working VAT assumption:

```txt
Germany VAT = 19%
```

VAT-inclusive to net revenue formula:

```txt
net_revenue = gross_price / 1.19
```

Example:

```txt
€213.01 brutto / 1.19 = €179.00 netto
```

### 5.2 B2B Orders

For B2B buyers, pricing logic may depend on the invoicing model, VAT registration, reverse charge, export logic, and company structure.

Until final legal/tax setup is confirmed:

- Use net B2B pricing internally.
- Show both `net` and `gross (19% MwSt)` on customer-facing fixed-price pages.
- Treat the approved fixed-price ladder as `all-in incl. shipping to Germany`.
- Do not hardcode tax logic in product price.
- Keep tax handling isolated in a tax/pricing service.

### 5.3 Development Rule

Codex must not hardcode VAT assumptions across the app.

Use central config.

Recommended config file:

```txt
/src/config/pricing.ts
```

Suggested constants:

```ts
export const PRICING_CONFIG = {
  currency: "EUR",
  germanyVatRate: 0.19,
  directShippingCostPerKg: 10,
  palletShippingCostPerKg: 2,
  stripeVariableFeeEstimate: 0.04,
};
```

---

## 6. Degressive Production Cost Model

These are the current planning guardrails for the large `100×200 mm` PP label.

Important:

```txt
HIGH-SIDE PLACEHOLDER ESTIMATES
internet-researched in Turkey
rough working FX basis: ~53 TRY / EUR
NOT verified supplier quotes
replace with real tiered supplier quotes after first orders
ex-works Turkey production cost only
recoverable KDV excluded
lamination + freight/import added separately
```

### 6.1 Degressive Ex-Works Unit Cost Ladder

The `100×200 mm` format is large at roughly `200 cm²`.

Tooling amortization is assumed inside the `1,000` row.

| Material | 1,000 | 2,000 | 5,000 | 10,000 |
|---|---:|---:|---:|---:|
| Opaque PP 100×200 | €0.13 / unit | €0.09 / unit | €0.06 / unit | €0.05 / unit |
| Transparent PP 100×200 | €0.16 / unit | €0.11 / unit | €0.08 / unit | €0.07 / unit |

### 6.2 Cost Driver Matrix

| Cost driver | Direction / magnitude | Operational note |
|---|---|---|
| Quantity | Strong degression; low quantity much higher per-unit because setup/tooling is amortized over fewer labels | Main reason `1,000` is structurally weak and `5,000+` is preferred |
| Size / area | Larger area increases material use and run length | `100×200 mm` is a large label, so tiny-label market headlines are not comparable |
| Material | Transparent PP is roughly `+30%` to `+35%` vs opaque PP | Reflected in the placeholder ladder above |
| White underprint | `+€0.005–0.01 / unit` | Transparent only; paid add-on / quote by owner decision |
| Lamination / premium finishing | Film lamination / soft-touch / foil starts around `+€0.02 / unit` and up | Protective standard varnish may be part of normal print finishing, but premium finishing is quote territory |
| Cut / tooling | Digital contour can be near `€0` incremental; physical die / tooling is one-time `~€47–66` | Tooling is amortized into first runs and should drop on repeat of the same artwork/spec |
| Colour complexity | Standard CMYK is base; spot/Pantone/extra white pushes to surcharge / quote | Keep MVP fixed ladder on standard CMYK |
| Print method | Digital is realistic up to roughly `20k–50k`; flexo only becomes cheaper at very high volume after plate fees | Quote-only volumes may switch economics materially |
| Freight TR→DE + import handling | Roughly `+€0.005–0.02 / unit` depending on consolidated vs parcel logic | Modeled separately in Sections 8, 12 and 13 |
| One-time tooling | `~€47–66` one-time | Repeat of the same approved artwork/spec should avoid re-charging this internally |

Realistic unit-cost range for custom roll labels:

```txt
~€0.05 / unit at high volume, simple specification
up to €0.50+ / unit at low quantity, large format, special finishes, or inefficient setup
```

### 6.3 Historical Note

The earlier flat planning placeholder:

```txt
€0.020 / unit
```

is removed from the active cost model and kept only as historical planning context.

Thermal planning remains separate and non-core:

```txt
100×100 eco thermal = €0.012 / unit
100×150 thermal shipping label estimated = €0.015–€0.018 / unit
```

---

## 7. Weight Assumptions

These are model assumptions and must be editable later.

| Product | Size | Estimated unit weight | 1,000 units |
|---|---:|---:|---:|
| Thermal label | 100×100 mm | 1.3–1.6 g | 1.3–1.6 kg |
| Thermal shipping label | 100×150 mm | 1.8–2.3 g | 1.8–2.3 kg |
| PP label | 100×200 mm | 2.5–3.2 g | 2.5–3.2 kg |

For conservative calculations:

```txt
PP label 100×200 mm = 3.0 g / unit
Thermal 100×100 mm = 1.5 g / unit
Thermal 100×150 mm = 2.1 g / unit
```

---

## 8. Logistics Assumptions

### 8.1 Direct Shipping

Direct Turkey-to-Germany parcel shipping:

```txt
€10 / kg
```

Use this for:

- Small orders
- First customer orders
- Urgent shipments
- MVP phase
- B2C-like orders

### 8.2 Partial Pallet / Consolidated Shipping

Partial pallet model:

```txt
€500 / euro pallet
250 kg product assumption
Effective cost = €2 / kg
```

Use this for:

- B2B orders
- Consolidated weekly shipping
- Germany hub shipments
- Repeat order batches
- High-volume customers

### 8.3 Strategic Rule

Small orders suffer from direct parcel shipping cost.

B2B orders become attractive when shipping is consolidated.

Therefore, the pricing model must encourage larger orders and repeat orders.

---

## 9. Other Cost Assumptions

These are working assumptions.

| Cost item | Assumption |
|---|---:|
| Stripe/payment variable cost estimate | 4% of gross price |
| Packaging / handling per small order | €3 |
| Packaging / handling per B2B order | €6–€15 |
| Reprint/fire buffer | 2%–3% of gross price or fixed estimate |
| B2B acquisition cost target | Under €60/order |
| Small order CAC target | Under €35/order |
| Reorder CAC | €0–€10 |
| Reorder email/CRM cost | €1–€5 |

---

## 10. Product Packages

### 10.1 Main PP Label Packages

| Package | Quantity | Product | Target customer | Pricing role |
|---|---:|---|---|---|
| Starter | 1,000 | 100x200 mm PP label | Paid trial / small buyer | Fixed price |
| Reorder Ready | 2,000 | 100x200 mm PP label | Micro-brand repeat path | Fixed price |
| Growth | 5,000 | 100x200 mm PP label | Main micro B2B buyer | Fixed price |
| Pro | 10,000 | 100x200 mm PP label | Growing B2B brand | Fixed price |
| Business | 20,000+ | 100x200 mm PP label | Repeat B2B account | Quote |

### 10.2 Material Variants

| Material | Pricing rule |
|---|---|
| Opaque PP | Base price |
| Transparent PP | Premium pricing per canonical table in Section 14.1 |
| Premium finish | Not in MVP unless margin model is confirmed |

### 10.3 Thermal Cross-Sell Packages

| Package | Quantity | Product | Target price logic |
|---|---:|---|---|
| Thermal Starter | 1,000 | 100×100 or 100×150 | Fixed price |
| Thermal Growth | 5,000 | 100×100 or 100×150 | Bundle price |
| Thermal Business | 10,000+ | 100×100 or 100×150 | Quote |
| Thermal Reorder | Repeat | Same previous spec | One-click reorder |

Thermal labels must not become the primary acquisition product.

They are used to increase AOV and support B2B customer retention.

---

## 11. Margin Model Formula

### 11.1 Gross Price to Net Revenue

For VAT-inclusive B2C-like orders:

```txt
net_revenue = gross_price / (1 + vat_rate)
```

For B2B net orders:

```txt
net_revenue = listed_net_price
```

### 11.2 Production Cost

```txt
production_cost = unit_production_cost * quantity
```

### 11.3 Weight

```txt
weight_kg = unit_weight_grams * quantity / 1000
```

### 11.4 Shipping Cost

Direct shipping:

```txt
shipping_cost = weight_kg * 10
```

Partial pallet / consolidated shipping:

```txt
shipping_cost = weight_kg * 2
```

### 11.5 Payment Cost

```txt
payment_cost = gross_price * 0.04
```

This is only an estimate.

The actual Stripe fee must be configured later.

### 11.6 Contribution Profit

```txt
contribution_profit =
  net_revenue
  - production_cost
  - shipping_cost
  - payment_cost
  - handling_cost
  - reprint_fire_buffer
  - acquisition_cost
```

### 11.7 Reorder Contribution Profit

```txt
reorder_contribution_profit =
  net_revenue
  - production_cost
  - shipping_cost
  - payment_cost
  - handling_cost
  - reprint_fire_buffer
  - reorder_crm_cost
```

---

## 12. PP Label Economics — Direct Shipping

These examples are recalculated on the canonical net package ladder from Section 14.1.

Formula basis used consistently in Sections 12, 13, 19 and 20:

```txt
listed_net_price = canonical package price
gross_reference_price = listed_net_price * 1.19
production_cost = quantity * material-specific tiered unit cost from Section 6.1
weight_kg = quantity * 3 g / 1000
payment_cost = gross_reference_price * 0.04
reprint_fire_buffer = gross_reference_price * 0.02
first_order_contribution =
  listed_net_price
  - production_cost
  - shipping_cost
  - payment_cost
  - handling_cost
  - reprint_fire_buffer
  - acquisition_cost
reorder_contribution =
  listed_net_price
  - production_cost
  - shipping_cost
  - payment_cost
  - handling_cost
  - reprint_fire_buffer
  - reorder_crm_cost
```

### 12.1 Starter Package — 1,000 PP Labels

Assumptions:

| Item | Opaque PP | Transparent PP |
|---|---:|---:|
| Quantity | 1,000 | 1,000 |
| Unit production cost | €0.13 | €0.16 |
| Production cost | €130 | €160 |
| Unit weight | 3 g | 3 g |
| Total weight | 3 kg | 3 kg |
| Direct shipping | €10/kg | €10/kg |
| Shipping cost | €30 | €30 |
| Listed net price | €179 | €199 |
| Gross reference price (for payment fee estimate) | €213.01 | €236.81 |
| Payment estimate (4% of gross) | €8.52 | €9.47 |
| Handling | €3 | €3 |
| Fire/reprint buffer (2% of gross) | €4.26 | €4.74 |
| CAC | €30 | €30 |

Result:

| Metric | Opaque PP | Transparent PP |
|---|---:|---:|
| First-order contribution | -€26.78 | -€38.21 |
| Reorder contribution with €5 CRM cost | -€1.78 | -€13.21 |
| Business role | Acquisition / paid-trial tier only | Loss-leading unless supported by add-ons or better supplier quotes |

Decision:

```txt
Expected to be thin or negative on this high-side cost basis.
Use only as an acquisition tier, not as a profit engine.
```

---

### 12.2 Growth Package — 5,000 PP Labels

Direct shipping assumptions:

| Item | Opaque PP | Transparent PP |
|---|---:|---:|
| Quantity | 5,000 | 5,000 |
| Unit production cost | €0.06 | €0.08 |
| Production cost | €300 | €400 |
| Weight | 15 kg | 15 kg |
| Direct shipping cost | €150 | €150 |
| Listed net price | €479 | €519 |
| Gross reference price (for payment fee estimate) | €570.01 | €617.61 |
| Payment estimate (4% of gross) | €22.80 | €24.70 |
| Handling | €8 | €8 |
| Fire/reprint buffer (2% of gross) | €11.40 | €12.35 |
| Acquisition cost | €45 | €45 |

Result:

| Metric | Opaque PP | Transparent PP |
|---|---:|---:|
| First-order contribution | -€58.20 | -€121.05 |
| Reorder contribution with €5 CRM cost | -€18.20 | -€81.05 |
| Business role | Commercially weak with parcel shipping | Not viable with direct parcel shipping on this cost basis |

Decision:

```txt
Do not scale `5,000` direct-parcel orders under this cost model.
Margin only starts to recover when logistics are consolidated.
```

---

### 12.3 Pro Package — 10,000 PP Labels

Direct shipping assumptions:

| Item | Opaque PP | Transparent PP |
|---|---:|---:|
| Quantity | 10,000 | 10,000 |
| Unit production cost | €0.05 | €0.07 |
| Production cost | €500 | €700 |
| Weight | 30 kg | 30 kg |
| Direct shipping cost | €300 | €300 |
| Listed net price | €799 | €849 |
| Gross reference price (for payment fee estimate) | €950.81 | €1,010.31 |
| Payment estimate (4% of gross) | €38.03 | €40.41 |
| Handling | €12 | €12 |
| Fire/reprint buffer (2% of gross) | €19.02 | €20.21 |
| Acquisition cost | €60 | €60 |

Result:

| Metric | Opaque PP | Transparent PP |
|---|---:|---:|
| First-order contribution | -€130.05 | -€283.62 |
| Reorder contribution with €5 CRM cost | -€75.05 | -€228.62 |
| Business role | Not viable with direct parcel shipping | Not viable with direct parcel shipping |

Decision:

```txt
Large-format `10,000` direct parcel shipping is structurally unattractive on this model.
Use consolidated logistics or quote logic.
```

---

## 13. PP Label Economics — Partial Pallet / Consolidated Shipping

### 13.1 Growth Package — 5,000 PP Labels

Consolidated shipping assumptions:

| Item | Opaque PP | Transparent PP |
|---|---:|---:|
| Quantity | 5,000 | 5,000 |
| Unit production cost | €0.06 | €0.08 |
| Production cost | €300 | €400 |
| Weight | 15 kg | 15 kg |
| Pallet effective shipping | €2/kg | €2/kg |
| Shipping cost | €30 | €30 |
| Germany handling / distribution buffer | €25 | €25 |
| Listed net price | €479 | €519 |
| Gross reference price (for payment fee estimate) | €570.01 | €617.61 |
| Payment estimate (4% of gross) | €22.80 | €24.70 |
| Handling | €8 | €8 |
| Fire/reprint buffer (2% of gross) | €11.40 | €12.35 |
| Acquisition cost | €45 | €45 |

Result:

| Metric | Opaque PP | Transparent PP |
|---|---:|---:|
| First-order contribution | €36.80 | -€26.05 |
| Reorder contribution with €5 CRM cost | €76.80 | €13.95 |
| Business role | First profitable core tier | Borderline and only partly rescued by reorder |

Decision:

```txt
Profit starts to appear here for opaque PP once logistics are consolidated.
Transparent PP still needs better supplier quotes, paid add-ons, or quote handling.
```

---

### 13.2 Pro Package — 10,000 PP Labels

Consolidated shipping assumptions:

| Item | Opaque PP | Transparent PP |
|---|---:|---:|
| Quantity | 10,000 | 10,000 |
| Unit production cost | €0.05 | €0.07 |
| Production cost | €500 | €700 |
| Weight | 30 kg | 30 kg |
| Pallet effective shipping | €2/kg | €2/kg |
| Shipping cost | €60 | €60 |
| Germany handling / distribution buffer | €35 | €35 |
| Listed net price | €799 | €849 |
| Gross reference price (for payment fee estimate) | €950.81 | €1,010.31 |
| Payment estimate (4% of gross) | €38.03 | €40.41 |
| Handling | €12 | €12 |
| Fire/reprint buffer (2% of gross) | €19.02 | €20.21 |
| Acquisition cost | €60 | €60 |

Result:

| Metric | Opaque PP | Transparent PP |
|---|---:|---:|
| First-order contribution | €74.95 | -€78.62 |
| Reorder contribution with €5 CRM cost | €129.95 | -€23.62 |
| Business role | Best current fixed-tier contribution engine | Not viable on this high-side placeholder cost basis |

Decision:

```txt
Opaque `10,000` is the best current fixed-tier contribution engine.
Transparent `10,000` needs supplier-cost validation or quote logic before it can be treated as a scale package.
```

---

### 13.3 Business Package — 20,000 PP Labels

Consolidated shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 20,000 |
| Production cost | OPEN QUESTION |
| Weight | 60 kg |
| Pallet effective shipping | €2/kg |
| Shipping cost | €120 |
| Germany handling / distribution buffer | €50 |
| Target price | OPEN QUESTION |
| Payment estimate | OPEN QUESTION |
| Handling | €20 |
| Fire/reprint buffer | OPEN QUESTION |
| Acquisition cost | €80 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | OPEN QUESTION |
| Reorder contribution with €5 CRM cost | OPEN QUESTION |
| Business role | High-value B2B order |

Decision:

```txt
20,000+ is now quote-only in the canonical commercial model.
Without an approved fixed net package price, contribution cannot be derived mechanically here.
```

---

### 13.4 Reorder Ready Package — 2,000 PP Labels

Commercial pricing for the `2,000` package is locked in Section 14.1.

```txt
OPEN QUESTION:
No standalone handling-cost and acquisition-cost assumption is documented for the 2,000-unit package in the current contribution model.
Do not invent a contribution example until finance locks the cost profile for this tier.
```

---

## 14. Pricing Table for MVP

### 14.1 Canonical Customer-Facing Price Table

This is the single canonical commercial package and price table for PP labels.

Other docs may reference this table, but they should not restate competing customer-facing price tables.

| Product | Package | Quantity | Netto | Brutto (19% MwSt) | Status | Best for |
|---|---|---:|---:|---:|---|---|
| Opaque PP 100x200 | Starter | 1,000 | €179.00 | €213.01 | Final | Paid trial |
| Opaque PP 100x200 | Reorder Ready | 2,000 | €279.00 | €332.01 | Final | Micro-brand repeat path |
| Opaque PP 100x200 | Growth | 5,000 | €479.00 | €570.01 | Final | Main micro B2B |
| Opaque PP 100x200 | Pro | 10,000 | €799.00 | €950.81 | Final | Growing brand |
| Opaque PP 100x200 | Business | 20,000+ | Quote | Quote | Final | Repeat account |
| Transparent PP 100x200 | Starter | 1,000 | €199.00 | €236.81 | Final | Premium paid trial |
| Transparent PP 100x200 | Reorder Ready | 2,000 | €309.00 | €367.71 | Final | Premium micro-brand repeat path |
| Transparent PP 100x200 | Growth | 5,000 | €519.00 | €617.61 | Final | Premium main micro B2B |
| Transparent PP 100x200 | Pro | 10,000 | €849.00 | €1,010.31 | Final | Premium growing brand |
| Transparent PP 100x200 | Business | 20,000+ | Quote | Quote | Final | Premium repeat account |

Old-to-new approved ladder change:

| Product | Old net ladder | New net ladder |
|---|---|---|
| Opaque PP 100x200 | €149 / €229 / €399 / €699 | €179 / €279 / €479 / €799 |
| Transparent PP 100x200 | €169 / €254 / €429 / €749 | €199 / €309 / €519 / €849 |

All fixed prices above are all-in and include shipping to Germany.

### 14.2 Price Psychology

The Growth package must look like the obvious best value.

Example display:

| Package | Opaque net | Opaque unit price | Transparent net | Transparent unit price |
|---|---:|---:|---:|---:|
| 1,000 | €179 | €0.1790 / label | €199 | €0.1990 / label |
| 2,000 | €279 | €0.1395 / label | €309 | €0.1545 / label |
| 5,000 | €479 | €0.0958 / label | €519 | €0.1038 / label |
| 10,000 | €799 | €0.0799 / label | €849 | €0.0849 / label |

This pushes customers away from 1,000 and toward 2,000+ and 5,000+.

The pricing must not look overpriced on a naive one-off comparison, but it must still reflect the true value and area of a large `100×200 mm` custom PP label. Tiny-label headline prices from broad print shops are not comparable to this size/material package and must never be used as a like-for-like benchmark.

### 14.3 What Each Fixed Package Includes

Every fixed PP package is defined as:

- `100×200 mm (10×20 cm)` rectangular roll label
- `1 design / artwork per order`
- named PP material (`opaque` or `transparent`)
- permanent adhesive
- on roll
- full-colour `CMYK` digital print
- no setup / plate fee
- one finish: `gloss` or `matte`
- free standard data check
- one proof round
- shipping to Germany included
- reorder of the exact saved spec at the same package price

German value-bundle line:

```txt
Alle Pakete enthalten technische Druckdatenprüfung, Versand nach Deutschland und die Speicherung freigegebener Druckdaten für die 30-Sekunden-Nachbestellung.
```

### 14.4 What Is Not Included In Fixed Packages

The following must route to:

```txt
Individuelles B2B-Angebot anfordern
```

Excluded from the fixed price:

- transparent white underprint / opaque white ink on transparent material
- lamination / varnish
- foil / metallic effects
- variable data / Lot- and SKT-numbering
- contour / special-shape cut
- additional designs / SKUs
- express production or express shipping

Transparent white underprint is explicitly a paid add-on / quote item and is not included in the transparent base ladder.

**Self-serve add-ons & custom size (SoT #16, see §28–§29):** some of the above now have a self-serve path **when the respective feature flag is enabled** (otherwise they stay quote-only):

- **Designservice** €40 net (free for orders ≥ €2.000 net or if the customer uploads print-ready data), **physischer Andruck** €10 net, **Express** €9,90 net, **+€19 net per additional design** — selectable on the product page, **server-priced**, shown net + gross, behind `NEXT_PUBLIC_FEATURE_ADDONS` (default off).
- **Wunschformat (custom size)** — the area-based engine (`§29`; admin cost screen `18 §30A`) behind `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` (default off), with quote fallback above limits.

These attach **on top of** the fixed package and **do not change the fixed-package base spec or prices** in §14.3. White underprint, lamination, foil, variable data, contour cut and specialty materials remain quote-only.

### 14.5 Price-Factor Matrix

The final price level must always be interpreted through this factor matrix:

| Factor | Standard fixed-package assumption | Effect if changed |
|---|---|---|
| Quantity | 1,000 / 2,000 / 5,000 / 10,000 | higher or custom quantities change economics |
| Size | 100×200 mm rectangular | custom sizes via Wunschformat engine (§29) when enabled, else quote |
| Material | opaque PP / transparent PP | transparent premium; specialty materials quote |
| Shape | rectangle | special shapes quote |
| Cut type | standard rectangular | contour / special cut quote |
| Roll format | on roll | special winding/core requests can quote |
| Core | standard | custom core can quote |
| Winding | standard | non-standard winding can quote |
| Adhesive | permanent | special adhesive quote |
| Indoor/outdoor use | standard product-label use | tougher use cases may require upgrades |
| Water/oil resistance | standard PP suitability | heavier resistance requirements may affect material choice |
| Finish | one finish included: gloss or matte | extra finishing quote |
| Lamination | not included | quote |
| White ink | not included on transparent | paid add-on / quote |
| Foil / metallic | not included | quote |
| Color count | full-colour CMYK | specialty print effects quote |
| Print method | digital | flexo-style or other process changes quote |
| Variable data | not included | quote |
| Number of designs / SKUs | one design per order | +€19 net per extra design (self-serve add-on, §28, flag-gated) or quote |
| Artwork quality | standard-ready files | heavy correction can trigger quote |
| Proof / revisions | one proof round included | extra rounds can quote later |
| Delivery speed | standard lead time | Express €9,90 net (self-serve add-on, §28, flag-gated) or quote |
| Shipping method | shipping to Germany included | pallet / consolidated special cases quote |
| VAT / shipping inclusion | net + gross shown, Germany shipping included | must stay explicit in UI |
| File-check level | standard data check included | upgraded checks can quote later |
| Legal responsibility | customer responsible | no legal-compliance service included |

### 14.6 Competitive Positioning Rule

Labelpilot.de is not the cheapest option and must never claim to be.

The approved price raise to `€479 / €799` for opaque and `€519 / €849` for transparent places the core packages in a defendable middle band for a large `100×200 mm` custom PP label.

Positioning rules:

- defend price with size, clarity of scope, shipping-included logic, and reorder value
- do not benchmark our `100×200 mm` package against tiny-label `ab 0,01–0,02 €` headlines
- only compare like-for-like: same size, same material, same orientation, same inclusion scope
- if the comparison is not like-for-like, mark it non-comparable
- do not start a price war with broad online printers

---

## 15. Minimum Order Strategy

Recommended minimum order:

```txt
1,000 labels
```

But strategic minimum target:

```txt
5,000 labels
```

Rules:

1. Do not offer 100 or 250 units in MVP.
2. Do not chase very small hobby buyers.
3. Do not allow low AOV orders to dominate support.
4. Push sample box instead of tiny production orders.
5. Use 1,000 as trial, 5,000 as core.

---

## 16. Sample Box Pricing

Sample box is useful for trust-building in Germany.

Recommended sample box:

| Item | Value |
|---|---:|
| Price | €19–€29 |
| Refundable credit | Optional against first 5,000+ order |
| Includes | Opaque PP sample, transparent PP sample, thermal sample, material card |
| Purpose | Build trust and increase B2B conversion |

Sample box must not be free at scale.

Free samples attract bad leads.

Recommended rule:

```txt
Sample box fee can be credited against first Growth or Pro order.
```

---

## 17. Quote Request Rules

Quote flow must be used for:

1. 20,000+ labels
2. custom size
3. custom material
4. special adhesive
5. special finishing
6. white-ink-heavy transparent jobs
7. metallic / foil effects
8. multi-SKU orders or multiple artwork versions
9. variable data above 50 rows
10. express requests
11. pallet / consolidated delivery requests
12. Net-14 customers above credit limit
13. unclear artwork or heavy correction
14. repeat production agreements
15. monthly supply planning
16. Germany hub / pallet delivery customers

Quote request must collect:

- Company name
- VAT ID if available
- Contact name
- Email
- Phone
- Product category
- Material
- Size
- Quantity
- Number of artwork versions
- Upload file
- Target delivery date
- Notes

---

## 18. Acquisition Cost Targets

### 18.1 Small Orders

| Package | Maximum CAC |
|---|---:|
| 1,000 Starter | €35 |
| 5,000 Growth | €60 |
| 10,000 Pro | €80 |
| 20,000+ Business | €120 |

### 18.2 Reorders

| Reorder type | Target acquisition cost |
|---|---:|
| Email reminder reorder | €0–€2 |
| Manual sales follow-up reorder | €5–€15 |
| Account-managed reorder | €15–€30 |

The business only becomes attractive when reorders reduce CAC.

---

## 19. Reorder Economics

Reorder is the core profit engine.

Example:

| Package | First-order contribution | Reorder contribution |
|---|---:|---:|
| 1,000 Starter direct opaque | -€26.78 | -€1.78 |
| 1,000 Starter direct transparent | -€38.21 | -€13.21 |
| 5,000 Growth consolidated opaque | €36.80 | €76.80 |
| 5,000 Growth consolidated transparent | -€26.05 | €13.95 |
| 10,000 Pro consolidated opaque | €74.95 | €129.95 |
| 10,000 Pro consolidated transparent | -€78.62 | -€23.62 |
| 20,000 Business consolidated | OPEN QUESTION | OPEN QUESTION |

A customer who orders 5,000 labels three times per year:

```txt
First order contribution = €36.80
Two reorder contributions = 2 × €76.80 = €153.60
12-month contribution = €190.40
```

This is why the customer file, artwork, specifications and reorder flow are strategic assets.

---

## 20. Monthly Profit Target Model

### 20.1 €10,000 Monthly Contribution Scenario

Scenario basis:

```txt
opaque PP core mix only
consolidated logistics on 5,000 and 10,000 tiers
starter omitted because it is negative on this cost basis
transparent tiers excluded from the milestone model because the current placeholder cost basis does not produce a scalable positive contribution
```

| Package | Orders/month | Contribution/order | Monthly contribution |
|---|---:|---:|---:|
| Growth 5,000 opaque | 90 | €36.80 | €3,312.00 |
| Pro 10,000 opaque | 50 | €74.95 | €3,747.50 |
| Reorders 5,000 opaque | 40 | €76.80 | €3,072.00 |
| Total contribution |  |  | €10,131.50 |

After fixed overhead, this can support early profitability.

---

### 20.2 €100k Monthly Contribution Scenario

Target order composition using the current positive-contribution fixed tiers:

| Package | Orders/month | Contribution/order | Monthly contribution |
|---|---:|---:|---:|
| Growth 5,000 opaque | 500 | €36.80 | €18,400.00 |
| Pro 10,000 opaque | 400 | €74.95 | €29,980.00 |
| Reorder uplift 5,000 opaque | 675 | €76.80 | €51,840.00 |
| Business 20,000+ | OPEN QUESTION | OPEN QUESTION | OPEN QUESTION |
| Total contribution from derivable fixed tiers |  |  | €100,220.00 |

This is a contribution scenario, not a guaranteed net-profit scenario.

The derivable fixed-tier mix clears the `€100k/month contribution` milestone without relying on quote-only `20,000+` orders.

Indicative operating implication:

```txt
fixed overhead should stay below roughly €25,000-€30,000/month
```

This means:

- High repeat rate
- Lean team
- Strong automation
- Germany hub only after volume justifies it
- No bloated product catalog

---

## 21. 10-Year Pricing and Scale Logic

### Year 1

Focus:

- Validate price acceptance
- Sell 5,000-label Growth package
- Avoid low-AOV buyers

Target:

| Metric | Target |
|---|---:|
| AOV | €479+ |
| Monthly revenue | €10,000–€30,000 |
| Net profit | -€2,000 to +€5,000 |
| Repeat signal | Early |

### Year 2

Focus:

- B2B repeat customers
- Consolidated shipping
- Quote flow

Target:

| Metric | Target |
|---|---:|
| Monthly revenue | €40,000–€80,000 |
| Monthly net profit | €8,000–€18,000 |
| Repeat rate | 25%+ |

### Year 3

Focus:

- Germany hub pilot
- Weekly pallet flow
- B2B account sales

Target:

| Metric | Target |
|---|---:|
| Monthly revenue | €100,000–€160,000 |
| Monthly net profit | €20,000–€35,000 |
| Repeat rate | 35%+ |

### Interim Net Profit Target

Near- to mid-term net-profit framing should use the validated Year 2-3 range:

```txt
Year 2 monthly net profit target: €8,000-€18,000
Year 3 monthly net profit target: €20,000-€35,000
```

### Year 4+

Focus:

- Germany hub
- Account management
- Repeat production planning
- DACH expansion later

Target:

| Metric | Target |
|---|---:|
| Mid-term monthly contribution milestone | €100,000+ |
| Long-term monthly net profit (north-star) | €100,000+ |
| Main profit source | Repeat B2B orders |

---

## 22. Pricing Engine Requirements for Codex

The app must support:

1. Quantity-based pricing.
2. Material-based pricing.
3. Product-based base costs.
4. Weight-based shipping estimate.
5. Direct shipping vs consolidated shipping mode.
6. VAT logic separation.
7. Stripe checkout price creation.
8. Quote request instead of checkout for high quantity.
9. Admin-editable price values later.
10. Reorder price calculation.

Pricing logic must be centralized.

Do not duplicate price formulas in multiple components.

Recommended structure:

```txt
/src/config/pricing.ts
/src/lib/pricing/calculate-price.ts
/src/lib/pricing/calculate-margin.ts
/src/lib/shipping/calculate-shipping.ts
/src/lib/tax/calculate-tax.ts
```

---

## 23. Suggested Pricing Types

Suggested TypeScript types:

```ts
export type LabelMaterial = "OPAQUE_PP" | "TRANSPARENT_PP" | "THERMAL_ECO";

export type ProductType =
  | "PP_LABEL_100X200"
  | "THERMAL_LABEL_100X100"
  | "THERMAL_LABEL_100X150";

export type ShippingMode =
  | "DIRECT_PARCEL"
  | "CONSOLIDATED_PALLET"
  | "GERMANY_HUB";

export type CustomerType =
  | "B2C"
  | "B2B";

export type PriceCalculationInput = {
  productType: ProductType;
  material: LabelMaterial;
  quantity: number;
  customerType: CustomerType;
  shippingMode: ShippingMode;
  country: "DE";
  isReorder?: boolean;
};
```

---

## 24. Pricing Validation Rules

Codex must enforce:

1. Quantity must be at least 1,000 for PP labels.
2. 20,000+ quantity should trigger quote request by default.
3. Unsupported product sizes must not be selectable in MVP.
4. Thermal labels must not appear as primary hero product.
5. Price must never be below configured minimum contribution.
6. Admin must eventually be able to override quote prices.
7. Reorder should reuse previous specs but allow quantity change.

---

## 25. Kill Criteria

Do not scale paid traffic if:

| Metric | Kill level |
|---|---:|
| 90-day 5,000-label package sales | Under 10 orders |
| AOV | Under €250 |
| Growth package CAC | Over €60 consistently |
| Repeat rate after 6 months | Under 20% |
| Delivery complaints | Over 8% |
| Reprint/error rate | Over 2.5% |
| Most buyers only buy Starter | Bad signal |
| Consolidated shipping cannot be used | Margin risk |
| B2B quote requests do not convert | Market/offer risk |

---

## 26. Non-Negotiable Pricing Rules

1. PP labels are the main product.
2. Thermal labels are cross-sell.
3. The Growth 5,000 package is the main commercial offer.
4. The Pro 10,000 package is the scale offer.
5. Starter 1,000 is only an entry offer.
6. 20,000+ must be quote-based.
7. Reorders must have better margin than first orders.
8. Direct shipping must not dominate large B2B orders.
9. Do not add low-margin print products.
10. Do not optimize for hobby buyers.
11. Do not compete only on price.
12. Protect margin for support, reprints, Stripe and sales cost.

---

## 27. Final Verdict

The pricing model is viable only if Labelpilot.de becomes a B2B-first repeat-order label platform.

The model is weak if the business sells mostly 1,000-label one-time orders with direct parcel shipping.

The model becomes strong when:

1. Main orders are 5,000+ labels.
2. Shipping is consolidated.
3. Customers reorder.
4. Acquisition cost drops after first order.
5. Germany hub is opened only after volume justifies it.

The commercial priority is clear:

```txt
Sell 5,000 and 10,000 unit PP label packages to German food, beverage and supplement brands.
Then convert them into repeat customers.
```

---

## 28. Option / Add-on Pricing Depth — APPROVED 2026-06-03 (founder)

> **Status: APPROVED by founder 2026-06-03** (recorded as SoT decision #16). Extends §14 (which previously routed most depth to "quote"). Converts a small set of high-margin depth items from "quote" into **self-serve, on-page priced add-ons** while the core stays one simple package. **§14 included-scope table, SoT #15 and doc 30 are to be updated to match when the build lands.** Live prices/behaviour change only when built.
> **Market evidence (captured from competitor sites — see `59` §27/§28):** Gestaltungsservice **€45,83**; Qualitätskontrolle / Probedruck **€14,00**; machine setup **€14,90**; priority/express **€6,50**; **personalization (variable data) FREE**; **data check FREE** (WMD / etiketten-drucken). Labelprint24: professional artwork check **€15**, printed proof **free**, barcode verification **€25**, charges **per artwork version**.

### 28.1 Recommended self-serve add-ons (priced, on-page)

| Add-on | Proposed Labelpilot price (net) | Market ref | Rationale |
|---|---|---|---|
| **Designservice (Gestaltung)** | **€40 flat · €0 for orders ≥ €2.000 net · €0 if customer uploads print-ready data** | €45,83 | margin + removes friction on big orders + upsell nudge to €2.000; sits below market |
| **Physischer Andruck (printed proof)** | **€10** — *one digital proof stays FREE* | €14,00 (WMD) / free (LP24) | keep free digital proof as differentiator; charge only for a physical printed proof |
| **Express / Priorität** | **+€9,90** (quote at high volume) | €6,50 (WMD) / 48h (LP24) | margin; standard lead time stays free |
| **Zusätzliche Designs/Versionen pro Rolle** | **+€19 per extra design** (1 included) | LP24 per artwork version | covers extra setup; multi-SKU upsell |
| **Matt-Finish (statt Standard-Glanz)** | **start as quote → then per-tier surcharge ≈ +15–20%** | LP24 matt = +65% over gloss on the raw label | matt genuinely costs more; never give away |
| **Datencheck (Standard)** | **€0 (included)** | FREE norm | keep as our promise |
| **Eine digitale Proof-Runde** | **€0 (included)** | — | differentiator vs paid-proof competitors |
| **Nachbestellung — Neueinrichtung** | **€0 (no re-setup / no re-design fee on reorder)** | competitors re-charge setup+design each time | the reorder moat, made explicit and priced at zero |

### 28.2 Keep QUOTE-only (do not self-serve yet)
white-ink-heavy transparent, lamination / soft-touch, foil / metallic, removable / freezer-safe / special adhesives, custom size, contour/freeform die-cut with new tool, variable-data **workflow** (Excel validation + Lot/SKT automation + batch review), multi-SKU sets, 20.000+, pallet / express-heavy. (Per §14 + doc 30.)

### 28.3 Margin + differentiation logic
- Design / physical-proof / express / extra-version are currently **unpriced** in our model → pure margin upside; the market proves buyers pay for them.
- Differentiator = **free standard data check + one free digital proof + €0 reorder re-setup** (competitors charge setup + design on every order) → our reorder is structurally cheaper for the customer.
- Variable-data **print** is free at competitors → do NOT charge for basic numbering/barcode/QR; charge for the **workflow/automation** (supplement wedge, docs 03/72).

### 28.4 Founder decision
Approve the §28.1 numbers (esp. Designservice €40 / free ≥ €2.000 / free own-data, and physical proof €10) → then update §14 included-scope table, SoT #15, and doc 30. Full dimension gap-analysis + same-page UX + roadmap live in `59` §28.

---

## 29. Custom-size area pricing engine (digital vs flexo, plate-aware) — APPROVED 2026-06-03 (founder); build phased

> **Status: APPROVED by founder 2026-06-03** (SoT decision #16); **build is phased.** Enables a self-serve **"enter your size → get a price"** path (previously quote-only per docs 07/30). Extends §22. **No live behaviour until built AND real cost params are entered by the operator.** The admin cost-input screen spec lives in `18-ADMIN-PANEL.md` §30A. The fixed 100×200 packages remain the default path and keep their no-plate/no-setup spec (SoT #15 unchanged for fixed packages; the flexo plate cost applies only to the optional custom-size engine).

### 29.1 Principle
Price every custom job from **area (m²)** and let the engine pick the **cheaper print method automatically**:
- **Digital:** per-area running cost, **no plate** → cheapest at low quantity / small area.
- **Flexo:** lower per-area running cost **plus a fixed plate (Kalıp/Cliché) cost** → cheapest at high quantity / large area, once the plate amortizes.

The customer always gets the **lower** of the two; we keep target margin. The chosen method is **internal** (never shown to the customer).

### 29.2 Admin-set cost parameters (per material; entered in admin §30A)
`material_cost_per_m2` · `digital_print_cost_per_m2` · `flexo_print_cost_per_m2` · `flexo_plate_cost` (fixed per job; optional × number of colours) · `waste_factor_%` · `target_margin` · `min_order_value` · optional `setup_fee`. Global: VAT 19 %, shipping rule, price-rounding step.

### 29.3 Formula
```txt
label_area_m2  = (width_mm * height_mm) / 1_000_000
total_area_m2  = label_area_m2 * quantity * (1 + waste_factor)

material_cost  = material_cost_per_m2 * total_area_m2
digital_cost   = material_cost + digital_print_cost_per_m2 * total_area_m2              // NO plate
flexo_cost     = material_cost + flexo_print_cost_per_m2  * total_area_m2 + flexo_plate_cost

production_cost = min(digital_cost, flexo_cost)        // method = argmin (internal only)
sell_net        = production_cost / (1 - target_margin_pct)
sell_net        = max(sell_net, min_order_value)       // floor
sell_net        = round_to_step(sell_net)
sell_gross      = sell_net * 1.19                      // DE; shipping included (or + weight rule)
```
**Crossover is automatic:** the engine computes both digital and flexo every time and picks the lower, so the digital→flexo break-even quantity needs no hard-coded threshold — it falls out of the plate-cost amortization.

### 29.4 Guardrails
- Real cost params must be entered by the operator before go-live (replaces the placeholder ladder in §6; ties to the open supplier-quote action).
- Cost params are **never** exposed to the customer — only the computed net + gross sell price + lead time.
- Above defined limits (size / quantity / colours / special material / finish / foil / white-ink-heavy) → fall back to **"Individuelles B2B-Angebot"** (§17 / §25).
- Output matches standard UI: net + gross, "Versand nach Deutschland inklusive", Druckdatenprüfung + 1 digitaler Proof inklusive.
- Engine **centralized** (§22); reorder reuses the same engine at **€0 re-setup** (no flexo plate re-charge if the same plate is stored).

### 29.5 Founder decision
Approve the model → (a) build admin §30A cost-input screen, (b) implement the engine in the centralized pricing module (§22), (c) gate it behind real cost params + the quote-fallback limits. The fixed 100×200 packages stay the simple default path; this engine powers the optional custom-size path.

### 29.6 Build note — customer surface added 2026-06-03
- The public route `/de/wunschformat` and the public POST endpoint `/api/custom-size/price` are now implemented as a feature-gated customer surface on top of the approved custom-size engine.
- Default remains OFF via `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE`; when OFF the page and endpoint return 404 and no public navigation link is rendered.
- The customer response remains sanitized to `configured`, `quoteRequired`, `netPrice`, and `grossPrice`; internal cost inputs, method selection, and breakdown values stay server-only.
