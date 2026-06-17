import { Trash2, Edit, Eye, UserPlus, Users, Zap, AlertCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import UsersFilters from "@/components/accounts/UsersFilters";
import { Suspense } from "react";

// This tells Next.js to dynamically render the page on each request, 
// so it always fetches fresh data from the external API
export const dynamic = 'force-dynamic';

export default async function UsersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  let users: User[] = [];
  let totalUsers = 0;
  let activeUsers = 0;
  let inactiveUsers = 0;
  let errorMessage = "";

  try {
    const query = new URLSearchParams();
    if (searchParams?.search) query.set('search', searchParams.search as string);
    // role & status filtering can be applied if API supports it, 
    // or we can filter in memory later if the API returns everything.
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const response = await api.get<ApiResponse<User>>(`/users/${queryString}`);
    if (response.data.success) {
      users = response.data.data.results;
      
      // Apply memory filtering for role and status if they exist
      if (searchParams?.role === 'superuser') {
        users = users.filter(u => u.is_superuser);
      } else if (searchParams?.role === 'user') {
        users = users.filter(u => !u.is_superuser);
      }

      if (searchParams?.status === 'active') {
        users = users.filter(u => u.is_active);
      } else if (searchParams?.status === 'inactive') {
        users = users.filter(u => !u.is_active);
      }

      totalUsers = response.data.data.count;
      // In case active/inactive needs to be calculated from current page results
      // Or from a specific API endpoint. We'll approximate here based on current results:
      activeUsers = users.filter(u => u.is_active).length;
      inactiveUsers = users.filter(u => !u.is_active).length;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="المستخدمون"
        description="إدارة حسابات المستخدمين"
        breadcrumbs={[{ label: "الحسابات", href: "/dashboard/accounts" }, { label: "المستخدمين", active: true }]}
        addLink="/dashboard/accounts/users/add"
        addLabel="إضافة مستخدم جديد"
        addButtonIcon={<UserPlus className="w-5 h-5 ml-2" />}
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي المستخدمين"
          value={totalUsers}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="نشط حالياً"
          value={activeUsers}
          icon={<Zap className="w-6 h-6 text-success" />}
          iconBgClassName="bg-green-50"
          valueClassName="text-success"
        />
        <StatCard 
          title="غير نشط"
          value={inactiveUsers}
          icon={<AlertCircle className="w-6 h-6 text-warning" />}
          iconBgClassName="bg-orange-50"
          valueClassName="text-warning"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
            <UsersFilters />
          </Suspense>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium">المستخدم</th>
                <th className="py-4 px-6 font-medium">البريد الإلكتروني</th>
                <th className="py-4 px-6 font-medium text-center">الدور</th>
                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.email || "—"}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${user.is_superuser ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {user.is_superuser ? "مدير" : "مستخدم"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {user.is_active ? (
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-green-50 text-success">
                        نشط
                      </span>
                    ) : (
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                        غير نشط
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/accounts/users/details/${user.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !errorMessage && (
                <EmptyState message="لا يوجد مستخدمين لعرضهم" colSpan={5} />
              )}
            </tbody>
          </table>
        </div>
        
        {/* <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div>عرض 1-{users.length} من أصل {totalUsers} مستخدم</div>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">&gt;</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
