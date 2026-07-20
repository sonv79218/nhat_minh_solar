// ============================================
// FOOTER - ĐIỆN MẶT TRỜI NHẬT MINH
// Solar Energy Company Footer
// ============================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Phone,
  MapPin,
  Mail,
  Clock,
  BadgeCheck,
  Zap,
  ChevronDown,
} from "lucide-react";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const solutionsLinks = [
    { label: "Điện mặt trời gia đình", href: "/solar-home" },
    { label: "Điện mặt trời doanh nghiệp", href: "/solar-business" },
    { label: "Hệ thống Hybrid / Lưu trữ", href: "/solar-hybrid" },
    { label: "Bảo trì & Sửa chữa", href: "/maintenance" },
  ];

  const productLinks = [
    { label: "Tấm pin năng lượng mặt trời", href: "/products?category=solar-panel" },
    { label: "Inverter / Bộ biến tần", href: "/products?category=inverter" },
    { label: "Pin lưu trữ Lithium", href: "/products?category=battery" },
    { label: "Phụ kiện lắp đặt", href: "/products?category=accessories" },
  ];

  const supportLinks = [
    { label: "Chính sách & Điều khoản", href: "/chinh-sach" },
    { label: "Chính sách bảo hành" },
    { label: "Chính sách vận chuyển" },
    { label: "Hướng dẫn sử dụng" },
    { label: "Dịch vụ lắp đặt tại nhà" },
  ];

  const contactLinks = [
    { label: "Hotline: 0876 906 668", href: "tel:0876906668" },
    { label: "Kỹ thuật: 0972 131 477", href: "tel:0972131477" },
    { label: "Email: contact@nhatminh.vn", href: "mailto:contact@nhatminh.vn" },
    { label: "Zalo: 0876 906 668", href: "https://zalo.me/0876906668" },
  ];

  const footerSections = [
    { title: "GIẢI PHÁP", items: solutionsLinks },
    { title: "SẢN PHẨM", items: productLinks },
    { title: "HỖ TRỢ", items: supportLinks },
    { title: "LIÊN HỆ", items: contactLinks },
  ];

  const renderItem = (item) => {
    const baseClass =
      "hover:text-amber-400 transition-all duration-300 cursor-pointer text-sm block";
    if (item.href) {
      if (item.href.startsWith("http") || item.href.startsWith("mailto") || item.href.startsWith("tel") || item.href.startsWith("https")) {
        return (
          <a
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            className={baseClass}
          >
            {item.label}
          </a>
        );
      }
      return (
        <Link to={item.href} className={baseClass}>
          {item.label}
        </Link>
      );
    }
    return <span className={baseClass}>{item.label}</span>;
  };

  return (
    <>
      {/* DESKTOP FOOTER */}
      <footer className="hidden lg:block bg-slate-950 text-gray-300 border-t border-slate-800">
        <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-6 py-14">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full mb-10"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-white">
              8 năm kinh nghiệm — Điện mặt trời Từ Sơn, Bắc Ninh
            </span>
          </motion.div>

          <div className="grid grid-cols-4 gap-10">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white text-lg font-bold mb-5 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li key={index}>{renderItem(item)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 my-10" />

          <div className="grid lg:grid-cols-2 gap-8 text-sm">
            {/* Brand info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h4 className="text-white font-bold text-base">
                  Nhật Minh — Điện Mặt Trời
                </h4>
              </div>

              <div className="flex items-start gap-2 text-gray-400">
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <p>
                  Nhà số 01 ngõ Giếng Vàng, Khu phố Phù Lưu, Phường Từ Sơn,
                  Tỉnh Bắc Ninh, Việt Nam
                </p>
              </div>

              <div className="flex items-start gap-2 text-gray-400">
                <Clock size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <p>Giờ làm việc: 08:00 – 18:00, thứ Hai – Chủ nhật</p>
              </div>
            </div>

            {/* Company info */}
            <div className="space-y-3 text-gray-400">
              <p>
                <span className="text-white font-semibold">
                  CÔNG TY TNHH NHẬT MINH CÔNG NGHỆ GROUP
                </span>
              </p>
              <p>GPĐKKD: 2301374027 — MST: 2301374027</p>
              <p>
                Chuyên cung cấp, lắp đặt hệ thống điện mặt trời chất lượng cao
                tại Bắc Ninh và các tỉnh lân cận.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-6 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              © 2018 – 2026 Nhật Minh Công Nghệ Group. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-gray-500">
                Cam kết chất lượng — Bảo hành uy tín
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE FOOTER */}
      <footer className="lg:hidden bg-white text-slate-900 border-t border-slate-200">
        <div className="divide-y divide-slate-200">
          {footerSections.map((section) => {
            const isOpen = openSection === section.title;

            return (
              <div key={section.title}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(isOpen ? null : section.title)
                  }
                  className="w-full flex items-center justify-between px-4 py-5 text-left"
                >
                  <span className="text-sm font-extrabold tracking-wide">
                    {section.title}
                  </span>

                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <ul className="px-4 pb-5 space-y-3">
                    {section.items.map((item, index) => (
                      <li key={index}>{renderItem(item)}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950 px-4 py-6 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <h4 className="font-extrabold text-white">Nhật Minh — Điện Mặt Trời</h4>
          </div>

          <div className="space-y-2 text-sm text-gray-400 mb-4">
            <p className="flex items-center gap-2">
              <Phone size={13} className="text-amber-400 shrink-0" />
              <span>Hotline: 0876 906 668</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <span>Từ Sơn, Bắc Ninh</span>
            </p>
          </div>

          <p className="text-xs text-gray-500 leading-6">
            © 2018 – 2026 Nhật Minh Công Nghệ Group. GPĐKKD: 2301374027
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
