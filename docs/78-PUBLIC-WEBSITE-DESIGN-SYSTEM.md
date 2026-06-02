# 78 — Public Website Design System (Premium German B2B Roll-Label)

Status: **ACTIVE / LOCKED.** This document is the canonical public-website design direction. It **supersedes** the navy/blue "German B2B SaaS" direction in `76-UI-DESIGN-SYSTEM-GERMAN-B2B.md` and any earlier palette. Precedence sits under `00-SOURCE-OF-TRUTH.md` (decision #14).

Scope: public marketing/SEO pages only (`/de` and children). Does not change routes, SEO metadata, Stripe, pricing engine, order/upload/quote flows, admin or account areas.

---

## 1. Final design direction

Labelpilot.de is a **premium, German-facing, B2B-first PP roll-label manufacturer and reorder platform**. The public site must read as a serious production company with SaaS-like ordering clarity — calm, visual-first, technical-but-human, quietly confident.

It must **not** read as: a generic SaaS landing page, a cheap online print shop, an AI icon-card-grid template, a playful sticker site, a Turkish-exporter page, or a fake-startup template.

Felt impression for a German buyer: *"Diese Firma kennt Etikettenproduktion. Das ist keine billige Matbaa. Die Bestellung ist klar. Es gibt einen echten Nachbestell-Vorteil. Das wirkt vertrauenswürdig."*

---

## 2. Anti-AI design rules (do NOT)

- No raw default-Tailwind feel (`bg-blue-600` / `text-gray-900` / stark white + bright blue).
- No Inter/Roboto-only standard SaaS typography.
- No grid of 3–4 identical icon cards with icon + title + blurb.
- No "gray rounded card prison" — not every block wrapped in a bordered box.
- No fake analytics/SaaS dashboard mockups, glassmorphism, or decorative gradient blobs.
- No excessive rounding (oversized radii) and no identical max-width/alignment/rhythm on every section.
- No page talking about itself ("Diese Seite …", "Die Seitenstruktur macht sichtbar …", "bleibt Teil des SEO-Graphen").
- No internal/project jargon in customer copy (MVP, kanonisch, Phase 2, Dokumentation, SEO).

---

## 3. Color tokens (central, in `app/globals.css :root`)

Warm ivory / charcoal / muted-industrial-blue / champagne. Defined once as CSS variables; never hardcode hex in components.

```
--bg:            #F7F3EA   /* warm ivory page */
--bg-soft:       #EFE7D8   /* sand */
--surface:       #FFFCF6   /* warm paper card */
--surface-alt:   #FBF7EE
--surface-strong:#EFE7D8
--line:          #D8CDBB   /* soft warm border */
--line-strong:   #B9A98F
--text:          #101418
--text-strong:   #0B1220   /* headings */
--text-soft:     #2A2F2A
--muted:         #5F665F   /* warm muted secondary */
--brand:         #1F4E79   /* muted trust blue (CTA) */
--brand-hover:   #173A5A
--accent:        #B8945E   /* champagne / sand highlight (eyebrows, marks) */
--accent-soft:   #E7D7BD
--success:       #2F6B4F
--warning:       #A66A2C
--danger:        #B3402F
--shadow-subtle: 0 12px 36px rgba(16,20,24,.06)
--shadow-soft:   0 24px 70px rgba(16,20,24,.08)
--shadow-float:  0 36px 90px rgba(16,20,24,.10)
--shadow-card:   0 1px 2px rgba(16,20,24,.04), 0 14px 38px rgba(16,20,24,.07)
--radius-xl: 24px  --radius-lg: 18px  --radius-md: 14px  --radius-sm: 10px
```

Implementation note: the existing semantic class system reuses the legacy token **names** (`--brand`, `--line`, `--bg` …) remapped to these warm values, so the whole site shifts from one place. The full hero remains a dark navy product image; warm ivory surrounds it.

---

## 4. Typography

- Headings: **Fraunces** (editorial serif) — breaks the Inter-SaaS look, signals human/premium.
- Body / UI: **IBM Plex Sans** — technical, professional, readable.
- Loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-heading` / `--font-body`; no committed font files.

Scale & rhythm:
- H1 (hero): `clamp(2.6rem, 5.2vw, 4.2rem)`, line-height ~1.02, letter-spacing -0.015em (serif-appropriate, not the tight -0.04em used for sans).
- H2: ~`clamp(1.9rem, 3vw, 2.6rem)`, line-height ~1.08.
- Body: 16–18px; body-large 18–21px; meta/eyebrow small uppercase, letter-spacing 0.18em.
- Prose max-width 58–68ch; hero copy 46–58ch; section intro 42–56ch.
- Eyebrows are **borderless** small-caps in `--accent` (champagne) — not pill chips.

---

## 5. Layout & whitespace

- Visual-first, asymmetric, calm. Not every section is the same symmetric grid.
- Use 2-column (text + product/material visual) bands; vary column ratios; let one card/visual differ in scale.
- Section vertical rhythm: desktop `py-24/28/32`, hero wider, mobile `py-16/20`. (Current section spacing uses a 48px stack gap + transparent section wrappers.)
- Hierarchy from whitespace + typography + **soft shadow**, not from wrapping everything in borders.

---

## 6. Component rules

- Central tokens + reusable components; no per-section bespoke styles; no component sprawl.
- Section wrappers are transparent (no gray box). Cards sit on the warm page with `--shadow-card`, no border.
- Borders only where structure needs them: spec/comparison tables, forms, pricing separation, technical specs.
- Recommended/featured pricing card uses a subtle trust-blue ring (box-shadow), not a heavy border.
- Hover: `duration-500 ease-out`, tiny `translate-y`, minimal shadow lift. No heavy animation library (no framer-motion); CSS transitions only; respect `prefers-reduced-motion`.

---

## 7. Copywriting rules (public, German only)

Short, concrete, B2B-buying language. Eyebrow 2–5 words, headline 5–10 words, ≤2 short supporting sentences, 3–5 concrete bullets, tables over paragraphs.

Banned phrases: "Innovative Lösungen", "Zukunft gestalten", "Alles aus einer Hand", "Maßgeschneiderte Lösungen", "Premium Qualität für jeden Bedarf", "Modernste Technologie", "Wir revolutionieren …", "Effizient, skalierbar und innovativ".

Good lines:
- "PP-Rollenetiketten für Produktmarken, die regelmäßig nachbestellen."
- "Druckdaten einmal freigeben. Danach schneller nachbestellen."
- "Opak oder transparent. Auf Rolle. Für Gläser, Dosen, Beutel und Flaschen."
- "Technische Druckdatenprüfung vor Produktion."

No English/Turkish public copy; no competitor names; no "Made in Germany" claim (production is in Turkey, positioning is German-facing).

---

## 8. CTA language (German only)

Primary: **Jetzt konfigurieren** · **PP-Etiketten konfigurieren** · **Paket wählen**
Secondary: **Musterbox anfordern** · **Angebot anfordern** · **Etiketten nachbestellen** · **Druckdaten hochladen**
Legal order button (B2C, §312j BGB): **Zahlungspflichtig bestellen**.
Never use English CTAs (Configure now, Request quote, Get started, Learn more …).

---

## 9. Reorder moat presentation

Show the saved-artwork / repeat-order advantage concretely, tied to production — not as a SaaS dashboard:

1. Druckdaten hochladen → 2. Proof prüfen → 3. Produktion freigeben → 4. Design speichern → 5. Beim nächsten Bedarf schneller nachbestellen.

Headline pattern: "Einmal freigeben. Später schneller nachbestellen." Supporting: stored Druckdaten, Material, Maß, Versionen; later Lot/SKT updates.

---

## 10. Pricing / package UI

This is a **product price**, not a SaaS subscription. Cards: Starter 1.000 / Reorder Ready 2.000 / Growth 5.000 (recommended) / Pro 10.000 / Business 20.000+ (Angebot). Opaque vs transparent clearly separated. Net + gross (19% MwSt) shown. Recommended badge in German B2B language ("Empfohlen für wiederkehrende Produktmarken" / "Beste Balance"). Mandatory note: *"Alle Pakete enthalten technische Druckdatenprüfung, Versand nach Deutschland und die Speicherung freigegebener Druckdaten für spätere Nachbestellungen."*

---

## 11. Do / Don't

| Do | Don't |
|---|---|
| Warm ivory page, charcoal text, trust-blue CTA, champagne eyebrow | Stark white + bright `#2563EB` SaaS blue |
| Fraunces serif headings + IBM Plex Sans body | Inter/Roboto-only |
| Borderless cards on soft shadow | Gray bordered card prison |
| Asymmetric text + product/material visual bands | 3 identical icon cards repeated |
| Short, concrete German buying copy | AI marketing clichés / page talking about itself |
| Product/roll/material/packaging imagery | Fake SaaS dashboards, gradient blobs |

---

## 12. Implementation checklist

- [x] Central warm tokens in `globals.css :root` (legacy names remapped).
- [x] Fraunces + IBM Plex Sans via `next/font/google` in `app/layout.tsx`.
- [x] Headings → serif; eyebrows → borderless champagne; CTA → solid trust-blue; soft shadows.
- [x] Hero copy + CTAs updated to the new direction.
- [ ] Per-section asymmetric layout pass (offset bands, varied column ratios) — follow-up.
- [ ] Material/sample/reorder/quote sections given dedicated premium visuals — follow-up.
- [x] `npm run build`, `check:lang` pass; routes/SEO/Stripe untouched.
