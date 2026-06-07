# S18 — Stripe TEST Readiness

**Track:** P6 — Sellability  
**Status:** Draft  
**Last updated:** 2026-06-07

---

## Purpose

Document what is required to run a full Stripe TEST round-trip for Labelpilot.de. Follow these steps before executing the `S17-SELLABILITY-TEST-CHECKLIST.md`.

---

## 1. Required ENV Variables

| Variable | Where used | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server-side API calls (create Checkout Session, retrieve Payment Intent) | Must start with `sk_test_` in TEST mode |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe.js initialisation | Must start with `pk_test_` in TEST mode |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification in `/api/stripe/webhook` | Obtained from Stripe Dashboard → Webhooks, or from `stripe listen` output |

> Production keys start with `sk_live_` / `pk_live_`. Never mix TEST and live keys.  
> Set these in Vercel → Project → Settings → Environment Variables for the Preview or Production environment as appropriate.

---

## 2. Getting TEST Mode Keys from the Stripe Dashboard

1. Log in to [https://dashboard.stripe.com](https://dashboard.stripe.com).
2. Toggle the **"Test mode"** switch (top-right of the dashboard). The header bar turns orange/grey to confirm TEST mode is active.
3. Go to **Developers → API keys**.
4. Copy the **Publishable key** (`pk_test_…`) and **Secret key** (`sk_test_…`).
5. For the webhook secret, go to **Developers → Webhooks → Add endpoint** (or select an existing endpoint) and copy the **Signing secret** (`whsec_…`).

---

## 3. Test Card Numbers

Use these on the Stripe Checkout page during testing. Any future expiry date and any 3-digit CVC are accepted.

| Scenario | Card number | Expected outcome |
|---|---|---|
| Successful payment | `4242 4242 4242 4242` | Payment succeeds; webhook fires `payment_intent.succeeded` |
| Insufficient funds (decline) | `4000 0000 0000 9995` | Stripe returns "Your card has insufficient funds." |
| Card declined (generic) | `4000 0000 0000 0002` | Stripe returns "Your card was declined." |
| Requires 3D Secure authentication | `4000 0025 0000 3155` | Stripe shows 3DS modal; complete or fail to test both paths |
| Expired card | `4000 0000 0000 0069` | Stripe returns "Your card has expired." |

Full list: [https://stripe.com/docs/testing#cards](https://stripe.com/docs/testing#cards)

---

## 4. Testing Webhooks Locally

Stripe cannot reach `localhost` directly. Use the Stripe CLI to forward events.

### 4.1 Install Stripe CLI

```bash
# macOS (Homebrew)
brew install stripe/stripe-cli/stripe

# Windows (Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Or download the binary from https://github.com/stripe/stripe-cli/releases
```

### 4.2 Log in

```bash
stripe login
# Opens browser to authenticate with your Stripe account
```

### 4.3 Forward events to the local dev server

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a webhook signing secret (`whsec_…`). Copy this value and set it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

### 4.4 Trigger a test event manually (optional)

```bash
stripe trigger payment_intent.succeeded
```

---

## 5. Post Round-Trip Verification Checklist

After completing a TEST payment (card `4242 4242 4242 4242`), verify the following:

| # | What to check | Where to check | Expected |
|---|---|---|---|
| 5.1 | Webhook received | Stripe CLI output or Dashboard → Webhooks → Recent deliveries | `payment_intent.succeeded` event with HTTP 200 response from Labelpilot |
| 5.2 | Order created in database | Supabase → Table editor → `orders` table | New row with correct `stripe_payment_intent_id`, status `paid` or equivalent |
| 5.3 | Order status updated | `/admin` → orders list | Test order visible with correct status |
| 5.4 | Confirmation email sent | Test inbox | Email received with order reference (requires RESEND configured — see note below) |
| 5.5 | Stripe payment in TEST dashboard | Dashboard → Payments (TEST mode) | Payment listed as "Succeeded" with correct amount |

> **RESEND note:** If `RESEND_API_KEY` is not yet configured, steps that require email (5.4 and S17 steps 4.3, 6.2) will not send mail. Mark as SKIPPED with a note; do not count as FAIL if RESEND is intentionally not yet active.

---

## 6. Switching Back to Production

Before going live:

1. Replace all `sk_test_` / `pk_test_` / `whsec_` TEST values with the live equivalents in Vercel environment variables.
2. Update the Stripe Webhook endpoint URL in the Dashboard from `localhost` to the production domain.
3. Re-run the S17 checklist with a real (but low-value) transaction to confirm the live path works.

---

*See also: `S17-SELLABILITY-TEST-CHECKLIST.md`, `S19-VAT-READINESS.md`*
