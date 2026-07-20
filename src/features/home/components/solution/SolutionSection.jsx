// ============================================
// SOLUTION SECTION COMPONENT
// Display grid of smart home solutions
// ============================================
import { useState, useEffect } from "react";
import SolutionCard from "./SolutionCard";
import { getActiveSolutions } from "@/services/solutionService";
import { SolutionGridSkeleton } from "@/features/home/components/category/SectionSkeletons";

const SolutionSection = ({ solutions: propSolutions, isLoading: externalLoading }) => {
  const [solutions, setSolutions] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);

  // Use external loading if provided, otherwise use internal state
  const showLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    const fetchSolutions = async () => {
      if (propSolutions !== undefined) {
        setSolutions(propSolutions);
        setInternalLoading(false);
        return;
      }

      try {
        const data = await getActiveSolutions();
        setSolutions(data);
      } catch (error) {
        console.error("[SolutionSection] Error fetching solutions:", error);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchSolutions();
  }, [propSolutions]);

  return (
    <div className="w-full py-12 md:py-16 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 text-center mb-10">
          Giải pháp nhà thông minh
        </h2>

        {/* Loading Skeleton */}
        {showLoading && <SolutionGridSkeleton />}

        {/* Solutions Grid - Only show when not loading and has data */}
        {!showLoading && solutions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionSection;
