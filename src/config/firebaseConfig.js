// ============================================
// FIREBASE CONFIG - ĐIỆN MẶT TRỜI NHẬT MINH
// ------------------------------------------------------------
// Nguồn cấu hình Firebase DUY NHẤT cho toàn bộ ứng dụng.
//
// Toàn bộ ứng dụng dùng MỘT Firebase Project: `nhat-minh-solar`
//   • Firestore   → nhat-minh-solar
//   • Auth        → nhat-minh-solar
//   • Storage     → nhat-minh-solar
//
// LÝ DO CÓ FILE NÀY:
//   Lịch sử dự án từng dùng project `nhat-minh-smart-home`. Khi đổi sang
//   `nhat-minh-solar`, biến môi trường trên Vercel chỉ được cập nhật một
//   phần, khiến bundle deploy có API Key của `nhat-minh-solar` nhưng
//   projectId của `nhat-minh-smart-home` → Firestore trả về
//   "Missing or insufficient permissions" (403).
//
//   File này đóng vai trò "cấu hình chuẩn" (canonical config):
//   • Biến môi trường được ưu tiên KHI nó trỏ đúng project `nhat-minh-solar`.
//   • Nếu biến môi trường thiếu, rỗng, hoặc trỏ sang project khác
//     (vd `nhat-minh-smart-home`), tự động dùng giá trị chuẩn ở đây và
//     ghi cảnh báo rõ ràng ra console.
//
// NGUYÊN TẮC: chỉ dùng thông tin của project `nhat-minh-solar`.
// ============================================

/** Project ID chuẩn — toàn bộ app chỉ dùng project này. */
export const FIREBASE_PROJECT_ID = "nhat-minh-solar";

/**
 * Cấu hình chuẩn của project `nhat-minh-solar`.
 * Giá trị lấy từ `.env` của dự án (không tự tạo mới).
 * Dùng làm fallback khi biến môi trường bị thiếu hoặc trỏ sai project.
 */
export const CANONICAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDcQtj8KLzw6o47Iq-CW1sAid-JTIusx8Y",
  authDomain: "nhat-minh-solar.firebaseapp.com",
  projectId: "nhat-minh-solar",
  storageBucket: "nhat-minh-solar.firebasestorage.app",
  messagingSenderId: "85051015242",
  appId: "1:85051015242:web:f67e388594f723c8ae26b3",
};

/**
 * Chuỗi nhận diện một config có trỏ đúng project chuẩn hay không.
 *
 * Kiểm tra TOÀN BỘ bộ giá trị, không chỉ `projectId`.
 * Lý do: lỗi gốc là config TRỘN — API Key của project A nhưng
 * `projectId`/`appId` của project B. Kiểm tra từng field giúp bắt
 * được cả trường hợp `projectId` đúng nhưng `appId`/`storageBucket` sai.
 *
 * @param {Record<string, string>} config
 * @returns {boolean}
 */
export const isCanonicalProject = (config) => {
  if (!config) return false;
  return Object.entries(CANONICAL_FIREBASE_CONFIG).every(
    ([key, value]) => !config[key] || config[key] === value
  );
};

/**
 * Đọc cấu hình từ biến môi trường Vite, loại bỏ giá trị rỗng.
 * @returns {Record<string, string>}
 */
const readEnvConfig = () => {
  const env = import.meta.env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: env.VITE_FIREBASE_APP_ID || "",
  };
};

/**
 * Cấu hình Firebase cuối cùng dùng cho ứng dụng.
 *
 * Quy tắc:
 *  1. Nếu biến môi trường đủ và MỌI field khớp `nhat-minh-solar`
 *     → dùng biến môi trường.
 *  2. Nếu biến môi trường thiếu/rỗng → lấy giá trị chuẩn cho field đó.
 *  3. Nếu BẤT KỲ field nào của biến môi trường lệch (vd config trộn giữa
 *     `nhat-minh-solar` và `nhat-minh-smart-home`)
 *     → bỏ qua toàn bộ biến môi trường, dùng cấu hình chuẩn,
 *     và ghi cảnh báo để dễ phát hiện khi cấu hình môi trường bị sai.
 */
export const resolveFirebaseConfig = () => {
  const envConfig = readEnvConfig();
  const envHasValue = Object.values(envConfig).some(Boolean);

  if (!envHasValue) {
    console.warn(
      "[firebase] Không tìm thấy biến môi trường VITE_FIREBASE_* — sử dụng cấu hình chuẩn của project",
      FIREBASE_PROJECT_ID
    );
    return { ...CANONICAL_FIREBASE_CONFIG };
  }

  if (!isCanonicalProject(envConfig)) {
    // Ghi rõ field nào đang lệch để dễ tra trên Vercel Dashboard.
    const mismatched = Object.entries(CANONICAL_FIREBASE_CONFIG)
      .filter(([key, value]) => envConfig[key] && envConfig[key] !== value)
      .map(([key]) => key);

    console.warn(
      `[firebase] ⚠️ Cấu hình từ biến môi trường KHÔNG khớp project "${FIREBASE_PROJECT_ID}"` +
        (mismatched.length ? ` (lệch ở: ${mismatched.join(", ")})` : "") +
        `. Cấu hình chuẩn của "${FIREBASE_PROJECT_ID}" sẽ được dùng. ` +
        `Hãy cập nhật lại các biến VITE_FIREBASE_* trên Vercel.`
    );
    return { ...CANONICAL_FIREBASE_CONFIG };
  }

  // Đúng project → ưu tiên biến môi trường, bù giá trị chuẩn cho field bị thiếu.
  const merged = { ...CANONICAL_FIREBASE_CONFIG };
  Object.entries(envConfig).forEach(([key, value]) => {
    if (value) merged[key] = value;
  });

  return merged;
};
