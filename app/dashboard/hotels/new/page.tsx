"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { HelpCircle, Phone } from "lucide-react";
import Link from "next/link";

type HotelFormData = {
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

export default function AddHotelPage() {
  const router = useRouter();

  const [places, setPlaces] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HotelFormData>();

  useEffect(() => {
    const fetchDropdowns = async () => {
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
        console.error("Error fetching dropdowns:", error);
      }
    };

    fetchDropdowns();
  }, []);

  const onSubmit = async (data: HotelFormData) => {
    setSubmitError("");
    try {
      const payload = {
        ...data,
        place: data.place ? Number(data.place) : null,
        onwer: data.onwer ? Number(data.onwer) : null,
        user: data.user ? Number(data.user) : null,
      };

      const response = await api.post('/hotal/hotel/', payload);

      if (response.data?.success || response.status === 201 || response.status === 200) {
        router.push('/dashboard/hotels/list');
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
    <div className="space-y-6 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex justify-between items-end mb-6 text-right border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">إضافة فندق جديد</h2>
            <p className="text-sm text-gray-500">أدخل تفاصيل المنشأة الفندقية وربطها بالمكان والمالك والمستخدم المسؤول.</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold text-right">
            {submitError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Main Form Area (Right Side) */}
          <div className="flex-1 space-y-6 order-2 lg:order-1">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
              <div className="flex justify-end items-center mb-6 gap-2 border-b border-gray-50 pb-4">
                <h3 className="text-lg font-bold text-gray-800">بيانات الفندق الأساسية</h3>
                <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded flex items-center justify-center font-bold text-lg">i</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">المكان *</label>
                  <select
                    {...register("place", { required: "المكان مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
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
                  <label className="block text-xs font-bold text-gray-700 mb-2">اسم الفندق *</label>
                  <input
                    type="text"
                    {...register("name", { required: "اسم الفندق مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                    placeholder="مثال: فندق بلازا الرياض"
                    dir="rtl"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">المستخدم المرتبط *</label>
                  <select
                    {...register("user", { required: "المستخدم مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر المستخدم...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                  {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">المالك *</label>
                  <select
                    {...register("onwer", { required: "المالك مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    dir="rtl"
                  >
                    <option value="">اختر المالك...</option>
                    {owners.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                  {errors.onwer && <p className="text-red-500 text-xs mt-1">{errors.onwer.message}</p>}
                </div>
              </div>

              <div className="mt-6 text-right">
                <label className="block text-xs font-bold text-gray-700 mb-2">العنوان بالتفصيل *</label>
                <input
                  type="text"
                  {...register("location", { required: "العنوان مطلوب" })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                  placeholder="المدينة، الحي، الشارع، المعالم القريبة"
                  dir="rtl"
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-end items-center mb-6 gap-2 border-b border-gray-50 pb-4">
                <h3 className="text-lg font-bold text-gray-800">بيانات التواصل</h3>
                <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">رقم الهاتف الإضافي</label>
                  <input
                    type="text"
                    {...register("phone2")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                    placeholder="اختياري"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">رقم الهاتف *</label>
                  <input
                    type="text"
                    {...register("phone", { required: "رقم الهاتف مطلوب" })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400 font-mono"
                    placeholder="05xxxxxxxx"
                    dir="rtl"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="text-right">
                <label className="block text-xs font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 placeholder-gray-400"
                  placeholder="hotel@example.com"
                  dir="rtl"
                />
              </div>
            </div>

            {/* About Hotel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-right mb-4">
                <label className="block text-xs font-bold text-gray-700 mb-2">نبذة عن الفندق</label>
              </div>
              <textarea
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-gray-50 h-32 resize-none placeholder-gray-400"
                placeholder="اكتب وصفاً مختصراً للمرافق والخدمات والسياسات الخاصة بالفندق"
                dir="rtl"
              />
            </div>

          </div>

          {/* Sidebar Actions Area (Left Side) */}
          <div className="w-full lg:w-80 flex flex-col gap-6 order-1 lg:order-2 shrink-0">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-right">
              <div className="flex justify-end items-center gap-2 mb-4">
                <h3 className="font-bold text-gray-800">إرشادات التسجيل</h3>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <ul className="text-sm text-gray-600 space-y-3 pr-4 list-disc list-inside">
                <li>تأكد من كتابة الاسم الرسمي للفندق كما هو مسجل في الوثائق.</li>
                <li>اربط الفندق بالمكان والمالك الصحيحين حتى تظهر التقارير بدقة.</li>
                <li>استخدم بريداً ورقماً صالحين لتسهيل التواصل والتنبيهات.</li>
              </ul>
            </div>

            <div className="bg-[#1e2532] rounded-xl shadow-md p-6 text-white text-right relative overflow-hidden">
              <h3 className="font-bold text-lg mb-2 text-white relative z-10">مركز المساعدة</h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed relative z-10">
                راجع بيانات المالك والمكان من قسم الجهات الأمنية قبل حفظ الفندق عند الحاجة.
              </p>
              <Link href="/dashboard/hotels/list" className="bg-white text-gray-900 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-auto relative z-10 hover:bg-gray-100 inline-block text-center">
                العودة للقائمة
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <div className="text-xs text-gray-400">يتم حفظ البيانات داخل قاعدة بيانات النظام</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0f172a] hover:bg-gray-800 disabled:bg-gray-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ البيانات"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
