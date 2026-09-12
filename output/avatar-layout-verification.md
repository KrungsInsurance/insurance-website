# Avatar layout and annual budget

12 September 2026 — DONE locally. Local production restarted after final build; reloaded /chat?start=1 and verified nickname + two selects.

- Desktop: equal layout columns with a large existing hand-drawn avatar and title on the left. Right: nickname input, age select and annual budget select. Avatar updates immediately from the five existing assets.
- Mobile: avatar above full-width form, native selects, visible keyboard focus. No new assets/dependencies.
- Six non-overlapping whole-baht budget choices: unknown, less than10,000, 10,000–19,999, 20,000–29,999, 30,000–50,000, more than50,000 per year. Unknown is the default and can continue.
- Optional persisted budgetBand preserves older personas. Recap and chat display the selected range. personaOpening carries a verbatim annual budget quote. Extraction keeps amountTHB null for ranges; Broker and structured overview show the quote. No range endpoint is fabricated as an exact budget; automatic plan retrieval does not exclude quote-only options.

Checks: npm test104 passed; npx tsc --noEmit passed; lint0 errors/7 existing image warnings; build passed. Unit cases verify all budget choices roundtrip, legacy compatibility, unchanged quote-only retrieval and range preservation in mock/validated model extraction, including shortened quotes.

Desktop1440×1000 visually verified: title/avatar left, three fields right, all controls visible. Changed age18–20 to46–60 and verified image URL; selected20,000–29,999 and verified step2 recap. Back retained both choices. Mobile390×844: body390, form350, no overflow; native selects and focus visible. Selecting unknown budget still advances. Existing avatar and persona were restored to original age18–20/unknown in the uncommitted wizard after QA.

Miro SYNC PENDING: no callable Miro tool. Live model credentials and adapters were not changed; no real contact or remote deployment.
