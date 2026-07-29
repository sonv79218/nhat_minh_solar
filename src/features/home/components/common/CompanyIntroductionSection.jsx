// ============================================
// COMPANY INTRODUCTION SECTION
// Điện Mặt Trời Nhật Minh
// Full-width intro section on HomePage
// ============================================
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";

const CompanyIntroductionSection = () => {
  const highlights = [
    "Tư vấn & thiết kế hệ thống phù hợp",
    "Thi công chuyên nghiệp, đúng tiến độ",
    "Bảo hành dài hạn lên đến 12 năm",
    "Đội ngũ kỹ thuật giàu kinh nghiệm",
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Eyebrow */}
            <SectionEyebrow label="Về chúng tôi" className="mb-6" />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                alt="Điện mặt trời Nhật Minh - Lắp đặt hệ thống"
                className="w-full h-[380px] sm:h-[450px] lg:h-[550px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1628]/30 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -right-4 sm:right-4 bg-[#0b1628] rounded-2xl px-6 py-5 shadow-2xl shadow-slate-900/20 border border-[#1a2a40] hidden sm:block">
              <p className="text-3xl font-extrabold text-green-400 leading-none">8+</p>
              <p className="text-xs text-white/60 mt-1">Năm kinh nghiệm</p>
              <div className="mt-3 pt-3 border-t border-[#1a2a40]">
                <p className="text-2xl font-extrabold text-white leading-none">500+</p>
                <p className="text-[11px] text-white/60 mt-0.5">Dự án hoàn thành</p>
              </div>
            </div>

            {/* Decorative border */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-green-400/30 rounded-tl-2xl -z-10" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >



            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f1b2d] leading-tight mb-6">
              Nhật Minh — Giải pháp năng lượng mặt trời thông minh và bền vững
            </h2>

            {/* Description */}
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              <p>
                Nhật Minh chuyên tư vấn, thiết kế và lắp đặt hệ thống điện năng lượng mặt trời cho hộ gia đình, nhà xưởng, doanh nghiệp và công trình thương mại.
              </p>
              <p>
                Chúng tôi cung cấp giải pháp trọn gói từ khảo sát, thiết kế, lựa chọn thiết bị, thi công đến bảo trì hệ thống. Mỗi công trình đều được tính toán phù hợp với nhu cầu sử dụng điện, diện tích mái và ngân sách của khách hàng.
              </p>
              <p>
                Với đội ngũ kỹ thuật giàu kinh nghiệm, Nhật Minh cam kết mang đến hệ thống hoạt động ổn định, an toàn, tiết kiệm điện và có hiệu quả sử dụng lâu dài.
              </p>
            </div>

            {/* Highlights */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-green-500 shrink-0 mt-0.5"
                    strokeWidth={2}
                  />
                  <span className="text-sm text-slate-600">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <a
              href="/about"
              className="inline-flex items-center gap-2.5 bg-[#0b1628] hover:bg-green-500 text-white font-bold px-7 py-3.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 text-sm sm:text-base group"
            >
              <span>Xem thêm</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntroductionSection;
