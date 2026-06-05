# 85 — Design & UX Reference Benchmarks

> **Purpose.** Design/UX/layout/product decisions for Labelpilot.de are made **reference-first**, not by the executor's taste. For every visual, layout, navigation, product-configuration or UX decision, this doc names **which successful site we model that dimension after, exactly what to take, what to avoid, and the evidence status.** The supervisor/Codex must cite a row here (or add one with evidence) instead of inventing a choice.
>
> **Brand identity stays ours.** References inform *structure, scale, UX patterns, density* — NOT brand identity. Colour palette, logo, voice and the "Ivory Industrial Premium" look are **locked by SoT #14 / doc 78** and are NOT copied from competitors. Never adopt a competitor's colours/fonts as our brand.
>
> **Status legend:** ✅ measured/observed live & adopted · 🟡 measured/observed, decision pending founder · 🔍 proposed reference, needs live validation before adopting.

---

## 0. 🔒 LOCKED references (founder-approved 2026-06-06)

**Overriding principle:** Labelpilot must read as **narrow & specialist** — a focused PP roll-label expert — **NOT** a broad print-shop or packaging marketplace.

| Dimension | 🔒 Locked reference | What we take |
|---|---|---|
| Look & feel (warm premium) | **noissue** (primary) + Moo (discipline) | warm ivory-adjacent premium, soft refined |
| Typography | **Moo** | light heading weight (we use 500) — applied |
| Label models / sizes / variants | **labelprint24** (primary) + OnlineLabels (size/material taxonomy) | roll-label sizes/materials/variants |
| Configurator / instant price | **Sticker Mule** (UX) + labelprint24 (roll-label specifics) | step-by-step, live net+gross, sample/proof, quote fallback |
| Menu / navigation | **noissue / Moo lean** | few focused top-level items; specialist |
| Layout / page order | **Moo** + labelprint24 (product-page depth) | hero→config→trust→specs→FAQ |
| Account / reorder / saved designs | **OnlineLabels + Vistaprint (account/reorder ONLY)** | orders, reorder, saved designs |
| Colour / brand | **OURS — locked SoT #14** | never copied from any competitor |

**Negative constraints (BINDING):**
- ❌ **Packhelp is NOT a primary reference.** Well executed, but reads as a broad packaging *marketplace*. Labelpilot stays narrow/specialist. May be consulted only for an isolated premium-B2B detail — never for breadth, nav, or catalog.
- ❌ **Vistaprint is NOT a public-site reference.** Too generic print-shop. Reference it **only** for the account/reorder area (Bestellungen / saved designs / reorder), never for public marketing, look, or menu.

## 0.1 Control mechanism (ACTIVE from 2026-06-06)

Every design/UX/layout/typography/menu/configurator/account change MUST:
1. **Cite the locked reference row** (§0) it follows — no taste-only design decisions.
2. **Pass the Design-Reference Compliance Checklist:**
   - [ ] **Narrow/specialist** — no marketplace/broad-print-shop breadth (no Packhelp-style mega-catalog; no Vistaprint-style generic public styling).
   - [ ] **Lean nav** — few focused top-level items (Produkte, Branchen, Ratgeber, Musterbox, Konto); no broad product-type mega-menu.
   - [ ] **Heading weight ≤ 500**, Moo-balance scale (h1 ≤ ~40px, lead ≤ ~17px); Instrument Sans / IBM Plex kept.
   - [ ] **Brand palette = SoT #14 only** (ivory/deep-ink/brass); no competitor colours/fonts as brand.
   - [ ] Configurator follows the **Sticker Mule** pattern; account/reorder follows **OnlineLabels/Vistaprint**.
   - [ ] German-only; honest claims; no fake reviews/eco/Made-in-Germany.
3. **Reviewer (61 §7)** adds a line: `Design-reference compliance: PASS/FAIL` citing the row(s).
4. **Re-audit cadence:** a periodic compliance pass checks live pages against §0; deviations are logged in §6 and fixed.

## 1. Methodology (how a design decision is made)

1. Identify the dimension (e.g. "product configurator", "menu", "h1 size").
2. Find the row in §3. If it exists and is ✅, implement to that reference + spec.
3. If missing or 🔍, **validate against the reference site live** (measure computed styles / observe the pattern), then fill the row with evidence and set status, and get founder sign-off before adopting.
4. Never decide by taste alone. Never copy a competitor's brand colours/identity.
5. Keep our non-negotiables (German-only, lean catalog, honest claims, single-item #15, no flags) above any reference.

---

## 2. Reference pool (measured/known strengths)

| Site | Domain | Strong reference FOR | AVOID copying |
|---|---|---|---|
| **Moo** (moo.com) | Premium print | Typography (light heading weight, refined scale), premium feel, product photography, clean soft cards, restraint | n/a (not roll-label config) |
| **labelprint24** (.de) | German roll-label manufacturer | Roll-label sizes/materials/variants, configurator + live price, B2B info density, German conventions, spec/FAQ depth | Cluttered mass-market look, ultra-thin (weight 100) type, busy mega-menu |
| **Sticker Mule** | Labels/stickers | Configurator UX (step-by-step, live price, free proof + sample CTA, low friction), simple checkout | Broad multi-product nav (Sticker/Magnete/Buttons/Kleidung) — breaks our lean catalog; playful tone |
| **Packhelp** (packhelp.com) 🔍 | B2B premium packaging | (proposed) B2B premium nav, account, layout, configurator | to validate |
| **noissue** (noissue.co) 🔍 | Premium sustainable labels/packaging | (proposed) warm-premium aesthetic close to our ivory, clean | to validate |
| **Avery WePrint / OnlineLabels** 🔍 | Label catalogs | (proposed) size/template libraries, label-specific filters | mass-market density |

---

## 3. Dimension → reference map

| Dimension | Primary reference | What to adopt | Avoid | Status |
|---|---|---|---|---|
| **Typography / type scale** | **Moo** | Light heading weight (we use **500**; Moo 400, labelprint24 100), h1 ~38–40, h2 ~28–30, h3 ~22–24, body 16, lead ~17, tight line-height ~1.15 | Heavy 600+ headings, oversized h1 (>44), huge lead text | ✅ measured + applied (commit f747ab9) |
| **Overall premium "look"** | **Moo** (+ noissue 🔍 for warmth) | Generous product imagery, refined light type, soft borderless cards, restraint | Clutter, badge-spam | ✅ Moo / 🔍 noissue |
| **Label models / sizes / variants** | **labelprint24** (roll-label specifics) | Material (opak/transparent), size (Standard 100×200 + Wunschformat), quantity tiers, white-underprint as option | Broad non-label product types; our catalog stays lean (PP + thermal cross-sell only) | 🟡 observed; deeper size/variant audit pending |
| **Configurator flow / instant price** | **Sticker Mule** | Step-by-step (material → size → quantity → price), **live net+gross**, prominent **Musterbox/Proof** CTA, minimal friction, quote fallback | Over-complex option trees | ✅ observed (our configurator already follows this) |
| **Layout / page order** | **Moo** (premium) + **labelprint24** (product-page info depth) | Hero → configurator → trust → spec table → FAQ → related; product-led | — | 🔍 propose (validate per page) |
| **Menu / navigation** | **Packhelp/Moo** lean premium nav — **NOT Sticker Mule** | Small focused nav (Produkte, Branchen, Ratgeber, Musterbox, Konto); mega-menu only if catalog grows | Broad product-type mega-menu (conflicts with lean catalog) | 🔍 propose (validate Packhelp) |
| **Product detail page** | **labelprint24** (spec/FAQ depth) + **Moo** (visual) | Spec table, material/size, trust block, FAQ, embedded config | Thin content | 🟡 (ours largely matches) |
| **Pricing presentation** | **labelprint24** + **Moo** | Clear **net + gross**, quantity Staffel, "ab X Stück", recommended tier | Hidden/total-only price | ✅ (ours matches) |
| **Account / reorder (our moat)** | **Moo** + our own | Order history, 1-click reorder, saved designs | — | ✅ (built: /konto) |
| **Trust / proof / delivery** | **labelprint24** (proof emphasis) + our honest wording | Proof-before-production step, honest "ca. 10–14 Werktage nach Ihrer Freigabe", Turkey origin honest | Fake reviews/certs/eco, "Made in Germany" | ✅ |
| **Colour palette / brand** | **OURS (locked SoT #14 / doc 78)** | Ivory `#F7F2E8`, deep-ink `#11100E`, brass `#B08A45`, graphite `#2A2926` | Copying any competitor's colours | ✅ locked — do not change |
| **Forms (login/checkout/quote)** | **labelprint24/Moo** standard density | Tight label↔input spacing, compact fields, clear single CTA | Loose/airy editorial forms | ✅ tightened (commit aa339fb) |
| **Mobile** | **Moo / Sticker Mule** | Compact mobile configurator, tap-target ≥44px, no oversized mobile h1 | — | 🔍 validate on device |

---

## 4. Measured typography evidence (live, 2026-06-06)

| Element | Moo (premium) | labelprint24 (mass) | Labelpilot (after f747ab9 target) |
|---|---|---|---|
| Body | 16px (copy 14) | 15px (copy 14) | 16px |
| h1 | 42px / **w400** | 36px / **w100** | ~38–40px / **w500** |
| h2 | 30px / 400 | 30px / 100 | ~26–29px / 500 |
| h3 | 24px / 400 | 24px / 100 | ~20–24px / 500 |
| Lead | — | ~14px | ~17px |
| Heading font | Bryant (custom) | Open Sans | Instrument Sans (kept — quality, on-brand) |

**Takeaway:** the decisive premium lever is **heading weight (light), not just size.** Adopted weight 500 + Moo-balance sizes; kept our Instrument Sans / IBM Plex Sans (good, on-brand — no font-family change needed).

---

## 5. Open reference questions (founder to weigh in)

1. **Warmth reference:** validate **noissue** vs Moo for the warm-premium feel that matches our ivory palette — pick one as the "look" north-star.
2. **Menu reference:** validate **Packhelp** nav as the lean-premium menu model.
3. **Configurator depth:** do a deeper Sticker Mule + labelprint24 configurator UX audit (step order, sample/proof placement, live-price behaviour) before the next configurator iteration.
4. **Size/template library:** if we ever expand sizes, validate Avery WePrint / OnlineLabels for size/template-picker UX.

> When a reference is confirmed, move its row to ✅ and record the measured evidence. This doc is the single place that answers "neredeki gibi olsun?" for any dimension.

> **§5 status:** references are now LOCKED in §0 (founder-approved 2026-06-06). The earlier open questions are resolved: warmth north-star = **noissue**; menu = **lean noissue/Moo** (NOT Packhelp); Vistaprint = account/reorder only.

## 6. Compliance baseline & log

**Baseline audit (2026-06-06, control mechanism start):**
| Check | Result |
|---|---|
| Lean/specialist nav (no marketplace breadth) | ✅ PASS — 5 top-level items (Produkte, Branchen, Ratgeber, Glossar, Musterbox) |
| Heading weight ≤ 500 (Moo balance) | ✅ PASS — base headings weight 500; h1 ≤ ~40px; lead ≤ ~17px |
| Brand palette = SoT #14 only | ✅ PASS — ivory/deep-ink/brass; no competitor colours |
| No Packhelp-style breadth / no Vistaprint-style generic public styling | ✅ PASS — catalog lean (PP + thermal cross-sell), no marketplace surfaces |
| Configurator = Sticker Mule pattern | ✅ PASS — step-by-step material/size/quantity, live net+gross, quote fallback |
| Account/reorder = OnlineLabels/Vistaprint structure | ✅ PASS — /konto with orders, saved designs, 1-click reorder |
| German-only / honest claims | ✅ PASS (check:lang + content audits) |

**Open gap (not a regression — aspirational):**
- 🟡 **Warm-premium "look" toward noissue** — typography/weight now aligned; the warmer imagery/feel polish (noissue-grade) is future design work, tracked as a Track-S/design follow-up.

**Log:** future compliance passes append dated rows here (deviation found → fixed → commit).
