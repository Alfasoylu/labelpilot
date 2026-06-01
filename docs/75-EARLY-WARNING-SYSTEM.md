# 75-EARLY-WARNING-SYSTEM.md

# Labelpilot.de — Early Warning System

## 1. Purpose

This document defines the early warning system for **Labelpilot.de**.

The goal is to detect dangerous business, SEO, operations, compliance, cash-flow and execution risks before they become expensive failures.

This document must be reviewed:

```txt
weekly during first 6 months
bi-weekly during months 6–12
monthly after year 1
before every major phase release
before any machinery purchase
before any Google Ads scale
before any programmatic SEO expansion
```

This file is not decoration.

It is the alarm system.

---

## 2. Executive Verdict

## 1. Hüküm: Yap

This early warning system is mandatory.

## 2. Neden: Kısa ve matematiksel

The business can fail even if the website looks good.

Main failure pattern:

```txt
traffic grows
orders arrive
manual operation increases
files get messy
reorders are slow
customer trust drops
cash gets trapped
Google distrusts thin pages
```

The correct system:

```txt
detect early signal
classify severity
take corrective action
pause expansion if needed
```

The wrong system:

```txt
notice the problem after money is burned
```

---

## 3. Severity Levels

Use these alarm levels:

| Level | Meaning | Action |
|---|---|---|
| GREEN | Normal | Continue |
| YELLOW | Early warning | Investigate within 7 days |
| ORANGE | Serious risk | Fix before scaling |
| RED | Critical | Stop related activity immediately |

Rule:

```txt
RED overrides growth.
```

No revenue target justifies ignoring RED risk.

---

## 4. Weekly Risk Review Format

Every weekly review must produce this table:

| Risk Area | Status | Signal | Owner | Action | Deadline |
|---|---|---|---|---|---|
| SEO | GREEN/YELLOW/ORANGE/RED | observed signal | person/agent | fix action | date |
| Operations |  |  |  |  |  |
| Reorder |  |  |  |  |  |
| Artwork |  |  |  |  |  |
| Cash |  |  |  |  |  |
| Compliance |  |  |  |  |  |
| AI Agents |  |  |  |  |  |

No vague review.

---

## 5. Risk 1 — Generic Print Shop Drift

## Why This Matters

If Labelpilot.de becomes a generic online print shop, it loses against:

```txt
Labelprint24
WIRmachenDRUCK
Flyeralarm
Onlineprinters
Vistaprint
Avery
Sticker Mule / StickerApp
```

## Early Warning Signals

| Signal | Level |
|---|---|
| New pages mention flyers, business cards, posters, wedding stickers | ORANGE |
| Homepage does not clearly say PP roll labels / B2B labels | ORANGE |
| New products are generic print products | RED |
| Google queries are mostly “cheap stickers / free templates / DIY labels” | YELLOW/ORANGE |
| Ads target “Aufkleber drucken” broadly | RED |

## Thresholds

```txt
If more than 20% of new content is outside PP/B2B label focus → ORANGE
If generic print categories enter navigation → RED
```

## Required Action

1. Remove or noindex generic pages.
2. Restore positioning:

```txt
German B2B label infrastructure for food, beverage and supplement micro brands.
```

3. Update internal links toward:

```txt
PP-Rollenetiketten
Supplement-Etiketten
Nachbestellen
Lot/SKT
Musterbox
```

## Owner

```txt
Founder + Claude review
```

---

## 6. Risk 2 — Google Thin Content / Scaled Content Risk

## Why This Matters

Google’s spam systems can distrust scaled low-value content.

The risk is not “many pages” alone.

The risk is:

```txt
many similar, low-value pages created for rankings
```

## Early Warning Signals

| Signal | Level |
|---|---|
| More than 20 new indexable pages published in one week | YELLOW |
| More than 10 similar programmatic pages published without Search Console review | ORANGE |
| Pages have no Kurzantwort/table/FAQ/CTA | ORANGE |
| Search Console shows many “Crawled - currently not indexed” pages | ORANGE |
| Google selects wrong canonicals | ORANGE |
| Programmatic pages sound keyword-swapped | RED |

## Thresholds

```txt
First 60 days > 30 indexable pages → ORANGE
First 90 days > 45 indexable pages → ORANGE
100+ pages before conversion proof → RED
```

## Required Action

1. Pause new page publishing.
2. Noindex weak pages.
3. Improve P0 pages.
4. Review Search Console.
5. Add unique information gain before reindexing.

## Owner

```txt
Codex implements
Claude audits
Founder approves sitemap changes
```

---

## 7. Risk 3 — SEO/GEO Misunderstanding

## Why This Matters

Chasing fake AI SEO hacks wastes time.

GEO success comes from:

```txt
clear direct answers
structured content
entity consistency
crawlability
internal links
visible content
trust
```

## Early Warning Signals

| Signal | Level |
|---|---|
| Codex creates llms.txt as “main GEO solution” | YELLOW |
| Pages add hidden AI text | RED |
| Schema claims content not visible on page | RED |
| Content has no direct answer block | ORANGE |
| Pages are written for bots, not buyers | ORANGE |

## Required Action

1. Apply `73-2026-EXPERT-GEO-SEO-TIPS.md`.
2. Add visible:

```txt
Kurzantwort
table
FAQ
CTA
internal links
```

3. Remove hidden/unsupported schema.

## Owner

```txt
Claude SEO audit
```

---

## 8. Risk 4 — Germany Trust Problem

## Why This Matters

German B2B buyers care about:

```txt
delivery clarity
legal pages
privacy
material confidence
file/proof process
no hidden customs surprises
```

## Early Warning Signals

| Signal | Level |
|---|---|
| High sample page visits but low sample requests | YELLOW |
| Quote leads ask “Wo wird produziert?” repeatedly | YELLOW |
| Customers ask about customs/import costs repeatedly | ORANGE |
| Legal pages incomplete at launch | RED |
| Trust badges/certifications are fake or unverified | RED |

## Thresholds

```txt
If more than 30% of quote leads ask about delivery/import → ORANGE
If legal pages missing before launch → RED
```

## Required Action

1. Make production/shipping transparency page stronger.
2. Add sample box CTA.
3. Add clear German FAQ.
4. Do not hide Turkey production.
5. Clarify tax/import handling honestly.

## Owner

```txt
Founder + legal/accounting advisor
```

---

## 9. Risk 5 — IOSS / Import / Customs Friction

## Why This Matters

Some orders may exceed low-value import thresholds and create customer friction if not handled transparently.

## Early Warning Signals

| Signal | Level |
|---|---|
| Customer receives unexpected import fee | RED |
| Carrier charges unexpected processing fee | ORANGE |
| Checkout implies all costs included but operations cannot guarantee it | RED |
| More than 10% of orders delayed at customs | ORANGE |
| Customers ask for DDP delivery repeatedly | YELLOW |

## Required Action

1. Pause affected checkout flow if misleading.
2. Move higher-value orders to quote.
3. Clarify tax/import handling.
4. Use logistics advisor.
5. Consider Germany hub trigger earlier if volume supports it.

## Owner

```txt
Founder + logistics/accounting
```

---

## 10. Risk 6 — LUCID / Packaging Compliance

## Why This Matters

Germany packaging compliance can create sales/legal risk.

## Early Warning Signals

| Signal | Level |
|---|---|
| Selling/shipping to Germany before LUCID/packaging setup clarified | ORANGE |
| Sample boxes shipped without packaging weight tracking | YELLOW |
| No annual packaging reporting process | ORANGE |
| Marketplace/customer asks for compliance proof | YELLOW |

## Required Action

1. Set up LUCID / dual system process.
2. Track packaging weights.
3. Create packaging compliance SOP.
4. Get professional verification.

## Owner

```txt
Founder
```

---

## 11. Risk 7 — GDPR / Cold Outreach Risk

## Why This Matters

Germany is sensitive on unsolicited commercial email and data processing.

## Early Warning Signals

| Signal | Level |
|---|---|
| Bulk cold email sent without review | RED |
| Leads added to newsletter without consent | RED |
| No source tracking for leads | ORANGE |
| High bounce/spam complaints | RED |
| Outreach copy misleading | ORANGE |

## Thresholds

```txt
Spam complaint rate > 0.3% → RED
Bounce rate > 5% → ORANGE
No opt-out process in repeated outreach → ORANGE
```

## Required Action

1. Stop bulk outreach.
2. Use manual qualified outreach only.
3. Separate newsletter consent.
4. Add source tracking.
5. Review legal basis with advisor.

## Owner

```txt
Founder + outbound operator
```

---

## 12. Risk 8 — Artwork / Versioning Chaos

## Why This Matters

Artwork memory is the moat.

If this fails, Labelpilot.de becomes a manual print shop.

## Early Warning Signals

| Signal | Level |
|---|---|
| Customer asks for old label and team cannot find it in under 5 minutes | ORANGE |
| Files are stored in email/WhatsApp only | RED |
| New version overwrites old version | RED |
| Order is not linked to exact ArtworkVersion | RED |
| Admin unsure whether v2 or v3 is final | ORANGE |
| Customer uploads same file again for reorder | YELLOW |

## Thresholds

```txt
Artwork retrieval time > 5 minutes → ORANGE
Any overwritten approved artwork version → RED
Any production from wrong version → RED
```

## Required Action

1. Implement/repair:

```txt
StoredDesign
ArtworkVersion
GeneratedPrintFile
ProofFile
```

2. Block production unless version is approved.
3. Add admin artwork search.
4. Add customer saved designs page.

## Owner

```txt
Codex implements
Claude tests
Founder verifies real workflow
```

---

## 13. Risk 9 — Lot/SKT Variable Data Error

## Why This Matters

For supplement customers, wrong lot or SKT can create serious operational damage.

## Early Warning Signals

| Signal | Level |
|---|---|
| Old lot/SKT reused without confirmation | RED |
| Excel upload accepts invalid rows | RED |
| Batch file generated without customer preview | ORANGE |
| Admin cannot see row-level validation errors | ORANGE |
| Barcode not validated | ORANGE |
| Customer reports wrong lot/SKT printed | RED |

## Thresholds

```txt
1 wrong lot/SKT production incident → RED
Excel validation missing → RED before supplement scale
```

## Required Action

1. Stop variable-data production.
2. Require Excel template.
3. Add row validation.
4. Add customer preview confirmation.
5. Add admin batch proof approval.
6. Add “new lot/SKT required” gate on reorder.

## Owner

```txt
Founder + Codex + admin operator
```

---

## 14. Risk 10 — Manual Operations Bottleneck

## Why This Matters

Manual work destroys margin.

## Early Warning Signals

| Signal | Level |
|---|---|
| Orders tracked in WhatsApp/email instead of admin panel | RED |
| More than 15 minutes admin time per reorder | ORANGE |
| More than 3 customer messages needed per standard order | ORANGE |
| Admin does not know next action per order | RED |
| File/proof status unclear | RED |
| Follow-up reminders done manually from memory | ORANGE |

## Thresholds

```txt
Average reorder handling > 5 minutes → YELLOW
Average reorder handling > 15 minutes → ORANGE
No next-action dashboard → RED after first 20 orders
```

## Required Action

1. Build admin queue.
2. Add status workflow.
3. Add next-action labels.
4. Automate reorder reminders.
5. Create SOP for each status.

## Owner

```txt
Codex + operations
```

---

## 15. Risk 11 — Net 14 / Payment Terms Cash Risk

## Why This Matters

Net 14 can increase conversion but kill cash flow.

## Early Warning Signals

| Signal | Level |
|---|---|
| Net 14 offered to first-time customer | ORANGE |
| Net 14 without credit limit | RED |
| More than 10% invoices late | ORANGE |
| One unpaid customer exceeds €500 | ORANGE |
| Production started before payment/approval rules | RED |
| Credit limit not enforced in software | RED |

## Required Action

1. Default to prepaid.
2. Net 14 only after 2 successful prepaid orders.
3. Set credit limit.
4. Add overdue lock.
5. Admin approval for exceptions.

## Owner

```txt
Founder + finance
```

---

## 16. Risk 12 — Early Machinery Purchase

## Why This Matters

Machinery before demand validation traps cash.

## Early Warning Signals

| Signal | Level |
|---|---|
| Considering €100k+ machine before stable €80k/month revenue | RED |
| Machine purchase justified by “we will sell more after buying it” | RED |
| No confirmed monthly volume forecast | ORANGE |
| No operator/service/consumable plan | ORANGE |
| Software/reorder system unfinished but machine planned | RED |

## Required Action

1. Pause purchase.
2. Use fason production.
3. Buy only QC/support equipment first.
4. Revisit machine at stable volume.

## Machine Gate

Do not buy serious press until:

```txt
monthly revenue €80k–€150k stable
repeat rate > 35%
top SKUs predictable
cash reserve available
operator plan ready
service plan ready
```

## Owner

```txt
Founder
```

---

## 17. Risk 13 — Fason Quality / Production Consistency

## Why This Matters

German B2B customers tolerate less quality inconsistency.

## Early Warning Signals

| Signal | Level |
|---|---|
| Wrong material | RED |
| Wrong roll direction | ORANGE |
| Color deviation complaints | ORANGE |
| Missing quantity | ORANGE |
| Cutting/edge issue | ORANGE |
| More than 3% orders need reprint | RED |
| No sample archive | ORANGE |

## Thresholds

```txt
Reprint rate > 3% → RED
Quality complaint rate > 5% → ORANGE
```

## Required Action

1. Add production card.
2. Add proof approval.
3. Add roll direction confirmation.
4. Add random QC check.
5. Archive samples.
6. Use inspection rewinder when justified.

## Owner

```txt
Operations + supplier
```

---

## 18. Risk 14 — Template Editor Complexity

## Why This Matters

Template editor can become a technical black hole.

## Early Warning Signals

| Signal | Level |
|---|---|
| Editor started before reorder/artwork system works | ORANGE |
| Freeform design allowed | ORANGE |
| PDF output not print-tested | RED |
| CMYK/bleed/crop mark uncertain but production automated | RED |
| Fabric/Konva loaded on all SEO pages | ORANGE |
| Font licensing unclear | ORANGE |

## Required Action

1. Delay editor until core system works.
2. Use locked templates only.
3. Admin approval before production.
4. Test PDF output with printer.
5. Lazy-load editor.

## Owner

```txt
Codex + Claude + production partner
```

---

## 19. Risk 15 — AI Agent Scope Creep

## Why This Matters

Codex/Claude can break sequence if prompts are loose.

## Early Warning Signals

| Signal | Level |
|---|---|
| Codex starts Phase 3 while Phase 1 incomplete | ORANGE |
| Agent creates unrequested products/pages | ORANGE |
| Agent ignores v2 docs | RED |
| Agent claims tests passed without command output | RED |
| Agent changes pricing/source-of-truth silently | RED |
| Multiple agents edit same files without review | ORANGE |

## Required Action

1. Use `74-CODEX-CLAUDE-BACKLOG-AND-SEO-RELEASE-SCHEDULE.md`.
2. One phase per prompt.
3. Codex implements.
4. Claude audits.
5. Founder approves phase gate.

## Owner

```txt
Founder
```

---

## 20. Risk 16 — CAC / Lead Quality Problem

## Why This Matters

Traffic is worthless if leads are low quality.

## Early Warning Signals

| Signal | Level |
|---|---|
| Many visitors, no quote/sample requests | YELLOW |
| Quote leads ask only for cheapest stickers | ORANGE |
| Sample box requests from private/hobby users | ORANGE |
| Google Ads CPL > €75 with low quality | ORANGE |
| No paid customer after 40 qualified leads | RED |
| Outbound reply rate near zero after 100 targeted contacts | ORANGE |

## Required Action

1. Tighten positioning.
2. Add qualification fields.
3. Use paid sample box.
4. Pause broad ads.
5. Improve landing copy.
6. Focus on food/supplement/packaged product brands.

## Owner

```txt
Founder + marketing
```

---

## 21. Risk 17 — Low Reorder Rate

## Why This Matters

The whole business depends on repeat orders.

## Early Warning Signals

| Signal | Level |
|---|---|
| 2nd order rate below 15% after 6 months | ORANGE |
| Customers reorder manually by email instead of portal | ORANGE |
| Reminder emails not sent | ORANGE |
| Reorder path takes more than 2 minutes | YELLOW |
| Reorder path takes more than 10 minutes | ORANGE |
| Stored designs not used | RED |

## Targets

```txt
2nd order within 6 months: 25% target
2nd order within 12 months: 40% target
same-artwork reorder share: 60%+
```

## Required Action

1. Improve saved designs page.
2. Add 30-day reminder.
3. Simplify reorder steps.
4. Ask stock-duration question.
5. Offer reorder CTA in emails/account.

## Owner

```txt
Product + operations
```

---

## 22. Risk 18 — Legal Overclaim

## Why This Matters

Food/supplement labels are regulated.

## Early Warning Signals

| Signal | Level |
|---|---|
| Page says “rechtssicher” | RED |
| Page says “EU-konform garantiert” | RED |
| Page implies Labelpilot checks Health Claims | RED |
| Compliance disclaimer missing on supplement/food pages | ORANGE |
| Customer asks Labelpilot to verify legal label content | YELLOW |

## Required Action

1. Remove overclaims.
2. Add disclaimer:

```txt
Hinweis: Für rechtliche Pflichtangaben, Zutaten, Nährwerte, Allergene, Health Claims und regulatorische Inhalte ist der Kunde verantwortlich. Labelpilot.de übernimmt Druckproduktion, technische Dateiprüfung und Layout-Unterstützung, jedoch keine rechtliche Prüfung.
```

3. Use legal advisor for final text.

## Owner

```txt
Claude content audit + legal advisor
```

---

## 23. Risk 19 — Pricing / Margin Drift

## Why This Matters

Winning customers with bad margin is not winning.

## Early Warning Signals

| Signal | Level |
|---|---|
| 1,000 unit orders dominate revenue | YELLOW |
| Average gross margin below 40% | ORANGE |
| Shipping/support cost not tracked | ORANGE |
| Discounts given before reorder proof | ORANGE |
| Variable data sold without premium | RED |
| Thermal labels become main acquisition focus | ORANGE |

## Required Action

1. Push 5,000 Growth package.
2. Quote 20,000+.
3. Price variable data separately.
4. Track shipping/support cost.
5. Avoid commodity thermal focus.

## Owner

```txt
Founder + finance
```

---

## 24. Risk 20 — Germany Hub Too Early

## Why This Matters

Hub before volume creates fixed cost.

## Early Warning Signals

| Signal | Level |
|---|---|
| Hub discussed before €50k monthly revenue | YELLOW |
| Hub lease planned before repeat volume | ORANGE |
| No monthly shipment forecast | ORANGE |
| Hub planned for prestige | RED |
| Dead stock risk ignored | ORANGE |

## Hub Gate

Consider only if:

```txt
monthly revenue €50k+
repeat revenue share 30%+
150+ monthly orders
qualified sample requests 50+/month
cash reserve 6 months hub cost
```

## Required Action

1. Use 3PL/pilot first.
2. Stock only sample boxes/thermal labels.
3. Avoid broad inventory.

## Owner

```txt
Founder
```

---

## 25. Red Flag Stop List

If any of these happen, stop the related activity immediately:

```txt
customer file is publicly accessible
payment can be faked
order marked paid without webhook
wrong lot/SKT printed
approved artwork overwritten
generic print products added to main nav
100+ pages published before conversion proof
Net 14 offered without credit limit
machine purchase before stable demand
legal compliance guarantee published
admin route accessible to customer
```

These are non-negotiable RED risks.

---

## 26. Weekly Dashboard Metrics

Track weekly:

```txt
indexed pages
Crawled - currently not indexed count
quote_form_submit
sample_box_submit
qualified leads
paid orders
average order value
gross margin estimate
reorder rate
same-artwork reorder share
artwork retrieval time
file correction rate
reprint rate
support messages/order
late invoices
quality complaints
```

---

## 27. Monthly Decision Review

Every month, answer:

```txt
Are we still a B2B label infrastructure platform?
Are we avoiding generic print drift?
Are P0 pages indexed?
Are leads qualified?
Are first customers repeating?
Is artwork memory working?
Is reorder faster than manual?
Are variable data errors controlled?
Are we still avoiding premature machine investment?
```

If any answer is no, pause expansion.

---

## 28. Codex / Claude Risk Audit Prompt

Use this prompt after every major implementation:

```txt
Read /docs/75-EARLY-WARNING-SYSTEM.md and audit the current codebase against all RED and ORANGE risks.

Output:
1. RED risks found
2. ORANGE risks found
3. YELLOW risks found
4. Files/routes causing risk
5. Required fixes
6. Whether release should be blocked

Do not be optimistic.
Do not ignore missing tests.
If evidence is missing, mark as risk.
```

---

## 29. Founder Self-Check

Before making any major decision, ask:

```txt
Does this increase repeat order speed?
Does this improve artwork memory?
Does this reduce manual operation?
Does this increase LTV?
Does this protect margin?
Does this avoid Google/content risk?
Does this avoid cash lock?
```

If no:

```txt
do not do it now
```

---

## 30. Final Verdict

The biggest danger is not competition.

The biggest danger is drifting into:

```txt
generic matbaa
manual operations
uncontrolled content publishing
early machine purchase
file/version chaos
```

This early warning system exists to keep the project on the only high-upside path:

```txt
German B2B label infrastructure
saved artwork
one-click reorder
variable data
refill prediction
B2B accounts
controlled SEO/GEO growth
```

If this document turns RED, growth stops until the risk is fixed.
