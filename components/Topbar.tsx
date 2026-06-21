"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import useSWR from 'swr';
import { api } from '@/lib/api';
import { Bell } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(res => res.data?.data || res.data);

export default function Topbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState("المستخدم");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   
  const { data } = useSWR('/notification/', fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });
  const notifCount = data?.count || 0;
   
  useEffect(() => {
    try {
      const userDataStr = Cookies.get('user_data');
      if (userDataStr) {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        setUsername(userData.username || userData.first_name || "المستخدم");
      }
    } catch (e) {
      console.error('Failed to parse user_data cookie in Topbar', e);
    }
  }, []);

  let pageTitle = "لوحة التحكم";
  if (pathname.includes('/accounts/users/new')) pageTitle = "إضافة مستخدم";
  else if (pathname.includes('/accounts/users/edit')) pageTitle = "تعديل المستخدم";
  else if (pathname.includes('/accounts/users/details')) pageTitle = "تفاصيل المستخدم";
  else if (pathname.includes('/roles/new') || pathname.includes('/accounts/roles/new')) pageTitle = "إضافة دور جديد";
  else if (pathname.includes('/roles/edit') || pathname.includes('/accounts/roles/edit')) pageTitle = "تعديل الدور";
  else if (pathname.includes('/roles/details') || pathname.includes('/accounts/roles/details')) pageTitle = "تفاصيل الدور";
  else if (pathname.includes('/roles')) pageTitle = "إدارة الأدوار والصلاحيات";
  else if (pathname.includes('/users')) pageTitle = "المستخدمون";
  else if (pathname.includes('/accounts/audit')) pageTitle = "سجل التدقيق";
  else if (pathname.includes('/hotels/new')) pageTitle = "إضافة فندق جديد";
  else if (pathname.includes('/hotels/edit')) pageTitle = "تعديل بيانات الفندق";
  else if (pathname.includes('/hotels/details')) pageTitle = "تفاصيل الفندق";
  else if (pathname.includes('/hotels/guests/new')) pageTitle = "إضافة نزيل جديد";
  else if (pathname.includes('/hotels/guests/details')) pageTitle = "تفاصيل النزيل";
  else if (pathname.includes('/hotels/list')) pageTitle = "إدارة الفنادق";
  else if (pathname.includes('/hotels/guests')) pageTitle = "قائمة النزلاء";
  else if (pathname.includes('/hotels/companions/new')) pageTitle = "إضافة مرافق للنزيل";
  else if (pathname.includes('/hotels/companions/edit')) pageTitle = "تعديل بيانات المرافق";
  else if (pathname.includes('/hotels/companions/details')) pageTitle = "تفاصيل المرافق";
  else if (pathname.includes('/hotels/companions')) pageTitle = "إدارة المرافقين";
  else if (pathname.includes('/hotels')) pageTitle = "لوحة تحكم الفنادق";
  else if (pathname.includes('/security/blacklist')) pageTitle = "القائمة السوداء";
  else if (pathname.includes('/security/centers')) pageTitle = "إدارة المراكز الأمنية";
  else if (pathname.includes('/security/documents')) pageTitle = "إدارة الوثائق";
  else if (pathname.includes('/security/nationalities')) pageTitle = "إدارة الجنسيات";
  else if (pathname.includes('/security/owners')) pageTitle = "قائمة الملاك";
  else if (pathname.includes('/security/places')) pageTitle = "إدارة الأماكن";
  else if (pathname.includes('/security')) pageTitle = "نظرة عامة على الجهات الأمنية";
  else if (pathname.includes('/travels/companies')) pageTitle = "شركات السفر";
  else if (pathname.includes('/travels/lines')) pageTitle = "خطوط السفر";
  else if (pathname.includes('/travels/passengers')) pageTitle = "إدارة بيانات المسافرين";
  else if (pathname.includes('/travels/trips')) pageTitle = "إدارة الرحلات";
  else if (pathname.includes('/travels')) pageTitle = "لوحة عمليات السفر";

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 relative z-10 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
      
      <div className="flex items-center relative gap-6">
        
        {/* Notifications Icon */}
        <Link href="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6" />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border border-white text-[10px] font-bold text-white">
              {notifCount > 9 ? '+9' : notifCount}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex flex-col text-left">
             <span className="text-sm font-bold text-gray-800">{username}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-primary flex items-center justify-center overflow-hidden relative">
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`} alt={username} className="w-full h-full object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <Link 
              href="/dashboard/change-password" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-right font-medium transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              تغيير كلمة المرور
            </Link>
            <button 
              onClick={() => {
                setIsDropdownOpen(false);
                logout().then(() => {
                  window.location.href = "/";
                });
              }}
              className="w-full text-right block px-4 py-2 text-sm text-danger hover:bg-red-50 font-medium transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
