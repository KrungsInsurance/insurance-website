# Full-page Chat and navigation — 12 September 2026

Local production: http://127.0.0.1:8787/chat?start=1. Latest user authorization adds `/chat`; existing routes and underlying Compare/Lead contracts remain. No new dependency.

## Delivered

- Home start uses native navigation through a short white fade into a centered category question and seven cards, followed by an annual-budget question. `/chat` then provides a full-page conversation; the setup query is consumed so reload resumes messages.
- Shared ChatWorkspace retains existing tools, canonical cards, comparison, editable summary, consent and Broker handoff. Contextual overlay remains available, with a full-page link preserving its unsent text, summary fields and edit provenance. Consent is deliberately not restored.
- Main chat text is18px desktop/17px mobile, mobile facts17px and labels16px, tables16px and source/condition metadata at least14px in inspected samples. Translucent header/composer surround solid readable cards. Figma Chat Overlay3:247 was inspected in the logged-in browser; MCP reauthentication blocked dedicated extraction. This is a reference-informed implementation, not a claimed pixel match.
- Budget choices use up to4 exact sourced canonical annual amounts. Example/starting/table labels, conditions and source links remain visible. No invented thresholds or annualizing trip premiums. Liability has no qualifying price anchors and offers skip. Published starting/example premiums are references, not current personalized quotes.
- Explicit skip is null and proceeds to cards. Chat numeric budgets invoke the shared search with the annual period; Browse's existing period behavior remains unchanged. Existing model input/output/tool validation and server-only credentials remain.
- Native cross-document transitions, keyed Browse results, native disclosure fade and structural loading skeletons. No loading timer, blur animation or new animation library. Reduced motion disables animations. Unsupported browsers retain ordinary navigation.

## Executed verification

| Check | Actual result |
|---|---|
| Automated tests | `npm test`:71/71 passed. Includes exact budget references, all7 mock skip categories, annual travel exclusion and shared search behavior. |
| TypeScript | `npx tsc --noEmit`:passed after draft provenance fix. |
| Lint | `npm run lint`:0errors/26warnings from native-image usage and local QA scripts. Targeted source lint passed. |
| Production | `npm run build`:passed; local production restarted with final assets and HTTP200. Initial rebuild hit Windows running-server output lock; stopped the verified project server and rebuilt successfully. |
| Genuine Live | Real browser Home-style category→motor→skip request returned HTTP200, `mode:live`, canonical motor04/03/01 plan cards. Displayed18px message/14px conditions and no desktop overflow. No mocked response substituted. |
| Customer→Broker | Independent11case mock audit passed: exact910 budget, cards, interest, edited summary, unchecked-consent error, explicit consent, actual local lead and Broker display. See chat-fullpage-handoff-audit.md. |
| Resume and focus | Reload consumes start query; overlay draft and handoff fields survive expansion; consent resets; category conflict cancel restores trigger focus; confirmation advances to the correct budget; mobile keyboard checks passed. Final rebuilt delta also verified the submitted lead retains `summary.editedByUser === true` after expansion. |
| Native navigation | Ctrl-click opens another tab without leaving Home; Back/Forward remain visible. Browse category/search/disclosure transitions executed. Hydration skeleton observed during real hydration. No claim of separately testing middle-click/external/hash links or a BFCache cache hit. |
| Final deployed CSS | Root repeated actual mouse-down and category→budget at1440/390/360, normal and reduced motion, without injected CSS. Hero center displacement under0.000004px; budget caution/skip/back all17px; all6 document overflow0. Mobile card facts17px/labels16px. |

Visual inspection: desktop Live card plus settled mobile budget and conversation captures. Full-page cards intentionally scroll; comparison tables retain their own horizontal region. Native view-transition effects were checked in Chromium, with no promise of identical support in every browser. Mobile virtual keyboards and exhaustive screen-reader audits were not performed.

Detailed evidence: `chat-budget-evidence.md`, `chat-navigation-visual-audit.md`, `chat-fullpage-handoff-audit.md`. Local diagnostic outputs: chat-page-tests.txt, chat-page-typecheck.txt, chat-page-lint-full.txt, chat-page-build.txt, chat-full-live-result.txt, chat-final-delta.txt. Screenshots: output/playwright/chat-full-live.png, chat-final-budget-390-false.png, chat-final-mobile.png.

Earlier whole-market insurance research remains incomplete and is separate from this UX delivery. No insurance facts or prices were invented to fill gaps; no real customer data, calls, purchases or issued policies were used.
