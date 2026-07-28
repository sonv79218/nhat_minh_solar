// ============================================
// ADMIN DASHBOARD PAGE
// Điện Mặt Trời Nhật Minh
// ============================================
import { Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Activity,
  ArrowRight,
} from "lucide-react";
import { MOCK_PACKAGES, STATS } from "@/features/admin/data/mockPackages";

const StatCard = ({ label, value, icon: Icon, trend, trendUp, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-start justify-between gap-4">
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trendUp ? "text-emerald-500" : "text-red-500"}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend}</span>
          <span className="text-slate-400">so với tháng trước</span>
        </div>
      )}
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const activePackages = MOCK_PACKAGES.filter((p) => p.status === "Active");
  const recentPackages = [...MOCK_PACKAGES].slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tổng quan</h2>
          <p className="text-sm text-slate-400 mt-0.5">Chào mừng bạn quay lại, Nhật Minh Solar</p>
        </div>
        <Link
          to="/admin/packages/new"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Thêm gói Solar
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tổng gói Solar"
          value={STATS.total}
          icon={Package}
          trend="+3 gói"
          trendUp
          color="bg-blue-500"
        />
        <StatCard
          label="Gói đang Active"
          value={STATS.active}
          icon={Eye}
          trend="+2"
          trendUp
          color="bg-emerald-500"
        />
        <StatCard
          label="Gói bị ẩn"
          value={STATS.hidden}
          icon={TrendingDown}
          trendUp={false}
          color="bg-amber-500"
        />
        <StatCard
          label="Tổng doanh thu dự kiến"
          value="2.1 tỷ"
          icon={DollarSign}
          trend="+12%"
          trendUp
          color="bg-purple-500"
        />
      </div>

      {/* Recent packages */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Gói Solar gần đây</h3>
            <p className="text-xs text-slate-400 mt-0.5">Cập nhật lần cuối: hôm nay</p>
          </div>
          <Link
            to="/admin/packages"
            className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Gói Solar
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                Loại hệ thống
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                Công suất
              </th>
              <th className="text-right px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Giá
              </th>
              <th className="text-center px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentPackages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={pkg.thumbnail}
                      alt={pkg.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{pkg.name}</p>
                      <p className="text-[11px] text-slate-400">{pkg.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5 hidden md:table-cell">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {pkg.systemType}
                  </span>
                </td>
                <td className="px-6 py-3.5 hidden lg:table-cell">
                  <span className="text-sm font-semibold text-slate-700">{pkg.capacity} kWp</span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {new Intl.NumberFormat("vi-VN").format(pkg.salePrice || pkg.price)} ₫
                  </p>
                  {pkg.salePrice && (
                    <p className="text-[11px] text-slate-400 line-through">
                      {new Intl.NumberFormat("vi-VN").format(pkg.price)} ₫
                    </p>
                  )}
                </td>
                <td className="px-6 py-3.5 text-center hidden sm:table-cell">
                  <span
                    className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      pkg.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {pkg.status === "Active" ? "Hoạt động" : "Ẩn"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* System activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-semibold text-slate-700">Hoạt động hệ thống</h4>
          </div>
          <div className="space-y-2">
            {[
              { text: "Firebase Firestore", ok: true },
              { text: "Firebase Auth", ok: true },
              { text: "Fallback Service", ok: true },
              { text: "Image CDN", ok: true },
            ].map(({ text, ok }) => (
              <div key={text} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{text}</span>
                <span className={`font-semibold ${ok ? "text-emerald-500" : "text-red-500"}`}>
                  {ok ? "Online" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Gói theo loại hệ thống</h4>
          <div className="space-y-2.5">
            {[
              { label: "On-grid", count: 3, color: "bg-blue-500" },
              { label: "Hybrid", count: 2, color: "bg-emerald-500" },
              { label: "Off-grid", count: 1, color: "bg-purple-500" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-500 flex-1">{label}</span>
                <span className="text-xs font-semibold text-slate-700">{count} gói</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {[
              { label: "Thêm gói Solar mới", to: "/admin/packages/new", primary: true },
              { label: "Quản lý đơn hàng", to: "/admin/orders", primary: false },
              { label: "Cài đặt hệ thống", to: "/admin/settings", primary: false },
            ].map(({ label, to, primary }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-center text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                  primary
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
