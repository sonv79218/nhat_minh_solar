// ============================================
// ADMIN ONLY ROUTE
// Chỉ tài khoản có quyền Admin (users/{uid}.role == "admin" hoặc Custom
// Claim admin === true) mới truy cập được.
//
// Dùng cho route quản lý `contact_requests` — Firestore Rules chỉ cho
// Admin đọc / cập nhật / xoá yêu cầu liên hệ.
// ============================================
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminOnlyRoute({ children }) {
  const { currentUser, admin, loading, adminLoading } = useAuth();

  if (loading || adminLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!admin) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">
            Không có quyền truy cập
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Trang này chỉ dành cho tài khoản Admin. Bạn vẫn có thể quản lý bài
            viết tại mục “Quản lý bài viết”.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
