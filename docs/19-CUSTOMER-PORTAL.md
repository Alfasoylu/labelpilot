# 19-CUSTOMER-PORTAL.md

# Labelpilot.de — Customer Portal

## 1. Purpose

This document defines the customer portal requirements for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The customer portal allows customers to:

- view their orders
- track order status
- upload artwork
- upload corrected files
- review proof files
- approve proof files
- request changes
- view shipment tracking
- reorder previous labels
- manage basic account data

The customer portal is not just an account area.

It is the main infrastructure for repeat B2B orders.

---

## 2. Customer Portal Verdict

The correct customer portal is:

> German customer account area where buyers can manage orders, files, proof approvals and reorders with minimal friction.

The wrong customer portal is:

> A generic account page that only shows invoices and forces every reorder to start from zero.

The customer portal must support reorder behavior from day one.

---

## 3. Required Source Documents

Before implementing the customer portal, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/11-ARCHITECTURE.md
/docs/12-DATABASE-SCHEMA.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/30-PRODUCT-CATALOG.md
/docs/67-PHASE-6-REORDER-SYSTEM.md
/docs/19-CUSTOMER-PORTAL.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

The customer portal must be fully German.

Allowed customer-facing labels:

```txt
Mein Konto
Meine Bestellungen
Bestellung ansehen
Druckdatei hochladen
Druckdatei ersetzen
Proof freigeben
Änderungen anfragen
Etiketten nachbestellen
Sendung verfolgen
Abmelden
```

Not allowed in customer UI:

```txt
My account
My orders
Upload artwork
Approve proof
Request changes
Reorder labels
Track shipment
```

Internal code identifiers may remain English.

---

## 5. Portal Route Map

Recommended routes:

```txt
/konto
/konto/bestellungen
/konto/bestellungen/[orderId]
/konto/dateien
/konto/nachbestellen
/konto/profil
```

Optional future routes:

```txt
/konto/adressen
/konto/rechnungen
/konto/musterbox
/konto/angebote
```

Account routes must not be indexed.

---

## 6. Access Rules

Customer portal requires authentication or secure scoped access.

Rules:

1. Customer can only access own account.
2. Customer can only view own orders.
3. Customer can only access own files.
4. Customer can only approve own proof files.
5. Customer can only reorder own eligible orders.
6. Customer cannot see admin notes.
7. Customer cannot see internal costs.
8. Customer cannot see supplier/fason production notes.
9. Customer cannot see Stripe internal events.

Ownership must be enforced server-side.

---

## 7. Dashboard Page

Route:

```txt
/konto
```

Purpose:

Show what requires customer action.

Sections:

```txt
Aktion erforderlich
Aktuelle Bestellungen
Proofs zur Freigabe
Korrektur erforderlich
Letzte Bestellungen
Schnellzugriff Nachbestellung
```

German empty states:

```txt
Aktuell ist keine Aktion erforderlich.
Sie haben noch keine Bestellung.
Es wartet kein Proof auf Ihre Freigabe.
```

Primary CTA:

```txt
Etiketten nachbestellen
```

Secondary CTA:

```txt
Angebot anfordern
```

---

## 8. Orders List

Route:

```txt
/konto/bestellungen
```

Columns/cards:

```txt
Bestellnummer
Datum
Produkt
Material
Größe
Menge
Status
Betrag
Nächste Aktion
```

Actions:

```txt
Bestellung ansehen
Druckdatei hochladen
Proof freigeben
Etiketten nachbestellen
Sendung verfolgen
```

The list should be mobile-friendly.

For B2B customers, cards may be better than wide tables on mobile.

---

## 9. Order Detail Page

Route:

```txt
/konto/bestellungen/[orderId]
```

Required sections:

1. Order summary.
2. Current status.
3. Next step.
4. Product details.
5. Uploaded artwork.
6. Proof approval.
7. Shipment tracking.
8. Reorder action.
9. Support contact.

Customer must not see:

```txt
internal production cost
admin-only notes
supplier/fason notes
Stripe internal data
margin data
private storage paths
```

---

## 10. Customer Order Status Labels

Map internal statuses to German customer-facing labels.

| Internal Status | German Label |
|---|---|
| DRAFT | Entwurf |
| PENDING_PAYMENT | Zahlung offen |
| PAID | Zahlung bestätigt |
| FILE_REVIEW | Druckdatei wird geprüft |
| PROOF_REQUIRED | Proof wird vorbereitet |
| WAITING_CUSTOMER_APPROVAL | Proof wartet auf Freigabe |
| APPROVED_FOR_PRODUCTION | Für Produktion freigegeben |
| IN_PRODUCTION | In Produktion |
| READY_TO_SHIP | Versandbereit |
| SHIPPED | Versendet |
| DELIVERED | Zugestellt |
| COMPLETED | Abgeschlossen |
| CANCELLED | Storniert |
| REFUND_REQUESTED | Rückerstattung in Prüfung |
| REPRINT_REQUIRED | Nachdruck in Prüfung |

Do not expose raw enum values to customers.

---

## 11. Next-Step Messaging

Every order detail page should show the next step.

Examples:

### PENDING_PAYMENT

```txt
Bitte schließen Sie die Zahlung ab, damit wir Ihre Bestellung weiterbearbeiten können.
```

### PAID

```txt
Ihre Zahlung wurde bestätigt. Als nächstes prüfen wir Ihre Druckdatei technisch.
```

### FILE_REVIEW

```txt
Ihre Druckdatei wird technisch geprüft. Wir melden uns, falls eine Korrektur erforderlich ist.
```

### CORRECTION_REQUIRED

```txt
Für Ihre Druckdatei ist eine Korrektur erforderlich. Bitte laden Sie eine neue Datei hoch.
```

### WAITING_CUSTOMER_APPROVAL

```txt
Bitte prüfen Sie den Proof und geben Sie ihn frei oder fragen Sie Änderungen an.
```

### IN_PRODUCTION

```txt
Ihre Etiketten befinden sich in Produktion.
```

### SHIPPED

```txt
Ihre Bestellung wurde versendet. Die Sendungsverfolgung finden Sie unten.
```

---

## 12. File Upload in Customer Portal

Customer can upload files from:

```txt
/konto/bestellungen/[orderId]
```

Upload actions:

```txt
Druckdatei hochladen
Korrigierte Datei hochladen
```

Supported formats:

```txt
PDF
AI
EPS
SVG
PNG
JPG
JPEG
ZIP
```

German helper text:

```txt
Bevorzugte Formate: PDF, AI oder EPS. Weitere akzeptierte Formate: SVG, PNG, JPG oder ZIP.
```

Rules:

1. Validate file server-side.
2. Store file privately.
3. Show file status.
4. Do not expose public file URL.
5. Replacement files do not overwrite old files.

---

## 13. File Status Display

German labels:

| Internal Status | Customer Label |
|---|---|
| UPLOADED | Datei erhalten |
| UNDER_REVIEW | Datei wird geprüft |
| APPROVED | Datei freigegeben |
| CORRECTION_REQUIRED | Korrektur erforderlich |
| REPLACED | Datei ersetzt |
| ARCHIVED | Archiviert |

Customer should see active file and relevant status only.

Old file history can be shown later but is not required in MVP.

---

## 14. Proof Approval

If proof is waiting for approval, customer sees:

```txt
Proof wartet auf Freigabe
```

Actions:

```txt
Proof anzeigen
Proof freigeben
Änderungen anfragen
```

German explanation:

```txt
Bitte prüfen Sie den Proof sorgfältig. Nach Ihrer Freigabe kann die Bestellung für die Produktion vorbereitet werden.
```

When approving, customer should confirm:

```txt
Ich habe den Proof geprüft und gebe ihn für die weitere Bearbeitung frei.
```

Approval must be logged.

---

## 15. Proof Change Request

If customer requests changes:

Required field:

```txt
Welche Änderung wünschen Sie?
```

Button:

```txt
Änderungen senden
```

After submission:

```txt
Vielen Dank. Wir prüfen Ihren Änderungswunsch und melden uns mit dem nächsten Schritt.
```

Status should move back to admin/file review workflow.

---

## 16. Reorder from Customer Portal

Reorder is a core portal feature.

Eligible orders should show:

```txt
Etiketten nachbestellen
```

Reorder flow:

```txt
Bestellung öffnen
→ Etiketten nachbestellen
→ Spezifikationen prüfen
→ Menge auswählen
→ Gleiche Druckdatei oder kleine Änderung
→ Zahlung / Angebot
```

German confirmation text:

```txt
Wir verwenden die freigegebenen Druckdaten Ihrer vorherigen Bestellung. Sie können die Menge ändern oder eine kleine Anpassung anfragen.
```

---

## 17. Reorder Confirmation Page

Show:

```txt
Originalbestellung
Produkt
Material
Größe
Bisherige Menge
Neue Menge
Druckdatei
Änderungswunsch
Preis
```

Actions:

```txt
Nachbestellung bezahlen
Angebot anfordern
Kleine Änderung anfragen
```

If quantity is 20,000+:

```txt
Für diese Menge erstellen wir ein individuelles B2B-Angebot.
```

---

## 18. Shipment Tracking

If order is shipped, show:

```txt
Versanddienstleister
Trackingnummer
Tracking-Link
Versanddatum
Voraussichtliche Lieferung
```

German CTA:

```txt
Sendung verfolgen
```

Do not show internal logistics cost.

---

## 19. Profile Page

Route:

```txt
/konto/profil
```

Show/edit:

```txt
Name
Firma
E-Mail
Telefon
Website
Branche
Standard-Lieferland
```

Optional future:

```txt
Adressen
Rechnungsdaten
USt-IdNr.
```

Do not overbuild profile in MVP.

---

## 20. Files Page

Route:

```txt
/konto/dateien
```

Purpose:

Show customer’s uploaded files.

MVP may skip this if order detail already shows files.

If implemented, show:

```txt
Dateiname
Bestellnummer
Upload-Datum
Status
```

Do not allow browsing other customers’ files.

---

## 21. Customer Portal Emails

Customer portal events may trigger German transactional emails.

Examples:

### File Correction Required

Subject:

```txt
Korrektur Ihrer Druckdatei erforderlich
```

### Proof Ready

Subject:

```txt
Proof zur Freigabe bereit
```

### Order Shipped

Subject:

```txt
Ihre Labelpilot.de Bestellung wurde versendet
```

### Reorder Confirmation

Subject:

```txt
Nachbestellung erhalten – Labelpilot.de
```

Do not include permanent private file URLs in emails.

---

## 22. Customer Portal Error Messages

German errors:

| Situation | Message |
|---|---|
| Unauthorized | Bitte melden Sie sich an. |
| Forbidden | Sie haben keinen Zugriff auf diese Bestellung. |
| Order not found | Bestellung wurde nicht gefunden. |
| File upload failed | Datei konnte nicht hochgeladen werden. |
| Invalid file | Dieses Dateiformat wird nicht unterstützt. |
| Proof approval failed | Die Proof-Freigabe konnte nicht gespeichert werden. |
| Reorder not allowed | Diese Bestellung kann noch nicht nachbestellt werden. |

Do not expose stack traces or internal IDs.

---

## 23. Portal Security Requirements

Non-negotiable:

1. Customer route access protected.
2. Customer ownership checked server-side.
3. File access uses signed URLs.
4. Proof approval authenticated or secure token.
5. Reorder only own eligible orders.
6. No admin notes visible.
7. No internal cost visible.
8. No permanent public file URLs.
9. Account pages noindex.
10. Form inputs validated server-side.

---

## 24. Mobile UX Requirements

Many customers will use mobile.

Portal must be usable on mobile.

Rules:

1. Use cards for order list on mobile.
2. Keep CTAs large enough.
3. Avoid wide tables without responsive layout.
4. Make proof approval simple.
5. Make file upload clear.
6. Show next action prominently.

---

## 25. Customer Portal Acceptance Criteria

Customer portal is accepted when:

| Check | Required Result |
|---|---|
| Customer can sign in | PASS |
| Customer dashboard exists | PASS |
| Customer can view own orders | PASS |
| Customer cannot view another customer order | PASS |
| Order detail shows status | PASS |
| Order detail shows next step | PASS |
| Customer can upload artwork | PASS |
| Customer can upload correction | PASS |
| Customer can approve proof | PASS |
| Customer can request proof changes | PASS |
| Customer can view shipment tracking | PASS |
| Eligible order can be reordered | PASS |
| Reorder creates new order | PASS |
| Customer-facing UI is German | PASS |
| Account pages are noindex | PASS |
| No internal notes/costs visible | PASS |

---

## 26. Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
```

Manual tests:

1. Login as customer.
2. Visit `/konto`.
3. View orders list.
4. Open own order.
5. Try another customer order URL.
6. Upload artwork.
7. Upload invalid file type.
8. Approve proof.
9. Request proof changes.
10. View shipment tracking.
11. Start reorder.
12. Change reorder quantity.
13. Request minor change.
14. Check no admin notes visible.
15. Check mobile layout.
16. Check German UI text.
17. Check noindex metadata.

---

## 27. Common Mistakes to Avoid

Do not:

1. Show raw enum values to customers.
2. Let customer access another customer order.
3. Make uploaded files public.
4. Show admin notes.
5. Show internal costs.
6. Force repeat customers to upload same file again.
7. Hide next action.
8. Use English UI text.
9. Make account pages indexable.
10. Allow anonymous proof approval without token/user.
11. Modify original order during reorder.
12. Overbuild profile before core actions work.

---

## 28. Codex Implementation Rules

Codex must:

1. Read this document before customer portal implementation.
2. Keep UI German.
3. Enforce ownership server-side.
4. Use signed URLs for files.
5. Map internal statuses to German labels.
6. Show next action clearly.
7. Support proof approval.
8. Support reorder.
9. Keep portal mobile-friendly.
10. Not expose internal/admin data.

---

## 29. Final Customer Portal Verdict

The customer portal must make repeat buying easier.

The correct implementation:

> Customer sees orders, uploads files, approves proofs, tracks shipment and reorders previous labels with saved data.

The wrong implementation:

> Customer only sees a basic profile and must restart every order from zero.

If Labelpilot.de wants high LTV, the customer portal must make reorders easier than first orders.
> SUPERSEDED — see `19-CUSTOMER-PORTAL-v2.md`. Kept for history. See `/docs/00-SOURCE-OF-TRUTH.md`.
