# Real chat and catalog expansion — 12 September 2026

Status: DONE locally for this authorized scope. Two teams: real chat/memory, and sourced catalog expansion. Root integrates and checks the local production UI.

## Scope

- Customer chat always calls OpenAI through the server. No runtime mock selector or query override.
- Broker chat uses real OpenAI responses to simulate the saved customer case; it does not send messages to an outside customer. Preserve historical transcript provenance.
- Send the full stored conversation and explicit persona, honoring later customer corrections. Stop visibly at capacity rather than silently discard early context.
- Expand beyond ten insurance categories with real insurer product identities, quote-only prices where appropriate, and same-purpose comparison groups.
- Your Data remains the previously requested UI-only consent simulation.

## Credential handling

The user supplied a key; it was stored only in ignored `.env.local` with permissions 0600. No key value is included in reports. The live team verified authenticated model access. Actual conversation acceptance is recorded below when complete.

## Independent source spot checks

- [MTI Pet Chill](https://www.muangthaiinsurance.com/th/product/miscellaneous-insurance/pet-chill-insurance): product and tier table available; illness is excluded from the first tier, while vaccine benefits apply only to higher tiers. Do not attach the highest benefits to the entry premium.
- [Tokio Marine TM Cyber 365](https://www.tokiomarine.com/th/en/non-life/products/commercial/special-product/cyber-insurance.html): current official product page confirmed.
- [Bangkok Insurance business products](https://bangkokinsurance.com/en/product/business): current Event Cancellation product listed. Wedding eligibility is not established by that listing and must remain a question for the insurer.

## Validation

- `npm test`: 146/146 passed.
- `npx tsc --noEmit`: passed. `npm run lint`: 0 errors, 7 existing image warnings.
- `npm run build`: passed. Local production restarted at http://127.0.0.1:8787 after stopping the old Worker.
- `node scripts/smoke-live-chat.mjs --url=http://127.0.0.1:8787`: 8/8 actual HTTP requests returned 200 with model `gpt-5.4-2026-03-05`. Synthetic conversation includes an authored 15-message starting history and seven actual customer turns, up to 28 input messages. Name/range recall, later name and budget corrections, concern response, plain definition, natural-language three-product request, exact same three-product comparison, and Broker simulated customer reply were checked. Observed request latency: 1.4–8.6 seconds. See `output/live-chat-http-smoke.json` for exact text, cards, model and token usage.
- Customer browser: real API recalled แพท / 21–30 from the saved persona and conversation; old mock replies retain historical labels and the runtime mock selector is absent. A second real browser turn explained insurance premium briefly, with expandable source-backed glossary details; both responses persisted after reload. Mobile chat remained 390px wide without overflow.
- Broker browser: real reply recalled no personal health insurance and 1,500 THB per outpatient visit from the saved case conversation. The new pair persisted after reload and is labeled Live AI; earlier authored replies remain labeled old examples. No active call was ended.
- Catalog browser: 13 visible categories; property shows 12 entries, pet 3, construction filters to its one actual product, and event shows one quote-required product with unconfirmed wedding eligibility. Product detail exposes its official sources.
- Desktop 1440 and mobile 390: category navigation now wraps so the new categories are visible. No page overflow. Mobile pet comparison scrolls inside a 348px table viewport (840px content); Broker remains 390px wide.
- Root reviewed sampled official facts for Pet Chill, TM Cyber 365, Falcon Pet Protect Sure, BKI home products and Event Cancellation. Full researched inventory: `output/catalog-expansion-research.md`.
- Miro SYNC PENDING: no callable Miro tool in this session.

## Delivered counts and limits

82 catalog entries / 78 unique product IDs / 18 insurer names / 13 categories. Forty-two new entries are sourced product overviews awaiting a chosen tier and quote; they do not promise individual premiums or limits. Event/wedding acceptance remains an insurer question. Some specialist groups contain only one product and cannot form a two-plan comparison.

The API is real; the Broker's customer role, customer fixtures, calls and Your Data consent remain the authorized demo simulations. State persists in this browser, not a shared customer database. Conversation memory has an explicit 200-message/120,000-character limit; it cannot recover history already discarded by the old implementation. Tests demonstrate the exercised cases, not perfect future model answers. Factual cards remain authoritative; production smoke prose sometimes reconfirms known budget information rather than asking a new discovery question.

## Important fixes discovered during verification

- Removed the 12-message cut in storage/provider/request serialization and retained persona on every turn.
- Normal card actions preserve history; only a new persona discovery resets it.
- AI extraction classifies the latest intent/focus. It retains verbatim fact evidence, handles ranges without choosing an endpoint, and gets one bounded repair attempt when validation fails.
- Search uses compact catalog context; full cells and evidence remain available for detailed tools.
- An implicit comparison uses the actual last shown/selected set, without silently swapping plans.
- Added native output-length constraints and prohibited unsolicited plan tables/handoff during information-only conversation.

