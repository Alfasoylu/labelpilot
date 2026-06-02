# RECONCILIATION-REPORT.md

# Labelpilot.de - Reconciliation Report

## 1. Purpose

This report records the conflicts found during the `/docs` reconciliation passes.

Resolution rule:

- Mechanical conflicts are fixed directly in the docs.
- Owner-decided business conflicts move to the resolved register.
- Anything still ambiguous stays open and must not be guessed in implementation.

---

## 2. Resolved

| ID | Files | Conflict | Resolution |
|---|---|---|---|
| R-001 | `20-SEO-STRATEGY-2026.md`, `20-SEO-STRATEGY-2026(1).md` | Canonical filename pointed to a stub while the full strategy lived in a duplicate. | Full strategy moved into the canonical filename and the duplicate was removed. |
| R-002 | `21-GEO-AI-SEARCH-STRATEGY.md`, `21-GEO-AI-SEARCH-STRATEGY(1).md` | Canonical filename pointed to a stub while the full strategy lived in a duplicate. | Full strategy moved into the canonical filename and the duplicate was removed. |
| R-003 | `03-PRODUCT-STRATEGY.md`, `03-PRODUCT-STRATEGY-v2.md`, `74-...` | Version drift between v1 and v2 product strategy docs. | `03-PRODUCT-STRATEGY-v2.md` is authoritative; banners and manifest updated. |
| R-004 | `12-DATABASE-SCHEMA.md`, `12-DATABASE-SCHEMA-v2.md`, `74-...` | Version drift between v1 and v2 schema docs. | `12-DATABASE-SCHEMA-v2.md` is authoritative; canonical status additions recorded in both schema docs. |
| R-005 | `19-CUSTOMER-PORTAL.md`, `19-CUSTOMER-PORTAL-v2.md`, `74-...` | Version drift between v1 and v2 portal docs. | `19-CUSTOMER-PORTAL-v2.md` is authoritative; banners and manifest updated. |
| R-006 | `67-PHASE-6-REORDER-SYSTEM.md`, `67-PHASE-6-REORDER-SYSTEM-v2.md`, `74-...` | Version drift between v1 and v2 reorder docs. | `67-PHASE-6-REORDER-SYSTEM-v2.md` is authoritative; banners and manifest updated. |
| R-007 | `62..69`, `43..51`, `74-...` | Two incompatible phase-numbering schemes existed. | Canonical phase order is now the timeline in `74`; mapping table and per-file canonical phase headers were added. |
| R-008 | `44`, `68`, `69`, `22` | `63-PHASE-2-SEO-FOUNDATION.md` was referenced but missing. | `63-PHASE-2-SEO-FOUNDATION.md` was created and the canonical phase mapping now points to it. |
| R-009 | `74-...`, `00-SOURCE-OF-TRUTH.md` | Missing GTM docs `53/54/55/56/57` looked blocking. | They are now explicitly marked as future / not yet written and non-blocking. |
| R-010 | `10-TECH-STACK.md` | Stale references pointed at non-existent deployment and QA docs. | References now point to `40-VERCEL-DEPLOYMENT-CHECKLIST.md` and `37-QA-TESTING-CHECKLIST.md`. |
| R-011 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `39-REPO-SETUP-AND-FOLDER-STRUCTURE.md` | Route-group naming drift: `/(marketing)` and `/(customer)` vs `/(public)` and `/(account)`. | Canonical route groups are now `(public)`, `(account)`, and `(admin)`. |
| R-012 | `10-TECH-STACK.md`, `15-STRIPE-PAYMENT-FLOW.md`, `45`, `64` | Checkout API path drift. | Canonical checkout route is `/api/checkout/create-session`; webhook remains `/api/stripe/webhook`. |
| R-013 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `13-ENVIRONMENT-VARIABLES.md` | Env var naming drift: `NEXT_PUBLIC_SITE_URL` vs `NEXT_PUBLIC_APP_URL`. | Canonical public URL env var is `NEXT_PUBLIC_APP_URL`. |
| R-014 | `10`, `11`, `13`, `14`, `17` | Auth/storage decision drift: Supabase vs Clerk / UploadThing. | MVP path is locked to Supabase Auth + Supabase Storage; alternatives remain documented only as inactive options. |
| R-015 | `04`, `30`, `31`, `45`, `59` | Package ladder drift and transparent/opaque duplication in catalog/research docs. | Canonical package ladder is `1,000 / 2,000 / 5,000 / 10,000`, with the commercial table owned by `04-PRICING-AND-MARGIN-MODEL.md`. |
| R-016 | `00`, `04`, `59` | Transparent PP Growth price drift and later owner-approved price-level raise. | Earlier candidates `€429` / `€449` were superseded by the owner-approved canonical ladder; transparent PP Growth is now `€519` net, with old research values retained only for audit history. |
| R-017 | `00`, `01`, `04`, `67-v2` | Profit framing drift around the `€100k` north-star. | `€100k` is a three-rung ladder: long-term north-star = `€100k/month NET` (~Year 8–10); the `04 §20.2` `€100k` figure is a contribution milestone; interim net targets are the Year 2–3 ranges. The long-term net north-star must not be relabeled to contribution. |
| R-020 | `00-SOURCE-OF-TRUTH.md`, `04-PRICING-AND-MARGIN-MODEL.md`, `59-...` | Transparent PP `2,000` price and the wider package level were previously provisional / lower. | Owner-approved raise superseded the earlier provisional level; transparent PP `2,000` is now `€309` net, and the canonical ladder changed from opaque `149/229/399/699` and transparent `169/254/429/749` to opaque `179/279/479/799` and transparent `199/309/519/849`. |
| R-018 | `12`, `15`, `16`, `17`, `18`, `19` | Status drift around `CORRECTION_REQUIRED`, `PAYMENT_FAILED`, `ON_HOLD`, `QUOTE_REQUESTED`, and payment event field naming. | Canonical `OrderStatus` and `stripeEventId` naming were aligned across the schema and workflow docs. |
| R-019 | `20-SEO-STRATEGY-2026.md`, `26-SITEMAP-ROBOTS-CANONICAL.md` | Ads landing-page governance was undocumented in the docs set. | `/lp/[slug]` is now formalized as German-only, `noindex`, excluded from sitemap, and never a canonical winner. |

---

## 3. Open

| ID | Files | Conflict | Current Best Resolution | Open Question |
|---|---|---|---|---|
| O-002 | `04-PRICING-AND-MARGIN-MODEL.md`, `15-STRIPE-PAYMENT-FLOW.md`, `29-LEGAL-PAGES-GERMANY.md`, `75-EARLY-WARNING-SYSTEM.md` | VAT / IOSS / import handling is discussed, but the final operational model is not locked. | Keep tax and import notes descriptive only; do not hardcode one cross-border billing model in implementation. | What is the final Germany/EU VAT and import-handling model for checkout and invoicing? |
| O-003 | `29-LEGAL-PAGES-GERMANY.md`, `75-EARLY-WARNING-SYSTEM.md` | VerpackG / LUCID packaging compliance is referenced as a risk, not an approved operating rule. | Keep compliance references visible; do not claim compliance flows that are not confirmed. | What is the exact VerpackG / LUCID process and when does it become a launch gate? |
| O-004 | `29-LEGAL-PAGES-GERMANY.md`, `75-EARLY-WARNING-SYSTEM.md` | Lead-time / delivery-time promises are mentioned but not fixed as a canonical commercial SLA. | Avoid hard promises in implementation until an operational SLA is approved. | What delivery-time promise should appear on product, checkout, and legal pages? |
| O-005 | `03-PRODUCT-STRATEGY-v2.md`, `12-DATABASE-SCHEMA-v2.md`, `19-CUSTOMER-PORTAL-v2.md`, `58-COMPETITOR-LANDSCAPE-GERMANY.md`, `67-PHASE-6-REORDER-SYSTEM-v2.md`, `75-EARLY-WARNING-SYSTEM.md` | Net 14 exists as a future capability, but the commercial credit-risk policy is not fully locked. | Keep Net 14 gated and non-default; do not broaden eligibility rules in code until the policy is approved. | What are the final Net 14 eligibility, credit-limit, and approval rules? |
| O-006 | `04-PRICING-AND-MARGIN-MODEL.md`, `15-STRIPE-PAYMENT-FLOW.md`, `29-LEGAL-PAGES-GERMANY.md` | Company structure and billing model assumptions affect invoicing, VAT handling, and payment terms. | Keep wording implementation-neutral. | What is the final corporate / invoicing structure that the docs should optimize around? |
| O-007 | `03-PRODUCT-STRATEGY-v2.md`, `19-CUSTOMER-PORTAL-v2.md` | Mixed-language explanatory examples remain in authoritative v2 docs. | Do not use those strings in product implementation; treat them as doc cleanup debt. | Should the remaining Turkish mixed-language examples be cleaned in a dedicated follow-up pass? |

---

## 4. Notes

1. `00-SOURCE-OF-TRUTH.md` is now the master manifest for precedence and owner-locked decisions.
2. `04-PRICING-AND-MARGIN-MODEL.md` is the canonical commercial price table.
3. `20-SEO-STRATEGY-2026.md` and `26-SITEMAP-ROBOTS-CANONICAL.md` now jointly own `/lp/[slug]` campaign landing-page governance.
4. The remaining open items above should be answered before any implementation hardcodes tax, delivery, or credit-policy behavior.
