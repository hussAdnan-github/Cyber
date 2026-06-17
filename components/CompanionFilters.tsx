"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

interface CompanionFiltersProps {
  hotels: any[];
  nationalities: any[];
}

export default function CompanionFilters({ hotels, nationalities }: CompanionFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [personHotel, setPersonHotel] = useState(searchParams.get("person__hotel") || "");
  const [typeId, setTypeId] = useState(searchParams.get("type_id") || "");
  const [nationality, setNationality] = useState(searchParams.get("nationality") || "");

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (personHotel) params.set("person__hotel", personHotel);
    else params.delete("person__hotel");

    if (typeId) params.set("type_id", typeId);
    else params.delete("type_id");

    if (nationality) params.set("nationality", nationality);
    else params.delete("nationality");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setPersonHotel("");
    setTypeId("");
    setNationality("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <div className="flex w-full md:w-auto gap-2 order-2 md:order-1">
        <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex-1 md:flex-none">
          فلترة
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0">
          مسح
        </button>
      </div>

      <div className="flex flex-1 w-full gap-2 text-right order-1 md:order-2 flex-col md:flex-row">
        <div className="flex-1">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right placeholder-gray-400"
            placeholder="البحث بالاسم، الهوية، أو النزيل..."
            dir="rtl"
          />
        </div>
        <div className="w-full md:w-40">
          <select 
            value={personHotel}
            onChange={(e) => setPersonHotel(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
            dir="rtl"
          >
            <option value="">الفندق: الكل</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-32">
          <select 
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
            dir="rtl"
          >
            <option value="">الجنسية: الكل</option>
            {nationalities.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-40">
          <select 
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-right bg-white"
            dir="rtl"
          >
            <option value="">نوع الهوية: الكل</option>
            <option value="1">جواز سفر</option>
            <option value="2">بطاقة شخصية</option>
            <option value="3">شهادة ميلاد</option>
          </select>
        </div>
      </div>
    </form>
  );
}
