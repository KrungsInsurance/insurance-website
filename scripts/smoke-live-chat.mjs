// Explicit real API smoke test. Uses synthetic customer data, never prints credentials.
import { readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { registerHooks } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const local=parseEnv(readFileSync(".env.local","utf8"));
for(const key of ["OPENAI_API_KEY","OPENAI_MODEL"])if(local[key])process.env[key]=local[key];
if(!process.env.OPENAI_API_KEY){console.log(JSON.stringify({blocked:"missing_api_key"}));process.exit(1);}
registerHooks({resolve(specifier,context,next){return next(specifier.startsWith("@/")?pathToFileURL(resolve(specifier.slice(2))+".ts").href:specifier,context);}});
const trace=[],nativeFetch=globalThis.fetch;
globalThis.fetch=async(...args)=>{const response=await nativeFetch(...args);if(String(args[0]).startsWith("https://api.openai.com/v1/responses")&&response.ok){const data=await response.clone().json();trace.push({status:data.status,output:data.output});writeFileSync("/tmp/live-chat-smoke-trace.json",JSON.stringify(trace,null,2));}return response;};
const customer=await import("../app/api/chat/route.ts"),broker=await import("../app/api/broker/chat/route.ts");
const server=process.argv.find(arg=>arg.startsWith("--url="))?.slice(6);
async function invoke(path,body){const started=Date.now();const request=new Request(`${server??"http://localhost"}${path}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});const response=server?await fetch(request):await(path==="/api/chat"?customer.POST(request):broker.POST(request));const data=await response.json();return {status:response.status,elapsedMs:Date.now()-started,data};}
const persona={nickname:"มะลิ",ageBand:"31-45",gender:"female",budgetBand:"10000-19999",category:"health",priorities:["opd"],journey:"ask"};
const messages=[{role:"user",content:"ชื่อเล่นของฉันคือ มะลิ อยู่ในช่วงอายุ 31–45 ปี ระบุเพศหญิง สนใจประกันสุขภาพ โดยสนใจ OPD ช่วงงบ 10,000–19,999 บาทต่อปี มีประกันสังคมอยู่แล้ว"}];
const prior=[
 ["ปกติไปพบแพทย์บ่อยแค่ไหน?","ประมาณเดือนละครั้ง"],
 ["ใช้โรงพยาบาลแบบไหนเป็นหลัก?","โรงพยาบาลเอกชนใกล้บ้าน"],
 ["มีเรื่องอะไรที่กังวลเป็นพิเศษ?","รายได้แต่ละเดือนไม่แน่นอน กลัวจ่ายเบี้ยต่อไม่ไหว"],
 ["อยากเน้นค่าใช้จ่ายแบบไหน?","ค่ารักษาแบบไม่ต้องนอนโรงพยาบาล"],
 ["อยากให้ช่วยเรื่องข้อมูลแบบไหน?","อยากเข้าใจศัพท์ก่อน ยังไม่ต้องแนะนำแผน"],
 ["มีประกันส่วนตัวอื่นไหม?","ยังไม่มีประกันส่วนตัว"],
 ["มีข้อจำกัดอื่นที่อยากบอกไหม?","ไม่อยากตั้งงบเป็นตัวเลขเดียว ขอใช้ช่วงที่บอกไว้ก่อน"],
];
for(const [question,answer] of prior)messages.push({role:"assistant",content:question},{role:"user",content:answer});
const report={model:process.env.OPENAI_MODEL,historyFixtureMessages:messages.length,checks:[]};
let facts,lastShownPlanIds;
const turns=[
 ["memory_correction","เรียกเราว่า มิน แทนมะลินะ ช่วยบอกชื่อเล่น ช่วงอายุ เพศ และช่วงงบที่เคยให้ไว้หน่อย"],
 ["plain_definition","เบี้ยประกันคืออะไร"],
 ["freeform_concern","เพราะเดือนบางเดือนได้เงินไม่เท่ากัน เลยกลัวว่าจะส่งต่อไม่ไหว ไม่ใช่กลัวเงินค่ารักษาวันนี้นะ"],
 ["budget_correction","ขอแก้ข้อมูล ตอนนี้ยอมจ่ายเบี้ยได้ไม่เกิน 15000 บาทต่อปี ช่วยจำงบใหม่นี้แทนช่วงเดิมด้วย"],
 ["recall_after_twenty","ตอนนี้เราใช้ชื่อเล่นว่าอะไร มีสิทธิเดิมอะไรอยู่แล้ว แล้วงบล่าสุดเท่าไร"],
 ["natural_products","งั้นเอามาสักสามตัวให้ดูหน่อย"],
 ["natural_compare","โอเค เทียบให้ที"],
];
const only=process.argv.find(arg=>arg.startsWith("--only="))?.slice(7);
for(const [name,text] of turns.filter(([name])=>!only||name===only)){messages.push({role:"user",content:text});const result=await invoke("/api/chat",{messages,context:{category:"health",selectedPlanIds:[],budgetTHB:null,goals:["OPD"],priorityKeys:["opdPerYear","opdPerVisit"],discoveryIntent:"ask",persona,...(lastShownPlanIds?{lastShownPlanIds}:{}),...(facts?{customerFacts:facts}:{})}});const check={name,requestMessages:messages.length,status:result.status,elapsedMs:result.elapsedMs,mode:result.data.mode,model:result.data.model,usage:result.data.usage,message:result.data.message,error:result.data.error,cards:result.data.cards};report.checks.push(check);console.log(JSON.stringify(check));if(result.status!==200)break;facts=result.data.overview.customer;lastShownPlanIds=result.data.cards?.find(card=>card.type==="plans"||card.type==="comparison")?.planIds??lastShownPlanIds;messages.push({role:"assistant",content:result.data.message});}
const b=await invoke("/api/broker/chat",{leadId:"smoke-synthetic",displayName:"มิน",summary:{category:"health",needs:["เข้าใจ OPD"],currentCoverage:["ประกันสังคม"],questions:["เบี้ยประกันคืออะไร"],budgetTHB:15000},transcript:messages,messages:[{role:"broker",content:"สวัสดีครับ ตอนนี้มีสิทธิอะไรอยู่แล้ว และกังวลเรื่องค่าใช้จ่ายตรงไหนครับ?"}]});
report.checks.push({name:"broker_simulated_customer",status:b.status,elapsedMs:b.elapsedMs,...b.data});console.log(JSON.stringify(report.checks.at(-1)));
writeFileSync("/tmp/live-chat-smoke-report.json",JSON.stringify(report,null,2));
if(report.checks.some(check=>check.status!==200))process.exitCode=1;
