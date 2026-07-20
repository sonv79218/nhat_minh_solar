// ============================================
// OFFLINE NOTICE - Fallback Mode Banner
// ============================================
import { Link } from "react-router-dom";

const OfflineNotice = ({ className = "" }) => {
  return (
    <div
      className={`
        w-full
        bg-gradient-to-r from-amber-50 to-orange-50
        border-b border-amber-200
        py-3 px-4
        ${className}
      `}
    >
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* Icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-600"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-amber-800">
              Chế độ dự phòng
            </span>
          </div>

          {/* Message */}
          <p className="text-sm text-amber-700 flex-1">
            Hệ thống đang hiển thị dữ liệu dự phòng. Một số thông tin có thể chưa được cập nhật mới nhất.
          </p>

          {/* Action */}
          <Link
            to="/"
            onClick={() => window.location.reload()}
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              bg-amber-100 hover:bg-amber-200
              text-amber-800 text-sm font-medium
              rounded-lg
              transition-colors
              flex-shrink-0
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Thử lại
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfflineNotice;
