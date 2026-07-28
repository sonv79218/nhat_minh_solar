// ============================================
// STEP 5: THÓI QUEN DÙNG ĐIỆN
// Điện Mặt Trời Nhật Minh
// Brand sync: green accent, clean white cards
// ============================================

const PHASE_OPTS = [
  { id: "1 Pha", label: "1 pha", desc: "Phổ biến cho gia đình, cửa hàng nhỏ" },
  { id: "3 Pha", label: "3 pha", desc: "Cho nhà xưởng, văn phòng lớn" },
  { id: "Không rõ", label: "Chưa rõ", desc: "Cần kỹ thuật kiểm tra thực tế" },
];

const getDesc = (night) => {
  if (night <= 20) return "Bạn chủ yếu dùng điện ban ngày — rất lý tưởng cho hệ On-grid.";
  if (night <= 40) return "Phân bổ khá đều ngày và đêm — hệ On-grid vẫn phù hợp.";
  if (night <= 60) return "Dùng khá nhiều điện ban đêm — hệ Hybrid được khuyến nghị.";
  return "Tỷ lệ dùng điện ban đêm cao. Nên cân nhắc hệ Hybrid để lưu trữ điện.";
};

export default function StepUsage({ form, update }) {
  const nightRatio = form.dayNightRatio ?? 40;
  const dayRatio = 100 - nightRatio;

  const handleSlider = (val) => update("dayNightRatio", parseInt(val, 10));

  return (
    <div className="space-y-6">
      {/* Day/Night slider */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          Tỷ lệ sử dụng điện
        </p>

        {/* Visual split bar */}
        <div className="flex h-14 rounded-lg overflow-hidden border-2 border-slate-200 mb-3">
          <div
            className="flex flex-col items-center justify-center bg-green-100 transition-all duration-300"
            style={{ flex: dayRatio }}
          >
            <span className="text-base">☀️</span>
            <span className="text-xs font-bold text-green-700">{dayRatio}%</span>
            <span className="text-[9px] text-green-500">Ban ngày</span>
          </div>
          <div
            className="flex flex-col items-center justify-center bg-slate-800 transition-all duration-300"
            style={{ flex: nightRatio }}
          >
            <span className="text-base">🌙</span>
            <span className="text-xs font-bold text-white">{nightRatio}%</span>
            <span className="text-[9px] text-white/50">Ban đêm</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-green-600 font-semibold w-10">☀️ {dayRatio}%</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={nightRatio}
              onChange={(e) => handleSlider(e.target.value)}
              className="flex-1 h-2 rounded-full accent-green-500 cursor-pointer"
              style={{
                background: `linear-gradient(to right, #16a34a ${nightRatio}%, #1e293b ${nightRatio}%)`,
              }}
            />
            <span className="text-xs text-slate-400 font-semibold w-10 text-right">🌙 {nightRatio}%</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600 leading-relaxed">💡 {getDesc(nightRatio)}</p>
        </div>
      </div>

      {/* System phase */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Hệ thống điện hiện tại
        </p>
        <div className="space-y-2">
          {PHASE_OPTS.map(({ id, label, desc }) => {
            const active = form.systemPhase === id;
            return (
              <button
                key={id}
                onClick={() => update("systemPhase", id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border-2 text-left transition-all ${
                  active
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  active ? "border-green-400 bg-green-500" : "border-slate-300"
                }`}>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${active ? "text-green-700" : "text-slate-700"}`}>{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
