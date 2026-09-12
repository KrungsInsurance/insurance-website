# Catalog expansion — checked 2026-09-12

## Delivered inventory

82 catalog entries, 78 distinct productIds, 18 insurer labels, 13 categories. This adds 42 distinct products to the previous 40 entries; the existing four additional entries represent retained product variants. No new tiers, ages or sales channels were counted as separate products. All added products use Thai insurer sources and are enquiries for Thailand; no foreign-market products were added.

| Category | Entries |
| --- | ---: |
| health | 9 |
| motor | 7 |
| life | 6 |
| accident | 7 |
| travel | 7 |
| property | 12 |
| liability | 2 |
| pet | 3 |
| critical-illness | 8 |
| cyber | 3 |
| business | 14 |
| event | 1 |
| sports | 3 |

## What the evidence supports

The 42 new entries are product overviews. Prices remain quote_only with null amounts, and unpublished selected-plan limits remain unknown, not zero. Advertised maxima and starting prices are not mapped onto an unselected customer's cover. Known descriptive scope has a field-level official source; inclusion remains unknown until the specific tier and terms are selected. Every source records the check date above, with publication/effective dates null when unavailable. This is a verification date, not a claimed policy edition or guarantee of acceptance.

[MTI Pet Chill](https://www.muangthaiinsurance.com/th/product/miscellaneous-insurance/pet-chill-insurance) has materially different tiers: plan 1 excludes illness and vaccines appear only in plans 4–6. The product entry preserves those restrictions and does not combine a low entry price with higher-tier benefits. [Falcon Paw Sure](https://falconinsurance.co.th/miscellaneous/paw-sure) and [Pet Protect Sure](https://falconinsurance.co.th/miscellaneous/pet-protect-sure) are separately named products; their illness waiting periods are retained without implying immediate cover.

The [Bangkok Insurance residential listing](https://www.bangkokinsurance.com/product/residential) explicitly advertises the residential fire product at 599 baht/year. That fact appears in its note, while the selectable catalog entry remains an unselected product requiring confirmation of eligibility and quotation. Other displayed product-level ranges/maxima were deliberately not converted into personal premiums or limits.

The [current Bangkok Insurance business listing](https://www.bangkokinsurance.com/th/product/business) supports an Event Cancellation product for organisers. Wedding acceptance and covered cancellation causes require enquiry, so weddingEligibility stays unknown. A wedding keyword can find this current event product with that limitation. Historical wedding insurance references in the [2014 annual filing](https://www.bangkokinsurance.com/uploaded/documentdownload/2/56-1-2557.pdf) do not establish a current standalone wedding product; none was added or described as covering a change of mind. The event category therefore contains one verified current product.

## Selection and comparison contracts

Plan.comparisonGroup is an optional string retained in saved snapshots. Broad business products use purpose-specific groups such as business:construction, business:cargo and business:sme; cancer-only and multiple-disease products also remain separate. Manual comparison rejects mixed groups, and discovery selects at most three compatible products. When a purpose has only one verified product, the system returns one instead of filling the comparison with unrelated products. Motor compulsory/voluntary and travel inbound/outbound/domestic guards remain intact.

All 13 categories have relevant Browse refinement fields. Details such as animal age, event date, venue and business activity are quote context, never automatic acceptance checks. Only sourced product classifications narrow the catalog. Budget remains optional and product enquiries remain visible in Browse. No medical fields are attached to the wedding/event flow.

New records use the existing local neutral illustration and are explicitly labelled as illustrations. Their source link describes product information from the insurer; it does not claim the illustration is company artwork.

## Official source inventory: 42 newly added products

A shared listing source includes an exact product-heading locator in lib/catalog-expansion.ts. Existing catalog sources and identities are preserved.

| ID | Product / official source | Insurer label | Comparison purpose |
| --- | --- | --- | --- |
| pet-01 | [เมืองไทย Pet Chill](https://www.muangthaiinsurance.com/th/product/miscellaneous-insurance/pet-chill-insurance) | เมืองไทยประกันภัย | pet |
| pet-02 | [Falcon Paw Sure](https://falconinsurance.co.th/miscellaneous/paw-sure) | ฟอลคอนประกันภัย | pet |
| pet-03 | [Falcon Pet Protect Sure](https://falconinsurance.co.th/miscellaneous/pet-protect-sure) | ฟอลคอนประกันภัย | pet |
| critical-illness-01 | [AXA SmartCare Cancer](https://www.axa.co.th/th/personal/health-insurance/cancer) | AXA ประกันภัย | cancer |
| critical-illness-02 | [MSIG Cancer Fix](https://www.msig-thai.com/th/personal-insurance/cancer-fix) | MSIG ประกันภัย | cancer |
| critical-illness-03 | [กรุงเทพประกันภัย โรคมะเร็ง](https://www.bangkokinsurance.com/th/product/health/cancer/faq-cancer) | กรุงเทพประกันภัย | cancer |
| critical-illness-04 | [รู้ใจ ประกันมะเร็ง](https://www.roojai.com/cancer/) | รู้ใจประกันภัย | cancer |
| critical-illness-05 | [รู้ใจ ประกันโรคร้ายแรง](https://www.roojai.com/critical-illness/) | รู้ใจประกันภัย | multi-disease |
| critical-illness-06 | [FWD Big 3](https://www.fwd.co.th/th/critical-illness-insurance/big-3/) | เอฟดับบลิวดี ประกันชีวิต | multi-disease |
| critical-illness-07 | [AIA CI Care UDR](https://www.aia.co.th/th/our-products/health/aia-ci-care-udr) | เอไอเอ | multi-disease |
| critical-illness-08 | [เมืองไทย D Care โรคร้าย เจอ จ่าย](https://online.muangthai.co.th/th/mtlclick/detail/dcare) | เมืองไทยประกันชีวิต | multi-disease |
| cyber-01 | [คุ้มภัยโตเกียวมารีน TM Cyber 365](https://www.tokiomarine.com/th/en/non-life/products/commercial/special-product/cyber-insurance.html) | คุ้มภัยโตเกียวมารีนประกันภัย | cyber |
| cyber-02 | [Chubb Cyber Enterprise Risk Management](https://www.chubb.com/th-th/business/cyber-insurance.html) | ชับบ์สามัคคีประกันภัย | cyber |
| cyber-03 | [AIG CyberEdge](https://www.aig.co.th/en/home/risk-solutions/business/financial-lines/cyber) | เอไอจี ประกันภัย | cyber |
| event-01 | [กรุงเทพประกันภัย สำหรับผู้จัดงาน (Event Cancellation)](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | cancellation |
| sports-01 | [MSIG ประกันภัยผู้เล่นกอล์ฟ](https://www.msig-thai.com/th/personal-insurance/golfers-insurance) | MSIG ประกันภัย | golf |
| sports-02 | [Chubb ประกันภัยผู้เล่นกอล์ฟ](https://www.chubb.com/th-th/personal/golfers-insurance.html) | ชับบ์สามัคคีประกันภัย | golf |
| sports-03 | [คุ้มภัยโตเกียวมารีน Golfers Insurance](https://www.tokiomarine.com/th/en/non-life/products/retail/travel-and-sports/golfers-insurance.html) | คุ้มภัยโตเกียวมารีนประกันภัย | golf |
| property-08 | [MSIG Baan Easy บ้านอีซี่](https://www.msig-thai.com/th/personal-insurance/baan-easy) | MSIG ประกันภัย | property |
| property-09 | [MSIG Condo Easy คอนโดอีซี่](https://www.msig-thai.com/th/personal-insurance/condo-easy) | MSIG ประกันภัย | property |
| property-10 | [MSIG My Home Safe](https://www.msig-thai.com/en/personal-insurance/my-home-safe) | MSIG ประกันภัย | property |
| property-11 | [เมืองไทย อยู่ดีมีสุข](https://www.muangthaiinsurance.com/th/product/property-insurance) | เมืองไทยประกันภัย | property |
| property-12 | [วิริยะ บ้านเปี่ยมสุข](https://www.viriyah.co.th/products/residental-property-insurance/pieamsuk-home-insurance/) | วิริยะประกันภัย | property |
| property-13 | [ทิพย บ้านทิพยยิ้มได้พลัส](https://ft.tipinsure.com/Fire/fire_product_choose) | ทิพยประกันภัย | property |
| property-14 | [กรุงเทพประกันภัย รักษ์บ้าน](https://www.bangkokinsurance.com/th/product/residential/rakbaan) | กรุงเทพประกันภัย | property |
| property-15 | [กรุงเทพประกันภัย ทรัพย์สินภายในคอนโด](https://www.bangkokinsurance.com/product/residential) | กรุงเทพประกันภัย | property |
| property-16 | [กรุงเทพประกันภัย อัคคีภัยที่อยู่อาศัย 599](https://www.bangkokinsurance.com/product/residential) | กรุงเทพประกันภัย | property |
| property-17 | [กรุงเทพประกันภัย Home Cover Plus](https://www.bangkokinsurance.com/product/residential) | กรุงเทพประกันภัย | property |
| business-01 | [MSIG Contractors’ All Risks](https://www.msig-thai.com/th/business-insurance/contractors%E2%80%99-all-risks-insurance) | MSIG ประกันภัย | construction |
| business-02 | [MSIG Erection All Risks](https://www.msig-thai.com/th/business-insurance/erection-all-risks-insurance) | MSIG ประกันภัย | installation |
| business-03 | [MSIG Machinery All Risks](https://www.msig-thai.com/th/business-insurance/machinery-all-risks-insurance) | MSIG ประกันภัย | machinery |
| business-04 | [MSIG Inland Cargo](https://www.msig-thai.com/th/business-insurance/inland-cargo) | MSIG ประกันภัย | cargo |
| business-05 | [Chubb Industrial All Risks](https://www.chubb.com/th-th/business/industrial-all-risks-insurance.html) | ชับบ์สามัคคีประกันภัย | commercial-property |
| business-06 | [Chubb SME Value for Servicing Business](https://www.chubb.com/th-en/business/sme-value-for-servicing-business.html) | ชับบ์สามัคคีประกันภัย | sme |
| business-07 | [กรุงเทพประกันภัย สินเชื่อทางการค้า](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | trade-credit |
| business-08 | [กรุงเทพประกันภัย เงินทดแทนแรงงาน](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | workers-compensation |
| business-09 | [กรุงเทพประกันภัย ความซื่อสัตย์ของลูกจ้าง](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | fidelity |
| business-10 | [กรุงเทพประกันภัย ร้านทอง](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | jewellers |
| business-11 | [กรุงเทพประกันภัย เบ็ดเสร็จคุ้มครองผู้ค้าอัญมณี](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | jewellers |
| business-12 | [กรุงเทพประกันภัย การเสี่ยงภัยทุกชนิด](https://www.bangkokinsurance.com/th/product/business) | กรุงเทพประกันภัย | commercial-property |
| business-13 | [กรุงเทพประกันภัย ร้านค้าอุ่นใจ](https://www.bangkokinsurance.com/th/product/residential/shop) | กรุงเทพประกันภัย | sme |
| business-14 | [กรุงเทพประกันภัย อัคคีภัยสถานประกอบการ](https://www.bangkokinsurance.com/th/product/residential/fire) | กรุงเทพประกันภัย | commercial-property |

## Verification

Scoped test run: 53/53 passed across domain, persona, Browse refinement, comparison and new catalog expansion tests. The new tests assert the distinct-product count, null pricing and unknown limits, truthful image provenance, wedding enquiry limitations and subgroup compatibility. TypeScript and production browser checks are consolidated by the root team; this team did not build or restart the server.
