import { createBrokerDemoLeads } from "../lib/broker-demo.ts";
import type { DiscoveryPersona } from "../lib/discovery-persona.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { initialDemoState, startDiscoveryState, makeSummary, safeLoad, readDemoStorage, writeDemoStorage, clearDemoStorage, STORAGE_KEY, chatRequestBody, chatContinuation } from "../lib/demo-state.ts";
import { getPlan } from "../lib/catalog.ts";

test("demo state seeds policies and survives a valid envelope", () => {
  const state = initialDemoState();
  const loaded = safeLoad(JSON.stringify(state));
  assert.equal(loaded?.policies.length, 4);
  assert.deepEqual(loaded?.selection, []);
});

test("broken or unsupported storage returns a safe fallback signal", () => {
  assert.equal(safeLoad("{"), null);
  assert.equal(safeLoad(JSON.stringify({ version: 99 })), null);
});

test("customer summary is a catalog-independent snapshot", () => {
  const state = initialDemoState();
  state.profile.preferredCategory = "health";
  state.profile.budgetTHB = 20000;
  state.selection = ["health-01", "health-02"];
  state.comparedPlanIds = [...state.selection];
  const summary = makeSummary(state, ["คุมงบ"], ["วงเงินต่อปี"], ["health-01"]);
  assert.deepEqual(summary && { category: summary.category, budgetTHB: summary.budgetTHB, comparedPlanIds: summary.comparedPlanIds, interestedPlanIds: summary.interestedPlanIds, sourceMode: summary.sourceMode }, { category: "health", budgetTHB: 20000, comparedPlanIds: ["health-01", "health-02"], interestedPlanIds: ["health-01"], sourceMode: "mock" });
});

test("corrupt nested state and unknown plans are rejected",()=>{const state=initialDemoState();state.profile.budgetTHB=-5;assert.equal(safeLoad(JSON.stringify(state)),null);state.profile.budgetTHB=null;state.selection=["missing-plan"];assert.equal(safeLoad(JSON.stringify(state)),null);});
test("restore validates compatible groups and duplicates in all current selection lists",()=>{
 for(const key of ["selection","comparedPlanIds","interestedPlanIds"] as const){const state=initialDemoState();state[key]=["travel-01","travel-03"];assert.equal(safeLoad(JSON.stringify(state)),null);state[key]=["health-01","health-01"];assert.equal(safeLoad(JSON.stringify(state)),null);state[key]=["health-01","health-02"];assert.ok(safeLoad(JSON.stringify(state)));}
});
test("full chat history and persona survive reload and request projection without dropping earlier turns",()=>{
 const context={category:"health" as const,selectedPlanIds:["health-01"],budgetTHB:null,goals:[],persona:{nickname:"ทดสอบ",ageBand:"31-45" as const,category:"health" as const,priorities:["opd"],journey:"ask" as const,gender:"female" as const,budgetBand:"10000-19999" as const}};
 const history=Array.from({length:30},(_,i)=>({role:i%2?"user" as const:"assistant" as const,content:`ข้อความ ${i} ${"ก".repeat(600)}`}));
 const state=initialDemoState();state.messages=history;state.persona=context.persona;
 assert.deepEqual(safeLoad(JSON.stringify(state))?.messages.map(message=>message.content),history.map(message=>message.content));
 const body=JSON.parse(chatRequestBody(history,context));assert.equal(body.messages.length,30);assert.equal(body.messages[0].content,history[0].content);assert.deepEqual(body.context.persona,context.persona);
 assert.throws(()=>chatRequestBody(Array.from({length:201},()=>({role:"user",content:"เก็บไว้"})),context),/ขีดจำกัด/);
 assert.throws(()=>chatRequestBody(Array.from({length:100},()=>({role:"user",content:"ก".repeat(2000)})),context),/ขีดจำกัด/);
});

test("summary IDs remain stable after selection mutation",()=>{const state=initialDemoState();state.comparedPlanIds=["health-01"];const summary=makeSummary(state);state.comparedPlanIds.push("health-02");assert.deepEqual(summary?.comparedPlanIds,["health-01"]);});
test("explicit interest can be summarized without an activity score or budget", () => {
 const state=initialDemoState();state.interestedPlanIds=["health-01"];state.profile.budgetTHB=null;
 const summary=makeSummary(state)!;assert.deepEqual(summary.interestedPlanIds,["health-01"]);assert.equal(summary.budgetTHB,null);assert.ok(!("score" in summary));
});

test("stored conversation mode survives reload and unsafe plan snapshots are rejected",()=>{
 const state=initialDemoState();state.messages=[{role:"assistant",content:"ตัวอย่าง",mode:"mock"},{role:"assistant",content:"คำตอบจริง",mode:"live"}];state.selection=["health-01"];
 const summary=makeSummary(state)!;const now=new Date().toISOString();
 state.leads=[{id:"qa-snapshot",customerId:"demo-customer",displayName:"ทดสอบ",status:"new",createdAt:now,updatedAt:now,consentAt:now,contactWindow:"morning",summary,transcript:[...state.messages],interestScore:50,notes:"",calls:[],planFacts:[structuredClone(getPlan("health-01")!)]}];
 assert.equal(safeLoad(JSON.stringify(state))?.messages[1].mode,"live");
 assert.equal(safeLoad(JSON.stringify(state))?.leads[0].planFacts?.[0].name,"AXA SmartCare Value");
 state.leads[0].planFacts![0].source.url="javascript:alert(1)";
 assert.equal(safeLoad(JSON.stringify(state)),null);
});

test("comparison selection does not invent interest, and summaries preserve decimal budget",()=>{
 const state=initialDemoState();state.selection=["health-01","health-02"];state.profile.budgetTHB=30000.25;
 assert.deepEqual(makeSummary(state)?.comparedPlanIds,[]);assert.deepEqual(makeSummary(state)?.interestedPlanIds,[]);
 state.comparedPlanIds=[...state.selection];state.interestedPlanIds=["health-02"];
 const summary=makeSummary(state)!;assert.equal(summary.budgetTHB,30000.25);assert.deepEqual(summary.interestedPlanIds,["health-02"]);assert.deepEqual(summary.comparedPlanIds,["health-01","health-02"]);
 state.interestedPlanIds.push("health-01");assert.deepEqual(summary.interestedPlanIds,["health-02"]);
});

test("restore rejects invalid call dates and closed leads with an active call",()=>{
 const state=initialDemoState(),now=new Date().toISOString();
 state.leads=[{id:"qa-call",customerId:"demo-customer",displayName:"ทดสอบ",status:"contacting",createdAt:now,updatedAt:now,consentAt:now,contactWindow:"morning",summary:makeSummary(state)!,transcript:[],interestScore:50,notes:"",calls:[{id:"call",startedAt:now,endedAt:null,outcome:null,note:""}]}];
 assert.ok(safeLoad(JSON.stringify(state)));state.leads[0].status="closed";assert.equal(safeLoad(JSON.stringify(state)),null);
 state.leads[0].status="contacting";state.leads[0].calls[0].startedAt="invalid";assert.equal(safeLoad(JSON.stringify(state)),null);
});

test("storage boundary recovers denied/corrupt data and resets only the app key",()=>{
 const values=new Map<string,string>([["unrelated-app","keep"]]);const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);},removeItem:(key:string)=>{values.delete(key);}};
 assert.equal(readDemoStorage(storage).warning,false);assert.equal(writeDemoStorage(storage,initialDemoState()),true);
 assert.ok(values.has(STORAGE_KEY));assert.equal(clearDemoStorage(storage),true);assert.equal(values.get("unrelated-app"),"keep");assert.equal(values.has(STORAGE_KEY),false);
 storage.setItem(STORAGE_KEY,"{");assert.equal(readDemoStorage(storage).warning,true);assert.deepEqual(readDemoStorage(storage).state.selection,[]);
 const denied={getItem:()=>{throw new Error("denied")},setItem:()=>{throw new Error("quota")},removeItem:()=>{throw new Error("denied")}};
 assert.equal(readDemoStorage(denied).warning,true);assert.equal(writeDemoStorage(denied,initialDemoState()),false);assert.equal(clearDemoStorage(denied),false);
});

test("retired draft IDs leave selection without erasing historical requests",()=>{
 const state=initialDemoState();state.selection=["life-05"];state.comparedPlanIds=["life-05"];const now=new Date().toISOString();state.leads=[{id:"historical",customerId:"demo-customer",displayName:"เดโมเก่า",status:"new",createdAt:now,updatedAt:now,consentAt:now,contactWindow:"morning",summary:{category:"life",budgetTHB:null,needs:[],questions:[],comparedPlanIds:["life-05"],interestedPlanIds:["life-05"],generatedAt:now,sourceMode:"mock",editedByUser:false},transcript:[],interestScore:50,notes:"",calls:[]}];const restored=safeLoad(JSON.stringify(state));assert.ok(restored);assert.deepEqual(restored.selection,[]);assert.equal(restored.profile.id,"demo-customer");assert.deepEqual(restored.leads[0].summary.interestedPlanIds,["life-05"]);
});

test("historical transcript cards retain retired snapshot facts without catalog lookup",()=>{
 const state=initialDemoState(),now=new Date().toISOString();
 const snapshot=structuredClone(getPlan("health-06")!);snapshot.id="health-99";snapshot.name="ชื่อแผน ณ ตอนส่ง";snapshot.coverageCells.annualLimit.value=123456;snapshot.coverage.annualLimit=123456;
 state.leads=[{id:"historical-cards",customerId:"demo-customer",displayName:"เดโม",status:"new",createdAt:now,updatedAt:now,consentAt:now,contactWindow:"morning",summary:makeSummary(state)!,transcript:[{role:"assistant",content:"ดูข้อมูลในการ์ด",cards:[{type:"plans",planIds:["health-99"],fieldKeys:["annualLimit"]}]}],interestScore:50,notes:"",calls:[],planFacts:[snapshot]}];
 const restored=safeLoad(JSON.stringify(state));assert.ok(restored);assert.equal(getPlan("health-99"),undefined);assert.deepEqual(restored.leads[0].transcript[0].cards,state.leads[0].transcript[0].cards);assert.equal(restored.leads[0].planFacts?.[0].coverageCells.annualLimit.value,123456);assert.equal(restored.leads[0].planFacts?.[0].name,"ชื่อแผน ณ ตอนส่ง");
});

test("legacy card without snapshot remains a readable unavailable reference",()=>{
 const state=initialDemoState(),now=new Date().toISOString();state.leads=[{id:"legacy-card",customerId:"demo-customer",displayName:"เดโม",status:"new",createdAt:now,updatedAt:now,consentAt:now,contactWindow:"morning",summary:makeSummary(state)!,transcript:[{role:"assistant",content:"ดูการ์ด",cards:[{type:"plans",planIds:["health-99"],fieldKeys:["legacyBenefit"]}]}],interestScore:50,notes:"",calls:[]}];
 const restored=safeLoad(JSON.stringify(state));assert.ok(restored);assert.equal(restored.leads[0].transcript[0].cards?.[0].type,"plans");assert.equal(restored.leads[0].planFacts,undefined);
 state.leads[0].transcript[0].cards=[{type:"plans",planIds:["https://bad.test"],fieldKeys:["annualLimit"]}];assert.deepEqual(safeLoad(JSON.stringify(state))?.leads[0].transcript[0].cards,[]);
 state.leads[0].transcript[0].cards=[{type:"plans",planIds:["health-99"],fieldKeys:["__proto__"]}];assert.deepEqual(safeLoad(JSON.stringify(state))?.leads[0].transcript[0].cards,[]);
});


test("starting a new persona resets only discovery context and preserves broker cases",()=>{
 const prior=initialDemoState();prior.leads=createBrokerDemoLeads();prior.messages=[{role:"user",content:"ข้อมูลการค้นหารอบเดิม"}];prior.selection=["motor-01"];prior.profile.budgetTHB=20000;
 const persona:DiscoveryPersona={nickname:"ต้น",ageBand:"21-30",category:"health",priorities:["room","opd"],journey:"compare"};
 const state=startDiscoveryState(prior,persona);assert.equal(state.profile.displayName,"ต้น");assert.equal(state.profile.budgetTHB,null);assert.equal(state.profile.preferredCategory,"health");assert.equal(state.selection.length,3);assert.ok(state.selection.every(id=>id.startsWith("health-")));assert.deepEqual(state.messages,[]);assert.deepEqual(state.comparedPlanIds,[]);assert.deepEqual(state.interestedPlanIds,[]);assert.deepEqual(state.leads,prior.leads);assert.deepEqual(state.policies,prior.policies);
 assert.deepEqual(safeLoad(JSON.stringify(state))?.persona,persona);
 const ask=startDiscoveryState(state,{...persona,journey:"ask"});assert.deepEqual(ask.selection,[]);assert.equal(ask.leads.length,prior.leads.length);
 const corrupted=safeLoad(JSON.stringify({...state,persona:{...persona,priorities:["unknown"]}}));assert.ok(corrupted);assert.equal(corrupted.persona,undefined);assert.equal(corrupted.leads.length,prior.leads.length);
});


test("compare and category actions retain conversation memory; only a new persona resets it",()=>{
 const state=initialDemoState();state.profile.preferredCategory="health";
 state.messages=[{role:"user",content:"เรียกเราว่า มิน มีประกันสังคมอยู่แล้ว"},{role:"assistant",content:"มีสามแผนให้ดู",cards:[{type:"plans",planIds:["health-01","health-02","health-03"],fieldKeys:[]}]}];
 const compare=chatContinuation(state,{profile:state.profile});
 assert.equal(compare.resetHistory,false);assert.deepEqual(compare.messages,state.messages);assert.deepEqual(compare.lastShownPlanIds,["health-01","health-02","health-03"]);
 const changed=chatContinuation(state,{profile:{...state.profile,preferredCategory:"pet"}});
 assert.deepEqual(changed.messages,state.messages);assert.deepEqual(changed.lastShownPlanIds,[]);
 const persona:DiscoveryPersona={nickname:"ใหม่",ageBand:"21-30",category:"health",priorities:["opd"],journey:"ask"};
 assert.deepEqual(chatContinuation(state,{profile:state.profile,persona}),{resetHistory:true,messages:[],customerFacts:undefined,lastShownPlanIds:undefined});
 const body=JSON.parse(chatRequestBody([...compare.messages,{role:"user",content:"เทียบสามตัวนี้"}],{category:"health",selectedPlanIds:["health-01","health-02","health-03"],budgetTHB:null,goals:[]}));
 assert.equal(body.messages[0].content,state.messages[0].content);
});
