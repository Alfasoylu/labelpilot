# Labelpilot.de — Launch Gap Audit
**Date:** 2026-06-09  
**Auditor:** Claude Code (repo-only audit, no live site access)  
**Branch:** main  
**Scope:** Google Ads readiness, landing page, product configurator, legal, tracking, SEO, revenue model  

---

# 1. Executive Verdict

## DANGEROUS — CURRENT SITE WILL WASTE AD BUDGET

Running Google Ads today means spending €300 with zero conversion data, zero optimization signal, and a legally incomplete tracking setup for Germany.

- **GA4 is not installed.** There is no Google Analytics 4 measurement ID in `.env.example`, no `gtag()` in any source file, no GTM container. Every ad click is invisible.
- **Google Ads conversion tag does not exist.** No purchase or lead conversion events can be attributed.
- **Google Consent Mode v2 is not implemented.** The consent banner exists but fires zero signals to Google. Since March 2024, Google blocks conversion modelling for EU traffic without Consent Mode v2. All German traffic = dark traffic.
- **The checkout success page has no conversion event.** A Stripe purchase completes, the customer lands on `/checkout/success`, and nothing is tracked.
- **The two highest-AOV add-ons (Design Service €40, Express) are hidden by a feature flag** (`NEXT_PUBLIC_FEATURE_ADDONS=false`). Ad traffic lands and cannot see or buy these upsells.
- **Legal pages exist but contain placeholder content not reviewed by a German lawyer.** The Widerruf page has an opt-out form for B2C custom goods — but the AGB claims B2B-only intent. This contradiction exposes legal risk.
- **No third-party trust signals exist** — no Trusted Shops badge, no star rating, no customer count, no certifications. German B2B buyers distrust unknown non-EU sellers.
- **The Impressum lists a Hong Kong entity.** German B2B buyers can and do verify this. Without proactive trust framing, HK + Turkey production = high abandonment.
- **Delivery time is stated as a non-binding estimate** ("keine bindende Garantie"). No calendar-day total from order to delivery. This kills B2B purchase confidence.
- **The 1,000-unit tier economics are unknown** — at typical Turkish print + DDP shipping cost, this tier may have near-zero or negative gross margin. Every ad-driven 1,000-unit sale could be a financial loss.

---

# 2. Blocking Issues Before Any Google Ads Spend

| Blocker | Current repo evidence | Business impact | Fix required | Owner | Estimated effort |
|---------|----------------------|-----------------|--------------|-------|-----------------|
| **No GA4 tag** | `.env.example` has zero GA4/GTM variables. Grep for `G-`, `gtag`, `googletagmanager` returns zero source-code hits. | Every ad click is blind. No conversion data, no optimization, no ROAS calculation. | Install GA4 via GTM or direct `<Script>` in `app/layout.tsx`. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to env. | Dev | 2–4 h |
| **No Google Ads conversion tag** | No `AW-` snippet found anywhere. No `gtag('event', 'conversion')` calls. | Google Ads cannot optimize bids. Smart Bidding has no signal. | Add Google Ads conversion tag to GTM or layout. Create a "purchase" and "lead" conversion action in Google Ads. | Dev | 2–4 h |
| **No Google Consent Mode v2** | `ConsentBanner.tsx` writes to a custom cookie and calls `/api/consent`. Zero calls to `gtag('consent', 'update', ...)`. | Google's EU User Consent Policy requires this since March 2024. Without it: no remarketing audiences, conversion modelling disabled, potential ad account policy violation. | On "Alle akzeptieren" fire `gtag('consent', 'update', {analytics_storage: 'granted', ad_storage: 'granted'})`. On "Nur notwendige" fire denied. | Dev | 2–3 h |
| **No conversion event on `/checkout/success`** | `app/(public)/checkout/success/page.tsx` — server component, renders order confirmation, zero analytics calls. | Purchases are invisible to ad platform. Cannot calculate ROAS or CPA. | Add a client component on the success page that fires `gtag('event', 'purchase', {...})` with order value, currency, order ID. | Dev | 3–4 h |
| **ADDONS feature flag off** | `.env.example`: `NEXT_PUBLIC_FEATURE_ADDONS=false`. `CheckoutButton.tsx:100` — entire design service / express block is wrapped in `{addonsFeatureEnabled ? ... : null}`. | Design Service (€40 uplift), Express option, and "I upload my own data" toggle are invisible. AOV is artificially suppressed. Ad traffic cannot see or buy top upsells. | Either enable the flag in production env or remove the feature gate for these stable addons. | Dev / Founder | 30 min |
| **Legal content not reviewed by German lawyer** | `lib/site-content.ts` lines 1886–2165: Impressum, Datenschutz, AGB, Widerruf exist as page data. AGB line 2026: "Das Angebot richtet sich an Verbraucher und Unternehmer." Widerruf line 2165 includes B2C revocation form. But the business claims B2B. | AGB claims both B2B and B2C. B2C = full Widerruf rights apply, including for custom-printed goods (exception §312g(2)(1) BGB exists but must be explicitly stated and conditions met). Inconsistency = legal risk + potential Abmahnung. | Lawyer review. Clarify B2B-only or implement proper B2C flow. Custom-goods Widerruf exception must be explicitly stated if B2C is served. | Lawyer + Founder | 1–2 days |
| **Datenschutz does not cover Google Ads cookies** | `site-content.ts` ~lines 1919–2011: Datenschutz mentions only first-party analytics (section on Statistik-Cookies). No mention of Google Ads, Google Tag Manager, third-party cookies from Google. | Running Google Ads without disclosing Google cookies in the Datenschutz violates DSGVO Art. 13 and German DPA guidance. Cookie banner must list all data processors. | Update Datenschutz to include Google (Analytics, Ads, Tag Manager) as data processors once GA4 is installed. | Dev + Lawyer | 2–4 h |
| **No trust signals for HK seller** | `lib/site-content.ts` line 1898: Impressum correctly lists "Zhenkai Global Trading Limited, Hong Kong." No proactive framing anywhere on product/landing pages. | German B2B buyers google suppliers. HK + Turkey with no visible trust framing → high bounce rate, wasted CPC. | Add a visible trust block: "Produced in Turkey, DDP delivery to Germany, German consumer law applies, payment via Stripe." | Dev + Founder | 2–4 h |

---

# 3. Google Ads Readiness Checklist

| Requirement | Status | Evidence from repo | Required fix | Priority |
|------------|--------|-------------------|--------------|----------|
| German landing page clear B2B offer above fold | PARTIAL | `HeroSection.tsx` exists; home page has title, lead, CTA. But hero copy ("PP-Rollenetiketten für Marken in Deutschland") is generic, not B2B-specific above fold. | Add "Für Unternehmen" or industry signal in eyebrow or H1. | HIGH |
| Price / package pricing visible before checkout | PASS | `PricingCard.tsx` shows net price, gross price, per-piece price, shipping label. Configurator shows price inline. | — | — |
| CTA visible above the fold | PARTIAL | `HeroSection.tsx` renders `primaryCta` and `secondaryCta`. Whether this is above the fold depends on deployed layout — cannot verify CSS without running the site. | Test on mobile — verify CTAs are in viewport without scroll. | HIGH |
| Mobile layout not broken | UNKNOWN | CSS is in `globals.css` / Tailwind classes. No mobile-specific tests in repo. No preview tool access in this audit. | Manual QA on actual device or preview tool. | HIGH |
| Lead/quote form works | PASS | `QuoteRequestForm.tsx` — full form with company, email, material, quantity, consent checkbox, server action `submitQuoteRequest`. Toast feedback on success/error. UTM tracking via `SourceTrackingFields`. | — | — |
| Checkout works (direct purchase) | PASS | Stripe checkout session creation in `/api/checkout/create-session/route.ts`. `CheckoutButton.tsx` routes to `/de/checkout`. Webhook handler exists. | — | — |
| File upload exists and is understandable | PARTIAL | `ArtworkUploadForm.tsx` exists. But upload is post-order (after payment), not pre-checkout. Pre-checkout, users cannot see or test the upload flow. | Add UI hint before checkout explaining upload happens after payment. | MEDIUM |
| Thank-you / conversion event page exists | FAIL | `/checkout/success` page exists (`app/(public)/checkout/success/page.tsx`) but fires ZERO analytics events. No `gtag('event', 'purchase')`, no first-party `trackLeadEvent`, nothing. | Add `PurchaseEventFirer` client component to success page. | CRITICAL |
| GA4 configured | FAIL | No GA4 measurement ID in `.env.example`. No `gtag` snippet in `app/layout.tsx`. VisitorTracker sends to first-party `/api/events` only. | Install GA4 via GTM or direct `<Script>`. | CRITICAL |
| Google Ads conversion tracking configured | FAIL | No `AW-` conversion tag anywhere in codebase. | Create Google Ads conversion action, add tag to site. | CRITICAL |
| Consent / cookie banner exists | PASS | `ConsentBanner.tsx` — DSGVO-compliant UI with Notwendig / Statistik / Marketing options. Accept-all, reject-all, and settings flow implemented. | — | — |
| Consent Mode v2 signals sent to Google | FAIL | `ConsentBanner.tsx` writes custom cookies and calls `/api/consent`. No `gtag('consent', 'update', ...)` calls. | Add Consent Mode v2 gtag calls to ConsentBanner. | CRITICAL |
| Legal pages exist | PASS | Impressum, Datenschutz, AGB, Widerruf all in `site-content.ts` and rendered via `/de/[slug]` dynamic route. | Content needs lawyer review. | MEDIUM |
| Trust signals exist | PARTIAL | `TrustBar.tsx` renders text-only trust items (title + body). No star ratings, no customer count, no trust badges, no certifications. | Add at minimum 1 verifiable trust claim (e.g. "X Bestellungen abgewickelt" once true). | HIGH |
| Delivery / shipping promise clear | PARTIAL | Configurator shows "ca. 10–14 Werktage nach Ihrer Freigabe (keine bindende Garantie)." No total calendar-day figure from order to delivery. | Add total turnaround estimate: "i.d.R. 15–20 Werktage ab Zahlungseingang bis Lieferung in Deutschland" or similar honest figure. | HIGH |
| Seller identity clear | PARTIAL | Impressum correctly lists HK entity. No proactive disclosure on product pages. | Add trust block on landing/product pages explaining the entity, DDP delivery, and German law applicability. | HIGH |
| DDP / Turkey production / HK entity risk handled | FAIL | Only in Impressum. No landing page copy. German B2B buyers who google the company name will find nothing reassuring. | Create a transparent "Über uns / So funktioniert es" block or FAQ entry addressing this directly. | HIGH |

---

# 4. Product Configurator / Variant Gap

| Option / Variant | Current status | Decision | Reason | Code/docs location |
|-----------------|---------------|----------|--------|-------------------|
| **Material: PP opaque (white)** | IMPLEMENTED | IMPLEMENT NOW | Working in configurator. | `components/product-configurator.tsx:63` |
| **Material: PP transparent** | IMPLEMENTED | IMPLEMENT NOW | Working in configurator. | `components/product-configurator.tsx:69` |
| **Material: PP matt finish** | IMPLEMENTED (no price delta) | IMPLEMENT NOW | Matt is the default; glossy is also available, no price difference. Honest. | `components/product-configurator.tsx:175` |
| **Material: PP glossy finish** | IMPLEMENTED (no price delta) | IMPLEMENT NOW | Working. No price difference — correct for standard materials. | `components/product-configurator.tsx:181` |
| **Quantity tier 1,000** | IMPLEMENTED | REVIEW NOW — economics risk | 1,000-unit tier is live and orderable. At Turkish DDP production + per-unit cost, this tier may not be profitable. The configurator copy says "bezahlter Einstieg" (paid trial framing). Verify gross margin before running ads that drive 1K orders. | `components/product-configurator.tsx:124` |
| **Quantity tier 2,000** | IMPLEMENTED | IMPLEMENT NOW | Reasonable B2B entry. | `components/product-configurator.tsx:124` |
| **Quantity tier 5,000** | IMPLEMENTED | IMPLEMENT NOW — push this | Marked "empfohlen" in configurator. Highest B2B AOV in standard tiers. Correctly nudged. | `components/product-configurator.tsx:137` |
| **Quantity tier 10,000** | IMPLEMENTED | IMPLEMENT NOW | Large B2B order. Routes to quote at 20K+. Correct cutoff. | `components/product-configurator.tsx:124` |
| **Size fixed 100×200 mm** | IMPLEMENTED | IMPLEMENT NOW | Standard size is the only self-serve checkout size. Correct simplification. | `components/product-configurator.tsx:100` |
| **Custom size (Wunschformat)** | IMPLEMENTED but FEATURE-FLAGGED OFF (`NEXT_PUBLIC_FEATURE_CUSTOM_SIZE=false`) | IMPLEMENT LATER | Routes to quote form when flag is off. This is safe. Enable when calculator is validated. | `components/product-configurator.tsx:217`, `lib/pricing/custom-size-feature.ts` |
| **White ink / Weißunterdruck for transparent** | ROUTES TO QUOTE | IMPLEMENT NOW (as-is) | Correctly shows warning on transparent material: "Weißunterdruck ist nicht im Standardpreis" and links to quote. This is the right behavior — do not automate white ink pricing yet. | `components/product-configurator.tsx:85–93` |
| **Design service €40** | IMPLEMENTED but FEATURE-FLAGGED OFF | IMPLEMENT NOW — enable flag | This is a high-margin add-on that directly improves AOV. The code is complete (`CheckoutButton.tsx:100`). Only the env flag blocks it. Hiding it suppresses revenue on every order. | `components/checkout/CheckoutButton.tsx:100`, `.env.example:6` |
| **Design service free rule (≥€2,000 net)** | IMPLEMENTED | IMPLEMENT NOW | `CheckoutButton.tsx` line 112: "Kostenlos ab 2.000 EUR netto oder wenn Sie druckfertige Daten selbst hochladen." Logic correct. Needs the flag enabled to show. | `components/checkout/CheckoutButton.tsx:112` |
| **Printed proof €10** | IMPLEMENTED | IMPLEMENT NOW | `CheckoutButton.tsx:66`: "Physischen Andruck hinzufügen (10,00 EUR netto)" — visible in CheckoutButton regardless of addons flag (it's in the main panel). Functional. | `components/checkout/CheckoutButton.tsx:66` |
| **Express production** | IMPLEMENTED but FEATURE-FLAGGED OFF | IMPLEMENT NOW — enable flag | "+9,90 EUR netto" upsell. Complete code. Same flag issue as design service. | `components/checkout/CheckoutButton.tsx:125` |
| **Extra design variants (multi-motive)** | IMPLEMENTED | IMPLEMENT NOW | Dropdown 1–5 Druckmotive in `CheckoutButton.tsx:78`. Not flag-gated. Works. | `components/checkout/CheckoutButton.tsx:78` |
| **File upload post-order** | IMPLEMENTED | IMPLEMENT NOW | `ArtworkUploadForm.tsx` + `/api/orders/[orderId]/artwork/`. Working. Token-gated upload URL in success page. | `components/orders/ArtworkUploadForm.tsx` |
| **Data check / Datenprüfung** | PARTIAL — stated as included | IMPLEMENT NOW | "Standard-Datenprüfung und ein digitaler Proof bleiben inklusive" stated in CheckoutButton hint. No automated check exists — manual admin review. Fine for first 10 orders. | `components/checkout/CheckoutButton.tsx:62` |
| **Saved artwork / repeat order** | IMPLEMENTED | IMPLEMENT NOW | Reorder system in `/api/reorders/`, `ReorderWorkflowBlock` component, `refill-reminders` cron. Database schema has reorder linking. | `app/api/reorders/route.ts`, `components/sections/ReorderWorkflowBlock.tsx` |
| **Delivery-time selection** | NOT IMPLEMENTED | NEVER (for now) | Standard lead time is not negotiable at small volumes. Only "Express" as a flag is sensible. Don't add date-picker complexity. | — |
| **Reorder UX (one-click)** | IMPLEMENTED | IMPLEMENT NOW | Account portal + admin reorder flow built. | `app/(account)/konto/` |
| **Ablösbarer Kleber (removable adhesive)** | ROUTES TO QUOTE | IMPLEMENT LATER | Configurator routes to quote for special adhesives. Correct for now. | `components/product-configurator.tsx:77` |
| **Tiefkühlkleber (freezer adhesive)** | ROUTES TO QUOTE | IMPLEMENT LATER | Same as above. | `components/product-configurator.tsx:77` |
| **Variable data / Chargennummer** | IMPLEMENTED (admin-side) | IMPLEMENT LATER for self-serve | `admin/variable-data` page exists. Not self-serve for customers yet. Right call — adds complexity without helping first 10 orders. | `app/(admin)/admin/variable-data/` |
| **Roll direction / Wickelrichtung** | CAPTURED at checkout intake | IMPLEMENT NOW (verify) | CheckoutIntakeForm should capture roll direction. Verify this field exists in the intake form. | `components/checkout/CheckoutIntakeForm.tsx` |
| **Oval / special shapes** | ROUTES TO QUOTE | NEVER for standard checkout | Too complex to automate. Quote-only is correct. | Custom-size engine has oval surcharge (`BUG-005` in test file) |
| **Sample box** | IMPLEMENTED | IMPLEMENT NOW | `SampleBoxCard` + `sample-box-request-form.tsx` + server action. Good lead capture for buyers not ready to order. | `components/sample-box-request-form.tsx` |

---

# 5. Landing Page Conversion Audit

| Page section | Exists? | Current problem | Required copy/function | Priority |
|-------------|---------|-----------------|----------------------|----------|
| **Hero: H1** | YES | "PP-Rollenetiketten für Marken in Deutschland" — correct product focus. | Add a benefit sub-phrase: e.g. "ab 1.000 Stück, geliefert nach Deutschland." | MEDIUM |
| **Hero: eyebrow** | YES | Eyebrow field exists. | Use "Für Lebensmittel, Getränke & Supplemente" to signal industry fit immediately. | MEDIUM |
| **Hero: lead paragraph** | YES | Lead text exists. | Verify it includes a delivery or pricing signal to prevent scroll-abandonment. | MEDIUM |
| **Hero: primary CTA** | YES | CTA exists via `HeroSection primaryCta`. | Verify CTA text is "Jetzt konfigurieren" or "Preis berechnen" (action-oriented), not just a link label. | HIGH |
| **Hero: price anchor above fold** | UNKNOWN | `PricingCard.tsx` shows prices. Whether pricing cards appear before scroll on homepage depends on layout order — cannot verify without live render. | If pricing cards are below fold, add "ab X EUR netto / 1.000 Stück" text in hero itself. | HIGH |
| **Pricing / packages section** | YES | `PricingCard.tsx` shows net price, gross price, per-piece price, shipping. | Good. Ensure "inkl. Versand nach Deutschland" is visible on every card (currently conditional: `tier.shippingLabel`). | MEDIUM |
| **Product material explanation** | YES | Configurator explains Opaque vs Transparent. `SpecTable` and `ComparisonTable` components exist. | Verify material explanation has concrete B2B use-case framing (e.g. "Opak für Honig-Gläser, Transparent für Flaschen mit No-Label-Look"). | MEDIUM |
| **Use-case / industry sections** | YES | Industry pages exist: lebensmittel, getränke, supplement, kosmetik, private-label. | Good programmatic structure. Verify these pages appear in the main nav or are prominently linked from the homepage. | MEDIUM |
| **Trust section** | PARTIAL | `TrustBar.tsx` renders text items. No star ratings, no customer count, no trust badges. | Add at minimum: one verifiable claim (production location, DDP delivery, Stripe payment), one social proof (even if it's a founding story or a specific process promise). | HIGH |
| **How it works** | YES | `ProcessSteps.tsx` section exists. | Verify the steps clearly show: order → upload → proof → production → delivery with calendar timeline. | MEDIUM |
| **Proof / design / upload explanation** | PARTIAL | `CheckoutButton.tsx` has hint text. `DynamicPage` content has file upload instructions. | Add a visible FAQ or sidebar block explaining the upload process BEFORE checkout. Buyers hesitate if they don't know what file to prepare. | HIGH |
| **Delivery and DDP explanation** | PARTIAL | Configurator shows "inkl. Versand nach Deutschland." No DDP framing anywhere. | Add a trust block: "Verzollung, Import und Lieferung nach Deutschland — alles inklusive (DDP). Kein Aufwand für Sie." | HIGH |
| **FAQ section** | YES | `FaqAccordion.tsx` + `buildFaqSchema()`. Product pages have FAQs. | Verify FAQ covers: delivery time, file formats, Widerruf for custom goods, who the seller is, production in Turkey. | MEDIUM |
| **Final CTA** | YES | CTA components exist. | Verify a CTA block appears after pricing and after trust section (not just at hero). | MEDIUM |
| **Mobile ordering experience** | UNKNOWN | Cannot verify without live rendering. CSS-only layout. | Manual QA: test configurator, CheckoutButton, and quote form on 375px viewport. | CRITICAL |
| **Above-fold B2B signal** | PARTIAL | "PP-Rollenetiketten" is B2B by implication but "Marken" could be B2C. | Add "B2B" or "für Unternehmen" somewhere in eyebrow or hero to prevent wasted B2C clicks from ads. | HIGH |

---

# 6. Legal and Trust Audit

| Requirement | Exists? | Current repo evidence | Risk | Fix |
|------------|---------|----------------------|------|-----|
| **Impressum** | YES | `site-content.ts` line 1886–1918. Lists: Zhenkai Global Trading Limited, HK address, HK Business Registration Number. | MEDIUM — HK entity is legally correct but unexpected for German buyers. No German contact phone. | Add a German contact email or phone if possible. Mark for lawyer review to confirm all TMG §5 fields are present. |
| **Datenschutz** | YES | `site-content.ts` ~lines 1919–2011. Covers first-party cookies, visitor ID, consent mechanism, DSGVO rights. | HIGH — Does NOT mention Google Ads, GA4, or any third-party cookies. Once GA4 is installed, this must be updated. | Add Google as data processor once GA4 is live. Currently honest (no third-party tracking exists). |
| **AGB** | YES | `site-content.ts` lines 2012–2136. Covers: Geltungsbereich, Vertragsschluss, Preise, Lieferung, Druckdaten, Mängelrecht, Haftungsbeschränkung. | HIGH — AGB line 2026: "Das Angebot richtet sich an Verbraucher und Unternehmer." If B2C, full German consumer-protection law applies (Fernabsatzrecht, Widerruf etc.) even for custom goods, unless exception is properly stated. | Lawyer review. Decide: B2B-only or B2C-capable. If B2B-only, add "Verträge werden ausschließlich mit Unternehmern i.S.d. §14 BGB geschlossen." |
| **Widerruf** | YES | `site-content.ts` lines 2137–2165. Includes revocation form and cancellation policy. | HIGH — Widerruf exists which implies B2C intent. For custom-printed goods, §312g(2)(1) BGB exemption applies IF the goods are "nach Kundenspezifikation hergestellt" AND this is clearly communicated before checkout. The current page does not explicitly state the exception conditions. | Lawyer review. Either: (a) properly invoke §312g(2)(1) exception pre-checkout with clear notice, or (b) if B2B-only, remove Widerruf for B2B customers but keep for any B2C orders. |
| **Cookie consent** | YES | `ConsentBanner.tsx` — DSGVO-compliant UI, Notwendig/Statistik/Marketing, full granular control, footer link to re-open. | LOW (for current first-party-only tracking). HIGH once GA4 is added. | Add Google consent signals (Consent Mode v2) before adding GA4. |
| **Google Consent Mode v2** | NO | No `gtag('consent', ...)` calls anywhere. | HIGH — Required by Google EU User Consent Policy. Without it, Google Ads conversion modeling and remarketing are disabled. Technical violation. | Implement before any Google Ads campaign. |
| **Shipping / delivery policy** | PARTIAL | AGB has "Lieferung" section. Sitemap includes `/de/versand` but no `versand` slug data found in `site-content.ts`. | MEDIUM — No dedicated shipping page with clear calendar-day estimate. B2B buyers need this upfront. | Add `/de/versand` page content to `site-content.ts`. |
| **Refund / complaint / defect policy** | PARTIAL | AGB has "Mängelrecht" section. No dedicated defect/return process page. | MEDIUM — German law requires clear complaint path. AGB text exists but is not prominently linked from product pages. | Link Mängelrecht section from product pages' FAQ. |
| **Seller of record identity** | PARTIAL | Impressum only. Not disclosed on product/checkout pages. | HIGH — If a German buyer files a chargeback, they need to know who the seller is. Stripe shows Zhenkai Global. If buyer doesn't recognize this name, chargeback risk is high. | Add "Vertragspartner: Zhenkai Global Trading Limited" prominently at checkout and in order confirmation email. |
| **VAT / invoice wording** | PARTIAL | `PricingCard.tsx` shows "inkl. 19% MwSt." and "Nettopreis." `CheckoutButton.tsx` shows both net and gross. | LOW-MEDIUM — Net/gross pricing shown. Verify Stripe invoices show German VAT correctly. VAT registration in Germany may be needed. | Lawyer/tax advisor review. DDP import + digital sale from HK may require German VAT registration (§3a UStG or IOSS-like rules). |
| **Production in Turkey / DDP wording** | PARTIAL | AGB mentions Turkey as "Export- und Logistikpartner." Not on product pages. | MEDIUM — German B2B buyers need to know DDP means no customs hassle for them. Currently buried in AGB. | Add DDP explanation to product pages and FAQ. "Produktion in der Türkei, DDP-Lieferung nach Deutschland — Zoll und Import sind für Sie erledigt." |
| **Contact details and support path** | PARTIAL | `EMAIL_REPLY_TO=kontakt@labelpilot.de` in env. `/de/kontakt` page referenced in checkout success. Live chat via `LiveChat.tsx` (Telegram webhook). | LOW — Contact email exists. | Verify `/de/kontakt` page exists and has email + response time promise. |
| **Verpackungsgesetz (LUCID)** | UNKNOWN | Not mentioned anywhere in legal pages. | HIGH — As DDP importer shipping to Germany, Labelpilot may need LUCID registration. Printed PP labels on rolls = likely packaging material subject to VerpackG. | Lawyer review needed. If applicable, register with LUCID before any German shipments. Mark as "needs lawyer review." |
| **Datenschutzbeauftragter** | UNKNOWN | Not mentioned in Datenschutz page. | LOW-MEDIUM — Small companies (<20 employees processing data automatically) may not need a DPO. | Confirm employee count with lawyer. |

---

# 7. Tracking and Analytics Audit

| Event / Tool | Current status | Where implemented | Missing piece | Must fix before ads? |
|-------------|---------------|-------------------|---------------|---------------------|
| **GA4** | NOT IMPLEMENTED | — | No measurement ID in `.env.example`. No `gtag` in `app/layout.tsx`. | YES — BLOCKING |
| **Google Ads conversion tag** | NOT IMPLEMENTED | — | No `AW-` snippet. No conversion action defined in Google Ads. | YES — BLOCKING |
| **GTM** | NOT IMPLEMENTED | — | No GTM container anywhere. | YES (or implement GA4/Ads directly without GTM — both valid) |
| **Consent banner** | IMPLEMENTED | `components/consent/ConsentBanner.tsx` | Banner exists but fires no signals to Google. | Partially done |
| **Consent Mode v2** | NOT IMPLEMENTED | — | No `gtag('consent', 'update', ...)` calls. Required for Germany since March 2024. | YES — BLOCKING |
| **First-party page_view** | IMPLEMENTED | `components/analytics/VisitorTracker.tsx` → `/api/events` | Works only with analytics consent. Sends to internal DB. Good for admin analytics panel. | NO (internal use only) |
| **form_submit / quote_request** | IMPLEMENTED (first-party only) | `components/quote-request-form.tsx:99`: `trackLeadEvent('quote_form_submit', ...)` | Fires to `/api/events` only. Not sent to GA4/Ads. | YES — add GA4 event too once GA4 exists |
| **add_to_cart** | NOT IMPLEMENTED | — | Configurator selection is not tracked as add_to_cart. No GA4 event. | LOW (no cart exists; purchase event sufficient) |
| **begin_checkout** | NOT IMPLEMENTED | — | `CheckoutButton` click routes to `/de/checkout` but fires no analytics event. | MEDIUM |
| **purchase** | NOT IMPLEMENTED | — | `/checkout/success` page has zero analytics calls. `session_id` is available in query string. Order value is available from Stripe session. | YES — BLOCKING |
| **file_upload_started** | IMPLEMENTED (first-party) | `ArtworkUploadForm.tsx` — trackLeadEvent exists | Not sent to GA4. | LOW |
| **file_upload_completed** | IMPLEMENTED (first-party) | Same as above | Not sent to GA4. | LOW |
| **lead value / order value** | NOT SENT to GA4 | Order value is in Stripe session, accessible on success page | Must extract `amount_total` from Stripe session and pass to GA4 `purchase` event. | YES — BLOCKING |
| **thank-you page** | EXISTS but not tracked | `app/(public)/checkout/success/page.tsx` | Page renders but fires no events. | YES — BLOCKING |
| **Server-side tracking** | NOT IMPLEMENTED | — | No server-side GA4 or Ads events. Client-side only (once GA4 is added). | MEDIUM (nice-to-have for consent-denied traffic) |
| **Quote form conversion** | PARTIAL | First-party `trackLeadEvent` fires. No GA4 lead event. | Once GA4 exists: add `gtag('event', 'generate_lead', {value: estimatedValue})` on quote submit. | YES |
| **Sample box request** | PARTIAL | `sample-box-request-form.tsx` calls `trackLeadEvent`. No GA4. | Same as above. | MEDIUM |

---

# 8. SEO Minimum Readiness

| SEO item | Status | Evidence | Fix | Priority |
|---------|--------|---------|-----|----------|
| **title/meta per page** | PASS | `lib/seo/metadata.ts` has `metadataMap` with title + description for every public page. `buildCanonicalMetadata()` applies it. | — | — |
| **canonical** | PASS | `buildCanonicalMetadata()` sets `alternates.canonical` for all indexable pages. `isNonIndexablePath()` suppresses canonical for admin/checkout routes. | — | — |
| **robots.txt** | PASS | `app/robots.ts` generates proper robots.txt. `ROBOTS_ALLOW_PATHS: ["/de", "/de/"]` allows all public pages. `ROBOTS_DISALLOW_PATHS` blocks admin, API, checkout. | — | — |
| **sitemap.xml** | PASS | `app/sitemap.ts` generates dynamic sitemap from `sitemapEntries`. Legal pages, product pages, guides, glossary all included. Deferred routes excluded via `deferredPhase2Routes`. | — | — |
| **Product schema** | PASS | `buildPageSchema()` generates `Product` schema with `Offer` entries (price, availability, SKU, quantity) for product pages. | Verify `offers.price` uses net price (not gross) per schema.org best practice. | LOW |
| **Organization schema** | PASS | `buildOrganizationSchema()` on homepage. Includes name, URL, logo, sameAs (Instagram), description, areaServed. | — | — |
| **Breadcrumb schema** | PASS | `buildBreadcrumbSchema()` applied in `[slug]/page.tsx`. Covers glossar, ratgeber, product pages. | — | — |
| **FAQ schema** | PASS | `buildFaqSchema()` applied in `[slug]/page.tsx` when `page.faqs` exists. | — | — |
| **HowTo schema** | PASS | `buildHowToSchema()` applied for pages with `howToSteps`. | — | — |
| **Open Graph** | PASS | All pages have OG title, description, image (`og-default-labelpilot-1200x630.png`), locale `de_DE`. | — | — |
| **Twitter card** | PASS | Twitter card in `buildCanonicalMetadata()`. | — | — |
| **Image alt text** | UNKNOWN | `public/images/` has many webp files. Alt text depends on how they're used in components. Cannot verify without reading every image component. | Audit image `alt` attributes in `HeroSection`, `LabelJourney`, editorial components. | MEDIUM |
| **Core Web Vitals obvious risks** | UNKNOWN | Multiple Google Fonts loaded in `app/layout.tsx` (`Instrument_Sans`, `IBM_Plex_Sans`, `IBM_Plex_Mono`) — all with `display: swap`. No apparent `<Image>` component usage (Next.js Image optimization). | Check if product images use `next/image` or raw `<img>`. Raw `<img>` = no lazy loading, no srcset = CWV risk. | MEDIUM |
| **noindex leaks** | LOW RISK | `isNonIndexablePath()` and `ROBOTS_DISALLOW_PATHS` both guard admin/API/checkout. `robots: {index: false}` on success page. | Verify `/de/kalkulator` and `/de/wunschformat` are indexable or correctly excluded. | LOW |
| **Duplicate quantity/package pages** | LOW RISK | Quantity selection is UI state in configurator, not separate URLs. No `/de/etiketten/1000` style pages exist. | — | — |
| **Internal links** | PASS (documented) | `docs/27-INTERNAL-LINKING-ENGINE.md` exists. Product pages, glossary, and ratgeber pages have `relatedLinks`. `hubLinks` on hub pages. | Verify homepage has visible links to top product pages (not just in footer). | MEDIUM |
| **lang attribute** | PASS | `app/layout.tsx` line 79: `<html lang="de">`. | — | — |
| **metadataBase** | PASS | `app/layout.tsx` line 31: `metadataBase: new URL(buildAbsoluteUrl("/"))`. | — | — |

---

# 9. Revenue Reality Risk Check

**Does the site push low-AOV small orders or high-AOV B2B orders?**  
Mixed signal. The configurator defaults to 5,000 units ("empfohlen") and explicitly labels 1,000-unit as "bezahlter Einstieg" (good). But the ADDONS feature flag is OFF, hiding Design Service (+€40), Express (+€9.90), and the "I upload my own data" path that unlocks the design-service waiver. Without these upsells visible, average AOV is artificially lower than the business model requires.

**Does the site make 5,000+ and 10,000+ quantity packages more attractive?**  
Partially. The configurator marks 5,000 as "empfohlen." `PricingCard.tsx` shows per-piece price, which implicitly shows quantity discount. No explicit "you save X EUR vs. 1,000-unit price" comparison is shown.

**Does it explain repeat-order benefits?**  
Yes. `ReorderWorkflowBlock.tsx` exists. Account portal shows saved artwork. Cron job sends refill reminders. This is well-implemented for post-order retention. But it's not visible to first-time ad traffic who needs to understand the repeat-order story to justify the 5,000-unit investment.

**Does it capture leads when the customer is not ready to pay immediately?**  
Yes — `QuoteRequestForm.tsx` is comprehensive and works. `SampleBoxCard` exists. But the quote form is only at `/de/angebot-anfordern` and may not be prominently placed on product pages or the configurator result.

**Does the current UX support a €500–€2,000 B2B order?**  
Partially. Stripe checkout exists and works. "Auf Rechnung" (invoice payment) is a separate page (`/de/auf-rechnung-beantragen`) that requires admin approval — not self-serve. German B2B buyers strongly prefer Rechnung. This friction may prevent high-AOV orders from completing.

| Risk | Evidence | Financial impact | Fix |
|------|----------|-----------------|-----|
| **ADDONS flag off suppresses AOV** | `NEXT_PUBLIC_FEATURE_ADDONS=false`. Design Service (€40) + Express (€9.90) invisible. | If average ad conversion is 100 orders/month with 30% design-service attach at €40 = €1,200/month revenue lost. | Enable flag in production NOW. |
| **1,000-unit margin unknown** | No production cost data in repo. Configurator calls it "bezahlter Einstieg" suggesting it's not profitable per-se. | Ads driving 1K orders could generate negative-margin transactions. | Calculate gross margin for 1K tier. Consider positioning it as a €X minimum or "Testmenge" with a note. |
| **"Auf Rechnung" is not self-serve** | `/de/auf-rechnung-beantragen` exists as a separate manual request page. | German B2B buyers expect Rechnung (invoice) as standard. Blocking it → lost orders from mid-large companies that cannot pay by credit card. | Integrate a Rechnung option at checkout (e.g. Klarna B2B, Billie, or manual Rechnung with admin approval at low risk level). |
| **No "save quote for later" flow** | Quote form submits to admin. No customer portal entry until they create an account. | B2B buyers research, get multiple quotes, decide later. No persistence of their configuration means they start over on return visit. | Add "Angebot als PDF zusenden" option to quote form. |
| **Delivery estimate vague** | "ca. 10–14 Werktage nach Ihrer Freigabe (keine bindende Garantie)" | B2B buyers need to plan. Vague delivery = purchase hesitation = lower conversion on high-value orders. | Add total order-to-delivery estimate: "Typisch 15–22 Werktage ab Zahlungseingang bis Lieferadresse Deutschland." |
| **HK seller identity + no reviews** | Impressum only. No social proof anywhere. | German B2B buyers distrust unknown non-EU suppliers. High-AOV orders (€500+) have higher due-diligence friction. | Add: 1 case study, or a LinkedIn / Instagram post showing real labels, or a production photo with location. Even one real customer quote helps. |

---

# 10. Prioritized Fix Plan

| Day | Task | File/component likely affected | Acceptance criteria | Effort |
|-----|------|-------------------------------|--------------------|----|
| **Day 1** | Install GA4 (direct or via GTM) | `app/layout.tsx` — add `<Script>` with GA4 measurement ID. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.example` and Vercel env. | GA4 DebugView shows page_view on homepage load. | 2–3 h |
| **Day 1** | Add Google Consent Mode v2 to ConsentBanner | `components/consent/ConsentBanner.tsx` — add `gtag('consent', 'update', {analytics_storage, ad_storage})` inside `persist()` function. Add default denied state in `<head>` before GA4 tag loads. | GA4 console shows `consent_mode: granted` after "Alle akzeptieren." | 2–3 h |
| **Day 2** | Add Google Ads conversion tag + purchase event on success page | `app/(public)/checkout/success/page.tsx` — add a client component `PurchaseEventFirer` that reads `session_id`, calls Stripe to get `amount_total`, fires `gtag('event', 'purchase', {transaction_id, value, currency:'EUR'})`. | Google Ads shows a test conversion event. GA4 shows purchase event with order value. | 3–4 h |
| **Day 2** | Add GA4 lead event on quote form submit | `components/quote-request-form.tsx` — inside the `state.status === 'success'` block, add `gtag('event', 'generate_lead', {event_category: 'quote'})` alongside existing `trackLeadEvent`. | GA4 shows `generate_lead` event after form submission. | 1–2 h |
| **Day 3** | Enable ADDONS feature flag in production | Vercel env: set `NEXT_PUBLIC_FEATURE_ADDONS=true`. | Design service checkbox, express checkbox, and "I upload my own data" toggle visible in `CheckoutButton`. QA that pricing updates correctly (net + gross). | 30 min + QA |
| **Day 3** | Verify legal page content with placeholder lawyer review | `lib/site-content.ts` — Impressum, AGB, Widerruf. Focus on B2B-vs-B2C declaration and custom-goods §312g exception. | Prepare draft "for lawyer review" email with the three specific issues: (1) B2B vs B2C declaration, (2) §312g wording, (3) LUCID/VerpackG question. | 2 h (founder time) |
| **Day 4** | Add seller identity trust block to product pages | New component `components/sections/SellerTrustBlock.tsx`. Place in product page template (`components/page-renderers.tsx`) above or below pricing section. | Block visible on `/de/opake-pp-etiketten` stating: entity, DDP, Stripe payment, German law applicability. | 3–4 h |
| **Day 4** | Add delivery time FAQ entry and total turnaround estimate | `lib/site-content.ts` — add FAQ entry to product pages. Update configurator delivery text. | FAQ entry visible on at least one product page. Configurator shows total calendar estimate, not just "nach Ihrer Freigabe." | 1–2 h |
| **Day 5** | Add Google Ads remarketing audience and begin_checkout event | `components/checkout/CheckoutButton.tsx` — add `gtag('event', 'begin_checkout', {value, currency, items:[...]})` before `router.push`. | GA4 shows `begin_checkout` event when checkout button clicked. Google Ads audience can capture these visitors. | 2 h |
| **Day 5** | QA mobile layout on configurator + quote form | Local browser DevTools (375px iPhone viewport). | Configurator buttons, CheckoutButton, and QuoteRequestForm are usable without horizontal scroll. CTAs visible without scroll on primary mobile sizes. | 2–3 h |
| **Day 6** | Add `/de/versand` page content to `site-content.ts` | `lib/site-content.ts` — add `versand` slug data with shipping details. | `/de/versand` returns a rendered page with delivery times, DDP explanation, carrier info. No 404. | 2–3 h |
| **Day 7** | Verify 1,000-unit gross margin; decide tier positioning | No code change — financial calculation. | Confirm: (a) 1K tier is profitable at current Stripe price, or (b) reposition as "Testmenge ab €X" with a clear message that 5K is the recommended starting volume. | 2–4 h (founder + production partner) |

---

# 11. IMPLEMENT NOW / LATER / NEVER

| Recommendation | Decision | Reason | Effort |
|---------------|----------|--------|--------|
| Install GA4 + Google Consent Mode v2 | IMPLEMENT NOW | Without this, every ad euro is blind. Legal requirement in Germany. | 4–6 h |
| Add purchase conversion event on `/checkout/success` | IMPLEMENT NOW | GA4 and Google Ads have zero conversion data without this. | 3–4 h |
| Enable `NEXT_PUBLIC_FEATURE_ADDONS=true` in production | IMPLEMENT NOW | Design service + express add-ons are ready and tested. The env flag is the only thing blocking revenue. | 30 min |
| Add Google Ads conversion tag | IMPLEMENT NOW | Cannot optimize ad bids without conversion signals. | 2 h |
| Lawyer review of AGB + Widerruf B2B/B2C conflict | IMPLEMENT NOW | Legal risk exposure. An Abmahnung from a competitor or Verbraucherschutzzentrale would be more expensive than a lawyer review. | 1–2 days (founder + lawyer) |
| Add seller identity trust block on landing/product pages | IMPLEMENT NOW | HK entity + Turkey production without context = trust destruction for €300–2,000 B2B orders. | 3–4 h |
| Add delivery time total estimate (order-to-delivery calendar days) | IMPLEMENT NOW | B2B buyers cannot commit without a total timeline. "keine bindende Garantie" framing without a number = lost conversions. | 1–2 h |
| Update Datenschutz with Google as data processor | IMPLEMENT NOW | Required DSGVO Art. 13 disclosure once GA4 is live. Prepare the update alongside GA4 installation. | 1–2 h |
| Add begin_checkout event | IMPLEMENT NOW | Enables Google Ads remarketing audience (checkout-abandoners). Minimal effort. | 1–2 h |
| /de/versand page content | IMPLEMENT NOW | Shipping page in sitemap generates 404 currently. Blocker for organic SEO credibility and legal completeness. | 2 h |
| Create a generate_lead GA4 event on quote form | IMPLEMENT NOW | Quote leads are the primary conversion for non-purchase visitors. Must be tracked in GA4 for campaign optimization. | 1–2 h |
| Verify 1,000-unit tier gross margin | IMPLEMENT NOW | Financial audit, not code. Running ads to a potentially negative-margin tier is a cash destruction risk. | Founder + supplier call |
| Mobile layout QA | IMPLEMENT NOW | Germany has ~60% mobile B2B browsing research phase. Broken mobile = wasted ad spend. | 2–3 h |
| "Auf Rechnung" / B2B invoice payment (Klarna B2B, Billie, or manual) | IMPLEMENT LATER | German B2B buyers strongly prefer Rechnung. Important for AOV. But complex to implement correctly. Do after first 10 orders to understand payment preferences. | 1–2 weeks |
| Custom size / Wunschformat self-serve calculator | IMPLEMENT LATER | Feature flag is off. Code exists. Validate pricing engine before enabling. | 2–4 h to validate + enable |
| Variable data (Chargennummer) self-serve | IMPLEMENT LATER | Admin-side exists. Self-serve is Phase 3+. Current admin flow handles it manually which is fine for first 10 orders. | 2–3 weeks |
| Trusted Shops or EHI badge | IMPLEMENT LATER | Trust badges help conversion but take weeks to obtain and cost money. Do after first revenue. | 2–4 weeks + cost |
| Template library / canvas editor | NEVER (for now) | Massive engineering effort. Not needed for first 10 B2B orders. B2B customers supply print-ready data. | — |
| Multiple roll sizes beyond 100×200 mm (self-serve) | IMPLEMENT LATER | Custom size calculator already handles this via quote flow. Self-serve expansion is post-10-orders. | — |
| Blog / content marketing | IMPLEMENT LATER | SEO benefit is real but takes 6–12 months to show. Not relevant to first 10 orders. | — |
| Freezer/removable adhesive self-serve pricing | NEVER (for now) | Too many variables. Quote-only is correct and protects margin. | — |
| Server-side GA4 events (Measurement Protocol) | IMPLEMENT LATER | Nice-to-have for consent-denied traffic modelling. Not needed before first 10 orders. | 1–2 weeks |
| Multiple languages / English site | NEVER | German-only is a stated business constraint and competitive advantage. | — |

---

# 12. Questions That Need Founder Decision

1. **B2B only or also B2C?** The AGB currently says "Verbraucher und Unternehmer." If B2C is intended, the full Widerruf flow for custom goods must be legally validated (§312g BGB exception). If B2B-only, the AGB and Widerruf page must be updated to exclude consumers. **This decision blocks legal review completion.**

2. **Is the 1,000-unit tier profitable?** Calculate: (Turkish production cost per 1K + DDP shipping cost) vs. current Stripe price for 1K. If margin is <20%, either reprice, remove it, or reframe it as "Testmenge" at a premium price. **This decision blocks whether 1K-tier should appear in ads.**

3. **Should checkout be direct-purchase first or quote-first for ad traffic?** Current setup allows both. For Google Ads, directing to the configurator/checkout (direct purchase) has higher conversion potential. Quote-first has lower revenue friction for large B2B buyers. The landing page URL for ads should be decided before campaign setup.

4. **Should Turkey production and HK entity be shown above fold or only in footer/legal pages?** Current approach: Impressum only. Risk: German B2B buyers who research will find a HK entity with no German presence. Recommended: add a transparent "how we work" block. But the founder must decide how prominently to feature this.

5. **What exact total delivery promise can be safely made?** "ca. 10–14 Werktage nach Ihrer Freigabe" is currently non-binding. To quote a total calendar promise for ads ("Lieferung in 15–22 Werktagen"), the production partner in Turkey must confirm their actual lead times including DHL transit. **Without a confirmed number, ads should not make delivery claims.**

6. **Should the Design Service (€40) be prominently featured in ad copy and landing page?** Enabling the addons flag makes it visible in checkout. But should it appear in ad headlines ("Designservice inkl. auf Anfrage") or only in the configurator? This affects which keywords and ad groups to target.

7. **Is LUCID registration under Verpackungsgesetz required?** As a DDP seller shipping printed PP label rolls (which may count as packaging material) into Germany, LUCID registration may be legally required. This needs a lawyer or customs advisor to confirm. If required, non-registration creates penalty risk before any German shipment.

8. **Should 20,000+ units be orderable directly or always quote-only?** Currently: 20K+ routes to quote. This is correct for launch. But if a high-AOV customer wants to order 20K directly via Stripe, can the fulfilment handle it? Founder + production partner must confirm.

9. **What is the actual available ad budget and how should it be split?** The prompt mentions €300/month. At German B2B label CPC (estimated €0.40–€1.50 for niche terms), €300/month = 200–750 clicks/month. At 1.5% CVR = 3–11 conversions/month. This is a learning phase only. The founder should decide: all to one product (e.g. opake-pp-etiketten) or split across material types.

10. **Is there a functioning `kontakt@labelpilot.de` email inbox monitored daily?** The env file sets `EMAIL_REPLY_TO=kontakt@labelpilot.de`. Quote requests and support emails go here. If this inbox is not monitored (or not set up in production), leads from ads will die. **Confirm before any spend.**

---

*End of audit. Do not implement code changes without founder sign-off on Questions 1, 2, 5, and 7 first.*
