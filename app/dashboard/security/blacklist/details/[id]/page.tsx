import { AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function DetailsPage({ params }: { params: { id: string } }) {
  let data: any = null;
  let errorMessage = "";

  try {
    const response = await api.get(`/office_security/blacklist/${params.id}/`);
    if (response.data && response.data.success) {
      data = response.data.data;
    } else {
      data = response.data;
    }
  } catch (error: any) {
    console.error("Error fetching details:", error);
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

  if (!data) {
    return (
      <div className="text-center p-8 text-gray-500 font-bold">
        جاري تحميل التفاصيل...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2 order-2 md:order-1 mt-4 md:mt-0">
           <Link href={`/dashboard/security/blacklist/${data.id}`} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
             تعديل البيانات
           </Link>
        </div>

        <div className="text-right order-1 md:order-2 ml-auto">
           <h2 className="text-2xl font-bold text-gray-800 mb-1">{data.name || data.username || data.title || "تفاصيل العنصر"}</h2>
           <div className="flex items-center gap-2 text-gray-500 text-xs justify-end">
              <span className="text-primary font-bold">التفاصيل</span>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-6">
          <div className="w-20 h-20 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-3xl font-bold relative shrink-0">
             <AlertCircle className="w-8 h-8 text-red-500" />
             <div className="absolute top-1 left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-right">
             <h3 className="text-2xl font-bold text-gray-800 mb-1">{data.name || data.username || data.title || "بدون اسم"}</h3>
             <p className="text-sm text-gray-500">المعرف: {data.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
           {Object.entries(data).filter(([k,v]) => typeof v === 'string' || typeof v === 'number').map(([key, value]) => (
             <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="font-bold text-gray-800 break-all w-2/3">{String(value)}</div>
                <div className="text-xs text-gray-500 w-1/3">{key}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
