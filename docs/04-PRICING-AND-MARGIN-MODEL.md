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

## 6. Known Production Costs

Current known production costs:

| Product | Size | Production cost |
|---|---:|---:|
| Eco thermal roll label | 100×100 mm | €0.012 / unit |
| Opaque PP printed label | 100×200 mm | €0.020 / unit |
| Transparent PP printed label | 100×200 mm | €0.020 / unit initially |

Transparent PP may cost more in reality.

Until exact supplier quote is confirmed, use the same estimate but keep material-level override possible.

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

Important:

```txt
Sections 12, 13 and 20 contain directional contribution examples built on an earlier package ladder.
The authoritative commercial package prices are Section 14.1.
These contribution examples must be recalculated before finance-signoff or paid acquisition launch.
```

### 12.1 Starter Package — 1,000 PP Labels

Assumptions:

| Item | Value |
|---|---:|
| Quantity | 1,000 |
| Unit production cost | €0.020 |
| Production cost | €20 |
| Unit weight | 3 g |
| Total weight | 3 kg |
| Direct shipping | €10/kg |
| Shipping cost | €30 |
| Gross B2C price | €149 |
| Net revenue after 19% VAT | €125.21 |
| Payment estimate | €6 |
| Handling | €3 |
| Fire/reprint buffer | €3 |
| CAC | €30 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €33.21 |
| Reorder contribution with €5 CRM cost | €58.21 |
| Business role | Entry product / paid trial |

Decision:

```txt
Allowed, but not the main profit engine.
```

---

### 12.2 Growth Package — 5,000 PP Labels

Direct shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 5,000 |
| Production cost | €100 |
| Weight | 15 kg |
| Direct shipping cost | €150 |
| B2B price | €399 |
| Payment estimate | €16 |
| Handling | €8 |
| Fire/reprint buffer | €8 |
| Acquisition cost | €45 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €72 |
| Reorder contribution with €5 CRM cost | €112 |
| Business role | Acceptable but not ideal with direct shipping |

Decision:

```txt
Good only if shipping is not too slow and CAC stays controlled.
Better with consolidated logistics.
```

---

### 12.3 Pro Package — 10,000 PP Labels

Direct shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 10,000 |
| Production cost | €200 |
| Weight | 30 kg |
| Direct shipping cost | €300 |
| B2B price | €699 |
| Payment estimate | €28 |
| Handling | €12 |
| Fire/reprint buffer | €14 |
| Acquisition cost | €60 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €85 |
| Reorder contribution with €5 CRM cost | €140 |
| Business role | Weak if direct parcel shipping is used |

Decision:

```txt
Do not scale 10,000+ direct-shipped orders unless customer pays shipping or price increases.
Use consolidated logistics.
```

---

## 13. PP Label Economics — Partial Pallet / Consolidated Shipping

### 13.1 Growth Package — 5,000 PP Labels

Consolidated shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 5,000 |
| Production cost | €100 |
| Weight | 15 kg |
| Pallet effective shipping | €2/kg |
| Shipping cost | €30 |
| Germany handling / distribution buffer | €25 |
| Price | €399 |
| Payment estimate | €16 |
| Handling | €8 |
| Fire/reprint buffer | €8 |
| Acquisition cost | €45 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €167 |
| Reorder contribution with €5 CRM cost | €207 |
| Business role | Main product |

Decision:

```txt
This is the core package.
```

---

### 13.2 Pro Package — 10,000 PP Labels

Consolidated shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 10,000 |
| Production cost | €200 |
| Weight | 30 kg |
| Pallet effective shipping | €2/kg |
| Shipping cost | €60 |
| Germany handling / distribution buffer | €35 |
| Price | €699 |
| Payment estimate | €28 |
| Handling | €12 |
| Fire/reprint buffer | €14 |
| Acquisition cost | €60 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €290 |
| Reorder contribution with €5 CRM cost | €345 |
| Business role | Scale product |

Decision:

```txt
This is the best scalable package.
```

---

### 13.3 Business Package — 20,000 PP Labels

Consolidated shipping assumptions:

| Item | Value |
|---|---:|
| Quantity | 20,000 |
| Production cost | €400 |
| Weight | 60 kg |
| Pallet effective shipping | €2/kg |
| Shipping cost | €120 |
| Germany handling / distribution buffer | €50 |
| Target price | €1,199 |
| Payment estimate | €48 |
| Handling | €20 |
| Fire/reprint buffer | €24 |
| Acquisition cost | €80 |

Result:

| Metric | Value |
|---|---:|
| First-order contribution | €457 |
| Reorder contribution with €5 CRM cost | €532 |
| Business role | High-value B2B order |

Decision:

```txt
Offer as quote or business package after operational confidence.
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

### 14.5 Price-Factor Matrix

The final price level must always be interpreted through this factor matrix:

| Factor | Standard fixed-package assumption | Effect if changed |
|---|---|---|
| Quantity | 1,000 / 2,000 / 5,000 / 10,000 | higher or custom quantities change economics |
| Size | 100×200 mm rectangular | custom sizes move to quote |
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
| Number of designs / SKUs | one design per order | extra SKUs quote |
| Artwork quality | standard-ready files | heavy correction can trigger quote |
| Proof / revisions | one proof round included | extra rounds can quote later |
| Delivery speed | standard lead time | express quote |
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

| Package | First-order profit | Reorder profit |
|---|---:|---:|
| 1,000 Starter | €33 | €58 |
| 5,000 Growth consolidated | €167 | €207 |
| 10,000 Pro consolidated | €290 | €345 |
| 20,000 Business consolidated | €457 | €532 |

A customer who orders 5,000 labels three times per year:

```txt
First order profit = €167
Two reorder profit = 2 × €207 = €414
12-month contribution = €581
```

This is why the customer file, artwork, specifications and reorder flow are strategic assets.

---

## 20. Monthly Profit Target Model

### 20.1 €10,000 Monthly Contribution Scenario

| Package | Orders/month | Profit/order | Monthly contribution |
|---|---:|---:|---:|
| Starter | 40 | €33 | €1,320 |
| Growth | 35 | €167 | €5,845 |
| Pro | 10 | €290 | €2,900 |
| Reorders | 10 | €207 | €2,070 |
| Total contribution |  |  | €12,135 |

After fixed overhead, this can support early profitability.

---

### 20.2 €100k Monthly Contribution Scenario

Target order composition:

| Package | Orders/month | Profit/order | Monthly contribution |
|---|---:|---:|---:|
| Starter | 300 | €33 | €9,900 |
| Growth | 250 | €167 | €41,750 |
| Pro | 120 | €290 | €34,800 |
| Business | 25 | €457 | €11,425 |
| Reorder uplift | 150 | €207 average | €31,050 |
| Gross contribution |  |  | €128,925 |

This is a contribution scenario, not a guaranteed net-profit scenario.

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
