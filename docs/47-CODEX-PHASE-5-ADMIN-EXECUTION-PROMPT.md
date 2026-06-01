# Canonical phase = 6 (per doc 74).

# 47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 5 Admin Execution Prompt

## 1. Mission

Implement the admin panel for **Labelpilot.de**.

Goal:

```txt
protected admin routes
order list/detail
payment visibility
file review actions
proof actions
quote management
lead management
customer overview
shipment tracking
admin notes
status history
valid status transitions
```

The admin panel must be operational, not decorative.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/12-DATABASE-SCHEMA.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/18-ADMIN-PANEL.md
/docs/66-PHASE-5-ADMIN-PANEL.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
/docs/47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. `/admin` requires ADMIN role.
2. Server-side role checks required.
3. CUSTOMER cannot access admin.
4. Unauthenticated cannot access admin.
5. Admin status transitions validated server-side.
6. File downloads use signed URLs.
7. Internal notes hidden from customer.
8. No arbitrary status editing.
9. No secrets exposed.
10. Admin routes noindex.

---

## 4. Required Routes

Create:

```txt
/admin
/admin/orders
/admin/orders/[orderId]
/admin/quotes
/admin/quotes/[quoteId]
/admin/leads
/admin/leads/[leadId]
/admin/customers
/admin/customers/[customerId]
/admin/uploads
/admin/settings
```

---

## 5. Admin Dashboard

Show operational counts:

```txt
Neue Bestellungen
Zahlung offen
Bezahlt
Dateiprüfung
Korrektur erforderlich
Proof wartet auf Freigabe
Freigegeben für Produktion
In Produktion
Versandbereit
Offene Angebotsanfragen
Neue Leads
Follow-ups heute
```

Counts link to filtered lists.

---

## 6. Order List

Columns:

```txt
Bestellnummer
Datum
Firma
E-Mail
Produkt
Menge
Betrag
Zahlung
Status
Nächste Aktion
```

Filters:

```txt
Zahlung offen
Bezahlt
Dateiprüfung
Proof erforderlich
Wartet auf Freigabe
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Abgeschlossen
```

---

## 7. Order Detail

Sections:

```txt
Order summary
Customer
Products
Payment
Artwork files
File review
Proof files
Status management
Shipment
Reorder
Admin notes
Status history
```

---

## 8. Quote Management

Implement:

```txt
/admin/quotes
/admin/quotes/[quoteId]
```

Actions:

```txt
Als in Prüfung markieren
Weitere Informationen anfordern
Angebot gesendet markieren
Als akzeptiert markieren
In Bestellung umwandeln
Als abgelehnt markieren
Notiz hinzufügen
```

---

## 9. Lead Management

Implement:

```txt
/admin/leads
/admin/leads/[leadId]
```

Actions:

```txt
Als qualifiziert markieren
Musterbox geplant
Angebot benötigt
Angebot gesendet
Follow-up setzen
In Kunde umwandeln
Als verloren markieren
Disqualifizieren
Notiz hinzufügen
```

---

## 10. File and Proof Actions

Admin actions:

```txt
Datei herunterladen
Datei freigeben
Korrektur anfordern
Proof erforderlich
Proof hochladen
Proof zur Freigabe senden
```

Correction customer message required.

---

## 11. Shipment Tracking

Manual fields:

```txt
carrier
trackingNumber
trackingUrl
packageCount
weightKg
shippedAt
estimatedDeliveryDate
shippingMode
```

German admin labels.

---

## 12. Status Transition Safety

Allowed production path:

```txt
PAID → FILE_REVIEW
FILE_REVIEW → PROOF_REQUIRED
FILE_REVIEW → APPROVED_FOR_PRODUCTION
PROOF_REQUIRED → WAITING_CUSTOMER_APPROVAL
WAITING_CUSTOMER_APPROVAL → APPROVED_FOR_PRODUCTION
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
IN_PRODUCTION → READY_TO_SHIP
READY_TO_SHIP → SHIPPED
SHIPPED → DELIVERED
DELIVERED → COMPLETED
```

Block unsafe transitions server-side.

---

## 13. Required Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual:

```txt
/admin logged out blocked
customer blocked
admin allowed
order list works
order detail works
file download secure
correction request works
proof upload works
invalid transition blocked
quote status update works
lead status update works
internal notes hidden from customer
```

---

## 14. Required Report

Return:

```txt
## Summary
## Files Changed
## Admin Routes
## Security
## Checks Run
## Manual Tests
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 15. Acceptance Criteria

| Check | Required |
|---|---|
| Admin protected | PASS |
| Customer blocked | PASS |
| Order list/detail | PASS |
| Payment visible | PASS |
| File actions | PASS |
| Proof actions | PASS |
| Quote management | PASS |
| Lead management | PASS |
| Shipment tracking | PASS |
| Admin notes | PASS |
| Status history | PASS |
| Invalid transitions blocked | PASS |

---

## 16. Final Instruction

Build the admin panel as the operational control center.

Do not waste time on charts before order/file/proof/lead operations work.
