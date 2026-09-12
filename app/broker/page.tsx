"use client";

import { useState } from "react";
import Link from "@/components/native-link";
import { ArrowLeft, ArrowUpRight, Inbox, Search } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import type { Category, LeadStatus } from "@/lib/types";
import "@/components/broker.css";
import "@/components/broker-list-readability.css";

const categories: Record<Category, string> = {
  health: "สุขภาพ", motor: "รถยนต์", life: "ชีวิต", accident: "อุบัติเหตุ",
  travel: "เดินทาง", property: "บ้านและทรัพย์สิน", liability: "ความรับผิด",
  pet: "สัตว์เลี้ยง", "critical-illness": "โรคร้ายแรง", cyber: "ไซเบอร์",
  business: "ธุรกิจและการก่อสร้าง", event: "งานอีเวนต์", sports: "กีฬาและกิจกรรม",
};
const contactWindows = { morning: "ช่วงเช้า", afternoon: "ช่วงบ่าย", evening: "ช่วงเย็น" };
const labels = { new: "ใหม่", contacting: "กำลังติดต่อ", follow_up: "ติดตามผล", closed: "ปิดเรื่อง" } as const;

export default function BrokerPage() {
  const { state } = useDemo();
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const leads = [...state.leads].sort((a, b) =>
    Number(b.status === "new") - Number(a.status === "new") || b.createdAt.localeCompare(a.createdAt),
  );
  const counts = Object.fromEntries(Object.keys(labels).map(status => [status, leads.filter(lead => lead.status === status).length]));
  const search = query.trim().toLocaleLowerCase("th-TH");
  const filtered = leads.filter(lead => (filter === "all" || lead.status === filter) && (!search || [
    lead.displayName, categories[lead.summary.category], ...lead.summary.needs,
    ...(lead.summary.overview?.customer.concerns.map(fact => fact.text) ?? []),
    ...lead.summary.interestedPlanIds.map(id => lead.planFacts?.find(plan => plan.id === id)?.name ?? id),
  ].some(text => text.toLocaleLowerCase("th-TH").includes(search))));

  return (
    <main className="broker-workspace broker-page broker-list-page">
      <div className="broker-demo-strip">โหมดผู้เชี่ยวชาญ · ข้อมูลตัวอย่าง</div>
      <div className="broker-container">
        <Link href="/" className="broker-back"><ArrowLeft size={18} aria-hidden="true" />กลับหน้าแรก</Link>
        <header className="broker-page-heading">
          <div>
            <p className="broker-eyebrow">สำหรับผู้เชี่ยวชาญ</p>
            <h1>ลูกค้าที่รอคุณดูแล</h1>
            <p>เลือกเคส แล้วคุยต่อจากความต้องการของลูกค้า</p>
            <span className="broker-demo-count">เคสตัวอย่าง {leads.filter(lead => lead.demoCaseId).length} เคส</span>
          </div>
          <div className="broker-total"><strong>{leads.filter(lead => lead.status !== "closed").length}</strong><span>เคสที่ยังเปิดอยู่</span></div>
        </header>

        <section className="broker-metrics" aria-label="กรองคำขอตามสถานะ">
          {Object.entries(labels).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(filter === key ? "all" : key as LeadStatus)} className="broker-metric">
              <span className={`broker-status-dot broker-dot-${key}`} aria-hidden="true" /><span>{label}</span><strong>{counts[key]}</strong>
            </button>
          ))}
        </section>

        <section className="broker-requests" aria-labelledby="requests-title">
          <div className="broker-list-heading">
            <div><h2 id="requests-title">รายการลูกค้า</h2><p>เคสใหม่ขึ้นก่อน · เรียงล่าสุด</p></div>
            <span className="broker-result-count" role="status">{filtered.length} จาก {leads.length} เคส</span>
          </div>
          <div className="broker-filter-bar">
            <label className="broker-search">
              <Search size={20} aria-hidden="true" /><span className="sr-only">ค้นหาชื่อ ความต้องการ หรือแผน</span>
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาชื่อ ความต้องการ หรือแผน" />
            </label>
            <label className="broker-status-select">
              <span className="sr-only">กรองสถานะ</span>
              <select value={filter} onChange={event => setFilter(event.target.value as LeadStatus | "all")}>
                <option value="all">ทุกสถานะ</option>
                {Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
          </div>

          {filtered.length ? (
            <div className="broker-request-list">
              {filtered.map(lead => (
                <Link key={lead.id} href={`/broker/leads/${lead.id}`} className="broker-request">
                  <div className="broker-request-avatar" aria-hidden="true">{lead.displayName.trim().slice(0, 1) || "?"}</div>
                  <div className="broker-request-body">
                    <div className="broker-request-title">
                      <h3>{lead.displayName}</h3>
                      <span className={`broker-status broker-status-${lead.status}`}>{labels[lead.status]}</span>
                    </div>
                    <p className="broker-request-plans">{lead.summary.needs[0] || "ยังไม่ได้ระบุ"}</p>
                    {lead.summary.overview?.customer.concerns[0] && (
                      <p className="broker-request-concern">{lead.summary.overview.customer.concerns[0].text}</p>
                    )}
                    <div className="broker-request-meta">
                      <span>{categories[lead.summary.category]}</span>
                      <span>สะดวก{contactWindows[lead.contactWindow]}</span>
                      <time dateTime={lead.createdAt}>{new Date(lead.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit", timeZone: "Asia/Bangkok" })}</time>
                      {lead.demoCaseId && <span className="broker-sample-label">เคสตัวอย่าง</span>}
                    </div>
                  </div>
                  <div className="broker-request-end"><span>ดูเคส</span><ArrowUpRight size={20} aria-hidden="true" /></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="broker-empty">
              <Inbox size={32} aria-hidden="true" />
              <h3>{leads.length ? "ไม่พบเคสที่ตรงกัน" : "ยังไม่มีเคสให้ดูแล"}</h3>
              <p>{leads.length ? "ลองคำค้นอื่น หรือดูทุกสถานะ" : "คำขอจะแสดงเมื่อลูกค้ายืนยันส่งข้อมูล"}</p>
              {leads.length ? <button type="button" className="broker-secondary" onClick={() => { setFilter("all"); setQuery(""); }}>ล้างตัวกรอง</button> : <Link href="/browse" className="broker-secondary">ดูแผนประกัน</Link>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
