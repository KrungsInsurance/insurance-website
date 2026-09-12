import { existsSync } from "node:fs";
import { join } from "node:path";
import { categoryFields, catalog } from "./catalog.ts";
import { categories, coverageCellSchema, priceSchema, sourceEvidenceSchema, type Plan, type Policy } from "./types.ts";

const numericFields = new Set([
  "combinedPropertyLimit", "voluntaryMedicalPerPerson", "hospitalAdmissionBenefit",
  "annualLimit", "perDiseaseLimit", "perAdmissionLimit", "roomPerDay", "opdPerYear", "deductible", "waitingDays",
  "ownDamageLimit", "thirdPartyProperty", "medicalPerPerson", "sumAssured", "coverageYears", "coverageUntilAge", "paymentYears",
  "minEntryAge", "maxEntryAge", "deathBenefit", "medicalPerAccident", "disabilityBenefit",
  "medicalLimit", "cancellationLimit", "baggageLimit", "maxTripDays", "buildingLimit",
  "contentsLimit", "sharedNaturalPerilsLimit", "perOccurrenceLimit", "aggregateLimit",
  "icuPerDay", "icuMaxDays", "roomMaxDays", "opdPerVisit", "opdVisitsPerDay", "renewalAge",
  "motorcycleBenefit", "homicideBenefit", "publicAccidentBenefit", "dailyAllowance", "dailyMaxDays",
  "collisionLimit", "theftLimit", "fireLimit", "floodLimit", "thirdPartyBodilyPerPerson", "thirdPartyBodilyPerEvent",
  "policyDuration", "evacuationLimit", "repatriationLimit", "interruptionLimit", "delayHours", "delayPayment", "delayLimit",
]);

export function validateCatalog(plans: readonly Plan[] = catalog): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const plan of plans) {
    if (ids.has(plan.id)) errors.push(`duplicate id: ${plan.id}`);
    ids.add(plan.id);
    if (!categories.includes(plan.category)) errors.push(`unknown category: ${plan.id}`);
    if (!new RegExp("^" + plan.category + "-(0[1-9]|[1-9][0-9])$").test(plan.id)) errors.push(`invalid id: ${plan.id}`);
    const validPeriods = plan.category === "travel" ? new Set(["trip", "year"]) : new Set(["year", "single"]);
    if (!validPeriods.has(plan.premiumPeriod)) errors.push(`period mismatch: ${plan.id}`);
    if (plan.premiumTHB !== null && (!Number.isFinite(plan.premiumTHB) || plan.premiumTHB < 0)) errors.push(`invalid premium: ${plan.id}`);
    if(!priceSchema.safeParse(plan.price).success)errors.push(`invalid canonical price: ${plan.id}`);
    if(!plan.productId||plan.sources.some(source=>!sourceEvidenceSchema.safeParse(source).success))errors.push(`invalid source evidence: ${plan.id}`);
    const sourceIds=new Set(plan.sources.map(source=>source.id));
    if(sourceIds.size!==plan.sources.length||plan.price.sourceIds.some(id=>!sourceIds.has(id)))errors.push(`invalid price source reference: ${plan.id}`);
    if(plan.premiumTHB!==plan.price.amountTHB||plan.premiumPeriod!==plan.price.period)errors.push(`price projection mismatch: ${plan.id}`);
    if (!plan.image.startsWith("/") || !existsSync(join(process.cwd(), "public", plan.image.slice(1)))) {
      errors.push(`missing local image: ${plan.id}`);
    }
    const expectedKeys = categoryFields[plan.category].map((field) => field.key);
    const actualKeys = Object.keys(plan.coverage).sort();
    if (actualKeys.join("|") !== [...expectedKeys].sort().join("|")) errors.push(`coverage keys mismatch: ${plan.id}`);
    if(Object.keys(plan.coverageCells).sort().join("|")!==[...expectedKeys].sort().join("|"))errors.push(`cell keys mismatch: ${plan.id}`);
    for (const field of categoryFields[plan.category]) {
      const value = plan.coverage[field.key];
      const cell=plan.coverageCells[field.key];
      if(!coverageCellSchema.safeParse(cell).success||cell?.sourceIds.some(id=>!sourceIds.has(id)))errors.push(`invalid coverage cell: ${plan.id}.${field.key}`);
      if(cell&&value!==(cell.status==="known"?cell.value:null))errors.push(`coverage projection mismatch: ${plan.id}.${field.key}`);
      if (!(field.key in plan.coverage)) continue;
      if (value === null) continue;
      if (numericFields.has(field.key) && (!Number.isFinite(value) || typeof value !== "number")) errors.push(`coverage type: ${plan.id}.${field.key}`);
      if (!numericFields.has(field.key) && typeof value !== "string") errors.push(`coverage type: ${plan.id}.${field.key}`);
    }
  }
  return errors;
}

export function assertValidCatalog(plans: readonly Plan[] = catalog): void {
  const errors = validateCatalog(plans);
  if (errors.length) throw new Error(errors.join("; "));
}

export function validatePolicies(policies: readonly Policy[], plans: readonly Plan[] = catalog): string[] {
  const errors: string[] = [];
  const planIds = new Set(plans.map((plan) => plan.id));
  const ids = new Set<string>();
  for (const policy of policies) {
    if (ids.has(policy.id)) errors.push(`duplicate policy id: ${policy.id}`);
    ids.add(policy.id);
    if (!planIds.has(policy.planId)) errors.push(`unknown policy plan: ${policy.planId}`);
    if (policy.startsOn >= policy.renewsOn) errors.push(`invalid policy dates: ${policy.id}`);
  }
  return errors;
}
