// ============================================
// STEP 2: HÓA ĐƠN ĐIỆN
// Điện Mặt Trời Nhật Minh
// Brand sync: green accent, clean white cards
// ============================================
import { useState } from "react";

const BUILDING_TYPES = [
  { id: "Home", label: "Gia đình", desc: "Nhà ở, căn hộ" },
  { id: "Business", label: "Kinh doanh", desc: "Cửa hàng, văn phòng" },
  { id: "Factory", label: "Nhà xưởng", desc: "Xưởng, kho bãi" },
];

const QUICK_AMOUNTS = [500000, 1000000, 2000000, 3000000, 5000000, 8000000];

const fmt = (n) => new Intl.NumberFormat("vi-VN").format(n);

const fmtDisplay = (raw) => {
  const n = parseInt(raw?.replace(/\D/g, "") || "0", 10);
  if (!n) return "";
  return new Intl.NumberFormat("vi-VN").format(n);
};

export default function StepBill({ form, update }) {
  const [rawInput, setRawInput] = useState(
    form.monthlyBill ? fmtDisplay(form.monthlyBill.toString()) : ""
  );

  const handleQuick = (amount) => {
    update("monthlyBill", amount);
    setRawInput(fmtDisplay(amount.toString()));
  };

  const handleInput = (val) => {
    const raw = val.replace(/\D/g, "");
    setRawInput(fmtDisplay(raw));
    const n = parseInt(raw, 10);
    update("monthlyBill", isNaN(n) ? "" : n);
  };

  return (
    <div className="space-y-6">
      {/* Building type */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Loại công trình
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BUILDING_TYPES.map(({ id, label, desc }) => {
            const active = form.buildingType === id;
            return (
              <button
                key={id}
                onClick={() => update("buildingType", id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-center transition-all ${
                  active
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  active ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {id === "Home" ? "🏠" : id === "Business" ? "🏢" : "🏭"}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${active ? "text-green-700" : "text-slate-700"}`}>{label}</p>
                  <p className="text-[10px] text-slate-400">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly bill */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Tiền điện trung bình / tháng
        </p>

        {/* Quick amounts */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {QUICK_AMOUNTS.map((amount) => {
            const active = form.monthlyBill === amount;
            return (
              <button
                key={amount}
                onClick={() => handleQuick(amount)}
                className={`py-2.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                  active
                    ? "border-green-400 bg-green-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {amount >= 1000000
                  ? `${(amount / 1000000).toFixed(0)}M`
                  : `${(amount / 1000).toFixed(0)}K`}
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={rawInput}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Nhập số tiền..."
            className="w-full px-4 py-3.5 text-base font-semibold border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-green-400 focus:bg-white transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">VNĐ</span>
        </div>

        {form.monthlyBill > 0 && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            ✓ {new Intl.NumberFormat("vi-VN").format(form.monthlyBill)} VNĐ / tháng
          </p>
        )}
      </div>
    </div>
  );
}
