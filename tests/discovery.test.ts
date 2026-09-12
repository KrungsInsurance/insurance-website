import test from "node:test";
import assert from "node:assert/strict";
import { getPlan, searchPlans } from "../lib/catalog.ts";

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
