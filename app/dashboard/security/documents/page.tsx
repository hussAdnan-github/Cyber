import { Plus, Search, Eye, Edit, Trash2, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = 'force-dynamic';

type SecurityDocument = {
  id: number;
  type_id: number;
  number_id: string;
  pic: string | null;
  crated_at: string;
  updated_at: string;
  black_list: number;
};

export default async function DocumentsPage() {
  let documents: SecurityDocument[] = [];
  let errorMessage = "";
  let totalDocs = 0;

  try {
    const response = await api.get<ApiResponse<SecurityDocument>>("/office_security/documents/");
    if (response.data && response.data.success) {
      documents = response.data.data.results || [];
      totalDocs = response.data.data.count || documents.length;
    } else {
      errorMessage = response.data?.message || "فشل في جلب البيانات من الخادم";
    }
  } catch (error: any) {
    errorMessage = error.response?.data?.message || error.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم";
    console.error("Error fetching documents:", error);
  }

  const getTypeName = (typeId: number) => {
    switch (typeId) {
      case 1: return "جواز سفر";
      case 2: return "بطاقة شخصية";
      case 3: return "شهادة ميلاد";
      default: return "وثيقة أخرى";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">إدارة المستندات</h2>
          <p className="text-gray-500 text-sm">مراقبة وتنظيم وثائق الهوية والتحقق من السجلات الأمنية.</p>
        </div>
        <Link href="/dashboard/security/documents/add" className="bg-success hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
          إضافة مستند جديد
          <Plus className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex w-full md:w-auto gap-2">
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
              إعادة ضبط
            </button>
            <button className="bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
              تطبيق الفلترة
            </button>
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                className="w-full pr-4 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                placeholder="اكتب للبحث أو اختر من القائمة"
                dir="rtl"
              />
            </div>
            <div className="relative flex-1 md:w-80">
              <input 
                type="text" 
                className="w-full pr-4 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                placeholder="البحث برقم الهوية أو الاسم..."
                dir="rtl"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                <th className="py-4 px-6 font-medium text-center">الوثيقة</th>
                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                <th className="py-4 px-6 font-medium text-center">النوع</th>
                <th className="py-4 px-6 font-medium text-center">صاحب الوثيقة (القائمة السوداء)</th>
                <th className="py-4 px-6 font-medium text-left">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border border-gray-200 overflow-hidden">
                        {doc.pic ? (
                          <img src={doc.pic} alt={`وثيقة ${doc.number_id}`} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-medium text-gray-800">{doc.number_id}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        {getTypeName(doc.type_id)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-gray-800">
                      ID: {doc.black_list}
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/dashboard/security/documents/details/${doc.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/security/documents/${doc.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteButton endpoint="/office_security/documents/" id={doc.id} permission="delete_documents" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    لا توجد مستندات مسجلة حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
          <div>إجمالي المستندات: {totalDocs}</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
          <h3 className="text-gray-500 text-xs mb-1 text-right">إجمالي الوثائق</h3>
          <span className="text-2xl font-bold text-gray-900">{totalDocs}</span>
        </div>
      </div>
    </div>
  );
}

