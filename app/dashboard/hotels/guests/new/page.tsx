"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
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

export default function AddGuestPage() {
  const router = useRouter();
  
  const [hotels, setHotels] = useState<any[]>([]);
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestFormData>();

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [hotelsRes, nationalitiesRes] = await Promise.all([
          api.get('/hotal/hotel/'),
          api.get('/office_security/nationality/')
        ]);
        
        if (hotelsRes.data?.success) setHotels(hotelsRes.data.data.results || []);
        if (nationalitiesRes.data?.success) setNationalities(nationalitiesRes.data.data.results || []);
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
      }
    };
    
    fetchDropdowns();
  }, []);

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

      const response = await api.post('/hotal/person/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/hotels/guests');
        router.refresh();
      } else {
        setSubmitError(response.data?.message || "فشل في حفظ البيانات");
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex justify-between items-end mb-6 text-right border-b border-gray-100 pb-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-800 mb-1">إضافة نزيل جديد</h2>
             <p className="text-sm text-gray-500">يرجى تعبئة كافة البيانات المطلوبة بدقة لضمان تسجيل صحيح في النظام.</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Form Area (Right Side visually, order-2 in LTR but flex-row-reverse or just order-2) */}
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <div className="absolute top-6 left-6">
                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-bold">إلزامي</span>
              </div>
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
                    placeholder="أدخل الاسم الرباعي كما في الهوية"
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
                    placeholder="05xxxxxxxx"
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
                    placeholder="اختياري"
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
                    placeholder="رقم الهوية أو الجواز"
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
                <label className="block text-xs font-bold text-gray-700 mb-2">رفع صورة الهوية</label>
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
                className="bg-[#0f172a] hover:bg-gray-800 disabled:bg-gray-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1"
              >
                {isSubmitting ? "جاري الحفظ..." : "حفظ النزيل"}
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

            <div className="bg-[#0f172a] rounded-xl shadow-md p-6 text-white text-right">
              <h3 className="font-bold text-lg mb-2">معلومات التسجيل</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                بعد حفظ النزيل يمكنك فتح صفحة التفاصيل وإضافة المرافقين المرتبطين به.
              </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
