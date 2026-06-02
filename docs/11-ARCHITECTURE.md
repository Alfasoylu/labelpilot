# 11-ARCHITECTURE.md

# Labelpilot.de — System Architecture

## 1. Purpose

This document defines the technical architecture for **Labelpilot.de**.

Labelpilot.de is a Germany-focused B2B-first custom label ordering and reorder platform.

The platform must support:

- German SEO landing pages
- Product catalog
- Quantity-based pricing
- Stripe checkout
- Quote request flow
- Artwork upload
- Admin order management
- Customer order tracking
- Proofing workflow
- Reorder system
- SEO and GEO-ready content architecture

This architecture is the source of truth for Codex when implementing the application.

---

## 2. Core Architectural Principle

The system must be built as:

> A B2B label reorder platform.

Not as:

> A generic print shop.

Every technical decision must support:

1. Product label sales.
2. B2B order flow.
3. Repeat order behavior.
4. Saved artwork/specifications.
5. Germany-focused SEO and GEO growth.
6. Future Germany hub/logistics expansion.

---

## 3. Recommended Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js Route Handlers / Server Actions |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Auth |
| Payments | Stripe Checkout + Stripe Webhooks |
| File Storage | Supabase Storage |
| Email | Resend |
| Hosting | Vercel |
| Repository | GitHub |
| Analytics | GA4 + Search Console + optional Plausible |
| SEO | Native Next.js metadata + sitemap + structured data |

Final stack decisions must stay consistent with `/docs/10-TECH-STACK.md`.

Alternatives considered (not used in MVP):

- Clerk for auth
- UploadThing for file storage

---

## 4. Application Structure

Recommended root structure:

```txt
labelpilot/
├── app/
│   ├── (public)/
│   ├── (account)/
│   ├── (admin)/
│   ├── api/
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
├── config/
├── data/
├── docs/
├── emails/
├── lib/
├── prisma/
├── public/
├── scripts/
├── styles/
├── types/
└── tests/
```

The codebase must be organized around business domains, not random components.

---

### 4.1 Public Marketing Component Architecture

The public UI is **visual-first**: it relies on product imagery, roll-label visuals, label-on-packaging mockups, material close-ups, spec/comparison tables, pricing cards, configurator preview blocks, sample-box visuals, and reorder-flow diagrams — not on large text blocks, repeated icon-card grids, decorative gradient blobs, or generic SaaS illustrations.

Dashboard-style visuals appear **only** where they directly explain saved artwork or the reorder flow; the public site must read as a professional roll-label manufacturer with SaaS-like ordering clarity, never as a generic SaaS landing page.

To keep this consistent, all public marketing UI must be built from **one shared visual system** under a dedicated component layer. No one-off styles per section; sections compose reusable blocks and primitives that read from central design tokens.

```txt
components/
├── marketing/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── TrustStrip.tsx
│   ├── ProductPackageCards.tsx
│   ├── MaterialComparison.tsx
│   ├── IndustryUseCases.tsx
│   ├── ReorderFlow.tsx
│   ├── OrderingProcess.tsx
│   ├── SampleBoxCTA.tsx
│   ├── QuoteCTA.tsx
│   ├── FAQSection.tsx
│   └── FinalCTA.tsx
└── ui/                      # shared primitives
    ├── Section.tsx
    ├── Container.tsx
    ├── Eyebrow.tsx
    ├── SectionHeading.tsx
    ├── CTAButton.tsx
    ├── ProductVisualCard.tsx
    ├── PricingCard.tsx
    ├── ComparisonTable.tsx
    └── ProcessStep.tsx
```

**Marketing section components** (`components/marketing/*`) — each is a self-contained, reusable public section:

| Component | Responsibility |
|---|---|
| `Header` | Public navigation + primary German CTA (Jetzt konfigurieren) |
| `Hero` | Visual-first lead block; 5.000 Stück PP-Rollenetiketten as default focus |
| `TrustStrip` | Compact trust signals (no exaggerated/unsupported Germany claims) |
| `ProductPackageCards` | Package/quantity cards with 5.000 Stück recommended as default |
| `MaterialComparison` | Opak vs. transparent PP spec/comparison table |
| `IndustryUseCases` | Food/beverage/supplement/coffee/honey/spice micro-brand use cases |
| `ReorderFlow` | Saved-druckdaten + schneller nachbestellen flow (the strategic moat) |
| `OrderingProcess` | Visual steps: konfigurieren → Druckdaten hochladen → Proof → Produktion |
| `SampleBoxCTA` | Musterbox anfordern trust block |
| `QuoteCTA` | Angebot anfordern path for 20.000+/complex orders |
| `FAQSection` | German FAQ accordion (FAQPage structured data) |
| `FinalCTA` | Closing conversion block with German CTA |

**Shared primitives** (`components/ui/*`) — the building blocks every marketing section composes:

| Primitive | Responsibility |
|---|---|
| `Section` | Vertical rhythm + background wrapper for one page section |
| `Container` | Max-width content alignment |
| `Eyebrow` | Short 2–5 word German eyebrow label |
| `SectionHeading` | 5–10 word German headline + optional short subline |
| `CTAButton` | German-only CTA button (never English labels) |
| `ProductVisualCard` | Product/roll-label visual tile |
| `PricingCard` | Package price card (5.000 Stück as visual default) |
| `ComparisonTable` | Spec/comparison table primitive (opak/transparent, sizes) |
| `ProcessStep` | Single numbered step for ordering/reorder diagrams |

Public marketing copy rendered through these components must follow the German B2B copy rules (short eyebrows, 5–10 word headings, concrete spec/comparison content, German CTAs only). This component layer is additive and must not alter the pricing engine, checkout, upload, quote, auth, admin, or SEO metadata behavior defined elsewhere in this document.

---

## 5. Route Groups

### 5.1 Public Routes

Public routes are indexable SEO/GEO pages.

```txt
app/(public)/
├── page.tsx
├── de/
│   ├── lebensmittel-etiketten/
│   ├── supplement-etiketten/
│   ├── getraenke-etiketten/
│   ├── transparente-pp-etiketten/
│   ├── opake-pp-etiketten/
│   ├── pp-rollenetiketten/
│   ├── thermo-versandetiketten/
│   ├── musterbox/
│   ├── angebot-anfordern/
│   └── nachbestellen/
├── legal/
│   ├── impressum/
│   ├── datenschutz/
│   ├── agb/
│   ├── widerruf/
│   └── versand/
└── kontakt/
```

Public routes must be:

- Fast
- Server-rendered where possible
- SEO optimized
- German-first
- Internally linked
- Structured-data ready
- Visual-first (product imagery, label/packaging mockups, spec/comparison tables, pricing and process visuals — not text walls or repeated icon-card grids)
- Composed from the shared marketing component layer (see 4.1), not one-off per-page styles
- Dashboard visuals only where they explain saved artwork / reorder

---

### 5.2 Public Product and Checkout Routes

Product discovery and checkout pages live under the canonical `(public)` route group.

```txt
app/(public)/
├── produkte/
│   ├── page.tsx
│   ├── pp-etiketten-100x200/
│   ├── transparente-pp-etiketten-100x200/
│   ├── thermoetiketten-100x100/
│   └── thermo-versandetiketten-100x150/
├── konfigurator/
│   └── [productSlug]/
├── warenkorb/
├── checkout/
├── checkout/success/
└── checkout/cancel/
```

The MVP may use Stripe Checkout instead of a full custom cart.

If cart complexity slows MVP, implement:

> Product page → configuration → Stripe Checkout.

Do not overbuild cart logic before revenue.

---

### 5.3 Account Routes

Customer account routes support order tracking and reorder behavior.

```txt
app/(account)/
├── konto/
│   ├── page.tsx
│   ├── bestellungen/
│   │   ├── page.tsx
│   │   └── [orderId]/
│   ├── dateien/
│   ├── nachbestellen/
│   └── profil/
```

Customer account must allow:

1. View orders.
2. View order status.
3. View previous label specifications.
4. Reorder previous labels.
5. Upload corrected artwork.
6. Approve proof when required.

---

### 5.4 Admin Routes

Admin routes are protected.

```txt
app/(admin)/
├── admin/
│   ├── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [orderId]/
│   ├── quotes/
│   ├── customers/
│   ├── products/
│   ├── uploads/
│   └── settings/
```

Admin panel must be simple and reliable.

Admin must be able to:

- View orders
- Filter by status
- View uploaded artwork
- Download files
- Upload proof
- Request correction
- Change order status
- Add tracking number
- View quote requests
- View reorder history

---

### 5.5 API Routes

API routes handle integrations and secure backend workflows.

```txt
app/api/
├── stripe/
│   └── webhook/
├── checkout/
│   └── create-session/
├── upload/
├── quote/
├── orders/
├── proof/
├── reorder/
├── email/
└── admin/
```

Rules:

- Stripe webhook must verify signature.
- Public API endpoints must validate input.
- Admin endpoints must enforce authorization.
- File upload endpoints must validate file type and size.
- Never trust client-side price calculations.

---

## 6. Domain Modules

Business logic should be organized into domain modules.

```txt
lib/
├── auth/
├── db/
├── email/
├── env/
├── files/
├── leads/
├── orders/
├── pricing/
├── products/
├── proofing/
├── quotes/
├── reorder/
├── seo/
├── stripe/
└── validation/
```

### Module Responsibilities

| Module | Responsibility |
|---|---|
| `auth` | Session, role checks, account helpers |
| `db` | Prisma client and database helpers |
| `email` | Resend templates and triggers |
| `env` | Environment parsing and validation |
| `files` | File validation and storage helpers |
| `leads` | Lead capture and GTM pipeline helpers |
| `orders` | Order creation, status transitions |
| `pricing` | Price calculation rules |
| `products` | Product catalog and product config |
| `proofing` | Proof approval and correction workflows |
| `quotes` | Quote request logic |
| `reorder` | Saved-design and repeat-order workflows |
| `seo` | Metadata, schema, sitemap helpers |
| `stripe` | Checkout/session/webhook logic |
| `validation` | Zod schemas and input validation |

---

## 7. Data Model Overview

The full schema will be defined in `/docs/12-DATABASE-SCHEMA.md`.

Minimum core models:

```txt
User
Customer
Product
ProductVariant
PriceRule
Order
OrderItem
ArtworkFile
ProofFile
QuoteRequest
ReorderLink
Address
Shipment
Payment
OrderStatusEvent
EmailEvent
AdminNote
```

### Critical Relationships

```txt
Customer → Orders
Order → OrderItems
Order → ArtworkFiles
Order → ProofFiles
Order → Payment
Order → Shipment
Order → OrderStatusEvents
Order → ReorderLink
Product → ProductVariants
ProductVariant → PriceRules
QuoteRequest → ArtworkFiles
```

---

## 8. Product Architecture

Product data must be centralized.

Recommended config file:

```txt
config/products.ts
```

The product catalog must include:

1. 100×200 mm opaque PP labels
2. 100×200 mm transparent PP labels
3. 100×100 mm eco thermal labels
4. 100×150 mm thermal shipping labels
5. Sample box
6. Quote-only large quantity products

Each product must define:

- slug
- German title
- English internal title
- material
- size
- allowed quantities
- pricing mode
- upload required
- reorder eligible
- SEO metadata
- schema type
- cross-sell rules

---

## 9. Pricing Architecture

Pricing must be server-side.

Never trust browser-calculated prices.

Recommended module:

```txt
lib/pricing/
├── calculate-price.ts
├── constants.ts
├── shipping.ts
├── margin.ts
└── types.ts
```

Pricing calculation must consider:

- product type
- quantity
- material
- production cost
- estimated weight
- shipping type
- payment fees
- buffer
- margin target
- B2B quote threshold

MVP may use fixed package prices first:

| Package | Quantity | Product | Target price |
|---|---:|---|---:|
| Starter | 1,000 | 100×200 PP | €179 |
| Reorder Ready | 2,000 | 100×200 PP | €279 |
| Growth | 5,000 | 100×200 PP | €479 |
| Pro | 10,000 | 100×200 PP | €799 |
| Business | 20,000+ | 100×200 PP | Quote |

Large or complex orders should trigger quote request instead of direct checkout.

---

## 10. Order Architecture

### 10.1 Standard Paid Order Flow

```txt
Product page
→ Configure product
→ Upload artwork
→ Create pending order
→ Create Stripe Checkout Session
→ Stripe payment
→ Stripe webhook confirms payment
→ Order status becomes PAID
→ Admin file review
→ Proof / production approval
→ Production
→ Shipment
→ Delivery
→ Reorder reminder
```

### 10.2 Quote Order Flow

```txt
Quote landing
→ Customer submits quote request
→ Upload artwork optional
→ QuoteRequest saved
→ Admin reviews
→ Admin sends manual quote
→ Customer approves
→ Payment link or manual invoice
→ Order created
```

---

## 11. Required Order Status Machine

Order statuses:

```txt
DRAFT
PENDING_PAYMENT
PAID
FILE_REVIEW
PROOF_REQUIRED
WAITING_CUSTOMER_APPROVAL
APPROVED_FOR_PRODUCTION
IN_PRODUCTION
READY_TO_SHIP
SHIPPED
DELIVERED
COMPLETED
CANCELLED
REFUND_REQUESTED
REPRINT_REQUIRED
```

Status changes must be logged.

Create an `OrderStatusEvent` for every status update.

No production may start unless:

- Order is paid, or
- Admin explicitly approves manual payment/order.

---

## 12. Stripe Architecture

Stripe must be implemented with:

1. Server-side Checkout Session creation.
2. Stripe webhook endpoint.
3. Signature verification.
4. Idempotency handling.
5. Payment record persistence.
6. Secure success/cancel routes.
7. Order status update only through webhook.

Do not mark an order as paid from the client-side success page.

The success page may show a pending confirmation message until webhook updates the order.

---

## 13. File Upload Architecture

Artwork upload is critical.

Supported file types:

```txt
PDF
AI
EPS
SVG
PNG
JPG
ZIP
```

File upload requirements:

- Validate file extension.
- Validate MIME type when possible.
- Set max file size.
- Store customer ID and order ID.
- Store original filename.
- Store storage path.
- Store upload timestamp.
- Do not expose private storage URLs publicly.
- Admin can generate signed download URL.
- Customer can upload corrected file if admin requests correction.

Recommended model:

```txt
ArtworkFile
- id
- orderId
- customerId
- filename
- fileType
- mimeType
- sizeBytes
- storageProvider
- storagePath
- status
- uploadedAt
```

Artwork file statuses:

```txt
UPLOADED
UNDER_REVIEW
APPROVED
CORRECTION_REQUIRED
REPLACED
ARCHIVED
```

---

## 14. Proofing Architecture

Proofing is required for custom label orders.

Admin can:

1. Upload proof PDF/image.
2. Attach proof to order.
3. Set order status to `WAITING_CUSTOMER_APPROVAL`.
4. Customer can approve or request correction.
5. Approval is timestamped.
6. Admin can move order to production.

Proof statuses:

```txt
NOT_REQUIRED
PENDING_ADMIN_UPLOAD
WAITING_CUSTOMER_APPROVAL
APPROVED
CHANGES_REQUESTED
SUPERSEDED
```

---

## 15. Reorder Architecture

Reorder is a core architecture requirement.

Every completed order should create or update reorder metadata.

Reorder must store:

- original order ID
- product ID
- variant ID
- material
- label size
- quantity
- artwork file reference
- approved proof reference
- customer notes
- production notes
- reorder token if public reorder link is used

Reorder flow:

```txt
Customer account
→ Previous orders
→ Reorder
→ Same specs loaded
→ Customer can change quantity
→ Customer can request minor text change
→ New order created
→ Payment/quote flow
```

Public reorder link may be implemented later.

Security rule:

- Public reorder token must not expose private customer data without verification.
- Sensitive artwork files require authenticated access or signed links.

---

## 16. SEO Architecture

SEO must be part of route design, not added later.

Required SEO files:

```txt
app/sitemap.ts
app/robots.ts
lib/seo/metadata.ts
lib/seo/schema.ts
lib/seo/routes.ts
```

Every public page must define:

- title
- description
- canonical
- hreflang if multilingual later
- Open Graph tags
- structured data where relevant

Structured data types:

- Organization
- WebSite
- Product
- Service
- BreadcrumbList
- FAQPage
- CollectionPage

---

## 17. GEO / AI Search Architecture

AI-search visibility requires clear entity structure.

Implement:

- FAQ blocks
- comparison tables
- use-case sections
- product specification tables
- internal glossary links
- direct answers to buying questions

Create content structure that helps AI systems answer:

- What is Labelpilot.de?
- Who is it for?
- What products are sold?
- What sizes are available?
- What materials are available?
- Is artwork stored for reorder?
- Does Labelpilot serve German food and supplement brands?
- Is production in Turkey?
- How does shipping work?
- What is the reorder process?

---

## 18. Email Architecture

Email system should use Resend.

Email events:

1. Order received
2. Payment confirmed
3. Artwork received
4. File correction requested
5. Proof ready
6. Proof approved
7. Order in production
8. Order shipped
9. Order delivered
10. Reorder reminder
11. Quote request received
12. Quote response sent

Email templates should be stored in:

```txt
emails/
├── order-confirmation.tsx
├── payment-confirmed.tsx
├── proof-ready.tsx
├── shipped.tsx
├── quote-request-received.tsx
└── reorder-reminder.tsx
```

Customer-facing emails should be German-first.

---

## 19. Auth and Authorization Architecture

The system needs at least two roles:

```txt
CUSTOMER
ADMIN
```

Optional future roles:

```txt
SALES
PRODUCTION
SUPPORT
```

Authorization rules:

- Customers can only see their own orders.
- Customers can only access their own files.
- Admins can access all orders.
- Admins can change statuses.
- Only admins can upload proof files.
- Only admins can mark production/shipment statuses.
- Public quote form does not require login.
- Checkout may allow guest order initially but should encourage account creation.

---

## 20. Security Rules

Non-negotiable security rules:

1. Validate all form inputs with Zod.
2. Verify Stripe webhook signatures.
3. Do not expose secret keys to client.
4. Do not trust client-side pricing.
5. Use signed URLs for private files.
6. Restrict admin routes.
7. Escape or sanitize user-provided text where rendered.
8. Limit file upload size.
9. Validate file extensions.
10. Log critical order status changes.
11. Use environment variable validation.
12. Never commit secrets to GitHub.

---

## 21. Environment Architecture

Environment variables must be validated.

Required environment groups:

```txt
DATABASE
AUTH
STRIPE
STORAGE
EMAIL
APP_URL
ANALYTICS
```

Example:

```txt
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The final list belongs in `/docs/13-ENVIRONMENT-VARIABLES.md`.

---

## 22. Deployment Architecture

Deployment target:

```txt
GitHub → Vercel
```

Deployment environments:

```txt
development
preview
production
```

Rules:

- Production deploys only from main branch.
- Preview deploys for pull requests.
- Production database must not be modified manually without migration.
- Prisma migrations must be used.
- Stripe test mode must be used before live mode.
- Webhook endpoint must be tested before launch.

---

## 23. MVP Architecture Scope

MVP must include:

1. Public German pages
2. Product catalog
3. Product detail pages
4. Fixed pricing packages
5. Artwork upload
6. Stripe Checkout
7. Stripe webhook
8. Order database
9. Admin order list
10. Admin order detail
11. Admin status update
12. Quote request form
13. Customer order view
14. Basic reorder from previous order
15. SEO metadata
16. Sitemap and robots
17. Legal pages

MVP must not include:

- Multi-vendor marketplace
- Complex cart
- Full ERP
- Full warehouse system
- Advanced subscription billing
- Design editor
- AI design generator
- Too many product categories
- Real-time shipping API integrations
- Complex discounts
- Multi-language system beyond German-first basics

---

## 24. Future Architecture Phases

### Phase 1 — MVP

- Product pages
- Checkout
- Upload
- Orders
- Admin
- Quote requests
- Basic reorder

### Phase 2 — SEO/GEO Engine

- Programmatic landing pages
- FAQ schema
- Product schema
- Internal linking
- Content pages

### Phase 3 — Advanced Reorder

- Reorder reminders
- Saved specs
- Public reorder links
- Minor text change request
- Repeat order dashboard

### Phase 4 — B2B Sales Tools

- CRM-like lead flow
- Quote pipeline
- Manual pricing approval
- Sales notes
- Customer segmentation

### Phase 5 — Germany Hub

- Hub stock tracking
- Consolidated shipment batches
- Germany dispatch statuses
- Hub cost tracking

### Phase 6 — Production Operations

- Production batch planning
- Supplier/fason production tracking
- QC checklists
- Reprint workflows

---

## 25. Codex Implementation Rules

Codex must:

1. Read `/docs/00-PROJECT-BRIEF.md`.
2. Read `/docs/01-BUSINESS-MODEL.md`.
3. Read `/docs/03-PRODUCT-STRATEGY.md`.
4. Read `/docs/04-PRICING-AND-MARGIN-MODEL.md`.
5. Read `/docs/10-TECH-STACK.md`.
6. Read this architecture file.
7. Do not add generic print products.
8. Do not invent product categories.
9. Do not hardcode prices in random components.
10. Keep pricing logic server-side.
11. Keep file upload secure.
12. Keep Stripe webhook secure.
13. Keep admin routes protected.
14. Keep German SEO pages indexable.
15. Update documentation when architecture changes.

---

## 26. Architectural Verdict

The correct architecture is:

> Modular Next.js B2B commerce platform with Stripe checkout, secure artwork upload, admin proofing workflow, and reorder-first customer account system.

The wrong architecture is:

> Generic Shopify clone with many print categories and no repeat order infrastructure.

Labelpilot.de must be built for high-margin B2B repeat orders, not one-time low-value print transactions.
