# Independent P2 acceptance inventory — 12 September 2026

Read plan-v2 §§3–5 and V14–V21. Executed against current local production with independent Chrome CUA tab and read-only HTTP requests. No application edits/rebuild/restart. **P2 is not fully passed: V20 URL/state synchronization bug reproduced; V15 quote-only section gap observed.** Root notified before report.

|Acceptance/subcase|Result|Actual evidence|
|---|---|---|
|V14 API one plan|PASS|POST health/health-01→400 INVALID_INPUT|
|V14 API four|PASS|health01–04→400 INVALID_INPUT|
|V14 API duplicate|PASS|health01 twice→400 DUPLICATE_IDS|
|V14 API unknown|PASS|health01+missing→404 PLAN_NOT_FOUND|
|V14 API mixed|PASS|health01+motor01→400 MIXED_CATEGORY|
|V14 malformed JSON|PASS|body `{`→400 INVALID_INPUT|
|V14 incompatible subgroup|PASS|motor01+motor05→400 INCOMPATIBLE_PLANS|
|V15 quote sorting|PASS|Motor ascending5400 then5800 then3quote-only; descending5800 then5400 then3quote-only. Quotes show request-price, not0/free.|
|V15 quote budget separate section|FAIL scope gap|Applied motor budget1000;0results empty state and no3quote-only section. Quotes excluded safely but §3 says display separately.|
|V15 AI quote claims|NOT RUN by this auditor|Use independent Chat report, not inferred from API/UI.|
|V16 verified same|PASS|API insurer and waitingDays=same for health01/02|
|V16 different|PASS|roomPerDay2500/12000=different|
|V16 known/null|PASS|annualLimit2500000/null=insufficient|
|V16 null/null|PASS|deductible/eligibility null/null=insufficient|
|V16 basis/scenario mismatch|PASS|premium row=not_comparable, rendered conditions instead of best-price ranking|
|V16 differences-only|PASS prior current-family build|Checked toggle; same company omitted while unknown rows remained. Needs post-fix version pin if bundled with new changes.|
|V17 Browse shared IDs through navigation|PARTIAL|Browse1/2/3checkbox states and Compare link names correct. URL-specific sync failure below prevents whole acceptance PASS. No AI suggestion mutation tested this round.|
|V18 category Cancel|PASS|3health selected; clicked motor then Cancel;3remain checked, URL unchanged.|
|V18 category Confirm|PASS|Reopened and confirmed; motor URL and all0checkboxes.|
|V18 subgroup Cancel|PASS|Selected motor01 then clicked CMI motor05; Cancel preserves motor01.|
|V18 subgroup Confirm|PASS with UX note|Confirm clears all selections; requested CMI not auto-selected. Dialog misleadingly says change category though both are motor; contract clear behavior satisfied.|
|V19 selection0→1|PASS|First health checkbox shows named Value and add-one instruction.|
|V19 selection1→2→3|PASS|Checked health02/03; count and3IDs link match names.|
|V19 fourth attempt|PASS|Clicked fourth (packageM); remains unchecked, first3checked, inline error names packageM. Check helper rejected expected refusal; subsequent DOM proved correct state.|
|V19 add third in Compare|PASS|Selected slot3 health03; URL3IDs; reload shows3slots. Initial immediate DOM empty was navigation timing, superseded by reload.|
|V19 duplicate|PASS API/option prevention|API rejects duplicate; slot options exclude plans chosen in other slots. A deliberate duplicate UI attempt was not possible through select.|
|V19 remove→1|PASS|Remove last from2; health01 name retained, instruction2–3 appears.|
|V19 remove→0|PASS|Remove last;3empty slots with instruction, no raw IDs/table.|
|V20 browser Back|PASS rendered slots|After adding3 then Back, original2slots restored. Shared-state persistence not fully passed.|
|V20 refresh|PASS rendered slots|Reload3-plan URL shows exactly3selected IDs.|
|V20 explicit valid URL sync|FAIL|After clearing0, revisit previously-recorded health01/02 then explicit health03-only URL; Browse shows0selected instead of health03. Source effect syncs only successful2–3 comparison when history differs.|
|V20 no-query saved selection|PENDING root fix retest|Must verify after URL-sync fix; not infer from slot rendering.|
|V20 invalid category|PASS|category=bad URL→unknown-category alert,no table,no health fallback|
|V20 unknown ID|PASS|unknown+health01→not-found alert,no table|
|V20 duplicate URL|PASS|health01 twice→duplicate alert,no table|
|V20 four URL|PASS|health01–04→2–3 alert,no table|
|V20 mixed URL|PASS|health01+motor01→same-category alert,no table|
|V20 incompatible URL|PASS|motor01+motor05→subgroup alert,no table|
|V21 AXA search|PASS|Typed/submitted AXA in motor;5results,query preserved after descending sort|
|V21 Thai search|PASS|Typed/submitted พ.ร.บ.;only CMI returned,sort/category preserved|
|V21 sorting|PASS|Descending numeric5800/5400 followed quote-only; previous name-sort checked separately|
|V21 negative budget|PASS controlled feedback|Submitted-1;URLretains invalid value, inline message “กรอกงบเป็นตัวเลขตั้งแต่0ขึ้นไป”; invalid value ignored for filtering. Not role=alert, but visible nearby.|
|V21 empty and clear|PASS|budget1000 motor→empty;clicked clear→motor5results,category preserved|

## Fix/retest required

1. Synchronize explicit valid0/1/2/3 URL IDs independently from comparison-history equality; do not overwrite selection on invalid URL. Root delegated fix.
2. Resolve §3 quote-only separate listing under budget filter, or explicitly amend approved scope; hiding quote-only is safe numerically but not the specified UI.
3. V17 full Browse→Detail→Compare→Chat and suggestion non-selection still needs fresh action evidence after fix. Do not mark P2 DONE from API validation alone.

## Independent retest after URL/quote/subgroup fixes

Latest production rechecked through actual controls:

- V20 PASS: explicit0 URL→Browse0checked; explicit1 health03→Browseonlyhealth03checked; no-queryCompare restoreshealth03. Explicit2→Browsehealth01/02checked; explicit3→Browse01/02/03checked. Invalidcategory+badID followed no-queryCompare preservesall3. This supersedes the reproduced URL-sync FAIL above.
- V15 PASS separate-list requirement: motor budget1000 renders0matching plans plus named “แผนที่ต้องขอราคา” section withmotor01/02/05 and explicit exclusion from budget-matching count. Previous gap resolved.
- V18 PASS subgroup retest: selectingCMI againstmotor01 opens “เปลี่ยนกลุ่มแผนที่เปรียบเทียบ?”; Cancel keepsmotor01 and returns checkboxfocus. Confirm now leavesonlyCMIchecked. Old misleading wording/clear-only behavior resolved.
- V17 PASS bounded path: retainedhealth01/02→Browse→firstDetail→AddCompare(existingID)→Compare still01/02only→Chat. Mockrecommendation returned01/02checked andhealth03unchecked; no automatic thirdselection. Summary opened with interested-plan controls. No lead submitted.
- V19 duplicate-add PASS: existinghealth01added fromDetail keeps2uniqueIDs, no silent droppedthirdplan.

No unresolved functional bug remains from this auditor's reproduced P2 findings. API/semantic checks above remain supporting evidence; AI quote-only correctness should be joined with independentChat evidence before whole-phase signoff. Browser contexts were not reset. No app/build/server edits.

Final visual observation: darkcharcoalChat panel, whiteheader/composer, pinkcircularClose visibly rendered over mutedbackground. This matches root-provided darkChat reference direction; exactFigma screenshot was not independently obtained. Rubric remainsApple8/10,Figma structural7/10,simplicity8/10,anti-slop8/10. Do not interpret as pixelmatch or benchmark score.
