"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);
  const [isHotelsOpen, setIsHotelsOpen] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(true);
  const [isTravelsOpen, setIsTravelsOpen] = useState(true);

  return (
    <aside className="w-64 bg-[#1e2532] text-white flex flex-col h-screen shrink-0 relative z-20">
      {/* Logo */}
      <div className="h-24 flex items-center justify-center border-b border-white/10">
        <div className="flex flex-col items-center mt-2">
           <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-[#1e2532] font-bold text-2xl mb-2 shadow-lg">
             <ShieldCheck className="w-8 h-8 text-[#1e2532]" />
           </div>
           <span className="text-xs font-bold tracking-widest text-gray-300">AAA CYBER</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1">
          <li>
            <Link 
              href="/dashboard" 
              className={`flex items-center px-6 py-3.5 text-sm transition-colors ${pathname === '/dashboard' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5 ml-3" />
              لوحة التحكم
            </Link>
          </li>
          
          {/* Accounts Dropdown */}
          <li>
            <button 
              onClick={() => setIsAccountsOpen(!isAccountsOpen)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-colors ${pathname.includes('/dashboard/accounts') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 ml-3" />
                الحسابات
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAccountsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isAccountsOpen && (
              <ul className="bg-[#171c26] py-3">
                <li>
                  <Link href="/dashboard/accounts/users" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/accounts/users' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    المستخدمون
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/accounts/users/new" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/accounts/users/new' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    إضافة مستخدمين
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/accounts/roles" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/accounts/roles' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    الأدوار والصلاحيات
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/accounts/audit" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/accounts/audit' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    سجل التدقيق
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Hotels Dropdown */}
          <li>
            <button 
              onClick={() => setIsHotelsOpen(!isHotelsOpen)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-colors ${pathname.includes('/dashboard/hotels') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <Hotel className="w-5 h-5 ml-3" />
                الفنادق
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isHotelsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isHotelsOpen && (
              <ul className="bg-[#171c26] py-3">
                <li>
                  <Link href="/dashboard/hotels" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    لوحة تحكم الفنادق
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/hotels/list" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels/list' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    قائمة الفنادق
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/hotels/new" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels/new' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    إضافة فندق
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/hotels/guests" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels/guests' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    قائمة النزلاء
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/hotels/guests/new" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels/guests/new' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    إضافة نزيل
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/hotels/companions" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/hotels/companions' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    المرافقون
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Security Entities Dropdown */}
          <li>
            <button 
              onClick={() => setIsSecurityOpen(!isSecurityOpen)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-colors ${pathname.includes('/dashboard/security') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 ml-3" />
                الجهات الأمنية
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isSecurityOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSecurityOpen && (
              <ul className="bg-[#171c26] py-3">
                <li>
                  <Link href="/dashboard/security" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    لوحة القيادة
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/centers" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/centers' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    المراكز الأمنية
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-14 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                    إضافة مركز
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/places" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/places' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    الأماكن
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-14 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                    إضافة مكان
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/owners" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/owners' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    الملاك
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/documents" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/documents' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    المستندات
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/blacklist" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/blacklist' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    القائمة السوداء
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/security/nationalities" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/security/nationalities' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    الجنسيات
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* Travels Dropdown */}
          <li>
            <button 
              onClick={() => setIsTravelsOpen(!isTravelsOpen)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-sm transition-colors ${pathname.includes('/dashboard/travels') ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center">
                <Plane className="w-5 h-5 ml-3" />
                السفريات
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isTravelsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTravelsOpen && (
              <ul className="bg-[#171c26] py-3">
                <li>
                  <Link href="/dashboard/travels" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/travels' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    لوحة عمليات السفر
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/travels/companies" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/travels/companies' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    شركات السفر
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/travels/trips" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/travels/trips' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    إدارة الرحلات
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/travels/lines" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/travels/lines' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    خطوط السفر
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/travels/passengers" className={`block px-14 py-2.5 text-sm transition-colors ${pathname === '/dashboard/travels/passengers' ? 'bg-primary text-white rounded-md mx-4 px-10' : 'text-gray-400 hover:text-white'}`}>
                    المسافرون
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="#" className="flex items-center px-6 py-3.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <Settings className="w-5 h-5 ml-3" />
              الإعدادات
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="w-full flex items-center justify-center bg-danger hover:bg-red-600 text-white py-3 rounded-md transition-colors text-sm font-bold shadow-lg">
          <LogOut className="w-5 h-5 ml-2" />
          تسجيل الخروج
        </Link>
      </div>
    </aside>
  );
}
