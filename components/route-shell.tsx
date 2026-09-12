import Link from "@/components/native-link";
import { ArrowLeft } from "lucide-react";

export function RouteShell({ title, description }: { title: string; description: string }) {
  return (
    <main className="min-h-screen bg-white px-5 py-8 text-[#1d1d1f] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-[#e0e0e0] bg-[#f5f5f7] p-6 sm:p-10">
          <p className="text-sm font-semibold text-[#0066cc]">โหมดสาธิต · ข้อมูลตัวอย่าง</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h1>
          <p className="mt-4 leading-7 text-[#6e6e73]">{description}</p>
          <Link href="/" prefetch={false} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0066cc] px-5 font-medium text-white hover:bg-[#0071e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
