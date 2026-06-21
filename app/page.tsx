"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthCookies } from "@/app/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post('/login/', { username, password });
      
      if (response.data?.success && response.data?.data?.token) {
        const { token, ...userData } = response.data.data;
        
        // Save token and user data in secure cookies via server action
        await setAuthCookies(token, userData);
        
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(response.data?.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      // Try to extract a specific error message if the backend provides one
      const errMessage = err.response?.data?.message || err.response?.data?.error || "حدث خطأ أثناء محاولة تسجيل الدخول. يرجى التحقق من بياناتك.";
      setError(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A192F]"
      style={{
        backgroundImage: "url('/b_login.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay to ensure form readability over the background image */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="glass-panel relative z-10 w-full max-w-[420px] p-10 rounded-2xl shadow-2xl mx-4 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">تسجيل الدخول</h1>
          <p className="text-blue-100/70 text-sm">مرحباً بك مجدداً! يرجى تسجيل الدخول إلى حسابك.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm text-center font-bold" dir="rtl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">اسم المستخدم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/50" />
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="أدخل اسم المستخدم"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/50" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="أدخل كلمة المرور"
                required
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/50 hover:text-white transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* <div className="flex items-center justify-between text-sm mt-4">
            <a href="#" className="text-blue-300 hover:text-white transition-colors">نسيت كلمة المرور؟</a>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-white/80 group-hover:text-white transition-colors">تذكرني</span>
              <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 w-4 h-4 cursor-pointer" />
            </label>
          </div> */}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
