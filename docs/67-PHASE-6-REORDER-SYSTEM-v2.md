# 67-PHASE-6-REORDER-SYSTEM.md — v2

# Labelpilot.de — Phase 6 Reorder System v2

## 1. Purpose

This v2 document upgrades the reorder system.

The reorder system must now support:

```txt
stored design selection
artwork version selection
one-click reorder
stock duration question
refill prediction
30-day reminder emails
lot/SKT variable data
Excel batch upload path
Net 14 / company account order path
```

Reorder is not just “repeat previous order”.

Reorder is the core workflow that makes Labelpilot.de a B2B infrastructure platform.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

Implement reorder v2 as a core system.

## 2. Neden: Kısa ve matematiksel

Manual reorder cost:

```txt
15–30 minutes × every repeat order
```

Software reorder cost:

```txt
30 seconds customer action + automated admin queue
```

Higher reorder rate = higher LTV = path to €100k/month contribution.

---

## 3. Updated Reorder Objects

Reorder now references:

```txt
StoredDesign
ArtworkVersion
Order
OrderItem
RefillPrediction
ReorderReminder
VariableDataBatch optional
PaymentTermProfile optional
```

An order must not be the only memory object.

The customer should reorder from `StoredDesign`.

---

## 4. Reorder Entry Points

Customer can reorder from:

```txt
/konto/designs
/konto/designs/[designId]
/konto/bestellungen/[orderId]
reminder email CTA
admin-created reorder draft
```

Primary UX:

```txt
Saklanan Tasarımlar → choose design → Nachbestellen
```

---

## 5. Reorder Flow v2

```txt
Customer opens saved design
→ system shows current approved version
→ customer selects quantity
→ customer answers stock duration
→ customer selects same version / minor change / variable data update
→ customer enters Lot/SKT or uploads Excel if needed
→ system calculates price or quote threshold
→ payment / Net 14 / approval flow
→ order created
→ refill prediction updated
```

---

## 6. Stock Duration Question

Required for every reorder and first order if possible:

German:

```txt
Für wie viele Monate soll dieser Etikettenbestand reichen?
```

Options:

```txt
Einmalige Bestellung
1 Monat
3 Monate
5 Monate
6 Monate
Andere Dauer
```

Stored as:

```txt
stockDurationMonths
oneTimePurchase
```

Use it for refill prediction.

---

## 7. Refill Prediction Logic

MVP rule-based formula:

```txt
estimatedDepletionDate = orderDate + stockDurationMonths
reminderDate = estimatedDepletionDate - 30 days
```

If one-time purchase:

```txt
no automatic reminder by default
```

Later improve with historical consumption.

---

## 8. Reminder Automation

System sends:

```txt
30 days before estimated depletion
```

Email subject:

```txt
Etiketten bald nachbestellen?
```

Email CTA:

```txt
Gleiche Etiketten nachbestellen
```

Reminder click should open reorder draft.

Track:

```txt
sent
clicked
dismissed
order_created
```

---

## 9. Variable Data Reorder

If design has variable fields:

```txt
lot_number
expiry_date
barcode
sku
```

Customer must either:

```txt
enter values manually
upload Excel/CSV
reuse previous values only if allowed
```

Supplement labels should not reorder without new lot/SKT confirmation if those fields are enabled.

---

## 10. Excel Batch Reorder

For batch variable data:

```txt
customer uploads Excel
system validates rows
system shows preview
system generates print-ready batch output
admin approves
```

This supports:

```txt
50 lots
multiple SKUs
lot/SKT changes
batch print prep
```

---

## 11. Same Artwork Reorder

Allowed only if:

```txt
no required variable fields OR variables confirmed
current artwork version approved
customer owns design
design active
```

Same artwork does not mean no admin review.

Admin review may be faster but still exists.

---

## 12. Minor Change Reorder

Examples:

```txt
small text change
flavor change
barcode change
lot/SKT if not variable-enabled
```

Must create:

```txt
new ArtworkVersion draft or review item
```

Do not overwrite current approved version.

---

## 13. Net 14 Reorder Path

If company has approved Net 14:

```txt
customer submits reorder
system checks role/order limit/credit limit
if allowed: order created with paymentTerm NET_14
if over limit: approval required
```

Default is prepaid Stripe.

---

## 14. Admin Reorder Queue

Admin sees:

```txt
same-artwork reorder
variable-data reorder
minor-change reorder
Net 14 reorder
reminder-created reorder
```

Each has next action.

Admin must be able to open:

```txt
StoredDesign
ArtworkVersion
OriginalOrder
VariableDataBatch
RefillPrediction
```

---

## 15. Reorder KPIs

Track:

```txt
reorder_started
reorder_paid
reorder_net14_created
reorder_from_reminder
reorder_variable_data_used
reorder_excel_uploaded
reorder_minor_change_requested
time_to_reorder_completion
```

Business KPIs:

```txt
12-month reorder rate
repeat revenue share
reminder-to-order rate
same-artwork reorder share
variable-data reorder share
```

---

## 16. Acceptance Criteria

Reorder v2 accepted when:

| Check | Required |
|---|---|
| Reorder from StoredDesign | PASS |
| ArtworkVersion referenced | PASS |
| Original order unchanged | PASS |
| Stock duration question | PASS |
| Refill prediction created | PASS |
| Reminder scheduled | PASS |
| Variable fields supported | PASS |
| Excel batch path supported/documented | PASS |
| Net 14 path defined | PASS |
| Admin reorder queue defined | PASS |
| German UI | PASS |

---

## 17. Final Verdict

Reorder v2 is the economic engine.

If a repeat order takes more than 1 minute for the customer, the product is not strong enough.
> AUTHORITATIVE. Supersedes `67-PHASE-6-REORDER-SYSTEM.md`. See `/docs/00-SOURCE-OF-TRUTH.md`.
# Canonical phase = 7 (per doc 74).
