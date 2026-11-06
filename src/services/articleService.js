// ============================================
// ARTICLE SERVICE
// Điện Mặt Trời Nhật Minh
// CRUD cho collection "articles" + "article_categories" trên Firestore
// ============================================
// PHÂN QUYỀN (theo Firestore Security Rules đã deploy):
//   • Đọc  : công khai.
//   • Ghi  : mọi tài khoản đã đăng nhập Firebase Authentication đều được
//            phép tạo / sửa / xoá bài viết và quản lý danh mục.
//   • KHÔNG kiểm tra Custom Claims, KHÔNG kiểm tra role "admin".
// ============================================
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { slugify } from "@/utils/articleUtils";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";
import { AUTH_REQUIRED_MESSAGE } from "@/utils/adminAuth";

const ARTICLES_COLLECTION = "articles";
const CATEGORIES_COLLECTION = "article_categories";

/**
 * Bảo đảm có phiên đăng nhập trước khi ghi dữ liệu.
 * Rules chỉ cho phép ghi khi request.auth != null.
 * @param {import("firebase/auth").User | null} user
 */
const requireAuth = (user) => {
  if (!user?.uid) {
    throw new Error(AUTH_REQUIRED_MESSAGE);
  }
};

/**
 * Loại bỏ mọi giá trị `undefined` khỏi object trước khi ghi lên Firestore.
 * (Firestore đã tự bỏ undefined ở cấp field, nhưng vẫn an toàn khi
 *  payload lồng nhau như projectInfo.)
 * @param {Record<string, any>} obj
 * @returns {Record<string, any>}
 */
const stripUndefined = (obj) => {
  const out = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    if (value !== undefined) out[key] = value;
  });
  return out;
};

// ============================================
// CATEGORIES
// ============================================

/**
 * Lấy danh mục bài viết. Ưu tiên collection Firestore, fallback về danh mục mặc định.
 *
 * Quyền truy cập theo Security Rules:
 *   - Khách chưa đăng nhập: được đọc danh mục.
 *   - Tài khoản quản trị/đã đăng nhập: được đọc và ghi danh mục.
 *
 * Fallback về DEFAULT_CATEGORIES chỉ dùng khi collection rỗng hoặc Firestore
 * tạm thời không truy cập được, không phải để thay thế quyền đọc công khai.
 */
export const getArticleCategories = async () => {
  try {
    const snapshot = await getDocs(
      query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"))
    );

    if (snapshot.empty) return DEFAULT_CATEGORIES;

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn(
      "[articleService] getArticleCategories failed, using defaults:",
      error.message
    );
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Tạo mới danh mục bài viết
 * @param {import("firebase/auth").User} user - Người dùng đã đăng nhập
 */
export const createArticleCategory = async (user, payload) => {
  requireAuth(user);

  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    description: payload.description || "",
    icon: payload.icon || "Folder",
    order: Number(payload.order) || Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Cập nhật danh mục bài viết
 * @param {import("firebase/auth").User} user
 */
export const updateArticleCategory = async (user, id, payload) => {
  requireAuth(user);

  const ref = doc(db, CATEGORIES_COLLECTION, id);

  await updateDoc(ref, {
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    description: payload.description || "",
    icon: payload.icon || "Folder",
    order: Number(payload.order) || 0,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Xóa danh mục bài viết
 * @param {import("firebase/auth").User} user
 */
export const deleteArticleCategory = async (user, id) => {
  requireAuth(user);

  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
};

// ============================================
// ARTICLES - PUBLIC READ
// ============================================

/**
 * Lấy bài viết đã xuất bản (dành cho khách truy cập).
 * Chỉ trả về bài viết có status === "published".
 * @param {Object} options
 * @param {string} [options.category] - Slug danh mục để lọc
 * @param {string} [options.type] - "project" | "knowledge"
 * @param {boolean} [options.featuredOnly]
 */
export const getPublishedArticles = async ({
  category,
  type,
  featuredOnly = false,
} = {}) => {
  try {
    // Chỉ dùng MỘT điều kiện where ở Firestore (tránh cần composite index),
    // các điều kiện còn lại lọc phía client.
    const snapshot = await getDocs(
      query(
        collection(db, ARTICLES_COLLECTION),
        where("status", "==", "published")
      )
    );

    let result = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (category) result = result.filter((a) => a.category === category);
    if (type) result = result.filter((a) => a.type === type);
    if (featuredOnly) result = result.filter((a) => a.featured === true);

    return result.sort(
      (a, b) =>
        toMillis(b.publishedAt) - toMillis(a.publishedAt) ||
        toMillis(b.createdAt) - toMillis(a.createdAt)
    );
  } catch (error) {
    console.warn("[articleService] getPublishedArticles failed:", error.message);
    return [];
  }
};

/**
 * Lấy bài viết đã xuất bản theo slug
 *
 * Lưu ý: phải lọc đồng thời slug + status vì bản nháp không được hiển thị
 * cho khách. Truy vấn 2 điều kiện cần composite index (xem firestore.indexes.json).
 */
export const getPublishedArticleBySlug = async (slug) => {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, ARTICLES_COLLECTION),
        where("slug", "==", slug),
        where("status", "==", "published")
      )
    );

    if (snapshot.empty) return null;

    const { id, ...data } = snapshot.docs[0].data();
    return { id, ...data };
  } catch (error) {
    console.warn(
      "[articleService] getPublishedArticleBySlug failed:",
      error.message
    );
    return null;
  }
};

/**
 * Lấy bài viết liên quan (cùng danh mục, khác bài hiện tại)
 */
export const getRelatedArticles = async ({
  category,
  excludeId,
  limit = 3,
} = {}) => {
  const articles = await getPublishedArticles({ category });

  return articles
    .filter((a) => a.id !== excludeId)
    .slice(0, limit);
};

/**
 * Lấy toàn bộ bài viết đã xuất bản dùng cho sitemap (chỉ cần slug + updatedAt)
 */
export const getPublishedArticleSlugs = async () => {
  try {
    const snapshot = await getDocs(
      query(collection(db, ARTICLES_COLLECTION), where("status", "==", "published"))
    );

    return snapshot.docs.map((d) => ({
      slug: d.data().slug,
      updatedAt: toMillis(d.data().updatedAt) || toMillis(d.data().publishedAt),
    }));
  } catch (error) {
    console.warn("[articleService] getPublishedArticleSlugs failed:", error.message);
    return [];
  }
};

// ============================================
// ARTICLES - ADMIN CRUD
// ============================================

/**
 * Lấy tất cả bài viết (kể cả draft) cho màn hình quản lý.
 * @param {import("firebase/auth").User} user
 */
export const getAllArticles = async (user) => {
  requireAuth(user);

  try {
    const snapshot = await getDocs(collection(db, ARTICLES_COLLECTION));

    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort(
        (a, b) =>
          toMillis(b.updatedAt || b.createdAt) -
          toMillis(a.updatedAt || a.createdAt)
      );
  } catch (error) {
    console.warn("[articleService] getAllArticles failed:", error.message);
    throw error;
  }
};

/**
 * Lấy một bài viết bất kỳ theo id (dùng cho admin edit)
 * @param {import("firebase/auth").User} user
 */
export const getArticleById = async (user, id) => {
  requireAuth(user);

  const snapshot = await getDoc(doc(db, ARTICLES_COLLECTION, id));
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Kiểm tra slug đã tồn tại chưa
 * @param {import("firebase/auth").User} user
 * @param {string} slug
 * @param {string} [excludeId] - id bài đang sửa (không tính là trùng)
 */
export const slugExists = async (user, slug, excludeId) => {
  requireAuth(user);

  const snapshot = await getDocs(
    query(collection(db, ARTICLES_COLLECTION), where("slug", "==", slug))
  );

  return snapshot.docs.some((d) => d.id !== excludeId);
};

/**
 * Tạo slug duy nhất (tự thêm hậu tố -2, -3 nếu trùng)
 * @param {import("firebase/auth").User} user
 */
export const generateUniqueSlug = async (user, title, excludeId) => {
  const base = slugify(title) || "bai-viet";
  if (!(await slugExists(user, base, excludeId))) return base;

  let suffix = 2;
  while (true) {
    const candidate = `${base}-${suffix}`;
    if (!(await slugExists(user, candidate, excludeId))) return candidate;
    suffix += 1;
  }
};

/**
 * Tạo bài viết mới
 * @param {import("firebase/auth").User} user
 */
export const createArticle = async (user, payload) => {
  requireAuth(user);

  const now = serverTimestamp();
  const status = payload.status === "published" ? "published" : "draft";

  const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt || "",
    coverImage: payload.coverImage || "",
    content: payload.content || "",
    category: payload.category || "",
    type: payload.type || "knowledge",
    status,
    featured: Boolean(payload.featured),
    author: payload.author || "Nhật Minh",
    equipment: Array.isArray(payload.equipment) ? payload.equipment : [],
    projectInfo: payload.projectInfo || null,
    publishedAt: status === "published" ? now : payload.publishedAt || null,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

/**
 * Cập nhật bài viết (updateDoc — không ghi đè các field không được nhắc tới)
 * @param {import("firebase/auth").User} user
 */
export const updateArticle = async (user, id, payload) => {
  requireAuth(user);

  const ref = doc(db, ARTICLES_COLLECTION, id);
  const status = payload.status === "published" ? "published" : "draft";

  const patch = stripUndefined({
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt || "",
    coverImage: payload.coverImage || "",
    content: payload.content || "",
    category: payload.category || "",
    type: payload.type || "knowledge",
    status,
    featured: Boolean(payload.featured),
    author: payload.author || "Nhật Minh",
    equipment: Array.isArray(payload.equipment) ? payload.equipment : [],
    projectInfo: payload.projectInfo ?? null,
    updatedAt: serverTimestamp(),
  });

  // Chỉ set publishedAt khi chuyển sang published lần đầu
  if (status === "published") {
    patch.publishedAt = payload.publishedAt || serverTimestamp();
  } else if (payload.publishedAt !== undefined) {
    patch.publishedAt = payload.publishedAt || null;
  }

  await updateDoc(ref, patch);
};

/**
 * Xóa bài viết
 * @param {import("firebase/auth").User} user
 */
export const deleteArticle = async (user, id) => {
  requireAuth(user);

  await deleteDoc(doc(db, ARTICLES_COLLECTION, id));
};

/**
 * Cập nhật nhanh trạng thái (draft <-> published)
 * @param {import("firebase/auth").User} user
 */
export const setArticleStatus = async (user, id, status) => {
  requireAuth(user);

  const ref = doc(db, ARTICLES_COLLECTION, id);
  const patch = { status, updatedAt: serverTimestamp() };

  if (status === "published") {
    patch.publishedAt = serverTimestamp();
  }

  await updateDoc(ref, patch);
};

/**
 * Xóa hàng loạt (dùng cho batch delete)
 * @param {import("firebase/auth").User} user
 */
export const deleteArticlesBatch = async (user, ids) => {
  requireAuth(user);

  if (!ids?.length) return;

  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, ARTICLES_COLLECTION, id)));
  await batch.commit();
};

// ============================================
// HELPERS
// ============================================

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};
