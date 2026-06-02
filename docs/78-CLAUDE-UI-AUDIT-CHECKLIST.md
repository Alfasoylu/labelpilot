# 78-CLAUDE-UI-AUDIT-CHECKLIST.md

# Labelpilot.de — Claude UI Audit Checklist

> **Audit basis (active source of truth):** judge the site against `00-SOURCE-OF-TRUTH.md` decision #14 and the warm **Ivory Industrial Premium** system in `78-PUBLIC-WEBSITE-DESIGN-SYSTEM.md` — a premium German B2B roll-label manufacturer, German-only customer UI, quote/sample/reorder conversion, anti-AI design rules, **no heavy animation/3D**, and **no generic print-category drift**. **Blue is NOT the brand colour** (proof-blue is a tiny technical accent only). Do **not** audit against the superseded navy/blue docs `76-UI-DESIGN-SYSTEM-GERMAN-B2B.md` / `77-CODEX-UI-REDESIGN-PROMPT.md`.

## 1. Purpose

This document defines the UI audit checklist for Claude Code after Codex performs the redesign.

Claude must judge the site brutally.

The goal is not to be polite.

The goal is to decide whether the site looks good enough for German B2B buyers.

---

## 2. Audit Verdict Format

Claude must output one of:

```txt
PASS
PASS WITH FIXES
FAIL
```

Definitions:

```txt
PASS = ready to deploy
PASS WITH FIXES = small issues, fix before scale
FAIL = design damages trust/conversion
```

If unsure, choose the stricter verdict.

---

## 3. Required Reading

Claude must read (active sources of truth):

```txt
/docs/00-SOURCE-OF-TRUTH.md                  (decision #14 — locked visual direction)
/docs/78-PUBLIC-WEBSITE-DESIGN-SYSTEM.md     (active warm Ivory Industrial Premium system)
/docs/rakip_analizi_ve_stil_rehberi.md       (active style guide + anti-AI rules)
/docs/00-PROJECT-BRIEF.md                    (positioning, German-only, non-negotiables)
/docs/73-2026-EXPERT-GEO-SEO-TIPS.md
/docs/74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md
```

Do NOT audit against `76-UI-DESIGN-SYSTEM-GERMAN-B2B.md` or `77-CODEX-UI-REDESIGN-PROMPT.md` — both are SUPERSEDED / historical (the old navy/blue SaaS direction) and must not be used as the design basis.

---

## 4. High-Level Design Audit

Answer:

```txt
Does the site look like a serious German B2B label infrastructure platform?
```

Not acceptable:

```txt
cheap print shop
generic AI landing page
unfinished Tailwind demo
sticker toy website
crowded catalog
navy/blue SaaS identity (blue is not the brand colour)
heavy animation / 3D / WebGL / spinning logo / parallax
generic print categories (flyers, business cards, posters, etc.)
```

If it looks generic, verdict is FAIL.

---

## 5. Homepage Audit

Check:

| Item | Required |
|---|---|
| H1 communicates PP labels + reorder/software moat | PASS |
| Hero looks premium | PASS |
| CTA visible above fold | PASS |
| Secondary CTA visible | PASS |
| Trust bar present | PASS |
| Reorder workflow visible | PASS |
| Product cards structured | PASS |
| Sample box CTA clear | PASS |
| Mobile hero clean | PASS |

Fail if homepage only says:

```txt
we print labels
```

without explaining saved designs/reorder.

---

## 6. Header Audit

Check:

```txt
logo clear
navigation not crowded
German labels
primary CTA visible
mobile menu works
subtle styling
no generic print categories
```

Fail if header includes:

```txt
Flyer
Visitenkarten
Poster
Sticker allgemein
```

---

## 7. Footer Audit

Check:

```txt
legal links visible
product links
industry links
service links
not cluttered
German labels
```

---

## 8. Product Page Audit

For product pages, check:

```txt
clear H1
Kurzantwort
spec table
material explanation
pricing/packages if available
reorder benefit
FAQ
related links
CTA
```

Fail if product page is just plain text paragraphs.

---

## 9. Industry Page Audit

For supplement/food/beverage pages, check:

```txt
industry-specific content
recommended materials
legal disclaimer
reorder workflow
quote/sample CTA
FAQ
```

Supplement page must mention:

```txt
Lotnummer
SKT
variable Daten
```

If supplement page looks generic, FAIL.

---

## 10. Form Audit

For quote/sample/contact forms, check:

```txt
labels clear
German validation
good spacing
privacy checkbox
structured sections
submit button visible
success state
mobile usability
```

Fail if forms look like default browser forms.

---

## 11. Visual System Audit

Check:

```txt
consistent spacing
consistent cards
consistent buttons
consistent typography
good contrast
premium whitespace
no random colors
no heavy gradients
no cartoon icons
```

If every section feels visually different, FAIL.

---

## 12. Mobile Audit

Test widths:

```txt
375px
390px
430px
768px
1024px
```

Check:

```txt
no broken header
no horizontal overflow
CTA visible
forms usable
tables scroll properly
cards stack cleanly
text readable
```

Mobile failure = PASS WITH FIXES or FAIL depending severity.

---

## 13. SEO Safety Audit

Check that redesign did not break:

```txt
German content
metadata
canonical
schema
sitemap
robots
internal links
visible FAQ
visible direct answer
```

Fail if important SEO content disappeared.

---

## 14. Performance Audit

Check:

```txt
no unnecessary animation library
no Fabric/Konva loaded
no heavy editor code
images optimized
public pages lightweight
```

Fail if redesign adds heavy dependencies for no reason.

---

## 15. Conversion Audit

Check each main page has clear next action:

```txt
Angebot anfordern
Musterbox anfordern
Druckdaten vorbereiten
Nachbestellen
Kontakt aufnehmen
```

Fail if users do not know what to do next.

---

## 16. Trust Audit

Check visible trust elements:

```txt
technical file review
saved designs
reorder workflow
sample box
production/shipping clarity
legal disclaimer
privacy/legal links
```

Do not require fake testimonials.

Fail if site relies on fake trust.

---

## 17. Anti-Pattern Audit

Mark FAIL if any appears:

```txt
English CTA
generic print category drift
fake reviews
fake certifications
large walls of text
random gradients
tiny grey text
cheap colorful cards
inconsistent button styles
stock business people photos
```

---

## 18. Audit Output Format

Claude must output:

```txt
# UI Audit Verdict

Verdict: PASS / PASS WITH FIXES / FAIL

## Summary

## Critical Issues

## Page-by-Page Findings

### Homepage
### Product Pages
### Industry Pages
### Quote Page
### Sample Box Page
### Mobile
### SEO Safety

## Required Fixes

| Priority | Issue | File/Route | Fix |
|---|---|---|---|

## Blockers

## Final Recommendation
```

---

## 19. Release Rules

Deploy if:

```txt
PASS
```

Deploy after fixes if:

```txt
PASS WITH FIXES
```

Do not deploy if:

```txt
FAIL
```

---

## 20. Final Verdict

Claude must protect conversion quality.

A technically working site that looks cheap is not ready.

The design must make the buyer trust that Labelpilot.de can manage recurring label operations.
