# 18-ADMIN-PANEL.md

# Labelpilot.de — Admin Panel

## 1. Purpose

This document defines the admin panel requirements for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The admin panel is the internal operating system for:

- orders
- payments
- quote requests
- leads
- customer records
- uploaded artwork
- proofing
- production status
- shipment tracking
- reorders
- reprints
- internal notes

The admin panel must prioritize operational control over visual complexity.

---

## 2. Admin Panel Verdict

The correct admin panel is:

> A protected, simple, table-driven operations panel that lets admins safely move paid custom label orders from file review to proofing, production, shipment and reorder.

The wrong admin panel is:

> A pretty dashboard with charts but no real control over files, proof approval, order status and B2B leads.

Admin panel quality directly affects margin, delivery accuracy and customer trust.

---

## 3. Required Source Documents

Before implementing the admin panel, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/12-DATABASE-SCHEMA-v2.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/66-PHASE-5-ADMIN-PANEL.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
/docs/18-ADMIN-PANEL.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Admin UI Language

Recommended admin UI language:

```txt
German
```

Reason:

- customer-facing business is German
- future Germany hub/staff may use German
- status labels stay consistent
- operational copy becomes clearer

Allowed internal English:

- enum values
- database fields
- code identifiers
- developer logs

German admin labels should map to English enum values in code.

---

## 5. Admin Access Rules

Admin access is restricted.

Minimum required role:

```txt
ADMIN
```

Routes:

```txt
/admin
/admin/*
```

Rules:

1. Unauthenticated users cannot access admin panel.
2. CUSTOMER users cannot access admin panel.
3. Admin role must be checked server-side.
4. Client-side hiding is not enough.
5. Admin routes must be noindex.
6. Admin APIs must enforce role checks.
7. Admin file download must use signed URLs.
8. Admin actions must be logged where operationally important.

---

## 6. Admin Route Map

Required routes:

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

Optional future routes:

```txt
/admin/payments
/admin/shipments
/admin/reprints
/admin/production
/admin/content
/admin/products
/admin/audit
```

Do not build optional routes before core operations work.

---

## 7. Admin Navigation

Primary navigation:

```txt
Dashboard
Bestellungen
Angebote
Leads
Kunden
Dateien
Einstellungen
```

Optional later:

```txt
Zahlungen
Versand
Nachdrucke
Produktion
```

Navigation must show operational counts where useful.

Example:

```txt
Bestellungen (12)
Angebote (4)
Leads (18)
Dateiprüfung (6)
```

---

## 8. Admin Dashboard

Route:

```txt
/admin
```

Purpose:

Show what requires action today.

Dashboard sections:

1. Order action counts.
2. Quote request counts.
3. Lead pipeline counts.
4. File/proof action counts.
5. Shipment action counts.
6. Recent orders.
7. Recent leads.

### 8.1 Operational Counts

Show:

```txt
Neue Bestellungen
Angebot angefragt
Zahlung offen
Zahlung fehlgeschlagen
Bezahlt
Dateiprüfung
Korrektur erforderlich
Proof wartet auf Freigabe
Angehalten
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Nachdruck erforderlich
Offene Angebotsanfragen
Neue Leads
Follow-ups heute
```

Each count should link to the filtered list.

Do not prioritize vanity charts in MVP.

---

## 9. Orders List

Route:

```txt
/admin/orders
```

Purpose:

Manage the full order queue.

Columns:

```txt
Bestellnummer
Datum
Firma
Kontakt
E-Mail
Produkt
Menge
Betrag
Zahlung
Status
Nächste Aktion
```

Required filters:

```txt
Alle
Angebot angefragt
Zahlung offen
Zahlung fehlgeschlagen
Bezahlt
Dateiprüfung
Korrektur erforderlich
Proof erforderlich
Wartet auf Kundenfreigabe
Angehalten
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Zugestellt
Abgeschlossen
Nachdruck erforderlich
Storniert
```

Search fields:

```txt
Bestellnummer
Firma
E-Mail
Kontakt
```

Sorting:

```txt
Newest first
Oldest first
Status
Amount
Quantity
```

---

## 10. Order Detail

Route:

```txt
/admin/orders/[orderId]
```

Purpose:

One screen to manage the entire order.

Required sections:

1. Order summary
2. Customer information
3. Product/order items
4. Payment information
5. Artwork files
6. File review
7. Proof files
8. Status management
9. Shipment tracking
10. Reorder information
11. Admin notes
12. Status history

---

## 11. Order Summary Section

Show:

```txt
Bestellnummer
Aktueller Status
Erstellt am
Bestellquelle
Nachbestellung ja/nein
Originalbestellung if reorder
Gesamtbetrag
Währung
```

German status badges:

```txt
Entwurf
Zahlung offen
Bezahlt
Dateiprüfung
Proof erforderlich
Wartet auf Freigabe
Freigegeben für Produktion
In Produktion
Versandbereit
Versendet
Zugestellt
Abgeschlossen
Storniert
Rückerstattung angefragt
Nachdruck erforderlich
```

---

## 12. Customer Section

Show:

```txt
Firma
Ansprechpartner
E-Mail
Telefon
Land
Website
Branche
Lieferadresse
Rechnungsadresse if available
```

Admin actions:

```txt
Kunde öffnen
E-Mail kopieren
Interne Notiz hinzufügen
```

Do not expose customer private data unnecessarily.

---

## 13. Product Section

Show order items:

```txt
Produkt
Material
Größe
Menge
Paket
Einzelpreis
Gesamtpreis
Kundennotiz
```

Important:

Order items must use price/product snapshots, not current product config only.

---

## 14. Payment Section

Show:

```txt
Zahlungsstatus
Zahlungsanbieter
Betrag
Währung
Stripe Checkout Session ID
Stripe Payment Intent ID
Zahlungszeitpunkt
Refund status if any
```

Admin actions:

```txt
Stripe-ID kopieren
Zahlungsdetails ansehen
Rückerstattung prüfen
```

Do not show card details or secrets.

---

## 15. Artwork File Section

Show:

```txt
Dateiname
Dateityp
Dateigröße
Upload-Datum
Dateistatus
Download
```

Admin actions:

```txt
Datei herunterladen
Datei prüfen
Datei freigeben
Korrektur anfordern
Proof erforderlich
```

File downloads must use signed URLs.

No public permanent artwork URLs.

---

## 16. File Review Section

Admin checklist:

```txt
Datei lässt sich öffnen
Richtige Etikettengröße
Richtige Ausrichtung
Material passt zur Bestellung
Menge passt zur Bestellung
Layout passt zu 100×200 mm
Beschnitt akzeptabel
Text lesbar
Auflösung akzeptabel
Keine offensichtlichen fehlenden Elemente
Kundennotizen geprüft
Proof erforderlich entschieden
```

File review decisions:

```txt
Datei freigeben
Korrektur anfordern
Proof erforderlich
Datei ablehnen
```

When correction is requested, admin must enter a customer-visible German reason.

Example:

```txt
Die Datei passt nicht zur gewählten Größe 100×200 mm. Bitte laden Sie eine korrigierte Druckdatei hoch.
```

---

## 17. Proof Section

Show:

```txt
Proof-Datei
Proof-Status
Upload-Datum
Kundenfreigabe-Zeitpunkt
Änderungswunsch
```

Admin actions:

```txt
Proof hochladen
Proof ersetzen
Proof zur Freigabe senden
Proof als nicht erforderlich markieren
```

Rules:

1. Proof files are private.
2. Customer approval is logged.
3. Old proofs are not overwritten.
4. Superseded proofs stay stored.
5. Admin cannot pretend customer approved unless there is explicit admin override logging.

---

## 18. Status Management Section

Admin can only perform valid status transitions.

Allowed core transitions:

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

Forbidden transitions must be blocked server-side.

Forbidden examples:

```txt
PENDING_PAYMENT → IN_PRODUCTION
PAID → IN_PRODUCTION
FILE_REVIEW → SHIPPED
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION without approval
CANCELLED → IN_PRODUCTION
```

---

## 19. Shipment Section

Show:

```txt
Versandart
Versanddienstleister
Trackingnummer
Tracking-URL
Paketanzahl
Gewicht kg
Versanddatum
Voraussichtliches Lieferdatum
Versandnotiz
```

Admin actions:

```txt
Tracking hinzufügen
Als versendet markieren
Als zugestellt markieren
Versandnotiz hinzufügen
```

Shipping modes:

```txt
Direktversand Türkei → Deutschland
Sammelversand / Teilladung
Versand über Deutschland-Hub
```

No carrier API required in MVP.

---

## 20. Reorder Section

If order is reorder:

Show:

```txt
Nachbestellung: Ja
Originalbestellung
Nachbestelltyp
Gleiche Druckdatei
Kleine Änderung angefragt
Änderungsnotiz
```

If order is eligible for future reorder:

Show:

```txt
Nachbestellbar: Ja
```

Admin actions:

```txt
Originalbestellung öffnen
Nachbestellhistorie ansehen
```

---

## 21. Admin Notes Section

Admin notes are internal by default.

Note types:

```txt
Intern
Kundensichtbar
Produktion
Versand
Zahlung
Nachdruck
```

Rules:

1. Internal notes never show to customer.
2. Customer-visible notes must be explicit.
3. Notes store admin user and timestamp.
4. Production notes may contain supplier/fason details.
5. Never put secrets in notes.

---

## 22. Status History Section

Show every status event:

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

This section is required.

No silent status changes.

---

## 23. Quotes List

Route:

```txt
/admin/quotes
```

Columns:

```txt
Datum
Firma
Kontakt
E-Mail
Branche
Produkttyp
Material
Größe
Menge
Status
Nächste Aktion
```

Filters:

```txt
Neu
In Prüfung
Weitere Infos benötigt
Angebot gesendet
Akzeptiert
Abgelehnt
Abgelaufen
In Bestellung umgewandelt
```

---

## 24. Quote Detail

Route:

```txt
/admin/quotes/[quoteId]
```

Show:

```txt
Firma
Ansprechpartner
E-Mail
Telefon
Website
Branche
Produkttyp
Etikettengröße
Material
Menge
Wiederkehrender Bedarf
Ziel-Liefertermin
Druckdatei vorhanden
Notizen
Quelle
```

Admin actions:

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

## 25. Leads List

Route:

```txt
/admin/leads
```

Columns:

```txt
Datum
Typ
Status
Score
Firma
Kontakt
E-Mail
Branche
Menge
Quelle
Nächste Aktion
```

Filters:

```txt
Status
Typ
Branche
Score
Quelle
Zeitraum
```

Search:

```txt
Firma
E-Mail
Website
Kontakt
```

---

## 26. Lead Detail

Route:

```txt
/admin/leads/[leadId]
```

Show:

```txt
Lead-Typ
Status
Score
Qualität
Firma
Kontakt
E-Mail
Telefon
Website
Branche
Produkttyp
Menge
Wiederkehrender Bedarf
Quelle / UTM
Notizen
Follow-up
```

Admin actions:

```txt
Als qualifiziert markieren
Musterbox geplant
Angebot benötigt
Angebot gesendet
Follow-up setzen
In Kunde umwandeln
In Bestellung umwandeln
Als verloren markieren
Disqualifizieren
Notiz hinzufügen
```

---

## 27. Customers List

Route:

```txt
/admin/customers
```

Columns:

```txt
Firma
Kontakt
E-Mail
Land
Branche
Bestellungen
Gesamtumsatz
Letzte Bestellung
```

Search:

```txt
Firma
E-Mail
Kontakt
Website
```

---

## 28. Customer Detail

Route:

```txt
/admin/customers/[customerId]
```

Show:

```txt
Kundendaten
Bestellhistorie
Angebotsanfragen
Leads
Hochgeladene Dateien
Nachbestellungen
Interne Notizen
```

Admin actions:

```txt
Bestellung öffnen
Lead öffnen
Angebot öffnen
Notiz hinzufügen
```

---

## 29. Uploads Page

Route:

```txt
/admin/uploads
```

Purpose:

Operational overview of uploaded files.

Columns:

```txt
Datum
Bestellnummer
Kunde
Dateiname
Dateityp
Dateistatus
Review-Status
Nächste Aktion
```

Filters:

```txt
Neu
In Prüfung
Freigegeben
Korrektur erforderlich
Ersetzt
Archiviert
```

---

## 30. Settings Page

Route:

```txt
/admin/settings
```

MVP settings can be minimal.

Show:

```txt
Admin user info
Site status
Feature flags if implemented
Webhook status note
Storage provider note
```

Do not build complex settings before needed.

---

## 30A. Pricing Cost-Parameter Screen (custom-size engine) — APPROVED 2026-06-03 (founder); build phased

Route: `/admin/settings/pricing` (ADMIN role only).

Purpose: let the operator enter the **cost basis** that powers the custom-size **"enter your size → get a price"** engine (formula spec in `04-PRICING-AND-MARGIN-MODEL.md` §29). Customers never see these values — only the computed sell price.

Editable fields — **per material row** (Opak PP, Transparent PP, …):

```txt
Material cost per m² (€)
Digital print cost per m² (€)        — digital has NO plate
Flexo print cost per m² (€)
Flexo plate (Kalıp/Cliché) cost (€)  — fixed per job; optional × number of colours
Waste factor (%)                     — flexo setup waste usually higher
Target margin (%)  (or markup)
Minimum order value (€)
Optional setup fee (€)
```

Global: VAT %, shipping rule, price-rounding step, custom-size limits (max W/H, max quantity, quote-fallback triggers).

Requirements:
1. **Server-side validation:** all costs > 0; margin within sane bounds; W/H/quantity limits coherent.
2. **Built-in test calculator:** enter material + width + height + quantity → preview **digital cost vs flexo cost (+plate)**, the **chosen (cheaper) method**, and the resulting **net + gross sell price** — BEFORE saving.
3. **Audit + versioning:** every change logged (who / when / old → new); previous values recoverable; a change must **never** silently re-price already-placed orders.
4. ADMIN role only; values stored server-side; never sent to the public client except as a single computed price.
5. No destructive reset; explicit Save with confirmation; show "last updated by / at".

Build note — customer surface added 2026-06-03:
- The operator-managed custom-size pricing inputs in §30A now power a feature-gated public customer surface at `/de/wunschformat`.
- The public surface stays OFF until `NEXT_PUBLIC_FEATURE_CUSTOM_SIZE=true` and only produces customer-safe sell prices when the `PricingMaterialCost` row and the `PricingSettings(id="default")` row exist.
- Admin cost parameters, print-method choice, and detailed cost breakdown remain internal-only and are not exposed in the public response.

---

## 31. Security Requirements

Non-negotiable:

1. Admin routes require ADMIN role.
2. Admin API routes require ADMIN role.
3. File downloads use signed URLs.
4. No permanent public file URLs.
5. Status transitions validated server-side.
6. Payment data never exposes secrets.
7. Internal notes not shown to customers.
8. Admin actions logged where relevant.
9. No arbitrary raw SQL from UI.
10. No destructive delete buttons in MVP.

---

## 32. Admin API Rules

Admin mutations must:

1. Authenticate admin.
2. Validate input.
3. Check allowed transition/action.
4. Perform database update.
5. Create status event or note where relevant.
6. Return safe response.

Example protected actions:

```txt
updateOrderStatus
approveArtworkFile
requestFileCorrection
uploadProof
sendProofForApproval
addShipmentTracking
updateQuoteStatus
updateLeadStatus
addAdminNote
```

---

## 33. Empty States

Use helpful German empty states.

Examples:

```txt
Keine Bestellungen gefunden.
Keine offenen Angebotsanfragen.
Keine Leads gefunden.
Keine Dateien für diese Bestellung vorhanden.
Noch kein Proof hochgeladen.
Keine internen Notizen vorhanden.
```

---

## 34. Admin Error Messages

German admin errors:

| Situation | Message |
|---|---|
| Unauthorized | Sie haben keinen Zugriff auf diesen Bereich. |
| Invalid transition | Dieser Statuswechsel ist nicht erlaubt. |
| Order not found | Bestellung wurde nicht gefunden. |
| File not found | Datei wurde nicht gefunden. |
| File download failed | Datei konnte nicht geladen werden. |
| Proof upload failed | Proof konnte nicht hochgeladen werden. |
| Quote not found | Angebotsanfrage wurde nicht gefunden. |
| Lead not found | Lead wurde nicht gefunden. |

---

## 35. MVP Admin Acceptance Criteria

Admin panel is accepted when:

| Check | Required Result |
|---|---|
| `/admin` protected | PASS |
| Customer cannot access admin | PASS |
| Order list works | PASS |
| Order detail works | PASS |
| Payment status visible | PASS |
| Artwork files visible | PASS |
| File download secure | PASS |
| File approve/correction actions work | PASS |
| Proof upload works | PASS |
| Valid status transitions work | PASS |
| Invalid status transitions blocked | PASS |
| Shipment tracking can be added | PASS |
| Quote list/detail works | PASS |
| Lead list/detail works | PASS |
| Customer list/detail works | PASS |
| Admin notes work | PASS |
| Status history visible | PASS |

---

## 36. Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Visit `/admin` logged out.
2. Visit `/admin` as customer.
3. Visit `/admin` as admin.
4. Open orders list.
5. Open order detail.
6. Approve file.
7. Request correction.
8. Upload proof.
9. Try invalid status transition.
10. Add tracking.
11. Add internal note.
12. Confirm internal note hidden from customer.
13. Open quotes list/detail.
14. Open leads list/detail.
15. Open customers list/detail.
16. Download file through signed URL.
17. Check no admin pages are indexable.

---

## 37. Common Admin Mistakes to Avoid

Do not:

1. Leave admin routes unprotected.
2. Use client-only role checks.
3. Allow arbitrary status editing.
4. Make uploaded files public.
5. Hide Stripe/payment failure details.
6. Show internal notes to customers.
7. Delete orders/payments casually.
8. Build charts before operational workflows.
9. Skip status event logging.
10. Allow production before approval.
11. Use English customer-facing text.
12. Store secrets in admin notes.

---

## 38. Codex Implementation Rules

Codex must:

1. Read this document before admin implementation.
2. Keep admin routes protected.
3. Implement server-side role checks.
4. Use German admin UI labels where possible.
5. Prioritize order operations first.
6. Avoid unnecessary dashboard complexity.
7. Log important actions.
8. Enforce valid status transitions.
9. Use signed URLs for files.
10. Report missing dependencies honestly.

---

## 39. Final Admin Panel Verdict

The admin panel must be built as Labelpilot.de’s operational control center.

The correct implementation:

> Protected admin panel with order, file, proof, quote, lead, customer and shipment control.

The wrong implementation:

> Decorative dashboard without operational authority.

If admins cannot safely control orders and files, the business cannot scale.
