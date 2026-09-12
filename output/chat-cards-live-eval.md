# Genuine Live tool-card evaluation

Production `http://127.0.0.1:8787/api/chat`, six genuine requests, no mocked transport, no retries. All response modes were `live`, HTTP200. No API key/environment file was read. Full sanitized request-result evidence: `chat-cards-live-eval.json` and scenario script `chat-cards-live-eval.mjs`.

| Case | Time | Result | Manual assessment |
|---|---:|---|---|
| motor-01 third-party property limit detail |9,760ms|FAIL|Asked specifically for property liability field. Returned general plans card with empty fieldKeys and prose claiming the card could not yet be shown. This is contradictory and does not deliver the requested field. No invented amount, but relevance insufficient.|
| motor-01/02 comparison |5,503ms|PASS|Comparison card IDs/category and canonical Compare URL correct. Prose correctly says quote-only prices and some limits depend on car/sum. No unsupported ranking.|
| health Copay definition |5,580ms|PASS|Allowlisted copay term card; prose describes proportional eligible expense contribution and30% as an example, not universal requirement.|
| category onboarding |4,290ms|PASS|Category question card, null category, seven categories in question; no automatic choice.|
| health budget |4,335ms|PASS|Budget question card linked to health, asks annual budget. No profile mutation claimed.|
| specialist handoff |4,356ms|PASS with UX caveat|Handoff card for selected health-01; offerHandoff true; no lead created. Also returned an unnecessary generic plans card via legacy suggested-ID fallback. Wording implies button provides consent, whereas actual UI must review summary then explicit consent.|

Mean latency5,637ms, range4,290–9,760ms. All messages<500characters. These six successes at HTTP level are not a general accuracy score. Functional card intent passed5/6; strict detail-field relevance did not pass.

The server, not the model, supplied card descriptors validated against catalog. Manual review saw no fabricated numeric plan fact. UI rendering/click behavior was not exercised by this API-only evaluation; root/browser team owns that gate. Tool-call arguments are not exposed in API result, so the hypothesized invalid field name behind the first failure is **not directly observed evidence**.

Suggested root fix for failed detail: expose actual category field keys/labels to model and return valid keys in controlled tool-argument errors; avoid silently masking failure with generic detail fallback. Re-evaluate that one case after a concrete fix, rather than repeatedly running all cases.
