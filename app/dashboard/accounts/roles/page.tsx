import { Shield, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import RoleActions from "@/components/accounts/RoleActions";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
  let roles: any[] = [];
  let errorMessage = "";
  let totalRoles = 0;
  let totalUsers = 0;

  try {
    const results = await Promise.allSettled([
      api.get('/group/'),
      api.get('/users/')
    ]);

    // Handle groups
    if (results[0].status === 'fulfilled') {
      const response = results[0].value;
      if (response.data?.success || response.data?.data) {
        roles = response.data.data?.results || response.data.data || response.data || [];
        totalRoles = response.data.data?.count || roles.length;
      } else if (Array.isArray(response.data)) {
        roles = response.data;
        totalRoles = roles.length;
      }
    } else {
      console.error("Failed to fetch roles:", results[0].reason);
      errorMessage = "حدث خطأ أثناء جلب الأدوار";
    }

    // Handle users
    if (results[1].status === 'fulfilled') {
      const response = results[1].value;
      if (response.data?.success || response.data?.data) {
        totalUsers = response.data.data?.count || response.data.data?.results?.length || 0;
      } else if (Array.isArray(response.data)) {
        totalUsers = response.data.length;
      }
    } else {
      console.error("Failed to fetch users:", results[1].reason);
    }
  } catch (error: any) {
    console.error("Unexpected error:", error);
    errorMessage = error?.message || "حدث خطأ غير متوقع";
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="الأدوار والصلاحيات"
        description="أضف الأدوار وعدل صلاحياتها حسب أقسام النظام."
        breadcrumbs={[{ label: "الحسابات", href: "/dashboard/accounts" }, { label: "الأدوار", active: true }]}
        addLink="/dashboard/accounts/roles/add"
        addLabel="إضافة دور"
        addButtonClassName="bg-[#00a65a] hover:bg-[#008d4c] text-white"
        extraActions={
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm">
            سجل التدقيق
          </button>
        }
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="إجمالي المستخدمين"
          value={totalUsers.toString()}
          icon={<Users className="w-5 h-5 text-blue-500" />}
        />
        <StatCard 
          title="الأدوار المسجلة"
          value={totalRoles.toString()}
          icon={<Shield className="w-5 h-5 text-emerald-500" />}
          iconBgClassName="bg-green-50"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800">قائمة الأدوار</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-medium w-1/3">اسم الدور</th>
                <th className="py-4 px-6 font-medium text-center w-1/3">الصلاحيات الممنوحة</th>
                <th className="py-4 px-6 font-medium text-left w-1/3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={role.id || i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-800">{role.name}</div>
                    <div className="text-xs text-gray-400 mt-1">دور مخصص</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-xs font-bold border border-gray-200">
                      {role.permissions?.length || 0} صلاحية
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <RoleActions roleId={role.id} />
                  </td>
                </tr>
              ))}
              {roles.length === 0 && !errorMessage && (
                <EmptyState message="لا توجد أدوار لعرضها" colSpan={3} />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
