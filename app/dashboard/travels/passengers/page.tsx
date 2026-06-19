import { Plus, Search, Eye, Edit, Trash2, UserCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Traveler } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import PassengerFilters from "@/components/travels/PassengerFilters";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

export const dynamic = 'force-dynamic';

export default async function PassengersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const trip = typeof searchParams.trip === 'string' ? searchParams.trip : undefined;
  const nationality = typeof searchParams.nationality === 'string' ? searchParams.nationality : undefined;
  const trip__travel = typeof searchParams.trip__travel === 'string' ? searchParams.trip__travel : undefined;
  const type_id = typeof searchParams.type_id === 'string' ? searchParams.type_id : undefined;

  let travelers: Traveler[] = [];
  let totalTravelers = 0;
  let errorMessage = "";
  let tripsList: any[] = [];
  let nationalitiesList: any[] = [];
  let companiesList: any[] = [];

  try {
    const [tripsRes, natRes, compRes] = await Promise.all([
      api.get('/office_travel/trip/'),
      api.get('/office_security/nationality/'),
      api.get('/office_travel/travel/')
    ]);
    if (tripsRes.data?.success) tripsList = tripsRes.data.data.results || [];
    if (natRes.data?.success) nationalitiesList = natRes.data.data.results || [];
    if (compRes.data?.success) companiesList = compRes.data.data.results || [];

    const response = await api.get<ApiResponse<Traveler>>('/office_travel/traveler/', { 
      params: { search, trip, nationality, trip__travel, type_id } 
    });
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
      <PageHeader 
        title="إدارة بيانات المسافرين"
        description="استعراض وتحديث سجلات المسافرين وحالاتهم الأمنية والتقييمية."
        breadcrumbs={[{ label: "السفريات", href: "/dashboard/travels" }, { label: "المسافرين", active: true }]}
        addLink="/dashboard/travels/passengers/add"
        addLabel="إضافة مسافر جديد"
        can="add_traveler"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي المسافرين"
          value={totalTravelers}
        />
        <StatCard 
          title="تقييم ممتاز"
          value="—"
          valueClassName="text-success"
        />
        <StatCard 
          title="تقييم سيئ"
          value="—"
          valueClassName="text-danger"
        />
        <StatCard 
          title="رحلات اليوم"
          value="—"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col lg:flex-row justify-between items-center gap-4 text-right">
          <h3 className="font-bold text-gray-800 text-lg w-full lg:w-auto text-right">قائمة المسافرين المسجلين</h3>
          <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full lg:w-2/3"></div>}>
            <PassengerFilters trips={tripsList} nationalities={nationalitiesList} companies={companiesList} />
          </Suspense>
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
                      <Can permission="change_traveler">
                        <Link href={`/dashboard/travels/passengers/${traveler.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Can>
                      <Can permission="delete_traveler">
                        <DeleteButton endpoint="/office_travel/traveler/" id={traveler.id} />
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
              {travelers.length === 0 && !errorMessage && (
                <EmptyState message="لا يوجد مسافرين مسجلين" colSpan={8} />
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
