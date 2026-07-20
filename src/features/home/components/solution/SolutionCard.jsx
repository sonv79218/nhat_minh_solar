// ============================================
// SOLUTION CARD - UNIFIED DESIGN SYSTEM
// ============================================
import { useNavigate } from "react-router-dom";

const SolutionCard = ({ solution }) => {
  const navigate = useNavigate();

  if (!solution) return null;

  const handleClick = () => {
    navigate(`/solutions/${solution.slug}`);
  };

  const imageSrc = solution.image || solution.thumbnail || solution.coverImage;

  return (
    <div
      onClick={handleClick}
      className="group relative aspect-[8/5] overflow-hidden cursor-pointer"
    >
      <img
        src={imageSrc}
        alt={solution.title}
        className="
          absolute inset-0 w-full h-full object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />
    </div>
  );
};

export default SolutionCard;
