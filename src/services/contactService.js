// ============================================
// CONTACT SERVICE
// Điện Mặt Trời Nhật Minh
// Fetches and updates contact_requests from Firestore
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

export const getContactRequests = async () => {
  const q = query(
    collection(db, "contact_requests"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateContactRequestStatus = async (id, status) => {
  const ref = doc(db, "contact_requests", id);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
};
