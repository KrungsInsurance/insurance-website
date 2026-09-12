import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../lib/catalog.ts";
import { categories } from "../lib/types.ts";
import { browseAnswersError, browseContextMessage, browseRefinements, cleanBrowseAnswers, refineBrowsePlans, validBrowseFocus } from "../lib/browse-refinement.ts";

test("all catalog categories have optional relevant refinement questions", () => {
  for (const category of categories) {
    assert.ok(browseRefinements[category].choices.length >= 3);
    assert.ok(browseRefinements[category].fields.length >= 4);
    assert.equal(new Set(browseRefinements[category].fields.map(field => field.key)).size, browseRefinements[category].fields.length);
    assert.equal(validBrowseFocus(category, "made-up"), "");
  }
});

test("motor class filtering uses sourced class facts, keeps quote-only and respects compulsory separation", () => {
  const motor = catalog.filter(plan => plan.category === "motor");
  const firstClass = refineBrowsePlans(motor, "motor", "class-1");
  assert.ok(firstClass.some(plan => plan.id === "motor-01"));
  assert.ok(firstClass.some(plan => plan.id === "motor-02"));
  assert.ok(firstClass.some(plan => plan.price.kind === "quote_only"));
  assert.ok(firstClass.every(plan => plan.subtype === "voluntary"));
  assert.deepEqual(refineBrowsePlans(motor, "motor", "compulsory").map(plan => plan.id), ["motor-05"]);
  const unknown = { ...motor[0], coverageCells: { ...motor[0].coverageCells, class: { ...motor[0].coverageCells.class, status: "unknown" as const, value: null } } };
  assert.deepEqual(refineBrowsePlans([unknown], "motor", "class-1"), []);
});

test("travel subtypes and life types are filtered using recorded classifications", () => {
  const travel = catalog.filter(plan => plan.category === "travel");
  assert.ok(refineBrowsePlans(travel, "travel", "domestic").every(plan => plan.subtype === "domestic"));
  assert.equal(refineBrowsePlans(travel, "travel", "inbound").length, 1);
  const life = catalog.filter(plan => plan.category === "life");
  assert.deepEqual(refineBrowsePlans(life, "life", "term").map(plan => plan.id), ["life-07"]);
  assert.ok(refineBrowsePlans(life, "life", "savings").every(plan => String(plan.coverageCells.lifeType.value).includes("สะสมทรัพย์")));
});

test("interests and quote details do not pretend to establish eligibility or exclude unknown benefits", () => {
  for (const category of ["health", "accident", "property", "liability"] as const) {
    const plans = catalog.filter(plan => plan.category === category);
    assert.deepEqual(refineBrowsePlans(plans, category, browseRefinements[category].choices[0].value), plans);
  }
  assert.deepEqual(cleanBrowseAnswers("motor", { brand: " Toyota ", year: "2022", occupation: "other category", vehicleType: "unknown enum", model: "x".repeat(150) }), { brand: "Toyota", model: "x".repeat(120), year: "2022" });
  assert.deepEqual(cleanBrowseAnswers("motor", { year: "1499", startDate: "not a date" }), {});
  assert.deepEqual(cleanBrowseAnswers("property", { brand: "Toyota", province: "เชียงใหม่" }), { province: "เชียงใหม่" });
  assert.deepEqual(cleanBrowseAnswers("travel", { departure: "2026-02-31" }), {});
  assert.deepEqual(cleanBrowseAnswers("health", { age: "35" }), { age: "35" });
  assert.deepEqual(cleanBrowseAnswers("life", { age: "121" }), {});
  assert.deepEqual(cleanBrowseAnswers("motor", { birthYear: "1990" }), { birthYear: "1990" });
});

test("quote context becomes an editable customer draft without fabricated pricing or unrelated details", () => {
  const message = browseContextMessage({ category: "motor", focus: "class-2plus", answers: { brand: "Toyota", year: "2022", occupation: "not a motor field" } });
  assert.match(message, /รถยนต์ · ชั้น 2\+/);
  assert.match(message, /ยี่ห้อ: Toyota/);
  assert.match(message, /ปีที่ผลิต \(ค.ศ.\): 2022/);
  assert.doesNotMatch(message, /not a motor field/);
  assert.match(message, /ยังไม่ต้องยืนยันราคาเฉพาะบุคคล/);
});

test("submitted travel dates retain native form values and reject only reversed complete ranges", () => {
  const form = new FormData();
  form.set("departure", "2026-10-20");
  form.set("return", "2026-10-19");
  const answers = cleanBrowseAnswers("travel", Object.fromEntries(form));
  assert.deepEqual(answers, { departure: "2026-10-20", return: "2026-10-19" });
  assert.equal(browseAnswersError("travel", answers), "วันกลับต้องไม่ก่อนวันออกเดินทาง");
  assert.equal(browseAnswersError("travel", { ...answers, return: "2026-10-20" }), "");
  assert.equal(browseAnswersError("travel", { ...answers, return: "2026-10-25" }), "");
  assert.equal(browseAnswersError("travel", { departure: "2026-10-20" }), "");
  assert.equal(browseAnswersError("travel", {}), "");
});
