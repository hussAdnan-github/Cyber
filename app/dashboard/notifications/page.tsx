"use client";

import useSWR from 'swr';
import { api } from '@/lib/api';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import PageHeader from "@/components/ui/PageHeader";

const fetcher = (url: string) => api.get(url).then(res => res.data?.data || res.data);

export default function NotificationsPage() {
  const { data, error, isLoading } = useSWR('/notification/', fetcher, {
    refreshInterval: 15000,
  });

  const notifications = data?.results || [];
  const count = data?.count || notifications.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-row-reverse border-b border-gray-100 pb-4">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">الإشعارات</h1>
          <p className="text-sm text-gray-500">مركز التنبيهات المباشرة والإشعارات الأمنية</p>
        </div>
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center relative">
          <Bell className="w-7 h-7" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-4 animate-pulse">
               <div className="h-4 w-1/4 bg-gray-200 rounded self-end"></div>
               <div className="h-4 w-1/2 bg-gray-100 rounded self-end"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center font-bold">
          حدث خطأ أثناء جلب الإشعارات. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد إشعارات جديدة</h3>
          <p className="text-gray-500 max-w-sm">أنت على اطلاع دائم. لا توجد تنبيهات أو إشعارات غير مقروءة في الوقت الحالي.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {notifications.map((notif: any) => (
              <li key={notif.id} className="p-6 hover:bg-red-50/30 transition-colors flex flex-col sm:flex-row items-start gap-4 text-right flex-row-reverse justify-end">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 text-danger flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-right flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 flex-row-reverse gap-2 sm:gap-0">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {notif.name_hotal || notif.name_travel || "تنبيه أمني هام"}
                    </h4>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notif.crated_at).toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-base text-gray-700 mb-4 leading-relaxed">
                    هناك مستند أو حركة تخص شخصاً مدرجاً يحتاج للمراجعة والمتابعة الأمنية الفورية.
                    <br/>
                    الاسم المدرج: <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded ml-1">{notif.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 justify-end flex-row-reverse">
                    <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-lg font-bold border border-gray-200 shadow-sm">
                      رقم الهوية: {notif.number_id}
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-lg font-bold border border-red-100 shadow-sm">
                      جهة الإصدار / المصدر: {notif.hotel ? 'فندق' : (notif.travel ? 'مكتب سفريات' : 'غير محدد')}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
