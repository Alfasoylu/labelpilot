# Canonical phase = 2 (per doc 74).

# 49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 7 GEO Content Execution Prompt

## 1. Mission

Implement the GEO content engine for **Labelpilot.de**.

Goal:

```txt
German AI-readable content
direct answer blocks
industry/product/guide/glossary structure
FAQ schema where visible
internal links to quote/sample/reorder
content data source
no generic blog spam
```

GEO means Google + AI search readiness.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/68-PHASE-7-GEO-CONTENT-ENGINE.md
/docs/49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. German public content only.
2. No English pages.
3. No generic AI blog posts.
4. No legal compliance overclaims.
5. FAQ schema only if FAQ visible.
6. Every content page must link to commercial action.
7. Do not create hundreds of pages.
8. No city pages.
9. No non-core print products.
10. No thin pages.

---

## 4. Required Content Infrastructure

Create/update:

```txt
data/content-pages.ts
data/faqs.ts
data/glossary.ts
components/content/DirectAnswer.tsx
components/content/FaqSection.tsx
components/content/RelatedLinks.tsx
components/content/ContentCta.tsx
components/content/GlossaryDefinition.tsx
```

---

## 5. First Guide Pages

Implement only if quality is strong:

```txt
/de/ratgeber/pp-etiketten-vs-papieretiketten
/de/ratgeber/transparente-vs-opake-etiketten
/de/ratgeber/rollenetiketten-vs-bogenetiketten
/de/ratgeber/druckdaten-vorbereiten
```

Each must include:

```txt
H1
Kurzantwort
comparison/explanation
practical recommendation
FAQ
related links
CTA
metadata
schema
```

---

## 6. First Glossary Pages

Implement:

```txt
/de/glossar
/de/glossar/pp-etiketten
/de/glossar/rollenetiketten
/de/glossar/transparente-etiketten
/de/glossar/opake-etiketten
/de/glossar/thermoetiketten
/de/glossar/druckdaten
/de/glossar/proof
/de/glossar/beschnitt
```

Each glossary entry must link to commercial pages.

---

## 7. Direct Answer Requirement

Every GEO/content page must include:

```txt
Kurzantwort:
```

This must be visible near top.

No hidden-only content.

---

## 8. Internal Links

Every guide/glossary page must link to:

```txt
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
```

Relevant pages link to:

```txt
/de/nachbestellen
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
```

---

## 9. Schema

Use:

```txt
Article for guides
DefinedTerm for glossary
FAQPage only where FAQ visible
BreadcrumbList
```

No fake reviews/ratings.

---

## 10. Commands

Run:

```txt
npm run lint
npm run typecheck
npm run build
```

---

## 11. Required Report

Return:

```txt
## Summary
## Content Pages Added
## Components/Data Added
## Schema Added
## Internal Links Added
## Checks Run
## Acceptance Criteria
## Risks / Missing Items
## Next Step
```

---

## 12. Acceptance Criteria

| Check | Required |
|---|---|
| German content | PASS |
| Direct answers | PASS |
| Guides created | PASS |
| Glossary created | PASS |
| Internal links | PASS |
| CTAs | PASS |
| FAQ visible before schema | PASS |
| Metadata | PASS |
| No thin pages | PASS |
| No legal overclaims | PASS |

---

## 13. Final Instruction

Build content that can convert and be cited.

Do not create generic printing blog spam.
