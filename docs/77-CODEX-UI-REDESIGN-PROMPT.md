# 77-CODEX-UI-REDESIGN-PROMPT.md

> **SUPERSEDED — do not execute directly.**
> This redesign prompt targets the abandoned navy/blue "German B2B SaaS" direction (Trust-Blue `#2563EB` primary CTA, Inter-only typography, dashboard/SaaS-card hero). That direction is dead.
> Use `00-SOURCE-OF-TRUTH.md` decision #14 and the active warm-premium `78-PUBLIC-WEBSITE-DESIGN-SYSTEM.md` instead: Ivory Industrial Premium — warm ivory backgrounds, deep-ink CTA `#11100E`, brass accent `#B08A45`, soft warm borders, proof-blue only as a tiny technical accent (**blue is NOT the brand colour**), Instrument Sans + IBM Plex Sans/Mono. Kept for history only.

# Labelpilot.de — Codex UI Redesign Prompt

## 1. Mission

Redesign the existing Phase 1 Labelpilot.de site UI.

Important:

This is a UI/UX redesign task only.

Do not change business logic unless needed for component structure.

Do not implement new backend features.

Do not implement Stripe.

Do not implement admin.

Do not implement customer portal.

Do not implement template editor.

Do not create new programmatic SEO pages.

---

## 2. Required Reading

Before coding, read:

```txt
/docs/76-UI-DESIGN-SYSTEM-GERMAN-B2B.md
/docs/74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md
/docs/73-2026-EXPERT-GEO-SEO-TIPS.md
/docs/43-CODEX-PHASE-1-EXECUTION-PROMPT.md
/docs/24-METADATA-MAP.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/30-PRODUCT-CATALOG.md
```

If any file is missing, report it before coding.

---

## 3. Non-Negotiable Rules

1. Public UI must remain German.
2. Do not remove SEO metadata.
3. Do not break sitemap/robots/canonical.
4. Do not remove existing routes.
5. Do not create new indexable pages unless explicitly required.
6. Do not add generic print products.
7. Do not add English CTAs.
8. Do not implement future phases.
9. Do not use fake reviews/certifications/logos.
10. Do not make the site look like a cheap sticker/print shop.

---

## 4. Visual Goal

Transform the site into:

```txt
Modern German B2B SaaS + industrial label commerce
```

The site should feel:

```txt
premium
technical
calm
trustworthy
conversion-focused
German B2B
software-backed
```

It should not feel:

```txt
generic Tailwind template
cheap print shop
AI-generated landing page
playful sticker site
```

---

## 5. Required Design Direction

Use:

```txt
white and soft grey backgrounds
navy/dark slate text
blue primary CTA
subtle borders
consistent cards
strong whitespace
structured blocks
software-style process visuals
```

Recommended colors:

```txt
Primary Navy: #0B1220
Deep Slate: #111827
Text Dark: #172033
Muted Text: #64748B
Border: #E2E8F0
Soft Background: #F8FAFC
White: #FFFFFF
Trust Blue: #2563EB
Blue Hover: #1D4ED8
Soft Blue BG: #EFF6FF
```

---

## 6. Required Components

Create or refactor reusable components:

```txt
components/layout/Header.tsx
components/layout/Footer.tsx
components/sections/HeroSection.tsx
components/sections/TrustBar.tsx
components/sections/FeatureGrid.tsx
components/sections/ProcessSteps.tsx
components/sections/ReorderWorkflowBlock.tsx
components/sections/VariableDataBlock.tsx
components/sections/ContentCta.tsx
components/cards/ProductCard.tsx
components/cards/PricingCard.tsx
components/cards/SampleBoxCard.tsx
components/tables/ComparisonTable.tsx
components/tables/SpecTable.tsx
components/faq/FaqAccordion.tsx
components/legal/LegalNoticeBox.tsx
components/layout/Section.tsx
```

Adapt paths to existing repo structure.

---

## 7. Homepage Redesign Requirements

Homepage `/de` must include:

```txt
premium hero
trust bar
problem/solution section
top product cards
reorder workflow block
sample box block
industry cards
final CTA
```

Hero H1 should communicate the software moat, not just printing.

Suggested H1:

```txt
PP-Rollenetiketten, die Ihre Marke später schneller nachbestellen kann.
```

Subheadline:

```txt
Labelpilot.de speichert freigegebene Druckdaten, Material, Maß und Versionen, damit Lebensmittel-, Getränke- und Supplement-Marken Etiketten einfacher nachbestellen können.
```

Primary CTA:

```txt
Angebot anfordern
```

Secondary CTA:

```txt
Musterbox anfordern
```

---

## 8. Hero Visual Requirement

Do not use random stock photos.

Create a clean UI-style visual card showing:

```txt
Gespeichertes Design
Version v3 freigegeben
Material: Transparentes PP
Maß: 100×200 mm
Nächste Erinnerung: 25 Tage
Button: Nachbestellen
```

This visual can be pure HTML/CSS.

It should explain the business moat.

---

## 9. Product Page Redesign Requirements

For product pages:

```txt
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
```

Each should have:

```txt
Page hero
Kurzantwort card
Spec table
Pricing/package cards if data exists
Material explanation
Reorder benefit section
FAQ accordion
Related links
Final CTA
```

Do not present pages as long plain text.

---

## 10. Industry Page Redesign Requirements

For:

```txt
/de/supplement-etiketten
/de/lebensmittel-etiketten
/de/getraenke-etiketten
```

Each should have:

```txt
industry-specific hero
recommended materials
use cases
reorder workflow
legal disclaimer box
FAQ
quote/sample CTA
```

Supplement page should visually mention:

```txt
Lotnummer
SKT
Variable Daten
Excel-Upload later
```

Do not implement the backend.

Just communicate the workflow according to current page scope.

---

## 11. Quote Page Redesign Requirements

For `/de/angebot-anfordern`:

Design as serious B2B form.

Must include:

```txt
clear page intro
structured form sections
right-side summary/trust card
privacy checkbox
what happens next section
sample box alternative
```

German form section labels:

```txt
Unternehmen
Etikettenbedarf
Druckdaten
Nachricht
```

---

## 12. Sample Box Page Redesign Requirements

For `/de/musterbox`:

Must include:

```txt
sample box hero
contents cards
material comparison
who it is for
request form
quote CTA
```

Make it look like a controlled B2B qualification funnel, not a freebie.

---

## 13. Nachbestellen Page Redesign Requirements

For `/de/nachbestellen`:

Must visually explain:

```txt
stored designs
artwork versions
stock duration
30-day reminder
one-click reorder
```

Use process steps.

CTA:

```txt
Etiketten nachbestellen
```

If login/customer portal does not exist yet, CTA may point to quote/contact or show placeholder language.

---

## 14. Druckdaten Page Redesign Requirements

For `/de/druckdaten`:

Must include:

```txt
accepted formats
file checklist
proof process
common errors
technical review explanation
```

Use cards/tables, not plain paragraphs.

---

## 15. Forms

Improve all forms:

```txt
large labels
clear input spacing
2-column desktop
1-column mobile
German validation messages
privacy checkbox visible
success state styled
```

Do not make forms feel like default HTML.

---

## 16. Mobile Requirements

Test responsive layout at:

```txt
375px
390px
430px
768px
1024px
```

Must pass:

```txt
no horizontal overflow except intentional tables
CTA visible
forms readable
cards stack cleanly
header usable
```

---

## 17. SEO Safety

Do not break:

```txt
metadata
canonical
schema
sitemap
robots
internal links
German content
```

If component refactor affects content, verify visible text remains.

---

## 18. Performance Rules

Do not add heavy dependencies unless necessary.

Do not add animation libraries.

Do not add Fabric/Konva.

Do not add template editor.

Keep public pages lightweight.

---

## 19. Commands to Run

Run available:

```txt
npm run lint
npm run typecheck
npm run build
```

If a command does not exist, report honestly.

---

## 20. Required Final Report

Return:

```txt
## Summary
## Docs Read
## Files Changed
## Components Created/Updated
## Pages Redesigned
## SEO Safety Notes
## Checks Run
## Design Acceptance Criteria
## Missing / Deferred
## Next Recommended Step
```

No fake PASS.

---

## 21. Design Acceptance Criteria

| Check | Required |
|---|---|
| Looks German B2B, not cheap print shop | PASS |
| Homepage hero premium | PASS |
| Reorder/software moat visible | PASS |
| Product pages structured | PASS |
| Quote form premium | PASS |
| Sample box page strong | PASS |
| Mobile clean | PASS |
| German UI only | PASS |
| Existing routes preserved | PASS |
| SEO metadata not broken | PASS |
| No new scope creep | PASS |

---

## 22. Final Instruction

Redesign the site.

Do not rebuild the business.

The end result should make a German buyer think:

```txt
This is a serious label operations platform, not a cheap sticker printer.
```
