"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

type PassengerFormData = {
  name: string;
  type_id: number;
  number_id: string;
  pic: FileList | null;
  phone: string;
  phone2: string;
  evaluation: number;
  trip: number;
  nationality: number;
};

export default function AddPassengerPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [nationalities, setNationalities] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PassengerFormData>();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [tripsRes, natRes] = await Promise.all([
          api.get('/office_travel/trip/'),
          api.get('/office_security/nationality/')
        ]);
        
        if (tripsRes.data?.success) setTrips(tripsRes.data.data.results || []);
        if (natRes.data?.success) setNationalities(natRes.data.data.results || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchDropdownData();
  }, []);

  const onSubmit = async (data: PassengerFormData) => {
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("number_id", data.number_id || "");
      formData.append("phone", data.phone || "");
      if (data.phone2) formData.append("phone2", data.phone2);
      
      if (data.type_id) formData.append("type_id", data.type_id.toString());
      if (data.evaluation) formData.append("evaluation", data.evaluation.toString());
      if (data.trip) formData.append("trip", data.trip.toString());
      if (data.nationality) formData.append("nationality", data.nationality.toString());
      
      // Handle file upload
      if (data.pic && data.pic.length > 0) {
        formData.append("pic", data.pic[0]);
      }

      const response = await api.post('/office_travel/traveler/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/travels/passengers');
        router.refresh();
      } else {
        setSubmitError(response.data?.message || "فشل في حفظ البيانات");
      }
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error.message || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Actions Area */}
        <div className="w-full lg:w-48 flex flex-col gap-3 order-2 lg:order-1 shrink-0">
          <div className="flex gap-3">
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
              className="bg-[#0f172a] hover:bg-gray-800 disabled:bg-gray-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex-1"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ المسافر"}
            </button>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 order-1 lg:order-2">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right mb-6">
            <div className="mb-8 border-b border-gray-100 pb-6 text-center md:text-right">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">إضافة مسافر جديد</h2>
              <p className="text-sm text-gray-500">اربط المسافر برحلة قائمة وأضف بيانات الهوية والتقييم.</p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold">
                {submitError}
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-800 mb-8">بيانات المسافر</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">اسم المسافر *</label>
                  <input 
                    type="text" 
                    {...register("name", { required: "اسم المسافر مطلوب" })}
                    placeholder="الاسم الكامل"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                    dir="rtl"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">الرحلة</label>
                  <select 
                    {...register("trip")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر الرحلة...</option>
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.name_travel}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">الجنسية</label>
                  <select 
                    {...register("nationality")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر الجنسية...</option>
                    {nationalities.map(n => (
                      <option key={n.id} value={n.id}>{n.name_nationality}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">نوع الهوية</label>
                  <select 
                    {...register("type_id")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر نوع الهوية...</option>
                    <option value="1">هوية وطنية / بطاقة شخصية</option>
                    <option value="2">جواز سفر</option>
                    <option value="3">إقامة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-bold text-gray-700 mb-3">التقييم</label>
                  <select 
                    {...register("evaluation")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">بدون تقييم</option>
                    <option value="1">ممتاز</option>
                    <option value="2">متوسط</option>
                    <option value="3">سيئ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">رقم الهاتف *</label>
                  <input 
                    type="text" 
                    {...register("phone", { required: "رقم الهاتف مطلوب" })}
                    placeholder="7xxxxxxx"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
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
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">صورة الهوية</label>
                <div className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                  <input 
                    type="file" 
                    accept="image/*"
                    {...register("pic")}
                    className="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none cursor-pointer"
                    dir="rtl"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </form>
    </div>
  );
}
