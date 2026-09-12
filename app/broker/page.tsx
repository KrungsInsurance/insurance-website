"use client";
import { useState } from "react";
import Link from "@/components/native-link";
import { ArrowLeft, ArrowUpRight, Inbox, Search } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import type { Category, LeadStatus } from "@/lib/types";
import "@/components/broker.css";
const categories: Record<Category, string> = {health:"สุขภาพ",motor:"รถยนต์",life:"ชีวิต",accident:"อุบัติเหตุ",travel:"เดินทาง",property:"บ้านและทรัพย์สิน",liability:"ความรับผิด"};
const contactWindows = {morning:"ช่วงเช้า",afternoon:"ช่วงบ่าย",evening:"ช่วงเย็น"};
const labels = {new:"ใหม่",contacting:"กำลังติดต่อ",follow_up:"ติดตามผล",closed:"ปิดเรื่อง"} as const;
export default function BrokerPage(){
 const {state}=useDemo();const [filter,setFilter]=useState<LeadStatus|"all">("all");const [query,setQuery]=useState("");
 const leads=[...state.leads].sort((a,b)=>Number(b.status==="new")-Number(a.status==="new")||b.createdAt.localeCompare(a.createdAt));
 const counts=Object.fromEntries(Object.keys(labels).map(status=>[status,leads.filter(lead=>lead.status===status).length]));
 const search=query.trim().toLocaleLowerCase("th-TH");
 const filtered=leads.filter(lead=>(filter==="all"||lead.status===filter)&&(!search||[lead.displayName,categories[lead.summary.category],...lead.summary.interestedPlanIds.map(id=>lead.planFacts?.find(p=>p.id===id)?.name??id)].some(text=>text.toLocaleLowerCase("th-TH").includes(search))));
 return <main className="broker-workspace broker-page"><div className="broker-demo-strip">โหมดผู้เชี่ยวชาญ · ข้อมูลตัวอย่าง</div><div className="broker-container">
  <Link href="/" className="broker-back"><ArrowLeft size={16} aria-hidden="true"/>กลับหน้าแรก</Link>
  <header className="broker-page-heading"><div><p className="broker-eyebrow">Broker workspace</p><h1>ดูแลทุกคำขอ<br/>ให้ไปต่อได้</h1><p>สรุปจากลูกค้าและบทสนทนา พร้อมให้คุณรับช่วงดูแล</p></div><div className="broker-total"><strong>{leads.filter(lead=>lead.status!=="closed").length}</strong><span>คำขอที่ยังเปิดอยู่</span></div></header>
  <section className="broker-metrics" aria-label="จำนวนคำขอแยกตามสถานะ">{Object.entries(labels).map(([key,label])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(filter===key?"all":key as LeadStatus)} className="broker-metric"><span className={`broker-status-dot broker-dot-${key}`} aria-hidden="true"/><span>{label}</span><strong>{counts[key]}</strong></button>)}</section>
  <section className="broker-requests" aria-labelledby="requests-title"><div className="broker-list-heading"><div><h2 id="requests-title">คำขอทั้งหมด</h2><p>คำขอใหม่ขึ้นก่อน จากนั้นเรียงรายการล่าสุด</p></div><span className="broker-result-count" role="status">{filtered.length} จาก {leads.length} รายการ</span></div>
   <div className="broker-filter-bar"><label className="broker-search"><Search size={18} aria-hidden="true"/><span className="sr-only">ค้นหาชื่อ หมวด หรือแผน</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="ค้นหาชื่อ หมวด หรือแผน"/></label><label className="broker-status-select"><span className="sr-only">กรองสถานะ</span><select value={filter} onChange={event=>setFilter(event.target.value as LeadStatus|"all")}><option value="all">ทุกสถานะ</option>{Object.entries(labels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
   {filtered.length?<div className="broker-request-list">{filtered.map(lead=><Link key={lead.id} href={`/broker/leads/${lead.id}`} className="broker-request"><div className="broker-request-avatar" aria-hidden="true">{lead.displayName.trim().slice(0,1)||"?"}</div><div className="broker-request-body"><div className="broker-request-title"><h3>{lead.displayName}</h3><span className={`broker-status broker-status-${lead.status}`}>{labels[lead.status]}</span></div><p>{categories[lead.summary.category]} · สะดวก{contactWindows[lead.contactWindow]}</p><p className="broker-request-plans">{lead.summary.interestedPlanIds.map(id=>lead.planFacts?.find(plan=>plan.id===id)?.name??`${id} (ไม่มีชื่อที่บันทึกไว้)`).join(" · ")||"ไม่ได้ระบุแผน"}</p></div><div className="broker-request-end"><time dateTime={lead.createdAt}>{new Date(lead.createdAt).toLocaleDateString("th-TH",{day:"numeric",month:"short",year:"2-digit",timeZone:"Asia/Bangkok"})}</time><ArrowUpRight size={20} aria-hidden="true"/></div></Link>)}</div>:<div className="broker-empty"><Inbox size={32} aria-hidden="true"/><h3>{leads.length?"ไม่พบคำขอที่ตรงกัน":"ยังไม่มีคำขอให้ดูแล"}</h3><p>{leads.length?"ลองค้นหาด้วยชื่ออื่น หรือดูทุกสถานะ":"เมื่อลูกค้ายืนยันส่งข้อมูลให้ผู้เชี่ยวชาญ คำขอจะแสดงที่นี่"}</p>{leads.length?<button className="broker-secondary" onClick={()=>{setFilter("all");setQuery("");}}>ล้างตัวกรอง</button>:<Link href="/browse" className="broker-secondary">ดูแผนประกัน</Link>}</div>}
  </section>
 </div></main>;
}
