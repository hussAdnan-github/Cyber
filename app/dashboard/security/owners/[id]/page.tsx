"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { User, FileText } from "lucide-react";
import Link from "next/link";
import { Owner } from "@/types/security";

type OwnerFormData = {
  name: string;
  type_id: string;
  number_id: string;
  phone: string;
  phone2: string;
  nationality: string;
  documents?: FileList;
};

export default function EditOwnerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [nationalities, setNationalities] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [existingDocument, setExistingDocument] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OwnerFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownerRes, nationalitiesRes] = await Promise.all([
          api.get(`/office_security/onwer/${id}/`),
          api.get('/office_security/nationality/')
        ]);

        if (nationalitiesRes.data?.success) {
          setNationalities(nationalitiesRes.data.data.results || []);
        }

        if (ownerRes.data?.success) {
          const owner: Owner = ownerRes.data.data;
          
          setExistingDocument(owner.documents || null);

          reset({
            name: owner.name || "",
            type_id: owner.type_id ? String(owner.type_id) : ("" as any),
            number_id: owner.number_id || "",
            phone: owner.phone || "",
            phone2: owner.phone2 || "",
            nationality: owner.nationality ? String(owner.nationality) : ("" as any),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات المالك");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: OwnerFormData) => {
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("number_id", data.number_id);
      formData.append("phone", data.phone || "");
      formData.append("phone2", data.phone2 || "");
      
      if (data.type_id) formData.append("type_id", data.type_id);
      if (data.nationality) formData.append("nationality", data.nationality);

      if (data.documents && data.documents.length > 0) {
        formData.append("documents", data.documents[0]);
      }

      const response = await api.patch(`/office_security/onwer/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/security/owners');
        router.refresh();
      } else {
        setSubmitError(response.data?.message || "فشل في حفظ التعديلات");
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top Breadcrumb/Header */}
        <div className="flex justify-between items-center mb-6 text-right">
          <div></div>
          <div>
             <h2 className="text-2xl font-bold text-gray-800 hidden">تعديل بيانات المالك</h2>
             <div className="text-sm font-bold text-gray-500 flex items-center justify-end gap-2 mt-2">
               <span className="text-blue-600">تعديل بيانات المالك</span>
               <span>{'<'}</span>
               <Link href="/dashboard/security/owners" className="hover:text-gray-800 transition-colors">
                 الملاك
               </Link>
             </div>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        {/* Main Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Dark Header */}
          <div className="bg-[#0f172a] p-6 text-white flex justify-between items-center text-right mx-6 mt-6 rounded-xl">
             <div className="bg-white/10 p-3 rounded-lg">
               <User className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="text-xl font-bold mb-1">تعديل بيانات المالك</h3>
               <p className="text-xs text-gray-400">يرجى تحديث الحقول المطلوبة لضمان دقة السجلات الأمنية.</p>
             </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-8 text-right">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">الاسم الكامل *</label>
              <input 
                type="text" 
                {...register("name", { required: "الاسم مطلوب" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">الجنسية *</label>
                <select 
                  {...register("nationality", { required: "الجنسية مطلوبة" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                >
                  <option value="">اختر الجنسية...</option>
                  {nationalities.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">نوع الهوية *</label>
                <select 
                  {...register("type_id", { required: "نوع الهوية مطلوب" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                >
                  <option value="">اختر نوع الهوية...</option>
                  <option value="1">جواز سفر</option>
                  <option value="2">بطاقة شخصية</option>
                  <option value="3">شهادة ميلاد</option>
                </select>
                {errors.type_id && <p className="text-red-500 text-xs mt-1">{errors.type_id.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهوية *</label>
              <input 
                type="text" 
                {...register("number_id", { required: "رقم الهوية مطلوب" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
              {errors.number_id && <p className="text-red-500 text-xs mt-1">{errors.number_id.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">تحديث وثيقة الهوية (اختياري)</label>
              
              {existingDocument && (
                <div className="mb-3 flex justify-end">
                  <a href={existingDocument} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    عرض الوثيقة الحالية
                  </a>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                <input 
                  type="file" 
                  {...register("documents")}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0f172a] file:text-white hover:file:bg-gray-800 focus:outline-none cursor-pointer"
                  dir="rtl"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">اختر ملفاً جديداً فقط إذا أردت استبدال الوثيقة السابقة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم الجوال الإضافي</label>
                <input 
                  type="text" 
                  {...register("phone2")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم الجوال الأساسي</label>
                <input 
                  type="text" 
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 justify-start">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>
              <button 
                type="button" 
                onClick={() => router.back()}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                إلغاء
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
