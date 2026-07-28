// ============================================
// SOLAR CALCULATOR DATA
// Provinces, regions, and calculation logic
// Điện Mặt Trời Nhật Minh
// ============================================

export const REGIONS = [
  {
    id: "north",
    label: "Miền Bắc",
    icon: "🏔️",
    provinces: [
      "Hà Nội", "Hải Phòng", "Hải Dương", "Hưng Yên", "Thái Bình",
      "Nam Định", "Ninh Bình", "Bắc Ninh", "Bắc Giang", "Lạng Sơn",
      "Quảng Ninh", "Hòa Bình", "Vĩnh Phúc", "Phú Thọ", "Thái Nguyên",
      "Lào Cai", "Yên Bái", "Điện Biên", "Lai Châu", "Sơn La",
      "Hà Giang", "Tuyên Quang", "Cao Bằng", "Bắc Kạn", "Thanh Hóa",
      "Nghệ An", "Hà Tĩnh",
    ],
  },
  {
    id: "central",
    label: "Miền Trung",
    icon: "🏯",
    provinces: [
      "Đà Nẵng", "Quảng Nam", "Quảng Ngãi", "Bình Định", "Phú Yên",
      "Khánh Hòa", "Ninh Thuận", "Bình Thuận", "Thừa Thiên Huế",
      "Quảng Trị", "Thừa Thiên Huế", "Gia Lai", "Đắk Lắk", "Đắk Nông",
      "Lâm Đồng",
    ],
  },
  {
    id: "south",
    label: "Miền Nam",
    icon: "🌴",
    provinces: [
      "Hồ Chí Minh", "Bình Dương", "Đồng Nai", "Bà Rịa – Vũng Tàu",
      "Long An", "Tiền Giang", "Bến Tre", "Trà Vinh", "Vĩnh Long",
      "Đồng Tháp", "An Giang", "Kiên Giang", "Hậu Giang", "Sóc Trăng",
      "Bạc Liêu", "Cà Mau", "Cần Thơ",
    ],
  },
];

// Average solar irradiance by region (kWh/m²/day)
export const IRRADIANCE = {
  north: 3.8,
  central: 4.8,
  south: 5.2,
};

// Electricity price tiers in Vietnam (VND/kWh, EVN tariff 2024)
export const EVN_TARIFF = {
  rate1: 1678,  // 0-50 kWh
  rate2: 1734,  // 51-100 kWh
  rate3: 2014,  // 101-200 kWh
  rate4: 2536,  // 201-300 kWh
  rate5: 2834,  // 301-400 kWh
  rate6: 2927,  // 401+ kWh
};

// Average electricity price by building type (VND/kWh)
export const AVG_ELECTRICITY_PRICE = {
  Home: 2900,
  Business: 3200,
  Factory: 2700,
};

// Panel specs (using common 550Wp panel)
export const PANEL_WP = 550;
export const PANEL_AREA_M2 = 2.2; // ~2.2 m² per panel
export const SYSTEM_LOSS = 0.75; // 75% efficiency after all losses
export const HOURS_PER_MONTH = 730; // ~730 hours/month average
export const MONTHS_PER_YEAR = 12;

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
    batteryCapacity: 5, // kWh default
    color: "bg-amber-100 text-amber-700",
  },
  OffGrid: {
    label: "Off-grid",
    description: "Độc lập hoàn toàn — cần pin lưu trữ",
    hasBattery: true,
    batteryCapacity: 10,
    color: "bg-slate-100 text-slate-700",
  },
};

// ROOF SHADING FACTORS
export const SHADING_FACTOR = {
  "Không đáng kể": 1.0,
  "Một phần": 0.8,
  "Nhiều": 0.55,
  "Chưa rõ": 0.75,
};

// ELECTRICITY RATE TIER (for result display)
export const getAvgElectricityRate = (buildingType) => {
  return AVG_ELECTRICITY_PRICE[buildingType] || 2900;
};

// ESTIMATE MONTHLY KWH from monthly bill
export const estimateMonthlyKwh = (monthlyBill, buildingType) => {
  const rate = getAvgElectricityRate(buildingType);
  return Math.round(monthlyBill / rate);
};

// ESTIMATE SYSTEM CAPACITY
export const estimateCapacity = ({
  monthlyBill,
  buildingType,
  regionId,
  shadingFactor = 0.75,
  monthlyUsageOverride = null,
}) => {
  const irradiance = IRRADIANCE[regionId] || 4.0;
  const rate = getAvgElectricityRate(buildingType);

  // Monthly kWh needed to offset the bill
  const monthlyKwh = monthlyUsageOverride || estimateMonthlyKwh(monthlyBill, buildingType);

  // Monthly production per kWp in this region
  // kWh/month per kWp = irradiance × hours/month × loss factor
  const monthlyProductionPerKw = irradiance * HOURS_PER_MONTH * SYSTEM_LOSS * shadingFactor;

  // System capacity needed
  const capacityKw = monthlyKwh / monthlyProductionPerKw;

  return Math.max(1, Math.ceil(capacityKw * 10) / 10); // Round to nearest 0.1 kWp
};

// ESTIMATE NUMBER OF PANELS
export const estimatePanelCount = (capacityKw) => {
  return Math.ceil((capacityKw * 1000) / PANEL_WP);
};

// ESTIMATE MONTHLY PRODUCTION
export const estimateMonthlyProduction = (capacityKw, regionId, shadingFactor = 0.75) => {
  const irradiance = IRRADIANCE[regionId] || 4.0;
  return Math.round(capacityKw * irradiance * HOURS_PER_MONTH * SYSTEM_LOSS * shadingFactor);
};

// ESTIMATE ANNUAL PRODUCTION
export const estimateAnnualProduction = (capacityKw, regionId, shadingFactor = 0.75) => {
  return estimateMonthlyProduction(capacityKw, regionId, shadingFactor) * MONTHS_PER_YEAR;
};

// ESTIMATE ROOF AREA NEEDED
export const estimateRoofArea = (panelCount) => {
  return Math.round(panelCount * PANEL_AREA_M2 * 10) / 10;
};

// ESTIMATE SYSTEM COST
const COST_PER_WP = {
  OnGrid: 14000,     // VND per Wp
  Hybrid: 22000,     // VND per Wp (includes battery)
  OffGrid: 28000,    // VND per Wp (large battery system)
};

export const estimateSystemCost = (capacityKw, systemType) => {
  const costPerWp = COST_PER_WP[systemType] || 14000;
  const systemCost = capacityKw * 1000 * costPerWp;
  const installationCost = systemCost * 0.15; // 15% installation labor
  return Math.round(systemCost + installationCost);
};

// ESTIMATE BATTERY CAPACITY (for Hybrid/OffGrid)
export const estimateBatteryCapacity = (capacityKw, nightUsageRatio, systemType) => {
  if (systemType === "OnGrid") return 0;
  if (systemType === "OffGrid") return Math.max(5, Math.ceil(capacityKw * 2));
  // Hybrid: store ~30% of daily production
  return Math.max(5, Math.ceil(capacityKw * 1.5));
};

// ESTIMATE ANNUAL SAVINGS
export const estimateAnnualSavings = (annualProduction, buildingType) => {
  const rate = getAvgElectricityRate(buildingType);
  return Math.round(annualProduction * rate);
};

// ESTIMATE PAYBACK PERIOD
export const estimatePaybackYears = (systemCost, annualSavings) => {
  if (annualSavings <= 0) return 99;
  return Math.round((systemCost / annualSavings) * 10) / 10;
};

// DETERMINE RECOMMENDED SYSTEM TYPE
export const recommendSystemType = ({
  needsBackup,
  hasEv,
  nightUsageRatio,
  frequentBlackouts,
}) => {
  if (needsBackup || hasEv || frequentBlackouts) return "Hybrid";
  if (nightUsageRatio > 0.6) return "Hybrid";
  return "OnGrid";
};

// MAIN CALCULATOR FUNCTION
export const calculateSolution = (formData) => {
  const {
    regionId,
    monthlyBill,
    buildingType,
    needs,
    roofType,
    roofArea,
    shading,
    dayNightRatio,
    systemPhase,
    hasBackup,
    hasEv,
    frequentBlackouts,
    expandLoad,
  } = formData;

  const region = REGIONS.find((r) => r.id === regionId);
  const shadingFactor = SHADING_FACTOR[shading] ?? 0.75;
  const nightUsageRatio = (dayNightRatio ?? 40) / 100;

  // Determine system type
  const systemType = recommendSystemType({
    needsBackup: needs === "backup" || needs === "both",
    hasEv,
    nightUsageRatio,
    frequentBlackouts,
  });

  // Capacity
  const capacityKw = estimateCapacity({
    monthlyBill,
    buildingType,
    regionId,
    shadingFactor,
  });

  // Adjust capacity if has EV or expanding load
  const adjustedCapacity = hasEv || expandLoad
    ? Math.max(capacityKw, Math.ceil(capacityKw * 1.3 * 10) / 10)
    : capacityKw;

  const panelCount = estimatePanelCount(adjustedCapacity);
  const monthlyProduction = estimateMonthlyProduction(adjustedCapacity, regionId, shadingFactor);
  const annualProduction = monthlyProduction * MONTHS_PER_YEAR;
  const roofAreaNeeded = estimateRoofArea(panelCount);
  const batteryCapacity = estimateBatteryCapacity(adjustedCapacity, nightUsageRatio, systemType);
  const systemCost = estimateSystemCost(adjustedCapacity, systemType);
  const annualSavings = estimateAnnualSavings(annualProduction, buildingType);
  const paybackYears = estimatePaybackYears(systemCost, annualSavings);

  // Monthly bill offset
  const monthlySavings = Math.round(annualSavings / 12);

  // Warnings
  const warnings = [];
  if (roofArea && roofAreaNeeded > roofArea) {
    warnings.push({
      type: "danger",
      message: `Diện tích mái hiện tại (${roofArea} m²) không đủ cho hệ thống ${adjustedCapacity} kWp (cần ${roofAreaNeeded} m²). Bạn có thể cần giảm công suất hoặc bổ sung thêm không gian.`,
    });
  }
  if (nightUsageRatio > 0.5 && systemType === "OnGrid") {
    warnings.push({
      type: "warning",
      message: `Tỷ lệ dùng điện ban đêm của bạn khá cao (${Math.round(nightUsageRatio * 100)}%). Hệ On-grid chỉ hoạt động khi có ánh sáng. Bạn nên cân nhắc hệ Hybrid để lưu trữ điện ban ngày dùng ban đêm.`,
    });
  }
  if (systemType === "Hybrid" && paybackYears > 8) {
    warnings.push({
      type: "info",
      message: `Chi phí pin lưu trữ làm thời gian hoàn vốn kéo dài thêm. Nếu không cần dự phòng, hệ On-grid sẽ hoàn vốn nhanh hơn.`,
    });
  }

  // Payback chart data (year vs cumulative savings)
  const paybackChart = [];
  for (let year = 0; year <= Math.ceil(paybackYears) + 3; year++) {
    const savings = year * annualSavings;
    paybackChart.push({
      year,
      savings: Math.min(savings, systemCost * 1.5),
      invested: systemCost,
    });
  }

  return {
    systemType,
    systemTypeInfo: SYSTEM_TYPES[systemType],
    capacityKw: adjustedCapacity,
    panelCount,
    batteryCapacity,
    monthlyProduction,
    annualProduction,
    roofAreaNeeded,
    monthlySavings,
    annualSavings,
    systemCost,
    paybackYears,
    paybackChart,
    warnings,
    region: region?.label || "",
    buildingType,
    monthlyBill,
    shadingFactor,
    nightUsageRatio,
  };
};
