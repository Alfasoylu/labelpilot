# 03-PRODUCT-STRATEGY.md

# Product Strategy — Labelpilot.de

## 1. Document Purpose

This document defines the product strategy for **Labelpilot.de**.

It is the source of truth for:

- Which products will be sold
- Which products will not be sold
- Which products are core profit drivers
- Which products are cross-sell products
- Which product packages will be used in the MVP
- How product pages should be structured
- How product logic should support B2B repeat orders
- How Codex should implement product-related features

Codex must read this file before implementing product catalog, product pages, pricing logic, quote flow, checkout flow, reorder flow, SEO landing pages, or admin product management.

---

## 2. Project Identity

Project name:

**Labelpilot.de**

Primary domain:

**labelpilot.de**

Business type:

**Germany-focused B2B-first label ordering and reorder platform**

Core offer:

> Custom PP product labels and thermal logistics labels for German food, beverage, and supplement brands — produced efficiently in Turkey, stored for easy reorder, and shipped to Germany.

Labelpilot.de must not be built as a generic online print shop.

Labelpilot.de must be built as:

> A specialized label supply and reorder system for German micro and small product brands.

---

## 3. Product Strategy Verdict

## Hüküm: YAP

The product strategy is valid if the business stays focused on:

1. **100×200 mm PP product labels** as the main product.
2. **5,000+ label orders** as the primary commercial target.
3. **German food, beverage and supplement brands** as the first customer segment.
4. **Saved artwork + one-click reorder** as the retention engine.
5. **Thermal labels** as cross-sell, not the main product.
6. **B2B quote flow** as a core feature.

The strategy becomes weak if Labelpilot.de becomes a generic print shop.

---

## 4. Product Hierarchy

Labelpilot.de has three product layers.

| Layer | Product Type | Strategic Role |
|---|---|---|
| Core product | 100×200 mm PP product labels | Main profit engine |
| Cross-sell product | Thermal logistics labels | AOV and retention booster |
| Service layer | Artwork storage, proofing, reorder | Competitive moat |

The service layer is as important as the physical product.

The goal is not only to sell labels.

The goal is to own the customer's recurring label supply workflow.

---

## 5. Core Product: 100×200 mm PP Product Labels

### 5.1 Product Definition

The core product is:

**Custom printed 100×200 mm PP roll labels**

Available material variants:

1. Opaque PP
2. Transparent PP

This product is used for product packaging.

Target packaging types:

- Bottles
- Jars
- Pouches
- Boxes
- Supplement containers
- Beverage bottles
- Food packaging
- Coffee bags
- Spice jars
- Honey jars
- Jam jars

---

### 5.2 Why This Is The Main Product

100×200 mm PP labels are the best initial product because:

1. They have a recurring use case.
2. They are consumed by business customers.
3. They are tied to product sales volume.
4. They have higher perceived value than logistics labels.
5. They support niche SEO pages.
6. They create repeat orders.
7. The artwork can be stored for reorders.
8. The customer has switching friction after the first approved order.
9. They are suitable for food, beverage and supplement brands.
10. They can justify larger B2B orders.

---

### 5.3 Initial Production Cost Assumption

Known working production cost:

| Product | Size | Cost |
|---|---:|---:|
| Opaque PP printed label | 100×200 mm | €0.020 / unit |
| Transparent PP printed label | 100×200 mm | Use €0.020 / unit until supplier quote is updated |

This cost includes print.

This cost must be treated as a working assumption until verified by supplier invoices and real production tests.

---

### 5.4 Target Quantities

The product strategy must push customers toward 5,000+ label orders.

| Package | Quantity | Strategic Role |
|---|---:|---|
| Starter | 1,000 labels | Paid trial / acquisition product |
| Growth | 5,000 labels | Main product |
| Pro | 10,000 labels | Scale product |
| Business | 20,000+ labels | Quote-based B2B product |

The 1,000-label package must not become the main business.

If most customers only buy 1,000 labels and do not reorder, the business model is weak.

---

## 6. Core Product Packages

### 6.1 Starter PP Label Pack

| Field | Value |
|---|---|
| Product | 100×200 mm PP label |
| Quantity | 1,000 units |
| Material | Opaque PP or transparent PP |
| Target customer | First-time buyer, small trial customer |
| Strategic purpose | Paid sample / customer acquisition |
| Pricing type | Fixed price |
| Reorder eligible | Yes |
| Main business driver | No |

This package exists to reduce first-purchase friction.

It is not the main profit engine.

---

### 6.2 Growth PP Label Pack

| Field | Value |
|---|---|
| Product | 100×200 mm PP label |
| Quantity | 5,000 units |
| Material | Opaque PP or transparent PP |
| Target customer | Micro and small product brands |
| Strategic purpose | Main B2B product |
| Pricing type | Fixed price or dynamic price |
| Reorder eligible | Yes |
| Main business driver | Yes |

This is the most important MVP product.

Product pages and conversion copy should push customers toward this package.

---

### 6.3 Pro PP Label Pack

| Field | Value |
|---|---|
| Product | 100×200 mm PP label |
| Quantity | 10,000 units |
| Material | Opaque PP or transparent PP |
| Target customer | Higher-volume micro brands and small manufacturers |
| Strategic purpose | High-margin repeat product |
| Pricing type | Fixed price or quote-assisted checkout |
| Reorder eligible | Yes |
| Main business driver | Yes |

This package is important for scaling toward the 10-year profit goal.

---

### 6.4 Business Quote Pack

| Field | Value |
|---|---|
| Product | 100×200 mm PP label |
| Quantity | 20,000+ units |
| Material | Opaque PP or transparent PP |
| Target customer | Serious B2B buyer |
| Strategic purpose | High-ticket B2B sales |
| Pricing type | Quote request |
| Reorder eligible | Yes |
| Main business driver | Yes, after MVP validation |

Customers ordering 20,000+ labels should be routed to quote request if fixed pricing becomes risky.

---

## 7. Cross-Sell Product: Thermal Labels

### 7.1 Product Definition

Thermal labels are logistics and fulfillment products.

Available products:

1. 100×100 mm eco thermal roll labels
2. 100×150 mm thermal shipping labels

These are not the main product.

They are cross-sell products for customers who also need product labels.

---

### 7.2 Known Production Cost Assumption

| Product | Size | Cost |
|---|---:|---:|
| Eco thermal roll label | 100×100 mm | €0.012 / unit |
| Thermal shipping label | 100×150 mm | To be confirmed |

100×150 mm cost must be confirmed before final pricing.

Until confirmed, Codex should not hardcode final margin assumptions for 100×150 thermal labels.

---

### 7.3 Thermal Label Role

Thermal labels are used to:

1. Increase average order value.
2. Support B2B warehouse and shipping needs.
3. Retain customers who ship products regularly.
4. Create reorder behavior.
5. Bundle with PP product labels.

Thermal labels must not distract from the core PP label offer.

---

### 7.4 Thermal Label Packages

| Package | Quantity | Product | Role |
|---|---:|---|---|
| Thermal Starter | 1,000 | 100×100 or 100×150 | Cross-sell |
| Thermal Growth | 5,000 | 100×100 or 100×150 | B2B cross-sell |
| Thermal Business | 10,000+ | 100×100 or 100×150 | Quote-based reorder |

Thermal products can be shown as:

- Checkout upsell
- Product page cross-sell
- Customer portal reorder item
- Bundle component

---

## 8. MVP Product Scope

The MVP must include only these product families:

1. Opaque PP Product Labels
2. Transparent PP Product Labels
3. Thermal Shipping Labels
4. Sample Box
5. Quote Request
6. Reorder Previous Labels

No other product family is allowed in MVP unless approved in documentation.

---

## 9. Products Excluded From MVP

Do not build these categories in MVP:

- Business cards
- Flyers
- Brochures
- Posters
- Catalogs
- Invitations
- General stickers
- Wall decals
- Textile hangtags
- Generic thank-you cards
- Product boxes
- Paper bags
- General packaging products
- Custom notebooks
- Planners
- Magnets
- Consumer gifts

Reason:

These products create low focus, low margin, weak repeat behavior, SEO dilution, and operational complexity.

Labelpilot.de must win one narrow market first.

---

## 10. Target Use-Case Segments

### 10.1 Primary Use Cases

The first product pages and SEO pages must focus on:

1. Food Labels
2. Supplement Labels
3. Beverage Labels
4. Coffee Labels
5. Spice Labels
6. Honey Labels
7. Jam Labels
8. Transparent PP Labels
9. Opaque PP Roll Labels
10. 100×200 mm Product Labels

---

### 10.2 Segment Priority

| Priority | Segment | Reason |
|---:|---|---|
| 1 | Supplement brands | Higher label value, recurring SKU needs, serious B2B buyers |
| 2 | Food micro producers | Large market, recurring packaging needs |
| 3 | Beverage brands | Strong visual label need, bottle use case |
| 4 | Coffee and tea brands | Repeat packaging, seasonal products |
| 5 | Spice brands | Many SKUs, repeat label need |
| 6 | Honey and jam producers | Clear use case, but may be more seasonal |

Initial MVP should not target too many segments at once.

The first three landing pages should be:

1. Supplement Labels Germany
2. Food Labels Germany
3. Transparent PP Labels Germany

---

## 11. Product Page Requirements

Each product page must include:

1. Clear product name
2. Size
3. Material
4. Quantity options
5. Price
6. Upload artwork option
7. Quote request option for large quantities
8. Use-case explanation
9. Delivery estimate
10. Reorder explanation
11. File requirements
12. FAQ
13. Trust signals
14. Stripe checkout CTA
15. Quote request CTA
16. Sample box CTA if available

Product pages must be written for German B2B customers.

Customer-facing language should be German by default.

---

## 12. Product Naming Rules

Product names must be simple and SEO-friendly.

Preferred English internal names:

- Opaque PP Product Labels
- Transparent PP Product Labels
- 100×200 mm Roll Labels
- Supplement Labels
- Food Labels
- Beverage Labels
- Thermal Shipping Labels

Preferred German customer-facing names:

- PP Produktetiketten
- Transparente PP Etiketten
- 100×200 mm Rollenetiketten
- Supplement Etiketten
- Lebensmittel Etiketten
- Getränke Etiketten
- Thermo Versandetiketten

Do not use unclear creative names for product categories.

Labelpilot.de can be a brand name, but product names must describe the product clearly.

---

## 13. Product URL Strategy

Final URL structure will be defined in SEO docs, but initial product URLs should follow this logic:

```txt
/de/pp-produktetiketten
/de/transparente-pp-etiketten
/de/100x200-rollenetiketten
/de/supplement-etiketten
/de/lebensmittel-etiketten
/de/getraenke-etiketten
/de/thermo-versandetiketten
/de/musterbox
/de/angebot-anfordern
/de/nachbestellen
```

Rules:

1. Use German URLs for German SEO.
2. Keep URLs short.
3. Avoid unnecessary category depth.
4. Use canonical URLs.
5. Do not create duplicate pages with same intent.

---

## 14. Product Configurator Requirements

The MVP product configurator should be simple.

Required fields:

1. Product type
2. Material
3. Size
4. Quantity
5. Artwork upload
6. Customer notes
7. Company details
8. Delivery country
9. Checkout or quote request

Do not overbuild with too many finishing options in MVP.

Allowed MVP options:

| Option | MVP Status |
|---|---|
| Opaque PP | Required |
| Transparent PP | Required |
| 100×200 mm | Required |
| 1,000 quantity | Required |
| 5,000 quantity | Required |
| 10,000 quantity | Required |
| 20,000+ quote | Required |
| Artwork upload | Required |
| Proofing | Required |
| Matte/gloss finish | Later |
| Custom die-cut shapes | Later |
| Waterproof claims | Later, only if verified |
| Food-safe adhesive claims | Later, only if verified |

Do not make unverified technical claims.

---

## 15. File Upload Requirements Per Product

Each PP label order must collect:

1. Artwork file
2. Label orientation if needed
3. Customer notes
4. Desired quantity
5. Material selection
6. Company name
7. Product use case
8. Optional reorder note

Supported file types:

- PDF
- AI
- EPS
- SVG
- PNG
- JPG
- ZIP

File validation requirements will be defined in `/docs/17-FILE-UPLOAD-AND-PROOFING.md`.

---

## 16. Proofing Strategy

Proofing is required for trust and error reduction.

For MVP:

- Admin reviews file manually.
- Admin can approve file.
- Admin can request correction.
- Admin can upload proof.
- Customer can approve proof.
- Production starts only after payment and file/proof approval.

Do not automate proof approval before the workflow is validated manually.

---

## 17. Reorder Strategy

Reorder is core to the product strategy.

Every order should store:

1. Product type
2. Material
3. Size
4. Quantity
5. Artwork file reference
6. Proof file reference
7. Customer approval status
8. Production notes
9. Previous price
10. Reorder eligibility

Customer must be able to reorder from:

- Customer portal
- Order detail page
- Reorder email link later
- Admin-created quote later

Reorder CTA examples:

- “Gleiche Etiketten nachbestellen”
- “Mit derselben Druckdatei erneut bestellen”
- “Menge ändern und nachbestellen”

Reorder must allow quantity change.

Reorder must preserve original artwork and specifications.

---

## 18. Sample Box Strategy

The sample box exists to reduce buyer hesitation.

Sample box should include examples of:

1. Opaque PP label
2. Transparent PP label
3. 100×200 mm product label
4. Thermal shipping label
5. Print quality sample
6. Material comparison card

Sample box goals:

- Build trust
- Show Turkey production quality
- Support B2B conversion
- Create sales follow-up

Sample box should collect business email and company name.

Sample box may be paid or free with qualification.

Initial recommendation:

- Paid sample box for self-serve buyers
- Free sample box only for qualified B2B leads

---

## 19. Bundle Strategy

Initial bundles:

### 19.1 Food Brand Starter Bundle

Includes:

- 5,000 PP product labels
- 1,000 thermal shipping labels
- Artwork storage
- Reorder-ready setup

### 19.2 Supplement Brand Label Bundle

Includes:

- 5,000 or 10,000 PP product labels
- Optional transparent PP variant
- Reorder setup
- Quote support for multiple SKUs

### 19.3 Shipping Label Cross-Sell Bundle

Includes:

- 1,000 thermal shipping labels
- Added during checkout
- Positioned as logistics add-on

Bundles must not make the catalog complicated.

Use bundles only if they increase AOV without increasing support load.

---

## 20. Pricing Strategy Direction

Pricing details are defined in `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

Product strategy rules:

1. Push 5,000-label package.
2. Use 1,000-label package as entry product.
3. Make 10,000-label package visibly better value.
4. Route 20,000+ quantities to quote.
5. Use thermal labels as cross-sell.
6. Do not compete only on price.
7. Show savings from reorder and larger quantities.
8. Preserve margin for CAC, support, reprint, logistics and payment fees.

---

## 21. B2B vs B2C Product Logic

Labelpilot.de can accept B2C-style checkout, but the business model is B2B-first.

### B2C-like customer

- Buys 1,000 labels
- Uses Stripe Checkout
- May not reorder
- Higher CAC risk
- Lower value

### B2B customer

- Buys 5,000+ labels
- Requests quote or uses checkout
- Has recurring label need
- Has multiple SKUs
- Can become reorder customer
- Higher LTV

Product pages must be optimized for B2B behavior.

Do not build consumer gift-style product flows.

---

## 22. Product Data Model Requirements

The product system should support at least:

```txt
Product
- id
- slug
- name
- customerFacingName
- description
- productFamily
- material
- defaultSize
- active
- seoTitle
- seoDescription
- schemaType

ProductVariant
- id
- productId
- size
- material
- quantity
- price
- productionCostPerUnit
- estimatedWeightKg
- active
- requiresQuote

OrderItem
- id
- orderId
- productId
- variantId
- quantity
- material
- size
- artworkFileId
- proofFileId
- reorderSourceOrderItemId
```

Final schema will be defined in `/docs/12-DATABASE-SCHEMA.md`.

---

## 23. Admin Product Requirements

Admin should be able to:

1. View products.
2. View variants.
3. Enable/disable product variants.
4. Update prices later.
5. See cost assumptions.
6. See estimated margin later.
7. View orders by product.
8. View reorder frequency by product later.

MVP can start with static product configuration if admin editing delays launch.

However, business constants must not be scattered randomly across code.

Use a central product configuration file if database product management is not built in Phase 1.

---

## 24. SEO Product Strategy

Every product must support SEO.

Required SEO product clusters:

1. `Supplement Etiketten`
2. `Lebensmittel Etiketten`
3. `Getränke Etiketten`
4. `Transparente PP Etiketten`
5. `PP Rollenetiketten`
6. `100×200 mm Etiketten`
7. `Thermo Versandetiketten`

Each cluster should include:

- Landing page
- Product CTA
- FAQ
- Use-case copy
- Internal links
- Schema markup
- Quote CTA
- Reorder CTA where relevant

---

## 25. GEO Product Strategy

Product pages must help AI systems understand exactly what Labelpilot.de sells.

Each product page should answer:

1. What is the product?
2. Who is it for?
3. What material is used?
4. What size is available?
5. What quantities are available?
6. Where is it produced?
7. Where is it shipped?
8. How does reorder work?
9. Is it suitable for food/supplement packaging?
10. Who is responsible for regulatory label text?

Use direct answer blocks.

Use comparison tables.

Use FAQs.

Avoid vague marketing language.

---

## 26. Regulatory Position Per Product

Labelpilot.de does not create legal label content.

For food, beverage and supplement labels:

- Customer provides ingredient text.
- Customer provides nutrition facts.
- Customer provides supplement facts.
- Customer provides allergen information.
- Customer provides warnings.
- Customer provides batch and expiry information.
- Customer is responsible for compliance.

Labelpilot.de provides:

- Print production
- File handling
- Layout support
- Proofing workflow
- Reorder storage

Required product page disclaimer:

> Regulatory label content and compliance are the responsibility of the customer. Labelpilot.de provides printing, file handling and layout support only.

---

## 27. Quality Requirements

The product strategy requires quality trust.

Each order must be checked for:

1. Correct size
2. Correct material
3. Correct file upload
4. Print readability
5. Basic file quality
6. Proof approval status
7. Quantity
8. Production notes

Defect target:

| Metric | Target |
|---|---:|
| Reprint/error rate | Under 2.5% |
| Delivery complaint rate | Under 5% |
| File correction loop | Minimized |
| Wrong material shipment | 0 tolerance target |

---

## 28. Logistics Product Implications

Product packaging and shipping strategy must consider weight.

Working assumptions:

| Product | Approximate working weight logic |
|---|---|
| 100×200 PP labels | Use conservative weight estimate until verified |
| 100×100 thermal labels | Use conservative weight estimate until verified |
| Pallet shipping | More attractive for B2B repeat orders |

The product strategy should push customers toward order sizes that make logistics efficient.

Direct parcel shipping is acceptable in Year 1-2 but should not dominate long-term economics.

---

## 29. Product Roadmap

### Phase 1 — MVP

Products:

1. Opaque PP 100×200 labels
2. Transparent PP 100×200 labels
3. Thermal 100×100 labels
4. Thermal 100×150 labels if cost confirmed
5. Sample Box
6. Quote Request
7. Reorder Previous Labels

### Phase 2 — Conversion Optimization

Add:

1. Bundles
2. More use-case pages
3. Better sample box flow
4. Reorder reminders
5. Multi-SKU quote request

### Phase 3 — B2B Account Growth

Add:

1. Customer portal improvements
2. Saved SKUs
3. Repeat order dashboard
4. Admin sales notes
5. Company accounts
6. Quote-to-order flow

### Phase 4 — Germany Hub Support

Add:

1. Delivery method selection
2. Hub-based shipping logic
3. Germany stock visibility for selected products
4. Faster reorder options

---

## 30. Product Metrics

Product strategy success must be measured by:

| Metric | Target |
|---|---:|
| Share of orders from 5,000+ packages | Increasing over time |
| Average order value | €479+ target |
| Repeat order rate | 30%+ within 12 months |
| Thermal label attachment rate | 15%+ target later |
| Quote request conversion | Track from day one |
| Reorder conversion | Core KPI |
| Reprint/error rate | Under 2.5% |
| Delivery complaint rate | Under 5% |
| Product page conversion rate | Track by segment |

If 1,000-label orders dominate and 5,000+ orders do not grow, the product strategy is failing.

---

## 31. Kill Criteria By Product

### PP Labels

Do not scale PP label products if:

1. 5,000-label package does not sell.
2. Average order value stays below €250.
3. Repeat rate stays below 20% after 6 months.
4. Production errors exceed 2.5%.
5. Delivery complaints exceed 8%.
6. Most customers only want very small one-time orders.

### Thermal Labels

Do not make thermal labels a main product if:

1. They do not increase AOV.
2. They create support complexity.
3. They attract only price shoppers.
4. They distract from PP label sales.

### Sample Box

Do not push free sample boxes if:

1. Sample requests do not convert.
2. Free samples attract non-business buyers.
3. Follow-up cannot be handled.

---

## 32. Non-Negotiable Product Rules

1. PP product labels are the main product.
2. Thermal labels are cross-sell.
3. 5,000-label package is the main target.
4. 1,000-label package is acquisition only.
5. 20,000+ quantity should use quote request.
6. Reorder must be built into product logic.
7. Artwork storage is part of the product value.
8. Do not add generic print categories.
9. Do not make legal compliance claims.
10. Do not hide Turkey production.
11. Product copy must be German-first.
12. Product URLs must be SEO-friendly.
13. Product configuration must stay simple in MVP.
14. Do not overbuild before revenue.

---

## 33. Codex Implementation Instructions

Codex must:

1. Use this document as product source of truth.
2. Not add unapproved product categories.
3. Build product data around PP labels and thermal labels only.
4. Include reorder fields in the product/order model.
5. Support fixed-price products and quote-request products.
6. Keep quantity options simple.
7. Keep German product copy customer-facing.
8. Avoid hardcoding product data in multiple places.
9. Use central product configuration or database-backed products.
10. Ensure SEO metadata exists for every product page.
11. Ensure quote CTA exists for large quantities.
12. Ensure upload requirement exists for custom PP label orders.
13. Ensure proofing status can be connected to orders.
14. Ensure previous orders can be reused for reorder.

---

## 34. Final Product Verdict

Labelpilot.de must launch with a narrow and focused product strategy.

The correct product focus is:

> 100×200 mm opaque and transparent PP product labels for German food, beverage and supplement brands, supported by thermal label cross-sells and a reorder system.

The wrong product focus is:

> A generic online print shop with many low-margin products.

The first commercial target is:

> Sell 5,000-unit PP label packages to German B2B customers and convert them into repeat buyers.

The product strategy is successful only if Labelpilot.de becomes a repeat-order supplier, not a one-time print vendor.
> SUPERSEDED — see `03-PRODUCT-STRATEGY-v2.md`. Kept for history. See `/docs/00-SOURCE-OF-TRUTH.md`.
