#!/usr/bin/env node

/**
 * Kiểm tra tài khoản admin nào đăng nhập được + custom claims.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, getIdTokenResult } from "firebase/auth";

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

const CANDIDATES = [
  ["admin@gmail.com", "Admin@12345"],
  ["admin@gmail.com", "Admin@123456"],
  ["admin@gmail.com", "admin123"],
  ["admin@nhatminh.vn", "Admin@12345"],
  ["admin@nhatminh.vn", "admin123"],
  ["editor.test@nhatminh.vn", "ZzProbe@123456"],
];

for (const [email, pw] of CANDIDATES) {
  try {
    const c = await signInWithEmailAndPassword(auth, email, pw);
    const tr = await getIdTokenResult(c.user, true);
    const claims = Object.keys(tr.claims || {});
    console.log(`✓ ${email} / ${pw}`);
    console.log(`    uid=${c.user.uid}`);
    console.log(`    claims.admin=${tr.claims?.admin}`);
    console.log(`    claims keys=${JSON.stringify(claims)}`);
  } catch (e) {
    console.log(`✗ ${email} / ${pw} → ${e.code}`);
  }
}
