// ============================================
// ADMIN LOGIN PAGE
// Firebase Authentication — email/password
// ============================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(email.trim(), password);

    if (result.success) {
      navigate("/admin/messages", { replace: true });
    } else {
      setError(result.error || "Đăng nhập thất bại.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nhật Minh Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Đăng nhập để quản lý hệ thống</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nhatminh.vn"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Nhật Minh Solar
        </p>
      </div>
    </div>
  );
}
