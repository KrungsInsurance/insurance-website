"use client";
import { useRef } from "react";
import type { Lead } from "@/lib/types";
import { brokerCandidates, brokerNextSteps, brokerDecision } from "@/lib/broker-brief";
import { categoryFields } from "@/lib/catalog";
import { formatPrice } from "@/lib/display";
import { shortBasis, shortCoverage, shortFieldLabel } from "@/lib/ui-copy";

function FactList({ values }: { values: string[] }) {
  return values.length ? <ul className="broker-fact-list">{values.map((value, index) => <li key={index}>{value}</li>)}</ul> : <>ยังไม่ได้ระบุ</>;
}

// Presentation summaries only; the original decision and draft remain below in full.
function decisionPoints(trigger: string): string[] {
  if (trigger.includes("อยากได้ OPD เพิ่ม")) return ["ต้องการ OPD เพิ่ม", "รับเบี้ยเพิ่มได้", "ยืนยันวงเงินและตัวเลือก"];
  if (trigger.includes("ต้องการทั้ง IPD และ OPD")) return ["ต้องการ IPD + OPD", "วงเงินต่อครั้ง/ปีตรงการใช้งาน"];
  if (trigger.includes("ค่าห้องที่ต้องการ")) return ["ค่าห้องตรงวงเงินแผน", trigger.includes("ไม่ต้องการ OPD") ? "ยืนยันว่าไม่ต้องการ OPD ทั่วไป" : "ตรวจสิทธิเดิมและ OPD"];
  if (trigger.includes("รับวงเงินน้ำท่วม")) return ["รับวงเงินน้ำท่วมได้", "ทุนอาคาร/ทรัพย์สินตรงบ้านจริง"];
  if (trigger.includes("ทุนรถ") && trigger.includes("รูปแบบซ่อม")) return ["ทุนรถและเหตุคุ้มครองตรงความต้องการ", "รับส่วนแรกและรูปแบบซ่อมได้"];
  if (trigger.includes("ยังต้องขอทุนรถ")) return ["ขอทุนรถและเบี้ย", "ยืนยันการชนเฉพาะรุ่น"];
  if (trigger.includes("เงินชดเชย")) return ["ชดเชยรายได้เพียงพอ", "อาชีพและการนอน รพ. เข้าเงื่อนไข"];
  if (trigger.includes("ยังใช้เรื่องชดเชยรายวัน")) return ["ยืนยันสิทธิชดเชยรายวันก่อน", "หรือยืนยันว่าเน้นค่ารักษา"];
  if (trigger.includes("พิจารณารายปี")) return ["เดินทางหลายครั้ง", "วันต่อเที่ยวและพื้นที่ตรงแผน", "เทียบเบี้ยจริงกับรายเที่ยว"];
  if (trigger.includes("ยอมเลือกแพ็กเสริม")) return ["วันเดินทางตรงแผน", "เลือกแพ็กเสริมเที่ยวบินล่าช้า", "ยืนยันเบี้ยรวม"];
  if (trigger.includes("ระยะเวลาล่าช้า")) return ["พื้นที่และวันตรงทริป", "เหตุและเวลาล่าช้าตรงความต้องการ"];
  if (trigger.includes("ความคุ้มครอง “")) return ["ความคุ้มครองตรงความต้องการ", "รับเงื่อนไขและเบี้ยที่ยืนยันได้"];
  if (trigger.startsWith("ลูกค้ายืนยันความคุ้มครอง")) return ["ยืนยันความคุ้มครองที่ต้องการ", "วงเงิน เงื่อนไข และเบี้ยตรงที่ตกลง"];
  return trigger.replace(/^พิจารณาต่อเมื่อ/, "").split(/ โดย| พร้อม/);
}

function questionPoints(question: string): string[] {
  if (question.startsWith("ปกติพบแพทย์")) return ["พบแพทย์ OPD บ่อยแค่ไหน?", "สิทธิเดิมจ่ายเท่าไร?", "เพิ่ม OPD หรือเน้น IPD?"];
  if (question.startsWith("โรงพยาบาลที่ใช้")) return ["ค่าห้องวันละเท่าไร?", "ประกันเดิมจ่ายเท่าไร?", "วงเงินแผนพอเพิ่มไหม?"];
  if (question.startsWith("ความเสียหายจากน้ำท่วม")) return ["ต้องการวงเงินน้ำท่วมเท่าไร?", "วงเงินแผนเพียงพอไหม?", "รวมบ้านและทรัพย์สินใด?"];
  if (question.startsWith("รับเงื่อนไข “")) return ["รับเงื่อนไขการชนนี้ได้ไหม?", "ต้องคุ้มครองการชนอื่นด้วยไหม?"];
  if (question.startsWith("ใช้รถรุ่น")) return ["รถรุ่นไหน ปีอะไร?", "ต้องคุ้มครองชนไร้คู่กรณีไหม?", "รับส่วนแรกและการซ่อมแบบไหน?"];
  if (question.startsWith("ถ้าหยุดงาน")) return ["ต้องการชดเชยวันละเท่าไร?", "มีสิทธิค่ารักษาเดิมไหม?", "มีรายได้ทดแทนเดิมไหม?"];
  if (question.startsWith("ระหว่างค่ารักษา")) return ["เน้นค่ารักษาหรือชดเชยรายวัน?", "ถ้ารายวันจำเป็น ยืนยันสิทธิก่อน"];
  if (question.startsWith("ในหนึ่งปี")) return ["เดินทางปีละกี่ครั้ง?", "แต่ละครั้งกี่วัน?", "เทียบรายปีกับรายเที่ยว"];
  if (question.startsWith("เดินทางประเทศไหน")) return ["ไปประเทศไหน วันไหน กี่คน?", "ต้องการคุ้มครองล่าช้าจากเหตุใด?", "ตรวจเกณฑ์และแพ็กเสริม"];
  if (question.startsWith("จากที่บอกว่า")) return ["ต้องการคุ้มครองกรณีใด?", "วงเงินเท่าไร?", "มีสิทธิเดิมหรือจ่ายเองได้เท่าไร?"];
  if (question.startsWith("ตอนที่สนใจ")) return ["สนใจความคุ้มครองส่วนไหน?", "มีเงื่อนไขใดที่รับไม่ได้?"];
  return [question];
}

export function BrokerBrief({ lead }: { lead: Lead }) {
  const facts = lead.summary.overview?.customer;
  const budget = facts?.budget;
  const period = { year: "/ปี", month: "/เดือน", trip: "/ทริป", single: " /ครั้งเดียว", unspecified: " /ยังไม่ระบุรอบ" };
  const budgetText = budget ? budget.amountTHB === null ? budget.quote : `${budget.amountTHB.toLocaleString("th-TH")} บาท${period[budget.period]}` : lead.summary.budgetTHB === null ? "ยังไม่ได้ระบุ" : `${lead.summary.budgetTHB.toLocaleString("th-TH")} บาท /ยังไม่ระบุรอบ`;
  const quotes = [...new Set([...(facts?.needs ?? []), ...(facts?.concerns ?? []), ...(facts?.currentCoverage ?? []), ...(facts?.questions ?? [])].map(fact => fact.quote).concat(budget?.quote ? [budget.quote] : []))];
  return <section className="broker-panel broker-brief" aria-labelledby="lead-summary-title">
    <div className="broker-panel-heading"><h2 id="lead-summary-title">รู้จักลูกค้า</h2></div>
    <dl className="broker-brief-facts">
      <div><dt>ความต้องการ</dt><dd><FactList values={lead.summary.needs}/></dd></div>
      <div><dt>ความกังวล</dt><dd><FactList values={facts?.concerns.map(f => f.text) ?? []}/></dd></div>
      <div><dt>ความคุ้มครองเดิม</dt><dd><FactList values={facts?.currentCoverage.map(f => f.text) ?? lead.summary.currentCoverage ?? []}/></dd></div>
      <div className="broker-budget-fact"><dt>งบประมาณ</dt><dd>{budgetText}</dd></div>
      <div><dt>ช่องทางติดต่อ</dt><dd>{lead.demoContact ? {line:"LINE",phone:"โทรศัพท์",email:"อีเมล"}[lead.demoContact] : "ยังไม่ได้ระบุ"}</dd></div>
      <div><dt>เวลาสะดวก</dt><dd>ช่วง{{ morning: "เช้า", afternoon: "บ่าย", evening: "เย็น" }[lead.contactWindow]}</dd></div>
    </dl>
    <div className="broker-main-question"><span>คำถามหลัก</span><FactList values={lead.summary.questions}/></div>
    <details className="broker-disclosure"><summary>ข้อความต้นทางและการส่งต่อ</summary>
      <p className="broker-muted">{lead.summary.sourceMode === "live" ? "สรุปจากแชต" : "สรุปจากข้อมูลตัวอย่าง"}{lead.demoContact ? " · ช่องทางติดต่อจำลอง" : ""}</p>
      {quotes.map(quote => <blockquote className="broker-customer-quote" key={quote}>{quote}</blockquote>)}
      <dl className="broker-summary-grid"><div className="broker-summary-wide"><dt>ยินยอมส่งต่อ</dt><dd><time dateTime={lead.consentAt}>{new Date(lead.consentAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</time></dd></div></dl>
    </details>
  </section>;
}

export function BrokerDirection({ lead }: { lead: Lead }) {
  const steps = brokerNextSteps(lead);
  return <section className="broker-panel broker-direction" aria-labelledby="direction-title"><h2 id="direction-title">คุยต่อ 3 ขั้น</h2>
    <ol>{[lead.summary.questions.length ? "ตอบคำถามหลัก" : "ถามความต้องการ", "ยืนยันสิทธิและวงเงิน", "เทียบและขอราคา"].map((label, index) => <li key={label}><strong>{label}</strong><span>{index === 0 ? "ความต้องการ · ความกังวล" : index === 1 ? "ความคุ้มครองเดิม · คุณสมบัติ" : "ตัวเลือก · เบี้ยจริง"}</span></li>)}</ol>
    <details className="broker-disclosure"><summary>แนวทางคุยฉบับเต็ม</summary><ol className="broker-direction-full">{steps.map(step => <li key={step}>{step}</li>)}</ol></details>
    {!lead.demoContact && <p className="broker-contact-note">ยืนยันช่องทางติดต่อก่อน</p>}
  </section>;
}

export function BrokerMatches({ lead, onQuestion }: { lead: Lead; onQuestion: (question: string) => void }) {
  const candidates = brokerCandidates(lead);
  const scroller = useRef<HTMLDivElement>(null);
  function moveTable(direction: number) {
    const element = scroller.current;
    if (!element) return;
    const pinnedWidth = element.querySelector("thead th")?.getBoundingClientRect().width ?? 160;
    element.scrollBy({ left: direction * Math.max(120, element.clientWidth - pinnedWidth) });
  }
  return <section className="broker-panel broker-matches" aria-labelledby="matches-title">
    <div className="broker-panel-heading"><h2 id="matches-title">ตัวเลือกที่คุยต่อ</h2><span className="broker-count">{candidates.length} แผน</span></div>
    <p className="broker-muted" id="match-help">ข้อมูลประกอบการคุย · ไม่มีการจัดอันดับ</p>
    {candidates.length > 0 && <div className="broker-table-controls"><p>เลื่อนดูความคุ้มครอง →</p><button type="button" aria-label="เลื่อนตารางไปก่อนหน้า" onClick={() => moveTable(-1)}>←</button><button type="button" aria-label="เลื่อนตารางไปถัดไป" onClick={() => moveTable(1)}>→</button></div>}
    {candidates.length ? <>
      <div ref={scroller} className="broker-table-scroll" role="region" aria-label="ตารางตัวเลือกประกัน" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "ArrowLeft" || event.key === "ArrowRight")) { event.preventDefault(); moveTable(event.key === "ArrowRight" ? 1 : -1); } }}><table className="broker-match-table" aria-describedby="match-help">
        <caption className="sr-only">แผน ความคุ้มครองที่เกี่ยวข้อง และคำถามต่อสำหรับ Broker</caption>
        <thead><tr><th scope="col">แผนประกัน</th><th scope="col">ความคุ้มครอง</th><th scope="col">จุดตัดสินใจ</th><th scope="col">ถามต่อ</th></tr></thead>
        <tbody>{candidates.map(candidate => {
          const { plan, evidence, saved } = candidate;
          const decision = brokerDecision(candidate);
          const reason = lead.summary.interestedPlanIds.includes(plan.id) ? "ลูกค้าสนใจ" : lead.summary.comparedPlanIds.includes(plan.id) ? "เคยเปรียบเทียบ" : "ตรงประเด็นแชต";
          return <tr key={plan.id}>
            <th scope="row"><span className="broker-candidate-reason">{reason}</span><h3>{plan.name}</h3><p className="broker-table-price">{plan.price ? formatPrice({ ...plan.price, scenario: null, includes: null }) : "ยังไม่ได้ระบุ"}</p><span className="broker-muted">{saved ? "ณ ตอนส่งต่อ" : "แค็ตตาล็อกปัจจุบัน"}</span></th>
            <td>{evidence.length ? <dl className="broker-evidence-values">{evidence.map(item => {
              const cell = plan.coverageCells[item.key];
              const label = shortFieldLabel(item.key, categoryFields[plan.category].find(field => field.key === item.key)?.label ?? item.key);
              return <div key={item.key}><dt>{label}</dt><dd>{shortCoverage(cell)}</dd>{shortBasis(cell) && <p>{shortBasis(cell)}</p>}{cell.inclusion === "optional" && <span className="broker-optional">ซื้อเพิ่ม</span>}{cell.inclusion === "unknown" && <span className="broker-muted">รอยืนยันการรวม</span>}</div>;
            })}</dl> : <p className="broker-muted">ยังไม่ได้ระบุ</p>}</td>
            <td><ul className="broker-decision-points">{decisionPoints(decision.trigger).map(point => <li key={point}>{point}</li>)}</ul>{candidate.checks.length > 0 && <a className="broker-decision-link" href={`#candidate-detail-${plan.id}`} onClick={() => { const details = document.getElementById("broker-candidate-evidence"); if (details instanceof HTMLDetailsElement) details.open = true; }}>ต้องตรวจเพิ่ม {candidate.checks.length} ข้อ</a>}</td>
            <td><ul className="broker-question-points">{questionPoints(decision.question).map(point => <li key={point}>{point}</li>)}</ul><button type="button" className="broker-question-button" disabled={lead.status === "closed"} onClick={() => onQuestion(decision.question)}>ร่างคำถาม ↗</button></td>
          </tr>;
        })}</tbody>
      </table></div>
      <details className="broker-disclosure broker-candidate-evidence" id="broker-candidate-evidence"><summary>จุดตัดสินใจ เงื่อนไข และแหล่งข้อมูล</summary>{candidates.map(candidate => {
        const { plan, evidence, checks, reason } = candidate;
        const decision = brokerDecision(candidate);
        return <article key={plan.id} id={`candidate-detail-${plan.id}`} tabIndex={-1}><h3>{plan.name}</h3><p className="broker-muted">{reason}</p><h4>ก่อนเลือก</h4><p>{decision.trigger}</p><h4>คำถามต่อ</h4><p>{decision.question}</p><h4>ข้อมูลประกอบ</h4>{evidence.map(item => <div key={item.key}><p>{item.text}</p><blockquote className="broker-customer-quote">{item.quote}</blockquote></div>)}{checks.length > 0 && <ul>{checks.map(check => <li key={check}>{check}</li>)}</ul>}<p>{plan.price?.scenario}</p><p>{plan.price?.includes}</p><p>{plan.eligibility}</p><p>{plan.price?.kind === "quote_only" ? "ต้องขอใบเสนอราคาเฉพาะกรณี" : "เบี้ยที่แสดงยังไม่ใช่ใบเสนอราคาเฉพาะลูกค้า"} · ตรวจข้อยกเว้นและคุณสมบัติผู้สมัคร</p><ul>{plan.exclusions.map(item => <li key={item}>{item}</li>)}</ul>{(plan.sources ?? []).filter(source => evidence.some(item => item.sourceIds.includes(source.id)) || plan.price?.sourceIds.includes(source.id)).filter((source, index, all) => all.findIndex(item => item.url === source.url) === index).map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="broker-source">{source.publisher} · {source.locator} ↗</a>)}</article>;
      })}</details>
    </> : <p className="broker-empty-candidates">ยังไม่ได้ระบุแผนที่สนใจ</p>}
  </section>;
}
