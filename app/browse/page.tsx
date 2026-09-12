"use client";

import Link from "@/components/native-link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { flushSync } from "react-dom";
import { useMemo, useRef, useState } from "react";
import { AlertDialog } from "radix-ui";
import { arePlansCompatible } from "@/lib/compare";
import { getPlan, searchPlans } from "@/lib/catalog";
import { planVisual, categoryVisual } from "@/lib/plan-visuals";
import { PlanTradeoffs } from "@/components/plan-tradeoffs";
import { PlanPrice } from "@/components/plan-price";
import "@/components/browse-readability.css";
import { BrowseRefinement } from "@/components/browse-refinement";
import { refineBrowsePlans, validBrowseFocus } from "@/lib/browse-refinement";
import { categories, type Category, type Plan, type PlanSort } from "@/lib/types";
import { useDemo } from "@/components/demo-provider";

const categoryLabels: Record<Category, string> = { health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ", travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด", pet:"สัตว์เลี้ยง", "critical-illness":"โรคร้ายแรง", cyber:"ไซเบอร์", business:"ธุรกิจและการก่อสร้าง", event:"งานอีเวนต์", sports:"กีฬาและกิจกรรม" };

const sortLabels: Record<PlanSort, string> = { "price-asc": "เบี้ยต่ำไปสูง", "price-desc": "เบี้ยสูงไปต่ำ", name: "ชื่อแผน" };
function isCategory(value: string | null): value is Category { return value !== null && categories.includes(value as Category); }
function isSort(value: string | null): value is PlanSort { return value === "price-asc" || value === "price-desc" || value === "name"; }

export default function BrowsePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, setSelection, setProfile } = useDemo();
  const categoryTrigger = useRef<{ focus(): void } | null>(null);
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
    return items.map(plan => <article key={plan.id} className={`catalog-card${selectedIds.includes(plan.id) ? " is-selected" : ""}`}>
      <Link href={`/plans/${plan.id}`} className="catalog-identity">
        <img src={planVisual(plan).src} alt={planVisual(plan).alt} loading="lazy"/>
        <div><p className="catalog-company">{plan.insurer}</p><h3>{plan.name}</h3>{plan.tierLabel && !plan.name.includes(plan.tierLabel) && <p className="catalog-tier">{plan.tierLabel}</p>}</div>
      </Link>
      <div className="catalog-card-body">
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
  return <main className="browse-page"><section className="catalog-intro"><header><h1>เลือกสิ่งที่อยากดูแล</h1><p>ค่อย ๆ ดู ค่อย ๆ เลือก ในแบบของคุณ</p></header><img className="catalog-intro-photo" src={categoryVisual(category)} alt="" /></section>
  <section className="catalog-surface"><div className="catalog-content">
    <div className="catalog-category-row"><label className="sr-only" htmlFor="browse-category">ประเภทประกัน</label><select id="browse-category" value={category} onChange={event=>{categoryTrigger.current=event.currentTarget;changeCategory(event.target.value as Category);}}>{categories.map(item=><option key={item} value={item}>ประกัน{categoryLabels[item]}</option>)}</select><span>เริ่มจากความคุ้มครอง แล้วเทียบเงื่อนไขที่สำคัญ</span></div>
    <div className="catalog-toolbar">
      <label><span className="sr-only">บริษัทประกัน</span><select aria-label="บริษัทประกัน" value={insurers.includes(q)?q:""} onChange={event=>router.push(href({q:event.target.value}))}><option value="">ทุกบริษัท</option>{insurers.map(insurer=><option key={insurer} value={insurer}>{insurer}</option>)}</select></label>
      <label><span className="sr-only">งบสูงสุด</span><select aria-label="งบสูงสุด" value={rawBudget??""} onChange={event=>{const data=new FormData();data.set("maxPremium",event.target.value);submitBudget(data);}}><option value="">งบเบี้ย{category==="travel"?"ต่อทริป":"ต่อปี"}</option>{[10000,20000,30000,50000,100000].map(value=><option value={value} key={value}>ไม่เกิน {value.toLocaleString("th-TH")}</option>)}{rawBudget && ![10000,20000,30000,50000,100000].includes(Number(rawBudget)) && <option value={rawBudget}>{rawBudget} บาท</option>}</select></label>
      <form key={`search-${q}`} action={submitSearch} className="catalog-search"><label className="sr-only" htmlFor="plan-search">ค้นหาแผนหรือบริษัท</label><input id="plan-search" name="q" defaultValue={q} placeholder="ค้นหาแผน"/><button aria-label="ค้นหาแผน" type="submit">ค้นหา</button></form>
      <label className="catalog-sort"><span className="sr-only">เรียงผลลัพธ์</span><select aria-label="เรียงผลลัพธ์" value={sort} onChange={event=>router.push(href({sort:event.target.value as PlanSort}))}>{(Object.keys(sortLabels) as PlanSort[]).map(item=><option key={item} value={item}>{sortLabels[item]}</option>)}</select></label>
    </div>
    {budgetError&&<p role="alert" className="catalog-notice">กรอกงบเป็นตัวเลขตั้งแต่ 0 ขึ้นไป</p>}
    <details className="catalog-refinement"><summary>ปรับให้ตรงกับคุณ{focus?" · เลือกแล้ว":""}</summary><BrowseRefinement key={category} category={category} focus={focus} onApply={value=>router.push(href({focus:value}))}/><form key={`budget-${rawBudget}`} action={submitBudget} className="catalog-custom-budget"><label htmlFor="max-premium">งบอื่น ({periodLabel})</label><div className="catalog-input-row"><input id="max-premium" className="field" name="maxPremium" inputMode="decimal" defaultValue={rawBudget??""} placeholder="ไม่จำกัด"/><button className="action-secondary">ใช้</button></div></form></details>
    <header className="catalog-heading"><h2 id="catalog-results-title" className="sr-only">ประกัน{categoryLabels[category]}</h2><p role="status">{plans.length} แผน</p>{(q||rawBudget||focus)&&<Link className="text-link" href={href({q:"",maxPremium:"",focus:""})}>ล้างตัวกรอง</Link>}</header>
  {(categoryChanged||sortChanged)&&<p className="catalog-notice">ใช้ค่าเริ่มต้นสำหรับตัวกรองที่ไม่รู้จัก</p>}
  {selectedIds.length>0&&<aside className="catalog-selection" aria-live="polite"><p>เลือกไว้ {selectedIds.length}/3 แผน <span>{selectedIds.map(id=>getPlan(id)?.name).join(" · ")}</span>{selectedIds.length===1&&<span>เลือกเพิ่ม 1 แผน</span>}</p><div><button onClick={()=>setSelectedIds([])} className="text-link"><X size={16} aria-hidden="true"/>ล้าง</button>{selectedIds.length>=2&&<Link href={`/compare?category=${getPlan(selectedIds[0])?.category??category}&ids=${selectedIds.join(",")}`} className="action-primary">เปรียบเทียบ <ArrowRight size={16} aria-hidden="true"/></Link>}</div></aside>}

  {quotePlans.length > 0 && budgetForSearch !== undefined && <p className="catalog-notice">แผนขอราคายังไม่ยืนยันว่าอยู่ในงบ</p>}
  {plans.length>0?<div key={`results-${searchParams.toString()}`} className="catalog-grid catalog-results-enter">{renderPlans(plans)}</div>:<div key={`empty-${searchParams.toString()}`} className="catalog-empty catalog-results-enter"><h3>ยังไม่พบแผน</h3><p>ลองเปลี่ยนหรือล้างตัวกรอง</p><Link href={href({q:"",maxPremium:"",focus:""})} onClick={()=>flushSync(()=>setProfile({...state.profile,budgetTHB:null}))} className="text-link">ล้างตัวกรอง ›</Link></div>}
  <details className="catalog-footnote"><summary>เกี่ยวกับข้อมูล</summary><p>ราคาเริ่มต้นและราคาตัวอย่างไม่ใช่ใบเสนอราคาเฉพาะบุคคล ข้อมูลและแหล่งอ้างอิงอยู่ในหน้ารายละเอียดแต่ละแผน</p><p>เว็บไซต์เดโม ไม่มีการซื้อหรือออกกรมธรรม์จริง</p></details></div></section><AlertDialog.Root open={pendingCategory !== null} onOpenChange={open => { if (!open) { setPendingCategory(null); setPendingPlan(null); } }}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30"/><AlertDialog.Content onCloseAutoFocus={event => { event.preventDefault(); categoryTrigger.current?.focus(); }} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"><AlertDialog.Title className="text-xl font-semibold">{pendingPlan ? "เปลี่ยนกลุ่มแผนที่เปรียบเทียบ?" : "เปลี่ยนหมวดประกัน?"}</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">{pendingPlan ? "แผนนี้เปรียบเทียบร่วมกับรายการเดิมไม่ได้ ยืนยันเพื่อล้างรายการเดิมและเลือกแผนนี้" : "แผนที่เลือกไว้จะถูกล้าง เพื่อเปรียบเทียบเฉพาะหมวดเดียวกัน"}</AlertDialog.Description><div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={() => { if (!pendingCategory) return; flushSync(() => { setSelection(pendingPlan ? [pendingPlan] : []); setProfile({ ...state.profile, preferredCategory: pendingCategory }); }); window.location.assign(href({ category: pendingCategory, q: "" })); }}>{pendingPlan ? "เปลี่ยนกลุ่มแผน" : "เปลี่ยนหมวด"}</AlertDialog.Action></div></AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root></main>;
}
