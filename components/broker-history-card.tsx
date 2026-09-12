import { formatPremium, formatPrice, formatCoverageCell } from "@/lib/display";
import { shortBasis, shortCoverage, shortFieldLabel } from "@/lib/ui-copy";
import { getIntakeFields, intakeTemplates } from "@/lib/chat-intake";
import { insuranceTerms } from "@/lib/insurance-terms";
import { categoryFields } from "@/lib/catalog";
import type { Lead, ChatCard } from "@/lib/types";

export function HistoricalCard({ card, lead }: { card: ChatCard; lead: Lead }) {
  if (card.type === "intake") return <p className="mt-2 p-3">{intakeTemplates[card.category].title}: {getIntakeFields(card).map(field=>field.label).join(" · ")}</p>;
  if (card.type === "question") return <p className="mt-2 rounded-xl bg-[#f5f5f7] p-3">คำถาม: {card.prompt}</p>;
  if (card.type === "term") return <p className="mt-2 rounded-xl bg-[#f5f5f7] p-3">คำศัพท์: {Object.hasOwn(insuranceTerms, card.term) ? insuranceTerms[card.term as keyof typeof insuranceTerms].title : card.term} <span className="text-[#6e6e73]">· พจนานุกรมปัจจุบัน</span></p>;
  return <details className="broker-historical-card mt-2 rounded-xl border border-[#e0e0e0] p-3"><summary className="min-h-11 cursor-pointer content-center font-medium">{card.type === "comparison" ? "การ์ดเปรียบเทียบ" : card.type === "handoff" ? "การ์ดส่งต่อ" : "ข้อมูลแผน"} · ณ ตอนส่งต่อ</summary>
    {card.type === "handoff" && <p className="mt-2">{card.reason}</p>}
    {card.planIds.map(id => {
      const plan = lead.planFacts?.find(p => p.id === id);
      if (!plan) return <p key={id} className="mt-3 text-[#6e6e73]">{id} · ยังไม่ได้ระบุ</p>;
      const fields = "fieldKeys" in card ? (card.fieldKeys.length ? card.fieldKeys : Object.keys(plan.coverageCells ?? {})) : [];
      return <article key={id} className="mt-3 border-t border-[#e0e0e0] pt-3"><h3 className="font-semibold">{plan.name}</h3><p className="broker-history-price">{plan.price ? formatPrice({ ...plan.price, scenario: null, includes: null }) : formatPremium(plan.premiumTHB, plan.premiumPeriod, plan.premiumNote)}</p>
        <dl className="broker-history-values">{fields.map(key => {
          const cell = plan.coverageCells && Object.hasOwn(plan.coverageCells, key) ? plan.coverageCells[key] : undefined;
          return <div key={key}><dt>{shortFieldLabel(key, categoryFields[plan.category].find(field => field.key === key)?.label ?? key)}</dt><dd>{cell ? shortCoverage(cell) : "ยังไม่ได้ระบุ"}</dd>{cell && shortBasis(cell) && <p>{shortBasis(cell)}</p>}{cell?.inclusion === "optional" && <span className="broker-optional">ซื้อเพิ่ม</span>}{cell?.inclusion === "unknown" && <span className="broker-muted">รอยืนยันการรวม</span>}</div>;
        })}</dl>
        <details className="broker-disclosure"><summary>เงื่อนไขและแหล่งข้อมูล</summary><p>{plan.price?.scenario}</p><p>{plan.price?.includes}</p>{fields.map(key => {
          const cell = plan.coverageCells?.[key];
          return <p key={key}>{categoryFields[plan.category].find(field => field.key === key)?.label ?? key}: {cell ? formatCoverageCell(cell) : "ยังไม่ได้ระบุ"}</p>;
        })}{(plan.sources ?? []).filter((source, index, all) => all.findIndex(item => item.url === source.url) === index).map(source => <a key={source.id} className="text-link block min-h-11 content-center" href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.locator} ↗</a>)}{!plan.sources?.length && <a className="text-link block min-h-11 content-center" href={plan.source.url} target="_blank" rel="noreferrer">{plan.source.label} ↗</a>}</details>
      </article>;
    })}
  </details>;
}
