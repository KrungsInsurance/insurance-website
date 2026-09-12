import test from "node:test";
import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { planImages } from "../lib/plan-images.ts";
import { categoryFields, catalog, getPlan, searchPlans } from "../lib/catalog.ts";
import { policies } from "../lib/demo-seed.ts";
import { assertValidCatalog, validatePolicies } from "../lib/validators.ts";

test("every canonical plan uses a locally available, source-labelled official image", () => {
  for (const plan of catalog) {
    const asset = planImages[plan.id];
    assert.ok(asset, `missing image evidence: ${plan.id}`);
    assert.equal(plan.image, asset.src);
    assert.match(asset.src, /^\/images\/[a-zA-Z0-9/_.-]+$/);
    assert.ok(statSync(new URL(`../public${asset.src}`, import.meta.url)).size > 0);
    assert.equal(new URL(asset.sourceUrl).protocol, "https:");
    assert.ok(asset.alt && ["product", "insurer"].includes(asset.kind));
  }
});

test("researched benefits keep shared property, voluntary medical and admission lump sums separate", () => {
 const home=getPlan("property-06")!;
 assert.deepEqual([home.coverage.combinedPropertyLimit,home.coverage.buildingLimit,home.coverage.contentsLimit],[500000,null,null]);
 assert.equal(home.coverage.floodLimit,20000);
 assert.match(home.coverageCells.floodLimit.conditions.join(" "),/7/);
 assert.equal(getPlan("motor-06")?.coverage.voluntaryMedicalPerPerson,200000);
 assert.equal(getPlan("motor-07")?.coverage.voluntaryMedicalPerPerson,50000);
 assert.equal(getPlan("motor-05")?.coverage.medicalPerPerson,80000);
 const holiday=getPlan("accident-06")!;
 assert.equal(holiday.coverage.hospitalAdmissionBenefit,20000);
 assert.match(holiday.coverageCells.hospitalAdmissionBenefit.conditions.join(" "),/14/);
 assert.equal(holiday.coverage.dailyAllowance,null);
});

test("catalog adds sourced identities without reusing retired fabricated variants", () => {
  assertValidCatalog(catalog);
  const ids = new Set(catalog.map((plan) => plan.id));
  assert.equal(ids.size, catalog.length);
  assert.deepEqual(searchPlans({ category: "property" }).map(p => p.id).sort(), ["property-01", "property-06"]);
  assert.deepEqual(searchPlans({ category: "liability" }).map(p => p.id), ["liability-06", "liability-07"]);
  for (const id of ["property-02", "property-03", "property-04", "property-05", "liability-01", "liability-02", "liability-03", "liability-04", "liability-05"]) assert.equal(getPlan(id), undefined);
  assert.ok(catalog.every((plan) => plan.source.kind === "official" && plan.source.url));
  for (const [category, fields] of Object.entries(categoryFields)) {
    const plans = catalog.filter((plan) => plan.category === category);
    assert.ok(plans.every((plan) => Object.keys(plan.coverage).length === fields.length));
  }
});

test("PA All In One uses one verified S tier and property does not misstate chosen limits", () => {
  // https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table, checked 2026-09-12.
  const pa = getPlan("accident-04")!;
  assert.equal(pa.name, "PA All In One แผน S");
  assert.equal(pa.premiumTHB, 3855);
  assert.deepEqual([pa.coverage.deathBenefit, pa.coverage.medicalPerAccident, pa.coverage.disabilityBenefit], [300000, 45000, 300000]);
  assert.match(pa.premiumNote!, /ชายอายุ 35 ปี/);
  assert.ok(pa.coverageCells.deathBenefit.conditions.some(text => text.includes("150,000")));
  // AXA home-plan table: optional sums; natural perils share 20,000, liability is bundled.
  const home = getPlan("property-01")!;
  assert.equal(home.premiumTHB, null);
  assert.equal(home.coverage.buildingLimit, null);
  assert.equal(home.coverage.contentsLimit, null);
  assert.equal(home.coverage.sharedNaturalPerilsLimit, 20000);
  assert.equal(home.coverageCells.sharedNaturalPerilsLimit.basis, "shared_cap");
});

test("health official starting prices and inclusive budget search are deterministic", () => {
  const plans = searchPlans({ category: "health", maxPremium: 20000, sort: "price-asc" });
  assert.deepEqual(plans.map((plan) => plan.id), ["health-01", "health-02"]);
  assert.deepEqual(plans.map((plan) => plan.premiumTHB), [6700, 15680]);
  assert.partialDeepStrictEqual(plans[0]?.coverage, { annualLimit: 2500000, perDiseaseLimit: null, perAdmissionLimit: 500000, roomPerDay: 2500, opdPerYear: null, deductible: null, waitingDays: 30 });
  assert.partialDeepStrictEqual(plans[1]?.coverage, { annualLimit: null, perDiseaseLimit: 10000000, perAdmissionLimit: null, roomPerDay: 12000, opdPerYear: 50000, deductible: null, waitingDays: 30 });
  assert.equal(searchPlans({ category: "health", maxPremium: 0 }).length, 0);
});

test("policy seed has four known plans and valid date order", () => {
  assert.equal(policies.length, 4);
  assert.deepEqual(validatePolicies(policies), []);
  assert.equal(policies.find((policy) => policy.planId === "motor-01")?.renewsOn, "2026-09-20");
  assert.equal(policies.find((policy) => policy.planId === "health-02")?.renewsOn, "2027-03-01");
  assert.equal(policies.find((policy) => policy.planId === "life-01")?.renewsOn, "2027-09-10");
  assert.equal(policies.find((policy) => policy.planId === "accident-01")?.renewsOn, "2026-09-01");
});

test("unknown deductible and entry age are not zero; age-99 coverage is not a 99-year term", () => {
  for (const id of ["health-01", "health-02", "motor-01"]) assert.equal(getPlan(id)?.coverage.deductible, null);
  for (const id of ["life-01", "life-02"]) {
    assert.equal(getPlan(id)?.coverage.coverageUntilAge, 99);
    assert.equal(getPlan(id)?.coverage.coverageYears, null);
  }
  assert.equal(getPlan("life-03")?.coverage.coverageYears, 10);
  assert.equal(getPlan("life-03")?.coverage.coverageUntilAge, null);
  assert.equal(getPlan("life-05"), undefined);
  assert.equal(getPlan("life-01")?.coverageCells.minEntryAge.unit, "วัน");
  assert.equal(getPlan("motor-02")?.coverage.deductible, 0);
});



test("canonical facts retain locators, optional benefits, conflicts and units", () => {
  for (const p of catalog) {
    for (const cell of Object.values(p.coverageCells)) {
      if (cell.status !== "known") continue;
      assert.ok(cell.basis);
      assert.ok(cell.sourceIds.length);
      assert.ok(cell.sourceIds.every(id => p.sources.some(s => s.id === id && s.locator && s.url.startsWith("https://"))));
    }
  }
  assert.equal(getPlan("accident-05")?.coverageCells.maxEntryAge.status, "conflicting");
  assert.equal(getPlan("accident-01")?.coverageCells.medicalPerAccident.status, "not_covered");
  assert.equal(getPlan("health-02")?.coverageCells.opdPerYear.inclusion, "optional");
  assert.equal(getPlan("motor-05")?.coverageCells.medicalPerPerson.value, 80000);
  assert.equal(getPlan("motor-05")?.coverageCells.repairType.status, "not_applicable");
  assert.equal(getPlan("travel-03")?.coverageCells.medicalLimit.basis, "per_trip");
  assert.equal(getPlan("life-01")?.price.scenario?.includes("หญิง"), true);
  assert.equal(getPlan("life-01")?.coverageCells.minEntryAge.value, 30);
  assert.equal(getPlan("life-01")?.coverageCells.minEntryAge.unit, "วัน");
  assert.equal(getPlan("travel-01")?.productId, getPlan("travel-05")?.productId);
});

test("annual travel duration is unresolved until its tier is selected", () => {
  const annual = getPlan("travel-02")!;
  assert.equal(annual.coverage.maxTripDays, null);
  assert.equal(annual.coverageCells.maxTripDays.status, "unknown");
  assert.match(annual.coverageCells.maxTripDays.conditions.join(" "), /90.*180/);
  assert.ok(annual.coverageCells.maxTripDays.sourceIds.length);
  assert.equal(getPlan("travel-01")?.coverage.maxTripDays, 180);
});

test("EV zero ordinary deductible retains unlisted-driver excess conditions", () => {
  const ev = getPlan("motor-02")!;
  const cell = ev.coverageCells.deductible;
  assert.equal(cell.value, 0);
  assert.match(cell.conditions.join(" "), /6,000/);
  assert.match(cell.conditions.join(" "), /1 มิถุนายน 2567/);
  assert.match(cell.conditions.join(" "), /1–5 คน/);
  assert.match(cell.conditions.join(" "), /ไม่อยู่ในรายชื่อ/);
  assert.ok(cell.sourceIds.some(id => ev.sources.some(s => s.id === id && s.locator.includes("ประกาศนโยบาย EV"))));
});

test("MTL health tiers retain readmission, OPD visit and disease-specific waiting limits", () => {
  for (const [i, tier] of ["s", "m", "l"].entries()) {
    const plan = getPlan(`health-0${i+3}`)!;
    const {perAdmissionLimit,opdPerYear,waitingDays} = plan.coverageCells;
    assert.match(perAdmissionLimit.conditions.join(" "), /90 วัน.*วงเงินเดิม/);
    assert.match(opdPerYear.conditions.join(" "), /2 ครั้งต่อวัน/);
    assert.equal(waitingDays.value, 30);
    assert.match(waitingDays.conditions.join(" "), /120 วัน/);
    assert.match(waitingDays.conditions.join(" "), /เฉพาะ OPD: รอ 180 วัน/);
    for (const cell of [perAdmissionLimit,opdPerYear,waitingDays]) assert.ok(cell.sourceIds.every(id => plan.sources.some(s => s.id === id && s.url.endsWith(`ipd-opd-sukjai-${tier}`))));
    assert.ok(plan.price.sourceIds.every(id => plan.sources.some(s => s.id === id && s.url.includes("category/health"))));
  }
});

test("cashback needs a qualifying three-year block; life15/3 annual example has exact source", () => {
  const pa = getPlan("accident-03")!;
  assert.match(pa.highlights.join(" "), /3 ปีติดต่อกันและไม่เคยได้รับผลประโยชน์/);
  assert.match(pa.highlights.join(" "), /เบี้ยรายปีของปีสุดท้าย/);
  assert.ok(pa.sources.some(s => s.locator.includes("เชิงอรรถ (1)")));
  const life = getPlan("life-04")!;
  assert.equal(life.price.kind, "example");
  assert.equal(life.price.amountTHB, 19940);
  assert.equal(life.price.period, "year");
  assert.match(life.price.scenario!, /ชายอายุ 35 ปี/);
  assert.ok(life.price.sourceIds.every(id => life.sources.some(s => s.id === id && s.url.endsWith("global-index-15-3/plan-table") && s.locator.includes("ต่อปี"))));
});


test("life formulas preserve benefit basis and do not conflate premium with sum assured", () => {
  const life = [1,2,3,4].map(i => getPlan(`life-0${i}`)!);
  assert.match(String(life[0].coverage.deathFormula), /100%.*เบี้ยสะสม/);
  assert.ok(!String(life[0].coverage.deathFormula).includes("101%"));
  assert.match(String(life[1].coverage.deathFormula), /101% ของเบี้ย/);
  assert.match(String(life[2].coverage.deathFormula), /105% ของทุน/);
  assert.match(String(life[2].coverage.guaranteedCashback), /1–9/);
  assert.match(String(life[3].coverage.deathFormula), /ปีที่ 1: 100% ปีที่ 2: 200% ปีที่ 3–15: 300%/);
  assert.match(String(life[3].coverage.maturityFormula), /310%.*101%/);
  assert.equal(life[2].coverageCells.nonGuaranteedBenefit.basis, "non_guaranteed_dividend");
  for (const p of life) for (const key of ["deathFormula","maturityFormula","paymentFrequency"]) assert.ok(p.coverageCells[key].sourceIds.every(id => p.sources.some(s => s.id === id && s.locator)));
});

test("new health PA and property core fields keep source-specific limits", () => {
  assert.equal(getPlan("health-01")?.coverage.icuPerDay, 5000);
  assert.equal(getPlan("health-02")?.coverage.icuPerDay, 24000);
  assert.equal(getPlan("health-02")?.coverageCells.minEntryAge.unit, "วัน");
  for (const id of ["health-01","health-02","health-03","health-04","health-05"]) assert.equal(getPlan(id)?.coverageCells.copay.status, "unknown");
  assert.equal(getPlan("health-03")?.coverage.icuMaxDays, 60);
  assert.equal(getPlan("health-03")?.coverage.roomMaxDays, 180);
  assert.equal(getPlan("health-03")?.coverage.opdVisitsPerDay, 2);
  assert.equal(getPlan("accident-02")?.coverage.publicAccidentBenefit, 500000);
  assert.equal(getPlan("accident-04")?.coverage.dailyAllowance, 500);
  assert.equal(getPlan("accident-04")?.coverage.dailyMaxDays, 365);
  assert.match(getPlan("accident-04")!.coverageCells.dailyAllowance.conditions.join(" "), /45 วัน/);
  assert.equal(getPlan("accident-05")?.coverageCells.dailyAllowance.status,"unknown");
  const home=getPlan("property-01")!;
  assert.match(String(home.coverage.bundledLiability), /10%.*500,000/);
  assert.match(home.coverageCells.occupancy.conditions.join(" "), /รายวันหรือรายสัปดาห์/);
  assert.match(String(home.coverage.valuation), /First Loss/);
});

test("motor core risks distinguish selected cover from optional cover and CMI", () => {
  assert.equal(getPlan("motor-01")?.coverage.thirdPartyBodilyPerPerson, null);
  assert.equal(getPlan("motor-01")?.coverage.thirdPartyBodilyPerEvent, 20000000);
  assert.equal(getPlan("motor-02")?.coverage.thirdPartyBodilyPerPerson, 1000000);
  assert.equal(getPlan("motor-04")?.coverageCells.theftLimit.status, "not_covered");
  assert.equal(getPlan("motor-03")?.coverageCells.floodLimit.inclusion, "optional");
  assert.equal(getPlan("motor-03")?.coverage.floodLimit, null);
  assert.equal(getPlan("motor-05")?.coverageCells.thirdPartyBodilyPerPerson.status, "not_applicable");
  assert.equal(getPlan("motor-05")?.coverageCells.collisionLimit.status, "not_covered");
});

test("travel core fields preserve domestic payouts, annual duration and unselected tiers", () => {
  const domestic = getPlan("travel-03")!;
  assert.equal(domestic.coverage.evacuationLimit, 1000000);
  assert.equal(domestic.coverage.repatriationLimit, 1000000);
  assert.equal(domestic.coverage.interruptionLimit, 20000);
  assert.equal(domestic.coverage.delayHours, 4);
  assert.equal(domestic.coverage.delayPayment, 1000);
  assert.equal(domestic.coverage.delayLimit, 10000);
  assert.equal(domestic.coverage.policyDuration, null);
  assert.equal(getPlan("travel-02")?.coverage.policyDuration, 1);
  assert.equal(getPlan("travel-02")?.coverageCells.policyDuration.unit, "ปี");
  for (const id of ["travel-01","travel-02","travel-05"]) {
    const p=getPlan(id)!;
    assert.equal(p.coverage.delayPayment, null);
    assert.equal(p.coverageCells.delayPayment.inclusion,"optional");
    assert.equal(p.coverage.evacuationLimit,null);
    assert.equal(p.coverageCells.evacuationLimit.inclusion,"included");
  }
  assert.equal(getPlan("travel-04")?.coverageCells.delayPayment.status,"unknown");
});

test("AXA health limits retain their distinct ninety-day aggregation definitions", () => {
  const value=getPlan("health-01")!, essential=getPlan("health-02")!;
  const admission=value.coverageCells.perAdmissionLimit, disease=essential.coverageCells.perDiseaseLimit;
  assert.equal(admission.value,500000);assert.equal(admission.basis,"per_admission");
  assert.match(admission.conditions.join(" "),/Day Surgery.*90 วัน.*ครั้งสุดท้าย/);
  assert.equal(disease.value,10000000);assert.equal(disease.basis,"per_disease");
  assert.match(disease.conditions.join(" "),/ภาวะแทรกซ้อน.*90 วัน.*ครั้งสุดท้าย/);
  for(const [plan,cell] of [[value,admission],[essential,disease]] as const) assert.ok(cell.sourceIds.some(id=>plan.sources.some(s=>s.id===id&&s.locator.includes("ข้อ 6"))));
});
