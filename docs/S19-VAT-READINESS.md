# S19 — VAT / Invoicing Readiness Note

**Track:** P6 — Sellability  
**Status:** Draft  
**Last updated:** 2026-06-07

---

## 1. Current Legal Entity Status

| Field | Value |
|---|---|
| Legal entity | Zhenkai Global Trading Limited |
| Jurisdiction | Hong Kong (HK) |
| EU VAT-ID | None — not registered |
| German Umsatzsteuer-ID | None — not registered |
| Status as of | 2026-06-07 |

This is the correct and intentional status. No EU VAT-ID exists; none is expected at this stage.

---

## 2. What This Means for Invoicing

### 2.1 No EU VAT charged

Because the entity has no EU or German VAT registration, Labelpilot.de does **not** collect or remit German Umsatzsteuer (USt.) at the point of sale under the current structure.

### 2.2 Impressum / Steuerlicher Hinweis

The Impressum already contains the correct disclosure:

> **Steuerlicher Hinweis:** Keine Umsatzsteuer-Identifikationsnummer (USt-IdNr.) vorhanden.

This line must remain in the Impressum as long as the entity has no EU VAT-ID. Do not remove it.

### 2.3 Invoice line items

If any invoice stub or receipt is generated, it must:

- Show the gross amount paid.
- Not display a VAT line or a VAT percentage.
- Include the notice: "Gemäß § … keine USt ausgewiesen" or a plain statement that no VAT is included, referencing the HK entity's non-EU status.

Do not auto-generate invoices that show a `0% MwSt.` or `19% MwSt.` line until the VAT situation has been reviewed by an accountant or the founder has made an explicit decision.

---

## 3. Rechnungskauf (Net-14 Invoice Payment)

Rechnungskauf (pay by invoice with 14-day payment term) is **not available in the self-serve checkout**.

- Reason: credit risk and manual reconciliation overhead; no automated dunning system in place.
- Activation path: founder must explicitly decide to enable it, set up manual approval workflow, and integrate a dunning/reminder mechanism before Rechnungskauf is offered to any customer.
- Current checkout: only Stripe card payment (and optionally Stripe-hosted SEPA Debit if activated in the Stripe product settings). No "Rechnung" option in the payment method list.

---

## 4. Founder Decision Required Before Automated Invoice Generation

Before any code that auto-generates a PDF invoice on payment is shipped, the following questions must be answered by the founder:

| # | Question | Decision needed |
|---|---|---|
| 4.1 | Will a German tax advisor or EU VAT registration be obtained? | Yes / No / Timeline |
| 4.2 | Should invoices be issued at all (some HK-only operations do not issue DE-format invoices)? | Yes / No |
| 4.3 | What should the invoice template look like given no USt-IdNr.? | Approve template |
| 4.4 | Is Rechnungskauf in scope for the first 100 customers? | Yes / No |
| 4.5 | Which tool for invoice PDF generation (e.g. custom, Stripe Invoicing, Lexoffice)? | Tool decision |

Until these decisions are made, the invoice generation feature must remain gated (behind a feature flag or simply not deployed).

---

## 5. Gated Invoice Stub

A placeholder invoice generation module exists (or is to be scaffolded) that:

- Is not reachable from any customer-facing URL.
- Is toggled off via a `FEATURE_INVOICES_ENABLED=false` ENV var (or equivalent).
- Can be activated by setting `FEATURE_INVOICES_ENABLED=true` once the founder decisions in §4 are resolved.

If the stub does not yet exist, create it as a no-op module before shipping any payment flow, so the flag surface is established.

---

## 6. Next Steps

1. Founder reviews §4 questions and records decisions in this file (or a linked decision log).
2. If EU VAT registration is pursued: engage a DE/EU tax advisor; timeline is typically 4–12 weeks.
3. If invoice generation is approved: design the invoice template compliant with §14 UStG (or the HK-entity equivalent), get it reviewed, then enable the feature flag.
4. Update this document whenever the entity status or tax position changes.

---

*See also: `S17-SELLABILITY-TEST-CHECKLIST.md`, `S18-STRIPE-TEST-READINESS.md`*
