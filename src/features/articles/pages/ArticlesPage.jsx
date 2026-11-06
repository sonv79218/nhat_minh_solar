// ============================================
// ARTICLES LIST PAGE
// Điện Mặt Trời Nhật Minh
// Trang /bai-viet — danh sách bài viết & công trình điện mặt trời
// ============================================
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import ArticleCard from "@/features/articles/components/ArticleCard";
import Pagination from "@/components/common/Pagination";
import { getPublishedArticles, getArticleCategories } from "@/services/articleService";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const PAGE_SIZE = 9;

const PAGE_TITLE = "Kiến thức & Công trình điện mặt trời";
const PAGE_DESCRIPTION =
  "Cập nhật những công trình điện mặt trời thực tế, kiến thức chuyên môn và giải pháp năng lượng sạch từ Nhật Minh.";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useSeo({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/bai-viet",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: `${SITE_URL}/bai-viet`,
      isPartOf: {
        "@type": "WebSite",
        name: "Nhật Minh Điện Mặt Trời",
        url: SITE_URL,
      },
    },
  });

  // Load danh mục
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getArticleCategories();
        if (!cancelled && data?.length) setCategories(data);
      } catch (e) {
        console.warn("[ArticlesPage] categories failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load bài viết
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPublishedArticles({
          category: activeCategory === "all" ? undefined : activeCategory,
        });

        if (!cancelled) setArticles(data);
      } catch (e) {
        console.error("[ArticlesPage] load failed:", e);
        if (!cancelled) setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, reloadKey]);

  // Reset về trang 1 khi đổi danh mục
  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));

  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return articles.slice(start, start + PAGE_SIZE);
  }, [articles, currentPage]);

  // Đếm số bài theo danh mục (chỉ để hiển thị, tính trên dữ liệu đang lọc)
  const categoryOptions = useMemo(
    () => [
      { slug: "all", name: "Tất cả bài viết" },
      ...categories.map((c) => ({ slug: c.slug || c.id, name: c.name })),
    ],
    [categories]
  );

  return (
    <div className="bg-slate-50 pb-16">


      {/* Categories */}
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => {
            const active = activeCategory === cat.slug;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-8 sm:px-6">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 size={30} className="animate-spin text-amber-500" />
            <p className="text-sm text-slate-500">Đang tải bài viết...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
            <AlertCircle size={30} className="text-red-400" />
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-100"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <FolderOpen size={26} className="text-slate-400" />
            </span>
            <p className="text-base font-semibold text-slate-700">
              Chưa có bài viết nào
            </p>
            <p className="max-w-sm text-sm text-slate-500">
              {activeCategory === "all"
                ? "Các bài viết và công trình mới sẽ được cập nhật tại đây. Vui lòng quay lại sau."
                : "Danh mục này hiện chưa có bài viết. Hãy thử một danh mục khác."}
            </p>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              <FileText size={15} />
              Liên hệ tư vấn
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  categories={categories}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default ArticlesPage;
