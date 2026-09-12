# Insurance Demo — QA checkpoint, 12 September 2026

Status: **IN PROGRESS, not final release approval**. Local build: http://127.0.0.1:8787.

## Review independence

Three audit agents were assigned UI, Chat/API and Broker. Initial independent UI/Chat reports are [ui-audit.md](ui-audit.md) and [chat-audit.md](chat-audit.md). Their findings led to implementation changes. Auditors initially hit a usage limit, then resumed for the follow-up recorded below. Initial checkpoint retests were performed by the implementing agent; latest independent checks are separately identified. Broker audit observed consent/name validation and a valid handoff; subsequent full call journeys were tested by the implementing agent.

## Metrics

Scores are reviewer rubrics, not user-study results, pixel-diff percentages or model benchmarks. Scale: 0 absent, 5 major gaps, 8 consistent with smaller gaps, 10 all stated criteria verified. Current owner scores are provisional and must not replace independent review.

| Dimension | Initial independent /10 | Checkpoint owner /10 | Evidence and limits |
|---|---:|---:|---|
| Apple visual language | 7 | 8 | Restrained white/gray/blue, photographic hero/cards, thin navigation, clear Thai hierarchy. Interior forms still dense; full contrast/text zoom audit pending. |
| Figma structural fidelity | 5 | 7 | Actual Slide52 inspected: centered heading, specialist action and three image selectors now implemented. Actual Slide51 inspected: 2-column photo cards with date corners now implemented. Chat overlay/composer shape retained. Generated imagery and accessible palette differ; no pixel match. |
| Simplicity | 7 | 8 | One Home CTA, separate Compare slots, compact policy disclosures and native mobile menu. Browse filters and Chat summary can still be simplified. |
| Avoiding generic AI visual patterns | 7 | 8 | No gradient/glow/fake testimonial or invented metrics on the site. Distinct exercise/family/health photos; car photo for motor. Travel/property/liability still use generic shields. |
| Chat robustness | provisional 5 | 7 | Strict request/output validation, byte limits, bounded real tools and stale-context guard. Negative/rolling API samples pass. Actual route tests inject timeout/refusal/malformed output/429/401/500 and bounded tool loops. Browser stale-response discard and manual resend exercised; full race matrix remains. |
| Chat factual grounding | provisional 5 | 6 | Real health sample correctly separates annual/per-disease/per-admission limits. Shared tool functions and source context present. Catalog still contains unresolved V2 provenance/subgroup/quote-price findings; no claim of full insurance accuracy. |
| Broker flow completeness | no final report | 8 | New lead, consent snapshot, accept/start/reload, follow-up, second call, both closing outcomes, history and Account sync exercised. Exhaustive double-click/state-race checks pending. |

## Objective check results

| Check | Result | Scope |
|---|---|---|
| Unit/domain regression | 34/34 PASS | Existing catalog/discovery/compare/state plus corrupt state, copied summary IDs and deterministic interest thresholds. Count-filling tests replaced: 26 supported catalog identities; fabricated property/liability variants removed. Passing tests do not establish every insurance fact. |
| Typecheck | PASS | `npx tsc --noEmit --incremental false` |
| Lint | 0 errors, 5 warnings | Warnings concern native img optimization. |
| Production build | PASS | `npm run build`; project process stopped first after Windows dist lock. |
| Local serving | HTTP 200 | Latest build via `npm run start`, loopback8787. |
| API negative + rolling cases | 16/16 PASS | [api-retest.json](api-retest.json): 8 invalid requests and 8 rolling mock rounds. |
| Live text/search/compare | Successful smoke | Genuine Responses requests; search ~4.43s and compare7.455s, single observations, not p50/p95. [Sanitized real response](live-smoke.json) returned HTTP200/live and shared tool URL. Compare response rendered in browser and linked shared Compare URL. |
| Client secret pattern scan | 0 matches | `sk-proj-` in 42 built client files; limited static check, not proof of all security properties. |
| Mobile Compare outer overflow | None observed | Viewport390, document375; two slots and third full-width. |
| My Insurance responsive | Observed | Mobile390: 1 column; desktop1280: 2 columns, document1265. Screenshots inspected in tool transcript. |
| Interest score | 0/50/70/100 PASS | Explicit events only; repeated interest does not add points. Shared function used for offer and lead. This score is a demo interaction signal, not an insurance suitability score. |

## Browser interaction evidence

- Browse: with two selected health plans, changing to motor opens confirmation. Cancel retains both checked plans and restores focus to category link. Confirm clears selection and opens motor category.
- Browse: selected three plans; fourth checkbox click retained three and showed an error naming the fourth plan. Compare navigation carried exactly those three IDs.
- Compare: changing category then cancelling preserved all three slots and restored focus to category select. Distinct plan images rendered after asset update. Invalid one-plan IDs now produce a controlled message (source change; direct browser negative retest pending).
- Account: reset cancel retained two QA leads and returned focus to reset button. Reset confirm navigated Home; returning to Account showed seed profile and zero leads. Only test fixtures were reset. Unrelated-key survival not separately injected.
- Mobile navigation: Enter opened the menu, Escape closed it and returned focus to summary; My Insurance menu link navigated correctly. No overlapping nav text in inspected screenshot.
- My Insurance: four policies; native details opened policy number, holder and start date. Payment date for life is separate from coverage expiry. Missing policy premium no longer substitutes catalog starting price.
- Earlier handoff/browser journeys: missing consent/name rejected; edited needs persisted; duplicate active request returned existing ID; new request created with plan facts/source snapshot.
- Earlier Broker journeys: accept → start → reload kept active timer; empty note kept save disabled. Follow-up saved, a second call started, interested closed with both records. A separate new lead used not_interested. Account reflected closed statuses.

These are bounded executed checks, not an inventory claiming every rendered control passed.

## Remaining release gates

1. Resolve all product/tier evidence and V2 typed price/coverage semantics, compatible subgroups, null/unknown comparison and quote-only sorting/filtering. The current catalog is not yet approved for all insurance facts.
2. Finish remaining Chat boundary/race matrix. Upstream injection, per-message provenance, stale-context discard/manual retry and separate compared/interested IDs are now implemented and tested in bounded cases.
3. Complete all-control inventory and 360/390/1440/1920 viewport matrix, 200% text zoom, keyboard/contrast checks. Only observed dimensions above count as evidence; an attempted viewport override did not consistently apply to the intended tab.
4. Complete two clean customer-to-broker journeys including reset after final changes, then independent re-score of the final build.
5. Replace remaining generic category artwork where needed; inspect all Figma overlay states. Figma works through logged-in browser; dedicated Figma MCP still requests reauthentication. Exact asset/pixel matching remains unverified.

## Assets and handoff

Built-in image generation produced project-owned illustrative photos (not official insurer artwork):

- `public/images/health-active.png`: Thai young adult exercising in a bright studio; neutral clothing, natural daylight, no text/branding.
- `public/images/family-advice.png`: Thai family discussing a blank paper with an adviser; calm bright consultation setting, no branding.
- `public/images/motor-car.png`: silver SUV outside a modern Thai home; natural morning light, no text/branding.

Existing generated hero and health consultation image remain. Prompts were submitted through the built-in image tool, originals retained, final assets copied into the workspace. Miro V2 status and plan-v2.md record this checkpoint as IN PROGRESS.

Latest presentation rebuild: Live compare re-smoked after asking for plain-text responses suitable for the chat panel. HTTP200, mode live, shared compare URL, 6.781s, no Markdown table. See [latest live smoke](live-smoke-latest.json). Build and browser Home reopened; demo profile reset to seed.

## Follow-up verification — 12 September 2026

- Independent Chat reviewer executed the real route failure-injection suite and production strict-input negatives. Genuine Live compare tool roundtrip returned HTTP200 in4.723s (one observation). Unknown quote premiums are now null consistently in catalog/UI/API/tools; numeric budget excludes them and both price orders place them last.
- Data correction: PA All In One S male35 is3855/medical45000/death300000 with motorcycle condition150000. One configurable Home product remains; invented property02–05/liability01–05 are unavailable, not remapped. Home price conflict is explicit; unconfirmed limits are null. Unsupported health/motor deductibles and zero entry ages are null. Life99 is age-based, not99-year duration. See research-v2.md follow-up.
- Shared comparison guard rejects compulsory/voluntary motor and inbound/outbound/domestic travel mixtures in domain, Compare API, mock and Live tool; selectors and additions use the same compatibility helper. Unknown rows remain visible under differences-only and state insufficient.
- Owner production browser: Browse30000.25 → Compare2health → summary displays30000.25 with compared2/interested0. Submit without interest/consent shows two field-linked errors; select only Essential and enter two needs → Lead contains budget30000.25 and only Essential as interest. Accept/start/end → closed, dated call history and duration visible, Account same closed status.
- Account negative budget rejected; decimal saved; cross-category cancel preserved health/focus; confirm+save cleared old selection and Compare showed empty motor slots.
- Fresh reset journey: genuine Live compare sent, contact window changed while waiting → old answer discarded with controlled error, original question retained for manual resend. No stale history appended; manual resend succeeded with a genuine Live comparison. Subsequent explicit mock response retained separate Live/mock labels in the transcript.
- Independent UI follow-up: Apple8/Figma structural7/simplicity8/anti-slop8. Actual viewport desktop2048×1081 and mobile390×844 verified (not requested viewport assumptions). Sampled Home controls>=44px, Browse/Compare no outer overflow; Compare keyboard scroll and mobile menu Enter/Escape/focus passed. Chat send42px finding fixed; final rebuilt browser measured44×44.39px at actual1280 width. These are sampled metrics, not pixel matching or exhaustive acceptance.
- Independent Broker journey passed12 bounded steps, including follow_up→second call→closed→Account. Date/duration history added; owner rechecked rendering. Restore rejects invalid timestamps and closed+active-call contradictions (regression tests).

Status remains IN PROGRESS: complete per-field source metadata/price kind/coverage conditions and every-control/viewport acceptance are not all verified.

Final local restart this follow-up: build PASS, HTTP200 after startup, lint0errors/5no-imgwarnings; 42 client files scanned with0 secret-pattern matches before final44px-only adjustment. Second reset journey completed: Live→mock→consent→new lead→accept→follow_up→second call→reload(timer0:15)→not_interested/closed→Account closed→reset. Home reopened with seed data. Miro V2 status synced; rendered status189px fits original216px area.

## Latest checkpoint — canonical data and regression

See [verification-latest.md](verification-latest.md) for current46-test/local-build evidence. It supersedes stale34-test/26-record metadata claims above. P3 customer state and P5 Broker are DONE from executed acceptance; overall release remains IN PROGRESS. Independent source inspection now covers25/25 records, with exact fields and limitations in data-audit-latest.md; this is not complete-policy verification. Current Live review is in live-eval-latest.md, including the initial CMI retrieval failure and its fix/retest.

Latest phase disposition: P0/P3/P5/P6 DONE; P1/P2/P4/P7 IN PROGRESS. Live CMI final retest10/10 for the bounded prompt (not generalaccuracy). Static contrast287checked/0remainingfailures,19photo-overlay exclusions. Independent visual scores remain8/7/8/8. See verification-latest.md for executed evidence and explicit remaining gates.

## Latest52-test checkpoint

Current evidence supersedes older46-test counts and8/7/8/8 scores: verification-latest.md, design-final-review.md, data-core-final.md, compare-control-final.md and chat-control-final.md. P0–P6 DONE; P7 final acceptance IN PROGRESS. Independent design scores Apple8/Figma8/simplicity7.5/anti-slop8; source review covers retained25products, not whole policies/market. Live latest Core HTTP200/9.688s with correct ICU/age/OPD distinctions; manual10/10 for this single prompt. Historical failures retained above.

## Final release disposition

P0–P7 DONE for the approved demo scope. Current53-test verification,96state+16delta captures,173KNOWNcell ledger,26safeexternal-source navigations and2freshcustomerBrokerresetjourneys are recorded in verification-latest.md. Independent metrics remain Apple8/Figma8/simplicity7.5/anti-slop8. Remote anti-bot pages, unknown data, emptyliability and approximateFigmaassets are disclosed limits, not claims of universal verification.
