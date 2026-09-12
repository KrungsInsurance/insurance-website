import type { CoverageCell, Plan } from "@/lib/types";
import type { CompareInterest, CompareBudget } from "@/lib/compare-personalization";
import { compactPrice, planInterestReasons } from "@/lib/compare-personalization";
import { formatCoverageCell, formatPrice } from "@/lib/display";
import { categoryFields } from "@/lib/catalog";
import { shortCoverage, shortFieldLabel, shortBasis } from "@/lib/ui-copy";

export function CompareCell({plan,cell,fieldKey,label}:{plan:Plan;cell:CoverageCell;fieldKey:string;label:string}){
 const value=fieldKey==="premiumTHB"?compactPrice(plan.price):shortCoverage(cell);
 const qualifier=fieldKey!=="premiumTHB"&&cell.status==="known"?[cell.inclusion==="optional"?"ซื้อเพิ่ม":cell.inclusion==="unknown"?"รอยืนยันสิทธิ":null,shortBasis(cell)].filter(Boolean).join(" · "):null;
 return <div className="compare-cell"><div className={`compare-cell-value ${cell.status==="unknown"?"is-unknown":""}`} aria-label={`${label}: ${value}`}>{value}</div>{qualifier&&<small className="compare-cell-qualifier">{qualifier}</small>}</div>;
}
export function CompareInsights({plans,interests,budget}:{plans:Plan[];interests:CompareInterest[];budget?:CompareBudget}){
 return <section className="compare-insights" aria-labelledby="compare-insights-title">
  <div className="compare-section-heading"><h2 id="compare-insights-title">สำหรับคุณ</h2>{budget&&<div className="compare-budget"><span>งบของคุณ</span><strong>{budget.label}</strong></div>}</div>
  {!interests.length?<div className="compare-insights-empty"><p>อะไรสำคัญกับคุณ?</p><a href="/chat?start=1" className="text-link">บอกความต้องการ ›</a></div>:<>
   <div className="compare-insight-grid" style={{gridTemplateColumns:`repeat(${plans.length}, minmax(0, 1fr))`}}>{plans.map(plan=><article key={plan.id}><h3>{plan.name}</h3><ul>{planInterestReasons(plan,interests).map(reason=><li key={reason.interest.id}><strong>{reason.interest.label}</strong>{reason.fieldKey==="premiumTHB"?<span className="compare-reason-value">{compactPrice(plan.price)}</span>:plan.coverageCells[reason.fieldKey]?<CompareCell plan={plan} cell={plan.coverageCells[reason.fieldKey]} fieldKey={reason.fieldKey} label={reason.interest.label}/>:<span className="compare-reason-value">ยังไม่ได้ระบุ</span>}</li>)}</ul></article>)}</div>
   <details className="compare-context-detail"><summary>ความต้องการของคุณ</summary><ul>{interests.map(interest=><li key={interest.id}><strong>{interest.label}</strong>{interest.quote&&<blockquote>“{interest.quote}”</blockquote>}</li>)}</ul>{budget?.quote&&<p>งบ: “{budget.quote}”</p>}</details>
  </>}
 </section>;
}

export function ComparePlanPrice({plan}:{plan:Plan}){
 return <div className="compare-plan-price"><p>{compactPrice(plan.price)}</p></div>;
}

export function CompareConditions({plans}:{plans:Plan[]}){
 return <details className="compare-conditions"><summary>เงื่อนไขและข้อมูลแผน</summary><div className="compare-conditions-grid">{plans.map(plan=><section key={plan.id}><h3><a href={`/plans/${plan.id}`}>{plan.name} ›</a></h3><dl><div><dt>เบี้ยประกัน</dt><dd>{formatPrice(plan.price)}</dd></div>{categoryFields[plan.category].filter(field=>field.key!=="premiumTHB").map(field=>{const cell=plan.coverageCells[field.key];if(!cell||(cell.status==="unknown"&&!cell.conditions.length))return null;return <div key={field.key}><dt>{shortFieldLabel(field.key,field.label)}</dt><dd>{formatCoverageCell(cell)}</dd></div>;})}</dl><dl><div><dt>การสมัคร</dt><dd>{plan.eligibility}</dd></div><div><dt>ข้อยกเว้น</dt><dd>{plan.exclusions.map(item=><p key={item}>{item}</p>)}</dd></div></dl><ul>{plan.sources.filter((source,index,all)=>all.findIndex(item=>item.url===source.url)===index).map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.title} ↗</a></li>)}</ul></section>)}</div></details>;
}
