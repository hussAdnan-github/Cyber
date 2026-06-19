"use client";

import { Edit, Trash2, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Can from "../auth/Can";

interface RoleActionsProps {
  roleId: number;
}

export default function RoleActions({ roleId }: RoleActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الدور؟")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete(`/group/${roleId}/`);
      if (response.data?.success || response.status === 200 || response.status === 204) {
        router.refresh(); // Refresh the server component
      } else {
        alert(response.data?.message || "فشل حذف الدور");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || error.response?.data?.error || "حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/dashboard/accounts/roles/details/${roleId}`}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors"
        title="عرض التفاصيل"
      >
        <Eye className="w-4 h-4" />
      </Link>

      <Can permission="change_permission">
        <Link
          href={`/dashboard/accounts/roles/edit/${roleId}`}
          className="p-2 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-100 transition-colors"
          title="تعديل"
        >
          <Edit className="w-4 h-4" />
        </Link>
      </Can>
      <Can permission="delete_permission">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-red-600 hover:bg-red-50 rounded-md border border-red-100 transition-colors disabled:opacity-50"
          title="حذف"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </Can>

    </div>
  );
}
