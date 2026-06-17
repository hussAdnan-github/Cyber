export default function AuditLogPage() {
  const auditLogs = [
    { time: "18:01 2026-06-04", user: "admin", action: "Update", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: "-", ip: "127.0.0.1" },
    { time: "18:01 2026-06-04", user: "admin", action: "Login", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: ".User logged in", ip: "127.0.0.1" },
    { time: "17:28 2026-06-04", user: "admin", action: "Update", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: "-", ip: "127.0.0.1" },
    { time: "17:28 2026-06-04", user: "admin", action: "Login", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: ".User logged in", ip: "127.0.0.1" },
    { time: "16:59 2026-06-04", user: "admin", action: "Update", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: "-", ip: "127.0.0.1" },
    { time: "16:59 2026-06-04", user: "admin", action: "Login", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: ".User logged in", ip: "127.0.0.1" },
    { time: "16:56 2026-06-04", user: "النظام", action: "Update", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: "-", ip: "-" },
    { time: "16:56 2026-06-04", user: "admin", action: "Login", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: ".User logged in", ip: "-" },
    { time: "16:54 2026-06-04", user: "النظام", action: "Update", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: "-", ip: "-" },
    { time: "16:54 2026-06-04", user: "admin", action: "Login", itemTitle: "admin", itemDesc: "accounts.CustomUser", msg: ".User logged in", ip: "-" },
    { time: "16:37 2026-06-04", user: "النظام", action: "Update", itemTitle: "abdullah", itemDesc: "office_security.Owner", msg: "-", ip: "-" },
    { time: "16:37 2026-06-04", user: "النظام", action: "Update", itemTitle: "محمد علي محمد علي", itemDesc: "office_security.Owner", msg: "-", ip: "-" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">سجل التدقيق</h2>
          <p className="text-gray-500 text-sm">تتبع عمليات الإنشاء والتعديل والحذف داخل النظام.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full md:w-auto text-center">
          الأدوار والصلاحيات
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Filter Section */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
                placeholder="بحث بالمستخدم أو الموديل أو الرسالة"
                dir="rtl"
              />
            </div>
            <div className="flex-1 w-full">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
                placeholder="اكتب للبحث أو اختر من القائمة"
                dir="rtl"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full md:w-auto shrink-0">
              تصفية
            </button>
          </div>
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
                <th className="py-4 px-6 font-medium text-center">IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6 text-center text-xs text-gray-500 font-medium font-mono">{log.time}</td>
                  <td className="py-3 px-6 text-center text-sm font-bold text-gray-800">{log.user}</td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center text-xs">
                    <div className="font-bold text-gray-800">{log.itemTitle}</div>
                    <div className="text-gray-400">{log.itemDesc}</div>
                  </td>
                  <td className="py-3 px-6 text-center text-xs text-gray-500">{log.msg}</td>
                  <td className="py-3 px-6 text-center text-xs text-gray-400 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div className="text-gray-500">
            صفحة 1 من 3
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded text-xs font-bold transition-colors shadow-sm">
            التالي
          </button>
        </div>

      </div>
    </div>
  );
}
