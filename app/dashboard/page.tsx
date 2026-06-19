import { api } from "@/lib/api";
import { Building2, Users, Plane, ShieldAlert } from "lucide-react";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const cookieStore = await cookies();
  const userDataStr = cookieStore.get("user_data")?.value;
  
  let permissions: string[] = [];
  let isSuperuser = false;

  if (userDataStr) {
    try {
      // Decode if it's URI encoded, otherwise just parse
      const decodedStr = userDataStr.startsWith('%') ? decodeURIComponent(userDataStr) : userDataStr;
      const userData = JSON.parse(decodedStr);
      permissions = userData.permissions || [];
      isSuperuser = userData.is_superuser || false;
    } catch (e) {
      console.error("Failed to parse user_data on server", e);
    }
  } 

  const hasPermission = (codename: string) => isSuperuser || permissions.includes(codename);

  let hotelsCount = 0;
  let guestsCount = 0;
  let travelersCount = 0;
  let blacklistCount = 0;

  const promises = [];

  if (hasPermission('view_hotel')) {
    promises.push(api.get('/hotal/hotel/').then(res => { if(res.data?.success) hotelsCount = res.data.data.count || 0; }).catch(() => {}));
  }
  if (hasPermission('view_person')) {
    promises.push(api.get('/hotal/person/').then(res => { if(res.data?.success) guestsCount = res.data.data.count || 0; }).catch(() => {}));
  }
  if (hasPermission('view_traveler')) {
    promises.push(api.get('/office_travel/traveler/').then(res => { if(res.data?.success) travelersCount = res.data.data.count || 0; }).catch(() => {}));
  }
  if (hasPermission('view_blacklist')) {
    promises.push(api.get('/office_security/blacklist/').then(res => { if(res.data?.success) blacklistCount = res.data.data.count || 0; }).catch(() => {}));
  }

  await Promise.all(promises);

  const stats = [];

  if (hasPermission('view_hotel')) {
    stats.push({ 
      title: "إجمالي الفنادق", 
      value: hotelsCount.toString(), 
      icon: <Building2 className="w-8 h-8 text-blue-500 mb-4" />
    });
  }

  if (hasPermission('view_person')) {
    stats.push({ 
      title: "النزلاء الحاليين", 
      value: guestsCount.toString(), 
      icon: <Users className="w-8 h-8 text-green-500 mb-4" />
    });
  }

  if (hasPermission('view_traveler')) {
    stats.push({ 
      title: "المسافرون", 
      value: travelersCount.toString(), 
      icon: <Plane className="w-8 h-8 text-purple-500 mb-4" />
    });
  }

  if (hasPermission('view_blacklist')) {
    stats.push({ 
      title: "القائمة السوداء", 
      value: blacklistCount.toString(), 
      icon: <ShieldAlert className="w-8 h-8 text-red-500 mb-4" />
    });
  }

  const currentDate = new Date().toLocaleString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#f8f9fa] p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">لوحة التحكم الرئيسية</h2>
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">{currentDate}</span>
        </div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 cursor-pointer hover:shadow-md hover:border-blue-100">
                {stat.icon}
                <h3 className="text-gray-500 text-sm mb-3 font-bold">{stat.title}</h3>
                <span className="text-4xl font-black text-gray-800 mb-2">{stat.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-100 text-gray-500">
            لا توجد إحصائيات لعرضها حالياً بناءً على صلاحياتك.
          </div>
        )}
      </div>

      {hasPermission('view_blacklist') && (
        <div className="bg-red-50 border-r-4 border-red-500 rounded-l-lg p-5 my-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h3 className="text-red-700 font-bold text-lg">تنبيهات أمنية (القائمة السوداء)</h3>
          </div>
          <span className="bg-red-100 text-red-700 px-3 py-1 font-bold rounded-full text-sm">
            {blacklistCount} أشخاص
          </span>
        </div>
      )}
    </div>
  );
}
