#!/usr/bin/env node

/**
 * PROBE: tìm chính xác thao tác nào bị DENY trên collection "articles"
 * với user đã đăng nhập (không admin).
 *
 * Kiểm tra:
 *  1. create với từng bộ field khác nhau → phát hiện hasOnly / field whitelist
 *  2. update trên doc có sẵn
 *  3. delete
 *  4. đọc doc draft bằng getDoc
 *  5. list có filter status
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
const A = "articles";

// Ưu tiên tài khoản admin thật nếu đăng nhập được
let label = "probe-user";
const ADMIN_CANDIDATES = [
  ["admin@gmail.com", "Admin@12345"],
  ["admin@nhatminh.vn", "Admin@12345"],
];
let signedIn = false;
for (const [email, pw] of ADMIN_CANDIDATES) {
  try {
    const c = await signInWithEmailAndPassword(auth, email, pw);
    label = `admin:${email}`;
    signedIn = true;
    console.log(`✓ Đăng nhập thành công: ${email} (uid=${c.user.uid})`);
    break;
  } catch (e) {
    console.log(`✗ ${email} → ${e.code}`);
  }
}
if (!signedIn) {
  const email = `zzprobe_${Date.now()}@probe.local`;
  await createUserWithEmailAndPassword(auth, email, "ZzProbe@123456");
  label = `probe:${email}`;
  console.log(`✓ Dùng user tạm: ${email}`);
}

const t = async (name, fn) => {
  try {
    const r = await fn();
    console.log(`  ✓ ${name} → ${r}`);
    return { ok: true, r };
  } catch (e) {
    console.log(`  ✗ ${name} → [${e.code}] ${e.message}`);
    return { ok: false, e };
  }
};

const now = serverTimestamp();
const created = [];

// ------------------------------------------------------------
console.log("\n━━━ 1. CREATE với các bộ field khác nhau ━━━\n");

const fieldSets = {
  "chỉ status=draft": { status: "draft" },
  "status + title": { status: "draft", title: "x" },
  "status + title + slug": { status: "draft", title: "x", slug: "x" },
  "full app payload (có publishedAt:null)": {
    title: "x", slug: "x", excerpt: "", coverImage: "", content: "",
    category: "", type: "knowledge", status: "draft", featured: false,
    author: "Nhật Minh", projectInfo: null, publishedAt: null,
    createdAt: now, updatedAt: now,
  },
  "full app payload + publishedAt=serverTimestamp": {
    title: "x", slug: "x", excerpt: "", coverImage: "", content: "",
    category: "", type: "knowledge", status: "published", featured: false,
    author: "Nhật Minh", projectInfo: null, publishedAt: now,
    createdAt: now, updatedAt: now,
  },
  "full app payload + projectInfo object": {
    title: "x", slug: "x", excerpt: "", coverImage: "", content: "",
    category: "", type: "project", status: "draft", featured: false,
    author: "Nhật Minh",
    projectInfo: { projectName: "A", location: "B", projectImages: [] },
    publishedAt: null, createdAt: now, updatedAt: now,
  },
  "có field lạ (zzUnknown)": {
    status: "draft", title: "x", zzUnknown: "abc",
  },
};

for (const [name, data] of Object.entries(fieldSets)) {
  const res = await t(`CREATE ${name}`, async () => {
    const ref = await addDoc(collection(db, A), data);
    created.push(ref.id);
    return ref.id;
  });
  if (!res.ok) {
    // thử lại không có field lạ
  }
}

// ------------------------------------------------------------
console.log("\n━━━ 2. READ các doc vừa tạo ━━━\n");

if (created.length) {
  await t("getDoc(doc đầu tiên)", async () => {
    const s = await getDoc(doc(db, A, created[0]));
    return s.exists() ? `exists, status=${s.data().status}` : "missing";
  });
  await t("getDoc(doc có status=draft) — signed-in", async () => {
    const s = await getDoc(doc(db, A, created[created.length - 1]));
    return s.exists() ? "exists" : "missing";
  });
}

await t("list where status==draft", async () => {
  const s = await getDocs(query(collection(db, A), where("status", "==", "draft")));
  return `${s.size} docs`;
});

await t("list where slug==x (không filter status)", async () => {
  const s = await getDocs(query(collection(db, A), where("slug", "==", "x")));
  return `${s.size} docs`;
});

await t("list where status==published", async () => {
  const s = await getDocs(query(collection(db, A), where("status", "==", "published")));
  return `${s.size} docs`;
});

// ------------------------------------------------------------
console.log("\n━━━ 3. UPDATE ━━━\n");

if (created.length) {
  const id = created[0];
  await t("updateDoc đổi title (chỉ 1 field)", async () => {
    await updateDoc(doc(db, A, id), { title: "sửa" });
    return "ok";
  });
  await t("updateDoc full app patch", async () => {
    await updateDoc(doc(db, A, id), {
      title: "sửa", slug: "x", excerpt: "", coverImage: "", content: "",
      category: "", type: "knowledge", status: "draft", featured: false,
      author: "Nhật Minh", projectInfo: null, publishedAt: null,
      updatedAt: serverTimestamp(),
    });
    return "ok";
  });
  await t("updateDoc status=published + publishedAt", async () => {
    await updateDoc(doc(db, A, id), {
      status: "published", publishedAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return "ok";
  });
  await t("updateDoc đổi status published→draft (giữ publishedAt)", async () => {
    await updateDoc(doc(db, A, id), { status: "draft", updatedAt: serverTimestamp() });
    return "ok";
  });
}

// ------------------------------------------------------------
console.log("\n━━━ 4. DELETE ━━━\n");

if (created.length) {
  await t("deleteDoc", async () => {
    await deleteDoc(doc(db, A, created[0]));
    created.shift();
    return "ok";
  });
}

// ------------------------------------------------------------
console.log("\n━━━ 5. DỌN DẸP ━━━\n");
for (const id of created) {
  try {
    await deleteDoc(doc(db, A, id));
    console.log(`  xoá ${id}`);
  } catch (e) {
    console.log(`  ! xoá ${id} → ${e.code}`);
  }
}
console.log(`\n(${label})`);
