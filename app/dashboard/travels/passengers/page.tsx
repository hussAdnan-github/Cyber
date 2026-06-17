import { Plus, Search, Eye, Edit, Trash2, UserCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Traveler } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function PassengersPage() {
  let travelers: Traveler[] = [];
  let totalTravelers = 0;
  let errorMessage = "";

  try {
    const response = await api.get<ApiResponse<Traveler>>('/office_travel/traveler/');
    if (response.data.success) {
      travelers = response.data.data.results;
      totalTravelers = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch travelers:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">إدارة بيانات المسافرين</h2>
          <p className="text-gray-500 text-sm">استعراض وتحديث سجلات المسافرين وحالاتهم الأمنية والتقييمية.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
              بحث
            </button>
            <div className="relative">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right w-64"
                placeholder="بحث عن مسافر..."
                dir="rtl"
              />
            </div>
          </div>
          <Link href="/dashboard/travels/passengers/add" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
            إضافة مسافر جديد
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">إجمالي المسافرين</h3>
          <span className="text-3xl font-bold text-gray-900">{totalTravelers}</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">تقييم ممتاز</h3>
          <span className="text-3xl font-bold text-success">—</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">تقييم سيئ</h3>
          <span className="text-3xl font-bold text-danger">—</span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-xs mb-1 text-right">رحلات اليوم</h3>
          <span className="text-3xl font-bold text-gray-900">—</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 bg-white text-right">
          <h3 className="font-bold text-gray-800 text-lg">قائمة المسافرين المسجلين</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center">صورة الهوية</th>
                <th className="py-4 px-6 font-medium text-right">الاسم الكامل</th>
                <th className="py-4 px-6 font-medium text-center">الرحلة</th>
                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">الهاتف</th>
                <th className="py-4 px-6 font-medium text-center">التقييم</th>
                <th className="py-4 px-6 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((traveler) => (
                <tr key={traveler.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    {traveler.pic ? (
                      <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center mx-auto overflow-hidden">
                        <img src={traveler.pic} alt={traveler.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center mx-auto bg-gray-50">
                        <UserCircle2 className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800 text-sm">{traveler.name}</td>
                  <td className="py-4 px-6 text-center text-sm">
                    <div className="font-bold text-gray-700">TR-{traveler.trip}</div>
                    <div className="text-[10px] text-gray-400">{traveler.name_trip?.travel || "—"}</div>
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-bold text-gray-800">{traveler.name_nationality}</td>
                  <td className="py-4 px-6 text-center text-sm font-bold text-gray-800">{traveler.number_id}</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600 font-bold">{traveler.phone}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                      {traveler.evaluation}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/travels/passengers/details/${traveler.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/travels/passengers/${traveler.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton endpoint="/office_travel/traveler/" id={traveler.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {travelers.length === 0 && !errorMessage && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    لا يوجد مسافرين مسجلين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-[#0f172a] bg-[#0f172a] text-white font-bold">1</button>
          </div>
          <div>عرض {totalTravelers} من أصل {totalTravelers} مسافر</div>
        </div>
      </div>
    </div>
  );
}
