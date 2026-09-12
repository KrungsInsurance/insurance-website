import test from "node:test";
import assert from "node:assert/strict";
import { catalog, getPlan, searchPlans } from "../lib/catalog.ts";
import { catalogExpansionRecords } from "../lib/catalog-expansion.ts";
import { arePlansCompatible, buildComparison } from "../lib/compare.ts";
import { refineBrowsePlans, browseRefinements } from "../lib/browse-refinement.ts";
import { selectPersonaPlans } from "../lib/discovery-persona.ts";
import { planImages } from "../lib/plan-images.ts";
import { categories, type Plan } from "../lib/types.ts";
import { validateCatalog } from "../lib/validators.ts";

const expanded = catalogExpansionRecords.map(record => getPlan(record.id)!);
const plan = (id: string): Plan => { const result = getPlan(id); assert.ok(result); return result; };

test("catalog expansion adds distinct sourced products across thirteen categories", () => {
  assert.equal(categories.length, 13);
  assert.equal(catalog.length, 83);
  assert.equal(new Set(catalog.map(item => item.productId)).size, 79);
  assert.equal(catalogExpansionRecords.length, 43);
  assert.equal(new Set(expanded.map(item => item.productId)).size, 43);
  assert.deepEqual(validateCatalog(), []);
  for (const category of categories) assert.ok(catalog.some(item => item.category === category));
  assert.equal(catalog.filter(item => item.category === "property").length, 12);
});

test("product overviews keep unknown prices and limits without turning advertised options into selected benefits", () => {
  for (const item of expanded) {
    assert.equal(item.tierLabel, null);
    if (item.id === "sports-01") { assert.equal(item.price.kind, "starting"); assert.equal(item.price.amountTHB, 913.78); }
    else { assert.equal(item.price.kind, "quote_only"); assert.equal(item.price.amountTHB, null); }
    assert.ok(item.sources.every(source => source.checkedAt === "2026-09-12" && new URL(source.url).protocol === "https:"));
    for (const cell of Object.values(item.coverageCells)) {
      if (!cell.sourceIds.some(id => id.includes(":audit-"))) assert.equal(cell.inclusion, "unknown");
      if (cell.status === "unknown") {
        assert.equal(cell.value, null);
        if (cell.sourceIds.length) {
          assert.ok(cell.conditions.length, "Sourced unknowns must explain the unselected or unresolved field");
          assert.ok(cell.sourceIds.every(id => item.sources.some(source => source.id === id)));
        }
      }
      else { assert.ok(cell.sourceIds.length > 0); if (cell.status === "known") { assert.notEqual(cell.value, null); if (typeof cell.value === "number") assert.ok(cell.unit && cell.basis); } else assert.equal(cell.value, null); }
    }
    assert.equal(planImages[item.id].kind, "illustration");
    assert.equal(planImages[item.id].sourceUrl, item.source.url);
  }
  assert.match(plan("pet-01").exclusions.join(" "), /แผน 1 ไม่คุ้มครองการเจ็บป่วย.*วัคซีนมีเฉพาะแผน 4–6/);
  assert.equal(plan("pet-01").coverageCells.benefitLimit.status, "unknown");
  assert.match(plan("property-16").exclusions.join(" "), /599 บาท\/ปี.*ใบเสนอราคา/);
});

test("wedding discovery exposes current event cover for enquiry without inventing wedding acceptance", () => {
  const result = searchPlans({ category: "event", q: "งานแต่ง" });
  assert.deepEqual(result.map(item => item.id), ["event-01", "event-02"]);
  assert.equal(plan("event-01").coverageCells.weddingEligibility.status, "unknown");
  assert.equal(plan("event-01").coverageCells.weddingEligibility.value, null);
  assert.match(plan("event-01").exclusions.join(" "), /ต้องสอบถาม/);
  assert.equal(plan("event-02").coverageCells.weddingEligibility.status, "known");
  assert.match(String(plan("event-02").coverageCells.weddingEligibility.value), /งานแต่งงาน/);
  assert.ok(!browseRefinements.event.fields.some(field => /health|medical|disease/.test(field.key)));
  assert.deepEqual(refineBrowsePlans(result, "event", "wedding"), result);
});

test("business and critical illness comparisons preserve the purpose of each product", () => {
  assert.equal(arePlansCompatible([plan("business-01"), plan("business-06")]), false);
  assert.throws(() => buildComparison("business", ["business-01", "business-06"]), /กลุ่มเดียวกัน/);
  assert.equal(arePlansCompatible([plan("business-06"), plan("business-13")]), true);
  assert.equal(arePlansCompatible([plan("critical-illness-01"), plan("critical-illness-06")]), false);
  assert.equal(arePlansCompatible([plan("sports-01"), plan("sports-02"), plan("sports-03")]), true);
  assert.deepEqual(refineBrowsePlans(catalog, "business", "construction").map(item => item.id), ["business-01"]);
  assert.equal(refineBrowsePlans(catalog, "critical-illness", "cancer").length, 4);
  const context = { nickname: "พลอย", ageBand: "31-45" as const, journey: "compare" as const };
  const construction = selectPersonaPlans({ ...context, category: "business", priorities: ["construction"] });
  assert.deepEqual(construction.map(item => item.id), ["business-01"]);
  const illness = selectPersonaPlans({ ...context, category: "critical-illness", priorities: ["multi-disease"] });
  assert.equal(illness.length, 3);
  assert.ok(illness.every(item => item.comparisonGroup === "critical-illness:multi-disease"));
});


test("verified enrichment keeps exact clauses, optional scope and conflicting publisher wording", () => {
  assert.equal(plan("critical-illness-01").coverageCells.waitingPeriod.value, 90);
  assert.equal(plan("critical-illness-01").coverageCells.waitingPeriod.unit, "วัน");
  for (const id of ["pet-02", "pet-03"]) {
    assert.equal(plan(id).coverageCells.waitingPeriod.status, "conflicting");
    assert.equal(plan(id).coverageCells.waitingPeriod.value, null);
  }
  assert.equal(plan("property-08").coverageCells.deductible.status, "unknown");
  assert.equal(plan("property-09").coverageCells.deductible.basis, "per_water_damage_occurrence");
  assert.equal(plan("cyber-01").coverageCells.responseCosts.inclusion, "unknown");
  assert.equal(plan("sports-01").coverageCells.golfEquipmentPerOccurrence.value, 20000);
  assert.equal(plan("sports-01").coverageCells.golfEquipmentAggregate.value, 20000);
  assert.notEqual(plan("sports-01").coverageCells.golfEquipmentPerOccurrence.basis, plan("sports-01").coverageCells.golfEquipmentAggregate.basis);
  assert.equal(plan("sports-02").coverageCells.golfEquipmentAggregate.status, "unknown");
  assert.equal(plan("business-04").premiumPeriod, "year");
  assert.equal(plan("business-04").price.period, "year");
  assert.match(plan("business-01").name, /FIT OUT LITE/);
  assert.equal(plan("critical-illness-08").coverageCells.waitingPeriod.value, 90);
  assert.equal(plan("critical-illness-08").coverageCells.waitingPeriod.basis, "waiting_period");
  assert.match(plan("critical-illness-08").coverageCells.waitingPeriod.conditions.join(" "), /ส่วนเพิ่ม/);
  assert.equal(plan("property-11").coverageCells.floodLimit.value, 20000);
  assert.equal(plan("property-14").coverageCells.sharedNaturalPerilsLimit.basis, "per_policy_year");
  assert.equal(plan("property-14").coverageCells.floodLimit.status, "unknown");
  assert.equal(plan("health-01").coverageCells.deductible.status, "unknown");
  assert.equal(plan("health-01").coverageCells.deductible.value, null);
  assert.match(plan("health-01").coverageCells.deductible.conditions.join(" "), /20,000/);
  assert.equal(plan("health-07").coverageCells.opdVisitsPerDay.inclusion, "optional");
  assert.equal(plan("health-07").coverageCells.opdVisitsPerDay.value, 1);
  assert.equal(plan("health-08").coverageCells.waitingDays.value, 30);
  assert.match(plan("health-08").coverageCells.waitingDays.conditions.join(" "), /มะเร็งระยะลุกลาม.*90 วัน/);
  assert.match(plan("accident-03").sources.find(source => source.id === "accident-03:occupationClass")!.url, /pa-cashback$/);
});

test("documented choices and unestablished limits remain unresolved in comparisons", () => {
  for (const [id, field] of [["health-01", "deductible"], ["health-02", "deductible"], ["health-08", "deductible"], ["motor-01", "repairType"], ["motor-03", "repairType"], ["health-04", "roomBasis"], ["health-05", "roomBasis"], ["travel-06", "maxTripDays"], ["life-01", "guaranteedCashback"]]) {
    const cell = plan(id).coverageCells[field];
    assert.equal(cell.status, "unknown", `${id}:${field}`);
    assert.equal(cell.value, null);
    assert.ok(cell.sourceIds.length && cell.conditions.length);
  }
  const comparison = buildComparison("health", ["health-01", "health-02", "health-08"]);
  assert.equal(comparison.rows.find(row => row.key === "deductible")?.status, "insufficient");
  assert.doesNotMatch(plan("health-08").highlights.join(" "), /ไม่มีส่วนแรก/);
});
