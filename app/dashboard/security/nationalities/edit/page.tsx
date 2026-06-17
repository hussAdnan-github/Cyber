import Link from "next/link";

export default function EditNationalityPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-8">
      
      {/* Header Link */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard/security/nationalities" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm inline-block">
          العودة للوحة القيادة
        </Link>
        <h2 className="text-2xl font-bold text-gray-800 hidden">تعديل الجنسية</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-right">
        
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">تعديل الجنسية</h2>
          <p className="text-sm text-gray-500">تحديث اسم الجنسية المعتمد في النظام.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8 text-right">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 text-right">اسم الجنسية</label>
            <input 
              type="text" 
              defaultValue="يمني"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
              dir="rtl"
            />
          </div>

          <div className="flex gap-4 pt-4 justify-end">
             <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              إلغاء
            </button>
            <button className="bg-[#0f172a] hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              حفظ التعديلات
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
