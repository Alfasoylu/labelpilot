# 40-VERCEL-DEPLOYMENT-CHECKLIST.md

# Labelpilot.de — Vercel Deployment Checklist

## 1. Purpose

This document defines Vercel deployment requirements for **Labelpilot.de**.

The site will be deployed through:

```txt
GitHub → Vercel → labelpilot.de
```

Deployment must not expose secrets, break SEO, use wrong Stripe keys or point canonicals to preview domains.

---

## 2. Strategic Verdict

The correct deployment system is:

> GitHub-controlled deploys, preview environments for testing, production env variables in Vercel, production domain canonicals and post-deploy smoke tests.

The wrong system is:

> Push directly, hope it works, forget env variables, and let Google index preview URLs.

Deployment discipline protects revenue and SEO.

---

## 3. Vercel Projects

Recommended environments:

```txt
Development
Preview
Production
```

Use:

```txt
main branch → production
feature branches / PRs → preview
```

Do not test risky database migrations directly on production.

---

## 4. Production Domain

Production domain:

```txt
labelpilot.de
```

Canonical base URL:

```txt
https://labelpilot.de
```

Required env:

```txt
NEXT_PUBLIC_APP_URL=https://labelpilot.de
```

Do not use Vercel preview URL as canonical.

---

## 5. Required Vercel Env Variables

Production:

```txt
NEXT_PUBLIC_APP_URL
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
EMAIL_FROM
EMAIL_REPLY_TO
APP_SECRET
```

Only add enabled integrations.

---

## 6. Preview Env Rules

Preview should use:

```txt
Stripe test keys
preview/staging database if possible
preview app URL
test email mode if possible
```

Do not use Stripe live keys in preview.

---

## 7. Production Stripe Rules

Production Stripe requires:

```txt
live secret key
live publishable key
production webhook secret
webhook endpoint https://labelpilot.de/api/stripe/webhook
```

Do not use local webhook secret in production.

---

## 8. Supabase Rules

Production must use:

```txt
production Supabase database
DATABASE_URL runtime connection
DIRECT_URL migration connection
private storage bucket
service role server-only
```

Do not expose service role key.

---

## 9. Build Commands

Expected:

```txt
npm install
npm run build
```

Additional checks before deploy:

```txt
npm run lint
npm run typecheck
npx prisma validate
```

If scripts differ, use repo scripts and document them.

---

## 10. Prisma Migration Deployment

Before production:

```txt
npx prisma migrate deploy
```

Rules:

1. Use `DIRECT_URL`.
2. Review destructive migrations.
3. Backup if needed.
4. Do not run dev migrations against production.

---

## 11. SEO Deployment Checks

After deployment:

```txt
https://labelpilot.de/de
https://labelpilot.de/sitemap.xml
https://labelpilot.de/robots.txt
```

Check:

```txt
canonicals use labelpilot.de
P0 pages indexable
admin/konto/checkout noindex
no preview URLs in metadata
no English MVP pages
```

---

## 12. Smoke Test Routes

Test:

```txt
/de
/de/supplement-etiketten
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/impressum
/de/datenschutz
/sitemap.xml
/robots.txt
```

Later when implemented:

```txt
/checkout/success
/admin
/konto
/api/stripe/webhook
```

---

## 13. Form Smoke Tests

Test:

```txt
quote request form
sample box form
contact form
```

Confirm:

```txt
validation works
privacy checkbox required
success message German
database/email action works if implemented
```

---

## 14. Payment Smoke Tests

Only when Stripe phase exists:

```txt
create checkout
test payment
webhook updates order
success page does not mark paid
duplicate webhook safe
```

Payment launch without webhook test is not acceptable.

---

## 15. File Upload Smoke Tests

Only when upload phase exists:

```txt
upload valid file
reject invalid file
signed URL works
customer cannot access other file
admin download works
```

---

## 16. Rollback Plan

If production deploy breaks:

1. Revert deployment in Vercel.
2. Check env changes.
3. Check database migration compatibility.
4. Restore previous commit if needed.
5. Document incident.

Do not panic-patch production blindly.

---

## 17. Launch Checklist

Before production launch:

| Check | Required |
|---|---|
| Production domain connected | Yes |
| HTTPS active | Yes |
| Env variables set | Yes |
| Build passes | Yes |
| Sitemap works | Yes |
| Robots works | Yes |
| P0 pages work | Yes |
| Legal pages exist | Yes |
| Forms work | Yes |
| No preview canonical | Yes |
| No secrets exposed | Yes |
| Stripe test/live separated | Yes |

---

## 18. Final Verdict

Deployment is part of the product.

The correct deployment:

> Controlled Vercel production with correct env, canonical, sitemap, forms and smoke tests.

The wrong deployment:

> Push and hope.

Do not scale traffic to a broken deploy.
