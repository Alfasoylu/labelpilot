# 74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md

# Labelpilot.de — Codex + Claude Backlog and SEO-Safe Release Schedule

## 1. Purpose

This document creates the execution backlog for **Labelpilot.de** based on all MD files created so far.

It defines:

- which documents are the source of truth
- which old docs are overridden by v2 docs
- what Codex should build
- what Claude Code should review/implement
- the correct chronological order
- a Google-safe SEO/GEO content release schedule
- quality gates before pages enter sitemap/index
- how to avoid scaled content abuse / spam-like footprint
- what to build first for ROI

This is the master backlog file.

## Canonical Phase Authority

`74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md` is the **only canonical build-phase authority** for Labelpilot.de.

Legacy filenames such as `62..69` and execution prompts `43..51` are retained for history and implementation context, but their numeric labels are **not** the build-phase truth. When a legacy filename number conflicts with the real build order, `74` wins.

### Normalized Build Phase Ladder

Use this simplified ladder when discussing current implementation order:

| Canonical Build Phase | Name | Meaning |
|---|---|---|
| P0 | Foundation | Repo/docs/env/public foundation and release-safe technical base. |
| P1 | Revenue-Capable MVP | Revenue path is live only when checkout **and** transactional email are operational in production. |
| P2 | Artwork / Proof | File upload, technical review, proofing, and production gate. |
| P3 | Auth + Account | Real Supabase Auth, customer account access, and account-bound ownership. |
| P4 | Repeat / B2B | Reorder, reminders, company-account/B2B flows, and repeat-order infrastructure. |
| P5 | Admin / Ops | Operational admin control, shipment handling, quote/lead/order workflow. |
| P6 | SEO / Scale | GEO/content/template/programmatic scale after lower phases are stable. |

The detailed week-by-week and legacy-numbered sections below remain useful implementation history, but they do not override this normalized build ladder.

---

## 2. Executive Verdict

## 1. Hüküm: Yap

Build the project in **controlled phases**, not as one giant content/code dump.

## 2. Neden: Kısa ve matematiksel

If you publish 100 weak pages at once:

```txt
high crawl waste
thin content risk
duplicate intent risk
scaled content abuse risk
low conversion
```

If you publish 12–20 strong pages first:

```txt
crawlable
quality controlled
Search Console measurable
conversion path testable
lower spam footprint
```

Correct order:

```txt
core strategy → public MVP → lead capture → SEO foundation → price/product clarity → Stripe → artwork memory → admin → reorder → variable data → B2B accounts → template library → controlled programmatic expansion
```

Do not build template editor before saved designs/reorder/artwork versioning.

That is wrong sequencing.

---

## 3. Google Spam / Indexing Research Summary

## 3.1 Key Finding

Google does not say “publishing many pages at once is automatically spam.”

The real risk is:

```txt
many pages generated primarily to manipulate rankings
large amounts of unoriginal/low-value content
doorway-like pages
keyword-swapped pages
duplicate pages
thin programmatic pages
scraped/stiched content
pages not helpful to users
```

Google defines **scaled content abuse** as generating many pages mainly to manipulate rankings and not help users. The policy explicitly includes AI-generated pages without user value, scraped or transformed content, stitched content, and pages that exist mainly for keywords.

## 3.2 Crawl Budget Reality

Google’s crawl budget guidance says Google has limited crawling resources. Crawl demand depends on:

```txt
site size
update frequency
page quality
relevance
popularity
overall user value
content uniqueness
serving capacity
```

For a new site, dumping many low-value URLs can waste crawl attention.

## 3.3 AI/GEO Reality

Google states that AI Overviews / AI Mode use the same core SEO best practices:

```txt
crawl allowed
internal links
page experience
important content in text
structured data matching visible content
Search Console monitoring
```

Google also says there is no special AI schema, AI markup, or machine-readable AI file required.

## 3.4 Our Rule

The safe rule is:

> Publish fewer, stronger, commercially useful pages first. Add new page groups only after Search Console confirms crawling/indexing health and after each page passes the quality gate.

---

## 4. Source-of-Truth Document Hierarchy

## 4.1 Highest Priority v2 Docs

These override older versions where they conflict:

```txt
03-PRODUCT-STRATEGY-v2.md
12-DATABASE-SCHEMA-v2.md
19-CUSTOMER-PORTAL-v2.md
67-PHASE-6-REORDER-SYSTEM-v2.md
70-ARTWORK-MANAGEMENT-SYSTEM.md
71-VARIABLE-DATA-AUTOMATION.md
72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md
73-2026-EXPERT-GEO-SEO-TIPS.md
74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md
```

## 4.2 Core Business Docs

```txt
00-PROJECT-BRIEF.md
01-BUSINESS-MODEL.md
03-PRODUCT-STRATEGY-v2.md
04-PRICING-AND-MARGIN-MODEL.md
30-PRODUCT-CATALOG.md
58-COMPETITOR-LANDSCAPE-GERMANY.md
59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md
```

## 4.3 Technical Foundation Docs

```txt
10-TECH-STACK.md
11-ARCHITECTURE.md
12-DATABASE-SCHEMA-v2.md
13-ENVIRONMENT-VARIABLES.md
14-AUTH-AND-ACCOUNTS.md
39-REPO-SETUP-AND-FOLDER-STRUCTURE.md
40-VERCEL-DEPLOYMENT-CHECKLIST.md
41-STRIPE-TEST-PLAN.md
42-LAUNCH-READINESS-CHECKLIST.md
```

## 4.4 Order / Payment / Operations Docs

```txt
15-STRIPE-PAYMENT-FLOW.md
16-ORDER-FLOW.md
17-FILE-UPLOAD-AND-PROOFING.md
18-ADMIN-PANEL.md
19-CUSTOMER-PORTAL-v2.md
31-QUOTE-REQUEST-FLOW.md
32-SAMPLE-BOX-FLOW.md
33-REORDER-ECONOMICS.md
34-EMAIL-NOTIFICATIONS.md
35-ANALYTICS-KPI-DASHBOARD.md
36-GERMANY-HUB-ROADMAP.md
37-QA-TESTING-CHECKLIST.md
```

## 4.5 SEO / GEO / Content Docs

```txt
20-SEO-STRATEGY-2026.md
21-GEO-AI-SEARCH-STRATEGY.md
22-PROGRAMMATIC-SEO-PLAN.md
23-KEYWORD-MAP-GERMANY.md
24-METADATA-MAP.md
25-SCHEMA-MARKUP-MAP.md
26-SITEMAP-ROBOTS-CANONICAL.md
27-INTERNAL-LINKING-ENGINE.md
28-CONTENT-TEMPLATES-GERMAN.md
29-LEGAL-PAGES-GERMANY.md
49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md
51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md
73-2026-EXPERT-GEO-SEO-TIPS.md
```

## 4.6 Execution Prompt Docs

```txt
38-CODEX-FIRST-BUILD-PROMPT.md
43-CODEX-PHASE-1-EXECUTION-PROMPT.md
44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md
45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md
46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md
47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md
48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md
49-CODEX-PHASE-7-GEO-CONTENT-EXECUTION-PROMPT.md
50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md
51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md
```

## 4.7 Marketing / GTM Docs

```txt
52-GERMANY-OUTBOUND-RESEARCH-PLAYBOOK.md
```

Future / not yet written at this stage:

```txt
53-GOOGLE-ADS-PLAN-GERMANY.md
54-LANDING-PAGE-COPY-BANK.md
55-COLD-EMAIL-TEMPLATES-GERMANY.md
56-COMPETITOR-RESEARCH-FRAMEWORK.md
57-90-DAY-GTM-PLAN.md
```

---

## 5. Agent Roles

## 5.1 Codex Role

Codex is the implementation agent.

Codex should:

```txt
write code
create components
implement routes
implement database schema
implement API routes
run checks
produce PASS/FAIL reports
```

Codex must not:

```txt
invent business model
add random products
publish pages without quality gate
skip tests
claim tests passed without running them
```

## 5.2 Claude Code Role

Claude Code is the implementation reviewer and refactor agent.

**Every Codex patch must be reviewed under `61-CLAUDE-REVIEWER-PROTOCOL.md` before it can be released.** Codex output is untrusted until Claude independently verifies it (diff, file contents, command output, route/security/SEO/payment/DB checks) and issues a `PASS` / `PASS WITH RISKS` / `FAIL` verdict per that protocol. A patch is not "done" because Codex says so.

Claude should:

```txt
review Codex patches
check docs vs code alignment
catch stale docs
check architecture consistency
write missing tests
improve UX/copy where instructed
verify acceptance criteria
```

Claude must not:

```txt
rewrite strategy without reason
change product scope
add generic print categories
bypass documented order
```

## 5.3 Human / Founder Role

Human should:

```txt
approve phase gates
test real UX
verify pricing
verify supplier feasibility
review legal pages
capture competitor calculator screenshots
validate production output
```

Human should not:

```txt
ask agents to build all phases at once
publish hundreds of pages immediately
skip Search Console observation
chase every feature before first leads
```

---

## 6. Master Timeline Overview

> **Resolved numbering note:** the weekly timeline below remains canonical, but any conflicting numbers in `62..69` or `43..51` are filename labels only. Build-phase ownership stays here in `74`.

Recommended controlled timeline:

| Time | Phase | Main Goal | Public Indexable Pages Added |
|---|---|---|---:|
| Week 0 | Setup | Repo/docs/env | 0 |
| Weeks 1–2 | Phase 1 | Public MVP lead capture | 12–18 |
| Weeks 3–4 | Phase 2 | SEO/GEO foundation | 4–8 |
| Weeks 5–6 | Phase 3 | Leads + analytics + GTM | 0–3 |
| Weeks 7–8 | Phase 4 | Stripe fixed checkout | 0 |
| Weeks 9–11 | Phase 5 | Artwork management v1 | 0 |
| Weeks 12–14 | Phase 6 | Admin operations | 0 |
| Weeks 15–18 | Phase 7 | Reorder v2 | 1–3 |
| Weeks 19–22 | Phase 8 | Refill reminders | 1–2 |
| Weeks 23–28 | Phase 9 | Variable data automation | 2–4 |
| Weeks 29–34 | Phase 10 | B2B account portal | 0–2 |
| Weeks 35–44 | Phase 11 | Template library MVP | 5–10 |
| Month 12+ | Phase 12 | Programmatic expansion | 3–10/month max |

Do not exceed:

```txt
first 60 days: 25–30 indexable pages
first 90 days: 35–45 indexable pages
first 6 months: 60–80 indexable pages
```

Unless real Search Console data proves strong crawl/index quality.

---

## 7. SEO-Safe Content Release Rule

## 7.1 Page Publishing Throttle

New site release schedule:

| Period | Max New Indexable Pages | Rule |
|---|---:|---|
| Launch Week | 12–18 | Only P0 commercial/legal pages |
| Weeks 2–4 | +4–8 | Only high-quality guides/P1 pages |
| Month 2 | +8–12 | Only pages with unique intent |
| Month 3 | +10–15 | Add variable-data/reorder pages |
| Month 4–6 | +10/month | Only after indexing review |
| Month 6+ | 3–10/month | controlled expansion |

This is not because Google bans fast publishing automatically.

It is because new domains with many similar pages create:

```txt
crawl waste
quality uncertainty
duplicate intent
thin content risk
low trust
```

## 7.2 Sitemap Gate

A page goes into sitemap only after:

```txt
content QA passed
metadata exists
canonical exists
internal links exist
schema if needed
noindex false
not thin
not duplicate
CTA exists
FAQ/direct answer exists
```

## 7.3 Index Gate

A page is `index,follow` only if it has:

```txt
unique buyer intent
commercial or educational value
visible German content
structured table/block
FAQ
CTA
internal links
no legal overclaim
```

Otherwise:

```txt
noindex
not in sitemap
```

---

## 8. Page Quality Gate

Every public page must pass:

| Check | Required Result |
|---|---|
| German language | PASS |
| Unique search/user intent | PASS |
| H1 | PASS |
| Kurzantwort | PASS |
| Specific B2B buyer context | PASS |
| Table or structured block | PASS |
| FAQ if SEO/GEO page | PASS |
| CTA | PASS |
| Internal links | PASS |
| Metadata | PASS |
| Canonical | PASS |
| Schema matches visible content | PASS |
| Legal disclaimer if regulated category | PASS |
| No duplicate/thin content | PASS |
| No generic print drift | PASS |
| No unsupported claims | PASS |

If not PASS:

```txt
do not index
do not add to sitemap
```

---

## 9. Phase 0 — Repository and Planning Setup

## Timing

```txt
Week 0
```

## Goal

Create clean repo/project foundation.

## Docs to Read

```txt
00-PROJECT-BRIEF.md
10-TECH-STACK.md
11-ARCHITECTURE.md
13-ENVIRONMENT-VARIABLES.md
37-QA-TESTING-CHECKLIST.md
39-REPO-SETUP-AND-FOLDER-STRUCTURE.md
40-VERCEL-DEPLOYMENT-CHECKLIST.md
60-CODEX-AGENT-PROTOCOL.md
74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md
```

## Codex Tasks

```txt
initialize Next.js project if not done
set TypeScript
set Tailwind
set folder structure
create config folders
create .env.example
create basic layout
create route registry
create QA scripts
```

## Claude Tasks

```txt
review repo structure
check env safety
check folder naming
check docs referenced in README
```

## Acceptance Criteria

| Check | Required |
|---|---|
| Repo boots | PASS |
| Folder structure clean | PASS |
| Env template exists | PASS |
| No secrets committed | PASS |
| QA commands identified | PASS |

---

## 10. Phase 1 — Public MVP Lead Capture

## Timing

```txt
Weeks 1–2
```

## Goal

Launch the smallest correct German public site.

## Docs to Read

```txt
38-CODEX-FIRST-BUILD-PROMPT.md
43-CODEX-PHASE-1-EXECUTION-PROMPT.md
03-PRODUCT-STRATEGY-v2.md
30-PRODUCT-CATALOG.md
24-METADATA-MAP.md
26-SITEMAP-ROBOTS-CANONICAL.md
27-INTERNAL-LINKING-ENGINE.md
28-CONTENT-TEMPLATES-GERMAN.md
29-LEGAL-PAGES-GERMANY.md
42-LAUNCH-READINESS-CHECKLIST.md
73-2026-EXPERT-GEO-SEO-TIPS.md
```

## Indexable Pages to Publish

Launch with only:

```txt
/de
/de/pp-rollenetiketten
/de/opake-pp-etiketten
/de/transparente-pp-etiketten
/de/etiketten-100x200
/de/supplement-etiketten
/de/lebensmittel-etiketten
/de/getraenke-etiketten
/de/angebot-anfordern
/de/musterbox
/de/nachbestellen
/de/druckdaten
/de/produktion-versand
/de/kontakt
/de/impressum
/de/datenschutz
/de/agb
/de/versand
/de/widerruf
```

Max indexable pages:

```txt
18–19
```

## Codex Tasks

```txt
create public routes
create German layout
create product pages
create quote form
create sample form
create reorder info page
create druckdaten page
create legal skeletons
create sitemap/robots
create metadata
create basic schema
create internal links
```

## Claude Tasks

```txt
review German copy
review no generic print drift
review quality gate
review sitemap excludes private/future pages
review legal placeholders
```

## SEO Release Rule

Do not publish P1 guides/programmatic/template pages yet.

## Acceptance Criteria

| Check | Required |
|---|---|
| Public MVP works | PASS |
| Forms work or safe placeholder | PASS |
| Sitemap clean | PASS |
| No English UI | PASS |
| No more than 19 indexable pages | PASS |

---

## 11. Phase 2 — SEO/GEO Foundation

## Timing

```txt
Weeks 3–4
```

## Goal

Strengthen existing pages and add only a few high-value pages.

## Docs to Read

```txt
20-SEO-STRATEGY-2026.md
21-GEO-AI-SEARCH-STRATEGY.md
23-KEYWORD-MAP-GERMANY.md
24-METADATA-MAP.md
25-SCHEMA-MARKUP-MAP.md
26-SITEMAP-ROBOTS-CANONICAL.md
27-INTERNAL-LINKING-ENGINE.md
28-CONTENT-TEMPLATES-GERMAN.md
44-CODEX-PHASE-2-SEO-EXECUTION-PROMPT.md
73-2026-EXPERT-GEO-SEO-TIPS.md
```

## Pages to Add

Add only 4–8 max:

```txt
/de/ratgeber/pp-etiketten-vs-papieretiketten
/de/ratgeber/transparente-vs-opake-etiketten
/de/ratgeber/rollenetiketten-vs-bogenetiketten
/de/ratgeber/druckdaten-vorbereiten
/de/kaffee-etiketten
/de/gewuerz-etiketten
/de/honig-marmelade-etiketten
/de/flaschenetiketten
```

Do not add all if quality is weak.

## Codex Tasks

```txt
add direct answer blocks
add FAQ schema only where visible
add BreadcrumbList schema
complete internal links
add guide pages
add P1 pages only if strong
```

## Claude Tasks

```txt
verify no duplicate content
verify all FAQ visible
verify internal links
review E-E-A-T and disclaimers
```

## Acceptance Criteria

| Check | Required |
|---|---|
| P0 pages improved | PASS |
| 4–8 new quality pages max | PASS |
| No thin pages | PASS |
| Search Console submitted | PASS |

---

## 12. Phase 3 — Leads, Analytics and GTM Readiness

## Timing

```txt
Weeks 5–6
```

## Goal

Make the site measurable and sales-ready.

## Docs to Read

```txt
31-QUOTE-REQUEST-FLOW.md
32-SAMPLE-BOX-FLOW.md
35-ANALYTICS-KPI-DASHBOARD.md
50-CODEX-PHASE-8-B2B-LEAD-FLOW-EXECUTION-PROMPT.md
52-GERMANY-OUTBOUND-RESEARCH-PLAYBOOK.md
```

## Codex Tasks

```txt
implement lead database records
implement quote request persistence
implement sample request persistence
capture source/UTM/referrer
add lead scoring
add admin lead list if simple
add analytics events
```

## Claude Tasks

```txt
verify form validation
verify privacy checkbox
verify source tracking
verify lead scoring logic
```

## SEO Release Rule

No major content expansion.

Only fix existing content based on Search Console.

## Acceptance Criteria

| Check | Required |
|---|---|
| quote_form_submit tracked | PASS |
| sample_box_submit tracked | PASS |
| leads stored | PASS |
| source data captured | PASS |

---

## 13. Phase 4 — Stripe Fixed Package Checkout

## Timing

```txt
Weeks 7–8
```

## Goal

Accept safe paid orders for approved fixed products.

## Docs to Read

```txt
15-STRIPE-PAYMENT-FLOW.md
16-ORDER-FLOW.md
41-STRIPE-TEST-PLAN.md
45-CODEX-PHASE-3-STRIPE-EXECUTION-PROMPT.md
59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md
```

## Codex Tasks

```txt
server-side price calculation
pending order creation
Stripe Checkout
webhook verification
payment record
success/cancel pages
20,000+ quote redirect
```

## Claude Tasks

```txt
test price tampering
test webhook idempotency
test failed payment
check no success-page paid mutation
```

## SEO Release Rule

No new pages.

Focus on money path.

## Acceptance Criteria

| Check | Required |
|---|---|
| server price | PASS |
| webhook marks paid | PASS |
| duplicate webhook safe | PASS |
| 20,000+ quote only | PASS |

---

## 14. Phase 5 — Artwork Management Foundation

## Timing

```txt
Weeks 9–11
```

## Goal

Create the core moat: saved design + artwork versioning.

## Docs to Read

```txt
12-DATABASE-SCHEMA-v2.md
17-FILE-UPLOAD-AND-PROOFING.md
19-CUSTOMER-PORTAL-v2.md
46-CODEX-PHASE-4-UPLOAD-PROOF-EXECUTION-PROMPT.md
70-ARTWORK-MANAGEMENT-SYSTEM.md
```

## Codex Tasks

```txt
implement StoredDesign
implement ArtworkVersion
implement private file upload
implement version numbering
implement customer saved designs route
implement admin artwork search
implement signed downloads
```

## Claude Tasks

```txt
verify no public files
verify version never overwritten
verify ownership rules
verify old design search works
```

## SEO Release Rule

No content expansion.

## Acceptance Criteria

| Check | Required |
|---|---|
| StoredDesign works | PASS |
| ArtworkVersion works | PASS |
| private files | PASS |
| customer can view own designs | PASS |
| admin can find design quickly | PASS |

---

## 15. Phase 6 — Admin Operations

## Timing

```txt
Weeks 12–14
```

## Goal

Make operations manageable before scaling orders.

## Docs to Read

```txt
18-ADMIN-PANEL.md
47-CODEX-PHASE-5-ADMIN-EXECUTION-PROMPT.md
37-QA-TESTING-CHECKLIST.md
66-PHASE-5-ADMIN-PANEL.md
```

## Codex Tasks

```txt
protect admin routes
order list/detail
lead list/detail
quote list/detail
stored design view
file review
proof upload
status transitions
admin notes
shipment tracking
```

## Claude Tasks

```txt
test customer blocked from admin
test invalid status transitions
test internal notes hidden
test signed downloads
```

## SEO Release Rule

No new content.

## Acceptance Criteria

| Check | Required |
|---|---|
| admin protected | PASS |
| order operations | PASS |
| file/proof operations | PASS |
| lead/quote operations | PASS |

---

## 16. Phase 7 — Reorder Engine v2

## Timing

```txt
Weeks 15–18
```

## Goal

Make reorder fast and software-driven.

## Docs to Read

```txt
33-REORDER-ECONOMICS.md
48-CODEX-PHASE-6-REORDER-EXECUTION-PROMPT.md
67-PHASE-6-REORDER-SYSTEM-v2.md
19-CUSTOMER-PORTAL-v2.md
70-ARTWORK-MANAGEMENT-SYSTEM.md
```

## Codex Tasks

```txt
reorder from StoredDesign
select quantity
ask stock duration
reference ArtworkVersion
create new Order
handle 20,000+ quote
support minor change
support same artwork
```

## Claude Tasks

```txt
verify original order unchanged
verify artwork version referenced
verify ownership
verify no payment bypass
```

## Pages to Add

Only if product works:

```txt
/de/gespeicherte-druckdaten
/de/etiketten-nachbestellen
```

Max new pages:

```txt
2–3
```

## Acceptance Criteria

| Check | Required |
|---|---|
| 30-sec reorder path | PASS |
| stock duration saved | PASS |
| new order created | PASS |
| original unchanged | PASS |

---

## 17. Phase 8 — Refill Prediction and Reminder Automation

## Timing

```txt
Weeks 19–22
```

## Goal

Trigger repeat orders automatically.

## Docs to Read

```txt
12-DATABASE-SCHEMA-v2.md
33-REORDER-ECONOMICS.md
34-EMAIL-NOTIFICATIONS.md
67-PHASE-6-REORDER-SYSTEM-v2.md
```

## Codex Tasks

```txt
create RefillPrediction
calculate depletion date
schedule 30-day reminders
send reorder email
track reminder click/order created
```

## Claude Tasks

```txt
verify reminder timing
verify no spam email behavior
verify opt-out/pause
verify German email copy
```

## Pages to Add

Optional:

```txt
/de/etikettenbestand-erinnerung
```

Max new pages:

```txt
1–2
```

## Acceptance Criteria

| Check | Required |
|---|---|
| prediction created | PASS |
| 30-day reminder scheduled | PASS |
| reminder email German | PASS |
| reorder from reminder | PASS |

---

## 18. Phase 9 — Variable Data Automation

## Timing

```txt
Weeks 23–28
```

## Goal

Enter supplement segment properly.

## Docs to Read

```txt
12-DATABASE-SCHEMA-v2.md
71-VARIABLE-DATA-AUTOMATION.md
59-TOP-10-PRODUCT-PRICE-RESEARCH-GERMANY.md
19-CUSTOMER-PORTAL-v2.md
```

## Codex Tasks

```txt
DesignVariable model
manual Lot/SKT entry
Excel template download
Excel/CSV upload
row validation
preview table
VariableDataBatch
GeneratedPrintFile placeholder/first implementation
admin review
```

## Claude Tasks

```txt
test bad Excel
test date validation
test required Lot/SKT
test no old lot accidental reorder
test admin review gate
```

## Pages to Add

```txt
/de/etiketten-mit-lotnummer-skt
/de/variable-daten-etiketten
/de/etiketten-per-excel-importieren
```

Max new pages:

```txt
3
```

## Acceptance Criteria

| Check | Required |
|---|---|
| manual variable fields | PASS |
| Excel upload | PASS |
| validation | PASS |
| batch preview | PASS |
| admin review | PASS |

---

## 19. Phase 10 — B2B Company Accounts and Net 14

## Timing

```txt
Weeks 29–34
```

## Goal

Support real B2B procurement.

## Docs to Read

```txt
12-DATABASE-SCHEMA-v2.md
14-AUTH-AND-ACCOUNTS.md
19-CUSTOMER-PORTAL-v2.md
15-STRIPE-PAYMENT-FLOW.md
```

## Codex Tasks

```txt
CompanyAccount
CompanyMember
roles
permissions
order limits
PaymentTermProfile
Net 14 status
credit limit
approval flow
```

## Claude Tasks

```txt
test role permissions
test designer cannot pay if blocked
test credit limit
test Net 14 not default
```

## Pages to Add

Optional public trust page:

```txt
/de/b2b-konto
```

Max new pages:

```txt
1–2
```

## Acceptance Criteria

| Check | Required |
|---|---|
| company account | PASS |
| multi-user roles | PASS |
| order limits | PASS |
| Net 14 gated | PASS |

---

## 20. Phase 11 — Template Library MVP

## Timing

```txt
Weeks 35–44
```

## Goal

Use templates for SEO and conversion, not as a freeform design toy.

## Docs to Read

```txt
12-DATABASE-SCHEMA-v2.md
72-TEMPLATE-LIBRARY-AND-CANVAS-EDITOR.md
73-2026-EXPERT-GEO-SEO-TIPS.md
28-CONTENT-TEMPLATES-GERMAN.md
```

## Codex Tasks

```txt
TemplateCategory
DesignTemplate
TemplateVersion
public template listing
template detail pages
preview images
editable field schema
canvas editor MVP
PDF generator prototype
convert generated output to StoredDesign
```

## Claude Tasks

```txt
review template JSON schema
review editor locked fields
review PDF output assumptions
verify no heavy editor JS on SEO pages
```

## SEO Release Rule

Template pages must be released slowly.

Initial:

```txt
/de/vorlagen
/de/vorlagen/supplement-etikett-modern
/de/vorlagen/kaffee-etikett-minimal
/de/vorlagen/honigglas-etikett-natural
/de/vorlagen/gewuerz-etikett-clean
/de/vorlagen/seifenetikett-premium
```

Max initial template pages:

```txt
5–6
```

Then:

```txt
5/month max
```

until Search Console proves indexing quality.

## Acceptance Criteria

| Check | Required |
|---|---|
| template pages quality | PASS |
| editor locked | PASS |
| generated design becomes StoredDesign | PASS |
| SEO pages lightweight | PASS |

---

## 21. Phase 12 — Controlled Programmatic SEO

## Timing

```txt
Month 12+
```

## Goal

Scale only after foundation, Search Console and conversion proof.

## Docs to Read

```txt
22-PROGRAMMATIC-SEO-PLAN.md
51-CODEX-PROGRAMMATIC-SEO-EXECUTION-PROMPT.md
73-2026-EXPERT-GEO-SEO-TIPS.md
```

## Initial Programmatic Pages

Only first 3:

```txt
/de/supplement-etiketten/transparente-pp-etiketten
/de/lebensmittel-etiketten/opake-pp-etiketten
/de/getraenke-etiketten/transparente-pp-etiketten
```

## Expansion Rule

Add:

```txt
3–10 pages/month max
```

only if:

```txt
existing pages indexed
no canonical errors
relevant impressions
no duplicate content problems
qualified engagement exists
```

## Stop Rule

Stop if:

```txt
Discovered - currently not indexed grows
Crawled - currently not indexed grows
wrong canonicals appear
pages get irrelevant impressions
no conversion path
content sounds AI-generated
```

---

## 22. Google-Safe Indexing Schedule

## Month 1

Index:

```txt
P0 commercial pages
legal pages
quote/sample/reorder/druckdaten
```

Total:

```txt
18–19 pages
```

## Month 2

Add:

```txt
4 guides
3–4 P1 industry pages
```

Total cumulative:

```txt
25–30 pages
```

## Month 3

Add:

```txt
variable data/reorder moat pages
1–2 glossary pages only if useful
```

Total cumulative:

```txt
35–45 pages
```

## Month 4–6

Add:

```txt
template hub
first 5 templates
selected glossary
selected comparison pages
```

Total cumulative:

```txt
60–80 pages
```

## Month 6–12

Add based on data:

```txt
3–10 pages/month
```

Never mass-publish 100 template/programmatic pages.

---

## 23. Search Console Decision Gates

Review every 2 weeks after launch.

## Gate A — Crawl Health

Proceed if:

```txt
P0 pages crawled
no server errors
sitemap read
robots clean
no canonical disaster
```

## Gate B — Index Health

Proceed if:

```txt
P0 pages indexed or progressing
no large duplicate/canonical issue
not many soft 404s
```

## Gate C — Query Quality

Proceed if impressions include:

```txt
pp rollenetiketten
supplement etiketten
lebensmitteletiketten
transparente pp etiketten
etiketten nachbestellen
```

Pause if queries are mostly:

```txt
free templates
DIY stickers
wedding stickers
unrelated print
```

## Gate D — Conversion Quality

Proceed if:

```txt
quote_form_submit
sample_box_submit
contact/lead exists
```

If no leads:

```txt
fix conversion before adding pages
```

---

## 24. Backlog Priority Matrix

## P0 — Must Build First

```txt
public MVP
quote/sample forms
SEO foundation
lead tracking
pricing/product pages
```

## P1 — Money Path

```txt
Stripe checkout
orders
artwork upload
stored designs
admin panel
```

## P2 — Moat

```txt
reorder v2
refill prediction
variable data automation
B2B company accounts
```

## P3 — Growth

```txt
template library
locked canvas editor
programmatic SEO
Google Ads
outbound scale
```

## P4 — Infrastructure Scale

```txt
Germany hub
advanced ERP
deep automation
API integrations
```

---

## 25. What Not To Build Early

Do not build before Phase 7:

```txt
full template editor
large template library
large programmatic SEO
Net 14 automation
Germany hub
hundreds of pages
complex dashboard charts
unnecessary marketplace integrations
```

Reason:

```txt
no first-order proof
no reorder proof
no operational data
```

---

## 26. Codex Execution Cycle

For each phase, Codex must output:

```txt
## Summary
## Docs Read
## Files Changed
## Routes Created
## DB Changes
## Checks Run
## Manual QA
## Acceptance Criteria
## Risks / Missing
## Next Step
```

Codex must not write:

```txt
all good
should work
tests passed
```

unless commands actually ran.

---

## 27. Claude Review Cycle

After Codex patch, Claude must review:

```txt
docs vs code consistency
business scope drift
security
SEO/indexing rules
German UI
acceptance criteria
test coverage
migration risk
```

Claude must output:

```txt
PASS
PASS WITH RISKS
FAIL
```

No vague review.

---

## 28. Release Gate

Deploy only if:

```txt
npm run lint PASS
npm run typecheck PASS
npm run build PASS
npx prisma validate PASS if DB touched
manual route checks PASS
SEO noindex/sitemap checks PASS
```

For Stripe:

```txt
webhook test PASS
idempotency PASS
```

For file upload:

```txt
private file access PASS
ownership test PASS
```

For reorder:

```txt
original order unchanged PASS
new order created PASS
```

---

## 29. Google Spam Avoidance Rules

Do:

```txt
publish in phases
create unique pages
add direct answer/table/FAQ
ensure internal links
use noindex for drafts
exclude thin pages from sitemap
monitor Search Console
update pages based on real queries
```

Do not:

```txt
mass-publish keyword-swapped pages
create city pages without local operation
scrape competitor content
use AI to generate hundreds of similar pages
stuff keywords
hide text
add fake reviews
create doorway pages
publish all template pages at once
```

---

## 30. Opportunity Cost

If you ignore this backlog and publish everything at once:

```txt
Google may crawl weak pages first
important pages may be delayed
quality signals diluted
Search Console becomes noisy
content may look scaled/AI-generated
developer agents lose sequence
cash goes to features before leads
```

The opportunity cost is high.

Correct sequence protects:

```txt
crawl quality
engineering focus
cash
conversion
long-term SEO trust
```

---

## 31. Final Backlog Verdict

The correct path is:

```txt
lead capture first
quality SEO second
payment/order third
artwork memory fourth
admin fifth
reorder sixth
refill reminders seventh
variable data eighth
B2B account ninth
template library tenth
programmatic expansion last
```

The wrong path is:

```txt
hundreds of pages + complex editor + no repeat order system
```

Labelpilot.de wins by becoming a **repeat label infrastructure system**, not by becoming another online print shop.

---

## 32. References

Google documentation and research principles used for this backlog:

```txt
https://developers.google.com/search/docs/essentials/spam-policies
https://developers.google.com/crawling/docs/crawl-budget
https://developers.google.com/search/docs/fundamentals/creating-helpful-content
https://developers.google.com/search/docs/appearance/ai-features
```

Key source takeaways:

1. Scaled content abuse is many low-value/unoriginal pages created mainly to manipulate rankings.
2. Crawl budget is influenced by quality, uniqueness, popularity, relevance and serving capacity.
3. AI Search features use existing SEO fundamentals; no special AI schema or AI file is required.
4. Content should be created primarily to help users, not only to attract search traffic.

---

## 33. Implementation Progress Snapshot (2026-06-04)

Progress note appended to keep backlog sequencing aligned with code reality:

- Phases 1-3 are materially represented in code: public MVP, SEO safety rules, lead capture, analytics hooks, and admin lead handling.
- Phase 4 money path is live in code for fixed packages: server-side order creation, Stripe Checkout, webhook verification, and upload/proof entry.
- Phase 5 artwork-memory foundation is now live in code: approved artwork becomes `StoredDesign` + `ArtworkVersion`, customer saved-design routes exist, and private download flow is enforced.
- Phase 6 admin operations are materially live in code: protected admin routes, order/lead/quote operations, shipment tracking, and admin notes.
- Phase 7 reorder foundation is now live in code: reorder from `StoredDesign`, quantity gate with `20.000+` quote fallback, same-artwork vs minor-change fork, and checkout/webhook handling for reorder source context.
- Phase 8 is still intentionally disabled in production behavior, but schema and calculation helpers now exist for refill reminders.
- Phase 9 is still intentionally internal-only, but schema scaffolding, CSV/XLSX parsing, validation harness, and generated-print placeholder logic now exist.
- Remaining canonical next work should stay in-sequence: variable-data review surfaces, generated artifact handling, reminder email activation safeguards, then B2B account layer.
