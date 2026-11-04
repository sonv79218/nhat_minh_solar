// ============================================
// PROJECT INFO SPECS
// Điện Mặt Trời Nhật Minh
// Hiển thị thông số công trình dạng thẻ thông tin
// ============================================
import {
  MapPin,
  CalendarCheck,
  Zap,
  Network,
  Sun,
  BatteryCharging,
  Layers,
  Factory,
} from "lucide-react";
import { formatDate } from "@/utils/articleUtils";
import { SYSTEM_TYPE_LABELS } from "@/features/articles/data/articleCategories";

const SPEC_FIELDS = [
  {
    key: "systemCapacity",
    label: "Công suất hệ thống",
    unit: "kWp",
    icon: Zap,
    color: "from-amber-400 to-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    key: "systemType",
    label: "Loại hệ thống",
    icon: Network,
    color: "from-blue-400 to-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
    format: (v) => SYSTEM_TYPE_LABELS[v] || v,
  },
  {
    key: "panelBrand",
    label: "Thương hiệu tấm pin",
    icon: Sun,
    color: "from-emerald-400 to-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    key: "inverterBrand",
    label: "Thương hiệu inverter",
    icon: Network,
    color: "from-violet-400 to-violet-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    key: "batteryCapacity",
    label: "Dung lượng pin lưu trữ",
    unit: "kWh",
    icon: BatteryCharging,
    color: "from-sky-400 to-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  {
    key: "panelCount",
    label: "Số lượng tấm pin",
    unit: "tấm",
    icon: Layers,
    color: "from-slate-400 to-slate-500",
    bg: "bg-slate-50",
    text: "text-slate-600",
  },
];

const ProjectSpecs = ({ projectInfo }) => {
  if (!projectInfo) return null;

  const specs = SPEC_FIELDS.filter(
    (f) => projectInfo[f.key] !== undefined && projectInfo[f.key] !== ""
  );

  const hasBasic = projectInfo.projectName || projectInfo.location;

  if (!hasBasic && specs.length === 0) return null;

  return (
    <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/25">
          <Factory size={19} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Thông số công trình</h2>
          <p className="text-xs text-slate-500">
            Cấu hình hệ thống điện mặt trời đã thi công
          </p>
        </div>
      </div>

      {/* Basic info */}
      {(projectInfo.projectName || projectInfo.location || projectInfo.completionDate) && (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {projectInfo.projectName && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Tên công trình
              </p>
              <p className="text-sm font-bold text-slate-900">
                {projectInfo.projectName}
              </p>
            </div>
          )}

          {projectInfo.location && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <MapPin size={11} />
                Địa điểm
              </p>
              <p className="text-sm font-bold text-slate-900">
                {projectInfo.location}
              </p>
            </div>
          )}

          {projectInfo.completionDate && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <CalendarCheck size={11} />
                Ngày hoàn thành
              </p>
              <p className="text-sm font-bold text-slate-900">
                {formatDate(projectInfo.completionDate)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Spec cards */}
      {specs.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {specs.map((spec) => {
            const Icon = spec.icon;
            const rawValue = projectInfo[spec.key];
            const value = spec.format
              ? spec.format(rawValue)
              : `${rawValue}${spec.unit ? ` ${spec.unit}` : ""}`;

            return (
              <div
                key={spec.key}
                className="rounded-xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${spec.color}`}
                >
                  <Icon size={16} className="text-white" />
                </div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {spec.label}
                </p>
                <p className="text-base font-extrabold text-slate-900">{value}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProjectSpecs;
