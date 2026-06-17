import { Search, Filter, ShieldAlert, CheckCircle, Users, Zap, Eye, Edit, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Companion } from "@/types/hotel";
import DeleteButton from "@/components/DeleteButton";
import CompanionFilters from "@/components/CompanionFilters";

export const dynamic = 'force-dynamic';

export default async function CompanionsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const person__hotel = typeof searchParams.person__hotel === 'string' ? searchParams.person__hotel : undefined;
  const type_id = typeof searchParams.type_id === 'string' ? searchParams.type_id : undefined;
  const nationality = typeof searchParams.nationality === 'string' ? searchParams.nationality : undefined;

  let companions: Companion[] = [];
  let errorMessage = "";
  let totalCompanions = 0;
  let hotelsList: any[] = [];
  let nationalitiesList: any[] = [];

  try {
    const [companionsRes, hotelsRes, nationalitiesRes] = await Promise.all([
      api.get<ApiResponse<Companion>>("/hotal/companions/", { params: { search, person__hotel, type_id, nationality } }),
      api.get('/hotal/hotel/'),
      api.get('/office_security/nationality/')
    ]);

    if (companionsRes.data && companionsRes.data.success) {
      companions = companionsRes.data.data.results || [];
      totalCompanions = companionsRes.data.data.count || companions.length;
    } else {
      errorMessage = companionsRes.data?.message || "فشل في جلب البيانات من الخادم";
    }

    if (hotelsRes.data?.success) hotelsList = hotelsRes.data.data.results || [];
    if (nationalitiesRes.data?.success) nationalitiesList = nationalitiesRes.data.data.results || [];
  } catch (error: any) {
    errorMessage = error.response?.data?.message || error.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم";
    console.error("Error fetching companions:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">إدارة المرافقين</h2>
          <p className="text-gray-500 text-sm">تتبع وإدارة بيانات المرافقين المسجلين مع النزلاء الأساسيين في المنشأة.</p>
        </div>
        <Link href="/dashboard/hotels/companions/new" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
          إضافة مرافق جديد
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">إجمالي المرافقين</h3>
            <span className="text-2xl font-bold text-gray-900">{totalCompanions}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">نشط حالياً</h3>
            <span className="text-2xl font-bold text-emerald-500">{totalCompanions}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">تقييمات ممتازة</h3>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-right">
            <h3 className="text-gray-500 text-xs mb-1">تنبيهات</h3>
            <span className="text-2xl font-bold text-red-500">0</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <CompanionFilters hotels={hotelsList} nationalities={nationalitiesList} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center">صورة الهوية</th>
                <th className="py-4 px-6 font-medium">الاسم الكامل</th>
                <th className="py-4 px-6 font-medium text-center">النزيل المرتبط</th>
                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">التقييم</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {companions.length > 0 ? (
                companions.map((comp) => (
                  <tr key={comp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-md border border-gray-200 mx-auto flex items-center justify-center overflow-hidden">
                        {comp.pic ? (
                          <img src={comp.pic} alt={comp.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">صورة</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800 text-sm">{comp.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {comp.updated_at ? `تم التحديث: ${new Date(comp.updated_at).toLocaleDateString('ar-SA')}` : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{comp.name_person || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{comp.name_nationality || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{comp.number_id}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-600 text-xs font-bold">
                        {comp.evaluation ? `${comp.evaluation} نجوم` : "بدون تقييم"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">نشط</span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/dashboard/hotels/companions/details/${comp.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/hotels/companions/${comp.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton endpoint="/hotal/companions/" id={comp.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    لا يوجد مرافقين مسجلين حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>عرض {totalCompanions} مرافق</div>
        </div>
      </div>
    </div>
  );
}
