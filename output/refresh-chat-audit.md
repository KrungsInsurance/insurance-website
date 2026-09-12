# Home → Chat onboarding verification

Checked12September2026, production127.0.0.1:8787, isolated Playwright session `refresh-chat`.

## Passed

- Actual Home “เริ่มค้นหาประกันเลย!” button opens the assistant question and seven native category buttons.
- Seven real mock API requests, one/category: all HTTP200 with mode=mock. Every request carried the newly clicked category, exactly one fresh onboarding message and no stale request history. This verifies transport/context for health, motor, life, accident, travel, property and liability; it does not score mock insurance accuracy.
- Actual Browse checkbox selected a health plan. Choosing motor in onboarding opened a Radix confirmation. Cancel retained health profile/one selected plan and restored focus to the motor button.
- Confirm sent motor with empty selected IDs. Keyboard focus remained inside the parent Chat dialog after the nested confirmation closed. Comparison history was not modified by this onboarding action.
- One genuine live request from the actual Home category choice: health, no selected plans, one user message, HTTP200, response mode=live,7,371ms browser-measured click-to-JSON latency. No upstream request was intercepted or replaced.

## Live answer review

The model explained annual/per-disease/per-admission limits, room/IPD/OPD, exclusions, waiting periods, deductible/copay, network, renewal and price types. It requested age, location, annual budget, desired coverage, hospital preference, medical history and cost-sharing preference. No invented product price/limit, guaranteed approval/claim, external route or recommendation of an unverified product appeared. Suggested IDs were empty, correctly avoiding a premature plan recommendation.

Factual grounding: **9/10 for this reply** (correct comparison dimensions, no unsupported numeric facts; no product-specific answer to substantiate). Context: **10/10 in the eight category transport cases**. UX: **7/10 for this live reply**, because it asks several questions in one paragraph; one-at-a-time questioning would be easier. These are bounded manual scores, not model-wide accuracy measurements. Any health-history information entered must remain fictional per the visible demo notice.

## Evidence and limits

- `refresh-chat-audit.json`: actual request categories, statuses, response text, latency and focus observation.
- `playwright/refresh-chat-live.png`: response visibly rendered in the Chat bubble. Initial exact-text visibility probe returned false because the rendered bubble includes a “Live AI” prefix; screenshot independently verified content. Probe corrected to match bubble containing response. No extra paid call repeated for this instrumentation issue.
- `playwright/chat-onboarding-check.js`, `chat-onboarding-live.js`, `chat-onboarding-focus.js`: reproducible bounded browser actions. ESLint passed all three plus ChatWidget.
- No claim that every new insurer answer was live-tested. No API keys read, no purchase or real lead sent. No application changes required by this browser pass.

Status: **DONE — onboarding interaction and live transport scope**.
