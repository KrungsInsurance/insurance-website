import { categoryFields } from "@/lib/catalog";
import { shortBasis, shortCoverage, shortFieldLabel } from "@/lib/ui-copy";
import type { Plan } from "@/lib/types";

export function PlanTradeoffs({plan, compact = false}:{plan:Plan; compact?:boolean}) {
  if (compact) {
    const fields = categoryFields[plan.category];
    const useful = fields.filter(field => {
      const cell = plan.coverageCells[field.key];
      return cell.status === "known" && cell.inclusion === "included" && cell.value !== false && cell.value !== 0;
    });
    const priorityKeys: Partial<Record<Plan["category"], string[]>> = {
      health: ["annualLimit", "perAdmissionLimit", "roomPerDay"],
      motor: ["class", "ownDamageLimit", "medicalPerPerson"],
      life: ["coverageYears", "coverageUntilAge", "paymentYears", "lifeType"],
      accident: ["medicalPerAccident", "deathBenefit", "hospitalAdmissionBenefit"],
      travel: ["medicalLimit", "maxTripDays", "region"],
      property: ["combinedPropertyLimit", "fireCoverage", "floodLimit"],
    };
    const priority = priorityKeys[plan.category] ?? [];
    const ordered = [...useful].sort((a, b) => {
      const aRank = priority.indexOf(a.key), bRank = priority.indexOf(b.key);
      return (aRank < 0 ? priority.length : aRank) - (bRank < 0 ? priority.length : bRank);
    });
    const metrics = (ordered.length ? ordered : fields).slice(0, 2);
    const caveats = fields.filter(field => {
      const cell = plan.coverageCells[field.key];
      return cell.status === "not_covered" || cell.status === "conflicting" || cell.inclusion === "optional";
    }).slice(0, 2);
    return <div className="plan-tradeoffs plan-tradeoffs-compact">
      <dl>{metrics.map(field => {
        const cell = plan.coverageCells[field.key];
        const basis = shortBasis(cell);
        return <div key={field.key}><dt>{shortFieldLabel(field.key, field.label)}{cell.inclusion === "optional" && " · ซื้อเพิ่ม"}</dt><dd>{shortCoverage(cell)}{basis && <span className="tradeoff-basis">{basis}</span>}</dd></div>;
      })}</dl>
      {caveats.length > 0 && <ul aria-label="ข้อควรรู้">{caveats.map(field => {
        const cell = plan.coverageCells[field.key];
        return <li key={field.key}><span>{shortFieldLabel(field.key, field.label)}</span><strong>{cell.inclusion === "optional" ? "ซื้อเพิ่ม" : shortCoverage(cell)}</strong></li>;
      })}</ul>}
    </div>;
  }
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
