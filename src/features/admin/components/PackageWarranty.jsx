// ============================================
// PACKAGE WARRANTY SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { SectionHeader } from "@/features/admin/components/PackageBasicInfo";

const WarrantyCard = ({ icon, label, value, color, hint }) => (
  <div className={`p-4 rounded-xl border ${color}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
    </div>
    <input
      value={value}
      onChange={(e) => e.target.form && null}
      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      placeholder="VD: 25 năm"
    />
    {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
  </div>
);

export default function PackageWarranty({ form, set, errors }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Thông tin bảo hành"
        description="Thời hạn bảo hành từng thành phần của hệ thống"
      />

      {/* Warranty overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <WarrantyCard
          icon="☀️"
          label="Bảo hành tấm pin"
          value={form.panelWarranty}
          color="bg-amber-50 border-amber-100"
          hint="Thường 25-30 năm"
        />
        <WarrantyCard
          icon="⚡"
          label="Bảo hành Inverter"
          value={form.inverterWarranty}
          color="bg-blue-50 border-blue-100"
          hint="Thường 5-10 năm"
        />
        <WarrantyCard
          icon="🔧"
          label="Bảo hành lắp đặt"
          value={form.installWarranty}
          color="bg-emerald-50 border-emerald-100"
          hint="Thường 2-5 năm"
        />
      </div>

      {/* Detailed inputs */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bảo hành tấm pin mặt trời <span className="text-red-400">*</span>
          </label>
          <input
            value={form.panelWarranty}
            onChange={(e) => set("panelWarranty", e.target.value)}
            className={`w-full max-w-xs text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors ${
              errors.panelWarranty
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
            }`}
            placeholder="VD: 25 năm"
          />
          {errors.panelWarranty && <p className="mt-1 text-xs text-red-500">{errors.panelWarranty}</p>}
          <p className="mt-1.5 text-[11px] text-slate-400">
            ☀️ Tấm pin chất lượng cao thường có bảo hành hiệu suất 25-30 năm (80% công suất đầu ra)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bảo hành Inverter
          </label>
          <input
            value={form.inverterWarranty}
            onChange={(e) => set("inverterWarranty", e.target.value)}
            className="w-full max-w-xs text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-colors"
            placeholder="VD: 10 năm"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            ⚡ Inverter là linh kiện điện tử, bảo hành thường từ 5-10 năm
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bảo hành lắp đặt
          </label>
          <input
            value={form.installWarranty}
            onChange={(e) => set("installWarranty", e.target.value)}
            className="w-full max-w-xs text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-colors"
            placeholder="VD: 2 năm"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            🔧 Bao gồm công lắp đặt, giá đỡ, dây cáp và các phụ kiện đi kèm
          </p>
        </div>
      </div>

      {/* Coverage info */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Thông tin bảo hành thường bao gồm:</h4>
        <ul className="space-y-1.5 text-sm text-slate-500">
          {[
            "Đổi mới sản phẩm lỗi do nhà sản xuất",
            "Hỗ trợ kỹ thuật qua điện thoại / Zalo 24/7",
            "Bảo trì định kỳ 2 lần/năm (năm đầu tiên miễn phí)",
            "Vận chuyển miễn phí linh kiện thay thế trong thời hạn bảo hành",
            "Thời gian phản hồi: 24-48 giờ tùy khu vực",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
