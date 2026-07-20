// ============================================
// SIDEBAR SKELETON - Loading placeholder for CategorySidebar
// ============================================
const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-[300px] shrink-0 bg-white border-r border-slate-200 overflow-hidden">
      <nav className="py-0">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="
              w-full flex items-center gap-3
              px-4 py-2.5
              animate-pulse
            "
          >
            {/* Icon placeholder */}
            <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />

            {/* Text placeholder */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-3/4" />
            </div>

            {/* Arrow placeholder */}
            <div className="w-4 h-4 bg-slate-200 rounded shrink-0" />
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarSkeleton;
