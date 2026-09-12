import type { Category } from "./types.ts";

/** Detail-page sections follow the questions specific to each kind of insurance. */
export const planSections: Record<Category, readonly { title: string; keys: readonly string[] }[]> = {
  health: [
    { title: "ค่ารักษา", keys: ["annualLimit", "perDiseaseLimit", "perAdmissionLimit", "opdPerYear", "opdPerVisit", "opdVisitsPerDay"] },
    { title: "ค่าห้อง", keys: ["roomPerDay", "roomMaxDays", "icuPerDay", "icuMaxDays", "roomBasis"] },
    { title: "ก่อนเริ่มคุ้มครอง", keys: ["waitingDays", "deductible", "copay"] },
    { title: "อายุและการสมัคร", keys: ["minEntryAge", "maxEntryAge", "renewalAge", "eligibilityConditions"] },
  ],
  motor: [
    { title: "รถของคุณ", keys: ["class", "ownDamageLimit", "collisionLimit", "theftLimit", "fireLimit", "floodLimit", "repairType"] },
    { title: "คนและคู่กรณี", keys: ["thirdPartyBodilyPerPerson", "thirdPartyBodilyPerEvent", "thirdPartyProperty", "voluntaryMedicalPerPerson", "medicalPerPerson"] },
    { title: "ค่าใช้จ่ายของคุณ", keys: ["deductible"] },
  ],
  life: [
    { title: "ความคุ้มครอง", keys: ["lifeType", "sumAssured", "coverageYears", "coverageUntilAge"] },
    { title: "เงินที่จะได้รับ", keys: ["deathFormula", "maturityFormula", "guaranteedCashback", "nonGuaranteedBenefit"] },
    { title: "การสมัครและจ่ายเบี้ย", keys: ["paymentYears", "paymentFrequency", "minEntryAge", "maxEntryAge"] },
  ],
  accident: [
    { title: "ค่ารักษาและชดเชย", keys: ["medicalPerAccident", "hospitalAdmissionBenefit", "dailyAllowance", "dailyMaxDays"] },
    { title: "เหตุที่คุ้มครอง", keys: ["deathBenefit", "disabilityBenefit", "motorcycleBenefit", "homicideBenefit", "publicAccidentBenefit"] },
    { title: "ผู้สมัคร", keys: ["minEntryAge", "maxEntryAge", "occupationClass"] },
  ],
  travel: [
    { title: "ทริปของคุณ", keys: ["region", "maxTripDays", "policyDuration"] },
    { title: "เจ็บป่วยและฉุกเฉิน", keys: ["medicalLimit", "evacuationLimit", "repatriationLimit"] },
    { title: "เมื่อทริปเปลี่ยน", keys: ["cancellationLimit", "interruptionLimit", "baggageLimit", "delayHours", "delayPayment", "delayLimit", "delayTrigger"] },
  ],
  property: [
    { title: "บ้านและทรัพย์สิน", keys: ["combinedPropertyLimit", "buildingLimit", "contentsLimit", "valuation"] },
    { title: "ภัยที่คุ้มครอง", keys: ["fireCoverage", "burglaryCoverage", "floodLimit", "sharedNaturalPerilsLimit", "includedPerils", "bundledLiability"] },
    { title: "บ้านที่รับประกัน", keys: ["occupancy", "construction", "locationRestrictions", "deductible"] },
  ],
  liability: [
    { title: "ความคุ้มครอง", keys: ["coveredActivity", "perOccurrenceLimit", "aggregateLimit"] },
    { title: "ขอบเขตและส่วนแรก", keys: ["territory", "deductible"] },
  ],
  pet: [
    { title: "สัตว์เลี้ยงของคุณ", keys: ["petType", "petEligibility"] },
    { title: "การรักษาและวงเงิน", keys: ["treatmentScope", "benefitLimit", "petLiability", "waitingPeriod"] },
  ],
  "critical-illness": [
    { title: "โรคและผลประโยชน์", keys: ["coveredConditions", "benefitType", "benefitLimit"] },
    { title: "ก่อนสมัคร", keys: ["waitingPeriod", "basePolicy", "eligibilityConditions"] },
  ],
  cyber: [
    { title: "ความเสี่ยงไซเบอร์", keys: ["coveredActivity", "responseCosts", "businessInterruption", "thirdPartyLiability"] },
    { title: "วงเงินและส่วนแรก", keys: ["benefitLimit", "deductible"] },
  ],
  business: [
    { title: "ธุรกิจของคุณ", keys: ["businessType", "coveredActivity", "territory"] },
    { title: "วงเงินและความรับผิด", keys: ["benefitLimit", "thirdPartyLiability", "deductible"] },
  ],
  event: [
    { title: "งานของคุณ", keys: ["eventType", "weddingEligibility"] },
    { title: "เมื่องานสะดุด", keys: ["cancellationScope", "lossOfProfit", "benefitLimit", "deductible"] },
  ],
  sports: [
    { title: "วงเงิน", keys: ["golfDeathBenefit", "golfMedicalPerAccident", "golfLiabilityPerOccurrence", "golfEquipmentPerOccurrence", "golfEquipmentAggregate"] },
    { title: "กีฬาของคุณ", keys: ["sportType", "territory"] },
    { title: "ความคุ้มครอง", keys: ["accidentScope", "equipmentScope", "thirdPartyLiability", "benefitLimit"] },
  ],
};
