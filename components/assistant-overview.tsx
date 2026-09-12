import type { Plan } from "@/lib/types";
import type { AssistantOverview } from "@/lib/assistant-overview";

export function AssistantOverviewView({overview,plans=[]}:{overview:AssistantOverview;plans?:Plan[]}){
 const {customer}=overview;
 return <section className="assistant-overview" aria-label="ข้อมูลเตรียมให้ผู้เชี่ยวชาญ">
  <p className="assistant-pipeline">01 จับข้อมูล → 02 จัดข้อมูลแผน → 03 แสดงความต่าง → ผู้เชี่ยวชาญแนะนำ</p>
  <p className="assistant-overview-note">{overview.sourceMode==="live"?"จับข้อมูลด้วย ChatGPT API":"ตัวอย่างการจับข้อมูล · โหมดจำลอง"} · ไม่มีการให้คะแนนหรือจัดอันดับแผน</p>
  <dl>{([["Customer Need · ความต้องการ",customer.needs],["Current Coverage · ความคุ้มครองเดิม",customer.currentCoverage],["ความกังวลที่ลูกค้าระบุ",customer.concerns],["Main Question · คำถามของลูกค้า",customer.questions]] as const).map(([label,facts])=><div key={label}><dt>{label}</dt><dd>{facts.length?<ul>{facts.map((fact,i)=><li key={i}>{fact.text}<details><summary>ข้อความต้นทาง</summary><blockquote>{fact.quote}</blockquote></details></li>)}</ul>:"ยังไม่ได้ระบุ"}</dd></div>)}<div><dt>Budget · งบที่ลูกค้าระบุ</dt><dd>{customer.budget?customer.budget.amountTHB===null?customer.budget.quote:`${customer.budget.amountTHB.toLocaleString("th-TH")} บาท / ${{year:"ปี",month:"เดือน",trip:"ทริป",single:"ครั้งเดียว",unspecified:"ยังไม่ระบุรอบ"}[customer.budget.period]}`:"ยังไม่ได้ระบุ"}{customer.budget&&<details><summary>ข้อความต้นทาง</summary><blockquote>{customer.budget.quote}</blockquote></details>}</dd></div></dl>
  <h3>Key Differences · ความต่างของแผนที่เทียบ</h3>
  {overview.comparedPlanIds.length<2?<p>ยังไม่ได้เปรียบเทียบแผน 2–3 แผน</p>:overview.differences.length?<ul className="assistant-differences">{overview.differences.map(diff=><li key={diff.fieldKey}><details><summary>{diff.label} · {{different:"ต่างกัน",not_comparable:"ฐานต่างกัน",insufficient:"ข้อมูลไม่พอ"}[diff.status]}</summary><p>{diff.sentence}</p>{plans.flatMap(plan=>plan.sources).filter((source,index,all)=>diff.sourceIds.includes(source.id)&&all.findIndex(s=>s.id===source.id)===index).map(source=><a key={source.id} className="text-link block min-h-11 content-center" href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.locator} ↗</a>)}</details></li>)}</ul>:<p>ไม่พบความต่างในข้อมูลที่มี</p>}
  <p className="assistant-overview-note">ความคุ้มครองเดิมเป็นคำบอกเล่าของลูกค้า ยังไม่ได้ตรวจกรมธรรม์ ผู้เชี่ยวชาญเป็นผู้ประเมินและให้คำแนะนำ</p>
 </section>;
}
