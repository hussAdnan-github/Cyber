import { Plus, Eye, Edit, Trash2, Map, Activity, Building, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { LineTravel } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";
import LineFilters from "@/components/LineFilters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

export const dynamic = 'force-dynamic';

export default async function LinesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const place_from = typeof searchParams.place_from === 'string' ? searchParams.place_from : undefined;
  const place_to = typeof searchParams.place_to === 'string' ? searchParams.place_to : undefined;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  let lines: LineTravel[] = [];
  let totalLines = 0;
  let errorMessage = "";
  let placesList: any[] = [];

  try {
    const placesRes = await api.get('/office_security/places/');
    if (placesRes.data?.success) placesList = placesRes.data.data.results || [];

    const response = await api.get<ApiResponse<LineTravel>>('/office_travel/line_travel/', {
      params: { place_from, place_to, search }
    });
    if (response.data.success) {
      lines = response.data.data.results;
      totalLines = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch travel lines:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="خطوط السفر"
        description="إدارة خطوط السفر ومسارات الرحلات."
        breadcrumbs={[{ label: "السفريات", href: "/dashboard/travels" }, { label: "الخطوط", active: true }]}
        addLink="/dashboard/travels/lines/add"
        addLabel="إضافة خط سفر جديد"
        addButtonClassName="bg-success hover:bg-green-600 text-white"
        can="add_linetravel"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="إجمالي المسارات"
          value={totalLines}
          icon={<Map className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="الرحلات النشطة"
          value="—"
          icon={<Activity className="w-5 h-5 text-success" />}
          iconBgClassName="bg-green-50"
        />
        <StatCard 
          title="شركات النقل"
          value="—"
          icon={<Building className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="المسافرون اليوم"
          value="0"
          icon={<User className="w-5 h-5 text-orange-500" />}
          iconBgClassName="bg-orange-50"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-right flex-row-reverse">
          
          <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full md:w-1/2"></div>}>
            <LineFilters places={placesList} />
          </Suspense>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-right">من</th>
                <th className="py-4 px-6 font-medium text-right">إلى</th>
                <th className="py-4 px-6 font-medium text-center">المسار</th>
                <th className="py-4 px-6 font-medium text-center">النوع</th>
                <th className="py-4 px-6 font-medium text-center">الشركات</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-800 text-sm">{line.name_place_from}</td>
                  <td className="py-4 px-6 font-bold text-gray-800 text-sm">{line.name_place_to}</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">{line.track}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                      {line.type_travel === 1 ? 'بري' : line.type_travel === 2 ? 'جوي' : 'بحري'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-bold text-gray-800">{line.name_travel?.length || 0}</td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/travels/lines/details/${line.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Can permission="change_linetravel">
                        <Link href={`/dashboard/travels/lines/${line.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Can>
                      <Can permission="delete_linetravel">
                        <DeleteButton endpoint="/office_travel/line_travel/" id={line.id} />
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
              {lines.length === 0 && !errorMessage && (
                <EmptyState message="لا توجد خطوط سفر مسجلة" colSpan={6} />
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-success bg-success text-white font-bold">1</button>
          </div>
          <div>إجمالي النتائج: {totalLines} مسار</div>
        </div>
      </div>
    </div>
  );
}
