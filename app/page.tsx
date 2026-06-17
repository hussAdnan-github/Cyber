"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A192F]">
      {/* Background decorations to mimic the network image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020d20] via-[#092248] to-[#04132a]"></div>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -top-1/4 -right-1/4"></div>
      <div className="absolute w-[600px] h-[600px] bg-[#00f2fe]/10 rounded-full blur-[100px] -bottom-1/4 -left-1/4"></div>

      <div className="glass-panel relative z-10 w-full max-w-[420px] p-10 rounded-2xl shadow-2xl mx-4 border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">تسجيل الدخول</h1>
          <p className="text-blue-100/70 text-sm">مرحباً بك مجدداً! يرجى تسجيل الدخول إلى حسابك.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white block">اسم المستخدم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/50" />
              </div>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="أدخل اسم المستخدم"
                required
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
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-4">
            <a href="#" className="text-blue-300 hover:text-white transition-colors">نسيت كلمة المرور؟</a>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-white/80 group-hover:text-white transition-colors">تذكرني</span>
              <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 w-4 h-4 cursor-pointer" />
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] mt-6"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
