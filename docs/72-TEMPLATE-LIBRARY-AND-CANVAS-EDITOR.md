# 72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md

# Labelpilot.de — Template Library and Canvas Editor

## 1. Purpose

This document defines the template library and locked canvas editor for Labelpilot.de.

Goal:

```txt
customers without designers can create professional label designs
templates attract SEO traffic
outputs become print-ready stored designs
layout quality stays controlled
```

This is not a full Canva clone.

It is a locked label template editor.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap, ama MVP’den sonra

This should be built after core order/reorder/artwork system is stable.

## 2. Neden: Kısa ve matematiksel

Template library creates:

```txt
SEO traffic
lower design barrier
more first orders
template-generated stored designs
future reorder revenue
```

But editor/PDF generation is complex. Build it in controlled phases.

---

## 3. Template Library

Initial target:

```txt
30–50 templates
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

Example templates:

```txt
Kaffee poşeti etiketi minimal
Supplement kapsül şişe modern
Sabun premium classic
Honigglas natural
Gewürzglas clean label
```

German public pages should use German naming.

---

## 4. Public SEO Template Pages

Each template can be public:

```txt
/de/vorlagen/supplement-etikett-modern
/de/vorlagen/kaffee-etikett-minimal
```

Each page includes:

```txt
preview
use case
editable fields
material suggestion
CTA to edit
CTA to request quote
download/preview option
```

This can attract niche traffic.

---

## 5. Template Engine

Each template is JSON.

Required JSON fields:

```txt
id
version
title
category
dimensions
bleed
safeArea
background
defaultColors
defaultFonts
zones
editableFields
lockedElements
exportRules
```

Zone examples:

```txt
logo
brand_name
product_name
ingredients
lot_number
expiry_date
barcode
net_weight
```

---

## 6. Locked Fields

Locked:

```txt
layout
bleed
safe area
font sizes unless allowed
element positions unless allowed
barcode minimum size
crop mark rules
```

Editable:

```txt
text values
logo image
limited colors
product name
brand name
lot/SKT fields
barcode value
```

This protects print quality.

---

## 7. Canvas Editor

Recommended libraries:

```txt
Fabric.js
Konva.js
```

Use as React component.

Editor features:

```txt
render template JSON
edit allowed fields
upload logo
change allowed colors
preview front label
validate required fields
save draft
generate PDF
```

Not allowed in MVP editor:

```txt
free layout movement
random fonts
arbitrary element resizing
uncontrolled image placement
```

---

## 8. PDF Generator

Backend service generates print output.

Requirements:

```txt
merge template + user data
use base PDF or vector layout
3mm bleed
crop marks
correct dimensions
high-resolution output
admin review
```

Possible libraries:

```txt
pdf-lib
PDFKit
Sharp for raster previews
```

Important:

CMYK output may not be fully solved by simple JS libraries. Production partner testing is required.

---

## 9. Workflow

```txt
Customer chooses template
→ edits allowed fields
→ uploads logo
→ previews label
→ generates PDF
→ system creates StoredDesign
→ ArtworkVersion v1 created
→ customer orders or requests quote
```

---

## 10. Template to Stored Design

Generated design becomes:

```txt
StoredDesign
ArtworkVersion
GeneratedPrintFile
DesignVariables
```

Customer can reorder it later.

---

## 11. Admin Template Management

Admin can:

```txt
create template
upload base PDF
edit template JSON
publish/unpublish
version template
preview generated output
set category
set SEO metadata
```

---

## 12. Risks + Solutions

### Risk: Bad print output

Solution:

```txt
locked layout
limited edits
admin review
production test
```

### Risk: Building full Canva

Solution:

```txt
do not allow free design
use fixed zones only
```

### Risk: Font licensing

Solution:

```txt
use licensed/open fonts
do not expose font files improperly
```

### Risk: CMYK

Solution:

```txt
document limitations
test with printer
upgrade generator if needed
```

---

## 13. Acceptance Criteria

Template system accepted when:

| Check | Required |
|---|---|
| Template JSON schema defined | PASS |
| Categories defined | PASS |
| Locked editor rules defined | PASS |
| Canvas library options defined | PASS |
| PDF generator path defined | PASS |
| StoredDesign conversion defined | PASS |
| SEO template pages defined | PASS |
| Admin template management defined | PASS |
| Risks documented | PASS |

---

## 14. Final Verdict

Template library is an acquisition + conversion engine.

But it must stay locked and print-safe.

Do not build a freeform design toy. Build a professional label template generator.
