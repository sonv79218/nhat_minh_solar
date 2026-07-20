// ============================================
// POLICY PAGE
// Chính sách & Điều khoản
// ============================================
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Truck,
  ClipboardCheck,
  Shield,
  RefreshCw,
  Lock,
  Wrench,
  FileText,
  Phone,
  MapPin,
  Mail,
  ChevronRight,
  ScrollText,
} from "lucide-react";

const POLICY_SECTIONS = [
  {
    id: "thanh-toan",
    title: "Chính sách thanh toán",
    icon: CreditCard,
    content: [
      "Thanh toán tiền mặt khi nhận hàng.",
      "Chuyển khoản ngân hàng.",
      "Thanh toán theo thỏa thuận đối với công trình và dự án.",
    ],
  },
  {
    id: "van-chuyen",
    title: "Chính sách vận chuyển",
    icon: Truck,
    content: [
      "Giao hàng toàn quốc.",
      "Thời gian giao hàng từ 1–5 ngày tùy khu vực.",
      "Thời gian có thể thay đổi do thời tiết hoặc đơn vị vận chuyển.",
    ],
  },
  {
    id: "kiem-hang",
    title: "Chính sách kiểm hàng",
    icon: ClipboardCheck,
    content: [
      "Khách hàng được kiểm tra tình trạng sản phẩm khi nhận hàng.",
      "Nếu phát hiện lỗi hoặc thiếu hàng, vui lòng liên hệ ngay với chúng tôi.",
    ],
  },
  {
    id: "bao-hanh",
    title: "Chính sách bảo hành",
    icon: Shield,
    content: [
      "Sản phẩm được bảo hành theo chính sách của nhà sản xuất.",
      "Thời gian bảo hành tùy từng thương hiệu và sản phẩm.",
      "Không áp dụng bảo hành đối với sản phẩm hư hỏng do tác động bên ngoài hoặc sử dụng sai cách.",
    ],
  },
  {
    id: "doi-tra",
    title: "Chính sách đổi trả",
    icon: RefreshCw,
    content: [
      "Hỗ trợ đổi trả đối với sản phẩm lỗi từ nhà sản xuất.",
      "Sản phẩm cần còn nguyên tem, phụ kiện và hóa đơn (nếu có).",
      "Không áp dụng đổi trả với sản phẩm hư hỏng do người sử dụng.",
    ],
  },
  {
    id: "bao-mat",
    title: "Chính sách bảo mật thông tin",
    icon: Lock,
    content: [
      "Thu thập thông tin phục vụ tư vấn, giao hàng và bảo hành.",
      "Không chia sẻ thông tin khách hàng cho bên thứ ba nếu không có sự đồng ý của khách hàng hoặc yêu cầu của cơ quan có thẩm quyền.",
      "Cam kết bảo vệ dữ liệu khách hàng.",
    ],
  },
  {
    id: "lap-dat",
    title: "Dịch vụ lắp đặt",
    icon: Wrench,
    content: [
      "Hỗ trợ khảo sát và tư vấn giải pháp nhà thông minh.",
      "Cung cấp dịch vụ lắp đặt và cấu hình thiết bị tận nơi.",
      "Hỗ trợ kỹ thuật trong quá trình sử dụng.",
    ],
  },
  {
    id: "dieu-khoan",
    title: "Điều khoản sử dụng",
    icon: FileText,
    content: [
      "Khách hàng có trách nhiệm cung cấp thông tin chính xác khi liên hệ hoặc đặt hàng.",
      "Website có quyền cập nhật nội dung và chính sách khi cần thiết.",
      "Việc tiếp tục sử dụng website đồng nghĩa với việc chấp nhận các điều khoản hiện hành.",
    ],
  },
];

const TableOfContents = ({ sections, activeSection }) => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-[80px]">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <ScrollText size={16} strokeWidth={2.5} className="text-blue-600 shrink-0" />
        <h3 className="text-sm font-bold text-slate-800">Mục lục</h3>
      </div>
      <ul className="py-3 px-2 max-h-[400px] overflow-y-auto">
        {sections.map(({ id, title }, index) => {
          const isActive = activeSection === id;
          return (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`
                  w-full text-left flex items-start gap-2 py-2 px-3 rounded-xl
                  text-xs font-medium transition-all duration-150
                  ${isActive
                    ? "bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-500"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }
                `}
              >
                <span className={`shrink-0 mt-0.5 ${isActive ? "text-blue-500" : "text-slate-300"}`}>
                  {index + 1}.
                </span>
                <span className="leading-snug">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const PolicyCard = ({ section, index }) => {
  const Icon = section.icon;
  return (
    <section
      id={section.id}
      className="scroll-mt-24 bg-white rounded-2xl border border-slate-200 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-blue-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Phần {index + 1}</span>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {section.title}
          </h2>
        </div>
      </div>
      <ul className="space-y-3">
        {section.content.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-sm md:text-base text-slate-600 leading-relaxed">
            <ChevronRight size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const ContactBox = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-blue-500/20">
      <h3 className="text-xl md:text-2xl font-bold mb-6">
        Liên hệ với chúng tôi
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Tên đơn vị</p>
            <p className="font-bold">Nhật Minh Smart Home</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Phone size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Hotline</p>
            <a href="tel:0876906668" className="font-bold hover:underline">
              0876.906.668
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Kỹ thuật</p>
            <a href="tel:0972131477" className="font-bold hover:underline">
              0972.131.477
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Email</p>
            <a href="mailto:info@nhatminhsmarthome.vn" className="font-bold hover:underline break-all">
              info@nhatminhsmarthome.vn
            </a>
          </div>
        </div>

        <div className="sm:col-span-2 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-100">Địa chỉ</p>
            <p className="font-medium leading-snug">
              Nhà số 01 ngõ Giếng Vàng, Khu phố Phù Lưu, Phường Từ Sơn, Tỉnh Bắc Ninh, Việt Nam
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <Link
          to="/about"
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
        >
          <Phone size={18} />
          Liên hệ ngay
        </Link>
      </div>
    </div>
  );
};

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState(POLICY_SECTIONS[0]?.id || "");
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    );

    POLICY_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-5 md:px-8 py-10 md:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4">
              <ScrollText size={13} strokeWidth={2.5} />
              Thông tin
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Chính sách & Điều khoản
            </h1>
            <p className="mt-3 text-base md:text-lg text-slate-600 leading-relaxed">
              Cập nhật ngày 10/06/2026. Tìm hiểu các chính sách về thanh toán, vận chuyển, bảo hành và đổi trả của Nhật Minh Smart Home.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 xl:gap-10">
            {/* Main Content */}
            <div className="space-y-6">
              {POLICY_SECTIONS.map((section, index) => (
                <PolicyCard key={section.id} section={section} index={index} />
              ))}

              {/* Contact Box */}
              <ContactBox />
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:flex flex-col gap-6">
              <TableOfContents sections={POLICY_SECTIONS} activeSection={activeSection} />

              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={18} className="text-cyan-400" />
                  <h4 className="font-bold">Tư vấn nhanh</h4>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  Gọi ngay để được hỗ trợ về sản phẩm và dịch vụ
                </p>
                <a
                  href="tel:0876906668"
                  className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-center rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  0876.906.668
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PolicyPage;
