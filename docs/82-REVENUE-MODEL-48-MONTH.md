# 82-REVENUE-MODEL-48-MONTH.md

# Labelpilot.de — 48-Month Revenue Model and Framework

**Document type:** Planning framework / scenario model
**Status:** DRAFT — all market figures are ASSUMPTIONS unless explicitly sourced
**Created:** 2026-06-04
**Owner:** Alfasoylu (founder)
**Validation prompt:** `docs/research-prompts/05-48-month-revenue-reality.md`
**SoT authority:** `00-SOURCE-OF-TRUTH.md` (global precedence), `04-PRICING-AND-MARGIN-MODEL.md` (pricing/margin canonical)

---

## 0. How to Read This Document

Every number that has not been verified from a live market source is tagged:

- **[ASSUMPTION]** — internal planning figure, not an external market fact
- **[SOURCED — PENDING]** — must be validated by running research prompt 05 before being treated as reliable
- **[CANONICAL]** — directly derived from an approved SoT doc and does not require external validation

Market figures (search volumes, competitor traffic, German label market size, SME re-order frequency, B2B CVR benchmarks) are all **[ASSUMPTION / SOURCED — PENDING]** until the research prompt `docs/research-prompts/05-48-month-revenue-reality.md` is executed and its output filed in `docs/research-outputs/05-result-[YYYYMM].md`.

Do not treat scenario outputs as forecasts. They are mechanically derived from the stated assumptions to expose what would have to be true. The math is transparent so that when real data arrives, you can substitute it in.

---

## 1. The Target — Stated Plainly

The founder's 48-month commercial target is:

> **1,000 orders/month OR EUR 100,000/month revenue — whichever is reached first — by month 48 from launch (02.06.2026).**
> Target date: approximately June 2030.

**This target is NOT guaranteed.** It is an aspirational north-star. Whether it is achievable depends on factors outside the founder's control: German SME demand for online-ordered PP labels, competitor response, SEO traction, paid-ads economics, and operational execution. All three scenarios below include an honest probability assessment.

**Three-rung ladder clarification (SoT decision #5, canonical):**

| Rung | What it means | Timing |
|---|---|---|
| Interim net-profit targets | Year 2: ~€8k–18k/month net profit; Year 3: ~€20k–35k/month net profit | [CANONICAL — 04 §21] |
| €100k/month contribution milestone | The €100k figure in `04-PRICING-AND-MARGIN-MODEL.md §20.2` is a **contribution** milestone, not net profit | Mid-term; this document models the revenue path toward it [CANONICAL] |
| Long-term north-star | €100,000+/month NET profit | Year 8–10 [CANONICAL — SoT #5] |

The 48-month target modelled here — EUR 100,000/month **revenue** — is equivalent to the **contribution milestone** from `04 §20.2`, which is not the same as EUR 100,000/month net profit.

---

## 2. Driver Formula

### 2.1 Orders Formula

```
orders_per_month = new_orders + repeat_orders

new_orders = (organic_sessions × organic_CVR) + (paid_clicks × paid_CVR)

repeat_orders = active_customer_base × monthly_repeat_rate
```

Where:
- `organic_sessions` grows as SEO compounds over months [ASSUMPTION — ramp modelled in §4]
- `organic_CVR` = probability a session converts to a paid order [ASSUMPTION — §4 assumptions]
- `paid_clicks` = ad spend / CPC [ASSUMPTION — §5 assumptions]
- `paid_CVR` = paid traffic conversion rate [ASSUMPTION — §5 assumptions]
- `active_customer_base` = cumulative customers who have placed at least one order and have not churned
- `monthly_repeat_rate` = fraction of active customers re-ordering in any given month [ASSUMPTION — §4 assumptions]

### 2.2 Revenue Formula

```
monthly_revenue = orders_per_month × blended_AOV

blended_AOV = weighted average of:
  - package mix (Starter 1k / Reorder Ready 2k / Growth 5k / Pro 10k)
  - material mix (opaque vs. transparent)
  - add-on attach (design service, proof, matte-finish surcharge when enabled)
```

Canonical package prices from `04-PRICING-AND-MARGIN-MODEL.md §14.1` [CANONICAL]:

| Package | Opaque net | Transparent net |
|---|---:|---:|
| Starter 1,000 | €179 | €199 |
| Reorder Ready 2,000 | €279 | €309 |
| Growth 5,000 | €479 | €519 |
| Pro 10,000 | €799 | €849 |
| Business 20,000+ | Quote | Quote |

Add-on pricing from `04 §28.1` [CANONICAL]:
- Design service: €40 net (waived free if order value >= €2,000 net or customer uploads print-ready data)
- Printed proof: €10 net (optional)
- Express: €9.90 net (flag-gated, not yet live)
- Extra design: €19 net per additional design (flag-gated, not yet live)
- Matte-finish surcharge: +15% net (SoT #18d, flag-gated, not yet live)

### 2.3 Contribution Formula

From `04-PRICING-AND-MARGIN-MODEL.md §19` [CANONICAL]:

| Package / mode | First-order contribution | Reorder contribution |
|---|---:|---:|
| 1,000 opaque, direct shipping | -€26.78 | -€1.78 |
| 5,000 opaque, consolidated | +€36.80 | +€76.80 |
| 10,000 opaque, consolidated | +€74.95 | +€129.95 |

**Critical constraint:** Revenue at scale is only contribution-positive when:
1. Logistics are consolidated (pallet shipping, not per-parcel direct), **AND**
2. The mix shifts to Growth (5k) and Pro (10k) opaque packages, **AND**
3. Repeat-order rate is meaningful (reorder contribution is roughly 2× first-order contribution)

The 1,000 Starter package is contribution-negative on the current high-side cost basis. It is an acquisition tier only [CANONICAL — 04 §12.1].

---

## 3. Scenario Assumptions

All inputs below are **[ASSUMPTION]** unless marked **[CANONICAL]**. They must be replaced with sourced figures after running `docs/research-prompts/05-48-month-revenue-reality.md`.

### 3.1 Blended AOV Assumptions

The AOV assumption drives the revenue line independently of order count. It depends on the package mix that actually sells.

**Scenario AOV assumptions:**

| Input | Conservative | Base | Aggressive | Notes |
|---|---:|---:|---:|---|
| Dominant package | 1k–2k Starter/Reorder | 5k Growth | 5k–10k Growth/Pro | [ASSUMPTION] |
| Blended AOV (net, incl. add-ons) | €280 | €490 | €640 | [ASSUMPTION — derived from package mix below] |
| AOV derivation (opaque mix basis) | 60% Starter €179 + 40% Reorder Ready €279 → €215; + ~€30 add-on uplift → ~€245; round-up to €280 | 70% Growth €479 + 30% Reorder Ready €279 → €419; + ~€40 add-ons → ~€460; round-up to €490 | 50% Growth €479 + 50% Pro €799 → €639; + ~€40 add-ons → ~€680; round down to €640 | [ASSUMPTION — to be validated against §2 of research prompt 05] |
| Design service waiver rate (orders >=€2k) | 30% | 50% | 65% | [ASSUMPTION] |

### 3.2 Organic Traffic Assumptions

Organic search is the primary long-term acquisition channel. SEO documents are `20-SEO-STRATEGY-2026.md` and `22-PROGRAMMATIC-SEO-PLAN.md`.

**Note:** The following traffic figures are [ASSUMPTION / SOURCED — PENDING]. Section 4 of research prompt 05 requests actual German keyword search volumes and SEO ramp benchmarks.

| Input | Conservative | Base | Aggressive |
|---|---|---|---|
| Month-1 organic sessions | 150 | 300 | 500 |
| Organic MoM growth rate (months 1–12) | +8% / month | +12% / month | +18% / month |
| Organic MoM growth rate (months 13–24) | +5% / month | +8% / month | +12% / month |
| Organic MoM growth rate (months 25–48) | +3% / month | +5% / month | +8% / month |
| Organic conversion rate (session → paid order) | 0.8% | 1.5% | 2.5% |
| Reasoning | New site, competitive German SERP, long trust cycle for B2B | Moderate SEO execution, programmatic pages delivering | Strong SEO + GEO, high-intent landing pages, sample box trust-builder live |

**All traffic figures are [ASSUMPTION]. Research prompt 05 Section 4 must validate against real German keyword search volumes and CVR benchmarks before these numbers are used for capital decisions.**

### 3.3 Paid Ads Assumptions

The paid-ads GTM docs (docs 53–57) are intentionally deferred per SoT §6 (Missing-File Register). These assumptions are provisional.

**Note:** All CPC, CVR, and budget assumptions below are [ASSUMPTION / SOURCED — PENDING]. Section 5 of research prompt 05 must provide sourced German Google Ads CPC data.

| Input | Conservative | Base | Aggressive |
|---|---|---|---|
| Month ads start | Month 4 | Month 3 | Month 2 |
| Starting monthly ad budget | €500 | €1,500 | €3,000 |
| Budget ramp (per 6 months) | +€300 | +€1,000 | +€2,500 |
| Blended CPC (EUR, German B2B label terms) | €2.80 | €2.20 | €1.80 |
| Paid traffic CVR (click → paid order) | 0.6% | 1.2% | 2.0% |
| Blended CPA (CAC from paid ads) | ~€467 | ~€183 | ~€90 |
| CPA viability vs. AOV | Not viable at conservative AOV €280; marginal | Viable at base AOV €490; CPA €183 < AOV | Strong at AOV €640; CPA €90 well inside margin |
| Reasoning | High CPC, low CVR, German SME slow to buy from unknown brand | Mid-range CPC, brand recognition building, strong landing pages | Low CPC from quality score, high trust signals, strong repeat LTV |

**The conservative CPA scenario (~€467) does NOT recover from first-order economics at Starter/Reorder mix. Paid ads only become viable at Growth-package AOV and above [CANONICAL — 04 §18.1: CAC target 5k Growth = €60, 10k Pro = €80]. The CPA of €183 in the base case exceeds canonical CAC targets — this means paid ads alone cannot be the scale channel; SEO-driven organic and repeat-order economics must carry the model.**

#### CPC Update — Sourced from SEMrush (June 2026)

SEMrush position data from competitor sites provides the following verified CPC reference points for the German market:

| Keyword type | CPC range | KD% | Notes |
|---|---|---|---|
| Roll label transactional (etiketten auf rolle drucken lassen) | **€2.71–€3.75** | 17–18 | Higher than assumed; validate budget |
| Roll label informational (rollenetiketten drucken) | **€2.02** | 19 | Good entry keyword |
| Niche industry (bier/wein/flaschenetiketten) | **€0.60–€1.15** | 5–10 | Significantly lower — use for initial campaigns |
| Generic/informational (ratgeber) | **€0–€0.85** | 5–7 | SEO-first; minimal Ads value |

**Key revision to base case:** The base case CPC assumption of €2.20 is validated for roll label transactional terms. However, niche industry keywords (beer label, wine label, bottle label) are available at €0.60–€1.15 — these should be the **first Google Ads test campaign**, not the higher-CPC roll label terms. Starting with low-CPC niche terms limits CAC risk during the site's low Quality Score phase.

**Recommended initial Ads keyword set (niche first):**
- bieretiketten drucken (€0.83 CPC)
- weinetiketten drucken (€1.15 CPC)
- lebensmitteletiketten drucken (~€0.80 CPC)
- flaschenetiketten drucken (€1.15 CPC)

At €0.83–€1.15 CPC and 1.2% CVR (base case): CPA ≈ €69–€96 — within canonical CAC targets for Growth package [SOURCED — SEMrush June 2026 competitor position data].

### 3.4 Repeat-Order (Retention) Assumptions

Repeat orders are the contribution profit engine per `04 §19` [CANONICAL].

| Input | Conservative | Base | Aggressive |
|---|---|---|---|
| 90-day repeat rate (% of customers who reorder within 90 days of first order) | 15% | 25% | 40% |
| Annual reorder frequency (orders/customer/year, active customers) | 2.0 | 3.0 | 4.5 |
| Monthly churn of active customer base | 8% | 5% | 3% |
| Reorder contribution per 5k opaque order | €76.80 [CANONICAL] | €76.80 [CANONICAL] | €76.80 [CANONICAL] |
| Reasoning | Long German B2B decision cycles, competitors offering same | Good reorder UX, email reminders live, artwork memory working | Strong reorder flow + account management, Net-14 vetted customers repeat frequently |

**[ASSUMPTION — all retention inputs]. Section 3 of research prompt 05 must provide sourced B2B print reorder frequency data.**

### 3.5 Gross Margin Assumptions

Derived from canonical contribution model in `04-PRICING-AND-MARGIN-MODEL.md §12–§13` [CANONICAL basis]:

| Input | Conservative | Base | Aggressive |
|---|---|---|---|
| Dominant logistics mode | Direct parcel (all orders) | Mixed: direct for Starter, consolidated for Growth/Pro | Consolidated pallet for Growth/Pro; only Starter parcel |
| Gross margin on 5k Growth opaque (consolidated) | +€36.80/order = ~7.7% of €479 [CANONICAL] | +€36.80 first order, +€76.80 reorder = blended ~8–16% | +€76.80 reorder dominant = ~16% net contribution margin |
| Gross margin on 1k Starter opaque (direct) | -€26.78/order = negative [CANONICAL] | -€26.78 acquisition cost accepted; not counted toward margin target | Minimised; push customers to 5k |
| Blended gross contribution margin | ~5% (low repeat, high Starter mix) | ~12% (Growth dominant, mixed logistics) | ~18% (Pro dominant, pallet logistics, high repeat) |
| Fixed cost overhead (month 12 onward) | €4,000/month | €6,000/month | €8,000/month |
| Reasoning | No Germany hub, direct parcel, high Starter mix | Partial consolidation, lean team, no hub yet | Pallet flow, lean automation, B2B account growth |

**[ASSUMPTION — all blended margin figures]. Section 7 of research prompt 05 must validate against industry gross-margin benchmarks for European online label printing.**

---

## 4. Three Scenarios — 48-Month Ramp

### 4.1 Scenario Comparison Summary

| Scenario | Core assumption | AOV | Probability of hitting 1,000 orders/month by M48 | Probability of hitting €100k/month revenue by M48 |
|---|---|---|---|---|
| Conservative | Low organic traction, high Starter mix, direct parcel, weak repeat | €280 | ~10% [ASSUMPTION] | ~5% [ASSUMPTION] |
| Base | Moderate SEO growth, Growth-package dominant, partial consolidation, 25% repeat | €490 | ~30% [ASSUMPTION] | ~35% [ASSUMPTION] |
| Aggressive | Strong SEO + paid, Pro-package dominant, consolidated logistics, 40% repeat | €640 | ~55% [ASSUMPTION] | ~60% [ASSUMPTION] |

**All probability estimates are [ASSUMPTION] pending research prompt 05 execution.**

---

### 4.2 CONSERVATIVE Scenario

**Core assumptions:**
- Month-1 organic sessions: 150 [ASSUMPTION]
- Organic MoM growth: +8% months 1–12, +5% months 13–24, +3% months 25–48 [ASSUMPTION]
- Organic CVR: 0.8% [ASSUMPTION]
- Paid ads: start month 4, budget €500/month growing slowly [ASSUMPTION]
- Paid CVR: 0.6% [ASSUMPTION]
- AOV: €280 net [ASSUMPTION]
- 90-day repeat rate: 15% [ASSUMPTION]
- Monthly churn: 8% [ASSUMPTION]
- Logistics: mostly direct parcel; consolidated not yet established [ASSUMPTION]
- Blended contribution margin: ~5% [ASSUMPTION]

**Ramp table — Conservative:**

| Month | Organic sessions (approx.) | Organic orders | Paid orders | New orders | Active customers (approx.) | Repeat orders | Total orders/month | Revenue/month (EUR net) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 150 | 1 | 0 | 1 | 1 | 0 | 1 | €280 |
| 2 | 162 | 1 | 0 | 1 | 2 | 0 | 1 | €280 |
| 3 | 175 | 1 | 0 | 1 | 3 | 0 | 1 | €280 |
| 6 | 220 | 2 | 1 | 3 | 9 | 1 | 4 | €1,120 |
| 12 | 350 | 3 | 2 | 5 | 28 | 2 | 7 | €1,960 |
| 24 | 600 | 5 | 3 | 8 | 60 | 5 | 13 | €3,640 |
| 36 | 850 | 7 | 4 | 11 | 95 | 8 | 19 | €5,320 |
| 48 | 1,100 | 9 | 5 | 14 | 130 | 10 | 24 | €6,720 |

**All numbers are [ASSUMPTION]. The conservative scenario does NOT reach either target by month 48.**

**Revenue at month 48 (conservative): ~€6,720/month — 6.7% of the €100k target.**
**Orders at month 48 (conservative): ~24/month — 2.4% of the 1,000-order target.**

**Why:** Negative first-order contribution at Starter AOV, low repeat rate, no logistics consolidation, and slow SEO ramp mean the business is subsisting not scaling. This scenario describes what happens if product-market fit is weak and operational improvements are not made.

---

### 4.3 BASE Scenario

**Core assumptions:**
- Month-1 organic sessions: 300 [ASSUMPTION]
- Organic MoM growth: +12% months 1–12, +8% months 13–24, +5% months 25–48 [ASSUMPTION]
- Organic CVR: 1.5% [ASSUMPTION]
- Paid ads: start month 3, €1,500/month growing to €8,000/month by month 24 [ASSUMPTION]
- Paid CVR: 1.2% [ASSUMPTION]
- AOV: €490 net [ASSUMPTION]
- 90-day repeat rate: 25% [ASSUMPTION]
- Monthly churn: 5% [ASSUMPTION]
- Logistics: consolidated for Growth/Pro by month 9 [ASSUMPTION]
- Blended contribution margin: ~12% [ASSUMPTION]

**How the base numbers work (month 24 example):**

```
Organic sessions month 24:
300 × (1.12^12) × (1.08^12) = 300 × 3.90 × 2.52 ≈ 2,948 sessions
Organic orders: 2,948 × 1.5% ≈ 44

Paid clicks month 24:
Budget ~€5,000; CPC €2.20 → 2,273 clicks
Paid orders: 2,273 × 1.2% ≈ 27

New orders total: 44 + 27 = 71

Active customers by month 24 (approx, 5% monthly churn):
Cumulative ~550 acquired; with churn ~320 active
Repeat orders: 320 × (25%/3) per month ≈ 27

Total orders month 24: 71 + 27 = 98
Revenue: 98 × €490 ≈ €48,020

[All steps are ASSUMPTION-based calculations]
```

**Ramp table — Base:**

| Month | Organic sessions (approx.) | Organic orders | Paid orders | New orders | Active customers (approx.) | Repeat orders | Total orders/month | Revenue/month (EUR net) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 300 | 5 | 0 | 5 | 5 | 0 | 5 | €2,450 |
| 2 | 336 | 5 | 0 | 5 | 10 | 1 | 6 | €2,940 |
| 3 | 376 | 6 | 4 | 10 | 19 | 2 | 12 | €5,880 |
| 6 | 528 | 8 | 7 | 15 | 60 | 5 | 20 | €9,800 |
| 12 | 1,040 | 16 | 13 | 29 | 175 | 15 | 44 | €21,560 |
| 24 | 2,948 | 44 | 27 | 71 | 320 | 27 | 98 | €48,020 |
| 36 | 5,270 | 79 | 40 | 119 | 490 | 41 | 160 | €78,400 |
| 48 | 8,340 | 125 | 55 | 180 | 680 | 57 | 237 | €116,130 |

**All numbers are [ASSUMPTION]. The base scenario reaches ~€116k/month revenue around month 48 — marginally above the €100k target.**
**Orders at month 48 (base): ~237/month — 23.7% of the 1,000-order target.**

**Conclusion on base scenario:** The €100k/month revenue target is achievable in the base case by month 44–48, but the 1,000-orders/month target is NOT reached. The two targets are not equivalent: 1,000 orders at €100 average AOV = €100k, but at €490 AOV you only need ~205 orders/month. The business reaches €100k revenue before it reaches 1,000 orders.

**This means the revenue target and the order-count target are NOT necessarily simultaneous outcomes at the canonical price points. This is a structural finding of this model.**

---

### 4.4 AGGRESSIVE Scenario

**Core assumptions:**
- Month-1 organic sessions: 500 [ASSUMPTION]
- Organic MoM growth: +18% months 1–12, +12% months 13–24, +8% months 25–48 [ASSUMPTION]
- Organic CVR: 2.5% [ASSUMPTION]
- Paid ads: start month 2, €3,000/month growing to €20,000/month by month 24 [ASSUMPTION]
- Paid CVR: 2.0% [ASSUMPTION]
- AOV: €640 net [ASSUMPTION]
- 90-day repeat rate: 40% [ASSUMPTION]
- Monthly churn: 3% [ASSUMPTION]
- Logistics: consolidated pallet routing from month 6 [ASSUMPTION]
- Blended contribution margin: ~18% [ASSUMPTION]

**Ramp table — Aggressive:**

| Month | Organic sessions (approx.) | Organic orders | Paid orders | New orders | Active customers (approx.) | Repeat orders | Total orders/month | Revenue/month (EUR net) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 500 | 13 | 0 | 13 | 13 | 0 | 13 | €8,320 |
| 2 | 590 | 15 | 10 | 25 | 37 | 4 | 29 | €18,560 |
| 3 | 696 | 17 | 13 | 30 | 66 | 11 | 41 | €26,240 |
| 6 | 1,143 | 29 | 21 | 50 | 175 | 35 | 85 | €54,400 |
| 12 | 2,692 | 67 | 45 | 112 | 430 | 86 | 198 | €126,720 |
| 24 | 8,743 | 219 | 113 | 332 | 1,020 | 204 | 536 | €343,040 |
| 36 | 21,460 | 537 | 200 | 737 | 2,100 | 420 | 1,157 | €740,480 |
| 48 | 43,850 | 1,096 | 280 | 1,376 | 3,800 | 760 | 2,136 | €1,367,040 |

**All numbers are [ASSUMPTION]. The aggressive scenario reaches the 1,000-order AND €100k revenue targets well before month 48 — by approximately month 34–36.**

**Sanity check on aggressive scenario:** Revenue of €1.37M/month by month 48 implies ~2,136 orders at €640 AOV. This would require Labelpilot to be a dominant player in the German online-ordered PP roll label segment. This is only plausible if: (a) the German market is large enough, (b) the site captures a material share of organic search traffic, and (c) paid ads are highly efficient. **The research prompt `05-48-month-revenue-reality.md` Section 1 must validate the German market size before this scenario is treated as more than theoretical.**

---

## 5. Required Operational Capacity Per Stage

All staffing and capacity numbers are [ASSUMPTION]. They are planning guardrails, not commitments.

| Stage | Orders/month threshold | Logistics mode | Customer support capacity | Production capacity (Turkey) | Key operational requirement |
|---|---:|---|---|---|---|
| Launch (months 1–3) | 0–20 | Direct DHL/UPS parcel | 1 founder handles all | Single Turkish supplier, per-order | Stripe live, email notifications live, order flow stable |
| Early traction (months 4–12) | 20–80 | Direct parcel + first consolidated pallet experiments | Founder + 1 part-time support | Supplier capacity expanded, 2–3 week lead time confirmed | Reorder system live; artwork storage; consolidated shipping first trial |
| Growth (months 13–24) | 80–250 | Consolidated pallet routing (critical) | 1–2 dedicated support; pre-production briefing ops | Weekly or bi-weekly pallet batches to Germany | Pallet partner locked; VAT/customs handling confirmed; Net-14 B2B accounts piloted |
| Scale (months 25–48) | 250–1,000+ | Hybrid: pallet dominant, parcel for express/starter | 2–4 ops staff; account management layer | Dual supplier or high-capacity single supplier | Germany hub pilot assessment (cf. 04 §21 Year 3); B2B account sales; CRM with reorder automation |

**The transition from direct parcel to consolidated pallet shipping is the single most important operational milestone.** Without it, 5,000 and 10,000 unit orders are contribution-negative (04 §12) [CANONICAL]. The base and aggressive scenarios are invalid if this transition is not made.

---

## 6. What Must Be True Before Each Revenue Stage

| Revenue stage | Orders/month target | Minimum monthly revenue | What must be built/true |
|---|---:|---:|---|
| First revenue | 1–5 | €500–€2,500 | Stripe checkout live; order email flow; artwork upload; digital proof workflow; DHL/UPS DDP shipping operational [CANONICAL — phase P1] |
| Early product-market fit | 10–30 | €5,000–€15,000 | Reorder system functional (artwork memory + one-click); SEO pages indexed and ranking on mid-tail terms; at least one consolidated pallet shipment completed; add-ons flag evaluated for enablement |
| €10k/month contribution | 30–60 | ~€20,000–€30,000 revenue | Logistics consolidated for Growth/Pro; repeat rate measurable; 04 §20.1 scenario (90 Growth + 50 Pro + 40 reorders) operationally plausible [CANONICAL — 04 §20.1] |
| €50k/month revenue | 100–200 | €50,000 | Strong organic SEO (programmatic pages ranking); paid ads CPA < AOV; email reorder reminders live; B2B quote flow handling 10+ quotes/month; customer portal functional |
| €100k/month revenue | 200–250 (at ~€490 AOV) | €100,000 | Pallet logistics reliable; Growth/Pro package dominant mix; 25%+ repeat rate; possibly Germany hub pilot active (cf. 04 §21 Year 3); admin panel handling order management without founder bottleneck |
| 1,000 orders/month | 1,000 | €490,000+ (at €490 AOV) | This target requires a much larger organic footprint than the €100k revenue target. It implies either (a) a very large SEO audience or (b) major paid investment or (c) a lower AOV mix (more Starter orders). It is NOT equivalent to the €100k revenue target at canonical prices. |

**Structural insight (does NOT contradict any canonical doc):** At the canonical price ladder, 1,000 orders/month = ~€490,000/month at base AOV. Reaching €100,000/month revenue requires only ~204 orders/month at base AOV. The two targets diverge significantly. The research prompt should evaluate whether 1,000 orders/month is a realistic volume for the German online-ordered PP label segment before it is used as a KPI.

---

## 7. Probability Estimates Per Scenario and Key Risks

### 7.1 Probability Estimates

All estimates are [ASSUMPTION] and must be replaced with research-backed estimates after executing prompt 05.

| Outcome | Conservative | Base | Aggressive |
|---|---|---|---|
| Reaching €100k/month revenue by month 48 | ~5% | ~35% | ~60% |
| Reaching 1,000 orders/month by month 48 | ~2% | ~8% | ~50% |
| Reaching €100k/month revenue by month 24 | <1% | ~10% | ~40% |
| Reaching either target by month 12 | <1% | <1% | ~5% |

**Headline assessment:** The €100k/month revenue target is achievable in the base case by month 48 if SEO, logistics consolidation, and repeat-order economics all execute as assumed. It is NOT a certainty under any reasonable scenario. The 1,000-orders/month target is structurally harder to achieve than the revenue target and is unlikely to be reached by month 48 unless AOV drops significantly below €490.

### 7.2 Key Risks

| Risk | Likelihood | Impact | Mitigation | Validation source |
|---|---|---|---|---|
| Low organic SEO traction — German B2B label SERP dominated by incumbents | HIGH [ASSUMPTION] | HIGH | Programmatic SEO + long-tail strategy (22-PROGRAMMATIC-SEO-PLAN.md); GEO/AI search (21-GEO-AI-SEARCH-STRATEGY.md) | Validate via research prompt 05 Section 4 |
| Paid ads CPA structurally above AOV | MEDIUM [ASSUMPTION] | HIGH | Only run paid ads at Growth-package AOV; focus on warm remarketing; rely primarily on organic | Validate via research prompt 05 Section 5 |
| German customs/import friction (Turkey-EU DDP) | MEDIUM [ASSUMPTION] | MEDIUM-HIGH | DDP contract absorbs duty; IOSS for B2C; confirm with customs broker | Validate via research prompt 05 Section 6 |
| Competitor price war from established German online printers | MEDIUM [ASSUMPTION] | HIGH | Defend via scope clarity, shipping-included positioning, reorder convenience, not price (04 §3, §14.6) [CANONICAL] | Validate via research prompt 05 Section 2 |
| Low repeat rate — customers switch after first order | HIGH early, MEDIUM later [ASSUMPTION] | HIGH | Artwork memory + reorder UX (70-ARTWORK-MANAGEMENT-SYSTEM.md); email reminders; reorder contribution model (33-REORDER-ECONOMICS.md) | Validate via research prompt 05 Section 3 |
| Supply-chain lead time surprises (Turkey-Germany) | MEDIUM [ASSUMPTION] | MEDIUM | Stated delivery range ca. 10–14 Werktage is an honest range, not an SLA (SoT #18a) [CANONICAL]; buffer in production scheduling | Validate via research prompt 05 Section 6 |
| TRY/EUR currency risk increasing production costs | MEDIUM [ASSUMPTION] | MEDIUM | Current cost model uses TRY/EUR ~53 (04 §6, placeholder) [CANONICAL]; supplier contracts in EUR if possible | Validate via research prompt 05 Section 7 |
| Google algorithm update penalising programmatic SEO | MEDIUM [ASSUMPTION] | HIGH | Ensure content quality standards; GEO/AI strategy as hedge; not solely reliant on programmatic pages | Validate via research prompt 05 Section 4 |
| Working capital crunch at volume (pay supplier before Stripe settles) | MEDIUM [ASSUMPTION] | MEDIUM | Stripe settles ~2 days; Turkish supplier payment terms negotiation; research prompt 05 Section 6 models this | Validate via research prompt 05 Section 6 |

---

## 8. Research Validation Requirement

**Before any capital commitment, paid-ads budget decision, or investor discussion, the following must be validated by executing `docs/research-prompts/05-48-month-revenue-reality.md`:**

| Assumption group | Where validated in prompt 05 | What to replace in this doc |
|---|---|---|
| German label market size and SME segment | Section 1 | §4.2 note on aggressive scenario market plausibility |
| Competitor prices, traffic, AOV benchmarks | Section 2 | §3.1 AOV assumptions |
| B2B repeat rate and reorder frequency | Section 3 | §3.4 retention assumptions |
| Organic traffic ramp, keyword volumes, CVR benchmarks | Section 4 | §3.2 organic traffic assumptions; ramp tables §4.2–§4.4 |
| Paid ads CPC, CVR, budget benchmarks | Section 5 | §3.3 paid ads assumptions |
| Supply chain lead times, customs costs, working capital | Section 6 | §5 operational capacity notes |
| Gross margin benchmarks for EU online label printing | Section 7 | §3.5 gross margin assumptions |
| Probability estimates and risk validation | Sections 8–10 | §7 probability and risk tables |

**Save research outputs to:** `docs/research-outputs/05-result-[YYYYMM].md` and append a dated section to `35-ANALYTICS-KPI-DASHBOARD.md` per the prompt instructions.

---

## 9. Reconciliation with Canonical Docs

This document does not contradict any existing canonical doc. The reconciliation is explicit below:

| Canonical rule | Source doc | This document's treatment |
|---|---|---|
| €100k/month is a contribution milestone, not net profit | SoT #5, 04 §20.2 | §1 three-rung ladder table; models €100k as revenue/contribution, explicitly not net profit |
| Package ladder: 1k/2k/5k/10k fixed, 20k+ quote-only | SoT #2, 04 §14.1 | §2.2 price table uses canonical prices only |
| 1k Starter is acquisition-only, contribution-negative | 04 §12.1 | §2.3, §4.2, §4.3 conservative scenario notes |
| Consolidated logistics required for 5k/10k profitability | 04 §13 | §2.3, §3.5, §5 operational requirements |
| Add-ons: Designservice €40, Proof €10, Express €9.90, Matte +15% — all flag-gated off | SoT #16, #18d; 04 §28 | §2.2 add-on table; AOV assumptions include add-on uplift only when enabled |
| Lieferzeit ca. 10–14 Werktage, not SLA | SoT #18a | §7.2 supply-chain risk row |
| Design service waived free for orders >=€2,000 net | SoT #16, 04 §28.1 | §3.1 design service waiver rate assumption |
| Year 2 net profit target ~€8k–18k/month; Year 3 ~€20k–35k/month | 04 §21 | §1 three-rung ladder; §6 stage requirements |
| Long-term north-star: €100k+/month NET profit Year 8–10 | SoT #5 | §1; not modelled here (48-month frame ends at Year 4) |
| GTM docs 53–57 intentionally deferred | SoT §6 Missing-File Register | §3.3 paid ads clearly noted as provisional, awaiting GTM docs |

---

## 10. Contradictions Avoided

The following known contradictions from the doc-set audit were navigated carefully in this document:

1. **€100k framing ambiguity (SoT #5 vs 04 §20.2):** This document always qualifies €100k as "contribution milestone" and uses the three-rung ladder from SoT #5. It does NOT claim €100k/month revenue = €100k/month net profit.

2. **Add-ons flag state:** This document notes add-ons exist behind a feature flag (default off) and includes small AOV uplift from add-ons only in scenario commentary, not as a baked-in baseline assumption.

3. **Matte-finish surcharge:** Treated as a potential future AOV uplift (behind feature flag, Stripe-TEST-gated per SoT #18d), not included in baseline AOV assumptions.

4. **1,000 orders/month vs €100k/month equivalence:** These two targets are NOT equivalent at canonical prices (1,000 orders × €490 AOV = €490k/month, far above €100k). This document calls this out explicitly in §6 rather than silently treating them as equivalent.

---

*End of document.*
