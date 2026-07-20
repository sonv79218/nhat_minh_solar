// ============================================
// MEGA CATEGORY MENU - ABSOLUTE OVERLAY
// Covers entire Hero section on hover
// ============================================
import { useNavigate } from "react-router-dom";

const MegaCategoryMenu = ({ category, products = [] }) => {
  const navigate = useNavigate();

  if (!category) return null;

  const handleProductClick = (product) => {
    if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleViewAll = () => {
    navigate(`/products?category=${category.id}`);
  };

  return (
    <div className="absolute left-[300px] top-0 bottom-0 right-0 z-40 bg-white rounded-r-2xl shadow-xl border-l border-slate-100 p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-5 shrink-0">
        <h3 className="text-lg font-bold text-sky-700">{category.name}</h3>
        <p className="text-sm text-slate-500 mt-1">
          {category.description || "Sản phẩm thuộc danh mục này"}
        </p>
      </div>

      {/* Product Grid - scrollable if many products */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {products.length > 0 ? (
          <div className="grid grid-cols-5 gap-5">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductClick(product)}
                className="group/product text-center"
              >
                {/* Image wrapper with fixed aspect ratio */}
                <div className="w-full aspect-square flex items-center justify-center bg-white rounded-xl overflow-hidden">
                  <img
                    src={
                      product.thumbnail ||
                      product.image ||
                      product.imageUrl ||
                      product.images?.[0] ||
                      "/placeholder-product.png"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain p-3 transition-transform duration-200 group-hover/product:scale-105"
                  />
                </div>

                {/* Product name with line-clamp-2 */}
                <div className="text-sm text-slate-700 line-clamp-2 text-center mt-3 min-h-[40px]">
                  {product.name}
                </div>

                {/* Price */}
                {product.price && (
                  <div className="text-xs font-semibold text-sky-600 mt-1">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString("vi-VN") + " đ"
                      : product.price}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            Chưa có sản phẩm trong danh mục này
          </div>
        )}
      </div>

      {/* Footer - View All Button */}
      <div className="mt-4 shrink-0 flex justify-end">
        <button
          type="button"
          onClick={handleViewAll}
          className="
            inline-flex items-center gap-2
            rounded-full
            bg-sky-600
            px-5 py-2.5
            text-sm font-semibold
            text-white
            hover:bg-sky-700
            transition-colors
          "
        >
          Xem tất cả
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default MegaCategoryMenu;
