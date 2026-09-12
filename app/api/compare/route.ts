import { buildComparison, ComparisonError } from "@/lib/compare";
import { categories, type Category } from "@/lib/types";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: { code: "INVALID_INPUT", message: "รูปแบบข้อมูลไม่ถูกต้อง" } }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: { code: "INVALID_INPUT", message: "รูปแบบข้อมูลไม่ถูกต้อง" } }, { status: 400 });
  const input = body as { category?: unknown; planIds?: unknown };
  if (typeof input.category !== "string" || !categories.includes(input.category as Category) || !Array.isArray(input.planIds)) return Response.json({ error: { code: "INVALID_INPUT", message: "ต้องระบุหมวดและรายการแผน" } }, { status: 400 });
  try { return Response.json(buildComparison(input.category as Category, input.planIds as string[])); } catch (error) { if (error instanceof ComparisonError) { const status = error.code === "PLAN_NOT_FOUND" ? 404 : 400; return Response.json({ error: { code: error.code, message: error.message } }, { status }); } return Response.json({ error: { code: "INVALID_INPUT", message: "ไม่สามารถเปรียบเทียบแผนได้" } }, { status: 400 }); }
}

export function GET() { return Response.json({ error: { code: "METHOD_NOT_ALLOWED", message: "รองรับเฉพาะ POST" } }, { status: 405 }); }
