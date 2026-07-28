// ============================================
// STEP 1: KHU VỰC
// Điện Mặt Trời Nhật Minh
// Brand sync: white cards, green accent, minimal
// ============================================
import { useState, useMemo } from "react";
import { REGIONS } from "@/features/calculator/data/calculatorData";

export default function StepRegion({ form, update }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return REGIONS;
    const q = search.toLowerCase();
    return REGIONS.map((r) => ({
      ...r,
      provinces: r.provinces.filter((p) => p.toLowerCase().includes(q)),
    })).filter((r) => r.provinces.length > 0);
  }, [search]);

  const handleSelect = (region, province) => {
    update("regionId", region.id);
    update("region", region.label);
    update("province", province);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tỉnh hoặc thành phố..."
          className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100 transition-colors"
        />
      </div>

      {/* Selected chip */}
      {form.province && (
        <div className="flex items-center gap-2.5 p-3 bg-green-50 border border-green-100 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="text-sm font-medium text-slate-700 flex-1">{form.province}</p>
          <span className="text-xs text-green-600 font-medium">{form.region}</span>
          <button
            onClick={() => { update("regionId", ""); update("region", ""); update("province", ""); }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Region list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Không tìm thấy tỉnh/thành phố nào.</p>
        )}
        {filtered.map((region) => {
          const isOpen = expanded === region.id;
          const isSelected = form.regionId === region.id;
          return (
            <div key={region.id} className={`rounded-lg border overflow-hidden transition-colors ${
              isSelected ? "border-green-300 bg-green-50/50" : "border-slate-200 bg-white"
            }`}>
              <button
                onClick={() => setExpanded(isOpen ? null : region.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-xl flex-shrink-0">{region.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{region.label}</p>
                  <p className="text-xs text-slate-400">{region.provinces.length} tỉnh/thành</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2">
                  {region.provinces.map((province) => {
                    const active = form.province === province;
                    return (
                      <button
                        key={province}
                        onClick={() => handleSelect(region, province)}
                        className={`px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                          active
                            ? "bg-green-500 text-white"
                            : "bg-slate-50 text-slate-600 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {province}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {form.province && (
        <p className="text-xs text-slate-400">
          Đã chọn <strong className="text-slate-600">{form.province}</strong>. Nhấn <strong className="text-slate-600">Tiếp tục</strong> để sang bước tiếp theo.
        </p>
      )}
    </div>
  );
}
