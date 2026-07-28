#!/usr/bin/env node
// convert-to-alias.cjs — converts relative imports to @ alias
// Safe: skips .css, .svg, .png, .json and binary assets
// Run from project root: node scripts/convert-to-alias.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "src");
const ASSET_EXT_RE = /\.(css|scss|less|sass|svg|png|jpg|jpeg|gif|webp|ico|json|txt|md)$/i;

let filesScanned = 0;
let filesChanged = 0;
let totalChanges = 0;
const changes = [];

function normalizeDotSegments(relativePath) {
  const parts = relativePath.split(/[/\\]/);
  const stack = [];
  for (const part of parts) {
    if (part === "..") { stack.pop(); }
    else if (part !== ".") { stack.push(part); }
  }
  return stack.join("/");
}

function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jsx", ".js", ".tsx", ".ts"].includes(ext)) return;
  if (filePath.includes("node_modules")) return;

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  // Match import/export statements with relative paths
  // e.g. import Foo from './foo', import { A } from '../utils', export * from './utils'
  const relImportRe = /(\b(?:import|export)\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s*from\s+|\s*from\s+)['"])(\.{1,2}\/[^'"]+)(['"])/g;

  const dir = path.dirname(filePath);
  let newContent = content;
  let count = 0;
  let m;

  relImportRe.lastIndex = 0;
  while ((m = relImportRe.exec(content)) !== null) {
    const prefix = m[1];
    const rel    = m[2];
    const suffix = m[3];

    // Skip non-code assets
    if (ASSET_EXT_RE.test(rel)) continue;
    // Already using @ alias
    if (rel.startsWith("@/")) continue;

    // Normalize: remove leading ./ or ../, collapse ../
    const cleaned = rel.replace(/^\.\.?[\/\\]/, "");
    const normalized = normalizeDotSegments(cleaned);
    const alias = `@/${normalized}`;
    const replacement = prefix + alias + suffix;

    newContent = newContent.replace(m[0], replacement);
    count++;
  }

  if (count > 0) {
    fs.writeFileSync(filePath, newContent, "utf8");
    filesChanged++;
    totalChanges += count;
    changes.push({ file: path.relative(ROOT, filePath), count });
  }
  filesScanned++;
}

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (/^(node_modules|\.git|dist|build|\.next)$/.test(entry.name)) continue;
      walk(full);
    } else {
      convertFile(full);
    }
  }
}

console.log(`\n Scanning: ${ROOT}\n`);
walk(ROOT);

changes.forEach(({ file, count }) => console.log(`+ ${file}  (${count} changes)`));

console.log(
  `\nDone  — scanned ${filesScanned} files, changed ${filesChanged}, ` +
  `converted ${totalChanges} imports.\n`
);
