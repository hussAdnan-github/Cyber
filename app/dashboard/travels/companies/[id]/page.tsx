"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Company } from "@/types/travel";

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

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [places, setPlaces] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CompanyFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, placesRes, ownersRes, usersRes] = await Promise.all([
          api.get(`/office_travel/travel/${id}/`),
          api.get('/office_security/places/'),
          api.get('/office_security/onwer/'),
          api.get('/users/')
        ]);
        
        if (placesRes.data?.success) setPlaces(placesRes.data.data.results || []);
        if (ownersRes.data?.success) setOwners(ownersRes.data.data.results || []);
        if (usersRes.data?.success) setUsers(usersRes.data.data.results || []);

        if (companyRes.data?.success) {
          const company: Company = companyRes.data.data;
          reset({
            name: company.name || "",
            location: company.location || "",
            phone: company.phone || "",
            phone2: company.phone2 || "",
            email: company.email || "",
            description: company.description || "",
            place: company.place || ("" as any),
            onwer: company.onwer || ("" as any),
            user: company.user || ("" as any),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات الشركة");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        place: data.place ? Number(data.place) : null,
        onwer: data.onwer ? Number(data.onwer) : null,
        user: data.user ? Number(data.user) : null,
      };

      const response = await api.patch(`/office_travel/travel/${id}/`, payload);
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/travels/companies');
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
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
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

        </div>

        {/* Main Form Area */}
        <div className="flex-1 order-1 lg:order-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right mb-6">
            <div className="mb-8 border-b border-gray-100 pb-6 text-center md:text-right">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">تعديل بيانات الشركة</h2>
              <p className="text-sm text-gray-500">تحديث معلومات شركة السفر والمسؤولين عنها.</p>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">وصف الشركة</label>
                <textarea 
                  {...register("description")}
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
