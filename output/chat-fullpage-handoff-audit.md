# Full-page Chat / handoff independent audit

2026-09-12 · production http://127.0.0.1:8787 · isolated Playwright CLI session chatpageaudit. Mock selected before any message; no live calls, no user IAB/state access, no source edits.

| Executed case | Result and evidence |
|---|---|
| Home entry | PASS: actual “เริ่มค้นหาประกันเลย!” link opened /chat?start=1 with category selector. |
| Category and exact budget | PASS: selected อุบัติเหตุ then 910 บาท/ปี ราคาตามตาราง. Conversation context and outgoing request retained exact 910 annual ceiling. Cards showed PAจิ๋ว250, SaveDee365, PAHoliday910 with separate conditions and premium bases. |
| Start-query consumption/reload | PASS: URL became /chat; actual reload retained conversation and three plan cards, did not reopen onboarding. |
| Interest and editable summary | PASS: PAHoliday interest selected it; changed name to QA Fullpage Handoff and needs to อธิบายค่ารักษาอุบัติเหตุ. |
| Consent validation | PASS: submit unchecked showed local alert ยืนยันความยินยอมก่อนส่ง, consent remained false. |
| Actual lead and Broker | PASS: after explicit check+submit, actual Broker link opened /broker/leads/64131d26-3e34-4c87-99c1-1df18f4093bd. Both edited name and needs visible. |
| Overlay unsent draft expansion | PASS: opened overlay at motor-01 detail, typed QA unsent overlay draft, clicked เปิดแชตเต็มหน้า. /chat composer retained exact unsent text. No send occurred. |
| Category conflict cancellation | PASS: เริ่มเลือกใหม่ → health triggered alertdialog. Cancel returned focus to health category trigger. |
| Category conflict confirmation | PASS: repeated health selection → ยืนยันเปลี่ยน opened health budget picker, mock still selected. |
| Handoff expansion preserves edits but resets consent | PASS: health-06 detail interest opened overlay summary. Set QA Draft Expansion / QA needs preserved, checked consent, expanded full page. /chat?handoff=1 retained both exact edits and reset consent to false. |
| Mobile keyboard and layout | PASS: 390×844 no document horizontal overflow. Tab from name reached needs textarea; Space checked consent and second Space unchecked. Screenshot shows form/actions/composer within viewport width and visible native focus. |

11/11 bounded cases passed. No blocker found. Category confirmation was verified through the resulting health budget UI, not by direct storage inspection. This pass does not claim exhaustive keyboard/a11y coverage or real mobile virtual-keyboard testing.

Screenshot: output/chat-fullpage-summary-mobile.png (390×844, stable animation-disabled capture; visually inspected).

## Final rebuild delta — editedByUser metadata

PASS. In the same isolated session, opened health-07 detail → interest overlay; edited name to QA Edited Metadata Delta and needs to ตรวจรักษาข้อมูลที่แก้เอง; checked consent then expanded full page. Both text edits persisted and consent was unchecked. Explicitly rechecked consent and submitted. Actual Broker link opened lead 982e9f81-6971-40cc-88b7-9029413d1bcc. Targeted read of this synthetic lead in insurance-demo-state confirmed summary.editedByUser === true and summary.needs === ["ตรวจรักษาข้อมูลที่แก้เอง"]. No live request and no storage mutation.
