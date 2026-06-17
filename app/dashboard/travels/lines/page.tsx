import { Plus, Eye, Edit, Trash2, Map, Activity, Building, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { LineTravel } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";
import LineFilters from "@/components/LineFilters";

export const dynamic = 'force-dynamic';

export default async function LinesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const place_from = typeof searchParams.place_from === 'string' ? searchParams.place_from : undefined;
  const place_to = typeof searchParams.place_to === 'string' ? searchParams.place_to : undefined;

  let lines: LineTravel[] = [];
  let totalLines = 0;
  let errorMessage = "";
  let placesList: any[] = [];

  try {
    const placesRes = await api.get('/office_security/places/');
    if (placesRes.data?.success) placesList = placesRes.data.data.results || [];

    const response = await api.get<ApiResponse<LineTravel>>('/office_travel/line_travel/', {
      params: { place_from, place_to }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">خطوط السفر</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm bg-white rounded-lg p-1 shadow-sm border border-gray-100">
             <button className="px-4 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">بحري</button>
             <button className="px-4 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">بري</button>
             <button className="px-4 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">جوي</button>
             <button className="px-4 py-1.5 rounded-md bg-blue-600 text-white font-bold transition-colors shadow-sm">الكل</button>
             <span className="text-xs font-bold text-gray-500 mr-2 ml-1">تصفية حسب نوع السفر</span>
          </div>
          <Link href="/dashboard/travels/lines/add" className="bg-success hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
            إضافة خط سفر جديد
            <Plus className="w-4 h-4 ml-2" />
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
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Map className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">إجمالي المسارات</h3>
            <span className="text-2xl font-bold text-gray-900">{totalLines}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">الرحلات النشطة</h3>
            <span className="text-2xl font-bold text-gray-900">—</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">شركات النقل</h3>
            <span className="text-2xl font-bold text-gray-900">—</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">المسافرون اليوم</h3>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4 text-right flex-row-reverse">
          <h3 className="font-bold text-gray-800 text-lg shrink-0">تفاصيل خطوط السفر</h3>
          <LineFilters places={placesList} />
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
                      <Link href={`/dashboard/travels/lines/${line.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton endpoint="/office_travel/line_travel/" id={line.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {lines.length === 0 && !errorMessage && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    لا توجد خطوط سفر مسجلة
                  </td>
                </tr>
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
