// ============================================
// ADMIN ARTICLE EDITOR
// Điện Mặt Trời Nhật Minh
// Form tạo / chỉnh sửa bài viết + thông tin công trình
// ============================================
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  ImagePlus,
  X,
  Trash2,
  Plus,
  Eye,
  Star,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import RichTextEditor from "@/features/articles/components/RichTextEditor";
import {
  createArticle,
  updateArticle,
  generateUniqueSlug,
} from "@/services/articleService";
import { uploadImage, uploadImages } from "@/services/imageUploadService";
import {
  ARTICLE_TYPES,
  SYSTEM_TYPES,
} from "@/features/articles/data/articleCategories";
import { slugify, htmlToPlainText, truncate } from "@/utils/articleUtils";
import { describeFirebaseError } from "@/utils/firebaseErrors";
import { AUTH_REQUIRED_MESSAGE } from "@/utils/adminAuth";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  content: "",
  category: "",
  type: "knowledge",
  status: "draft",
  featured: false,
  author: "Nhật Minh",
  equipment: [],
  projectInfo: {
    projectName: "",
    location: "",
    completionDate: "",
    systemCapacity: "",
    systemType: "",
    panelBrand: "",
    inverterBrand: "",
    batteryCapacity: "",
    panelCount: "",
    projectImages: [],
    projectDescription: "",
    projectResult: "",
  },
};

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-600";

const AdminArticleEditor = ({ article, categories, user, onClose, onSaved }) => {
  const isEdit = Boolean(article);

  // Khởi tạo form từ bài viết đang sửa (component được mount mới mỗi lần mở editor)
  const [form, setForm] = useState(() => buildInitialForm(article));
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(article));
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const coverInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Chống nhấn "Lưu" liên tục → tạo nhiều bài viết trùng lặp.
  const savingRef = useRef(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setProjectField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, [key]: value },
    }));
  };

  // Tự tạo slug từ tiêu đề
  const handleTitleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : slugify(value),
    }));
  };

  // Tự tạo mô tả ngắn khi chưa nhập tay
  const handleContentChange = (value) => {
    setForm((prev) => ({
      ...prev,
      content: value,
      excerpt:
        prev.excerpt || truncate(htmlToPlainText(value), 160),
    }));
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingCover(true);
    setError("");

    try {
      const url = await uploadImage(file, "nhatminh/articles/cover");
      setField("coverImage", url);
    } catch (e) {
      console.error(e);
      setError(e.message || "Không thể tải ảnh bìa lên.");
    } finally {
      setUploadingCover(false);
    }
  };
  const handleProjectImagesUpload = async (event) => {
    const files = event.target.files;
    event.target.value = "";
    if (!files?.length) return;

    setUploadingImages(true);
    setError("");

    try {
      const urls = await uploadImages(
        Array.from(files),
        "nhatminh/articles/projects"
      );
      setForm((prev) => ({
        ...prev,
        projectInfo: {
          ...prev.projectInfo,
          projectImages: [...prev.projectInfo.projectImages, ...urls],
        },
      }));
    } catch (e) {
      console.error(e);
      setError(e.message || "Không thể tải ảnh công trình lên.");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeProjectImage = (index) => {
    setForm((prev) => ({
      ...prev,
      projectInfo: {
        ...prev.projectInfo,
        projectImages: prev.projectInfo.projectImages.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const addEquipment = () => {
    setField("equipment", [...form.equipment, ""]);
  };

  const updateEquipment = (index, value) => {
    setField(
      "equipment",
      form.equipment.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  };

  const removeEquipment = (index) => {
    setField(
      "equipment",
      form.equipment.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSave = async (status) => {
    // Chống nhấn lưu liên tục (double-click / Enter nhiều lần)
    if (savingRef.current) return;

    setError("");

    if (!form.title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    // Rules chỉ cho phép ghi khi đã đăng nhập Firebase Authentication.
    if (!user?.uid) {
      setError(AUTH_REQUIRED_MESSAGE);
      return;
    }

    savingRef.current = true;
    setSaving(true);

    try {
      let slug = form.slug?.trim();

      if (!slug) {
        slug = await generateUniqueSlug(user, form.title, article?.id);
      } else if (!slugManuallyEdited) {
        slug = await generateUniqueSlug(user, form.title, article?.id);
      } else if (article?.id) {
        slug = await generateUniqueSlug(user, form.slug, article.id);
      } else {
        slug = await generateUniqueSlug(user, form.slug);
      }

      const payload = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt?.trim() || "",
        coverImage: form.coverImage || "",
        content: form.content || "",
        category: form.category || "",
        type: form.type,
        status,
        featured: form.featured,
        author: form.author || "Nhật Minh",
        equipment: cleanEquipment(form.equipment),
        projectInfo:
          form.type === "project" ? cleanProjectInfo(form.projectInfo) : null,
      };

      if (article?.id) {
        await updateArticle(user, article.id, payload);
      } else {
        await createArticle(user, payload);
      }

      setSaved(true);
      setTimeout(() => onSaved?.(), 600);
    } catch (e) {
      console.error("[AdminArticleEditor] save failed:", e);
      setError(
        describeFirebaseError(
          e,
          "Không thể lưu bài viết. Vui lòng kiểm tra kết nối.",
          Boolean(user?.uid)
        )
      );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const isProject = form.type === "project";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={15} />
            Quay lại
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-slate-900">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
            {form.slug && (
              <p className="truncate text-xs text-slate-400">
                /bai-viet/{form.slug}
              </p>
            )}
          </div>

          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Check size={14} />
              Đã lưu
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Lưu nháp
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            Xuất bản
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-6">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title */}
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <div>
                <label className={labelClass}>Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Công trình điện mặt trời 20kWp tại nhà máy ABC"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setField("excerpt", e.target.value)}
                  placeholder="Tóm tắt nội dung trong 1-2 câu (hiển thị trên card và SEO)"
                  className={fieldClass}
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  {form.excerpt.length}/160 ký tự
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className={labelClass}>Đường dẫn (slug)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setField("slug", e.target.value);
                    }}
                    placeholder="tu-dong-tao-tu-tieu-de"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    title="Tạo lại slug từ tiêu đề"
                    onClick={() => {
                      setSlugManuallyEdited(false);
                      setField("slug", slugify(form.title));
                    }}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <Copy size={14} />
                    Tự tạo
                  </button>
                </div>
              </div>
            </section>

            {/* Cover image */}
            <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
              <label className={labelClass}>Ảnh bìa</label>

              {form.coverImage ? (
                <div className="relative overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={form.coverImage}
                    alt="Ảnh bìa"
                    className="max-h-[320px] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setField("coverImage", "")}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 text-slate-400 transition-colors hover:border-amber-300 hover:bg-amber-50/40 disabled:opacity-60"
                >
                  {uploadingCover ? (
                    <Loader2 size={24} className="animate-spin text-amber-500" />
                  ) : (
                    <ImagePlus size={24} />
                  )}
                  <span className="text-sm font-medium">
                    {uploadingCover ? "Đang tải ảnh..." : "Tải ảnh bìa lên"}
                  </span>
                  <span className="text-xs text-slate-400">
                    JPG / PNG / WebP — tối đa 10MB
                  </span>
                </button>
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverUpload}
              />
            </section>

            {/* Content editor */}
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <label className={labelClass}>Nội dung bài viết</label>
              <RichTextEditor
                value={form.content}
                onChange={handleContentChange}
                placeholder="Viết nội dung bài viết. Hỗ trợ H1–H3, in đậm, in nghiêng, danh sách, ảnh, bảng thông số và liên kết."
              />
            </section>

            {/* Project info */}
            {isProject && (
              <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Thông tin công trình
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Không bắt buộc điền đầy đủ — chỉ nhập những thông tin có sẵn.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Tên công trình</label>
                    <input
                      type="text"
                      value={form.projectInfo.projectName}
                      onChange={(e) =>
                        setProjectField("projectName", e.target.value)
                      }
                      placeholder="Nhà máy ABC"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Địa điểm lắp đặt</label>
                    <input
                      type="text"
                      value={form.projectInfo.location}
                      onChange={(e) =>
                        setProjectField("location", e.target.value)
                      }
                      placeholder="KCN Yên Phong, Bắc Ninh"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Ngày hoàn thành</label>
                    <input
                      type="date"
                      value={form.projectInfo.completionDate || ""}
                      onChange={(e) =>
                        setProjectField("completionDate", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Loại hệ thống</label>
                    <select
                      value={form.projectInfo.systemType}
                      onChange={(e) =>
                        setProjectField("systemType", e.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="">— Chọn loại —</option>
                      {SYSTEM_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Công suất hệ thống (kWp)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.projectInfo.systemCapacity}
                      onChange={(e) =>
                        setProjectField("systemCapacity", e.target.value)
                      }
                      placeholder="20"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Số lượng tấm pin</label>
                    <input
                      type="number"
                      min="0"
                      value={form.projectInfo.panelCount}
                      onChange={(e) =>
                        setProjectField("panelCount", e.target.value)
                      }
                      placeholder="40"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Thương hiệu tấm pin</label>
                    <input
                      type="text"
                      value={form.projectInfo.panelBrand}
                      onChange={(e) =>
                        setProjectField("panelBrand", e.target.value)
                      }
                      placeholder="Longi, JA Solar..."
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Thương hiệu inverter</label>
                    <input
                      type="text"
                      value={form.projectInfo.inverterBrand}
                      onChange={(e) =>
                        setProjectField("inverterBrand", e.target.value)
                      }
                      placeholder="Huawei, Deye, Sungrow..."
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Dung lượng pin lưu trữ (kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.projectInfo.batteryCapacity}
                      onChange={(e) =>
                        setProjectField("batteryCapacity", e.target.value)
                      }
                      placeholder="10"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <label className={labelClass}>Danh sách thiết bị</label>
                      <p className="text-xs text-slate-400">
                        Nhập tên thiết bị và số lượng, ví dụ: Tấm pin LONGi: 6 tấm.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addEquipment}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                    >
                      <Plus size={14} />
                      Thêm thiết bị
                    </button>
                  </div>

                  {form.equipment.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {form.equipment.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-600">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateEquipment(index, e.target.value)
                            }
                            placeholder="Ví dụ: Biến tần Hybrid: 1 bộ"
                            className={fieldClass}
                          />
                          <button
                            type="button"
                            onClick={() => removeEquipment(index)}
                            aria-label={`Xóa thiết bị ${index + 1}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-center text-xs text-slate-400">
                      Chưa có thiết bị. Nhấn “Thêm thiết bị” để bổ sung.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    Hình ảnh công trình
                  </label>

                  {form.projectInfo.projectImages.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {form.projectInfo.projectImages.map((img, i) => (
                        <div
                          key={i}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100"
                        >
                          <img
                            src={img}
                            alt={`Ảnh công trình ${i + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectImage(i)}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-slate-600 opacity-0 shadow transition-all hover:bg-red-500 hover:text-white group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => imagesInputRef.current?.click()}
                    disabled={uploadingImages}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-600 disabled:opacity-60"
                  >
                    {uploadingImages ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <ImagePlus size={16} />
                    )}
                    {uploadingImages
                      ? "Đang tải..."
                      : "Tải nhiều ảnh công trình"}
                  </button>

                  <input
                    ref={imagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleProjectImagesUpload}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mô tả quá trình thi công</label>
                  <textarea
                    rows={5}
                    value={form.projectInfo.projectDescription}
                    onChange={(e) =>
                      setProjectField("projectDescription", e.target.value)
                    }
                    placeholder="Khảo sát, thiết kế, lắp đặt, đấu nối..."
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Kết quả & hiệu quả vận hành
                  </label>
                  <textarea
                    rows={5}
                    value={form.projectInfo.projectResult}
                    onChange={(e) =>
                      setProjectField("projectResult", e.target.value)
                    }
                    placeholder="Sản lượng điện, tiết kiệm chi phí, thời gian hoàn vốn..."
                    className={fieldClass}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Publish settings */}
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-900">Xuất bản</h2>

              <div>
                <label className={labelClass}>Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  className={fieldClass}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Loại bài viết</label>
                <select
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value)}
                  className={fieldClass}
                >
                  {ARTICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  {ARTICLE_TYPES.find((t) => t.value === form.type)?.description}
                </p>
              </div>

              <div>
                <label className={labelClass}>Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className={fieldClass}
                >
                  <option value="">— Chọn danh mục —</option>
                  {categories.map((c) => (
                    <option key={c.id || c.slug} value={c.slug || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Tác giả</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setField("author", e.target.value)}
                  className={fieldClass}
                />
              </div>

              <button
                type="button"
                onClick={() => setField("featured", !form.featured)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.featured
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Star
                  size={15}
                  className={
                    form.featured ? "fill-amber-400 text-amber-400" : ""
                  }
                />
                {form.featured ? "Đánh dấu nổi bật" : "Đánh dấu nổi bật"}
              </button>

              {form.status === "published" && form.slug && (
                <a
                  href={`/bai-viet/${form.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Eye size={15} />
                  Xem trước trên trang
                </a>
              )}
            </section>

            {/* Tips */}
            <section className="rounded-xl border border-amber-100 bg-amber-50/60 p-5">
              <h3 className="text-sm font-bold text-amber-900">Gợi ý</h3>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-800">
                <li>• Chỉ bài viết "Đã xuất bản" mới hiển thị với khách hàng.</li>
                <li>• Dùng ảnh thật của công trình để tăng độ tin cậy.</li>
                <li>• Tiêu đề nên chứa từ khóa: hòa lưới, hybrid, kWp...</li>
                <li>• Chú thích ảnh giúp bài viết chuyên nghiệp hơn.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELPERS
// ============================================

/**
 * Tạo form khởi tạo từ bài viết
 */
const buildInitialForm = (article) => {
  if (!article) return EMPTY_FORM;

  return {
    title: article.title || "",
    slug: article.slug || "",
    excerpt: article.excerpt || "",
    coverImage: article.coverImage || "",
    content: article.content || "",
    category: article.category || "",
    type: article.type || "knowledge",
    status: article.status || "draft",
    featured: Boolean(article.featured),
    author: article.author || "Nhật Minh",
    equipment: normalizeEquipment(
      Array.isArray(article.equipment)
        ? article.equipment
        : article.projectInfo?.equipment
    ),
    projectInfo: { ...EMPTY_FORM.projectInfo, ...(article.projectInfo || {}) },
  };
};

/**
 * Loại bỏ các trường rỗng khỏi projectInfo
 */
const cleanProjectInfo = (info = {}) => {
  const cleaned = {};

  Object.entries(info).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;
    if (key === "projectImages" && Array.isArray(value) && !value.length) return;
    cleaned[key] = value;
  });

  return Object.keys(cleaned).length ? cleaned : null;
};

const normalizeEquipment = (equipment) => {
  if (!Array.isArray(equipment)) return [];

  return equipment
    .map((item) => (typeof item === "string" ? item : item?.name || ""))
    .filter(Boolean);
};

const cleanEquipment = (equipment) => {
  if (!Array.isArray(equipment)) return [];

  return equipment.map((item) => String(item).trim()).filter(Boolean);
};

export default AdminArticleEditor;
