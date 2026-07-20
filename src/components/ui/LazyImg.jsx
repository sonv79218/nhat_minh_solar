import { useEffect, useRef, useState } from "react";

const LazyImg = ({ src, alt, className, style, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        backgroundColor: "#f3f4f6",
        ...style,
      }}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={loaded ? "opacity-100" : "opacity-0"}
          style={{
            transition: "opacity 0.4s ease",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImg;
