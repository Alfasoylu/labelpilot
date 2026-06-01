# RECONCILIATION-REPORT.md

# Labelpilot.de — Reconciliation Report

## 1. Purpose

This report records the documentation conflicts found during the full `/docs` review.

Resolution rule:

- Mechanical and filename-level conflicts can be resolved directly.
- Business, pricing, scope, or policy conflicts that require founder intent stay open.

This report does not delete history.

It records what must be decided before application implementation begins.

---

## 2. Conflict Table

| ID | Files | Conflict | Proposed Resolution | Open Question |
|---|---|---|---|---|
| R-001 | `20-SEO-STRATEGY-2026.md`, `20-SEO-STRATEGY-2026(1).md` | Canonical filename pointed to a short stub while the full strategy lived in a `(1)` duplicate. | Resolved mechanically: copy full content into canonical filename and delete `(1)` duplicate. | No |
| R-002 | `21-GEO-AI-SEARCH-STRATEGY.md`, `21-GEO-AI-SEARCH-STRATEGY(1).md` | Canonical filename pointed to a short stub while the full strategy lived in a `(1)` duplicate. | Resolved mechanically: copy full content into canonical filename and delete `(1)` duplicate. | No |
| R-003 | `03-PRODUCT-STRATEGY.md`, `03-PRODUCT-STRATEGY-v2.md`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Two product strategy generations coexist; many docs still reference the non-v2 filename. | Treat `03-PRODUCT-STRATEGY-v2.md` as authoritative, retain v1 for history, mark both with authority banners, document precedence in manifest. | No |
| R-004 | `12-DATABASE-SCHEMA.md`, `12-DATABASE-SCHEMA-v2.md`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | v1 and v2 schema docs coexist; many downstream docs still cite v1. | Treat `12-DATABASE-SCHEMA-v2.md` as authoritative, retain v1 for history, mark both with authority banners. | No |
| R-005 | `19-CUSTOMER-PORTAL.md`, `19-CUSTOMER-PORTAL-v2.md`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | v1 portal focuses on orders/files/proof; v2 redefines portal around stored designs, reminders, company accounts, and variable data. | Treat `19-CUSTOMER-PORTAL-v2.md` as authoritative, retain v1 for history, mark both with authority banners. | No |
| R-006 | `67-PHASE-6-REORDER-SYSTEM.md`, `67-PHASE-6-REORDER-SYSTEM-v2.md`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | v1 reorder is order-centric; v2 reorder is stored-design-centric and adds refill logic and variable data. | Treat `67-PHASE-6-REORDER-SYSTEM-v2.md` as authoritative, retain v1 for history, mark both with authority banners. | No |
| R-007 | `62..69`, `43..51`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Two incompatible phase-numbering schemes exist. Legacy docs say GEO is Phase 7 and lead flow is Phase 8; `74` says GEO foundation is Phase 2 and lead flow is Phase 3. | Adopt `74` as canonical sequencing and map legacy files into that scheme in `00-SOURCE-OF-TRUTH.md`. | No |
| R-008 | `44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md`, `22-PROGRAMMATIC-SEO-PLAN.md`, `68-PHASE-7-GEO-CONTENT-ENGINE.md`, `69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md` | They reference `63-PHASE-2-SEO-FOUNDATION.md`, which does not exist. | Register as missing in `00-SOURCE-OF-TRUTH.md`; do not invent content silently. | Yes — should a new `63-PHASE-2-SEO-FOUNDATION.md` be created, or should the canonical Phase 2 live only in `74` plus prompt `44`? |
| R-009 | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | References missing docs: `53`, `54`, `55`, `56`, `57`. | Register missing-file dependencies in `00-SOURCE-OF-TRUTH.md`. | Yes — are these docs intentionally omitted, or should they be created before GTM work begins? |
| R-010 | `10-TECH-STACK.md` | References missing docs `75-VERCEL-DEPLOYMENT-GUIDE.md` and `70-QA-CHECKLIST.md`, while actual filenames are `40-VERCEL-DEPLOYMENT-CHECKLIST.md` and `37-QA-TESTING-CHECKLIST.md`. | Treat as stale references; track in manifest/report. | Yes — should `10-TECH-STACK.md` be updated later to the existing filenames, or do you want replacement docs with the referenced names? |
| R-011 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `39-REPO-SETUP-AND-FOLDER-STRUCTURE.md` | Route-group naming drift: `/(marketing)` and `/(customer)` vs `/(public)` and `/(account)`. | Canonicalize route-group ownership under `11-ARCHITECTURE.md` and `39-REPO-SETUP-AND-FOLDER-STRUCTURE.md`; record as unresolved naming drift until source docs are updated. | Yes — do you want `/(public)` + `/(account)` as the final naming, or should `10-TECH-STACK.md` remain the naming source? |
| R-012 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `15-STRIPE-PAYMENT-FLOW.md`, `45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md`, `64-PHASE-3-STRIPE-ORDER-FLOW.md` | API route naming drift: `/api/stripe/create-checkout-session` vs `/api/checkout/create-session`; `/api/webhook` vs `/api/stripe/webhook` patterns. | Keep as open route-contract conflict; implementation should not begin until a single API path scheme is chosen. | Yes — which checkout route namespace is canonical? |
| R-013 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `13-ENVIRONMENT-VARIABLES.md` | Env var naming drift: `NEXT_PUBLIC_SITE_URL` vs `NEXT_PUBLIC_APP_URL`. | Treat `13-ENVIRONMENT-VARIABLES.md` as env winner in manifest; keep conflict open until older doc references are updated. | Yes — should the canonical public base URL var be `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`, or both? |
| R-014 | `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, `13-ENVIRONMENT-VARIABLES.md` | Auth/storage decision drift: “Supabase Auth initially” vs “Supabase Auth or Clerk”; “Supabase Storage initially” vs “Supabase Storage or UploadThing”. | Treat `10-TECH-STACK.md` as the stack-selection winner and `11/13` as flexibility notes unless deliberately revised. | Yes — do you want to keep Supabase-first as a locked decision, or reopen Auth/Storage choice? |
| R-015 | `30-PRODUCT-CATALOG.md`, `10-TECH-STACK.md`, `11-ARCHITECTURE.md`, SEO docs | Product slug and page ownership drift: product config slugs such as `pp-etiketten-100x200` and `transparente-pp-etiketten-100x200` do not match SEO landing routes like `/de/opake-pp-etiketten` and `/de/transparente-pp-etiketten`. | Use `30-PRODUCT-CATALOG.md` for product IDs and internal slugs, `23/24/26` for SEO URL ownership and canonical behavior. | Yes — should internal product slugs and SEO routes intentionally differ, or should they be unified? |
| R-016 | `62-PHASE-1-MVP.md`, `10-TECH-STACK.md`, `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Scope drift: `62` says Phase 1 excludes Stripe, upload, admin, portal; `10` frames these as MVP modules; `74` splits them into later phases. | Canonical interpretation should follow `74`: “Phase 1” is only the public MVP lead-capture slice, not the full operational MVP. | Yes — should “MVP” mean the public lead-capture launch only, or the first fully transactable product? |
| R-017 | `03-PRODUCT-STRATEGY-v2.md`, `19-CUSTOMER-PORTAL-v2.md`, `30-PRODUCT-CATALOG.md`, `59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md` | Quantity-package drift: v2 docs mention `2.000` reorder examples, while the catalog and pricing model standardize on `1,000 / 5,000 / 10,000 / 20,000+`. | Treat fixed package rules in `30` and `04` as commercial defaults; leave `2,000` as unresolved business option. | Yes — should `2,000` become an official reorder/package tier? |
| R-018 | `04-PRICING-AND-MARGIN-MODEL.md`, `59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md` | Transparent PP pricing drift: pricing model shows Growth transparent PP at `€429`, while research doc proposes `€449`; research also adds a `2,000` “Reorder Ready” tier absent from pricing model and catalog. | Keep both values visible and log as open pricing decision; do not silently normalize. | Yes — choose transparent PP Growth price and whether the `2,000` tier is real. |
| R-019 | `00-PROJECT-BRIEF.md`, `01-BUSINESS-MODEL.md`, `04-PRICING-AND-MARGIN-MODEL.md`, `67-PHASE-6-REORDER-SYSTEM-v2.md` | Profit framing drift: docs mix “monthly net profit”, “gross contribution”, “contribution profit”, and “path to €100k/month net profit”. | Keep all references but require a founder decision on the north-star financial metric. | Yes — is the target `€100k` net profit, contribution profit, or another KPI? |
| R-020 | `16-ORDER-FLOW.md`, `17-FILE-UPLOAD-AND-PROOFING.md`, `19-CUSTOMER-PORTAL.md`, `11-ARCHITECTURE.md` | Status drift: `CORRECTION_REQUIRED` appears in customer messaging and file workflows, but order/file/proof status boundaries are inconsistently expressed across docs. | Treat `ArtworkFile` / file-review status and `Order` status as separate systems unless normalized later. | Yes — should `CORRECTION_REQUIRED` be an order status, a file status only, or both? |
| R-021 | `19-CUSTOMER-PORTAL-v2.md`, `03-PRODUCT-STRATEGY-v2.md` | Customer-facing German-only rule is stated globally, but v2 docs still contain Turkish UI examples and mixed-language examples inside public-facing label lists. | Do not use those strings in product implementation; keep docs as historical notes for now and flag for future cleanup. | Yes — should mixed-language explanatory lines be cleaned from all v2 docs in a follow-up pass? |
| R-022 | `AGENTS.md` instructions vs docs set | Ads landing page governance for `/teklif/*` exists in workspace instructions, but the current docs set is German `/de/*` oriented and does not document the `/teklif/*` noindex/non-sitemap rule. | Record as documentation gap; no implementation should assume the Ads landing-page rule is already covered by docs. | Yes — should a dedicated landing-page governance doc be added to the docs set? |

---

## 3. Mechanical Changes Already Applied

| Change | Status |
|---|---|
| Consolidated `20-SEO-STRATEGY-2026.md` with full SEO strategy content | Done |
| Consolidated `21-GEO-AI-SEARCH-STRATEGY.md` with full GEO strategy content | Done |
| Removed duplicate `(1)` SEO/GEO files after consolidation | Done |
| Added source-of-truth manifest | Done |

---

## 4. Open Questions Requiring Owner Decision

1. Should `63-PHASE-2-SEO-FOUNDATION.md` be created, or should canonical Phase 2 stay represented only by `74` plus prompt `44`?
2. Should the missing GTM docs `53`, `54`, `55`, `56`, `57` be created now, or intentionally removed from references?
3. Should stale references in `10-TECH-STACK.md` be updated to existing docs, or should replacement docs be created under the referenced names?
4. Which route-group naming is final: `/(public)` + `/(account)` or `/(marketing)` + `/(customer)`?
5. Which checkout API namespace is final: `/api/stripe/create-checkout-session` or `/api/checkout/create-session`?
6. Which public base URL env var name is final: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`, or both?
7. Is Supabase-first a locked stack decision, or do you want Auth/Storage reopened as real alternatives?
8. Should internal product slugs and public SEO routes intentionally differ, or should they be unified?
9. Does “MVP” mean only the public lead-capture launch, or the first fully transactable order system?
10. Should `2,000` become an official reorder/package tier?
11. What is the final transparent PP Growth price: `€429`, `€449`, or another value?
12. What is the north-star financial target: `€100k` net profit, contribution profit, or a different measure?
13. Should `CORRECTION_REQUIRED` exist only as a file status, or also as an order status?
14. Should mixed-language explanatory lines be cleaned from the v2 docs in a separate pass?
15. Should the `/teklif/*` Ads landing-page governance rule be formalized inside `/docs`?

---

## 5. Recommendation Before Any Code Work

Do not start implementation until the following are decided:

1. Canonical phase numbering is accepted.
2. Missing doc strategy is accepted.
3. Route/API/env naming decisions are accepted.
4. Pricing/package open questions are answered.

Without those answers, code generation will hard-code unresolved document drift.
