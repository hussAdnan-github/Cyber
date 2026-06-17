import { Plus, Search, Eye, Edit, Trash2, Globe2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Nationality } from "@/types/security";
import DeleteButton from "@/components/DeleteButton";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import NationalitiesFilters from "@/components/security/NationalitiesFilters";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function NationalitiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';

    let nationalities: Nationality[] = [];
    let totalNationalities = 0;
    let errorMessage = "";

    try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        const queryString = query.toString() ? `?${query.toString()}` : '';

        const response = await api.get<ApiResponse<Nationality>>(`/office_security/nationality/${queryString}`);
        if (response.data.success) {
            nationalities = response.data.data.results;
            totalNationalities = response.data.data.count;
        } else {
            errorMessage = response.data.message || "فشل جلب البيانات من الخادم";
        }
    } catch (error: any) {
        console.error("Failed to fetch nationalities:", error);
        errorMessage = error?.message || "حدث خطأ أثناء الاتصال بالخادم";
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title="إدارة الجنسيات"
                description="عرض وإدارة الجنسيات المعرفة داخل النظام للتعامل."
                addLink="/dashboard/security/nationalities/add"
                addLabel="إضافة جنسية"
                breadcrumbs={[{ label: "الأساسية", href: "/dashboard" }, { label: "الجنسيات", active: true }]}
            />

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{errorMessage}</p>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
                {/* Search */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                    <Suspense fallback={<div className="h-10 animate-pulse bg-gray-100 rounded-lg w-full"></div>}>
                        <NationalitiesFilters />
                    </Suspense>
                    <div className="text-xs font-bold text-gray-600">
                        إجمالي النتائج: {totalNationalities} جنسية
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs text-gray-500 bg-gray-50/50">
                                <th className="py-4 px-6 font-medium text-right">المرجع</th>
                                <th className="py-4 px-6 font-medium text-center">الجنسية</th>
                                <th className="py-4 px-6 font-medium text-center">تاريخ الإضافة</th>
                                <th className="py-4 px-6 font-medium text-center">الحالة</th>
                                <th className="py-4 px-6 font-medium text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nationalities.map((nat) => (
                                <tr key={nat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="text-right">
                                            <div className="font-bold text-gray-800 text-sm">NAT-{nat.id}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="font-bold text-gray-800 text-sm bg-gray-100 px-3 py-1 rounded-md">{nat.name}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-gray-600">{new Date(nat.crated_at).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="bg-green-50 text-success px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                            نشط
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-left">
                                        <div className="flex gap-2 justify-end">
                                            <Link href={`/dashboard/security/nationalities/details/${nat.id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link href={`/dashboard/security/nationalities/${nat.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton endpoint="/office_security/nationality/" id={nat.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {nationalities.length === 0 && !errorMessage && (
                                <EmptyState message="لا توجد جنسيات לעرضها" colSpan={5} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
