# 70-ARTWORK-MANAGEMENT-SYSTEM.md

# Labelpilot.de — Artwork Management System

## 1. Purpose

This document defines the Artwork Management System for Labelpilot.de.

The system must store, version, search and reuse every customer label artwork file.

Goal:

```txt
customer asks “where is last year’s label?”
admin/customer finds it in 5 seconds
customer reorders without re-uploading
```

This is a key moat against generic print shops.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

Artwork management must be a core module.

## 2. Neden: Kısa ve matematiksel

Without artwork management:

```txt
every reorder = file search + email + upload + confusion
```

With artwork management:

```txt
saved design → exact version → reorder → payment
```

This reduces labor and increases repeat rate.

---

## 3. Core Objects

The system uses:

```txt
StoredDesign
ArtworkVersion
ArtworkFile
ProofFile
GeneratedPrintFile
DesignVariable
Order
```

---

## 4. Stored Design

A stored design is the customer-facing label asset.

It stores:

```txt
customer/company
design name
product
label size
material
finishing
default quantity
current approved version
preview image
variable fields
last order
order count
```

Example:

```txt
Lara Protein Vanilla 100×200 Transparent PP
```

---

## 5. Artwork Version

Each update creates a version:

```txt
v1
v2
v3
```

Version stores:

```txt
source file
proof file
generated print file
change summary
approval status
used order IDs
upload date
approval date
```

Never overwrite.

---

## 6. File Types

Support:

```txt
PDF
AI
EPS
SVG
PNG
JPG
ZIP
Generated PDF
Preview PNG/JPG
```

Rules:

1. Originals stored private.
2. Print-ready outputs stored private.
3. Preview images can be controlled-access.
4. Signed URLs only.

---

## 7. Search Requirements

Search by:

```txt
company
customer email
design name
product name
SKU
lot number
barcode
order number
material
size
date range
version
```

Admin use case:

```txt
customer calls → search company → open saved designs → select last year design
```

Target time:

```txt
under 5 seconds
```

---

## 8. Customer UI

Customer sees:

```txt
Gespeicherte Designs
Design öffnen
Versionen ansehen
Nachbestellen
Kleine Änderung anfragen
Variable Daten aktualisieren
```

Customer does not see internal production notes.

---

## 9. Admin UI

Admin sees:

```txt
all versions
source files
proofs
generated print files
orders using version
production notes
review status
download signed file
approve version
archive version
```

---

## 10. Version Rules

1. v1 created from first upload or template.
2. v2 created for customer correction/minor change.
3. v3 created for next correction.
4. Approved version becomes current only after admin approval.
5. Reorder references exact version used.
6. Old versions remain accessible.

---

## 11. Template-Generated Artwork

If design is made from template:

```txt
Template → CanvasEditSession → GeneratedPrintFile → StoredDesign → ArtworkVersion v1
```

Source type:

```txt
TEMPLATE_GENERATED
```

---

## 12. Variable Data Artwork

If variable batch is generated:

```txt
StoredDesign + VariableDataBatch → GeneratedPrintFile
```

This may not replace base artwork version.

It creates batch production output.

---

## 13. Security

1. Customer accesses only own/company designs.
2. Admin accesses all.
3. Files private.
4. Signed URLs expire.
5. No public permanent artwork URLs.
6. Version history cannot be deleted casually.

---

## 14. Acceptance Criteria

Artwork system accepted when:

| Check | Required |
|---|---|
| StoredDesign exists | PASS |
| ArtworkVersion exists | PASS |
| Version history preserved | PASS |
| Search fields defined | PASS |
| Customer saved designs UI defined | PASS |
| Admin artwork UI defined | PASS |
| Template output path defined | PASS |
| Variable output path defined | PASS |
| Private file rules defined | PASS |

---

## 15. Final Verdict

Artwork memory is a moat.

If Labelpilot.de cannot remember and reuse customer designs better than Vistaprint/manual printers, the product is not differentiated enough.
