// ============================================
// PRICING CARD
// Điện Mặt Trời Nhật Minh
// Hiển thị thông tin một gói giải pháp điện mặt trời
// ============================================
import { motion } from "framer-motion";

const fmtKwh = (n) => new Intl.NumberFormat("vi-VN").format(n);

const StarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const SpecItem = ({ text }) => (
  <li className="flex items-start gap-1.5 text-xs text-slate-600 leading-relaxed">
    <span className="text-green-500 mt-0.5 flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span>{text}</span>
  </li>
);

export default function PricingCard({ pkg, index }) {
  const { name, tag, tagColor, hasStorage, image, capacityKw, storageKwh,
    panelBrand, inverterBrand, batteryBrand, specs, warranty,
    annualKwh, monthlyBillRange, price, priceNote, phase, highlight } = pkg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`group flex flex-col rounded-xl border overflow-hidden bg-white transition-all duration-300 ${
        highlight
          ? "border-green-400 shadow-md shadow-green-100"
          : "border-slate-100 hover:border-slate-200 hover:shadow-md"
      }`}
    >
      {/* Highlight badge */}
      {highlight && (
        <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
          <StarIcon />
          <span>Được lựa chọn nhiều nhất</span>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Tag overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${tagColor}`}>
            {hasStorage ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
                <path d="M10 11v6m4-6v6"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            )}
            {tag}
          </span>
        </div>
        {/* Capacity badge */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
            {capacityKw} kWp
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
              {panelBrand}
            </span>
            <span>·</span>
            <span>{inverterBrand}</span>
            {batteryBrand && (
              <>
                <span>·</span>
                <span className="text-amber-600">{batteryBrand}</span>
              </>
            )}
          </div>
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Công suất</p>
            <p className="text-sm font-bold text-slate-800">{capacityKw} kWp</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
              {hasStorage ? "Pin lưu trữ" : "Lưu trữ"}
            </p>
            <p className={`text-sm font-bold ${hasStorage ? "text-amber-600" : "text-slate-400"}`}>
              {hasStorage ? `${storageKwh} kWh` : "Không"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Sản lượng/năm</p>
            <p className="text-sm font-bold text-slate-800">{fmtKwh(annualKwh)} kWh</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Hệ thống</p>
            <p className="text-sm font-bold text-slate-800">{phase}</p>
          </div>
        </div>

        {/* Spec list */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {specs.map((spec, i) => <SpecItem key={i} text={spec} />)}
        </ul>

        {/* Bill range */}
        <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-lg mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500 flex-shrink-0">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
          </svg>
          <span className="text-xs text-blue-700 font-medium">Phù hợp: {monthlyBillRange}</span>
        </div>

        {/* Price */}
        <div className="border-t border-slate-100 pt-4 mb-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Giá trọn gói</p>
              {price ? (
                <p className="text-xl font-extrabold text-green-600 leading-none">
                  {new Intl.NumberFormat("vi-VN").format(price)}<span className="text-xs font-normal text-slate-400 ml-0.5">VNĐ</span>
                </p>
              ) : (
                <p className="text-base font-bold text-slate-700 leading-none">{priceNote || "Liên hệ"}</p>
              )}
            </div>
            <p className="text-[10px] text-slate-400">{warranty}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            Xem chi tiết
          </button>
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-[#0068ff] hover:bg-[#0052d4] text-white flex items-center justify-center transition-colors flex-shrink-0"
            title="Chat Zalo"
          >
            <span className="font-bold text-sm">Z</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
