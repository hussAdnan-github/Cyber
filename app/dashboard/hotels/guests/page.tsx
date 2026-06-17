import { Search, Plus, ShieldAlert, CheckCircle, Users, Eye, Edit, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Guest } from "@/types/hotel";
import DeleteButton from "@/components/DeleteButton";
import GuestFilters from "@/components/GuestFilters";

export const dynamic = 'force-dynamic';

export default async function GuestsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const hotel = typeof searchParams.hotel === 'string' ? searchParams.hotel : undefined;
  const type_id = typeof searchParams.type_id === 'string' ? searchParams.type_id : undefined;
  const nationality = typeof searchParams.nationality === 'string' ? searchParams.nationality : undefined;

  let guests: Guest[] = [];
  let errorMessage = "";
  let totalGuests = 0;
  let hotelsList: any[] = [];
  let nationalitiesList: any[] = [];

  try {
    const [guestsRes, hotelsRes, nationalitiesRes] = await Promise.all([
      api.get<ApiResponse<Guest>>("/hotal/person/", { params: { search, hotel, type_id, nationality } }),
      api.get('/hotal/hotel/'),
      api.get('/office_security/nationality/')
    ]);

    if (guestsRes.data && guestsRes.data.success) {
      guests = guestsRes.data.data.results || [];
      totalGuests = guestsRes.data.data.count || guests.length;
    } else {
      errorMessage = guestsRes.data?.message || "فشل في جلب البيانات من الخادم";
    }

    if (hotelsRes.data?.success) hotelsList = hotelsRes.data.data.results || [];
    if (nationalitiesRes.data?.success) nationalitiesList = nationalitiesRes.data.data.results || [];
  } catch (error: any) {
    errorMessage = error.response?.data?.message || error.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم";
    console.error("Error fetching guests:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">قائمة النزلاء</h2>
          <p className="text-gray-500 text-sm">إدارة بيانات وتقييمات نزلاء المنشآت الفندقية</p>
        </div>
        <Link href="/dashboard/hotels/guests/new" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
          إضافة نزيل جديد
          <Plus className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <GuestFilters hotels={hotelsList} nationalities={nationalitiesList} />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center">صورة الهوية</th>
                <th className="py-4 px-6 font-medium">الاسم الكامل</th>
                <th className="py-4 px-6 font-medium text-center">الفندق</th>
                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">التقييم</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {guests.length > 0 ? (
                guests.map((guest) => (
                  <tr key={guest.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-md border border-gray-200 mx-auto flex items-center justify-center overflow-hidden">
                        {guest.pic ? (
                          <img src={guest.pic} alt={guest.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">صورة</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-800 text-sm">{guest.name}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.name_hotel || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.name_nationality || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.number_id}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {guest.evaluation ? `${guest.evaluation} نجوم` : "بدون تقييم"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/dashboard/hotels/guests/details/${guest.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/hotels/guests/${guest.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton endpoint="/hotal/person/" id={guest.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    لا يوجد نزلاء مسجلين حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>عرض {totalGuests} نزيل</div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">إجمالي النزلاء النشطين</h3>
            <span className="text-2xl font-bold text-gray-900">{totalGuests}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">تقييمات ممتازة</h3>
            <span className="text-2xl font-bold text-emerald-500">0</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">تنبيهات أمنية</h3>
            <span className="text-2xl font-bold text-red-500">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
