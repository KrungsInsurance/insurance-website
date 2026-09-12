# Independent design review — 12 September 2026

Reviewer: design_final, independent of implementation. Tested running local production at `http://127.0.0.1:8787` around 03:07–03:12 Bangkok, before the next final rebuild. No application code, server, Figma file or user browser was changed. A separate Playwright browser (`design-final`) was used.

## Scores

These are reviewer judgments on a 0–10 rubric, not automated similarity percentages or a user study. 10 means the criterion is consistently satisfied in reviewed surfaces; 5 means mixed; 0 means absent.

| Metric | Score | Evidence and deductions |
|---|---:|---|
| Apple visual direction | 8.0 | Photography leads Home/plan pages; ample white space, strong headings, blue actions, thin dividers, subdued chrome. Browse is more boxed and form-heavy than the reference gallery direction. Thai/system typography is readable but does not replicate SF Pro. |
| Figma structural fidelity | 8.0 | Home five-link desktop navigation, full-width photo, upper-left title, lower centered black CTA; Compare centered heading + Specialist action + three plan slots; My Insurance two-column image tiles/date corners; dark Chat with white header/composer and pink close; black compact Offer. Remaining reference differences are listed below. This is a structural assessment from the Figma reference observations supplied by the root reviewer, not a fresh pixel-level Figma export comparison. |
| Simplicity | 7.5 | Home and policy cards have clear priorities. Compare's detailed price scenarios wrap extensively on mobile. Chat's three quick actions wrap to two rows on mobile, reducing message area; still usable. Browse has filters, selection strip and cards competing in first screen. Necessary price caveats should be retained. |
| Avoidance of generic AI UI patterns | 8.0 | No decorative gradients, glow, floating statistics or ornamental icon grids in reviewed screens. Consistent photographic subject matter and restrained color. Repeated family/gym photography across different policies and generic illustration-style insurance folder keep the result below a custom editorial design. This metric does not claim to detect how assets were produced. |
| Reviewed interaction accessibility | 8.5 | All measured rendered targets ≥44px; Chat focus trapped and restored; strong inspected color pairs. Deduction/limit: no screen-reader run, real software keyboard, native 200% browser zoom or every conditional state tested in this review. |

## Figma component mapping and remaining differences

| Surface | Current rendering observed | Reference relationship / remaining difference |
|---|---|---|
| Home | Large laptop/insurance photo, title top-left, black pill CTA near image bottom; knowledge section follows | Main placement matches reference description. Reference title had outlined lettering/angled translucent label; current title is flat black without label. Photo is an approximation of the subject, not the exact draft asset. Mobile crop partly removes insurance folder, while title and CTA remain visible. |
| Compare | Centered heading and blue Specialist action, three selector/photo/price columns on desktop | Matches draft hierarchy. Real-data scenarios and category control add functional content. At390px, two selected cards share a row and empty third card occupies a separate full-width row; this increases scroll length. Native selectors truncate long selected names, with full names directly below. |
| My Insurance | Two-column photographic tiles on desktop; title strip top and white date corner bottom-right; one column mobile | Strong structural match. Actual photos/type/logo treatments differ from draft's insurer poster artwork. Extra status/details/help actions are functional additions. |
| Chat Overlay_1 | Charcoal shell, white header and composer, gray message bubble, pink close, blue send | Major correction from earlier all-white panel. Draft yellow/green avatar circles are absent and title says “ผู้ช่วยเลือกประกัน” rather than draft “Chat กับ Specialist”; the current title correctly distinguishes AI from a human. Larger composer adds required controls. No claim of exact frame sizing. |
| Offer | Compact black pill/rectangle, white “ปรึกษา Specialist”, pink close | Closely follows supplied draft shape/color/action. Actual rendered CTA126.5×44px and close44×44px. Tested via synthetic score fixture, not the natural threshold journey. |
| Browse | Category chips, filter row, selected-plan strip, three photographic cards desktop | Draft was comparatively sparse/placeholder based; implementation fills required behavior. It is the densest marketing surface. No exact Figma fidelity claim beyond category/page hierarchy. |
| Detail / Account / Broker | Detail screenshot and route geometry inspected; Account/Broker geometry inspected in initial state | No sufficiently detailed Figma frame reference in this review, so they are excluded from per-page fidelity scoring. Broker work-completion belongs to separate functional QA evidence. |

No newly observed critical visual defect requires a product change from this review. The above differences are explicit design tradeoffs and polish opportunities, not hidden behind a claim of pixel matching. Do not raise the score simply because more tests pass.

## Actual checks

- Screenshot inspection: Home, Chat, Compare(two health plans), My Insurance at1440×900 and390×844. Browse, health Detail and Offer at1440×900. These are viewport screenshots, not every scroll position or all breakpoints.
- Geometry: Home, Browse, health Detail, populated Compare, My Insurance, Account, Broker initial state at390×844 and1440×900: **14/14 had document width equal to viewport**, with no rendered `a/button/input/select/summary/textarea` target under44px. Checkbox/radio targets use their wrapping label area. Offscreen horizontal compare content is not misclassified as page overflow. This does not cover every conditional modal/control.
- Chat: **16 successive Tab presses at each viewport stayed within the dialog**. Escape closed it and returned focus to “เปิด AI Chat”. One immediate desktop read occurred before focus restoration (`null`); subsequent settled snapshot and active-element inspection confirmed the launcher. Mobile screenshot visibly shows its focus ring.
- Chat dimensions: mobile390×844 full viewport; desktop400×740. Close44×44; send44×44.39; all three quick actions44px high; composer input44.39px high.
- Mobile menu: focused native summary, Enter opened, Tab reached Home, Space on summary closed. The first harness used a text locator that did not resolve; switching to the observed native `nav summary` element completed the check. This was a harness locator issue, not an application failure.
- Offer: isolated browser fixture set score80/offerSeen=false, then reload rendered the real component. Close removed Offer and focused Chat launcher. This verifies rendering/close/focus only; it does not prove the deferred-offer root fix or natural conversion flow.
- Contrast sampled from actual computed styles: header ink/white16.83:1, muted text/charcoal9.28:1, white/assistant bubble10.01:1, dark close icon/pink5.60:1. Standard action blue/white5.57:1. These pairs pass their applicable4.5:1 text or3:1 icon thresholds; not a full page contrast audit.

## Evidence artifacts

- `output/playwright/design-final-{home,chat,compare,policies}-{desktop,mobile}.png`
- `output/playwright/design-final-{browse,detail,offer}-desktop.png`
- `output/playwright/design-final-metrics.js` — repeatable route/target/focus inspection
- `output/playwright/design-final-offer.js` — explicitly labelled fixture-only Offer rendering/close check
- `output/playwright/design-final-menu.js` and `design-final-menu-mobile.png` — native menu keyboard check

## Limits before global completion

This review does not certify all features, all controls or WCAG conformance. The final rebuild must still be tied to the broader functional matrix, live Chat/data evaluation and Broker evidence. The root reviewer must make the final Figma comparison using its logged-in reference tab and retain the explicit styling differences above. No application changes were made by this reviewer.
