"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { FileText } from "lucide-react";
import Link from "next/link";

type GuestFormData = {
  name: string;
  type_id: string;
  number_id: string;
  phone: string;
  phone2: string;
  evaluation: string;
  hotel: number;
  nationality: number;
  pic?: FileList;
};

export default function EditGuestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [hotels, setHotels] = useState<any[]>([]);
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [existingPic, setExistingPic] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GuestFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guestRes, hotelsRes, nationalitiesRes] = await Promise.all([
          api.get(`/hotal/person/${id}/`),
          api.get('/hotal/hotel/'),
          api.get('/office_security/nationality/')
        ]);
        
        if (hotelsRes.data?.success) setHotels(hotelsRes.data.data.results || []);
        if (nationalitiesRes.data?.success) setNationalities(nationalitiesRes.data.data.results || []);

        if (guestRes.data?.success) {
          const guest = guestRes.data.data;
          
          setExistingPic(guest.pic || null);

          reset({
            name: guest.name || "",
            type_id: guest.type_id ? String(guest.type_id) : ("" as any),
            number_id: guest.number_id || "",
            phone: guest.phone || "",
            phone2: guest.phone2 || "",
            evaluation: guest.evaluation ? String(guest.evaluation) : "",
            hotel: guest.hotel || ("" as any),
            nationality: guest.nationality || ("" as any),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات النزيل");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: GuestFormData) => {
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("number_id", data.number_id);
      formData.append("phone", data.phone || "");
      formData.append("phone2", data.phone2 || "");
      
      if (data.type_id) formData.append("type_id", data.type_id);
      if (data.evaluation) formData.append("evaluation", data.evaluation);
      if (data.hotel) formData.append("hotel", String(data.hotel));
      if (data.nationality) formData.append("nationality", String(data.nationality));

      if (data.pic && data.pic.length > 0) {
        formData.append("pic", data.pic[0]);
      }

      const response = await api.put(`/hotal/person/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/hotels/guests');
        router.refresh();
      } else {
        const errors = response.data?.errors || response.data?.message;
        
        const errorMsg = typeof errors === 'object' 
          ? Object.values(errors).flat().join(" | ") 
          : (errors || "فشل في حفظ التعديلات");
        
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

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex justify-between items-end mb-6 text-right border-b border-gray-100 pb-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-800 mb-1">تعديل بيانات النزيل</h2>
             <p className="text-sm text-gray-500">تحديث بيانات النزيل في النظام.</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-right">البيانات الشخصية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الفندق *</label>
                  <select 
                    {...register("hotel", { required: "الفندق مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر الفندق...</option>
                    {hotels.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  {errors.hotel && <p className="text-red-500 text-xs mt-1">{errors.hotel.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                  <input 
                    type="text" 
                    {...register("name", { required: "الاسم مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                    dir="rtl"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الجنسية *</label>
                  <select 
                    {...register("nationality", { required: "الجنسية مطلوبة" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
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
                  <label className="block text-xs font-bold text-gray-700 mb-2">رقم الجوال *</label>
                  <input 
                    type="text" 
                    {...register("phone", { required: "رقم الجوال مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400 font-mono"
                    dir="rtl"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="md:col-start-2">
                  <label className="block text-xs font-bold text-gray-700 mb-2">رقم جوال إضافي</label>
                  <input 
                    type="text" 
                    {...register("phone2")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400 font-mono"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Identity Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-right">بيانات الهوية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">رقم الهوية / الجواز *</label>
                  <input 
                    type="text" 
                    {...register("number_id", { required: "رقم الهوية مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                    dir="rtl"
                  />
                  {errors.number_id && <p className="text-red-500 text-xs mt-1">{errors.number_id.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">نوع الهوية *</label>
                  <select 
                    {...register("type_id", { required: "نوع الهوية مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
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

              <div className="text-right">
                <label className="block text-xs font-bold text-gray-700 mb-2">تحديث صورة الهوية (اختياري)</label>
                {existingPic && (
                  <div className="mb-3 flex justify-end">
                    <a href={existingPic} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      عرض الصورة الحالية
                    </a>
                  </div>
                )}
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50 flex justify-end">
                  <input 
                    type="file" 
                    {...register("pic")}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0f172a] file:text-white hover:file:bg-gray-800 focus:outline-none cursor-pointer"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions Area */}
          <div className="w-full lg:w-72 flex flex-col gap-6 order-1 lg:order-2 shrink-0">
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1"
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
              <h3 className="font-bold text-gray-800 mb-4">التقييم الأولي</h3>
              <label className="block text-xs font-bold text-gray-700 mb-2">درجة التقييم</label>
              <input 
                type="number" 
                min="1"
                max="5"
                {...register("evaluation")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                dir="rtl"
                placeholder="من 1 إلى 5"
              />
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
