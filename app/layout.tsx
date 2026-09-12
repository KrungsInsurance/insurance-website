import type { Metadata } from "next";
import "./globals.css";
import "./motion.css";
import "./luxury.css";
import { DemoProvider } from "@/components/demo-provider";
import { SiteNav } from "@/components/site-nav";
import { ChatWidget } from "@/components/chat-widget";

export const metadata: Metadata = {
  title: "Insurance · เลือกประกันที่ใช่สำหรับคุณ",
  description: "เดโมค้นหาและเปรียบเทียบประกัน พร้อมคุยกับผู้เชี่ยวชาญ",
  robots: { index: false, follow: false },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased luxury-ui"><DemoProvider><SiteNav />{children}<ChatWidget /></DemoProvider></body>
    </html>
  );
}
