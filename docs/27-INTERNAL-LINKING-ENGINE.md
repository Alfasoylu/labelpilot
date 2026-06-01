# 27-INTERNAL-LINKING-ENGINE.md

# Labelpilot.de — Internal Linking Engine

## 1. Purpose

This document defines the internal linking strategy for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Internal linking must help:

- German B2B buyers find the right page
- Google understand page hierarchy
- AI systems understand entity relationships
- commercial pages receive authority
- content pages support conversion
- programmatic SEO pages avoid orphan status
- quote/sample/reorder pages receive traffic

Internal linking is not random navigation.

It is a conversion and SEO distribution system.

---

## 2. Strategic Verdict

The correct internal linking strategy is:

> Every public page links users toward relevant commercial pages, quote request, sample box, file requirements and reorder, while supporting clear topic clusters.

The wrong strategy is:

> Blog/content pages link nowhere, product pages are isolated, and CTA pages receive no internal authority.

No important page may be orphaned.

---

## 3. Required Source Documents

Before implementing internal linking, Codex must read:

```txt
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/22-PROGRAMMATIC-SEO-PLAN.md
/docs/23-KEYWORD-MAP-GERMANY.md
/docs/24-METADATA-MAP.md
/docs/26-SITEMAP-ROBOTS-CANONICAL.md
/docs/27-INTERNAL-LINKING-ENGINE.md
/docs/30-PRODUCT-CATALOG.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

All visible anchor text on public pages must be German.

Good anchor text:

```txt
Supplement-Etiketten drucken
Transparente PP-Etiketten
Musterbox anfordern
Etiketten nachbestellen
Druckdaten vorbereiten
```

Bad anchor text:

```txt
Click here
Learn more
Custom labels
Order now
```

Internal code identifiers may remain English.

---

## 5. Link Priority System

Internal links should follow priority.

### 5.1 P0 Commercial Pages

Highest priority:

```txt
/de/pp-rollenetiketten
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/etiketten-100x200
```

### 5.2 Conversion Pages

Must receive links from most commercial/content pages:

```txt
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
```

### 5.3 Trust/Process Pages

Support buyer confidence:

```txt
/de/produktion-versand
/de/kontakt
/de/versand
/de/widerruf
/de/datenschutz
/de/impressum
```

### 5.4 P1 Industry/Guide Pages

Support topical authority:

```txt
/de/kaffee-etiketten
/de/gewuerz-etiketten
/de/honig-marmelade-etiketten
/de/flaschenetiketten
/de/glasetiketten
/de/beuteletiketten
/de/ratgeber/*
/de/glossar/*
```

---

## 6. Link Types

Use these internal link types:

```txt
NAVIGATION
FOOTER
BREADCRUMB
CONTEXTUAL
RELATED_PAGE
CTA
FAQ_LINK
PRODUCT_CARD
PROGRAMMATIC_PARENT
PROGRAMMATIC_SIBLING
```

Each page should use multiple link types naturally.

Do not rely only on footer links.

---

## 7. Global Navigation Links

Main navigation should include:

```txt
Produkte
Branchen
Musterbox
Angebot anfordern
Nachbestellen
Druckdaten
Kontakt
```

Recommended primary nav structure:

```txt
Produkte
  PP-Rollenetiketten
  Opake PP-Etiketten
  Transparente PP-Etiketten
  Etiketten 100×200 mm
  Thermo-Versandetiketten

Branchen
  Lebensmitteletiketten
  Supplement-Etiketten
  Getränkeetiketten
  Kaffee-Etiketten
  Gewürz-Etiketten

Ratgeber
  Druckdaten vorbereiten
  PP vs. Papier
  Transparent vs. Opak
```

Primary CTA button:

```txt
Angebot anfordern
```

Secondary CTA:

```txt
Musterbox
```

---

## 8. Footer Links

Footer must include important pages.

Recommended footer groups:

### Produkte

```txt
PP-Rollenetiketten
Opake PP-Etiketten
Transparente PP-Etiketten
Etiketten 100×200 mm
Thermo-Versandetiketten
```

### Branchen

```txt
Lebensmitteletiketten
Supplement-Etiketten
Getränkeetiketten
Kaffee-Etiketten
Gewürz-Etiketten
```

### Service

```txt
Angebot anfordern
Musterbox anfordern
Etiketten nachbestellen
Druckdaten
Produktion & Versand
Kontakt
```

### Rechtliches

```txt
Impressum
Datenschutz
AGB
Versand
Widerruf
```

Footer links are not enough for SEO by themselves, but they prevent orphaning.

---

## 9. Breadcrumb Rules

Every nested public page should show breadcrumbs.

Examples:

```txt
Startseite > Produkte > Transparente PP-Etiketten
Startseite > Branchen > Supplement-Etiketten
Startseite > Ratgeber > PP-Etiketten vs. Papieretiketten
Startseite > Glossar > PP-Etiketten
```

Breadcrumb schema must match visible breadcrumb.

Breadcrumbs help users, SEO and AI systems.

---

## 10. Homepage Link Requirements

Homepage `/de` must link to:

```txt
/de/pp-rollenetiketten
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
```

Homepage must not link to low-priority glossary pages above commercial pages.

---

## 11. Product Page Link Requirements

Each product page must link to:

1. Quote request page.
2. Sample box page.
3. Reorder page.
4. File requirements page.
5. Related product pages.
6. Relevant industry pages.

Example: `/de/transparente-pp-etiketten`

Must link to:

```txt
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/getraenke-etiketten
/de/flaschenetiketten
/de/glasetiketten
/de/opake-pp-etiketten
/de/etiketten-100x200
```

Example: `/de/opake-pp-etiketten`

Must link to:

```txt
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/kaffee-etiketten
/de/gewuerz-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
```

---

## 12. Industry Page Link Requirements

Each industry page must link to:

1. Best matching product pages.
2. Quote page.
3. Sample box page.
4. File requirements page.
5. Reorder page.
6. Related industries.

Example: `/de/supplement-etiketten`

Must link to:

```txt
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
/de/nachbestellen
/de/ratgeber/transparente-vs-opake-etiketten
```

Example: `/de/lebensmittel-etiketten`

Must link to:

```txt
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/glasetiketten
/de/beuteletiketten
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
/de/nachbestellen
```

---

## 13. Guide Page Link Requirements

Guide pages must support commercial pages.

Every guide page must link to:

```txt
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
```

and at least two relevant product/industry pages.

Example: `/de/ratgeber/pp-etiketten-vs-papieretiketten`

Links to:

```txt
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/angebot-anfordern
/de/musterbox
```

Guide pages should not dead-end.

---

## 14. Glossary Page Link Requirements

Glossary pages must link to commercial pages.

Example: `/de/glossar/pp-etiketten`

Links to:

```txt
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/druckdaten
```

Glossary pages are support pages, not final conversion pages.

---

## 15. Programmatic Page Link Requirements

Every programmatic page must link to:

1. Parent industry page.
2. Parent material page.
3. Parent size page if relevant.
4. Quote request.
5. Sample box.
6. File requirements.
7. Reorder.
8. Related sibling page.

Example:

```txt
/de/supplement-etiketten/transparente-pp-etiketten
```

Must link to:

```txt
/de/supplement-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/musterbox
/de/druckdaten
/de/nachbestellen
/de/supplement-etiketten/opake-pp-etiketten
```

Programmatic pages without links should not be published.

---

## 16. Conversion Link Rules

Every commercial/content page should include conversion CTAs.

Primary conversion links:

```txt
/de/angebot-anfordern
/de/musterbox
```

Reorder link where relevant:

```txt
/de/nachbestellen
```

File page link where relevant:

```txt
/de/druckdaten
```

Example CTA block:

```txt
Benötigen Sie PP-Rollenetiketten für Ihre Produktverpackung?
Fordern Sie ein B2B-Angebot an oder bestellen Sie zuerst eine Musterbox.
```

Buttons:

```txt
Angebot anfordern
Musterbox anfordern
```

---

## 17. Anchor Text Rules

Anchor text must be descriptive.

Good:

```txt
Supplement-Etiketten drucken
Transparente PP-Etiketten für Flaschen
Druckdaten für Etiketten vorbereiten
Etiketten nachbestellen
```

Bad:

```txt
hier klicken
mehr
Link
weiter
```

Avoid overusing exact same anchor everywhere.

Use natural German variations.

---

## 18. Internal Link Density

Recommended per page:

| Page Type | Internal Links |
|---|---:|
| Homepage | 15–30 |
| Product page | 8–15 |
| Industry page | 8–15 |
| Guide page | 6–12 |
| Glossary page | 4–8 |
| Programmatic page | 6–10 |
| Legal page | minimal |

Do not overload pages with irrelevant links.

Links must help user intent.

---

## 19. Orphan Page Rule

No indexable page may be orphaned.

A page is orphaned if:

1. It is in sitemap but has no internal links pointing to it.
2. It is indexable but not linked from navigation, footer, hub, parent or related page.
3. It is only accessible by direct URL.

Codex must avoid orphan pages.

---

## 20. Link Graph Priority

Internal authority should flow like this:

```txt
Homepage
→ P0 commercial pages
→ Conversion pages
→ P1 industry/product pages
→ Guides
→ Glossary
→ Programmatic child pages
```

But child pages must also link back to parents.

---

## 21. Hub Page Requirements

Create/use hub pages when page count grows.

Recommended hubs:

```txt
/de/produkte
/de/branchen
/de/ratgeber
/de/glossar
```

Hub pages must list relevant child pages.

Do not create hub pages if empty.

---

## 22. Related Links Component

Recommended component:

```txt
components/content/RelatedLinks.tsx
```

It should accept:

```ts
{
  title: string
  links: Array<{
    href: string
    label: string
    description?: string
  }>
}
```

Visible text must be German.

---

## 23. CTA Component

Recommended component:

```txt
components/content/ContentCta.tsx
```

Reusable CTA variants:

```txt
quote
sample
reorder
file
contact
```

German labels:

```txt
Angebot anfordern
Musterbox anfordern
Etiketten nachbestellen
Druckdaten vorbereiten
Kontakt aufnehmen
```

---

## 24. Internal Link Data Source

Recommended file:

```txt
data/internal-links.ts
```

or:

```txt
config/internal-links.ts
```

Each page can define:

```ts
{
  path: "/de/supplement-etiketten",
  related: [
    { href: "/de/opake-pp-etiketten", label: "Opake PP-Etiketten" },
    { href: "/de/transparente-pp-etiketten", label: "Transparente PP-Etiketten" }
  ],
  ctas: [
    { href: "/de/angebot-anfordern", label: "Angebot anfordern" }
  ]
}
```

Do not hardcode related links inconsistently.

---

## 25. Footer vs Contextual Links

Footer links help crawlability.

Contextual links help relevance more.

Every important page should have contextual links in body content.

Example:

```txt
Für Supplement-Dosen eignen sich je nach Verpackung opake PP-Etiketten oder transparente PP-Etiketten.
```

Links:

- opake PP-Etiketten
- transparente PP-Etiketten

Do not rely only on footer.

---

## 26. FAQ Link Rules

FAQ answers may include internal links where helpful.

Example:

```txt
Welche Druckdateien werden akzeptiert?
Die Anforderungen finden Sie auf der Seite Druckdaten für Etiketten.
```

Link to:

```txt
/de/druckdaten
```

Do not stuff every FAQ answer with links.

---

## 27. Links to Quote Page

The quote page `/de/angebot-anfordern` must receive links from:

```txt
all P0 commercial pages
all product pages
all industry pages
all guide pages with commercial intent
programmatic pages
homepage
footer
navigation CTA
```

Quote page is high-value.

---

## 28. Links to Sample Box Page

The sample box page `/de/musterbox` must receive links from:

```txt
homepage
product pages
industry pages
comparison guides
programmatic pages
footer
navigation
```

Sample box helps overcome trust friction.

---

## 29. Links to Reorder Page

The reorder page `/de/nachbestellen` must receive links from:

```txt
homepage
product pages
industry pages
customer portal
order completion page
guide pages about repeat orders
footer
```

Reorder is the LTV engine.

Do not hide it.

---

## 30. Links to Druckdaten Page

The file requirements page `/de/druckdaten` must receive links from:

```txt
product pages
checkout/configuration
upload UI
quote page
guide pages
FAQ answers
footer
```

This page reduces support workload.

---

## 31. Broken Link Prevention

Codex must avoid broken internal links.

Rules:

1. Link only to existing or planned routes.
2. If page does not exist yet, create placeholder only if route is approved.
3. Do not link to draft pages in production.
4. Run checks if available.
5. Keep route registry central.

---

## 32. Noindex Link Rules

It is okay to link to account/checkout from user actions, but not as SEO links.

Examples:

```txt
/konto/bestellungen
/checkout
```

These should be noindex.

Do not include in sitemap.

Do not include in SEO related links.

---

## 33. Internal Linking QA Checklist

Before production:

| Check | Required |
|---|---|
| Homepage links to P0 pages | Yes |
| P0 pages link to quote page | Yes |
| P0 pages link to sample box | Yes |
| Product pages link to related industries | Yes |
| Industry pages link to related products | Yes |
| Guides link to commercial pages | Yes |
| Glossary links to commercial pages | Yes |
| Programmatic pages link to parents | Yes |
| No orphan indexable pages | Yes |
| No broken internal links | Yes |
| German anchor text | Yes |
| No excessive irrelevant links | Yes |

---

## 34. Common Mistakes to Avoid

Do not:

1. Use “hier klicken” everywhere.
2. Rely only on footer.
3. Publish orphan pages.
4. Link programmatic pages only one-way.
5. Link to non-existent pages.
6. Link to noindex pages as SEO related links.
7. Hide quote/sample CTAs.
8. Forget reorder links.
9. Forget file requirements links.
10. Use English anchor text.
11. Overlink irrelevant pages.
12. Create circular links without hierarchy.

---

## 35. Codex Implementation Rules

Codex must:

1. Use a central route/link registry where possible.
2. Add related links to every P0 page.
3. Add CTA links to every commercial/content page.
4. Use German anchor text.
5. Keep internal links aligned with keyword map.
6. Prevent orphan pages.
7. Update this document if link strategy changes.
8. Report broken or missing target pages.
9. Do not add unrelated print category links.

---

## 36. Acceptance Criteria

Internal linking implementation is accepted when:

| Check | Required Result |
|---|---|
| Main navigation exists | PASS |
| Footer links exist | PASS |
| Breadcrumbs exist | PASS |
| Homepage links to P0 pages | PASS |
| Product pages link to industries | PASS |
| Industry pages link to products | PASS |
| Guides link to commercial pages | PASS |
| Quote page receives links | PASS |
| Sample box page receives links | PASS |
| Reorder page receives links | PASS |
| Druckdaten page receives links | PASS |
| No orphan indexable pages | PASS |
| Anchor text is German | PASS |

---

## 37. Final Verdict

The correct internal linking system is:

> Every page supports a clear commercial path: understand product, compare options, request quote, request sample, prepare file or reorder.

The wrong system is:

> Pages exist but do not help each other or convert.

Internal links are not decoration. They are the sales paths and SEO wiring of Labelpilot.de.
