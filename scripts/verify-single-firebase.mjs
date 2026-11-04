#!/usr/bin/env node

/**
 * KIỂM TRA: toàn bộ website chỉ dùng MỘT Firebase duy nhất.
 *
 * 1. Source: chỉ src/services/firebase.js được gọi initializeApp()
 * 2. Bundle: chỉ có 1 lần khởi tạo Firebase App (kiểm tra chuỗi projectId)
 * 3. Import: mọi module dùng Firestore/Auth/Storage đều lấy từ @/services/firebase
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

const escapeRe = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const check = (label, ok, detail = "") => {
  if (ok) {
    passed += 1;
    console.log(`   ✓ ${label}`);
  } else {
    failed += 1;
    console.log(`   ✗ ${label} ${detail ? `— ${detail}` : ""}`);
  }
};

// ---------- Load .env ----------
const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
const env = {};
raw.split("\n").forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith("#")) return;
  const i = t.indexOf("=");
  if (i === -1) return;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
});

// ---------- 1. Source: initializeApp chỉ trong firebase.js ----------
console.log("\n━━━ 1. Source code ━━━\n");

const srcFiles = [];
const walk = async (dir) => {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(jsx?|mjs)$/.test(entry.name)) srcFiles.push(full);
  }
};
await walk(path.join(ROOT, "src"));

const initCallers = [];
const appConsumers = [];

for (const file of srcFiles) {
  const content = await fs.readFile(file, "utf8");
  const rel = path.relative(ROOT, file);

  // initializeApp( được gọi (không phải import)
  const initCalls = content.match(/(?<![.\w])initializeApp\s*\(/g) || [];
  if (initCalls.length) {
    initCallers.push({ file: rel, count: initCalls.length });
  }

  // getFirestore(app) / getAuth(app) / getStorage(app) với app tự định nghĩa
  const localInit = content.match(
    /(?:getFirestore|getAuth|getStorage)\s*\(\s*(?!app\b)[a-zA-Z_$][\w$]*\s*\)/g
  );
  if (localInit) {
    appConsumers.push({ file: rel, calls: localInit });
  }
}

check(
  "initializeApp() chỉ được gọi trong src/services/firebase.js",
  initCallers.length === 1 && initCallers[0].file === "src\\services\\firebase.js",
  initCallers.map((i) => `${i.file} (${i.count})`).join(", ")
);

check(
  "Không module nào tự tạo Firestore/Auth/Storage từ app riêng",
  appConsumers.length === 0,
  appConsumers.map((a) => `${a.file}: ${a.calls.join(", ")}`).join(" | ")
);

// ---------- 2. Tất cả import Firestore/Auth đi qua @/services/firebase ----------
console.log("\n━━━ 2. Import paths ━━━\n");

const firebaseImporters = [];
for (const file of srcFiles) {
  const content = await fs.readFile(file, "utf8");
  const rel = path.relative(ROOT, file);
  if (rel === "src\\services\\firebase.js") continue;

  const importsDb = /import\s*\{[^}]*\bdb\b[^}]*\}\s*from\s*["']([^"']+)["']/.test(content);
  const importsAuth = /import\s*\{[^}]*\bauth\b[^}]*\}\s*from\s*["']([^"']+)["']/.test(content);

  if (importsDb || importsAuth) {
    const matches = content.match(/import\s*\{[^}]*\b(?:db|auth)\b[^}]*\}\s*from\s*["']([^"']+)["']/g) || [];
    firebaseImporters.push({ file: rel, matches });
  }
}

const allFromShared = firebaseImporters.every((i) =>
  i.matches.every((m) => m.includes("@/services/firebase"))
);

check(
  "Mọi import db/auth đều từ '@/services/firebase'",
  allFromShared && firebaseImporters.length > 0,
  firebaseImporters
    .filter((i) => !i.matches.every((m) => m.includes("@/services/firebase")))
    .map((i) => i.file)
    .join(", ")
);

console.log(`   ℹ️  ${firebaseImporters.length} module import từ nguồn chung:`);
firebaseImporters.forEach((i) => console.log(`      - ${i.file}`));

// ---------- 3. Bundle: chỉ 1 Firebase App ----------
console.log("\n━━━ 3. Build output ━━━\n");

const distDir = path.join(ROOT, "dist", "assets");
let bundles = [];
try {
  bundles = (await fs.readdir(distDir)).filter((f) => f.endsWith(".js"));
} catch {
  console.log("   ⚠️  Chưa có dist/ — chạy `npm run build` trước.");
}

if (bundles.length) {
  const bundleContent = (
    await Promise.all(bundles.map((f) => fs.readFile(path.join(distDir, f), "utf8")))
  ).join("\n");

  const projectId = env.VITE_FIREBASE_PROJECT_ID;

  // Đếm số object config Firebase duy nhất trong bundle.
  // Mỗi object config chứa projectId + authDomain + storageBucket của cùng project.
  const configPattern = new RegExp(
    `apiKey:\s*\`"?'?${escapeRe(env.VITE_FIREBASE_API_KEY)}"?'?\`?.{0,400}?projectId:\s*\`"?'?${escapeRe(projectId)}`,
    "gs"
  );
  const configCount = (bundleContent.match(configPattern) || []).length;

  check(
    "Bundle chỉ có DUY NHẤT 1 object cấu hình Firebase",
    configCount === 1,
    `thực tế: ${configCount} object config`
  );

  // Không còn project khác trong bundle
  check(
    'Không chứa projectId cũ "nhat-minh-smart-home"',
    !bundleContent.includes("nhat-minh-smart-home")
  );

  // Không còn apiKey của project cũ
  const oldKey = "AIzaSyDcQtj8KLzw6o47Iq-CW1sAid-JTIusx8Y";
  check(
    "Bundle chỉ chứa apiKey của project hiện tại",
    bundleContent.includes(env.VITE_FIREBASE_API_KEY || "@@none@@")
  );
}

// ---------- 4. Cấu hình không trùng lặp ----------
console.log("\n━━━ 4. Config files ━━━\n");

const firebaserc = JSON.parse(
  await fs.readFile(path.join(ROOT, ".firebaserc"), "utf8")
);
check(
  '.firebaserc trỏ đúng project của .env',
  firebaserc.projects?.default === env.VITE_FIREBASE_PROJECT_ID,
  `${firebaserc.projects?.default} ≠ ${env.VITE_FIREBASE_PROJECT_ID}`
);

const firebaseJson = JSON.parse(
  await fs.readFile(path.join(ROOT, "firebase.json"), "utf8")
);
check(
  "firebase.json không tạo Firestore database mới (chỉ rules + indexes)",
  !!firebaseJson.firestore?.rules &&
    !!firebaseJson.firestore?.indexes &&
    !firebaseJson.firestore?.database
);

// scripts không được hardcode project khác
const scriptsDir = path.join(ROOT, "scripts");
const scriptFiles = (await fs.readdir(scriptsDir)).filter(
  (f) => f.endsWith(".mjs") && f !== "verify-single-firebase.mjs"
);
const hardcoded = [];
for (const f of scriptFiles) {
  const c = await fs.readFile(path.join(scriptsDir, f), "utf8");
  if (c.includes("nhat-minh-smart-home")) hardcoded.push(f);
}
check(
  "Không script nào hardcode project khác",
  hardcoded.length === 0,
  hardcoded.join(", ")
);

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`✅ PASS: ${passed}   ❌ FAIL: ${failed}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

process.exit(failed > 0 ? 1 : 0);
