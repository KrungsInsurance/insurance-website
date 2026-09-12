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

import { compactCoverage, compactPrice, compareInterests, planInterestReasons } from "../lib/compare-personalization.ts";
import { emptyCustomerFacts } from "../lib/customer-extraction.ts";
import type { DiscoveryPersona } from "../lib/discovery-persona.ts";
const comparePersona:DiscoveryPersona={nickname:"ทดสอบ",ageBand:"21-30",category:"health",priorities:["room","opd"],journey:"compare",budgetBand:"under-10000"};

test("compact comparison keeps numeric basis, optional cover and unknown distinct",()=>{
 const base=getPlan("health-01")!.coverageCells.annualLimit;
 assert.match(compactCoverage(base),/2,500,000 บาท\/ปี/);
 assert.match(compactCoverage({...base,inclusion:"optional"}),/^ซื้อเพิ่ม/);
 assert.equal(compactCoverage({...base,status:"unknown",value:null}),"รอยืนยัน");
 assert.equal(compactCoverage({...base,status:"not_covered",value:null}),"ไม่คุ้มครอง");
 assert.match(compactCoverage({...base,basis:"per_disease"}),/\/โรค/);
 assert.equal(compactPrice(getPlan("property-01")!.price),"ขอใบเสนอราคา");
});

test("personalized reasons use selected interests, never budget affordability or unknown cover as fit",()=>{
 const interests=compareInterests("health",comparePersona,undefined,[]);
 assert.deepEqual(interests.map(item=>item.id),["room","opd"]);
 assert.ok(interests.every(item=>item.quote===null));
 const plan=getPlan("health-01")!;
 const modified={...plan,coverageCells:{...plan.coverageCells,opdPerYear:{...plan.coverageCells.opdPerYear,status:"unknown" as const,value:null},opdPerVisit:{...plan.coverageCells.opdPerVisit,status:"unknown" as const,value:null}}};
 const reasons=planInterestReasons(modified,interests);
 assert.equal(reasons.find(reason=>reason.interest.id==="opd")?.kind,"check");
 assert.doesNotMatch(JSON.stringify(reasons),/จ่ายไหว|อยู่ในงบ|10000|เหมาะที่สุด/);
 assert.deepEqual(compareInterests("motor",comparePersona,undefined,[]),[]);
});

test("chat personalization requires supported positive need, excludes questions and latest withdrawal",()=>{
 const customer={...emptyCustomerFacts(),category:"health" as const,needs:[{text:"OPD",quote:"อยากได้ OPD"}]};
 assert.equal(compareInterests("health",undefined,customer,[]).length,0);
 const messages=[{role:"user",content:"อยากได้ OPD"}];
 assert.equal(compareInterests("health",undefined,customer,messages)[0]?.quote,"อยากได้ OPD");
 assert.equal(compareInterests("health",undefined,customer,[...messages,{role:"user",content:"ตอนนี้ไม่ต้องการ OPD แล้ว"}]).length,0);
 assert.equal(compareInterests("health",{...comparePersona,priorities:["opd"]},customer,[...messages,{role:"user",content:"ไม่สนใจ OPD"}]).length,0);
 const onlyQuestion={...emptyCustomerFacts(),category:"health" as const,questions:[{text:"OPD",quote:"OPD คืออะไร"}]};
 assert.equal(compareInterests("health",undefined,onlyQuestion,[{role:"user",content:"OPD คืออะไร"}]).length,0);
});

test("optional and unverified inclusion remain checks rather than fit reasons",()=>{
 const plan=getPlan("health-01")!;
 const interests=compareInterests("health",{...comparePersona,priorities:["room"]},undefined,[]);
 for(const inclusion of ["optional","unknown"] as const){
  const modified={...plan,coverageCells:{...plan.coverageCells,roomPerDay:{...plan.coverageCells.roomPerDay,inclusion},roomBasis:{...plan.coverageCells.roomBasis,inclusion}}};
  const reason=planInterestReasons(modified,interests)[0];
  assert.equal(reason.kind,"check");
  assert.match(reason.summary,inclusion==="optional"?/ซื้อเพิ่ม/:/รอยืนยันสิทธิ/);
 }
});

test("outpatient requests never produce an inpatient personalization reason",()=>{
 for(const quote of ["อยากพบแพทย์แบบไม่นอนโรงพยาบาล","ต้องการค่ารักษาผู้ป่วยนอก"]){
  const customer={...emptyCustomerFacts(),category:"health" as const,needs:[{text:quote,quote}]};
  const interests=compareInterests("health",undefined,customer,[{role:"user",content:quote}]);
  assert.deepEqual(interests.map(item=>item.id),["opd"]);
 }
});

import { compareBudget } from "../lib/compare-personalization.ts";
test("comparison budget preserves a stated annual range without treating it as an exact amount",()=>{
 const quote="เงินที่อยากใช้กับประกันต่อปี: 10,000–19,999 บาท (ช่วงงบประมาณ)";
 const customer={...emptyCustomerFacts(),category:"health" as const,budget:{quote,amountTHB:null,period:"year" as const}};
 assert.deepEqual(compareBudget("health",comparePersona,customer,[{role:"user",content:quote}]),{label:"10,000–19,999 บาท/ปี",quote});
 const changed="ตอนนี้ยังไม่กำหนดงบแล้ว";
 assert.equal(compareBudget("health",comparePersona,{...customer,budget:{...customer.budget,quote:changed}},[{role:"user",content:quote},{role:"user",content:changed}])?.label,"ยังไม่กำหนดงบ");
 assert.equal(compareBudget("motor",comparePersona,customer,[{role:"user",content:quote}]),undefined);
});

test("compact prices keep starting and example qualifiers outside their disclosure",()=>{
 const price=getPlan("health-01")!.price;
 assert.match(compactPrice({...price,kind:"starting",scenario:"รายละเอียดสมมติยาว",includes:"ข้อมูลประกอบ"}),/^เริ่มต้น /);
 assert.match(compactPrice({...price,kind:"example"}),/^ตัวอย่าง /);
 assert.doesNotMatch(compactPrice({...price,scenario:"รายละเอียดสมมติยาว"}),/รายละเอียดสมมติ/);
});


test("comparison separates product descriptions from unselected benefit entitlements", () => {
  const pet = buildComparison("pet", ["pet-02", "pet-03"]);
  assert.equal(pet.rows.find(row => row.key === "petType")?.status, "same");
  assert.equal(pet.rows.find(row => row.key === "treatmentScope")?.status, "insufficient");
  assert.equal(pet.rows.find(row => row.key === "waitingPeriod")?.status, "insufficient");
  assert.equal(buildComparison("health", ["health-01", "health-02"]).rows.find(row => row.key === "premiumTHB")?.status, "not_comparable");
});

test("numbers without a unit cannot become a verified match", () => {
  const cell = { ...getPlan("health-01")!.coverageCells.roomPerDay, unit: null };
  assert.equal(compareCells([cell, cell]), "insufficient");
  const withUnit = { ...cell, unit: "บาท" };
  assert.equal(compareCells([withUnit, withUnit]), "same");
  assert.equal(compareCells([withUnit, { ...withUnit, conditions: ["shared cap"] }]), "different");
});


import { selectComparisonRows, comparisonDifferenceNote } from "../lib/compare.ts";
test("difference mode separates unresolved rows without calling unknowns equal", () => {
  const comparison = buildComparison("motor", ["motor-01", "motor-02"]);
  const filtered = selectComparisonRows(comparison.rows, true);
  assert.equal(filtered.visible.length, 2);
  assert.equal(filtered.sameCount, 2);
  assert.equal(filtered.pending.length, 12);
  assert.ok(filtered.visible.some(item => item.key === "thirdPartyBodilyPerEvent"));
  assert.ok(filtered.pending.some(item => item.key === "premiumTHB" && item.comparisonStatus === "insufficient"));
  assert.deepEqual(selectComparisonRows(comparison.rows, false).visible, comparison.rows);
  assert.equal(filtered.visible.length + filtered.pending.length + filtered.sameCount, comparison.rows.length);
});

test("difference mode preserves two confirmed values when the third plan is unknown", () => {
  const comparison = buildComparison("health", ["health-01", "health-02", "health-03"]);
  const filtered = selectComparisonRows(comparison.rows, true);
  const room = filtered.visible.find(item => item.key === "roomPerDay")!;
  assert.deepEqual(room.values, [2500, 12000, null]);
  assert.equal(room.comparisonStatus, "insufficient");
  assert.equal(comparisonDifferenceNote(room), "บางแผนรอยืนยัน");
  assert.ok(filtered.pending.some(item => item.key === "deductible"));
  assert.equal(comparisonDifferenceNote(filtered.visible.find(item => item.key === "waitingDays")!), "เงื่อนไขต่างกัน");
  assert.equal(comparisonDifferenceNote(filtered.visible.find(item => item.key === "premiumTHB")!), "ฐานต่างกัน");
});

test("an unresolved-only comparison shows no invented difference or equality", () => {
  const pending = buildComparison("motor", ["motor-01", "motor-02"]).rows.filter(item => item.key === "premiumTHB");
  const filtered = selectComparisonRows(pending, true);
  assert.deepEqual(filtered.visible, []);
  assert.equal(filtered.sameCount, 0);
  assert.deepEqual(filtered.pending, pending);
});
