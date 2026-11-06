// ============================================
// FOOTER - ĐIỆN MẶT TRỜI NHẬT MINH
// Thiết kế hiện đại, tối giản: 1 layout responsive duy nhất,
// gọn chiều cao, typography rõ ràng, mobile chia khối 2 cột.
// ============================================

import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  BadgeCheck,
  Navigation,
} from "lucide-react";
import SocialLinks from "@/components/common/SocialLinks";
import { company, getDirectionsUrl } from "@/config/companyConfig";

const HEADING_CLASS =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-4";
const LINK_CLASS =
  "block text-[13px] leading-6 text-slate-400 hover:text-amber-400 transition-colors";

const Footer = () => {
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

  const linkGroups = [
    { title: "Giải pháp", items: solutionsLinks },
    // { title: "Sản phẩm", items: productLinks },
    // { title: "Hỗ trợ", items: supportLinks },
  ];

  const directionsUrl = getDirectionsUrl();

  const renderItem = (item) => {
    if (item.href) {
      const isExternal =
        item.href.startsWith("http") ||
        item.href.startsWith("mailto") ||
        item.href.startsWith("tel");
      if (isExternal) {
        return (
          <a
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            className={LINK_CLASS}
          >
            {item.label}
          </a>
        );
      }
      return (
        <Link to={item.href} className={LINK_CLASS}>
          {item.label}
        </Link>
      );
    }
    return <span className={LINK_CLASS}>{item.label}</span>;
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
 
<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

  {/* BRAND */}
  <div className="lg:col-span-3">
    <div className="flex items-center gap-2">
      <img src="/favicon.svg" alt="Logo" className="h-10 w-10 shrink-0" />
      <div className="leading-tight">
        <p className="text-[15px] font-bold text-white">{company.brand}</p>
        <p className="text-[11px] text-slate-500">{company.name}</p>
      </div>
    </div>

    <p className="mt-4 text-[13px] leading-6 text-slate-400">
      {company.description}
    </p>

    <div className="mt-5">
      <SocialLinks variant="dark" shape="icon" />
    </div>
  </div>

  {/* SOLUTIONS */}
  <nav className="lg:col-span-2" aria-label="Giải pháp">
    <h3 className={HEADING_CLASS}>Giải pháp</h3>
    <ul className="space-y-2.5">
      {solutionsLinks.map((item) => (
        <li key={item.label}>
          <Link to={item.href} className={LINK_CLASS}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>

  {/* CONTACT */}
  <div className="lg:col-span-3">
    <h3 className={HEADING_CLASS}>Liên hệ</h3>

    <ul className="space-y-3 text-[13px] leading-6 text-slate-400">
      <li>
        <a href={company.phones.hotline.href} className="flex items-center gap-2 hover:text-amber-400">
          <Phone size={14} className="shrink-0 text-amber-400" />
          {company.phones.hotline.display}
        </a>
      </li>
      <li>
        <a href={company.phones.technical.href} className="flex items-center gap-2 hover:text-amber-400">
          <Phone size={14} className="shrink-0 text-amber-400" />
          {company.phones.technical.display}
        </a>
      </li>
      <li>
        <a href={company.email.href} className="flex items-start gap-2 break-all hover:text-amber-400">
          <Mail size={14} className="mt-1 shrink-0 text-amber-400" />
          {company.email.display}
        </a>
      </li>
      <li className="flex items-start gap-2">
        <MapPin size={14} className="mt-1 shrink-0 text-amber-400" />
        <div>
          {company.address.short}
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <Navigation size={12} />
              Chỉ đường
            </a>
          )}
        </div>
      </li>
      <li className="flex items-start gap-2">
        <Clock size={14} className="mt-1 shrink-0 text-amber-400" />
        {company.workingHours}
      </li>
    </ul>
  </div>

  {/* GOOGLE MAPS */}
  <div className="lg:col-span-4">
    <h3 className={HEADING_CLASS}>Vị trí của chúng tôi</h3>

    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900">
      <iframe
        title="Bản đồ Nhật Minh Solar"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(company.address.short)}&output=embed`}
        width="100%"
        height="220"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>

    {directionsUrl && (
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400"
      >
        <Navigation size={13} />
        Xem chỉ đường trên Google Maps
      </a>
    )}
  </div>

</div>

        

        {/* BOTTOM BAR */}
        <div className="mt-9 border-t border-white/10 pt-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between text-[11px] leading-5 text-slate-500">
          <p>
            © 2018 – 2026 {company.name}. GPĐKKD: {company.businessId}
          </p>
          <p className="flex items-center gap-1.5">
            <BadgeCheck size={13} className="text-amber-400" />
            Cam kết chất lượng — Bảo hành uy tín
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
