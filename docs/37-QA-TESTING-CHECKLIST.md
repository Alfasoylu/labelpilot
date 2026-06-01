# 37-QA-TESTING-CHECKLIST.md

# Labelpilot.de — QA and Testing Checklist

## 1. Purpose

This document defines QA and testing requirements for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Testing must protect:

- payments
- private files
- proof approvals
- admin operations
- customer ownership
- SEO indexability
- German-only customer UI
- reorder integrity
- quote/sample lead capture

A broken MVP can lose money and trust fast.

---

## 2. Strategic Verdict

The correct QA system is:

> Test the revenue path, payment safety, file privacy, admin transitions, customer ownership, SEO basics and German UI before every release.

The wrong QA system is:

> Deploy because the homepage looks good.

Function beats decoration.

---

## 3. Core Commands

Codex must run available commands:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

If a command does not exist, Codex must say so.

Do not claim tests passed if they were not run.

---

## 4. Public Website QA

Check:

```txt
/de loads
P0 pages load
navigation works
footer links work
metadata exists
canonical correct
German UI only
mobile layout works
no lorem ipsum
no English CTAs
```

P0 pages:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/pp-rollenetiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
```

---

## 5. SEO QA

Check:

```txt
/sitemap.xml loads
/robots.txt loads
P0 pages in sitemap
admin/konto/checkout excluded
canonical URLs use labelpilot.de
metadata German
schema valid
FAQ schema matches visible FAQ
no private routes indexed
```

---

## 6. Quote Flow QA

Test:

```txt
empty form validation
invalid email
valid quote submission
privacy checkbox required
database record created
admin quote list shows request
status update works
German success message
```

---

## 7. Sample Box QA

Test:

```txt
sample page loads
form validation
valid request creates lead
lead score calculated
admin can approve/reject
sample status update works
privacy checkbox required
German success message
```

---

## 8. Stripe QA

Test:

```txt
server calculates price
client cannot alter price
pending order created
Stripe Checkout opens
success page does not mark paid
webhook verifies signature
webhook marks paid
duplicate webhook idempotent
failed payment not paid
20,000+ quantity goes quote
```

Never skip webhook testing.

---

## 9. File Upload QA

Test:

```txt
valid PDF upload
invalid file type rejected
oversized file rejected
file metadata stored
file private
signed download works
customer cannot access other file
admin can download
admin can request correction
replacement upload works
```

---

## 10. Proof QA

Test:

```txt
admin uploads proof
proof private
customer sees proof
customer approves proof
approval logged
customer requests changes
production blocked before approval
production allowed after approval/admin action
```

---

## 11. Admin QA

Test:

```txt
/admin logged out blocked
customer blocked from admin
admin can access
order list works
order detail works
status transitions valid
invalid transitions blocked
admin notes hidden from customer
tracking can be added
lead/quote lists work
```

---

## 12. Customer Portal QA

Test:

```txt
customer login
view own order
cannot view other order
upload own file
approve own proof
start own reorder
cannot reorder other order
no admin notes visible
account pages noindex
German UI
```

---

## 13. Reorder QA

Test:

```txt
completed order shows reorder
non-eligible order blocked
reorder creates new order
original order unchanged
previous artwork referenced
quantity change works
20,000+ goes quote
minor change note stored
Stripe metadata includes originalOrderId
production gate not bypassed
```

---

## 14. Security QA

Check:

```txt
no secrets in client
no .env committed
admin routes server-protected
customer ownership enforced
private files not public
Stripe webhook signature verified
no raw storage paths exposed
no internal costs shown to customer
```

---

## 15. German UI QA

Check all customer-facing areas:

```txt
public pages
forms
checkout
emails
customer portal
error messages
success messages
upload/proof UI
```

Must be German.

No English CTAs.

---

## 16. Legal QA

Check:

```txt
impressum exists
datenschutz exists
agb exists
versand exists
widerruf exists
footer links legal pages
compliance disclaimer on regulated pages
no legal overclaims
privacy checkbox on forms
custom product notice in checkout if implemented
```

Legal text still requires professional review.

---

## 17. Release PASS/FAIL Format

Codex must report:

```txt
## Summary
- What changed

## Commands Run
- command: result

## Manual QA
| Check | Result | Notes |
|---|---|---|

## Failed / Skipped
- item

## Risks
- item

## Next Step
- item
```

No fake PASS.

---

## 18. Blocker Criteria

Do not ship if:

```txt
payment can be faked
webhook not verified
customer can access another customer file
admin accessible by customer
private files public
P0 pages broken
checkout broken
English customer UI appears widely
production can start before approval
```

These are blockers.

---

## 19. Acceptance Criteria

QA system is accepted when:

| Check | Required Result |
|---|---|
| Command checklist defined | PASS |
| Public QA defined | PASS |
| SEO QA defined | PASS |
| Stripe QA defined | PASS |
| File QA defined | PASS |
| Proof QA defined | PASS |
| Admin QA defined | PASS |
| Customer QA defined | PASS |
| Reorder QA defined | PASS |
| Blockers defined | PASS |

---

## 20. Final Verdict

Testing is revenue protection.

The correct behavior:

> Test the money path, private file path, admin path and reorder path before shipping.

The wrong behavior:

> Ship because the design looks finished.

Labelpilot.de’s risk is not lack of pages. The risk is broken operations.
