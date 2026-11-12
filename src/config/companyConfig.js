// ============================================
// COMPANY CONFIG - ĐIỆN MẶT TRỜI NHẬT MINH
// Cấu hình tập trung cho thông tin liên hệ, mạng xã hội và Google Maps
// ------------------------------------------------------------
// TOÀN BỘ thông tin liên hệ / mạng xã hội / bản đồ nằm trong file này.
// Chỉ cần sửa file này để cập nhật trên toàn website (Footer, Trang Liên hệ, ...)
// Không tự bịa URL/địa chỉ: nếu chưa có thông tin thực, để chuỗi rỗng "" và
// ghi chú TODO — phần giao diện sẽ tự ẩn khối đó cho tới khi được điền.
// ============================================

export const company = {
  // ---- Thông tin doanh nghiệp ----
  name: "Nhật Minh Công Nghệ Group",
  brand: "Nhật Minh — Điện Mặt Trời",
  legalName: "CÔNG TY TNHH NHẬT MINH CÔNG NGHỆ GROUP",
  taxId: "2301374027",
  businessId: "2301374027",

  // ---- Địa chỉ ----
  address: {
    full:
      "Nhà số 01 ngõ Giếng Vàng, Khu phố Phù Lưu, Phường Từ Sơn, Tỉnh Bắc Ninh, Việt Nam",
    short: "Từ Sơn, Bắc Ninh",
    // Tọa độ dạng "lat,lng" (không bắt buộc). Nếu có, bản đồ dùng chính xác hơn.
    // TODO: điền tọa độ thực tế của cửa hàng nếu muốn ghim chính xác.
    coordinates: "",
  },

  // ---- Điện thoại / email ----
  phones: {
    hotline: { display: "0876 906 668", href: "tel:0876906668" },
    technical: { display: "0972 131 477", href: "tel:0972131477" },
  },
  email: { display: "contact@nhatminh.vn", href: "mailto:contact@nhatminh.vn" },

  // ---- Giờ làm việc ----
  workingHours: "08:00 – 18:00, thứ Hai – Chủ nhật",

  // ---- Thông tin pháp lý hiển thị ở footer ----
  description:
    "Chuyên cung cấp, lắp đặt hệ thống điện mặt trời chất lượng cao tại Bắc Ninh và các tỉnh lân cận.",
  experience: "8 năm kinh nghiệm — Điện mặt trời Từ Sơn, Bắc Ninh",
  copyright: "© 2018 – 2026 Nhật Minh Công Nghệ Group. All rights reserved.",
};

// ============================================
// MẠNG XÃ HỘI
// ------------------------------------------------------------
// href rỗng ("") => component tự động ẩn nút tương ứng.
// Trong môi trường dev, các nền tảng chưa có URL sẽ hiển thị dạng "chờ điền"
// (viền đứt) để dễ bố trí; trên production sẽ ẩn hoàn toàn.
// TODO: điền URL chính thức của Nhật Minh Solar cho từng nền tảng.
// ============================================
export const social = {
  // TODO: thay bằng trang Fanpage chính thức
  facebook: "https://zalo.me/0876906668",
  // TODO: thay bằng kênh YouTube chính thức
  youtube: "https://zalo.me/0876906668",
  // TODO: thay bằng kênh TikTok chính thức
  tiktok: "https://zalo.me/0876906668",
  // Đã có sẵn từ website (số hotline)
  zalo: "https://zalo.me/0876906668",
};

// Thứ tự hiển thị + màu thương hiệu
export const socialPlatforms = [
  { key: "facebook", label: "Facebook", color: "#1877f2" },
  { key: "tiktok", label: "TikTok", color: "#111111" },
  { key: "zalo", label: "Zalo", color: "#0068ff" },
];

// ============================================
// GOOGLE MAPS
// ------------------------------------------------------------
// - placeQuery: từ khoá/địa chỉ dùng để ghim vị trí (KHÔNG cần tọa độ chính xác)
// - coordinates: "lat,lng" nếu muốn ghim chính xác (ưu tiên cao hơn placeQuery)
// - embedUrl: nếu muốn dùng embed URL cố định (có API key), ghi đè tại đây
// ============================================
export const maps = {
  placeQuery: company.address.full,
  coordinates: company.address.coordinates,
  embedUrl: "",
  zoom: 16,
};

const encode = (value) => encodeURIComponent(String(value || "").trim());

/**
 * Tạo URL nhúng bản đồ Google Maps (không cần API key).
 * Ưu tiên: embedUrl cố định > placeId > tọa độ > địa chỉ dạng chữ.
 */
export const getMapEmbedUrl = () => {
  if (maps.embedUrl) return maps.embedUrl;

  const base = "https://www.google.com/maps";

  const target = maps.coordinates || maps.placeQuery;

  if (!target) return "";

  return `${base}?q=${encode(target)}&z=${maps.zoom}&hl=vi&output=embed`;
};

/**
 * Tạo URL mở Google Maps để chỉ đường tới vị trí.
 */
export const getDirectionsUrl = () => {
  const destination = maps.coordinates || maps.placeQuery;

  if (!destination) return "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encode(destination)}`;
};

/**
 * Tạo URL mở Google Maps xem vị trí (không chỉ đường).
 */
export const getMapViewUrl = () => {
  const target = maps.coordinates || maps.placeQuery;

  if (!target) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encode(target)}`;
};

/**
 * Danh sách mạng xã hội đang có URL hợp lệ.
 */
export const getActiveSocialLinks = () =>
  socialPlatforms
    .map((platform) => ({ ...platform, href: social[platform.key] || "" }))
    .filter((platform) => Boolean(platform.href));

/**
 * Danh sách đầy đủ kèm cờ `pending` cho nền tảng chưa có URL.
 * - pending = true  => chưa cấu hình (chỉ hiển thị ở chế độ dev/preview)
 * - pending = false => đã có URL, sẽ mở tab mới
 */
export const getSocialLinksWithStatus = () =>
  socialPlatforms.map((platform) => {
    const href = social[platform.key] || "";

    return {
      ...platform,
      href,
      pending: !href,
    };
  });

/**
 * Bật hiển thị "chờ điền" cho các nền tảng chưa cấu hình.
 * Mặc định chỉ bật ở môi trường dev để tránh hiển thị link giả trên production.
 */
export const shouldShowPendingSocial =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_PENDING_SOCIAL === "true";

export default {
  company,
  social,
  socialPlatforms,
  maps,
  getMapEmbedUrl,
  getDirectionsUrl,
  getMapViewUrl,
  getActiveSocialLinks,
  getSocialLinksWithStatus,
  shouldShowPendingSocial,
};
