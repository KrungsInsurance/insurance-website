# Independent Chat/API audit

Audit: 12 September 2026, local production `http://127.0.0.1:8787`. Read-only product evaluation; no product code changed. Inspected `app/api/chat/route.ts`, Compare API/domain, ChatWidget, DemoProvider and summary/state functions against plan-v2 §7/9, V27–V35 and V40–V44. No secret files read or credentials included. Ponytail full applied to review.

## Executed evidence

Node fetch requests against running production, using synthetic content only:

| Check | Observed | Result |
|---|---|---|
| system role / developer role | Both 400 INVALID_INPUT | PASS |
| budget `"abc"` / -1 | Both 400 | PASS |
| duplicate / unknown selected IDs | Both 400 | PASS |
| 2,001-character message / 13 messages | Both 400 | PASS |
| category `bogus` | 200 mock category prompt | FAIL: unknown category silently accepted |
| UTF-8 body: six 1,900-character Thai messages | 34,470 bytes accepted with 200 | FAIL: exceeds 32,768-byte contract |
| empty-string budget | 200, treated as no budget | FAIL against null-or-finite-number V2 contract |
| array body | 400 | PASS (incidental selected-ID guard) |
| rolling mock window over eight rounds | 8/8 HTTP 200, including rounds 7 and 8 | PASS API window simulation; not browser retry evidence |
| mock compare health-01/health-02 | Chat URL and IDs exactly match Compare API | PASS shared domain routing |
| Compare unknown cells | null/null OPD and waiting period classified `different:false` | FAIL semantic V2: unknown is not verified same |
| mock expert request | 200 offerHandoff true, summary draft returned | PASS API handoff offer only |
| genuine live information request | 200 live, generated Thai answer correctly separated Value 2.5m/year, Essential 10m/disease and S/M/L per-admission | PASS narrow real-response smoke |
| live compare request | 200 live, fixed local reply and comparison URL | NOT a model/tool roundtrip: source has early deterministic return |
| client credential pattern scan | 26 files in dist/client; secret-like sk-proj pattern absent | PASS limited static scan, not exhaustive secret proof |

One genuine upstream request was triggered; the second live-mode request used the local compare shortcut. No load test, quota test, timeout injection, upstream malformed-output injection, or browser handoff completion was performed by this auditor.

## Source-inspection failures

1. Live adapter defines no `search_plans` or `compare_plans` tools and handles no function-call rounds. Tool integration acceptance remains unmet despite successful basic live text.
2. Live input omits profile budget, goals and selected IDs as explicit trusted context. Catalog is only first five category records and omits source, premium note/scenario and provenance. This can make an affordable-plan request ignore budget or treat starting prices as exact.
3. Runtime output validation checks message string, then silently filters/truncates IDs and coerces handoff boolean. It does not reject unknown IDs, duplicate IDs, unexpected nested values, extra fields or arbitrary URL text as required. JSON schema requests summaryDraft always null while prompt describes an object; client also ignores returned summaryDraft.
4. Body limit is applied after JSON parsing using JavaScript character count, rather than raw UTF-8 bytes. Entire oversized body is parsed first.
5. Client sends current context at request start but has no context-version guard when response arrives. A late result can overwrite suggestions after category/selection changes through other UI.
6. Score is computed only at lead submit with unconditional interest +50. The visible code does not call markOfferSeen or implement the deterministic >=70 one-time offer. Model offerHandoff can open the summary directly and repeatedly.
7. Summary has basic category/budget/selected names, editable needs/questions, explicit consent and success links. Compared and interested IDs both derive selection; no separate compared-history semantics. sourceMode is last response mode or mock rather than a per-transcript provenance record. Deep copies of summary, transcript and plan facts are implemented. These are inspected, not browser-proven.
8. safeLoad only validates shallow arrays/profile presence. Corrupt nested messages/lead/profile can reach Chat without schema validation. No verified corrupt-storage recovery in this audit.
9. Source reads key only server-side via process.env and does not accept client key/model/system role. Request timeout 20s and controlled 429/502/504 branches exist. Their injected failure behavior was not tested.

## Scores (provisional, evidence-limited)

Each dimension totals five two-point criteria: 0 absent/fails, 1 partial or inspected-only, 2 verified. Scores are acceptance coverage, not an AI benchmark or satisfaction survey.

| Dimension | Criteria with awarded points | Score |
|---|---|---|
| Groundedness | live sample factual 2; source/scenario context 0; shared comparison 2; unknown semantics 0; no guaranteed outcome prompt 1 | 5/10 |
| Robustness | roles/types 2; raw-byte cap 0; bounded rolling history 2; strict output validation 0; controlled upstream errors inspected 1 | 5/10 |
| Context | category context 1; budget/goals live 0; selected plans live 0; rolling messages 2; stale-response prevention 0 | 3/10 |
| Handoff | API offer 2; consent/validation inspected 1; snapshots inspected 1; success/duplicate handling inspected 1; score/once-only offer 0 | 5/10 |

Release assessment: genuine live text is operational, but V2 live tool contract and robustness are incomplete. Do not mark Chat/live fully DONE based on the live-mode label or this single successful answer. Browser handoff and Broker journey should be combined with the separate interaction audit before final acceptance.
