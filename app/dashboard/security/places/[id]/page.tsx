"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { MapPin } from "lucide-react";
import Link from "next/link";

type PlaceFormData = {
  name: string;
  location: string;
};

export default function EditPlacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PlaceFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/office_security/places/${id}/`);
        if (response.data?.success) {
          const place = response.data.data;
          reset({
            name: place.name || "",
            location: place.location || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات المكان");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: PlaceFormData) => {
    setSubmitError("");
    try {
      const response = await api.patch(`/office_security/places/${id}/`, data);
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/security/places');
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Top Breadcrumb/Header */}
        <div className="flex justify-end items-center mb-6 text-right">
           <div className="text-sm font-bold text-gray-500 flex items-center justify-end gap-2">
             <span className="text-gray-800 font-bold">تعديل مكان</span>
             <span>/</span>
             <Link href="/dashboard/security/places" className="hover:text-gray-800 transition-colors">
               الأماكن
             </Link>
             <span>/</span>
             <Link href="/dashboard" className="hover:text-gray-800 transition-colors">
               لوحة القيادة
             </Link>
           </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar (Left Side) */}
          <div className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1 shrink-0">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
              <h3 className="font-bold text-gray-800 mb-4">إرشادات هامة</h3>
              <ul className="text-xs text-gray-500 space-y-3 leading-relaxed">
                <li>• يجب أن يكون الاسم واضحاً وغير مكرر قدر الإمكان.</li>
                <li>• اكتب الموقع بطريقة تساعد فريق الأمن على الوصول بسرعة.</li>
                <li>• يمكن ربط أكثر من مركز بهذا المكان بعد حفظه.</li>
              </ul>
            </div>

            <div className="bg-[#0f172a] rounded-xl shadow-sm text-white p-6 text-right">
              <h3 className="font-bold mb-4">تحديث المواقع</h3>
              <p className="text-xs text-gray-400">
                الحفاظ على دقة معلومات الأماكن يسهل عملية إدارة المراكز المرتبطة بها.
              </p>
            </div>

          </div>

          {/* Main Content (Right Side) */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 order-1 lg:order-2">
            
            <div className="flex items-center gap-3 justify-end mb-8 border-b border-gray-100 pb-6">
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-800 mb-1">بيانات المكان</h2>
                <p className="text-sm text-gray-500">تحديث تفاصيل الموقع والمعلومات الأساسية.</p>
              </div>
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>

            <div className="space-y-6 text-right">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">اسم المكان *</label>
                <input 
                  type="text" 
                  {...register("name", { required: "اسم المكان مطلوب" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="rtl"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">الموقع</label>
                <input 
                  type="text" 
                  {...register("location")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                  dir="rtl"
                />
              </div>

              {/* Map Placeholder */}
              <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mt-6">
                <div className="absolute inset-0 opacity-50 bg-[url('https://maps.wikimedia.org/osm-intl/12/2458/1749.png')] bg-cover bg-center mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[#e0e0d1]/30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="w-10 h-10 text-red-600 fill-red-600" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-8 justify-end border-t border-gray-100 mt-8">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  إلغاء الأمر
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-10 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>

            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
