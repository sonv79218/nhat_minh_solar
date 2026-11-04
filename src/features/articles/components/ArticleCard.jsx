// ============================================
// ARTICLE CARD
// Điện Mặt Trời Nhật Minh
// ============================================
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, ImageIcon } from "lucide-react";
import { formatDate, truncate } from "@/utils/articleUtils";
import { DEFAULT_CATEGORIES } from "@/features/articles/data/articleCategories";

const getCategoryName = (categorySlug, categories) => {
  if (!categorySlug) return "Kiến thức";
  const found = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug || c.name === categorySlug
  );
  return found?.name || categorySlug;
};

const ArticleCard = ({ article, categories = DEFAULT_CATEGORIES }) => {
  const {
    slug,
    title,
    excerpt,
    coverImage,
    category,
    publishedAt,
    createdAt,
    type,
  } = article;

  const categoryName = getCategoryName(category, categories);
  const date = publishedAt || createdAt;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">
      {/* Cover */}
      <Link
        to={`/bai-viet/${slug}`}
        className="relative block h-48 overflow-hidden bg-slate-100"
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon size={36} className="text-slate-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {categoryName}
          </span>
          {type === "project" && (
            <span className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Công trình
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar size={13} />
          <span>{formatDate(date)}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-slate-900">
          <Link
            to={`/bai-viet/${slug}`}
            className="transition-colors hover:text-amber-600"
          >
            {title}
          </Link>
        </h3>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {truncate(excerpt, 150)}
        </p>

        <Link
          to={`/bai-viet/${slug}`}
          className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700"
        >
          Đọc chi tiết
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
