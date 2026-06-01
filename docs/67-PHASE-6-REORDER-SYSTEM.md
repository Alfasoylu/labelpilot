# 67-PHASE-6-REORDER-SYSTEM.md

# Labelpilot.de — Phase 6 Reorder System

## 1. Purpose

This document defines **Phase 6 Reorder System** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Phase 6 exists to build the core profit engine of the business:

> Saved artwork + saved specifications + faster repeat orders.

This phase turns Labelpilot.de from a one-time label ordering website into a repeat-order B2B label supply system.

---

## 2. Phase 6 Verdict

The correct Phase 6 is:

> Completed approved order → saved artwork/specs → customer reorder → quantity adjustment/minor change → new order → payment/quote → file review shortcut if safe.

The wrong Phase 6 is:

> Customer must upload everything again and restart from zero every time.

Reorder is not a bonus feature.

Reorder is the business moat.

---

## 3. Required Source Documents

Before implementing Phase 6, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/01-BUSINESS-MODEL.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/11-ARCHITECTURE.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
/docs/65-PHASE-4-FILE-UPLOAD-PROOFING.md
/docs/66-PHASE-5-ADMIN-PANEL.md
/docs/67-PHASE-6-REORDER-SYSTEM.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Phase 6 Language Rule

Customer-facing reorder UI must be German.

German customer-facing labels:

```txt
Etiketten nachbestellen
Gleiche Druckdatei erneut bestellen
Menge ändern
Kleine Änderung anfragen
Nachbestellung starten
Druckdaten wiederverwenden
```

Not allowed:

```txt
Reorder labels
Use same artwork
Start reorder
Request minor change
```

Allowed internal English:

- code identifiers
- enum names
- database field names
- internal logs

---

## 5. Phase 6 Scope

Phase 6 must implement:

1. Saved label specifications.
2. Saved approved artwork reference.
3. Saved approved proof reference if available.
4. Customer previous orders page.
5. Reorder button on completed/approved orders.
6. New order creation from previous order.
7. Quantity change during reorder.
8. Minor change request during reorder.
9. Reorder payment through Stripe or quote threshold.
10. Reorder status tracking.
11. Admin reorder visibility.
12. Reorder event history.
13. Reorder-related German UI.
14. Reorder-safe file reuse rules.

---

## 6. Phase 6 Non-Scope

Do not implement in Phase 6 unless explicitly requested:

```txt
full subscription billing
automatic monthly charging
Stripe Billing plans
complex inventory prediction
AI reorder forecasting
automatic production without admin check
public reorder token without security review
multi-user company approval workflow
ERP integration
Germany hub stock planning
```

Phase 6 is reorder infrastructure, not subscription billing.

---

## 7. Reorder Business Logic

Reorder means:

> A customer creates a new order based on a previous approved order.

A reorder is always a **new order**.

It must not modify the original order.

Original order remains historical record.

New reorder references the original order.

---

## 8. Reorder Eligibility

An order is reorder eligible if:

1. Order status is `COMPLETED`, `DELIVERED`, or at least `APPROVED_FOR_PRODUCTION` depending on policy.
2. Product is reorder eligible.
3. Artwork file is approved.
4. Material and size are known.
5. Customer owns the order.
6. Order is not cancelled or refunded.
7. Order has no unresolved reprint/dispute.

Recommended MVP eligibility:

```txt
Order status must be COMPLETED or DELIVERED.
ArtworkFile must be APPROVED.
Product must have reorderEligible = true.
```

---

## 9. Reorder-Eligible Products

Approved reorder products:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
```

Sales support products are not normal reorder products:

```txt
sample-box
custom-quote
```

Quote-based previous orders may be reorderable, but should trigger quote flow again if quantity/material/custom specs are outside fixed packages.

---

## 10. Data to Copy From Original Order

When creating reorder, copy:

```txt
originalOrderId
customerId
productId
productSlug
productName
material
size
previousQuantity
artworkFileId
proofFileId
shippingCountry
customer company data
production notes if safe
customer notes if relevant
```

Do not copy:

```txt
payment status
shipment status
tracking number
old order status
old status events
old payment record
old invoice ID
refund status
reprint status
```

The new reorder starts fresh.

---

## 11. Reorder Data Model

Suggested model:

```txt
ReorderLink
- id
- originalOrderId
- customerId
- token
- status
- expiresAt
- createdAt
- usedAt
```

Suggested order fields:

```txt
Order
- id
- originalOrderId
- isReorder
- reorderType
- minorChangeRequested
- minorChangeNote
```

Reorder types:

```txt
SAME_ARTWORK
MINOR_CHANGE
QUOTE_REQUIRED
ADMIN_CREATED
```

MVP may implement reorder without public token.

Account-based reorder is safer first.

---

## 12. Customer Reorder Flow

Account-based reorder flow:

```txt
Customer logs in
→ Goes to previous orders
→ Opens completed order
→ Clicks “Etiketten nachbestellen”
→ System loads previous specs
→ Customer selects quantity
→ Customer confirms same artwork or requests minor change
→ System creates new order
→ Customer pays via Stripe or requests quote
```

German button:

```txt
Etiketten nachbestellen
```

---

## 13. Reorder Quantity Rules

For PP labels:

```txt
1.000
5.000
10.000
```

Quote threshold:

```txt
20.000+
```

If customer selects 20,000+:

```txt
Reorder becomes quote request or quote-based order.
```

German message:

```txt
Für diese Menge erstellen wir ein individuelles B2B-Angebot.
```

---

## 14. Same Artwork Reorder

If customer chooses same artwork:

```txt
minorChangeRequested = false
reorderType = SAME_ARTWORK
```

Expected behavior:

1. New order references previous approved artwork.
2. Customer does not need to upload new file.
3. Admin can see it is a reorder.
4. Admin may skip heavy file review if safe.
5. Proof may be optional if same artwork/specs.
6. Production gate still requires admin approval.

Do not automatically start production.

---

## 15. Minor Change Reorder

Minor changes may include:

```txt
MHD ändern
Chargennummer ändern
Barcode ändern
Geschmacksrichtung ändern
kleinen Text ändern
kleine Layoutanpassung
```

German UI:

```txt
Kleine Änderung anfragen
```

Customer must enter note:

```txt
Welche Änderung sollen wir prüfen?
```

If minor change requested:

```txt
minorChangeRequested = true
reorderType = MINOR_CHANGE
Order should enter FILE_REVIEW after payment/admin approval.
Proof may be required.
```

Admin decides if change is minor or requires new quote/design work.

---

## 16. New Artwork Reorder

If customer wants completely new artwork, it is not a simple reorder.

German message:

```txt
Wenn Sie eine neue Druckdatei verwenden möchten, starten Sie bitte eine neue Bestellung oder fordern Sie ein Angebot an.
```

Optional path:

```txt
Start new order
```

Do not mix full new artwork with same-artwork reorder.

---

## 17. Reorder Payment Flow

Direct reorder payment:

```txt
Reorder draft
→ Quantity selected
→ Server calculates price
→ Pending payment order
→ Stripe Checkout
→ Webhook confirms payment
→ Order status PAID
→ Admin review / production approval
```

Rules:

1. Server calculates price.
2. Do not trust client price.
3. New order gets new payment record.
4. Original order remains unchanged.
5. Stripe metadata includes `originalOrderId`.

Stripe metadata:

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

## 18. Reorder Quote Flow

If reorder needs quote:

```txt
Customer selects 20,000+
→ System creates quote request with original order reference
→ Admin reviews
→ Admin sends offer
→ Converted to order if accepted
```

Quote request should include:

```txt
originalOrderId
previous product specs
requested quantity
minor change note if any
```

---

## 19. Admin Reorder Visibility

Admin order list should show reorder indicator.

German labels:

```txt
Nachbestellung
Erstbestellung
Nachbestellung mit Änderung
```

Admin order detail should show:

```txt
Originalbestellung
Nachbestelltyp
Verwendete Druckdatei
Verwendeter Proof
Mengenänderung
Kleine Änderung
```

Admin should be able to open original order.

---

## 20. Reorder Status Flow

New reorder follows normal order statuses.

Same-artwork reorder:

```txt
DRAFT
→ PENDING_PAYMENT
→ PAID
→ APPROVED_FOR_PRODUCTION or FILE_REVIEW
→ IN_PRODUCTION
→ READY_TO_SHIP
→ SHIPPED
→ DELIVERED
→ COMPLETED
```

Recommended safe MVP:

```txt
PAID → FILE_REVIEW
```

Even same-artwork reorders should appear in admin review first.

Admin can approve faster.

---

## 21. Reorder File Safety

Rules:

1. Never duplicate actual file unless needed.
2. Reference previous approved file.
3. Do not overwrite original file.
4. If minor change is requested, create new file/proof if changed.
5. Keep old file history.
6. Customer can only reorder own files.
7. Signed URL rules still apply.

---

## 22. Customer Previous Orders Page

Customer account must include:

```txt
Meine Bestellungen
```

For each order, show:

```txt
Bestellnummer
Datum
Produkt
Material
Größe
Menge
Status
Nachbestellen button if eligible
```

German button:

```txt
Nachbestellen
```

If not eligible, show reason optionally:

```txt
Diese Bestellung kann noch nicht nachbestellt werden.
```

---

## 23. Customer Reorder Confirmation Page

Before checkout, show:

```txt
Produkt
Material
Größe
bisherige Menge
neue Menge
Druckdatei
Änderungswunsch
Preis
```

German confirmation text:

```txt
Wir verwenden die freigegebenen Druckdaten Ihrer vorherigen Bestellung. Vor der Produktion prüfen wir die Nachbestellung technisch.
```

CTA:

```txt
Nachbestellung bezahlen
```

or:

```txt
Angebot anfordern
```

---

## 24. Reorder Reminders

Phase 6 may prepare reminder logic, but full automation can be later.

Suggested fields:

```txt
lastOrderDate
estimatedReorderDate
reminderSentAt
reorderReminderEnabled
```

Suggested reminder intervals:

```txt
45 Tage
60 Tage
90 Tage
```

MVP can add manual/admin-triggered reminders later.

Do not implement automatic spammy emails without opt-in/logic.

---

## 25. German Reorder Email Templates

If email exists, prepare these templates.

### 25.1 Reorder Reminder

Subject:

```txt
Etiketten bald nachbestellen?
```

Body idea:

```txt
Ihre letzte Bestellung bei Labelpilot.de kann mit gespeicherten Druckdaten einfacher nachbestellt werden. Sie können die gleiche Menge erneut bestellen oder eine neue Menge auswählen.
```

CTA:

```txt
Etiketten nachbestellen
```

### 25.2 Reorder Confirmation

Subject:

```txt
Nachbestellung erhalten – Labelpilot.de
```

Body should include:

```txt
Bestellnummer
Originalbestellung
Produkt
Menge
Nächster Schritt
```

---

## 26. Reorder Analytics

Track:

```txt
reorder_button_click
reorder_started
reorder_quantity_changed
reorder_minor_change_requested
reorder_checkout_started
reorder_paid
reorder_quote_requested
```

Business KPIs:

```txt
Reorder rate
Time between orders
Average reorder quantity
Reorder AOV
Same-artwork reorder share
Minor-change reorder share
Reorder gross margin
```

---

## 27. Security Rules

Non-negotiable:

1. Customer can only reorder own orders.
2. Reorder must create new order.
3. Original order must not be modified.
4. Server calculates reorder price.
5. Private file access remains private.
6. Public token reorder must not expose customer data.
7. Admin must see reorder source.
8. Production still requires valid status transition.
9. Reorder cannot bypass payment.
10. Reorder cannot bypass admin production approval.

---

## 28. Phase 6 Acceptance Criteria

Phase 6 is accepted when:

| Check | Required Result |
|---|---|
| Completed order can show reorder button | PASS |
| Non-eligible order cannot be reordered | PASS |
| Reorder creates new order | PASS |
| Original order remains unchanged | PASS |
| Previous specs are copied | PASS |
| Previous approved artwork is referenced | PASS |
| Customer can change quantity | PASS |
| 20,000+ goes to quote flow | PASS |
| Customer can request minor change | PASS |
| Server calculates reorder price | PASS |
| Stripe metadata includes originalOrderId | PASS |
| Admin can identify reorder | PASS |
| Reorder does not bypass production gate | PASS |
| Customer cannot reorder another customer’s order | PASS |
| Customer-facing UI is German | PASS |

---

## 29. Phase 6 Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Create completed test order.
2. See reorder button.
3. Start same-artwork reorder.
4. Change quantity to 5,000.
5. Pay reorder with Stripe test mode.
6. Confirm new order created.
7. Confirm original order unchanged.
8. Confirm original artwork referenced.
9. Start minor-change reorder.
10. Enter change note.
11. Select 20,000+ and confirm quote flow.
12. Try accessing another customer’s reorder.
13. Check admin reorder indicator.
14. Try production transition before approval.
15. Check German UI text.

---

## 30. Phase 6 PASS/FAIL Report Format

Codex must report:

```txt
## Summary
- What changed

## Files Changed
- path

## Reorder Flow
- how same-artwork reorder works
- how minor-change reorder works
- how quote threshold works

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended Phase 7 task
```

---

## 31. Common Phase 6 Mistakes to Avoid

Do not:

1. Modify original order.
2. Duplicate payment records.
3. Reuse old payment status.
4. Let reorder bypass payment.
5. Let reorder bypass admin review.
6. Let customers access other customers’ files.
7. Force customers to upload same file again.
8. Treat reorder as subscription billing.
9. Add automatic monthly charging.
10. Use English customer UI.
11. Lose original artwork history.
12. Hide minor change request from admin.

---

## 32. Phase 6 Final Verdict

Phase 6 must create the economic moat of Labelpilot.de.

The correct implementation:

> Customer’s approved label data is saved, reusable and reorderable with less friction.

The wrong implementation:

> Every repeat order starts from zero.

If Labelpilot.de cannot make repeat orders easier than the first order, the business loses its long-term profit engine.
