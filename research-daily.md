# insuranceDaily — primary evidence, 12 September 2026

Scope: three manually selected, dated official promotion updates. They are explicitly labelled promotions, not breaking news, a daily automatic feed, or an exhaustive insurer survey. UI shows the campaign period and the editorial verification date separately. Active periods are filtered using Bangkok calendar date; expired campaigns disappear. No invented publication dates.

| Editorial item | Primary source and locator | Period verified again through web on12Sep2026 | Important distinction |
|---|---|---|---|
| AXANOW | https://www.axa.co.th/th/promotion/axanow — current body heading and terms1–5 |26Mar–31Dec2026| Body15% type1/18%2+3+garage; compulsory10%; personal/online eligibility. Page publication28Nov2024 and stale search title10% are not campaign start or current benefit. No additive camera discount claim |
| MSIG Travel Easy Plus | https://www.msig-thai.com/th/promotion/enter-promocode-15stb-or-15ptt-get-e-coupone-voucher-worth-1000-thb-msig-travel-easy-plus — offer section, date line, reward terms |1Aug–30Sep2026|15STB/15PTT15%; rewards conditional. Exact6000premium reward ambiguous, not invented. Survey90days and effective-policy conditions retained |
| MSIG Home15 | https://www.msig-thai.com/th/promotion/กรอกโค้ด-home15- รับส่วนลด-15-สำหรับประกันภัยบ้านแทนรัก-รับ-starbucks-e-coupon-สูงสุด-600 — offer period and reward table |1Sep2026–31Jan2027|15% discount; reward threshold for600 malformed, not promised. Survey90days and effective-policy conditions retained |

The complete original official image URLs and detailed eligibility are retained in `app/page.tsx` and `research-home-content.md`; no new image downloaded. Both Daily and lower promotion cards use the same three data objects.

## Five beginner purchase steps

This is editorial plain-Thai synthesis, not a claim of universal approval, claim eligibility, or uniform policy deadlines.

1. Identify unmet needs and affordable ongoing premium — OIC citizen manual: https://www.oic.or.th/web-upload/migrated/content/85388/insur2_0.pdf (needs, ability to pay throughout coverage).
2. Compare premium, limits, conditions and exclusions — same OIC manual; no universal premium/limit values.
3. Check licensed seller and declare truthful application information — OIC manual (licence); MTL https://www.muangthai.co.th/th/health-insurance-journey (truthful health declarations). Both primary results freshly reviewed.
4. Review contract and pay through a company-recognised channel, retain receipt — OIC manual and https://www.oic.or.th/web-upload/1xff0d34e409a13ef56eea54c52a291126/202407/m_news/3035/68715/file_download/e799d2c2ed5431ba030d9aea17f7a8d2.pdf (company receipt, checking policy details). Manuals are established education, not2026news.
5. Retain policy/claim channels/due date and review before renewal — MTL customer service https://www.muangthai.co.th/th/service and health journey (policy, premium, claims, renewal services).

## Implementation / check

Changed Home and `components/home-content.css` only. Native horizontal overflow rail,44px arrow controls, keyboard-focusable labelled region, ordinary external links; no autoplay or carousel dependency. Hero unchanged; five purchase steps replace eight glossary terms. Scoped ESLint:0errors,2existing native-image warnings. Root owns final build and actual browser review; not yet claimed passed for this new layout.
