import test, {type TestContext} from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
registerHooks({resolve(specifier,context,next){return next(specifier.startsWith("@/")?pathToFileURL(resolve(specifier.slice(2))+".ts").href:specifier,context);}});
const {handleChat}=await import("../app/api/chat/route.ts");
const POST=(request:Request)=>handleChat(request,{offlineDemo:new URL(request.url).searchParams.get("mode")==="mock"});
const {emptyCustomerFacts,validateCustomerFacts,extractMockFacts}=await import("../lib/customer-extraction.ts");
const {buildAssistantOverview}=await import("../lib/assistant-overview.ts");
const {initialDemoState,makeSummary,safeLoad}=await import("../lib/demo-state.ts");
const {catalog}=await import("../lib/catalog.ts");
const messages=[{role:"user",content:"อยากดูประกันสุขภาพ\nมีประกันกลุ่มอยู่แล้ว\nกังวลค่าห้อง\nงบ 20,000 บาทต่อปี\nOPD ต่างกันไหม"}];
const facts={...emptyCustomerFacts(),needs:[{text:"ดูประกันสุขภาพ",quote:"อยากดูประกันสุขภาพ"}],currentCoverage:[{text:"มีประกันกลุ่ม",quote:"มีประกันกลุ่มอยู่แล้ว"}],concerns:[{text:"ค่าห้อง",quote:"กังวลค่าห้อง"}],questions:[{text:"OPD ต่างกันไหม",quote:"OPD ต่างกันไหม"}],budget:{amountTHB:20000,period:"year" as const,quote:"งบ 20,000 บาทต่อปี"},category:"health" as const,categoryQuote:"อยากดูประกันสุขภาพ"};
const req=(body:unknown={messages,context:{category:"health",selectedPlanIds:["health-01","health-02"],budgetTHB:null}},mode="live")=>new Request(`http://localhost/api/chat?mode=${mode}`,{method:"POST",body:JSON.stringify(body)});
const completed=(data:unknown)=>Response.json({status:"completed",output:[{type:"message",content:[{type:"output_text",text:JSON.stringify(data)}]}]});
const reply={message:"แสดงความต่างตามข้อมูลที่มี ผู้เชี่ยวชาญเป็นผู้ให้คำแนะนำ",suggestedPlanIds:[],offerHandoff:false,summaryDraft:null};
function configure(t:TestContext){const prior={key:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL};process.env.OPENAI_API_KEY="test-key";process.env.OPENAI_MODEL="test-model";t.after(()=>{if(prior.key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=prior.key;if(prior.model===undefined)delete process.env.OPENAI_MODEL;else process.env.OPENAI_MODEL=prior.model;});}

test("customer extraction uses only verbatim user evidence and preserves missing versus zero budget",()=>{
 assert.deepEqual(validateCustomerFacts(facts,messages),facts);
 assert.throws(()=>validateCustomerFacts({...facts,currentCoverage:[{text:"มี OPD",quote:"มี OPD 50000"}]},[...messages,{role:"assistant",content:"มี OPD 50000"}]));
 assert.throws(()=>validateCustomerFacts({...facts,budget:{...facts.budget,amountTHB:99999}},messages));
 const zero=validateCustomerFacts({...emptyCustomerFacts(),budget:{amountTHB:0,period:"year",quote:"งบ 0 บาทต่อปี"}},[{role:"user",content:"งบ 0 บาทต่อปี"}]);
 assert.throws(()=>validateCustomerFacts({...emptyCustomerFacts(),budget:{amountTHB:3000,period:"year",quote:"งบ 3000 บาทต่อเดือน"}},[{role:"user",content:"งบ 3000 บาทต่อเดือน"}]));
 assert.equal(zero.budget?.amountTHB,0);assert.equal(emptyCustomerFacts().budget,null);
 assert.throws(()=>validateCustomerFacts({...facts,priority:"high"},messages));
});

test("previous quotes survive rolling history while explicit correction replaces budget",()=>{
 const corrected={...facts,budget:{amountTHB:3000,period:"month" as const,quote:"เปลี่ยนงบเป็น 3000 บาทต่อเดือน"}};
 const result=validateCustomerFacts(corrected,[{role:"user",content:"เปลี่ยนงบเป็น 3000 บาทต่อเดือน"}],facts);
 assert.equal(result.budget?.period,"month");assert.equal(result.currentCoverage[0].text,"มีประกันกลุ่ม");
});

test("mock extraction grounds short discovery answers without turning glossary questions into coverage",async()=>{
 const {extractMockFacts}=await import("../lib/customer-extraction.ts");
 const history=[
  {role:"user",content:"เบี้ยประกันคืออะไร"},
  {role:"assistant",content:"กังวลเบี้ยหรือเงินที่ต้องออกเองมากกว่ากัน?"},
  {role:"user",content:"เงินที่ต้องออกเอง"},
  {role:"assistant",content:"ตอนนี้มีประกันหรือสวัสดิการอะไรช่วยจ่ายค่ารักษาอยู่แล้วบ้าง?"},
  {role:"user",content:"ไม่มีเลย"},
  {role:"assistant",content:"อยากให้ประกันช่วยค่ารักษาหรือรายได้เป็นหลัก?"},
  {role:"user",content:"รายได้ช่วงหยุดงาน"},
 ];
 const result=extractMockFacts(history);
 assert.deepEqual(result.currentCoverage,[{text:"ไม่มีเลย",quote:"ไม่มีเลย"}]);
 assert.ok(result.concerns.some(fact=>fact.quote==="เงินที่ต้องออกเอง"));
 assert.ok(result.needs.some(fact=>fact.quote==="รายได้ช่วงหยุดงาน"));
 assert.equal(result.budget,null);assert.deepEqual(validateCustomerFacts(result,history),result);
 const question=extractMockFacts([{role:"user",content:"มีประกันสังคมคืออะไร"}]);
 assert.deepEqual(question.currentCoverage,[]);assert.equal(question.budget,null);
});

test("an acknowledgement mentioning worry does not classify a frequency or coverage answer as a concern",async()=>{
 const {extractMockFacts}=await import("../lib/customer-extraction.ts");
 const worry="กังวลเบี้ยที่ต้องจ่ายต่อเนื่อง";
 const answer="ประมาณเดือนละครั้ง มีประกันสังคมอยู่แล้ว";
 const history=[{role:"user",content:worry},{role:"assistant",content:`เข้าใจว่าคุณกังวลเรื่อง “${worry}”\nปกติพบแพทย์แบบตรวจแล้วกลับบ้านบ่อยแค่ไหน?`},{role:"user",content:answer}];
 const restored={...emptyCustomerFacts(),concerns:[{text:worry,quote:worry},{text:answer,quote:answer}]};
 const facts=extractMockFacts(history,restored);
 assert.deepEqual(facts.concerns,[{text:worry,quote:worry}]);
 assert.deepEqual(facts.currentCoverage,[{text:answer,quote:answer}]);
 assert.equal(facts.budget,null);assert.deepEqual(validateCustomerFacts(facts,history),facts);
 const rolled=extractMockFacts([{role:"user",content:"ขอบคุณ"}],facts);
 assert.deepEqual(rolled.concerns,facts.concerns);
});

test("live pipeline extracts first, supplies normalized catalog, then highlights canonical differences",async t=>{
 configure(t);const calls:string[]=[];
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  const body=JSON.parse(options!.body as string);assert.equal(body.store,false);assert.equal(body.model,"test-model");
  if(body.text.format.name==="customer_extraction"){calls.push("extract");return completed(facts);}
  if(calls.length===1){calls.push("retrieve_compare");assert.deepEqual(JSON.parse(body.input[1].content).customerFacts,facts);return Response.json({status:"completed",output:[{type:"function_call",name:"compare_plans",arguments:JSON.stringify({category:"health",planIds:["health-01","health-02"]}),call_id:"compare"}]});}
  calls.push("highlight");const output=JSON.parse(body.input.find((item:{type:string})=>item.type==="function_call_output").output);
  assert.equal(output.plans[0].coverageCells.annualLimit.value,2500000);assert.ok(output.descriptiveDifferences.length>0);return completed(reply);
 });
 const response=await POST(req());assert.equal(response.status,200);const result=await response.json() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
 assert.deepEqual(calls,["extract","retrieve_compare","highlight"]);assert.equal(result.overview.sourceMode,"live");assert.deepEqual(result.overview.customer,facts);
 assert.ok(result.overview.differences.some((row:{fieldKey:string;status:string})=>row.fieldKey==="annualLimit"&&row.status==="insufficient"));
 assert.equal(result.overview.recommendation,undefined);assert.equal(result.overview.score,undefined);assert.equal(result.summaryDraft,null);
});

test("invalid extraction and fabricated quotes stop before retrieval without a mock fallback",async t=>{
 configure(t);
 for(const data of [{...facts,score:99},{...facts,needs:[{text:"ซื้อชีวิต",quote:"ข้อความที่ไม่มี"}]},{...facts,budget:{...facts.budget,amountTHB:1000000}}]){
  const f=t.mock.method(globalThis,"fetch",async()=>completed(data));const response=await POST(req());assert.equal(response.status,502);assert.equal(f.mock.callCount(),2);assert.ok(!(await response.text()).includes("test-key"));f.mock.restore();
 }
});

test("extraction upstream errors and deadline are controlled before any product lookup",async t=>{
 configure(t);
 for(const [status,expected] of [[429,429],[401,503],[500,502]]){const f=t.mock.method(globalThis,"fetch",async()=>new Response("private diagnostic",{status}));const response=await POST(req());assert.equal(response.status,expected);assert.equal(f.mock.callCount(),1);assert.ok(!(await response.text()).includes("diagnostic"));f.mock.restore();}
 t.mock.timers.enable({apis:["setTimeout"]});let started=()=>{};const ready=new Promise<void>(resolve=>{started=resolve;});
 t.mock.method(globalThis,"fetch",(_url:unknown,options:RequestInit)=>new Promise<Response>((_resolve,reject)=>{options!.signal!.addEventListener("abort",()=>reject(new DOMException("Aborted","AbortError")));started();}));
 const pending=POST(req());await ready;t.mock.timers.tick(45000);assert.equal((await pending).status,504);
});

test("prescriptive Live output is rejected instead of shown as advice",async t=>{
 configure(t);let count=0;t.mock.method(globalThis,"fetch",async()=>count++===0?completed(facts):completed({...reply,message:"แนะนำให้เลือกแผน health-01 เพราะเหมาะกับคุณ"}));
 assert.equal((await POST(req())).status,502);
});

test("monthly extracted budget is not silently converted to annual and quote plans remain retrievable",async t=>{
 configure(t);const monthly={...emptyCustomerFacts(),budget:{amountTHB:3000,period:"month",quote:"งบ 3000 บาทต่อเดือน"}};let count=0;
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  if(count++===0)return completed(monthly);
  if(count===2)return Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"health",maxPremium:36000}),call_id:"lookup"}]});
  const body=JSON.parse(options!.body as string);const output=JSON.parse(body.input.find((i:{type:string})=>i.type==="function_call_output").output);
  assert.equal(output.budgetBasis.maxPremium,null);assert.ok(output.quoteRequired.some((p:{id:string})=>p.id==="health-06"));return completed(reply);
 });
 const response=await POST(req({messages:[{role:"user",content:"งบ 3000 บาทต่อเดือน"}],context:{category:"health",selectedPlanIds:[],budgetTHB:20000}}));assert.equal(response.status,200);
});

test("descriptive overview is a frozen consent snapshot, not inferred plans of interest",()=>{
 const state=initialDemoState();state.profile.preferredCategory="health";state.comparedPlanIds=["health-01","health-02"];state.interestedPlanIds=["health-02"];
 state.assistantOverview=buildAssistantOverview(facts,["health-01","health-02","health-06"],state.comparedPlanIds,"live");
 const summary=makeSummary(state,facts.needs.map(f=>f.text),facts.questions.map(f=>f.text))!;
 assert.deepEqual(summary.interestedPlanIds,["health-02"]);assert.deepEqual(summary.currentCoverage,["มีประกันกลุ่ม"]);
 state.assistantOverview.customer.needs[0].text="เปลี่ยนหลังส่ง";assert.equal(summary.overview!.customer.needs[0].text,"ดูประกันสุขภาพ");
 state.summary=summary;const restored=safeLoad(JSON.stringify(state))!;assert.ok(restored);assert.deepEqual(restored.summary,summary);
 const value=catalog[0].coverageCells.annualLimit.value;catalog[0].coverageCells.annualLimit.value=1;
 try{assert.deepEqual(safeLoad(JSON.stringify(state))!.summary!.overview!.differences,summary.overview!.differences);}finally{catalog[0].coverageCells.annualLimit.value=value;}
});

test("mock pipeline identifies its mode and keeps extraction separate from plan selection",async()=>{
 const extracted=extractMockFacts(messages);assert.equal(extracted.budget?.amountTHB,20000);assert.equal(extracted.currentCoverage.length,1);
 const response=await POST(req(undefined,"mock"));assert.equal(response.status,200);const result=await response.json() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
 assert.equal(result.mode,"mock");assert.equal(result.overview.sourceMode,"mock");assert.equal(result.overview.customer.currentCoverage.length,1);assert.equal(result.offerHandoff,false);
});

const {brokerCandidates,brokerNextSteps}=await import("../lib/broker-brief.ts");
function brokerLead():import("../lib/types.ts").Lead {
 const now=new Date().toISOString();
 const state=initialDemoState();state.profile.preferredCategory="health";state.profile.budgetTHB=null;
 const summary=makeSummary(state)!;summary.overview=buildAssistantOverview(facts,["health-01","health-02"],["health-01","health-02"],"mock");
 summary.comparedPlanIds=["health-01","health-02"];summary.interestedPlanIds=["health-02"];summary.questions=["OPD ต่างกันไหม"];
 return {id:"broker-test",customerId:"demo-customer",displayName:"ทดสอบ",createdAt:now,updatedAt:now,consentAt:now,status:"new",contactWindow:"evening",summary,transcript:messages.map(m=>({...m,role:"user" as const})),notes:"",calls:[],planFacts:structuredClone(catalog.filter(p=>["health-01","health-02"].includes(p.id)))};
}
test("broker shortlist uses saved facts and verbatim evidence, keeps missing OPD and optional cover explicit",()=>{
 const lead=brokerLead();lead.planFacts![1].coverageCells.roomPerDay.value=9999;
 const candidates=brokerCandidates(lead);
 assert.equal(candidates.length,3);assert.equal(candidates[0].plan.id,"health-02");
 assert.equal(candidates[0].plan.coverageCells.roomPerDay.value,9999);
 assert.equal(candidates[0].plan.coverageCells.opdPerYear.inclusion,"optional");
 assert.ok(candidates[0].evidence.every(e=>messages[0].content.includes(e.quote)));
 assert.ok(candidates.find(c=>c.plan.id==="health-01")!.checks.some(c=>c.includes("ผู้ป่วยนอก")));
 assert.ok(candidates.every(c=>c.plan.category==="health"));
 assert.equal(lead.summary.budgetTHB,null);assert.equal(candidates[0].saved,true);
 assert.ok(brokerNextSteps(lead)[0].includes("OPD"));
 assert.ok(brokerNextSteps(lead)[1].includes("กรมธรรม์เดิม"));
});
test("broker candidates do not infer matches without facts or from negated needs, and retain quote-only choices",()=>{
 const lead=brokerLead();lead.summary.overview=undefined;lead.summary.interestedPlanIds=[];lead.summary.comparedPlanIds=[];
 assert.deepEqual(brokerCandidates(lead),[]);
 lead.summary.overview=buildAssistantOverview({...emptyCustomerFacts(),needs:[{text:"ไม่ต้องการ OPD",quote:"ไม่ต้องการ OPD"}]},[],[],"mock");
 assert.deepEqual(brokerCandidates(lead),[]);
 lead.summary.category="property";lead.summary.interestedPlanIds=["property-01"];lead.summary.budgetTHB=1;
 const quote=brokerCandidates(lead);assert.equal(quote.length,1);assert.equal(quote[0].plan.price.kind,"quote_only");assert.equal(quote[0].saved,false);
});

const {createBrokerDemoLeads,mergeBrokerDemoLeads,demoCustomerReply}=await import("../lib/broker-demo.ts");
const {brokerDecision}=await import("../lib/broker-brief.ts");
test("six broker fixtures merge once without overwriting existing customer or care history",()=>{
 const original=brokerLead();const seeded=mergeBrokerDemoLeads([original]);
 assert.equal(seeded.length,7);assert.equal(seeded[0],original);
 seeded[1].status="follow_up";seeded[1].notes="นัดติดตามเคสเดิม";
 const again=mergeBrokerDemoLeads(seeded);assert.equal(again.length,7);assert.equal(again[1].notes,"นัดติดตามเคสเดิม");
 const state=initialDemoState();state.leads=again;assert.ok(safeLoad(JSON.stringify(state)));
 for(const lead of seeded.slice(1)){
  const matches=brokerCandidates(lead);assert.ok(matches.length>=2&&matches.length<=3);
  assert.ok(lead.summary.overview!.customer.needs.every(f=>lead.transcript[0].content.includes(f.quote)));
 }
});
test("decision prompts retain sourced room limits and distinguish included versus optional OPD",()=>{
 const cases=createBrokerDemoLeads();const shortlist=brokerCandidates(cases[0]);
 assert.ok(!brokerNextSteps(cases[1])[1].includes("กรมธรรม์เดิม"));
 const basic=shortlist.find(c=>c.plan.id==="health-01")!;
 assert.ok(brokerDecision(basic).question.includes("2,500"));
 assert.ok(brokerDecision(shortlist.find(c=>c.plan.id==="health-02")!).trigger.includes("เบี้ยส่วนเพิ่ม"));
 const included=brokerCandidates(cases[1]).find(c=>c.plan.id==="health-03")!;
 assert.ok(!brokerDecision(included).trigger.includes("เบี้ยส่วนเพิ่ม"));
 assert.ok(brokerDecision(shortlist.find(c=>c.plan.id==="health-06")!).trigger.includes("ไม่ต้องการ OPD"));
});
test("broker chat persists independently per case and rejects invalid stored message roles",()=>{
 const state=initialDemoState();state.leads=createBrokerDemoLeads();const lead=state.leads[0];
 const summary=JSON.stringify(lead.summary);lead.status="contacting";
 const createdAt=new Date().toISOString();
 lead.brokerMessages=[{id:"b-1",role:"broker",content:"อยากเน้นผู้ป่วยในหรือ OPD ครับ",createdAt},{id:"c-1",role:"customer",content:demoCustomerReply(lead,"อยากเน้นผู้ป่วยในหรือ OPD ครับ"),createdAt}];
 const loaded=safeLoad(JSON.stringify(state))!;assert.equal(loaded.leads[0].brokerMessages?.length,2);
 assert.equal(loaded.leads[1].brokerMessages?.length,0);assert.deepEqual(loaded.leads[0].summary,JSON.parse(summary));
 assert.ok(lead.brokerMessages[1].content.includes("4,000"));
 assert.notEqual(demoCustomerReply(lead,"ถามต่อ"),demoCustomerReply(state.leads[1],"ถามต่อ"));
 const invalid=JSON.parse(JSON.stringify(state));invalid.leads[0].brokerMessages[0].role="assistant";assert.equal(safeLoad(JSON.stringify(invalid)),null);
});
test("category decision triggers respect missing motor facts, flood basis and annual travel limits",()=>{
 const cases=createBrokerDemoLeads();
 const motor=brokerCandidates(cases.find(l=>l.demoCaseId==="motor-renew")!);
 assert.ok(brokerDecision(motor.find(c=>c.plan.id==="motor-01")!).trigger.includes("ยังต้องขอทุนรถ"));
 assert.ok(brokerDecision(motor.find(c=>c.plan.id==="motor-07")!).question.includes("ชนยานพาหนะทางบก"));
 const property=brokerCandidates(cases.find(l=>l.demoCaseId==="home-flood")!);
 assert.ok(brokerDecision(property[0]).trigger.includes("รวมกลุ่มภัย"));
 const travel=brokerCandidates(cases.find(l=>l.demoCaseId==="travel-family")!);
 assert.ok(brokerDecision(travel.find(c=>c.plan.id==="travel-02")!).question.includes("หนึ่งปี"));
 assert.ok(brokerDecision(travel.find(c=>c.plan.id==="travel-01")!).trigger.includes("แพ็กเสริม"));
 const accident=brokerCandidates(cases.find(l=>l.demoCaseId==="daily-income")!);
 assert.ok(brokerDecision(accident.find(c=>c.plan.id==="accident-02")!).trigger.includes("ยังใช้เรื่องชดเชยรายวันตัดสินใจเลือกแผนนี้ไม่ได้"));
});
