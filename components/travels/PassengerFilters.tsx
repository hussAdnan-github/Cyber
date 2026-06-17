"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

interface PassengerFiltersProps {
  trips: any[];
  nationalities: any[];
  companies: any[];
}

export default function PassengerFilters({ trips, nationalities, companies }: PassengerFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [trip, setTrip] = useState(searchParams.get("trip") || "");
  const [nationality, setNationality] = useState(searchParams.get("nationality") || "");
  const [tripTravel, setTripTravel] = useState(searchParams.get("trip__travel") || "");
  const [typeId, setTypeId] = useState(searchParams.get("type_id") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setTrip(searchParams.get("trip") || "");
    setNationality(searchParams.get("nationality") || "");
    setTripTravel(searchParams.get("trip__travel") || "");
    setTypeId(searchParams.get("type_id") || "");
  }, [searchParams]);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (trip) params.set("trip", trip);
    else params.delete("trip");

    if (nationality) params.set("nationality", nationality);
    else params.delete("nationality");

    if (tripTravel) params.set("trip__travel", tripTravel);
    else params.delete("trip__travel");

    if (typeId) params.set("type_id", typeId);
    else params.delete("type_id");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setTrip("");
    setNationality("");
    setTripTravel("");
    setTypeId("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col xl:flex-row items-center gap-2 w-full xl:w-auto">
      <div className="flex gap-2 w-full xl:w-auto">
        <button type="submit" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center shrink-0">
          تطبيق الفلترة
        </button>
        <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0">
          مسح
        </button>
      </div>
      <div className="grid grid-cols-2 md:flex flex-wrap gap-2 w-full xl:w-auto">
        <select 
          value={tripTravel}
          onChange={(e) => setTripTravel(e.target.value)}
          className="w-full md:w-36 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">شركة السفر: الكل</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        
        <select 
          value={trip}
          onChange={(e) => setTrip(e.target.value)}
          className="w-full md:w-36 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">الرحلة: الكل</option>
          {trips.map(t => (
            <option key={t.id} value={t.id}>{t.name_travel}</option>
          ))}
        </select>

        <select 
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full md:w-36 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">الجنسية: الكل</option>
          {nationalities.map(n => (
            <option key={n.id} value={n.id}>{n.name_nationality}</option>
          ))}
        </select>

        <select 
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className="w-full md:w-36 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">نوع الهوية: الكل</option>
          <option value="1">هوية وطنية</option>
          <option value="2">جواز سفر</option>
          <option value="3">إقامة</option>
        </select>

        <div className="relative col-span-2 md:col-span-1 w-full md:w-48">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
            placeholder="بحث..."
            dir="rtl"
          />
        </div>
      </div>
    </form>
  );
}
