"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertDialog } from "radix-ui";
import type { Policy } from "@/lib/types";
import { planVisual } from "@/lib/plan-visuals";
import Link from "@/components/native-link";
import { getPlan } from "@/lib/catalog";
import { useDemo } from "@/components/demo-provider";
import "@/components/my-insurance-readability.css";

function status(renewsOn: string, life: boolean) {
  const days = Math.ceil((new Date(`${renewsOn}T00:00:00Z`).getTime() - new Date("2026-09-11T00:00:00Z").getTime()) / 86400000);
  return days < 0
    ? [life ? "เลยกำหนดชำระเบี้ย" : "หมดอายุ", "text-red-700"]
    : days <= 30
      ? [life ? "ใกล้ชำระเบี้ย" : "ใกล้ต่ออายุ", "text-amber-800"]
      : [life ? "ยังไม่ถึงกำหนดชำระ" : "ใช้งานอยู่", "text-[#0066cc]"];
}

function thaiDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));
}

export default function MyInsurancePage() {
  const { state, setSelection } = useDemo();
  const [pendingPolicy, setPendingPolicy] = useState<Policy | null>(null);
  const helpTrigger = useRef<HTMLButtonElement | null>(null);

  function openHelp(policy: Policy) {
    flushSync(() => setSelection([policy.planId]));
    window.dispatchEvent(new CustomEvent("insurance-chat", { detail: { policyId: policy.id } }));
  }

  function requestHelp(policy: Policy, button: HTMLButtonElement) {
    helpTrigger.current = button;
    if (state.selection.some(id => getPlan(id)?.category !== getPlan(policy.planId)?.category)) {
      setPendingPolicy(policy);
    } else {
      openHelp(policy);
    }
  }

  return (
    <main className="policies-page policies-readable">
      <header>
        <h1>ประกันของฉัน</h1>
        <p>กรมธรรม์ตัวอย่าง {state.policies.length} ฉบับ</p>
      </header>
      <div className="policy-grid">
        {state.policies.map(policy => {
          const plan = getPlan(policy.planId);
          const life = plan?.category === "life";
          const [label, tone] = status(policy.renewsOn, life);
          return (
            <article key={policy.id} className="policy-card">
              {plan && <div className="policy-art"><img src={planVisual(plan).src} alt={planVisual(plan).alt} /></div>}
              <div className="policy-content">
                <div className="policy-heading">
                  <p>{plan?.insurer}</p>
                  <h2>{plan?.name ?? "ไม่พบข้อมูลแผน"}</h2>
                </div>
                <div className="policy-date">
                  <span>{life ? "ชำระเบี้ย" : "ต่ออายุ"}</span>
                  <strong><time dateTime={policy.renewsOn}>{thaiDate(policy.renewsOn)}</time></strong>
                  <p className={`policy-status ${tone}`}>{label}</p>
                </div>
                <div className="policy-info">
                  <details>
                    <summary>ข้อมูลกรมธรรม์</summary>
                    <dl>
                      <div><dt>เลขกรมธรรม์</dt><dd>{policy.policyNumber}</dd></div>
                      <div><dt>ผู้ถือกรมธรรม์</dt><dd>{policy.holder}</dd></div>
                      <div><dt>เริ่มคุ้มครอง</dt><dd><time dateTime={policy.startsOn}>{thaiDate(policy.startsOn)}</time></dd></div>
                      <div><dt>เบี้ยกรมธรรม์</dt><dd>ยังไม่ได้ระบุ</dd></div>
                    </dl>
                  </details>
                  {plan && (
                    <div className="policy-actions">
                      <button className="action-primary" onClick={event => requestHelp(policy, event.currentTarget)}>ถามเรื่องกรมธรรม์</button>
                      <Link href={`/plans/${plan.id}`} className="text-link">ดูแผน ›</Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <details className="policy-disclosure">
        <summary>เกี่ยวกับข้อมูลนี้</summary>
        <p>กรมธรรม์ทั้งหมดเป็นข้อมูลตัวอย่าง สถานะอ้างอิงวันที่ 11 กันยายน 2569 ยังไม่มีข้อมูลเบี้ยกรมธรรม์แต่ละฉบับ ราคาในหน้าแผนเป็นราคาอ้างอิง เงื่อนไขและแหล่งข้อมูลอยู่ที่ “ดูแผน”</p>
        <p>ประกันชีวิตแสดงกำหนดชำระเบี้ย ซึ่งไม่ใช่วันสิ้นสุดความคุ้มครอง การสอบถามในหน้านี้ไม่ต่ออายุหรือชำระเบี้ย</p>
      </details>
      <AlertDialog.Root open={pendingPolicy !== null} onOpenChange={open => { if (!open) setPendingPolicy(null); }}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
          <AlertDialog.Content
            onCloseAutoFocus={event => { event.preventDefault(); helpTrigger.current?.focus(); }}
            className="policy-context-dialog fixed left-1/2 top-1/2 z-50 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6"
          >
            <AlertDialog.Title className="text-xl font-semibold">เปลี่ยนหมวดประกัน?</AlertDialog.Title>
            <AlertDialog.Description className="mt-3">แชทจะใช้แผนของกรมธรรม์นี้แทนแผนที่เลือกอยู่</AlertDialog.Description>
            <div className="policy-context-actions">
              <AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel>
              <AlertDialog.Action className="action-primary" onClick={() => { if (pendingPolicy) openHelp(pendingPolicy); }}>เปลี่ยนและถาม</AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </main>
  );
}
