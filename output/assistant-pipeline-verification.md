# Assistant pipeline — 12 September 2026

Implemented for the local demo: **Extract → Retrieve & Structure → Highlight → Broker**. No trained ML model, recommendation ranking, or customer importance weighting is used.

## Current contract

1. **Extract:** Live requests make a separate ChatGPT Responses API call with strict structured output before product lookup. `customer` contains needs, currentCoverage, concerns, budget (amount + original period), category, mentionedPlans, and questions. Each populated item retains an exact customer quote. Assistant text is not evidence. Previous extracted quotes are carried across the rolling conversation; the prompt instructs latest corrections to replace prior values. Unknowns remain null/empty. Numeric budget and explicit period checks reject unsupported amounts and unit changes. Mentions do not create interest or consent.
2. **Retrieve & Structure:** ChatGPT calls the existing catalog tools. The demo reuses the already normalized, sourced product catalog; it does **not** ingest arbitrary new PDFs during a customer conversation. Tools return canonical price, coverage cells, units, bases, conditions, and source locators. Quote-only records remain available independently of an annual budget filter.
3. **Highlight:** Shared field comparison distinguishes different, insufficient information, and incompatible bases. It returns descriptive sentences with underlying values and source IDs; ChatGPT receives these as evidence for its short response. There is no best-plan score. Explicit prescriptive reply/handoff patterns are rejected; this is a guardrail, not proof that every possible model output is safe or factual.
4. **Broker:** The customer reviews the summary and explicitly consents. The lead stores an immutable structured overview, selected plans, canonical plan snapshots and transcript. Broker Overview shows Customer Need, Current Coverage, Budget, Plans of Interest, Key Differences, and Main Question. Differences link to source locations. The Broker provides advice. Historical interestScore values remain readable for compatibility; the scoring function, new score writes, and score UI were removed.

No key or model was populated in `.env.local` at verification. Explicit Live mode now returns a configuration error instead of silently producing mock replies. Mock remains available and visibly labelled; its literal extraction is only an offline demonstration, not a substitute claimed to be ChatGPT.

## Verification

- `npm test`: 82 passed. New coverage includes extraction before retrieval, strict schema/unsupported quote rejection, budget amount/period validation, monthly budget handling, upstream failures/deadline, prescriptive response rejection, source-preserving differences, snapshot immutability, reload and explicit interest without activity scoring.
- `npx tsc --noEmit`: passed.
- `npm run lint`: 0 errors, 7 pre-existing `<img>` warnings.
- `npm run build`: passed; `npm run start` serves local production at `http://127.0.0.1:8787`.
- Browser production walkthrough, mock mode: choose health without a budget gate → submit needs/current coverage/concern/budget/question → select two plans → compare → choose one plan of interest → review prefilled summary → consent → create `Demo Pipeline QA` → Broker Overview → reload. All six sections and the quoted current coverage remained available. Only the customer-selected plan was recorded as interested.
- Desktop and 390px mobile view checked. Expanded room-benefit difference showed 2,500 versus 12,000 THB/day with both source links, without declaring a winner. Viewport override reset.
- Demo lead: `/broker/leads/09a9992c-2374-4f99-97e3-59915ef6fdab` on local production origin. Test data exists only in that browser's localStorage.

## Remaining validation

Actual model extraction, correction quality, Thai paraphrasing, adversarial recommendation requests, and end-to-end latency must be evaluated with real credentials. Existing automated Live tests replace the network response; they do not establish real-model quality. Source-document parsing for new PDFs is outside this implementation; existing curated normalization is reused. Miro synchronization is pending because this session exposes no Miro tool.

API reference used: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
