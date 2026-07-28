// ============================================
// SOLAR HOME PAGE — /solutions/solar-home
// Điện Mặt Trời Nhật Minh
// ============================================
import SolutionDetailLayout from "@/features/home/components/pricing/SolutionDetailLayout";
import { HOME_PACKAGES } from "@/features/home/components/pricing/pricingData";

const SolarHomePage = () => (
  <SolutionDetailLayout
    categoryId="solar-home"
    badgeText="🏠 Điện mặt trời gia đình"
    badgeColor="bg-blue-500/15 text-blue-400 border-blue-500/30"
    title="Điện mặt trời gia đình"
    subtitle="Giải pháp tiết kiệm điện cho mọi gia đình"
    description="Hệ thống điện mặt trời cho gia đình: căn hộ chung cư, nhà phố, biệt thự. Công suất 3kW–15kW, tiết kiệm 50–90% tiền điện hàng tháng, lắp đặt nhanh chóng, bảo hành dài hạn."
    image="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80"
    targets={["Gia đình 2–6 người", "Căn hộ chung cư", "Nhà phố, biệt thự", "Hộ kinh doanh nhỏ"]}
    packages={HOME_PACKAGES}
    heroStats={[
      { val: "3–15 kW", label: "Công suất" },
      { val: "50–90%", label: "Tiết kiệm điện" },
      { val: "10–15 năm", label: "Bảo hành" },
    ]}
  />
);

export default SolarHomePage;
