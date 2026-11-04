// ============================================
// LATEST ARTICLES SECTION (Trang chủ)
// Điện Mặt Trời Nhật Minh
// Hiển thị 3 bài viết mới nhất / nổi bật
// ============================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Loader2 } from "lucide-react";
import SectionEyebrow from "@/features/home/components/common/SectionEyebrow";
import ArticleCard from "@/features/articles/components/ArticleCard";
import {
  getPublishedArticles,
  getArticleCategories,
} from "@/services/articleService";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";

const LatestArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [published, cats] = await Promise.all([
          getPublishedArticles(),
          getArticleCategories(),
        ]);

        if (cancelled) return;

        // Ưu tiên: công trình nổi bật > bài nổi bật > bài mới nhất
        const projects = published.filter((a) => a.type === "project");
        const featured = published.filter(
          (a) => a.featured && a.type !== "project"
        );
        const rest = published.filter(
          (a) => !a.featured && a.type !== "project"
        );

        const picked = [...projects, ...featured, ...rest].slice(0, 3);

        setArticles(picked);
        if (cats?.length) setCategories(cats);
      } catch (e) {
        console.warn("[LatestArticlesSection] load failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Không hiển thị section nếu chưa có bài viết nào
  if (!loading && articles.length === 0) return null;

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div>
            <SectionEyebrow label="Công trình & Tin tức mới nhất" className="mb-5" />
            <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
              Cập nhật công trình điện mặt trời thực tế, kiến thức chuyên môn và
              giải pháp năng lượng sạch từ Nhật Minh.
            </p>
          </div>

          <Link
            to="/bai-viet"
            className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 sm:self-auto"
          >
            Xem tất cả bài viết
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-sm text-slate-400">Đang tải bài viết...</span>
          </div>
        )}

        {/* Grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ArticleCard article={article} categories={categories} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty fallback */}
        {!loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-14 text-center">
            <FileText size={26} className="text-slate-300" />
            <p className="text-sm text-slate-400">
              Bài viết sẽ được cập nhật sớm.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestArticlesSection;
