// ============================================
// SOLAR CALCULATOR — MAIN PAGE
// Điện Mặt Trời Nhật Minh
// Redesigned: synced with website brand — dark navy + green accent
// ============================================
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import StepRegion from "@/features/calculator/steps/StepRegion";
import StepBill from "@/features/calculator/steps/StepBill";
import StepNeeds from "@/features/calculator/steps/StepNeeds";
import StepRoof from "@/features/calculator/steps/StepRoof";
import StepUsage from "@/features/calculator/steps/StepUsage";
import ResultPanel from "@/features/calculator/ResultPanel";

const STEPS = [
  { id: 1, label: "Khu vực" },
  { id: 2, label: "Hóa đơn" },
  { id: 3, label: "Nhu cầu" },
  { id: 4, label: "Mái nhà" },
  { id: 5, label: "Thói quen" },
];

const DEFAULT_FORM = {
  regionId: "", region: "", province: "",
  monthlyBill: "", buildingType: "Home",
  needs: "", hasBackup: false, hasEv: false,
  frequentBlackouts: false, expandLoad: false,
  roofType: "", roofArea: "", shading: "",
  dayNightRatio: 40, systemPhase: "",
};

export default function SolarCalculatorPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showResult, setShowResult] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    switch (step) {
      case 1: return !!form.regionId;
      case 2: return form.monthlyBill > 0;
      case 3: return !!form.needs;
      case 4: return !!form.roofType;
      case 5: return !!form.systemPhase;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 5) { setStep((s) => s + 1); }
    else { setShowResult(true); }
  };

  const handleBack = () => {
    if (step > 1) { setStep((s) => s - 1); }
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setStep(1);
    setShowResult(false);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const renderStep = () => {
    if (showResult) return <ResultPanel form={form} onReset={handleReset} onBack={handleBack} />;
    switch (step) {
      case 1: return <StepRegion form={form} update={update} />;
      case 2: return <StepBill form={form} update={update} />;
      case 3: return <StepNeeds form={form} update={update} />;
      case 4: return <StepRoof form={form} update={update} />;
      case 5: return <StepUsage form={form} update={update} />;
      default: return null;
    }
  };

  return (
    <MainLayout>


      {/* ─── Progress bar strip ─── */}
      {!showResult && (
        <div className="bg-[#0d1c33] border-b border-white/5">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-5">
              {STEPS.map((s, i) => {
                const done = s.id < step;
                const active = s.id === step;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                        done ? "bg-green-500 text-white" : active ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-white/5 text-white/30"
                      }`}>
                        {done ? (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : s.id}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${active ? "text-green-400" : done ? "text-white/60" : "text-white/30"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-8 sm:w-14 h-px transition-colors ${done ? "bg-green-500" : "bg-white/10"}`} />
                    )}
                  </div>
                );
              })}
              <span className="ml-auto text-xs text-white/30 hidden sm:block">
                Bước {step}/5
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main content area ─── */}
      <section className="w-full bg-slate-50 py-8 sm:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Result panel is full-width */}
          {showResult ? (
            <ResultPanel form={form} onReset={handleReset} onBack={handleBack} />
          ) : (
            <div className="flex gap-6 items-start">
              {/* Left column: step card */}
              <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Step header */}
                <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-0.5">
                    Bước {step}/5
                  </p>
                  <h2 className="text-lg font-bold text-slate-900">
                    {STEPS[step - 1]?.label}
                  </h2>
                </div>
                {/* Step content */}
                <div className="px-6 py-6">
                  {renderStep()}
                </div>
              </div>

              {/* Right column: sticky sidebar */}
              <div className="hidden lg:block w-72 shrink-0 space-y-4">
                {/* Progress indicator */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                    Tiến độ
                  </p>
                  <div className="space-y-2">
                    {STEPS.map((s) => {
                      const done = s.id < step;
                      const active = s.id === step;
                      return (
                        <div key={s.id} className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                            done ? "bg-green-500 text-white" : active ? "bg-green-500/20 text-green-400 border border-green-400/40" : "bg-slate-100 text-slate-400"
                          }`}>
                            {done ? "✓" : s.id}
                          </div>
                          <span className={`text-sm ${active ? "font-semibold text-slate-900" : done ? "text-slate-500" : "text-slate-300"}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary of completed steps */}
                {form.region && (
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Đã hoàn thành
                    </p>
                    <div className="space-y-2">
                      {form.province && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Khu vực</span>
                          <span className="text-xs font-semibold text-slate-700">{form.province}</span>
                        </div>
                      )}
                      {form.monthlyBill > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Tiền điện</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {new Intl.NumberFormat("vi-VN").format(form.monthlyBill)} ₫
                          </span>
                        </div>
                      )}
                      {form.needs && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Mục tiêu</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {form.needs === "reduce" ? "Giảm tiền điện" :
                             form.needs === "backup" ? "Có điện dự phòng" :
                             form.needs === "both" ? "Kết hợp" : "Tư vấn"}
                          </span>
                        </div>
                      )}
                      {form.roofType && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Loại mái</span>
                          <span className="text-xs font-semibold text-slate-700">{form.roofType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA card */}
                <div className="bg-[#0b1628] rounded-xl p-5">
                  <p className="text-sm font-bold text-white mb-1">Cần hỗ trợ?</p>
                  <p className="text-xs text-white/40 mb-3 leading-relaxed">
                    Đội ngũ kỹ thuật Nhật Minh sẵn sàng tư vấn miễn phí 24/7.
                  </p>
                  <a
                    href="tel:0876906668"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
                    </svg>
                    0876 906 668
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Mobile navigation buttons */}
          {!showResult && (
            <div className="mt-6 flex gap-3 lg:hidden">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2 h-12 px-5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Quay lại
                </button>
              ) : <div className="w-[88px]" />}
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-lg font-semibold text-sm transition-colors ${
                  canNext()
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {step < 5 ? (
                  <><span>{step === 4 ? "Bước cuối" : "Tiếp tục"}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                ) : (
                  <><span>Xem kết quả</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M8 3l5 5m0 0L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                )}
              </button>
            </div>
          )}

          {/* Desktop navigation buttons */}
          {!showResult && (
            <div className="hidden lg:flex items-center justify-between mt-6">
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${step > 1 ? "text-slate-500 hover:text-slate-700" : "invisible"}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Quay lại bước trước
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Bước {step}/5 — {STEPS[step - 1]?.label}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm transition-colors ${
                    canNext()
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {step < 5 ? (
                    <><span>{step === 4 ? "Sang bước cuối" : "Tiếp tục"}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                  ) : (
                    <><span>Xem kết quả dự kiến</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M8 3l5 5m0 0L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
