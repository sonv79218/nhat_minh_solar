/**
 * Price Utility - Xử lý giá tiền chính xác
 * Tránh lỗi floating point: 59000 -> 58999
 */

/**
 * Convert price to integer (VND - không có decimal)
 * @param {number|string} price - Giá tiền
 * @returns {number} - Giá tiền dạng integer
 */
export const toInteger = (price) => {
  if (!price && price !== 0) return 0;
  const num = typeof price === 'string' ? parseInt(price, 10) : price;
  return Math.round(num);
};

/**
 * Format price hiển thị (VND)
 * @param {number} price - Giá tiền
 * @returns {string} - Format: 590.000
 */
export const formatPrice = (price) => {
  const num = toInteger(price);
  return num.toLocaleString('vi-VN');
};

/**
 * Format price với đuôi đ
 * @param {number} price - Giá tiền
 * @returns {string} - Format: 590.000đ
 */
export const formatPriceVND = (price) => {
  return `${formatPrice(price)}đ`;
};

/**
 * Tính tổng giá tiền (dùng cho subtotal, total)
 * @param {Array} items - Mảng items có price và quantity
 * @returns {number} - Tổng tiền (integer)
 */
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const price = toInteger(item.price || 0);
    const qty = toInteger(item.quantity || 1);
    return sum + price * qty;
  }, 0);
};

/**
 * Tính tổng từ danh sách prices
 * @param {Array} prices - Mảng giá tiền
 * @returns {number} - Tổng tiền (integer)
 */
export const sumPrices = (...prices) => {
  return prices.reduce((sum, price) => sum + toInteger(price), 0);
};

/**
 * Tính discount amount
 * @param {number} amount - Số tiền gốc
 * @param {number} discountPercent - Phần trăm giảm
 * @returns {number} - Số tiền được giảm (integer)
 */
export const calculateDiscount = (amount, discountPercent) => {
  const base = toInteger(amount);
  const percent = toInteger(discountPercent);
  return Math.round(base * percent / 100);
};

/**
 * Kiểm tra có discount không
 * @param {number} originalPrice - Giá gốc
 * @param {number} price - Giá bán
 * @returns {boolean}
 */
export const hasDiscount = (originalPrice, price) => {
  const orig = toInteger(originalPrice);
  const curr = toInteger(price);
  return orig > 0 && curr > 0 && orig > curr;
};

/**
 * Tính % discount
 * @param {number} originalPrice - Giá gốc
 * @param {number} price - Giá bán
 * @returns {number} - Phần trăm giảm (integer)
 */
export const getDiscountPercent = (originalPrice, price) => {
  const orig = toInteger(originalPrice);
  const curr = toInteger(price);
  if (orig <= 0 || curr <= 0 || orig <= curr) return 0;
  return Math.round(((orig - curr) / orig) * 100);
};
