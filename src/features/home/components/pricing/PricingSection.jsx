// ============================================
// PRICING SECTION — Bảng giá giải pháp điện mặt trời
// Điện Mặt Trời Nhật Minh
// Desktop: 4 col | Tablet: 2 col | Mobile: 1 col
// ============================================
import { useState, useMemo } from "react";
import PricingCard from "@/features/home/components/pricing/PricingCard";
import {
  ALL_GROUPS,
  ALL_PACKAGES,
  FILTER_BILL_RANGES,
  FILTER_STORAGE,
  FILTER_PHASE,
  INITIAL_FILTERS,
} from "@/features/home/components/pricing/pricingData";

const INITIAL_VISIBLE = 4;

// ── Filter Chip ────────────────────────────────────
const FilterChip = ({ option, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all whitespace-nowrap ${
      active
        ? "bg-green-500 border-green-500 text-white shadow-sm"
        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
    }`}
  >
    {option.label}
  </button>
);

// ── Group Header ────────────────────────────────────
const GroupHeader = ({ group }) => (
  <div className="mb-6">
    <div className="flex items-start gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-xl flex-shrink-0">
        {group.icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-900">{group.label}</h3>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${group.badgeColor}`}>
            {group.badge}
          </span>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{group.description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs text-slate-400 ml-[52px]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
      </svg>
      <span>{group.billRange}</span>
      <span className="text-slate-200">·</span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
      <span>{group.phase}</span>
    </div>
  </div>
);

// ── Package Group ───────────────────────────────────
const PackageGroup = ({ group, filters }) => {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  // Apply cross-filter
  const filtered = useMemo(() => {
    return group.packages.filter((pkg) => {
      if (filters.storage === "with-storage" && !pkg.hasStorage) return false;
      if (filters.storage === "no-storage" && pkg.hasStorage) return false;
      if (filters.phase === "1-ph" && !pkg.phase.includes("1 pha")) return false;
      if (filters.phase === "3-ph" && !pkg.phase.includes("3 pha")) return false;
      return true;
    });
  }, [group.packages, filters]);

  const hasMore = filtered.length > INITIAL_VISIBLE;

  return (
    <div className="mb-12 last:mb-0">
      <GroupHeader group={group} />
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Không có gói nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.slice(0, visible).map((pkg, i) => (
              <PricingCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
          {hasMore && visible < filtered.length && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisible((v) => v + INITIAL_VISIBLE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Xem thêm {filtered.length - visible} gói
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── Main PricingSection ─────────────────────────────
export default function PricingSection() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilter =
    filters.billRange !== "all" ||
    filters.storage !== "all" ||
    filters.phase !== "all";

  // Filtered groups
  const visibleGroups = useMemo(() => {
    if (filters.billRange === "all") return ALL_GROUPS;
    return ALL_GROUPS.filter((g) => g.id === filters.billRange);
  }, [filters.billRange]);

  const totalPackages = visibleGroups.reduce(
    (sum, g) => sum + g.packages.filter((pkg) => {
      if (filters.storage === "with-storage" && !pkg.hasStorage) return false;
      if (filters.storage === "no-storage" && pkg.hasStorage) return false;
      if (filters.phase === "1-ph" && !pkg.phase.includes("1 pha")) return false;
      if (filters.phase === "3-ph" && !pkg.phase.includes("3 pha")) return false;
      return true;
    }).length,
    0
  );

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <span>Bảng giá</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
            Giải pháp điện mặt trời<br className="hidden sm:block" />
            <span className="text-green-600">theo nhu cầu của bạn</span>
          </h2>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Từ gói tiết kiệm cho gia đình nhỏ đến hệ thống công nghiệp — chọn công suất phù hợp với mức hóa đơn và nhu cầu sử dụng.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="mb-10">
          {/* Filter groups */}
          <div className="flex flex-col gap-4">

            {/* Row 1: Bill range */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                Mức hóa đơn
              </p>
              <div className="flex flex-wrap gap-2">
                {FILTER_BILL_RANGES.map((opt) => (
                  <FilterChip
                    key={opt.id}
                    option={opt}
                    active={filters.billRange === opt.id}
                    onClick={() => setFilter("billRange", opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Row 2: Storage + Phase */}
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                  Lưu trữ
                </p>
                <div className="flex flex-wrap gap-2">
                  {FILTER_STORAGE.map((opt) => (
                    <FilterChip
                      key={opt.id}
                      option={opt}
                      active={filters.storage === opt.id}
                      onClick={() => setFilter("storage", opt.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                  Hệ thống điện
                </p>
                <div className="flex flex-wrap gap-2">
                  {FILTER_PHASE.map((opt) => (
                    <FilterChip
                      key={opt.id}
                      option={opt}
                      active={filters.phase === opt.id}
                      onClick={() => setFilter("phase", opt.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result count + reset */}
          {hasActiveFilter && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Hiển thị <strong className="text-slate-700">{totalPackages}</strong> gói phù hợp
              </p>
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* ── Package groups ── */}
        <div>
          {visibleGroups.map((group) => (
            <PackageGroup
              key={group.id}
              group={group}
              filters={filters}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 pt-10 border-t border-slate-100">
          <div className="bg-[#0b1628] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Không tìm thấy gói phù hợp?
              </h3>
              <p className="text-sm text-white/50">
                Liên hệ đội ngũ Nhật Minh để được tư vấn giải pháp tùy chỉnh riêng cho công trình của bạn.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:0876906668"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
                </svg>
                0876 906 668
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3 rounded-lg border border-white/20 transition-colors"
              >
                <span className="font-bold text-sm">Z</span>
                Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
