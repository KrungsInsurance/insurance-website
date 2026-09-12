"use client";
import { getBudgetChoices } from "@/lib/chat-budget";
import { formatPrice } from "@/lib/display";
import type { Category } from "@/lib/types";

export function BudgetChoices({category,disabled=false,onChoose}:{category:Category|null;disabled?:boolean;onChoose:(amount:number|null)=>void}){
 const choices=getBudgetChoices(category);
 return <div className="budget-choices space-y-3">
  <p className="chat-card-caution">{choices.length?"ตัวเลขอ้างอิงจากเบี้ยรายปีที่เผยแพร่ เงื่อนไขแต่ละแผนต่างกัน ไม่ใช่ราคาเสนอเฉพาะคุณ":"ยังไม่มีเบี้ยรายปีพร้อมแหล่งอ้างอิงสำหรับตั้งตัวเลือกงบ ข้ามไปดูความคุ้มครองก่อนได้"}</p>
  <div className="chat-choice-grid" role="group" aria-label="เลือกงบอ้างอิงต่อปี">{choices.map(choice=><button key={choice.amountTHB} type="button" className="action-secondary min-h-11 flex-col" disabled={disabled} onClick={()=>onChoose(choice.amountTHB)}><span>{new Intl.NumberFormat("th-TH",{maximumFractionDigits:2}).format(choice.amountTHB)} บาท/ปี</span><small>{[...new Set(choice.references.map(ref=>ref.price.kind==="example"?"ราคาตัวอย่าง":ref.price.kind==="starting"?"ราคาเริ่มต้น":"ราคาตามตาราง"))].join(" · ")}</small></button>)}<button type="button" className="action-secondary min-h-11" disabled={disabled} onClick={()=>onChoose(null)}>ยังไม่กำหนดงบ</button></div>
  {choices.length>0&&<details className="chat-fact-details"><summary className="min-h-11 flex items-center cursor-pointer">ที่มาของตัวเลือกและเงื่อนไขราคา</summary>{choices.map(choice=><div key={choice.amountTHB} className="space-y-2 py-2">{choice.references.map(ref=><div key={ref.planId}><p className="font-medium">{ref.name}</p><p>{formatPrice(ref.price)}</p>{ref.sources.map(source=><a className="text-link inline-flex min-h-11 items-center" key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher} · {source.locator} ↗</a>)}</div>)}</div>)}</details>}
 </div>;
}
