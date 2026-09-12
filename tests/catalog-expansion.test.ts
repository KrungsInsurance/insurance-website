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
  assert.equal(catalog.length, 82);
  assert.equal(new Set(catalog.map(item => item.productId)).size, 78);
  assert.equal(catalogExpansionRecords.length, 42);
  assert.equal(new Set(expanded.map(item => item.productId)).size, 42);
  assert.deepEqual(validateCatalog(), []);
  for (const category of categories) assert.ok(catalog.some(item => item.category === category));
  assert.equal(catalog.filter(item => item.category === "property").length, 12);
});

test("product overviews keep unknown prices and limits without turning advertised options into selected benefits", () => {
  for (const item of expanded) {
    assert.equal(item.tierLabel, null);
    assert.equal(item.price.kind, "quote_only");
    assert.equal(item.price.amountTHB, null);
    assert.ok(item.sources.every(source => source.checkedAt === "2026-09-12" && new URL(source.url).protocol === "https:"));
    for (const cell of Object.values(item.coverageCells)) {
      assert.equal(cell.inclusion, "unknown");
      if (cell.status === "unknown") { assert.equal(cell.value, null); assert.deepEqual(cell.sourceIds, []); }
      else { assert.equal(typeof cell.value, "string"); assert.ok(cell.sourceIds.length > 0); }
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
  assert.deepEqual(result.map(item => item.id), ["event-01"]);
  assert.equal(result[0].coverageCells.weddingEligibility.status, "unknown");
  assert.equal(result[0].coverageCells.weddingEligibility.value, null);
  assert.match(result[0].exclusions.join(" "), /ต้องสอบถาม/);
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
