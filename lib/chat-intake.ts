import type { Category } from "./types";

export type IntakeField = { key:string; label:string; placeholder:string; options?:string[] };
export type IntakeCard = { type:"intake"; category:Category; fieldKeys:string[] };
const field=(key:string,label:string,placeholder:string,options?:string[]):IntakeField=>({key,label,placeholder,...(options?{options}:{})});
export const intakeTemplates:Record<Category,{title:string;fields:IntakeField[]}>= {
 motor:{title:"ข้อมูลรถของคุณ",fields:[field("motor_type","ประเภทรถ","เลือกรถที่ใช้",["เก๋ง","SUV","กระบะ","รถตู้","อื่น ๆ"]),field("motor_year","ปีรถ","เช่น 2007"),field("motor_model","ยี่ห้อ / รุ่น","เช่น Toyota Fortuner")]},
 health:{title:"ความคุ้มครองที่อยากได้",fields:[field("health_cover","ค่ารักษาที่สนใจ","เลือกความคุ้มครอง",["นอนโรงพยาบาล (IPD)","ตรวจแล้วกลับบ้าน (OPD)","ทั้ง IPD และ OPD","อยากเข้าใจก่อน"]),field("health_concern","กังวลเรื่องไหน","เช่น ค่าห้อง หรือค่ารักษาก้อนใหญ่")]},
 life:{title:"เป้าหมายของคุณ",fields:[field("life_goal","อยากดูแลเรื่องไหน","เลือกเป้าหมาย",["ดูแลคนข้างหลัง","เก็บเงิน","เกษียณ","อยากเข้าใจก่อน"]),field("life_horizon","ระยะเวลาที่คิดไว้","เช่น 10 ปี หรือยังไม่แน่ใจ")]},
 accident:{title:"สิ่งที่อยากให้ช่วยดูแล",fields:[field("accident_cover","ความคุ้มครอง","เลือกสิ่งที่สนใจ",["ค่ารักษา","ชดเชยรายได้","ทั้งสองอย่าง"]),field("accident_concern","กังวลเหตุการณ์ไหน","เช่น อุบัติเหตุระหว่างเดินทาง")]},
 travel:{title:"ข้อมูลทริปของคุณ",fields:[field("travel_destination","ประเทศปลายทาง","เช่น ญี่ปุ่น"),field("travel_dates","ช่วงเดินทาง","เช่น 1–7 ธันวาคม")]},
 property:{title:"สถานที่ที่อยากดูแล",fields:[field("property_type","ประเภทที่อยู่อาศัย","เลือกประเภท",["บ้าน","คอนโด","อาคารพาณิชย์","อื่น ๆ"]),field("property_concern","กังวลเรื่องไหน","เช่น น้ำท่วม ไฟไหม้ หรือของในบ้าน")]},
 liability:{title:"ความรับผิดที่อยากคุ้มครอง",fields:[field("liability_activity","กิจการ / กิจกรรม","เช่น ร้านอาหาร"),field("liability_concern","กังวลเหตุการณ์ไหน","เช่น ลูกค้าได้รับบาดเจ็บ")]},
 pet:{title:"ข้อมูลสัตว์เลี้ยง",fields:[field("pet_type","สัตว์เลี้ยง","เลือกประเภท",["สุนัข","แมว","อื่น ๆ"]),field("pet_age","อายุ","เช่น 3 ปี")]},
 "critical-illness":{title:"เรื่องที่อยากเตรียมพร้อม",fields:[field("illness_concern","โรคที่กังวล","เช่น มะเร็ง หรือโรคร้ายแรงหลายโรค"),field("illness_goal","อยากให้ช่วยส่วนไหน","เลือกความต้องการ",["ค่ารักษา","เงินก้อนระหว่างพักรักษา","ทั้งสองอย่าง"])]},
 cyber:{title:"ความเสี่ยงออนไลน์",fields:[field("cyber_use","ใช้กับใคร","เลือกการใช้งาน",["ส่วนตัว","ธุรกิจ"]),field("cyber_concern","กังวลเรื่องไหน","เช่น ถูกหลอกโอนเงิน หรือข้อมูลรั่ว")]},
 business:{title:"ข้อมูลกิจการ",fields:[field("business_type","ประเภทกิจการ","เช่น ร้านค้า หรือร้านอาหาร"),field("business_concern","อยากคุ้มครองอะไร","เช่น ทรัพย์สิน หรือความรับผิดต่อลูกค้า")]},
 event:{title:"ข้อมูลอีเวนต์ของคุณ",fields:[field("event_type","ประเภทงาน","เลือกประเภทงาน",["งานแต่งงาน","คอนเสิร์ต","นิทรรศการ","งานบริษัท","อื่น ๆ"]),field("event_concern","กังวลเรื่องไหน","เลือกความกังวล",["ยกเลิกงาน","ผู้ร่วมงานบาดเจ็บ","อุปกรณ์เสียหาย","อื่น ๆ"])]},
 sports:{title:"กิจกรรมของคุณ",fields:[field("sports_activity","กีฬา / กิจกรรม","เช่น วิ่ง หรือดำน้ำ"),field("sports_level","ลักษณะกิจกรรม","เลือกการเข้าร่วม",["ออกกำลังกายทั่วไป","ท่องเที่ยว / สันทนาการ","แข่งขัน"])]},
};

export function getIntakeFields(card:Pick<IntakeCard,"category"|"fieldKeys">):IntakeField[]{
 const template=intakeTemplates[card.category];
 if(!template||new Set(card.fieldKeys).size!==card.fieldKeys.length||card.fieldKeys.length<1||card.fieldKeys.length>(card.category==="motor"?3:2))throw new Error("invalid_intake_fields");
 return card.fieldKeys.map(key=>{const item=template.fields.find(f=>f.key===key);if(!item)throw new Error("invalid_intake_field");return item;});
}

// A form submission is ordinary conversation evidence; no second memory store.
export function formatIntakeAnswer(card:Pick<IntakeCard,"category"|"fieldKeys">,values:Record<string,string>):string{
 const lines=getIntakeFields(card).flatMap(item=>{const value=values[item.key]?.trim();if(!value)return [];if(value.length>160||/[\r\n]/.test(value))throw new Error("invalid_intake_answer");return [`${item.label}: ${value}`];});
 if(!lines.length)throw new Error("empty_intake_answer");
 return `${intakeTemplates[card.category].title}\n${lines.join("\n")}`;
}

// Exclude fields already submitted, including an explicit 'not sure'. Natural
// language answers are handled by the model using the complete conversation.
export function unansweredIntakeFields(category:Category,messages:{role:string;content:string}[]):IntakeField[]{
 const titles=Object.values(intakeTemplates).map(template=>template.title);
 const ownTitle=intakeTemplates[category].title;
 const known=new Set<string>();
 for(const message of messages.filter(m=>m.role==="user")){
  let scope:string|null=null;
  for(const line of message.content.split("\n")){
   if(titles.includes(line)){scope=line;continue;}
   for(const item of intakeTemplates[category].fields){
    const uniqueLabel=Object.values(intakeTemplates).flatMap(template=>template.fields).filter(field=>field.label===item.label).length===1;
    if((scope===ownTitle||(scope===null&&uniqueLabel))&&line.startsWith(`${item.label}: `)&&line.slice(item.label.length+2).trim())known.add(item.key);
   }
  }
 }
 return intakeTemplates[category].fields.filter(item=>!known.has(item.key));
}

export function createIntakeCard(category:Category,fieldKeys:string[],messages:{role:string;content:string}[]):IntakeCard|null{
 getIntakeFields({category,fieldKeys});
 const missing=new Set(unansweredIntakeFields(category,messages).map(item=>item.key));
 const keys=fieldKeys.filter(key=>missing.has(key));
 return keys.length?{type:"intake",category,fieldKeys:keys}:null;
}
