// ============================================
// FIREBASE RETRY HELPER
// Điện Mặt Trời Nhật Minh
// ============================================
// Firestore trả về `permission-denied` khi ID token đã hết hạn.
// Trong trường hợp đó, gọi `getIdToken(user, true)` để làm mới token
// rồi thử lại đúng 1 lần trước khi báo lỗi cho người dùng.
//
// Nhờ vậy người dùng không phải đăng nhập lại chỉ vì phiên bị hết hạn
// âm thầm (Firestore tự refresh token qua Firebase Auth SDK, nhưng khi
// request đi kèm session cũ thì vẫn có thể bị từ chối).
// ============================================
import { getIdToken } from "firebase/auth";
import { db } from "@/services/firebase";
import { isPermissionError } from "@/utils/firebaseErrors";

/**
 * Thực hiện một thao tác Firestore. Nếu gặp lỗi quyền (thường do token
 * hết hạn), sẽ refresh token rồi thử lại 1 lần.
 *
 * @template T
 * @param {import("firebase/firestore").Firestore} firestore - Firestore instance
 * @param {import("firebase/auth").User | null | undefined} user - User hiện tại
 * @param {() => Promise<T>} operation - Thao tác cần thực hiện
 * @returns {Promise<T>}
 */
export const withFirestoreRetry = async (firestore, user, operation) => {
  try {
    return await operation();
  } catch (error) {
    if (!isPermissionError(error) || !user) throw error;

    // Refresh token rồi thử lại 1 lần.
    try {
      await getIdToken(user, true);
    } catch {
      // Không refresh được → báo lỗi gốc.
      throw error;
    }

    return operation();
  }
};

/**
 * Phiên bản rút gọn dùng Firestore mặc định của ứng dụng.
 * @template T
 * @param {import("firebase/auth").User | null | undefined} user
 * @param {() => Promise<T>} operation
 * @returns {Promise<T>}
 */
export const withRetry = (user, operation) => withFirestoreRetry(db, user, operation);
