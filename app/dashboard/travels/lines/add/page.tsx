"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

type LineFormData = {
  track: string;
  type_travel: number;
  place_from: number;
  place_to: number;
  travel: number[];
};

export default function AddLinePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LineFormData>();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [placesRes, companiesRes] = await Promise.all([
          api.get('/office_security/places/'),
          api.get('/office_travel/travel/')
        ]);
        
        if (placesRes.data?.success) setPlaces(placesRes.data.data.results || []);
        if (companiesRes.data?.success) setCompanies(companiesRes.data.data.results || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchDropdownData();
  }, []);

  const onSubmit = async (data: LineFormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        place_from: data.place_from ? Number(data.place_from) : null,
        place_to: data.place_to ? Number(data.place_to) : null,
        type_travel: data.type_travel ? Number(data.type_travel) : null,
        travel: Array.isArray(data.travel) ? data.travel.map(Number) : [Number(data.travel)].filter(Boolean),
      };

      const response = await api.post('/office_travel/line_travel/', payload);
      
      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/travels/lines');
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
      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Top Header & Actions */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3">
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ خط السفر"}
            </button>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">تخطيط خط سفر جديد</h2>
            <p className="text-sm text-gray-500">أضف تفاصيل المسار الجديد وحدد الشركات المشغلة المعتمدة.</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        {/* Row 1: Map and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Map Preview (Left) */}
          <div className="lg:col-span-1 bg-[#1e293b] rounded-xl shadow-sm border border-gray-800 overflow-hidden relative min-h-[300px] order-2 lg:order-1">
            <div className="absolute inset-0 opacity-40 bg-[url('https://maps.wikimedia.org/osm-intl/12/2458/1749.png')] bg-cover bg-center mix-blend-screen grayscale"></div>
            
            <div className="absolute top-6 right-6 text-right">
              <h3 className="text-white font-bold text-lg">معاينة المسار</h3>
              <p className="text-white/60 text-xs mt-1">توضيح جغرافي لمسار الرحلة المباشر</p>
            </div>

            {/* Map Path visualization */}
            <div className="absolute top-1/2 left-1/2 w-3/4 h-px bg-emerald-500/50 -translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="absolute top-1/2 right-[12%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 mb-2"></div>
              <span className="text-white text-xs font-bold">نقطة الانطلاق</span>
            </div>

            <div className="absolute top-1/2 left-[12%] -translate-y-1/2 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 mb-2"></div>
              <span className="text-white text-xs font-bold">نقطة الوصول</span>
            </div>
          </div>

          {/* Basic Info (Right) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right order-1 lg:order-2">
            <h3 className="text-lg font-bold text-blue-600 mb-8 border-b border-gray-100 pb-4">المعلومات الأساسية للمسار</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">نقطة الانطلاق *</label>
                <select 
                  {...register("place_from", { required: "نقطة الانطلاق مطلوبة" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                >
                  <option value="">اختر نقطة الانطلاق...</option>
                  {places.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.place_from && <p className="text-red-500 text-xs mt-1">{errors.place_from.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">نقطة الوصول *</label>
                <select 
                  {...register("place_to", { required: "نقطة الوصول مطلوبة" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                  dir="rtl"
                >
                  <option value="">اختر نقطة الوصول...</option>
                  {places.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.place_to && <p className="text-red-500 text-xs mt-1">{errors.place_to.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">وصف المسار</label>
              <textarea 
                {...register("track")}
                placeholder="مثال: مباشر، طريق سريع، أو ملاحظات تشغيلية للمسار"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 resize-none"
                dir="rtl"
              ></textarea>
            </div>
          </div>

        </div>

        {/* Row 2: Companies and Travel Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-right mb-6">
          
          {/* Related Companies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 order-2 lg:order-1">
            <h3 className="text-lg font-bold text-blue-600 mb-6 border-b border-gray-100 pb-4">الشركات المرتبطة</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">الشركات المشغلة للمسار</label>
              <select 
                multiple
                {...register("travel")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 mb-2 h-32"
                dir="rtl"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400">يمكن اختيار أكثر من شركة بالضغط المستمر على Ctrl أثناء الاختيار.</p>
            </div>
          </div>

          {/* Travel Type and Service */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 order-1 lg:order-2">
            <h3 className="text-lg font-bold text-blue-600 mb-6 border-b border-gray-100 pb-4">نوع السفر</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">نوع السفر *</label>
              <select 
                {...register("type_travel", { required: "نوع السفر مطلوب" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 mb-4"
                dir="rtl"
              >
                <option value="">اختر نوع السفر...</option>
                <option value="1">بري</option>
                <option value="2">جوي</option>
                <option value="3">بحري</option>
              </select>
              {errors.type_travel && <p className="text-red-500 text-xs mt-1">{errors.type_travel.message}</p>}
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
