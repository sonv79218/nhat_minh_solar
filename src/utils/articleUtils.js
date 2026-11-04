// ============================================
// SLUG & DATE UTILS
// Điện Mặt Trời Nhật Minh
// ============================================

/**
 * Chuyển chuỗi tiếng Việt (có dấu) thành slug URL thân thiện
 * @param {string} text
 * @returns {string}
 */
export const slugify = (text = "") => {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Format ngày theo kiểu Việt Nam
 * @param {any} value - Timestamp | Date | string | number
 * @returns {string}
 */
export const formatDate = (value) => {
  if (!value) return "—";

  let date;
  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Format ngày giờ đầy đủ
 * @param {any} value
 * @returns {string}
 */
export const formatDateTime = (value) => {
  if (!value) return "—";

  let date;
  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Tính số từ của nội dung HTML (dùng cho excerpt tự động)
 * @param {string} html
 * @returns {string}
 */
export const htmlToPlainText = (html = "") => {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Rút gọn mô tả ngắn
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text = "", maxLength = 160) => {
  const clean = String(text).trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
};
