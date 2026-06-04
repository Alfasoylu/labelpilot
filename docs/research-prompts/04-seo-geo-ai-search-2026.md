<!--
PURPOSE        : Deep-research prompt — Google 2026 SEO + GEO + AI-search trust best practices
                 for Labelpilot.de; validates/refreshes existing SEO & GEO documentation.
WHEN TO RUN    : Quarterly (next run: Sept 2026) or immediately before updating SEO/GEO docs.
SAVE RESULTS TO: docs/seo/00-SEO-MASTER.md  +  docs/seo/GEO-ai-visibility.md
                 (create GEO doc if it does not yet exist)
OWNER          : Alfasoylu / alperen_aydinn@hotmail.com
-->

# Deep-Research Prompt — Google 2026 SEO + GEO + AI-Search Best Practices for Labelpilot.de

## INSTRUCTIONS FOR THE RESEARCH MODEL

You are a senior SEO/GEO analyst.  
You have **live web-browsing capability** — use it throughout this task.  
Every factual claim you make **must be supported by a source URL cited inline** (format: `[Source: URL]`).  
Do **not** rely on training-data memory for claims that may have changed in 2025–2026.  
Where you cannot find a primary source, clearly label the claim **[ASSUMPTION]** and assign a confidence level: **High / Medium / Low**.

---

## SITE CONTEXT (treat as ground truth — you have no repo access)

| Field | Value |
|---|---|
| Site | Labelpilot.de |
| Language | German only (100%; no English/Turkish pages) |
| Product | PP-Rollenetiketten (polypropylene roll labels), self-adhesive, individually printed |
| Main SKU | 100 × 200 mm PP roll label, fixed packages: 1 000 / 2 000 / 5 000 / 10 000 units |
| Add-ons | Design service (EUR 40; free if order >= EUR 2 000 net or upload-ready data), printed proof (EUR 10, optional), express processing, extra design variants |
| Repeat orders | Saved artwork; frictionless re-order flow |
| Target customers | German B2B: food, beverage, supplement, private-label, SME packaged-goods brands |
| Site tech | Custom Next.js (not Shopify, not WordPress) |
| Launch date | 02 June 2026 |
| Seller of record | Zhenkai Global Trading Limited (Hong Kong); DDP shipping from Turkey via DHL/UPS |
| Revenue target | 1 000 orders/month OR EUR 100 000/month (48-month horizon) |

---

## RESEARCH QUESTIONS — answer each in order

### BLOCK 1 — Google Indexing Fundamentals in 2026

1. What are the confirmed current signals Google uses in 2026 to prioritise crawling and indexing of **new** domains? Cite Google Search Central documentation and any 2025–2026 Googler statements.
2. Why do new B2B sites frequently experience a 3–12 month "indexing lag"? What does Google say about this and what third-party analyses (Ahrefs, Semrush, Search Engine Journal, etc.) show? Present a comparison table of contributing factors vs. recommended remedies.
3. What technical configurations — sitemaps, robots.txt, canonical tags, hreflang, Core Web Vitals thresholds, crawl budget — are confirmed prerequisites for a custom Next.js site to be indexed efficiently? Cite Google documentation and Next.js-specific guidance.

### BLOCK 2 — Content Quality Signals (2025–2026 Helpful Content / E-E-A-T)

4. After the 2024–2026 Helpful Content / Core Updates, which **on-page content patterns** actively suppress new B2B sites in rankings? List concrete patterns (thin pages, AI-generated boilerplate, keyword stuffing, doorway pages). For each, cite an official source or a documented case study from a credible SEO publication.
5. What does "E-E-A-T" (Experience, Expertise, Authoritativeness, Trustworthiness) require for a **B2B e-commerce supplier site** with a non-EU seller of record? What trust signals matter most? Present as a checklist with a confidence level (High/Medium/Low) per item.
6. How should a **single-product-category B2B site** (labels only) build topical authority without triggering thin-content or doorway-page penalties? What is the minimum viable content depth per page type?

### BLOCK 3 — Programmatic SEO Risks

7. Browse current SEO community sources (Google blog, r/SEO, Ahrefs blog, Semrush blog, Search Engine Roundtable) and compile a table of **programmatic-SEO patterns that have triggered manual actions or ranking drops in 2025–2026**. Include: pattern name, documented outcome, source URL.
8. For a label-printing site that might generate pages by: sector (food labels, beverage labels, supplement labels), format (roll labels, sheet labels), and region — what is the safe vs. dangerous threshold for programmatic page generation? What differentiates "useful" from "spam" in Google's current view?

### BLOCK 4 — GEO (Generative Engine Optimisation) and AI-Search Visibility

9. **Define GEO** and distinguish it from traditional SEO. What is the current consensus (as of 2026) on how to optimise content for: Google AI Overviews (formerly SGE), ChatGPT browsing/search, Perplexity AI, Bing Copilot? Cite each platform's documentation or confirmed Googler/OpenAI statements where available.
10. Which content formats, structural patterns, and factual-density signals make a B2B supplier page **more likely to be cited** in an AI-generated answer? Present a ranked list with confidence levels.
11. What is the current evidence that AI search cannibalises or complements organic click-through for B2B queries? (Cite studies from SparkToro, BrightEdge, Semrush Institute, or similar.) Present findings in a table: query type → CTR impact (High / Moderate / Low cannibalization) → confidence level.
12. For **German-language B2B AI queries** specifically: does Google AI Overview appear in `.de` SERPs for commercial/transactional queries? What is the current rollout status in Germany? Cite any Google announcements or verified SERP analyses.

### BLOCK 5 — Schema Markup for a B2B Label Supplier

13. Browse schema.org and Google's Rich Results documentation. Which schema types are **confirmed eligible for rich results** and most relevant to a B2B label supplier site? Required: `Product`, `Organization`, `LocalBusiness` (if applicable), `FAQPage`, `BreadcrumbList`, `SiteLinksSearchBox`. For each: confirm eligibility, describe required fields, cite the Google documentation URL.
14. Is there a recommended schema pattern for **B2B pricing with packages/tiers** (not a single price)? What does Google recommend when pricing is unit-quantity-dependent?
15. Are there any schema types that might help GEO/AI-answer visibility beyond Google rich results (e.g., `HowTo`, `Speakable`, `Dataset`)? Confidence level per type.

### BLOCK 6 — Page Architecture and Internal Linking

16. For a B2B e-commerce site with this structure:
    - Homepage
    - Product category page (PP-Rollenetiketten)
    - Individual product/package pages (1000, 2000, 5000, 10000 units)
    - Sector landing pages (food labels, beverage labels, supplement labels, etc.)
    - FAQ / support pages
    - Blog / Wissensartikel (knowledge articles)

    What is the recommended URL structure, page depth (clicks from root), and internal-link architecture? Compare at least two named competitors or analogous sites currently ranking for `PP Etiketten` or `Rollenetiketten drucken` in Google.de. Cite competitor URLs and their visible IA.

17. What are the current best-practice internal-linking rules for a Next.js site to distribute PageRank efficiently? What pitfalls (JavaScript-rendered links, client-side routing, noindex leaks) must be avoided?

### BLOCK 7 — Avoiding Duplicate and Thin Pages

18. For a label-printing site that offers many variant combinations (size × material × sector × quantity), what deduplication strategies are recommended in 2026? (Canonical, noindex, parameter handling in Search Console, content differentiation thresholds.) Cite Google documentation.
19. What is the minimum word count / content depth that distinguishes a "thin" from a "useful" page in Google's current guidance? Is there a confirmed threshold, or is it qualitative? Cite sources.

### BLOCK 8 — Measurement and Monthly Monitoring

20. What should a B2B e-commerce site measure monthly to track SEO health in 2026? Provide a table: Metric → Tool → Benchmark / alert threshold → Confidence level. Cover at minimum: indexation rate, Core Web Vitals (INP, LCP, CLS), crawl errors, keyword rankings, CTR from GSC, backlink velocity, AI-citation rate (if measurable).
21. Are there tools that track **GEO/AI-search citation frequency** for a given domain? List named tools, their methodology, pricing tier, and confidence in their accuracy.

---

## COMPETITOR BENCHMARKING (mandatory)

Browse Google.de and search for the following queries. For each of the **top 5 organic results**, extract and present in a table:

**Queries to search:**
- `PP Rollenetiketten drucken`
- `Etiketten drucken B2B`
- `private label Etiketten bestellen`
- `Rollenetiketten Lebensmittel`

**For each result extract:**
| Field | Value |
|---|---|
| Domain | |
| Page title | |
| Visible URL slug | |
| Estimated word count (visible) | |
| Schema markup present (Y/N, types) | |
| Core Web Vitals status (pass/fail via PageSpeed API if accessible) | |
| AI Overview present for this query? (Y/N) | |
| Backlink estimate (from Ahrefs/Semrush free preview) | |

---

## REQUIRED DELIVERABLES

Present all findings under these numbered headings. Do not skip any.

### D1 — SEO/GEO Audit Criteria for Labelpilot.de

A checklist of 25–40 concrete, binary (pass/fail) audit items specific to Labelpilot.de. Group by: Technical, Content, Schema, Internal Linking, GEO/AI. Each item: criterion, why it matters, source URL, confidence level.

### D2 — Labelpilot.de SEO/GEO Risk Register

A table of risks specific to Labelpilot.de given its context (new domain, HK seller of record, DDP from Turkey, German-only, custom Next.js, single product category). Columns: Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation | Confidence.

### D3 — 30 / 60 / 90-Day SEO Roadmap

A phased action table. Columns: Day range | Action | Owner role | Priority (P0/P1/P2) | Success metric. Each action must be concrete and executable (e.g., "Submit XML sitemap to Google Search Console", not "improve SEO").

### D4 — Which Labelpilot Documentation Files Must Be Updated

Based on your findings, list the specific files that need to be updated or created. Use this assumed file path structure:
- `docs/seo/00-SEO-MASTER.md`
- `docs/seo/GEO-ai-visibility.md` (create if missing)
- `docs/seo/schema-markup.md`
- `docs/seo/content-strategy.md`
- `docs/seo/competitor-analysis.md`
- `docs/seo/measurement-dashboard.md`

For each file: what must change, what must be added, what is outdated and should be removed.

### D5 — Implementation Checklist (IMPLEMENT NOW / LATER / NEVER)

Classify every major recommendation into one of three buckets. Format:

| Recommendation | Bucket | Rationale (one line) | Effort | Confidence |
|---|---|---|---|---|
| ... | IMPLEMENT NOW | ... | S/M/L | H/M/L |

**IMPLEMENT NOW** = high impact, low risk, executable within 30 days for a custom Next.js site.  
**LATER** = valuable but depends on traffic/authority milestones, or requires significant content production.  
**NEVER** = high risk of penalty, irrelevant to Labelpilot.de's model, or cost-benefit negative.

---

## OUTPUT FORMAT RULES

- Use Markdown throughout.
- Every factual claim: cite source URL inline, e.g., `[Source: https://...]`.
- Every claim without a source: label `[ASSUMPTION — confidence: High/Medium/Low]`.
- Comparison tables: use Markdown tables, not prose lists.
- Separate "Confirmed facts" from "Best-practice interpretation" sections within each block.
- Minimum length: thorough enough to replace a 4-hour analyst session. Do not truncate to save space.
- End with a **"Sources Master List"** section: all URLs cited, numbered, with a one-line description of what each source confirms.
