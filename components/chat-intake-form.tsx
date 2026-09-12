"use client";
import { useId, useState } from "react";
import { formatIntakeAnswer, getIntakeFields, intakeTemplates, type IntakeCard } from "@/lib/chat-intake";

export function ChatIntakeForm({card,disabled,current,onSubmit}:{card:IntakeCard;disabled:boolean;current:boolean;onSubmit?:(text:string)=>void}) {
 const id=useId();
 const [values,setValues]=useState<Record<string,string>>({});
 const [error,setError]=useState("");
 const fields=getIntakeFields(card);
 if(!current)return <div className="chat-intake-history">{fields.map(field=>field.label).join(" · ")}</div>;
 return <form className="chat-intake" aria-labelledby={`${id}-title`} onSubmit={event=>{
  event.preventDefault();
  if(disabled||!onSubmit)return;
  try{const text=formatIntakeAnswer(card,values);setError("");onSubmit(text);}catch{setError("กรอกอย่างน้อย 1 ช่อง หรือพิมพ์คุยต่อได้เลย");}
 }}>
  <h3 id={`${id}-title`}>{intakeTemplates[card.category].title}</h3>
  <div className="chat-intake-fields">
   {fields.map(field=><label key={field.key} htmlFor={`${id}-${field.key}`}><span>{field.label}</span>
    {field.options?<select id={`${id}-${field.key}`} className="field" disabled={disabled} value={values[field.key]??""} onChange={event=>setValues({...values,[field.key]:event.target.value})}>
     <option value="">{field.placeholder}</option>
     {field.options.map(option=><option key={option}>{option}</option>)}
     <option>ยังไม่แน่ใจ</option>
    </select>:<input id={`${id}-${field.key}`} className="field" disabled={disabled} value={values[field.key]??""} maxLength={160} placeholder={field.placeholder} inputMode={field.key==="motor_year"?"numeric":"text"} onChange={event=>setValues({...values,[field.key]:event.target.value})}/>}
   </label>)}
  </div>
  {error&&<p role="alert" className="chat-card-error">{error}</p>}
  <button className="action-primary" disabled={disabled||!onSubmit||!Object.values(values).some(value=>value.trim())}>ส่งข้อมูล</button>
 </form>;
}
