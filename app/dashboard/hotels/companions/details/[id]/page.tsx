import { MapPin, Phone, Mail, User, Building, ExternalLink, AlertCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function CompanionDetailsPage({ params }: { params: { id: string } }) {
  let companion: any = null;
  let errorMessage = "";

  try {
    const response = await api.get(`/hotal/companions/${params.id}/`);
    if (response.data && response.data.success) {
      companion = response.data.data;
    } else {
      errorMessage = response.data?.message || "فشل في جلب تفاصيل المرافق";
    }
  } catch (error: any) {
    console.error("Error fetching companion details:", error);
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

  if (!companion) {
    return (
      <div className="text-center p-8 text-gray-500 font-bold">
        جاري تحميل تفاصيل المرافق...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2 order-2 md:order-1 mt-4 md:mt-0">
           <Link href={`/dashboard/hotels/companions/${companion.id}`} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
             تعديل البيانات
           </Link>
        </div>

        <div className="text-right order-1 md:order-2 ml-auto">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">{companion.name}</h2>
           <div className="flex items-center gap-2 text-gray-500 text-xs justify-end">
              <span className="text-gray-400">المرافقون</span>
              <span>/</span>
              <span className="text-success font-bold">تفاصيل المرافق</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Details Area (Right Side visually) */}
        <div className="flex-1 space-y-6 order-2 lg:order-1">
          {/* Main Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center relative shrink-0 overflow-hidden">
                 {companion.pic ? (
                    <img src={companion.pic} alt={companion.name} className="w-full h-full object-cover" />
                 ) : (
                    <User className="w-8 h-8 text-gray-400" />
                 )}
                 <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-success rounded-full border border-white"></div>
              </div>
              <div className="text-right">
                 <h3 className="text-2xl font-bold text-gray-800 mb-1">{companion.name}</h3>
                 <p className="text-sm text-gray-500">{companion.name_nationality || "بدون جنسية"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">النزيل المرتبط</div>
                     <div className="font-bold text-gray-800">{companion.name_person || "غير مسجل"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <User className="w-4 h-4" />
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">رقم الهوية</div>
                     <div className="font-bold text-gray-800 font-mono">{companion.number_id || "لا يوجد"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <AlertCircle className="w-4 h-4" />
                  </div>
               </div>
               
               <div className="flex items-center justify-end gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                     <div className="text-xs text-gray-500 mb-1">التقييم</div>
                     <div className="font-bold text-gray-800">{companion.evaluation ? `${companion.evaluation} نجوم` : "بدون تقييم"}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                     <AlertCircle className="w-4 h-4" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics Area (Left Side) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
            <h3 className="font-bold text-gray-800 mb-6">حالة المرافق</h3>
            
            <div className="mb-6">
               <div className="flex justify-between items-end mb-2">
                  <div className="text-xl font-bold text-gray-900">{companion.evaluation || "0"} نجوم</div>
                  <div className="text-xs text-gray-500">التقييم</div>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${companion.evaluation && companion.evaluation > 3 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${(companion.evaluation || 0) * 20}%` }}></div>
               </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
               <div className="text-[10px] text-gray-500 mb-2">آخر تحديث</div>
               <div className="text-sm font-bold text-gray-900 font-mono">
                  {companion.updated_at ? new Date(companion.updated_at).toLocaleDateString('ar-SA') : 'غير متوفر'}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
