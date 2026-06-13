# Labelpilot.de — Launch Gap Audit (Open Items Only)
**Date:** 2026-06-09 | **Last updated:** 2026-06-11
**Status:** Revenue-capable MVP is live. Items below are the remaining gaps.

---

## Blocking Before Google Ads Spend

| # | Item | Owner | Effort |
|---|------|-------|--------|
| 1 | **Google Ads AW- conversion tag** — CODE READY (2026-06-11): `gtagPurchase` fires the Ads conversion (guarded), `begin_checkout` fires in the live Kalkulator funnel, `generate_lead` on quote submit. Remaining is founder-side: create the conversion action in Google Ads console and set `NEXT_PUBLIC_ADS_CONVERSION_ID` + `NEXT_PUBLIC_ADS_CONVERSION_LABEL_PURCHASE` in Vercel. | Founder | env only |
| 2 | **Google Ads campaigns** — No campaigns exist yet. Cannot spend until the conversion env vars (item 1) are set and tested. | Founder | — |
| 3 | **EMAIL_FROM env var** — Set `bestellungen@labelpilot.de` in Vercel Dashboard. Affects order confirmation and transactional email sender identity. (.env.example default already updated.) | Founder | 5 min |

---

## Founder Action Required

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4 | **LUCID registration (VerpackG)** | Pending | As DDP importer shipping PP label rolls to Germany, LUCID registration is required. Register at lucid.verpackungsregister.org — ~30 min, can be done personally or as Alfa Soylu Elektronik. No intermediary needed. |
| 5 | **1,000-unit tier gross margin** | Unverified | Call Turkish production partner. Calculate: (production cost/1K units + DDP shipping) vs. Stripe price for 1K tier. If margin <20%, either reprice or reframe as "Testmenge" with a premium. Do before scaling Ads spend to 1K-tier keywords. |
| 6 | **DMARC escalation** | Scheduled | p=none → p=quarantine approximately late July 2026 (4–6 weeks after DMARC record was added in early June). Check Google Postmaster Tools for report data before escalating. |

---

## Implement Later

| Item | Reason deferred | When to revisit |
|------|----------------|----------------|
| **Lawyer review of AGB** | Code is B2B-only, Widerruf removed. Actual lawyer hasn't reviewed yet. Risk is low now but should be done before scaling. | After first 5 paying customers |
| **Auf Rechnung / B2B invoice payment** (Klarna B2B, Billie) | German B2B buyers prefer Rechnung. Not self-serve today. Manual admin approval flow exists as workaround. | After first 10 orders |
| **Trusted Shops badge** | Requires existing review base and application process. | After first revenue / first reviews |
| **Custom size / Wunschformat self-serve** | Feature flag off (`NEXT_PUBLIC_FEATURE_CUSTOM_SIZE=false`). Code exists. | After pricing engine is validated with real orders |
| **Variable data self-serve** | Admin-side exists. Customer self-serve is Phase 3+. | Post first 10 orders |

---

*Resolved items (GA4, Consent Mode v2, purchase/begin_checkout/lead events, ADDONS flag, SellerTrustBlock, AGB B2B-only, Widerruf, Impressum/Datenschutz Alfa Soylu, /de/versand page, delivery time, SEO/schema, all landing pages, ratgeber, Über uns) are removed from this document.*
