# Broker decision table and customer chat

12 September 2026 — DONE locally. Local production: http://127.0.0.1:8787/broker

Scope implemented:

- Full-width semantic table: plan/price, why it is relevant with verbatim customer evidence, conditional decision criteria, and a question to distinguish options. Unconfirmed and excluded coverage remain explicit; source details expand within each row. No score or automatic product selection.
- Contextual criteria for health (room/OPD), property (flood/valuation), motor (collision/deductible), accident (daily income), and travel (annual/single trip/delay). Broker checks customer answers before deciding. A customer's statement that they have no insurance does not trigger a request to inspect a nonexistent old policy.
- Six labeled fixtures: group top-up, freelancer OPD, home flood, motor renewal, accident income, and overseas family travel. Property has two supported catalog choices; the other fixtures have three. Existing leads, edited notes and chat history are preserved during repeated fixture merges. Fixtures are excluded from customer-side duplicate-handoff checks.
- User clarified the requested chat is Broker-to-customer simulation. No new ChatGPT endpoint or real messaging service was added. Authored customer replies reflect each case. Chat, follow-up notes and status persist locally per lead, independently from the original handoff summary and transcript. The existing call simulation remains available in a separate mode.
- Table questions append to the editable draft, never send automatically. Blank sends, 2,000-character message limits, 100-message history capacity and closed cases are handled. Status updates are blocked while a simulated call is active. The draft resets between customer routes.

Checks:

- npm test: 88 passing tests. Includes seed idempotence/preservation, snapshot-backed criteria, optional versus included OPD, missing/negated cover, category-specific triggers, and persisted chat shape/isolation.
- npx tsc --noEmit: passed. npm run lint: 0 errors, 7 pre-existing image warnings. npm run build: passed; local production restarted after build to refresh asset mappings.
- Desktop browser: six cases plus the original lead visible; all three health table rows rendered. Used the Essential question button, verified editable draft, sent in demo, received contextual reply, saved follow-up note, reloaded and verified status/history/note persisted. Call/chat switch retains access to the existing flow.
- Mobile: table stays within a 390px page; horizontal scrolling is restricted to its labeled focusable region. Plan column stays pinned; final 390px check measured columns 160/196/196/196px, button scroll 196px and keyboard scroll 392px. A second case had an empty independent chat and unspecified budget. Controls scroll by the visible reading-column width. Chat uses full available width.

Limitations: replies are scripted demonstrations, not messages from a real customer or live generated AI. New demo replies do not rewrite the consented original brief automatically. Decision prompts cover the explicit fields supported by the catalog; unknown facts require Broker confirmation. The 1–2 minute reading goal has not been measured in a user study. Miro SYNC PENDING (no callable tool). No remote deployment, real contact or Your Data integration.
