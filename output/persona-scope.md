# Persona discovery contract — 12 September 2026

Current revision: nickname + age band + optional annual budget band → insurance category + 1–3 topics → browse / compare with help / ask questions. No budget is required or inferred.

## Shared module

`lib/discovery-persona.ts` exports `ageBands`, `AgeBand`, `DiscoveryPersona`, `discoveryPersonaSchema`, `priorityTopics`, `maxPersonaPriorities`, `personaFieldKeys`, `selectPersonaPlans`, and `personaOpening`.

- Age IDs and asset URLs: `18-20`, `21-30`, `31-45`, `46-60`, `61-plus` at `/images/personas/age-{id}.png`.
- Nickname trims to 1–60 characters; age/category/journey use exact enums. Topics must be unique, belong to the selected category, and number 1–3.
- Life topics cover death benefit, maturity, guaranteed cashback, payment term, coverage term, and non-guaranteed benefits. Hospital room / OPD belong to health.
- Field IDs map to the existing sourced catalog. Unknown benefits remain unknown; optional benefits remain optional. No generated premium, coverage amount, exact age, or eligibility claim.
- The selection helper returns only compare examples. Browse and ask return no products. Compare returns at most three catalog objects without modifying their evidence or prices.
- Documented topic coverage determines retrieval order; then catalog ID stabilizes ties. Different products are shown before repeating tiers of the same product. This is relevance for comparison, not a suitability or affordability score.
- Motor examples are voluntary insurance; travel examples are outbound. The assistant must disclose that initial scope and ask for vehicle / travel details before treating a product as relevant to purchase. It must not imply the customer supplied these details.
- Property and liability currently each have only two real plans. Show two and explain the catalog limit; never manufacture a third.
- Age band is context only. The assistant must confirm exact age and applicable eligibility when needed. In particular, “61+” does not establish that every plan can accept the person.
- `personaOpening` is a **user-side message**, containing only the customer's selections and the chosen intent. Ask explicitly requests information first and no plan offers.
- `personaFieldKeys` returns at most eight distinct canonical fields to fit the comparison-card contract.

## Verification

`node --experimental-strip-types --test tests/persona.test.ts`: validates schema, category-specific topics, compatible source-backed selection, quote-only inclusion, optional/unknown preservation, no age eligibility inference, no products in ask/browse, and bounded comparison fields.

Annual budget layout revision: budgetBands and BudgetBand exported; DiscoveryPersona.budgetBand optional for backward compatibility. Budget is a range, never converted to a single number. Choices are unknown, under10,000, 10,000–19,999, 20,000–29,999, 30,000–50,000 and over50,000 THB/year. personaBudgetLabel serves recap/chat. Original quote continues to extraction and Broker overview; quote-only products are not removed.
