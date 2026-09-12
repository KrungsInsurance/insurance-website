"use client";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertDialog } from "radix-ui";
import type { Policy } from "@/lib/types";
import Link from "@/components/native-link";
import { getPlan } from "@/lib/catalog";
import { useDemo } from "@/components/demo-provider";
function status(renewsOn: string, life: boolean) {
 const days = Math.ceil((new Date(`${renewsOn}T00:00:00Z`).getTime() - new Date("2026-09-11T00:00:00Z").getTime()) / 86400000);
 return days < 0 ? [life ? "เลยกำหนดชำระเบี้ย" : "หมดอายุ", "text-red-700"] : days <= 30 ? [life ? "ใกล้ชำระเบี้ย" : "ใกล้ต่ออายุ", "text-amber-800"] : [life ? "ยังไม่ถึงกำหนดชำระ" : "ใช้งานอยู่", "text-[#0066cc]"];
}
function thaiDate(value: string) { return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`)); }
export default function MyInsurancePage() {
 const { state,setSelection } = useDemo();
 const [pendingPolicy,setPendingPolicy]=useState<Policy|null>(null);const helpTrigger=useRef<HTMLButtonElement|null>(null);
 function openHelp(policy:Policy){flushSync(()=>setSelection([policy.planId]));window.dispatchEvent(new CustomEvent("insurance-chat",{detail:{policyId:policy.id}}));}
 function requestHelp(policy:Policy,button:HTMLButtonElement){helpTrigger.current=button;if(state.selection.some(id=>getPlan(id)?.category!==getPlan(policy.planId)?.category))setPendingPolicy(policy);else openHelp(policy);}

 return <main className="policies-page"><header><h1>ประกันของฉัน</h1><p>กรมธรรม์ตัวอย่าง · วันที่สาธิต 11 กันยายน 2569</p></header><div className="policy-grid">{state.policies.map(policy => {
  const plan = getPlan(policy.planId), life = plan?.category === "life";
  const [label, tone] = status(policy.renewsOn, life);
  return <article key={policy.id} className="policy-card"><div className="policy-art">{plan && <img src={plan.image} alt={`ภาพประกอบประกัน ${plan.name}`}/>}<div className="policy-heading"><p>{plan?.insurer}</p><h2>{plan?.name ?? "ไม่พบข้อมูลแผน"}</h2></div><div className="policy-date"><span>{life ? "กำหนดชำระเบี้ย" : "วันต่ออายุประกัน"}</span><strong className={tone}>{thaiDate(policy.renewsOn)}</strong></div></div><div className="policy-info"><p className={`text-sm ${tone}`}>{label}</p><details><summary>ข้อมูลกรมธรรม์</summary><dl><div><dt>เลขกรมธรรม์ตัวอย่าง</dt><dd>{policy.policyNumber}</dd></div><div><dt>ผู้ถือ</dt><dd>{policy.holder}</dd></div><div><dt>เริ่มคุ้มครอง</dt><dd>{thaiDate(policy.startsOn)}</dd></div></dl><p className="mt-3 text-xs text-[#6e6e73]">เบี้ยกรมธรรม์นี้ยังไม่มีข้อมูล ราคาในหน้าผลิตภัณฑ์เป็นราคาอ้างอิง</p>{plan && <Link href={`/plans/${plan.id}`} className="text-link text-sm">ดูรายละเอียดแผน ›</Link>}{plan&&<button className="text-link text-sm" onClick={e=>requestHelp(policy,e.currentTarget)}>ถามเรื่องกรมธรรม์ตัวอย่าง ›</button>}</details></div></article>;
 })}</div><AlertDialog.Root open={pendingPolicy!==null} onOpenChange={open=>{if(!open)setPendingPolicy(null);}}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30"/><AlertDialog.Content onCloseAutoFocus={event=>{event.preventDefault();helpTrigger.current?.focus();}} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-xl font-semibold">ถามประกันอีกหมวด?</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">เปลี่ยนแผนที่เลือกเป็นแผนของกรมธรรม์ตัวอย่างนี้ เพื่อให้แชทอ่านบริบทที่ตรงกัน</AlertDialog.Description><div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={()=>{if(pendingPolicy)openHelp(pendingPolicy);}}>เปลี่ยนและเปิดแชท</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root></main>;
}
