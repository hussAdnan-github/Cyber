import { api } from "@/lib/api";
import { Building2, Users, Plane, ShieldAlert } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  let hotelsCount = 0;
  let guestsCount = 0;
  let travelersCount = 0;
  let blacklistCount = 0;

  try {
    const [hotelsRes, guestsRes, travelersRes, blacklistRes] = await Promise.all([
      api.get('/hotal/hotel/'),
      api.get('/hotal/person/'),
      api.get('/office_travel/traveler/'),
      api.get('/office_security/blacklist/')
    ]);

    if (hotelsRes.data?.success) hotelsCount = hotelsRes.data.data.count || 0;
    if (guestsRes.data?.success) guestsCount = guestsRes.data.data.count || 0;
    if (travelersRes.data?.success) travelersCount = travelersRes.data.data.count || 0;
    if (blacklistRes.data?.success) blacklistCount = blacklistRes.data.data.count || 0;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }

  const stats = [
    { 
      title: "إجمالي الفنادق", 
      value: hotelsCount.toString(), 
      // trend: "+0 هذا الشهر",
      icon: <Building2 className="w-8 h-8 text-blue-500 mb-4" />
    },
    { 
      title: "النزلاء الحاليين", 
      value: guestsCount.toString(), 
      // trend: "+0 هذا الشهر",
      icon: <Users className="w-8 h-8 text-green-500 mb-4" />
    },
    { 
      title: "المسافرون", 
      value: travelersCount.toString(), 
      // trend: "+0 هذا الشهر",
      icon: <Plane className="w-8 h-8 text-purple-500 mb-4" />
    },
    { 
      title: "القائمة السوداء", 
      value: blacklistCount.toString(), 
      // trend: "+0 هذا الشهر",
      icon: <ShieldAlert className="w-8 h-8 text-red-500 mb-4" />
    },
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="bg-[#f8f9fa] p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">لوحة التحكم الرئيسية</h2>
          <span className="text-sm text-gray-500">{currentDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer">
              {stat.icon}
              <h3 className="text-gray-500 text-sm mb-3">{stat.title}</h3>
              <span className="text-4xl font-bold text-gray-900 mb-3">{stat.value}</span>
              {/* <span className="text-xs text-success font-bold">{stat.trend}</span> */}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 border-r-4 border-danger rounded-l-lg p-5 my-6">
        <h3 className="text-danger font-bold text-lg">تنبيهات أمنية</h3>
      </div>

      {/* <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 min-h-[300px]">
        <h3 className="text-xl font-bold text-gray-800 mb-6">الإحصائيات الشهرية</h3>
        <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
           مخطط الإحصائيات (Chart Placeholder)
        </div>
      </div> */}
    </div>
  );
}
