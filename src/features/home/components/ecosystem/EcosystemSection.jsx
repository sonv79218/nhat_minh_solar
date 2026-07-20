// ============================================
// ECOSYSTEM SECTION - UNIFIED DESIGN SYSTEM
// ============================================
import EcosystemCard from "./EcosystemCard";
import EcosystemMobileTabs from "./EcosystemMobileTabs";

const ecosystems = [
  {
    id: "aqara",
    name: "Aqara",
    description: "Hệ sinh thái smart home cao cấp hỗ trợ Apple HomeKit và Zigbee.",
    features: ["HomeKit", "Automation", "Zigbee", "AI Smart"],
    image: "https://cdn.phototourl.com/free/2026-06-06-c34f7eb9-e3e4-4677-9852-f137144df790.png",
    color: "#4e5055",
    link: "/ecosystem/aqara",
    comparison: {
      price: "Cao",
      target: "Nhà cao cấp, người dùng Apple HomeKit",
      strengths: "Ổn định, hoàn thiện tốt, tự động hóa mạnh",
      ecosystem: "HomeKit, Zigbee, Automation",
    },
  },
  {
    id: "lumi",
    name: "Lumi",
    description: "Giải pháp nhà thông minh toàn diện dành cho gia đình Việt.",
    features: ["Made in Vietnam", "Tiếng Việt", "Dễ sử dụng", "Ổn định"],
    image: "https://cdn.phototourl.com/free/2026-06-06-11390faf-7717-44d7-91dc-4d7561654582.png",
    color: "#24743f",
    link: "/ecosystem/lumi",
    comparison: {
      price: "Trung bình - cao",
      target: "Gia đình Việt, nhà phố, biệt thự",
      strengths: "Tiếng Việt, dễ dùng, hỗ trợ tốt",
      ecosystem: "Công tắc, cảm biến, rèm, chiếu sáng",
    },
  },
  {
    id: "hunonic",
    name: "Hunonic",
    description: "Thiết bị thông minh giá tốt, dễ lắp đặt và điều khiển từ xa.",
    features: ["Giá tốt", "WiFi", "Điều khiển app", "Smart Life"],
    image: "https://cdn.phototourl.com/free/2026-06-06-21bc2a32-6cfc-4a73-a7d5-bd95016e9b3a.png",
    color: "#04c53a",
    link: "/ecosystem/hunonic",
    comparison: {
      price: "Tốt",
      target: "Chung cư, nhà phố, người mới bắt đầu",
      strengths: "Dễ lắp, giá hợp lý, điều khiển app",
      ecosystem: "Công tắc, ổ cắm, cảm biến, Smart Life",
    },
  },
];

const EcosystemSection = () => {
  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Section Heading */}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 text-center mb-10">
          Hệ Sinh Thái Smart Home
        </h2>

        {/* Mobile: Tabs Layout */}
        <div className="md:hidden">
          <EcosystemMobileTabs ecosystems={ecosystems} />
        </div>

        {/* Desktop: Cards Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {ecosystems.map((ecosystem) => (
            <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
