import { useState } from "react";
import PricingCard from "@/features/home/components/pricing/PricingCard";
import SectionEyebrow from "@/features/home/components/common/SectionEyebrow";
import { ALL_GROUPS } from "@/features/home/components/pricing/pricingData";

const INITIAL_VISIBLE = 4;

// ── Group Header ────────────────────────────────────
const GroupHeader = ({ group }) => (
  <div className="mb-6 sm:mb-8">
    <div
      className="
        bg-gradient-to-r
from-slate-100
via-slate-50
to-white
        shadow-sm
        sm:px-6 sm:py-6
      "
    >
      <h3 className="text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl">
        {group.label}
      </h3>

      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
        {group.description}
      </p>
    </div>
  </div>
);

// ── Package Group ───────────────────────────────────
const PackageGroup = ({ group, index }) => {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const hasMore = group.packages.length > INITIAL_VISIBLE;

  return (
    <div className="mb-16 last:mb-0 md:mb-20">
      <GroupHeader group={group} index={index} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 xl:gap-5">
        {group.packages.slice(0, visible).map((pkg, i) => (
          <PricingCard key={pkg.id} pkg={pkg} index={i} />
        ))}
      </div>

      {hasMore && visible < group.packages.length && (
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + INITIAL_VISIBLE)}
            className="
              inline-flex items-center gap-2
              rounded-lg border border-slate-200
              px-6 py-2.5
              text-sm font-semibold text-slate-700
              transition-all
              hover:border-slate-300
              hover:bg-slate-50
            "
          >
            Xem thêm {group.packages.length - visible} gói

            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main Pricing Section ────────────────────────────
export default function PricingSection() {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <SectionEyebrow
          label="Giải pháp đề xuất"
          className="mb-10 md:mb-14"
        />

        <div>
          {ALL_GROUPS.map((group, index) => (
            <PackageGroup
              key={group.id}
              group={group}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 border-t border-slate-100 pt-10">
          <div className="flex flex-col items-center justify-between gap-5 rounded-xl bg-[#0b1628] p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="mb-1 text-lg font-bold text-white">
                Không tìm thấy gói phù hợp?
              </h3>

              <p className="text-sm text-white/50">
                Liên hệ đội ngũ Nhật Minh để được tư vấn giải pháp tùy chỉnh
                riêng cho công trình của bạn.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <a
                href="tel:0876906668"
                className="whitespace-nowrap rounded-lg bg-green-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-600"
              >
                0876 906 668
              </a>

              <a
                href="https://zalo.me/0876906668"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}