# 71-VARIABLE-DATA-AUTOMATION.md

# Labelpilot.de — Variable Data Automation

## 1. Purpose

This document defines variable data automation for Labelpilot.de.

This module is mandatory for supplement and batch-based customers.

It supports:

```txt
lot numbers
SKT / expiry dates
barcodes
SKU codes
batch labels
Excel/CSV uploads
automatic print-ready batch PDF generation
```

Without this module, supplement customers require manual artwork changes for every lot.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

Build this module if supplement segment is a serious target.

## 2. Neden: Kısa ve matematiksel

Manual process:

```txt
50 lots × manual file edit = high labor + error risk
```

Automated process:

```txt
Excel upload → validate → preview → batch PDF
```

This enables supplement customers at scale.

---

## 3. Variable Fields

Common fields:

```txt
lot_number
expiry_date
barcode
sku
product_variant
batch_quantity
manufacturing_date
```

German labels:

```txt
Lotnummer
Mindesthaltbarkeitsdatum / SKT
Barcode
SKU
Produktvariante
Menge
Herstellungsdatum
```

---

## 4. Design Variable Setup

Each StoredDesign can define variable zones:

```txt
field key
field label
type
required
format rule
position
font constraints
max length
barcode type
```

Example:

```txt
lot_number: required text
expiry_date: required date
barcode: optional EAN13
```

---

## 5. Manual Entry Flow

Customer can enter:

```txt
Lotnummer
SKT
Barcode
quantity
```

Use for simple reorder.

---

## 6. Excel Upload Flow

Customer flow:

```txt
download template Excel
fill rows
upload Excel/CSV
system validates
preview table
customer fixes errors
confirm batch
system generates batch output
admin reviews
```

Required UI:

```txt
Vorlage herunterladen
Excel-Datei hochladen
Fehler prüfen
Batch erstellen
```

---

## 7. Validation Rules

Validate:

```txt
required fields present
date format valid
expiry date not in past unless allowed
barcode length/type valid
lot number max length
quantity numeric
no empty rows
no unsupported characters
```

Errors shown row-by-row.

Do not generate print file if validation fails.

---

## 8. Batch Output

Generated output:

```txt
print-ready PDF
preview PDF
row summary
error report
```

Each row may generate:

```txt
one label variation
specific quantity
```

Admin must review before production.

---

## 9. Print Quality Requirements

Output must preserve:

```txt
locked layout
font constraints
safe area
bleed
crop marks if required
resolution
barcode readability
```

For MVP, outputs must be tested with production partner.

CMYK handling may require professional print workflow later.

---

## 10. Admin Review

Admin sees:

```txt
batch file
row count
valid rows
invalid rows
generated PDF
preview
customer design
approval button
reject with reason
```

Admin can approve batch for production.

---

## 11. Supplement-Specific Rule

If a design has required lot/SKT fields:

```txt
reorder cannot proceed without confirming new values
```

This prevents accidentally printing old lot/SKT.

---

## 12. Data Model

Use:

```txt
DesignVariable
VariableDataBatch
VariableDataRow
GeneratedPrintFile
StoredDesign
ArtworkVersion
```

---

## 13. Risks + Solutions

### Risk: Wrong SKT printed

Solution:

```txt
customer preview + confirmation
admin review
clear variable table
```

### Risk: Excel format errors

Solution:

```txt
downloadable template
strict validation
row-level errors
```

### Risk: barcode unreadable

Solution:

```txt
barcode validation
minimum size rules
preview check
admin review
```

---

## 14. Acceptance Criteria

Variable data automation accepted when:

| Check | Required |
|---|---|
| Variable fields defined | PASS |
| Manual entry flow defined | PASS |
| Excel upload flow defined | PASS |
| Validation rules defined | PASS |
| Batch output defined | PASS |
| Admin review defined | PASS |
| Supplement no-old-lot rule defined | PASS |
| Generated print file path defined | PASS |

---

## 15. Final Verdict

Variable data automation is the supplement wedge.

Without it, every supplement lot becomes manual design labor.

With it, Labelpilot.de becomes operational infrastructure.
