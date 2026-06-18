"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const pageAccessCategories = [
  {
    title: "لوحة تحكم الحسابات",
    count: 5,
    items: ["لوحة التحكم", "المستخدمون", "إضافة مستخدم", "الأدوار والصلاحيات", "سجل التدقيق"]
  },
  {
    title: "السفريات",
    count: 5,
    items: ["لوحة عمليات السفر", "شركات السفر", "إدارة الرحلات", "خطوط السفر", "المسافرون"]
  },
  {
    title: "الفنادق",
    count: 6,
    items: ["لوحة تحكم الفنادق", "قائمة الفنادق", "إضافة فندق", "قائمة النزلاء", "إضافة نزيل", "المرافقون"]
  },
  {
    title: "الإعدادات",
    count: 1,
    items: ["صفحة الإعدادات"]
  },
  {
    title: "الجهات الأمنية",
    count: 9,
    items: ["لوحة القيادة", "المراكز الأمنية", "إضافة مركز", "الأماكن", "إضافة مكان", "الملاك", "المستندات", "القائمة السوداء", "الجنسيات"]
  }
];

const matrixModules = [
  "سجل التدقيق (Audit Logs)",
  "الحسابات (Accounts)",
  "الأدوار (Roles)",
  "الصلاحيات (Permissions)",
  "المرافقون (Companions)",
  "الفنادق (Hotels)",
  "الضيوف (Guests)",
  "القائمة السوداء (Blacklist)",
  "المراكز الأمنية (Security Centers)",
  "المستندات (Documents)",
  "الجنسيات (Nationalities)",
  "الملاك (Owners)",
  "الأماكن (Places)",
  "خطوط السفر (Routes)",
  "شركات السفر (Companies)",
  "المسافرون (Travelers)",
  "الرحلات (Trips)"
];

const matrixActions = [
  { id: 'view', label: 'عرض' },
  { id: 'add', label: 'إضافة' },
  { id: 'edit', label: 'تعديل' },
  { id: 'delete', label: 'حذف' },
  { id: 'print', label: 'طباعة' },
  { id: 'approve', label: 'اعتماد' }
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors flex items-center ${checked ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full border absolute transition-all ${checked ? 'right-0 border-green-500' : 'left-0 border-gray-300'}`}></div>
    </div>
  );
}

export default function AddRolePage() {
  const [roleName, setRoleName] = useState("");
  
  // State for page access (using item name as key)
  const [pageAccess, setPageAccess] = useState<Record<string, boolean>>({});
  
  // State for matrix permissions: moduleName -> actionId -> boolean
  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, Record<string, boolean>>>({});

  const togglePageAccessCategory = (category: typeof pageAccessCategories[0]) => {
    const allChecked = category.items.every(item => pageAccess[item]);
    const newState = { ...pageAccess };
    category.items.forEach(item => {
      newState[item] = !allChecked;
    });
    setPageAccess(newState);
  };

  const togglePageAccessItem = (item: string) => {
    setPageAccess(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleMatrixPermission = (moduleName: string, actionId: string) => {
    setMatrixPermissions(prev => ({
      ...prev,
      [moduleName]: {
        ...(prev[moduleName] || {}),
        [actionId]: !(prev[moduleName]?.[actionId] || false)
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center w-full md:w-32 order-2 md:order-1">
          <div className="text-xs text-gray-500 mb-1">الحالة</div>
          <div className="font-bold text-gray-800 text-sm">دور جديد</div>
        </div>
        <div className="text-right order-1 md:order-2 ml-auto">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2 justify-end">
            <span className="text-gray-400">الإعدادات</span>
            <span>/</span>
            <span className="text-primary font-bold">إدارة الأدوار</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">إضافة دور جديد</h2>
        </div>
      </div>

      {/* Role Name Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-end gap-6 text-right">
        <div className="flex-1 w-full max-w-md">
          <label className="block text-xs font-bold text-gray-700 mb-2">اسم الدور</label>
          <input 
            type="text" 
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
            placeholder="مثال: مدير الفنادق"
            dir="rtl"
          />
          <p className="text-[10px] text-gray-400 mt-2">حدد الصلاحيات المناسبة لهذا الدور حسب وميزات النظام.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
          {pageAccessCategories.map((category, idx) => {
            const allChecked = category.items.length > 0 && category.items.every(item => pageAccess[item]);
            return (
              <div key={idx} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                    <Toggle 
                      checked={allChecked} 
                      onChange={() => togglePageAccessCategory(category)} 
                    />
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{category.title}</h4>
                      <div className="text-[10px] text-gray-500 text-right">{category.count} صفحات</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {category.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <Toggle 
                          checked={pageAccess[item] || false} 
                          onChange={() => togglePageAccessItem(item)} 
                        />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white text-right">
          <h3 className="font-bold text-gray-800 text-lg">مصفوفة الصلاحيات</h3>
        </div>
        <div className="overflow-x-auto" dir="rtl">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                <th className="py-4 px-4 font-bold text-right">قسم الوحدة</th>
                {matrixActions.map(action => (
                  <th key={action.id} className="py-4 px-4 font-bold">{action.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixModules.map((module, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-right text-sm font-bold text-gray-800">{module}</td>
                  {matrixActions.map((action, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="flex justify-center">
                        <Toggle 
                          checked={matrixPermissions[module]?.[action.id] || false} 
                          onChange={() => toggleMatrixPermission(module, action.id)} 
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3 justify-start" dir="rtl">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
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
