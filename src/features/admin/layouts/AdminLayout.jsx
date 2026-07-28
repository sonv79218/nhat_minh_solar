// ============================================
// ADMIN LAYOUT
// Điện Mặt Trời Nhật Minh
// Full-screen sidebar + header layout
// ============================================
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Bell,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Tổng quan", icon: LayoutDashboard, to: "/admin" },
  { label: "Gói Solar", icon: Package, to: "/admin/packages" },
  { label: "Đơn hàng", icon: ShoppingCart, to: "/admin/orders" },
  { label: "Cài đặt", icon: Settings, to: "/admin/settings" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[#0b1628] text-white transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-[240px]"
        } flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center h-[64px] px-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Sun className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold leading-tight whitespace-nowrap">Nhật Minh</p>
                <p className="text-[10px] text-white/50 whitespace-nowrap">Solar Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-emerald-400" : ""}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center w-full rounded-lg py-2 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <ChevronLeft className="w-4 h-4" />
                <span>Thu gọn</span>
              </div>
            )}
          </button>
        </div>

        {/* Admin user */}
        <div className={`p-3 border-t border-white/10 ${collapsed ? "px-2" : ""}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-medium text-white/80 whitespace-nowrap truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-white/40 whitespace-nowrap truncate">
                  admin@nhatminh.vn
                </p>
              </div>
            )}
            {!collapsed && (
              <button className="text-white/30 hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Quản trị hệ thống</h1>
            <p className="text-[11px] text-slate-400">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Xem website</span>
              <Sun className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
