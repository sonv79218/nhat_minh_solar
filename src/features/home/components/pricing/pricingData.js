// ============================================
// PRICING DATA — Bảng giá giải pháp điện mặt trời
// Điện Mặt Trời Nhật Minh
//
// Cách sử dụng:
//   - Mỗi nhóm đại diện cho một mức hóa đơn điện hàng tháng
//   - Mỗi gói có trường solutionGroup: "home" | "business" | "farm"
//   - Chỉnh sửa tại đây để cập nhật giá và thông số cho toàn bộ website
//
// Lưu ý:
//   - Giá trọn gói (price) là placeholder — cập nhật theo báo giá thực tế
//   - Hình ảnh (image) là placeholder — thay bằng ảnh công trình thực tế
// ============================================

// ── Nhóm 1: Hóa đơn 1,5–3,5 triệu ──────────────────────────────
// solutionGroup: home
export const GROUP_1 = {
  id: "1-3.5m",
  label: "Hóa đơn 1,5–3,5 triệu",
  shortLabel: "1,5–3,5 triệu",
  description: "Gói giải pháp cho hộ gia đình có mức tiêu thụ điện trung bình, phù hợp với căn hộ chung cư và nhà ở diện tích nhỏ.",
  badge: "Gia đình",
  badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
  icon: "🏠",
  billRange: "1.500.000 – 3.500.000 VNĐ/tháng",
  phase: "1 pha",
  packages: [
    {
      id: "g1-ongrid-3",
      name: "Tiết kiệm Cơ bản 3kW",
      tag: "On-grid",
      tagColor: "bg-blue-50 text-blue-600",
      hasStorage: false,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
      capacityKw: 3,
      storageKwh: 0,
      panelBrand: "Longi",
      inverterBrand: "Huawei",
      batteryBrand: null,
      specs: ["9 tấm pin Longi 380Wp", "Inverter Huawei 3kW", "Giàn giá nhôm anodized", "Dây cáp, CB bảo vệ"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 4500,
      monthlyBillRange: "1,5 – 2 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
    {
      id: "g1-ongrid-5",
      name: "Tiết kiệm Tiêu chuẩn 5kW",
      tag: "On-grid",
      tagColor: "bg-blue-50 text-blue-600",
      hasStorage: false,
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
      capacityKw: 5,
      storageKwh: 0,
      panelBrand: "Canadian Solar",
      inverterBrand: "SMA",
      batteryBrand: null,
      specs: ["10 tấm pin Canadian Solar 550Wp", "Inverter SMA 5kW", "Giàn giá nhôm chống gỉ", "Giám sát online qua app"],
      warranty: "Bảo hành 15 năm",
      annualKwh: 7500,
      monthlyBillRange: "2 – 3 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: true,
    },
    {
      id: "g1-hybrid-5",
      name: "Tiết kiệm Hybrid 5kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
      capacityKw: 5,
      storageKwh: 5,
      panelBrand: "AE Solar",
      inverterBrand: "Deye",
      batteryBrand: "Pylontech",
      specs: ["10 tấm pin AE Solar 550Wp", "Inverter Hybrid Deye 5kW", "Pin Pylontech US5000 5kWh", "Lưu trữ điện dùng ban đêm"],
      warranty: "Bảo hành 10 năm",
      annualKwh: 7500,
      monthlyBillRange: "2,5 – 3,5 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
  ],
};

// ── Nhóm 2: Hóa đơn 3,5–5,5 triệu ──────────────────────────────
// solutionGroup: home
export const GROUP_2 = {
  id: "3.5-5.5m",
  label: "Hóa đơn 3,5–5,5 triệu",
  shortLabel: "3,5–5,5 triệu",
  description: "Giải pháp cho hộ gia đình có nhu cầu sử dụng điện cao hơn, phù hợp với nhà phố, biệt thự hoặc hộ kinh doanh nhỏ.",
  badge: "Gia đình +",
  badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
  icon: "🏡",
  billRange: "3.500.000 – 5.500.000 VNĐ/tháng",
  phase: "1 pha",
  packages: [
    {
      id: "g2-ongrid-8",
      name: "Tiết kiệm Nâng cao 8kW",
      tag: "On-grid",
      tagColor: "bg-blue-50 text-blue-600",
      hasStorage: false,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
      capacityKw: 8,
      storageKwh: 0,
      panelBrand: "Longi",
      inverterBrand: "Huawei",
      batteryBrand: null,
      specs: ["16 tấm pin Longi 550Wp", "Inverter Huawei 8kW", "Giàn giá nhôm anodized", "Giám sát thông minh"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 12000,
      monthlyBillRange: "3,5 – 4,5 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
    {
      id: "g2-hybrid-8",
      name: "Hybrid Cân bằng 8kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
      capacityKw: 8,
      storageKwh: 10,
      panelBrand: "Canadian Solar",
      inverterBrand: "Huawei",
      batteryBrand: "SolarX",
      specs: ["16 tấm pin Canadian Solar 550Wp", "Inverter Hybrid Huawei 8kW", "Pin SolarX 10kWh Lithium", "Tự động chuyển nguồn khi mất điện"],
      warranty: "Bảo hành 10 năm",
      annualKwh: 12000,
      monthlyBillRange: "4 – 5 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: true,
    },
    {
      id: "g2-hybrid-10",
      name: "Hybrid Plus 10kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
      capacityKw: 10,
      storageKwh: 10,
      panelBrand: "AE Solar",
      inverterBrand: "Deye",
      batteryBrand: "Pylontech",
      specs: ["20 tấm pin AE Solar 550Wp", "Inverter Hybrid Deye 10kW", "Pin Pylontech US5000 10kWh", "Giám sát online, cảnh báo app"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 15000,
      monthlyBillRange: "4,5 – 5,5 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
  ],
};

// ── Nhóm 3: Hóa đơn 5,5–8 triệu ────────────────────────────────
// solutionGroup: business | farm (mixed — filter by capacity)
export const GROUP_3 = {
  id: "5.5-8m",
  label: "Hóa đơn 5,5–8 triệu",
  shortLabel: "5,5–8 triệu",
  description: "Gói cho hộ gia đình có mức tiêu thụ cao hoặc hộ kinh doanh nhỏ, cần công suất lớn và hệ thống ổn định.",
  badge: "Kinh doanh",
  badgeColor: "bg-purple-50 text-purple-600 border-purple-100",
  icon: "🏪",
  billRange: "5.500.000 – 8.000.000 VNĐ/tháng",
  phase: "1 pha / 3 pha",
  packages: [
    {
      id: "g3-ongrid-10",
      name: "Tiết kiệm Tối ưu 10kW",
      tag: "On-grid",
      tagColor: "bg-blue-50 text-blue-600",
      hasStorage: false,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
      capacityKw: 10,
      storageKwh: 0,
      panelBrand: "Longi",
      inverterBrand: "Huawei",
      batteryBrand: null,
      specs: ["20 tấm pin Longi 550Wp", "Inverter Huawei 10kW", "Giàn giá nhôm anodized", "Giám sát thông minh online"],
      warranty: "Bảo hành 15 năm",
      annualKwh: 15000,
      monthlyBillRange: "5,5 – 7 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
    {
      id: "g3-hybrid-10",
      name: "Hybrid Pro 10kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
      capacityKw: 10,
      storageKwh: 15,
      panelBrand: "Canadian Solar",
      inverterBrand: "Huawei",
      batteryBrand: "SolarX",
      specs: ["20 tấm pin Canadian Solar 550Wp", "Inverter Hybrid Huawei 10kW", "Pin SolarX 15kWh Lithium", "Lưu trữ đủ cho ban đêm"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 15000,
      monthlyBillRange: "6 – 7,5 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: true,
    },
    {
      id: "g3-hybrid-15",
      name: "Hybrid Công suất 15kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
      capacityKw: 15,
      storageKwh: 15,
      panelBrand: "AE Solar",
      inverterBrand: "Deye",
      batteryBrand: "Pylontech",
      specs: ["30 tấm pin AE Solar 550Wp", "Inverter Hybrid Deye 15kW", "Pin Pylontech 15kWh", "Phù hợp kinh doanh nhỏ"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 22500,
      monthlyBillRange: "7 – 8 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha / 3 pha",
      highlight: false,
    },
  ],
};

// ── Nhóm 4: Hóa đơn 8–20 triệu ────────────────────────────────
// solutionGroup: business | farm (mixed)
export const GROUP_4 = {
  id: "8-20m",
  label: "Hóa đơn 8–20 triệu",
  shortLabel: "8–20 triệu",
  description: "Giải pháp công suất lớn cho doanh nghiệp, nhà xưởng, khách sạn và các công trình có mức tiêu thụ điện cao.",
  badge: "Doanh nghiệp",
  badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
  icon: "🏢",
  billRange: "8.000.000 – 20.000.000 VNĐ/tháng",
  phase: "3 pha",
  packages: [
    {
      id: "g4-ongrid-20",
      name: "Doanh nghiệp 20kW",
      tag: "On-grid",
      tagColor: "bg-blue-50 text-blue-600",
      hasStorage: false,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
      capacityKw: 20,
      storageKwh: 0,
      panelBrand: "Longi",
      inverterBrand: "SMA",
      batteryBrand: null,
      specs: ["40 tấm pin Longi 550Wp", "Inverter SMA 20kW", "Hệ thống giám sát SCADA", "Tích hợp điện lưới 3 pha"],
      warranty: "Bảo hành 15 năm",
      annualKwh: 30000,
      monthlyBillRange: "8 – 12 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "3 pha",
      highlight: false,
    },
    {
      id: "g4-hybrid-20",
      name: "Doanh nghiệp Hybrid 20kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
      capacityKw: 20,
      storageKwh: 20,
      panelBrand: "Canadian Solar",
      inverterBrand: "Huawei",
      batteryBrand: "SolarX",
      specs: ["40 tấm pin Canadian Solar 550Wp", "Inverter Hybrid Huawei 20kW", "Pin SolarX 20kWh", "Dự phòng khi mất điện"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 30000,
      monthlyBillRange: "10 – 15 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "3 pha",
      highlight: true,
    },
    {
      id: "g4-hybrid-30",
      name: "Doanh nghiệp Hybrid 30kWh",
      tag: "Hybrid",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
      capacityKw: 30,
      storageKwh: 30,
      panelBrand: "AE Solar",
      inverterBrand: "Deye",
      batteryBrand: "Pylontech",
      specs: ["60 tấm pin AE Solar 550Wp", "Inverter Hybrid Deye 30kW", "Pin Pylontech 30kWh", "Độc lập tải lớn"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 45000,
      monthlyBillRange: "14 – 20 triệu",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "3 pha",
      highlight: false,
    },
  ],
};

// ── Nhóm 5: Hệ bám tải và độc lập ─────────────────────────────
// solutionGroup: farm (backup + offgrid)
export const GROUP_5 = {
  id: "backup-offgrid",
  label: "Hệ bám tải & độc lập",
  shortLabel: "Bám tải & Độc lập",
  description: "Hệ thống được thiết kế để hoạt động bám tải hoặc hoàn toàn độc lập khỏi lưới điện quốc gia, phù hợp vùng hay mất điện hoặc không có lưới.",
  badge: "Độc lập",
  badgeColor: "bg-red-50 text-red-600 border-red-100",
  icon: "🔋",
  billRange: "Tùy công suất sử dụng",
  phase: "1 pha / 3 pha",
  packages: [
    {
      id: "g5-backup-10",
      name: "Bám tải 10kWh",
      tag: "Backup",
      tagColor: "bg-amber-50 text-amber-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
      capacityKw: 10,
      storageKwh: 15,
      panelBrand: "Longi",
      inverterBrand: "Deye",
      batteryBrand: "Pylontech",
      specs: ["20 tấm pin Longi 550Wp", "Inverter Hybrid Deye 10kW", "Pin Pylontech 15kWh", "Tự động chuyển khi mất điện"],
      warranty: "Bảo hành 10 năm",
      annualKwh: 15000,
      monthlyBillRange: "Tùy mức sử dụng",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "1 pha",
      highlight: false,
    },
    {
      id: "g5-offgrid-15",
      name: "Độc lập hoàn toàn 15kWh",
      tag: "Off-grid",
      tagColor: "bg-purple-50 text-purple-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80",
      capacityKw: 15,
      storageKwh: 20,
      panelBrand: "Canadian Solar",
      inverterBrand: "Victron",
      batteryBrand: "Pylontech",
      specs: ["30 tấm pin Canadian Solar 550Wp", "Inverter Off-grid Victron", "Pin Pylontech 20kWh", "Không cần lưới điện"],
      warranty: "Bảo hành 10 năm",
      annualKwh: 22500,
      monthlyBillRange: "Hoàn toàn tự chủ",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "3 pha",
      highlight: true,
    },
    {
      id: "g5-offgrid-30",
      name: "Độc lập Công nghiệp 30kWh",
      tag: "Off-grid",
      tagColor: "bg-purple-50 text-purple-600",
      hasStorage: true,
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
      capacityKw: 30,
      storageKwh: 40,
      panelBrand: "AE Solar",
      inverterBrand: "Victron",
      batteryBrand: "SolarX",
      specs: ["60 tấm pin AE Solar 550Wp", "Inverter Off-grid Victron 30kW", "Pin SolarX 40kWh", "Cấp điện hoàn toàn độc lập"],
      warranty: "Bảo hành 12 năm",
      annualKwh: 45000,
      monthlyBillRange: "Hoàn toàn tự chủ",
      price: null,
      priceNote: "Liên hệ báo giá",
      phase: "3 pha",
      highlight: false,
    },
  ],
};

// ── Tất cả nhóm ──────────────────────────────────────────────
export const ALL_GROUPS = [GROUP_1, GROUP_2, GROUP_3, GROUP_4, GROUP_5];

// ── Tất cả gói (flat) ────────────────────────────────────────
export const ALL_PACKAGES = ALL_GROUPS.flatMap((g) => g.packages);

// ── Filter: theo solutionGroup ──────────────────────────────
// HOME: GROUP_1 + GROUP_2 + gói 1 pha ≤10kW trong GROUP_3
export const HOME_PACKAGES = ALL_PACKAGES.filter(
  (p) =>
    p.id.startsWith("g1-") ||
    p.id.startsWith("g2-") ||
    (p.id.startsWith("g3-") && p.phase.includes("1 pha") && p.capacityKw <= 10)
);

// BUSINESS: gói 3 pha trong GROUP_3 + GROUP_4
export const BUSINESS_PACKAGES = ALL_PACKAGES.filter(
  (p) =>
    (p.id.startsWith("g3-") && (p.phase.includes("3 pha") || p.capacityKw >= 15)) ||
    p.id.startsWith("g4-")
);

// FARM: GROUP_5 + các gói 3 pha ≥20kW trong GROUP_4
export const FARM_PACKAGES = ALL_PACKAGES.filter(
  (p) =>
    p.id.startsWith("g5-") ||
    (p.id.startsWith("g4-") && p.capacityKw >= 20)
);

// ── Filter options (dùng chung) ─────────────────────────────
export const FILTER_BILL_RANGES = [
  { id: "all", label: "Tất cả mức hóa đơn" },
  { id: "1-3.5m", label: "1,5 – 3,5 triệu" },
  { id: "3.5-5.5m", label: "3,5 – 5,5 triệu" },
  { id: "5.5-8m", label: "5,5 – 8 triệu" },
  { id: "8-20m", label: "8 – 20 triệu" },
  { id: "backup-offgrid", label: "Bám tải & Độc lập" },
];

export const FILTER_STORAGE = [
  { id: "all", label: "Tất cả" },
  { id: "with-storage", label: "Có lưu trữ" },
  { id: "no-storage", label: "Không lưu trữ" },
];

export const FILTER_PHASE = [
  { id: "all", label: "Tất cả pha" },
  { id: "1-ph", label: "1 pha" },
  { id: "3-ph", label: "3 pha" },
];

export const INITIAL_FILTERS = {
  billRange: "all",
  storage: "all",
  phase: "all",
};

// ── Solution category definitions ────────────────────────────
export const SOLUTION_CATEGORIES = [
  {
    id: "solar-home",
    label: "Điện mặt trời gia đình",
    shortLabel: "Gia đình",
    description:
      "Hệ thống điện mặt trời dành cho hộ gia đình: căn hộ, nhà phố, biệt thự. Công suất 3kW–15kW, tiết kiệm 50–90% tiền điện hàng tháng, bảo hành 10–15 năm.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    targets: ["Gia đình 2–6 người", "Căn hộ chung cư", "Nhà phố, biệt thự", "Hộ kinh doanh nhỏ"],
    cta: { label: "Xem giải pháp gia đình", href: "/solutions/solar-home" },
    pkgCount: 9,
  },
  {
    id: "solar-business",
    label: "Điện mặt trời doanh nghiệp",
    shortLabel: "Doanh nghiệp",
    description:
      "Hệ thống công suất lớn cho doanh nghiệp: nhà xưởng, văn phòng, khách sạn, khu thương mại. Công suất 10kW–50kW, hoàn vốn nhanh, giảm 30–50% chi phí vận hành.",
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1200&q=80",
    targets: ["Nhà xưởng, kho bãi", "Văn phòng, tòa nhà", "Khách sạn, nhà hàng", "Khu thương mại"],
    cta: { label: "Xem giải pháp doanh nghiệp", href: "/solutions/solar-business" },
    pkgCount: 6,
  },
  {
    id: "solar-farm",
    label: "Điện mặt trời trang trại",
    shortLabel: "Trang trại",
    description:
      "Hệ thống điện mặt trời cho trang trại, khu nông nghiệp và vùng không có lưới điện. Hệ bám tải và độc lập (Off-grid), tự chủ năng lượng, phù hợp vùng hay mất điện.",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1200&q=80",
    targets: ["Trang trại nông nghiệp", "Vùng không có lưới điện", "Khu công nghiệp", "Hệ thống dự phòng công suất lớn"],
    cta: { label: "Xem giải pháp trang trại", href: "/solutions/solar-farm" },
    pkgCount: 6,
  },
];
