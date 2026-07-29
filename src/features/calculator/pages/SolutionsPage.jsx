// ============================================
// SOLUTIONS LISTING PAGE — /solutions
// Điện Mặt Trời Nhật Minh
// 3 category cards: gia đình / doanh nghiệp / trang trại
// ============================================
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import { SOLUTION_CATEGORIES } from "@/features/home/components/pricing/pricingData";

const TargetTag = ({ text }) => (
  <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md">
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {text}
  </span>
);

const CategoryCard = ({ cat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.12 }}
    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    {/* Image */}
    <div className="relative aspect-[16/9] overflow-hidden">
      <img
        src={cat.image}
        alt={cat.label}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="inline-flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {cat.pkgCount} gói giải pháp
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-6">
      <h2 className="text-xl font-extrabold text-slate-900 leading-tight mb-3">
        {cat.label}
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
        {cat.description}
      </p>

      {/* Targets */}
      <div className="flex flex-wrap gap-2 mb-5">
        {cat.targets.map((t) => <TargetTag key={t} text={t} />)}
      </div>

      {/* CTA */}
      <Link
        to={cat.cta.href}
        className="flex items-center justify-center gap-2 h-11 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors shadow-sm"
      >
        <span>{cat.cta.label}</span>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  </motion.div>
);

const SolutionsPage = () => (
  <>
    {/* ── Category cards ── */}
    <section className="w-full bg-slate-50 py-12 sm:py-16">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
            3 nhóm giải pháp chính
          </h2>
          <p className="text-base text-slate-500">
            Chọn nhóm phù hợp với quy mô và nhu cầu sử dụng của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {SOLUTION_CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* ── Bottom CTA ── */}
    <section className="w-full bg-white py-12">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-[#0b1628] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1.5">
              Chưa chắc chắn giải pháp nào phù hợp?
            </h3>
            <p className="text-sm text-white/50">
              Sử dụng công cụ tính giải pháp miễn phí — chỉ 5 câu hỏi để nhận đề xuất cá nhân hóa.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/tinh-giai-phap"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
              Tính giải pháp
            </Link>
            <a
              href="tel:0876906668"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3 rounded-lg border border-white/20 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
              </svg>
              0876 906 668
            </a>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default SolutionsPage;
