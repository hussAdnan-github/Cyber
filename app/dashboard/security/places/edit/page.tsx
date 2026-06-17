import { MapPin } from "lucide-react";
import Link from "next/link";

export default function EditPlacePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb/Header */}
      <div className="flex justify-between items-center mb-6 text-right">
         <div className="hidden"></div>
         <div className="text-sm font-bold text-gray-500 flex items-center justify-end gap-2">
           <span className="text-gray-800 font-bold">تعديل المكان</span>
           <span>/</span>
           <Link href="/dashboard/security/places" className="hover:text-gray-800 transition-colors">
             الأماكن
           </Link>
           <span>/</span>
           <Link href="/dashboard" className="hover:text-gray-800 transition-colors">
             لوحة القيادة
           </Link>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar (Left Side) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 shrink-0">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
            <h3 className="font-bold text-gray-800 mb-4">إرشادات هامة</h3>
            <ul className="text-xs text-gray-500 space-y-3 leading-relaxed">
              <li>• يجب أن يكون الاسم واضحاً وغير مكرر قدر الإمكان.</li>
              <li>• اكتب الموقع بطريقة تساعد فريق الأمن على الوصول بسرعة.</li>
              <li>• يمكن ربط أكثر من مركز بهذا المكان بعد حفظه.</li>
            </ul>
          </div>

          <div className="bg-[#0f172a] rounded-xl shadow-sm text-white p-6 text-right">
            <h3 className="font-bold mb-4">إحصائيات المواقع</h3>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-400">
              كل مكان جديد يساعد في بناء خريطة تشغيل أدق للمنشآت.
            </p>
          </div>

        </div>

        {/* Main Content (Right Side) */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 order-1 lg:order-2">
          
          <div className="flex items-center gap-3 justify-end mb-8 border-b border-gray-100 pb-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 mb-1">بيانات المكان</h2>
              <p className="text-sm text-gray-500">يرجى إدخال تفاصيل الموقع والمعلومات الأساسية بدقة.</p>
            </div>
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-6 text-right">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">اسم المكان</label>
              <input 
                type="text" 
                defaultValue="مكتب البحث الجنائي"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">الموقع</label>
              <input 
                type="text" 
                defaultValue="سيئون - السحيل"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mt-6">
              <div className="absolute inset-0 opacity-50 bg-[url('https://maps.wikimedia.org/osm-intl/12/2458/1749.png')] bg-cover bg-center mix-blend-multiply"></div>
              
              <div className="absolute inset-0 bg-[#e0e0d1]/30"></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="w-10 h-10 text-red-600 fill-red-600" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg text-sm text-center text-gray-600 border border-gray-200 shadow-sm">
                  استخدم حقل الموقع أعلاه لتسجيل العناوين الجغرافية للمكان.
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-8 justify-end border-t border-gray-100 mt-8">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-3 rounded-lg text-sm font-bold transition-colors">
                إلغاء الأمر
              </button>
              <button className="bg-[#0f172a] hover:bg-gray-800 text-white px-10 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
                حفظ البيانات
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
