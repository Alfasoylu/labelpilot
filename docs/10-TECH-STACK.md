# 10-TECH-STACK.md

# Technical Stack — Labelpilot.de

## 1. Purpose of This Document

This document defines the official technical stack for **Labelpilot.de**.

Codex and any developer working on this project must treat this file as the technical source of truth.

The project is not a generic brochure site.

It is a Germany-focused B2B label ordering and reorder platform with:

- Product catalog
- Quantity-based pricing
- Stripe payment
- Artwork upload
- Admin order review
- Proofing workflow
- Quote request flow
- Customer account
- Previous-order reorder system
- SEO and GEO-ready landing pages
- Vercel deployment
- GitHub-based development workflow

---

## 2. Project Identity

| Item | Value |
|---|---|
| Project name | Labelpilot |
| Domain | labelpilot.de |
| Main market | Germany |
| Main language | German |
| Secondary language | English later |
| Business model | B2B-first label ordering and reorder platform |
| Main product | 100×200 mm PP roll product labels |
| Cross-sell product | Thermal shipping labels |
| Production | Turkey |
| Year 3+ logistics | Germany hub pilot if metrics justify |

---

## 3. Stack Verdict

Use this stack:

| Layer | Selected Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Auth initially |
| Payment | Stripe Checkout + Stripe Webhooks |
| File Storage | Supabase Storage initially |
| Email | Resend |
| Hosting | Vercel |
| Repository | GitHub |
| Analytics | GA4 + Google Search Console |
| Optional analytics | Plausible later |
| SEO | Next.js metadata API + custom sitemap |
| GEO | Structured content + schema + FAQ blocks |
| Runtime | Node.js for payment/webhook/file/order routes |
| Package manager | pnpm |

This stack prioritizes speed, maintainability, and Codex-friendly implementation.

---

## 4. Why Not Shopify

Shopify is fast for simple stores, but Labelpilot.de needs custom workflows:

- Artwork upload
- Proof approval
- B2B quote requests
- Quantity-based pricing rules
- Previous order reorder
- Saved label specifications
- Admin production workflow
- Future Germany hub logic
- SEO/GEO programmatic pages
- Stripe webhook-controlled order lifecycle

A custom Next.js build gives more control over the reorder and production workflow.

Shopify can be skipped unless the project needs a fast temporary validation store.

---

## 5. Framework Decision

### Selected: Next.js App Router

Use Next.js App Router because it supports:

- Server-rendered SEO pages
- Dynamic product and landing pages
- API routes
- Stripe webhooks
- File upload endpoints
- Admin dashboard
- Customer portal
- Metadata API
- Static generation where useful
- Vercel-native deployment

Required approach:

- Use Server Components by default.
- Use Client Components only when needed.
- Keep product and SEO pages fast.
- Do not overuse client-side state.
- Prioritize server-rendered German landing pages.

---

## 6. Language Decision

### Selected: TypeScript

All application code must be written in TypeScript.

Rules:

- No `any` unless unavoidable and justified.
- Use typed database models.
- Use typed form schemas.
- Use server-side validation.
- Use shared types for product, order, quote and customer flows.
- Keep business rules centralized.

---

## 7. Styling Decision

### Selected: Tailwind CSS + shadcn/ui

Use Tailwind CSS for layout and styling.

Use shadcn/ui for:

- Buttons
- Forms
- Dialogs
- Tables
- Cards
- Tabs
- Dropdowns
- Toasts
- Admin UI components

Design direction:

- Premium German B2B roll-label manufacturing interface with SaaS-like ordering clarity
- Visual-first, text-light, technical, confident, low-noise
- Fast, trustworthy, minimal
- No decorative overdesign
- Strong typography
- Clear price tables and spec/comparison tables
- Clear product comparison sections
- Strong trust blocks (Musterbox, gespeicherte Druckdaten, Proof vor Produktion)
- Mobile-first

Do not create a cheap-looking print shop UI.

Do not build a generic "clean SaaS" / "SaaS-commerce" landing page, a playful sticker site, a cheap-exporter look, or an AI-generated icon-card-grid landing page. The public site must read as a premium professional roll-label manufacturer.

### Design Implementation Rules

These rules keep the public-facing UI consistent and protect the existing platform logic:

- Use central design tokens (colors, spacing, typography, radius) — no per-section hardcoded values.
- Build with reusable marketing components in `components/marketing/*` — one shared visual system, not a new style per section.
- No bespoke one-off styles per section; do not invent a new look for each block.
- Preserve the stack: Next.js App Router + Tailwind + shadcn/ui. Do not swap or add UI frameworks.
- No heavy animation libraries; rely on light CSS/Tailwind transitions only (see Section 31).
- Public pages are visual-first: product imagery, roll-label visuals, label-on-packaging mockups, material close-ups, spec/comparison tables, pricing cards, configurator preview, sample-box visuals, reorder-flow diagrams, process steps. Avoid large text blocks, repeated icon cards, and decorative gradient blobs.
- Avoid dashboard-looking visuals on public pages unless they directly explain saved artwork (gespeicherte Druckdaten) or the reorder flow.
- Do not break the pricing engine, checkout, upload, quote, auth, admin, or SEO metadata when restyling. Visual changes must not touch business logic or route behavior.
- Public UI is German-only; never mix in English CTAs or Turkish copy.

---

## 8. Database Decision

### Selected: Supabase PostgreSQL

Use Supabase PostgreSQL as the primary database.

Reasons:

- Managed Postgres
- Easy startup
- Good integration with auth and storage
- Scales enough for MVP and early growth
- Compatible with Prisma
- Fast setup for Codex-driven development

Database must support:

- Users
- Customers
- Products
- Product variants
- Pricing rules
- Orders
- Order items
- Artwork files
- Proof files
- Quotes
- Quote items
- Reorders
- Shipping information
- Admin notes
- Audit events later

---

## 9. ORM Decision

### Selected: Prisma

Use Prisma for database schema and queries.

Rules:

- Schema must live in `/prisma/schema.prisma`.
- Migrations must be committed.
- Do not manually change production database without migration.
- Use `prisma migrate dev` locally.
- Use `prisma migrate deploy` in production.
- Keep enum values aligned with docs.
- Avoid destructive migrations without backup.

Expected core models:

- User
- CustomerProfile
- Product
- ProductVariant
- PricingTier
- Order
- OrderItem
- UploadedFile
- ProofFile
- QuoteRequest
- QuoteRequestItem
- ReorderLink
- Address
- AdminNote
- EmailEvent later
- AuditLog later

Detailed schema belongs in:

`/docs/12-DATABASE-SCHEMA.md`

---

## 10. Auth Decision

### Selected Initially: Supabase Auth

Use Supabase Auth initially because it fits the stack.

Auth must support:

- Customer registration
- Customer login
- Customer order history
- Customer proof approval
- Customer reorder
- Admin access control

Minimum roles:

| Role | Meaning |
|---|---|
| CUSTOMER | Can place orders, view own orders, reorder |
| ADMIN | Can view all orders, update statuses, manage proofs |
| STAFF | Optional later, limited admin access |

Admin protection is mandatory.

Do not expose admin routes without role checks.

Alternatives considered (not used in MVP): Clerk can be evaluated later if Supabase Auth becomes limiting.

---

## 11. Payment Decision

### Selected: Stripe Checkout + Stripe Webhooks

Stripe will handle payments.

Required payment flow:

1. Customer selects product.
2. Customer chooses material and quantity.
3. Customer uploads artwork or continues without upload if allowed.
4. Customer enters shipping data.
5. Checkout session is created.
6. Customer pays in Stripe Checkout.
7. Stripe redirects to success page.
8. Stripe webhook confirms payment.
9. Order is marked `PAID`.
10. Admin review begins.

Critical rule:

> Never mark an order as paid only from client-side redirect.

Webhook verification is mandatory.

Detailed Stripe flow belongs in:

`/docs/15-STRIPE-PAYMENT-FLOW.md`

---

## 12. File Upload Decision

### Selected Initially: Supabase Storage

Use Supabase Storage for MVP file upload.

Supported file types:

- PDF
- AI
- EPS
- SVG
- PNG
- JPG
- ZIP

Rules:

- Enforce max file size.
- Store file metadata in database.
- Do not allow public unrestricted access to artwork files.
- Admin must be able to download artwork.
- Customer must be able to upload corrected artwork.
- Proof files must be stored separately from original artwork.
- Validate file extension and MIME type server-side.
- Virus scanning can be added later if needed.

Alternatives considered (not used in MVP): UploadThing or S3-compatible storage can be evaluated later if Supabase Storage becomes limiting.

Detailed file upload flow belongs in:

`/docs/17-FILE-UPLOAD-AND-PROOFING.md`

---

## 13. Email Decision

### Selected: Resend

Use Resend for transactional emails.

Required email types:

- Order confirmation
- Payment confirmation
- File received
- Proof ready
- Proof approved
- Correction required
- Production started
- Order shipped
- Delivery follow-up
- Reorder reminder
- Quote request received
- Quote response sent later

Email templates should be German-first.

Optional English templates can be added later.

---

## 14. Hosting Decision

### Selected: Vercel

Use Vercel for hosting.

Reasons:

- Native Next.js deployment
- Preview deployments
- GitHub integration
- Environment variable management
- Fast edge/global delivery
- Easy rollback

Rules:

- Production branch: `main`
- Preview branch: feature branches / pull requests
- Do not commit secrets.
- Use Vercel environment variables.
- Stripe webhooks must use production endpoint in live mode.
- Test webhooks must use test endpoint.

---

## 15. Repository Decision

### Selected: GitHub

Use GitHub as the source repository.

Recommended repo name:

`labelpilot`

Branching model:

| Branch | Purpose |
|---|---|
| main | Production |
| staging | Optional staging |
| feature/* | Feature work |
| fix/* | Bug fixes |
| docs/* | Documentation changes |

Rules:

- Every important change should be committed.
- Docs must be updated when business logic changes.
- Codex must not make random unrelated changes.
- Pull requests should include a short checklist.

---

## 16. SEO Technical Requirements

SEO must be part of the technical stack from day one.

Required:

- German-first URLs
- Next.js metadata API
- Product metadata
- Landing page metadata
- Canonical URLs
- Open Graph tags
- Sitemap
- Robots.txt
- Breadcrumbs
- Product schema
- Organization schema
- FAQ schema where relevant
- Localized German copy
- Fast page speed
- Mobile-first design
- Clean internal linking

Do not generate thin SEO pages.

Every SEO page must have clear business intent and conversion path.

Detailed SEO plan belongs in:

`/docs/20-SEO-STRATEGY-2026.md`

---

## 17. GEO / AI Search Technical Requirements

GEO means Generative Engine Optimization.

The site must be understandable by AI systems.

Required:

- Clear entity descriptions
- Consistent brand naming: Labelpilot
- Clear product pages
- Clear use-case pages
- Structured FAQs
- Comparison tables
- “Who this is for” blocks
- “How ordering works” blocks
- “How reorder works” blocks
- Glossary pages later
- Schema markup
- Consistent internal links

Goal:

When AI systems answer questions about custom PP product labels for German food and supplement brands, Labelpilot should be understandable as a relevant provider.

Detailed GEO plan belongs in:

`/docs/21-GEO-AI-SEARCH-STRATEGY.md`

---

## 18. Core App Modules

The app should be organized around these modules:

1. Marketing website
2. Product catalog
3. Product detail pages
4. Pricing calculator
5. Checkout flow
6. Artwork upload
7. Order management
8. Proofing workflow
9. Customer portal
10. Admin panel
11. Quote request flow
12. Reorder system
13. SEO/GEO content engine
14. Email notification system
15. Analytics and tracking

---

## 19. Suggested Folder Structure

Recommended structure:

```txt
/app
  /(public)
    /de
      /page.tsx
      /lebensmittel-etiketten
      /supplement-etiketten
      /getraenke-etiketten
      /transparente-pp-etiketten
      /pp-rollenetiketten
      /thermo-versandetiketten
      /musterbox
      /angebot-anfordern
      /nachbestellen
    /produkte
    /checkout
    /order-success
  /(account)
    /konto
    /bestellungen
    /nachbestellen
  /(admin)
    /admin
    /admin/orders
    /admin/quotes
    /admin/files
  /api
    /stripe
    /webhook
    /upload
    /quote
    /reorder

/components
  /ui
  /marketing
  /product
  /checkout
  /forms
  /admin
  /customer
  /seo

/lib
  /auth
  /db
  /email
  /env
  /files
  /leads
  /orders
  /pricing
  /products
  /proofing
  /quotes
  /reorder
  /seo
  /stripe
  /validation

/prisma
  schema.prisma
  /migrations

/docs
  *.md
```

Codex can refine structure, but must not create chaos.

---

## 20. API Route Requirements

Required API routes:

| Route | Purpose |
|---|---|
| `/api/checkout/create-session` | Create Stripe Checkout session |
| `/api/stripe/webhook` | Verify Stripe webhook |
| `/api/upload/artwork` | Upload artwork |
| `/api/upload/proof` | Admin proof upload |
| `/api/quote` | Save quote request |
| `/api/reorder/create` | Create reorder from previous order |
| `/api/admin/order-status` | Update order status |
| `/api/customer/proof-approval` | Customer approves proof |

Rules:

- Validate all inputs server-side.
- Protect admin routes.
- Never trust client-submitted prices.
- Prices must be calculated server-side.
- Uploaded files must be linked to authenticated user or temporary session.
- Stripe metadata must include internal order ID.

---

## 21. Pricing Engine Requirements

Pricing must be centralized.

Do not hardcode prices across random components.

Recommended file:

`/lib/pricing/pricing-engine.ts`

Pricing engine should support:

- Product type
- Material
- Size
- Quantity
- Base production cost
- Logistics estimate
- Margin target
- VAT logic placeholder
- Fixed price package
- Quote request threshold
- Future discount rules
- Reorder discount rules later

Detailed pricing logic belongs in:

`/docs/04-PRICING-AND-MARGIN-MODEL.md`

---

## 22. Product Data Requirements

Product data must be centralized.

Recommended file:

`/lib/products/product-catalog.ts`

Product data should include:

- Product ID
- Slug
- German name
- English internal name
- Material
- Size options
- Quantity options
- Whether checkout is allowed
- Whether quote is required
- Whether artwork upload is required
- SEO title
- SEO description
- Use cases
- Cross-sell products

Detailed product strategy belongs in:

`/docs/03-PRODUCT-STRATEGY.md`

---

## 23. Order System Requirements

Orders must be database-backed.

Order must store:

- Customer ID or guest email
- Product items
- Quantity
- Material
- Size
- Price paid
- Stripe session ID
- Stripe payment intent ID
- Shipping address
- Billing address if needed
- Uploaded artwork
- Proof status
- Production status
- Tracking number
- Reorder source order ID if applicable

Required order statuses:

- DRAFT
- PENDING_PAYMENT
- PAID
- FILE_REVIEW
- PROOF_REQUIRED
- WAITING_CUSTOMER_APPROVAL
- APPROVED_FOR_PRODUCTION
- IN_PRODUCTION
- READY_TO_SHIP
- SHIPPED
- DELIVERED
- COMPLETED
- CANCELLED
- REFUND_REQUESTED
- REPRINT_REQUIRED

Detailed order flow belongs in:

`/docs/16-ORDER-FLOW.md`

---

## 24. Admin Panel Requirements

Admin panel must be built in MVP.

Admin panel pages:

1. Dashboard
2. Orders
3. Order detail
4. Quote requests
5. Uploaded files
6. Customers
7. Products/pricing later
8. Reorders later

Admin must be able to:

- View orders
- Filter by status
- Download artwork
- Upload proof
- Change order status
- Add internal notes
- Add tracking number
- View quote requests
- Mark quote as contacted
- View customer reorder history

Keep admin simple.

No overdesign.

---

## 25. Customer Portal Requirements

Customer portal must support:

- Login
- View orders
- View order status
- Upload corrected artwork
- Download proof
- Approve proof
- Reorder previous labels
- View saved label specs

Customer portal is important because it increases repeat orders.

Do not treat it as optional if reorder is being built.

---

## 26. Security Requirements

Security rules:

1. Do not commit secrets.
2. Use environment variables.
3. Verify Stripe webhooks.
4. Protect admin routes.
5. Validate uploads.
6. Restrict access to private files.
7. Validate all forms server-side.
8. Never trust client-side price values.
9. Rate-limit sensitive endpoints later.
10. Use HTTPS only in production.
11. Use secure cookies.
12. Avoid exposing internal IDs unnecessarily.

---

## 27. Environment Variables

Required environment variables:

```txt
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
ADMIN_EMAIL=
```

Environment variable details belong in:

`/docs/13-ENVIRONMENT-VARIABLES.md`

---

## 28. Deployment Requirements

Deployment flow:

1. Push to GitHub.
2. Vercel preview deploys automatically.
3. Run smoke tests.
4. Merge to main.
5. Vercel production deploys.
6. Verify production routes.
7. Verify Stripe webhook.
8. Verify sitemap and robots.
9. Verify checkout test mode before live.
10. Switch Stripe to live only after full test.

Detailed deployment guide belongs in:

`/docs/40-VERCEL-DEPLOYMENT-CHECKLIST.md`

---

## 29. Testing Requirements

Minimum tests before production:

- Homepage loads.
- Product page loads.
- Pricing calculation works.
- Artwork upload works.
- Stripe test checkout works.
- Stripe webhook creates paid order.
- Quote request saves to database.
- Admin can see order.
- Admin can update status.
- Customer can see order.
- Customer can reorder.
- Sitemap loads.
- Robots.txt loads.
- Metadata exists on landing pages.
- Mobile layout works.

Detailed QA belongs in:

`/docs/37-QA-TESTING-CHECKLIST.md`

---

## 30. Analytics Requirements

Install:

- Google Analytics 4
- Google Search Console
- Bing Webmaster Tools later
- Optional Plausible later

Track events:

- Product view
- Quantity change
- Upload started
- Upload completed
- Checkout started
- Payment completed
- Quote request submitted
- Sample request submitted
- Reorder clicked
- Proof approved
- Contact form submitted

Do not overcomplicate analytics before MVP revenue.

---

## 31. Performance Requirements

The site must be fast.

Targets:

| Metric | Target |
|---|---:|
| Largest Contentful Paint | Under 2.5s |
| Cumulative Layout Shift | Under 0.1 |
| Interaction to Next Paint | Good |
| Mobile PageSpeed | 85+ target |
| Desktop PageSpeed | 90+ target |

Rules:

- Optimize images.
- Avoid heavy client bundles.
- Use Server Components.
- Use lazy loading where useful.
- Avoid unnecessary animation libraries.
- Use system fonts or optimized font loading.

---

## 32. Accessibility Requirements

Minimum accessibility:

- Semantic HTML
- Proper labels for forms
- Keyboard navigation
- Accessible buttons
- Sufficient contrast
- Alt text for meaningful images
- Error messages connected to fields
- Visible focus states
- German form labels

Accessibility is part of conversion.

---

## 33. Localization Requirements

MVP language:

- German customer-facing UI

Internal docs and developer comments can be English.

Rules:

- Do not mix German and Turkish on customer-facing pages.
- Product pages must use German buyer language.
- Admin panel can initially be English if faster.
- Customer emails should be German.
- SEO metadata must be German.

---

## 34. Legal Pages Required

The MVP must include:

- Impressum
- Datenschutz
- Cookie policy
- AGB
- Versandinformationen
- Rückerstattung / Nachdruck policy
- Regulatory disclaimer
- Contact

Germany-focused B2B buyers expect legal completeness.

Legal copy should be reviewed before launch.

---

## 35. Codex Implementation Rules

Codex must follow:

1. Read `/docs/00-PROJECT-BRIEF.md`.
2. Read this file before technical implementation.
3. Do not change stack without explicit approval.
4. Do not add unnecessary services.
5. Do not add generic print products.
6. Do not create random architecture.
7. Do not hardcode prices in UI.
8. Do not trust client price values.
9. Do not skip Stripe webhook verification.
10. Do not make uploaded artwork public.
11. Do not create thin SEO spam pages.
12. Do not implement low-value features before order flow works.
13. Update docs if code changes business logic.
14. Prioritize revenue path over perfect design.
15. Keep implementation simple and testable.

---

## 36. MVP Build Order

Recommended technical build order:

1. Project setup
2. Tailwind + shadcn/ui
3. Supabase + Prisma setup
4. Product catalog data
5. Marketing homepage
6. Core German landing pages
7. Product detail pages
8. Pricing engine
9. Artwork upload
10. Stripe Checkout
11. Stripe webhook
12. Order database records
13. Admin order dashboard
14. Quote request form
15. Customer account
16. Reorder from previous order
17. SEO metadata
18. Sitemap + robots
19. Transactional emails
20. Production smoke tests

Do not build advanced features before checkout, upload, and order flow are working.

---

## 37. Features Explicitly Not in MVP

Do not build these in MVP:

- Complex ERP
- Full warehouse management
- Marketplace integrations
- Multi-country tax engine
- Advanced subscription billing
- Complex design editor
- AI label compliance checker
- Live chat system
- Multi-language beyond German
- Full CRM
- Public marketplace
- Vendor marketplace
- Internal accounting system
- Complex role-based permissions beyond admin/customer

These can be considered later.

---

## 38. Future Technical Roadmap

Future phases may include:

### Phase 2

- Reorder reminder emails
- Saved specs dashboard
- Better quote management
- SEO programmatic pages
- Sample box flow

### Phase 3

- Germany hub logistics module
- Batch shipment planning
- Internal production dashboard
- B2B account pricing
- Repeat order analytics

### Phase 4

- Custom customer price lists
- B2B invoice payment
- Team accounts for customer companies
- API integration with shipping providers
- Advanced analytics

### Phase 5

- AI-assisted artwork preflight
- Automated bleed/safe-zone checks
- Advanced proof approval system
- Production file versioning
- Multi-country expansion

---

## 39. Final Technical Verdict

Labelpilot.de should be built as a custom Next.js application, not as a generic Shopify store.

The correct technical direction is:

> Next.js + TypeScript + Supabase PostgreSQL + Prisma + Stripe + Supabase Storage + Resend + Vercel + GitHub.

This stack is strong enough for MVP, Codex-friendly, SEO-ready, and scalable toward a B2B reorder platform.

The first technical priority is not beautiful design.

The first technical priority is:

1. Product pages
2. Pricing engine
3. Artwork upload
4. Stripe payment
5. Order creation
6. Admin review
7. Reorder logic
8. SEO/GEO foundation
