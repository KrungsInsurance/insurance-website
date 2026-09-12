import test from "node:test";
import assert from "node:assert/strict";
import { arePlansCompatible, compareCells, parseCompareSelection, buildComparison, ComparisonError } from "../lib/compare.ts";
import { getPlan } from "../lib/catalog.ts";
import { formatPremium } from "../lib/display.ts";

test("expanded cross-company comparisons preserve sourced eligibility and unavailable quotes", () => {
 const home=buildComparison("property",["property-01","property-06"]);
 assert.deepEqual(home.rows.find(row=>row.key==="premiumTHB")?.values,[null,1009]);
 const eligibility=home.rows.find(row=>row.key==="eligibility")!;
 assert.deepEqual(eligibility.cells.map(cell=>cell.status),["unknown","known"]);
 assert.match(String(eligibility.values[1]),/500,000/);
 assert.ok(eligibility.cells[1].sourceIds[0].endsWith(":eligibility"));
 const liability=buildComparison("liability",["liability-06","liability-07"]);
 assert.equal(liability.rows.find(row=>row.key==="perOccurrenceLimit")?.comparisonStatus,"insufficient");
 assert.deepEqual(liability.rows.find(row=>row.key==="premiumTHB")?.values,[null,null]);
 assert.throws(()=>buildComparison("travel",["travel-06","travel-07"]),ComparisonError);
});

test("comparison preserves requested order and typed null values", () => {
  const result = buildComparison("health", ["health-01", "health-02"]);
  assert.deepEqual(result.planIds, ["health-01", "health-02"]);
  assert.deepEqual(result.rows.find((row) => row.key === "annualLimit")?.values, [2500000, null]);
  assert.deepEqual(result.rows.find((row) => row.key === "perDiseaseLimit")?.values, [null, 10000000]);
  assert.deepEqual(result.rows.find((row) => row.key === "waitingDays")?.values, [30, 30]);
  assert.equal(result.url, "/compare?category=health&ids=health-01,health-02");
});

test("comparison rejects duplicate, mixed, missing, and wrong counts", () => {
  for (const [ids, code] of [[["health-01"], "INVALID_INPUT"], [["health-01", "health-01"], "DUPLICATE_IDS"], [["health-01", "motor-01"], "MIXED_CATEGORY"], [["health-01", "missing"], "PLAN_NOT_FOUND"]] as const) {
    assert.throws(() => buildComparison("health", [...ids]), (error: unknown) => error instanceof ComparisonError && error.code === code);
  }
});

test("quote-only comparison preserves unknown prices and never calls null/null verified same", () => {
  const result = buildComparison("motor", ["motor-01", "motor-02"]);
  const price = result.rows.find(row => row.key === "premiumTHB")!;
  assert.deepEqual(price.values, [null, null]);
  assert.equal(price.comparisonStatus, "insufficient");
  assert.equal(buildComparison("health", ["health-01", "health-02"]).rows.find(row => row.key === "deductible")?.comparisonStatus, "insufficient");
  assert.equal(formatPremium(null, "year"), "ขอใบเสนอราคา");
  assert.equal(formatPremium(null, "year", "ขอราคาตามรถ"), "ขอราคาตามรถ");
  assert.equal(formatPremium(0, "year"), "0 บาท/ปี");
});

test("compulsory motor and travel directions cannot compare as equivalent products", () => {
  for (const [category, ids] of [["motor", ["motor-01", "motor-05"]], ["travel", ["travel-01", "travel-03"]], ["travel", ["travel-03", "travel-04"]], ["travel", ["travel-01", "travel-04"]]] as const) {
    assert.equal(arePlansCompatible(ids.map(id => getPlan(id)!)), false);
    assert.throws(() => buildComparison(category, [...ids]), (error: unknown) => error instanceof ComparisonError && error.code === "INCOMPATIBLE_PLANS");
  }
  assert.equal(arePlansCompatible([getPlan("health-01")!, getPlan("health-02")!]), true);
  assert.equal(buildComparison("travel", ["travel-01", "travel-02"]).rows.find(row => row.key === "premiumTHB")?.comparisonStatus, "not_comparable");
});



test("cell statuses preserve verified exclusion, unknown and comparison basis", () => {
  const cell = getPlan("health-01")!.coverageCells.annualLimit;
  const absent = { ...cell, status: "not_covered" as const, value: null };
  assert.equal(compareCells([cell, absent]), "different");
  assert.equal(compareCells([cell, { ...absent, status: "not_applicable" }]), "not_comparable");
  assert.equal(compareCells([cell, { ...cell, basis: "per_disease" }]), "not_comparable");
  assert.equal(compareCells([cell, { ...cell, inclusion: "optional" }]), "not_comparable");
  assert.equal(compareCells([cell, { ...cell, sourceIds: [] }]), "insufficient");
  assert.equal(compareCells([absent, absent]), "same");
  assert.equal(compareCells([cell, cell]), "same");
});

test("price comparison rejects different customer scenarios and unselected starting tiers", () => {
  for (const ids of [["health-01", "health-03"], ["health-01", "health-02"], ["travel-01", "travel-05"]]) {
    const category = getPlan(ids[0])!.category;
    assert.equal(buildComparison(category, ids).rows.find(r => r.key === "premiumTHB")?.comparisonStatus, "not_comparable");
  }
  assert.equal(buildComparison("health", ["health-03", "health-04"]).rows.find(r => r.key === "premiumTHB")?.comparisonStatus, "not_comparable");
  assert.equal(buildComparison("travel", ["travel-01", "travel-02"]).rows.find(r => r.key === "maxTripDays")?.comparisonStatus, "insufficient");
});



test("Compare explicit URL selection accepts zero to three independently from history", () => {
  for (const ids of [[], ["health-01"], ["health-01", "health-02"], ["health-01", "health-02", "health-03"]]) assert.deepEqual(parseCompareSelection("health", ids.join(",")), ids);
  for (const raw of ["missing", "health-01,", ",", "health-01,,health-02", "health-01,health-01", "health-01,health-02,health-03,health-04", "motor-01"]) assert.equal(parseCompareSelection("health", raw), null);
  assert.equal(parseCompareSelection("wrong", ""), null);
  assert.equal(parseCompareSelection("motor", "motor-01,motor-05"), null);
  assert.equal(parseCompareSelection("travel", "travel-01,travel-03"), null);
  assert.deepEqual(parseCompareSelection("travel", "travel-03"), ["travel-03"]);
});
