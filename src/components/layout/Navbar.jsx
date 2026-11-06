import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, House, PanelsTopLeft, Phone, Sun, FileText } from "lucide-react";


import { TYPOGRAPHY } from "@/styles/designSystem";

const CLOSE_DELAY_MS = 150;

const solutionItems = [
  { label: "Tất cả giải pháp", href: "/solutions" },
  { label: "Điện mặt trời gia đình", href: "/solutions/solar-home" },
  { label: "Điện mặt trời doanh nghiệp", href: "/solutions/solar-business" },
  { label: "Điện mặt trời trang trại", href: "/solutions/solar-farm" },
];

const productItems = [
  {
    label: "Tấm pin năng lượng mặt trời",
    href: "/products?category=solar-panel",
  },
  { label: "Inverter / Bộ biến tần", href: "/products?category=inverter" },
  { label: "Pin lưu trữ Lithium", href: "/products?category=battery" },
  {
    label: "Phụ kiện lắp đặt",
    href: "/products?category=accessories",
  },
];

const desktopLinks = [
  // { label: "Dự án", href: "/projects" },
  { label: "Bài viết", href: "/bai-viet" },
  { label: "Tính giá", href: "/tinh-giai-phap" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const Dropdown = ({ items, onClose }) => (
  <div className="absolute left-0 top-full z-[999] mt-[17px] w-72 border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/60">
    {items.map((item) => (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClose}
        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-600"
      >
        <span>{item.label}</span>
        <span className="text-xs text-slate-400">›</span>
      </Link>
    ))}
  </div>
);

const MobileAccordion = ({
  title,
  icon: Icon,
  items,
  open,
  onToggle,
  onNavigate,
}) => (
  <div>
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        {title}
      </span>
      <ChevronDown
        size={17}
        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </button>

    {open && (
      <div className="ml-5 border-l border-slate-200 pl-3">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className="block rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  const closeTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();



  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/solutions") {
      return location.pathname === "/solutions" || location.pathname.startsWith("/solutions/");
    }
    if (path === "/products") {
      return location.pathname.startsWith("/products");
    }
    return location.pathname.startsWith(path);
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (menu) => {
    clearCloseTimer();
    setOpenDesktopMenu(menu);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenDesktopMenu(null);
    }, CLOSE_DELAY_MS);
  };

  const closeAllMenus = () => {
    clearCloseTimer();
    setOpenDesktopMenu(null);
    setIsMobileMenuOpen(false);
    setMobileSolutionsOpen(false);
    setMobileProductsOpen(false);
  };

  const handleGoHome = () => {
    closeAllMenus();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname, location.search]);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [],
  );

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-[1000] border-b border-slate-100 bg-white transition lg:relative"
        style={{
          boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,.08)" : "none",
        }}
      >
        <nav className="mx-auto flex h-[75px] max-w-[1200px] items-center justify-between gap-5 px-4 lg:px-6">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex shrink-0 cursor-pointer items-center gap-2.5"
            aria-label="Về trang chủ"
          >


<span className="flex flex-col text-left leading-none">
  <span
    className="whitespace-nowrap font-serif tracking-[-1.2px]"
    style={{
      fontFamily: "'Lora', Georgia, serif",
      fontSize: TYPOGRAPHY.logoFontSize,
      fontWeight: 500,
      lineHeight: 1,
    }}
  >
    <span className="text-[#193D56]">Nhật Minh </span>
    <span className="text-[#8EAF55]">Solar</span>
  </span>


</span>
          </button>

          <div className="hidden items-center lg:flex">
            <button
              type="button"
              onClick={handleGoHome}
              className={`px-3 py-2.5 text-[14px] font-medium transition-colors xl:px-4 xl:text-[15px] ${
                isActive("/")
                  ? "font-semibold text-amber-600"
                  : "text-slate-700 hover:text-amber-600"
              }`}
            >
              Trang chủ
            </button>

            <div
              className="relative"
              onMouseEnter={() => openMenu("solutions")}
              onMouseLeave={scheduleCloseMenu}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[14px] font-medium transition-colors xl:px-4 xl:text-[15px] ${
                  isActive("/solutions")
                    ? "font-semibold text-amber-600"
                    : "text-slate-700 hover:text-amber-600"
                }`}
              >
                Giải pháp
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openDesktopMenu === "solutions" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDesktopMenu === "solutions" && (
                <Dropdown items={solutionItems} onClose={closeAllMenus} />
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => openMenu("products")}
              onMouseLeave={scheduleCloseMenu}
            >
              {/* <Link
                to="/products"
                onClick={closeAllMenus}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-[14px] font-medium transition-colors xl:px-4 xl:text-[15px] ${
                  isActive("/products")
                    ? "font-semibold text-amber-600"
                    : "text-slate-700 hover:text-amber-600"
                }`}
              >
                Sản phẩm
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    openDesktopMenu === "products" ? "rotate-180" : ""
                  }`}
                />
              </Link> */}

              {openDesktopMenu === "products" && (
                <Dropdown items={productItems} onClose={closeAllMenus} />
              )}
            </div>

            {desktopLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeAllMenus}
                className={`px-3 py-2.5 text-[14px] font-medium transition-colors xl:px-4 xl:text-[15px] ${
                  isActive(item.href)
                    ? "font-semibold text-amber-600"
                    : "text-slate-700 hover:text-amber-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
     

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Mở menu"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 text-slate-800 lg:hidden"
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                <span className="block h-0.5 w-[22px] rounded bg-current" />
                <span className="block h-0.5 w-[22px] rounded bg-current" />
                <span className="block h-0.5 w-[22px] rounded bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed bottom-0 left-0 right-0 top-[75px] z-[999] overflow-y-auto bg-white transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mx-auto max-w-[1200px] p-5">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <House size={18} />
              Trang chủ
            </button>

            <MobileAccordion
              title="Giải pháp"
              icon={PanelsTopLeft}
              items={solutionItems}
              open={mobileSolutionsOpen}
              onToggle={() => setMobileSolutionsOpen((prev) => !prev)}
              onNavigate={closeAllMenus}
            />

            {/* <MobileAccordion
              title="Sản phẩm"
              icon={Package}
              items={productItems}
              open={mobileProductsOpen}
              onToggle={() => setMobileProductsOpen((prev) => !prev)}
              onNavigate={closeAllMenus}
            />

            <Link
              to="/projects"
              onClick={closeAllMenus}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <Sun size={18} />
              Dự án
            </Link> */}

<Link
  to="/tinh-giai-phap"
  onClick={closeAllMenus}
  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
    isActive("/tinh-giai-phap")
      ? "font-semibold text-amber-600 bg-amber-50"
      : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"
  }`}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <line x1="8" x2="8" y1="14" y2="18" />
    <line x1="8" x2="16" y1="14" y2="14" />
    <line x1="8" x2="16" y1="18" y2="18" />
  </svg>
  Tính giá Solar
</Link>
            {/* <Link
              to="/blogs"
              onClick={closeAllMenus}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <PanelsTopLeft size={18} />
              Tin tức
            </Link> */}

            <Link
              to="/bai-viet"
              onClick={closeAllMenus}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                isActive("/bai-viet")
                  ? "font-semibold text-amber-600 bg-amber-50"
                  : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"
              }`}
            >
              <FileText size={18} />
              Bài viết
            </Link>

            <Link
              to="/about"
              onClick={closeAllMenus}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <Sun size={18} />
              Giới thiệu
            </Link>

            <Link
              to="/contact"
              onClick={closeAllMenus}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-600"
            >
              <Phone size={18} />
              Liên hệ
            </Link>

          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 top-[75px] z-[998] bg-black/40 lg:hidden"
        />
      )}
    </>
  );
};

export default Navbar;