# 32-SAMPLE-BOX-FLOW.md

# Labelpilot.de — Sample Box Flow

## 1. Purpose

This document defines the sample box flow for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The sample box flow exists to reduce trust friction for German B2B buyers before they place larger label orders.

The sample box must help customers evaluate:

- opaque PP label material
- transparent PP label material
- thermal label material
- print feel
- roll label format
- application suitability
- packaging appearance

The sample box is not a free gift.

It is a controlled B2B qualification and conversion tool.

---

## 2. Strategic Sample Box Verdict

The correct sample box strategy is:

> Use sample boxes to qualify serious German B2B buyers, build trust, and convert them into 5,000+ PP label orders.

The wrong sample box strategy is:

> Send free samples to everyone and burn cash on low-value leads.

Sample box flow must protect margin and focus on qualified customers.

---

## 3. Required Source Documents

Before implementing sample box flow, Codex must read:

```txt
/docs/01-BUSINESS-MODEL.md
/docs/03-PRODUCT-STRATEGY.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/12-DATABASE-SCHEMA.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/30-PRODUCT-CATALOG.md
/docs/31-QUOTE-REQUEST-FLOW.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
/docs/32-SAMPLE-BOX-FLOW.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

All customer-facing sample box UI must be German.

Allowed German labels:

```txt
Musterbox anfordern
Labelpilot Musterbox
Materialmuster
Opake PP-Etiketten
Transparente PP-Etiketten
Thermoetiketten
Anfrage senden
```

Not allowed:

```txt
Sample box
Request sample
Get samples
Submit
```

Internal code identifiers may remain English.

---

## 5. Sample Box Route

Primary route:

```txt
/de/musterbox
```

This page is indexable.

It should receive links from:

```txt
homepage
product pages
industry pages
programmatic pages
quote page
guide pages
footer
navigation
```

---

## 6. Sample Box Page Goal

The sample box page must answer:

1. What is included?
2. Who should request it?
3. Which materials can be compared?
4. How does it help before ordering?
5. Is it for B2B buyers?
6. What happens after request?
7. How does it connect to quote/order?
8. What are the legal/responsibility boundaries?

Recommended H1:

```txt
Etiketten Musterbox anfordern
```

Direct answer:

```txt
Mit der Labelpilot Musterbox können B2B-Marken opake PP-Etiketten, transparente PP-Etiketten und Thermoetiketten vergleichen, bevor sie größere Mengen bestellen. Die Musterbox hilft, Material, Haptik und Druckwirkung besser einzuschätzen.
```

---

## 7. Sample Box Contents

Recommended contents:

```txt
Opake PP-Rollenetiketten Muster
Transparente PP-Rollenetiketten Muster
Thermoetiketten 100×100 mm Muster
Thermo-Versandetiketten 100×150 mm Muster
Materialhinweise
Bestellablauf-Karte
Druckdaten-Hinweis
Nachbestell-Vorteil-Hinweis
```

Optional later:

```txt
label on bottle example
label on jar example
sample coupon
QR code to quote page
```

Do not include expensive custom samples in MVP unless paid/qualified.

---

## 8. Who Should Request Sample Box

Good fit:

```txt
Lebensmittelmarken
Getränkemarken
Supplement-Marken
Kaffeeröstereien
Gewürzmarken
Honig-/Marmeladenhersteller
D2C-Marken mit Produktverpackung
B2B-Kunden mit 5.000+ Etikettenbedarf
```

Bad fit:

```txt
private one-time sticker request
wedding/event stickers
small hobby labels under 1,000 pieces
generic sticker collectors
non-target print products
```

The page should subtly qualify users.

---

## 9. Sample Box Pricing Strategy

Possible models:

### 9.1 Paid Sample Box

Customer pays a small fee.

Advantages:

- filters low-quality leads
- offsets shipping cost
- proves intent

### 9.2 Free for Qualified B2B Leads

Admin approves before sending.

Advantages:

- good for high-value leads
- preserves trust
- avoids waste

### 9.3 Paid With First Order Credit

Customer pays, then receives credit on first label order.

Recommended future model:

```txt
Musterbox-Gebühr wird bei erster Bestellung ab 5.000 Etiketten angerechnet.
```

### MVP Recommendation

Start with:

```txt
Request-based or paid sample box.
Do not automatically send free boxes to everyone.
```

---

## 10. Sample Box Request Form

Required fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Land
Branche
Welche Etiketten interessieren Sie?
Voraussichtliche Menge
Wiederkehrender Bedarf
Lieferadresse or PLZ
Datenschutz Zustimmung
```

Recommended optional fields:

```txt
Telefon
Website / Shop
Verpackungsart
Ziel-Liefertermin
Notizen
```

---

## 11. Field Options

### 11.1 Branche

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

### 11.2 Interested Label Types

```txt
Opake PP-Etiketten
Transparente PP-Etiketten
Thermoetiketten
Thermo-Versandetiketten
Noch unsicher
```

### 11.3 Expected Quantity

```txt
1.000
5.000
10.000
20.000+
Noch unsicher
```

### 11.4 Recurring Need

```txt
Ja, regelmäßig
Vielleicht
Nein, einmalig
Noch unsicher
```

---

## 12. Sample Box Qualification Rules

A sample request should be prioritized if:

| Signal | Meaning |
|---|---|
| Germany-based | target market |
| B2B company | higher intent |
| food/beverage/supplement | target segment |
| 5,000+ likely quantity | stronger unit economics |
| repeat need | LTV potential |
| website/shop exists | real brand signal |
| material uncertainty | sample box useful |

Low priority if:

```txt
quantity under 1,000
private user
no company
non-target product
one-time request
no repeat need
```

---

## 13. Sample Box Lead Scoring

Suggested scoring:

| Signal | Points |
|---|---:|
| Germany-based company | +15 |
| Target industry | +20 |
| Quantity 5,000+ | +20 |
| Quantity 10,000+ | +25 |
| Repeat need | +20 |
| Website/shop provided | +10 |
| Material uncertainty | +5 |
| No company | -20 |
| Quantity below 1,000 | -20 |
| Non-target product | -20 |

Score labels:

```txt
0–29: Niedrig
30–59: Mittel
60–79: Gut
80–100: Hoch
```

---

## 14. Sample Box Status Pipeline

Required statuses:

```txt
NEW
QUALIFYING
APPROVED_FOR_SAMPLE
REJECTED_SAMPLE
SAMPLE_PAYMENT_PENDING
SAMPLE_PAID
SAMPLE_PREPARING
SAMPLE_SENT
FOLLOW_UP
QUOTE_REQUESTED
CONVERTED_TO_ORDER
LOST
```

German admin labels:

| Internal Status | German Label |
|---|---|
| NEW | Neu |
| QUALIFYING | In Prüfung |
| APPROVED_FOR_SAMPLE | Für Musterbox freigegeben |
| REJECTED_SAMPLE | Musterbox abgelehnt |
| SAMPLE_PAYMENT_PENDING | Musterbox-Zahlung offen |
| SAMPLE_PAID | Musterbox bezahlt |
| SAMPLE_PREPARING | Musterbox wird vorbereitet |
| SAMPLE_SENT | Musterbox versendet |
| FOLLOW_UP | Nachfassen |
| QUOTE_REQUESTED | Angebot angefragt |
| CONVERTED_TO_ORDER | In Bestellung umgewandelt |
| LOST | Verloren |

This can be implemented as Lead status plus type or a dedicated SampleBoxRequest model later.

---

## 15. Submission Flow

Customer flow:

```txt
Customer visits /de/musterbox
→ fills request form
→ accepts privacy notice
→ submits
→ server validates
→ creates Lead type SAMPLE_BOX_REQUEST
→ calculates lead score
→ shows German success message
→ optional email confirmation
→ admin reviews
```

Success message:

```txt
Vielen Dank. Wir prüfen Ihre Musterbox-Anfrage und melden uns mit dem nächsten Schritt.
```

---

## 16. Paid Sample Box Flow

If sample box is paid:

```txt
Customer fills sample box form
→ server creates sample box order or lead
→ server creates Stripe Checkout Session
→ customer pays
→ Stripe webhook confirms payment
→ status SAMPLE_PAID
→ admin prepares shipment
```

Rules:

1. Do not mark paid from success page.
2. Stripe webhook confirms payment.
3. Sample box order must be distinguishable from label order.
4. Customer-facing UI German.
5. Payment records stored.

---

## 17. Free Qualified Sample Flow

If sample box is free after qualification:

```txt
Customer submits request
→ admin reviews score
→ admin approves or rejects
→ admin ships sample box
→ follow-up after delivery
```

Rules:

1. Do not automatically send free sample box to all requests.
2. Admin approval required.
3. Track sample sent date.
4. Follow-up planned.
5. Convert to quote/order if interested.

---

## 18. Admin Sample Box Management

Admin should see sample requests in:

```txt
/admin/leads
```

or later:

```txt
/admin/sample-boxes
```

Admin list columns:

```txt
Datum
Firma
Kontakt
Branche
Menge
Score
Status
Nächste Aktion
```

Admin actions:

```txt
Als qualifiziert markieren
Musterbox freigeben
Musterbox ablehnen
Zahlungslink senden
Als bezahlt markieren if manual
Als vorbereitet markieren
Tracking hinzufügen
Als versendet markieren
Follow-up setzen
Angebot anfordern
In Bestellung umwandeln
```

---

## 19. Sample Box Shipping Data

If shipped, store:

```txt
carrier
trackingNumber
trackingUrl
shippedAt
estimatedDeliveryDate
shippingAddress
internalNote
```

Customer-facing German label:

```txt
Ihre Musterbox wurde versendet.
```

CTA:

```txt
Sendung verfolgen
```

---

## 20. Sample Box Follow-Up

Follow-up is where sample boxes create ROI.

Recommended follow-up after:

```txt
5–10 days after shipment
```

Follow-up question:

```txt
Welche Etiketten passen besser zu Ihrer Verpackung – opake PP-Etiketten oder transparente PP-Etiketten?
```

CTA:

```txt
B2B-Angebot anfordern
```

Do not spam.

Use controlled follow-up.

---

## 21. Sample Box Email Templates

If email is enabled:

### 21.1 Request Received

Subject:

```txt
Ihre Musterbox-Anfrage ist eingegangen
```

Body:

```txt
Vielen Dank für Ihre Anfrage. Wir prüfen, welche Muster für Ihren Etikettenbedarf sinnvoll sind, und melden uns mit dem nächsten Schritt.
```

### 21.2 Approved

Subject:

```txt
Ihre Labelpilot Musterbox wird vorbereitet
```

Body:

```txt
Ihre Musterbox-Anfrage wurde freigegeben. Wir bereiten die passenden Materialmuster vor.
```

### 21.3 Shipped

Subject:

```txt
Ihre Labelpilot Musterbox wurde versendet
```

Body:

```txt
Ihre Musterbox wurde versendet. Sie können die Sendung über den Tracking-Link verfolgen.
```

### 21.4 Follow-Up

Subject:

```txt
Welche Etiketten passen zu Ihrer Verpackung?
```

Body:

```txt
Haben Sie die Muster geprüft? Wir können Ihnen auf Basis Ihrer gewünschten Menge und Verpackung ein passendes B2B-Angebot für PP-Rollenetiketten erstellen.
```

---

## 22. Privacy Notice

Sample box form must include privacy checkbox:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Musterbox-Anfrage verwendet werden.
```

Marketing consent must be separate.

Do not add sample requesters to newsletter automatically.

---

## 23. Sample Box Page FAQ

Recommended FAQs:

```txt
Was ist in der Labelpilot Musterbox enthalten?
Für wen ist die Musterbox gedacht?
Ist die Musterbox kostenlos?
Kann ich danach ein B2B-Angebot anfordern?
Sind transparente und opake PP-Etiketten enthalten?
Kann ich die Musterbox für Supplement-Etiketten nutzen?
```

If free/paid status not finalized, use flexible wording:

```txt
Je nach Anfrage kann die Musterbox kostenpflichtig oder für qualifizierte B2B-Anfragen freigegeben werden.
```

---

## 24. Internal Links

Sample box page must link to:

```txt
/de/angebot-anfordern
/de/druckdaten
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/produktion-versand
/de/datenschutz
```

Product/industry pages must link back to:

```txt
/de/musterbox
```

---

## 25. Sample Box Metrics

Track:

```txt
sample_box_page_view
sample_box_form_start
sample_box_form_submit
sample_box_approved
sample_box_rejected
sample_box_paid
sample_box_sent
sample_box_followup_sent
sample_box_quote_requested
sample_box_converted_to_order
```

Business KPIs:

```txt
Sample request count
Qualified sample request rate
Sample approval rate
Sample-to-quote rate
Sample-to-order rate
Cost per sample
Revenue from sample-assisted orders
Average order value after sample
Reorder rate of sample customers
```

---

## 26. Sample Box Unit Economics

Sample box must be judged by conversion.

Do not only look at number of requests.

If sample box costs money to prepare/ship, it must lead to:

```txt
quote requests
first paid orders
5,000+ label packages
repeat orders
```

If sample-to-order rate is weak, tighten qualification.

---

## 27. Acceptance Criteria

Sample box flow is accepted when:

| Check | Required Result |
|---|---|
| `/de/musterbox` exists | PASS |
| Page content German | PASS |
| Sample contents explained | PASS |
| Request form exists | PASS |
| Privacy checkbox exists | PASS |
| Required fields validated | PASS |
| Lead created as SAMPLE_BOX_REQUEST | PASS |
| Lead score calculated | PASS |
| Admin can review sample request | PASS |
| Admin can approve/reject | PASS |
| Status can move to sent | PASS |
| Follow-up path exists | PASS |
| No automatic free sample to everyone | PASS |
| No English customer UI | PASS |

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

1. Visit `/de/musterbox`.
2. Submit empty form.
3. Submit invalid email.
4. Submit valid B2B request.
5. Confirm German success message.
6. Confirm lead created.
7. Confirm lead score.
8. Open admin lead detail.
9. Approve sample request.
10. Reject sample request.
11. Mark sample sent.
12. Add tracking if implemented.
13. Confirm privacy checkbox required.
14. Check no English visible UI.

---

## 29. Common Mistakes to Avoid

Do not:

1. Send free samples to everyone.
2. Treat sample box as generic giveaway.
3. Skip company/quantity fields.
4. Skip lead scoring.
5. Forget follow-up.
6. Use English UI.
7. Hide pricing/qualification uncertainty.
8. Forget privacy checkbox.
9. Let sample box dominate main product positioning.
10. Ignore sample cost.
11. Forget conversion tracking.
12. Send marketing emails without consent.

---

## 30. Codex Implementation Rules

Codex must:

1. Use German customer copy.
2. Store sample box requests as leads.
3. Validate form server-side.
4. Score/qualify requests.
5. Add admin review.
6. Avoid automatic free sample sending.
7. Support paid sample flow only through Stripe webhook if implemented.
8. Link sample flow to quote/order flow.
9. Report missing email/payment dependencies honestly.

---

## 31. Final Verdict

The sample box is not a gift.

The correct implementation:

> Qualified B2B sample request → admin approval or paid sample → shipment → follow-up → quote/order.

The wrong implementation:

> Free samples for everyone.

Sample boxes must reduce trust friction and create paid B2B orders.
