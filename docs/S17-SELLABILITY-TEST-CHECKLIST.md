# S17 — End-to-End Sellability Test Checklist

**Track:** P6 — Sellability  
**Status:** Draft  
**Last updated:** 2026-06-07

---

## Purpose

This checklist walks through every stage of a live Labelpilot.de purchase from first product-page visit through artwork delivery and reorder. Run it against the staging/preview URL or production with Stripe TEST keys active (see S18).

Complete each step in order. Mark PASS / FAIL in the last column. Abort and file a bug if a FAIL blocks a downstream step.

---

## Prerequisites

- Stripe TEST keys loaded in ENV (see `S18-STRIPE-TEST-READINESS.md`)
- A valid test email address you can receive mail at
- A test PDF (any file ≤ 20 MB, CMYK or RGB)
- Admin credentials for `/admin`

---

## Step 1 — Product page → configurator

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 1.1 | `/de/pp-rollenetiketten` | Load the page | Product page renders without console errors; hero image and product title visible | |
| 1.2 | `/de/pp-rollenetiketten` | Open material selector | Dropdown / option group shows all material options (e.g. Weiss glänzend, Weiss matt, Transparent) | |
| 1.3 | `/de/pp-rollenetiketten` | Select a material | Selection is highlighted; no page reload | |
| 1.4 | `/de/pp-rollenetiketten` | Select a tier (quantity / size combination) | Price updates in configurator panel | |
| 1.5 | `/de/pp-rollenetiketten` | Inspect price display | Netto price shown (e.g. "12,50 €") AND Brutto price shown (e.g. "14,88 € inkl. MwSt.") — both visible simultaneously | |
| 1.6 | `/de/pp-rollenetiketten` | Click "In den Warenkorb" or "Jetzt kaufen" | User is redirected to checkout page OR cart drawer opens without JS error | |

---

## Step 2 — Checkout intake form

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 2.1 | `/de/checkout` (or wherever Stripe redirects) | Leave all fields blank, click submit | Inline validation errors appear for all required fields; form does not submit | |
| 2.2 | `/de/checkout` | Enter an invalid email (e.g. `foo@`) | Email field shows validation error | |
| 2.3 | `/de/checkout` | Fill in: Vorname, Nachname, Firma (optional), valid E-Mail, Straße + Hausnummer, PLZ, Ort, Land = Deutschland | All fields accept input; no error shown | |
| 2.4 | `/de/checkout` | Click submit / "Weiter zur Zahlung" | User is redirected to Stripe Checkout page (URL begins `https://checkout.stripe.com/…`) | |

---

## Step 3 — Stripe TEST payment

> Requires STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY set to TEST-mode values.  
> See `S18-STRIPE-TEST-READINESS.md` for full details and test card numbers.

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 3.1 | Stripe Checkout (redirected) | Inspect URL / page title | Stripe Checkout page in TEST mode — yellow "TEST MODE" banner visible | |
| 3.2 | Stripe Checkout | Enter card `4242 4242 4242 4242`, any future expiry, any 3-digit CVC, any ZIP | Fields accept input | |
| 3.3 | Stripe Checkout | Click "Pay" | Stripe processes payment; redirect back to Labelpilot success URL | |
| 3.4 | Stripe Checkout | Enter card `4000 0000 0000 9995` (decline scenario), click "Pay" | Stripe shows "Your card has insufficient funds." or equivalent decline message; user stays on Stripe page | |

---

## Step 4 — Post-payment success page

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 4.1 | `/de/bestellung/danke` or success URL | Observe page after successful payment | Success page renders; order reference / ID visible; "Druckdaten hochladen" or artwork-upload CTA visible | |
| 4.2 | Success page | Inspect order details block | Product name, quantity, price (netto + brutto), selected material displayed | |
| 4.3 | Inbox of test email | Wait up to 5 minutes for confirmation email | Email received with subject containing order reference; sender is a Labelpilot address (requires RESEND configured — skip with NOTE if RESEND not yet active) | |

---

## Step 5 — Artwork upload

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 5.1 | Artwork upload link (from confirmation email or success page) | Open link | Artwork upload page loads; order reference shown | |
| 5.2 | Upload page | Click upload area / "Datei auswählen" | File picker opens | |
| 5.3 | Upload page | Select a valid test PDF (≤ 20 MB) | File is accepted; upload progress indicator shown | |
| 5.4 | Upload page | Wait for upload completion | Success message shown; file listed under "Hochgeladene Dateien" | |
| 5.5 | `/admin` → order detail | Log in as admin, navigate to the order | Order row shows status "Druckdaten eingegangen" or equivalent; uploaded filename visible | |

---

## Step 6 — Proof approval

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 6.1 | `/admin` → order detail | Admin uploads a proof PDF via the proof upload control | Upload succeeds; order status changes to "Korrekturabzug bereit" or equivalent | |
| 6.2 | Inbox of test email | Wait up to 5 minutes | Customer receives "Ihr Korrekturabzug ist bereit" email with proof-approval link (requires RESEND) | |
| 6.3 | Proof approval link | Click "Freigeben" / "Approve" | Confirmation page shown; order status in `/admin` changes to "Freigegeben" | |
| 6.4 | `/admin` → order detail | Refresh page | Status persisted as "Freigegeben"; timestamp recorded | |

---

## Step 7 — Admin order management

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 7.1 | `/admin` | Log in with admin credentials | Admin dashboard loads; orders list visible | |
| 7.2 | `/admin` → orders list | Locate the test order | Order appears in list with correct reference, product, and amount | |
| 7.3 | `/admin` → order detail | Change order status to "In Produktion" (or equivalent next status) via dropdown / button | UI accepts the change | |
| 7.4 | `/admin` → order detail | Reload page | Status "In Produktion" persisted in database; no rollback | |
| 7.5 | `/admin` → order detail | Change status to "Versendet", enter a tracking number | Tracking number saved; status updated | |

---

## Step 8 — Reorder

| # | URL to visit | Action | Expected result | Pass / Fail |
|---|---|---|---|---|
| 8.1 | `/konto` | Log in as the customer who placed the test order | Account page loads; order history visible | |
| 8.2 | `/konto` → order history | Locate the test order; click "Nachbestellen" / "Reorder" | User is redirected to configurator or checkout pre-filled with the same product and options | |
| 8.3 | Checkout / configurator | Verify pre-filled values | Product, material, tier and quantity match the original order | |
| 8.4 | Checkout | Complete checkout with test card `4242 4242 4242 4242` | New order created; new order reference differs from original | |
| 8.5 | `/admin` → orders list | Refresh | New reorder appears as a separate order entry | |

---

## Sign-off

| Tester | Date | Environment | Overall result |
|---|---|---|---|
| | | staging / production + TEST keys | PASS / FAIL |

---

*See also: `S18-STRIPE-TEST-READINESS.md`, `S19-VAT-READINESS.md`*
