import { formatPrice } from "@/lib/display";
import type { Price } from "@/lib/types";

export function PlanPrice({ price, className = "text-2xl font-semibold", compact = false }: { price: Price; className?: string; compact?: boolean }) {
  return <div><p className={`${className} tabular-nums`}>{formatPrice({ ...price, scenario: null, includes: null })}</p>{!compact && (price.scenario || price.includes) && <p className="mt-2 text-xs leading-relaxed text-[#6e6e73]">{[price.scenario, price.includes].filter(Boolean).join(" · ")}</p>}</div>;
}
