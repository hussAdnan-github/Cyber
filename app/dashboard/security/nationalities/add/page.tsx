"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import Link from "next/link";

type NationalityFormData = {
  name: string;
};

export default function AddNationalityPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NationalityFormData>();

  const onSubmit = async (data: NationalityFormData) => {
    setSubmitError("");
    try {
      const response = await api.post('/office_security/nationality/', data);
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/security/nationalities');
        router.refresh();
      } else {
        setSubmitError(response.data?.message || "فشل في حفظ البيانات");
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-800 hidden">إضافة جنسية</h2>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-right">
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">إضافة جنسية</h2>
            <p className="text-sm text-gray-500">إضافة جنسية لاستخدامها في ملفات الملاك والوثائق.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8 text-right">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 text-right">اسم الجنسية *</label>
              <input 
                type="text" 
                {...register("name", { required: "اسم الجنسية مطلوب" })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="flex gap-4 pt-4 justify-end">
               <button 
                 type="button" 
                 onClick={() => router.back()}
                 className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
               >
                إلغاء
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#0f172a] hover:bg-gray-800 disabled:bg-gray-500 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ الجنسية"}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
