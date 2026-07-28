// ============================================
// PACKAGE SPECIFICATION SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { SectionHeader } from "@/features/admin/components/PackageBasicInfo";

const Row = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ value, onChange, error, type = "text", placeholder, suffix }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors pr-14 ${
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

const Hint = ({ text }) => <p className="mt-1 text-[11px] text-slate-400">{text}</p>;

export default function PackageSpecification({ form, set, errors }) {
  const setNum = (key) => (val) => {
    const n = parseFloat(val);
    set(key, isNaN(n) ? "" : n);
  };

  const infoCards = [
    {
      label: "System Type",
      value: form.systemType,
      icon: "⚡",
      color: "bg-blue-50 border-blue-100",
    },
    {
      label: "Capacity",
      value: form.capacity ? `${form.capacity} kWp` : "—",
      icon: "🔋",
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Monthly Output",
      value: form.monthlyOutput ? `${form.monthlyOutput} kWh` : "—",
      icon: "📈",
      color: "bg-amber-50 border-amber-100",
    },
    {
      label: "Roof Area",
      value: form.roofArea ? `${form.roofArea} m²` : "—",
      icon: "🏠",
      color: "bg-purple-50 border-purple-100",
    },
    {
      label: "Panel Count",
      value: form.panelCount ? `${form.panelCount} tấm` : "—",
      icon: "☀️",
      color: "bg-yellow-50 border-yellow-100",
    },
    {
      label: "Battery",
      value: form.batteryCapacity ? `${form.batteryCapacity} kWh` : "Không có",
      icon: "🔋",
      color: "bg-slate-50 border-slate-100",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Thông số kỹ thuật"
        description="Cấu hình chi tiết hệ thống điện mặt trời"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {infoCards.map(({ label, value, icon, color }) => (
          <div key={label} className={`rounded-xl border p-3 ${color}`}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Main specs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Row label="Công suất hệ thống (kWp)" required error={errors.capacity}>
          <Input
            type="number"
            value={form.capacity}
            onChange={setNum("capacity")}
            error={errors.capacity}
            placeholder="5"
            suffix="kWp"
          />
          <Hint text="Tổng công suất danh nghĩa của hệ thống" />
        </Row>

        <Row label="Sản lượng/tháng ước tính (kWh)" error={errors.monthlyOutput}>
          <Input
            type="number"
            value={form.monthlyOutput}
            onChange={setNum("monthlyOutput")}
            error={errors.monthlyOutput}
            placeholder="600"
            suffix="kWh"
          />
        </Row>

        <Row label="Diện tích mái yêu cầu (m²)" error={errors.roofArea}>
          <Input
            type="number"
            value={form.roofArea}
            onChange={setNum("roofArea")}
            error={errors.roofArea}
            placeholder="25"
            suffix="m²"
          />
        </Row>

        <Row label="Số lượng tấm pin" error={errors.panelCount}>
          <Input
            type="number"
            value={form.panelCount}
            onChange={setNum("panelCount")}
            error={errors.panelCount}
            placeholder="9"
            suffix="tấm"
          />
        </Row>

        <Row label="Công suất mỗi tấm pin (Wp)" error={errors.panelPower}>
          <Input
            type="number"
            value={form.panelPower}
            onChange={setNum("panelPower")}
            error={errors.panelPower}
            placeholder="550"
            suffix="Wp"
          />
          <Hint text="Thường từ 400-600 Wp mỗi tấm" />
        </Row>
      </div>

      {/* Panel info */}
      <SectionHeader title="Thông tin tấm pin" description="Hãng, model và công suất từng tấm" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Hãng tấm pin" error={errors.panelBrand}>
          <Input value={form.panelBrand} onChange={(v) => set("panelBrand", v)} error={errors.panelBrand} placeholder="VD: Longi Solar" />
        </Row>
        <Row label="Model tấm pin" error={errors.panelModel}>
          <Input value={form.panelModel} onChange={(v) => set("panelModel", v)} error={errors.panelModel} placeholder="VD: LR5-72HBD-550M" />
        </Row>
      </div>

      {/* Inverter info */}
      <SectionHeader title="Thông tin Inverter" description="Bộ chuyển đổi DC → AC" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Hãng Inverter" error={errors.inverterBrand}>
          <Input value={form.inverterBrand} onChange={(v) => set("inverterBrand", v)} error={errors.inverterBrand} placeholder="VD: Growatt, SMA, Huawei" />
        </Row>
        <Row label="Model Inverter" error={errors.inverterModel}>
          <Input value={form.inverterModel} onChange={(v) => set("inverterModel", v)} error={errors.inverterModel} placeholder="VD: MIN 5000 TL-X" />
        </Row>
      </div>

      {/* Battery info */}
      <SectionHeader title="Thông tin pin lưu trữ (nếu có)" description="Chỉ áp dụng cho hệ Hybrid và Off-grid" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Row label="Hãng pin" error={errors.batteryBrand}>
          <Input value={form.batteryBrand} onChange={(v) => set("batteryBrand", v)} error={errors.batteryBrand} placeholder="VD: Pylontech, BYD, SolarEdge" />
        </Row>
        <Row label="Dung lượng pin (kWh)" error={errors.batteryCapacity}>
          <Input
            type="number"
            value={form.batteryCapacity}
            onChange={setNum("batteryCapacity")}
            error={errors.batteryCapacity}
            placeholder="10"
            suffix="kWh"
          />
          <Hint text="Để trống nếu là hệ On-grid (không lưu trữ)" />
        </Row>
      </div>
    </div>
  );
}
