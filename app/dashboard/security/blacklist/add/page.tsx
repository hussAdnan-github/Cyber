"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import Link from "next/link";

type BlacklistFormData = {
  name: string;
  reason: string;
  actvite: boolean;
  user_created: string;
};

export default function AddBlacklistPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BlacklistFormData>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/');
        if (response.data?.success) {
          setUsersList(response.data.data.results || []);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data: BlacklistFormData) => {
    setSubmitError("");
    try {
      const payload: any = {
        name: data.name || "",
        reason: data.reason || "",
        actvite: data.actvite || false,
      };

      if (data.user_created) {
        payload.user_created = parseInt(data.user_created);
      }

      const response = await api.post('/office_security/blacklist/', payload);
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/security/blacklist');
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
          <h2 className="text-2xl font-bold text-gray-800 hidden">إضافة إلى القائمة السوداء</h2>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-8 border-b border-gray-100 flex justify-between items-start text-right flex-row-reverse">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">إضافة إلى القائمة السوداء</h2>
              <p className="text-sm text-gray-500">تسجيل حالة تستدعي المتابعة الأمنية.</p>
            </div>
            <Link href="/dashboard/security/blacklist" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
              العودة للقائمة
            </Link>
          </div>

          <div className="p-8 space-y-6 text-right">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="w-full md:w-40 font-bold text-gray-700">الاسم</label>
              <input 
                type="text" 
                {...register("name")}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                dir="rtl"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <label className="w-full md:w-40 font-bold text-gray-700 pt-3">السبب</label>
              <textarea 
                rows={3}
                {...register("reason")}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white resize-none"
                dir="rtl"
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="w-full md:w-40 font-bold text-gray-700">هل هو مطلوب</label>
              <div className="flex-1 flex items-center justify-end">
                <input 
                  type="checkbox" 
                  {...register("actvite")}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <label className="w-full md:w-40 font-bold text-gray-700">المستخدم الذي أضاف</label>
              <select 
                {...register("user_created")}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                dir="rtl"
              >
                <option value="">اختر المستخدم...</option>
                {usersList.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.username || u.name || `User ${u.id}`}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-6 justify-start flex-row-reverse">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#059669] hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ السجل"}
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

        </div>
      </form>
    </div>
  );
}
