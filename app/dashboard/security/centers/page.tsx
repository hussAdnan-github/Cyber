import { Plus, Search, Eye, Edit, Trash2, Building2, MapPin, AlertCircle, Building, TriangleAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Place, Center } from "@/types/security";
import { User } from "@/types/user";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function CentersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const place = typeof params.place === 'string' ? params.place : '';
    const user = typeof params.user === 'string' ? params.user : '';

    let centers: Center[] = [];
    let placesList: Place[] = [];
    let usersList: User[] = [];
    let totalCenters = 0;
    let errorMessage = "";

    try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (place) query.set('place', place);
        if (user) query.set('user', user);
        const queryString = query.toString() ? `?${query.toString()}` : '';

        const [response, placesRes, usersRes] = await Promise.all([
            api.get<ApiResponse<Center>>(`/office_security/center/${queryString}`),
            api.get<ApiResponse<Place>>('/office_security/places/'),
            api.get<ApiResponse<User>>('/users/')
        ]);

        if (response.data.success) {
            centers = response.data.data.results;
            totalCenters = response.data.data.count;
        } else {
            errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
        }

        if (placesRes.data.success) {
            placesList = placesRes.data.data.results;
        }
        if (usersRes.data.success) {
            usersList = usersRes.data.data.results;
        }
    } catch (error: any) {
        console.error("Failed to fetch centers:", error);
        errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">إدارة المراكز الأمنية</h2>
                    <p className="text-gray-500 text-sm">عرض وإدارة كافة المراكز المسجلة في النظام وتوزيعها الجغرافي.</p>
                </div>
                <Link href="/dashboard/security/centers/add" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
                    إضافة مركز جديد
                    <Plus className="w-4 h-4 ml-2" />
                </Link>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{errorMessage}</p>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div className="text-right w-full">
                        <div className="flex justify-between items-start w-full mb-4">
                            <span className="text-success text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">+12%</span>
                            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                                <Building className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs mb-1">إجمالي المراكز</h3>
                        <span className="text-2xl font-bold text-gray-900">{totalCenters}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div className="text-right w-full">
                        <div className="flex justify-end items-start w-full mb-4">
                            <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-success" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs mb-1">مراكز نشطة</h3>
                        <span className="text-2xl font-bold text-gray-900">{totalCenters}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-start">
                    <div className="text-right w-full">
                        <div className="flex justify-end items-start w-full mb-4">
                            <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs mb-1">المناطق المغطاة</h3>
                        <span className="text-2xl font-bold text-gray-900">—</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex justify-between items-start border-l-4 border-l-danger">
                    <div className="text-right w-full">
                        <div className="flex justify-end items-start w-full mb-4">
                            <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center">
                                <TriangleAlert className="w-4 h-4 text-danger" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs mb-1">تنبيهات أمنية</h3>
                        <span className="text-2xl font-bold text-gray-900">0</span>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <form className="flex w-full md:w-auto gap-2" method="GET">
                        <Link href="/dashboard/security/centers" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0 flex items-center justify-center">
                            إعادة ضبط
                        </Link>
                        <button type="submit" className="bg-[#0f172a] hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
                            تطبيق الفلاتر
                        </button>
                        <div className="relative flex-1 md:w-32">
                            <select
                                name="place"
                                defaultValue={place}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                                dir="rtl"
                            >
                                <option value="">كل الأماكن</option>
                                {placesList.map(p => (
                                    <option key={p.id} value={p.id.toString()}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative flex-1 md:w-32">
                            <select
                                name="user"
                                defaultValue={user}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                                dir="rtl"
                            >
                                <option value="">كل المستخدمين</option>
                                {usersList.map(u => (
                                    <option key={u.id} value={u.id.toString()}>{u.first_name ? `${u.first_name} ${u.last_name}` : u.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                className="w-full pr-4 pl-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                                placeholder="اسم المركز، المسؤول أو الهاتف..."
                                dir="rtl"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                                <th className="py-4 px-6 font-medium text-right">اسم المركز</th>
                                <th className="py-4 px-6 font-medium text-center">المكان التابع له</th>
                                <th className="py-4 px-6 font-medium text-center">المستخدم المسؤول</th>
                                <th className="py-4 px-6 font-medium text-center">رقم الهاتف الأساسي</th>
                                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {centers.map((center) => (
                                <tr key={center.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3 justify-end">
                                            <div className="text-right">
                                                <div className="font-bold text-gray-800 text-sm">{center.name}</div>
                                                <div className="text-[10px] text-gray-400">ID: CTR-{center.id}</div>
                                            </div>
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                                <Building className="w-5 h-5 text-blue-500" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{center.name_place}</td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{center.name_user}</td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{center.phone}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-100">نشط</span>
                                    </td>
                                    <td className="py-4 px-6 text-left">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={`/dashboard/security/centers/details/${center.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/dashboard/security/centers/${center.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton endpoint="/office_security/center/" id={center.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {centers.length === 0 && !errorMessage && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        لا توجد مراكز לעرضها
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
                    <div>إجمالي النتائج: {totalCenters} مركز</div>
                    <div className="flex gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-[#0f172a] bg-[#0f172a] text-white font-bold">1</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
