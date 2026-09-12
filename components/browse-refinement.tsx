"use client";

import { useRef, useState } from "react";
import { browseAnswersError, browseContextMessage, browseContextStorageKey, browseRefinements, cleanBrowseAnswers } from "@/lib/browse-refinement";
import type { Category } from "@/lib/types";
import "./browse-refinement.css";

export function BrowseRefinement({ category, focus, onApply }: { category: Category; focus: string; onApply: (focus: string) => void }) {
  const config = browseRefinements[category];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [choice, setChoice] = useState(focus);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(browseContextStorageKey(category)) ?? "null");
      return stored?.category === category && stored.answers && typeof stored.answers === "object" ? cleanBrowseAnswers(category, stored.answers) : {};
    } catch { return {}; }
  });
  const [message, setMessage] = useState("");
  const [copyNotice, setCopyNotice] = useState("");
  const [notice, setNotice] = useState("");
  const [previousFocus, setPreviousFocus] = useState(focus);
  const heading = useRef<HTMLHeadingElement>(null);

  // URL navigation can change the applied focus without replacing this category's component.
  if (focus !== previousFocus) {
    setPreviousFocus(focus);
    if (focus !== choice) { setChoice(focus); setStep(1); setMessage(""); setCopyNotice(""); }
  }

  function move(next: 1 | 2 | 3) { setStep(next); requestAnimationFrame(() => heading.current?.focus()); }
  function save(rawAnswers: Record<string, unknown> = answers) {
    const cleaned = cleanBrowseAnswers(category, rawAnswers);
    setAnswers(cleaned);
    const validationError = browseAnswersError(category, cleaned);
    if (validationError) {
      setNotice(validationError);
      return;
    }
    setMessage(browseContextMessage({ category, focus: choice, answers: cleaned }));
    setCopyNotice("");
    try {
      sessionStorage.setItem(browseContextStorageKey(category), JSON.stringify({ category, focus: choice, answers: cleaned }));
      setNotice("");
    } catch { setNotice("เบราว์เซอร์ไม่อนุญาตให้เก็บข้อมูล ข้อมูลนี้จะอยู่เฉพาะหน้าที่เปิดอยู่"); }
    onApply(choice);
    move(3);
  }
  function reset() {
    setChoice(""); setAnswers({}); setNotice(""); setMessage(""); setCopyNotice("");
    try { sessionStorage.removeItem(browseContextStorageKey(category)); } catch { /* Optional storage. */ }
    onApply(""); move(1);
  }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(message); setCopyNotice("คัดลอกแล้ว"); }
    catch { setCopyNotice("คัดลอกไม่ได้ กรุณาคัดลอกจากช่องข้อความ"); }
  }
  const chosen = config.choices.find(item => item.value === choice)?.label;
  return <section className="browse-refine" aria-labelledby="browse-refine-title">
    <header className="browse-refine-header"><div><p className="browse-refine-eyebrow">ค้นหาในแบบคุณ</p><h2 id="browse-refine-title" ref={heading} tabIndex={-1}>{step === 3 ? "สิ่งที่คุณเลือก" : step === 2 ? "รายละเอียดของคุณ" : config.question}</h2></div><span className="browse-refine-progress">{step} / 3</span></header>
    {step === 1 && <div className="browse-refine-step"><fieldset><legend className="sr-only">{config.question}</legend><div className="browse-refine-choices">{[{ value: "", label: "ทั้งหมด" }, ...config.choices].map(item => <label key={item.value} className={choice === item.value ? "is-selected" : ""}><input type="radio" name={`browse-focus-${category}`} value={item.value} checked={choice === item.value} onChange={() => setChoice(item.value)}/><span>{item.label}</span></label>)}</div></fieldset><p className="browse-refine-hint">{config.filtersCatalog ? "เลือกประเภทเพื่อกรองแผน" : "เลือกความสนใจ · ยังแสดงทุกแผน"}</p><div className="browse-refine-actions"><button className="action-primary" onClick={() => move(2)}>ถัดไป</button><button className="text-link" onClick={() => save()}>ดูแผนเลย</button></div></div>}
    {step === 2 && <form className="browse-refine-step" onSubmit={event => { event.preventDefault(); save(Object.fromEntries(new FormData(event.currentTarget))); }}><p className="browse-refine-hint">กรอกเท่าที่ทราบ · ข้ามได้ทุกช่อง</p><div className="browse-refine-fields">{config.fields.map(field => <label key={field.key} htmlFor={`browse-${category}-${field.key}`}>{field.label}{field.options ? <select name={field.key} id={`browse-${category}-${field.key}`} className="field" value={answers[field.key] ?? ""} onChange={event => setAnswers({ ...answers, [field.key]: event.target.value })}><option value="">ยังไม่ระบุ</option>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input name={field.key} id={`browse-${category}-${field.key}`} className="field" type={field.type ?? "text"} min={field.min} max={field.max} maxLength={120} placeholder={field.placeholder} value={answers[field.key] ?? ""} onChange={event => setAnswers({ ...answers, [field.key]: event.target.value })}/>}</label>)}</div><div className="browse-refine-actions"><button type="button" className="action-secondary" onClick={() => move(1)}>ย้อนกลับ</button><button className="action-primary">ดูแผน</button><button type="button" className="text-link" onClick={reset}>เริ่มใหม่</button></div></form>}
    {step === 3 && <div className="browse-refine-step"><div className="browse-refine-summary"><p><strong>{chosen ?? "ทุกแผน"}</strong>{chosen && !config.filtersCatalog && <span> · หัวข้อที่สนใจ</span>}</p>{Object.keys(answers).length > 0 && <dl>{config.fields.filter(field => answers[field.key]).map(field => <div key={field.key}><dt>{field.label}</dt><dd>{answers[field.key]}</dd></div>)}</dl>}</div><p className="browse-refine-hint">{Object.keys(answers).length ? "บันทึกไว้ในแท็บนี้ · ใช้เตรียมขอราคา" : "ดูและเทียบแผนได้เลย"}</p><div className="browse-refine-actions"><button className="action-secondary" onClick={() => move(2)}>แก้รายละเอียด</button><button className="text-link" onClick={() => move(1)}>เปลี่ยนความสนใจ</button><button className="text-link" onClick={reset}>เริ่มใหม่</button><a className="text-link" href="#catalog-results-title">ไปดูแผน ↓</a></div><details className="browse-refine-message"><summary>คุยต่อในแชต</summary><label htmlFor="browse-quote-message">ข้อความของคุณ · แก้ไขได้<textarea id="browse-quote-message" className="field" rows={5} maxLength={2000} value={message} onChange={event => { setMessage(event.target.value); setCopyNotice(""); }}/></label><div className="browse-refine-actions"><button className="action-secondary" onClick={copyMessage} disabled={!message.trim()}>คัดลอกข้อความ</button><button className="action-primary" disabled={!message.trim()} onClick={() => window.dispatchEvent(new CustomEvent("insurance-chat", { detail: { draft: message.trim(), category } }))}>เปิดแชต ↗</button></div>{copyNotice && <p className="browse-refine-hint" role="status">{copyNotice}</p>}</details></div>}
    {notice && <p className="browse-refine-notice" role="alert">{notice}</p>}
  </section>;
}
