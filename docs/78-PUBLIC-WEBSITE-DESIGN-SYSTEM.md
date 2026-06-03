# 78 — Public Website Design System (Premium German B2B Roll-Label)

Status: **ACTIVE / LOCKED.** Canonical public-website design direction. **Reconciled with `rakip_analizi_ve_stil_rehberi.md`** (the authoritative style guide) — where the earlier draft differed (blue CTA, Fraunces serif everywhere), this doc and the code now follow the style guide. **Supersedes** the navy/blue "German B2B SaaS" direction in `76-UI-DESIGN-SYSTEM-GERMAN-B2B.md`. Precedence sits under `00-SOURCE-OF-TRUTH.md` (decision #14).

Scope: public marketing/SEO pages only (`/de` and children). Does not change routes, SEO metadata, Stripe, pricing engine, order/upload/quote flows, admin or account areas.

---

## 1. Final design direction

Labelpilot.de is a **premium, German-facing, B2B-first PP roll-label manufacturer and reorder platform**. The public site reads as a serious production company with SaaS-like ordering clarity — calm, visual-first, technical-but-human, quietly confident.

**Not**: generic SaaS landing page, cheap online print shop, AI icon-card-grid template, playful sticker site, Turkish-exporter page, fake-startup template.

Felt impression: *"Diese Firma kennt Etikettenproduktion. Das ist keine billige Matbaa. Die Bestellung ist klar. Es gibt einen echten Nachbestell-Vorteil."*

Core rule from the style guide: **Blue is not the brand colour.** The primary action colour is **deep ink (near-black)**; the warm **brass** is the premium accent; **proof-blue is used only for technical/proof signals**, never as the main CTA.

---

## 2. Anti-AI design rules (do NOT)

- No raw default-Tailwind feel (`bg-blue-600` / `text-gray-900`), no blue-SaaS CTA.
- No Inter/Roboto-only standard SaaS typography.
- No grid of 3–4 identical icon cards (icon + title + blurb), no "gray rounded card prison".
- No fake dashboards, glassmorphism, gradient blobs, AI factory images, stock laptop people, icon-illustration grids.
- No identical max-width/alignment/rhythm on every section; vary density.
- No page talking about itself; no internal jargon (MVP, kanonisch, Phase 2, Dokumentation, SEO) in customer copy.

---

## 3. Color tokens — "Ivory Industrial Premium" (central in `app/globals.css :root`)

Defined once as CSS variables; never hardcode hex in components. Usage ratio ≈ 60% ivory/warm-white · 25% ink/graphite type · 10% product imagery · 4% brass · 1% proof-blue.

```
--bg:           #F7F2E8   /* warm ivory page */
--surface:      #FFFDF8   /* warm white card */
--bg-soft / --surface-strong: #EFE6D6   /* sand */
--surface-alt:  #FBF6EC
--line:         #E5DED2   /* soft warm line */
--line-strong:  #D6CBB6
--text:         #2A2926   /* graphite body (never weak grey) */
--text-strong:  #11100E   /* deep ink — headings */
--muted:        #6F675D   /* secondary */
--brand:        #11100E   /* PRIMARY action = deep ink (NOT blue) */
--brand-hover:  #2A2926
--accent:       #B08A45   /* brass — eyebrows, premium accent, recommended ring */
--accent-hover: #9A7638
--accent-soft:  #E7D7BD
--proof:        #2D5BFF   /* proof-blue — technical/proof accent ONLY */
--success:      #2F6B4F   --warning: #A66A2C   --danger: #B44336
--shadow-subtle/-card: 0 1px 2px rgba(17,16,14,.04), 0 8px 24px rgba(17,16,14,.06)
--shadow-soft/-md:     0 18px 55px rgba(17,16,14,.10)   /* product */
--shadow-float:        0 24px 80px rgba(17,16,14,.14)
--shadow-brass:        0 18px 45px rgba(176,138,69,.18)
--shadow-cta:          0 10px 28px rgba(17,16,14,.18)
--radius-sm/md/lg/xl/product: 10 / 14 / 20 / 28 / 36 px
```

The existing semantic class system reuses the legacy token **names** remapped to these values, so the whole site shifts from one place. The full hero remains a dark navy product image; on the dark hero the primary CTA inverts to ivory for contrast.

---

## 4. Typography

Aligned to the style guide's final system (sans, technical — not serif-everywhere):

- Headings: **Instrument Sans** — modern, characterful, "not raw SaaS"; not a serif (serif risks a matbaa/cosmetics-blog look).
- Body / UI: **IBM Plex Sans** — technical, professional, readable.
- Technical labels (eyebrows, prices, spec values, badges): **IBM Plex Mono** — measure/price/production-parameter clarity.
- Loaded via `next/font/google` in `app/layout.tsx` as `--font-heading` / `--font-body` / `--font-mono`; no committed font files.

Scale: H1 hero `clamp(2.6rem,5.2vw,4.2rem)` lh~1.02 tracking -0.02em; H2 `clamp(1.9rem,3vw,2.6rem)`; body 16–18px; prose ≤58–68ch; hero copy ≤46–58ch. Eyebrows: borderless **brass mono** uppercase, letter-spacing 0.16em. Weights restrained (headings 500–600, body 400, price 600); no everything-bold, no everything-uppercase, no weak-grey body.

---

## 5. Layout & whitespace

Visual-first, asymmetric, calm — not the same symmetric grid every section. 2-column text+visual bands, varied column ratios (e.g. hero 7/5, material 60/40), let one card/visual differ in scale. Section rhythm should breathe (large quiet area → dense spec table → visual breath → price decision). Spacing desktop `py-24/28/32` (hero/final wider), mobile `py-16/20`. Hierarchy from whitespace + type + **soft shadow**, not borders.

---

## 6. Component rules

- Central tokens + reusable components; no per-section bespoke styles; no sprawl.
- Section wrappers transparent; cards sit on warm page with `--shadow-card`, no border.
- Borders only for structure: spec/comparison tables (horizontal rules, `--line`), forms, technical specs.
- Recommended pricing card (Growth): warm tint + **brass ring** (`0 0 0 1px rgba(176,138,69,.38)`) + `--shadow-float` + `scale(1.03)` on desktop; others calmer with secondary CTA.
- Hover: `duration-500 ease-out`, ≤ `-translate-y-0.5`, image scale ≤1.025, minimal shadow lift. No animation library (no framer-motion); CSS only; respect `prefers-reduced-motion`. Premium underline-grow link micro-interaction allowed.
- **Single approved exception:** exactly one scroll-driven signature section sitewide — the homepage **"Label Journey"** (SoT #17, spec `79-AWARD-WINNING-LABEL-JOURNEY-SCROLL.md`) — may exceed this ceiling, under its mandatory guardrails (CSS/native only, reduced-motion + no-JS static fallback, `transform`/`opacity` only, LCP-safe, on-brand, one section). Everywhere else this micro-interaction ceiling is binding; a second motion feature needs a new founder decision.

---

## 7. Copywriting rules (public, German, "Sie")

Short, concrete, B2B buying language. Eyebrow 2–5 words, headline 5–10 words, ≤2 supporting sentences, 3–5 bullets, tables over paragraphs. Each heading should help a buying decision.

Banned: "Innovative Lösungen", "Zukunft gestalten", "Alles aus einer Hand", "Maßgeschneiderte Lösungen", "Premium Qualität für jeden Bedarf", "Wir revolutionieren …", "Effizient, skalierbar und innovativ".

Good: "PP-Rollenetiketten für Marken, die nachbestellen." · "Einmal freigeben. Später schneller nachbestellen." · "Opak oder transparent. Auf Rolle. Für Gläser, Dosen, Beutel und Flaschen." · "Technische Druckdatenprüfung vor Produktion."

Production honesty: "Für Deutschland geplant, kosteneffizient in der Türkei produziert, mit klarer Druckdatenprüfung und Versand nach Deutschland." No "Made in Germany". No legal-compliance promise (Pflichtangaben bleiben Verantwortung des Kunden). No English/Turkish public copy; no competitor names.

---

## 8. CTA system (German only)

- **Primary** = deep ink (`--brand` #11100E), text ivory; on the dark hero it inverts to ivory bg + ink text.
- **Secondary** = transparent + ink border, hover fills ink.
- **Premium accent** = brass (#B08A45) where a warm highlight is wanted.
- **Proof / technical** = proof-blue (#2D5BFF) only, never the main CTA.

Labels: **Jetzt konfigurieren** · **Musterbox anfordern** · **Angebot anfordern** · **Etiketten nachbestellen** · **Druckdaten später senden** · legal order button **Zahlungspflichtig bestellen**. Never: Loslegen, Mehr erfahren, Get started, Explore, Jetzt entdecken, any English CTA.

---

## 9. Reorder moat presentation

The moat area — production memory, not a SaaS dashboard. Headline: "Einmal freigeben. Später schneller nachbestellen." A saved-design card (Produkt, Material, Format 100×200 mm, Version v3 freigegeben, letzte Bestellung 5.000 Stück, CTA Nachbestellen) + a thin timeline (Druckdaten gespeichert → Version freigegeben → Menge wählen und nachbestellen) — **not** an icon-card grid.

---

## 10. Pricing / package UI

Product price, not a SaaS subscription. Starter 1.000 / Reorder Ready 2.000 / **Growth 5.000 (recommended, emphasised)** / Pro 10.000 / Business 20.000+ (Angebot). Opaque vs transparent separated. Net + gross (19% MwSt), prices in mono. Growth badge "Empfohlen für Wiederbestellungen", scaled + brass ring + primary CTA; others calmer. Mandatory note: *"Alle Pakete enthalten technische Druckdatenprüfung, Versand nach Deutschland und die Speicherung freigegebener Druckdaten für spätere Nachbestellungen."* No discount/casino badges.

---

## 11. Do / Don't

| Do | Don't |
|---|---|
| Warm ivory page, **deep-ink CTA**, brass accent, proof-blue only for proof | Bright `#2563EB` SaaS-blue CTA / blue as brand |
| Instrument Sans headings + IBM Plex Sans body + mono prices/labels | Inter/Roboto-only; serif everywhere |
| Borderless cards on soft shadow; varied radii | Gray bordered card prison; everything `rounded-2xl` |
| Asymmetric text + product/material bands; Growth emphasised | 3 identical icon cards; equal pricing cards |
| Short concrete German "Sie" copy | AI clichés; page talking about itself |
| Real product/roll/material/packaging imagery | Fake dashboards, gradient blobs, AI factory |

---

## 12. Implementation checklist

- [x] "Ivory Industrial Premium" tokens (deep-ink action, brass accent, proof-blue accent) in `globals.css :root`.
- [x] Instrument Sans + IBM Plex Sans + IBM Plex Mono via `next/font/google`.
- [x] Headings → Instrument Sans; eyebrows/prices → brass mono; CTA → deep ink; warm soft shadows.
- [x] Pricing: Growth emphasised (brass ring, scale, "Empfohlen für Wiederbestellungen"); checkout preserved.
- [x] Hero copy + CTAs aligned.
- [x] **Implemented layout pass (asymmetric):** Hero rebuilt to a 7/5 split on ivory with a CSS `LabelRollVisual` (label roll + material swatches + saved-design card + "Freigegeben"/"Nachbestellbar"/"100×200 mm" labels) replacing the full-bleed photo hero — no dashboard. Material section is a 60/40 editorial split (`MaterialComparisonShowcase` overlapping opaque/transparent panels + heading-in-side-column + spec table). Reorder section is `SavedDesignReorderVisual` (saved-design card + 5-step vertical timeline, last node brass) — no icon-card grid. Sample/Musterbox is a material-first block (copy + Musterbox/Angebot CTAs + `SampleBoxVisual` envelope/strips). New isolated components under `components/marketing/*`; scoped CSS in `globals.css` (`lpv-roll/-mat/-reorder/-sample`, `.hero-split`, `.split-6040`). No token/font/CTA/pricing/checkout changes.
- [x] **Real editorial product photography** integrated for hero roll labels, opaque/transparent PP material comparison, sample-box proof kit and micro-brand product lineup (`/public/images/editorial/*.webp`, `next/image`, German alt). CSS/SVG visuals (`LabelRollVisual`, `MaterialComparisonShowcase`, `SampleBoxVisual`) remain in the repo as unused fallback/support only; `SavedDesignReorderVisual` still active (no reorder photo yet).
- [x] `npm run build`, `check:lang` pass; routes/SEO/Stripe/checkout untouched.
