---
purpose: >
  Map exactly how German and EU roll-label competitors structure their product
  variant systems — materials, shapes, sizes, finishes, quantities, proof/data-check
  options, reorder UX, design services — so Labelpilot.de can prioritise which
  configuration features to implement and which to defer.
when_to_run: >
  Before building or extending the Labelpilot product-configuration step. Re-run
  whenever a new material, finish, or add-on is proposed for the roadmap.
save_results_to: >
  docs/research/01-competitor-variant-system-results.md in the Labelpilot repo.
owner: Labelpilot product / Alfasoylu
---

# Deep-Research Prompt — German/EU Roll-Label Competitor Variant & Configuration System

## Instructions for the research model

You are an expert competitive-intelligence analyst. Your task is to browse the live
web, collect concrete evidence from real competitor websites, and produce a
structured report with comparison tables. Follow every rule below exactly.

### Ground rules

1. **Browse actively.** For every factual claim — a price, a feature, a UI
   pattern — you MUST visit the page yourself and cite the exact URL. Do not rely
   on training-data memory; confirm the page is live.
2. **Separate facts from assumptions.** Label each key finding with one of:
   - FACT (sourced) — you visited the page and saw it
   - ASSUMPTION — logical inference, not confirmed on the page
   - UNKNOWN — you looked but could not find the information
3. **Assign a confidence level** (HIGH / MEDIUM / LOW) to each key finding, based
   on how unambiguous the evidence was.
4. **Use comparison tables** for all multi-competitor data. Raw prose alone is not
   acceptable for anything that can be tabulated.
5. **Do not copy or plagiarise design.** You are analysing structure and logic only.
6. **Work in English** throughout the report (Labelpilot is German-market but this
   research doc is internal).

---

## Context — what Labelpilot.de is (the research model has no repo access)

Labelpilot.de is a German B2B webshop launching 02 June 2026 that sells
individually printed PP roll labels (PP-Rollenetiketten). Key facts:

- **Main product:** 100 x 200 mm PP roll labels, printed in full colour.
- **Target customers:** food, beverage, supplement, private-label, and
  small/medium packaged-product brands. German-speaking market.
- **Quantity packages (fixed price):** 1,000 / 2,000 / 5,000 / 10,000 labels.
- **Current add-ons:** design/artwork service (EUR 40, waived if order >= EUR 2,000
  net OR customer uploads print-ready data); printed proof (EUR 10, optional);
  express production; extra design variants per order; repeat-order / saved artwork.
- **Platform:** custom Next.js site (not Shopify). Seller of record: Zhenkai Global
  Trading Limited (HK). DDP shipping from Turkey via DHL/UPS.
- **Revenue target:** 1,000 orders/month OR EUR 100,000/month within 48 months.
- **Business constraint:** German-only site; B2B focus; fixed-price simplicity is
  intentional — avoid over-engineering the product catalogue.

---

## Reference URL to analyse in depth

Browse and analyse this specific page from wir-machen-druck.de (a major German
online print shop). Do NOT copy its design. DO extract the structural logic:

  https://www.wir-machen-druck.de/hochwertige-etiketten-auf-rolle-rechteckig-71-x-96-cm.html

For this URL, document:
- Every product option/variant step shown to the customer (and in what order)
- How quantity breaks and prices are displayed (table, dropdown, live price, etc.)
- How material/finish/adhesive choices are presented
- Whether a data-check / proof / sample step exists and how it is priced
- Any "Datencheck" or "Druckfreigabe" options and their exact wording
- Upload flow: what file formats are accepted, what validation is shown
- Any design-service or layout-service upsell
- Delivery-time options and how they affect price
- Reorder experience (if visible)
- What trust signals or certifications are displayed near configuration options

---

## Competitors to research

Research ALL of the following. For each, find their roll-label product page (search
if needed), browse it live, and document the same dimensions as above.

1. **wir-machen-druck.de** — already covered by the reference URL above; also check
   any other roll-label pages they have for size/material variety.
2. **onlineprinters.de** (brand "diedruckerei" may appear; same group) — find their
   Etiketten auf Rolle category.
3. **Etikettenheld.de** — specialist label shop; find roll-label configuration.
4. **Labelprint24.de** — find roll-label product page.
5. **cewe-print.de** — if they offer roll labels, document; if not, note UNKNOWN.
6. **print24.com/de** — find their Etiketten auf Rolle or sticker-on-roll page.
7. **flyeralarm.de** — find roll-label or sticker-roll page.
8. **saxoprint.de** — find roll-label page.
9. **Any additional German/EU specialist label supplier** you find with at least one
   roll-label product page (e.g. Stickermule.de, meinabo-etiketten, etc.). Add up
   to 3 extras if they are meaningfully different.

For each competitor also note: whether they are a print broker vs. own production,
approximate company size/reputation (if findable in <2 min of browsing), and
whether they serve B2B, B2C, or both.

---

## Required research outputs

Produce the following sections IN ORDER. Each section must contain the required
tables. Do not skip a section; write UNKNOWN if genuinely not found.

### Section 1 — Competitor Overview Table

| Competitor | URL visited | B2B/B2C | Roll labels offered? | Specialist or generalist | Confidence |
|---|---|---|---|---|---|

### Section 2 — Option-by-Option Comparison Table

Columns: Competitor | Material options | Shape options | Size range | Roll direction options | Core size options | Winding direction | Quantity breaks | Colour (4c/1c/etc.) | Finish/laminate | Varnish | Adhesive types | Food-safe claim | Freezer/cold claim | Wet-environment claim | Confidence

One row per competitor. Use "N/A" if the option does not exist, "UNKNOWN" if you could not determine it.

### Section 3 — Proof, Data-Check & Upload Option Table

| Competitor | Datencheck offered? | Datencheck cost | Printed proof offered? | Proof cost | Proof turnaround | File formats accepted | Max file size | Design service offered? | Design service cost | Confidence |

### Section 4 — Quantity & Pricing Presentation Table

Document how each competitor presents quantity and price. Columns:
Competitor | Quantity break points | Price display method (table/dropdown/live calculator) | VAT shown? | Volume discount visible? | Custom quantity possible? | MOQ | Confidence

### Section 5 — Delivery & Express Options Table

| Competitor | Standard lead time | Express option? | Express surcharge | Same-day or next-day? | Confidence |

### Section 6 — Reorder & Artwork Management Table

| Competitor | Saved artwork / reorder feature? | How described | Account required? | Confidence |

### Section 7 — Design Service & Trust Signals Table

| Competitor | Design/layout service? | Price | Conditions (e.g. free above X EUR) | Certifications shown near config? (ISO, FSC, etc.) | Money-back or satisfaction guarantee? | Confidence |

### Section 8 — UX / Configuration Flow Notes

For each competitor, write 3-6 bullet points describing the configuration UX:
step order, how many steps, whether price updates live, any notable friction points
or friction-reducing features. Cite the URL for each observation.

### Section 9 — Must-Have, Nice-to-Have, Avoid Variant Analysis

Based on the evidence above, produce three sub-tables for Labelpilot.de:

**9a — Must-Have Variants (implement in Phase 1)**
| Variant / Option | Rationale (evidence from research) | Implementation complexity estimate (Low/Med/High) |

**9b — Nice-to-Have Variants (Phase 2 or later)**
| Variant / Option | Rationale | When to add |

**9c — Variants to Avoid in Early Phase**
| Variant / Option | Rationale (why it adds complexity without proportional value for Labelpilot's target segment) |

### Section 10 — Pricing Implications

For any variant found in Section 9a or 9b that has a direct pricing implication
(e.g. premium material uplift, adhesive type surcharge), note it here. Format:

| Variant | Typical market price delta observed | Source URL | Confidence |

### Section 11 — Implementation Recommendations for Labelpilot.de

Classify every recommendation as exactly one of: IMPLEMENT NOW / IMPLEMENT LATER / NEVER.

Format:
| Recommendation | Classification | One-line rationale |
|---|---|---|

"IMPLEMENT NOW" = concrete competitive gap or table-stakes feature for the German
roll-label market that Labelpilot.de is currently missing or underspecified.
"IMPLEMENT LATER" = real value but not blocking launch or first 6 months.
"NEVER" = adds complexity/cost without meaningful conversion or revenue impact for
Labelpilot's fixed-price B2B model.

### Section 12 — Confidence Summary & Gaps

List the 5 most important things you could NOT confirm (UNKNOWN findings) and
suggest a follow-up action for each (e.g. "request a sample order to check UX",
"email their sales team", "check again in 3 months").

---

## Final reminders

- Every factual row in every table must include the source URL in a "Source" column
  or inline citation, unless already captured in the Confidence column.
- If a page requires JavaScript to load configuration options and you cannot access
  the dynamic content, state that explicitly and try a cached/alternative URL.
- Do not pad the report. If a competitor has only 3 relevant differences, do not
  invent more. Quality over quantity.
- The audience is a solo founder building a custom Next.js e-commerce site; be
  concrete about what to build, not about general best practices.
