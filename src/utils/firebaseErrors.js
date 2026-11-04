/**
 * ============================================
 * FIREBASE ERROR MESSAGES
 * Điện Mặt Trời Nhật Minh
 * ============================================
 * Chuyển lỗi Firebase SDK thành thông báo tiếng Việt dễ hiểu,
 * để giao diện không chỉ hiển thị "Missing or insufficient permissions".
 */

/**
 * @param {unknown} error - Lỗi từ Firebase SDK
 * @param {string} [fallback] - Thông báo mặc định khi không xác định được
 * @returns {string} Thông báo thân thiện
 */
export const describeFirebaseError = (error, fallback = "Đã xảy ra lỗi. Vui lòng thử lại.") => {
  if (!error) return fallback;

  const code = error.code || "";

  switch (code) {
    case "permission-denied":
    case "PERMISSION_DENIED":
      return "Không có quyền thực hiện thao tác này trên Firestore. Hãy đăng nhập lại rồi thử.";

    case "unauthenticated":
    case "UNAUTHENTICATED":
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử.";

    case "not-found":
    case "NOT_FOUND":
      return "Không tìm thấy dữ liệu (bài viết có thể đã bị xoá).";

    case "already-exists":
    case "ALREADY_EXISTS":
      return "Dữ liệu đã tồn tại.";

    case "unavailable":
    case "UNAVAILABLE":
      return "Không thể kết nối Firestore. Vui lòng kiểm tra mạng rồi thử lại.";

    case "deadline-exceeded":
    case "DEADLINE_EXCEEDED":
      return "Yêu cầu quá thời gian chờ. Vui lòng thử lại.";

    case "resource-exhausted":
    case "RESOURCE_EXHAUSTED":
      return "Đã vượt giới hạn giao dịch. Vui lòng thử lại sau ít phút.";

    case "failed-precondition":
    case "FAILED_PRECONDITION":
      return "Firestore yêu cầu thiếu index cần thiết. Vui lòng kiểm tra cấu hình index.";

    case "invalid-argument":
    case "INVALID_ARGUMENT":
      return "Dữ liệu gửi lên không hợp lệ (có thể chứa giá trị rỗng không hợp lệ).";

    case "network-request-failed":
      return "Lỗi mạng. Vui lòng kiểm tra kết nối internet.";

    default:
      break;
  }

  // Lỗi Firestore SDK (WebChannel) thường có code dạng "7 PERMISSION_DENIED: ..."
  const message = String(error.message || "");

  if (/PERMISSION_DENIED|Missing or insufficient permissions/i.test(message)) {
    return "Không có quyền thực hiện thao tác này trên Firestore. Hãy đăng nhập lại rồi thử.";
  }
  if (/UNAUTHENTICATED|requires authentication/i.test(message)) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử.";
  }
  if (/UNAVAILABLE|NETWORK/i.test(message)) {
    return "Không thể kết nối Firestore. Vui lòng kiểm tra mạng rồi thử lại.";
  }
  if (/Cannot use undefined/i.test(message)) {
    return "Dữ liệu gửi lên không hợp lệ (giá trị rỗng không hợp lệ).";
  }
  if (/FAILED_PRECONDITION|index/i.test(message)) {
    return "Firestore yêu cầu thiếu index cần thiết. Vui lòng kiểm tra cấu hình index.";
  }

  return error.message || fallback;
};

/**
 * Kiểm tra lỗi có liên quan đến quyền truy cập hay không.
 * @param {unknown} error
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
  const code = error?.code || "";
  if (code === "permission-denied" || code === "PERMISSION_DENIED") return true;
  return /PERMISSION_DENIED|Missing or insufficient permissions/i.test(
    String(error?.message || "")
  );
};
