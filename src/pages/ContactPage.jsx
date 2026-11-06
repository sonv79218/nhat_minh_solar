// ============================================
// CONTACT PAGE - ĐIỆN MẶT TRỜI NHẬT MINH
// Solar Energy Company Contact Page
// ============================================

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { describeFirebaseError } from "@/utils/firebaseErrors";
import { company } from "@/config/companyConfig";

const contactItems = [
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: company.address.full,
  },
  {
    icon: Phone,
    label: "Hotline",
    value: company.phones.hotline.display,
    href: company.phones.hotline.href,
  },
  {
    icon: Phone,
    label: "Kỹ thuật",
    value: company.phones.technical.display,
    href: company.phones.technical.href,
  },
  {
    icon: MessageCircle,
    label: "Zalo",
    value: "0876 906 668",
    href: "https://zalo.me/0876906668",
  },
  {
    icon: Mail,
    label: "Email",
    value: company.email.display,
    href: company.email.href,
  },
  {
    icon: Clock,
    label: "Giờ làm việc",
    value: company.workingHours,
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName.trim() || !form.phone.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "contact_requests"), {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceType: form.serviceType.trim(),
        message: form.message.trim(),
        status: "new",
        createdAt: serverTimestamp(),
      });

      setForm({ fullName: "", phone: "", email: "", serviceType: "", message: "" });
      setSuccess("Yêu cầu đã được gửi thành công! Nhật Minh sẽ liên hệ với bạn trong 30 phút.");
    } catch (submitError) {
      console.error(submitError);
      setError(
        describeFirebaseError(
          submitError,
          "Có lỗi xảy ra. Vui lòng gọi hotline 0876 906 668 để được hỗ trợ.",
          false
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 md:text-base";

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* CONTACT CONTENT */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          {/* CONTACT INFO */}
          <div className="animate-contact-fade-up">
            <div className="sticky top-28">

              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-4xl">
                Nhật Minh Công Nghệ Group
              </h2>

              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                Chuyên cung cấp, tư vấn và lắp đặt hệ thống điện mặt trời chất lượng cao. Khảo sát miễn phí tại nhà trong vòng 24h.
              </p>

              <div className="mt-9 divide-y divide-slate-200 border-y border-slate-200">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="group grid grid-cols-[42px_1fr] gap-4 py-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition duration-300 group-hover:bg-amber-500 group-hover:text-white">
                        <Icon size={19} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.label}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                            className="mt-1 block text-sm leading-6 text-slate-600 transition hover:text-amber-600 md:text-base"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm leading-6 text-slate-600 md:text-base">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>


            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="animate-contact-fade-up contact-delay-150">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-9 lg:p-10"
            >
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 md:text-sm">
                  Yêu cầu tư vấn
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-4xl">
                  Gửi thông tin cho chúng tôi
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Nhật Minh sẽ liên hệ trong 30 phút để tư vấn giải pháp điện mặt trời phù hợp nhất.
                </p>
              </div>

              {error && (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                  {success}
                </div>
              )}

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-800">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-800">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>


              <div className="mt-5">
                <label htmlFor="serviceType" className="mb-2 block text-sm font-semibold text-slate-800">
                  Dịch vụ quan tâm
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  <option value="Điện mặt trời gia đình">Điện mặt trời gia đình</option>
                  <option value="Điện mặt trời doanh nghiệp">Điện mặt trời doanh nghiệp</option>
                  <option value="Hệ thống Hybrid / Lưu trữ">Hệ thống Hybrid / Lưu trữ</option>
                  <option value="Bảo trì & Sửa chữa">Bảo trì & Sửa chữa</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-800">
                  Nội dung cần tư vấn
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClassName} resize-none`}
                  placeholder="Ví dụ: Nhà tôi 3 tầng, cần lắp điện mặt trời 5kW, muốn tiết kiệm chi phí điện..."
                />
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-500 md:text-sm">
                  Thông tin của bạn chỉ được sử dụng để liên hệ tư vấn và hỗ trợ dịch vụ điện mặt trời.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 md:text-base"
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                  {!loading && <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>



      {/* PAGE ANIMATIONS */}
      <style>{`
        @keyframes contactFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-contact-fade-up {
          opacity: 0;
          animation: contactFadeUp 0.75s ease-out forwards;
        }
        .contact-delay-150 { animation-delay: 150ms; }
        @media (prefers-reduced-motion: reduce) {
          .animate-contact-fade-up { opacity: 1; animation: none; }
        }
      `}</style>
    </main>
  );
};

export default ContactPage;
