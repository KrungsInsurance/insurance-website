"use client";

import Link from "@/components/native-link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, HeartPulse, CarFront, Users, ShieldPlus, Plane, House, Handshake, X } from "lucide-react";
import { flushSync } from "react-dom";
import { useMemo, useRef, useState } from "react";
import { AlertDialog } from "radix-ui";
import { arePlansCompatible } from "@/lib/compare";
import { getPlan, searchPlans } from "@/lib/catalog";
import { planImages } from "@/lib/plan-images";
import { PlanTradeoffs } from "@/components/plan-tradeoffs";
import { PlanPrice } from "@/components/plan-price";
import "@/components/browse-readability.css";
import { BrowseRefinement } from "@/components/browse-refinement";
import { refineBrowsePlans, validBrowseFocus } from "@/lib/browse-refinement";
import { categories, type Category, type Plan, type PlanSort } from "@/lib/types";
import { useDemo } from "@/components/demo-provider";

const categoryLabels: Record<Category, string> = { health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ", travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด", pet:"สัตว์เลี้ยง", "critical-illness":"โรคร้ายแรง", cyber:"ไซเบอร์", business:"ธุรกิจและการก่อสร้าง", event:"งานอีเวนต์", sports:"กีฬาและกิจกรรม" };
const categoryIcons = {health:HeartPulse,motor:CarFront,life:Users,accident:ShieldPlus,travel:Plane,property:House,liability:Handshake,pet:ShieldPlus,"critical-illness":HeartPulse,cyber:ShieldPlus,business:House,event:Users,sports:ShieldPlus};
const sortLabels: Record<PlanSort, string> = { "price-asc": "เบี้ยต่ำไปสูง", "price-desc": "เบี้ยสูงไปต่ำ", name: "ชื่อแผน" };
function isCategory(value: string | null): value is Category { return value !== null && categories.includes(value as Category); }
function isSort(value: string | null): value is PlanSort { return value === "price-asc" || value === "price-desc" || value === "name"; }

export default function BrowsePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, setSelection, setProfile } = useDemo();
  const categoryTrigger = useRef<HTMLElement | null>(null);
  const [pendingCategory, setPendingCategory] = useState<Category | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  const [selectionError, setSelectionError] = useState<{id:string;message:string}|null>(null);
  const selectedIds = state.selection;
  const setSelectedIds = setSelection;
  const rawCategory = searchParams.get("category");
  const rawSort = searchParams.get("sort");
  const category = isCategory(rawCategory) ? rawCategory : "health";
  const sort = isSort(rawSort) ? rawSort : "price-asc";
  const q = searchParams.get("q") ?? "";
  const rawBudget = searchParams.get("maxPremium");
  const parsedBudget = rawBudget === null || rawBudget === "" ? undefined : Number(rawBudget);
  const budgetError = rawBudget !== null && rawBudget !== "" && (parsedBudget === undefined || !Number.isFinite(parsedBudget) || parsedBudget < 0);
  const budgetForSearch = budgetError ? undefined : parsedBudget;
  const focus = validBrowseFocus(category, searchParams.get("focus"));
  const plans = useMemo(() => refineBrowsePlans(searchPlans({ category, q, sort }), category, focus).filter(plan => plan.price.kind === "quote_only" || budgetForSearch === undefined || (plan.price.amountTHB !== null && plan.price.amountTHB <= budgetForSearch)), [budgetForSearch, category, focus, q, sort]);
  const quotePlans = plans.filter(plan => plan.price.kind === "quote_only");
  const categoryChanged = rawCategory !== null && !isCategory(rawCategory);
  const sortChanged = rawSort !== null && !isSort(rawSort);
  const periodLabel = category === "travel" ? "บาท/ทริป" : "บาท/ปี";

  function href(next: Partial<{ category: Category; q: string; maxPremium: string; sort: PlanSort; focus: string }>) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.category !== undefined) { params.set("category", next.category); if (next.category !== category) params.delete("focus"); }
    if (next.focus !== undefined) { if (next.focus) params.set("focus", next.focus); else params.delete("focus"); }
    if (next.q !== undefined) { if (next.q) params.set("q", next.q); else params.delete("q"); }
    if (next.maxPremium !== undefined) { if (next.maxPremium) params.set("maxPremium", next.maxPremium); else params.delete("maxPremium"); }
    if (next.sort !== undefined) params.set("sort", next.sort);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }
  function submitSearch(formData: FormData) { router.push(href({ q: String(formData.get("q") ?? "").trim() })); }
  function submitBudget(formData: FormData) {
    const value = String(formData.get("maxPremium") ?? "").trim();
    const number = value === "" ? null : Number(value);
    if (number === null || (Number.isFinite(number) && number >= 0)) {
      flushSync(() => setProfile({ ...state.profile, preferredCategory: category, budgetTHB: number }));
    }
    router.push(href({ maxPremium: value }));
  }
  function changeCategory(next: Category) {
    setPendingPlan(null);
    if (selectedIds.length && selectedIds.some(id => getPlan(id)?.category !== next)) { setPendingCategory(next); return; }
    flushSync(() => setProfile({ ...state.profile, preferredCategory: next }));
    window.location.assign(href({ category: next, q: "" }));
  }
  function togglePlan(id: string) {
    setSelectionError(null);
    if (!arePlansCompatible([...selectedIds,id].map(getPlan).filter(p=>p!==undefined))) { categoryTrigger.current = document.activeElement as HTMLElement; setPendingPlan(id); setPendingCategory(category); return; }
    if (!selectedIds.includes(id) && selectedIds.length >= 3) { setSelectionError({id,message:`เลือกได้สูงสุด 3 แผน กรุณานำแผนเดิมออกก่อนเลือก ${getPlan(id)?.name}`}); return; }
    setSelection(selectedIds.includes(id) ? selectedIds.filter(item => item !== id) : [...selectedIds, id]);
  }

  function renderPlans(items: Plan[]) {
    return items.map(plan => <article key={plan.id} className="catalog-card">
      <div className="catalog-art" data-image-kind={planImages[plan.id]?.kind}>
        <img src={plan.image} alt={planImages[plan.id]?.alt ?? plan.name} loading="lazy"/>
      </div>
      <div className="catalog-card-body">
        <p className="catalog-company">{plan.insurer}</p>
        <h3>{plan.name}</h3>
        <PlanPrice price={plan.price} className="catalog-price" compact/>
        <PlanTradeoffs plan={plan} compact/>
        <div className="catalog-card-actions">
          <Link href={`/plans/${plan.id}`} className="action-primary">ดูแผน</Link>
          <label><input type="checkbox" checked={selectedIds.includes(plan.id)} onChange={() => togglePlan(plan.id)}/>เปรียบเทียบ</label>
        </div>
        {selectionError?.id === plan.id && <p role="alert" className="text-red-700 text-sm mt-2">{selectionError.message}</p>}
        <details className="catalog-extra">
          <summary>เงื่อนไข</summary>
          {(plan.price.scenario || plan.price.includes) && <p>{[plan.price.scenario, plan.price.includes].filter(Boolean).join(" · ")}</p>}
          <p>{plan.eligibility}</p>
          <ul>{[...new Set([...plan.highlights, ...plan.exclusions, ...Object.values(plan.coverageCells).flatMap(cell => cell.conditions)])].map(item => <li key={item}>{item}</li>)}</ul>
        </details>
      </div>
    </article>);
  }
  const insurers=[...new Set(searchPlans({category}).map(plan=>plan.insurer))];
  return <main className="browse-page"><section className="catalog-intro"><header><h1>ค้นหาประกัน</h1><p>เริ่มจากสิ่งที่คุณอยากดูแล</p></header><nav className="category-rail" aria-label="เลือกหมวดประกัน">{categories.map(item=>{const Icon=categoryIcons[item];return <Link key={item} href={href({category:item,q:""})} onClick={event=>{event.preventDefault();categoryTrigger.current=event.currentTarget;changeCategory(item);}} aria-current={item===category?"page":undefined}><Icon size={36} strokeWidth={1.35}/><span>{categoryLabels[item]}</span></Link>;})}</nav></section>
  <section className="catalog-surface"><div className="catalog-content"><BrowseRefinement key={category} category={category} focus={focus} onApply={value=>router.push(href({focus:value}))}/><header className="catalog-heading"><div><h2 id="catalog-results-title">ประกัน{categoryLabels[category]}</h2></div><p role="status"><strong>{plans.length}</strong> แผน</p></header>
  <nav className="insurer-tabs" aria-label="บริษัทประกัน"><Link href={href({q:""})} aria-current={!q?"page":undefined}>ทั้งหมด</Link>{insurers.map(insurer=><Link key={insurer} href={href({q:insurer})} aria-current={q===insurer?"page":undefined}>{insurer}</Link>)}</nav>
  <details className="catalog-filters" open={Boolean(q||rawBudget||budgetError)}><summary>ค้นหาและกรอง{q||rawBudget?" · มีตัวกรอง":""}</summary><div><form key={`search-${searchParams.toString()}`} action={submitSearch}><label htmlFor="plan-search">ค้นหาแผนหรือบริษัท</label><div className="catalog-input-row"><input id="plan-search" name="q" className="field" defaultValue={q} placeholder="ชื่อแผน หรือความคุ้มครอง"/><button className="action-secondary">ค้นหา</button></div></form><form key={`budget-${searchParams.toString()}`} action={submitBudget}><label htmlFor="max-premium">งบสูงสุด ({periodLabel})</label><div className="catalog-input-row"><input id="max-premium" name="maxPremium" className="field" inputMode="decimal" defaultValue={rawBudget??""} placeholder="ไม่จำกัด" aria-invalid={budgetError} aria-describedby={budgetError?"budget-error":undefined}/><button className="action-secondary">ใช้</button></div>{budgetError&&<p id="budget-error" role="alert" className="text-red-700">กรอกงบเป็นตัวเลขตั้งแต่ 0 ขึ้นไป</p>}</form><label>เรียงตาม<select className="field" aria-label="เรียงผลลัพธ์" value={sort} onChange={event=>router.push(href({sort:event.target.value as PlanSort}))}>{(Object.keys(sortLabels) as PlanSort[]).map(item=><option key={item} value={item}>{sortLabels[item]}</option>)}</select></label></div></details>
  {(categoryChanged||sortChanged)&&<p className="catalog-notice">ใช้ค่าเริ่มต้นสำหรับตัวกรองที่ไม่รู้จัก</p>}
  {selectedIds.length>0&&<aside className="catalog-selection" aria-live="polite"><p>เลือกไว้ {selectedIds.length}/3 แผน <span>{selectedIds.map(id=>getPlan(id)?.name).join(" · ")}</span>{selectedIds.length===1&&<span>เลือกเพิ่ม 1 แผน</span>}</p><div><button onClick={()=>setSelectedIds([])} className="text-link"><X size={16} aria-hidden="true"/>ล้าง</button>{selectedIds.length>=2&&<Link href={`/compare?category=${getPlan(selectedIds[0])?.category??category}&ids=${selectedIds.join(",")}`} className="action-primary">เปรียบเทียบ <ArrowRight size={16} aria-hidden="true"/></Link>}</div></aside>}

  {quotePlans.length > 0 && budgetForSearch !== undefined && <p className="catalog-notice">แผนขอราคายังไม่ยืนยันว่าอยู่ในงบ</p>}
  {plans.length>0?<div key={`results-${searchParams.toString()}`} className="catalog-grid catalog-results-enter">{renderPlans(plans)}</div>:<div key={`empty-${searchParams.toString()}`} className="catalog-empty catalog-results-enter"><h3>ยังไม่พบแผน</h3><p>ลองเปลี่ยนหรือล้างตัวกรอง</p><Link href={href({q:"",maxPremium:"",focus:""})} onClick={()=>flushSync(()=>setProfile({...state.profile,budgetTHB:null}))} className="text-link">ล้างตัวกรอง ›</Link></div>}
  <details className="catalog-footnote"><summary>เกี่ยวกับข้อมูล</summary><p>ราคาเริ่มต้นและราคาตัวอย่างไม่ใช่ใบเสนอราคาเฉพาะบุคคล ข้อมูลและแหล่งอ้างอิงอยู่ในหน้ารายละเอียดแต่ละแผน</p><p>เว็บไซต์เดโม ไม่มีการซื้อหรือออกกรมธรรม์จริง</p></details></div></section><AlertDialog.Root open={pendingCategory !== null} onOpenChange={open => { if (!open) { setPendingCategory(null); setPendingPlan(null); } }}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30"/><AlertDialog.Content onCloseAutoFocus={event => { event.preventDefault(); categoryTrigger.current?.focus(); }} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-xl font-semibold">{pendingPlan ? "เปลี่ยนกลุ่มแผนที่เปรียบเทียบ?" : "เปลี่ยนหมวดประกัน?"}</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">{pendingPlan ? "แผนนี้เปรียบเทียบร่วมกับรายการเดิมไม่ได้ ยืนยันเพื่อล้างรายการเดิมและเลือกแผนนี้" : "แผนที่เลือกไว้จะถูกล้าง เพื่อเปรียบเทียบเฉพาะหมวดเดียวกัน"}</AlertDialog.Description><div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={() => { if (!pendingCategory) return; flushSync(() => { setSelection(pendingPlan ? [pendingPlan] : []); setProfile({ ...state.profile, preferredCategory: pendingCategory }); }); window.location.assign(href({ category: pendingCategory, q: "" })); }}>{pendingPlan ? "เปลี่ยนกลุ่มแผน" : "เปลี่ยนหมวด"}</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root></main>;
}
