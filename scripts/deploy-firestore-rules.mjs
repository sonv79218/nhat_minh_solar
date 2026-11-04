#!/usr/bin/env node

/**
 * Deploy Firestore Security Rules cho ĐÚNG project mà website đang dùng
 * (project trong `.env` → src/services/firebase.js).
 *
 * Ưu tiên:
 *  1. Firebase CLI (`npx firebase deploy --only firestore:rules`)
 *  2. Firebase Rules API với access token từ serviceAccountKey.json
 *     (chỉ dùng được nếu key thuộc đúng project)
 *
 * Chạy:
 *   node scripts/deploy-firestore-rules.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  loadEnv,
  getProjectId,
  getWebConfig,
  readServiceAccount,
} from "./firebase-config.mjs";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SCOPE = "https://www.googleapis.com/auth/firebase";
const RULES_API = "https://firebaserules.googleapis.com/v1";
const RELEASE_ID = "cloud.firestore";

const readRules = async () =>
  fs.readFile(path.join(ROOT, "firestore.rules"), "utf8");

const readApiKey = async () => {
  const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
  const match = raw.match(/VITE_FIREBASE_API_KEY\s*=\s*(.+)/);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
};

/** Deploy qua Firebase CLI. */
const deployViaCli = async (projectId) => {
  const { stdout, stderr } = await execFileAsync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "firebase",
      "deploy",
      "--only",
      "firestore:rules",
      "--project",
      projectId,
    ],
    {
      cwd: ROOT,
      env: {
        ...process.env,
        FIREBASE_CLI_DISABLE_UPDATE_CHECK: "true",
      },
      shell: process.platform === "win32",
      maxBuffer: 1024 * 1024 * 10,
    }
  );

  return { stdout, stderr };
};

/** Deploy qua Firebase Rules API (dùng service account access token). */
const deployViaApi = async (projectId) => {
  const sa = await readServiceAccount();
  if (!sa) throw new Error("Không có serviceAccountKey.json");
  if (sa.project_id !== projectId) {
    throw new Error(
      `serviceAccountKey.json thuộc project "${sa.project_id}" — không thể deploy cho "${projectId}".`
    );
  }

  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials: {
      client_email: sa.client_email,
      private_key: sa.private_key?.replace(/\\n/g, "\n"),
    },
    scopes: [SCOPE],
  });

  const client = await auth.getClient();
  const headers = await client.getRequestHeaders();

  const apiKey = await readApiKey();
  const withKey = (url) =>
    apiKey ? `${url}${url.includes("?") ? "&" : "?"}key=${apiKey}` : url;

  const call = async (url, options = {}) => {
    const res = await fetch(withKey(url), {
      ...options,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const text = await res.text();
    let body = text;
    try {
      body = JSON.parse(text);
    } catch {
      /* giữ nguyên text */
    }

    return { ok: res.ok, status: res.status, body };
  };

  const rules = await readRules();
  const rulesetName = `ruleset-${Date.now()}`;

  const rulesetRes = await call(`${RULES_API}/projects/${projectId}/rulesets`, {
    method: "POST",
    body: JSON.stringify({
      name: rulesetName,
      source: { files: [{ name: "firestore.rules", content: rules }] },
    }),
  });

  if (!rulesetRes.ok) {
    throw new Error(
      `Upload ruleset thất bại (${rulesetRes.status}): ${JSON.stringify(
        rulesetRes.body
      )}`
    );
  }

  const createdRuleset = rulesetRes.body.name || rulesetName;
  const releasePath = `${RULES_API}/projects/${projectId}/releases/${RELEASE_ID}`;

  const updateRes = await call(releasePath, {
    method: "PATCH",
    body: JSON.stringify({
      name: RELEASE_ID,
      rulesetName: createdRuleset,
    }),
  });

  if (updateRes.ok) {
    return `✅ Đã deploy Firestore Security Rules!\n   Project: ${projectId}\n   Ruleset: ${createdRuleset}`;
  }

  if (updateRes.status === 404) {
    const createRes = await call(`${RULES_API}/projects/${projectId}/releases`, {
      method: "POST",
      body: JSON.stringify({ name: RELEASE_ID, rulesetName: createdRuleset }),
    });

    if (createRes.ok) {
      return `✅ Đã tạo & deploy Firestore Security Rules!\n   Project: ${projectId}\n   Ruleset: ${createdRuleset}`;
    }

    throw new Error(
      `Tạo release thất bại (${createRes.status}): ${JSON.stringify(
        createRes.body
      )}`
    );
  }

  throw new Error(
    `Cập nhật release thất bại (${updateRes.status}): ${JSON.stringify(
      updateRes.body
    )}`
  );
};

const main = async () => {
  await loadEnv();

  const projectId = getProjectId();
  console.log(`🎯 Deploy rules → ${projectId}`);
  console.log(`   API key: ${getWebConfig().apiKey?.slice(0, 12)}...`);

  // 1. Firebase CLI
  try {
    console.log("▶ Thử Firebase CLI...");
    const { stdout, stderr } = await deployViaCli(projectId);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    console.log("✅ Deploy thành công (CLI)!");
    process.exit(0);
  } catch (error) {
    const msg = error.message || "";
    console.log(`⚠️  CLI thất bại: ${msg.split("\n")[0]}`);

    if (/invalid authentication credentials|401|Unauthorized|credential/i.test(msg)) {
      console.log(
        [
          "",
          "   → Phiên đăng nhập Firebase CLI đã hết hạn (token expired / revoked).",
          "   → Hãy chạy: npx firebase login",
          "     (mở trình duyệt, đăng nhập tài khoản có quyền trên project này)",
          "",
        ].join("\n")
      );
    }
  }

  // 2. Firebase Rules API
  try {
    console.log("▶ Thử Firebase Rules API...");
    console.log(await deployViaApi(projectId));
    process.exit(0);
  } catch (error) {
    console.log(`⚠️  Rules API thất bại: ${error.message}`);
  }

  console.error(
    [
      "",
      "❌ Không deploy được tự động. Cách thủ công:",
      `   1. Mở Firebase Console → project "${projectId}"`,
      "   2. Firestore Database → Rules",
      "   3. Dán nội dung file firestore.rules rồi Publish",
      "",
      "   Hoặc dùng CLI (sau khi đăng nhập lại):",
      `   npx firebase deploy --only firestore:rules --project ${projectId}`,
    ].join("\n")
  );
  process.exit(1);
};

main().catch((error) => {
  console.error("❌ Lỗi:", error.message || error);
  process.exit(1);
});
