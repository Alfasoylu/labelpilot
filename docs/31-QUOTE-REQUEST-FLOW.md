# 31-QUOTE-REQUEST-FLOW.md

# Labelpilot.de — Quote Request Flow

## 1. Purpose

This document defines the quote request flow for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The quote request flow exists to capture high-value B2B opportunities that should not go through simple fixed-price checkout.

This includes:

- 20,000+ label quantities
- custom sizes
- custom materials
- multiple SKUs
- recurring monthly orders
- sample box follow-up
- reorder with custom quantity
- Germany hub / pallet logistics later
- customers who need consultation before ordering

The quote flow is a revenue pipeline, not a generic contact form.

---

## 2. Strategic Quote Verdict

The correct quote flow is:

> Qualified German B2B buyer submits structured label need → system captures lead/quote data → admin qualifies → quote is prepared → quote converts to paid order or follow-up.

The wrong quote flow is:

> A vague contact form with name, email and message only.

High-value B2B orders need structured data.

---

## 3. Required Source Documents

Before implementing quote flow, Codex must read:

```txt
/docs/01-BUSINESS-MODEL.md
/docs/03-PRODUCT-STRATEGY-v2.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/12-DATABASE-SCHEMA-v2.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/30-PRODUCT-CATALOG.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
/docs/31-QUOTE-REQUEST-FLOW.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

All customer-facing quote UI must be German.

Allowed German labels:

```txt
Angebot anfordern
Individuelles B2B-Angebot
Menge
Material
Etikettengröße
Druckdatei vorhanden?
Wiederkehrender Bedarf
Ziel-Liefertermin
Anfrage senden
```

Not allowed:

```txt
Request quote
Submit
Custom B2B quote
Upload artwork
```

Internal code identifiers may remain English.

---

## 5. When Quote Flow Is Required

Quote flow must be used for:

```txt
20,000+ labels
custom size
custom material
multiple label versions / SKUs
monthly recurring production
special logistics
pallet / partial pallet shipment
Germany hub planning
manual pricing required
admin negotiation required
```

Quote flow may also be used when:

```txt
customer unsure about material
customer needs sample box first
customer has complex artwork
customer wants same label reordered in custom quantity
```

---

## 6. Direct Checkout vs Quote

### Direct Checkout

Allowed for:

```txt
1,000
2,000
5,000
10,000
```

Approved products:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box if paid
```

### Quote Flow

Required for:

```txt
20,000+
custom size
custom material
non-standard product
multi-SKU
recurring order
```

German message:

```txt
Für diese Menge oder Anforderung erstellen wir ein individuelles B2B-Angebot.
```

---

## 7. Quote Request Route

Primary route:

```txt
/de/angebot-anfordern
```

This page must be indexable.

It is a P0 conversion page.

It must receive internal links from:

```txt
homepage
product pages
industry pages
programmatic pages
guides
sample box page
reorder page
footer
navigation CTA
```

---

## 8. Quote Request Page Structure

The quote page must include:

1. H1
2. Direct answer block
3. Who should use quote form
4. What information is needed
5. Quote form
6. File/artwork note
7. Sample box alternative
8. Reorder alternative
9. Privacy/legal notice
10. FAQ
11. Final CTA

Recommended H1:

```txt
B2B-Angebot für Etiketten anfordern
```

Direct answer:

```txt
Labelpilot.de erstellt individuelle B2B-Angebote für PP-Rollenetiketten, Thermoetiketten, Großmengen und wiederkehrende Etikettenbestellungen. Je genauer Angaben zu Material, Größe, Menge und Verpackung sind, desto schneller kann der nächste Schritt vorbereitet werden.
```

---

## 9. Required Quote Form Fields

Required fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Land
Branche
Produkttyp
Etikettengröße
Material
Menge
Wiederkehrender Bedarf
Druckdatei vorhanden?
Notizen
Datenschutz Zustimmung
```

Recommended optional fields:

```txt
Telefon
Website / Shop
Ziel-Liefertermin
Lieferadresse / PLZ
Anzahl Varianten / SKUs
Verpackungsart
Druckdatei später senden
```

Do not make the form so long that conversion dies.

Use progressive disclosure if necessary.

---

## 10. Field Options

### 10.1 Branche

```txt
Lebensmittel
Getränke
Supplemente
Kaffee / Tee
Gewürze
Honig / Marmelade
Kosmetik
Andere
```

### 10.2 Produkttyp

```txt
Opake PP-Rollenetiketten
Transparente PP-Rollenetiketten
Thermoetiketten
Thermo-Versandetiketten
Noch unsicher
Andere
```

### 10.3 Etikettengröße

```txt
100×200 mm
100×100 mm
100×150 mm
Sondergröße
Noch unsicher
```

### 10.4 Material

```txt
Opakes PP
Transparentes PP
Eco-Thermo
Thermo
Noch unsicher
```

### 10.5 Menge

```txt
1.000
5.000
10.000
20.000+
50.000+
100.000+
Noch unsicher
```

### 10.6 Wiederkehrender Bedarf

```txt
Ja, regelmäßig
Vielleicht
Nein, einmalig
Noch unsicher
```

### 10.7 Druckdatei vorhanden?

```txt
Ja
Nein
Wird später gesendet
Ich brauche Unterstützung
```

---

## 11. Quote Form Validation

Server-side validation required.

Rules:

1. Email must be valid.
2. Company name required.
3. Quantity required.
4. Product type required.
5. Privacy consent required.
6. Country defaults to Germany but can be captured.
7. Notes length limited.
8. No unsafe HTML accepted.
9. Spam protection recommended.

German validation messages:

```txt
Bitte geben Sie eine gültige E-Mail-Adresse ein.
Bitte geben Sie den Firmennamen ein.
Bitte wählen Sie eine Menge aus.
Bitte akzeptieren Sie die Datenschutzhinweise.
```

---

## 12. Quote Request Data Model

Use `QuoteRequest` model from `/docs/12-DATABASE-SCHEMA-v2.md`.

Required conceptual fields:

```txt
id
customerId
status
companyName
contactName
email
phone
country
website
industry
productType
labelSize
material
quantity
recurringNeed
targetDeliveryDate
hasArtwork
notes
sourcePage
convertedOrderId
createdAt
updatedAt
```

Quote should also create or link to `Lead` where lead flow exists.

---

## 13. Quote Status Pipeline

Required statuses:

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

German admin labels:

| Internal Status | German Label |
|---|---|
| NEW | Neu |
| UNDER_REVIEW | In Prüfung |
| NEEDS_MORE_INFO | Weitere Informationen benötigt |
| QUOTE_SENT | Angebot gesendet |
| ACCEPTED | Akzeptiert |
| REJECTED | Abgelehnt |
| EXPIRED | Abgelaufen |
| CONVERTED_TO_ORDER | In Bestellung umgewandelt |

---

## 14. Quote Submission Flow

Customer flow:

```txt
Customer visits /de/angebot-anfordern
→ fills quote form
→ accepts privacy notice
→ submits form
→ system validates input
→ creates QuoteRequest
→ creates or updates Lead if lead system exists
→ sends German confirmation email if email enabled
→ shows success message
```

Success message:

```txt
Vielen Dank. Ihre Anfrage ist eingegangen. Wir prüfen Ihre Angaben und melden uns mit dem nächsten Schritt.
```

---

## 15. Admin Quote Review Flow

Admin flow:

```txt
Admin opens /admin/quotes
→ reviews new quote
→ checks quantity/material/industry/repeat potential
→ updates status
→ requests more information if needed
→ prepares quote manually
→ marks quote sent
→ converts accepted quote to order
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

## 16. Quote to Order Conversion

When quote is accepted:

```txt
QuoteRequest ACCEPTED
→ create Order
→ create OrderItem
→ attach customer
→ store agreed price
→ status DRAFT or PENDING_PAYMENT
→ create Stripe payment link/checkout if online payment
→ quote status CONVERTED_TO_ORDER
```

Rules:

1. Do not lose quote history.
2. Store agreed price snapshot.
3. New order must follow normal order flow.
4. Payment still confirmed by Stripe webhook if Stripe used.
5. File/proof workflow still applies.

---

## 17. Quote Payment Options

Possible payment paths:

### 17.1 Stripe Checkout for Quote

Admin creates quote-based checkout session.

Stripe metadata:

```txt
orderId
quoteRequestId
customerId
source: quote_payment
```

### 17.2 Manual Bank Transfer

Possible future option:

```txt
BANK_TRANSFER
```

Must be admin-controlled and logged.

### 17.3 Partial Deposit

Not MVP.

Do not implement partial deposits until documented.

---

## 18. Quote Request Email

If email is enabled, send German confirmation.

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
company name
selected product type
quantity
support contact
```

Do not include private file URLs.

---

## 19. Admin Notification Email

Optional internal email to admin.

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

Do not rely only on email. Quote must be stored in database.

---

## 20. Privacy / GDPR Notice

Quote form must include privacy notice.

German checkbox:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
```

Marketing consent must be separate.

Do not automatically subscribe quote leads to newsletter.

---

## 21. File Upload in Quote Flow

MVP quote form may not require file upload.

Allowed copy:

```txt
Druckdateien können Sie später senden. Für ein erstes Angebot reichen Angaben zu Material, Größe, Menge und Verpackung.
```

If upload is implemented:

1. Validate file.
2. Store privately.
3. Link to QuoteRequest.
4. Admin can download securely.
5. Do not expose public URLs.

---

## 22. Sample Box Alternative

Quote page should offer sample box option.

Text:

```txt
Noch unsicher beim Material? Mit der Labelpilot Musterbox können Sie opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten besser vergleichen.
```

CTA:

```txt
Musterbox anfordern
```

---

## 23. Reorder Alternative

Quote page should mention reorder.

Text:

```txt
Wenn Sie bereits Etiketten bestellt haben, können gespeicherte Druckdaten für eine schnellere Nachbestellung genutzt werden.
```

CTA:

```txt
Etiketten nachbestellen
```

---

## 24. Quote Lead Scoring

If lead system exists, quote requests should be scored.

High-value signals:

```txt
Germany
B2B company
food/beverage/supplement
5,000+
20,000+
repeat need
website/shop exists
artwork available
```

Low-value signals:

```txt
one-time small sticker need
non-target product
no company
price-only request
```

Quote priority should depend on score.

---

## 25. Quote Page FAQ

Recommended FAQs:

```txt
Wann sollte ich ein individuelles Angebot anfordern?
Welche Informationen brauchen Sie für ein Angebot?
Kann ich Druckdaten später senden?
Erhalte ich auch ein Angebot für 20.000+ Etiketten?
Kann ich zuerst eine Musterbox anfordern?
Prüft Labelpilot.de rechtliche Pflichtangaben?
```

Required legal answer:

```txt
Nein. Labelpilot.de übernimmt technische Dateiprüfung, Druckproduktion und Layout-Unterstützung. Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich.
```

---

## 26. Quote Page Internal Links

Quote page must link to:

```txt
/de/musterbox
/de/druckdaten
/de/nachbestellen
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/produktion-versand
/de/datenschutz
```

---

## 27. Quote Flow Acceptance Criteria

Quote flow is accepted when:

| Check | Required Result |
|---|---|
| Quote page exists | PASS |
| Form labels are German | PASS |
| Required fields validated | PASS |
| Privacy checkbox exists | PASS |
| QuoteRequest is stored | PASS |
| Lead created/linked if lead system exists | PASS |
| Success message German | PASS |
| Admin quote list shows request | PASS |
| Admin can update quote status | PASS |
| Quote can convert to order path | PASS |
| 20,000+ directs to quote | PASS |
| No English customer UI | PASS |
| No legal overclaims | PASS |

---

## 28. Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Visit `/de/angebot-anfordern`.
2. Submit empty form.
3. Submit invalid email.
4. Submit valid quote request.
5. Confirm success message.
6. Confirm database record.
7. Confirm admin quote list.
8. Change quote status.
9. Convert quote to order if implemented.
10. Confirm privacy checkbox required.
11. Confirm German UI.
12. Confirm 20,000+ checkout redirects to quote flow.

---

## 29. Common Mistakes to Avoid

Do not:

1. Use generic contact form only.
2. Skip quantity/material fields.
3. Skip privacy consent.
4. Let 20,000+ direct checkout bypass quote.
5. Lose quote history when converting to order.
6. Send quote data only by email without DB storage.
7. Use English form labels.
8. Claim legal compliance.
9. Make file upload mandatory too early.
10. Treat quote as final order without confirmation.
11. Forget lead scoring/source.
12. Forget admin status pipeline.

---

## 30. Codex Implementation Rules

Codex must:

1. Use German customer-facing copy.
2. Store quote requests in database.
3. Validate form server-side.
4. Link to lead system if available.
5. Add admin quote management.
6. Preserve quote history.
7. Use quote flow for 20,000+.
8. Avoid legal overclaims.
9. Report missing email/admin dependencies honestly.

---

## 31. Final Verdict

The quote request flow must capture high-value B2B demand.

The correct implementation:

> Structured German B2B quote form → stored quote request → admin pipeline → quote-to-order conversion.

The wrong implementation:

> Contact form that loses sales context.

Large/repeat B2B orders are where Labelpilot.de can grow. The quote flow must not be weak.
