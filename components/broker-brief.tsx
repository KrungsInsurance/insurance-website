"use client";
import { useRef } from "react";
import type { Lead } from "@/lib/types";
import { brokerCandidates, brokerNextSteps, brokerDecision } from "@/lib/broker-brief";
import { formatPrice } from "@/lib/display";

export function BrokerBrief({ lead }: { lead: Lead }) {
  const facts = lead.summary.overview?.customer;
  const budget = facts?.budget;
  const period = { year: "/ปี", month: "/เดือน", trip: "/ทริป", single: " (ครั้งเดียว)", unspecified: " (ยังไม่ระบุรอบ)" };
  const budgetText = budget ? budget.amountTHB === null ? budget.quote : `${budget.amountTHB.toLocaleString("th-TH")} บาท${period[budget.period]}` : lead.summary.budgetTHB === null ? "ยังไม่กำหนด · ดูตัวเลือกก่อนได้" : `${lead.summary.budgetTHB.toLocaleString("th-TH")} บาท (ยืนยันรอบงบอีกครั้ง)`;
  const quote = facts?.concerns[0]?.quote ?? facts?.needs[0]?.quote;
  return <section className="broker-panel broker-brief" aria-labelledby="lead-summary-title">
    <div className="broker-panel-heading"><h2 id="lead-summary-title">เข้าใจลูกค้าใน 1–2 นาที</h2><span className="broker-muted">{lead.summary.sourceMode === "live" ? "สรุปจากแชต" : "ข้อมูลเดโม"}</span></div>
    <dl className="broker-brief-facts">
      <div><dt>ต้องการอะไร</dt><dd>{lead.summary.needs.join(" · ") || "ยังไม่ระบุ — ถามเป้าหมายก่อน"}</dd></div>
      <div><dt>กังวลอะไร</dt><dd>{facts?.concerns.map(f => f.text).join(" · ") || "ยังไม่มีข้อมูลความกังวล"}</dd></div>
      <div><dt>มีความคุ้มครองอะไรแล้ว</dt><dd>{(facts?.currentCoverage.map(f => f.text) ?? lead.summary.currentCoverage ?? []).join(" · ") || "ยังไม่ได้แจ้ง"}</dd></div>
      <div><dt>งบที่ลูกค้าบอก</dt><dd>{budgetText}</dd></div>
    </dl>
    {quote && <blockquote className="broker-customer-quote"><span>จากแชตลูกค้า</span>“{quote}”</blockquote>}
    <div className="broker-main-question"><span>คำถามที่อยากได้คำตอบ</span><p>{lead.summary.questions.join(" · ") || "ยังไม่ได้ฝากคำถาม"}</p></div>
    <details className="broker-disclosure"><summary>ข้อมูลติดต่อและการส่งต่อ</summary><dl className="broker-summary-grid"><div><dt>ช่องทางติดต่อ</dt><dd>{lead.demoContact?`${{line:"LINE",phone:"โทรศัพท์",email:"อีเมล"}[lead.demoContact]} · ช่องทางจำลอง`:"ยังไม่มีเบอร์ / LINE / อีเมลในคำขอ"}</dd></div><div><dt>ช่วงเวลาที่สะดวก</dt><dd>ช่วง{{ morning: "เช้า", afternoon: "บ่าย", evening: "เย็น" }[lead.contactWindow]}</dd></div><div className="broker-summary-wide"><dt>การยินยอมส่งต่อ</dt><dd>ยืนยันเมื่อ {new Date(lead.consentAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</dd></div></dl></details>
  </section>;
}

export function BrokerDirection({ lead }: { lead: Lead }) {
  return <section className="broker-panel broker-direction" aria-labelledby="direction-title"><p className="broker-eyebrow">แนวทางรับช่วงดูแล</p><h2 id="direction-title">คุยต่ออย่างไรดี</h2><ol>{brokerNextSteps(lead).map(step => <li key={step}>{step}</li>)}</ol><p className="broker-contact-note">ติดต่อช่วง{{ morning: "เช้า", afternoon: "บ่าย", evening: "เย็น" }[lead.contactWindow]} · {lead.demoContact?`${{line:"LINE",phone:"โทรศัพท์",email:"อีเมล"}[lead.demoContact]} (จำลอง)`:"ต้องยืนยันช่องทางติดต่อก่อน"}<br/><small>{lead.demoCaseId?"เคสลูกค้าตัวอย่าง · ไม่มีข้อมูลติดต่อจริง":"คำขอนี้ยังไม่มีเบอร์ / LINE / อีเมล"}</small></p></section>;
}

export function BrokerMatches({ lead, onQuestion }: { lead: Lead; onQuestion: (question: string) => void }) {
  const candidates = brokerCandidates(lead);
  const scroller=useRef<HTMLDivElement>(null);
  function moveTable(direction:number){const element=scroller.current;if(!element)return;const pinnedWidth=element.querySelector("thead th")?.getBoundingClientRect().width??160;element.scrollBy({left:direction*Math.max(120,element.clientWidth-pinnedWidth)});}
  return <section className="broker-panel broker-matches" aria-labelledby="matches-title">
    <div className="broker-panel-heading"><div><p className="broker-eyebrow">จากความต้องการ → จุดตัดสินใจ</p><h2 id="matches-title">เทียบตัวเลือก แล้วถามให้ตรงจุด</h2></div><span className="broker-count">{candidates.length} แผน</span></div>
    <p className="broker-muted" id="match-help">อ้างอิงข้อมูลก่อนส่งต่อ · ใช้คำตอบลูกค้ายืนยันเงื่อนไขก่อนเลือกแผน · ไม่มีการจัดอันดับ</p>
    {candidates.length>0&&<div className="broker-table-controls"><p>เลื่อนดูเหตุผลและคำถาม →</p><button type="button" aria-label="เลื่อนตารางไปก่อนหน้า" onClick={()=>moveTable(-1)}>←</button><button type="button" aria-label="เลื่อนตารางไปถัดไป" onClick={()=>moveTable(1)}>→</button></div>}
    {candidates.length ? <div ref={scroller} className="broker-table-scroll" role="region" aria-label="ตารางตัวเลือกประกัน" tabIndex={0} onKeyDown={event=>{if(event.target===event.currentTarget&&(event.key==="ArrowLeft"||event.key==="ArrowRight")){event.preventDefault();moveTable(event.key==="ArrowRight"?1:-1);}}}><table className="broker-match-table" aria-describedby="match-help">
      <caption className="sr-only">แผน เหตุผล จุดตัดสินใจ และคำถามนำสำหรับ Broker</caption>
      <thead><tr><th scope="col">ตัวเลือกประกัน</th><th scope="col">ทำไมถึงนำมาคุย</th><th scope="col">เงื่อนไขที่จะพิจารณาเลือก</th><th scope="col">ถามต่อเพื่อแยกตัวเลือก</th></tr></thead>
      <tbody>{candidates.map(candidate => {
        const {plan,evidence,checks,reason,saved}=candidate;
        const decision=brokerDecision(candidate);
        return <tr key={plan.id}>
          <th scope="row"><span className="broker-candidate-reason">{reason}</span><h3>{plan.name}</h3><p className="broker-table-price">{plan.price ? formatPrice({...plan.price,scenario:null}) : "ต้องยืนยันราคา"}</p><span className="broker-muted">{saved?"ข้อมูล ณ ตอนส่ง":"แค็ตตาล็อกปัจจุบัน"}</span>
            <details className="broker-disclosure"><summary>เงื่อนไข / แหล่งอ้างอิง</summary><p className="broker-muted">{plan.price?.scenario}</p><p className="broker-muted">{plan.eligibility}</p>{evidence.map(item=><p className="broker-muted" key={item.key}>{item.text}</p>)}<ul className="broker-limits">{plan.exclusions.map(item=><li key={item}>{item}</li>)}</ul>{(plan.sources??[]).filter(source=>evidence.some(e=>e.sourceIds.includes(source.id))||plan.price?.sourceIds.includes(source.id)).map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="broker-source">{source.publisher} · {source.locator} ↗</a>)}</details>
          </th>
          <td>{evidence.length?evidence.map(item=><div className="broker-table-evidence" key={item.key}><p>{item.briefText}</p><blockquote>“{item.quote}”<span>— จากแชตลูกค้า</span></blockquote></div>):<p>ลูกค้าเคยเลือกแผนนี้ ยังต้องถามเหตุผลและความคุ้มครองที่ต้องการเพิ่ม</p>}</td>
          <td><p className="broker-trigger">{decision.trigger}</p>{checks[0]&&<p className="broker-table-warning">{checks[0]}</p>}<details className="broker-disclosure"><summary>สิ่งที่ยังต้องตรวจ</summary>{checks.map(check=><p className="broker-muted" key={check}>{check}</p>)}<p className="broker-muted">{plan.price?.kind==="quote_only"?"ต้องขอใบเสนอราคาเฉพาะกรณี":"เบี้ยที่แสดงยังไม่ใช่ใบเสนอราคาเฉพาะลูกค้า"} · ตรวจข้อยกเว้นและคุณสมบัติผู้สมัคร</p></details></td>
          <td><p className="broker-table-question">{decision.question}</p><button type="button" className="broker-question-button" disabled={lead.status==="closed"} onClick={()=>onQuestion(decision.question)}>ใช้คำถามนี้ในแชต ↗</button></td>
        </tr>;
      })}</tbody>
    </table></div>:<p className="broker-empty-candidates">ยังมีข้อมูลไม่พอให้คัดแผนเฉพาะราย เริ่มถามความต้องการและแผนที่สนใจก่อน</p>}
  </section>;
}
