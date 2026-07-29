// ============================================
// PRICING CARD + DETAIL MODAL
// Điện Mặt Trời Nhật Minh
//
// Desktop redesign (≥1024px):
//   - Popup: 1180px × 760px, max-h 90vh, overflow:hidden
//   - Header: 2-col grid (38% | 62%)
//     Left  : badge + name + description, vertically centered
//     Right : image 320px tall, object-cover, rounded-2xl
//   - KPI row: 4 cards
//   - Content: 2-col (50/50) — devices | specs+benefits
//   - CTA footer: 3-col — bill range | price | call+zalo buttons
//   - Desktop: overflow:hidden (no scroll inside popup)
// Mobile: unchanged
// ============================================

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const fmtNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const KpiCard = ({ label, value, accent }) => (
  <div className={`flex flex-col justify-center rounded-2xl border p-3.5 ${accent ? "border-green-200 bg-green-50" : "border-slate-100 bg-white"}`}>
    <p className={`text-[10px] font-semibold uppercase tracking-widest ${accent ? "text-green-600" : "text-slate-400"}`}>
      {label}
    </p>
    <p className={`mt-1 text-base font-extrabold leading-tight ${accent ? "text-green-700" : "text-slate-900"}`}>
      {value}
    </p>
  </div>
);

const DetailRow = ({ label, value, valueClassName = "text-slate-800", last = false }) => (
  <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${last ? "" : "border-b border-slate-100"}`}>
    <span className="text-xs text-slate-500">{label}</span>
    <span className={`text-right text-xs font-bold ${valueClassName}`}>{value}</span>
  </div>
);

const SpecItem = ({ spec }) => (
  <li className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
    <span className="mt-0.5 shrink-0 text-green-500"><CheckIcon /></span>
    <span className="text-xs leading-relaxed text-slate-600">{spec}</span>
  </li>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP LAYOUT (≥1024px)
//   height 760px / max-h 90vh / overflow:hidden / rounded-3xl
// ─────────────────────────────────────────────────────────────────────────────
function DesktopDetailModal({ pkg }) {
  const {
    name,
    tag,
    tagColor,
    hasStorage,
    image,
    capacityKw,
    storageKwh,
    panelBrand,
    inverterBrand,
    batteryBrand,
    specs = [],
    warranty,
    annualKwh,
    monthlyBillRange,
    price,
    priceNote,
    phase,
  } = pkg;

  return (
    <div className="relative flex h-[760px] max-h-[90vh] w-[1180px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

      {/* ── HEADER (38% | 62%) ─────────────────────────────────────────────── */}
      <div className="grid h-[265px] shrink-0 grid-cols-[38%_1fr] gap-0 overflow-hidden bg-[#0b1628]">

        {/* Left col: badge + name + description */}
        <div className="flex flex-col justify-center px-8 py-8">
          <span className={`mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold ${tagColor}`}>
            {tag}
          </span>

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-400">
            Gói giải pháp điện mặt trời
          </p>

          <h2 className="mt-2 text-[22px] font-extrabold leading-tight text-white">
            {name}
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-white/50">
            Giải pháp được thiết kế phù hợp với nhu cầu tiêu thụ điện, diện tích mái và ngân sách.
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
              {capacityKw} kWp
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white">
              {phase}
            </span>
            {hasStorage && (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300">
                {storageKwh} kWh
              </span>
            )}
          </div>
        </div>

        {/* Right col: image */}
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
          {/* Gradient overlay on left edge to blend into dark bg */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0b1628]/80 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={pkg.onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-slate-900 hover:text-white"
            aria-label="Đóng popup"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* ── KPI ROW ───────────────────────────────────────────────────────── */}
      <div className="grid h-[88px] shrink-0 grid-cols-4 gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
        <KpiCard label="Công suất" value={`${capacityKw} kWp`} accent />
        <KpiCard
          label="Pin lưu trữ"
          value={hasStorage ? `${storageKwh} kWh` : "Không"}
          accent={hasStorage}
        />
        <KpiCard label="Sản lượng/năm" value={`${fmtNumber(annualKwh)} kWh`} />
        <KpiCard label="Hệ thống" value={phase} />
      </div>

      {/* ── CONTENT BODY (2-col, scrollable only if needed) ─────────────────── */}
      <div className="grid flex-1 grid-cols-[1fr_1fr] gap-4 overflow-hidden px-6 py-4">

        {/* Left: Thiết bị chính */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100">
          <div className="shrink-0 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <h3 className="text-xs font-extrabold text-slate-900">Thiết bị chính</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DetailRow label="Tấm pin" value={panelBrand || "Theo cấu hình"} />
            <DetailRow label="Inverter" value={inverterBrand || "Theo cấu hình"} />
            {hasStorage && (
              <DetailRow
                label="Pin lưu trữ"
                value={batteryBrand || `${storageKwh} kWh`}
                valueClassName="text-amber-600"
                last
              />
            )}
          </div>
        </div>

        {/* Right: Cấu hình & quyền lợi */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100">
          <div className="shrink-0 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <h3 className="text-xs font-extrabold text-slate-900">Cấu hình &amp; quyền lợi</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <ul className="grid gap-1.5">
              {specs.map((spec, i) => (
                <SpecItem key={i} spec={spec} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── CTA FOOTER ────────────────────────────────────────────────────── */}
      <div className="flex h-[90px] shrink-0 items-center gap-4 border-t border-slate-100 bg-slate-50 px-6">

        {/* Left: bill range */}
        <div className="flex w-52 shrink-0 flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Phù hợp hóa đơn
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-blue-700">
            {monthlyBillRange}
          </p>
        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-slate-200 shrink-0" />

        {/* Center: price */}
        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Giá trọn gói dự kiến
          </p>
          {price ? (
            <p className="mt-0.5 text-2xl font-extrabold text-green-600">
              {fmtNumber(price)}
              <span className="ml-1 text-xs font-medium text-slate-400">VNĐ</span>
            </p>
          ) : (
            <p className="mt-0.5 text-base font-extrabold text-slate-800">
              {priceNote || "Liên hệ báo giá"}
            </p>
          )}
          {warranty && (
            <p className="mt-0.5 text-[10px] text-slate-400">{warranty}</p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: CTA buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="tel:0876906668"
            className="flex h-11 items-center gap-2 rounded-xl bg-green-500 px-6 text-sm font-bold text-white transition hover:bg-green-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
            </svg>
            Gọi tư vấn
          </a>
          <a
            href="https://zalo.me/0876906668"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#0068ff] px-6 text-sm font-bold text-white transition hover:bg-[#0052d4]"
          >
            <span className="font-extrabold text-base leading-none">Z</span>
            Chat Zalo
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="shrink-0 px-6 pb-4 text-[10px] leading-relaxed text-slate-400">
        Giá có thể thay đổi theo vị trí lắp đặt, kết cấu mái và yêu cầu thiết bị thực tế.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE LAYOUT (<1024px) — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────
function MobileDetailModal({ pkg }) {
  const {
    name,
    tag,
    tagColor,
    hasStorage,
    image,
    capacityKw,
    storageKwh,
    panelBrand,
    inverterBrand,
    batteryBrand,
    specs = [],
    warranty,
    annualKwh,
    monthlyBillRange,
    price,
    priceNote,
    phase,
    onClose,
  } = pkg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onMouseDown={(e) => e.stopPropagation()}
      className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl"
    >
      {/* Ảnh mobile */}
      <div className="relative shrink-0">
        <div className="aspect-[357/251] w-full overflow-hidden bg-slate-100">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/60 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:bg-slate-900 hover:text-white"
          aria-label="Đóng popup"
        >
          <CloseIcon />
        </button>

        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${tagColor}`}>
            {tag}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-slate-900 shadow-sm">
            {capacityKw} kWp
          </span>
        </div>
      </div>

      {/* Nội dung cuộn */}
      <div className="overflow-y-auto overscroll-contain p-5">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-600">
            Gói giải pháp điện mặt trời
          </p>
          <h2 className="mt-1 text-lg font-extrabold leading-tight text-slate-950">
            {name}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Công suất</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{capacityKw} kWp</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pin lưu trữ</p>
            <p className={`mt-1 text-sm font-bold ${hasStorage ? "text-amber-600" : "text-slate-400"}`}>
              {hasStorage ? `${storageKwh} kWh` : "Không"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sản lượng/năm</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{fmtNumber(annualKwh)} kWh</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Hệ thống</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{phase}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="mb-2.5 text-xs font-extrabold text-slate-900">Thiết bị chính</h3>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <DetailRow label="Tấm pin" value={panelBrand || "Theo cấu hình"} />
            <DetailRow label="Inverter" value={inverterBrand || "Theo cấu hình"} />
            {hasStorage && (
              <DetailRow label="Pin lưu trữ" value={batteryBrand || `${storageKwh} kWh`} valueClassName="text-amber-600" last />
            )}
          </div>
        </div>

        {specs.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2.5 text-xs font-extrabold text-slate-900">Cấu hình &amp; quyền lợi</h3>
            <ul className="grid gap-1.5">
              {specs.map((spec, i) => <SpecItem key={i} spec={spec} />)}
            </ul>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">Phù hợp hóa đơn</p>
          <p className="mt-0.5 text-sm font-extrabold text-blue-800">{monthlyBillRange}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#0b1628] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Giá trọn gói dự kiến</p>
              {price ? (
                <p className="mt-1 text-xl font-extrabold text-green-400 sm:text-2xl">
                  {fmtNumber(price)}<span className="ml-1 text-[10px] font-medium text-white/50">VNĐ</span>
                </p>
              ) : (
                <p className="mt-1 text-base font-extrabold text-white">{priceNote || "Liên hệ báo giá"}</p>
              )}
              {warranty && <p className="mt-1 text-[10px] text-white/50">{warranty}</p>}
            </div>
            <div className="flex gap-2">
              <a href="tel:0876906668" className="flex h-10 flex-1 items-center justify-center rounded-xl bg-green-500 px-4 text-xs font-bold text-white transition hover:bg-green-600 sm:flex-none">
                Gọi tư vấn
              </a>
              <a href="https://zalo.me/0876906668" target="_blank" rel="noopener noreferrer" className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#0068ff] px-4 text-xs font-bold text-white transition hover:bg-[#0052d4] sm:flex-none">
                Chat Zalo
              </a>
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
          Giá có thể thay đổi theo vị trí lắp đặt, kết cấu mái và yêu cầu thiết bị thực tế.
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING DETAIL MODAL — picks desktop or mobile layout
// ─────────────────────────────────────────────────────────────────────────────
export function PricingDetailModal({ pkg, onClose }) {
  const pkgWithClose = { ...pkg, onClose };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết gói điện mặt trời"
    >
      {/* Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden lg:block"
      >
        <DesktopDetailModal pkg={pkgWithClose} />
      </motion.div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:hidden"
      >
        <MobileDetailModal pkg={pkgWithClose} />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING CARD
// Mobile (<lg): Shopee-style — full-bleed image, overlay badges, price-first
// Desktop (≥lg): unchanged
// ─────────────────────────────────────────────────────────────────────────────
export default function PricingCard({ pkg, index }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    name,
    tag,
    tagColor,
    hasStorage,
    image,
    capacityKw,
    storageKwh,
    panelBrand,
    inverterBrand,
    batteryBrand,
    warranty,
    annualKwh,
    monthlyBillRange,
    price,
    priceNote,
    phase,
    highlight,
  } = pkg;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className={`group relative flex flex-col overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:rounded-2xl lg:border lg:shadow-sm ${
          highlight ? "lg:border-green-400 lg:shadow-lg lg:shadow-green-100/60" : "lg:border-slate-200"
        }`}
      >
        {/* ── IMAGE SECTION ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-slate-100 lg:rounded-t-2xl">
          {/* Aspect-ratio box — Shopee style: wider than tall */}
          <div className="relative w-full pt-[62%]">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Top-left: highlight badge (Shopee "Mall" / "Yêu thích" style) */}
          {highlight && (
            <div className="absolute left-0 top-0 rounded-br-lg bg-green-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
              <span className="flex items-center gap-1">
                <StarIcon />
                Phổ biến
              </span>
            </div>
          )}

          {/* Top-right: capacity badge */}
          <div className="absolute right-2.5 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-extrabold text-slate-900 shadow-sm">
            {capacityKw} kWp
          </div>

          {/* Bottom: tag badge */}
          <div className="absolute bottom-2 left-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${tagColor}`}>
              {tag}
            </span>
          </div>
        </div>

        {/* ── CONTENT SECTION ─────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-2 p-3 lg:p-4">

          {/* Product name — Shopee: no min-height, clamp 2 lines */}
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 lg:text-[17px] lg:font-extrabold lg:line-clamp-none lg:min-h-[44px]">
            {name}
          </h3>

          {/* Brand line — smaller, subtle */}
          <p className="text-[11px] text-slate-400 lg:text-xs">
            {panelBrand} · {inverterBrand}{batteryBrand ? ` · ${batteryBrand}` : ""}
          </p>

          {/* Price row — Shopee: price first, prominent */}
          <div className="flex items-end justify-between gap-2">
            <div>
              {price ? (
                <p className="text-[15px] font-extrabold leading-none text-red-500 lg:text-xl lg:text-green-600">
                  {fmtNumber(price)}
                  <span className="ml-0.5 text-[10px] font-medium text-slate-400 lg:text-[10px]">VNĐ</span>
                </p>
              ) : (
                <p className="text-base font-extrabold text-slate-800">{priceNote || "Liên hệ"}</p>
              )}
            </div>
            {warranty && (
              <span className="text-[9px] leading-tight text-slate-400 lg:max-w-[85px] lg:text-right">
                {warranty}
              </span>
            )}
          </div>

          {/* Bill range — Shopee style tag pill */}
          <div className="inline-flex items-center gap-1.5 rounded bg-blue-50 px-2 py-1">
            <span className="text-[9px] font-medium text-blue-500 lg:text-[10px]">Hóa đơn</span>
            <span className="text-[10px] font-bold text-blue-700 lg:text-[11px]">{monthlyBillRange}</span>
          </div>

          {/* Specs — Shopee: compact horizontal pills */}
          <div className="flex flex-wrap gap-1">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 lg:text-[9px]">
              {capacityKw} kWp
            </span>
            <span className={`rounded px-2 py-0.5 text-[9px] font-semibold lg:text-[9px] ${hasStorage ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
              {hasStorage ? `${storageKwh} kWh` : "Không pin"}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 lg:text-[9px]">
              {phase}
            </span>
          </div>

          {/* CTA — Shopee style: full-width, accent color */}
          <div className="mt-auto pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#0b1628] text-xs font-bold text-white transition-all hover:bg-green-500 lg:h-11 lg:text-sm"
            >
              Xem chi tiết
              <ArrowIcon />
            </button>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {isOpen && (
          <PricingDetailModal
            pkg={{ ...pkg, annualKwh }}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
