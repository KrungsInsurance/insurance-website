# Motor / travel core-field evidence

Checked 2026-09-12 against AXA primary product pages. Mapping only: no catalog edits, new records, or current quote claims. Existing canonical motor-01–05 and travel-01–05 retained. Unknown is null, never zero. Proposed field names must follow the shared author’s final schema.

## Motor

| Records / primary source | Collision / theft / fire / flood | Third-party bodily injury | Exact locator |
|---|---|---|---|
| motor-01 [Type 1](https://www.axa.co.th/th/personal/car-insurance/type1) | All included; monetary limits unknown until car sum selected. Collision includes with/without counterpart. | Per person unknown: ordinary 500,000 versus BMW/Mercedes 1,000,000. Per event known 20,000,000 baht. | Coverage table, third-party liability rows (web lines 197–205). |
| motor-02 [EV/PHEV](https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev) | All included; amount follows unselected car sum. Collision with/without counterpart. | Known 1,000,000/person and 10,000,000/event. | EV/PHEV coverage table, rows liability/body damage (lines 118–129). |
| motor-03 [Type 2+](https://www.axa.co.th/th/personal/car-insurance/type2-plus) | Collision vehicle-to-vehicle, theft and fire included; amount follows car sum. Flood optional: 100,000 natural-perils package, not selected. | Known 500,000/person and 10,000,000/event. | Coverage table body damage and liability (lines 101–108). |
| motor-04 [Type 3+](https://www.axa.co.th/th/personal/car-insurance/type3-plus) | Collision vehicle-to-vehicle included; theft/fire not covered. Flood optional: 100,000 natural-perils package, not selected. | Known 500,000/person and 10,000,000/event. | Coverage table (lines 103–110). |
| motor-05 [Compulsory](https://www.axa.co.th/th/personal/car-insurance/compulsory) | Own-car collision/theft/fire/flood not covered. | Voluntary excess-BI fields **not applicable**, not zero. Compulsory benefits have a different basis. | Product description; compulsory table and notes (lines 98–100,114–130). |

All four voluntary BI amounts are **only the excess above compulsory insurance**, not combined benefits. Preserve that qualifier in each cell. Flood 100,000 for 2+/3+ is the optional natural-perils package amount; do not represent it as a selected standalone flood amount or independent four caps. Use coverageStatus optional + null canonical selected amount, with the available package amount in conditions unless optional values are explicitly supported.

Compulsory note for future fields: source distinguishes preliminary medical30,000/death35,000, proven liability medical80,000/death or permanent total disability500,000; maximum combined per person504,000. Event limit varies by seating (5m/10m), so unknown without vehicle. Never copy any of these into voluntary excess-BI cells.

## Travel

| Records / source | Proposed mappings | Locator and limitations |
|---|---|---|
| travel-03 [Domestic, selected Plan 3](https://www.axa.co.th/th/personal/travel-insurance/domestic) | evacuationLimit=1,000,000; repatriationLimit=1,000,000; interruptionLimit=20,000; delayHours=4; delayPayment=1,000; delayLimit=10,000 baht. | Plan 3 table rows emergency transport, remains return, trip shortening, travel delay (lines101–105). Emergency transport includes medical return **within Thailand**; repatriation here means **remains/ashes**, not duplicate medical evacuation. |
| travel-03 same source | policyDuration unknown selected days; conditions maximum31days/trip. delayTrigger unknown exact covered causes. | Underwriting condition2 (line111); table supplies interval/payment, not full trigger causes. Do not import outbound causes into domestic. |
| travel-04 [Inbound, no selected Plan1/2](https://www.axa.co.th/th/personal/travel-insurance/inbound) | delayLimit and selected delay benefit unknown. Conditions: Plan1 absent; Plan2 1,000 every6hours, max20,000; domestic/outbound-from-Thailand flights, covered causes per policy. | Table travel-delay row (line112). Do not mark benefit included on the unselected record. delayHours can remain unknown with conditional6h note. |
| travel-04 same source | evacuation/repatriation/interruption unknown; no explicit rows found. policyDuration unknown selected duration, max180days; single trip. | General info line95, table109–115, underwriting remark132. Missing table row is insufficient evidence for not_covered. |
| travel-01/02/05 [Outbound](https://www.axa.co.th/th/personal/travel-insurance/outbound) | evacuation/repatriation included but amount unknown (no Basic/Advance/Max selected). interruption and delay optional, amount unknown. delay interval6h is conditional on adding trip cover; exact selected value remains unknown. | Schengen explanation153–156 supports transport and remains return. Product FAQ171–178 distinguishes core tiers and optional Trip Protection. Delay FAQ332–339 gives6consecutive hours and repeated6h intervals; amounts defer to policy. |
| travel-01/02/05 same source | Delay conditions: adverse weather, transport mechanical failure, transport/airport strike, unforeseen destination unrest, destination natural disaster, airspace/airport closure. | Delay FAQ332–339. Keep trigger separate from interval and cap. Do not invent a fixed payout. |
| travel-01/05 same source | policyDuration selected days unknown; maximum180days per single trip. | FAQ175–178. Travel-05 remains Schengen scenario of same product. |
| travel-02 same source | policyDuration=1year; maxTripDays unknown90or180 depending tier. | FAQ175–178 and264–265. Do not turn 1year into365days or confuse annual policy with a continuous year abroad. |

## Implementation safeguards

- Use separate evacuation and remains-return labels; their insured events differ.
- Benefit basis must match across comparison. Do not label insurer-table aggregate amounts per-event when the source only states maximum coverage; preserve existing per-trip convention only with explicit caveat/conditions.
- For unselected tiers, show the field with unknown/optional and the specific reason. Optional is not excluded, and generic product maximum is not the selected benefit.
- Domestic delay4h and outbound/inbound6h differ; never supply one category-wide default.
- Any unavailable cause wording remains unknown pending full policy wording. These sources support the values listed, not guaranteed claim outcomes.
