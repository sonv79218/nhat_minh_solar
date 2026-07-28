// ============================================
// PACKAGE FORM — MAIN WRAPPER
// Sticky action bar + tabbed sections
// Điện Mặt Trời Nhật Minh
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Globe,
  Eye,
  X,
  ChevronRight,
} from "lucide-react";
import PackageBasicInfo from "@/features/admin/components/PackageBasicInfo";
import PackageSpecification from "@/features/admin/components/PackageSpecification";
import PackageInvestment from "@/features/admin/components/PackageInvestment";
import PackageWarranty from "@/features/admin/components/PackageWarranty";
import PackageMedia from "@/features/admin/components/PackageMedia";
import PackageSEO from "@/features/admin/components/PackageSEO";

const TABS = [
  { id: "basic", label: "Thông tin cơ bản", icon: "📋" },
  { id: "specs", label: "Thông số kỹ thuật", icon: "⚙️" },
  { id: "investment", label: "Đầu tư", icon: "📊" },
  { id: "warranty", label: "Bảo hành", icon: "🛡️" },
  { id: "media", label: "Hình ảnh & Video", icon: "🖼️" },
  { id: "seo", label: "SEO", icon: "🔍" },
];

const defaultForm = {
  name: "",
  slug: "",
  sku: "",
  category: "",
  status: "Draft",
  featured: false,
  price: "",
  salePrice: "",
  shortDescription: "",
  fullDescription: "",
  systemType: "On-grid",
  capacity: "",
  monthlyOutput: "",
  roofArea: "",
  panelCount: "",
  panelBrand: "",
  panelModel: "",
  panelPower: "",
  inverterBrand: "",
  inverterModel: "",
  batteryBrand: "",
  batteryCapacity: "",
  monthlySavings: "",
  annualSavings: "",
  paybackYears: "",
  co2Reduction: "",
  panelWarranty: "",
  inverterWarranty: "",
  installWarranty: "",
  suitableFor: [],
  thumbnail: "",
  gallery: [],
  videoUrl: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
};

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Tên gói là bắt buộc";
  if (!form.slug.trim()) errors.slug = "Slug là bắt buộc";
  else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = "Slug chỉ chứa a-z, 0-9, dấu gạch ngang";
  if (!form.sku.trim()) errors.sku = "SKU là bắt buộc";
  if (!form.category) errors.category = "Danh mục là bắt buộc";
  if (!form.price || Number(form.price) <= 0) errors.price = "Giá phải lớn hơn 0";
  if (form.salePrice && Number(form.salePrice) <= 0) errors.salePrice = "Giá khuyến mãi phải lớn hơn 0";
  if (!form.capacity || Number(form.capacity) <= 0) errors.capacity = "Công suất phải lớn hơn 0";
  if (!form.systemType) errors.systemType = "Loại hệ thống là bắt buộc";
  if (form.videoUrl && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/.test(form.videoUrl))
    errors.videoUrl = "URL YouTube không hợp lệ";
  return errors;
};

export default function PackageForm({ initialData, isEdit = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...defaultForm, ...initialData });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setToggle = (key) => setForm((f) => ({ ...f, [key]: !f[key] }));
  const setErrorsField = (key, msg) => setErrors((e) => ({ ...e, [key]: msg }));

  const handleSaveDraft = async () => {
    const e = validate({ ...form, status: "Draft" });
    if (Object.keys(e).length) { setErrors(e); setActiveTab("basic"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("[Admin] Save draft:", form);
    setSaving(false);
    navigate("/admin/packages");
  };

  const handlePublish = async () => {
    const e = validate({ ...form, status: "Active" });
    if (Object.keys(e).length) { setErrors(e); setActiveTab("basic"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("[Admin] Publish:", form);
    setSaving(false);
    navigate("/admin/packages");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "basic":
        return <PackageBasicInfo form={form} set={set} setToggle={setToggle} errors={errors} setErrors={setErrorsField} />;
      case "specs":
        return <PackageSpecification form={form} set={set} errors={errors} setErrors={setErrorsField} />;
      case "investment":
        return <PackageInvestment form={form} set={set} errors={errors} setErrors={setErrorsField} />;
      case "warranty":
        return <PackageWarranty form={form} set={set} errors={errors} setErrors={setErrorsField} />;
      case "media":
        return <PackageMedia form={form} set={set} errors={errors} setErrors={setErrorsField} />;
      case "seo":
        return <PackageSEO form={form} set={set} errors={errors} setErrors={setErrorsField} />;
      default:
        return null;
    }
  };

  const tabIcons = Object.fromEntries(TABS.map((t) => [t.id, t.icon]));

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Page header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate("/admin/packages")} className="hover:text-emerald-600 transition-colors">
            Gói Solar
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-medium">
            {isEdit ? "Chỉnh sửa gói" : "Thêm gói mới"}
          </span>
        </div>
        <button
          onClick={() => navigate("/admin/packages")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Tab sidebar */}
        <nav className="w-56 flex-shrink-0 bg-white border-r border-slate-200 py-4 hidden lg:block">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-50 text-emerald-600 border-r-2 border-emerald-500 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span>{tabIcons[tab.id]}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Form content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
            {renderTab()}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex-shrink-0">
        <button
          onClick={() => navigate("/admin/packages")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Hủy bỏ
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Lưu nháp
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Xuất bản"}
          </button>

          <button
            onClick={() => navigate(`/admin/packages/preview/${initialData?.id || "new"}`)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>
        </div>
      </div>
    </div>
  );
}
