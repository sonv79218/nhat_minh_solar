#!/usr/bin/env node

/**
 * TEST 2: tái hiện chính xác luồng "Lưu bài viết" của AdminArticleEditor
 * (generateUniqueSlug -> slugExists -> createArticle/updateArticle)
 * dưới 3 trạng thái: đã đăng nhập, không đăng nhập, và đăng nhập nhưng
 * rules chặn đọc (mô phỏng bằng query không lọc status).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
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

const app = getApps().length ? getApps()[0] : initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);
const auth = getAuth(app);
const ARTICLES = "articles";

const email = `zzsave_${Date.now()}@probe.local`;
await createUserWithEmailAndPassword(auth, email, "ZzProbe@123456");
console.log(`\n✓ user: ${email}`);

const run = async (label, fn) => {
  try {
    const r = await fn();
    console.log(`  ✓ ${label} → ${r}`);
    return r;
  } catch (e) {
    console.log(`  ✗ ${label} → [${e.code}] ${e.message}`);
    return null;
  }
};

// --- slugExists (bản gốc trong articleService) ---
const slugExists = async (slug, excludeId) => {
  const snapshot = await getDocs(
    query(collection(db, ARTICLES), where("slug", "==", slug))
  );
  return snapshot.docs.some((d) => d.id !== excludeId);
};

console.log("\n━━━ Luồng lưu bài viết (đã đăng nhập) ━━━\n");

await run("slugExists('zz-save-1')", () => slugExists("zz-save-1"));

const createdId = await run("createArticle()", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, ARTICLES), {
    title: "ZZSave",
    slug: "zz-save-1",
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
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
});

console.log("\n━━━ Luồng lưu bài viết (KHÔNG đăng nhập) ━━━\n");
await signOut(auth);

await run("slugExists() — guest", () => slugExists("zz-save-1"));
await run("createArticle() — guest", async () => {
  const now = serverTimestamp();
  const ref = await addDoc(collection(db, ARTICLES), {
    title: "ZZSave guest",
    slug: "zz-save-guest",
    content: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
});

// --- dọn ---
await createUserWithEmailAndPassword(
  auth,
  `zzsave2_${Date.now()}@probe.local`,
  "ZzProbe@123456"
);
if (createdId) {
  await run("dọn articles/" + createdId, () =>
    updateDoc(doc(db, ARTICLES, createdId), { deleted: true })
  );
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, ARTICLES, createdId));
  console.log("  ✓ đã xoá doc test");
}
const snap = await getDocs(query(collection(db, ARTICLES), where("slug", "==", "zz-save-guest")));
for (const d of snap.docs) {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, ARTICLES, d.id));
  console.log(`  ✓ đã xoá guest doc ${d.id}`);
}
console.log("\n✓ Hoàn tất.");
