# 33-REORDER-ECONOMICS.md

# Labelpilot.de — Reorder Economics

## 1. Purpose

This document defines the reorder economics model for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The business is not won by the first order alone.

The business is won when a customer:

1. Places first order.
2. Approves artwork/proof.
3. Receives correct labels.
4. Stores label specs.
5. Reorders faster.
6. Increases quantity over time.
7. Buys cross-sell thermal labels.
8. Becomes predictable recurring revenue.

Reorder economics are the core path to long-term profitability.

---

## 2. Strategic Verdict

The correct economic model is:

> First order pays acquisition and setup friction. Reorders create higher operational efficiency, lower support load and higher lifetime value.

The wrong model is:

> Treat every order as a one-time transaction and force customers to restart from zero.

If reorder rate is weak, Labelpilot.de becomes a low-margin print order website.

If reorder rate is strong, Labelpilot.de becomes a B2B supply platform.

---

## 3. Core Assumptions

Initial cost assumptions from business model:

| Item | Assumption |
|---|---:|
| 100×200 PP label production cost | €0.020 / unit |
| 100×100 thermal label production cost | €0.012 / unit |
| Parcel shipping | €10 / kg |
| Partial pallet shipping | €500 / europallet / 250 kg |
| Main PP package | 5,000 labels |
| Starter PP package | 1,000 labels |
| Pro PP package | 10,000 labels |
| Target market | Germany |
| Production start | Turkey |
| Future hub | Germany |

All numbers are working assumptions and must be updated with real operating data.

---

## 4. First Order vs Reorder

### 4.1 First Order Costs More Operationally

First order includes:

```txt
customer education
material uncertainty
quote/support questions
file upload support
technical review
proof discussion
trust friction
shipping expectation management
```

### 4.2 Reorder Should Cost Less

Reorder reuses:

```txt
approved artwork
approved proof
material
size
quantity history
customer record
shipping data
production notes
```

The reorder system exists to reduce labor per order.

---

## 5. Economic Logic

For Labelpilot.de, the customer lifetime value should be calculated as:

```txt
LTV = first order gross profit + reorder gross profit + cross-sell gross profit - support cost - acquisition cost
```

Reorder improves LTV because:

1. CAC is already paid.
2. File review is faster.
3. Customer trust is higher.
4. Sales cycle is shorter.
5. Quantity may increase.
6. Margin loss from mistakes decreases.
7. Cross-sell becomes easier.

---

## 6. Main Package Economics

### 6.1 5,000 PP Labels

Working production cost:

```txt
5,000 × €0.020 = €100
```

Target selling price from pricing model:

```txt
€399
```

Simple gross profit before logistics/support/payment:

```txt
€399 - €100 = €299
```

Gross margin before logistics/support/payment:

```txt
€299 / €399 = 74.9%
```

This is attractive only if support and shipping are controlled.

### 6.2 Reorder Impact

If reorder reduces support/proof time by 50–70%, the same €399 order becomes more profitable operationally.

That is the business.

---

## 7. Reorder Rate Targets

Minimum target reorder rates:

| Customer Stage | Target |
|---|---:|
| 2nd order within 6 months | 25% |
| 2nd order within 12 months | 40% |
| 3rd order among 2nd-order customers | 50% |
| Same-artwork reorder share | 60%+ |
| Minor-change reorder share | 20–30% |
| Lost after first order | below 60% |

If 12-month reorder rate is below 25%, the model is weak.

---

## 8. Quantity Expansion Targets

Expected reorder behavior:

| Order | Target Quantity |
|---|---:|
| First trial order | 1,000 |
| First serious order | 5,000 |
| Second order | 5,000–10,000 |
| Mature repeat customer | 10,000–50,000 |
| Larger B2B account | Quote / 20,000+ |

The goal is not to keep customers at 1,000 labels.

The goal is to move good customers toward 5,000+ repeat quantities.

---

## 9. Reorder Profit Drivers

Main reorder profit drivers:

```txt
same artwork reuse
faster proofing
higher quantity
lower customer support
higher trust
cross-sell thermal labels
consolidated shipping
predictable production batches
```

Reorder profit killers:

```txt
every reorder treated as new job
constant design changes
low quantity repeat orders
manual communication chaos
unclear file history
wrong version printed
no customer portal
no admin status control
```

---

## 10. Reorder Types

### 10.1 Same Artwork

Best margin.

```txt
same file
same material
same size
same specs
quantity may change
admin check still required
```

### 10.2 Minor Change

Medium margin.

Examples:

```txt
MHD
batch number
barcode
flavor
small text change
```

May require proof.

### 10.3 New Artwork

Not a simple reorder.

Treat as new order or quote.

---

## 11. Reorder Pricing

Default approach:

```txt
Reorder uses current package price unless customer has custom quote agreement.
```

Possible future:

```txt
same-artwork reorder discount
volume pricing
monthly production plan
account-specific pricing
```

Do not add discounts before measuring CAC/reorder economics.

Discounting too early destroys margin.

---

## 12. Reorder Reminders

Suggested reminder timing:

| Customer Type | Reminder |
|---|---|
| 1,000 labels | 45–60 days |
| 5,000 labels | 60–90 days |
| 10,000 labels | 90–120 days |
| 20,000+ | account-specific |

Reminder should be based on real order frequency once data exists.

Do not spam.

---

## 13. Reorder Email Logic

Good reorder email:

```txt
Ihre freigegebenen Druckdaten sind gespeichert. Sie können dieselben Etiketten schneller nachbestellen oder eine neue Menge auswählen.
```

Bad reorder email:

```txt
Buy again now!!! Discount today only!!!
```

This is B2B procurement, not consumer impulse marketing.

---

## 14. Reorder KPIs

Track:

```txt
reorder rate
time to second order
average reorder quantity
same-artwork reorder share
minor-change reorder share
reorder gross margin
support time per reorder
proof required rate on reorders
reorder-to-quote rate
repeat customer revenue share
```

Minimum dashboard:

| KPI | Why It Matters |
|---|---|
| Reorder rate | proves LTV |
| Time to second order | reveals product consumption cycle |
| Average reorder value | shows account expansion |
| Same-artwork share | shows operational leverage |
| Repeat revenue share | shows platform strength |

---

## 15. Breakpoint for Germany Hub

Germany hub becomes more rational when:

```txt
repeat customers increase
monthly shipment volume is predictable
pallet consolidation works
delivery speed affects conversion
return/reprint handling grows
```

Do not open Germany hub just for ego.

Open it when reorder volume justifies it.

---

## 16. Acceptance Criteria

Reorder economics model is accepted when:

| Check | Required Result |
|---|---|
| Reorder KPIs defined | PASS |
| Same-artwork reorder defined | PASS |
| Minor-change reorder defined | PASS |
| Reorder rate targets defined | PASS |
| Quantity expansion logic defined | PASS |
| Reorder reminder logic defined | PASS |
| Germany hub trigger connected to reorder volume | PASS |
| No early discount dependency | PASS |

---

## 17. Final Verdict

Reorder is the profit engine.

If Labelpilot.de cannot make reorders easier, faster and more profitable than first orders, the project becomes a generic print website.

The target is not one order.

The target is repeat B2B supply.
