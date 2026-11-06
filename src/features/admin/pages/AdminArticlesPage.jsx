// ============================================
// ADMIN ARTICLES PAGE
// Điện Mặt Trời Nhật Minh
// Quản lý bài viết: danh sách, tạo, sửa, xóa, xuất bản
// ============================================
// Phân quyền: chỉ cần phiên đăng nhập Firebase Authentication.
// Không dùng Custom Claims / role admin (theo Security Rules hiện tại).
// ============================================
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  Star,
  Loader2,
  AlertCircle,
  FolderCog,
  X,
  Check,
  ImageIcon,
} from "lucide-react";
import {
  getAllArticles,
  deleteArticle,
  setArticleStatus,
  getArticleCategories,
} from "@/services/articleService";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";
import { formatDateTime, truncate } from "@/utils/articleUtils";
import { useAuth } from "@/contexts/AuthContext";
import { describeFirebaseError } from "@/utils/firebaseErrors";
import AdminCategoriesManager from "@/features/admin/components/AdminCategoriesManager";
import AdminArticleEditor from "@/features/admin/components/AdminArticleEditor";

const STATUS_FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đã xuất bản" },
  { value: "draft", label: "Bản nháp" },
];

const AdminArticlesPage = () => {
  const { currentUser } = useAuth();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // article object | "new"
  const [deleting, setDeleting] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  // Chống thao tác trùng lặp (xoá / đổi trạng thái)
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState(null);

  const loadArticles = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getAllArticles(currentUser);
      setArticles(data);
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể tải danh sách bài viết.",
          Boolean(currentUser)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getAllArticles(currentUser);
        if (!cancelled) setArticles(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            describeFirebaseError(
              e,
              "Không thể tải danh sách bài viết.",
              Boolean(currentUser)
            )
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getArticleCategories();
        if (data?.length) setCategories(data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const getCategoryName = (slug) => {
    const found = categories.find((c) => c.slug === slug || c.id === slug);
    return found?.name || slug || "—";
  };

  const filtered = useMemo(() => {
    let result = articles;

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.slug?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [articles, statusFilter, search]);

  const counts = {
    all: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
  };

  const handleDelete = async () => {
    if (!deleting || deletingBusy || !currentUser) return;

    setDeletingBusy(true);
    setError("");

    try {
      await deleteArticle(currentUser, deleting.id);
      setArticles((prev) => prev.filter((a) => a.id !== deleting.id));
      setDeleting(null);
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể xóa bài viết. Vui lòng thử lại.",
          Boolean(currentUser)
        )
      );
    } finally {
      setDeletingBusy(false);
    }
  };

  const handleToggleStatus = async (article) => {
    if (statusBusyId || !currentUser) return;

    const next = article.status === "published" ? "draft" : "published";

    setStatusBusyId(article.id);
    setError("");

    try {
      await setArticleStatus(currentUser, article.id, next);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: next } : a))
      );
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể cập nhật trạng thái bài viết.",
          Boolean(currentUser)
        )
      );
    } finally {
      setStatusBusyId(null);
    }
  };

  // Editor overlay
  if (editing) {
    return (
      <AdminArticleEditor
        article={editing === "new" ? null : editing}
        categories={categories}
        user={currentUser}
        onClose={() => {
          setEditing(null);
          loadArticles();
        }}
        onSaved={() => {
          setEditing(null);
          loadArticles();
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý bài viết</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Đang tải..."
              : `${counts.all} bài viết — ${counts.published} đã xuất bản, ${counts.draft} bản nháp`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCategories(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <FolderCog size={15} />
            Danh mục
          </button>

          <button
            type="button"
            onClick={loadArticles}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            <Plus size={16} />
            Tạo bài viết
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="inline-flex items-center gap-2">
            <AlertCircle size={15} />
            {error}
          </span>
          <button type="button" onClick={() => setError("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 border-b border-slate-200">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  statusFilter === tab.value
                    ? "bg-amber-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {counts[tab.value]}
              </span>
              {statusFilter === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-amber-500" />
              )}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-20">
          <Loader2 size={26} className="animate-spin text-amber-500" />
          <p className="text-sm text-slate-500">Đang tải bài viết...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <FileText size={26} className="text-slate-400" />
          </span>
          <p className="text-slate-500 text-sm">
            {articles.length === 0
              ? "Chưa có bài viết nào. Hãy tạo bài viết đầu tiên."
              : "Không có bài viết nào khớp bộ lọc."}
          </p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Thumb */}
              <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-36">
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={20} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      article.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {article.status === "published"
                      ? "Đã xuất bản"
                      : "Bản nháp"}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                    {getCategoryName(article.category)}
                  </span>

                  {article.type === "project" && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                      Công trình
                    </span>
                  )}

                  {article.featured && (
                    <Star
                      size={13}
                      className="fill-amber-400 text-amber-400"
                      aria-label="Nổi bật"
                    />
                  )}
                </div>

                <h3 className="truncate text-sm font-bold text-slate-900">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {truncate(article.excerpt, 110)}
                  </p>
                )}

                <p className="mt-1.5 text-[11px] text-slate-400">
                  /bai-viet/{article.slug} • Cập nhật{" "}
                  {formatDateTime(article.updatedAt || article.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-1.5">
                {article.status === "published" && (
                  <Link
                    to={`/bai-viet/${article.slug}`}
                    target="_blank"
                    title="Xem trước"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={15} />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleStatus(article)}
                  disabled={statusBusyId === article.id}
                  title={
                    article.status === "published"
                      ? "Chuyển về bản nháp"
                      : "Xuất bản"
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                >
                  {statusBusyId === article.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : article.status === "published" ? (
                    <X size={15} />
                  ) : (
                    <Check size={15} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(article)}
                  title="Chỉnh sửa"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleting(article)}
                  title="Xóa"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={18} className="text-red-600" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Xóa bài viết?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  "{deleting.title}" sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={deletingBusy}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingBusy}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deletingBusy && <Loader2 size={14} className="animate-spin" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories manager */}
      {showCategories && (
        <AdminCategoriesManager
          categories={categories}
          user={currentUser}
          onClose={() => setShowCategories(false)}
          onChanged={() => {
            (async () => {
              try {
                const data = await getArticleCategories();
                if (data?.length) setCategories(data);
              } catch (e) {
                console.warn(e);
              }
            })();
          }}
        />
      )}
    </div>
  );
};

export default AdminArticlesPage;
