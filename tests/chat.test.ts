import type { ChatCard } from "../lib/types.ts";
type CardReply={cards:ChatCard[];offerHandoff:boolean;summaryDraft:null;message:string};
import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Exercise the actual route without a server or real credentials.
registerHooks({resolve(specifier, context, next) {
 return next(specifier.startsWith("@/") ? pathToFileURL(resolve(specifier.slice(2)) + ".ts").href : specifier, context);
}});
const { POST } = await import("../app/api/chat/route.ts");
const { POST: comparePOST } = await import("../app/api/compare/route.ts");
const { getPlan } = await import("../lib/catalog.ts");
const context = {category:"health",selectedPlanIds:["health-01","health-02"],budgetTHB:20000,goals:[]};
const input = {messages:[{role:"user",content:"เปรียบเทียบแผนที่เลือก"}],context};
const request = (body:unknown = input, query = "") => new Request(`http://localhost/api/chat${query}`, {method:"POST",body:JSON.stringify(body)});
const validReply = {message:"วงเงินต่อโรคและต่อปีเป็นคนละฐาน",suggestedPlanIds:["health-01"],offerHandoff:false,summaryDraft:null};
const upstream = (reply:unknown = validReply) => Response.json({status:"completed",output:[{type:"message",content:[{type:"output_text",text:JSON.stringify(reply)}]}]});

const read = async (response:Response) => await response.json() as {mode:string;error:{code:string};comparison:{url:string}};
function configure(t: TestContext) {
 const old = {mode:process.env.CHAT_MODE,key:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL};
 process.env.CHAT_MODE="live";process.env.OPENAI_API_KEY="test-key-not-real";process.env.OPENAI_MODEL="test-model";
 t.after(()=>{for(const [key,value] of Object.entries({CHAT_MODE:old.mode,OPENAI_API_KEY:old.key,OPENAI_MODEL:old.model})) {if(value===undefined)delete process.env[key];else process.env[key]=value;}});
}

test("chat rejects invalid client input before calling upstream", async t => {
 configure(t); const fetch = t.mock.method(globalThis,"fetch",async()=>{throw new Error("upstream must not run");});
 const cases = [
  null, [], {}, {...input,messages:[]}, {...input,messages:Array(13).fill({role:"user",content:"a"})},
  ...["system","developer","tool"].map(role=>({...input,messages:[{role,content:"a"}]})),
  {...input,messages:[{role:"user",content:"x".repeat(2001)}]},
  {...input,messages:Array(7).fill({role:"user",content:"x".repeat(1800)})},
  {...input,messages:Array(6).fill({role:"user",content:"ก".repeat(1900)})},
  ...["abc","",-1].map(budgetTHB=>({...input,context:{...context,budgetTHB}})),
  {...input,context:{...context,category:"bogus"}},
  ...[["unknown"],["health-01","health-01"],["health-01","motor-01"],Array(4).fill("health-01")].map(selectedPlanIds=>({...input,context:{...context,selectedPlanIds}})),
  {...input,context:{...context,goals:Array(6).fill("a")}}, {...input,context:{...context,goals:["a".repeat(201)]}},
  {...input,model:"client-override"}, {...input,context:{...context,key:"client-key"}},
 ];
 for(const body of cases) { const response=await POST(request(body)); assert.equal(response.status,400,JSON.stringify(body).slice(0,100)); }
 assert.equal(fetch.mock.callCount(),0);
});

test("live without configuration returns 503 and explicit mock never calls OpenAI", async t => {
 configure(t);delete process.env.OPENAI_API_KEY;
 const fetch=t.mock.method(globalThis,"fetch",async()=>{throw new Error("upstream must not run");});
 assert.equal((await POST(request())).status,503);
 const result=await POST(request(input,"?mode=mock"));assert.equal(result.status,200);assert.equal((await read(result)).mode,"mock");
 assert.equal(fetch.mock.callCount(),0);
});

for (const [upstreamStatus, expected, code] of [[429,429,"RATE_LIMITED"],[401,502,"CHAT_UPSTREAM_ERROR"],[500,502,"CHAT_UPSTREAM_ERROR"]] as const) {
 test(`upstream ${upstreamStatus} is controlled and not retried`,async t=>{
  configure(t);const fetch=t.mock.method(globalThis,"fetch",async()=>new Response("upstream diagnostic must not leak",{status:upstreamStatus}));
  const response=await POST(request());assert.equal(response.status,expected);const body=await read(response);assert.equal(body.error.code,code);assert.ok(!JSON.stringify(body).includes("diagnostic"));assert.equal(fetch.mock.callCount(),1);
 });
}

test("20-second request deadline aborts upstream with 504",async t=>{
 configure(t);t.mock.timers.enable({apis:["setTimeout"]});
 let started:()=>void=()=>{};const ready=new Promise<void>(resolve=>{started=resolve;});
 t.mock.method(globalThis,"fetch",(_url:unknown,options:RequestInit)=>new Promise((_resolve,reject)=>{options.signal!.addEventListener("abort",()=>reject(new DOMException("Aborted","AbortError")));started();}));
 const pending=POST(request());await ready;t.mock.timers.tick(20000);const response=await pending;
 assert.equal(response.status,504);assert.equal((await read(response)).error.code,"CHAT_TIMEOUT");
});

test("refusal, incomplete output and malformed JSON become controlled 502", async t=>{
 configure(t);
 const values=[{status:"incomplete",output:[]},{status:"completed",output:[{type:"message",content:[{type:"refusal"}]}]},{status:"completed",output:[{type:"message",content:[{type:"output_text",text:"{"}]}]},{status:"completed",output:null},null];
 for(const value of values){const fetch=t.mock.method(globalThis,"fetch",async()=>Response.json(value));const response=await POST(request());assert.equal(response.status,502);fetch.mock.restore();}
});

test("invalid model fields, IDs and external URLs are rejected rather than filtered",async t=>{
 configure(t);
 for(const patch of [{message:""},{message:"x".repeat(2001)},{message:"https://example.com"},{message:"www.example.com"},{offerHandoff:"yes"},{summaryDraft:{}},{suggestedPlanIds:["missing"]},{suggestedPlanIds:["motor-01"]},{suggestedPlanIds:["health-01","health-01"]},{extra:true}]){
  const fetch=t.mock.method(globalThis,"fetch",async()=>upstream({...validReply,...patch}));assert.equal((await POST(request())).status,502,JSON.stringify(patch).slice(0,100));fetch.mock.restore();
 }
});

test("real tool dispatch reads shared comparison and trusted context",async t=>{
 configure(t);let count=0;let secondBody:Record<string,unknown>={};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  const body=JSON.parse(options.body as string);
  assert.equal(body.model,"test-model");assert.equal(body.store,false);
  if(count++===0){assert.ok(body.input[1].content.includes('"budgetTHB":20000'));return Response.json({status:"completed",output:[{type:"function_call",name:"compare_plans",arguments:JSON.stringify({category:"health",planIds:["health-01","health-02"]}),call_id:"call-1"}]});}
  secondBody=body;return upstream();
 });
 const response=await POST(request());assert.equal(response.status,200);const body=await read(response);assert.equal(body.comparison.url,"/compare?category=health&ids=health-01,health-02");
 const result=JSON.parse((secondBody.input as {type:string;output:string}[]).find(item=>item.type==="function_call_output")!.output);
 assert.equal(result.plans[0].coverageCells.annualLimit.value,2500000);assert.equal(result.plans[1].coverageCells.perDiseaseLimit.value,10000000);assert.equal(result.plans[1].coverageCells.annualLimit.value,null);assert.equal(count,2);
});

test("model cannot call tools indefinitely",async t=>{
 configure(t);let count=0;
 t.mock.method(globalThis,"fetch",async()=>{count++;return Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"health",maxPremium:20000}),call_id:`call-${count}`}]});});
 const response=await POST(request());assert.equal(response.status,502);assert.equal(count,3);
});


test("tool requests cannot silently change the current category",async t=>{
 configure(t);let count=0;let toolResult:{error?:string}={};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"compare_plans",arguments:JSON.stringify({category:"motor",planIds:["motor-01","motor-02"]}),call_id:"wrong-category"}]});
  const body=JSON.parse(options.body as string);toolResult=JSON.parse(body.input.find((item:{type:string})=>item.type==="function_call_output").output);return upstream();
 });
 const response=await POST(request());
 assert.equal(toolResult.error,"INVALID_TOOL_ARGUMENTS");assert.equal(response.status,502);
});

test("API, mock chat and live tool all reject compulsory versus voluntary comparison", async t => {
 configure(t);
 const selectedPlanIds = ["motor-01", "motor-05"];
 const api = await comparePOST(new Request("http://localhost/api/compare", {method:"POST",body:JSON.stringify({category:"motor",planIds:selectedPlanIds})}));
 assert.equal(api.status,400); assert.equal((await read(api)).error.code,"INCOMPATIBLE_PLANS");
 const body = {...input,context:{...context,category:"motor",selectedPlanIds}};
 assert.equal((await POST(request(body,"?mode=mock"))).status,400);
 let count=0;let toolResult:{error?:string}={};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"compare_plans",arguments:JSON.stringify({category:"motor",planIds:selectedPlanIds}),call_id:"incompatible"}]});
  const upstreamBody=JSON.parse(options.body as string);toolResult=JSON.parse(upstreamBody.input.find((item:{type:string})=>item.type==="function_call_output").output);
  return upstream({...validReply,suggestedPlanIds:[]});
 });
 const result=await POST(request(body));assert.equal(result.status,502);assert.equal(toolResult.error,"INVALID_TOOL_ARGUMENTS");
});

test("budget search retains selected quote-only facts without claiming a budget match",async t=>{
 configure(t);let count=0;let toolResult:{matches:{id:string}[];selectedOutsideFilter:{id:string;price:unknown}[]}={matches:[],selectedOutsideFilter:[]};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{
  if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"motor",maxPremium:600}),call_id:"budget"}]});
  const body=JSON.parse(options.body as string);toolResult=JSON.parse(body.input.find((item:{type:string})=>item.type==="function_call_output").output);return upstream({...validReply,suggestedPlanIds:[]});
 });
 const response=await POST(request({...input,context:{...context,category:"motor",selectedPlanIds:["motor-05"],budgetTHB:600}}));
 assert.equal(response.status,200);assert.deepEqual(toolResult.matches,[]);assert.equal(toolResult.selectedOutsideFilter[0].id,"motor-05");assert.deepEqual(toolResult.selectedOutsideFilter[0].price,getPlan("motor-05")!.price);assert.equal(count,2);
});

test("display tools return canonical descriptors and never accept model-injected cards",async t=>{
 configure(t);let count=0;
 t.mock.method(globalThis,"fetch",async()=>count++===0?Response.json({status:"completed",output:[{type:"function_call",name:"show_plan_details",arguments:JSON.stringify({planIds:["health-01"],fieldKeys:["annualLimit"]}),call_id:"details"}]}):upstream());
 const response=await POST(request());assert.equal(response.status,200);const body=await response.json() as CardReply;
 assert.deepEqual(body.cards,[{type:"plans",planIds:["health-01"],fieldKeys:["annualLimit"]}]);assert.ok(!JSON.stringify(body.cards).includes("2500000"));
});

test("invalid display fields, mixed IDs and invented card content cannot create cards",async t=>{
 configure(t);
 for(const args of [{planIds:["health-01"],fieldKeys:["fakeBenefit"]},{planIds:["health-01","motor-01"],fieldKeys:[]},{planIds:["health-01"],fieldKeys:[],premium:0},{planIds:["health-01","health-01"],fieldKeys:[]}]){
  let count=0;let toolResult:{error?:string}={};const f=t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"show_plan_details",arguments:JSON.stringify(args),call_id:"invalid"}]});toolResult=JSON.parse(JSON.parse(options.body as string).input.find((i:{type:string})=>i.type==="function_call_output").output);return upstream({...validReply,suggestedPlanIds:[]});});
  assert.equal((await POST(request())).status,502);assert.equal(toolResult.error,"INVALID_TOOL_ARGUMENTS");f.mock.restore();
 }
 const f=t.mock.method(globalThis,"fetch",async()=>upstream({...validReply,cards:[{type:"plans",planIds:["health-01"],fieldKeys:[]}]}));assert.equal((await POST(request())).status,502);f.mock.restore();
});

test("model handoff boolean alone cannot offer handoff; valid tool only offers descriptor",async t=>{
 configure(t);let count=0;
 const f=t.mock.method(globalThis,"fetch",async()=>count++===0?Response.json({status:"completed",output:[{type:"function_call",name:"ask_preferences",arguments:JSON.stringify({kind:"budget",category:"motor",prompt:"ต้องการเปลี่ยนหมวดไหม?"}),call_id:"question"}]}):upstream({...validReply,suggestedPlanIds:[],offerHandoff:true}));
 const body=await (await POST(request())).json() as CardReply;assert.equal(body.offerHandoff,false);assert.equal(body.cards[0].type,"question");assert.ok("category" in body.cards[0]);assert.equal(body.cards[0].category,"motor");f.mock.restore();
 count=0;t.mock.method(globalThis,"fetch",async()=>count++===0?Response.json({status:"completed",output:[{type:"function_call",name:"offer_specialist",arguments:JSON.stringify({planIds:["health-01"],reason:"ตรวจเงื่อนไข"}),call_id:"handoff"}]}):upstream());
 const handoff=await (await POST(request())).json() as CardReply;assert.equal(handoff.offerHandoff,true);assert.equal(handoff.cards[0].type,"handoff");assert.equal(handoff.summaryDraft,null);
});

test("mock onboarding, budget, details, comparison and handoff use validated cards",async()=>{
 const cases=[{category:null,ids:[],budget:null,text:"เริ่ม",type:"question"},{category:"health",ids:[],budget:null,text:"สุขภาพ",type:"question"},{category:"health",ids:["health-01"],budget:20000,text:"รายละเอียดแผนที่เลือก",type:"plans"},{category:"health",ids:["health-01","health-02"],budget:20000,text:"เปรียบเทียบ",type:"comparison"},{category:"health",ids:["health-01"],budget:20000,text:"คุยผู้เชี่ยวชาญ",type:"handoff"}];
 for(const c of cases){const response=await POST(request({messages:[{role:"user",content:c.text}],context:{category:c.category,selectedPlanIds:c.ids,budgetTHB:c.budget}},"?mode=mock"));assert.equal(response.status,200);const body=await response.json() as CardReply;assert.equal(body.cards[0].type,c.type);assert.ok(body.message.length<=500);}
});

test("stored card failures preserve unrelated state and client projection strips cards",async()=>{
 const {initialDemoState,safeLoad,chatRequestBody}=await import("../lib/demo-state.ts");
 const state=initialDemoState();state.profile.budgetTHB=12345;
 state.messages=[{role:"assistant",content:"ข้อมูล",cards:[{type:"plans",planIds:["health-01"],fieldKeys:["annualLimit"]}]},{role:"user",content:"ต่อ",cards:[{type:"question",kind:"budget",category:"health",prompt:"งบ?"}]}];
 const restored=safeLoad(JSON.stringify(state))!;assert.equal(restored.messages[0].cards?.[0].type,"plans");assert.equal(restored.messages[1].cards,undefined);
 state.messages[0].cards=[{type:"plans",planIds:["missing"],fieldKeys:[]}];assert.deepEqual(safeLoad(JSON.stringify(state))!.messages[0].cards,[]);
 const broken=JSON.parse(JSON.stringify(state));broken.messages[0].cards=[{type:"unknown"}];assert.equal(safeLoad(JSON.stringify(broken))!.profile.budgetTHB,12345);
 const wire=JSON.parse(chatRequestBody(restored.messages,{category:"health",selectedPlanIds:[],budgetTHB:null,goals:[]}));assert.ok(wire.messages.every((m:Record<string,unknown>)=>!("cards" in m)));
});

test("term tools use glossary allowlist and schemas bound cards and reply size",async t=>{
 configure(t);let count=0;let result:Record<string,unknown>={};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"explain_term",arguments:JSON.stringify({term:"copay"}),call_id:"term"}]});result=JSON.parse(JSON.parse(options.body as string).input.find((i:{type:string})=>i.type==="function_call_output").output);return upstream({...validReply,suggestedPlanIds:[]});});
 const response=await POST(request());assert.equal(response.status,200);const body=await response.json() as CardReply;assert.deepEqual(body.cards,[{type:"term",term:"copay"}]);
 const {insuranceTerms}=await import("../lib/insurance-terms.ts");assert.deepEqual(result.definition,insuranceTerms.copay);
 const {chatCardsSchema}=await import("../lib/types.ts");assert.equal(chatCardsSchema.safeParse(Array(5).fill({type:"term",term:"copay"})).success,false);
 assert.equal(chatCardsSchema.safeParse([{type:"question",kind:"budget",category:null,prompt:"x".repeat(141)}]).success,false);
});

test("mock named-plan intent takes precedence over glossary and never switches category silently",async()=>{
 for(const name of ["AXA SmartDrive1","AXA SmartDrive ชั้น 1"]){
  const req=(category:string)=>request({messages:[{role:"user",content:`อธิบาย ${name} ทรัพย์สินบุคคลภายนอกเท่าไร`}],context:{category,selectedPlanIds:[],budgetTHB:20000}},"?mode=mock");
  const wrong=await (await POST(req("health"))).json() as CardReply;assert.equal(wrong.cards[0].type,"question");assert.ok("category" in wrong.cards[0]);assert.equal(wrong.cards[0].category,"motor");
  const right=await (await POST(req("motor"))).json() as CardReply;assert.deepEqual(right.cards,[{type:"plans",planIds:["motor-01"],fieldKeys:["thirdPartyProperty"]}]);
 }
 const onboarding=await (await POST(request({messages:[{role:"user",content:"สนใจประกันสุขภาพ ช่วยเริ่มเลือกแผน ถามทีละข้อและให้เลือกตอบในแชต"}],context:{category:"health",selectedPlanIds:[],budgetTHB:20000}},"?mode=mock"))).json() as CardReply;assert.equal(onboarding.cards[0].type,"question");assert.ok("kind" in onboarding.cards[0]);assert.equal(onboarding.cards[0].kind,"budget");
});

test("lookup fallback delivers requested canonical field with consistent server text",async t=>{
 configure(t);let count=0;
 t.mock.method(globalThis,"fetch",async()=>count++===0?Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"motor",maxPremium:null}),call_id:"search"}]}):upstream({...validReply,message:"ยังแสดงการ์ดไม่ได้",suggestedPlanIds:["motor-01"]}));
 const result=await (await POST(request({messages:[{role:"user",content:"motor-01 ทรัพย์สินบุคคลภายนอกเท่าไร"}],context:{category:"motor",selectedPlanIds:["motor-01"],budgetTHB:null}}))).json() as CardReply;
 assert.deepEqual(result.cards,[{type:"plans",planIds:["motor-01"],fieldKeys:["thirdPartyProperty"]}]);assert.ok(!result.message.includes("ไม่ได้"));
});

test("explicit budget skip proceeds to mock plan cards across all seven categories",async()=>{
 const labels={health:"สุขภาพ",motor:"รถยนต์",life:"ชีวิต",accident:"อุบัติเหตุ",travel:"เดินทาง",property:"ทรัพย์สิน",liability:"ความรับผิด"};
 for(const [category,label] of Object.entries(labels)){
  const response=await POST(request({messages:[{role:"user",content:`ยังไม่กำหนดงบ ขอเริ่มดูแผนประกัน${label} พร้อมการ์ดความคุ้มครองและเงื่อนไข`}],context:{category,selectedPlanIds:[],budgetTHB:null}},"?mode=mock"));
  assert.equal(response.status,200);const body=await response.json() as CardReply;assert.equal(body.cards[0].type,"plans",category);assert.ok(body.cards.every(c=>c.type!=="question"||c.kind!=="budget"));
 }
});

test("Chat annual budget excludes trip premiums using optional shared search period",async t=>{
 configure(t);let count=0;let toolResult:{matches:{id:string}[];selectedOutsideFilter:{id:string}[];budgetBasis:{maxPremium:number|null;period:string|null}};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"travel",maxPremium:2000}),call_id:"annual-budget"}]});toolResult=JSON.parse(JSON.parse(options.body as string).input.find((i:{type:string})=>i.type==="function_call_output").output);return upstream({...validReply,suggestedPlanIds:[]});});
 const response=await POST(request({messages:[{role:"user",content:"งบอ้างอิง 2000 บาทต่อปี หาแผนเดินทาง"}],context:{category:"travel",selectedPlanIds:["travel-01"],budgetTHB:2000}}));
 assert.equal(response.status,200);assert.deepEqual(toolResult!.matches.map(p=>p.id),["travel-02"]);assert.deepEqual(toolResult!.selectedOutsideFilter.map(p=>p.id),["travel-01"]);assert.equal(toolResult!.budgetBasis.period,"year");
 const {searchPlans}=await import("../lib/catalog.ts");assert.ok(searchPlans({category:"travel",maxPremium:2000}).some(p=>p.id==="travel-01"));assert.deepEqual(searchPlans({category:"travel",maxPremium:2000,premiumPeriod:"year"}).map(p=>p.id),["travel-02"]);
});

test("explicit skip remains unbounded even if live model supplies zero budget",async t=>{
 configure(t);let count=0;let toolResult:{matches:{id:string}[];budgetBasis:{maxPremium:number|null;period:string|null}};
 t.mock.method(globalThis,"fetch",async(_url:unknown,options:RequestInit)=>{if(count++===0)return Response.json({status:"completed",output:[{type:"function_call",name:"search_plans",arguments:JSON.stringify({category:"travel",maxPremium:0}),call_id:"skip"}]});toolResult=JSON.parse(JSON.parse(options.body as string).input.find((i:{type:string})=>i.type==="function_call_output").output);return upstream({...validReply,suggestedPlanIds:[]});});
 assert.equal((await POST(request({messages:[{role:"user",content:"ยังไม่กำหนดงบ ขอเริ่มดูแผนประกันเดินทาง พร้อมการ์ด"}],context:{category:"travel",selectedPlanIds:[],budgetTHB:null}}))).status,200);assert.equal(toolResult!.budgetBasis.maxPremium,null);assert.equal(toolResult!.budgetBasis.period,null);assert.ok(toolResult!.matches.some(p=>p.id==="travel-01"));
});
