# 26-SITEMAP-ROBOTS-CANONICAL.md

# Labelpilot.de — Sitemap, Robots and Canonical Rules

## 1. Purpose

This document defines sitemap, robots.txt and canonical URL rules for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

This document controls:

- which pages are indexable
- which pages go into sitemap
- which pages must be blocked/noindexed
- canonical URL format
- robots.txt rules
- route registry requirements
- private route exclusion
- programmatic SEO publishing safety

This file is the source of truth for Codex when implementing `app/sitemap.ts`, `app/robots.ts`, canonical metadata and SEO route governance.

---

## 2. Strategic Verdict

The correct technical SEO control system is:

> Only useful German public pages are indexable, every indexable page has a self-canonical, sitemap includes only approved pages, and private/system routes are excluded.

The wrong system is:

> Everything gets indexed, including admin, account, checkout, API routes, draft programmatic pages and duplicate pages.

Index control protects SEO quality.

---

## 3. Required Source Documents

Before implementing sitemap/robots/canonical logic, Codex must read:

```txt
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/25-SCHEMA-MARKUP-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

All indexable MVP URLs are German-language pages.

Allowed indexable public paths:

```txt
/de
/de/*
```

Not allowed in MVP:

```txt
/en
/en/*
English public pages
mixed-language pages
```

Private account routes may use `/konto`, but they are noindex and must not appear in sitemap.

Campaign landing pages may use `/lp/[slug]`, but they are German-only paid-traffic pages and must stay `noindex`, excluded from sitemap, and non-canonical.

---

## 5. Canonical Domain

Canonical production domain:

```txt
https://labelpilot.de
```

Canonical homepage:

```txt
https://labelpilot.de/de
```

Rules:

1. Use `https`.
2. Use no trailing slash unless framework normalizes it.
3. Use lowercase paths.
4. Do not canonical to preview domains.
5. Do not canonical to localhost.
6. Do not canonical to English pages in MVP.

---

## 6. Canonical URL Rules

Every indexable page must have a self-canonical.

Examples:

```txt
/de → https://labelpilot.de/de
/de/supplement-etiketten → https://labelpilot.de/de/supplement-etiketten
/de/transparente-pp-etiketten → https://labelpilot.de/de/transparente-pp-etiketten
```

Rules:

1. Canonical must match final public URL.
2. Canonical must not include query parameters.
3. Canonical must not include tracking parameters.
4. Canonical must not point to homepage unless the page is intentionally duplicate/noindexed.
5. Programmatic pages self-canonical only after quality approval.
6. Private pages should be noindex and generally do not need SEO canonical.

---

## 7. URL Normalization Rules

Preferred URL style:

```txt
lowercase
hyphen-separated
German readable slugs
no trailing slash
no query parameters for indexable pages
```

Good:

```txt
/de/supplement-etiketten
/de/etiketten-100x200
/de/ratgeber/pp-etiketten-vs-papieretiketten
```

Bad:

```txt
/de/Supplement-Etiketten
/de/supplement_etiketten
/de/supplement-etiketten/?utm_source=test
/de/label-printing-germany
```

---

## 8. Sitemap Implementation

Required file:

```txt
app/sitemap.ts
```

The sitemap should be generated from a central route registry.

Recommended route registry:

```txt
config/seo-routes.ts
```

or:

```txt
lib/seo/routes.ts
```

Do not manually duplicate route lists in multiple places.

---

## 9. Sitemap Must Include

The sitemap must include:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/pp-rollenetiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
/de/musterbox
/de/angebot-anfordern
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
/de/kontakt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

P1/content/programmatic pages may be included only after they pass QA.

---

## 10. Sitemap Must Exclude

The sitemap must exclude:

```txt
/admin
/admin/*
/konto
/konto/*
/checkout
/checkout/*
/lp
/lp/*
/api
/api/*
/checkout/success
/checkout/cancel
private uploaded files
signed file URLs
draft pages
test pages
preview-only pages
thin programmatic pages
filter pages
search result pages
```

No private customer or admin route may appear in sitemap.

No `/lp/*` campaign landing page may appear in sitemap.

---

## 11. Sitemap Entry Fields

Each sitemap entry should include:

```txt
url
lastModified
changeFrequency
priority
```

Recommended priorities:

| Page Type | Priority |
|---|---:|
| Homepage | 1.0 |
| P0 commercial pages | 0.9 |
| Quote/sample/reorder pages | 0.8 |
| Product pages | 0.8 |
| P1 industry pages | 0.7 |
| Guides | 0.6 |
| Glossary | 0.5 |
| Legal pages | 0.3 |

Recommended change frequency:

| Page Type | Change Frequency |
|---|---|
| Homepage | weekly |
| Commercial pages | weekly |
| Product pages | weekly |
| Content/guides | monthly |
| Glossary | monthly |
| Legal pages | yearly |

Do not overstate update frequency if pages are static.

---

## 12. Route Registry Requirements

Every SEO route should define:

```ts
{
  path: "/de/supplement-etiketten",
  indexable: true,
  sitemap: true,
  priority: 0.9,
  changeFrequency: "weekly",
  canonical: "https://labelpilot.de/de/supplement-etiketten",
  pageType: "commercial"
}
```

Private routes:

```ts
{
  path: "/admin",
  indexable: false,
  sitemap: false
}
```

Rules:

1. Metadata map and sitemap route registry must align.
2. If a page is noindex, it must not be in sitemap.
3. If a page is in sitemap, it must have metadata.
4. If a page is in sitemap, it must be canonical.

---

## 13. Robots.txt Implementation

Required file:

```txt
app/robots.ts
```

Production robots should allow public pages and disallow private/system routes.

Recommended robots:

```txt
User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /konto
Disallow: /konto/
Disallow: /checkout
Disallow: /checkout/
Disallow: /api
Disallow: /api/

Sitemap: https://labelpilot.de/sitemap.xml
```

Rules:

1. Do not disallow `/de`.
2. Do not disallow public SEO pages.
3. Do not rely only on robots for private security.
4. Private routes must also require auth/noindex.
5. Uploaded files should not be public crawlable.

---

## 14. Noindex Rules

Use metadata noindex for:

```txt
/admin/*
/konto/*
/checkout/*
/api/*
success/cancel pages
search pages
draft pages
test pages
```

Noindex metadata:

```txt
robots: {
  index: false,
  follow: false
}
```

or equivalent.

Rules:

1. Noindex private/system pages.
2. Do not include noindex pages in sitemap.
3. Do not accidentally noindex P0 pages.
4. Do not use robots.txt as the only protection for private pages.

---

## 15. P0 Indexable Route List

These are launch-critical indexable pages:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/pp-rollenetiketten
/de/etiketten-100x200
/de/thermo-versandetiketten
/de/musterbox
/de/angebot-anfordern
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
/de/kontakt
```

All must have:

1. German metadata.
2. Canonical.
3. Sitemap entry.
4. Index/follow.
5. Internal links.
6. No private data.
7. No placeholder content.

---

## 16. Legal Page Index Rules

Legal pages may be indexable:

```txt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

They should be included in sitemap with low priority.

Reason:

- trust
- compliance
- transparency

Legal pages must be reviewed before production.

---

## 17. Programmatic Page Index Rules

Programmatic pages are indexable only if they pass quality gate.

Requirements:

1. Unique H1.
2. Unique metadata.
3. Unique direct answer.
4. Spec table.
5. FAQ.
6. Internal links.
7. CTA.
8. Compliance disclaimer where needed.
9. Schema.
10. No duplicate content.

If not passed:

```txt
indexable: false
sitemap: false
```

Do not put draft programmatic pages into sitemap.

---

## 18. Guide/Glossary Page Index Rules

Guides and glossary pages may be indexable if:

1. German content.
2. Useful explanation.
3. Internal links to commercial pages.
4. Metadata exists.
5. Not thin.
6. Not duplicated.

Glossary pages should not outnumber commercial pages too early.

Commercial pages remain priority.

---

## 19. Checkout Route Rules

Checkout routes must be noindex.

Campaign landing pages under `/lp/[slug]` must also be noindex and must never outrank `/de/*` canonical SEO pages.

Examples:

```txt
/checkout
/checkout/success
/checkout/cancel
```

Rules:

1. Do not put checkout pages in sitemap.
2. Do not let success/cancel pages index.
3. Success/cancel pages may use noindex metadata.
4. Payment confirmation must not rely on indexed pages.

---

## 20. Customer Portal Route Rules

Customer portal routes:

```txt
/konto
/konto/*
```

Rules:

1. noindex,nofollow.
2. not in sitemap.
3. protected by auth.
4. no private data exposed to crawlers.
5. no public file URLs.

---

## 21. Admin Route Rules

Admin routes:

```txt
/admin
/admin/*
```

Rules:

1. noindex,nofollow.
2. not in sitemap.
3. protected by ADMIN role.
4. blocked in robots.
5. no public links from site navigation.
6. server-side auth required.

---

## 22. API Route Rules

API routes:

```txt
/api/*
```

Rules:

1. not in sitemap.
2. disallowed in robots.
3. noindex if page-like response exists.
4. validate auth/security.
5. never expose secrets.

---

## 23. Uploaded File Rules

Uploaded artwork/proof files must not be indexable.

Rules:

1. Private storage bucket.
2. Signed URLs only.
3. No public permanent URLs.
4. No sitemap inclusion.
5. No public directory listing.
6. No search engine access.
7. Customer ownership enforced.

Robots is not enough. Storage must be private.

---

## 24. Query Parameter Rules

Indexable pages should not depend on query parameters.

No sitemap URLs with:

```txt
?utm_source=
?variant=
?sort=
?filter=
?session_id=
```

Canonical should strip query parameters.

Filter/sort/search pages should be noindex unless intentionally designed later.

---

## 25. Redirect Rules

Recommended redirects:

```txt
/ → /de
```

If any old/alternate paths exist, redirect to canonical German paths.

Examples:

```txt
/de/supplement-labels → /de/supplement-etiketten
/de/food-labels → /de/lebensmittel-etiketten
```

Do not create English public pages in MVP.

---

## 26. Hreflang Rules

MVP has only German.

No hreflang required unless multiple languages are added.

If English is added later:

```txt
de-DE
en
x-default
```

must be documented separately.

Do not add incomplete hreflang.

---

## 27. Sitemap QA Checklist

Before production:

| Check | Required |
|---|---|
| `/sitemap.xml` loads | Yes |
| P0 pages included | Yes |
| Legal pages included | Yes |
| Private pages excluded | Yes |
| Checkout pages excluded | Yes |
| API routes excluded | Yes |
| Programmatic drafts excluded | Yes |
| URLs use `https://labelpilot.de` | Yes |
| URLs are canonical | Yes |
| No localhost URLs | Yes |
| No preview URLs | Yes |

---

## 28. Robots QA Checklist

Before production:

| Check | Required |
|---|---|
| `/robots.txt` loads | Yes |
| Allows public pages | Yes |
| Disallows `/admin` | Yes |
| Disallows `/konto` | Yes |
| Disallows `/checkout` | Yes |
| Disallows `/api` | Yes |
| Sitemap line exists | Yes |
| Does not block `/de` | Yes |
| Does not block CSS/JS assets | Yes |

---

## 29. Canonical QA Checklist

Before production:

| Check | Required |
|---|---|
| Every P0 page has canonical | Yes |
| Canonical uses production domain | Yes |
| Canonical is self-referencing | Yes |
| No localhost canonical | Yes |
| No preview canonical | Yes |
| No English canonical | Yes |
| Query params excluded | Yes |
| Duplicate pages noindexed or redirected | Yes |

---

## 30. Search Console Submission

After production launch:

1. Add property in Google Search Console.
2. Verify domain.
3. Submit sitemap:

```txt
https://labelpilot.de/sitemap.xml
```

Monitor:

```txt
indexing status
canonical issues
excluded pages
404 errors
robots blocked pages
mobile usability
search queries
```

---

## 31. Common Mistakes to Avoid

Do not:

1. Put admin routes in sitemap.
2. Put customer account routes in sitemap.
3. Put checkout success pages in sitemap.
4. Use localhost URLs in sitemap.
5. Use preview Vercel URLs as canonical.
6. Accidentally noindex P0 pages.
7. Index draft programmatic pages.
8. Add noindex pages to sitemap.
9. Let private uploaded files be public.
10. Add English URLs in MVP.
11. Forget sitemap line in robots.
12. Block `/de` in robots.

---

## 32. Codex Implementation Rules

Codex must:

1. Implement `app/sitemap.ts`.
2. Implement `app/robots.ts`.
3. Use central route registry.
4. Align metadata map and sitemap.
5. Exclude private/system routes.
6. Use production canonical domain.
7. Keep MVP German-only.
8. Add programmatic pages only after QA approval.
9. Run build checks.
10. Report route/indexing changes.

---

## 33. Acceptance Criteria

Sitemap/robots/canonical implementation is accepted when:

| Check | Required Result |
|---|---|
| Sitemap exists | PASS |
| Robots exists | PASS |
| P0 pages in sitemap | PASS |
| Private routes excluded | PASS |
| Checkout routes excluded | PASS |
| API routes excluded | PASS |
| Canonicals correct | PASS |
| Robots allows public pages | PASS |
| Robots blocks private/system routes | PASS |
| No localhost/preview URLs | PASS |
| No English MVP URLs | PASS |
| Programmatic drafts excluded | PASS |

---

## 34. Final Verdict

The correct technical SEO control system is:

> Sitemap includes only approved German public pages, robots blocks private/system routes, and every indexable page has a clean self-canonical.

The wrong system is:

> Index everything and clean it later.

Technical SEO mistakes compound fast. Control indexing from day one.
