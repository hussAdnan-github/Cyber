import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/30 animate-pulse"></div>
        {/* Inner spinner */}
        <div className="relative bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-sm shadow-xl">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">جاري تحميل البيانات</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">يرجى الانتظار لحظات بينما نقوم بجلب أحدث المعلومات...</p>
      </div>

      {/* Skeleton placeholders to make it look like content is coming */}
      <div className="w-full max-w-2xl mt-8 space-y-3 opacity-50">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse mx-auto"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2 animate-pulse mx-auto"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6 animate-pulse mx-auto"></div>
      </div>
    </div>
  );
}
