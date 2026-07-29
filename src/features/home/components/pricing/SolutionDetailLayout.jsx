// ============================================
// SOLUTION DETAIL LAYOUT
// Shared wrapper for /solutions/solar-home, solar-business, solar-farm
// Điện Mặt Trời Nhật Minh
// ============================================
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import PricingCard from "@/features/home/components/pricing/PricingCard";
import {
  FILTER_BILL_RANGES,
  FILTER_STORAGE,
  FILTER_PHASE,
  INITIAL_FILTERS,
} from "@/features/home/components/pricing/pricingData";

const INITIAL_VISIBLE = 4;

// ── Filter chip ────────────────────────────────────
const FilterChip = ({ option, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
      active
        ? "bg-green-500 border-green-500 text-white"
        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
    }`}
  >
    {option.label}
  </button>
);

// ── Capacity filter ─────────────────────────────────
const CAPACITY_RANGES = [
  { id: "all", label: "Tất cả" },
  { id: "3-5", label: "3–5 kW" },
  { id: "5-10", label: "5–10 kW" },
  { id: "10-20", label: "10–20 kW" },
  { id: "20+", label: "20+ kW" },
];

const matchesCapacity = (pkg, rangeId) => {
  if (rangeId === "all") return true;
  if (rangeId === "3-5") return pkg.capacityKw >= 3 && pkg.capacityKw <= 5;
  if (rangeId === "5-10") return pkg.capacityKw > 5 && pkg.capacityKw <= 10;
  if (rangeId === "10-20") return pkg.capacityKw > 10 && pkg.capacityKw <= 20;
  if (rangeId === "20+") return pkg.capacityKw > 20;
  return true;
};

// ── Main layout component ─────────────────────────
const SolutionDetailLayout = ({
  // Category info
  categoryId,
  title,
  subtitle,
  description,
  targets = [],
  image,
  badgeText,
  badgeColor = "bg-green-500/10 text-green-400 border-green-500/30",
  // Packages to display
  packages,
  // Extra hero stats
  heroStats = [],
}) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const setFilter = (key, val) =>
    setFilters((f) => ({ ...f, [key]: val }));

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCapacityFilter("all");
    setVisible(INITIAL_VISIBLE);
  };

  const filtered = useMemo(
    () =>
      packages.filter((pkg) => {
        if (filters.storage === "with-storage" && !pkg.hasStorage) return false;
        if (filters.storage === "no-storage" && pkg.hasStorage) return false;
        if (filters.phase === "1-ph" && !pkg.phase.includes("1 pha")) return false;
        if (filters.phase === "3-ph" && !pkg.phase.includes("3 pha")) return false;
        if (!matchesCapacity(pkg, capacityFilter)) return false;
        return true;
      }),
    [packages, filters, capacityFilter]
  );

  const hasActiveFilter =
    filters.billRange !== "all" ||
    filters.storage !== "all" ||
    filters.phase !== "all" ||
    capacityFilter !== "all";

  const hasMore = filtered.length > INITIAL_VISIBLE;

  return (
    <MainLayout>
      {/* ── Hero banner ── */}
      <section className="relative w-full overflow-hidden h-[260px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]">
        {/* Background image */}
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/45 to-transparent" />

        <div className="relative z-10 flex items-center h-full">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
              <Link to="/" className="hover:text-white/70 transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link to="/solutions" className="hover:text-white/70 transition-colors">Giải pháp</Link>
              <span>/</span>
              <span className="text-white/60">{title}</span>
            </div>

            {/* Hero content */}
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2 border text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${badgeColor}`}>
                {badgeText}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-extrabold text-white leading-tight tracking-tight mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 max-w-[560px]">{subtitle}</p>
              )}
              <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed mb-6 max-w-[560px]">
                {description}
              </p>

              {/* Targets */}
              {targets.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {targets.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10"
                    >
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {t}
                    </span>
                  ))}
                </div>
              )}

            {/* Stats */}
            {heroStats.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {heroStats.map(({ val, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-green-400">{val}</span>
                    <span className="text-sm text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* ── Packages section ── */}
      <section className="w-full bg-slate-50 py-10 sm:py-14">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                Các gói giải pháp
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hiển thị {filtered.length} trong tổng số {packages.length} gói
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
            <div className="flex flex-col gap-3">
              {/* Row 1: Lưu trữ + Pha */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest w-16">Lưu trữ</span>
                  <div className="flex flex-wrap gap-1.5">
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
                <div className="hidden sm:block w-px h-5 bg-slate-100" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest w-16">Hệ điện</span>
                  <div className="flex flex-wrap gap-1.5">
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

              {/* Row 2: Công suất */}
              <div className="flex flex-wrap gap-4 items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest w-16">Công suất</span>
                <div className="flex flex-wrap gap-1.5">
                  {CAPACITY_RANGES.map((opt) => (
                    <FilterChip
                      key={opt.id}
                      option={opt}
                      active={capacityFilter === opt.id}
                      onClick={() => setCapacityFilter(opt.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilter && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Đang lọc: <strong className="text-slate-700">{filtered.length} gói</strong>
                </p>
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Package grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm mb-4">
                Không có gói nào phù hợp với bộ lọc hiện tại.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                {filtered.slice(0, visible).map((pkg, i) => (
                  <PricingCard key={pkg.id} pkg={pkg} index={i} />
                ))}
              </div>

              {hasMore && visible < filtered.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisible((v) => v + INITIAL_VISIBLE)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
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
      </section>

      {/* ── CTA strip ── */}
      <section className="w-full bg-white py-10">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="bg-[#0b1628] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Cần tư vấn chi tiết hơn?
              </h3>
              <p className="text-sm text-white/50">
                Đội ngũ kỹ thuật Nhật Minh sẵn sàng hỗ trợ 24/7.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:0876906668"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                </svg>
                0876 906 668
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0068ff] hover:bg-[#0052d4] text-white font-bold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                <span className="font-bold text-base">Z</span>
                Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SolutionDetailLayout;
