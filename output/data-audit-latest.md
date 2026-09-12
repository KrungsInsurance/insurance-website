# Independent canonical-data audit — 12 September 2026

Scope: read-only spot checks of the 25-record catalog, V2 §4 and research-v2, directly against primary insurer pages. This is not verification of every cell or full underwriting wording. No customer quote was purchased.

## Confirmed sampled facts

- **Value / Essential:** Value plan 1 has 2.5m annual, 500k admission and 2,500 room/day; Essential plan 4 has 10m per disease and 12,000 room/day. OPD 50k/year is optional. Catalog makes starting-price tier ambiguity visible rather than claiming a matched quote. [Value table](https://www.axa.co.th/th/personal/health-insurance/value-plan), [Essential table](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan).
- **PA All In One S:** male35 example premium 3,855; medical45,000 per accident; ordinary accidental death/PTD300,000 versus motorcycle150,000. These sampled catalog values are from the same tier. [Official table](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table).
- **Save Dee:** 365/year including duty, plan1 benefit300,000, and age conflict are real on the same source page (table1–65; terms1–17). Catalog explicitly marks maximum age conflicting. This verifies the conflict representation, not eligibility or suitability. [Official source](https://www.axa.co.th/th/personal/accident-insurance/affordable-plan).
- **99/7:** coverage until age99 and payment7 years are correct; online age21–70 is channel-specific. Easy Protection is the marketing name of Happy Return99/7, confirmed in footnote1. [Official source](https://online.muangthai.co.th/th/detail/99-7).
- **Property:** natural-peril20,000 is one shared cap, building/contents sums depend on selections; zero deductible is supported. Catalog does not split the cap into additive flood/quake amounts. [Official table/FAQ](https://www.axa.co.th/th/personal/home-insurance/home-plan).
- **Domestic / inbound:** domestic plan3 injury medical100,000, cancellation20,000 and baggage20,000 are supported; domestic31 days and excluded three provinces correct. Inbound medical750,000 appears in both tiers and is correctly separated from outbound. [Domestic](https://www.axa.co.th/th/personal/travel-insurance/domestic), [Inbound](https://www.axa.co.th/th/personal/travel-insurance/inbound).

## Actionable findings at audit time

1. **High confidence — annual travel duration is over-specified.** `travel-02.maxTripDays` is known180; its condition says annual allows180 per trip. The official FAQ says annual90 OR180 depending chosen plan. Catalog states no Basic/Advance/Max has been selected. Use unknown plus90/180 condition, or explicitly encode a maximum-product bound distinct from selected coverage. Single-trip180 is supported. [FAQ](https://www.axa.co.th/th/personal/travel-insurance/outbound).
2. **High confidence — price comparison status ignores incompatible quote scenarios.** Node probe `buildComparison("health", ["health-01","health-03"])` premium row returns `different`, although first price is product-wide starting with unknown age/tier and second is male35 example. `compareCells` checks period but treats differing scenario strings only as differences. V2 requires not-comparable for mismatched/unknown quote profiles, not a numerically ranked comparison. This is independently reproduced code semantics, not an insurer factual error.
3. **High confidence — CMI discounted price affects discovery.** Source table crosses out645.21 and shows581.01 for private vehicles≤7 seats. Catalog scenario now explains both but canonical amount remains645.21. Node `searchPlans({category:"motor", maxPremium:600})` excludes it entirely despite the source's applicable discounted example. Prefer a clearly scoped online example581.01, or unknown quote handling that remains discoverable; never silently substitute a price without scenario. Medical80k with30k preliminary claim is correctly represented. [Official price table](https://www.axa.co.th/th/personal/car-insurance/compulsory).

## Completeness caveats

The field schema is substantially safer but V2 research core fields remain incomplete: life death/maturity/guaranteed-cashback formulas; health eligibility/renewal/ICU and copay; PA public-transport/daily benefit; property bundled liability and use restrictions. Existing generic eligibility/exclusion copy does not capture all readily available restrictions. This is missing detail, not evidence that seeded numeric values are fabricated.

SaveDee remains selectable with explicit conflict. Research §5 originally proposed quarantine until resolved; if current intent allows informational browsing with conflict, keep consent/personal recommendation from asserting eligibility. Schengen is explicitly labelled the same product scenario, not an independent insurer product; its source comparison table is dated1May2025, which should remain visible if claiming current price.

## Factual-grounding confidence rubric

- **High:** exact official table/FAQ with matching tier, unit and condition; used for the confirmed sampled facts and three findings above.
- **Moderate:** official marketing statement without selected quote/edition; e.g. product-wide starting price alongside a tier. Useful for discovery only.
- **Unresolved:** conflicting or missing selected-product facts; neither official URL nor passing code test resolves it.

Coverage metric: 25 catalog records counted; primary-source spot checks cover **10 records** (health01/02, motor05, life02, accident04/05, travel02/03/04, property01). This is **10/25 record spot-check coverage**, not whole-record approval and not a 40% correctness score. Value/Essential price-tier match intentionally remains unresolved. Life99/20 PDF,10/1,15/3 and MTL health S/M/L were not freshly verified in this independent pass.

Read-only Node evidence at audit time: count25; health01-vs-health03 premium comparison=different; CMI budget600=[]; annual maxTripDays known180. Root received these findings for implementation/retest.


## Extension: remaining 15 records — independent source pass

This pass covers the other15 record identities and their seeded core numeric fields; total independent spot-check reach is now **25/25 records**, with limitations below. A record counted as reached is not a full policy verification. No library data edited by this reviewer.

| IDs | Fields confirmed | Source / limitations |
|---|---|---|
| health03/04/05 | Male35 annual examples25,339.50 /27,696.50 /34,301.50; IPD per treatment700k /1m /5m; OPD per year20k /20k /30k. | [Category cards](https://online.muangthai.co.th/th/Health-IPD-OPD/category/health). PASS numeric tier/period. Material conditions below still need representation. |
| motor01 | PD5m/occurrence; own vehicle limit depends on sum; selectable deductible0/3000/5000; dealer≤5years versus garage≤15. | [Type1 table](https://www.axa.co.th/th/personal/car-insurance/type1). PASS seeded figures/options; no fixed quote verified. |
| motor02 | PD car5m versus pickup/van2.5m; ordinary deductible0; own damage sum selected. | [EV table and notice](https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev). PASS table figures but unlisted-driver excess omitted (finding below). |
| motor03 | PD1m; own damage collision/theft/fire by sum; deductible0/2000 selectable; natural peril optional100k. | [Type2+](https://www.axa.co.th/th/personal/car-insurance/type2-plus). PASS current coverage sampled. |
| motor04 | PD1m; collision by sum; theft/fire not covered; deductible0/2000 selectable; natural peril optional100k. | [Type3+](https://www.axa.co.th/th/personal/car-insurance/type3-plus). PASS sampled. |
| motor03/04 price | 5,800 /5,400 yearly starting prices appear in July4,2025 launch release; current catalog labels historical scenario. | [Launch source](https://www.axa.co.th/th/blog/news_updated-motor-insurance-2025). PASS historical figures, current individualized prices unknown. |
| life01 | Female35 healthy example1m sum,22,170 yearly; untilage99; pay20years; entry30days–70years; edition21Jul2025. | Official linked99/20 brochure page2, read PDF text and screenshot. PASS seeded figures/period. Benefit formulas still omitted from comparison schema. |
| life03 | Single payment,10-year coverage, entry30days–80years; maturity dividend not guaranteed. | [Official10/1](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-linked-pro-10-1-global//). Direct fetch returned internal error; official indexed full text retrieved, crawl age2months. Moderate confidence for current edition, high for exact retrieved statement. Actual premium unknown. |
| life04 | Payment3years; coverage15years; entry30days–80years; starting19,940 for20,000sum;3% cashback every2years. | [Official15/3](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-index-15-3-global-index-linked). Direct fetch failed but official indexed page retrieved (6-day crawl). Numeric headline PASS; annual payment frequency not independently confirmed by visible indexed text, so period remains unverified in this pass. |
| accident01 | Plan1 male35 example250/year; ordinary accidental death/PTD100k, motorcycle50k; medical dash/no cover; table age20–75 for first plan group. | [PA Small](https://online.muangthai.co.th/th/detail/pa-small-size/plan-table). PASS figures; page footnote marketing example20–60 is not treated as general max-age override. |
| accident02 | Plan1 male35 example2,199/year; medical50k; ordinary death/PTD500k; motorcycle250k. | [PA Go](https://online.muangthai.co.th/th/detail/pa-go/plan-table). PASS figures; source limits occupation classes1/2 and Thai nationality. |
| accident03 | PlanS male35 example3,700/year; medical25k; ordinary death/PTD400k; motorcycle200k. | [PA Cash Back](https://online.muangthai.co.th/th/detail/pa-cashback/plan-table). PASS figures. No-claim rebate requires continuous3-year renewal and no received benefits, returning last annual premium; not generic automatic cashback. |
| travel01 | Outbound single-trip,135 starting,180day maximum; exact selected medical/addon limits remain unknown. | [Outbound](https://www.axa.co.th/th/personal/travel-insurance/outbound). PASS scope/starting figure; no matched trip quote. |
| travel05 | Same Smart Traveller product's Schengen scenario,165 starting, single-trip180days. | Same source comparison table dated1May2025. PASS historical scenario claim; not independent product/tier or current guaranteed price. |

### New material conditions requiring attention

- **EV0 deductible requires an excess qualifier.** The same official page says EV named-driver rules from1Jun2024 impose6,000 excess if the driver is not listed. A0 cell with empty conditions misleadingly reads as no deductible in every circumstance. Preserve the distinction between ordinary deductible and special excess; source section is the notice immediately before the coverage table. Already sent to root.
- **MTL health S/M/L share same-illness limits across90days.** IPD amount is correct, but each admission does not necessarily restart it. All three detail pages note10 aggregate same illness/injury/related complications within90days of the last discharge. Add this to perAdmission conditions. OPD note4 limits doctor visits to2/day; also available: standard-single-room terms,30-day general wait,120-day named conditions,180-day specified OPD conditions, age20–70, and base-life+rider composition. [S details](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-s), [M details](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-m), [L details](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-l). Already sent to root.
- **PA Cash Back product promise not explained.** Existing name says no-claim return, but current highlights omit its3-year continuous-renewal/no-benefits condition. Source footnote1 states the returned amount is the annual premium of the final year in each qualifying3-year block. This should be a short condition, not inferred return on investment.

### Correction to earlier CMI recommendation

Root/author found the discounted581.01 campaign had expired January2026. Therefore this reviewer withdraws any suggestion to promote581.01 as a current selectable price. **Quote-only/null with visible source-date/conflict context is the correct safe disposition pending a current quote.** The original finding about using one uncertain current price for budget filtering remains useful; the specific discounted figure is historical.

### Confidence and completeness after extension

All25 records now have some independent primary-source inspection. Most seeded core numeric statements checked match their quoted tier; two life pages were available only through official indexed content and15/3 annual price period remains unverified here. Material conditions and schema completeness remain separate acceptance: record coverage100% is not factual completeness100%. No claim that unknown cells mean absent benefits or that every source edition/current premium is verified.
