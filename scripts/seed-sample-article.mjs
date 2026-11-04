#!/usr/bin/env node

/**
 * Tạo bài viết mẫu (dùng để kiểm thử giao diện).
 *
 * Chạy:
 *   node scripts/seed-sample-article.mjs
 *
 * Idempotent — nếu bài viết có slug đã tồn tại thì bỏ qua.
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

const SAMPLE = {
  title: "Công trình điện mặt trời 20kWp tại nhà máy ABC — Bắc Ninh",
  slug: "cong-trinh-dien-mat-troi-20kwp-nha-may-abc",
  excerpt:
    "Hệ thống điện mặt trời hòa lưới 20kWp cho nhà máy ABC tại KCN Yên Phong, giúp giảm 35% chi phí điện hàng tháng.",
  coverImage:
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
  content: `
    <h2>Giới thiệu dự án</h2>
    <p>Nhật Minh vừa hoàn thành <strong>hệ thống điện mặt trời hòa lưới 20kWp</strong> cho nhà máy ABC tại Khu công nghiệp Yên Phong, Bắc Ninh.</p>
    <figure class="article-figure">
      <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1000&q=80" alt="Tấm pin điện mặt trời trên mái nhà xưởng" loading="lazy" />
      <figcaption class="article-figcaption">Hệ thống tấm pin được lắp đặt trên mái nhà xưởng</figcaption>
    </figure>
    <h3>Quá trình thi công</h3>
    <p>Đội ngũ kỹ thuật đã tiến hành khảo sát mái nhà, thiết kế và lắp đặt trong <em>3 ngày</em> làm việc.</p>
    <ul>
      <li>Khảo sát và thiết kế hệ thống</li>
      <li>Lắp đặt giàn giá và tấm pin</li>
      <li>Đấu nối inverter và tủ điện</li>
      <li>Nghiệm thu và bàn giao</li>
    </ul>
    <h3>Thông số kỹ thuật</h3>
    <div class="article-table-wrap">
      <table class="article-table">
        <thead><tr><th>Thông số</th><th>Chi tiết</th></tr></thead>
        <tbody>
          <tr><td>Công suất</td><td>20 kWp</td></tr>
          <tr><td>Số tấm pin</td><td>40 tấm</td></tr>
          <tr><td>Thương hiệu tấm pin</td><td>Longi</td></tr>
          <tr><td>Inverter</td><td>Huawei SUN2000</td></tr>
        </tbody>
      </table>
    </div>
    <h3>Kết quả vận hành</h3>
    <p>Sau 3 tháng vận hành, hệ thống giúp giảm <strong>35% chi phí điện</strong> và ưu tiên tự tiêu thụ 72% sản lượng điện mặt trời.</p>
    <p>Chi tiết tham khảo tại <a href="https://nhatminhdienmattroi.com/contact">trang liên hệ</a> của Nhật Minh.</p>
  `,
  category: "cong-trinh-dien-mat-troi",
  type: "project",
  status: "published",
  featured: true,
  author: "Nhật Minh",
  projectInfo: {
    projectName: "Nhà máy ABC",
    location: "KCN Yên Phong, Bắc Ninh",
    completionDate: "2026-08-15",
    systemCapacity: "20",
    systemType: "hoa-luoi",
    panelBrand: "Longi",
    inverterBrand: "Huawei SUN2000",
    batteryCapacity: "",
    panelCount: "40",
    projectImages: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    ],
    projectDescription:
      "Khảo sát mái nhà xưởng 1.200m², lắp đặt 40 tấm pin Longi và inverter Huawei SUN2000 20kW trong 3 ngày.",
    projectResult:
      "Giảm 35% chi phí điện hàng tháng, tự tiêu thụ đạt 72%, thời gian hoàn vốn dự kiến 4,5 năm.",
  },
};

const main = async () => {
  await loadEnv();

  console.log(`🎯 Project: ${getProjectId()}`);

  // --- Cách 1: firebase-admin (bypass rules) ---
  const admin = await createAdminApp();

  if (admin) {
    const col = admin.db.collection("articles");
    const existing = await col
      .where("slug", "==", SAMPLE.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log("ℹ️  Bài viết mẫu đã tồn tại — bỏ qua.");
      process.exit(0);
    }

    const now = new Date();
    await col.add({ ...SAMPLE, createdAt: now, updatedAt: now, publishedAt: now });

    console.log(`✅ Đã tạo bài viết mẫu: /bai-viet/${SAMPLE.slug}`);
    process.exit(0);
  }

  // --- Cách 2: Firebase Web SDK (cần đăng nhập admin) ---
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ Thiếu ADMIN_EMAIL / ADMIN_PASSWORD — không thể tạo bài viết mẫu."
    );
    process.exit(1);
  }

  const db = await createWebDb();
  const { getApp } = await import("firebase/app");
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  const { collection, query, where, getDocs, addDoc, serverTimestamp } =
    await import("firebase/firestore");

  await signInWithEmailAndPassword(getAuth(getApp()), email, password);

  const col = collection(db, "articles");
  const existing = await getDocs(
    query(col, where("slug", "==", SAMPLE.slug))
  );

  if (!existing.empty) {
    console.log("ℹ️  Bài viết mẫu đã tồn tại — bỏ qua.");
    process.exit(0);
  }

  await addDoc(col, {
    ...SAMPLE,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: serverTimestamp(),
  });

  console.log(`✅ Đã tạo bài viết mẫu: /bai-viet/${SAMPLE.slug}`);

  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Lỗi:", error);
  process.exit(1);
});
