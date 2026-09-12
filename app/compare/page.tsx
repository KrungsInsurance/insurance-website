"use client";
import { useSearchParams } from "next/navigation";
import { AlertDialog, Select } from "radix-ui";
import { flushSync } from "react-dom";
import { useEffect, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { arePlansCompatible, buildComparison, parseCompareSelection, selectComparisonRows, comparisonDifferenceNote, type ComparisonRow } from "@/lib/compare";
import { getPlan, searchPlans } from "@/lib/catalog";
import { formatPrice } from "@/lib/display";
import { TermHelp } from "@/components/term-help";
import { categories, type Category, type Plan } from "@/lib/types";
import { CompareCell, CompareInsights, ComparePlanPrice, CompareConditions } from "@/components/compare-insights";
import { compareInterests, compareBudget } from "@/lib/compare-personalization";
import "@/components/compare-insights.css";
import { planVisual } from "@/lib/plan-visuals";
import { shortFieldLabel } from "@/lib/ui-copy";
const labels:Record<Category,string>={health:"สุขภาพ",motor:"รถยนต์",life:"ชีวิต",accident:"อุบัติเหตุ",travel:"เดินทาง",property:"ทรัพย์สิน",liability:"ความรับผิด", pet:"สัตว์เลี้ยง", "critical-illness":"โรคร้ายแรง", cyber:"ไซเบอร์", business:"ธุรกิจและการก่อสร้าง", event:"งานอีเวนต์", sports:"กีฬาและกิจกรรม"};
export default function ComparePage(){
 const params=useSearchParams();const {state,setSelection,setProfile,recordComparison,ready}=useDemo();const [differences,setDifferences]=useState(false);const [pendingCategory,setPendingCategory]=useState<Category|null>(null);
 const raw=params.get("category")??state.profile.preferredCategory??"health";const category=categories.includes(raw as Category)?raw as Category:null;
 const explicitIds=params.has("ids");const urlIds=params.get("ids")??"";
 const validUrlSelection=category?parseCompareSelection(category,urlIds):null;
 const ids=explicitIds?(urlIds===""?[]:urlIds.split(",")):state.selection;
 let comparison:ReturnType<typeof buildComparison>|null=null,message="";
 if(!category)message="ไม่รู้จักหมวดประกันนี้";else if(explicitIds&&validUrlSelection===null)message="รายการแผนในลิงก์ไม่ถูกต้อง เลือกไม่เกิน 3 แผนที่ไม่ซ้ำและเปรียบเทียบร่วมกันได้";else if(ids.some(id=>!getPlan(id)))message="ไม่พบแผนที่ระบุในลิงก์";else if(ids.some(id=>getPlan(id)?.category!==category))message="เปรียบเทียบได้เฉพาะแผนหมวดเดียวกัน";else if(ids.length>=2){try{comparison=buildComparison(category,ids);}catch(e){message=e instanceof Error?e.message:"รายการแผนไม่ถูกต้อง";}}
 const urlSelectionKey=validUrlSelection?.join(",")??null;
 useEffect(()=>{if(!ready||!explicitIds||urlSelectionKey===null)return;if(urlSelectionKey!==state.selection.join(","))setSelection(urlSelectionKey?urlSelectionKey.split(","):[]);if(category&&category!==state.profile.preferredCategory)setProfile({...state.profile,preferredCategory:category});},[ready,explicitIds,urlSelectionKey,state.selection,state.profile,category,setSelection,setProfile]);
 const comparisonKey=comparison?.planIds.join(",")??"";
 useEffect(()=>{if(ready&&comparisonKey&&comparisonKey!==state.comparedPlanIds.join(","))recordComparison(comparisonKey.split(","));},[ready,comparisonKey,state.comparedPlanIds,recordComparison]);
 const comparisonRows=selectComparisonRows(comparison?.rows??[],differences);
 const plans=category?searchPlans({category}):[];
 const interests=category?compareInterests(category,state.persona,state.assistantOverview?.customer,state.messages):[];
 const budget=category?compareBudget(category,state.persona,state.assistantOverview?.customer,state.messages):undefined;
 function update(next:string[],cat=category){flushSync(()=>{setSelection(next);if(cat)setProfile({...state.profile,preferredCategory:cat});});window.location.assign(`/compare?${new URLSearchParams({category:cat??"health",ids:next.join(",")})}`);}
 function chat(){setSelection(ids);window.dispatchEvent(new CustomEvent("insurance-chat"));}
 return <main className="comparison-page"><header className="comparison-title"><h1>เทียบให้ชัด</h1><div className="comparison-actions"><a className="text-link" href={`/browse${category?`?category=${category}`:""}`}>เลือกแผน ›</a><button className="text-link" disabled={Boolean(message)} onClick={chat}>คุยกับผู้ช่วย ›</button></div><label className="compare-category">ประเภทประกัน<select value={category??""} id="compare-category" onChange={e=>{const next=e.target.value as Category;if(ids.length)setPendingCategory(next);else update([],next);}} className="field"><option value="" disabled>เลือกประเภท</option>{categories.map(c=><option value={c} key={c}>{labels[c]}</option>)}</select></label></header>{message&&<div role="alert" className="mb-6 p-4 bg-red-50 rounded-xl"><p>{message}</p><a className="text-link" href="/browse">กลับไปเลือกแผน ›</a></div>}<section className="compare-slots" aria-label="แผนสำหรับเปรียบเทียบ">{[0,1,2].map(index=>{const plan=getPlan(ids[index]);return <article key={index}><PlanPicker value={ids[index]??""} label={`แผนที่ ${index+1}`} plans={plans.filter(p=>p.id===ids[index]||(!ids.includes(p.id)&&arePlansCompatible([...ids.filter((_,i)=>i!==index).map(getPlan).filter(p=>p!==undefined),p])))} onChange={value=>{const next=[...ids];next[index]=value;update(next.filter(Boolean));}}/>{plan?<><a href={`/plans/${plan.id}`}><img src={planVisual(plan).src} alt={planVisual(plan).alt}/><h2>{plan.name}</h2></a><ComparePlanPrice plan={plan}/><button className="text-link" onClick={()=>update(ids.filter(id=>id!==plan.id))}>นำแผนออก</button></>:<div className="empty-plan"><span>{index+1}</span><p>เลือกแผนเพื่อดูความต่าง</p></div>}</article>;})}</section>{ids.length<2&&<p className="text-center text-sm text-[#6e6e73] mt-4" role="status">เลือก 2–3 แผนในหมวดเดียวกัน</p>}{comparison&&<><CompareInsights plans={comparison.plans} interests={interests} budget={budget}/><section className="compare-coverage"><div className="compare-section-heading"><h2>ความคุ้มครอง</h2><label className="inline-flex gap-2 items-center min-h-11 text-sm"><input type="checkbox" checked={differences} onChange={e=>setDifferences(e.target.checked)}/>เฉพาะจุดต่าง</label></div><p className="compare-filter-status" role="status">{differences?`ต่าง ${comparisonRows.visible.length} จุด · เหมือน ${comparisonRows.sameCount} จุด · รอยืนยัน ${comparisonRows.pending.length} จุด`:`ทั้งหมด ${comparison.rows.length} จุด`}</p>{comparisonRows.visible.length?<CoverageTable plans={comparison.plans} rows={comparisonRows.visible}/>:<p className="compare-filter-empty">ยังไม่พบจุดต่างที่ยืนยันได้</p>}{differences&&comparisonRows.pending.length>0&&<details className="compare-pending"><summary>ข้อมูลรอยืนยัน <span>{comparisonRows.pending.length}</span></summary><CoverageTable plans={comparison.plans} rows={comparisonRows.pending} pending/></details>}<CompareConditions plans={comparison.plans}/></section></>}<AlertDialog.Root open={pendingCategory!==null} onOpenChange={open=>{if(!open)setPendingCategory(null);}}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30"/><AlertDialog.Content onCloseAutoFocus={event=>{event.preventDefault();document.getElementById("compare-category")?.focus();}} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-xl font-semibold">เปลี่ยนหมวดประกัน?</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">แผนที่เลือกไว้จะถูกล้าง เพื่อเปรียบเทียบเฉพาะหมวดเดียวกัน</AlertDialog.Description><div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={()=>{if(pendingCategory)update([],pendingCategory);}}>เปลี่ยนหมวด</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root></main>;
}

function PlanPicker({value,label,plans,onChange}:{value:string;label:string;plans:Plan[];onChange:(value:string)=>void}) {
 const companies=[...new Set(plans.map(plan=>plan.insurer))];
 return <Select.Root value={value} onValueChange={onChange}><Select.Trigger className="plan-picker-trigger" aria-label={label}><Select.Value placeholder={`เลือก${label}`}/><Select.Icon aria-hidden="true">⌄</Select.Icon></Select.Trigger><Select.Portal><Select.Content className="plan-picker-menu" position="popper" sideOffset={8} collisionPadding={16}><Select.Viewport>{companies.map(company=><Select.Group key={company}><Select.Label className="plan-picker-company">{company}</Select.Label>{plans.filter(plan=>plan.insurer===company).map(plan=><Select.Item className="plan-picker-option" key={plan.id} value={plan.id} textValue={plan.name}><img src={planVisual(plan).src} alt=""/><span><Select.ItemText>{plan.name}</Select.ItemText><small>{formatPrice({...plan.price,scenario:null,includes:null})}</small></span><Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator></Select.Item>)}</Select.Group>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>;
}

function CoverageTable({plans,rows,pending=false}:{plans:Plan[];rows:ComparisonRow[];pending?:boolean}) {
 return <div className="comparison-table" role="region" aria-label={pending?"ข้อมูลรอยืนยัน เลื่อนแนวนอนเพื่อดูทุกแผน":"ตารางความคุ้มครอง เลื่อนแนวนอนเพื่อดูทุกแผน"} tabIndex={0}>
  <table data-plan-count={plans.length} style={{minWidth:168+plans.length*210}}>
   <colgroup><col className="compare-label-column"/>{plans.map(plan=><col key={plan.id}/>)}</colgroup>
   <thead><tr><th>ข้อมูล</th>{plans.map(plan=><th key={plan.id}>{plan.name}</th>)}</tr></thead>
   <tbody>{rows.map(item=>{const note=comparisonDifferenceNote(item);return <tr key={item.key}>
    <th scope="row" title={item.label}>{shortFieldLabel(item.key,item.label)}<TermHelp fieldKey={item.key}/>{note&&<small className="compare-row-note">{note}</small>}</th>
    {item.cells.map((cell,i)=><td key={plans[i].id}><CompareCell plan={plans[i]} cell={cell} fieldKey={item.key} label={item.label} showDetails={note==="เงื่อนไขต่างกัน"}/></td>)}
   </tr>;})}</tbody>
  </table>
 </div>;
}
