# Canonical phase = 7 (per doc 74).

# 48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 6 Reorder Execution Prompt

## 1. Mission

Implement the reorder system for **Labelpilot.de**.

Goal:

```txt
completed approved order
→ saved artwork/specs
→ customer reorder
→ quantity change or minor change
→ new order
→ Stripe/quote flow
→ admin review
→ production gate
```

Reorder is the profit engine. Do not treat it as a small optional feature.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/12-DATABASE-SCHEMA.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/19-CUSTOMER-PORTAL.md
/docs/33-REORDER-ECONOMICS.md
/docs/67-PHASE-6-REORDER-SYSTEM.md
/docs/48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md
```

If there is conflict, stop and report.

---

## 3. Non-Negotiable Rules

1. Reorder creates a new order.
2. Original order must never be mutated.
3. Customer can reorder only own eligible orders.
4. Reorder must reference previous approved artwork.
5. Same-artwork reorder must not require re-upload.
6. Server calculates price.
7. 20,000+ quantity goes to quote.
8. Minor change requires note.
9. Reorder cannot bypass payment.
10. Reorder cannot bypass production gate.
11. Customer UI must be German.

---

## 4. Reorder Eligibility

An order is eligible if:

```txt
status is COMPLETED or DELIVERED
ArtworkFile is APPROVED
product.reorderEligible = true
customer owns order
order not cancelled/refunded/disputed
```

Approved products:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
```

---

## 5. Required Routes

Customer routes:

```txt
/konto/bestellungen
/konto/bestellungen/[orderId]
/konto/nachbestellen
/konto/nachbestellen/[orderId]
```

Optional API/routes:

```txt
/api/reorder/create
/api/reorder/quote
```

Routes must be protected by customer ownership.

---

## 6. German UI Labels

Use:

```txt
Etiketten nachbestellen
Gleiche Druckdatei erneut bestellen
Menge ändern
Kleine Änderung anfragen
Nachbestellung starten
Nachbestellung bezahlen
Für diese Menge erstellen wir ein individuelles B2B-Angebot.
```

Do not use English customer labels.

---

## 7. Reorder Flow

Implement:

```txt
customer opens eligible order
clicks Etiketten nachbestellen
system loads previous specs
customer selects quantity
customer chooses same artwork or minor change
server validates ownership and eligibility
server creates new order with originalOrderId
server references prior artwork/proof
server calculates price or redirects to quote
customer pays or quote request created
admin sees reorder indicator
```

---

## 8. Data Requirements

Use/add fields:

```txt
Order.originalOrderId
Order.isReorder
Order.reorderType
Order.minorChangeRequested
Order.minorChangeNote
```

Reorder types:

```txt
SAME_ARTWORK
MINOR_CHANGE
QUOTE_REQUIRED
ADMIN_CREATED
```

---

## 9. Quote Threshold

If selected quantity is:

```txt
20,000+
```

Do not direct checkout.

Create quote request with original order reference.

---

## 10. Admin Visibility

Admin order detail must show:

```txt
Nachbestellung
Originalbestellung
Nachbestelltyp
Verwendete Druckdatei
Mengenänderung
Kleine Änderung
```

Admin list badge:

```txt
Nachbestellung
Nachbestellung mit Änderung
```

---

## 11. Stripe Metadata

For paid reorder checkout include:

```txt
orderId
originalOrderId
customerId
productId
quantity
material
source: reorder_checkout
```

---

## 12. Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual:

```txt
completed order shows reorder
non-eligible order blocked
same-artwork reorder creates new order
original order unchanged
previous artwork referenced
quantity change works
minor change note stored
20,000+ creates quote flow
customer cannot reorder another customer order
admin sees reorder badge
production gate not bypassed
```

---

## 13. Required Report

Return:

```txt
## Summary
## Files Changed
## Reorder Flow
## Security / Ownership
## Stripe / Quote Behavior
## Checks Run
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 14. Acceptance Criteria

| Check | Required |
|---|---|
| Eligible reorder works | PASS |
| Non-eligible blocked | PASS |
| New order created | PASS |
| Original unchanged | PASS |
| Artwork referenced | PASS |
| Quantity change works | PASS |
| Minor change works | PASS |
| 20,000+ quote flow | PASS |
| Ownership enforced | PASS |
| Admin visibility | PASS |
| German UI | PASS |

---

## 15. Final Instruction

Build reorder as the LTV system.

If every repeat customer must start from zero, the implementation failed.
