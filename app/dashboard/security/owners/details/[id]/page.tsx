import { User, Phone, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function OwnerDetailsPage({ params }: { params: { id: string } }) {
  let owner: any = null;
  let errorMessage = "";

  try {
    const response = await api.get(`/office_security/onwer/${params.id}/`);
    if (response.data && response.data.success) {
      owner = response.data.data;
    } else {
      errorMessage = response.data?.message || "فشل في جلب تفاصيل المالك";
    }
  } catch (error: any) {
    console.error("Error fetching owner details:", error);
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

  if (!owner) {
    return (
      <div className="text-center p-8 text-gray-500 font-bold">
        جاري تحميل تفاصيل المالك...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2 order-2 md:order-1 mt-4 md:mt-0">
           <Link href={`/dashboard/security/owners/${owner.id}`} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
             تعديل البيانات
           </Link>
        </div>

        <div className="text-right order-1 md:order-2 ml-auto">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">{owner.name}</h2>
           <div className="flex items-center gap-2 text-gray-500 text-xs justify-end">
              <span className="text-gray-400">الأمن</span>
              <span>/</span>
              <span className="text-gray-400">الملاك</span>
              <span>/</span>
              <span className="text-primary font-bold">تفاصيل المالك</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-6">
          <div className="w-20 h-20 rounded-xl bg-blue-50 text-primary border border-blue-100 flex items-center justify-center text-3xl font-bold relative shrink-0">
             {owner.name.charAt(0).toUpperCase()}
             <div className="absolute top-1 left-1 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
          </div>
          <div className="text-right">
             <h3 className="text-2xl font-bold text-gray-800 mb-1">{owner.name}</h3>
             <p className="text-sm text-gray-500">{owner.name_nationality || "بدون جنسية"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
           <div className="flex items-center justify-end gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                 <div className="text-xs text-gray-500 mb-1">نوع الهوية</div>
                 <div className="font-bold text-gray-800">{owner.type_id === 1 ? "بطاقة الهوية" : "جواز سفر"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                 <AlertCircle className="w-4 h-4" />
              </div>
           </div>

           <div className="flex items-center justify-end gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                 <div className="text-xs text-gray-500 mb-1">رقم الهوية</div>
                 <div className="font-bold text-gray-800 font-mono">{owner.number_id || "لا يوجد"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                 <AlertCircle className="w-4 h-4" />
              </div>
           </div>

           <div className="flex items-center justify-end gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                 <div className="text-xs text-gray-500 mb-1">رقم الجوال</div>
                 <div className="font-bold text-gray-800 font-mono">{owner.phone || "لا يوجد"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                 <Phone className="w-4 h-4" />
              </div>
           </div>
           
           <div className="flex items-center justify-end gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                 <div className="text-xs text-gray-500 mb-1">الحالة</div>
                 <div className="font-bold text-success flex items-center gap-1 justify-end">
                    نشط <CheckCircle2 className="w-4 h-4" />
                 </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                 <User className="w-4 h-4" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
