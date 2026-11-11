// ============================================
// STEP 4: MÁI NHÀ
// Điện Mặt Trời Nhật Minh
// Brand sync: green accent, clean white cards
// ============================================
import { useState } from "react";
import { PANEL_OPTIONS, SYSTEM_CONFIG } from "@/features/calculator/data/calculatorData";

const ROOF_TYPES = [
  { id: "Tôn", label: "Mái tôn", desc: "Nhà xưởng, nhà ở" },
  { id: "Ngói", label: "Mái ngói", desc: "Biệt thự, nhà phố" },
  { id: "Bê tông", label: "Mái bê tông", desc: "Tòa nhà, chung cư" },
  { id: "Không rõ", label: "Chưa rõ", desc: "Cần khảo sát thực tế" },
];

const SHADING_LEVELS = [
  { id: "Không đáng kể", label: "Không đáng kể", desc: "Mái thoáng, không vật cản", pct: 100 },
  { id: "Một phần", label: "Một phần", desc: "Có bóng cây, tòa nhà lân cận", pct: 65 },
  { id: "Nhiều", label: "Nhiều", desc: "Bị che bóng nhiều giờ trong ngày", pct: 30 },
  { id: "Chưa rõ", label: "Chưa rõ", desc: "Cần khảo sát thực tế", pct: 50 },
];

const AREA_PRESETS = [20, 40, 60, 80, 100];

export default function StepRoof({ form, update }) {
  const [areaInput, setAreaInput] = useState(form.roofArea ? form.roofArea.toString() : "");
  const panelWatt = form.panelWatt || 620;
  const panelDef = PANEL_OPTIONS.find((p) => p.watt === panelWatt) || PANEL_OPTIONS[2];
  const panelArea = panelDef.area || SYSTEM_CONFIG.panelAreaEach;

  const adjustArea = (delta) => {
    const cur = parseInt(areaInput, 10) || 0;
    const next = Math.max(0, cur + delta);
    setAreaInput(next.toString());
    update("roofArea", next);
  };

  const handleAreaChange = (val) => {
    const raw = val.replace(/\D/g, "");
    setAreaInput(raw);
    const n = parseInt(raw, 10);
    update("roofArea", isNaN(n) ? "" : n);
  };

  const roofArea = parseInt(areaInput, 10) || 0;
  const estPanels = Math.floor(roofArea / panelArea);
  const estCap = ((estPanels * panelWatt) / 1000).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Roof type */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Loại mái của bạn
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ROOF_TYPES.map(({ id, label, desc }) => {
            const active = form.roofType === id;
            return (
              <button
                key={id}
                onClick={() => update("roofType", id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  active
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 text-sm ${
                  active ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {id === "Tôn" ? "🏠" : id === "Ngói" ? "🏡" : id === "Bê tông" ? "🏗️" : "❓"}
                </div>
                <p className={`text-sm font-semibold ${active ? "text-green-700" : "text-slate-700"}`}>{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roof area */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Diện tích mái có thể lắp đặt
        </p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => adjustArea(-5)}
            className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-bold text-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            −
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              value={areaInput}
              onChange={(e) => handleAreaChange(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-center text-lg font-bold border-2 border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-green-400 focus:bg-white transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">m²</span>
          </div>
          <button
            onClick={() => adjustArea(5)}
            className="w-10 h-10 rounded-lg bg-green-500 text-white font-bold text-lg flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-1.5 mb-3">
          {AREA_PRESETS.map((val) => (
            <button
              key={val}
              onClick={() => { setAreaInput(val.toString()); update("roofArea", val); }}
              className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${
                roofArea === val
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {val}m²
            </button>
          ))}
        </div>

        {/* Live estimate */}
        {roofArea > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            <p className="text-xs text-blue-700">
              Ước tính: <strong>{estCap} kWp</strong> ({estPanels} tấm pin @ {panelWatt}Wp)
            </p>
          </div>
        )}
      </div>

      {/* Panel wattage */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Công suất tấm pin
        </p>
        <div className="grid grid-cols-4 gap-2">
          {PANEL_OPTIONS.map(({ watt, label }) => {
            const active = panelWatt === watt;
            return (
              <button
                key={watt}
                onClick={() => update("panelWatt", watt)}
                className={`py-2.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                  active
                    ? "border-green-400 bg-green-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Diện tích mỗi tấm: ~{panelArea} m². Diện tích mái cần = số tấm × {panelArea} m² × 1.1 (dự phòng lối đi).
        </p>
      </div>

      {/* Shading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Mức độ che bóng trên mái
        </p>
        <div className="space-y-2">
          {SHADING_LEVELS.map(({ id, label, desc, pct }) => {
            const active = form.shading === id;
            return (
              <button
                key={id}
                onClick={() => update("shading", id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-lg border-2 text-left transition-all ${
                  active
                    ? "border-green-400 bg-green-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-8 h-2 rounded-full flex-shrink-0 ${
                  pct >= 90 ? "bg-green-400" : pct >= 60 ? "bg-blue-400" : pct >= 40 ? "bg-amber-400" : "bg-red-400"
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${active ? "text-green-700" : "text-slate-700"}`}>{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full border-2 border-green-400 bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
