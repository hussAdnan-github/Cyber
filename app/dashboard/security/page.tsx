import { MapPin, Building, Users, ShieldAlert, FileText, Plus, TriangleAlert, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function SecurityDashboardPage() {
  let placesCount = 0;
  let centersCount = 0;
  let ownersCount = 0;
  let blacklistCount = 0;
  let documentsCount = 0;
  let recentBlacklist: any[] = [];
  let errorMessage = "";

  try {
    const [placesRes, centersRes, ownersRes, blacklistRes, documentsRes] = await Promise.all([
      api.get('/office_security/places/'),
      api.get('/office_security/center/'),
      api.get('/office_security/owners/'),
      api.get('/office_security/black_list/'),
      api.get('/office_security/documents/')
    ]);

    if (placesRes.data?.success) placesCount = placesRes.data.data.count || 0;
    if (centersRes.data?.success) centersCount = centersRes.data.data.count || 0;
    if (ownersRes.data?.success) ownersCount = ownersRes.data.data.count || 0;
    if (blacklistRes.data?.success) {
      blacklistCount = blacklistRes.data.data.count || 0;
      recentBlacklist = blacklistRes.data.data.results?.slice(0, 5) || [];
    }
    if (documentsRes.data?.success) documentsCount = documentsRes.data.data.count || 0;
  } catch (error: any) {
    console.error("Error fetching security dashboard data:", error);
    errorMessage = "فشل في جلب الإحصائيات من الخادم";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">نظرة عامة على الجهات الأمنية</h2>
          <p className="text-gray-500 text-sm">مزامنة البيانات الحية من الخادم</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard/security/blacklist/add" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
            إضافة للقائمة السوداء
            <TriangleAlert className="w-4 h-4 ml-2 text-danger" />
          </Link>
          <Link href="/dashboard/security/centers/add" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
            إضافة مركز جديد
            <Plus className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2 justify-end">
          <span>{errorMessage}</span>
          <AlertCircle className="w-4 h-4" />
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">الأماكن</h3>
            <span className="text-2xl font-bold text-gray-900">{placesCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">المراكز</h3>
            <span className="text-2xl font-bold text-gray-900">{centersCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">الملاك</h3>
            <span className="text-2xl font-bold text-gray-900">{ownersCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">القائمة السوداء</h3>
            <span className="text-2xl font-bold text-gray-900">{blacklistCount}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-center text-right flex-row-reverse">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-gray-500 text-xs mb-1">المستندات</h3>
            <span className="text-2xl font-bold text-gray-900">{documentsCount}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Right Column - Widgets */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 order-2 lg:order-1">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm text-right">
            <h3 className="font-bold text-gray-800 mb-4">اختصارات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/security/centers/add" className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors">
                <Building className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">إضافة مركز</span>
              </Link>
              <Link href="/dashboard/security/places/add" className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">إضافة مكان</span>
              </Link>
              <Link href="/dashboard/security/blacklist" className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors">
                <ShieldAlert className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">القائمة السوداء</span>
              </Link>
              <Link href="/dashboard/security/documents" className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">المستندات</span>
              </Link>
            </div>
          </div>

          {/* System Status Dark Card */}
          <div className="bg-[#0f172a] rounded-lg border border-gray-800 shadow-md p-6 text-white text-right relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full border-2 border-success flex items-center justify-center text-success font-bold text-sm shrink-0">
                100%
              </div>
              <h3 className="font-bold text-lg">حالة النظام الكلية</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
              بيانات الجهات الأمنية والمراكز متاحة وتعمل بدون أخطاء ظاهرة.
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-lg text-sm transition-colors border border-white/10 relative z-10">
              مستقر
            </button>
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          </div>

          {/* Recent Blacklist Entries */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm text-right overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <Link href="/dashboard/security/blacklist" className="text-blue-600 text-xs font-bold hover:underline">عرض الكل</Link>
              <h3 className="font-bold text-gray-800">آخر سجلات القائمة السوداء</h3>
            </div>
            <div className="p-4 space-y-3">
              {recentBlacklist.map(item => (
                <div key={item.id} className="bg-red-50 border border-red-100 rounded-lg p-3 text-right">
                  <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                  <div className="text-xs text-danger mt-1">{item.reason || "بدون سبب"}</div>
                </div>
              ))}
              {recentBlacklist.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4">لا توجد سجلات حالياً</div>
              )}
            </div>
          </div>
        </div>

        {/* Left Column - Map Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col order-1 lg:order-2">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <span className="bg-green-50 text-success text-xs font-bold px-3 py-1 rounded-full border border-green-100 flex items-center">
               <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5 animate-pulse"></span>
               مباشر
             </span>
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               التغطية الأمنية الميدانية
               <MapPin className="w-5 h-5 text-primary" />
             </h3>
          </div>
          
          <div className="flex-1 min-h-[400px] relative bg-gray-50 overflow-hidden">
            {/* Map background placeholder */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-5 w-72 text-right">
              <h4 className="font-bold text-gray-800 mb-4">حالة المراكز الحالية</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs font-bold">
                    <span className="text-success">{centersCount} مركز</span>
                    <span className="text-gray-600">المراكز المسجلة</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: centersCount > 0 ? '100%' : '0%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs font-bold">
                    <span className="text-primary">{placesCount} مكان</span>
                    <span className="text-gray-600">الأماكن المغطاة</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: placesCount > 0 ? '100%' : '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
