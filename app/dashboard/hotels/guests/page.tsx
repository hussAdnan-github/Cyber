import { Search, Filter, ShieldAlert, CheckCircle, Users, Zap, Eye, Edit, AlertCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {Guest} from "@/types/hotel";
import DeleteButton from "@/components/DeleteButton";
import GuestFilters from "@/components/GuestFilters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

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
      <PageHeader 
        title="إدارة النزلاء"
        description="تتبع وإدارة بيانات النزلاء المسجلين في المنشآت الفندقية."
        breadcrumbs={[{ label: "الفنادق", href: "/dashboard/hotels" }, { label: "النزلاء", active: true }]}
        addLink="/dashboard/hotels/guests/new"
        addLabel="إضافة نزيل جديد"
        can="add_person"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي النزلاء"
          value={totalGuests}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="نشط حالياً"
          value={totalGuests}
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
            <GuestFilters hotels={hotelsList} nationalities={nationalitiesList} />
          </Suspense>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center">صورة الهوية</th>
                <th className="py-4 px-6 font-medium">الاسم الكامل</th>
                <th className="py-4 px-6 font-medium text-center">الفندق المرتبط</th>
                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">التقييم</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
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
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800 text-sm">{guest.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {guest.updated_at ? `تم التحديث: ${new Date(guest.updated_at).toLocaleDateString('ar-SA')}` : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.name_hotel || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.name_nationality || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{guest.number_id}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-600 text-xs font-bold">
                        {guest.evaluation ? `${guest.evaluation} نجوم` : "بدون تقييم"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">نشط</span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex gap-2 justify-end">
                       
                        <Can permission="add_companions">
                          <Link href={`/dashboard/hotels/companions/new?person_id=${guest.id}`} title="إضافة مرافق" className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md border border-emerald-100 transition-colors">
                            <UserPlus className="w-4 h-4" />
                          </Link>
                        </Can>

                        <Link href={`/dashboard/hotels/guests/details/${guest.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                       
                        <Can permission="change_person">
                        <Link href={`/dashboard/hotels/guests/${guest.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        </Can>
                        <Can permission="delete_person">
                        <DeleteButton endpoint="/hotal/person/" id={guest.id} />
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState message="لا يوجد نزلاء مسجلين حالياً" colSpan={8} />
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>عرض {totalGuests} نزيل</div>
        </div>
      </div>
    </div>
  );
}