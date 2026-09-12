# Insurance Website Demo

เว็บเดโมประกันภาษาไทย: สร้างตัวละคร → เลือกประเภท/เรื่องที่สนใจ → ค้นหาเอง / เทียบแผนในแชต / ถามข้อมูล → consent → Lead → Broker

ข้อมูลอ้างอิง 82 รายการ (78 ผลิตภัณฑ์ไม่ซ้ำ) ใน 13 หมวดจาก 18 บริษัท พร้อมภาพและแหล่งข้อมูล แต่ละหมวดมี field เปรียบเทียบเฉพาะประเภท ข้อมูลที่ยังยืนยันไม่ได้ระบุไว้ตรง ๆ ไม่ใช่ข้อมูลครบทั้งตลาด การรับเรื่อง/สนทนา/กรมธรรม์เป็น simulation ไม่มีการซื้อหรือโทรจริง

Flow ล่าสุด: หน้าทำความรู้จักเพิ่มเพศแบบไม่บังคับ และ “ให้เราออกแบบให้” เปิด Your Data consent **จำลองเฉพาะ UI** ไม่มีการเชื่อมธนาคารหรืออ่านข้อมูลจริง กดประเภทประกันซ้ำเพื่อเลือกใหม่ได้ แชตตอบศัพท์สั้น ๆ แล้วถามต่อจากบริบทลูกค้า ส่วน Browse มีคำถามเฉพาะทั้ง 13 ประเภทและส่งรายละเอียดเป็นข้อความร่างให้แก้ก่อนส่งแชต หน้า Compare แสดงเหตุผลจากความสนใจ/แชตพร้อมตารางสั้นและเงื่อนไขที่กดอ่านเพิ่มได้ ดู [ที่มาของ flow Browse](output/heygoody-research.md) และ [ผลตรวจรอบนี้](output/discovery-refresh-verification.md)

## เริ่มบนเครื่องใหม่

ต้องมี Git และ Node.js **22.13 ขึ้นไป** (แนะนำ Node.js 22 LTS) รองรับ Windows/macOS/Linux ไม่ต้องติดตั้ง Codex หรือ Sites plugin

```sh
git clone https://github.com/Patriciadesu/insurance-website-demo.git
cd insurance-website-demo
npm run install:ci
```

Repository เป็น private: ล็อกอิน GitHub บัญชีที่ได้รับสิทธิ์ก่อน clone

คัดลอก `.env.example` เป็น `.env.local`:

```powershell
# Windows PowerShell
Copy-Item .env.example .env.local
```

```sh
# macOS / Linux
cp .env.example .env.local
```

พัฒนาด้วย hot reload:

```sh
npm run dev
```

เปิด http://127.0.0.1:5173 (ดู URL ที่ terminal พิมพ์) แชตใช้ OpenAI API จริง ต้องใส่ OPENAI_API_KEY ใน .env.local ก่อนส่งข้อความ

รัน production build สำหรับ presentation:

```sh
npm run build
npm run start
```

เปิด http://127.0.0.1:8787 คำสั่งนี้รัน Worker บนเครื่องเท่านั้น ไม่ deploy ขึ้นอินเทอร์เน็ต

## Demo AI → Broker

Flow ปัจจุบัน: **Extract → Retrieve & Structure → Highlight → Broker แนะนำ**. ChatGPT API จับคำพูดเป็นข้อมูลแยกช่องพร้อมข้อความต้นทางก่อนเรียก tools ดึงแผน ระบบเทียบข้อเท็จจริงโดยไม่ให้คะแนนหรือจัดอันดับความเหมาะสม จากนั้นเก็บ Broker Overview ครบ 6 ส่วนเมื่อผู้ใช้ตรวจและยินยอม. แผนในเดโมใช้ catalog ที่ normalize และผูกแหล่งข้อมูลไว้แล้ว ไม่ได้อ่าน PDF ใหม่ทุกครั้ง. ดูขอบเขตและผลตรวจที่ [pipeline verification](output/assistant-pipeline-verification.md).

## เปิด Live Chat

แก้ `.env.local`: ใส่ `OPENAI_API_KEY` ของคุณ และตั้ง `OPENAI_MODEL` เป็น model ID ที่บัญชีเข้าถึงได้ (ค่าเริ่มต้น `gpt-5.4`) แล้ว restart `npm run start` ซึ่งอ่านไฟล์นี้ฝั่ง server ผ่าน Wrangler การเข้าถึงโมเดลขึ้นกับบัญชีและต้องตรวจด้วยคำขอจริง

ห้ามใช้ `NEXT_PUBLIC_` กับ key และห้าม commit `.env.local`/`.dev.vars` ค่า secret จากเครื่องเดิมไม่ได้อยู่ใน repo แชตลูกค้าและคำตอบลูกค้าจำลองฝั่ง Broker เรียก API จริงเสมอ ไม่มีตัวเลือกบทสนทนาตัวอย่างหรือ fallback; URL เก่าที่มี `mode=mock` ไม่เปิด mock ได้ หาก key ไม่พร้อมจะแสดงข้อผิดพลาดและให้ลองส่งใหม่ ประวัติ mock ที่บันทึกไว้ก่อนหน้านี้ยังคงป้ายเดิม

ความจำแชตส่งทั้งประวัติที่เก็บไว้และ persona ทุกครั้ง รองรับสูงสุด 200 ข้อความและข้อความรวม 120,000 ตัวอักษร เมื่อถึงขีดจำกัดจะแจ้งให้เริ่มใหม่โดยไม่ตัดประวัติเก่าทิ้งเงียบ ๆ

ข้อมูลลูกค้า/selection/Lead/Broker เก็บใน localStorage ของแต่ละเบราว์เซอร์ จึงไม่ย้ายไปเครื่องใหม่ด้วย Git; ใช้ข้อมูลจำลองสร้าง flow ใหม่บนเครื่องนั้น

## ตรวจงาน

ทดสอบ OpenAI จริงผ่าน local server ด้วย `node scripts/smoke-live-chat.mjs --url=http://127.0.0.1:8787` (ใช้ข้อมูลลูกค้าสังเคราะห์และมีการใช้ API ตามบัญชีที่ตั้งค่า)

```sh
npm test
npx tsc --noEmit
npm run lint
npm run build
```

การตรวจรอบล่าสุด: ดู [แชตจริงและการเพิ่มข้อมูลประกัน](output/live-chat-catalog-verification.md) และ [รายการผลิตภัณฑ์พร้อมแหล่งอ้างอิง](output/catalog-expansion-research.md)

## ทำงานต่อ

- อ่าน [AGENTS.md](AGENTS.md), [Rule.md](Rule.md), [plan-v2.md](plan-v2.md) ก่อนแก้ feature; สถานะ v1 ใน plan.md เป็นประวัติ
- UI tokens: [DESIGN.md](DESIGN.md); Figma/Miro links อยู่ใน Rule.md
- `app/`: pages/server routes; `components/`: UI; `lib/`: catalog, Compare, Chat tools และ demo state; `tests/`: domain/contract tests
- `research-*.md`: แหล่งข้อมูลและข้อจำกัด; `public/images/`: ภาพที่ต้องใช้จริง; โลโก้/ภาพประกันเป็นของเจ้าของเดิม ไม่มีการให้สิทธิ์ใช้ต่อแบบ open-source
- Stack: React19, TypeScript, Vinext/Vite, local Cloudflare Worker; ใช้ lockfile ผ่าน `npm run install:ci`
- `build/` เป็น source ของ Vite plugin ต้องเก็บไว้ ส่วน `dist/`, `node_modules/`, `.wrangler/`, `.sites-runtime/` และ browser logs เป็นไฟล์เฉพาะเครื่องที่สร้างใหม่ได้
- Clean clone เลือก portable profile อัตโนมัติ ไม่ต้องมี path ของ plugin จากเครื่องเก่า

หลังแก้และตรวจผ่าน ใช้ `git add`, `git commit`, `git push` ส่งงานกลับ repo; ก่อนทำงานบนอีกเครื่องใช้ `git pull`

### Broker demo: decision table and customer chat

Open `/broker` for six sample customer cases. Each case shows sourced plan facts, decision criteria and questions that can be added to a draft. Read the original customer/AI conversation and continue with the customer in the same chat, then record a follow-up or close note. The chat reuses the customer UI and retains original plan cards. Enter sends; Shift+Enter adds a new line. Cases and chat history persist in this browser; simulated customer replies are generated through the real OpenAI API using the saved case and conversation. They are not messages from an external customer. The original consented brief remains a snapshot. Existing customer handoffs remain separate from the sample cases.


### ค้นหาประกันแบบใหม่

กด “เริ่มค้นหาประกันเลย!” หรือเปิด `/chat?start=1`:

1. อวาตาร์ใหญ่ด้านซ้าย ฟอร์มด้านขวา: ชื่อเล่น, ช่วงวัย (18–20, 21–30, 31–45, 46–60, 61+) เพศ (ไม่บังคับ) และงบต่อปีแบบช่วง โดยเลือก “ให้เราออกแบบให้” ได้
2. เลือกประเภทประกัน แล้วเลือกเรื่องที่สนใจ 1–3 ข้อ หัวข้อปรับตามประเภท ไม่มีขั้นบังคับงบ
3. เลือกค้นหาเองไป Browse หมวดนั้น, ให้ผู้ช่วยเปิดตาราง 3 แผนให้อัตโนมัติ, หรือเริ่มถามข้อมูลโดยยังไม่มีแผน

หมวดที่มีข้อมูลเทียบได้เพียง 2 แผนแสดงตามจริง ช่วงวัยใช้เป็นบริบท ไม่ยืนยันเบี้ยหรือสิทธิสมัคร ชื่อ/ความสนใจที่กรอกต่อไปถึงแชตและเก็บในเบราว์เซอร์ ส่วนคำขอ Broker เดิมยังอยู่ครบ โหมดตัวอย่างไม่เรียก API; Live ใช้ adapter และ credentials ฝั่ง server ตามการตั้งค่าเดิม

Contract: [persona scope](output/persona-scope.md). ภาพวาดสร้างด้วย built-in image_gen อยู่ที่ `public/images/personas/`; [path และ prompts ทั้ง 5 ภาพ](output/persona-assets.md). [ผลตรวจ flow](output/persona-flow-verification.md).
