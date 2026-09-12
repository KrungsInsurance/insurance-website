# Independent UI audit — 12 September 2026

Scope: live local production at http://127.0.0.1:8787, Home, Browse, Compare (health-01 + health-02), My Insurance. Read-only product audit. Browser screenshots were inspected inline in the audit tool transcript; no screenshot files were saved by this auditor. Existing output/playwright images predate this audit and are not evidence of this build.

Scores below are a reviewer rubric, not objective measurements, a user study, or a pixel-diff percentage. 0 = absent/broken, 5 = recognisable but major gaps, 8 = consistent with minor gaps, 10 = reference-level completion. Figma scoring uses the frame structure supplied by the implementing agent (Slides 51–54); this auditor did not independently read the exact Figma canvas, so confidence is medium and pixel fidelity remains unverified.

| Dimension | Score /10 | Observed evidence |
|---|---:|---|
| Apple visual language | 7 | Restrained white/gray/blue, large hierarchy, thin navigation, photography-led Home, no gradients/glow. Dense filter and selection panels, repeated generic shield imagery on internal pages weaken the photographic direction. |
| Figma structural fidelity | 5 | Home is close to the supplied Slide54 mapping. Compare is left-aligned with a global chip selector, not the mapped centered heading/three selectors. My Insurance has a 2x2 layout but no images at all. |
| Simplicity | 7 | Home has one clear primary action. Browse filters are understandable but consume most of first viewport; Compare repeats title/selection/product/table information. |
| AI-slop avoidance | 7 | No decorative gradients, metrics or fake testimonials. Home has deliberate composition. Repeated generic shields and rounded gray panels across internal pages remain template-like. This score concerns appearance, not whether AI authored the code. |
| Responsive behavior | 7 | Home and Compare at 390x844 have document scrollWidth375 versus viewport390, no page-level horizontal overflow. Header itself scrolls sideways and hides Account initially. Mobile hero crops out most of laptop and document. |
| Accessibility spot-check | 7 | Home keyboard focus is visible (2px blue outline), headings and image alt text are exposed, main CTA49.6px and Chat56px. Home nav target is34.7x48px and misses the project44x44 target. Full screen-reader/contrast audit not performed. |

## Reproducible observations

- Desktop viewport1280x720: Home thin five-link nav, large left two-line Thai heading over a bright laptop/insurance-document hero, centered black bottom CTA, three educational statements below. Home CTA successfully navigated to Browse.
- Browse: seven category options, search, budget, sort, selection2/3, plan data cards. Compare link successfully opened `/compare?category=health&ids=health-01,health-02`.
- Compare: annual limit2.5m and per-disease10m are separate rows, unknown values show `ยังไม่ได้ระบุ`. This checks rendered separation only, not insurance accuracy. Generic shield cards repeat. Heading remains large and left-aligned; two products occupy the first two positions of a three-column grid.
- My Insurance: four articles and zero image elements in live DOM. Desktop two columns, mobile one column. Therefore only the2x2 structural portion of supplied Slide51 is implemented.
- At390x844: Home/Compare page width does not overflow; header requires horizontal scrolling. Mobile Home shows mostly blank wall while laptop and policy artwork are substantially cropped.
- Console error log for the four visited routes returned an empty list. This is a bounded navigation check, not all-feature coverage.

## Actionable findings sent to implementation

1. **High — Compare draft fidelity:** center the heading and specialist action and align selection controls with the actual product slots in the draft. Recheck with two and three products.
2. **High — My Insurance draft fidelity:** add the reference-led visual image composition; existing text-only cards do not meet the supplied draft.
3. **Medium — Mobile hero:** adapt image composition/position/height so document and laptop retain meaning at390px; current crop wastes the main photographic evidence.
4. **Medium — Nav target:** give Home a minimum44px width as well as48px height. Decide deliberate responsive navigation treatment rather than leaving Account hidden behind horizontal scrolling.
5. **Low — Internal-page imagery:** replace repeated generic shields only where actual Figma/category artwork is available; do not invent insurer logos.

## Limits and release interpretation

This audit does not score Chatbot factual quality or Broker flow; those need the separate functional audit. It does not establish pixel match, full WCAG compliance, mobile real-device behavior, or all insurance source validity. Findings refer to the build inspected before the implementing agent's follow-up fixes; rerun affected checks before claiming resolution.
