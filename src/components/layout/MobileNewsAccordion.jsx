import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const newsItems = [
  { to: "/guides", label: "Hướng dẫn" },
  { to: "/projects", label: "Công trình" },
  { to: "/blogs", label: "Bài viết" },
  { to: "/solutions", label: "Giải pháp" },
];

const MobileNewsAccordion = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  const isItemActive = (path) => location.pathname === path;

return (
  <div className="overflow-hidden rounded-xl">
<button
  type="button"
  onClick={handleToggle}
  className={`
    flex w-full items-center gap-3 rounded-xl px-4 py-3
    text-left text-[15px] font-medium transition-all duration-200
    ${
      isOpen
        ? "bg-blue-50 text-blue-600"
        : "bg-transparent text-slate-700"
    }
  `}
>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>

      <span className="flex-1">Tin tức</span>

      <ChevronDown
        size={18}
        className={`shrink-0 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="overflow-hidden"
        >
          <div className="mt-1 space-y-1 rounded-xl bg-slate-50 p-2">
            {newsItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleItemClick}
                className={`
                  block rounded-lg px-4 py-2.5 pl-11
                  text-sm font-medium no-underline
                  transition-all duration-200
                  ${
                    isItemActive(item.to)
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-blue-600"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};

export default MobileNewsAccordion;
