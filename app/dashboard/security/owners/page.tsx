import { Plus, Search, Eye, Edit, Trash2, Users, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Owner, Nationality } from "@/types/security";
import DeleteButton from "@/components/DeleteButton";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import OwnersFilters from "@/components/security/OwnersFilters";
import { Suspense } from "react";
import Can from "@/components/auth/Can";

export const dynamic = 'force-dynamic';

export default async function OwnersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const nationality = typeof params.nationality === 'string' ? params.nationality : '';
    const type_id = typeof params.type_id === 'string' ? params.type_id : '';
    const phone = typeof params.phone === 'string' ? params.phone : '';

    let owners: Owner[] = [];
    let nationalitiesList: Nationality[] = [];
    let totalOwners = 0;
    let errorMessage = "";

    try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (nationality) query.set('nationality', nationality);
        if (type_id) query.set('type_id', type_id);
        if (phone) query.set('phone', phone);
        const queryString = query.toString() ? `?${query.toString()}` : '';

        const [response, natRes] = await Promise.all([
            api.get<ApiResponse<Owner>>(`/office_security/onwer/${queryString}`),
            api.get<ApiResponse<Nationality>>('/office_security/nationality/')
        ]);

        if (response.data.success) {
            owners = response.data.data.results;
            totalOwners = response.data.data.count;
        } else {
            errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
        }

        if (natRes.data.success) {
            nationalitiesList = natRes.data.data.results;
        }
    } catch (error: any) {
        console.error("Failed to fetch owners:", error);
        errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="قائمة الملاك"
                description="إدارة ومتابعة بيانات ملاك المنشآت والوحدات في النظام."
                addLink="/dashboard/security/owners/add"
                addLabel="إضافة مالك جديد"
                breadcrumbs={[{ label: "الأمان", href: "/dashboard/security" }, { label: "الملاك", active: true }]}
                can="add_onwer"
            />

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{errorMessage}</p>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <Suspense fallback={<div className="h-16 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
                        <OwnersFilters nationalities={nationalitiesList} />
                    </Suspense>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 bg-white">
                                <th className="py-4 px-6 font-medium text-right">اسم المالك</th>
                                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                                <th className="py-4 px-6 font-medium text-center">نوع الهوية</th>
                                <th className="py-4 px-6 font-medium text-center">رقم الهوية</th>
                                <th className="py-4 px-6 font-medium text-center">رقم الجوال</th>
                                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3 justify-end">
                                            <div className="font-bold text-gray-800 text-sm text-right">{item.name}</div>
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-blue-100">
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{item.name_nationality}</td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{item.type_id === 1 ? "بطاقة الهوية" : "جواز سفر"}</td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{item.number_id}</td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{item.phone}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-100">نشط</span>
                                    </td>
                                    <td className="py-4 px-6 text-left">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={`/dashboard/security/owners/details/${item.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Can permission="change_onwer">
                                                <Link href={`/dashboard/security/owners/${item.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Can>
                                            <Can permission="delete_onwer">
                                                <DeleteButton endpoint="/office_security/onwer/" id={item.id} permission="delete_onwer" />
                                            </Can>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {owners.length === 0 && !errorMessage && (
                                <EmptyState message="لا يوجد ملاك לעرضهم" colSpan={7} />
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
                    <div className="flex gap-1">
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-primary bg-primary text-white font-bold">1</button>
                    </div>
                    <div>إجمالي النتائج: {totalOwners}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <StatCard 
                    title="إجمالي الملاك"
                    value={totalOwners}
                    valueClassName="text-primary"
                />
                <StatCard 
                    title="النتائج الحالية"
                    value={totalOwners}
                    valueClassName="text-success"
                />
                <StatCard 
                    title="تنبيهات الوثائق"
                    value="0"
                    valueClassName="text-danger"
                />
            </div>
        </div>
    );
}

