// ============================================
// CONTACT SERVICE
// Điện Mặt Trời Nhật Minh
// Fetches and updates contact_requests from Firestore
//
// PHÂN QUYỀN (theo Firestore Security Rules hiện tại):
//   • Yêu cầu liên hệ: ai cũng tạo được và ai cũng đọc được.
//   • KHÔNG phân biệt admin — không cần đăng nhập để gửi form,
//     không cần đăng nhập để xem danh sách.
// ============================================
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { withRetry } from "@/services/firebaseRetry";

/**
 * Lấy toàn bộ yêu cầu liên hệ (mới nhất trước).
 * @param {import("firebase/auth").User | null} [user] - User hiện tại (để refresh token khi cần)
 * @returns {Promise<Array<{ id: string } & Record<string, any>>>}
 */
export const getContactRequests = async (user = null) => {
  const snapshot = await withRetry(user, () =>
    getDocs(query(collection(db, "contact_requests"), orderBy("createdAt", "desc")))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Cập nhật trạng thái xử lý của một yêu cầu liên hệ.
 * @param {string} id - id của document trong collection "contact_requests"
 * @param {"new" | "contacted" | "done" | string} status
 * @param {import("firebase/auth").User | null} [user] - User hiện tại (để refresh token khi cần)
 */
export const updateContactRequestStatus = async (id, status, user = null) => {
  const ref = doc(db, "contact_requests", id);
  await withRetry(user, () =>
    updateDoc(ref, { status, updatedAt: serverTimestamp() })
  );
};
