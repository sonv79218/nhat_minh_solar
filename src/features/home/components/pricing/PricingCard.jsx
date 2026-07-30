import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const fmtNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const CheckIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 8l3.5 3.5L13 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);

const KpiCard = ({ label, value }) => (
  <div className="flex min-w-0 flex-col justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
      {label}
    </p>

    <p className="mt-1 truncate text-base font-extrabold leading-tight text-slate-950">
      {value}
    </p>
  </div>
);

const DetailRow = ({
  label,
  value,
  valueClassName = "text-slate-800",
  last = false,
}) => (
  <div
    className={`flex items-center justify-between gap-4 px-4 py-3 ${
      last ? "" : "border-b border-slate-100"
    }`}
  >
    <span className="text-xs text-slate-500">{label}</span>

    <span
      className={`max-w-[65%] text-right text-xs font-bold ${valueClassName}`}
    >
      {value}
    </span>
  </div>
);

const SpecItem = ({ spec }) => (
  <li className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
      <CheckIcon />
    </span>

    <span className="text-xs leading-relaxed text-slate-600">{spec}</span>
  </li>
);

function DesktopDetailModal({ pkg }) {
  const {
    name,
    tag,
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
    <div className="relative flex w-[1180px] max-w-[calc(100vw-32px)] max-h-[94vh] flex-col overflow-x-hidden overflow-y-auto rounded-3xl bg-white shadow-2xl">
      {/* Header */}
      <div className="grid min-h-[220px] grid-cols-[38%_1fr] overflow-hidden border-b border-slate-100 bg-white">
        <div className="flex flex-col justify-center px-9 py-7">
          <span className="mb-3 inline-flex w-fit items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-800">
            {tag}
          </span>

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
            Giải pháp điện mặt trời
          </p>

          <h2 className="mt-2 text-[24px] font-extrabold leading-[1.25] text-slate-950">
            {name}
          </h2>

          <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">
            Cấu hình được đề xuất dựa trên mức tiêu thụ điện, diện tích mái và
            nhu cầu sử dụng thực tế của gia đình.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-700">
              {capacityKw} kWp
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-700">
              {phase}
            </span>

            {hasStorage && (
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-700">
                Lưu trữ {storageKwh} kWh
              </span>
            )}
          </div>
        </div>

        <div className="relative min-h-[220px] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/70 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-slate-950 hover:text-white"
            aria-label="Đóng popup"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid shrink-0 grid-cols-4 gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
        <KpiCard label="Công suất" value={`${capacityKw} kWp`} />

        <KpiCard
          label="Pin lưu trữ"
          value={hasStorage ? `${storageKwh} kWh` : "Không"}
        />

        <KpiCard
          label="Sản lượng năm"
          value={`${fmtNumber(annualKwh)} kWh`}
        />

        <KpiCard label="Hệ thống điện" value={phase} />
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 items-stretch gap-4 px-6 py-4">
        {/* Thiết bị chính */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Danh mục thiết bị
            </p>

            <h3 className="mt-0.5 text-sm font-extrabold text-slate-950">
              Thiết bị chính
            </h3>
          </div>

          <div>
            <DetailRow
              label="Tấm pin"
              value={panelBrand || "Theo cấu hình"}
            />

            <DetailRow
              label="Inverter"
              value={inverterBrand || "Theo cấu hình"}
            />

            {hasStorage && (
              <DetailRow
                label="Pin lưu trữ"
                value={batteryBrand || `${storageKwh} kWh`}
                last
              />
            )}
          </div>
        </div>

        {/* Cấu hình và quyền lợi */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Thông tin gói
            </p>

            <h3 className="mt-0.5 text-sm font-extrabold text-slate-950">
              Cấu hình và quyền lợi
            </h3>
          </div>

          <div className="p-3">
            {specs.length > 0 ? (
              <ul
                className={`grid gap-2 ${
                  specs.length >= 7 ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {specs.map((spec, index) => (
                  <SpecItem key={`${spec}-${index}`} spec={spec} />
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[120px] items-center justify-center px-6 text-center">
                <p className="text-xs leading-relaxed text-slate-400">
                  Cấu hình chi tiết sẽ được tư vấn theo điều kiện lắp đặt thực
                  tế.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-5 border-t border-slate-100 bg-white px-6 py-4">
        <div className="w-52 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Phù hợp hóa đơn
          </p>

          <p className="mt-1 text-sm font-extrabold text-teal-800">
            {monthlyBillRange}
          </p>
        </div>

        <div className="h-12 w-px shrink-0 bg-slate-200" />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Giá trọn gói dự kiến
          </p>

          {price ? (
            <p className="mt-1 text-2xl font-extrabold leading-none text-slate-950">
              {fmtNumber(price)}
              <span className="ml-1 text-[11px] font-medium text-slate-400">
                VNĐ
              </span>
            </p>
          ) : (
            <p className="mt-1 text-base font-extrabold text-slate-900">
              {priceNote || "Liên hệ báo giá"}
            </p>
          )}

          {warranty && (
            <p className="mt-1 text-[10px] text-slate-400">{warranty}</p>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="tel:0876906668"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            <PhoneIcon />
            Gọi tư vấn
          </a>

          <a
            href="https://zalo.me/0876906668"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
          >
            Chat Zalo
          </a>
        </div>
      </div>

      <p className="shrink-0 px-6 pb-4 text-[10px] leading-relaxed text-slate-400">
        Giá có thể thay đổi theo vị trí lắp đặt, kết cấu mái và yêu cầu thiết
        bị thực tế.
      </p>
    </div>
  );
}

function MobileDetailModal({ pkg }) {
  const {
    name,
    tag,
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
    <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
      <div className="relative shrink-0">
        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/60 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-950 hover:text-white"
          aria-label="Đóng popup"
        >
          <CloseIcon />
        </button>

        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-teal-800 backdrop-blur">
            {tag}
          </span>

          <span className="rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800 backdrop-blur">
            {capacityKw} kWp
          </span>

          {hasStorage && (
            <span className="rounded-full border border-white/50 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800 backdrop-blur">
              {storageKwh} kWh
            </span>
          )}
        </div>
      </div>

      <div className="overflow-y-auto overscroll-contain p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">
            Giải pháp điện mặt trời
          </p>

          <h2 className="mt-1 text-xl font-extrabold leading-tight text-slate-950">
            {name}
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <KpiCard label="Công suất" value={`${capacityKw} kWp`} />

          <KpiCard
            label="Pin lưu trữ"
            value={hasStorage ? `${storageKwh} kWh` : "Không"}
          />

          <KpiCard
            label="Sản lượng năm"
            value={`${fmtNumber(annualKwh)} kWh`}
          />

          <KpiCard label="Hệ thống" value={phase} />
        </div>

        <section className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Danh mục thiết bị
          </p>

          <h3 className="mt-1 text-sm font-extrabold text-slate-950">
            Thiết bị chính
          </h3>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <DetailRow
              label="Tấm pin"
              value={panelBrand || "Theo cấu hình"}
            />

            <DetailRow
              label="Inverter"
              value={inverterBrand || "Theo cấu hình"}
            />

            {hasStorage && (
              <DetailRow
                label="Pin lưu trữ"
                value={batteryBrand || `${storageKwh} kWh`}
                last
              />
            )}
          </div>
        </section>

        {specs.length > 0 && (
          <section className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Thông tin gói
            </p>

            <h3 className="mt-1 text-sm font-extrabold text-slate-950">
              Cấu hình và quyền lợi
            </h3>

            <ul className="mt-3 grid gap-2">
              {specs.map((spec, index) => (
                <SpecItem key={`${spec}-${index}`} spec={spec} />
              ))}
            </ul>
          </section>
        )}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Phù hợp hóa đơn
          </p>

          <p className="mt-1 text-sm font-extrabold text-teal-800">
            {monthlyBillRange}
          </p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Giá trọn gói dự kiến
          </p>

          {price ? (
            <p className="mt-1.5 text-2xl font-extrabold leading-none text-slate-950">
              {fmtNumber(price)}
              <span className="ml-1 text-[10px] font-medium text-slate-400">
                VNĐ
              </span>
            </p>
          ) : (
            <p className="mt-1.5 text-base font-extrabold text-slate-900">
              {priceNote || "Liên hệ báo giá"}
            </p>
          )}

          {warranty && (
            <p className="mt-1.5 text-[10px] text-slate-400">{warranty}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href="tel:0876906668"
              className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-3 text-xs font-bold text-white transition hover:bg-teal-800"
            >
              <PhoneIcon />
              Gọi tư vấn
            </a>

            <a
              href="https://zalo.me/0876906668"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
            >
              Chat Zalo
            </a>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
          Giá có thể thay đổi theo vị trí lắp đặt, kết cấu mái và yêu cầu thiết
          bị thực tế.
        </p>
      </div>
    </div>
  );
}

export function PricingDetailModal({ pkg, onClose }) {
  const pkgWithClose = {
    ...pkg,
    onClose,
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-md lg:items-center lg:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết gói điện mặt trời"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onMouseDown={(event) => event.stopPropagation()}
        className="hidden lg:block"
      >
        <DesktopDetailModal pkg={pkgWithClose} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full lg:hidden"
      >
        <MobileDetailModal pkg={pkgWithClose} />
      </motion.div>
    </motion.div>
  );
}

export default function PricingCard({ pkg, index = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    name,
    tag,
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

  const brandText = [panelBrand, inverterBrand, batteryBrand]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.4,
          delay: index * 0.06,
        }}
        className={`group relative flex h-full flex-col overflow-hidden border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
          highlight
            ? "border-teal-300 shadow-md shadow-teal-100/50"
            : "border-slate-200 shadow-sm"
        }`}
      >
        <div className="relative overflow-hidden bg-slate-100">
          <div className="relative aspect-[16/10] w-full">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/45 to-transparent" />

          {highlight && (
            <div className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-teal-800 shadow-sm backdrop-blur">
              Gói được lựa chọn
            </div>
          )}

          <div className="absolute right-3 top-3 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-slate-900 shadow-sm backdrop-blur">
            {capacityKw} kWp
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-teal-800 shadow-sm backdrop-blur">
              {tag}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 lg:p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700">
              Hệ điện mặt trời
            </p>

            <h3 className="mt-1.5 line-clamp-2 text-[16px] font-extrabold leading-snug text-slate-950 lg:min-h-[48px] lg:text-[18px]">
              {name}
            </h3>

            {brandText && (
              <p className="mt-2 line-clamp-1 text-[11px] text-slate-400">
                {brandText}
              </p>
            )}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Giá dự kiến
            </p>

            {price ? (
              <p className="mt-1 text-xl font-extrabold leading-none text-slate-950">
                {fmtNumber(price)}
                <span className="ml-1 text-[10px] font-medium text-slate-400">
                  VNĐ
                </span>
              </p>
            ) : (
              <p className="mt-1 text-base font-extrabold text-slate-900">
                {priceNote || "Liên hệ báo giá"}
              </p>
            )}

            {warranty && (
              <p className="mt-1.5 text-[10px] text-slate-400">{warranty}</p>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Phù hợp hóa đơn
            </p>

            <p className="mt-0.5 text-xs font-bold text-teal-800">
              {monthlyBillRange}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">
              {capacityKw} kWp
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">
              {hasStorage ? `${storageKwh} kWh lưu trữ` : "Không lưu trữ"}
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">
              {phase}
            </span>

            {annualKwh && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">
                {fmtNumber(annualKwh)} kWh/năm
              </span>
            )}
          </div>

          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800"
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
            pkg={{
              ...pkg,
              annualKwh,
            }}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}