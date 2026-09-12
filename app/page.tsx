"use client";
import { useEffect, useState } from "react";
import Link from "@/components/native-link";
import "@/components/home-content.css";

const guide="https://www.oic.or.th/web-upload/migrated/content/85388/insur2_0.pdf";
const learning=[
 ["เลือกเรื่องที่ห่วง","ความกังวล · สิทธิเดิม · งบที่ไหว",guide],
 ["เทียบความคุ้มครอง","วงเงิน · เบี้ย · ข้อยกเว้น",guide],
 ["เช็กผู้ขาย","ตรวจใบอนุญาต กรอกข้อมูลตามจริง","https://www.muangthai.co.th/th/health-insurance-journey"],
 ["อ่านก่อนจ่าย","ชื่อ · แผน · วันคุ้มครอง · ช่องทางชำระ",guide],
 ["เก็บกรมธรรม์","เก็บช่องทางเคลมและวันต่ออายุ","https://www.muangthai.co.th/th/service"],
];
const promotions=[
 {category:"รถยนต์",insurer:"AXA ประกันภัย",title:"ประกันรถยนต์",value:"18%",valueLabel:"ลดสูงสุด",image:"https://images.prismic.io/thailandgi-ktaxa/addik51ZCF7ETAaY_approve_AXANOW_tc_1200x640_th3.png?auto=format,compress",source:"https://www.axa.co.th/th/promotion/axanow",start:"2026-03-26",end:"2026-12-31",dates:"26 มี.ค. – 31 ธ.ค. 2569",copy:"สำหรับรถส่วนบุคคล ซื้อออนไลน์ตามช่องทางและเงื่อนไขที่กำหนด",conditions:"โค้ด AXANOW: ชั้น 1 ซ่อมอู่ลด 15%; ชั้น 2+/3+ ซ่อมอู่ลด 18%; พ.ร.บ. ลด 10% ไม่รวมอากรและ VAT เฉพาะลูกค้าออนไลน์ครั้งแรก ผู้เคยซื้อช่องทางอื่นต้องผ่านเงื่อนไขไม่มีเคลม 12 เดือน ผ่อน 0% ขึ้นกับยอดเบี้ยและบัตรที่ร่วมรายการ ไม่ใช่ราคาเสนอเฉพาะรถของคุณ"},
 {category:"เดินทาง",insurer:"MSIG ประกันภัย",title:"ประกันเดินทาง",value:"15%",valueLabel:"ส่วนลด",image:"https://www.msig-thai.com/sites/msig_th_revamp/files/2026-07/15STB_0.png",source:"https://www.msig-thai.com/th/promotion/enter-promocode-15stb-or-15ptt-get-e-coupone-voucher-worth-1000-thb-msig-travel-easy-plus",start:"2026-08-01",end:"2026-09-30",dates:"1 ส.ค. – 30 ก.ย. 2569",copy:"Travel Easy Plus รายเที่ยวหรือรายปี โค้ด 15STB หรือ 15PTT ลด 15% พร้อมของรางวัลตามเงื่อนไข",conditions:"คูปองขึ้นกับเบี้ยหลังส่วนลดต่อคน ต้องสมัคร MSIG Privilege และตอบแบบสอบถามภายใน 90 วันหลังรับ SMS ใช้ได้เมื่อกรมธรรม์เริ่มคุ้มครอง ตารางต้นทางระบุรางวัลสูงสุดที่ยอดมากกว่า 6,000 บาท แต่ยอดเท่ากับ 6,000 บาทยังไม่ชัดเจน ให้ยืนยันกับบริษัท ยกเลิกกรมธรรม์อาจถูกเรียกคืนรางวัล"},
 {category:"บ้าน",insurer:"MSIG ประกันภัย",title:"ประกันบ้าน",value:"15%",valueLabel:"ส่วนลด",image:"https://www.msig-thai.com/sites/msig_th_revamp/files/2026-08/15.png",source:"https://www.msig-thai.com/th/promotion/"+encodeURIComponent("กรอกโค้ด-home15- รับส่วนลด-15-สำหรับประกันภัยบ้านแทนรัก-รับ-starbucks-e-coupon-สูงสุด-600"),start:"2026-09-01",end:"2027-01-31",dates:"1 ก.ย. 2569 – 31 ม.ค. 2570",copy:"ประกันบ้านแทนรัก โค้ด Home15 พร้อม Starbucks e-Coupon ตามยอดเบี้ย",conditions:"คูปองขึ้นกับเบี้ยหลังส่วนลดต่อกรมธรรม์ ต้องตอบแบบสอบถามภายใน 90 วันหลังรับ SMS และใช้ได้เมื่อเริ่มคุ้มครอง ตารางเกณฑ์รางวัลสูงสุด 600 บาทในต้นทางพิมพ์ยอดไม่ชัดเจน จึงยังยืนยันยอดที่เข้าเกณฑ์นี้ไม่ได้ โปรดตรวจสิทธิ์กับบริษัท ไม่ใช่ผู้ซื้อทุกคนได้รับรางวัลสูงสุด"},
];
export default function Home(){
 const [today,setToday]=useState<string|null>(null);
 useEffect(()=>{const update=()=>setToday(new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Bangkok",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()));const initial=setTimeout(update,0),clock=setInterval(update,60_000);return()=>{clearTimeout(initial);clearInterval(clock);};},[]);
 const active=today?promotions.filter(p=>p.start<=today&&today<=p.end):[];
 return <main className="home-page">
  <section className="draft-hero" aria-labelledby="hero-title"><img src="/images/insurance-life-hero.png" alt="ครอบครัวเดินเคียงกันในบ้านที่เปิดรับแสงธรรมชาติ" fetchPriority="high"/><h1 id="hero-title">เลือกประกันที่ใช่<br/><span>สำหรับคุณ</span></h1><Link href="/chat?start=1" className="hero-action">เริ่มค้นหาประกัน</Link></section>
  <section className="home-promotions" aria-labelledby="promotions-title"><div className="section-heading"><h2 id="promotions-title">โปรโมชัน</h2><p>ส่วนลดที่น่าสนใจ</p></div><div className="promotion-grid">{active.map(p=><article className="promotion-card" key={p.source}><img className="promotion-image" src={p.image} alt={`ภาพโปรโมชันทางการ ${p.insurer}: ${p.title}`} loading="lazy"/><div className="promotion-body"><p>{p.insurer}</p><h3>{p.title}</h3><p className="promotion-value-label">{p.valueLabel}</p><p className="promotion-value">{p.value}</p><p className="promotion-dates">{p.dates}</p><details className="promotion-conditions"><summary>ดูเงื่อนไข<span className="sr-only">: {p.title}</span></summary><p>{p.copy}</p><p>{p.conditions}</p><a className="text-link" href={p.source} target="_blank" rel="noopener noreferrer">รายละเอียดจากบริษัท ↗</a></details></div></article>)}</div>{today&&active.length===0&&<p>ยังไม่มีโปรโมชัน</p>}<p className="home-promotion-note">สิทธิ์ตามเงื่อนไขบริษัท</p></section>
  <section className="home-learning purchase-guide" aria-labelledby="learning-title"><div className="section-heading"><h2 id="learning-title">ก่อนซื้อประกัน</h2><p className="learning-intro">5 เรื่องที่ควรรู้</p></div><ol className="purchase-steps">{learning.map(([title,copy],i)=><li key={title}><span className="purchase-number" aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol><details className="home-guide-reference"><summary>อ่านเพิ่มเติม</summary><ul>{[...new Set(learning.map(item=>item[2]))].map((source,index)=><li key={source}><a href={source} target="_blank" rel="noopener noreferrer">{["คู่มือเลือกประกัน","เตรียมตัวก่อนซื้อ","การดูแลกรมธรรม์"][index]} ↗</a></li>)}</ul></details><Link href="/browse" className="text-link">ดูประกันทั้งหมด ›</Link></section>
  <footer className="site-footer"><span>Insurance · เว็บไซต์สาธิต</span><Link href="/broker">สำหรับผู้เชี่ยวชาญ ›</Link></footer>
 </main>;
}
