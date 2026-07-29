// ============================================
// SOLAR CALCULATOR DATA
// Điện Mặt Trời Nhật Minh
//
// Logic hoàn toàn lấy từ SOLAR_SYSTEMS, không tính toán công suất.
//
// B1 — Đọc monthlyBill, roofArea
// B2 — Tìm hệ theo bill: duyệt SOLAR_SYSTEMS, chọn hệ có
//       yearlySaving/12 gần nhất với monthlyBill
// B3 — Tìm hệ theo diện tích: hệ lớn nhất có roofArea <= roofArea
// B4 — Lấy hệ nhỏ hơn giữa B2 và B3
// B5 — Mọi data hiển thị từ system object (panelCount, battery,
//       production, cost, payback…). Không tính.
// Fallback: nếu không tìm được → trả hệ nhỏ nhất (4 kWp)
// ============================================

import { SOLAR_SYSTEMS } from "./solarSystems";

export { SOLAR_SYSTEMS } from "./solarSystems";

// ── Region ───────────────────────────────────────────────────────────────────
export const REGIONS = [
  {
    id: "north",
    label: "Miền Bắc",
    provinces: ["Hà Nội","Hải Phòng","Quảng Ninh","Lạng Sơn","Cao Bằng","Lai Châu","Điện Biên","Sơn La","Lào Cai","Tuyên Quang","Thái Nguyên","Bắc Ninh","Hưng Yên","Ninh Bình","Phú Thọ","Thanh Hóa","Nghệ An","Hà Tĩnh"],
  },
  {
    id: "central",
    label: "Miền Trung",
    provinces: ["Đà Nẵng","Quảng Ngãi","Gia Lai","Khánh Hòa","Đắk Lắk","Lâm Đồng"],
  },
  {
    id: "south",
    label: "Miền Nam",
    provinces: ["Hồ Chí Minh","Đồng Nai","Tây Ninh","Vĩnh Long","Đồng Tháp","An Giang","Cần Thơ","Cà Mau"],
  },
];

// ── Shading ──────────────────────────────────────────────────────────────────
export const SHADING_FACTOR = {
  "Không đáng kể": 1.0,
  "Một phần": 0.80,
  "Nhiều": 0.55,
  "Chưa rõ": 0.75,
};

// ── System type config ───────────────────────────────────────────────────────
export const SYSTEM_TYPES = {
  OnGrid: {
    label: "On-grid",
    description: "Hệ nối lưới — không có pin lưu trữ",
    hasBattery: false,
    batteryCapacity: 0,
    color: "bg-blue-100 text-blue-700",
  },
  Hybrid: {
    label: "Hybrid",
    description: "Kết hợp lưới điện và pin lưu trữ",
    hasBattery: true,
    batteryCapacity: 10,
    color: "bg-amber-100 text-amber-700",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * B2 — Tìm hệ gần nhất với monthlyBill.
 * Quét SOLAR_SYSTEMS từ nhỏ tới lớn, chọn hệ có
 * yearlySaving/12 gần nhất với monthlyBill.
 * Fallback: hệ nhỏ nhất nếu không tìm được.
 */
export const findSystemByBill = (monthlyBill) => {
  const bill = parseFloat(monthlyBill) || 0;
  if (bill <= 0) return SOLAR_SYSTEMS[0];

  let best = SOLAR_SYSTEMS[0];
  let bestDiff = Infinity;

  for (const sys of SOLAR_SYSTEMS) {
    const recommendedBill = sys.yearlySaving / 12;
    const diff = Math.abs(recommendedBill - bill);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = sys;
    }
  }
  return best;
};

/**
 * B3 — Tìm hệ lớn nhất theo diện tích mái.
 * Hệ lớn nhất có roofArea <= roofArea.
 * null nếu mái quá nhỏ (không đủ 4 kWp).
 */
export const findSystemByRoof = (roofArea) => {
  const area = parseFloat(roofArea) || 0;
  if (area <= 0) return null;
  return SOLAR_SYSTEMS.filter((s) => s.roofArea <= area).at(-1) || null;
};

/**
 * B4 — Chọn hệ cuối cùng: lấy hệ nhỏ hơn giữa
 * hệ theo bill và hệ theo diện tích.
 * Nếu mái null → dùng hệ bill.
 * Luôn trả về một hệ (fallback: hệ nhỏ nhất).
 */
export const selectFinalSystem = (billSystem, roofSystem) => {
  const fallback = SOLAR_SYSTEMS[0];

  if (!roofSystem) {
    return { system: billSystem, capped: false };
  }

  if (billSystem.capacity <= roofSystem.capacity) {
    return { system: billSystem, capped: false };
  }

  return { system: roofSystem, capped: true };
};

/**
 * System type theo tỷ lệ điện ban đêm.
 * ≤ 30% → On-grid
 * > 30% → Hybrid
 */
export const systemTypeFromRatio = (dayNightRatio) => {
  return ((dayNightRatio ?? 40) / 100) > 0.30 ? "Hybrid" : "OnGrid";
};

/**
 * Battery: Hybrid lấy system.battery, On-grid = 0.
 */
export const getBatteryCapacity = (systemType, system) => {
  return systemType === "Hybrid" ? system.battery : 0;
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SOLVER
// calculateSolution() — toàn bộ data lấy từ SOLAR_SYSTEMS
// ─────────────────────────────────────────────────────────────────────────────
export const calculateSolution = (formData) => {
  const {
    regionId = "north",
    monthlyBill = 0,
    buildingType = "Home",
    roofArea = 0,
    shading = "",
    dayNightRatio = 40,
  } = formData;

  const bill   = parseFloat(monthlyBill) || 0;
  const roofM2 = parseFloat(roofArea)   || 0;

  // ── B2: Hệ theo tiền điện ─────────────────────────────────────────────
  const billSystem = findSystemByBill(bill);

  // ── B3: Hệ theo diện tích mái ───────────────────────────────────────────
  const roofSystem = findSystemByRoof(roofM2);

  // ── B4: Chọn hệ cuối cùng ──────────────────────────────────────────────
  const { system, capped } = selectFinalSystem(billSystem, roofSystem);

  // ── System type + battery ────────────────────────────────────────────────
  const systemType = systemTypeFromRatio(dayNightRatio);
  const batteryCapacity = getBatteryCapacity(systemType, system);

  // ── B5: Map từ SOLAR_SYSTEMS — không tính ───────────────────────────────
  const {
    capacity,
    panelCount,
    roofArea: roofAreaNeeded,
    monthlyProduction,
    annualProduction,
    yearlySaving,
    estimatedCost,
    paybackYears,
  } = system;

  const monthlySavings = Math.round(yearlySaving / 12);

  // ── Warnings ──────────────────────────────────────────────────────────────
  const warnings = [];
  if (capped) {
    warnings.push({
      type: "danger",
      message: `Diện tích mái (${roofM2} m²) chỉ đủ lắp hệ tối đa ${roofSystem.capacity} kWp. Công suất đề xuất đã được điều chỉnh phù hợp.`,
    });
  }

  const nightRatio = (dayNightRatio ?? 40) / 100;
  if (nightRatio > 0.30 && systemType === "OnGrid") {
    warnings.push({
      type: "warning",
      message: `Tỷ lệ dùng điện ban đêm cao (${Math.round(nightRatio * 100)}%). Hệ On-grid không lưu trữ điện, bạn nên cân nhắc hệ Hybrid để dùng ban đêm.`,
    });
  }

  // ── Payback chart ───────────────────────────────────────────────────────
  const chartYears = Math.ceil(paybackYears) + 3;
  const paybackChart = Array.from({ length: chartYears + 1 }, (_, year) => ({
    year,
    savings: Math.min(year * yearlySaving, estimatedCost * 1.5),
    invested: estimatedCost,
  }));

  // ── Return — giữ nguyên field cho ResultPanel ───────────────────────────
  return {
    systemType,
    systemTypeInfo: SYSTEM_TYPES[systemType],
    capacityKw: capacity,
    panelCount,
    batteryCapacity,

    monthlyProduction,
    annualProduction,

    roofAreaNeeded,
    roofAreaUsed: roofAreaNeeded,

    monthlySavings,
    annualSavings: yearlySaving,

    systemCost: estimatedCost,
    paybackYears,
    paybackChart,

    warnings,
    region: REGIONS.find((r) => r.id === regionId)?.label || "",
    buildingType,
    monthlyBill: bill,
  };
};
