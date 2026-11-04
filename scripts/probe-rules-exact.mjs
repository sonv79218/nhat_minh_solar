#!/usr/bin/env node

/**
 * XÁC ĐỊNH CHÍNH XÁC rules đang deploy (black-box, không đọc được file).
 *
 * Mục tiêu: biết chính xác rules cho `articles` và `article_categories`
 * đang chạy trên project live, để sửa frontend cho khớp.
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
  getDoc,
  addDoc,
  deleteDoc,
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
const A = "articles";
const C = "article_categories";

const email = `zzrule_${Date.now()}@probe.local`;
await createUserWithEmailAndPassword(auth, email, "ZzProbe@123456");

const t = async (name, fn) => {
  try {
    const r = await fn();
    console.log(`  ✓ ${name} → ${r}`);
    return { ok: true };
  } catch (e) {
    console.log(`  ✗ ${name} → [${e.code}] ${e.message}`);
    return { ok: false, e };
  }
};

// Tạo 1 draft + 1 published để test read
const draftRef = await addDoc(collection(db, A), {
  title: "ZZRule draft", slug: "zzrule-draft", status: "draft",
  createdAt: serverTimestamp(),
});
const pubRef = await addDoc(collection(db, A), {
  title: "ZZRule published", slug: "zzrule-pub", status: "published",
  publishedAt: serverTimestamp(), createdAt: serverTimestamp(),
});

console.log("\n━━━ 1. GUEST đọc articles ━━━\n");
await signOut(auth);

await t("getDoc(draft) — guest", async () => {
  const s = await getDoc(doc(db, A, draftRef.id));
  return s.exists() ? "EXISTS (đọc được bản nháp!)" : "missing";
});
await t("getDoc(published) — guest", async () => {
  const s = await getDoc(doc(db, A, pubRef.id));
  return s.exists() ? "exists" : "missing";
});
await t("list tất cả articles — guest", async () => {
  const s = await getDocs(collection(db, A));
  return `${s.size} docs`;
});
await t("list where status==published — guest", async () => {
  const s = await getDocs(query(collection(db, A), where("status", "==", "published")));
  return `${s.size} docs`;
});
await t("list where slug==zzrule-draft (KHÔNG filter status) — guest", async () => {
  const s = await getDocs(query(collection(db, A), where("slug", "==", "zzrule-draft")));
  return `${s.size} docs`;
});

console.log("\n━━━ 2. GUEST đọc article_categories ━━━\n");

await t("list article_categories — guest", async () => {
  const s = await getDocs(collection(db, C));
  return `${s.size} docs`;
});
await t("getDoc(category không tồn tại) — guest", async () => {
  const s = await getDoc(doc(db, C, "zzrule_nonexistent"));
  return s.exists() ? "exists" : "missing (đọc được)";
});

console.log("\n━━━ 3. SIGNED-IN đọc ━━━\n");
await createUserWithEmailAndPassword(
  auth,
  `zzrule2_${Date.now()}@probe.local`,
  "ZzProbe@123456"
);

await t("getDoc(draft) — signed-in", async () => {
  const s = await getDoc(doc(db, A, draftRef.id));
  return s.exists() ? "exists" : "missing";
});
await t("list tất cả articles — signed-in", async () => {
  const s = await getDocs(collection(db, A));
  return `${s.size} docs`;
});
await t("list where slug==zzrule-draft — signed-in", async () => {
  const s = await getDocs(query(collection(db, A), where("slug", "==", "zzrule-draft")));
  return `${s.size} docs`;
});
await t("list article_categories — signed-in", async () => {
  const s = await getDocs(collection(db, C));
  return `${s.size} docs`;
});

console.log("\n━━━ 4. DỌN DẸP ━━━\n");
await deleteDoc(doc(db, A, draftRef.id));
await deleteDoc(doc(db, A, pubRef.id));
console.log("  ✓ xoá 2 doc test");
await signOut(auth);
console.log("\n✓ Hoàn tất.");
