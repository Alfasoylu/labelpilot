# 12-DATABASE-SCHEMA.md

# Labelpilot.de — Database Schema

## 1. Purpose

This document defines the database schema for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The database must support:

- customers
- admins
- products
- product packages
- orders
- order items
- Stripe payments
- order status history
- artwork uploads
- proof files
- file reviews
- quote requests
- reorder workflows
- lead flow
- shipment tracking
- admin notes
- future Germany hub operations

This document is the source of truth for Codex when implementing Prisma models and migrations.

---

## 2. Database Strategy

Recommended database:

```txt
Supabase PostgreSQL
```

Recommended ORM:

```txt
Prisma
```

Primary rules:

1. Use Prisma migrations.
2. Do not manually edit production schema.
3. Preserve order/payment/file history.
4. Use enums for stable workflow states.
5. Use Decimal for money values.
6. Store currency explicitly.
7. Keep customer-facing IDs separate from internal IDs.
8. Never delete financial/order records casually.
9. Use soft-delete or archival where needed.
10. Keep schema simple enough for MVP but extensible.

---

## 3. Naming Rules

Prisma model names should use English.

Customer-facing labels can be German in the UI.

Examples:

```txt
Order
OrderItem
Payment
ArtworkFile
ProofFile
QuoteRequest
Lead
```

Enum values may use English uppercase.

Example:

```txt
PENDING_PAYMENT
FILE_REVIEW
APPROVED_FOR_PRODUCTION
```

German UI labels should be mapped in the frontend.

---

## 4. Core Model List

Required models:

```txt
User
Customer
Address
Product
ProductVariant
Order
OrderItem
Payment
StripeEvent
OrderStatusEvent
ArtworkFile
ProofFile
FileReview
QuoteRequest
ReorderLink
Shipment
AdminNote
Lead
LeadNote
```

Optional future models:

```txt
EmailEvent
ProductPriceRule
ProductionBatch
HubShipment
Supplier
ReprintCase
AuditLog
```

---

## 5. Required Enums

### 5.1 UserRole

```txt
CUSTOMER
ADMIN
```

Future:

```txt
SALES
PRODUCTION
SUPPORT
```

### 5.2 OrderStatus

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

### 5.3 PaymentStatus

```txt
PENDING
PAID
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
DISPUTED
```

### 5.4 PaymentProvider

```txt
STRIPE
MANUAL
BANK_TRANSFER
```

### 5.5 ArtworkFileStatus

```txt
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
ARCHIVED
```

### 5.6 ProofStatus

```txt
NOT_REQUIRED
PENDING_ADMIN_UPLOAD
WAITING_CUSTOMER_APPROVAL
APPROVED
CHANGES_REQUESTED
SUPERSEDED
```

### 5.7 QuoteStatus

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

### 5.8 LeadType

```txt
QUOTE_REQUEST
SAMPLE_BOX_REQUEST
CONTACT_REQUEST
OUTBOUND_PROSPECT
REORDER_INTEREST
BULK_ORDER_INTEREST
```

### 5.9 LeadStatus

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

### 5.10 ShippingMode

```txt
DIRECT_TURKEY_TO_GERMANY
CONSOLIDATED_PARTIAL_PALLET
GERMANY_HUB_DISPATCH
LOCAL_PICKUP_FUTURE
```

### 5.11 ActorType

```txt
CUSTOMER
ADMIN
SYSTEM
STRIPE_WEBHOOK
```

### 5.12 AdminNoteType

```txt
INTERNAL
CUSTOMER_VISIBLE
PRODUCTION
SHIPPING
PAYMENT
REPRINT
```

### 5.13 ReorderType

```txt
SAME_ARTWORK
MINOR_CHANGE
QUOTE_REQUIRED
ADMIN_CREATED
```

---

## 6. User Model

Purpose:

Authentication identity.

Suggested fields:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      UserRole @default(CUSTOMER)
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  customer  Customer?
}
```

Rules:

1. A user may be a customer.
2. Admin users use role ADMIN.
3. Customer data belongs in Customer model.
4. Do not store passwords manually if auth provider handles auth.

---

## 7. Customer Model

Purpose:

B2B customer profile.

Suggested fields:

```prisma
model Customer {
  id          String   @id @default(cuid())
  userId      String?  @unique
  email       String
  companyName String?
  contactName String?
  phone       String?
  country     String   @default("DE")
  website     String?
  industry    String?
  vatId       String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user         User?    @relation(fields: [userId], references: [id])
  addresses   Address[]
  orders      Order[]
  quoteRequests QuoteRequest[]
  leads       Lead[]
}
```

Rules:

1. Email is required.
2. Company name is strongly preferred for B2B.
3. Country defaults to Germany.
4. VAT ID optional for future B2B tax flows.

---

## 8. Address Model

Purpose:

Shipping/billing address.

Suggested fields:

```prisma
model Address {
  id          String   @id @default(cuid())
  customerId  String?
  type        String   // SHIPPING or BILLING
  companyName String?
  contactName String?
  street      String?
  postalCode  String?
  city        String?
  state       String?
  country     String   @default("DE")
  phone       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  customer    Customer? @relation(fields: [customerId], references: [id])
}
```

MVP can use simple string `type`, or enum later.

---

## 9. Product Model

Purpose:

Product catalog.

MVP may store product data in config first.

Database model is useful if admin product management is added later.

Suggested fields:

```prisma
model Product {
  id              String   @id
  slug            String   @unique
  customerTitle   String
  internalTitle   String?
  category        String
  material        String?
  size            String?
  uploadRequired  Boolean  @default(true)
  reorderEligible Boolean  @default(true)
  quoteThreshold  Int?
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  variants        ProductVariant[]
  orderItems      OrderItem[]
}
```

Approved product IDs:

```txt
pp-opaque-100x200
pp-transparent-100x200
thermal-eco-100x100
thermal-shipping-100x150
sample-box
custom-quote
reorder
```

---

## 10. ProductVariant Model

Purpose:

Product package/quantity variant.

Suggested fields:

```prisma
model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  quantity    Int
  label       String
  priceEur    Decimal  @db.Decimal(10, 2)
  currency    String   @default("EUR")
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  product     Product  @relation(fields: [productId], references: [id])
}
```

MVP package labels:

```txt
Starter
Growth
Pro
Business quote
```

---

## 11. Order Model

Purpose:

Main order record.

Suggested fields:

```prisma
model Order {
  id                 String      @id @default(cuid())
  orderNumber        String      @unique
  customerId         String?
  email              String
  companyName        String?
  contactName        String?
  status             OrderStatus @default(DRAFT)
  currency           String      @default("EUR")
  subtotalAmount     Decimal     @db.Decimal(10, 2)
  shippingAmount     Decimal?    @db.Decimal(10, 2)
  taxAmount          Decimal?    @db.Decimal(10, 2)
  totalAmount        Decimal     @db.Decimal(10, 2)
  source             String?
  isReorder          Boolean     @default(false)
  originalOrderId    String?
  reorderType        ReorderType?
  minorChangeRequested Boolean   @default(false)
  minorChangeNote    String?
  customerNotes      String?
  adminProductionNote String?

  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  customer           Customer?   @relation(fields: [customerId], references: [id])
  originalOrder      Order?      @relation("OrderReorders", fields: [originalOrderId], references: [id])
  reorderOrders      Order[]     @relation("OrderReorders")

  items              OrderItem[]
  payments           Payment[]
  artworkFiles       ArtworkFile[]
  proofFiles         ProofFile[]
  fileReviews        FileReview[]
  shipments          Shipment[]
  statusEvents       OrderStatusEvent[]
  adminNotes         AdminNote[]
}
```

Rules:

1. `orderNumber` is customer-visible.
2. Money values must be Decimal.
3. Reorder is a new order with `originalOrderId`.
4. Original order must not be mutated by reorder.
5. Do not delete orders casually.

---

## 12. OrderItem Model

Purpose:

Products inside order.

Suggested fields:

```prisma
model OrderItem {
  id                 String   @id @default(cuid())
  orderId            String
  productId          String?
  productSlug        String
  productName        String
  material           String?
  size               String?
  quantity           Int
  unitPriceSnapshot  Decimal  @db.Decimal(10, 2)
  totalPriceSnapshot Decimal  @db.Decimal(10, 2)
  createdAt          DateTime @default(now())

  order              Order    @relation(fields: [orderId], references: [id])
  product            Product? @relation(fields: [productId], references: [id])
}
```

Rules:

1. Store product snapshots.
2. Product name should be German customer-facing name.
3. Historical orders must survive product config changes.

---

## 13. Payment Model

Purpose:

Payment records.

Suggested fields:

```prisma
model Payment {
  id                      String          @id @default(cuid())
  orderId                 String
  provider                PaymentProvider @default(STRIPE)
  status                  PaymentStatus   @default(PENDING)
  amount                  Decimal         @db.Decimal(10, 2)
  currency                String          @default("EUR")
  stripeCheckoutSessionId String?
  stripePaymentIntentId   String?
  stripeCustomerId        String?
  stripeEventId           String?
  paidAt                  DateTime?
  createdAt               DateTime        @default(now())
  updatedAt               DateTime        @updatedAt

  order                   Order           @relation(fields: [orderId], references: [id])
}
```

Rules:

1. Stripe webhook creates/updates payment.
2. Success page must not mark paid.
3. Do not store card details.

---

## 14. StripeEvent Model

Purpose:

Webhook idempotency.

Suggested fields:

```prisma
model StripeEvent {
  id            String   @id @default(cuid())
  stripeEventId String   @unique
  type          String
  status        String
  errorMessage  String?
  processedAt   DateTime?
  createdAt     DateTime @default(now())
}
```

Rules:

1. Store Stripe event ID.
2. Prevent duplicate processing.
3. Return 200 for already processed events.

---

## 15. OrderStatusEvent Model

Purpose:

Audit trail for order status changes.

Suggested fields:

```prisma
model OrderStatusEvent {
  id         String     @id @default(cuid())
  orderId    String
  fromStatus OrderStatus?
  toStatus   OrderStatus
  actorType  ActorType
  actorId    String?
  reason     String?
  createdAt  DateTime   @default(now())

  order      Order      @relation(fields: [orderId], references: [id])
}
```

Rules:

1. Every status change creates event.
2. Actor can be admin/customer/system/webhook.
3. Do not allow silent status changes.

---

## 16. ArtworkFile Model

Purpose:

Uploaded customer artwork.

Suggested fields:

```prisma
model ArtworkFile {
  id                String            @id @default(cuid())
  orderId           String?
  quoteRequestId    String?
  customerId        String?
  uploadedByUserId  String?
  originalFilename  String
  safeFilename      String
  fileExtension     String
  mimeType          String?
  sizeBytes         Int
  storageProvider   String
  storageBucket     String?
  storagePath       String
  fileStatus        ArtworkFileStatus @default(UPLOADED)
  reviewStatus      String?
  replacedByFileId  String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  order             Order?            @relation(fields: [orderId], references: [id])
  quoteRequest      QuoteRequest?     @relation(fields: [quoteRequestId], references: [id])
  fileReviews       FileReview[]
}
```

Rules:

1. Files private by default.
2. Signed URLs for downloads.
3. Never overwrite old file.
4. Do not expose storage path publicly.

---

## 17. ProofFile Model

Purpose:

Admin-uploaded proof files for customer approval.

Suggested fields:

```prisma
model ProofFile {
  id                       String      @id @default(cuid())
  orderId                  String
  uploadedByAdminId         String?
  originalFilename          String
  safeFilename              String
  mimeType                  String?
  sizeBytes                 Int
  storageProvider           String
  storageBucket             String?
  storagePath               String
  proofStatus               ProofStatus @default(PENDING_ADMIN_UPLOAD)
  customerApprovedAt        DateTime?
  customerApprovedByUserId  String?
  customerApprovalIp        String?
  customerChangeRequestNote String?
  createdAt                 DateTime    @default(now())
  updatedAt                 DateTime    @updatedAt

  order                     Order       @relation(fields: [orderId], references: [id])
}
```

Rules:

1. Proof approval must be explicit.
2. Proof files private.
3. Superseded proofs remain stored.

---

## 18. FileReview Model

Purpose:

Admin technical file review.

Suggested fields:

```prisma
model FileReview {
  id                String   @id @default(cuid())
  orderId           String
  artworkFileId     String
  reviewedByAdminId String?
  status            String
  checklistJson     Json?
  adminNote         String?
  customerMessage   String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  order             Order       @relation(fields: [orderId], references: [id])
  artworkFile       ArtworkFile @relation(fields: [artworkFileId], references: [id])
}
```

Recommended statuses:

```txt
APPROVE_FILE
REQUEST_CORRECTION
REQUIRE_PROOF
REJECT_FILE
```

---

## 19. QuoteRequest Model

Purpose:

Large/custom B2B quote requests.

Suggested fields:

```prisma
model QuoteRequest {
  id                 String      @id @default(cuid())
  customerId          String?
  status             QuoteStatus @default(NEW)
  companyName         String
  contactName         String?
  email              String
  phone              String?
  country            String      @default("DE")
  website            String?
  industry           String?
  productType        String?
  labelSize          String?
  material           String?
  quantity           String?
  recurringNeed      String?
  targetDeliveryDate DateTime?
  hasArtwork         Boolean?
  notes              String?
  sourcePage         String?
  convertedOrderId   String?
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  customer           Customer?   @relation(fields: [customerId], references: [id])
  artworkFiles       ArtworkFile[]
}
```

Rules:

1. Quote request can exist before customer account.
2. Quote request can convert to order later.
3. Large quantities should use quote flow.

---

## 20. ReorderLink Model

Purpose:

Future public or secure reorder links.

Suggested fields:

```prisma
model ReorderLink {
  id              String   @id @default(cuid())
  originalOrderId String
  customerId      String?
  token           String   @unique
  status          String
  expiresAt       DateTime?
  createdAt       DateTime @default(now())
  usedAt          DateTime?

  originalOrder   Order    @relation(fields: [originalOrderId], references: [id])
}
```

MVP may use account-based reorder first.

Public token reorder must be added carefully later.

---

## 21. Shipment Model

Purpose:

Manual shipment tracking.

Suggested fields:

```prisma
model Shipment {
  id                    String       @id @default(cuid())
  orderId               String
  carrier               String?
  trackingNumber        String?
  trackingUrl           String?
  shippingMode          ShippingMode @default(DIRECT_TURKEY_TO_GERMANY)
  originCountry         String       @default("TR")
  destinationCountry    String       @default("DE")
  shippedAt             DateTime?
  deliveredAt           DateTime?
  estimatedDeliveryDate DateTime?
  packageCount          Int?
  weightKg              Decimal?     @db.Decimal(10, 2)
  notes                 String?
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  order                 Order        @relation(fields: [orderId], references: [id])
}
```

Phase 5 admin can enter shipment manually.

No carrier API required in MVP.

---

## 22. AdminNote Model

Purpose:

Internal/customer-visible notes.

Suggested fields:

```prisma
model AdminNote {
  id          String        @id @default(cuid())
  orderId     String?
  customerId  String?
  leadId      String?
  adminUserId String?
  type        AdminNoteType @default(INTERNAL)
  note        String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  order       Order?        @relation(fields: [orderId], references: [id])
  lead        Lead?         @relation(fields: [leadId], references: [id])
}
```

Rules:

1. Internal notes never shown to customer.
2. Customer-visible notes must be explicit.

---

## 23. Lead Model

Purpose:

B2B lead flow.

Suggested fields:

```prisma
model Lead {
  id                 String     @id @default(cuid())
  type               LeadType
  status             LeadStatus @default(NEW)
  score              Int        @default(0)
  quality            String?
  customerId          String?
  companyName         String?
  contactName         String?
  email              String
  phone              String?
  country            String     @default("DE")
  website            String?
  industry           String?
  productType        String?
  labelSize          String?
  material           String?
  quantity           String?
  recurringNeed      String?
  targetDeliveryDate DateTime?
  hasArtwork         Boolean?
  notes              String?

  sourceType         String?
  sourcePage         String?
  utmSource          String?
  utmMedium          String?
  utmCampaign        String?
  utmTerm            String?
  utmContent         String?
  referrer           String?
  landingPage        String?

  assignedToUserId   String?
  convertedCustomerId String?
  convertedOrderId   String?
  nextFollowUpAt     DateTime?
  followUpReason     String?

  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  customer           Customer?  @relation(fields: [customerId], references: [id])
  notesList          LeadNote[]
  adminNotes         AdminNote[]
}
```

Rules:

1. Quote/sample/contact forms create leads.
2. Source tracking is important.
3. Lead scoring should stay simple.

---

## 24. LeadNote Model

Purpose:

Sales notes for lead pipeline.

Suggested fields:

```prisma
model LeadNote {
  id          String   @id @default(cuid())
  leadId      String
  adminUserId String?
  note        String
  noteType    String?
  createdAt   DateTime @default(now())

  lead        Lead     @relation(fields: [leadId], references: [id])
}
```

---

## 25. EmailEvent Model — Optional

Purpose:

Track emails sent.

Suggested future fields:

```prisma
model EmailEvent {
  id          String   @id @default(cuid())
  customerId  String?
  orderId     String?
  leadId      String?
  type        String
  toEmail     String
  subject     String
  provider    String
  providerId  String?
  status      String
  sentAt      DateTime?
  createdAt   DateTime @default(now())
}
```

Not required in MVP but useful later.

---

## 26. Order Number Generation

Customer-visible order number format:

```txt
LP-YYYY-000001
```

Example:

```txt
LP-2026-000001
```

Rules:

1. `orderNumber` must be unique.
2. Use server-side generation.
3. Do not expose internal cuid as primary customer reference.
4. Avoid race conditions.

MVP can use timestamp + sequence if true sequence is not ready.

---

## 27. Money Rules

Use Decimal for money.

Rules:

1. Store currency on every monetary record.
2. Use EUR for customer orders.
3. Do not use floating point for money.
4. Store price snapshots on OrderItem.
5. Preserve historical order totals.
6. Do not recalculate old order totals from current product prices.

---

## 28. Privacy and GDPR Notes

Do not store unnecessary personal data.

Required:

1. Privacy policy link in lead forms.
2. Customer data used only for order/quote handling unless marketing consent is separate.
3. Do not add marketing consent into generic privacy checkbox.
4. Uploaded files are private.
5. Admin access controlled.

Future:

```txt
data export
data deletion/anonymization
retention policy
```

---

## 29. Deletion Rules

Do not hard-delete:

```txt
orders
payments
stripe events
uploaded files metadata
status events
```

If needed, use:

```txt
archivedAt
deletedAt
status = ARCHIVED
```

Actual file deletion policy should be defined later.

---

## 30. Index Recommendations

Add indexes for:

```txt
Customer.email
Order.orderNumber
Order.customerId
Order.status
Order.createdAt
Payment.stripeCheckoutSessionId
Payment.stripePaymentIntentId
StripeEvent.stripeEventId
ArtworkFile.orderId
ProofFile.orderId
QuoteRequest.email
QuoteRequest.status
Lead.email
Lead.status
Lead.score
Lead.createdAt
```

Prisma examples:

```prisma
@@index([customerId])
@@index([status])
@@index([createdAt])
```

---

## 31. MVP Schema Acceptance Criteria

Schema is accepted when:

| Check | Required Result |
|---|---|
| User/customer model exists | PASS |
| Order model exists | PASS |
| OrderItem model exists | PASS |
| Payment model exists | PASS |
| StripeEvent model exists | PASS |
| OrderStatusEvent model exists | PASS |
| ArtworkFile model exists | PASS |
| ProofFile model exists | PASS |
| QuoteRequest model exists | PASS |
| Lead model exists | PASS |
| Reorder fields exist | PASS |
| Shipment model exists | PASS |
| Money uses Decimal | PASS |
| Order statuses match docs | PASS |
| File/proof statuses match docs | PASS |
| Prisma validates | PASS |

---

## 32. Prisma Validation Checklist

Codex must run:

```txt
npx prisma validate
```

When migrations are created:

```txt
npx prisma migrate dev
```

Before production:

```txt
npx prisma migrate deploy
```

Do not claim schema is valid unless Prisma validation ran successfully.

---

## 33. Common Schema Mistakes to Avoid

Do not:

1. Store money as Float.
2. Delete payment/order history.
3. Skip StripeEvent idempotency.
4. Store uploaded files as public URLs only.
5. Skip order status event history.
6. Mix quote requests and orders without conversion.
7. Modify original order during reorder.
8. Store only current product price without snapshot.
9. Forget customer ownership on files.
10. Use English UI labels directly from enum values.
11. Hardcode product catalog into random components.
12. Create schema that cannot support admin workflow.

---

## 34. Codex Implementation Rules

Codex must:

1. Read architecture and phase docs before schema changes.
2. Use Prisma models/enums.
3. Use Decimal for money.
4. Add indexes for common queries.
5. Preserve history.
6. Avoid destructive migrations.
7. Update docs if schema changes.
8. Run Prisma validation.
9. Report migration risks.
10. Never expose sensitive fields to customer UI.

---

## 35. Final Schema Verdict

The correct schema supports:

> B2B customer, paid order, private artwork, proof approval, reorder, quote, lead flow and admin operations.

The wrong schema supports only:

> simple product checkout without file/proof/reorder history.

Labelpilot.de’s long-term value depends on saved customer label data. The database must protect that asset from day one.
