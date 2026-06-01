# Canonical phase = 5 (per doc 74).

# 46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md

# Labelpilot.de — Codex Phase 4 Upload and Proof Execution Prompt

## 1. Mission

Implement secure artwork upload and proof approval workflow for **Labelpilot.de**.

Goal:

```txt
private artwork upload
file validation
admin technical review
correction request
admin proof upload
customer proof approval
production gate
```

Do not send uploaded files directly to production.

---

## 2. Mandatory Reading

Read before coding:

```txt
/docs/12-DATABASE-SCHEMA.md
/docs/14-AUTH-AND-ACCOUNTS.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/65-PHASE-4-FILE-UPLOAD-PROOFING.md
/docs/46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md
```

---

## 3. Non-Negotiable Rules

1. Files private by default.
2. No permanent public file URLs.
3. Signed URLs only.
4. Validate files server-side.
5. Customer can access own files only.
6. Admin can access all files.
7. Raw SVG must not be rendered inline.
8. Proof approval must be logged.
9. Production blocked until approval.
10. Customer UI German.

---

## 4. Required Models

Use/create:

```txt
ArtworkFile
ProofFile
FileReview
OrderStatusEvent
```

Required statuses:

```txt
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
ARCHIVED
```

Proof statuses:

```txt
NOT_REQUIRED
PENDING_ADMIN_UPLOAD
WAITING_CUSTOMER_APPROVAL
APPROVED
CHANGES_REQUESTED
SUPERSEDED
```

---

## 5. Storage

Use documented storage provider.

Preferred:

```txt
Supabase Storage private bucket
```

or existing chosen provider.

Rules:

```txt
private bucket
signed downloads
metadata in database
no customer files in public/
```

---

## 6. Customer Upload UI

Implement German UI:

```txt
Druckdatei hochladen
Druckdatei später senden
Korrigierte Datei hochladen
Datei erfolgreich hochgeladen
Datei wird technisch geprüft
```

Accepted formats:

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

---

## 7. Admin Review UI

Implement admin actions:

```txt
Datei herunterladen
Datei freigeben
Korrektur anfordern
Proof erforderlich
Interne Notiz hinzufügen
Kundennachricht hinzufügen
```

Correction reason required.

---

## 8. Proof Flow

Implement:

```txt
admin uploads proof
proof stored private
customer sees proof
customer approves or requests changes
approval logged
order status updated safely
```

German buttons:

```txt
Proof freigeben
Änderungen anfragen
```

---

## 9. Production Gate

Block:

```txt
PAID → IN_PRODUCTION
FILE_REVIEW → IN_PRODUCTION
WAITING_CUSTOMER_APPROVAL → IN_PRODUCTION
```

Allow only:

```txt
APPROVED_FOR_PRODUCTION → IN_PRODUCTION
```

---

## 10. Required Tests

Run:

```txt
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

Manual tests:

```txt
valid upload
invalid type rejected
oversized rejected
file private
customer cannot access other file
admin download works
correction request works
replacement upload works
proof upload works
proof approval works
production blocked before approval
```

---

## 11. Required Report

Return:

```txt
## Summary
## Files Changed
## Upload Flow
## Proof Flow
## Security
## Checks Run
## Acceptance Criteria
## Missing / Risks
## Next Step
```

---

## 12. Acceptance Criteria

| Check | Required |
|---|---|
| Private upload | PASS |
| Server validation | PASS |
| Metadata stored | PASS |
| Admin download secure | PASS |
| Correction request works | PASS |
| Replacement upload works | PASS |
| Proof upload works | PASS |
| Customer approval works | PASS |
| Production gate enforced | PASS |
| German UI | PASS |

---

## 13. Final Instruction

The upload/proof system protects margin and trust.

Do not automate production from upload.
