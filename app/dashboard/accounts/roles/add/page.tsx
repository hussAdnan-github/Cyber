"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import PermissionsMatrix, { Permission } from "@/components/accounts/PermissionsMatrix";

export default function AddRolePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    permissions_ids: [] as number[]
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await api.get('/permission/?pagination=false');
        if (res.data?.data?.results) {
          setPermissions(res.data.data.results);
        } else if (Array.isArray(res.data)) {
          setPermissions(res.data);
        } else if (res.data?.data) {
          setPermissions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching permissions", err);
      }
    };
    fetchPermissions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handlePermissionsChange = (selectedIds: number[]) => {
    setFormData(prev => ({ ...prev, permissions_ids: selectedIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("الرجاء إدخال اسم الدور");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/group/', formData);
      if (response.data?.success || response.status === 201) {
        router.push("/dashboard/accounts/roles");
        router.refresh();
      } else {
        setError(response.data?.message || "حدث خطأ أثناء إضافة الدور");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "حدث خطأ أثناء إضافة الدور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/accounts/roles" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">إضافة دور</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-right mb-8 border-b border-gray-100 pb-6">
          <h3 className="text-xl font-bold text-gray-800">إضافة دور جديد</h3>
          <p className="text-sm text-gray-500 mt-1">قم بتسمية الدور وتحديد صلاحياته</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-right" dir="rtl">
          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">البيانات الأساسية</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">اسم الدور</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-blue-50/50"
                  placeholder="مثال: مدير نظام"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">مصفوفة الصلاحيات</h4>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <PermissionsMatrix 
                  permissions={permissions}
                  selectedIds={formData.permissions_ids}
                  onChange={handlePermissionsChange}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100 justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              إضافة الدور
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
