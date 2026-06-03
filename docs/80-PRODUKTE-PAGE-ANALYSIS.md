# 80 — Produkte-Page Analysis (How the product pages should be)

**Status:** ANALYSIS / ADVISORY (2026-06-04). Not a locked spec. Governed by and reconciled with the source docs it cites (`30-PRODUCT-CATALOG`, `04-PRICING-AND-MARGIN-MODEL`, `23-KEYWORD-MAP`, `24-METADATA-MAP`, `26-SITEMAP-ROBOTS-CANONICAL`, `27-INTERNAL-LINKING`, `28-CONTENT-TEMPLATES`, `78-PUBLIC-WEBSITE-DESIGN-SYSTEM`, `rakip_analizi_ve_stil_rehberi`, `58`/`59` competitor research). It does **not** override those docs; it proposes how the existing product surface should evolve **within** them. Any pricing/scope change still needs founder approval (SoT #15/#16).

Scope of "Produkte page": the nav item **Produkte → `/de/pp-rollenetiketten`** (a `collection` hub) plus the two `product` pages **`/de/opake-pp-etiketten`** and **`/de/transparente-pp-etiketten`**.

---

## 1. Current state (as-built)

**`/de/pp-rollenetiketten`** (collection hub): Breadcrumbs → Hero (eyebrow "Produktübersicht", CTAs to opak/transparent) → Spezifikation (SpecTable + 3-row Materialvergleich opak/transparent/Thermo) → Produktansicht image → Material & Einsatz FeatureGrid → ReorderWorkflowBlock → Rollenqualität image → **1 FAQ** → Related links → Final CTA. **No price ladder, no Leistungsumfang** (it's a hub).

**`/de/opake-pp-etiketten`** & **`/de/transparente-pp-etiketten`** (`product`): same skeleton **plus** Pakete & Preise (5-tier `PricingCard` ladder, net+gross) and Leistungsumfang ("Im Preis enthalten" / "Nicht enthalten"). Transparent adds a white-underprint (Weißdruck) quote callout. Opaque has 3 FAQs, transparent 2.

**Already present:** package ladder net+gross, included/excluded tables, material comparison, reorder block, FAQ accordion, real editorial photography, breadcrumbs, related links, German "Sie", deep-ink CTA.

**Already built but flag-gated OFF (not yet surfaced on these pages):** self-serve add-ons (`CheckoutButton`, `NEXT_PUBLIC_FEATURE_ADDONS`) and the Wunschformat custom-size calculator (`/de/wunschformat`, `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE`).

---

## 2. What the docs require (must-haves)

From `30 §18`, the canonical product-page order is: **H1 → Kurzantwort → spec table → quantity/package → material → upload notice → reorder benefit → production/shipping notice → quote CTA → sample CTA → FAQ → related products → schema → regulatory disclaimer.** Plus:

- **Included / Not-Included block** visible on every fixed 100×200 page (`30 §18.1`). ✅ present on product pages.
- **Mandatory regulatory disclaimer** (`30 §25`) on food/beverage/supplement contexts — exact German text, must not be softened. ⚠️ **verify it appears where these products are sold.**
- **Mandatory FAQs** (`30 §13`): reorder, accepted print files, legal-responsibility. ⚠️ flagship hub has only 1 FAQ; product pages 2–3 → **thin vs requirement.**
- **CTAs** (`30 §19`): primary `Jetzt konfigurieren`, secondary `Angebot anfordern`, tertiary `Musterbox anfordern`, plus `Etiketten nachbestellen`. German only.
- **Pricing** (`30 §17`, `04 §14`): centralized (no hardcoded prices in components), net+gross, full ladder, `20.000+` → quote.
- **Metadata/canonical** (`24`, `26`): each slug self-canonical, `index,follow`, sitemap priority 0.9, German title `… | Labelpilot.de`, 140–160-char description.
- **Keyword ownership** (`23 §7`): `pp-rollenetiketten` owns produktetiketten/rollenetiketten-drucken; `opake-…` owns opake/blickdichte; `transparente-…` owns transparente/no-label-look intents. Each page must satisfy its own commercial intent (don't dilute / duplicate).
- **Internal links** (`27 §11`): every product page → quote, musterbox, nachbestellen, druckdaten, the sibling material page, `etiketten-100x200`, and relevant Branchen pages, with descriptive German anchors (not "hier klicken").
- **Visual-first delivery** (`23 §2a`, `28`): answer block + spec table + comparison + FAQ accordion + real mockups + clear CTA; **no text walls / keyword stuffing / thin near-duplicate variant pages.**

---

## 3. Competitor findings & our gaps (from `58`/`59`/`rakip`)

**What competitors (Labelprint24, WIRmachenDRUCK, etiketten-drucken, Flyeralarm) do on product/configurator pages:**
- Persistent **live cost-summary rail**: net → MwSt → incl. → **"Versand inklusive"** (Labelprint24, `59 §27.5.3`).
- **Two data paths**: "eigene Druckdaten" vs "Online-Designer".
- Low-friction ladder beside cart: **"Angebot per E-Mail senden"**, "Druckdaten-Anforderungen", live chat/support.
- **Material-suitability metadata** per variant (Anwendung / Temperaturbereich / Geeignet für / Hinweis).
- **Finish/adhesive exposure** with price delta (matt ≈ +65% over gloss at 100×200/1.000), removable/freezer/wash-off adhesives, **white underprint** for transparent, **roll config** (core 40/76 mm, winding direction, machine vs hand dispenser).
- Trust framing (since-year, direct-from-manufacturer, payment methods), free DE shipping + free data check shown as table-stakes.

**Our product-depth gaps (`59 §28.1`) — the "which product?" problem:** a knowledgeable B2B buyer currently can't tell **gloss or matt? permanent or removable? which core/winding for my applicator? white underprint? how many designs?** → hesitation / leakage to a competitor's configurator.

| Dimension | Competitors expose | Our pages today | Action |
|---|---|---|---|
| Finish (gloss/matt) | selectable, priced | "one finish" — not stated which | **make visible** (matte = surcharge per `04 §28`) |
| Adhesive | permanent/removable/freezer/wash-off | permanent implied | **state explicitly** (others → quote) |
| White underprint (transparent) | selectable | quote callout (transparent page ✅) | keep; make equally explicit |
| Roll config (core/winding/dispenser) | fully selectable | not exposed | **add "Für Spender/Maschine" note** (76 mm core, winding) → quote if non-standard |
| Designs per roll | per-version priced | 1 only, extra unpriced | **+€19/extra design** (add-on, built) |
| Designservice / Express / physical proof | offered/priced | not on page | **add-ons (built, flag-gated)** |
| Live cost summary | net→VAT→gross→Versand | net+gross ladder only | **add explicit "inkl. 19% MwSt" + "Versand inklusive" line** |
| Send-quote-by-email | yes | quote form only | **add "Angebot per E-Mail senden"** |
| Material suitability | per-variant metadata | brief 3-row table | **add Anwendung/Temperatur/Geeignet-für rows** |

**Our defensible wedge to keep loud (`59 §27.5`):** we are the only one showing an **indicative 100×200 net+gross price + exact inclusion scope** without forcing a configurator; **free data check + free digital proof + €0 reorder re-setup + saved artwork** is the moat. Hold deliberate narrowness — route everything beyond the supported set to **Individuelles B2B-Angebot**.

---

## 4. Recommended target anatomy (within locked scope)

Locked: **no full configurator, no online-designer, no big cart** (docs 62/72). The recommendation is a **same-page "Spezifikation" panel** with smart defaults (`59 §28.3`) — simple buyers ignore it, pro buyers adjust.

Proposed section order for the two **product** pages:

1. **Hero** (asymmetric 7/5) — H1 owning the slug's commercial keyword, Kurzantwort, 3 bullets, primary `Jetzt konfigurieren`, real roll-label photo. QuickAnswerCard aside.
2. **Spezifikation auf einen Blick** — fixed spec always shown (Material · Finish *Glanz/Standard* · Klebstoff *permanent* · 100×200 mm · Kern 76 mm · Wickelrichtung Standard · Datencheck inkl. · 1 digitaler Proof inkl. · **Versand inkl.**) + **material-suitability rows** (Anwendung / Temperaturbereich / Geeignet für / Hinweis).
3. **Material** — opak vs transparent comparison (60/40 photo + mono table), suitability-driven, not equal cards. Transparent keeps the **Weißdruck** explicit note.
4. **Pakete & Preise** — 5-tier ladder, **Growth (5.000) emphasised** (brass ring + scale 1.03 + "Empfohlen"), each card net+gross, plus a **live total line: "… € netto · … € inkl. 19% MwSt · Versand inklusive."** `20.000+` → Angebot.
5. **Spezifikation/Optionen panel (when flags on)** — inline, defaults pre-selected: Menge tier · "Für Spender/Maschine" (Kern/Wickelrichtung) · **Designservice** · **physischer Andruck** · **Express** · **Zusatzdesigns** (the already-built add-ons), with live cost summary; anything beyond → one-click **Individuelles Angebot**. Custom size → link the **Wunschformat** calculator.
6. **Leistungsumfang** — Im Preis enthalten / Nicht enthalten (keep), reconciled with `04 §14.4` (add-ons now self-serve when enabled).
7. **Reorder moat** — "Einmal freigeben. Später schneller nachbestellen." + saved-design card + thin vertical timeline (no dashboard).
8. **Musterbox** trust block → "Musterbox anfordern".
9. **FAQ** — expand to the mandatory set (reorder, accepted files, legal-responsibility) + buyer objections (gloss/matt, adhesive, white-underprint, lead time, machine dispenser). Clean accordion, not icon-cards.
10. **Regulatory disclaimer** (`30 §25`) where food/beverage/supplement applies.
11. **Related links** (quote, musterbox, nachbestellen, druckdaten, sibling material, Branchen, 100×200) + **Final CTA** (`Angebot anfordern` / `Etiketten nachbestellen`).

The **collection hub** (`/de/pp-rollenetiketten`) should stay a routing/overview page but: own its keyword cluster more strongly, expand FAQ beyond 1, and clearly funnel to the two material pages + Musterbox + quote.

---

## 5. Prioritized recommendations

**P0 — close compliance/thinness gaps (cheap, doc-mandated, no founder decision):**
- Verify/add the **`30 §25` regulatory disclaimer** on the relevant product/industry contexts.
- Expand **FAQs** to the mandatory reorder/file/legal set + 3–5 buyer objections per product page; add ≥3 to the hub.
- Add the **"inkl. 19% MwSt" + "Versand inklusive"** explicit line to the price ladder (we already show net+gross).
- State the **finish (Glanz/Standard)** and **adhesive (permanent)** explicitly in the spec table; make white-underprint equally explicit on transparent.
- Verify internal-link obligations (`27 §11`) and descriptive anchors on each page.

**P1 — buyer-confidence (small, mostly copy/UI):**
- **Material-suitability metadata** rows (Anwendung/Temperaturbereich/Geeignet für/Hinweis).
- **"Für Spender/Maschine"** note (76 mm core, winding) → quote if non-standard — recovers machine-dispenser B2B buyers.
- **"Angebot per E-Mail senden"** low-friction path + reassurance microcopy near forms.

**P2 — surface the already-built revenue features (needs the flags + Stripe TEST first):**
- Wire the **add-on Spezifikation panel** (Designservice/Express/physischer Andruck/Zusatzdesign) onto the product page when `NEXT_PUBLIC_FEATURE_ADDONS` is on.
- Link/embed the **Wunschformat** calculator when `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE` is on.
- Live cost summary that includes selected add-ons.

**Explicitly OUT (locked):** full parameterized configurator, online designer, self-serve hot-foil/laminate/contour/broad-material catalog, multi-design without approval, free variable-data automation (that's the premium wedge).

---

## 6. Guardrails / DON'Ts (binding)

- German-only "Sie"; no English copy/CTAs; no Turkish chars (umlauts ok). German labels per `78 §8` / `30 §19`.
- No generic print categories/products; no "cheapest"; no "Made in Germany"; **no legal-compliance promise** (Pflichtangaben = customer's responsibility).
- No competitor names; no fake reviews/guarantees; no keyword-stuffed text walls or thin near-duplicate variant pages.
- Ivory Industrial Premium palette, deep-ink CTA (blue is proof-accent only), Instrument Sans/IBM Plex, asymmetric visual-first layout, borderless soft-shadow cards, Growth card brass-ring emphasis. Motion ≤ `78 §6` ceiling (the only scroll-animation exception is the homepage Label Journey, SoT #17).
- No price/scope change without founder approval; fixed-package base spec/prices (SoT #15) unchanged; add-ons/Wunschformat stay flag-gated until the operator enables them.

---

## 7. Open questions for the founder

1. Surface order: should the inline add-on/Spezifikation panel sit **inside** Pakete & Preise or as its own section below it?
2. Expose **adhesive/finish** as *informational* (stated) only, or as *selectable* (matte surcharge per `04 §28`) in MVP?
3. Add a **"Für Spender/Maschine"** quote path now, or keep all roll-config to the generic quote?
4. Is the collection hub (`/de/pp-rollenetiketten`) worth keeping distinct from the two product pages, or fold into a stronger opaque-led page? (SEO: it owns the `pp-rollenetiketten` cluster, so likely keep.)

---

## 8. Changelog
- v1 (2026-06-04): initial analysis — current state, doc requirements, competitor gaps, target anatomy, prioritized roadmap. Sources: 30/04/23/24/26/27/28/78/rakip/58/59 + current `lib/site-content.ts` + `components/page-renderers.tsx`.
