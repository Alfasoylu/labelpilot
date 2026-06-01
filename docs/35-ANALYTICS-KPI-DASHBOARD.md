# 35-ANALYTICS-KPI-DASHBOARD.md

# Labelpilot.de — Analytics and KPI Dashboard

## 1. Purpose

This document defines analytics and KPI tracking for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Analytics must answer:

1. Are German B2B buyers finding the site?
2. Are they requesting quotes?
3. Are they requesting sample boxes?
4. Are they placing paid orders?
5. Are they reordering?
6. Are margins and operations improving?
7. Is SEO/GEO producing qualified demand?

Vanity traffic is not the goal.

Qualified B2B revenue is the goal.

---

## 2. Strategic Verdict

The correct KPI system is:

> Track conversion, lead quality, order value, reorder rate, margin proxies and operational bottlenecks.

The wrong KPI system is:

> Track only pageviews and impressions.

Traffic without quote/order/reorder conversion is noise.

---

## 3. Analytics Tools

Recommended:

```txt
Google Search Console
GA4
Vercel Analytics optional
Plausible optional
PostHog optional later
```

Do not overload MVP with too many analytics tools.

Start simple.

---

## 4. Core Funnel

Main funnel:

```txt
SEO/GEO/Direct/Outbound
→ page visit
→ product/industry page
→ quote request or sample box
→ lead qualification
→ quote sent
→ order paid
→ file/proof approved
→ shipped
→ completed
→ reorder
```

Every KPI should map to this funnel.

---

## 5. Website Events

Track:

```txt
page_view
product_cta_click
quote_form_view
quote_form_start
quote_form_submit
sample_box_view
sample_box_submit
file_requirements_view
reorder_cta_click
contact_form_submit
```

If paid checkout exists:

```txt
checkout_started
checkout_completed_webhook
checkout_cancelled
payment_failed
```

If upload/proof exists:

```txt
artwork_uploaded
correction_required
proof_ready
proof_approved
```

---

## 6. Lead KPIs

Track:

| KPI | Target/Meaning |
|---|---|
| Quote requests | core demand |
| Sample box requests | trust friction demand |
| Qualified lead rate | lead quality |
| Lead score average | quality trend |
| Quote-to-order rate | sales effectiveness |
| Sample-to-quote rate | sample ROI |
| Sample-to-order rate | sample ROI |
| Cost per qualified lead | later paid ads |

Lead quality matters more than raw lead count.

---

## 7. Order KPIs

Track:

```txt
paid orders
average order value
order quantity mix
product mix
payment failure rate
file correction rate
proof required rate
production approval time
shipment time
reprint rate
refund rate
```

Minimum dashboard:

| KPI | Why |
|---|---|
| Paid orders | revenue |
| AOV | economics |
| Quantity mix | customer quality |
| File correction rate | support load |
| Proof approval time | bottleneck |
| Reprint rate | quality risk |

---

## 8. Reorder KPIs

Track:

```txt
reorder rate
time to second order
same-artwork reorder share
minor-change reorder share
average reorder value
repeat revenue share
reorder gross margin proxy
```

Critical target:

```txt
12-month reorder rate should reach 40%+ for good B2B customers.
```

If reorder rate is weak, fix product/customer segment before scaling ads.

---

## 9. SEO KPIs

Search Console:

```txt
indexed pages
impressions
clicks
CTR
average position
query relevance
canonical errors
excluded pages
```

SEO success is not only impressions.

Good sign:

```txt
queries include supplement etiketten drucken, lebensmitteletiketten drucken, pp rollenetiketten
```

Bad sign:

```txt
queries include free templates, wedding stickers, DIY labels
```

---

## 10. GEO / AI Search KPIs

Manual tracking:

```txt
AI platform
query
was Labelpilot mentioned?
was description accurate?
which page cited?
competitors mentioned
action needed
date checked
```

Test queries:

```txt
PP Rollenetiketten für Supplement Marken Deutschland
Lebensmitteletiketten für kleine Marken
Etiketten nachbestellen mit gespeicherter Druckdatei
B2B Anbieter für Produktetiketten Deutschland
```

GEO is harder to measure but strategically important.

---

## 11. Financial KPIs

Track:

```txt
gross revenue
net revenue
gross profit estimate
shipping cost
payment fees
sample box cost
refund/reprint cost
repeat revenue
CAC if paid marketing
```

Do not scale paid acquisition without margin visibility.

---

## 12. Operational KPIs

Track:

```txt
time to quote response
time to file review
time to proof upload
time to proof approval
time to production approval
time to shipment
support messages per order
file correction rate
reprint rate
```

Operations determine margin.

A profitable product can become unprofitable through support chaos.

---

## 13. Event Naming Rules

Use lowercase snake_case:

```txt
quote_form_submit
sample_box_submit
reorder_started
proof_approved
```

Do not create inconsistent names:

```txt
QuoteSubmit
quoteSubmitted
submit_quote
```

---

## 14. Source Tracking

Capture:

```txt
utm_source
utm_medium
utm_campaign
utm_term
utm_content
referrer
landing_page
source_page
```

Lead forms must store source data.

This is necessary for SEO/ads/outbound evaluation.

---

## 15. KPI Review Cadence

Review weekly:

```txt
leads
qualified leads
quote requests
paid orders
sample requests
file bottlenecks
```

Review monthly:

```txt
SEO performance
conversion rates
AOV
reorder rate
lead sources
gross margin proxy
```

Review quarterly:

```txt
Germany hub readiness
product expansion
paid ads scale
programmatic SEO expansion
```

---

## 16. Acceptance Criteria

Analytics setup is accepted when:

| Check | Required Result |
|---|---|
| Core events defined | PASS |
| Lead source tracking defined | PASS |
| SEO KPIs defined | PASS |
| Order KPIs defined | PASS |
| Reorder KPIs defined | PASS |
| Sample box KPIs defined | PASS |
| Operational KPIs defined | PASS |
| Financial KPIs defined | PASS |
| Review cadence defined | PASS |

---

## 17. Final Verdict

Analytics must guide money decisions.

The correct system:

> Track qualified leads, paid orders, reorder rate, AOV, margin proxies and bottlenecks.

The wrong system:

> Celebrate traffic.

Labelpilot.de should scale what produces repeat B2B profit, not what produces pageviews.
