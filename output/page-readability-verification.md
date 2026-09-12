# Page readability verification — 12 September 2026

Scope: nine existing pages; one page per team, root owns Home/shared integration. Presentation only; no catalog fact, API, memory, fixture, call or recommendation logic changes in this refresh.

## Implemented
- Large Thai headings and dominant unit-bearing values, e.g. `13 ปี`, `30 วัน`, `2,500,000 บาท`. Missing values stop at `ยังไม่ได้ระบุ`.
- Product sections cover all fields exactly once for all 13 insurance categories.
- Concise product value mappings preserve the original text in expandable details. Starting/example prices, coverage basis and optional coverage remain distinct.
- Repeated per-field sources moved to consolidated disclosures; repeated source URLs deduplicated. Full eligibility, exclusions and price conditions remain reachable.
- Thai navigation labels; prominent policy dates and account/Broker counts; concise discovery and chat controls. Full conversation content preserved.

## Browser evidence
Local production at http://127.0.0.1:8787, CUA.

| Page | Desktop | Mobile 390px / behavior |
| --- | --- | --- |
| Home | Hero/section/promo hierarchy inspected | No page overflow; 18% with “ลดสูงสุด”; promotion conditions open; CTA enters `/chat?start=1` |
| Browse | Health and event quote-only cards inspected; refinement next/back works | Life category no page overflow; 13 categories retained |
| Plan detail | health-01, pet-02, event-01; health ages 13/60/99 years, waiting 30 days; one source URL in health disclosure | health-01 screenshot and 390/390 width; conditions toggle works |
| Compare | Team QA health/life/pet at 1280px; large values | 390/390 page; 348px table scroll container; pinned label130px + each data column218px, verified for2and3plans; keyboard ArrowRight moves40px; one consolidated source/condition disclosure opens |
| Chat/discovery | 1440px chat heading 32px; full/compact floating window opens, resizes, closes; three-plan comparison | 390/390; step2 repeated category click reveals all13; topic selection and step3 cards; YourData decline works; no journey completed or messages sent in this UI QA |
| My Insurance | Four cards, large dates and status distinctions | 390/390; 30px dates; policy details open; missing premium plain; cross-category help dialog opens and cancels |
| Account | 56px heading, 1440/1440 | 390/390; negative budget rejected; reset dialog opens and cancels without reset |
| Broker list | 1440/1440 screenshot, readable needs/status metrics | 390/390; empty search and clear work; contacting filter shows2cases; 6fixtures plus existing live lead retained |
| Broker detail | Team desktop QA: transcript, evidence, chat/call tabs, question fills draft without sending | 390/390; table container356/content768; pinned name150px + each column206px; lastcolumn fits fully at offset412. Trigger/question now concise bullets; draft action still inserts original109-character question and focuses composer; reload confirmed empty draft |

No active call was ended. No external customer messages were sent. No profile reset was performed. User conversation/history remained available; actual message wording was not shortened by the UI.

## Automated checks
- `npm test`: 148/148 pass. Includes new checks for concise values retaining units/bases/facts, and all-category field grouping completeness.
- `npx tsc --noEmit`: pass.
- `npm run lint`: 0 errors, 7 existing `<img>` warnings.
- `npm run build`: pass; local production restarted after build.
- Final Broker trigger revision rechecked on desktop/mobile; original decision/draft wording remains in disclosure/action.
- `git diff --check`: pass.
- Final responsive fix keeps every data column fully visible alongside pinned labels on mobile; no clipped beginning of the last column.
- Final production server is running at http://127.0.0.1:8787. Temporary viewport override reset.

Miro sync pending: no callable Miro tool in this session. No navigation/flow contract changes in this visual refresh.
