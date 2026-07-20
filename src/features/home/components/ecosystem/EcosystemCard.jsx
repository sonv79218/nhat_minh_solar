// ============================================
// ECOSYSTEM CARD - UNIFIED DESIGN SYSTEM
// ============================================
import { useState } from "react";

const EcosystemCard = ({ ecosystem }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-white rounded-3xl overflow-hidden
        border transition-all duration-300
        ${isHovered
          ? "border-blue-200 shadow-md"
          : "border-slate-200 shadow-sm"
        }
      `}
    >
      {/* Background Image */}
      <div className="relative aspect-[1/1] overflow-hidden">
        <img
          src={ecosystem.image}
          alt={ecosystem.name}
          className={`
            absolute inset-0
            w-full h-full
            object-cover
            transition-transform duration-500
            ${isHovered ? "scale-105" : "scale-100"}
          `}
        />
      </div>
    </div>
  );
};

export default EcosystemCard;
