export default function AddUserPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 ml-auto">إضافة مستخدم</h2>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-right mb-8 border-b border-gray-100 pb-6">
          <h3 className="text-xl font-bold text-gray-800">إضافة مستخدم جديد</h3>
          <p className="text-sm text-gray-500 mt-1">أدخل بيانات المستخدم</p>
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">كلمة المرور</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
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
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">الصلاحيات</h4>
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
              حفظ المستخدم
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
