# P6-RELEASE-DISCIPLINE.md

> Audit Track F — Tasks 56–60. Release discipline, risk review, founder blockers, and next priorities for Labelpilot.de.
> One task = one section. Do not modify this file without updating `81-60-TASK-AUTOMATION-STATE.md` accordingly.

---

## Task 56 — Production-Critical PASS/FAIL Checklist

Run this checklist before every production deployment. All items must PASS. A single FAIL blocks the release.

| # | Check | How to verify | Pass criterion | Fail action |
|---|-------|---------------|----------------|-------------|
| **PRICING** |
| P1 | Correct net price displayed | Open `/de/pp-rollenetiketten`, inspect any tier | Net price matches `lib/site-content.ts` canonical values exactly | Block release; revert pricing change |
| P2 | Correct gross price displayed | Same page — gross = net × 1.19 | `Math.round(net * 119) / 100` within ±0.01 € of displayed gross | Block release; fix VAT calculation |
| P3 | "inkl. 19% MwSt." label present | Page source or DOM inspection | Text "inkl. 19% MwSt." visible adjacent to gross price on every tier | Block release; restore label |
| **CHECKOUT** |
| C1 | Stripe checkout session created | POST `/api/checkout` with valid package payload | HTTP 200, returns `sessionId` string starting with `cs_` | Block release; check `STRIPE_SECRET_KEY` env and route handler |
| C2 | Checkout redirects to Stripe | Click "Jetzt bestellen" on a product page | Browser redirects to `checkout.stripe.com` URL | Block release; check `stripe.redirectToCheckout` call |
| C3 | Checkout rejects invalid payload | POST `/api/checkout` with missing `packageId` | HTTP 400 or 422 returned; no Stripe session created | Block release; add server-side validation |
| **WEBHOOK** |
| W1 | Stripe webhook updates order status | Trigger `checkout.session.completed` via Stripe CLI: `stripe trigger checkout.session.completed` | Order row in DB transitions to status `PAYMENT_RECEIVED`; Vercel function log shows no error | Block release; check `STRIPE_WEBHOOK_SECRET` and webhook handler |
| W2 | Webhook rejects unsigned payloads | POST `/api/webhooks/stripe` with no `Stripe-Signature` header | HTTP 400 returned; order status unchanged | Block release; ensure signature verification is not skipped |
| **EMAIL** |
| E1 | Order confirmation email received | Complete a TEST checkout (Stripe test mode) | Email arrives in buyer inbox within 5 minutes with correct order reference and German copy | Block release; check `RESEND_API_KEY` and email template |
| E2 | Email contains no placeholder text | Open the received email | No `[PLACEHOLDER]`, `TODO`, or `⚠️` text visible | Block release; fix template |
| **ARTWORK UPLOAD** |
| A1 | File stored successfully | POST a valid PDF to `/api/orders/{id}/artwork` | HTTP 200; file appears in Supabase `artwork` bucket under correct order path | Block release; check Supabase storage config and `SUPABASE_SERVICE_ROLE_KEY` |
| A2 | Oversized file rejected | POST a file >50 MB | HTTP 413 or 422 returned; no file written to storage | Block release; add/restore file size guard |
| A3 | Invalid file type rejected | POST a `.exe` or `.html` file | HTTP 422 returned; no file written to storage | Block release; add/restore MIME type guard |
| **PROOF** |
| PR1 | Proof approval triggers status change | POST `/api/orders/{id}/proof/approve` | Order status transitions to `PROOF_APPROVED`; admin order view reflects new status | Block release; fix proof route |
| PR2 | Proof correction request recorded | POST `/api/orders/{id}/proof/correction` | Order status transitions to `PROOF_CORRECTION_REQUESTED`; correction note saved | Block release; fix proof route |
| **ADMIN** |
| AD1 | Admin order list loads | GET `/admin/orders` (with valid admin auth) | Page renders; order rows visible; no 500 error | Block release; fix admin route or DB query |
| AD2 | Admin order detail manageable | Open any order in `/admin/orders/{id}` | Shipment fields editable; proof upload works; notes saveable | Block release; fix admin detail route |
| AD3 | Admin is protected | GET `/admin/orders` without auth header | HTTP 401 or redirect to login; no order data exposed | CRITICAL — block release; fix auth middleware immediately |
| **REORDER** |
| R1 | Reorder creates new checkout | POST `/api/reorders/{orderId}` for a completed order | HTTP 200; new Stripe checkout session ID returned | Block release; fix reorder route |
| R2 | Reorder rejects invalid candidates | POST `/api/reorders/{orderId}` for a non-completed order | HTTP 400 or 404; no checkout session created | Block release; add/restore status guard in reorder route |

---

## Task 57 — SEO-Safe Release Checklist

Run before every deployment that touches routes, metadata, sitemap, robots, or content.

### 57.1 — robots.txt disallows

Verify `app/robots.ts` (or static `public/robots.txt`) contains **all** of these disallow rules:

- [ ] `/admin/`
- [ ] `/api/`
- [ ] `/checkout`
- [ ] `/teklif/`
- [ ] `/lp/`

**How to verify:** `GET /robots.txt` in browser or curl. Each path must appear as `Disallow: <path>`.  
**Fail action:** add the missing rule to `app/robots.ts` and redeploy before indexing any new content.

### 57.2 — noindex on restricted routes

Verify that the following route groups render `<meta name="robots" content="noindex, nofollow">` (or equivalent `X-Robots-Tag: noindex` header):

- [ ] All `/admin/*` pages
- [ ] All `/konto/*` pages (customer account)
- [ ] All `/checkout/*` pages
- [ ] `/de/gespeicherte-druckdaten` (saved designs token access)

**How to verify:** open each page with DevTools Network panel; check `<head>` for robots meta or response headers. Alternatively run `curl -I <url>` and inspect `X-Robots-Tag`.  
**Fail action:** add `noindex` to the page's `generateMetadata` export or middleware header before release.

### 57.3 — Sitemap: only public German content pages

Verify `app/sitemap.ts` output:

- [ ] All entries are under `/de/` prefix
- [ ] No `/admin/`, `/api/`, `/checkout/`, `/teklif/`, `/lp/`, `/konto/`, `/de/gespeicherte-druckdaten` entries present
- [ ] All URLs resolve with HTTP 200 (spot-check 5 random entries)

**How to verify:** `GET /sitemap.xml`; parse URLs; check against disallow list and noindex list.  
**Fail action:** update `app/sitemap.ts` exclusion filter; redeploy.

### 57.4 — No canonical conflicts

Every indexed page must declare itself as its own canonical OR an explicit canonical to the preferred URL. No page may declare two different canonicals.

- [ ] Homepage canonical = `https://labelpilot.de/de` (or site root per SoT)
- [ ] Each product page canonical = its own clean URL (no `?` query params in canonical)
- [ ] Landing pages (`/lp/*`, `/teklif/*`) are excluded from sitemap AND carry `noindex` — canonical is moot for them but must not contradict an indexed page
- [ ] Configurator query-param URLs (e.g. `/de/pp-rollenetiketten?material=opak`) canonical = the clean page URL

**How to verify:** inspect `<link rel="canonical">` in page source for every route type above.  
**Fail action:** fix `generateMetadata` or page-level `<Head>` canonical for the conflicting page.

### 57.5 — Schema.org Product/Offer prices match visible prices

- [ ] JSON-LD `Offer.price` values on product pages match the net prices displayed in the pricing tier table
- [ ] `Offer.priceCurrency` = `"EUR"`
- [ ] No stale or placeholder prices in JSON-LD

**How to verify:** open product page → View Source → search for `application/ld+json`; compare price values against the visible tier table.  
**Fail action:** update `lib/seo.ts` or the relevant JSON-LD builder to read from the canonical `lib/site-content.ts` price data.

### 57.6 — No placeholder content in indexed pages

Indexed pages (anything in the sitemap) must contain no:

- [ ] `⚠️` warning markers
- [ ] `[PLACEHOLDER]`, `TODO`, `COMING SOON` text visible to users
- [ ] Empty `<h1>` or missing `<title>`

**How to verify:** spot-check sitemap URLs in a browser; run `grep -r "⚠️\|PLACEHOLDER\|TODO" app/ components/ lib/ --include="*.tsx" --include="*.ts"` (exclude test/config files).  
**Fail action:** replace placeholder with real German copy or add `noindex` until content is ready.

---

## Task 58 — Weekly Risk Review Format

Copy and fill this template each week. Store completed reviews in `docs/weekly-reviews/YYYY-MM-DD.md` or paste into the Notion ops log.

```markdown
# Weekly Risk Review — YYYY-MM-DD

## 1. New errors (Vercel logs)
- Check: Vercel dashboard → Functions → filter past 7 days, error severity
- Finding: [none / list any new 5xx patterns with route and frequency]
- Action: [none needed / ticket created: ...]

## 2. SEO health (Google Search Console)
- Check: Coverage report → Errors tab → new items since last review
- Finding: [none / list any new "Excluded", "Crawl anomaly", or "Duplicate" issues]
- Action: [none needed / fix route / update robots or canonical]

## 3. Conversion funnel (checkout abandonment)
- Check: Vercel Analytics or first-party events (configure-start → checkout-start ratio)
- Finding: [rate this week vs. prior week; flag if checkout-start drop >20%]
- Action: [none needed / investigate checkout route / check Stripe dashboard]

## 4. Payment failures (Stripe webhook health)
- Check: Stripe Dashboard → Developers → Webhooks → event delivery failures past 7 days
- Finding: [none / list failed event types and count]
- Action: [none needed / check STRIPE_WEBHOOK_SECRET / check handler logs]

## 5. Email deliverability (Resend)
- Check: Resend Dashboard → Logs → filter Bounced + Complained past 7 days
- Finding: [none / list bounced domains or complaint count]
- Action: [none needed / check DNS SPF/DKIM / check template for spam triggers]

## 6. Admin queue (stuck orders)
- Check: /admin/orders — filter by status; flag any order in the same non-terminal status for >5 business days
- Finding: [none / list order IDs and stuck status]
- Action: [none needed / manual intervention / fix status-transition bug]

## 7. Summary verdict
- Overall risk level: GREEN / AMBER / RED
- Blocker for next release: [yes — describe / no]
- Items carried to next week: [list or "none"]
```

---

## Task 59 — Unresolved Founder Blockers

These items require a **founder decision or direct action** before Labelpilot.de goes live with paid advertising. They are not code tasks — Codex cannot resolve them. Each is recorded here for visibility and must be cleared manually.

| # | ID | Blocker | What the founder must decide or do | Impact if unresolved |
|---|-----|---------|-------------------------------------|----------------------|
| 1 | S16 | **Analytics tool decision (Datenschutz)** | Current posture: "no third-party tracking." Decide whether to stay no-tracking (first-party events only, no Google Analytics / Meta Pixel) or select a DSGVO-compliant tool (e.g. Plausible, Fathom). If third-party: update `docs/00-SOURCE-OF-TRUTH.md` §21 and Datenschutzerklärung; add consent banner before enabling. | Without a decision, paid-ad conversion measurement is impossible. Running third-party analytics without DSGVO consent banner is a legal exposure. |
| 2 | S18 | **Stripe TEST round-trip** | Configure the `.env.local` (or Vercel env vars) with **Stripe TEST keys** (`STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_PUBLISHABLE_KEY=pk_test_...`, `STRIPE_WEBHOOK_SECRET` from `stripe listen` or Vercel webhook endpoint). Complete one full TEST checkout: product → configure → Stripe test card → success → webhook updates order. Record the result. See `docs/P6-RELEASE-DISCIPLINE.md §56` checklist for exact steps. | Without a verified TEST round-trip, the payment flow is unproven. Cannot go live. |
| 3 | — | **VAT / invoicing: EU B2B treatment** | Decide: (a) German B2B customers: show net price, collect VAT-ID, apply Reverse Charge for EU cross-border? (b) For self-serve checkout: is every buyer treated as B2C (always charge 19% MwSt.)? (c) Rechnungskauf / Net-14: which customers qualify, manual approval process? Outcome must update `docs/00-SOURCE-OF-TRUTH.md` and the AGB. | Incorrect VAT treatment is a legal/financial liability. Checkout currently applies 19% MwSt. flat — may be wrong for verified EU B2B customers. |
| 4 | S4 | **Admin auth hardening** | Task S4 (Basic Auth → Supabase roles) is not yet executed. The current HTTP Basic Auth on `/admin` is a stopgap (self-described in `middleware.ts`). Founder must: (a) confirm Supabase auth is the chosen solution, (b) confirm which users get the `admin` role, (c) unblock Task S4 execution. Until S4 ships, admin is protected only by a shared password. | A leaked Basic Auth credential exposes all order data. Must be fixed before any paid traffic. |
| 5 | 0.11/0.12/0.11b | **Feature flags sign-off** | Two feature flags remain OFF and BLOCKED: `NEXT_PUBLIC_FEATURE_ADDONS` (add-ons: Designservice, Express, physischer Andruck, Zusatzdesign) and `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` (Wunschformat calculator). Founder must: (a) confirm Stripe TEST round-trip passes (blocker 2 above), (b) validate cost params in Admin §30A for Wunschformat, (c) explicitly enable each flag in Vercel env vars when ready. | Add-ons and custom sizing remain hidden from buyers. Revenue surface is limited to fixed 100×200 packages only. This is intentional until the gates clear — but it is a revenue cap. |
| 6 | — | **AGB legal review** | The AGB (`/de/agb`) was completed as substantive (non-placeholder) text by a prior automated task. It has **not** been confirmed as reviewed by a German-qualified lawyer. Before paid traffic: have counsel review the AGB for compliance with German Fernabsatzrecht, Widerrufsrecht (note: B2B custom-print may be exempt), Lieferbedingungen, and Haftungsausschluss. | Running paid ads to a site with unreviewed AGB creates legal exposure. A B2C buyer could invoke consumer-protection rights that the AGB does not correctly address. |

---

## Task 60 — Next Implementation Priorities

Based on the pre-production audit findings across Tracks A–F, these are the top 5 recommended implementation actions, ordered by business risk and sellability impact.

### Priority 1 — Complete Task S4: Admin Auth Hardening (Security · Blocker)

**Why first:** the current HTTP Basic Auth on `/admin` is a single shared credential. Any exposure of that credential gives full access to all customer orders, artwork files, and shipping data. This is the highest-risk open item and must be resolved before paid traffic sends real buyers to the site.

**Action:** execute Task S4 — replace Basic Auth in `middleware.ts` with Supabase session check + admin-role assertion. Confirm `/admin` and `/api/admin` routes remain `noindex` + `Disallow` in robots. One atomic commit.

### Priority 2 — Stripe TEST Round-Trip (Revenue · Blocker)

**Why second:** the entire payment flow (checkout session creation, success redirect, webhook order-status update, confirmation email) has not been verified end-to-end in a test environment. Without this verification, the site cannot accept real payments with confidence.

**Action:** founder configures Stripe TEST keys in Vercel env (see Task 59 blocker #2). Codex documents the exact ENV var names and verification steps (already scoped as Task S18). Run the Task 56 checklist sections C1–C3 and W1–W2 against the TEST environment. Record PASS/FAIL in `81-60-TASK-AUTOMATION-STATE.md`.

### Priority 3 — Sellability Track S completion: S5–S9 (Conversion · High Impact)

**Why third:** the Sellability score audit (Track S target ≥ 90%) identified that the configurator flow (S5), hub/landing dedup (S6), checkout summary (S7), and account order visibility (S8/S8b) are incomplete. Buyers who reach the site via paid ads need a frictionless path from product page to checkout — gaps here directly reduce paid-traffic ROI.

**Action:** execute S5 → S6 → S7 → S8 → S8b in order, one commit each. Re-score Sellability % after each task. Do not run paid ads until S5–S8 pass.

### Priority 4 — VAT/Invoicing Decision + AGB Counsel Review (Legal · Pre-Ads Blocker)

**Why fourth:** charging incorrect VAT to EU B2B customers is a financial liability. Running paid ads to a site with unreviewed AGB exposes the business to consumer-protection claims. Both are founder-side decisions (Task 59 blockers #3 and #6) but they have a code tail: once the VAT decision is made, `lib/pricing.ts` and the Stripe checkout payload may need updating.

**Action:** founder makes the VAT/B2B treatment decision and engages counsel for AGB review. Codex then implements any required pricing or checkout changes as a single task after the decision is recorded in `docs/00-SOURCE-OF-TRUTH.md`.

### Priority 5 — End-to-End Sellability Test + Lock (Quality · Pre-Ads Gate)

**Why fifth:** Task S17 (end-to-end sellability test) produces a locked test checklist that becomes the go/no-go gate for paid ads. Without a documented passing run, there is no defensible basis for launching ad spend.

**Action:** after S4, Stripe TEST round-trip, and S5–S9 are complete, execute Task S17: run the full buyer journey (product → configure → intake → Stripe TEST → success → artwork upload → proof approval → reorder) and record each step as PASS/FAIL. Lock the result as the pre-ads release gate. Only then execute Task S18 (Stripe TEST readiness documentation) and Task S19 (VAT readiness note) to formally close Track S.

---

*Generated: 2026-06-07. Maintained by: Codex automation + founder review. Next review due: before first paid-ad campaign launch.*
