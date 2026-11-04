#!/usr/bin/env node

/**
 * Tạo tài khoản test (không admin) để kiểm thử frontend end-to-end.
 * Tài khoản này KHÔNG có custom claim admin — đúng theo mô hình rules mới.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

const EMAIL = process.env.TEST_EMAIL || "editor.test@nhatminh.vn";
const PASSWORD = process.env.TEST_PASSWORD || "ZzProbe@123456";

try {
  await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
  console.log(`✓ Đã tạo user: ${EMAIL}`);
} catch (e) {
  console.log(`· ${e.code} — thử đăng nhập...`);
  const c = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
  console.log(`✓ Đăng nhập được: ${c.user.email} (uid=${c.user.uid})`);
}

console.log(`\nEMAIL=${EMAIL}`);
console.log(`PASSWORD=${PASSWORD}`);
