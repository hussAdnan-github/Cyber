"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Building2, FileText, Shield } from "lucide-react";
import { Center } from "@/types/security";

type CenterFormData = {
  name: string;
  phone: string;
  phone2: string;
  place: number;
  user: number;
};

export default function EditCenterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [places, setPlaces] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CenterFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centerRes, placesRes, usersRes] = await Promise.all([
          api.get(`/office_security/center/${id}/`),
          api.get('/office_security/places/'),
          api.get('/users/')
        ]);
        
        if (placesRes.data?.success) setPlaces(placesRes.data.data.results || []);
        if (usersRes.data?.success) setUsers(usersRes.data.data.results || []);

        if (centerRes.data?.success) {
          const center: Center = centerRes.data.data;
          reset({
            name: center.name || "",
            phone: center.phone || "",
            phone2: center.phone2 || "",
            place: center.place || ("" as any),
            user: center.user || ("" as any),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات المركز");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: CenterFormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        place: data.place ? Number(data.place) : null,
        user: data.user ? Number(data.user) : null,
      };

      const response = await api.patch(`/office_security/center/${id}/`, payload);
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/security/centers');
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header and top buttons */}
        <div className="flex justify-between items-end mb-6 text-right">
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
          <div>
             <div className="flex items-center gap-2 justify-end mb-1">
               <h2 className="text-2xl font-bold text-gray-800">تعديل المركز الأمني</h2>
               <Building2 className="w-6 h-6 text-gray-800" />
             </div>
             <p className="text-sm text-gray-500">تحديث تفاصيل المركز والمسؤولين لضمان دقة النظام الأمني.</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar Actions Area (Left Side) */}
          <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 shrink-0">
            
            <div className="bg-[#0f172a] rounded-xl shadow-sm text-white p-6 text-right relative overflow-hidden">
              <div className="absolute top-6 left-6">
                 <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md text-xs font-bold border border-emerald-500/30">
                   ACTIVE STATUS
                 </span>
              </div>
              <div className="flex justify-end mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-right">نظرة عامة</h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed text-right">
                تأكد من صحة المركز والمكان والمسؤول حتى تظهر بيانات التشغيل بشكل دقيق في لوحة القيادة.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="text-sm font-bold">نشط</span>
                  <span className="text-xs text-gray-400">حالة المركز</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-sm font-bold">مركز أمني</span>
                  <span className="text-xs text-gray-400">نوع السجل</span>
                </div>
              </div>
            </div>

          </div>

          {/* Main Form Area (Right Side) */}
          <div className="flex-1 space-y-6 order-1 lg:order-2">
            
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
              <h3 className="text-lg font-bold text-gray-800 mb-8">المعلومات الأساسية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">المكان التابع له *</label>
                  <select 
                    {...register("place", { required: "المكان مطلوب" })}
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
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">اسم المركز *</label>
                  <input 
                    type="text" 
                    {...register("name", { required: "اسم المركز مطلوب" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                    dir="rtl"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact and Responsibility Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
              <h3 className="text-lg font-bold text-gray-800 mb-8">بيانات التواصل والمسؤولية</h3>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3">المستخدم المسؤول *</label>
                <select 
                  {...register("user", { required: "المستخدم مطلوب" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                >
                  <option value="">اختر المستخدم...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                  ))}
                </select>
                {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف الثانوي</label>
                  <input 
                    type="text" 
                    {...register("phone2")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف الأساسي *</label>
                  <input 
                    type="text" 
                    {...register("phone", { required: "رقم الهاتف الأساسي مطلوب" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                    dir="rtl"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
