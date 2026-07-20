// ============================================
// FEATURED PRODUCTS SECTION - TAILWIND
// ============================================
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

const Skeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
    <div className="aspect-square bg-slate-100 animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
      <div className="h-5 bg-slate-100 rounded animate-pulse w-1/3" />
    </div>
  </div>
);

const FeaturedProductsSection = ({ products, loading }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">⭐</span>
          <h2 className="text-xl md:text-2xl font-bold text-secondary">
            Sản phẩm nổi bật
          </h2>
        </div>
        <Link 
          to="/products" 
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Xem tất cả
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProductsSection;
