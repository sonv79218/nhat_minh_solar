import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ImageIcon,
  MapPin,
  Sun,
} from "lucide-react";
import { formatDate } from "@/utils/articleUtils";

const ArticleCard = ({ article, categories = [] }) => {
  const [imageError, setImageError] = useState(false);
  const {
    slug,
    title,
    excerpt,
    coverImage,
    address,
    location,
    equipment,
    category,
    type,
    publishedAt,
    createdAt,
  } = article;

  const detailUrl = `/bai-viet/${slug}`;
  const projectAddress = address || location;
  const categoryName =
    categories.find((item) => (item.slug || item.id) === category)?.name ||
    (type === "project" ? "Công trình thực tế" : "Kiến thức điện mặt trời");

  const equipmentList = Array.isArray(equipment)
    ? equipment
        .map((item) => (typeof item === "string" ? item : item?.name))
        .filter(Boolean)
    : [];
  const hasImage = Boolean(coverImage) && !imageError;
  const publishedDate = publishedAt || createdAt;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200/60">
      <Link
        to={detailUrl}
        aria-label={`Đọc bài viết: ${title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900"
      >
        {hasImage ? (
          <img
            src={coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/40">
            <ImageIcon size={34} strokeWidth={1.5} />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em]">
              Nhật Minh Solar
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur-sm">
          <Sun size={13} className="text-amber-500" />
          {type === "project" ? "Công trình" : "Kiến thức"}
        </span>

        <span className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] truncate text-xs font-medium text-white/85">
          {categoryName}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3 text-[11px] font-medium text-slate-400">
          {publishedDate && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} className="text-amber-500" />
              {formatDate(publishedDate)}
            </span>
          )}
          {projectAddress && (
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
              <MapPin size={13} className="shrink-0 text-amber-500" />
              <span className="truncate">{projectAddress}</span>
            </span>
          )}
        </div>

        <Link to={detailUrl} className="block">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600">
            {title}
          </h3>
        </Link>

        {equipmentList.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {equipmentList.slice(0, 3).map((item, index) => (
              <li
                key={`${item}-${index}`}
                title={item}
                className="max-w-full truncate rounded-md bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                {item}
              </li>
            ))}
            {equipmentList.length > 3 && (
              <li className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                +{equipmentList.length - 3}
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {excerpt || "Thông tin công trình đang được cập nhật."}
          </p>
        )}

        <Link
          to={detailUrl}
          className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-amber-600 transition-colors hover:text-amber-700"
        >
          <span>Đọc tiếp</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 transition-all group-hover:bg-amber-500 group-hover:text-white">
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
