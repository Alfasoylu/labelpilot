# 81-60-TASK-AUTOMATION-PLAN.md

# Labelpilot.de - 60 Task Sequential Automation Plan

## 1. Purpose

This document defines a sequential execution queue for Labelpilot.de and explains how a Codex automation can process tasks one by one with a 10-minute delay between completed tasks.

**Current ordering (2026-06-04):** a high-priority **Phase 0 — Produkte-Seite** (derived from `80-PRODUKTE-PAGE-ANALYSIS.md`) is prepended ahead of the original 60 audit tasks (Phases A–F). Codex processes Phase 0 first, then Phases A→F in their existing priority order. See the processing-order note in §5.

This is an operations document.

It does not override source-of-truth product, SEO, architecture, or pricing documents.

Use this file together with:

- `00-SOURCE-OF-TRUTH.md`
- `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`
- `75-EARLY-WARNING-SYSTEM.md`

---

## 2. Feasibility Verdict

## 2.1 Short Answer

Yes, this is possible in practice, but not as a pure native "when task completes, automatically wait exactly 10 minutes, then continue" event chain unless the automation also tracks task state.

## 2.2 What Codex Can Do Reliably

The reliable pattern is:

1. Keep the master task list in this file.
2. Store task state externally or in a simple progress file.
3. Run a recurring Codex automation every 10 minutes.
4. On each run, the automation checks:
   - which task is current
   - whether it is marked complete
   - when it was completed
5. If at least 10 minutes passed since completion, the automation starts the next task.

## 2.3 What Codex Does Not Natively Guarantee

Codex automations are schedule-driven.

They are not a full workflow engine with built-in task-completion triggers, dependency graphs, or transactional step handoff.

So the exact requirement:

```txt
finish task A
wait 10 minutes
start task B automatically
```

is best implemented as:

```txt
check every 10 minutes
if task A is complete and its completion timestamp is at least 10 minutes old
then start task B
```

This is operationally safe and simple.

---

## 3. Recommended Automation Model

Recommended model:

- Use one recurring `cron` automation for the workspace.
- Frequency: every 10 minutes.
- Prompt responsibility:
  - read this task file
  - read a progress/state file
  - execute only the current task
  - if current task is complete and 10 minutes have passed, advance to the next task
  - stop after task 60

Recommended supporting file:

- `docs/81-60-TASK-AUTOMATION-STATE.md`

Suggested state fields:

```txt
current_task: 1
current_status: pending|in_progress|completed
completed_at: ISO timestamp or empty
last_run_note: short summary
```

---

## 4. Guardrails

The automation must always respect these rules:

1. Fix broken functionality before expansion work.
2. Protect canonical, sitemap, robots, and route ownership.
3. Keep `/teklif/*` or equivalent Ads landing pages `noindex`.
4. Do not push thin pages into index.
5. Prefer small deployable changes.
6. Preserve documentation and append updates instead of overwriting architectural knowledge.

---

## 5. Task Queue

> **Processing order (updated 2026-06-04):** Codex runs top-down. **Phase 0 (Produkte-Seite, current focus) runs first**, then the existing Phase A → F audit backlog (kept in priority order: functional stability → SEO safety → conversion → ops/admin → architecture → release). Within Phase 0 the order is P0 (doc-mandated compliance/thinness fixes — "fix before expand") → P1 (buyer-confidence) → P2 (flag-gated revenue surfaces, BLOCKED) → founder-gated (BLOCKED). Every task is a small, deployable, German-only change, reviewed under `61-CLAUDE-REVIEWER-PROTOCOL.md`; **BLOCKED** tasks must NOT be executed until their gate is cleared (§6).

## Phase 0 - Produkte-Seite (aktueller Fokus, höchste Priorität)

> Source: `80-PRODUKTE-PAGE-ANALYSIS.md` (+ `30 §13/§18/§25`, `04 §14/§28`, `27 §11`, `78`, `59 §28`). Additive product-page work; no price/scope change (SoT #15/#16); fixed-package base unchanged.

### Task 0.1
P0 · `30 §25` — Verify/add the mandatory German Pflichtangaben-Hinweis (exact text per `30 §25`, must not be softened) on the food/beverage/supplement product + industry contexts. Legal-exposure → first.

### Task 0.2
P0 · `30 §13` — Add the mandatory reorder / accepted-print-files / legal-responsibility FAQs plus 3–5 buyer-objection FAQs (Glanz vs. matt, Klebstoff, Weißdruck, Lieferzeit, Spender/Maschine) to `/de/opake-pp-etiketten` and `/de/transparente-pp-etiketten`; add ≥3 FAQs to the `/de/pp-rollenetiketten` hub (currently 1).

### Task 0.3
P0 — Add an explicit "… € netto · … € inkl. 19% MwSt · Versand inklusive" line to the package ladder (net+gross already shown). No price change.

### Task 0.4
P0 — State Klebstoff (permanent; removable → Angebot) and the current Finish explicitly in the Spezifikation table; keep the Weißdruck note explicit on the transparent page. (The Glanz/matt *selector + surcharge* is the separate build Task 0.11b.)

### Task 0.5
P0 · `27 §11` — Audit/ensure each product page links to quote, musterbox, nachbestellen, druckdaten, the sibling material page, `etiketten-100x200`, and relevant Branchen pages, with descriptive German anchors (no "hier klicken").

### Task 0.6
P1 · gap G2 — Add a "Warum Labelpilot / Sicherheit" trust block built on transparency (Proof-vor-Produktion, kostenloser Datencheck, Musterbox, sichere Zahlung + DSGVO, honest production-origin). No fake reviews/testimonials.

### Task 0.7
P1 · gap G5 — Add an inline mini print-data spec (Beschnitt / Auflösung / CMYK / Vektor) + "kostenloser Datencheck fängt Fehler vor dem Druck" + honest color note (digitaler Proof zur Freigabe; farbverbindlich via physischem Andruck) + link Druckdaten-Anforderungen.

### Task 0.8
P1 · gap G6 — Surface a visible Kontakt/Support path (E-Mail/Formular) near the decision area and an "Angebot per E-Mail senden" option.

### Task 0.9
P1 · gap G4 — Make the "Andere Menge (z. B. 3.000 / 7.500 / unter 1.000)? Angebot anfordern" route explicit so the fixed tiers don't read as "not possible".

### Task 0.10
P1 · `59 §28` — Add Anwendung / Temperaturbereich / Geeignet für / Hinweis rows for opaque vs. transparent, and a "Für Spender/Maschine" note (76-mm-Kern / Wickelrichtung) → quote if non-standard.

### Task 0.11
P2 · BLOCKED — When `NEXT_PUBLIC_FEATURE_ADDONS` is enabled, surface the built add-ons (Designservice / Express / physischer Andruck / Zusatzdesign) as an inline panel on the product page with a live cost summary. **BLOCKED until the Stripe TEST round-trip is done and the operator enables the flag.**

### Task 0.12
P2 · BLOCKED — When `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` is enabled, link/embed the Wunschformat calculator on the product page. **BLOCKED until the operator enters real costs and enables the flag.**

### Task 0.11b
P2 · BLOCKED — Add a **Finish selector (Glanz / matt)** on the product page; **matt = fixed +15% net surcharge** (SoT #18d), server-priced exactly like the §16 add-ons (gross = net × 1.19, no client price trust, Order column + Stripe line item). Klebstoff stays permanent; removable → Angebot. **BLOCKED until the Stripe TEST round-trip + add-ons flag are live** (same gate as 0.11); needs the matt-surcharge wired into the checkout add-on engine.

### Task 0.13a
P1 · gap G1 — **Lieferzeit (founder-decided, SoT #18a):** state the honest range **"ca. 10–14 Werktage nach Ihrer Freigabe"** (Produktion + Versand nach Deutschland) on the product pages. A stated range, **not** a binding SLA — no "garantiert"/"in X Tagen geliefert".

### Task 0.13b
P1 · gap G3 — **Rechnungskauf (founder-decided, SoT #18b):** on the quote / B2B-Abruf / contact path show **"Rechnungskauf für geprüfte Geschäftskunden auf Anfrage."** Net-14 is **manual-approval only — do NOT add it to the self-serve checkout** and do NOT promise terms on the public page. (Eligibility/credit/Zahlungsbedingungen + AGB are operator/ops, out of scope here.)

### Task 0.13c
P1 · gap G7 — **Nachhaltigkeit (founder-decided, SoT #18c):** add an honest PP-material statement, **no eco/recyclable claims, no greenwashing**; recyclable/sustainable variants → Angebot/roadmap.

## Phase A - Functional Stability

### Task 1
Audit all public forms for broken submission paths.

### Task 2
Verify quote request form server action and validation behavior.

### Task 3
Verify sample box request form server action and validation behavior.

### Task 4
Verify custom size pricing request flow returns valid price data.

### Task 5
Verify checkout session creation route handles valid package orders.

### Task 6
Verify Stripe success and cancel routes render correct user states.

### Task 7
Verify Stripe webhook processes completed checkout safely.

### Task 8
Verify order artwork upload route accepts expected file types and limits.

### Task 9
Verify proof approval and correction decision routes update order state correctly.

### Task 10
Verify reorder API returns only valid reorder candidates.

### Task 11
Verify admin quote detail route loads and updates correctly.

### Task 12
Verify admin order detail route loads shipment, artwork, proofs, and notes correctly.

### Task 13
Verify admin leads pages load with correct filtering and detail links.

### Task 14
Verify stored design routes for account users resolve valid design ownership.

### Task 15
Fix the highest-severity broken functionality found in Tasks 1-14.

## Phase B - SEO and Indexing Safety

### Task 16
Audit `app/robots.ts` for correct crawl and noindex policy handling.

### Task 17
Audit `app/sitemap.ts` to confirm only intended indexable routes are included.

### Task 18
Verify Ads landing pages are excluded from sitemap output.

### Task 19
Verify Ads landing pages cannot become canonical winners.

### Task 20
Audit metadata generation for homepage and core commercial pages.

### Task 21
Audit German slug ownership for `/de` public routes.

### Task 22
Check for duplicate route intent between product, glossary, and guide pages.

### Task 23
Audit internal linking to core money pages from homepage and hubs.

### Task 24
Verify JSON-LD output matches visible page content.

### Task 25
Fix the highest-severity technical SEO issue found in Tasks 16-24.

## Phase C - Conversion and Commercial Clarity

### Task 26
Audit homepage CTA clarity for quote, sample box, and reorder paths.

### Task 27
Audit fixed package pricing presentation for net and gross display.

### Task 28
Verify package ladder messaging matches source-of-truth docs.

### Task 29
Audit custom size page for quote fallback clarity and non-confusing pricing.

### Task 30
Audit trust blocks and proof process messaging for B2B credibility.

### Task 31
Audit product card copy for German-only consistency and commercial accuracy.

### Task 32
Audit FAQ blocks for duplicate-intent or thin-copy risks.

### Task 33
Audit checkout add-on messaging for approved commercial rules.

### Task 34
Audit quote and sample-box thank-you states for next-step clarity.

### Task 35
Fix the highest-value conversion issue found in Tasks 26-34.

## Phase D - Operations and Admin Readiness

### Task 36
Audit order status transitions against documented lifecycle rules.

### Task 37
Audit admin notes, shipment fields, and proof actions for operational completeness.

### Task 38
Audit variable data admin area for placeholder gaps and route integrity.

### Task 39
Audit saved design data model usage for reorder readiness.

### Task 40
Audit refill reminder scaffold for missing logic or unsafe assumptions.

### Task 41
Audit artwork storage and retrieval flow for broken links or missing guards.

### Task 42
Audit email sending integration points for missing failure handling.

### Task 43
Audit analytics/browser tracking hooks for missing conversion events.

### Task 44
Audit environment variable usage for missing runtime guards.

### Task 45
Fix the highest-severity operations issue found in Tasks 36-44.

## Phase E - Content and Architecture Hygiene

### Task 46
Audit `docs/` and implementation alignment for stale execution assumptions.

### Task 47
Audit route groups against architecture rules in the source docs.

### Task 48
Audit code paths for duplicate pricing logic ownership.

### Task 49
Audit code paths for duplicate SEO metadata ownership.

### Task 50
Audit code paths for duplicate order-state ownership.

### Task 51
Audit public page components for accidental thin-content sections.

### Task 52
Audit glossary and guide templates for quality-gate compliance.

### Task 53
Audit component reuse to ensure no duplicate form behavior forks exist.

### Task 54
Audit middleware and auth guards for route-scope correctness.

### Task 55
Fix the highest-risk architecture or content-governance issue found in Tasks 46-54.

## Phase F - Release Discipline and Monitoring

### Task 56
Create a concise PASS/FAIL release checklist for current production-critical flows.

### Task 57
Create a concise SEO-safe release checklist for indexability and canonical safety.

### Task 58
Create a concise weekly risk review entry format aligned with the early warning system.

### Task 59
Summarize unresolved blockers that require founder decisions.

### Task 60
Prepare the next prioritized implementation recommendation based on completed findings.

---

## 6. Completion Rules

A task is complete only if:

1. The intended audit or implementation work was actually performed.
2. The result is recorded in the state/progress file.
3. Any blocking issue is clearly marked.
4. The next task does not start until at least 10 minutes after the recorded completion time.

If a task is blocked, the automation should:

1. mark the task as blocked
2. record the blocker
3. stop advancement until the blocker is cleared manually

---

## 7. Recommended Next Step

If you want this operationalized, the next step is:

1. create the state file
2. define the exact automation prompt
3. create the recurring Codex automation that checks every 10 minutes

That model is realistic and maintainable.
