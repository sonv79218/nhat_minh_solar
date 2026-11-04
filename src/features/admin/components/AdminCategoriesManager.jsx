// ============================================
// ADMIN CATEGORIES MANAGER
// Điện Mặt Trời Nhật Minh
// Thêm / sửa / xóa danh mục bài viết
// ============================================
// Phân quyền: chỉ cần phiên đăng nhập Firebase Authentication
// (không dùng Custom Claims / role admin).
// ============================================
import { useState } from "react";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
  FolderCog,
} from "lucide-react";
import {
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
} from "@/services/articleService";
import { slugify } from "@/utils/articleUtils";
import { describeFirebaseError } from "@/utils/firebaseErrors";
import { AUTH_REQUIRED_MESSAGE } from "@/utils/adminAuth";

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

const AdminCategoriesManager = ({ categories, user, onClose, onChanged }) => {
  const [items, setItems] = useState(categories);
  const [editing, setEditing] = useState(null); // {id?, name, description, order}
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const startEdit = (cat) => {
    setError("");
    setEditing({
      id: cat.id,
      name: cat.name || "",
      description: cat.description || "",
      order: cat.order ?? items.length + 1,
    });
  };

  const handleSave = async () => {
    if (busy) return;

    if (!editing?.name?.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    if (!user?.uid) {
      setError(AUTH_REQUIRED_MESSAGE);
      return;
    }

    setBusy(true);
    setError("");

    try {
      const payload = {
        name: editing.name.trim(),
        slug: slugify(editing.name),
        description: editing.description.trim(),
        order: editing.order,
      };

      if (editing.id) {
        await updateArticleCategory(user, editing.id, payload);
        setItems((prev) =>
          prev.map((c) =>
            c.id === editing.id ? { ...c, ...payload } : c
          )
        );
      } else {
        const newId = await createArticleCategory(user, payload);
        setItems((prev) => [
          ...prev,
          { id: newId, ...payload },
        ]);
      }

      setEditing(null);
      onChanged?.();
    } catch (e) {
      console.error(e);
      setError(describeFirebaseError(e, "Không thể lưu danh mục."));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting || busy) return;

    if (!user?.uid) {
      setError(AUTH_REQUIRED_MESSAGE);
      return;
    }

    setBusy(true);
    setError("");

    try {
      await deleteArticleCategory(user, deleting.id);
      setItems((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
      onChanged?.();
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể xóa danh mục (có thể còn bài viết thuộc danh mục này)."
        )
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <FolderCog size={18} className="text-amber-600" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Danh mục bài viết
              </h2>
              <p className="text-xs text-slate-500">
                {items.length} danh mục
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Form */}
          {editing && (
            <div className="mb-5 space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="Ví dụ: Điện mặt trời hòa lưới"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Mô tả danh mục"
                  className={fieldClass}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-28">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Thứ tự
                  </label>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Lưu
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  disabled={busy}
                  className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {items.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {cat.order ?? "–"}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="truncate text-xs text-slate-400">
                      {cat.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  disabled={busy}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50"
                >
                  <Pencil size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleting(cat)}
                  disabled={busy}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              setEditing({
                id: null,
                name: "",
                description: "",
                order: items.length + 1,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-600 disabled:opacity-50"
          >
            <Plus size={15} />
            Thêm danh mục
          </button>
        </div>

        {/* Delete confirm */}
        {deleting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900">
                Xóa danh mục?
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                "{deleting.name}" sẽ bị xóa. Bài viết thuộc danh mục này sẽ mất
                liên kết danh mục.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleting(null)}
                  disabled={busy}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {busy && <Loader2 size={14} className="animate-spin" />}
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesManager;
