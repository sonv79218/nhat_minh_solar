// ============================================
// COMPANY MAP - NHẬT MINH SOLAR
// Bản đồ Google Maps ghim vị trí cửa hàng + nút mở chỉ đường
// Dùng cấu hình tập trung: src/config/companyConfig.js
// ============================================
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import {
  company,
  getMapEmbedUrl,
  getDirectionsUrl,
  getMapViewUrl,
} from "@/config/companyConfig";

const CompanyMap = ({
  className = "",
  heightClass = "h-[280px] md:h-[380px]",
  showAddress = true,
}) => {
  const embedUrl = getMapEmbedUrl();
  const directionsUrl = getDirectionsUrl();
  const viewUrl = getMapViewUrl();

  if (!embedUrl) return null;

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm ${className}`}>
      <div className={`relative w-full ${heightClass}`}>
        <iframe
          title="Bản đồ vị trí Nhật Minh Solar"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />

        {/* Nút mở Google Maps / chỉ đường */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-slate-950/85 via-slate-950/55 to-transparent p-4 md:p-5">
          {showAddress && (
            <div className="pointer-events-auto flex min-w-0 items-start gap-2 text-white">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs leading-5 md:text-sm">{company.address.full}</p>
            </div>
          )}

          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            {viewUrl && (
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 md:text-sm"
              >
                <ExternalLink size={14} />
                Xem trên Google Maps
              </a>
            )}

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/30 transition hover:from-amber-600 hover:to-amber-700 md:text-sm"
              >
                <Navigation size={14} />
                Chỉ đường
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyMap;
