"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";
import { Filter } from "lucide-react";

interface TripFiltersProps {
  companies: any[];
  lines: any[];
}

export default function TripFilters({ companies, lines }: TripFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [travel, setTravel] = useState(searchParams.get("travel") || "");
  const [lineTravel, setLineTravel] = useState(searchParams.get("line_travel") || "");

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (travel) params.set("travel", travel);
    else params.delete("travel");

    if (lineTravel) params.set("line_travel", lineTravel);
    else params.delete("line_travel");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setTravel("");
    setLineTravel("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
      <div className="flex gap-2 w-full md:w-auto">
        <button type="submit" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center shrink-0">
          <Filter className="w-4 h-4 mr-2" />
          تطبيق الفلترة
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0">
          مسح
        </button>
      </div>
      <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row">
        <select 
          value={travel}
          onChange={(e) => setTravel(e.target.value)}
          className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">الشركة: الكل</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select 
          value={lineTravel}
          onChange={(e) => setLineTravel(e.target.value)}
          className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">خط السفر: الكل</option>
          {lines.map(l => (
            <option key={l.id} value={l.id}>{l.name_place_from} - {l.name_place_to}</option>
          ))}
        </select>

        <div className="relative">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
            placeholder="بحث في الرحلات"
            dir="rtl"
          />
        </div>
      </div>
    </form>
  );
}
