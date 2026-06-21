import { Plus, Search, Eye, Edit, Trash2, Ban, UserX, AlertCircle, TriangleAlert, FilePlus } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { BlacklistEntry } from "@/types/security";
import { User } from "@/types/user";
import DeleteButton from "@/components/DeleteButton";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import BlacklistFilters from "@/components/security/BlacklistFilters";
import NotificationsWidget from "@/components/security/NotificationsWidget";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

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
      <PageHeader 
        title="سجل القائمة السوداء"
        description="إدارة الأشخاص الممنوعين أو الذين يحتاجون متابعة أمنية."
        addLink="/dashboard/security/blacklist/add"
        addLabel="إضافة للقائمة السوداء"
        addButtonClassName="bg-red-600 hover:bg-red-700 text-white"
        breadcrumbs={[{ label: "الرئيسية", href: "/dashboard" }, { label: "القائمة السوداء", active: true }]}
        can="add_blacklist"
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Real-time Notifications Widget */}
      <NotificationsWidget />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي السجلات"
          value={totalBlacklist}
        />
        <StatCard 
          title="نتائج البحث"
          value={totalBlacklist}
        />
        <StatCard 
          title="مؤشرات عالية الخطورة"
          value="0"
          valueClassName="text-danger"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
            <BlacklistFilters users={usersList} />
          </Suspense>
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
                      <Can permission="change_blacklist">
                        <Link href={`/dashboard/security/blacklist/${item.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Can>
                      <Can permission="add_documents">
                        <Link href={`/dashboard/security/documents/add?blacklist_id=${item.id}`} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md border border-emerald-100 transition-colors" title="إضافة مستند">
                          <FilePlus className="w-4 h-4" />
                        </Link>
                      </Can>
                      <Can permission="delete_blacklist">
                        <DeleteButton endpoint="/office_security/black_list/" id={item.id} permission="delete_blacklist" />
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
              {blacklist.length === 0 && !errorMessage && (
                <EmptyState message="لا توجد سجلات לעرضها" colSpan={6} />
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

