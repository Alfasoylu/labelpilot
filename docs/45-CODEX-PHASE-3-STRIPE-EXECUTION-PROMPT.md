# Canonical phase = 4 (per doc 74).

# 45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 3 Stripe Execution Prompt

## 1. Mission

Implement safe Stripe payment flow for **Labelpilot.de**.

Goal:

```txt
server-calculated price
pending order
Stripe Checkout
verified webhook
payment record
order paid by webhook only
success/cancel pages
no automatic production
```

Do not build unsafe payment shortcuts.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/12-DATABASE-SCHEMA-v2.md
/docs/13-ENVIRONMENT-VARIABLES.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/30-PRODUCT-CATALOG.md
/docs/41-STRIPE-TEST-PLAN.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
/docs/45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. Never trust client price.
2. Success page must not mark order paid.
3. Stripe webhook must verify signature.
4. Duplicate webhooks must be idempotent.
5. 20,000+ quantity must go to quote flow.
6. Paid does not mean production.
7. Secrets server-only.
8. Customer-facing UI German.
9. Store price snapshots.
10. Store payment records.

---

## 4. Required Files

Create/update:

```txt
lib/stripe/client.ts
lib/stripe/create-checkout-session.ts
lib/stripe/webhook.ts
lib/pricing/calculate-price.ts
lib/orders/create-order.ts
lib/orders/status.ts
lib/validation/checkout.ts
app/api/checkout/create-session/route.ts
app/api/stripe/webhook/route.ts
app/checkout/success/page.tsx
app/checkout/cancel/page.tsx
```

Adapt paths to repo structure.

---

## 5. Required Env

Update `.env.example`:

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_DEFAULT_CURRENCY=eur
NEXT_PUBLIC_APP_URL=
```

---

## 6. Direct Checkout Products

Allow:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box if paid
```

Quantities:

```txt
1,000
2,000
5,000
10,000
```

Reject/direct to quote:

```txt
20,000+
custom size
custom material
multi-SKU
```

---

## 7. Checkout Flow

Implement:

```txt
validate request
calculate price server-side
create PENDING_PAYMENT order
create OrderItem snapshot
create Stripe Checkout Session
store session ID
return checkout URL
```

Stripe metadata:

```txt
orderId
customerId
productId
quantity
material
source
```

---

## 8. Webhook Flow

Implement:

```txt
raw body
signature verification
event idempotency
checkout.session.completed
payment_intent.payment_failed
Payment create/update
OrderStatusEvent
PENDING_PAYMENT → PAID
```

No automatic production.

---

## 9. Success Page German Copy

Use:

```txt
Vielen Dank. Ihre Zahlung wird bestätigt. Sobald die Zahlung im System bestätigt wurde, prüfen wir Ihre Druckdaten und informieren Sie über den nächsten Schritt.
```

---

## 10. Cancel Page German Copy

Use:

```txt
Die Zahlung wurde nicht abgeschlossen. Sie können zur Bestellung zurückkehren oder ein individuelles Angebot anfordern.
```

---

## 11. Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual/Stripe tests:

```txt
valid checkout
invalid product
invalid quantity
20,000+ rejected
price tampering blocked
test payment success
webhook updates order
duplicate webhook safe
failed payment safe
```

---

## 12. Required Report

Return:

```txt
## Summary
## Files Changed
## Stripe Flow
## Webhook Flow
## Checks Run
## Manual Tests
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 13. Acceptance Criteria

| Check | Required |
|---|---|
| Server price calculation | PASS |
| Pending order created | PASS |
| Stripe checkout created | PASS |
| Webhook verifies signature | PASS |
| Order paid by webhook | PASS |
| Success page does not mark paid | PASS |
| Duplicate webhook safe | PASS |
| Failed payment safe | PASS |
| 20,000+ quote only | PASS |
| No automatic production | PASS |
| German UI | PASS |

---

## 14. Final Instruction

Payment safety beats speed.

Do not ship Stripe unless webhook, idempotency and server pricing are correct.
