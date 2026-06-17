import { ShieldCheck, Copy } from "lucide-react";

export default function EditRolePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col gap-2 w-full md:w-auto order-2 md:order-1 items-start md:items-end">
           <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center w-full md:w-auto justify-center">
             نسخ الصلاحيات
             <Copy className="w-4 h-4 ml-2" />
           </button>
           <div className="bg-white border border-gray-200 rounded-lg p-3 text-center w-full md:w-32 shadow-sm">
             <div className="text-[10px] text-gray-500 mb-1">الحالة</div>
             <div className="font-bold text-gray-800 text-xs">جاهز للتعديل</div>
           </div>
        </div>
        <div className="text-right order-1 md:order-2 ml-auto">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 justify-end">
            <span className="text-gray-400">الإعدادات</span>
            <span>/</span>
            <span className="text-gray-400">إدارة الأدوار</span>
            <span>/</span>
            <span className="text-primary font-bold">تعديل الدور</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">تعديل الدور</h2>
        </div>
      </div>

      {/* Role Name Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-end gap-6 text-right">
        <div className="flex-1 w-full max-w-md">
          <label className="block text-xs font-bold text-gray-700 mb-2">اسم الدور</label>
          <input 
            type="text" 
            defaultValue="انشاء مستخدم"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
            dir="rtl"
          />
          <p className="text-[10px] text-gray-400 mt-2">يمكن تعديل صلاحيات هذا الدور حسب احتياج العمل.</p>
        </div>
        <div className="w-16 h-16 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
      </div>

      {/* Page Access Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-800">صلاحيات عرض الصفحات</h3>
          <p className="text-xs text-gray-500 mt-1">فعل القسم كاملاً أو اختر الصفحات التي تظهر داخله فقط</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">لوحة تحكم الحسابات</h4>
                  <div className="text-[10px] text-gray-500 text-right">5 صفحات</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "لوحة التحكم", active: false },
                  { name: "المستخدمون", active: false },
                  { name: "إضافة مستخدم", active: true },
                  { name: "الأدوار والصلاحيات", active: false },
                  { name: "سجل التدقيق", active: false }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                    <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${item.active ? 'bg-success' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full border border-gray-300 absolute transition-all ${item.active ? 'right-0 border-success' : 'left-0'}`}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">السفريات</h4>
                  <div className="text-[10px] text-gray-500 text-right">5 صفحات</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "لوحة عمليات السفر",
                  "شركات السفر",
                  "إدارة الرحلات",
                  "خطوط السفر",
                  "المسافرون"
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">الفنادق</h4>
                  <div className="text-[10px] text-gray-500 text-right">6 صفحات</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "لوحة تحكم الفنادق",
                  "قائمة الفنادق",
                  "إضافة فندق",
                  "قائمة النزلاء",
                  "إضافة نزيل",
                  "المرافقون"
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">الإعدادات</h4>
                  <div className="text-[10px] text-gray-500 text-right">1 صفحة</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                  <span className="text-xs text-gray-600">صفحة الإعدادات</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">الجهات الأمنية</h4>
                  <div className="text-[10px] text-gray-500 text-right">9 صفحات</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "لوحة القيادة",
                  "المراكز الأمنية",
                  "إضافة مركز",
                  "الأماكن",
                  "إضافة مكان",
                  "الملاك",
                  "المستندات",
                  "القائمة السوداء",
                  "الجنسيات"
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full border border-gray-300 absolute left-0"></div></div>
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white text-right">
          <h3 className="font-bold text-gray-800 text-lg">مصفوفة الصلاحيات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                <th className="py-4 px-4 font-bold text-right">قسم الوحدة</th>
                <th className="py-4 px-4 font-bold">عرض</th>
                <th className="py-4 px-4 font-bold">إضافة</th>
                <th className="py-4 px-4 font-bold">تعديل</th>
                <th className="py-4 px-4 font-bold">حذف</th>
                <th className="py-4 px-4 font-bold">طباعة</th>
                <th className="py-4 px-4 font-bold">اعتماد</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "سجل التدقيق (Audit Logs)", addActive: true },
                { name: "الحسابات (Accounts)", addActive: true },
                { name: "الأدوار (Roles)", addActive: false },
                { name: "الصلاحيات (Permissions)", addActive: false },
                { name: "المرافقون (Companions)", addActive: false },
                { name: "الفنادق (Hotels)", addActive: false },
                { name: "الضيوف (Guests)", addActive: false },
                { name: "القائمة السوداء (Blacklist)", addActive: false },
                { name: "المراكز الأمنية (Security Centers)", addActive: false },
                { name: "المستندات (Documents)", addActive: false },
                { name: "الجنسيات (Nationalities)", addActive: false },
                { name: "الملاك (Owners)", addActive: false },
                { name: "الأماكن (Places)", addActive: false },
                { name: "خطوط السفر (Routes)", addActive: false },
                { name: "شركات السفر (Companies)", addActive: false },
                { name: "المسافرون (Travelers)", addActive: false },
                { name: "الرحلات (Trips)", addActive: false }
              ].map((module, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-right text-sm font-bold text-gray-800">{module.name}</td>
                  {[
                    { type: 'view', active: false },
                    { type: 'add', active: module.addActive },
                    { type: 'edit', active: false },
                    { type: 'delete', active: false },
                    { type: 'print', active: false },
                    { type: 'approve', active: false },
                  ].map((col, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className={`w-8 h-4 rounded-full mx-auto relative cursor-pointer transition-colors ${col.active ? 'bg-success' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full border absolute transition-all ${col.active ? 'right-0 border-success' : 'left-0 border-gray-300'}`}></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-start">
          <button className="bg-success hover:bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
            حفظ التعديلات
          </button>
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
