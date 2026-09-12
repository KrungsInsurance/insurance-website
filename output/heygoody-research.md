# HeyGoody reference research and Browse refinement contract

Checked 12 September 2026. This is a read-only review of official public pages through web extraction. No personal information was submitted, no quote was requested, and the full conditional interaction sequence was not tested.

## What the official pages show

The [official motor quote form](https://www.heygoody.com/checkinsurance) exposes vehicle type (personal passenger vehicle, EV, or van), make, model, manufacture year and variant. It then asks about the current insurer or absence of cover, desired start date, registration province and birth year. A Next control separates portions of the form, with service terms before checking prices. The extracted document includes a no-plan state for a vehicle year. These are observed form labels; extraction does not establish precisely when every field becomes visible.

The [official motor landing page](https://www.heygoody.com/th/autoinsurance/all/) separates insurance classes and provides explanations of repair at an insurer-network garage versus a manufacturer service centre. Its coverage comparison also distinguishes own-vehicle damage and third-party protection. We use this as inspiration for asking context before showing a narrower plan group, rather than copying its artwork or product claims.

## Adaptation in this demo

The seven-category flow below is designed for **our catalog**. It is not a claim that HeyGoody has these exact seven journeys. Choosing a group is followed by optional details and a compact editable summary. Users can skip details, go back, or reset; no budget is required.

| Category | First choice | Optional details | Actual result filtering |
| --- | --- | --- | --- |
| Motor | Class 1 / 2+ / 3+ / compulsory / all | Vehicle type, make, model/variant, year, use, registration province, birth year, repair preference, existing insurer, start date | Known catalog class or compulsory subtype only |
| Health | IPD, room, OPD, supplement existing rights | Who is insured, actual age, existing cover, hospital, desired room amount, cost sharing | No eligibility filtering; all plans remain available for conditions and optional benefits |
| Life | Whole-life, savings, term, all | Purpose, actual age, payment horizon, holding period, dependants | Known catalog life-type wording only |
| Accident | Medical, income, death/disability, motorcycle | Occupation, actual age, motorcycle use, activities, existing base life policy | No inferred occupation/benefit eligibility |
| Travel | Outbound, domestic, inbound, all | Destination, dates, frequency, travellers and ages, visa/activities | Recorded travel subtype only |
| Property | Fire, flood, contents, burglary | Property type, occupancy, location, construction, approximate value | No inferred underwriting approval |
| Liability | Injury, third-party property, events, business scope | Business, location, activities, requested limit, territory | No fabricated activity or limit matching |

Class 2 and class 3 are not offered as selectable result groups because this demo has no sourced catalog plans in those groups. Vehicle make/model/year and all other personal details are **quote preparation context only**, not a pricing engine. Unknown coverage does not mean excluded; selecting an interest does not silently remove plans with incomplete data. Quote-only plans remain visible within their genuine category/class even with an optional budget filter.

## Integration contract

- Public query parameter `focus` stores only the selected category-specific choice. Existing `category`, `q`, `sort`, `maxPremium`, insurer navigation and comparison selection remain intact. Category changes remove the old focus.
- Session key: `insurance-browse-context-v1:<category>`.
- Payload: `{ category, focus, answers: Record<string, string> }`; valid answer keys and options are declared in `lib/browse-refinement.ts`.
- `cleanBrowseAnswers(category, input)` strips unknown keys, invalid option values, malformed year/date input, trims strings and caps each at 120 characters.
- Data is saved in the current browser tab when the user chooses to view results. It is not put into `profile.goals`, sent to a provider, or used to claim eligibility. Browser storage failures have a visible local-only notice.
- The summary exposes an editable customer draft from `browseContextMessage(context)`, plus a copy fallback. Its Open chat action dispatches `new CustomEvent("insurance-chat", { detail: { draft, category } })`. Root-owned chat integration opens an editable composer and handles category confirmation; this event does not submit a message. Browse does not mutate shared profile or chat history.

## Verification

Dedicated tests: `tests/browse-refinement.test.ts` cover all categories, known classifications, compulsory/travel separation, unknown facts, quote-only retention, non-filtering interests and context sanitization. Root owns full-suite/build/local browser verification.
