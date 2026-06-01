# 03-PRODUCT-STRATEGY.md — v2

# Labelpilot.de — Product Strategy v2

## 1. Purpose

This v2 document updates the product strategy for **Labelpilot.de**.

Labelpilot.de must not be positioned as a simple online print shop.

The correct product strategy is:

> A German B2B label infrastructure platform for micro and small packaged-product brands, combining custom PP labels, saved artwork, one-click reorder, variable data automation, refill prediction, B2B account controls and template-based design creation.

The target is not only to sell labels.

The target is to become the repeat-order infrastructure for German food, beverage, supplement and micro-brand packaging labels.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

This v2 direction should be adopted.

## 2. Neden: Kısa ve matematiksel

A simple label print order has limited moat.

A saved-design + reorder + variable-data system creates:

```txt
lower repeat order friction
higher repeat rate
higher LTV
lower manual support
better B2B lock-in
stronger SEO/GEO moat
```

Manual print workflow:

```txt
15–30 minutes per reorder
phone/email/file confirmation
manual price approval
manual file search
```

Labelpilot target workflow:

```txt
30 seconds
saved design selected
quantity selected
lot/SKT fields updated if needed
payment/Net 14 triggered
order created
```

The profit is in repeat order speed.

---

## 3. Core Product Pillars

Labelpilot.de v2 has 7 product pillars:

```txt
1. PP Roll Label Ordering
2. Artwork Management System
3. Reorder Engine
4. Variable Data Automation
5. Refill Prediction and Reminder Automation
6. B2B Account Management Portal
7. Template Library and Locked Canvas Editor
```

These pillars turn Labelpilot.de into software-backed label infrastructure.

---

## 4. Pillar 1 — PP Roll Label Ordering

Base product remains:

```txt
100×200 mm opaque PP labels
100×200 mm transparent PP labels
thermal shipping labels as cross-sell
```

Target segments:

```txt
food micro brands
beverage brands
supplement brands
coffee brands
spice brands
soap/cosmetic micro brands later
```

Approved focus:

```txt
labels for recurring packaged products
not one-time stickers
not generic print products
```

---

## 5. Pillar 2 — Artwork Management System

Every customer artwork file must be versioned and searchable.

The system stores:

```txt
PDF
AI
EPS
SVG
PNG/JPG previews
print-ready PDF outputs
template-generated designs
proof versions
admin production notes
customer notes
```

Version examples:

```txt
Lara Protein Vanilla Label v1
Lara Protein Vanilla Label v2
Lara Protein Vanilla Label v3
```

Customer use case:

```txt
“Geçen yılki etiket nerede?”
```

Target answer:

```txt
5 seconds: open customer profile → saved designs → select label → reorder
```

This is a strategic moat.

---

## 6. Pillar 3 — Reorder Engine

Customer profile must include:

```txt
Saklanan Tasarımlar
Geçmiş Siparişler
Yeniden Sipariş Ver
Aynısından 2.000 adet
Küçük değişiklik iste
Lot/SKT bilgisi gir
Excel yükle
```

Reorder should create a new order, not mutate old orders.

Reorder options:

```txt
same artwork
minor change
variable data change
quantity change
quote threshold
Net 14 account order
```

Customer should be able to reorder in 30 seconds.

---

## 7. Pillar 4 — Variable Data Automation

This is mandatory for supplement customers.

Supplement label reality:

```txt
same design
new lot number
new expiration date / SKT
sometimes new batch table
sometimes 50+ lots
```

Without variable data automation, every lot becomes manual artwork work.

Required module:

```txt
customer enters Lot + SKT fields
customer uploads Excel
system generates batch-ready print files
admin reviews output
production receives batch PDF
```

This is not a nice-to-have for supplements.

It is a segment-entry requirement.

---

## 8. Pillar 5 — Refill Prediction and Reminder Automation

Customer first order asks:

```txt
Bu sipariş kaç aylık stok için gerekli?
```

Options:

```txt
Tek seferlik alım
1 ay
3 ay
5 ay
6 ay
Özel süre
```

System uses:

```txt
order date
quantity
stock duration answer
historical reorder timing
customer segment
```

Prediction:

```txt
“Lara’nın etiket stoğu 25 gün sonra bitiyor.”
```

Automation:

```txt
30 days before predicted depletion → reminder email
14 days before → second reminder if no action
customer clicks yes → reorder draft created
```

Goal:

```txt
reduce forgotten reorders
increase repeat rate
reduce manual sales follow-up
```

---

## 9. Pillar 6 — B2B Account Management Portal

B2B customers may have multiple users:

```txt
Founder
Operations manager
Designer
Finance/accounting
Procurement
```

Required account features:

```txt
company account
multiple users
role permissions
order approval limits
invoice billing address
saved designs shared by company
Net 14 payment tier
order history
stored artwork library
```

Payment options:

```txt
Stripe immediate payment
Stripe invoice / payment link
Net 14 for approved tier customers
manual bank transfer later
```

Net 14 must be tier-controlled per customer.

---

## 10. Pillar 7 — Template Library and Locked Canvas Editor

This expands acquisition and conversion.

Template library:

```txt
30–50 public templates
category-based
SEO-indexable
downloadable/previewable
editable in simple editor
```

Example templates:

```txt
Kahve poşeti etiketi minimal
Supplement kapsül şişe modern
Sabun premium classic
Honigglas natural
Gewürzglas clean label
```

Customer can edit:

```txt
brand name
logo
product name
ingredients
lot field
SKT field
barcode
colors within allowed palette
```

Customer cannot freely destroy layout:

```txt
font/size/layout zones locked
bleed locked
safe area locked
print specs locked
```

Backend generates print-ready PDF.

---

## 11. Template Engine Architecture

Three modules:

### 11.1 JSON Template Engine

Each template is JSON:

```txt
dimensions
bleed
layout zones
editable fields
locked fields
default colors
default fonts
barcode zone
lot/SKT zone
export rules
```

### 11.2 Canvas Editor

Recommended:

```txt
Fabric.js or Konva.js
React component
locked layout
limited edits
preview rendering
```

### 11.3 PDF Generator

Backend service:

```txt
merge user edits with print template
generate print-ready PDF
3mm bleed
crop marks
high-resolution output
CMYK strategy documented
```

Possible libraries:

```txt
pdf-lib
PDFKit
server-side rendering pipeline
```

Important:

True CMYK/print fidelity may require professional print pipeline later. MVP must be honest and test outputs with production partner.

---

## 12. Product Roadmap Impact

The previous roadmap must be updated.

New recommended phase order:

```txt
Phase 1: German SEO lead-capture MVP
Phase 2: SEO/GEO foundation
Phase 3: Stripe fixed-package checkout
Phase 4: Artwork upload + versioning foundation
Phase 5: Admin operations
Phase 6: Reorder engine
Phase 7: Refill prediction + reminder automation
Phase 8: Variable data automation
Phase 9: B2B account management
Phase 10: Template library
Phase 11: Locked canvas editor + PDF generator
Phase 12: Germany hub scaling
```

Variable data should be earlier if supplement segment is main wedge.

---

## 13. Risks + Solutions

### Risk 1 — Too complex too early

Solution:

```txt
Do not build full Canva clone.
Build locked editor only.
```

### Risk 2 — Print-ready PDF quality

Solution:

```txt
Start with controlled templates.
Test with Boyut Promosyon / production partner.
Require admin approval before production.
```

### Risk 3 — Variable data errors

Solution:

```txt
CSV/Excel validation
preview table
admin batch proof
sample output PDF before production
```

### Risk 4 — Net 14 payment risk

Solution:

```txt
only approved tier customers
credit limit
order limit
manual admin approval
payment history gate
```

---

## 14. Better Alternative

Do not try to beat Vistaprint on generic printing.

Better alternative:

```txt
Own the German micro-brand label lifecycle:
template → first order → stored design → variable data → predicted reorder → B2B account → repeat supply
```

This is a software moat.

---

## 15. Action Plan

1. Update database schema v2.
2. Update customer portal v2.
3. Update reorder system v2.
4. Add artwork management system doc.
5. Add variable data automation doc.
6. Add template library/editor doc.
7. Add B2B account management doc.
8. Add refill prediction doc.
9. Create Codex execution prompts for each module.

---

## 16. Expected Output

If implemented correctly:

```txt
higher repeat rate
lower support per reorder
faster order cycle
stronger supplement fit
higher customer lock-in
better SEO via template pages
higher LTV
```

Target workflow:

```txt
First order: several minutes
Repeat order: 30 seconds
Variable lot order: under 2 minutes
Manual admin time: reduced sharply
```

---

## 17. Opportunity Cost

Not building these modules means:

```txt
you remain a matbaa website
manual support grows with order volume
reorder rate depends on memory
supplement customers create file chaos
Vistaprint-like generic competition traps you
```

The opportunity cost is high.

The v2 direction is the correct path if the 10-year target is €100,000/month net profit.
> AUTHORITATIVE. Supersedes `03-PRODUCT-STRATEGY.md`. See `/docs/00-SOURCE-OF-TRUTH.md`.
