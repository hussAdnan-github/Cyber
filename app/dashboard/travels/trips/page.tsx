import { Plus, Eye, Edit, Trash2, Calendar, MapPin, Search, AlertCircle, Clock, Users, Filter, Bus, RotateCw, Ban, Printer, Download } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Trip } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";
import TripFilters from "@/components/TripFilters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

export const dynamic = 'force-dynamic';

export default async function TripsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const travel = typeof searchParams.travel === 'string' ? searchParams.travel : undefined;
  const line_travel = typeof searchParams.line_travel === 'string' ? searchParams.line_travel : undefined;

  let trips: Trip[] = [];
  let totalTrips = 0;
  let errorMessage = "";
  let companiesList: any[] = [];
  let linesList: any[] = [];

  try {
    const [companiesRes, linesRes] = await Promise.all([
      api.get('/office_travel/travel/'),
      api.get('/office_travel/line_travel/')
    ]);
    
    if (companiesRes.data?.success) companiesList = companiesRes.data.data.results || [];
    if (linesRes.data?.success) linesList = linesRes.data.data.results || [];

    const response = await api.get<ApiResponse<Trip>>('/office_travel/trip/', {
      params: { search, travel, line_travel }
    });
    if (response.data.success) {
      trips = response.data.data.results;
      totalTrips = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch trips:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="إدارة الرحلات"
        description="مراقبة وتنسيق جميع رحلات السفر الجارية والمجدولة."
        breadcrumbs={[{ label: "السفريات", href: "/dashboard/travels" }, { label: "الرحلات", active: true }]}
        addLink="/dashboard/travels/trips/add"
        addLabel="جدولة رحلة جديدة"
        addButtonClassName="bg-[#059669] hover:bg-emerald-700 text-white"
        can="add_trip"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي الرحلات"
          value={totalTrips}
          icon={<Bus className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="رحلات اليوم"
          value="—"
          icon={<RotateCw className="w-5 h-5 text-success" />}
          iconBgClassName="bg-green-50"
        />
        <StatCard 
          title="قيد الانتظار"
          value="—"
          icon={<Clock className="w-5 h-5 text-warning" />}
          iconBgClassName="bg-orange-50"
        />
        <StatCard 
          title="رحلات ملغاة"
          value="0"
          icon={<Ban className="w-5 h-5 text-danger" />}
          iconBgClassName="bg-red-50"
          valueClassName="text-danger"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col lg:flex-row justify-between items-center gap-4 text-right">
          <h3 className="font-bold text-gray-800 text-lg w-full lg:w-auto text-right">جدول الرحلات التفصيلي</h3>
          <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full lg:w-2/3"></div>}>
            <TripFilters companies={companiesList} lines={linesList} />
          </Suspense>
          <div className="flex gap-2 w-full lg:w-auto justify-end">
            <button className="text-gray-400 hover:text-gray-600 p-1.5 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 p-1.5 transition-colors">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-white">
                <th className="py-4 px-6 font-medium text-right">خط السفر</th>
                <th className="py-4 px-6 font-medium text-right">شركة السفر</th>
                <th className="py-4 px-6 font-medium text-center">السائق</th>
                <th className="py-4 px-6 font-medium text-center">هاتف السائق</th>
                <th className="py-4 px-6 font-medium text-center">رقم السيارة</th>
                <th className="py-4 px-6 font-medium text-center">تاريخ الرحلة</th>
                <th className="py-4 px-6 font-medium text-center">المسافرين</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-800 text-sm">
                    {trip.line_travel?.place_from} - {trip.line_travel?.place_to}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 flex items-center justify-end gap-2">
                    {trip.name_travel}
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">{trip.driver}</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">{trip.driver_phone}</td>
                  <td className="py-4 px-6 text-center font-bold text-gray-800 text-sm">{trip.car_number}</td>
                  <td className="py-4 px-6 text-center text-xs text-gray-500">
                    {new Date(trip.date_trip).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded text-xs font-bold">—</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-200">مجدولة</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/travels/trips/details/${trip.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Can permission="change_trip">
                        <Link href={`/dashboard/travels/trips/${trip.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Can>
                      <Can permission="delete_trip">
                        <DeleteButton endpoint="/office_travel/trip/" id={trip.id} />
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && !errorMessage && (
                <EmptyState message="لا توجد رحلات مسجلة" colSpan={9} />
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-primary bg-primary text-white font-bold">1</button>
          </div>
          <div>عرض {totalTrips} رحلة</div>
        </div>
      </div>
    </div>
  );
}
