// ============================================
// PACKAGE LIST PAGE
// Điện Mặt Trời Nhật Minh
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package } from "lucide-react";
import PackageTable from "@/features/admin/components/PackageTable";
import { ALL_MOCK_PACKAGES, MOCK_PACKAGES } from "@/features/admin/data/mockPackages";

export default function PackageListPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState(ALL_MOCK_PACKAGES);

  const handleDelete = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicate = (pkg) => {
    const dup = {
      ...pkg,
      id: `pkg-dup-${Date.now()}`,
      name: `${pkg.name} (Copy)`,
      slug: `${pkg.slug}-copy`,
      sku: `${pkg.sku}-CP`,
      status: "Hidden",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPackages((prev) => [dup, ...prev]);
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gói Solar</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Quản lý các gói điện mặt trời
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/packages/new")}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm gói Solar
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tổng gói", value: packages.length, color: "text-slate-700" },
          { label: "Đang Active", value: packages.filter((p) => p.status === "Active").length, color: "text-emerald-600" },
          { label: "Đang Ẩn", value: packages.filter((p) => p.status === "Hidden").length, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-400 leading-tight">
              <div>{label}</div>
              <div>trên tổng {packages.length}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <PackageTable
        packages={packages}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}
