import { PlanActions } from "@/components/plan-actions";
import Link from "@/components/native-link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { categoryFields, getPlan } from "@/lib/catalog";
import { formatCoverageCell } from "@/lib/display";
import { PlanPrice } from "@/components/plan-price";
import { planSections } from "@/lib/plan-sections";
import { shortBasis, shortCoverage, shortFieldLabel } from "@/lib/ui-copy";
import "@/components/plan-detail.css";

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = getPlan(id);
  if (!plan) return <main className="plan-detail"><div className="plan-detail-shell plan-detail-empty"><h1>ไม่พบแผนนี้</h1><Link href="/browse" prefetch={false} className="action-primary">ค้นหาประกัน</Link></div></main>;

  const fields = categoryFields[plan.category];
  const detailedFields = fields.filter(field => {
    const cell = plan.coverageCells[field.key];
    return cell.status === "known" && (typeof cell.value === "string" || cell.conditions.length > 0) || cell.status === "conflicting" || cell.conditions.length > 0;
  });
  const sourceLinks = [...new Map(plan.sources.map(source => [source.url, source])).values()];

  return <main className="plan-detail">
    <div className="plan-detail-demo">โหมดสาธิต</div>
    <div className="plan-detail-shell">
      <Link href={`/browse?category=${plan.category}`} prefetch={false} className="plan-detail-back"><ArrowLeft aria-hidden="true" size={17} />ดูแผนทั้งหมด</Link>
      <section className="plan-detail-hero" aria-labelledby="plan-title">
        <div className="plan-detail-art"><img src={plan.image} alt={`ภาพประกอบ ${plan.name}`} /></div>
        <div className="plan-detail-intro">
          <p className="plan-detail-insurer">{plan.insurer}</p>
          <h1 id="plan-title">{plan.name}</h1>
          {plan.tierLabel && !plan.name.includes(plan.tierLabel) && <p className="plan-detail-tier">{plan.tierLabel}</p>}
          <div className="plan-detail-price"><PlanPrice price={plan.price} compact className="plan-detail-price-value" /></div>
          {plan.price.kind === "example" && plan.price.scenario && <p className="plan-detail-price-note">{plan.price.scenario}</p>}
          <PlanActions plan={plan} />
        </div>
      </section>

      <div className="plan-detail-sections">
        {planSections[plan.category].map((section, index) => <section key={section.title} className="plan-detail-section" aria-labelledby={`coverage-${index}`}>
          <h2 id={`coverage-${index}`}>{section.title}</h2>
          <dl className="plan-detail-facts">
            {section.keys.map(key => {
              const field = fields.find(item => item.key === key);
              if (!field) return null;
              const cell = plan.coverageCells[key];
              const answer = shortCoverage(cell);
              const label = shortFieldLabel(key, field.label);
              const basis = shortBasis(cell);
              return <div key={key} className="plan-detail-fact">
                <dt>{label}{basis && !label.includes(basis) && <small className="plan-detail-basis">{basis}</small>}</dt>
                <dd className={cell.status === "known" ? "" : "plan-detail-unknown"}>
                  <span className={answer.length > 35 ? "plan-detail-long-value" : undefined}>{answer}</span>
                  {cell.inclusion === "optional" && cell.status === "known" && <small className="plan-detail-option">ซื้อเพิ่ม</small>}
                </dd>
              </div>;
            })}
          </dl>
        </section>)}
      </div>

      <details className="plan-detail-more">
        <summary><span>เงื่อนไขและข้อมูลเพิ่มเติม</span><ChevronDown aria-hidden="true" size={20} /></summary>
        <div className="plan-detail-more-body">
          {(plan.price.scenario || plan.price.includes) && <section><h3>ราคา</h3>{[plan.price.scenario, plan.price.includes].filter(Boolean).map(text => <p key={text}>{text}</p>)}</section>}
          <section><h3>คุณสมบัติผู้สมัคร</h3><p>{plan.eligibility}</p></section>
          {detailedFields.length > 0 && <section><h3>เงื่อนไขความคุ้มครอง</h3><dl className="plan-detail-conditions">{detailedFields.map(field => <div key={field.key}><dt>{shortFieldLabel(field.key, field.label)}</dt><dd>{formatCoverageCell(plan.coverageCells[field.key])}</dd></div>)}</dl></section>}
          {plan.exclusions.length > 0 && <section><h3>ข้อยกเว้น</h3><ul>{plan.exclusions.map(item => <li key={item}>{item}</li>)}</ul></section>}
          <section><h3>เอกสารจากบริษัท</h3><ul className="plan-detail-sources">{sourceLinks.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher} · {source.title}</a></li>)}</ul><p className="plan-detail-checked">ตรวจข้อมูล {plan.source.updatedAt}</p></section>
        </div>
      </details>
    </div>
  </main>;
}
