"use client";

import useSWR from 'swr';
import { api } from '@/lib/api';
import { Bell, AlertTriangle } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function NotificationsWidget() {
  const { data, error, isLoading } = useSWR('/notification/', fetcher, {
    refreshInterval: 5000, // تحديث تلقائي كل 5 ثواني
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6 p-6 flex flex-col gap-4 animate-pulse">
         <div className="h-6 w-1/4 bg-gray-200 rounded self-end"></div>
         <div className="h-16 w-full bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-right mb-6 border border-red-100">
        فشل في جلب التنبيهات المباشرة. يرجى التحقق من اتصالك بالإنترنت.
      </div>
    );
  }

  const notifications = data?.results || [];
  const count = data?.count || 0;

  return (
    <div className="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden mb-6 text-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-white p-4 border-b border-red-100 flex items-center justify-between flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-red-100 text-danger flex items-center justify-center relative shadow-sm">
            <Bell className="w-5 h-5 animate-pulse" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </div>
          <div className="text-right">
            <h3 className="font-bold text-danger text-lg">تنبيهات النظام المباشرة</h3>
            <p className="text-xs text-danger/80">يتم تحديث التنبيهات تلقائياً بدون إعادة تحميل الصفحة</p>
          </div>
        </div>
        <div className="bg-white px-4 py-1.5 rounded-full border border-red-100 text-danger text-sm font-bold shadow-sm">
          {count} تنبيهات
        </div>
      </div>
      
      {/* Body */}
      <div className="p-0 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-300">
        {notifications.length === 0 ? (
          <div className="p-10 text-center text-gray-400 font-bold text-sm bg-gray-50/50">
            لا توجد تنبيهات جديدة في الوقت الحالي
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notif: any) => (
              <li key={notif.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 text-right flex-row-reverse justify-end">
                <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 text-danger flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="text-right flex-1">
                  <div className="flex justify-between items-center mb-1 flex-row-reverse">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {notif.name_hotal || notif.name_travel || "تنبيه أمني من النظام"}
                    </h4>
                    <span className="text-xs text-gray-400 font-medium bg-white border border-gray-100 px-2 py-0.5 rounded shadow-sm">
                      {new Date(notif.crated_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    مستند يحتاج للمراجعة (الاسم المدرج: <span className="font-bold text-red-600">{notif.name}</span>)
                  </p>
                  <div className="flex gap-2 justify-end flex-row-reverse">
                    <span className="px-3 py-1 bg-white text-gray-600 text-xs rounded-lg font-bold border border-gray-200 shadow-sm">
                      رقم الهوية: {notif.number_id}
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-lg font-bold border border-red-100 shadow-sm">
                      المصدر: {notif.hotel ? 'فندق' : (notif.travel ? 'مكتب سفريات' : 'غير معروف')}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
