# UI control matrix — independent bounded audit, 12 September 2026

Browser: fresh Chrome CUA tab on current local production. DOM measurements are actual dimensions, not requested settings. Only executed actions are marked interaction PASS. Layout PASS does not imply controls passed. No leads or messages created/reset; Account budget temporarily tested and restored to blank.

## Actual viewport coverage

| Page |360×844|390×844|1440×900|1920×1080|Visible target exceptions|
|---|---|---|---|---|---|
|Home|PASS layout|PASS layout|PASS layout|PASS layout|None sampled|
|Browse|PASS layout|PASS layout|PASS layout|PASS layout|Back link110.5×19.2px FAIL|
|Detail health-01|PASS layout|PASS layout|PASS layout|PASS layout|Source link117.8×13.6px FAIL|
|Compare health-01/02|PASS layout|PASS layout|PASS layout|PASS layout|None sampled|
|My Insurance|PASS layout|PASS layout|PASS layout|PASS layout|None sampled|
|Account|PASS layout|PASS layout|PASS layout|PASS layout|None sampled|
|Broker dashboard|PASS layout|PASS layout|PASS layout|PASS layout|None sampled|

All28 measured page-size combinations had document scrollWidth12px smaller than innerWidth (scrollbar); no page-level horizontal overflow. Target scan includes visible a/button/select/summary bounds, excludes hidden0px controls. This is not a complete checkbox-label geometry or contrast audit. Both link findings were sent to implementing agent; measurements predate any resulting rebuild.

## Executed control evidence

|Page/control|Status|Observed action/result|
|---|---|---|
|Home primary CTA|PASS|Clicked; Browse rendered. Prior final audit screenshot records photographic Home.|
|Navigation My Insurance|PASS|Clicked from Broker; policy grid rendered.|
|Navigation Account/Home|PASS|Clicked; corresponding headings/rendered forms shown.|
|Browse search|PASS|Entered zzzz-no-such-plan and submitted;0 results and empty-state heading rendered.|
|Browse empty-state clear|PASS|Clicked clear filters;5 health plans returned.|
|Browse name sort|PASS|Selected name order; URL sort=name, Essential precedes Value, packages L/M/S.|
|Browse Compare link|PASS|Clicked; health-01,health-02 URL and table rendered.|
|Browse budget/selection/category confirm|NOT RUN this round|Separate root/customer-flow evidence required.|
|Detail back to plans|PASS|Clicked from motor detail; Browse rendered.|
|Detail interest/add-compare|NOT RUN this round|Covered by implementation regression work, not claimed here.|
|My Insurance disclosure|PARTIAL|Clicked first disclosure; follow-up selector targeted wrong element, so open content was not independently confirmed.|
|My Insurance detail link|PASS|Clicked first card detail; motor-01 rendered.|
|Compare differences toggle|PASS|Checked; checked=true and9 rows (company row omitted).|
|Compare category cancel|PASS|Selected motor, dialog shown; Cancel kept health and focus returned compare-category.|
|Compare keyboard scroll|PASS earlier current-build round|Named tabindex0 region, ArrowRight moved scrollLeft and blue focus outline. See ui-audit-latest.md.|
|Compare one-plan URL|PASS incomplete-state rendering|Direct one-plan URL showed one slot and instruction to select2–3; no comparison table. Navigation is state coverage, not a button test.|
|Account negative budget|PASS|Saved-1; nearby alert says budget must be0 or higher.|
|Account decimal persistence|PASS|Saved15680.5; reloaded field remains15680.5. Restored blank and saved afterward.|
|Account category cancel|PASS|Selected motor with health comparison; Cancel preserved health; after close animation focus returned account-category.|
|Account reset cancel|PASS|Opened reset dialog and Cancel; returned Account without reset. Confirm deliberately not executed.|
|Broker empty state|PASS rendering only|Zero counts and no-request text rendered. No broker interactions claimed.|
|Mobile menu Enter/Escape|PASS earlier current-build round|Opened/closed; focus returned summary with blue outline.|
|Chat open/close|PASS earlier current-build round|Focus moved to Close then back to launcher; full mobile dialog. No send executed.|
|Chat Send target|FAIL in preceding measurement|42×44px, reported to root. Needs post-fix remeasurement.|

## Unverified gates

-200% text-only zoom: BLOCKED by available browser control path. Attempted browser keyboard zoom commands did not change measured DPR/viewport; cannot label200% passed. No text-only zoom emulation was substituted.
- Full contrast compliance: NOT RUN. Screenshots/readability do not establish WCAG ratios.
- Figma live independent recheck: NOT RUN in this bounded round. Prior reference structure only; retain structural fidelity7/10, no pixel-match score.
- Whole-page screenshots at every one of28 combinations: NOT RUN. Matrix is measured DOM overflow/targets; actual screenshots independently inspected in previous UI rounds.
- All controls across all categories/broker states: NOT COMPLETE. Use this matrix with Chat/Broker/domain reports, not as full release approval.

No source or server edits performed by this audit round. Temporary viewport override reset after measurements.

## Newer production regression supplement

PASS after rebuild: Browse back44px height; Detail source44px height; Chat Send44×44px. Earlier target FAIL rows are resolved for sampled controls.
PASS executed: Chat quick-budget Cancel and Confirm (Account20000 verified, restored blank); policy help health same-category opens prefilled Chat; motor cross-category Cancel returns help-button focus; Confirm opens motor policy prefill with Close focus. No send/reset.
PASS executed: Detail known-field evidence disclosure shows insurer/table locator/check date. ISSUE: unknown-field disclosure opens empty. ISSUE visual: MyInsurance two inline text actions lack separating gap.
Remaining NOT RUN/BLOCKED gates above are unchanged; do not convert them to PASS from this supplement.

Final rebuild supplement: unknown source disclosures removed (health-02 observed); known source disclosure clicked and complete; policy actions separated into44px rows with loaded image screenshot; Compare price-base incompatibility label corrected and rendered. These3 bounded checks PASS. Figma fresh-tab inspection blocked by another active session claim; no fresh independent pixel score.
