# Non-life product expansion research

ตรวจแหล่งผู้รับประกันโดยตรง ณ 12 กันยายน 2026 สำหรับ Motor / Travel / Property / Liability โดยใช้ Deep Research workflow ตามขอบเขตงาน ไม่ใช่การสำรวจครบทุกบริษัทหรือทุกกรมธรรม์ ไม่ได้ขอราคาเฉพาะบุคคลหรือส่งข้อมูลลูกค้า

## รายการพร้อมนำไปสร้างข้อมูล

“พร้อม” หมายถึงมีหลักฐานรองรับ fields ที่ระบุ ไม่ได้แปลว่าทุกช่องมีตัวเลข ต้องรักษา unknown เมื่อยังไม่เลือกเงื่อนไข ห้ามใช้ทุนสูงสุดทั้งผลิตภัณฑ์แทน tier

### N1 — กรุงเทพประกันภัย ประเภท 1 เลือกทุนเองได้

เลือกตัวอย่าง Group C รถอายุ2–5ปี ทุน100,000บาท; annual example9,500บาท รวมภาษีอากรและส่วนลดCCTV ไม่รวมพ.ร.บ. รถตัวอย่างอยู่ในกลุ่มที่แสดง เช่น Toyota Yaris/Honda City; ยังไม่ใช่ใบเสนอราคาเฉพาะทะเบียน

| Field | Value / basis |
|---|---|
| class | ชั้น1 |
| ownDamage / theft / fire | 100,000บาท ตามทุนตัวอย่าง |
| BI | 1,000,000บาท/คน;20,000,000บาท/ครั้ง |
| thirdPartyProperty | 5,000,000บาท/ครั้ง |
| deductible | 3,000บาท/claim พร้อมข้อยกเว้น |
| repair | อู่ในสัญญา |
| PA / medical | 200,000บาท/คน |
| flood | included; capของน้ำท่วมแยกไม่ระบุ ห้ามแต่ง |

ส่วนแรกยกเว้นเมื่อแจ้งทันทีสำหรับรถชนรถ รถพลิกคว่ำขับต่อไม่ได้ หรือน้ำท่วม ตามหมายเหตุหน้าเว็บ; รถใช้ส่วนตัว≤7ที่นั่ง ตรวจสภาพก่อนรับ ไม่รับรถรับจ้าง/ให้เช่า/แต่ง/ดัดแปลง; ทุน≤80%มูลค่ารถ ไม่ใช่มูลค่ารถเต็ม

[Primary product](https://www.bangkokinsurance.com/th/product/motor/voluntary/firstloss): coverage rows71–90; premium rows97–104; GroupC111; underwriting113–124. BI sourceไม่ระบุถ้อยคำส่วนเกินพ.ร.บ.ชัดในหน้านี้ จึงห้ามตีความว่าเป็นยอดรวม/เทียบAXAส่วนเกินโดยไม่เปิดwording. Price periodรายปีเป็นบริบทผลิตภัณฑ์แต่ตารางที่อ่านไม่พิมพ์รอบชัด: ห้ามอนุมัติ annualpricecell โดยอาศัยบริบทอย่างเดียว; ตรวจ schedule หรือเก็บ quote-only จนยืนยัน. effective editionไม่ระบุ

### N2 — วิริยะ 2+ ทุน100,000

| Field | Value / basis |
|---|---|
| collision | รถชนรถ ทุน100,000บาท |
| theft/fire | 100,000บาท/ครั้ง |
| BI | 500,000บาท/คน;10,000,000บาท/ครั้ง |
| thirdPartyProperty | 1,000,000บาท/ครั้ง |
| PA/medical | 50,000บาท/คน ผู้ขับ1+ผู้โดยสาร5 |
| bail | 200,000บาท/ครั้ง |
| price / deductible / flood / repair | unknown; ต้องเลือกข้อมูลรถและwording |

[Official Vstore selected product](https://vstore.viriyah.co.th/th/insurance-product-event.php?class_id=8&group_id=1&product_id=4): heading113, highlights117–119, table126 onward. ไม่ต้องตรวจรถตามหน้าเว็บ แต่ไม่อนุมานไม่มีส่วนแรก. แบบฟอร์มแสดงเบี้ย0ก่อนคำนวณ **ไม่ใช่ราคาจริง**. ขอบเขตBIเทียบพ.ร.บ.ยังไม่ระบุในหน้านี้

### N3 — MSIG Trip Easy Plus Domestic แผน3

เลือกผู้เดินทางอายุ1–75ปี ทริป1–3วัน: ตารางเบี้ย230บาท/ทริป ไม่ใช่รายปี. อายุ76–80มีวงเงินบางรายการลดลง

| Field | Value / basis |
|---|---|
| accident death/PTD | 500,000บาท |
| accident medical | 50,000บาท |
| food poisoning/acute enteritis medical | 20,000บาท แยกจากอุบัติเหตุ |
| evacuation / remains return | 100,000 /100,000บาท |
| liability | 500,000บาท |
| baggage | 15,000รวม;3,000/ชิ้น;ส่วนแรก1,000 |
| flight cancellation/postponement ticket | 10,000บาท |
| flight delay | 2,000/ทุก4ชม.;รวม12,000 |
| interruption | ตาราง0 -> not_covered ไม่ใช่unknown |
| max trip | 31วันตามตารางระยะเวลา |

ไทยเท่านั้น ผู้มีถิ่นฐานไทย อายุ1–80; ข้อยกเว้นสำคัญสุรา สงคราม การทำร้ายตนเอง. เงินตามตารางเป็นmaximumต่อกรมธรรม์ทริป ไม่เหมารวมเป็นper-eventเมื่อsourceไม่ระบุ

[Primary](https://www.msig-thai.com/th/personal-insurance/trip-easy-plus-domestic): table241–319; underwriting330–345; premiums351–359. รูปแบบcoverageต้องแยก accident-onlyจากAXA domesticให้ตรงเหตุ

### N4 — MSIG Travel Easy Plus Easy1 / single trip / adult15–75

medical5m; death/PTD5m; evacuation3m (non-preexisting) versus150k forpreexisting; remains2m versus100k; cancellation500k; interruption500k; baggage60k; liability4m THB maximum. Delay7k/every6h capped35k; when cancellationwithoutreplacement rules differ. Medical Thailand follow-up250k is inside medicalcap, not additive. Telemedicine5k inside medicalcap. Price unknown until trip quote; do not reuse startingheadline.

[Primary](https://www.msig-thai.com/th/personal-insurance/travel-easy-plus): table256–382; underwriting560–587. Single entry6months–80; chosenadultscenario15–75. Thailand origin/end, buy≥2h beforedeparture, no travel already underway. Motorcycles/e-scooters and hazardousactivities excluded. Annual variant15–65 selects120or180days/trip—do not default180. Marketing says evacuationmaximum2m but selectedtableEasy1 says3m; attach explicit table-source/conflict note or quarantine evacuation until issuer confirmation. All other listed table facts remain usable. Not a claim of all medical preexisting coverage; evacuation/remains have specific exception rows.

### N5 — Allianz Ayudhya Basic Home แผน1

[Primary page](https://www.allianz.co.th/th_TH/property/basic-home.html) states1,009บาท/year includingtax+duty,500k plan1, longterm2year discountup-to12.5%,3yearup-to16.66%. These are period pricing features, not a datedcampaign.

[Linked official brochure](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf),p2 rows1–4:
- Combined building(excludingfoundation)+contents500,000; **not two500k caps**.
- Fire/lightning/explosion/water-not-flood/vehicles/aircraft/storm/quake/hail inside primarysum.
- Flood20,000; waiting7days.
- Electrical50,000 peroccurrence/peryear combined, only when electricalfailurecausesfire.
- Burglary20,000 peroccurrence/peryear combined; visibleforcedentry/robbery.
- Class1/2/3 construction; class2/3 onlydetachedpersonalresidence,no rental/business.
- Property owned by others, mobile/computersportable/cash excluded.
- Deductible/valuation unknown: brochure does not justify0/newreplacement.
Edition: PDF version211214 effective1Jan2022; still linked by liveofficialpage. Preserve date, do not relabel2026wording. Geographicexceptions inPDFp2 must remain linked rather than assertallareas.

## Verified quote-only products, not numeric retail tiers

### N6 — คุ้มภัยโตเกียวมารีน Public Liability
[Official](https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html), sections “คืออะไร/เบี้ย/ข้อยกเว้น”: businesspublicliability for third-partyBI/PD and legaldefensecosts with insurer writtenauthorization. Premiumdependslimit/business/location/risk/extensions. Limit,deductible,territoryspecificschedule,aggregate and quote unknown. PurefinanciallosswithoutprecedingBI/PD excluded; jurisdictionlimitedtoscheduledcourt. Suitable for honestbusinessinquiry only, not personalizedconsumerplan.

### N7 — MSIG Public Liability
[Official](https://www.msig-thai.com/th/business-insurance/public-liability): insuredpremises/operations, third-partyBI/death/PD duringpolicyperiod, legalcosts; businessnegligence/premisesdefect. Sourceexplicit; directreader intermittentlyfails but officialindexedfulltextavailable. Price/limit/deductible/defense-inside-or-outside/jurisdiction unknown. Do not compare these as numeric better/worse againstTokio withoutquotes. Confidence medium due indexedretrieval; optionalinformationalrecord, not “fully quoted”.

## Promotions and official imagery

Verified **active by stateddates on12Sep2026**, subjecttoeligibility:
- [Allianz singletrip](https://www.allianz.co.th/th_TH/travel-insurance/promotion/single-plan-promotion.html):1Feb–15Sep2026, purchaseviaallianz.co.th, excludesSambaFamily/TangoFamily. Premium600–1200→Starbucks100;1201–3000→200;3001–4500→300;4501+→400 THB. Mustregisterrewardby15Oct2026, lawfulThairesident, noncancelledpolicy. Do not subtractgiftfrompremium. [Official campaign image](https://www.allianz.co.th/th_TH/travel-insurance/promotion/_jcr_content/root/parsys/wrapper_75538402_cop/wrapper/teaser_copy_1319904545/image.img.82.3360.jpeg/1788255122596/single-plan-737x474-allianz.co.th-sep2026.jpeg).
- [BKI current promotion166](https://www.bangkokinsurance.com/en/product/promotion/166): currentopenedpageends31Oct2026,18% codeCTAWW fornewoutboundtrip/annual viawebsite;Starbucks200 onpostdiscountorder≥2000;selectedtrip3/4/pet orallannualViu30days;nonstackable. Searchindexstale15%CTA26/30Sep conflictswithopenedpage; useopenedcurrentversion and recheckbeforepublication.
- [MSIG promotions](https://www.msig-thai.com/th/promotions): currentlisting15STB/15PTT giftsup-to1000 ends30Sep2026; domestic18DM listed. **Details/thresholds not fullyopened: candidateonly, not publish-ready campaign.**
- [Expired BKI2+special](https://bangkokinsurance.com/product/motor/voluntary/firstcare2plusspecial):7200 promotion ended31Dec2023; do not publish ascurrent.
- [Official Viriyah2+ icon](https://vstore.viriyah.co.th/th/img/insurance/icon-plan-02-plus.png) returned successfully. Sourceprovidedicon, nothero; productimagesforothers stillneedassetinspection. No syntheticimagepassedoffasinsurerasset.

## Existing unknowns and honest resolution

The existing AXA owncar sums and deductibles are configurable. Research can expose choices; it cannot manufacture a selected vehicle/quote. Outboundtierunknowns resolve only after selectingBasic/Advance/Max anddocumentedition. Annualtrip90/180 remains a choice. Propertybuilding/contents sumunknown is meaningful until selected. Copay and absentwording cannot become0. ExistingAXAdomestic exactdelaycauses and inbound missingevacuationrows remainunknown; competingMSIG values must never fillAXAcells.

Use clearer UI reason labels: “ต้องเลือกทุนรถ”, “ต้องระบุวันเดินทาง”, “ไม่มีวงเงินในเอกสารที่ตรวจ”, “เอกสารขัดแย้งกัน”. Do not replace research gaps with invented reassuring text. Sharedprimarysum andper-year/per-eventcaps requiredistinctbasis to prevent misleadingnumericranking.

## Coverage ledger and integration boundary

| Insurer | Evidence reached | Result |
|---|---|---|
| MSIG | domestic/outboundtables+liability+promolisting | N3ready;N4tableconditionalconflict;N7quoteonly |
| BangkokInsurance | motorselectedtable/propertyregister/promodetail | N1ready;propertynumericcandidate withheld pendingtierbrochure |
| Viriyah | selected2+Vstoretable;CMIsearch | N2groundedfields;quoteunknown |
| AllianzAyudhya | BasicHomepage+linkedPDF;promofulldetail | N5readydatededition;singletrippromoready |
| TokioMarine | publicliabilityofficialpage | N6quoteonly |
| Dhipaya | targetedsearch mostlyIR/unrelatedPA | No nonlifeproductcandidateclaimed |
| AXA existing | prior25recordledger and unresolvedreasonreview | Noautomaticunknown-to-zero |

5 retail candidates with explicittiers/scenarios (one sourceconflict),2 informationalbusinessproducts. Additional retail companies beyondAXA:4 (MSIG/BKI/Viriyah/Allianz). No claim of wholeThaiinsurance-marketcompleteness. No app/catalog edits, quotes purchased, customerrecords, policyissuance or externalmessages.


## Implemented expansion — 12 September 2026

Catalog now contains 38 records: original 25 preserved plus 13 sourced candidates. New IDs: motor-06/07, travel-06/07, property-06, liability-06/07, health-06/07, life-06/07, accident-06/07. Retired draft IDs were deliberately not reused, so historical saved selections cannot resolve to unrelated new products.

Nonlife: five retail candidates and two business liability information/quote candidates above. Life/health/PA: six candidates from `research-expansion-life-health.md`: AIA Health Happy 5m, Allianz Beyond Care Plan 1, BLA Gain1st eSavings 10/5, PRU Life Care 10/10, BKI PA Holiday 300k, BLA Accident Care 1m rider. FWD 500k was held because room/waiting terms and selected tier evidence were incomplete; no invented candidate was inserted.

The new seeds bypass legacy AXA/MTL augmentation and explicitly declare insurer, eligibility, exclusions and source metadata. Each new eligibility string has dedicated `:eligibility` evidence with its section locator. BLA eSavings identifies Bangkok Bank as the authorized distribution source rather than falsely attributing that webpage to the insurer. Coverage/price sources remain field specific; AIA dated brochure and PRU conditions PDF are linked for their relevant cells. Rider premium alone is not a complete policy quote. Marketing/table conflict for MSIG evacuation remains a conflict, not a guessed amount. Promotions remain researched evidence above, not silently applied to premiums.

### Current canonical coverage-cell ledger

Counts classify stored field states, not a claim that every policy clause is present. `unknown` includes unselected customer scenarios, unavailable public limits, and unverified terms. Existing 173-cell audit applies to the former 25-record snapshot only; it is not relabelled as a 38-record audit.

| Category | Plans | Known | Unknown | Not covered | Not applicable | Conflicting |
|---|---:|---:|---:|---:|---:|---:|
| Health | 7 | 67 | 58 | 1 | 0 | 0 |
| Motor | 7 | 35 | 31 | 8 | 10 | 0 |
| Life | 6 | 56 | 11 | 0 | 5 | 0 |
| Accident | 7 | 44 | 31 | 1 | 0 | 1 |
| Travel | 7 | 43 | 46 | 1 | 0 | 1 |
| Property | 2 | 17 | 7 | 0 | 0 | 0 |
| Liability | 2 | 2 | 8 | 0 | 0 | 0 |
| Total | 38 | 264 | 192 | 11 | 15 | 2 |

Validation: `validateCatalog()` → `[]` for all 38 records; `npm test` → 53/53 passed; `npx tsc --noEmit` and targeted ESLint passed. These verify contracts and regressions, not facts by source presence. No build or local server restart performed by this research agent; integration owner handles browser validation. Prior statement “No app/catalog edits” describes the research-only stage and is superseded by this explicitly authorized catalog integration.

## Unknown follow-up: every unresolved cell in the 13 additions

Checked 12 September 2026. Source paths below are the actual product tables/linked brochure identified above, not evidence that absence proves exclusion. Motor Viriyah linked policy details returned retrieval error. Liability pages end in contact/quote, with no public numerical schedule. Life/health prior primary reads inherited from the sibling report; AIA and Allianz brochure tables, BLA PA, both MSIG travel tables and both liability pages freshly reopened. No customer forms submitted.

| Plan | Field | Why unresolved / next evidence | Source path |
|---|---|---|---|
| motor-06 | floodLimit | ไม่มีวงเงินแยกในตารางที่อ่าน; ไม่ตีความการไม่พบว่าไม่คุ้มครอง | [จุดเด่น / น้ำท่วม](https://www.bangkokinsurance.com/th/product/motor/voluntary/firstloss) |
| motor-07 | floodLimit | ไม่มีวงเงินแยกในตารางที่อ่าน; ไม่ตีความการไม่พบว่าไม่คุ้มครอง | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://vstore.viriyah.co.th/th/insurance-product-event.php?class_id=8&group_id=1&product_id=4) |
| motor-07 | deductible | ตารางไม่ยืนยันส่วนแรกของ configuration นี้; ต้องดูตารางกรมธรรม์/ใบเสนอราคา ไม่ใส่ 0 | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://vstore.viriyah.co.th/th/insurance-product-event.php?class_id=8&group_id=1&product_id=4) |
| motor-07 | repairType | หน้าเลือกทุนไม่ระบุประเภทอู่/ศูนย์; ลิงก์รายละเอียดเพิ่มเติมเรียกไม่สำเร็จ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://vstore.viriyah.co.th/th/insurance-product-event.php?class_id=8&group_id=1&product_id=4) |
| travel-06 | delayTrigger | ตารางบอกจำนวนชั่วโมง/เงิน แต่ยังไม่มี wording ยืนยันสาเหตุสำหรับผลิตภัณฑ์นี้ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.msig-thai.com/th/personal-insurance/trip-easy-plus-domestic) |
| travel-07 | policyDuration | ยังไม่ได้เลือกวันเดินทางจริง; ไม่ใช้ maximum แทนระยะกรมธรรม์ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.msig-thai.com/th/personal-insurance/travel-easy-plus) |
| property-06 | bundledLiability | โบรชัวร์ที่อ่านไม่พบผลประโยชน์ liability; ไม่อนุมานว่าไม่คุ้มครอง | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| property-06 | valuation | ไม่พบหลัก replacement/depreciation/average clause ในโบรชัวร์ ต้องใช้ wording | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| property-06 | buildingLimit | ไม่แยกทุนอาคารโดยเฉพาะ ใช้ combinedPropertyLimit ร่วมทรัพย์สินภายใน | [หน้า 2 / ความคุ้มครองหลัก ข้อ 1 แผน 1](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| property-06 | contentsLimit | ไม่แยกทุนทรัพย์สินภายในโดยเฉพาะ ใช้ combinedPropertyLimit ร่วมอาคาร | [หน้า 2 / ความคุ้มครองหลัก ข้อ 1 แผน 1](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| property-06 | sharedNaturalPerilsLimit | ไม่มีเพดานรวมภัยแบบเดียวกับ AXA; พายุ/แผ่นดินไหว/ลูกเห็บทุนหลัก น้ำท่วมแยก | [PDF หน้า 2 ข้อ 1–2](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| property-06 | deductible | ตารางไม่ยืนยันส่วนแรกของ configuration นี้; ต้องดูตารางกรมธรรม์/ใบเสนอราคา ไม่ใส่ 0 | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/content/dam/onemarketing/azay/allianz-co-th/document-download/brochures/Basic-Home-Coverage_THA_RV9.9.22.pdf) |
| liability-06 | perOccurrenceLimit | ผลิตภัณฑ์ธุรกิจไม่มีตารางทุนสาธารณะ ต้องเลือกสถานประกอบการและขอ schedule | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html) |
| liability-06 | aggregateLimit | ผลิตภัณฑ์ธุรกิจไม่เผยเพดานรวมรายปี ต้องขอ schedule; ไม่คัดลอกจากวงเงินต่อเหตุ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html) |
| liability-06 | deductible | ตารางไม่ยืนยันส่วนแรกของ configuration นี้; ต้องดูตารางกรมธรรม์/ใบเสนอราคา ไม่ใส่ 0 | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html) |
| liability-06 | territory | พื้นที่/เขตอำนาจศาลขึ้นกับสถานที่และ schedule; ประเทศของเว็บไซต์ไม่ใช่เขตคุ้มครอง | [เงื่อนไขสถานที่และเขตอำนาจศาล](https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html) |
| liability-07 | perOccurrenceLimit | ผลิตภัณฑ์ธุรกิจไม่มีตารางทุนสาธารณะ ต้องเลือกสถานประกอบการและขอ schedule | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.msig-thai.com/th/business-insurance/public-liability) |
| liability-07 | aggregateLimit | ผลิตภัณฑ์ธุรกิจไม่เผยเพดานรวมรายปี ต้องขอ schedule; ไม่คัดลอกจากวงเงินต่อเหตุ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.msig-thai.com/th/business-insurance/public-liability) |
| liability-07 | deductible | ตารางไม่ยืนยันส่วนแรกของ configuration นี้; ต้องดูตารางกรมธรรม์/ใบเสนอราคา ไม่ใส่ 0 | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.msig-thai.com/th/business-insurance/public-liability) |
| liability-07 | territory | พื้นที่/เขตอำนาจศาลขึ้นกับสถานที่และ schedule; ประเทศของเว็บไซต์ไม่ใช่เขตคุ้มครอง | [เงื่อนไขสถานที่และเขตอำนาจศาล](https://www.msig-thai.com/th/business-insurance/public-liability) |
| health-06 | perDiseaseLimit | ไม่พบวงเงินอิสระต่อโรค; ไม่คัด annual/admission limit มาเป็นต่อโรค | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.aia.co.th/th/our-products/health/aia-health-happy) |
| health-06 | deductible | ตารางไม่ยืนยันส่วนแรกของ configuration นี้; ต้องดูตารางกรมธรรม์/ใบเสนอราคา ไม่ใส่ 0 | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.aia.co.th/th/our-products/health/aia-health-happy) |
| health-06 | icuPerDay | จ่ายจริงภายในทุนรวม ไม่ใช่จำนวนเงินต่อวันที่คงที่ และไม่ใช่ไม่จำกัด | [ตาราง / ICU](https://www.aia.co.th/th/our-products/health/aia-health-happy) |
| health-07 | annualLimit | แผนใช้วงเงินต่อการพักรักษาและหมวดเฉพาะ ไม่แปลงเป็นวงเงินรวมรายปี | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | perDiseaseLimit | ไม่พบวงเงินอิสระต่อโรค; ไม่คัด annual/admission limit มาเป็นต่อโรค | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | opdPerYear | OPD เป็นตัวเลือกเสริมยังไม่เลือก; มีตัวเลือกแต่ห้ามเลือกให้ผู้ใช้ | [ตาราง OPD เพิ่มเติม](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | opdPerVisit | OPD เสริมยังไม่เลือก; ไม่ยกค่าสูงสุดของตัวเลือกมาเป็นแผนนี้ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | roomMaxDays | ไม่พบเพดานวันห้องปกติในแถวแผนนี้; ICU15วันไม่ใช่เพดานห้องปกติ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | opdVisitsPerDay | ยังไม่มีตัวเลือก OPD ที่เลือกพร้อม frequency ยืนยัน | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | copay | ไม่พบเงื่อนไขร่วมจ่ายผู้ใหญ่ที่ยืนยันสำหรับแผน1; ไม่ใช้30%ของแผนเด็กอื่น | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | maxEntryAge | ตาราง/เงื่อนไขที่อ่านระบุขั้นต่ำ ไม่ยืนยันเพดานสมัครใหม่; อายุ80ต่ออายุไม่ใช่อายุสมัคร | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| health-07 | renewalAge | กฎตามอายุเริ่มและต่อเนื่อง มีทั้งตลอดชีพ/ถึง80; ไม่สามารถแทนด้วยเลขเดียว | [โบรชัวร์ / ต่ออายุ](https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care.html) |
| life-06 | nonGuaranteedBenefit | ไม่พบรายละเอียดผลประโยชน์ไม่รับประกันของสัญญานี้ในแหล่งที่อ่าน | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkokbank.com/th-TH/Personal/My-Family-and-Me/Bancassurance/BLA/Gain1st-e-Savings) |
| life-07 | maturityFormula | เงื่อนไข underwriting ไม่ใช่ตารางผลประโยชน์ครบสัญญา; ไม่แต่งเงินคืน | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.prudential.co.th/en/products/life) |
| life-07 | guaranteedCashback | ไม่พบสูตรเงินคืนระหว่างสัญญาในเอกสารที่อ่าน; ไม่ใส่0โดยอนุมาน | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.prudential.co.th/en/products/life) |
| life-07 | paymentFrequency | จ่ายเบี้ยเท่าระยะคุ้มครองไม่ยืนยันงวดชำระ; ไม่แปลงโฆษณาต่อวันเป็นรายปี | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.prudential.co.th/en/products/life) |
| accident-06 | publicAccidentBenefit | ตารางไม่ระบุอุบัติเหตุสาธารณะเป็นผลประโยชน์แยก; วันหยุดไม่เท่ากับ public accident | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkokinsurance.com/th/product/accident/holiday) |
| accident-06 | dailyAllowance | ไม่พบจำนวนต่อวัน; เงินก้อนเมื่อครบ14วันไม่ใช่ daily allowance | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkokinsurance.com/th/product/accident/holiday) |
| accident-06 | dailyMaxDays | ไม่มีผลประโยชน์รายวันที่ยืนยัน จึงไม่มีเพดานวันให้กรอก | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkokinsurance.com/th/product/accident/holiday) |
| accident-06 | occupationClass | หน้าเว็บระบุอาชีพยกเว้น แต่ไม่ให้หมายเลขชั้นอาชีพที่รับทั้งหมด | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkokinsurance.com/th/product/accident/holiday) |
| accident-07 | hospitalAdmissionBenefit | ไม่พบผลประโยชน์เงินก้อนจาก admission ในตารางที่อ่านของแผนนี้ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkoklife.com/th/products/detail/286) |
| accident-07 | motorcycleBenefit | ยังไม่มีวงเงินจักรยานยนต์ที่ระบุสำหรับ rider นี้ ไม่ใช้ deathBenefit แทน | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkoklife.com/th/products/detail/286) |
| accident-07 | dailyAllowance | ไม่พบจำนวนต่อวัน; เงินก้อนเมื่อครบ14วันไม่ใช่ daily allowance | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkoklife.com/th/products/detail/286) |
| accident-07 | dailyMaxDays | ไม่มีผลประโยชน์รายวันที่ยืนยัน จึงไม่มีเพดานวันให้กรอก | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkoklife.com/th/products/detail/286) |
| accident-07 | disabilityBenefit | ตารางแยกการสูญเสียอวัยวะ/สายตา ไม่ยืนยันนิยาม PTD ใน field นี้ | [ตารางผลประโยชน์ / เงื่อนไข; ไม่พบแถวที่ยืนยัน](https://www.bangkoklife.com/th/products/detail/286) |
| accident-07 | minEntryAge | รับตั้งแต่แรกเกิด; schema นี้เก็บอายุเต็มปี ไม่แต่งค่า0แทนอายุเป็นวัน | [เงื่อนไขอายุ / แรกเกิด](https://www.bangkoklife.com/th/products/detail/286) |

### Display-field corrections implemented

- Property: combinedPropertyLimit prevents adding the same shared building/contents sum twice; floodLimit keeps Allianz flood separate from its main perils. AXA flood uses its existing shared-natural-cap source and explicit no-double-count condition.
- Motor: voluntaryMedicalPerPerson is separate from compulsory medicalPerPerson; BKI200k and Viriyah50k driver/passenger values are not CMI. CMI declares the voluntary field not applicable.
- PA: hospitalAdmissionBenefit stores BKI20k lump sum after14inpatient days, independently from dailyAllowance.
- Existing fields additionally resolved: MSIG outbound180day maximum and delay causes; AIA room basis/shared365day ICU cap, excluded ordinaryOPD and no independent admission limit; Allianz room basis; both health eligibility conditions; fixed-term life has no fixed ending-age cell; PRU nonparticipating; BLA homicide and defined public-accident uplift. All have per-cell locators.

Current classification after this follow-up (supersedes previous totals):

```json
{
  "health": {
    "plans": 7,
    "known": 72,
    "unknown": 50,
    "not_applicable": 1,
    "not_covered": 3
  },
  "motor": {
    "plans": 7,
    "unknown": 35,
    "known": 37,
    "not_applicable": 11,
    "not_covered": 8
  },
  "life": {
    "plans": 6,
    "known": 56,
    "not_applicable": 7,
    "unknown": 8,
    "not_covered": 1
  },
  "accident": {
    "plans": 7,
    "unknown": 35,
    "known": 47,
    "not_covered": 1,
    "conflicting": 1
  },
  "travel": {
    "plans": 7,
    "unknown": 44,
    "known": 45,
    "not_covered": 1,
    "conflicting": 1
  },
  "property": {
    "plans": 2,
    "unknown": 10,
    "known": 18
  },
  "liability": {
    "plans": 2,
    "unknown": 8,
    "known": 2
  }
}
```

## Final two health integrations — source access resolved

The previous FWD held assessment is superseded by `research-expansion-health-followup.md`. Exact official 46-page FWD500k policy and both ThaiLife brochure pages were obtained and visually checked by the independent research agent. Added health-08 FWD500k and health-09 ThaiLifeHealthFitDD1m, both quote-only because no complete matching payable premium was established. No universal rider-only starting price.

The official FWD policy provides no deductible; ThaiLife explicitly offers selected zero deductible per admission. Those zeros are evidence-backed, not replacements for missing data. FWD age20–60/renew79 comes from the expanded Thai product page, not its policy file. ThaiLife15days minimum stays textual rather than0years. Source edition03/69 is recorded without inventing an effective date.

### Remaining fields in these two records

| Plan | Field | Reason / next evidence | Source |
|---|---|---|---|
| health-08 | perDiseaseLimit | Annual aggregate is verified; no independent per-disease cap established | [Selected-tier source; exact follow-up artifact above](https://www.fwd.co.th/th/health-insurance/easy-e-health/) |
| health-08 | perAdmissionLimit | Annual aggregate is verified; no independent numeric admission cap established | [Selected-tier source; exact follow-up artifact above](https://www.fwd.co.th/th/health-insurance/easy-e-health/) |
| health-08 | opdPerYear | Optional ordinary OPD is unselected | [หน้าเว็บไซต์ / เลือกความคุ้มครองเพิ่มเติม](https://www.fwd.co.th/th/health-insurance/easy-e-health/) |
| health-08 | opdPerVisit | Optional ordinary OPD is unselected; do not confuse post-IPD follow-up | [Selected-tier source; exact follow-up artifact above](https://www.fwd.co.th/th/health-insurance/easy-e-health/) |
| health-08 | icuPerDay | Actual eligible expense within total; no fixed daily monetary amount | [หน้า 23 / ICU](https://www.fwd.co.th/files/v3/assets/blt331c1aa12dcfd37a/blt9c6be205ca1ac70e/67be96c1045f58f038bfaa8c/Easy_E-Health_500_000_THB.pdf) |
| health-08 | opdVisitsPerDay | Unselected ordinary OPD; no selected daily visit count | [Selected-tier source; exact follow-up artifact above](https://www.fwd.co.th/th/health-insurance/easy-e-health/) |
| health-09 | perDiseaseLimit | Annual aggregate is verified; no independent per-disease cap established | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | perAdmissionLimit | Annual aggregate is verified; no independent numeric admission cap established | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | opdPerYear | Optional ordinary OPD is unselected | [หน้า 2 / เพิ่มความคุ้มครอง OPD](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | opdPerVisit | Optional ordinary OPD is unselected; do not confuse post-IPD follow-up | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | waitingDays | Not established in ThaiLife two-page brochure; must obtain exact wording, not another bank package | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | icuPerDay | Actual eligible expense within total; no fixed daily monetary amount | [หน้า 2 / ICU](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | opdVisitsPerDay | Unselected ordinary OPD; no selected daily visit count | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | copay | Not established in ThaiLife brochure; do not infer zero | [Selected-tier source; exact follow-up artifact above](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | minEntryAge | 15-day entry supported; integer-year cell cannot claim newborn0 eligibility | [หน้า 1 / อายุรับประกัน](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |
| health-09 | renewalAge | 98 refers to premium-paying end, not independently established renewal age | [หน้า 1 / ระยะประกันและชำระเบี้ย](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf) |

Final catalog:40 records,538 category cells:297 known,206 unknown,19 not applicable,14 not covered,2 conflicting. `validateCatalog()` returns[] after final additions. TSC/targetedESLint and54tests passed at the38-record checkpoint; final40-record build/test/browser validation belongs to integration owner and is not claimed here. New IDshealth08/09 do not reuse retired draft records. No liveAI call, purchase, form submission or server restart by this agent.
