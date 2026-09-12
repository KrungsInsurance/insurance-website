import { catalog, categoryFields } from "./catalog.ts";
import { arePlansCompatible } from "./compare.ts";
import { z } from "zod";
import { categories } from "./types.ts";
import type { Category, Plan } from "./types.ts";

export const ageBands = [
  { id: "18-20", label: "18–20 ปี", image: "/images/personas/age-18-20.png" },
  { id: "21-30", label: "21–30 ปี", image: "/images/personas/age-21-30.png" },
  { id: "31-45", label: "31–45 ปี", image: "/images/personas/age-31-45.png" },
  { id: "46-60", label: "46–60 ปี", image: "/images/personas/age-46-60.png" },
  { id: "61-plus", label: "61 ปีขึ้นไป", image: "/images/personas/age-61-plus.png" },
] as const;

export const budgetBands = [
  { id: "unknown", label: "ให้เราออกแบบให้" },
  { id: "under-10000", label: "น้อยกว่า 10,000 บาท" },
  { id: "10000-19999", label: "10,000–19,999 บาท" },
  { id: "20000-29999", label: "20,000–29,999 บาท" },
  { id: "30000-50000", label: "30,000–50,000 บาท" },
  { id: "over-50000", label: "มากกว่า 50,000 บาท" },
] as const;
export type BudgetBand = (typeof budgetBands)[number]["id"];
export function personaBudgetLabel(persona?: Pick<DiscoveryPersona,"budgetBand">):string {
 const band=budgetBands.find(band=>band.id===persona?.budgetBand);
 return !band||band.id==="unknown"?"ยังไม่กำหนดงบ":`${band.label} / ปี`;
}

export type AgeBand = (typeof ageBands)[number]["id"];
export const genderOptions = [
  { id: "unspecified", label: "ไม่ระบุ" },
  { id: "female", label: "หญิง" },
  { id: "male", label: "ชาย" },
  { id: "other", label: "อื่น ๆ" },
] as const;
export type PersonaGender = (typeof genderOptions)[number]["id"];
// This records a demo UI choice only. It does not authorize or initiate real data access.
export type YourDataConsent = "accepted" | "declined";
export type DiscoveryPersona = {
  nickname: string;
  ageBand: AgeBand;
  budgetBand?: BudgetBand;
  gender?: PersonaGender;
  yourDataConsent?: YourDataConsent;
  category: Category;
  priorities: string[];
  journey: "browse" | "compare" | "ask";
};
export const maxPersonaPriorities = 3;

type PriorityTopic = { id: string; label: string; description: string; fieldKeys: readonly string[] };
export const priorityTopics: Record<Category, readonly PriorityTopic[]> = {
  pet: [
    { id: "treatment", label: "ค่ารักษาน้องหมาน้องแมว", description: "แยกอุบัติเหตุและเจ็บป่วยตามแผน", fieldKeys: ["treatmentScope", "benefitLimit"] },
    { id: "liability", label: "ความเสียหายที่สัตว์เลี้ยงก่อ", description: "ขอบเขตความรับผิดต่อคนอื่น", fieldKeys: ["petLiability"] },
    { id: "conditions", label: "อายุและระยะรอคอย", description: "ตรวจคุณสมบัติและประวัติสุขภาพสัตว์เลี้ยง", fieldKeys: ["petEligibility", "waitingPeriod"] },
  ],
  "critical-illness": [
    { id: "cancer", label: "โรคมะเร็ง", description: "ระยะโรคและผลประโยชน์ตามคำนิยาม", fieldKeys: ["coveredConditions", "benefitType"] },
    { id: "multi-disease", label: "หลายกลุ่มโรคร้ายแรง", description: "เปรียบเทียบกลุ่มโรคและวิธีจ่าย", fieldKeys: ["coveredConditions", "benefitType"] },
    { id: "conditions", label: "การสมัครและสัญญาหลัก", description: "ระยะรอคอยและการพ่วงประกันชีวิต", fieldKeys: ["basePolicy", "waitingPeriod", "eligibilityConditions"] },
  ],
  cyber: [
    { id: "data", label: "ข้อมูลรั่วไหล", description: "ความเสี่ยงขององค์กรและข้อมูลลูกค้า", fieldKeys: ["coveredActivity", "thirdPartyLiability"] },
    { id: "response", label: "รับมือเมื่อเกิดเหตุ", description: "ค่าใช้จ่ายตอบสนองและกู้คืน", fieldKeys: ["responseCosts"] },
    { id: "interruption", label: "ธุรกิจหยุดชะงัก", description: "ความสูญเสียและเงื่อนไขของแผน", fieldKeys: ["businessInterruption", "benefitLimit"] },
  ],
  business: [
    { id: "sme", label: "ร้านค้าและ SME", description: "แพ็กความเสี่ยงสำหรับกิจการ", fieldKeys: ["businessType", "coveredActivity"] },
    { id: "construction", label: "ก่อสร้างและติดตั้ง", description: "งานตามสัญญาและความรับผิดต่อบุคคลอื่น", fieldKeys: ["coveredActivity", "thirdPartyLiability"] },
    { id: "cargo", label: "ขนส่งสินค้า", description: "สินค้า เส้นทางและเหตุที่คุ้มครอง", fieldKeys: ["coveredActivity", "territory"] },
    { id: "machinery", label: "เครื่องจักรและทรัพย์สิน", description: "ความเสียหายกับทรัพย์สินธุรกิจ", fieldKeys: ["businessType", "benefitLimit"] },
  ],
  event: [
    { id: "wedding", label: "งานแต่งงาน", description: "ให้บริษัทตรวจว่ารับงานและเหตุใดบ้าง", fieldKeys: ["weddingEligibility", "eventType"] },
    { id: "cancellation", label: "ยกเลิกหรือเลื่อนงาน", description: "ค่าใช้จ่ายที่จ่ายไปและเหตุที่ยอมรับ", fieldKeys: ["cancellationScope", "benefitLimit"] },
    { id: "profit", label: "รายได้จากงาน", description: "ตรวจการขยายความคุ้มครองกำไร", fieldKeys: ["lossOfProfit"] },
  ],
  sports: [
    { id: "accident", label: "อุบัติเหตุระหว่างเล่น", description: "ตรวจชนิดกีฬาและพื้นที่คุ้มครอง", fieldKeys: ["sportType", "accidentScope", "territory"] },
    { id: "equipment", label: "อุปกรณ์กีฬา", description: "อุปกรณ์สูญหายหรือเสียหาย", fieldKeys: ["equipmentScope", "benefitLimit"] },
    { id: "liability", label: "ความเสียหายกับผู้อื่น", description: "เหตุและวงเงินความรับผิด", fieldKeys: ["thirdPartyLiability"] },
  ],
  health: [
    { id: "room", label: "ค่าห้องโรงพยาบาล", description: "วงเงินและรูปแบบห้องที่คุ้มครอง", fieldKeys: ["roomPerDay", "roomBasis"] },
    { id: "ipd", label: "ค่ารักษาผู้ป่วยใน", description: "วงเงินต่อปี ต่อโรค หรือต่อการเข้าพัก", fieldKeys: ["annualLimit", "perDiseaseLimit", "perAdmissionLimit"] },
    { id: "opd", label: "พบแพทย์แบบไม่นอนโรงพยาบาล", description: "OPD ที่รวมในแผนหรือต้องซื้อเพิ่ม", fieldKeys: ["opdPerYear", "opdPerVisit"] },
    { id: "cost-sharing", label: "ส่วนที่ต้องจ่ายเอง", description: "ความรับผิดส่วนแรกและการร่วมจ่าย", fieldKeys: ["deductible", "copay"] },
    { id: "conditions", label: "เงื่อนไขและระยะรอคอย", description: "สิ่งที่ต้องตรวจให้ชัดก่อนสมัคร", fieldKeys: ["waitingDays", "eligibilityConditions"] },
    { id: "premium", label: "เบี้ยและการขอราคา", description: "ทำความเข้าใจราคาโดยยังไม่ต้องตั้งงบ", fieldKeys: [] },
  ],
  life: [
    { id: "family", label: "ดูแลคนข้างหลัง", description: "ทุนประกันและผลประโยชน์เสียชีวิต", fieldKeys: ["deathFormula", "sumAssured"] },
    { id: "savings", label: "เงินเมื่อครบสัญญา", description: "ผลประโยชน์และระยะเวลาที่ต้องถือ", fieldKeys: ["maturityFormula", "coverageYears"] },
    { id: "cashback", label: "เงินคืนระหว่างทาง", description: "เงินคืนที่รับประกันตามสัญญา", fieldKeys: ["guaranteedCashback"] },
    { id: "payment", label: "ระยะเวลาจ่ายเบี้ย", description: "จำนวนปีและรอบชำระเบี้ย", fieldKeys: ["paymentYears", "paymentFrequency"] },
    { id: "term", label: "ระยะความคุ้มครอง", description: "คุ้มครองกี่ปีหรือถึงอายุเท่าไร", fieldKeys: ["coverageYears", "coverageUntilAge", "lifeType"] },
    { id: "investment", label: "ผลตอบแทนที่ไม่รับประกัน", description: "แยกส่วนรับประกันออกจากส่วนที่ผันแปร", fieldKeys: ["nonGuaranteedBenefit"] },
  ],
  motor: [
    { id: "collision", label: "รถชนและค่าซ่อม", description: "เงื่อนไขการชนและความเสียหายรถเรา", fieldKeys: ["collisionLimit", "ownDamageLimit", "repairType"] },
    { id: "theft-fire", label: "รถหายหรือไฟไหม้", description: "ทุนและเงื่อนไขของแต่ละภัย", fieldKeys: ["theftLimit", "fireLimit"] },
    { id: "flood", label: "น้ำท่วม", description: "ตรวจวงเงินภัยธรรมชาติที่ระบุจริง", fieldKeys: ["floodLimit"] },
    { id: "third-party", label: "ความเสียหายคู่กรณี", description: "ชีวิต ร่างกาย และทรัพย์สินบุคคลภายนอก", fieldKeys: ["thirdPartyBodilyPerPerson", "thirdPartyProperty"] },
    { id: "deductible", label: "ค่าเสียหายส่วนแรก", description: "จำนวนและเงื่อนไขที่ต้องจ่ายเอง", fieldKeys: ["deductible"] },
    { id: "premium", label: "เบี้ยและการขอราคา", description: "ราคาเฉพาะรุ่นรถและรูปแบบความคุ้มครอง", fieldKeys: ["class"] },
  ],
  accident: [
    { id: "medical", label: "ค่ารักษาอุบัติเหตุ", description: "วงเงินต่ออุบัติเหตุและข้อจำกัด", fieldKeys: ["medicalPerAccident"] },
    { id: "income", label: "เงินชดเชยระหว่างพักรักษา", description: "เงินรายวันหรือเงินก้อนตามเงื่อนไข", fieldKeys: ["dailyAllowance", "dailyMaxDays", "hospitalAdmissionBenefit"] },
    { id: "family", label: "เสียชีวิตหรือทุพพลภาพ", description: "ผลประโยชน์กรณีอุบัติเหตุรุนแรง", fieldKeys: ["deathBenefit", "disabilityBenefit"] },
    { id: "motorcycle", label: "ขับขี่หรือซ้อนมอเตอร์ไซค์", description: "ตรวจเงื่อนไขอุบัติเหตุรถจักรยานยนต์", fieldKeys: ["motorcycleBenefit"] },
    { id: "occupation", label: "อาชีพและกิจกรรม", description: "กลุ่มอาชีพและกิจกรรมที่รับประกัน", fieldKeys: ["occupationClass"] },
  ],
  travel: [
    { id: "medical", label: "ค่ารักษาระหว่างเดินทาง", description: "บาดเจ็บ เจ็บป่วย และการเคลื่อนย้าย", fieldKeys: ["medicalLimit", "evacuationLimit"] },
    { id: "delay", label: "เที่ยวบินล่าช้า", description: "สาเหตุ ระยะเวลารอ และวงเงิน", fieldKeys: ["delayHours", "delayPayment", "delayLimit", "delayTrigger"] },
    { id: "cancellation", label: "ยกเลิกหรือลดวันเดินทาง", description: "เหตุที่คุ้มครองและค่าใช้จ่ายที่เบิกได้", fieldKeys: ["cancellationLimit", "interruptionLimit"] },
    { id: "baggage", label: "กระเป๋าและสัมภาระ", description: "วงเงินรวมและข้อจำกัดต่อชิ้น", fieldKeys: ["baggageLimit"] },
    { id: "duration", label: "ทริปสั้นหรือเดินทางบ่อย", description: "รายเที่ยว รายปี และจำนวนวันต่อทริป", fieldKeys: ["policyDuration", "maxTripDays", "region"] },
  ],
  property: [
    { id: "fire", label: "ไฟไหม้บ้าน", description: "อัคคีภัยและภัยที่รวมในความคุ้มครอง", fieldKeys: ["fireCoverage", "includedPerils"] },
    { id: "flood", label: "น้ำท่วมและภัยธรรมชาติ", description: "วงเงินเฉพาะภัยหรือวงเงินรวม", fieldKeys: ["floodLimit", "sharedNaturalPerilsLimit"] },
    { id: "contents", label: "ตัวบ้านและของภายใน", description: "ทุนอาคาร ทรัพย์สิน และเกณฑ์มูลค่า", fieldKeys: ["buildingLimit", "contentsLimit", "combinedPropertyLimit"] },
    { id: "burglary", label: "โจรกรรมทรัพย์สิน", description: "เหตุและเงื่อนไขการโจรกรรมที่คุ้มครอง", fieldKeys: ["burglaryCoverage"] },
    { id: "eligibility", label: "บ้านแบบไหนทำได้", description: "การใช้งาน โครงสร้าง และพื้นที่รับประกัน", fieldKeys: ["occupancy", "construction", "locationRestrictions"] },
    { id: "premium", label: "ข้อมูลที่ใช้ขอราคา", description: "รายละเอียดบ้านและทุนที่ต้องแจ้ง", fieldKeys: ["valuation", "deductible"] },
  ],
  liability: [
    { id: "activity", label: "กิจการและกิจกรรม", description: "งานหรือสถานที่แบบใดอยู่ในความคุ้มครอง", fieldKeys: ["coveredActivity"] },
    { id: "per-event", label: "วงเงินต่อเหตุ", description: "ขอบเขตความรับผิดต่อหนึ่งเหตุการณ์", fieldKeys: ["perOccurrenceLimit"] },
    { id: "annual", label: "วงเงินรวมต่อปี", description: "วงเงินสะสมและเงื่อนไขการขอราคา", fieldKeys: ["aggregateLimit"] },
    { id: "deductible", label: "ค่าเสียหายส่วนแรก", description: "ส่วนที่กิจการต้องรับผิดชอบเอง", fieldKeys: ["deductible"] },
    { id: "territory", label: "พื้นที่ความคุ้มครอง", description: "ประเทศหรือพื้นที่ที่กรมธรรม์ใช้ได้", fieldKeys: ["territory"] },
  ],
};

export const discoveryPersonaSchema = z.object({
  nickname: z.string().trim().min(1).max(60),
  ageBand: z.enum(ageBands.map(band => band.id) as [AgeBand, ...AgeBand[]]),
  budgetBand: z.enum(budgetBands.map(band=>band.id) as [BudgetBand,...BudgetBand[]]).optional(),
  gender: z.enum(["female", "male", "other", "unspecified"]).optional(),
  yourDataConsent: z.enum(["accepted", "declined"]).optional(),
  category: z.enum(categories),
  priorities: z.array(z.string()).min(1).max(maxPersonaPriorities),
  journey: z.enum(["browse", "compare", "ask"]),
}).strict().superRefine((persona, context) => {
  if (new Set(persona.priorities).size !== persona.priorities.length
      || persona.priorities.some(id => !priorityTopics[persona.category].some(topic => topic.id === id))) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["priorities"], message: "เลือกหัวข้อในประเภทประกันนี้โดยไม่ซ้ำกัน" });
  }
});

function selectedTopics(persona: DiscoveryPersona) {
  return [...new Set(persona.priorities)].slice(0, maxPersonaPriorities)
    .flatMap(id => priorityTopics[persona.category].filter(topic => topic.id === id));
}

export function personaFieldKeys(persona: DiscoveryPersona): string[] {
  const fields = selectedTopics(persona).flatMap(topic => topic.fieldKeys);
  return [...new Set(fields.length ? fields : categoryFields[persona.category].slice(0, 5).map(field => field.key))].slice(0, 8);
}

// This selects examples to inspect, not eligibility, affordability or a best-plan score.
// Unknown coverage never counts as evidence that a requested benefit is present.
export function selectPersonaPlans(persona: DiscoveryPersona): Plan[] {
  if (persona.journey !== "compare") return [];
  const topics = selectedTopics(persona);
  const preferredGroup = persona.category === "critical-illness" ? (persona.priorities.includes("multi-disease") ? "critical-illness:multi-disease" : "critical-illness:cancer") : persona.category === "business" ? `business:${persona.priorities.find(id => ["sme", "construction", "cargo", "machinery"].includes(id)) ?? "sme"}` : undefined;
  const pool = catalog.filter(plan => plan.category === persona.category
    && (!preferredGroup || plan.comparisonGroup === preferredGroup)
    && (plan.category !== "motor" || plan.subtype === "voluntary")
    && (plan.category !== "travel" || plan.subtype === "outbound"));
  const supportedTopics = (plan: Plan) => topics.filter(topic => topic.fieldKeys.some(key => {
    const cell = plan.coverageCells[key];
    return cell?.status === "known" && cell.value !== false && cell.value !== 0;
  })).length;
  const ordered = pool.slice().sort((a, b) => supportedTopics(b) - supportedTopics(a) || a.id.localeCompare(b.id));
  const selected: Plan[] = [];
  const products = new Set<string>();
  for (const plan of ordered) {
    if (products.has(plan.productId) || !arePlansCompatible([...selected, plan])) continue;
    selected.push(plan);
    products.add(plan.productId);
    if (selected.length === 3) return selected;
  }
  for (const plan of ordered) {
    if (!selected.includes(plan) && arePlansCompatible([...selected, plan])) selected.push(plan);
    if (selected.length === 3) break;
  }
  return selected;
}

const categoryNames: Record<Category, string> = {
  health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ",
  travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด", pet:"สัตว์เลี้ยง", "critical-illness":"โรคร้ายแรง", cyber:"ไซเบอร์", business:"ธุรกิจและการก่อสร้าง", event:"งานอีเวนต์", sports:"กีฬาและกิจกรรม",
};

/** A user-side opening: only facts explicitly supplied in onboarding. */
export function personaOpening(persona: DiscoveryPersona): string {
  const topics = selectedTopics(persona).map(topic => topic.label).join(" / ");
  const age = ageBands.find(band => band.id === persona.ageBand)!.label;
  const budget=persona.budgetBand&&persona.budgetBand!=="unknown"?`\nเงินที่อยากใช้กับประกันต่อปี: ${budgetBands.find(band=>band.id===persona.budgetBand)!.label} (ช่วงงบประมาณ)`:"";
  const gender = persona.gender && persona.gender !== "unspecified" ? ` ระบุเพศ${genderOptions.find(option => option.id === persona.gender)!.label}` : "";
  const context = `ชื่อเล่นของฉันคือ ${persona.nickname.trim()} อยู่ในช่วงอายุ ${age}${gender} สนใจประกัน${categoryNames[persona.category]}${topics ? ` โดยอยากเข้าใจเรื่อง ${topics}` : ""}${budget}`;
  if (persona.journey === "ask") return `${context}\nขอสอบถามข้อมูลเพิ่มเติมก่อน ช่วยถามสิ่งที่ฉันอยากรู้และอธิบายให้เข้าใจ ยังไม่ต้องเสนอแผนประกัน`;
  if (persona.journey === "browse") return `${context}\nขอค้นหาและดูรายละเอียดแผนด้วยตัวเองก่อน`;
  return `${context}\nอยากให้ผู้ช่วยรวบรวมแผนที่เกี่ยวข้องมาเปรียบเทียบให้ก่อน แล้วช่วยถามข้อมูลที่ต้องยืนยันเพิ่มเติมเพื่อคุยกับผู้เชี่ยวชาญ`;
}
