"use client";

import Link from "@/components/native-link";
import { ArrowLeft, ArrowUpRight, RotateCcw, Save } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertDialog } from "radix-ui";
import { getPlan } from "@/lib/catalog";
import { useDemo } from "@/components/demo-provider";
import { categories, type Category, type CustomerProfile } from "@/lib/types";
import "@/components/account-readability.css";

const labels: Record<Category, string> = {
  health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ",
  travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด",
  pet: "สัตว์เลี้ยง", "critical-illness": "โรคร้ายแรง", cyber: "ไซเบอร์",
  business: "ธุรกิจและการก่อสร้าง", event: "งานอีเวนต์", sports: "กีฬาและกิจกรรม",
};
const leadStatuses = { new: "รอรับเรื่อง", contacting: "กำลังติดต่อ", follow_up: "นัดติดตาม", closed: "ปิดเรื่อง" };

export default function AccountPage() {
  const budgetInput = useRef<HTMLInputElement>(null);
  const { state, setProfile, setSelection, reset, storageWarning } = useDemo();
  const [profile, setLocal] = useState<CustomerProfile>(state.profile);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<{ category: Category | null } | null>(null);
  const [error, setError] = useState("");

  function update(patch: Partial<CustomerProfile>) {
    setLocal((current) => ({ ...current, ...patch }));
    setSaved(false);
  }

  function save() {
    if (budgetInput.current?.validity.badInput || (profile.budgetTHB !== null && (!Number.isFinite(profile.budgetTHB) || profile.budgetTHB < 0))) {
      setError("งบต้องเป็นตัวเลขตั้งแต่ 0 บาทขึ้นไป");
      setSaved(false);
      return;
    }
    setError("");
    setProfile({ ...profile, displayName: profile.displayName.trim() || "ผู้ใช้เดโม", budgetTHB: profile.budgetTHB });
    setSaved(true);
  }

  function changeCategory(category: Category | null) {
    if (state.selection.some(id => getPlan(id)?.category !== category)) setPendingCategory({ category });
    else update({ preferredCategory: category });
  }

  function resetDemo() {
    let cleared = false;
    flushSync(() => { cleared = reset(); });
    if (cleared) window.location.assign("/?reset=1");
    else setError("ล้างข้อมูลที่บันทึกไว้ไม่ได้ ข้อมูลในหน่วยความจำถูกรีเซ็ตแล้ว กรุณาตรวจการตั้งค่า browser");
  }

  return <main className="account-page">
    <div className="account-demo-note">โหมดสาธิต · ข้อมูลเก็บใน browser นี้</div>
    <div className="account-container">
      <Link href="/" prefetch={false} className="account-back"><ArrowLeft size={18} aria-hidden="true" />กลับหน้าแรก</Link>
      <header className="account-heading"><h1>บัญชีของฉัน</h1><p>ข้อมูลส่วนตัวและคำขอผู้เชี่ยวชาญ</p></header>

      <section className="account-section" aria-labelledby="profile-title">
        <h2 id="profile-title">ข้อมูลของฉัน</h2>
        <div className="account-fields">
          <label>ชื่อที่แสดง<input value={profile.displayName} onChange={(e) => update({ displayName: e.target.value })} maxLength={60} /></label>
          <label>หมวดที่สนใจ<select value={profile.preferredCategory ?? ""} id="account-category" onChange={(e) => changeCategory((e.target.value || null) as Category | null)}>
            <option value="">ยังไม่ได้ระบุ</option>
            {categories.map((category) => <option key={category} value={category}>{labels[category]}</option>)}
          </select></label>
          <label>งบต่อปี <span className="account-field-unit">· บาท</span><input ref={budgetInput} type="number" min="0" step="any" inputMode="decimal" placeholder="ยังไม่ได้ระบุ" aria-invalid={Boolean(error)} aria-describedby={error ? "profile-budget-error" : undefined} value={profile.budgetTHB ?? ""} onChange={(e) => update({ budgetTHB: e.target.value === "" ? null : Number(e.target.value) })} /></label>
        </div>
        {error && <p id="profile-budget-error" className="account-error" role="alert">{error}</p>}
        <div className="account-save-row"><button type="button" onClick={save} className="account-save"><Save size={18} aria-hidden="true" />บันทึก</button>{saved && <span className="account-saved" role="status">บันทึกแล้ว</span>}</div>
      </section>

      <section className="account-section" aria-labelledby="requests-title">
        <div className="account-request-heading"><h2 id="requests-title">คำขอผู้เชี่ยวชาญ</h2><p className="account-request-count"><strong>{state.leads.length}</strong><span>รายการ</span></p></div>
        {state.leads.length === 0 ? <p className="account-empty">ยังไม่มีคำขอ</p> : <div className="account-requests">
          {state.leads.map(lead => <Link href={`/broker/leads/${lead.id}`} key={lead.id} className="account-request">
            <div className="account-request-main"><strong>{lead.displayName}</strong><ArrowUpRight size={20} aria-hidden="true" /></div>
            <span className="account-request-status">{leadStatuses[lead.status]}</span>
            <span className="account-request-date">อัปเดต {new Date(lead.updatedAt).toLocaleString("th-TH")}</span>
          </Link>)}
        </div>}
      </section>

      <section className="account-section account-privacy" aria-labelledby="privacy-title">
        <h2 id="privacy-title">ความเป็นส่วนตัว</h2>
        <p>ข้อมูลตัวอย่างเก็บใน browser นี้เท่านั้น และล้างได้ด้วยปุ่มรีเซ็ต ไม่ขอเลขบัตรหรือข้อมูลสุขภาพจริง</p>
        {storageWarning && <p className="account-storage-warning">พื้นที่จัดเก็บใช้ไม่ได้ ข้อมูลจะอยู่ในหน่วยความจำจนกว่าจะปิดหน้า</p>}
        <button type="button" id="reset-demo" onClick={() => setConfirmReset(true)} className="account-reset"><RotateCcw size={18} aria-hidden="true" />รีเซ็ตข้อมูลเดโม</button>
      </section>
    </div>

    <AlertDialog.Root open={confirmReset} onOpenChange={setConfirmReset}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="account-dialog-overlay" />
        <AlertDialog.Content onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("reset-demo")?.focus(); }} className="account-dialog">
          <AlertDialog.Title className="account-dialog-title">รีเซ็ตข้อมูลเดโม?</AlertDialog.Title>
          <AlertDialog.Description className="account-dialog-description">ล้างโปรไฟล์ บทสนทนา และคำขอของเว็บไซต์นี้ แล้วกลับไปข้อมูลเริ่มต้น</AlertDialog.Description>
          <div className="account-dialog-actions"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={resetDemo}>ยืนยันรีเซ็ต</AlertDialog.Action></div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
    <AlertDialog.Root open={pendingCategory !== null} onOpenChange={open => { if (!open) setPendingCategory(null); }}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="account-dialog-overlay" />
        <AlertDialog.Content onCloseAutoFocus={event => { event.preventDefault(); document.getElementById("account-category")?.focus(); }} className="account-dialog">
          <AlertDialog.Title className="account-dialog-title">เปลี่ยนหมวดที่สนใจ?</AlertDialog.Title>
          <AlertDialog.Description className="account-dialog-description">แผนเปรียบเทียบเดิมเป็นคนละหมวด จึงต้องล้างแผนที่เลือกก่อนเปลี่ยนหมวด</AlertDialog.Description>
          <div className="account-dialog-actions"><AlertDialog.Cancel className="action-secondary">ยกเลิก</AlertDialog.Cancel><AlertDialog.Action className="action-primary" onClick={() => { if (pendingCategory) { setSelection([]); update({ preferredCategory: pendingCategory.category }); } }}>เปลี่ยนหมวดและล้างแผน</AlertDialog.Action></div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </main>;
}
