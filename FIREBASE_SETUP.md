# Cấu hình Firebase — Dự án Nhật Minh (Điện Mặt Trời)

> Tài liệu này mô tả **một Firebase duy nhất** mà toàn bộ website sử dụng
> và các bước cấu hình cần thiết cho module Bài viết & Công trình điện mặt trời.

---

## 1. Firebase duy nhất

| Mục | Giá trị |
|---|---|
| Project ID | `nhat-minh-solar` |
| Auth Domain | `nhat-minh-solar.firebaseapp.com` |
| Storage Bucket | `nhat-minh-solar.firebasestorage.app` |
| Web App ID | `1:85051015242:web:f67e388594f723c8ae26b3` |

Nguồn cấu hình duy nhất: **`.env`** → nạp qua **`src/services/firebase.js`**.

```
src/services/firebase.js
  ├── app      (Firebase App duy nhất)
  ├── db       (Firestore)
  ├── auth     (Authentication)
  └── storage  (Storage)
```

### Quy tắc bắt buộc cho mọi module

```js
// ✅ Đúng
import { db, auth, storage } from "@/services/firebase";

// ❌ Sai — không bao giờ làm vậy
import { initializeApp } from "firebase/app";
const app = initializeApp({ ... });
```

### Kiểm tra

```bash
npm run verify:firebase
```

Script sẽ kiểm tra: source chỉ có 1 `initializeApp()`, mọi import đều từ nguồn chung,
bundle chỉ có 1 object cấu hình, `.firebaserc` khớp `.env`, không script nào hardcode project khác.

---

## 2. Cấu trúc dữ liệu Firestore

### `articles`

```js
{
  title: string,             // Tiêu đề
  slug: string,              // URL thân thiện (duy nhất)
  excerpt: string,           // Mô tả ngắn
  coverImage: string,        // URL ảnh bìa
  content: string,           // HTML nội dung (H1-H3, b/i, list, figure, table, link)
  category: string,          // slug danh mục
  type: "project" | "knowledge",
  status: "draft" | "published",
  featured: boolean,
  author: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt: Timestamp | null,

  projectInfo: {             // chỉ với type = "project"
    projectName: string,
    location: string,
    completionDate: string,
    systemCapacity: string,  // kWp
    systemType: "hoa-luoi" | "hybrid" | "doc-lap",
    panelBrand: string,
    inverterBrand: string,
    batteryCapacity: string, // kWh
    panelCount: string,
    projectImages: string[],
    projectDescription: string,
    projectResult: string,
  } | null,
}
```

### `article_categories`

```js
{
  name: string,
  slug: string,
  description: string,
  icon: string,        // tên icon Lucide
  order: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Danh mục mặc định

1. `cong-trinh-dien-mat-troi` — Công trình điện mặt trời
2. `dien-mat-troi-hoa-luoi` — Điện mặt trời hòa lưới
3. `dien-mat-troi-hybrid` — Điện mặt trời Hybrid
4. `dien-mat-troi-doc-lap` — Điện mặt trời độc lập
5. `pin-luu-tru-nang-luong` — Pin lưu trữ năng lượng
6. `kien-thuc-dien-mat-troi` — Kiến thức điện mặt trời

Tạo danh mục mặc định trong Firestore:

```bash
npm run seed:categories
```

> Script tự dùng `serviceAccountKey.json` **nếu key thuộc đúng project**,
> ngược lại dùng Web SDK và cần đăng nhập admin:
> `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:categories`

---

## 3. Security Rules

File: **`firestore.rules`** — đã bao gồm:

| Collection | Khách đọc | Khách ghi | Đã đăng nhập | Admin |
|---|---|---|---|---|
| `articles` | chỉ `status == "published"` | ❌ | ✅ đầy đủ (tạo/sửa/xoá/nháp) | ✅ |
| `article_categories` | ✅ | ❌ | ✅ đầy đủ | ✅ |
| `contact_requests` | ❌ | ✅ tạo mới | ❌ | ✅ đầy đủ |
| `products`, `categories`, `solutions`, `banners`, `projects`, `blogs` | ✅ | ❌ | ❌ | ✅ đầy đủ |
| `users` | chính mình | — | chính mình (không tự gán `role`) | ✅ xoá |

### Mô hình phân quyền bài viết

> **Không yêu cầu role Admin, không yêu cầu Custom Claims.**

- Tài khoản đã đăng nhập Firebase Authentication → tạo / sửa / xoá bài viết,
  lưu bản nháp, quản lý danh mục bài viết.
- Khách chưa đăng nhập → chỉ đọc được bài `status == "published"` và danh mục,
  **không** tạo/sửa được.
- `contact_requests` vẫn giữ nguyên: khách gửi form, chỉ Admin đọc/quản lý.

Admin được xác định bằng `users/{uid}.role == "admin"` (dùng cho `contact_requests`).
Người dùng **không** tự tạo/gán được `role: "admin"` cho chính mình
(chống leo thang đặc quyền).

### Deploy rules

```bash
npm run deploy:rules
```

> **Lỗi thường gặp:** `401 / invalid authentication credentials` → phiên đăng nhập
> Firebase CLI đã hết hạn. Chạy `npx firebase login` để đăng nhập lại bằng
> trình duyệt (tài khoản phải có quyền trên project `nhat-minh-solar`).

Cách làm trong Firebase Console nếu script không chạy được:
**Firestore Database → Rules → dán nội dung `firestore.rules` → Publish.**

```bash
# hoặc dùng CLI trực tiếp
npx firebase deploy --only firestore:rules --project nhat-minh-solar
```

### Indexes

File: **`firestore.indexes.json`** (slug+status, status+publishedAt, category order).

Deploy: `npx firebase deploy --only firestore:indexes --project nhat-minh-solar`

---

## 4. Tài khoản admin

- Email: `admin@gmail.com` (đã tồn tại trong Auth của `nhat-minh-solar`)
- Document: `users/{uid}` với `{ "role": "admin" }`

> **Lưu ý:** `role: "admin"` **không còn cần thiết** để tạo/sửa bài viết —
> mọi tài khoản đã đăng nhập đều làm được. `role` chỉ còn dùng cho
> `contact_requests` (quản lý tin nhắn) và quản lý `users`.
>
> Admin được nhận diện theo 2 cách (`src/utils/adminAuth.js`):
> 1. `users/{uid}.role == "admin"` — chính là nguồn mà Security Rules dùng.
> 2. Custom Claim `admin === true` trong ID token (dự phòng).

---

## 5. Upload ảnh

Dùng **Cloudinary** (unsigned preset) — đã cấu hình trong `.env`:

```
VITE_CLOUDINARY_UPLOAD_URL
VITE_CLOUDINARY_UPLOAD_PRESET
```

`src/services/imageUploadService.js` → `uploadImage(file, folder)` / `uploadImages(files, folder)`.

---

## 6. Sitemap

```bash
npm run sitemap
```

Sinh `public/sitemap.xml` từ các bài viết `status == "published"` + các trang tĩnh.

---

## 7. Kiểm thử Security Rules (local)

```bash
# Terminal 1
npm run emulators

# Terminal 2
npm run test:rules
```

Kết quả mong đợi: **31/31 PASS**.

Test này kiểm tra đầy đủ:
- **Khách (chưa đăng nhập):** đọc bài published ✅, đọc bài nháp ❌,
  list toàn bộ ❌, tạo/sửa/xoá bài viết ❌, tạo/sửa danh mục ❌,
  gửi contact request ✅, đọc contact request ❌.
- **Tài khoản đã đăng nhập (không có role admin):** tạo bài ✅, lưu nháp ✅,
  sửa bài ✅, xuất bản ✅, đọc bài nháp ✅, list toàn bộ ✅, query slug ✅,
  quản lý danh mục ✅, xoá bài ✅.
- **Chống leo thang đặc quyền:** không tự tạo/gán `role: "admin"` cho mình ❌,
  không đọc/sửa `contact_requests` ❌.
- **Admin (`users/{uid}.role == "admin"`):** đọc/sửa `contact_requests` ✅,
  đọc hồ sơ user khác ✅.

### Test CRUD end-to-end (đúng hàm frontend)

```bash
# Terminal 1
npm run emulators

# Terminal 2
npm run test:crud
```

Chạy đúng các lệnh Firestore Web SDK mà `articleService.js` dùng
(`getAllArticles`, `slugExists`, `createArticle`, `updateArticle`,
`setArticleStatus`, `deleteArticle`, `createArticleCategory`, ...) để tái hiện
lỗi *"Missing or insufficient permissions"*. Script tự dọn dẹp dữ liệu tạm.

> Mặc định script chạy trên project thật. Để chạy trên emulator, set biến môi
> trường trước khi chạy:
> ```powershell
> $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8085"
> $env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
> npm run test:crud
> ```

---

## 8. Lệnh thường dùng

```bash
npm run dev              # chạy dev server
npm run build            # build production
npm run verify:firebase  # kiểm tra chỉ dùng 1 Firebase
npm run sitemap          # cập nhật sitemap.xml
npm run seed:categories  # tạo danh mục mặc định
npm run seed:article     # tạo bài viết mẫu
npm run deploy:rules     # deploy Firestore Security Rules
npm run test:rules       # test rules trên emulator (31 assertions)
npm run test:crud        # test CRUD end-to-end theo hàm frontend
npm run emulators        # chạy Firestore + Auth emulator
```
