# Verification — latest local build, 12 September 2026

V2 P0–P7 DONE for the approved demo scope. Local http://127.0.0.1:8787. This replaces the earlier46-test checkpoint; historical findings remain in quality-report.md and their independent reports. Synthetic customers only; no real calls, purchases or policies.

## Delivered

- Home/photo/nav/CTA, Compare selectors, My Insurance cards, dark Chat/white header+composer/pink close and compact Offer follow the inspected Figma structure with Apple tokens. Root visually rechecked latest Home/Chat. Exact assets/pixels are not claimed.
- Canonical25 retained products/330 cells:173known,134unknown,9not_covered,13not_applicable,1conflicting. Price, coverage basis, conditions and provenance are shared by UI/API/Compare/AI. Core fields expanded for health, motor, life, accident, travel and property. Liability remains an honest empty catalog; it is not a seventh populated product set.
- Compare restores0–3 selections from URLs independently of comparison history; rejects invalid groups/duplicates. Quote-only cards occupy a separate section when a numeric budget is active. Detail back preserves category.
- Chat trims complete oldest messages by both character and serialized UTF8 limits. Failed send retains input; no automatic retry. Latest answer has a separate polite live announcement. Threshold Offer waits until Chat closes, appears once, and dismiss restores launcher focus.
- Summary validation/consent/immutable snapshots and customer-to-Broker state machine work through accept, calls, follow_up and closed outcomes. No duplicate active lead/call on double clicks.

## Executed on latest build

| Check | Result |
|---|---|
| npm test |53/53 PASS |
| npx tsc --noEmit --incremental false |PASS |
| npm run lint |0errors;5 native-image optimization warnings after QA callback annotations |
| npm run build / npm run start |PASS; stopped only verified project Wrangler/workerd; restarted hidden; Home HTTP200 |
| Built client scan |43files,0matches for sk-proj-; bounded pattern scan |
| catalog-controls-check.js |25 Detail links clicked;303 evidence disclosures opened/closed, nonempty HTTPS links checked; all25 Interest→Summary→Cancel→back preserve category;0leads. External source links were not all clicked. |
| customer-broker-check.js |2 complete fresh journeys at1440/390: budget30000.25, Compare2, mock, invalid summary cases, consent/double-confirm,1lead, accept/start/reload, whitespace rejection, follow_up, second call, interested/not_interested, closed, Account, reset. Canonical snapshot/two-call history verified. |
| text-size-check.js |14 combinations:7pages×360/1440, text doubled,0outeroverflow. Inner category/table scrolling intentional. Text enlargement, not native browser zoom. |
| chat-layout-check.js |360/390/1440/1920: Tab/ShiftTab trap, Escape restores focus, doubled text, editable summary/budget cancel and focused confirmation fully visible;0outeroverflow. |
| contrast-check.js |415 text elements across7pages+Chat+Summary;0failures,min4.66:1;19photo-overlay elements excluded. Not WCAG certification. |
| Independent Compare |Query0/1/2/3, back/reload, invalid4/duplicate/mixed, cancellation, filters, quote-only and shared IDs pass; compare-control-final.md. |
| Independent Chat |8large Thai rounds allHTTP200; summary boundary/cancel/duplicate/snapshot controls pass. Final open-chat threshold Offer deferral/dismiss/manual retest PASS; chat-control-final.md. |
| Independent Core data |Scoped retained-product mapping PASS;330-cell invariant scan0errors plus primary checks. Coverage and source limits in data-core-final.md. |
| Genuine Live latest Core |1request/no retry, HTTP200/mode live,9.688s; correct ICU5000/24000, annual vs disease bases, entry/renewal ages, optional OPD and unknown limits. Shared Compare URL. live-core-final.json. |

Earlier unchanged-path evidence remains applicable: storage fault injection, scoped reset, manual429retry, live schema/error/tool-bound tests, all3 Broker outcomes, selected quote-only retrieval and real5-case evaluation. See storage-check.js, chat-retry-check.js, broker-audit.md and live-eval-latest.md.

## Independent metrics

Design reviewer: Apple8/10, Figma structure8/10, simplicity7.5/10, anti-slop8/10; judgments with screenshot/geometry evidence, not user-study or pixel-diff percentages. Fourteen independently measured route/viewport states had no overflow or sampled targets below44px. Full report: design-final-review.md.

Live five-case scores were10/9/10/5/10; the initial CMI5/10 failure is retained and separately fixed/retested10/10. Latest Core response manually scores10/10 for its bounded prompt. These samples do not establish general model accuracy. Broker V36–V39 independently passed4/4 acceptance groups plus two fresh end-to-end journeys.

Release closure: V01–V50 evidence is consolidated in control-acceptance-final.md and the final addenda below. Product-source uncertainty, approximate imagery and visual differences remain disclosed. Do not call every possible page state, every policy clause, or pixel fidelity verified.

Miro status item3458764683443768198 updated through logged-in browser after MCP token refresh failed; editable text readback shows52tests/P0–P6DONE/P7INPROGRESS. No new permission needed; no credentials exposed.

## Final regression after invalid-number and AXA conditions fixes

Current production:53/53tests,tsc/buildPASS,lint0errors/5native-image warnings,HTTP200;43clientfiles/0secret-patternmatches. Two customer→Broker→reset journeys repeated and passed after this rebuild.

- Account incomplete exponent1e reproduced badInput=true with erroneous saved feedback on the old build. Native validity guard now rejects it with adjacent error and saved=0. Blank still maps to null. final-boundaries.js is the executable browser regression.
- Home3CTA/footer links each clicked and activated with Enter;6checksPASS. Summary questions201chars or6lines rejected; both needs/questions exact5×200chars persisted. Historical snapshot fixture stays named QA archived plan in Broker while current Detail still renders AXA SmartCare Value; explicitly fixture-based, not a changed production catalog.
- AXA Value/Essential90day aggregation clauses now appear with exact clause6 locators. final-delta-layout.js checks Value/Essential/Compare/Account error at4viewports:16/16 screenshots and nooverflow;90day text asserted in rendered plans/Compare.
- Independent V45/V46 matrix:24state templates×4widths=96screenshots,96/96nooverflow,32/32dialog containment,1840Tab+96ShiftTab. Matrix predates the final two small fixes;16delta checks cover their affected states. See state-viewport-final.md, with actual metrics and fixture labels.
- Independent V48 ledger:173/173KNOWNcells reconciled against explicit expected primary evidence,94fresh-or-mixed and79inherited findings. Two missing90day conditions found, fixed and rechecked. This is all published KNOWN cells, not all policy wording or a quote verification. See known-cell-ledger.md.

Source-link navigation completed:26 distinct targets clicked;26 opener-null checks. External provider content remains separately constrained by anti-bot pages; see source-links-final.md.

## Release disposition

P7 DONE for the approved demo and tested state/control templates. V45/V46 supported by96state captures, actual keyboard trails,200%text checks and16post-fix delta captures. V47 supported by control ledger,25plan/303disclosure actions, all26distinct external link targets and final boundary checks. V48 uses the173KNOWNcell expected-value ledger plus explicit unknown/optional/conflict handling. V49 latest53tests/typecheck/lint/build,HTTP200,twofreshjourneys. V50 actual Figma structural review and Miro browser readback synced toP0–P7DONE. Local Home reopened with latest build.

The external-link gate concerns safe correct navigation:24 remote pages show access-block/challenge to the automated browser,2PDF destinations open, and one PDF redirects on its official domain. No challenge was bypassed. Do not describe those24remote document contents as browser-verified. Full source-content evidence is documented separately in the research/known-cell ledger. No pixel-perfect, full-WCAG, whole-market, current-quote or real-broker-service claim is made.
