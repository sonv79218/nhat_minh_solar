#!/usr/bin/env node

/**
 * Test Firestore Security Rules (firestore.rules) bằng Firestore Emulator.
 *
 * Dùng REST API của emulator + idToken từ Auth Emulator → kết quả
 * xác định (HTTP status) và không bị "offline cache" gây treo.
 *
 * Chạy emulator trước:
 *   npm run emulators
 *
 * Chạy test:
 *   npm run test:rules
 */

import process from "node:process";

const FIRESTORE_HOST = "127.0.0.1:8085";
const AUTH_HOST = "127.0.0.1:9099";
const PROJECT = "demo-nhat-minh";

const FS = `http://${FIRESTORE_HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;
const IDENTITY = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1`;
const AUTH_ADMIN = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/projects/${PROJECT}`;

// API key giả — Auth Emulator chấp nhận bất kỳ apiKey hợp lệ
const API_KEY = "fake-api-key";

let passed = 0;
let failed = 0;

const check = (label, condition, detail = "") => {
  if (condition) {
    passed += 1;
    console.log(`   ✓ ${label}`);
  } else {
    failed += 1;
    console.log(`   ✗ ${label} ${detail ? `— ${detail}` : ""}`);
  }
};

/** Gọi Firestore REST, trả về { status, body }. */
const fsRequest = async (method, path, { token, body } = {}) => {
  const res = await fetch(`${FS}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }

  return { status: res.status, body: json, text };
};

/** Ghi doc bằng REST (token "owner" = bypass rules trong emulator). */
const seedDoc = async (collectionName, id, data) => {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] =
      typeof value === "number"
        ? { integerValue: String(value) }
        : { stringValue: String(value) };
  }

  const res = await fsRequest("PATCH", `/${collectionName}/${id}`, {
    token: "owner",
    body: { fields },
  });

  if (res.status >= 300) {
    throw new Error(
      `Seed ${collectionName}/${id} thất bại (${res.status}): ${res.text}`
    );
  }
};

/** Tạo user trong Auth Emulator, trả về { uid, idToken }. */
const createUser = async (email, password) => {
  const res = await fetch(`${IDENTITY}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const json = await res.json();

  if (json.error?.message === "EMAIL_EXISTS") {
    // User đã tồn tại từ lần chạy trước → đăng nhập lại
    const loginRes = await fetch(
      `${IDENTITY}/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const loginJson = await loginRes.json();

    if (!loginJson.idToken) {
      throw new Error(
        `Đăng nhập lại thất bại: ${JSON.stringify(loginJson)}`
      );
    }

    return { uid: loginJson.localId, idToken: loginJson.idToken };
  }

  if (!json.idToken) {
    throw new Error(`Tạo user thất bại: ${JSON.stringify(json)}`);
  }

  return { uid: json.localId, idToken: json.idToken };
};

/** Đăng nhập anonymous trong Auth Emulator. */
const signInAnonymously = async () => {
  const res = await fetch(`${IDENTITY}/accounts:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });

  const json = await res.json();
  if (!json.idToken) {
    throw new Error(`Anonymous signUp thất bại: ${JSON.stringify(json)}`);
  }

  return { uid: json.localId, idToken: json.idToken };
};

/** Xoá user trong Auth Emulator. */
const deleteUser = async (uid) => {
  await fetch(`${AUTH_ADMIN}/accounts:delete?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ localId: uid }),
  });
};

// ============================================================
// Helpers assertion
// ============================================================
const expectDenied = async (label, fn) => {
  const res = await fn();
  const denied = res.status === 403 || res.status === 401;
  check(label, denied, `HTTP ${res.status}`);
  return res;
};

const expectAllowed = async (label, fn) => {
  const res = await fn();
  const ok = res.status >= 200 && res.status < 300;
  check(label, ok, `HTTP ${res.status}`);
  return res;
};

/** Chạy một Firestore query (structuredQuery). */
const runQuery = (token, structuredQuery) =>
  fsRequest("POST", ":runQuery", { token, body: { structuredQuery } });

const EQ = (field, value) => ({
  fieldFilter: {
    field: { fieldPath: field },
    op: "EQUAL",
    value: { stringValue: value },
  },
});

const main = async () => {
  // ------------------------------------------------------------
  // Seed dữ liệu
  // ------------------------------------------------------------
  await seedDoc("articles", "pub-1", {
    title: "Bài đã xuất bản",
    slug: "bai-da-xuat-ban",
    status: "published",
    type: "knowledge",
    category: "kien-thuc-dien-mat-troi",
    featured: true,
    createdAt: 1700000000000,
  });

  await seedDoc("articles", "draft-1", {
    title: "Bản nháp",
    slug: "ban-nhap",
    status: "draft",
    type: "knowledge",
    createdAt: 1700000000000,
  });

  await seedDoc("article_categories", "cat-1", {
    name: "Công trình điện mặt trời",
    slug: "cong-trinh-dien-mat-troi",
    order: 1,
  });

  // ------------------------------------------------------------
  // 1. Khách truy cập — KHÔNG đăng nhập (không gửi token)
  // ------------------------------------------------------------
  console.log("\n━━━ 1. Khách (chưa đăng nhập) ━━━\n");

  console.log("📖 Đọc:");
  await expectAllowed("đọc bài đã xuất bản (published)", () =>
    fsRequest("GET", "/articles/pub-1")
  );
  await expectDenied("KHÔNG đọc được bản nháp (draft)", () =>
    fsRequest("GET", "/articles/draft-1")
  );
  await expectAllowed("query status=published", () =>
    runQuery(undefined, {
      from: [{ collectionId: "articles" }],
      where: { compositeFilter: { op: "AND", filters: [EQ("status", "published")] } },
    })
  );
  await expectDenied(
    "KHÔNG list toàn bộ bài viết (sẽ lộ draft)",
    () => fsRequest("GET", "/articles")
  );
  await expectAllowed("đọc danh mục", () =>
    fsRequest("GET", "/article_categories/cat-1")
  );
  await expectAllowed("list danh mục", () =>
    fsRequest("GET", "/article_categories")
  );

  console.log("\n✍️  Ghi dữ liệu (khách KHÔNG được ghi):");
  await expectDenied("KHÔNG tạo bài viết", () =>
    fsRequest("POST", "/articles", {
      body: { fields: { title: { stringValue: "X" } } },
    })
  );
  await expectDenied("KHÔNG sửa bài viết", () =>
    fsRequest("PATCH", "/articles/pub-1", {
      body: { fields: { title: { stringValue: "Hack" } } },
    })
  );
  await expectDenied("KHÔNG xoá bài viết", () =>
    fsRequest("DELETE", "/articles/pub-1")
  );
  await expectDenied("KHÔNG tạo danh mục", () =>
    fsRequest("POST", "/article_categories", {
      body: { fields: { name: { stringValue: "X" } } },
    })
  );
  await expectDenied("KHÔNG đọc contact_requests", () =>
    fsRequest("GET", "/contact_requests")
  );

  console.log("\n📨 Form liên hệ:");
  const contactRes = await fsRequest("POST", "/contact_requests", {
    body: {
      fields: {
        fullName: { stringValue: "Test" },
        phone: { stringValue: "0123" },
        message: { stringValue: "hello" },
      },
    },
  });
  check(
    "KHÁCH ĐƯỢC gửi contact_requests",
    contactRes.status >= 200 && contactRes.status < 300,
    `HTTP ${contactRes.status}`
  );

  const contactDocId = contactRes.body?.name?.split("/").pop();
  console.log(`   (doc id: ${contactDocId || "?"})`);

  // ------------------------------------------------------------
  // 2. Tài khoản đã đăng nhập (KHÔNG cần role admin) — tạo/sửa/nháp
  // ------------------------------------------------------------
  console.log("\n━━━ 2. Tài khoản đã đăng nhập (KHÔNG cần role admin) ━━━\n");

  const author = await createUser("author@test.com", "Author@12345");

  // Hồ sơ người dùng (KHÔNG có role admin) — để test chống leo thang đặc quyền
  await seedDoc("users", author.uid, {
    email: "author@test.com",
    displayName: "Tác giả",
  });

  console.log("✍️  Tạo bài viết:");
  const created = await expectAllowed("tạo bài viết mới (không cần admin)", () =>
    fsRequest("POST", "/articles", {
      token: author.idToken,
      body: {
        fields: {
          title: { stringValue: "Bài của tác giả" },
          slug: { stringValue: "bai-cua-tac-gia" },
          status: { stringValue: "draft" },
        },
      },
    })
  );
  const newArticleId = created.body?.name?.split("/").pop();

  await expectAllowed("lưu bản nháp (status=draft)", () =>
    fsRequest("POST", "/articles", {
      token: author.idToken,
      body: {
        fields: {
          title: { stringValue: "Bản nháp" },
          slug: { stringValue: "ban-nhap-moi" },
          status: { stringValue: "draft" },
        },
      },
    })
  );

  console.log("\n✏️  Chỉnh sửa:");
  await expectAllowed("sửa bài viết vừa tạo", () =>
    fsRequest("PATCH", `/articles/${newArticleId}`, {
      token: author.idToken,
      body: { fields: { title: { stringValue: "Đã sửa" } } },
    })
  );
  await expectAllowed("chuyển bản nháp → published", () =>
    fsRequest("PATCH", `/articles/${newArticleId}`, {
      token: author.idToken,
      body: { fields: { status: { stringValue: "published" } } },
    })
  );
  await expectAllowed("xuất bản (status=published)", () =>
    fsRequest("PATCH", `/articles/${newArticleId}`, {
      token: author.idToken,
      body: { fields: { status: { stringValue: "published" } } },
    })
  );

  console.log("\n📖 Đọc khi đã đăng nhập:");
  await expectAllowed("đọc bản nháp (đã đăng nhập thì đọc được)", () =>
    fsRequest("GET", "/articles/draft-1", { token: author.idToken })
  );
  await expectAllowed(
    "list TOÀN BỘ bài viết (màn hình quản lý)",
    () => fsRequest("GET", "/articles", { token: author.idToken })
  );
  await expectAllowed("query status=published", () =>
    runQuery(author.idToken, {
      from: [{ collectionId: "articles" }],
      where: { compositeFilter: { op: "AND", filters: [EQ("status", "published")] } },
    })
  );
  await expectAllowed("query slug (kiểm tra trùng slug)", () =>
    runQuery(author.idToken, {
      from: [{ collectionId: "articles" }],
      where: { compositeFilter: { op: "AND", filters: [EQ("slug", "bai-da-xuat-ban")] } },
    })
  );

  console.log("\n🗂  Danh mục bài viết:");
  await expectAllowed("tạo danh mục (không cần admin)", () =>
    fsRequest("POST", "/article_categories", {
      token: author.idToken,
      body: {
        fields: {
          name: { stringValue: "Danh mục của tác giả" },
          slug: { stringValue: "danh-muc-tac-gia" },
        },
      },
    })
  );
  await expectAllowed("sửa danh mục", () =>
    fsRequest("PATCH", "/article_categories/cat-1", {
      token: author.idToken,
      body: { fields: { description: { stringValue: "đã sửa" } } },
    })
  );
  await expectAllowed("xoá danh mục vừa tạo", () =>
    fsRequest("DELETE", "/article_categories/danh-muc-tac-gia", {
      token: author.idToken,
    })
  );

  console.log("\n🗑  Xoá bài viết:");
  await expectAllowed("xoá bài viết của chính mình", () =>
    fsRequest("DELETE", `/articles/${newArticleId}`, { token: author.idToken })
  );

  // ------------------------------------------------------------
  // 3. Chống leo thang đặc quyền — users
  // ------------------------------------------------------------
  console.log("\n━━━ 3. Chống leo thang đặc quyền (users) ━━━\n");

  await expectDenied("KHÔNG tự tạo users/{uid} role=admin", () =>
    fsRequest("POST", `/users?documentId=${author.uid}`, {
      token: author.idToken,
      body: { fields: { role: { stringValue: "admin" } } },
    })
  );
  await expectDenied("KHÔNG tự gán role=admin (PATCH)", () =>
    fsRequest("PATCH", `/users/${author.uid}?updateMask.fieldPaths=role`, {
      token: author.idToken,
      body: { fields: { role: { stringValue: "admin" } } },
    })
  );
  await expectDenyContactRequests(author.idToken, contactDocId);

  // ------------------------------------------------------------
  // 4. Admin — contact_requests
  // ------------------------------------------------------------
  console.log("\n━━━ 4. Admin (role=admin) — contact_requests ━━━\n");

  const admin = await createUser("admin@gmail.com", "Admin@12345");
  await seedDoc("users", admin.uid, {
    role: "admin",
    email: "admin@gmail.com",
  });

  await expectAllowed("admin đọc contact_requests", () =>
    fsRequest("GET", "/contact_requests", { token: admin.idToken })
  );
  await expectAllowed("admin cập nhật contact_requests", () =>
    fsRequest(
      "PATCH",
      `/contact_requests/${contactDocId}?updateMask.fieldPaths=status`,
      {
        token: admin.idToken,
        body: { fields: { status: { stringValue: "done" } } },
      }
    )
  );
  await expectAllowed("admin đọc hồ sơ users", () =>
    fsRequest("GET", `/users/${author.uid}`, { token: admin.idToken })
  );

  // Dọn user test
  await deleteUser(admin.uid).catch(() => {});
  await deleteUser(author.uid).catch(() => {});

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ PASS: ${passed}   ❌ FAIL: ${failed}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(failed > 0 ? 1 : 0);
};

/** User thường KHÔNG được sửa contact_requests (chỉ admin). */
const expectDenyContactRequests = async (token, contactDocId) => {
  await expectDenied("user thường KHÔNG sửa được contact_requests (chỉ admin)", () =>
    fsRequest(
      "PATCH",
      `/contact_requests/${contactDocId}?updateMask.fieldPaths=status`,
      {
        token,
        body: { fields: { status: { stringValue: "done" } } },
      }
    )
  );
};

main().catch((error) => {
  console.error("❌ Lỗi test:", error.message || error);
  process.exit(1);
});
