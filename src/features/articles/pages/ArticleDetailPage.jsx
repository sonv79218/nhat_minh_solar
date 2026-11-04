// ============================================
// ARTICLE DETAIL PAGE
// Điện Mặt Trời Nhật Minh
// Trang /bai-viet/:slug
// ============================================
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  Phone,
  Loader2,
  AlertCircle,
  FileText,
  ArrowLeft,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import ArticleContent from "@/features/articles/components/ArticleContent";
import ProjectSpecs from "@/features/articles/components/ProjectSpecs";
import ArticleCard from "@/features/articles/components/ArticleCard";
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
  getArticleCategories,
} from "@/services/articleService";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";
import { formatDate, formatDateTime } from "@/utils/articleUtils";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const ArticleDetailPage = () => {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryName = useMemo(() => {
    if (!article?.category) return "Kiến thức";
    const found = categories.find(
      (c) => c.slug === article.category || c.id === article.category
    );
    return found?.name || article.category;
  }, [article, categories]);

  useSeo({
    title: article?.title,
    description: article?.excerpt,
    image: article?.coverImage,
    url: `/bai-viet/${slug}`,
    type: "article",
    jsonLd: article
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt || "",
          image: article.coverImage ? [article.coverImage] : undefined,
          datePublished:
            article.publishedAt?.toDate?.().toISOString?.() ||
            article.publishedAt ||
            undefined,
          dateModified:
            article.updatedAt?.toDate?.().toISOString?.() ||
            article.updatedAt ||
            undefined,
          author: {
            "@type": "Organization",
            name: article.author || "Nhật Minh Điện Mặt Trời",
          },
          publisher: {
            "@type": "Organization",
            name: "Nhật Minh Điện Mặt Trời",
            url: SITE_URL,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/bai-viet/${article.slug}`,
          },
        }
      : null,
  });

  // Breadcrumb schema (riêng khối script)
  useEffect(() => {
    const existing = document.getElementById("seo-breadcrumb");
    if (existing) existing.remove();

    if (!article) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "seo-breadcrumb";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Trang chủ",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Bài viết",
          item: `${SITE_URL}/bai-viet`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `${SITE_URL}/bai-viet/${article.slug}`,
        },
      ],
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, [article]);

  // Load dữ liệu
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const [data, cats] = await Promise.all([
          getPublishedArticleBySlug(slug),
          getArticleCategories(),
        ]);

        if (cancelled) return;

        if (!data) {
          setError("not-found");
          setArticle(null);
          return;
        }

        setArticle(data);

        if (cats?.length) setCategories(cats);

        const rel = await getRelatedArticles({
          category: data.category,
          excludeId: data.id,
          limit: 3,
        });

        if (!cancelled) setRelated(rel);
      } catch (e) {
        console.error("[ArticleDetailPage] load failed:", e);
        if (!cancelled) setError("error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-slate-50">
        <Loader2 size={30} className="animate-spin text-amber-500" />
        <p className="text-sm text-slate-500">Đang tải bài viết...</p>
      </div>
    );
  }

  // Error / Not found
  if (error || !article) {
    const notFound = error === "not-found";

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          {notFound ? (
            <FileText size={28} className="text-slate-400" />
          ) : (
            <AlertCircle size={28} className="text-red-400" />
          )}
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          {notFound ? "Không tìm thấy bài viết" : "Lỗi tải bài viết"}
        </h1>
        <p className="max-w-md text-sm text-slate-500">
          {notFound
            ? "Bài viết có thể đã bị xóa hoặc chưa được xuất bản."
            : "Không thể tải nội dung. Vui lòng thử lại sau ít phút."}
        </p>
        <Link
          to="/bai-viet"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          <ArrowLeft size={15} />
          Về danh sách bài viết
        </Link>
      </div>
    );
  }

  const projectInfo =
    article.type === "project" ? article.projectInfo : null;

  return (
    <div className="bg-slate-50 pb-16">
      {/* Breadcrumb + header */}
      <article>
        <header className="border-b border-slate-100 bg-white">
          <div className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-10">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                <li>
                  <Link to="/" className="transition-colors hover:text-amber-600">
                    Trang chủ
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} />
                </li>
                <li>
                  <Link
                    to="/bai-viet"
                    className="transition-colors hover:text-amber-600"
                  >
                    Bài viết
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} />
                </li>
                <li className="max-w-[220px] truncate font-medium text-slate-600">
                  {article.title}
                </li>
              </ol>
            </nav>

            {/* Category + type badge */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {categoryName}
              </span>
              {article.type === "project" && (
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Công trình đã thi công
                </span>
              )}
              {article.featured && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                  Nổi bật
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                {article.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-500" />
                Đăng ngày {formatDate(article.publishedAt || article.createdAt)}
              </span>

              {article.author && (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-amber-500" />
                  {article.author}
                </span>
              )}

              {projectInfo?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-500" />
                  {projectInfo.location}
                </span>
              )}

              {article.updatedAt && (
                <span className="text-slate-400">
                  Cập nhật {formatDateTime(article.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Cover image */}
        {article.coverImage && (
          <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6">
            <figure className="mt-6">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full rounded-2xl object-cover shadow-sm"
                style={{ maxHeight: "520px" }}
              />
              {article.excerpt && (
                <figcaption className="mt-2 text-center text-xs text-slate-400">
                  {article.title}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        {/* Body */}
        <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6">
          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
            <ProjectSpecs projectInfo={projectInfo} />

            {projectInfo?.projectDescription && (
              <section className="mb-8">
                <h2 className="mb-3 text-lg font-bold text-slate-900">
                  Quá trình thi công
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {projectInfo.projectDescription}
                </p>
              </section>
            )}

            {projectInfo?.projectResult && (
              <section className="mb-8">
                <h2 className="mb-3 text-lg font-bold text-slate-900">
                  Kết quả & hiệu quả vận hành
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {projectInfo.projectResult}
                </p>
              </section>
            )}

            {projectInfo?.projectImages?.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Hình ảnh công trình
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {projectInfo.projectImages.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
                    >
                      <img
                        src={img}
                        alt={`Hình ảnh công trình ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <ArticleContent content={article.content} />
          </div>

          {/* CTA */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Cần tư vấn hệ thống điện mặt trời?
                </h2>
                <p className="mt-1.5 text-sm text-white/70">
                  Nhật Minh khảo sát miễn phí và báo giá tối ưu cho công trình
                  của bạn.
                </p>
              </div>

              <a
                href="tel:0876906668"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5"
              >
                <Phone size={17} />
                0876 906 668
              </a>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">
                  Bài viết liên quan
                </h2>
                <div className="h-[3px] w-24 bg-gradient-to-r from-amber-500 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    categories={categories}
                  />
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/bai-viet"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700"
                >
                  Xem tất cả bài viết
                  <ChevronRight size={15} />
                </Link>
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
