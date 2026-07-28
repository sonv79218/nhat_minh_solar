// ============================================
// PACKAGE SEO SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { useEffect } from "react";
import { Globe, Search, BarChart2, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/features/admin/components/PackageBasicInfo";

export default function PackageSEO({ form, set, errors }) {
  const metaTitleLen = (form.metaTitle || "").length;
  const metaDescLen = (form.metaDescription || "").length;

  useEffect(() => {
    if (!form.metaTitle && form.name) {
      set("metaTitle", `${form.name} - Điện Mặt Trời Nhật Minh`);
    }
    if (!form.metaDescription && form.shortDescription) {
      set("metaDescription", form.shortDescription);
    }
  }, [form.name, form.shortDescription]);

  const score = [
    metaTitleLen >= 30 && metaTitleLen <= 60 ? 1 : 0,
    metaDescLen >= 80 && metaDescLen <= 160 ? 1 : 0,
    form.keywords && form.keywords.length > 5 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const scoreLabel = ["Thiếu", "Cần cải thiện", "Khá tốt", "Tốt"][score] || "Thiếu";
  const scoreColor = ["bg-red-100 text-red-600", "bg-amber-100 text-amber-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600"][score] || "bg-red-100 text-red-600";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SEO & Tối ưu tìm kiếm"
        description="Thiết lập thẻ meta để cải thiện thứ hạng trên Google"
      />

      {/* SEO Score */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <BarChart2 className="w-8 h-8 text-slate-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">Điểm SEO</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${scoreColor}`}>
              {scoreLabel}
            </span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < score ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SEO Fields */}
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Meta Title
            </label>
            <span className={`text-[11px] font-medium ${metaTitleLen > 60 ? "text-red-500" : metaTitleLen < 30 ? "text-slate-400" : "text-emerald-500"}`}>
              {metaTitleLen}/60 ký tự
            </span>
          </div>
          <input
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
            maxLength={80}
            placeholder="VD: Gói Standard 5kWp - Điện Mặt Trời Nhật Minh Bắc Ninh"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-colors"
          />
          {metaTitleLen > 60 && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500">
              <AlertTriangle className="w-3.5 h-3.5" />
              Title quá dài, Google có thể cắt ngắn trong kết quả tìm kiếm
            </div>
          )}
          {/* SERP Preview */}
          <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-400 mb-1.5">🔍 Xem trước Google:</p>
            <p className="text-sm text-blue-600 font-medium leading-snug hover:underline cursor-pointer">
              {form.metaTitle || "Tiêu đề SEO..."}
            </p>
            <p className="text-xs text-emerald-600 leading-snug">
              https://nhatminh.vn/solar/{form.slug || "goi-solar"}
            </p>
            <p className="text-xs text-slate-500 leading-snug mt-0.5 line-clamp-2">
              {(form.metaDescription || "Mô tả meta sẽ hiển thị ở đây...").substring(0, 160)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Meta Description
            </label>
            <span className={`text-[11px] font-medium ${metaDescLen > 160 ? "text-red-500" : metaDescLen < 80 ? "text-slate-400" : "text-emerald-500"}`}>
              {metaDescLen}/160 ký tự
            </span>
          </div>
          <textarea
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="Mô tả ngắn về gói Solar này, khoảng 80-160 ký tự. Nên chứa từ khóa chính và hành động kêu gọi."
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-colors resize-none"
          />
          {metaDescLen === 0 && (
            <p className="mt-1 text-xs text-slate-400">Nên viết mô tả chứa từ khóa chính: điện mặt trời, {form.capacity || "X"}kWp, gói {form.category || "..."}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Từ khóa (Keywords)
          </label>
          <input
            value={form.keywords}
            onChange={(e) => set("keywords", e.target.value)}
            placeholder="điện mặt trời, 5kWp, solar, nhật minh, bắc ninh, tiết kiệm điện"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-colors"
          />
          <p className="mt-1 text-xs text-slate-400">
            Phân cách bằng dấu phẩy. Thêm tỉnh/thành phố để SEO địa phương tốt hơn
          </p>
        </div>
      </div>

      {/* SEO tips */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-700 mb-2">💡 Mẹo SEO cho gói Solar</h4>
        <ul className="space-y-1 text-xs text-amber-700">
          <li>• Đặt tên gói có chứa công suất: "Gói 5kWp" thay vì "Gói Standard"</li>
          <li>• Meta description nên có CTA: "Liên hệ ngay" hoặc "Xem chi tiết"</li>
          <li>• Thêm từ khóa địa phương: "Bắc Ninh", "Từ Sơn", "Hải Dương"</li>
          <li>• URL slug đã tạo tự động từ tên gói (có thể chỉnh tay)</li>
        </ul>
      </div>
    </div>
  );
}
