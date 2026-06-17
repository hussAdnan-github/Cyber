"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

interface CompanyFiltersProps {
  places: any[];
  users: any[];
}

export default function CompanyFilters({ places, users }: CompanyFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [place, setPlace] = useState(searchParams.get("place") || "");
  const [user, setUser] = useState(searchParams.get("user") || "");

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (place) params.set("place", place);
    else params.delete("place");

    if (user) params.set("user", user);
    else params.delete("user");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setPlace("");
    setUser("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <div className="flex gap-2 w-full md:w-auto order-2 md:order-1">
        <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex-1 md:flex-none">
          تطبيق الفلاتر
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0">
          مسح
        </button>
      </div>
      <div className="flex flex-1 w-full gap-4 text-right order-1 md:order-2 flex-col md:flex-row">
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 mb-2 block">بحث بالاسم أو الموقع</label>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
            placeholder="اكتب اسم الشركة هنا..."
            dir="rtl"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 mb-2 block">المكان</label>
          <select 
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
            dir="rtl"
          >
            <option value="">الكل</option>
            {places.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 mb-2 block">المستخدم المسؤول</label>
          <select 
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
            dir="rtl"
          >
            <option value="">الكل</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
