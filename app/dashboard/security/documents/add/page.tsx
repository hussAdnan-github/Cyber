"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type DocumentFormData = {
  type_id: string;
  number_id: string;
  black_list: number;
  pic?: FileList;
};

export default function AddDocumentPage() {
  const router = useRouter();
  
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DocumentFormData>();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const response = await api.get('/office_security/blacklist/');
        if (response.data?.success) {
          setBlacklist(response.data.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching blacklist:", error);
      }
    };
    
    fetchDropdowns();
  }, []);

  const onSubmit = async (data: DocumentFormData) => {
    setSubmitError("");
    try {
      const formData = new FormData();
      if (data.number_id) {
        formData.append("number_id", data.number_id);
      } else {
        formData.append("number_id", "");
      }
      
      if (data.type_id) {
        formData.append("type_id", data.type_id);
      }
      
      if (data.black_list) {
        formData.append("black_list", String(data.black_list));
      }

      if (data.pic && data.pic.length > 0) {
        formData.append("pic", data.pic[0]);
      }

      const response = await api.post('/office_security/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/security/documents');
        router.refresh();
      } else {
        setSubmitError(response.data?.message || "فشل في حفظ البيانات");
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-start text-right flex-row-reverse">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">إضافة مستند جديد</h2>
              <p className="text-sm text-gray-500">أدخل تفاصيل الوثيقة الأمنية وتأكد من صحة البيانات.</p>
            </div>
            <Link href="/dashboard/security/documents" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
              العودة للقائمة
            </Link>
          </div>

          {submitError && (
            <div className="m-8 mb-0 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
              {submitError}
            </div>
          )}

          {/* Form Content */}
          <div className="p-8 space-y-6 text-right">
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="w-full md:w-32 font-bold text-gray-700">نوع الهوية</label>
              <select 
                {...register("type_id")}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                dir="rtl"
              >
                <option value="">اختر نوع الهوية...</option>
                <option value="1">جواز سفر</option>
                <option value="2">بطاقة شخصية / الهوية</option>
                <option value="3">شهادة ميلاد</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="w-full md:w-32 font-bold text-gray-700">رقم الهوية</label>
              <input 
                type="text" 
                {...register("number_id")}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="w-full md:w-32 font-bold text-gray-700">صورة الهوية</label>
              <div className="flex-1 p-2 border border-gray-200 rounded-lg bg-white flex items-center">
                <input 
                  type="file" 
                  {...register("pic")}
                  className="text-sm text-gray-500 file:ml-4 file:py-1 file:px-3 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-100 hover:file:bg-gray-200 focus:outline-none cursor-pointer"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="w-full md:w-32 font-bold text-gray-700">القائمة السوداء</label>
              <select 
                {...register("black_list")}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                dir="rtl"
              >
                <option value="">اختر الشخص...</option>
                {blacklist.map(person => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 flex-row-reverse justify-start">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#059669] hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ الوثيقة"}
              </button>
              <button 
                type="button" 
                onClick={() => router.back()}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                إلغاء العملية
              </button>
            </div>

          </div>
          
          {/* Footer Note */}
          <div className="bg-blue-50 p-4 text-center border-t border-blue-100">
            <p className="text-blue-600 text-sm font-bold">
              يرجى التأكد من وضوح صورة الوثيقة ومطابقة رقم الهوية للأصل.
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}
