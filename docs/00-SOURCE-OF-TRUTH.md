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
| Product strategy | `03-PRODUCT-STRATEGY-v2.md` | `03-PRODUCT-STRATEGY.md` (removed 2026-06-03) | Confirmed | Non-v2 predecessor deleted; v2 is sole authority. |
| Database schema | `12-DATABASE-SCHEMA-v2.md` | `12-DATABASE-SCHEMA.md` (removed 2026-06-03) | Confirmed | Non-v2 predecessor deleted; v2 is sole authority. |
| Customer portal | `19-CUSTOMER-PORTAL-v2.md` | `19-CUSTOMER-PORTAL.md` (removed 2026-06-03) | Confirmed | Non-v2 predecessor deleted; v2 is sole authority. |
| Reorder system | `67-PHASE-6-REORDER-SYSTEM-v2.md` | `67-PHASE-6-REORDER-SYSTEM.md` (removed 2026-06-03) | Confirmed | Non-v2 predecessor deleted; v2 is sole authority. |
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
| Agent review governance | `61-CLAUDE-REVIEWER-PROTOCOL.md` | Authoritative protocol for how Claude reviews/verifies Codex output before release; governs review behavior only — does not override business/product/pricing/SEO/architecture docs |

---

## 4. Canonical Phase Scheme

The canonical phase scheme is the ordering declared in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.

The older `62..69` / `43..51` scheme is retained only as legacy file numbering.

### 4.1 Resolved Canonical Build Phase Ladder

`74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` is the single canonical build-phase authority.

Use this normalized ladder when discussing current implementation order. Legacy numbers in `62..69` and `43..51` are filename/history labels only.

| Canonical Build Phase | Name | Definition | Release Gate |
|---|---|---|---|
| P0 | Foundation | Repo/docs/env/public foundation and release-safe technical base. | Foundation is complete only when docs, env assumptions, and the minimum public/commercial base are aligned. |
| P1 | Revenue-Capable MVP | Revenue-capable MVP with checkout and transactional email operational in production. | `checkout + email must be LIVE`, not only implemented in code. |
| P2 | Artwork / Proof | Private upload, technical review, proofing, and production gate. | Paid orders must be able to move safely into artwork/proof workflow. |
| P3 | Auth + Account | Real Supabase Auth and customer account layer. | Token-only stopgaps do not count as P3 completion. |
| P4 | Repeat / B2B | Reorder, reminders, company-account/B2B flows, and repeat-order infrastructure. | Repeat UX must be operationally usable, not only schema-present. |
| P5 | Admin / Ops | Admin control, quote/lead/order operations, shipment handling, and internal workflow safety. | Admin operations must support live order handling. |
| P6 | SEO / Scale | GEO/content/template/programmatic scale after lower phases are stable. | Scale only after lower phases are live and stable. |

### 4.2 Resolved Detailed Canonical Phase Table

| Canonical Phase # | Name | Phase Doc | Execution Prompt | Status |
|---|---|---|---|---|
| 0 | Repository and planning setup | None | None | Canonical in `74`; no dedicated numbered phase doc or prompt exists. This reconciliation task serves as the docs-only precursor. |
| 1 | Public MVP lead capture | `62-PHASE-1-MVP.md` | `43-CODEX-PHASE-1-EXECUTION-PROMPT.md` | Aligned. Prompt still cites some superseded inputs by legacy filename. |
| 2 | SEO / GEO foundation | `63-PHASE-2-SEO-FOUNDATION.md` | `44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md` | Resolved. Canonical phase doc exists; legacy GEO assets `68` and `49` are filename/history labels only. |
| 3 | Leads, analytics and GTM readiness | Missing | `50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md` | Resolved via `74`. The prompt keeps its legacy filename, but build-phase ownership is Phase 3 in `74`. |
| 4 | Stripe fixed package checkout | `64-PHASE-3-STRIPE-ORDER-FLOW.md` | `45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md` | Resolved via `74`. The docs keep legacy “Phase 3” filenames, but build-phase ownership is Phase 4 in `74`. |
| 5 | Artwork management v1 | No dedicated numbered phase doc; supporting doc `70-ARTWORK-MANAGEMENT-SYSTEM.md` | None | Resolved via `74`. Canonical build-phase ownership is Phase 5 even though there is no same-number legacy doc. |
| 6 | Admin operations | `66-PHASE-5-ADMIN-PANEL.md` | `47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md` | Resolved via `74`. The docs keep legacy “Phase 5” filenames, but build-phase ownership is Phase 6 in `74`. |
| 7 | Reorder v2 | `67-PHASE-6-REORDER-SYSTEM-v2.md` | `48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md` | Resolved via `74`. The docs keep legacy “Phase 6” filenames, but build-phase ownership is Phase 7 in `74`. |
| 8 | Refill reminders | No dedicated phase doc; supporting material is embedded in `67-PHASE-6-REORDER-SYSTEM-v2.md` and `12-DATABASE-SCHEMA-v2.md` | None | Missing dedicated phase doc and prompt. |
| 9 | Variable data automation | No dedicated numbered phase doc; supporting doc `71-VARIABLE-DATA-AUTOMATION.md` | None | Missing dedicated phase doc and prompt. |
| 10 | B2B account portal | No dedicated numbered phase doc; supporting docs `14-AUTH-AND-ACCOUNTS.md` and `19-CUSTOMER-PORTAL-v2.md` | None | Missing dedicated phase doc and prompt. |
| 11 | Template library MVP | No dedicated numbered phase doc; supporting doc `72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md` | None | Missing dedicated phase doc and prompt. |
| 12 | Programmatic expansion | Missing | `51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md` | Canonical in `74`; execution prompt exists, dedicated phase doc does not. |

### 4.3 Resolved Legacy File Mapping Notes

| Legacy File | Legacy Label | Canonical Mapping | Mismatch Summary |
|---|---|---|---|
| `62-PHASE-1-MVP.md` | Phase 1 | Phase 1 | Aligned |
| `64-PHASE-3-STRIPE-ORDER-FLOW.md` | Phase 3 | Phase 4 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `65-PHASE-4-FILE-UPLOAD-PROOFING.md` | Phase 4 | Supports canonical Phase 5 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `66-PHASE-5-ADMIN-PANEL.md` | Phase 5 | Phase 6 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `67-PHASE-6-REORDER-SYSTEM.md` (removed) | Phase 6 | Superseded support for Phase 7 | Removed 2026-06-03; superseded by v2. |
| `67-PHASE-6-REORDER-SYSTEM-v2.md` | Phase 6 v2 | Phase 7 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `68-PHASE-7-GEO-CONTENT-ENGINE.md` | Phase 7 | Supports canonical Phase 2 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md` | Phase 8 | Supports canonical Phase 3 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `43-CODEX-PHASE-1-EXECUTION-PROMPT.md` | Phase 1 | Phase 1 | Aligned |
| `44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md` | Phase 2 | Phase 2 | Aligned; phase doc missing |
| `45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md` | Phase 3 | Phase 4 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md` | Phase 4 | Supports canonical Phase 5 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md` | Phase 5 | Phase 6 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md` | Phase 6 | Phase 7 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md` | Phase 7 | Supports canonical Phase 2 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md` | Phase 8 | Phase 3 | Resolved: legacy numbering is retained as filename only; `74` owns build-phase order. |
| `51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md` | Programmatic SEO | Phase 12 | Missing matching numbered phase doc |

---

## 5. Resolved Decisions

The owner has explicitly locked the following decisions. These are no longer open questions.

1. Canonical phase order is the timeline in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.
2. Canonical package ladder is `1,000 / 2,000 / 5,000 / 10,000`, with `20,000+` handled as quote-only.
3. Opaque PP pricing is fixed at `€179 / €279 / €479 / €799` for `1,000 / 2,000 / 5,000 / 10,000`. This supersedes the earlier locked ladder `€149 / €229 / €399 / €699`.
4. Transparent PP pricing is fixed at `€199 / €309 / €519 / €849` for `1,000 / 2,000 / 5,000 / 10,000`. This supersedes the earlier locked ladder `€169 / €254 / €429 / €749`.
5. `€100k` is framed as a three-rung ladder: (a) **long-term north-star = €100,000+/month NET profit (~Year 8–10)**; (b) the `04 §20.2` €100k figure is a **contribution milestone** (mid-term), explicitly NOT net profit; (c) interim **net-profit** targets are the Year 2–3 ranges (~€8k–35k/month). Keep the `04 §20.2` scenario labeled "contribution"; do NOT relabel the long-term net-profit north-star to contribution.
6. MVP auth and storage are locked to Supabase Auth + Supabase Storage. Clerk and UploadThing are alternatives considered, not active implementation paths.
7. Canonical public app URL env var is `NEXT_PUBLIC_APP_URL`. `EMAIL_FROM` and `EMAIL_REPLY_TO` are active email env vars.
8. Canonical checkout session route is `/api/checkout/create-session`. Stripe webhook remains `/api/stripe/webhook`.
9. Canonical route groups are `(public)`, `(account)`, and `(admin)`.
10. Canonical `OrderStatus` includes `CORRECTION_REQUIRED`, `PAYMENT_FAILED`, `ON_HOLD`, and `QUOTE_REQUESTED`. Payment event naming uses `stripeEventId`.
11. Ads / campaign landing pages live at `/lp/[slug]`, must remain German-language, must be `noindex`, must not enter sitemap, and must never become canonical winners.
12. `63-PHASE-2-SEO-FOUNDATION.md` now exists and is the canonical Phase 2 phase doc.
13. GTM docs `53/54/55/56/57` are future docs, not yet written, and must not block current implementation planning.
14. Public website design direction is LOCKED to `78-PUBLIC-WEBSITE-DESIGN-SYSTEM.md`, which is **reconciled with and governed by the style guide `rakip_analizi_ve_stil_rehberi.md`**: a **premium German B2B roll-label manufacturer** "Ivory Industrial Premium" look — warm ivory/paper backgrounds (`#F7F2E8`/`#FFFDF8`), deep-ink headings & **deep-ink primary CTA (`#11100E`)**, graphite body (`#2A2926`), **brass premium accent (`#B08A45`)**, soft warm line (`#E5DED2`), and **proof-blue (`#2D5BFF`) used only as a technical/proof accent — blue is NOT the brand colour**. Typography is **Instrument Sans headings + IBM Plex Sans body + IBM Plex Mono for prices/labels** via next/font (no serif-everywhere). Asymmetric visual-first layout, borderless soft-shadow cards, Growth (5.000) pricing emphasised, explicit anti-AI rules. This **SUPERSEDES** the earlier navy/blue "German B2B SaaS" direction (`#2563EB`/white-grey; design docs `76`/`77` removed from the repo 2026-06-03) and any earlier palette. UI-only: preserve all routes/SEO/metadata/Stripe/order/upload/quote flows, keep `Ratgeber` + `Glossar` hubs in nav, full navy product-image hero (no stock-photo clutter, no fake dashboards). No competitor names, no English/Turkish public copy, no "Made in Germany" claim.
15. Fixed-price PP packages are now defined as an explicit commercial spec: `100×200 mm (10×20 cm)` rectangular roll labels, `1 design per order`, named PP material, permanent adhesive, full-colour CMYK digital print, no setup/plate fee, one finish (`gloss` or `matte`), free standard data check plus one proof round, shipping to Germany included, and reorder of the exact saved spec at the same package price. Transparent white underprint is a paid add-on / quote item, not included in the transparent base price. Customer-facing price display must show both net and gross (`19% MwSt`).
16. **Self-serve add-on pricing + custom-size area pricing engine are APPROVED (founder, 2026-06-03); build is phased.** (a) **Add-ons** (`04 §28`): Designservice **€40** (free for orders ≥ `€2.000` net, free if the customer uploads print-ready data); **physischer Andruck €10** (one digital proof stays free); **Express +€9,90**; **+€19 per extra design** (1 included); matt-finish surcharge (start quote → then per-tier). Standard data check + one digital proof stay free; **reorder re-setup = €0**. (b) **Custom-size engine** (`04 §29`): price from area (m²), compute digital (no plate) vs flexo (lower per-m² + fixed plate/Kalıp cost), sell at `min(digital, flexo) / (1 − margin)`, floored + rounded, net + gross; admin-configurable cost params via the cost-parameter screen (`18 §30A`); gated behind real operator-entered costs + quote-fallback limits; cost params never shown to customers. The **fixed `100×200` packages remain the default path and keep the no-plate/no-setup spec of #15** — the plate cost applies only to the optional custom-size engine. This **extends** #15 and `04 §14`; update `04 §14`, doc 30 and catalog scope to match as each phase ships. No live prices/behaviour change until built. **Clarification (category framing, 2026-06-05 — refines, does not compete with, this decision):** PP roll labels are the **main category**; `100×200 mm` is the **canonical fixed-price standard package and fast-checkout anchor**; **Wunschformat/custom-size** is a **configurable size path on the same two PP products** (opaque + transparent), priced by m² per `04 §29` when `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` is ON **and** the operator has locked real cost params in Admin `§30A`, otherwise routed to *„Individuelles Angebot anfordern"*. This does **not** change canonical `100×200` package prices, does **not** make custom size the only path, and adds **no** new product categories (no flyers/stickers/business cards/etc.).
17. **One scroll-driven signature animation is APPROVED as a scoped exception to the low-motion rule (founder, 2026-06-03).** The homepage **"Label Journey" (`Vom Material zum Regal`)** section — fully specified in `79-AWARD-WINNING-LABEL-JOURNEY-SCROLL.md` — is the **single** place sitewide where motion may exceed the `78 §6` micro-interaction ceiling. Mandatory guardrails (all binding): (a) **CSS / native only** — `position: sticky` + a `requestAnimationFrame` scroll-progress reader; **no animation library** (no framer-motion / GSAP), no WebGL / 3D; (b) **`prefers-reduced-motion: reduce`, no-JS, and SSR must render a fully readable static fallback** with identical content + SEO; (c) **`transform` / `opacity` only** (compositor-driven, no layout-affecting animation, zero CLS); (d) **LCP-safe** — the hero remains the LCP element, the journey lives below the fold; (e) **on-brand** — Ivory Industrial Premium palette, calm "expensive" easing, no neon / bounce / gimmick; (f) **scoped** — exactly one section sitewide; mobile may fall back to the static version; any *second* motion feature requires a new founder decision. This is an **exception to**, not a repeal of, decision #14 / `78 §6`; the rest of the site stays low-motion.
18. **Produkte-page founder decisions (2026-06-04).** (a) **Lieferzeit** is stated as an honest range **"ca. 10–14 Werktage nach Ihrer Freigabe"** (Produktion + Versand nach Deutschland) — a *stated range, not a binding SLA*. (b) **Rechnungskauf / Net-14** is offered **only on manual approval** for vetted Geschäftskunden via the Angebot/Account path — **NOT** in the self-serve checkout; the public page may say *"Rechnungskauf für geprüfte Geschäftskunden auf Anfrage"* but must not promise terms self-serve (eligibility/credit/Zahlungsbedingungen handled by the operator + AGB). (c) **Nachhaltigkeit:** honest PP material statement only, **no eco/recyclable claims** (recyclable/sustainable variants → Angebot/roadmap); no greenwashing. (d) **Finish selectable:** Glanz/matt selectable, **matt = fixed +15% net surcharge** (server-priced exactly like the SoT #16 add-ons: gross = net × 1.19, behind the add-ons feature flag + Stripe-TEST-gated, no client price trust); **Klebstoff stays permanent**, removable → Angebot. Updates `04 §28` (matt surcharge now fixed +15% net, was quote-only) and drives `80-PRODUKTE-PAGE-ANALYSIS` + `81` Phase 0. No live behaviour until built; the matt surcharge stays flag-/Stripe-gated like #16.
19. **Launch date + 48-month commercial target (recorded 2026-06-04).** **Launch date is `02.06.2026`.** The 48-month commercial target is: **1,000 orders/month OR €100,000/month revenue, whichever comes first, by ~month 48 (≈ June 2030).** This is an **aspirational north-star, NOT a guarantee**, and is modelled honestly in `82-REVENUE-MODEL-48-MONTH.md` (conservative/base/aggressive), with all market figures flagged as assumptions pending validation by `docs/research-prompts/05-48-month-revenue-reality.md`. **The two targets are NOT equivalent at canonical pricing:** at the base-case AOV (~€490) `€100k/month ≈ ~204 orders/month`, while `1,000 orders/month ≈ ~€490k/month`. The **`€100,000/month` figure here is REVENUE = the contribution-milestone rung of #5** (`04 §20.2`), explicitly **not** the Year-8–10 net-profit north-star; do not conflate. The **design-service and printed-proof business rules requested with this target already exist and are single-sourced in #16 + `04 §28.1`** (Designservice €40 / €0 ≥ €2.000 net / €0 on print-ready upload; physischer Andruck €10, one digital proof free) — they are NOT re-defined here to avoid scattering pricing rules.
20. **Documentation execution-system additions (2026-06-04).** New docs created and hereby registered (owners in parentheses): `82-REVENUE-MODEL-48-MONTH.md` (founder/finance), `83-LAUNCH-ROADMAP-MONTHS-1-2.md` (calendar layer — defers to #1/74 phase authority), and five deep-research prompts under `docs/research-prompts/` — `01-competitor-variant-system.md`, `02-google-ads-landing-readiness.md`, `03-shopify-seo-benchmark.md`, `04-seo-geo-ai-search-2026.md`, `05-48-month-revenue-reality.md` (research-prompt sources; results to be filed under `docs/research/` or `docs/research-outputs/`). **Five doc-level contradictions found in the audit are resolved authoritatively here (SoT precedence per §7; doc-body sync in 04/30/80/81 is a follow-up Codex task):** (i) **Weißdruck (white underprint) for transparent = quote-only**, not a self-serve add-on (not in `04 §28.1`); (ii) **finish:** fixed packages include **gloss as standard**; **matte = paid add-on +15% net** (flag-/Stripe-gated, #18d) — this refines #15's "one finish (gloss or matte)"; (iii) **self-serve add-ons + matte + custom-size stay BLOCKED (feature flags OFF) until founder approval AND a Stripe TEST round-trip** are both done (Stripe live keys being present does NOT auto-enable the flags); (iv) **Wunschformat/custom-size goes live only after the operator validates and locks real cost params in Admin `§30A`**, else `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` stays off; (v) **canonical Lieferzeit text** (use verbatim wherever delivery time appears): *"Lieferzeit: ca. 10–14 Werktage nach Ihrer Freigabe (Produktion + Versand nach Deutschland). Dies ist ein voraussichtlicher Zeitraum, keine bindende Garantie."*

---

## Production Readiness (live status)

This section records current production blockers without changing source-of-truth business decisions.

### Checkout

- **Status (updated 2026-06-11):** **live in production** — Stripe live mode, transactional email and the purchase conversion event are all proven. Async payment methods (SEPA) are handled in the webhook.
- **Code scope now present:** fixed-package checkout includes a dedicated pre-Stripe intake step that captures buyer contact data, shipping address, artwork readiness, server-side price revalidation, and draft-order persistence before Stripe redirect.
- **Observed live behavior:** `/api/checkout/create-session` returns `503` when required Stripe or database environment is missing.
- **Operational consequence:** the site is effectively **quote-only right now** even though checkout code exists.
- **Blocker:** production `STRIPE_*` variables and `DATABASE_URL` / runtime DB connectivity are not fully available to the live app.
- **Responsible:** operator / production env owner.

### Email

- **Status (2026-06-04): email SENDING is now CONFIGURED and LIVE in production.** `RESEND_API_KEY`, `EMAIL_FROM` (`Labelpilot.de <noreply@labelpilot.de>`), `EMAIL_REPLY_TO` (`kontakt@labelpilot.de`) and `ADMIN_NOTIFY_EMAIL` (`kontakt@labelpilot.de`) are set in Vercel (Production + Preview, marked Sensitive); domain `labelpilot.de` is **Verified for sending** in Resend (DKIM `resend._domainkey` + SPF `send` MX/TXT, region eu-west-1); production was redeployed so the env is active.
- **Verified:** a live test Angebot produced two Resend sends — the admin ops notification to `kontakt@labelpilot.de` = **Sent**; the customer confirmation to a fake test address (`alp@deneme.com`) = **Bounced** (expected: non-existent recipient — confirms sender/API key/DKIM/SPF are correct).
- **DNS reference (NameSilo):** Resend send records live (DKIM + SPF on `send.labelpilot.de`); apex forwarding MX `mx4/mx5/mx6.emailowl.com` (pri 10/20/30) added for `kontakt@` → `alperen_aydinn@hotmail.com` forwarding; the old Resend inbound apex MX was removed and Resend "Enable Receiving" disabled (the domain is **send-only**).
- **⚠️ OPEN FOLLOW-UP — REVISIT (deferred by founder 2026-06-04):** the `kontakt@labelpilot.de` → Hotmail **forwarding delivery is UNVERIFIED**. The admin test notification showed **Sent** in Resend (accepted by the EMAILOWL forwarder MX) but **did not arrive in the Hotmail inbox** (Junk not confirmed). Free NameSilo forwarding + Microsoft filtering is the fragile link for the critical order/lead alert. **Recommended fix when revisited:** point `ADMIN_NOTIFY_EMAIL` **directly** at `alperen_aydinn@hotmail.com` (Resend → Hotmail direct, no forwarding hop), keeping `EMAIL_REPLY_TO = kontakt@labelpilot.de` for the customer-facing reply address. Implementation: the Vercel var is Sensitive (value not editable) → **delete + recreate `ADMIN_NOTIFY_EMAIL`** with the Hotmail value, then redeploy. Also re-test with a **real** recipient address (fake addresses bounce and hurt sender reputation).
- **Responsible:** operator / production env owner.

### Auth

- **Status (updated 2026-06-05):** **customer Supabase Auth + account layer is now implemented** (Track S · S3) — `/konto` login/registration, a customer dashboard (order history, saved designs, 1-click reorder, artwork/proof step links via S8), a `Customer` model and order/design linking by verified email. The additive prod migration `20260605193000_customer_account_links` is **applied to production** (via Supabase MCP) and `Customer` has RLS enabled.
- **Admin auth (updated 2026-06-11):** **Supabase session is the primary admin gate** — `middleware.ts` enforces a Supabase session whose email matches `ADMIN_EMAIL`; Basic Auth remains only as a no-config fallback. Admin API routes (artwork/proof downloads etc.) verify the same via `lib/security/admin-request-auth.ts`.
- **Operator to confirm:** Supabase Auth env present in production + a live login/register round-trip tested end-to-end (the supervisor cannot verify a live session blind).
- **Token fallback retained:** guest token access for upload/proof/order remains as a fallback alongside login.
- **Responsible:** operator for env + live-login verification.

### ✅ RESOLVED (2026-06-05) — founder-requested customer purchase + account layer (built via Track S)

- **Original request (founder, 2026-06-04):** before wiring Stripe, build (1) add-to-cart, (2) cart view, (3) account creation / sign-up, (4) account-management pages. This was paused ("şimdilik bir şey yapmayalım").
- **Resolution (founder-directed Track S, 2026-06-05):** the **account layer was un-deferred and built** (S3: `/konto` + Supabase Auth + `Customer` model; prod migration applied; S8 added artwork/proof step links). The three previously-open design questions are now answered:
  1. **Cart vs locked model →** NO multi-item cart was built. The configurator is a configure→review staging step; orders stay **single-item per #15**. The "add-to-cart / cart view" parts of the 06-04 request were intentionally **NOT** built.
  2. **Sequencing (pulls P3 forward) →** **confirmed by the founder via Track S**; the P3 Auth+Account item is delivered ahead of the original ladder.
  3. **Overlap with existing portal →** `/konto` is now the canonical **login** surface; `/de/gespeicherte-druckdaten` (token access) currently **overlaps** it (saved designs + reorder). **Consolidation is a tracked Track S follow-up (Task S8b)** — make the token view a fallback that links into `/konto`, not a parallel surface (SoT 195 "extend, don't duplicate").

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
| Agent review governance | `61-CLAUDE-REVIEWER-PROTOCOL.md` | How Claude reviews and verifies Codex output before release; does NOT override business/product/pricing/SEO/architecture docs |

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

---

## 10. Implementation Snapshot (2026-06-04)

Implementation-aligned notes appended without changing precedence:

1. Technical SEO safety gates are now enforced in code and tests for `robots`, `sitemap`, canonical ownership, German-only public copy, and `/lp/*` + `/teklif/*` exclusion behavior.
2. Phase 3 lead operations are live in code: quote/sample persistence, source capture, lead scoring, analytics hooks, and admin lead management.
3. Quote operations are live in code: admin list/detail, status pipeline, internal notes, and transactional quote emails.
4. Admin operations are materially advanced in code: route protection, shipment fields, admin order notes, and pricing-settings hardening.
5. Artwork memory foundation is now implemented in code with `StoredDesign`, `ArtworkVersion`, private downloads, customer saved-design routes, and admin design search.
6. Reorder v2 foundation is now implemented in code: saved-design reorder creation, `20.000+` quote fallback, same-artwork vs minor-change branching, reorder analytics hooks, and payment/webhook handling for same-artwork fast path.
7. Phase 8 prep is now partially implemented in code behind disabled behavior only: `RefillPrediction`, `ReorderReminder`, and reminder calculation helper exist, but no live reminder sending is enabled.
8. Phase 9 prep is now partially implemented in code behind internal-only scaffolding: `DesignVariable`, `VariableDataBatch`, `VariableDataRow`, `GeneratedPrintFile`, and CSV/XLSX parser + placeholder generation exist, but no customer-facing UI is enabled.
