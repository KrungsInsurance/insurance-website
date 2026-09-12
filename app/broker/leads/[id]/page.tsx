"use client";
import "@/components/broker.css";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "@/components/native-link";
import { use, useEffect, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { formatPremium, formatPrice } from "@/lib/display";
import { BrokerBrief, BrokerDirection, BrokerMatches } from "@/components/broker-brief";
import { BrokerChat } from "@/components/broker-chat";
import { HistoricalCard } from "@/components/broker-history-card";
import { AssistantOverviewView } from "@/components/assistant-overview";
import type { Lead } from "@/lib/types";

export default function BrokerLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BrokerLeadWorkspace key={id} id={id}/>;
}

function BrokerLeadWorkspace({id}:{id:string}) {
  const { state, updateLead } = useDemo();
  const lead = state.leads.find((item) => item.id === id);
  const [contactMode,setContactMode]=useState<"chat"|"call">(lead?.calls.some(call=>!call.endedAt)?"call":"chat");
  const [draft,setDraft]=useState("");
  const [draftNotice,setDraftNotice]=useState("");
  function useQuestion(question:string){const next=draft?`${draft}\n${question}`:question;if(next.length>2000){setDraftNotice("ข้อความร่างยาวเกินไป กรุณาย่อก่อนเพิ่มคำถาม");return;}setDraft(next);setContactMode("chat");setDraftNotice("เพิ่มคำถามลงร่างแล้ว ตรวจแก้ก่อนส่งได้");requestAnimationFrame(()=>document.getElementById("broker-message")?.focus());}
  const [elapsed, setElapsed] = useState<number | null>(0);
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState<"interested" | "follow_up" | "not_interested">("interested");
  useEffect(() => { const call = lead?.calls.find((item) => !item.endedAt); if (!call) return; const tick = () => { const started = Date.parse(call.startedAt); setElapsed(Number.isFinite(started) && started <= Date.now() ? Math.floor((Date.now() - started) / 1000) : null); }; tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer); }, [lead?.calls]);
  if (!lead) return <main className="broker-workspace broker-lead-page"><div className="broker-container broker-empty"><MessageSquare size={32} aria-hidden="true"/><h1>ไม่พบคำขอ</h1><p>ลิงก์นี้ไม่มีคำขอในข้อมูลเดโมของเบราว์เซอร์นี้</p><Link href="/broker" className="broker-secondary">กลับ Dashboard</Link></div></main>;
  const currentLead: Lead = lead;
  const activeCall = currentLead.calls.find((call) => !call.endedAt);
  function patch(next: Partial<Lead>) { updateLead({ ...currentLead, ...next, updatedAt: new Date().toISOString() }); }
  function accept() { if (currentLead.status === "new") patch({ status: "contacting" }); }
  function startCall() { if (activeCall || !["contacting", "follow_up"].includes(currentLead.status)) return; patch({ status: "contacting", calls: [...currentLead.calls, { id: crypto.randomUUID(), startedAt: new Date().toISOString(), endedAt: null, outcome: null, note: "" }] }); }
  function endCall() { if (!activeCall || !note.trim()) return; patch({ status: outcome === "follow_up" ? "follow_up" : "closed", calls: currentLead.calls.map((call) => call.id === activeCall.id ? { ...call, endedAt: new Date().toISOString(), outcome, note: note.trim() } : call), notes: note.trim() }); setNote(""); document.getElementById("call-title")?.focus({preventScroll:true}); }
  const statusLabel={new:"ใหม่",contacting:"กำลังติดต่อ",follow_up:"ติดตามผล",closed:"ปิดเรื่อง"}[lead.status];
  return <main className="broker-workspace broker-lead-page"><div className="broker-demo-strip">โหมดผู้เชี่ยวชาญ · การสนทนาจำลอง ไม่มีการโทรจริง</div><div className="broker-container">
   <Link href="/broker" className="broker-back"><ArrowLeft size={16} aria-hidden="true"/>กลับ Dashboard</Link>
   <header className="broker-detail-heading"><div><p className="broker-eyebrow">คำขอผู้เชี่ยวชาญ</p><h1>{lead.displayName}</h1><p>ส่งเมื่อ <time dateTime={lead.createdAt}>{new Date(lead.createdAt).toLocaleString("th-TH",{timeZone:"Asia/Bangkok"})}</time></p></div><span className={`broker-status broker-status-${lead.status}`} role="status">{statusLabel}</span></header>
   <div className="broker-intro-grid"><BrokerBrief lead={lead}/><BrokerDirection lead={lead}/></div>
   <BrokerMatches lead={lead} onQuestion={useQuestion}/>
   {draftNotice&&<p className="broker-draft-notice" role="status">{draftNotice}</p>}
   <div className="broker-work-grid"><div className="broker-communication">
    <section className="broker-panel broker-contact-workspace" aria-labelledby="contact-workspace-title"><div className="broker-panel-heading"><h2 id="contact-workspace-title">คุยกับลูกค้า</h2><div className="broker-mode-switch" role="group" aria-label="ช่องทางสนทนา"><button type="button" aria-pressed={contactMode==="chat"} onClick={()=>setContactMode("chat")}>แชต</button><button type="button" aria-pressed={contactMode==="call"} onClick={()=>setContactMode("call")}>โทรจำลอง</button></div></div>
    <div hidden={contactMode!=="chat"}><BrokerChat lead={lead} draft={draft} onDraft={value=>{setDraft(value);setDraftNotice("");}} onUpdate={updateLead}/></div>
    <div hidden={contactMode!=="call"}>    <section className="broker-panel broker-call-panel" aria-labelledby="call-title"><p className="broker-eyebrow">ขั้นตอนถัดไป</p><h2 id="call-title" tabIndex={-1}>{lead.status==="closed"?"ปิดเรื่องแล้ว":activeCall?"บันทึกการสนทนา":lead.status==="new"?"รับเรื่องเพื่อเริ่มดูแล":lead.status==="follow_up"?"พร้อมติดตามผล":"เริ่มสนทนากับลูกค้า"}</h2><p className="broker-muted">{lead.status==="closed"?"อ่านสรุปและประวัติการดูแลได้ด้านล่าง":"การสนทนาจำลองสำหรับเดโม ไม่มีการติดต่อหรือโทรจริง"}</p>{!activeCall&&lead.status!=="closed"&&<div className="broker-call-actions">{lead.status==="new"?<button type="button" onClick={accept} className="broker-primary">รับเรื่อง</button>:<button type="button" onClick={startCall} className="broker-primary">เริ่มสนทนา</button>}</div>}
     {activeCall&&<div className="broker-call-form"><p className="broker-timer">กำลังสนทนา <strong>{elapsed===null?"ไม่ทราบเวลาเริ่ม":`${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,"0")}`}</strong></p><label htmlFor="lead-note">บันทึกผล</label><textarea id="lead-note" value={note} onChange={event=>setNote(event.target.value)} maxLength={2000} aria-describedby="lead-note-hint" placeholder="สิ่งที่คุย และสิ่งที่จะทำต่อ"/><p id="lead-note-hint" className="broker-muted">เขียนบันทึกก่อนบันทึกผล · {note.length.toLocaleString("th-TH")}/2,000</p><label htmlFor="lead-outcome">ผลการสนทนา</label><select id="lead-outcome" value={outcome} onChange={event=>setOutcome(event.target.value as typeof outcome)}><option value="interested">สนใจต่อ</option><option value="follow_up">นัดติดตาม</option><option value="not_interested">ไม่สนใจ</option></select><button type="button" onClick={endCall} disabled={!note.trim()} className="broker-primary">บันทึกผล</button></div>}
    </section>
</div></section>
    <details className="broker-panel broker-disclosure"><summary>ประวัติการดูแล · {currentLead.calls.length} ครั้ง</summary>{currentLead.calls.length?<ol className="broker-call-history">{[...currentLead.calls].reverse().map(call=>{const started=Date.parse(call.startedAt),ended=call.endedAt?Date.parse(call.endedAt):null;const seconds=ended!==null&&Number.isFinite(started)&&Number.isFinite(ended)&&ended>=started?Math.floor((ended-started)/1000):null;return <li key={call.id}><h3>{call.outcome==="follow_up"?"นัดติดตาม":call.outcome==="interested"?"สนใจต่อ":call.outcome==="not_interested"?"ไม่สนใจ":"กำลังคุย"}</h3><p className="broker-muted">เริ่ม {Number.isFinite(started)?<time dateTime={call.startedAt}>{new Date(started).toLocaleString("th-TH",{timeZone:"Asia/Bangkok"})}</time>:"ไม่ทราบเวลา"}</p>{call.endedAt&&<p className="broker-muted">จบ {ended!==null&&Number.isFinite(ended)?<time dateTime={call.endedAt}>{new Date(ended).toLocaleString("th-TH",{timeZone:"Asia/Bangkok"})}</time>:"ไม่ทราบเวลา"} · {seconds===null?"ไม่ทราบระยะเวลา":`${Math.floor(seconds/60)} นาที ${seconds%60} วินาที`}</p>}{call.note&&<p className="broker-message-content">{call.note}</p>}</li>;})}</ol>:<p className="broker-muted">ยังไม่ได้เริ่มการสนทนา</p>}</details>
   </div><aside className="broker-archive" aria-label="ข้อมูลประกอบการดูแล">
    <details className="broker-panel broker-disclosure"><summary>สรุปข้อมูลและความต่างทั้งหมด</summary>{lead.summary.overview?<AssistantOverviewView overview={lead.summary.overview} plans={lead.planFacts}/>:<p className="broker-muted">คำขอเก่ายังไม่มีข้อมูลสรุปจากแชต</p>}</details>
    <details className="broker-panel broker-disclosure"><summary>ข้อมูลแผน ณ ตอนส่ง · {lead.planFacts?.length??0} แผน</summary>{lead.planFacts?.length?lead.planFacts.map(plan=><div key={plan.id} className="broker-saved-plan"><h3>{plan.name}</h3><p>{plan.price?formatPrice(plan.price):formatPremium(plan.premiumTHB,plan.premiumPeriod,plan.premiumNote)}</p><a href={plan.source.url} target="_blank" rel="noreferrer" className="broker-source">{plan.source.label} ↗</a><HistoricalCard card={{type:"plans",planIds:[plan.id],fieldKeys:[]}} lead={lead}/></div>):<p className="broker-muted">คำขอเก่าไม่มีข้อมูลแผนที่บันทึกไว้</p>}</details>
</aside></div>
  </div></main>;
}
