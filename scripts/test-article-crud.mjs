#!/usr/bin/env node

/**
 * TEST: chạy đúng các thao tác mà frontend dùng (firebase SDK, không phải REST)
 * để tái hiện lỗi "Missing or insufficient permissions".
 *
 * - Tạo user tạm qua SDK (đồng nhất với Firebase Auth).
 * - Chạy đúng các hàm trong src/services/articleService.js.
 * - Dọn dẹp toàn bộ dữ liệu tạm.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
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
} from "firebase/firestore";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
const env = {};
raw.split("\n").forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith("#")) return;
  const i = t.indexOf("=");
  if (i === -1) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Cho phép chạy trên Firestore/Auth Emulator qua biến môi trường
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
// Khi đó project/emulator được dùng thay cho project thật.
const useEmulator =
  process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST;

if (useEmulator) {
  const fsHost = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8085";
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
  const [fsHostName, fsPort] = fsHost.split(":");
  const [authHostName, authPort] = authHost.split(":");

  connectFirestoreEmulator(db, fsHostName, Number(fsPort));
  connectAuthEmulator(auth, `http://${authHostName}:${authPort}`);
  console.log(`\n▶ Chạy trên EMULATOR (${fsHost} / ${authHost})`);
} else {
  console.log(`\n▶ Chạy trên project THẬT: ${firebaseConfig.projectId}`);
}

const ARTICLES = "articles";
const CATEGORIES = "article_categories";

const email = `zzcrud_${Date.now()}@probe.local`;
const password = "ZzProbe@123456";

const step = (name, fn) =>
  (async () => {
    try {
      const r = await fn();
      console.log(`  ✓ ${name}${r ? ` → ${r}` : ""}`);
      return { ok: true, r };
    } catch (e) {
      console.log(`  ✗ ${name} → ${e.code || ""} ${e.message}`);
      return { ok: false, e };
    }
  })();

// ------------------------------------------------------------
// Đăng ký / đăng nhập
// ------------------------------------------------------------
let user;
try {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  user = cred.user;
  console.log(`\n✓ Tạo user test: ${email}`);
} catch (e) {
  console.log(`⚠ Không tạo được user (${e.code}). Thử đăng nhập admin có sẵn...`);
  const cred = await signInWithEmailAndPassword(auth, "admin@gmail.com", "Admin@12345");
  user = cred.user;
  console.log(`✓ Đăng nhập: ${user.email}`);
}

const created = { ids: [], catIds: [] };

// ------------------------------------------------------------
console.log("\n━━━ A. ĐỌC (đúng hàm của frontend) ━━━\n");

await step("getAllArticles() — list không filter", async () => {
  const snap = await getDocs(collection(db, ARTICLES));
  return `${snap.size} docs`;
});

await step("getPublishedArticles() — where status==published", async () => {
  const snap = await getDocs(query(collection(db, ARTICLES), where("status", "==", "published")));
  return `${snap.size} docs`;
});

await step("getArticleCategories() — list + orderBy(order)", async () => {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("order", "asc")));
  return `${snap.size} docs`;
});

await step("slugExists() — where slug == 'x' (KHÔNG filter status)", async () => {
  const snap = await getDocs(query(collection(db, ARTICLES), where("slug", "==", "zzprobe-slug")));
  return `${snap.size} docs`;
});

await step("getPublishedArticleBySlug() — where slug + where status", async () => {
  const snap = await getDocs(
    query(collection(db, ARTICLES), where("slug", "==", "zzprobe-slug"), where("status", "==", "published"))
  );
  return `${snap.size} docs`;
});

// ------------------------------------------------------------
console.log("\n━━━ B. TẠO bài viết ━━━\n");

const createdArticle = await step("createArticle() — addDoc", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, ARTICLES), {
    title: "ZZProbe bài viết",
    slug: "zzprobe-slug",
    excerpt: "",
    coverImage: "",
    content: "<p>test</p>",
    category: "",
    type: "knowledge",
    status: "draft",
    featured: false,
    author: "Nhật Minh",
    projectInfo: null,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  });
  created.ids.push(ref.id);
  return ref.id;
});

await step("createArticle() — published (publishedAt = serverTimestamp)", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, ARTICLES), {
    title: "ZZProbe published",
    slug: "zzprobe-slug-pub",
    excerpt: "",
    coverImage: "",
    content: "",
    category: "",
    type: "knowledge",
    status: "published",
    featured: false,
    author: "Nhật Minh",
    projectInfo: null,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  created.ids.push(ref.id);
  return ref.id;
});

await step("createArticle() — KHÔNG có publishedAt field (undefined bị bỏ)", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, ARTICLES), {
    title: "ZZProbe no publishedAt",
    slug: "zzprobe-slug-nopub",
    content: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });
  created.ids.push(ref.id);
  return ref.id;
});

// ------------------------------------------------------------
console.log("\n━━━ C. ĐỌC LẠI (sau khi tạo) ━━━\n");

await step("getArticleById() — getDoc", async () => {
  const snap = await getDoc(doc(db, ARTICLES, created.ids[0]));
  return snap.exists() ? "exists" : "missing";
});

await step("getAllArticles() — list lại (có draft)", async () => {
  const snap = await getDocs(collection(db, ARTICLES));
  return `${snap.size} docs`;
});

await step("slugExists() — list lại", async () => {
  const snap = await getDocs(query(collection(db, ARTICLES), where("slug", "==", "zzprobe-slug")));
  return `${snap.size} docs`;
});

// ------------------------------------------------------------
console.log("\n━━━ D. CẬP NHẬT ━━━\n");

await step("updateArticle() — updateDoc (giữ nguyên doc)", async () => {
  await updateDoc(doc(db, ARTICLES, created.ids[0]), {
    title: "ZZProbe đã sửa",
    slug: "zzprobe-slug",
    excerpt: "",
    coverImage: "",
    content: "",
    category: "",
    type: "knowledge",
    status: "draft",
    featured: false,
    author: "Nhật Minh",
    projectInfo: null,
    publishedAt: null,
    updatedAt: serverTimestamp(),
  });
  return "ok";
});

await step("updateArticle() — updateDoc status=published + publishedAt", async () => {
  await updateDoc(doc(db, ARTICLES, created.ids[0]), {
    title: "ZZProbe đã sửa",
    slug: "zzprobe-slug",
    excerpt: "",
    coverImage: "",
    content: "",
    category: "",
    type: "knowledge",
    status: "published",
    featured: false,
    author: "Nhật Minh",
    projectInfo: null,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return "ok";
});

await step("setArticleStatus() — updateDoc chỉ status + updatedAt", async () => {
  await updateDoc(doc(db, ARTICLES, created.ids[0]), {
    status: "draft",
    updatedAt: serverTimestamp(),
  });
  return "ok";
});

// ------------------------------------------------------------
console.log("\n━━━ E. DANH MỤC ━━━\n");

await step("createArticleCategory() — addDoc", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, CATEGORIES), {
    name: "ZZProbe danh mục",
    slug: "zzprobe-danh-muc",
    description: "",
    icon: "Folder",
    order: Date.now(),
    createdAt: now,
    updatedAt: now,
  });
  created.catIds.push(ref.id);
  return ref.id;
});

await step("updateArticleCategory() — updateDoc", async () => {
  await updateDoc(doc(db, CATEGORIES, created.catIds[0]), {
    name: "ZZProbe danh mục 2",
    slug: "zzprobe-danh-muc",
    description: "",
    icon: "Folder",
    order: 1,
    updatedAt: serverTimestamp(),
  });
  return "ok";
});

// ------------------------------------------------------------
console.log("\n━━━ F. XÓA ━━━\n");

await step("deleteArticle() — deleteDoc", async () => {
  await deleteDoc(doc(db, ARTICLES, created.ids[1]));
  return "ok";
});

await step("deleteArticleCategory() — deleteDoc", async () => {
  await deleteDoc(doc(db, CATEGORIES, created.catIds[0]));
  return "ok";
});

// ------------------------------------------------------------
console.log("\n━━━ G. ĐỌC KHÔNG ĐĂNG NHẬP (guest) ━━━\n");

await signOut(auth);

await step("guest getPublishedArticles()", async () => {
  const snap = await getDocs(query(collection(db, ARTICLES), where("status", "==", "published")));
  return `${snap.size} docs`;
});

await step("guest getArticleCategories()", async () => {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("order", "asc")));
  return `${snap.size} docs`;
});

await step("guest getPublishedArticleBySlug()", async () => {
  const snap = await getDocs(
    query(collection(db, ARTICLES), where("slug", "==", "zzprobe-slug-pub"), where("status", "==", "published"))
  );
  return `${snap.size} docs`;
});

await step("guest getAllArticles() (list tất cả)", async () => {
  const snap = await getDocs(collection(db, ARTICLES));
  return `${snap.size} docs`;
});

// ------------------------------------------------------------
console.log("\n━━━ H. DỌN DẸP ━━━\n");

await signInWithEmailAndPassword(auth, email, password);
for (const id of created.ids) {
  try {
    await deleteDoc(doc(db, ARTICLES, id));
    console.log(`  xoá articles/${id}`);
  } catch (e) {
    console.log(`  ! xoá articles/${id} → ${e.code}`);
  }
}
for (const id of created.catIds) {
  try {
    await deleteDoc(doc(db, CATEGORIES, id));
    console.log(`  xoá article_categories/${id}`);
  } catch (e) {
    console.log(`  ! xoá article_categories/${id} → ${e.code}`);
  }
}
await signOut(auth);
console.log("\n✓ Hoàn tất.");
