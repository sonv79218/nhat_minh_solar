// ============================================
// PACKAGE EDIT PAGE
// Điện Mặt Trời Nhật Minh
// ============================================
import { useParams } from "react-router-dom";
import { Package } from "lucide-react";
import PackageForm from "@/features/admin/components/PackageForm";
import { MOCK_PACKAGES } from "@/features/admin/data/mockPackages";

export default function PackageEditPage() {
  const { id } = useParams();
  const pkg = MOCK_PACKAGES.find((p) => p.id === id);

  if (!pkg && id !== "new") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
        <Package className="w-12 h-12 mb-3 opacity-20" />
        <p className="font-medium text-lg">Không tìm thấy gói Solar</p>
        <p className="text-sm mt-1">ID: {id}</p>
      </div>
    );
  }

  return <PackageForm initialData={pkg} isEdit={!!pkg} />;
}
