import { Plus, Search, Eye, Edit, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Company } from "@/types/travel";
import DeleteButton from "@/components/DeleteButton";
import CompanyFilters from "@/components/CompanyFilters";

export const dynamic = 'force-dynamic';

export default async function CompaniesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const place = typeof searchParams.place === 'string' ? searchParams.place : undefined;
  const user = typeof searchParams.user === 'string' ? searchParams.user : undefined;

  let companies: Company[] = [];
  let totalCompanies = 0;
  let errorMessage = "";
  let placesList: any[] = [];
  let usersList: any[] = [];

  try {
    const [placesRes, usersRes] = await Promise.all([
      api.get('/office_security/places/'),
      api.get('/users/')
    ]);
    if (placesRes.data?.success) placesList = placesRes.data.data.results || [];
    if (usersRes.data?.success) usersList = usersRes.data.data.results || [];

    const response = await api.get<ApiResponse<Company>>('/office_travel/travel/', {
      params: { search, place, user }
    });
    if (response.data.success) {
      companies = response.data.data.results;
      totalCompanies = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch companies:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">شركات السفر المعتمدة</h2>
          <p className="text-gray-500 text-sm">إدارة وتتبع أداء الشركات ومزودي خدمات السفر.</p>
        </div>
        <Link href="/dashboard/travels/companies/add" className="bg-success hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
          إضافة شركة جديدة
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter */}
        <div className="p-5 border-b border-gray-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
           <CompanyFilters places={placesList} users={usersList} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-right">اسم الشركة</th>
                <th className="py-4 px-6 font-medium text-center">المكان</th>
                <th className="py-4 px-6 font-medium text-center">المالك</th>
                <th className="py-4 px-6 font-medium text-center">التواصل</th>
                <th className="py-4 px-6 font-medium text-center">عدد الرحلات</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="font-bold text-gray-800 text-sm">{company.name}</div>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-100">
                        {company.name.charAt(0)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">
                    <div className="font-bold">{company.name_place}</div>
                    <div className="text-[10px] text-gray-400">{company.location}</div>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600 font-bold">{company.name_onwer}</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">
                    <div className="font-bold">{company.phone}</div>
                    <div className="text-[10px] text-gray-400">{company.email || "—"}</div>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-gray-800">—</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-100">نشط</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/travels/companies/details/${company.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/travels/companies/${company.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton endpoint="/office_travel/travel/" id={company.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && !errorMessage && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    لا توجد شركات مسجلة
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
          <div>عرض {totalCompanies} من أصل {totalCompanies} شركة</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-sm mb-2 text-right">إجمالي الشركات</h3>
          <span className="text-3xl font-bold text-gray-900">{totalCompanies}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-sm mb-2 text-right">شركات نشطة</h3>
          <span className="text-3xl font-bold text-success">{totalCompanies}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px]">
          <h3 className="text-gray-500 text-sm mb-2 text-right">الرحلات المجدولة</h3>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>
      </div>
    </div>
  );
}
