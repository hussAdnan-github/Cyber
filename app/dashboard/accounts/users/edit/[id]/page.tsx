"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    groups_ids: [] as number[],
    user_permissions_ids: [] as number[]
  });

  const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
  const [permissions, setPermissions] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [groupsRes, permsRes, userRes] = await Promise.all([
          api.get('/group/'),
          api.get('/permission/?pagination=false'),
          api.get(`/users/${params.id}/`)
        ]);
        
        if (groupsRes.data?.data?.results) {
          setGroups(groupsRes.data.data.results);
        } else if (Array.isArray(groupsRes.data)) {
          setGroups(groupsRes.data);
        }

        if (permsRes.data?.data?.results) {
          setPermissions(permsRes.data.data.results);
        } else if (Array.isArray(permsRes.data)) {
          setPermissions(permsRes.data);
        } else if (permsRes.data?.data) {
          setPermissions(permsRes.data.data);
        }

        // Pre-fill user data
        const userData = userRes.data?.data || userRes.data;
        if (userData) {
          setFormData({
            username: userData.username || "",
            email: userData.email || "",
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            password: "",
            password2: "",
            is_active: userData.is_active || false,
            is_staff: userData.is_staff || false,
            is_superuser: userData.is_superuser || false,
            groups_ids: Array.isArray(userData.groups) ? userData.groups.map((g: any) => g.id || g) : [],
            user_permissions_ids: Array.isArray(userData.user_permissions) ? userData.user_permissions.map((p: any) => p.id || p) : []
          });
        }
      } catch (err) {
        console.error("Error fetching data", err);
        setError("فشل جلب بيانات المستخدم أو الصلاحيات.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchOptions();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'groups_ids' | 'user_permissions_ids') => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password && formData.password !== formData.password2) {
      setError("كلمتا المرور غير متطابقتين");
      setIsLoading(false);
      return;
    }

    // Build payload. Omit passwords if empty to avoid changing it
    const payload: any = { ...formData };
    if (!payload.password) {
      delete payload.password;
      delete payload.password2;
    }

    try {
      // Typically update is PUT or PATCH
      const response = await api.patch(`/users/${params.id}/`, payload);
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.push("/dashboard/accounts/users");
        router.refresh();
      } else {
        setError(response.data?.message || "حدث خطأ أثناء تعديل المستخدم");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "حدث خطأ أثناء تعديل المستخدم");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/accounts/users" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">تعديل المستخدم</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-right mb-8 border-b border-gray-100 pb-6">
          <h3 className="text-xl font-bold text-gray-800">تعديل بيانات المستخدم</h3>
          <p className="text-sm text-gray-500 mt-1">تحديث بيانات وصلاحيات حساب المستخدم</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">اسم المستخدم</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-blue-50/50"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">عنوان بريد إلكتروني</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">الاسم الأول</label>
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">الاسم الأخير</label>
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">كلمة المرور (اتركه فارغاً إذا لم ترد التغيير)</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">الحالة والصلاحيات</h4>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                />
                <span className="text-sm font-bold text-gray-700">نشط (يحدد ما إذا كان المستخدم سيعامل على أنه نشط أزل تحديد هذا الحقل بدلاً من حذف الحسابات)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                />
                <span className="text-sm font-bold text-gray-700">حالة النطاق (يحدد ما إذا كان يمكن للمستخدم الدخول إلى موقع الإدارة هذا)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_superuser"
                  checked={formData.is_superuser}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                />
                <span className="text-sm font-bold text-gray-700">حالة المستخدم الخارق (يقضي بأن هذا المستخدم يمتلك كافة الصلاحيات دون الحاجة لمنحها له تصريحاً)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Groups ids</label>
                <select 
                  multiple 
                  name="groups_ids"
                  value={formData.groups_ids.map(String)}
                  onChange={(e) => handleMultiSelect(e, 'groups_ids')}
                  className="w-full h-40 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id} className="py-1">{g.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">اضغط مع الاستمرار على مفتاح Control أو Command لتحديد أكثر من خيار.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">user_permissions ids</label>
                <select 
                  multiple 
                  name="user_permissions_ids"
                  value={formData.user_permissions_ids.map(String)}
                  onChange={(e) => handleMultiSelect(e, 'user_permissions_ids')}
                  className="w-full h-60 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-left"
                  dir="ltr"
                >
                  {permissions.map(p => (
                    <option key={p.id} value={p.id} className="py-1">{p.name}</option>
                  ))}
                </select>
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
              تحديث المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
