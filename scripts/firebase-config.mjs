#!/usr/bin/env node

/**
 * CẤU HÌNH FIREBASE DÙNG CHUNG cho các script Node.
 *
 * Toàn bộ script PHẢI dùng đúng project mà website đang chạy
 * (project trong `.env` → src/services/firebase.js).
 *
 * Ưu tiên:
 *  1. serviceAccountKey.json  — chỉ dùng được nếu key thuộc ĐÚNG project trong .env
 *  2. Firebase Web SDK + apiKey trong .env — luôn dùng được (bypass rules chỉ khi đã đăng nhập admin)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");

/** Đọc file .env và nạp vào process.env (không ghi đè biến đã có). */
export const loadEnv = async () => {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");

    raw.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const idx = trimmed.indexOf("=");
      if (idx === -1) return;

      const key = trimmed.slice(0, idx).trim();
      const value = trimmed
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      if (key && !process.env[key]) process.env[key] = value;
    });
  } catch {
    console.warn("⚠️  Không đọc được .env — dùng biến môi trường hiện có.");
  }
};

/** Config Firebase Web SDK lấy từ .env (giống hệt src/services/firebase.js). */
export const getWebConfig = () => ({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

/** ProjectId mà website đang dùng. */
export const getProjectId = () => process.env.VITE_FIREBASE_PROJECT_ID;

/**
 * Đọc serviceAccountKey.json (nếu có).
 * @returns {Promise<object|null>}
 */
export const readServiceAccount = async () => {
  try {
    const keyPath = path.join(ROOT, "serviceAccountKey.json");
    const raw = await fs.readFile(keyPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Service account có thuộc đúng project của website không?
 * @returns {Promise<{ok: boolean, sa: object|null, projectId: string, reason: string}>}
 */
export const checkServiceAccount = async () => {
  const projectId = getProjectId();
  const sa = await readServiceAccount();

  if (!sa) {
    return {
      ok: false,
      sa: null,
      projectId,
      reason: "Không có serviceAccountKey.json",
    };
  }

  if (sa.project_id !== projectId) {
    return {
      ok: false,
      sa,
      projectId,
      reason: `serviceAccountKey.json thuộc project "${sa.project_id}", không phải "${projectId}"`,
    };
  }

  return { ok: true, sa, projectId, reason: "" };
};

/**
 * Tạo firebase-admin app nếu service account khớp project.
 * @returns {Promise<object|null>} app hoặc null
 */
export const createAdminApp = async () => {
  const check = await checkServiceAccount();
  if (!check.ok) {
    console.warn(`⚠️  ${check.reason}`);
    return null;
  }

  const { initializeApp, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  const sa = check.sa;
  const app = initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key?.replace(/\\n/g, "\n"),
    }),
    projectId: sa.project_id,
  });

  return { app, db: getFirestore(app) };
};

/**
 * Tạo Firestore client Web SDK cho đúng project của website.
 * @returns {Promise<import("firebase/firestore").Firestore>}
 */
export const createWebDb = async () => {
  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");

  const config = getWebConfig();
  if (!config.apiKey || !config.projectId) {
    throw new Error("Thiếu cấu hình Firebase trong .env");
  }

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return getFirestore(app);
};
