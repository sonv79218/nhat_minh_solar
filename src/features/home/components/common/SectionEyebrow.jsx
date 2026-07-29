// ============================================
// SECTION EYEBROW DIVIDER
// Reusable section label
// Pattern: [────────  LABEL]
// ============================================

const SectionEyebrow = ({ label, className = "" }) => {
  return (
    <div
      className={`
        flex items-center gap-4
        ${className}
      `}
    >
      {/* Decorative line */}
      <span
        aria-hidden="true"
        className="
          block
          h-[2px]
          w-16 sm:w-24 md:w-36 lg:w-48
          shrink-0
          rounded-full
          bg-slate-300
        "
      />

      {/* Label */}
      <span
        className="
          shrink-0
          whitespace-nowrap
          text-xs sm:text-sm
          font-bold
          uppercase
          tracking-[0.14em]
          leading-none
          text-slate-700
        "
      >
        {label}
      </span>
    </div>
  );
};

export default SectionEyebrow;