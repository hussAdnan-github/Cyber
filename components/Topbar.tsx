"use client";

import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();
  
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
      
      <div className="flex items-center">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-left">
             <span className="text-sm font-bold text-gray-800">admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-primary flex items-center justify-center overflow-hidden relative">
             <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
