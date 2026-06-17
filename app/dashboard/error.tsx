"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Premium Error Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
        <div className="relative bg-white/5 border border-red-500/20 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
          <AlertTriangle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center space-y-3 max-w-md mx-auto">
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          عذراً، حدث خطأ غير متوقع!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
          يبدو أن هناك مشكلة أثناء محاولة جلب البيانات أو معالجتها من الخادم. 
          لقد قمنا بتسجيل الخطأ للعمل على إصلاحه.
        </p>
      </div>

      {/* Technical Details (Optional for Dev, hide in prod usually, but good for debugging) */}
      {error.message && (
        <div className="w-full max-w-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 text-right overflow-auto max-h-32">
          <p className="text-xs font-mono text-red-600 dark:text-red-400 dir-ltr text-left">
            {error.message}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-md">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/25 transition-all active:scale-[0.98] group"
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          إعادة المحاولة
        </button>
        
        <Link 
          href="/dashboard"
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98] group"
        >
          العودة للرئيسية
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
