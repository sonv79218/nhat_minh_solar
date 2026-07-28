// ============================================
// PACKAGE MEDIA SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { useState, useRef } from "react";
import { Upload, X, Image, Plus, ExternalLink, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/features/admin/components/PackageBasicInfo";

const ImageUploader = ({ label, hint, value, onChange, accept = "image/*", multiple = false }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const validateFile = (file) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Chỉ chấp nhận file ảnh: JPG, PNG, WebP, GIF");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File quá lớn. Tối đa 5MB.");
      return false;
    }
    setError("");
    return true;
  };

  const processFiles = (files) => {
    const arr = Array.from(files);
    arr.forEach((file) => {
      if (!validateFile(file)) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(multiple ? [...(value || []), e.target.result] : e.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const remove = (index) => {
    const updated = (value || []).filter((_, i) => i !== index);
    onChange(updated);
  };

  if (multiple) {
    const images = value || [];
    return (
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1.5">{label}</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
          }`}
        >
          <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? "text-emerald-500" : "text-slate-300"}`} />
          <p className="text-sm font-medium text-slate-500">
            Kéo thả ảnh vào đây hoặc <span className="text-emerald-500">bấm để chọn</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP • Tối đa 5MB mỗi ảnh</p>
          <input ref={inputRef} type="file" accept={accept} multiple onChange={handleChange} className="hidden" />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}

        {/* Image grid */}
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((src, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }

  // Single image uploader (thumbnail)
  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-1.5">{label}</p>
      {value ? (
        <div className="relative w-full max-w-[280px] rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
          <img src={value} alt="Thumbnail" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[11px] rounded-md hover:bg-black/80 transition-colors"
          >
            Đổi ảnh
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
          }`}
        >
          <Image className={`w-8 h-8 mx-auto mb-2 ${dragOver ? "text-emerald-500" : "text-slate-300"}`} />
          <p className="text-sm font-medium text-slate-500">
            Kéo thả hoặc <span className="text-emerald-500">bấm để tải ảnh lên</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP • Tối đa 5MB • Khuyến nghị 800×600px</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

export default function PackageMedia({ form, set, errors }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Hình ảnh & Video" description="Ảnh đại diện, bộ sưu tập và video giới thiệu" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImageUploader
          label="Ảnh đại diện (Thumbnail) *"
          hint="Hiển thị trên card danh sách và trang chi tiết"
          value={form.thumbnail}
          onChange={(v) => set("thumbnail", v)}
        />

        <ImageUploader
          label="Bộ sưu tập ảnh (Gallery)"
          hint="Ảnh chi tiết, kích thước, lắp đặt thực tế..."
          value={form.gallery}
          onChange={(v) => set("gallery", v)}
          multiple
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Video URL (YouTube / Vimeo)
        </label>
        <div className="flex items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              🔗
            </span>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => set("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={`w-full text-sm border rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 transition-colors ${
                errors.videoUrl
                  ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                  : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
              }`}
            />
          </div>
          {form.videoUrl && (
            <a
              href={form.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-500 hover:border-emerald-300 transition-colors"
              title="Mở video"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {errors.videoUrl && <p className="mt-1 text-xs text-red-500">{errors.videoUrl}</p>}
        <p className="mt-1.5 text-xs text-slate-400">
          Dán link YouTube hoặc Vimeo để nhúng video giới thiệu sản phẩm
        </p>
      </div>

      {/* Image tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">📷 Mẹo chọn ảnh chất lượng</h4>
        <ul className="space-y-1 text-xs text-blue-600">
          <li>• Dùng ảnh thực tế lắp đặt (không dùng ảnh stock quá nhiều)</li>
          <li>• Độ phân giải tối thiểu 800×600px, tỷ lệ 4:3 hoặc 16:9</li>
          <li>• Chụp ảnh có ánh sáng tự nhiên, tránh ngược sáng</li>
          <li>• Ảnh thumbnail: chọn ảnh toàn cảnh hệ thống trên mái</li>
          <li>• Gallery: thêm ảnh chi tiết tấm pin, inverter, công tơ điện</li>
        </ul>
      </div>
    </div>
  );
}
