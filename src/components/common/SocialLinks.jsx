
import SocialIcon from "@/components/common/SocialIcon";
import {
  getSocialLinksWithStatus,
  shouldShowPendingSocial,
} from "@/config/companyConfig";

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
  const isIcon = shape === "icon";

  const wrapperClasses = isDark
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200/80 bg-white";

  const itemClasses = isDark
    ? "border-white/10 bg-white/[0.05] text-gray-300 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300"
    : "border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700";

  const iconBackground = isDark
    ? "bg-white/[0.08]"
    : "bg-slate-100 group-hover:bg-amber-100";

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 ${className}`}
    >
      {links.map((link) => {
        const content = (
          <>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                isDark
                  ? "bg-white/[0.08] group-hover:bg-amber-400/15"
                  : "bg-slate-100 group-hover:bg-amber-100"
              }`}
            >
              <SocialIcon
                platform={link.key}
                size={isIcon ? 19 : 18}
              />
            </span>

            {!isIcon && showLabel && (
              <span className="flex flex-col items-start">
                <span className="text-sm font-semibold leading-tight">
                  {link.label}
                </span>

                {link.pending && (
                  <span className="mt-0.5 text-[10px] font-normal opacity-60">
                    Chưa cấu hình
                  </span>
                )}
              </span>
            )}
          </>
        );

        const commonClasses = `
          group inline-flex items-center gap-2
          border transition-all duration-300 ease-out
          ${
            isIcon
              ? "h-11 w-11 justify-center rounded-full"
              : "rounded-full py-1.5 pl-1.5 pr-4"
          }
          ${itemClasses}
          ${
            link.pending
              ? "cursor-not-allowed border-dashed opacity-50"
              : "cursor-pointer hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
          }
        `;

        if (link.pending) {
          return (
            <span
              key={link.key}
              title={`${link.label} — chưa cấu hình URL`}
              aria-disabled="true"
              className={commonClasses}
            >
              {content}
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
            className={commonClasses}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
