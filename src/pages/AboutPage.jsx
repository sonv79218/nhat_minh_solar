// ============================================
// ABOUT PAGE - ĐIỆN MẶT TRỜI NHẬT MINH
// Company About Page
// ============================================
import { motion } from "framer-motion";
import {
  Sun,
  Award,
  Users,
  Clock,
  Leaf,
  Zap,
  ShieldCheck,
  Phone,
  ArrowRight,
} from "lucide-react";

const stats = [
  { value: "8+", label: "Năm kinh nghiệm", icon: Clock },
  { value: "500+", label: "Dự án hoàn thành", icon: Zap },
  { value: "98%", label: "Khách hàng hài lòng", icon: Award },
  { value: "30%", label: "Tiết kiệm điện tối thiểu", icon: Leaf },
];

const milestones = [
  { year: "2018", event: "Thành lập công ty, hoạt động trong lĩnh vực thiết bị điện thông minh." },
  { year: "2020", event: "Mở rộng sang giải pháp điện mặt trời, hoàn thành dự án đầu tiên tại Bắc Ninh." },
  { year: "2022", event: "Hoàn thành hơn 200 dự án điện mặt trời cho hộ gia đình và doanh nghiệp." },
  { year: "2024", event: "Đạt mốc 500+ dự án, trở thành đơn vị lắp đặt điện mặt trời uy tín tại Bắc Ninh và vùng lân cận." },
  { year: "2026", event: "Phát triển hệ thống Hybrid cao cấp, mở rộng dịch vụ bảo trì và vận hành." },
];

const teamValues = [
  {
    icon: ShieldCheck,
    title: "Chất lượng hàng đầu",
    desc: "Chỉ sử dụng thiết bị từ các thương hiệu quốc tế uy tín: Canadian Solar, Huawei, Pylontech.",
  },
  {
    icon: Users,
    title: "Đội ngũ chuyên nghiệp",
    desc: "Kỹ thuật viên được đào tạo bài bản, giàu kinh nghiệm lắp đặt trong mọi điều kiện.",
  },
  {
    icon: Clock,
    title: "Bảo hành dài hạn",
    desc: "Cam kết bảo hành tấm pin 12 năm, inverter 10 năm. Hỗ trợ bảo trì trọn đời.",
  },
  {
    icon: Leaf,
    title: "Tư vấn tận tâm",
    desc: "Khảo sát miễn phí, tư vấn giải pháp phù hợp nhất với nhu cầu và ngân sách của khách hàng.",
  },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden h-[260px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]">
        <img
          src="/images/hero/hero-1.webp"
          alt="Điện mặt trời Nhật Minh"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative z-10 flex items-center h-full">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >

            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}


      {/* About Content */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
                Giới thiệu về Nhật Minh
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                Chuyên gia điện mặt trời tại Bắc Ninh
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Nhật Minh Công Nghệ Group</strong> là đơn vị chuyên cung cấp, tư vấn và lắp đặt hệ thống điện mặt trời tại Từ Sơn, Bắc Ninh và các tỉnh lân cận.
                </p>
                <p>
                  Với 8 năm kinh nghiệm trong lĩnh vực thiết bị điện và năng lượng sạch, chúng tôi đã hoàn thành hơn 500 dự án cho hộ gia đình, doanh nghiệp và nhà xưởng.
                </p>
                <p>
                  Nhật Minh cam kết mang đến giải pháp điện mặt trời tối ưu về chi phí, hiệu suất và độ bền — giúp khách hàng tiết kiệm điện năng, bảo vệ môi trường và tăng giá trị bất động sản.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=700&q=80"
                alt="Nhật Minh lắp đặt điện mặt trời"
                className="rounded-2xl shadow-xl w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-xl shadow-amber-500/25 hidden sm:block">
                <p className="text-3xl font-extrabold">8+</p>
                <p className="text-sm opacity-80">Năm kinh nghiệm</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 md:py-24 bg-slate-50">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
              Hành trình phát triển
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Lịch sử hình thành
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-10 pb-10 last:pb-0"
              >
                {/* Timeline line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-3.5 top-10 bottom-0 w-px bg-amber-200" />
                )}

                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>

                <div className="ml-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                    {item.year}
                  </span>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600 mb-3">
              Cam kết của chúng tôi
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Giá trị cốt lõi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamValues.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-5">
                    <Icon size={28} strokeWidth={1.7} />
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

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-amber-900 py-16 sm:py-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sun size={40} className="text-amber-400 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
              Sẵn sàng lắp đặt điện mặt trời?
            </h2>
            <p className="text-base text-white/70 mb-8 max-w-xl mx-auto">
              Liên hệ Nhật Minh ngay hôm nay để được khảo sát và báo giá miễn phí tại nhà.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0876906668"
                className="inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Phone size={20} />
                <span>0876 906 668</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1"
              >
                <span>Liên hệ tư vấn</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
