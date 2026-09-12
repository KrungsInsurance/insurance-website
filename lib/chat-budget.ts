import { searchPlans } from "./catalog.ts";
import type { Category, Plan, Price, SourceEvidence } from "./types.ts";

export type BudgetReference={planId:string;name:string;price:Price;sources:SourceEvidence[]};
export type BudgetChoice={amountTHB:number;references:BudgetReference[]};

// Annual budget anchors, not equal-risk quotes. Never interpolate a missing price.
export function getBudgetChoices(category:Category|null,plans?:Plan[]):BudgetChoice[]{
 if(!category)return [];
 const amounts=new Map<number,BudgetReference[]>();
 for(const plan of plans??searchPlans({category})){
  const {price}=plan;
  if(plan.category!==category||price.period!=="year"||price.kind==="quote_only"||price.amountTHB===null||!Number.isFinite(price.amountTHB)||price.amountTHB<=0)continue;
  const sources=plan.sources.filter(source=>price.sourceIds.includes(source.id));
  if(!price.sourceIds.length||sources.length!==new Set(price.sourceIds).size)continue;
  const refs=amounts.get(price.amountTHB)??[];refs.push({planId:plan.id,name:plan.name,price,sources});amounts.set(price.amountTHB,refs);
 }
 const choices=[...amounts].sort(([a],[b])=>a-b).map(([amountTHB,references])=>({amountTHB,references}));
 return choices.length<=4?choices:Array.from({length:4},(_,index)=>choices[Math.round(index*(choices.length-1)/3)]);
}
