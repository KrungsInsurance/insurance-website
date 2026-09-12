# Unified Broker conversation

12 September 2026 — DONE locally. Production: http://127.0.0.1:8787/broker

- Original customer/AI transcript appears before the Broker/customer continuation in one chat log. Sender labels distinguish all three parties; a handoff marker provides context. The separate “อ่านบทสนทนาทั้งหมด” disclosure is removed.
- Customer chat bubble and composer CSS is reused directly. Broker messages align right; customer and prior AI messages align left. Accessible labels, visible focus, latest-message button, Enter send and Shift+Enter newline are supported. Empty/closed/capacity guards remain.
- Historical cards are shared between chat and the saved-plan archive through Broker HistoricalCard. They still read immutable lead.planFacts, preserve unknown fields/source links, and do not substitute current catalog prices.
- Sending still uses authored demo customer replies. Per-lead storage, saved notes, original consented summary, follow-up workflow and call simulation are retained.

Validation:

- npm test: 88 passed, including historical snapshot rendering and per-lead chat persistence contracts.
- npx tsc --noEmit: passed. npm run lint: 0 errors, 7 existing image warnings. npm run build: passed. Local production stopped before build and restarted afterward on port 8787.
- Desktop 1440 × 1000: existing freelancer conversation includes original 2 messages and subsequent 2 messages in a single log, with no duplicate transcript disclosure.
- Group top-up case: Shift+Enter added a newline without sending; Enter added exactly one Broker message and one scripted reply (4 → 6 total messages). Reload retained all 6, the previous follow-up note and status. Log initially scrolled to the latest message.
- Mobile 390 × 844: body width 390, chat width 324; readable bubbles, visible focus and composer, no horizontal page overflow.
- Original Pipeline QA case: 6 historical messages plus original plan/comparison cards remain in the chat. Expanded the historical comparison on mobile and verified saved facts and source links. The existing active call was not changed.

Limitations: demo replies are scripted; no real customer message is sent. No API/data migration needed. Miro SYNC PENDING because there is no callable Miro tool in this session.
