# Refreshed UI audit — 12 September 2026

## Final rebuilt disposition

Focused independent retest completed after the final40-record deployment. `output/playwright/refresh-final.js` / `output/refresh-final-raw.txt` record actual Home1440×900 and390×844 plus Browse390×844. The earlier promotion hit-target failure is **RESOLVED**: all3 summaries measure exactly44px high at both sizes (width330.66–330.67px desktop,294px mobile). All3 again passed Enter-open/Space-close at each size. Learning headings are now21px/600 at both sizes and visibly differentiated from descriptions; weak hierarchy finding resolved.

Home and mobile Browse document overflow remains0px. All9 current mobile Browse images loaded successfully after actual scroll/decode. Seven use the same illustrative health-category image; this retained visual limitation does not imply insurer-specific photography. No source data or Account changes made. Final captures: `refresh-home-final-1440.png`, `refresh-home-final-390.png`, `refresh-browse-final-390.png`. This retest supersedes the pending disposition below; unchanged flows were not rerun or claimed anew. Visual scores remain reviewer judgments, with Draft comparison structural rather than pixel-level.

Independent browser review of local build at `http://127.0.0.1:8787`, isolated Playwright CLI session `refresh-ui`. No Account changes, product edits, build or restart. This report covers the four refreshed surfaces, not every existing product acceptance test.

## Executed evidence

Harness: `output/playwright/refresh-ui-audit.js`; result: `output/refresh-ui-metrics.json`. Actual DOM sizes were 1440×900 and 390×844, not inferred from screenshot scaling.

| Surface | Actual widths | Document horizontal overflow | Visible control target check | Actions actually executed |
|---|---|---|---|---|
| Home | 1440, 390 | PASS: 0px both | FAIL: 3 promotion summaries height 23.39px each; other measured controls ≥44px | All 11 education/promotion disclosures: keyboard Enter opens, Space closes; hero Enter opens Chat, Escape closes |
| Browse, health | 1440, 390 | PASS: 0px both | PASS: no visible measured controls below44px | Page rendered; separate mobile scroll/decode verified all7 plan images loaded. No browse filters retested in this scoped run |
| Compare, 2 health plans | 1440, 390 | PASS: 0px both | PASS: no visible measured controls below44px | Third picker Enter opens; groups present; Escape closes and restores trigger focus; reopen→ArrowDown→Enter selects Health สุขใจ S and URL becomes3ids |
| My Insurance | 1440, 390 | PASS: 0px both | PASS: no visible measured controls below44px | Rendered four policy cards; policy disclosures were not interacted with again in this run |

All three official promotion images loaded at both widths: AXA natural width1200, MSIG travel1440, MSIG home1400. Initial mobile Browse full-page screenshot includes offscreen lazy placeholders; these are not broken images. Follow-up actual scrolling and decode proved 7/7 loaded and produced `refresh-browse-390-loaded.png`.

Picker group labels observed: เมืองไทยประกันชีวิต / เอไอเอ / อลิอันซ์ อยุธยา ประกันภัย. AXA's two selected products are omitted from the available third-slot choices. The mobile popup fits the viewport and selected option has a clear blue focus indicator. No pixel-level contrast measurement was repeated here.

## Visual judgment

Scores are reviewer judgments, not objective similarity percentages or a WCAG certification.

| Metric | Score | Observed reason |
|---|---:|---|
| Apple visual language | 8/10 | Restrained white/gray surfaces, large headings, sparse navigation, product-style gallery and restrained blue links. Compare list is readable but necessarily denser than an Apple marketing page |
| Draft structural fidelity | 8/10, limited | Home thin navigation/photo hero/left title/center lower CTA; Compare centered heading and3slots; policy2×2 desktop photo cards with corner dates match previously inspected Figma structure. Figma was not freshly inspected during this run; no pixel fidelity claim |
| Simplicity | 8/10 | Education and conditions use progressive disclosure; Browse brand tabs and grouped selectors clarify choices. Long mobile lists and dense comparison prose still require scrolling |
| Avoidance of generic AI styling | 7/10 | No gradient/glow/ornamental badges; genuine promotion imagery improves credibility. Browse uses the same health-care photo on5of7 cards, weakening product distinction and feeling templated |

## Findings and disposition

1. **44px regression:** all3 promotion condition summaries are23.39px high at both widths. Sent to root; root reports CSS fix queued. Not marked passed until rebuilt and measured.
2. **Education hierarchy:** current Home learning titles have weak visual distinction from descriptions. Root reports a heading CSS refinement already queued; no duplicate product edit made.
3. **Repeated imagery:** same health photo on5of7 Browse health records. This is a visual-quality limitation, not a broken asset. Prefer an official distinct product/brand asset when provenance is verified; do not invent insurer-specific photos.

Screenshots in `output/playwright/`: `refresh-{home,browse,compare,policies}-{1440,390}.png`, `refresh-picker-{1440,390}.png`, and `refresh-browse-390-loaded.png`. These are actual browser captures. Full-page files may be scaled by the viewer; use original dimensions for typography inspection.

## Optional official asset follow-up (not installed)

Bounded primary HTML discovery returned these exact URLs. No media downloaded and no catalog asset replaced. A page asset is not proof that every plan/tier is represented by its image.

- AIA Health Happy page: https://www.aia.co.th/th/our-products/health/aia-health-happy — image https://www.aia.co.th/content/dam/th-wise/images/th/our-products/2026/health-happy_d.PNG and mobile `health-happy_m.PNG` in the same directory.
- BLA Smart Saving10/1: https://www.bangkoklife.com/online/th/product/smartsaving101 — image https://www.bangkoklife.com/online/assets/images/products/smartSaving101/smartSaving-101-banner.jpg. Use only after exact catalog product matching; not interchangeable with other BLA savings plans.
- Prudential endowment page: https://www.prudential.co.th/th/products/savings/endowment/agency/pru-endowment/ — only verified brand logo found in bounded HTML inspection: https://www.prudential.co.th/content/dam/prudential-aem-lbu/plt/pru-thailand-logo.png.
- Allianz Beyond Care primary page: https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html — HTML asset fetch403; no guessed image URL.
