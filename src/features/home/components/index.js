// ============================================
// HOME COMPONENTS - INDEX
// Re-export all home components for easy importing
// ============================================

// Hero components
export { default as CategorySidebar } from "@/features/home/components/hero/CategorySidebar";
export { default as MegaCategoryMenu } from "@/features/home/components/hero/MegaCategoryMenu";
export { default as SidebarSkeleton } from "@/features/home/components/hero/SidebarSkeleton";
export { default as BannerSection } from "@/features/home/components/hero/BannerSection";
export {
  default as BannerSkeleton,
  DesktopBannerSkeleton,
} from "@/features/home/components/hero/BannerSkeleton";

// Category components
export { default as CategoryGridSection } from "@/features/home/components/category/CategoryGridSection";
export { default as CategoryCard } from "@/features/home/components/category/CategoryCard";
export { default as CategoryProductSection } from "@/features/home/components/category/CategoryProductSection";
export { default as ProductCard } from "@/features/home/components/category/ProductCard";
export { getCategoryIcon } from "@/features/home/components/category/categoryIcons";


// About & Contact components
export { default as ContactSection } from "@/features/home/components/contact/ContactSection";

// Common components
export { default as FeaturesBar } from "@/features/home/components/common/FeaturesBar";
export { default as SectionDivider } from "@/features/home/components/common/SectionDivider";
export { default as BrandsSection } from "@/features/home/components/BrandsSection";

// Section skeletons
export {
  SolutionGridSkeleton,
  CategoryGridSkeleton,
  SectionHeaderSkeleton,
  SolutionSectionSkeleton,
  CategoryGridSectionSkeleton,
} from "@/features/home/components/category/SectionSkeletons";

// Unused in current HomePage but kept for future use
export { default as ProjectsSection } from "@/features/home/components/ProjectsSection";
export { default as FeaturedProductsSection } from "@/features/home/components/FeaturedProductsSection";
