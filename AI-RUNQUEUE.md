# AI-RUNQUEUE.md

# Labelpilot.de - Autonomous Run Queue

## Purpose

This file is the execution queue for work that can be done autonomously while the founder is away.

Rules for every task in this queue:

- No founder decision required.
- Must follow `00-SOURCE-OF-TRUTH.md` and `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.
- Must not hardcode unresolved business/legal items from `RECONCILIATION-REPORT.md`.
- Must preserve `/teklif/*` and `/lp/*` landing-page noindex / no-sitemap / non-canonical-winner rules.
- Prefer small, deployable changes.
- Broken flow and SEO safety beat expansion work.

---

## Status Key

- `READY`: can be executed now without asking the founder.
- `BLOCKED`: depends on a previous task in this queue.
- `DONE`: already implemented in the current codebase.

---

## Run Queue

### 1. Technical Safety and Regression Gates

#### 1. Add SEO governance assertions for indexability and canonical rules

- Status: `DONE`
- Goal: Add automated checks for `robots`, `sitemap`, canonical metadata, and landing-page exclusion rules.
- Why autonomous: rules are already locked in source docs.

#### 2. Add regression checks for sitemap ownership

- Status: `DONE`
- Depends on: 1
- Goal: Verify only intended public pages enter sitemap and account/admin/api/landing routes stay excluded.

#### 3. Add regression checks for German-only customer-facing copy

- Status: `DONE`
- Goal: Extend the existing language guard so new public pages/components cannot leak Turkish or English copy.

#### 4. Add regression checks for order status transitions

- Status: `DONE`
- Goal: Lock server-side transition safety for `PENDING_PAYMENT`, `PAID`, `FILE_REVIEW`, `CORRECTION_REQUIRED`, `PROOF_REQUIRED`, `WAITING_CUSTOMER_APPROVAL`, `APPROVED_FOR_PRODUCTION`, `IN_PRODUCTION`, `SHIPPED`.

#### 5. Add regression checks for pricing engine invariants

- Status: `DONE`
- Goal: Cover fixed-package pricing, add-ons, custom-size quote fallback, VAT display, and no client-side price trust.

#### 6. Add regression checks for proof decision ownership and security

- Status: `DONE`
- Goal: Ensure only the correct customer can approve/request changes and that proof actions cannot mutate unrelated orders.

### 2. Phase 3 Lead Capture and Measurement

#### 7. Persist sample-box requests in the database

- Status: `DONE`
- Goal: Implement storage for sample-box submissions aligned with the lead model and docs.

#### 8. Capture UTM, referrer, landing page, and source fields on quote requests

- Status: `DONE`
- Goal: Upgrade the quote form persistence to store acquisition context required by Phase 3 docs.

#### 9. Capture UTM, referrer, landing page, and source fields on sample-box requests

- Status: `DONE`
- Depends on: 7
- Goal: Keep sample-box lead tracking symmetrical with quote tracking.

#### 10. Implement deterministic lead-scoring helpers

- Status: `DONE`
- Goal: Add a server-side scoring utility using fields already defined in docs and schema, without inventing new business policy.

#### 11. Apply lead scoring during quote and sample submission

- Status: `DONE`
- Depends on: 7, 8, 10
- Goal: Write score/quality values when leads are created.

#### 12. Add analytics event hooks for quote-form submit and sample-box submit

- Status: `DONE`
- Goal: Track the two required Phase 3 conversion events.

#### 13. Add admin lead list page

- Status: `DONE`
- Goal: Build the minimum searchable lead index for operations.

#### 14. Add admin lead detail page

- Status: `DONE`
- Depends on: 13
- Goal: Show full lead context, source data, score, and follow-up fields.

#### 15. Add simple lead status update controls in admin

- Status: `DONE`
- Depends on: 14
- Goal: Support the documented lead pipeline without inventing CRM complexity.

#### 16. Add lead follow-up note and next-follow-up editing in admin

- Status: `DONE`
- Depends on: 14
- Goal: Make the lead detail operationally usable.

### 3. Quote Operations

#### 17. Add admin quote list page

- Status: `DONE`
- Goal: Surface stored quote requests in a dedicated admin view.

#### 18. Add admin quote detail page

- Status: `DONE`
- Depends on: 17
- Goal: Show quote fields, source page, notes, and conversion-relevant details.

#### 19. Add quote status update actions

- Status: `DONE`
- Depends on: 18
- Goal: Implement the documented quote status pipeline server-side.

#### 20. Add quote internal notes

- Status: `DONE`
- Depends on: 18
- Goal: Let admin store internal processing context without exposing it publicly.

#### 21. Add quote confirmation and admin-notification email templates

- Status: `DONE`
- Goal: Cover the quote lifecycle with consistent German transactional email output.

### 4. Admin Operations Completion

#### 22. Harden admin route protection and API guard coverage

- Status: `DONE`
- Goal: Verify every admin page and admin API route uses the same protection rules.

#### 23. Add admin shipment tracking input and display

- Status: `DONE`
- Goal: Complete the documented shipment section in order detail.

#### 24. Add admin note timeline on order detail

- Status: `DONE`
- Goal: Make order processing auditable without changing business rules.

#### 25. Add order status history UI refinements and filters

- Status: `DONE`
- Goal: Improve operational readability of existing status events.

#### 26. Add safer error handling and operator feedback for admin pricing settings

- Status: `DONE`
- Goal: Make the newly added pricing settings screen more fault-tolerant and testable.

### 5. Artwork Management Foundation

#### 27. Add `StoredDesign` and `ArtworkVersion` schema/models

- Status: `DONE`
- Goal: Start the canonical artwork-memory foundation from the v2 docs.

#### 28. Implement artwork version creation from approved order artwork

- Status: `DONE`
- Depends on: 27
- Goal: Convert approved artwork into reusable saved design records instead of leaving them only attached to orders.

#### 29. Add signed/private artwork download flow for saved designs

- Status: `DONE`
- Depends on: 27
- Goal: Keep design files private while making them usable in customer/admin flows.

#### 30. Add customer saved-designs list route

- Status: `DONE`
- Depends on: 28, 29
- Goal: Expose the minimum account-side view of reusable artwork memory.

#### 31. Add customer saved-design detail route

- Status: `DONE`
- Depends on: 30
- Goal: Show artwork versions, spec summary, and reorder entry point.

#### 32. Add admin saved-design search page

- Status: `DONE`
- Depends on: 28
- Goal: Make saved artwork operationally searchable by customer, product, and date.

### 6. Reorder Engine v2

#### 33. Add reorder creation from saved design

- Status: `DONE`
- Depends on: 31
- Goal: Start a new order from a stored design without mutating the original order.

#### 34. Add reorder quantity selection with `20.000+` quote fallback

- Status: `DONE`
- Depends on: 33
- Goal: Keep fixed-package self-serve boundaries intact.

#### 35. Add same-artwork vs minor-change branch in reorder flow

- Status: `DONE`
- Depends on: 33
- Goal: Support the documented fork between exact repeat and small revision.

#### 36. Add reorder analytics events and confirmation messaging

- Status: `DONE`
- Depends on: 33, 34, 35
- Goal: Make the reorder path measurable and operationally clear.

### 7. Email Lifecycle Completion

#### 37. Add correction-required customer email

- Status: `DONE`
- Goal: Trigger a clear German customer email when artwork review requests correction.

#### 38. Add proof-ready customer email

- Status: `DONE`
- Goal: Notify the customer when a proof is uploaded and awaiting action.

#### 39. Add shipped-order customer email with tracking details

- Status: `DONE`
- Depends on: 23
- Goal: Close the shipment communication gap in the lifecycle.

#### 40. Add reminder-safe email sending guards and logging

- Status: `DONE`
- Goal: Prevent duplicate or silent-failure behavior in lifecycle email flows.

### 8. Phase 8 and Beyond Preparation Without Founder Input

#### 41. Add refill-reminder schema scaffolding without activation

- Status: `DONE`
- Goal: Prepare `RefillPrediction` / `ReorderReminder` foundations without turning on live behavior.

#### 42. Add reminder calculation helper behind a disabled flag

- Status: `DONE`
- Depends on: 41
- Goal: Implement the math and tests without enabling customer reminders yet.

#### 43. Add variable-data schema scaffolding without public UI

- Status: `DONE`
- Goal: Prepare `DesignVariable`, `VariableDataBatch`, and related records for later phases.

#### 44. Add CSV/Excel parser prototype and validation harness for variable data

- Status: `DONE`
- Depends on: 43
- Goal: Build the backend validation core before any customer-facing workflow.

#### 45. Add generated-print-file placeholder flow for reviewed variable-data batches

- Status: `DONE`
- Depends on: 44
- Goal: Create the first non-final but testable output path for variable-data processing.

### 9. Documentation and Queue Hygiene

#### 46. Update source docs when implemented work changes canonical behavior

- Status: `DONE`
- Goal: Append implementation-aligned updates to the authoritative docs without deleting architectural knowledge.

#### 47. Keep `AI-RUNQUEUE.md` pruned after each completed run

- Status: `DONE`
- Goal: Mark completed work, remove stale blockers, and keep the next autonomous step obvious.

### 10. Autonomous Queue Extension

#### 48. Add admin variable-data batch review page

- Status: `DONE`
- Goal: Expose `VariableDataBatch` and row validation output in admin without opening customer UI.

#### 49. Add generated-print placeholder download route for admin

- Status: `DONE`
- Depends on: 45, 48
- Goal: Let operations download the placeholder artifact produced from valid variable-data rows.

#### 50. Add reorder source context to admin order detail

- Status: `DONE`
- Goal: Show `reorderSourceDesignId`, version reference, mode, and stock-duration context on the order detail screen.

#### 51. Add stored-design badges for same-artwork vs minor-change reorders

- Status: `DONE`
- Depends on: 50
- Goal: Make reorder branch behavior visible in customer saved-design detail and admin design search.

#### 52. Add disabled reminder email template and payload builder

- Status: `READY`
- Depends on: 42
- Goal: Prepare German reorder-reminder email copy and payload assembly without enabling live sends.

---

## Recommended Execution Order

Run in this order unless the current branch already contains overlapping in-progress work:

1. Tasks 1-6
2. Tasks 7-16
3. Tasks 17-21
4. Tasks 22-26
5. Tasks 27-32
6. Tasks 33-36
7. Tasks 37-40
8. Tasks 41-45
9. Tasks 46-47

---

## Do Not Autonomously Decide

The following remain out of scope for autonomous hardcoding until the founder explicitly locks them:

- Final VAT / IOSS / import operating model
- Final VerpackG / LUCID compliance process
- Final delivery-time promise / SLA wording
- Final Net 14 eligibility and credit policy
- Final corporate / invoicing structure assumptions

Use implementation-neutral wording and feature flags where these topics touch code.
