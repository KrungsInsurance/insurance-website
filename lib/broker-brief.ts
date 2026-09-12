import { catalog, categoryFields } from "./catalog.ts";
import { arePlansCompatible } from "./compare.ts";
import { formatCoverageCell } from "./display.ts";
import type { Lead, Plan } from "./types.ts";

// Broker review candidates, never customer advice or an inferred purchase score.
// Keep saved facts for historical plans; label new catalog candidates separately.
export function brokerCandidates(lead: Lead, plans: readonly Plan[] = catalog) {
  const customer = lead.summary.overview?.customer;
  const facts = [...(customer?.needs ?? []), ...(customer?.concerns ?? []), ...(customer?.questions ?? [])];
  const topics = [
    { pattern: /ค่าห้อง|room/i, keys: ["roomPerDay", "roomBasis"] },
    { pattern: /OPD|ผู้ป่วยนอก/i, keys: ["opdPerYear", "opdPerVisit"] },
    { pattern: /น้ำท่วม/i, keys: ["floodLimit", "naturalDisasterLimit"] },
    { pattern: /ไฟไหม้/i, keys: ["fireLimit", "fireCoverage"] },
    { pattern: /สูญหาย|โจรกรรม/i, keys: ["theftLimit"] },
    { pattern: /ชดเชยรายวัน/i, keys: ["dailyAllowance"] },
    { pattern: /ส่วนแรก|deductible/i, keys: ["deductible"] },
    { pattern: /รถชน/i, keys: ["collisionLimit"] },
    { pattern: /ค่ารักษา/i, keys: ["medicalPerAccident", "medicalLimit"] },
    { pattern: /เที่ยวบินล่าช้า/i, keys: ["delayHours", "delayTrigger"] },
    { pattern: /สุนัข|แมว|สัตว์เลี้ยง/, keys: ["petType", "treatmentScope"] },
    { pattern: /มะเร็ง|โรคร้ายแรง/, keys: ["coveredConditions", "benefitType"] },
    { pattern: /ไซเบอร์|แฮ็ก|ข้อมูลรั่ว/, keys: ["coveredActivity", "responseCosts"] },
    { pattern: /แต่งงาน|จัดงาน|อีเวนต์|ยกเลิกงาน/, keys: ["eventType", "cancellationScope", "weddingEligibility"] },
    { pattern: /กอล์ฟ|อุปกรณ์กีฬา/, keys: ["sportType", "equipmentScope"] },
  ].flatMap(topic => {
    const fact = facts.find(f => topic.pattern.test(f.quote) && !/ไม่ต้องการ|ไม่สนใจ|ไม่เอา|ไม่จำเป็น|ไม่อยาก|ไม่กังวล/.test(f.quote));
    return fact ? [{ ...topic, quote: fact.quote }] : [];
  });
  const chosen = [...new Set([...lead.summary.interestedPlanIds, ...lead.summary.comparedPlanIds])];
  const saved = lead.planFacts ?? [];
  const available = [...saved, ...plans.filter(p => !saved.some(s => s.id === p.id))].filter(p => p.category === lead.summary.category);
  const explicitPlans = chosen.flatMap(id => available.find(p => p.id === id) ?? []);
  return [...explicitPlans, ...available.filter(p => !chosen.includes(p.id))].flatMap(plan => {
    const evidence = topics.flatMap(topic => {
      const key = topic.keys.find(key => {
        const cell = plan.coverageCells?.[key];
        return cell?.status === "known" && cell.sourceIds.length > 0 && cell.value !== false && cell.value !== null;
      });
      if (!key) return [];
      const cell = plan.coverageCells[key];
      const label=categoryFields[plan.category].find(f=>f.key===key)?.label??key;
      return [{ key, quote: topic.quote, text: `${label}: ${formatCoverageCell(cell)}`, briefText: key==="delayTrigger"?`${label}: เฉพาะสาเหตุที่ระบุในกรมธรรม์${cell.inclusion==="optional"?" · ต้องเลือกแพ็กเสริม":""}`:`${label}: ${formatCoverageCell({...cell,conditions:[]})}`, sourceIds: cell.sourceIds }];
    }).slice(0, 2);
    const selected = lead.summary.interestedPlanIds.includes(plan.id);
    const compared = lead.summary.comparedPlanIds.includes(plan.id);
    if (!selected && !compared && !evidence.length) return [];
    // Match the same coverage purpose, including specialist product groups.
    if (explicitPlans.length && !explicitPlans.some(p => arePlansCompatible([p, plan]))) return [];
    const checks = topics.filter(topic => !evidence.some(item => topic.keys.includes(item.key))).map(topic => {
      const field = categoryFields[plan.category].find(f => topic.keys.includes(f.key));
      const cell = field && plan.coverageCells?.[field.key];
      return `${field?.label ?? "หัวข้อที่ลูกค้าถาม"}: ${cell ? formatCoverageCell(cell) : "ยังไม่มีข้อมูลยืนยัน"}`;
    });
    return [{ plan, evidence, checks, saved: saved.some(p => p.id === plan.id), reason: selected ? "ลูกค้าเลือกว่าสนใจ" : compared ? "ลูกค้าเคยนำมาเปรียบเทียบ" : "มีข้อมูลความคุ้มครองในประเด็นที่ลูกค้าพูดถึง" }];
  }).slice(0, 3);
}

export function brokerNextSteps(lead: Lead) {
  const facts = lead.summary.overview?.customer;
  const questions = lead.summary.questions;
  const concern = facts?.concerns[0]?.text;
  const hasExistingPolicy=facts?.currentCoverage.some(f=>! /ไม่มี|ยังไม่ได้ซื้อ|ยังไม่ได้ทำ/.test(f.text));
  return [
    questions.length ? `เริ่มตอบคำถาม: ${questions[0]}` : concern ? `เริ่มคุยเรื่อง ${concern} และถามผลลัพธ์ที่ลูกค้าอยากได้` : `ถามเป้าหมายและความกังวลหลักให้ชัดก่อนเลือกแผน`,
    hasExistingPolicy ? "ตรวจวงเงินและเงื่อนไขกรมธรรม์เดิม เพื่อคุยเรื่องส่วนที่ลูกค้าอยากเพิ่ม" : "ยืนยันวงเงินที่ต้องการ สิทธิรักษาที่มี และเงื่อนไขผู้สมัครที่เกี่ยวข้อง",
    "เทียบตัวเลือกด้านล่างกับความต้องการจริง แล้วตกลงแผนที่จะขอรายละเอียดหรือใบเสนอราคา",
  ];
}

export function brokerDecision(candidate: ReturnType<typeof brokerCandidates>[number]) {
  const { plan, evidence } = candidate;
  const cells = plan.coverageCells ?? {};
  const room = cells.roomPerDay;
  const opd = cells.opdPerYear;
  if (plan.category === "health" && evidence.some(e => /opd/i.test(e.key))) {
    return { trigger: opd?.inclusion === "optional" ? "พิจารณาต่อเมื่ออยากได้ OPD เพิ่ม และรับเบี้ยส่วนเพิ่มได้ โดยยืนยันวงเงินและตัวเลือกก่อน" : "พิจารณาต่อเมื่อต้องการทั้ง IPD และ OPD และวงเงินต่อครั้ง/ต่อปีตรงกับการใช้งานที่ลูกค้ายืนยัน", question: "ปกติพบแพทย์แบบไม่นอนโรงพยาบาลบ่อยแค่ไหน และมีสิทธิเดิมช่วยจ่ายเท่าไร อยากเพิ่ม OPD หรือเน้นผู้ป่วยในก่อนครับ?" };
  }
  if (plan.category === "health" && room?.status === "known") {
    return { trigger: `พิจารณาต่อเมื่อค่าห้องที่ต้องการอยู่ในวงเงิน ${formatCoverageCell(room)}${opd?.status === "not_covered" ? " และลูกค้ายืนยันว่าไม่ต้องการ OPD ทั่วไปในแผนนี้" : " โดยตรวจสิทธิเดิมและ OPD แยกก่อน"}`, question: `โรงพยาบาลที่ใช้มีค่าห้องต่อวันประมาณเท่าไร และประกันเดิมจ่ายได้เท่าไรครับ วงเงิน ${formatCoverageCell(room)} เพียงพอกับส่วนที่อยากเพิ่มไหม?` };
  }
  if (plan.category === "property" && cells.floodLimit?.status === "known") return {
    trigger:`พิจารณาต่อเมื่อรับวงเงินน้ำท่วม ${formatCoverageCell({...cells.floodLimit,conditions:[]})} ได้ และฐานทุนอาคาร/ทรัพย์สินตรงกับบ้านจริง`,
    question:`ความเสียหายจากน้ำท่วมที่อยากคุ้มครองประมาณเท่าไรครับ วงเงิน ${formatCoverageCell({...cells.floodLimit,conditions:[]})} เพียงพอไหม และต้องการรวมตัวบ้านกับทรัพย์สินใดบ้าง?`,
  };
  if (plan.category === "motor") {
    const collision=cells.collisionLimit;
    return {trigger:collision?.status==="known"?`พิจารณาต่อเมื่อทุนรถ ${formatCoverageCell(collision)} ตรงกับรถและเหตุที่ต้องการคุ้มครอง โดยรับค่าเสียหายส่วนแรกและรูปแบบซ่อมได้`:"ยังต้องขอทุนรถ เบี้ย และเงื่อนไขการชนเฉพาะรุ่นก่อน จึงจะตัดสินใจจากตัวเลือกนี้ได้",question:collision?.conditions.length?`รับเงื่อนไข “${collision.conditions.join(" · ")}” ได้ไหมครับ หรือจำเป็นต้องคุ้มครองการชนแบบอื่นด้วย?`:"ใช้รถรุ่นและปีอะไร ต้องการคุ้มครองการชนแบบไม่มีคู่กรณีด้วยไหมครับ และรับค่าเสียหายส่วนแรกกับรูปแบบซ่อมแบบไหนได้?"};
  }
  if (plan.category === "accident") return {
    trigger:cells.dailyAllowance?.status==="known"?`พิจารณาต่อเมื่อเงินชดเชย ${formatCoverageCell(cells.dailyAllowance)} ช่วยชดเชยรายได้ที่ต้องการ และอาชีพ/การนอนโรงพยาบาลเข้าเงื่อนไข`:"ยังใช้เรื่องชดเชยรายวันตัดสินใจเลือกแผนนี้ไม่ได้ ต้องยืนยันสิทธิดังกล่าวก่อน หรือให้ลูกค้ายืนยันว่าเน้นค่ารักษาเป็นหลัก",
    question:cells.dailyAllowance?.status==="known"?"ถ้าหยุดงานจากอุบัติเหตุ อยากชดเชยรายได้วันละเท่าไรครับ และมีสิทธิค่ารักษาหรือรายได้ทดแทนเดิมอยู่แล้วไหม?":"ระหว่างค่ารักษาอุบัติเหตุกับชดเชยรายได้รายวัน อะไรจำเป็นกับคุณครับ ถ้ารายวันจำเป็น เราควรยืนยันสิทธิส่วนนี้ก่อนเลือกแผน",
  };
  if (plan.category === "travel") return {
    trigger:cells.policyDuration?.status==="known"&&cells.policyDuration.unit==="ปี"?"พิจารณารายปีเมื่อเดินทางหลายครั้ง และจำนวนวันต่อเที่ยว/พื้นที่คุ้มครองตรงแผน พร้อมเทียบเบี้ยจริงกับรายเที่ยว":cells.delayTrigger?.inclusion==="optional"?"พิจารณาต่อเมื่อวันเดินทางตรงแผน และยอมเลือกแพ็กเสริมสำหรับเที่ยวบินล่าช้า โดยยืนยันเบี้ยรวม":"พิจารณาต่อเมื่อพื้นที่ วันเดินทาง และเหตุ/ระยะเวลาล่าช้าที่คุ้มครองตรงกับทริปจริง",
    question:cells.policyDuration?.status==="known"&&cells.policyDuration.unit==="ปี"?"ในหนึ่งปีเดินทางกี่ครั้ง แต่ละครั้งนานแค่ไหนครับ เพื่อเทียบรายปีกับซื้อแยกแต่ละทริป?":"เดินทางประเทศไหน วันไหน และกี่คนครับ ต้องการคุ้มครองเที่ยวบินล่าช้าจากเหตุใด เพื่อเช็กเกณฑ์และแพ็กที่ต้องเลือกเพิ่ม?",
  };
  const topic = evidence[0];
  if (topic) return { trigger: `พิจารณาต่อเมื่อความคุ้มครอง “${topic.briefText}” ตรงความต้องการจริง และรับเงื่อนไขกับเบี้ยที่ยืนยันแล้วได้`, question: `จากที่บอกว่า “${topic.quote}” อยากคุ้มครองกรณีไหนและวงเงินเท่าไรครับ มีสิทธิเดิมหรือส่วนที่รับผิดชอบเองได้แค่ไหน?` };
  return { trigger: "ลูกค้ายืนยันความคุ้มครองที่ต้องการ แล้ววงเงิน เงื่อนไข และเบี้ยจริงของแผนนี้ตรงกับสิ่งที่ตกลงกัน", question: `ตอนที่สนใจ ${plan.name} ชอบความคุ้มครองส่วนไหนเป็นพิเศษ และมีเงื่อนไขอะไรที่รับไม่ได้บ้างครับ?` };
}
