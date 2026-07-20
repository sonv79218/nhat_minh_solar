// ============================================
// PREMIUM BANNER SECTION COMPONENT - TAILWIND CSS
// Seamless landing page hero with gradient transition
// ============================================
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Floating Badge Component
const FloatingBadge = ({ text, icon }) => (
  <div className="
    flex items-center gap-1.5 px-2.5 py-1.5 md:px-4 md:py-2.5
    bg-white/15 backdrop-blur-md border border-white/20
    rounded-full text-white text-[11px] md:text-xs font-semibold
    shadow-lg shadow-black/20
    animate-bounce
    md:animate-none
    first:animate-bounce [animation-delay:0s]
    [&:nth-child(2)]:animate-bounce [animation-delay:0.5s]
    [&:nth-child(3)]:animate-bounce [animation-delay:1s]
  ">
    <span className="text-xs md:text-sm">{icon}</span>
    <span>{text}</span>
  </div>
);

// Dots Navigation
const BannerDots = ({ total, current, onChange }) => (
  <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-2.5 z-10">
    {Array.from({ length: total }).map((_, index) => (
      <button
        key={index}
        className={`
          w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border-none cursor-pointer p-0
          transition-all duration-300
          ${current === index
            ? "w-6 md:w-8 rounded-md bg-gradient-to-r from-blue-600 to-sky-500"
            : "bg-white/40 hover:bg-white/60"
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          onChange(index);
        }}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
);

// Navigation Arrows
const BannerArrows = ({ onPrev, onNext }) => (
  <>
    <button
      onClick={onPrev}
      aria-label="Previous slide"
      className="
        hidden md:flex
        absolute left-4 xl:left-5 top-1/2 -translate-y-1/2 z-20
        p-2 text-white
        opacity-70 hover:opacity-100
        transition-all duration-300 hover:scale-125
      "
    >
      <svg className="w-7 h-7 xl:w-8 xl:h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <button
      onClick={onNext}
      aria-label="Next slide"
      className="
        hidden md:flex
        absolute right-4 xl:right-5 top-1/2 -translate-y-1/2 z-20
        p-2 text-white
        opacity-70 hover:opacity-100
        transition-all duration-300 hover:scale-125
      "
    >
      <svg className="w-7 h-7 xl:w-8 xl:h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </>
);

const BannerSection = ({ banners, current, setCurrent, className = "" }) => {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Responsive height - used when parent doesn't set h-full
  const isFullHeight = className.includes("h-full");

  const handleSlideChange = (newIndex) => {
    if (newIndex === current || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrent(newIndex);
      setTimeout(() => setIsTransitioning(false), 80);
    }, 300);
  };

  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (current + 1) % banners.length;
      handleSlideChange(nextIndex);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners, banners?.length, current]);

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIndex = (current - 1 + banners.length) % banners.length;
    handleSlideChange(newIndex);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIndex = (current + 1) % banners.length;
    handleSlideChange(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      const nextIndex = (current + 1) % banners.length;
      handleSlideChange(nextIndex);
    }

    if (distance < -minSwipeDistance) {
      const prevIndex = (current - 1 + banners.length) % banners.length;
      handleSlideChange(prevIndex);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleBannerClick = () => {
    const banner = banners[current];

    if (banner?.link) {
      if (banner.link.startsWith("/")) {
        navigate(banner.link);
      } else {
        window.location.href = banner.link;
      }
    }
  };

  if (!banners || banners.length === 0) {
    return (
      <section className={`relative w-full ${className}`}>
        <div className={`
          relative w-full overflow-hidden
          ${isFullHeight ? "h-full" : "h-[260px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]"}
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-700" />
        </div>
      </section>
    );
  }

  const currentBanner = banners[current];

  return (
    <section className={`relative w-full ${className}`}>
      {/* Banner Wrapper */}
      <div
        className={`
          relative w-full overflow-hidden cursor-pointer
          select-none
          ${isFullHeight ? "h-full" : "h-[260px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]"}
        `}
        onClick={handleBannerClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Glow Effect */}
        <div className="
          absolute -top-1/2 -left-1/4
          w-[150%] h-[200%]
          pointer-events-none z-10
          animate-[glowPulse_8s_ease-in-out_infinite]
          bg-[radial-gradient(ellipse_at_30%_50%,rgba(37,99,235,0.15)_0%,transparent_50%)]
        " />

        {/* Banner Image */}
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className={`
            absolute inset-0 w-full h-full
            object-cover object-center z-0
            transition-all duration-[350ms]
            ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isHovered ? "scale-105" : "scale-100"}
            ${isTransitioning ? "opacity-40 scale-[1.02]" : "opacity-100"}
          `}
          draggable="false"
        />

        {/* Overlay Gradient */}
        {/* <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-900/80 via-slate-900/30 to-transparent" /> */}

        {/* Mobile gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 md:hidden bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50 z-30 pointer-events-none" />

        {/* Badges */}
        <div className="
          absolute top-4 right-4 md:top-6 md:right-6
          flex flex-col gap-2 md:gap-2.5 z-30
          md:flex-row md:flex-wrap md:max-w-[50%]
          justify-end
        ">
          {currentBanner.badges?.map((badge, index) => (
            <FloatingBadge key={index} text={badge.text} icon={badge.icon} />
          ))}
        </div>

        {/* Content */}
        <div className="
          absolute top-1/2 left-5 sm:left-6 md:left-8 xl:left-20
          -translate-y-1/2 z-40
          max-w-[90%] sm:max-w-[500px] md:max-w-[580px] lg:max-w-[600px]
          animate-[fadeInUp_0.6s_ease-out]
          md:text-center md:left-1/2 md:right-auto md:translate-x-0 md:translate-y-[-50%]
          md:max-w-full md:px-6
          text-center
        ">
          <h1 className="
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px]
            font-extrabold text-white
            leading-tight tracking-tight
            mb-1.5 md:mb-4
          ">
            {currentBanner.title?.split(" ").map((word, index, arr) => {
              const isHighlight = currentBanner.highlightWords?.some((hw) =>
                word.toLowerCase().includes(hw.toLowerCase())
              );

              return (
                <span key={index}>
                  <span className={isHighlight ? "text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" : ""}>
                    {word}
                  </span>
                  {index < arr.length - 1 && " "}
                </span>
              );
            })}
          </h1>

          <p className="
            hidden md:block
            text-sm md:text-base lg:text-lg
            text-white/80
            leading-relaxed
            mb-4 md:mb-6 lg:mb-7
            max-w-[420px]
          ">
            {currentBanner.subtitle}
          </p>
        </div>

        {/* Navigation */}
        {banners.length > 1 && (
          <>
            <BannerDots
              total={banners.length}
              current={current}
              onChange={handleSlideChange}
            />
            <BannerArrows onPrev={handlePrev} onNext={handleNext} />
          </>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
