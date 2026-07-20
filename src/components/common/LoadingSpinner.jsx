// ============================================
// LOADING SPINNER COMPONENT
// ============================================
const LoadingSpinner = ({ fullHeight = false }) => {
  return (
    <div
      className={`flex items-center justify-center bg-slate-50 ${
        fullHeight ? "min-h-screen" : "py-8"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Đang tải...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
