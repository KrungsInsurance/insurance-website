import { categoryFields, getPlan } from "./catalog.ts";
import { categories, type Category, type CoverageValue, type Plan, type CoverageCell, type ComparisonStatus } from "./types.ts";

export type ComparisonRow = { comparisonStatus:ComparisonStatus; status:ComparisonStatus; cells:CoverageCell[]; key:string; label:string; unit:string|null; units:(string|null)[]; values:CoverageValue[]; different:boolean };
export type Comparison = { category: Category; planIds: string[]; plans: Plan[]; rows: ComparisonRow[]; url: string; dataMode: "demo" };
export class ComparisonError extends Error {
  code: "INVALID_INPUT" | "MIXED_CATEGORY" | "DUPLICATE_IDS" | "PLAN_NOT_FOUND" | "UNKNOWN_CATEGORY" | "INCOMPATIBLE_PLANS";
  constructor(code: "INVALID_INPUT" | "MIXED_CATEGORY" | "DUPLICATE_IDS" | "PLAN_NOT_FOUND" | "UNKNOWN_CATEGORY" | "INCOMPATIBLE_PLANS", message: string) { super(message); this.code = code; }
}

export function compareCells(cells:readonly CoverageCell[]):ComparisonStatus {
  if(cells.some(c=>c.status==="unknown"||c.status==="conflicting"||!c.sourceIds.length))return "insufficient";
  if(cells.some(c=>c.status==="known"&&typeof c.value==="number"&&!c.unit))return "insufficient";
  if(new Set(cells.map(c=>c.status)).size>1)return cells.some(c=>c.status==="not_applicable")?"not_comparable":"different";
  if(cells[0]?.status==="known"&&(cells.some(c=>!c.basis)||new Set(cells.map(c=>JSON.stringify([c.unit,c.basis,c.inclusion]))).size>1))return "not_comparable";
  const signature=(c:CoverageCell)=>JSON.stringify([c.value,c.status,c.unit,c.basis,c.inclusion,[...c.conditions].sort()]);
  return cells.some(c=>signature(c)!==signature(cells[0]))?"different":"same";
}
// Only descriptive metadata can compare without confirming benefit inclusion.
const productDescriptionFields = new Set(["insurer", "eligibility", "petType", "businessType", "eventType", "sportType", "occupancy"]);

function row(key:string,label:string,cells:CoverageCell[]):ComparisonRow {
 const hasUnknown=cells.some(cell=>cell.status!=="known");
 const scenariosMatch=new Set(cells.map(cell=>JSON.stringify(cell.conditions))).size===1;
 const comparisonStatus=key==="premiumTHB"&&!hasUnknown&&(!scenariosMatch||cells.some(cell=>cell.conditions[0]==="starting"))?"not_comparable":key!=="premiumTHB"&&!productDescriptionFields.has(key)&&cells.some(cell=>cell.status==="known"&&cell.inclusion==="unknown")?"insufficient":compareCells(cells);
 return {key,label,cells,comparisonStatus,status:comparisonStatus,unit:new Set(cells.map(c=>c.unit)).size===1?cells[0].unit:null,units:cells.map(c=>c.unit),values:cells.map(c=>c.status==="known"?c.value:null),different:comparisonStatus!=="same"};
}

export function arePlansCompatible(plans: readonly Plan[]): boolean {
  if (!plans.length) return true;
  if (plans.some(plan => plan.category !== plans[0].category)) return false;
  if (new Set(plans.map(plan => plan.comparisonGroup ?? plan.category)).size > 1) return false;
  return !["motor", "travel"].includes(plans[0].category) || (plans.every(plan => Boolean(plan.subtype)) && new Set(plans.map(plan => plan.subtype)).size === 1);
}

export function buildComparison(category: Category, ids: string[]): Comparison {
  if (!categories.includes(category)) throw new ComparisonError("UNKNOWN_CATEGORY", "ไม่รู้จักหมวดประกันนี้");
  if (!Array.isArray(ids) || ids.length < 2 || ids.length > 3 || ids.some((id) => typeof id !== "string" || !id)) throw new ComparisonError("INVALID_INPUT", "เลือกแผน 2–3 แผนเพื่อเปรียบเทียบ");
  if (new Set(ids).size !== ids.length) throw new ComparisonError("DUPLICATE_IDS", "มีแผนซ้ำในรายการเปรียบเทียบ");
  const plans = ids.map((id) => getPlan(id));
  if (plans.some((plan) => !plan)) throw new ComparisonError("PLAN_NOT_FOUND", "ไม่พบแผนที่ต้องการเปรียบเทียบ");
  const resolved = plans as Plan[];
  if (resolved.some((plan) => plan.category !== category)) throw new ComparisonError("MIXED_CATEGORY", "เปรียบเทียบได้เฉพาะแผนหมวดเดียวกัน");
  if (!arePlansCompatible(resolved)) throw new ComparisonError("INCOMPATIBLE_PLANS", "แผนมีประเภทความคุ้มครองต่างกัน เลือกแผนกลุ่มเดียวกันเพื่อเปรียบเทียบ");
  const common:ComparisonRow[]=[
    row("insurer","บริษัท",resolved.map(p=>({status:"known",value:p.insurer,unit:null,basis:"identity",inclusion:"included",conditions:[],sourceIds:[p.sources.find(s=>s.id.endsWith(":identity"))!.id]}))),
    row("premiumTHB","เบี้ยประกัน",resolved.map(p=>({status:p.price.amountTHB===null?"unknown":"known",value:p.price.amountTHB,unit:"บาท",basis:p.price.period,inclusion:"unknown",conditions:[p.price.kind,...[p.price.scenario,p.price.includes].filter((v):v is string=>v!==null)],sourceIds:p.price.sourceIds}))),
    row("eligibility","คุณสมบัติผู้สมัคร",resolved.map(p=>{const source=p.sources.find(s=>s.id.endsWith(":eligibility"));return source?{status:"known",value:p.eligibility,unit:null,basis:"eligibility",inclusion:"included",conditions:["ยังต้องผ่านการพิจารณารับประกัน"],sourceIds:[source.id]}:{status:"unknown",value:null,unit:null,basis:null,inclusion:"unknown",conditions:["ตรวจอายุสมัครในตารางและเงื่อนไขเฉพาะช่องทาง"],sourceIds:[]};})),
  ];
  const fields=categoryFields[category].map(field=>row(field.key,field.label,resolved.map(p=>p.coverageCells[field.key])));
  return {category,planIds:ids,plans:resolved,rows:[...common,...fields],url:`/compare?category=${category}&ids=${ids.join(",")}`,dataMode:"demo"};
}

export function parseCompareSelection(category: string, rawIds: string): string[] | null {
  if (!categories.includes(category as Category)) return null;
  const ids = rawIds === "" ? [] : rawIds.split(",");
  const plans = ids.map(getPlan);
  if (ids.length > 3 || new Set(ids).size !== ids.length || plans.some(plan => !plan || plan.category !== category)) return null;
  return arePlansCompatible(plans as Plan[]) ? ids : null;
}
