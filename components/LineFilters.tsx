"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

interface LineFiltersProps {
  places: any[];
}

export default function LineFilters({ places }: LineFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [placeFrom, setPlaceFrom] = useState(searchParams.get("place_from") || "");
  const [placeTo, setPlaceTo] = useState(searchParams.get("place_to") || "");

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (placeFrom) params.set("place_from", placeFrom);
    else params.delete("place_from");

    if (placeTo) params.set("place_to", placeTo);
    else params.delete("place_to");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setPlaceFrom("");
    setPlaceTo("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row items-center gap-4 w-full text-sm">
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <label className="font-bold text-gray-700">من:</label>
        <select 
          value={placeFrom}
          onChange={(e) => setPlaceFrom(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white text-right w-full md:w-48"
          dir="rtl"
        >
          <option value="">الكل</option>
          {places.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <label className="font-bold text-gray-700">إلى:</label>
        <select 
          value={placeTo}
          onChange={(e) => setPlaceTo(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white text-right w-full md:w-48"
          dir="rtl"
        >
          <option value="">الكل</option>
          {places.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 w-full md:w-auto justify-end">
        <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2 rounded-md font-bold transition-colors shadow-sm flex-1 md:flex-none">
          تطبيق
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2 font-bold transition-colors">
          مسح
        </button>
      </div>
    </form>
  );
}
