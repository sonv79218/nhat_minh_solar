// ============================================
// PRODUCT CARD
// Modern E-commerce Style (Shopee/Tiki/Apple Store)
// Pure TailwindCSS - Production Ready
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "@/features/cart/hooks/useCart";
import { useToast } from "@/contexts/ToastContext";
import { toInteger } from "@/utils/priceUtils";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check for discount (originalPrice > price means there's a discount)
  const displayPrice = toInteger(product.price || 0);
  const originalPriceValue = toInteger(product.originalPrice || product.discountPrice || 0);
  const hasDiscount = originalPriceValue > displayPrice && displayPrice > 0;
  const discountPercent = hasDiscount && originalPriceValue > 0
    ? Math.round(((originalPriceValue - displayPrice) / originalPriceValue) * 100)
    : 0;

  const formatPrice = (price) => {
    return toInteger(price).toLocaleString("vi-VN");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock === 0) {
      toast.warning(`Sản phẩm "${product.name}" hiện đang hết hàng.`, {
        title: "Không thể thêm vào giỏ",
      });
      return;
    }
    addToCart(product);
  };

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article
      onClick={handleViewProduct}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
        group relative
        flex flex-col
        bg-white rounded-xl overflow-hidden
        border border-slate-100
        shadow-sm hover:shadow-lg
        transition-all duration-200
        cursor-pointer
        h-full
      "
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {/* Product Image */}
        <img
          src={imgError ? "/placeholder.png" : (product.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400")}
          alt={product.name}
          className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Discount Badge */}
{hasDiscount && (
  <div className="absolute top-2 right-2 z-10">
    <span
      className="
        inline-flex items-center
        px-2 py-0.5 sm:px-2.5 sm:py-1
        bg-gradient-to-r from-red-500 to-pink-500
        text-white
        text-[10px] sm:text-[11px] md:text-xs
        font-semibold
        rounded-full
        shadow-md
        shadow-red-500/20
        backdrop-blur-md
        select-none
      "
    >
      -{discountPercent}%
    </span>
  </div>
)}

        {/* Badge Tags */}
        {(product.bestSeller || product.newProduct) && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
{product.bestSeller && (
  <span
    className="
      px-3 py-1
      bg-orange-500
      text-white
      text-xs
      font-bold
      uppercase
      rounded-md
    "
  >
    Hot
  </span>
)}
{product.newProduct && (
  <span
    className="
      px-3 py-1
      bg-primary-600
      text-white
      text-xs
      font-bold
      rounded-md
    "
  >
    Mới
  </span>
)}
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg">
              Hết hàng
            </span>
          </div>
        )}

        {/* Add to Cart Button - Desktop Hover */}
{/* Action Buttons - Desktop Hover */}
{/* Action Buttons - Desktop Hover */}
{product.stock !== 0 && (
  <div
    className={`
      hidden md:flex absolute bottom-2 left-2 right-2 z-10
      gap-2
      transition-all duration-200
      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    `}
  >
    {/* View Detail - LEFT (secondary but clean) */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleViewProduct();
      }}
      className="
        flex-1 py-2 px-2
        bg-gradient-to-r from-slate-50 to-white
        hover:from-slate-100 hover:to-slate-50
        text-slate-700 hover:text-primary-600
        border border-slate-200 hover:border-primary-200
        text-xs font-semibold
        rounded-lg
        transition-all duration-200
        flex items-center justify-center gap-1.5
        shadow-sm
      "
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      Xem chi tiết
    </button>

    {/* Add to Cart - RIGHT (primary gradient) */}
    <button
      onClick={handleAddToCart}
      className="
        flex-1 py-2 px-2
        bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-500
        hover:from-primary-700 hover:via-primary-600 hover:to-indigo-600
        text-white text-xs font-semibold
        rounded-lg
        transition-all duration-200
        flex items-center justify-center gap-1.5
        shadow-md shadow-primary-500/25
        hover:shadow-lg hover:shadow-primary-500/30
      "
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Thêm vào giỏ
    </button>
  </div>
)}
        {/* Quick Add - Mobile */}
        {product.stock !== 0 && (
          <button
            onClick={handleAddToCart}
            className="
              md:hidden absolute bottom-2 right-2 z-10
              w-9 h-9 rounded-full
              bg-primary-600 text-white
              shadow-lg flex items-center justify-center
              active:scale-90 transition-transform duration-100
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-3">
        {/* Brand */}
        {product.brand && (
          <span className="text-[10px] text-primary-600 font-semibold uppercase tracking-wide mb-0.5">
            {product.brand}
          </span>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 mb-auto pb-1">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-red-600">
              {formatPrice(displayPrice)}đ
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(originalPriceValue)}đ
              </span>
            )}
          </div>

          {/* Rating & Sold */}
          <div className="flex items-center gap-2 mt-1.5">
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(product.rating || 0) ? "#f59e0b" : "#d1d5db"}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-slate-400">
              {product.sold || 0} đã bán
            </span>
          </div>

          {/* Low Stock Alert */}
          {/* {product.stock > 0 && product.stock <= 5 && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-orange-500">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Còn {product.stock} sản phẩm</span>
            </div>
          )} */}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
