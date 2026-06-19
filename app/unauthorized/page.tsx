"use client";

import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A192F]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020d20] via-[#092248] to-[#04132a]"></div>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[120px] -top-1/4 -right-1/4"></div>
      <div className="absolute w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -bottom-1/4 -left-1/4"></div>

      <div className="glass-panel relative z-10 w-full max-w-lg p-12 rounded-3xl shadow-2xl mx-4 border border-white/10 text-center">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <ShieldAlert className="w-12 h-12 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">403</h1>
        <h2 className="text-2xl font-bold text-white mb-4">غير مصرح لك بالوصول</h2>
        
        <p className="text-blue-100/70 text-base mb-10 leading-relaxed" dir="rtl">
          نأسف، يبدو أنك لا تملك الصلاحيات الكافية لعرض هذه الصفحة أو تنفيذ هذا الإجراء. يرجى التواصل مع مسؤول النظام إذا كنت تعتقد أن هذا خطأ.
        </p>

        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
