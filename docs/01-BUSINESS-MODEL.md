# 01-BUSINESS-MODEL.md

# Business Model — Germany-Focused B2B PP Label Reorder Platform

## 1. Purpose Of This Document

This document defines the business model of the project.

It is the source of truth for:

- What the company sells
- Who the company sells to
- How the company makes money
- Which products are allowed
- Which products are not allowed
- How the reorder model works
- How B2B and B2C flows are separated
- How the business can scale toward €100,000+ monthly contribution

Codex must read this file before implementing pricing, product pages, checkout, quote flow, reorder logic, customer portal, admin panel, SEO pages or business-related UI.

---

## 2. Executive Summary

The business is a Germany-focused B2B-first label supply platform.

The platform sells custom printed PP roll product labels (opaque and transparent) as the main product, plus thermal logistics labels as a secondary cross-sell, to German food, beverage, supplement and micro-manufacturing brands.

The core business is not one-time printing.

The core business is:

> Saved artwork + saved specifications + easy reorder + repeat B2B supply.

The company produces in Turkey and ships to Germany. Positioning is German-facing (German market, German-language UI, German B2B relationship), not "Made in Germany". Production location must not be hidden or misrepresented. In later stages, the company may operate a Germany hub for faster delivery, returns, trust and B2B account growth.

---

## 3. Final Business Definition

Build a digital B2B label ordering and reorder platform for German micro and small brands that need recurring product labels.

The business combines:

1. Turkey-based cost-efficient production
2. Germany-focused B2B sales
3. Custom PP roll product labels
4. Thermal label cross-sell
5. Stripe-powered online payment
6. Quote request flow for larger orders
7. Artwork upload and proof approval
8. Saved label specifications
9. One-click reorder
10. Long-term Germany hub strategy
11. SEO and GEO content engine

---

## 4. What This Business Is

This business is:

- A B2B label supply platform
- A recurring order system
- A Germany-focused niche supplier
- A custom PP roll-label seller (opaque + transparent)
- A reorder infrastructure for micro brands, built on saved artwork and saved specifications (the strategic moat)
- A hybrid of e-commerce, B2B sales and production coordination

The Musterbox (sample box) is the primary trust tool that converts cautious first-time B2B buyers. Thermal labels are a secondary cross-sell and must never be positioned as the core offer.

The business should read as a professional German-facing roll-label manufacturer with clear, SaaS-like ordering — not a generic online print shop, not a broad print marketplace, and not a cheap exporter.

---

## 5. What This Business Is Not

This business is not:

- A generic online print shop
- A marketplace for every print product
- A gift printing store
- A low-price sticker shop
- A business card / flyer / brochure site
- A same-day emergency print service
- A legal labeling compliance consultancy
- A pure B2C Shopify store
- A design agency

These categories create distraction, low margins, weak repeat behavior and operational complexity.

---

## 6. Core Strategic Thesis

The business succeeds if it proves this thesis:

> German food, beverage and supplement micro brands will repeatedly buy custom PP product labels from a Turkey-based supplier if the supplier offers lower cost, professional ordering, saved artwork, easy reorder, clear delivery, German-facing communication and no tax surprise.

The business fails if it becomes:

> A generic print shop selling low-margin one-time orders to price shoppers.

---

## 7. Main Customer Segments

### 7.1 Primary Segment

German micro and small brands in:

1. Food production
2. Beverage production
3. Supplements
4. Coffee
5. Tea
6. Spices
7. Honey
8. Jam
9. Bottled products
10. Jarred products
11. Pouch-packaged products

These brands need labels repeatedly.

They usually care about:

- Unit cost
- Label appearance
- Material quality
- Reorder simplicity
- Reliable delivery
- Small to medium quantities
- Saved production files
- Consistent supplier relationship

---

### 7.2 Secondary Segment

Small e-commerce sellers needing thermal logistics labels.

Thermal labels are not the main profit engine.

They are useful for:

- Increasing average order value
- Keeping B2B customers inside the ecosystem
- Serving customers who also ship their own products
- Supporting warehouse and logistics use cases

---

### 7.3 Customers To Avoid

Avoid customers who:

- Need only 100–250 labels once
- Need same-day local delivery
- Require heavy design consulting for low order value
- Are pure price shoppers
- Have no repeat purchase potential
- Need the company to write legal food or supplement label text
- Create high support workload with low purchase value

---

## 8. Product Strategy Summary

### 8.1 Main Product

The main product is:

**100×200 mm (10×20 cm) custom printed PP roll labels**

Material variants:

1. Opaque PP
2. Transparent PP

Primary package quantities (canonical ladder per `/docs/00-SOURCE-OF-TRUTH.md`):

| Package | Quantity | Strategic role |
|---|---:|---|
| Starter | 1,000 labels | Paid trial / acquisition |
| — | 2,000 labels | Step-up from trial |
| Growth | 5,000 labels | Main B2B product (default / recommended) |
| Pro | 10,000 labels | Scaling product |
| Quote | 20,000+ labels | Quote-based B2B account (quote-only) |

Fixed-price packages cover the four online tiers `1,000 / 2,000 / 5,000 / 10,000`. `20,000+` is always handled as a quote, not a fixed online price.

---

### 8.2 Cross-Sell Product

Thermal labels:

1. 100×100 mm eco thermal label
2. 100×150 mm thermal shipping label

Thermal labels must be positioned as:

- Shipping label add-on
- Warehouse label add-on
- Logistics bundle
- Reorderable supply product

They should not replace PP product labels as the core business.

---

## 9. Product Economics Logic

Known production assumptions:

| Product | Cost |
|---|---:|
| 100×100 mm eco thermal label | €0.012 / unit |
| 100×200 mm printed PP label | €0.020 / unit |

Shipping assumptions:

| Method | Cost |
|---|---:|
| Direct parcel shipping | €10 / kg |
| Partial pallet | €500 / pallet |
| Pallet weight assumption | 250 kg |
| Effective pallet cost | €2 / kg |

Strategic implication:

- 1,000-label orders are useful for customer acquisition.
- 5,000-label orders are the main business.
- 10,000+ label orders create serious profit potential.
- Consolidated shipping is much better than parcel-by-parcel shipping.
- B2B repeat customers are more valuable than B2C one-time buyers.

---

## 10. Recommended Initial Pricing Logic

Final pricing must be defined in `/docs/04-PRICING-AND-MARGIN-MODEL.md`.

Initial working prices:

| Package | Quantity | Product | Target price |
|---|---:|---|---:|
| Starter | 1,000 | 100×200 mm PP labels | See `/docs/04-PRICING-AND-MARGIN-MODEL.md` |
| — | 2,000 | 100×200 mm PP labels | See `/docs/04-PRICING-AND-MARGIN-MODEL.md` |
| Growth | 5,000 | 100×200 mm PP labels | See `/docs/04-PRICING-AND-MARGIN-MODEL.md` |
| Pro | 10,000 | 100×200 mm PP labels | See `/docs/04-PRICING-AND-MARGIN-MODEL.md` |
| Quote | 20,000+ | 100×200 mm PP labels | Quote request |

Rules:

1. Push 5,000-label package as the default recommended option.
2. Do not make 1,000-label package the main business.
3. Use 1,000-label package as a paid test order.
4. Use quote request for 20,000+ labels.
5. Use thermal labels as bundle and reorder add-ons.
6. Avoid discounting below contribution margin.

---

## 11. Revenue Streams

The business should have multiple revenue streams.

### 11.1 Direct Product Sales

Customer buys labels online through Stripe checkout.

Best for:

- Starter package
- Growth package
- Repeat orders
- Thermal label cross-sell

---

### 11.2 Quote-Based B2B Orders

Customer requests quote for larger quantities or specific requirements.

Best for:

- 20,000+ labels
- Multiple SKUs
- Special materials
- Multiple designs
- Repeat monthly orders
- Multi-product brands

---

### 11.3 Reorder Revenue

Customer reorders previous label with saved artwork and specifications.

This is the most important profit stream.

Why:

- Lower customer acquisition cost
- Lower support workload
- Less artwork confusion
- Higher customer lifetime value
- Better production planning
- Better logistics planning

---

### 11.4 Sample Box Revenue

Customer orders a sample box before placing larger order.

Purpose:

- Build trust
- Reduce purchase anxiety
- Show PP materials
- Show opaque vs transparent difference
- Capture qualified B2B leads

Sample box can be free with voucher or paid.

---

### 11.5 Thermal Label Cross-Sell

Thermal labels are sold to existing label customers.

Purpose:

- Increase AOV
- Improve customer retention
- Serve shipping/warehouse needs
- Build procurement relationship

---

### 11.6 Future Managed Account Revenue

For larger B2B customers, the company may later offer managed monthly label supply.

This can include:

- Monthly forecast
- Scheduled production
- Scheduled shipments
- Multiple SKU coordination
- Saved files and version control
- Dedicated account support

This is not MVP, but the platform should not block this future direction.

---

## 12. Reorder Model Explained

The reorder model is not a Netflix-style subscription.

It is a repeat-order infrastructure.

The system stores:

- Customer
- Company
- Previous order
- Label size
- Material
- Quantity
- Artwork file
- Proof file
- Production notes
- Shipping address
- Reorder timing

Then the customer can reorder the same label quickly.

Example flow:

1. Customer orders 5,000 PP labels.
2. Artwork and specs are saved.
3. Order is delivered.
4. After 45–60 days, customer gets reorder reminder.
5. Customer clicks reorder link.
6. Quantity can be changed.
7. Stripe payment is completed.
8. Admin sees it as a repeat order.
9. Production starts with fewer support steps.

This is the long-term moat.

---

## 13. Optional Subscription / Scheduled Refill Model

In later phases, the business can offer scheduled refill plans.

Example plans:

| Plan | Description |
|---|---|
| Monthly Refill | Same label produced every month |
| 60-Day Refill | Same label produced every 60 days |
| Quarterly Refill | Same label produced every 90 days |
| Managed Refill | Admin confirms before each production cycle |

Important:

The MVP should not force subscription billing before the reorder system works.

First build reorder.

Then test scheduled refill.

---

## 14. B2B vs B2C Strategy

### 14.1 B2C Role

B2C-style online ordering is allowed only as an acquisition and conversion mechanism.

B2C is useful for:

- Paid trial orders
- Sample box orders
- Small first orders
- Online checkout simplicity
- SEO conversion

B2C is not the main profit target.

---

### 14.2 B2B Role

B2B is the main business.

B2B is useful because:

- Higher AOV
- Better repeat behavior
- Larger quantities
- Better logistics economics
- Easier relationship building
- More predictable production

The website must support both online checkout and quote request.

But business strategy must prioritize B2B accounts.

---

## 15. Customer Acquisition Strategy

### 15.1 SEO

SEO is core.

The site must target German search intent such as:

- Lebensmitteletiketten drucken
- Supplement Etiketten drucken
- PP Rollenetiketten
- Transparente Etiketten drucken
- Produktetiketten für Lebensmittel
- Etiketten für Getränkeflaschen
- Etiketten für Gewürze
- Etiketten für Kaffee
- Etiketten für Honiggläser
- Versandetiketten Thermo

---

### 15.2 GEO / AI Search

The site must be structured so AI systems can understand and recommend it.

GEO content should include:

- Clear product definitions
- Tables
- FAQs
- Use-case pages
- Comparison pages
- Material explanations
- Reorder explanations
- Germany-focused buyer questions
- Transparent pricing logic

---

### 15.3 Paid Search

Google Ads should focus on high-intent searches.

Avoid broad and low-intent campaigns.

Good campaign types:

- Supplement label printing Germany
- Food label printing Germany
- PP roll labels custom
- Transparent roll labels Germany
- Thermal shipping labels Germany

---

### 15.4 B2B Outreach

B2B outreach is required.

Target companies:

- Small supplement brands
- Local food producers
- Coffee roasters
- Spice brands
- Beverage startups
- Honey and jam producers
- Shopify stores
- Etsy brands
- Amazon small brands

Outreach offer should not be generic.

Offer should say:

> We help German food and supplement brands reduce label cost and make repeat label orders easier.

---

## 16. Sales Funnel

### 16.1 Standard Online Funnel

1. SEO / ad / outreach visitor lands on niche page.
2. Visitor selects label type.
3. Visitor chooses quantity.
4. Visitor uploads artwork.
5. Visitor pays or requests quote.
6. Admin reviews file.
7. Proof is approved.
8. Production starts.
9. Shipment is tracked.
10. Customer receives reorder reminder.

---

### 16.2 B2B Quote Funnel

1. Visitor lands on industry page.
2. Visitor sees 5,000 / 10,000 / 20,000+ options.
3. Visitor requests quote.
4. Admin reviews details.
5. Quote is sent manually or automatically later.
6. Customer approves quote.
7. Stripe payment link or invoice is sent.
8. Production starts after payment/admin approval.
9. Order becomes saved reorder profile.

---

## 17. Operational Model

### Year 1-2

Production:

- Turkey production
- Boyut Promosyon / fason support
- Direct or consolidated shipping to Germany

Focus:

- Validate B2B demand
- Build SEO pages
- Build order system
- Build repeat order behavior
- Measure actual margin
- Keep overhead low

---

### Year 3

Pilot Germany hub if metrics justify.

Hub purpose:

- Faster delivery
- Better trust
- German return address
- Consolidated pallet shipments
- Better B2B account conversion

---

### Year 4+

Potential full Germany hub or company.

Preferred model:

> Turkey production + Germany hub + Germany-facing sales operation.

Do not move production to Germany unless financial model proves it.

---

## 18. Germany Hub Trigger Criteria

Do not open Germany hub too early.

Open pilot only if these metrics are met:

| Metric | Trigger |
|---|---:|
| Monthly revenue | €80,000+ |
| Monthly B2B orders | 150+ |
| Repeat order rate | 35%+ |
| Delivery complaint rate | 5%+ |
| Pallet shipment frequency | Weekly or more |
| Cash buffer | Enough for 6 months hub operation |

If these are not met, stay Turkey-based.

---

## 19. Key Metrics

The business must be managed by metrics.

### 19.1 Revenue Metrics

- Monthly revenue
- Average order value
- Revenue by product
- Revenue by customer segment
- Revenue from repeat orders
- Quote request conversion rate

### 19.2 Profit Metrics

- Gross margin
- Contribution margin
- Net profit
- Production cost per order
- Shipping cost per order
- Support cost per order
- Reprint cost

### 19.3 Growth Metrics

- New customers
- Repeat customers
- Repeat order rate
- Customer lifetime value
- CAC / sales acquisition cost
- LTV/CAC ratio
- Sample box conversion rate

### 19.4 Operational Metrics

- Order-to-proof time
- Proof approval time
- Production time
- Shipping time
- Delivery complaint rate
- Reprint/error rate
- Support tickets per order

---

## 20. Target Metrics

Initial target metrics:

| Metric | Target |
|---|---:|
| Main AOV | €479+ |
| Primary package | 5,000 labels |
| B2B CAC / sales cost | Under €60 |
| Repeat rate after 12 months | 30%+ |
| Delivery complaint rate | Under 5% |
| Reprint/error rate | Under 2.5% |
| Year 1 monthly revenue | €10,000–€30,000 |
| Year 2–3 monthly net profit (interim) | €8,000–€35,000 |
| Mid-term monthly contribution milestone | €100,000+ |
| Long-term monthly net profit (north-star, ~Year 8–10) | €100,000+ |

---

## 21. 10-Year Business Path

### Year 1

Goal:

- Validate product-market fit
- Sell first 5,000-label packages
- Build MVP
- Build SEO foundation
- Prove B2B demand

Expected result:

- €10,000–€30,000 monthly revenue potential
- Break-even to small profit possible

---

### Year 2

Goal:

- Build repeat customer base
- Improve reorder engine
- Increase B2B outreach
- Improve delivery process

Expected result:

- €40,000–€80,000 monthly revenue potential
- €8,000–€18,000 monthly net profit potential

---

### Year 3

Goal:

- Germany hub pilot if metrics justify
- Scale B2B accounts
- Improve quote flow
- Expand SEO pages

Expected result:

- €100,000–€160,000 monthly revenue potential
- €20,000–€35,000 monthly net profit potential

---

### Year 4-5

Goal:

- Stronger B2B account management
- More repeat orders
- Consolidated logistics
- Germany hub maturity

Expected result:

- €180,000–€420,000 monthly revenue potential
- €35,000–€80,000 monthly net profit potential

---

### Year 6-10

Goal:

- Reach €100,000+ monthly contribution (mid-term milestone), then push toward €100,000+ monthly **net profit** (long-term north-star)
- Expand to DACH / EU if Germany is proven
- Add managed label supply accounts
- Build scalable reorder and account infrastructure

Expected result:

- €100,000+ monthly net profit if the B2B repeat system works at full scale (contribution reaches this level earlier; net follows after overhead, tax, customs)

---

## 22. Required Company Capabilities

To succeed, the company must develop these capabilities:

1. German B2B positioning
2. Reliable Turkey production coordination
3. Artwork handling and proofing
4. Fast customer support
5. Stripe payment operations
6. Quote management
7. Saved file / reorder system
8. SEO content production
9. B2B outbound sales
10. Logistics optimization
11. Germany hub management later

---

## 23. Main Risks

### 23.1 Positioning Risk

If the site looks like a cheap generic print shop, German B2B buyers may not trust it.

Solution:

- German-language professional branding
- Clear product focus
- Sample box
- Trust signals
- Transparent process

---

### 23.2 Low AOV Risk

If customers mostly buy 1,000-label packages, profit will be weak.

Solution:

- Push 5,000-label package
- Show unit economics
- Offer better value at higher quantities
- Use 1,000 package as trial only

---

### 23.3 Shipping Risk

Small direct parcel shipments can destroy margin.

Solution:

- Consolidate shipments
- Use partial pallet economics
- Build Germany hub when justified
- Avoid low-value orders

---

### 23.4 Repeat Failure Risk

If customers do not reorder, CAC is too expensive.

Solution:

- Build reorder system from MVP
- Save specs
- Send reorder reminders
- Make reorder easier than ordering from competitors

---

### 23.5 Regulatory Risk

Food and supplement labels involve legal requirements.

Solution:

- Do not write regulatory content
- Customer provides legal text
- Platform provides printing and layout support only
- Clear disclaimer required

---

### 23.6 Operational Complexity Risk

Artwork review, proofing and customer changes can create support overload.

Solution:

- Standardize file requirements
- Use clear upload instructions
- Build admin proofing workflow
- Charge for excessive revisions later

---

## 24. Kill Criteria

Do not scale if these happen:

| Metric | Kill threshold |
|---|---:|
| 90-day 5,000-label package sales | Under 10 orders |
| Average order value | Under €250 |
| B2B CAC / sales cost | Above €60 consistently |
| Repeat order rate after 6 months | Under 20% |
| Delivery complaint rate | Above 8% |
| Reprint/error rate | Above 2.5% |
| Quote request conversion | Very weak after outreach |
| Customer type | Mostly one-time low-value buyers |

If these metrics fail, do not keep spending emotionally.

Either reposition, change niche, or stop.

---

## 25. Codex Implementation Rules Based On This Business Model

Codex must:

1. Prioritize B2B over B2C.
2. Prioritize PP labels over thermal labels.
3. Treat thermal labels as cross-sell.
4. Build reorder logic as core.
5. Build quote request flow.
6. Build file upload and proofing.
7. Use German-language customer-facing copy.
8. Avoid adding generic print categories.
9. Keep pricing configurable.
10. Keep product definitions structured.
11. Make SEO pages indexable.
12. Support future Germany hub logic without overbuilding.

Codex must not:

1. Add flyers, business cards or posters.
2. Build a generic marketplace.
3. Hide Turkey production.
4. Promise legal compliance for customer labels.
5. Start production before payment or admin approval.
6. Treat 1,000-label orders as the core business.

---

## 26. Final Business Verdict

The business should be built.

But only as:

> A Germany-focused B2B PP label reorder platform.

Not as:

> A generic online print shop.

The first serious commercial target is:

> Sell 5,000-unit and 10,000-unit 100×200 mm PP label packages to German food, beverage and supplement micro brands.

The long-term profit engine is:

> Repeat B2B orders from saved artwork and saved specifications.

The path to €100,000+ monthly contribution depends on:

1. B2B order size
2. Repeat order rate
3. Consolidated logistics
4. Germany trust layer
5. SEO/GEO lead engine
6. Low production cost
7. Operational discipline

If the company stays focused, the model is worth testing with the planned €30,000 starting capital.
