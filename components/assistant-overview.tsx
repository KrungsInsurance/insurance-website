import type { Plan } from "@/lib/types";
import type { AssistantOverview } from "@/lib/assistant-overview";
import { shortFieldLabel } from "@/lib/ui-copy";

export function AssistantOverviewView({ overview, plans = [] }: { overview: AssistantOverview; plans?: Plan[] }) {
  const { customer } = overview;
  const groups = [["ความต้องการ", customer.needs], ["ความคุ้มครองเดิม", customer.currentCoverage], ["ความกังวล", customer.concerns], ["คำถามหลัก", customer.questions]] as const;
  const sources = plans.flatMap(plan => plan.sources).filter((source, index, all) => overview.differences.some(diff => diff.sourceIds.includes(source.id)) && all.findIndex(item => item.url === source.url) === index);
  return <section className="assistant-overview" aria-label="ข้อมูลเตรียมให้ผู้เชี่ยวชาญ">
    <p className="assistant-pipeline">ข้อมูลสำหรับผู้เชี่ยวชาญ</p>
    <dl>{groups.map(([label, facts]) => <div key={label}><dt>{label}</dt><dd>{facts.length ? <ul>{facts.map((fact, index) => <li key={index}>{fact.text}</li>)}</ul> : "ยังไม่ได้ระบุ"}</dd></div>)}
      <div><dt>งบประมาณ</dt><dd>{customer.budget?.amountTHB != null ? `${customer.budget.amountTHB.toLocaleString("th-TH")} บาท / ${{ year: "ปี", month: "เดือน", trip: "ทริป", single: "ครั้งเดียว", unspecified: "ยังไม่ระบุรอบ" }[customer.budget.period]}` : customer.budget?.quote ?? "ยังไม่ได้ระบุ"}</dd></div>
    </dl>
    <h3>ความต่างของแผน</h3>
    {overview.comparedPlanIds.length < 2 ? <p>ยังไม่ได้เปรียบเทียบ</p> : overview.differences.length ? <ul className="assistant-differences">{overview.differences.map(diff => <li key={diff.fieldKey}><span>{shortFieldLabel(diff.fieldKey, diff.label)}</span> · <strong>{{ different: "ต่างกัน", not_comparable: "ฐานต่างกัน", insufficient: "ยังไม่ได้ระบุ" }[diff.status]}</strong></li>)}</ul> : <p>ไม่พบความต่าง</p>}
    <details className="assistant-evidence"><summary>รายละเอียดและข้อความต้นทาง</summary>
      <p className="assistant-overview-note">{overview.sourceMode === "live" ? "จับข้อมูลด้วย ChatGPT API" : "ตัวอย่างการจับข้อมูล · โหมดจำลอง"} · ไม่มีการให้คะแนนหรือจัดอันดับแผน</p>
      {groups.filter(([, facts]) => facts.length).map(([label, facts]) => <div key={label}><h3>{label}</h3>{facts.map((fact, index) => <blockquote key={index}>{fact.quote}</blockquote>)}</div>)}
      {customer.budget && <div><h3>งบประมาณ</h3><blockquote>{customer.budget.quote}</blockquote></div>}
      {overview.differences.length > 0 && <div><h3>ความต่างฉบับเต็ม</h3>{overview.differences.map(diff => <p key={diff.fieldKey}>{diff.sentence}</p>)}</div>}
      {sources.map(source => <a key={source.id} className="text-link block min-h-11 content-center" href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.locator} ↗</a>)}
      <p className="assistant-overview-note">ความคุ้มครองเดิมเป็นคำบอกเล่าของลูกค้า ยังไม่ได้ตรวจกรมธรรม์ ผู้เชี่ยวชาญเป็นผู้ประเมินและให้คำแนะนำ</p>
    </details>
  </section>;
}
