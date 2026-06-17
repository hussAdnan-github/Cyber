"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Hotel, 
  ShieldCheck, 
  Plane, 
  Settings, 
  LogOut,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/app/actions/auth";

function NavLink({ href, icon: Icon, children, exact = false }: { href: string, icon?: any, children: React.ReactNode, exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);
  
  return (
    <li className="mb-1">
      <Link 
        href={href} 
        className={`flex items-center px-4 py-3 mx-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}`}
      >
        {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
        {Icon && <Icon className={`w-5 h-5 ml-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`} />}
        <span className="relative z-10">{children}</span>
      </Link>
    </li>
  );
}

function SubLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link 
        href={href} 
        className={`flex items-center px-10 py-2.5 mx-4 text-sm transition-all duration-200 rounded-lg relative group ${isActive ? 'text-white bg-slate-800 font-bold shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
      >
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 flex justify-center items-center">
          {isActive ? (
             <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          ) : (
             <div className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors" />
          )}
        </div>
        {children}
      </Link>
    </li>
  );
}

function NavDropdown({ label, icon: Icon, basePath, children }: { label: string, icon: any, basePath: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActiveGroup = pathname.startsWith(basePath);
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  useEffect(() => {
    if (pathname.startsWith(basePath)) {
      setIsOpen(true);
    }
  }, [pathname, basePath]);

  return (
    <li className="mb-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[calc(100%-2rem)] flex items-center justify-between px-4 py-3 mx-4 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActiveGroup ? (isOpen ? 'bg-slate-800/80 text-white font-bold shadow-sm' : 'bg-primary/10 text-primary font-bold') : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}
      >
        {isActiveGroup && !isOpen && <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-l-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
        <div className="flex items-center relative z-10">
          <Icon className={`w-5 h-5 ml-3 transition-colors ${isActiveGroup ? (isOpen ? 'text-white' : 'text-primary') : 'text-slate-500 group-hover:text-slate-300'}`} />
          {label}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180 text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
      </button>
      
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <ul className="flex flex-col space-y-1 mt-1 mb-2">
            {children}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-screen shrink-0 border-l border-slate-800 shadow-2xl relative z-20">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-black text-xl tracking-wider text-white leading-none">AAA</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mt-1">CYBER SEC</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 transition-colors">
        <ul className="space-y-1">
          <NavLink href="/dashboard" icon={LayoutDashboard} exact>لوحة التحكم</NavLink>
          
          <NavDropdown label="الحسابات" icon={Users} basePath="/dashboard/accounts">
            <SubLink href="/dashboard/accounts/users">المستخدمون</SubLink>
            <SubLink href="/dashboard/accounts/users/new">إضافة مستخدمين</SubLink>
            <SubLink href="/dashboard/accounts/roles">الأدوار والصلاحيات</SubLink>
            <SubLink href="/dashboard/accounts/audit">سجل التدقيق</SubLink>
          </NavDropdown>

          <NavDropdown label="الفنادق" icon={Hotel} basePath="/dashboard/hotels">
            <SubLink href="/dashboard/hotels">لوحة تحكم الفنادق</SubLink>
            <SubLink href="/dashboard/hotels/list">قائمة الفنادق</SubLink>
            <SubLink href="/dashboard/hotels/new">إضافة فندق</SubLink>
            <SubLink href="/dashboard/hotels/guests">قائمة النزلاء</SubLink>
            <SubLink href="/dashboard/hotels/guests/new">إضافة نزيل</SubLink>
            <SubLink href="/dashboard/hotels/companions">المرافقون</SubLink>
          </NavDropdown>

          <NavDropdown label="الجهات الأمنية" icon={ShieldCheck} basePath="/dashboard/security">
            <SubLink href="/dashboard/security">لوحة القيادة</SubLink>
            <SubLink href="/dashboard/security/centers">المراكز الأمنية</SubLink>
            <SubLink href="#">إضافة مركز</SubLink>
            <SubLink href="/dashboard/security/places">الأماكن</SubLink>
            <SubLink href="#">إضافة مكان</SubLink>
            <SubLink href="/dashboard/security/owners">الملاك</SubLink>
            <SubLink href="/dashboard/security/documents">المستندات</SubLink>
            <SubLink href="/dashboard/security/blacklist">القائمة السوداء</SubLink>
            <SubLink href="/dashboard/security/nationalities">الجنسيات</SubLink>
          </NavDropdown>

          <NavDropdown label="السفريات" icon={Plane} basePath="/dashboard/travels">
            <SubLink href="/dashboard/travels">لوحة عمليات السفر</SubLink>
            <SubLink href="/dashboard/travels/companies">شركات السفر</SubLink>
            <SubLink href="/dashboard/travels/trips">إدارة الرحلات</SubLink>
            <SubLink href="/dashboard/travels/lines">خطوط السفر</SubLink>
            <SubLink href="/dashboard/travels/passengers">المسافرون</SubLink>
          </NavDropdown>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-500 py-3 rounded-xl transition-all duration-300 text-sm font-bold border border-slate-700 hover:border-red-500/30 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
