"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";

export default function NationalitiesFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="flex w-full md:w-auto gap-2">
      <Link href="/dashboard/security/nationalities" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex items-center justify-center">
          إعادة ضبط
      </Link>
      <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
          بحث
      </button>
      <div className="relative flex-1 md:w-80">
          <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
              placeholder="بحث باسم الجنسية أو المرجع"
              dir="rtl"
          />
      </div>
    </form>
  );
}
