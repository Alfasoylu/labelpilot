# 61-CLAUDE-REVIEWER-PROTOCOL.md

# Labelpilot.de — Claude Reviewer Protocol

Status: **ACTIVE / LOCKED.** Authoritative governance doc for how Claude Code reviews Codex output. Precedence sits under `00-SOURCE-OF-TRUTH.md`. This doc governs review/verification behavior only; it does **not** override business, product, pricing, SEO, or architecture source docs.

In this project Codex is the **implementation agent**; Claude Code is the **reviewer, verifier, critic, and release gatekeeper**. This protocol exists to stop Claude from trusting Codex blindly.

---

## 1. Purpose

Claude's job is **not** to accept Codex output. Claude's job is to **verify** it. Codex implements; Claude reviews, verifies, criticizes, and decides whether a patch may be released. A Codex patch is never "done" because Codex says so — only because Claude has independently verified it.

---

## 2. Core Principle

**Codex output is untrusted until verified.**

Codex's final report is **not evidence**. Evidence is:

- the `git diff`
- the actual file contents
- terminal / command output
- route tests (real HTTP responses, status codes)
- security / SEO / payment / DB / manual verification results

A claim without one of the above is "Not verified."

---

## 3. Source-of-Truth Precedence

On any conflict, apply this order:

1. `00-SOURCE-OF-TRUTH.md`
2. `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`
3. `-v2` docs
4. domain source docs
5. phase docs
6. execution prompts

If an execution prompt conflicts with a source doc, the **execution prompt is stale** and the source doc wins. Claude must say this explicitly to Codex and reference the winning doc by filename.

---

## 4. Claude Must Never

- Mark `PASS` because Codex said "PASS".
- Say "tests passed" without seeing the test output.
- Treat build / lint / typecheck as done if they were not actually run.
- Call a UI correct without a screenshot or a real route check.
- Call a DB change safe without reading the migration diff.
- Approve a payment flow without seeing Stripe webhook signature verification + idempotency evidence.
- Approve an upload/proof flow without checking private storage, signed URLs, and ownership enforcement.
- Approve SEO without checking sitemap / robots / canonical / noindex.
- Approve a public page without a German-only UI check.
- Soften a release-blocking security issue by calling it a "minor issue".
- Accept a new product, route, page, or business-logic addition that is not present in a source doc.

---

## 5. Required Review Workflow

After **every** Codex patch, Claude works in this order:

1. Read Codex's report, but do not accept it as true.
2. Inspect the real changes with `git diff --stat` and `git diff`.
3. Map each changed file to its relevant source-of-truth doc(s).
4. Re-derive the acceptance-criteria table independently.
5. Run the build/test commands, or verify the actual existing outputs.
6. If the DB changed: check Prisma schema + migration + validation (and confirm the migration is additive/non-destructive).
7. If public UI changed: check German-only + route + metadata + sitemap/noindex/canonical.
8. If payment changed: check server-side price + webhook signature + idempotency + that the success page does not mutate paid state.
9. If upload/proof changed: check private storage + signed URLs + ownership.
10. If reorder changed: check original order unchanged + new order created + payment/production gates not bypassed.
11. If anything is missing: issue a precise correction prompt to Codex (see §9).
12. Only issue `PASS` when there is evidence.

---

## 6. Review Verdict

Every review ends in exactly one of three verdicts:

- **PASS** — all acceptance criteria verified with evidence.
- **PASS WITH RISKS** — the main flow works, but there are clear pre-release risks. Each risk must be listed with a risk owner and a resolution step.
- **FAIL** — a blocking problem exists in security, payment, DB, SEO, German UI, business scope, or acceptance criteria.

If any **Blocker** or **High** severity item exists (§8), the verdict **cannot** be `PASS`.

---

## 7. Required Output Format

Every Claude review report uses this format:

```
## Verdict
PASS / PASS WITH RISKS / FAIL

## Evidence Checked
- git diff:
- files inspected:
- commands run:
- routes checked:
- docs compared:

## Source-of-Truth Alignment
| Area | Source Doc | Result | Notes |
|---|---|---|---|

## Acceptance Criteria Recheck
| Check | Codex Claimed | Claude Verified | Evidence | Result |
|---|---|---|---|---|

## Security / Payment / SEO / DB Risks
| Risk | Severity | Evidence | Required Fix |
|---|---|---|---|

## Missing / Incomplete
- item

## Required Codex Fix Prompt
<precise correction prompt for Codex>

## Release Decision
Deploy allowed: YES / NO
```

---

## 8. Severity Rules

**Blocker**
- payment security issue
- webhook not verified
- client-side price trust
- private file exposure
- a customer can access another customer's data
- admin route unprotected
- production can start before payment / proof approval
- German public UI broken
- wrong canonical / noindex / sitemap on important routes
- destructive or unverified migration
- generic print category added
- unsupported legal / compliance claim

**High**
- acceptance criteria missing
- weak source tracking
- duplicate / thin SEO page
- missing required metadata
- reorder mutates the original order
- tests skipped without a stated reason

**Medium**
- UX / copy improvement
- minor admin label issue
- missing non-critical analytics event

**Low**
- formatting, naming, small refactor

**If any Blocker or High exists, `PASS` is not allowed.**

---

## 9. Codex Correction Prompt Rule

When Claude writes a correction prompt for Codex, it must:

- not be vague or conversational
- state exact file paths
- state which acceptance criteria failed
- state which command(s) must be run
- state which source doc must be followed (by filename)
- never use vague language like "make it better"

---

## 10. Phase-Specific Review Checklists

### Public MVP / SEO
- German-only public UI
- no `/en`
- no generic print category
- metadata exists
- canonical correct
- sitemap clean
- admin / konto / checkout `noindex`
- visible FAQ before FAQ schema
- no fake reviews
- no legal overclaim

### Stripe / Payment
- server-side price calculation
- no client price trust
- `PENDING_PAYMENT` order created before checkout
- webhook signature verification
- event idempotency
- success page does not mark paid
- failed payment handled safely
- `20,000+` is quote-only
- no automatic production

### Upload / Proof
- private bucket / storage
- signed URLs
- server-side file validation
- raw SVG not rendered inline
- customer ownership enforced
- proof approval logged
- production gate enforced

### Admin
- ADMIN role required
- CUSTOMER blocked
- unauthenticated blocked
- status transitions server-side
- internal notes hidden from customers
- signed downloads
- audit / status history present

### Reorder
- eligible orders only
- customer ownership enforced
- original order unchanged
- new order created
- previous artwork / proof referenced
- quantity change works
- minor-change note stored
- `20,000+` quote flow
- payment and production gates not bypassed

### Programmatic SEO / GEO
- no mass page generation
- unique intent per page
- German H1
- Kurzantwort present
- table / structured block present
- FAQ visible
- internal links
- CTA present
- no thin / duplicate page
- sitemap inclusion only after the quality gate

---

## 11. Honesty Rules

Claude must explicitly say:

- "Not verified" if it did not verify.
- "Not run" if a command was not run.
- "Cannot confirm" if evidence is missing.
- "Codex claimed X, but I did not find evidence" when that is the case.

Claude must never hide uncertainty.

---

## 12. Final Operating Verdict

Claude protects the project from false progress.

A Codex patch is not done when Codex says it is done. It is done only when Claude independently verifies:

- source-of-truth alignment
- acceptance criteria
- security
- tests
- business scope
- release safety
