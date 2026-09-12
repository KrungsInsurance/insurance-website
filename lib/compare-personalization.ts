import { categoryFields } from "./catalog.ts";
import { priorityTopics, personaBudgetLabel, type DiscoveryPersona } from "./discovery-persona.ts";
import type { CustomerFacts } from "./customer-extraction.ts";
import { formatCoverageCell, formatPrice } from "./display.ts";
import type { Category, CoverageCell, Plan, Price } from "./types.ts";

const basisLabels: Record<string,string> = { per_year:"/ปี",per_disease:"/โรค",per_admission:"/การพักรักษา",per_day:"/วัน",per_occurrence:"/เหตุ",per_claim:"/การเคลม",per_accident:"/อุบัติเหตุ",per_trip:"/ทริป",per_person:"/คน",until_age:"(อายุ)",entry_age:"(อายุสมัคร)",coverage_term:"(คุ้มครอง)",payment_term:"(จ่ายเบี้ย)",single_payment:"(ครั้งเดียว)",shared_cap:"(วงเงินรวม)",per_visit:"/ครั้ง",waiting_period:"(รอคอย)",renewal_age:"(ต่ออายุ)",initial_sum_assured:"(ทุนเริ่มต้น)",policy_term:"(ระยะสัญญา)",delay_interval:"/ช่วงล่าช้า",per_delay_interval:"/ช่วงล่าช้า",selected_vehicle_sum:"(ทุนรถที่เลือก)",per_person_scope_unconfirmed:"/คน · รอยืนยันขอบเขต",per_occurrence_scope_unconfirmed:"/เหตุ · รอยืนยันขอบเขต",per_insured_driver_passenger:"/ผู้ขับขี่หรือผู้โดยสาร",selected_trip_duration:"(ทริปที่เลือก)",single_trip_max:"/ทริปสูงสุด",shared_building_contents:"(รวมบ้านและของ)",policy_limit:"/กรมธรรม์",per_admission_shared_room_icu:"/การพักรักษา · รวมห้อง/ICU",per_accident_lump_sum:"/อุบัติเหตุ · เงินก้อน",death_per_accident:"/เสียชีวิตจากอุบัติเหตุ",public_accident_death_total:"/เสียชีวิตอุบัติเหตุสาธารณะ",per_policy_year:"/ปีกรมธรรม์",selected_deductible:"(ส่วนแรกที่เลือก)" };
export function compactCoverage(cell:CoverageCell):string {
 const status={unknown:"รอยืนยัน",not_covered:"ไม่คุ้มครอง",not_applicable:"ไม่ใช้กับแผนนี้",conflicting:"ข้อมูลขัดกัน"};
 if(cell.status!=="known")return status[cell.status];
 const value=typeof cell.value==="number"?`${cell.value.toLocaleString("th-TH")}${cell.unit?` ${cell.unit}`:""}${basisLabels[cell.basis??""]??""}`:typeof cell.value==="boolean"?(cell.value?"คุ้มครอง":"ไม่คุ้มครอง"):cell.value&&cell.value.length<=28?cell.value:"ดูรายละเอียด";
 return `${cell.inclusion==="optional"?"ซื้อเพิ่ม · ":cell.inclusion==="unknown"?"รอยืนยันสิทธิ · ":""}${value}`;
}
export function compactPrice(price:Price):string {
 return formatPrice({...price,scenario:null,includes:null});
}

// Explicit vocabulary maps interests to catalog fields; it does not score plans.
const aliases:Record<string,RegExp>={room:/ค่าห้อง|ห้องโรงพยาบาล/,ipd:/ผู้ป่วยใน|(?<!ไม่)นอนโรงพยาบาล/,opd:/OPD|ผู้ป่วยนอก|ไม่นอนโรงพยาบาล/i,"cost-sharing":/ส่วนแรก|ร่วมจ่าย|จ่ายเอง/,conditions:/ระยะรอ|เงื่อนไข/,premium:/เบี้ย|งบ|ราคา/,family:/คนข้างหลัง|ครอบครัว|เสียชีวิต|ทุพพลภาพ/,savings:/ครบสัญญา|ออมเงิน/,cashback:/เงินคืน/,payment:/จ่ายเบี้ย|ชำระเบี้ย/,term:/ระยะคุ้มครอง|คุ้มครอง.*ปี/,investment:/ลงทุน|ผลตอบแทน/,collision:/รถชน|ค่าซ่อม|ซ่อมรถ/,"theft-fire":/รถหาย|ไฟไหม้/,flood:/น้ำท่วม|ภัยธรรมชาติ/,"third-party":/คู่กรณี|บุคคลภายนอก/,deductible:/ส่วนแรก|จ่ายเอง/,medical:/ค่ารักษา|เจ็บป่วย|บาดเจ็บ/,income:/ชดเชย|รายได้/,motorcycle:/มอเตอร์ไซค์|จักรยานยนต์/,occupation:/อาชีพ|กิจกรรม/,delay:/ล่าช้า|ดีเลย์/,cancellation:/ยกเลิก|ลดวันเดินทาง/,baggage:/กระเป๋า|สัมภาระ/,duration:/เดินทางบ่อย|ทริป|วันเดินทาง/,fire:/ไฟไหม้/,contents:/ตัวบ้าน|ของภายใน|ทรัพย์สิน/,burglary:/โจรกรรม|ขโมย/,eligibility:/โครงสร้าง|บ้านแบบ|พื้นที่/,activity:/กิจการ|กิจกรรม/,"per-event":/ต่อเหตุ/,annual:/รวมต่อปี|สะสม/,territory:/ประเทศ|พื้นที่/};
const negative=/ไม่(?:ต้องการ|สนใจ|เอา|จำเป็น|อยาก|กังวล|ห่วง|เน้น|ได้กังวล|ได้ต้องการ)|ไม่ใช่|ยกเลิกความสนใจ/;
const question=/คืออะไร|หมายถึง|อธิบาย|คือไร|มีอะไรบ้าง|ไหม|หรือเปล่า|\?/;
export type CompareInterest={id:string;label:string;fieldKeys:readonly string[];quote:string|null};
export function compareInterests(category:Category,persona:DiscoveryPersona|undefined,customer:CustomerFacts|undefined,messages:readonly {role:string;content:string}[]):CompareInterest[]{
 const userMessages=messages.filter(m=>m.role==="user").map(m=>m.content);
 const facts=customer?.category===category?[...customer.needs,...customer.concerns]:[];
 return priorityTopics[category].flatMap(topic=>{
  const pattern=aliases[topic.id];
  const matches=(text:string)=>text.includes(topic.label)||Boolean(pattern?.test(text));
  // A later explicit withdrawal overrides a saved persona interest or old extraction.
  const latest=userMessages.flatMap(text=>text.split(/[\n;。]+/)).filter(matches).filter(text=>!question.test(text)).at(-1);
  if(latest&&negative.test(latest))return [];
  const fact=[...facts].reverse().find(f=>matches(f.quote)&&!negative.test(f.quote)&&!question.test(f.quote)&&userMessages.some(text=>text.includes(f.quote)));
  if(!fact&&!(persona?.category===category&&persona.priorities.includes(topic.id)))return [];
  return [{id:topic.id,label:topic.label,fieldKeys:topic.fieldKeys,quote:fact?.quote??null}];
 }).slice(0,3);
}
export function planInterestReasons(plan:Plan,interests:readonly CompareInterest[]){
 return interests.map(interest=>{
  if(interest.id==="premium")return {interest,fieldKey:"premiumTHB",label:"เบี้ยประกัน",summary:compactPrice(plan.price),detail:formatPrice(plan.price),sourceIds:plan.price.sourceIds,kind:"check" as const};
  const keys=interest.fieldKeys.filter(key=>plan.coverageCells[key]);
  const key=keys.find(key=>{const c=plan.coverageCells[key];return c.status==="known"&&c.inclusion==="included"&&c.value!==false&&c.value!==0&&c.sourceIds.length;})??keys[0];
  const cell=key?plan.coverageCells[key]:undefined;
  const supported=cell?.status==="known"&&cell.inclusion==="included"&&cell.value!==false&&cell.value!==0&&cell.sourceIds.some(id=>plan.sources.some(s=>s.id===id));
  return {interest,fieldKey:key??interest.id,label:categoryFields[plan.category].find(field=>field.key===key)?.label??interest.label,summary:cell?compactCoverage(cell):"รอยืนยัน",detail:cell?formatCoverageCell(cell):"ยังไม่มีข้อมูลยืนยันหัวข้อนี้",sourceIds:cell?.sourceIds??[],kind:supported?"fact" as const:"check" as const};
 });
}

const shortLabels:Record<string,string>={petType:"สัตว์ที่รับ",treatmentScope:"การรักษา",petLiability:"ความรับผิด",benefitLimit:"วงเงิน",waitingPeriod:"รอคอย",petEligibility:"คุณสมบัติสัตว์",coveredConditions:"โรคที่คุ้มครอง",benefitType:"ผลประโยชน์",basePolicy:"สัญญาหลัก",eligibilityConditions:"การสมัคร",coveredActivity:"ขอบเขต",responseCosts:"ค่าแก้ไขเหตุ",businessInterruption:"ธุรกิจหยุดชะงัก",thirdPartyLiability:"ความรับผิด",businessType:"ประเภทกิจการ",territory:"พื้นที่คุ้มครอง",eventType:"ประเภทงาน",cancellationScope:"ยกเลิกงาน",lossOfProfit:"กำไรที่สูญเสีย",weddingEligibility:"รับงานแต่งไหม",sportType:"ชนิดกีฬา",accidentScope:"อุบัติเหตุ",equipmentScope:"อุปกรณ์",perAdmissionLimit:"วงเงิน/การพักรักษา",deductible:"ส่วนแรก",roomMaxDays:"ค่าห้องสูงสุด",icuMaxDays:"ICU สูงสุด",copay:"ร่วมจ่าย",thirdPartyBodilyPerPerson:"คู่กรณี/คน",thirdPartyBodilyPerEvent:"คู่กรณี/เหตุ",thirdPartyProperty:"ทรัพย์สินคู่กรณี",voluntaryMedicalPerPerson:"ค่ารักษา (สมัครใจ)",medicalPerPerson:"ค่ารักษา (พ.ร.บ.)",deathFormula:"เสียชีวิต",maturityFormula:"ครบสัญญา",nonGuaranteedBenefit:"ไม่รับประกัน",guaranteedCashback:"เงินคืน",hospitalAdmissionBenefit:"เงินก้อนนอน รพ.",motorcycleBenefit:"มอเตอร์ไซค์",homicideBenefit:"ถูกทำร้าย",publicAccidentBenefit:"อุบัติเหตุสาธารณะ",medicalPerAccident:"ค่ารักษา/อุบัติเหตุ",deathBenefit:"เสียชีวิต",evacuationLimit:"เคลื่อนย้ายฉุกเฉิน",delayHours:"ล่าช้าเริ่มจ่าย",delayPayment:"จ่าย/ช่วงล่าช้า",delayTrigger:"เหตุที่จ่าย",combinedPropertyLimit:"ทุนบ้านและของ",bundledLiability:"ความรับผิดพ่วง",sharedNaturalPerilsLimit:"รวมภัยธรรมชาติ",occupancy:"การใช้งานบ้าน",valuation:"มูลค่าทรัพย์สิน"};
export function compactFieldLabel(key:string,label:string):string{return shortLabels[key]??label;}

export type CompareBudget={label:string;quote:string|null};
export function compareBudget(category:Category,persona:DiscoveryPersona|undefined,customer:CustomerFacts|undefined,messages:readonly {role:string;content:string}[]):CompareBudget|undefined {
 const budget=customer?.category===category&&customer.budget&&messages.some(message=>message.role==="user"&&message.content.includes(customer.budget!.quote))?customer.budget:null;
 if(budget){
  const period=({year:"/ปี",month:"/เดือน",trip:"/ทริป",single:"/ครั้ง",unspecified:""})[budget.period];
  // A supported correction replaces the earlier range, including a decision to leave it open.
  if(/ยังไม่กำหนดงบ|ไม่กำหนดงบ|ยังไม่(?:ทราบ|รู้|แน่ใจ).*งบ|ให้เราออกแบบให้/.test(budget.quote))return {label:"ยังไม่กำหนดงบ",quote:budget.quote};
  if(/ไม่จำกัดงบ/.test(budget.quote))return {label:"ยังไม่ตั้งเพดานงบ",quote:budget.quote};
  const range=budget.quote.match(/(?:น้อยกว่า|มากกว่า)\s*[\d,]+\s*บาท|[\d,]+\s*[–-]\s*[\d,]+\s*บาท/);
  if(range)return {label:`${range[0]}${period}`,quote:budget.quote};
  if(budget.amountTHB!==null)return {label:`${budget.amountTHB.toLocaleString("th-TH")} บาท${period}`,quote:budget.quote};
  return {label:"ตามข้อมูลที่แจ้ง",quote:budget.quote};
 }
 return persona?.category===category&&persona.budgetBand&&persona.budgetBand!=="unknown"?{label:personaBudgetLabel(persona),quote:null}:undefined;
}
