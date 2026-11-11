// ============================================
// SOLAR CALCULATOR — RESULT PANEL
// Điện Mặt Trời Nhật Minh
// Brand sync: dark navy header + white card dashboard
// Dữ liệu 100% tính động từ calculateSolution()
// ============================================
import { useMemo } from "react";
import { calculateSolution } from "@/features/calculator/data/calculatorData";

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n);
const fmt2 = (n) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(n);

// ── Stat Card ──────────────────────────────────────
const StatCard = ({ label, value, sub, highlight, danger }) => (
  <div className={`rounded-xl border p-4 ${
    danger ? "bg-red-50 border-red-200"
      : highlight ? "bg-green-50 border-green-200"
      : "bg-white border-slate-100"
  }`}>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">{label}</p>
    <p className={`text-xl font-extrabold leading-tight ${
      danger ? "text-red-700" : highlight ? "text-green-700" : "text-slate-900"
    }`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ── System type badge ──────────────────────────────
const SystemBadge = ({ info }) => (
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

// ── Section card ────────────────────────────────────
const Section = ({ title, subtitle, children, cols = 3 }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-5">
    <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
    {subtitle && <p className="text-xs text-slate-400 mb-4">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    <div className={`grid gap-3 grid-cols-1 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
      {children}
    </div>
  </div>
);

// ── Detail row (bảng thông số) ─────────────────────
const DetailRow = ({ label, value, strong }) => (
  <div className="flex items-center justify-between text-xs py-1">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${strong ? "text-slate-900 font-bold" : "text-slate-600"}`}>{value}</span>
  </div>
);

// ── Input summary ─────────────────────────────────
const InputSummary = ({ form }) => {
  const needsMap = { reduce: "Giảm tiền điện", backup: "Có điện dự phòng", both: "Kết hợp tiết kiệm & lưu trữ", unsure: "Chưa rõ" };
  const buildingMap = { Home: "Gia đình", Business: "Kinh doanh", Factory: "Nhà xưởng" };
  const rows = [
    { label: "Khu vực", value: form.province ? `${form.province} (${form.region})` : "—" },
    { label: "Loại công trình", value: buildingMap[form.buildingType] || "—" },
    { label: "Tiền điện/tháng", value: form.monthlyBill ? `${fmt(form.monthlyBill)} VNĐ` : "—" },
    { label: "Mục tiêu", value: needsMap[form.needs] || "—" },
    { label: "Dự phòng tương lai", value: `${form.futureReservePct || 0}%` },
    { label: "Loại mái", value: form.roofType || "—" },
    { label: "Diện tích mái", value: form.roofArea ? `${form.roofArea} m²` : "—" },
    { label: "Che bóng", value: form.shading || "—" },
    { label: "Tấm pin", value: `${form.panelWatt || 620}Wp` },
    { label: "Ngày / Đêm", value: `${100 - (form.dayNightRatio ?? 60)}% / ${form.dayNightRatio ?? 60}%` },
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

  const savingsNote = r.monthlySavings > 0
    ? `Ước tính giảm ~${fmt(r.monthlySavings)} VNĐ/tháng (~${fmt(r.annualSavings)} VNĐ/năm) theo sản lượng điện mặt trời.`
    : "Chưa đủ dữ liệu để ước tính tiết kiệm.";

  return (
    <div className="space-y-6">
      {/* ── Header strip ── */}
      <div className="bg-[#0b1628] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Kết quả tính toán</span>
          </div>
          <h2 className="text-xl font-extrabold text-white leading-tight">
            Cấu hình điện mặt trời<br />đề xuất cho bạn
          </h2>
          <p className="text-xs text-white/40 mt-1.5">
            Tính động theo dữ liệu đã nhập · {form.province || "Chưa chọn khu vực"}
          </p>
        </div>

        <div className="px-6 py-5">
          {/* System type */}
          <div className="mb-5">
            <SystemBadge info={r.systemTypeInfo} />
            <p className="text-xs text-white/50 mt-2 leading-relaxed">{r.systemReason}</p>
          </div>

          {/* Primary stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Tổng công suất"
              value={`${fmt2(r.capacityKw)} kWp`}
              sub={`${r.panelCount} tấm pin @ ${r.panelWatt}Wp`}
              highlight
            />
            <StatCard
              label="Pin lưu trữ"
              value={r.hasBattery ? `${r.batterySuggested} kWh` : "Không cần"}
              sub={r.hasBattery
                ? `Dùng thực tế ~${fmt2(r.batteryUsable)} kWh`
                : "Hệ On-grid — không có dự phòng"}
            />
            <StatCard
              label="Chi phí đầu tư"
              value="Liên hệ khảo sát"
              sub="Chưa có bảng giá thiết bị chính thức"
            />
            <StatCard
              label="Tiết kiệm ước tính"
              value={r.monthlySavings > 0 ? `${fmt(r.monthlySavings)} ₫` : "—"}
              sub="Mỗi tháng theo sản lượng dự kiến"
            />
          </div>
        </div>
      </div>

      {/* ── A. Thông số hệ thống ── */}
      <Section title="A. Thông số hệ thống" subtitle="Cấu hình giàn pin và thiết bị đề xuất">
        <StatCard label="Loại hệ thống" value={r.systemTypeInfo.label} sub={r.systemTypeInfo.description} highlight />
        <StatCard label="Công suất giàn pin" value={`${fmt2(r.capacityKw)} kWp`} sub={`Yêu cầu tối thiểu: ${fmt2(r.requiredKw)} kWp`} />
        <StatCard label="Công suất mỗi tấm" value={`${r.panelWatt} Wp`} sub={`Diện tích ~${r.panelAreaEach} m²/tấm`} />
        <StatCard label="Số lượng tấm pin" value={`${r.panelCount} tấm`} sub="Làm tròn lên để đủ công suất" />
        <StatCard
          label="Diện tích mái cần thiết"
          value={`${fmt2(r.roofAreaNeeded)} m²`}
          sub={r.roofAreaAvailable > 0 ? `Mái hiện có: ${r.roofAreaAvailable} m²` : "Chưa nhập diện tích mái"}
          danger={!r.roofOk}
        />
        <StatCard
          label="Dung lượng pin lưu trữ"
          value={r.hasBattery ? `${r.batterySuggested} kWh` : "Không cần"}
          sub={r.hasBattery
            ? `Tính toán: ${fmt2(r.batteryNominal)} kWh · dùng được ~${fmt2(r.batteryUsable)} kWh`
            : "Chỉ cần khi muốn dự phòng"}
        />
        <StatCard label="Công suất biến tần" value={`${fmt2(r.inverterKw)} kW`} sub="Cần khảo sát tải thực tế" />
        <StatCard label="Số pha" value={r.phases || "—"} sub="Hệ thống điện hiện tại" />
      </Section>

      {/* ── B. Nhu cầu điện ── */}
      <Section title="B. Nhu cầu điện" subtitle="Quy đổi từ hóa đơn thực tế theo biểu giá 5 bậc + VAT 8%">
        <StatCard label="Tiền điện hiện tại/tháng" value={`${fmt(r.monthlyBill)} ₫`} sub="Số tiền khách hàng nhập" />
        <StatCard label="Điện tiêu thụ/tháng" value={`${fmt2(r.monthlyKwh)} kWh`} sub={`~${fmt(r.avgPricePerKwh)} ₫/kWh trung bình`} />
        <StatCard label="Điện tiêu thụ/ngày" value={`${fmt2(r.dailyKwh)} kWh`} sub="Tính trên 30 ngày/tháng" />
        <StatCard
          label="Điện mục tiêu/ngày"
          value={`${fmt2(r.targetDailyKwh)} kWh`}
          sub={r.reservePct > 0 ? `Đã cộng dự phòng ${r.reservePct}%` : "Dự phòng 0%"}
          highlight
        />
        <StatCard label="Điện ban ngày" value={`${fmt2(r.dayKwh)} kWh`} sub={`${r.dayRatio}% tổng nhu cầu`} />
        <StatCard label="Điện ban đêm" value={`${fmt2(r.nightKwh)} kWh`} sub={`${r.nightRatio}% tổng nhu cầu`} />
      </Section>

      {/* ── C. Hiệu quả dự kiến ── */}
      <Section title="C. Hiệu quả dự kiến" subtitle={`PSH ${fmt2(r.psh)} h/ngày (${r.pshSource}) · hiệu suất ${Math.round(r.systemEfficiency * 100)}% · che bóng ×${r.shadingFactor}`}>
        <StatCard label="Sản lượng/ngày" value={`${fmt2(r.dailyProduction)} kWh`} sub="Tính trên công suất thực tế" highlight />
        <StatCard label="Sản lượng/tháng" value={`${fmt2(r.monthlyProduction)} kWh`} sub="Trên 30 ngày" />
        <StatCard label="Sản lượng/năm" value={`${fmt2(r.annualProduction)} kWh`} sub="Trên 365 ngày" />
        <StatCard
          label="Tỷ lệ đáp ứng nhu cầu"
          value={`${fmt2(r.coverageRatio)}%`}
          sub={`Điện mục tiêu ${fmt2(r.targetDailyKwh)} kWh/ngày`}
          danger={r.coverageRatio < 100}
        />
        <StatCard label="Giờ nắng đỉnh (PSH)" value={`${fmt2(r.psh)} h/ngày`} sub={r.pshSource} />
        <StatCard label="Tiết kiệm ước tính" value={`${fmt(r.monthlySavings)} ₫/tháng`} sub={savingsNote} />
      </Section>

      {/* ── D. Chi phí ── */}
      <Section title="D. Chi phí & khả năng hoàn vốn" subtitle="Cần bảng giá thiết bị chính thức để tính" cols={2}>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Chi phí đầu tư</p>
          <p className="text-xl font-extrabold text-slate-700 leading-tight">Liên hệ khảo sát / báo giá</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Chưa có bảng giá thiết bị thực tế — không tạo giá giả định. Nhân viên Nhật Minh sẽ báo giá sau khảo sát.
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Thời gian hoàn vốn</p>
          <p className="text-xl font-extrabold text-slate-700 leading-tight">Chờ báo giá</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Thời gian hoàn vốn phụ thuộc giá thiết bị và chi phí lắp đặt thực tế — sẽ tính khi có bảng giá.
          </p>
        </div>
      </Section>

      {/* ── Why this solution ── */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          Tại sao cấu hình này phù hợp?
        </h3>
        <ul className="space-y-2">
          {[
            r.systemReason,
            `Từ hóa đơn ${fmt(r.monthlyBill)} ₫, lượng điện ước tính ${fmt2(r.monthlyKwh)} kWh/tháng (${fmt2(r.dailyKwh)} kWh/ngày).`,
            `Với PSH ${fmt2(r.psh)} h/ngày và hiệu suất ${Math.round(r.systemEfficiency * 100)}%, cần ${fmt2(r.requiredKw)} kWp → ${r.panelCount} tấm ${r.panelWatt}Wp cho ${fmt2(r.capacityKw)} kWp thực tế.`,
            `Diện tích mái cần ~${fmt2(r.roofAreaNeeded)} m² (đã tính 1.1 dự phòng lối đi),${r.hasBattery ? ` pin lưu trữ ${r.batterySuggested} kWh cho tải ban đêm ${fmt2(r.nightKwh)} kWh/ngày.` : " không cần pin lưu trữ vì không có nhu cầu dự phòng."}`,
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
          <h3 className="text-sm font-bold text-slate-800">Lưu ý & cảnh báo</h3>
          {r.warnings.map((w, i) => <WarningItem key={i} warning={w} />)}
        </div>
      )}

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
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 12.84 12.84 0 0 0-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a12.84 12.84 0 0 0 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
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
