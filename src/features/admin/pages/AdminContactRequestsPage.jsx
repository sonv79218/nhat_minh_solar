// ============================================
// ADMIN CONTACT REQUESTS PAGE
// Điện Mặt Trời Nhật Minh
// List, view and update contact_requests from Firestore
// ============================================
import { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  User,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { getContactRequests, updateContactRequestStatus } from "@/services/contactService";
import { describeFirebaseError } from "@/utils/firebaseErrors";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_CONFIG = {
  new: {
    label: "Mới",
    icon: Clock,
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  contacted: {
    label: "Đã liên hệ",
    icon: CheckCircle2,
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  done: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const SERVICE_LABELS = {
  "Điện mặt trời gia đình": "🏠 Gia đình",
  "Điện mặt trời doanh nghiệp": "🏢 Doanh nghiệp",
  "Hệ thống Hybrid / Lưu trữ": "🔋 Hybrid",
  "Bảo trì & Sửa chữa": "🔧 Bảo trì",
  "Khác": "📌 Khác",
};

const STATUS_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "done", label: "Hoàn thành" },
];

const formatDate = (ts) => {
  if (!ts?.toDate) return "—";
  const d = ts.toDate();
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminContactRequestsPage() {
  const { currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getContactRequests(currentUser);
      setRequests(data);
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể tải danh sách yêu cầu.",
          Boolean(currentUser)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getContactRequests(currentUser);
        if (!cancelled) setRequests(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(
          describeFirebaseError(
            e,
            "Không thể tải danh sách yêu cầu.",
            Boolean(currentUser)
          )
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError("");
    try {
      await updateContactRequestStatus(id, newStatus, currentUser);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (e) {
      console.error(e);
      setError(
        describeFirebaseError(
          e,
          "Không thể cập nhật trạng thái yêu cầu.",
          Boolean(currentUser)
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = activeTab === "all"
    ? requests
    : requests.filter((r) => r.status === activeTab);

  const counts = {
    all: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    contacted: requests.filter((r) => r.status === "contacted").length,
    done: requests.filter((r) => r.status === "done").length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yêu cầu liên hệ</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Đang tải..." : `${counts.all} yêu cầu — ${counts.new} mới`}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key: "all", label: "Tất cả" },
          { key: "new", label: "Mới" },
          { key: "contacted", label: "Đã liên hệ" },
          { key: "done", label: "Hoàn thành" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-emerald-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  activeTab === tab.key
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <MessageSquare size={26} className="text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">
            {activeTab === "all"
              ? "Chưa có yêu cầu liên hệ nào."
              : "Không có yêu cầu nào ở trạng thái này."}
          </p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((req) => {
            const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.new;
            const StatusIcon = cfg.icon;

            return (
              <div
                key={req.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Left color bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.dot.replace("bg-", "bg-")}`} />

                <div className="pl-4 pr-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: info */}
                    <div className="min-w-0 flex-1">
                      {/* Name + service */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-900">{req.fullName}</span>
                        </div>
                        {req.serviceType && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                            {SERVICE_LABELS[req.serviceType] || req.serviceType}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}>
                          <StatusIcon size={11} />
                          {cfg.label}
                        </span>
                      </div>

                      {/* Contact info row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 mb-2">
                        <a
                          href={`tel:${req.phone}`}
                          className="inline-flex items-center gap-1.5 font-medium text-slate-800 hover:text-emerald-600 transition-colors"
                        >
                          <Phone size={13} className="shrink-0" />
                          {req.phone}
                        </a>
                        {req.email && (
                          <a
                            href={`mailto:${req.email}`}
                            className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                          >
                            <Mail size={13} className="shrink-0" />
                            <span className="truncate max-w-[200px]">{req.email}</span>
                          </a>
                        )}
                      </div>

                      {/* Message */}
                      {req.message && (
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      )}

                      {/* Timestamp */}
                      <p className="mt-2 text-[11px] text-slate-400">
                          {formatDate(req.createdAt)}
                      </p>
                    </div>

                    {/* Right: status dropdown */}
                    <div className="shrink-0">
                      <div className="relative">
                        <select
                          value={req.status}
                          disabled={updatingId === req.id}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`
                            appearance-none
                            rounded-lg border border-slate-200
                            bg-white px-3 py-1.5 pr-8
                            text-xs font-semibold
                            text-slate-600
                            cursor-pointer
                            hover:border-slate-300
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                            transition-all
                            disabled:opacity-50
                            ${cfg.badge}
                          `}
                          style={{ color: undefined }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={12}
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
