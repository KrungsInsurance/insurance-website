# Health evidence follow-up — 12 September 2026

Research only. No catalog edits. Replaces the earlier *access unavailable* assessment for FWD and ThaiLife: both official PDFs were obtained normally. This is a bounded follow-up, not an exhaustive insurer-market survey.

## FWD Easy E-Health — selected 500,000 baht tier

Sources: [product and expanded policy section](https://www.fwd.co.th/th/health-insurance/easy-e-health/) and [exact 500,000 baht policy PDF](https://www.fwd.co.th/files/v3/assets/blt331c1aa12dcfd37a/blt9c6be205ca1ac70e/67be96c1045f58f038bfaa8c/Easy_E-Health_500_000_THB.pdf). Source is a 46-page policy bundle, not a personalised issued policy. The following page numbers are PDF pages, counted from 1.

| Field | Verified value / basis | Locator and material conditions |
|---|---|---|
| annualLimit | 500,000 THB / policy year | p25 final benefit line; exact 500k table begins p23 |
| roomPerDay | 1,500 THB/day | p23 category 1; room, meals and hospital services; maximum365 days per policy year |
| icuPerDay | included, actual eligible expense; no fixed daily amount | p23 category1, maximum180 days, within annual benefit. Do not encode unlimited or zero. |
| icuMaxDays | 180 days / policy year | p23 category1 annual heading |
| deductible | 0 THB | p25 participation table explicitly says no deductible. This is source-backed zero. |
| copay | initially no copay; renewal30% or50% conditionally | p25 no ordinary copay; p33 clause7 overrides at qualifying renewal. Simple diseases ≥3 admissions and claim ratio≥200% gives30%; ≥3 qualifying claims and ratio≥400% gives30% (major surgery / specified critical illness excluded from this test); both tests50%. Reassessed, not a permanent guarantee of no copay. |
| waitingDays | 30 days; specified conditions120 | p36 clause12: tumour/cyst/cancer, haemorrhoids, hernia, pterygium/cataract, tonsil/adenoid surgery, stones, leg varicose veins, endometriosis. Applies from inception or approved increase for increased benefit. Injury/non-pre-existing emergency surgery exceptions specified. |
| entry age | 20–60 years | expanded website policy-details section |
| renewalAge | 79 years | expanded website policy-details section; coverage until80, do not confuse the two |
| ordinaryOPD | optional, not selected | separate OPD Plus rider link on product page; not the post-discharge/accident OPD within base policy |
| territory | Thailand with qualified temporary overseas emergency exception | expanded page: sudden illness/injury abroad, trip≤45days including hospital days; do not describe unconditional worldwide cover |
| take-home medication | included actual cost, max14days/admission | p23 category2.4 |
| admission definition | unresolved same illness/injury/complications within90days of last discharge is one admission, including Day Surgery | PDF p20 definition; this does not change the annual headline into a per-admission limit |

Price remains **quote required**: no matching 500k scenario premium was confirmed. The live calculator initially displayed a different selected1m bundle with OPD/daily add-ons; that amount must not be assigned to500k. PDF contains a main life contract and health rider. Do not imply a bare health rider price is total purchase price. Optional CI hospital daily benefit is not included in this selected base tier.

Access evidence: web reader initially omitted lazy policy links and then rejected direct PDF as unsafe. Isolated browser clicked the rendered policy-details link; page exposed exact tier PDFs. Actual rendered500k link opened a PDF tab, then normal HTTPS download succeeded608,155bytes. `output/fwd-ehealth500k.pdf`, extracted text and rendered p23 were checked. No challenge was bypassed.

## ThaiLife Health Fit DD — actual rider Plan1, no deductible / no optionalOPD

Primary: [official ThaiLife brochure](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf), 2pages, printed edition **P0097-1/03/69**. Both pages rendered and inspected; some extracted Thai characters have legacy font encoding, so visual tables controlled interpretation.

| Field | Verified value / basis | Locator and material conditions |
|---|---|---|
| annualLimit | 1,000,000 THB / policy year | p2 table Plan1 column |
| roomPerDay | 2,000 THB/day | p2 category1, per admission; room/meals/hospital services |
| icuPerDay | included actual eligible expense, no fixed daily amount | p2 category1; room andICU shared maximum365days per admission, within annual limit |
| deductible | 0 THB / admission, selected explicit option | p2 top table options0/30k/50k for Plan1;100k is explicitly unavailable for Plan1 |
| minEntryAge | 15days | p1 underwriting. Keep textual age if schema only permits integer years; never round to0years and imply newborn eligibility. |
| maxEntryAge | 80years | p1 underwriting |
| coverage end | until99 or underlying life contract end, whichever earlier | p1 insurance duration |
| renewalAge | not independently specified | p1 says premium-paying duration ends by98; that is not an explicit renewal-age statement |
| ordinaryOPD | optional, not selected | p2 separate OPD choices5k–50k/year, up to30visits/year. Optional rider eligibility6–80. Not a base exclusion of post-IPD follow-up. |
| take-home medication |20,000THB/admission, maximum7days|p2 category2.4 Plan1|
| post-IPD OPD |actual eligible expense within30days, maximum2visits/admission|p2 category6.2; not ordinary annualOPD|
| territory |Thailand only|p2 table|
| waiting / copay |unknown in this2-page brochure|Do not borrow another sales-channel package or infer zero.|

**Price example** p1: male35, occupation class1/2, Plan1, no deductible, rider premium **15,710THB/year** (female same scenario18,070). This is a published **scenario example, not a universal starting price**, and does not include the mandatory main-life contract. The brochure explicitly requires purchase together with the main life policy; rider cannot be added later. Keep overall payable premium quote-only unless UI/price contract clearly displays rider-only example and unknown main premium separately. Premium can change at renewal based on age, occupation, medical costs and portfolio claims.

Current brochure is publicly served; no purchase was attempted and underwriting/current sale to a particular person is not guaranteed. No customer information was entered.

**Rejected cross-channel substitution:** [Krungsri Tamjai Plus](https://www.krungsri.com/th/personal/bancassurance/health-insurance/tamjai-plus) names a HealthFitDD rider but packages it differently: age6–70/renew79/cover80, optionalOPD per-visit1k/2k/4k instead of this brochure's annual lump sum. Its marketing text also says99/90day wait while detailed conditions say80/30+120. Do not use those ages/waits to overwrite the directly published rider. It is a separate channel evidence/conflict, not an alternative tier invented for catalog.

Access evidence: earlier web reader gave emptyHTML. Normal direct HTTPS download succeeded321,237bytes, valid PDF signature,2pages. Local `output/thailife-healthfit.pdf`, rendered `output/thailife-healthfit-1.png` and `-2.png` checked. Access barrier resolved; remaining unknowns are absent from available brochure, not a failure to try the PDF.

## AIA / Allianz missing-field check

- [AIA HealthHappy current linked brochure](https://www.aia.co.th/content/dam/th-wise/images/th/our-products/si_156_aia-healthy-happy/Brochure%20AIA%20Health%20Happy_Final_27Dec2022_website.pdf.coredownload.inline.pdf): current catalog already has verified5m annual basis, room3k, shared365days room/ICU, renewal98/cover99, waiting30/120 and renewal copay criteria. ICU is actual-cost benefit rather than a missing numeric daily ceiling. Searching the brochure does not independently establish a selected deductible option or a complete combined premium. Keep those unknown. OrdinaryOPD absence does not mean all outpatient episodes are excluded. Existing p3/p7/p9/p10 source locators remain appropriate.
- [Allianz BeyondCare current brochure](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Beyond-Care-TH-27-02-2025.pdf), p5 underwriting1: Plans1–3 start at11years; no upper entry age is stated in that line. Plans4–6 have15days–65, **do not import65 into Plan1**. p2 footnote5 gives conditional lifetime renewal before60 / renewalto80 starting60. A scalar renewal age cannot accurately represent it; use known textual conditional value if schema supports it, not an invented99. Adult copay zero is not independently established merely because p5 footnote7 specifies30% for children under11. No complete Plan1 price scenario was found. Direct-download attempt met Cloudflare challenge and was not retried/bypassed; web reader still supplied6page PDF text. Missing numeric ceiling/price is not resolved by guessing.

No catalog, route, application or secret file was edited. Evidence handed to sole catalog writer for integration.
