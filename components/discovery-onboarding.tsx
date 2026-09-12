"use client";

import Link from "./native-link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertDialog } from "radix-ui";
import { ArrowLeft, ArrowRight, CarFront, Check, Handshake, HeartPulse, House, MessageCircle, Plane, Search, ShieldPlus, Users, X } from "lucide-react";
import { ageBands, budgetBands, genderOptions, personaBudgetLabel, priorityTopics, selectPersonaPlans, type AgeBand, type BudgetBand, type DiscoveryPersona, type PersonaGender, type YourDataConsent } from "@/lib/discovery-persona";
import { categories, type Category } from "@/lib/types";
import { categoryLabels } from "./chat-cards";
import "./discovery-onboarding.css";

const categoryIcons = { health: HeartPulse, motor: CarFront, life: Users, accident: ShieldPlus, travel: Plane, property: House, liability: Handshake, pet: ShieldPlus, "critical-illness": HeartPulse, cyber: ShieldPlus, business: House, event: Users, sports: ShieldPlus };
const journeys = [
  { id: "browse", icon: Search, title: "เลือกดูเอง", description: "ดูแผนและเปรียบเทียบด้วยตัวเอง", action: "ดูแผนประกัน", detail: "" },
  { id: "compare", icon: Users, title: "เทียบกับผู้ช่วย", description: "ดู 3 แผนพร้อมตารางเปรียบเทียบ", action: "ดู 3 แผนกับผู้ช่วย", detail: "ChatGPT · Live" },
  { id: "ask", icon: MessageCircle, title: "ถามก่อนเลือก", description: "เริ่มจากคำถาม ยังไม่ต้องเลือกแผน", action: "เริ่มคุย", detail: "ChatGPT · Live" },
] as const;

type Props = {
  initialPersona?: DiscoveryPersona;
  onComplete: (persona: DiscoveryPersona) => void;
  onCancel?: () => void;
};

export function DiscoveryOnboarding({ initialPersona, onComplete, onCancel }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState(initialPersona?.nickname ?? "");
  const [ageBand, setAgeBand] = useState<AgeBand | null>(initialPersona?.ageBand ?? null);
  const [budgetBand,setBudgetBand]=useState<BudgetBand|undefined>(initialPersona?.budgetBand);
  const [gender,setGender]=useState<PersonaGender|undefined>(initialPersona?.gender);
  const [yourDataConsent,setYourDataConsent]=useState<YourDataConsent|undefined>(initialPersona?.yourDataConsent);
  const [consentOpen,setConsentOpen]=useState(false);
  const [previousArt,setPreviousArt]=useState<string|null>(null);
  const [category, setCategory] = useState<Category | null>(initialPersona?.category ?? null);
  const [priorities, setPriorities] = useState<string[]>(initialPersona?.priorities ?? []);
  const [collapsed, setCollapsed] = useState(Boolean(initialPersona?.category));
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const ageInput=useRef<HTMLSelectElement>(null);
  const budgetInput=useRef<HTMLSelectElement>(null);
  const nicknameInput = useRef<HTMLInputElement>(null);
  const character = ageBands.find(band => band.id === ageBand);
  const compareCount = step === 3 && ageBand && category
    ? selectPersonaPlans({ nickname, ageBand, category, priorities, journey: "compare" }).length : 3;

  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => {
    if (!category || collapsed) return;
    const timer = window.setTimeout(() => setCollapsed(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
    return () => window.clearTimeout(timer);
  }, [category, collapsed]);

  function next(event: FormEvent) {
    event.preventDefault();
    if (step === 1) {
      if (!nickname.trim()) { setError("กรอกชื่อเล่น"); nicknameInput.current?.focus(); return; }
      if (!ageBand) { setError("เลือกช่วงอายุ"); ageInput.current?.focus(); return; }
      if (budgetBand === "unknown" && !yourDataConsent) { setConsentOpen(true); return; }
      setNickname(nickname.trim());
      setStep(2);
    } else if (step === 2) {
      if (!category || !priorities.length) { setError("เลือกประเภทประกันและหัวข้อที่สนใจอย่างน้อย 1 ข้อ"); return; }
      setStep(3);
    }
    setError("");
  }

  function selectCategory(value: Category) {
    setPriorities([]);
    setCategory(category === value ? null : value);
    setCollapsed(false);
    setError("");
  }

  function togglePriority(id: string) {
    if (priorities.includes(id)) setPriorities(priorities.filter(value => value !== id));
    else if (priorities.length < 3) setPriorities([...priorities, id]);
    setError("");
  }

  function complete(journey: DiscoveryPersona["journey"]) {
    if (!ageBand || !category || !nickname.trim() || !priorities.length) return;
    onComplete({ nickname: nickname.trim(), ageBand, budgetBand, gender, yourDataConsent, category, priorities, journey });
  }

  if(step===1)return <section className="discovery-onboarding discovery-character" aria-label="เริ่มค้นหาประกัน">
    <header className="discovery-nav"><span className="discovery-brand">ประกันที่เริ่มจากคุณ</span>{onCancel?<button type="button" className="discovery-text-button" onClick={onCancel}><ArrowLeft size={17} aria-hidden="true"/>กลับไปแชต</button>:<Link href="/" className="discovery-text-button"><ArrowLeft size={17} aria-hidden="true"/>หน้าแรก</Link>}</header>
    <div className="discovery-character-layout">
      <div className="discovery-character-preview">
        <p className="discovery-character-eyebrow">ทำความรู้จักกัน · 1 / 3</p>
        <h1 ref={heading} tabIndex={-1}>สร้างตัวละครของคุณ</h1>
        <p className="discovery-intro">ประกันที่ใช่ เริ่มจากการรู้จักคุณ</p>
        <div className="discovery-character-art-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previousArt&&<img className="discovery-character-art discovery-character-art-previous" src={previousArt} alt="" aria-hidden="true" width={440} height={440}/>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={ageBand??"initial"} className={`discovery-character-art${previousArt?" discovery-character-art-arriving":""}`} src={(character??ageBands[0]).image} alt={character?`ตัวละครช่วงอายุ ${character.label}`:"ตัวอย่างตัวละคร เลือกช่วงอายุเพื่อเปลี่ยนภาพ"} width={440} height={440} onAnimationEnd={()=>setPreviousArt(null)}/>
        </div>
        <p className="discovery-character-name">{nickname.trim()?`นี่คือ ${nickname.trim()}`:"ตัวละครของคุณ"}</p>
        <p className="discovery-character-caption">{character?character.label:"ภาพจะเปลี่ยนตามช่วงอายุที่เลือก"}</p>
      </div>
      <form onSubmit={next} noValidate className="discovery-character-form">
        <h2>ข้อมูลของคุณ</h2><p>ใช้ชื่อเล่นได้</p>
        <div className="discovery-character-field"><label htmlFor="discovery-nickname"><span>01</span>ชื่อเล่น</label><input ref={nicknameInput} id="discovery-nickname" value={nickname} onChange={event=>{setNickname(event.target.value);setError("");}} placeholder="ชื่อเล่นของคุณ" autoComplete="nickname" maxLength={60} required aria-invalid={Boolean(error&&!nickname.trim())} aria-describedby={error?"discovery-error":undefined}/></div>
        <div className="discovery-character-field"><label htmlFor="discovery-age"><span>02</span>ช่วงอายุ</label><select ref={ageInput} id="discovery-age" value={ageBand??""} onChange={event=>{setPreviousArt(window.matchMedia("(prefers-reduced-motion: reduce)").matches?null:(character??ageBands[0]).image);setAgeBand(event.target.value as AgeBand);setError("");}} required aria-invalid={Boolean(error&&!ageBand)} aria-describedby={error?"discovery-error":undefined}><option value="" disabled>เลือกช่วงอายุ</option>{ageBands.map(band=><option key={band.id} value={band.id}>{band.label}</option>)}</select></div>
        <div className="discovery-character-field"><label htmlFor="discovery-gender"><span>03</span>เพศ <small>ไม่บังคับ</small></label><select id="discovery-gender" value={gender??"unspecified"} onChange={event=>setGender(event.target.value as PersonaGender)}>{genderOptions.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select></div>
        <div className="discovery-character-field"><label htmlFor="discovery-budget"><span>04</span>งบประกัน <small>ต่อปี · ไม่บังคับ</small></label><select ref={budgetInput} id="discovery-budget" value={budgetBand??""} onChange={event=>{const choice=event.target.value as BudgetBand|"";setBudgetBand(choice||undefined);setYourDataConsent(undefined);if(choice==="unknown")setConsentOpen(true);}} aria-describedby="discovery-budget-hint"><option value="">เลือกงบประมาณ</option>{budgetBands.map(band=><option key={band.id} value={band.id}>{band.label}</option>)}</select><p id="discovery-budget-hint">เลือกช่วงงบ หรือให้เราช่วยคิด</p>
          {budgetBand==="unknown"&&<div className="discovery-consent-status"><p role="status">{yourDataConsent==="accepted"?"ยินยอมในเดโมแล้ว · ยังไม่ได้เชื่อมข้อมูลจริง":yourDataConsent==="declined"?"ไม่ยินยอม · ค้นหาต่อได้":"ดูตัวอย่างการขอใช้ข้อมูลผ่าน Your Data"}</p><button type="button" className="discovery-text-button" onClick={()=>setConsentOpen(true)}>{yourDataConsent?"เปลี่ยนคำตอบ":"ดูคำขอความยินยอม"}</button></div>}
        </div>
        {error&&<p id="discovery-error" className="discovery-error" role="alert">{error}</p>}
        <button type="submit" className="discovery-next">เลือกเรื่องที่สนใจ<ArrowRight size={18} aria-hidden="true"/></button>
      </form>
    </div>
    <AlertDialog.Root open={consentOpen} onOpenChange={setConsentOpen}><AlertDialog.Portal>
      <AlertDialog.Overlay className="discovery-consent-overlay"/>
      <AlertDialog.Content className="discovery-consent-dialog" onCloseAutoFocus={event=>{event.preventDefault();budgetInput.current?.focus({preventScroll:true});}}>
        <span className="discovery-consent-badge">Your Data · ตัวอย่างในเดโม</span>
        <AlertDialog.Title>ใช้ข้อมูลเพื่อช่วยคิดงบ?</AlertDialog.Title>
        <AlertDialog.Description>ตัวอย่างคำขอใช้ข้อมูลทางการเงินผ่าน Your Data เพื่อช่วยทำความเข้าใจงบสำหรับประกัน คุณเลือกไม่ยินยอมและค้นหาประกันต่อได้</AlertDialog.Description>
        <p className="discovery-consent-demo-note">เดโมนี้บันทึกเฉพาะคำตอบในเบราว์เซอร์ ไม่มีการเชื่อมธนาคาร อ่าน หรือส่งข้อมูลจริง</p>
        <div className="discovery-consent-actions"><AlertDialog.Cancel className="discovery-consent-decline" onClick={()=>setYourDataConsent("declined")}>ไม่ยินยอม</AlertDialog.Cancel><AlertDialog.Action className="discovery-next" onClick={()=>setYourDataConsent("accepted")}>ยินยอม</AlertDialog.Action></div>
      </AlertDialog.Content>
    </AlertDialog.Portal></AlertDialog.Root>
  </section>;

  return <section className="discovery-onboarding" aria-label="เริ่มค้นหาประกัน">
    <header className="discovery-nav">
      <span className="discovery-brand">ประกันที่เริ่มจากคุณ</span>
      {onCancel ? <button type="button" className="discovery-text-button" onClick={onCancel}><ArrowLeft size={17} aria-hidden="true" />กลับไปแชต</button> : <Link href="/" className="discovery-text-button"><ArrowLeft size={17} aria-hidden="true" />หน้าแรก</Link>}
    </header>
    <div className="discovery-main">
      <div className="discovery-progress" aria-label={`ขั้นตอน ${step} จาก 3`}>
        <span>ทำความรู้จักกัน · {step} / 3</span>
        <div aria-hidden="true">{[1, 2, 3].map(value => <i key={value} data-complete={value <= step} />)}</div>
      </div>
      {step === 3 && character && <div className="discovery-persona-recap">
        {/* Generated local artwork is served directly by the demo's static asset pipeline. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={character.image} alt="" width={56} height={56} />
        <span><strong>{nickname}</strong><span>{character.label}{step === 3 && category ? ` · ประกัน${categoryLabels[category]}` : ""} · {budgetBand&&budgetBand!=="unknown"?personaBudgetLabel({budgetBand}):"ยังไม่ได้ระบุ"}</span></span>
      </div>}
      <h1 ref={heading} tabIndex={-1}>{step === 2 ? "สนใจประกันอะไร?" : "อยากเริ่มแบบไหน?"}</h1>
      {step === 3 && <p className="discovery-intro">เลือกดูเอง เทียบแผน หรือเริ่มจากคำถาม</p>}

      {step < 3 ? <form onSubmit={next} noValidate className="discovery-form">
          <fieldset className="discovery-category-fieldset">
            <legend className="sr-only">ประเภทประกันที่สนใจ</legend>
            <div className="discovery-category-grid" data-selected={Boolean(category)} data-collapsed={collapsed}>
              {categories.map(value => {
                const Icon = categoryIcons[value];
                const unrelated = Boolean(category && category !== value);
                return <button type="button" key={value} className="discovery-category-card" aria-pressed={category === value} hidden={collapsed && unrelated} tabIndex={unrelated ? -1 : 0} aria-hidden={unrelated || undefined} data-unrelated={unrelated} onClick={() => selectCategory(value)}>
                  <span className="discovery-category-icon"><Icon size={27} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span><strong>ประกัน{categoryLabels[value]}</strong>{category === value && <span>เปลี่ยนประเภท</span>}</span>
                  {category === value && <X className="discovery-category-check" size={20} aria-hidden="true" />}
                </button>;
              })}
            </div>
          </fieldset>
          {category && <fieldset className="discovery-priorities" key={category}>
            <legend>เน้นเรื่องไหน?</legend>
            <p id="discovery-priorities-hint">เลือก 1–3 เรื่อง <span aria-live="polite">· {priorities.length}/3</span></p>
            <div className="discovery-priority-grid" aria-describedby="discovery-priorities-hint">
              {priorityTopics[category].map(topic => {
                const selected = priorities.includes(topic.id);
                return <button type="button" key={topic.id} className="discovery-priority-card" aria-pressed={selected} disabled={!selected && priorities.length === 3} onClick={() => togglePriority(topic.id)}>
                  <span><strong>{topic.label}</strong></span>
                  <span className="discovery-priority-check" aria-hidden="true">{selected && <Check size={15} strokeWidth={3} />}</span>
                </button>;
              })}
            </div>
          </fieldset>}
        {error && <p id="discovery-error" className="discovery-error" role="alert">{error}</p>}
        <div className="discovery-actions">
          <button type="button" className="discovery-text-button" onClick={() => { setStep(1); setError(""); }}><ArrowLeft size={18} aria-hidden="true" />ย้อนกลับ</button>
          <button type="submit" className="discovery-next">เลือกวิธีเริ่มต้น<ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </form> : <div className="discovery-finish">
        <div className="discovery-selected-topics" aria-label="หัวข้อที่คุณสนใจ">{category && priorityTopics[category].filter(topic => priorities.includes(topic.id)).map(topic => <span key={topic.id}>{topic.label}</span>)}</div>
        <div className="discovery-journey-grid">
          {journeys.map(journey => {
            const Icon = journey.icon;
            return <button type="button" key={journey.id} className="discovery-journey-card" onClick={() => complete(journey.id)}>
              <span className="discovery-journey-icon"><Icon size={29} strokeWidth={1.6} aria-hidden="true" /></span>
              <strong>{journey.title}</strong>
              <span className="discovery-journey-description">{journey.id === "compare" ? `ดู ${compareCount} แผนพร้อมตารางเปรียบเทียบ` : journey.description}</span>
              <span className="discovery-journey-action">{journey.id === "compare" ? `ดู ${compareCount} แผนกับผู้ช่วย` : journey.action}<ArrowRight size={18} aria-hidden="true" /></span>
              {journey.detail&&<span className="discovery-journey-detail">{journey.detail}</span>}
            </button>;
          })}
        </div>
        <button type="button" className="discovery-step-back discovery-text-button" onClick={() => { setStep(2); setError(""); }}><ArrowLeft size={18} aria-hidden="true" />เปลี่ยนเรื่องที่สนใจ</button>
      </div>}
    </div>
    {step === 3 && <p className="discovery-footnote">เปลี่ยนความต้องการได้ในแชต</p>}
  </section>;
}
