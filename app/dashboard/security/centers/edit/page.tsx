import { Building2, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function EditCenterPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header and top buttons */}
      <div className="flex justify-between items-end mb-6 text-right">
        <div className="hidden"></div>
        <div>
           <div className="flex items-center gap-2 justify-end mb-1">
             <h2 className="text-2xl font-bold text-gray-800">تعديل بيانات المركز الأمني</h2>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Actions Area (Left Side) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 shrink-0">
          
          <div className="flex gap-3 mb-2">
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1">
              إلغاء
            </button>
            <button className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              حفظ التعديلات
            </button>
          </div>

          <div className="bg-[#0f172a] rounded-xl shadow-sm text-white p-6 text-right relative overflow-hidden">
            <div className="absolute top-6 left-6">
               <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md text-xs font-bold border border-emerald-500/30">
                 ACTIVE STATUS
               </span>
            </div>
            <div className="flex justify-end mb-4">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-right">نظرة عامة</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed text-right">
              تأكد من صحة المركز والمكان والمسؤول حتى تظهر بيانات التشغيل بشكل دقيق في لوحة القيادة.
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <span className="text-sm font-bold">نشط</span>
                <span className="text-xs text-gray-400">حالة المركز</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-sm font-bold">مركز أمني</span>
                <span className="text-xs text-gray-400">نوع السجل</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-gray-400 mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-gray-700 font-bold mb-1">مرفقات المركز</h4>
            <p className="text-gray-500 text-xs">
              يمكن إضافة إدارة المرفقات لاحقاً عند توفر موديل خاص بها.
            </p>
          </div>

        </div>

        {/* Main Form Area (Right Side) */}
        <div className="flex-1 space-y-6 order-1 lg:order-2">
          
          {/* Header Title Box */}
          <div className="flex justify-between items-start text-right mb-4">
            <div></div>
            <div className="flex gap-4">
               <div className="text-right">
                 <div className="flex justify-end items-center gap-2 mb-1">
                   <h2 className="text-2xl font-bold text-gray-800">تعديل بيانات المركز الأمني</h2>
                   <Building2 className="w-6 h-6 text-gray-800" />
                 </div>
                 <p className="text-sm text-gray-500">أدخل تفاصيل المركز والمسؤولين لضمان دقة النظام الأمني.</p>
               </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
            <h3 className="text-lg font-bold text-gray-800 mb-8">المعلومات الأساسية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">المكان التابع له</label>
                <input 
                  type="text" 
                  defaultValue="مكتب البحث الجنائي"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-gray-50"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">اسم المركز</label>
                <input 
                  type="text" 
                  defaultValue="مكتب البحث بسيون"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Contact and Responsibility Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
            <h3 className="text-lg font-bold text-gray-800 mb-8">بيانات التواصل والمسؤولية</h3>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">المستخدم المسؤول</label>
              <input 
                type="text" 
                defaultValue="admin"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-gray-50"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف الثانوي</label>
                <input 
                  type="text" 
                  placeholder="7xxxxxxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white font-mono"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف الأساسي</label>
                <input 
                  type="text" 
                  defaultValue="77402250005"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white font-mono"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
