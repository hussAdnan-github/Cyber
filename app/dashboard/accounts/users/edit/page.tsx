import { User } from "lucide-react";
import Link from "next/link";

export default function EditUserPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
            <span className="text-gray-400">المستخدمين</span>
            <span>&lt;</span>
            <span className="text-gray-400">تفاصيل المستخدم</span>
            <span>&lt;</span>
            <span className="text-primary font-bold">تعديل المستخدم</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">تعديل المستخدم</h2>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
            إلغاء
          </button>
          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-800">تعديل بيانات المستخدم</h3>
            <p className="text-sm text-gray-500 mt-1">حدّث بيانات الحساب والصلاحيات</p>
          </div>
        </div>

        {/* User Info Header */}
        <div className="flex items-center gap-4 justify-end mb-8">
          <div className="text-right">
            <h4 className="font-bold text-gray-800">admin</h4>
            <span className="text-xs text-gray-400 font-mono">USR-1#</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden shrink-0">
            <User className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <form className="space-y-8 text-right">
          {/* Personal Details */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">البيانات الشخصية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">اسم العائلة</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">الاسم الأول</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">بيانات الحساب</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">اسم المستخدم</label>
                <input 
                  type="text" 
                  defaultValue="admin"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-gray-50"
                  dir="rtl"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">الصورة الشخصية</label>
              <input 
                type="file" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                dir="rtl"
              />
            </div>
          </div>

          {/* Permissions & Status */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">الصلاحيات والحالة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">الحالة</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white appearance-none" dir="rtl">
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">الدور</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white appearance-none" dir="rtl">
                  <option value="admin">انشاء مستخدم</option>
                  <option value="manager">مدير نظام</option>
                  <option value="user">مستخدم عادي</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-100 justify-start">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
              حفظ التعديلات
            </button>
            <button type="button" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
