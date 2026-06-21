import { Search, Filter, ShieldAlert, CheckCircle, Users, Zap, Eye, Edit, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Companion } from "@/types/hotel";
import DeleteButton from "@/components/DeleteButton";
import CompanionFilters from "@/components/CompanionFilters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

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
      <PageHeader 
        title="إدارة المرافقين"
        description="تتبع وإدارة بيانات المرافقين المسجلين مع النزلاء الأساسيين في المنشأة."
        breadcrumbs={[{ label: "الفنادق", href: "/dashboard/hotels" }, { label: "المرافقين", active: true }]}
        addLink="/dashboard/hotels/companions/new"
        addLabel="إضافة مرافق جديد"
        can = "add_companions"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي المرافقين"
          value={totalCompanions}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="نشط حالياً"
          value={totalCompanions}
          icon={<Zap className="w-5 h-5 text-emerald-500" />}
          iconBgClassName="bg-green-50"
          valueClassName="text-emerald-500"
        />
        <StatCard 
          title="تقييمات ممتازة"
          value="0"
          icon={<CheckCircle className="w-5 h-5 text-yellow-500" />}
          iconBgClassName="bg-yellow-50"
        />
        <StatCard 
          title="تنبيهات"
          value="0"
          icon={<ShieldAlert className="w-5 h-5 text-red-500" />}
          iconBgClassName="bg-red-50"
          valueClassName="text-red-500"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
            <CompanionFilters hotels={hotelsList} nationalities={nationalitiesList} />
          </Suspense>
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
                       
                        <Can permission="change_companions">
                        <Link href={`/dashboard/hotels/companions/${comp.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        </Can>
                        <Can permission="delete_companions">
                        <DeleteButton endpoint="/hotal/companions/" id={comp.id} permission="delete_companions" />
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState message="لا يوجد مرافقين مسجلين حالياً" colSpan={8} />
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

