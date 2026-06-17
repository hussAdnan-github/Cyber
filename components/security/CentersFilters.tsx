"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Place } from "@/types/security";
import { User } from "@/types/user";

interface CentersFiltersProps {
  places: Place[];
  users: User[];
}

export default function CentersFilters({ places, users }: CentersFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [place, setPlace] = useState(searchParams.get("place") || "");
  const [user, setUser] = useState(searchParams.get("user") || "");

  // Update state when search params change (e.g. going back)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setPlace(searchParams.get("place") || "");
    setUser(searchParams.get("user") || "");
  }, [searchParams]);

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
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row w-full md:w-auto gap-2">
      <button type="button" onClick={clearFilters} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex items-center justify-center">
        إعادة ضبط
      </button>
      <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
        تطبيق الفلاتر
      </button>
      <div className="relative flex-1 md:w-32">
        <select
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">كل الأماكن</option>
          {places.map(p => (
            <option key={p.id} value={p.id.toString()}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="relative flex-1 md:w-32">
        <select
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
          dir="rtl"
        >
          <option value="">كل المستخدمين</option>
          {users.map(u => (
            <option key={u.id} value={u.id.toString()}>{u.first_name ? `${u.first_name} ${u.last_name}` : u.username}</option>
          ))}
        </select>
      </div>
      <div className="relative flex-1 md:w-64">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-4 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
          placeholder="اسم المركز، المسؤول أو الهاتف..."
          dir="rtl"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </form>
  );
}
