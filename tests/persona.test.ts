import test from "node:test";
import assert from "node:assert/strict";
import { catalog, categoryFields } from "../lib/catalog.ts";
import { arePlansCompatible } from "../lib/compare.ts";
import { categories } from "../lib/types.ts";
import {
  ageBands, discoveryPersonaSchema, personaFieldKeys, personaOpening,
  priorityTopics, selectPersonaPlans, type DiscoveryPersona,
} from "../lib/discovery-persona.ts";

const persona: DiscoveryPersona = {
  nickname: "มะลิ", ageBand: "31-45", category: "health", priorities: ["opd"], journey: "compare",
};

test("persona validates the two identity fields and category-specific choices", () => {
  assert.equal(discoveryPersonaSchema.parse({ ...persona, nickname: "  มะลิ  " }).nickname, "มะลิ");
  for (const override of [
    { nickname: "   " }, { nickname: "ก".repeat(61) }, { ageBand: "under-18" },
    { priorities: [] }, { priorities: ["opd", "opd"] }, { priorities: ["cashback"] },
    { priorities: ["room", "ipd", "opd", "premium"] }, { journey: "purchase" },
  ]) assert.equal(discoveryPersonaSchema.safeParse({ ...persona, ...override }).success, false);
  assert.equal(ageBands.length, 5);
  assert.ok(ageBands.every(band => band.image === `/images/personas/age-${band.id}.png`));
});

test("topics distinguish life protection and savings from health treatments", () => {
  assert.ok(priorityTopics.life.some(topic => topic.id === "family"));
  assert.ok(priorityTopics.life.some(topic => topic.id === "cashback"));
  assert.ok(!priorityTopics.life.some(topic => /ค่าห้อง|OPD/.test(topic.label)));
  for (const category of categories) {
    const topics = priorityTopics[category];
    assert.ok(topics.length >= 3 && topics.length <= 6);
    assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length);
    assert.ok(topics.every(topic => topic.fieldKeys.every(key => categoryFields[category].some(field => field.key === key))));
  }
});

test("automatic comparison uses up to three existing compatible plans without inventing a third", () => {
  const before = JSON.stringify(catalog);
  for (const category of categories) {
    for (const topic of priorityTopics[category]) {
      const context = { ...persona, category, priorities: [topic.id] };
      const plans = selectPersonaPlans(context);
      assert.ok(plans.length >= 1 && plans.length <= 3);
      assert.equal(arePlansCompatible(plans), true);
      assert.ok(plans.every(plan => plan.category === category && catalog.includes(plan)));
      assert.equal(new Set(plans.map(plan => plan.id)).size, plans.length);
      assert.deepEqual(selectPersonaPlans(context), plans);
    }
  }
  assert.equal(selectPersonaPlans({ ...persona, category: "property", priorities: ["flood"] }).length, 3);
  assert.equal(selectPersonaPlans({ ...persona, category: "liability", priorities: ["activity"] }).length, 2);
  assert.equal(selectPersonaPlans({ ...persona, category: "event", priorities: ["wedding"] }).length, 2);
  assert.equal(JSON.stringify(catalog), before);
});

test("topic retrieval prefers documented facts while preserving optional and unknown coverage", () => {
  const opd = selectPersonaPlans(persona);
  assert.equal(opd[0].id, "health-02");
  assert.equal(opd[0].coverageCells.opdPerYear.inclusion, "optional");
  assert.equal(opd[2].coverageCells.opdPerYear.status, "unknown");
  assert.equal(opd[2].coverageCells.opdPerYear.value, null);
  const cashback = selectPersonaPlans({ ...persona, category: "life", priorities: ["cashback"] });
  assert.ok(cashback.every(plan => plan.coverageCells.guaranteedCashback.status === "known"));
  const accident = selectPersonaPlans({ ...persona, category: "accident", priorities: ["income"] });
  assert.equal(accident[0].id, "accident-04");
  assert.equal(accident[0].coverageCells.dailyAllowance.status, "known");
});

test("quote-only products remain available and subtypes are never mixed", () => {
  const motor = selectPersonaPlans({ ...persona, category: "motor", priorities: ["collision"] });
  assert.ok(motor.every(plan => plan.subtype === "voluntary"));
  assert.ok(motor.some(plan => plan.price.kind === "quote_only" && plan.price.amountTHB === null));
  const travel = selectPersonaPlans({ ...persona, category: "travel", priorities: ["medical"] });
  assert.ok(travel.every(plan => plan.subtype === "outbound"));
  assert.equal(travel[0].id, "travel-07");
  const liability = selectPersonaPlans({ ...persona, category: "liability", priorities: ["annual"] });
  assert.ok(liability.every(plan => plan.price.kind === "quote_only"));
  assert.ok(liability.every(plan => plan.coverageCells.aggregateLimit.status === "unknown"));
});

test("age bands provide context without fabricating eligibility or an exact age", () => {
  assert.deepEqual(selectPersonaPlans({ ...persona, ageBand: "61-plus" }), selectPersonaPlans(persona));
  const opening = personaOpening({ ...persona, ageBand: "61-plus" });
  assert.match(opening, /มะลิ.*61 ปีขึ้นไป/);
  assert.doesNotMatch(opening, /สมัครได้|ผ่านเกณฑ์|รับประกันแน่นอน|อายุ 61 ปี$/);
  assert.doesNotMatch(opening, /งบ.*\d|บาท/);
});

test("ask and browse do not select products, while ask opening requests information only", () => {
  const ask = { ...persona, journey: "ask" as const };
  assert.deepEqual(selectPersonaPlans(ask), []);
  assert.deepEqual(selectPersonaPlans({ ...persona, journey: "browse" }), []);
  assert.match(personaOpening(ask), /ยังไม่ต้องเสนอแผนประกัน/);
  assert.match(personaOpening(ask), /พบแพทย์แบบไม่นอนโรงพยาบาล/);
  assert.doesNotMatch(personaOpening(ask), /เปรียบเทียบ|health-\d|AXA/);
  assert.match(personaOpening(persona), /เปรียบเทียบ/);
});

test("comparison fields follow selected topics and stay within the card contract", () => {
  assert.deepEqual(personaFieldKeys(persona), ["opdPerYear", "opdPerVisit"]);
  const context = { ...persona, priorities: ["ipd", "room", "opd"] };
  assert.equal(personaFieldKeys(context).length, 7);
  const travel = { ...persona, category: "travel" as const, priorities: ["delay", "duration", "medical"] };
  assert.equal(personaFieldKeys(travel).length, 8);
  assert.equal(new Set(personaFieldKeys(travel)).size, 8);
  assert.ok(personaFieldKeys({ ...persona, priorities: ["premium"] }).length > 0);
});

test("optional annual budget choice roundtrips without inventing an exact budget or hiding quote plans",async()=>{
 const {startDiscoveryState,initialDemoState,safeLoad}=await import("../lib/demo-state.ts");
 const {budgetBands,personaBudgetLabel}=await import("../lib/discovery-persona.ts");
 for(const band of budgetBands){
  const choice={...persona,budgetBand:band.id};
  const state=startDiscoveryState(initialDemoState(),choice);
  assert.equal(state.profile.budgetTHB,null);
  assert.equal(safeLoad(JSON.stringify(state))?.persona?.budgetBand,band.id);
  assert.deepEqual(selectPersonaPlans(choice),selectPersonaPlans(persona));
  assert.equal(personaBudgetLabel(choice),band.id==="unknown"?"ยังไม่กำหนดงบ":`${band.label} / ปี`);
 }
 assert.equal(discoveryPersonaSchema.safeParse({...persona,budgetBand:"invalid"}).success,false);
 assert.equal(discoveryPersonaSchema.safeParse(persona).success,true);
});

test("budget bands survive extraction as quoted ranges, never a single endpoint",async()=>{
 const {extractMockFacts,validateCustomerFacts}=await import("../lib/customer-extraction.ts");
 for(const budgetBand of ["10000-19999","under-10000","over-50000"] as const){
  const content=personaOpening({...persona,budgetBand});
  const history=[{role:"user",content}];
  const facts=extractMockFacts(history);
  assert.equal(facts.budget?.period,"year");assert.equal(facts.budget?.amountTHB,null);assert.match(facts.budget!.quote,/ช่วงงบประมาณ/);
  const modelOutput=structuredClone(facts);modelOutput.budget!.amountTHB=10000;
  assert.equal(validateCustomerFacts(modelOutput,history).budget?.amountTHB,null);
  modelOutput.budget!.quote=content.split("เงินที่อยากใช้กับประกันต่อปี: ")[1].split(" (ช่วงงบประมาณ)")[0];
  assert.equal(validateCustomerFacts(modelOutput,history).budget?.amountTHB,null);
 }
});

test("optional gender and demo Your Data choices preserve old personas without influencing plan retrieval",async()=>{
 const {startDiscoveryState,initialDemoState,safeLoad}=await import("../lib/demo-state.ts");
 assert.equal(discoveryPersonaSchema.safeParse(persona).success,true);
 assert.equal(discoveryPersonaSchema.parse(persona).gender,undefined);
 assert.equal(discoveryPersonaSchema.parse(persona).yourDataConsent,undefined);
 for(const gender of ["female","male","other","unspecified"] as const){
  for(const yourDataConsent of ["accepted","declined"] as const){
   const choice={...persona,budgetBand:"unknown" as const,gender,yourDataConsent};
   assert.equal(discoveryPersonaSchema.safeParse(choice).success,true);
   const restored=safeLoad(JSON.stringify(startDiscoveryState(initialDemoState(),choice)));
   assert.equal(restored?.persona?.gender,gender);
   assert.equal(restored?.persona?.yourDataConsent,yourDataConsent);
   assert.equal(restored?.profile.budgetTHB,null);
   assert.deepEqual(selectPersonaPlans(choice),selectPersonaPlans(persona));
   assert.doesNotMatch(personaOpening(choice),/Your Data|consent|ยินยอม|ข้อมูลธนาคาร/);
  }
 }
 assert.equal(discoveryPersonaSchema.safeParse({...persona,gender:"inferred"}).success,false);
 assert.equal(discoveryPersonaSchema.safeParse({...persona,yourDataConsent:true}).success,false);
 assert.equal(discoveryPersonaSchema.safeParse({...persona,yourDataConsent:"connected"}).success,false);
 assert.doesNotMatch(personaOpening(persona),/ระบุเพศ/);
 assert.doesNotMatch(personaOpening({...persona,gender:"unspecified"}),/ระบุเพศ/);
 assert.match(personaOpening({...persona,gender:"female"}),/ระบุเพศหญิง/);
});
