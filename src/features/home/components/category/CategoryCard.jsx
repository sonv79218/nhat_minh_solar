// ============================================
// CATEGORY CARD COMPONENT
// Compact Smart Home E-commerce Style
// ============================================
import { useNavigate } from "react-router-dom";
import { getCategoryIcon } from "./categoryIcons";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const IconComponent = getCategoryIcon(category.id);

  const handleClick = () => {
    navigate(`/products?category=${category.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="
        flex flex-col items-center justify-center
        aspect-square w-full
        bg-white
        rounded-xl
        border border-slate-100
        shadow-sm
        hover:shadow-md hover:border-primary-200
        active:scale-95
        transition-all duration-150
        p-2
      "
    >

<div className="flex items-center justify-center mb-1 md:mb-3">
  <IconComponent
    size={20} // mobile
    strokeWidth={1.8}
    className="
      text-primary-600
      w-4 h-4
      md:w-6 md:h-10
    "
  />
</div>

      {/* Label */}

<span
  className="
    text-[8px]
    md:text-xs
    lg:text-sm

    font-medium
    md:font-semibold

    uppercase
    text-slate-700
    text-center

    leading-[1.1]
    md:leading-tight

    line-clamp-2

    px-0
    md:px-1
  "
>
  {category.name}
</span>
    </button>
  );
};

export default CategoryCard;
