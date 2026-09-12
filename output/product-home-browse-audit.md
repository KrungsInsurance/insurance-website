# Product image / Home audit — final rebuilt localhost,12Sep2026

Independent actual browser execution using isolated Playwright CLI refresh-ui. No Account/IAB/customer reset and no product-source edits.

## Executed PASS

- Home actual360×844,390×844,1440×900: order hero → three official promotion cards → five purchase steps. Zero insuranceDaily sections/duplicate cards. Hero and all3promotion images decoded,4/4 each size. Document overflow0px all3sizes.
- All3promotion summaries: Enter opens, Space closes at each size; measured44px high throughout. Visible focus outline observed in mobile screenshot. Five generic purchase steps retained, not IPD/OPD glossary.
- Browse all7categories actual390×844: health9,motor7,life6,accident7,travel7,property2,liability2 =40 images. Every image decoded with naturalWidth>0 after actual scrolling. Document overflow0px each category.
- Rendered image metadata independently counted:23 product /17 insurer. All40 have nonempty alt and official source link. Every insurer-kind card shows the visible caption “ภาพบริษัทประกัน”. No unlabelled insurer placeholder found.
- Filter navigation: clicked AXA brand tab in health; exactly SmartCare Value/Essential rendered. Checked both selection controls, clicked Value detail; Browse/detail/Compare used identical canonical Value image `/images/products-health-life/axa-value.jpg`. Compare additionally showed canonical Essential image. Returned Browse and clicked actual selection-bar Compare link; valid two-plan health URL opened.

## Visual review / limits

Viewed Home390 and Browse health/motor390 screenshots. Product photographs now differ where official exact-product pages supply different images. Health family tiers share an honestly labelled MTL logo; AIA clean logo and Allianz emblem are readable. Motor AXA pages show distinct actual official photography; BKI/Viriyah fallback logos are clearly labelled. No broken or stretched image observed in reviewed captures. Score for image provenance clarity9/10 and visual distinctiveness8/10 are subjective; retained same-insurer logo repetition is intentional and preferable to fabricated product specificity.

This run checks rendering, provenance labels, native interactions and sampled canonical continuity. It does not recertify insurer policy facts or prove external sites always load. Home promotion destination links are unchanged from prior audit: MSIG loaded; AXA returned Access Blocked in that browser despite web research availability. No fresh all-external-links availability claim.

Evidence scripts: `output/playwright/product-home-browse.js`, `product-continuity.js`, `product-extra.js`. Raw exact results: `output/product-home-browse-raw.txt`, `product-continuity-raw.txt`, `product-extra-raw.txt`. Screenshots: `product-home-{360,390,1440}.png`, `product-browse-{health,motor}-{390,1440}.png` in output/playwright.

Status: scoped PASS. No new product defect identified. Existing insurer-specific product-art gaps remain visibly labelled logo fallbacks, not broken implementation.
