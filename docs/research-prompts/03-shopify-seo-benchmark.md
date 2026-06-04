<!--
META
────────────────────────────────────────────────────────────────────────────────
Purpose   : Benchmark every SEO feature a fully-equipped Shopify store uses
            (native + top apps) and map each feature to what Labelpilot.de's
            custom Next.js site must build itself, prioritised as NOW / LATER /
            NEVER.
When to run : Before or immediately after launch (target launch 02.06.2026);
              re-run whenever a major Shopify SEO app releases a significant
              update or a new Google ranking signal is confirmed.
Results destination : docs/seo/shopify-seo-gap-analysis.md (create if absent).
                      Also note which existing Labelpilot MD docs need updating
                      (e.g. docs/seo/*, docs/tech/*, 00-SOT.md).
Owner     : Alperen Aydin <alperen_aydinn@hotmail.com>
────────────────────────────────────────────────────────────────────────────────
-->

# Deep-Research Prompt — Shopify SEO Benchmark for Labelpilot.de

## Instructions for the research model

You are a senior SEO engineer with access to live web browsing. Your task is
to produce an exhaustive, evidence-based benchmark comparing what a fully-
equipped Shopify store provides for SEO (via native features + the top third-
party apps) and then mapping every feature to whether Labelpilot.de's custom
Next.js site must build it from scratch.

**Hard rules — you MUST follow all of these:**

1. **Browse the web and cite every factual claim.** Every capability, number,
   price, or feature description must be followed by a source URL in the form
   `[Source: <URL>]`. If you cannot find a primary source for a claim, mark it
   explicitly as UNVERIFIED and do NOT present it as fact.

2. **Name real, live tools.** Do not invent product names. When you refer to
   an app or feature, name the actual product (e.g. "Yoast SEO for Shopify",
   "SEO King", "Plug in SEO") and link to its Shopify App Store listing or
   official documentation.

3. **Extract concrete data.** Prefer numbers, feature lists, and screenshots
   over generic advice. For example: "Yoast generates XML sitemaps with a
   maximum of X URLs per file" is better than "Yoast helps with sitemaps."

4. **Use comparison tables.** Present all findings in structured Markdown
   tables so they can be copy-pasted into a technical doc.

5. **Separate facts from assumptions.** Any cell in a table that is inferred
   rather than directly sourced must be flagged with an asterisk (*) and
   explained in a footnote. Give a confidence level — HIGH / MEDIUM / LOW —
   per key finding.

6. **End with IMPLEMENT NOW / LATER / NEVER recommendations** for
   Labelpilot.de, each with a one-line rationale and a rough effort estimate
   (S = < 1 dev-day, M = 1-3 dev-days, L = > 3 dev-days).

---

## Labelpilot.de context (the site you are advising — you have NO repo access)

| Attribute | Value |
|---|---|
| Site | labelpilot.de |
| Product | Individually printed PP roll labels (PP-Rollenetiketten), 100×200 mm main SKU |
| Language | German ONLY. No other language. |
| Target customers | German-speaking B2B buyers: food, beverage, supplement, private-label, small/medium packaged-product brands |
| Business model | Fixed-price quantity packages (1,000 / 2,000 / 5,000 / 10,000 labels) + self-serve add-ons (design service EUR 40, printed proof EUR 10, express, extra designs) + repeat orders with saved artwork |
| Design service rules | EUR 40; FREE if order value >= EUR 2,000 net OR if customer uploads print-ready data |
| Tech stack | Custom Next.js site (NOT Shopify) — must build all SEO infrastructure from scratch |
| Launch date | 02 June 2026 |
| Seller of record | Zhenkai Global Trading Limited (Hong Kong); DDP shipping from Turkey via DHL/UPS |
| 48-month target | 1,000 orders/month OR EUR 100,000/month revenue |
| Known SEO gaps | Unknown — this research must identify them |

---

## Research tasks

### Task 1 — Shopify native SEO features (no apps required)

Browse Shopify's official documentation and help centre (help.shopify.com) and
identify every SEO feature that is built into Shopify out of the box. For each
feature state:

- What it does (concrete description, not marketing copy)
- Any limits or edge cases (e.g. "canonical tags are auto-generated but cannot
  be overridden per-variant")
- Whether it is available on all Shopify plans or only higher tiers

Present as a table with columns:
`Feature | What it does | Limits / edge cases | Plan required | Source URL | Confidence`

Mandatory features to check (add others you find):
- Title tag and meta description editing (per page / per product / per
  collection / per blog post)
- Canonical URL control (auto vs. manual)
- XML sitemap generation (what is included, refresh frequency, format)
- robots.txt control (editable? from which plan?)
- Hreflang (multi-language/market stores)
- Structured data / JSON-LD (what schemas are emitted natively: Product,
  BreadcrumbList, Organization, WebSite, etc.)
- Image alt-text handling
- URL structure and slug control
- 301 / 302 redirect management (native UI)
- Broken-link detection (native)
- Page speed / Core Web Vitals tooling (native Shopify store speed report)
- Noindex controls (per page)
- Open Graph / Twitter Card tags
- Internal linking tools (native)
- Product feed generation (Google Merchant Center / Shopping)
- Blog / article SEO fields
- Collection / category page SEO fields
- Variant-level SEO (separate URLs, canonical handling)

---

### Task 2 — Top Shopify SEO apps (third-party)

Browse the Shopify App Store (apps.shopify.com) and independent reviews
(e.g. Shopify forums, G2, Capterra, YouTube tutorials, agency blogs published
in 2024 or 2025) to identify the top 8-12 Shopify SEO apps by install count
or rating. For each app, extract:

- App name and Shopify App Store URL
- Install count or rating (cite the page you read)
- Pricing (free tier? paid plans?)
- Feature list (be specific — copy from the app's own listing)
- What it adds BEYOND Shopify native SEO

Present as a table:
`App name | URL | Installs / Rating | Pricing | Key features beyond native | Source URL | Confidence`

Then produce a second table that maps every distinct SEO feature across all
apps to a single feature category (use the categories from Task 1 plus any
new ones you discover):

`Feature category | Covered natively by Shopify? | Which app(s) cover it? | Shopify-specific or universal?`

---

### Task 3 — Gap analysis for Labelpilot.de's custom Next.js site

For every feature category identified in Tasks 1 and 2, assess whether
Labelpilot.de must build it, and how:

`Feature category | Does Labelpilot.de need it? | Rationale | Next.js implementation approach | Effort (S/M/L) | Build NOW / LATER / NEVER`

Specific sub-topics to address:

**SEO metadata management**
- How should Next.js handle title / meta description per page type (product,
  category, blog, static)? What is the recommended pattern (generateMetadata,
  static export, CMS-driven)?

**Canonical URL control**
- Labelpilot has quantity variants (1000/2000/5000/10000) that may be URL
  params or separate routes. What canonical strategy avoids duplicate content?

**XML sitemap**
- What must be in the sitemap for a B2B label-printing product site? How
  should it be generated and submitted in Next.js?

**robots.txt**
- What should be disallowed for a site with checkout, account, and API routes?

**Schema / structured data**
- Which JSON-LD schemas are most valuable for Labelpilot.de? Recommended
  schemas: Product, Offer, Organization, WebSite (SiteLinksSearchBox),
  BreadcrumbList, FAQPage, LocalBusiness (if applicable). For each schema,
  state which properties Google actively uses for rich results (cite Google
  Search Central docs).

**Image optimisation**
- Next.js Image component covers most of this — what else must be done
  (AVIF/WebP, lazy loading, width/height attributes, CDN)?

**Broken-link monitoring**
- What open-source or low-cost tools can replace the paid Shopify apps for a
  custom Next.js site?

**301 redirects**
- How should redirects be managed in Next.js (next.config.js redirects vs.
  middleware vs. Vercel edge config)? What is the performance difference?

**Review schema**
- Labelpilot has no review platform yet. Should it add one (e.g. Trustpilot,
  Judge.me embedded)? What schema is emitted and does it get rich-result
  treatment in Germany?

**Product feed (Google Shopping)**
- Is Google Shopping relevant for B2B printed labels in Germany? Does
  Labelpilot need a product feed? What format (GMC XML feed vs. Merchant
  Center API)?

**Collection / category SEO**
- Labelpilot has one main product category. What H1/H2 structure, introductory
  copy length, and internal linking pattern does Google expect for a category
  page to rank competitively?

**Internal linking**
- For a site with few page types (home, product, category, blog, checkout),
  what internal-linking patterns have the highest SEO value?

**Page speed / Core Web Vitals**
- What CWV targets should Labelpilot set? Which Next.js / Vercel features
  address LCP, INP, CLS? Are there any Shopify-app equivalents (image
  compression, lazy loading, script manager) that Labelpilot must replicate?

**Hreflang**
- Site is German-only. Is hreflang needed at all? If Labelpilot later adds an
  English version, what is the correct implementation in Next.js?

**AI search / GEO / LLM visibility (Generative Engine Optimisation)**
- What are the current best practices (as of 2025-2026) for appearing in AI-
  generated answers (Google SGE / AI Overviews, Perplexity, Bing Copilot,
  ChatGPT browsing)? Does any Shopify app address this? What should
  Labelpilot do?

**Content-audit tools**
- What free or freemium tools (Screaming Frog, Ahrefs Webmaster Tools, Google
  Search Console) should Labelpilot connect at launch? Are there Shopify apps
  that wrap these tools and offer features a custom site cannot easily replicate?

**Blog / article SEO**
- Labelpilot has (or plans) a German-language blog. What metadata fields,
  schema types, and publishing patterns matter most for a B2B German blog?

**Product-variant SEO**
- Labelpilot's four quantity packages are either separate URLs or URL
  parameters. Research the canonical/noindex best practice for e-commerce
  sites with quantity variants. What does Google recommend?

---

### Task 4 — Competitor reference (ground truth)

Browse the live websites of these real competitors and document their actual
SEO implementation (view-source or browser DevTools where possible):

1. https://www.etikettenshop.de
2. https://www.etikett.de
3. https://www.mein-druck.de (or a similar German custom-label printer)
4. One international Shopify label store if you can find one (search: "custom
   labels shopify store Germany" or "Etiketten kaufen Shopify")

For each competitor, extract:
- Title tag format (example)
- Meta description format (example)
- JSON-LD schemas present (list type + key properties)
- Sitemap URL and approximate page count
- robots.txt notable rules
- Canonical tag usage
- Any structured data rich results visible in Google (search `site:domain.de`
  and note any rich snippets)
- Page speed / CWV scores from PageSpeed Insights (pagespeed.web.dev) —
  Mobile AND Desktop

Present as a table:
`Competitor | Title format | Schemas | Sitemap pages | CWV Mobile LCP | CWV Mobile INP | CWV Mobile CLS | Notable SEO choices | Source`

---

### Task 5 — Final recommendations for Labelpilot.de

Produce three lists:

**IMPLEMENT NOW** (before or at launch)
For each item: feature, one-line rationale, effort S/M/L, and which
Labelpilot doc should be updated to record the decision.

**IMPLEMENT LATER** (within 3 months of launch)
Same format.

**NEVER / NOT APPLICABLE**
Feature, one-line rationale for skipping.

After the three lists, add a section:

**Which Labelpilot MD files must be updated after this research?**
List the exact file paths (relative to repo root) and what section in each
file should be added or revised.

---

## Output format requirements

- Write in English.
- Use Markdown with H2/H3 headings matching the task structure above.
- Every table must have a header row and aligned columns.
- Footnotes for UNVERIFIED or LOW-confidence claims must appear immediately
  below the relevant table, not at the end of the document.
- Do NOT include generic SEO advice that is not directly tied to a specific
  Shopify feature, app, or Labelpilot requirement.
- Total length: as long as necessary to be complete, but avoid padding.
  Prefer dense tables over prose where possible.
- End the document with a "Sources consulted" section listing every URL you
  visited, with a one-line description of what each URL contributed.
