import { AlertCircle, Search, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

export const dynamic = 'force-dynamic';

export interface AuditLog {
  id: number;
  username: string;
  model: string;
  app: string;
  action: string;
  action_time: string;
  object_id: string;
  object_repr: string;
  action_flag: number;
  change_message: string;
  user: number;
  content_type: number;
}

function parseMessage(msg: string) {
  if (!msg || msg === "[]") return "-";
  try {
    const parsed = JSON.parse(msg);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Django admin change message format
      const messages = parsed.map(item => {
        if (item.added) {
          if (item.added.name) return `إضافة ${item.added.name} "${item.added.object}"`;
          return "إضافة";
        }
        if (item.changed) {
          if (item.changed.fields) return `تعديل (${item.changed.fields.join(", ")})`;
          return "تعديل";
        }
        if (item.deleted) {
          if (item.deleted.name) return `حذف ${item.deleted.name} "${item.deleted.object}"`;
          return "حذف";
        }
        return JSON.stringify(item);
      });
      return messages.join(" ، ");
    }
    return msg;
  } catch (e) {
    return msg;
  }
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString('ar-EG', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(',', '');
}

export default async function AuditLogPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  let auditLogs: AuditLog[] = [];
  let totalLogs = 0;
  let errorMessage = "";

  try {
    const query = new URLSearchParams();
    if (searchParams?.search) query.set('search', searchParams.search as string);
    if (searchParams?.page) query.set('page', searchParams.page as string);
    
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const response = await api.get<ApiResponse<AuditLog>>(`/office_security/logs/${queryString}`);
    if (response.data.success) {
      auditLogs = response.data.data.results;
      totalLogs = response.data.data.count;
    } else {
      errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
    }
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error);
    errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">سجل التدقيق</h2>
          <p className="text-gray-500 text-sm">تتبع عمليات الإنشاء والتعديل والحذف داخل النظام.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filter Section */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <form className="flex flex-col md:flex-row gap-4 items-center" action="/dashboard/accounts/audit" method="GET">
            <div className="flex-1 w-full relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                name="search"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
                placeholder="بحث بالمستخدم أو الموديل أو الرسالة"
                dir="rtl"
                defaultValue={searchParams?.search as string || ""}
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full md:w-auto shrink-0 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              تصفية
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center w-40">الوقت</th>
                <th className="py-4 px-6 font-medium text-center">المستخدم</th>
                <th className="py-4 px-6 font-medium text-center">العملية</th>
                <th className="py-4 px-6 font-medium text-center">العنصر</th>
                <th className="py-4 px-6 font-medium text-center">الرسالة</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 text-center text-xs text-gray-500 font-medium font-mono" dir="ltr">
                    {formatDate(log.action_time)}
                  </td>
                  <td className="py-3 px-6 text-center text-sm font-bold text-gray-800">
                    {log.username}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      log.action_flag === 1 ? 'bg-green-50 text-green-600 border-green-200' : 
                      log.action_flag === 2 ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                      log.action_flag === 3 ? 'bg-red-50 text-red-600 border-red-200' : 
                      'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <div className="font-bold text-gray-800">{log.object_repr}</div>
                    <div className="text-gray-400" dir="ltr">{log.app}.{log.model}</div>
                  </td>
                  <td className="py-3 px-6 text-center text-xs text-gray-500 max-w-xs truncate" title={parseMessage(log.change_message)}>
                    {parseMessage(log.change_message)}
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && !errorMessage && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    لا توجد سجلات لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div className="text-gray-500">
            إجمالي السجلات: {totalLogs}
          </div>
        </div>

      </div>
    </div>
  );
}

