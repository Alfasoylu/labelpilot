# Canonical phase = 6 (per doc 74).

> **LEGACY numbering — canonical phases live in `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.**
> This document keeps its historical filename/label. When build-phase naming conflicts, `74` wins.

# 66-PHASE-5-ADMIN-PANEL.md

# Labelpilot.de — Phase 5 Admin Panel

## 1. Purpose

This document defines **Phase 5 Admin Panel** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Phase 5 exists to build the internal control center for managing:

- orders
- payments
- uploaded artwork
- proofing
- quote requests
- customer data
- order statuses
- shipment tracking
- reprints
- admin notes
- production readiness

The admin panel must be functional, safe and simple.

It does not need to be beautiful in Phase 5.

---

## 2. Phase 5 Verdict

The correct Phase 5 is:

> A protected operational admin panel that lets the team safely move paid custom label orders through file review, proofing, production and shipping.

The wrong Phase 5 is:

> A decorative dashboard with charts but no useful order control.

Phase 5 must protect cash, quality and delivery.

---

## 3. Required Source Documents

Before implementing Phase 5, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
/docs/65-PHASE-4-FILE-UPLOAD-PROOFING.md
/docs/66-PHASE-5-ADMIN-PANEL.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Admin Language Rule

Customer-facing site language is German.

Admin panel language decision for Phase 5:

```txt
Admin UI may be German-first, but internal technical labels may remain English if needed.
```

Recommended admin UI language:

```txt
German
```

Why:

- avoids mixed operational language
- keeps status labels consistent
- helps future German staff/hub operations

Admin technical enum names may remain English in code.

---

## 5. Phase 5 Scope

Phase 5 must implement:

1. Protected admin area.
2. Admin authentication/authorization.
3. Admin dashboard overview.
4. Order list.
5. Order detail.
6. Order status management.
7. Payment visibility.
8. Uploaded artwork visibility.
9. Secure file download.
10. File review actions.
11. Proof upload/actions.
12. Quote request list.
13. Quote request detail.
14. Customer list/basic view.
15. Shipment/tracking entry.
16. Admin notes.
17. Status event history.
18. Basic filters and search.

---

## 6. Phase 5 Non-Scope

Do not build in Phase 5 unless explicitly requested:

```txt
full CRM
advanced analytics dashboard
warehouse management system
supplier/fason partner portal
Germany hub dashboard
automated production planning
carrier API integration
accounting system
invoice generation
refund automation
role-permission matrix beyond admin/customer
staff performance dashboard
```

Phase 5 is operations control, not ERP.

---

## 7. Admin Routes

Required admin routes:

```txt
/admin
/admin/orders
/admin/orders/[orderId]
/admin/quotes
/admin/quotes/[quoteId]
/admin/customers
/admin/customers/[customerId]
/admin/uploads
/admin/settings
```

Optional if needed:

```txt
/admin/payments
/admin/shipments
/admin/reprints
```

All `/admin/*` routes must be protected.

Unauthenticated users must not access admin data.

---

## 8. Admin Authorization

Minimum roles:

```txt
CUSTOMER
ADMIN
```

Optional future roles:

```txt
SALES
PRODUCTION
SUPPORT
```

Phase 5 minimum:

- only ADMIN can access `/admin`
- CUSTOMER cannot access admin routes
- unauthenticated visitors cannot access admin routes

Codex must enforce this server-side.

Do not rely only on hidden navigation.

---

## 9. Admin Dashboard Overview

Route:

```txt
/admin
```

Dashboard must show operational counts:

```txt
Neue Bestellungen
Zahlung offen
Bezahlt
Dateiprüfung
Proof wartet auf Freigabe
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Offene Angebotsanfragen
Korrektur erforderlich
Nachdruck erforderlich
```

Each count should link to filtered list.

Do not overbuild charts in Phase 5.

---

## 10. Order List

Route:

```txt
/admin/orders
```

Order list columns:

```txt
Bestellnummer
Datum
Kunde / Firma
E-Mail
Produkt
Menge
Gesamtbetrag
Zahlungsstatus
Bestellstatus
Nächste Aktion
```

Required filters:

```txt
Alle
Zahlung offen
Bezahlt
Dateiprüfung
Proof erforderlich
Wartet auf Kundenfreigabe
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Abgeschlossen
Korrektur erforderlich
Nachdruck erforderlich
```

Optional filters:

```txt
Produkt
Menge
Zeitraum
Kunde
Land
```

Search:

```txt
Bestellnummer
Firma
E-Mail
```

---

## 11. Order Detail

Route:

```txt
/admin/orders/[orderId]
```

Order detail must show:

### 11.1 Customer Section

```txt
Firma
Ansprechpartner
E-Mail
Telefon
Lieferadresse
Rechnungsdaten if available
```

### 11.2 Product Section

```txt
Produkt
Material
Größe
Menge
Paket
Kundennotizen
```

### 11.3 Payment Section

```txt
Zahlungsstatus
Betrag
Währung
Stripe Checkout Session ID
Stripe Payment Intent ID
Zahlungsdatum
```

### 11.4 File Section

```txt
Hochgeladene Druckdateien
Dateistatus
Download
Datei freigeben
Korrektur anfordern
Proof erforderlich
```

### 11.5 Proof Section

```txt
Proof-Dateien
Proof-Status
Proof hochladen
Proof zur Freigabe senden
Kundenfreigabe-Zeitpunkt
Änderungswunsch
```

### 11.6 Status Section

```txt
Aktueller Status
Status ändern
Statushistorie
```

### 11.7 Shipment Section

```txt
Versandart
Paketanzahl
Gewicht
Versanddienstleister
Trackingnummer
Tracking-URL
Versanddatum
```

### 11.8 Notes Section

```txt
Interne Notizen
Kundennachricht
Produktionsnotizen
```

---

## 12. Order Status Actions

Admin may perform only valid status transitions.

Allowed admin actions depend on current status.

### 12.1 From PAID

Allowed:

```txt
Zur Dateiprüfung
Stornierung prüfen
```

### 12.2 From FILE_REVIEW

Allowed:

```txt
Datei freigeben
Korrektur anfordern
Proof erforderlich
```

### 12.3 From PROOF_REQUIRED

Allowed:

```txt
Proof hochladen
Zur Kundenfreigabe senden
```

### 12.4 From WAITING_CUSTOMER_APPROVAL

Allowed:

```txt
Freigabe abwarten
Änderungswunsch bearbeiten
```

Admin should not manually bypass customer approval unless explicitly confirmed.

### 12.5 From APPROVED_FOR_PRODUCTION

Allowed:

```txt
Produktion starten
```

### 12.6 From IN_PRODUCTION

Allowed:

```txt
Als versandbereit markieren
Nachdruck erforderlich
```

### 12.7 From READY_TO_SHIP

Allowed:

```txt
Tracking hinzufügen
Als versendet markieren
```

### 12.8 From SHIPPED

Allowed:

```txt
Als zugestellt markieren
Nachdruck erforderlich
```

### 12.9 From DELIVERED

Allowed:

```txt
Als abgeschlossen markieren
Nachdruck erforderlich
```

---

## 13. Forbidden Admin Actions

Admin panel must block:

```txt
PENDING_PAYMENT → IN_PRODUCTION
PENDING_PAYMENT → SHIPPED
PAID → IN_PRODUCTION without file approval
FILE_REVIEW → IN_PRODUCTION
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION without proof approval
CANCELLED → IN_PRODUCTION
COMPLETED → status change without explicit reprint/admin flow
```

Admin interface must not expose unsafe status buttons.

Server-side logic must enforce this even if UI is bypassed.

---

## 14. File Review Admin Actions

Admin file review actions:

```txt
Datei herunterladen
Datei prüfen
Datei freigeben
Korrektur anfordern
Proof erforderlich
Interne Notiz hinzufügen
Kundennachricht hinzufügen
```

When requesting correction, admin must enter customer-facing reason.

Example:

```txt
Die Datei passt nicht zur gewählten Etikettengröße 100×200 mm. Bitte laden Sie eine korrigierte Druckdatei hoch.
```

---

## 15. Proof Admin Actions

Proof actions:

```txt
Proof hochladen
Proof ersetzen
Proof zur Freigabe senden
Proof als nicht erforderlich markieren
```

Rules:

1. Proof upload must be private.
2. Customer receives access only through authenticated/signed flow.
3. Proof approval must be logged.
4. Superseded proofs remain stored.

---

## 16. Quote Request Management

Route:

```txt
/admin/quotes
/admin/quotes/[quoteId]
```

Quote list columns:

```txt
Datum
Firma
Ansprechpartner
E-Mail
Produkttyp
Material
Größe
Menge
Status
Nächste Aktion
```

Quote statuses:

```txt
NEW
UNDER_REVIEW
NEEDS_MORE_INFO
QUOTE_SENT
ACCEPTED
REJECTED
EXPIRED
CONVERTED_TO_ORDER
```

Admin actions:

```txt
Als in Prüfung markieren
Weitere Informationen anfordern
Angebot als gesendet markieren
Als akzeptiert markieren
In Bestellung umwandeln
Als abgelehnt markieren
```

Phase 5 may implement basic quote status management without full quote builder.

---

## 17. Customer Management

Route:

```txt
/admin/customers
/admin/customers/[customerId]
```

Customer list columns:

```txt
Firma
Ansprechpartner
E-Mail
Land
Bestellungen
Gesamtumsatz
Letzte Bestellung
```

Customer detail should show:

```txt
Kundendaten
Bestellhistorie
Angebotsanfragen
Hochgeladene Dateien
Nachbestellungen
Interne Notizen
```

Do not expose internal cost/margin in customer-facing UI.

Admin-only margin visibility may be added later, but not required in Phase 5.

---

## 18. Shipment Management

Admin must be able to add shipment data to an order.

Required fields:

```txt
Versandart
Versanddienstleister
Trackingnummer
Tracking-URL
Paketanzahl
Gewicht kg
Versanddatum
Geschätztes Lieferdatum
Interne Versandnotiz
```

Shipping modes:

```txt
DIRECT_TURKEY_TO_GERMANY
CONSOLIDATED_PARTIAL_PALLET
GERMANY_HUB_DISPATCH
```

Customer-facing German labels:

```txt
Direktversand Türkei → Deutschland
Sammelversand / Teilladung
Versand über Deutschland-Hub
```

Phase 5 may use manual tracking entry.

No carrier API required.

---

## 19. Admin Notes

Admin notes must be internal by default.

Note types:

```txt
INTERNAL
CUSTOMER_VISIBLE
PRODUCTION
SHIPPING
PAYMENT
REPRINT
```

Rules:

1. Internal notes are never shown to customers.
2. Customer-visible notes must be explicitly marked.
3. Production notes may contain supplier/fason details.
4. Notes should record admin user and timestamp.

---

## 20. Status Event History

Every status change must be visible in admin order detail.

Show:

```txt
Datum
Von-Status
Zu-Status
Akteur
Grund / Notiz
```

Actor types:

```txt
ADMIN
CUSTOMER
SYSTEM
STRIPE_WEBHOOK
```

This protects operational accountability.

---

## 21. Payment Visibility

Admin must see payment info but not sensitive card data.

Show:

```txt
Zahlungsstatus
Betrag
Währung
Stripe Session ID
Stripe Payment Intent ID
Zahlungszeitpunkt
Refund status if available
```

Do not show:

```txt
card number
secret keys
webhook secret
raw sensitive payment data
```

---

## 22. Security Requirements

Non-negotiable:

1. `/admin` routes protected.
2. Admin role enforced server-side.
3. No customer can access admin data.
4. File downloads use signed URLs.
5. Admin actions logged.
6. Status transitions validated server-side.
7. No sensitive secrets exposed.
8. Internal notes not customer-visible.
9. Payment data safe.
10. Admin forms validated server-side.

---

## 23. Admin UI Requirements

Admin UI should be:

```txt
simple
fast
table-driven
filterable
action-oriented
clear
safe
```

Do not overdesign.

Use clear badges for statuses.

Example badge labels:

```txt
Zahlung offen
Bezahlt
Dateiprüfung
Proof wartet
Produktion
Versandbereit
Versendet
Abgeschlossen
Korrektur nötig
```

---

## 24. Empty States

Admin screens need useful empty states.

Examples:

```txt
Keine Bestellungen gefunden.
Keine offenen Angebotsanfragen.
Keine Dateien für diese Bestellung vorhanden.
Noch kein Proof hochgeladen.
```

---

## 25. Error Messages

Admin-facing German error examples:

| Situation | Message |
|---|---|
| Unauthorized | Sie haben keinen Zugriff auf diesen Bereich. |
| Invalid status transition | Dieser Statuswechsel ist nicht erlaubt. |
| File download failed | Datei konnte nicht geladen werden. |
| Proof upload failed | Proof konnte nicht hochgeladen werden. |
| Order not found | Bestellung wurde nicht gefunden. |
| Quote not found | Angebotsanfrage wurde nicht gefunden. |

---

## 26. Phase 5 Acceptance Criteria

Phase 5 is accepted when:

| Check | Required Result |
|---|---|
| Admin routes protected | PASS |
| Non-admin cannot access admin | PASS |
| Order list exists | PASS |
| Order detail exists | PASS |
| Payment status visible | PASS |
| File download secure | PASS |
| Admin can approve file | PASS |
| Admin can request correction | PASS |
| Admin can upload proof | PASS |
| Valid status transitions work | PASS |
| Invalid status transitions blocked | PASS |
| Quote list exists | PASS |
| Quote detail exists | PASS |
| Tracking can be added | PASS |
| Status events visible | PASS |
| Admin notes work | PASS |

---

## 27. Phase 5 Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Try `/admin` logged out.
2. Try `/admin` as customer.
3. Login as admin.
4. View order list.
5. Filter orders.
6. Open order detail.
7. Download artwork.
8. Approve artwork.
9. Request correction.
10. Upload proof.
11. Attempt invalid status transition.
12. Add tracking.
13. View status history.
14. Open quote list.
15. Change quote status.
16. Add internal note.
17. Confirm customer cannot see internal note.

---

## 28. Phase 5 PASS/FAIL Report Format

Codex must report:

```txt
## Summary
- What changed

## Files Changed
- path

## Admin Features
- list

## Security
- admin protection method

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended Phase 6 task
```

---

## 29. Common Phase 5 Mistakes to Avoid

Do not:

1. Leave admin unprotected.
2. Hide status transition errors.
3. Allow invalid production transitions.
4. Make uploaded files public.
5. Show internal notes to customer.
6. Expose Stripe secrets.
7. Build charts before operational tables.
8. Build complex ERP workflows.
9. Skip server-side permission checks.
10. Allow arbitrary status editing.
11. Use English public customer UI.
12. Delete order data casually.

---

## 30. Phase 5 Final Verdict

Phase 5 must create the operational backbone of Labelpilot.de.

The correct implementation:

> Protected admin panel → order control → file/proof control → valid status transitions → shipment tracking → quote management.

The wrong implementation:

> A dashboard with charts but no safe operational control.

The admin panel is where margin, quality and delivery discipline are enforced.
