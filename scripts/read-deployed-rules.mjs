#!/usr/bin/env node

/**
 * Đọc Firestore Security Rules ĐANG DEPLOY (chỉ ĐỌC).
 * Dùng access_token của Firebase CLI trong configstore (nếu còn hạn),
 * fallback sang refresh_token.
 */

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const project = env.VITE_FIREBASE_PROJECT_ID;

const cfgPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
const cfg = JSON.parse(await fs.readFile(cfgPath, "utf8"));
const toks = cfg.tokens || {};

const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi";

let accessToken = toks.access_token;
const expiresAt = toks.expires_at ? Number(toks.expires_at) : 0;

console.log(`access_token có hạn đến: ${expiresAt ? new Date(expiresAt).toISOString() : "?"}`);
console.log(`hiện tại: ${new Date().toISOString()}`);

if (!accessToken) {
  console.log("→ không có access_token, thử refresh...");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: toks.refresh_token,
      grant_type: "refresh_token",
      scope: (toks.scopes || []).join(" ") || "https://www.googleapis.com/auth/firebase",
    }),
  });
  const j = await res.json();
  if (!j.access_token) {
    console.error("❌ Refresh thất bại:", JSON.stringify(j));
    process.exit(1);
  }
  accessToken = j.access_token;
  console.log("✓ refresh OK");
}

const API = "https://firebaserules.googleapis.com/v1";
const call = async (url) => {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  const t = await r.text();
  let j = null;
  try { j = JSON.parse(t); } catch {}
  return { status: r.status, json: j, text: t };
};

const rel = await call(`${API}/projects/${project}/releases/cloud.firestore`);
if (rel.status !== 200) {
  console.error(`HTTP ${rel.status}: ${rel.text.slice(0, 600)}`);
  process.exit(1);
}
console.log(`\nrulesetName: ${rel.json.rulesetName}\n`);
const target = await call(`${API}/projects/${project}/rulesets/${rel.json.rulesetName}`);
console.log("── RULES ĐANG CHẠY THẬT ──\n");
console.log(target.json?.source?.files?.[0]?.content || "(không đọc được)");
