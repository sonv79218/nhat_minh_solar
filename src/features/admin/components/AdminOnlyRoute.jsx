// ============================================
// AUTHENTICATED CONTACT REQUESTS ROUTE
// Firestore/Auth hiện tại dùng phiên đăng nhập làm cơ chế phân quyền.
// Yêu cầu liên hệ: ai cũng tạo được và ai cũng đọc được.
// ============================================
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminOnlyRoute({ children }) {
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
