# Discovery refresh — 12 September 2026

Status: DONE locally. One team per workstream; root integrated and verified all five. Local production is running at http://127.0.0.1:8787.

## Implemented acceptance

1. Persona: gender follows age; annual budget ranges remain ranges. “ให้เราออกแบบให้” opens simulated Your Data consent. Accept and Decline both work without network integration. Avatar changes dissolve and respect reduced motion. Existing saved personas still load.
2. Interests: selecting a category collapses unrelated choices; clicking that selected category again restores all categories. Previous priorities cannot leak into another category. No avatar/name/age recap in step 2. Keyboard focus remains usable.
3. Chat: “เบี้ยประกันคืออะไร” receives a short definition before one contextual follow-up. Concern and existing-coverage replies become supported customer facts. Questions-first mode does not produce unsolicited plans. Initial comparison appears once; follow-up terminology questions do not repeat it. Live behavior verified separately from offline demo.
4. Browse: every category has relevant questions; motor class/vehicle context supported. Only facts present in the catalog filter products. Unknown and quote-only products are not silently treated as matching prices or eligibility. Reset and URL/category switching remain functional. Record official HeyGoody sources and distinguish inspected flow from inferred design choices.
5. Compare: personalization precedes product features, using explicitly selected topics or supported customer quotes. No invented financial situation, eligibility, positive fit from negated needs, or price-fit claims from starting prices. Brief table preserves numbers, units, optional cover and unknown states; full conditions and sources remain accessible.

## Browser verification on local production

- Desktop 1440×1000 and mobile 390×844: reviewed persona, consent, simplified interests, Browse and Compare visually. All seven Browse questionnaires reported page width/scrollWidth 390/390. Compare scrolls inside its 348px region (table scrollWidth 814px), without page overflow.
- Persona: selected gender, changed avatar age, opened both consent choices, continued after Decline, returned and accepted, then selected the 10,000–19,999 annual range. Step 2 toggled the selected category off, restored all seven choices and cleared previous-category priorities; no personal recap.
- Chat: automatic comparison created exactly one three-plan table. “เบี้ยประกันคืออะไร” answered directly, followed by a cost concern question. Additional customer replies produced no repeated table and preserved current coverage/frequency without calling them a concern. Terminology detail remains collapsed by default.
- Compare: selected interests produced per-plan reasons; expanding a reason showed the exact customer quote and official source. Annual budget range remained intact. Optional OPD was marked “ซื้อเพิ่ม”; cell expansion revealed basis/conditions/source. Difference checkbox and mobile cell disclosures worked.
- Browse: class 1 returned three actual plans, all quote-only; entered Toyota/Yaris/2022/birth-year context appeared in the editable summary without implying vehicle eligibility. All seven category-specific questionnaires rendered. Category-specific focus remains in insurer links. The chat action opened an editable draft, with a confirmation for cross-category selection and a working cancel path; it never sent automatically.
- Date regression found in browser was fixed by reading native FormData on submit: return-before-departure now displays an error while retaining both dates; a valid date pair appears in the saved summary. Multi-line Browse drafts use separators in the shared single-line chat composer so editing cannot join field labels together.

## Integration checks

- Final: `npm test` 129/129 passed; `npx tsc --noEmit` passed; `npm run lint` 0 errors and 7 existing image warnings; `npm run build` passed; restarted `npm run start` and verified the final build in browser. `git diff --check` passed.
- Final context recall: “ฉันชื่ออะไร” returned “คุณบอกว่าชื่อเล่น ‘แพท’” from the actual user opening, with zero cards. Tests also verify that assistant-authored names are not treated as customer evidence.
- Live prompt/tool behavior tested with mocked upstream responses. The visible browser tests used the explicitly labelled offline demo, not a real ChatGPT request.
- Your Data remains UI-only. No real customer communication or purchase is performed.
- Miro: SYNC PENDING; no callable Miro tool in this session.
