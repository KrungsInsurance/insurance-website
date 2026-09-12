import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getPlan } from "../lib/catalog.ts";
import { searchPlanFacts } from "../lib/chat-product-context.ts";

test("search context reduces repeated evidence while preserving price scenarios and selected cells", () => {
 const plans=catalog.filter(plan=>plan.category==="health");
 const compact=plans.map(plan=>searchPlanFacts(plan,["opdPerYear","deductible"]));
 const full=plans.map(plan=>({id:plan.id,name:plan.name,insurer:plan.insurer,price:plan.price,coverageCells:plan.coverageCells,sources:plan.sources}));
 assert.ok(JSON.stringify(compact).length < JSON.stringify(full).length * .5);
 for(let i=0;i<plans.length;i++){
  assert.deepEqual(compact[i].price,plans[i].price);
  assert.deepEqual(compact[i].coverageCells.opdPerYear,plans[i].coverageCells.opdPerYear);
  assert.ok(Object.values(compact[i].coverageCells).every(cell=>cell.sourceIds.every(id=>compact[i].sources.some(source=>source.id===id))));
 }
});

test("search summaries preserve quote-only and specialist comparison purpose",()=>{
 const plan=getPlan("business-01")!;
 const result=searchPlanFacts(plan,["not-a-field","coveredActivity","coveredActivity"]);
 assert.equal(result.price.amountTHB,null);
 assert.equal(result.comparisonGroup,plan.comparisonGroup);
 assert.deepEqual(Object.keys(result.coverageCells),["coveredActivity"]);
 assert.equal(result.coverageCells.coveredActivity.inclusion,plan.coverageCells.coveredActivity.inclusion);
});
