// ============================================
// PRODUCTS & SERVICES SECTION
// Điện Mặt Trời Nhật Minh
// Grid layout with green accent cards, matches heropower.vn style
// ============================================
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Sun,
  Battery,
  Wrench,
  LayoutGrid,
  ArrowRight,
  Phone,
  BarChart3,
} from "lucide-react";

const ProductsServicesSection = () => {
  const items = [
    {
      icon: Sun,
      title: "Tấm pin năng lượng mặt trời",
      desc: "Tấm pin chất lượng cao từ các thương hiệu quốc tế: Canadian Solar, Longi, AE Solar. Hiệu suất cao, bảo hành 12 năm.",
      href: "/products?category=solar-panel",
    },
    {
      icon: Zap,
      title: "Inverter / Bộ biến tần",
      desc: "Bộ biến tần Huawei, SMA, Solis, Deye. Chuyển đổi điện DC sang AC hiệu quả, giám sát thông minh qua app.",
      href: "/products?category=inverter",
    },
    {
      icon: Battery,
      title: "Pin lưu trữ Lithium",
      desc: "Pin Lithium Pylontech, SolarX, EVE. Dung lượng từ 5kWh đến 20kWh, tuổi thọ trên 10 năm.",
      href: "/products?category=battery",
    },
    {
      icon: Wrench,
      title: "Phụ kiện lắp đặt",
      desc: "Giàn giá, rail nhôm, máng cáp, đầu cos, CB bảo vệ. Vật tư chất lượng, chống gỉ sét tối đa.",
      href: "/products?category=accessories",
    },
    {
      icon: BarChart3,
      title: "Hệ thống giám sát",
      desc: "Thiết bị giám sát online, theo dõi sản lượng điện real-time qua điện thoại. Cảnh báo sự cố tức thì.",
      href: "/products?category=monitoring",
    },
    {
      icon: LayoutGrid,
      title: "Bộ kit điện mặt trời",
      desc: "Bộ kit hoàn chỉnh cho từng nhu cầu: 3kW, 5kW, 8kW, 10kW. Đầy đủ thiết bị, lắp đặt nhanh chóng.",
      href: "/products?category=kit",
    },
    {
      icon: Sun,
      title: "Điện mặt trời gia đình",
      desc: "Hệ thống 3kW–10kW cho nhà ở, biệt thự, căn hộ. Lắp đặt nhanh, bảo hành 10-12 năm.",
      href: "/solar-home",
    },
    {
      icon: Zap,
      title: "Điện mặt trời doanh nghiệp",
      desc: "Hệ thống 20kW–500kW cho nhà xưởng, khách sạn, khu công nghiệp. Tiết kiệm 30-50% chi phí điện.",
      href: "/solar-business",
    },
    {
      icon: Battery,
      title: "Điện mặt trời Hybrid",
      desc: "Kết hợp điện mặt trời và pin lưu trữ. Dùng được khi mất điện, tự chủ năng lượng tối đa.",
      href: "/solar-hybrid",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#0b1628] overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <LayoutGrid size={13} />
              <span>Sản phẩm & Dịch vụ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Sản phẩm & Dịch vụ
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors shrink-0 group"
          >
            <span>Xem tất cả</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
              >
                <Link
                  to={item.href}
                  className="group flex flex-col h-full rounded-xl border-l-2 border-green-500 bg-[#0f1b2d]/80 p-6 hover:bg-[#0f2a1e]/60 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-5 group-hover:bg-green-500/20 transition-colors duration-300">
                    <Icon
                      size={24}
                      className="text-green-400"
                      strokeWidth={1.7}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-green-400 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/50 leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-green-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Xem chi tiết
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                      <ArrowRight
                        size={13}
                        className="text-white/40 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:0876906668"
            className="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 text-sm sm:text-base"
          >
            <Phone size={17} />
            <span>Liên hệ tư vấn: 0876 906 668</span>
          </a>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors group"
          >
            <span>Xem danh mục đầy đủ</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsServicesSection;
