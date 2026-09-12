import { z } from "zod";

export const categories = [
  "health",
  "motor",
  "life",
  "accident",
  "travel",
  "property",
  "liability",
] as const;

export type Category = (typeof categories)[number];
export type PremiumPeriod = "year" | "trip" | "single";
export type CoverageValue = string | number | boolean | null;
export type Price = {
  kind: "fixed" | "example" | "starting" | "quote_only";
  amountTHB: number | null;
  period: PremiumPeriod;
  scenario: string | null;
  includes: string | null;
  sourceIds: string[];
};
export type CoverageCell = {
  status: "known" | "unknown" | "not_covered" | "not_applicable" | "conflicting";
  value: CoverageValue;
  unit: string | null;
  basis: string | null;
  inclusion: "included" | "optional" | "unknown";
  conditions: string[];
  sourceIds: string[];
};
export type SourceEvidence = {
  id: string; url: string; publisher: string; title: string; locator: string;
  publishedAt: string | null; effectiveAt: string | null; checkedAt: string;
};
export type ComparisonStatus = "same" | "different" | "not_comparable" | "insufficient";
const amountSchema=z.number().finite().nonnegative().refine(n=>Math.abs(n*100-Math.round(n*100))<1e-6,"Amounts allow at most two decimal places");
export const priceSchema=z.object({kind:z.enum(["fixed","example","starting","quote_only"]),amountTHB:amountSchema.nullable(),period:z.enum(["year","trip","single"]),scenario:z.string().nullable(),includes:z.string().nullable(),sourceIds:z.array(z.string().min(1)).min(1)}).strict().refine(p=>p.kind==="quote_only"?p.amountTHB===null:p.amountTHB!==null,"Only quote_only prices have no numeric amount");
export const coverageCellSchema=z.object({status:z.enum(["known","unknown","not_covered","not_applicable","conflicting"]),value:z.union([z.number().finite().nonnegative(),z.string(),z.boolean()]).nullable(),unit:z.string().nullable(),basis:z.string().nullable(),inclusion:z.enum(["included","optional","unknown"]),conditions:z.array(z.string()),sourceIds:z.array(z.string().min(1))}).strict().superRefine((cell,ctx)=>{
  if(cell.status==="known"&&(cell.value===null||!cell.basis||!cell.sourceIds.length))ctx.addIssue({code:z.ZodIssueCode.custom,message:"Known cells require value, basis and evidence"});
  if(cell.status!=="known"&&cell.value!==null)ctx.addIssue({code:z.ZodIssueCode.custom,message:"Non-known cells cannot expose numeric facts"});
  if(["not_covered","not_applicable","conflicting"].includes(cell.status)&&!cell.sourceIds.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:"Absence and conflicts need evidence"});
});
const evidenceDate=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const sourceEvidenceSchema=z.object({id:z.string().min(1),url:z.string().url().refine(url=>url.startsWith("https://")),publisher:z.string().min(1),title:z.string().min(1),locator:z.string().min(1),publishedAt:evidenceDate.nullable(),effectiveAt:evidenceDate.nullable(),checkedAt:evidenceDate}).strict();

export type Plan = {
  id: string;
  category: Category;
  subtype?: "compulsory" | "voluntary" | "inbound" | "outbound" | "domestic";
  productId: string;
  tierLabel: string | null;
  edition: string | null;
  price: Price;
  coverageCells: Record<string, CoverageCell>;
  sources: SourceEvidence[];
  name: string;
  insurer: string;
  premiumTHB: number | null;
  premiumNote?: string;
  premiumPeriod: PremiumPeriod;
  image: string;
  highlights: string[];
  eligibility: string;
  exclusions: string[];
  coverage: Record<string, CoverageValue>;
  source: { kind: "official" | "demo"; label: string; updatedAt: string; url?: string };
};

export const chatCardSchema=z.discriminatedUnion("type",[
 z.object({type:z.literal("plans"),planIds:z.array(z.string().min(1)).min(1).max(3),fieldKeys:z.array(z.string().min(1)).max(8)}).strict(),
 z.object({type:z.literal("comparison"),category:z.enum(categories),planIds:z.array(z.string().min(1)).min(2).max(3),fieldKeys:z.array(z.string().min(1)).max(8)}).strict(),
 z.object({type:z.literal("question"),kind:z.enum(["category","budget"]),category:z.enum(categories).nullable(),prompt:z.string().min(1).max(140)}).strict(),
 z.object({type:z.literal("handoff"),planIds:z.array(z.string().min(1)).min(1).max(3),reason:z.string().min(1).max(180)}).strict(),
 z.object({type:z.literal("term"),term:z.string().min(1).max(80)}).strict(),
]);
export const chatCardsSchema=z.array(chatCardSchema).max(4);
export type ChatCard=z.infer<typeof chatCardSchema>;
export type Field = { key: string; label: string; unit: string | null };

export type Policy = {
  id: string;
  planId: string;
  policyNumber: string;
  startsOn: string;
  renewsOn: string;
  holder: string;
};

export type CustomerProfile = {
  id: "demo-customer";
  displayName: string;
  preferredCategory: Category | null;
  budgetTHB: number | null;
  goals: string[];
  contactWindow: "morning" | "afternoon" | "evening";
};

export type PlanSort = "price-asc" | "price-desc" | "name";

export type CustomerSummary = {
  overview?: import("./assistant-overview").AssistantOverview;
  currentCoverage?: string[];
  category: Category;
  budgetTHB: number | null;
  needs: string[];
  comparedPlanIds: string[];
  interestedPlanIds: string[];
  questions: string[];
  generatedAt: string;
  sourceMode: "mock" | "live";
  editedByUser: boolean;
};

export type LeadStatus = "new" | "contacting" | "follow_up" | "closed";
export type LeadCall = { id: string; startedAt: string; endedAt: string | null; outcome: "interested" | "follow_up" | "not_interested" | null; note: string };
export type Lead = { planFacts?: Plan[]; id: string; customerId: "demo-customer"; displayName: string; status: LeadStatus; createdAt: string; updatedAt: string; consentAt: string; contactWindow: CustomerProfile["contactWindow"]; summary: CustomerSummary; transcript: { role: "user" | "assistant"; content: string; mode?: "live" | "mock"; cards?: ChatCard[] }[]; interestScore?: number; notes: string; calls: LeadCall[] };

