# Insurance comparison research — V2

ตรวจแหล่งข้อมูล 11 กันยายน 2026. ขอบเขต: ประกันรายบุคคลในไทย 7 หมวดที่มีอยู่ใน demo; ตรวจ catalog ปัจจุบัน 35 records และออกแบบข้อมูลเปรียบเทียบให้ไม่ทำให้เข้าใจผิด. ไม่ใช่คำแนะนำซื้อเฉพาะบุคคล และไม่รับรองการรับประกัน/เคลม. เอกสารนี้ยังไม่แก้ catalog

## 1. วิธีวิจัยและระดับความเชื่อมั่น

ใช้หน้า product, ตารางผลประโยชน์ และเอกสารบริษัทประกันเป็นหลัก; ใช้ คปภ. สำหรับความแตกต่างด้านเงื่อนไข. ไม่ใช้บทความตัวแทนแทนตารางกรมธรรม์. แยก **ข้อเท็จจริงจากแหล่งทางการ** ออกจาก **ข้อเสนอการออกแบบข้อมูล**. หน้าเว็บส่วนใหญ่ไม่ระบุวันที่ออกเอกสาร: บันทึกว่าไม่ระบุ ไม่ใช้ crawl/access date แทน effective date

สูง = ตัวเลข/เงื่อนไขปรากฏชัดในตารางเดียวและ tierเดียว; กลาง = หน้าทางการระบุภาพรวม/ราคาเริ่มต้นแต่ไม่ผูก tier; ต่ำ/รอยืนยัน = แหล่งขัดกัน, ไม่มีราคาตามscenario, ชื่อที่เว็บตั้งเอง, category pageแทนproduct. ทุก record ปัจจุบันต้องทบทวนทั้งหมด ไม่ถือว่ามี official URL แล้ว verifiedทั้งrecord

การค้นครั้งนี้ครอบคลุมแหล่งทางการหลายบริษัทเพื่อออกแบบfield แต่ไม่ได้พิสูจน์ว่าเป็นฐานผลิตภัณฑ์ครบตลาดไทย. ไม่พบข้อมูล ≠ ไม่คุ้มครอง. ข้อมูลที่ขัดกันต้องแสดงว่า “ข้อมูลยังขัดกัน—รอยืนยัน” ไม่เลือกค่าที่น่าขายกว่า

## 2. หลักฐานสำคัญและผลต่อเว็บ

### สุขภาพ

AXA Value แผน1 มีวงเงิน2.5ล้าน/ปี และ500,000/การเข้าพักรักษา; แผน2มี4ล้าน/ปี และ800,000/ครั้ง. จึงต้องเก็บวงเงินสองฐานพร้อมกัน. เบี้ย6,700เป็นราคาเริ่มต้น ไม่ใช่ใบเสนอราคาเฉพาะผู้ใช้. [R01: AXA SmartCare Value](https://www.axa.co.th/th/personal/health-insurance/value-plan)

Essential แสดงวงเงินต่อโรค1/2/5/10ล้านตามแผน1–4. OPDเป็นตัวเลือก มีฐานต่อครั้งหรือรายปี; ระยะรอคอยทั่วไป30วันและบางโรค120วัน. เว็บปัจจุบันเอา10ล้านไปแสดงต่อปี และเอาราคาเริ่มต้นมาวางคู่โดยไม่มีscenarioเดียวกัน. ความเชื่อมั่นสูงเรื่องหน่วย; ความสัมพันธ์ราคา-tierยังรอยืนยัน. [R02: AXA SmartCare Essential](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan)

Health สุขใจ S/M/L แสดง IPD700,000/1ล้าน/5ล้าน **ต่อการเข้าพักรักษา** และ OPD20,000/20,000/30,000ต่อปี. ตัวอย่างชายอายุ35มีเบี้ย25,339.50/27,696.50/34,301.50; ต้องติดlabelscenarioนี้ ไม่แสดงเป็นราคาทุกคน. [R03: เมืองไทย — Health IPD/OPD](https://online.muangthai.co.th/th/Health-IPD-OPD/category/health)

### รถยนต์

พ.ร.บ. AXA แสดงค่ารักษาเบื้องต้น30,000/คน; ค่ารักษาสูงสุด80,000/คนตามเงื่อนไขความรับผิด; เสียชีวิต/ทุพพลภาพถาวรสิ้นเชิง500,000 และค่าชดเชยนอนโรงพยาบาล200/วันไม่เกิน20วัน. **80,000ไม่ใช่ทรัพย์สินบุคคลภายนอก**. พ.ร.บ.ต้องแยกจากภาคสมัครใจ ไม่เรียงเป็นชั้นประกันที่ดีกว่า/แย่กว่าโดยราคาอย่างเดียว. [R04: AXA Compulsory Motor Insurance](https://www.axa.co.th/en/personal/car-insurance/compulsory)

การเทียบชั้นรถต้องแยกความเสียหายรถตนเอง/ชน/ไฟไหม้/สูญหาย/ภัยธรรมชาติ/ทรัพย์สินและร่างกายบุคคลภายนอก. ชั้น2ไม่เท่ากับ2+; ต้องตรวจเงื่อนไขรถชนรถของแต่ละแบบ ไม่ใช้ชื่อย่อแทนกรมธรรม์. [R05a: AXA เปรียบเทียบประกันรถยนต์](https://www.axa.co.th/th/blog/car_car-insurance-compare), [R05b: MSIG Motor 2 Save](https://www.msig-thai.com/th/personal-insurance/motor-2-save)

### ชีวิต

ชื่อ99/20เป็นความคุ้มครองถึงอายุ99และชำระ20ปี ไม่ใช่ระยะ99ปีนับจากซื้อ. อายุขั้นต่ำที่ระบุเป็นวันต้องเก็บวัน ไม่แปลง30วันเป็น0.082ปีสำหรับผู้ใช้. [R06: เมืองไทย Smart Protection99/20](https://www.muangthai.co.th/th/whole-life-insurance/smart-protection-99-20)

Happy Return99/7เป็นwhole lifeพร้อมเงินคืน ไม่ใช่บำนาญเริ่ม55/60/65. หน้าwhole-lifeระบุเงินคืน1%ของทุนตามช่วงที่กำหนดและครบกำหนดที่อายุ99; ไม่แปล1%ทุนเป็นผลตอบแทนต่อเบี้ย. [R07: เมืองไทย — ประกันตลอดชีพ](https://www.muangthai.co.th/th/whole-life-insurance), [R07b: โบรชัวร์ Happy Return99/7](https://www.muangthai.co.th/filestorage/brochures/MTL-Muangthai-Happy-Return99-7.pdf)

Smart Linked Pro10/1 เป็นผลิตภัณฑ์อ้างอิงดัชนี: จ่ายครั้งเดียวคุ้มครอง10ปี. Smart Index15/3จ่าย3ปีคุ้มครอง15ปี. ต้องแยกเงินรับประกันออกจากเงินปันผลที่ขึ้นกับเงื่อนไขดัชนี; ห้ามจัดเป็นunit-linkedโดยอัตโนมัติจากชื่อ“Linked” และห้ามเอาเปอร์เซ็นต์จ่ายทุกสองปีไปเรียกดอกเบี้ยต่อปี. [R08: Smart Linked Pro10/1](https://www.muangthai.co.th/th/savings-insurance/muangthai-smart-linked-pro-10-1-global-index-linked), [R09: Smart Index15/3](https://www.muangthai.co.th/th/savings-insurance/muangthai-smart-index-15-3-global-index-linked)

### อุบัติเหตุ

PA All In One ตารางตัวอย่างชาย35: Sเบี้ย3,855 ค่ารักษ45,000 เสียชีวิตอุบัติเหตุทั่วไป300,000; M5,844/75,000/500,000; L8,570/150,000/1ล้าน. ความคุ้มครองมอเตอร์ไซค์และขนส่งสาธารณะใช้วงเงินคนละชุด. เว็บปัจจุบันผสมราคาSกับค่ารักษาLและค่าเสียชีวิตที่ไม่ตรงtier. แพ็กมีสัญญาหลัก/สัญญาเพิ่มเติม ต้องตรวจอายุและรอบต่ออายุของแต่ละส่วนแยกกัน. [R10: เมืองไทย PA All In One — ตารางแผน](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table), [R10b: รายละเอียดแพ็ก](https://online.muangthai.co.th/th/detail/pa-all-in-one)

PA Go มีตารางผลประโยชน์หลายแผน; categorypageให้ราคาเริ่มต้น ไม่พอจะเติมค่าทุกfield. PAจิ๋วมีช่วงอายุผู้สมัคร ไม่ควรdefault0เมื่อไม่ได้อ่าน. ต้องตรวจแผนที่ใช้กับราคา250ให้ตรง ไม่เอาค่าสูงสุดของfamily. [R11: เมืองไทย — ประกันอุบัติเหตุ](https://online.muangthai.co.th/th/mtlclick/category/accident), [R11b: เมืองไทย — รู้จักประกันอุบัติเหตุ](https://online.muangthai.co.th/th/blog/accident/accident-insurance)

AXA Save Deeหน้าทางการมีข้อขัดกัน: headline/tableแบ่งอายุ1–65และ66–70 แต่ eligibilityบางบรรทัดระบุ1–17. บันทึกเป็นconflictและตรวจbrochureฉบับปัจจุบันก่อนเผยแพร่ช่วงอายุ. ห้ามเลือก70เพียงเพราะอยู่headline. [R12: AXA PA Save Dee](https://www.axa.co.th/th/personal/accident-insurance/affordable-plan)

### เดินทาง

AXA outboundมีsingle/annualและtier Basic/Advance/Maxพร้อมpackageเสริม. annualมีข้อจำกัดจำนวนวัน **ต่อทริป**; อย่าตั้ง180วันทุกแผน. ราคาเริ่มต้นรายเที่ยวกับรายปีเป็นคนละperiodและscenario จึงเปรียบราคาตรงไม่ได้. [R13: AXA Smart Traveller’s Choice](https://www.axa.co.th/th/personal/travel-insurance/outbound)

AXA domesticตารางmedical30,000/50,000/100,000; accidental death300,000/500,000/1ล้าน. เว็บปัจจุบันใช้1ล้านในmedicalจึงผิดประเภทผลประโยชน์. Plan1ไม่มีcancel/baggageบางรายการแต่แผนอื่นมี; max31วันและพื้นที่ยกเว้นต้องอ่านคู่กัน. [R14: AXA Domestic Travel](https://www.axa.co.th/th/personal/travel-insurance/domestic)

Sawasdee inboundสำหรับผู้เดินทางเข้าไทยมีmedical750,000ในตารางและราคาเริ่มต้น999. ตัวเลขตรงไม่แปลว่าสามารถผูก999กับทุกระยะเดินทาง/ทุกplan. คำว่า“ค่ารักษาต่างประเทศ”ไม่เหมาะกับdomesticหรือinboundทุกกลุ่มผู้ใช้. [R15: AXA Sawasdee Thailand](https://www.axa.co.th/th/personal/travel-insurance/inbound)

### บ้าน/ทรัพย์สิน และความรับผิด

Sabuydee My Homeเป็นผลิตภัณฑ์ที่ปรับทุน/ส่วนคุ้มครองได้ ไม่ใช่หลักฐานว่าชื่อ5propertyและ5liabilityที่ตั้งเองเป็น10ผลิตภัณฑ์. ตารางแยกอาคาร(มีaverage clauseเมื่อประกันต่ำกว่ามูลค่า)กับcontentsแบบfirst loss. วงเงินธรรมชาติ20,000เป็นวงเงิน **รวมกลุ่มภัย** ไม่ใช่น้ำท่วมแยก20,000บวกภัยอื่น. Personal liabilityเป็นส่วนของแพ็ก คำนวณตามทุนรวมมีขั้นต่ำ500,000; เบี้ยแพ็กไม่ใช่ราคาstandalone liability. [R16: AXA Sabuydee My Home](https://www.axa.co.th/en/personal/home-insurance/home-plan)

Public liabilityสำหรับธุรกิจอ้าง premises/กิจกรรมและความรับผิดร่างกาย/ทรัพย์สิน; professional indemnityคุ้มครองความผิดพลาดทางวิชาชีพตามเงื่อนไข เป็นคนละriskกับpersonalhome. V2ต้องมีsubtype ไม่ดึงhome riderไปแทนทั้งหมวด. [R17: MSIG Public Liability](https://www.msig-thai.com/th/business-insurance/public-liability), [R18: Chubb Professional Indemnity](https://www.chubb.com/th-th/business/professional-indemnity-insurance.html), [R19: Chubb Technology Liability](https://www.chubb.com/th-th/business/technology-liability-insurance.html)

### เงื่อนไขร่วม

Copaymentกับdeductibleต้องแยก. ข่าว คปภ.ต้นปี2025อธิบายการร่วมจ่ายหลายรูปแบบ และมีการทบทวนในเดือนมีนาคม2025; ไม่ใช้เอกสารเก่าฟันธงว่าทุกกรมธรรม์ในปี2026มีเงื่อนไขเดียวกัน. V2เก็บรุ่นกรมธรรม์/เงื่อนไขการต่ออายุเฉพาะแบบและวันมีผล; หากยืนยันไม่ได้ให้unknown. [R20: คปภ. ชี้แจง Copayment มกราคม2025](https://www.oic.or.th/web-upload/1xff0d34e409a13ef56eea54c52a291126/202501/m_news/217/68901/file_download/6ca15aad268c3263595e306e9f046a52.pdf), [R21: คปภ. ทบทวน Copayment มีนาคม2025](https://www.oic.or.th/web-upload/1xff0d34e409a13ef56eea54c52a291126/202503/m_news/217/68979/file_download/31683a101026aeae94345345910077f5.pdf)

## 3. Comparison field specification — ข้อเสนอ V2

ตารางต่อไปนี้เป็นรายการfieldที่ต้องค้นและแสดงตามจริง ไม่ได้อ้างว่าทุกผลิตภัณฑ์มีทุกความคุ้มครอง. Coreอยู่หน้าCompareโดยdefault; Detailsขยายอ่านได้โดยยังเห็นข้อยกเว้นสำคัญ. Fieldที่ไม่มีข้อมูลแสดงunknownพร้อมเหตุผล ห้ามสร้างค่าdefault0

| หมวด | Core — ต้องมองเห็นเพื่อเทียบ | Details — ต้องเก็บ/อ่านต่อได้ | ฐานที่ต้องตรง/ข้อห้าม |
|---|---|---|---|
| health | IPDต่อปี/ต่อโรค/ต่อadmissionแยกแถว, room/ICUต่อวัน+maxdays, OPDต่อครั้ง+maxvisits+ต่อปี, deductible, copay, waitทั่วไป/โรคเฉพาะ, entry/renewal age | surgery/daycase/cancer/dialysis; cashlessnetwork; geographicarea; preexisting; medicalquestions; rider/basepremium; renewalterms | ต่างbasisห้ามแปลงปีจากต่อโรค; OPDoptionalไม่เท่ารวม; roomactualcostไม่เท่าcashallowance |
| motor | voluntary/compulsory+class; ownvehicle sum; collision/theft/fire/flood; thirdpartyBIต่อคน/ครั้ง; thirdpartyPDต่อครั้ง; deductible/excess; dealer/garage | driverprofile/use/vehicleyear; EVbattery/charger/chargingliability; PAmedical/bail; exclusions; sumvaluation; repairconditions | พ.ร.บ.แยก subgroup; quoteรถ/ผู้ขับ/ทุน/repairเดียวกัน; ชั้น2+ไม่เท่าชั้น2; ไม่ให้0บาทเป็นราคาฟรี |
| life | subtype; deathbenefitสูตร+ปี; maturity/guaranteedcashback; nonguaranteedbenefitแยก; coverageถึงอายุหรือจำนวนปี; payduration/frequency; sumassured | entryageวัน/ปี; surrender/paidup/loan; riders; healthunderwriting; exclusion/waitถ้ามี; dividendconditions; currency | wholelife/endowment/pension/indexlinkedแยกpurpose; ทุนไม่ใช่เบี้ยสะสม; เปอร์เซ็นต์ทุนไม่ใช่yield; ไม่คำนวณIRRโดยไม่มีcashflowsครบ |
| accident | accidental death/dismemberment/PTD; motorcycle/homicide/publictransportแยก; medicalต่ออุบัติเหตุ; dailyallowance/daylimit; age; occupationclass | activity/sportexclusions; geography; healthcarecashless; bundlebase/rider; illnesswaitingเฉพาะส่วนที่มี; renewal | accidental deathไม่เท่าalldeath; ส่วนbundlelifeไม่เท่าPAannualเดี่ยว; medicalไม่ใช่deathlimit |
| travel | direction+territory; single/annual; policyduration+days/trip; medicalillness/injury; evacuation/repatriation; cancellation/interruption; baggage; delaytrigger/hours+limit | preexisting; sport/manualwork; excludedcountries; tripstart/residency/age; deductible; valuables/itemlimits; personal liability; visaconditions | ต้องรู้วัน/ประเทศ/อายุ/periodก่อนเทียบราคา; Schengenเป็นrequirement/filterเว้นแต่มีproductจริง; ห้ามเหมารายปีว่าไม่จำกัดวัน |
| property | building/contentsแยก; valuation; sum; fire; naturalperilsแต่ละภัย+sharedcap; burglary; deductible; occupancy/owner/tenant | averageclause; firstloss; unoccupieddays; construction/location; temporaryhousing; electrical/glass; exclusions; bundledliability | startingpremiumไม่คู่maxsum; sharedcapห้ามบวกซ้ำ; tenantไม่มีอาคารไม่เท่าข้อมูลหาย; homeไม่เท่าcommercialproperty |
| liability | personal/public/professional/product subtype; activity; BI/PD/financialloss; occurrence/claimlimit; aggregate+period; deductible; territory/jurisdiction; defensecost | occurrence/claimsmade; retrodate/reportingตามกรมธรรม์; defenseinside/outside; sublimits; exclusions; underlyingbundle; turnover/occupationquote | homeembeddedไม่เท่าPIduty; ไม่จัดซื้อเดี่ยวถ้าเป็นrider; unknownaggregateไม่เท่าunlimited; claimsbasisต้องมีsourceก่อนแสดง |

Shared metadata: insurer/product/tier/edition; officialmarketingnameและpolicynameถ้าต่าง; sourceURL+locator+checkedAt; pricekind(fixed/example/starting/quote-only); paymentperiod; age/sex/occupation/vehicle/trip/sumscenarioเท่าที่ใช้; inclusionofstamp/taxและbase/rider; eligibility/exclusions; salechannel/statusถ้ายืนยันได้

## 4. ความเหมือน / ความต่าง / เทียบไม่ได้

1. Same: ค่า + unit + basis + included/optional + conditions + scenario ที่มีผลเท่ากันและverifiedทั้งคู่. ข้อความ“ตามเงื่อนไขบริษัท”เหมือนกันไม่พอ
2. Different: semanticfieldเดียวกันและbasisเดียวกัน แต่verifiedvaluesหรือเงื่อนไขต่าง. บอกว่าต่างตรงไหน ไม่ประกาศแผนชนะอัตโนมัติ
3. Not comparable: คนละbenefitbasis, period, quoteprofile, subtypeที่ต่างหน้าที่. แสดงคู่กันเพื่ออ่านได้ตามเหมาะสม แต่ไม่rankเลข; incompatibleproductgroupsให้กลับเลือก
4. Insufficient: อย่างน้อยหนึ่งค่าunknown/conflicting. Differences-onlyยังต้องมีส่วน“ข้อมูลไม่พอเทียบ” ห้ามซ่อนnull/nullว่าเหมือน
5. Not covered ≠ unknown ≠ optional ≠ not applicable. 0ใช้ได้เฉพาะsourceยืนยันnumericzero เช่น deductible0; nullไม่ใช่unlimited

ราคาเริ่มต้นใช้ค้นพบผลิตภัณฑ์ได้ แต่ไม่กล่าว“อยู่ในงบคุณแน่นอน”. Quote-onlyไม่อยู่กลุ่มถูกที่สุด และไม่ถูกกรองทิ้งด้วยการแทน0. Single/annualtravelและlifesinglepremiumไม่ใช้periodyearเหมารวม. Customer policyใช้เบี้ยตัวอย่างpolicyของตัวเอง ติดlabeldemo ไม่ยืมราคาเริ่มต้นcatalog

## 5. Disposition ของ 35 records — ยังไม่ใช่ replacement catalog

KEEP-VERIFY = มีตัวตนผลิตภัณฑ์ แต่ยังต้องmapทุกfieldกับtier/ราคา; REPAIR = พบข้อผิดชัด; QUARANTINE = งดแสดงเป็นแผนverified/selectableจนหลักฐานพอ. ทุกสถานะเป็นงานที่จะทำเมื่ออนุมัติ V2

| ID | ข้อเสนอ | งานที่ต้องทำ / source |
|---|---|---|
| health-01 | REPAIR | Valueแผน1: annual2.5m+admission500k; รักษา6700เป็นstartingไม่fixed; เติมwaiting/eligibility R01 |
| health-02 | REPAIR | แยกEssentialtier; เอา10mออกจากannual; price-tierยังไม่verified R02 |
| health-03 | REPAIR | S: IPDperadmission700k; ราคาscenarioชาย35; แยกbase/rider R03 |
| health-04 | REPAIR | M: IPDperadmission1m; scenarioตรงR03 |
| health-05 | REPAIR | L: IPDperadmission5m; scenarioตรงR03 |
| motor-01 | KEEP-VERIFY | quote-only; class1tableและrepairตามquote ไม่defaultdeductible0 R05 |
| motor-02 | KEEP-VERIFY | ยืนยันEV/PHEVvariantทางการ; battery/charger/driverconditions; quote-only |
| motor-03 | KEEP-VERIFY | class2+policytable; collisionconditions/ownsum; ตรวจ5800ในcatalogกับราคาเริ่มต้นต้นทาง ไม่ถือfixedquote |
| motor-04 | KEEP-VERIFY | class3+policytable; ตรวจ5400เป็นstartingตามsource; distinguishtheft/fireabsenceจากunknown |
| motor-05 | REPAIR | compulsorysubtype; medical80000ไม่ใช่PD; coverageตามfault/benefit R04 |
| life-01 | REPAIR | untilAge99/pay20; ageวัน; deathformula R06 |
| life-02 | REPAIR | wholelifeuntilAge99/pay7; ลบpensionclaim; guaranteeแยกR07 |
| life-03 | REPAIR | indexlinked10/1singlepremium; returnconditionsและguaranteedแยกR08 |
| life-04 | REPAIR | indexlinked15/3; cashflowsไม่ใช่annualyield R09 |
| life-05 | QUARANTINE | ชื่อcategory“เมืองไทยประกันชีวิต แบบตลอดชีพ”ไม่ใช่แบบเฉพาะ; หาproductจริงหรือยุบ R07 |
| accident-01 | REPAIR | mapแผน1กับ250/อายุ/benefits; ห้ามอายุ0fallback R11 |
| accident-02 | KEEP-VERIFY | PA Goแผน1/2199กับตารางเดียวกัน; เติมmedical/deathจริง R11 |
| accident-03 | KEEP-VERIFY | PA CashBack: ตรวจbrochure/policytier; เงินคืนกับPAผลประโยชน์แยก |
| accident-04 | REPAIR | AllInOne tierS3855/medical45000/death300000ตามscenario; ไม่ผสมL R10 |
| accident-05 | QUARANTINE | SaveDee ageconflict; ต้องแก้ด้วยเอกสารปัจจุบัน R12 |
| travel-01 | KEEP-VERIFY | outboundsingle tier/package+days/age/region; ราคา135ไม่คู่maxbenefits R13 |
| travel-02 | REPAIR | annualperiodyear; pertripdaysตามtier; ราคา1564scenario R13 |
| travel-03 | REPAIR | domesticmedical30k/50k/100kตามtier; ไม่1m; labelmedicalไม่abroad R14 |
| travel-04 | KEEP-VERIFY | inbound750k;999starting; delaybenefitต่างtier R15 |
| travel-05 | QUARANTINE | Schengenอาจเป็นusecaseของoutbound ไม่ใช่productเพิ่ม; ยืนยันpolicy/tierจริง R13 |
| property-01 | REPAIR | canonicalSabuydee; quote/sum/firstloss/average/sharedcap R16 |
| property-02 | QUARANTINE | ownerlabelไม่พิสูจน์variant; รวมcanonicalถ้าไม่มีเอกสารvariant R16 |
| property-03 | QUARANTINE | tenantusecaseไม่ใช่productใหม่โดยอัตโนมัติ R16 |
| property-04 | QUARANTINE | buildingcoverเป็นcomponent ไม่แต่งstandaloneproduct R16 |
| property-05 | QUARANTINE | contentscomponent; optional/sumformulaตามpolicy R16 |
| liability-01 | REPAIR | ระบุembeddedhomecoverและparentproduct; ไม่ใช้เบี้ย1176เป็นstandalone R16 |
| liability-02 | QUARANTINE | ไม่พบหลักฐานvariantdistinct; รวมกับcanonical R16 |
| liability-03 | QUARANTINE | tenantliabilitynamedproductต้องมีหลักฐานก่อนselectable R16 |
| liability-04 | QUARANTINE | ownerliabilitynamedproductต้องมีหลักฐาน R16 |
| liability-05 | QUARANTINE | fireliabilitycomponentไม่ใช่productใหม่ R16 |

ก่อนpublish V2ต้องตรวจทุกcellของrecordsที่คงไว้กับต้นทางและlogunknownที่เหลือ. ไม่บังคับ5recordsต่อหมวดหากต้องสร้างข้อมูลเทียม; หมวดที่ไม่มี2แผนจริงในsubgroupให้แสดงข้อมูลและemptycompareอย่างซื่อสัตย์. หากต้องเติมproductใหม่ใช้R17/R18เป็นcandidate sources ไม่คัดลอกชื่อมาเป็นพร้อมขายทันที

## 6. Source register / recency / outstanding

R01–R19เป็นเว็บไซต์บริษัทประกันโดยตรง, titles/publishersตามลิงก์ใน§2, วันที่เผยแพร่ส่วนใหญ่ไม่ระบุ. เข้าถึง/ค้นพบและตรวจ11Sep2026. R07bเป็นbrochureทางการ, วันที่effectiveยังไม่ยืนยัน; ไม่ใช้pdfเก่าทับcurrentproductpageโดยอัตโนมัติ. R20มกราคม2025, R21มีนาคม2025เป็นเอกสาร คปภ.เพื่อcontextเท่านั้น. ราคา/เงื่อนไขต้องตรวจซ้ำก่อนใช้ภายนอกdemoหรือเปลี่ยนedition

รายการที่ยังต้องresearchระหว่างV2data phase: exactmotorquote/tierและEVwording; PA CashBackpolicytableที่อ่านได้; SaveDeeconflictresolution; livecurrenteligibility/renewalcopayทุกhealthplan; liabilityclaims/defensewordingจริง; propertyquoteที่ผูกpremiumกับsum; Schengenproductidentity. ไม่มีการกรอกquotationด้วยข้อมูลลูกค้าจริงในการaudit

ข้อจำกัด: ไม่ได้ซื้อใบเสนอราคา/กรมธรรม์จริง, บางsourceเป็นmarketingtableไม่ใช่wordingเต็ม, published/effective datesหลายรายการขาด. ความเชื่อมั่นสูงเฉพาะข้อผิดที่ชี้ด้วยตารางและหน่วยตรง; ความครบทุกเงื่อนไขของทุกproductยังไม่ผ่าน. V2ต้องให้sourceconflict/unknownเห็นได้ทั้งUI/API/AIแทนการแต่งข้อมูล

## Implementation verification — 12 September 2026

Latest independent source recheck during implementation: [R10 PA table](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table) confirms S male35 premium3855, medical45000, non-motorcycle death/permanent disability300000; motorcycle150000. Catalog accident04 now uses that single tier.

[R16 Thai Home](https://www.axa.co.th/th/personal/home-insurance/home-plan) states1176; [English Home](https://www.axa.co.th/en/personal/home-insurance/home-plan) lists1100house/1200condo. Without a matched scenario, property01 price is unknown with conflict note. Selected building/contents sums are unknown; natural-peril20000 is shared across the stated group. Property02–05 and liability01–05 were unsupported derivatives of this one configurable product and removed without ID remapping. Liability now has an explicit empty state. This does not mean the liability insurance market has no real products.

Implementation also separates age99 life coverage from a99-year term and compulsory/voluntary motor plus travel directions. Complete field-level provenance and all remaining product facts are still pending; source-linked records are not automatically fully verified.

## Canonical catalog recheck — 2026-09-12

Implemented 25 stable catalog records with canonical Price, CoverageCell, SourceEvidence; legacy values derive from those cells. Removed life-05 because it was a category rather than a purchasable product; did not remap its ID. Existing seed policies reference retained identities. Every published known cell has a source ID, locator and basis. This is field provenance, not a claim to have reviewed every policy wording or obtained personal quotations.

- [AXA Value](https://www.axa.co.th/th/personal/health-insurance/value-plan) and [Essential](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan): Value tier1 caps have distinct annual/admission bases; Essential tier4 room12000/day and optional OPD50000/year. Newly populated waiting30 is verified in Value FAQ / Essential underwriting3–4; specific illnesses120days and accident exception remain visible. Starting premiums are explicitly family examples, not a confirmed price for these chosen tiers/options.
- [AXA EV](https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev): deductible0 is now evidence-backed by the explicit no-excess table, not an unknown filled with zero. Vehicle-dependent third-party property limit remains unknown with alternatives. Other voluntary deductibles are selectable and remain unknown. [CMI table](https://www.axa.co.th/en/personal/car-insurance/compulsory): medical80000/person is separate from car repair and bodily-fault conditions are retained; headline645.21 and discounted581.01 require explicit scenario disclosure.
- [Domestic travel](https://www.axa.co.th/th/personal/travel-insurance/domestic): retained tier3 medical100000 is domestic accident medical, cancellation20000 and baggage20000 aggregate with item conditions. Family starting46 is not assigned to tier3. [Outbound](https://www.axa.co.th/th/personal/travel-insurance/outbound): maximum family medical is not a selected tier; optional baggage item cap is not an aggregate. Travel05 remains the Schengen scenario of the same productId, not a invented separate product.
- [PA small](https://online.muangthai.co.th/th/detail/pa-small-size/plan-table), [PA Go](https://online.muangthai.co.th/th/detail/pa-go/plan-table), [PA Cashback](https://online.muangthai.co.th/th/detail/pa-cashback/plan-table), [PA All In One](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table): numbers follow a single named tier with male35 example price and motorcycle sublimits in conditions. Small tier1 medical is explicitly not covered. [SaveDee](https://www.axa.co.th/th/personal/accident-insurance/affordable-plan): maximum entry age remains conflicting because table and conditions disagree; did not choose one silently.
- Life01 official SmartProtection99/20 brochure page2, edition21July2025: female35, sum1000000, premium22170/year; minimum30days, maximum70years, cover to99 and pay20. [HappyReturn99/7 online](https://online.muangthai.co.th/th/detail/99-7) uses channel age21–70. [LinkedPro10/1](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-linked-pro-10-1-global//) is single premium10year term. [Index15/3](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-index-15-3-global-index-linked) starting19940 relates to sum20000; no guessed customer age/sex. Some Thai product pages exceeded reader size, so official PDF or indexed official English text was used; English wording is subordinate to Thai policy wording.
- [Home Thai](https://www.axa.co.th/th/personal/home-insurance/home-plan) versus [English](https://www.axa.co.th/en/personal/home-insurance/home-plan): price conflict1176 versus house1100/condo1200 remains quote-only and visible. Shared natural peril20000 is not a separate flood cap; building/contents are chosen sums. Newly verified deductible0 is supported by the no-deductible feature/FAQ. Embedded liability is not a set of standalone products.

Remaining unknowns are explicit: personalized motor/home sums and premiums; unselected travel tiers/optional packages; some PA entry ages; general health deductibles; complete exclusions and underwriting. Published/effective dates remain null where no date was stated. Catalog fields do not assert suitability, approval or claims outcomes. Further products/tiers require their own source verification, not extrapolation.

Validation: npm test 38/38 passed after rewrite; npx tsc --noEmit passed. No browser test, rebuild or server restart by this data agent. Comparator regression covers known/excluded as different, unknown as insufficient, incompatible basis/inclusion as not_comparable, and not_applicable separately.

### Independent findings corrected — 2026-09-12

- Annual travel02 now unknown maxTripDays with explicit90/180 per selected tier; single trip180 retained. [AXA outbound FAQ](https://www.axa.co.th/th/personal/travel-insurance/outbound) explicitly differentiates annual limits.
- Shared premium row now marks differing scenario/kind/includes or unselected starting profiles not_comparable. It does not turn unmatched profiles into a numerical price advantage. Unknown amounts remain insufficient. Exact-text scenario equality is deliberately conservative; tier descriptions differing in the scenario also prevent comparison.
- CMI canonical price is now quote_only/null. [Product table](https://www.axa.co.th/th/personal/car-insurance/compulsory) advertises581.01 while headline says645.21. Following its [promotion link](https://www.axa.co.th/th/promotion/axacar-promotion) reveals conditions1–4 and an end date15January2026. Consequently the September2026 demo cannot assume the online discount is active or the headline is the personalized payable amount. Both numbers and the expired promotion are disclosed; the record remains in unfiltered discovery but is excluded from numeric-budget matches, exactly like other unknown prices. This supersedes the prior645.21 numeric starting entry.

Targeted domain/discovery/compare tests18/18 pass and TypeScript passes. Full suite also encountered a newly added independent state test expecting travel01/05 identity rejection; reported to root, not counted as passed by this agent.

## Core-field completion addendum — 2026-09-12

Gap mapping before this change: health had7fields and omitted ICU/daycaps, OPD visit limits, copay, entry/renewal and eligibility; life6 omitted product purpose, benefit formulas and non-guaranteed separation; PA5 omitted dedicated motorcycle/homicide/public-event and daily benefit fields; property5 omitted use/valuation and embedded liability; motor6 omitted individual risks and excess bodily-liability; travel6 omitted evacuation/remains return/interruption/delay and selected policy duration. This change uses the existing CoverageCell shape; no new product, route or insurance calculator.

Implemented fixed core rows now flow automatically into detail/Compare/API/AI. Missing selected tier or unverified clauses stay unknown; unknown is not a zero, exclusion or promised coverage. Copay remains unknown for every health record rather than inferring it from deductible. MTL health99year marketing coverage is not silently treated as a guarantee to renew its riders to99; renewalAge remains unknown with that reason. Property burglary remains unknown because absence from the short table is insufficient exclusion evidence.

### Source decisions and benefit bases

- [AXA Value](https://www.axa.co.th/th/personal/health-insurance/value-plan) tier1 ICU5000/day, entry13–60years and stated renewal99; [Essential](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan) tier4 ICU24000/day, entry15days–65years and renewal99. Essential OPD3000/visit with1/day and30/year is optional and alternative to the optional50000/year. No cross-product copay policy inferred.
- MTL [S](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-s), [M](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-m), [L](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-l): ICU60days and combined room180days, OPD2visits/day, entry20–70years and Thai online eligibility. Room-as-actual-cost is not an invented numeric daily allowance.90day readmission and30/120/180 waiting conditions remain attached.
- Life99/20 uses existing official brochure page2, note3: death max(initialsum100%, surrender value, paid premiums), maturity initialsum100%; it is not the99/7 formula. [99/7 table](https://online.muangthai.co.th/th/detail/99-7/plan-table) notes1–3 distinguish initialsum from paidpremium101%; cashback1%initialsum through age98. [10/1 official wording page1](https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf) explicitly gives death105%initialsum-or-surrender, cashback1%initialsum in years1–9 and maturity101%initialsum; dividend remains conditional. [15/3 table](https://online.muangthai.co.th/th/detail/global-index-15-3/plan-table) gives death100/200/300%initialsum by year, compared with surrender and101%paidpremiums, maturity310%initialsum-or101%paidpremiums, and cashback3%initialsum in even years2–14. No IRR/yield calculated. Unknown non-guaranteed fields on traditional life products are not marked excluded without wording evidence.
- PA public-event limits for retained tiers are [Small](https://online.muangthai.co.th/th/detail/pa-small-size/plan-table)200k, [Go](https://online.muangthai.co.th/th/detail/pa-go/plan-table)500k, [Cashback](https://online.muangthai.co.th/th/detail/pa-cashback/plan-table)800k, [AllInOne](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table)600k. These are scenario limits, not additive to ordinary death. AllInOneS daily500/max365days and special1000/max45days are alternatives; HIP rider and90day aggregation conditions are attached. Other absent daily amounts remain unknown, not not-covered.
- [Home](https://www.axa.co.th/th/personal/home-insurance/home-plan): embedded liability10%totalsum withminimum500k; no chosen sum means no personalized fixed cap. Residential owner/tenant/long-term rental, no daily/weekly rentals, concrete/steel and>80%wall requirement, new replacement valuation and contentsFirstLoss are visible. Geographic restriction uses source clause5 and discloses source spelling ambiguity for one district.
- Motor/travel integration uses independently checked exact URLs/locators in [motor-travel-core-evidence.md](output/motor-travel-core-evidence.md). BI limits are excess above compulsory, not totals. Motor2+/3+ naturalperils optional100k is a package note with selected limitunknown. Domestic Plan3 evacuation1m,remains1m,interruption20k,delay1000per4h capped10k; unselected policy days remainunknown. Outbound unselected tiers keep amountsunknown and optionalTripProtection explicit; inbound no invented coverage from absent rows. Annual policy1year stays separate from90/180days-per-trip.

Remaining limitations: all listed core concepts have a dedicated row or explicit condition for retained products; full policy exclusions, personalized quotes, unknown copay/renewal riders, actual current editions and exact unverified delay causes are not claimed complete. Liability has no verified standalone record and remains empty; embedded home liability is not repackaged into that category. Updated tests cover these distinctions; passing schema tests are not substitutes for insurer evidence.

Validation after core integration: npm test52/52, npx tsc --noEmit pass, scoped eslint0errors. No production restart/build/browser test in this data task; root will verify rendered rows after build.

### Final known-cell reconciliation

Independent V48 ledger: output/known-cell-ledger.md,173KNOWNcells matched explicit primary evidence (94fresh/mixed,79inherited). Two additional health conditions from official underwritingข้อ6 were missing and are now stored with their limit cells: [AXA Value](https://www.axa.co.th/th/personal/health-insurance/value-plan) groups same illness/injury including DaySurgery within90days after last discharge into one admission; [AXA Essential](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan) groups same disease/complications within90days. Do not present500k/admission or10m/disease as resetting on every hospital visit. Amounts unchanged. Regression test added;53tests pass. This is source reconciliation for this demo catalog, not a current quote or full-policy certification.


## UX refresh / expanded source investigation — 12 September 2026

This addendum supersedes the historical catalog counts above for the new user request. The implementation ledger and exact primary-source locators are in [nonlife expansion](research-expansion-nonlife.md), [life/health expansion](research-expansion-life-health.md), and [Home education/campaigns](research-home-content.md). The catalog currently expands the former25 grounded identities with additional insurers; the final cell counts belong to the nonlife ledger, not the historical35draft records at the start of this document.

### Display decisions from the research

| Category | Primary comparison dimensions | Conditions that must remain visible |
|---|---|---|
| Health | Annual/per-disease/per-admission caps; room/ICU per day and day caps; IPD/OPD; deductible/copay; entry/renewal; waiting | A shared365day room/ICU cap is not365days each. Rider price excludes required main policy unless stated. Deductible options are not a chosen deductible. Current underwriting and dated brochures are distinct. |
| Motor | Compulsory vs voluntary group; class; chosen vehicle sum; collision/theft/fire/flood; third-party per-person/per-event/property; separate voluntary medical benefit | Do not put voluntary personal-accident medical benefits in the compulsory-medical field. Quote depends on vehicle/year/use and selected repair; no numeric0 from a blank configurator. |
| Life | Contract type; sum assured; death/maturity/cashback formulas; premium/payment years; coverage duration vs age; guaranteed vs nonguaranteed | Percentage of sum assured is not return on premiums. Do not compare different sex/age/scenarios as personalized quotes. |
| Accident | Death/disability; treatment per accident; motorcycle/homicide; transport/public accident; daily allowance vs hospital-admission lump sum; occupation/age | Lump sum for a qualifying admission is not a daily payment. Holiday multipliers apply only to specified dates/events. |
| Travel | Domestic/inbound/outbound group; age/trip-duration; medical/evacuation/repatriation; cancellation/interruption/delay trigger, hours/payment/cap; baggage | Single-trip/annual price periods stay explicit; uncertain evacuation marketing/table discrepancy cannot become a verified maximum. |
| Property | Combined building+contents sum vs individual limits; valuation; perils/shared caps; flood; burglary/electrical; occupancy/territory; bundled liability | A500000combined sum cannot appear as500000building plus500000contents. Flood20k may be separate from an electrical50k fire-only extension. |
| Liability | Business activity; per-event and annual limits; deductible; territory/jurisdiction | Existing grounded additions are business public-liability quote products, not general personal liability. Public pages do not publish customer-specific sums. |

Browse shows insurer, actual product identity, brief sourced benefit, exact price kind/scenario, then details. Compare groups product choices by insurer and uses these shared canonical fields for UI/API/AI. Promotions are date-filtered separate content and are never automatically deducted from catalog prices. Default unknowns remain unknown; a source-linked eligibility description is displayed only when dedicated evidence exists.

### Limits to the requested whole-market completeness

This pass cannot establish that every insurer, promotion and policy detail has been collected. OIC's official [life registry](https://oiceservice.oic.or.th/company/life.php) and [nonlife registry](https://oiceservice.oic.or.th/company/non_life.php) were opened independently by root and researcher. Their returned selectors lacked actual company entries; HTML inspection yielded placeholder/region options only, so there is no verified current market denominator. No company count was invented. Source histories and partial/unreadable products are itemized in the three linked reports.

Source-backed unknowns include unselected tier/customer scenarios, quote-only business limits, missing contract terms and genuinely conflicting publisher values. They cannot be converted into zero or a universal benefit. The new website exposes verified additions now; this evidence does not mean every unknown in the market has been resolved.

Final release data:40records/12insurers. FWD and ThaiLife access resolved in [follow-up](research-expansion-health-followup.md). Latest counts and boundaries: [verification](output/refresh-verification.md).
