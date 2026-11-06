// ============================================
// BRANDS SECTION
import BrandsSection from "@/features/home/components/BrandsSection";
import SectionEyebrow from "@/features/home/components/common/SectionEyebrow";


// ============================================
// PRICING SECTION
import PricingSection from "@/features/home/components/pricing/PricingSection";

// ============================================
// COMPANY INTRODUCTION SECTION
import CompanyIntroductionSection from "@/features/home/components/common/CompanyIntroductionSection";


// ============================================
// LATEST ARTICLES SECTION
// ============================================
import LatestArticlesSection from "@/features/home/components/LatestArticlesSection";

// ============================================
// HOME PAGE - ĐIỆN MẶT TRỜI NHẬT MINH
// Full landing page with hero, stats, services, products, process, CTA
// ============================================
import { useState, useEffect,  } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Leaf,
  ShieldCheck,
  Clock,
  Phone,
  ArrowRight,
  Star,
} from "lucide-react";

// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/hero/hero-1.webp",
      title: "Điện Mặt Trời Nhật Minh",
      subtitle: "Giải pháp năng lượng sạch bền vững cho mọi công trình",
      highlight: "Nhật Minh",
      description:
        "Chuyên cung cấp và lắp đặt hệ thống điện mặt trời chất lượng cao, tiết kiệm điện lên đến 90% cho gia đình và doanh nghiệp.",
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
    // <section className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[700px] overflow-hidden">
    <section className="relative w-full h-[260px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px] overflow-hidden">
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
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-x-0 top-[70%] md:top-[85%] lg:top-[85%] z-[3]">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >


            {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4"> */}
            <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
              <a
                href="tel:0876906668"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone size={18} />
                <span>Tư vấn miễn phí</span>
              </a>
              <a
                href="#dich-vu"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Xem giải pháp</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dots */}
      {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5"> */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2.5">
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
  <section className="bg-white py-7 sm:py-9 md:py-10">
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      <SectionEyebrow
        label="Tại sao chọn điện mặt trời"
        className="mb-5 sm:mb-7 md:mb-10"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 md:gap-6">
        {benefits.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl sm:p-6"
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl`}
              >
                <Icon
                  size={19}
                  className={item.text}
                  strokeWidth={1.8}
                />
              </div>

              <h3 className="mb-1 text-sm font-bold leading-snug text-slate-900 sm:mb-2 sm:text-base">
                {item.title}
              </h3>

              <p className="line-clamp-3 text-[11px] leading-4 text-slate-500 sm:text-sm sm:leading-relaxed">
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

        <SectionEyebrow label="Quy trình chuyên nghiệp" className="mb-8 md:mb-10" />

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> */}
        <div className="
  -mx-4 flex gap-3 overflow-x-auto px-4 pb-2
  snap-x snap-mandatory
  scrollbar-hide
  sm:grid sm:grid-cols-2 sm:gap-6
  lg:grid-cols-4 lg:gap-8
">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                // className="relative text-center"
                className="
  relative shrink-0 snap-center text-center
  w-[170px]
  sm:w-auto
"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-amber-300 to-amber-100 z-0" />
                )}

<div className="relative z-10">

  <div className="
    inline-flex items-center justify-center
    w-14 h-14 text-lg
    rounded-xl
    bg-gradient-to-br from-amber-400 to-amber-600
    text-white font-extrabold
    mb-3
    shadow-md shadow-amber-500/20

    sm:w-20 sm:h-20
    sm:text-2xl
    sm:rounded-2xl
    sm:mb-5
    sm:shadow-lg
  ">
    {step.number}
  </div>

  <div className="
    mx-auto mb-3
    flex h-10 w-10 items-center justify-center
    rounded-lg bg-amber-50

    sm:h-14 sm:w-14
    sm:rounded-xl
    sm:mb-4
  ">
    <Icon
      size={20}
      className="text-amber-600"
      strokeWidth={1.8}
    />
  </div>

  <h3 className="mb-1 text-sm font-bold text-slate-900 sm:text-lg sm:mb-2">
    {step.title}
  </h3>

  <p className="mx-auto max-w-[160px] text-[11px] leading-4 text-slate-500 sm:max-w-[220px] sm:text-sm sm:leading-relaxed">
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
 <SectionEyebrow label="Đánh giá từ khách hàng" className="mb-8 md:mb-10" />

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
     



      {/* Company Introduction */}
      <CompanyIntroductionSection />

      {/* Brands */}
      <BrandsSection />

            {/* Products */}
      {/* <ProductsSection /> */}

      {/* Projects */}

           {/* Latest Articles */}
      <LatestArticlesSection />

      {/* Why Solar */}
      {/* <WhySolarSection /> */}

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
