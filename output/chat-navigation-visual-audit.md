# Chat navigation / motion audit — 12 September 2026

Independent Playwright CLI refresh-ui. Actual1440×900,390×844,360×844, each normal and emulated reduced motion. No source edits. Main live-chat/card flow is owned by root, not recertified here.

## Executed

- Home native hero link href `/chat?start=1`, clicked successfully six size/motion cases. Native pageswap/pagereveal capability present. Normal screenshot captured outgoing Home fading white; settled category captures subsequently taken after finite animations finished. No stuck white: document opacity1 and overflow0 all six cases.
- Category→health budget clicked six cases; category and budget full-page screenshots saved. Budget document overflow0 all six. Category card controls inherit17px, budget numerical choice text visually prominent, metadata14px minimum in measured sample.
- Ctrl-click opened `/chat?start=1` in another tab and left original Home intact. Initial harness awaited wrong popup event; corrected browser-context page event and successful repeated action is recorded. Native Back returned visible Home/hero, Forward visible Chat; opacity1 both. This proves history navigation, not necessarily BFCache cache-hit status.
- Chat category heading receives actual H1 focus. Mobile screenshot shows visible outline. No global click interception needed.
- Browse health search field submitted AXA: two results. Normal computed result animation `surface-arrive`; reduced `none`. Native detail opened: normal `content-reveal`, reduced `none`. Structural hydration skeleton observed by a document MutationObserver in both cases; no artificial minimum timer.
- Cleared isolated comparison selection and clicked actual motor category link: category=motor, correct motor heading and7cards. No Account mutation.

## Font finding sent to root

If ≥17px applies to all nonmetadata body/actions, budget skip, change-category and resume actions are16px; budget explanatory caution paragraph15px. Expanded reference paragraphs are14px and can reasonably count as metadata. No sampled metadata below14px. Report these exact computed values rather than claiming blanket typography acceptance. No source changed by auditor.

## Visual assessment

Category and budget pages are spacious, coherent white surfaces with clear questions and large choice targets. Mobile two-column category layout fits at360and390 without horizontal scrolling. Budget choice labels remain readable. Subjective readability8/10, low-clutter9/10, Apple visual language8/10; not a pixel similarity score. Category full page exceeds one phone screen due to7choices, but document scrolling exposes all controls.

## Evidence

- `output/chat-navigation-raw.txt`: six native hero navigation observations.
- `output/chat-budget-raw.txt`: six budget font/layout observations.
- `output/navigation-mechanics-raw.txt`: Ctrl click/history/skeleton/filter/detail/reduced results.
- `output/navigation-category-raw.txt`: category navigation and focused heading.
- Screenshots in output/playwright: `chat-category-{width}-{normal,reduce}.png` include transition-in-progress evidence; settled screens use `chat-category-settled-{width}-{normal,reduce}.png`; budget `chat-budget-{width}-{normal,reduce}.png`.

Status: navigation/layout/motion scoped PASS; strict17px body/action typography has the noted unresolved gap. External/hash/middle-click not separately executed; no listener changes affect them by source design, but they are not marked independently passed.

## Root-reported hero press regression / source fix

Root found active scale overwrote the hero's translateX(-50%) centering. Fixed in app/motion.css by removing hero from the generic scale selector and giving it combined translateX(-50%) scale(.98). Raised onboarding budget action/caution/back/resume selectors to17px; metadata small text remains14px. Source frozen for rebuild.

Independent mouse-down geometry test with the exact pending hero CSS injected into current production DOM: six size/motion cases. Maximum center displacement0.000004px (floating point); normal scale0.98, reduced scale1. Evidence output/hero-press-fix-raw.txt. This is runtime verification of pending CSS override, explicitly not a claim that the rebuilt server has already deployed it.

Root additionally requested mobile plan-card numeric/body rows17px and labels16px; added scoped ≤600px selectors. Tables intentionally remain16px and metadata14px. Final CSS source frozen and handed to root for build.

Final root verification supersedes the pending CSS status: the deployed skip button initially remained16px due to specificity. Root moved typography changes into the original chat-workspace.css rules and removed the redundant motion.css font overrides, rebuilt/restarted, then executed six actual press/category/budget cases without CSS injection. Budget caution/skip/back17px, mobile card facts17px/labels16px, document overflow0. Hero maximum center shift0.000004px. See output/chat-final-delta.txt and chat-fullpage-verification.md. No remaining typography blocker in this inspected scope.
