// ============================================
// PAGINATION COMPONENT - TAILWIND CSS
// ============================================
import { useMemo } from "react";

// Generate page numbers with ellipsis
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const delta = 1; // Pages to show around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // Don't Render if only 1 page
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8 flex-wrap">
      {/* Prev Button */}
      <button
        className={`
          flex items-center gap-1.5 px-4 py-2.5
          bg-white border border-slate-200 rounded-xl
          text-sm font-semibold text-slate-900
          transition-all duration-200
          hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          sm:px-5
        `}
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-sm font-medium">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`
                min-w-[36px] h-9 sm:min-w-[40px] sm:h-10
                flex items-center justify-center
                bg-white border border-slate-200 rounded-lg sm:rounded-xl
                text-sm font-semibold
                transition-all duration-200
                ${currentPage === page
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 border-transparent text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-500 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900"
                }
              `}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        className={`
          flex items-center gap-1.5 px-4 py-2.5
          bg-white border border-slate-200 rounded-xl
          text-sm font-semibold text-slate-900
          transition-all duration-200
          hover:bg-slate-100 hover:border-slate-300 hover:-translate-y-0.5
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          sm:px-5
        `}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
