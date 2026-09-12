import { getPlan } from "./catalog.ts";
import { buildAssistantOverview } from "./assistant-overview.ts";
import { emptyCustomerFacts } from "./customer-extraction.ts";
import type { Category, Lead } from "./types.ts";

type DemoCase = { id: string; name: string; category: Category; need: string; concern: string; coverage: string; question: string; budget: number | null; plans: string[]; contact: "line" | "phone" | "email"; window: Lead["contactWindow"]; reply: string };
export const brokerDemoCases: readonly DemoCase[] = [
  { id:"group-topup",name:"คุณเมย์ · เพิ่มจากประกันกลุ่ม",category:"health",need:"อยากเพิ่มประกันสุขภาพจากประกันกลุ่ม",concern:"กังวลค่าห้องโรงพยาบาลเอกชน",coverage:"ประกันกลุ่มจ่ายค่าห้อง 2,000 บาทต่อวัน",question:"OPD ต้องซื้อเพิ่มไหม",budget:20000,plans:["health-01","health-02","health-06"],contact:"line",window:"evening",reply:"ค่าห้องที่เล็งไว้ประมาณ 4,000 บาทต่อวันค่ะ ประกันกลุ่มจ่าย 2,000 บาท อยากเน้นส่วนผู้ป่วยในก่อน OPD ยังไม่จำเป็น ขอเทียบเบี้ยจริงด้วยค่ะ" },
  { id:"freelance-opd",name:"คุณต้น · อยากรวม OPD",category:"health",need:"เป็นฟรีแลนซ์ อยากมีทั้ง IPD และ OPD",concern:"กังวลค่าใช้จ่ายผู้ป่วยนอก",coverage:"ยังไม่มีประกันสุขภาพส่วนตัว",question:"OPD ต่อปีต่างกับต่อครั้งยังไง",budget:null,plans:["health-02","health-03","health-04"],contact:"line",window:"afternoon",reply:"ผมอยากรวม OPD ด้วยครับ ปกติจ่ายครั้งละประมาณ 1,500 บาท อยากดูทั้งเพดานต่อครั้งและต่อปี ยังไม่ตั้งงบจนกว่าจะเห็นเบี้ยรวมครับ" },
  { id:"home-flood",name:"คุณแอน · บ้านและภัยน้ำท่วม",category:"property",need:"อยากคุ้มครองบ้านและทรัพย์สินจากน้ำท่วมและไฟไหม้",concern:"กังวลน้ำท่วม วงเงินร่วมกับภัยอื่นไหม",coverage:"มีประกันอัคคีภัยกับสินเชื่อบ้าน แต่ยังไม่ทราบวงเงินน้ำท่วม",question:"ต้องขอใบเสนอราคาจากข้อมูลอะไรบ้าง",budget:null,plans:["property-01","property-06"],contact:"email",window:"morning",reply:"เป็นบ้านอยู่อาศัยสองชั้นค่ะ อยากแยกทุนตัวบ้านกับของในบ้านก่อน และอยากยืนยันวงเงินน้ำท่วมโดยเฉพาะ เดี๋ยวเตรียมรายละเอียดกรมธรรม์เดิมให้ค่ะ" },
  { id:"motor-renew",name:"คุณนนท์ · ต่อประกันรถ",category:"motor",need:"อยากเทียบประกันรถชั้น 1 กับ 2+ ก่อนต่ออายุ",concern:"กังวลรถชนกับรถสูญหาย",coverage:"มีประกันรถชั้น 1 กำลังจะหมดอายุ",question:"ชนแบบไม่มีคู่กรณีกับค่าเสียหายส่วนแรกต่างกันยังไง",budget:18000,plans:["motor-01","motor-06","motor-07"],contact:"phone",window:"evening",reply:"ใช้รถน้ำมันไปทำงานทุกวันครับ อยากคุ้มครองชนแบบไม่มีคู่กรณีด้วย ขอเทียบรูปแบบซ่อมและค่าเสียหายส่วนแรกก่อน ยังไม่เลือกจากราคาอย่างเดียวครับ" },
  { id:"daily-income",name:"คุณฝน · รายได้ช่วงพักรักษา",category:"accident",need:"อยากมีค่ารักษาอุบัติเหตุและชดเชยรายวัน",concern:"กังวลไม่มีรายได้ตอนนอนโรงพยาบาล",coverage:"มีสิทธิรักษาเดิม แต่ไม่มีประกันอุบัติเหตุส่วนตัว",question:"ชดเชยรายวันต้องนอนโรงพยาบาลกี่วัน",budget:null,plans:["accident-02","accident-04","accident-05"],contact:"line",window:"afternoon",reply:"อยากชดเชยรายได้ช่วงนอนโรงพยาบาลจากอุบัติเหตุค่ะ ต้องตรวจเงื่อนไขอาชีพกับจำนวนวันที่จ่ายด้วย ขอรายละเอียดก่อนเลือกทุนค่ะ" },
  { id:"travel-family",name:"คุณปาล์ม · ทริปต่างประเทศ",category:"travel",need:"อยากทำประกันเดินทางต่างประเทศให้ครอบครัว",concern:"กังวลค่ารักษาและเที่ยวบินล่าช้า",coverage:"ยังไม่ได้ซื้อประกันสำหรับทริปนี้",question:"ความคุ้มครองเที่ยวบินล่าช้าเริ่มจ่ายเมื่อไร",budget:null,plans:["travel-01","travel-02","travel-07"],contact:"email",window:"evening",reply:"จะไปญี่ปุ่น 7 วันค่ะ อยากตรวจพื้นที่คุ้มครอง อายุผู้เดินทาง และเกณฑ์จ่ายเมื่อเที่ยวบินล่าช้า ก่อนขอราคาของทุกคนค่ะ" },
];

export function createBrokerDemoLeads(now = new Date()): Lead[] {
  return brokerDemoCases.map((item,index)=>{
    const date=new Date(now.getTime()-(index+1)*3600000).toISOString();
    const fact=(text:string)=>({text,quote:text});
    const budgetQuote=item.budget===null?"ยังไม่กำหนดงบ ขอเห็นความต่างก่อน":`งบ ${item.budget.toLocaleString("en-US")} บาทต่อปี`;
    const customer={...emptyCustomerFacts(),needs:[fact(item.need)],concerns:[fact(item.concern)],currentCoverage:[fact(item.coverage)],questions:[fact(item.question)],category:item.category,categoryQuote:item.need,budget:item.budget===null?null:{amountTHB:item.budget,period:"year" as const,quote:budgetQuote}};
    const plans=item.plans.map(id=>{const plan=getPlan(id);if(!plan)throw new Error(`Missing demo plan: ${id}`);return plan;});
    return {id:`broker-demo-${item.id}`,demoCaseId:item.id,demoContact:item.contact,customerId:"demo-customer",displayName:item.name,status:"new",createdAt:date,updatedAt:date,consentAt:date,contactWindow:item.window,
      summary:{category:item.category,budgetTHB:item.budget,needs:[item.need],questions:[item.question],currentCoverage:[item.coverage],comparedPlanIds:item.plans,interestedPlanIds:[],generatedAt:date,sourceMode:"mock",editedByUser:false,overview:{...buildAssistantOverview(customer,item.plans,item.plans,"mock"),generatedAt:date}},
      transcript:[{role:"user",content:[item.need,item.concern,item.coverage,item.question,budgetQuote].join("\n")},{role:"assistant",mode:"mock",content:"รวบรวมข้อมูลไว้ให้ Broker แล้ว เพื่อช่วยตรวจเงื่อนไขและคุยต่อ"}],planFacts:structuredClone(plans),notes:"",calls:[],brokerMessages:[]};
  });
}

export function mergeBrokerDemoLeads(existing: Lead[]): Lead[] {
  return [...existing,...createBrokerDemoLeads().filter(sample=>!existing.some(lead=>lead.id===sample.id))];
}

export function demoCustomerReply(lead: Lead, message: string): string {
  const item=brokerDemoCases.find(item=>item.id===lead.demoCaseId);
  if (/สวัสดี|สะดวกคุย/.test(message) && message.length<120) return "สวัสดีค่ะ สะดวกคุยทางแชตตอนนี้ค่ะ ขอเริ่มจากคำถามที่ฝากไว้ก่อนนะคะ";
  if (/ใบเสนอราคา|รายละเอียดกรมธรรม์/.test(message) && message.length<160) return "ขอดูรายละเอียดและรายการข้อมูลที่ต้องเตรียมก่อนค่ะ ยังไม่ยืนยันซื้อในตอนนี้";
  return item?.reply??"ขอให้ช่วยอธิบายความต่างของแผนกับเงื่อนไขที่ต้องตรวจเพิ่มเติมก่อนค่ะ ยังไม่ตัดสินใจเลือกแผน";
}
