// ============================================
// HOME COMPONENTS - INDEX
// Re-export all home components for easy importing
// ============================================

// Hero components
export { default as CategorySidebar } from "./hero/CategorySidebar";
export { default as MegaCategoryMenu } from "./hero/MegaCategoryMenu";
export { default as SidebarSkeleton } from "./hero/SidebarSkeleton";
export { default as BannerSection } from "./hero/BannerSection";
export { default as BannerSkeleton, DesktopBannerSkeleton } from "./hero/BannerSkeleton";

// Category components
export { default as CategoryGridSection } from "./category/CategoryGridSection";
export { default as CategoryCard } from "./category/CategoryCard";
export { default as CategoryProductSection } from "./category/CategoryProductSection";
export { default as ProductCard } from "./category/ProductCard";
export { getCategoryIcon } from "./category/categoryIcons";

// Solution components
export { default as SolutionSection } from "./solution/SolutionSection";
export { default as SolutionCard } from "./solution/SolutionCard";

// Ecosystem components
export { default as EcosystemSection } from "./ecosystem/EcosystemSection";
export { default as EcosystemCard } from "./ecosystem/EcosystemCard";
export { default as EcosystemMobileTabs } from "./ecosystem/EcosystemMobileTabs";
export { default as EcosystemComparisonTable } from "./ecosystem/EcosystemComparisonTable";

// About & Contact components
export { default as ContactSection } from "./contact/ContactSection";

// Common components
export { default as FeaturesBar } from "./common/FeaturesBar";
export { default as SectionDivider } from "./common/SectionDivider";

// Section skeletons
export {
  SolutionGridSkeleton,
  CategoryGridSkeleton,
  SectionHeaderSkeleton,
  SolutionSectionSkeleton,
  CategoryGridSectionSkeleton,
} from "./category/SectionSkeletons";

// Unused in current HomePage but kept for future use
export { default as ProjectsSection } from "./ProjectsSection";
export { default as FeaturedProductsSection } from "./FeaturedProductsSection";
