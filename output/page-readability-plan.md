# Page readability refresh — 12 September 2026

Latest user override: redesign the copy/hierarchy of every existing page. One page per team. Large clear headings and prominent answers/numbers; compact values (e.g. 13 ปี). Unknown values end at ยังไม่ได้ระบุ. Remove repeated per-field source links. Retain underlying catalog evidence and source/condition access in one quiet disclosure per page/section. Do not alter coverage facts or strip meaningful units, optional cover or starting/example price labels.

| Team/page | Change | Acceptance |
| --- | --- | --- |
| Product detail /plans/[id] | Group fields by insurance purpose; large standalone values; short labels; one conditions/source area | health-01 plus specialist products; unknown no appended prose; 13 categories supported |
| Browse /browse | Clear category/result headings; concise card benefits/limits; price prominent; shorter refinement copy | All 13 categories accessible; quote-only and filters intact |
| Comparison /compare | Short row labels, dominant values, concise reasons; remove per-cell sources and repeated explanation | Units/bases remain clear; optional/unknown distinct; mobile table only scrolls |
| Home / | Short primary headings and card copy, clear next action | Existing navigation/promotions work; no text crowding |
| Chat /chat and discovery | Clear headings, quieter controls/cards, brief values and disclosures | Preserve real API, full memory, persona, consent and comparisons |
| My Insurance /my-insurance | Large key policy values/dates, brief labels | Renewal/status/help actions remain |
| Account /account | Brief profile/status labels and clear hierarchy | Saved state and request navigation intact |
| Broker list /broker | Large customer/status hierarchy, concise previews | Search/filter/customer cases intact |
| Broker detail /broker/leads/[id] | Clear need/concern/next action; concise candidate table; quieter evidence and chat | Original transcript, source facts, Live simulated customer, calls preserved |

Shared integration owner: root; shared presentation helpers/styles, build/local server and final responsive QA. Implement in batches of three page teams. Teams review their own pages in the production browser after integration; root checks mobile and cross-page consistency and sends revisions if needed. No extra API/model/catalog rewrite. No new dependencies.

Validation: semantic labels/focus, no horizontal page overflow at 390px, Thai glyphs unclipped, readable numbers, 44px actions, no source-link repetition, condition detail reachable, tests/typecheck/lint/build and local browser flows. Status: IN PROGRESS. Miro sync pending (no callable tool).
