#!/usr/bin/env node

/**
 * Tối ưu toàn bộ ảnh trong public/images:
 * - Quét đệ quy PNG, JPG, JPEG, WEBP
 * - Resize ảnh quá lớn
 * - Chuyển sang WebP
 * - Giữ nguyên cấu trúc thư mục
 * - Không ghi đè nếu ảnh WebP mới nặng hơn ảnh cũ
 *
 * Cài Sharp:
 * npm install -D sharp
 *
 * Chạy:
 * node optimize-images.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const config = {
  inputFolder: "public/picture",
  maxWidth: 1600,
  maxHeight: 1200,
  quality: 76,
  effort: 5,
};

async function getAllImages(folderPath) {
  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      const childFiles = await getAllImages(fullPath);
      files.push(...childFiles);
      continue;
    }

    if (
      entry.isFile() &&
      /\.(png|jpg|jpeg|webp)$/i.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeImage(filePath, rootFolder) {
  const extension = path.extname(filePath).toLowerCase();

  const outputPath =
    extension === ".webp"
      ? filePath
      : filePath.slice(0, -extension.length) + ".webp";

  const inputStats = await fs.stat(filePath);

  const metadata = await sharp(filePath, {
    failOn: "none",
  }).metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;

  const shouldResize =
    width > config.maxWidth ||
    height > config.maxHeight;

  const tempPath = `${outputPath}.temp-${Date.now()}`;

  let imagePipeline = sharp(filePath, {
    failOn: "none",
  }).rotate();

  if (shouldResize) {
    imagePipeline = imagePipeline.resize({
      width: config.maxWidth,
      height: config.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await imagePipeline
    .webp({
      quality: config.quality,
      effort: config.effort,
      smartSubsample: true,
    })
    .toFile(tempPath);

  const outputStats = await fs.stat(tempPath);

  /*
   * Nếu file ban đầu đã là WebP và bản mới không nhẹ hơn,
   * giữ nguyên ảnh cũ.
   */
  if (
    extension === ".webp" &&
    outputStats.size >= inputStats.size
  ) {
    await fs.unlink(tempPath);

    console.log(
      `Bỏ qua: ${path.relative(rootFolder, filePath)} ` +
        `(${formatBytes(inputStats.size)})`
    );

    return {
      oldSize: inputStats.size,
      newSize: inputStats.size,
      optimized: false,
    };
  }

  if (await fileExists(outputPath)) {
    await fs.unlink(outputPath);
  }

  await fs.rename(tempPath, outputPath);

  const savedBytes =
    inputStats.size - outputStats.size;

  const savedPercent =
    inputStats.size > 0
      ? (savedBytes / inputStats.size) * 100
      : 0;

  console.log(
    `Đã tối ưu: ${path.relative(rootFolder, filePath)}`
  );

  console.log(
    `  ${formatBytes(inputStats.size)} → ` +
      `${formatBytes(outputStats.size)} ` +
      `(${savedPercent.toFixed(1)}% nhẹ hơn)`
  );

  return {
    oldSize: inputStats.size,
    newSize: outputStats.size,
    optimized: true,
  };
}

async function main() {
  const rootFolder = path.resolve(
    process.cwd(),
    config.inputFolder
  );

  try {
    const stats = await fs.stat(rootFolder);

    if (!stats.isDirectory()) {
      throw new Error("Đường dẫn không phải thư mục.");
    }
  } catch {
    console.error(
      `Không tìm thấy thư mục: ${rootFolder}`
    );

    process.exit(1);
  }

  console.log(`Thư mục ảnh: ${rootFolder}`);
  console.log(
    `Kích thước tối đa: ` +
      `${config.maxWidth} × ${config.maxHeight}`
  );
  console.log(`Chất lượng WebP: ${config.quality}`);
  console.log("");

  const imageFiles = await getAllImages(rootFolder);

  if (imageFiles.length === 0) {
    console.log("Không tìm thấy ảnh.");
    return;
  }

  let totalOldSize = 0;
  let totalNewSize = 0;
  let optimizedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const filePath of imageFiles) {
    try {
      const result = await optimizeImage(
        filePath,
        rootFolder
      );

      totalOldSize += result.oldSize;
      totalNewSize += result.newSize;

      if (result.optimized) {
        optimizedCount += 1;
      } else {
        skippedCount += 1;
      }
    } catch (error) {
      errorCount += 1;

      console.error(
        `Lỗi: ${path.relative(rootFolder, filePath)}`
      );

      console.error(error.message);
    }
  }

  const totalSaved =
    totalOldSize - totalNewSize;

  const totalSavedPercent =
    totalOldSize > 0
      ? (totalSaved / totalOldSize) * 100
      : 0;

  console.log("");
  console.log("Hoàn tất");
  console.log(`Tổng số ảnh: ${imageFiles.length}`);
  console.log(`Đã tối ưu: ${optimizedCount}`);
  console.log(`Bỏ qua: ${skippedCount}`);
  console.log(`Lỗi: ${errorCount}`);

  console.log(
    `Dung lượng: ${formatBytes(totalOldSize)} → ` +
      `${formatBytes(totalNewSize)}`
  );

  console.log(
    `Giảm được: ${totalSavedPercent.toFixed(1)}%`
  );

  console.log("");
  console.log(
    "PNG và JPG gốc vẫn được giữ lại để tránh mất dữ liệu."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});