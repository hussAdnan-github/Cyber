"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

interface GuestFiltersProps {
  hotels: any[];
  nationalities: any[];
}

export default function GuestFilters({ hotels, nationalities }: GuestFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [hotel, setHotel] = useState(searchParams.get("hotel") || "");
  const [typeId, setTypeId] = useState(searchParams.get("type_id") || "");
  const [nationality, setNationality] = useState(searchParams.get("nationality") || "");

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (hotel) params.set("hotel", hotel);
    else params.delete("hotel");

    if (typeId) params.set("type_id", typeId);
    else params.delete("type_id");

    if (nationality) params.set("nationality", nationality);
    else params.delete("nationality");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setHotel("");
    setTypeId("");
    setNationality("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-gray-700">البحث</label>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right placeholder-gray-400"
          placeholder="الاسم أو رقم الهوية..."
          dir="rtl"
        />
      </div>
      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-gray-700">الفندق</label>
        <select 
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
          dir="rtl"
        >
          <option value="">الكل</option>
          {hotels.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-gray-700">الجنسية</label>
        <select 
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
          dir="rtl"
        >
          <option value="">الكل</option>
          {nationalities.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 text-right">
        <label className="text-xs font-bold text-gray-700">نوع الهوية</label>
        <select 
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
          dir="rtl"
        >
          <option value="">الكل</option>
          <option value="1">جواز سفر</option>
          <option value="2">بطاقة شخصية</option>
          <option value="3">شهادة ميلاد</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="w-full bg-[#0f172a] text-white hover:bg-gray-800 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          تطبيق
        </button>
        <button type="button" onClick={clearFilters} className="w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          مسح
        </button>
      </div>
    </form>
  );
}
