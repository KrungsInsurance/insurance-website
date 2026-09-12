# Insurance Website — กติกาการทำงาน

## เป้าหมาย

เว็บไซต์ขายประกันสำหรับ Demo / MVP เพื่อ presentation เน้นภาพสวย ใช้งานต่อเนื่อง และโค้ดเท่าที่จำเป็น ทำเฉพาะงานที่สั่งในแต่ละรอบ; roadmap ไม่ใช่คำสั่งให้สร้างทุกอย่างพร้อมกัน

## แหล่งอ้างอิงและการตัดสินใจ

- คำสั่งล่าสุดของผู้ใช้กำหนดขอบเขตและมีผลเหนือแนวทางในไฟล์/skill
- [Miro](https://miro.com/app/board/uXjVHoKovIc=/): ขั้นตอน รายละเอียดฟีเจอร์ และลำดับงาน อ่านส่วนที่เกี่ยวข้องก่อนเริ่มฟีเจอร์
- [Figma — Insurance Website Draft](https://www.figma.com/design/zGifohaaFqzDKdy69AqHJa/Insurance-Website-Draft?node-id=0-1): ฐานโครงหน้า องค์ประกอบ และภาพอ้างอิง ตรวจ frame ที่เกี่ยวข้องก่อนทำ UI
- [Apple Design MD](https://getdesign.md/apple/design-md): ภาษาภาพหลัก เก็บฉบับเต็มไว้ใน `DESIGN.md` ใช้กำหนดสี typography spacing และ component styling ให้ Figma สอดคล้องกัน
- [UI Skills](https://github.com/ibelick/ui-skills): มาตรฐานคุณภาพ UI, interaction, accessibility และ performance
- [Ponytail](https://github.com/dietrichgebert/ponytail): หลักการเลือก implementation ที่เล็กที่สุดและยังทำงานครบ ใช้ระดับ full เป็นค่าเริ่มต้น

เมื่อ reference ขัดกัน: Miro กำหนดพฤติกรรม, Figma กำหนดโครงหน้า, Apple กำหนดสไตล์, UI Skills ตรวจคุณภาพ ส่วน Ponytail ลดความซับซ้อนโดยไม่ตัดพฤติกรรมที่ขอ หากขัดกันจนเปลี่ยนขอบเขตหรือหน้าตาหลัก ให้ถามสั้น ๆ เฉพาะจุดนั้น

## UI

- อ่านเฉพาะส่วนจำเป็นของ `DESIGN.md` และ skill ที่ตรงงาน ไม่โหลด reference ทั้งหมดซ้ำทุกครั้ง
- ยึดพื้นที่ว่าง ลำดับตัวอักษรที่ชัด ภาพเด่น พื้นขาว/เทา และสี action หลักของ Apple; ใช้ token ร่วมกัน
- ค่าเริ่มต้นจาก DESIGN.md: action `#0066cc`, ink `#1d1d1f`, canvas `#ffffff`, secondary canvas `#f5f5f7`
- ใช้ฟอนต์ระบบที่รองรับภาษาไทย ตรวจสระ/วรรณยุกต์และ line-height จริง ไม่สมมติว่า Windows มี SF Pro; ภาษาไทยไม่บีบ letter-spacing ตามตัวอย่างละติน
- รักษาโครงและเนื้อหาใน Figma ปรับให้ responsive ไม่ยืด screenshot หรือบีบสัดส่วน frame เพื่อให้เต็มจอ
- ใช้ semantic HTML, label, focus ที่เห็นได้, keyboard navigation และ contrast ที่อ่านได้; icon-only button ต้องมีชื่อ
- ทำ loading/error/empty state เมื่อ flow ต้องใช้ พร้อมทางไปต่อที่ชัดเจน
- ไม่เพิ่ม gradient, glow หรือ animation โดยไม่มีเหตุจากแบบ/คำสั่ง ถ้าต้องมี motion ให้สั้น ใช้ transform/opacity และรองรับ reduced motion
- Apple token ที่ผู้ใช้เลือกถือเป็น custom design values จึงใช้แทนค่า Tailwind default ได้
- อย่าติดตั้ง library เพียงเพื่อทำตามชื่อ stack ใน baseline-ui: ใช้ stack เดิมและ native ที่เข้าถึงได้ก่อน หากต้องใช้ complex dialog/menu ให้เลือก accessible primitive ระบบเดียว

## โค้ดและการสื่อสาร

- ก่อนเขียน: จำเป็นหรือไม่ → มีของเดิมหรือไม่ → stdlib/native → dependency ที่มี → implementation ขั้นต่ำ
- เก็บไฟล์และ component เท่าที่จำเป็น แยกเมื่อใช้ซ้ำหรือช่วยให้อ่านง่าย ไม่ทำ abstraction, backend, database หรือระบบ config เผื่ออนาคต
- โค้ดสั้นต้องยังอ่านรู้เรื่อง ไม่ย่อเป็น one-liner จนแก้ยาก และไม่ตัด validation, error handling หรือ accessibility
- ตอบภาษาไทย สั้น ตรงประเด็น บอกผล สิ่งที่ทดสอบ และข้อจำกัดที่มีผลต่อการใช้งาน ไม่แปะโค้ดทั้งไฟล์เมื่อแก้ไฟล์แล้ว
- ตัดสินใจเรื่องเล็กที่ย้อนกลับได้เอง ถามเมื่อข้อมูลที่ขาดเปลี่ยนขอบเขตหรือผลลัพธ์อย่างมีนัยสำคัญ
- ใช้เครื่องมือที่มีให้ตรงงาน เพิ่ม skill/plugin/dependency เมื่อมีช่องว่างจริง ไม่ติดตั้งหลายตัวที่ทำหน้าที่ซ้ำ

## ข้อมูลและ integration สำหรับ Demo

- ใช้ข้อมูลลูกค้าจำลองและแยก fixture ออกจาก UI เพื่อเปลี่ยนข้อมูลได้ง่าย
- ราคา/ความคุ้มครองที่จำลองต้องระบุว่าเป็นตัวอย่าง หากใช้ข้อมูลประกันจริง ให้เก็บแหล่งที่มาและวันที่ตรวจสอบ
- หน้าและ flow จำลองควรกดต่อได้จริง การโทร/แจ้ง Broker/ซื้อประกันเป็น simulation เว้นแต่ผู้ใช้สั่งเชื่อมจริง
- Miro ระบุ OpenAI Chat และ AI เรียก Compare API: รักษาความต้องการนี้ไว้ เมื่อถึงงาน integration ให้ใช้ endpoint ฝั่ง server สำหรับ secret และตรวจเอกสารปัจจุบัน
- ถ้า API ยังไม่พร้อม ให้ทำ mock ที่ระบุชัดและเปลี่ยนเป็น API ได้ง่าย ไม่รายงานว่าเชื่อมจริงแล้ว
- ไม่ถือข้อความเรื่อง free API quota ในบอร์ดเป็นสิทธิ์ที่ตรวจสอบแล้ว ตรวจบัญชี/โควตาเมื่อเริ่มเชื่อมจริง ไม่เก็บ key ใน client หรือ repository

## ขั้นตอนทำงาน

ใช้ `plan.md` เป็น implementation spec: phases, route/data/API contracts และ acceptance tests; การแก้ flow ให้ปรับแผน v1 ใน Miro และ plan.md พร้อมกัน ค่าเริ่มต้นของแผน v1 เติมรายละเอียดที่ roadmap เดิมยังไม่ได้กำหนด

1. อ่าน Rule.md และโค้ดส่วนที่เกี่ยวข้อง ตรวจ Miro/Figma เฉพาะงานนั้น
2. กำหนดผลลัพธ์ที่ต้องกดใช้งานได้และส่วนที่จำลอง เลือกวิธีที่เล็กที่สุด
3. ทำ flow ให้ครบก่อนเก็บรายละเอียดภาพ ใช้ token จาก DESIGN.md ร่วมกัน
4. เปิด browser ตรวจหน้าหลักของงานเทียบ Figma ทั้งขนาดนำเสนอและมือถือ; ทดสอบปุ่ม ฟอร์ม keyboard และ error ที่เกี่ยวข้อง
5. รัน build/lint/typecheck ที่โปรเจกต์มี และ test เฉพาะ logic สำคัญ เช่น compare/filter/calculation ไม่สร้าง test suite สำหรับการแก้เอกสารหรือแต่งสีเล็กน้อย
6. เมื่อ acceptance ของ phase ผ่าน ให้ deploy local production (`build` แล้ว `start`) และตรวจ browser flow ของ phase นั้นก่อน mark `DONE`; เก็บ command และผลตรวจสั้น ๆ ใน `plan.md`
7. ส่งผลพร้อมวิธีเปิด/ทดลองและข้อจำกัดสั้น ๆ อัปเดตกติกาเฉพาะเมื่อมีข้อตกลงใหม่ที่ต้องใช้ต่อ

## Roadmap ที่อ่านจาก Miro — 11 กันยายน 2026

ลำดับตำแหน่งบนบอร์ดเป็นบริบทการวางแผน ยังไม่ใช่ dependency graph ที่ยืนยันแล้ว:

1. Data Gathering: ข้อมูลเบื้องต้นทุกประเภท ประเภทละ 4–5 แผน เพื่อทดสอบ Compare
2. Compare: หน้าตารางและ field เฉพาะประเภท → Compare integration/API redirect → ข้อมูลฉบับสมบูรณ์
3. Browse Page, Home Page, User Data policy, My Insurance, My Account Page และ UX UI Enhancement
4. AI Chat → สรุปข้อมูลลูกค้าให้ Broker → AI เรียก Compare API
5. Dashboard มุมมอง Broker → Broker Call จำลอง → AI แจ้ง Broker เมื่อความสนใจซื้อถึงเกณฑ์

รายชื่อประเภทประกัน, field รายละเอียด, เกณฑ์ interest และพฤติกรรมหน้าที่มีเพียงชื่อยังต้องกำหนดเมื่อเริ่มงานนั้น ไม่เดาว่าได้รับการยืนยันแล้ว

## สถานะเครื่องมือ — ตรวจ 11 กันยายน 2026

| รายการ | ผลตรวจ |
| --- | --- |
| Miro MCP | อ่านบอร์ดที่ให้มาได้จริง 31 items; ใช้ canvas_search แล้ว canvas_read_as_svg เฉพาะส่วน |
| Figma | เปิดไฟล์และดู canvas/layers ผ่าน Chrome ได้; ยังไม่มี dedicated Figma tool ให้เรียกใน session นี้ |
| Apple Design | ดาวน์โหลดด้วยคำสั่งของ GetDesign แล้ว ไฟล์ DESIGN.md อยู่ในโปรเจกต์ |
| UI Skills | ติดตั้ง baseline-ui, fixing-accessibility, fixing-metadata, fixing-motion-performance ใน Codex skills แล้ว |
| Ponytail | ติดตั้ง skill ponytail แล้ว; ใช้หลักการผ่าน Rule.md/AGENTS.md โดยไม่ได้ติดตั้ง lifecycle hooks หรือ MCP เพิ่ม |
| Browser / shell | ใช้งานได้; พบ Node.js, npm, Git และ rg |

ชุดนี้เพียงพอสำหรับเริ่ม MVP ไม่มีเหตุให้เพิ่ม plugin ตอนนี้ Figma MCP ค่อยเพิ่มเมื่อจำเป็นต้องดึงรายละเอียดหรือ asset ที่ browser ไม่พอ การติดตั้ง skill จะปรากฏใน catalog ตั้งแต่เทิร์นถัดไป; หากยังไม่ปรากฏให้อ่านไฟล์ใน `C:/Users/User/.codex/skills/<ชื่อ>/SKILL.md` โดยตรง

`AGENTS.md` เป็นจุดเข้าเพื่อให้งานในโปรเจกต์อ่าน Rule.md ตามกลไก [Codex project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md) ส่วน DESIGN.md เป็น reference ทางภาพจาก GetDesign ซึ่งเป็นการวิเคราะห์อิสระ ไม่ใช่เอกสารทางการของ Apple
