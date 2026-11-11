// Kiểm thử bộ dữ liệu mẫu cho công thức Solar Calculator (mục 12)
// Chạy: node scripts/verify-calculator.mjs
//
// Quy ước VAT:
// - Công thức GỐC đối chiếu (mục 12): tính trực tiếp từ hóa đơn trên biểu giá
//   (VAT = 0) → 1.400.000đ = 516,38 kWh → 6,89 kWp → 12 tấm → 7,44 kWp.
// - Thực tế app: hóa đơn đã gồm VAT 8% nên phải chia (1+VAT) trước khi bóc bậc
//   → 1.400.000đ = 486,37 kWh. Cả hai đường đều được kiểm thử dưới đây.
import {
  calculateMonthlyKwhFromBill,
  calculateDailyConsumption,
  calculateTargetDailyConsumption,
  calculateSolarCapacity,
  calculatePanelCount,
  calculateActualCapacity,
  calculateRoofArea,
  calculateDayNightConsumption,
  calculateBatteryCapacity,
  calculateMonthlyProduction,
  calculateAnnualProduction,
  calculateSystemType,
  calculateSolution,
  ELECTRICITY_TIERS,
} from "../src/features/calculator/data/calculatorData.js";

let pass = 0;
let fail = 0;

const check = (label, actual, expected, tolerance = 0.01) => {
  const ok = typeof expected === "number"
    ? Math.abs(actual - expected) <= tolerance
    : actual === expected;
  if (ok) {
    pass++;
    console.log(`  PASS  ${label}: ${actual}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label}: nhận ${actual}, kỳ vọng ${expected}`);
  }
};

console.log("\n=== 1. Đối chiếu công thức gốc (VAT=0): 1.400.000đ → 516,38 kWh ===");
const monthlyKwhGross = calculateMonthlyKwhFromBill(1400000, ELECTRICITY_TIERS, 0);
check("kWh/tháng (chưa VAT)", monthlyKwhGross, 516.38, 0.5);

console.log("\n=== 1b. Thực tế app (VAT 8%): 1.400.000đ → ~486 kWh ===");
const monthlyKwh = calculateMonthlyKwhFromBill(1400000);
check("kWh/tháng (đã trừ VAT)", monthlyKwh, 486.37, 0.5);

const baseKwh = monthlyKwhGross; // dùng số liệu gốc để đối chiếu mục 12

console.log("\n=== 2. Điện/ngày & mục tiêu (dự phòng 0%) ===");
const daily = calculateDailyConsumption(baseKwh);
check("kWh/ngày", daily, 17.21, 0.05);
const target = calculateTargetDailyConsumption(daily, 0);
check("kWh/ngày mục tiêu", target, 17.21, 0.05);

console.log("\n=== 3. Công suất lý thuyết (PSH 2.5, hiệu suất 100%) ===");
const required100 = calculateSolarCapacity(target, 2.5, 1.0, 1.0);
check("kWp lý thuyết", required100, 6.89, 0.03);
const required80 = calculateSolarCapacity(target, 2.5, 0.8, 1.0);
check("kWp với hiệu suất 80%", required80, 8.61, 0.06);

console.log("\n=== 4. Số tấm & công suất thực tế (620Wp, 2.7m²) ===");
const count = calculatePanelCount(required100, 620);
check("số tấm (làm tròn lên, 11×620=6,82 < 6,89 nên phải 12)", count, 12);
const actual = calculateActualCapacity(count, 620);
check("kWp thực tế", actual, 7.44, 0.01);

console.log("\n=== 5. Diện tích mái (×1.1) ===");
const roof = calculateRoofArea(count, 2.7, 1.1);
check("m²", roof, 35.64, 0.01);

console.log("\n=== 6. Điện ngày / đêm (ban đêm 60%) ===");
const { dayKwh, nightKwh } = calculateDayNightConsumption(target, 60);
check("kWh ban đêm", nightKwh, 10.33, 0.05);
check("kWh ban ngày", dayKwh, 6.88, 0.05);

console.log("\n=== 7. Dung lượng pin (DOD 90%, hiệu suất pin 90%) ===");
const batt = calculateBatteryCapacity(nightKwh, 0.9, 0.9);
check("dung lượng danh định", batt.nominal, 12.75, 0.03);
check("dung lượng thương mại (làm tròn lên)", batt.suggested, 15);
check("dung lượng dùng thực tế", batt.usable, 12.15, 0.05);

console.log("\n=== 8. Sản lượng (PSH 2.5, eff 100%) ===");
const dailyProd = actual * 2.5 * 1.0 * 1.0;
check("kWh/ngày", Math.round(dailyProd * 100) / 100, 18.6, 0.05);
const monthlyProd = calculateMonthlyProduction(dailyProd);
check("kWh/tháng", Math.round(monthlyProd), 558);
const annualProd = calculateAnnualProduction(dailyProd);
check("kWh/năm", Math.round(annualProd), 6789);

console.log("\n=== 9. Phân loại hệ thống theo nhu cầu ===");
check("reduce + không mất điện → OnGrid",
  calculateSystemType({ needs: "reduce", frequentBlackouts: false }).type, "OnGrid");
check("backup → Hybrid",
  calculateSystemType({ needs: "backup" }).type, "Hybrid");
check("both → Hybrid",
  calculateSystemType({ needs: "both" }).type, "Hybrid");
check("mất điện thường xuyên → Hybrid",
  calculateSystemType({ needs: "reduce", frequentBlackouts: true }).type, "Hybrid");
check("reduce + đêm cao vẫn ưu tiên OnGrid",
  calculateSystemType({ needs: "reduce", frequentBlackouts: false, nightRatio: 90 }).type, "OnGrid");

console.log("\n=== 10. Che bóng ảnh hưởng công suất & số tấm ===");
const noShade = calculateSolution({
  monthlyBill: 1400000, regionId: "north", needs: "reduce",
  shading: "Không đáng kể", panelWatt: 620, dayNightRatio: 60,
});
const heavyShade = calculateSolution({
  monthlyBill: 1400000, regionId: "north", needs: "reduce",
  shading: "Nhiều", panelWatt: 620, dayNightRatio: 60,
});
check("không che bóng → 1.0", noShade.shadingFactor, 1.0);
check("che bóng nhiều → 0.55", heavyShade.shadingFactor, 0.55);
console.log(`        không che bóng: ${noShade.panelCount} tấm / ${noShade.capacityKw} kWp`);
console.log(`        che bóng nhiều:  ${heavyShade.panelCount} tấm / ${heavyShade.capacityKw} kWp`);
if (heavyShade.panelCount > noShade.panelCount) {
  pass++;
  console.log("  PASS  che bóng làm TĂNG số tấm pin đề xuất");
} else {
  fail++;
  console.log("  FAIL  che bóng phải làm tăng số tấm pin đề xuất");
}

console.log("\n=== 11. Không cần backup → không tự động lắp pin ===");
const reduceSolution = calculateSolution({
  monthlyBill: 1400000, regionId: "north", needs: "reduce",
  shading: "Không đáng kể", panelWatt: 620, dayNightRatio: 60,
});
check("reduce → OnGrid", reduceSolution.systemType, "OnGrid");
check("reduce → không có pin", reduceSolution.batterySuggested, 0);

console.log("\n=== 12. Cảnh báo thiếu diện tích mái ===");
const smallRoof = calculateSolution({
  monthlyBill: 1400000, regionId: "north", needs: "reduce",
  roofArea: 20, shading: "Không đáng kể", panelWatt: 620, dayNightRatio: 60,
});
const hasDanger = smallRoof.warnings.some((w) => w.type === "danger" && w.message.includes("Diện tích mái không đủ"));
check("cảnh báo danger thiếu diện tích", hasDanger, true);

console.log("\n=== 13. OnGrid + đêm cao → cảnh báo không dự phòng ===");
const nightHeavy = calculateSolution({
  monthlyBill: 1400000, regionId: "north", needs: "reduce",
  shading: "Không đáng kể", panelWatt: 620, dayNightRatio: 80,
});
const hasNightWarn = nightHeavy.warnings.some((w) => w.message.includes("không cấp điện độc lập ban đêm") || w.message.includes("On-grid không có điện dự phòng"));
check("cảnh báo OnGrid không dự phòng", hasNightWarn, true);

console.log("\n=== 14. Dự phòng tương lai tăng mục tiêu ===");
const noReserve = calculateSolution({ monthlyBill: 1400000, regionId: "north", needs: "reduce", shading: "Không đáng kể", panelWatt: 620, futureReservePct: 0 });
const withReserve = calculateSolution({ monthlyBill: 1400000, regionId: "north", needs: "reduce", shading: "Không đáng kể", panelWatt: 620, futureReservePct: 30 });
console.log(`        dự phòng 0%:  ${noReserve.targetDailyKwh} kWh/ngày → ${noReserve.panelCount} tấm`);
console.log(`        dự phòng 30%: ${withReserve.targetDailyKwh} kWh/ngày → ${withReserve.panelCount} tấm`);
check("dự phòng 30% tăng mục tiêu", withReserve.targetDailyKwh > noReserve.targetDailyKwh, true);

console.log("\n=== 15. PSH theo vùng ===");
const north = calculateSolution({ monthlyBill: 1400000, regionId: "north", needs: "reduce", shading: "Không đáng kể", panelWatt: 620 });
const central = calculateSolution({ monthlyBill: 1400000, regionId: "central", needs: "reduce", shading: "Không đáng kể", panelWatt: 620 });
const south = calculateSolution({ monthlyBill: 1400000, regionId: "south", needs: "reduce", shading: "Không đáng kể", panelWatt: 620 });
check("Miền Bắc PSH", north.psh, 3.0);
check("Miền Trung PSH", central.psh, 3.8);
check("Miền Nam PSH", south.psh, 4.2);
console.log(`        Bắc: ${north.panelCount} tấm | Trung: ${central.panelCount} tấm | Nam: ${south.panelCount} tấm`);

console.log("\n=== 16. Không dùng bảng SOLAR_SYSTEMS cho công suất ===");
// Hóa đơn rất lớn — kết quả vẫn phải là công thức, không phải mục bảng cũ (tối đa 30 kWp)
const huge = calculateSolution({ monthlyBill: 50000000, regionId: "south", needs: "reduce", shading: "Không đáng kể", panelWatt: 620 });
console.log(`        hóa đơn 50tr → ${huge.panelCount} tấm / ${huge.capacityKw} kWp`);
check("vượt giới hạn bảng cũ 30 kWp", huge.capacityKw > 30, true);

console.log(`\n${"=".repeat(50)}`);
console.log(`KẾT QUẢ: ${pass} pass, ${fail} fail`);
console.log(`${"=".repeat(50)}\n`);
process.exit(fail > 0 ? 1 : 0);
