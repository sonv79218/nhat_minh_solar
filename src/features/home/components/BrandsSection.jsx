// ============================================
// BRANDS SECTION - HomePage
// Điện Mặt Trời Nhật Minh
// ============================================
import { motion } from "framer-motion";
import SectionEyebrow from "./common/SectionEyebrow";

const BRANDS = [
  {
    name: "LONGi",
    logo: "/brands/longi.webp",
    fallback: "LG",
    color: "from-orange-500 to-red-500",
    url: "https://www.longi.com",
  },
  {
    name: "Jinko Solar",
    logo: "/brands/jinko.webp",
    fallback: "JK",
    color: "from-blue-500 to-cyan-500",
    url: "https://www.jinkosolar.com",
  },
  {
    name: "JA Solar",
    logo: "/brands/ja-solar.webp",
    fallback: "JA",
    color: "from-blue-600 to-indigo-500",
    url: "https://www.jasolar.com",
  },
  {
    name: "Huawei",
    logo: "/brands/huawei.webp",
    fallback: "HW",
    color: "from-red-500 to-orange-500",
    url: "https://www.huawei.com",
  },
  {
    name: "Sungrow",
    logo: "/brands/sungrow.webp",
    fallback: "SG",
    color: "from-green-500 to-emerald-500",
    url: "https://www.sungrowpower.com",
  },

  {
    name: "Deye",
    logo: "/brands/deye.webp",
    fallback: "DY",
    color: "from-violet-500 to-purple-500",
    url: "https://www.deyeinverter.com",
  },

];

const BrandsSection = () => {
  return (
    <section className="py-14 sm:py-16 md:py-20 bg-white">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionEyebrow label="Thương hiệu đối tác" className="mb-8 md:mb-10" />



        {/* Brands grid */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="
    grid
    grid-cols-3
    gap-2.5
    sm:grid-cols-3
    sm:gap-4
    md:grid-cols-6
    md:gap-5
  "
>
  {BRANDS.map((brand, index) => (
    <motion.a
      key={brand.name}
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="
        group
        flex
        h-[62px]
        min-w-0
        items-center
        justify-center
        overflow-hidden
        rounded-xl
        border
        border-slate-100
        bg-white
        px-2
        transition-all
        duration-300
        hover:border-slate-300
        hover:shadow-md

        sm:h-[72px]
        sm:rounded-2xl
        sm:px-3

        md:h-[82px]
      "
    >
      <img
        src={brand.logo}
        alt={brand.name}
        loading="lazy"
        className="
          max-h-7
          max-w-full
          w-auto
          object-contain
          transition-transform
          duration-300
          group-hover:scale-105

          sm:max-h-9
          md:max-h-11
        "
      />
    </motion.a>
  ))}
</motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs sm:text-sm text-slate-400 mt-8"
        >
          Tất cả thiết bị được nhập khẩu chính hãng, có đầy đủ CO/CQ và bảo hành từ nhà sản xuất.
        </motion.p>
      </div>
    </section>
  );
};

export default BrandsSection;
