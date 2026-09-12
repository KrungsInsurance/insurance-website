import { z } from "zod";
import { categories, chatCardsSchema, type ChatCard, priceSchema, coverageCellSchema, sourceEvidenceSchema } from "./types.ts";
import { categoryFields, getPlan } from "./catalog.ts";
import { arePlansCompatible, buildComparison } from "./compare.ts";
import { insuranceTerms } from "./insurance-terms.ts";
import { demoProfile, policies } from "./demo-seed.ts";
import type { CustomerProfile, CustomerSummary, Lead, Policy } from "./types.ts";

export type DemoSignals = { detailOpened: boolean; compareCompleted: boolean; budgetSet: boolean; interested: boolean };
export function interestScore(signals: DemoSignals) { return (signals.detailOpened ? 10 : 0) + (signals.compareCompleted ? 20 : 0) + (signals.budgetSet ? 20 : 0) + (signals.interested ? 50 : 0); }
export type DemoState = { version: 1; profile: CustomerProfile; policies: Policy[]; selection: string[]; comparedPlanIds: string[]; interestedPlanIds: string[]; messages: { role: "user" | "assistant"; content: string; mode?: "live" | "mock"; cards?: ChatCard[] }[]; leads: Lead[]; summary: CustomerSummary | null; signals: DemoSignals; offerSeen: boolean };
export const initialDemoState = (): DemoState => ({ version: 1, profile: { ...demoProfile }, policies: [...policies], selection: [], comparedPlanIds: [], interestedPlanIds: [], messages: [], leads: [], summary: null, signals: { detailOpened: false, compareCompleted: false, budgetSet: false, interested: false }, offerSeen: false });
const knownId=z.string().refine(id=>Boolean(getPlan(id)));
const selectionSchema=z.array(knownId).max(3).refine(ids=>new Set(ids).size===ids.length&&arePlansCompatible(ids.map(getPlan).filter(p=>p!==undefined)));
const historicalId=z.string().regex(/^(health|motor|life|accident|travel|property|liability)-[0-9]{2}$/);
const snapshotPlanSchema=z.object({id:historicalId,productId:z.string().optional(),tierLabel:z.string().nullable().optional(),edition:z.string().nullable().optional(),price:priceSchema.optional(),coverageCells:z.record(coverageCellSchema).optional(),sources:z.array(sourceEvidenceSchema).optional(),category:z.enum(categories),subtype:z.enum(["compulsory","voluntary","inbound","outbound","domestic"]).optional(),name:z.string().max(300),insurer:z.string().max(200),premiumTHB:z.number().finite().nonnegative().nullable(),premiumPeriod:z.enum(["year","trip","single"]),premiumNote:z.string().max(500).optional(),image:z.string().startsWith("/images/"),highlights:z.array(z.string()),eligibility:z.string(),exclusions:z.array(z.string()),coverage:z.record(z.union([z.string(),z.number().finite(),z.boolean(),z.null()])),source:z.object({kind:z.enum(["official","demo"]),label:z.string(),updatedAt:z.string(),url:z.string().url().refine(url=>new URL(url).protocol==="https:").optional()})}).refine(plan=>{
 if(!plan.price&&!plan.coverageCells&&!plan.sources)return true;
 if(!plan.price||!plan.coverageCells||!plan.sources)return false;
 const ids=new Set(plan.sources.map(source=>source.id));
 return ids.size===plan.sources.length&&plan.price.amountTHB===plan.premiumTHB&&plan.price.period===plan.premiumPeriod&&plan.price.sourceIds.every(id=>ids.has(id))&&Object.entries(plan.coverageCells).every(([key,cell])=>cell.sourceIds.every(id=>ids.has(id))&&plan.coverage[key]===(cell.status==="known"?cell.value:null));
});
function validStoredCard(card:ChatCard){
 if(card.type==="term")return Object.hasOwn(insuranceTerms,card.term);
 if(card.type==="question")return !/https?:|www\./i.test(card.prompt);
 const plans=card.planIds.map(getPlan);if(plans.some(p=>!p)||new Set(card.planIds).size!==card.planIds.length||new Set(plans.map(p=>p?.category)).size!==1)return false;
 if("fieldKeys" in card&&card.fieldKeys.some(key=>!categoryFields[plans[0]!.category].some(field=>field.key===key)))return false;
 if(card.type==="comparison"){try{buildComparison(card.category,card.planIds);}catch{return false;}}
 return card.type!=="handoff"||!/https?:|www\./i.test(card.reason);
}
const messagesSchema=z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().max(2000),mode:z.enum(["live","mock"]).optional(),cards:chatCardsSchema.catch([]).optional()}).transform(message=>({...message,cards:message.role==="assistant"?message.cards?.filter(validStoredCard):undefined}))).max(12);
// Historical descriptors survive catalog retirement; absent snapshots render unavailable.
const historicalMessagesSchema=z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().max(2000),mode:z.enum(["live","mock"]).optional(),cards:chatCardsSchema.catch([]).optional()}).transform(message=>({...message,cards:message.role==="assistant"?message.cards?.filter(card=>{
 if(card.type==="term")return /^[a-z_]{1,80}$/.test(card.term);
 if(card.type==="question")return !/https?:|www\./i.test(card.prompt);
 return new Set(card.planIds).size===card.planIds.length&&card.planIds.every(id=>historicalId.safeParse(id).success)&&(!("fieldKeys"in card)||card.fieldKeys.every(key=>/^[a-zA-Z][a-zA-Z0-9]{0,79}$/.test(key)))&&(card.type!=="handoff"||!/https?:|www\./i.test(card.reason));
}):undefined}))).max(12);
const summarySchema=z.object({category:z.enum(categories),budgetTHB:z.number().finite().nonnegative().nullable(),needs:z.array(z.string().max(200)).max(5),questions:z.array(z.string().max(200)).max(5),comparedPlanIds:z.array(historicalId).max(3),interestedPlanIds:z.array(historicalId).max(3),generatedAt:z.string().datetime({offset:true}),sourceMode:z.enum(["live","mock"]),editedByUser:z.boolean()});
const stateSchema=z.object({version:z.literal(1),profile:z.object({id:z.literal("demo-customer"),displayName:z.string().max(60),preferredCategory:z.enum(categories).nullable(),budgetTHB:z.number().finite().nonnegative().nullable(),goals:z.array(z.string().max(200)).max(5),contactWindow:z.enum(["morning","afternoon","evening"])}),selection:selectionSchema,comparedPlanIds:selectionSchema.optional(),interestedPlanIds:selectionSchema.optional(),messages:messagesSchema,policies:z.array(z.object({id:z.string(),planId:knownId,policyNumber:z.string(),startsOn:z.string(),renewsOn:z.string(),holder:z.string()})),leads:z.array(z.object({planFacts:z.array(snapshotPlanSchema).max(40).optional(),id:z.string(),customerId:z.literal("demo-customer"),displayName:z.string(),status:z.enum(["new","contacting","follow_up","closed"]),createdAt:z.string().datetime({offset:true}),updatedAt:z.string().datetime({offset:true}),consentAt:z.string().datetime({offset:true}),contactWindow:z.enum(["morning","afternoon","evening"]),summary:summarySchema,transcript:historicalMessagesSchema,interestScore:z.number().min(0).max(100),notes:z.string(),calls:z.array(z.object({id:z.string(),startedAt:z.string().datetime({offset:true}),endedAt:z.string().datetime({offset:true}).nullable(),outcome:z.enum(["interested","follow_up","not_interested"]).nullable(),note:z.string()})).refine(calls=>calls.filter(c=>!c.endedAt).length<=1)}).passthrough().refine(lead=>
  (lead.status!=="closed"||lead.calls.every(call=>call.endedAt!==null))&&
  (!lead.planFacts||new Set(lead.planFacts.map(p=>p.id)).size===lead.planFacts.length)&&
  lead.transcript.every(message=>message.cards?.every(card=>{if(!("planIds"in card))return true;const snapshots=card.planIds.map(id=>lead.planFacts?.find(p=>p.id===id)).filter(p=>p!==undefined);return new Set(snapshots.map(p=>p.category)).size<=1&&(card.type!=="comparison"||snapshots.every(p=>p.category===card.category));})??true)&&
  (lead.status!=="new"||lead.calls.length===0)&&
  lead.calls.every(call=>call.endedAt===null?lead.status==="contacting"&&call.outcome===null:call.outcome!==null&&call.note.trim().length>0&&Date.parse(call.endedAt)>=Date.parse(call.startedAt))
)),summary:summarySchema.nullable().optional(),signals:z.object({detailOpened:z.boolean(),compareCompleted:z.boolean(),budgetSet:z.boolean(),interested:z.boolean()}).optional(),offerSeen:z.boolean().optional()});
export function safeLoad(raw:string|null):DemoState|null{if(!raw)return null;try{const candidate=JSON.parse(raw);if(candidate&&typeof candidate==="object"){
 const retired=new Set(["life-05","property-02","property-03","property-04","property-05","liability-01","liability-02","liability-03","liability-04","liability-05"]);
 for(const key of ["selection","comparedPlanIds","interestedPlanIds"])if(Array.isArray(candidate[key]))candidate[key]=candidate[key].filter((id:unknown)=>!retired.has(String(id)));
 }const parsed=stateSchema.parse(candidate);return {...initialDemoState(),...parsed} as DemoState;}catch{return null;}}
export function makeSummary(state: DemoState, needs: string[] = [], questions: string[] = [], interestedPlanIds = state.interestedPlanIds): CustomerSummary | null { const category = state.profile.preferredCategory; if (!category) return null; return { category, budgetTHB: state.profile.budgetTHB, needs: [...needs], comparedPlanIds: state.comparedPlanIds.filter(id=>getPlan(id)?.category===category), interestedPlanIds: interestedPlanIds.filter(id=>getPlan(id)?.category===category), questions: [...questions], generatedAt: new Date().toISOString(), sourceMode: "mock", editedByUser: false }; }

export const STORAGE_KEY="insurance-demo-state";
export function chatRequestBody(history:DemoState["messages"],context:{category:CustomerProfile["preferredCategory"];selectedPlanIds:string[];budgetTHB:number|null;goals:string[]}):string{
 const messages=history.slice(-12).map(({role,content})=>({role,content})),encoder=new TextEncoder();
 while(messages.length){const body=JSON.stringify({messages,context});if(messages.reduce((sum,m)=>sum+m.content.length,0)<=12000&&encoder.encode(body).byteLength<=32768)return body;messages.shift();}
 throw new Error("ข้อความหรือข้อมูลประกอบยาวเกินไป กรุณาย่อข้อความแล้วส่งอีกครั้ง");
}
export function readDemoStorage(storage:Pick<Storage,"getItem">):{state:DemoState;warning:boolean}{
 try{const raw=storage.getItem(STORAGE_KEY),state=safeLoad(raw);return {state:state??initialDemoState(),warning:raw!==null&&state===null};}catch{return {state:initialDemoState(),warning:true};}
}
export function writeDemoStorage(storage:Pick<Storage,"setItem">,state:DemoState):boolean{
 try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}
}
export function clearDemoStorage(storage:Pick<Storage,"removeItem">):boolean{
 try{storage.removeItem(STORAGE_KEY);return true;}catch{return false;}
}
