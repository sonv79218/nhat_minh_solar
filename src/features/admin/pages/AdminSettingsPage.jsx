// ============================================
// ADMIN SETTINGS PLACEHOLDER PAGE
// Điện Mặt Trời Nhật Minh
// ============================================
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
      <Settings className="w-12 h-12 mb-3 opacity-20" />
      <p className="font-medium text-lg text-slate-600">Cài đặt hệ thống</p>
      <p className="text-sm mt-1">Sẽ được phát triển trong phiên bản tiếp theo</p>
    </div>
  );
}
