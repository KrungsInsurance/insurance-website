# Insurance Website MVP — Implementation Plan v1

สถานะ: READY FOR IMPLEMENTATION • วันที่: 2026-09-11 • ผู้เขียนโค้ดเป้าหมาย: GPT-5.6 Luna

## 0. เริ่มอ่านตรงนี้

เป้าหมาย: เว็บเดโมภาษาไทยที่นำเสนอได้ตั้งแต่ค้นหาประกัน → เปรียบเทียบ → คุย AI → ขอคุยผู้เชี่ยวชาญ → Broker รับเรื่อง → บันทึกผลการคุย

เอกสารนี้เป็นสเปกสำหรับลงมือทำ พร้อมสถานะจริงของแต่ละ phase ใน §12

อ่านครั้งแรก: Rule.md → §1–4 → phase ที่จะทำใน §12 → contract ที่ phase อ้างถึง → test ใน §13
ไม่ต้องอ่าน DESIGN.md ทั้งไฟล์หรือค้น Miro ทั้งบอร์ดซ้ำทุกเทิร์น ใช้หัวข้อและ deep link ที่เกี่ยวข้อง

### กติกาส่งงานให้ Luna

- ทำ phase ตาม dependency ทีละช่วง ปิด acceptance ของช่วงนั้นก่อนขยายงาน
- อย่าเปลี่ยนชื่อ route, ID, type หรือ response shape ที่กำหนดเอง
- แก้ไฟล์จริง ใช้ของเดิมก่อน ไม่เขียนตัวเลือกหลายแบบให้ผู้ใช้เลือก
- ย่อโค้ดและคำอธิบายได้ แต่ห้ามข้าม requirement หรือ test ที่จับพฤติกรรมจริง
- ถ้า API ใช้ไม่ได้ ให้จบ flow ใน mock mode พร้อมสถานะชัดเจน และลง integration ที่ยังไม่ผ่านเป็น BLOCKED
- ถ้าพบข้อขัดแย้งสำคัญ บอกจุดขัดแย้งและทำส่วนที่ไม่ขึ้นต่อข้อมูลนั้นต่อ
- ก่อน mark phase เป็น `DONE`: deploy local production หลัง build แล้วตรวจ browser flow ของ phase นั้น; แก้ตาราง §12 ด้วย command, ผลตรวจจริง และ next step ไม่รายงานว่าเสร็จจากการสร้างไฟล์อย่างเดียว

คำสั่งย้ำ 5 ข้อ: **ข้อมูลชุดเดียว / Compare ประเภทเดียว / Secret อยู่ server / ไม่ส่งต่อซ้ำ / Mock ต้องเห็นว่า mock**

เหตุผลด้านโมเดล: เอกสาร [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) ระบุว่าออกแบบสำหรับงานที่คำนึงถึงต้นทุน แต่ไม่ได้รับประกันว่าจะเข้าใจสเปกใดได้ครบ การแบ่ง phase, contract, ตัวอย่าง และ acceptance ในไฟล์นี้เป็นวิธีออกแบบงานของผู้วางแผน ไม่ใช่ข้ออ้างว่าเข้าใจขีดจำกัดภายในของ Luna แน่นอน ไม่รับประกันเปอร์เซ็นต์ประหยัด token

## 1. Source of truth และขอบเขต

| แหล่ง | หน้าที่ |
| --- | --- |
| Rule.md | กติกางานและขอบเขต Demo |
| [Miro](https://miro.com/app/board/uXjVHoKovIc=/) | flow, ลำดับงาน, การเปลี่ยนแผนที่ใช้ร่วมกัน |
| plan.md v1 | implementation contract และ acceptance ที่ขยายจาก Miro |
| [Figma](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=0-1) | โครงภาพต้นฉบับ |
| DESIGN.md | Apple visual language และ tokens |

เปลี่ยน flow/phase/ขอบเขต: แก้ส่วนแผน v1 ใน Miro และหัวข้อที่เกี่ยวข้องในไฟล์นี้ในรอบเดียวกัน พร้อม revision note ถ้าแก้ Miro ไม่ได้ ให้ลง `SYNC PENDING` ห้ามอ้างว่าซิงก์แล้ว
ข้อกำหนดที่เพิ่มใน §2–13 เป็น **ค่าเริ่มต้นที่ผู้วางแผนตัดสินใจสำหรับ Demo** ไม่ใช่ข้อความเดิมจาก Miro ทุกข้อ ใช้ต่อได้จนกว่าผู้ใช้แก้

### ต้องมีใน MVP

Home, Browse, รายละเอียดแผน, Compare 3 ช่อง, My Insurance, My Account, AI Chat, customer summary, Compare tool/API, Broker dashboard, Broker call simulation, interest-based offer และ demo reset

### ขอบเขตจำลอง

- ลูกค้าหนึ่งคนใน browser นี้; สลับมุมมอง Customer/Broker ผ่านแถบโหมดสาธิต
- กรมธรรม์ ราคา บริษัท และลูกค้าเป็น fixture; ไม่มีการออกกรมธรรม์ ชำระเงินจริง โทรจริง หรือส่งข้อความออกนอกแอป
- เก็บ demo state ใน browser เดียว ไม่ใช่บัญชีหรือ CRM ข้ามอุปกรณ์
- ไม่มี login จริง, database, upload เอกสาร, OCR, payment, email, SMS, voice AI, CRM connector หรือ analytics ภายนอก
- OpenAI Chat มีทั้ง live adapter และ mock adapter; live acceptance แยกจากความพร้อมของ demo
- เปลี่ยนเป็นระบบ production เป็นอีกขอบเขตหนึ่ง ไม่ใส่ระบบเผื่อไว้

## 2. สิ่งที่ตรวจจาก Figma และการใช้แบบ

| Frame ที่อ่าน | Node | ใช้กับ | สิ่งที่เห็นจริง |
| --- | --- | --- | --- |
| Slide 16:9 - 54 | [3:221](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=3-221) | Home | nav 5 รายการ, hero ภาพใหญ่, ข้อความเลือกประกันที่ใช่, CTA เริ่มค้นหา, section รู้หรือไม่ |
| Slide 16:9 - 51 | [3:6](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=3-6) | My Insurance | หัวข้อประกันของฉัน, การ์ด 2 คอลัมน์, วันต่ออายุ, ปุ่มช่วยเหลือมุมล่าง |
| Slide 16:9 - 52 | [3:145](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=3-145) | Compare | heading เปรียบเทียบสุขภาพ, 3 plan selectors, ภาพแผน, ราคา, CTA Chat กับ Specialist |
| Slide 16:9 - 53 | [3:197](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=3-197) | Browse | หัวข้อประกัน, แถวหมวดหมู่, พื้นที่ด้านล่างยังว่าง |
| Chat Overlay, Chat Overlay_1, Offer, Assist | ตรวจชื่อ layer แล้ว | Chat/offer | มี overlay แชทและ offer แยก; ยังไม่ได้ดึงรายละเอียดครบทุก layer |

Draft 51/52 มีขนาด 546×308, 54 คือ 546×307 และ 53 คือ 546×2098 ณ ตอนตรวจ ใช้เป็นสัดส่วน/องค์ประกอบ ไม่ใช่ CSS pixel ของเว็บจริง ห้ามยืดทุกหน้าเป็น 16:9

ก่อน phase UI: ตรวจ frame ที่เกี่ยวข้องและบันทึก mapping ถ้า Figma เปลี่ยน ไม่ต้องแก้ Figma เพื่อพัฒนาเว็บ
รูปและราคาใน draft เป็นภาพอ้างอิง ไม่ใช่ฐานข้อมูลแผนจริง โดยเฉพาะราคา 69,900 และโลโก้ที่ปรากฏซ้ำ

### Visual contract ที่ใช้ลงมือ

- Desktop content max 1440px, gutter 32px; mobile 20px; section spacing desktop 80px / mobile 48px
- สีจาก DESIGN.md: white #ffffff, secondary #f5f5f7, ink #1d1d1f, action #0066cc, focus #0071e3; status ใช้ข้อความ/ไอคอนร่วมด้วย
- Font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; รองรับ Thai fallback จริง body 17px/1.6, label 14px, heading 600
- Hero 56px desktop, 40px tablet, 32px mobile; ไทย letter-spacing 0; ห้ามตัวอักษรชนกัน
- Nav สูงประมาณ 56px พื้นเทาอ่อนตาม Figma, active underline/aria-current; mobile ย่อเป็น menu ที่ใช้ keyboard ได้
- Primary button สีน้ำเงิน pill, hit target ≥44px; card radius 18px; input min-height 44px; focus ring ชัด
- Preserve Figma silhouette แล้วใช้ Apple tokens เก็บรายละเอียด ไม่คัดลอก outlined headline/black CTA ที่ขัดภาษาภาพหลักแบบตายตัว
- Compare เป็น working page: selectors และแผนต้องเห็นเร็ว ไม่มี hero กินทั้งจอ; 3 คอลัมน์ desktop
- Mobile Compare ใช้ตารางเลื่อนแนวนอนเฉพาะ container, หัวแถว sticky; หน้าเว็บส่วนอื่นต้องไม่ล้นแนวนอน
- My Insurance: 2 คอลัมน์ desktop, 1 mobile; Browse: 3 desktop, 2 tablet, 1 mobile
- Chat: sheet ด้านขวากว้าง 400px desktop; เต็มจอ mobile; เปิด/ปิดคืน focus และไม่ทับ compare bar
- z-index: header 10, compare bar 20, chat launcher 30, modal/sheet 40, feedback 50
- ใช้ภาพ hero 1 ภาพ + ภาพหมวดที่มีเหตุผล ใช้ asset ที่ให้มาถ้าแยกภาพได้; ถ้าไม่ได้ใช้ภาพถูกสิทธิ์หรือสร้างภาพทดแทน ไม่แปะ screenshot UI เป็นหน้าเว็บ
- ไม่มี decorative motion; feedback ที่จำเป็น ≤200ms, transform/opacity, reduced-motion; ไม่มี loading ปลอมเพื่อโชว์ animation
- ป้ายเล็ก “โหมดสาธิต · ข้อมูลตัวอย่าง” อยู่ทุกหน้า แยกจากเนื้อหาการขาย ไม่ใส่ implementation jargon กลาง product UI

## 3. Architecture ที่เลือก

ใช้ Sites capability path (หลาย route + server API), portable profile สำหรับ Windows; React + TypeScript + Vinext starter ที่ Sites ให้มา ใช้ routing, Tailwind และ accessible primitives ที่ติดตั้งมาแล้ว ไม่เพิ่ม React Router/Redux/Express/ORM

ก่อนเริ่ม P0 ให้อ่าน sites-building skill และ portable setup รุ่นที่ติดตั้งจริง ใช้ script path จาก skill ห้ามเดาหรือฝังเลขเวอร์ชัน plugin ในโค้ดโปรเจกต์
โฟลเดอร์นี้มีเอกสารแล้ว: รักษา AGENTS.md, Rule.md, plan.md, DESIGN.md และตรวจว่า initializer ไม่ทับไฟล์เหล่านี้ ถ้า initializer ต้องการโฟลเดอร์ว่าง ให้เตรียม starter ใน temporary folder แล้วนำเข้าเฉพาะไฟล์ที่ไม่ชน

ตัดสินใจชัดเจน:

- Client state: React Context + reducer ตัวเดียวสำหรับ demo; page filter ใช้ URL query; ไม่มี state library เพิ่ม
- Data: typed fixtures + pure domain functions ใช้ร่วมกัน client/server
- Server: route handlers สำหรับ Compare และ Chat; Worker-compatible ESM; ไม่เก็บ state ใน server memory
- Persistence: localStorage key เดียว `insurance-demo:v1`; ไม่มีข้อมูลจริง; restore หลัง mount เพื่อไม่ให้ hydration mismatch
- Chat provider: env `CHAT_PROVIDER=mock|openai` ค่าเริ่มต้น mock; `OPENAI_API_KEY` server-only; `OPENAI_MODEL` ต้องระบุเมื่อ live
- Luna เป็นผู้เขียนโค้ด ไม่ได้แปลว่าต้องใช้ Luna เป็นโมเดลในเว็บ; ค่าเริ่มต้นเสนอ `gpt-5.6-luna` สำหรับ live demo หากบัญชีใช้ได้
- Presentation clock คงที่ `2026-09-11` (Asia/Bangkok) เพื่อให้วันต่ออายุและสถานะเดโมซ้ำได้ ข้อความวันที่เป็น พ.ศ. ตาม locale
- ราคาเก็บจำนวนเต็มบาท ห้ามแปลงปีเป็นเดือน/เฉลี่ยค่าเบี้ยโดยอัตโนมัติ

### โครงไฟล์เป้าหมาย (ไม่สร้าง placeholder ทุกไฟล์พร้อมกัน)

```text
app/layout.tsx, app/globals.css, app/page.tsx
app/browse/page.tsx, app/plans/[id]/page.tsx
app/compare/page.tsx, app/my-insurance/page.tsx, app/account/page.tsx
app/broker/page.tsx, app/broker/leads/[id]/page.tsx
app/api/compare/route.ts, app/api/chat/route.ts
components/app-shell.tsx, components/plan-card.tsx
components/compare-table.tsx, components/chat-panel.tsx
components/demo-provider.tsx, components/handoff-dialog.tsx
lib/types.ts, lib/catalog.ts, lib/demo-seed.ts
lib/compare.ts, lib/lead.ts, lib/chat.ts, lib/demo-state.ts
public/images/*, public/favicon.svg
tests/domain.test.ts, tests/flow.spec.ts
.env.example, README.md
```

ใช้ primitives ที่ starter มีใน components/ui โดยตรง ไม่เพิ่ม wrapper ทุกชิ้น แยก module เพิ่มเมื่อมีหน้าที่จริง; domain functions ไม่ import React หรือ browser globals

## 4. End-to-end flow

### Customer — เส้นหลักสำหรับนำเสนอ

1. Reset demo → Home → “เริ่มค้นหาประกัน” → Browse
2. เลือกสุขภาพ → กรองงบรายปี → ดูรายละเอียด → เลือก 2–3 แผน → Compare
3. เปลี่ยนหนึ่งแผน/ดูความต่าง → เปิด Chat พร้อม context แผนที่กำลังเทียบ
4. AI ถามความต้องการที่ยังไม่ทราบ → อธิบายจาก fixture → เรียก Compare tool ถ้าต้องเทียบ
5. แสดง offer เมื่อถึงเกณฑ์ หรือผู้ใช้กด “คุยกับผู้เชี่ยวชาญ” ได้เองทุกเวลา
6. Preview summary → ตรวจ/แก้ชื่อแสดงและช่วงเวลาสะดวก → ยินยอมส่งข้อมูลจำลอง → ยืนยัน
7. สร้าง lead หนึ่งรายการ → แสดง “ส่งคำขอแล้ว” + สถานะติดตามใน My Account
8. ผู้ใช้ไป My Insurance ดูกรมธรรม์ตัวอย่างได้โดยไม่ต้องซื้อใหม่

### Broker — ต่อจาก lead เดียวกัน

1. สลับโหมดสาธิตเป็น Broker → Dashboard เห็น lead ใหม่
2. เปิด lead → ดูความต้องการ, แผนที่เทียบ, คำถามค้าง, transcript ที่ส่งมาจนถึงจุดยืนยัน
3. “รับเรื่อง” → “เริ่มสนทนาจำลอง” → call timer และ notes
4. จบการคุย: สนใจต่อ / นัดติดตาม / ไม่สนใจ → บันทึก summary และ next action
5. กลับ My Account เห็นสถานะเดียวกัน ไม่มีการออกกรมธรรม์หรือโทรออกจริง

### ทางแยกที่ต้องรองรับ

- ไม่เลือกแผน: Compare ให้เลือกหมวดและเพิ่มแผน ไม่แสดงตารางว่างเฉย ๆ
- มี 1 แผน: แสดงคอลัมน์นั้น + ช่องเพิ่ม อีก action เทียบยังไม่พร้อมจนมี ≥2
- ข้ามหมวด: ไม่แอบล้าง selection; ถามยืนยันเปลี่ยนชุด หรือยกเลิก
- ไม่มีผลลัพธ์: ล้าง filter ได้ในหนึ่งคลิก
- ปิด Chat แล้วเปิดใหม่: ข้อความยังอยู่ภายใน demo session
- ปฏิเสธ offer: ไม่สร้าง lead, ยัง Browse/Chat ต่อได้; ไม่ pop-up ซ้ำเองใน session
- ข้อมูลไม่พอ: AI ถามหนึ่งข้อ ไม่เดาว่าคุ้มครอง/อนุมัติได้
- Live API error: error ข้างข้อความ + Retry + “ใช้บทสนทนาตัวอย่าง”; ไม่เปลี่ยนเป็น mock เงียบ ๆ
- Storage ใช้ไม่ได้: ทำงานใน memory ต่อ พร้อมแจ้งว่าปิดหน้าแล้วข้อมูลไม่ถูกเก็บ

## 5. Route และ screen specification

| Route / ID | เนื้อหาหลัก | Actions และผลลัพธ์ |
| --- | --- | --- |
| `/` S01 | Nav, hero ตาม 54, 1 learning section “รู้หรือไม่”, หมวดที่ไปต่อได้ | CTA ไป /browse; nav ไป 4 หน้าตาม draft; learning เป็นข้อมูลทั่วไปไม่กล่าวอ้างผลิตภัณฑ์จริง |
| `/browse` S02 | แถวหมวด, search, budget, sort, count, cards | query `category,q,maxPremium,sort`; ดูแผน → /plans/:id; checkbox เพิ่ม compare; default หมวด health |
| `/plans/:id` S03 | ชื่อ/บริษัทตัวอย่าง, ภาพ, เบี้ยและรอบ, coverage, waiting/exclusions | เปรียบเทียบ, ถาม AI, คุยผู้เชี่ยวชาญ; unknown ID → not found + กลับ Browse |
| `/compare` S04 | หมวด, 3 selectors, ภาพ/ราคา, ตาราง field ของหมวด, toggle เฉพาะต่างกัน | query `category,ids`; สลับ/ลบแผน, เพิ่ม, เปิด Chat; table ใช้ข้อมูลจาก contract §7 |
| `/my-insurance` S05 | การ์ดกรมธรรม์ตัวอย่าง 4 ใบ, บริษัท/ชนิด, วันต่ออายุ, status | เปิดรายละเอียดใน sheet; ถามเรื่องแผนนี้ผ่าน Chat; ต่ออายุ = ขอคุยผู้เชี่ยวชาญแบบจำลอง |
| `/account` S06 | demo identity, preferences, คำขอผู้เชี่ยวชาญ, การเก็บข้อมูลเดโม | แก้ชื่อ/งบ/หมวด, บันทึก, ดู lead status, reset ด้วย confirmation; ไม่ขอเลขบัตร/สุขภาพจริง |
| Global S07 | ปุ่มช่วยเหลือ, Chat panel, product suggestions, offer | เปิดจากทุก customer route; selected IDs ส่งเป็น context; หน้าตาอิง overlay |
| Handoff S08 | summary preview, demo display name, contact window, consent | confirm สร้าง/คืน lead ตาม §9; cancel ไม่สร้าง lead; error ข้าง field |
| `/broker` S09 | lead count ตาม status, filter, list, last update | default newest first; เปิด lead; empty state “ยังไม่มีคำขอ” + สลับกลับ Customer |
| `/broker/leads/:id` S10 | summary, plans, transcript snapshot, notes, timeline, call controls | state machine §9; unknown ID → not found; refresh ระหว่าง call คำนวณ timer จาก startedAt |

Nav label: Home / My ประกัน / เปรียบเทียบประกัน / Browse ประกัน / My Account ตาม Figma; browser titles ใช้ไทยอ่านง่าย
Browse query defaults: category=health, q='', maxPremium ไม่กำหนด, sort=price-asc; sort รองรับ price-asc/price-desc/name เท่านั้น กรอง q แบบ trim + case-insensitive substring ของ name/insurer/highlights; ใช้ budget แบบ inclusive; ราคาเท่ากันเรียง ID เพื่อผลคงที่
Unknown category/sort ใน Browse คืน default พร้อมข้อความสั้น; invalid/negative budget ไม่ใช้ filter และแสดง field error; ไม่ทำ silent fallback ใน Compare ซึ่งมี strict contract แยก
แถบ Presenter: Customer/Broker, provider mode, Reset demo; แยกจาก nav ลูกค้า การสลับ role เป็น simulation ไม่ใช่ authentication

## 6. Data contract และ fixtures

### Catalog v1

7 หมวดเริ่มต้นสำหรับเดโม; “ครบทุกประเภท” ใน Miro ยังไม่แจกแจงรายการ นี่คือ taxonomy v1 ที่เลือกให้ลงมือได้ ไม่อ้างว่าครอบคลุมตลาดทั้งหมด
หมวดละ **5 แผน** = 35 แผน ทั้ง 5 ต้องมีรายละเอียดสมบูรณ์ใน P1; ไม่ใช้ lorem ipsum

| category | ชื่อ | prefix ID | premiumPeriod | compare fields เฉพาะหมวด (เรียงตามนี้) |
| --- | --- | --- | --- | --- |
| health | สุขภาพ | health-01..05 | year | annualLimit THB, roomPerDay THB/day, opdPerYear THB/year, deductible THB, waitingDays days |
| motor | รถยนต์ | motor-01..05 | year | class text, ownDamageLimit THB, thirdPartyProperty THB, deductible THB, repairType text |
| life | ชีวิต | life-01..05 | year | sumAssured THB, coverageYears years, paymentYears years, minEntryAge years, maxEntryAge years |
| accident | อุบัติเหตุ | accident-01..05 | year | deathBenefit THB, medicalPerAccident THB, disabilityBenefit THB, minEntryAge years, maxEntryAge years |
| travel | เดินทาง | travel-01..05 | trip | medicalAbroad THB, cancellationLimit THB, baggageLimit THB, maxTripDays days, region text |
| property | บ้านและทรัพย์สิน | property-01..05 | year | buildingLimit THB, contentsLimit THB, floodLimit THB, deductible THB, coveredRisks text |
| liability | ความรับผิด | liability-01..05 | year | perOccurrenceLimit THB, aggregateLimit THB/year, deductible THB, territory text, coveredActivity text |

งบใน Browse เปลี่ยน label เป็น “บาท/ทริป” เมื่อ travel; ห้าม sort หรือ compare เบี้ยต่างรอบปนกัน

```ts
type Category = 'health'|'motor'|'life'|'accident'|'travel'|'property'|'liability';
type Plan = {
  id: string; category: Category; name: string; insurer: string;
  premiumTHB: number; premiumPeriod: 'year'|'trip'; image: string;
  highlights: string[]; eligibility: string; exclusions: string[];
  coverage: Record<string, string|number|boolean|null>;
  source: { kind: 'official'|'demo'; label: string; updatedAt: string; url?: string };
  premiumNote?: string;
};
type Field = { key: string; label: string; unit: string|null };
type Policy = {
  id: string; planId: string; policyNumber: string;
  startsOn: string; renewsOn: string; holder: string;
};
type CustomerProfile = {
  id: 'demo-customer'; displayName: string;
  preferredCategory: Category|null; budgetTHB: number|null;
  goals: string[];
  contactWindow: 'morning'|'afternoon'|'evening';
};
```

ทุก plan ต้องมี key ของหมวดครบ; `null` = ไม่ระบุ, `0` = จำนวนศูนย์, `false` = ไม่คุ้มครอง ใช้ข้อความต่างกัน ห้ามเปลี่ยน null เป็น 0 หรือ “ไม่คุ้มครอง”
Common rows ก่อน category fields: บริษัท, เบี้ยตัวอย่าง/รอบ, คุณสมบัติผู้สมัคร, ข้อยกเว้น; ไม่มี global “ดีที่สุด” หรือ badge แนะนำโดยไม่มีเหตุผล
Data validator: ID ไม่ซ้ำ, premium finite ≥0 (รองรับทศนิยมตามราคาเผยแพร่), period ตรง category, image local มีอยู่, coverage keys/type ถูกตาม field definition
ใช้ชื่อผลิตภัณฑ์และบริษัทจากหน้าเว็บทางการเท่านั้น; เบี้ยที่ระบุเป็นราคาเริ่มต้นหรือราคาอ้างอิงตามเงื่อนไข ต้องแสดงหมายเหตุและลิงก์แหล่งข้อมูล

### Fixture หลักที่ต้องใช้เหมือนกันใน UI/API/test

| Health | premiumTHB/year | annualLimit | roomPerDay | opdPerYear | deductible | waitingDays |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| health-01 AXA SmartCare Value | 6700 | 2500000 | 2500 | null | 0 | null |
| health-02 AXA SmartCare Essential | 15680 | 10000000 | null | null | 0 | null |
| health-03 MTL Health สุขใจ แพ็ก S | 25339.5 | 700000 | null | 20000 | null | null |
| health-04 MTL Health สุขใจ แพ็ก M | 27696.5 | 1000000 | null | 20000 | null | null |
| health-05 MTL Health สุขใจ แพ็ก L | 34301.5 | 5000000 | null | 30000 | null | null |

ข้อมูล catalog มาจากหน้าเว็บทางการที่ตรวจเมื่อ 2026-09-11; ราคาเริ่มต้น/ราคาอ้างอิงอาจเปลี่ยนตามอายุ ทุนประกัน รถ และเงื่อนไขรับประกัน เกณฑ์สมัคร/ข้อยกเว้นของทั้ง 5 ใช้ข้อความเดียวกัน เพื่อ test different-only เหลือเฉพาะ field ที่ต่าง
หมวดอื่นใช้ผลิตภัณฑ์จริงและราคาเริ่มต้น/ราคาอ้างอิงตามหน้าเว็บทางการ; รายการที่ต้องคำนวณราคาให้แสดง “ขอใบเสนอราคา” และไม่เดาตัวเลข
Policy seed: motor-01 renewsOn 2026-09-20 (ใกล้ต่ออายุ), health-02 2027-03-01 (active), life-01 2027-09-10 (active), accident-01 2026-09-01 (expired); startsOn ก่อนวันเดโมและวันต่ออายุ
Status จากวันเดโม: diffDays <0 expired; 0..30 renewal-soon; >30 active; คำนวณ date-only ที่เที่ยงคืนอย่างสม่ำเสมอ ไม่ parse locale string

## 7. Compare contract

Single source: `buildComparison(category, ids)` ใน lib/compare.ts ใช้ทั้ง page, API และ AI tool ไม่มีสูตรเทียบซ้ำใน component

- รับ unique IDs 2–3 รายการ ทุกอันต้องมีอยู่ใน category เดียวกัน เรียงผลตามลำดับ request
- UI อนุญาต 0/1 selection เพื่อช่วยเลือก แต่ API ต้อง reject จำนวน <2
- เพิ่มรายการที่ 4 → ไม่เพิ่ม + “เปรียบเทียบได้สูงสุด 3 แผน”; เพิ่ม ID เดิม → ไม่ซ้ำ
- เปลี่ยนหมวดเมื่อมีแผน → confirm เปลี่ยนชุด, confirm แล้วล้าง IDs และ query ของชุดเดิม
- URL เป็น source สำหรับ Compare (`/compare?category=health&ids=health-01,health-02`); browser back/forward ต้องคืนชุดตาม URL ไม่ถูก localStorage เขียนทับ
- เข้า URL ที่ไม่ valid → แจ้งเหตุและปุ่มเริ่มเลือกใหม่ ห้าม silently เปลี่ยน IDs เป็นแผนอื่น
- differencesOnly: ใช้ typed raw values เปรียบเทียบ; null ต่าง 0; arrays ของข้อความ normalize ด้วยลำดับที่นิยามไว้ ไม่เทียบสตริงที่ format แล้ว
- ไม่ score ความเหมาะสม/underwriting; compare แสดงความต่างของข้อมูลเท่านั้น

`POST /api/compare` รับ JSON `{category, planIds}`; success 200:

```json
{
  "category": "health",
  "planIds": ["health-01", "health-02"],
  "plans": ["<Plan>", "<Plan>"],
  "rows": [{"key":"annualLimit","label":"วงเงินต่อปี","unit":"บาท/ปี","values":[1000000,3000000],"different":true}],
  "url": "/compare?category=health&ids=health-01,health-02",
  "dataMode": "demo"
}
```

`plans` เป็น Plan objects จริง (ข้อความในตัวอย่างเป็น placeholder); rows รวม common + ทุก field ของ category
Error `{error:{code,message}}`: 400 INVALID_INPUT/MIXED_CATEGORY/DUPLICATE_IDS, 404 PLAN_NOT_FOUND, 405 method ไม่รองรับ; unknown category = 400
URL สร้างจาก known category + known IDs เท่านั้น เป็น relative same-origin URL ไม่รับ redirect URL จาก user/model
ตัวอย่าง health-01 กับ health-02: แสดง annualLimit 2,500,000 และ 10,000,000 บาท/ปี; waitingDays ยังไม่ได้ระบุ; ราคา render 6,700 และ 15,680 บาท/ปี พร้อมป้ายเบี้ยเริ่มต้น

## 8. Chat, AI tools และ summary

### UX และ context

Chat เปิดด้วยคำถามสั้น “อยากให้ช่วยเลือกประกันประเภทไหน?” ถ้ามาจาก Compare ใช้ “กำลังดูแผนเหล่านี้อยู่ อยากเปรียบเทียบเรื่องไหน?”
ปุ่ม prompt ตัวอย่าง: “งบไม่เกิน 20,000 บาท/ปี”, “ต่างกันตรงไหน”, “อยากคุยกับผู้เชี่ยวชาญ”
State: idle → submitting → success/error; disable ส่งซ้ำขณะรอ, ไม่ทำให้ input หายเมื่อ error; transcript เป็น plain text ไม่ render HTML จาก model

`POST /api/chat` request:

```ts
type ChatInput = {
  messages: {role:'user'|'assistant'; content:string}[];
  context: {category:Category|null; selectedPlanIds:string[];
    budgetTHB:number|null; goals:string[]};
};
type ChatReply = {
  mode:'mock'|'live'; message:string;
  suggestedPlanIds:string[];
  offerHandoff:boolean;
  comparison:{category:Category; planIds:string[]; url:string}|null;
  summaryDraft:{needs:string[]; questions:string[]}|null;
};
```

Validate: message แต่ละอันไม่เกิน 2,000 characters, ล่าสุดสูงสุด 12 messages, total ≤12,000 characters; จำกัด HTTP body 32KB; context goals ≤5 ข้อ ข้อละ 200 characters; budget finite ≥0; selected IDs ≤3 ที่มีอยู่จริง
`offerHandoff=true` แสดงปุ่มเปิด preview เท่านั้น ไม่สร้าง lead และไม่เพิ่ม interest score; action นี้มาจาก mock/live ได้ แต่ต้องผ่านการยืนยันเหมือนกัน
ไม่รับ role system/developer จาก browser; system instructions และ catalog ถูก server เติมเอง

### Live adapter

- ใช้ OpenAI Responses API ฝั่ง server และ model ID จาก env; `store:false`; ห้าม key ลง NEXT_PUBLIC/VITE หรือ response/log
- ส่งเฉพาะ catalog หมวดปัจจุบัน (≤5 แผน) และ conversation ล่าสุด ไม่ส่งบอร์ด Miro/Figma/ข้อมูลไม่เกี่ยวข้อง
- ถ้ายังไม่มี category ให้ถาม ไม่ส่งทั้ง catalog ทุกข้อความ
- System rules: ไทยสั้น 1–3 ย่อหน้า, ถามครั้งละ 1 ประเด็น, ราคาหรือ coverage ต้องมาจาก catalog, ระบุเมื่อไม่ทราบ, ไม่รับรองการเคลม/อนุมัติ/ความเหมาะสมส่วนบุคคล
- Tools: `compare_plans({category,planIds})` เรียก buildComparison ตัวเดียวกับ API; `search_plans({category,maxPremium})` กรอง fixture; validate arguments อีกครั้งแม้ใช้ strict schema
- Tool loop สูงสุด 2 rounds ต่อข้อความ; timeout รวม 20 วินาที; final output จำกัดประมาณ 500 tokens เป็นค่าเริ่มต้น ปรับเมื่อ integration test พบว่าถูกตัด
- Structured output ตาม ChatReply (mode ตั้งโดย server ไม่เชื่อค่าจาก model); schema strict/additionalProperties:false; nullable ใช้ null ชัดเจน
- Validate suggested IDs และ comparison URL หลัง model ตอบ; invalid/refusal/incomplete ให้ error ควบคุมได้ ไม่ส่งข้อความ JSON พังให้ client
- Agent เรียก Compare เป็น operation จริงใน server แล้ว UI แสดงปุ่ม “เปิดตารางเปรียบเทียบ”; ไม่บังคับเปลี่ยนหน้าโดยไม่ได้กด
- Error codes: 503 CHAT_NOT_CONFIGURED, 429 RATE_LIMITED, 504 CHAT_TIMEOUT, 502 CHAT_UPSTREAM_ERROR; ข้อความไม่เผย upstream secret
- ไม่มี auto retry ที่กิน token ซ้ำไม่จำกัด; user กด retry ได้ ใช้ client request guard ป้องกันผลตอบกลับ request เก่าทับใหม่
- เริ่ม mode จาก server config; ถ้า live พัง UI ให้เลือกใช้ mock ครั้งต่อไปอย่างชัดเจน โดย server ยอมรับ provider override เฉพาะ `mock` ผ่าน query `?mode=mock` ไม่ยอมให้ clientเลือก model/key
- ก่อนเปิด live บน public URL ต้องเพิ่ม access/rate protection; ค่าเริ่มต้นส่งมอบ private demo ด้วย mock หากยังไม่มีมาตรการนั้น

อ้างอิงสำหรับ implementation: [Function calling](https://developers.openai.com/api/docs/guides/function-calling), [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) ตรวจ signature ของ SDK รุ่นที่ติดตั้งก่อนใช้

### Mock adapter ที่ต้องใช้งานได้เสมอ

ใช้ context + quick prompts แบบ deterministic ไม่แกล้งเป็น AI live:
ไม่มี category → ถามหมวด; health+budget 20000 → suggested health-01,health-02; มี 2–3 IDs และถามความต่าง → buildComparison แล้วสรุปตัวเลขที่ต่าง; ขอคุย → เปิด handoff action; ข้อความนอกกรณี → ขอเลือกหมวด/งบ พร้อมปุ่มตัวอย่าง
UI แสดง “บทสนทนาตัวอย่าง” ตลอด mock mode; ห้ามหน่วงเวลาหลายวินาทีเพื่อแกล้ง inference

### Customer summary

App สร้าง structured summary จาก state; AI ช่วยร่าง needs/questions เท่านั้น ค่า category, budget, IDs และเบี้ยอ่านจาก state/catalog อีกครั้ง
เก็บ: category, budgetTHB, needs[], comparedPlanIds[], interestedPlanIds[], questions[], generatedAt, sourceMode, editedByUser
ข้อมูลไม่ทราบแสดง “ยังไม่ได้ระบุ”; ลูกค้าแก้ needs/questions ก่อนส่งได้; Broker เห็น snapshot ตอนกดยืนยัน ไม่ถูก Chat รอบหลังแก้ย้อนหลัง
CustomerSummary type ให้กำหนดตรงนี้: `{category:Category; budgetTHB:number|null; needs:string[]; comparedPlanIds:string[]; interestedPlanIds:string[]; questions:string[]; generatedAt:string; sourceMode:'mock'|'live'; editedByUser:boolean}`; goals มาจาก profile.goals, default [] และส่งเข้า Chat context; ไม่ infer budget จาก prose โดยไม่แสดงให้ผู้ใช้ยืนยัน
การส่ง summary ไม่ส่งโทรศัพท์/ข้อมูลสุขภาพจริง; ช่อง contactWindow เป็นช่วงเวลาจำลอง ไม่ใช่การนัดจริง

## 9. Interest, lead และ call state

### กฎ interest v1 (เป็น heuristic สาธิต)

score = sum ของ 4 สัญญาณแบบ boolean; แต่ละสัญญาณนับครั้งเดียวต่อ demo customer:
เปิดรายละเอียดแผน 10 + Compare สำเร็จ ≥2 แผน 20 + ระบุหมวดและงบ 20 + กด “สนใจแผนนี้” 50 = สูงสุด 100
score ≥70 และยังไม่มี offer ถูกแสดง/ปิด และไม่มี active lead → แสดง offer หนึ่งครั้ง
คะแนนนี้วัด interaction เพื่อ demo ไม่ใช่ความเหมาะสมประกัน ไม่ใช่การตัดสินใจซื้อจริง
กดคุยผู้เชี่ยวชาญเองข้าม threshold ได้เสมอ; AI พูดว่า “สนใจ” ไม่เป็น event จนกว่าผู้ใช้กด action

### Handoff

- Offer “ให้ผู้เชี่ยวชาญช่วยดูต่อไหม?” มี ดูสรุป / ไว้ก่อน
- ต้องผ่าน summary preview + checkbox ยินยอมส่งข้อมูลตัวอย่าง ก่อนสร้าง lead แม้คะแนนถึงแล้ว
- Validation: displayName trim 1–60 ตัวอักษร, category required, interestedPlanIds ≥1 (ถ้าไม่มีให้เลือกจากแผนที่เทียบ), contactWindow required, consent true
- Reducer action `CONFIRM_HANDOFF` ตรวจ active lead ของ customer ก่อนสร้าง; ถ้ามี new/contacting/follow_up ให้คืน/เปิด lead เดิม ไม่มี lead ซ้ำจาก double click/retry
- ถ้า lead เดิม closed แล้ว ขอรอบใหม่สร้าง ID ใหม่ได้
- ID ใช้ crypto.randomUUID; timestamps เก็บ ISO; consent เก็บ timestamp

```ts
type LeadStatus = 'new'|'contacting'|'follow_up'|'closed';
type Lead = {
  id:string; customerId:'demo-customer'; displayName:string;
  status:LeadStatus; createdAt:string; updatedAt:string; consentAt:string;
  contactWindow:'morning'|'afternoon'|'evening';
  summary:CustomerSummary; transcript:{role:'user'|'assistant';content:string}[];
  interestScore:number; notes:string;
  calls: {id:string; startedAt:string; endedAt:string|null;
    outcome:'interested'|'follow_up'|'not_interested'|null; note:string}[];
};
```

CustomerSummary คือ shape ที่นิยามใน §8; snapshot copy ตอน confirm; call notes max 2,000 ตัวอักษร

### State machine

| Event | ก่อน | หลัง | ผล |
| --- | --- | --- | --- |
| Confirm handoff | ไม่มี active lead | new | สร้าง snapshot และ alert ใน dashboard หนึ่งรายการ |
| รับเรื่อง | new | contacting | ลง timestamp; ไม่เริ่ม timer อัตโนมัติ |
| เริ่มสนทนาจำลอง | contacting/follow_up และไม่มี call เปิด | contacting | เพิ่ม call startedAt; ไม่ใช้ microphone/telephone API |
| จบ: สนใจต่อ | มี active call | closed | endedAt, outcome interested, บันทึกหมายเหตุ/next action |
| จบ: นัดติดตาม | มี active call | follow_up | outcome follow_up; note ต้องมีสิ่งที่จะติดตาม |
| จบ: ไม่สนใจ | มี active call | closed | outcome not_interested |
| Reload ระหว่าง call | มี active call | เดิม | timer จาก now-startedAt; ไม่สร้าง call ใหม่ |
| Reset | ทุก state | seed | ล้าง lead/chat/selection/offer, คืน policy/profile ตัวอย่าง |

ไม่อนุญาตจบ call ที่ไม่เคยเริ่ม หรือเริ่มซ้อน; รับเรื่องซ้ำ no-op; บันทึกผลต้องมี outcome; ห้ามเพิ่ม policy เมื่อปิด lead
Dashboard counts คำนวณจาก leads จริงใน store ไม่ hardcode; status ใน Account ใช้ store เดียวกัน

## 10. Persistence และ privacy UX

Persist envelope `{version:1, profile, policies, selection, messages, signals, offerSeen, leads}`; transient UI (modal open, submitting, errors) ไม่ persist
selection ที่ persist เป็น default เมื่อเข้า Compare ไม่มี query เท่านั้น; URL query มี priority เมื่อระบุแล้ว
หลัง hydration: JSON parse + validate shape/version; ถ้าพัง/เก่าที่ไม่รองรับให้แจ้ง “ข้อมูลสาธิตเดิมอ่านไม่ได้” และให้ reset ไม่ทำให้หน้า crash
Load seed ครั้งแรก: selection ว่าง, signals false, leads ว่าง, messages ว่าง, 4 policies; profile “ผู้ใช้สาธิต”, budget null
Storage quota/disabled: in-memory fallback และข้อความแจ้ง; ไม่เขียนซ้ำเป็น loop
Same tab route switch อัปเดตทันที; optional storage event สำหรับอีก tab บน origin เดียวกัน ใช้การอ่าน payload ล่าสุดและไม่เขียน echo กลับ ไม่มี requirement cross-device
Reset ใช้ AlertDialog ระบุว่าล้างเฉพาะ demo นี้; ลบเฉพาะ key ของแอป ห้าม localStorage.clear(); toast สำเร็จและกลับ Home
My Account อธิบาย “ข้อมูลตัวอย่างเก็บใน browser นี้ ล้างได้ด้วยรีเซ็ต”; live Chat ระบุว่าข้อความจะประมวลผลผ่าน AI provider ก่อนส่งครั้งแรก

## 11. Traceability กับ Miro เดิม

| Miro item เดิม | งานในแผนนี้ | Phase |
| --- | --- | --- |
| Data Gathering / Data Gathering 2 | 35 fixtures พร้อม provenance/fields/validation ใน P1; รวมเก็บข้อมูลสองรอบเพื่อลดการแก้ schema ซ้ำ | P1 |
| Compare | selectors + field-per-category + pure comparison | P3 |
| Compare integration | POST compare + same-origin URL; tool reuse | P3/P6 |
| Browse Page / Home Page | S01–03 | P2 |
| User Data | demo envelope, consent, reset, live notice | P4/P5 |
| My Insurance / My Account Page | S05–06 | P4 |
| UX UI Enhancement | Apple theme ตั้งแต่ P0 แล้ว QA ทุกช่วง | P0/P7 |
| AI | mock และ live adapter | P5/P6 |
| Customer Summaeization | structured summary + preview/edit | P5 |
| AI with Comparing Integration | compare_plans function calling | P6 |
| Dashboard / Broker Call | S09–10 และ call simulation | P5 |
| AI Call Broker | deterministic offer → consent → lead alert; รักษาจุดประสงค์แจ้ง Broker โดยไม่ทำโทรศัพท์จริง | P5 |

แยก “ลำดับสร้างระบบ” ออกจาก “ลำดับที่ลูกค้าใช้” ทั้งสองอยู่ใน Miro แผน v1; ไม่ตีความกล่องเรียงซ้ายไปขวาเดิมเป็น user journey

## 12. Implementation phases และจุดรับงาน

Home promotions follow-up: shared-application travel (20%) and AXA family health (25%) demo offers placed before motor/home in one horizontal card rail. Both requested discounts are visibly labelled illustrative, not verified insurer offers. Native swipe, keyboard and previous/next controls; existing dated official offers retained. Verification: output/promotions-verification.md.

2026-09-12 — DONE locally — Parallel Home / Compare / Chat refinement. Centered larger black CTA and generated family image; explicit differences with pending-data disclosure; customer chat removes internal/profile copy and uses canonical grouped intake for 13 categories (normally 2 fields, motor at most 3), retaining existing memory and Broker history. 160 tests, TypeScript/build pass, lint 0 errors / 8 image warnings. Independent browser QA 52/52 at 390/1280; actual API and real browser submit/reload passed, including SUV/year recall and no repeated completed fields. Fixed upstream schema to allow only remaining intake keys, or null when completed. Local production 8787. Evidence: output/page-refinement-verification.md. Miro SYNC PENDING (tool unavailable).

2026-09-12 — DONE locally — User approved proposal 02 (“ok ใช้เลย”). Applied the image-led white/black/blue design to Browse, Detail and Compare, with shared styling across all nine pages. 152 tests, TypeScript and production build pass; lint 0 errors / 8 image warnings. Independent 390px/1280px responsive and interaction QA passed with all blockers closed; root reviewed desktop shared pages. Local production: 127.0.0.1:8787. Evidence: output/luxury-rollout-verification.md. Canonical data/API contracts unchanged. Remaining source-data gaps remain explicit. Miro SYNC PENDING (tool unavailable).

2026-09-12 — IN PROGRESS — Two-team data completeness and monochrome luxury design proposal, with independent evaluation. All-cell evidence ledger and exhaustive comparison matrix; no guessed missing facts. Separate responsive design prototype for explicit user approval before main-page rollout. Contract/gates: output/data-design-review-plan.md. User liked the monochrome direction and requested more imagery plus a stronger blue focus accent. Proposal 02 at output/luxury-design-proposal/index.html passed independent visual review 91.5/100; user approval PASSED; main rollout completed (see latest entry). Public-source research round complete: 405 original + 13 appended gaps researched; 115 independently reviewed changes integrated. 83 entries / 79 products / 891 cells; 374 unknown and 4 conflicting remain explicit, so factual-completeness gate remains OPEN. All 95,284 combinations and 152 tests pass; TypeScript/lint/build/local API verified. Current matrix at output/data-audit/current-matrix.csv. Miro SYNC PENDING.

2026-09-12 — DONE — All9pages readability refresh, one page per team. Large Thai headings/standalone values; plain unknown states; all13category detail groups; consolidated condition/source disclosures; concise Broker decision/question bullets with original draft text. Desktop and390px browser QA passed, including final mobile table columns beside pinned labels. npm test148/148, typecheck/build pass; lint0errors/7existing img warnings; git diff --check pass. Local production running8787. Evidence: output/page-readability-verification.md; assignments: output/page-readability-plan.md. Canonical facts, realAPI/memory and active calls preserved. Miro SYNC PENDING (tool unavailable).

2026-09-12 — DONE locally — Two-team live chat + catalog expansion: runtime user/Broker replies use real OpenAI GPT-5.4; no mock selector/query bypass/fallback. Full stored conversation plus persona (200-message boundary), latest corrections, retained card-action context and exact prior-plan comparison verified. Catalog now 82 entries / 78 products / 18 insurer names / 13 categories; 42 new sourced product overviews, same-purpose comparison guards, all categories visible. 146 tests/typecheck/build passed; lint 0 errors/7 existing image warnings. Local8787 real HTTP smoke8/8 (up to28 inputmessages) and user/Broker desktop/mobile browser checks passed. Broker customer and Your Data remain explicitly simulated. Evidence: output/live-chat-catalog-verification.md; sources: output/catalog-expansion-research.md. Miro SYNC PENDING.

2026-09-12 — DONE locally — Five separate teams integrated: persona gender + simulated Your Data consent + avatar dissolve; direct category deselection + concise step 2; answer-first chat + contextual discovery/name recall; official HeyGoody research + seven-category Browse questionnaires + editable chat draft; concise comparison with customer-grounded reasons, range budgets and expandable conditions/sources. Native FormData fixed date persistence/validation; draft separators preserve field boundaries. 129 tests/typecheck/build passed; lint 0 errors/7 existing image warnings. Local production restarted at 8787 and desktop/mobile flows verified; details in output/discovery-refresh-verification.md. Your Data remains UI-only. Live behavior was tested with mocked upstream, not real credentials. Miro SYNC PENDING (no callable Miro tool).

2026-09-12 — DONE locally — Character layout and optional annual budget: first step now uses an equal-column layout, large age-responsive avatar left and nickname/age/budget selects right; stacks on mobile. Six annual budget choices: unknown, <10k, 10k–19,999, 20k–29,999, 30k–50k, >50k THB. Stored as optional budgetBand, preserving old personas. Chat and Broker overview retain the range quote without treating an endpoint as an exact budget or excluding quote-only plans. 104 tests/typecheck/lint passed (7 existing image warnings); production build and desktop/mobile browser checks passed. Miro SYNC PENDING (no callable tool). Evidence: output/avatar-layout-verification.md.

2026-09-12 — DONE locally — Persona discovery flow (latest user override): nickname + 5 illustrated age bands → category + 1–3 relevant topics → browse / automatic comparison / questions first. Topic-based retrieval may prepare up to 3 compatible catalog plans without a budget gate; property/liability show their actual 2 available plans. Ask mode starts without product cards and stays informational unless the customer requests plans. Completed persona persists; starting discovery resets only current chat/selection/overview, preserving existing Broker cases. Assets, Scope and Dev teams integrated through lib/discovery-persona.ts and /images/personas/age-{id}.png. 102 tests/typecheck/build passed; lint 0 errors/7 existing warnings. Local production and all 3 paths verified at desktop/mobile; final chat page width390 with scrolling confined to comparison region. Miro SYNC PENDING: no callable Miro tool. See output/persona-flow-verification.md.

2026-09-12 — DONE locally — Unified Broker conversation: original customer/AI transcript and subsequent Broker/customer messages now share one chronological chat log. Removed the duplicate transcript disclosure. Reuses customer chat bubble/composer styles; preserves sender labels and saved historical cards without replacing snapshot facts. Enter sends, Shift+Enter adds a line, and a latest-message control supports long histories. Desktop/mobile checks verified sending, reload persistence, source-card expansion and no page overflow at 390px. 88 tests, typecheck and build passed; lint 0 errors/7 existing warnings. Miro SYNC PENDING (no callable Miro tool). Evidence: output/broker-unified-chat-verification.md.

2026-09-12 — DONE locally — Broker decision table + customer chat (latest user request): candidates now use a full-width table with source/chat evidence, conditional decision triggers and per-plan follow-up questions. Questions are editable drafts, never auto-sent. Added six labeled customer fixtures, merged by stable ID without overwriting existing leads or blocking customer handoff. Broker-to-customer chat is explicitly local simulation with authored case replies, separate per-lead history, call/chat switch and follow-up/close notes. Structured handoff snapshots stay unchanged by simulated chat. Mobile table has a pinned plan column and keyboard/button scrolling. 88 tests passed; typecheck/lint/build passed (7 existing image warnings). Miro SYNC PENDING: no callable Miro tool. Validation: output/broker-table-chat-verification.md.


2026-09-12 — Broker quick brief (latest user override): Broker-facing candidate suggestions are allowed for review; customer-facing AI remains descriptive. The lead page now opens with needs, concerns, current coverage, original-period budget and a verbatim chat quote, beside a three-step conversation guide and missing-contact notice. Up to three candidates use explicit interest/comparison first, then sourced coverage fields tied to chat topics; no purchase score, no budget gate, no assumed eligibility. Quote-only, optional cover and unknown fields stay explicit. Full extraction/differences, saved plan facts, transcript and call history are collapsed. DONE locally: 84 tests, typecheck, build passed; lint 0 errors/7 existing warnings; production desktop/mobile and search/disclosure/form checks passed. See output/broker-brief-verification.md. Miro SYNC PENDING (no callable Miro tool in this session).


2026-09-12 — ChatGPT Broker pipeline override: structured extraction with verbatim customer evidence → canonical retrieval → descriptive differences → consented immutable Broker Overview. ลบ activity-score calculation/UI; AI ไม่จัดอันดับหรือแนะนำให้ซื้อ. 82 tests/typecheck/build ผ่าน; local production + desktop/mobile customer→Broker→reload ผ่าน. Actual Live evaluation PENDING ไม่มี credentials; Miro SYNC PENDING ไม่มี tool. สเปกล่าสุดอยู่ใน plan-v2.md §3 และ output/assistant-pipeline-verification.md.

2026-09-12 — Browse/Chat follow-up ตามคำสั่งล่าสุด: แสดงแผนขอใบเสนอราคาใน grid และจำนวนผลลัพธ์ พร้อมจุดเด่น/ข้อจำกัด; เลือกหมวดในแชตแล้วดูแผนได้เลย ไม่บังคับงบ (แทน needs-first gate รอบก่อน). 73 tests ผ่าน; typecheck/build ผ่าน; lint 0 errors/7 existing image warnings. Browser ยืนยัน property quote-only และ Chat ข้าม budget ไปการ์ดแล้ว. Live model evaluation ยังรอ credentials. Miro SYNC PENDING; รายละเอียดปัจจุบันใน plan-v2.md §3.

Current follow-up: user-authorized UX refresh12Sep2026 is tracked in plan-v2.md “UX refresh” and output/refresh-verification.md. Historical v1 DONE statuses below do not establish completion of this new scope.

| Phase | Depends | อ่านเพิ่ม | ส่งมอบ | Acceptance | Status |
| --- | --- | --- | --- | --- | --- |
| P0 Foundation | — | §2–3, Sites portable | starter ปลอดภัย, theme, nav, Home slice, favicon, route shell | preview เห็นภาพ/ทิศทางจริง, ไม่มี starter screen, nav ใช้ได้, documents ไม่หาย | DONE — Gen Z/Draft visual refinement; `npm run build`; `npm run lint` (0 errors; 1 Next image warning); `npx tsc --noEmit`; `npm run start` local production on `127.0.0.1:8787`; browser Home/Browse preview |
| P1 Data | P0 | §6 | types, 35 catalog plans, 4 policies, category fields, validators | tests count/keys/types/period/ID/asset ผ่าน; official source URLs and premium notes | DONE — official catalog refresh; `npm test`; `npx tsc --noEmit`; `npm run lint`; `npm run build`; local production `127.0.0.1:8787` |
| P2 Discovery | P1 | §2, §5 S01–03 | Home, Browse, details, filters/sort/query | filter/sort ถูก; back/refresh คืนค่า; not-found/empty; ไม่เปลี่ยนข้อมูลจาก plan card | DONE — official catalog refresh; `npm test` (6 passed); `npx tsc --noEmit`; `npm run lint` (0 errors, 3 Next image warnings); `npm run build`; local production `127.0.0.1:8787`; browser real Browse/detail/source checked |
| P3 Compare | P2 | §7 | selection bar, 3 columns, table, compare endpoint | T03–T08 ผ่าน, 7 หมวดมีตาราง, same function ใน UI/API | DONE — `npm test` (8 passed); `npx tsc --noEmit`; `npm run lint` (0 errors); `npm run build`; local production `127.0.0.1:8787`; browser Compare and POST `/api/compare` checked |
| P4 Customer state | P3 | §5 S05–06, §10 | Context/persistence, policies, profile/reset | T09–T11; policy date states; storage fail ใช้ in-memory ต่อได้ | DONE — npm test (11 passed); tsc; lint; build; local 127.0.0.1:8787; browser /my-insurance และ /account |
| P5 Assisted handoff | P4 | §8 mock/summary, §9 | Chat mock, editable summary, consent, lead, dashboard, call | T12, T15–T17; full journey ใช้ได้ offline; ไม่มี duplicate active lead | DONE — mock /api/chat health budget/compare/handoff; summary + consent ใน Chat; Broker dashboard/detail state machine; regression/build/local browser routes |
| P6 Live AI | P5 | §8 live, docs | server OpenAI adapter, search/compare tools, safe errors | T18–T20 เมื่อมี key/model; ถ้าไม่มีให้ BLOCKED เฉพาะ live smoke, mock ยังพร้อม | BLOCKED — live adapter และ guarded error codes พร้อม แต่ไม่มี CHAT_MODE=live + OPENAI_API_KEY/OPENAI_MODEL ที่ตั้งค่าใน local จึงยังไม่ทำ real request; mock READY |
| P7 QA + delivery | P5, P6 disposition | §13–14 | responsive polish, regression, private demo, README | mandatory demo flow ผ่าน; live outcome ระบุจริง; local deploy ตรวจแล้ว | DONE — typecheck/lint/tests/build ผ่าน; local production restart แล้ว; browser ตรวจ /account, /my-insurance, /broker, invalid lead และ Chat API |

ขนาดงานภายใน phase: เริ่มหนึ่ง vertical slice ที่เห็นผล ไม่สร้างทั้ง backend/frontend จนไม่มีอะไรทดลองได้
P0 เปิด preview ตาม Sites skill เมื่อ Home slice มี theme/ข้อมูลจริงแล้ว; route ที่ยังไม่เสร็จระบุระหว่างพัฒนาได้ แต่ต้องไม่มี placeholder เหลือใน P7
P0 ใส่ provider shell ได้เมื่อ nav ต้องใช้; P3 selection ทำงานใน memory/URL ก่อน; P4 เติม persistence โดยไม่เปลี่ยน Compare contract คำว่า offline ใน P5 หมายถึงไม่ต้องต่อ internet/OpenAI แต่ local app server ยังทำงาน
หลัง phase ผ่าน ให้อัปเดตแถวและ evidence ที่นี่ เช่น `P3 DONE — npm test ...; browser 1440/390; ...` อย่าเพิ่มบันทึกยาวซ้ำสเปก
สถานะในตารางนี้อัปเดตตามโค้ดและการตรวจ local production ล่าสุด

## 13. Acceptance tests

ใช้ test runner ที่มี ถ้าไม่มีใช้ Node test runner + ตัวรัน TS ที่ stack รองรับสำหรับ pure logic และ browser automation ที่มีสำหรับ E2E ไม่ติดตั้งหลาย framework
ทุก expected number อ้าง fixture ที่รู้ ห้าม assert เทียบผลกับฟังก์ชันเดียวกับที่ทดสอบ

| ID | ทำอะไร | ต้องได้ |
| --- | --- | --- |
| T01 | validate catalog | 7 หมวด ×5 แผน, IDs unique, coverage keys และ premiumPeriod ถูก |
| T02 | health maxPremium=20000, sort=price-asc | AXA SmartCare Value และ Essential ตามลำดับ; 20,000 รวมขอบเขต; กรองเหลือ 0 มี clear action |
| T03 | API compare health-01,health-02 | annualLimit [2500000,10000000], waitingDays [null,null], URL ตาม §7 |
| T04 | เลือกซ้ำ/รายการที่ 4 | ไม่เพิ่ม; ข้อความอธิบาย; IDs เดิมไม่หาย |
| T05 | API 1 ID,4 IDs,duplicate,unknown,mixed category,invalid JSON | status/code ตาม §7, ไม่ crash |
| T06 | compare health-01/02 different-only | waitingDays ถูกซ่อน; premium/annualLimit แสดง; สลับปิดคืนครบ |
| T07 | compare health-01/05 | opd null แสดงยังไม่ได้ระบุ; ต่างกันตาม raw values; different=true |
| T08 | เปิด Compare query, เปลี่ยนแผน, back, refresh | selection สอดคล้อง URL ทุกครั้ง; cross-category cancel รักษาชุดเดิม |
| T09 | My Insurance วันเดโม | motor ใกล้ต่ออายุ, health/life active, accident expired; display เป็น พ.ศ. |
| T10 | reload profile/chat/lead + broken storage | state ปกติคืนได้; broken JSON ไม่ crash; storage disabled มี memory fallback |
| T11 | cancel/confirm reset | cancel ไม่เปลี่ยน; confirm คืน seedและไม่ลบ key แอปอื่น |
| T12 | mock health budget20000 → compare | ตอบจาก health-01/02, table ตัวเลขเดียวกัน, มีป้ายบทสนทนาตัวอย่าง |
| T13 | events detail+compare+budget | score=50 ยังไม่ auto offer; เพิ่ม interest=100 แสดงครั้งเดียว; event ซ้ำไม่เพิ่ม |
| T14 | score70 (compare+interest), ปิด offer | แสดงหนึ่งครั้ง; ปิดแล้วไม่ซ้ำ; CTA ขอคุยเองยังใช้ได้ |
| T15 | confirm ไม่มี consent/plan; double confirm ที่ valid | invalid ไม่สร้าง lead; valid สองครั้งได้ active lead ID เดียว |
| T16 | เปลี่ยน chat หลัง handoff | Broker snapshot เดิมไม่เปลี่ยน; Customer/Broker เห็น lead status ร่วม |
| T17 | รับเรื่อง → start → reload → end follow_up | timer ต่อเนื่อง, call เดียว, follow_up + note, no real call; start ซ้อน/end ก่อน start ถูกป้องกัน |
| T18 | live แนะนำสุขภาพ+tool compare | tool ทำงานจริง, IDs/URL/price จาก catalog; ไม่ใส่ secret ใน bundle/network response |
| T19 | live missing key/429/timeout/refusal/bad output | ข้อความ error ถูก, retry ได้, ไม่มี duplicate message, เลือก mock ได้แบบชัดเจน |
| T20 | model ขอ unknown IDs/external URL/system role | server reject/normalize อย่างกำหนด ไม่ navigate ออก ไม่ override instructions |
| T21 | desktop 1440×900, presentation 1920×1080, mobile 390×844, narrow 360px | ไม่ล้น, Thai glyph ไม่ชน, compare scroll เฉพาะ table, menu/chat keyboard ได้ |
| T22 | keyboard + 200% text | Tab/Enter/Escape ใช้ได้, focus กลับ opener, label/error ผูก input, headings ลำดับถูก |
| T23 | direct route refresh + invalid lead ID | ทุก route โหลดตรงได้; not-found มีทางกลับ; ไม่มี blocking console errors |

Quality gates: typecheck + production build + domain checks + main browser journey; ใช้ scripts จริงจาก package.json บันทึกคำสั่งที่ใช้ใน README ไม่สร้างชื่อ script ที่ไม่มี
P6 live ต้องมี successful real request จึงเป็น VERIFIED; mock tests ไม่ใช้แทน live verification
ถ้า build ใช้ได้แต่ live ไม่มี key: demo=READY, live=BLOCKED (missing configured key/model); ไม่ใช้คำว่า all integrations complete

## 14. Presentation script และส่งมอบ

### รอบสาธิตประมาณ 5 นาที

1. Reset → Home → Browse สุขภาพ งบ 20,000 → ได้ health-01/02
2. เปิด health-01 → เลือก health-01/02 → Compare → สลับ differences-only
3. Chat “ต่างกันตรงไหน” → แสดง annualLimit/ห้อง/เบี้ย → กดเปิด Compare จากคำตอบ
4. กดสนใจ health-02 → offer → ตรวจ summary → consent → ยืนยัน
5. ไป Broker → เปิด lead → รับเรื่อง → เริ่มสนทนาจำลอง → จบเป็นนัดติดตาม + note
6. ไป My Account ดูสถานะ → My Insurance ดูวันต่ออายุ → Reset จบรอบ

Presenter ใช้ mock เป็นค่าเริ่มต้นเพื่อเล่นซ้ำได้; live เป็นตัวเลือกเมื่อ P6 verified และ server พร้อม ค่าใช้จ่าย API ไม่ใช่ค่าโมเดลที่เขียนโค้ด

ส่งมอบเมื่อเขียนเสร็จ: โค้ดครบ, README วิธีรัน/ตรวจ/เปลี่ยน provider/reset, .env.example ไม่มี key, test evidence, known limitations, private Sites URL เมื่อถึงขั้นส่งเว็บตาม sites-hosting
เผยแพร่เป็น private; ถ้ายัง live ไม่มี access guard ให้ hosted ใช้ mock เท่านั้น ไม่เปิด public API ใช้ key โดยไม่มีข้อจำกัด
เพิ่ม WebMCP ตาม Sites skill เฉพาะ operation ที่มีจริง (ค้นหาแผน/เตรียมชุด compare) เรียก domain function เดียวกัน; การยืนยัน lead/reset ยังใช้ confirmation flow ของผู้ใช้
ไม่มี requirement social preview image จึงไม่สร้างเพิ่ม; favicon/title/description ต้องครบ, ตั้ง noindex สำหรับ demo

## 15. Prompt สำหรับเริ่ม Luna

```text
ใช้ GPT-5.6 Luna ทำ Insurance Website MVP ตาม plan.md v1
อ่าน AGENTS.md, Rule.md, plan.md §0–4 และ phase แรกที่ยัง TODO
ทำ phase ตามลำดับ P0–P7 ใช้ contract และ acceptance ใน plan.md
ทำไฟล์จริงและตรวจผลก่อน mark DONE ไม่ redesign architecture หรือขยาย scope
ย้ำ: ข้อมูลชุดเดียว; Compare ประเภทเดียว; secret server-only; lead ไม่ซ้ำ; mock ต้องมีป้าย
อ่าน reference เฉพาะที่ phase ใช้ ไม่ค้นบอร์ดหรือโหลดเอกสารทั้งหมดซ้ำ
รักษา Figma layout และ Apple tokens พร้อม responsive และ accessibility
อัปเดต phase status/evidence/next step ใน plan.md หลังจบแต่ละช่วง
หาก live API ไม่มี key ให้ mock ทำ flow ครบและลง live smoke เป็น BLOCKED
หากเปลี่ยน flow/phase ให้แก้ Miro แผน v1 และ plan.md ให้ตรงกัน
ตอบสั้น: ทำอะไรแล้ว / ตรวจอะไรผ่าน / ยังขาดอะไร
```

คำสั่งแบบจำกัดช่วง: `ทำเฉพาะ P3 ตาม plan.md อ่าน §7 และ T03–T08; รักษา P0–P2; จบเมื่อ acceptance ผ่าน`
ไม่ต้องสร้าง task/subagent ใหม่เพื่อแบ่ง phase; การเปลี่ยน model สำหรับลงมือทำเป็นขั้นถัดไปของผู้ใช้

## 16. Revision และ Miro sync

- v1 (2026-09-11): ขยาย 16 work items เดิมเป็น 8 build phases; เพิ่ม user journey, API/data contract, consent handoff และเกณฑ์จบ
- Miro sync: SYNCED — เพิ่มแผน v1, customer/broker flows, P0–P7 และ contracts/QA; อ่านกลับและตรวจตำแหน่งแล้ว
- [เริ่มที่ภาพรวมแผน v1](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683379424502)
- [Customer flow](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683379424862) · [Broker flow](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683379424861)
- [Build phases P0–P7](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683379527407) · [Contracts และ acceptance](https://miro.com/app/board/uXjVHoKovIc=/?moveToWidget=3458764683379527812)
- การซิงก์ครอบคลุม flow/phase/ข้อกำหนดหลัก รายละเอียด field/API และ test cases ฉบับเต็มอยู่ในไฟล์นี้; กล่อง roadmap เดิมยังอยู่ครบ








### Current V2 follow-up (12 September 2026)
V1 DONE statuses above are historical. Active V2 remains IN PROGRESS; see plan-v2.md and output/quality-report.md. Latest34tests/typecheck/build pass, lint0errors/5warnings; local8787 restarted. Independent UI/Chat/Broker reviews resumed, budget and compared/interested handoff fixed, truthful nullable prices/26 identities/subgroup guards added. Full V2 acceptance is not yet complete.

V2 follow-up supersedes v1 completion as the active implementation scope. Current V2 status and executed46-test/local-production evidence are tracked in plan-v2.md §12 and output/verification-latest.md. Do not restart from v1 DONE phases.

Current V2 checkpoint: P0–P6 DONE; P7 acceptance consolidation IN PROGRESS.52tests/latest local buildPASS. Continue from plan-v2.md and output/verification-latest.md; v1 statuses above remain historical.

Final V2 disposition: P0–P7 DONE for approved demo scope;53tests/latestlocalbuildPASS. Authoritative current evidence and limits: plan-v2.md and output/verification-latest.md. v1 above is historical.

Latest authorized Daily/contextual-learning/tool-ledChat refresh DONE. Read plan-v2.md final addendum and output/chat-daily-verification.md for current65-test/live/browser/local evidence; older v1 checkpoints remain historical.

Latest authorized refresh DONE (12 Sep 2026): Home promotions replace Daily;40 sourced image mappings;motion/reduced-motion;Broker workspace.66tests/typecheck/build PASS,lint0errors/local8787. Current scope/evidence: plan-v2.md final addendum and output/product-broker-verification.md. Historical v1/V2 checkpoints above are not instructions to restart phases.
