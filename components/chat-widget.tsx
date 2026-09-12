"use client";
import { MessageCircle, Send, X, Minus, Expand, Shrink, ArrowLeft, ArrowUpRight, HeartPulse, CarFront, Users, ShieldPlus, Plane, House, Handshake } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "./native-link";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { AlertDialog, Dialog } from "radix-ui";
import { useDemo } from "@/components/demo-provider";
import { arePlansCompatible, buildComparison } from "@/lib/compare";
import { getPlan } from "@/lib/catalog";
import { makeSummary, chatRequestBody } from "@/lib/demo-state";
import { categories, chatCardsSchema, type Category, type CustomerProfile, type Lead } from "@/lib/types";
import { assistantOverviewSchema } from "@/lib/assistant-overview";
import { AssistantOverviewView } from "./assistant-overview";
import { ChatCardView, categoryLabels as labels, type CardAction } from "./chat-cards";
import { BudgetChoices } from "./budget-choices";
import "./chat-workspace.css";
const responseSchema=z.object({message:z.string().min(1).max(500),mode:z.enum(["live","mock"]),cards:chatCardsSchema,overview:assistantOverviewSchema});
const draftSchema=z.object({input:z.string().max(2000),mode:z.enum(["live","mock"]),name:z.string().max(60),needs:z.string().max(1004),questions:z.string().max(1004),editedByUser:z.boolean().default(false)});
function readDraft(){try{return draftSchema.safeParse(JSON.parse(sessionStorage.getItem("insurance-chat-draft")??"null")).data;}catch{return undefined;}}
const categoryIcons={health:HeartPulse,motor:CarFront,life:Users,accident:ShieldPlus,travel:Plane,property:House,liability:Handshake};
const categoryDescriptions:Record<Category,string>={health:"ดูแลค่ารักษาพยาบาล",motor:"ดูแลรถและการเดินทาง",life:"วางแผนเพื่อคนข้างหลัง",accident:"เตรียมรับเหตุไม่คาดคิด",travel:"อุ่นใจกับทริปของคุณ",property:"ดูแลบ้านและทรัพย์สิน",liability:"ความรับผิดต่อผู้อื่น"};
export function ChatWidget(){const pathname=usePathname();return pathname==="/chat"?null:<ChatWorkspace/>;}
export function ChatWorkspace({fullPage=false}:{fullPage?:boolean}){
 const params=useSearchParams();
 const [draft]=useState(readDraft);
 const {state,setAssistantOverview,setSelection,setInterestedPlans,setProfile,appendMessages,addLead,saveSummary,recordSignal,recordComparison}=useDemo();
 const [open,setOpen]=useState(fullPage),[minimized,setMinimized]=useState(false),[expanded,setExpanded]=useState(true),[unread,setUnread]=useState(false);
 const [input,setInput]=useState(draft?.input??""),[busy,setBusy]=useState(false),[pendingText,setPendingText]=useState(""),[handoff,setHandoff]=useState(fullPage&&params.get("handoff")==="1"),[error,setError]=useState("");
 const [mode,setMode]=useState<"live"|"mock">(draft?.mode??"mock"),[lastMode,setLastMode]=useState<"live"|"mock"|null>(state.messages.filter(message=>message.role==="assistant").at(-1)?.mode??null);
 const [name,setName]=useState(draft?.name??state.profile.displayName),[needs,setNeeds]=useState(draft?.needs??""),[questions,setQuestions]=useState(draft?.questions??""),[consent,setConsent]=useState(false),[submitted,setSubmitted]=useState(""),[existingLead,setExistingLead]=useState(false);
 const [step,setStep]=useState<"category"|"budget"|null>(fullPage&&params.get("handoff")!=="1"&&(params.get("start")==="1"||!state.messages.length)?"category":null);
 const stepHeading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(step)stepHeading.current?.focus({preventScroll:true});else if(fullPage&&!handoff)composer.current?.focus({preventScroll:true});},[step,fullPage,handoff]);
 const [announcement,setAnnouncement]=useState(""),[onboarding,setOnboarding]=useState(false);
 const [confirmation,setConfirmation]=useState<{description:string;confirm:()=>void}|null>(null);
 const [summaryErrors,setSummaryErrors]=useState<Record<string,string>>({}),[editedByUser,setEditedByUser]=useState(draft?.editedByUser??false);
 useEffect(()=>{try{sessionStorage.setItem("insurance-chat-draft",JSON.stringify({input,mode,name,needs,questions,editedByUser}));}catch{}},[input,mode,name,needs,questions,editedByUser]);
 const launcher=useRef<HTMLButtonElement>(null),composer=useRef<HTMLInputElement>(null),actionTrigger=useRef<HTMLElement|null>(null),summaryPanel=useRef<HTMLDivElement>(null),scrollArea=useRef<HTMLDivElement>(null);
 const lock=useRef(false),bottom=useRef<HTMLDivElement>(null),lastReply=useRef<HTMLDivElement>(null),openRef=useRef(open);
 const contextRef=useRef(JSON.stringify([state.profile,state.selection]));
 useEffect(()=>{contextRef.current=JSON.stringify([state.profile,state.selection]);},[state.profile,state.selection]);
 useEffect(()=>{openRef.current=open;},[open]);

 useEffect(()=>{const fn=(event:Event)=>{const detail=(event as CustomEvent).detail;setOpen(true);setMinimized(false);setUnread(false);setOnboarding(Boolean(detail?.start));setHandoff(Boolean(detail?.handoff));setConsent(false);setSubmitted("");setSummaryErrors({});if(detail?.start){setError("");setInput("");}if(detail?.policyId){const policy=state.policies.find(p=>p.id===detail.policyId);if(policy)setInput(`ช่วยอธิบายแผน ${getPlan(policy.planId)?.name} สำหรับกรมธรรม์ตัวอย่าง ${policy.policyNumber} (เป็นข้อมูลเดโม ยังไม่มีข้อมูลเบี้ยกรมธรรม์จริง)`);}};window.addEventListener("insurance-chat",fn);return()=>window.removeEventListener("insurance-chat",fn);},[state.policies]);
 function reveal(target:HTMLElement|null){const area=scrollArea.current;if(area&&target)area.scrollTop+=target.getBoundingClientRect().top-area.getBoundingClientRect().top-12;}
 useEffect(()=>{reveal(!busy&&!onboarding?lastReply.current:bottom.current);},[state.messages,busy,onboarding,open]);
 useEffect(()=>{if(handoff&&open){reveal(summaryPanel.current);summaryPanel.current?.focus({preventScroll:true});}},[handoff,open]);
 function confirmReplacement(description:string,confirm:()=>void){actionTrigger.current=document.activeElement as HTMLElement;setConfirmation({description,confirm});}
 function chooseCategory(category:Category,confirmed=false){
  if(lock.current)return;
  if(!confirmed&&[...state.selection,...state.interestedPlanIds].some(id=>getPlan(id)?.category!==category)){confirmReplacement(`แผนที่เลือกและแผนที่สนใจจากหมวดเดิมจะถูกล้าง เพื่อเริ่มคุยเรื่องประกัน${labels[category]}`,()=>chooseCategory(category,true));return;}
  const profile={...state.profile,preferredCategory:category,budgetTHB:null},selection=state.selection.filter(id=>getPlan(id)?.category===category);
  setSelection(selection);setProfile(profile);contextRef.current=JSON.stringify([profile,selection]);setOnboarding(false);setHandoff(false);
  setStep(null);setError("");if(fullPage)window.history.replaceState(window.history.state,"","/chat");
  void send(`สนใจประกัน${labels[category]} ยังไม่กำหนดงบ ขอเริ่มดูแผนรวมแผนที่ต้องขอใบเสนอราคา พร้อมจุดเด่นและข้อจำกัดก่อน`,{profile,selection});
 }
 function chooseBudget(budgetTHB:number|null,category:Category|null){
  const profile={...state.profile,budgetTHB,preferredCategory:category??state.profile.preferredCategory};
  if([...state.selection,...state.interestedPlanIds].some(id=>getPlan(id)?.category!==profile.preferredCategory)){setError("หมวดเปลี่ยนแล้ว กรุณาตอบคำถามล่าสุดหรือเริ่มเลือกหมวดใหม่");return;}
  setProfile(profile);setEditedByUser(true);contextRef.current=JSON.stringify([profile,state.selection]);
  setStep(null);if(fullPage)window.history.replaceState(window.history.state,"","/chat");
  void send(budgetTHB===null?`ยังไม่กำหนดงบ ขอเริ่มดูแผนประกัน${profile.preferredCategory?labels[profile.preferredCategory]:""} พร้อมการ์ดความคุ้มครองและเงื่อนไข`:`งบอ้างอิงไม่เกิน ${budgetTHB.toLocaleString("th-TH")} บาทต่อปี ช่วยหาแผนพร้อมแสดงการ์ดและรอบเบี้ย`,{profile,selection:state.selection});
 }
 function cardAction(intent:Parameters<CardAction>[0],ids:string[],confirmed=false):string|void{
  if(lock.current)return "รอคำตอบก่อนเลือกขั้นตอนต่อไป";
  const plans=ids.map(getPlan);if(!plans.length||plans.some(p=>!p)||!arePlansCompatible(plans.filter(p=>p!==undefined)))return "แผนชุดนี้เปรียบเทียบร่วมกันไม่ได้";
  const category=plans[0]!.category;
  const crossCategory=[...state.selection,...state.interestedPlanIds].some(id=>getPlan(id)?.category!==category);
  const replacing= crossCategory || (intent==="select"&&!arePlansCompatible([...state.selection,...ids].map(getPlan).filter(p=>p!==undefined)));
  if(replacing&&!confirmed){confirmReplacement("แผนนี้อยู่คนละหมวดหรือรูปแบบความคุ้มครอง ต้องเริ่มชุดใหม่และล้างแผนที่เลือกเดิม",()=>{cardAction(intent,ids,true);});return;}
  const base=confirmed?[]:state.selection;
  const selection=intent==="select"?(base.includes(ids[0])?base.filter(id=>id!==ids[0]):[...base,ids[0]]):ids;
  if(selection.length>3)return "เลือกได้สูงสุด 3 แผน กรุณานำแผนเดิมออกก่อน";
  const profile={...state.profile,preferredCategory:category};
  if(confirmed)setInterestedPlans([]);
  setProfile(profile);setSelection(selection);contextRef.current=JSON.stringify([profile,selection]);setError("");
  if(intent==="compare"){
   try{buildComparison(category,ids);}catch{return "เลือกแผนหมวดและรูปแบบเดียวกัน 2–3 แผน";}
   recordComparison(ids);void send("เปรียบเทียบแผนที่เลือก พร้อมแสดงตารางในแชต",{profile,selection:ids});
  }
  if(intent==="interest"||intent==="handoff"){
   if(intent==="interest")setInterestedPlans(ids);
   setHandoff(true);setConsent(false);setSummaryErrors({});setSubmitted("");setEditedByUser(true);
  }
 }
 async function send(content=input,nextContext?:{profile:CustomerProfile;selection:string[]}){
  const text=content.trim();if(!text||lock.current)return;if(text.length>2000){setError("ข้อความยาวเกิน 2,000 ตัวอักษร");return;}
  const {profile,selection}=nextContext??state,sentContext=JSON.stringify([profile,selection]);lock.current=true;setBusy(true);setPendingText(text);setOnboarding(false);setError("");
  const messages=[...(nextContext?[]:state.messages),{role:"user" as const,content:text}];
  try{
   const response=await fetch(`/api/chat?mode=${mode}`,{method:"POST",headers:{"content-type":"application/json"},body:chatRequestBody(messages,{category:profile.preferredCategory,selectedPlanIds:selection,budgetTHB:profile.budgetTHB,goals:profile.goals,...(state.assistantOverview?{customerFacts:state.assistantOverview.customer}:{})})});
   const raw=await response.json();if(sentContext!==contextRef.current)throw new Error("ข้อมูลแผนเปลี่ยนแล้ว กรุณาส่งคำถามอีกครั้ง");if(!response.ok){const failure=z.object({error:z.object({message:z.string()})}).safeParse(raw);throw new Error(failure.success?failure.data.error.message:"ส่งข้อความไม่สำเร็จ");}
   const parsed=responseSchema.safeParse(raw);if(!parsed.success)throw new Error("รูปแบบคำตอบไม่ถูกต้อง กรุณาส่งใหม่");const data=parsed.data;
   setAssistantOverview(data.overview);
   if(!editedByUser){setNeeds(data.overview.customer.needs.map(f=>f.text).join("\n"));setQuestions(data.overview.customer.questions.map(f=>f.text).join("\n"));}
   const extractedBudget=data.overview.customer.budget;if(extractedBudget){setProfile({...profile,budgetTHB:extractedBudget.period==="year"?extractedBudget.amountTHB:null});}
   appendMessages([{role:"user",content:text,mode:data.mode},{role:"assistant",content:data.message,mode:data.mode,cards:data.cards}]);setInput("");setAnnouncement(`${data.message} มีการ์ด ${data.cards.length} ใบ`);setLastMode(data.mode);if(!openRef.current)setUnread(true);
  }catch(e){setError(e instanceof Error?e.message:"ส่งไม่สำเร็จ");setInput(text);}finally{lock.current=false;setBusy(false);setPendingText("");}
 }
 function submit(){setError("");const errors:Record<string,string>={};const needItems=needs.split("\n").map(s=>s.trim()).filter(Boolean),questionItems=questions.split("\n").map(s=>s.trim()).filter(Boolean);if(!name.trim())errors.name="กรอกชื่อสำหรับเดโม";if(!consent)errors.consent="ยืนยันความยินยอมก่อนส่ง";if(!state.interestedPlanIds.length)errors.plans="เลือกแผนที่สนใจอย่างน้อย 1 แผน";if(needItems.length>5||needItems.some(s=>s.length>200))errors.needs="ไม่เกิน 5 ข้อ ข้อละ 200 ตัวอักษร";if(questionItems.length>5||questionItems.some(s=>s.length>200))errors.questions="ไม่เกิน 5 ข้อ ข้อละ 200 ตัวอักษร";setSummaryErrors(errors);if(Object.keys(errors).length)return;const summary=makeSummary(state,needItems,questionItems);if(!summary){setError("เลือกหมวดและแผนก่อนส่ง");return;}const existing=state.leads.find(l=>l.summary.category===summary.category&&l.status!=="closed");if(existing){setExistingLead(true);setSubmitted(existing.id);setHandoff(false);return;}summary.sourceMode=state.assistantOverview?.sourceMode??lastMode??"mock";summary.editedByUser=editedByUser;const now=new Date().toISOString();const lead:Lead={id:crypto.randomUUID(),customerId:"demo-customer",displayName:name.trim(),status:"new",createdAt:now,updatedAt:now,consentAt:now,contactWindow:state.profile.contactWindow,summary:structuredClone(summary),transcript:structuredClone(state.messages),notes:"",calls:[],planFacts:[...new Set([...summary.comparedPlanIds,...summary.interestedPlanIds,...state.messages.flatMap(message=>(message.cards??[]).flatMap(card=>"planIds" in card?card.planIds:[]))])].map(getPlan).filter(plan=>plan!==undefined).map(plan=>structuredClone(plan))};recordSignal("interested");saveSummary(summary);addLead(lead);setExistingLead(false);setSubmitted(lead.id);setHandoff(false);setConsent(false);}


 const latestAssistant=state.messages.findLastIndex(message=>message.role==="assistant");
 const confirmationDialog=(<AlertDialog.Root open={confirmation!==null} onOpenChange={value=>{if(!value)setConfirmation(null);}}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/30"/><AlertDialog.Content onCloseAutoFocus={event=>{event.preventDefault();if(actionTrigger.current?.isConnected)actionTrigger.current.focus();else (stepHeading.current??composer.current)?.focus();}} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-xl font-semibold">เริ่มเลือกแผนชุดใหม่?</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">{confirmation?.description}</AlertDialog.Description><div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={()=>confirmation?.confirm()}>ยืนยันเปลี่ยน</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root>);
 const modeControl=<label className="chat-mode-control"><span className="sr-only">รูปแบบการสนทนา</span><select value={mode} onChange={event=>{setMode(event.target.value as typeof mode);setError("");}} disabled={busy}><option value="live">Live AI</option><option value="mock">บทสนทนาตัวอย่าง</option></select></label>;
 if(fullPage&&step)return <main className="chat-onboarding">
  <header className="chat-welcome-nav"><Link href="/" className="chat-home-link"><ArrowLeft size={18} aria-hidden="true"/>หน้าแรก</Link><span>Insurance</span>{modeControl}</header>
  <section className="chat-welcome-step" key={step} aria-labelledby="chat-step-title">
   <p className="chat-step-count">{step==="category"?"เริ่มจากสิ่งที่อยากดูแล":"ประกัน"+(state.profile.preferredCategory?labels[state.profile.preferredCategory]:"")}</p>
   <h1 id="chat-step-title" ref={stepHeading} tabIndex={-1}>{step==="category"?"สนใจประกันประเภทไหน?":"งบแบบไหนที่สบายใจ?"}</h1>
   <p className="chat-welcome-description">{step==="category"?"เลือกเรื่องที่สนใจ แล้วค่อย ๆ ดูแผนไปด้วยกัน":"เลือกงบอ้างอิงต่อปี หรือข้ามไปดูแผนก่อนได้"}</p>
   <div className="chat-welcome-answers">{step==="category"?<div className="chat-category-cards" role="group" aria-label="เลือกประเภทประกัน">{categories.map(category=>{const Icon=categoryIcons[category];return <button key={category} onClick={()=>chooseCategory(category)}><Icon size={34} strokeWidth={1.5} aria-hidden="true"/><strong>{labels[category]}</strong><span>{categoryDescriptions[category]}</span></button>;})}</div>:<BudgetChoices category={state.profile.preferredCategory} disabled={busy} onChoose={amount=>chooseBudget(amount,state.profile.preferredCategory)}/>}</div>
   {step==="budget"&&<button className="chat-step-back" onClick={()=>setStep("category")}><ArrowLeft size={18} aria-hidden="true"/>เปลี่ยนประเภทประกัน</button>}
   {state.messages.length>0&&<button className="chat-resume" onClick={()=>{setStep(null);window.history.replaceState(window.history.state,"","/chat");}}>กลับไปบทสนทนาเดิม</button>}
  </section><p className="chat-welcome-footnote">ข้อมูลจากบริษัทประกัน · ยังไม่มีการซื้อหรือส่งข้อมูลให้ผู้เชี่ยวชาญ</p>{confirmationDialog}
 </main>;
 const workspace=<>
  <header className="chat-header"><div className="chat-header-title">{fullPage&&<Link href="/" className="chat-home-link" aria-label="กลับหน้าแรก"><ArrowLeft size={22} aria-hidden="true"/></Link>}<div>{fullPage?<h1>ผู้ช่วยข้อมูลประกัน</h1>:<Dialog.Title>ผู้ช่วยข้อมูลประกัน</Dialog.Title>}{fullPage?<p>จับข้อมูล · เทียบความต่าง · ให้ผู้เชี่ยวชาญแนะนำ</p>:<Dialog.Description>{mode==="mock"?"บทสนทนาตัวอย่าง":"Live AI · ส่งข้อความไป OpenAI"}</Dialog.Description>}</div></div>
   <div className="chat-window-actions">{fullPage?<><Link href="/browse" className="chat-browse-link">ดูแผนทั้งหมด<ArrowUpRight size={16} aria-hidden="true"/></Link><button className="chat-restart" disabled={busy} onClick={()=>{setStep("category");setHandoff(false);setConsent(false);}}>เริ่มเลือกใหม่</button></>:<><Link href={handoff?"/chat?handoff=1":"/chat"} aria-label="เปิดแชตเต็มหน้า" title="เปิดแชตเต็มหน้า"><ArrowUpRight size={20}/></Link><button type="button" aria-label={expanded?"ใช้หน้าต่างแชตขนาดเล็ก":"ขยายหน้าต่างแชต"} onClick={()=>setExpanded(!expanded)}>{expanded?<Shrink size={18}/>:<Expand size={18}/>}</button><button type="button" aria-label="ย่อแชตไว้ด้านล่าง" onClick={()=>{setMinimized(true);setOpen(false);}}><Minus size={20}/></button><Dialog.Close asChild><button aria-label="ปิด AI Chat" onClick={()=>setMinimized(false)}><X size={20}/></button></Dialog.Close></>}</div>
  </header>
  <div className="chat-scroll" ref={scrollArea}><div className="chat-reading-column"><div className="chat-mode-line"><p>ใช้ข้อมูลตัวอย่าง · AI ไม่รับรองผลอนุมัติหรือเคลม</p>{modeControl}</div><p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
   {state.assistantOverview&&<details className="chat-analysis"><summary>ข้อมูลที่จับได้และความต่างสำหรับผู้เชี่ยวชาญ</summary><AssistantOverviewView overview={state.assistantOverview}/></details>}
   {fullPage&&state.profile.preferredCategory&&<div className="chat-context"><span>ประกัน{labels[state.profile.preferredCategory]}</span><span>{state.profile.budgetTHB===null?"ยังไม่กำหนดงบ":"งบอ้างอิง "+state.profile.budgetTHB.toLocaleString("th-TH")+" บาท/ปี"}</span></div>}
   <div className="chat-messages">{state.messages.map((message,i)=><div key={i} ref={i===latestAssistant?lastReply:undefined} className={"chat-message "+(message.role==="user"?"is-user":"is-assistant")}><p className={"chat-bubble "+(message.role==="user"?"is-user":"")}>{message.role==="assistant"&&<small>{message.mode==="live"?"Live AI":"บทสนทนาตัวอย่าง"}</small>}{message.content}</p>{message.role==="assistant"&&message.cards?.map((card,j)=><ChatCardView key={j} card={card} selection={state.selection} disabled={busy} current={i===latestAssistant&&!onboarding} onAction={cardAction} onCategory={chooseCategory} onBudget={chooseBudget}/>)}</div>)}
    {!fullPage&&(onboarding||state.messages.length===0)&&!busy&&<ChatCardView card={{type:"question",kind:"category",category:null,prompt:"อยากเริ่มจากประกันแบบไหน?"}} selection={state.selection} disabled={busy} current onAction={cardAction} onCategory={chooseCategory} onBudget={chooseBudget}/>} {pendingText&&<p className="chat-bubble is-user">{pendingText}</p>}{busy&&<div className="chat-answer-loading" role="status"><span>กำลังเลือกข้อมูลให้คุณ…</span><div aria-hidden="true"><i/><i/><i/></div></div>}<div ref={bottom}/></div>
    <div ref={summaryPanel} tabIndex={-1} className="chat-summary-anchor">{submitted&&<section className="p-4 bg-green-50 rounded-xl mt-4" role="status"><h3>{existingLead?"มีคำขอที่รอดำเนินการอยู่แล้ว":"ส่งคำขอแล้ว"}</h3><p className="text-sm">รอผู้เชี่ยวชาญรับเรื่อง · ข้อมูลตัวอย่าง</p><a href={`/broker/leads/${submitted}`} className="text-link">เปิดคำขอใน Broker ›</a><a href="/account" className="text-link block">ดูสถานะในบัญชี ›</a></section>}{handoff&&<section className="summary-preview">{state.assistantOverview&&<AssistantOverviewView overview={state.assistantOverview}/>}<h3 className="font-semibold">ตรวจสรุปก่อนส่ง</h3><p className="text-xs mt-2 text-[#6e6e73]">ข้อมูลจาก {lastMode === "live" ? "Live AI" : "ข้อมูลตัวอย่าง"}</p><p className="text-sm mt-2">หมวด {state.profile.preferredCategory?labels[state.profile.preferredCategory]:"ยังไม่เลือก"} · งบ {state.profile.budgetTHB?.toLocaleString("th-TH")??"ยังไม่ระบุ"} บาท</p><div className="my-3 text-sm"><h4 className="font-semibold">แผนที่เปรียบเทียบแล้ว</h4>{state.comparedPlanIds.filter(id=>getPlan(id)?.category===state.profile.preferredCategory).length?<ul>{state.comparedPlanIds.filter(id=>getPlan(id)?.category===state.profile.preferredCategory).map(id=><li key={id}>{getPlan(id)?.name}</li>)}</ul>:<p>ยังไม่ได้เปรียบเทียบ</p>}</div><fieldset className="my-4" aria-describedby={summaryErrors.plans?"summary-plans-error":undefined}><legend className="font-semibold text-sm">แผนที่สนใจให้ผู้เชี่ยวชาญติดต่อ *</legend>{[...new Set([...state.selection,...state.interestedPlanIds])].filter(id=>getPlan(id)?.category===state.profile.preferredCategory).map(id=><label key={id} className="flex items-center gap-3 min-h-11 text-sm"><input type="checkbox" checked={state.interestedPlanIds.includes(id)} onChange={e=>{setInterestedPlans(e.target.checked?[...state.interestedPlanIds,id]:state.interestedPlanIds.filter(p=>p!==id));setEditedByUser(true);}}/>{getPlan(id)?.name}</label>)}{summaryErrors.plans&&<p id="summary-plans-error" className="text-sm text-red-700" role="alert">{summaryErrors.plans}</p>}{!state.selection.length&&!state.interestedPlanIds.length&&<a href="/browse" className="text-link">เลือกแผนที่สนใจก่อน ›</a>}</fieldset><label>ชื่อสำหรับเดโม<input className="field" value={name} maxLength={60} aria-required="true" aria-invalid={Boolean(summaryErrors.name)} aria-describedby={summaryErrors.name?"summary-name-error":undefined} onChange={e=>{setName(e.target.value);setEditedByUser(true);}}/>{summaryErrors.name&&<span id="summary-name-error" className="text-sm text-red-700" role="alert">{summaryErrors.name}</span>}</label><label>สิ่งที่อยากให้ช่วย<textarea className="field" aria-label="สิ่งที่อยากให้ช่วย" value={needs} maxLength={1004} aria-invalid={Boolean(summaryErrors.needs)} aria-describedby="summary-needs-hint" onChange={e=>{setNeeds(e.target.value);setEditedByUser(true);}}/><span id="summary-needs-hint" className={summaryErrors.needs?"text-xs text-red-700":"text-xs text-[#6e6e73]"}>{summaryErrors.needs??"แยกบรรทัดละข้อ สูงสุด 5 ข้อ ข้อละ 200 ตัวอักษร"}</span></label><label>คำถามถึงผู้เชี่ยวชาญ<textarea className="field" aria-label="คำถามถึงผู้เชี่ยวชาญ" value={questions} maxLength={1004} aria-invalid={Boolean(summaryErrors.questions)} aria-describedby="summary-questions-hint" onChange={e=>{setQuestions(e.target.value);setEditedByUser(true);}}/><span id="summary-questions-hint" className={summaryErrors.questions?"text-xs text-red-700":"text-xs text-[#6e6e73]"}>{summaryErrors.questions??"แยกบรรทัดละข้อ สูงสุด 5 ข้อ ข้อละ 200 ตัวอักษร"}</span></label><label>ช่วงเวลาสะดวก<select className="field" value={state.profile.contactWindow} onChange={e=>{setProfile({...state.profile,contactWindow:e.target.value as typeof state.profile.contactWindow});setEditedByUser(true);}}><option value="morning">เช้า</option><option value="afternoon">บ่าย</option><option value="evening">เย็น</option></select></label><label className="flex gap-3 items-center min-h-11"><input type="checkbox" checked={consent} aria-required="true" aria-invalid={Boolean(summaryErrors.consent)} aria-describedby={summaryErrors.consent?"summary-consent-error":undefined} onChange={e=>setConsent(e.target.checked)}/>ยินยอมส่งข้อมูลตัวอย่างให้ผู้เชี่ยวชาญ</label>{summaryErrors.consent&&<p id="summary-consent-error" className="text-sm text-red-700" role="alert">{summaryErrors.consent}</p>}<div className="flex gap-2"><button className="action-primary" onClick={submit}>ยืนยันส่งคำขอ</button><button className="action-secondary" onClick={()=>{setHandoff(false);setConsent(false);setSummaryErrors({});}}>ยกเลิก</button></div></section>}</div>

  </div></div><footer className="chat-composer"><div className="chat-composer-inner">{error&&<p className="chat-card-error" role="alert">{error}</p>}<form onSubmit={event=>{event.preventDefault();void send();}}><input ref={composer} aria-label="ข้อความถึง AI" className="field" value={input} maxLength={2000} onChange={event=>setInput(event.target.value)} placeholder="อยากรู้อะไร ถามได้เลย" disabled={busy}/><button aria-label="ส่งข้อความ" className="action-primary" disabled={busy||!input.trim()}><Send size={20} aria-hidden="true"/></button></form><p>ข้อมูลจากบริษัทประกัน · ตรวจเงื่อนไขของแผนก่อนตัดสินใจ</p></div></footer>{confirmationDialog}
 </>;
 return fullPage?<main className="chat-workspace chat-full-page">{workspace}</main>:<Dialog.Root modal={false} open={open} onOpenChange={value=>{setOpen(value);if(value){setMinimized(false);setUnread(false);}}}>
  <Dialog.Trigger asChild><button ref={launcher} aria-label={minimized?"เปิดแชตที่ย่อไว้":"เปิด AI Chat"} className={"chat-launch "+(minimized?"chat-launch-minimized":"")}><MessageCircle size={22}/>{minimized&&<span>ผู้ช่วยเลือกประกัน<small>{busy?"กำลังหาคำตอบ…":unread?"มีคำตอบใหม่":"กลับมาคุยต่อ"}</small></span>}{unread&&<span className="chat-unread-dot"/>}</button></Dialog.Trigger>
  <Dialog.Portal><Dialog.Content className={"chat-panel chat-workspace "+(expanded?"chat-expanded":"chat-compact")} onInteractOutside={event=>event.preventDefault()} onOpenAutoFocus={event=>{event.preventDefault();composer.current?.focus({preventScroll:true});reveal(handoff?summaryPanel.current:!onboarding?lastReply.current:bottom.current);}}>{workspace}</Dialog.Content></Dialog.Portal>
 </Dialog.Root>;
}
