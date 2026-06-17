import { Trash2, Edit, Eye } from "lucide-react";
import Link from "next/link";

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">الأدوار والصلاحيات</h2>
          <p className="text-gray-500 text-sm">أضف الأدوار وعدل صلاحياتها حسب أقسام النظام.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center text-sm font-bold transition-colors shadow-sm">
            سجل التدقيق
          </button>
          <button className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2 rounded-md flex items-center text-sm font-bold transition-colors shadow-sm">
            إضافة دور
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end">
          <h3 className="text-gray-500 text-sm mb-2">إجمالي المستخدمين</h3>
          <span className="text-3xl font-bold text-gray-900">7</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end">
          <h3 className="text-gray-500 text-sm mb-2">الأدوار المسجلة</h3>
          <span className="text-3xl font-bold text-gray-900">2</span>
        </div>
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
                <th className="py-4 px-6 font-medium text-center w-1/3">المستخدمون</th>
                <th className="py-4 px-6 font-medium text-left w-1/3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: "انشاء مستخدم", subtitle: "دور مخصص", users: 1 },
                { id: 2, name: "مدير فندق", subtitle: "دور مخصص", users: 1 },
              ].map((role, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-800">{role.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{role.subtitle}</div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-xs font-bold border border-gray-200">{role.users}</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/accounts/roles/details/${role.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
