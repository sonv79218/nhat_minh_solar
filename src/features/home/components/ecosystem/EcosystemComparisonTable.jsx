// ============================================
// ECOSYSTEM COMPARISON TABLE - Mobile Component
// ============================================
import { Link } from "react-router-dom";
import {
  Wallet,
  Users,
  ShieldCheck,
  Network,
} from "lucide-react";

const EcosystemComparisonTable = ({ ecosystem }) => {
  const comparison = ecosystem.comparison || {
    price: "Trung bình",
    target: "Người dùng thông thường",
    strengths: "Đa dạng sản phẩm",
    ecosystem: "Thiết bị cơ bản",
  };
const comparisonItems = [
  {
    label: "Giá",
    value: comparison.price,
    icon: Wallet,
  },
  {
    label: "Đối tượng",
    value: comparison.target,
    icon: Users,
  },
  {
    label: "Ưu điểm",
    value: comparison.strengths,
    icon: ShieldCheck,
  },
  {
    label: "Hệ sinh thái",
    value: comparison.ecosystem,
    icon: Network,
  },
];
  // const comparisonItems = [
  //   { label: "Giá", value: comparison.price, icon: "💰" },
  //   { label: "Đối tượng", value: comparison.target, icon: "👥" },
  //   { label: "Ưu điểm", value: comparison.strengths, icon: "✨" },
  //   { label: "Hệ sinh thái", value: comparison.ecosystem, icon: "🔗" },
  // ];

  return (
    <div className="space-y-3">
{comparisonItems.map((item) => {
  const Icon = item.icon;

  return (
<div
  key={item.label}
  className="flex gap-3 p-3 rounded-2xl border"
  style={{
    borderColor: `${ecosystem.color}20`,
    backgroundColor: `${ecosystem.color}08`,
  }}
>
  <Icon
    size={18}
    className="mt-0.5 shrink-0"
    style={{
      color: ecosystem.color,
    }}
  />

  <div>
    <p
      className="text-xs font-semibold"
      style={{
        color: ecosystem.color,
      }}
    >
      {item.label}
    </p>

    <p className="text-sm text-slate-700 leading-relaxed">
      {item.value}
    </p>
  </div>
</div>
  );
})}
    </div>
  );
};

export default EcosystemComparisonTable;
