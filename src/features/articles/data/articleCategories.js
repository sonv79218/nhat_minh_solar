// ============================================
// ARTICLE CATEGORIES - CONSTANTS
// Điện Mặt Trời Nhật Minh
// Danh mục nội dung mặc định. Admin có thể thêm/sửa trong Firestore
// (collection: article_categories). Nếu collection rỗng thì dùng danh sách này.
// ============================================

export const DEFAULT_CATEGORIES = [
  {
    id: "cong-trinh-dien-mat-troi",
    name: "Công trình điện mặt trời",
    slug: "cong-trinh-dien-mat-troi",
    description: "Các dự án Nhật Minh đã triển khai thực tế cho khách hàng.",
    icon: "Building2",
    order: 1,
  },
  {
    id: "dien-mat-troi-hoa-luoi",
    name: "Điện mặt trời hòa lưới",
    slug: "dien-mat-troi-hoa-luoi",
    description: "Kiến thức và giải pháp hệ thống điện mặt trời hòa lưới.",
    icon: "Zap",
    order: 2,
  },
  {
    id: "dien-mat-troi-hybrid",
    name: "Điện mặt trời Hybrid",
    slug: "dien-mat-troi-hybrid",
    description: "Hệ thống kết hợp điện lưới và pin lưu trữ năng lượng.",
    icon: "BatteryCharging",
    order: 3,
  },
  {
    id: "dien-mat-troi-doc-lap",
    name: "Điện mặt trời độc lập",
    slug: "dien-mat-troi-doc-lap",
    description: "Giải pháp sử dụng điện không phụ thuộc lưới điện.",
    icon: "Sun",
    order: 4,
  },
  {
    id: "pin-luu-tru-nang-luong",
    name: "Pin lưu trữ năng lượng",
    slug: "pin-luu-tru-nang-luong",
    description: "Kiến thức về battery, lithium và dung lượng lưu trữ.",
    icon: "BatteryFull",
    order: 5,
  },
  {
    id: "kien-thuc-dien-mat-troi",
    name: "Kiến thức điện mặt trời",
    slug: "kien-thuc-dien-mat-troi",
    description: "Hướng dẫn, tư vấn, kinh nghiệm sử dụng và bảo trì hệ thống.",
    icon: "BookOpen",
    order: 6,
  },
];

// ============================================
// ARTICLE TYPES
// ============================================

export const ARTICLE_TYPES = [
  {
    value: "knowledge",
    label: "Kiến thức / Bài viết",
    description: "Bài viết chia sẻ kiến thức, kinh nghiệm và hướng dẫn.",
  },
  {
    value: "project",
    label: "Công trình điện mặt trời",
    description: "Bài viết giới thiệu một công trình đã thi công (có thông số kỹ thuật).",
  },
];

export const ARTICLE_TYPE_LABELS = Object.fromEntries(
  ARTICLE_TYPES.map((t) => [t.value, t.label])
);

// ============================================
// STATUS
// ============================================

export const ARTICLE_STATUSES = [
  { value: "draft", label: "Bản nháp" },
  { value: "published", label: "Đã xuất bản" },
];

// ============================================
// SYSTEM TYPES (dùng trong projectInfo)
// ============================================

export const SYSTEM_TYPES = [
  { value: "hoa-luoi", label: "Hòa lưới" },
  { value: "hybrid", label: "Hybrid" },
  { value: "doc-lap", label: "Độc lập" },
];

export const SYSTEM_TYPE_LABELS = Object.fromEntries(
  SYSTEM_TYPES.map((t) => [t.value, t.label])
);
