import type { Price } from "@/lib/types";

export function PlanPrice({ price, className = "text-2xl font-semibold", compact = false }: { price: Price; className?: string; compact?: boolean }) {
  const quoted = price.kind === "quote_only" || price.amountTHB === null;
  const label = price.kind === "starting" ? "เบี้ยผลิตภัณฑ์เริ่มต้น" : price.kind === "example" ? "เบี้ยตัวอย่าง" : "เบี้ยประกัน";
  const qualifier = price.kind === "starting" ? "ราคาเริ่มต้นของผลิตภัณฑ์ ต้องยืนยันราคาแผนที่เลือก" : price.kind === "example" ? price.scenario : quoted ? "ขอราคาตามข้อมูลและเงื่อนไขของผู้สมัคร" : null;
  return <div className="plan-price-block">
    <p className="plan-price-label">{label}</p>
    <p className={`${className} tabular-nums`}>
      {quoted ? "ขอใบเสนอราคา" : <>{new Intl.NumberFormat("th-TH").format(price.amountTHB!)}<span className="plan-price-unit"> บาท / {price.period === "trip" ? "ทริป" : price.period === "single" ? "ครั้งเดียว" : "ปี"}</span></>}
    </p>
    {qualifier && <p className="plan-price-qualifier">{qualifier}</p>}
    {!compact && price.includes && <p className="plan-price-qualifier">{price.includes}</p>}
  </div>;
}
