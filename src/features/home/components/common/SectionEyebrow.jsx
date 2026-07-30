// ============================================
// SECTION EYEBROW
// Modern Solar Enterprise
// ============================================

const SectionEyebrow = ({ label, className = "" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <h2
        className="
          inline-block
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-700
          bg-clip-text
          text-transparent
          text-2xl
          md:text-3xl
          font-bold
          tracking-tight
          leading-none
        "
      >
        {label}
      </h2>

      <div className="mt-5 h-[3px] w-52 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-400" />

      {/* <div className="mt-[2px] h-px w-72 bg-gradient-to-r from-slate-300 to-transparent" /> */}
    </div>
  );
};

export default SectionEyebrow;