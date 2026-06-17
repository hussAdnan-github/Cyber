import { Plus, Search, Eye, Edit, Trash2, Ban, UserX, AlertCircle, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { BlacklistEntry } from "@/types/security";
import { User } from "@/types/user";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function BlacklistPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const user_created = typeof params.user_created === 'string' ? params.user_created : '';

  let blacklist: BlacklistEntry[] = [];
  let usersList: User[] = [];
  let totalBlacklist = 0;
  let errorMessage = "";

  try {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (user_created) query.set('user_created', user_created);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const [response, usersRes] = await Promise.all([
      api.get<ApiResponse<BlacklistEntry>>(`/office_security/blacklist/${queryString}`),
      api.get<ApiResponse<User>>('/users/')
    ]);

    if (response.data.success) {
      blacklist = response.data.data.results;
      totalBlacklist = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }

    if (usersRes.data.success) {
      usersList = usersRes.data.data.results;
    }
  } catch (error: any) {
    console.error("Failed to fetch blacklist:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right flex items-center gap-2">
           <div>
             <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
               <span className="text-danger font-bold">القائمة السوداء</span>
               <span>&lt;</span>
               <span>الرئيسية</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-1">سجل القائمة السوداء</h2>
             <p className="text-gray-500 text-sm">إدارة الأشخاص الممنوعين أو الذين يحتاجون متابعة أمنية.</p>
           </div>
        </div>
        <Link href="/dashboard/security/blacklist/add" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
          إضافة للقائمة السوداء
          <Plus className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Alert */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-danger text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
          <TriangleAlert className="w-5 h-5" />
        </div>
        <div className="text-right w-full">
           <div className="flex justify-between items-center mb-1">
             <span className="bg-white border border-red-100 text-danger text-xs font-bold px-3 py-1 rounded-full">{totalBlacklist} سجل</span>
             <h3 className="text-danger font-bold text-lg">تنبيه أمني هام</h3>
           </div>
           <p className="text-danger/80 text-sm">راجع السجلات قبل السماح بالدخول، وحدث سبب الإدراج عند ظهور معلومات جديدة.</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-sm mb-2 text-right">إجمالي السجلات</h3>
          <span className="text-3xl font-bold text-gray-900">{totalBlacklist}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-sm mb-2 text-right">نتائج البحث</h3>
          <span className="text-3xl font-bold text-gray-900">{totalBlacklist}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-sm mb-2 text-right">مؤشرات عالية الخطورة</h3>
          <span className="text-3xl font-bold text-danger">0</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <form className="flex w-full md:w-auto gap-2" method="GET">
            <Link href="/dashboard/security/blacklist" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex items-center justify-center">
              إعادة ضبط
            </Link>
            <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
              بحث
            </button>
            <div className="relative flex-1 md:w-48">
              <select 
                name="user_created"
                defaultValue={user_created}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                dir="rtl"
              >
                <option value="">كل المستخدمين</option>
                {usersList.map(u => (
                  <option key={u.id} value={u.id.toString()}>{u.first_name ? `${u.first_name} ${u.last_name}` : u.username}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                name="search"
                defaultValue={search}
                className="w-full pr-4 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                placeholder="بحث بالاسم، السبب..."
                dir="rtl"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-right">الاسم الكامل</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">سبب الإدراج</th>
                <th className="py-4 px-6 font-medium text-center">بواسطة</th>
                <th className="py-4 px-6 font-medium text-center">مستوى الخطر</th>
                <th className="py-4 px-6 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                        <div className="text-[10px] text-gray-400">BL-{item.id}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">-</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">{item.reason}</td>
                  <td className="py-4 px-6 text-center text-sm text-gray-600">{item.name_user_created}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-red-50 text-danger px-3 py-1 rounded-full text-xs font-bold border border-red-100">متابعة أمنية</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/security/blacklist/details/${item.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/security/blacklist/${item.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteButton endpoint="/office_security/black_list/" id={item.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {blacklist.length === 0 && !errorMessage && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    لا توجد سجلات לעرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>عرض {totalBlacklist} من أصل {totalBlacklist}</div>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-danger bg-danger text-white font-bold">1</button>
          </div>
        </div>
      </div>
    </div>
  );
}
