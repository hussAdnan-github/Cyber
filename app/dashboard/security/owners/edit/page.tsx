import { User } from "lucide-react";
import Link from "next/link";

export default function EditOwnerPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb/Header */}
      <div className="flex justify-between items-center mb-6 text-right">
        <div></div>
        <div>
           <h2 className="text-2xl font-bold text-gray-800 hidden">تعديل بيانات المالك</h2>
           <div className="text-sm font-bold text-gray-500 flex items-center justify-end gap-2 mt-2">
             <span className="text-blue-600">تعديل بيانات المالك</span>
             <span>{'<'}</span>
             <Link href="/dashboard/security/owners" className="hover:text-gray-800 transition-colors">
               الملاك
             </Link>
           </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Dark Header */}
        <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center text-right mx-6 mt-6 rounded-xl">
           <div className="bg-white/10 p-3 rounded-lg">
             <User className="w-6 h-6 text-white" />
           </div>
           <div>
             <h3 className="text-xl font-bold mb-1">بيانات المالك</h3>
             <p className="text-xs text-gray-400">يرجى تعبئة الحقول المطلوبة لضمان دقة السجلات الأمنية.</p>
           </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-8 text-right">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">الاسم الكامل</label>
            <input 
              type="text" 
              defaultValue="محمد علي محمد علي"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">الجنسية</label>
              <input 
                type="text" 
                defaultValue="يمني"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">نوع الهوية</label>
              <input 
                type="text" 
                defaultValue="بطاقة الهوية"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                dir="rtl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهوية</label>
            <input 
              type="text" 
              defaultValue="080108542110101"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
              dir="rtl"
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">نسخة من وثيقة الهوية</label>
             <div className="mb-2 text-xs text-gray-500">
               حالياً: <span className="font-mono text-gray-800" dir="ltr">documents/Logo.png</span>
             </div>
             <div className="text-xs text-gray-700 mb-2 font-bold">تعديل:</div>
             <div className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
               <input 
                 type="file" 
                 className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0f172a] file:text-white hover:file:bg-gray-800 focus:outline-none cursor-pointer"
                 dir="rtl"
               />
               <span className="text-xs text-gray-400">No file chosen</span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">رقم الجوال الإضافي</label>
              <input 
                type="text" 
                defaultValue="7777777000"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">رقم الجوال الأساسي</label>
              <input 
                type="text" 
                defaultValue="50400000"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                dir="rtl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 justify-start">
            <button className="bg-[#059669] hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              حفظ التعديلات
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              إلغاء
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
