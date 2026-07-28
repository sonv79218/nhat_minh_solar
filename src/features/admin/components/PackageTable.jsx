// ============================================
// PACKAGE TABLE COMPONENT
// Reusable data table with search, filter, pagination
// Điện Mặt Trời Nhật Minh
// ============================================
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Edit3,
  Trash2,
  Copy,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

const ROWS_PER_PAGE_OPTIONS = [10, 20, 50];

const SystemTypeBadge = ({ type }) => {
  const map = {
    "On-grid": "bg-blue-50 text-blue-600",
    Hybrid: "bg-emerald-50 text-emerald-600",
    "Off-grid": "bg-purple-50 text-purple-600",
  };
  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${map[type] || "bg-slate-100 text-slate-600"}`}>
      {type}
    </span>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
    status === "Active"
      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
      : "bg-slate-100 text-slate-500 border border-slate-200"
  }`}>
    {status === "Active" ? "Hoạt động" : "Ẩn"}
  </span>
);

const SortIcon = ({ field, sortField, sortDir }) => {
  if (field !== sortField) return <ChevronUp className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />;
};

export default function PackageTable({ packages: initialPackages, onDelete, onDuplicate }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [systemType, setSystemType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let data = [...initialPackages];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (systemType) data = data.filter((p) => p.systemType === systemType);
    if (status) data = data.filter((p) => p.status === status);
    data.sort((a, b) => {
      const av = a[sortField] ?? "";
      const bv = b[sortField] ?? "";
      const cmp = typeof av === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [initialPackages, search, systemType, status, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const handleDelete = (pkg) => {
    if (window.confirm(`Xóa gói "${pkg.name}"? Hành động này không thể hoàn tác.`)) {
      onDelete?.(pkg.id);
    }
  };

  const activeFilters = [systemType, status].filter(Boolean).length;

  const Th = ({ field, children, className = "" }) => (
    <th
      className={`text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap cursor-pointer select-none group hover:bg-slate-50 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU, danh mục..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors ${
              showFilters || activeFilters
                ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Bộ lọc
            {activeFilters > 0 && (
              <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {activeFilters > 0 && (
            <button
              onClick={() => { setSystemType(""); setStatus(""); setPage(1); }}
              className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-2"
            >
              Xóa bộ lọc
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Hiển thị</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 whitespace-nowrap">/ trang</span>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-3">
          <select
            value={systemType}
            onChange={(e) => { setSystemType(e.target.value); setPage(1); }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Tất cả loại hệ thống</option>
            <option value="On-grid">On-grid</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Off-grid">Off-grid</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Active</option>
            <option value="Hidden">Hidden</option>
          </select>

          <div className="flex items-center gap-2 text-xs text-slate-400 ml-auto">
            <span>Kết quả: <strong className="text-slate-600">{filtered.length}</strong> gói</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <Th field="name" className="w-[300px]">Tên gói</Th>
              <Th field="systemType">Loại</Th>
              <Th field="capacity">Công suất</Th>
              <Th field="price" className="text-right">Giá bán</Th>
              <Th field="status" className="text-center">Trạng thái</Th>
              <Th field="featured">Nổi bật</Th>
              <th className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 w-[80px]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-10 h-10 opacity-20" />
                    <p className="font-medium">Không tìm thấy gói Solar nào</p>
                    <p className="text-xs">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={pkg.thumbnail}
                        alt={pkg.name}
                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{pkg.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{pkg.sku}</p>
                        <p className="text-[11px] text-slate-400 truncate">{pkg.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><SystemTypeBadge type={pkg.systemType} /></td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-slate-700">{pkg.capacity} kWp</span>
                    <p className="text-[11px] text-slate-400">{pkg.monthlyOutput} kWh/tháng</p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {pkg.salePrice ? (
                      <>
                        <p className="text-sm font-bold text-emerald-600">
                          {new Intl.NumberFormat("vi-VN").format(pkg.salePrice)} ₫
                        </p>
                        <p className="text-[11px] text-slate-400 line-through">
                          {new Intl.NumberFormat("vi-VN").format(pkg.price)} ₫
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-slate-700">
                        {new Intl.NumberFormat("vi-VN").format(pkg.price)} ₫
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center"><StatusBadge status={pkg.status} /></td>
                  <td className="px-4 py-3.5 text-center">
                    {pkg.featured ? (
                      <span className="inline-block w-5 h-5 bg-amber-100 rounded text-amber-600 text-xs">★</span>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/admin/packages/${pkg.id}`)}
                        title="Chỉnh sửa"
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicate?.(pkg)}
                        title="Nhân bản"
                        className="p-1.5 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                        {openMenuId === pkg.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                            <button
                              onClick={() => { navigate(`/admin/packages/preview/${pkg.id}`); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Xem trước
                            </button>
                            <button
                              onClick={() => { handleDelete(pkg); setOpenMenuId(null); }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Xóa gói
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Hiển thị <strong className="text-slate-600">{(safePage - 1) * rowsPerPage + 1}–{Math.min(safePage * rowsPerPage, filtered.length)}</strong> trong <strong className="text-slate-600">{filtered.length}</strong> gói
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                    pageNum === safePage
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="px-1 text-xs text-slate-400">…</span>}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
