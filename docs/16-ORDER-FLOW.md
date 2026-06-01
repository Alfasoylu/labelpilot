# 16-ORDER-FLOW.md

# Labelpilot.de — Order Flow

## 1. Purpose

This document defines the complete order flow for **Labelpilot.de**.

Labelpilot.de is a Germany-focused B2B-first custom label ordering and reorder platform.

The order system must support:

- Standard paid product orders
- Quote requests
- Artwork uploads
- Admin file review
- Proofing
- Customer proof approval
- Production workflow
- Shipment tracking
- Reprints
- Reorders
- Future Germany hub operations

This document is the source of truth for Codex when implementing order logic.

---

## 2. Core Principle

The order flow must be built around this business reality:

> Labelpilot.de sells custom printed B2B labels, not generic off-the-shelf products.

Therefore:

- No production starts before payment or admin approval.
- No production starts before file review.
- Proofing must be possible.
- Customer artwork and specs must be saved.
- Reorder must be a core workflow.
- Admin must control production status.
- Customer must clearly see order progress.

---

## 3. Order Types

The system must support these order types.

| Order Type | Description | Payment |
|---|---|---|
| STANDARD_CHECKOUT | Fixed package product order | Stripe Checkout |
| REORDER | New order based on previous order | Stripe Checkout or quote |
| QUOTE_BASED | Large/custom B2B request converted into order | Manual/Stripe later |
| SAMPLE_BOX | Sample request or paid sample box | Stripe or manual |
| ADMIN_CREATED | Admin-created B2B order | Manual/Stripe later |

MVP priority:

1. STANDARD_CHECKOUT
2. QUOTE_BASED
3. REORDER

---

## 4. Main Order Flow Summary

Standard order flow:

```txt
Product selection
→ Product configuration
→ Artwork upload
→ Customer details
→ Pending order created
→ Stripe Checkout
→ Stripe webhook confirms payment
→ Admin file review
→ Proof required or direct approval
→ Customer proof approval if required
→ Production
→ Ready to ship
→ Shipped
→ Delivered
→ Completed
→ Reorder reminder
```

This is the default workflow for paid label orders.

---

## 5. Required Order Statuses

The system must support these statuses:

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

Optional future statuses:

```txt
QUOTE_SENT
QUOTE_ACCEPTED
PARTIALLY_SHIPPED
RETURNED
```

Canonical active additions are `QUOTE_REQUESTED`, `PAYMENT_FAILED`, and `ON_HOLD`.

---

## 6. Order Status Meanings

| Status | Meaning |
|---|---|
| DRAFT | Order started but not ready for payment |
| PENDING_PAYMENT | Order created and waiting for Stripe payment |
| PAID | Stripe webhook confirmed payment |
| FILE_REVIEW | Admin must review uploaded artwork |
| PROOF_REQUIRED | Admin must upload proof for customer approval |
| WAITING_CUSTOMER_APPROVAL | Customer must approve proof |
| APPROVED_FOR_PRODUCTION | File/proof approved; production can start |
| IN_PRODUCTION | Order is being produced |
| READY_TO_SHIP | Production completed; waiting shipment |
| SHIPPED | Order shipped and tracking added |
| DELIVERED | Shipment delivered |
| COMPLETED | Order closed successfully |
| CANCELLED | Order cancelled |
| REFUND_REQUESTED | Refund or cancellation under review |
| REPRINT_REQUIRED | Order requires reprint due to error/problem |

---

## 7. Status Transition Rules

### 7.1 Allowed Main Transitions

```txt
DRAFT → PENDING_PAYMENT
PENDING_PAYMENT → PAID
PAID → FILE_REVIEW
FILE_REVIEW → PROOF_REQUIRED
FILE_REVIEW → APPROVED_FOR_PRODUCTION
PROOF_REQUIRED → WAITING_CUSTOMER_APPROVAL
WAITING_CUSTOMER_APPROVAL → APPROVED_FOR_PRODUCTION
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
IN_PRODUCTION → READY_TO_SHIP
READY_TO_SHIP → SHIPPED
SHIPPED → DELIVERED
DELIVERED → COMPLETED
```

### 7.2 Exception Transitions

```txt
PENDING_PAYMENT → CANCELLED
PAID → CANCELLED
PAID → REFUND_REQUESTED
FILE_REVIEW → REFUND_REQUESTED
WAITING_CUSTOMER_APPROVAL → CANCELLED
IN_PRODUCTION → REPRINT_REQUIRED
SHIPPED → REPRINT_REQUIRED
DELIVERED → REPRINT_REQUIRED
REPRINT_REQUIRED → IN_PRODUCTION
REPRINT_REQUIRED → COMPLETED
```

### 7.3 Forbidden Transitions

```txt
PENDING_PAYMENT → IN_PRODUCTION
PENDING_PAYMENT → SHIPPED
DRAFT → IN_PRODUCTION
PAID → SHIPPED
FILE_REVIEW → SHIPPED
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION without approval
CANCELLED → IN_PRODUCTION
COMPLETED → IN_PRODUCTION without admin reprint action
```

Codex must enforce status transitions through server-side logic.

Do not allow arbitrary client-side status changes.

---

## 8. Order Status Event Log

Every order status change must create an event.

Model concept:

```txt
OrderStatusEvent
- id
- orderId
- fromStatus
- toStatus
- actorType
- actorId
- reason
- createdAt
```

Actor types:

```txt
CUSTOMER
ADMIN
SYSTEM
STRIPE_WEBHOOK
```

Examples:

| Event | Actor |
|---|---|
| Payment confirmed | STRIPE_WEBHOOK |
| Admin moved to file review | ADMIN |
| Customer approved proof | CUSTOMER |
| Tracking added | ADMIN |
| Reorder created | SYSTEM or CUSTOMER |

The event log protects operational clarity.

---

## 9. Standard Checkout Order Flow

### 9.1 Customer Steps

1. Customer visits product page.
2. Customer selects:
   - product type
   - material
   - label size
   - quantity
   - optional notes
3. Customer uploads artwork.
4. Customer enters contact and shipping details.
5. Customer clicks checkout.
6. System creates order with `PENDING_PAYMENT`.
7. Stripe Checkout opens.
8. Customer pays.
9. Customer returns to success page.
10. System waits for Stripe webhook.
11. Customer receives confirmation email after webhook.

### 9.2 System Steps

1. Validate selected product.
2. Validate quantity.
3. Validate material.
4. Calculate price server-side.
5. Create customer record if needed.
6. Create order.
7. Attach uploaded file if present.
8. Create Stripe Checkout Session.
9. Save Stripe session ID.
10. Wait for webhook.

### 9.3 Webhook Steps

When Stripe confirms payment:

1. Verify webhook signature.
2. Find order using metadata.
3. Create payment record.
4. Update order status to `PAID`.
5. Create status event.
6. Send email confirmation.
7. Show order in admin dashboard as paid.

Recommended next automated transition:

```txt
PAID → FILE_REVIEW
```

Codex may implement this either as:

- manual admin action, or
- automatic transition after payment if uploaded artwork exists.

Recommended MVP:

Automatically set paid order to `FILE_REVIEW` if artwork exists.

---

## 10. Artwork Upload Flow

Artwork upload may happen:

1. Before checkout.
2. During product configuration.
3. After payment.
4. During correction request.
5. During quote request.

MVP recommended:

> Allow artwork upload before checkout, but also allow “send file later” for B2B customers.

Order file states:

```txt
NO_FILE
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
```

If no file is uploaded:

```txt
PAID → FILE_REVIEW
```

Admin sees:

> File missing / waiting for artwork.

Customer must be able to upload file from order page.

---

## 11. File Review Flow

Admin file review starts after payment or quote review.

Admin checks:

- correct file type
- correct size
- usable resolution
- bleed/cut allowance
- readability
- artwork belongs to order
- material/quantity match
- possible production issue

Admin decision options:

1. Approve file directly.
2. Request corrected file.
3. Upload proof for approval.
4. Cancel/refund review.
5. Add internal production note.

### 11.1 Direct Approval

If file is production-ready:

```txt
FILE_REVIEW → APPROVED_FOR_PRODUCTION
```

### 11.2 Correction Required

If file has issues:

- Artwork file status becomes `CORRECTION_REQUIRED`.
- Customer receives email.
- Order stays in `FILE_REVIEW` or moves to `ON_HOLD` when operationally blocked.
- Customer uploads replacement file.
- Admin reviews again.

### 11.3 Proof Required

If proof approval is needed:

```txt
FILE_REVIEW → PROOF_REQUIRED
PROOF_REQUIRED → WAITING_CUSTOMER_APPROVAL
```

---

## 12. Proof Approval Flow

Proofing is important for custom print safety.

### 12.1 Admin Steps

1. Admin reviews uploaded artwork.
2. Admin creates or uploads proof.
3. Admin attaches proof file to order.
4. Order status becomes `WAITING_CUSTOMER_APPROVAL`.
5. Customer receives proof-ready email.

### 12.2 Customer Steps

Customer can:

1. Approve proof.
2. Request changes.
3. Upload corrected file.
4. Add note.

### 12.3 Approval Result

If customer approves:

```txt
WAITING_CUSTOMER_APPROVAL → APPROVED_FOR_PRODUCTION
```

Approval must store:

- customer ID
- timestamp
- IP address if available
- proof file ID
- approval note if available

### 12.4 Change Request Result

If customer requests changes:

- Proof status becomes `CHANGES_REQUESTED`.
- Order returns to `FILE_REVIEW` or stays `WAITING_CUSTOMER_APPROVAL` with change flag.
- Admin reviews again.

---

## 13. Production Flow

Production starts only after:

```txt
APPROVED_FOR_PRODUCTION
```

Production cannot start from:

```txt
PENDING_PAYMENT
PAID
FILE_REVIEW
PROOF_REQUIRED
WAITING_CUSTOMER_APPROVAL
CANCELLED
```

### 13.1 Admin Production Start

Admin sets:

```txt
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
```

Admin may add:

- supplier/fason partner note
- production batch
- expected completion date
- internal production note

### 13.2 Production Completion

When production is completed:

```txt
IN_PRODUCTION → READY_TO_SHIP
```

Admin should optionally add:

- package count
- estimated weight
- production notes
- QC result

---

## 14. Shipping Flow

Shipping modes:

```txt
DIRECT_TURKEY_TO_GERMANY
CONSOLIDATED_PARTIAL_PALLET
GERMANY_HUB_DISPATCH
LOCAL_PICKUP_FUTURE
```

MVP shipping mode:

```txt
DIRECT_TURKEY_TO_GERMANY
```

But architecture must allow future hub.

### 14.1 Required Shipment Fields

```txt
Shipment
- id
- orderId
- carrier
- trackingNumber
- trackingUrl
- shippingMode
- originCountry
- destinationCountry
- shippedAt
- deliveredAt
- estimatedDeliveryDate
- packageCount
- weightKg
- notes
```

### 14.2 Admin Shipping Steps

1. Order status is `READY_TO_SHIP`.
2. Admin enters carrier/tracking.
3. Admin sets order to `SHIPPED`.
4. Customer receives shipping email.
5. Admin or system marks delivered later.

Status:

```txt
READY_TO_SHIP → SHIPPED
SHIPPED → DELIVERED
DELIVERED → COMPLETED
```

---

## 15. Quote Request Flow

Quote requests are for larger or custom B2B orders.

### 15.1 Quote Request Form Fields

Required fields:

```txt
companyName
contactName
email
phone
country
productType
labelSize
material
quantity
targetDeliveryDate
notes
artworkUploadOptional
```

### 15.2 Quote Statuses

Quote request statuses:

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

### 15.3 Quote Flow

```txt
Customer submits quote
→ QuoteRequest status NEW
→ Admin reviews
→ Admin requests more info or sends quote
→ Customer accepts quote
→ Admin converts quote to order
→ Payment link or manual payment
→ Order enters paid/manual approval flow
```

Quote requests must not be mixed with paid orders until converted.

---

## 16. Reorder Flow

Reorder is a core business function.

### 16.1 Reorder Creation

Customer can reorder from:

- customer account previous orders
- reorder email link
- admin-created reorder
- future public reorder token

Flow:

```txt
Previous completed order
→ Customer clicks reorder
→ System creates new draft order
→ Previous specs copied
→ Customer chooses quantity
→ Customer confirms artwork reuse or minor change
→ Checkout or quote
```

### 16.2 Reorder Data Copied

Copy from original order:

- product
- material
- label size
- previous quantity
- artwork file reference
- approved proof reference
- production notes if allowed
- customer notes
- shipping address if allowed

Do not copy:

- payment status
- shipment status
- old tracking number
- old status events
- old invoice number unless accounting requires future logic

### 16.3 Reorder Status

New reorder should start as:

```txt
DRAFT
```

Then:

```txt
DRAFT → PENDING_PAYMENT
```

or:

```txt
DRAFT → QUOTE_REQUESTED
```

if quote flow is needed.

---

## 17. Reprint Flow

Reprint is different from reorder.

Reprint means there is a problem with the original order.

Reasons:

```txt
PRINT_ERROR
CUTTING_ERROR
WRONG_MATERIAL
DAMAGED_IN_TRANSIT
CUSTOMER_FILE_ERROR
CUSTOMER_APPROVED_WRONG_PROOF
OTHER
```

### 17.1 Reprint Decision

Admin must decide:

- free reprint
- paid reprint
- partial refund
- reject claim
- request proof/evidence

### 17.2 Reprint Status Flow

```txt
DELIVERED → REPRINT_REQUIRED
REPRINT_REQUIRED → IN_PRODUCTION
IN_PRODUCTION → READY_TO_SHIP
READY_TO_SHIP → SHIPPED
```

Reprint must create a status event and admin note.

---

## 18. Cancellation Flow

Cancellation rules:

### 18.1 Before Payment

Customer can abandon checkout.

Admin may cancel stale order.

```txt
PENDING_PAYMENT → CANCELLED
```

### 18.2 After Payment Before Production

Admin may cancel/refund if production has not started.

```txt
PAID → REFUND_REQUESTED
```

or

```txt
FILE_REVIEW → REFUND_REQUESTED
```

### 18.3 After Proof Approval / Production

Custom orders should generally not be cancelled after approval/production start.

If customer approved proof and production started, cancellation should require admin review.

---

## 19. Customer Notifications

Email notifications should be triggered for:

| Event | Email |
|---|---|
| Order created | order-created |
| Payment confirmed | payment-confirmed |
| Artwork received | artwork-received |
| Correction requested | file-correction-requested |
| Proof ready | proof-ready |
| Proof approved | proof-approved |
| Production started | production-started |
| Order shipped | order-shipped |
| Order delivered | order-delivered |
| Reorder reminder | reorder-reminder |
| Quote request received | quote-request-received |
| Quote sent | quote-sent |

Customer-facing emails should be German-first.

---

## 20. Admin Dashboard Requirements

Admin dashboard must show:

### 20.1 Order List

Columns:

```txt
Order number
Customer/company
Product
Quantity
Order total
Payment status
Order status
Created date
Required action
```

Filters:

```txt
PENDING_PAYMENT
PAID
FILE_REVIEW
WAITING_CUSTOMER_APPROVAL
APPROVED_FOR_PRODUCTION
IN_PRODUCTION
READY_TO_SHIP
SHIPPED
REPRINT_REQUIRED
```

### 20.2 Order Detail

Order detail must show:

- customer info
- shipping address
- product configuration
- quantity
- price
- payment status
- uploaded artwork
- proof files
- customer notes
- admin notes
- order status history
- shipment tracking
- reorder reference if any

Admin actions:

- approve file
- request correction
- upload proof
- change status
- add tracking
- create reprint
- cancel/refund request
- add internal note

---

## 21. Customer Account Requirements

Customer account order detail must show:

- order number
- current status
- product summary
- uploaded file name
- proof approval action if needed
- tracking number if shipped
- reorder button
- support contact

Do not show:

- internal production cost
- supplier/fason notes
- admin-only notes
- internal margin data
- internal logistics cost

---

## 22. Guest vs Account Orders

MVP may allow guest checkout.

But B2B reorder requires account or verified email link.

Recommended approach:

- Allow checkout with email.
- Create customer record.
- Encourage account creation after payment.
- Allow magic link or email-based account access later.
- Reorder works best for logged-in customers.

Do not block first purchase with heavy account creation friction.

---

## 23. Order Number Format

Use human-readable order numbers.

Recommended format:

```txt
LP-YYYY-000001
```

Example:

```txt
LP-2026-000001
```

Database ID should remain internal.

Order number should be visible to customer and admin.

---

## 24. Data Validation

All order inputs must be validated server-side.

Validate:

- product slug
- material
- quantity
- customer email
- shipping country
- uploaded file type
- uploaded file size
- quote request quantity
- Stripe session metadata
- status transition permission

Use Zod schemas.

---

## 25. Security Rules

Non-negotiable:

1. Customer can only see own orders.
2. Admin routes must be protected.
3. Status changes must be server-side.
4. Payment confirmation must come from Stripe webhook.
5. File downloads must use signed URLs.
6. Reorder links must not expose private data.
7. Internal costs must never be sent to client.
8. Uploaded files must be validated.
9. Admin actions must be logged.
10. Order status transitions must be constrained.

---

## 26. MVP Order Flow Scope

MVP must include:

1. Standard product order
2. Stripe payment
3. Webhook payment confirmation
4. Artwork upload
5. Admin order list
6. Admin order detail
7. Admin status update
8. Proof upload
9. Customer proof approval
10. Shipment tracking entry
11. Quote request form
12. Basic reorder from previous order
13. Order status event log

MVP must not include:

- Complex ERP integration
- Automated carrier API
- Automated production planning
- Multi-supplier routing
- Advanced B2B payment terms
- Full subscription billing
- Public reorder token unless time allows
- Automated tax engine unless required

---

## 27. Future Order Flow Enhancements

Future phases may include:

1. Public reorder links.
2. Reorder reminder automation.
3. Production batch grouping.
4. Germany hub dispatch status.
5. Supplier/fason partner portal.
6. Admin quote builder.
7. Payment links for quotes.
8. B2B net payment terms.
9. Shipment API integrations.
10. Automated customer reorder prediction.
11. Label version history.
12. Bulk order upload.
13. Multi-address B2B shipping.

---

## 28. Acceptance Criteria

Order flow is accepted when:

1. Customer can create a product order.
2. Customer can upload artwork.
3. Stripe payment works.
4. Webhook marks order paid.
5. Admin sees paid order.
6. Admin can review file.
7. Admin can upload proof.
8. Customer can approve proof.
9. Admin can move order into production.
10. Admin can mark order shipped.
11. Customer can see tracking.
12. Completed order can be reordered.
13. Status events are logged.
14. Customer cannot access other customer orders.
15. Unpaid order cannot enter production.

---

## 29. Codex Implementation Rules

Codex must:

1. Read `/docs/00-PROJECT-BRIEF.md`.
2. Read `/docs/11-ARCHITECTURE.md`.
3. Read `/docs/15-STRIPE-PAYMENT-FLOW.md`.
4. Follow this order flow.
5. Implement status transitions server-side.
6. Log order status events.
7. Protect customer order access.
8. Keep admin actions protected.
9. Keep order flow simple for MVP.
10. Do not invent new statuses without updating this file.
11. Do not start production automatically after payment.
12. Do not skip file review/proof logic for custom labels.
13. Keep reorder as a first-class workflow.

---

## 30. Final Order Flow Verdict

The correct order architecture is:

> Paid or quote-approved order → file review → proof approval if needed → production → shipping → completed → reorder.

The wrong order architecture is:

> Customer pays → order automatically goes to production without file review.

Labelpilot.de must protect quality, payment safety, and repeat-order behavior from day one.
