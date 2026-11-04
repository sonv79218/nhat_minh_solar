// ============================================
// ADMIN PROTECTED ROUTE
// Điện Mặt Trời Nhật Minh
// ============================================
// Chỉ bảo vệ bằng PHIÊN ĐĂNG NHẬP Firebase Authentication.
// KHÔNG kiểm tra Custom Claims / role admin (theo Security Rules hiện tại).
// ============================================
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
