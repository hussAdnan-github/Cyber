"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { Calendar, Compass, User } from "lucide-react";

type TripFormData = {
  driver: string;
  driver_phone: string;
  driver_phone2: string;
  car_number: string;
  date_trip: string;
  travel: number;
  line_travel?: number;
};

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [companies, setCompanies] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TripFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, companiesRes, linesRes] = await Promise.all([
          api.get(`/office_travel/trip/${id}/`),
          api.get('/office_travel/travel/'),
          api.get('/office_travel/line_travel/')
        ]);
        
        if (companiesRes.data?.success) setCompanies(companiesRes.data.data.results || []);
        if (linesRes.data?.success) setLines(linesRes.data.data.results || []);

        if (tripRes.data?.success) {
          const tripData = tripRes.data.data;
          
          let formattedDate = "";
          if (tripData.date_trip) {
            // Convert timestamp or date string to YYYY-MM-DD for input type="date"
            const d = new Date(tripData.date_trip);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split('T')[0];
            }
          }

          reset({
            driver: tripData.driver || "",
            driver_phone: tripData.driver_phone || "",
            driver_phone2: tripData.driver_phone2 || "",
            car_number: tripData.car_number || "",
            date_trip: formattedDate,
            travel: tripData.travel || ("" as any),
            line_travel: tripData.line_travel?.id || tripData.line_travel || ("" as any),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmitError("فشل في جلب بيانات الرحلة");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const onSubmit = async (data: TripFormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        travel: data.travel ? Number(data.travel) : null,
        line_travel: data.line_travel ? Number(data.line_travel) : null,
      };

      const response = await api.patch(`/office_travel/trip/${id}/`, payload);
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push('/dashboard/travels/trips');
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
        
        {/* Top Header & Actions */}
        <div className="flex justify-between items-start mb-6 text-right">
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
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">تعديل بيانات الرحلة</h2>
            <p className="text-sm text-gray-500">تحديث مسار الرحلة، السائق، أو المركبة.</p>
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

            <div className="bg-orange-50/50 rounded-xl shadow-sm border border-orange-100 p-6 text-right">
              <div className="flex justify-end items-center gap-2 mb-6">
                <h3 className="font-bold text-gray-800">الجدول الزمني</h3>
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ ووقت الرحلة *</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      {...register("date_trip", { required: "تاريخ الرحلة مطلوب" })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-right bg-white"
                      dir="rtl"
                    />
                    {errors.date_trip && <p className="text-red-500 text-xs mt-1">{errors.date_trip.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[200px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

          </div>

          {/* Main Form Area (Right Side) */}
          <div className="flex-1 order-1 lg:order-2 space-y-6">
            
            {/* Route Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
              <div className="flex justify-end items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800">بيانات المسار والجهة</h3>
                <Compass className="w-5 h-5 text-blue-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">خط السفر</label>
                  <select 
                    {...register("line_travel")}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر خط السفر...</option>
                    {lines.map(l => (
                      <option key={l.id} value={l.id}>{l.name_place_from} - {l.name_place_to}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">شركة السفر *</label>
                  <select 
                    {...register("travel", { required: "شركة السفر مطلوبة" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر شركة السفر...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.travel && <p className="text-red-500 text-xs mt-1">{errors.travel.message}</p>}
                </div>
              </div>
            </div>

            {/* Driver and Vehicle Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-right">
              <div className="flex justify-end items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800">بيانات السائق والمركبة</h3>
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">اسم السائق *</label>
                  <input 
                    type="text" 
                    {...register("driver", { required: "اسم السائق مطلوب" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  />
                  {errors.driver && <p className="text-red-500 text-xs mt-1">{errors.driver.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">رقم السيارة *</label>
                    <input 
                      type="text" 
                      {...register("car_number", { required: "رقم السيارة مطلوب" })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
                      dir="rtl"
                    />
                    {errors.car_number && <p className="text-red-500 text-xs mt-1">{errors.car_number.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">هاتف السائق *</label>
                    <input 
                      type="text" 
                      {...register("driver_phone", { required: "رقم الهاتف مطلوب" })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white font-mono"
                      dir="rtl"
                    />
                    {errors.driver_phone && <p className="text-red-500 text-xs mt-1">{errors.driver_phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">هاتف إضافي</label>
                    <input 
                      type="text" 
                      {...register("driver_phone2")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 font-mono"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
