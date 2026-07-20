// ============================================
// FEATURES BAR - UNIFIED DESIGN SYSTEM
// Seamless with consistent styling
// ============================================
import {
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCcw,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Miễn phí ship",
    subtitle: "Từ 500K",
  },
  {
    icon: ShieldCheck,
    title: "Chính hãng",
    subtitle: "Bảo hành rõ ràng",
  },
  {
    icon: Headphones,
    title: "Tư vấn nhanh",
    subtitle: "Hỗ trợ kỹ thuật",
  },
  {
    icon: RefreshCcw,
    title: "Đổi trả",
    subtitle: "Trong 7 ngày",
  },
];

const FeaturesBar = () => {
  return (
    <section className="py-8 md:py-10">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="
                  flex items-center gap-3
                  p-3 md:p-4
                  rounded-xl
                  bg-white
                  border border-slate-200
                  hover:shadow-sm hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                <div
                  className="
                    w-10 h-10 md:w-11 md:h-11
                    rounded-lg
                    bg-slate-900
                    text-white
                    flex items-center justify-center
                    shrink-0
                  "
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] md:text-xs text-slate-500 leading-tight mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
