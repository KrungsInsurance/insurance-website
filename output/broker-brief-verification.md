# Broker quick brief — verification

12 September 2026 — DONE locally. Production: http://127.0.0.1:8787/broker

- Lead detail: needs, concerns, existing cover, original-period budget, customer quote and main question appear once in the opening brief. Missing phone/LINE/email is stated explicitly; only the existing contact window is known.
- Broker sees three suggested conversation steps and up to three review candidates. Explicit interest/comparison comes first; additional candidates require sourced coverage facts on topics present in customer quotes. Budget is optional and quote-only plans remain available. Optional, unknown and excluded cover remain visible. No suitability guarantee or purchase score.
- Candidate retrieval is deterministic over the existing structured extraction/catalog (no new ML, no new API request). This is a Broker-only aid. Live ChatGPT extraction still uses the existing server pipeline; offline demo remains labeled. Topic coverage is intentionally limited; unsupported/negated topics and insufficient context produce no invented match. Existing selected plans can still be inspected.
- Saved plan facts take precedence; additional current-catalog candidates are labeled separately. Historical consent snapshots are unchanged. Transcript, full extraction/differences, saved plan detail and care history use native collapsed disclosures. Customer chat widget is hidden on Broker routes.
- Existing demo call state is preserved. Only the available next action is shown. No real contact or call was made.

Checks executed:

- npm test: 84 passed (two new tests for shortlist evidence, saved facts, optional/unknown coverage, negation, no-context state and quote-only eligibility for review).
- npx tsc --noEmit: passed.
- npm run lint: zero errors; seven pre-existing image warnings.
- npm run build and npm run start: passed; restarted local production after the final build to refresh Wrangler asset mappings.
- Browser at 1440×1000 and 390×844: brief, next steps, three candidate cards, source disclosures and original budget visible; no horizontal overflow (390px viewport and scroll width). Fixed narrow mobile cards found in first pass.
- Search by concern, no-results and clear-filter actions verified. Opened plan evidence links in disclosure; existing call form disables save until a note is entered. Cleared temporary test note without saving or ending the pre-existing demo call. Reload retained lead information. Customer AI launcher absent from Broker after final build.

Not measured: actual Broker completion time (1–2 minutes is the design goal, not a user-study result). Actual Live API evaluation remains pending configured credentials. Miro SYNC PENDING: no callable Miro tool. Your Data was researched only; see your-data-research.md. No service was connected or deployed remotely.
