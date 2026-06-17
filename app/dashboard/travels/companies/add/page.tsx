"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

type CompanyFormData = {
  name: string;
  location: string;
  phone: string;
  phone2: string;
  email: string;
  description: string;
  place: number;
  onwer: number;
  user: number;
};

export default function AddCompanyPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyFormData>();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [placesRes, ownersRes, usersRes] = await Promise.all([
          api.get('/office_security/places/'),
          api.get('/office_security/onwer/'),
          api.get('/users/')
        ]);
        
        if (placesRes.data?.success) setPlaces(placesRes.data.data.results || []);
        if (ownersRes.data?.success) setOwners(ownersRes.data.data.results || []);
        if (usersRes.data?.success) setUsers(usersRes.data.data.results || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchDropdownData();
  }, []);

  const onSubmit = async (data: CompanyFormData) => {
    setSubmitError("");
    try {
      // Ensure numerical values are parsed correctly
      const payload = {
        ...data,
        place: data.place ? Number(data.place) : null,
        onwer: data.onwer ? Number(data.onwer) : null,
        user: data.user ? Number(data.user) : null,
      };

      const response = await api.post('/office_travel/travel/', payload);
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/travels/companies');
        router.refresh();
      } else {
        const errors = response.data?.errors || response.data?.message;
        const errorMsg = typeof errors === 'object' 
          ? Object.values(errors).flat().join(" | ") 
          : (errors || "فشل في حفظ البيانات");
        
        setSubmitError(errorMsg as string);
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors || error?.response?.data?.message;
      const errorMsg = typeof errors === 'object' 
        ? Object.values(errors).flat().join(" | ") 
        : (errors || error.message || "حدث خطأ غير متوقع");
        
      setSubmitError(errorMsg as string);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Actions Area */}
        <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 shrink-0">
          
          <div className="flex gap-3 mb-2">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-24"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#059669] hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">بيانات التواصل</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف</label>
                <input 
                  type="text" 
                  {...register("phone", { required: "رقم الهاتف مطلوب" })}
                  placeholder="7xxxxxxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">رقم هاتف إضافي</label>
                <input 
                  type="text" 
                  {...register("phone2")}
                  placeholder="05xxxxxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  {...register("email")}
                  placeholder="info@company.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-100 p-6 text-center">
            <h4 className="text-emerald-700 font-bold mb-2">سيتم تفعيل الشركة فوراً بعد الحفظ</h4>
            <p className="text-emerald-600/80 text-xs leading-relaxed">
              يمكنك ربطها لاحقاً بخطوط السفر والرحلات من صفحات الخطوط والرحلات.
            </p>
          </div>

        </div>

        {/* Main Form Area */}
        <div className="flex-1 order-1 lg:order-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right mb-6">
            <div className="mb-8 border-b border-gray-100 pb-6 text-center md:text-right">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">إضافة شركة سفر جديدة</h2>
              <p className="text-sm text-gray-500">أدخل بيانات الشركة والمالك والمستخدم المسؤول عن إدارتها.</p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold">
                {submitError}
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-800 mb-8">بيانات الشركة</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">اسم الشركة *</label>
                  <input 
                    type="text" 
                    {...register("name", { required: "اسم الشركة مطلوب" })}
                    placeholder="مثال: آفاق للسياحة"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                    dir="rtl"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">المكان *</label>
                  <select 
                    {...register("place", { required: "يرجى اختيار المكان" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر المكان...</option>
                    {places.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.place && <p className="text-red-500 text-xs mt-1">{errors.place.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">المالك</label>
                  <select 
                    {...register("onwer")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر المالك...</option>
                    {owners.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">المستخدم المرتبط</label>
                  <select 
                    {...register("user")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر المستخدم...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">العنوان</label>
                <input 
                  type="text" 
                  {...register("location")}
                  placeholder="الرياض، حي المروج"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">وصف الشركة</label>
                <textarea 
                  {...register("description")}
                  placeholder="نبذة مختصرة عن الشركة وخدماتها"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 resize-none"
                  dir="rtl"
                ></textarea>
              </div>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
}
