# Persona discovery flow

12 September 2026 — DONE locally. Open http://127.0.0.1:8787/chat?start=1.

## Integrated contract

- Asset team: five hand-drawn raster age avatars at public/images/personas/age-{id}.png. Exact prompts and source output paths in persona-assets.md; generated through built-in image_gen, not API/CLI fallback.
- Scope team: lib/discovery-persona.ts defines age bands, nickname/category/priorities/journey schema, category-specific topics, comparison fields, canonical plan retrieval and first-person opening.
- Dev team: DiscoveryOnboarding component and stylesheet, native form/buttons with focus handling, back/change-category controls, fade transitions and reduced-motion support.
- Root integration: home CTA enters the new wizard at /chat?start=1; atomic startDiscoveryState stores completed persona and resets current discovery context only. Existing leads, calls, notes and policies remain. Invalid optional persona storage is discarded without losing the rest of the envelope.

## Behavior

1. Only nickname (trimmed 1–60 characters) and age band are collected at the first step. Five bands: 18–20, 21–30, 31–45, 46–60, 61+. Age does not automatically determine eligibility, premium, health or family circumstances.
2. Category selection fades unrelated choices and reveals 1–3 pertinent topics. Changing category resets incompatible topics. Life topics cover family benefit, maturity, cashback, payment/coverage term and variable benefits; room/IPD/OPD belong to health.
3. Browse goes to /browse?category=... with no automatic product selection. Compare opens the existing chat with up to 3 source-backed, compatible plans and a comparison card restricted to selected topics (plus price). Ask opens with no product cards; general follow-ups stay informational, glossary questions show definitions, explicit plan requests can resume retrieval. Explicit requests not to suggest plans stay informational.

Comparison examples do not imply a purchase suitability ranking. Motor starts with voluntary, travel with outbound, with explicit scope in the mock response and Live instructions. Property/liability have only 2 available canonical options and disclose the count. Unknowns, optional benefits, price scenarios and quote-only plans retain original facts. No new broker lead or contact happens without existing review/consent.

## Validation

- npm test: 102 passed. Added schema and category/field contracts, compatible real-plan retrieval, ask/browse no-product behavior, state roundtrip/reset isolation, mock and mocked-Live automatic comparison, informational tool restrictions, unsolicited-plan rejection, explicit plan-request behavior and invalid field rejection.
- npx tsc --noEmit passed. npm run lint: 0 errors, 7 existing image warnings. Production build passed and local server restarted after builds.
- Desktop 1440×1000: five images loaded at natural1254×1254; nickname validation/focus; health topic selection; three route cards; automatic health comparison with room/OPD columns and 3 distinct plan IDs. Reload preserves exactly one comparison card and persona.
- Mobile 390×844: age cards, health/life/property topic transitions, max3 topics (fourth disabled), readable route cards. Asked “ทุนประกันคืออะไร”; glossary definition/source appeared, zero product/compare cards. Changing category clears earlier topic choices.
- Browse path navigated to property and showed both actual plans including quote-only, with no manual compare selection. Returned through Home CTA and confirmed nickname, age61+ and flood topic survived.
- Final mobile recheck after containing screen-reader announcements inside the chat workspace: HTML/body/viewport390px, comparison region360px with its own horizontal scroll. No page overflow.
- Automatic property path displayed its real 2-plan comparison, including quote-only and flood shared-limit conditions. Customer/AI transcript from the previous search was reset without touching Broker cases.

## Limits

Browser presentation ran in the existing explicit mock mode. Live contract tests use mocked upstream; no claim of an actual live-model run or configured credentials for this revision. No new dependency, real customer contact, remote deployment or Your Data integration. The completed persona is persisted; unfinished wizard edits are kept within the mounted wizard and revisiting restarts at step1 with the last completed persona.

OpenAI tool controls were checked against [official function-calling documentation](https://developers.openai.com/api/docs/guides/function-calling). Miro SYNC PENDING because no callable Miro tool is available in this session.
