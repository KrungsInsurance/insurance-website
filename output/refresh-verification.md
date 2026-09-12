# UX refresh verification — 12 September 2026

Status: UI/interaction refresh DONE; researched catalog expansion DONE. Whole-market completeness remains IN PROGRESS and is not claimed. This is a new user-authorized refresh, separate from historical V2 P0–P7 completion.

Implemented: Home → Chat category choices; eight beginner explanations and three dated official promotions with original remote artwork; Apple Mac-inspired Browse category rail/insurer tabs/catalog cards; separate Compare Browse/Chat actions and insurer-grouped accessible product picker; simpler Figma-based My Insurance photo/date cards with disclosures. My Account source remains unchanged.

Research: `research-home-content.md`, `research-expansion-life-health.md`, `research-expansion-nonlife.md`. Market-wide completeness is not established. Source conflicts and quote-dependent limits remain explicit; campaign rewards are not subtracted from canonical premiums. Newly introduced identifiers do not reuse retired fabricated plans.

Executed on local production:

- Root Browse run: insurer AXA search → two plans; negative budget inline error; decimal budget10000.25 → one plan; two checked plans → Compare table; Compare Chat opens in place and separate Browse action navigates; quote-only plans separated from budget results; all four policy disclosures open and close with details/help actions present. Script: `output/playwright/refresh-browse-check.js`; screenshots: `output/refresh-catalog-cards.png`, `output/refresh-policies-desktop.png`.
- Independent Chat: seven actual mock requests preserve chosen category; cross-category cancel preserves selection/focus, confirm clears incompatible selection. One genuine Live health request HTTP200,7.371s, visible answer verified. See `output/refresh-chat-audit.md`.
- Independent UI: four pages at1440px and390px, no outer overflow; three remote official promotion images loaded. Home11disclosures keyboard-tested, Compare picker insurer groups/arrow/Enter/Escape/focus tested. One defect: campaign summaries23.39px. CSS fix to44px pending production remeasurement. See `output/refresh-ui-audit.md`.
- Unit/domain baseline53tests passed before final data/display additions; final checks below supersede it.

The earlier pending checks are resolved by the final production checks below. Historical53test evidence is superseded.


## Final production checks

-40sourced records across12insurers,538coverage cells:297known/206unknown/14not-covered/19not-applicable/2conflicts. Four per-category fields added from research: combined property sum, property flood limit, voluntary-motor medical limit, PA admission lump sum. Evidence includes FWD46-page policy and ThaiLife visual benefit table; see research-expansion-health-followup.md.
-55/55tests PASS; TypeScript PASS; lint0errors/7native-image warnings; production build PASS. Final code snapshot built after all catalog authors stopped changes. Logs: refresh-tests.txt, refresh-lint.txt, refresh-build.txt.
-Actual Compare API and rendered tables agree for7categorycases (8–21rows). Invalid mixed travel400; source-backed FWD/ThaiLife zero deductibles retain different bases and are not falsely equal. All15new detail routes render with HTTPS source links; this checks link presence/protocol, not universal third-party reachability. Logs: refresh-final-cli.txt, refresh-details-cli.txt.
-Browse maximum3: rejected fourth checkbox shows error inside that card; cancel/confirm category behavior passes. Existing search/decimal/quote-only checks pass.
-Two complete new-property journeys at1440px and390px: Compare→actual mock→edited summary/consent→newLead→Broker accept→two calls with reload→follow_up→interested/not_interested→closed→Account observation→demo reset. Immutable plan facts remain valid. No real customer data or external broker notification. Log: refresh-broker-cli.txt.
-Latest genuine Live onboarding HTTP200,7000ms, visible:true; now responds briefly and asks exactly one age question. Suggested health-01 is a catalog identity, with starting-price qualification. This replaces the earlier multi-question UX observation; not a general model-accuracy score. Log: refresh-live-final.txt. Earlier seven mock-category transport/focus tests remain applicable; only wording changed afterward.
-Independent final Home1440/390 remeasurement: all3promotion summaries44px, keyboard open/close passes; learning headings21px/600; no outer overflow; all9healthcatalog images load after scroll. Official campaign images3/3 loaded. See refresh-ui-audit.md and refresh-final-raw.txt.
-My Account file SHA256 unchanged:80964F735428A37E73EE84844322FF6C557717E8202A4596922D3B20403E7EF4.28built client JavaScript files scanned;0secret-pattern matches. This scan does not claim absence of every possible secret pattern.

## Remaining limits

No exhaustive all-insurer/all-promotion census is claimed. OIC company selectors returned no registry entries; official quote-dependent and unpublished terms cannot be filled without insurer confirmation.206unknown cells and2conflicts are explicit, not zero-filled. Official campaign artwork is real; existing catalog category photographs remain illustrative and repeat across related plans. Reviewer scores remain Apple8/Draft structure8/simplicity8/anti-slop7, with no pixel-perfect or universal correctness claim. UI scope is available locally for review.

Miro status and customer flow synchronized through browser and read back after reload; compact status reflowed to avoid overlap. Local homepage HTTP200 after final checks. Preview requested in Codex browser.
