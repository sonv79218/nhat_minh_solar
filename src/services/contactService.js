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

/**
 * Lấy toàn bộ yêu cầu liên hệ (mới nhất trước).
 * @returns {Promise<Array<{ id: string } & Record<string, any>>>}
 */
export const getContactRequests = async () => {
  const q = query(
    collection(db, "contact_requests"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Cập nhật trạng thái xử lý của một yêu cầu liên hệ.
 * @param {string} id - id của document trong collection "contact_requests"
 * @param {"new" | "contacted" | "done" | string} status
 */
export const updateContactRequestStatus = async (id, status) => {
  const ref = doc(db, "contact_requests", id);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
};
