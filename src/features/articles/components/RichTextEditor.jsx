/* eslint-disable react-hooks/refs */
// ============================================
// RICH TEXT EDITOR
// Điện Mặt Trời Nhật Minh
// Trình soạn thảo trực quan: H1-H3, đoạn văn, bold/italic, danh sách,
// chèn ảnh + chú thích, liên kết, bảng thông số kỹ thuật.
//
// Ghi chú: dùng ref trực tiếp cho vùng contentEditable — cần thiết để
// đồng bộ innerHTML mà không làm mất con trỏ khi người dùng đang gõ.
// ============================================
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Table2,
  Undo2,
  Redo2,
  Loader2,
  Eye,
} from "lucide-react";
import { uploadImage } from "@/services/imageUploadService";

const BLOCKS = [
  { cmd: "formatBlock", value: "h1", icon: Heading1, label: "H1" },
  { cmd: "formatBlock", value: "h2", icon: Heading2, label: "H2" },
  { cmd: "formatBlock", value: "h3", icon: Heading3, label: "H3" },
  { cmd: "formatBlock", value: "p", icon: null, label: "¶" },
];

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Viết nội dung bài viết...",
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [focused, setFocused] = useState(false);

  // Chỉ set innerHTML khi giá trị bên ngoài khác nội dung hiện tại
  // (tránh reset con trỏ khi người dùng đang gõ).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange?.(el.innerHTML);
  }, [onChange]);

  const exec = useCallback(
    (cmd, cmdValue = null) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, cmdValue);
      emitChange();
    },
    [emitChange]
  );

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setUploading(true);
      try {
        const url = await uploadImage(file, "nhatminh/articles/content");
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        const caption = prompt(
          "Nhập chú thích cho hình ảnh (có thể bỏ trống):",
          alt
        );

        editorRef.current?.focus();
        document.execCommand(
          "insertHTML",
          false,
          `<figure class="article-figure"><img src="${url}" alt="${alt}" loading="lazy" />${
            caption
              ? `<figcaption class="article-figcaption">${caption}</figcaption>`
              : ""
          }</figure><p><br></p>`
        );
        emitChange();
      } catch (error) {
        console.error(error);
        alert(error.message || "Không thể tải ảnh lên.");
      } finally {
        setUploading(false);
      }
    },
    [emitChange]
  );

  const insertLink = useCallback(() => {
    const url = prompt("Nhập đường dẫn liên kết:", "https://");
    if (!url) return;

    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    emitChange();
  }, [emitChange]);

  const insertTable = useCallback(() => {
    const rows = prompt("Số hàng (kể cả hàng tiêu đề):", "4");
    const rowCount = parseInt(rows, 10);
    if (!rowCount || rowCount < 1) return;

    const cols = prompt("Số cột:", "3");
    const colCount = parseInt(cols, 10);
    if (!colCount || colCount < 1) return;

    const thead = `<thead><tr>${Array.from({ length: colCount })
      .map((_, c) => `<th>Tiêu đề ${c + 1}</th>`)
      .join("")}</tr></thead>`;

    const tbody = `<tbody>${Array.from({ length: rowCount - 1 })
      .map(
        () =>
          `<tr>${Array.from({ length: colCount })
            .map(() => "<td>&nbsp;</td>")
            .join("")}</tr>`
      )
      .join("")}</tbody>`;

    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<div class="article-table-wrap"><table class="article-table">${thead}${tbody}</table></div><p><br></p>`
    );
    emitChange();
  }, [emitChange]);

  const openImagePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePaste = useCallback(
    (event) => {
      // Chỉ nhận văn bản thuần khi paste, tránh dán HTML ngoài ý muốn
      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        event.preventDefault();
        document.execCommand("insertText", false, text);
        emitChange();
      }
    },
    [emitChange]
  );

  const toolbarBtn = (icon, label, onClick) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition-colors ${
        focused ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-2">
        {BLOCKS.map(({ cmd, value: v, icon: Icon, label }) => (
          <button
            key={v}
            type="button"
            title={label}
            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(cmd, v)}
            className="flex h-8 min-w-[34px] items-center justify-center rounded-lg px-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
          >
            {Icon ? <Icon size={15} /> : label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {toolbarBtn(<Bold size={15} />, "In đậm", () => exec("bold"))}
        {toolbarBtn(<Italic size={15} />, "In nghiêng", () => exec("italic"))}

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {toolbarBtn(
          <List size={15} />,
          "Danh sách",
          () => exec("insertUnorderedList")
        )}
        {toolbarBtn(
          <ListOrdered size={15} />,
          "Danh sách đánh số",
          () => exec("insertOrderedList")
        )}

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {toolbarBtn(<Link2 size={15} />, "Chèn liên kết", insertLink)}
        {toolbarBtn(<ImagePlus size={15} />, "Chèn ảnh", openImagePicker)}
        {toolbarBtn(<Table2 size={15} />, "Chèn bảng thông số", insertTable)}

        <span className="mx-1 h-5 w-px bg-slate-300" />

        {toolbarBtn(<Undo2 size={15} />, "Hoàn tác", () => exec("undo"))}
        {toolbarBtn(<Redo2 size={15} />, "Làm lại", () => exec("redo"))}

        <div className="ml-auto flex items-center gap-1">
          {uploading && (
            <span className="flex items-center gap-1.5 text-xs text-amber-600">
              <Loader2 size={13} className="animate-spin" />
              Đang tải ảnh...
            </span>
          )}
          <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
            <Eye size={13} />
            Hỗ trợ H1–H3, ảnh, bảng, liên kết
          </span>
        </div>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emitChange}
        onBlur={() => {
          setFocused(false);
          emitChange();
        }}
        onFocus={() => setFocused(true)}
        onPaste={handlePaste}
        className="article-editor min-h-[320px] max-h-[640px] overflow-y-auto px-4 py-3 text-sm leading-relaxed text-slate-700 focus:outline-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default RichTextEditor;
