// ============================================
// PROJECTS SECTION - SHOWCASE COMPLETED WORKS
// NHAT MINH Smart Home
// ============================================
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ============================================
// MOCK PROJECT DATA
// ============================================
const PROJECTS_DATA = [
  {
    id: 1,
    name: "Smart Home Villa Vinhomes Ocean Park",
    location: "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    type: "villa",
    description: "Hệ thống nhà thông minh toàn diện với smart lighting, điều khiển điều hòa, camera an ninh và automations.",
    tags: ["Smart Lighting", "Security System", "Automation"],
    status: "completed",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Hệ thống nhà thông minh chung cư Times City",
    location: "Times City, Hai Bà Trưng, Hà Nội",
    type: "apartment",
    description: "Triển khai IoT cho căn hộ 3 phòng ngủ với cảm biến thông minh, công tắc WiFi và hub điều khiển trung tâm.",
    tags: ["IoT Integration", "Smart Sensors", "Automation"],
    status: "completed",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Smart Security cho biệt thự Ecopark",
    location: "Ecopark, Văn Giang, Hưng Yên",
    type: "villa",
    description: "Giải pháp an ninh thông minh với camera AI, khóa cửa thông minh, chuông hình và cảnh báo 24/7.",
    tags: ["Security System", "Smart Sensors", "IoT Integration"],
    status: "completed",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Hệ thống điều khiển ánh sáng tự động văn phòng Hà Đông",
    location: "Tòa nhà văn phòng Hà Đông, Hà Nội",
    type: "office",
    description: "Smart lighting với cảm biến hiện diện, điều khiển theo lịch và tiết kiệm 40% điện năng chiếu sáng.",
    tags: ["Smart Lighting", "Automation", "Energy Management"],
    status: "completed",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Giải pháp IoT cho nhà thông minh Gia Lâm",
    location: "Khu đô thị Gia Lâm, Hà Nội",
    type: "residential",
    description: "Nhà phố thông minh với hệ sinh thái Xiaomi, tích hợp đèn, quạt, điều hòa và robot hút bụi.",
    tags: ["IoT Integration", "Smart Sensors", "Automation"],
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Smart Building Penthouse Central Park",
    location: "Central Park, Quận Bình Thạnh, TP.HCM",
    type: "apartment",
    description: "Penthouse cao cấp với hệ thống smarthome đồng bộ, điều khiển bằng giọng nói và app di động.",
    tags: ["Smart Lighting", "Security System", "Automation"],
    status: "deployed",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
];

// ============================================
// FILTER TABS DATA
// ============================================
const FILTER_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "residential", label: "Nhà ở" },
  { id: "villa", label: "Biệt thự" },
  { id: "office", label: "Văn phòng" },
];

// ============================================
// STATUS CONFIG
// ============================================
const STATUS_CONFIG = {
  completed: {
    label: "Hoàn thành",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    dotColor: "bg-emerald-500",
  },
  deployed: {
    label: "Đã triển khai",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
  },
  ongoing: {
    label: "Đang thực hiện",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    dotColor: "bg-amber-500",
  },
};

// ============================================
// ICONS
// ============================================
const Icons = {
  MapPin: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Office: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

// ============================================
// PROJECT CARD COMPONENT
// ============================================
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.completed;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bgColor}`}>
          <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`} />
          <span className={`text-xs font-semibold ${status.textColor}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-2">
          <Icons.MapPin />
          <span className="truncate">{project.location}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-50 text-primary-600 font-semibold text-sm rounded-xl hover:bg-primary-100 transition-colors">
          Xem chi tiết
          <Icons.ArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// PROJECTS SECTION COMPONENT
// ============================================
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Filter projects based on active filter
  const filteredProjects = activeFilter === "all"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((project) => project.type === activeFilter);

  // Get icon for filter tab
  const getFilterIcon = (id) => {
    switch (id) {
      case "residential":
        return <Icons.Home />;
      case "villa":
        return <Icons.Building />;
      case "office":
        return <Icons.Office />;
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
            <Icons.Building />
            Thành tựu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Các công trình đã làm
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Những dự án Smart Home và giải pháp IoT mà NHAT MINH đã triển khai cho khách hàng.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-200
                ${activeFilter === tab.id
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600"
                }
              `}
            >
              {getFilterIcon(tab.id)}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Icons.Building />
            </div>
            <p className="text-slate-500">Không có dự án nào trong danh mục này.</p>
          </div>
        )}

        {/* View All Button */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
              Xem tất cả dự án
              <Icons.ArrowRight />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
