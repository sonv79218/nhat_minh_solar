#!/usr/bin/env node

/**
 * Tiện ích: liệt kê / cập nhật trạng thái bài viết (dùng cho kiểm thử).
 *
 *   node scripts/manage-articles.mjs list
 *   node scripts/manage-articles.mjs publish <slug>
 *   node scripts/manage-articles.mjs draft <slug>
 *   node scripts/manage-articles.mjs delete <slug>
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
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

const cmd = process.argv[2] || "list";
const slug = process.argv[3];

const email = `zzmgmt_${Date.now()}@probe.local`;
try {
  await createUserWithEmailAndPassword(auth, email, "ZzProbe@123456");
} catch {
  await signInWithEmailAndPassword(auth, "editor.test@nhatminh.vn", "ZzProbe@123456");
}

const snap = await getDocs(collection(db, "articles"));

if (cmd === "list") {
  console.log(`\n${snap.size} bài viết:\n`);
  snap.docs.forEach((d) => {
    const data = d.data();
    console.log(`  ${d.id}  [${data.status}]  ${data.slug}  — ${data.title}`);
  });
} else if (cmd === "publish" || cmd === "draft") {
  const target = snap.docs.find((d) => d.data().slug === slug);
  if (!target) {
    console.error(`❌ Không tìm thấy slug "${slug}"`);
    process.exit(1);
  }
  const status = cmd === "publish" ? "published" : "draft";
  await updateDoc(doc(db, "articles", target.id), {
    status,
    updatedAt: serverTimestamp(),
    ...(status === "published" ? { publishedAt: serverTimestamp() } : {}),
  });
  console.log(`✓ ${target.id} → ${status}`);
} else if (cmd === "delete") {
  const target = snap.docs.find((d) => d.data().slug === slug);
  if (!target) {
    console.error(`❌ Không tìm thấy slug "${slug}"`);
    process.exit(1);
  }
  await deleteDoc(doc(db, "articles", target.id));
  console.log(`✓ đã xoá ${target.id}`);
} else {
  console.error("Usage: node scripts/manage-articles.mjs list|publish|draft|delete <slug>");
  process.exit(1);
}
