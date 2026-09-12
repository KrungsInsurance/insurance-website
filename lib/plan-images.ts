// Official product imagery; provenance and fallback limitations: research-plan-images.md
import { planImagesHealthLife } from "./plan-images-health-life.ts";
export const planImages: Record<string, {src:string;alt:string;sourceUrl:string;kind:"product"|"insurer"}> = {
  ...planImagesHealthLife,
  "health-07": {src:"/images/products/allianz-official.jpg",alt:"ตรากลุ่ม Allianz (ใช้แทนภาพผลิตภัณฑ์)",sourceUrl:"https://github.com/allianz",kind:"insurer"},
  "property-06": {src:"/images/products/allianz-official.jpg",alt:"ตรากลุ่ม Allianz (ใช้แทนภาพผลิตภัณฑ์)",sourceUrl:"https://github.com/allianz",kind:"insurer"},
  "motor-01": {
    "src": "/images/products/motor-01.png",
    "alt": "ภาพทางการของ AXA SmartDrive ชั้น 1",
    "sourceUrl": "https://www.axa.co.th/th/personal/car-insurance/type1",
    "kind": "product"
  },
  "motor-02": {
    "src": "/images/products/motor-02.png",
    "alt": "ภาพทางการของ AXA SmartDrive ชั้น 1 EV/PHEV",
    "sourceUrl": "https://www.axa.co.th/th/personal/car-insurance/electric-vehicle-ev",
    "kind": "product"
  },
  "motor-03": {
    "src": "/images/products/motor-03.png",
    "alt": "ภาพทางการของ AXA SmartDrive ชั้น 2+",
    "sourceUrl": "https://www.axa.co.th/th/personal/car-insurance/type2-plus",
    "kind": "product"
  },
  "motor-04": {
    "src": "/images/products/motor-04.png",
    "alt": "ภาพทางการของ AXA SmartDrive ชั้น 3+",
    "sourceUrl": "https://www.axa.co.th/th/personal/car-insurance/type3-plus",
    "kind": "product"
  },
  "motor-05": {
    "src": "/images/products/motor-05.png",
    "alt": "ภาพทางการของ AXA พ.ร.บ. รถยนต์",
    "sourceUrl": "https://www.axa.co.th/th/personal/car-insurance/compulsory",
    "kind": "product"
  },
  "accident-05": {
    "src": "/images/products/accident-05.jpg",
    "alt": "ภาพทางการของ AXA ประกันอุบัติเหตุ PA Save Dee",
    "sourceUrl": "https://www.axa.co.th/th/personal/accident-insurance/affordable-plan",
    "kind": "product"
  },
  "travel-01": {
    "src": "/images/products/travel-01.jpg",
    "alt": "ภาพทางการของ AXA Smart Traveller’s Choice รายเที่ยว",
    "sourceUrl": "https://www.axa.co.th/th/personal/travel-insurance/outbound",
    "kind": "product"
  },
  "travel-02": {
    "src": "/images/products/travel-01.jpg",
    "alt": "ภาพทางการของ AXA Smart Traveller’s Choice รายปี",
    "sourceUrl": "https://www.axa.co.th/th/personal/travel-insurance/outbound",
    "kind": "product"
  },
  "travel-03": {
    "src": "/images/products/travel-03.jpg",
    "alt": "ภาพทางการของ AXA Smart Thailand Traveller ในประเทศ",
    "sourceUrl": "https://www.axa.co.th/th/personal/travel-insurance/domestic",
    "kind": "product"
  },
  "travel-04": {
    "src": "/images/products/travel-04.jpg",
    "alt": "ภาพทางการของ AXA Inbound Travel Insurance",
    "sourceUrl": "https://www.axa.co.th/th/personal/travel-insurance/inbound",
    "kind": "product"
  },
  "travel-05": {
    "src": "/images/products/travel-01.jpg",
    "alt": "ภาพทางการของ AXA Smart Traveller’s Choice สำหรับเชงเก้น",
    "sourceUrl": "https://www.axa.co.th/th/personal/travel-insurance/outbound",
    "kind": "product"
  },
  "property-01": {
    "src": "/images/products/property-01.jpg",
    "alt": "ภาพทางการของ AXA Sabuydee My Home บ้านและคอนโด",
    "sourceUrl": "https://www.axa.co.th/th/personal/home-insurance/home-plan",
    "kind": "product"
  },
  "motor-06": {
    "src": "/images/products/bki-logo.png",
    "alt": "ตราบริษัท กรุงเทพประกันภัย (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.bangkokinsurance.com/th/product/motor/voluntary/firstloss",
    "kind": "insurer"
  },
  "travel-06": {
    "src": "/images/products/travel-06.png",
    "alt": "ภาพทางการของ MSIG Trip Easy Plus ในประเทศ แผน 3",
    "sourceUrl": "https://www.msig-thai.com/th/personal-insurance/trip-easy-plus-domestic",
    "kind": "product"
  },
  "travel-07": {
    "src": "/images/products/travel-07.jpg",
    "alt": "ภาพทางการของ MSIG Travel Easy Plus Easy 1",
    "sourceUrl": "https://www.msig-thai.com/th/personal-insurance/travel-easy-plus",
    "kind": "product"
  },
  "liability-07": {
    "src": "/images/products/liability-07.jpg",
    "alt": "ภาพทางการของ MSIG Public Liability",
    "sourceUrl": "https://www.msig-thai.com/th/business-insurance/public-liability",
    "kind": "product"
  },
  "accident-06": {
    "src": "/images/products/bki-logo.png",
    "alt": "ตราบริษัท กรุงเทพประกันภัย (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.bangkokinsurance.com/th/product/accident/holiday",
    "kind": "insurer"
  },
  "accident-07": {
    "src": "/images/products/accident-07.png",
    "alt": "ภาพทางการของ Accident Care สัญญาเพิ่มเติม 1 ล้านบาท",
    "sourceUrl": "https://www.bangkoklife.com/th/products/detail/286",
    "kind": "product"
  },
  "liability-06": {
    "src": "/images/products/liability-06.jpg",
    "alt": "ภาพทางการของ คุ้มภัยโตเกียวมารีน Public Liability",
    "sourceUrl": "https://www.tokiomarine.com/th/th/non-life/products/commercial/liability/public-liability-insurance.html",
    "kind": "product"
  },
  "motor-07": {
    "src": "/images/products/motor-07.svg",
    "alt": "ตราบริษัท วิริยะประกันภัย (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.viriyah.co.th/",
    "kind": "insurer"
  },
  "accident-01": {
    "src": "/images/products-health-life/mtl-logo.png",
    "alt": "ตราบริษัท เมืองไทยประกันชีวิต (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf",
    "kind": "insurer"
  },
  "accident-02": {
    "src": "/images/products-health-life/mtl-logo.png",
    "alt": "ตราบริษัท เมืองไทยประกันชีวิต (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf",
    "kind": "insurer"
  },
  "accident-03": {
    "src": "/images/products-health-life/mtl-logo.png",
    "alt": "ตราบริษัท เมืองไทยประกันชีวิต (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf",
    "kind": "insurer"
  },
  "accident-04": {
    "src": "/images/products-health-life/mtl-logo.png",
    "alt": "ตราบริษัท เมืองไทยประกันชีวิต (ใช้แทนภาพผลิตภัณฑ์)",
    "sourceUrl": "https://www.muangthai.co.th/filestorage/brochures/20250630-04-0174%20%E0%B9%82%E0%B8%9A%E0%B8%A3%E0%B8%8A%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B9%8C%20%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%97%E0%B9%82%E0%B8%9E%E0%B8%A3%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99%2099-20.pdf",
    "kind": "insurer"
  }
};

