// ============================================
// FIREBASE CONFIG - NHẬT MINH
// ============================================
// Nguồn cấu hình DUY NHẤT của toàn bộ ứng dụng.
//
// - `app`    : Firebase App duy nhất (không initializeApp() ở nơi khác)
// - `db`     : Firestore dùng chung
// - `auth`   : Firebase Authentication dùng chung
// - `storage`: Firebase Storage dùng chung (bucket đã cấu hình trong .env)
//
// Toàn bộ module khác PHẢI import từ đây:
//   import { db, auth, storage } from "@/services/firebase";
// Không được gọi initializeApp() / getFirestore(app) / getAuth(app) ở module khác.
// ============================================
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration - lấy từ biến môi trường (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Khởi tạo App DUY NHẤT.
// getApps() bảo đảm không bao giờ initializeApp() lần thứ hai
// (ví dụ khi Vite hot-reload hoặc module bị import nhiều lần).
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Firestore dùng chung
export const db = getFirestore(app);

// Auth dùng chung
export const auth = getAuth(app);

// Storage dùng chung (chỉ khởi tạo khi đã cấu hình bucket)
export const storage = firebaseConfig.storageBucket ? getStorage(app) : null;

export { firebaseConfig };
export default app;
