import { categoryFields } from "@/lib/catalog";
import type { Plan } from "@/lib/types";

export function PlanTradeoffs({plan}:{plan:Plan}) {
  const coverageLimits=categoryFields[plan.category].flatMap(field=>{
    const cell=plan.coverageCells[field.key];
    if(cell.status==="not_covered")return [`${field.label}: ไม่คุ้มครอง`];
    if(cell.status==="conflicting")return [`${field.label}: ข้อมูลขัดกัน ต้องยืนยันกับบริษัท`];
    if(cell.inclusion==="optional")return [`${field.label}: เป็นตัวเลือกซื้อเพิ่ม`];
    return cell.conditions.map(condition=>`${field.label}: ${condition}`);
  });
  const limits=[...new Set([
    ...(plan.price.kind==="quote_only"?["ต้องขอใบเสนอราคา จึงจะทราบเบี้ยเฉพาะคุณ"]:[]),
    ...coverageLimits,
    ...plan.exclusions,
  ])].slice(0,2);
  return <div className="plan-tradeoffs">
    <section aria-label="จุดเด่น"><h4>จุดเด่น</h4><ul>{plan.highlights.slice(0,2).map(text=><li key={text}>{text}</li>)}</ul></section>
    <section aria-label="ข้อจำกัดที่ควรรู้"><h4>ข้อจำกัดที่ควรรู้</h4><ul>{limits.map(text=><li key={text}>{text}</li>)}</ul></section>
  </div>;
}
