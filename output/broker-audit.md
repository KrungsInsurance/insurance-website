# Independent customer → Broker QA

Checked 2026-09-12 (Asia/Bangkok), isolated Playwright CLI browser `brokerqa`, local production http://127.0.0.1:8787. No user browser storage modified. No live AI requests made.

## Real-browser journey

Task completion: **12/12 observed journey steps passed**. This is a bounded journey metric, not full V2 acceptance.

1. Home CTA → Browse.
2. Browse detail link → AXA SmartCare Value.
3. สนใจแผนนี้ → summary dialog, without sending a chat message.
4. Unchecked consent rejected with visible alert.
5. Blank display name rejected with visible alert.
6. Edited name, need and question + explicit consent → visible success and a single lead.
7. Success Broker link → valid lead with exact saved name/needs/questions.
8. Accept → contacting; start unavailable before accept.
9. Start → one active call; repeated start unavailable; blank-note save disabled.
10. Reload during call → persisted active call and elapsed timer continued (0:15).
11. Save note + follow_up → follow_up; second start → new call; note + not_interested → closed; two notes retained; closed start disabled.
12. Account navigation → same closed status, one lead, updated timestamp and working lead link.

Lead ID in isolated QA context: `85c510a8-b908-4310-a0fd-2f8ef8700ea2`.
Evidence: `.playwright-cli/page-2026-09-11T17-39-54-193Z.yml` success, `17-40-28-352Z.yml` first active call, `17-40-59-525Z.yml` follow_up, `17-41-29-119Z.yml` closed. Interactive snapshots also recorded on CLI output; account showed one closed lead.

## Current versus older build

Earlier journey showed raw health category and omitted contact window / snapshot facts. These findings are **resolved on current deployed build**, independently rechecked 2026-09-11T19:03:37Z: Thai สุขภาพ, สะดวกช่วงเย็น, plan price 6,700 บาท/ปี · เบี้ยเริ่มต้น, source link, closed state and both saved notes remain present. Evidence `.playwright-cli/page-2026-09-11T19-03-37-134Z.yml` (and next explicit snapshot).

## Fix delivered for root build

Current deployed history lacked start/end date and final duration. Updated only `app/broker/leads/[id]/page.tsx` to show native `<time>` dates in Asia/Bangkok, duration derived from endedAt minus startedAt, and full wrapped notes. Invalid/reversed timestamps display unknown instead of NaN or fabricated zero; active timer also guards invalid/future start.

Validation: targeted ESLint PASS; `npx tsc --noEmit --incremental false` PASS. **New history rendering still requires root's build and browser verification; not marked browser-passed.** No server restart performed by QA agent.

## Residual checks / risks

- `safeLoad` accepted a constructed closed lead with an active call and invalid timestamp strings. Read-only Node probe returned `invalidClosedActiveCallAccepted: true`. This is malformed local-storage recovery, not demonstrated normal-user state corruption. Root informed; needs central schema validation, not another UI guard.
- Normal UI duplicate-start/end guards behaved correctly. Same-tick/programmatic duplicate submissions were not exercised; provider replaces lead snapshots and does not validate transitions centrally.
- Unknown lead route, cancel-and-reopen consent reset, active duplicate handoff, interested outcome, and storage quota failures were not included in this bounded browser journey.
- This review does not score Figma fidelity, financial data accuracy, or live AI quality.

## Final Broker acceptance retest — 2026-09-12 02:21–02:25 ICT

Latest deployed build, isolated `brokerqa` browser; no resets and no live calls. Synthetic fixtures created through actual Detail → Summary → consent UI:
- `QA Broker V36 0221`, lead `a174f187-48e1-431a-865b-e0b77ac63db4`
- `QA Broker V37 decline`, lead `b0a8f3eb-04e3-4d24-a1ee-ffd8e6949447`

| Acceptance | Actual result | Status |
|---|---|---|
| V36 new → accept → start → reload | Start disabled before accept. Actual Playwright dblclick start produced one active history item. Reload retained same start time 02:22:07 and timer continued to 0:17. | PASS |
| V37 three outcomes + blank/whitespace notes | Empty and literal three-space note kept save disabled. follow_up saved first call, interested closed second call, separate not_interested fixture closed correctly. All histories show matching notes, native start/end times and final durations 27s / 16s / 13s. | PASS |
| V38 follow_up second call + actual double clicks | Used supported Playwright `.dblclick()` for both starts and all three end actions. One call after first start; exactly two after second. First ended once with follow_up; second ended once with interested. No overlapping / duplicate history. | PASS |
| V39 closed / unknown / navigation | Closed accept/start disabled, note/outcome editing absent. Clicked detail → Dashboard → same lead → Account → same lead. Dashboard and Account show matching closed status. Direct unknown `qa-unknown-v39` shows controlled not-found and clicking recovery returns Dashboard. | PASS |

Acceptance completion **4/4 (100%)** for V36–V39 tested cases. This replaces historical uncertainty about duplicate clicks and new call-history rendering, not a claim about unrelated V2 criteria.

Evidence files in `.playwright-cli/`: `page-2026-09-11T19-22-08-370Z.yml` double start; `19-22-18-984Z.yml` reload; `19-22-35-966Z.yml` double end/follow_up; `19-22-51-112Z.yml` second double start; `19-23-07-231Z.yml` interested/closed; `19-23-21-727Z.yml` persisted 2-call history; `19-23-29-819Z.yml` Account; `19-23-41-781Z.yml` unknown; `19-23-49-605Z.yml` recovery; `19-25-10-483Z.yml` not_interested/closed. Explicit post-navigation snapshots were also inspected in CLI output.

## Historical chat-card end-to-end retest — 12 September 2026

Fresh isolated Playwright `brokerfinal`, production8787. Chose explicit mock mode before sending. Requested motor-01 and motor-02 detail cards; expressed interest only in motor-01; entered synthetic name QA Broker Snapshot Final; checked consent and created lead be8bb58e-4a8f-4e5a-a5da-f55f505f65ae through UI.

PASS after opening Broker and reloading:
- Summary interested plan is only AXA SmartDrive ชั้น1 (motor-01).
- Stored-plan section includes both motor-01 and unselected motor-02 EV/PHEV.
- Two historical card disclosures remain and open.
- motor-01 third-party property displays5,000,000บาทต่อเหตุ with its saved source locator.
- motor-02 ordinary deductible0 retains the unlisted-driver6,000 excess conditions rather than claiming universal zero.
- First card has12 saved source links; historical disclosures contain0 buttons/inputs/selects/textareas. No interest/compare actions in Broker transcript.
- No missing-snapshot fallback in this fresh request. Legacy-missing and retired-ID behavior is covered by state unit tests15/15, not falsely claimed as browser tested.

Initial test locator expected motor02 to be2+ and used an exact generic interest-button name; actual UI correctly exposed EV/PHEV and plan-qualified accessible names. Corrected locators, no product defect. No source edits or rebuild required after this retest. No Live AI call, real customer data or external submission.
