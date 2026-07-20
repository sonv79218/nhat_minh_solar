// ============================================
// SECTION HEADER COMPONENT - UNIFIED DESIGN SYSTEM
// Consistent headers across all homepage sections
// ============================================

/**
 * SectionHeader - Unified header component for all sections
 * 
 * Usage:
 * <SectionHeader 
 *    title="Tiêu đề section"
 *    subtitle="Mô tả ngắn"
 *    badge="Badge text"
 *    align="left|center"
 *    size="sm|md|lg"
 * />
 */
const SectionHeader = ({
  title,
  subtitle,
  badge,
  align = "left",
  size = "md",
  className = "",
  badgeColor = "primary",
}) => {
  // Alignment classes
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
  };

  // Size classes
  const sizeClasses = {
    sm: {
      wrapper: "mb-4",
      badge: "text-[10px] px-2.5 py-1",
      title: "text-lg md:text-xl",
      subtitle: "text-xs md:text-sm",
    },
    md: {
      wrapper: "mb-6 md:mb-8",
      badge: "text-xs px-3 py-1.5",
      title: "text-xl md:text-2xl lg:text-3xl",
      subtitle: "text-sm md:text-base",
    },
    lg: {
      wrapper: "mb-8 md:mb-12",
      badge: "text-sm px-4 py-2",
      title: "text-2xl md:text-3xl lg:text-4xl",
      subtitle: "text-base md:text-lg",
    },
  };

  // Badge color classes
  const badgeColorClasses = {
    primary: "bg-primary-50 text-primary-600 border-primary-200",
    sky: "bg-sky-50 text-sky-600 border-sky-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.wrapper} ${alignmentClasses[align]} ${className}`}>
      {/* Badge */}
      {badge && (
        <div
          className={`
            inline-flex items-center gap-1.5
            ${currentSize.badge}
            ${badgeColorClasses[badgeColor]}
            font-semibold
            rounded-full border
            mb-3 md:mb-4
          `}
        >
          {badge}
        </div>
      )}

      {/* Title */}
      {title && (
        <h2
          className={`
            font-bold text-secondary
            tracking-tight leading-tight
            ${currentSize.title}
          `}
        >
          {title}
        </h2>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`
            text-slate-500 mt-2 md:mt-3
            max-w-xl
            ${alignmentClasses[align] === "text-center" ? "mx-auto" : ""}
            ${currentSize.subtitle}
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
