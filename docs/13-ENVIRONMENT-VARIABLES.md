# 13-ENVIRONMENT-VARIABLES.md

# Labelpilot.de — Environment Variables

## 1. Purpose

This document defines the environment variable strategy for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The application will use:

- GitHub
- Vercel
- Supabase PostgreSQL
- Prisma
- Stripe
- Supabase Storage or UploadThing
- Resend
- GA4 / Search Console / optional Plausible

This document is the source of truth for Codex when creating `.env.example`, reading environment variables, validating configuration and preparing deployments.

---

## 2. Core Rule

Environment variables are security-critical.

Codex must never:

1. Commit real `.env` files.
2. Expose server secrets to the browser.
3. Put Stripe secret keys in client components.
4. Log secret values.
5. Hardcode production secrets.
6. Use production keys in local development.
7. Add new env variables without documenting them.

---

## 3. Environment Files

Recommended local files:

```txt
.env.example
.env.local
.env.development
.env.preview
.env.production
```

Rules:

| File | Commit? | Purpose |
|---|---|---|
| `.env.example` | Yes | Template with empty/example values |
| `.env.local` | No | Local developer secrets |
| `.env.development` | No | Optional local/dev values |
| `.env.preview` | No | Optional preview values |
| `.env.production` | No | Production secrets |

Vercel should store production/preview variables in Vercel dashboard.

Do not commit real secrets.

---

## 4. Variable Naming Rules

Use uppercase env names.

Good:

```txt
STRIPE_SECRET_KEY
DATABASE_URL
NEXT_PUBLIC_APP_URL
```

Bad:

```txt
stripeKey
db
secret
```

Client-exposed variables must start with:

```txt
NEXT_PUBLIC_
```

Never put secrets in `NEXT_PUBLIC_` variables.

---

## 5. Environment Groups

Required groups:

```txt
APP
DATABASE
AUTH
STRIPE
STORAGE
EMAIL
ANALYTICS
SEO
SECURITY
```

Optional future groups:

```txt
GERMANY_HUB
LOGISTICS
CRM
FEATURE_FLAGS
```

---

## 6. APP Variables

### 6.1 Required

```txt
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

Recommended values:

```txt
NEXT_PUBLIC_APP_URL=https://labelpilot.de
NODE_ENV=production
```

Local:

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Rules:

1. `NEXT_PUBLIC_APP_URL` is safe to expose.
2. It must not include trailing slash.
3. It is used for canonical URLs, Stripe redirect URLs and public links.

---

## 7. DATABASE Variables

Labelpilot.de uses Supabase PostgreSQL with Prisma.

### 7.1 Required

```txt
DATABASE_URL=
DIRECT_URL=
```

### 7.2 Purpose

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Runtime database connection, often pooled |
| `DIRECT_URL` | Direct database connection for Prisma migrations |

Rules:

1. Runtime should use `DATABASE_URL`.
2. Prisma migrations should use `DIRECT_URL`.
3. Do not use pooled URL for migrations if Supabase requires direct connection.
4. Do not expose database URLs to client.

### 7.3 Prisma Schema Example

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## 8. AUTH Variables

Auth provider decision may be Supabase Auth or Clerk.

### 8.1 Supabase Auth Variables

If using Supabase Auth:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

1. `NEXT_PUBLIC_SUPABASE_URL` can be public.
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be public.
3. `SUPABASE_SERVICE_ROLE_KEY` is server-only.
4. Never expose service role key to browser.
5. Use service role only in protected server routes.

### 8.2 Clerk Variables

If using Clerk instead:

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Rules:

1. Publishable key can be public.
2. Secret key server-only.
3. Do not mix Clerk and Supabase Auth unless intentionally designed.

### 8.3 MVP Recommendation

Use one auth provider.

Do not implement multiple auth systems in MVP.

---

## 9. STRIPE Variables

Stripe is required for paid orders.

### 9.1 Required

```txt
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### 9.2 Optional

```txt
STRIPE_DEFAULT_CURRENCY=eur
STRIPE_ACCOUNT_COUNTRY=DE
```

### 9.3 Rules

1. `STRIPE_SECRET_KEY` is server-only.
2. `STRIPE_WEBHOOK_SECRET` is server-only.
3. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` can be public.
4. Webhook verification must use `STRIPE_WEBHOOK_SECRET`.
5. Test mode keys must be used in development and preview.
6. Live keys only in production.
7. Do not mark orders as paid from success page.

---

## 10. STORAGE Variables

Use one storage provider.

Recommended options:

```txt
Supabase Storage
UploadThing
```

### 10.1 Supabase Storage

If using Supabase Storage:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
```

Suggested bucket:

```txt
SUPABASE_STORAGE_BUCKET=labelpilot-private-files
```

Rules:

1. Bucket should be private.
2. Use signed URLs.
3. Do not expose private file URLs.
4. Service role key server-only.

### 10.2 UploadThing

If using UploadThing:

```txt
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

Rules:

1. Secrets server-only.
2. Validate file type and size server-side.
3. Store metadata in database.

### 10.3 Provider Choice Rule

Do not configure both Supabase Storage and UploadThing unless explicitly needed.

Pick one for MVP.

---

## 11. EMAIL Variables

Recommended provider:

```txt
Resend
```

### 11.1 Required if email enabled

```txt
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
```

Suggested values:

```txt
EMAIL_FROM=Labelpilot.de <noreply@labelpilot.de>
EMAIL_REPLY_TO=kontakt@labelpilot.de
```

Rules:

1. `RESEND_API_KEY` is server-only.
2. Customer emails must be German.
3. Do not send marketing emails without consent.
4. Order/payment emails are transactional.
5. Do not include private file URLs in emails unless signed and short-lived.

---

## 12. ANALYTICS Variables

### 12.1 GA4

```txt
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

### 12.2 Plausible Optional

```txt
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

### 12.3 Microsoft Clarity Optional

```txt
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

Rules:

1. Analytics variables are public if using browser scripts.
2. Do not block Core Web Vitals with excessive tracking scripts.
3. Do not add tracking without cookie/privacy review.
4. Search Console does not require app env variable.

---

## 13. SEO Variables

Optional but useful:

```txt
NEXT_PUBLIC_SITE_NAME=Labelpilot.de
NEXT_PUBLIC_SITE_LOCALE=de-DE
NEXT_PUBLIC_SITE_COUNTRY=DE
```

Rules:

1. These can be public.
2. They support metadata and schema.
3. Do not use env variables for every SEO text; use config files.

---

## 14. SECURITY Variables

Recommended:

```txt
APP_SECRET=
CRON_SECRET=
ADMIN_BOOTSTRAP_EMAIL=
```

### 14.1 APP_SECRET

Used for signing internal tokens if needed.

Server-only.

### 14.2 CRON_SECRET

Used to protect future scheduled tasks.

Server-only.

### 14.3 ADMIN_BOOTSTRAP_EMAIL

Used to create or identify first admin.

Should be used carefully.

---

## 15. FEATURE FLAG Variables

Optional future feature flags:

```txt
FEATURE_STRIPE_CHECKOUT=true
FEATURE_FILE_UPLOAD=true
FEATURE_REORDER=true
FEATURE_LEADS=true
FEATURE_GERMANY_HUB=false
```

Rules:

1. Feature flags can be useful but should not hide broken logic.
2. Do not use feature flags as a substitute for tests.
3. Keep flags documented.

---

## 16. GERMANY HUB Future Variables

Future, not MVP:

```txt
GERMANY_HUB_ENABLED=false
GERMANY_HUB_ADDRESS=
GERMANY_HUB_CONTACT_EMAIL=
```

Do not add operational hub logic before business metrics justify it.

---

## 17. LOGISTICS Future Variables

Future, not MVP:

```txt
DHL_API_KEY=
DPD_API_KEY=
SHIPMENT_PROVIDER=
```

Phase 5 uses manual tracking entry.

No carrier API required in MVP.

---

## 18. Required `.env.example`

Codex must create/update `.env.example`.

Recommended template:

```txt
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=
DIRECT_URL=

# Supabase / Auth / Storage
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=labelpilot-private-files

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_DEFAULT_CURRENCY=eur

# Email
RESEND_API_KEY=
EMAIL_FROM=Labelpilot.de <noreply@labelpilot.de>
EMAIL_REPLY_TO=kontakt@labelpilot.de

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_CLARITY_PROJECT_ID=

# SEO
NEXT_PUBLIC_SITE_NAME=Labelpilot.de
NEXT_PUBLIC_SITE_LOCALE=de-DE
NEXT_PUBLIC_SITE_COUNTRY=DE

# Security
APP_SECRET=
CRON_SECRET=
ADMIN_BOOTSTRAP_EMAIL=

# Feature Flags
FEATURE_STRIPE_CHECKOUT=true
FEATURE_FILE_UPLOAD=true
FEATURE_REORDER=true
FEATURE_LEADS=true
FEATURE_GERMANY_HUB=false
```

Real secrets must not be placed in `.env.example`.

---

## 19. Environment Validation

Codex must implement env validation.

Recommended file:

```txt
lib/env.ts
```

or:

```txt
config/env.ts
```

Recommended behavior:

1. Validate required env variables at server usage.
2. Avoid breaking public pages by eagerly requiring database/Stripe env at import time.
3. Separate public env from server env.
4. Throw clear error on missing required server env in relevant route.
5. Never expose secret values in error messages.

Important:

Public SEO pages should not fail because Stripe env is missing during early development, unless they import Stripe code incorrectly.

Avoid eager imports that crash unrelated routes.

---

## 20. Public vs Server Env Separation

### 20.1 Public Env

Safe for browser:

```txt
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_SITE_LOCALE
NEXT_PUBLIC_SITE_COUNTRY
```

### 20.2 Server Env

Never expose:

```txt
DATABASE_URL
DIRECT_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
APP_SECRET
CRON_SECRET
```

Rules:

1. Do not pass server env into client components.
2. Do not print server env in logs.
3. Do not include secrets in API responses.

---

## 21. Vercel Environment Setup

Vercel environments:

```txt
Development
Preview
Production
```

### 21.1 Development

Use local `.env.local`.

### 21.2 Preview

Use Stripe test keys.

Use preview database or safe staging database if possible.

Do not use production Stripe live keys.

### 21.3 Production

Use:

- production Supabase database
- Stripe live keys
- production webhook secret
- production app URL
- production email sender
- production analytics

Production `NEXT_PUBLIC_APP_URL`:

```txt
https://labelpilot.de
```

---

## 22. Stripe Webhook Environment Notes

Stripe webhook secret differs by environment.

Local:

```txt
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This gives local webhook secret.

Vercel production webhook endpoint:

```txt
https://labelpilot.de/api/stripe/webhook
```

Production webhook secret must be copied from Stripe dashboard into Vercel production env.

Do not use local webhook secret in production.

---

## 23. Supabase Environment Notes

Supabase provides:

```txt
Project URL
Anon key
Service role key
Database connection strings
```

Rules:

1. Use anon key only where safe.
2. Service role key server-only.
3. Database pooled URL for runtime if needed.
4. Direct URL for migrations.
5. Keep storage bucket private.

---

## 24. Email Domain Notes

Before production email sending:

1. Verify domain in Resend.
2. Configure SPF/DKIM if required.
3. Use branded sender.
4. Use German transactional email templates.
5. Do not send cold marketing from transactional domain without planning.

Suggested sender:

```txt
Labelpilot.de <noreply@labelpilot.de>
```

Reply-to:

```txt
kontakt@labelpilot.de
```

---

## 25. Local Development Setup Checklist

Developer must have:

```txt
Node installed
package manager installed
.env.local created
DATABASE_URL set
DIRECT_URL set
Stripe test keys set
Supabase keys set
```

Run:

```txt
npm install
npx prisma validate
npx prisma migrate dev
npm run dev
```

Then test:

```txt
http://localhost:3000/de
```

---

## 26. Production Launch Env Checklist

Before production launch:

| Check | Required |
|---|---|
| `NEXT_PUBLIC_APP_URL=https://labelpilot.de` | Yes |
| Production database configured | Yes |
| `DIRECT_URL` configured | Yes |
| Stripe live secret key configured | Yes |
| Stripe live publishable key configured | Yes |
| Stripe production webhook secret configured | Yes |
| Supabase service role key server-only | Yes |
| Storage bucket private | Yes |
| Resend API key configured if email enabled | Yes |
| Email domain verified | Yes |
| Analytics configured if used | Yes |
| No test keys in production | Yes |
| No live keys in development | Yes |

---

## 27. Secret Rotation Rules

Rotate secrets if:

1. Secret accidentally committed.
2. Secret exposed in logs.
3. Team member access changes.
4. Suspicious activity occurs.
5. Production provider recommends rotation.

After rotation:

1. Update provider.
2. Update Vercel env.
3. Redeploy.
4. Test affected integration.
5. Document incident internally.

---

## 28. Common Mistakes to Avoid

Do not:

1. Commit `.env.local`.
2. Put secret keys in `NEXT_PUBLIC_`.
3. Use Stripe live keys locally.
4. Use test webhook secret in production.
5. Use service role key in client.
6. Let public pages import server-only env modules that crash builds.
7. Log full database URLs.
8. Hardcode `localhost` in production.
9. Forget to update `.env.example`.
10. Add env variables without documentation.
11. Store customer secrets in env.
12. Use env variables for frequently changing business prices.

---

## 29. Codex Implementation Rules

Codex must:

1. Create/update `.env.example`.
2. Create env validation helper.
3. Separate public and server env.
4. Avoid eager env validation that breaks unrelated routes.
5. Never expose secrets.
6. Add documentation for new env variables.
7. Mention required Vercel variables in task summary.
8. Use clear error messages for missing env.
9. Not commit real `.env` files.
10. Not invent env variables silently.

---

## 30. Acceptance Criteria

Environment setup is accepted when:

| Check | Required Result |
|---|---|
| `.env.example` exists | PASS |
| Required app env documented | PASS |
| Database env documented | PASS |
| Stripe env documented | PASS |
| Storage env documented | PASS |
| Email env documented | PASS |
| Analytics env documented | PASS |
| Public/server env separated | PASS |
| No secrets in client | PASS |
| No real secrets committed | PASS |
| Vercel setup checklist exists | PASS |
| Stripe webhook env explained | PASS |
| Env validation helper planned/implemented | PASS |

---

## 31. Final Verdict

The correct environment strategy is:

> Minimal documented env variables, strict public/server separation, Vercel-managed secrets, Stripe webhook safety and no committed secrets.

The wrong strategy is:

> Random `.env` values, exposed secrets, live keys in development and undocumented integrations.

Labelpilot.de will handle payments, customer data and private artwork files. Environment discipline is not optional.
