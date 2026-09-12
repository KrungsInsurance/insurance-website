"use client";
import { useState } from "react";
import { categoryFields, getPlan } from "@/lib/catalog";
import { buildComparison } from "@/lib/compare";
import { formatCoverageCell, formatPrice } from "@/lib/display";
import { insuranceTerms, type InsuranceTermKey } from "@/lib/insurance-terms";
import { categories, type Category, type ChatCard, type CoverageCell, type Plan } from "@/lib/types";
import { shortBasis, shortCoverage, shortFieldLabel } from "@/lib/ui-copy";
import { PlanPrice } from "./plan-price";
import { BudgetChoices } from "./budget-choices";

export const categoryLabels:Record<Category,string>={health:"สุขภาพ",motor:"รถยนต์",life:"ชีวิต",accident:"อุบัติเหตุ",travel:"เดินทาง",property:"ทรัพย์สิน",liability:"ความรับผิด",pet:"สัตว์เลี้ยง","critical-illness":"โรคร้ายแรง",cyber:"ภัยไซเบอร์",business:"ธุรกิจ",event:"งานอีเวนต์",sports:"กีฬา"};
export type CardAction=(intent:"select"|"interest"|"handoff"|"compare",ids:string[])=>string|void;
type Props={card:ChatCard;selection:string[];disabled:boolean;current:boolean;onAction:CardAction;onCategory:(category:Category)=>void;onBudget:(budget:number|null,category:Category|null)=>void};
const featured:Partial<Record<Category,string[]>>={motor:["class","ownDamageLimit","thirdPartyProperty","thirdPartyBodilyPerPerson","deductible","repairType"],health:["annualLimit","perDiseaseLimit","roomPerDay","opdPerYear","deductible","copay"]};
function fieldsFor(plan:Plan,keys:string[]){const fields=categoryFields[plan.category];return (keys.length?keys:featured[plan.category]??fields.slice(0,6).map(f=>f.key)).map(key=>fields.find(f=>f.key===key)).filter(f=>f!==undefined).slice(0,8);}

function Fact({cell}:{cell:CoverageCell}) {
 const basis=shortBasis(cell);
 return <div className="chat-fact"><strong>{shortCoverage(cell)}</strong>{basis&&<small>{basis}</small>}{cell.inclusion==="optional"&&<small className="chat-optional">ซื้อเพิ่ม</small>}</div>;
}

function PlanEvidence({plans}:{plans:Plan[]}) {
 return <details className="chat-fact-details chat-plan-evidence"><summary>เงื่อนไขและแหล่งข้อมูล</summary>
  {plans.map(plan=><section key={plan.id}>
   <h4>{plan.name}</h4>
   <p>{formatPrice(plan.price)}</p>
   <h5>การสมัคร</h5><p>{plan.eligibility}</p>
   {plan.highlights.length>0&&<><h5>จุดเด่น</h5><ul>{plan.highlights.map(text=><li key={text}>{text}</li>)}</ul></>}
   <dl>{categoryFields[plan.category].map(field=>{
    const cell=plan.coverageCells[field.key];
    return <div key={field.key}><dt>{shortFieldLabel(field.key,field.label)}</dt><dd>{cell.status==="known"?formatCoverageCell(cell):shortCoverage(cell)}{cell.status!=="known"&&cell.conditions.map(condition=><p key={condition}>{condition}</p>)}</dd></div>;
   })}</dl>
   {plan.exclusions.length>0&&<><h5>ข้อจำกัด</h5><ul>{plan.exclusions.map(text=><li key={text}>{text}</li>)}</ul></>}
   <h5>แหล่งข้อมูล</h5>{plan.sources.filter((source,index,all)=>all.findIndex(item=>item.url===source.url)===index).map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.locator} ↗</a>)}
  </section>)}
 </details>;
}

export function ChatCardView({card,selection,disabled,current,onAction,onCategory,onBudget}:Props){
 const [error,setError]=useState("");
 const act:CardAction=(intent,ids)=>setError(onAction(intent,ids)||"");
 const feedback=error?<p className="chat-card-error" role="alert">{error}</p>:null;
 if(card.type==="term"){
  const term=insuranceTerms[card.term as InsuranceTermKey];if(!term)return null;
  return <details className="chat-result-card chat-term-card chat-fact-details"><summary>{term.title}</summary><p>{term.description}</p><p className="chat-card-caution">{term.caution}</p><a className="text-link" href={term.source} target="_blank" rel="noreferrer">แหล่งข้อมูล ↗</a></details>;
 }
 if(card.type==="question")return <section className="chat-result-card chat-question-card"><h3>{card.prompt}</h3>{card.kind==="category"?<div className="chat-choice-grid" role="group" aria-label="เลือกหมวดเพื่อเริ่มคุย">{categories.map(category=><button className="action-secondary" key={category} disabled={disabled||!current} onClick={()=>onCategory(category)}>{categoryLabels[category]}</button>)}</div>:<BudgetChoices category={card.category} disabled={disabled||!current} onChoose={amount=>onBudget(amount,card.category)}/>}{!current&&<p className="chat-card-caution">ตอบคำถามล่าสุด หรือพิมพ์ความต้องการใหม่</p>}{feedback}</section>;
 const plans=card.planIds.map(getPlan).filter(plan=>plan!==undefined);if(plans.length!==card.planIds.length)return <p className="chat-card-caution">ข้อมูลแผนเปลี่ยนแล้ว ลองถามอีกครั้ง</p>;
 if(card.type==="handoff")return <section className="chat-result-card"><h3>คุยกับผู้เชี่ยวชาญ</h3><p>{card.reason}</p><ul className="chat-handoff-plans">{plans.map(p=><li key={p.id}>{p.name}</li>)}</ul><button className="action-primary" disabled={disabled||!current} onClick={()=>act("handoff",card.planIds)}>ตรวจสรุป</button><p className="chat-card-caution">ตรวจและยินยอมก่อนส่งคำขอเดโม</p>{feedback}</section>;
 if(card.type==="comparison"){
  let comparison;try{comparison=buildComparison(card.category,card.planIds);}catch{return <p className="chat-card-error">แผนชุดนี้เทียบกันไม่ได้ กรุณาเลือกใหม่</p>;}
  const fields=fieldsFor(plans[0],card.fieldKeys),rows=comparison.rows.filter(row=>fields.some(f=>f.key===row.key));
  return <section className="chat-result-card chat-comparison-card"><p className="chat-card-eyebrow">ประกัน{categoryLabels[card.category]}</p><h3>เปรียบเทียบ {plans.length} แผน</h3>
   <div className="chat-table-scroll" role="region" aria-label="ตารางเปรียบเทียบในแชต" tabIndex={0}><table><thead><tr><th scope="col">ความคุ้มครอง</th>{plans.map(p=><th scope="col" key={p.id}><small>{p.insurer}</small>{p.name}</th>)}</tr></thead><tbody>
    <tr><th scope="row">เบี้ยประกัน</th>{plans.map(p=><td key={p.id}><PlanPrice price={p.price} className="chat-price" compact/></td>)}</tr>
    {rows.map(row=><tr key={row.key}><th scope="row">{shortFieldLabel(row.key,row.label)}<small>{row.comparisonStatus==="not_comparable"?"ฐานต่างกัน":row.comparisonStatus==="insufficient"?"ข้อมูลไม่พอ":row.comparisonStatus==="same"?"เหมือนกัน":"ต่างกัน"}</small></th>{row.cells.map((cell,i)=><td key={plans[i].id}><Fact cell={cell}/></td>)}</tr>)}
    <tr><th scope="row">เลือกดูต่อ</th>{plans.map(p=><td key={p.id}><button className="action-secondary" disabled={disabled} onClick={()=>act("interest",[p.id])}>สนใจแผนนี้<span className="sr-only"> {p.name}</span></button></td>)}</tr>
   </tbody></table></div>
   <a className="text-link" href={comparison.url}>เปิดตารางเต็ม ›</a><PlanEvidence plans={plans}/>{feedback}
  </section>;
 }
 return <section className="chat-result-card chat-plans-card" aria-label="รายละเอียดแผนในแชต">
  {plans.map(plan=><article key={plan.id}>
   <header><p className="chat-card-eyebrow">{plan.insurer} · ประกัน{categoryLabels[plan.category]}</p><h3>{plan.name}</h3><PlanPrice price={plan.price} className="chat-price" compact/></header>
   <dl>{fieldsFor(plan,card.fieldKeys).map(field=><div key={field.key}><dt>{shortFieldLabel(field.key,field.label)}</dt><dd><Fact cell={plan.coverageCells[field.key]}/></dd></div>)}</dl>
   <div className="chat-plan-actions"><label><input type="checkbox" checked={selection.includes(plan.id)} disabled={disabled} onChange={()=>act("select",[plan.id])}/>เลือกเทียบ</label><button className="action-primary" disabled={disabled} onClick={()=>act("interest",[plan.id])}>สนใจแผนนี้<span className="sr-only"> {plan.name}</span></button><a className="text-link" href={`/plans/${plan.id}`}>ดูรายละเอียด ›</a></div>
  </article>)}
  <PlanEvidence plans={plans}/>
  {selection.length>=2&&<button className="action-secondary chat-compare-selected" disabled={disabled} onClick={()=>act("compare",selection)}>เทียบ {selection.length} แผนที่เลือก</button>}{feedback}
 </section>;
}
