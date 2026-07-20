import { Phone, MessageCircle } from "lucide-react";

const FloatingContactButtons = () => {
  const buttons = [
    {
      label: "Zalo tư vấn",
      href: "https://zalo.me/0876906668",
      icon: MessageCircle,
      className: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40",
    },
    {
      label: "Gọi ngay",
      href: "tel:0876906668",
      icon: Phone,
      className: "bg-red-500 hover:bg-red-600 shadow-red-500/40",
    },
  ];

  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 z-50 flex flex-col gap-3">
      {buttons.map((button, index) => {
        const Icon = button.icon;

        return (
          <a
            key={button.label}
            href={button.href}
            target={button.href.startsWith("http") ? "_blank" : undefined}
            rel={button.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`
              group relative
              flex items-center gap-3
              min-w-[58px] md:min-w-[150px]
              h-[58px] md:h-[62px]
              px-4 md:px-5
              rounded-full
              text-white
              font-extrabold
              shadow-xl
              ${button.className}
              transition-all duration-300
              hover:-translate-y-1 hover:scale-105
              active:scale-95
            `}
          >
            {index === 0 && (
              <span className="absolute inset-0 rounded-full animate-ping bg-blue-500/30" />
            )}

            <span className="relative w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Icon size={24} strokeWidth={2.5} />
            </span>

            <span className="relative hidden md:block text-sm whitespace-nowrap">
              {button.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default FloatingContactButtons;