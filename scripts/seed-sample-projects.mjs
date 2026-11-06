#!/usr/bin/env node

/**
 * Thêm công trình mẫu vào Firestore mà không ghi đè dữ liệu hiện có.
 *
 * Chạy:
 *   npm run seed:projects
 *
 * Script kiểm tra slug trước mỗi lần thêm nên có thể chạy lại an toàn.
 */

import process from "node:process";
import { SAMPLE_PROJECTS } from "../src/features/articles/data/sampleProjects.js";
import {
  loadEnv,
  getProjectId,
  createAdminApp,
  createWebDb,
} from "./firebase-config.mjs";

const nowFields = (now) => ({
  createdAt: now,
  updatedAt: now,
  publishedAt: now,
});

const articlePayload = (project) => ({
  ...project,
  content: `
    <h2>Giới thiệu công trình</h2>
    <p>${project.excerpt}</p>
    <h2>Quá trình triển khai</h2>
    <p>${project.projectInfo.projectDescription}</p>
    <h2>Kết quả vận hành</h2>
    <p>${project.projectInfo.projectResult}</p>
  `,
  category: "cong-trinh-dien-mat-troi",
  type: "project",
  status: "published",
  featured: false,
  author: "Nhật Minh",
});

const seedWithAdmin = async (admin) => {
  const collection = admin.db.collection("articles");
  let added = 0;

  for (const project of SAMPLE_PROJECTS) {
    const existing = await collection
      .where("slug", "==", project.slug)
      .limit(1)
      .get();

    if (!existing.empty) {
      console.log(`ℹ️  Đã tồn tại — bỏ qua: ${project.slug}`);
      continue;
    }

    const now = new Date();
    await collection.add({ ...articlePayload(project), ...nowFields(now) });
    added += 1;
    console.log(`✅ Đã thêm: /bai-viet/${project.slug}`);
  }

  return added;
};

const seedWithWebSdk = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Thiếu ADMIN_EMAIL / ADMIN_PASSWORD — không thể tạo dữ liệu mẫu."
    );
  }

  const db = await createWebDb();
  const { getApp } = await import("firebase/app");
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  const { collection, query, where, getDocs, addDoc, serverTimestamp } =
    await import("firebase/firestore");

  await signInWithEmailAndPassword(getAuth(getApp()), email, password);

  const articles = collection(db, "articles");
  let added = 0;

  for (const project of SAMPLE_PROJECTS) {
    const existing = await getDocs(
      query(articles, where("slug", "==", project.slug))
    );

    if (!existing.empty) {
      console.log(`ℹ️  Đã tồn tại — bỏ qua: ${project.slug}`);
      continue;
    }

    await addDoc(articles, {
      ...articlePayload(project),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(),
    });
    added += 1;
    console.log(`✅ Đã thêm: /bai-viet/${project.slug}`);
  }

  return added;
};

const main = async () => {
  await loadEnv();
  console.log(`🎯 Project: ${getProjectId()}`);

  const admin = await createAdminApp();
  const added = admin
    ? await seedWithAdmin(admin)
    : await seedWithWebSdk();

  console.log(`Hoàn tất: thêm ${added}/${SAMPLE_PROJECTS.length} công trình mẫu.`);
};

main().catch((error) => {
  console.error("❌ Lỗi:", error);
  process.exitCode = 1;
});
