# 15-STRIPE-PAYMENT-FLOW.md

# Labelpilot.de — Stripe Payment Flow

## 1. Purpose

This document defines the Stripe payment architecture for **Labelpilot.de**.

Labelpilot.de is a Germany-focused B2B-first custom label ordering and reorder platform.

Stripe must support:

- Fixed-price product checkout
- Quantity/package-based pricing
- Artwork upload before payment or during order creation
- Paid order creation
- Quote request follow-up payment
- Reorder payment
- Secure webhook confirmation
- Admin-visible payment status
- Future B2B invoice/payment link expansion

This document is the source of truth for Codex when implementing payment logic.

---

## 2. Core Rule

Payment status must never be trusted from the browser.

The only trusted payment confirmation source is:

> Stripe webhook with verified signature.

The success page is not proof of payment.

---

## 3. Payment Scope

### 3.1 MVP Payment Flows

The MVP must support:

1. Standard product payment through Stripe Checkout.
2. Reorder payment through Stripe Checkout.
3. Quote request without immediate payment.
4. Admin-created manual quote/payment link later.
5. Stripe webhook to mark order as paid.
6. Stripe payment record stored in database.

### 3.2 Not Required in MVP

Do not implement these in MVP unless explicitly requested later:

- Full subscription billing
- Stripe Billing plans
- Customer portal billing management
- Complex discounts
- Multi-currency checkout
- Klarna
- PayPal
- SEPA Direct Debit
- Tax automation beyond required basic fields
- Full invoice accounting system

Keep MVP focused.

---

## 4. Business Payment Model

Labelpilot.de sells B2B-oriented label packages.

Initial package pricing:

| Package | Quantity | Product | Target Price |
|---|---:|---|---:|
| Starter | 1,000 | 100×200 PP labels | €149 |
| Growth | 5,000 | 100×200 PP labels | €399 |
| Pro | 10,000 | 100×200 PP labels | €699 |
| Business | 20,000+ | 100×200 PP labels | Quote request |

Thermal labels are cross-sell products.

The main payment logic should prioritize:

- 5,000-label Growth package
- 10,000-label Pro package
- Reorder of previous B2B orders

---

## 5. Supported Payment Routes

Recommended routes:

```txt
app/api/checkout/create-session/route.ts
app/api/stripe/webhook/route.ts
app/(shop)/checkout/success/page.tsx
app/(shop)/checkout/cancel/page.tsx
```

Optional future routes:

```txt
app/api/admin/payment-link/create/route.ts
app/api/quote/[id]/create-payment-link/route.ts
```

---

## 6. Checkout Session Creation Flow

### 6.1 Standard Product Checkout

Flow:

```txt
Product page
→ Customer selects product/material/quantity
→ Customer uploads artwork or proceeds with upload requirement
→ Server validates configuration
→ Server calculates price
→ Pending order is created
→ Stripe Checkout Session is created
→ Customer is redirected to Stripe
```

### 6.2 Server-Side Requirements

The server must:

1. Validate product slug.
2. Validate selected material.
3. Validate selected quantity.
4. Validate package price server-side.
5. Create an order with `PENDING_PAYMENT` status.
6. Create Stripe Checkout Session.
7. Attach internal order ID to Stripe metadata.
8. Return Checkout URL to client.

Client must not send final price as trusted data.

---

## 7. Checkout Session Metadata

Every Stripe Checkout Session must include metadata.

Required metadata:

```txt
orderId
customerId
productSlug
quantity
material
source
```

Example:

```ts
metadata: {
  orderId: order.id,
  customerId: customer.id,
  productSlug: product.slug,
  quantity: String(quantity),
  material,
  source: "standard_checkout"
}
```

For reorder payments:

```ts
metadata: {
  orderId: order.id,
  originalOrderId,
  customerId: customer.id,
  productSlug: product.slug,
  quantity: String(quantity),
  material,
  source: "reorder_checkout"
}
```

For quote payment links later:

```ts
metadata: {
  orderId: order.id,
  quoteRequestId,
  customerId: customer.id,
  source: "quote_payment"
}
```

---

## 8. Stripe Checkout Session Configuration

Recommended MVP Checkout Session fields:

```ts
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  customer_email: customer.email,
  line_items: [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: productName,
          description: productDescription,
        },
        unit_amount: amountInCents,
      },
      quantity: 1,
    },
  ],
  success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${APP_URL}/checkout/cancel?orderId=${order.id}`,
  metadata: {
    orderId: order.id,
    customerId: customer.id,
    productSlug,
    quantity: String(quantity),
    material,
    source: "standard_checkout",
  },
});
```

Rules:

- Currency must be EUR.
- Amount must be calculated server-side.
- `orderId` metadata is required.
- Do not expose Stripe secret key to client.
- Do not mark order as paid on success page.

---

## 9. Order Creation Before Payment

An order should be created before Stripe Checkout Session.

Initial order status:

```txt
PENDING_PAYMENT
```

The order must store:

- customer information
- product configuration
- calculated price
- currency
- quantity
- material
- shipping info if available
- uploaded artwork reference if uploaded before checkout
- Stripe Checkout Session ID after session creation

If payment fails or customer cancels, order remains `PENDING_PAYMENT` or can later be marked `CANCELLED`.

---

## 10. Payment Record Model

The full schema belongs in `/docs/12-DATABASE-SCHEMA.md`.

Minimum payment fields:

```txt
Payment
- id
- orderId
- stripeCheckoutSessionId
- stripePaymentIntentId
- stripeCustomerId
- amount
- currency
- status
- provider
- rawEventId
- paidAt
- createdAt
- updatedAt
```

Payment statuses:

```txt
PENDING
PAID
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
DISPUTED
```

---

## 11. Stripe Webhook Flow

Webhook route:

```txt
app/api/stripe/webhook/route.ts
```

Webhook must:

1. Read raw request body.
2. Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`.
3. Parse event.
4. Check event type.
5. Handle idempotency.
6. Update Payment record.
7. Update Order status when appropriate.
8. Log event result.

---

## 12. Required Webhook Events

MVP must handle:

```txt
checkout.session.completed
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded
charge.dispute.created
```

Minimum MVP can start with:

```txt
checkout.session.completed
payment_intent.payment_failed
```

But production should also store refunds/disputes.

---

## 13. `checkout.session.completed` Handling

When this event is received:

1. Verify session payment status is paid.
2. Read `orderId` from metadata.
3. Find order.
4. Confirm order is not already paid.
5. Create or update Payment record.
6. Set order status to `PAID`.
7. Create `OrderStatusEvent`.
8. Trigger payment confirmation email.
9. Move order into file review workflow if artwork exists.

Status transition:

```txt
PENDING_PAYMENT → PAID
PAID → FILE_REVIEW
```

Depending on implementation, Codex may either:

- Set status directly to `PAID`, then admin workflow moves to `FILE_REVIEW`; or
- Set to `FILE_REVIEW` after creating paid event.

Recommended MVP:

```txt
PENDING_PAYMENT → PAID
```

Then admin panel shows paid orders requiring file review.

---

## 14. Idempotency Rules

Stripe may send the same webhook more than once.

The system must avoid duplicate updates.

Store processed Stripe event IDs.

Recommended model:

```txt
StripeEvent
- id
- stripeEventId
- type
- processedAt
- status
- errorMessage
```

Before processing:

```txt
If stripeEventId already exists and status is PROCESSED:
  return 200
```

---

## 15. Failure Handling

### 15.1 Payment Failed

If `payment_intent.payment_failed` occurs:

- Create/update Payment record as `FAILED`.
- Keep order as `PENDING_PAYMENT` or mark as `PAYMENT_FAILED` if that status exists.
- Do not start production.
- Send optional payment failed email later.

MVP may keep order as `PENDING_PAYMENT`.

### 15.2 Checkout Cancelled

Stripe may not always send a special cancel event.

Cancel page should:

- Display that payment was cancelled.
- Allow retry.
- Not mark order as cancelled automatically unless user explicitly abandons.

Admin can later cancel stale unpaid orders.

---

## 16. Refund Handling

Refund handling can be basic in MVP.

If refund event is received:

- Mark Payment as `REFUNDED` or `PARTIALLY_REFUNDED`.
- Add admin-visible note.
- Do not automatically cancel order if already in production.
- Admin must review.

Refund policy must be strict because products are custom printed.

Custom printed labels are generally not standard returnable consumer goods once approved/produced.

Legal wording belongs in legal docs.

---

## 17. Reorder Payment Flow

Reorder flow:

```txt
Customer account
→ Previous orders
→ Reorder
→ System creates new order using previous specs
→ Customer confirms quantity
→ Stripe Checkout Session
→ Webhook marks new order as paid
```

Rules:

- A reorder is always a new order.
- Original order must remain unchanged.
- New order must reference `originalOrderId`.
- Artwork can be reused if approved.
- Customer can request minor changes before proof/production.
- Payment is required unless admin approves manual B2B payment.

---

## 18. Quote Request Payment Flow

Quote request flow is separate from direct checkout.

Initial quote request:

```txt
Customer submits quote form
→ QuoteRequest created
→ No Stripe payment yet
→ Admin reviews
→ Admin sends manual quote
```

Future payment options:

1. Admin creates Stripe Payment Link.
2. Admin converts quote into order.
3. Customer pays via Stripe Checkout.
4. Webhook marks order as paid.

Do not force large B2B buyers into checkout before quote.

---

## 19. Tax and IOSS Notes

The business has IOSS active.

However, tax logic must be treated carefully.

MVP rules:

1. Display tax-inclusive or tax-explanatory pricing clearly.
2. Do not make unsupported tax promises in checkout logic.
3. Store customer country.
4. Store company/VAT fields for B2B quote requests.
5. Keep invoices/accounting outside MVP unless required.

Customer-facing message should be cautious:

> For eligible orders, tax handling is managed at checkout to reduce surprise costs on delivery.

Avoid overpromising legal/tax outcomes.

---

## 20. Stripe Product Strategy

For MVP, prefer dynamic `price_data` in Checkout Session.

Do not create hundreds of Stripe products for every quantity/material combination at the beginning.

Recommended:

- Store product/pricing in application database/config.
- Create Checkout Session with dynamic line item.
- Use metadata to connect Stripe payment to internal order.

Future:

- Stripe Products/Prices may be created for stable packages.
- B2B custom quotes may use Stripe Payment Links or invoices.

---

## 21. Security Requirements

Non-negotiable:

1. `STRIPE_SECRET_KEY` must only be used server-side.
2. `STRIPE_WEBHOOK_SECRET` must only be used server-side.
3. Webhook must use raw body.
4. Webhook must verify signature.
5. Client must not set order paid.
6. Client must not decide final price.
7. Admin-only payment actions must be protected.
8. Metadata must not include sensitive private file URLs.
9. Logs must not expose secret keys.
10. Webhook endpoint must return 200 only after safe processing or idempotent acknowledgement.

---

## 22. Environment Variables

Required Stripe variables:

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Required app variables:

```txt
NEXT_PUBLIC_APP_URL=
```

Optional future variables:

```txt
STRIPE_ACCOUNT_COUNTRY=
STRIPE_DEFAULT_CURRENCY=eur
```

All environment variables must be validated during app startup or server usage.

---

## 23. Success Page Behavior

Route:

```txt
/checkout/success
```

The success page should:

1. Accept `session_id`.
2. Show confirmation message.
3. Query internal order status if authenticated or if safe.
4. Explain that order will proceed after payment confirmation.
5. Tell customer that artwork will be reviewed.
6. Provide next steps.

Do not say:

> Your order is in production.

Say:

> Payment received or being confirmed. Our team will review your print file before production.

---

## 24. Cancel Page Behavior

Route:

```txt
/checkout/cancel
```

The cancel page should:

1. Tell customer payment was not completed.
2. Provide button to return to product/order.
3. Provide contact/quote option.
4. Not delete order automatically.
5. Allow retry where possible.

---

## 25. Admin Payment Visibility

Admin order detail must show:

- payment status
- amount
- currency
- Stripe Checkout Session ID
- Stripe Payment Intent ID
- paid timestamp
- refund status if any
- payment source
- customer email

Admin list should allow filtering:

```txt
PENDING_PAYMENT
PAID
PAYMENT_FAILED
REFUNDED
```

If `PAYMENT_FAILED` is not an order status, use Payment status filter.

---

## 26. Order Status Integration

Payment events affect order statuses.

Allowed transitions:

```txt
DRAFT → PENDING_PAYMENT
PENDING_PAYMENT → PAID
PAID → FILE_REVIEW
PAID → CANCELLED
PAID → REFUND_REQUESTED
```

Forbidden transitions:

```txt
PENDING_PAYMENT → IN_PRODUCTION
PENDING_PAYMENT → SHIPPED
PAYMENT_FAILED → IN_PRODUCTION
CANCELLED → PAID without new payment review
```

Production cannot begin unless order is paid or manually approved by admin.

---

## 27. Email Triggers

After webhook confirms payment:

Send email:

```txt
payment-confirmed
```

Email should include:

- order number
- product summary
- paid amount
- next step: artwork review
- expected review/production note
- support contact

Do not include private signed file URLs unless necessary.

---

## 28. Testing Checklist

Stripe implementation must pass these tests before production.

### 28.1 Checkout Creation

- Valid product creates pending order.
- Valid product creates Checkout Session.
- Invalid product is rejected.
- Invalid quantity is rejected.
- Client-side price tampering does not change server price.
- Checkout URL redirects correctly.

### 28.2 Webhook

- Valid webhook signature accepted.
- Invalid signature rejected.
- `checkout.session.completed` marks order paid.
- Duplicate webhook does not duplicate payment.
- Missing order ID is logged safely.
- Payment failure does not mark order paid.

### 28.3 Order Safety

- Success page does not mark order paid.
- Cancel page does not delete paid order.
- Unpaid order cannot enter production.
- Admin can see payment status.
- Payment record matches order amount.

### 28.4 Reorder

- Reorder creates a new order.
- Original order remains unchanged.
- Reorder checkout metadata includes original order ID.
- Reorder payment marks new order paid.

---

## 29. Stripe Test Cards

Use Stripe official test mode cards.

Common test scenarios:

```txt
Successful payment
Declined payment
3D Secure required
Insufficient funds
Refund
Dispute
```

Codex must not hardcode test cards into production code.

---

## 30. Production Launch Checklist

Before going live:

1. Stripe account fully activated.
2. Live Stripe keys added to Vercel production env.
3. Webhook endpoint configured in Stripe Dashboard.
4. Webhook secret added to Vercel.
5. Test mode disabled for production.
6. Success/cancel URLs use production domain.
7. Real payment tested with small amount if appropriate.
8. Refund process documented.
9. Order payment status verified in admin panel.
10. No secret keys exposed in client bundle.
11. Vercel logs checked after test payment.
12. Stripe event logs checked.
13. Database payment/order records verified.

---

## 31. Future Enhancements

Future payment improvements:

1. Stripe Payment Links for manual quotes.
2. Stripe Invoicing for B2B accounts.
3. Stored customer profiles.
4. Saved payment methods.
5. SEPA payment option.
6. Net terms for approved B2B customers.
7. Partial deposit for large production orders.
8. Admin-created custom payment requests.
9. VAT ID validation.
10. Accounting export.

These are not MVP unless explicitly prioritized.

---

## 32. Codex Implementation Rules

Codex must:

1. Read `/docs/00-PROJECT-BRIEF.md`.
2. Read `/docs/04-PRICING-AND-MARGIN-MODEL.md`.
3. Read `/docs/10-TECH-STACK.md`.
4. Read `/docs/11-ARCHITECTURE.md`.
5. Implement server-side pricing.
6. Implement secure Stripe Checkout.
7. Implement verified webhook.
8. Use Stripe metadata for internal order connection.
9. Never mark orders paid from client success page.
10. Store payment records.
11. Log status changes.
12. Keep payment code modular.
13. Do not add unsupported payment methods without documentation update.

---

## 33. Final Payment Architecture Verdict

The correct Stripe architecture is:

> Server-calculated order → Pending order → Stripe Checkout → verified webhook → paid order → admin file review → production.

The wrong architecture is:

> Client-calculated price → Checkout → success page marks order paid → production starts automatically.

Labelpilot.de must treat payment as a secure backend workflow, not a frontend event.
