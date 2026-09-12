# Data completeness + monochrome luxury proposal

User brief: 12 September 2026. Two delivery teams (Data / Design), followed by an independent review team. Design is not accepted until the user explicitly approves the concrete proposal, even if the evaluation matrix passes.

## Goals and ownership

1. Data: account for every catalog field and every supported comparison combination, verify claims against official insurer material, enrich/correct only evidenced facts, and maintain an explicit unresolved ledger.
2. Design: produce a reviewable responsive proposal with white/black as the dominant palette, restrained existing blue, a noticeably more refined hierarchy and composition, and the same concise answers/working flows.
3. Independent review: reproduce data checks, examine evidence and design against the matrix, return defects for revision. Root integrates reviewed artifacts and shows the proposal.

Data research owner: data_evidence_team. Design artifact owner: luxury_design_team. Independent checker: independent_review_team. Root owns the checkout, local preview and integration. No main-page visual replacement before user approval. No public hosting in this local review round.

## Evaluation matrix

| Gate | Required evidence | Pass condition |
| --- | --- | --- |
| D1 Inventory | Plan × field ledger, all categories | Every entry and field accounted for; missing count visible |
| D2 Source accuracy | Official page/PDF, locator, date, selected tier | Each changed fact matches actual source and tier |
| D3 Semantic accuracy | Value, unit, basis, inclusion, conditions | Per-year/disease/visit, optional cover and price kind retained |
| D4 Completeness | Verified-filled / quote-dependent / not-published / unresolved counts | No unexplained gaps; unresolved remains open, never silently passed |
| D5 Comparison | Every supported pair/triple plus incompatible combinations | No cross-purpose comparisons or equality inferred from missing facts |
| D6 Regression | Domain/compare validations and downstream contract checks | No broken selectors, price filters or historical snapshots |
| U1 Direction | Concrete Browse, Detail and Compare proposal | White/black dominant; blue only purposeful accents; no gold/glow/ornament |
| U2 Luxury | Composition, typography, spacing, imagery | Clear visual change beyond simply recoloring current cards; useful results in first viewport |
| U3 Readability | Thai copy and dominant values | Concise headings, ≥16px main body, ≥14px routine labels, no clipped Thai glyphs |
| U4 Usability | Desktop/mobile, keyboard, focus, controls | No page overflow, ≥44px actions, all table columns readable |
| U5 Integrity | Facts and flow represented honestly | No invented price, rating, trust claim, eligibility or API behavior |
| U6 Independent review | Findings and revision ledger | Blocking findings fixed and checked again |
| U7 User approval | Explicit reply approving shown proposal/version | PASSED — user approved proposal 02: “ok ใช้เลย” |

## Iteration rule

Audit → research/design → evaluate → fix → evaluate again. Track all open findings. Passing schema or an automated matrix does not prove source accuracy or user approval. A source that does not publish an individualized limit/premium cannot justify a guessed value; keep the unknown visible and record what evidence/quote is needed.

Current stage: public-source research round complete; unresolved evidence remains open. Proposal 02 explicitly approved and main visual rollout completed. External plan sync: pending (Miro tool unavailable).

### Design scoring anchors

Independent review scores visual dimensions 0–5: 0 broken/missing, 1 poor, 2 inconsistent, 3 baseline usable, 4 clearly refined with minor issues, 5 fully meets the observed brief. Weights: composition/spacing20, typography20, monochrome palette15, imagery/detail15, working-flow clarity15, responsive/accessibility15 (100 total). Technical target ≥90/100, no blocking defect. This score is not proof of user satisfaction: U7 remains required and cannot be passed by either team or root.

Data gates are binary per evidence item, not an averaged score. A high total cannot hide a wrong benefit, missing condition, incompatible comparison, or unresolved source. Keep factual coverage and audit coverage as separate percentages.


## User feedback and current proposal

- Proposal 01: user liked the white/black direction and requested more imagery plus a third accent color to highlight and direct focus.
- Proposal 02: contextual product photography, matching detail imagery, and #0066cc on selected controls, key actions and source-backed main benefits. White/black remains dominant.
- User gate: PASSED for version 02 on explicit reply “ok ใช้เลย”.
- Data integration: 115 reviewed field changes, metadata/source corrections and Chubb event product;83 entries / 79 products / 891 cells. Exhaustive 95,284 comparison combinations pass runtime contract checks. Data completeness remains OPEN; see output/data-audit/README.md and current-matrix.csv.

- Final validation: 152 tests, TypeScript, lint (0 errors / 7 existing warnings), production build and local API checks pass. All 405 original + 13 appended gaps researched; 374 unknown / 4 conflicting cells remain explicit. Independent review matches all 115 applied facts.
- Proposal 02: independent score 91.5/100; desktop 1440×1000, mobile 390×844 and compact desktop 1280×720 checked. User subsequently approved this version.

## Approved rollout — 12 September 2026

User explicitly approved proposal 02: “ok ใช้เลย”. U7 PASSED. Root completed the approved Browse, Detail and Compare compositions and shared white/black/blue styling across all nine pages. Local production build and independent responsive/flow QA pass. API, memory, persona, consent, filters and canonical data contracts remain intact. Evidence: output/luxury-rollout-verification.md.
