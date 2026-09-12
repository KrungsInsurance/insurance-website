# Insurance Website — Version 2 implementation plan

Version: 2.1 implementation · 12 กันยายน 2026 · **ผู้ใช้อนุญาต P0–P7, เปิด Live และแก้ UI/Broker พร้อม QA**

## 0. อ่านก่อนเริ่ม

เดิมเป็นแผน audit-only; คำสั่งผู้ใช้ภายหลังอนุญาตให้ทำต่อทุก phase จน P7 และแก้ Frontend ให้ตาม Figma, Live Chat, Broker และตั้งทีมตรวจสอบ. สถานะด้านล่างบันทึกจากหลักฐานจริง ไม่ถือว่า DONE เพียงเพราะมีโค้ด.

อ่าน AGENTS.md → Rule.md → เอกสารนี้ §0–4 → phaseที่กำลังทำ → contract/testที่phaseอ้าง. อ่าน [audit-v2.md](audit-v2.md) เฉพาะfindingที่แก้; [research-v2.md](research-v2.md) เฉพาะหมวด/แหล่งที่ใช้. อ่าน DESIGN.md/tokenและ Figma frameเฉพาะหน้า. ใช้ Ponytail full; reuse/native/stdlib/installed primitives ก่อนdependencyใหม่. ไม่สร้างmoduleเผื่ออนาคต

สถานะปัจจุบัน: **V2 P0–P7 DONE สำหรับขอบเขตเดโม; Live VERIFIED**. Tests53ข้อผ่านบน build ล่าสุด พร้อม Core catalog25records/330cells และทีมตรวจอิสระ. หลักฐานปัจจุบันอยู่ใน output/verification-latest.md; บันทึกเก่าด้านล่างเป็นประวัติ ไม่ใช่สถานะล่าสุด. ไม่อ้างpixel-perfect, ใบเสนอราคาปัจจุบัน หรือการรับรองทุกเงื่อนไขกรมธรรม์. Liabilityยังเป็นemptycatalogตามหลักฐาน.

## 1. เป้าหมายและขอบเขต

ทำ customer→broker flowเดิมให้ต่อเนื่องด้วยข้อมูลผลิตภัณฑ์จริงที่มีหลักฐาน และแสดงความต่างเฉพาะหมวดโดยไม่เทียบผิดหน่วย. เว็บไทยสำหรับGen Z; โครงFigma + Apple tokensเดิม; mockchat/default, customer/policy/callเป็นข้อมูลตัวอย่างในbrowserเดียว. ไม่มีซื้อ/ออกกรมธรรม์/โทร/จ่ายเงิน/ข้อมูลลูกค้าจริง

Routesคงเดิม: `/`, `/browse`, `/plans/[id]`, `/compare`, `/my-insurance`, `/account`, `/broker`, `/broker/leads/[id]`, `/api/compare`, `/api/chat`. ไม่มีauth/CRM/database/backendใหม่. เก็บstackปัจจุบัน Vinext/React/TypeScript/Worker; แก้routerที่rootcauseก่อนพิจารณาย้ายstack

### V2 changes ที่เสนอให้ใช้เมื่ออนุมัติ

| v1 | V2 proposal | เหตุผล |
|---|---|---|
| 7×5 recordsและofficial URLถือว่าครบ | 7หมวด; จำนวนตามผลิตภัณฑ์/tierที่พิสูจน์ได้; มีunknown/emptyที่ซื่อสัตย์ | property/liabilityถูกตั้งชื่อซ้ำเพื่อเติมจำนวน |
| premiumTHB=0หมายถึงquote; periodyear/trip | typed priceที่แยกquote/starting/example/fixedและsinglepremium | UI/API/AIไม่เห็นว่าฟรี; life/travelperiodถูก |
| CoverageValue primitive+unitเดียวต่อrow | cellมีstatus/value/unit/basis/conditions/source | ต่อโรค/ปี/ครั้งและoptionalไม่เท่ากัน |
| raw different boolean | semantic same/different/not_comparable/insufficient | null/nullหรือgenericcopyไม่ใช่เหมือนกัน |
| same categoryอย่างเดียว | category+compatible subgroup; ห้ามrankข้ามฐาน | พ.ร.บ.กับชั้น1; inboundกับoutbound; homeกับprofessional |
| T03 expected Essential10m/ปี | expectedที่ผูกเอกสารและtier; perDisease10m ไม่ใช่annual | testเดิมล็อกข้อมูลผิด |
| จำนวนเต็มบาท | จำนวนบาทfiniteไม่เกิน2ตำแหน่ง; ไม่ปัดเบี้ย34301.50เงียบ | รักษาราคาต้นทาง |

นี่เป็นข้อเสนอเปลี่ยนcontractอย่างเจาะจง มิใช่อนุญาตเปลี่ยนroute/featureอื่น. syncข้อเสนอในMiro V2แยกจากv1; ก่อนimplementationอ่านversionให้ตรงกัน

## 2. ลำดับการแก้และผลส่งมอบ

| Phase | Depends | งาน/ไฟล์หลักที่ต้องตรวจและแก้เมื่ออนุมัติ | Acceptance | Status |
|---|---|---|---|---|
| V2-P0 Runtime | — | `vite.config.ts`, framework scripts/configตามrootcause; Link callers; `app/broker/leads/[id]/page.tsx`; `components/demo-provider.tsx` สำหรับhydration | V01–V04 | DONE — native links, Promise params, post-mount restore; Home→Browse and My Insurance→Detail browser checks; build/local evidence below. V03 valid lead deferred to clean handoff retest |
| V2-P1 Data contract + verified catalog | P0 | `lib/types.ts`, `lib/catalog.ts`, `lib/validators.ts`, `lib/display.ts`, tests/domain; provenanceอยู่ใกล้data ไม่สร้างCMS | V05–V13; research§3–5 | DONE —25 retained records/330 canonical cells; category Core fields, locators/bases, independent scoped review; unknown preserved, liability empty. output/data-core-final.md |
| V2-P2 Compare + selection | P1 | `lib/compare.ts`, `app/api/compare/route.ts`, Browse/Detail/Compare, provider; tests/compare+discovery | V14–V21 | DONE —0–3 URL selection/back/reload, invalid/duplicate/subgroup, quote-only separate section, filters, shared IDs independently tested. output/compare-control-final.md |
| V2-P3 Customer state + policies | P2 | `lib/demo-state.ts`, `lib/demo-seed.ts`, provider, Account/MyInsurance; tests/state | V22–V26 | DONE — V22–V26 validated state, storage fault injection, scoped reset+notice, policy help+focus, Account/Broker status; output/verification-latest.md |
| V2-P4 Chat mock + summary + consent | P3 | `components/chat-widget.tsx`, `app/api/chat/route.ts`, sharedsummary/leadlogicที่ใช้จริง | V27–V35 | DONE —UTF8 rolling history8long Thai rounds, controlled errors/retry, editable summary/validation/consent/duplicate/immutable snapshot, deferred Offer once and focus retested. output/chat-control-final.md |
| V2-P5 Broker simulation | P4 | Broker list/detail, provider+typesเท่าที่จำเป็น; sharedleadfunctions | V36–V39 | DONE — V36–V39 independent4/4 plus two fresh desktop/mobile customer journeys; duplicate clicks, all outcomes, reload timer/history and Account sync |
| V2-P6 Live adapter | P5 | Chat route/adapter, validators, server environment and UI errors/mode | V40–V44 | DONE — real5-case Live evaluation, failure/schema injections, selected quote-only retrieval regression and CMI retest; output/live-eval-latest.md |
| V2-P7 Full regression + local presentation | P5 + P6 disposition | everyroute+control; Figma/Apple/GenZ; existingtests; README/evidence | V45–V50 | DONE —96state/viewport captures+16affected-state rechecks, keyboard/control ledger,173known-cell reconciliation,26distinct source-link navigations,53tests/build,2fresh customer→Broker→reset journeys. Local opened; Miro synced. Explicit external-content/visual/data limitations retained in output/verification-latest.md |

P0แก้ที่จุดร่วมโดยtracecallerก่อน; ไม่เปลี่ยนLinkเป็นทางลัดทั่วเว็บโดยไม่อธิบายrootcause. P1ใช้healthคู่เดียวทำครบsource→type→displayก่อนrollout7หมวด. P2ใช้samefunctionในUI/API/AI. P4ให้mockflowจบจริงก่อนP6. P7ต้องdeploylocalที่buildล่าสุดและเปิดให้ผู้ใช้ตรวจเมื่อได้รับคำสั่งimplementation

## 3. Flow ที่ต้องทำงาน

2026-09-12 — DONE locally — Parallel Home / Compare / Chat refinement. Centered larger black CTA and generated family image; explicit differences with pending-data disclosure; customer chat removes internal/profile copy and uses canonical grouped intake for 13 categories (normally 2 fields, motor at most 3), retaining existing memory and Broker history. 160 tests, TypeScript/build pass, lint 0 errors / 8 image warnings. Independent browser QA 52/52 at 390/1280; actual API and real browser submit/reload passed, including SUV/year recall and no repeated completed fields. Fixed upstream schema to allow only remaining intake keys, or null when completed. Local production 8787. Evidence: output/page-refinement-verification.md. Miro SYNC PENDING (tool unavailable).

2026-09-12 — DONE locally — User approved proposal 02 (“ok ใช้เลย”). Applied the image-led white/black/blue design to Browse, Detail and Compare, with shared styling across all nine pages. 152 tests, TypeScript and production build pass; lint 0 errors / 8 image warnings. Independent 390px/1280px responsive and interaction QA passed with all blockers closed; root reviewed desktop shared pages. Local production: 127.0.0.1:8787. Evidence: output/luxury-rollout-verification.md. Canonical data/API contracts unchanged. Remaining source-data gaps remain explicit. Miro SYNC PENDING (tool unavailable).

2026-09-12 — IN PROGRESS — Two-team data completeness and monochrome luxury design proposal, with independent evaluation. All-cell evidence ledger and exhaustive comparison matrix; no guessed missing facts. Separate responsive design prototype for explicit user approval before main-page rollout. Contract/gates: output/data-design-review-plan.md. User liked the monochrome direction and requested more imagery plus a stronger blue focus accent. Proposal 02 at output/luxury-design-proposal/index.html passed independent visual review 91.5/100; user approval PASSED; main rollout completed (see latest entry). Public-source research round complete: 405 original + 13 appended gaps researched; 115 independently reviewed changes integrated. 83 entries / 79 products / 891 cells; 374 unknown and 4 conflicting remain explicit, so factual-completeness gate remains OPEN. All 95,284 combinations and 152 tests pass; TypeScript/lint/build/local API verified. Current matrix at output/data-audit/current-matrix.csv. Miro SYNC PENDING.

2026-09-12 — DONE — All9pages readability refresh, one page per team. Large Thai headings/standalone values; plain unknown states; all13category detail groups; consolidated condition/source disclosures; concise Broker decision/question bullets with original draft text. Desktop and390px browser QA passed, including final mobile table columns beside pinned labels. npm test148/148, typecheck/build pass; lint0errors/7existing img warnings; git diff --check pass. Local production running8787. Evidence: output/page-readability-verification.md; assignments: output/page-readability-plan.md. Canonical facts, realAPI/memory and active calls preserved. Miro SYNC PENDING (tool unavailable).

2026-09-12 — DONE locally — Two-team live chat + catalog expansion: runtime user/Broker replies use real OpenAI GPT-5.4; no mock selector/query bypass/fallback. Full stored conversation plus persona (200-message boundary), latest corrections, retained card-action context and exact prior-plan comparison verified. Catalog now 82 entries / 78 products / 18 insurer names / 13 categories; 42 new sourced product overviews, same-purpose comparison guards, all categories visible. 146 tests/typecheck/build passed; lint 0 errors/7 existing image warnings. Local8787 real HTTP smoke8/8 (up to28 inputmessages) and user/Broker desktop/mobile browser checks passed. Broker customer and Your Data remain explicitly simulated. Evidence: output/live-chat-catalog-verification.md; sources: output/catalog-expansion-research.md. Miro SYNC PENDING.

2026-09-12 — DONE locally — Latest user override delivered by five separate teams: optional gender + simulated Your Data Accept/Decline + avatar dissolve; direct category toggle and concise step 2; brief answer-first chat with grounded discovery/name recall; seven-category Browse quote context and editable chat draft; short customer-grounded comparison reasons above factual features with expandable conditions/sources. 129 tests/typecheck/build passed, lint 0 errors/7 existing image warnings, local 8787 production desktop/mobile verification complete. Your Data is UI-only; real Live API not exercised. Evidence: output/discovery-refresh-verification.md; official Browse references: output/heygoody-research.md. Miro SYNC PENDING.

2026-09-12 — DONE locally — Character layout and optional annual budget: first step now uses an equal-column layout, large age-responsive avatar left and nickname/age/budget selects right; stacks on mobile. Six annual budget choices: unknown, <10k, 10k–19,999, 20k–29,999, 30k–50k, >50k THB. Stored as optional budgetBand, preserving old personas. Chat and Broker overview retain the range quote without treating an endpoint as an exact budget or excluding quote-only plans. 104 tests/typecheck/lint passed (7 existing image warnings); production build and desktop/mobile browser checks passed. Miro SYNC PENDING (no callable tool). Evidence: output/avatar-layout-verification.md.

### Persona discovery — latest override

2026-09-12 — DONE locally — Persona discovery flow (latest user override): nickname + 5 illustrated age bands → category + 1–3 relevant topics → browse / automatic comparison / questions first. Topic-based retrieval may prepare up to 3 compatible catalog plans without a budget gate; property/liability show their actual 2 available plans. Ask mode starts without product cards and stays informational unless the customer requests plans. Completed persona persists; starting discovery resets only current chat/selection/overview, preserving existing Broker cases. Assets, Scope and Dev teams integrated through lib/discovery-persona.ts and /images/personas/age-{id}.png. 102 tests/typecheck/build passed; lint 0 errors/7 existing warnings. Local production and all 3 paths verified at desktop/mobile; final chat page width390 with scrolling confined to comparison region. Miro SYNC PENDING: no callable Miro tool. See output/persona-flow-verification.md.

### Unified Broker conversation — latest override

2026-09-12 — DONE locally — Unified Broker conversation: original customer/AI transcript and subsequent Broker/customer messages now share one chronological chat log. Removed the duplicate transcript disclosure. Reuses customer chat bubble/composer styles; preserves sender labels and saved historical cards without replacing snapshot facts. Enter sends, Shift+Enter adds a line, and a latest-message control supports long histories. Desktop/mobile checks verified sending, reload persistence, source-card expansion and no page overflow at 390px. 88 tests, typecheck and build passed; lint 0 errors/7 existing warnings. Miro SYNC PENDING (no callable Miro tool). Evidence: output/broker-unified-chat-verification.md.

### Broker table + simulated customer chat — latest override

2026-09-12 — Broker decision table + customer chat (latest user request): candidates now use a full-width table with source/chat evidence, conditional decision triggers and per-plan follow-up questions. Questions are editable drafts, never auto-sent. Added six labeled customer fixtures, merged by stable ID without overwriting existing leads or blocking customer handoff. Broker-to-customer chat is explicitly local simulation with authored case replies, separate per-lead history, call/chat switch and follow-up/close notes. Structured handoff snapshots stay unchanged by simulated chat. Mobile table has a pinned plan column and keyboard/button scrolling. 88 tests passed; typecheck/lint/build passed (7 existing image warnings). Miro SYNC PENDING: no callable Miro tool. Validation: output/broker-table-chat-verification.md.


### Broker quick brief — latest override (2026-09-12)

2026-09-12 — Broker quick brief (latest user override): Broker-facing candidate suggestions are allowed for review; customer-facing AI remains descriptive. The lead page now opens with needs, concerns, current coverage, original-period budget and a verbatim chat quote, beside a three-step conversation guide and missing-contact notice. Up to three candidates use explicit interest/comparison first, then sourced coverage fields tied to chat topics; no purchase score, no budget gate, no assumed eligibility. Quote-only, optional cover and unknown fields stay explicit. Full extraction/differences, saved plan facts, transcript and call history are collapsed. See output/broker-brief-verification.md. Miro SYNC PENDING (no callable Miro tool in this session).


### Current override — ChatGPT-assisted Broker pipeline (2026-09-12)

คำสั่งล่าสุดแทนบทบาท recommendation/interest scoring เดิม: **Extract → Retrieve & Structure → Difference Highlighting → หยุด → Broker แนะนำ**. Live ต้อง extract structured fields พร้อม customer quote ก่อน retrieval. ไม่มี priority/weight/rank. งบไม่บังคับ; ราคา quote-only ยังแสดง. Retrieval ใช้ catalog ที่ normalize และผูกแหล่งไว้แล้ว ไม่เพิ่ม ML หรือ ingest PDF ใหม่ต่อบทสนทนา. Compare รักษาหน่วย/ฐาน/unknown และคืนประโยคเชิงพรรณนาให้ ChatGPT ใช้เป็นหลักฐาน. Customer-selected interest และ consent แยกจาก AI mentions. Broker ได้ immutable overview ครบ Need / Current Coverage / Budget / Plans of Interest / Key Differences / Main Question พร้อมข้อมูลแผนและต้นทาง. ไม่มี activity-score calculation หรือ score UI; legacy field อ่านย้อนหลังได้.

สถานะ: IMPLEMENTED + MOCK/CONTRACT VERIFIED — 82 tests, typecheck/build ผ่าน, lint 0 errors/7 existing image warnings; local production browser customer→Broker→reload และ mobile390 ผ่าน. LIVE MODEL EVALUATION PENDING (local ไม่มี key/model). Miro SYNC PENDING. หลักฐานและขอบเขตที่ยังไม่ได้ทำ: [assistant-pipeline-verification](output/assistant-pipeline-verification.md). ข้อความตาม flow เก่าด้านล่างเป็นประวัติเมื่อขัดกับ override นี้.

Browse/Chat follow-up (2026-09-12, คำสั่งล่าสุดแทน needs-first gate): เมื่อทราบหมวดให้ดูตัวเลือกก่อนโดยไม่ต้องกำหนดงบ แล้วค่อยถามความต้องการเพื่อคัดให้แคบลง. เลือกหมวดในแชตข้ามหน้า budget; งบเป็นตัวกรองทางเลือก. Browse รวม quote_only ใน grid และจำนวนผลลัพธ์ แม้กรองงบ โดยระบุว่ายังยืนยันเบี้ยไม่ได้; ยังเคารพหมวด/คำค้น/บริษัท. การ์ด Browse/Chat แสดงจุดเด่นและข้อจำกัดจาก highlights, coverage conditions/status และ exclusions; search tool ส่ง quoteRequired แยกจาก matches เพื่อไม่อ้างว่าเข้าเกณฑ์งบ. Mock เสนอแผนขอราคาแม้ไม่เหลือแผนที่ทราบราคาในงบ. 73 tests ผ่าน; typecheck/build ผ่าน, lint 0 errors/7 existing image warnings. Browser ยืนยัน Browse property แสดง Allianz + AXA ขอราคา และเลือกหมวด Chat ไปการ์ดตรงพร้อมจุดเด่น/ข้อจำกัด. Live model ยังไม่ได้ประเมินจริง (local mock ไม่มี credentials). Miro SYNC PENDING — ไม่มี Miro tools ใน session นี้.

Home → Browse → หมวด/งบที่มีperiodชัด → รายละเอียด → เลือก2–3แผนที่compatible → Compare → ดูเหมือน/ต่าง/ข้อมูลไม่พอ → เปิดChatพร้อมcontext → คำแนะนำ/เปิดCompareจากChat → สนใจแผน → เปิดSummary → ตรวจ/แก้ → consent → ยืนยัน → success+leadstatus → BrokerDashboard → validlead → รับเรื่อง → เริ่มสนทนาจำลอง → timer/notes → จบ+outcome → Accountเห็นstatusเดียวกัน → MyInsurance

ทางแยกที่ต้องครบ:

- Browseไม่มีผล: inlineempty+clearที่ทำงานและคืนfilter; quote-onlyแสดงแยก ไม่หลอกว่าอยู่ในงบ
- เปลี่ยนcategory/subgroupขณะเลือกอยู่: ยืนยันเปลี่ยน; cancelรักษาชุดเดิม; confirmclearเฉพาะselection/contextที่ไม่compatible
- selected1: แสดงชื่อแผนและขอเพิ่มอีก1; selected0: แนะนำเลือก; selected4/duplicate: คงชุดเดิม+ข้อความใกล้action
- detail“สนใจแผนนี้”แยกจากcheckboxCompare. AIเสนอแผนไม่เท่ากับผู้ใช้เลือก/สนใจ
- Handoffmanualเปิดได้โดยไม่ต้องscore70; ต้องมีอย่างน้อย1แผนที่ผู้ใช้สนใจ ไม่บังคับCompareก่อนทุกครั้ง
- closeSummary/cancelไม่สร้างlead; consentไม่ติ๊กให้เอง; doubleconfirmคืนactiveleadเดิมพร้อมfeedback
- invalid/unknownleadมีทางกลับ; validleadต้องไม่โดนnotfoundระหว่างrestore
- follow_upกลับมาstartใหม่ได้; closedอ่านประวัติได้; ไม่มีโทรจริง; MyInsuranceไม่เพิ่มpolicyจากlead

## 4. Data contract และ source rules (เสนอ V2)

คงstableIDsที่productidentityตรง; ถ้าrecordเดิมเป็นชื่อแต่งให้markunavailableพร้อมทางกลับ ไม่เปลี่ยนIDให้กลายเป็นคนละproductเงียบ. ใช้productId+tierLabel+subtype+editionเพื่อระบุว่าเปรียบvariantsของproductเดียวกัน ไม่อ้างว่าเป็นคนละบริษัท/ผลิตภัณฑ์

Contractขั้นต่ำที่ใช้จริง ไม่ต้องสร้างgenericrulesengine:

```ts
type Price = {
  kind: 'fixed' | 'example' | 'starting' | 'quote_only';
  amountTHB: number | null; // quote_only => null; finite >=0, <=2 decimals
  period: 'year' | 'trip' | 'single';
  scenario: string | null; // อายุ/เพศ/ทุน/รถ/ทริป/วัน ที่sourceระบุ
  includes: string | null; // ภาษี/อากร/base/riders; unknownได้
  sourceIds: string[];
};
type CoverageCell = {
  status: 'known' | 'unknown' | 'not_covered' | 'not_applicable' | 'conflicting';
  value: number | string | boolean | null;
  unit: string | null;
  basis: string | null; // per_year, per_disease, per_admission, per_day, until_age...
  inclusion: 'included' | 'optional' | 'unknown';
  conditions: string[]; // sharedcap, visits/daylimits, occupation, package...
  sourceIds: string[];
};
type SourceEvidence = {
  id: string; url: string; publisher: string; title: string;
  locator: string; // table/tier/row หรือ PDFpage
  publishedAt: string | null; effectiveAt: string | null;
  checkedAt: string; // วันตรวจ ไม่ใช่วันมีผล
};
type ComparisonStatus = 'same' | 'different' | 'not_comparable' | 'insufficient';
```

ราคา/coverageต้องreferencefieldที่ตรวจ ไม่อาศัยsourcekindofficialระดับplan. knownต้องมีsource; unknown/conflictingไม่ให้numericvalueไปrank; notcoveredต้องมีหลักฐานabsenceไม่ใช่null. ถ้าunit/basisยังไม่ทราบให้insufficient. phaseP1กำหนดfieldkeysคงที่ต่อ7หมวดจากresearch§3 และvalidatekeysด้วยexistingZod/native; ไม่ยัดopaqueproseเพื่อหลบtypecheck

Specific mapping: healthannualLimit/perDiseaseLimit/perAdmissionLimitแยก; motorcompulsorymedicalไม่ใช้thirdPartyProperty; lifecoverageUntilAgeกับcoverageYearsแยก; minimumEntryAgeมีunitdays/years; travelperiodรายrecord+direction; propertysharedNaturalPerilsLimit+includedperils; liabilitybundleParentId/claimsBasis. ถ้าแผนไม่มีfieldเพราะsubtypeต่างใช้not_applicable ไม่default0

ราคาexample/startingไม่มีสิทธิ์ผ่านคำว่า“อยู่ในงบแน่นอน”; filterแสดง“ราคาเริ่มต้น/ตัวอย่างในช่วงงบ”และquoteแยก. Comparisonsไม่แปลงปี↔tripหรือsum↔premium. UI/API/Chatต้องอ่านpriceformatter/semanticfieldsชุดเดียว

## 5. Compare และ query contract

คง POST `/api/compare` input `{category,planIds}` และexistingerrorcodesสำหรับ1/4/duplicate/unknown/mixed/invalidJSON. Responseคงcategory/planIds/plans/rows/url และเพิ่มcellmetadata/comparisonStatusตาม§4; เลิกให้unitเดียวต่อrow overrideunitแต่ละcell. `dataMode` แยกdemoenvironmentออกจากsourceverification ไม่กล่าวofficialทุกค่า

categoryต่างปฏิเสธMIXED_CATEGORY. categoryเดียวแต่subgroup incompatibleให้400 `INCOMPATIBLE_PLANS` พร้อมmessageและทางเลือกกลับBrowse. Samepurposeแต่basisต่างแสดงตารางได้โดยcellstatusnot_comparable เช่นhealthต่อโรคกับต่อปี; ห้ามเรียงbestlimit. `buildComparison`ตัดสินเหมือนกันในUI/API/tool; modelไม่คำนวณเอง

URLexplicitเป็นsourceoftruthสำหรับCompare. ไม่มีqueryใช้validsavedselection; invalidqueryแสดงerrorไม่เงียบfallbackไปhealth. Browseใช้URLfilter; providerถือselectionกลาง. เปิด/เพิ่ม/ลบ/back/reloadและChatเห็นIDsชุดเดียว. draftcheckboxไม่สร้างinterest. queryชื่อ/ID encodeด้วยURLSearchParams

Differences-onlyซ่อนเฉพาะverifiedsame; แยกส่วนinsufficientและnotcomparableที่เห็นได้. premiumทั้งheader/rowใช้formatterเดียวพร้อมscenario/source. ลบจนเหลือ1ยังเห็นชื่อ ไม่rawID. ตารางมือถือscrollได้เฉพาะcontainerและstickyrowheaders; selectflexใช้min-width0/wrapไม่ดันviewport

## 6. State / My Account / My Insurance

Restoreหลังmountด้วยvalidatedenvelope; server/clientinitialrenderตรง; loadingจนhydrateเสร็จแทนnotfoundปลอม. ตรวจnestedIDs/category/finitebudget/message/lead/callstates. เก็บkeyversionเดียว; migrateapp-ownedlegacy `insurance-demo-state` เมื่อsafeและประกาศtargetkeyให้ตรงdocs (เสนอ`insurance-demo:v2`). ไม่ล้างlocalStorageทั้งหมด

Selectionเปลี่ยนต้องตรวจmax3/unique/compatible. Accountblankbudget=null; negative/NaNแสดงerrorไม่clamp0แล้วบอกsuccess. เปลี่ยนหมวดมีconfirmationเมื่อกระทบselection; chatcontextสะท้อนหมวด/งบใหม่. goals/summaryแสดงเฉพาะข้อมูลที่มี ไม่สร้างความต้องการแทนผู้ใช้

storageunavailableใช้memory+notice, ไม่เขียนretryloop; invalidversion/corruptnestedไม่crash. resetใช้installedAlertDialogตามv1: cancelไม่เปลี่ยน, confirmล้างเฉพาะapp-ownedkey/legacyที่ระบุ, seedใหม่, toast, Home, focus. resetไม่ล้างข้อมูลเว็บอื่น

My Accountแสดงleadรายการจริงในdemo พร้อมstatus/updatedtime/summaryและลิงก์ที่มีอยู่. Policy4รายการคงdemo labels; policyมีตัวเลข/วันที่snapshotของตน ไม่เอาราคาcatalogเริ่มต้นมาเป็นเบี้ยpolicy. แยกpremiumDueOn/coverageEndsOnตามประเภท; wholelifeไม่บอกต่ออายุทุกปีเมื่อจริงเป็นวันจ่ายเบี้ย. รักษาpresentationclock2026-09-11 Asia/Bangkokและวันที่พ.ศ.; ตัวอย่างpolicyต้องไม่รับรองว่าออกจริง

My Insurance detailใช้sheetบนrouteเดิมได้: ข้อมูลกรมธรรม์ตัวอย่าง+planreference+status+helpCTAเปิดChatด้วยpolicycontextที่ระบุdemo. ไม่สร้างหน้าใหม่/renewaltransaction

## 7. Chat / Summary / consent

ทุกrequestvalidateก่อนทุกbranch: JSONobject, messagesrolesuser/assistantเท่านั้น, ≤12messages, ≤2000chars/message, ≤12000charsรวม, rawUTF8body≤32768bytes, selected≤3uniquevalidsamecategory, goals≤5×200, budgetnullหรือfinite≥0. ไม่coerceabcเป็นไม่มีงบ; ไม่truncateinvalidIDsเงียบ. Characterlimitsใช้JSstringlengthตามv1และบอกในtests; bodyใช้bytesจริงก่อนparse

Clientเก็บhistoryเพื่อdisplayได้ แต่ส่งwindowล่าสุดที่รวมpendinguserแล้วไม่เกินlimits; trimเก่าสุดแบบไม่ตัดกลางmessage. failedsendรักษาข้อความ/ให้retry ไม่duplicatehistory; responseเก่าไม่ทับcontextใหม่; busyguard. ห้ามติดถาวรที่รอบ7

Mock: ใช้contextและquickactionsจริง; quickbudgetขอconfirm20000ก่อนsetprofile ไม่แกล้งเข้าใจทุกprose. compareเรียกbuildComparisonพร้อมแสดงสรุปค่าพร้อมbasis+ปุ่มเปิดตาราง. suggestedIDsrendercardsให้เลือกเอง ไม่autoappend. โชว์source/unknownเท่าที่ใช้; ไม่มีแผนverifiedที่เข้าเงื่อนไขให้บอกตรง ๆ ไม่สร้างเอง

Scoreใช้v1: detail10+compare20+budget20+interest50; booleanนับครั้งเดียว, max100; ≥70offerครั้งเดียวถ้าไม่มีactivelead. Compact Offer ตาม Figmaให้กดเปิดSummary; หากChatเปิดอยู่ให้รอจนปิดก่อนแสดง ไม่consume offerSeenก่อนแสดงจริง. AIข้อความหรือtoolresultไม่เพิ่มinterest. manualhandoffข้ามthresholdได้. Closeofferแล้วไม่autoซ้ำ

Summarypreviewต้องเห็นcategory, budget+period, comparedplans, interestedplans, needs, questions, displayname, contactwindow, mock/live source. needs/questionsแก้ได้≤5ข้อ×200; trustedIDs/priceมาจากcatalogเท่านั้น. editedByUserสะท้อนการแก้จริง. consentuncheckedทุกใหม่; ผูกerrorกับfield; confirmเป็นactionแยก

Confirmสร้างdeepcopysnapshotรวมdisplayedplanfacts/provenanceที่ใช้ ณ ตอนส่ง เพื่อไม่ให้catalog/chat/profileภายหลังเปลี่ยนอดีต; consentAt+generatedAt+sourceModeจริง. activeleadduplicateตามv1(customer+categoryที่ยังไม่closed)คืนexistingIDพร้อมfeedback ไม่silentno-op. successแสดง“ส่งคำขอแล้ว”+status+ไปAccount/Brokerdemo. ไม่สร้างpolicy/โทร/ส่งnotificationจริง

## 8. Broker state machine

`new --รับเรื่อง--> contacting --เริ่มคุย--> contacting(activeCall)`; endสนใจต่อ/ไม่สนใจ→closed, endนัดติดตาม→follow_up. follow_upเริ่มใหม่→contactingพร้อมnewcall. activecallสูงสุด1; กดซ้ำไม่สร้างเพิ่ม; endก่อนstartปฏิเสธ; outcomeและnoteที่ไม่ว่างต้องมีก่อนsave

Dashboardเรียงnewล่าสุดและshowstatusไทย/planname/contactwindow. LeadDetailต้องอ่านvalidIDหลังstatehydrate; แสดงsummary, consenttimestamp, transcriptตอนส่ง, scorelabeldemo, planfacts/source. timerคำนวณจากstartedAtจึงreloadต่อเนื่อง; endedAtใช้durationสุดท้าย. แสดงcallhistoryพร้อมnotes/outcomes. Accountstatusอัปเดตทันทีในbrowserเดียว

closedอ่านได้และปุ่มstartdisabled; ไม่เพิ่มreopenworkflowที่ไม่ได้สั่ง. follow_upหลายรอบเก็บhistory. labelทุกselect/button, errorsใกล้save, focusไม่หายระหว่างสถานะเปลี่ยน

## 9. Live AI adapter

ไม่ใช้APIkeyจากข้อความเก่ามาhardcodeหรือใส่เอกสาร. ใช้serverenv `CHAT_PROVIDER=mock|openai`, `OPENAI_API_KEY`, `OPENAI_MODEL`ตามv1; migrationจากCHAT_MODEต้องdocument; defaultmock. อัปเดต.env.exampleเฉพาะชื่อตัวแปรเมื่อimplementation

อ่านofficialOpenAIdocs/installedSDKก่อนเขียน; ตรวจRESTresponseจริง ไม่สมมติSDKhelperoutput_textบนrawREST. Serverส่งcatalogเฉพาะหมวด/selectionพร้อมpricekind/period/scenario/basis/provenance/unknown. Strictstructuredoutput+runtimevalidationnestedทุกค่า; rejectinvalidIDs/URL/refusal/incompleteเป็นcontrollederror

Toolsจริง `search_plans` และ `compare_plans` → sharedfunctions, validatetoolargsอีกครั้ง, ≤2rounds/request, timeoutรวม20s, maxoutputประมาณ500tokensตามv1. URLสร้างโดยserverจากknownIDs; modelไม่มีสิทธิ์เปลี่ยนrouteหรือสร้างexternalURLให้navigate. ฝั่งUIแสดงbuttonให้ผู้ใช้กด ไม่autonavigate

Errorsคง503CHAT_NOT_CONFIGURED,429RATE_LIMITED,504CHAT_TIMEOUT,502CHAT_UPSTREAM_ERROR. retryโดยuser; ไม่มีunboundedautomaticretry. เลือกmockfallbackอย่างชัดเจนผ่านmode=mock; labelmock/liveตามresponseจริงและแจ้งก่อนส่งliveครั้งแรก. ไม่รับmodel/key/systemจากclient

ไม่มีcredentialที่ตั้งค่าและsafeพร้อมทดสอบ: live smoke=BLOCKED; ทำmock/tests/errorpathsส่วนอื่นต่อ. liveVERIFIEDต้องมีsuccessfulrealrequestพร้อมtoolroundtripและsanitizedevidence ไม่ใช่แค่adapterไฟล์อยู่. ไม่ใช้modelรุ่นผู้เขียนโค้ดเป็นchatmodelโดยอัตโนมัติ

## 10. UI acceptance direction

รักษาFigmaframesที่plan.md mapไว้; latestFigma browser inspected: Compare, My Insurance, Home, Chat and Offer. Structural review complete with screenshots and independent8/10Figma score; dedicated MCP still requires reauthentication but browser read succeeded. Exact pixel/asset fidelity is not claimed. HomeGenZใช้ข้อความไทยสั้น/ภาพเด่น/CTAชัดตามdraft; ไม่เพิ่มgradient/glow/decorativemotion. Apple action#0066cc, ink#1d1d1f, canvaswhite/#f5f5f7; ไทยletterspacing0/body17/lineheight1.6ตามplan

ทุกcontrolhit≥44pxรวมquickprompt/consent/close/select; semanticlabels, aria-currentnav, visiblefocus, keyboardEnter/Space/Escape, dialogfocus/returnfocus. Chat400pxdesktop/fullmobileและไม่บังselectionbar. errorinline+aria-describedby, livefeedbackไม่อ่านhistoryซ้ำทั้งก้อน

Compareเป็นworkingpage; แผน/selectorเห็นเร็ว; mobiletableonlyscroll. ใช้imagecategoryที่แตกต่างตามความหมายโดยassetที่มีสิทธิ์; ไม่บังคับสร้าง35ภาพ. Loading/empty/error/notfoundทุกหน้าเกี่ยวข้องมีactionไปต่อ; ลดrawIDs/Englishstatusจากproductcopy

## 11. Acceptance matrix — expected outcomes ใหม่

| ID | Test | ต้องได้ |
|---|---|---|
| V01 | Homeทุกlink/CTAด้วยmouse+keyboard | routeถูก; noLinkTypeError; back/refreshใช้ได้ |
| V02 | Browse/detail/Compare/Account/MyInsurance/Brokerทุกnav | ทั้งclickและdirectใช้ได้; ไม่ใช้directแทนclickevidence |
| V03 | สร้างlead→เปิดvalidID+reload; unknownID | validrenderหลังhydrate; unknowncontrollednotfound |
| V04 | persistedprofile/lead reloadทุกroute | ไม่มีReact418/flashnotfoundทำให้flowผิด |
| V05 | ทุกselectableplan+field | product/tier/source/locator/checkedAtและverifiedvaluesครบ; unknownชัด |
| V06 | Essentialtier4 vs Valueplan1 | 10mperdiseaseไม่annual; Value2.5m/year+500kadmission; ไม่จัดrankข้ามbasis |
| V07 | HealthสุขใจS/M/L | IPDperadmission; ราคาexampleชาย35และทศนิยม. ใช้R03literalexpected |
| V08 | Motorพ.ร.บ. | medical80000อยู่medicalไม่PD; incompatibleclass1selectionมีmessage |
| V09 | Life99/20,99/7,10/1,15/3 | untilage99 vs duration10/15; payperiod20/7/1/3; pensionclaimไม่หลงมา |
| V10 | PA AllInOneS scenarioชาย35 | 3855/medical45000/death300000จากR10; ไม่มีLmedical150000 |
| V11 | Travelannual/domestic/inbound | annualบาท/ปี; domesticmedicalตามtier30/50/100kไม่1m; inbound750kไม่รับรอง999ทุกtrip |
| V12 | Property/liability | sharednaturalcapไม่บวกซ้ำ; bundlepriceไม่standalone; ไม่มีชื่อfakevariant |
| V13 | unknown/conflict/optional/notcovered/zero | display/API/AIแยกทุกสถานะ; SaveDeeconflictไม่อ้างverified |
| V14 | comparevalidation1/4/duplicate/unknown/mixed/invalidJSON | controlledstatusตามcontract, no500 |
| V15 | quote-onlyในsort/filter/compare/AI | ไม่แสดง0บาท/ฟรี/ถูกที่สุด/ในงบแน่นอน |
| V16 | same/different/null/null/basisต่าง | semanticstatusถูก; unknownไม่ถูกซ่อนว่าเหมือน |
| V17 | Browsecheckbox→Detail→Compare→Chat | IDsชุดเดียว; suggestionไม่เลือกเอง |
| V18 | เปลี่ยนหมวดมีselection cancel/confirm | cancelรักษา; confirmclearและcontextตรง |
| V19 | เพิ่ม/ลบ/4th/duplicate/เหลือ1/เหลือ0 | feedbackถูก+ชื่อแผน; ไม่มีsilentno-op |
| V20 | URLquery/back/refresh/noquery/invalidquery | selectionตาม§5; invalidไม่แอบdefaulthealth |
| V21 | searchThai/AXA,sort,negativebudget,emptyclear | ผลถูก+querypreserved; clearทำงานจริง |
| V22 | Accountvalid/blank/negative/NaNbudget | persistvalid; blanknull; invalidinlineerrorไม่save |
| V23 | badstorageversion/JSON/nested/quota/disabled | recover/memorynotice; nohydrationcrash/write-loop |
| V24 | resetcancel/confirm+unrelatedstoragekey | cancelไม่เปลี่ยน; confirmseed+toast+Home; keyอื่นอยู่ |
| V25 | policies4+demo clock+detailhelp | statuses/พ.ศ.ถูก; lifeชำระเบี้ยแยกcoverageend; noissuedpolicyจากlead |
| V26 | Accountleadlist/updatedstatus | สถานะเดียวBroker; เปิดsummaryได้ |
| V27 | Chatrequestallboundariesในaudit§5 | invalid400ก่อนbranch; >32KBไทยถูกblock; privilegedroleถูกreject |
| V28 | Chat8รอบ+largehistory+failedretry | ต่อได้ตามrollingwindow; inputไม่หาย; ไม่duplicate |
| V29 | contextcategory/budget/selectionเปลี่ยน | ส่งล่าสุด; ไม่มีstaleIDerrorถาวร; responseเก่าไม่ทับ |
| V30 | mockcompare+suggestioncard+budgetquick | ใช้domainและsamebasisvalues; มีปุ่มเปิดCompare; budgetconfirmก่อนsave |
| V31 | score50/70/100+eventซ้ำ+dismiss | ค่าdeterministic/ไม่ซ้ำ; offerครั้งเดียว; manualยังเปิดได้ |
| V32 | summarypreview/edit/cancel | ทุกข้อมูลก่อนconsentมองเห็น; editedByUserถูก; cancelไม่lead |
| V33 | missingconsent/name/interest; doubleconfirm | invalidfieldfeedback; validactiveleadเดียว+existingID |
| V34 | mutateprofile/chat/selection/catalogหลังhandoff | leadsnapshot/transcriptเดิมไม่เปลี่ยน |
| V35 | successhandoff | visibleconfirmation+status+nextaction; consentAt/sourceModeตรง |
| V36 | new→accept→start→reload | contacting+activecallเดียว; timerต่อเนื่อง |
| V37 | end3outcomes+empty/whitespace note | validtransition; invalidไม่save; historyอ่านได้ |
| V38 | follow_up→callใหม่; doubleclickstart/end | statuscontacting; ไม่สร้างcallซ้อน/จบซ้ำ |
| V39 | closed/unknownlead/list navigation | closedread-only; recoverylinksใช้ได้; Accountsync |
| V40 | realOpenAI request+search/comparetool | toolargsvalidated, domainเดียว, nohallucinatedIDs/value/URL |
| V41 | missingconfig/429/timeout/refusal/incomplete/badJSON | controllederror+retry+explicitmock; nosecret |
| V42 | invalidmodelnestedoutput/IDs/externalURL | rejectcontrolled; ไม่filterเงียบจนเป็นsuccess |
| V43 | serverkey/bundle/log/network | ไม่มีkey/modeloverrideจากclient; sanitizedevidence |
| V44 | providerlabel/livefirstnotice/mockfallback | labelตามmodeจริง; mockไม่แอบเรียกlive |
| V45 | 360×844,390×844,1440×900,1920×1080ทุกpage/state | noouteroverflow; Thaiไม่ชน; screenshot+controlchecks |
| V46 | Tab/ShiftTab/Enter/Space/Escape+200%text | focusvisible/return/trapตามdialog; ไม่ตกหล่นcontrols |
| V47 | allrenderedcontrols inventory | ทุกbutton/link/input/selectมีPASS/FAIL/BLOCKEDevidence; ไม่มี“PASSโหลดหน้า”แทนclick |
| V48 | sourceauditทุกpublishedcell+7categorytables | independentlycheckedexpected; unknownexplicit; ไม่assertกับfunctionเดียว |
| V49 | regression+productionlocalbuild | npmtest/tsc/lint/build; startล่าสุด; fullcustomerbrokerjourney2รอบรวมreset |
| V50 | latestFigmaและhandoffdocuments | visualmatchedwithscreenshots หรือBLOCKEDตรง; phaseevidence/Miro/READMEตรง |

## 12. ส่งมอบและบันทึกสถานะ

ต่อphase: ระบุไฟล์จำเป็น → แก้ → รันtestsตามผลกระทบ → browsercontrols → acceptanceทีละข้อ → updateเฉพาะphaseพร้อมcommand/result/URL/viewport. ไม่เขียนtestsmirrorimplementation; regressioncasesต้องfailกับbugเดิม. ใช้testtoolsที่มี ไม่ติดตั้งframeworkซ้ำ

หลังimplementationphaseที่อนุญาตจบและchecksผ่าน: `npm run build`, รันlocalผ่านscriptsจริงที่projectมี, เปิดBrowserให้ตรวจ. ก่อนrestartตรวจport/processที่เป็นแอปนี้ ไม่killprocessอื่น. ไม่deploypublic. คำสั่ง implementation ปัจจุบันให้ build และ redeploy local หลังแก้เว็บ

V2 implementation evidence (12Sep2026): `npm test` 11/11 PASS; `npx tsc --noEmit --incremental false` PASS; `npm run lint` 0 errors (4 existing no-img/unused warnings resolved to 3 no-img warnings); `npm run build` PASS; production restarted with `npm run start`, port `127.0.0.1:8787` listening. Native links, post-mount state restore, scoped reset, bounded chat requests, validated profile budget, shared comparison premium units, handoff confirmation, broker timer/history are implemented. Historical evidence above is superseded by the 12 September QA addendum below.

DONEเมื่อacceptancephaseผ่านครบ. ถ้าข้อใดรันไม่ได้บันทึกBLOCKEDกับสาเหตุ ไม่markpassเพราะsourceดูถูก. P7demoREADYต้องcustomer+broker+resetเดินจริงอย่างน้อย2รอบ. LiveแยกVERIFIED/BLOCKEDตามrealrequest. Visualmatchไม่verifiedจนFigmaเข้าถึงได้

### Prompt สำหรับ Luna เมื่อผู้ใช้อนุญาตให้ลงมือ

```text
อ่าน AGENTS.md, Rule.md และ plan-v2.md §0–4.
ทำเฉพาะ phase V2 ที่ผู้ใช้อนุญาต; อย่าเริ่มจากสถานะ DONE ใน plan.md v1.
อ่าน contract/test ของ phase และ audit finding ที่อ้าง. ใช้ research-v2.md เป็นหลักฐานข้อมูล.
Ponytail full: ใช้โค้ด/primitiveเดิม แก้ root cause ไม่สร้างโครงใหม่.
คง routes. ใช้ contract V2 ที่อนุมัติ. ข้อมูลไม่ทราบห้ามเดา/เติม0/แต่งแผน.
UI/API/Compare/AIใช้ข้อมูลและdomainเดียว. Mockdefault; server-onlykey.
ตรวจทุก acceptance จริง แล้ว build+เปิดlocalให้ตรวจ. ไม่อ้างว่าpassedถ้าblocked.
อัปเดต phase/evidence และ Miro V2 ให้ตรง. หยุดตามขอบเขตphaseที่สั่ง.
ตอบ: ทำแล้ว / ตรวจผ่าน / ยังขาด / สถานะ.
```

Miro: [V2 — Audit and implementation proposal](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683443768196) — SYNCED 11Sep2026: เพิ่ม frameแยก พร้อมสถานะ, customer/broker flow, data contract changes, 8 phases และ QA gates; อ่านกลับ6itemsสำเร็จ. ขนาดข้อความที่renderจริงอยู่ในframeและไม่ทับกัน. v1เดิมไม่ได้แก้. รายละเอียดfield/API/testsฉบับเต็มอยู่ในเอกสารV2นี้; ในMiroระบุชื่อเอกสารที่ตรงกัน


### QA addendum — 12 September 2026

- Current commands: `npm test` 14/14; `npx tsc --noEmit --incremental false` PASS; `npm run lint` 0 errors / 5 no-img warnings; `npm run build` PASS. Initial rebuild hit Windows dist lock; stopped only verified project Wrangler/workerd processes and rebuilt successfully. `npm run start` serves HTTP 200 at http://127.0.0.1:8787.
- Live is explicitly authorized by user. `scripts/start-local.mjs` passes server `.env.local` to Wrangler; `CHAT_MODE=live` retained for compatibility. No credential values in docs/client. Raw Responses output parsed and validated; actual search/compare tools use shared catalog/domain. Successful compare tool output was shown in browser; search smoke ~4.43s, compare ~6.9s (single observations, not percentiles).
- V18/V19 bounded checks: Browse cancel preserves 2 checked IDs/focus; confirm clears selection and navigates category; fourth click keeps 3 IDs with plan-specific error. Compare category cancel preserves all 3 slots and focus. Further invalid-query/back/subgroup tests remain.
- V24: Account reset cancel preserves 2 test leads and restores focus to reset button; confirm returns Home, then Account shows seed profile and no leads. Unrelated-key survival is source-inspected, not browser-injected. Reset does not yet show a dedicated post-navigation toast.
- V25: 4 policies displayed; photo/date composition follows Figma Slide51, desktop 2 columns and mobile 1; native details opens policy number/holder/start date. Life payment date is not described as coverage expiry. Missing policy premium is explicit.
- V31: shared event-score function verified at 0/50/70/100 and repeated interest; lead score no longer grants budget points merely because seed budget exists.
- V36–V39 earlier browser journey: accepted a new lead, started/reloaded active call, rejected empty note, saved follow_up, started second call, saved interested; second new lead saved not_interested. Account showed matching closed status. All three outcomes exercised; exhaustive race injection remains.
- Figma latest browser read: Slide52 node3:145, Slide51 node3:6 and Chat Overlay. Compare has centered title/specialist action/three selectors with distinct health illustrations; My Insurance uses photo cards/date corner; Chat keeps overlay/composer shape with accessible Apple palette. No exact pixel-match claim.
- Mobile menu replaced overlapping nav labels; Enter opens, Escape closes/returns focus, My Insurance link clicked successfully. Observed viewport390px with document375px; desktop observed1280px with document1265px. 360/1920 and complete text-zoom matrix remain unverified.
- Miro V2 status item3458764683443768198 synced to P0 DONE / P1–P7 IN PROGRESS; live smoke verified, final QA pending. Rendered status text height189px fits existing216px allocation.
- Detailed metrics and remaining release gates: `output/quality-report.md`. Initial independent audits are historical; owner retests must not be presented as an independent final re-score.

Latest Live compare retest after plain-text formatting prompt: HTTP200/live, shared Compare URL, 6.781s; output/live-smoke-latest.json. Latest production rebuilt and reopened on Home.

### Follow-up — budget, truthful catalog and independent QA

`npm test`34/34, typecheck PASS. Current implementation: premiumTHB nullable (full Price metadata contract still pending), comparisonStatus + subgroup compatibility shared across UI/API/AI, 26 catalog identities after removing unsupported variants. Customer state stores comparedPlanIds separately from interestedPlanIds; Browse decimal budget reaches Summary/Broker. Needs/questions support5 lines×200 chars; errors linked to fields. Broker history includes timestamps/duration; invalid stored call states rejected.

Production browser verified budget30000.25 through Lead→closed→Account, summary interest checkbox/consent errors, Account decimal/negative/category confirmation, incompatible Compare deep link and liability empty state. Live stale-context response discarded without losing question; manual resend available. Independent UI sample actual2048×1081 and390×844, no outer overflow, menu keyboard/focus and Compare keyboard scroll passed; sampled scores8/7/8/8. Full source metadata, all controls and final acceptance remain IN PROGRESS. See output/quality-report.md and output/broker-audit.md; send button measured44×44.39px after rebuild. Latest reset journey completed through Live/mock→lead→follow_up→second call/reload→closed→Account→reset; Home reopened. Miro status synced.

### Canonical data and executed QA checkpoint — 12 September 2026

Latest evidence: `output/verification-latest.md`. 46/46 tests, typecheck/build PASS, lint0errors/5native-imgwarnings; local HTTP200. Canonical25 records now share price/cell/source semantics; independent source inspection covered25 records with explicit limitations, material findings corrected. P3 and P5 DONE from executed acceptance. P1/P2/P4/P6/P7 remain IN PROGRESS pending their remaining evidence, not because v1 says DONE.

Text enlargement14/14 page-width combinations had no outer overflow after fixes. Storage quota/denied/corrupt/scoped-reset tested in isolated browsers. Two complete fresh desktop/mobile customer→Broker→reset journeys passed. Live5-case review found a retrieval omission for selected quote-only CMI; search tool now returns `matches` and `selectedOutsideFilter` separately, preserving canonical facts without labelling them within budget. This internal tool result does not change public routes or Compare API contract. Retest and subjective metrics in `output/live-eval-latest.md` and `output/ui-audit-latest.md`.

Final checkpoint update: P6 DONE after genuine CMI retest corrected retrieval and wording: price conflict, promo expiry15Jan2026, quote-only and inability to confirm budget all stated correctly (single-case manual10/10, not generalaccuracy). Latest status P0/P3/P5/P6 DONE; P1/P2/P4/P7 IN PROGRESS. Static text contrast probe287 checked elements across7pages,0remaining failures after Compare placeholder contrast fix;19 image-overlay elements excluded. Build/localHTTP200 and43-client-file secret scan0matches repeated after final UI change.

### Current52-test/Core/UI checkpoint

P0–P6 DONE; P7 final acceptance IN PROGRESS. Current canonical25records/330cells plus independent Core review in output/data-core-final.md. Final build52tests/tsc/buildPASS, lint0errors/5native-imgwarnings, HTTP200;43clientfiles/0secret-patternmatches. Executed25Detail/Interest/Cancel/backcategory flows and303source disclosures,2fresh customer→Broker→reset journeys,14text enlargement checks,4Chat viewport/focus checks,415contrast elements/0failures (19photo exclusions). Independent UI Apple8/Figma8/simple7.5/anti-slop8; exact pixel/assets not claimed. Live latest Core compareHTTP200/9.688s and grounded ICU/age/OPD response. Current evidence: output/verification-latest.md; historical checkpoints above superseded.

Miro V2 status synced through browser fallback because MCP OAuth refresh failed. Compact Offer follows Figma, defers while Chat is open, appears once, then manual summary remains available after dismiss. Independent natural-threshold retest passed.

### Final release disposition

V2P0–P7 DONE for the approved demo scope.53tests/typecheck/lint/buildPASS,HTTP200,2freshcustomerBrokerresetjourneys.96state captures+16post-fixdelta,173knowncellledger,26safeexternal-source navigations. Read output/verification-latest.md and control-acceptance-final.md for provenance and limits.24externalproviderpages block/challenge automatedbrowsercontent; linktargets/openerchecks succeeded. Miro V2 status readback updated toP0–P7DONE; browserfallback succeeded despite MCPautherror. ExactFigmaassets/pixels not claimed; independentstructural8/10. Unknown and emptyliability remain deliberate.


### UX refresh — authorized 12 September 2026 — UI DONE / whole-market research IN PROGRESS

- Home CTA opens Chat with category choices, category context changes confirmed before clearing selection, then actual current live/mock adapter responds.
- Extend Home with beginner education and source-linked date-valid official promotions/images; never subtract campaigns from canonical premiums.
- Browse uses Apple Mac reference category rail, gray catalog canvas, insurer tabs and large white cards; preserve search/budget/sort/selection/quote-only behavior.
- Compare has separate Browse and Chat actions and Radix visual product picker grouped by insurer, keeping same-category/subtype2–3 validation.
- My Insurance keeps Figma photo/date2×2 structure with concise collapsible details. My Account source unchanged.
- Expand sourced canonical products/field investigations across seven categories; do not claim exhaustive market coverage or infer missing quote/tier facts.
- Acceptance: execute new Home choices including cross-category cancel/confirm, picker mouse/keyboard/Escape, all Browse filters/compare, MyInsurance disclosure/help, official campaign links/images and mobile widths; tests/typecheck/lint/build and local production review.
- Research: research-expansion-nonlife.md, research-expansion-life-health.md, research-home-content.md. Miro status3458764683443768198 updated to new authorized flow/scope; previous V2 completion remains historical.


UX refresh final evidence: output/refresh-verification.md.40records/12insurers,538cells; researched field display additions shared in UI/API/AI.55tests,tsc,lint0errors/build PASS.7category API/UI comparisons,15new detail routes,2new-plan customer→Broker journeys,7mockcategory choices and latest genuine Live7000ms verified. Home44px controls and mobile overflow rechecked independently. MyAccount hash unchanged. Local production127.0.0.1:8787. Full-market/all-promotion collection is not complete;206unknowns/2conflicts preserved. Research follow-up resolves formerly held FWD/ThaiLife PDFs; research-expansion-health-followup.md is authoritative for those additions. Miro customer flow includes Home→Chat choices and separate Compare actions; status sync records this partial research scope honestly.

### Daily + contextual learning + tool-led Chat — authorized 12 September 2026 — DONE

This addendum supersedes the previous Home glossary and always-visible Chat budget/compare/specialist buttons. Routes, canonical catalog and My Account remain unchanged.

- Home order: original hero → curated dated insuranceDaily cards → five general purchase steps → official promotions. Current cards are manually verified official promotions, not an automatic news feed. Hide campaigns outside their stated dates.
- Explain technical terms at their actual fields with shared question-mark controls. Hover/focus previews; click/tap pins a source-linked explanation; Escape closes and restores focus.
- Chat responses: short introduction plus at most four validated cards. Server tools choose plan details, comparison, category/budget question, specialist offer or glossary. Numeric facts, field labels, conditions and URLs render from canonical domain data; model cannot supply them.
- Additive response contract and tool validation: `output/chat-cards-contract.md`. Persist validated assistant card descriptors only; client sends role/content, not cards. Existing API routes and selected-plan compatibility remain.
- Chat offers contextual actions inside cards. User action confirms budget/category/selection; specialist offer only opens an editable summary. Explicit interest and consent are still required to create a local demo lead. Remove threshold-triggered pop-up and permanent action toolbar.
- Chat desktop expanded680px/compact420px; mobile viewport fit; minimize/restore preserves in-progress conversation and draft. Reply while minimized indicates new response. New answers scroll to their beginning, not the bottom of a long card.
- Acceptance: Home source/date/order/mobile rail; term hover/click/Escape/touch; actual mock and live tool choices; canonical AXA SmartDrive property limit; compare2–3 compatible plans; category cancellation; budget validation; card persistence; compact/minimize/restore; consent→localLead→Broker; mobile/keyboard; tests/typecheck/lint/build/local review.
- Evidence in progress: `research-daily.md`, `output/daily-final-audit.md`, `output/chat-cards-contract.md`. Initial61tests/typecheck/lint0errors/build passed; actual Live review exposed a tool-field/fallback mismatch and mock term/plan precedence mismatch, being corrected before DONE.

Final evidence: output/chat-daily-verification.md.65tests/typecheck/build PASS; lint0errors. Genuine Live detail and handoff verified in browser; initial tool-field/mock-precedence defects fixed/retested. Contextual terms38, desktop/mobile/minimize/category/budget/consent checks passed. Broker stores and renders read-only card snapshots, including referenced unselected plans, after reload. Miro customer flow/status synchronized. My Account unchanged. Earlier whole-market research remains separate and incomplete.

### Product imagery, Home promotions, motion and Broker — authorized 12 September 2026 — DONE

- Replace insuranceDaily with the existing official promotion section immediately after Home hero; remove its duplicate lower section. Keep the general purchase guide.
- Replace category-wide placeholder photography in Browse with verified official product imagery. Canonical Plan.image points to locally stored sourced images; actual product tiers may share the same product artwork. If unavailable use a clearly identified official insurer identity image rather than an unrelated photo. Keep image provenance in mapping/research files and preserve numeric data/contracts.
- API investigation: distinguish public product catalog access from partner sales APIs and consent-based personal policy data. Do not add an unverified API or call private endpoints.
- Authorized motion: short opacity/transform entrances, press/hover feedback, Chat/menu transitions; no layout animation or new library, reduced-motion support, preserve interaction timing/accessibility.
- Refresh existing Broker dashboard and lead workspace using the existing local demo flow, real local counts, search/status filters and read-only historical card snapshots. No auth/CRM/database/new routes or external calling.
- Acceptance: Home section order/no Daily duplication; all40product images resolve and evidence maps correctly; Browse filters/Compare/detail continuity; motion/reduced-motion/focus/mobile; Broker empty/populated/filter/accept/simulated outcome/reload; tests/typecheck/lint/build/local review.

Final evidence: output/product-broker-verification.md.66tests/typecheck/build PASS; lint0errors. Home order and40/40image decoding verified;23product artwork17labelled insurer identities. Actual Broker consent/accept/simulated outcomes/reload/search/filter and motion/reduced-motion/keyboard/mobile checks passed. MyAccount source unchanged. Local production127.0.0.1:8787 rebuilt. API access remains partner-dependent; no all-insurer public feed claimed. Miro customer flow/status synchronized; older whole-market research scope remains incomplete.

### Full-page Chat, budget choices and reading/motion — authorized 12 September 2026 — DONE

- New `/chat` route explicitly authorized by latest request; other routes remain. Home start is a native `/chat?start=1` link. White transition → centered category question/cards → annual budget choices → full-page Chat. Query is consumed after setup; `/chat` resumes the existing local conversation. Overlay remains for contextual actions with a full-page link and session draft preservation; consent is never persisted.
- Reuse ChatWorkspace, tools, canonical cards and handoff; full-page content17–18px, captions/conditions14px minimum. Draft Chat Overlay node3:247 inspected through logged-in browser. Figma MCP returns reauthentication required; screenshot/read UI fallback documented. Use restrained translucent chrome and solid readable data surfaces; static blur only, no blur animation. Apple materials reference: https://developer.apple.com/design/human-interface-guidelines/materials.
- BudgetChoices derives up to4 exact existing annual premiums with evidence/scenario/kind; no illustrative user thresholds, interpolation, or trip/year mixing. Explicit skip is null, never0, and proceeds to plan cards. Shared search adds optional premiumPeriod; Chat numeric maxPremium uses year while Browse's existing budget contract is unchanged. Server validates tools and respects skipped budget. No schema changes to persisted Plan/Lead.
- Native cross-document navigation transition and keyed Browse results; progressive fallback preserves navigation/modifier clicks/history. Static structural skeleton only during actual hydration/waiting, no artificial loading delay. Reduced motion and transparency respected.
- Acceptance: Home full-screen category→budget→mock/live cards; all7 categories and nullable skip; real annual anchors/source disclosures; back/category conflict cancel; full-page/overlay draft+handoff+consent→Broker; keyboard/focus/mobile/reload; normal/reduced route transitions and filters/details; tests/typecheck/lint/build and local review.

Final evidence: output/chat-fullpage-verification.md.71tests/typecheck/build PASS; full lint0errors/26warnings (native images and local QA scripts). Genuine Live motor→skip→canonicalcards HTTP200; independent11case handoff audit plus post-fix editedByUser/consent delta PASS. Final deployed CSS tested1440/390/360 normal/reduced: no page overflow, budget body/actions17px, mobile facts17px/labels16px, hero press centered. Native history/Ctrl-click/Browse/filter/disclosure and actual hydration skeleton checked. Miro customer flow/status synchronized. Local production127.0.0.1:8787/chat?start=1 rebuilt; no new dependency. Earlier whole-market research remains separate and incomplete.
