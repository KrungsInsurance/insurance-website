# Home / Compare / Chat refinement — 12 September 2026

Three page teams worked in parallel. Root integrated their artifacts into the local app at http://127.0.0.1:8787 . User explicitly authorized these changes; no additional approval is pending.

## Home

Centered black search CTA: 68px desktop / 64px mobile, retaining /chat?start=1. Replaced the computer image with a generated family/architecture photograph. Image provenance: page-refinement/home-image-provenance.md. Responsive crop and headline contrast visually reviewed.

## Compare

The checkbox previously removed only verified equality, leaving many unknown rows looking unchanged. Difference mode now shows confirmed differences and differing comparison bases, with a count; unresolved-only rows remain accessible in a collapsed section. Unknown is never treated as equal. A confirmed pairwise difference still appears when a third plan is unknown. Identical headline values with different conditions have a concise note and disclosure.

Actual motor01/02 browser case: 16 rows → 2 differing rows, 12 pending, 2 same hidden; switching off restores 16. Three-plan health case retains 2,500 / 12,000 / unknown and exposes differing waiting conditions.

## Chat

Removed user-visible model/provider labels, background extraction overview, persona/profile summary and redundant header/footer text. Existing conversation and backend memory remain. A deliberate Broker handoff still asks the customer to review and consent.

New canonical intake card has 2 fields per category, at most 3 for motor, across all 13 categories. ChatGPT selects only necessary missing fields from the category's field bank. Form answers become ordinary labeled user messages, using the existing conversation and extraction pipeline; completed template fields are deterministically excluded, scoped by category. Natural-language prior answers are interpreted from the full history. No occupation request, budget gate or extra health questionnaire. Partial answers allowed. Stored and Broker historical card validation supports intake.

## Submission defect found and corrected

Real browser submission exposed a model reply inventing the intake key `class` after all three motor fields were filled, causing a 502 validation error. The upstream strict response schema now enumerates only remaining category inputs; when none remain, intake must be null. A targeted regression locks this boundary. The exact same browser request then returned HTTP 200, stored the labeled user answer and live reply, showed no additional question/form and survived reload (6/6 checks). No silent fallback or validation bypass.

## Evidence

- 160 tests passed; TypeScript and production build passed; lint 0 errors / 8 image warnings; diff whitespace check passed.
- Independent browser review: 52/52 checks at 390×844 and 1280×720, no page errors. Home CTA/image, keyboard Compare toggle/pending disclosure, unknown semantics, concise motor/health/event forms, partial entry, reload and no page overflow.
- Actual ChatGPT API: five scenarios rechecked on the final schema, plus the exact browser submission and the health-discovery case checked during integration, all passed. Fresh motor 3 fields; prior SUV/2007 only model; OPD/IPD concise direct definition; event 2 fields; fully submitted motor no repeated fields; health discovery 2 fields.
- User's original browser conversation was inspected without sending, clearing or changing its content. Browser form fixtures are isolated from user state.

Machine evidence and screenshots: page-refinement/results.json, live-results.json, health-live.json and page screenshots in page-refinement/. API integration references: https://developers.openai.com/api/docs/guides/structured-outputs . Existing model/credentials unchanged; no credential exposure in artifacts. No public deployment. Miro flow/status sync remains pending (no callable tool).
