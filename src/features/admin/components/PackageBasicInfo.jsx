// ============================================
// PACKAGE BASIC INFO SECTION
// Điện Mặt Trời Nhật Minh
// ============================================
import { PACKAGE_CATEGORIES, SYSTEM_TYPES } from "@/features/admin/data/mockPackages";

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ value, onChange, error, type = "text", placeholder, ...rest }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors ${
      error
        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
        : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
    }`}
    {...rest}
  />
);

const Textarea = ({ value, onChange, error, rows = 4, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    placeholder={placeholder}
    className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors resize-none ${
      error
        ? "border-red-300 focus:ring-red-100 focus:border-red-400"
        : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
    }`}
  />
);

export default function PackageBasicInfo({ form, set, setToggle, errors }) {
  const genSlug = (name) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleNameChange = (val) => {
    set("name", val);
    if (!form.slug || form.slug === genSlug(form.name)) set("slug", genSlug(val));
  };

  const toggleSuitable = (label) => {
    const current = form.suitableFor || [];
    const next = current.includes(label)
      ? current.filter((s) => s !== label)
      : [...current, label];
    set("suitableFor", next);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Thông tin cơ bản" description="Tên, SKU, giá và mô tả ngắn gọn" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Tên gói Solar" required error={errors.name}>
          <Input
            value={form.name}
            onChange={handleNameChange}
            error={errors.name}
            placeholder="VD: Gói Standard 5kWp"
          />
        </Field>

        <Field label="Slug" required error={errors.slug}>
          <Input
            value={form.slug}
            onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            error={errors.slug}
            placeholder="goi-standard-5kwp"
          />
          <p className="mt-1 text-[11px] text-slate-400">URL: /solar/goi-standard-5kwp</p>
        </Field>

        <Field label="SKU / Mã sản phẩm" required error={errors.sku}>
          <Input value={form.sku} onChange={(v) => set("sku", v.toUpperCase())} error={errors.sku} placeholder="NMB-5KWP-S01" />
        </Field>

        <Field label="Danh mục" required error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors bg-white ${
              errors.category
                ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
            }`}
          >
            <option value="">Chọn danh mục</option>
            {PACKAGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Giá gốc (VNĐ)" required error={errors.price}>
          <Input
            type="number"
            value={form.price}
            onChange={(v) => set("price", v)}
            error={errors.price}
            placeholder="68000000"
          />
        </Field>

        <Field label="Giá khuyến mãi (VNĐ)" error={errors.salePrice}>
          <Input type="number" value={form.salePrice} onChange={(v) => set("salePrice", v)} error={errors.salePrice} placeholder="62000000" />
        </Field>

        <div className="md:col-span-2">
          <Field label="Mô tả ngắn" error={errors.shortDescription}>
            <Textarea
              value={form.shortDescription}
              onChange={(v) => set("shortDescription", v)}
              rows={2}
              placeholder="Một hoặc hai câu mô tả ngắn gọn về gói Solar (hiển thị trên card)"
            />
            <p className="mt-1 text-[11px] text-slate-400">{form.shortDescription.length}/200 ký tự</p>
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="Mô tả đầy đủ" error={errors.fullDescription}>
            <Textarea
              value={form.fullDescription}
              onChange={(v) => set("fullDescription", v)}
              rows={5}
              placeholder="Chi tiết về hệ thống, ưu điểm, phù hợp với đối tượng nào..."
            />
          </Field>
        </div>

        <Field label="Loại hệ thống" required error={errors.systemType}>
          <select
            value={form.systemType}
            onChange={(e) => set("systemType", e.target.value)}
            className={`w-full text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-colors bg-white ${
              errors.systemType
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-400"
            }`}
          >
            {SYSTEM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <div className="flex flex-col gap-3 pt-6">
          <Toggle label="Hiển thị (Active)" checked={form.status === "Active"} onChange={() => set("status", form.status === "Active" ? "Hidden" : "Active")} />
          <Toggle label="Gói nổi bật (Featured)" checked={form.featured} onChange={() => setToggle("featured")} />
        </div>
      </div>

      {/* Suitable for */}
      <SectionHeader title="Phù hợp cho" description="Chọn loại công trình phù hợp" />
      <div className="flex flex-wrap gap-2">
        {["Home", "Villa", "Business", "Factory", "Farm"].map((item) => (
          <button
            key={item}
            onClick={() => toggleSuitable(item)}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-150 ${
              (form.suitableFor || []).includes(item)
                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {item === "Home" ? "🏠 Nhà ở" :
             item === "Villa" ? "🏡 Biệt thự" :
             item === "Business" ? "🏢 Doanh nghiệp" :
             item === "Factory" ? "🏭 Nhà xưởng" : "🌾 Trang trại"}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-slate-200"}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
    </label>
  );
}

export { SectionHeader };
