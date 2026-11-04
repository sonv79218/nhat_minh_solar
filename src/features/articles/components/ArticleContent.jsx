// ============================================
// ARTICLE CONTENT RENDERER
// Điện Mặt Trời Nhật Minh
// Render nội dung HTML của bài viết (đã lưu từ trình soạn thảo)
// ============================================
import { useMemo } from "react";

/**
 * Bổ sung thuộc tính lazy loading cho ảnh trong nội dung.
 */
const withLazyImages = (html) => {
  return String(html || "").replace(
    /<img\s+([^>]*?)>/gi,
    (match, attrs) => {
      if (/loading=/i.test(attrs)) return match;

      const withDecoding = attrs.replace(
        /decoding="[^"]*"/i,
        ""
      ).trim();

      return `<img ${withDecoding} loading="lazy" decoding="async">`;
    }
  );
};

const ArticleContent = ({ content }) => {
  const html = useMemo(() => withLazyImages(content), [content]);

  if (!content) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        Bài viết chưa có nội dung.
      </p>
    );
  }

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ArticleContent;
