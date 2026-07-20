// ============================================
// NOT FOUND PAGE (404) - Premium Design
// ============================================
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 Illustration */}
        <div className="relative mb-8">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-blue-100/50 rounded-full blur-3xl transform scale-75" />

          {/* 404 Text */}
          <div className="relative">
            <div className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
              404
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: "2s" }} />
            <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-green-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: "3s", animationDelay: "1s" }} />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span className="text-sm font-medium text-red-600">Page Not Found</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            Trang không tồn tại
          </h1>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            to="/"
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              px-6 py-3.5
              bg-gradient-to-r from-primary-600 to-blue-500
              text-white font-semibold rounded-xl
              shadow-lg shadow-primary-500/30
              hover:shadow-xl hover:shadow-primary-500/40
              hover:-translate-y-0.5
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            <span>Về trang chủ</span>
          </Link>

          <Link
            to="/products"
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              px-6 py-3.5
              bg-white border-2 border-slate-200
              text-slate-700 font-semibold rounded-xl
              hover:border-primary-300 hover:bg-primary-50
              hover:-translate-y-0.5
              active:scale-[0.98]
              transition-all duration-300
            "
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Xem sản phẩm</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-slate-100 pt-8">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">
            Liên kết nhanh
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/products?brand=aqara" className="text-slate-500 hover:text-primary-600 transition-colors">
              Aqara
            </Link>
            <Link to="/products?brand=lumi" className="text-slate-500 hover:text-primary-600 transition-colors">
              Lumi
            </Link>
            <Link to="/products?brand=hunonic" className="text-slate-500 hover:text-primary-600 transition-colors">
              Hunonic
            </Link>
            <Link to="/cart" className="text-slate-500 hover:text-primary-600 transition-colors">
              Giỏ hàng
            </Link>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="mt-12 flex items-center justify-center gap-2 text-slate-300">
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-current" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-current" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
