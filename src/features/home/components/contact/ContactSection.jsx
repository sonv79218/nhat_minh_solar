// ============================================
// CONTACT SECTION - UNIFIED DESIGN SYSTEM
// Seamless with consistent styling
// ============================================
import SectionEyebrow from "../common/SectionEyebrow";
import SocialIcon from "@/components/common/SocialIcon";
import {
  social as socialConfig,
  socialPlatforms,
} from "@/config/companyConfig";

const ContactSection = ({ companyInfo, companySocial }) => {
  if (!companyInfo) return null;

  // Ưu tiên dữ liệu truyền vào, fallback về cấu hình tập trung
  const resolvedSocial = { ...socialConfig, ...(companySocial || {}) };

  const socialLinks = socialPlatforms
    .map((platform) => ({
      ...platform,
      href: resolvedSocial[platform.key] || "",
    }))
    .filter((social) => Boolean(social.href));

  return (
    <section className="py-6 md:py-8">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto px-4 md:px-6">
        <SectionEyebrow label="Kết nối" className="mb-4" />

        <div className="text-center">
          <h3 className="text-sm md:text-base font-bold text-secondary mb-4">
            Theo dõi chúng tôi
          </h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} — mở trang mới`}
                title={social.label}
                className="
                  flex items-center gap-2 
                  px-4 py-2 md:py-2.5
                  bg-white rounded-full 
                  border border-slate-200
                  hover:shadow-sm hover:-translate-y-0.5
                  transition-all duration-200
                "
                style={{ color: social.color }}
              >
                <SocialIcon platform={social.key} size={18} />
                <span className="text-xs md:text-sm font-semibold text-secondary">
                  {social.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
