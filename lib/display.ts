import type { CoverageValue, PremiumPeriod, Price, CoverageCell } from "./types.ts";

export function formatPrice(price:Price):string {
  const text=price.kind==="quote_only"?"ขอใบเสนอราคา":`${price.kind==="starting"?"เริ่มต้น ":price.kind==="example"?"ตัวอย่าง ":""}${formatPremium(price.amountTHB,price.period)}`;
  return [text,price.scenario,price.includes].filter(Boolean).join(" · ");
}
export function formatCoverageCell(cell:CoverageCell):string {
  const labels={unknown:"ยังไม่ได้ระบุ",not_covered:"ไม่คุ้มครอง",not_applicable:"ไม่ใช้กับแผนนี้",conflicting:"ข้อมูลขัดกัน — รอยืนยัน"};
  const basisLabels:Record<string,string>={per_year:"ต่อปี",per_disease:"ต่อโรค",per_admission:"ต่อการเข้าพักรักษา",per_day:"ต่อวัน",per_occurrence:"ต่อเหตุการณ์",per_claim:"ต่อการเรียกร้อง",per_accident:"ต่ออุบัติเหตุ",per_trip:"ต่อเที่ยว",per_person:"ต่อคน",until_age:"อายุ",entry_age:"อายุ",coverage_term:"ระยะคุ้มครอง",payment_term:"ระยะชำระเบี้ย",single_payment:"ชำระครั้งเดียว",shared_cap:"รวมกลุ่มภัย"};
  const value=cell.status==="known"?formatCoverageValue(cell.value,cell.unit):labels[cell.status];
  return [cell.inclusion==="optional"?"ตัวเลือกเพิ่มเติม":null,value,cell.status==="known"?basisLabels[cell.basis??""]:null,...cell.conditions].filter(Boolean).join(" · ");
}

export function formatPremium(value: number | null, period: PremiumPeriod, note?: string) {
  if (value === null) return note || "ขอใบเสนอราคา";
  const formatted = `${new Intl.NumberFormat("th-TH").format(value)} บาท/${period === "trip" ? "ทริป" : period === "single" ? "ครั้งเดียว" : "ปี"}`;

  return note ? `${formatted} · ${note}` : formatted;
}

export function formatCoverageValue(value: CoverageValue, unit: string | null) {
  if (value === null) return "ยังไม่ได้ระบุ";
  if (typeof value === "boolean") return value ? "คุ้มครอง" : "ไม่คุ้มครอง";
  const formatted = typeof value === "number" ? new Intl.NumberFormat("th-TH").format(value) : value;
  return unit ? `${formatted} ${unit}` : formatted;
}

