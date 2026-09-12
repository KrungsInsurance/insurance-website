import { formatPremium, formatPrice, formatCoverageCell } from "@/lib/display";
import { insuranceTerms } from "@/lib/insurance-terms";
import { categoryFields } from "@/lib/catalog";
import type { Lead, ChatCard } from "@/lib/types";

export function HistoricalCard({card,lead}:{card:ChatCard;lead:Lead}){
 if(card.type==="question")return <p className="mt-2 rounded-xl bg-[#f5f5f7] p-3">คำถามในการ์ด: {card.prompt}</p>;
 if(card.type==="term")return <p className="mt-2 rounded-xl bg-[#f5f5f7] p-3">คำศัพท์ที่เปิด: {Object.hasOwn(insuranceTerms,card.term)?insuranceTerms[card.term as keyof typeof insuranceTerms].title:card.term} <span className="text-[#6e6e73]">· ชื่อจากพจนานุกรมปัจจุบัน</span></p>;
 return <details className="mt-2 rounded-xl border border-[#e0e0e0] p-3"><summary className="min-h-11 cursor-pointer content-center font-medium">{card.type==="comparison"?"การ์ดเปรียบเทียบ":card.type==="handoff"?"การ์ดส่งต่อผู้เชี่ยวชาญ":"การ์ดข้อมูลแผน"} · ข้อมูล ณ ตอนส่ง</summary>{card.type==="handoff"&&<p className="mt-2">{card.reason}</p>}{card.planIds.map(id=>{
 const plan=lead.planFacts?.find(p=>p.id===id);
 if(!plan)return <p key={id} className="mt-3 text-[#6e6e73]">{id} · คำขอเก่าไม่มีข้อมูลแผนนี้ที่บันทึกไว้</p>;
 const fields="fieldKeys"in card?(card.fieldKeys.length?card.fieldKeys:Object.keys(plan.coverageCells??{})):[];
 return <article key={id} className="mt-3 border-t border-[#e0e0e0] pt-3"><h3 className="font-semibold">{plan.name}</h3><p>{plan.price?formatPrice(plan.price):formatPremium(plan.premiumTHB,plan.premiumPeriod,plan.premiumNote)}</p><dl>{fields.map(key=>{
 const cell=plan.coverageCells&&Object.hasOwn(plan.coverageCells,key)?plan.coverageCells[key]:undefined;
 return <div key={key} className="mt-3"><dt className="font-medium">{categoryFields[plan.category].find(f=>f.key===key)?.label??key}</dt><dd>{cell?formatCoverageCell(cell):"ไม่มีข้อมูลช่องนี้ ณ ตอนส่ง"}{cell?.sourceIds.map(sourceId=>{const source=plan.sources?.find(s=>s.id===sourceId);return source?<a key={sourceId} className="text-link block min-h-11 content-center" href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.locator}</a>:null;})}</dd></div>;
 })}</dl></article>;
 })}</details>;
}
