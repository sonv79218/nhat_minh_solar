#!/usr/bin/env node

/**
 * Tạo dữ liệu danh mục bài viết mặc định trong Firestore.
 *
 * Chạy:
 *   node scripts/seed-article-categories.mjs
 *
 * Idempotent — chạy lại không tạo trùng (theo slug).
 * Ghi vào ĐÚNG project mà website đang dùng (project trong .env).
 */

import {
  loadEnv,
  getProjectId,
  createAdminApp,
  createWebDb,
} from "./firebase-config.mjs";

const DEFAULT_CATEGORIES = [
  {
    name: "Công trình điện mặt trời",
    slug: "cong-trinh-dien-mat-troi",
    description: "Các dự án Nhật Minh đã triển khai thực tế cho khách hàng.",
    icon: "Building2",
    order: 1,
  },
  {
    name: "Điện mặt trời hòa lưới",
    slug: "dien-mat-troi-hoa-luoi",
    description: "Kiến thức và giải pháp hệ thống điện mặt trời hòa lưới.",
    icon: "Zap",
    order: 2,
  },
  {
    name: "Điện mặt trời Hybrid",
    slug: "dien-mat-troi-hybrid",
    description: "Hệ thống kết hợp điện lưới và pin lưu trữ năng lượng.",
    icon: "BatteryCharging",
    order: 3,
  },
  {
    name: "Điện mặt trời độc lập",
    slug: "dien-mat-troi-doc-lap",
    description: "Giải pháp sử dụng điện không phụ thuộc lưới điện.",
    icon: "Sun",
    order: 4,
  },
  {
    name: "Pin lưu trữ năng lượng",
    slug: "pin-luu-tru-nang-luong",
    description: "Kiến thức về battery, lithium và dung lượng lưu trữ.",
    icon: "BatteryFull",
    order: 5,
  },
  {
    name: "Kiến thức điện mặt trời",
    slug: "kien-thuc-dien-mat-troi",
    description: "Hướng dẫn, tư vấn, kinh nghiệm sử dụng và bảo trì hệ thống.",
    icon: "BookOpen",
    order: 6,
  },
];

const main = async () => {
  await loadEnv();

  const projectId = getProjectId();
  console.log(`🎯 Project: ${projectId}`);

  // --- Cách 1: firebase-admin (bypass rules) ---
  const admin = await createAdminApp();

  if (admin) {
    const col = admin.db.collection("article_categories");
    const existing = await col.get();
    const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

    let created = 0;
    let skipped = 0;

    for (const cat of DEFAULT_CATEGORIES) {
      if (existingSlugs.has(cat.slug)) {
        skipped += 1;
        continue;
      }

      await col.add({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      created += 1;
    }

    console.log(
      `✅ Đã tạo ${created} danh mục, bỏ qua ${skipped} danh mục đã tồn tại.`
    );
    process.exit(0);
  }

  // --- Cách 2: Web SDK (cần đăng nhập admin) ---
  console.log("ℹ️  Không có service account cho project này — dùng Web SDK.");
  console.log(
    "   Đăng nhập admin trước: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-article-categories.mjs"
  );

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ Thiếu ADMIN_EMAIL / ADMIN_PASSWORD — không thể ghi danh mục."
    );
    process.exit(1);
  }

  const db = await createWebDb();
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  const { getApp } = await import("firebase/app");

  const auth = getAuth(getApp());
  await signInWithEmailAndPassword(auth, email, password);

  const { collection, getDocs, addDoc, serverTimestamp } = await import(
    "firebase/firestore"
  );

  const col = collection(db, "article_categories");
  const existing = await getDocs(col);
  const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

  let created = 0;
  let skipped = 0;

  for (const cat of DEFAULT_CATEGORIES) {
    if (existingSlugs.has(cat.slug)) {
      skipped += 1;
      continue;
    }

    await addDoc(col, {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    created += 1;
  }

  console.log(
    `✅ Đã tạo ${created} danh mục, bỏ qua ${skipped} danh mục đã tồn tại.`
  );
  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Lỗi:", error.message || error);
  process.exit(1);
});
