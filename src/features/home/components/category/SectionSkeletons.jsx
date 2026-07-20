// ============================================
// SECTION SKELETON - Loading placeholders for Solution and Category Grid sections
// ============================================

// Solution Grid Skeleton
export const SolutionGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] rounded-2xl bg-slate-200 animate-pulse"
        />
      ))}
    </div>
  );
};

// Category Grid Skeleton
export const CategoryGridSkeleton = () => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-10 gap-2.5 sm:gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 p-3 md:p-4"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-200 animate-pulse" />
          <div className="w-full space-y-1.5">
            <div className="h-2.5 bg-slate-200 rounded mx-auto w-4/5 animate-pulse" />
            <div className="h-2 bg-slate-200 rounded mx-auto w-3/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Section Header Skeleton
export const SectionHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <div className="flex-1 h-px bg-slate-200" />
      <div className="h-6 md:h-7 w-48 md:w-56 bg-slate-200 rounded animate-pulse" />
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
};

// Solution Section with Skeleton
export const SolutionSectionSkeleton = () => {
  return (
    <div className="w-full py-12 md:py-16 bg-slate-50">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-4 md:px-6">
        <SectionHeaderSkeleton />
        <SolutionGridSkeleton />
      </div>
    </div>
  );
};

// Category Grid Section with Skeleton
export const CategoryGridSectionSkeleton = () => {
  return (
    <section className="w-full py-4 md:py-6">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6">
        <SectionHeaderSkeleton />
        <CategoryGridSkeleton />
      </div>
    </section>
  );
};
