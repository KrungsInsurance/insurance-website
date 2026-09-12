import type { Plan } from "./types.ts";

// Search returns a compact index. Detailed tools still return the complete sourced cells.
export function searchPlanFacts(plan: Plan, fieldKeys: readonly string[] = []) {
  const keys = [...new Set(fieldKeys)].filter(key => key in plan.coverageCells).slice(0, 3);
  const coverageCells = Object.fromEntries(keys.map(key => [key, plan.coverageCells[key]]));
  const referenced = new Set([...plan.price.sourceIds, ...Object.values(coverageCells).flatMap(cell => cell.sourceIds)]);
  const sources = plan.sources.filter(source => referenced.has(source.id)).map(({id, url, locator, checkedAt}) => ({id, url, locator, checkedAt}));
  return {
    id: plan.id, name: plan.name, insurer: plan.insurer, category: plan.category,
    subtype: plan.subtype, comparisonGroup: plan.comparisonGroup,
    productId: plan.productId, tierLabel: plan.tierLabel, price: plan.price,
    highlights: plan.highlights, coverageCells,
    availableFields: Object.keys(plan.coverageCells), sources,
    detailInstruction: "รายละเอียดนี้เป็นดัชนีค้นหา เรียก show_plan_details หรือ compare_plans ก่อนอ้างวงเงินหรือเงื่อนไขที่ไม่ได้อยู่ในผลนี้",
  };
}
