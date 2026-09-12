# V47 source-link navigation audit

Checked 2026-09-12 on production http://127.0.0.1:8787 with an isolated Playwright CLI session. Actual Browse links led to 25 Detail records. Collected 26 distinct HTTPS source URLs from rendered Detail anchors; opened enclosing source disclosures and clicked at least one anchor for every distinct URL.

**Application navigation: PASS 26/26.** All opened a popup with window.opener === null (target=_blank, rel=noreferrer). 25 destinations matched directly; the life 99/20 PDF followed an observed official same-domain HTTP 302 to HTTP 200 application/pdf with the same filename. Both PDF links returned HTTP 200 application/pdf. PDF contents were not re-audited or downloaded by this check.

**Remote HTML content: BLOCKED 24/24 in this automation environment.** 12 AXA pages displayed Access Blocked; 12 MTL pages displayed Just a moment anti-bot challenges. These are successful link navigations, not verified source-page content. No challenge bypass or retries. No broken application source link observed.

All created popups closed; no user tabs touched. No app edits, restart, live model calls, or assertions about untested remote features. Evidence: source-links-final.json. Challenge query parameters removed from artifacts.

| Source URL | Navigation / opener | Remote content |
|---|---|---|
| [https://www.axa.co.th/th/personal/health-insurance/value-plan](https://www.axa.co.th/th/personal/health-insurance/value-plan) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan) | PASS / null | BLOCKED: Access Blocked |
| [https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-s](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-s) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-m](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-m) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-l](https://online.muangthai.co.th/th/Health-IPD-OPD/detail/ipd-opd-sukjai-l) | PASS / null | BLOCKED: anti-bot challenge |
| [https://www.axa.co.th/th/personal/car-insurance/type3-plus](https://www.axa.co.th/th/personal/car-insurance/type3-plus) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/car-insurance/type2-plus](https://www.axa.co.th/th/personal/car-insurance/type2-plus) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/car-insurance/type1](https://www.axa.co.th/th/personal/car-insurance/type1) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev](https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/car-insurance/compulsory](https://www.axa.co.th/th/personal/car-insurance/compulsory) | PASS / null | BLOCKED: Access Blocked |
| [https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-index-15-3-global-index-linked](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-index-15-3-global-index-linked) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/detail/global-index-15-3/plan-table](https://online.muangthai.co.th/th/detail/global-index-15-3/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf](https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf) | PASS / null | HTTP 200 application/pdf |
| [https://online.muangthai.co.th/th/detail/99-7](https://online.muangthai.co.th/th/detail/99-7) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/detail/99-7/plan-table](https://online.muangthai.co.th/th/detail/99-7/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-linked-pro-10-1-global//](https://www.muangthai.co.th/en/savings-insurance/muangthai-smart-linked-pro-10-1-global//) | PASS / null | BLOCKED: anti-bot challenge |
| [https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf](https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf) | PASS / null | HTTP 200 application/pdf |
| [https://online.muangthai.co.th/th/detail/pa-small-size/plan-table](https://online.muangthai.co.th/th/detail/pa-small-size/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://www.axa.co.th/th/personal/accident-insurance/affordable-plan](https://www.axa.co.th/th/personal/accident-insurance/affordable-plan) | PASS / null | BLOCKED: Access Blocked |
| [https://online.muangthai.co.th/th/detail/pa-go/plan-table](https://online.muangthai.co.th/th/detail/pa-go/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/detail/pa-cashback/plan-table](https://online.muangthai.co.th/th/detail/pa-cashback/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table](https://online.muangthai.co.th/th/detail/pa-all-in-one/plan-table) | PASS / null | BLOCKED: anti-bot challenge |
| [https://www.axa.co.th/th/personal/travel-insurance/outbound](https://www.axa.co.th/th/personal/travel-insurance/outbound) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/travel-insurance/inbound](https://www.axa.co.th/th/personal/travel-insurance/inbound) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/travel-insurance/domestic](https://www.axa.co.th/th/personal/travel-insurance/domestic) | PASS / null | BLOCKED: Access Blocked |
| [https://www.axa.co.th/th/personal/home-insurance/home-plan](https://www.axa.co.th/th/personal/home-insurance/home-plan) | PASS / null | BLOCKED: Access Blocked |

PDF resolved destinations:
- [https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf](https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf) → [https://www.muangthai.co.th/assets/90c02ee5-f0b8-4dc6-a61a-554424db241a/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf](https://www.muangthai.co.th/assets/90c02ee5-f0b8-4dc6-a61a-554424db241a/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf)
- [https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf](https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf) → [https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf](https://cdn-ols.muangthai.co.th/bo/product-information/MTL-Smart-Pro-Link-Insurance-10_1-18052023-010350.pdf)
