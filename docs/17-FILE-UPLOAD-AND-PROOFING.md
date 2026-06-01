# 17-FILE-UPLOAD-AND-PROOFING.md

# Labelpilot.de — File Upload and Proofing

## 1. Purpose

This document defines the file upload and proofing architecture for **Labelpilot.de**.

Labelpilot.de sells custom printed PP roll labels and thermal labels to German B2B customers.

Because every printed label depends on customer artwork, the file upload and proofing system is a core business function.

This document is the source of truth for Codex when implementing:

- Artwork upload
- File validation
- Secure file storage
- Admin file review
- Proof file upload
- Customer proof approval
- Correction requests
- Reorder file reuse
- Production readiness

---

## 2. Core Principle

The system must protect the business from bad files and production mistakes.

The correct workflow is:

> Customer uploads artwork → admin reviews file → proof is approved if required → production starts.

The wrong workflow is:

> Customer uploads artwork → payment happens → production starts automatically.

No custom printed order should enter production before file review.

---

## 3. File Upload Role in the Business Model

File handling supports the core Labelpilot.de advantage:

1. Customer artwork is stored.
2. Technical label specifications are stored.
3. Future reorders become easier.
4. Support cost decreases after first order.
5. Customer switching cost increases.
6. Repeat orders become faster and more profitable.

File upload is not only a technical feature.

It is part of the reorder engine.

---

## 4. Supported File Types

MVP must support these file types:

```txt
PDF
AI
EPS
SVG
PNG
JPG
JPEG
ZIP
```

Preferred production-ready formats:

```txt
PDF
AI
EPS
```

Acceptable review formats:

```txt
SVG
PNG
JPG
JPEG
```

ZIP is allowed when customers upload multiple files or packaged design assets.

---

## 5. File Type Rules

| File Type | Status | Notes |
|---|---|---|
| PDF | Preferred | Best for print-ready artwork |
| AI | Preferred | Adobe Illustrator source file |
| EPS | Preferred | Vector-friendly |
| SVG | Accepted | Needs review before production |
| PNG | Accepted | Must be high resolution |
| JPG/JPEG | Accepted | Must be high resolution |
| ZIP | Accepted | Admin must review contents manually |

Codex must not assume every uploaded file is production-ready.

All uploads require admin review.

---

## 6. File Size Limits

Recommended MVP limits:

| File Type | Max Size |
|---|---:|
| PDF | 50 MB |
| AI | 100 MB |
| EPS | 100 MB |
| SVG | 25 MB |
| PNG | 50 MB |
| JPG/JPEG | 50 MB |
| ZIP | 150 MB |

These values can be adjusted later.

The system must reject files above the configured limit.

---

## 7. Upload Timing Options

The system should support file upload at multiple points.

### 7.1 Before Checkout

Best for standard product orders.

Flow:

```txt
Product configuration
→ Artwork upload
→ Customer details
→ Stripe checkout
```

### 7.2 After Checkout

Useful for B2B customers who want to pay first or send file later.

Flow:

```txt
Product configuration
→ Checkout
→ Payment
→ Customer account/order page
→ Upload artwork
```

### 7.3 Quote Request Upload

Useful for custom or large B2B quote requests.

Flow:

```txt
Quote request form
→ Optional artwork upload
→ Admin reviews quote
```

### 7.4 Correction Upload

Used when admin rejects the first file.

Flow:

```txt
Admin requests correction
→ Customer uploads replacement file
→ Admin reviews again
```

### 7.5 Reorder File Reuse

Used when customer reorders previous label.

Flow:

```txt
Customer clicks reorder
→ Previous approved artwork/specs loaded
→ Customer confirms reuse or requests minor change
```

---

## 8. Upload UX Requirements

Customer upload interface must be simple.

It should communicate:

1. Accepted file formats.
2. Maximum file size.
3. Preferred print-ready formats.
4. That files will be reviewed before production.
5. That production starts only after approval.
6. That legal/regulatory content is customer responsibility.

Suggested German helper copy:

```txt
Laden Sie Ihre Druckdatei hoch. Bevor wir produzieren, prüfen wir die Datei technisch und melden uns, falls etwas fehlt.
```

Suggested English internal meaning:

> Upload your print file. Before production, we technically review the file and contact you if anything is missing.

---

## 9. Regulatory Disclaimer Near Upload

For food, beverage and supplement labels, the upload page must show a disclaimer.

German-facing copy:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und sonstige regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

English internal meaning:

> The customer is responsible for legal mandatory information, ingredients, nutrition values, allergens, health claims and regulatory content. Labelpilot.de provides print production, file review and layout support, not legal review.

This disclaimer is mandatory.

---

## 10. File Storage Architecture

Canonical MVP storage provider:

1. Supabase Storage

Final decision belongs in `/docs/10-TECH-STACK.md`.

Alternatives considered (not used in MVP):

1. UploadThing

Storage rules:

- Files must be private by default.
- Public URLs must not be used for customer artwork.
- Admin downloads should use signed URLs.
- Customer downloads should use signed URLs or authenticated routes.
- File paths must not expose sensitive customer data.
- Original files must be preserved.
- Replacement files must not overwrite old files.

---

## 11. Storage Path Convention

Recommended path format:

```txt
customers/{customerId}/orders/{orderId}/artwork/{fileId}-{safeFilename}
customers/{customerId}/orders/{orderId}/proofs/{proofId}-{safeFilename}
customers/{customerId}/quotes/{quoteRequestId}/artwork/{fileId}-{safeFilename}
```

Example:

```txt
customers/cus_123/orders/ord_456/artwork/file_789-label-design.pdf
```

Rules:

- Sanitize filenames.
- Keep original filename in database.
- Use generated file IDs in storage path.
- Avoid storing customer company name in file path.
- Avoid spaces and special characters in storage path.

---

## 12. Database Models

The full schema belongs in `/docs/12-DATABASE-SCHEMA.md`.

Minimum required models:

```txt
ArtworkFile
ProofFile
FileReview
```

### 12.1 ArtworkFile

Suggested fields:

```txt
ArtworkFile
- id
- orderId
- quoteRequestId
- customerId
- uploadedByUserId
- originalFilename
- safeFilename
- fileExtension
- mimeType
- sizeBytes
- storageProvider
- storageBucket
- storagePath
- fileStatus
- reviewStatus
- replacedByFileId
- createdAt
- updatedAt
```

### 12.2 ProofFile

Suggested fields:

```txt
ProofFile
- id
- orderId
- uploadedByAdminId
- originalFilename
- safeFilename
- mimeType
- sizeBytes
- storageProvider
- storageBucket
- storagePath
- proofStatus
- customerApprovedAt
- customerApprovedByUserId
- customerApprovalIp
- customerChangeRequestNote
- createdAt
- updatedAt
```

### 12.3 FileReview

Suggested fields:

```txt
FileReview
- id
- orderId
- artworkFileId
- reviewedByAdminId
- status
- checklistJson
- adminNote
- customerMessage
- createdAt
- updatedAt
```

---

## 13. Artwork File Statuses

Artwork file statuses:

```txt
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
ARCHIVED
```

### Status Meanings

| Status | Meaning |
|---|---|
| UPLOADED | File received but not reviewed |
| UNDER_REVIEW | Admin is reviewing file |
| APPROVED | File is approved for proof/production |
| CORRECTION_REQUIRED | Customer must upload corrected file |
| REPLACED | Customer uploaded a newer file |
| ARCHIVED | File kept for history but no longer active |

---

## 14. Proof File Statuses

Proof file statuses:

```txt
NOT_REQUIRED
PENDING_ADMIN_UPLOAD
WAITING_CUSTOMER_APPROVAL
APPROVED
CHANGES_REQUESTED
SUPERSEDED
```

### Status Meanings

| Status | Meaning |
|---|---|
| NOT_REQUIRED | Admin decided no proof needed |
| PENDING_ADMIN_UPLOAD | Proof must be uploaded |
| WAITING_CUSTOMER_APPROVAL | Customer must approve |
| APPROVED | Customer approved proof |
| CHANGES_REQUESTED | Customer requested changes |
| SUPERSEDED | Newer proof replaced this proof |

---

## 15. Admin File Review Checklist

Admin must review uploaded artwork before production.

Checklist:

1. File opens correctly.
2. Correct label size.
3. Correct orientation.
4. Correct material selected.
5. Correct quantity selected.
6. Artwork fits 100×200 mm if selected.
7. Bleed/cut margin is acceptable.
8. Text is readable.
9. Image resolution is acceptable.
10. Colors are acceptable for production.
11. No obvious missing elements.
12. No wrong product file uploaded.
13. Customer notes reviewed.
14. Legal/regulatory disclaimer acknowledged where relevant.
15. Proof required or not required decision made.

Codex should allow admin to store review checklist data.

MVP may use a simple JSON checklist.

---

## 16. File Review Decisions

Admin can make these decisions:

```txt
APPROVE_FOR_PRODUCTION
REQUEST_CORRECTION
REQUIRE_PROOF
REJECT_FILE
PUT_ON_HOLD
```

### 16.1 Approve for Production

Used when file is ready and proof is not needed.

Status changes:

```txt
ArtworkFile: APPROVED
Order: FILE_REVIEW → APPROVED_FOR_PRODUCTION
```

### 16.2 Request Correction

Used when customer must upload a corrected file.

Status changes:

```txt
ArtworkFile: CORRECTION_REQUIRED
Order: stays FILE_REVIEW
```

Customer receives correction email.

### 16.3 Require Proof

Used when proof approval is needed.

Status changes:

```txt
Order: FILE_REVIEW → PROOF_REQUIRED
ProofFile: PENDING_ADMIN_UPLOAD
```

### 16.4 Reject File

Used when file is unusable or unrelated.

Status changes:

```txt
ArtworkFile: CORRECTION_REQUIRED
Order: FILE_REVIEW
```

### 16.5 Put On Hold

Optional operational workflow.

If used, `PUT_ON_HOLD` maps to the canonical `OrderStatus.ON_HOLD`.

---

## 17. Proof Upload Flow

Admin proof flow:

```txt
Order FILE_REVIEW
→ Admin selects “Require proof”
→ Order PROOF_REQUIRED
→ Admin uploads proof file
→ ProofFile created
→ Order WAITING_CUSTOMER_APPROVAL
→ Customer notified
```

Proof file can be:

```txt
PDF
PNG
JPG
```

Preferred:

```txt
PDF
```

Proof should show:

- final layout
- label size
- trim/cut indication if possible
- customer artwork
- important production note if needed

---

## 18. Customer Proof Approval Flow

Customer sees proof in account/order page.

Customer actions:

1. Approve proof.
2. Request changes.
3. Upload corrected artwork.
4. Add note.

### 18.1 Approve Proof

When customer approves:

```txt
ProofFile: APPROVED
Order: WAITING_CUSTOMER_APPROVAL → APPROVED_FOR_PRODUCTION
```

Store:

- approvedAt
- approvedByUserId
- proofFileId
- IP address if available
- approval note if available

### 18.2 Request Changes

When customer requests changes:

```txt
ProofFile: CHANGES_REQUESTED
Order: WAITING_CUSTOMER_APPROVAL → FILE_REVIEW
```

Customer must provide note.

Admin reviews again.

---

## 19. Production Gate

This is non-negotiable.

Order can enter production only if:

1. Order is paid or manually approved.
2. Artwork file is approved.
3. Proof is either not required or approved.
4. Admin changes status to `IN_PRODUCTION`.

Allowed production transition:

```txt
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
```

Forbidden:

```txt
PAID → IN_PRODUCTION
FILE_REVIEW → IN_PRODUCTION
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION
PENDING_PAYMENT → IN_PRODUCTION
```

Codex must enforce this server-side.

---

## 20. Reorder File Reuse

Reorder should reuse previous artwork and specs.

When customer reorders:

- Copy original product configuration.
- Link previous approved artwork file.
- Link previous approved proof if available.
- Allow customer to choose same quantity or new quantity.
- Allow “minor change requested” option.
- If no changes requested, admin may approve faster.
- If changes requested, file review/proof may be required again.

### Reorder File Rule

Never overwrite original artwork.

Create new order with reference to previous file.

---

## 21. Minor Change Request

For reorders, customer may request minor change.

Examples:

- Change batch number.
- Change expiry date.
- Change barcode.
- Change flavor name.
- Change small text field.

This should create a note:

```txt
minorChangeRequested: true
minorChangeNote: string
```

Admin decides whether new proof is required.

---

## 22. Versioning

File versioning matters.

Rules:

1. Every upload gets a new file record.
2. Replacement files do not overwrite old files.
3. Proof files can be superseded.
4. Order detail should show active file and history.
5. Reorder should use the last approved file by default.
6. Admin can select another file if needed.

---

## 23. File Security

Non-negotiable security rules:

1. Files are private by default.
2. Use signed URLs for downloads.
3. Customers can only access their own files.
4. Admins can access all files.
5. Validate file type.
6. Validate file size.
7. Sanitize filenames.
8. Do not execute uploaded files.
9. Do not render unsafe SVG directly without sanitization.
10. Do not expose storage paths publicly.
11. Do not store secrets in metadata.
12. Do not rely only on client-side validation.

---

## 24. SVG Security Note

SVG files can contain scripts or unsafe markup.

Rules:

- Do not inline uploaded SVG in the frontend.
- Treat SVG as a file for download/review.
- If preview is needed, sanitize first or render through safe conversion.
- Admin review is required before production.

---

## 25. Preview Requirements

MVP preview can be basic.

Customer/admin can see:

- filename
- file type
- file size
- upload date
- status
- download link

Optional future previews:

- PDF thumbnail
- Image preview
- Proof comparison
- Preflight warnings

Do not delay MVP for advanced preview.

---

## 26. Admin UI Requirements

Admin order detail must show:

### Artwork Section

- uploaded files
- active file
- file status
- download button
- approve button
- request correction button
- require proof button
- admin notes
- customer-facing correction message

### Proof Section

- proof files
- proof status
- upload proof button
- mark proof not required
- customer approval timestamp
- customer change notes

### Production Gate

Admin should see a clear warning:

```txt
Production cannot start until file/proof approval is complete.
```

---

## 27. Customer UI Requirements

Customer order page must show:

- uploaded artwork status
- whether correction is required
- upload replacement file button
- proof file if waiting for approval
- approve proof button
- request changes button
- reorder button after completion

German status copy should be simple.

Examples:

```txt
Datei erhalten
Datei wird geprüft
Korrektur erforderlich
Proof wartet auf Freigabe
Proof freigegeben
Bereit für Produktion
```

---

## 28. Email Notifications

Required email triggers:

| Event | Email |
|---|---|
| Artwork uploaded | artwork-received |
| File correction required | file-correction-requested |
| Proof uploaded | proof-ready |
| Proof approved | proof-approved |
| Changes requested | proof-changes-requested |
| File approved | file-approved |
| Production approved | production-approved |

Customer emails should be German-first.

---

## 29. Error Handling

Common upload errors:

| Error | Customer Message |
|---|---|
| File too large | Datei ist zu groß. Bitte laden Sie eine kleinere Datei hoch. |
| Unsupported format | Dieses Dateiformat wird nicht unterstützt. |
| Upload failed | Upload fehlgeschlagen. Bitte versuchen Sie es erneut. |
| Missing file | Bitte laden Sie eine Druckdatei hoch oder senden Sie diese später. |
| Permission denied | Sie haben keinen Zugriff auf diese Datei. |

Do not expose internal technical errors to customer.

---

## 30. MVP Scope

MVP must include:

1. Upload artwork for standard order.
2. Upload artwork for quote request.
3. Store file metadata.
4. Private file storage.
5. Admin download.
6. Admin approve/reject/request correction.
7. Admin upload proof.
8. Customer proof approval.
9. Customer change request.
10. Production gate based on file/proof status.
11. Reorder file reuse.
12. Basic file status emails.

MVP must not include:

- Advanced automated preflight.
- AI file correction.
- Browser-based design editor.
- Automatic dieline generation.
- Automatic legal compliance checker.
- Public file URLs.
- Complex multi-user file permissions.
- Full version comparison UI.

---

## 31. Future Enhancements

Future phases may add:

1. Automated PDF preflight.
2. Bleed detection.
3. Resolution warning.
4. CMYK/RGB warning.
5. Barcode readability check.
6. Customer design editor.
7. Template library.
8. Batch/expiry variable data fields.
9. Version comparison.
10. Automated proof generation.
11. Supplier/fason production file export.
12. Production-ready file lock.
13. Hub-specific file packaging.

---

## 32. Acceptance Criteria

File upload/proofing is accepted when:

1. Customer can upload valid artwork.
2. Invalid file types are rejected.
3. Oversized files are rejected.
4. File metadata is stored.
5. File is private.
6. Admin can download file.
7. Admin can approve file.
8. Admin can request correction.
9. Customer can upload replacement file.
10. Admin can upload proof.
11. Customer can approve proof.
12. Customer can request changes.
13. Production cannot start without required approvals.
14. Reorder can reuse previous approved artwork.
15. Customer cannot access another customer’s file.

---

## 33. Codex Implementation Rules

Codex must:

1. Read `/docs/00-PROJECT-BRIEF.md`.
2. Read `/docs/11-ARCHITECTURE.md`.
3. Read `/docs/16-ORDER-FLOW.md`.
4. Follow this file upload and proofing document.
5. Keep files private.
6. Use signed URLs for downloads.
7. Validate file type and size server-side.
8. Never overwrite original artwork.
9. Log file review decisions.
10. Keep proof approval explicit.
11. Prevent production before approval.
12. Treat reorder file reuse as core business logic.
13. Do not build a design editor in MVP.
14. Do not claim legal compliance review.

---

## 34. Final Verdict

The correct file architecture is:

> Secure upload → admin technical review → proof if required → customer approval → production gate → saved artwork for reorder.

The wrong architecture is:

> Upload file → auto-production without review.

Labelpilot.de must use file handling as a quality-control system and a repeat-order moat.
