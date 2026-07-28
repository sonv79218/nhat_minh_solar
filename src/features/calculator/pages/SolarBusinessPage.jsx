// ============================================
// SOLAR BUSINESS PAGE — /solutions/solar-business
// Điện Mặt Trời Nhật Minh
// ============================================
import SolutionDetailLayout from "@/features/home/components/pricing/SolutionDetailLayout";
import { BUSINESS_PACKAGES } from "@/features/home/components/pricing/pricingData";

const SolarBusinessPage = () => (
  <SolutionDetailLayout
    categoryId="solar-business"
    badgeText="🏢 Điện mặt trời doanh nghiệp"
    badgeColor="bg-amber-500/15 text-amber-400 border-amber-500/30"
    title="Điện mặt trời doanh nghiệp"
    subtitle="Giải pháp năng lượng sạch cho doanh nghiệp"
    description="Hệ thống điện mặt trời công suất lớn cho doanh nghiệp: nhà xưởng, văn phòng, khách sạn, khu thương mại. Công suất 10kW–50kW, hoàn vốn nhanh, giảm 30–50% chi phí vận hành, hỗ trợ SCADA giám sát."
    image="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1600&q=80"
    targets={["Nhà xưởng, kho bãi", "Văn phòng, tòa nhà", "Khách sạn, nhà hàng", "Khu thương mại"]}
    packages={BUSINESS_PACKAGES}
    heroStats={[
      { val: "10–50 kW", label: "Công suất" },
      { val: "30–50%", label: "Giảm chi phí" },
      { val: "3–5 năm", label: "Hoàn vốn" },
    ]}
  />
);

export default SolarBusinessPage;
