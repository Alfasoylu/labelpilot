# 19-CUSTOMER-PORTAL-v2.md — v2

> **Status: NOT IMPLEMENTED (live).**
> Today there is no real customer login/account portal in production. Customer access is currently token-based for specific order/upload/proof actions; real Supabase Auth and the full account/portal layer belong to canonical build phase **P3 / Auth + Account**. Read this document as target-state architecture, not current live-state behavior.

# Labelpilot.de — Customer Portal v2

## 1. Purpose

This v2 document updates the customer portal for Labelpilot.de.

The portal must support:

```txt
saved designs
artwork versions
one-click reorder
stock duration selection
refill reminders
variable lot/SKT updates
Excel batch upload
B2B multi-user company account
payment terms
template-generated designs
```

The customer portal becomes the main product, not just an account page.

---

## 2. Strategic Verdict

## 1. Hüküm: Yap

This portal expansion is necessary.

## 2. Neden: Kısa ve matematiksel

Manual reorder:

```txt
15–30 min communication
```

Portal reorder:

```txt
30 sec selection + payment/approval
```

If the customer can reorder from saved designs, repeat rate rises and support cost falls.

---

## 3. Updated Route Map

Customer routes:

```txt
/konto
/konto/bestellungen
/konto/bestellungen/[orderId]
/konto/designs
/konto/designs/[designId]
/konto/designs/[designId]/versionen
/konto/designs/[designId]/nachbestellen
/konto/designs/[designId]/variablen
/konto/designs/[designId]/batch-upload
/konto/nachbestellen
/konto/erinnerungen
/konto/firma
/konto/firma/mitglieder
/konto/firma/zahlung
/konto/profil
```

German UI labels:

```txt
Meine Bestellungen
Saklanan Tasarımlar / Gespeicherte Designs
Yeniden sipariş ver / Nachbestellen
Variablen bearbeiten
Lot und SKT eingeben
Excel hochladen
Erinnerungen
Firma
Mitglieder
Zahlungsbedingungen
```

Use German consistently in product UI. Turkish text here explains concept only.

---

## 4. Saved Designs Page

Route:

```txt
/konto/designs
```

Purpose:

Customer sees all stored label designs.

Each card shows:

```txt
design name
preview image
product
material
size
finishing
current version
last ordered date
last quantity
reorder button
variable data badge
```

Primary CTA:

```txt
Nachbestellen
```

Secondary CTA:

```txt
Versionen ansehen
```

---

## 5. Stored Design Detail

Route:

```txt
/konto/designs/[designId]
```

Sections:

```txt
Design preview
Current approved version
Technical specs
Material
Size
Finishing
Default quantity
Lot/SKT fields
Order history
Reminder settings
Files and versions
Admin/customer notes visible to customer
```

Customer must not see internal notes or costs.

---

## 6. Artwork Versions

Route:

```txt
/konto/designs/[designId]/versionen
```

Show:

```txt
v1
v2
v3
upload date
approved date
change summary
proof file if available
used in which orders
```

Customer should be able to find old labels quickly.

Use case:

```txt
“Geçen yılki etiket nerede?”
```

Target:

```txt
5 seconds.
```

---

## 7. One-Click Reorder

Route:

```txt
/konto/designs/[designId]/nachbestellen
```

Flow:

```txt
select saved design
select quantity
select stock duration
confirm same version or minor change
enter lot/SKT if enabled
pay or request Net 14 approval
order created
```

Quantity examples:

```txt
1.000
2.000
5.000
10.000
20.000+ Angebot
```

German stock question:

```txt
Für wie viele Monate soll dieser Etikettenbestand reichen?
```

Options:

```txt
Einmalige Bestellung
1 Monat
3 Monate
5 Monate
6 Monate
Andere Dauer
```

---

## 8. Refill Reminder Settings

Route:

```txt
/konto/erinnerungen
```

Customer can see:

```txt
design
last order
estimated depletion
next reminder
reminder active/inactive
```

German labels:

```txt
Geschätzter Verbrauch
Nächste Erinnerung
Erinnerung aktivieren
Erinnerung pausieren
```

Default automation:

```txt
30 days before predicted depletion
```

---

## 9. Variable Data UI

For supplement and batch customers.

Route:

```txt
/konto/designs/[designId]/variablen
```

Fields:

```txt
Lotnummer
Mindesthaltbarkeitsdatum / SKT
Barcode
SKU
Produktvariante
```

Customer can:

```txt
enter manually
upload Excel/CSV
preview rows
fix validation errors
generate batch proof
```

---

## 10. Excel Batch Upload

Route:

```txt
/konto/designs/[designId]/batch-upload
```

Required flow:

```txt
download sample Excel template
upload file
system validates columns
show preview table
highlight errors
customer confirms
system generates batch print file
admin reviews
```

Required columns depend on design variables.

Example:

```txt
lot_number
expiry_date
barcode
quantity
```

German UI:

```txt
Excel-Datei hochladen
Vorlage herunterladen
Fehler prüfen
Batch-Datei erstellen
```

---

## 11. B2B Company Portal

Route:

```txt
/konto/firma
```

Company owner can manage:

```txt
company profile
billing email
billing address
VAT ID
members
roles
order limits
payment terms
```

---

## 12. Company Members

Route:

```txt
/konto/firma/mitglieder
```

Roles:

```txt
Inhaber
Operations Manager
Designer
Finanzen
Einkauf
Betrachter
```

Permissions:

| Role | Can Upload | Can Edit Template | Can Reorder | Can Pay | Can Manage Billing |
|---|---|---|---|---|---|
| Owner | Yes | Yes | Yes | Yes | Yes |
| Operations | Yes | Yes | Yes | Limited | No |
| Designer | Yes | Yes | No/limited | No | No |
| Finance | No | No | No | Yes | Yes |
| Procurement | No | No | Yes | Limited | No |
| Viewer | No | No | No | No | No |

---

## 13. Payment Terms UI

Route:

```txt
/konto/firma/zahlung
```

Show:

```txt
current payment method
prepaid or Net 14
credit limit
open invoices
available credit
orders requiring approval
```

Net 14 label:

```txt
Zahlungsziel 14 Tage
```

Default:

```txt
Vorkasse / Stripe-Zahlung
```

---

## 14. Template-Created Designs

If customer uses template library:

```txt
template edit session → generated print file → stored design
```

Portal should show source:

```txt
Aus Vorlage erstellt
```

Customer can reorder template-created designs like uploaded designs.

---

## 15. Security Rules

1. Customer sees only company designs if member.
2. Role permissions enforced server-side.
3. Designer cannot place paid order unless allowed.
4. Finance cannot edit artwork unless allowed.
5. Stored design versions private.
6. Signed URLs only.
7. Batch uploads validated server-side.
8. Net 14 orders checked against credit limit.

---

## 16. Acceptance Criteria

Customer portal v2 accepted when:

| Check | Required |
|---|---|
| Saved designs page defined | PASS |
| Artwork versions visible | PASS |
| One-click reorder flow defined | PASS |
| Stock duration question defined | PASS |
| Refill reminder UI defined | PASS |
| Variable data UI defined | PASS |
| Excel batch upload defined | PASS |
| Company members defined | PASS |
| Role permissions defined | PASS |
| Payment terms UI defined | PASS |
| Security rules defined | PASS |

---

## 17. Final Verdict

The customer portal must become the customer’s label operating system.

If the portal only shows order history, it is too weak.

The portal must make repeat orders faster than manual matbaa communication.
> AUTHORITATIVE. Supersedes `19-CUSTOMER-PORTAL-v2.md`. See `/docs/00-SOURCE-OF-TRUTH.md`.
