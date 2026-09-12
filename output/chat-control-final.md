# P4 Chat controls — independent browser audit
Date: 2026-09-12 (Bangkok). Chromium Playwright CLI isolated sessions p4qa, p4offer/p4offer2/p4offer3. Local http://127.0.0.1:8787. Synthetic fixture only, no Live API requests, no shared browser reset, no product edits.

## Executed evidence
| Acceptance/subcase | Result | Actual evidence |
|---|---|---|
| V28 eight normal rounds | PASS | Eight short mock requests completed; history rolled to rounds 3–8. |
| V28 large Thai history (earlier build) | FAIL, fixed and retested | 1,900 Thai characters per message: rounds 9–13 HTTP200, rounds14–16 HTTP400 with 11 messages /11,960 JS characters. Client omitted UTF8 payload size. Sent root repro. Short retry recovered. |
| V28 large Thai history (latest build) | PASS | Eight consecutive 1,900-character Thai messages after existing large history: all HTTP200. Request byte counts 30,818;30,821;30,824;30,827;30,457;30,457;30,457;30,457. Messages12→10, all within32KB. |
| V32 edit/cancel | PASS | Changed name to QA P4 cancel + needs; Cancel removed summary (count0). Local lead count stayed0. Reopen retained editable draft. |
| V32 edited summary | PASS | Saved name QA P4 Immutable; needs two separate Thai lines; one question; contact morning. Stored summary retained exact arrays and editedByUser=true. |
| V33 missing name/consent | PASS | Whitespace name + unchecked consent produced adjacent กรุณา/กรอกชื่อสำหรับเดโม and ยืนยันความยินยอมก่อนส่ง errors; no lead. |
| V33 double confirmation | PASS | Actual Playwright dblclick created exactly one lead 26f0b6de-1ef0-4edc-9f0c-f35c5fa7cc58. Second physical click landed on success next-action after UI replacement and navigated Broker, with no duplicate lead. |
| V33 existing active request | PASS | Reopened manual handoff, checked consent, confirmed: visible มีคำขอที่รอดำเนินการอยู่แล้ว, one unchanged lead ID, Broker/Account next links. |
| V34 profile/selection/chat mutation | PASS for exercised inputs | After handoff changed Account name and budget30,000, added health02 to Compare, sent8large mock rounds. Full serialized lead (including planFacts/summary/transcript) byte-identical before/after each sequence. Catalog deployment mutation not injected. |
| V35 success/source | PASS | Stored status new; sourceMode mock; consentAt equals createdAt; two needs, question, morning, editedByUser true. Existing success provides status and Broker/Account links. |
| V31 closed-chat threshold/once/dismiss/manual | PASS | Fresh context: detail+interest60 then closed Chat; Account budgetsave raises80. Compact ปรึกษา Specialist CTA visible, dialog count0. Dismiss returns focus to Chat launcher. Repeated save+reload: offer0; manual summary opens (count1). |
| V31 crossing threshold while Chat open | Finding sent root | Fresh contexts:60 then budgetconfirm80 inside Chat sets offerSeen=true but never displays compact offer. Closing/reopening has none. Current code consumes offerSeen before checking !open. Could be intentional avoiding interrupt, but once-only offer should not be silently consumed if actual presentation required. |

## Scope and gaps
This is a targeted supplement, not a claim that all V27–V35 passed independently. V27 negative request inventory, V29 stale request/mode context, V30 full compare parity already have root/other-auditor evidence and were not duplicated here. Exact50/70/100 event-score unit boundaries not rerun; browser exercised60/80. Missing-interest rejection, max5/200 summary validation and catalog mutation still rely on separate evidence. Input-retention after old400 was observed in prior run but no compact recorded numeric value; do not treat this report as full failedretry assertion.

No remaining HTTP400 on latest valid large-Thai conversation. No changes to app files, build or local server by this auditor.

## Additional boundary execution
V33 missing interest: checked consent with no interested plan, confirm shows "เลือกแผนที่สนใจอย่างน้อย 1 แผน", lead count0. V32 needs six lines and a separate 201-Thai-character line each set aria-invalid=true on the actual textarea, lead count0. These are now independently exercised and replace the corresponding scope-gap sentence above. Questions-field equivalent and exact valid five-by200 boundary not separately tested.

## Final production retest — V31 deferred offer
2026-09-12 03:12 Bangkok, fresh isolated p4defer browser, no requests to Live.
PASS: detail+interest60, cancel summary, budgetconfirm while Chat open raises80. Actual UI summary0/compactoffer0 and stored offerSeen=false (not consumed). Close Chat: compact Specialist CTA count1, offerSeen=true. Dismiss returns focus to Chat launcher (true). Reload at same score: no repeated offer (count0). Reopen Chat + manual handoff opens summary (count1), leads0. This supersedes the earlier open-chat threshold finding; no residual V31 offer defect observed.
