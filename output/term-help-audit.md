# Term help browser audit — 12 September 2026

Isolated Playwright CLI session `termqa`, local production http://127.0.0.1:8787. No live AI requests, state resets, or customer records used.

| Case | Actual result |
|---|---|
| Detail health-06 Copay hover | PASS: tooltip contains definition and conditional renewal caution |
| Click tooltip trigger to pin | PASS: named dialog visible; hover tooltip count0; official OIC source URL |
| Escape from pinned help | DEFECT FOUND: dialog closed and trigger focus restored, but Tooltip immediately reopened (count1) |
| Compare health-06/08 deductible | PASS: correct definition; trigger44×44; popup340px; close control worked |
| Compare motor-06/07 third-party | PASS: correct distinct person/event/property caution |
| Detail accident-06 at390×844 | PASS: popup x34 y450 w340 h255.375, within viewport; trigger44×44; no page overflow |
| Detail travel-07 at390×844 | PASS: popup x16 y450 w340 h255.375, within viewport; no page overflow |
| Actual mobile touch context (hasTouch, maxTouchPoints1) | PASS: PA help opens via tap, closes via tap; screenshot `output/term-touch-pa.png` |
| Mapping integrity after review | PASS:38 terms,85 mappings; every current categoryFields key maps to an existing term |
| Lint | New glossary/component0errors; Compare/Detail existing3img warnings only |
| Typecheck | Passed after concurrent API changes settled, before final mapping/ref polish |

Escape defect fixed in source: suppress tooltip reopen on return focus until a fresh pointer/focus interaction. Radix still owns focus movement and dismissal. Final production rebuild/retest of this fix is pending; do not count it as passed yet. Detail price help aligned alongside its price block after visual screenshot review.

## Final production retest after fix

PASS on rebuilt8787:
- Compare health-06/08 Copay: Escape yields0 dialogs/0 tooltips and focus on originating trigger. Tab then Shift+Tab opens tooltip normally; Enter pins; explicit Close again yields0 tooltips and focus restored.
- Chat in explicit mock mode, motor-01 plan card, Deductible help: Escape closes only help; Chat remains open (one dialog), originating trigger focused,0 tooltips. No Live API call.
- Final actual touch context390×844: PA and travel popup bounds remain within viewport; tap Close returns focus with0 dialogs/0 tooltips, no horizontal page overflow.

Mapping coverage final:38 terms,85 field mappings; no current category field missing. No remaining defect found in this bounded TermHelp acceptance. Broker card transcript audit is a separate issue handed to root; not counted in this component acceptance.
