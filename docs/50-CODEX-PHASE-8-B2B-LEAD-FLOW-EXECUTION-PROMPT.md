# Canonical phase = 3 (per doc 74).

# 50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 8 B2B Lead Flow Execution Prompt

## 1. Mission

Implement Germany B2B lead flow for **Labelpilot.de**.

Goal:

```txt
quote leads
sample box leads
contact leads
lead scoring
lead source tracking
admin lead list/detail
lead status pipeline
lead notes
conversion path to quote/order
```

This is not a generic contact form.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/12-DATABASE-SCHEMA.md
/docs/31-QUOTE-REQUEST-FLOW.md
/docs/32-SAMPLE-BOX-FLOW.md
/docs/35-ANALYTICS-KPI-DASHBOARD.md
/docs/69-PHASE-8-GERMANY-B2B-LEAD-FLOW.md
/docs/50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. Customer-facing forms German.
2. Store leads in database.
3. Capture source/UTM/referrer/landing page.
4. Score leads simply.
5. Privacy checkbox required.
6. Do not add newsletter consent silently.
7. Admin can qualify/disqualify.
8. Sample boxes not automatically free for everyone.
9. Leads can convert to quote/order path.
10. No spam automation.

---

## 4. Lead Types

Implement:

```txt
QUOTE_REQUEST
SAMPLE_BOX_REQUEST
CONTACT_REQUEST
OUTBOUND_PROSPECT
REORDER_INTEREST
BULK_ORDER_INTEREST
```

---

## 5. Lead Statuses

Implement:

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

---

## 6. Required Forms

Quote form:

```txt
/de/angebot-anfordern
```

Sample box form:

```txt
/de/musterbox
```

Contact form:

```txt
/de/kontakt
```

All forms create Lead records.

Quote form may also create QuoteRequest.

---

## 7. Lead Score

Implement simple score 0–100.

Positive signals:

```txt
Germany
target industry
5,000+
10,000+
repeat need
website/shop
artwork available
sample request
```

Negative signals:

```txt
below 1,000
no company
non-target product
price-only
same-day urgent
```

Quality labels:

```txt
Low
Medium
Good
High
```

Admin UI may show German labels:

```txt
Niedrig
Mittel
Gut
Hoch
```

---

## 8. Admin Routes

Create/update:

```txt
/admin/leads
/admin/leads/[leadId]
```

List columns:

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

## 9. Source Tracking

Capture:

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
```

This is mandatory for growth decisions.

---

## 10. Privacy

German checkbox:

```txt
Ich habe die Datenschutzerklärung gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
```

Marketing consent must be separate.

---

## 11. Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual:

```txt
submit quote form
submit sample form
submit contact form
validate required fields
privacy checkbox required
lead created
lead score calculated
source captured
admin lead list works
admin lead detail works
status update works
lead note works
disqualify works
```

---

## 12. Report

Return:

```txt
## Summary
## Forms Implemented
## Lead Scoring
## Admin Lead Flow
## Source Tracking
## Checks Run
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 13. Acceptance Criteria

| Check | Required |
|---|---|
| Quote creates lead | PASS |
| Sample creates lead | PASS |
| Contact creates lead | PASS |
| Lead score calculated | PASS |
| Source captured | PASS |
| Admin list/detail | PASS |
| Status updates | PASS |
| Notes | PASS |
| Privacy checkbox | PASS |
| German UI | PASS |

---

## 14. Final Instruction

Build a lead pipeline that can sell.

Traffic without lead qualification is worthless.
