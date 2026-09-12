"use client";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import "./chat-workspace.css";
import { HistoricalCard } from "./broker-history-card";
import type { Lead } from "@/lib/types";
import { z } from "zod";

export function BrokerChat({ lead, draft, onDraft, onUpdate }: { lead: Lead; draft: string; onDraft: (value: string) => void; onUpdate: (lead: Lead) => void }) {
  const messages=lead.brokerMessages??[];
  const full=messages.length>98;
  const closed=lead.status==="closed";
  const log=useRef<HTMLDivElement>(null),latestLead=useRef(lead),controller=useRef<AbortController|null>(null),sending=useRef(false);
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  useEffect(()=>{latestLead.current=lead;},[lead]);
  useEffect(()=>()=>controller.current?.abort(),[]);
  const [followUpNote,setFollowUpNote]=useState("");
  const [outcome,setOutcome]=useState<"follow_up"|"closed">("follow_up");
  const [savedNotice,setSavedNotice]=useState("");
  useEffect(()=>{if(log.current&&messages.length)log.current.scrollTop=log.current.scrollHeight;},[messages.length]);
  async function send(event:React.FormEvent) {
    event.preventDefault();const content=draft.trim();if(!content||content.length>2000||full||closed||sending.current)return;
    sending.current=true;setBusy(true);setError("");controller.current=new AbortController();
    try{
      const response=await fetch("/api/broker/chat",{method:"POST",signal:controller.current.signal,headers:{"content-type":"application/json"},body:JSON.stringify({leadId:lead.id,displayName:lead.displayName,summary:{category:lead.summary.category,needs:lead.summary.needs,currentCoverage:lead.summary.currentCoverage??[],questions:lead.summary.questions,budgetTHB:lead.summary.budgetTHB},transcript:lead.transcript.map(({role,content})=>({role,content})),messages:[...messages.map(({role,content})=>({role,content})),{role:"broker",content}]})});
      const raw=await response.json();if(!response.ok)throw new Error(z.object({error:z.object({message:z.string()})}).safeParse(raw).data?.error.message??"ส่งข้อความไม่สำเร็จ");
      const reply=z.object({mode:z.literal("live"),message:z.string().min(1).max(600)}).parse(raw);
      const current=latestLead.current;if(current.id!==lead.id||current.status==="closed"||controller.current.signal.aborted)return;
      const createdAt=new Date().toISOString();
      onUpdate({...current,status:current.status==="new"?"contacting":current.status,updatedAt:createdAt,brokerMessages:[...(current.brokerMessages??[]),{id:crypto.randomUUID(),role:"broker",content,createdAt},{id:crypto.randomUUID(),role:"customer",sourceMode:"live",content:reply.message,createdAt}]});
      onDraft("");
    }catch(error){if(!(error instanceof Error&&error.name==="AbortError"))setError(error instanceof Error?error.message:"ส่งข้อความไม่สำเร็จ ไม่มีการสร้างคำตอบทดแทน");}
    finally{sending.current=false;setBusy(false);}
  }
  return <div className="broker-chat chat-workspace">
    <div className="broker-conversation-meta"><p>บทสนทนาตั้งแต่เริ่มคุยกับ AI · คุยต่อได้ที่นี่</p><button type="button" onClick={()=>{log.current?.scrollTo({top:log.current.scrollHeight});log.current?.focus({preventScroll:true});}}>ข้อความล่าสุด ↓</button></div>
    <div ref={log} className="broker-chat-log chat-scroll" role="log" aria-label="บทสนทนาทั้งหมดกับลูกค้า" aria-live="polite" aria-relevant="additions" tabIndex={0}>
      <div className="chat-messages">
        {lead.transcript.map((message,index)=><article key={`history-${index}`} className="chat-message is-assistant">
          <div className="chat-bubble"><small>{message.role==="user"?"ลูกค้า":message.mode==="live"?"ผู้ช่วย AI · Live":message.mode==="mock"?"ผู้ช่วย AI · บทสนทนาตัวอย่าง":"ผู้ช่วย AI · ประวัติเดิม"}</small><p>{message.content}</p></div>
          {message.role==="assistant"&&message.cards?.map((card,j)=><div className="broker-history-card" key={j}><HistoricalCard card={card} lead={lead}/></div>)}
        </article>)}
        <p className="broker-chat-handoff">{lead.transcript.length?"ส่งต่อให้ Broker ดูแลต่อ":"ลูกค้าส่งความสนใจจากหน้าแผน"}</p>
        {messages.map(message=><article key={message.id} className={`chat-message ${message.role==="broker"?"is-user":"is-assistant"}`}><div className={`chat-bubble ${message.role==="broker"?"is-user":""}`}><small>{message.role==="broker"?"คุณ · Broker":message.sourceMode==="live"?"ลูกค้า · Live AI":"ลูกค้า · ตัวอย่างเดิม"}<time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Bangkok"})}</time></small><p>{message.content}</p></div></article>)}
      </div>
    </div>
    {busy&&<p role="status">ChatGPT กำลังตอบในบทบาทลูกค้า…</p>}{error&&<p className="chat-card-error" role="alert">{error}</p>}
    <footer className="chat-composer"><div className="chat-composer-inner"><form onSubmit={send}>
      <label className="sr-only" htmlFor="broker-message">ข้อความถึงลูกค้า</label><textarea id="broker-message" rows={2} value={draft} onChange={event=>onDraft(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();event.currentTarget.form?.requestSubmit();}}} maxLength={2000} disabled={full||closed||busy} placeholder="พิมพ์ข้อความคุยกับลูกค้า…" aria-describedby="broker-chat-hint broker-chat-demo"/>
      <button type="submit" className="action-primary" aria-label="ส่งข้อความในเดโม" disabled={!draft.trim()||full||closed||busy}><Send size={20} aria-hidden="true"/></button>
    </form><p id="broker-chat-hint">{closed?"ปิดเรื่องแล้ว อ่านประวัติแชตได้":full?"ถึงขีดจำกัด 100 ข้อความของเคสเดโมนี้แล้ว":`${draft.length.toLocaleString("th-TH")}/2,000 · Enter ส่ง · Shift + Enter ขึ้นบรรทัดใหม่`}</p><p id="broker-chat-demo">ChatGPT จำลองลูกค้าตามเคส · ไม่ส่งข้อความให้บุคคลจริง</p></div></footer>
    {lead.notes&&<p className="broker-care-note"><strong>บันทึกล่าสุด</strong> {lead.notes}</p>}
    {!closed&&messages.length>0&&<details className="broker-disclosure broker-chat-outcome"><summary>บันทึกผล / นัดติดตาม</summary><form onSubmit={event=>{event.preventDefault();if(busy||!followUpNote.trim()||lead.calls.some(call=>!call.endedAt))return;onUpdate({...lead,status:outcome,notes:followUpNote.trim(),updatedAt:new Date().toISOString()});setFollowUpNote("");setSavedNotice("บันทึกผลการแชตแล้ว");}}><label htmlFor="broker-followup-note">สรุปสิ่งที่ตกลงและขั้นตอนถัดไป</label><textarea id="broker-followup-note" value={followUpNote} onChange={event=>setFollowUpNote(event.target.value)} maxLength={2000}/><label htmlFor="broker-chat-outcome">สถานะหลังคุย</label><select id="broker-chat-outcome" value={outcome} onChange={event=>setOutcome(event.target.value as typeof outcome)}><option value="follow_up">นัดติดตาม</option><option value="closed">ปิดเรื่อง</option></select>{lead.calls.some(call=>!call.endedAt)&&<p className="broker-muted">มีการโทรจำลองค้างอยู่ จบการโทรก่อนบันทึกสถานะ</p>}<button type="submit" className="broker-secondary" disabled={busy||!followUpNote.trim()||lead.calls.some(call=>!call.endedAt)}>บันทึกผลแชต</button></form></details>}
    {savedNotice&&<p className="broker-muted" role="status">{savedNotice}</p>}
  </div>;
}
