"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { Nationality } from "@/types/security";

interface OwnersFiltersProps {
  nationalities: Nationality[];
}

export default function OwnersFilters({ nationalities }: OwnersFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [nationality, setNationality] = useState(searchParams.get("nationality") || "");
  const [type_id, setTypeId] = useState(searchParams.get("type_id") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setNationality(searchParams.get("nationality") || "");
    setTypeId(searchParams.get("type_id") || "");
    setPhone(searchParams.get("phone") || "");
  }, [searchParams]);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search); else params.delete("search");
    if (nationality) params.set("nationality", nationality); else params.delete("nationality");
    if (type_id) params.set("type_id", type_id); else params.delete("type_id");
    if (phone) params.set("phone", phone); else params.delete("phone");

    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setNationality("");
    setTypeId("");
    setPhone("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
      <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-gray-700">البحث بالاسم</label>
          <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
              placeholder="أدخل اسم المالك..."
              dir="rtl"
          />
      </div>
      <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-gray-700">رقم الجوال</label>
          <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
              placeholder="رقم الجوال..."
              dir="rtl"
          />
      </div>
      <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-gray-700">الجنسية</label>
          <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
              dir="rtl"
          >
              <option value="">كل الجنسيات</option>
              {nationalities.map(n => (
                  <option key={n.id} value={n.id.toString()}>{n.name}</option>
              ))}
          </select>
      </div>
      <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-gray-700">نوع الهوية</label>
          <select
              value={type_id}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
              dir="rtl"
          >
              <option value="">الكل</option>
              <option value="1">بطاقة الهوية</option>
              <option value="2">جواز سفر</option>
          </select>
      </div>
      <div className="flex gap-2 mb-0.5">
          <button type="submit" className="bg-blue-50 text-primary border border-blue-100 hover:bg-blue-100 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full flex-1">
              تطبيق الفلترة
          </button>
          <button type="button" onClick={clearFilters} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0 flex items-center justify-center">
              مسح
          </button>
      </div>
    </form>
  );
}
