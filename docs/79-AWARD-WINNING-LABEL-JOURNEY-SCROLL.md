# 79 — Award-Winning Label Journey (Scroll)

**Status:** APPROVED & LIVE (founder, 2026-06-03). Governed by **SoT decision #17** (scoped exception to the low-motion rule #14 / `78 §6`).
**Surface:** Homepage `/de`, section component `components/sections/LabelJourney.tsx` + scoped `.lj-*` styles in `app/globals.css`.
**Working title (German):** „Vom Material zum Regal."

This document is the single source of truth for the homepage signature scroll experience: the concept, the asset set, the interaction and technical spec, the accessibility/performance contract, the guardrails, and — critically — an honest **award-criteria self-assessment** that drove the v2 craft pass.

---

## 1. Why this exists (concept)

Yucca's food-service page pins one product object and choreographs the page around it. We do the **opposite of a generic SaaS hero**: we make the *label itself* the protagonist and tell our actual product story — a blank PP roll becomes a printed, finished, **approved**, applied, **reorderable** label. The narrative IS our differentiator (Druckdatenprüfung + Proof + No-Label-Look + reorder), not decoration.

**One-line promise the section must land:** *"You instantly understand what we sell (PP-Rollenetiketten) and to whom (5 Branchen) — and that we are the calm, premium, proof-first manufacturer."*

Every label in every frame carries `labelpilot.de` + a German message, so even a muted, fast scroll communicates the offer.

---

## 2. Narrative — 9 stages → 5-Branchen payoff

A single die-cut PP label is the continuous protagonist. Scroll scrubs it through production, ending applied across our five industries.

| # | Stage (DE) | Frame | Caption headline | Buyer message |
|---|---|---|---|---|
| 01 | Rohmaterial | `journey-01-rohmaterial-blank-rolle` | Blanko PP-Material auf der Rolle. | reinweiße, langlebige PP-Folie |
| 02 | Druck | `journey-02-bedruckt-farbe-trifft-folie` | Ihr Motiv trifft auf die Folie. | passgenauer Farbdruck |
| 03 | Veredelung | `journey-03-veredelung-mattlack` | Schutzlack für matte Haptik. | widerstandsfähig & wertig |
| 04 | Stanzung | `journey-04-stanzen-konturschnitt` | Saubere Konturstanzung. | präzise Konturschnitte |
| 05 | Rollenfertig | `journey-05-fertige-druckrolle` | Aufgewickelt und maschinenfertig. | konfektioniert für Ihren Prozess |
| 06 | Einzeletikett | `journey-06-einzeletikett-abziehen` | Leicht abzuziehen. | sitzt sofort sauber |
| 07 | Freigabe | `journey-07-proof-freigegeben` | Produziert wird erst nach Ihrer Freigabe. | **Datencheck + Proof inklusive** |
| 08 | Transparent | `journey-08-transparent-no-label-look` | No-Label-Look auf Glas. | transparentes PP wirkt aufgedruckt |
| 09 | Im Einsatz | `journey-09-finale-5-branchen-wide` | Auf Ihrem Produkt – für fünf Branchen. | opak & transparent, 5 Branchen |

**Payoff grid (always visible, below the stage):** the five sector close-ups, each with `labelpilot.de` + sector word and material badge.

| Branche | Material | Frame |
|---|---|---|
| Imkerei & Honig | Opak | `journey-10-honig-opak-anwendung` |
| Getränke | Transparent | `journey-11-getraenke-transparent-anwendung` |
| Supplement | Opak | `journey-12-supplement-opak-anwendung` |
| Rösterei & Kaffee | Opak | `journey-13-kaffee-opak-anwendung` |
| Naturkosmetik | Transparent | `journey-14-kosmetik-transparent-anwendung` |

All 14 frames: `public/images/editorial/journey/*.webp`, optimised 16–71 KB (from ~1.8 MB), portraits ≤900 w, finale 1600 w.

---

## 3. Award-criteria self-assessment (the bar we are judged against)

Awwwards / CSS Design Awards / FWA reward **craft, narrative, restraint, performance, and accessibility** — not flash. Scored honestly against the as-built **v1** (stepped cross-fade) and the target.

| Criterion | Award bar | v1 (shipped) | Gap → v2 action |
|---|---|---|---|
| **Narrative** | One protagonist, clear arc, payoff | ✅ 9-stage arc + 5-Branchen payoff | none |
| **Motion feel** | Continuous, *scrubbed* to scroll; filmic | ⚠️ **stepped** `floor()` cross-fade — snaps | **E1** continuous scrub: blend adjacent frames by fractional position |
| **Craft / "alive"** | Subtle settle, depth, intentional easing | ⚠️ flat opacity swap | **E2** per-frame settle (scale 1.03→1.0) tied to fractional progress |
| **Progress affordance** | Scrubbed indicator + orientation | ⚠️ static dots | **E3** continuous brass progress bar + live `nn / 09` counter |
| **Navigability** | Jump to chapters; keyboard | ❌ none | **E4** clickable step ticks (`scrollTo`), real `<button>`s |
| **Payoff reveal** | Considered entrance | ⚠️ static pop-in | **E5** staggered IntersectionObserver reveal of sector tiles |
| **Mobile** | Reliable, no jank | ⚠️ pins on tiny screens (risky) | **E6** below 700 px → refined static version |
| **Accessibility** | Full content w/o motion; SR; keyboard; reduced-motion | ⚠️ reduced-motion ok, but SR loses the arc when interactive | **E7** always-present SR step list; ticks keyboard-focusable; `aria` correct |
| **Performance** | 60 fps, no CLS, LCP-safe | ✅ transform/opacity, below fold, tiny webp | keep; add `will-change`, eager first 2 frames |
| **Restraint / brand** | No gimmick; premium | ✅ ivory/ink/brass, calm | keep ceilings: scale ≤1.04, drift ≤12 px, ease ≥600 ms |

**Verdict on v1:** solid and shippable, but the stepped cross-fade + static dots read as "tasteful slideshow," not "award-grade scrollytelling." The gap is **continuity, scrub, and interactivity** — closed by v2 (E1–E7) without breaking any guardrail.

---

## 4. Interaction spec (v2 — target)

**Pinned stage** (`position: sticky`, 100svh) inside a tall track (`height = N·62vh + 100vh`). A `requestAnimationFrame`-throttled scroll reader computes:

- `progress` ∈ [0,1] from the track's `getBoundingClientRect()`.
- `pos = progress · (N−1)` (continuous float).
- **Per frame `i`:** `opacity = clamp(1 − |i − pos|, 0, 1)`; `transform = scale(1 + 0.03·clamp(|i − pos|,0,1))` — neighbour eases *into* place, active frame is crisp at scale 1. Set **imperatively via refs** (no React re-render on scroll).
- **`--lj-progress`** CSS var = `progress` → drives the brass progress-bar fill.
- **`activeStep = round(pos)`** → `setState` only when the integer changes → caption + counter + active tick update (rare re-render).

**Progress bar + counter:** horizontal brass track with a fill (`width: calc(var(--lj-progress)·100%)`) + `nn / 09` mono counter. **Step ticks:** 9 focusable `<button>`s; click/Enter → `window.scrollTo` to that step's centre (smooth). Active tick highlighted.

**Caption:** eyebrow + headline + body, keyed by `activeStep` with a ≤0.6 s rise; `max-width 46ch`.

**Payoff grid:** 5 tiles; each fades/rises in (staggered by index) when it enters the viewport (IntersectionObserver, once).

**Triggers for interactive mode:** `matchMedia('(prefers-reduced-motion: reduce)')` is **false** AND viewport width ≥ 700 px. Otherwise → static fallback. Re-evaluated on resize.

---

## 5. Static fallback (mandatory)

Rendered on **SSR, no-JS, reduced-motion, and < 700 px**: a clean responsive grid of all 9 stage frames with caption text, plus the same 5-tile payoff grid. This is the canonical accessible + SEO content; the interactive stage is a progressive enhancement layered on top after hydration. `interactive` starts `false` on the server, so the first paint always contains the full readable content (no layout shift, no hydration mismatch).

---

## 6. Technical architecture

- **No animation library.** Native `position: sticky` + one `rAF` scroll listener (passive) + one IntersectionObserver (sector reveal). ~Single rAF, imperative style writes, no per-frame React render.
- **Compositor-only:** animate `opacity` + `transform` exclusively. `will-change: opacity, transform` on frames.
- **Next/Image** `fill` + `sizes`; first two frames eager/`priority`, rest lazy.
- **No CLS:** fixed `aspect-ratio` boxes; sticky reserves its own height via the track.
- **Cleanup:** all listeners removed and `cancelAnimationFrame` on unmount / mode switch.

---

## 7. Accessibility contract

- `prefers-reduced-motion: reduce` → static fallback, no transitions/animations.
- A visually-hidden ordered list (`.lj-sr`) enumerates all 9 stages **whenever interactive**, so screen-reader users always get the full narrative; the decorative stage is `aria-hidden`.
- Step ticks are real `<button>`s (keyboard + focus-visible).
- Heading order: section `<h2>` ("So entsteht Ihr PP-Rollenetikett."), sub-`<h3>`s.
- Content never depends on motion; the page is fully usable scrolled at any speed or with JS off.

---

## 8. Performance budget

- 14 webp, 16–71 KB each (total < 0.6 MB), below the fold, lazy except first two.
- Hero remains LCP; journey must not regress LCP/CLS.
- Scroll handler: rAF-coalesced, no synchronous layout in a loop beyond one `getBoundingClientRect`.

---

## 9. Guardrails (binding — SoT #17)

CSS/native only · no framer-motion/GSAP/WebGL · reduced-motion + no-JS + SSR static fallback · transform/opacity only · zero CLS · LCP-safe (below fold) · Ivory Industrial Premium palette · calm easing (≥600 ms), scale ≤1.04, drift ≤12 px, no neon/bounce · **exactly one such section sitewide**. A second motion feature requires a new founder decision.

---

## 10. Changelog

- **v1 (commit `2658aa7`, 2026-06-03):** initial ship — sticky stage, stepped cross-fade, static dot rail, static fallback, sector grid. Live & verified on `labelpilot-tau.vercel.app`.
- **v2 (this pass):** award craft — continuous scrubbed cross-fade (E1), per-frame settle (E2), brass progress bar + live counter (E3), clickable/keyboard step ticks (E4), staggered sector reveal (E5), mobile static fallback < 700 px (E6), always-present SR step list (E7). Guardrails unchanged.
