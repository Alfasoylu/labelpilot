# 34-EMAIL-NOTIFICATIONS.md

> **Live-status note:**
> Email delivery is currently gated. If `RESEND_*` and sender configuration are missing, `lib/email` behaves as a no-op and these transactional flows do not send in production. Read the templates below as the canonical target state; live sending depends on operator/env setup.

# Labelpilot.de — Email Notifications

## 1. Purpose

This document defines transactional email notifications for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Emails must support:

- quote requests
- sample box requests
- payment confirmation
- artwork upload
- correction requests
- proof approval
- shipment tracking
- reorder reminders
- admin notifications

All customer-facing emails must be German.

---

## 2. Strategic Verdict

The correct email system is:

> German transactional emails that tell customers the next operational step and reduce support workload.

The wrong email system is:

> Generic marketing emails, English templates, unclear status updates and no operational value.

Emails must drive clarity, not noise.

---

## 3. Email Provider

Recommended provider:

```txt
Resend
```

Required env variables:

```txt
RESEND_API_KEY
EMAIL_FROM
EMAIL_REPLY_TO
```

Suggested sender:

```txt
Labelpilot.de <noreply@labelpilot.de>
```

Reply-to:

```txt
kontakt@labelpilot.de
```

Domain authentication must be configured before production sending.

---

## 4. Language Rule

All customer emails:

```txt
German subject
German body
German CTA
German status labels
```

Admin internal emails may be German-first.

Do not send English transactional emails in MVP.

---

## 5. Email Types

Required transactional emails:

```txt
QUOTE_REQUEST_RECEIVED
SAMPLE_BOX_REQUEST_RECEIVED
ORDER_PAYMENT_CONFIRMED
ARTWORK_RECEIVED
ARTWORK_CORRECTION_REQUIRED
PROOF_READY
PROOF_APPROVED
ORDER_SHIPPED
REORDER_RECEIVED
ADMIN_NEW_QUOTE
ADMIN_NEW_ORDER
```

Optional later:

```txt
REORDER_REMINDER
SAMPLE_BOX_SHIPPED
QUOTE_FOLLOW_UP
PAYMENT_FAILED
DELIVERY_COMPLETED
```

---

## 6. Email Template Rules

Every email must include:

```txt
brand name
clear subject
customer/company context if relevant
order/quote number if available
next step
support contact
privacy-safe content
```

Do not include:

```txt
private permanent file URLs
Stripe secrets
internal notes
production cost
supplier/fason notes
raw database IDs
```

---

## 7. Quote Request Received

Trigger:

```txt
Customer submits quote form
```

Subject:

```txt
Ihre Anfrage ist eingegangen – Labelpilot.de
```

Body:

```txt
Vielen Dank für Ihre Anfrage. Wir prüfen Ihre Angaben zu Material, Größe, Menge und Verpackung und melden uns mit dem nächsten Schritt für Ihr Etikettenangebot.
```

Include:

```txt
Firma
Produkttyp
Menge
Kontaktmöglichkeit
```

CTA:

```txt
Druckdaten vorbereiten
```

---

## 8. Sample Box Request Received

Trigger:

```txt
Customer submits sample box request
```

Subject:

```txt
Ihre Musterbox-Anfrage ist eingegangen
```

Body:

```txt
Vielen Dank für Ihre Anfrage. Wir prüfen, welche Muster für Ihren Etikettenbedarf sinnvoll sind, und melden uns mit dem nächsten Schritt.
```

CTA:

```txt
B2B-Angebot anfordern
```

---

## 9. Payment Confirmed

Trigger:

```txt
Stripe webhook confirms payment
```

Subject:

```txt
Zahlung bestätigt – Ihre Labelpilot.de Bestellung
```

Body:

```txt
Ihre Zahlung wurde bestätigt. Als nächstes prüfen wir Ihre Druckdatei technisch. Falls noch keine Druckdatei vorliegt, können Sie diese im nächsten Schritt hochladen oder später senden.
```

Include:

```txt
Bestellnummer
Produkt
Menge
Zahlbetrag
Nächster Schritt
```

Do not send this from success page.

Only webhook-confirmed payment triggers this email.

---

## 10. Artwork Received

Trigger:

```txt
Customer uploads artwork file
```

Subject:

```txt
Druckdatei erhalten – Labelpilot.de
```

Body:

```txt
Ihre Druckdatei wurde erfolgreich hochgeladen. Wir prüfen die Datei technisch und melden uns, falls eine Korrektur oder ein Proof erforderlich ist.
```

Include:

```txt
Bestellnummer
Dateiname
Nächster Schritt
```

---

## 11. Artwork Correction Required

Trigger:

```txt
Admin requests correction
```

Subject:

```txt
Korrektur Ihrer Druckdatei erforderlich
```

Body:

```txt
Für Ihre Druckdatei ist eine Korrektur erforderlich. Bitte laden Sie eine korrigierte Datei hoch oder kontaktieren Sie uns bei Fragen.
```

Include admin customer message.

CTA:

```txt
Korrigierte Datei hochladen
```

---

## 12. Proof Ready

Trigger:

```txt
Admin uploads proof and sends for approval
```

Subject:

```txt
Proof zur Freigabe bereit
```

Body:

```txt
Ihr Proof ist zur Freigabe bereit. Bitte prüfen Sie den Proof sorgfältig. Nach Ihrer Freigabe kann die Bestellung für die Produktion vorbereitet werden.
```

CTA:

```txt
Proof prüfen
```

---

## 13. Proof Approved

Trigger:

```txt
Customer approves proof
```

Subject:

```txt
Proof freigegeben – nächster Schritt Produktion
```

Body:

```txt
Vielen Dank. Ihre Proof-Freigabe wurde gespeichert. Die Bestellung kann nun für die Produktion vorbereitet werden.
```

This may also notify admin internally.

---

## 14. Order Shipped

Trigger:

```txt
Admin marks order shipped and tracking exists
```

Subject:

```txt
Ihre Labelpilot.de Bestellung wurde versendet
```

Body:

```txt
Ihre Bestellung wurde versendet. Sie können die Sendung über den Tracking-Link verfolgen.
```

Include:

```txt
Bestellnummer
Versanddienstleister
Trackingnummer
Tracking-Link
```

---

## 15. Reorder Received

Trigger:

```txt
Customer places reorder
```

Subject:

```txt
Nachbestellung erhalten – Labelpilot.de
```

Body:

```txt
Ihre Nachbestellung ist eingegangen. Wir verwenden die freigegebenen Druckdaten Ihrer vorherigen Bestellung und prüfen die neue Bestellung vor der Produktion.
```

Include:

```txt
neue Bestellnummer
Originalbestellung
Produkt
Menge
```

---

## 16. Reorder Reminder

Trigger:

```txt
Manual or future automated reminder
```

Subject:

```txt
Etiketten bald nachbestellen?
```

Body:

```txt
Ihre freigegebenen Druckdaten sind bei Labelpilot.de gespeichert. Sie können dieselben Etiketten schneller nachbestellen oder eine neue Menge auswählen.
```

CTA:

```txt
Etiketten nachbestellen
```

Do not send without proper consent/transactional basis review.

---

## 17. Admin New Quote

Trigger:

```txt
New quote request created
```

Subject:

```txt
Neue B2B-Angebotsanfrage – Labelpilot.de
```

Include:

```txt
Firma
E-Mail
Branche
Produkttyp
Menge
Wiederkehrender Bedarf
Quelle
```

Admin email does not replace database storage.

---

## 18. Admin New Order

Trigger:

```txt
New paid order or pending order created
```

Subject:

```txt
Neue Bestellung – Labelpilot.de
```

Include:

```txt
Bestellnummer
Firma
Produkt
Menge
Zahlungsstatus
Nächste Aktion
```

---

## 19. Email Safety Rules

Do not:

1. Include permanent private file URLs.
2. Include internal costs.
3. Include admin notes.
4. Include Stripe secrets.
5. Send marketing without consent.
6. Send payment confirmation before webhook.
7. Send English customer emails.
8. Spam reorder reminders.

---

## 20. Email Event Logging

Recommended future model:

```txt
EmailEvent
```

Track:

```txt
type
toEmail
subject
provider
providerId
status
sentAt
orderId
leadId
quoteRequestId
```

This helps debug customer communication.

---

## 21. Acceptance Criteria

Email notification system is accepted when:

| Check | Required Result |
|---|---|
| German templates exist | PASS |
| Payment email triggered by webhook only | PASS |
| Quote email exists | PASS |
| Sample email exists | PASS |
| Artwork email exists | PASS |
| Correction email exists | PASS |
| Proof email exists | PASS |
| Shipment email exists | PASS |
| Reorder email exists | PASS |
| No private permanent file URLs | PASS |
| No English customer copy | PASS |

---

## 22. Final Verdict

Emails must reduce uncertainty and support operations.

The correct email system:

> Clear German next-step transactional emails.

The wrong system:

> Random marketing-style messages.

Every email should answer: what happened, what happens next, what should the customer do?
