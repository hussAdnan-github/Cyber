"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

export default function UsersFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setRole(searchParams.get("role") || "");
    setStatus(searchParams.get("status") || "");
  }, [searchParams]);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (role) params.set("role", role);
    else params.delete("role");

    if (status) params.set("status", status);
    else params.delete("status");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row w-full gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-right" 
          placeholder="البحث بالاسم، البريد الإلكتروني أو المعرف..." 
          dir="rtl"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-200 rounded-md text-sm px-4 py-2.5 text-gray-600 bg-white focus:outline-none text-right"
          dir="rtl"
        >
          <option value="">كل الأدوار</option>
          <option value="superuser">مدير</option>
          <option value="user">مستخدم عادي</option>
        </select>
        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-md text-sm px-4 py-2.5 text-gray-600 bg-white focus:outline-none text-right"
          dir="rtl"
        >
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          بحث
        </button>
        <button type="button" onClick={clearFilters} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          إعادة ضبط
        </button>
      </div>
    </form>
  );
}
