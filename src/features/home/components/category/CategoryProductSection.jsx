// ============================================
// CATEGORY PRODUCT SECTION - UNIFIED DESIGN SYSTEM
// ============================================
import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";

const PRODUCTS_PER_PAGE = 8;

// ============================================
// SUB-COMPONENTS
// ============================================

const CategoryHeader = ({ category }) => (
  <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 text-center mb-10">
    {category.name}
  </h2>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-3 py-1.5 rounded-lg border border-slate-200
          text-xs md:text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-slate-50 transition
        "
      >
        Trước
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-semibold transition
              ${currentPage === page
                ? "bg-blue-600 text-white"
                : "border border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-3 py-1.5 rounded-lg border border-slate-200
          text-xs md:text-sm font-medium
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-slate-50 transition
        "
      >
        Sau
      </button>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const CategoryProductSection = ({ category, products, viewAllLink }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!products || products.length === 0) return null;

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  return (
    <section className="py-12 md:py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Header */}
        <CategoryHeader category={category} />

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default CategoryProductSection;
