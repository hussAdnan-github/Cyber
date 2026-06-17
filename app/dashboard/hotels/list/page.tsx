import { Plus, Search, Eye, Edit, Trash2, Building2, MapPin, Phone, AlertCircle, CheckCircle2, Users, UserCog, Settings, X } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Hotel } from "@/types/hotel";
import DeleteButton from "@/components/DeleteButton";
import HotelFilters from "@/components/HotelFilters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function HotelsListPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const place = typeof searchParams.place === 'string' ? searchParams.place : undefined;
  const user = typeof searchParams.user === 'string' ? searchParams.user : undefined;

  let hotels: Hotel[] = [];
  let errorMessage = "";
  let totalHotels = 0;
  let placesList: any[] = [];
  let usersList: any[] = [];

  try {
    const [hotelsRes, placesRes, usersRes] = await Promise.all([
      api.get<ApiResponse<Hotel>>("/hotal/hotel/", { params: { search, place, user } }),
      api.get('/office_security/places/'),
      api.get('/users/')
    ]);

    if (hotelsRes.data && hotelsRes.data.success) {
      hotels = hotelsRes.data.data.results || [];
      totalHotels = hotelsRes.data.data.count || hotels.length;
    } else {
      errorMessage = hotelsRes.data?.message || "فشل في جلب البيانات من الخادم";
    }

    if (placesRes.data?.success) placesList = placesRes.data.data.results || [];
    if (usersRes.data?.success) usersList = usersRes.data.data.results || [];
  } catch (error: any) {
    errorMessage = error.response?.data?.message || error.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم";
    console.error("Error fetching hotels:", error);
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="قائمة الفنادق"
        description="إدارة جميع الفنادق والمنشآت السياحية المسجلة"
        breadcrumbs={[{ label: "الفنادق", active: true }]}
        addLink=""
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي الفنادق"
          value={totalHotels}
          icon={<Building2 className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="الفنادق النشطة"
          value={totalHotels}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          iconBgClassName="bg-green-50"
          iconTextClassName="text-emerald-500"
          valueClassName="text-emerald-500"
        />
        <StatCard 
          title="إجمالي النزلاء"
          value="--"
          icon={<Users className="w-5 h-5 text-purple-500" />}
          iconBgClassName="bg-purple-50"
          iconTextClassName="text-purple-500"
        />
        <StatCard 
          title="إجمالي المرافقين"
          value="--"
          icon={<UserCog className="w-5 h-5 text-gray-500" />}
          iconBgClassName="bg-gray-50"
          iconTextClassName="text-gray-500"
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Main Table Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex-1 w-full">
            <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
              <HotelFilters places={placesList} users={usersList} />
            </Suspense>
          </div>
          
          <Link href="/dashboard/hotels/new" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center shrink-0">
            إضافة فندق جديد
            <Plus className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="py-4 px-6 font-medium">اسم الفندق</th>
                <th className="py-4 px-6 font-medium text-center">المكان</th>
                <th className="py-4 px-6 font-medium text-center">المالك</th>
                <th className="py-4 px-6 font-medium text-center">الهاتف</th>
                <th className="py-4 px-6 font-medium text-center">عدد النزلاء</th>
                <th className="py-4 px-6 font-medium text-center">تاريخ الإضافة</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                          <div className="font-bold text-gray-800 text-sm">{hotel.name}</div>
                          <div className="text-xs text-gray-400">{hotel.email || "بدون بريد"}</div>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{hotel.name_place || hotel.location}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{hotel.name_onwer || "-"}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">{hotel.phone}</td>
                    <td className="py-4 px-6 text-center font-bold text-gray-800">--</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-500">
                      {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString('ar-SA') : '-'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">نشط</span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/dashboard/hotels/details/${hotel.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/hotels/${hotel.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton endpoint="/hotal/hotel/" id={hotel.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState message="لا توجد فنادق مسجلة حالياً" colSpan={8} />
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>إجمالي النتائج: {totalHotels} فندق</div>
        </div>
      </div>
    </div>
  );
}
