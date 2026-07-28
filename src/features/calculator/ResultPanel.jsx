// ============================================
// SOLAR CALCULATOR — RESULT PANEL
// Điện Mặt Trời Nhật Minh
// Brand sync: dark navy header + white card dashboard
// ============================================
import { useMemo } from "react";
import { calculateSolution } from "@/features/calculator/data/calculatorData";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n);
const fmtShort = (n) => {
  if (!n) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} tỷ`;
  if (n >= 1e6) return `${Math.round(n / 1e6)} triệu`;
  return fmt(n);
};

// ── Stat Card ──────────────────────────────────────
const StatCard = ({ label, value, sub, highlight }) => (
  <div className={`rounded-xl border p-4 ${highlight ? "bg-green-50 border-green-200" : "bg-white border-slate-100"}`}>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">{label}</p>
    <p className={`text-xl font-extrabold leading-tight ${highlight ? "text-green-700" : "text-slate-900"}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ── System type badge ──────────────────────────────
const SystemBadge = ({ info, type }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${info.color}`}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
    <span>{info.label}</span>
    <span className="text-xs font-normal opacity-70">{info.description}</span>
  </div>
);

// ── Warning item ───────────────────────────────────
const WarningItem = ({ warning }) => {
  const cfg = {
    danger:  { bg: "bg-red-50", border: "border-red-200", icon: "⚠️", text: "text-red-700" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚡", text: "text-amber-700" },
    info:    { bg: "bg-blue-50", border: "border-blue-200", icon: "💡", text: "text-blue-700" },
  };
  const c = cfg[warning.type] || cfg.info;
  return (
    <div className={`flex gap-3 p-3 rounded-lg ${c.bg} border ${c.border}`}>
      <span className="text-base flex-shrink-0">{c.icon}</span>
      <p className={`text-xs ${c.text} leading-relaxed`}>{warning.message}</p>
    </div>
  );
};

// ── Payback bar chart ──────────────────────────────
const PaybackChart = ({ data, paybackYears, systemCost }) => {
  const max = systemCost * 1.4;
  return (
    <div>
      <div className="flex items-end gap-1 h-28">
        {data.map(({ year, savings }) => {
          const h = Math.min((savings / max) * 100, 100);
          const be = year >= paybackYears;
          return (
            <div key={year} className="flex flex-col items-center flex-1 gap-1">
              <div className="w-full flex flex-col-reverse">
                <div
                  className={`w-full rounded-t-sm transition-all duration-500 ${
                    be ? "bg-green-400" : "bg-slate-300"
                  }`}
                  style={{ height: `${Math.max(h, 3)}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400">năm {year}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2 rounded-sm bg-slate-300" />
          Chi phí đầu tư
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-2.5 h-2 rounded-sm bg-green-400" />
          Lợi nhuận tích lũy
        </span>
        <span className="ml-auto font-semibold text-green-600">
          Hoàn vốn: năm {paybackYears}
        </span>
      </div>
    </div>
  );
};

// ── Input summary ─────────────────────────────────
const InputSummary = ({ form }) => {
  const needsMap = { reduce: "Giảm tiền điện", backup: "Có điện dự phòng", both: "Kết hợp tiết kiệm & lưu trữ", unsure: "Chưa rõ" };
  const buildingMap = { Home: "Gia đình", Business: "Kinh doanh", Factory: "Nhà xưởng" };
  const rows = [
    { label: "Khu vực", value: form.province ? `${form.province} (${form.region})` : "—" },
    { label: "Loại công trình", value: buildingMap[form.buildingType] || "—" },
    { label: "Tiền điện/tháng", value: form.monthlyBill ? `${fmt(form.monthlyBill)} VNĐ` : "—" },
    { label: "Mục tiêu", value: needsMap[form.needs] || "—" },
    { label: "Loại mái", value: form.roofType || "—" },
    { label: "Diện tích mái", value: form.roofArea ? `${form.roofArea} m²` : "—" },
    { label: "Che bóng", value: form.shading || "—" },
    { label: "Ngày / Đêm", value: `${100 - (form.dayNightRatio ?? 40)}% / ${form.dayNightRatio ?? 40}%` },
    { label: "Hệ thống điện", value: form.systemPhase || "—" },
  ];
  return (
    <div className="space-y-2">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className="font-medium text-slate-600">{value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main ResultPanel ───────────────────────────────
export default function ResultPanel({ form, onReset, onBack }) {
  const r = useMemo(() => calculateSolution(form), [form]);

  return (
    <div className="space-y-6">
      {/* ── Header strip ── */}
      <div className="bg-[#0b1628] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Kết quả cá nhân hóa</span>
          </div>
          <h2 className="text-xl font-extrabold text-white leading-tight">
            Giải pháp phù hợp<br />dự kiến cho bạn
          </h2>
          <p className="text-xs text-white/40 mt-1.5">
            Dựa trên thông tin đã cung cấp · {form.province}
          </p>
        </div>

        <div className="px-6 py-5">
          {/* System type */}
          <div className="mb-5">
            <SystemBadge info={r.systemTypeInfo} type={r.systemType} />
          </div>

          {/* Primary stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Công suất"
              value={`${r.capacityKw} kWp`}
              sub={`${r.panelCount} tấm pin`}
              highlight
            />
            <StatCard
              label="Pin lưu trữ"
              value={r.batteryCapacity > 0 ? `${r.batteryCapacity} kWh` : "Không cần"}
              sub={r.batteryCapacity > 0 ? "Hệ Hybrid / Off-grid" : "Hệ On-grid"}
            />
            <StatCard
              label="Chi phí dự kiến"
              value={fmtShort(r.systemCost)}
              sub="Bao gồm lắp đặt"
              highlight
            />
            <StatCard
              label="Tiết kiệm / năm"
              value={fmtShort(r.annualSavings)}
              sub={`~${fmtShort(r.monthlySavings)}/tháng`}
            />
          </div>
        </div>
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Sản lượng/năm" value={`${r.annualProduction.toLocaleString()} kWh`} sub={`${r.monthlyProduction.toLocaleString()} kWh/tháng`} />
        <StatCard label="Hoàn vốn" value={`${r.paybackYears} năm`} sub="Dự kiến" />
        <StatCard label="Diện tích mái" value={`${r.roofAreaNeeded} m²`} sub="Tấm 550Wp" />
      </div>

      {/* ── Why this solution ── */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          Tại sao hệ thống này phù hợp?
        </h3>
        <ul className="space-y-2">
          {[
            `Hệ ${r.systemTypeInfo.label} phù hợp với mục tiêu "${form.needs === "reduce" ? "giảm tiền điện" : form.needs === "backup" ? "có điện dự phòng" : "kết hợp cả hai"}" của bạn.`,
            `Công suất ${r.capacityKw} kWp giúp tiết kiệm ~${fmtShort(r.monthlySavings)}/tháng (${fmtShort(r.annualSavings)}/năm).`,
            r.paybackYears <= 5
              ? `Thời gian hoàn vốn chỉ ${r.paybackYears} năm — rất hợp lý cho đầu tư điện mặt trời.`
              : `Sau khi hoàn vốn (${r.paybackYears} năm), điện gần như miễn phí trong 20-25 năm tới.`,
          ].map((item, i) => (
            <li key={i} className="text-xs text-green-700 flex items-start gap-2">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Warnings ── */}
      {r.warnings.length > 0 && (
        <div className="space-y-2">
          {r.warnings.map((w, i) => <WarningItem key={i} warning={w} />)}
        </div>
      )}

      {/* ── Payback chart ── */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Biểu đồ hoàn vốn theo thời gian</h3>
        <p className="text-xs text-slate-400 mb-4">Chi phí đầu tư vs. Lợi nhuận tích lũy</p>
        <PaybackChart
          data={r.paybackChart}
          paybackYears={r.paybackYears}
          systemCost={r.systemCost}
        />
      </div>

      {/* ── Input summary (collapsible) ── */}
      <details className="group bg-white rounded-xl border border-slate-100">
        <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
          <span>Xem lại thông tin đã nhập</span>
          <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </summary>
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <InputSummary form={form} />
        </div>
      </details>

      {/* ── CTA buttons ── */}
      <div className="space-y-2.5">
        <a
          href="tel:0876906668"
          className="flex items-center justify-center gap-2.5 w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
          </svg>
          Nhận báo giá chi tiết
        </a>

        <a
          href="https://zalo.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full h-12 bg-[#0068ff] hover:bg-[#0052d4] text-white font-bold text-sm rounded-lg transition-colors"
        >
          <span className="font-bold text-base">Z</span>
          Gửi kết quả qua Zalo
        </a>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Tính lại
        </button>
      </div>

      {/* ── Back button ── */}
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 w-full text-sm text-slate-400 hover:text-green-600 transition-colors py-1"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Quay lại chỉnh sửa
      </button>
    </div>
  );
}
