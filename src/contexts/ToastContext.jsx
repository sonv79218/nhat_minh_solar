import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
} from "lucide-react";

const ToastContext = createContext(null);
const ConfirmContext = createContext(null);

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    accentClass: "from-emerald-500/20 to-emerald-500/5",
    borderClass: "border-emerald-200",
  },
  error: {
    icon: XCircle,
    iconClass: "text-red-500",
    accentClass: "from-red-500/20 to-red-500/5",
    borderClass: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    accentClass: "from-amber-500/20 to-amber-500/5",
    borderClass: "border-amber-200",
  },
  info: {
    icon: Info,
    iconClass: "text-sky-500",
    accentClass: "from-sky-500/20 to-sky-500/5",
    borderClass: "border-sky-200",
  },
};

const DEFAULT_DURATION = 3200;

const ToastViewport = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[2000] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:top-5 sm:right-5">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className={`relative overflow-hidden rounded-2xl border bg-white shadow-xl shadow-slate-200/60 ${style.borderClass}`}
              role="status"
              aria-live="polite"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accentClass}`} />
              <div className="flex items-start gap-3 p-4">
                <div className={`mt-0.5 shrink-0 ${style.iconClass}`}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                  {toast.title && (
                    <p className="text-sm font-bold text-slate-900">{toast.title}</p>
                  )}
                  <p className="text-sm leading-relaxed text-slate-600">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Đóng thông báo"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const ConfirmDialog = ({ dialog, onCancel, onConfirm }) => {
  if (!dialog) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2100] bg-slate-950/45 backdrop-blur-[2px]"
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-slate-300/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 id="confirm-title" className="text-lg font-bold text-slate-900">
                  {dialog.title || "Xác nhận thao tác"}
                </h3>
                <p className="text-sm text-slate-500">Thao tác này có thể không hoàn tác được.</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {dialog.message}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {dialog.cancelText || "Hủy"}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                {dialog.confirmText || "Xác nhận"}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(({ type = "info", title = "", message, duration = DEFAULT_DURATION }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toast = { id, type, title, message };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [dismiss]);

  const success = useCallback((message, options = {}) => show({ type: "success", message, ...options }), [show]);
  const error = useCallback((message, options = {}) => show({ type: "error", message, ...options }), [show]);
  const warning = useCallback((message, options = {}) => show({ type: "warning", message, ...options }), [show]);
  const info = useCallback((message, options = {}) => show({ type: "info", message, ...options }), [show]);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        ...options,
        resolve,
      });
    });
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setConfirmDialog((prev) => {
      prev?.resolve?.(false);
      return null;
    });
  }, []);

  const handleAcceptConfirm = useCallback(() => {
    setConfirmDialog((prev) => {
      prev?.resolve?.(true);
      return null;
    });
  }, []);

  const toastValue = useMemo(() => ({ show, dismiss, success, error, warning, info }), [show, dismiss, success, error, warning, info]);
  const confirmValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ToastContext.Provider value={toastValue}>
      <ConfirmContext.Provider value={confirmValue}>
        {children}
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
        <ConfirmDialog
          dialog={confirmDialog}
          onCancel={handleCancelConfirm}
          onConfirm={handleAcceptConfirm}
        />
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ToastProvider");
  }
  return context;
};
