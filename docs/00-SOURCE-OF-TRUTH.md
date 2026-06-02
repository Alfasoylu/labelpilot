# 00-SOURCE-OF-TRUTH.md

# Labelpilot.de — Source of Truth Manifest

## 1. Purpose

This document is the canonical reconciliation manifest for the Labelpilot.de docs set.

Use it to answer four questions before implementation starts:

1. Which versioned file is authoritative?
2. Which phase numbering scheme is canonical?
3. Which referenced files are missing from disk?
4. Which document wins when two documents disagree?

This file does not replace domain documents.

It defines precedence and routing between them.

---

## 2. Global Precedence Rule

Use this order when resolving conflicts:

1. `00-SOURCE-OF-TRUTH.md`
2. `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`
3. Explicit `-v2` files over their same-topic non-`-v2` predecessors
4. Domain source-of-truth docs listed in Sections 3 and 6 of this file
5. Phase docs
6. Execution prompts

Execution prompts must never override business, product, pricing, SEO, or architecture source docs.

If a prompt conflicts with a source doc, the source doc wins and the prompt must be treated as stale.

---

## 3. Authoritative Version Table

The default version rule from `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` is confirmed:

- `-v2` supersedes the same-topic earlier file where both exist.
- Older files are retained for history only unless this table says otherwise.

| Topic | Authoritative File | Superseded File | Status | Notes |
|---|---|---|---|---|
| Product strategy | `03-PRODUCT-STRATEGY-v2.md` | `03-PRODUCT-STRATEGY.md` | Confirmed | `74` explicitly upgrades v2. |
| Database schema | `12-DATABASE-SCHEMA-v2.md` | `12-DATABASE-SCHEMA.md` | Confirmed | `74` explicitly upgrades v2. |
| Customer portal | `19-CUSTOMER-PORTAL-v2.md` | `19-CUSTOMER-PORTAL.md` | Confirmed | `74` explicitly upgrades v2. |
| Reorder system | `67-PHASE-6-REORDER-SYSTEM-v2.md` | `67-PHASE-6-REORDER-SYSTEM.md` | Confirmed | `74` explicitly upgrades v2. |
| SEO strategy | `20-SEO-STRATEGY-2026.md` | `20-SEO-STRATEGY-2026(1).md` | Consolidated | Full content moved into canonical filename; `(1)` file removed. |
| GEO / AI search strategy | `21-GEO-AI-SEARCH-STRATEGY.md` | `21-GEO-AI-SEARCH-STRATEGY(1).md` | Consolidated | Full content moved into canonical filename; `(1)` file removed. |

Related single-file authoritative docs named as high-priority by `74`:

| Topic | Authoritative File | Status |
|---|---|---|
| Artwork management | `70-ARTWORK-MANAGEMENT-SYSTEM.md` | Authoritative module doc |
| Variable data automation | `71-VARIABLE-DATA-AUTOMATION.md` | Authoritative module doc |
| Template library and canvas editor | `72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md` | Authoritative module doc |
| GEO / SEO implementation tips | `73-2026-EXPERT-GEO-SEO-TIPS.md` | Authoritative advisory doc |
| Master backlog and sequencing | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Authoritative phase and release sequencing doc |

---

## 4. Canonical Phase Scheme

The canonical phase scheme is the ordering declared in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.

The older `62..69` / `43..51` scheme is retained only as legacy file numbering.

### 4.1 Canonical Phase Table

| Canonical Phase # | Name | Phase Doc | Execution Prompt | Status |
|---|---|---|---|---|
| 0 | Repository and planning setup | None | None | Canonical in `74`; no dedicated numbered phase doc or prompt exists. This reconciliation task serves as the docs-only precursor. |
| 1 | Public MVP lead capture | `62-PHASE-1-MVP.md` | `43-CODEX-PHASE-1-EXECUTION-PROMPT.md` | Aligned. Prompt still cites some superseded inputs by legacy filename. |
| 2 | SEO / GEO foundation | `63-PHASE-2-SEO-FOUNDATION.md` | `44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md` | Canonical phase doc now exists. Legacy GEO assets `68` and `49` still overlap this scope but retain legacy numbering. |
| 3 | Leads, analytics and GTM readiness | Missing | `50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md` | Mismatch: canonical Phase 3 exists in `74`, but only a legacy “Phase 8” prompt exists. No dedicated numbered phase doc exists. |
| 4 | Stripe fixed package checkout | `64-PHASE-3-STRIPE-ORDER-FLOW.md` | `45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md` | Mismatch: content aligns to canonical Phase 4, but legacy files are numbered Phase 3. |
| 5 | Artwork management v1 | No dedicated numbered phase doc; supporting doc `70-ARTWORK-MANAGEMENT-SYSTEM.md` | None | Mismatch: canonical Phase 5 exists in `74`, but the numbered phase file set jumps from 4 to 5 Admin. |
| 6 | Admin operations | `66-PHASE-5-ADMIN-PANEL.md` | `47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md` | Mismatch: content aligns to canonical Phase 6, but legacy files are numbered Phase 5. |
| 7 | Reorder v2 | `67-PHASE-6-REORDER-SYSTEM-v2.md` | `48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md` | Mismatch: canonical Phase 7 uses legacy Phase 6 files. Prompt still points at v1 portal and reorder docs. |
| 8 | Refill reminders | No dedicated phase doc; supporting material is embedded in `67-PHASE-6-REORDER-SYSTEM-v2.md` and `12-DATABASE-SCHEMA-v2.md` | None | Missing dedicated phase doc and prompt. |
| 9 | Variable data automation | No dedicated numbered phase doc; supporting doc `71-VARIABLE-DATA-AUTOMATION.md` | None | Missing dedicated phase doc and prompt. |
| 10 | B2B account portal | No dedicated numbered phase doc; supporting docs `14-AUTH-AND-ACCOUNTS.md` and `19-CUSTOMER-PORTAL-v2.md` | None | Missing dedicated phase doc and prompt. |
| 11 | Template library MVP | No dedicated numbered phase doc; supporting doc `72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md` | None | Missing dedicated phase doc and prompt. |
| 12 | Programmatic expansion | Missing | `51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md` | Canonical in `74`; execution prompt exists, dedicated phase doc does not. |

### 4.2 Legacy File Mapping Notes

| Legacy File | Legacy Label | Canonical Mapping | Mismatch Summary |
|---|---|---|---|
| `62-PHASE-1-MVP.md` | Phase 1 | Phase 1 | Aligned |
| `64-PHASE-3-STRIPE-ORDER-FLOW.md` | Phase 3 | Phase 4 | Legacy numbering is one phase early relative to `74`. |
| `65-PHASE-4-FILE-UPLOAD-PROOFING.md` | Phase 4 | Supports canonical Phase 5 | Canonical artwork-management phase has no matching numbered doc in `74`. |
| `66-PHASE-5-ADMIN-PANEL.md` | Phase 5 | Phase 6 | Legacy numbering is one phase early. |
| `67-PHASE-6-REORDER-SYSTEM.md` | Phase 6 | Superseded support for Phase 7 | Superseded by v2. |
| `67-PHASE-6-REORDER-SYSTEM-v2.md` | Phase 6 v2 | Phase 7 | Canonical reorder doc, but legacy numbering remains one phase early. |
| `68-PHASE-7-GEO-CONTENT-ENGINE.md` | Phase 7 | Supports canonical Phase 2 | Canonical `74` places GEO foundation much earlier and reserves Phase 7 for reorder. |
| `69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md` | Phase 8 | Supports canonical Phase 3 | Canonical `74` moves lead flow to Phase 3, not Phase 8. |
| `43-CODEX-PHASE-1-EXECUTION-PROMPT.md` | Phase 1 | Phase 1 | Aligned |
| `44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md` | Phase 2 | Phase 2 | Aligned; phase doc missing |
| `45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md` | Phase 3 | Phase 4 | Legacy numbering is one phase early |
| `46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md` | Phase 4 | Supports canonical Phase 5 | Canonical artwork-management phase has no same-number prompt |
| `47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md` | Phase 5 | Phase 6 | Legacy numbering is one phase early |
| `48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md` | Phase 6 | Phase 7 | Legacy numbering is one phase early |
| `49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md` | Phase 7 | Supports canonical Phase 2 | Canonical `74` places GEO foundation much earlier |
| `50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md` | Phase 8 | Phase 3 | Canonical `74` moves lead flow to Phase 3 |
| `51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md` | Programmatic SEO | Phase 12 | Missing matching numbered phase doc |

---

## 5. Resolved Decisions

The owner has explicitly locked the following decisions. These are no longer open questions.

1. Canonical phase order is the timeline in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.
2. Canonical package ladder is `1,000 / 2,000 / 5,000 / 10,000`, with `20,000+` handled as quote-only.
3. Opaque PP pricing is fixed at `€149 / €229 / €399 / €699` for `1,000 / 2,000 / 5,000 / 10,000`.
4. Transparent PP pricing is fixed at `€169 / €254 / €429 / €749` for `1,000 / 2,000 / 5,000 / 10,000`.
5. `€100k` is framed as a three-rung ladder: (a) **long-term north-star = €100,000+/month NET profit (~Year 8–10)**; (b) the `04 §20.2` €100k figure is a **contribution milestone** (mid-term), explicitly NOT net profit; (c) interim **net-profit** targets are the Year 2–3 ranges (~€8k–35k/month). Keep the `04 §20.2` scenario labeled "contribution"; do NOT relabel the long-term net-profit north-star to contribution.
6. MVP auth and storage are locked to Supabase Auth + Supabase Storage. Clerk and UploadThing are alternatives considered, not active implementation paths.
7. Canonical public app URL env var is `NEXT_PUBLIC_APP_URL`. `EMAIL_FROM` and `EMAIL_REPLY_TO` are active email env vars.
8. Canonical checkout session route is `/api/checkout/create-session`. Stripe webhook remains `/api/stripe/webhook`.
9. Canonical route groups are `(public)`, `(account)`, and `(admin)`.
10. Canonical `OrderStatus` includes `CORRECTION_REQUIRED`, `PAYMENT_FAILED`, `ON_HOLD`, and `QUOTE_REQUESTED`. Payment event naming uses `stripeEventId`.
11. Ads / campaign landing pages live at `/lp/[slug]`, must remain German-language, must be `noindex`, must not enter sitemap, and must never become canonical winners.
12. `63-PHASE-2-SEO-FOUNDATION.md` now exists and is the canonical Phase 2 phase doc.
13. GTM docs `53/54/55/56/57` are future docs, not yet written, and must not block current implementation planning.
14. UI design direction is LOCKED to `76-UI-DESIGN-SYSTEM-GERMAN-B2B.md`: modern German B2B SaaS look — navy/slate text (`#0B1220`/`#111827`), Trust Blue primary CTA (`#2563EB`), white/soft-grey backgrounds (`#F8FAFC`/`#FFFFFF`), subtle borders. This SUPERSEDES the earlier warm terracotta/cream palette. The redesign (`77-CODEX-UI-REDESIGN-PROMPT.md`) is UI-only (no backend/Stripe/new pages), must preserve all routes/SEO, and must keep the Phase-2 `Ratgeber` + `Glossar` hubs in the nav. Hero uses a CSS "stored-design / reorder" moat card, not stock photos.

---

## 6. Missing-File Register

This register covers repo-local documentation references that point to files not present on disk.

Non-local `/docs/...` strings in `73` and `74` that actually refer to Google documentation URL paths are not treated as missing repo files.

| Missing File | Referenced By | Section |
|---|---|---|

Future / not yet written GTM docs tracked intentionally, but non-blocking:

| Future Doc | Referenced By | Notes |
|---|---|---|
| `53-GOOGLE-ADS-PLAN-GERMANY.md` | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Future GTM planning doc; not required for current implementation start. |
| `54-LANDING-PAGE-COPY-BANK.md` | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Future campaign copy bank; not required now. |
| `55-COLD-EMAIL-TEMPLATES-GERMANY.md` | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Future outbound enablement doc; not required now. |
| `56-COMPETITOR-RESEARCH-FRAMEWORK.md` | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Future research operating doc; not required now. |
| `57-90-DAY-GTM-PLAN.md` | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Future GTM planning doc; not required now. |

---

## 7. Domain Precedence Hierarchy

Use the following winner table when two domain docs disagree.

| Domain | Winning Doc | Scope |
|---|---|---|
| Project identity, market, language, non-negotiables | `00-PROJECT-BRIEF.md` | Brand, market, main product, German-only rule |
| Business model and segmentation | `01-BUSINESS-MODEL.md` | ICP, revenue logic, repeat-order thesis |
| Product strategy | `03-PRODUCT-STRATEGY-v2.md` | Long-term product direction and moat modules |
| Pricing and margin | `04-PRICING-AND-MARGIN-MODEL.md` | Price logic, package economics, margin assumptions |
| Technical stack selection | `10-TECH-STACK.md` | Chosen technologies unless superseded by this manifest or explicit later approval |
| Architecture and route/module layout | `11-ARCHITECTURE.md` | Route groups, domain module boundaries, system structure |
| Database schema | `12-DATABASE-SCHEMA-v2.md` | Current authoritative model set |
| Environment variables | `13-ENVIRONMENT-VARIABLES.md` | Canonical env names and grouping |
| Auth and accounts | `14-AUTH-AND-ACCOUNTS.md` | Role and auth behavior |
| Payments | `15-STRIPE-PAYMENT-FLOW.md` | Payment lifecycle and webhook truth |
| Orders and statuses | `16-ORDER-FLOW.md` | Order lifecycle, unless v2 reorder/schema docs add fields without contradicting core status gates |
| Files and proofing | `17-FILE-UPLOAD-AND-PROOFING.md` | Upload, proof, storage rules |
| Admin operations | `18-ADMIN-PANEL.md` and `66-PHASE-5-ADMIN-PANEL.md` | Admin UX and phase packaging |
| Customer portal | `19-CUSTOMER-PORTAL-v2.md` | Current portal direction |
| SEO strategy | `20-SEO-STRATEGY-2026.md` | Public SEO positioning and page rules |
| GEO / AI search strategy | `21-GEO-AI-SEARCH-STRATEGY.md` | AI-readable content rules |
| Programmatic SEO gating | `22-PROGRAMMATIC-SEO-PLAN.md` | Programmatic expansion logic |
| URL and keyword ownership | `23-KEYWORD-MAP-GERMANY.md` | Search-intent ownership, slug targets, page ownership by keyword |
| Metadata | `24-METADATA-MAP.md` | Title, description, canonical content targets |
| Schema markup | `25-SCHEMA-MARKUP-MAP.md` | Structured data type ownership |
| Indexing, sitemap, canonical, robots | `26-SITEMAP-ROBOTS-CANONICAL.md` | Indexability and sitemap inclusion rules |
| Internal linking | `27-INTERNAL-LINKING-ENGINE.md` | Link graph and cross-link obligations |
| Copy and page block templates | `28-CONTENT-TEMPLATES-GERMAN.md` | Reusable German content structures |
| Legal page content requirements | `29-LEGAL-PAGES-GERMANY.md` | Legal page skeleton scope |
| Product catalog and allowed SKUs | `30-PRODUCT-CATALOG.md` | Allowed products, slugs, product data ownership |
| Quote flow | `31-QUOTE-REQUEST-FLOW.md` | Quote form and conversion rules |
| Sample box flow | `32-SAMPLE-BOX-FLOW.md` | Sample lead qualification |
| Reorder economics | `33-REORDER-ECONOMICS.md` | Repeat-order business logic |
| Email notifications | `34-EMAIL-NOTIFICATIONS.md` | Email event catalog |
| Analytics and KPI tracking | `35-ANALYTICS-KPI-DASHBOARD.md` | Event and KPI definitions |
| Launch and QA | `37-QA-TESTING-CHECKLIST.md`, `40-VERCEL-DEPLOYMENT-CHECKLIST.md`, `42-LAUNCH-READINESS-CHECKLIST.md` | Testing, deployment, launch criteria |
| Repo structure | `39-REPO-SETUP-AND-FOLDER-STRUCTURE.md` | Folder/layout conventions |
| Phase sequencing | `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` | Canonical build order |

### 7.1 Explicit Winner Rules

When there is a conflict, apply these specific rules:

1. URL ownership and page targeting: `23-KEYWORD-MAP-GERMANY.md`
2. Metadata text and canonical title/description targets: `24-METADATA-MAP.md`
3. Schema markup type and field ownership: `25-SCHEMA-MARKUP-MAP.md`
4. Indexability, sitemap inclusion, canonical behavior, robots rules: `26-SITEMAP-ROBOTS-CANONICAL.md`
5. Internal linking obligations: `27-INTERNAL-LINKING-ENGINE.md`
6. Customer-facing German copy blocks and page structures: `28-CONTENT-TEMPLATES-GERMAN.md`
7. Allowed products and commercial SKU scope: `30-PRODUCT-CATALOG.md`
8. Pricing and package math: `04-PRICING-AND-MARGIN-MODEL.md`
9. Phase order and release timing: `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`

If one document defines a route and another defines whether that route may index, route existence is controlled by the route-owning document, but indexability is controlled by `26-SITEMAP-ROBOTS-CANONICAL.md`.

If one document proposes a product or package that is not allowed by `30-PRODUCT-CATALOG.md`, the catalog wins unless the catalog is explicitly updated.

---

## 8. Working Rule For Future Edits

Before adding or changing any implementation-facing doc:

1. Check whether the topic already has an authoritative file in this manifest.
2. Update the authoritative file first.
3. If an older file must stay for history, keep it and mark it superseded.
4. Update this manifest if a new v3 or replacement source doc is introduced.

---

## 9. Current Reconciliation State

Current state after this reconciliation pass:

- SEO and GEO full-content duplicates have been consolidated into canonical filenames.
- The v2 precedence rule is formalized.
- The `74` phase ordering is now the canonical scheme.
- Owner-locked decisions for pricing, routes, env naming, status naming, and Ads landing-page governance are now recorded here.
- Missing referenced docs are registered here instead of being guessed into existence.
- Legacy docs remain preserved for history until intentionally retired.
