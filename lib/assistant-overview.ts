import { z } from "zod";
import { customerFactsSchema, type CustomerFacts } from "./customer-extraction.ts";
import { buildComparison } from "./compare.ts";
import { formatCoverageCell } from "./display.ts";
import { getPlan } from "./catalog.ts";

export const differenceSchema=z.object({fieldKey:z.string().max(80),label:z.string().max(200),status:z.enum(["different","not_comparable","insufficient"]),sentence:z.string().max(12000),planIds:z.array(z.string()).min(2).max(3),sourceIds:z.array(z.string()).max(50)}).strict();
export const assistantOverviewSchema=z.object({customer:customerFactsSchema,retrievedPlanIds:z.array(z.string()).max(200),comparedPlanIds:z.array(z.string()).max(3),differences:z.array(differenceSchema).max(50),sourceMode:z.enum(["live","mock"]),generatedAt:z.string().datetime({offset:true})}).strict();
export type AssistantOverview=z.infer<typeof assistantOverviewSchema>;
export function buildAssistantOverview(customer:CustomerFacts,retrievedPlanIds:string[],comparedPlanIds:string[],sourceMode:"live"|"mock"):AssistantOverview {
 const differences:AssistantOverview["differences"]=[];
 if(comparedPlanIds.length>=2){
  const comparison=buildComparison(getPlan(comparedPlanIds[0])!.category,comparedPlanIds);
  for(const row of comparison.rows){
   if(row.comparisonStatus==="same")continue;
   const qualifier=row.comparisonStatus==="not_comparable"?"ฐานหรือเงื่อนไขต่างกัน จึงไม่จัดว่าสูงหรือต่ำกว่า":row.comparisonStatus==="insufficient"?"ข้อมูลยังไม่พอที่จะยืนยันความต่าง":"ข้อมูลต่างกันตามที่ระบุ";
   differences.push({fieldKey:row.key,label:row.label,status:row.comparisonStatus,planIds:[...comparedPlanIds],sourceIds:[...new Set(row.cells.flatMap(c=>c.sourceIds))],sentence:`${row.label}: ${qualifier} · ${row.cells.map((cell,i)=>`${comparison.plans[i].name}: ${formatCoverageCell(cell)}`).join(" | ")}`});
  }
 }
 return assistantOverviewSchema.parse({customer,retrievedPlanIds:[...new Set(retrievedPlanIds)],comparedPlanIds,differences,sourceMode,generatedAt:new Date().toISOString()});
}
