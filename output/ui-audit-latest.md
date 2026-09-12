# Independent UI recheck — 12 September 2026

Current local production was inspected using a fresh Chrome audit tab. No customer data/reset actions or Chat messages were submitted. Screenshots were visually inspected in the tool transcript; no new screenshot files were saved. This is bounded QA, not all-control release approval.

## Observed dimensions and interactions

| Surface | Actual DOM viewport | Result |
|---|---|---|
| Home desktop | 2048 × 1081 | document scrollWidth2036; no horizontal overflow. All visible links/buttons/selects/summaries measured at least44×44px. Bright photographic hero, left headline, centered black CTA and facts section retained. CTA navigated to Browse. |
| Browse mobile | 390 × 844 | document scrollWidth378; no outer overflow. Filters stack vertically; categories scroll within their own strip. Selected-plan summary and Compare action visible. |
| Compare mobile | 390 × 844 | document scrollWidth378; two plan columns and third full-width slot. Centered heading and Specialist CTA, distinct photos. Native select truncates long names but full names appear below photos. |
| Compare table keyboard | 390 × 844 | Named region with tabindex0,600px content within338px container. ArrowRight focused region and moved scrollLeft to1.6; visible blue outline. This proves keyboard scrolling begins, not exhaustive end-to-end table navigation. |
| Mobile menu | 390 × 844 | Enter opened native summary; Escape closed it, restored SUMMARY focus with visible outline. |
| Chat mobile | 390 × 844 | Dialog measured390.4×844 at x0/y0 (fractional rounding), full viewport screenshot. Open focuses Close; closing returns launcher focus. Mode/provenance labels present. No messages sent. |

Requested responsive dimensions were488×1055 because browser scaling produced actual390×844; all values above came from DOM, not request parameters. Temporary viewport override was reset.

## Residual finding

**Medium — Send hit target:** mobile Chat send button is42×44px; Close is44×44px, mode select348.8×44px, quick actions108×44px and121.1×44px. The send width misses the explicit44px minimum. Reported to implementing agent; resolution needs fresh measurement after rebuild.

## Reviewer rubric

Scale0 absent/broken,5 major gaps,8 consistent with smaller gaps,10 fully verified. These are subjective reviewer scores, not user-study metrics or pixel-diff percentages.

| Metric | /10 | Basis |
|---|---:|---|
| Apple visual language | 8 | Restrained palette, photographic hero/product surfaces, clear hierarchy. Browse remains relatively dense. |
| Figma structural fidelity | 7 | Home and revised Compare structures match prior referenced frame mapping; revised policy image grid verified in preceding independent screenshot round. Figma itself was not reread in this round; no pixel-match claim. |
| Simplicity | 8 | Single Home CTA, three explicit Compare slots, native mobile menu. Browse filters and Chat summary still have substantial information density. |
| Avoiding generic AI visual patterns | 8 | Photography and restrained controls; no gratuitous gradients/glow. Some category artwork remains generic per prior audit. |
| Responsive/accessibility sample | 8 | No sampled outer overflow, keyboard region/menu and dialog focus work.42px Send target outstanding; contrast,200% zoom, full screen-reader and all-control matrix not completed. |

Chat factual quality, complete broker journeys, and insurance-source validity are outside this UI-only recheck. No overall release score is assigned.

## Latest rebuilt regression follow-up

Independent browser actions on the newer production build supersede earlier target failures:

- PASS: Browse back link measured110.5×44px; Detail source link117.8×44px; Chat Send44×44px.
- PASS: canonical health price visibly says starting price; condition paragraph states it is not a quote for the displayed tier. Essential OPD shows optional rider/selection caveat.
- PASS: known per-disease source disclosure expanded to insurer, exact table locator, checked2026-09-12 and effective-date unknown.
- ISSUE: unknown annual-limit disclosure expands with only its own summary text and no body. Hide empty disclosure or explain absent evidence.
- PASS: quick-budget prompt Cancel dismisses; Confirm followed by Account navigation showed20000. Budget restored blank afterward. No message submitted.
- PASS: same-category health policy help directly opened Chat with DEMO-HLT-0002 and the expected plan prefilled. Different-category motor help Cancel restored the exact help-button focus; Confirm opened Chat with DEMO-MTR-0001 and Close focused.
- ISSUE: current MyInsurance screenshot shows detail and help text actions visually touching without separation. Their hit targets are separate but spacing should distinguish actions.
- Muted paragraph sample computed110/110/115 on white,12px. This is a style sample, not complete contrast compliance; no whole-page pass claimed.

Current screenshot rubric remains Apple8/10, Figma structure7/10, simplicity8/10, anti-slop8/10. Figma itself was not reread; health/life photos repeat, and data/evidence views are dense but purposeful. Latest actions do not establish all-feature release approval. No code/build/server edits performed.

## Final three-finding verification after rebuild

- PASS: health-02 unknown annual/per-admission/deductible values no longer expose empty source disclosures. Known per-disease disclosure was clicked and displays insurer, table locator and checked date.
- PASS: policy details/help actions now occupy separate44px rows (first card action y542 then y586). Settled screenshot confirms all4 photos loaded; DOM naturalWidth1672 for each. An earlier immediate screenshot preceded image paint and was superseded by this settled view.
- PASS: health-01 versus health-03 price row reads “ฐานหรือเงื่อนไขต่างกัน เทียบตรง ๆ ไม่ได้”, with starting-price versus profile-specific example conditions visible. Does not falsely claim different premium periods.
- Fresh Figma reference attempt could not claim Chrome tab240549639 because it belongs to another active browser session. No design modified; Figma score remains limited to earlier reference mapping, no independent fresh pixel comparison.

All3 newly assigned regression points passed their bounded checks. Owner reports of200% text and full customer journeys are separate evidence; this auditor does not relabel them independently verified. Rubric remains8/7/8/8 (Apple/Figma structure/simplicity/anti-slop).

Final P2/Chat-style supplement: independent latestproduction screenshot confirms charcoalChat, whiteheader/composer and pinkClose. ExactFigma reference remains owner-supplied, so structural score7/10 retained. See compare-control-final.md for resolved explicitURL0/1/2/3, quote-onlybudgetsection, subgroupdialog, and boundedBrowse→Detail→Compare→Chat regression proof.
