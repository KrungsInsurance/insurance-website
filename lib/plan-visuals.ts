import type { Category, Plan } from "./types.ts";

// Contextual photography is presentation only; catalog evidence and original art remain available.
const categoryPhotos: Record<Category, string> = {
  health: "/images/health-care.png", life: "/images/family-advice.png",
  motor: "/images/motor-car.png", accident: "/images/health-active.png",
  travel: "/images/products/travel-01.jpg", property: "/images/products/property-01.jpg",
  liability: "/images/insurance-hero.png", pet: "/images/plan-placeholder.svg",
  "critical-illness": "/images/health-care.png", cyber: "/images/insurance-hero.png",
  business: "/images/insurance-hero.png", event: "/images/plan-placeholder.svg",
  sports: "/images/health-active.png",
};
export function planVisual(plan: Pick<Plan, "id" | "name" | "category">) {
  if (plan.id === "health-01") return { src: "/images/products-health-life/axa-value.jpg", alt: "ภาพผลิตภัณฑ์ AXA SmartCare Value", caption: "ภาพผลิตภัณฑ์จาก AXA" };
  const src = plan.id === "health-07" ? "/images/family-advice.png" : categoryPhotos[plan.category];
  return { src, alt: `ภาพประกอบบริบทของ ${plan.name} ไม่ใช่หลักฐานความคุ้มครอง`, caption: plan.category === "travel" || plan.category === "property" ? "ภาพประกอบจาก AXA" : "ภาพประกอบ" };
}
export function categoryVisual(category: Category) { return category === "health" ? "/images/health-active.png" : categoryPhotos[category]; }
