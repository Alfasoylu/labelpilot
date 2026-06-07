# 14-AUTH-AND-ACCOUNTS.md

> **Status: PARTIALLY IMPLEMENTED.**
> Supabase Auth is live for customer accounts (`/konto`). Password reset (email-based) and password change for logged-in users are implemented as of 2026-06-06. Admin is still protected by Basic-Auth stopgap (not Supabase roles). See §40 for the implementation log.

---

## 40. Implementation Log — 2026-06-06 (Claude Code Session)

### 40.1 Password Reset Flow (`app/(account)/konto/KontoClient.tsx`)

- **"Passwort vergessen?" button** on the login form opens a `forgotMode` form.
- Submitting the forgot-mode form calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/konto" })` — sends a reset email with a hash-based token.
- When the user clicks the reset link, they return to `/konto`; the Supabase client fires `PASSWORD_RECOVERY` in `onAuthStateChange`.
- `KontoClient` detects this event and sets `passwordRecovery(true)`, which renders a "Neues Passwort setzen" form (before the standard login gate).
- Submitting calls `supabase.auth.updateUser({ password })` and redirects to the normal dashboard.

### 40.2 Password Change for Logged-in Users (`app/(account)/konto/KontoClient.tsx`)

- A "Passwort" card in the authenticated dashboard shows a toggle-based change-password form.
- Calls `supabase.auth.updateUser({ password })` directly (no email step needed).
- Result message shown inline; form collapses on success.

### 40.3 Technical Notes

- Uses plain `@supabase/supabase-js` browser client (not `@supabase/ssr`). Hash-based tokens fire `PASSWORD_RECOVERY` in `onAuthStateChange` — no separate `/auth/callback` route needed.
- Confirmation + mismatch validation done client-side before calling `updateUser`.

---

# Labelpilot.de — Auth and Accounts

## 1. Purpose

This document defines authentication and account rules for **Labelpilot.de**.

Labelpilot.de is a German-language, Germany-focused, B2B-first custom PP roll label ordering and reorder platform.

The auth/account system must support:

- customer accounts
- admin accounts
- protected admin panel
- customer order access
- customer file access
- proof approval
- reorder access
- quote/lead flows
- secure private file handling
- future staff roles

This document is the source of truth for Codex when implementing authentication, authorization and account-related flows.

---

## 2. Core Auth Verdict

The correct auth system is:

> Simple customer/admin account system with server-side authorization, private order/file access and reorder-safe customer ownership.

The wrong auth system is:

> Open routes, client-only checks, public file URLs and customers able to access other customers’ orders.

Auth is not optional because Labelpilot.de stores private artwork, order data and payment history.

---

## 3. Required Source Documents

Before implementing auth/account logic, Codex must read:

```txt
/docs/00-PROJECT-BRIEF.md
/docs/10-TECH-STACK.md
/docs/11-ARCHITECTURE.md
/docs/12-DATABASE-SCHEMA-v2.md
/docs/13-ENVIRONMENT-VARIABLES.md
/docs/16-ORDER-FLOW.md
/docs/17-FILE-UPLOAD-AND-PROOFING.md
/docs/60-CODEX-AGENT-PROTOCOL.md
/docs/66-PHASE-5-ADMIN-PANEL.md
/docs/67-PHASE-6-REORDER-SYSTEM-v2.md
/docs/14-AUTH-AND-ACCOUNTS.md
```

If there is conflict, Codex must stop and report it.

---

## 4. Language Rule

Customer-facing auth/account UI must be German.

German customer-facing labels:

```txt
Anmelden
Konto erstellen
Meine Bestellungen
Bestellung ansehen
Druckdatei hochladen
Proof freigeben
Etiketten nachbestellen
Abmelden
```

Not allowed in customer UI:

```txt
Login
Create account
My orders
Upload artwork
Approve proof
Reorder
```

Allowed English:

- code identifiers
- database enum values
- internal developer logs
- admin-only technical terms if unavoidable

---

## 5. Auth Provider Decision

Canonical MVP auth provider:

```txt
Supabase Auth
```

Why:

1. Same platform as database/storage.
2. Simpler ownership mapping.
3. Works well with private storage.
4. Reduces vendor sprawl.

Alternatives considered (not used in MVP): Clerk may be evaluated later, but do not use two auth systems simultaneously unless explicitly designed.

---

## 6. Required Roles

Minimum roles:

```txt
CUSTOMER
ADMIN
```

Future roles:

```txt
SALES
PRODUCTION
SUPPORT
```

MVP role rules:

| Role | Access |
|---|---|
| CUSTOMER | Own account, own orders, own files, own proofs, own reorders |
| ADMIN | All orders, all quote requests, all uploaded files, admin panel |
| SALES | Future: leads/quotes/customers |
| PRODUCTION | Future: production/file view only |
| SUPPORT | Future: customer support actions |

Do not build complex RBAC in MVP.

Start with CUSTOMER and ADMIN.

---

## 7. Account Types

The system must support:

### 7.1 Guest Lead

A visitor submits quote/sample/contact form without account.

Data becomes a Lead or QuoteRequest.

### 7.2 Guest Checkout Customer

A customer places order with email but may not have created password/account yet.

### 7.3 Registered Customer

A customer has an account and can access:

- previous orders
- uploads
- proof approvals
- reorder
- saved label specs

### 7.4 Admin User

Admin can access `/admin`.

---

## 8. Account Creation Strategy

Do not block first purchase with heavy account friction.

Recommended MVP strategy:

1. Customer can request quote without account.
2. Customer can submit sample box form without account.
3. Customer can checkout with email.
4. After order, invite customer to create account or use magic link.
5. Customer account improves reorder.

Best commercial logic:

> Low friction first order, account creation for proof/reorder/order tracking.

---

## 9. Customer Account Routes

Required customer routes:

```txt
/konto
/konto/bestellungen
/konto/bestellungen/[orderId]
/konto/dateien
/konto/nachbestellen
/konto/profil
```

German route prefix decision:

Option A:

```txt
/de/konto
```

Option B:

```txt
/konto
```

Recommended:

```txt
/konto
```

Reason:

Account pages are not SEO pages and do not need `/de` prefix. UI text is still German.

Account pages must not be indexed.

---

## 10. Admin Routes

Required admin routes:

```txt
/admin
/admin/orders
/admin/orders/[orderId]
/admin/quotes
/admin/quotes/[quoteId]
/admin/leads
/admin/leads/[leadId]
/admin/customers
/admin/customers/[customerId]
/admin/uploads
/admin/settings
```

Admin routes must be protected server-side.

No customer or unauthenticated visitor may access admin data.

---

## 11. Route Protection Rules

### 11.1 Public Routes

Accessible to everyone:

```txt
/de
/de/lebensmittel-etiketten
/de/supplement-etiketten
/de/getraenke-etiketten
/de/angebot-anfordern
/de/musterbox
/de/kontakt
```

### 11.2 Customer Routes

Require customer authentication or secure magic link:

```txt
/konto/*
```

### 11.3 Admin Routes

Require ADMIN role:

```txt
/admin/*
```

### 11.4 API Routes

Must validate access depending on action.

Examples:

| API | Requirement |
|---|---|
| Create quote request | Public with validation |
| Create checkout | Public/customer with validation |
| View own order | Customer ownership |
| Upload artwork | Customer ownership or secure order token |
| Download file | Customer ownership or admin |
| Admin status update | ADMIN |
| Stripe webhook | Stripe signature, not session auth |

---

## 12. Customer Ownership Rules

Customer can only access:

1. Their own orders.
2. Their own uploaded artwork.
3. Their own proof files.
4. Their own reorder links/orders.
5. Their own account data.

Customer cannot access:

1. Other customer orders.
2. Other customer files.
3. Admin notes.
4. Internal production cost.
5. Internal supplier/fason notes.
6. Stripe internal events.

Ownership must be enforced server-side.

Do not rely on frontend hiding.

---

## 13. Admin Authorization Rules

Admin can:

1. View all orders.
2. View all customers.
3. View all quote requests.
4. View all leads.
5. Download uploaded files.
6. Upload proofs.
7. Change valid order statuses.
8. Add internal notes.
9. Add shipment tracking.
10. Mark quote/lead statuses.

Admin cannot:

1. Bypass Stripe payment safety silently.
2. Start production from invalid status.
3. Expose private customer files publicly.
4. Delete financial/order history casually.

---

## 14. Magic Link Strategy

Magic links can reduce account friction.

Recommended use cases:

1. Customer order access after guest checkout.
2. Proof approval link.
3. File upload after payment.
4. Reorder link later.

Security rules:

1. Token must be random and unguessable.
2. Token must expire.
3. Token should be scoped to one action/order.
4. Token must not expose all account data.
5. Sensitive file downloads still require signed URLs.
6. Public reorder token must not expose private artwork without verification.

MVP may start with login/account only and add magic links later.

---

## 15. Proof Approval Security

Proof approval must be protected.

Allowed methods:

1. Authenticated customer account.
2. Secure one-time/magic link scoped to order/proof.

Proof approval must store:

```txt
customerApprovedAt
customerApprovedByUserId
customerApprovalIp
proofFileId
```

Do not allow anonymous untracked approval.

---

## 16. File Access Security

Files are private.

Access rules:

| User | File Access |
|---|---|
| Customer | Own files only |
| Admin | All files |
| Public visitor | No file access |
| Search engine | No file access |

File downloads must use signed URLs or authenticated server proxy.

Never use permanent public URLs for artwork/proofs.

---

## 17. Reorder Access Security

Customer can reorder only their own eligible orders.

Rules:

1. Check order ownership.
2. Check reorder eligibility.
3. Create new order.
4. Reference previous approved artwork.
5. Do not modify original order.
6. Do not expose artwork URL publicly.
7. Server calculates reorder price.

Public reorder links require separate secure token logic.

Do not implement public reorder token casually.

---

## 18. Auth UI Requirements

Customer auth pages should be minimal.

Required pages/actions:

```txt
Anmelden
Konto erstellen
Passwort vergessen
Abmelden
```

If magic link is used:

```txt
Link zum Anmelden senden
```

German UI examples:

```txt
E-Mail-Adresse
Passwort
Anmelden
Konto erstellen
Link senden
```

Error examples:

```txt
Bitte geben Sie eine gültige E-Mail-Adresse ein.
Die Anmeldung ist fehlgeschlagen.
Sie haben keinen Zugriff auf diese Bestellung.
```

---

## 19. Customer Account UI Requirements

Customer dashboard `/konto` should show:

1. Recent orders.
2. Orders needing action.
3. Proofs waiting for approval.
4. Files requiring correction.
5. Reorder options.
6. Contact/support link.

German labels:

```txt
Meine Bestellungen
Aktion erforderlich
Proof wartet auf Freigabe
Korrektur erforderlich
Etiketten nachbestellen
```

---

## 20. Admin Auth UI Requirements

Admin login can reuse auth provider.

Admin unauthorized message:

```txt
Sie haben keinen Zugriff auf diesen Bereich.
```

Admin should not be discoverable through public navigation.

Admin routes must be noindex/excluded.

---

## 21. Database Mapping

Auth user maps to `User`.

`User` maps to `Customer` for customer accounts.

Required conceptual fields:

```txt
User.id
User.email
User.role
Customer.userId
Customer.email
```

Rules:

1. Email may exist before user account due to guest quote/order.
2. When customer creates account, match by email carefully.
3. Avoid duplicate customer records where possible.
4. Admin users do not need customer records.

---

## 22. Guest Checkout Mapping

If checkout is guest:

1. Create Customer record with email/company info.
2. Create Order under Customer if possible.
3. If user later creates account with same email, link Customer to User.
4. Avoid exposing orders just because someone knows an email.
5. Use auth/magic link to verify ownership.

---

## 23. GDPR and Privacy

Auth/account system must support privacy basics.

Rules:

1. Do not collect unnecessary data.
2. Show privacy policy on forms.
3. Customer account data must be protected.
4. Uploaded files private.
5. Marketing consent separate from transactional account/order communication.
6. Future export/delete workflow should be possible.

Do not automatically subscribe customers to marketing emails.

---

## 24. Session Security

Rules:

1. Use secure auth provider session handling.
2. Do not store sensitive auth tokens in localStorage if avoidable.
3. Protect server actions/API routes.
4. Validate user on server.
5. Handle logout.
6. Avoid leaking session data to public pages.
7. Use HTTPS in production.

---

## 25. API Authorization Pattern

Every protected API route must follow:

```txt
1. Get current user/session server-side.
2. If missing, return unauthorized.
3. Check role or ownership.
4. Validate input.
5. Perform action.
6. Return safe response.
```

Do not perform database mutation before authorization.

---

## 26. Noindex Rules

These routes must not be indexed:

```txt
/konto
/konto/*
/admin
/admin/*
/checkout
/checkout/*
/api/*
```

Robots and metadata must reflect this.

---

## 27. Auth Acceptance Criteria

Auth/accounts are accepted when:

| Check | Required Result |
|---|---|
| Customer can sign in | PASS |
| Customer can access own account | PASS |
| Customer cannot access another order | PASS |
| Customer can view own order | PASS |
| Customer can upload own file | PASS |
| Customer can approve own proof | PASS |
| Customer can reorder own eligible order | PASS |
| Admin can access admin panel | PASS |
| Customer cannot access admin panel | PASS |
| Unauthenticated user cannot access admin panel | PASS |
| Admin routes are noindex | PASS |
| File downloads require ownership/admin | PASS |
| Public pages do not require auth | PASS |
| German customer-facing auth UI | PASS |

---

## 28. Test Checklist

Codex must run available checks:

```txt
npm run lint
npm run typecheck
npm run build
```

Manual tests:

1. Visit public page logged out.
2. Try `/konto` logged out.
3. Sign in as customer.
4. View own order.
5. Try another customer order URL.
6. Upload own file.
7. Try another customer file URL.
8. Approve own proof.
9. Try `/admin` as customer.
10. Sign in as admin.
11. Access `/admin`.
12. Check admin can see orders.
13. Check customer cannot see admin notes.
14. Check account pages are noindex.
15. Check German UI text.

---

## 29. Common Mistakes to Avoid

Do not:

1. Use client-only route protection.
2. Let customer access by guessing order ID.
3. Expose private files.
4. Make proof approval anonymous without token/user.
5. Let customer access admin route.
6. Mix two auth providers.
7. Force account creation before quote request.
8. Make public SEO pages depend on auth.
9. Show English customer UI.
10. Store secrets in client.
11. Use email alone as proof of ownership without verification.
12. Allow public reorder without scoped secure token.

---

## 30. Codex Implementation Rules

Codex must:

1. Choose one auth provider.
2. Document auth provider decision.
3. Implement role checks server-side.
4. Implement ownership checks server-side.
5. Protect admin routes.
6. Protect customer routes.
7. Keep public routes accessible.
8. Keep account UI German.
9. Keep admin data private.
10. Update docs if auth model changes.

---

## 31. Final Auth Verdict

The correct auth model is:

> Low-friction public lead/order entry, secure customer account for files/proofs/reorders, and strict admin-only operations.

The wrong auth model is:

> No ownership checks, public file URLs and client-only admin hiding.

Labelpilot.de stores private artwork and order history. Trust depends on access control.
