# 12-DATABASE-SCHEMA.md — v2

# Labelpilot.de — Database Schema v2

## 1. Purpose

This v2 document updates the database schema for Labelpilot.de to support:

```txt
artwork versioning
stored designs
reorder engine
stock duration / refill prediction
variable data automation
Excel batch uploads
B2B company accounts
multi-user roles
approval limits
Net 14 tiers
template library
canvas editor
print-ready PDF generation
```

The database must protect the long-term asset:

> each customer’s saved label designs, versions, variables and reorder history.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

The schema must be expanded.

## 2. Neden: Kısa ve matematiksel

If every reorder requires manual file search:

```txt
15–30 min admin/customer friction per reorder
```

If schema stores artwork versions and reorder fields:

```txt
30 sec customer reorder
lower support cost
higher repeat rate
higher LTV
```

The schema is the moat.

---

## 3. New Core Models

Add these models to previous schema:

```txt
CompanyAccount
CompanyMember
CompanyRole
StoredDesign
ArtworkVersion
DesignVariable
VariableDataBatch
VariableDataRow
RefillPrediction
ReorderReminder
PaymentTermProfile
TemplateCategory
DesignTemplate
TemplateVersion
TemplateUsage
CanvasEditSession
GeneratedPrintFile
ApprovalRule
```

These are in addition to existing:

```txt
User
Customer
Order
OrderItem
Payment
ArtworkFile
ProofFile
QuoteRequest
Lead
Shipment
AdminNote
```

---

## 4. CompanyAccount

Purpose:

B2B account container.

Fields:

```txt
id
companyName
billingEmail
billingAddressId
vatId
country
website
industry
paymentTermProfileId
creditLimitEur
orderApprovalRequired
createdAt
updatedAt
```

Relationships:

```txt
members
customers/users
orders
storedDesigns
paymentTermProfile
```

---

## 5. CompanyMember

Purpose:

Multiple users per B2B company.

Fields:

```txt
id
companyAccountId
userId
role
status
orderLimitEur
canApproveOrders
canManageDesigns
canUploadArtwork
canManageBilling
createdAt
updatedAt
```

Roles:

```txt
OWNER
OPERATIONS_MANAGER
DESIGNER
FINANCE
PROCUREMENT
VIEWER
```

Rules:

1. OWNER controls users.
2. DESIGNER can edit/upload designs but may not pay.
3. FINANCE can view invoices/payment.
4. PROCUREMENT can reorder within limits.

---

## 6. PaymentTermProfile

Purpose:

Customer-specific payment terms.

Fields:

```txt
id
companyAccountId
tier
paymentMethod
netDays
creditLimitEur
isActive
approvedByAdminId
approvedAt
lastReviewedAt
createdAt
updatedAt
```

Tiers:

```txt
PREPAID
NET_7
NET_14
NET_30_FUTURE
MANUAL_APPROVAL
```

Rules:

1. Default is PREPAID.
2. Net 14 only for approved customers.
3. Credit limit required.
4. Stripe/custom invoice integration later.
5. Over-limit orders require admin approval.

---

## 7. StoredDesign

Purpose:

Customer-facing saved design record.

This is what customer sees under:

```txt
Saklanan Tasarımlar
Gespeicherte Designs
```

Fields:

```txt
id
companyAccountId
customerId
name
productSlug
labelSize
material
finishing
defaultQuantity
status
currentArtworkVersionId
currentProofFileId
lastOrderedAt
lastOrderId
totalOrders
createdAt
updatedAt
archivedAt
```

Status:

```txt
ACTIVE
ARCHIVED
NEEDS_REVIEW
LOCKED
```

Stores parameters:

```txt
design file
size
material
finishing
quantity history
lot field enabled
SKT field enabled
barcode field
customer notes
admin production notes
```

---

## 8. ArtworkVersion

Purpose:

Versioned design file tracking.

Fields:

```txt
id
storedDesignId
versionNumber
versionLabel
sourceType
originalArtworkFileId
generatedPrintFileId
proofFileId
status
changeSummary
uploadedByUserId
approvedByAdminId
approvedAt
createdAt
updatedAt
```

Version examples:

```txt
v1
v2
v3
```

Source types:

```txt
CUSTOMER_UPLOAD
ADMIN_UPLOAD
TEMPLATE_GENERATED
VARIABLE_DATA_GENERATED
REORDER_MINOR_CHANGE
```

Status:

```txt
DRAFT
UPLOADED
UNDER_REVIEW
APPROVED
REPLACED
ARCHIVED
REJECTED
```

Rules:

1. Never overwrite versions.
2. Reorders reference exact version.
3. Admin can find old versions in seconds.

---

## 9. DesignVariable

Purpose:

Defines editable/variable fields for a stored design.

Fields:

```txt
id
storedDesignId
key
label
type
required
defaultValue
validationRule
positionJson
isLocked
isBatchVariable
createdAt
updatedAt
```

Types:

```txt
TEXT
DATE
NUMBER
BARCODE
QR
IMAGE
LOT_NUMBER
EXPIRY_DATE
SKU
INGREDIENTS
```

Examples:

```txt
lot_number
expiry_date
barcode
product_name
flavor
```

---

## 10. VariableDataBatch

Purpose:

Batch upload for many lots/SKT rows.

Fields:

```txt
id
storedDesignId
companyAccountId
uploadedByUserId
sourceFileId
status
rowCount
validRowCount
invalidRowCount
generatedPrintFileId
adminReviewStatus
createdAt
updatedAt
```

Status:

```txt
UPLOADED
VALIDATING
VALIDATION_FAILED
READY_FOR_PREVIEW
PREVIEW_APPROVED
GENERATING_PDF
READY_FOR_ADMIN_REVIEW
APPROVED_FOR_PRODUCTION
REJECTED
```

---

## 11. VariableDataRow

Purpose:

Each Excel/CSV row.

Fields:

```txt
id
batchId
rowNumber
dataJson
validationErrorsJson
status
createdAt
updatedAt
```

Status:

```txt
VALID
INVALID
GENERATED
SKIPPED
```

Example dataJson:

```json
{
  "lot_number": "LOT-2026-04-A",
  "expiry_date": "2028-04-30",
  "barcode": "1234567890123",
  "quantity": 50
}
```

---

## 12. RefillPrediction

Purpose:

Predict when a stored design should be reordered.

Fields:

```txt
id
storedDesignId
companyAccountId
lastOrderId
lastOrderDate
lastQuantity
stockDurationMonths
oneTimePurchase
estimatedDepletionDate
confidence
method
createdAt
updatedAt
```

Stock duration options:

```txt
ONE_TIME
ONE_MONTH
THREE_MONTHS
FIVE_MONTHS
SIX_MONTHS
CUSTOM
```

Rules:

1. Ask customer during order.
2. Update after every reorder.
3. Prediction can be rule-based in MVP.

---

## 13. ReorderReminder

Purpose:

Automated reminder emails.

Fields:

```txt
id
storedDesignId
companyAccountId
orderId
predictionId
reminderType
scheduledFor
sentAt
status
customerAction
createdOrderId
createdAt
updatedAt
```

Reminder types:

```txt
THIRTY_DAYS_BEFORE
FOURTEEN_DAYS_BEFORE
CUSTOM
MANUAL
```

Status:

```txt
SCHEDULED
SENT
CLICKED
ORDER_CREATED
DISMISSED
FAILED
```

---

## 14. DesignTemplate

Purpose:

Public editable template library.

Fields:

```txt
id
categoryId
slug
title
description
industry
labelSize
materialRecommendation
previewImageUrl
templateJson
basePdfFileId
status
seoTitle
seoDescription
downloadable
editable
createdAt
updatedAt
```

Status:

```txt
DRAFT
PUBLISHED
ARCHIVED
```

Examples:

```txt
kaffee-poşeti-etiketi-minimal
supplement-kapsel-flasche-modern
sabun-premium-classic
```

German slugs should be used for public pages.

---

## 15. TemplateCategory

Purpose:

Category grouping.

Fields:

```txt
id
slug
title
description
industry
seoTitle
seoDescription
createdAt
updatedAt
```

Categories:

```txt
Kaffee
Supplemente
Seife / Kosmetik
Honig / Marmelade
Gewürze
Getränke
```

---

## 16. TemplateVersion

Purpose:

Version template definitions.

Fields:

```txt
id
templateId
versionNumber
templateJson
basePdfFileId
changeSummary
createdByAdminId
createdAt
```

Never overwrite template versions.

---

## 17. CanvasEditSession

Purpose:

User editing session in locked canvas editor.

Fields:

```txt
id
templateId
templateVersionId
companyAccountId
customerId
userId
status
editJson
previewImageUrl
generatedPrintFileId
createdAt
updatedAt
expiresAt
```

Status:

```txt
DRAFT
PREVIEW_READY
PDF_GENERATED
CONVERTED_TO_STORED_DESIGN
ABANDONED
```

---

## 18. GeneratedPrintFile

Purpose:

Backend-generated print-ready PDF output.

Fields:

```txt
id
sourceType
sourceId
storagePath
filename
mimeType
sizeBytes
colorMode
bleedMm
cropMarks
widthMm
heightMm
status
adminReviewStatus
createdAt
updatedAt
```

Source types:

```txt
TEMPLATE_EDITOR
VARIABLE_DATA_BATCH
ADMIN_EXPORT
REORDER_MINOR_CHANGE
```

Status:

```txt
GENERATING
READY
FAILED
ARCHIVED
```

Admin review status:

```txt
PENDING
APPROVED
REJECTED
```

---

## 19. Order Updates

Update Order model with:

```txt
storedDesignId
artworkVersionId
stockDurationMonths
oneTimePurchase
refillPredictionId
createdFromReminderId
paymentTermProfileId
paymentTerm
requiresApproval
approvedByCompanyMemberId
approvedAt
```

Reorder must reference:

```txt
originalOrderId
storedDesignId
artworkVersionId
```

---

## 20. OrderItem Updates

Add:

```txt
lotNumber
expiryDate
variableDataBatchId
finishing
```

For batch orders, line items may reference generated batch files.

---

## 21. Finishing Field

Add enum or controlled string:

```txt
MATTE
GLOSS
STANDARD
LAMINATED_FUTURE
NONE
```

MVP can keep `finishing` optional string.

---

## 22. Acceptance Criteria

Schema v2 accepted when:

| Check | Required |
|---|---|
| StoredDesign model defined | PASS |
| ArtworkVersion model defined | PASS |
| Variable data models defined | PASS |
| Refill prediction models defined | PASS |
| B2B account models defined | PASS |
| Payment terms model defined | PASS |
| Template library models defined | PASS |
| Canvas session model defined | PASS |
| Generated print file model defined | PASS |
| Order links to stored design/version | PASS |

---

## 23. Final Verdict

The v2 schema must make Labelpilot.de a memory system for customer labels.

If the system cannot instantly find a customer’s old label and reorder it, the schema failed.
