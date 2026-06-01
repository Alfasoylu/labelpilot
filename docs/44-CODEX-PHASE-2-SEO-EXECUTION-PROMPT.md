# 44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 2 SEO Execution Prompt

## 1. Mission

Implement Phase 2 SEO Foundation for **Labelpilot.de**.

The goal is to strengthen German SEO/GEO structure after the Phase 1 public site exists.

Focus on:

```txt
metadata completeness
schema correctness
internal linking
direct answer blocks
FAQ sections
breadcrumb structure
sitemap/robots alignment
P1 commercial pages
controlled guide pages
no thin content
```

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
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/28-CONTENT-TEMPLATES-GERMAN.md
/docs/63-PHASE-2-SEO-FOUNDATION.md
/docs/44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. German public content only.
2. No `/en`.
3. No generic print pages.
4. No keyword stuffing.
5. No hidden FAQ schema.
6. No fake reviews/ratings.
7. No legal compliance claims.
8. P0 pages must stay priority.
9. Do not create hundreds of programmatic pages.
10. Do not add city pages.

---

## 4. SEO Tasks

Implement or verify:

```txt
all P0 metadata
canonical URLs
Open Graph metadata
BreadcrumbList schema
FAQPage schema where visible FAQ exists
Product schema on product pages
Service schema on industry pages
Organization/WebSite schema on homepage
sitemap route registry
robots noindex rules
internal related links
German direct answer blocks
```

---

## 5. P1 Pages to Add Only If P0 Is Strong

Add selected P1 pages:

```txt
/de/kaffee-etiketten
/de/gewuerz-etiketten
/de/honig-marmelade-etiketten
/de/flaschenetiketten
/de/glasetiketten
/de/beuteletiketten
```

Each must have:

```txt
German H1
metadata
direct answer
specific use case
CTA
FAQ
internal links
compliance disclaimer if required
```

Do not create thin pages.

---

## 6. Guide Pages to Add Only If Quality Is High

Recommended first guides:

```txt
/de/ratgeber/pp-etiketten-vs-papieretiketten
/de/ratgeber/transparente-vs-opake-etiketten
/de/ratgeber/rollenetiketten-vs-bogenetiketten
/de/ratgeber/druckdaten-vorbereiten
```

Each guide must link to commercial pages.

---

## 7. Internal Linking

Every commercial/content page must link to:

```txt
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
```

Relevant pages must link to:

```txt
/de/nachbestellen
```

No orphan indexable pages.

---

## 8. Technical SEO

Verify:

```txt
/sitemap.xml
/robots.txt
canonical production URLs
no localhost canonicals
no preview canonicals
admin/konto/checkout excluded
```

---

## 9. Commands to Run

```txt
npm run lint
npm run typecheck
npm run build
```

If unavailable, report.

---

## 10. Required Report

Return:

```txt
## Summary
## Pages Added/Updated
## Metadata Updated
## Schema Added
## Internal Links Added
## Checks Run
## Acceptance Criteria
## Risks / Missing Items
## Next Step
```

---

## 11. Acceptance Criteria

| Check | Required |
|---|---|
| P0 metadata complete | PASS |
| Direct answer blocks exist | PASS |
| FAQ visible before schema | PASS |
| Schema valid by structure | PASS |
| Internal links added | PASS |
| Sitemap aligned | PASS |
| Robots aligned | PASS |
| No English public pages | PASS |
| No thin programmatic pages | PASS |
| No legal overclaims | PASS |

---

## 12. Final Instruction

Improve search foundations without polluting the site.

Qualified German B2B demand beats page count.
