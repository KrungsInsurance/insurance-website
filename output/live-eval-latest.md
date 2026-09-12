# Live evaluation — 12 September 2026 (Bangkok)

Actual local POST /api/chat: 5 attempts, no retries, concurrency <=2. All returned HTTP200 and mode=live. This is 5 successful requests, not a general accuracy rate. Route inspection confirms the live branch calls OpenAI Responses; the health response also returned the shared Compare result. Provider request IDs and other tool traces are not exposed, so upstream logs were not independently observed.

Scores manually assess accuracy (4), material conditions (4), calibrated uncertainty (2). Prompts and full non-secret responses are in live-eval-latest.json.

| Case | Latency | Score | Assessment |
|---|---:|---:|---|
| Value vs Essential |9.403s|10/10|Correct annual/admission/disease bases; optional OPD; unknown deductibles. No suitability claim.|
| EV deductible |8.369s|9/10|Correct ordinary0 plus6000 unlisted-driver rule, date, seat limit and named-driver range. Minor: says6000 per claim whereas announcement only explicitly describes the accident-triggered excess.|
| Annual travel |6.318s|10/10|Preserves unknown selected tier,90/180days; refuses unconditional150day claim.|
| CMI current price |4.879s|5/10|No fabricated price or guaranteed600budget, but fails to surface the known price conflict and expired linked promotion.|
| Standalone liability |3.772s|10/10|Correctly reports empty catalog and invents no products.|

CMI finding: model appears to have applied budget600 to search_plans, losing selected motor05 because its canonical price is unknown. A selected-product question needs the selected product facts even when it cannot match a numeric budget. Response says numbers may reflect differing conditions/time; the catalog already has concrete581.01/645.21 conflict and linked promo ending15January2026. Reported to root; this evaluation did not edit the app.

Primary checks: [Value](https://www.axa.co.th/th/personal/health-insurance/value-plan), [Essential](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan), [EV notice and table](https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev), [travel FAQ](https://www.axa.co.th/th/personal/travel-insurance/outbound), [CMI table](https://www.axa.co.th/th/personal/car-insurance/compulsory), [expired linked promotion](https://www.axa.co.th/th/promotion/axacar-promotion). Liability assessment concerns this catalog, not the entire insurance market.

No browser interaction tests, customer data, environment-file reads, app edits or server restarts in this evaluation. Five single-turn cases cannot establish adversarial robustness, broad factual accuracy or complete insurance-policy understanding.

## CMI retest after selectedOutsideFilter fix

One additional genuine local Live request with the exact original prompt; no retry. HTTP200, mode=live,7.606s. First result above is preserved.

Manual score8/10: retrieval fix verified—the reply now identifies motor05, both581.01/645.21 figures, conflict and quote-only status. It correctly explains that581.01 fits600 while645.21 does not. Remaining answer-quality gaps: no mention of the expired15January2026 linked promotion, and the Thai wording “งบ600บาทยังถือว่าไม่พอแน่นอน” can mean definitely insufficient rather than cannot confirm sufficient, despite the following conditional explanation. This is improvement, not a full factual-completeness pass. No more requests run.

## CMI retest2 after uncertainty/expired-promotion prompt fix

One request using the unchanged prompt; HTTP200,mode=live,6.675s,no retries. Manual10/10 for this case: correct581.01vs645.21 source conflict, private<=7seat scope, quote-only, explicit expiry15January2026, and clear inability to confirm600budget suffices. It does not assert either price is current. Correct motor05 suggested and handoff offered without claiming lead creation. Earlier findings and retest remain unchanged above. This single passing reply is not a general accuracy guarantee.
