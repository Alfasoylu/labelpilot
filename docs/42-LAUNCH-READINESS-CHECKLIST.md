# 42-LAUNCH-READINESS-CHECKLIST.md

# Labelpilot.de — Launch Readiness Checklist

## 1. Purpose

This document defines launch readiness for **Labelpilot.de**.

The goal is to avoid launching a broken site, unsafe payment flow, weak legal skeleton or non-converting German B2B pages.

Launch readiness means:

```txt
public site works
forms work
SEO basics work
legal pages exist
German UI is consistent
payment/file systems are safe if enabled
analytics can measure demand
```

---

## 2. Strategic Verdict

The correct launch is:

> Small but correct German B2B MVP that can capture quote/sample demand and prove market response.

The wrong launch is:

> Large unfinished system with broken payments, weak legal pages and mixed language UI.

Launch only what works.

---

## 3. Launch Levels

### 3.1 Soft Launch

Goal:

```txt
SEO indexing
manual outreach
quote/sample lead capture
no paid checkout required
```

Required:

```txt
public pages
quote form
sample form
legal skeletons
analytics
Search Console
```

### 3.2 Paid Checkout Launch

Goal:

```txt
accept paid fixed-package orders
```

Required:

```txt
Stripe checkout
webhook
order records
payment records
success/cancel pages
manual admin handling
```

### 3.3 Operational Launch

Goal:

```txt
handle files/proofs/reorders
```

Required:

```txt
file upload
admin panel
proof approval
customer portal
reorder system
```

Do not confuse soft launch with full operational launch.

---

## 4. Soft Launch Checklist

Required:

| Check | Required |
|---|---|
| `/de` homepage works | Yes |
| P0 pages work | Yes |
| Quote form works | Yes |
| Sample box form works | Yes |
| Contact form works | Yes |
| Legal pages exist | Yes |
| Footer legal links exist | Yes |
| Metadata exists | Yes |
| Sitemap works | Yes |
| Robots works | Yes |
| Analytics installed | Yes |
| Search Console ready | Yes |
| German UI only | Yes |
| No generic print products | Yes |

---

## 5. P0 Page Checklist

Pages:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/transparente-pp-etiketten
/de/opake-pp-etiketten
/de/pp-rollenetiketten
/de/etiketten-100x200
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
```

Each must have:

```txt
German H1
metadata
canonical
direct answer
CTA
internal links
mobile layout
no English CTAs
```

---

## 6. Legal Readiness

Required:

```txt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Must include legal review warning internally if placeholders remain.

Do not claim legal compliance.

Disclaimer must appear on regulated pages.

---

## 7. SEO Readiness

Check:

```txt
sitemap.xml
robots.txt
canonicals
metadata
schema
internal links
noindex private routes
no preview URLs
no /en pages
```

Submit sitemap after production launch.

---

## 8. Form Readiness

Quote form:

```txt
validates fields
stores/sends lead
privacy checkbox
German success
admin visibility or email notification
```

Sample form:

```txt
validates fields
creates sample lead
score/qualification if implemented
privacy checkbox
German success
```

---

## 9. Payment Readiness

Only if Stripe enabled:

```txt
server price
pending order
Stripe Checkout
webhook verified
payment record
order paid by webhook only
duplicate webhook safe
failed payment safe
success page no paid mutation
```

If not ready, do not enable paid checkout.

---

## 10. File/Proof Readiness

Only if upload/proof enabled:

```txt
private storage
valid file upload
invalid file rejected
admin download
correction request
proof upload
customer approval
production gate
```

If not ready, use quote/manual flow.

---

## 11. Admin Readiness

Minimum for paid/operational launch:

```txt
admin protected
order list
order detail
quote list
lead list
file/proof actions if enabled
status transitions
tracking entry if shipping
```

If admin is not ready, do not scale paid orders.

---

## 12. Analytics Readiness

Required for launch:

```txt
GA4 or Plausible
Search Console
quote_form_submit
sample_box_submit
contact_form_submit
product_cta_click
```

Optional:

```txt
reorder_cta_click
checkout_started
checkout_completed_webhook
```

---

## 13. Business Readiness

Before outreach/ads:

```txt
offer terms clear
sample box policy clear
quote response process ready
production supplier ready
shipping assumptions known
customer support email ready
German copy reviewed
```

Do not drive traffic to a process you cannot fulfill.

---

## 14. Blockers

Do not launch paid/operational version if:

```txt
payment can be faked
webhook not working
private files public
admin unprotected
customer can access other order
legal pages missing
quote form broken
German UI mixed with English
no way to respond to leads
```

---

## 15. Launch Day Steps

1. Deploy production.
2. Check domain.
3. Check `/de`.
4. Check P0 pages.
5. Check forms.
6. Check sitemap.
7. Check robots.
8. Check legal footer.
9. Check analytics.
10. Submit sitemap to Search Console.
11. Send first manual test quote.
12. Record issues.

---

## 16. First 30 Days

Focus:

```txt
indexing
lead quality
quote requests
sample requests
manual outreach
copy improvements
conversion friction
real customer questions
```

Do not overbuild new features before market feedback.

---

## 17. Acceptance Criteria

Launch-ready when:

| Check | Required Result |
|---|---|
| Soft launch checklist complete | PASS |
| Forms working | PASS |
| SEO basics working | PASS |
| Legal pages present | PASS |
| German UI consistent | PASS |
| Analytics working | PASS |
| No blockers | PASS |
| Operational scope clear | PASS |

---

## 18. Final Verdict

Launch small but correct.

The correct first launch:

> German B2B lead-capture MVP with strong SEO/GEO foundation and quote/sample conversion.

The wrong launch:

> Unfinished full platform.

Ship what can safely collect demand. Then build paid/order/file/reorder depth.
