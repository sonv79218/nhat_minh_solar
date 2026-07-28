// ============================================
// PRODUCTS & SERVICES SECTION
import ProductsServicesSection from "@/features/home/components/common/ProductsServicesSection";

// ============================================
// PRICING SECTION
import PricingSection from "@/features/home/components/pricing/PricingSection";

// ============================================
// COMPANY INTRODUCTION SECTION
import CompanyIntroductionSection from "@/features/home/components/common/CompanyIntroductionSection";

// ============================================
// PROJECTS SECTION
import { ProjectsSection } from "@/features/home/components";

// ============================================
// HOME PAGE - ĐIỆN MẶT TRỜI NHẬT MINH
// Full landing page with hero, stats, services, products, process, CTA
// ============================================
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Leaf,
  ShieldCheck,
  Clock,
  Sun,
  Users,
  Award,
  Phone,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
} from "lucide-react";

// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80",
      title: "Điện Mặt Trời Nhật Minh",
      subtitle: "Giải pháp năng lượng sạch bền vững cho mọi công trình",
      highlight: "Nhật Minh",
      description:
        "Chuyên cung cấp và lắp đặt hệ thống điện mặt trời chất lượng cao, tiết kiệm điện lên đến 90% cho gia đình và doanh nghiệp.",
    },
    {
      image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1600&q=80",
      title: "Tiết Kiệm Điện Lên Đến 90%",
      subtitle: "Giảm hóa đơn tiền điện hàng tháng",
      highlight: "90%",
      description:
        "Hệ thống điện mặt trời Hybrid cho phép lưu trữ điện dư thừa, sử dụng ban đêm hoặc khi mất điện.",
    },
    {
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=1600&q=80",
      title: "Bảo Vệ Môi Trường",
      subtitle: "Năng lượng xanh - Tương lai bền vững",
      highlight: "Xanh",
      description:
        "Góp phần giảm phát thải CO₂, bảo vệ môi trường và cuộc sống xanh cho cộng đồng.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (index) => setCurrentSlide(index);

  return (
    <section className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Sun size={13} />
              <span>Điện Mặt Trời Từ Sơn, Bắc Ninh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-extrabold text-white leading-tight tracking-tight mb-4">
              {slides[currentSlide].title
                .split(" ")
                .map((word, i, arr) => {
                  const isHighlight =
                    word.toLowerCase() ===
                      slides[currentSlide].highlight?.toLowerCase() ||
                    slides[currentSlide].highlight?.toLowerCase().includes(
                      word.toLowerCase()
                    );
                  return (
                    <span key={i}>
                      <span
                        className={
                          isHighlight
                            ? "text-amber-400"
                            : ""
                        }
                      >
                        {word}
                      </span>
                      {i < arr.length - 1 ? " " : ""}
                    </span>
                  );
                })}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-2 max-w-lg">
              {slides[currentSlide].subtitle}
            </p>

            <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-8 max-w-lg hidden md:block">
              {slides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="tel:0876906668"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={18} />
                <span>Tư vấn miễn phí</span>
              </a>
              <a
                href="#dich-vu"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Xem giải pháp</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
              index === currentSlide
                ? "w-8 bg-gradient-to-r from-amber-400 to-amber-500"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================
// STATS BAR
// ============================================
const StatsBar = () => {
  const stats = [
    { value: "8+", label: "Năm kinh nghiệm", icon: Clock },
    { value: "500+", label: "Dự án hoàn thành", icon: Zap },
    { value: "98%", label: "Khách hàng hài lòng", icon: Star },
    { value: "30%", label: "Cam kết tiết kiệm điện", icon: Leaf },
  ];

  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-slate-700/50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-700/50">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 py-5 sm:py-6 px-4 sm:px-6 first:pl-0 last:pr-0"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-white/50 mt-0.5 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// WHY SOLAR SECTION
// ============================================
const WhySolarSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Tiết kiệm chi phí",
      desc: "Giảm 50-90% hóa đơn điện hàng tháng ngay sau khi lắp đặt.",
      color: "from-amber-400 to-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      icon: Leaf,
      title: "Thân thiện môi trường",
      desc: "Năng lượng sạch, không phát thải, góp phần bảo vệ trái đất.",
      color: "from-emerald-400 to-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      icon: ShieldCheck,
      title: "An toàn & bền bỉ",
      desc: "Hệ thống được bảo hành lên đến 10 năm, tuổi thọ trên 25 năm.",
      color: "from-blue-400 to-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Tự động hoàn toàn",
      desc: "Hệ thống vận hành tự động, không cần bảo trì thường xuyên.",
      color: "from-purple-400 to-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
            Tại sao chọn điện mặt trời
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Lợi ích khi lắp đặt điện mặt trời
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            Năng lượng mặt trời là xu hướng tất yếu — tiết kiệm chi phí, bảo vệ
            môi trường và tăng giá trị bất động sản.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {benefits.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} className={item.text} strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// SERVICES SECTION
// ============================================
const ServicesSection = () => {
  const services = [
    {
      icon: Sun,
      title: "Điện mặt trời gia đình",
      desc: "Hệ thống 3kW – 10kW cho nhà ở, căn hộ, biệt thự. Lắp đặt nhanh chóng, bảo hành dài hạn.",
      price: "Từ 45 triệu",
      tag: "Phổ biến",
      color: "amber",
    },
    {
      icon: Zap,
      title: "Điện mặt trời doanh nghiệp",
      desc: "Hệ thống công suất lớn cho nhà xưởng, văn phòng, khách sạn. Hoàn vốn nhanh, tiết kiệm chi phí vận hành.",
      price: "Liên hệ báo giá",
      tag: "Doanh nghiệp",
      color: "blue",
    },
    {
      icon: Battery,
      title: "Hệ thống Hybrid / Lưu trữ",
      desc: "Kết hợp điện mặt trời và pin lưu trữ. Sử dụng khi mất điện hoặc ban đêm, độc lập lưới điện.",
      price: "Từ 80 triệu",
      tag: "Cao cấp",
      color: "purple",
    },
    {
      icon: ShieldCheck,
      title: "Bảo trì & Sửa chữa",
      desc: "Dịch vụ bảo trì định kỳ, vệ sinh tấm pin, kiểm tra hiệu suất hệ thống. Đội ngũ kỹ thuật chuyên nghiệp.",
      price: "Theo công việc",
      tag: "Dịch vụ",
      color: "emerald",
    },
  ];

  const colorMap = {
    amber: { bg: "bg-amber-50", border: "border-amber-100", tag: "bg-amber-100 text-amber-700", icon: "text-amber-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-100", tag: "bg-blue-100 text-blue-700", icon: "text-blue-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", tag: "bg-purple-100 text-purple-700", icon: "text-purple-600" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-100", tag: "bg-emerald-100 text-emerald-700", icon: "text-emerald-600" },
  };

  return (
    <section id="dich-vu" className="py-16 sm:py-20 md:py-24 bg-slate-50">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
            Dịch vụ của chúng tôi
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Giải pháp điện mặt trời toàn diện
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            Từ tư vấn, thiết kế đến lắp đặt và bảo hành — Nhật Minh đồng hành
            cùng bạn trong suốt vòng đời hệ thống.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = colorMap[service.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group relative rounded-2xl ${colors.bg} border ${colors.border} p-6 hover:shadow-lg transition-all duration-300`}
              >
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-4 ${colors.tag}`}
                >
                  {service.tag}
                </span>

                <div
                  className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={24} className={colors.icon} strokeWidth={1.8} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  {service.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                  <p className="text-sm font-semibold text-slate-700">
                    {service.price}
                  </p>
                  <a
                    href="tel:0876906668"
                    className={`text-sm font-semibold ${colors.icon} hover:underline`}
                  >
                    Tư vấn →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PROCESS SECTION
// ============================================
const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Liên hệ tư vấn",
      desc: "Gọi hotline hoặc để lại thông tin, Nhật Minh sẽ liên hệ trong 30 phút.",
      icon: Phone,
    },
    {
      number: "02",
      title: "Khảo sát & báo giá",
      desc: "Kỹ thuật viên đến khảo sát thực tế, tư vấn công suất và báo giá chi tiết.",
      icon: ClipboardCheck,
    },
    {
      number: "03",
      title: "Ký hợp đồng",
      desc: "Thống nhất phương án, ký hợp đồng và tiến hành đặt thiết bị.",
      icon: FileText,
    },
    {
      number: "04",
      title: "Lắp đặt & vận hành",
      desc: "Đội ngũ lắp đặt chuyên nghiệp trong 1-3 ngày. Bàn giao và hướng dẫn sử dụng.",
      icon: Wrench,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
            Quy trình chuyên nghiệp
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            4 bước lắp đặt điện mặt trời
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            Quy trình rõ ràng, minh bạch từ đầu đến cuối. Cam kết đúng tiến độ
            và chất lượng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-300 to-amber-100 z-0" />
                )}

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-extrabold text-2xl mb-5 shadow-lg shadow-amber-500/30">
                    {step.number}
                  </div>

                  <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} className="text-amber-600" strokeWidth={1.8} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// PRODUCTS SHOWCASE
// ============================================
// const ProductsSection = () => {
//   const products = [
//     {
//       name: "Tấm pin Canadian Solar 550W",
//       type: "Tấm pin mặt trời",
//       warranty: "Bảo hành 12 năm",
//       efficiency: "Hiệu suất 21.5%",
//       badge: "Bán chạy",
//       color: "amber",
//       image:
//         "https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=600&q=80",
//     },
//     {
//       name: "Inverter Huawei SUN2000 8KTL",
//       type: "Bộ biến tần",
//       warranty: "Bảo hành 10 năm",
//       efficiency: "Hiệu suất 98.4%",
//       badge: "Cao cấp",
//       color: "blue",
//       image:
//         "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80",
//     },
//     {
//       name: "Pin lưu trữ Pylontech US5000",
//       type: "Pin lưu trữ Lithium",
//       warranty: "Bảo hành 10 năm",
//       efficiency: "Dung lượng 4.8kWh",
//       badge: "Hybrid",
//       color: "purple",
//       image:
//         "https://images.unsplash.com/photo-1601805-2650-18d1e12f5e7e?w=600&q=80",
//     },
//     {
//       name: "Giàn giá lắp đặt AustSolar",
//       type: "Phụ kiện lắp đặt",
//       warranty: "Bảo hành 5 năm",
//       efficiency: "Chống gỉ sét tối đa",
//       badge: "Phụ kiện",
//       color: "emerald",
//       image:
//         "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80",
//     },
//   ];

//   const colorMap = {
//     amber: { icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
//     blue: { icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
//     purple: { icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
//     emerald: { icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
//   };

//   return (
//     <section className="py-16 sm:py-20 md:py-24 bg-slate-50">
//       <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
//               Thiết bị chính hãng
//             </p>
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
//               Sản phẩm nổi bật
//             </h2>
//           </div>
//           <a
//             href="/products"
//             className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
//           >
//             <span>Xem tất cả sản phẩm</span>
//             <ArrowRight size={16} />
//           </a>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
//           {products.map((product, index) => {
//             const colors = colorMap[product.color];
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 className="group rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//               >
//                 <div className="relative h-48 overflow-hidden bg-slate-100">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                   />
//                   <span
//                     className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${colors.badge}`}
//                   >
//                     {product.badge}
//                   </span>
//                 </div>

//                 <div className="p-5">
//                   <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
//                     {product.type}
//                   </p>
//                   <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3">
//                     {product.name}
//                   </h3>

//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
//                       <ShieldCheck size={11} />
//                       {product.warranty}
//                     </span>
//                     <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
//                       <Zap size={11} />
//                       {product.efficiency}
//                     </span>
//                   </div>

//                   <a
//                     href="tel:0876906668"
//                     className="inline-flex items-center justify-center w-full gap-2 bg-slate-900 hover:bg-amber-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-300"
//                   >
//                     <Phone size={15} />
//                     <span>Liên hệ báo giá</span>
//                   </a>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anh Nguyễn Văn Hùng",
      location: "Từ Sơn, Bắc Ninh",
      content:
        "Lắp đặt 5kW cho gia đình 4 người. Hóa đơn điện giảm từ 2.5 triệu xuống còn 400k/tháng. Đội ngũ Nhật Minh lắp đặt rất chuyên nghiệp, chỉ 2 ngày là xong.",
      rating: 5,
      system: "Điện mặt trời gia đình 5kW",
    },
    {
      name: "Bà Trần Thị Lan",
      location: "Thuận Thành, Bắc Ninh",
      content:
        "Nhà có 3 tầng, lắp 8kW. Trời nắng thì gần như không tốn tiền điện. Nhân viên tư vấn nhiệt tình, giá cả hợp lý hơn nhiều đơn vị khác.",
      rating: 5,
      system: "Điện mặt trời gia đình 8kW",
    },
    {
      name: "Công ty TNHH ABC Việt Nam",
      location: "Khu công nghiệp Yên Phong, Bắc Ninh",
      content:
        "Lắp đặt hệ thống 50kW cho nhà xưởng. Tiết kiệm được hơn 30% chi phí điện hàng tháng. Đội ngũ kỹ thuật hỗ trợ rất tốt từ khâu thiết kế đến vận hành.",
      rating: 5,
      system: "Điện mặt trời doanh nghiệp 50kW",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
            Khách hàng nói gì về chúng tôi
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            Đánh giá từ khách hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">
                "{item.content}"
              </p>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-slate-400" />
                  <p className="text-xs text-slate-400">{item.location}</p>
                </div>
                <p className="text-xs text-amber-600 font-semibold mt-1">
                  {item.system}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900" />
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=60"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sun size={14} />
            <span>Miễn phí tư vấn 100%</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Sẵn sàng tiết kiệm điện?
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Liên hệ ngay với Nhật Minh để được khảo sát và báo giá miễn phí tại
            nhà. Cam kết không phí nếu không hài lòng.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0876906668"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 text-base"
            >
              <Phone size={20} />
              <span>0876 906 668</span>
            </a>
            <a
              href="https://zalo.me/0876906668"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 text-base"
            >
              <ZaloIcon />
              <span>Nhắn tin Zalo</span>
            </a>
          </div>

          <p className="mt-6 text-sm text-white/40">
            Hotline hỗ trợ: 0876 906 668 — Kỹ thuật: 0972 131 477
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// ZALO ICON
// ============================================
const ZaloIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 16.512c-.096.24-.312.408-.576.456-.264.048-.54-.024-.768-.192l-3.072-2.304v5.088c0 .528-.432.96-.96.96s-.96-.432-.96-.96V9.6l-2.064 1.584c-.216.168-.48.216-.744.144-.264-.072-.456-.264-.528-.528L6.12 6.72c-.12-.384-.072-.816.144-1.152.216-.336.576-.528.96-.528h11.712c.384 0 .744.192.96.528.216.336.264.768.144 1.152l-3.168 7.104c-.072.168-.192.312-.336.408z" />
  </svg>
);

// ============================================
// PLACEHOLDER ICONS
// ============================================
const Battery = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <rect x="2" y="7" width="18" height="11" rx="2" />
    <path d="M22 11v3" strokeLinecap="round" />
    <path d="M7 10v4M10 10v4M13 10v4" />
  </svg>
);

const ClipboardCheck = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const FileText = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const Wrench = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const MapPin = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ============================================
// HOME PAGE COMPONENT
// ============================================
const HomePage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsBar />

      {/* Company Introduction */}
      <CompanyIntroductionSection />



            {/* Products */}
      {/* <ProductsSection /> */}

      {/* Projects */}
      {/* <ProjectsSection /> */}
      {/* Why Solar */}
      <WhySolarSection />

      {/* Pricing Section */}
      <PricingSection />
      {/* Services */}
      {/* <ServicesSection /> */}

      {/* Products & Services Grid */}
      {/* <ProductsServicesSection /> */}

      {/* Process */}
      <ProcessSection />



      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <CTASection />
    </main>
  );
};

export default HomePage;
