// ============================================
// SEO HOOK
// Điện Mặt Trời Nhật Minh
// Quản lý document title, meta description, Open Graph, JSON-LD
// ============================================
import { useEffect } from "react";

const SITE_NAME = "Nhật Minh Điện Mặt Trời";
const SITE_URL = "https://nhatminhdienmattroi.com";

const setMeta = (attr, key, content) => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setLink = (rel, href) => {
  if (!href) return;

  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

/**
 * Cập nhật SEO cho trang
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.description]
 * @param {string} [options.image] - OG image
 * @param {string} [options.url] - Canonical URL (dạng đường dẫn tuyệt đối hoặc tương đối)
 * @param {string} [options.type] - "website" | "article"
 * @param {Object} [options.jsonLd] - Schema.org object
 */
export const useSeo = ({
  title,
  description,
  image,
  url,
  type = "website",
  jsonLd,
} = {}) => {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:url", url ? `${SITE_URL}${url}` : SITE_URL);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
    setLink("canonical", canonicalUrl);

    // JSON-LD
    const existing = document.getElementById("seo-jsonld");
    if (existing) existing.remove();

    if (jsonLdKey) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-jsonld";
      script.textContent = jsonLdKey;
      document.head.appendChild(script);
    }
  }, [title, description, image, url, type, jsonLdKey]);
};

export { SITE_URL, SITE_NAME };
