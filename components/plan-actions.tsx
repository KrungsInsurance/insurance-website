"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertDialog } from "radix-ui";
import { useDemo } from "@/components/demo-provider";
import { arePlansCompatible } from "@/lib/compare";
import { getPlan } from "@/lib/catalog";
import type { Plan } from "@/lib/types";

export function PlanActions({ plan }: { plan: Plan }) {
 const { state, setSelection, setInterestedPlans, recordSignal } = useDemo();
 const [error, setError] = useState("");
 const [pending, setPending] = useState<"interest" | "compare" | null>(null);
 const returnFocus = useRef<HTMLButtonElement | null>(null);
 useEffect(() => { if (state.signals.detailOpened) return; const timer = setTimeout(() => recordSignal("detailOpened"), 0); return () => clearTimeout(timer); }, [state.signals.detailOpened, recordSignal]);
 function complete(action: "interest" | "compare", replace: boolean) {
  if (action === "interest") {
   flushSync(() => { if (replace) setSelection([]); setInterestedPlans([plan.id]); recordSignal("interested"); });
   window.dispatchEvent(new CustomEvent("insurance-chat", { detail: { handoff: true } }));
   return;
  }
  const ids = replace ? [plan.id] : [...new Set([...state.selection, plan.id])];
  if (ids.length > 3) { setError("เลือกเปรียบเทียบได้สูงสุด 3 แผน กรุณานำแผนเดิมออกก่อน"); return; }
  flushSync(() => setSelection(ids));
  window.location.assign(`/compare?category=${plan.category}&ids=${ids.join(",")}`);
 }
 function request(action: "interest" | "compare", button: HTMLButtonElement) {
  setError(""); returnFocus.current = button;
  if (!arePlansCompatible([...state.selection.map(getPlan).filter(p=>p!==undefined),plan])) { setPending(action); return; }
  complete(action, false);
 }
 return <div className="mt-6"><div className="flex flex-wrap gap-3">
  <button className="action-primary" onClick={event => request("interest", event.currentTarget)}>สนใจแผนนี้</button>
  <button className="action-secondary" aria-describedby={error ? "plan-selection-error" : undefined} onClick={event => request("compare", event.currentTarget)}>เพิ่มเพื่อเปรียบเทียบ</button>
 </div>{error && <p id="plan-selection-error" role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
 <AlertDialog.Root open={pending !== null} onOpenChange={open => { if (!open) setPending(null); }}><AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30"/>
 <AlertDialog.Content onCloseAutoFocus={event => { event.preventDefault(); returnFocus.current?.focus(); }} className="fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6">
 <AlertDialog.Title className="text-xl font-semibold">เปลี่ยนหมวดประกัน?</AlertDialog.Title><AlertDialog.Description className="mt-3 text-sm">แผนนี้เป็นคนละหมวดหรือรูปแบบความคุ้มครองกับแผนที่เลือกไว้ หากดำเนินการต่อจะล้างแผนเดิม</AlertDialog.Description>
 <div className="mt-6 flex gap-3"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={() => { if (pending) complete(pending, true); }}>เปลี่ยนหมวดและดำเนินการต่อ</AlertDialog.Action></div>
 </AlertDialog.Content></AlertDialog.Portal></AlertDialog.Root></div>;
}
