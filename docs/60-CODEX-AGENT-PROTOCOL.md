# 60-CODEX-AGENT-PROTOCOL.md

# Labelpilot.de — Codex Agent Protocol

## 1. Critical Update: Site Language

The Labelpilot.de MVP customer-facing site language is **German only**.

Codex must treat this as a hard rule.

Customer-facing German-only areas:

- public pages
- product pages
- landing pages
- checkout UI
- upload UI
- quote forms
- customer portal UI
- customer emails
- customer-facing error messages
- CTA buttons
- SEO metadata
- FAQ content
- legal pages

Allowed English:

- code identifiers
- technical enum names
- internal documentation
- admin-only technical labels where unavoidable
- developer comments if useful

Not allowed in MVP:

- English customer-facing pages
- English customer-facing CTAs
- mixed German/English customer UI
- English product descriptions on public pages

---

## 2. Required German CTA Vocabulary

Use:

```txt
Jetzt konfigurieren
Angebot anfordern
Musterbox anfordern
Etiketten nachbestellen
Druckdatei hochladen
Druckdatei später senden
Proof freigeben
Korrektur senden
Zur Kasse
```

Do not use:

```txt
Configure now
Request quote
Order sample
Reorder labels
Upload artwork
Send file later
Approve proof
Checkout
```

---

## 3. Project Identity

Final project name:

```txt
Labelpilot.de
```

Final domain:

```txt
labelpilot.de
```

Business type:

```txt
German-language Germany-focused B2B-first custom label ordering and reorder platform
```

Main product:

```txt
100×200 mm individuell bedruckte PP-Rollenetiketten
```

Cross-sell product:

```txt
100×100 mm und 100×150 mm Thermoetiketten
```

---

## 4. Non-Negotiable Rules

1. Customer-facing MVP language is German.
2. Labelpilot.de is not a generic print shop.
3. Main product is 100×200 mm PP roll labels.
4. Thermal labels are cross-sell.
5. Main customer is German B2B micro/small brands.
6. Reorder is core.
7. Saved artwork is core.
8. Stripe payment must be secure.
9. File upload must be private and secure.
10. Production must not start before payment/admin approval and file review.
11. SEO/GEO must be built from day one.
12. Do not add generic print categories.
13. Do not offer legal compliance responsibility.
14. Do not hardcode business logic in random UI components.

---

## 5. Codex Output Rule

When implementing any UI, Codex must check:

| Area | Language |
|---|---|
| Public page text | German |
| CTA | German |
| Form labels | German |
| Error messages | German |
| Email subject/body | German |
| SEO metadata | German |
| FAQ | German |

If any customer-facing English remains, the task is not complete.

---

## 6. Final Codex Operating Verdict

Codex’s job is to implement the documented Labelpilot.de system:

> German-language B2B PP label ordering, secure payment, private artwork upload, admin proofing, and repeat-order infrastructure.

If a task pushes the product toward a generic online print shop or mixed-language MVP, Codex must stop and flag it.
