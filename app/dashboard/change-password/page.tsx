"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AlertCircle, Loader2, Lock, CheckCircle2 } from "lucide-react";
import Cookies from "js-cookie";
import { logout } from "@/app/actions/auth";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: ""
  });

  useEffect(() => {
    try {
      const userDataStr = Cookies.get('user_data');
      if (userDataStr) {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        if (userData.user_id) {
          setUserId(userData.user_id);
        }
      }
    } catch (e) {
      console.error('Failed to parse user_data cookie', e);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.password || !formData.passwordConfirm) {
      setError("الرجاء إدخال جميع الحقول");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (!userId) {
      setError("تعذر العثور على بيانات المستخدم الحالي. يرجى تسجيل الدخول مرة أخرى.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.patch(`/users/${userId}/`, { 
        password: formData.password,
        password2: formData.passwordConfirm
      });
      
      if (response.data?.success || response.status === 200 || response.status === 204) {
        setSuccess(true);
        // Logout and redirect after a short delay
        setTimeout(async () => {
          await logout();
          window.location.href = "/";
        }, 2000);
      } else {
        setError(response.data?.message || "حدث خطأ أثناء تغيير كلمة المرور");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">تغيير كلمة المرور</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            يرجى إدخال كلمة المرور الجديدة وتأكيدها. سيتم تسجيل خروجك بعد التغيير.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2" dir="rtl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2" dir="rtl">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">تم تغيير كلمة المرور بنجاح! سيتم توجيهك لتسجيل الدخول...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading || success}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
            <input 
              type="password" 
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              disabled={isLoading || success}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || success}
            className="w-full bg-[#0f172a] hover:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "حفظ كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
