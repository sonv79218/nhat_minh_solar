// ============================================
// ADMIN LAYOUT
// Điện Mặt Trời Nhật Minh
// Full-screen sidebar + header layout
// ============================================
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  LogOut,
  Sun,
  User,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  {
    label: "Tin nhắn",
    icon: MessageSquare,
    to: "/admin/messages",
  },
  {
    label: "Quản lý bài viết",
    icon: FileText,
    to: "/admin/articles",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const isActive = (to) => {
    if (to === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(to);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="flex w-[240px] flex-shrink-0 flex-col bg-[#0b1628] text-white">
        {/* Logo */}
        <div className="flex h-[64px] items-center border-b border-white/10 px-4">
          <Link
            to="/admin"
            className="flex min-w-0 items-center gap-2.5"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500">
              <Sun className="h-4 w-4 text-white" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">
                Nhật Minh
              </p>

              <p className="truncate text-[10px] text-white/50">
                Solar Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
            const active = isActive(to);

            return (
              <Link
                key={to}
                to={to}
                className={`
                  group
                  flex items-center gap-3
                  rounded-lg
                  px-3 py-2.5
                  text-sm font-medium
                  transition-all duration-150
                  ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`
                    h-[18px] w-[18px] flex-shrink-0
                    ${active ? "text-emerald-400" : ""}
                  `}
                />

                <span className="truncate">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Admin user */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <User className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white/80">
                {currentUser?.email || "Người dùng"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Đăng xuất"
              onClick={handleLogout}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}