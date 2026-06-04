# 83 — LAUNCH ROADMAP: MONTHS 1 & 2 (02.06.2026 → 01.08.2026)

> **Role of this document**
> This is the TIME-BASED execution layer for the first two calendar months after launch on 02.06.2026.
> It does NOT replace or override the build-phase ladder.
> Phase ordering authority remains **74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md**.
> Business-rule authority remains **00-SOURCE-OF-TRUTH.md** (decisions #1–#18d).
> Pricing authority remains **04-PRICING-AND-MARGIN-MODEL.md**.
> SEO authority remains **20-SEO-STRATEGY-2026.md + 21-GEO-AI-SEARCH-STRATEGY.md**.
> This document adds calendar anchors on top of those phase definitions; it defers all
> contested matters to the canonical SoT and phases listed above.
>
> **Phase-to-calendar note:** As of 2026-06-04, the project is phase-based, not date-based
> (see audit finding in `monthOneTwoState`). This document is the first calendar layer;
> a founder decision is required to formally bind P0–P6 gates to these target dates.

---

## Document metadata

| Field | Value |
|---|---|
| Status | DRAFT — awaiting founder date-binding approval |
| Covers | 02.06.2026 – 01.08.2026 (Month 1: Jun 2 – Jul 1; Month 2: Jul 2 – Aug 1) |
| Owner | Founder / product lead |
| Phase authority | 74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md |
| SoT authority | 00-SOURCE-OF-TRUTH.md |
| Registration required | Add this file to 00-SOURCE-OF-TRUTH.md §3 Authoritative Version Table |

---

## MONTH 1 — 02.06.2026 → 01.07.2026

**Goal:** The site becomes understandable, crawlable, credible, and commercially coherent.
A first-time German B2B visitor can (a) understand what is sold and at what price,
(b) place an order or submit a quote request, and (c) trust the brand enough to pay.
Google can discover, crawl, and preliminarily assess all intended URLs.

---

### 1.1 — Google Recognition

**Objective:** All technical prerequisites for Google indexing are in place and verified.
References: 26-SITEMAP-ROBOTS-CANONICAL.md (sitemap/robots rules), 24-METADATA-MAP.md
(metadata ownership), 25-SCHEMA-MARKUP-MAP.md (schema ownership), 27-INTERNAL-LINKING-ENGINE.md
(internal-link plan), 20-SEO-STRATEGY-2026.md (canonical SEO rules).

#### 1.1.1 Sitemap

**Requirements:**
- XML sitemap at `/sitemap.xml` is auto-generated at build time.
- Contains exactly the URLs in the INDEX column of the index/noindex decision table below (§1.1.5).
- No URL in the sitemap resolves to a 4xx, 5xx, or redirect.
- `<lastmod>` uses the actual file-change date, not a static placeholder.
- Sitemap is referenced in `robots.txt` via an absolute `Sitemap:` directive.

**Acceptance criteria:**
- [ ] `curl -I https://labelpilot.de/sitemap.xml` returns 200 with `Content-Type: application/xml`.
- [ ] Every URL in the sitemap returns 200 in a crawl-simulation tool (Screaming Frog or equivalent).
- [ ] No URL in the sitemap is in the noindex set.
- [ ] `robots.txt` line `Sitemap: https://labelpilot.de/sitemap.xml` is present.

#### 1.1.2 robots.txt

**Requirements (defer to 26-SITEMAP-ROBOTS-CANONICAL.md for exact rules):**
- `User-agent: *` block with `Disallow:` entries covering: `/api/`, `/admin/`, `/checkout/`, `/konto/`, `/teklif/`, `/bestellung/`, `/mein-konto/`, `/_next/`.
- `Allow: /` covers all public marketing and product pages.
- No blanket `Disallow: /` line.

**Acceptance criteria:**
- [ ] Google Search Console "robots.txt tester" passes without errors.
- [ ] All admin and private paths are disallowed.
- [ ] All public SEO-target pages are not disallowed.

#### 1.1.3 Canonical rules

**Requirements:**
- Every page has exactly one `<link rel="canonical">` pointing to its own URL (self-referencing canonical).
- Pagination uses canonical pointing to page 1 (if applicable).
- No cross-domain canonicals unless explicitly approved in SoT.
- Trailing-slash policy: consistent (no-trailing-slash preferred; enforced in Next.js config).

**Acceptance criteria:**
- [ ] Automated audit (e.g., Screaming Frog) shows 0 missing canonical tags across all indexed pages.
- [ ] 0 pages with canonical pointing to a different URL than self, except explicitly approved cases.
- [ ] Trailing-slash redirect works: `/produkte/` → `/produkte` (or reverse, whichever is canonical) with 301.

#### 1.1.4 Metadata map

**Requirements (defer to 24-METADATA-MAP.md for exact text):**
- Every indexed page has a unique `<title>` (50–60 chars) and unique `<meta name="description">` (145–160 chars).
- Titles follow pattern: `[Primary Keyword] | Labelpilot` or equivalent.
- No page shares an identical title with any other page.
- Meta description does not repeat the title verbatim.

**Acceptance criteria:**
- [ ] Screaming Frog or equivalent: 0 missing titles, 0 missing meta descriptions, 0 duplicate titles, 0 duplicate meta descriptions.
- [ ] Title length 50–60 chars and meta description 145–160 chars for all indexed pages.

#### 1.1.5 Index / noindex decision table

| URL pattern | Decision | Reason |
|---|---|---|
| `/` | INDEX | Homepage, primary conversion |
| `/produkte` | INDEX | Product listing, SEO entry |
| `/produkte/[slug]` (PP-Rollenetiketten) | INDEX | Primary product detail pages |
| `/preise` or `/bestellen` | INDEX | Pricing / order entry page |
| `/kontakt` | INDEX | Trust / conversion |
| `/ueber-uns` | INDEX | Brand credibility |
| `/blog` | INDEX | Content SEO hub |
| `/blog/[slug]` | INDEX | Individual articles |
| `/impressum` | INDEX | Legal requirement (DE) |
| `/datenschutz` | INDEX | Legal requirement (DE) |
| `/agb` | INDEX | Legal requirement (DE) |
| `/widerruf` | INDEX | Legal requirement (DE) |
| `/sitemap.xml` | n/a (not HTML) | Sitemap file |
| `/api/*` | NOINDEX + Disallow | Internal API routes |
| `/admin/*` | NOINDEX + Disallow | Admin panel |
| `/checkout/*` | NOINDEX | Transactional, thin |
| `/konto/*` | NOINDEX | Account area, personalised |
| `/mein-konto/*` | NOINDEX | Account area, personalised |
| `/teklif/*` | NOINDEX + Disallow | Internal quote flow |
| `/bestellung/*` | NOINDEX | Order confirmation, personalised |
| `/_next/*` | NOINDEX + Disallow | Next.js internals |
| `/404` | NOINDEX | Error page |
| Any page with `?` query param | NOINDEX (via canonical) | Parameterised duplicates |

**Acceptance criteria:**
- [ ] Every INDEX URL has `<meta name="robots" content="index, follow">` (or absence of noindex).
- [ ] Every NOINDEX URL has `<meta name="robots" content="noindex, nofollow">` or equivalent.
- [ ] Index/noindex table is reviewed and founder-approved before launch.

#### 1.1.6 Schema markup

**Requirements (defer to 25-SCHEMA-MARKUP-MAP.md for full ownership):**
- Homepage: `Organization` schema with name, url, logo, contactPoint.
- Product pages: `Product` schema with name, description, offers (price, priceCurrency, availability), brand.
- Blog articles: `Article` schema with headline, author, datePublished, dateModified.
- FAQ blocks (where present): `FAQPage` schema.
- No schema type conflicts; all required fields populated.

**Acceptance criteria:**
- [ ] Google Rich Results Test passes for homepage, at least one product page, and one blog article.
- [ ] 0 schema errors in Search Console (once site is registered).
- [ ] Organization schema includes correct logo URL resolving to 200.

#### 1.1.7 Internal linking plan

**Requirements (defer to 27-INTERNAL-LINKING-ENGINE.md for full plan):**
- Homepage links to: `/produkte`, `/preise`, `/kontakt`, `/ueber-uns`.
- Product listing page links to: individual product detail pages, `/preise`, `/kontakt`.
- Each product detail page links to: `/preise`, `/kontakt`, related product pages (where applicable).
- Blog articles link to at least one product or pricing page per article.
- No orphan pages (every indexed page reachable within 3 clicks from homepage).

**Acceptance criteria:**
- [ ] Screaming Frog crawl: 0 orphan pages among indexed URLs.
- [ ] Homepage links verified live.
- [ ] No broken internal links (0 internal 404s).

---

### 1.2 — Customer Positioning

**Objective:** A first-time German B2B visitor immediately understands what Labelpilot sells,
why it is relevant to their business, and what it costs.

**Business-rule lock:** All copy must comply with SoT decisions:
- Design service: EUR 40 net, FREE if order >= EUR 2,000 net OR customer uploads print-ready data (SoT #16, 04 §28.1).
- Printed proof: EUR 10 net (optional add-on) (SoT #16, 04 §28.1).
- Delivery: ca. 10–14 Werktage nach Freigabe — stated range, not SLA (SoT #18a).
- Package ladder: 1,000 / 2,000 / 5,000 / 10,000 (SoT #2).
- Matt-finish surcharge: +15% net, behind feature flag, Stripe-TEST-gated (SoT #18d) — NOT surfaced in Month 1 unless flag enabled by founder.
- Add-ons (Designservice, Andruck, Express, Zusatzdesign): behind `NEXT_PUBLIC_FEATURE_ADDONS` (default off). NOT surfaced in Month 1 unless flag enabled by founder.

**Required positioning elements (must appear on site before end of Month 1):**

| Element | Location | Required content |
|---|---|---|
| Value proposition headline | Homepage hero | PP-Rollenetiketten fuer deutsche Marken — guenstig, klar kalkuliert, nachbestellbar |
| Product definition | Homepage + /produkte | 100x200 mm PP-Rollenetiketten; Opak und Transparent; fuer Lebensmittel, Getraenke, Supplements, Private-Label |
| Package prices | /preise or homepage section | 1.000 / 2.000 / 5.000 / 10.000 Stueck mit Nettopreisen (see 04 §14.1) |
| Design-service rule | Product + checkout pages | Designservice EUR 40 (kostenlos ab EUR 2.000 Netto oder bei druckfertigen Daten) |
| Printed-proof rule | Product + checkout pages | Physischer Andruck EUR 10 (optional) |
| Delivery statement | Product + checkout pages | Lieferzeit: ca. 10–14 Werktage nach Ihrer Freigabe |
| Reorder benefit | Homepage + /konto | Artwork gespeichert — Nachbestellung mit einem Klick |
| Sectors served | Homepage + /ueber-uns | Lebensmittel, Getraenke, Nahrungsergaenzungsmittel, Private-Label, Kosmetik |

**Acceptance criteria:**
- [ ] All eight positioning elements are present and visible in desktop + mobile view.
- [ ] Design-service rule displays correctly: EUR 40 shown; "kostenlos" condition text present.
- [ ] Printed-proof price EUR 10 shown where relevant (product/checkout).
- [ ] Delivery statement uses the exact SoT #18a wording (no "guaranteed" or "binding" language).
- [ ] Package prices match 04 §14.1 (opaque: EUR 179 / 279 / 479 / 799; transparent: EUR 199 / 309 / 519 / 849).
- [ ] No Turkish-language text visible anywhere on the customer-facing site (enforced by 60-CODEX-AGENT-PROTOCOL.md §2 and the build-time language guard).

---

### 1.3 — Menu Pages Complete

**Objective:** Every navigation menu item leads to a complete, purposeful, high-trust German-language page.
No placeholder text, no "coming soon" blocks, no AI-generated filler.

For each page below: purpose, primary keyword / intent, customer question answered,
required sections, required CTA, internal links, schema, acceptance criteria.

---

#### 1.3.1 Homepage (`/`)

| Field | Value |
|---|---|
| Purpose | Primary conversion entry; brand trust anchor |
| Primary keyword | PP-Rollenetiketten kaufen Deutschland |
| Intent | Informational + transactional |
| Customer question | Wo bekomme ich guenstige, qualitativ hochwertige PP-Rollenetiketten fuer mein Produkt? |

**Required sections:**
1. Hero — headline, subheadline, primary CTA (Jetzt Preis berechnen / Angebot anfragen).
2. Product teaser — opaque vs transparent PP, 100x200 mm, key spec summary.
3. Price teaser — package ladder (1k/2k/5k/10k), link to full pricing page.
4. Label Journey scroll animation (approved exception: SoT #17, 79-AWARD-WINNING-LABEL-JOURNEY-SCROLL.md).
5. Sectors served — food, beverage, supplements, private-label, cosmetics.
6. Trust signals — "Artwork gespeichert, Nachbestellung einfach", delivery range, design-service callout.
7. FAQ block (min. 3 questions) — answering top search-intent questions.

**Required CTA:** "Jetzt bestellen" or "Angebot anfragen" — prominent, above the fold.

**Internal links:** /produkte, /preise, /kontakt, /ueber-uns, /blog.

**Schema:** Organization, FAQPage (for FAQ block).

**Acceptance criteria:**
- [ ] Hero CTA above the fold on 375px mobile and 1280px desktop.
- [ ] All 7 sections present and populated with non-placeholder German copy.
- [ ] No English text visible (except brand names / technical identifiers).
- [ ] Organization schema passes Google Rich Results Test.
- [ ] FAQ schema passes Google Rich Results Test.
- [ ] Core Web Vitals: LCP < 2.5 s on mobile (measured via PageSpeed Insights).

---

#### 1.3.2 Produkte (`/produkte`)

| Field | Value |
|---|---|
| Purpose | Product listing; SEO gateway for product-level pages |
| Primary keyword | PP-Rollenetiketten guenstig bestellen |
| Intent | Navigational + transactional |
| Customer question | Welche Etikettenarten bietet Labelpilot an und was kosten sie? |

**Required sections:**
1. Intro paragraph — what PP-Rollenetiketten are, why PP, who they are for.
2. Product cards — Opak PP and Transparent PP, each with thumbnail, key specs, starting price, CTA.
3. Comparison table — opak vs transparent (material, Weissunterdruckung flag as "Angebot" per audit contradiction resolution, Haftung, typical use).
4. Add-ons teaser (visible only if `NEXT_PUBLIC_FEATURE_ADDONS=true`; otherwise omit).
5. Lieferzeit statement — exact SoT #18a wording.
6. Link to pricing page and to contact.

**Required CTA:** Per product card — "Details & Bestellen".

**Internal links:** /produkte/[opak-slug], /produkte/[transparent-slug], /preise, /kontakt.

**Schema:** CollectionPage or ItemList.

**Acceptance criteria:**
- [ ] Both product variants (opak, transparent) have cards with correct starting prices.
- [ ] Transparent card does NOT claim white-underprint as a standard feature; marks it as "auf Anfrage" (see audit contradiction #1).
- [ ] Lieferzeit block present with exact SoT #18a German text.
- [ ] No add-ons surfaced if `NEXT_PUBLIC_FEATURE_ADDONS=false`.
- [ ] ItemList schema validates in Rich Results Test.

---

#### 1.3.3 Product detail page — Opak PP (`/produkte/pp-rollenetiketten-opak` or slug per 30-PRODUCT-CATALOG.md)

| Field | Value |
|---|---|
| Purpose | Convert browsers to buyers for opaque PP product |
| Primary keyword | Opaque PP Rollenetiketten 100x200 kaufen |
| Intent | Transactional |
| Customer question | Was kostet eine Bestellung Opak-PP-Rollenetiketten und wie laeuft die Bestellung ab? |

**Required sections:**
1. Product hero — image, name, short description, package selector (1k/2k/5k/10k), price display, CTA.
2. Specs table — material (PP opak), size (100x200 mm), finish (Glanz standard), Haftung, Anwendung.
3. Pricing breakdown — net prices, VAT note, package prices (EUR 179/279/479/799 per 04 §14.1).
4. Add-ons block — shown only if `NEXT_PUBLIC_FEATURE_ADDONS=true`; design service rule, printed proof, express.
5. Designservice explanation — EUR 40 / kostenlos Bedingungen — ALWAYS shown (not behind flag) so buyers understand cost.
6. Artwork/reorder section — saved artwork benefit, repeat-order path.
7. Lieferzeit statement (SoT #18a exact wording).
8. FAQ block (min. 3 product-specific questions).

**Required CTA:** "Jetzt bestellen" — direct to package selection + checkout flow.

**Internal links:** /produkte, /preise, /kontakt, /produkte/pp-rollenetiketten-transparent.

**Schema:** Product (with Offer, price, availability, brand).

**Acceptance criteria:**
- [ ] All four package prices displayed correctly (EUR 179 / 279 / 479 / 799 net, matching 04 §14.1).
- [ ] Product schema passes Google Rich Results Test with price field populated.
- [ ] Design-service rule (EUR 40 / kostenlos conditions) visible without requiring flag.
- [ ] Add-ons block hidden if `NEXT_PUBLIC_FEATURE_ADDONS=false`.
- [ ] Matt-finish surcharge (+15%) NOT displayed unless `NEXT_PUBLIC_FEATURE_ADDONS=true` AND founder enables it (SoT #18d).
- [ ] No broken internal links.

---

#### 1.3.4 Product detail page — Transparent PP (`/produkte/pp-rollenetiketten-transparent`)

Same structure as 1.3.3 except:
- Prices: EUR 199 / 309 / 519 / 849 net (04 §14.1).
- Weissunterdruckung (white-underprint): listed as "auf Anfrage" — NOT as a standard feature and NOT as a self-serve add-on (audit contradiction #1 resolution: defer to 04 §14.4 quote-only rule).

**Acceptance criteria:**
- [ ] All four transparent prices correct (EUR 199 / 309 / 519 / 849 net).
- [ ] Weissunterdruckung marked as "auf Anfrage" / quote-only; no price shown.
- [ ] Product schema passes Rich Results Test.
- [ ] Design-service and printed-proof rules shown (same as opaque page).

---

#### 1.3.5 Preise / Bestellen (`/preise`)

| Field | Value |
|---|---|
| Purpose | Full pricing transparency; reduce price-anxiety; assist B2B procurement decisions |
| Primary keyword | Etiketten Preis pro 1000 Stueck |
| Intent | Commercial investigation |
| Customer question | Was kostet meine Bestellung genau — inkl. Design, Versand, Muster? |

**Required sections:**
1. Pricing table — both variants, all four packages, net + gross prices.
2. Add-ons pricing block — design service (EUR 40, kostenlos conditions), printed proof (EUR 10), express (EUR 9,90), extra design (EUR 19) — static informational copy even if flag is off.
3. VAT note — alle Preise Netto zzgl. 19% MwSt.
4. Delivery statement (SoT #18a).
5. Custom size note — "Sondermasse auf Anfrage" (04 §29 custom-size engine status: built-phased, not live until operator enters cost params; do NOT show calculator until params locked).
6. FAQ block (min. 2 pricing questions).

**Required CTA:** "Jetzt bestellen" per package row.

**Internal links:** /produkte, /kontakt, /bestellen (or direct to product detail).

**Schema:** FAQPage for FAQ block.

**Acceptance criteria:**
- [ ] All prices match 04 §14.1 exactly — no rounding errors.
- [ ] VAT is stated as 19% MwSt on all price rows.
- [ ] Custom-size section does NOT show a price calculator unless `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE=true` AND operator has locked cost params (SoT #16b).
- [ ] Add-ons prices correct (EUR 40 / 10 / 9,90 / 19 per 04 §28.1).
- [ ] Design-service kostenlos conditions stated.

---

#### 1.3.6 Kontakt (`/kontakt`)

| Field | Value |
|---|---|
| Purpose | Trust anchor; inbound enquiry; B2B sales entry |
| Primary keyword | Etiketten Druckerei Kontakt |
| Intent | Navigational |
| Customer question | Wie kann ich Labelpilot erreichen und eine Anfrage stellen? |

**Required sections:**
1. Contact form — Name, Firma, E-Mail, Telefon (optional), Nachricht, Absenden.
2. Response-time statement — "Wir antworten innerhalb von 1 Werktag."
3. Alternative contact method (email address minimum).
4. Quick FAQ or routing hint (e.g., "Fuer ein individuelles Angebot: ...").

**Required CTA:** Submit button on contact form.

**Internal links:** /ueber-uns, /produkte, /preise.

**Schema:** ContactPage (or LocalBusiness).

**Acceptance criteria:**
- [ ] Form submits without error (POST to server action or API route).
- [ ] Confirmation message shown after submission.
- [ ] Email notification sent to operator on form submission (34-EMAIL-NOTIFICATIONS.md).
- [ ] No spam fields pre-filled; honeypot or CAPTCHA in place.
- [ ] ContactPage schema validates.

---

#### 1.3.7 Ueber uns (`/ueber-uns`)

| Field | Value |
|---|---|
| Purpose | Brand credibility; humanise the seller; reduce B2B trust barrier |
| Primary keyword | Labelpilot Etiketten Lieferant |
| Intent | Informational / trust |
| Customer question | Wer steckt hinter Labelpilot und warum soll ich dort bestellen? |

**Required sections:**
1. Mission statement — honest, short (2–3 sentences), no corporate filler.
2. Product focus — PP-Rollenetiketten fuer deutsche B2B-Marken.
3. Why Labelpilot — transparent pricing, saved artwork, simple reorder, design service.
4. Legal entity / seller of record note — Zhenkai Global Trading Limited (seller of record) per SoT — frame customer-appropriate: "Wir liefern DDP nach Deutschland via DHL/UPS."
5. No fake testimonials or unverifiable trust badges in Month 1.

**Required CTA:** "Produkte ansehen" or "Angebot anfragen".

**Internal links:** /produkte, /kontakt, /preise.

**Schema:** Organization (same as homepage, consistent).

**Acceptance criteria:**
- [ ] No placeholder "Lorem ipsum" or AI-template text.
- [ ] Seller-of-record / DDP shipping statement present (avoids legal surprise for buyers).
- [ ] No claims of ISO certification, awards, or sustainability without evidence (SoT #18c: no eco claims).
- [ ] Organization schema consistent with homepage schema.

---

#### 1.3.8 Blog (`/blog`)

| Field | Value |
|---|---|
| Purpose | Content SEO hub; long-tail keyword acquisition |
| Primary keyword | Etiketten Blog Drucken Deutschland |
| Intent | Informational |
| Customer question | Wie waehle ich das richtige Etikett fuer mein Produkt? |

**Required sections:**
1. Blog listing with article cards (title, date, excerpt, CTA "Artikel lesen").
2. Category or tag filter (optional in Month 1; required in Month 2).
3. Sidebar or footer link to /produkte and /preise.

**Minimum article count at Month 1 end:** 3 published articles (no stubs, no AI filler, min. 600 words each).

**Required CTA:** Per article card — "Artikel lesen".

**Internal links:** Each article links to /produkte or /preise; blog listing links to homepage.

**Schema:** Blog + Article per post.

**Acceptance criteria:**
- [ ] At least 3 articles published, each min. 600 words, German-only.
- [ ] Article schema validates for each published article.
- [ ] Blog listing page has correct ItemList schema or BreadcrumbList.
- [ ] No article is an exact duplicate of another.

---

#### 1.3.9 Legal pages (Impressum / Datenschutz / AGB / Widerruf)

**References:** 29-LEGAL-PAGES-GERMANY.md owns these pages.

**Requirements:**
- All four legal pages must exist and be accessible from the footer.
- Content must comply with German Impressumspflicht, DSGVO Datenschutz, and Fernabsatzrecht.
- No placeholder blocks ("Text folgt" etc.).
- Legal pages are indexed (see §1.1.5) but have noindex meta if legally sensitive (founder decision).

**Acceptance criteria:**
- [ ] `/impressum`, `/datenschutz`, `/agb`, `/widerruf` all return 200.
- [ ] All four linked from site footer on every page.
- [ ] Impressum includes: Firmenname, Anschrift, Vertreter, Registernummer, E-Mail (per §5 TMG).
- [ ] Datenschutz mentions: DSGVO, data processor list (Vercel, Supabase, Stripe), cookie policy.
- [ ] AGB covers: Vertragsschluss, Zahlungsbedingungen (Stripe), Lieferzeit (SoT #18a range), Rueckgabe.
- [ ] Widerrufsbelehrung is valid for Germany (14-day right of withdrawal or waiver for custom goods).

---

### 1.4 — Product Variants Ready

**References:** 30-PRODUCT-CATALOG.md (SKU ownership, MVP scope), 03-PRODUCT-STRATEGY-v2.md
(product direction), 04-PRICING-AND-MARGIN-MODEL.md (pricing details).

#### 1.4.1 Minimum viable set (Month 1 launch)

| SKU | Material | Finish | Size | Status |
|---|---|---|---|---|
| LP-PP-O-100x200 | PP Opak | Glanz (standard) | 100x200 mm | LIVE at launch |
| LP-PP-T-100x200 | PP Transparent | Glanz (standard) | 100x200 mm | LIVE at launch |

**Notes:**
- Matt-finish (+15%) is built but flag-gated OFF (SoT #18d). Do NOT surface in Month 1 unless founder enables `NEXT_PUBLIC_FEATURE_ADDONS`.
- Custom sizes: price-engine phased (SoT #16b), do NOT surface until operator enters cost params.

#### 1.4.2 Full future set (planned, not in Month 1)

| SKU | Material | Trigger |
|---|---|---|
| LP-PP-O-100x200-MATT | PP Opak Mattlaminat | Flag enable + Stripe TEST complete |
| LP-PP-T-100x200-MATT | PP Transparent Mattlaminat | Flag enable + Stripe TEST complete |
| LP-PP-O-CUSTOM | PP Opak Sondermasse | Operator cost params locked in Admin §30A |
| LP-PP-T-CUSTOM | PP Transparent Sondermasse | Same as above |

#### 1.4.3 Option classification

| Option type | Options | Set by |
|---|---|---|
| Customer-facing (self-serve) | Package quantity (1k/2k/5k/10k), material (opak/transparent), file upload or design service | Customer on product page |
| Price-impacting self-serve (flag-gated) | Designservice +EUR 40, Andruck +EUR 10, Express +EUR 9,90, Zusatzdesign +EUR 19, Matt +15% | Customer, only if `NEXT_PUBLIC_FEATURE_ADDONS=true` |
| Admin-controlled | Internal cost params (material, print, binding), margin floor | Operator in admin panel (18-ADMIN-PANEL.md) |
| Manual-quote | Custom sizes, Weissunterdruckung, quantity >10k, Net-14 payment (SoT #18b) | Quote-request flow (31-QUOTE-REQUEST-FLOW.md) |

**Acceptance criteria:**
- [ ] Product page renders exactly LP-PP-O and LP-PP-T at launch.
- [ ] Matt-finish option NOT visible unless flag enabled.
- [ ] Custom-size input NOT visible unless `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE=true` AND operator has locked cost params.
- [ ] Quote-request CTA present for all manual-quote paths.

---

### 1.5 — Pricing + Cost Admin Requirements

**References:** 04-PRICING-AND-MARGIN-MODEL.md (canonical price ladder and margin rules),
18-ADMIN-PANEL.md (admin panel specs), 04 §29 (custom-size engine), 00-SOURCE-OF-TRUTH.md #16b.

#### 1.5.1 Admin pricing interface requirements

| Field | Requirement |
|---|---|
| Base package prices | Editable per SKU × quantity tier (1k/2k/5k/10k) by operator |
| Material cost | Internal only; not shown to customer; used for gross-margin calc |
| Print cost | Internal only; per-unit or per-run; used for margin calc |
| Design-service fee | EUR 40 net default; editable by operator; flag for order-value waiver threshold |
| Printed-proof fee | EUR 10 net default; editable by operator |
| Express fee | EUR 9,90 net default; editable by operator |
| Extra-design fee | EUR 19 net default; editable by operator |
| Matt-finish surcharge | +15% net default; operator can adjust (SoT #18d) |
| VAT rate | 19% (DE standard); hardcoded initially; admin-editable post-launch |
| Margin floor | Operator-set minimum gross margin %; order blocked if margin would fall below |
| Manual price override | Operator can override per order (for quote/B2B orders) |

#### 1.5.2 Customer price display rules

- All customer-facing prices shown as: "EUR X,XX netto zzgl. 19% MwSt. (EUR Y,YY brutto)".
- Package price is always server-priced (client cannot manipulate).
- Add-on prices are server-priced (04 §28.1 rule).
- Gross = net × 1.19; displayed to 2 decimal places.

#### 1.5.3 Gross-margin estimate (reference only — defer to 04 §20.1 for canonical values)

| Package | Net price (opaque) | Target margin |
|---|---|---|
| 1,000 | EUR 179 | See 04 §20.1 |
| 2,000 | EUR 279 | See 04 §20.1 |
| 5,000 | EUR 479 | See 04 §20.1 |
| 10,000 | EUR 799 | See 04 §20.1 |

**Acceptance criteria:**
- [ ] Admin panel allows operator to edit all price fields listed in §1.5.1.
- [ ] Customer receives server-computed price (cannot manipulate package price via client-side params).
- [ ] Gross price displayed as net × 1.19 correctly on product and checkout pages.
- [ ] Design-service waiver logic fires correctly: EUR 0 shown if order net value >= EUR 2,000 or if file is marked print-ready.
- [ ] Margin floor check present: admin is alerted if any order falls below operator-set margin floor.

---

### 1.6 — Customer Panel Requirements

**References:** 19-CUSTOMER-PORTAL-v2.md (portal spec), 14-AUTH-AND-ACCOUNTS.md (auth),
70-ARTWORK-MANAGEMENT-SYSTEM.md (artwork), 33-REORDER-ECONOMICS.md (reorder logic),
34-EMAIL-NOTIFICATIONS.md (notifications).

#### 1.6.1 Required customer panel features (Month 1)

| Feature | Description |
|---|---|
| Account registration / login | Email + password; or magic link (per 14-AUTH-AND-ACCOUNTS.md) |
| Company profile | Firmenname, Anschrift, USt-IdNr (optional), Kontaktperson |
| Order history | List of past orders with status, product, quantity, price, date |
| Saved artwork | Per-order artwork stored; viewable; downloadable by customer |
| Reorder CTA | "Nachbestellen" button per past order — pre-fills product + quantity + uses saved artwork |
| Proof status | Current digital proof status (Ausstehend / Genehmigt / Abgelehnt) per order |
| Design-service status | If design service was purchased: status of design work |
| Uploaded files | List of uploaded files per order; link to re-download |
| Invoice documents | Link to download Stripe invoice PDF (if available) |
| Address management | Add / edit shipping addresses |
| Repeat-order CTA | Prominent; present on order history and artwork views |

#### 1.6.2 Net-14 / Rechnungskauf (invoice payment)

Per SoT #18b: Rechnungskauf offered ONLY on manual approval for vetted Geschaeftskunden.
Not a self-serve option. If customer requests invoice payment, they must use the Angebot / contact path.
No UI element suggesting automatic invoice-payment availability in Month 1.

**Note (ownership gap from audit):** The approval workflow, VAT/reverse-charge logic, and eligibility
criteria for Net-14 are not yet owned by a single doc. This is flagged for Month 2 resolution
(assign to 18-ADMIN-PANEL.md or 31-QUOTE-REQUEST-FLOW.md).

**Acceptance criteria:**
- [ ] Customer can register, log in, and view order history.
- [ ] Saved artwork visible and downloadable per order.
- [ ] Reorder CTA present and correctly pre-fills product + quantity; uses saved artwork by default.
- [ ] Proof status updates in real time (or near real time via admin action).
- [ ] Invoice PDF downloadable for completed orders (Stripe-generated).
- [ ] No "Rechnung / Net-14" self-serve option visible in checkout without manual approval.
- [ ] Account pages are NOINDEX (see §1.1.5).

---

## MONTH 2 — 02.07.2026 → 01.08.2026

**Goal:** Google can index all intended URLs with no technical-SEO, content, or UX defects.
Revenue-target roadmap linked and validated. AI/GEO-search docs reviewed for 2026 currency.

---

### 2.1 — Indexing Verification

**Objective:** Confirm Google has discovered, crawled, and indexed all intended URLs.
No unintended noindex leakage; no sitemap breakage.

#### 2.1.1 Google Search Console setup

**Requirements:**
- Site verified in Google Search Console (DNS TXT record or HTML file method).
- Sitemap submitted at `https://labelpilot.de/sitemap.xml`.
- Index Coverage report reviewed.
- URL Inspection run on homepage, /produkte, at least two product detail pages.

**Acceptance criteria:**
- [ ] Search Console shows site as verified.
- [ ] Sitemap submitted; shows "Success" status (not "Couldn't fetch" or "Has errors").
- [ ] Index Coverage report: 0 "Excluded: noindex" for intended-index URLs.
- [ ] Index Coverage report: 0 "Crawled — currently not indexed" pages older than 14 days for priority URLs.
- [ ] 0 "Redirect error" or "Not found (404)" in sitemap.

#### 2.1.2 No accidental noindex

**Requirements:**
- Automated crawl (Screaming Frog or ahrefs) on all public URLs.
- Flag any page with `noindex` that should be indexed per §1.1.5 table.
- Flag any page without canonical that should have one.

**Acceptance criteria:**
- [ ] 0 intended-index URLs returning `noindex` meta tag or `X-Robots-Tag: noindex` header.
- [ ] 0 intended-index URLs missing canonical.
- [ ] Redirect chains: 0 chains longer than 1 hop for any URL in sitemap.

#### 2.1.3 No duplicate-canonical leakage

**Requirements:**
- Parameterized URLs (`?utm_source=`, `?ref=`, `?page=`) must carry canonical pointing to clean URL.
- No two pages have identical canonical.

**Acceptance criteria:**
- [ ] Screaming Frog export: 0 duplicate canonicals.
- [ ] UTM-parameterized URLs return canonical to clean URL when fetched with curl.

#### 2.1.4 No thin pages

**Requirements (define "thin" for this site):**
- Thin = fewer than 300 words of unique body content AND no structured data AND no media.
- Exception: legal pages may be short if content is legally required and accurate.
- Legal pages are excluded from thin-page check.

**Acceptance criteria:**
- [ ] All indexed non-legal pages have >= 300 words of body content.
- [ ] 0 pages with only navigation boilerplate and a CTA.
- [ ] Blog articles all >= 600 words (set in §1.3.8).

#### 2.1.5 Index coverage review workflow (ongoing)

**Cadence:** Weekly during Month 2; founder reviews Search Console every Monday.

**Checklist per review:**
1. Check "Pages" > "Not indexed" for new entries.
2. Check "Pages" > "Indexed" count vs expected indexed-URL count.
3. Check "Sitemaps" for fetch errors.
4. Run URL Inspection on any new page added that week.

**Acceptance criteria:**
- [ ] Workflow documented in a recurring task (e.g., 81-60-TASK-AUTOMATION-PLAN.md or calendar).
- [ ] First Search Console review completed by Day 7 of Month 2.

---

### 2.2 — Technical QA

**References:** 37-QA-TESTING-CHECKLIST.md (full QA checklist),
41-STRIPE-TEST-PLAN.md (payment testing), 40-VERCEL-DEPLOYMENT-CHECKLIST.md (deployment).

#### 2.2.1 Broken-link scan

**Acceptance criteria:**
- [ ] Screaming Frog or equivalent: 0 internal links returning 4xx or 5xx.
- [ ] 0 external links returning 4xx (checked; broken external links logged for fix within 5 days).

#### 2.2.2 Metadata completeness

**Acceptance criteria:**
- [ ] 0 pages missing `<title>`.
- [ ] 0 pages missing `<meta name="description">`.
- [ ] 0 duplicate titles across indexed pages.
- [ ] 0 duplicate meta descriptions across indexed pages.
- [ ] 0 titles over 60 chars or under 30 chars.
- [ ] 0 meta descriptions over 160 chars or under 100 chars.

#### 2.2.3 Schema validation

**Acceptance criteria:**
- [ ] Google Rich Results Test passes for all schema types deployed (Organization, Product, Article, FAQPage).
- [ ] 0 critical schema errors in Search Console structured data report.
- [ ] All Offer schema blocks have price, priceCurrency (EUR), and availability fields.

#### 2.2.4 Core Web Vitals

**Targets (PageSpeed Insights — mobile):**
- LCP < 2.5 s
- CLS < 0.10
- INP < 200 ms

**Acceptance criteria:**
- [ ] Homepage passes all three thresholds on PageSpeed Insights mobile.
- [ ] /produkte passes all three thresholds.
- [ ] At least one product detail page passes all three thresholds.

#### 2.2.5 Image optimization

**Acceptance criteria:**
- [ ] All images served via Next.js `<Image>` component with width, height, and alt attributes.
- [ ] All product images have descriptive German alt text (e.g., "PP-Rollenetiketten opak 100x200 mm").
- [ ] No image above 200 KB after compression.
- [ ] WebP or AVIF format used for all raster images.

#### 2.2.6 Mobile UX

**Acceptance criteria:**
- [ ] All CTAs have min touch target 44×44 px on mobile.
- [ ] No horizontal scroll on 375px viewport.
- [ ] Font sizes >= 16px on body text in mobile view.
- [ ] Navigation menu accessible and functional on mobile.

#### 2.2.7 Form / upload / checkout / account / admin / proof-add-on testing

**References:** 37-QA-TESTING-CHECKLIST.md, 41-STRIPE-TEST-PLAN.md, 17-FILE-UPLOAD-AND-PROOFING.md.

| Test | Pass criteria |
|---|---|
| Quote request form | Submits; operator email received; confirmation shown |
| File upload | PDF/AI/EPS accepted; non-supported format rejected with clear German error |
| Checkout (Stripe TEST mode) | Test card completes payment; order created in DB; confirmation email sent |
| Account registration | User created in Supabase auth; confirmation email sent |
| Reorder flow | Existing order reordered; saved artwork pre-loaded; correct price shown |
| Admin order view | Operator can view, update status, download uploaded file |
| Admin pricing edit | Operator can change a package price; customer-facing page reflects new price |
| Proof-add-on flow (if flag on) | Physical proof add-on adds EUR 10 to order total; server-computed |

**Acceptance criteria:**
- [ ] All 8 test scenarios above pass without errors.
- [ ] Stripe TEST mode: no real charges. Log test charge ID for audit trail.

---

### 2.3 — Content QA

**Objective:** Ensure all customer-facing content meets high-trust, factual, German B2B standards.

#### 2.3.1 No generic AI copy

**Definition:** Generic AI copy = sentences that could appear on any label printing website,
contain no specific product or pricing information, use vague superlatives
("revolutionaer", "erstklassig", "cutting-edge"), or repeat the same structure
across multiple sections.

**Acceptance criteria:**
- [ ] Founder reads every indexed page and signs off that no section reads as AI-template filler.
- [ ] Review checklist: every H1 and H2 is specific to the page (not interchangeable with another page).
- [ ] No sentences containing "revolutionaer", "erstklassig", "innovative Loesung", "massgeschneidert" without substantive context.

#### 2.3.2 No keyword stuffing

**Definition:** Keyword stuffing = same keyword phrase appearing > 4 times per 100 words of body text,
or keyword appearing unnaturally in headings not matching the actual section content.

**Acceptance criteria:**
- [ ] Primary keyword density <= 2.5% per page (measured via SEO tool or manual count).
- [ ] All H1, H2, H3 headings describe the actual section; no heading exists solely to insert a keyword.

#### 2.3.3 No duplicate content blocks

**Acceptance criteria:**
- [ ] Copyscape or Siteliner check: 0 pages with >30% content overlap with another indexed page.
- [ ] Product detail pages (opaque vs transparent) have distinct intro paragraphs and distinct spec tables.

#### 2.3.4 No product-vs-pricing contradictions

**Acceptance criteria:**
- [ ] Manual cross-check: every price shown on /produkte/[slug] pages matches /preise exactly.
- [ ] Design-service fee (EUR 40 / kostenlos conditions) stated identically on all pages where it appears.
- [ ] Printed-proof fee (EUR 10) stated identically on all pages where it appears.
- [ ] Delivery range (SoT #18a: "ca. 10–14 Werktage nach Ihrer Freigabe") stated identically everywhere.

#### 2.3.5 No outdated or empty pages

**Acceptance criteria:**
- [ ] 0 pages with "coming soon", "in Kuerze verfuegbar", "Lorem ipsum", or empty section blocks.
- [ ] All blog articles have a visible publish date in ISO 8601 format (YYYY-MM-DD).
- [ ] No article published before launch date appears with a future date.

#### 2.3.6 No fake trust claims

Per SoT #18c: no eco/recyclable claims without evidence;
no ISO certifications unless held; no testimonials unless real and verifiable.

**Acceptance criteria:**
- [ ] 0 sustainability/eco claims beyond the approved PP material statement (28-CONTENT-TEMPLATES-GERMAN.md canonical copy — **Note: copy not yet written; create in Month 1, see audit ownership gap**).
- [ ] 0 unverified customer testimonials or star ratings.
- [ ] 0 "award-winning" or "market-leading" claims without a cited source.

#### 2.3.7 Legal pages ready

**Acceptance criteria (mirrors 1.3.9 — confirmed complete in Month 2 audit):**
- [ ] All four legal pages complete, linked from footer, and returning 200.
- [ ] Datenschutz updated to list all third-party processors actually in use at time of Month 2 review (may differ from Month 1 draft if new integrations added).
- [ ] AGB reviewed by legal counsel or checked against standard DE AGB generator for correctness.

---

### 2.4 — SEO/GEO Docs Review (2026 Currency)

**Objective:** Verify that the SEO and GEO strategy documents reflect current best practices
for 2026 and translate any gaps into backlog tasks.

**Reference:** 73-2026-EXPERT-GEO-SEO-TIPS.md (2026 SEO tips), 20-SEO-STRATEGY-2026.md,
21-GEO-AI-SEARCH-STRATEGY.md, research-prompts directory (research prompt 04).

#### 2.4.1 Review scope

Docs to review for 2026 currency:

| Doc | Check |
|---|---|
| 20-SEO-STRATEGY-2026.md | Are Core Web Vitals targets, E-E-A-T signals, and content structure rules current? |
| 21-GEO-AI-SEARCH-STRATEGY.md | Are GEO / AI-overview optimisation rules current (as of mid-2026)? |
| 23-KEYWORD-MAP-GERMANY.md | Are target keywords still relevant; any new high-volume terms emerged? |
| 24-METADATA-MAP.md | Do metadata templates reflect current SERP snippet behaviour? |
| 25-SCHEMA-MARKUP-MAP.md | Is schema guidance current? (Google updates schema support regularly) |
| 73-2026-EXPERT-GEO-SEO-TIPS.md | Confirm tips not superseded by mid-2026 algorithm updates |

#### 2.4.2 Review method

Use the `deep-research` skill or a manual ChatGPT/Claude query against the docs.
Recommended prompt basis: research prompt 04 (in `research-prompts/` directory).

**Acceptance criteria:**
- [ ] Each doc in §2.4.1 reviewed; findings documented in a brief memo (can be inline comments or a new doc 84-SEO-GEO-CURRENCY-REVIEW.md if founder directs).
- [ ] Any finding that contradicts current deployed content creates a tracked task in 81-60-TASK-AUTOMATION-PLAN.md.
- [ ] Review completed by Day 21 of Month 2.
- [ ] At least one schema ownership gap (see audit ownership gap #5: GEO/AI schema variants) is resolved and assigned.

---

### 2.5 — Revenue-Target Roadmap Link

**Objective:** Connect the Month 1–2 execution layer to the broader revenue targets
to ensure early operational data informs growth planning.

**References:**
- 04-PRICING-AND-MARGIN-MODEL.md §20.1 (EUR 10,131.50/month contribution scenario),
  §20.2 (EUR 100k/month contribution milestone) — canonical revenue model.
- 00-SOURCE-OF-TRUTH.md decision #5 (three-rung EUR 100k ladder):
  (a) long-term north-star >= EUR 100k/month NET profit ~Year 8–10;
  (b) EUR 100k = mid-term contribution milestone (not net profit);
  (c) interim net-profit targets Year 2–3: ~EUR 8k–35k/month.
- 36-GERMANY-HUB-ROADMAP.md (Year 3+ Germany expansion — NOT Month 1–2).
- 35-ANALYTICS-KPI-DASHBOARD.md (KPI dashboard spec).

**Note (ownership gap from audit):** Phase-to-calendar mapping is deferred.
A founder decision is needed to bind P0–P6 phases to target dates.
This section does NOT assign revenue targets to Month 1–2 (premature).
Instead it establishes the measurement framework so Month 3+ planning has data.

#### 2.5.1 Month 1–2 measurement setup

| Metric | Target (Month 1) | Target (Month 2) |
|---|---|---|
| Orders placed | > 0 (proof of viability) | Track weekly |
| Conversion rate (visitors to order) | Baseline established | Baseline reviewed |
| Average order value | Baseline established | Baseline reviewed |
| Repeat-order rate | n/a (no repeat data yet) | Baseline established |
| Design-service attach rate | Baseline established | Baseline reviewed |
| Printed-proof attach rate | Baseline established | Baseline reviewed |
| Search Console impressions | Baseline established | Week-over-week growth |
| Indexed pages | All intended URLs | 0 regressions |

#### 2.5.2 Revenue-target docs to reference in Month 3 planning

The following existing docs contain the canonical revenue model and should be referenced
when Month 3+ targets are set. Do NOT re-derive or contradict these:

- **04 §20.1** — EUR 10,131.50/month contribution scenario (opaque-only model).
- **04 §20.2** — EUR 100k/month contribution milestone (canonical; mid-term; not net profit).
- **00-SOURCE-OF-TRUTH.md #5** — three-rung EUR 100k ladder (north-star, contribution, net-profit).
- Research prompt 05 (in `research-prompts/` directory) — intended for the 90-day GTM plan
  (doc 57, registered as "not yet written" in SoT §6 Missing-File Register).

#### 2.5.3 Month 2 revenue review task

**Task:** At end of Month 2 (01.08.2026), conduct a revenue review meeting:
1. Pull orders, revenue, and margin data from admin panel.
2. Compare against 04 §20.1 contribution scenario (realistic rate: how many opaque orders per month?).
3. Note any pricing contradictions (any product shown at wrong price? any add-on miscalculated?).
4. Decide whether to enable `NEXT_PUBLIC_FEATURE_ADDONS` (requires Stripe TEST completion per audit).
5. Decide whether to begin Month 3 content-SEO push (blog + programmatic per 22-PROGRAMMATIC-SEO-PLAN.md).

**Acceptance criteria:**
- [ ] Revenue review meeting held by Day 30 of Month 2.
- [ ] 35-ANALYTICS-KPI-DASHBOARD.md KPIs populated with real data.
- [ ] Decision on add-ons flag documented in a SoT addendum or founder note.
- [ ] Month 3 priorities drafted (can be a new doc 84+ or an update to 74).

---

## Cross-cutting acceptance criteria (both months)

- [ ] This document (83) is registered in 00-SOURCE-OF-TRUTH.md §3 Authoritative Version Table.
- [ ] Founder has approved the Month 1 / Month 2 calendar dates as binding (or explicitly deferred binding per audit finding).
- [ ] All tasks flagged as BLOCKED in this doc are tracked in 81-60-TASK-AUTOMATION-PLAN.md.
- [ ] No task in this doc contradicts a decision locked in 00-SOURCE-OF-TRUTH.md §5.
- [ ] German-only rule enforced throughout: build-time language guard active (per 60-CODEX-AGENT-PROTOCOL.md §2).

---

## Known contradictions avoided (documentation)

The following contradictions identified in the audit were consciously navigated in this document:

1. **White-underprint (Weissunterdruckung) pricing conflict** (04 §14.4 vs 30 §9.2 vs 80 §3):
   This doc resolves in favour of 04 §14.4 (quote-only) — transparent product pages
   mark Weissunterdruckung as "auf Anfrage", not as a self-serve add-on. See §1.3.4.

2. **Matt-finish as standard vs paid add-on** (04 §14.3 vs §28.1):
   This doc follows SoT #18d — gloss is standard; matt is a +15% net add-on, flag-gated.
   Month 1 does NOT surface matt-finish. See §1.3.3 and §1.4.1.

3. **Add-ons flag state** (04 §28 vs SoT §10 implementation snapshot):
   This doc treats add-ons as built but flag-gated OFF for Month 1.
   They surface in Month 1 only if founder explicitly enables `NEXT_PUBLIC_FEATURE_ADDONS`.
   See §1.2 and §1.5.

4. **Custom-size engine operator cost-params** (04 §29 vs 81 missing gate):
   This doc requires the custom-size calculator to remain hidden until operator
   enters and locks cost params in Admin §30A. A formal BLOCKED task should be
   added to 81-60-TASK-AUTOMATION-PLAN.md. See §1.4.1 and §1.4.3.

5. **Lieferzeit exact German text** (SoT #18a vs 80 §4 incomplete):
   This doc uses the SoT #18a-approved exact wording everywhere:
   "ca. 10–14 Werktage nach Ihrer Freigabe (Produktion + Versand nach Deutschland).
   Dies ist ein voraussichtlicher Zeitraum, keine bindende Garantie."
   All pages must use this exact sentence (see §1.2, §1.3.2, §1.3.3, §1.3.4, §1.3.5).

6. **Phase-to-calendar mapping deferred** (74 vs no date binding):
   This doc introduces the first calendar layer. Phases are NOT formally bound to
   these calendar dates until founder approves. See document metadata block and §2.5.2.

---

## Open items requiring founder decision before Month 1 end

| Item | Decision needed | Reference |
|---|---|---|
| Date binding: approve Month 1 / Month 2 calendar as binding | Yes / No | Audit monthOneTwoState |
| Enable `NEXT_PUBLIC_FEATURE_ADDONS` in Month 1? | Yes / No (default: No) | SoT #16, 04 §28 |
| Enable matt-finish in Month 1? | Yes / No (default: No) | SoT #18d |
| PP material statement copy | Approve German copy | SoT #18c, ownership gap |
| Net-14 / Rechnungskauf doc owner | Assign to 18 or 31 | Audit ownership gap |
| Index or noindex for legal pages | Confirm per-page decision | §1.1.5 |
| Register this doc (83) in SoT §3 | Action required | SoT registration mechanism |
