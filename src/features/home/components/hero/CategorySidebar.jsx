// ============================================
// CATEGORY SIDEBAR - MINIMAL LIST ONLY
// No mega menu, no sticky, no scroll inside sidebar
// ============================================
import { useNavigate, useLocation } from "react-router-dom";
import { getCategoryIcon } from "@/features/home/components/category/categoryIcons";

const CategorySidebar = ({ categories = [], hoveredCategory, setHoveredCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeCategory = new URLSearchParams(location.search).get("category");

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <aside className="h-full w-[300px] shrink-0 bg-white border-r border-slate-200 overflow-hidden">
      <nav className="py-0">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.id);
          const isActive = activeCategory === category.id;
          const isHovered = hoveredCategory?.id === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category)}
              className={`
                w-full flex items-center gap-3
                px-4 py-2.5
                text-left
                transition-all duration-200
                hover:bg-sky-50
                ${
                  isActive || isHovered
                    ? "bg-sky-100 border-l-4 border-sky-500 pl-3"
                    : "border-l-4 border-transparent"
                }
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg
                  flex items-center justify-center
                  shrink-0
                  transition-all duration-200
                  ${
                    isActive || isHovered
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500"
                  }
                `}
              >
                <IconComponent size={16} strokeWidth={1.8} />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`
                    text-sm font-semibold leading-tight truncate
                    ${isActive || isHovered ? "text-sky-700" : "text-slate-800"}
                  `}
                >
                  {category.name}
                </div>
              </div>

              <svg
                className={`
                  w-4 h-4 shrink-0
                  transition-all duration-200
                  ${isActive || isHovered ? "text-sky-600" : "text-slate-300"}
                `}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default CategorySidebar;
