"use client";
import Link from "@/components/native-link";
import { usePathname } from "next/navigation";
const links = [["Home", "/"], ["My ประกัน", "/my-insurance"], ["เปรียบเทียบประกัน", "/compare"], ["Browse ประกัน", "/browse"], ["My Account", "/account"]];
export function SiteNav() {
 const pathname = usePathname();
 const broker=pathname.startsWith("/broker");
 const items = (broker?[["Dashboard ผู้เชี่ยวชาญ","/broker"],["กลับเว็บไซต์ลูกค้า","/"],["Browse ประกัน","/browse"]]:links).map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>);
 return <header className="site-nav"><nav aria-label={broker?"เมนูผู้เชี่ยวชาญ":"เมนูหลัก"}><div className="desktop-nav">{items}</div><Link className="mobile-brand" href={broker?"/broker":"/"}>{broker?"Insurance · Broker":"Insurance"}</Link><details className="mobile-nav" onKeyDown={event => { if(event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary>เมนู</summary><div>{items}</div></details></nav></header>;
}
