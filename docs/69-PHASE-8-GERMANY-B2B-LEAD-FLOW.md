# 69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md

# Labelpilot.de — Phase 8 Germany B2B Lead Flow

## 1. Purpose

This document defines **Phase 8 Germany B2B Lead Flow** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Phase 8 exists to turn the website from a passive ordering platform into an active B2B lead generation and sales system.

The goal is to acquire qualified German B2B customers in:

- Food brands
- Beverage brands
- Supplement brands
- Coffee brands
- Tea brands
- Spice brands
- Honey and jam producers
- Small D2C packaged goods brands
- Shopify/Etsy/Amazon micro brands with recurring label needs

This phase must create a repeatable system for:

1. Capturing inbound leads.
2. Qualifying leads.
3. Offering sample boxes.
4. Converting quote requests.
5. Supporting outbound prospecting.
6. Moving leads toward first order.
7. Moving first orders toward reorder behavior.

---

## 2. Phase 8 Verdict

The correct Phase 8 is:

> German B2B lead system: quote request + sample box + targeted outreach + lead qualification + first-order conversion + reorder follow-up.

The wrong Phase 8 is:

> Random contact form, unqualified leads, generic newsletter and no sales process.

Labelpilot.de must not wait passively for orders.

It must actively build a German B2B customer pipeline.

---

## 3. Required Source Documents

Before implementing Phase 8, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/01-BUSINESS-MODEL.md
/docs/03-PRODUCT-STRATEGY.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/20-SEO-STRATEGY-2026.md
/docs/21-GEO-AI-SEARCH-STRATEGY.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/62-PHASE-1-MVP.md
/docs/63-PHASE-2-SEO-FOUNDATION.md
/docs/68-PHASE-7-GEO-CONTENT-ENGINE.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Phase 8 Language Rule

All customer-facing lead forms, email copy, CTA copy and page text must be German.

Allowed German CTA examples:

```txt
Angebot anfordern
Musterbox anfordern
Etikettenbedarf besprechen
Druckdaten später senden
Kostenlose Ersteinschätzung anfragen
B2B-Anfrage senden
```

Not allowed in MVP:

```txt
Request quote
Book a call
Get sample
Submit lead
Talk to sales
```

Internal database field names may remain English.

---

## 5. Phase 8 Scope

Phase 8 must implement:

1. Improved quote request flow.
2. Sample box lead flow.
3. B2B lead qualification fields.
4. Lead source tracking.
5. Lead status pipeline.
6. Admin lead list.
7. Admin lead detail.
8. Lead notes.
9. Lead conversion to quote/order.
10. German email templates for lead confirmation.
11. Outbound lead import structure.
12. Basic lead scoring.
13. Industry-specific lead forms.
14. Post-lead next-step CTAs.
15. Reorder-oriented lead follow-up logic.

---

## 6. Phase 8 Non-Scope

Do not implement in Phase 8 unless explicitly requested:

```txt
full CRM replacement
automated cold email blasting
scraping without compliance review
LinkedIn automation
large-scale spam campaigns
complex sales commission system
AI-generated fake personalization
auto-buying lead lists
phone dialer
WhatsApp automation for Germany without consent review
advanced marketing attribution platform
```

Phase 8 is a controlled B2B lead workflow, not a spam machine.

---

## 7. Core Lead Types

The system must support these lead types:

```txt
QUOTE_REQUEST
SAMPLE_BOX_REQUEST
CONTACT_REQUEST
OUTBOUND_PROSPECT
REORDER_INTEREST
BULK_ORDER_INTEREST
```

### 7.1 Quote Request

High-intent lead asking for price or custom quantity.

### 7.2 Sample Box Request

Trust-building lead that wants material samples.

### 7.3 Contact Request

General inquiry.

### 7.4 Outbound Prospect

Company identified by Labelpilot.de as a potential target.

### 7.5 Reorder Interest

Existing or prior customer showing future repeat need.

### 7.6 Bulk Order Interest

Lead interested in 20,000+ labels or recurring production.

---

## 8. Lead Status Pipeline

Required lead statuses:

```txt
NEW
QUALIFYING
QUALIFIED
SAMPLE_SENT
QUOTE_NEEDED
QUOTE_SENT
FOLLOW_UP
WON
LOST
DISQUALIFIED
```

Status meanings:

| Status | Meaning |
|---|---|
| NEW | Lead received but not reviewed |
| QUALIFYING | Admin/sales reviewing lead |
| QUALIFIED | Lead fits target customer profile |
| SAMPLE_SENT | Sample box sent or planned |
| QUOTE_NEEDED | Quote must be prepared |
| QUOTE_SENT | Offer sent to customer |
| FOLLOW_UP | Waiting for response |
| WON | Converted to order/customer |
| LOST | Opportunity lost |
| DISQUALIFIED | Not a fit |

---

## 9. Lead Qualification Criteria

A lead is qualified if it matches most of these:

| Criterion | Good Signal |
|---|---|
| Country | Germany |
| Business type | Food, beverage, supplement, coffee, spice, honey/jam |
| Quantity need | 5,000+ labels |
| Repeat potential | Yes |
| Packaging product | Bottle, jar, pouch, tin, container |
| Has brand/product | Yes |
| Needs PP labels | Yes |
| Needs sample | Maybe |
| Price-only shopper | No |
| Same-day delivery need | No |

Leads that only need 100–250 one-time stickers are low value.

---

## 10. Lead Score Model

Create simple lead scoring.

Suggested score range:

```txt
0–100
```

Scoring:

| Signal | Points |
|---|---:|
| Germany-based company | +15 |
| Food/beverage/supplement industry | +20 |
| Quantity 5,000+ | +20 |
| Quantity 10,000+ | +25 |
| Repeat need stated | +20 |
| Has website/shop | +10 |
| Uploads artwork | +10 |
| Requests sample box | +5 |
| Only asks for cheapest price | -15 |
| Quantity below 1,000 | -20 |
| Same-day urgent need | -20 |
| Non-target product request | -20 |

Lead quality labels:

```txt
0–29: Low
30–59: Medium
60–79: Good
80–100: High
```

Do not overcomplicate scoring in MVP.

---

## 11. Quote Request Form

Route:

```txt
/de/angebot-anfordern
```

Required fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Telefon
Land
Website / Shop
Branche
Produkttyp
Etikettengröße
Material
Menge
Wiederkehrender Bedarf
Ziel-Liefertermin
Druckdatei vorhanden?
Notizen
```

German options:

### Branche

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

### Material

```txt
Opakes PP
Transparentes PP
Thermoetikett
Noch unsicher
```

### Menge

```txt
1.000
5.000
10.000
20.000+
Noch unsicher
```

### Wiederkehrender Bedarf

```txt
Ja, regelmäßig
Vielleicht
Nein, einmalig
```

---

## 12. Sample Box Form

Route:

```txt
/de/musterbox
```

Sample box form fields:

```txt
Firmenname
Ansprechpartner
E-Mail
Telefon
Land
Website / Shop
Branche
Welche Etiketten interessieren Sie?
Voraussichtliche Menge
Wann benötigen Sie Etiketten?
Lieferadresse
Notizen
```

The sample box should not be sent blindly to every low-quality lead.

Use lead scoring.

German message after submission:

```txt
Vielen Dank. Wir prüfen Ihre Anfrage und melden uns mit dem nächsten Schritt zur Musterbox.
```

---

## 13. Contact Form

Route:

```txt
/de/kontakt
```

Contact form fields:

```txt
Name
Firma
E-Mail
Telefon optional
Nachricht
Anfragetyp
```

Anfragetyp options:

```txt
Produktfrage
Angebot
Musterbox
Nachbestellung
Druckdaten
Versand
Andere Frage
```

Contact leads should enter pipeline as `CONTACT_REQUEST`.

---

## 14. Lead Source Tracking

Every lead must store source data where available.

Fields:

```txt
sourceType
sourcePage
utmSource
utmMedium
utmCampaign
utmTerm
utmContent
referrer
landingPage
createdAt
```

Source types:

```txt
SEO
GEO_AI_SEARCH
GOOGLE_ADS
META_ADS
OUTBOUND
DIRECT
REFERRAL
UNKNOWN
```

This helps evaluate which pages and campaigns generate qualified B2B leads.

---

## 15. Lead Database Model

Suggested model:

```txt
Lead
- id
- type
- status
- score
- quality
- companyName
- contactName
- email
- phone
- country
- website
- industry
- productType
- labelSize
- material
- quantity
- recurringNeed
- targetDeliveryDate
- hasArtwork
- notes
- sourceType
- sourcePage
- utmSource
- utmMedium
- utmCampaign
- utmTerm
- utmContent
- referrer
- assignedToUserId
- convertedCustomerId
- convertedOrderId
- createdAt
- updatedAt
```

Suggested related model:

```txt
LeadNote
- id
- leadId
- adminUserId
- note
- noteType
- createdAt
```

---

## 16. Admin Lead List

Route:

```txt
/admin/leads
```

Lead list columns:

```txt
Datum
Typ
Status
Score
Firma
Ansprechpartner
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
Menge
Zeitraum
```

Search:

```txt
Firma
E-Mail
Website
Ansprechpartner
```

---

## 17. Admin Lead Detail

Route:

```txt
/admin/leads/[leadId]
```

Lead detail must show:

1. Company info.
2. Contact info.
3. Request details.
4. Product interest.
5. Quantity.
6. Recurring need.
7. Source/UTM.
8. Lead score.
9. Lead notes.
10. Status changes.
11. Related quote/order/customer if converted.
12. Actions.

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

## 18. Lead Conversion Logic

Lead can convert into:

```txt
Customer
QuoteRequest
Order
```

Conversion examples:

### Quote lead to quote request

```txt
Lead status QUALIFIED
→ create QuoteRequest
→ lead status QUOTE_NEEDED
```

### Quote sent

```txt
QuoteRequest created/sent
→ lead status QUOTE_SENT
```

### Won

```txt
Customer accepts quote or pays order
→ lead status WON
→ convertedOrderId stored
```

### Sample to quote

```txt
Sample box request
→ sample sent
→ follow-up
→ quote request
```

---

## 19. Follow-Up Tasks

Phase 8 may implement basic follow-up date.

Suggested fields:

```txt
nextFollowUpAt
followUpReason
```

German follow-up reasons:

```txt
Musterbox nachfassen
Angebot nachfassen
Druckdaten anfragen
Menge klären
Liefertermin klären
```

Do not overbuild full task system unless needed.

---

## 20. German Lead Emails

If email system exists, implement these German emails.

### 20.1 Quote Request Received

Subject:

```txt
Ihre Anfrage ist eingegangen – Labelpilot.de
```

Body:

```txt
Vielen Dank für Ihre Anfrage. Wir prüfen Ihre Angaben und melden uns mit dem nächsten Schritt für Ihr Etikettenangebot.
```

### 20.2 Sample Box Request Received

Subject:

```txt
Ihre Musterbox-Anfrage ist eingegangen
```

Body:

```txt
Vielen Dank für Ihre Anfrage. Wir prüfen, welche Muster für Ihren Etikettenbedarf sinnvoll sind, und melden uns mit dem nächsten Schritt.
```

### 20.3 Follow-Up After Sample

Subject:

```txt
Welche Etiketten passen zu Ihrem Produkt?
```

Body:

```txt
Haben Sie die Muster geprüft? Wir können Ihnen auf Basis Ihrer gewünschten Menge und Verpackung ein passendes Angebot für PP-Rollenetiketten erstellen.
```

Do not send spammy automated emails.

---

## 21. Outbound Prospect Structure

Phase 8 can prepare outbound prospect records.

Outbound prospects are not customers yet.

Suggested fields:

```txt
companyName
website
industry
country
contactEmail
contactName
source
productFit
estimatedLabelNeed
status
notes
```

Outbound statuses:

```txt
IDENTIFIED
CONTACTED
REPLIED
QUALIFIED
NOT_INTERESTED
BAD_FIT
CONVERTED
```

Do not implement mass sending unless compliance is reviewed.

---

## 22. Outbound Target Criteria

Good outbound targets:

1. German website.
2. Physical packaged product.
3. Food/beverage/supplement category.
4. Small brand, not huge enterprise.
5. Has product labels visible.
6. Likely repeat label need.
7. Sells through Shopify/Etsy/Amazon/local retail.
8. Contact information available.
9. Not purely private hobby project.

Bad targets:

1. No product packaging.
2. Service business.
3. Large enterprise with procurement complexity.
4. One-time event product.
5. Non-Germany unless expansion phase.
6. No repeat label need.

---

## 23. Outbound Message Principles

Messages must be German, specific and low-pressure.

Do not write spammy generic messages.

Good angle:

```txt
Wir helfen kleinen Lebensmittel- und Supplement-Marken dabei, PP-Rollenetiketten mit gespeicherten Druckdaten einfacher nachzubestellen.
```

Avoid:

```txt
We are the best and cheapest label printer.
```

Outbound email templates should be created later as separate docs if needed.

---

## 24. Lead Capture CTAs

Use these CTAs across site:

```txt
Angebot anfordern
Musterbox anfordern
Etikettenbedarf besprechen
Druckdaten später senden
Nachbestellung planen
```

Do not use vague CTA:

```txt
Mehr erfahren
```

unless secondary.

---

## 25. Lead Flow From SEO Pages

Every commercial SEO page should push to:

1. Quote request
2. Sample box
3. Product configuration
4. Reorder page if existing customer

Example:

Supplement page CTA section:

```txt
Benötigen Sie Supplement-Etiketten für Dosen, Beutel oder Flaschen?
Fordern Sie ein B2B-Angebot an oder bestellen Sie zuerst eine Musterbox.
```

Buttons:

```txt
Angebot anfordern
Musterbox anfordern
```

---

## 26. Lead Flow From GEO Content Pages

GEO/guide pages should not end passively.

They must end with:

1. Relevant product link.
2. Quote CTA.
3. Sample CTA.
4. Reorder CTA if topic relevant.

Example from PP vs Paper guide:

```txt
Wenn Sie PP-Rollenetiketten für Lebensmittel-, Getränke- oder Supplement-Verpackungen benötigen, können Sie bei Labelpilot.de ein B2B-Angebot anfordern.
```

CTA:

```txt
B2B-Angebot anfordern
```

---

## 27. Sample Box Qualification Rule

Sample box should be prioritized for leads with:

```txt
Germany-based
B2B brand
target industry
5,000+ likely quantity
repeat potential
valid website/shop
```

Low-quality sample requests should not consume too much budget.

Admin can mark:

```txt
APPROVED_FOR_SAMPLE
REJECTED_SAMPLE
NEEDS_INFO
```

---

## 28. Lead Metrics

Track:

```txt
quote_form_view
quote_form_submit
sample_form_view
sample_form_submit
contact_form_submit
lead_created
lead_qualified
sample_sent
quote_sent
lead_won
lead_lost
```

Business KPIs:

```txt
Lead volume
Qualified lead rate
Quote request rate
Sample-to-quote rate
Quote-to-order rate
Average lead score
Average time to follow-up
B2B order conversion rate
Cost per qualified lead
Revenue per lead source
```

---

## 29. Admin Lead Dashboard

Admin dashboard should show:

```txt
Neue Leads
Qualifizierte Leads
Musterbox-Anfragen
Offene Angebote
Follow-ups heute
Gewonnene Leads
Verlorene Leads
```

Do not build advanced charts unless core tables work.

---

## 30. Privacy and Compliance

Lead forms must support GDPR basics.

Required:

1. Privacy policy link.
2. Consent checkbox if needed.
3. Clear reason for data collection.
4. No hidden marketing consent.
5. Do not add people to newsletter automatically.
6. Store only needed data.
7. Allow deletion/export later if required.

German checkbox example:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
```

Marketing consent must be separate if used.

---

## 31. Phase 8 Acceptance Criteria

Phase 8 is accepted when:

| Check | Required Result |
|---|---|
| Quote form creates lead | PASS |
| Sample box form creates lead | PASS |
| Contact form creates lead | PASS |
| Lead source is stored | PASS |
| Lead score calculated | PASS |
| Admin lead list exists | PASS |
| Admin lead detail exists | PASS |
| Lead status can be changed | PASS |
| Lead notes can be added | PASS |
| Lead can convert to quote/customer/order path | PASS |
| German customer-facing copy | PASS |
| GDPR/privacy checkbox exists where needed | PASS |
| Low-quality leads can be disqualified | PASS |
| Sample box requests can be qualified | PASS |

---

## 32. Phase 8 Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Submit quote form.
2. Submit sample box form.
3. Submit contact form.
4. Check lead source capture.
5. Check lead score.
6. View admin lead list.
7. Open lead detail.
8. Change lead status.
9. Add lead note.
10. Mark lead qualified.
11. Mark sample sent.
12. Convert lead to quote/order if implemented.
13. Confirm German UI text.
14. Confirm privacy checkbox.
15. Confirm low-quality lead can be disqualified.

---

## 33. Phase 8 PASS/FAIL Report Format

Codex must report:

```txt
## Summary
- What changed

## Lead Flows Implemented
- quote
- sample box
- contact
- outbound prospect if included

## Files Changed
- path

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended next phase/task
```

---

## 34. Common Phase 8 Mistakes to Avoid

Do not:

1. Build only a generic contact form.
2. Skip lead qualification.
3. Send free sample boxes to everyone.
4. Ignore source tracking.
5. Use English customer copy.
6. Add people to newsletter without consent.
7. Build spam automation.
8. Treat every lead as equal.
9. Forget industry/quantity fields.
10. Forget repeat potential.
11. Build analytics before lead tables work.
12. Create unqualified outreach lists.

---

## 35. Phase 8 Final Verdict

Phase 8 must turn Labelpilot.de into a German B2B lead machine.

The correct implementation:

> Quote flow + sample box flow + lead scoring + admin pipeline + targeted follow-up + conversion toward first order and reorder.

The wrong implementation:

> Passive contact form and no sales process.

The business will not reach serious revenue without a disciplined B2B lead flow.
