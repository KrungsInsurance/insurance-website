# Insurance Demo — V2 audit

ตรวจ 11 กันยายน 2026 บน local production http://127.0.0.1:8787 ผ่าน Codex In-app Browser, source inspection และ local API requests. เอกสารนี้เป็นผลตรวจ ไม่ใช่รายงานว่าแก้แล้ว ดูแผนแก้ใน [plan-v2.md](plan-v2.md) และหลักฐานประกันใน [research-v2.md](research-v2.md)

## 1. ข้อสรุปและขอบเขตหลักฐาน

**สถานะเดโม: NOT READY.** มีปัญหาการนำทางทุก template ที่ทดสอบ, valid lead เปิดไม่ได้, state ระหว่างหน้าไม่ตรงกัน และตัวเลขประกันบางรายการมีหน่วย/แผนผิด แม้ automated tests เดิมผ่าน จึงยังรับรอง P0–P7 DONE ตาม plan.md ไม่ได้

ไม่ได้แก้ app, catalog, dependencies, deployment หรือ plan.md v1 ในการตรวจครั้งนี้ ใช้ข้อมูล UI ทดสอบ V2 QA / V2 Profile เท่านั้น ไม่มีการโทร ซื้อประกัน ส่งข้อความถึงบุคคล หรือเรียก live OpenAI. Browser เก็บ test lead/profile/messages; ไม่ถือเป็น seed ที่ส่งมอบ

ความหมาย: PASS = ทำจริงและผลตรงเฉพาะข้อนั้น; FAIL = ทำจริงแล้วผิด; SOURCE = พบจาก source ยังไม่ยืนยัน runtime; BLOCKED = ทำต่อไม่ได้เพราะข้อก่อนหน้าหรือเครื่องมือ; NOT VERIFIED = ยังไม่มีหลักฐานเพียงพอ. การโหลด URL ตรงได้ไม่ใช่การผ่าน navigation. การตรวจ template ไม่ใช่การกดทุกลิงก์ที่ใช้ template เดียวกัน

## 2. Page / interaction ledger

| ID | หน้าและสิ่งที่ทำ | ผลจริง | สถานะ |
|---|---|---|---|
| N01 | Home: เริ่มต้น, Browse ประกัน, My ประกัน, เปรียบเทียบประกัน, My Account | คลิกแล้ว URL ยัง /; Link chunk โยน TypeError | FAIL |
| N02 | Home: เริ่มค้นหาประกันเลย!, ดูวิธีเปรียบเทียบ, บัญชีของฉัน | เหมือน N01 | FAIL |
| N03 | Home logo / Home ที่อยู่หน้าเดิม | ไม่มีการเปลี่ยนหน้า จึงพิสูจน์ navigation ไม่ได้ | NOT VERIFIED |
| N04 | ใช้ keyboard Enter ที่ Home CTA | ไม่ไป Browse; error เดียวกัน | FAIL |
| N05 | เปิด Home, Browse, Compare, Account, My Insurance, Broker ด้วย URL ตรง | template render ได้ | PASS เฉพาะ direct render |
| B01 | Browse เลือกหมวดทั้ง 7 ผ่าน category links | ไม่เปลี่ยน URL; Link error | FAIL |
| B02 | ค้นหา AXA ด้วย input + ค้นหา | ผล 2 แผนสุขภาพ; query อัปเดต | PASS |
| B03 | เปลี่ยน sort เป็นราคามากไปน้อย | Essential ก่อน Value หลัง render เสร็จ | PASS |
| B04 | ใส่งบ -1 และกดใช้ | inline error; ไม่เปลี่ยนผลค้นหา | PASS |
| B05 | ใส่งบ 1 | empty state และ clear action แสดง | PASS เฉพาะ empty state |
| B06 | กด clear filters จาก empty | URL ยังมี q=AXA&sort=price-desc&maxPremium=1 | FAIL |
| B07 | เลือก checkbox แผน 1–4 | เก็บ 3 แผน; ที่ 4 ไม่ติด แต่ไม่บอกเหตุผล | PARTIAL / FAIL feedback |
| B08 | เลือก 3 แผน Browse แล้วถาม Chat “ต่างกันตรงไหน” | ตอบแนะนำทั่วไป 2 แผน; ไม่รับ selection ทั้งสาม | FAIL |
| B09 | selection ข้ามหมวด: cancel/confirm | navigation blocker; local state ไม่แชร์ provider จาก source | BLOCKED / SOURCE |
| B10 | กดดูรายละเอียดบน Browse ทั้ง5cards ×7หมวด | 35ลิงก์คงอยู่ /browse; ไม่เปิดรายละเอียด | FAIL |
| B11 | ทั้ง7หมวด: เลือก4checkboxแล้วuncheckข้อแรก | checked=[true,true,true,false,false]; uncheckเหลือ2 | PASS ขีดจำกัด/ลบ; FAIL ไม่มีmax-feedback |
| B12 | ทั้ง7หมวด: reloadหลังเลือกเหลือ2 | checkedกลับ0ทุกหมวด | FAIL selection persistence |
| B13 | liabilityเลือก2แล้วกดCompareและล้าง | Compareลิงก์ไม่navigate; ล้างคืน0และbarหาย | FAIL navigation / PASS clear |
| D01 | เปิด /plans/{category}-01 ถึง -05 ทั้ง 7 หมวด รวม 35 URLs | H1 และข้อมูล 6 ช่องต่อหน้า render; มี source anchor | PASS เฉพาะ render |
| D02 | ปุ่มสนใจแผนใน detail | ไม่มี control; มีลิงก์ Compare/กลับเลือกแผนแทน | FAIL missing feature |
| D03 | ทั้ง35detail: กดกลับรายการแผน / เพิ่มเพื่อเปรียบเทียบ / เลือกแผนอื่นก่อน | 105clicksทั้งหมดอยู่pathเดิม; sourceComparelinkสร้างqueryหนึ่งIDแทนmerge | FAIL navigation / SOURCE selection reset |
| D04 | 35 แผนใช้ภาพเดียวกัน / generic eligibility และ exclusions | ความแตกต่างจริงของแผนไม่ปรากฏ; source link ไม่ได้แปลว่าตรวจตัวเลขแล้ว | FAIL content quality |
| C01 | เปิด Compare คู่ -01/-02 ทั้ง 7 หมวด | ตาราง render 7 หมวด; ความถูกต้องข้อมูลดู §4 | PASS render / FAIL semantics |
| C02 | health01/02 เปิด/ปิด differences-only | ซ่อนค่าที่เท่ากันและแสดงค่าที่ต่างตาม raw values | PASS กลไกปัจจุบัน; ไม่ผ่านความหมายทางประกัน |
| C03 | เพิ่ม health05 ด้วย select+เพิ่ม | 3 columns; URL อัปเดต | PASS |
| C04 | Browser back หลังเพิ่ม; reload | คืนคู่เดิมจาก URL | PASS |
| C05 | ลบ Essential จากคู่ | เหลือ 1 แผน ชื่อแสดง health-01; ไม่มีคำอธิบายว่าต้องเพิ่มอีกแผน | FAIL |
| C06 | เปิด query หนึ่ง ID โดยตรง | ซ้ำ C05; ไม่มี alert ขั้นต่ำ 2 แผน | FAIL |
| C07 | สนใจแผน / คุยผู้เชี่ยวชาญจาก Compare | ไม่มี CTA เฉพาะแผน/selection; มีแต่ Chat ลอย | FAIL missing feature |
| C08 | Compare ไม่มี query | ไม่ใช้ selection กลาง จาก source | SOURCE |
| C09 | Compareไม่มีหมวด / หมวดbad / mixedIDsผ่านURLตรง | แสดงcontrolledalert; mixedแสดงrawIDsและยังให้เพิ่มแผน | PASS guard / FAIL recovery UX |
| D05 | /plans/not-a-plan | controllednotfoundพร้อมกลับBrowse | PASS render; recoverylinkยังติดnavigation |
| K06 | /broker/leads/not-a-lead | ไม่พบคำขอและลิงก์Dashboard | PASS unknown render; ไม่หักล้างvalidleadFAIL |
| A01 | เปิด/ปิด Chat ด้วยปุ่ม | panel เปิดและปิด | PASS |
| A02 | Escape ขณะ focus input | panel ยังเปิด | FAIL |
| A03 | เปิด Chat ตรวจ focus | focus ไม่ย้ายเข้า panel; source ไม่มี focus management | FAIL |
| A04 | ส่งคำถาม / quick compare / quick budget | ส่ง mock ได้เมื่อ context ถูก; quick budget ไม่ยืนยัน/บันทึกงบจากข้อความ | PARTIAL |
| A05 | เปลี่ยน Account health→motor ขณะมี health selection; ส่งใหม่ | “ไม่พบแผนที่เลือก”; input ถูกล้าง; ไม่มี retry หรือ repair action | FAIL |
| A06 | คืน Account เป็น health budget20000; ส่งจนสะสม 12 messages แล้วส่งต่อ | รอบสนทนาที่ 7 ถูกปฏิเสธ; retry ยัง error เพราะ client ส่ง 13 messages; ยืนยันซ้ำสองครั้ง | FAIL |
| A07 | AI response มี comparison/suggestions | UI ไม่ render comparison link/card; suggestions แอบรวมเข้า selection | SOURCE + B08 |
| H01 | quick “คุยผู้เชี่ยวชาญ” | เปิดฟอร์ม handoff | PASS เปิดฟอร์ม |
| H02 | ตรวจ summary ก่อนส่ง | ไม่เห็น category/budget/ชื่อแผนที่ส่งครบ; ไม่มี preview ที่แก้ครบ | FAIL |
| H03 | ยืนยันโดยไม่ consent | ไม่สร้าง lead แต่ error รวมไม่ผูก field | PASS validation ขั้นต้น / FAIL UX |
| H04 | ชื่อ V2 QA + needs/คำถามตัวอย่าง + consent + confirm | Broker มี 1 lead; form หาย ไม่มี success/status/link ให้ผู้ใช้ | PASS creation / FAIL confirmation |
| H05 | double confirm / ส่งซ้ำ active lead | source มี guard แต่ไม่ส่ง existing ID กลับ; runtime duplicate ยังไม่ยืนยัน | SOURCE / NOT VERIFIED |
| H06 | score 50/70/100, offer dismissal/reopen | score hardcoded50; CTA interest/auto-offer ไม่ครบ | SOURCE / FAIL missing controls |
| K01 | Broker direct /broker หลังสร้าง lead | initial 0→1; พบ React hydration418 | FAIL hydration; PASS list หลัง hydrate |
| K02 | กดแถว V2 QA | ไม่ navigate; Link error | FAIL |
| K03 | เปิด valid lead URL โดยตรง | “ไม่พบคำขอ” ทั้งที่ lead อยู่ใน Dashboard | FAIL release blocker |
| K04 | รับเรื่อง/เริ่มสนทนา/จบ/เลือก outcome/บันทึก note/reload timer | ไปไม่ถึง controls เพราะ K03; ห้ามนับว่า E2E ผ่าน | BLOCKED |
| K05 | timer, call history, full summary/transcript | source ไม่แสดง timer/history/needs/questions/transcript ครบ | SOURCE |
| P01 | Account ชื่อ/หมวด/งบ แล้ว save/reload | ชื่อ V2 Profile และหมวด persist | PASS persistence เฉพาะค่า valid |
| P02 | Account ใส่งบ -1 แล้ว save | แจ้งบันทึกแล้ว แต่ reload กลายเป็น0 โดยไม่ error | FAIL |
| P03 | Account หลังมี lead | มีแค่จำนวนคำขอ ไม่มีรายการ/status/detail | FAIL missing feature |
| P04 | Account reset | native confirmation ทำให้ CUA tab timeout; ไม่ยืนยัน cancel/confirm | BLOCKED เครื่องมือ ไม่ใช่ข้อพิสูจน์ว่า reset app ค้าง |
| P05 | reset implementation | window.confirm แทน planned AlertDialog; ไม่มี toast ตามสเปก | SOURCE |
| I01 | My Insurance 4 policies | motorใกล้ต่ออายุ; health/lifeใช้งาน; accidentหมดอายุ; วันที่ พ.ศ. | PASS ณ demo clock |
| I02 | กดดูรายละเอียดทั้ง 4 policies | URL ยังคง /my-insurance; Link error | FAIL |
| I03 | policy detail/renewal help | source ลิงก์ไป catalog ไม่ใช่รายละเอียด policy; ไม่มี renewal CTA/context | SOURCE / missing feature ตาม v1 |
| I04 | life label “ต่ออายุ” ทุกปี / เบี้ยเริ่มต้นใน policy | ไม่แยกวันชำระเบี้ยกับสิ้นสุดสัญญา; catalog premium ไม่ใช่ policy premium | FAIL content model |

## 3. Responsive / accessibility / reference

ตรวจ DOM outer width ที่ 360×844, 390×844, 1440×900 และ 1920×900 สำหรับ Home/Browse/Compare/Account/My Insurance/Broker. ทุกหน้าที่กล่าวมาไม่พบ outer overflow ยกเว้น Compare: scrollWidth407 ที่ viewport360/390. ภาพหน้าจอ Compare390 แสดง select และปุ่มเพิ่มล้นด้านขวา; overflow นี้อยู่นอก table ซึ่งผิด acceptance

การพยายามตรวจ1920×1080ในBrowser sessionใหม่พบว่าviewportจริงยัง825×736หลังset จึงไม่นับว่าผ่าน1920×1080. ภาพCompareที่captureรอบใหม่นี้เป็น825px ไม่ใช่mobileevidence. ห้ามถือว่า1920×900แทน1080. Full keyboard traversal, screen reader, contrastทุกคู่สี และ text zoom200% ยัง NOT VERIFIED. Quick Chat buttonsสูง40pxจากsourceต่ำกว่า44px. อย่าใช้ขนาดcheckbox20pxตัดสินhit targetโดยไม่วัดlabelwrapper. Contact-window selectและchatinputไม่มีexplicitaccessiblelabelที่เหมาะสมจากsource; focus/Escape FAILตามA02/A03

Figma URL ปัจจุบันเปิดใน IAB แล้วแสดง “Want to check out this file? Sign up or Log in”. จึง **ยังเทียบภาพกับ latest Figma ไม่ได้**. ใช้ mapping ใน plan.md (Home3:221, Browse3:197, Compare3:145, My Insurance3:6) เป็นเกณฑ์รายการองค์ประกอบเท่านั้น ไม่อ้าง pixel match. Apple token/Gen Z tone ยังคงเป็น direction; V2 ต้องรักษาโครง draft ไม่ redesign ตามอำเภอใจ

## 4. Data findings ที่ยืนยันได้

อ่านcatalogด้วยNodeแบบread-only: 35plans, 175coveragecells, 62ค่าnull, 6recordsใช้premium0, 14sourceURLs และ1imagepath. จำนวนnullไม่เท่ากับจำนวนที่ไม่คุ้มครอง; เป็นสิ่งที่ต้องclassify/verify. ไม่ตีความ14URLsว่า14ผลิตภัณฑ์ เพราะcategorypageหนึ่งหน้าอาจครอบคลุมหลายแผน

| ID | สิ่งที่เว็บแสดง | ปัญหา / หลักฐาน research |
|---|---|---|
| F01 | Essential10m บาท/ปี | official เป็นวงเงินต่อโรค; เบี้ยเริ่มต้นไม่ผูกกับแผนวงเงินสูงสุด [R02] |
| F02 | Health สุขใจ S/M/L annualLimit | official ระบุ IPD ต่อการเข้าพักรักษา [R03] |
| F03 | พ.ร.บ. thirdPartyProperty80000 | official80000เป็นค่ารักษาผู้ประสบภัย ไม่ใช่ทรัพย์สิน [R04] |
| F04 | Motor/Life header ขอใบเสนอราคา แต่แถวเบี้ย0บาท/ปี | null ถูกเข้ารหัสเป็น0; sorting/filter/AI เสี่ยงตีความว่าฟรี |
| F05 | Life99ปี; อายุเริ่มต้น0.082ปี | ถึงอายุ99ไม่เท่าระยะคุ้มครอง99ปี; 30วันไม่ควรเป็นเศษปี [R06–07] |
| F06 | Happy Return มี highlight บำนาญ55/60/65 | คนละลักษณะผลิตภัณฑ์; เป็น whole life พร้อมเงินคืน [R07] |
| F07 | PA All In One3855 พร้อม medical150000 | ผสมราคาSกับmedicalL; ต้องผูกเดียวกัน [R10] |
| F08 | PA จิ๋ว อายุ0 / PAข้อมูลหลายช่องnull | อายุและผลประโยชน์ต้องเติมจากตารางแผนจริง [R11]; ไม่เติมเดา |
| F09 | travel annual1564บาท/ทริป | period ถูกบังคับtripทั้งหมวด; annualต้องปี [R13] |
| F10 | domestic medical1m และชื่อค่ารักษาต่างประเทศ | official medicalสูงสุด100k; 1mเป็นaccidentaldeath [R14] |
| F11 | Property5รายการและLiability5รายการดูเป็นต่างผลิตภัณฑ์ | มาจากแพ็ก Sabuydeeเดียว; ยังไม่มีหลักฐานชื่อ/variantที่แยกจริง [R16] |
| F12 | Property30m/contents2m กับ starting1176 | เอาสูงสุดมาผูกกับราคาเริ่มต้นโดยไม่ยืนยัน quote scenario |
| F13 | flood20000; deductible0 | วงเงินnaturalperilsรวม ไม่ใช่floodแยก; deductible0ไม่มีหลักฐานพอ [R16] |
| F14 | eligibility/exclusionsเหมือนกันทุกแผน | สร้าง false equality ใน differences-only; ไม่สะท้อนอายุ/อาชีพ/riders/waiting |
| F15 | source.kind official และ updatedAt | URL/วันที่เก็บไม่รับรองว่าแต่ละfieldตรวจแล้ว; ต้อง provenance รายข้อ |

## 5. API และ automated checks

POST /api/compare: valid200 PASS; 1ID400 PASS; 4IDs400 PASS; duplicate400 DUPLICATE_IDS PASS; unknown404 PLAN_NOT_FOUND PASS; mixed400 MIXED_CATEGORY PASS; unknown category400 PASS; null400 PASS. PASS เหล่านี้เป็น validation ไม่ใช่รับรองตัวเลขที่ตอบ

POST /api/chat (mock) ที่ทดสอบ:

| Input case | Observed | Result |
|---|---|---|
| valid health context | 200, health01/02 suggestions | PASS |
| null / empty object | 200แทน invalid | FAIL |
| system / developer client role | 400 | PASS |
| 2001chars message / 13messages | 400 | PASS |
| budget string abc | 200 | FAIL |
| budget -1 พร้อมคำขอ handoff | 200 เพราะ early return | FAIL |
| selected4 / duplicate IDs | 200 truncate/ยอมรับ | FAIL |
| unknown selectedID | 400 | PASS |
| goalsเป็นstring | 200 | FAIL |
| 6messages ×2000ตัวอักษรไทย รวม12000chars แต่เกิน32KB UTF8 | 200 | FAIL byte limit |

11Sep rerun: `npm test` 11/11 PASS; `npx tsc --noEmit --incremental false` PASS; `npm run lint` 0errors/3warnings (img ใน Home/Browse/Detail). ไม่รัน build/deployใหม่ในงาน audit. Workspace ไม่มี .git จึงไม่มี diff baseline ยืนยันประวัติก่อนหน้า; การเปลี่ยนของงานนี้จำกัดเอกสารและ UI test state

Tests เดิม T03 กำหนด10mต่อปีที่ผิดเป็น expected; T01นับ5แผนต่อหมวดไม่พิสูจน์ว่า5ผลิตภัณฑ์จริง. ต้องเปลี่ยน oracle เป็นหลักฐานกรมธรรม์ก่อนเรียก data tests ว่า pass

## 6. Live AI / state review ที่ยังไม่ใช่ live test

SOURCE: live route ไม่มี structured schema enforcement/tools loop; กรอง invalid model IDsเงียบ; ไม่ validate nested outputครบ; catalogส่งให้modelไม่มี premiumNote/provenance/scenario; UIบอกmockตลอด. มี timeout20s และ handling429 แต่ UIไม่มีretry/mock switch. การอ่าน REST output_text ต้องตรวจ official API shapeก่อนแก้. ไม่มี successful live call จึง live=NOT VERIFIED; ห้ามใช้mockแทน live evidence

SOURCE: safeLoad ตรวจ envelopeแต่ไม่ตรวจ nestedprofile/lead/messages; hydrationอ่านstorageกับserverseedไม่ตรง; makeSummaryคืน arraysร่วมและeditedByUser=false/sourceMode=mockคงที่. ต้องทดสอบ mutationหลังhandoffจริงแทน testที่แค่สร้างsummary. Broker params.id แบบ synchronousเป็นสาเหตุที่สงสัยของ K03 ไม่ใช่ rootcauseที่พิสูจน์แล้ว

## 7. Release-blocking list / retest

Critical: N01–N04,Navigation; K03 validlead; F01–F13ข้อมูลผิด. High: B08,C05,A05–06,H02–06,P02–03, livevalidation/state. Medium: mobileoverflow, focus/Escape/44px, policy semantics, reference match

ต้องกลับมาทดสอบ controlsที่ถูกblockหรือFAILหลังแก้: Broker accept/start/end/reload/outcomes/history, duplicate handoff, resetcancel/confirm, crosscategorycancel/confirm, selectionrefresh, internalnavigationทั้งหมด, sourceanchorsทุก35รายการเปิดปลายทางจริง, invalidroute recovery, live429/timeout/refusal/schema errors, storage quota/corruption, text200%/screenreader/latest Figma. Sourceanchorsตรวจhrefครบแต่ไม่ได้คลิกเปิดปลายทางทุก35ตัว; researchเปิดแหล่งทางการแยกตามรายการอ้างอิง. งานauditรอบนี้ไม่แก้blockerเพื่อให้ทดสอบผ่าน และไม่กล่าวว่าทุกinteractionเสร็จสมบูรณ์

Browser error excerpt ก่อน P0: `TypeError: e is not a function` ที่ `/_next/static/chunks/link-CRuK2n6H.js:2:11802`, `React.startTransition`. หลังเปลี่ยน native anchor Home CTA `/`→`/browse` ผ่านและ error log ว่าง; ต้อง replayทุกrouteในclean sessionก่อน mark V01–V02. ยืนยันซ้ำ My Insurance4links เวลา15:40UTC11Sep (pre-P0). Valid lead test ID เดิม `224eae84-3657-4bc3-826c-132fc4bb9e6b` ใช้เป็น locatorเท่านั้น ไม่ใช่ production fixture; หลัง P0 browserสะอาดยังสร้างvalid leadไม่ได้เพราะ historyถึง12-message guard จึง V03 remains BLOCKED.
