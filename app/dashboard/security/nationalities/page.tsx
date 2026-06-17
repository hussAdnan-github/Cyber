import { Plus, Search, Eye, Edit, Trash2, Globe2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Nationality } from "@/types/security";
import DeleteButton from "@/components/DeleteButton";

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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="text-right flex items-center gap-2">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                            <span className="text-primary font-bold">الجنسيات</span>
                            <span>&lt;</span>
                            <span>الأساسية</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">إدارة الجنسيات</h2>
                        <p className="text-gray-500 text-sm">عرض وإدارة الجنسيات المعرفة داخل النظام للتعامل.</p>
                    </div>
                </div>
                <Link href="/dashboard/security/nationalities/add" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
                    إضافة جنسية
                    <Plus className="w-4 h-4 ml-2" />
                </Link>
            </div>

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
                    <form className="flex w-full md:w-auto gap-2" method="GET">
                        <button type="submit" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shrink-0">
                            بحث
                        </button>
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right"
                                placeholder="بحث باسم الجنسية أو المرجع"
                                dir="rtl"
                            />
                        </div>
                    </form>
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
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        لا توجد جنسيات לעرضها
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
