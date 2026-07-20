// ============================================
// BANNER SKELETON - Loading placeholder for BannerSection
// ============================================
const BannerSkeleton = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-800" />

      {/* Animated shimmer effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          animation: "shimmer 2s infinite",
        }}
      />

      {/* Content skeleton */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="max-w-lg space-y-6 text-center">
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 md:h-12 lg:h-16 bg-white/10 rounded-lg animate-pulse mx-auto w-4/5" />
            <div className="h-8 md:h-12 lg:h-16 bg-white/10 rounded-lg animate-pulse mx-auto w-3/5" />
          </div>

          {/* Subtitle skeleton */}
          <div className="h-4 md:h-5 bg-white/10 rounded animate-pulse mx-auto w-2/3" />

          {/* CTA button skeleton */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="h-10 md:h-12 w-28 md:w-32 bg-white/20 rounded-full animate-pulse" />
            <div className="h-10 md:h-12 w-24 md:w-28 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
    </div>
  );
};

// Mobile Banner Skeleton with fixed height
export const MobileBannerSkeleton = () => {
  return (
    <div className="w-full h-[260px] sm:h-[320px] md:h-[400px]">
      <BannerSkeleton className="h-full" />
    </div>
  );
};

// Desktop Banner Skeleton (full height)
export const DesktopBannerSkeleton = () => {
  return (
    <div className="h-full w-full">
      <BannerSkeleton className="h-full rounded-br-2xl" />
    </div>
  );
};

export default BannerSkeleton;
