import { Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function HotelsDashboardPage() {
  let hotelsCount = 0;
  let guestsCount = 0;
  let companionsCount = 0;
  let recentGuests: any[] = [];
  let recentCompanions: any[] = [];
  let errorMessage = "";

  try {
    // تم استخدام Promise.allSettled بدلاً من Promise.all
    // لضمان أنه لو فشل طلب واحد، لا تنهار الصفحة بالكامل وتجلب بقية البيانات المتاحة
    const results = await Promise.allSettled([
      api.get('/hotal/hotel/'),
      api.get('/hotal/person/'),
      api.get('/hotal/companions/')
    ]);

    // 1. معالجة بيانات الفنادق
    if (results[0].status === 'fulfilled') {
      const hotelsRes = results[0].value;
      if (hotelsRes.data?.success) {
        hotelsCount = hotelsRes.data.data?.count || 0;
      }
    } else {
      console.error("فشل جلب بيانات الفنادق:", results[0].reason);
    }

    // 2. معالجة بيانات النزلاء
    if (results[1].status === 'fulfilled') {
      const guestsRes = results[1].value;
      if (guestsRes.data?.success) {
        guestsCount = guestsRes.data.data?.count || 0;
        recentGuests = guestsRes.data.data?.results?.slice(0, 5) || [];
      }
    } else {
      console.error("فشل جلب بيانات النزلاء:", results[1].reason);
    }

    // 3. معالجة بيانات المرافقين
    if (results[2].status === 'fulfilled') {
      const companionsRes = results[2].value;
      if (companionsRes.data?.success) {
        companionsCount = companionsRes.data.data?.count || 0;
        recentCompanions = companionsRes.data.data?.results?.slice(0, 5) || [];
      }
    } else {
      console.error("فشل جلب بيانات المرافقين:", results[2].reason);
    }

    // إذا فشلت جميع الطلبات نُظهر رسالة خطأ للمستخدم
    if (results.every(r => r.status === 'rejected')) {
      errorMessage = "فشل في جلب الإحصائيات من الخادم";
    }

  } catch (error: any) {
    console.error("Error fetching hotel dashboard data:", error);
    errorMessage = "حدث خطأ غير متوقع أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">نظرة عامة على نظام الفنادق</h2>
          <p className="text-gray-500 text-sm">مزامنة البيانات الحية من الخادم</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/hotels/list" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center text-sm font-bold transition-colors shadow-sm">
            عرض الفنادق
          </Link>
          <Link href="/dashboard/hotels/new" className="bg-[#111827] hover:bg-gray-800 text-white px-5 py-2 rounded-md flex items-center text-sm font-bold transition-colors shadow-sm">
            إضافة فندق جديد
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-xs mb-2 text-right">إجمالي الفنادق</h3>
          <span className="text-3xl font-bold text-gray-900">{hotelsCount}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-xs mb-2 text-right">إجمالي النزلاء</h3>
          <span className="text-3xl font-bold text-gray-900">{guestsCount}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-xs mb-2 text-right">إجمالي المرافقين</h3>
          <span className="text-3xl font-bold text-gray-900">{companionsCount}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 border-r-4 border-r-warning flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-xs mb-2 text-right">نزلاء بتقييم سيئ</h3>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Right Column - Tables */}
        <div className="flex-1 space-y-6 order-2 lg:order-1">
          {/* Recent Guests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <Link href="/dashboard/hotels/guests" className="text-blue-600 text-sm font-bold hover:underline">عرض الكل</Link>
              <h3 className="font-bold text-gray-800">آخر النزلاء المسجلين</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="py-3 px-4 font-medium">النزيل</th>
                    <th className="py-3 px-4 font-medium text-center">رقم الهوية</th>
                    <th className="py-3 px-4 font-medium text-center">الفندق</th>
                    <th className="py-3 px-4 font-medium text-left">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGuests.map(guest => (
                    <tr key={guest.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-800 text-sm">{guest.name}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">{guest.number_id}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">{guest.name_hotel || "-"}</td>
                      <td className="py-4 px-4 text-left">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                          {guest.evaluation ? `${guest.evaluation} نجوم` : "بدون"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentGuests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500 text-sm">لا يوجد نزلاء</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Companions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <Link href="/dashboard/hotels/companions" className="text-blue-600 text-sm font-bold hover:underline">عرض الكل</Link>
              <h3 className="font-bold text-gray-800">آخر المرافقين المسجلين</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="py-3 px-4 font-medium">المرافق</th>
                    <th className="py-3 px-4 font-medium text-center">النزيل المرتبط</th>
                    <th className="py-3 px-4 font-medium text-center">رقم الهوية</th>
                    <th className="py-3 px-4 font-medium text-left">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCompanions.map(comp => (
                    <tr key={comp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-800 text-sm">{comp.name}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">{comp.name_person || "-"}</td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">{comp.number_id}</td>
                      <td className="py-4 px-4 text-left">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                          {comp.evaluation ? `${comp.evaluation} نجوم` : "بدون"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentCompanions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500 text-sm">لا يوجد مرافقين</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Left Column - Alerts & Status */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
               <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">0</span>
               <h3 className="text-red-500 font-bold">تنبيهات أمنية</h3>
            </div>
            <div className="p-6 text-center text-sm text-gray-500 bg-gray-50/30">
              لا توجد تنبيهات حالية.
            </div>
          </div>

          <div className="bg-[#111827] rounded-lg border border-gray-800 overflow-hidden shadow-md text-white p-6 relative">
            <h3 className="font-bold text-lg mb-6 text-right">حالة النظام <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span></h3>
            
            <div className="space-y-4 text-right">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-green-500 text-sm font-bold">مستقر</span>
                <span className="text-gray-400 text-sm">اتصال قواعد البيانات</span>
              </div>
              
              <div className="pt-6">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[100%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}