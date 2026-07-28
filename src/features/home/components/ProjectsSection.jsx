// ============================================
// PROJECTS SECTION - IMAGE-FIRST DESIGN
// Điện Mặt Trời Nhật Minh
// Premium dark-themed gallery matching heropower.vn style
// ============================================
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Zap, LayoutGrid, Home, Building2, Warehouse } from "lucide-react";

// ============================================
// MOCK PROJECT DATA (solar energy themed)
// ============================================
const PROJECTS_DATA = [
  {
    id: 1,
    name: "Điện mặt trời hòa lưới 10kW",
    location: "Từ Sơn, Bắc Ninh",
    type: "villa",
    capacity: "10kW",
    status: "completed",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop",
  },
  {
    id: 2,
    name: "Hệ thống Hybrid 8kW cho nhà phố",
    location: "Thuận Thành, Bắc Ninh",
    type: "residential",
    capacity: "8kW",
    status: "completed",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&h=500&fit=crop",
  },
  {
    id: 3,
    name: "Điện mặt trời 50kW cho nhà xưởng",
    location: "KCN Yên Phong, Bắc Ninh",
    type: "office",
    capacity: "50kW",
    status: "completed",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop",
  },
  {
    id: 4,
    name: "Hệ thống Hybrid 5kW biệt thự",
    location: "Từ Sơn, Bắc Ninh",
    type: "villa",
    capacity: "5kW",
    status: "completed",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&h=500&fit=crop",
  },
  {
    id: 5,
    name: "Điện mặt trời 20kW cho trang trại",
    location: "Lương Tài, Bắc Ninh",
    type: "residential",
    capacity: "20kW",
    status: "ongoing",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=500&fit=crop",
  },
  {
    id: 6,
    name: "Hệ thống điện mặt trời 30kW văn phòng",
    location: "TP. Bắc Ninh",
    type: "office",
    capacity: "30kW",
    status: "deployed",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=500&fit=crop",
  },
];

// ============================================
// FILTER TABS
// ============================================
const FILTER_TABS = [
  { id: "all", label: "Tất cả", icon: LayoutGrid },
  { id: "villa", label: "Biệt thự", icon: Building2 },
  { id: "residential", label: "Nhà ở", icon: Home },
  { id: "office", label: "Doanh nghiệp", icon: Warehouse },
];

// ============================================
// STATUS CONFIG
// ============================================
const STATUS_CONFIG = {
  completed: { label: "Hoàn thành", bg: "bg-emerald-500", text: "text-white" },
  deployed: { label: "Đã triển khai", bg: "bg-blue-500", text: "text-white" },
  ongoing: { label: "Đang thi công", bg: "bg-amber-500", text: "text-white" },
};

// ============================================
// PROJECT CARD
// ============================================
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.completed;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ minHeight: "460px" }}
    >
      {/* Image — fills ~90% of card */}
      <img
        src={project.image}
        alt={project.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient overlay — bottom 55% */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1628]/95 via-[#0b1628]/40 to-transparent" />

      {/* Top-right capacity badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0b1628]/70 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
        <Zap size={12} className="text-green-400" />
        <span className="text-xs font-bold text-white">{project.capacity}</span>
      </div>

      {/* Bottom-left status badge */}
      <div className="absolute top-4 left-4">
        <div className={`${status.bg} ${status.text} text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
          {status.label}
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
          <MapPin size={12} className="shrink-0" />
          <span>{project.location}</span>
        </div>

        {/* Project name */}
        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-4 group-hover:text-green-400 transition-colors duration-300">
          {project.name}
        </h3>

        {/* View button */}
        <div className="flex items-center gap-2 text-xs font-bold text-green-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Xem chi tiết</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-green-500/40 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

// ============================================
// PROJECTS SECTION
// ============================================
const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.type === activeFilter);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#0b1628] overflow-hidden">
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <LayoutGrid size={13} />
              <span>Dự án của chúng tôi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Những công trình đã hoàn thành
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors shrink-0 group"
          >
            <span>Xem tất cả dự án</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2.5 mb-8 md:mb-10"
        >
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  isActive
                    ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                    : "bg-[#0f1b2d] text-white/60 border-[#1a2a40] hover:border-green-500/40 hover:text-green-400"
                }`}
              >
                <Icon size={15} strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid — 3 columns, large cards */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0f1b2d] flex items-center justify-center mb-4">
              <LayoutGrid size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">Không có dự án nào trong danh mục này.</p>
          </div>
        )}

        {/* View All Button */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 md:mt-14 flex justify-center"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 text-sm group"
            >
              <span>Xem tất cả dự án</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
