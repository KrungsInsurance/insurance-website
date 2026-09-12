# Chat tool cards — implemented contract

`POST /api/chat` retains mode/message/suggestedPlanIds/offerHandoff/comparison/summaryDraft and adds `cards: ChatCard[]`, maximum4. Exported from `lib/types.ts`: `chatCardSchema`, `chatCardsSchema`, `ChatCard`.

Descriptors: plans1–3 IDs and0–8 field keys; comparison2–3 IDs/category/field keys; category or budget question with nullable category and140-character prompt; handoff1–3 IDs and180-character reason; allowlisted glossary term. No card can contain model-provided prices, coverage numbers, URLs or arbitrary component names. Clients render canonical catalog/domain facts. Category/budget questions and handoff are offers, not automatic state mutations.

Six actual Responses function tools: search_plans (lookup), show_plan_details, compare_plans (shared buildComparison), ask_preferences, offer_specialist, explain_term (shared insuranceTerms). Arguments checked after JSON parsing; IDs/category/fields/deduplicates/subtype comparison validated by app. Invalid calls return controlled tool error for bounded correction. Final model JSON cannot inject cards. Legacy suggestions require IDs grounded by a successful tool; lookup-only fallback shows at most3 grounded plans. No successful card/tool means controlled502. Handoff boolean is derived from validated handoff cards, never trusted from final model boolean.

Transport preserves store:false, server-only secret, three total Responses calls, at most two function calls per round, tools disabled on last round,20-second total deadline, no unbounded retries. Model reply max500characters with short two-sentence instruction. Semantic correctness of model prose still requires manual live evaluation; structural tests do not certify every answer.

Mock uses the same dispatcher to construct category/budget/detail/comparison/term/handoff cards. It is deterministic, not an LLM. All returned facts derive from catalog or glossary.

Stored assistant messages may include cards. User-message cards are stripped; invalid schema or retired IDs discard the card while retaining the conversation and unrelated state. Compare descriptors are rechecked against current domain. `chatRequestBody` continues to send role/content only.

Validation: actual route exercised with intercepted upstream transport;19 Chat tests +13 state tests passed. Targeted eslint clean. No paid/live request was made by this agent. Parent performs integrated build/browser/live validation.

Official transport reference checked: [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling). The server executes validated functions and returns function_call_output using the originating call_id; model calls do not execute UI actions directly.

Final integration:21Chat+15state tests within65total pass. Genuine Live and browser evidence is output/chat-daily-verification.md. Historical Lead transcript descriptors validate separately from current conversation cards and resolve facts only from planFacts snapshots (up to40unique plans). Missing legacy snapshots are explicitly unavailable, never filled from current catalog. Snapshot capture includes all plan IDs referenced in retained conversation cards, not only interested/compared IDs.
