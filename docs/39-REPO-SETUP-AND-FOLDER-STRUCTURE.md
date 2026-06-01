# 39-REPO-SETUP-AND-FOLDER-STRUCTURE.md

# Labelpilot.de — Repo Setup and Folder Structure

## 1. Purpose

This document defines the repository setup and folder structure for **Labelpilot.de**.

The goal is to keep the codebase simple, scalable and understandable for Codex.

A messy repo will slow development and create bugs.

---

## 2. Recommended Stack

Use:

```txt
Next.js App Router
TypeScript
Tailwind CSS
Prisma
Supabase PostgreSQL
Stripe
Resend
Vercel
```

Package manager can be:

```txt
npm
pnpm
```

Use the one already initialized in repo.

---

## 3. Recommended Root Structure

```txt
app/
components/
config/
data/
docs/
emails/
lib/
prisma/
public/
scripts/
styles/
types/
```

Avoid random folders.

---

## 4. App Folder

Recommended:

```txt
app/
  layout.tsx
  page.tsx
  sitemap.ts
  robots.ts
  globals.css
  (public)/
  (shop)/
  (account)/
  admin/
  api/
```

German public pages should live under appropriate routing structure.

Example:

```txt
app/(public)/de/page.tsx
app/(public)/de/supplement-etiketten/page.tsx
```

or framework-compatible equivalent.

---

## 5. Components Folder

Recommended:

```txt
components/
  ui/
  layout/
  seo/
  content/
  product/
  forms/
  order/
  admin/
  account/
```

### 5.1 UI

Generic UI components:

```txt
Button
Card
Input
Select
Textarea
Badge
Table
```

### 5.2 Layout

```txt
Header
Footer
MainNav
MobileNav
PageShell
```

### 5.3 SEO

```txt
JsonLd
Breadcrumbs
```

### 5.4 Content

```txt
DirectAnswer
FaqSection
RelatedLinks
ContentCta
ComplianceDisclaimer
SpecTable
```

---

## 6. Config Folder

Use for stable business/system configuration.

```txt
config/
  products.ts
  pricing.ts
  metadata.ts
  seo-routes.ts
  navigation.ts
  internal-links.ts
  env.ts
```

Rules:

1. Product/pricing data should not be scattered.
2. Metadata should be centralized.
3. Routes should be centralized.
4. Navigation should use German labels.

---

## 7. Data Folder

Use for page/content data.

```txt
data/
  faqs.ts
  content-pages.ts
  glossary.ts
  programmatic-pages.ts
  industries.ts
```

Do not use database for static SEO content in MVP unless needed.

---

## 8. Lib Folder

Business logic lives in `lib`.

```txt
lib/
  db/
  env/
  pricing/
  products/
  seo/
  stripe/
  orders/
  files/
  proofing/
  auth/
  email/
  leads/
  quotes/
  reorder/
  validation/
```

Server-only logic must stay server-side.

Do not import server-only logic into client components.

---

## 9. Prisma Folder

```txt
prisma/
  schema.prisma
  migrations/
  seed.ts optional
```

Rules:

1. Use Prisma migrations.
2. Use Decimal for money.
3. Validate schema before migration.
4. Do not manually edit production DB.

---

## 10. Emails Folder

```txt
emails/
  quote-request-received.tsx
  sample-box-request-received.tsx
  payment-confirmed.tsx
  artwork-received.tsx
  correction-required.tsx
  proof-ready.tsx
  order-shipped.tsx
  reorder-received.tsx
```

All customer emails German.

---

## 11. Public Folder

```txt
public/
  logo.svg
  og/
  images/
  products/
```

Image alt text must be German in usage.

Do not store uploaded customer artwork in public folder.

Customer files belong in private storage.

---

## 12. Types Folder

```txt
types/
  index.ts
  product.ts
  order.ts
  seo.ts
```

Use types where shared across app.

---

## 13. Naming Rules

Use English code identifiers.

Use German customer-facing labels.

Example:

```ts
const customerTitle = "Opake PP-Rollenetiketten 100×200 mm"
const ctaLabel = "Angebot anfordern"
```

Do not hardcode German labels randomly when config should own them.

---

## 14. Server / Client Boundary

Rules:

1. Default to server components.
2. Use client components only for interactivity.
3. Keep Stripe secret server-only.
4. Keep database access server-only.
5. Keep file signing server-only.
6. Validate forms server-side.

---

## 15. Import Rules

Avoid circular imports.

Suggested direction:

```txt
config/data → components → pages
lib → pages/actions/api
```

Do not let UI components import Prisma directly.

---

## 16. Route Groups

Suggested:

```txt
(public) = SEO/public pages
(shop) = checkout/product config later
(account) = customer portal
admin = admin panel
api = API routes
```

Account/admin/checkout pages noindex.

---

## 17. Environment Handling

Use:

```txt
lib/env.ts
```

Rules:

1. Separate public env from server env.
2. Avoid eager env validation that breaks public pages.
3. Do not expose secrets to client.

---

## 18. Acceptance Criteria

Repo structure is accepted when:

| Check | Required Result |
|---|---|
| Clear folder structure | PASS |
| Product config centralized | PASS |
| Metadata centralized | PASS |
| SEO routes centralized | PASS |
| Business logic in lib | PASS |
| UI components separated | PASS |
| Server/client boundaries respected | PASS |
| No customer files in public folder | PASS |
| German labels from config/data | PASS |

---

## 19. Final Verdict

The repo must be boring and controlled.

The correct structure helps Codex build fast without breaking business logic.

The wrong structure creates hidden bugs, duplicate pricing and SEO drift.
