import { MapPin, Phone, Mail, User, Building, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function HotelDetailsPage({ params }: { params: { id: string } }) {
  let hotel: any = null;
  let errorMessage = "";

  try {
    const response = await api.get(`/hotal/hotel/${params.id}/`);
    if (response.data && response.data.success) {
      hotel = response.data.data;
    } else {
      errorMessage = response.data?.message || "فشل في جلب تفاصيل الفندق";
    }
  } catch (error: any) {
    console.error("Error fetching hotel details:", error);
    errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء الاتصال بالخادم";
  }

  if (errorMessage) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end max-w-6xl mx-auto">
        <span>{errorMessage}</span>
        <AlertCircle className="w-4 h-4" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center p-8 text-gray-500 font-bold">
        جاري تحميل تفاصيل الفندق...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2 order-2 md:order-1 mt-4 md:mt-0">
           <Link href={`/dashboard/hotels/${hotel.id}`} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
             تعديل البيانات
           </Link>
           <Link href="/dashboard/hotels/guests/add" className="bg-success hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
             إضافة نزيل جديد
           </Link>
        </div>

        <div className="text-right order-1 md:order-2 ml-auto">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">{hotel.name}</h2>
           <div className="flex items-center gap-2 text-gray-500 text-xs justify-end">
              <span className="text-gray-400">الفنادق</span>
              <span>/</span>
              <span className="text-success font-bold">تفاصيل الفندق</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Details Area (Right Side visually) */}
        <div className="flex-1 space-y-6 order-2 lg:order-1">
          {/* Main Hotel Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center relative shrink-0">
                 <span className="text-xs font-bold text-gray-400">Hotel</span>
                 <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-success rounded-full border border-white"></div>
                 <span className="absolute -bottom-2 bg-green-50 text-success text-[10px] px-2 py-0.5 rounded-full border border-green-100 font-bold">نشط</span>
              </div>
              <div className="text-right">
                 <h3 className="text-2xl font-bold text-gray-800 mb-1">{hotel.name}</h3>
                 <p className="text-sm text-gray-500">{hotel.location || hotel.name_place || "بدون موقع"}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-right mb-8 border border-gray-100 text-sm text-gray-700">
               {hotel.description || "لا يوجد وصف متوفر لهذا الفندق"}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">المالك المسؤول</div>
                     <div className="font-bold text-gray-800">{hotel.name_onwer || "غير مسجل"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <User className="w-4 h-4" />
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">بيانات التواصل</div>
                     <div className="font-bold text-gray-800 font-mono">{hotel.phone || "لا يوجد"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <Phone className="w-4 h-4" />
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">البريد الإلكتروني</div>
                     <div className="font-bold text-gray-800">{hotel.email || "لا يوجد"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <Mail className="w-4 h-4" />
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">المكان</div>
                     <div className="font-bold text-gray-800">{hotel.name_place || "غير محدد"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <Building className="w-4 h-4" />
                  </div>
               </div>
            </div>
          </div>

          {/* Current Guests Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <Link href="/dashboard/hotels/guests" className="text-blue-600 font-bold text-sm hover:underline">عرض الكل</Link>
                <h3 className="text-lg font-bold text-gray-800">النزلاء الحاليون (موجز)</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500">
                         <th className="py-4 px-6 font-bold">النزيل</th>
                         <th className="py-4 px-6 font-bold text-center">رقم الهوية</th>
                         <th className="py-4 px-6 font-bold text-center">الجنسية</th>
                         <th className="py-4 px-6 font-bold text-center">الهاتف</th>
                         <th className="py-4 px-6 font-bold text-center">التقييم</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr>
                         <td colSpan={5} className="py-6 text-center text-gray-500 text-sm">
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">النزلاء الحاليين سيتم عرضهم هنا قريباً</span>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

        </div>

        {/* Sidebar Analytics Area (Left Side) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
            <h3 className="font-bold text-gray-800 mb-6">إحصائيات الأداء</h3>
            
            <div className="mb-6">
               <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold text-gray-900">--</div>
                  <div className="text-xs text-gray-500">إجمالي النزلاء حالياً</div>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '0%' }}></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                  <div className="text-[10px] text-gray-500 mb-2">تنبيهات التقييم</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">0</div>
                  <span className="bg-green-50 text-success text-[10px] px-2 py-0.5 rounded-full border border-green-100 font-bold">حالة ممتازة</span>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center flex-1 flex flex-col justify-center">
                     <div className="text-[10px] text-gray-500 mb-1">المرافقون</div>
                     <div className="text-xl font-bold text-gray-900">--</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-center flex-1 flex flex-col justify-center">
                     <div className="text-[10px] text-gray-500 mb-1">آخر تحديث</div>
                     <div className="text-[10px] font-bold text-gray-800 font-mono">
                       {hotel.updated_at ? new Date(hotel.updated_at).toLocaleDateString('ar-SA') : 'غير متوفر'}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
             <div className="bg-gray-200 rounded-lg h-32 relative mb-2 overflow-hidden flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white absolute z-10 drop-shadow-md" />
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             </div>
             <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center">
                فتح في الخرائط
                <ExternalLink className="w-4 h-4 ml-2" />
             </button>
          </div>

        </div>
      </div>

    </div>
  );
}
