# Canonical phase = 12 (per doc 74).

# 51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Programmatic SEO Execution Prompt

## 1. Mission

Implement controlled programmatic SEO for **Labelpilot.de**.

Goal:

```txt
small high-intent German page matrix
data-driven route definitions
unique content
metadata
FAQ
schema
internal links
quality gate
no thin pages
```

Do not mass-generate pages.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. German pages only.
2. No city pages.
3. No hundreds of pages.
4. No thin pages.
5. No duplicate metadata.
6. No generic print categories.
7. No pages without FAQ.
8. No pages without internal links.
9. No sitemap inclusion before QA.
10. No legal overclaims.

---

## 4. First 3 Test Pages

Implement first:

```txt
/de/supplement-etiketten/transparente-pp-etiketten
/de/lebensmittel-etiketten/opake-pp-etiketten
/de/getraenke-etiketten/transparente-pp-etiketten
```

Do not add remaining programmatic pages until these pass quality.

---

## 5. Data Source

Create:

```txt
data/programmatic-pages.ts
```

Each page definition:

```txt
slug
industry
material
size
h1
title
description
directAnswer
specTable
sections
faqs
relatedLinks
indexable
```

---

## 6. Template

Create reusable route/template.

Each page must include:

```txt
Hero
Kurzantwort
use case
material explanation
spec table
quantity recommendation
file requirements
reorder block
compliance disclaimer if needed
FAQ
related links
CTA
```

---

## 7. Internal Links

Each programmatic page links to:

```txt
parent industry page
parent material page
/de/etiketten-100x200 if relevant
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
/de/nachbestellen
related sibling page
```

---

## 8. Metadata

Unique per page.

Formula:

```txt
[Material] für [Branche] drucken | Labelpilot.de
```

No duplicate descriptions.

---

## 9. Sitemap

Only include if:

```txt
indexable: true
quality gate passed
```

Drafts:

```txt
indexable: false
sitemap: false
```

---

## 10. Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
```

Manual:

```txt
visit each test page
check German content
check metadata
check direct answer
check FAQ
check internal links
check compliance disclaimer
check sitemap inclusion only if approved
```

---

## 11. Report

Return:

```txt
## Summary
## Programmatic Pages Added
## Data Structure
## Template
## Quality Gate
## Checks Run
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 12. Acceptance Criteria

| Check | Required |
|---|---|
| Data source exists | PASS |
| Template exists | PASS |
| First 3 pages exist | PASS |
| German content | PASS |
| Unique metadata | PASS |
| Direct answer | PASS |
| Spec table | PASS |
| FAQ | PASS |
| Internal links | PASS |
| CTA | PASS |
| No thin pages | PASS |

---

## 13. Final Instruction

Programmatic SEO must be controlled.

Quality beats page count.
