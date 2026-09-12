# Broker product refresh audit

Date: 2026-09-12. Target: production http://127.0.0.1:8787.
Browser: isolated Playwright CLI sessions brokerfinal and brokerempty. User IAB/local data untouched. No live AI requests, source edits, or server restart.

## Executed acceptance

| Check | Result | Actual evidence |
|---|---|---|
| Empty dashboard | PASS | Fresh brokerempty: four counts 0, result 0/0, “ยังไม่มีคำขอให้ดูแล”; “ดูแผนประกัน” opened /browse. |
| New customer request | PASS | Direct /plans/health-06 → สนใจแผนนี้ → synthetic name QA Broker Refresh Decline → checked consent → confirmed → actual Broker link. Lead 3718e645-8f00-4b01-9463-0962acad49e9. |
| Populated counters | PASS | Existing isolated synthetic consent fixture QA Broker Snapshot Final initially new=1/open=1; after close, closed=1 and other counts=0. Lead be8bb58e-4a8f-4e5a-a5da-f55f505f65ae. |
| Name/category/plan search | PASS | QA Broker, รถยนต์, AXA SmartDrive each returned 1/1; unmatched query returned 0/1 with appropriate empty state. |
| Status and reset | PASS | Closed filter excluded new fixture; metric button toggled aria-pressed; clear restored empty query/all statuses. |
| Accept and duplicate start | PASS | Accepted new request; double-click start created exactly one active call. |
| Active call persistence | PASS | Reload kept contacting status, active form and disabled start; second call timer reached 0:01 and remained 0:01 after reload. |
| Blank note validation | PASS | Whitespace-only note kept save disabled. |
| Follow-up outcome | PASS | Saved note + follow_up produced ติดตามผล; normal save focus returned to call-title; history showed note/start/end/duration. |
| Second call/interested | PASS | Restarted follow-up; interested outcome closed lead. Double-click save committed once, total exactly two calls. |
| Not interested | PASS | Fresh consent fixture accepted/started; not_interested outcome closed with correct note and history after reload. |
| Closed read-only | PASS | Start disabled and note form absent after reload. |
| Navigation/recovery | PASS | Dashboard and customer-home nav links worked; invalid lead displayed ไม่พบคำขอ; recovery returned /broker. |
| Responsive layout | PASS | Dashboard/detail at 1440 desktop and 390 mobile had no document horizontal overflow. |
| Visual review | PASS | Inspected dashboard desktop/mobile; restrained white/gray surfaces, clear hierarchy, readable Thai, status/count grouping, native filtering and snapshot content. Parent independently inspected detail mobile. No claim of exact Figma Broker match: reference has no Broker frame. |

Result: 15/15 bounded checks passed. This is not a claim of exhaustive accessibility or all possible data-state coverage.

Normal single-click save restores heading focus. For double-click save, the second browser pointer event can move focus after the form unmounts; state still commits exactly once. Parent reviewed and accepted this behavior; no timing workaround added.

## Screenshots

- output/broker-refresh-desktop.png — dashboard, 1440 desktop.
- output/broker-refresh-mobile.png — dashboard, 390 mobile; animation disabled for stable capture.
- output/broker-detail-refresh-desktop.png — detail full page.
- output/broker-detail-refresh-mobile.png — detail full page.
- output/broker-detail-refresh-mobile-viewport.png — detail 390 viewport.

No blocking defect found in this refreshed Broker scope.
