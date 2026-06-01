# 65-PHASE-4-FILE-UPLOAD-PROOFING.md

# Labelpilot.de — Phase 4 File Upload and Proofing

## 1. Purpose

This document defines **Phase 4 File Upload and Proofing** for Labelpilot.de.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

Phase 4 exists to implement the production-safety workflow after order/payment.

The goal is to allow customers to:

1. Upload print files.
2. Send print files later if needed.
3. See file status in German.
4. Receive correction requests.
5. Review proof files.
6. Approve proof before production.

The goal is to allow admin users to:

1. View uploaded files.
2. Download files securely.
3. Approve files.
4. Request corrected files.
5. Upload proof files.
6. Track proof approval.
7. Prevent production before approval.

This phase protects quality, margin and customer trust.

---

## 2. Phase 4 Verdict

The correct Phase 4 is:

> Private artwork upload → admin technical review → proof upload if needed → customer proof approval → production gate.

The wrong Phase 4 is:

> Customer uploads file → system automatically sends to production.

No custom label order may enter production without technical review.

---

## 3. Required Source Documents

Before implementing Phase 4, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/30-PRODUCT-CATALOG.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/64-PHASE-3-STRIPE-ORDER-FLOW.md
/docs/65-PHASE-4-FILE-UPLOAD-PROOFING.md
```

If there is conflict, stop and report it.

---

## 4. Phase 4 Language Rule

Customer-facing UI must be German only.

German customer-facing areas:

- upload labels
- file status
- proof status
- error messages
- correction messages
- proof approval screen
- customer emails
- CTA buttons

Allowed English:

- code identifiers
- database enums
- storage paths
- developer logs
- admin-only technical terms if unavoidable

Do not expose English customer UI.

---

## 5. Phase 4 Scope

Phase 4 must implement:

1. Customer artwork upload.
2. “Druckdatei später senden” flow.
3. File validation.
4. Private file storage.
5. File metadata database records.
6. Admin file review.
7. Admin file approval.
8. Admin correction request.
9. Customer replacement upload.
10. Admin proof upload.
11. Customer proof approval.
12. Customer proof change request.
13. Production gate based on approval.
14. File/proof status visibility.
15. German customer messages.
16. Signed/private file download access.

---

## 6. Phase 4 Non-Scope

Do not implement in Phase 4 unless explicitly requested:

```txt
browser design editor
AI file correction
automated preflight engine
automatic bleed detection
automatic CMYK conversion
automatic legal compliance checker
public file URLs
multi-user company file permissions
advanced version comparison UI
supplier/fason portal
production batch planning
```

Phase 4 is human review + secure file/proof workflow.

---

## 7. Supported File Types

Customer artwork upload must support:

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

Preferred print-ready formats:

```txt
PDF
AI
EPS
```

Customer-facing German helper text:

```txt
Bevorzugte Formate: PDF, AI oder EPS. Weitere akzeptierte Formate: SVG, PNG, JPG oder ZIP.
```

---

## 8. File Size Limits

Recommended limits:

| File Type | Max Size |
|---|---:|
| PDF | 50 MB |
| AI | 100 MB |
| EPS | 100 MB |
| SVG | 25 MB |
| PNG | 50 MB |
| JPG/JPEG | 50 MB |
| ZIP | 150 MB |

If provider limits are lower, update this file and implementation.

Customer-facing error:

```txt
Die Datei ist zu groß. Bitte laden Sie eine kleinere Datei hoch oder kontaktieren Sie uns.
```

---

## 9. Storage Provider

Use the file storage provider defined in `/docs/10-TECH-STACK.md`.

Recommended options:

```txt
Supabase Storage
UploadThing
```

Storage rules:

1. Files are private by default.
2. Use signed URLs for downloads.
3. Never expose permanent public URLs.
4. Do not store customer company names in storage paths.
5. Do not overwrite previous files.
6. Keep file metadata in database.
7. Admin can download all order files.
8. Customer can only access own files.

---

## 10. Storage Path Convention

Recommended path:

```txt
customers/{customerId}/orders/{orderId}/artwork/{fileId}-{safeFilename}
customers/{customerId}/orders/{orderId}/proofs/{proofId}-{safeFilename}
customers/{customerId}/quotes/{quoteRequestId}/artwork/{fileId}-{safeFilename}
```

Rules:

- Sanitize filename.
- Generate file ID.
- Keep original filename in database.
- Keep storage path private.
- Avoid spaces and special characters.

---

## 11. Required Data Models

Phase 4 requires these models or equivalent.

### 11.1 ArtworkFile

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

### 11.2 ProofFile

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

### 11.3 FileReview

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

## 12. Artwork File Statuses

Required statuses:

```txt
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
ARCHIVED
```

Customer-facing German labels:

| Internal Status | German Label |
|---|---|
| UPLOADED | Datei erhalten |
| UNDER_REVIEW | Datei wird geprüft |
| APPROVED | Datei freigegeben |
| CORRECTION_REQUIRED | Korrektur erforderlich |
| REPLACED | Datei ersetzt |
| ARCHIVED | Archiviert |

---

## 13. Proof Statuses

Required statuses:

```txt
NOT_REQUIRED
PENDING_ADMIN_UPLOAD
WAITING_CUSTOMER_APPROVAL
APPROVED
CHANGES_REQUESTED
SUPERSEDED
```

Customer-facing German labels:

| Internal Status | German Label |
|---|---|
| NOT_REQUIRED | Kein Proof erforderlich |
| PENDING_ADMIN_UPLOAD | Proof wird vorbereitet |
| WAITING_CUSTOMER_APPROVAL | Proof wartet auf Freigabe |
| APPROVED | Proof freigegeben |
| CHANGES_REQUESTED | Änderungen angefragt |
| SUPERSEDED | Durch neueren Proof ersetzt |

---

## 14. Upload Timing

Phase 4 should support these upload timings:

### 14.1 Before Checkout

If Phase 3 product configuration exists:

```txt
Produkt konfigurieren → Druckdatei hochladen → Zur Kasse
```

### 14.2 After Payment

If customer chooses send later:

```txt
Zahlung abgeschlossen → Bestellseite → Druckdatei hochladen
```

### 14.3 Correction Upload

If admin requests correction:

```txt
Korrektur erforderlich → neue Datei hochladen → erneute Prüfung
```

### 14.4 Quote Upload

If quote flow has upload support:

```txt
Angebotsformular → optionale Druckdatei hochladen
```

MVP minimum for Phase 4:

- Upload after order creation/payment
- Admin review
- Proof approval

---

## 15. Customer Upload UI

Customer upload UI must show:

1. Accepted file formats.
2. Max file size note.
3. Preferred file types.
4. Upload button.
5. “Druckdatei später senden” option if before checkout.
6. Status after upload.
7. Correction upload if needed.
8. Regulatory disclaimer.

German UI text examples:

```txt
Druckdatei hochladen
Druckdatei später senden
Datei erfolgreich hochgeladen
Datei wird technisch geprüft
Bitte korrigierte Datei hochladen
```

---

## 16. Required Upload Disclaimer

For food, beverage and supplement label orders, show:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

This disclaimer must be visible before or near upload.

---

## 17. File Validation Rules

Validate server-side:

1. File exists.
2. File extension allowed.
3. MIME type acceptable when possible.
4. File size below limit.
5. Order belongs to customer.
6. Order accepts uploads.
7. Replacement upload allowed only if correction requested or admin/customer action allows.
8. SVG is not rendered inline unsafely.
9. ZIP is stored for manual review, not automatically processed.

Client-side validation is helpful but not sufficient.

---

## 18. SVG Security Rule

SVG can contain scripts.

Rules:

1. Do not inline uploaded SVG.
2. Do not render raw SVG in browser preview.
3. Treat SVG as downloadable file.
4. Use sanitization or conversion if preview is added later.
5. Admin review required.

---

## 19. Admin File Review UI

Admin order detail must include an artwork review panel.

Required actions:

```txt
Datei herunterladen
Datei prüfen
Datei freigeben
Korrektur anfordern
Proof erforderlich
Interne Notiz hinzufügen
Kundennachricht hinzufügen
```

Admin should see:

- file name
- file type
- size
- upload date
- status
- order product
- label size
- material
- customer notes
- download action
- review checklist

---

## 20. Admin Review Checklist

Admin must be able to check:

1. Datei lässt sich öffnen.
2. Richtige Etikettengröße.
3. Richtige Ausrichtung.
4. Material passt zur Bestellung.
5. Menge passt zur Bestellung.
6. Layout passt zu 100×200 mm, wenn gewählt.
7. Beschnitt / Schneidetoleranz ist akzeptabel.
8. Text ist lesbar.
9. Bildauflösung ist akzeptabel.
10. Keine offensichtlichen fehlenden Elemente.
11. Keine falsche Datei hochgeladen.
12. Kundennotizen geprüft.
13. Rechtlicher Hinweis ist klar.
14. Proof erforderlich oder nicht erforderlich entschieden.

MVP can store checklist as JSON.

---

## 21. Admin Review Decisions

Admin decisions:

```txt
APPROVE_FILE
REQUEST_CORRECTION
REQUIRE_PROOF
REJECT_FILE
```

### 21.1 Approve File

Result:

```txt
ArtworkFile: APPROVED
Order: FILE_REVIEW → APPROVED_FOR_PRODUCTION
```

Only if proof not required.

### 21.2 Request Correction

Result:

```txt
ArtworkFile: CORRECTION_REQUIRED
Order: FILE_REVIEW
```

Customer receives German message.

Example:

```txt
Bitte laden Sie eine korrigierte Druckdatei hoch. Grund: Die Datei passt nicht zur gewählten Etikettengröße.
```

### 21.3 Require Proof

Result:

```txt
Order: FILE_REVIEW → PROOF_REQUIRED
ProofFile: PENDING_ADMIN_UPLOAD
```

### 21.4 Reject File

Result:

```txt
ArtworkFile: CORRECTION_REQUIRED
Order: FILE_REVIEW
```

Use customer-facing correction message.

---

## 22. Proof Upload UI

Admin proof upload must support:

```txt
PDF
PNG
JPG
JPEG
```

Preferred:

```txt
PDF
```

Admin proof actions:

```txt
Proof hochladen
Proof ersetzen
Proof zur Freigabe senden
```

After proof upload:

```txt
Order: PROOF_REQUIRED → WAITING_CUSTOMER_APPROVAL
ProofFile: WAITING_CUSTOMER_APPROVAL
```

---

## 23. Customer Proof Approval UI

Customer order page must show:

1. Proof file.
2. Approval explanation.
3. Approve button.
4. Request changes button.
5. Change request note field.

German buttons:

```txt
Proof freigeben
Änderungen anfragen
```

German explanation:

```txt
Bitte prüfen Sie den Proof sorgfältig. Nach Ihrer Freigabe kann die Bestellung für die Produktion vorbereitet werden.
```

Do not say production automatically starts immediately.

---

## 24. Proof Approval Logic

When customer approves:

```txt
ProofFile: APPROVED
Order: WAITING_CUSTOMER_APPROVAL → APPROVED_FOR_PRODUCTION
```

Store:

- proofFileId
- customer user ID
- approvedAt
- approval IP if available
- approval note if available

When customer requests changes:

```txt
ProofFile: CHANGES_REQUESTED
Order: WAITING_CUSTOMER_APPROVAL → FILE_REVIEW
```

Customer must enter a change note.

---

## 25. Production Gate

Production can start only if:

1. Order is paid or manually approved.
2. Artwork file is approved.
3. Proof is not required or proof is approved.
4. Admin changes status to `IN_PRODUCTION`.

Allowed:

```txt
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
```

Forbidden:

```txt
PENDING_PAYMENT → IN_PRODUCTION
PAID → IN_PRODUCTION
FILE_REVIEW → IN_PRODUCTION
PROOF_REQUIRED → IN_PRODUCTION
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION
```

Codex must enforce this server-side.

---

## 26. Customer Order Page Requirements

Customer order detail should show:

- order number
- order status
- product summary
- file status
- proof status
- upload replacement file if needed
- proof approval actions if needed
- support contact
- next step explanation

German status examples:

```txt
Ihre Datei wurde erhalten.
Ihre Datei wird technisch geprüft.
Für Ihre Datei ist eine Korrektur erforderlich.
Ihr Proof wartet auf Freigabe.
Ihre Bestellung ist für die Produktion freigegeben.
```

---

## 27. Email Notifications

If email system exists, implement these German emails.

### 27.1 Artwork Received

Subject:

```txt
Druckdatei erhalten – Labelpilot.de
```

### 27.2 Correction Required

Subject:

```txt
Korrektur Ihrer Druckdatei erforderlich
```

### 27.3 Proof Ready

Subject:

```txt
Proof zur Freigabe bereit
```

### 27.4 Proof Approved

Subject:

```txt
Proof freigegeben – nächster Schritt Produktion
```

Email can be deferred if email system is not ready, but UI statuses must work.

---

## 28. Error Messages

German customer-facing errors:

| Situation | Message |
|---|---|
| File too large | Die Datei ist zu groß. |
| Unsupported format | Dieses Dateiformat wird nicht unterstützt. |
| Upload failed | Upload fehlgeschlagen. Bitte versuchen Sie es erneut. |
| Permission denied | Sie haben keinen Zugriff auf diese Datei. |
| Missing file | Bitte laden Sie eine Druckdatei hoch oder senden Sie diese später. |
| Proof not found | Der Proof konnte nicht gefunden werden. |
| Approval failed | Die Freigabe konnte nicht gespeichert werden. |

Do not expose stack traces or provider errors.

---

## 29. Phase 4 Acceptance Criteria

Phase 4 is accepted when:

| Check | Required Result |
|---|---|
| Customer can upload valid artwork | PASS |
| Invalid file types are rejected | PASS |
| Oversized files are rejected | PASS |
| File metadata is stored | PASS |
| Files are private | PASS |
| Admin can download file securely | PASS |
| Admin can approve file | PASS |
| Admin can request correction | PASS |
| Customer can upload replacement file | PASS |
| Admin can upload proof | PASS |
| Customer can approve proof | PASS |
| Customer can request changes | PASS |
| Production gate blocks unapproved orders | PASS |
| German UI text only | PASS |
| Customer cannot access other files | PASS |

---

## 30. Phase 4 Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

1. Upload PDF.
2. Upload AI/EPS if supported by provider.
3. Upload invalid file type.
4. Upload oversized file.
5. Check private file access.
6. Admin downloads file.
7. Admin approves file.
8. Admin requests correction.
9. Customer uploads replacement.
10. Admin uploads proof.
11. Customer approves proof.
12. Customer requests changes.
13. Try to start production before approval.
14. Try customer A accessing customer B file.
15. Check German UI messages.

---

## 31. Phase 4 PASS/FAIL Report Format

Codex must report:

```txt
## Summary
- What changed

## Files Changed
- path

## File Upload Flow
- how it works

## Proof Flow
- how it works

## Checks Run
- command: result

## Acceptance Criteria
| Check | Result | Notes |
|---|---|---|

## Risks / Missing Items
- item

## Next Step
- recommended Phase 5 task
```

---

## 32. Common Phase 4 Mistakes to Avoid

Do not:

1. Make uploaded files public.
2. Skip server-side validation.
3. Overwrite old files.
4. Inline raw SVG.
5. Let production start before approval.
6. Let customer access another customer’s file.
7. Use English customer UI.
8. Build a design editor.
9. Claim legal compliance review.
10. Send proof approval automatically.
11. Lose file history.
12. Hide correction reason from customer.

---

## 33. Phase 4 Final Verdict

Phase 4 must turn Labelpilot.de into a production-safe custom label platform.

The correct implementation:

> Secure private upload → admin technical review → correction/proof if needed → customer approval → production gate.

The wrong implementation:

> Upload and produce automatically.

The file/proof workflow is not bureaucracy. It is the margin and quality protection system.
