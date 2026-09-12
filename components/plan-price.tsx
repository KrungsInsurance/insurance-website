import { formatPrice } from "@/lib/display";
import type { Price } from "@/lib/types";

export function PlanPrice({ price, className = "text-2xl font-semibold" }: { price: Price; className?: string }) {
  return <div><p className={`${className} tabular-nums`}>{formatPrice({ ...price, scenario: null, includes: null })}</p>{(price.scenario || price.includes) && <p className="mt-2 text-xs leading-relaxed text-[#6e6e73]">{[price.scenario, price.includes].filter(Boolean).join(" · ")}</p>}</div>;
}
