import { Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function TravelsDashboardPage() {
  let companiesCount = 0;
  let linesCount = 0;
  let tripsCount = 0;
  let passengersCount = 0;
  let recentTrips: any[] = [];
  let errorMessage = "";

  try {
    const [companiesRes, linesRes, tripsRes, passengersRes] = await Promise.all([
      api.get('/office_travel/travel/'),
      api.get('/office_travel/line_travel/'),
      api.get('/office_travel/trip/'),
      api.get('/office_travel/traveler/')
    ]);

    if (companiesRes.data?.success) companiesCount = companiesRes.data.data.count || 0;
    if (linesRes.data?.success) linesCount = linesRes.data.data.count || 0;
    if (tripsRes.data?.success) {
      tripsCount = tripsRes.data.data.count || 0;
      recentTrips = tripsRes.data.data.results?.slice(0, 5) || [];
    }
    if (passengersRes.data?.success) passengersCount = passengersRes.data.data.count || 0;
  } catch (error: any) {
    console.error("Error fetching travels dashboard data:", error);
    errorMessage = "فشل في جلب الإحصائيات من الخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">نظرة عامة على العمليات</h2>
          <p className="text-gray-500 text-sm">ملخص نشاط شركات السفر والخطوط والرحلات والمسافرين.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard/travels/companies/add" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full md:w-auto text-center">
            إضافة شركة
          </Link>
          <Link href="/dashboard/travels/trips/add" className="bg-success hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full md:w-auto text-center">
            إضافة رحلة جديدة
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">شركات السفر</h3>
          <span className="text-3xl font-bold text-gray-900 mb-1">{companiesCount}</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">خطوط السفر</h3>
          <span className="text-3xl font-bold text-gray-900 mb-1">{linesCount}</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">الرحلات المجدولة</h3>
          <span className="text-3xl font-bold text-gray-900 mb-1">{tripsCount}</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">إجمالي المسافرين</h3>
          <span className="text-3xl font-bold text-gray-900 mb-1">{passengersCount}</span>
        </div>
      </div>

      {/* Layout Content */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Right Column (Tables) */}
        <div className="flex-1 space-y-6 order-2 lg:order-1">
          {/* Recent Trips */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <Link href="/dashboard/travels/trips" className="text-primary text-xs font-bold hover:underline">عرض الكل</Link>
              <h3 className="font-bold text-gray-800 text-sm">آخر الرحلات المسجلة</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 bg-white">
                    <th className="py-3 px-4 font-medium text-center">رقم الرحلة</th>
                    <th className="py-3 px-4 font-medium text-right">السائق</th>
                    <th className="py-3 px-4 font-medium text-center">الشركة / الخط</th>
                    <th className="py-3 px-4 font-medium text-center">التاريخ والوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-center text-sm font-bold text-gray-800">{trip.id}</td>
                      <td className="py-4 px-4 text-right text-sm text-gray-700">{trip.driver}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">{trip.name_travel || "-"}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        {trip.date_trip ? new Date(trip.date_trip).toLocaleString('ar-SA') : "-"}
                      </td>
                    </tr>
                  ))}
                  {recentTrips.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">لا يوجد رحلات مسجلة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Left Column (Alerts) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="bg-red-50 p-4 border-b border-red-100 text-right">
              <h3 className="text-danger font-bold text-sm">تنبيهات أمنية</h3>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
              <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 text-right">
                <h4 className="font-bold text-gray-800 text-sm mb-1">مراجعة تقييمات منخفضة</h4>
                <p className="text-xs text-gray-500">يوجد 0 مسافر يحتاج إلى متابعة تقييمية.</p>
              </div>
              
              <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4 text-right">
                <h4 className="font-bold text-gray-800 text-sm mb-1">مراقبة الرحلات القادمة</h4>
                <p className="text-xs text-gray-500">راجع بيانات السائقين والهويات قبل موعد الانطلاق.</p>
              </div>

              <div className="mt-6 text-right">
                <h4 className="font-bold text-gray-800 text-sm mb-4">مسافرون بتقييم منخفض</h4>
                <div className="text-center text-xs text-gray-500 py-8">
                  لا توجد تقييمات منخفضة حالياً.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
