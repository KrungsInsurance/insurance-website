# Home promotion rail verification

User-requested layout: travel with friends 20%, AXA family health 25%, then existing motor and home offers. One card template in a horizontally scrollable rail; native touch scrolling, labelled previous/next buttons, focusable region for keyboard scrolling, and expandable conditions retained.

The two new percentages are requested demonstration copy, not verified live offers. Both cards visibly say “ตัวอย่างโปรโมชัน”; conditions explicitly state the percentage is illustrative and not confirmed by the insurer. The old MSIG 15% banner was removed. New cards use existing neutral local imagery. Company links are product/company information, not evidence for the illustrative discounts: https://www.msig-thai.com/th and https://www.axa.co.th/th/personal/health-insurance. Existing dated motor/home offers retain their original conditions and date filtering.

Validation: typecheck PASS; lint 0 errors / 8 existing img warnings; production build PASS; git diff --check PASS. Deployed to https://krungsinsurance.bond/ using the existing systemd service. Chromium verified four cards in the requested order, 20/25/18/15 values, two demo labels, all promotion images loaded, working left/right buttons, expandable conditions, and no full-page horizontal overflow at 1440px and 390px. Keyboard ArrowRight scrolls the focused rail. No browser page exceptions. Card positioning keeps screen-reader-only labels inside the scroll container.

No insurance contract, product taxonomy, purchase flow or phase dependency was changed. “ประกันกลุ่ม · สมัครด้วยกัน” is a promotion grouping label, not a claim that these are verified group-policy products.
