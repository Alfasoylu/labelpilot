# 41-STRIPE-TEST-PLAN.md

# Labelpilot.de — Stripe Test Plan

## 1. Purpose

This document defines Stripe testing requirements for **Labelpilot.de**.

Stripe handles real money.

A broken Stripe flow can create unpaid production, duplicate payments, wrong order status or customer disputes.

This plan must be used before enabling paid checkout.

---

## 2. Strategic Verdict

The correct Stripe implementation is:

> Server-calculated price, pending order, Stripe Checkout, verified webhook, idempotent payment update, no production until file/proof approval.

The wrong implementation is:

> Success page marks order paid.

This is non-negotiable.

---

## 3. Required Docs

Before Stripe implementation/testing, read:

```txt
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
/docs/41-STRIPE-TEST-PLAN.md
```

---

## 4. Environment Requirements

Local/test:

```txt
STRIPE_SECRET_KEY=test key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=test key
STRIPE_WEBHOOK_SECRET=local stripe cli secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Production:

```txt
live keys only in production
production webhook secret from Stripe dashboard
NEXT_PUBLIC_APP_URL=https://labelpilot.de
```

Do not mix test and live keys.

---

## 5. Checkout Creation Tests

Test valid products:

```txt
pp-opaque-100x200 / 1000
pp-opaque-100x200 / 5000
pp-opaque-100x200 / 10000
pp-transparent-100x200 / 5000
```

Expected:

```txt
pending order created
server calculates price
Stripe Checkout Session created
metadata includes orderId
customer redirected to Stripe
```

---

## 6. Invalid Checkout Tests

Test:

```txt
invalid productId
invalid quantity
20,000+ quantity
browser price tampering
missing email
unsupported material
```

Expected:

```txt
server rejects request
no paid order created
20,000+ goes quote flow
German error message
```

---

## 7. Stripe Success Page Test

After test payment success:

Expected:

```txt
success page loads
German message shown
success page does not mark order paid
status depends on webhook
no production started
```

Success message:

```txt
Vielen Dank. Ihre Zahlung wird bestätigt. Sobald die Zahlung im System bestätigt wurde, prüfen wir Ihre Druckdaten und informieren Sie über den nächsten Schritt.
```

---

## 8. Webhook Test

Use Stripe CLI:

```txt
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Test:

```txt
checkout.session.completed
payment_intent.payment_failed
```

Expected:

```txt
signature verified
StripeEvent stored
Payment stored/updated
Order PENDING_PAYMENT → PAID
OrderStatusEvent created
duplicate event ignored
```

---

## 9. Idempotency Test

Send duplicate webhook.

Expected:

```txt
no duplicate payment
no duplicate status event
returns 200
order remains correct
```

---

## 10. Failed Payment Test

Use Stripe failed card.

Expected:

```txt
payment status FAILED
order not PAID
no production
German error if visible
```

---

## 11. Security Tests

Check:

```txt
STRIPE_SECRET_KEY not in client bundle
STRIPE_WEBHOOK_SECRET not exposed
client price ignored
success page cannot mark paid
webhook requires signature
```

---

## 12. Production Gate Test

Even after paid:

Forbidden:

```txt
PAID → IN_PRODUCTION automatically
PAID → SHIPPED automatically
```

Expected:

```txt
paid order waits for file/proof/admin workflow
```

---

## 13. Test Cards

Use Stripe official test cards.

Do not use real card in test environment.

Common:

```txt
success card
declined card
authentication required card
```

Codex should reference Stripe docs if exact card numbers are needed.

---

## 14. Acceptance Criteria

Stripe is accepted when:

| Check | Required Result |
|---|---|
| Server calculates price | PASS |
| Client price tampering blocked | PASS |
| Checkout session created | PASS |
| Pending order created | PASS |
| Webhook signature verified | PASS |
| Webhook marks paid | PASS |
| Success page does not mark paid | PASS |
| Duplicate webhook safe | PASS |
| Failed payment not paid | PASS |
| 20,000+ quote only | PASS |
| No automatic production | PASS |
| Secrets not exposed | PASS |

---

## 15. Final Verdict

Stripe is a money gate.

Do not launch paid checkout until webhook and idempotency are proven.

Payment safety beats speed.
