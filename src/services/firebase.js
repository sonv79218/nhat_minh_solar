// ============================================
// FIREBASE SERVICE - ĐIỆN MẶT TRỜI NHẬT MINH
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
//
// Tất cả service đều trỏ về project `nhat-minh-solar` — xem
// `@/config/firebaseConfig` để biết chi tiết cách chọn cấu hình.
// ============================================
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  resolveFirebaseConfig,
  FIREBASE_PROJECT_ID,
} from "@/config/firebaseConfig";

// Cấu hình Firebase đã resolve (biến môi trường hợp lệ, nếu không thì dùng
// cấu hình chuẩn của project `nhat-minh-solar`).
export const firebaseConfig = resolveFirebaseConfig();

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

// Project ID đang dùng — hữu ích khi cần kiểm tra/log trong lúc debug.
export { FIREBASE_PROJECT_ID };

export default app;
