#!/usr/bin/env node

/**
 * Tạo/cập nhật public/sitemap.xml từ Firestore.
 * Chỉ thêm các bài viết có status === "published".
 *
 * Chạy:
 *   node scripts/generate-sitemap.mjs
 *
 * Đọc từ ĐÚNG project mà website đang dùng (project trong .env):
 *  1. firebase-admin — nếu serviceAccountKey.json thuộc đúng project
 *  2. Firebase Web SDK — luôn dùng được với apiKey trong .env
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import {
  loadEnv,
  getProjectId,
  createAdminApp,
  createWebDb,
} from "./firebase-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SITE_URL = "https://nhatminhdienmattroi.com";

const STATIC_URLS = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/contact", priority: "0.8", changefreq: "monthly" },
  { loc: "/tinh-giai-phap", priority: "0.9", changefreq: "weekly" },
  { loc: "/solutions", priority: "0.8", changefreq: "weekly" },
  { loc: "/bai-viet", priority: "0.9", changefreq: "daily" },
];

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toDateString = (value) => {
  if (!value) return null;
  const d = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

/**
 * Lấy danh sách bài viết published.
 */
const fetchPublishedArticles = async () => {
  // --- Cách 1: firebase-admin (bypass rules) ---
  const admin = await createAdminApp();

  if (admin) {
    try {
      const snapshot = await admin.db
        .collection("articles")
        .where("status", "==", "published")
        .get();

      return snapshot.docs.map((d) => d.data());
    } catch (error) {
      console.warn("⚠️  firebase-admin không đọc được:", error.message);
    }
  }

  // --- Cách 2: Firebase Web SDK ---
  try {
    const db = await createWebDb();
    const { collection, getDocs, query, where } = await import(
      "firebase/firestore"
    );

    const snapshot = await getDocs(
      query(collection(db, "articles"), where("status", "==", "published"))
    );

    return snapshot.docs.map((d) => d.data());
  } catch (error) {
    console.warn("⚠️  Không đọc được Firestore:", error.message);
    return [];
  }
};

const main = async () => {
  await loadEnv();

  console.log(`🎯 Project: ${getProjectId()}`);
  console.log("🔄 Đang lấy bài viết đã xuất bản...");

  const articles = await fetchPublishedArticles();

  console.log(`✅ Tìm thấy ${articles.length} bài viết đã xuất bản.`);

  const urls = [
    ...STATIC_URLS,
    ...articles
      .filter((a) => a.slug)
      .map((a) => ({
        loc: `/bai-viet/${a.slug}`,
        priority: a.featured ? "0.9" : "0.7",
        changefreq: "weekly",
        lastmod: toDateString(a.updatedAt || a.publishedAt),
      })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${u.loc}`)}</loc>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
    }
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outPath = path.join(ROOT, "public", "sitemap.xml");
  await fs.writeFile(outPath, xml, "utf8");

  console.log(`📄 Đã ghi sitemap.xml (${urls.length} URLs).`);

  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Lỗi:", error);
  process.exit(1);
});
