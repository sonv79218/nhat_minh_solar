// ============================================
// CATEGORY GRID SECTION - SEAMLESS LANDING DESIGN
// Desktop: 5 cols x 2 rows = 10
// Mobile: 4 cols x 2 rows = 8
// ============================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { CategoryGridSkeleton } from "./SectionSkeletons";

const CategoryGridSection = ({ categories, isLoading }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const hasCategories = categories && categories.length > 0;
  const showLoading = isLoading !== undefined ? isLoading : !hasCategories;

  const limitCount = isMobile ? 8 : 10;
  const displayedCategories = hasCategories
    ? (showAll ? categories : categories.slice(0, limitCount))
    : [];
  const hasMore = hasCategories && categories.length > limitCount;

  return (
    <section className="w-full py-4 md:py-6">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 text-center mb-10">
          Danh mục sản phẩm
        </h2>

        {/* Loading Skeleton */}
        {showLoading && <CategoryGridSkeleton />}

        {/* Animated Grid - Only show when not loading and has data */}
        {!showLoading && hasCategories && (
          <motion.div
            layout
            className="
              grid
              grid-cols-4
              sm:grid-cols-10
              gap-2.5 sm:gap-3 md:gap-4
            "
          >
            <AnimatePresence initial={false}>
              {displayedCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.22,
                    ease: "easeOut",
                    delay: showAll ? index * 0.015 : 0,
                  }}
                >
                  <CategoryCard category={category} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* More Button */}
        {!showLoading && hasMore && (
          <motion.div
            layout
            className="mt-3 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="
                group inline-flex items-center justify-center gap-2
                px-4 py-2
                text-sm font-semibold text-slate-700
                hover:text-blue-600
                active:scale-95
                transition-all duration-300
              "
            >
              <motion.span
                key={showAll ? "collapse" : "more"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {showAll ? "Thu gọn" : "Xem thêm"}
              </motion.span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className={`
                  transition-all duration-300 ease-in-out
                  ${showAll ? "-rotate-90" : "rotate-90"}
                  group-hover:translate-x-0.5
                `}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryGridSection;