// ============================================
// STEP 3: NHU CẦU SỬ DỤNG
// Điện Mặt Trời Nhật Minh
// Brand sync: green accent, clean white cards
// ============================================

const MAIN_NEEDS = [
  {
    id: "reduce",
    label: "Giảm tiền điện",
    desc: "Tối ưu chi phí sinh hoạt hoặc kinh doanh",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    check: "bg-blue-500",
  },
  {
    id: "backup",
    label: "Có điện dự phòng",
    desc: "Sử dụng khi mất điện lưới quốc gia",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    check: "bg-amber-500",
  },
  {
    id: "both",
    label: "Kết hợp cả hai",
    desc: "Vừa giảm tiền điện, vừa có điện dự phòng",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    check: "bg-purple-500",
  },
  {
    id: "unsure",
    label: "Chưa rõ, cần tư vấn",
    desc: "Để đội ngũ Nhật Minh đề xuất phù hợp nhất",
    color: "bg-slate-50 border-slate-200 text-slate-700",
    check: "bg-slate-500",
  },
];

const EXTRA_OPTS = [
  { id: "frequentBlackouts", label: "Thường xuyên mất điện", sub: "Khu vực hay cắt điện luân phiên" },
  { id: "expandLoad", label: "Có nhu cầu mở rộng tải", sub: "Lắp thêm thiết bị trong tương lai" },
  { id: "hasEv", label: "Có xe điện hoặc dự định mua", sub: "Ô tô, xe máy điện" },
];

export default function StepNeeds({ form, update }) {
  const toggle = (key) => update(key, !form[key]);

  return (
    <div className="space-y-6">
      {/* Main needs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Mục tiêu chính của bạn
        </p>
        <div className="space-y-2">
          {MAIN_NEEDS.map(({ id, label, desc, color, check }) => {
            const active = form.needs === id;
            return (
              <button
                key={id}
                onClick={() => update("needs", id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${active ? color : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  active ? `border-transparent ${check}` : "border-slate-300"
                }`}>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${active ? "" : "text-slate-700"}`}>{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Extra options */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Thông tin bổ sung <span className="font-normal normal-case">(tùy chọn)</span>
        </p>
        <div className="space-y-2">
          {EXTRA_OPTS.map(({ id, label, sub }) => {
            const active = form[id];
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border-2 text-left transition-all ${
                  active
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  active ? "border-green-400 bg-green-500" : "border-slate-300"
                }`}>
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${active ? "text-green-700" : "text-slate-700"}`}>{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
