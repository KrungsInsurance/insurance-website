# Home promotions / official imagery / motion / Broker — 12 September 2026

Status: DONE for this authorized UI/demo refresh. Local production rebuilt and restarted at http://127.0.0.1:8787/. Earlier all-market insurance research remains incomplete; this refresh does not claim exhaustive market coverage or a live insurer catalog integration.

## Changes

- Home: hero → existing official promotions → general purchase guide. Removed insuranceDaily and the duplicated lower promotion section. Campaign sources, validity dates and qualification conditions retained.
- Canonical Plan.image now resolves through official asset provenance. Browse, detail, Compare and API use the same local image paths. Contain artwork instead of cropping benefit text. Browse provides descriptive alt, image source link, and a visible insurer-image caption where product artwork was unavailable.
- Images: 40 mappings, 23 product artwork / 17 official insurer identity fallbacks. Distinct tiers may share actual family artwork. Allianz Thai artwork returned403; verified official Allianz organization identity is used explicitly as fallback. AIA artwork advertising a different benefit maximum was replaced with its clean official logo. No price or coverage fact changed.
- Motion: CSS-only transform/opacity,140–200ms; card lift/image hover, press feedback, Chat/menu entrances and exits. Reduced-motion disables movement. No new dependency.
- Broker: dedicated navigation, current local status counts, name/category/plan search, status filters, clear empty states, readable request details, call workspace, saved outcomes/history and read-only historical snapshots. Existing routes/local demo state preserved.

## Executed evidence

| Check | Result |
|---|---|
| Unit/domain tests | 66/66 PASS — `npm test`, output/product-broker-tests.txt |
| Typecheck | PASS — `npx tsc --noEmit`, output/product-broker-typecheck.txt |
| Lint | 0 errors;23 warnings at source-freeze run — existing native-img and diagnostic script warnings, output/product-broker-lint.txt |
| Production build | PASS — `npm run build`, output/product-broker-build.txt |
| Home | 3 valid promotion cards,5 purchase steps,0 Daily sections;4/4 images decoded;360/390/1440px no horizontal overflow |
| Browse | 7/7 categories;40/40 images decoded;40/40 alt/source mappings;17/17 insurer captions;390px no overflow |
| Shared images | Actual filter→selection→detail→Compare flow and POST /api/compare health01/02 returned matching canonical asset paths |
| Motion | Normal hover transform=-3px,200ms;Chat180ms;reduced-motion animation=none and0 active animations |
| Chat interaction | Composer focus, draft retained through minimize/restore,420px compact,390×844 viewport fit, Escape focus return |
| Picker | Normal160ms entrance;reduced-motion none;keyboard selection and Escape return verified |
| Broker | Search/status/counts;actual consent→Lead;accept→simulated call→all3 outcomes;reload/history/duplicate prevention;390/1440px no overflow |
| Account | Source SHA256 unchanged:80964F735428A37E73EE84844322FF6C557717E8202A4596922D3B20403E7EF4 |
| Client secret scan | 0 OpenAI project-key patterns in built client assets; no key printed |

Independent Home/Browse evidence: `output/product-home-browse-audit.md`; Broker evidence: `output/broker-product-refresh-audit.md`; motion result: `output/product-motion-result.txt`. Root visually reviewed Home1440, Browse motor1440, Broker desktop and lead mobile screenshots. Apple resemblance is a design judgment, not a measured fidelity score; existing Figma Home structure and Apple-style hierarchy/materials retained. No Broker-specific Figma screen was visible in the inspected draft.

The initial immediate picker-focus assertion raced Radix's close focus callback; waiting for focus restoration passed. No application workaround added. Broker double-click save commits once; a second pointer event can move focus after the form disappears, while normal single-click focus returns correctly. No financial transaction or real calling performed. Live OpenAI code/config unchanged in this refresh; previous live tests are historical evidence, not a new live run.

## Research and limits

Sources and access investigation: research-plan-images.md, research-plan-images-health-life.md, research-insurance-api.md. Partner APIs exist but require provider access; no verified open API for all Thai insurers/products was established. Current website remains a sourced local catalog. Some official product-art requests are blocked, hence labelled identity fallbacks. Campaign destination availability is not newly certified by this run; external links and conditions remain sourced as previously audited.

Miro customer flow updated to Home promotions→purchase guide and Broker search/filter workspace. Status update/readback recorded on the current V2 status item3458764683443768198. Source scope is complete; earlier whole-market research remains separate.
