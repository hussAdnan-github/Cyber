import { Plus, Search, Eye, Edit, Trash2, Users, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Owner, Nationality } from "@/types/security";
import DeleteButton from "@/components/DeleteButton";

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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-primary mb-1">قائمة الملاك</h2>
                    <p className="text-gray-500 text-sm">إدارة ومتابعة بيانات ملاك المنشآت والوحدات في النظام.</p>
                </div>
                <Link href="/dashboard/security/owners/add" className="bg-[#0f172a] hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center text-sm font-bold transition-colors shadow-sm w-full md:w-auto justify-center">
                    إضافة مالك جديد
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" method="GET">
                        <div className="space-y-2 text-right">
                            <label className="text-xs font-bold text-gray-700">البحث بالاسم</label>
                            <input
                                type="text"
                                name="search"
                                defaultValue={search}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
                                placeholder="أدخل اسم المالك..."
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2 text-right">
                            <label className="text-xs font-bold text-gray-700">رقم الجوال</label>
                            <input
                                type="text"
                                name="phone"
                                defaultValue={phone}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right placeholder-gray-400"
                                placeholder="رقم الجوال..."
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2 text-right">
                            <label className="text-xs font-bold text-gray-700">الجنسية</label>
                            <select
                                name="nationality"
                                defaultValue={nationality}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                                dir="rtl"
                            >
                                <option value="">كل الجنسيات</option>
                                {nationalitiesList.map(n => (
                                    <option key={n.id} value={n.id.toString()}>{n.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2 text-right">
                            <label className="text-xs font-bold text-gray-700">نوع الهوية</label>
                            <select
                                name="type_id"
                                defaultValue={type_id}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary text-right bg-white"
                                dir="rtl"
                            >
                                <option value="">الكل</option>
                                <option value="1">بطاقة الهوية</option>
                                <option value="2">جواز سفر</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mb-0.5">
                            <button type="submit" className="bg-blue-50 text-primary border border-blue-100 hover:bg-blue-100 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full flex-1">
                                تطبيق الفلترة
                            </button>
                            <Link href="/dashboard/security/owners" className="text-gray-500 hover:text-gray-700 px-4 py-2.5 text-sm font-bold transition-colors shrink-0 flex items-center justify-center">
                                مسح
                            </Link>
                        </div>
                    </form>
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
                                            <Link href={`/dashboard/security/owners/${item.id}`} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <DeleteButton endpoint="/office_security/onwer/" id={item.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {owners.length === 0 && !errorMessage && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        لا يوجد ملاك לעرضهم
                                    </td>
                                </tr>
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

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
                    <h3 className="text-gray-500 text-sm mb-2 text-right">إجمالي الملاك</h3>
                    <span className="text-3xl font-bold text-primary">{totalOwners}</span>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
                    <h3 className="text-gray-500 text-sm mb-2 text-right">النتائج الحالية</h3>
                    <span className="text-3xl font-bold text-success">{totalOwners}</span>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex flex-col items-end justify-center">
                    <h3 className="text-gray-500 text-sm mb-2 text-right">تنبيهات الوثائق</h3>
                    <span className="text-3xl font-bold text-danger">0</span>
                </div>
            </div>
        </div>
    );
}
