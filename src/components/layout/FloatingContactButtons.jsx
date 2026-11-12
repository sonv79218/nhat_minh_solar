import { MapPin } from "lucide-react";
import { social, getMapViewUrl } from "@/config/companyConfig";

/**
 * Icon YouTube (SVG inline — phiên bản lucide-react hiện tại không export `Youtube`).
 * Dùng fillRule="evenodd" để khoét tam giác "play" khỏi khối chữ nhật bo góc.
 */


const YoutubeIcon = ({ size = 22 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
  </svg>
);

const ZaloIcon = ({ size = 22 }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 48 48"
    fill="none"
  >
    <path
      d="M24 3C12.4 3 3 11.3 3 21.5c0 5.7 2.9 10.8 7.5 14.1L8 44l10-4.1c2 .5 4 .8 6 .8 11.6 0 21-8.3 21-18.5S35.6 3 24 3Z"
      fill="white"
    />
    <text
      x="24"
      y="27"
      textAnchor="middle"
      fontSize="12"
      fontWeight="900"
      fill="#0068FF"
      fontFamily="Arial, sans-serif"
    >
      Zalo
    </text>
  </svg>
);


const TikTokIcon = ({ size = 30 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="white"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.18V2h-3.54v13.67a2.9 2.9 0 1 1-2.9-2.9c.17 0 .34.02.5.04v-3.6a6.44 6.44 0 1 0 5.94 6.56V10.4a8.3 8.3 0 0 0 4.86 1.56V8.42a4.85 4.85 0 0 1-1.09-.13Z" />
  </svg>
);


/**
 * Kiểm tra URL có hợp lệ để hiển thị hay không.
 * Nền tảng chưa cấu hình (chuỗi rỗng) => tự động ẩn nút.
 */
const isValidUrl = (value) => {
  if (!value || typeof value !== "string") return false;
  const url = value.trim();
  if (!url) return false;
  if (/^(mailto:|tel:)/i.test(url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const FloatingContactButtons = () => {
  const buttons = [
    {
      key: "address",
      label: "Địa chỉ",
      href: getMapViewUrl(),
      icon: MapPin,
      color: "bg-cyan-500",
      iconSize: 22,
    },
    {
      key: "zalo",
      label: "Zalo",
      href: social?.zalo,
      icon: ZaloIcon,
      color: "bg-blue-600",
      iconSize: 22,
    },
    {
      key: "youtube",
      label: "YouTube",
      href: social?.youtube,
      icon: YoutubeIcon,
      color: "bg-red-600",
      iconSize: 22,
      custom: true,
    },
    {
      key: "tiktok",
      label: "TikTok",
      href: social?.tiktok,
      icon: TikTokIcon,
      color: "bg-black",
      iconSize: 21,
      custom: true,
    },
  ];

  const visibleButtons = buttons.filter((button) => isValidUrl(button.href));

  if (visibleButtons.length === 0) return null;

  return (
    <div
      className="
        fixed z-[60]
        right-2 top-1/2 -translate-y-1/2
        sm:right-3 lg:right-4
        flex flex-col items-center
        gap-3 sm:gap-3.5
        rounded-2xl
        border border-slate-100
        bg-white
        px-2.5 py-3
        shadow-[0_8px_30px_rgba(15,23,42,0.12)]
      "
    >
      {visibleButtons.map((button) => {
        const Icon = button.icon;

        return (
          <a
            key={button.key}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.label}
            title={button.label}
            className="
              group
              flex w-[60px] flex-col items-center justify-center gap-1
              transition-transform duration-300 ease-out
              hover:-translate-y-1
              focus-visible:-translate-y-1
            "
          >
            <span
              className={`
                flex h-12 w-12
                items-center justify-center
                rounded-full
                text-white
                shadow-md
                transition-all duration-300 ease-out
                group-hover:scale-110
                group-hover:shadow-lg
                ${button.color}
              `}
            >
              {button.custom ? (
                <Icon size={button.iconSize} />
              ) : (
                <Icon size={button.iconSize} strokeWidth={2.2} />
              )}
            </span>

            <span
              className="
                whitespace-nowrap
                text-[11px] font-semibold leading-tight
                text-slate-700
                transition-colors duration-300
                group-hover:text-slate-900
              "
            >
              {button.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default FloatingContactButtons;
