# V45/V46 route-state matrix — independent execution

2026-09-12, approximately03:20–03:22 ICT. Current local production, isolated Chromium contexts, synthetic data only. No app edits/build/server restart. Parent subsequently scheduled the Account invalid-exponent/source-condition rebuild; layout evidence below predates that small rebuild and must not be presented as its execution.

**96/96 state/viewport captures completed;96/96 no outer horizontal overflow;32/32 dialog-state cases retained Tab focus inside the dialog.** Actual DOM widths/heights are360×844,390×844,1440×900,1920×1080. These were read from the page, not inferred from the requested viewport. No product failure reproduced by this harness.

## Matrix

Each PASS means: state rendered; screenshot saved; actual scrollWidth≤innerWidth; bounded Tab traversal and one Shift+Tab executed. `Trap` adds assertion that every recorded Tab stayed inside the active dialog. Non-dialog pages are not expected to trap focus. Native address-bar focus is not misclassified as a failure.

| State template |360×844|390×844|1440×900|1920×1080|Extra evidence|
|---|---|---|---|---|---|
|Home|PASS|PASS|PASS|PASS|Initial main/CTA/footer|
|Browse populated|PASS|PASS|PASS|PASS|Initial health filters/cards|
|Browse empty|PASS|PASS|PASS|PASS|No-match query|
|Detail populated|PASS|PASS|PASS|PASS|health01 full Core rows|
|Detail unknown|PASS|PASS|PASS|PASS|Controlled missing ID|
|Compare empty|PASS|PASS|PASS|PASS|Explicit0IDs|
|Compare invalid|PASS|PASS|PASS|PASS|Invalid category controlled alert|
|Compare filled|PASS|PASS|PASS|PASS|health01/02 canonical rows|
|Compare category dialog|PASS|PASS|PASS|PASS|Trap; actual category change→Cancel|
|Policies|PASS|PASS|PASS|PASS|4seed cards|
|Account initial|PASS|PASS|PASS|PASS|Form|
|Account reset dialog|PASS|PASS|PASS|PASS|Trap; actual open→Escape|
|Account category dialog|PASS|PASS|PASS|PASS|Trap; incompatible selection→Cancel|
|Chat summary|PASS|PASS|PASS|PASS|Trap; Detail Interest action|
|Chat summary error|PASS|PASS|PASS|PASS|Trap; submitted blank name/no consent|
|Chat success|PASS|PASS|PASS|PASS|Trap; actual synthetic consent/handoff|
|Chat budget confirmation|PASS|PASS|PASS|PASS|Trap; actual budget action→Cancel|
|Chat service error|PASS|PASS|PASS|PASS|Trap; injected429 response, visible alert|
|Offer|PASS|PASS|PASS|PASS|Explicit isolated score fixture, rendering only|
|Broker empty|PASS|PASS|PASS|PASS|Initial no leads|
|Broker unknown|PASS|PASS|PASS|PASS|Controlled invalid ID|
|Broker new|PASS|PASS|PASS|PASS|Actual Chat-created synthetic lead|
|Broker active|PASS|PASS|PASS|PASS|Actual Accept→Start|
|Broker closed|PASS|PASS|PASS|PASS|Actual note/outcome→Save|

## Keyboard evidence and interpretation

- **1,840 Tab presses plus96Shift+Tab presses** across the matrix. Traversal length per state was its candidate focusable-control count+2, capped100; no state exceeded cap. Each step records active tag/name, outline style and whether it belongs to a dialog.
- All32dialog instances passed containment throughout traversal. Compare/Account cancellations and reset Escape completed at all4widths. Chat Escape completed after error captures.
- Existing independent design-final-review.md verifies native menu Enter/Space, Chat Escape return-to-launcher; ui-audit-latest.md verifies Compare region arrow scrolling/focus and category/policy cancellation focus. Root’s Home mouse/Enter and200%text runs complement this matrix. This harness does not claim every control was activated using every keyboard key.
- A browser Tab moving through controls establishes reachability only for recorded controls. It does not certify screen-reader announcements or native mobile software-keyboard behavior. The JSON is retained so individual visits can be inspected instead of relying on aggregate counts.

## Artifacts and visual scope

- Reproducible CLI callback: `output/playwright/state-viewport-final.js`.
- Actual metrics/focus trail: `output/state-viewport-final.json`; raw CLI result: `output/state-viewport-raw.txt`.
- **96 screenshots:** `output/playwright/state-{360,390,1440,1920}-{state}.png` using the state names in JSON. Screenshots are full-page, so fixed Chat remains at viewport top while underlying document may extend beneath it in the image. That artifact is not an oversized on-screen dialog.
- Direct visual spot inspection in this pass:360Chat summary/error and1920Broker active. Both show readable hierarchy without a reproduced overlap defect. All96 images were captured, but this reviewer did not individually perform a visual pixel audit of every full-page image; geometric assertions are the complete96-case evidence. Prior design review supplies broader screenshot inspection.
- Offer uses a labelled score fixture;429uses a labelled intercepted response. Other lead new/active/closed states came from real UI actions in isolated contexts. No Live requests or real customer data used.

The first harness run timed out waiting for an error because interception omitted `?mode=mock`; the valid mock response was not an app error. Corrected route pattern and reran all4widths:exit0 with96results. These results supersede that harness-only failure.
