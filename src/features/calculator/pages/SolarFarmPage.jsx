// ============================================
// SOLAR FARM PAGE — /solutions/solar-farm
// Điện Mặt Trời Nhật Minh
// ============================================
import SolutionDetailLayout from "@/features/home/components/pricing/SolutionDetailLayout";
import { FARM_PACKAGES } from "@/features/home/components/pricing/pricingData";

const SolarFarmPage = () => (
  <SolutionDetailLayout
    categoryId="solar-farm"
    badgeText="🔋 Điện mặt trời trang trại"
    badgeColor="bg-red-500/15 text-red-400 border-red-500/30"
    title="Điện mặt trời trang trại"
    subtitle="Hệ bám tải & độc lập cho mọi địa hình"
    description="Hệ thống điện mặt trời cho trang trại, khu nông nghiệp, vùng không có lưới điện. Hệ bám tải (Backup) và hoàn toàn độc lập (Off-grid) với pin lưu trữ dung lượng lớn, tự chủ năng lượng hoàn toàn."
    image="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1600&q=80"
    targets={["Trang trại nông nghiệp", "Vùng không có lưới điện", "Khu công nghiệp", "Hệ dự phòng công suất lớn"]}
    packages={FARM_PACKAGES}
    heroStats={[
      { val: "10–50 kW", label: "Công suất" },
      { val: "100%", label: "Tự chủ năng lượng" },
      { val: "Off-grid", label: "Không cần lưới điện" },
    ]}
  />
);

export default SolarFarmPage;
