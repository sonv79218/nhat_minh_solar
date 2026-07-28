// ============================================
// PACKAGE INVESTMENT SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { useEffect } from "react";
import { SectionHeader } from "@/features/admin/components/PackageBasicInfo";

const fmt = (n) => n ? new Intl.NumberFormat("vi-VN").format(n) : "—";

const Row = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ value, onChange, error, type = "text", placeholder, suffix, prefix }) => (
  <div className="relative">
    {prefix && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
        {prefix}
      </span>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors ${prefix ? "pl-8" : ""} ${suffix ? "pr-12" : ""} ${
        error
          ? "border-red-300 focus:ring-red-100 focus:border-red-400"
          : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
      }`}
    />
    {suffix && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
        {suffix}
      </span>
    )}
  </div>
);

export default function PackageInvestment({ form, set, errors }) {
  // Auto-calculate savings if price + capacity are available
  useEffect(() => {
    if (form.price && form.capacity) {
      const price = Number(form.price);
      const cap = Number(form.capacity);
      if (price > 0 && cap > 0) {
        const estimatedMonthly = Math.round(cap * 120000);
        const annual = estimatedMonthly * 12;
        const payback = price / annual;
        set("monthlySavings", estimatedMonthly);
        set("annualSavings", annual);
        set("paybackYears", Math.round(payback * 10) / 10);
      }
    }
  }, [form.price, form.capacity]);

  const InfoRow = ({ label, value, sub, icon, color }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
      <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center text-base">${icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );

  const co2Color = form.co2Reduction
    ? Number(form.co2Reduction) >= 5
      ? "bg-emerald-50 border-emerald-100"
      : "bg-blue-50 border-blue-100"
    : "bg-slate-50 border-slate-100";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Thông tin đầu tư"
        description="Ước tính lợi nhuận và thời gian hoàn vốn"
      />

      {/* Auto-calculated summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <InfoRow
          label="Tiết kiệm/tháng"
          value={form.monthlySavings ? `${fmt(form.monthlySavings)} ₫` : "—"}
          sub="Ước tính"
          icon="💰"
          color="bg-emerald-50 border-emerald-100"
        />
        <InfoRow
          label="Tiết kiệm/năm"
          value={form.annualSavings ? `${fmt(form.annualSavings)} ₫` : "—"}
          sub="Trước khi inflation"
          icon="📈"
          color="bg-blue-50 border-blue-100"
        />
        <InfoRow
          label="Thời gian hoàn vốn"
          value={form.paybackYears ? `${form.paybackYears} năm` : "—"}
          sub="Ước tính ~5-7 năm"
          icon="⏱"
          color="bg-amber-50 border-amber-100"
        />
        <InfoRow
          label="Giảm CO₂"
          value={form.co2Reduction ? `${form.co2Reduction} tấn` : "—"}
          sub="/ năm"
          icon="🌿"
          color={co2Color}
        />
      </div>

      <p className="text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        💡 Giá trị tiết kiệm được tự động ước tính dựa trên giá gói và công suất. Bạn có thể điều chỉnh thủ công nếu cần.
      </p>

      {/* Manual input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Tiết kiệm hàng tháng (VNĐ)" error={errors.monthlySavings}>
          <Input
            type="number"
            value={form.monthlySavings}
            onChange={(v) => set("monthlySavings", Number(v) || "")}
            error={errors.monthlySavings}
            placeholder="2200000"
            prefix="₫"
          />
        </Row>

        <Row label="Tiết kiệm hàng năm (VNĐ)" error={errors.annualSavings}>
          <Input
            type="number"
            value={form.annualSavings}
            onChange={(v) => set("annualSavings", Number(v) || "")}
            error={errors.annualSavings}
            placeholder="26400000"
            prefix="₫"
          />
        </Row>

        <Row label="Thời gian hoàn vốn (năm)" error={errors.paybackYears}>
          <Input
            type="number"
            value={form.paybackYears}
            onChange={(v) => set("paybackYears", Number(v) || "")}
            error={errors.paybackYears}
            placeholder="4.5"
            suffix="năm"
            step="0.1"
          />
        </Row>

        <Row label="Giảm khí thải CO₂ (tấn/năm)" error={errors.co2Reduction}>
          <Input
            type="number"
            value={form.co2Reduction}
            onChange={(v) => set("co2Reduction", Number(v) || "")}
            error={errors.co2Reduction}
            placeholder="3.0"
            suffix="tấn"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Tính theo công thức: kWh × 0.5kg CO₂ / 1000
          </p>
        </Row>
      </div>

      {/* ROI comparison table */}
      <SectionHeader title="So sánh hiệu quả" description="Dữ liệu tham khảo" />
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Chỉ số</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Giá trị</th>
              <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { label: "Công suất hệ thống", value: form.capacity ? `${form.capacity} kWp` : "—", note: "Đỉnh PV" },
              { label: "Sản lượng ước tính/tháng", value: form.monthlyOutput ? `${form.monthlyOutput} kWh` : "—", note: "Thực tế ~80% công suất" },
              { label: "Sản lượng ước tính/năm", value: form.monthlyOutput ? `${(form.monthlyOutput * 12).toLocaleString()} kWh` : "—", note: "Theo bức xạ VN" },
              { label: "Chi phí đầu tư", value: form.price ? `${fmt(form.price)} ₫` : "—", note: "Giá gói đã chọn" },
              { label: "Giá trị điện tiết kiệm/năm", value: form.annualSavings ? `${fmt(form.annualSavings)} ₫` : "—", note: "Theo giá điện 2025" },
            ].map(({ label, value, note }) => (
              <tr key={label} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 text-slate-600">{label}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{value}</td>
                <td className="px-4 py-2.5 text-right text-xs text-slate-400">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
