# META

| Field           | Value                                                                 |
|-----------------|-----------------------------------------------------------------------|
| Purpose         | Determine whether Labelpilot.de is Google Ads-ready and what must be built/fixed before spending any ad budget |
| When to run     | Once before the first paid campaign goes live; re-run if the site has major changes or new product lines are added |
| Save results to | `docs/03-google-ads-launch-readiness-findings.md` in the Labelpilot repo |
| Owner           | Alperen (founder) — alperen_aydinn@hotmail.com                        |

---

# DEEP-RESEARCH PROMPT

> Copy everything below this line and paste it into ChatGPT (with web browsing) or Claude (with web search enabled).

---

## Your task

You are a senior performance-marketing consultant specialising in B2B e-commerce in the DACH region. You are advising a German B2B label-printing webshop called **Labelpilot.de** that is about to run its first Google Ads campaigns. Your job is to research, with live web sources, what the site must have in place before ad spend begins — and what the realistic numbers look like.

**You have no access to the Labelpilot site itself. Use only public sources and competitor research.**

Browse the web actively. **Every factual claim must be followed by a source URL in parentheses.** If you cannot find a direct source, say so explicitly and mark the claim as an assumption with a confidence level of LOW, MEDIUM, or HIGH.

---

## Labelpilot.de — full context

- **Product:** Individually printed PP roll labels (PP-Rollenetiketten), main product 100 x 200 mm. Supplied on rolls. Printed full-colour.
- **Target customers:** German small and medium B2B brands in food, beverage, dietary supplements, private-label goods, and packaged-product brands. Orders placed in German. Site is German-only.
- **Pricing model:** Fixed-price packages — 1,000 / 2,000 / 5,000 / 10,000 labels. Self-serve add-ons: design service EUR 40 (waived free if order >= EUR 2,000 net OR if customer uploads print-ready artwork); printed proof EUR 10 (optional); express delivery; extra label designs per order; repeat order discount for saved artwork.
- **Tech:** Custom Next.js site (not Shopify or WooCommerce). Self-serve checkout with Stripe.
- **Seller of record:** Zhenkai Global Trading Limited (registered in Hong Kong). DDP shipping from Turkey via DHL and UPS to Germany.
- **Launch date:** 02 June 2026.
- **Revenue target:** 1,000 orders/month OR EUR 100,000/month revenue within 48 months of launch.
- **Legal exposure:** Site targets German consumers/businesses, so German and EU e-commerce law applies regardless of the HK seller-of-record entity.

---

## Research questions — answer ALL of them

### A. Above-the-fold requirements for a B2B label landing page

1. Browse at least 5 real, currently live competitors or high-performing B2B label/sticker/packaging webshops in Germany or the DACH region (examples to check: etikettenshop.de, aufkleberdruck24.de, stickershop.de, onlinelabels.com/de, flyeralarm.com labels section, saxoprint.de labels, mageprint.de, or any you discover). For each, record:
   - What is shown in the hero/above-the-fold section?
   - Is a price or price calculator visible without scrolling?
   - Is there a primary CTA — and what does it say?
   - Are trust signals (certifications, customer count, review score) visible above the fold?
2. Present findings in a comparison table with columns: Site | Hero content | Price visible above fold (Y/N) | Primary CTA text | Trust signals above fold | Mobile-friendly (Y/N — check manually).
3. Synthesise: what MUST a B2B label landing page show above the fold to not waste paid traffic? Give a ranked list.

### B. Required trust signals

1. What trust signals do German B2B buyers expect when buying from an online print supplier they do not know? Browse German e-commerce trust research (e.g. Trusted Shops studies, ECC Cologne reports, IFH Cologne, Statista Germany e-commerce trust) and cite specific numbers (e.g. "X % of German online shoppers abandon if no reviews").
2. Which trust badges/seals are most recognised in Germany (Trusted Shops, TUV, EHI, Paypal Buyer Protection, etc.)? Present a table: Badge | Recognition % in DE (if available) | Cost to obtain | Relevance for B2B | Source URL.
3. Does the HK seller-of-record (Zhenkai Global Trading Limited) create a specific trust problem for German B2B buyers? Research what German B2B buyers think about non-EU suppliers. Cite sources. Give a confidence level.

### C. Product configuration requirements before ads

1. What product-configuration features must a B2B print/label shop have live and working before sending paid traffic? Browse competitor sites to check which configurators are standard (material selector, size input, quantity tiers, proof/no-proof toggle, file upload, design service upsell). Present a table: Feature | Found on competitors (Y/N — list which) | Labelpilot has it (assume YES for quantity tiers, file upload, design service, proof add-on; assume UNKNOWN for rest) | Must-have before ads (Y/N) | Source or rationale.
2. Is an instant price calculator (showing price per unit AND total, updating live) a conversion prerequisite for German B2B buyers or a nice-to-have? Find data or case studies.

### D. Price transparency level expected

1. What level of price transparency do German B2B printing/packaging buyers expect before initiating contact or completing checkout? Browse published conversion-rate studies and e-commerce UX research specific to printing/packaging (e.g. Printful, MOO, Stickermule pricing pages; German print forums; conversion research).
2. Should Labelpilot show all package prices openly on the landing page, or gate them behind a quote request? What do the top-performing competitors do? Cite sources.
3. Is showing "price per label" (e.g. EUR 0.04/label for 5,000 qty) alongside the package total a recognised conversion tactic? Find specific evidence.

### E. Direct purchase vs quote vs contact

1. For German B2B buyers of custom-printed labels at the EUR 200–800 order range, what is the preferred buying journey — self-serve checkout, quote request, or phone/email contact? Find DACH B2B e-commerce buyer journey research (Roland Berger, McKinsey B2B e-commerce reports, IFH Cologne, Google/Kantar, or sector-specific sources).
2. What does the data say about conversion uplift from offering self-serve checkout vs forcing a quote step? Present any available statistics with sources.
3. What is the recommended approach for Labelpilot given its order size (EUR 100–800 typical) and B2B audience?

### F. Required pages before campaigns go live

1. List every page category that must exist on a German B2B e-commerce site before running Google Ads — both for legal compliance and for Quality Score / ad approval. Separate:
   - Google Ads policy requirements (cite Google Ads policy pages)
   - German legal requirements (cite applicable laws: TMG, DSGVO/GDPR, UWG, BGB Fernabsatz, Verpackungsgesetz, etc.)
   - Conversion-rate best practices
2. Present as a checklist table: Page | Required by (Ads policy / DE law / CRO best practice) | Priority (must-have / recommended / nice) | Source URL.

### G. Conversion events to track

1. What conversion events should a B2B print webshop track in Google Ads before launching campaigns? List events with recommended conversion action type (purchase, lead, page view, etc.) and recommended attribution window. Cite Google Ads documentation and e-commerce tracking best practices.
2. Is server-side conversion tracking (vs client-side tag) important for this type of site? Why or why not? Cite sources.
3. What is the minimum viable tracking stack (GA4 + Google Ads tag minimum, or more)? Present a table: Tool | Purpose | Cost | Must-have before first campaign | Source.

### H. Required German legal pages (detailed)

Browse the current requirements and cite the specific laws and recent enforcement cases:
1. Impressum — required fields for a non-EU seller serving German customers. What must the HK entity disclose? Does the physical production location (Turkey) need disclosure?
2. Datenschutzerklarung (Privacy Policy) — GDPR requirements specific to Google Ads conversion tracking (consent mode v2, cookie banner requirements post-2024 German DPA rulings).
3. AGB (Terms and Conditions) — required clauses for B2B label print orders (cancellation rights for custom goods, defect claims, file responsibility, print tolerance clauses).
4. Widerrufsrecht — does it apply to custom-printed labels under German law? Cite the relevant BGB paragraph.
5. Verpackungsgesetz (VerpackG) — does Labelpilot as a DDP seller shipping into Germany need LUCID registration? Cite the law and give a yes/no answer with confidence level.
6. Present as a table: Legal page/requirement | Applies to Labelpilot (Y/N) | Consequence of missing it | Urgency | Source URL.

### I. Analytics stack minimum requirements

1. What analytics and tag setup must be in place before a Google Ads campaign goes live for a Next.js site targeting German B2B customers? List tools, configuration steps, and whether Consent Mode v2 is mandatory in Germany post-2024. Cite Google documentation and German DPA (Datenschutzbehorde) guidance.
2. Is Google Tag Manager required or can direct GA4 + Google Ads tags suffice? Cite sources.
3. What is the minimum cookie consent platform (CMP) setup required for Google Ads to work legally in Germany? Name real CMPs used by German e-commerce sites (Cookiebot, Usercentrics, Consentmanager, etc.) and give approximate costs.

### J. Minimum UX requirements so ad traffic is not wasted

1. What are the Google Ads Quality Score factors most relevant to a landing page for a B2B print product? Cite Google documentation.
2. What page-load speed threshold is required to not waste mobile ad traffic in Germany? Cite Core Web Vitals benchmarks and German mobile internet speed data.
3. What UX elements (above the fold, form length, CTA placement, social proof placement, mobile layout) are specifically cited in CRO research as conversion levers for B2B SaaS/e-commerce landing pages? Present a prioritised list with source URLs.
4. What is the minimum acceptable mobile experience for a German B2B landing page receiving Google Ads traffic in 2026? (Share of mobile B2B browsing in Germany — find current data.)

### K. Realistic Google Ads test budget

1. What is a realistic minimum TEST budget (EUR/month) for a new Google Ads campaign targeting German B2B buyers for a niche print product? Find published guidance from Google, agency blogs (e.g. Bloofusion, AdBaker, Claneo, Searchies, or other German PPC agencies), and cite sources.
2. How long should a test phase last before making budget or bidding decisions? Cite industry guidance.
3. What bidding strategy is recommended for a new account with no conversion history targeting B2B purchases in Germany? Cite Google Ads documentation and practitioner guidance.

### L. Expected CPC ranges for German label/printing/packaging keywords

This is the most important section. Browse the following sources to find real CPC data:
- Google Keyword Planner public estimates (describe methodology — you can reference advertised ranges from agency case studies or published PPC reports)
- SEMrush, Ahrefs, or Sistrix published keyword data for DE market (cite any accessible public reports)
- German PPC agency blogs or posts that mention CPCs for Drucken/Etiketten/Verpackung keywords
- Any published Google Ads benchmarks for the printing/packaging industry in Germany

For each keyword group below, give: estimated CPC range (EUR), competition level (high/medium/low), estimated monthly search volume in Germany, and source URL or confidence level:

| Keyword group (German) | Example keywords | Est. CPC (EUR) | Competition | Monthly vol. DE | Source / Confidence |
|------------------------|-----------------|----------------|-------------|-----------------|---------------------|
| PP Rollenetiketten | "PP Rollenetiketten kaufen", "Rollenetiketten drucken lassen" | ? | ? | ? | ? |
| Etiketten drucken | "Etiketten drucken lassen", "Etiketten online bestellen" | ? | ? | ? | ? |
| Selbstklebende Etiketten | "selbstklebende Etiketten B2B", "Haftetiketten drucken" | ? | ? | ? | ? |
| Private Label Etiketten | "Private Label Etiketten", "Eigenmarke Etiketten" | ? | ? | ? | ? |
| Produktetiketten | "Produktetiketten bestellen", "Produktaufkleber drucken" | ? | ? | ? | ? |
| Lebensmitteletiketten | "Lebensmitteletiketten drucken", "Flaschenetiketten" | ? | ? | ? | ? |
| General printing/packaging | "Verpackungsdruck", "Aufkleber drucken lassen" | ? | ? | ? | ? |

Fill in every cell with your best-sourced estimate. If a cell cannot be sourced, write the estimate as an assumption and label confidence LOW/MEDIUM/HIGH.

### M. Realistic conversion-rate assumptions

1. What is the realistic conversion rate for cold Google Ads traffic to a German B2B print/packaging landing page (first-time buyers, no prior brand awareness)? Find industry benchmarks for:
   - B2B e-commerce average CR (Germany or DACH)
   - Print/packaging sector specifically
   - Impact of self-serve checkout vs quote form on CR
   Cite sources for each number.
2. What is a realistic cost-per-acquisition (CPA) estimate for the first 90 days, given the CPC ranges above and typical CR? Show your calculation transparently.
3. At what order volume / average order value does Google Ads become ROAS-positive for a label shop at these CPC levels? Show a break-even table.

---

## Required output format

Produce your findings in exactly this structure. Do not skip any section.

### 1. LAUNCH CHECKLIST
A numbered, prioritised checklist of everything Labelpilot must have live before running a single Google Ad. Group into: (a) Legal/compliance, (b) Tracking/analytics, (c) Site/UX, (d) Product/pricing, (e) Ad account setup. Mark each item BLOCKING (ad spend must not start without this) or RECOMMENDED.

### 2. "DO NOT RUN ADS UNTIL" LIST
A short, bold list of the absolute showstoppers — the things that, if missing, will either (a) get the account suspended, (b) violate German law, or (c) guarantee wasted budget. Maximum 15 items. Each item must cite a source or law.

### 3. RECOMMENDED FIRST CAMPAIGN STRUCTURE
A concrete recommended structure for the first Google Ads test campaign: campaign type, ad groups, match types, negative keyword themes, bidding strategy, daily budget, geo targeting, ad schedule, and audience layering. Present as a structured outline, not prose.

### 4. LANDING PAGE WIREFRAME REQUIREMENTS
A text-based wireframe (section-by-section, top to bottom) of what the Labelpilot landing page must contain for paid traffic. For each section: content required, trust elements, CTA, and rationale citing a source.

### 5. TRACKING REQUIREMENTS
A table of every tracking and analytics requirement: Tool | Event/signal | Implementation method | Required before ads (Y/N) | Legal notes (consent mode etc.) | Source.

### 6. RISK LIST
A table of risks specific to Labelpilot: Risk | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation | Source or confidence level. Include legal risks, competitive risks, tracking risks, budget risks, and trust/credibility risks.

### 7. IMPLEMENTATION RECOMMENDATIONS
Every actionable recommendation must be classified as one of:
- **IMPLEMENT NOW** — must be done before first ad impression
- **IMPLEMENT LATER** — can be done in the first 30 days of live campaigns
- **NEVER / NOT WORTH IT** — do not spend time/money on this for Labelpilot

Each recommendation must have a one-line rationale and, where applicable, a source URL.

---

## Fact vs assumption discipline

Throughout the entire response:
- Mark every sourced fact with its URL in parentheses immediately after the claim.
- Mark every unsourced estimate or inference with **(ASSUMPTION — confidence: HIGH/MEDIUM/LOW)** immediately after the claim.
- Never present an assumption as a fact.
- If a section cannot be adequately sourced, say so at the top of that section before proceeding with assumptions.

---

## Scope boundaries

- Focus on Google Search Ads and Google Performance Max only. Do not research Meta, LinkedIn, or other channels unless directly relevant to a comparison point.
- Focus on Germany (DE) as the market. DACH data is acceptable where DE-specific data is unavailable.
- Do not invent competitor features — only report what you can verify from live public pages.
- Do not give generic SEO advice. This prompt is exclusively about paid Google Ads readiness.
