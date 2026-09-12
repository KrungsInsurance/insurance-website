"use client";

import { useId, useRef, useState } from "react";
import { Popover, Tooltip } from "radix-ui";
import { CircleHelp, X } from "lucide-react";
import { fieldTermKeys, insuranceTerms, type InsuranceTermKey } from "@/lib/insurance-terms";
import "./term-help.css";

export function TermHelp({fieldKey}:{fieldKey:string}) {
  const [pinned,setPinned]=useState(false);
  const [hovered,setHovered]=useState(false);
  const returningFocus=useRef(false);
  const titleId=useId();
  const key=fieldTermKeys[fieldKey]??fieldKey;
  if(!Object.hasOwn(insuranceTerms,key))return null;
  const term=insuranceTerms[key as InsuranceTermKey];
  const explanation=<><p className="term-help-description">{term.description}</p><p className="term-help-caution">{term.caution}</p></>;
  return <Popover.Root open={pinned} onOpenChange={open=>{returningFocus.current=!open;setPinned(open);setHovered(false);}}>
    <Tooltip.Provider delayDuration={350}><Tooltip.Root open={hovered&&!pinned} onOpenChange={open=>{if(!open||!returningFocus.current)setHovered(open);}}>
      <Tooltip.Trigger asChild><Popover.Trigger asChild><button type="button" className="term-help-trigger" onPointerEnter={()=>{returningFocus.current=false;}} onBlur={()=>{returningFocus.current=false;}} aria-label={`อธิบาย ${term.title}`}><CircleHelp size={17} aria-hidden="true"/></button></Popover.Trigger></Tooltip.Trigger>
      <Tooltip.Portal><Tooltip.Content className="term-help-panel term-help-tooltip" sideOffset={6} collisionPadding={16}><strong className="term-help-title">{term.title}</strong>{explanation}<span className="term-help-hint">คลิกเพื่อเปิดค้างและดูแหล่งอ้างอิง</span></Tooltip.Content></Tooltip.Portal>
    </Tooltip.Root></Tooltip.Provider>
    <Popover.Portal><Popover.Content className="term-help-panel" sideOffset={6} collisionPadding={16} aria-labelledby={titleId}>
      <div className="term-help-heading"><strong id={titleId} className="term-help-title">{term.title}</strong><Popover.Close asChild><button type="button" className="term-help-close" aria-label="ปิดคำอธิบาย"><X size={18} aria-hidden="true"/></button></Popover.Close></div>
      {explanation}<a className="term-help-source" href={term.source} target="_blank" rel="noreferrer">อ่านแหล่งอ้างอิง <span aria-hidden="true">↗</span></a>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}
