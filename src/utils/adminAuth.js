/**
 * ============================================
 * ADMIN AUTH HELPER
 * Điện Mặt Trời Nhật Minh
 * ============================================
 * Mô hình phân quyền HIỆN TẠI (theo Firestore Security Rules):
 *   • KHÔNG dùng Custom Claims.
 *   • KHÔNG dùng role "admin" / collection "users".
 *   • Mọi tài khoản đăng nhập Firebase Authentication đều được phép
 *     tạo / sửa / xoá bài viết và quản lý danh mục bài viết.
 *
 * Vì vậy hàm ở đây chỉ kiểm tra PHIÊN ĐĂNG NHẬP của Firebase Auth.
 */

/**
 * Kiểm tra người dùng đang có phiên đăng nhập Firebase Authentication hay không.
 *
 * @param {import("firebase/auth").User | null | undefined} user
 * @returns {boolean}
 */
export const hasAuthSession = (user) => Boolean(user?.uid);

/**
 * Thông báo chuẩn khi phiên đăng nhập không hợp lệ.
 */
export const AUTH_REQUIRED_MESSAGE =
  "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại rồi thử.";
