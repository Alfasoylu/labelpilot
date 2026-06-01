# Canonical phase = 4 (per doc 74).

# 64-PHASE-3-STRIPE-ORDER-FLOW.md

# Labelpilot.de — Phase 3 Stripe Order Flow

## 1. Purpose

This document defines **Phase 3 Stripe Order Flow** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Phase 3 exists to implement the first real paid order workflow.

The goal is to allow a customer to:

1. Select an approved label product.
2. Select a fixed quantity package.
3. Enter customer/order information.
4. Create a pending order.
5. Pay through Stripe Checkout.
6. Have payment confirmed only by Stripe webhook.
7. Store the payment and order.
8. Move the order into the correct post-payment workflow.

This phase must be secure. A broken payment flow can destroy the business.

---

## 2. Phase 3 Verdict

The correct Phase 3 is:

> Server-calculated price → pending order → Stripe Checkout → verified webhook → paid order → file review queue.

The wrong Phase 3 is:

> Client-calculated price → Stripe success page → order marked paid from browser → production starts automatically.

Do not build unsafe shortcuts.

---

## 3. Required Source Documents

Before implementing Phase 3, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/04-PRICING-AND-MARGIN-MODEL.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/15-STRIPE-PAYMENT-FLOW.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
```

If there is conflict, stop and report it.

---

## 4. Phase 3 Language Rule

Customer-facing UI remains German only.

All visible customer text must be German:

- checkout buttons
- success page
- cancel page
- order confirmation text
- form labels
- validation errors
- payment status messages
- emails if implemented

Allowed internal English:

- code identifiers
- enum values
- Stripe metadata keys
- database field names
- developer logs

---

## 5. Phase 3 Scope

Phase 3 must implement:

1. Product package selection for approved products.
2. Server-side price calculation.
3. Pending order creation.
4. Stripe Checkout Session creation.
5. Stripe webhook endpoint.
6. Webhook signature verification.
7. Payment record storage.
8. Order status update after payment.
9. Checkout success page.
10. Checkout cancel page.
11. Basic order confirmation email if email system exists.
12. Admin-visible paid order status if admin shell exists.
13. Test mode configuration.
14. Payment safety checks.

---

## 6. Phase 3 Non-Scope

Do not implement in Phase 3 unless explicitly requested:

```txt
full cart system
discount engine
Stripe subscriptions
SEPA payments
PayPal
Klarna
Stripe Tax automation
full invoice accounting
complex B2B payment terms
partial deposits
advanced refunds dashboard
customer billing portal
```

Phase 3 is direct payment for fixed packages.

---

## 7. Approved Products for Checkout

Phase 3 checkout may support only these direct-pay products:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box
```

Products that should use quote flow instead:

```txt
custom-quote
20,000+ quantity
non-standard size
non-standard material
multi-SKU B2B order
monthly production plan
```

Reorder payment can be implemented later or as a basic flow if order history exists.

---

## 8. Fixed Package Pricing

Phase 3 must use server-side package pricing.

Initial PP label packages:

| Package | Quantity | Product | Price |
|---|---:|---|---:|
| Starter | 1,000 | 100×200 PP labels | €149 |
| Growth | 5,000 | 100×200 PP labels | €399 |
| Pro | 10,000 | 100×200 PP labels | €699 |
| Business | 20,000+ | Quote only |

Rules:

1. Do not allow direct checkout for 20,000+ labels.
2. Do not trust price from browser.
3. Do not hardcode prices in UI components.
4. Use central product/pricing config.
5. Store price snapshot on order.

---

## 9. Recommended Files to Implement

Codex may create or update:

```txt
config/products.ts
config/pricing.ts
lib/pricing/calculate-price.ts
lib/pricing/types.ts
lib/stripe/client.ts
lib/stripe/create-checkout-session.ts
lib/stripe/webhook.ts
lib/orders/create-order.ts
lib/orders/status.ts
lib/validation/checkout.ts
app/api/checkout/create-session/route.ts
app/api/stripe/webhook/route.ts
app/(shop)/checkout/success/page.tsx
app/(shop)/checkout/cancel/page.tsx
```

Actual paths may vary if architecture already exists, but the separation of concerns must remain.

---

## 10. Required Environment Variables

Phase 3 requires:

```txt
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
DATABASE_URL
DIRECT_URL
```

If email is used:

```txt
RESEND_API_KEY
```

Codex must:

1. Add missing variables to `.env.example`.
2. Validate environment access server-side.
3. Never expose Stripe secret key to the client.
4. Never commit `.env`.

---

## 11. Data Models Required

The final schema may be defined elsewhere, but Phase 3 needs at minimum:

### 11.1 Order

Required fields conceptually:

```txt
id
orderNumber
customerId
email
companyName
status
currency
subtotalAmount
shippingAmount
taxAmount
totalAmount
source
createdAt
updatedAt
```

### 11.2 OrderItem

```txt
id
orderId
productId
productSlug
productName
material
size
quantity
unitPriceSnapshot
totalPriceSnapshot
createdAt
```

### 11.3 Payment

```txt
id
orderId
provider
status
amount
currency
stripeCheckoutSessionId
stripePaymentIntentId
stripeCustomerId
stripeEventId
paidAt
createdAt
updatedAt
```

### 11.4 StripeEvent

```txt
id
stripeEventId
type
status
processedAt
errorMessage
createdAt
```

### 11.5 OrderStatusEvent

```txt
id
orderId
fromStatus
toStatus
actorType
actorId
reason
createdAt
```

---

## 12. Required Order Statuses for Phase 3

Phase 3 must support at minimum:

```txt
DRAFT
PENDING_PAYMENT
PAID
FILE_REVIEW
CANCELLED
REFUND_REQUESTED
```

Full system statuses remain:

```txt
DRAFT
PENDING_PAYMENT
PAID
FILE_REVIEW
PROOF_REQUIRED
WAITING_CUSTOMER_APPROVAL
APPROVED_FOR_PRODUCTION
IN_PRODUCTION
READY_TO_SHIP
SHIPPED
DELIVERED
COMPLETED
CANCELLED
REFUND_REQUESTED
REPRINT_REQUIRED
```

Do not remove or simplify future statuses if already defined.

---

## 13. Checkout Request Validation

Checkout creation request must validate:

```txt
productId
quantity
material
customerEmail
companyName
contactName
shippingCountry
customerNotes
sendFileLater
```

Optional if artwork upload not yet implemented:

```txt
artworkFileId
```

Validation rules:

1. Product must exist.
2. Product must be direct-checkout eligible.
3. Quantity must be allowed.
4. Material must match product.
5. Email must be valid.
6. Shipping country must be allowed.
7. Price must be calculated server-side.
8. Quote-threshold quantities must be rejected and redirected to quote flow.

Use Zod.

---

## 14. Checkout Creation Flow

Implementation flow:

```txt
Customer clicks “Jetzt konfigurieren”
→ Customer selects package
→ Customer enters details
→ Client posts configuration to server
→ Server validates input
→ Server calculates price
→ Server creates PENDING_PAYMENT order
→ Server creates Stripe Checkout Session
→ Server stores session ID
→ Server returns checkout URL
→ Customer is redirected to Stripe
```

No payment status is set during this flow.

---

## 15. Stripe Checkout Session Requirements

Checkout Session must include:

```txt
mode: payment
currency: eur
line_items
success_url
cancel_url
metadata
customer_email
```

Required metadata:

```txt
orderId
customerId
productId
quantity
material
source
```

Source values:

```txt
standard_checkout
sample_box_checkout
reorder_checkout
quote_payment
```

In Phase 3, use:

```txt
standard_checkout
sample_box_checkout
```

---

## 16. Stripe Success Page

Route:

```txt
/checkout/success
```

German customer-facing message:

```txt
Vielen Dank. Ihre Zahlung wird bestätigt. Sobald die Zahlung im System bestätigt wurde, prüfen wir Ihre Druckdaten und informieren Sie über den nächsten Schritt.
```

Rules:

1. Success page must not mark order as paid.
2. Success page may read safe order status.
3. Success page must explain file review next step.
4. Success page must show support/contact path.
5. Do not say production has started.

---

## 17. Stripe Cancel Page

Route:

```txt
/checkout/cancel
```

German customer-facing message:

```txt
Die Zahlung wurde nicht abgeschlossen. Sie können zur Bestellung zurückkehren oder ein individuelles Angebot anfordern.
```

Rules:

1. Cancel page must not delete order automatically.
2. Cancel page must not mark paid.
3. Customer should be able to retry or request quote.
4. Admin can later cancel stale unpaid orders.

---

## 18. Stripe Webhook Endpoint

Route:

```txt
/api/stripe/webhook
```

Webhook must:

1. Use raw request body.
2. Verify Stripe signature.
3. Reject invalid signatures.
4. Parse event.
5. Check idempotency.
6. Process supported event.
7. Store Stripe event record.
8. Update payment record.
9. Update order status.
10. Return correct response.

---

## 19. Required Webhook Events

Minimum required:

```txt
checkout.session.completed
payment_intent.payment_failed
```

Recommended to also support:

```txt
payment_intent.succeeded
charge.refunded
charge.dispute.created
```

Phase 3 must at least handle successful checkout and payment failure safely.

---

## 20. `checkout.session.completed` Logic

When event is received:

1. Verify event signature.
2. Confirm session payment status is paid.
3. Get `orderId` from metadata.
4. Find order.
5. Confirm order is not already paid.
6. Create or update Payment record.
7. Update order status:
   - `PENDING_PAYMENT → PAID`
8. Create OrderStatusEvent.
9. Optionally move to `FILE_REVIEW` if file workflow exists.
10. Send German payment confirmation email if email system exists.

Recommended Phase 3:

```txt
PENDING_PAYMENT → PAID
```

Then later Phase 4 handles:

```txt
PAID → FILE_REVIEW
```

If file upload is already implemented, automatic move to `FILE_REVIEW` is acceptable.

---

## 21. Idempotency

Stripe may send duplicate events.

Codex must implement idempotency.

Rule:

```txt
If stripeEventId already processed:
  return 200 without changing order again.
```

Do not create duplicate payments.

Do not create duplicate status events.

---

## 22. Payment Failure Logic

When payment fails:

1. Create/update Payment as `FAILED`.
2. Keep order as `PENDING_PAYMENT`, or set optional payment failed status if it exists.
3. Do not cancel automatically.
4. Do not start file review.
5. Do not start production.

German customer message if displayed:

```txt
Die Zahlung konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.
```

---

## 23. Production Gate Rule

Phase 3 must not allow production status.

Even if an order is paid:

```txt
PAID ≠ ready for production
```

Production requires later:

1. File review.
2. Proof approval if needed.
3. Admin approval.

Forbidden:

```txt
Stripe paid → IN_PRODUCTION
Stripe paid → READY_TO_SHIP
Stripe paid → COMPLETED
```

---

## 24. Admin Visibility

If admin shell exists, Phase 3 should show:

- order number
- customer email
- company name
- product
- quantity
- total amount
- payment status
- order status
- Stripe session ID
- created date

If admin does not exist yet, ensure database records are ready for Phase 5 admin implementation.

---

## 25. Customer Email

If Resend/email is already configured, send German payment confirmation.

Subject:

```txt
Zahlung bestätigt – Ihre Labelpilot.de Bestellung
```

Body should include:

```txt
Bestellnummer
Produkt
Menge
Zahlbetrag
Nächster Schritt: technische Prüfung der Druckdaten
Support contact
```

Do not include private file URLs.

Email is optional in Phase 3 if email infrastructure is not ready.

---

## 26. Error Handling

Customer-facing German errors:

| Situation | German Message |
|---|---|
| Invalid product | Dieses Produkt ist nicht verfügbar. |
| Invalid quantity | Diese Menge ist für dieses Produkt nicht verfügbar. |
| Quote threshold | Für diese Menge erstellen wir ein individuelles Angebot. |
| Checkout creation failed | Die Zahlung konnte nicht vorbereitet werden. Bitte versuchen Sie es erneut. |
| Payment failed | Die Zahlung konnte nicht abgeschlossen werden. |
| Missing email | Bitte geben Sie eine gültige E-Mail-Adresse ein. |

Do not expose internal errors to customers.

---

## 27. Security Requirements

Non-negotiable:

1. Never trust client price.
2. Never mark paid from client.
3. Verify webhook signature.
4. Store processed webhook events.
5. Do not expose secret keys.
6. Validate all checkout inputs.
7. Protect admin/payment routes.
8. Do not expose internal costs.
9. Use EUR.
10. Keep Stripe metadata minimal and non-sensitive.

---

## 28. Phase 3 Acceptance Criteria

Phase 3 is accepted when:

| Check | Required Result |
|---|---|
| Valid product creates pending order | PASS |
| Server calculates price | PASS |
| Client cannot alter price | PASS |
| Stripe Checkout Session is created | PASS |
| Checkout redirects to Stripe | PASS |
| Success page does not mark paid | PASS |
| Webhook verifies signature | PASS |
| Webhook marks order paid | PASS |
| Duplicate webhook does not duplicate payment | PASS |
| Failed payment does not mark paid | PASS |
| Order status event is logged | PASS |
| Production does not start automatically | PASS |
| Customer-facing text is German | PASS |
| 20,000+ quantity goes to quote | PASS |

---

## 29. Phase 3 Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual / integration checks:

1. Create checkout for 1,000 PP labels.
2. Create checkout for 5,000 PP labels.
3. Create checkout for 10,000 PP labels.
4. Reject 20,000+ direct checkout.
5. Try browser price tampering.
6. Complete Stripe test payment.
7. Confirm webhook updates order.
8. Send duplicate webhook.
9. Test failed card.
10. Visit success page.
11. Visit cancel page.
12. Check German UI text.
13. Check payment/order records.

If Stripe CLI is available:

```txt
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

Do not claim Stripe tests passed if they were not run.

---

## 30. Phase 3 PASS/FAIL Report Format

Codex must report:

```txt
## Summary
- What changed

## Files Changed
- path

## Stripe Flow
- how checkout works
- how webhook works

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended Phase 4 task
```

---

## 31. Common Phase 3 Mistakes to Avoid

Do not:

1. Mark order paid on success page.
2. Trust browser price.
3. Skip webhook signature verification.
4. Start production after payment.
5. Put Stripe secret key in client code.
6. Hardcode random product prices in components.
7. Allow 20,000+ direct checkout.
8. Ignore duplicate webhooks.
9. Create payment without order link.
10. Show English customer UI.
11. Hide checkout errors.
12. Skip order status history.

---

## 32. Phase 3 Final Verdict

Phase 3 must turn Labelpilot.de from a lead-generation MVP into a safe paid-order system.

The correct implementation:

> German product configuration → server-side price → pending order → Stripe Checkout → verified webhook → paid order.

The wrong implementation:

> Frontend price → success page paid flag → automatic production.

Payment safety is more important than speed.
