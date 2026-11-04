// ============================================
// SOCIAL LINKS - NHẬT MINH SOLAR
// Danh sách liên kết mạng xã hội dùng chung (Footer, Trang Liên hệ)
// Dùng cấu hình tập trung: src/config/companyConfig.js
// ============================================
import SocialIcon from "@/components/common/SocialIcon";
import {
  getSocialLinksWithStatus,
  shouldShowPendingSocial,
} from "@/config/companyConfig";

/**
 * @param {Object} props
 * @param {"light" | "dark"} props.variant - nền sáng hay nền tối
 * @param {"icon" | "pill"} props.shape - kiểu hiển thị
 * @param {string} props.className - class cho thẻ bọc ngoài
 */
const SocialLinks = ({
  variant = "light",
  shape = "pill",
  className = "",
  showLabel = true,
}) => {
  const allLinks = getSocialLinksWithStatus();

  const links = shouldShowPendingSocial
    ? allLinks
    : allLinks.filter((link) => !link.pending);

  if (!links.length) return null;

  const isDark = variant === "dark";

  const baseClasses = () =>
    shape === "icon"
      ? `group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
          isDark
            ? "border-white/15 bg-white/5 text-gray-300 hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-400"
            : "border-slate-200 bg-white text-slate-600 hover:border-amber-500/40 hover:bg-amber-50 hover:text-amber-600"
        }`
      : `group flex items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
          isDark
            ? "border-white/15 bg-white/5 text-gray-300 hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-400"
            : "border-slate-200 bg-white text-slate-700 hover:border-amber-500/40 hover:bg-amber-50 hover:text-amber-600"
        }`;

  return (
    <div className={`flex flex-wrap items-center gap-2 md:gap-3 ${className}`}>
      {links.map((link) => {
        // Nền tảng chưa cấu hình URL: hiển thị dạng "chờ điền", không bấm được
        if (link.pending) {
          return (
            <span
              key={link.key}
              title={`${link.label} — chưa cấu hình URL (xem src/config/companyConfig.js)`}
              aria-disabled="true"
              className={`${baseClasses(link)} cursor-not-allowed border-dashed opacity-60 hover:translate-y-0 hover:shadow-none`}
            >
              <SocialIcon platform={link.key} size={shape === "icon" ? 18 : 17} />
              {shape !== "icon" && showLabel && (
                <span className="text-xs font-semibold md:text-sm">
                  {link.label}
                  <span className="ml-1 text-[10px] font-normal opacity-70">
                    (chờ điền)
                  </span>
                </span>
              )}
            </span>
          );
        }

        return (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label} — mở trang mới`}
            title={link.label}
            className={baseClasses(link)}
          >
            <SocialIcon platform={link.key} size={shape === "icon" ? 18 : 17} />
            {shape !== "icon" && showLabel && (
              <span className="text-xs font-semibold md:text-sm">{link.label}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
