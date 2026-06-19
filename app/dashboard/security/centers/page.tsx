import { Plus, Search, Eye, Edit, Trash2, Building2, MapPin, AlertCircle, Building, TriangleAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Place, Center } from "@/types/security";
import { User } from "@/types/user";
import DeleteButton from "@/components/DeleteButton";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import CentersFilters from "@/components/security/CentersFilters";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

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
            <PageHeader
                title="إدارة المراكز الأمنية"
                description="عرض وإدارة كافة المراكز المسجلة في النظام وتوزيعها الجغرافي."
                addLink="/dashboard/security/centers/add"
                addLabel="إضافة مركز جديد"
                breadcrumbs={[{ label: "الأمان", href: "/dashboard/security" }, { label: "المراكز الأمنية", active: true }]}
                can="add_center"
            />

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{errorMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="إجمالي المراكز"
                    value={totalCenters}
                    icon={<Building className="w-4 h-4 text-blue-500" />}
                    trend={{ value: "+12%", isPositive: true }}
                />
                <StatCard
                    title="مراكز نشطة"
                    value={totalCenters}
                    icon={<CheckCircle2 className="w-4 h-4 text-success" />}
                    iconBgClassName="bg-green-50"
                    iconTextClassName="text-success"
                />
                <StatCard
                    title="المناطق المغطاة"
                    value="—"
                    icon={<MapPin className="w-4 h-4 text-orange-500" />}
                    iconBgClassName="bg-orange-50"
                    iconTextClassName="text-orange-500"
                />
                <StatCard
                    title="تنبيهات أمنية"
                    value="0"
                    icon={<TriangleAlert className="w-4 h-4 text-danger" />}
                    iconBgClassName="bg-red-50"
                    iconTextClassName="text-danger"
                    borderColorClassName="border-l-danger"
                />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
                        <CentersFilters places={placesList} users={usersList} />
                    </Suspense>
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
                                            <Can permission="change_center">
                                                <Link href={`/dashboard/security/centers/${center.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Can>
                                            <Can permission="delete_center">
                                                <DeleteButton endpoint="/office_security/center/" id={center.id} />

                                            </Can>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {centers.length === 0 && !errorMessage && (
                                <EmptyState message="لا توجد مراكز לעرضها" colSpan={6} />
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
