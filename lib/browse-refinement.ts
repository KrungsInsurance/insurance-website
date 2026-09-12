import type { Category, Plan } from "./types.ts";

type Choice = { value: string; label: string };
export type BrowseQuestion = { key: string; label: string; placeholder?: string; options?: Choice[]; type?: "date" | "number"; min?: number; max?: number };
const options = (...labels: string[]): Choice[] => labels.map(label => ({ value: label, label }));
export const browseRefinements: Record<Category, { title: string; question: string; choices: Choice[]; filtersCatalog: boolean; fields: BrowseQuestion[] }> = {
  pet: { title: "รู้จักเพื่อนสี่ขาของคุณ", question: "อยากดูแลเรื่องไหนก่อน?", filtersCatalog: false,
    choices: options("อุบัติเหตุ", "การเจ็บป่วย", "ความเสียหายต่อคนอื่น"),
    fields: [
      { key: "animal", label: "สัตว์เลี้ยง", options: options("สุนัข", "แมว", "สัตว์อื่น ขอสอบถามก่อน") },
      { key: "breed", label: "สายพันธุ์", placeholder: "เช่น แมวไทย หรือพันธุ์ผสม" },
      { key: "petAge", label: "อายุสัตว์เลี้ยง", placeholder: "เช่น 2 ปี 3 เดือน" },
      { key: "healthCertificate", label: "ใบรับรองสุขภาพและวัคซีน", options: options("มีเอกสารล่าสุด", "ขอตรวจเอกสารก่อน", "ยังไม่มี") },
    ] },
  "critical-illness": { title: "เลือกขอบเขตโรคที่อยากดูแล", question: "อยากดูความคุ้มครองกลุ่มไหน?", filtersCatalog: true,
    choices: [{ value: "cancer", label: "เฉพาะมะเร็ง" }, { value: "multi-disease", label: "หลายกลุ่มโรคร้ายแรง" }, { value: "all-diseases", label: "ขอดูทั้งสองแบบ" }],
    fields: [
      { key: "age", label: "อายุผู้ที่จะทำประกัน (ปี)", type: "number", min: 0, max: 120 },
      { key: "goal", label: "ผลประโยชน์ที่อยากเข้าใจ", options: options("เงินก้อนเมื่อพบโรค", "ค่ารักษาโรคร้ายแรง", "ทั้งเงินก้อนและค่ารักษา") },
      { key: "existing", label: "ประกันชีวิตหลักที่มี", placeholder: "ชื่อบริษัท หรือยังไม่มี" },
      { key: "concern", label: "กลุ่มโรคที่อยากสอบถาม", placeholder: "ยังไม่ต้องแจ้งประวัติทางการแพทย์ละเอียด" },
    ] },
  cyber: { title: "ดูแลความเสี่ยงทางดิจิทัล", question: "กังวลผลกระทบแบบไหน?", filtersCatalog: false,
    choices: options("ข้อมูลรั่วไหล", "ระบบหยุดทำงาน", "ความรับผิดต่อผู้เสียหาย"),
    fields: [
      { key: "business", label: "กิจการของคุณ", placeholder: "เช่น ร้านค้าออนไลน์ / บริษัทบริการ" },
      { key: "systems", label: "ระบบสำคัญที่ใช้", placeholder: "เช่น เว็บไซต์ขายสินค้า และฐานข้อมูลลูกค้า" },
      { key: "data", label: "ข้อมูลที่ดูแล", placeholder: "ระบุชนิดข้อมูล ไม่ต้องส่งข้อมูลจริงของลูกค้า" },
      { key: "security", label: "การป้องกันที่มี", options: options("มีสำรองข้อมูลและยืนยันตัวตนหลายขั้น", "มีบางส่วน", "ขอให้ฝ่ายไอทีตรวจสอบ") },
    ] },
  business: { title: "เริ่มจากความเสี่ยงของกิจการ", question: "กำลังมองหาประกันธุรกิจด้านไหน?", filtersCatalog: true,
    choices: [{ value: "sme", label: "แพ็ก SME / ร้านค้า" }, { value: "commercial-property", label: "อาคารและทรัพย์สินกิจการ" }, { value: "construction", label: "งานตามสัญญา / ตกแต่ง" }, { value: "installation", label: "ติดตั้งเครื่องจักร" }, { value: "machinery", label: "ความเสียหายเครื่องจักร" }, { value: "cargo", label: "ขนส่งสินค้า" }, { value: "trade-credit", label: "สินเชื่อการค้า" }, { value: "workers-compensation", label: "เงินทดแทนแรงงาน" }, { value: "fidelity", label: "ทุจริตของลูกจ้าง" }, { value: "jewellers", label: "ร้านทอง / อัญมณี" }],
    fields: [
      { key: "business", label: "ลักษณะกิจการหรือโครงการ", placeholder: "เช่น ร้านอาหาร / ตกแต่งสำนักงาน" },
      { key: "location", label: "สถานที่หรือเส้นทาง", placeholder: "จังหวัด ที่ตั้ง หรือเส้นทางขนส่ง" },
      { key: "value", label: "มูลค่างานหรือทรัพย์สิน", placeholder: "มูลค่าโดยประมาณ ไม่ใช่งบเบี้ยประกัน" },
      { key: "period", label: "ระยะเวลาที่ต้องการ", placeholder: "เช่น 1 ปี หรือวันเริ่ม–สิ้นสุดโครงการ" },
    ] },
  event: { title: "เตรียมความคุ้มครองสำหรับงานสำคัญ", question: "กำลังเตรียมงานแบบไหน?", filtersCatalog: false,
    choices: options("งานแต่งงาน / มงคลสมรส", "ประชุม / สัมมนา", "อีเวนต์ / นิทรรศการ"),
    fields: [
      { key: "eventDate", label: "วันที่จัดงาน", type: "date" },
      { key: "venue", label: "สถานที่และจังหวัด", placeholder: "เช่น โรงแรมในกรุงเทพฯ" },
      { key: "attendance", label: "จำนวนผู้ร่วมงานโดยประมาณ", placeholder: "เช่น 150 คน" },
      { key: "expenses", label: "ค่าใช้จ่ายที่ผูกพันแล้ว", placeholder: "เช่น มัดจำสถานที่ / ผู้ให้บริการ" },
      { key: "concern", label: "เหตุที่อยากให้บริษัทตรวจ", placeholder: "เช่น สถานที่เสียหาย หรือจำเป็นต้องเลื่อนงาน" },
    ] },
  sports: { title: "เริ่มจากกีฬาที่คุณเล่น", question: "อยากดูแลเรื่องไหนระหว่างเล่น?", filtersCatalog: false,
    choices: options("อุบัติเหตุผู้เล่น", "อุปกรณ์เสียหาย", "ความเสียหายกับคนอื่น"),
    fields: [
      { key: "sport", label: "ชนิดกีฬา", placeholder: "ขณะนี้มีแผนกอล์ฟ; กีฬาอื่นต้องสอบถามเพิ่ม" },
      { key: "activity", label: "ลักษณะการเล่น", options: options("เล่นเพื่อพักผ่อน", "แข่งขันสมัครเล่น", "เล่นเป็นอาชีพ ต้องตรวจการรับประกัน") },
      { key: "location", label: "สถานที่เล่น", placeholder: "ประเทศ หรือสนามที่ใช้เป็นประจำ" },
      { key: "equipment", label: "อุปกรณ์ที่อยากดูแล", placeholder: "ชนิดอุปกรณ์และมูลค่าโดยประมาณ" },
    ] },
  motor: { title: "ค้นหาให้ตรงกับรถของคุณ", question: "อยากดูประกันรถชั้นไหน?", filtersCatalog: true,
    choices: [{ value: "class-1", label: "ชั้น 1" }, { value: "class-2plus", label: "ชั้น 2+" }, { value: "class-3plus", label: "ชั้น 3+" }, { value: "compulsory", label: "พ.ร.บ." }],
    fields: [
      { key: "vehicleType", label: "รถที่ใช้", options: options("รถเก๋ง / SUV", "รถกระบะ", "รถไฟฟ้า EV / PHEV", "รถตู้", "อื่น ๆ") },
      { key: "brand", label: "ยี่ห้อ", placeholder: "เช่น Toyota, Honda, BYD" },
      { key: "model", label: "รุ่นและรุ่นย่อย", placeholder: "เช่น Yaris ATIV Sport" },
      { key: "year", label: "ปีที่ผลิต (ค.ศ.)", type: "number", min: 1950, max: 2100, placeholder: "เช่น 2022" },
      { key: "usage", label: "ลักษณะการใช้รถ", options: options("ใช้ส่วนบุคคล", "ใช้ทำงาน / รับจ้าง", "ยังไม่แน่ใจ") },
      { key: "province", label: "จังหวัดจดทะเบียน", placeholder: "เช่น กรุงเทพมหานคร" },
      { key: "birthYear", label: "ปีเกิดผู้เอาประกัน (ค.ศ.)", type: "number", min: 1900, max: 2026, placeholder: "เช่น 1990 · ข้ามได้" },
      { key: "repair", label: "อยากซ่อมแบบไหน", options: options("ซ่อมศูนย์ / ห้าง", "ซ่อมอู่", "ขอดูทั้งสองแบบ") },
      { key: "currentInsurer", label: "ประกันเดิม", placeholder: "ชื่อบริษัท หรือยังไม่มีประกัน" },
      { key: "startDate", label: "อยากเริ่มคุ้มครองเมื่อไร", type: "date" },
    ] },
  health: { title: "เริ่มจากการดูแลสุขภาพที่ต้องการ", question: "อยากให้ประกันช่วยเรื่องไหนก่อน?", filtersCatalog: false,
    choices: options("ค่ารักษาผู้ป่วยใน", "ค่าห้องโรงพยาบาล", "พบแพทย์แบบ OPD", "เพิ่มจากสิทธิเดิม"),
    fields: [
      { key: "insured", label: "กำลังดูให้ใคร", options: options("ตัวเอง", "คู่ชีวิต", "ลูก", "พ่อแม่") },
      { key: "age", label: "อายุผู้ที่จะทำประกัน (ปี)", type: "number", min: 0, max: 120, placeholder: "กรอกอายุจริงเท่าที่ทราบ · ข้ามได้" },
      { key: "existing", label: "ความคุ้มครองที่มี", options: options("ยังไม่มีประกันส่วนตัว", "ประกันกลุ่มที่ทำงาน", "ประกันสุขภาพส่วนตัว", "มีหลายสิทธิ / ขอเช็กก่อน") },
      { key: "hospital", label: "โรงพยาบาลที่อยากใช้", placeholder: "ชื่อโรงพยาบาล หรือรัฐ / เอกชน" },
      { key: "room", label: "ค่าห้องที่อยากรองรับ", placeholder: "เช่น ประมาณ 4,000 บาทต่อวัน" },
      { key: "costSharing", label: "ส่วนที่จ่ายเองได้", options: options("อยากดูแบบไม่มีส่วนแรก", "รับส่วนแรกได้ ขอเทียบเบี้ย", "ขอเข้าใจเงื่อนไขก่อน") },
    ] },
  life: { title: "วางเป้าหมายของประกันชีวิต", question: "อยากเริ่มดูประกันชีวิตแบบไหน?", filtersCatalog: true,
    choices: [{ value: "whole-life", label: "ตลอดชีพ" }, { value: "savings", label: "สะสมทรัพย์" }, { value: "term", label: "ชั่วระยะเวลา" }],
    fields: [
      { key: "goal", label: "เป้าหมายหลัก", options: options("ดูแลคนข้างหลัง", "เก็บเงินระยะยาว", "เงินคืนระหว่างสัญญา", "วางแผนภาษี") },
      { key: "age", label: "อายุผู้ที่จะทำประกัน (ปี)", type: "number", min: 0, max: 120, placeholder: "กรอกอายุจริงเท่าที่ทราบ · ข้ามได้" },
      { key: "payment", label: "อยากจ่ายเบี้ยกี่ปี", options: options("ครั้งเดียว", "ไม่เกิน 5 ปี", "6–10 ปี", "มากกว่า 10 ปี", "ขอดูทางเลือกก่อน") },
      { key: "horizon", label: "ระยะเวลาที่ถือได้", placeholder: "เช่น 10 ปี หรือยาวถึงเกษียณ" },
      { key: "dependants", label: "คนที่อยากดูแล", placeholder: "เช่น ลูก 1 คนและพ่อแม่" },
    ] },
  accident: { title: "ดูความคุ้มครองให้เข้ากับแต่ละวัน", question: "เรื่องไหนที่คุณอยากดูแลเป็นพิเศษ?", filtersCatalog: false,
    choices: options("ค่ารักษาอุบัติเหตุ", "รายได้ระหว่างพักรักษา", "เสียชีวิต / ทุพพลภาพ", "อุบัติเหตุมอเตอร์ไซค์"),
    fields: [
      { key: "occupation", label: "อาชีพและลักษณะงาน", placeholder: "เช่น งานสำนักงาน / ช่างซ่อม" },
      { key: "age", label: "อายุผู้ที่จะทำประกัน (ปี)", type: "number", min: 0, max: 120, placeholder: "กรอกอายุจริงเท่าที่ทราบ · ข้ามได้" },
      { key: "motorcycle", label: "ใช้มอเตอร์ไซค์บ่อยไหม", options: options("ขับหรือซ้อนเป็นประจำ", "เป็นบางครั้ง", "ไม่ได้ใช้") },
      { key: "activity", label: "กิจกรรมที่อยากให้ตรวจเงื่อนไข", placeholder: "เช่น ปั่นจักรยาน / กีฬา" },
      { key: "existing", label: "มีประกันชีวิตหลักอยู่ไหม", options: options("มีแล้ว", "ยังไม่มี", "ขอตรวจสอบก่อน") },
    ] },
  travel: { title: "เตรียมความคุ้มครองสำหรับทริปนี้", question: "จะเดินทางแบบไหน?", filtersCatalog: true,
    choices: [{ value: "outbound", label: "จากไทยไปต่างประเทศ" }, { value: "domestic", label: "เที่ยวในประเทศไทย" }, { value: "inbound", label: "ต่างชาติเดินทางเข้าไทย" }],
    fields: [
      { key: "destination", label: "ประเทศ / จังหวัดปลายทาง", placeholder: "เช่น ญี่ปุ่น หรือเชียงใหม่" },
      { key: "departure", label: "วันออกเดินทาง", type: "date" },
      { key: "return", label: "วันกลับ", type: "date" },
      { key: "frequency", label: "เดินทางบ่อยแค่ไหน", options: options("ทริปเดียว", "หลายทริป อยากดูรายปี", "ยังไม่แน่ใจ") },
      { key: "travellers", label: "ผู้ร่วมเดินทาง", placeholder: "เช่น ผู้ใหญ่ 2 คน เด็ก 1 คน" },
      { key: "ages", label: "อายุผู้เดินทางแต่ละคน (ปี)", placeholder: "เช่น 35, 33, 8 · ข้ามได้" },
      { key: "activity", label: "วีซ่าหรือกิจกรรมพิเศษ", placeholder: "เช่น เชงเก้น / เล่นสกี" },
    ] },
  property: { title: "รู้จักบ้านและทรัพย์สินที่อยากดูแล", question: "กังวลเรื่องไหนของบ้านมากที่สุด?", filtersCatalog: false,
    choices: options("ไฟไหม้", "น้ำท่วม / ภัยธรรมชาติ", "ทรัพย์สินภายใน", "โจรกรรม"),
    fields: [
      { key: "propertyType", label: "ลักษณะทรัพย์สิน", options: options("บ้านเดี่ยว / บ้านแฝด", "ทาวน์เฮาส์", "คอนโด", "อาคารพาณิชย์ / อื่น ๆ") },
      { key: "occupancy", label: "การใช้งาน", options: options("อยู่อาศัยเอง", "ผู้เช่าอยู่อาศัย", "ปล่อยเช่าระยะยาว", "ทำกิจการ / ให้เช่าระยะสั้น") },
      { key: "province", label: "จังหวัดและอำเภอ", placeholder: "ยังไม่ต้องกรอกที่อยู่เต็ม" },
      { key: "construction", label: "โครงสร้างหลัก", options: options("คอนกรีต / อิฐ", "ไม้", "ครึ่งไม้ครึ่งปูน", "ยังไม่แน่ใจ") },
      { key: "value", label: "มูลค่าอาคาร / ของภายในโดยประมาณ", placeholder: "เช่น อาคาร 2 ล้านบาท ไม่รวมที่ดิน" },
    ] },
  liability: { title: "เริ่มจากกิจการและความรับผิดของคุณ", question: "อยากตรวจความรับผิดเรื่องไหน?", filtersCatalog: false,
    choices: options("ลูกค้าบาดเจ็บในสถานที่", "ทรัพย์สินบุคคลอื่นเสียหาย", "กิจกรรม / งานอีเวนต์", "ขอบเขตความรับผิดของกิจการ"),
    fields: [
      { key: "business", label: "กิจการหรืองานที่ทำ", placeholder: "เช่น ร้านกาแฟ / ผู้จัดงาน" },
      { key: "location", label: "สถานที่และจังหวัด", placeholder: "เช่น ร้านในอาคาร กรุงเทพฯ" },
      { key: "activity", label: "ลักษณะงานที่เกี่ยวข้อง", placeholder: "เช่น รับลูกค้าวันละประมาณ 50 คน" },
      { key: "limit", label: "วงเงินที่ต้องการตรวจ", placeholder: "เช่น 1 ล้านบาทต่อเหตุ หรือยังไม่แน่ใจ" },
      { key: "territory", label: "พื้นที่ดำเนินงาน", options: options("ในประเทศไทย", "มีงานต่างประเทศ", "ขอตรวจตามสัญญาว่าจ้าง") },
    ] },
};

export function validBrowseFocus(category: Category, value: string | null): string {
  return browseRefinements[category].choices.some(choice => choice.value === value) ? value! : "";
}

/** Only explicit catalog classifications filter plans. Personal details never imply eligibility. */
export function refineBrowsePlans(plans: Plan[], category: Category, focus: string): Plan[] {
  const selected = validBrowseFocus(category, focus);
  if (!selected || !browseRefinements[category].filtersCatalog) return plans;
  return plans.filter(plan => {
    if (plan.category !== category) return false;
    if (category === "travel") return plan.subtype === selected;
    if (category === "business") return plan.comparisonGroup === `business:${selected}`;
    if (category === "critical-illness") return selected === "all-diseases" || plan.comparisonGroup === `critical-illness:${selected}`;
    if (category === "motor") {
      if (selected === "compulsory") return plan.subtype === "compulsory";
      const cell = plan.coverageCells.class;
      if (cell?.status !== "known" || typeof cell.value !== "string") return false;
      const match = cell.value.match(/^ชั้น\s*(1|2\+|3\+)(?:\s|$)/);
      return match?.[1] === { "class-1": "1", "class-2plus": "2+", "class-3plus": "3+" }[selected];
    }
    const cell = plan.coverageCells.lifeType;
    if (cell?.status !== "known" || typeof cell.value !== "string") return false;
    return cell.value.includes({ "whole-life": "ตลอดชีพ", savings: "สะสมทรัพย์", term: "ชั่วระยะเวลา" }[selected] ?? "\u0000");
  });
}

export type BrowseQuoteContext = { category: Category; focus: string; answers: Record<string, string> };
export const browseContextStorageKey = (category: Category) => `insurance-browse-context-v1:${category}`;
export function cleanBrowseAnswers(category: Category, input: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(browseRefinements[category].fields.flatMap(field => {
    const raw = input[field.key];
    const value = typeof raw === "string" ? raw.trim().slice(0, 120) : "";
    if (!value || (field.options && !field.options.some(option => option.value === value))) return [];
    if (field.type === "number" && (!/^\d+$/.test(value) || Number(value) < field.min! || Number(value) > field.max!)) return [];
    if (field.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) return [];
    return [[field.key, value]];
  }));
}

export function browseContextMessage(context: BrowseQuoteContext): string {
  const names: Record<Category, string> = { health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ", travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด", pet:"สัตว์เลี้ยง", "critical-illness":"โรคร้ายแรง", cyber:"ไซเบอร์", business:"ธุรกิจและการก่อสร้าง", event:"งานอีเวนต์", sports:"กีฬาและกิจกรรม" };
  const config = browseRefinements[context.category];
  const focus = config.choices.find(choice => choice.value === context.focus)?.label;
  const answers = cleanBrowseAnswers(context.category, context.answers);
  return [`สนใจประกัน${names[context.category]}${focus ? ` · ${focus}` : ""}`, ...config.fields.filter(field => answers[field.key]).map(field => `${field.label}: ${answers[field.key]}`), "ช่วยตรวจเงื่อนไขและข้อมูลที่ต้องยืนยันก่อนขอใบเสนอราคาให้หน่อย ยังไม่ต้องยืนยันราคาเฉพาะบุคคล"].join("\n");
}

export function browseAnswersError(category: Category, answers: Record<string, string>): string {
  return category === "travel" && answers.departure && answers.return && answers.return < answers.departure
    ? "วันกลับต้องไม่ก่อนวันออกเดินทาง" : "";
}
