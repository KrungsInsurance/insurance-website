import test from "node:test";
import assert from "node:assert/strict";
import { getPlan, searchPlans } from "../lib/catalog.ts";
import { getBudgetChoices } from "../lib/chat-budget.ts";
import { categories } from "../lib/types.ts";

test("discovery query trims and searches name, insurer, and highlights", () => {
  assert.deepEqual(searchPlans({ category: "health", q: "  axa ", sort: "price-asc" }).map((plan) => plan.id), ["health-01", "health-02"]);
  assert.deepEqual(searchPlans({ category: "travel", q: "AXA" }).map((plan) => plan.id).length, 5);
});

test("discovery sorts deterministically and does not mutate catalog", () => {
  assert.deepEqual(searchPlans({ category: "life", sort: "price-desc" }).map((plan) => plan.premiumTHB), [69000, 22170, 19940, null, null, null]);
  assert.deepEqual(searchPlans({ category: "life", sort: "name" }).filter(plan=>["life-01","life-02","life-03","life-04"].includes(plan.id)).map((plan) => plan.id), ["life-01", "life-03", "life-04", "life-02"]);
  assert.equal(searchPlans({ category: "health", maxPremium: -1 }).length, 9);
  assert.equal(searchPlans({ category: "health", maxPremium: Number.NaN }).length, 9);
});

test("unknown plan returns no detail", () => {
  assert.equal(getPlan("unknown-plan"), undefined);
});

test("quote-only premiums are unknown, excluded from budgets and sorted after prices", () => {
  assert.equal(getPlan("motor-01")?.premiumTHB, null);
  assert.deepEqual(searchPlans({ category: "motor", maxPremium: 1 }), []);
  assert.deepEqual(searchPlans({ category: "motor", maxPremium: 645.21 }), []);
  for (const sort of ["price-asc", "price-desc"] as const) {
    const prices = searchPlans({ category: "motor", sort }).map(p => p.premiumTHB);
    assert.deepEqual(prices.slice(-3), [null, null, null]);
    assert.ok(prices.slice(0, 2).every(p => p !== null));
  }
});






test("CMI expired promotion is not silently treated as a current budget quote", () => {
  const cmi = getPlan("motor-05")!;
  assert.equal(cmi.price.kind, "quote_only");
  assert.equal(cmi.premiumTHB, null);
  assert.match(cmi.price.scenario!, /645.21.*581.01/);
  assert.match(cmi.price.scenario!, /15 ม.ค. 2569/);
  assert.ok(cmi.sources.some(s => s.url.endsWith("axacar-promotion")));
  assert.ok(searchPlans({category:"motor"}).some(p => p.id === cmi.id));
  assert.ok(!searchPlans({category:"motor",maxPremium:600}).some(p => p.id === cmi.id));
});

test("budget choices only select existing sourced annual amounts without synthetic thresholds",()=>{
 for(const category of categories){
  const choices=getBudgetChoices(category);assert.ok(choices.length<=4);assert.equal(new Set(choices.map(c=>c.amountTHB)).size,choices.length);
  for(const choice of choices){assert.ok(choice.references.length>0);for(const ref of choice.references){const plan=getPlan(ref.planId)!;assert.equal(plan.category,category);assert.equal(plan.price.period,"year");assert.equal(choice.amountTHB,plan.price.amountTHB);assert.deepEqual(ref.price,plan.price);assert.ok(ref.sources.every(source=>plan.price.sourceIds.includes(source.id)));}}
 }
 assert.deepEqual(getBudgetChoices("life").map(c=>c.amountTHB),[19940,22170,69000]);
 assert.match(getBudgetChoices("life").find(c=>c.amountTHB===69000)!.references[0].price.scenario!,/ชายอายุ 35.*100,000.*5 ปี/);
 assert.ok(getBudgetChoices("health").some(c=>c.amountTHB===27696.5));
});

test("budget anchors exclude unknown, trip, single-payment and missing-evidence prices",()=>{
 assert.deepEqual(getBudgetChoices(null),[]);assert.deepEqual(getBudgetChoices("liability"),[]);
 assert.deepEqual(getBudgetChoices("travel").map(c=>c.references[0].planId),["travel-02"]);
 const plan=getPlan("life-06")!;
 assert.deepEqual(getBudgetChoices("life",[{...plan,price:{...plan.price,period:"single"}}]),[]);
 assert.deepEqual(getBudgetChoices("life",[{...plan,price:{...plan.price,sourceIds:["missing"]}}]),[]);
 assert.deepEqual(getBudgetChoices("life",[{...plan,price:{...plan.price,kind:"quote_only",amountTHB:null}}]),[]);
 assert.deepEqual(getBudgetChoices("motor").flatMap(c=>c.references.map(r=>r.planId)).includes("motor-05"),false);
});
