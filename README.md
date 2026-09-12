# Insurance Website Demo

เว็บเดโมประกันภาษาไทย: Browse → Compare → AI Chat → consent → Lead → Broker → My Insurance

ข้อมูลอ้างอิง 40 แผนจาก 12 บริษัท พร้อมภาพและแหล่งข้อมูล แต่ละหมวดมี field เปรียบเทียบเฉพาะประเภท ข้อมูลที่ยังยืนยันไม่ได้ระบุไว้ตรง ๆ ไม่ใช่ข้อมูลครบทั้งตลาด การรับเรื่อง/สนทนา/กรมธรรม์เป็น simulation ไม่มีการซื้อหรือโทรจริง

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

เปิด http://127.0.0.1:5173 (ดู URL ที่ terminal พิมพ์) ค่าเริ่มต้นเป็น mock จึงไม่ต้องมี API key

รัน production build สำหรับ presentation:

```sh
npm run build
npm run start
```

เปิด http://127.0.0.1:8787 คำสั่งนี้รัน Worker บนเครื่องเท่านั้น ไม่ deploy ขึ้นอินเทอร์เน็ต

## เปิด Live Chat

แก้ `.env.local`: ตั้ง `CHAT_MODE=live`, ใส่ `OPENAI_API_KEY` ของคุณ และ `OPENAI_MODEL` เป็น model ID ที่บัญชีเข้าถึงได้ แล้ว restart `npm run start` ซึ่งอ่านไฟล์นี้ฝั่ง server ผ่าน Wrangler

ห้ามใช้ `NEXT_PUBLIC_` กับ key และห้าม commit `.env.local`/`.dev.vars` ค่า secret จากเครื่องเดิมไม่ได้อยู่ใน repo หน้าแชตสลับเป็น “บทสนทนาตัวอย่าง” ได้เมื่อยังไม่มี Live access

ข้อมูลลูกค้า/selection/Lead/Broker เก็บใน localStorage ของแต่ละเบราว์เซอร์ จึงไม่ย้ายไปเครื่องใหม่ด้วย Git; ใช้ข้อมูลจำลองสร้าง flow ใหม่บนเครื่องนั้น

## ตรวจงาน

```sh
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Checkpoint 12 กันยายน 2569:66 tests ผ่าน, typecheck/build ผ่าน; audit Home/Browse/motion/Broker อยู่ใน [รายงานล่าสุด](output/product-broker-verification.md) ผลนี้เป็น checkpoint ไม่ใช่การรับรองทุกการแก้ไขในอนาคต

## ทำงานต่อ

- อ่าน [AGENTS.md](AGENTS.md), [Rule.md](Rule.md), [plan-v2.md](plan-v2.md) ก่อนแก้ feature; สถานะ v1 ใน plan.md เป็นประวัติ
- UI tokens: [DESIGN.md](DESIGN.md); Figma/Miro links อยู่ใน Rule.md
- `app/`: pages/server routes; `components/`: UI; `lib/`: catalog, Compare, Chat tools และ demo state; `tests/`: domain/contract tests
- `research-*.md`: แหล่งข้อมูลและข้อจำกัด; `public/images/`: ภาพที่ต้องใช้จริง; โลโก้/ภาพประกันเป็นของเจ้าของเดิม ไม่มีการให้สิทธิ์ใช้ต่อแบบ open-source
- Stack: React19, TypeScript, Vinext/Vite, local Cloudflare Worker; ใช้ lockfile ผ่าน `npm run install:ci`
- `build/` เป็น source ของ Vite plugin ต้องเก็บไว้ ส่วน `dist/`, `node_modules/`, `.wrangler/`, `.sites-runtime/` และ browser logs เป็นไฟล์เฉพาะเครื่องที่สร้างใหม่ได้
- Clean clone เลือก portable profile อัตโนมัติ ไม่ต้องมี path ของ plugin จากเครื่องเก่า

หลังแก้และตรวจผ่าน ใช้ `git add`, `git commit`, `git push` ส่งงานกลับ repo; ก่อนทำงานบนอีกเครื่องใช้ `git pull`
