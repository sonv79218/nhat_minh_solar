// ============================================
// IMAGE UPLOAD SERVICE
// Điện Mặt Trời Nhật Minh
// Dùng Cloudinary (unsigned upload preset) — đã cấu hình sẵn trong .env
// ============================================

const CLOUD_NAME = "dwmfqzmf9";
const UPLOAD_URL =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_URL ||
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "react_upload";

/**
 * Upload 1 file lên Cloudinary
 * @param {File} file
 * @param {string} [folder] - Thư mục trên Cloudinary
 * @returns {Promise<string>} URL ảnh
 */
export const uploadImage = async (file, folder = "nhatminh/articles") => {
  if (!file) throw new Error("Không có tệp ảnh");

  if (!file.type?.startsWith("image/")) {
    throw new Error("Tệp không hợp lệ. Vui lòng chọn tệp ảnh.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Kích thước ảnh vượt quá 10MB.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);
  body.append("folder", folder);
  body.append("quality", "auto");
  body.append("fetch_format", "auto");

  const response = await fetch(UPLOAD_URL, { method: "POST", body });

  if (!response.ok) {
    throw new Error(`Tải ảnh lên thất bại (${response.status})`);
  }

  const data = await response.json();
  return data.secure_url;
};

/**
 * Upload nhiều file song song
 * @param {File[]} files
 * @param {string} [folder]
 * @returns {Promise<string[]>} Danh sách URL
 */
export const uploadImages = async (files, folder = "nhatminh/articles") => {
  const list = Array.from(files || []);
  if (!list.length) return [];

  const results = await Promise.allSettled(
    list.map((file) => uploadImage(file, folder))
  );

  const urls = [];
  const errors = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") urls.push(result.value);
    else errors.push(result.reason?.message || "Lỗi không xác định");
  });

  if (urls.length === 0 && errors.length) {
    throw new Error(errors[0]);
  }

  return urls;
};
