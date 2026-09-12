# Official health/life image assets — 12 September 2026

Final root integration: all 15 health/life identities now have sourced images. `health-07` uses the verified official Allianz group emblem, explicitly labelled insurer fallback; `research-plan-images.md` documents the source and remaining Thai product-art HTTP 403. Final health/life breakdown: 6 product images / 9 insurer identities. The 14/15 investigation notes below describe the earlier asset-gathering stage.

Final AIA quality correction: health-06 now uses the [official AIA header logo](https://www.aia.co.th/content/dam/th-wise/images/system/icons/new-logo_26.png), observed in the product-page HTML. Download HTTP200 image/png, decoded PNG452×444 and visually inspected: red AIA letters only, no benefit amount. Saved `aia-logo.png`; kind=insurer. No cropping/redrawing. The25m campaign image is no longer mapped, avoiding an implication that selected5m tier covers25m. Current mapped breakdown therefore6 product images and8 insurer fallbacks; the original asset inventory below remains historical evidence.

14/15 current identities mapped in `lib/plan-images-health-life.ts`:7 product images and7 explicit insurer-logo fallbacks. **health-07 Allianz remains blocked**, not deceptively labelled as a verified logo. All mapped files exist locally under `/images/products-health-life/`. No catalog/UI/type edits.

| IDs | Asset | Format / dimensions | Verification |
|---|---|---|---|
|health-01|axa-value.jpg|JPEG1200×1200|Exact product page og:image SmartcareValue_1200x1200; visually checked|
|health-02|axa-essential.png|PNG1201×1201|Exact product page og:image smartcare_1TH_1200x1200; product name visible|
|health-06|aia-happy.png|PNG1112×516|Exact AIA HealthHappy page hero; contains family-wide25m promotional maximum, **not selected5m limit**. Keep canonical card limit authoritative.|
|health-08|fwd-health.webp|WEBP482×300|Exact EasyEHealth page product image; source itself low resolution, not upscaled|
|health-09|thailife-healthfit.jpg|JPEG585×738|Original embedded X0.jpg from official HealthFitDD brochure p1; byte extraction, not generated|
|life-01|mtl-protection.jpg|JPEG509×766|Original embedded X0.jpg from official SmartProtection99/20 brochure p1|
|life-06|bla-esavings.jpg|JPEG1200×630|Exact Gain1st e-Savings page og:image; response is JPEG despite remote.png suffix|
|health-03/04/05;life-02/03/04|mtl-logo.png|PNG215×250|Official logo rendered from SmartProtection99/20 PDF p1 logo region; no redrawing. Explicit insurer fallback, never claimed as those product photos.|
|life-07|pru-logo.png|PNG1232×279|Prudential official site header logo; product hero Scene7 request403 and observed mobile path404; explicit insurer fallback|

Asset-source provenance:

- [AXA Value page](https://www.axa.co.th/th/personal/health-insurance/value-plan): `https://images.prismic.io/thailandgi-ktaxa/aYGY4t0YXLCxVSnJ_SmartcareValue_1200x1200.jpg?auto=format,compress`.
- [AXA Essential page](https://www.axa.co.th/th/personal/health-insurance/comprehensive-plan): `https://images.prismic.io/thailandgi-ktaxa/aRGlirpReVYa4Rzi_smartcare_1TH_1200x1200.png?auto=format,compress`.
- [AIA page](https://www.aia.co.th/th/our-products/health/aia-health-happy): `https://www.aia.co.th/content/dam/th-wise/images/th/homepage/health-happy_d.PNG?qlt=85&wid=1600&ts=1668508884470&dpr=off`.
- [FWD page](https://www.fwd.co.th/th/health-insurance/easy-e-health/): `https://www.fwd.co.th/images/v3/assets/blt331c1aa12dcfd37a/blt400f4ec4c036a245/664340090bbc6207ee7f7c9c/Easy-E-Health-health-insurance-m.webp`.
- [ThaiLife brochure](https://product.thailife.com/media/wysiwyg/TL-brochure/HealthFitDD.pdf).
- SmartProtection PDF URL retained verbatim in mapping.sourceUrl; official `www.muangthai.co.th/filestorage/brochures/20250630-04-0174…99-20.pdf`; HTTP200 despite product HTML403. Both PDF cover and extracted logo visually checked.
- [Gain1st page](https://www.bangkokbank.com/th-TH/Personal/My-Family-and-Me/Bancassurance/BLA/Gain1st-e-Savings): `https://www.bangkokbank.com/-/media/feature/page-content/bbl-corporate/productservice/bancassurance/bla/gain1st-e-saving-10-5/og_1200x630.png`.
- [PRULifeCare](https://www.prudential.co.th/en/products/life/life-protection/d2c/pru-life-care/): logo `https://www.prudential.co.th/content/dam/prudential-aem-lbu/plt/pru-thailand-logo.png` HTTP200.

Blocked attempts: MTL product HTML and isolated browser show403 Cloudflare; no challenge bypass. SmartLink PDF is public200 but no embedded raster product photo. Allianz exact BeyondCare hero `https://www.allianz.co.th/th_TH/health/lump-sum/beyond-care/_jcr_content/root/parsys/stage_copy/stageimage.img.82.3360.jpeg/1739114849009/pd-stage-beyond-care-1520x510-desktop.jpeg` is verified by official page image link but local403. Official press-logo PNG `https://commercial.allianz.com/content/dam/onemarketing/commercial/commercial/logo/AZ-Logo-positive-rgb.png` and JPG `https://www.allianz.com/content/dam/onemarketing/azcom/Allianz_com/press/media-database/Allianz_Logo_white_background.jpg` also403. UK/AU official pages403. No nonofficial substitute fabricated. Parent informed this one record cannot be marked image-complete.

MIME validated before saving HTTP images and decoded with Pillow; PDF embedded JPEGs parsed from original document. Mapping src values local-only for snapshot compatibility. Download diagnostic JSON in output/product-image-research/downloads.json. Native browser session closed after checking access. No API credentials touched; root handles partner-API access research separately.
