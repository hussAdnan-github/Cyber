"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import Link from "next/link";

type BlacklistFormData = {
  name: string;
  reason: string;
};

export default function EditBlacklistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlacklistFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/office_security/black_list/${id}/`);
        if (response.data?.success) {
          reset({
            name: response.data.data.name || "",
            reason: response.data.data.reason || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات السجل");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: BlacklistFormData) => {
    setSubmitError("");
    try {
      const response = await api.put(`/office_security/black_list/${id}/`, data);
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/security/blacklist');
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
    <div className="space-y-6 max-w-4xl mx-auto mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header Link */}
        <div className="flex justify-between items-center mb-6">
          <button 
            type="button"
            onClick={() => router.back()}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm inline-block"
          >
            العودة للوحة القيادة
          </button>
          <h2 className="text-2xl font-bold text-gray-800 hidden">تعديل سجل القائمة السوداء</h2>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-right">
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تعديل سجل القائمة السوداء</h2>
            <p className="text-sm text-gray-500">تحديث تفاصيل الحالة الأمنية.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6 text-right">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">الاسم *</label>
              <input 
                type="text" 
                {...register("name", { required: "الاسم مطلوب" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">سبب الإدراج *</label>
              <textarea 
                rows={4}
                {...register("reason", { required: "سبب الإدراج مطلوب" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white resize-none"
                dir="rtl"
              ></textarea>
              {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
            </div>

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
