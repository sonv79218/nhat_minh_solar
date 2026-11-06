import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon, MapPin } from "lucide-react";

const ArticleCard = ({ article = {} }) => {
  const [imageError, setImageError] = useState(false);
  const {
    slug = "",
    title = "Bài viết Nhật Minh Solar",
    excerpt = "",
    coverImage = "",
    address,
    location,
    equipment,
    projectInfo,
  } = article;

  const detailUrl = `/bai-viet/${slug}`;
  const projectAddress =
    address || location || projectInfo?.address || projectInfo?.location;
  const equipmentSource = Array.isArray(equipment)
    ? equipment
    : projectInfo?.equipment;
  const equipmentList = Array.isArray(equipmentSource)
    ? equipmentSource
        .map((item) => (typeof item === "string" ? item.trim() : item?.name))
        .filter(Boolean)
    : [];
  const hasImage = Boolean(coverImage) && !imageError;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md">
      <Link
        to={detailUrl}
        aria-label={`Xem chi tiết: ${title}`}
        className="relative block aspect-[3/2] overflow-hidden bg-slate-100"
      >
        {hasImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
            <ImageIcon size={34} strokeWidth={1.5} />
            <span className="text-[11px] font-medium uppercase tracking-[0.16em]">
              Nhật Minh Solar
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={detailUrl} className="block text-center">
          <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-[1.625rem] text-slate-900 transition-colors group-hover:text-amber-600">
            {title}
          </h3>
        </Link>

        {projectAddress && (
          <div className="mt-2 flex min-h-[2.5rem] items-start justify-center gap-1.5 text-center text-sm leading-5 text-slate-500">
            <MapPin
              size={15}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <span className="line-clamp-2">{projectAddress}</span>
          </div>
        )}

        <div className="mt-4 min-h-[7.5rem]">
          {equipmentList.length > 0 ? (
            <ul className="space-y-2 text-sm leading-5 text-slate-600">
              {equipmentList.slice(0, 5).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex min-w-0 items-start gap-2"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            excerpt && (
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                {excerpt}
              </p>
            )
          )}
        </div>

        <Link
          to={detailUrl}
          className="mt-auto inline-flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700"
        >
          Xem chi tiết
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
