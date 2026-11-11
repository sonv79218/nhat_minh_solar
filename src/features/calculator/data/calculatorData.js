// ============================================
// SOLAR CALCULATOR DATA — Công thức vật lý thực tế
// Điện Mặt Trời Nhật Minh
//
// Nguyên tắc:
// - KHÔNG tra bảng SOLAR_SYSTEMS để quyết định công suất.
// - Mọi kết quả tính động từ dữ liệu khách hàng nhập.
// - SOLAR_SYSTEMS vẫn được export để các trang khác
//   (SolutionsPage...) sử dụng, nhưng KHÔNG dùng trong
//   luồng calculateSolution() mới.
// ============================================

import { SOLAR_SYSTEMS } from "./solarSystems.js";

export { SOLAR_SYSTEMS } from "./solarSystems.js";

// ── Khu vực + PSH (giờ nắng đỉnh trung bình) ────────────────────────────────
export const REGIONS = [
  {
    id: "north",
    label: "Miền Bắc",
    psh: 3.0,
    pshNote: "Giá trị tham khảo, cần hiệu chỉnh theo tỉnh.",
    provinces: ["Hà Nội","Hải Phòng","Quảng Ninh","Lạng Sơn","Cao Bằng","Lai Châu","Điện Sơn","Sơn La","Lào Cai","Tuyên Quang","Thái Nguyên","Bắc Ninh","Hưng Yên","Ninh Bình","Phú Thọ","Thanh Hóa","Nghệ An","Hà Tĩnh"],
  },
  {
    id: "central",
    label: "Miền Trung",
    psh: 3.8,
    pshNote: "Giá trị tham khảo, cần hiệu chỉnh theo tỉnh.",
    provinces: ["Đà Nẵng","Quảng Ngãi","Gia Lai","Khánh Hòa","Đắk Lắk","Lâm Đồng"],
  },
  {
    id: "south",
    label: "Miền Nam",
    psh: 4.2,
    pshNote: "Giá trị tham khảo, cần hiệu chỉnh theo tỉnh.",
    provinces: ["Hồ Chí Minh","Đồng Nai","Tây Ninh","Vĩnh Long","Đồng Tháp","An Giang","Cần Thơ","Cà Mau"],
  },
];

// Tra cứu PSH theo tỉnh (nếu có dữ liệu chi tiết thì bổ sung tại đây).
// Key: tên tỉnh → PSH. Chưa có thì fallback về PSH vùng.
export const PROVINCE_PSH = {
  // Ví dụ hiệu chỉnh sau khảo sát thực tế:
  // "Hà Nội": 2.8,
  // "Hồ Chí Minh": 4.3,
};

export const getPshByRegion = (regionId, province) => {
  if (province && PROVINCE_PSH[province] != null) {
    return {
      psh: PROVINCE_PSH[province],
      source: `Số liệu tỉnh ${province}`,
    };
  }
  const region = REGIONS.find((r) => r.id === regionId);
  if (region) return { psh: region.psh, source: `${region.label} (mặc định)` };
  return { psh: 3.5, source: "Giá trị chung" };
};

// ── Biểu giá điện sinh hoạt 5 bậc (chưa VAT) ────────────────────────────────
export const ELECTRICITY_TIERS = [
  { upTo: 100, price: 1901 },
  { upTo: 200, price: 2289 },
  { upTo: 400, price: 2894 },
  { upTo: 700, price: 3456 },
  { upTo: Infinity, price: 3844 },
];

export const VAT_RATE = 0.08;
export const DAYS_PER_MONTH = 30;

// ── Thông số hệ thống (cấu hình được) ───────────────────────────────────────
export const SYSTEM_CONFIG = {
  systemEfficiency: 0.8, // hiệu suất tổng hệ thống
  panelAreaEach: 2.7, // m² / tấm
  roofMarginFactor: 1.1, // dự phòng lối đi + khoảng cách kỹ thuật
  batteryDOD: 0.9,
  batteryEfficiency: 0.9,
  batteryModules: [5, 10, 15, 20], // kWh thương mại
  inverterMargin: 1.0, // hệ số dự phòng inverter (khảo sát tải thực tế)
};

export const PANEL_OPTIONS = [
  { watt: 580, area: 2.7, label: "580Wp" },
  { watt: 600, area: 2.7, label: "600Wp" },
  { watt: 620, area: 2.7, label: "620Wp" },
  { watt: 650, area: 2.7, label: "650Wp" },
];

export const DEFAULT_PANEL_WATT = 620;

// ── Che bóng ────────────────────────────────────────────────────────────────
// Map cả nhãn cũ (StepRoof hiện tại) và nhãn chuẩn mới.
export const SHADING_FACTOR = {
  "Không đáng kể": 1.0,
  "Không che bóng": 1.0,
  "Một phần": 0.8,
  "Che bóng nhẹ": 0.8,
  "Chưa rõ": 0.75,
  "Che bóng trung bình": 0.75,
  "Trung bình": 0.75,
  "Nhiều": 0.55,
  "Che bóng nhiều": 0.55,
};

export const getShadingFactor = (shading) => {
  if (shading == null || shading === "") return 1.0;
  return SHADING_FACTOR[shading] ?? 0.75;
};

// ── Loại hệ thống ───────────────────────────────────────────────────────────
export const SYSTEM_TYPES = {
  OnGrid: {
    label: "On-grid",
    description: "Hệ nối lưới — không có pin lưu trữ",
    hasBattery: false,
    color: "bg-blue-100 text-blue-700",
  },
  Hybrid: {
    label: "Hybrid",
    description: "Kết hợp lưới điện và pin lưu trữ",
    hasBattery: true,
    color: "bg-amber-100 text-amber-700",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// HÀM TÍNH TOÁN ĐỘC LẬP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tính ngược số kWh từ hóa đơn (đã gồm VAT) bằng cách lũy tiến từng bậc.
 * netBill = grossBill / (1 + VAT), sau đó bóc từng bậc.
 */
export const calculateMonthlyKwhFromBill = (grossBill, tiers = ELECTRICITY_TIERS, vatRate = VAT_RATE) => {
  const gross = parseFloat(grossBill) || 0;
  if (gross <= 0) return 0;
  const net = gross / (1 + vatRate);
  let remaining = net;
  let kwh = 0;
  let prevUpTo = 0;
  for (const tier of tiers) {
    const tierCap = tier.upTo === Infinity ? Infinity : tier.upTo - prevUpTo;
    const tierCostFull = tierCap === Infinity ? Infinity : tierCap * tier.price;
    if (remaining >= tierCostFull) {
      kwh += tierCap;
      remaining -= tierCostFull;
    } else {
      kwh += remaining / tier.price;
      remaining = 0;
      break;
    }
    prevUpTo = tier.upTo;
  }
  return Math.round(kwh * 100) / 100;
};

/** Điện tiêu thụ bình quân ngày = tháng / 30 */
export const calculateDailyConsumption = (monthlyKwh, daysPerMonth = DAYS_PER_MONTH) => {
  const m = parseFloat(monthlyKwh) || 0;
  if (m <= 0) return 0;
  return Math.round((m / daysPerMonth) * 100) / 100;
};

/** Điện mục tiêu/ngày = hiện tại × (1 + dự phòng %) */
export const calculateTargetDailyConsumption = (dailyKwh, reservePct = 0) => {
  const d = parseFloat(dailyKwh) || 0;
  const r = parseFloat(reservePct) || 0;
  return Math.round(d * (1 + r / 100) * 100) / 100;
};

/**
 * Công suất giàn pin cần lắp (kWp) =
 * targetDaily / (PSH × hiệu suất × shadingFactor)
 * Chia cho shadingFactor để bù sản lượng mất do che bóng.
 */
export const calculateSolarCapacity = (targetDailyKwh, psh, systemEfficiency = 0.8, shadingFactor = 1.0) => {
  const t = parseFloat(targetDailyKwh) || 0;
  const p = parseFloat(psh) || 0;
  const e = parseFloat(systemEfficiency) || 0.8;
  const s = parseFloat(shadingFactor) || 1.0;
  if (t <= 0 || p <= 0 || e <= 0 || s <= 0) return 0;
  return Math.round((t / (p * e * s)) * 100) / 100;
};

/** Số tấm = ceil(requiredKw × 1000 / panelWatt) — luôn làm tròn LÊN */
export const calculatePanelCount = (requiredKw, panelWatt) => {
  const kw = parseFloat(requiredKw) || 0;
  const w = parseFloat(panelWatt) || DEFAULT_PANEL_WATT;
  if (kw <= 0 || w <= 0) return 0;
  return Math.ceil((kw * 1000) / w);
};

/** Công suất thực tế sau làm tròn = số tấm × Wp / 1000 */
export const calculateActualCapacity = (panelCount, panelWatt) => {
  const n = parseInt(panelCount, 10) || 0;
  const w = parseFloat(panelWatt) || 0;
  if (n <= 0 || w <= 0) return 0;
  return Math.round(((n * w) / 1000) * 100) / 100;
};

/** Diện tích mái cần = số tấm × diện tích/tấm × 1.1 */
export const calculateRoofArea = (panelCount, panelArea = 2.7, marginFactor = 1.1) => {
  const n = parseInt(panelCount, 10) || 0;
  if (n <= 0) return 0;
  return Math.round(n * panelArea * marginFactor * 100) / 100;
};

/** Tách điện ngày / đêm theo tỷ lệ ban đêm (%) */
export const calculateDayNightConsumption = (targetDailyKwh, nightRatioPct = 60) => {
  const t = parseFloat(targetDailyKwh) || 0;
  let night = parseFloat(nightRatioPct);
  if (isNaN(night)) night = 60;
  night = Math.min(100, Math.max(0, night));
  const nightKwh = Math.round(((t * night) / 100) * 100) / 100;
  const dayKwh = Math.round((t - nightKwh) * 100) / 100;
  return { dayKwh, nightKwh, nightRatio: night, dayRatio: 100 - night };
};

/**
 * Dung lượng pin danh định = điện đêm / (DOD × hiệu suất pin)
 * Trả về { nominal, suggested, usable }:
 * - nominal: giá trị tính toán
 * - suggested: làm tròn lên theo module thương mại
 * - usable: điện dùng thực tế = suggested × DOD × eff (hoặc nominal × DOD × eff)
 */
export const calculateBatteryCapacity = (
  nightKwh,
  dod = SYSTEM_CONFIG.batteryDOD,
  efficiency = SYSTEM_CONFIG.batteryEfficiency,
  modules = SYSTEM_CONFIG.batteryModules
) => {
  const n = parseFloat(nightKwh) || 0;
  if (n <= 0) return { nominal: 0, suggested: 0, usable: 0 };
  const nominal = Math.round((n / (dod * efficiency)) * 100) / 100;
  const sorted = [...modules].sort((a, b) => a - b);
  let suggested = sorted.find((m) => m >= nominal);
  if (suggested == null) {
    suggested = Math.ceil(nominal / 5) * 5; // vượt 20 kWh → làm tròn lên bội số 5
  }
  const usable = Math.round(suggested * dod * efficiency * 100) / 100;
  return { nominal, suggested, usable };
};

/** Sản lượng ngày = công suất thực × PSH × hiệu suất × shading */
export const calculateDailyProduction = (actualCapacityKw, psh, systemEfficiency = 0.8, shadingFactor = 1.0) => {
  const c = parseFloat(actualCapacityKw) || 0;
  if (c <= 0) return 0;
  return Math.round(c * psh * systemEfficiency * shadingFactor * 100) / 100;
};

export const calculateMonthlyProduction = (dailyProduction, daysPerMonth = DAYS_PER_MONTH) =>
  Math.round(dailyProduction * daysPerMonth * 100) / 100;

export const calculateAnnualProduction = (dailyProduction) =>
  Math.round(dailyProduction * 365 * 100) / 100;

/** Công suất inverter đề xuất ≈ công suất thực (cần khảo sát tải thực tế) */
export const calculateInverterSize = (actualCapacityKw, margin = 1.0) => {
  const c = parseFloat(actualCapacityKw) || 0;
  if (c <= 0) return 0;
  return Math.round(c * margin * 100) / 100;
};

/**
 * Phân loại hệ thống theo nhu cầu (KHÔNG chỉ dựa vào tỷ lệ đêm).
 * - reduce + không mất điện + không backup → OnGrid
 * - backup / both → Hybrid
 * - mất điện thường xuyên → Hybrid
 * - unsure → Hybrid nếu đêm cao (>60%) hoặc mất điện, còn lại OnGrid + tư vấn
 */
export const calculateSystemType = ({ needs, hasBackup = false, frequentBlackouts, nightRatio = 60, hasEv = false, expandLoad = false } = {}) => {
  if (needs === "backup" || needs === "both" || hasBackup) {
    return {
      type: "Hybrid",
      reason: needs === "backup" || hasBackup
        ? "Khách cần điện dự phòng khi mất lưới → ưu tiên Hybrid có pin lưu trữ."
        : "Khách vừa tiết kiệm vừa dự phòng → ưu tiên Hybrid.",
    };
  }
  if (frequentBlackouts) {
    return {
      type: "Hybrid",
      reason: "Khu vực thường xuyên mất điện → ưu tiên Hybrid để có điện dự phòng.",
    };
  }
  if (needs === "reduce") {
    return {
      type: "OnGrid",
      reason: "Mục tiêu giảm tiền điện, không cần backup → ưu tiên On-grid tối ưu chi phí.",
    };
  }
  // unsure
  if (nightRatio > 60) {
    return {
      type: "Hybrid",
      reason: "Chưa xác định nhu cầu nhưng dùng điện đêm cao (>60%) → đề xuất Hybrid để dự phòng, cần tư vấn thêm.",
    };
  }
  let reason = "Chưa xác định rõ nhu cầu → tạm đề xuất On-grid, cần nhân viên tư vấn thêm.";
  if (hasEv || expandLoad) reason += " Lưu ý nhu cầu EV / mở rộng tải cần khảo sát công suất cụ thể.";
  return { type: "OnGrid", reason };
};

// ─────────────────────────────────────────────────────────────────────────────
// GIỮ LẠI (deprecated): lookup bảng cũ — không dùng trong luồng mới,
// chỉ giữ để không phá vỡ import cũ nếu nơi khác còn gọi.
// ─────────────────────────────────────────────────────────────────────────────
export const findSystemByBill = (monthlyBill) => {
  const bill = parseFloat(monthlyBill) || 0;
  if (bill <= 0) return SOLAR_SYSTEMS[0];
  let best = SOLAR_SYSTEMS[0];
  let bestDiff = Infinity;
  for (const sys of SOLAR_SYSTEMS) {
    const diff = Math.abs(sys.yearlySaving / 12 - bill);
    if (diff < bestDiff) { bestDiff = diff; best = sys; }
  }
  return best;
};

export const findSystemByRoof = (roofArea) => {
  const area = parseFloat(roofArea) || 0;
  if (area <= 0) return null;
  return SOLAR_SYSTEMS.filter((s) => s.roofArea <= area).at(-1) || null;
};

export const selectFinalSystem = (billSystem, roofSystem) => {
  const fallback = SOLAR_SYSTEMS[0];
  if (!billSystem) return { system: fallback, capped: false };
  if (!roofSystem) return { system: billSystem, capped: false };
  if (billSystem.capacity <= roofSystem.capacity) return { system: billSystem, capped: false };
  return { system: roofSystem, capped: true };
};

export const systemTypeFromRatio = (dayNightRatio) =>
  ((dayNightRatio ?? 60) / 100) > 0.3 ? "Hybrid" : "OnGrid";

export const getBatteryCapacity = (systemType, system) =>
  systemType === "Hybrid" ? system?.battery ?? 0 : 0;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SOLVER — tính động hoàn toàn
// ═══════════════════════════════════════════════════════════════════════════
export const calculateSolution = (formData = {}) => {
  const {
    regionId = "north",
    province = "",
    monthlyBill = 0,
    buildingType = "Home",
    needs = "",
    hasBackup = false,
    frequentBlackouts = false,
    hasEv = false,
    expandLoad = false,
    futureReservePct = 0,
    roofArea = 0,
    roofType = "",
    shading = "",
    panelWatt = DEFAULT_PANEL_WATT,
    dayNightRatio = 60,
    systemPhase = "",
  } = formData;

  const bill = parseFloat(monthlyBill) || 0;
  const roofM2 = parseFloat(roofArea) || 0;
  const reservePct = Math.min(100, Math.max(0, parseFloat(futureReservePct) || 0));
  const pWatt = parseFloat(panelWatt) || DEFAULT_PANEL_WATT;
  const panelDef = PANEL_OPTIONS.find((p) => p.watt === pWatt) || { watt: pWatt, area: SYSTEM_CONFIG.panelAreaEach };
  const panelArea = panelDef.area || SYSTEM_CONFIG.panelAreaEach;

  // ── PSH ──
  const { psh, source: pshSource } = getPshByRegion(regionId, province);
  const sysEff = SYSTEM_CONFIG.systemEfficiency;
  const shadingFactor = getShadingFactor(shading);

  // ── B2: bill → kWh ──
  const monthlyKwh = calculateMonthlyKwhFromBill(bill);
  const dailyKwh = calculateDailyConsumption(monthlyKwh);
  const targetDailyKwh = calculateTargetDailyConsumption(dailyKwh, reservePct);

  // ── Ngày / đêm ──
  const { dayKwh, nightKwh, nightRatio, dayRatio } = calculateDayNightConsumption(targetDailyKwh, dayNightRatio);

  // ── Công suất / tấm / mái ──
  const requiredKw = calculateSolarCapacity(targetDailyKwh, psh, sysEff, shadingFactor);
  const panelCount = calculatePanelCount(requiredKw, pWatt);
  const actualCapacityKw = calculateActualCapacity(panelCount, pWatt);
  const roofAreaNeeded = calculateRoofArea(panelCount, panelArea, SYSTEM_CONFIG.roofMarginFactor);

  // ── Sản lượng (từ công suất THỰC sau làm tròn) ──
  const dailyProduction = calculateDailyProduction(actualCapacityKw, psh, sysEff, shadingFactor);
  const monthlyProduction = calculateMonthlyProduction(dailyProduction);
  const annualProduction = calculateAnnualProduction(dailyProduction);
  const coverageRatio = targetDailyKwh > 0 ? Math.round((dailyProduction / targetDailyKwh) * 1000) / 10 : 0;

  // ── Loại hệ thống ──
  const { type: systemType, reason: systemReason } = calculateSystemType({
    needs, hasBackup, frequentBlackouts, nightRatio, hasEv, expandLoad,
  });
  const systemTypeInfo = SYSTEM_TYPES[systemType];

  // ── Pin: chỉ bắt buộc khi cần backup ──
  const needsBattery = systemType === "Hybrid";
  const battery = needsBattery
    ? calculateBatteryCapacity(nightKwh)
    : { nominal: 0, suggested: 0, usable: 0 };
  const batteryCapacity = battery.suggested;

  // ── Inverter ──
  const inverterKw = calculateInverterSize(actualCapacityKw, SYSTEM_CONFIG.inverterMargin);

  // ── Tiết kiệm ước tính theo biểu giá (không phải giá thiết bị) ──
  const avgPrice = monthlyKwh > 0 ? bill / monthlyKwh : 0;
  const offsetMonthlyKwh = Math.min(monthlyProduction, monthlyKwh);
  const monthlySavings = Math.round(offsetMonthlyKwh * avgPrice);
  const annualSavings = monthlySavings * 12;

  // ── Cảnh báo thông minh ──
  const warnings = [];
  if (roofM2 > 0 && roofAreaNeeded > roofM2) {
    warnings.push({
      type: "danger",
      message: `Diện tích mái không đủ: cần khoảng ${roofAreaNeeded} m² cho ${panelCount} tấm, nhưng mái chỉ có ${roofM2} m². Cần giảm mục tiêu, chọn tấm công suất lớn hơn hoặc khảo sát lắp bổ sung.`,
    });
  }
  if (shadingFactor <= 0.55) {
    warnings.push({
      type: "danger",
      message: "Mái bị che bóng nhiều — sản lượng giảm mạnh (~45%). Công suất đề xuất đã được bù trừ, nhưng nên khảo sát thực tế, tỉa cây / dời vật cản hoặc đổi vị trí giàn pin.",
    });
  } else if (shadingFactor < 1) {
    warnings.push({
      type: "warning",
      message: `Mái che bóng một phần (hệ số ${shadingFactor}). Sản lượng dự kiến đã trừ hao, công suất và số tấm đã bù tương ứng.`,
    });
  }
  if (needsBattery && nightKwh > 0 && battery.usable < nightKwh) {
    warnings.push({
      type: "warning",
      message: `Pin ${battery.suggested} kWh cho ra ~${battery.usable} kWh dùng được, thấp hơn nhu cầu đêm ${nightKwh} kWh/ngày. Đêm thiếu điện sẽ lấy thêm từ lưới — cần cân nhắc nâng dung lượng.`,
    });
  }
  if (!needsBattery && nightRatio > 50) {
    warnings.push({
      type: "warning",
      message: `Tỷ lệ dùng điện ban đêm cao (${nightRatio}%). Hệ On-grid không cấp điện độc lập ban đêm nếu không có pin — nên cân nhắc Hybrid nếu muốn dùng tối.`,
    });
  }
  if (frequentBlackouts && systemType === "OnGrid") {
    warnings.push({
      type: "warning",
      message: "Khu vực thường xuyên mất điện nhưng hệ đề xuất là On-grid (mất lưới là mất điện). Nên chuyển sang Hybrid để dự phòng.",
    });
  }
  if (frequentBlackouts && systemType === "Hybrid") {
    warnings.push({
      type: "info",
      message: "Đã ưu tiên Hybrid vì khu vực hay mất điện — pin lưu trữ sẽ cấp tải ưu tiên khi mất lưới.",
    });
  }
  if (psh <= 3.0) {
    warnings.push({
      type: "info",
      message: `Khu vực giờ nắng thấp (~${psh}h/ngày). Sản lượng tính theo PSH vùng — mùa đông / mưa kéo dài có thể thấp hơn, cần khảo sát thực tế.`,
    });
  }
  if (hasEv) {
    warnings.push({
      type: "info",
      message: "Đã ghi nhận nhu cầu sạc xe điện (EV) nhưng chưa có dữ liệu công suất sạc cụ thể — cần khảo sát thêm quãng đường / bộ sạc để cộng tải.",
    });
  }
  if (expandLoad) {
    warnings.push({
      type: "info",
      message: `Đã cộng dự phòng ${reservePct}% cho mở rộng tải tương lai. Nếu lắp thêm nhiều thiết bị, nên chừa sẵn công suất inverter và diện tích mái.`,
    });
  }
  if (systemType === "Hybrid") {
    warnings.push({
      type: "info",
      message: "Công suất inverter đề xuất tương đương công suất giàn pin — công suất chịu tải thực tế (điều hòa, bơm, sạc EV cùng lúc) cần khảo sát tại chỗ.",
    });
  } else {
    warnings.push({
      type: "info",
      message: "Hệ On-grid không có điện dự phòng khi mất lưới — muốn dùng khi cúp điện cần chuyển sang Hybrid có pin lưu trữ.",
    });
  }

  const region = REGIONS.find((r) => r.id === regionId)?.label || "";

  return {
    // A. Thông số hệ thống
    systemType,
    systemTypeInfo,
    systemReason,
    capacityKw: actualCapacityKw,
    requiredKw,
    actualCapacityKw,
    panelWatt: pWatt,
    panelCount,
    panelAreaEach: panelArea,
    roofAreaNeeded,
    roofAreaUsed: roofAreaNeeded,
    roofAreaAvailable: roofM2,
    roofOk: roofM2 <= 0 ? true : roofAreaNeeded <= roofM2,
    batteryNominal: battery.nominal,
    batterySuggested: battery.suggested,
    batteryUsable: battery.usable,
    batteryCapacity, // alias cũ
    hasBattery: needsBattery,
    inverterKw,
    phases: systemPhase,

    // B. Nhu cầu
    monthlyBill: bill,
    monthlyKwh,
    dailyKwh,
    targetDailyKwh,
    reservePct,
    dayKwh,
    nightKwh,
    nightRatio,
    dayRatio,
    avgPricePerKwh: Math.round(avgPrice),

    // C. Hiệu quả
    dailyProduction,
    monthlyProduction,
    annualProduction,
    coverageRatio,
    psh,
    pshSource,
    systemEfficiency: sysEff,
    shading,
    shadingFactor,

    // D. Chi phí — chưa có bảng giá thiết bị → liên hệ khảo sát
    systemCost: null,
    paybackYears: null,
    paybackChart: [],
    monthlySavings,
    annualSavings,

    warnings,
    region,
    province,
    buildingType,
  };
};

// ── Self-test với bộ dữ liệu mẫu (mục 12) ────────────────────────────────
// bill 1.400.000đ, PSH 2.5, eff 100%, tấm 620Wp/2.7m², đêm 60%,
// DOD 90%, pin eff 90% → required 6.89 kWp, 12 tấm, thực 7.44 kWp,
// mái 35.64 m², đêm 10.33 kWh, pin 12.75 kWh.
export const SAMPLE_TEST_CASE = {
  monthlyBill: 1400000,
  psh: 2.5,
  systemEfficiency: 1.0,
  panelWatt: 620,
  panelArea: 2.7,
  nightRatio: 60,
  dod: 0.9,
  batteryEff: 0.9,
};

export const runSampleTest = () => {
  const monthlyKwh = calculateMonthlyKwhFromBill(SAMPLE_TEST_CASE.monthlyBill);
  const daily = calculateDailyConsumption(monthlyKwh);
  const target = calculateTargetDailyConsumption(daily, 0);
  const required = calculateSolarCapacity(target, SAMPLE_TEST_CASE.psh, SAMPLE_TEST_CASE.systemEfficiency, 1.0);
  const count = calculatePanelCount(required, SAMPLE_TEST_CASE.panelWatt);
  const actual = calculateActualCapacity(count, SAMPLE_TEST_CASE.panelWatt);
  const roof = calculateRoofArea(count, SAMPLE_TEST_CASE.panelArea, 1.1);
  const { nightKwh } = calculateDayNightConsumption(target, SAMPLE_TEST_CASE.nightRatio);
  const batt = calculateBatteryCapacity(nightKwh, SAMPLE_TEST_CASE.dod, SAMPLE_TEST_CASE.batteryEff);
  return { monthlyKwh, daily, target, required, count, actual, roof, nightKwh, battNominal: batt.nominal };
};
